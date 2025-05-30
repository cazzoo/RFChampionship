import request from 'supertest';
import { app } from '../../../app'; // Assuming your Express app instance is exported from 'app.ts' or 'index.ts'
import { supabase } from '../../../lib/supabaseClient';
import { authenticate, AuthenticatedRequest } from '../../../middleware/auth'; // For mocking
import { FileMetadata, FileUploadPostSignResponse, FileUploadCompletionRequest } from '../../../types/file';
import { NextFunction, Response } from 'express'; // Added NextFunction and Response

// Mock the auth middleware
jest.mock('../../../middleware/auth', () => ({
  authenticate: jest.fn((roleOrPermission?: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Default to a mock user if not specified otherwise by a test
    req.user = { id: 'test-user-id', role: 'user', app_metadata: {} };
    req.isAdmin = false;
    next();
  }),
}));


// Mock supabase client
jest.mock('../../../lib/supabaseClient', () => {
  const actualSupabase = jest.requireActual('../../../lib/supabaseClient'); // Get the actual structure
  return {
    supabase: {
      ...actualSupabase.supabase, // Spread the actual parts you want to keep
      storage: {
        from: jest.fn().mockReturnThis(),
        createSignedUploadUrl: jest.fn(),
        // Add other storage methods if needed and mock their implementations
         remove: jest.fn(),
         createSignedUrl: jest.fn(),
      },
      from: jest.fn().mockReturnThis(), // Mock for table selections like from('files')
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(), // For generic filters
      // Mock rpc if you use it for calling stored procedures
      rpc: jest.fn(),
    }
  };
});


const mockUserId = 'test-user-id';
const mockAdminId = 'test-admin-id';

// Helper to change auth mock for specific tests
const mockAuthAsUser = (userId = mockUserId) => {
  (authenticate as jest.Mock).mockImplementation((roleOrPermission?: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.user = { id: userId, role: 'user', app_metadata: { user_id: userId, roles: [] } };
    req.isAdmin = false;
    next();
  });
};

const mockAuthAsAdmin = () => {
  (authenticate as jest.Mock).mockImplementation((roleOrPermission?: string | string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.user = { id: mockAdminId, role: 'service_role', app_metadata: { user_id: mockAdminId, roles: ['admin'] } }; // Or however your admin is identified
    req.isAdmin = true; // Assuming an isAdmin flag is set by your auth middleware
    next();
  });
};


describe('File Routes', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Default to user authentication for most tests
    mockAuthAsUser();
  });

  describe('POST /api/files/upload-url', () => {
    it('should return a signed URL for valid image upload request', async () => {
      const mockSignedUrlResponse: FileUploadPostSignResponse = {
        url: 'https://supabase-signed-url.com/upload',
        token: 'some-token', // if your actual response includes a token, mock it
        path: 'test-user-id/image.jpg',
        bucket: 'uploads-private',
      };
      (supabase.storage.from('uploads-private').createSignedUploadUrl as jest.Mock).mockResolvedValueOnce({
        data: { signedUrl: mockSignedUrlResponse.url, token: mockSignedUrlResponse.token, path: mockSignedUrlResponse.path },
        error: null,
      });

      const response = await request(app)
        .post('/api/files/upload-url')
        .send({
          fileName: 'image.jpg',
          fileType: 'image/jpeg',
          entityType: 'user_avatar',
          // entityIdInt or entityIdUuid can be omitted if not needed for this entity type or if globally defined
        })
        .set('Authorization', 'Bearer testtoken');

      expect(response.status).toBe(200);
      expect(response.body.url).toBe(mockSignedUrlResponse.url);
      expect(response.body.path).toMatch(/^test-user-id\/[0-9a-f-]+\.jpg$/); // Path should include user ID and a UUID + original extension
      expect(response.body.bucket).toBe('uploads-private');
      expect(supabase.storage.from).toHaveBeenCalledWith('uploads-private');
      expect(supabase.storage.from('uploads-private').createSignedUploadUrl).toHaveBeenCalledWith(
        expect.stringMatching(/^test-user-id\/[0-9a-f-]+\.jpg$/), // Path argument should match the expected pattern
        expect.objectContaining({
            cacheControl: '3600',
            upsert: false, // Default from config
            contentType: 'image/jpeg',
        })
      );
    });

    it('should return 400 if fileName is missing', async () => {
      const response = await request(app)
        .post('/api/files/upload-url')
        .send({ fileType: 'image/jpeg', entityType: 'user_avatar' })
        .set('Authorization', 'Bearer testtoken');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('fileName is required');
    });

    it('should return 400 if fileType is missing', async () => {
        const response = await request(app)
          .post('/api/files/upload-url')
          .send({ fileName: 'test.jpg', entityType: 'user_avatar' })
          .set('Authorization', 'Bearer testtoken');
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('fileType is required');
    });

    it('should return 400 if entityType is missing', async () => {
        const response = await request(app)
          .post('/api/files/upload-url')
          .send({ fileName: 'test.jpg', fileType: 'image/png' })
          .set('Authorization', 'Bearer testtoken');
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('entityType is required');
    });

    it('should return 400 if file type is not allowed by config', async () => {
        const response = await request(app)
          .post('/api/files/upload-url')
          .send({ fileName: 'test.exe', fileType: 'application/octet-stream', entityType: 'user_avatar' })
          .set('Authorization', 'Bearer testtoken');
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('File type application/octet-stream not allowed for entityType user_avatar');
    });

    it('should use default bucket from config if not specified for entity type', async () => {
        (supabase.storage.from('default-bucket-private').createSignedUploadUrl as jest.Mock).mockResolvedValueOnce({ // Assuming 'default-bucket-private' is your fallback
            data: { signedUrl: 'https://some-url.com/upload', path: 'test-user-id/somefile.txt' },
            error: null,
        });
        const response = await request(app)
            .post('/api/files/upload-url')
            .send({ fileName: 'somefile.txt', fileType: 'text/plain', entityType: 'unknown_entity_type' }) // 'unknown_entity_type' not in config
            .set('Authorization', 'Bearer testtoken');
        expect(response.status).toBe(200);
        expect(supabase.storage.from).toHaveBeenCalledWith('default-bucket-private'); // Check correct bucket was used
    });

    it('should handle Supabase errors when creating signed URL', async () => {
      (supabase.storage.from('uploads-private').createSignedUploadUrl as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { name: 'SupabaseError', message: 'Failed to create signed URL' },
      });

      const response = await request(app)
        .post('/api/files/upload-url')
        .send({ fileName: 'image.jpg', fileType: 'image/jpeg', entityType: 'user_avatar' })
        .set('Authorization', 'Bearer testtoken');

      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Failed to create signed URL for upload');
    });
  });

  describe('POST /api/files/upload-complete', () => {
    const mockUploadCompleteRequest: FileUploadCompletionRequest = {
      storage_path: 'test-user-id/completed-file.jpg',
      storage_bucket: 'uploads-private',
      original_file_name: 'completed-file.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 102400,
      entity_type: 'user_avatar',
      // entity_id_int or entity_id_uuid can be added if applicable
      title: 'My Completed Avatar',
      description: 'A shiny new avatar'
    };

    const mockDbFileResponse: FileMetadata = {
      id: 'new-file-uuid',
      created_at: new Date().toISOString(),
      uploader_user_id: mockUserId,
      upload_status: 'completed',
      ...mockUploadCompleteRequest,
      // these would be dynamically set or based on request
      entity_id_int: null,
      entity_id_uuid: null,
      version_of_file_id: null,
      metadata: {}, // Assuming no extra metadata for this basic case
      tags: [],
    };

    it('should successfully record file metadata on upload completion', async () => {
      (supabase.insert as jest.Mock).mockReturnValueOnce({ data: [mockDbFileResponse], error: null, single: jest.fn().mockReturnThis() });

      const response = await request(app)
        .post('/api/files/upload-complete')
        .send(mockUploadCompleteRequest)
        .set('Authorization', 'Bearer testtoken');

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockDbFileResponse.id);
      expect(response.body.upload_status).toBe('completed');
      expect(supabase.insert).toHaveBeenCalledWith([expect.objectContaining({
        uploader_user_id: mockUserId,
        storage_path: mockUploadCompleteRequest.storage_path,
        upload_status: 'pending_metadata', // initial status before this call
        // ... other fields from mockUploadCompleteRequest
      })]);
    });

    it('should return 400 if required fields are missing from completion request', async () => {
        const incompleteRequest = { ...mockUploadCompleteRequest, storage_path: undefined } as any; // Cast to any to allow missing property
        const response = await request(app)
            .post('/api/files/upload-complete')
            .send(incompleteRequest)
            .set('Authorization', 'Bearer testtoken');
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('storage_path is a required field');
    });

    it('should handle database errors when inserting file metadata', async () => {
      (supabase.insert as jest.Mock).mockReturnValueOnce({ data: null, error: { message: 'DB insert failed' }, single: jest.fn().mockReturnThis() });

      const response = await request(app)
        .post('/api/files/upload-complete')
        .send(mockUploadCompleteRequest)
        .set('Authorization', 'Bearer testtoken');

      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Failed to record file metadata');
    });
  });

  describe('GET /api/files', () => {
    beforeEach(() => mockAuthAsUser()); // Assuming public/user access for listing, adjust if needed

    it('should return a list of completed files with download URLs, filtered by entity', async () => {
      const mockFileMeta = [
        { id: 'uuid1', storage_bucket: 'gallery', storage_path: 'public/gallery/file1.jpg', upload_status: 'completed', mime_type: 'image/jpeg', uploader_user_id: mockUserId, entity_type: 'event', entity_id_int: 1 },
        { id: 'uuid2', storage_bucket: 'documents', storage_path: 'private/docs/file2.pdf', upload_status: 'completed', mime_type: 'application/pdf', uploader_user_id: mockUserId, entity_type: 'event', entity_id_int: 1 },
      ];
      const mockSignedDownloadUrl1 = 'https://supabase-signed-download-url/file1.jpg';
      const mockSignedDownloadUrl2 = 'https://supabase-signed-download-url/file2.pdf';

      // Mock for the main select query
      (supabase.from('files').select as jest.Mock).mockImplementation(() => ({
          eq: jest.fn().mockReturnThis(), // For upload_status
          filter: jest.fn().mockReturnThis(), // For entity_type and entity_id_int
          range: jest.fn().mockReturnValueOnce({ data: mockFileMeta, error: null, count: mockFileMeta.length })
      }));

      // Mock createSignedUrl for each file
      (supabase.storage.from('gallery').createSignedUrl as jest.Mock)
        .mockImplementation((path, expiresIn) => path === 'public/gallery/file1.jpg' ? Promise.resolve({ data: { signedUrl: mockSignedDownloadUrl1 }, error: null }) : Promise.resolve({data:null, error: {message: 'path not found in gallery bucket'}}));
      (supabase.storage.from('documents').createSignedUrl as jest.Mock)
        .mockImplementation((path, expiresIn) => path === 'private/docs/file2.pdf' ? Promise.resolve({ data: { signedUrl: mockSignedDownloadUrl2 }, error: null }) : Promise.resolve({data:null, error: {message: 'path not found in documents bucket'}}));

      const response = await request(app).get('/api/files?entity_type=event&entity_id_int=1&page=1&limit=10');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].downloadUrl).toBe(mockSignedDownloadUrl1);
      expect(response.body.data[1].downloadUrl).toBe(mockSignedDownloadUrl2);
      expect(supabase.from('files').select).toHaveBeenCalledWith('*, uploader:profiles(username, avatar_url)', { count: 'exact' });
      // Check that appropriate filters were called
      expect((supabase.from('files').select() as any).eq).toHaveBeenCalledWith('upload_status', 'completed'); // Adjusted for clarity if needed
      expect((supabase.from('files').select() as any).filter).toHaveBeenCalledWith('entity_type', 'eq', 'event');
      expect((supabase.from('files').select() as any).filter).toHaveBeenCalledWith('entity_id_int', 'eq', '1');
    });

    it('should return 400 if required filter params for entity are partially missing', async () => {
        let response = await request(app).get('/api/files?entity_type=event'); // Missing entity_id_int
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('entity_id_int or entity_id_uuid is required if entity_type is provided');

        response = await request(app).get('/api/files?entity_id_int=1'); // Missing entity_type
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('entity_type is required if entity_id_int or entity_id_uuid is provided');
    });

    it('should handle errors when generating signed URLs for download', async () => {
        const mockFileMeta = [
            { id: 'uuid1', storage_bucket: 'gallery', storage_path: 'public/gallery/file1.jpg', upload_status: 'completed', mime_type: 'image/jpeg', uploader_user_id: mockUserId }
        ];
        // Corrected mock structure for select().eq().filter().range()
        (supabase.from('files').select as jest.Mock).mockImplementation(() => ({
            eq: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            range: jest.fn().mockReturnValueOnce({ data: mockFileMeta, error: null, count: 1 })
        }));
        (supabase.storage.from('gallery').createSignedUrl as jest.Mock).mockResolvedValueOnce({ data: null, error: { message: 'Failed to create signed URL' } });

        const response = await request(app).get('/api/files?uploader_user_id=' + mockUserId); // Assuming this filter is valid
        expect(response.status).toBe(200); // Still 200, but downloadUrl might be null or error included
        expect(response.body.data[0].downloadUrl).toBeNull();
        expect(response.body.data[0].downloadUrlError).toBe('Failed to create signed URL');
    });
  });

  describe('DELETE /api/files/:fileId', () => {
    const fileIdToDelete = 'file-to-delete-uuid';
    const fileMeta = { id: fileIdToDelete, uploader_user_id: mockUserId, storage_bucket: 'gallery', storage_path: 'public/gallery/delete_me.jpg' };

    it('should allow owner to delete their file (metadata and storage)', async () => {
      mockAuthAsUser();
      (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: fileMeta, error: null });
      (supabase.storage.from(fileMeta.storage_bucket).remove as jest.Mock).mockResolvedValueOnce({ data: [{name: 'delete_me.jpg'}], error: null });
      // Corrected: supabase.delete() is the start of the chain. .eq() is called on its result.
      (supabase.delete as jest.Mock).mockImplementation(() => ({
        eq: jest.fn().mockReturnValueOnce({ data: [fileMeta], error: null }) // Supabase delete returns array of deleted items
      }));


      const response = await request(app).delete(`/api/files/${fileIdToDelete}`);
      expect(response.status).toBe(204);
      expect(supabase.storage.from).toHaveBeenCalledWith(fileMeta.storage_bucket);
      expect(supabase.storage.from(fileMeta.storage_bucket).remove).toHaveBeenCalledWith([fileMeta.storage_path]);
      expect(supabase.delete).toHaveBeenCalledWith(); // No args for .delete() itself usually
      expect((supabase.delete() as any).eq).toHaveBeenCalledWith('id', fileIdToDelete); // eq is called on the result of delete()
    });

    it('should allow admin to delete any file', async () => {
      mockAuthAsAdmin();
      const otherUserFileMeta = { ...fileMeta, uploader_user_id: 'other-user-id' };
      (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: otherUserFileMeta, error: null });
      (supabase.storage.from(otherUserFileMeta.storage_bucket).remove as jest.Mock).mockResolvedValueOnce({ data: [{name: 'delete_me.jpg'}], error: null });
      (supabase.delete as jest.Mock).mockImplementation(() => ({
        eq: jest.fn().mockReturnValueOnce({ data: [otherUserFileMeta], error: null })
      }));

      const response = await request(app).delete(`/api/files/${fileIdToDelete}`);
      expect(response.status).toBe(204);
    });

    it('should return 403 if non-owner (not admin) tries to delete', async () => {
        mockAuthAsUser('another-user-id'); // Different user
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: fileMeta, error: null }); // fileMeta owned by mockUserId
        const response = await request(app).delete(`/api/files/${fileIdToDelete}`);
        expect(response.status).toBe(403);
    });

    it('should return 404 if file metadata not found for deletion', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: null, error: {message: 'not found'} });
        const response = await request(app).delete(`/api/files/non-existent-uuid`);
        expect(response.status).toBe(404);
    });

    it('should still attempt to delete DB record if storage deletion fails but log error', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: fileMeta, error: null });
        (supabase.storage.from(fileMeta.storage_bucket).remove as jest.Mock).mockResolvedValueOnce({ data: null, error: {message: 'Storage delete failed'} });
        (supabase.delete as jest.Mock).mockImplementation(() => ({
            eq: jest.fn().mockReturnValueOnce({ data: [fileMeta], error: null })
        }));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const response = await request(app).delete(`/api/files/${fileIdToDelete}`);
        expect(response.status).toBe(204);
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to delete from storage but proceeding to delete metadata for file ID:'), fileIdToDelete, expect.any(Object));
        consoleErrorSpy.mockRestore();
    });
  });

  describe('PUT /api/files/:fileId/metadata', () => {
    const fileIdToUpdate = 'file-meta-update-uuid';
    const originalMeta = { id: fileIdToUpdate, uploader_user_id: mockUserId, title: 'Old Title', description: 'Old Desc' };
    const updatePayload = { title: 'New Title', description: 'New Desc' };
    const updatedMeta = { ...originalMeta, ...updatePayload };

    it('should allow owner to update their file metadata', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: originalMeta, error: null });
        // Corrected: supabase.update() is the start. .eq().single() are chained.
        (supabase.update as jest.Mock).mockImplementation((payload) => ({ // payload is updatePayload
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({ data: updatedMeta, error: null })
        }));

        const response = await request(app).put(`/api/files/${fileIdToUpdate}/metadata`).send(updatePayload);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedMeta);
        expect(supabase.update).toHaveBeenCalledWith(updatePayload);
        expect((supabase.update() as any).eq).toHaveBeenCalledWith('id', fileIdToUpdate);
        expect((supabase.update() as any).single).toHaveBeenCalled();
    });

    it('should allow admin to update any file metadata', async () => {
        mockAuthAsAdmin();
        const otherUserMeta = { ...originalMeta, uploader_user_id: 'other-user' };
        const adminUpdatedMeta = { ...otherUserMeta, ...updatePayload };
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: otherUserMeta, error: null });
        (supabase.update as jest.Mock).mockImplementation((payload) => ({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({ data: adminUpdatedMeta, error: null })
        }));

        const response = await request(app).put(`/api/files/${fileIdToUpdate}/metadata`).send(updatePayload);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(adminUpdatedMeta);
    });

    it('should return 403 if non-owner (not admin) tries to update metadata', async () => {
        mockAuthAsUser('another-user-id');
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: originalMeta, error: null });
        const response = await request(app).put(`/api/files/${fileIdToUpdate}/metadata`).send(updatePayload);
        expect(response.status).toBe(403);
    });

    it('should return 404 if file metadata not found for update', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: null, error: {message: 'not found'} });
        const response = await request(app).put(`/api/files/non-existent-uuid/metadata`).send(updatePayload);
        expect(response.status).toBe(404);
    });

    it('should return 400 if update payload is empty', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: originalMeta, error: null });
        const response = await request(app).put(`/api/files/${fileIdToUpdate}/metadata`).send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('At least one field (title, description) must be provided for update');
    });

     it('should return 400 if payload contains fields other than title or description', async () => {
        mockAuthAsUser();
        (supabase.from('files').select().eq().single as jest.Mock).mockResolvedValueOnce({ data: originalMeta, error: null });
        const response = await request(app).put(`/api/files/${fileIdToUpdate}/metadata`).send({ title: 'New Title', evil_field: 'muahaha' });
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Only title and description can be updated');
    });
  });
// This is the end of the main describe block for 'File Routes'
}); // End of main describe('File Routes')
