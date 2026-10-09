import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/data/db-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const subcategoryId = searchParams.get('subcategoryId') || undefined;
    const subcategorySlug = searchParams.get('subcategorySlug') || undefined;
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : undefined;
    const onlyActive = searchParams.get('onlyActive') !== 'false';

    const products = await getProducts({
      search,
      categoryId,
      categorySlug,
      subcategoryId,
      subcategorySlug,
      isFeatured,
      onlyActive,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}
