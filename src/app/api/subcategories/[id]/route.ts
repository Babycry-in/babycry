import { NextRequest, NextResponse } from 'next/server';
import { saveSubcategory, deleteSubcategory } from '@/lib/data/db-service';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const subcategory = await saveSubcategory({ ...body, id });
    return NextResponse.json({ success: true, subcategory });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update subcategory' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteSubcategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}
