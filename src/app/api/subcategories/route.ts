import { NextRequest, NextResponse } from 'next/server';
import { getSubcategories, saveSubcategory } from '@/lib/data/db-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('onlyActive') !== 'false';
    const subcategories = await getSubcategories(onlyActive);
    return NextResponse.json({ subcategories });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subcategory = await saveSubcategory(body);
    return NextResponse.json({ success: true, subcategory });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save subcategory' },
      { status: 400 }
    );
  }
}
