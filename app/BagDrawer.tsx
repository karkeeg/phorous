'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cart-context';
import { formatNPR } from './currency';

const INK = '#1C1B19';
const CANVAS = '#EDE8DE';

export default function BagDrawer() {
  const { items, removeItem, setQty, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isDrawerOpen, closeDrawer]);

  const goToFullBag = () => {
    closeDrawer();
    router.push('/bag');
  };

  return (
    <>
      <div
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(28,27,25,.45)',
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? 'auto' : 'none',
          transition: 'opacity .35s ease',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bag"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201,
          width: 'min(400px, 92vw)',
          background: CANVAS, color: INK,
          fontFamily: "'Work Sans', sans-serif",
          boxShadow: '-4px 0 40px rgba(0,0,0,.25)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(28,27,25,.14)' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 19, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            Your Bag
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1, color: INK, padding: 4 }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#5c574e' }}>Your bag is empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid rgba(28,27,25,.12)' }}>
                <div style={{ width: 62, height: 78, flex: '0 0 auto', overflow: 'hidden', borderRadius: 3, background: '#ded7c9' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: '0 0 3px', fontSize: 14, fontFamily: 'Fraunces, serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8F8A7E' }}>{item.variant}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, whiteSpace: 'nowrap' }}>{formatNPR(item.price * item.qty)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(28,27,25,.22)', borderRadius: 999 }}>
                      <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label={`Decrease quantity of ${item.name}`} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>−</button>
                      <span style={{ minWidth: 18, textAlign: 'center', fontSize: 12 }}>{item.qty}</span>
                      <button type="button" onClick={() => setQty(item.id, item.qty + 1)} aria-label={`Increase quantity of ${item.name}`} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>+</button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: '#8F8A7E', textDecoration: 'underline', textUnderlineOffset: 3 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(28,27,25,.14)', padding: '18px 22px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontFamily: 'Fraunces, serif', fontSize: 16 }}>
              <span>Subtotal</span>
              <span>{formatNPR(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={goToFullBag}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: 999, border: 'none',
                background: INK, color: CANVAS, fontSize: 12, letterSpacing: '.16em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              See full page
            </button>
          </div>
        )}
      </div>
    </>
  );
}
