/* ══ Iteration 5 — the bot's full page, 1:1 with Figma For-You 789:10090 ("Option 2 · Light", 375 × 1264) ═════════
   A copy of iteration 4's flow (the circle reveal out of the bot, the "Curating for you" beat, pull-to-close, the bot's
   reactions, add-to-cart into the bot) with Figma's page built into #orbiSheet at its own x / y (yf-page.css):
     · "TOP DEALS, PICKED JUST FOR YOU" on its yellow sticker, a pixel heart and a sparkle
     · the deck of top picks (noon's Product card, 222 wide): swipe the front card away, it swings out and tucks in at
       the back of the pile; the two cards behind it sit tipped and softly out of focus, as Figma's ghost cards
     · "LET'S RESTOCK, AT LOW PRICES" and the basics carousel: the middle card 222 wide, its neighbours the Small card
       (181) 225.5 either side — every card morphs between the two as it moves
     · the arc and "See all basics"
   Every card's nudge line rolls through noon's PLP nudges (Figma's "Nudges - PLP" strip).
   The bot rests in the top-right corner of this page (the heading is where iteration 4's big bot sat). */
const sheet = document.getElementById('orbiSheet');
const D = '';                                   // Noontree's dirham glyph
const H = (k) => { try { window.Haptics && window.Haptics[k] && window.Haptics[k](); } catch {} };
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// the reveal: a long, soft settle (expo-out) for the move, a quicker fade — content glides in rather than pops
const REVEAL = { ms: 1100, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', fadeMs: 640, fade: 'cubic-bezier(0.25, 0.1, 0.25, 1)' };
const FADE_IN = 'cubic-bezier(0.33, 1, 0.68, 1)';
const A = (f) => `f/${f}`;                    // this iteration's art
const F = (f) => A(`f7/${f}`);                // Figma 789:10090's exports

// ─── data: Figma's products first (AirPods in the deck; Pampers in the middle of the carousel with Gerber and MTR
// either side), then noon.com's 11.11 deals and household staples (2026-11-09)
const num = (v) => (v % 1 ? v.toFixed(2) : String(v));      // Figma: "16.20", "899" — no thousands comma
const pct = (it) => (it.off != null ? it.off : Math.floor((1 - it.price / it.was) * 100));
const DATA = {
  deck: [
    { src: F('00ff6.png'), crop: true, name: 'Apple Airpods Pro 2 Wireless Earbuds', price: 899, was: 1399, off: 33, rating: 4.3, count: 128 },
    { src: A('fy/df9f1.png'), cover: true, name: 'Ninja Crispi 4 in 1 Air Fryer Cooking System 4.2L & 3.1 L Glass', price: 899, was: 1399, off: 33, rating: 4.3, count: 128 },
    { img: 'deck0', name: 'evvoli Air Fryer 8 Preset Programs, Digital Display 5.5L 1850W', price: 102, was: 499 },
    { img: 'deck1', name: 'Samsung Galaxy S26 Ultra Dual SIM Cobalt Violet 12GB RAM 256GB 5G', price: 3349, was: 5099 },
    { img: 'deck2', name: 'Hisense 7Kg Front Loading Washing Machine, 1200RPM, Steam Wash', price: 749, was: 999 },
    { img: 'deck3', name: 'Hawkins Futura 5L Hard Anodised Deep Kadhai with Steel Lid', price: 67, was: 204 },
    { img: 'deck4', name: 'FUJIFILM Instax Mini EVO Hybrid Instant Camera, Gentle Rose', price: 779, was: 999 },
  ],
  refill: [    // index 0 is the middle card, 1 to its right, the last to its left
    { src: F('4716a.png'), name: 'Pampers Ultimate Comfort Pants Diapers Size 6 (16+kg) Super Saving Pack', price: 44.89, was: 74.01, off: 39, rating: 4.7 },
    { src: F('2e34c.png'), name: 'MTR Dosa Mix, 200g', price: 2.7, was: 5.67, off: 52, rating: 2.0 },
    { src: A('fy/5e392.png'), name: 'Fine Facial Tissue 200 Sheets 2 Ply Pack of 10 White', price: 39.28, was: 59, off: 33, rating: 4.3 },
    { img: 'refill1', name: 'Persil Power Gel Liquid Laundry Detergent Deep Clean 4.8L', price: 41.7, was: 82.6 },
    { src: A('fy/d1e4f.png'), name: 'Fine Kitchen Towel 60 Sheets 3 Ply Pack of 12 Rolls White 26.5x21cm', price: 30.7, was: 39.19, off: 22, rating: 4.3 },
    { img: 'refill3', name: 'Fairy Lavender Dishwashing Liquid, 3X Grease Cutting Power', price: 12.9, was: 18.34 },
    { src: A('fy/c7a58.png'), name: 'Nescafe Classic Coffee Jar 190grams Single', price: 30.7, was: 39.19, off: 22, rating: 4.3 },
    { src: F('c4463.png'), name: 'Gerber Organic NutriPuffs Raspberry & Banana, 35g', price: 16.2, was: 27.27, off: 41, rating: 4.3 },
  ],
};
const SRC = (it) => it.src || A(`p/${it.img}.webp`);

// ─── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Figma's outline/heart (18 × 18), inline so it can fill
const HEART = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M16 6.54545C16 4.58735 14.3677 3 12.3542 3C10.8487 3 9.55633 3.88737 9 5.1536C8.44367 3.88737 7.15131 3 5.64583 3C3.6323 3 2 4.58735 2 6.54545C2 12.2344 9 16 9 16C9 16 16 12.2344 16 6.54545Z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// "Nudges - PLP": the lines at Figma's own offsets in the strip (the last one is the first again, so it loops)
const NUDGES = [['89102', 'Lowest price in 30 days'], ['96509', 'Free delivery'], ['0aaea', 'Selling out fast'], ['cd44d', '5k+ units sold'], ['4c424', '#2 Bestseller'], ['89102', 'Lowest price in 30 days']];
const NTOP = [0, 41.09, 75.33, 109.58, 143.82, 178.06];
const NUDGE = `<span class="ng" aria-label="${NUDGES[0][1]}"><span class="run">${NUDGES.map(([f, t], i) => `<span style="top:${NTOP[i]}px"><img src="${F(f + '.svg')}" alt="" draggable="false"><b>${t}</b></span>`).join('')}</span></span>`;
// noon's Product card (Figma 801:1043): the photo box with the heart and the +, the name, rating + nudge, price, express
const card = (it, refill) => `<div class="pc${refill ? ' r' : ''} rv">
  <div class="main"><div class="ph${it.crop ? ' crop' : ''}${it.cover ? ' cover' : ''}"><img src="${SRC(it)}" alt="" draggable="false"></div>
    <button class="pc-add" type="button" aria-label="Add to cart" aria-pressed="false"><img class="pl" src="${F('472fb.svg')}" alt="" draggable="false"><span class="ok">${CHECK}</span></button>
    <button class="pc-wish" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button></div>
  <div class="dt">
    <p class="nm">${it.name}</p>
    <div class="mt">${it.rating ? `<span class="rt"><img src="${F('73954.svg')}" alt="" draggable="false">${it.rating.toFixed(1)}${!refill && it.count ? ` (${it.count})` : ''}</span>` : ''}${NUDGE}</div>
    <div class="pg"><div class="pr"><b><i>${D}</i> ${num(it.price)}</b><s>${num(it.was)}</s><em>${pct(it)}%</em></div><img class="ex" src="${F('2232f.svg')}" alt="express · Today" draggable="false"></div>
  </div>
</div>`;
const deckCard = (it, i) => `<div class="d3-dk" data-i="${i}">${card(it, false)}</div>`;
const refillCard = (it, i) => `<div class="d3-rslot" data-i="${i}">${card(it, true)}</div>`;
// the sticker headings (Figma "heading · top deals" 789:10328 / "heading · let's restock" 789:10322): the yellow ribbon,
// a white word and an orange-gradient word tipped −3° (each with Figma's black outside stroke and hard shadow), the black
// line under them at −2.5°. Each word's box is placed by
// its centre and tipped there; the reveal moves the word inside it (so the tilt never animates)
const heading = (cls, k, ribbon, a, b, c) => `<div class="d3-abs f5-hd ${cls}">
  <img class="rb rv" data-k="${k}0" src="${F(ribbon)}" alt="" draggable="false">
  <span class="w a"><b class="rv" data-k="${k}1" data-t="${a}"><span>${a}</span></b></span><span class="w g"><b class="rv" data-k="${k}2" data-t="${b}"><span>${b}</span></b></span>
  <span class="w c"><b class="rv" data-k="${k}3">${c}</b></span></div>`;
const dec = (cls, k, f) => `<span class="d3-abs f5-dec ${cls}"><i class="t"><img class="rv" data-k="${k}" src="${F(f)}" alt="" draggable="false"></i></span>`;

const scroller = document.createElement('div');
scroller.className = 'yf-scroll d3-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="d3 f5" data-node-id="789:10094">
  ${heading('td', 't', '9b612.svg', 'TOP', 'DEALS,', 'PICKED JUST FOR YOU')}
  ${dec('h1', 'tx', 'c2f52.svg')}${dec('s1', 'tx', '1984d.svg')}
  <div class="d3-abs d3-deck" data-no-drag aria-roledescription="carousel" aria-label="Top deals">${DATA.deck.map(deckCard).join('')}</div>
  ${heading('rs', 'r', 'ae09d.svg', 'LET\'S', 'RESTOCK,', 'AT LOW PRICES')}
  ${dec('h2', 'rx', '20143.svg')}${dec('s2', 'rx', '1984d.svg')}
  <div class="d3-abs d3-refill" data-k="refill" data-no-drag aria-roledescription="carousel" aria-label="Restock at low prices">${DATA.refill.map(refillCard).join('')}</div>
  <img class="d3-abs f5-arc rv" data-k="arc" src="${F('89823.svg')}" alt="" draggable="false">
  <button class="d3-abs f5-cta rv" data-k="cta" type="button">See all basics</button>
</div>`;
sheet.appendChild(scroller);
sheet.classList.add('is-yf', 'is-d3');
// the "Curating for you" beat: the bot holds at the screen's centre with this line under it, then hands over to the page
const curate = document.createElement('div');
curate.className = 'yf-curate';
curate.setAttribute('aria-live', 'polite');
curate.innerHTML = '<b>Curating for you</b>';
sheet.appendChild(curate);
// …and its backdrop: soft ripples rising from behind the bot (it's searching)
const curFx = document.createElement('div');
curFx.className = 'yf-cfx';
curFx.innerHTML = [0, 1, 2].map((i) => `<i class="rip" style="--d:${(i * 1.1).toFixed(2)}s"></i>`).join('');
sheet.insertBefore(curFx, curate);
const page = scroller.firstElementChild;
const $ = (s) => page.querySelector(s), $$ = (s) => [...page.querySelectorAll(s)];

// ─── the reveal ─────────────────────────────────────────────────────────────────────────────────────────────
// key: [delay on the clock (ms), from-transform, group, offset in its group (ms)]. Top to bottom: each sticker lands
// ribbon first, then its words one after another (60 ms apart), then its heart and sparkle pop in; the deck's front
// card rises and the cards behind it fan out from under it (deck.fan); the carousel's middle card rises and its
// neighbours slide out from behind it (refill.reveal); the arc and "See all basics" last
const BEATS = {
  t0: [0, 'translateY(10px) scale(.94)', 'top', 0], t1: [60, 'translateY(12px)', 'top', 60], t2: [120, 'translateY(12px)', 'top', 120],
  t3: [180, 'translateY(10px)', 'top', 180], tx: [260, 'scale(.4)', 'top', 260],
  deck: [300, 'translateY(56px) scale(.96)', 'deck', 0],
  r0: [460, 'translateY(10px) scale(.94)', 'restock', 0], r1: [520, 'translateY(12px)', 'restock', 60], r2: [580, 'translateY(12px)', 'restock', 120],
  r3: [640, 'translateY(10px)', 'restock', 180], rx: [720, 'scale(.4)', 'restock', 260],
  refill: [640, null, 'refill', 0],
  arc: [800, 'translateY(10px)', 'cta', 0], cta: [800, 'translateY(16px) scale(.97)', 'cta', 60],
};
let live = false, lazyIO = null;
// a revealed block's end state is written inline and its animations released once they land: iOS WebKit drops the pixels
// of a layer held by a filled animation once it has scrolled out of the page's scroller, and never repaints it on the way
// back (the block stays blank until something else touches it). `held` = there, no animation; cancelOwn = back to hidden
const held = (el) => { el.style.opacity = '1'; };
const cancelOwn = (el) => { el.getAnimations().forEach((a) => { if (!(a instanceof CSSAnimation)) a.cancel(); }); el.style.opacity = ''; };
function playIn(el, from, delay, o = {}) {
  cancelOwn(el);
  const d = reduce.matches ? 0 : delay;
  const a = el.animate([{ transform: reduce.matches ? 'none' : from }, { transform: 'none' }], { duration: o.ms || REVEAL.ms, easing: REVEAL.ease, delay: d, fill: 'both' });
  const b = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: o.fadeMs || REVEAL.fadeMs, easing: REVEAL.fade, delay: d, fill: 'both' });
  Promise.all([a.finished, b.finished]).then(() => { held(el); a.cancel(); b.cancel(); }, () => {});
}
function playBeat(el, delay) {
  const k = el.dataset.k, b = BEATS[k];
  if (k === 'refill') { refill.reveal(delay); return; }
  playIn(el, b[1], delay);
  if (k === 'deck') deck.fan(delay + 480);   // (once the front card is mostly in, so the ones behind never show through it)
}
function reveal({ withBot = false } = {}) {
  live = true;
  deck.roles();
  const items = $$('[data-k]').filter((el) => BEATS[el.dataset.k]);
  if (!withBot || reduce.matches) items.forEach((el) => playBeat(el, BEATS[el.dataset.k][0]));
  else revealWithBot(items);
  setTimeout(() => H('tick'), 320);
  nudges.start();
}
// gone back out through the bottom of the screen (the user scrolled back up past it)
const belowView = (e) => e.rootBounds && e.boundingClientRect.bottom > e.rootBounds.bottom;
function revealWithBot(items) {
  const sr = sheet.getBoundingClientRect(), VH = scroller.clientHeight || 812;
  const anchorOf = (g, el) => (g === 'deck' ? $('.d3-deck .d3-dk.is-top') : g === 'refill' ? $('.d3-refill') : el.closest('.f5-hd') || el);
  const groups = {};
  items.forEach((el) => {
    const [, , g, off] = BEATS[el.dataset.k];
    if (!groups[g]) {
      const anchor = anchorOf(g, el), r = anchor.getBoundingClientRect();
      groups[g] = { name: g, y: r.top - sr.top, h: r.height, anchor: g === 'deck' ? $('.d3-deck') : anchor, els: [] };
    }
    groups[g].els.push([el, off]);
  });
  const play = (g) => g.els.forEach(([el, off]) => playBeat(el, off));
  // what's (mostly) below the screen waits for the scroll: it plays in as it comes into view — and hides again once it
  // has gone back below the screen, so scrolling down again plays it again
  const below = [], seq = [];
  Object.values(groups).forEach((g) => {
    const seen = Math.min(VH, g.y + g.h) - Math.max(0, g.y);
    (seen < Math.min(60, g.h * 0.5) ? below : seq).push(g);
  });
  lazyIO && lazyIO.disconnect(); lazyIO = null;
  if (below.length) {
    const shown = new Set();
    lazyIO = new IntersectionObserver((ents) => ents.forEach((e) => {
      const g = below.find((x) => x.anchor === e.target); if (!g) return;
      if (e.isIntersecting && !shown.has(g)) {
        shown.add(g);
        if (g.name === 'deck') { deck.roles(); playBeat($('.d3-dk.is-top .pc'), 0); } else play(g);
      } else if (!e.isIntersecting && shown.has(g) && belowView(e)) {
        shown.delete(g);
        if (g.name === 'deck') deck.hide(); else if (g.name === 'refill') refill.hide(); else g.els.forEach(([el]) => cancelOwn(el));
      }
    }), { root: scroller, threshold: 0.1, rootMargin: '0px 0px -6% 0px' });   // (a touch inside the edge, so the glide is seen)
    below.forEach((g) => lazyIO.observe(g.anchor));
  }
  // what's on screen plays in top to bottom, 70 ms apart — each block no sooner than the bot has risen clear of it
  seq.sort((a, b) => a.y - b.y);
  const t0 = performance.now(), HALF = 1.2, CLEAR = 10, GAP = 70;
  let last = -1e9;
  const tick = () => {
    if (!live || !window.orbi.pageOpen) return;
    const now = performance.now(), v = window.orbi.view, bottom = v.cy + v.unit * HALF + CLEAR;
    if (seq.length && now - last >= GAP && (seq[0].y > bottom || now - t0 > 1100)) { play(seq.shift()); last = now; }
    if (seq.length) requestAnimationFrame(tick);
  };
  tick();
}
function reset() {
  live = false; lazyIO && lazyIO.disconnect(); lazyIO = null;
  page.querySelectorAll('.rv').forEach(cancelOwn);
  scroller.scrollTop = 0; onScroll();
  deck.reset(); refill.jump(0); nudges.stop();
  page.querySelectorAll('.pc-add.is-on, .pc-wish.is-on').forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
}

// ─── the bot, from the page: hops, a happy beat, glances at what's touched, looks the way the page scrolls ─────
const bot = {
  hop(v) { try { window.orbi && window.orbi.hop(v); } catch {} },
  cheer() {
    const o = window.orbi; if (!o || curating) return;
    o.setState('greeting'); clearTimeout(bot.t); bot.t = setTimeout(() => { if (o.state === 'greeting') o.setState('idle'); }, 1300);
  },
  look(yaw, pitch, ms) {
    const o = window.orbi; if (!o || curating) return;
    o.gazeAt(yaw, pitch); clearTimeout(bot.lt); bot.lt = setTimeout(() => o.gazeAt(null), ms);
  },
  t: 0, lt: 0,
};
page.addEventListener('pointerup', (e) => {
  const el = e.target.closest('.d3-dk, .d3-rslot, .f5-cta'); if (!el || !window.orbi) return;
  const sr = sheet.getBoundingClientRect(), r = el.getBoundingClientRect(), v = window.orbi.view;
  const x = r.left + r.width / 2 - sr.left, y = r.top + r.height / 2 - sr.top;
  bot.look(Math.max(-0.55, Math.min(0.55, (x - v.cx) / 260)), Math.max(-0.15, Math.min(0.32, (y - v.cy) / 900)), 1100);
});
// add to cart: the product's photo box lifts off the card and, on its way up, rounds into a disc around the product as
// it shrinks (its own 320 ms clock, so you watch the card become a circle), and goes straight into the bot along an
// up-and-over arc — 560 ms, a gentle start and a soft arrival, so the eye can follow it — fading as it enters; the bot jumps
const FLY_MS = 560, SHAPE_MS = 320;
const flyEase = (u) => { // cubic-bezier(0.45, 0, 0.2, 1), solved for y at x = u
  let t = u; for (let i = 0; i < 8; i++) { const x = 3 * (1 - t) * (1 - t) * t * 0.45 + 3 * (1 - t) * t * t * 0.2 + t * t * t - u, dx = 3 * (1 - t) * (1 - t) * 0.45 + 6 * (1 - t) * t * (0.2 - 0.45) + 3 * t * t * (1 - 0.2); if (Math.abs(dx) < 1e-6) break; t -= x / dx; }
  return 3 * (1 - t) * t * t + t * t * t;
};
function flyToBot(src) {
  if (!src || reduce.matches || !window.orbi) { bot.hop(1.4); return; }
  const sr = sheet.getBoundingClientRect(), r = src.getBoundingClientRect(), v = window.orbi.view;
  const img = src.querySelector('img'); if (!img) { bot.hop(1.4); return; }
  const ir = img.getBoundingClientRect();
  const w = r.width, h = r.height, d0 = Math.min(w, h), R = parseFloat(getComputedStyle(src).borderTopLeftRadius) || 12;
  const DD = 44, sEnd = DD / d0;                                             // the disc it ends as
  const bx = v.cx, by = v.cy;                                                // into the bot
  const fly = document.createElement('div'); fly.className = 'd3-fly';
  fly.innerHTML = `<i class="dc"><img src="${img.currentSrc || img.src}" alt="" draggable="false"></i>`;
  Object.assign(fly.style, { left: `${r.left - sr.left}px`, top: `${r.top - sr.top}px`, width: `${w}px`, height: `${h}px` });
  const disc = fly.firstElementChild, pic = disc.firstElementChild;
  // the product exactly where it is in the card (same box, same fit), so the lift-off doesn't jump
  Object.assign(pic.style, { left: `${ir.left - r.left}px`, top: `${ir.top - r.top}px`, width: `${ir.width}px`, height: `${ir.height}px`, objectFit: getComputedStyle(img).objectFit || 'contain' });
  sheet.appendChild(fly);
  const x1 = bx - (r.left - sr.left) - w / 2, y1 = by - (r.top - sr.top) - h / 2;
  const cx = x1 * 0.2, cy = Math.min(0, y1) * 0.55 - 36;                   // the arc: up first, then over to the bot
  const N = 24, path = Array.from({ length: N + 1 }, (_, i) => {
    const u = i / N, p = flyEase(u), q = 1 - p, f = Math.min(1, Math.max(0, (u - 0.8) / 0.2));   // (the last fifth: it shrinks into the bot and fades)
    return { transform: `translate(${(2 * q * p * cx + p * p * x1).toFixed(1)}px, ${(2 * q * p * cy + p * p * y1).toFixed(1)}px) scale(${(1 - 0.55 * f).toFixed(3)})`, opacity: (1 - f).toFixed(3), offset: u };
  });
  const ix = (w - d0) / 2, iy = (h - d0) / 2;
  const shape = (m, sc) => ({ transform: `scale(${sc.toFixed(4)})`, clipPath: `inset(${(iy * m).toFixed(2)}px ${(ix * m).toFixed(2)}px round ${(R + (d0 / 2 - R) * m).toFixed(2)}px)` });
  disc.animate([shape(0, 1), shape(1, sEnd)], { duration: SHAPE_MS, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'both' });
  fly.animate(path, { duration: FLY_MS, easing: 'linear', fill: 'both' }).onfinish = () => { fly.remove(); H('pop'); bot.hop(1.8); };
}
// add to cart (deck and carousel): the + turns into a tick and the product flies into the bot; again to take it out
page.addEventListener('click', (e) => {
  const b = e.target.closest('.pc-add'); if (!b) return;
  const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', String(on));
  b.setAttribute('aria-label', on ? 'Added to cart' : 'Add to cart');
  H(on ? 'success' : 'tap');
  if (on) flyToBot(b.closest('.pc').querySelector('.main'));
});
// the wishlist hearts: fill red with a pop, the bot gives a little hop
page.addEventListener('click', (e) => {
  const b = e.target.closest('.pc-wish'); if (!b) return;
  const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', String(on));
  H(on ? 'success' : 'tap');
  if (on && !reduce.matches) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: 0.25 }, { transform: 'scale(1.18)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 460, easing: FADE_IN });
  if (on) bot.hop(1.1);
});
// "See all basics": the pill dips while it's held (a tick on the way in); let go on it and the bot answers
page.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.f5-cta'); if (!b || e.button) return;
  b.classList.add('is-press'); H('tick');
  const up = () => { b.classList.remove('is-press'); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); b.removeEventListener('pointerleave', up); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
});
$('.f5-cta').addEventListener('click', () => { H('tap'); bot.cheer(); bot.hop(1.2); });

// ─── scroll: the bot reads along ──────────────────────────────────────────────────────────────────────────────
let lastY = 0;
function onScroll() {
  const top = scroller.scrollTop;
  if (live && Math.abs(top - lastY) > 2 && top > 0) bot.look(0, top > lastY ? 0.22 : -0.1, 380);   // reading down / back up
  lastY = top;
}
scroller.addEventListener('scroll', onScroll, { passive: true });
// the top feather (Figma's "yf-mini", 132 tall): always there, so the page scrolls away under the status bar and the ✕
(() => { const el = document.createElement('div'); el.className = 'yf-mini'; el.setAttribute('aria-hidden', 'true'); sheet.appendChild(el); })();

// pull down at the top of the page to close it: the page lifts into the card it closes as and follows the finger
// (a little resistance); let go past 110 px (or with a flick) and it drops away, otherwise it springs back
(() => {
  let g = null, raf = 0;
  const rubber = (dy) => (dy <= 0 ? 0 : (dy * 0.92) / (1 + dy / 1100));
  const begin = (x, y, target) => {
    if (!window.orbi || !window.orbi.pageOpen || curating || scroller.scrollTop > 0) return;
    if (target.closest('button')) return;                      // (the carousels lock to sideways drags, so a pull still works on them)
    cancelAnimationFrame(raf); g = { x, y, on: false, py: 0, v: 0, lt: performance.now(), ly: y, armed: false };
  };
  const move = (x, y, ev) => {
    if (!g) return false;
    const dx = x - g.x, dy = y - g.y;
    if (!g.on) {
      if (dy > 8 && dy > Math.abs(dx) * 1.2 && scroller.scrollTop <= 0) g.on = true;
      else if (Math.abs(dx) > 8 || dy < -8) { g = null; return false; }
      else return false;
    }
    const now = performance.now(), dt = Math.max(1, now - g.lt);
    g.v = 0.75 * ((y - g.ly) / dt * 1000) + 0.25 * g.v; g.ly = y; g.lt = now;
    g.py = rubber(dy); window.orbi.pull(g.py);
    const armed = g.py > 110; if (armed !== g.armed) { g.armed = armed; H('tick'); }
    if (ev && ev.cancelable) ev.preventDefault();
    return true;
  };
  const end = () => {
    if (!g) return; const d = g; g = null; if (!d.on) return;
    if (d.py > 110 || d.v > 650) { window.orbi.release(true, Math.max(0, d.v)); return; }
    let py = d.py, v = 0, last = performance.now();                       // spring back (critically damped)
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); v += (-260 * py - 32 * v) * k; py += v * k; }
      if (py < 0.3 && Math.abs(v) < 5) { window.orbi.pull(0); return; }
      window.orbi.pull(py); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  scroller.addEventListener('touchstart', (e) => { if (e.touches.length === 1) begin(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
  scroller.addEventListener('touchmove', (e) => { if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
  scroller.addEventListener('touchend', end); scroller.addEventListener('touchcancel', end);
  scroller.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && !e.button) begin(e.clientX, e.clientY, e.target); });
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') move(e.clientX, e.clientY, null); });
  addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse') end(); });
})();

// ─── carousels ──────────────────────────────────────────────────────────────────────────────────────────────
// A continuous position `pos` (in items) that a drag moves 1 : 1, a flick carries its speed into a spring (stiffness 240,
// damping 30.4 — ζ .98, no visible overshoot) which lands on a whole item, and every item is placed from its wrapped
// distance to `pos`, so the row just keeps going round. Axis-locked: a mostly-vertical drag is left to the page's
// scroll. One selection tick per landing.
const capture = (el, id) => { try { el.setPointerCapture(id); } catch {} };   // (a pointer that's already gone can't be captured)
function loopCarousel({ stage, count, step, place, tapToFocus = false, onTap = null, onLand = null }) {
  let n = count, pos = 0, vel = 0, target = 0, raf = 0, drag = null, landed = 0;
  const norm = (i) => ((i % n) + n) % n;
  const wrapD = (i) => { let d = i - pos; d -= Math.round(d / n) * n; return d; };
  const render = () => place(wrapD);
  function run() {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); vel += (240 * (target - pos) - 30.4 * vel) * k; pos += vel * k; }
      const at = norm(Math.round(target));
      if (at !== landed && Math.abs(target - pos) < 0.5) { landed = at; H('tick'); onLand && onLand(at); }
      if (Math.abs(target - pos) < 0.0015 && Math.abs(vel) < 0.01) { pos = target = Math.abs(target - Math.round(target)) < 1e-3 ? norm(Math.round(target)) : target; vel = 0; render(); raf = 0; return; }
      render(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  const go = (t) => { target = t; if (!raf) run(); };
  stage.addEventListener('pointerdown', (e) => {
    if (e.button || e.target.closest('button')) return;
    cancelAnimationFrame(raf); raf = 0;
    drag = { x: e.clientX, y: e.clientY, p0: pos, t: performance.now(), lx: e.clientX, v: 0, axis: null, id: e.pointerId, item: e.target.closest('[data-i]') };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 6) { drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (drag.axis === 'x') capture(stage, e.pointerId); }
    if (drag.axis !== 'x') return;
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    drag.v = 0.8 * ((e.clientX - drag.lx) / dt) + 0.2 * drag.v; drag.lx = e.clientX; drag.t = now;
    pos = drag.p0 - dx / step; vel = 0; target = pos; render();
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.axis === 'x') { const v = -d.v * 1000 / step; vel = v; go(Math.round(pos + Math.max(-1.4, Math.min(1.4, v * 0.18)))); }
    else if (!d.axis && tapToFocus && d.item) {
      const dd = wrapD(+d.item.dataset.i);
      if (Math.abs(dd) < 0.5) { onTap && onTap(d.item); go(Math.round(pos)); } else go(Math.round(pos + dd));   // a tap on a side item brings it forward
    }
    else go(Math.round(pos));
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  return {
    wrapD, go,
    get at() { return norm(Math.round(target)); },
    jump(i) { cancelAnimationFrame(raf); raf = 0; pos = target = landed = i; vel = 0; render(); },
  };
}

// the deck of top picks: the front card flat (Figma 789:12983, 222 × 324 at 71.5, 266), the two behind it as Figma's
// ghost cards — the nearer one 196 wide tipped +2.67°, 14 px higher, the far one 219 wide tipped −2°, 27 px higher, both
// softly out of focus and washed (--g) to the ghosts' white-to-#EEF0F4. Drag the front card sideways and it follows the
// finger, tilting; let go past 96 px or with a flick and it swings out that side and tucks in at the back of the pile
// while the others step forward — every card on its own spring (the MOVE spring: stiffness 280.6, damping 27.14),
// interruptible, carrying the hand's speed. A tap on a card peeking out behind brings the next one forward.
const deck = (() => {
  const stage = $('.d3-deck'), cards = [...stage.querySelectorAll('.d3-dk')];
  // slot k: x, y (of the card's top centre), rotation (deg), scale, blur (px), opacity, ghost wash
  const SLOT = [
    { x: 0, y: 0, r: 0, s: 1, b: 0, o: 1, g: 0 },
    { x: 6.1, y: -14.2, r: 2.67, s: 0.8845, b: 1.09, o: 1, g: 1 },     // 789:10254 (drawn over the far one)
    { x: 0, y: -27.2, r: -2, s: 0.9865, b: 1.9, o: 0.8, g: 1 },        // 789:10249
    { x: 0, y: -27.2, r: -2, s: 0.9865, b: 2.2, o: 0, g: 1 },
  ];
  // the pile leans the way the last card was flicked (the share build's Option 1): a flick to the left mirrors it
  let lean = 1;
  const slot = (k) => { const q = SLOT[Math.min(k, 3)]; return { ...q, x: lean * q.x, r: lean * q.r }; };
  const KEYS = ['x', 'y', 'r', 's', 'b', 'o', 'g'], K = 280.6, C = 27.14;
  let order = cards.map((_, i) => i), raf = 0, drag = null, fanned = 0;   // (how many cards behind the front one are out)
  const st = cards.map(() => ({ ...SLOT[0], v: { x: 0, y: 0, r: 0, s: 0, b: 0, o: 0, g: 0 }, t: { ...SLOT[0] }, fly: 0 }));
  const paint = () => cards.forEach((c, i) => {
    const s = st[i];
    c.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(3)}deg) scale(${s.s.toFixed(4)})`;
    const b = Math.round(s.b * 10) / 10; c.style.filter = b > 0.05 ? `blur(${b}px)` : '';
    c.style.opacity = s.o.toFixed(3);
    c.style.setProperty('--g', Math.max(0, Math.min(1, s.g)).toFixed(3));
  });
  const layer = () => order.forEach((ci, k) => { cards[ci].style.zIndex = String(st[ci].fly ? 40 : 30 - k); cards[ci].classList.toggle('is-top', k === 0); cards[ci].setAttribute('aria-hidden', String(k !== 0)); });
  const aim = () => order.forEach((ci, k) => { if (!st[ci].fly) st[ci].t = { ...slot(k <= fanned ? k : 0) }; if (k > fanned) st[ci].t.o = 0; });
  function run() {
    if (raf) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      let moving = false;
      st.forEach((s, i) => {
        if (drag && drag.ci === i && drag.axis === 'x') return;
        for (let h = dt; h > 1e-6; h -= 1 / 240) {
          const k = Math.min(h, 1 / 240);
          KEYS.forEach((p) => { const c = p === 'o' || p === 'b' || p === 'g' ? 0.8 : 1; s.v[p] += (K * c * (s.t[p] - s[p]) - C * Math.sqrt(c) * s.v[p]) * k; s[p] += s.v[p] * k; });
        }
        if (s.fly && Math.abs(s.x) > 185) recycle(i);   // (at the edge of its swing it tucks in behind)
        const still = KEYS.every((p) => Math.abs(s.t[p] - s[p]) < (p === 's' || p === 'o' || p === 'g' ? 0.0008 : 0.04) && Math.abs(s.v[p]) < 0.05);
        if (still) KEYS.forEach((p) => { s[p] = s.t[p]; s.v[p] = 0; }); else moving = true;
      });
      paint();
      raf = moving || drag ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  }
  // the thrown card swings out to the side, then — behind everything now — slides back into the last slot of the pile,
  // so you watch it go to the end of the stack
  function recycle(i) {
    const s = st[i]; s.fly = 0;
    s.v.x *= 0.25; s.t = { ...slot(order.indexOf(i)) };
    layer();
  }
  function throwTop(dir, v = 0) {
    const ci = order[0], s = st[ci];
    lean = dir;   // (the pile swings to lean after it)
    s.fly = dir; s.t = { x: dir * 240, y: s.y + 10, r: dir * 14, s: 0.96, b: 0, o: 1, g: 0 };
    s.v.x = Math.max(Math.abs(s.v.x), Math.abs(v) * 1000, 900) * dir;
    order = [...order.slice(1), ci];
    aim(); layer(); H('tick'); run();
  }
  stage.addEventListener('pointerdown', (e) => {
    if (e.button || e.target.closest('button')) return;
    const c = e.target.closest('.d3-dk'); if (!c) return;
    const ci = +c.dataset.i;
    if (ci !== order[0]) { throwTop(-1); return; }               // a tap on a card behind brings it forward
    drag = { ci, x: e.clientX, y: e.clientY, x0: st[ci].x, lx: e.clientX, lt: performance.now(), v: 0, axis: null, id: e.pointerId };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 6) { drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (drag.axis === 'x') { capture(stage, e.pointerId); run(); } }
    if (drag.axis !== 'x') return;
    const now = performance.now(), dt = Math.max(1, now - drag.lt);
    drag.v = 0.8 * ((e.clientX - drag.lx) / dt) + 0.2 * drag.v; drag.lx = e.clientX; drag.lt = now;
    const s = st[drag.ci]; s.x = drag.x0 + dx; s.y = Math.abs(dx) * 0.04; s.r = dx * 0.045; s.v.x = drag.v * 1000;
    // the cards behind lean in as the front one goes: a step towards their next slot
    const p = Math.min(1, Math.abs(dx) / 180);
    order.slice(1).forEach((ci, k) => { const A0 = slot(k + 1), B0 = slot(k); st[ci].t = Object.fromEntries(KEYS.map((q) => [q, A0[q] + (B0[q] - A0[q]) * p * 0.5])); if (k + 1 > fanned) st[ci].t.o = 0; });
    const armed = Math.abs(dx) > 96; if (armed !== drag.armed) { drag.armed = armed; if (armed) H('tick'); }
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.axis !== 'x') { run(); return; }
    const dx = st[d.ci].x;
    if (Math.abs(dx) > 96 || Math.abs(d.v) > 0.55) throwTop(Math.sign(Math.abs(d.v) > 0.55 ? d.v : dx), d.v);
    else { aim(); run(); }
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  return {
    next: (dir = 1) => throwTop(dir),
    reset() { cancelAnimationFrame(raf); raf = 0; drag = null; lean = 1; order = cards.map((_, i) => i); fanned = 0; st.forEach((s) => { s.fly = 0; Object.assign(s, SLOT[0]); KEYS.forEach((p) => { s.v[p] = 0; }); }); aim(); order.forEach((ci, k) => { if (k) st[ci].o = 0; }); layer(); paint(); },
    // scrolled back away below the screen: the cards behind tuck back under the front one (instantly, it's off screen)
    // and the front one goes back to hidden, so the next scroll down plays the whole entrance again
    hide() {
      fanned = 0;
      order.forEach((ci, k) => { const s0 = st[ci]; if (k && !s0.fly) { Object.assign(s0, { ...slot(0), o: 0 }); KEYS.forEach((p) => { s0.v[p] = 0; }); } });
      aim(); paint();
      cards.forEach((c) => cancelOwn(c.firstElementChild));
    },
    // the reveal: the front card lands first; then the cards behind it come out from under it one at a time
    fan(delay) {
      const d = reduce.matches ? 0 : delay, step = reduce.matches ? 0 : 140;
      [1, 2, Infinity].forEach((n, i) => setTimeout(() => { if (!live) return; fanned = Math.max(fanned, n); aim(); run(); }, d + i * step));
    },
    roles() { cards.forEach((c, i) => { const el = c.firstElementChild; el.dataset.k = i === order[0] ? 'deck' : ''; if (i !== order[0]) { el.getAnimations().forEach((a) => a.cancel()); held(el); } }); },
  };
})();

// the basics carousel (Figma 789:13056): the middle card 222 wide (Pampers, 789:10245), its neighbours Figma's Small
// card (181 × 276, 25 lower, i.e. centred on the middle one) with their centres 225.5 either side. Each card is the
// middle card scaled to 81.5 % at the side, and morphs as it moves (--k: 0 in the middle → 1 at the side, yf-page.css):
// the buttons keep their 32 px, the type steps down only 14 → 13 and the nudge line fades out, as in Figma's Small card.
// Drag or flick it round; a tap on a side card brings it forward.
const refill = (() => {
  const stage = $('.d3-refill'), slots = [...stage.querySelectorAll('.d3-rslot')];
  const PITCH = 225.5, SS = 181 / 222;
  const loop = loopCarousel({ stage, count: slots.length, step: PITCH, tapToFocus: true, place: (wrapD) => slots.forEach((el, i) => {
    const d = wrapD(i), a = Math.abs(d), k = Math.min(1, a);
    el.style.transform = `translate3d(${(d * PITCH).toFixed(2)}px, 0, 0) scale(${(1 - (1 - SS) * k).toFixed(4)})`;
    el.style.setProperty('--k', k.toFixed(4));
    el.style.opacity = a <= 1 ? '1' : Math.max(0, 2 - a).toFixed(3);
    el.style.zIndex = String(10 - Math.round(a * 3));
    el.style.visibility = a > 1.9 ? 'hidden' : '';
    el.classList.toggle('is-mid', a < 0.5);
    el.setAttribute('aria-hidden', String(a >= 0.5));
  }) });
  return {
    jump: loop.jump,
    hide() { slots.forEach((sl) => cancelOwn(sl.firstElementChild)); },   // (back to hidden, to play in again)
    reveal(delay) {
      // the middle card rises in, then its neighbours slide out from behind it
      slots.forEach((s) => {
        const d = Math.round(loop.wrapD(+s.dataset.i)), c = s.firstElementChild;
        if (d === 0) playIn(c, 'translateY(28px) scale(.97)', delay);
        else if (Math.abs(d) === 1) playIn(c, `translateX(${-d * 64}px) scale(.94)`, delay + 160);
        else { c.getAnimations().forEach((x) => x.cancel()); held(c); }
      });
    },
    go: (i) => loop.go(i),
  };
})();

// the nudge line on every card rolls on to the next one every 2.6 s (in-out, 520 ms) while the page is up; from the last
// (the first again) it snaps back to the top unseen
const nudges = (() => {
  const runs = $$('.ng .run'), labels = $$('.ng');
  let i = 0, t = 0, back = 0;
  const set = (y, anim) => runs.forEach((r) => { r.style.transition = anim ? '' : 'none'; r.style.transform = y ? `translate3d(0, ${-y}px, 0)` : ''; });
  const step = () => {
    if (!live || document.hidden) return;
    i += 1; set(NTOP[i], true);
    labels.forEach((l) => l.setAttribute('aria-label', NUDGES[i][1]));
    if (i === NTOP.length - 1) back = setTimeout(() => { i = 0; set(0, false); }, 700);
  };
  return {
    start() { clearInterval(t); clearTimeout(back); if (!reduce.matches) t = setInterval(step, 2600); },
    stop() { clearInterval(t); clearTimeout(back); i = 0; set(0, false); labels.forEach((l) => l.setAttribute('aria-label', NUDGES[0][1])); },
  };
})();

// ─── the curating beat ──────────────────────────────────────────────────────────────────────────────────────
// tap → the page opens (empty) while the bot flies to the screen's centre and grows; "Curating for you" blurs up under
// it and shimmers while the bot looks around (its Working pose); then the line dissolves, the bot springs up to its
// corner and the page reveals behind it.
const CURATE = { textIn: 360, hold: 1250, unit: 40 };
let curating = false, curateT = 0;
function curateSpot() {
  const W = sheet.clientWidth || 375, Hh = sheet.clientHeight || 812;
  return { cx: W / 2, cy: Math.round(Hh * 0.44), unit: CURATE.unit };
}
function curateStart() {
  curating = true;
  const spot = curateSpot();
  window.orbi.stage(spot);
  curate.style.top = `${spot.cy + spot.unit + 58}px`;
  curFx.style.setProperty('--cx', `${spot.cx}px`); curFx.style.setProperty('--cy', `${spot.cy}px`);
  curFx.getAnimations().forEach((a) => a.cancel());
  curFx.classList.add('is-on');
  curFx.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: FADE_IN, delay: reduce.matches ? 0 : 300, fill: 'both' });
  curate.getAnimations().forEach((a) => a.cancel());
  curate.animate([{ opacity: 0, transform: 'translateY(10px) scale(.96)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
    { duration: 1000, easing: REVEAL.ease, delay: reduce.matches ? 0 : CURATE.textIn, fill: 'both' });
}
function curateEnd() {
  if (!curating) return;
  curating = false; clearTimeout(curateT);
  curate.getAnimations().forEach((a) => a.cancel());
  curate.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-6px) scale(.98)', filter: 'blur(6px)' }],
    { duration: 220, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' });
  curFx.getAnimations().forEach((a) => a.cancel());
  curFx.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.06)' }], { duration: 220, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'both' })
    .onfinish = () => curFx.classList.remove('is-on');
  window.orbi.setState('idle');
  window.orbi.stage(null);                                     // the bot springs up to its corner…
  H('tick');
  // …and the page plays in behind it as it goes: whatever is already below the bot starts at once (top to bottom),
  // the rest the moment the bot has risen clear of it — so nothing ever appears under the bot, and no frame is empty
  if (window.orbi.pageOpen) reveal({ withBot: true });
}
function curateCancel() {
  curating = false; clearTimeout(curateT);
  curate.getAnimations().forEach((a) => a.cancel());
  curFx.getAnimations().forEach((a) => a.cancel()); curFx.classList.remove('is-on');
  window.orbi.stage(null);
}

// ─── lifecycle: main.js fires orbi:page ─────────────────────────────────────────────────────────────────────
addEventListener('orbi:page', (e) => {
  if (e.detail === 'opening') { reset(); curateStart(); }
  else if (e.detail === 'landed' && curating) { window.orbi.setState('working'); curateT = setTimeout(curateEnd, CURATE.hold); }
  else if (e.detail === 'closing') { if (curating) { curateCancel(); window.orbi.setState('idle'); } live = false; nudges.stop(); }
  else if (e.detail === 'closed') { curateCancel(); reset(); }
});
// photos fetched up front, so nothing pops in mid-reveal
[...DATA.deck, ...DATA.refill].forEach((it) => { const im = new Image(); im.src = SRC(it); });
deck.reset(); refill.jump(0);
(function ink() { if (window.orbi) window.orbi.statusInk(0); else requestAnimationFrame(ink); })();   // (a light page: dark status-bar content)
window.yfPage = { reveal, reset, scroller, deck, refill };
