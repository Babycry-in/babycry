import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getBusinessSettings } from '@/lib/data/db-service';
import OrderDetailsClient from '@/components/order/OrderDetailsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details | Baby Cry.in',
  description: 'Complete your order via WhatsApp with Baby Cry.in',
};

interface Props {
  params: Promise<{ productSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { productSlug } = await params;
  const resolvedSearchParams = await searchParams;

  const settings = await getBusinessSettings();
  const whatsappNumber = settings?.whatsapp_number || '8136819192';

  const isCart = productSlug === 'cart' || resolvedSearchParams.source === 'cart';

  let product = null;
  if (!isCart) {
    product = await getProductBySlug(productSlug);
    if (!product) {
      notFound();
    }
  }

  const initialQty = typeof resolvedSearchParams.qty === 'string' ? parseInt(resolvedSearchParams.qty, 10) : 1;
  const initialSize = typeof resolvedSearchParams.size === 'string' ? resolvedSearchParams.size : undefined;
  const initialColor = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : undefined;

  return (
    <OrderDetailsClient
      product={product}
      isCart={isCart}
      whatsappNumber={whatsappNumber}
      initialQty={initialQty || 1}
      initialSize={initialSize}
      initialColor={initialColor}
    />
  );
}
