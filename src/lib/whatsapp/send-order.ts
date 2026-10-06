import { Order } from '@/types/database';
export * from './message-formatter';
import { formatWhatsAppOrderMessage, generateWhatsAppChatUrl } from './message-formatter';

export async function sendWhatsAppNotification(order: Order): Promise<{
  success: boolean;
  type: 'direct_link';
  url: string;
}> {
  let settings;
  try {
    const { getBusinessSettings } = await import('@/lib/data/db-service');
    settings = await getBusinessSettings();
  } catch {
    // fallback
  }

  const businessName = settings?.business_name || 'Baby Cry.in';
  const template = settings?.whatsapp_order_template;
  const message = formatWhatsAppOrderMessage(order, businessName, template);
  const targetPhone = settings?.whatsapp_number || '8136819192';
  const chatUrl = generateWhatsAppChatUrl(targetPhone, message);

  return { success: true, type: 'direct_link', url: chatUrl };
}
