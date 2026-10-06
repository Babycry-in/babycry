import { Order } from '@/types/database';

export function formatWhatsAppOrderMessage(
  order: Order,
  businessName = 'Baby Cry.in',
  template?: string
): string {
  const itemsText = (order.items || [])
    .map((item, index) => {
      return `${index + 1}. *${item.product_name_snapshot}*\nVariant: ${item.variant_snapshot || 'Standard'}\nQuantity: ${item.quantity}\nPrice: ₹${item.unit_price}`;
    })
    .join('\n\n');

  const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullAddress = `${order.address}, ${order.city}, ${order.state} - ${order.pincode}${
    order.delivery_instructions ? `\n(Instructions: ${order.delivery_instructions})` : ''
  }`;

  if (template && template.trim()) {
    return template
      .replace(/{business_name}/g, businessName)
      .replace(/{order_id}/g, `#${order.order_number}`)
      .replace(/{customer_name}/g, order.customer_name)
      .replace(/{customer_phone}/g, order.customer_phone)
      .replace(/{customer_email}/g, order.customer_email || '')
      .replace(/{delivery_address}/g, fullAddress)
      .replace(/{products}/g, itemsText)
      .replace(/{subtotal}/g, `₹${order.subtotal}`)
      .replace(/{delivery}/g, order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`)
      .replace(/{total}/g, `₹${order.total}`)
      .replace(/{order_date}/g, formattedDate)
      .replace(/{order_status}/g, order.order_status || 'Pending');
  }

  return `*${businessName.toUpperCase()}*
🛍️ *NEW ORDER*

*Order ID:*
#${order.order_number}

*Customer:*
${order.customer_name}

*Phone:*
${order.customer_phone}

*Delivery Address:*
${fullAddress}

*Products:*
${itemsText}

*Subtotal:* ₹${order.subtotal}
*Delivery:* ${order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}
*TOTAL:* ₹${order.total}

*Order Status:* ${order.order_status || 'Pending'}`;
}

export function generateWhatsAppChatUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // Prepend 91 for standard 10-digit Indian numbers without country code
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

export interface WhatsAppCustomerOrderInput {
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  items: Array<{
    name: string;
    variant?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export function buildWhatsAppCustomerOrderMessage({
  customerName,
  customerPhone,
  customerLocation,
  items,
  total,
}: WhatsAppCustomerOrderInput): string {
  let orderDetailsText = '';
  if (items.length === 1) {
    const item = items[0];
    const variantStr =
      item.variant && item.variant !== 'Standard' && item.variant !== 'Default'
        ? ` (${item.variant})`
        : '';
    orderDetailsText = `Product: ${item.name}${variantStr}\nQuantity: ${item.quantity}\nPrice: ₹${item.price}`;
  } else {
    orderDetailsText = items
      .map((item, index) => {
        const variantStr =
          item.variant && item.variant !== 'Standard' && item.variant !== 'Default'
            ? ` (${item.variant})`
            : '';
        return `${index + 1}. ${item.name}${variantStr} × ${item.quantity} — ₹${item.price * item.quantity}`;
      })
      .join('\n');
  }

  return `Hello BabyCry,

I would like to place an order.

Customer Details:
Name: ${customerName}
Phone: ${customerPhone}
Location: ${customerLocation}

Order Details:
${orderDetailsText}

Total: ₹${total}

Please confirm my order.`;
}
