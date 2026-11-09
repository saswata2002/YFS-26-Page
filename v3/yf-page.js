/* ══ Iteration 3 — the bot's full page: "Deals we think you'll love", 1:1 with Figma Saswata 1473:49855 ══════════════
   A copy of iteration 1's flow (the circle reveal out of the bot, the "Curating for you" beat, pull-to-close, the
   mini header, the bot's reactions) with this page built into #orbiSheet at Figma's own x / y (yf-page.css):
     · a looping 3D coupon carousel (the bank offers live on noon.com), each one flips to its code on a tap
     · a deck of top picks: swipe the front card away (or tap the pixel arrows), add to cart, the bot catches it
     · a scrolling "Flash deal offers" strip, a swipeable refill card with a wishlist heart, "Shop all deals"
   The reveal: the page plays in behind the bot as it leaves for its corner (one soft expo-out settle, front first,
   the others fanning out from under it), then every block below the fold glides up as it scrolls into view. */
const sheet = document.getElementById('orbiSheet');
const D = '';                                       // Noontree's dirham glyph
const H = (k) => { try { window.Haptics && window.Haptics[k] && window.Haptics[k](); } catch {} };
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// the reveal: a long, soft settle (expo-out) for the move, a quicker fade — content glides in rather than pops
const REVEAL = { ms: 1100, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', fadeMs: 640, fade: 'cubic-bezier(0.25, 0.1, 0.25, 1)' };
const FADE_IN = 'cubic-bezier(0.33, 1, 0.68, 1)', FADE_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
const A = (f) => `f/${f}`;                                     // this iteration's art (Figma exports + noon photos)

// ─── data: live from noon.com/uae-en (2026-11-09) — the homepage's bank offers (Emirates Islamic 09–12 Nov, tabby
// 08–12 Nov), the 11.11 sale's top deals, and household staples from the grocery store (prices as listed that day)
const money = (v) => (Math.round(v * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const pct = (it) => Math.floor((1 - it.price / it.was) * 100);   // (noon rounds its % off down)
const DATA = {
  coupons: [   // the hero coupon first (Figma's "Midnight Gold"), then the others round the ring
    { title: `30% extra off up to ${D}150`, sub: 'with Emirates Islamic', tag: 'noon One users', code: 'EIB30', ends: '12/11/2026', card: 'ei', look: 'gold' },
    { title: `20% extra off up to ${D}100`, sub: 'with Emirates Islamic', tag: 'All users', code: 'EIB20', ends: '12/11/2026', card: 'ei2', look: 'ice' },
    { title: `25% extra off up to ${D}100`, sub: 'when you pay with tabby', tag: 'All users', code: 'TABBYCASH25', ends: '12/11/2026', card: 'tabby', look: 'mint' },
  ],
  deck: [      // "Top picks, picked for you": the 11.11 sale
    { img: 'deck0', name: 'evvoli Air Fryer 8 Preset Programs, Digital Display 5.5L 1850W', price: 102, was: 499, express: true },
    { img: 'deck1', name: 'Samsung Galaxy S26 Ultra Dual SIM Cobalt Violet 12GB RAM 256GB 5G', price: 3349, was: 5099, express: true },
    { img: 'deck2', name: 'Hisense 7Kg Front Loading Washing Machine, 1200RPM, Steam Wash', price: 749, was: 999, express: true },
    { img: 'deck3', name: 'Hawkins Futura 5L Hard Anodised Deep Kadhai with Steel Lid', price: 67, was: 204, express: true },
    { img: 'deck4', name: 'FUJIFILM Instax Mini EVO Hybrid Instant Camera, Gentle Rose', price: 779, was: 999, express: false },
  ],
  refill: [    // the second "Top picks": things you buy again
    { img: 'refill0', name: 'Fine Facial Tissue 130 Sheets 2 Ply Pack of 5', price: 13.45, was: 17.36, last: 'Last purchased on 28 Oct' },
    { img: 'refill1', name: 'Persil Power Gel Liquid Laundry Detergent Deep Clean 4.8L', price: 41.7, was: 82.6, last: 'Last purchased on 12 Oct' },
    { img: 'refill2', name: 'Fine Comfort Toilet Paper 2 Ply, 12 Rolls x 180 Sheets', price: 12.4, was: 19.26, last: 'Last purchased on 2 Nov' },
    { img: 'refill3', name: 'Fairy Lavender Dishwashing Liquid, 3X Grease Cutting Power', price: 12.9, was: 18.34, last: 'Last purchased on 20 Oct' },
    { img: 'refill4', name: 'Masafi Pure Low Sodium Natural Water 1.5L, Pack of 12', price: 9.5, was: 16.8, last: 'Last purchased on 4 Nov' },
  ],
};
const IMG = (k) => A(`p/${k}.webp`);

// ─── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
const PLUS = '<svg class="pl" viewBox="0 0 40 40" aria-hidden="true"><path d="M27.475 19.1375H20.8625V12.525C20.8625 12.2963 20.7716 12.0769 20.6099 11.9151C20.4481 11.7534 20.2287 11.6625 20 11.6625C19.7713 11.6625 19.5519 11.7534 19.3901 11.9151C19.2284 12.0769 19.1375 12.2963 19.1375 12.525V19.1375H12.525C12.2963 19.1375 12.0769 19.2284 11.9151 19.3901C11.7534 19.5519 11.6625 19.7713 11.6625 20C11.6625 20.2287 11.7534 20.4481 11.9151 20.6099C12.0769 20.7716 12.2963 20.8625 12.525 20.8625H19.1375V27.475C19.1375 27.7037 19.2284 27.9231 19.3901 28.0849C19.5519 28.2466 19.7713 28.3375 20 28.3375C20.2287 28.3375 20.4481 28.2466 20.6099 28.0849C20.7716 27.9231 20.8625 27.7037 20.8625 27.475V20.8625H27.475C27.7037 20.8625 27.9231 20.7716 28.0849 20.6099C28.2466 20.4481 28.3375 20.2287 28.3375 20C28.3375 19.7713 28.2466 19.5519 28.0849 19.3901C27.9231 19.2284 27.7037 19.1375 27.475 19.1375Z"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const HEART = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7.99998 14.1066C7.99999 13.2163 8.27005 12.3471 8.77448 11.6135C9.27891 10.88 9.99399 10.3167 10.8253 9.99811C11.6565 9.6795 12.5649 9.62054 13.4304 9.82902C14.2959 10.0375 15.0778 10.5036 15.6728 11.1658C15.7147 11.2106 15.7654 11.2463 15.8216 11.2707C15.8779 11.2952 15.9386 11.3078 16 11.3078C16.0613 11.3078 16.122 11.2952 16.1783 11.2707C16.2346 11.2463 16.2853 11.2106 16.3272 11.1658C16.9203 10.4993 17.7024 10.0293 18.5693 9.81827C19.4362 9.60726 20.3468 9.66526 21.1799 9.98457C22.013 10.3039 22.7291 10.8693 23.2329 11.6057C23.7367 12.3421 24.0042 13.2144 24 14.1066C24 15.9386 22.8 17.3066 21.6 18.5066L17.2064 22.757C17.0573 22.9282 16.8735 23.0657 16.6672 23.1604C16.4609 23.2551 16.2368 23.3049 16.0098 23.3063C15.7828 23.3077 15.5581 23.2609 15.3506 23.1688C15.1431 23.0767 14.9576 22.9415 14.8064 22.7722L10.4 18.5066C9.19998 17.3066 7.99998 15.9466 7.99998 14.1066Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CUBES = (side) => `<div class="d3-abs d3-cubes ${side}" data-k="arrows" role="button" aria-label="${side === 'l' ? 'Previous pick' : 'Next pick'}">
  <i class="c0 rv"><img src="${A('2a5d6.svg')}" alt="" draggable="false"></i><i class="c1 rv"><img src="${A('2a72d.svg')}" alt="" draggable="false"></i><i class="c2 rv"><img src="${A('f97bf.svg')}" alt="" draggable="false"></i></div>`;
// a bank card on the coupon's holographic panel (131.9 × 83.4, Figma's "Image 14 3")
const CARD = {
  ei: `<i class="chip"></i><img class="lg" src="${A('p/logo-ei.png')}" alt="Emirates Islamic" draggable="false"><b class="visa">VISA</b><em class="tier">Platinum</em>`,
  ei2: `<i class="chip"></i><img class="lg" src="${A('p/logo-ei.png')}" alt="Emirates Islamic" draggable="false"><b class="visa">VISA</b><em class="tier">Signature</em>`,
  tabby: `<img class="tb" src="${A('p/logo-tabby.png')}" alt="tabby" draggable="false"><span class="split">Split in 4. No interest.</span>`,
};
const coupon = (c, i) => `<div class="d3-cslot" data-i="${i}" data-o="${i % DATA.coupons.length}"><div class="d3-cp rv look-${c.look}">
  <div class="face">
    <img class="body" src="${A('049d7.svg')}" alt="" draggable="false">
    <i class="dodge"><img src="${A('c151b.svg')}" alt="" draggable="false"></i>
    <img class="glow g0" src="${A('1f0f3.svg')}" alt="" draggable="false"><img class="glow g1" src="${A('7dc6b.svg')}" alt="" draggable="false">
    <div class="holo"><i class="grad"></i><img class="rays" src="${A('9d964.svg')}" alt="" draggable="false"><span class="tag">${c.tag}</span><div class="bank bank-${c.card}">${CARD[c.card]}</div></div>
    <img class="dash" src="${A('40b1b.svg')}" alt="" draggable="false">
    <p class="t1">${c.title}</p><p class="t2">${c.sub}</p>
    <i class="strip"></i><p class="exp">EXPIRES ON ${c.ends}</p>
  </div>
  <div class="back"><i class="ck">${CHECK}</i><b>Code copied</b><span class="cd">${c.code}</span><em>Applied at checkout</em></div>
</div></div>`;
const priceRow = (it) => `<div class="pr"><b><i>${D}</i>${money(it.price)}</b><s>${money(it.was)}</s><em>${pct(it)}%</em></div>`;
const deckCard = (it, i) => `<div class="d3-dk" data-i="${i}"><div class="in rv">
  <div class="main"><div class="ph"><img src="${IMG(it.img)}" alt="" draggable="false"></div><i class="tint"></i></div>
  <div class="info"><p class="nm">${it.name}</p>${priceRow(it)}${it.express ? `<img class="ex" src="${A('d26a7.svg')}" alt="express · Today" draggable="false">` : '<span class="ex"></span>'}
    <button class="d3-add" type="button" aria-label="Add to cart">${PLUS}<span class="ok">${CHECK}</span></button></div>
</div></div>`;
const refillCard = (it, i) => `<div class="d3-rslot" data-i="${i}"><div class="d3-rf rv">
  <div class="main"><div class="ph"><img src="${IMG(it.img)}" alt="" draggable="false"></div><i class="tint"></i>
    <button class="d3-wish" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button></div>
  <div class="info"><p class="nm">${it.name}</p><div class="pr"><b><i>${D}</i> ${money(it.price)}</b><span class="wp"><s>${money(it.was)}</s><em>${pct(it)}%</em></span></div><p class="last">${it.last}</p></div>
  <button class="d3-add" type="button" aria-label="Add to cart">${PLUS}<span class="ok">${CHECK}</span></button>
</div></div>`;
const PCT = ['08887', '8b80f', 'a1be9'].map((f) => `<img src="${A(f + '.svg')}" alt="" draggable="false">`).join('');
const HEART_SM = '<svg class="hs" viewBox="41 1.7 10.5 9.5" aria-hidden="true"><path d="M47.0508 2.71063H45.5508L45.0508 1.71063H42.5508L41.0508 3.21063V6.71063L45.5508 11.2106H47.0508L51.5508 6.71063V3.21063L50.0508 1.71063H47.5508L47.0508 2.71063Z" fill="#6348DA"/></svg>';
const tickerUnit = `<span class="u"><b>Flash deal offers</b><span class="pc">${PCT}</span><b>Win discounts on ${HEART_SM} brands</b></span>`;
const cta = (label, cls) => `<button class="d3-abs d3-cta ${cls} rv" type="button"><span class="lb">${label}</span></button>`;
const two = (y, a, b, k) => `<h2 class="d3-abs d3-title" style="top:${y}px"><span class="ln rv" data-k="${k}a">${a}</span><span class="ln rv" data-k="${k}b">${b}</span></h2>`;

const scroller = document.createElement('div');
scroller.className = 'yf-scroll d3-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="d3">
  <img class="d3-abs d3-bg rv" data-k="bg" src="${A('ce7ef.svg')}" alt="" draggable="false">
  <span class="d3-abs d3-leaf l0 rv" data-k="leafL"><img src="${A('cc1fe.svg')}" alt="" draggable="false"></span>
  <span class="d3-abs d3-leaf l1 rv" data-k="leafR"><img src="${A('c576a.svg')}" alt="" draggable="false"></span>
  ${two(117.26, 'Deals we', 'think you\'ll love', 't')}
  <div class="d3-abs d3-coupons" data-no-drag aria-roledescription="carousel">${[...DATA.coupons, ...DATA.coupons].map(coupon).join('')}</div>
  ${cta('Redeem Now', 'redeem').replace('rv"', 'rv" data-k="cta"')}
  <img class="d3-abs d3-shape rv" data-k="shape" src="${A('94761.svg')}" alt="" draggable="false">
  ${CUBES('l')}${CUBES('r')}
  ${two(640.11, 'Top picks,', 'picked for you', 'p')}
  <div class="d3-abs d3-deck" data-no-drag aria-roledescription="carousel">${DATA.deck.map(deckCard).join('')}</div>
  <div class="d3-abs d3-ticker rv" data-scroll aria-label="Flash deal offers, win discounts on brands"><div class="run">${tickerUnit.repeat(4)}</div></div>
  ${two(1365.24, 'Top picks,', 'picked for you', 'q').replace(/rv" data-k="q(a|b)"/g, 'rv" data-scroll')}
  <div class="d3-abs d3-refill" data-no-drag data-scroll aria-roledescription="carousel">${DATA.refill.map(refillCard).join('')}</div>
  <img class="d3-abs d3-arc rv" data-scroll src="${A('e5712.svg')}" alt="" draggable="false">
  ${cta('Shop all deals', 'all').replace('rv"', 'rv" data-scroll')}
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
// timed from the end of the curating beat (the bot leaving for its corner): ms delay, from-transform. Top to bottom,
// 40–80 ms apart; the hero coupon rises first and its neighbours fan out from under it; the deck's front card lands
// and the cards behind it spread out after (deck.fan)
const BEATS = {
  bg: [0, 'scale(1.06)'], ta: [40, 'translateY(14px)'], tb: [100, 'translateY(14px)'],
  leafL: [240, 'translate(10px, 8px) rotate(-40deg) scale(.5)'], leafR: [300, 'translate(-10px, -6px) rotate(40deg) scale(.5)'],
  cp1: [150, 'translateY(30px) scale(.96)'], cp0: [330, 'translateX(46px) scale(.94)'], cp2: [330, 'translateX(-46px) scale(.94)'],
  cta: [400, 'translateY(14px) scale(.97)'], shape: [440, 'translateY(46px)'],
  pa: [500, 'translateY(14px)'], pb: [560, 'translateY(14px)'], arrows: [600, 'scale(.6)'],
  deck: [560, 'translateY(56px) scale(.96)'],
};
let io = null, live = false;
const cancelOwn = (el) => el.getAnimations().forEach((a) => { if (!(a instanceof CSSAnimation)) a.cancel(); });   // (script animations only: the CSS loops keep running)
function playIn(el, from, delay, o = {}) {
  cancelOwn(el);
  const d = reduce.matches ? 0 : delay;
  el.animate([{ transform: reduce.matches ? 'none' : from }, { transform: 'none' }], { duration: o.ms || REVEAL.ms, easing: REVEAL.ease, delay: d, fill: 'both' });
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: o.fadeMs || REVEAL.fadeMs, easing: REVEAL.fade, delay: d, fill: 'both' });
}
function reveal() {
  live = true;
  coupons.roles(); deck.roles();
  $$('[data-k]').forEach((el) => {
    const b = BEATS[el.dataset.k]; if (!b) return;
    if (el.dataset.k === 'bg') playIn(el, b[1], b[0], { ms: 1600, fadeMs: 1100 });
    else if (el.dataset.k === 'arrows') [...el.children].forEach((c, i) => playIn(c, b[1], b[0] + i * 70));   // small cube to big
    else playIn(el, b[1], b[0]);
  });
  deck.fan(BEATS.deck[0] + 220);
  setTimeout(() => H('tick'), 320);
  io && io.disconnect();
  io = new IntersectionObserver((ents) => {
    let k = 0;
    ents.filter((e) => e.isIntersecting).forEach((e) => {
      io.unobserve(e.target);
      const el = e.target;
      if (el.classList.contains('d3-refill')) { refill.reveal((k++) * 80); return; }
      playIn(el, el.classList.contains('d3-cta') ? 'translateY(16px) scale(.97)' : 'translateY(24px)', (k++) * 80);
    });
  }, { root: scroller, threshold: 0.1, rootMargin: '0px 0px -6% 0px' });   // (a touch inside the edge, so the glide is seen)
  $$('[data-scroll]').forEach((el) => io.observe(el));
}
function reset() {
  live = false; io && io.disconnect();
  page.querySelectorAll('.rv').forEach(cancelOwn);
  scroller.scrollTop = 0; onScroll();
  coupons.jump(0); deck.reset(); refill.jump(0);
  page.querySelectorAll('.d3-cp.is-collected').forEach((c) => c.classList.remove('is-collected'));
  page.querySelectorAll('.d3-add.is-on, .d3-wish.is-on').forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
  mini.reset();
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
  const el = e.target.closest('.d3-cp, .d3-dk, .d3-rf, .d3-cta, .d3-cubes'); if (!el || !window.orbi) return;
  const sr = sheet.getBoundingClientRect(), r = el.getBoundingClientRect(), v = window.orbi.view;
  const x = r.left + r.width / 2 - sr.left, y = r.top + r.height / 2 - sr.top;
  bot.look(Math.max(-0.55, Math.min(0.55, (x - v.cx) / 260)), Math.max(-0.15, Math.min(0.32, (y - v.cy) / 900)), 1100);
});
// a product added to the cart flies up into the bot on an arc (shrinking, tipping), and the bot catches it with a hop
function flyToBot(src) {
  if (!src || reduce.matches || !window.orbi) { bot.hop(1.4); return; }
  const sr = sheet.getBoundingClientRect(), r = src.getBoundingClientRect(), v = window.orbi.view;
  const fly = src.cloneNode(true); fly.className = 'd3-fly';
  Object.assign(fly.style, { left: `${r.left - sr.left}px`, top: `${r.top - sr.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  sheet.appendChild(fly);
  const x1 = v.cx - (r.left - sr.left) - r.width / 2, y1 = v.cy - (r.top - sr.top) - r.height / 2;
  const cx = x1 * 0.35, cy = Math.min(0, y1) - 120;                         // the arc's control point: up and over
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const kf = Array.from({ length: 17 }, (_, i) => {
    const u = ease(i / 16), q = 1 - u;
    const x = 2 * q * u * cx + u * u * x1, y = 2 * q * u * cy + u * u * y1;
    return { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - 0.86 * u).toFixed(3)}) rotate(${(-14 * u).toFixed(1)}deg)`, opacity: i > 14 ? 0 : 1, offset: i / 16 };
  });
  fly.animate(kf, { duration: 780, easing: 'linear', fill: 'both' }).onfinish = () => { fly.remove(); bot.hop(1.6); H('pop'); bot.cheer(); };
}

// ─── the CTAs: fixed labels (Figma's "Redeem Now" / "Shop all deals"), a press dip and a haptic ──────────────────
$('.d3-cta.redeem').addEventListener('click', () => { coupons.collect(); });
$('.d3-cta.all').addEventListener('click', () => { H('tap'); bot.hop(1.2); });

// ─── scroll: a light parallax, the bot reads along, the mini header ──────────────────────────────────────────
const par = { bg: $('.d3-bg'), l0: $('.d3-leaf.l0'), l1: $('.d3-leaf.l1') };
let lastY = 0;
function onScroll() {
  const top = scroller.scrollTop, y = Math.min(top, 900);
  par.bg.style.translate = `0 ${(y * 0.32).toFixed(1)}px`;
  par.l0.style.translate = `0 ${(y * -0.18).toFixed(1)}px`; par.l1.style.translate = `0 ${(y * -0.1).toFixed(1)}px`;
  if (live && Math.abs(top - lastY) > 2 && top > 0) bot.look(0, top > lastY ? 0.22 : -0.1, 380);   // reading down / back up
  ticker.boost(top - lastY);
  lastY = top;
  mini.update(top);
}
scroller.addEventListener('scroll', onScroll, { passive: true });
// the mini header: once the title has scrolled away, a black feathered top settles in (just the feather, no text)
const mini = (() => {
  const el = document.createElement('div');
  el.className = 'yf-mini'; el.setAttribute('aria-hidden', 'true');
  sheet.appendChild(el);
  let on = false;
  return {
    update(top) { const show = top > 150; if (show !== on) { on = show; el.classList.toggle('is-on', on); } },
    reset() { on = false; el.classList.remove('is-on'); },
  };
})();

// the quiet loops (leaves, arrows, chevrons): paused while their block is off screen
(() => {
  const calm = new IntersectionObserver((ents) => ents.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { root: scroller, rootMargin: '120px 0px' });
  $$('.d3-leaf, .d3-cubes, .d3-bg').forEach((el) => { el.classList.add('is-off'); calm.observe(el); });
})();

// pull down at the top of the page to close it: the page lifts into the card it closes as and follows the finger
// (a little resistance); let go past 110 px (or with a flick) and it drops away, otherwise it springs back
(() => {
  let g = null, raf = 0;
  const rubber = (dy) => (dy <= 0 ? 0 : (dy * 0.92) / (1 + dy / 1100));
  const begin = (x, y, target) => {
    if (!window.orbi || !window.orbi.pageOpen || curating || scroller.scrollTop > 0) return;
    if (target.closest('button, .d3-cubes')) return;                      // (the carousels lock to sideways drags, so a pull still works on them)
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
// the CTAs' press: held down from touch-down to release (or the finger sliding off), with a tick on the way in
page.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.d3-cta'); if (!b || e.button) return;
  b.classList.add('is-press'); H('tick');
  const up = () => { b.classList.remove('is-press'); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); b.removeEventListener('pointerleave', up); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
});

// ─── carousels ──────────────────────────────────────────────────────────────────────────────────────────────
// One engine for the coupons and the refill card (iteration 1's): a continuous position `pos` (in items) that a drag
// moves 1 : 1, a flick carries its speed into a spring (stiffness 240, damping 30.4 — ζ .98, no visible overshoot)
// which lands on a whole item, and every item is placed from its wrapped distance to `pos`, so the row just keeps
// going round. Axis-locked: a mostly-vertical drag is left to the page's scroll. One selection tick per landing.
const capture = (el, id) => { try { el.setPointerCapture(id); } catch {} };   // (a pointer that's already gone can't be captured)
function loopCarousel({ stage, count, step, place, tapToFocus = false, onTap = null, onLand = null }) {
  let n = count, pos = 0, vel = 0, target = 0, raf = 0, drag = null, landed = 0, idleUntil = 0;
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
    const d = drag; drag = null; idleUntil = performance.now() + 8000;
    if (d.axis === 'x') { const v = -d.v * 1000 / step; vel = v; go(Math.round(pos + Math.max(-1.4, Math.min(1.4, v * 0.18)))); }
    else if (!d.axis && tapToFocus && d.item) {
      const dd = wrapD(+d.item.dataset.i);
      if (Math.abs(dd) < 0.5 && onTap) { onTap(d.item); go(Math.round(pos)); } else go(Math.round(pos + dd));   // a tap on a side item brings it forward
    }
    else go(Math.round(pos));
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  return {
    wrapD, go,
    get target() { return target; }, get at() { return norm(Math.round(target)); }, get busy() { return !!drag || performance.now() < idleUntil; },
    jump(i) { cancelAnimationFrame(raf); raf = 0; pos = target = landed = i; vel = 0; render(); },
  };
}
// the reveal's beats go to whichever items are in those slots now; the rest are simply there
function assignRoles(els, wrapD, map) {
  els.forEach((el, i) => {
    const k = map[Math.round(wrapD(i))];
    el.dataset.k = k || '';
    if (!k) { el.getAnimations().forEach((a) => a.cancel()); el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' }); }
  });
}
// the square-to-quad homography (Heckbert), as a CSS matrix3d for a w × h element with its origin at 0 0
function m3d(q, w, h) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  const f = (v) => +v.toFixed(6);
  return `matrix3d(${f(a / w)},${f(d / w)},0,${f(g / w)},${f(b / h)},${f(e / h)},0,${f(hh / h)},0,0,1,0,${f(x0)},${f(y0)},0,1)`;
}

// the coupons: Figma's three on the inside of a ring — the hero coupon flat in the middle, the side ones turned in
// towards you (their inner edge taller, at 50 %), and further ones going round out of sight. Each slot's 179.6 × 275.8
// face is mapped onto its quad (traced from the Figma side coupons) by a projective transform; interpolating the quads
// turns them smoothly as the ring moves. The three offers twice over, so one is always coming in from the edge.
const coupons = (() => {
  const stage = $('.d3-coupons'), slots = [...stage.querySelectorAll('.d3-cslot')], N = slots.length;
  const CW = 179.638, CH = 275.797;
  const Q = {   // TL, TR, BR, BL in stage coordinates (the stage sits at page 0, 209)
    0: [[97.68, 0], [277.32, 0], [277.32, 275.8], [97.68, 275.8]],
    1: [[317.32, 27.9], [399.32, 69.4], [399.32, 210], [317.32, 243.2]],
    2: [[432, 92], [470, 112], [470, 186], [432, 204]],
  };
  const mirror = (q) => [[375 - q[1][0], q[1][1]], [375 - q[0][0], q[0][1]], [375 - q[3][0], q[3][1]], [375 - q[2][0], q[2][1]]];
  const quadAt = (d) => {
    const a = Math.min(2, Math.abs(d)), k = Math.floor(Math.min(a, 1.999)), t = a - k;
    const q = Q[k].map((p, j) => [p[0] + (Q[k + 1][j][0] - p[0]) * t, p[1] + (Q[k + 1][j][1] - p[1]) * t]);
    return d < 0 ? mirror(q) : q;
  };
  const collect = (slot) => {
    slot = slot || slots.find((s) => Math.abs(loop.wrapD(+s.dataset.i)) < 0.5);
    const o = slot.dataset.o, cp = slot.firstElementChild, on = !cp.classList.contains('is-collected');
    slots.filter((s) => s.dataset.o === o).forEach((s) => s.firstElementChild.classList.toggle('is-collected', on));   // (its twin too)
    if (on) { try { navigator.clipboard && navigator.clipboard.writeText(DATA.coupons[o].code).catch(() => {}); } catch {} }
    H(on ? 'success' : 'tap');
    if (on) bot.hop(1.2);
  };
  const loop = loopCarousel({ stage, count: N, step: 180, tapToFocus: true, onTap: collect,
    place: (wrapD) => slots.forEach((el, i) => {
      const d = wrapD(i), a = Math.abs(d);
      el.style.transform = m3d(quadAt(d), CW, CH);
      el.style.opacity = a >= 2 ? 0 : a <= 1 ? (1 - 0.5 * a).toFixed(3) : (0.5 * (2 - a)).toFixed(3);   // Figma: side coupons at 50 %
      el.style.zIndex = String(10 - Math.round(a * 3));
      el.style.visibility = a >= 2 ? 'hidden' : '';
    }) });
  stage.addEventListener('click', (e) => e.preventDefault());
  return {
    jump: loop.jump, collect: () => collect(null),
    roles() { assignRoles(slots.map((s) => s.firstElementChild), loop.wrapD, { '-1': 'cp0', 0: 'cp1', 1: 'cp2' }); },
  };
})();

// the deck of top picks: the front card flat, the two behind it smaller, tipped either way and softly out of focus
// (Figma's stack). Drag the front card sideways and it follows the finger, tilting; let go past 96 px or with a flick
// and it's thrown off that side and tucked in at the back, while the others step forward — every card on its own
// spring (the MOVE spring: stiffness 280.6, damping 27.14), interruptible, carrying the hand's speed. The pixel arrows
// either side throw it too.
const deck = (() => {
  const stage = $('.d3-deck'), cards = [...stage.querySelectorAll('.d3-dk')], N = cards.length;
  // slot k: x, y, rotation (deg), scale, blur (px), opacity — about the card's top centre (Figma's frames 49913 / 49908 / 49903)
  const SLOT = [
    { x: 0, y: 0, r: 0, s: 1, b: 0, o: 1 },
    { x: 3.5, y: -18.8, r: 2.67, s: 0.8758, b: 1.44, o: 1 },
    { x: 3, y: -34.9, r: -2, s: 0.7424, b: 1.9, o: 1 },
    { x: 3, y: -38, r: -2, s: 0.7, b: 2.2, o: 0 },
  ];
  const slot = (k) => SLOT[Math.min(k, 3)];
  const KEYS = ['x', 'y', 'r', 's', 'b', 'o'], K = 280.6, C = 27.14;
  let order = cards.map((_, i) => i), raf = 0, drag = null, fanned = false;
  const st = cards.map(() => ({ ...SLOT[0], v: { x: 0, y: 0, r: 0, s: 0, b: 0, o: 0 }, t: { ...SLOT[0] }, fly: 0 }));
  const paint = () => cards.forEach((c, i) => {
    const s = st[i];
    c.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(3)}deg) scale(${s.s.toFixed(4)})`;
    const b = Math.round(s.b * 10) / 10; c.style.filter = b > 0.05 ? `blur(${b}px)` : '';
    c.style.opacity = s.o.toFixed(3);
  });
  const layer = () => order.forEach((ci, k) => { cards[ci].style.zIndex = String(st[ci].fly ? 40 : 30 - k); cards[ci].classList.toggle('is-top', k === 0); });
  const aim = () => order.forEach((ci, k) => { if (!st[ci].fly) st[ci].t = { ...slot(fanned ? k : Math.min(k, 0)) }; if (!fanned && k > 0) st[ci].t.o = 0; });
  function run() {
    if (raf) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      let moving = false;
      st.forEach((s, i) => {
        if (drag && drag.ci === i) return;
        for (let h = dt; h > 1e-6; h -= 1 / 240) {
          const k = Math.min(h, 1 / 240);
          KEYS.forEach((p) => { const c = p === 'o' || p === 'b' ? 0.8 : 1; s.v[p] += (K * c * (s.t[p] - s[p]) - C * Math.sqrt(c) * s.v[p]) * k; s[p] += s.v[p] * k; });
        }
        if (s.fly && Math.abs(s.x) > 420) recycle(i);
        const still = KEYS.every((p) => Math.abs(s.t[p] - s[p]) < (p === 's' || p === 'o' ? 0.0008 : 0.04) && Math.abs(s.v[p]) < 0.05);
        if (still) KEYS.forEach((p) => { s[p] = s.t[p]; s.v[p] = 0; }); else moving = true;
      });
      paint();
      raf = moving || drag ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  }
  // the thrown card, once off screen, goes in at the very back (hidden) and comes round again from there
  function recycle(i) {
    const s = st[i]; s.fly = 0;
    Object.assign(s, slot(3)); KEYS.forEach((p) => { s.v[p] = 0; }); s.t = { ...slot(order.indexOf(i)) };
    layer();
  }
  function throwTop(dir, v = 0) {
    const ci = order[0], s = st[ci];
    s.fly = dir; s.t = { x: dir * 470, y: s.y + 20, r: dir * 16, s: s.s, b: 0, o: 1 };
    s.v.x = Math.max(Math.abs(s.v.x), Math.abs(v) * 1000, 900) * dir;
    order = [...order.slice(1), ci];
    aim(); layer(); H('tick'); run();
    (dir < 0 ? cubesL : cubesR).classList.remove('is-hit'); void stage.offsetWidth; (dir < 0 ? cubesL : cubesR).classList.add('is-hit');
  }
  stage.addEventListener('pointerdown', (e) => {
    if (e.button || e.target.closest('button')) return;
    const c = e.target.closest('.d3-dk'); if (!c) return;
    const ci = +c.dataset.i;
    if (ci !== order[0]) { throwTop(-1); return; }                          // a tap on a card behind brings it forward
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
    order.slice(1).forEach((ci, k) => { const A = slot(k + 1), B = slot(k); st[ci].t = Object.fromEntries(KEYS.map((q) => [q, A[q] + (B[q] - A[q]) * p * 0.5])); });
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
  // add to cart: the button turns into a tick and the product flies into the bot
  page.addEventListener('click', (e) => {
    const b = e.target.closest('.d3-add'); if (!b) return;
    const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', String(on));
    H(on ? 'success' : 'tap');
    if (on) flyToBot(b.closest('.d3-dk, .d3-rf').querySelector('.ph'));
  });
  const cubesL = $('.d3-cubes.l'), cubesR = $('.d3-cubes.r');
  cubesL.addEventListener('click', () => throwTop(-1)); cubesR.addEventListener('click', () => throwTop(1));
  return {
    reset() { order = cards.map((_, i) => i); fanned = false; st.forEach((s) => { s.fly = 0; Object.assign(s, SLOT[0]); KEYS.forEach((p) => { s.v[p] = 0; }); }); aim(); order.forEach((ci, k) => { if (k) st[ci].o = 0; }); layer(); paint(); },
    // the reveal: the front card lands first, then the two behind it fan out from under it
    fan(delay) { setTimeout(() => { if (!live) return; fanned = true; aim(); run(); }, reduce.matches ? 0 : delay); },
    roles() { cards.forEach((c, i) => { const el = c.firstElementChild; el.dataset.k = i === order[0] ? 'deck' : ''; if (i !== order[0]) { el.getAnimations().forEach((a) => a.cancel()); el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' }); } }); },
  };
})();

// the refill carousel (Figma 1474:50538): a 236-wide main card with its neighbours either side at 80 %, 20 apart and
// 35.5 lower. Each card morphs as it moves (--k: 0 in the middle → 1 at the side, driven by yf-page.css): its photo
// box goes from 3 : 4 to the side cards' shorter one, the "Last purchased" line folds away and the + slides from
// the photo's corner (dark ink) down to the card's corner (white ink). A tap on a side card brings it forward
const refill = (() => {
  const stage = $('.d3-refill'), slots = [...stage.querySelectorAll('.d3-rslot')];
  const PITCH = 232.4, SS = 0.8, DY = 35.5;
  const loop = loopCarousel({ stage, count: slots.length, step: PITCH, tapToFocus: true, place: (wrapD) => slots.forEach((el, i) => {
    const d = wrapD(i), a = Math.abs(d), k = Math.min(1, a), ink = Math.round(255 * k);
    el.style.transform = `translate3d(${(d * PITCH).toFixed(2)}px, ${(DY * k).toFixed(2)}px, 0) scale(${(1 - (1 - SS) * k).toFixed(4)})`;
    el.style.setProperty('--k', k.toFixed(4));
    el.style.setProperty('--ox', `${(50 - 50 * k * Math.sign(d)).toFixed(2)}%`);   // (a side card's photo sits towards the middle, so a narrow product still shows in the peek)
    el.style.setProperty('--ink', `rgb(${ink},${ink},${ink})`); el.style.setProperty('--paper', `rgb(${255 - ink},${255 - ink},${255 - ink})`);
    el.style.opacity = a <= 1 ? '1' : Math.max(0, 2 - a).toFixed(3);
    el.style.zIndex = String(10 - Math.round(a * 3));
    el.style.visibility = a > 1.9 ? 'hidden' : '';
    el.classList.toggle('is-mid', a < 0.5);
  }) });
  // the wishlist heart: fills red with a pop
  stage.addEventListener('click', (e) => {
    const b = e.target.closest('.d3-wish'); if (!b) return;
    const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', String(on));
    H(on ? 'success' : 'tap');
    if (on && !reduce.matches) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: 0.25 }, { transform: 'scale(1.18)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 460, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
    if (on) bot.hop(1.1);
  });
  return {
    jump: loop.jump,
    reveal(delay) {
      // the main card rises in, then its neighbours slide out from behind it
      slots.forEach((s) => {
        const d = Math.round(loop.wrapD(+s.dataset.i)), c = s.firstElementChild;
        if (d === 0) playIn(c, 'translateY(28px) scale(.97)', delay);
        else if (Math.abs(d) === 1) playIn(c, `translateX(${-d * 64}px) scale(.94)`, delay + 160);
        else { c.getAnimations().forEach((x) => x.cancel()); c.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' }); }
      });
    },
  };
})();

// the flash-deal strip: a steady marquee that speeds up with the scroll (eased back to its own pace)
const ticker = (() => {
  const run = $('.d3-ticker .run'), unit = run.firstElementChild;
  let x = 0, rate = 1, boostV = 0, raf = 0, last = 0, W = 0, on = false;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    boostV *= Math.pow(0.06, dt); rate += (1 + boostV - rate) * Math.min(1, dt * 7);
    if (!W) W = unit.getBoundingClientRect().width;
    x -= 34 * rate * dt; if (W && x <= -W) x += W;
    run.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    raf = on ? requestAnimationFrame(frame) : 0;
  };
  const vis = new IntersectionObserver(([e]) => { on = e.isIntersecting && !reduce.matches; if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }, { root: scroller, rootMargin: '80px 0px' });
  vis.observe($('.d3-ticker'));
  return { boost(dy) { boostV = Math.min(3, boostV + Math.abs(dy) * 0.02); } };
})();

// ─── the curating beat ──────────────────────────────────────────────────────────────────────────────────────
// tap → the page opens (empty, dark) while the bot flies to the screen's centre and grows; "Curating for you"
// blurs up under it and shimmers while the bot looks around (its Working pose); then the line dissolves, the bot
// springs up to its corner and the page reveals behind it.
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
    { duration: 220, easing: FADE_OUT, fill: 'both' });
  curFx.getAnimations().forEach((a) => a.cancel());
  curFx.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'both' })
    .onfinish = () => curFx.classList.remove('is-on');
  window.orbi.setState('idle');
  window.orbi.stage(null);                                     // the bot springs up to its corner…
  H('tick');
  setTimeout(() => { if (window.orbi.pageOpen) reveal(); }, 200);  // …and once the words have cleared, the page arrives
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
  else if (e.detail === 'closing') { if (curating) { curateCancel(); window.orbi.setState('idle'); } }
  else if (e.detail === 'closed') { curateCancel(); reset(); }
});
// photos fetched up front, so nothing pops in mid-reveal
[...DATA.deck, ...DATA.refill].forEach((it) => { const im = new Image(); im.src = IMG(it.img); });
coupons.jump(0); deck.reset(); refill.jump(0);
// the dark page wants light status-bar content (applied only while the page is up)
(function ink() { if (window.orbi) window.orbi.statusInk(1); else requestAnimationFrame(ink); })();
window.yfPage = { reveal, reset, scroller, deck, coupons };
