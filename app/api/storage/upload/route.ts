export const maxDuration = 60; // Set up lambda execution timeout to 60s
import { SupabaseStorageRepository } from '@/src/infrastructure/repositories/supabase/SupabaseStorageRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string | null;
    const pathPrefix = formData.get('pathPrefix') as string | null;

    if (!file || !bucket) {
      return NextResponse.json(
        { error: 'Missing required parameters: file, bucket' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const repository = new SupabaseStorageRepository(supabase);
    
    const prefix = pathPrefix || 'misc';
    const url = await repository.uploadFile(file, bucket, prefix);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Storage Upload API Error:', error);
    const statusCode = error.message?.includes('Timeout') ? 504 : 500;
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: statusCode }
    );
  }
}
