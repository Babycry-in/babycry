import { redirect } from 'next/navigation';

export default function OrderRootPage() {
  redirect('/order/cart?source=cart');
}
