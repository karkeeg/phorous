'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatNPR } from '../../currency';

type OrderItem = {
  id: string;
  name: string;
  variant: string;
  price: number;
  image: string;
  qty: number;
};

type OrderSnapshot = {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shippingName: string;
  cardLast4: string;
};

const INK = '#1C1B19';
const CANVAS = '#EDE8DE';

export default function ConfirmationPage() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // sessionStorage is only available client-side, so this must run post-mount.
    try {
      const raw = sessionStorage.getItem('phorous_last_order');
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(JSON.parse(raw));
        sessionStorage.removeItem('phorous_last_order');
      }
    } catch {
      // ignore — falls through to the "no recent order" state
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!order) {
    return (
      <div style={{ background: CANVAS, color: INK, minHeight: '100vh', fontFamily: "'Work Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 28, marginBottom: 12 }}>No recent order</h1>
          <p style={{ color: '#5c574e', marginBottom: 24 }}>We couldn&apos;t find an order to show you.</p>
          <Link href="/" style={{ display: 'inline-flex', padding: '14px 28px', border: `1px solid ${INK}`, borderRadius: 999, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: CANVAS, color: INK, minHeight: '100vh', fontFamily: "'Work Sans', sans-serif" }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px clamp(20px,4vw,56px)', borderBottom: '1px solid rgba(28,27,25,.14)' }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 19, letterSpacing: '.34em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>
          Phorous
        </Link>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(50px,8vh,100px) clamp(20px,4vw,56px)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#9C7A3C', marginBottom: 18 }}>Order confirmed</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(30px,4.4vw,48px)', marginBottom: 14 }}>
          Thank you{order.shippingName ? `, ${order.shippingName.split(' ')[0]}` : ''}.
        </h1>
        <p style={{ color: '#5c574e', fontSize: 15, marginBottom: 6 }}>
          Order <strong>{order.orderId}</strong> has been placed.
        </p>
        {order.cardLast4 && (
          <p style={{ color: '#8F8A7E', fontSize: 13, marginBottom: 40 }}>Charged to card ending in {order.cardLast4}</p>
        )}

        <div style={{ textAlign: 'left', borderTop: '1px solid rgba(28,27,25,.14)', marginTop: 24 }}>
          {order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid rgba(28,27,25,.14)' }}>
              <div style={{ width: 56, height: 70, flex: '0 0 auto', overflow: 'hidden', borderRadius: 3, background: '#ded7c9' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 13 }}>
                <span>{item.name} <span style={{ color: '#8F8A7E' }}>× {item.qty}</span></span>
                <span style={{ color: '#8F8A7E' }}>{item.variant}</span>
              </div>
              <span style={{ fontSize: 13, alignSelf: 'center', whiteSpace: 'nowrap' }}>{formatNPR(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', fontFamily: 'Fraunces, serif', fontSize: 18 }}>
            <span>Total</span>
            <span>{formatNPR(order.subtotal)}</span>
          </div>
        </div>

        <p style={{ color: '#8F8A7E', fontSize: 13, margin: '24px 0 32px' }}>
          A confirmation has been &quot;sent&quot; to your email. Estimated delivery in 5–7 business days.
        </p>

        <Link
          href="/"
          style={{ display: 'inline-flex', padding: '15px 30px', borderRadius: 999, background: INK, color: CANVAS, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          Continue shopping
        </Link>
      </main>
    </div>
  );
}
