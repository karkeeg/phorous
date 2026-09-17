'use client';

import { useEffect } from 'react';
import { useCart } from './cart-context';

export default function CartBadge() {
  const { count } = useCart();

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-x="bagcount"]');
    if (el) el.textContent = String(count);
  }, [count]);

  return null;
}
