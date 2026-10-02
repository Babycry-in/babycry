import { NextRequest, NextResponse } from 'next/server';
import { getMediaLibrary, deleteMediaItem } from '@/lib/data/db-service';

export async function GET() {
  try {
    const media = await getMediaLibrary();
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing media ID' }, { status: 400 });
    }
    await deleteMediaItem(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete media' },
      { status: 500 }
    );
  }
}
