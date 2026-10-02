import { NextRequest, NextResponse } from 'next/server';
import { 
  getHeroSlides, 
  saveHeroSlide, 
  getHomepageSections, 
  updateHomepageSection 
} from '@/lib/data/db-service';

export async function GET() {
  try {
    const [heroSlides, sections] = await Promise.all([
      getHeroSlides(false),
      getHomepageSections(),
    ]);
    return NextResponse.json({ heroSlides, sections });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type === 'hero') {
      const slide = await saveHeroSlide(body.data);
      return NextResponse.json({ success: true, slide });
    } else if (body.type === 'section') {
      const section = await updateHomepageSection(body.data);
      return NextResponse.json({ success: true, section });
    }
    return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update homepage' },
      { status: 500 }
    );
  }
}
