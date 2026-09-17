'use client';

import Link from 'next/link';
import { useCart } from '../cart-context';
import { formatNPR } from '../currency';

export default function BagPage() {
  const { items, removeItem, setQty, subtotal } = useCart();

  return (
    <div style={{ background: '#EDE8DE', color: '#1C1B19', minHeight: '100vh', fontFamily: "'Work Sans', sans-serif" }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px,4vw,56px)', borderBottom: '1px solid rgba(28,27,25,.14)' }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 19, letterSpacing: '.34em', textTransform: 'uppercase', color: '#1C1B19', textDecoration: 'none' }}>
          Phorous
        </Link>
        <Link href="/#collection" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1C1B19', opacity: 0.7, textDecoration: 'none' }}>
          Continue shopping
        </Link>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,7vh,80px) clamp(20px,4vw,56px)' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(30px,4vw,48px)', letterSpacing: '-.02em', marginBottom: 8 }}>
          Your Bag
        </h1>
        <p style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8F8A7E', marginBottom: 'clamp(32px,5vh,56px)' }}>
          {items.length === 0 ? 'Empty' : `${items.reduce((n, i) => n + i.qty, 0)} item${items.reduce((n, i) => n + i.qty, 0) === 1 ? '' : 's'}`}
        </p>

        {items.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid rgba(28,27,25,.14)' }}>
            <p style={{ fontSize: 15, color: '#5c574e', marginBottom: 24 }}>Your bag is empty.</p>
            <Link
              href="/#collection"
              style={{
                display: 'inline-flex', padding: '14px 28px', border: '1px solid #1C1B19',
                borderRadius: 999, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase',
                color: '#1C1B19', textDecoration: 'none',
              }}
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div style={{ borderTop: '1px solid rgba(28,27,25,.14)' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', gap: 20, padding: '24px 0',
                    borderBottom: '1px solid rgba(28,27,25,.14)',
                  }}
                >
                  <div style={{ width: 96, height: 120, flex: '0 0 auto', overflow: 'hidden', borderRadius: 3, background: '#ded7c9' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 18, margin: '0 0 4px' }}>{item.name}</h3>
                        <p style={{ margin: 0, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8F8A7E' }}>{item.variant}</p>
                      </div>
                      <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, whiteSpace: 'nowrap' }}>
                        {formatNPR(item.price * item.qty)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(28,27,25,.22)', borderRadius: 999 }}>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          style={{ width: 30, height: 30, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 15 }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: 24, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          style={{ width: 30, height: 30, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 15 }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8F8A7E', textDecoration: 'underline', textUnderlineOffset: 3 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0' }}>
              <span style={{ fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5c574e' }}>Subtotal</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22 }}>{formatNPR(subtotal)}</span>
            </div>
            <p style={{ fontSize: 12, color: '#8F8A7E', marginBottom: 24 }}>Shipping and taxes calculated at checkout.</p>

            <Link
              href="/checkout"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '17px 28px', borderRadius: 999, background: '#1C1B19',
                color: '#EDE8DE', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Checkout
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
