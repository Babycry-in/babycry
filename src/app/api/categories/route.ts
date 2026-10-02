import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory } from '@/lib/data/db-service';

export async function GET() {
  try {
    const categories = await getCategories(false);
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = await saveCategory(body);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save category' },
      { status: 500 }
    );
  }
}
