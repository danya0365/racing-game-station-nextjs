/**
 * IStorageRepository
 * Repository interface for Storage data access
 * Following Clean Architecture - Application layer
 */

export interface IStorageRepository {
  /**
   * Upload a file to a specific storage bucket
   * @param file The file to upload
   * @param bucket The name of the Supabase storage bucket
   * @param pathPrefix Optional prefix for the file path (e.g. 'machines')
   * @returns The public URL of the uploaded image
   */
  uploadFile(file: File, bucket: string, pathPrefix?: string): Promise<string>;

  /**
   * Delete a file from a specific storage bucket
   * @param filePath The path of the file to delete (without the bucket name)
   * @param bucket The name of the Supabase storage bucket
   */
  deleteFile(filePath: string, bucket: string): Promise<boolean>;
}
