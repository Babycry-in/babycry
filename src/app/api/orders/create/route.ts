import { NextRequest, NextResponse } from 'next/server';
import { createOrderServerSide } from '@/lib/data/db-service';
import { sendWhatsAppNotification } from '@/lib/whatsapp/send-order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      customer_email,
      address,
      city,
      state,
      pincode,
      delivery_instructions,
      items,
    } = body;

    // Strict validation
    if (!customer_name || !customer_phone || !address || !city || !pincode) {
      return NextResponse.json(
        { error: 'Please provide all required delivery details.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    // 1. Create order server-side with verified database prices
    const order = await createOrderServerSide({
      customer_name,
      customer_phone,
      customer_email: customer_email || 'customer@babycry.in',
      address,
      city,
      state: state || 'Kerala',
      pincode,
      delivery_instructions,
      items: items.map((it: any) => ({
        product_id: it.productId || it.product_id,
        name: it.name || it.product_name || it.product_name_snapshot,
        price: it.price !== undefined && it.price !== null ? Number(it.price) : undefined,
        image: it.image || it.product_image || it.product_image_snapshot,
        variant_snapshot: it.variant || `${it.selectedSize || ''} ${it.selectedColor || ''}`.trim() || 'Default',
        quantity: it.quantity || 1,
      })),
    });

    // 2. Dispatch WhatsApp Notification
    const whatsappResult = await sendWhatsAppNotification(order);

    return NextResponse.json({
      success: true,
      order,
      whatsappUrl: whatsappResult.url,
      whatsappSent: whatsappResult.success,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process order securely' },
      { status: 500 }
    );
  }
}
