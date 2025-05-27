import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient'; // Admin client
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const router = express.Router();

// Allowed buckets and basic validation parameters
const ALLOWED_BUCKETS = ['gallery', 'avatars', 'track_layouts', 'general_uploads']; // User should create these
const MAX_FILE_SIZE_MB = 10; // Example: 10MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES: { [key: string]: string[] } = { // Example: specific types per bucket
    'gallery': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'avatars': ['image/jpeg', 'image/png', 'image/webp'],
    'track_layouts': ['image/jpeg', 'image/png', 'image/svg+xml'],
    'general_uploads': ['application/pdf', 'image/jpeg', 'image/png'] // More generic
};
const VALID_ENTITY_TYPES = ['championship', 'event', 'result', 'track', 'vehicle', 'user_profile', 'team', 'comment'];


// POST /api/files/signed-upload-url - Get a signed URL for uploading a file
router.post('/signed-upload-url', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const uploader_user_id = req.user?.id;
  if (!uploader_user_id) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  const { 
    fileName, 
    fileType, // MIME type from client
    fileSize, // Size in bytes from client
    bucketName, 
    title, 
    description, 
    entity_type, 
    entity_id_int, 
    entity_id_uuid 
  } = req.body;

  // --- Input Validation ---
  if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
    return res.status(400).json({ error: 'fileName is required.' });
  }
  if (!fileType || typeof fileType !== 'string') {
    return res.status(400).json({ error: 'fileType (MIME type) is required.' });
  }
  if (typeof fileSize !== 'number' || fileSize <= 0) {
    return res.status(400).json({ error: 'Valid fileSize (in bytes) is required.' });
  }
  if (!bucketName || !ALLOWED_BUCKETS.includes(bucketName)) {
    return res.status(400).json({ error: `Invalid bucketName. Must be one of: ${ALLOWED_BUCKETS.join(', ')}` });
  }

  // Validate file size
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return res.status(400).json({ error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.` });
  }

  // Validate MIME type for the given bucket
  const allowedTypesForBucket = ALLOWED_MIME_TYPES[bucketName];
  if (allowedTypesForBucket && !allowedTypesForBucket.includes(fileType)) {
    return res.status(400).json({ error: `File type '${fileType}' is not allowed for bucket '${bucketName}'. Allowed types: ${allowedTypesForBucket.join(', ')}` });
  }

  // Validate entity linking
  if (entity_type) {
    if (!VALID_ENTITY_TYPES.includes(entity_type)) {
        return res.status(400).json({ error: `Invalid entity_type. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}` });
    }
    if (['championship', 'event', 'result', 'track', 'vehicle', 'team', 'comment'].includes(entity_type)) {
        if (entity_id_int === undefined || entity_id_int === null || typeof entity_id_int !== 'number' || entity_id_int <= 0) {
            return res.status(400).json({ error: `entity_id_int is required and must be a positive number for entity_type '${entity_type}'.` });
        }
    } else if (entity_type === 'user_profile') {
        if (!entity_id_uuid || typeof entity_id_uuid !== 'string') {
            return res.status(400).json({ error: `entity_id_uuid is required and must be a valid UUID string for entity_type '${entity_type}'.` });
        }
    } else {
         return res.status(400).json({ error: 'Mismatched entity_type and entity_id provided or entity_id missing.' });
    }
  }
  // --- End Validation ---

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Sanitize file name
  const storage_path = `${bucketName}/${uploader_user_id}/${uuidv4()}-${safeFileName}`; // Ensure public schema is not in path if bucket is public

  try {
    // Create metadata record in 'files' table first
    const { data: fileRecord, error: recordError } = await supabase
      .from('files')
      .insert({
        uploader_user_id,
        storage_bucket: bucketName,
        storage_path,
        file_name: safeFileName, // Store original or sanitized name
        mime_type: fileType,
        size_bytes: fileSize,
        title: title || null,
        description: description || null,
        upload_status: 'pending',
        entity_type: entity_type || null,
        entity_id_int: entity_type && ['championship', 'event', 'result', 'track', 'vehicle', 'team', 'comment'].includes(entity_type) ? entity_id_int : null,
        entity_id_uuid: entity_type === 'user_profile' ? entity_id_uuid : null,
      })
      .select('id') // Select the ID of the newly created record
      .single();

    if (recordError) throw recordError;
    if (!fileRecord) throw new Error("Failed to create file metadata record.");


    // Generate signed upload URL
    // The client will use this URL to PUT the file directly to Supabase Storage
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from(bucketName)
      .createSignedUploadUrl(storage_path); // Default expiry is 60 seconds, can add { expiresIn: 300 }

    if (signedUrlError) throw signedUrlError;
    
    res.status(200).json({ 
      signedUrl: signedUrlData.signedUrl, 
      storagePath: storage_path, // Or just path if Supabase SDK uses 'path'
      fileRecordId: fileRecord.id,
      // The token in signedUrlData is the actual upload token, not related to JWT
    });

  } catch (error: any) {
    console.error('Error generating signed upload URL or creating file record:', error.message);
    // If file record was created but signed URL failed, consider cleanup (or a retry mechanism)
    res.status(500).json({ error: 'Failed to prepare file upload.', details: error.message });
  }
});


// POST /api/files/upload-complete - Mark an upload as completed or failed
router.post('/upload-complete', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.id;
  const { fileRecordId, success, errorMessage } = req.body;

  if (!fileRecordId || typeof fileRecordId !== 'string') {
    return res.status(400).json({ error: 'fileRecordId is required.' });
  }
  if (typeof success !== 'boolean') {
    return res.status(400).json({ error: 'Success status (boolean) is required.' });
  }

  try {
    const { data: fileRecord, error: fetchError } = await supabase
      .from('files')
      .select('id, uploader_user_id, upload_status, storage_path, storage_bucket')
      .eq('id', fileRecordId)
      .single();

    if (fetchError || !fileRecord) {
      return res.status(404).json({ error: 'File record not found.' });
    }

    // Authorization: Only uploader or admin can update status
    if (fileRecord.uploader_user_id !== currentUserId && req.user?.app_metadata?.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. You cannot update this file record.' });
    }

    if (fileRecord.upload_status === 'completed' && success) {
        return res.status(200).json({ message: 'File already marked as completed.', fileRecord });
    }
    if (fileRecord.upload_status === 'failed' && !success) {
        return res.status(200).json({ message: 'File already marked as failed.', fileRecord });
    }

    const newStatus = success ? 'completed' : 'failed';
    
    const { data: updatedRecord, error: updateError } = await supabase
      .from('files')
      .update({ 
        upload_status: newStatus, 
        updated_at: new Date().toISOString(),
        // Optionally store errorMessage if success is false, perhaps in a new column or in description
        description: !success && errorMessage ? `Upload failed: ${errorMessage}` : fileRecord.description 
      })
      .eq('id', fileRecordId)
      .select()
      .single();

    if (updateError) throw updateError;

    // If upload failed, and we want to remove the (potentially partially) uploaded file from storage
    // This is optional, as failed uploads might not even exist or might be overwritten
    // if (!success && fileRecord.storage_path && fileRecord.storage_bucket) {
    //   console.log(`Upload failed for ${fileRecordId}. Attempting to remove from storage: ${fileRecord.storage_path}`);
    //   await supabase.storage.from(fileRecord.storage_bucket).remove([fileRecord.storage_path]);
    // }

    res.status(200).json({ message: `File upload status updated to ${newStatus}.`, fileRecord: updatedRecord });

  } catch (error: any) {
    console.error('Error updating file upload status:', error.message);
    res.status(500).json({ error: 'Failed to update file upload status.', details: error.message });
  }
});

// GET /api/files - List files with optional filters
router.get('/', async (req: AuthenticatedRequest, res: Response) => { // authMiddleware can be optional if some files are public
  const { entity_type, entity_id_int, entity_id_uuid, uploader_user_id, bucketName, page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const rangeStart = (pageNum - 1) * limitNum;
  const rangeEnd = pageNum * limitNum - 1;

  try {
    let query = supabase
      .from('files')
      .select('*', { count: 'exact' }) // Add uploader details if needed: uploader:profiles(username)
      .eq('upload_status', 'completed') // Only show completed files
      .order('created_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (entity_type && typeof entity_type === 'string') query = query.eq('entity_type', entity_type);
    if (entity_id_int && typeof entity_id_int === 'string') query = query.eq('entity_id_int', parseInt(entity_id_int));
    if (entity_id_uuid && typeof entity_id_uuid === 'string') query = query.eq('entity_id_uuid', entity_id_uuid);
    if (uploader_user_id && typeof uploader_user_id === 'string') query = query.eq('uploader_user_id', uploader_user_id);
    if (bucketName && typeof bucketName === 'string') query = query.eq('storage_bucket', bucketName);

    const { data: files, error, count } = await query;
    if (error) throw error;

    // Generate public URLs or signed URLs for download
    const filesWithUrls = await Promise.all(files.map(async (file) => {
      const { data: urlData } = supabase
        .storage
        .from(file.storage_bucket)
        .getPublicUrl(file.storage_path); // Assumes files are in public buckets or RLS allows access

      // If buckets are not public, or require time-limited access:
      // const { data: signedUrlData, error: signError } = await supabase
      //   .storage
      //   .from(file.storage_bucket)
      //   .createSignedUrl(file.storage_path, 3600); // Expires in 1 hour
      // if (signError) { /* handle error, maybe return null URL */ }
      // file.public_url = signedUrlData?.signedUrl;

      return { ...file, public_url: urlData?.publicUrl };
    }));

    res.status(200).json({
      files: filesWithUrls,
      total: count,
      page: pageNum,
      limit: limitNum,
    });

  } catch (error: any) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({ error: 'Failed to fetch files.', details: error.message });
  }
});


// DELETE /api/files/:fileId - Delete a file and its metadata
router.delete('/:fileId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const fileId = req.params.fileId;
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;

  if (!fileId || typeof fileId !== 'string') { // Assuming UUID for fileId
    return res.status(400).json({ error: 'Valid fileId (UUID) is required.' });
  }

  try {
    const { data: fileRecord, error: fetchError } = await supabase
      .from('files')
      .select('id, uploader_user_id, storage_path, storage_bucket')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      return res.status(404).json({ error: 'File record not found.' });
    }

    // Authorization: Owner or Admin
    if (fileRecord.uploader_user_id !== currentUserId && currentUserRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to delete this file.' });
    }

    // 1. Delete from Supabase Storage
    const { error: storageError } = await supabase
      .storage
      .from(fileRecord.storage_bucket)
      .remove([fileRecord.storage_path]);

    if (storageError) {
      // Log error but proceed to delete metadata if file doesn't exist in storage (e.g. already deleted)
      // Supabase remove doesn't error if file not found, but good to be aware.
      console.warn(`Storage deletion warning for path ${fileRecord.storage_path}:`, storageError.message);
    }

    // 2. Delete metadata from 'files' table
    const { error: dbError, count } = await supabase
      .from('files')
      .delete({ count: 'exact' })
      .eq('id', fileId);

    if (dbError) throw dbError; // If DB deletion fails, the storage deletion might need rollback (complex)
    if (count === 0) {
        return res.status(404).json({ error: 'File record not found in database, possibly already deleted.' });
    }

    res.status(204).send();

  } catch (error: any) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({ error: 'Failed to delete file.', details: error.message });
  }
});


// PUT /api/files/:fileId/metadata - Update file metadata (title, description)
router.put('/:fileId/metadata', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const fileId = req.params.fileId;
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;
  const { title, description } = req.body;

  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'Valid fileId (UUID) is required.' });
  }
  if (title === undefined && description === undefined) {
    return res.status(400).json({ error: 'At least title or description must be provided for update.' });
  }
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid title format.' });
  }
   if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid description format.' });
  }

  try {
    const { data: fileRecord, error: fetchError } = await supabase
      .from('files')
      .select('id, uploader_user_id')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      return res.status(404).json({ error: 'File record not found.' });
    }

    // Authorization: Owner or Admin
    if (fileRecord.uploader_user_id !== currentUserId && currentUserRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to update this file metadata.' });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const { data: updatedRecord, error: updateError } = await supabase
      .from('files')
      .update(updates)
      .eq('id', fileId)
      .select() // Select updated record
      .single();
    
    if (updateError) throw updateError;
    if (!updatedRecord) return res.status(404).json({ error: 'File record not found or no update occurred.'});

    res.status(200).json(updatedRecord);

  } catch (error: any) {
    console.error('Error updating file metadata:', error.message);
    res.status(500).json({ error: 'Failed to update file metadata.', details: error.message });
  }
});


export default router;
