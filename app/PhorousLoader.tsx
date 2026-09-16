'use client';

import { useEffect } from 'react';

export default function PhorousLoader() {
  useEffect(() => {
    const qs = <T extends HTMLElement>(sel: string) =>
      document.querySelector<T>(sel);
    const qsa = <T extends HTMLElement>(sel: string) =>
      Array.from(document.querySelectorAll<T>(sel));

    const scroller = qs<HTMLElement>('[data-x="scroller"]');
    const spacer   = qs<HTMLElement>('[data-x="spacer"]');
    const nav      = qs<HTMLElement>('[data-x="nav"]');
    const track    = qs<HTMLElement>('[data-x="herotrack"]');
    const pin      = qs<HTMLElement>('[data-x="heropin"]');
    const himg     = qs<HTMLElement>('[data-x="heroimg"]');
    const htext    = qs<HTMLElement>('[data-x="herotext"]');
    const cue      = qs<HTMLElement>('[data-x="cue"]');
    const ring     = qs<HTMLElement>('[data-x="ring"]');
    const ringLabel = qs<HTMLElement>('[data-x="ringlabel"]');
    const brand    = qs<HTMLElement>('[data-x="brand"]');
    const navlinks = qsa<HTMLElement>('[data-x="navlink"]');
    const navcta   = qs<HTMLElement>('[data-x="navcta"]');
    const hCta     = qs<HTMLElement>('[data-x="herocta"]');
    const sub      = qs<HTMLElement>('[data-x="subscribe"]');

    if (!scroller || !spacer || !nav || !track || !pin || !himg || !htext) return;

    const ACCENT = '#9C7A3C';
    const GAIN   = 1;
    // On touch devices the browser's native momentum scroll provides smoothness.
    // Adding our own ease on top creates a double-delay that feels sluggish.
    // Detect touch and use instant-snap (ease=1) so we just mirror native scroll.
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    const EASE   = isTouch ? 1 : 0.085;


    let cur = 0;
    let mx = -999, my = -999, rx = -999, ry = -999;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    const listeners: [EventTarget, string, EventListener][] = [];

    const on = (
      t: EventTarget,
      evt: string,
      fn: EventListener,
      opts?: AddEventListenerOptions
    ) => {
      t.addEventListener(evt, fn, opts);
      listeners.push([t, evt, fn]);
    };

    // ---- accent ----
    qsa<HTMLElement>('[data-accent="color"]').forEach(el => { el.style.color = ACCENT; });
    if (navcta) navcta.style.borderColor = ACCENT;
    if (sub)    sub.style.borderColor    = ACCENT;

    // ---- scroll container detection ----
    const findScroller = (): HTMLElement => {
      let n: HTMLElement | null = scroller!;
      while (n) {
        const cs = getComputedStyle(n);
        if (n.scrollHeight > n.clientHeight + 1 && /(auto|scroll|overlay)/.test(cs.overflowY))
          return n;
        n = n.parentElement;
      }
      if (document.documentElement.scrollHeight > document.documentElement.clientHeight + 1)
        return document.documentElement;
      if (document.body.scrollHeight > document.body.clientHeight + 1)
        return document.body;
      return (document.scrollingElement as HTMLElement) ?? document.documentElement;
    };
    const getTop = () => findScroller().scrollTop;

    // ---- reduced motion ----
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // ---- reveal + parallax lists ----
    const reveals = qsa<HTMLElement>('[data-r]').map(el => ({
      el,
      delay: parseFloat(el.dataset.delay ?? '0'),
      done: false,
    }));
    const parallax = qsa<HTMLElement>('[data-p]').map(el => ({
      el,
      f: parseFloat(el.dataset.p ?? '0'),
    }));

    const settle = (el: HTMLElement, delay: number) => {
      el.style.transition = `transform 1.15s cubic-bezier(.16,1,.3,1) ${delay}s,`
        + ` clip-path 1.25s cubic-bezier(.16,1,.3,1) ${delay}s,`
        + ` opacity .95s ease ${delay}s`;
      el.style.transform   = 'none';
      el.style.clipPath    = 'inset(0 0 0 0)';
      el.style.opacity     = '1';
    };

    // ---- nav solidify ----
    let navSolid = false;
    const solidifyNav = (solid: boolean) => {
      nav!.style.background       = solid ? 'rgba(237,232,222,.92)' : 'transparent';
      nav!.style.backdropFilter   = solid ? 'blur(14px)' : 'none';
      nav!.style.borderBottomColor = solid ? 'rgba(28,27,25,.14)' : 'rgba(237,232,222,0)';
      nav!.style.padding          = solid
        ? '14px clamp(20px,4vw,56px)' : '22px clamp(20px,4vw,56px)';
      const ink = '#1C1B19', canvas = '#EDE8DE';
      if (brand) brand.style.color = solid ? ink : canvas;
      navlinks.forEach(l => { l.style.color = solid ? ink : canvas; });
      if (navcta) navcta.style.color = solid ? ink : canvas;
    };

    // ---- reduced-motion shortcut ----
    if (reduced) {
      qsa<HTMLElement>('[data-w]').forEach(w => { w.style.transform = 'none'; });
      reveals.forEach(o => { o.done = true; settle(o.el, 0); o.el.style.transition = 'none'; });
      scroller.style.position = 'relative';
      spacer.style.display    = 'none';
      track.style.height      = '100vh';
      pin.style.position      = 'relative';
      if (cue) cue.style.animation = 'none';
      himg.style.transform    = 'scale(1)';
      solidifyNav(true);
      return;
    }

    // ---- hero entrance words ----
    const words = qsa<HTMLElement>('[data-w]');
    words.forEach((w, i) => {
      w.style.transition = `transform 1.25s cubic-bezier(.16,1,.3,1) ${(0.18 + i * 0.085).toFixed(3)}s`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      words.forEach(w => { w.style.transform = 'translateY(0)'; });
      himg.style.transition = 'transform 2.6s cubic-bezier(.19,1,.22,1)';
      himg.style.transform  = 'scale(1.02)';
    }));
    if (hCta?.parentElement) {
      setTimeout(() => { hCta.parentElement!.style.overflow = 'visible'; }, 1600);
    }

    // ---- measure (spacer = full scroll height) ----
    const measure = () => { spacer!.style.height = scroller!.scrollHeight + 'px'; };
    measure();
    if (window.ResizeObserver) {
      ro = new ResizeObserver(measure);
      ro.observe(scroller);
    }
    on(window, 'resize', measure as EventListener);
    on(window, 'load',   measure as EventListener);
    setTimeout(measure, 300);
    setTimeout(measure, 800); // extra pass after fonts/images settle

    // ---- cursor ring ----
    let hoverLabel = '';
    on(window, 'mousemove', ((e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (rx < -500) { rx = e.clientX; ry = e.clientY; }
    }) as EventListener);
    qsa<HTMLElement>('[data-cursor]').forEach(el => {
      on(el, 'mouseenter', () => { hoverLabel = el.dataset.cursor ?? ''; });
      on(el, 'mouseleave', () => { hoverLabel = ''; });
    });

    // ---- magnetic buttons ----
    qsa<HTMLElement>('[data-mag]').forEach(el => {
      on(el, 'mousemove', ((e: MouseEvent) => {
        const b  = el.getBoundingClientRect();
        const dx = (e.clientX - (b.left + b.width / 2)) * 0.3 * GAIN;
        const dy = (e.clientY - (b.top  + b.height / 2)) * 0.34 * GAIN;
        el.style.transition = 'transform .12s linear,background .35s ease,color .35s ease,border-color .35s ease';
        el.style.transform  = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
      }) as EventListener);
      on(el, 'mouseleave', () => {
        el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1),background .35s ease,color .35s ease,border-color .35s ease';
        el.style.transform  = 'translate(0,0)';
      });
    });

    // ---- tilt cards ----
    qsa<HTMLElement>('[data-tilt]').forEach(card => {
      const img = card.querySelector<HTMLElement>('[data-x="pimg"]');
      on(card, 'mousemove', ((e: MouseEvent) => {
        const b  = card.getBoundingClientRect();
        const nx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
        const ny = (e.clientY - (b.top  + b.height / 2)) / (b.height / 2);
        card.style.transition = 'transform .18s linear';
        card.style.transform  = `perspective(1100px) rotateY(${(nx * 5.5 * GAIN).toFixed(2)}deg) rotateX(${(-ny * 5.5 * GAIN).toFixed(2)}deg) translateZ(0)`;
        if (img) img.style.transform = `scale(1.09) translate(${(-nx * 12).toFixed(1)}px,${(-ny * 12).toFixed(1)}px)`;
      }) as EventListener);
      on(card, 'mouseleave', () => {
        card.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)';
        card.style.transform  = 'perspective(1100px) rotateY(0deg) rotateX(0deg)';
        if (img) img.style.transform = 'scale(1.03)';
      });
    });

    // ---- hover states ----
    if (hCta) {
      on(hCta, 'mouseenter', () => { hCta.style.background = ACCENT; hCta.style.borderColor = ACCENT; });
      on(hCta, 'mouseleave', () => { hCta.style.background = 'transparent'; hCta.style.borderColor = 'rgba(237,232,222,.42)'; });
    }
    if (navcta) {
      on(navcta, 'mouseenter', () => { navcta.style.background = ACCENT; });
      on(navcta, 'mouseleave', () => { navcta.style.background = 'transparent'; });
    }
    if (sub) {
      on(sub, 'mouseenter', () => { sub.style.background = ACCENT; sub.style.color = '#1C1B19'; });
      on(sub, 'mouseleave', () => { sub.style.background = 'transparent'; sub.style.color = '#EDE8DE'; });
    }

    // ---- smooth-scroll anchors ----
    qsa<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
      on(a, 'click', ((e: MouseEvent) => {
        const id = (a.getAttribute('href') ?? '').slice(1);
        const t  = id === 'top' ? document.body : document.getElementById(id);
        if (!t) return;
        e.preventDefault();
        const sc  = findScroller();
        const abs = id === 'top' ? 0 : Math.max(0, t.getBoundingClientRect().top + getTop());
        sc.scrollTo({ top: abs, behavior: 'smooth' });
      }) as EventListener);
    });

    // ---- animation tick ----
    const tick = () => {
      const vh     = window.innerHeight || 800;
      const target = getTop();
      cur += (target - cur) * EASE;
      if (Math.abs(target - cur) < 0.06) cur = target;

      scroller!.style.transform = `translate3d(0,${(-cur).toFixed(2)}px,0)`;

      // hero pin
      const tr   = track!.getBoundingClientRect();
      const span = Math.max(1, track!.offsetHeight - vh);
      const p    = Math.min(1, Math.max(0, -tr.top / span));
      pin!.style.transform   = `translateY(${(p * span).toFixed(2)}px) scale(${(1 - 0.14 * p * GAIN).toFixed(4)})`;
      pin!.style.borderRadius = `${(p * 26 * GAIN).toFixed(1)}px`;
      pin!.style.filter      = `brightness(${(1 - 0.42 * p * GAIN).toFixed(3)})`;
      if (p > 0.002) {
        himg!.style.transition = 'none';
        himg!.style.transform  = `scale(${(1.02 + 0.13 * p * GAIN).toFixed(4)}) translateY(${(p * 90 * GAIN).toFixed(1)}px)`;
      }
      htext!.style.transform = `translateY(${(-p * 150 * GAIN).toFixed(1)}px)`;
      htext!.style.opacity   = String(Math.max(0, 1 - p * 1.9));
      if (cue) cue.style.opacity = String(Math.max(0, 1 - p * 4));

      // nav
      const wantSolid = cur > vh * 0.72;
      if (wantSolid !== navSolid) { navSolid = wantSolid; solidifyNav(wantSolid); }

      // parallax
      for (const o of parallax) {
        const b = o.el.getBoundingClientRect();
        if (b.bottom < -200 || b.top > vh + 200) continue;
        const rel = (b.top + b.height / 2 - vh / 2) / vh;
        o.el.style.transform = `translate3d(0,${(rel * o.f * 150 * GAIN).toFixed(1)}px,0)`;
      }

      // reveals
      for (const o of reveals) {
        if (o.done) continue;
        const b = o.el.getBoundingClientRect();
        if (b.top < vh * 0.9 && b.bottom > -80) { o.done = true; settle(o.el, o.delay); }
      }

      // cursor ring
      if (ring && ringLabel) {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        const big = hoverLabel !== '';
        ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0) scale(${big ? 1.5 : 1})`;
        ring.style.opacity   = mx < -500 ? '0' : (big ? '1' : '.5');
        if (ringLabel.textContent !== hoverLabel) ringLabel.textContent = hoverLabel;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ---- cleanup ----
    return () => {
      cancelAnimationFrame(raf);
      listeners.forEach(([t, e, f]) => t.removeEventListener(e, f));
      if (ro) ro.disconnect();
    };
  }, []);

  return null;
}
