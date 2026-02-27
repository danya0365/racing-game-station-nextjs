/**
 * SupabaseStorageRepository
 * Implementation of IStorageRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 * ❌ Do NOT use in Client Components directly
 */

import { IStorageRepository } from '@/src/application/repositories/IStorageRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseStorageRepository implements IStorageRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async uploadFile(file: File, bucket: string, pathPrefix: string = 'misc'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading file to bucket ${bucket}:`, error);
        throw new Error(error.message || `Failed to upload file to ${bucket}. Please try again.`);
      }

      // Get public URL
      const { data: publicUrlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.error('Exception during Supabase upload:', err);
      if (err.name === 'AbortError') {
        throw new Error('หมดเวลาการเชื่อมต่อ (Timeout) กรุณาลองใหม่อีกครั้ง');
      }
      throw new Error(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ ระบบอาจมีการขัดข้อง');
    }
  }

  async deleteFile(filePath: string, bucket: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error(`Error deleting file ${filePath} from bucket ${bucket}:`, error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception during Supabase delete:', err);
      return false;
    }
  }
}
