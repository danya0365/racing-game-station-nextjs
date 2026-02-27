/**
 * ApiStorageRepository
 * Implements IStorageRepository using API calls instead of direct Supabase connection
 * 
 * ✅ For use in CLIENT-SIDE components only
 * ✅ Secure - no Supabase credentials exposed to client
 */

import { IStorageRepository } from '@/src/application/repositories/IStorageRepository';

export class ApiStorageRepository implements IStorageRepository {
  private baseUrl = '/api/storage';

  async uploadFile(file: File, bucket: string, pathPrefix: string = 'misc'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    if (pathPrefix) {
      formData.append('pathPrefix', pathPrefix);
    }

    const res = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      let errorMsg = 'ไม่สามารถอัปโหลดไฟล์ได้';
      try {
        const error = await res.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        // Fallback to text if JSON parsing fails
      }
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    return data.url;
  }

  async deleteFile(filePath: string, bucket: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, bucket }),
    });
    
    if (!res.ok) {
      let errorMsg = 'ไม่สามารถลบไฟล์ได้';
      try {
        const error = await res.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        // Fallback
      }
      console.error(errorMsg);
      return false;
    }
    
    return true;
  }
}
