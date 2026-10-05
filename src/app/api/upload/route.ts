import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { addMediaItem } from '@/lib/data/db-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'babycry';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 1. If Cloudinary is configured, upload directly to Cloudinary API
    if (cloudName && apiKey && apiSecret && !cloudName.includes('your-')) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

      const cloudinaryFormData = new FormData();
      const blob = new Blob([fileBuffer], { type: file.type });
      cloudinaryFormData.append('file', blob, file.name);
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', timestamp.toString());
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('folder', folder);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      if (!cloudRes.ok) {
        const errorBody = await cloudRes.text();
        console.error('Cloudinary upload failure response:', errorBody);
        let cloudinaryMessage = 'Failed to upload image to Cloudinary';
        try {
          const parsed = JSON.parse(errorBody);
          if (parsed?.error?.message) {
            cloudinaryMessage = `Cloudinary error: ${parsed.error.message}`;
          }
        } catch {}
        return NextResponse.json({ error: cloudinaryMessage }, { status: 500 });
      }

      const cloudData = await cloudRes.json();

      // Store in media library
      await addMediaItem({
        file_name: file.name,
        cloudinary_url: cloudData.secure_url,
        cloudinary_public_id: cloudData.public_id,
        width: cloudData.width,
        height: cloudData.height,
        format: cloudData.format,
        size_bytes: cloudData.bytes,
        used_by: 'Admin Upload'
      });

      return NextResponse.json({
        url: cloudData.secure_url,
        public_id: cloudData.public_id,
        width: cloudData.width,
        height: cloudData.height,
        format: cloudData.format,
      });
    }

    // 2. Safe local upload fallback if Cloudinary credentials are not populated yet
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.name) || '.webp';
    const filename = `${path.basename(file.name, extension)}-${uniqueSuffix}${extension}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, fileBuffer);
    const localUrl = `/uploads/${filename}`;

    await addMediaItem({
      file_name: file.name,
      cloudinary_url: localUrl,
      cloudinary_public_id: `local-${uniqueSuffix}`,
      format: extension.replace('.', ''),
      size_bytes: file.size,
      used_by: 'Local Upload'
    });

    return NextResponse.json({
      url: localUrl,
      public_id: `local-${uniqueSuffix}`,
      width: 800,
      height: 800,
      format: extension.replace('.', ''),
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Image processing failed' },
      { status: 500 }
    );
  }
}
