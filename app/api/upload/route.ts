import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join(process.cwd(), 'public', 'tmp', file.name);
    await writeFile(path, buffer);
    console.log(`✅ Saved file to ${path}`);

    return NextResponse.json({ success: true, path: `/tmp/${file.name}` });

  } catch (err) {
    console.error('API upload error:', err);
    return NextResponse.json({ success: false, message: 'Upload failed' });
  }
}
