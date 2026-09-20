'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../cart-context';
import { formatNPR } from '../currency';

type Shipping = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type PaymentMethod = 'esewa' | 'card' | 'cod';

const INK = '#1C1B19';
const CANVAS = '#EDE8DE';
const ACCENT = '#9C7A3C';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid rgba(28,27,25,.22)',
  borderRadius: 6, fontSize: 14, fontFamily: "'Work Sans', sans-serif", color: INK, background: 'transparent',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
  color: '#8F8A7E', marginBottom: 6,
};

function Field({
  label, value, onChange, type = 'text', placeholder, maxLength, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; maxLength?: number; autoComplete?: string;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'esewa', label: 'eSewa' },
  { id: 'card', label: 'Card' },
  { id: 'cod', label: 'Cash on delivery' },
];

const REDIRECT_DELAY_MS = 4000;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [processing, setProcessing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('esewa');
  const [orderPlaced, setOrderPlaced] = useState<{ orderId: string; total: number } | null>(null);
  const placedRef = useRef(false);

  const [shipping, setShipping] = useState<Shipping>({
    fullName: '', email: '', address: '', city: '', postalCode: '', country: '',
  });

  useEffect(() => {
    if (items.length === 0 && !placedRef.current) {
      router.replace('/bag');
    }
  }, [items, router]);

  useEffect(() => {
    if (!orderPlaced) return;
    const timer = setTimeout(() => router.push('/'), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [orderPlaced, router]);

  if (items.length === 0 && !orderPlaced) return null;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported on this browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: 'application/json' } }
          );
          if (!res.ok) throw new Error('lookup failed');
          const data = await res.json();
          const a = data.address ?? {};
          const streetLine = [a.house_number, a.road].filter(Boolean).join(' ');
          setShipping(prev => ({
            ...prev,
            address: streetLine || a.suburb || prev.address,
            city: a.city || a.town || a.village || a.county || prev.city,
            postalCode: a.postcode || prev.postalCode,
            country: a.country || prev.country,
          }));
        } catch {
          setLocationError("Couldn't determine your address from your location.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError('Location permission was denied.');
        setLocating(false);
      }
    );
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const orderId = `PH-${Date.now().toString(36).toUpperCase()}`;
    const total = subtotal;

    // Simulated processing delay — this is a frontend-only demo, no payment is ever sent anywhere.
    setTimeout(() => {
      placedRef.current = true;
      clear();
      setProcessing(false);
      setOrderPlaced({ orderId, total });
    }, 1100);
  };

  return (
    <div style={{ background: CANVAS, color: INK, minHeight: '100vh', fontFamily: "'Work Sans', sans-serif" }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px,4vw,56px)', borderBottom: '1px solid rgba(28,27,25,.14)' }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 19, letterSpacing: '.34em', textTransform: 'uppercase', color: INK, textDecoration: 'none' }}>
          Phorous
        </Link>
        <Link href="/bag" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: INK, opacity: 0.7, textDecoration: 'none' }}>
          Back to bag
        </Link>
      </header>

      {orderPlaced ? (
        <main style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(60px,12vh,140px) clamp(20px,4vw,56px)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: ACCENT, marginBottom: 18 }}>
            Order confirmed
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 14px' }}>
            Thank you for your order.
          </h1>
          <p style={{ color: '#5c574e', fontSize: 15 }}>
            Your bag is now empty. Redirecting you home shortly.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', marginTop: 28, padding: '15px 30px', borderRadius: 999, background: INK, color: CANVAS, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Continue shopping
          </Link>
        </main>
      ) : (
      <main className="checkout-layout" style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(40px,7vh,80px) clamp(20px,4vw,56px)', display: 'grid', gap: 'clamp(32px,5vw,64px)' }}>
        <div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 32, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            <span style={{ color: step === 1 ? INK : '#8F8A7E', fontWeight: step === 1 ? 600 : 400 }}>1. Shipping</span>
            <span style={{ color: step === 2 ? INK : '#8F8A7E', fontWeight: step === 2 ? 600 : 400 }}>2. Payment</span>
          </div>

          {step === 1 && (
            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 28, margin: '0 0 8px' }}>Shipping details</h1>
              <Field label="Full name" value={shipping.fullName} onChange={v => setShipping({ ...shipping, fullName: v })} autoComplete="name" />
              <Field label="Email" type="email" value={shipping.email} onChange={v => setShipping({ ...shipping, email: v })} autoComplete="email" />

              <div>
                <Field label="Address" value={shipping.address} onChange={v => setShipping({ ...shipping, address: v })} autoComplete="street-address" />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  style={{
                    marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 999, border: `1px solid rgba(28,27,25,.22)`,
                    background: 'transparent', color: ACCENT, fontSize: 11, letterSpacing: '.1em',
                    textTransform: 'uppercase', cursor: locating ? 'default' : 'pointer',
                  }}
                >
                  {locating ? 'Locating…' : 'Use current location'}
                </button>
                {locationError && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#b3453a' }}>{locationError}</p>
                )}
              </div>

              <div className="city-postal" style={{ display: 'grid', gap: 16 }}>
                <Field label="City" value={shipping.city} onChange={v => setShipping({ ...shipping, city: v })} autoComplete="address-level2" />
                <Field label="Postal code" value={shipping.postalCode} onChange={v => setShipping({ ...shipping, postalCode: v })} autoComplete="postal-code" />
              </div>
              <Field label="Country" value={shipping.country} onChange={v => setShipping({ ...shipping, country: v })} autoComplete="country-name" />

              <button
                type="submit"
                style={{
                  marginTop: 12, padding: '15px 28px', borderRadius: 999, border: 'none',
                  background: INK, color: CANVAS, fontSize: 12, letterSpacing: '.18em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Continue to payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 28, margin: '0 0 8px' }}>Payment</h1>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: '#8F8A7E' }}>
                Demo checkout — no real payment is processed or stored.
              </p>

              <div>
                <span style={labelStyle}>Payment method</span>
                <div className="payment-methods" style={{ display: 'flex', gap: 10 }}>
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      style={{
                        flex: 1, padding: '12px 10px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${method === m.id ? ACCENT : 'rgba(28,27,25,.22)'}`,
                        background: method === m.id ? 'rgba(156,122,60,.12)' : 'transparent',
                        color: method === m.id ? ACCENT : INK,
                        fontSize: 12, letterSpacing: '.06em',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'card' && (
                <p style={{ margin: 0, fontSize: 13, color: '#5c574e' }}>
                  You&apos;ll be redirected to your card provider to complete payment. (Demo — no real redirect happens.)
                </p>
              )}

              {method === 'esewa' && (
                <p style={{ margin: 0, fontSize: 13, color: '#5c574e' }}>
                  You&apos;ll be redirected to eSewa to complete payment. (Demo — no real redirect happens.)
                </p>
              )}

              {method === 'cod' && (
                <p style={{ margin: 0, fontSize: 13, color: '#5c574e' }}>
                  Pay in cash when your order arrives.
                </p>
              )}

              <div className="payment-actions" style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ padding: '15px 22px', borderRadius: 999, border: '1px solid rgba(28,27,25,.22)', background: 'transparent', color: INK, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    flex: 1, padding: '15px 28px', borderRadius: 999, border: 'none',
                    background: processing ? '#8F8A7E' : ACCENT, color: CANVAS, fontSize: 12,
                    letterSpacing: '.18em', textTransform: 'uppercase',
                    cursor: processing ? 'default' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {processing ? 'Processing…' : `Confirm order — ${formatNPR(subtotal)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="order-summary">
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 18, marginBottom: 16 }}>Order summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 52, height: 64, flex: '0 0 auto', overflow: 'hidden', borderRadius: 3, background: '#ded7c9' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 13 }}>
                  <span>{item.name} <span style={{ color: '#8F8A7E' }}>× {item.qty}</span></span>
                  <span style={{ color: '#8F8A7E' }}>{item.variant}</span>
                </div>
                <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatNPR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(28,27,25,.14)', marginTop: 18, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontFamily: 'Fraunces, serif', fontSize: 17 }}>
            <span>Total</span>
            <span>{formatNPR(subtotal)}</span>
          </div>
        </aside>
      </main>
      )}

      {orderPlaced && (
        <div
          role="status"
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 100,
            width: 'min(340px, calc(100vw - 40px))', background: INK, color: CANVAS,
            borderRadius: 10, padding: '18px 20px', boxShadow: '0 12px 32px rgba(0,0,0,.28)',
            animation: 'phToastIn .35s ease-out',
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: ACCENT }}>
            Order placed
          </p>
          <p style={{ margin: '0 0 4px', fontFamily: 'Fraunces, serif', fontSize: 17 }}>
            {orderPlaced.orderId} confirmed
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 13, opacity: 0.75 }}>
            {formatNPR(orderPlaced.total)} · your bag has been emptied.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: CANVAS, textDecoration: 'underline' }}
          >
            Continue shopping
          </Link>
        </div>
      )}

      <style>{`
        @keyframes phToastIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .checkout-layout {
          grid-template-columns: minmax(0,1fr) minmax(0,320px);
        }

        .order-summary {
          border-left: 1px solid rgba(28,27,25,.14);
          padding-left: clamp(24px,4vw,40px);
        }

        .city-postal {
          grid-template-columns: 1fr 1fr;
        }

        @media (max-width: 720px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .order-summary {
            border-left: none;
            border-top: 1px solid rgba(28,27,25,.14);
            padding-left: 0;
            padding-top: 32px;
          }
        }

        @media (max-width: 480px) {
          .payment-methods {
            flex-direction: column;
          }
          .payment-actions {
            flex-direction: column;
          }
          .payment-actions button {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .city-postal {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
