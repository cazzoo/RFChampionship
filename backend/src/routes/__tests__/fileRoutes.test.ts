import request from 'supertest';
import express from 'express';
import fileRoutes from '../fileRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path

// Mock Supabase (DB and Storage)
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    storage: {
      from: jest.fn().mockReturnThis(),
      createSignedUploadUrl: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(), // If used in GET /files
    },
    auth: { getUser: jest.fn() }
  },
}));

jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    if (req.headers['x-test-user-id']) {
      req.user = { 
        id: req.headers['x-test-user-id'], 
        app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
      };
    } else {
      req.user = undefined;
    }
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/files', fileRoutes);

describe('File Routes (/api/files)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/files/signed-upload-url', () => {
    const uploaderId = 'uploader-1';
    const uploadRequest = {
      fileName: 'test-image.png',
      fileType: 'image/png',
      fileSize: 1024 * 500, // 500KB
      bucketName: 'gallery',
      title: 'Test Image',
    };

    it('should return a signed URL and fileRecordId on successful request', async () => {
      const mockFileRecordId = 'file-record-uuid-123';
      const mockSignedUrl = 'http://supabase-storage.com/signed-url-for-upload';
      const mockStoragePath = `gallery/${uploaderId}/some-uuid-test-image.png`;

      (supabase.from('files').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({ data: { id: mockFileRecordId }, error: null }),
      });
      (supabase.storage.from('gallery').createSignedUploadUrl as jest.Mock)
        .mockResolvedValueOnce({ data: { signedUrl: mockSignedUrl, path: mockStoragePath }, error: null });
        // Note: Supabase JS SDK v2 returns 'path', v3 might return 'storagePath' or similar.
        // Adjust mock based on actual SDK usage if this test were to be run.
        // The route code uses `storage_path` for DB and `signedUrlData.signedUrl` and `storage_path` (from var) in response.

      const response = await request(app)
        .post('/api/files/signed-upload-url')
        .set('x-test-user-id', uploaderId)
        .send(uploadRequest);

      expect(response.status).toBe(200);
      expect(response.body.signedUrl).toBe(mockSignedUrl);
      expect(response.body.fileRecordId).toBe(mockFileRecordId);
      expect(response.body.storagePath).toBeDefined(); // Check if path is returned
      expect(supabase.from('files').insert).toHaveBeenCalledWith(
        expect.objectContaining({
          uploader_user_id: uploaderId,
          file_name: uploadRequest.fileName,
          mime_type: uploadRequest.fileType,
          size_bytes: uploadRequest.fileSize,
          storage_bucket: uploadRequest.bucketName,
          upload_status: 'pending'
        })
      );
      expect(supabase.storage.from(uploadRequest.bucketName).createSignedUploadUrl).toHaveBeenCalled();
    });
    
    it('should return 400 if fileName is missing', async () => {
        const { fileName, ...incompleteRequest } = uploadRequest;
        const response = await request(app)
            .post('/api/files/signed-upload-url')
            .set('x-test-user-id', uploaderId)
            .send(incompleteRequest);
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('fileName is required');
    });

    it('should return 400 for invalid bucketName', async () => {
        const response = await request(app)
            .post('/api/files/signed-upload-url')
            .set('x-test-user-id', uploaderId)
            .send({ ...uploadRequest, bucketName: 'invalid-bucket' });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid bucketName');
    });
    
    it('should return 400 for file size exceeding limit', async () => {
        const response = await request(app)
            .post('/api/files/signed-upload-url')
            .set('x-test-user-id', uploaderId)
            .send({ ...uploadRequest, fileSize: 20 * 1024 * 1024 }); // 20MB > 10MB limit
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('File size exceeds the maximum limit');
    });
  });

  describe('POST /api/files/upload-complete', () => {
    const uploaderId = 'uploader-1';
    const fileRecordId = 'file-record-uuid-123';

    it('should update file status to completed on success', async () => {
      (supabase.from('files').select as jest.Mock).mockReturnValueOnce({ // Fetch file record
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: fileRecordId, uploader_user_id: uploaderId, upload_status: 'pending' }, error: null }),
      });
      (supabase.from('files').update as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValueOnce({ data: { id: fileRecordId, upload_status: 'completed' }, error: null }),
      });

      const response = await request(app)
        .post('/api/files/upload-complete')
        .set('x-test-user-id', uploaderId)
        .send({ fileRecordId, success: true });

      expect(response.status).toBe(200);
      expect(response.body.fileRecord.upload_status).toBe('completed');
      expect(supabase.from('files').update).toHaveBeenCalledWith(
        expect.objectContaining({ upload_status: 'completed' })
      );
    });
    
    it('should prevent non-uploader/non-admin from updating status', async () => {
      (supabase.from('files').select as jest.Mock).mockReturnValueOnce({ // Fetch file record
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: fileRecordId, uploader_user_id: 'another-uploader', upload_status: 'pending' }, error: null }),
      });
      
      const response = await request(app)
        .post('/api/files/upload-complete')
        .set('x-test-user-id', uploaderId) // uploaderId is not 'another-uploader'
        .send({ fileRecordId, success: true });
        
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Forbidden. You cannot update this file record');
    });
  });

  describe('DELETE /api/files/:fileId', () => {
    const uploaderId = 'uploader-1';
    const adminId = 'admin-1';
    const fileIdToDelete = 'file-to-delete-uuid';
    const mockFileRecord = { 
      id: fileIdToDelete, 
      uploader_user_id: uploaderId, 
      storage_bucket: 'gallery', 
      storage_path: `gallery/${uploaderId}/file.png` 
    };

    it('should allow owner to delete their file', async () => {
      (supabase.from('files').select as jest.Mock).mockResolvedValueOnce({ // Fetch file record
         eq: jest.fn().mockReturnThis(),
         single: jest.fn().mockResolvedValueOnce({ data: mockFileRecord, error: null }),
      });
      (supabase.storage.from(mockFileRecord.storage_bucket).remove as jest.Mock)
        .mockResolvedValueOnce({ data: {}, error: null }); // Storage deletion
      (supabase.from('files').delete as jest.Mock).mockResolvedValueOnce({ // DB record deletion
        eq: jest.fn().mockReturnThis(),
        // single: jest.fn().mockResolvedValueOnce({ data: {}, error: null, count: 1 }), // .delete().eq() does not have .single()
        mockResolvedValueOnce: ({ data: {}, error: null, count: 1 }) // Simplified mock for delete().eq()
      });
       (supabase.from('files').delete as jest.Mock).mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({ error: null, count: 1 }), // Mock the chained .eq().then(...)
      }));


      const response = await request(app)
        .delete(`/api/files/${fileIdToDelete}`)
        .set('x-test-user-id', uploaderId);

      expect(response.status).toBe(204);
      expect(supabase.storage.from(mockFileRecord.storage_bucket).remove).toHaveBeenCalledWith([mockFileRecord.storage_path]);
      expect(supabase.from('files').delete().eq).toHaveBeenCalledWith('id', fileIdToDelete);
    });
    
    it('should allow admin to delete any file', async () => {
      (supabase.from('files').select as jest.Mock).mockResolvedValueOnce({
         eq: jest.fn().mockReturnThis(),
         single: jest.fn().mockResolvedValueOnce({ data: mockFileRecord, error: null }),
      });
      (supabase.storage.from(mockFileRecord.storage_bucket).remove as jest.Mock)
        .mockResolvedValueOnce({ data: {}, error: null });
      (supabase.from('files').delete as jest.Mock).mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({ error: null, count: 1 }),
      }));

      const response = await request(app)
        .delete(`/api/files/${fileIdToDelete}`)
        .set('x-test-user-id', adminId)
        .set('x-test-user-role', 'admin');
        
      expect(response.status).toBe(204);
    });
  });
  
  // TODO: Add tests for GET /api/files (listing)
  // TODO: Add tests for PUT /api/files/:fileId/metadata (update metadata)
});
