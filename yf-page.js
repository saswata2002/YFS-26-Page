/* ══ Iteration 5 — the bot's full page, 1:1 with Figma Saswata 1520:59225 ("Option 2 · Light", 375 × 2136) ═══════
   A copy of iteration 4's flow (the circle reveal out of the bot, the "Curating for you" beat, pull-to-close, the bot's
   reactions, add-to-cart into the bot) with Figma's page built into #orbiSheet at its own x / y (yf-page.css):
     · the bot big at the top centre (the yellow Orbi), "HEY NEHA, HERE'S A GIFT FOR YOU" under it
     · the gift coupons: the bank offer flat in the middle, its neighbours turned away in perspective at half strength;
       swipe them round, tap the middle one (or "Redeem now") to copy its code
     · "TOP DEALS, PICKED JUST FOR YOU" and the deck of top picks (noon's Product card, 222 wide): swipe the front card
       away, it swings out and tucks in at the back of the pile behind Figma's two ghost cards
     · "LET'S RESTOCK, AT LOW PRICES" and the basics carousel: the middle card 222 wide (with "Last bought"), its
       neighbours the Small card (181) either side — every card morphs between the two as it moves
     · the arc, "See all basics", and the feed's end: "You're all caught up" with "Back to top"
   Every card's nudge line rolls through noon's PLP nudges (Figma's "Nudges - PLP" strip). Once you scroll, the bot
   glides up into the top-right corner, small, and comes back to the centre at the top. */
const sheet = document.getElementById('orbiSheet');
const D = '';                                   // Noontree's dirham glyph
const H = (k) => { try { window.Haptics && window.Haptics[k] && window.Haptics[k](); } catch {} };
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// the reveal: a long, soft settle (expo-out) for the move, a quicker fade — content glides in rather than pops
const REVEAL = { ms: 1100, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', fadeMs: 640, fade: 'cubic-bezier(0.25, 0.1, 0.25, 1)' };
const FADE_IN = 'cubic-bezier(0.33, 1, 0.68, 1)';
const A = (f) => `f/${f}`;                    // this iteration's art
const F = (f) => A(`f7/${f}`);                // Figma 789:10090's exports
const G = (f) => A(`f8/${f}`);                // Figma 1520:59225's exports

// ─── data: Figma's products first (AirPods in the deck; Pampers in the middle of the carousel with Gerber and MTR
// either side), then noon.com's 11.11 deals and household staples (2026-11-09)
const num = (v) => (v % 1 ? v.toFixed(2) : String(v));      // Figma: "16.20", "899" — no thousands comma
const pct = (it) => (it.off != null ? it.off : Math.floor((1 - it.price / it.was) * 100));
const DATA = {
  // the gift coupons (Figma 1520:59245 and the two either side): the bank offers live on noon.com that week. Each one's
  // holo panel and expiry strip carry its own colours (the middle one Figma's purple + yellow; the side ones sampled off
  // Figma's renders of them: Emirates Islamic's blue, tabby's mint)
  coupons: [
    { t1: `30% extra off up to ${D}150`, t2: 'with Emirates Islamic', card: 'ei', tier: 'Platinum', code: 'EIB30', h0: '#2a1fa8', h1: '#8f7cff', strip: '#f5c46b' },
    { t1: `20% extra off up to ${D}100`, t2: 'with Emirates Islamic', card: 'ei', tier: 'Signature', code: 'EIB20', h0: '#0e3a85', h1: '#4485cb', strip: '#b3dbff' },
    { t1: `25% extra off up to ${D}100`, t2: 'when you pay with tabby', card: 'tabby', code: 'TABBYCASH25', h0: '#0a5640', h1: '#2ea97a', strip: '#a5efcb' },
  ],
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
    { src: F('4716a.png'), name: 'Pampers Ultimate Comfort Pants Diapers Size 6 (16+kg) Super Saving Pack', price: 44.89, was: 74.01, off: 39, rating: 4.7, last: 'Last bought on 28 oct' },
    { src: F('2e34c.png'), name: 'MTR Dosa Mix, 200g', price: 2.7, was: 5.67, off: 52, rating: 2.0, last: 'Last bought on 2 nov' },
    { src: A('fy/5e392.png'), name: 'Fine Facial Tissue 200 Sheets 2 Ply Pack of 10 White', price: 39.28, was: 59, off: 33, rating: 4.3, last: 'Last bought on 28 oct' },
    { img: 'refill1', name: 'Persil Power Gel Liquid Laundry Detergent Deep Clean 4.8L', price: 41.7, was: 82.6, last: 'Last bought on 12 oct' },
    { src: A('fy/d1e4f.png'), name: 'Fine Kitchen Towel 60 Sheets 3 Ply Pack of 12 Rolls White 26.5x21cm', price: 30.7, was: 39.19, off: 22, rating: 4.3, last: 'Last bought on 19 oct' },
    { img: 'refill3', name: 'Fairy Lavender Dishwashing Liquid, 3X Grease Cutting Power', price: 12.9, was: 18.34, last: 'Last bought on 20 oct' },
    { src: A('fy/c7a58.png'), name: 'Nescafe Classic Coffee Jar 190grams Single', price: 30.7, was: 39.19, off: 22, rating: 4.3, last: 'Last bought on 24 oct' },
    { src: F('c4463.png'), name: 'Gerber Organic NutriPuffs Raspberry & Banana, 35g', price: 16.2, was: 27.27, off: 41, rating: 4.3, last: 'Last bought on 4 nov' },
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
// line under them at −2.5°. Each word's box is placed by its centre and tipped there. The sticker reveals as one piece —
// ribbon and words together (the reveal moves the whole sticker, so nothing inside it comes apart)
const word = (w) => `<b data-t="${w}"><span>${w}</span></b>`;
const heading = (cls, k, ribbon, a, b, c) => `<div class="d3-abs f5-hd ${cls} rv" data-k="${k}">
  <img class="rb" src="${ribbon}" alt="" draggable="false">
  <span class="w a">${word(a)}</span><span class="w g">${word(b)}</span>
  <span class="w c"><b>${c}</b></span></div>`;
// a pixel heart or a sparkle at Figma's box [left, top, w, h]; the art [w, h] inside it with its tilt / flip; `loop` = the
// heart's beat or the sparkle's twinkle (yf-page.css), `d` its offset in the loop
const dec = (k, src, [l, t, w, h], [iw, ih, tf = 'none'], loop, d = 0) => `<span class="d3-abs f5-dec${loop ? ` ${loop}` : ''}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px${d ? `;animation-delay:${d}s` : ''}"><i class="t" style="width:${iw}px;height:${ih}px;transform:${tf}"><img class="rv" data-k="${k}" src="${src}" alt="" draggable="false"></i></span>`;
// a gift coupon (Figma 1520:59245 "face", 180 × 276): the ticket (its body art), the holo panel — the offer's own colours,
// the light rays, the bank card on it — the dashed tear line, the offer's two lines, and the scalloped expiry strip
// (Figma's strip art as a mask, filled with the offer's colour). Collected (a tap on the middle one, or Redeem now): it
// flips over to its back — the offer's strip colour, the tick drawing itself on in its dark disc, "Code copied", the
// code, "Applied at checkout" (the earlier iterations' coupon back) — and flips back on a second tap
const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" pathLength="1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BANK = {
  ei: (c) => `<i class="chip"></i><img class="lg" src="${G('c31f9.png')}" alt="Emirates Islamic" draggable="false"><b class="visa">VISA</b><em class="tier">${c.tier}</em>`,
  tabby: () => `<img class="tb" src="${A('p/logo-tabby.png')}" alt="tabby" draggable="false"><span class="split">Split in 4. No interest.</span>`,
};
const coupon = (c, i) => `<div class="d3-cslot" data-i="${i}" data-o="${i % DATA.coupons.length}"><div class="gc rv" style="--h0:${c.h0};--h1:${c.h1};--st:${c.strip}" role="button" aria-label="${c.t1.replace(D, 'AED ')} ${c.t2}">
  <div class="face">
    <img class="body" src="${G('46794.png')}" alt="" draggable="false">
    <div class="holo"><i class="grad"></i><img class="rays" src="${G('9a150.png')}" alt="" draggable="false"><div class="bank ${c.card}">${BANK[c.card](c)}</div></div>
    <img class="dash" src="${G('a4e46.png')}" alt="" draggable="false">
    <p class="t1">${c.t1}</p><p class="t2">${c.t2}</p>
    <i class="strip"></i>
    <p class="exp"><span>EXPIRES ON 12/11/2026</span></p>
  </div>
  <div class="back" aria-hidden="true"><i class="ck">${TICK}</i><b>Code copied</b><span class="cd">${c.code}</span><em>Applied at checkout</em></div>
</div></div>`;

const scroller = document.createElement('div');
scroller.className = 'yf-scroll d3-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="d3 f5" data-node-id="1520:59229">
  <img class="d3-abs f5-bg rv" data-k="bg" src="${G('d75ef.png')}" alt="" draggable="false">
  ${heading('hn', 'h', G('500e8.svg'), 'HEY', 'NEHA,', 'HERE\'S A GIFT FOR YOU')}
  ${dec('hx', G('70a92.svg'), [24.88, 182.4, 45.197, 52.603], [37.647, 46.776, 'rotate(-10deg) scaleY(-1)'], 'hb')}
  ${dec('hx', G('fb026.svg'), [315, 214.61, 31.906, 30.349], [28.475, 26.645, 'rotate(8deg) scaleY(-1)'], 'hb', -0.9)}
  ${dec('hx', G('4e23f.svg'), [307, 164.64, 20.957, 20.072], [17.871, 16.721, 'rotate(12deg) scaleY(-1)'], 'hb', -0.45)}
  ${dec('hx', G('1984d.svg'), [63, 165, 26, 26], [26, 26], 'sp')}${dec('hx', G('613fd.svg'), [277, 277, 22, 22], [22, 22], 'sp', -1.2)}
  <div class="d3-abs d3-coupons" data-no-drag aria-roledescription="carousel" aria-label="Gift coupons">${[...DATA.coupons, ...DATA.coupons].map(coupon).join('')}</div>
  <img class="d3-abs f5-shape rv" data-k="shape" src="${G('35123.png')}" alt="" draggable="false">
  <button class="d3-abs f5-cta rd rv" data-k="redeem" type="button">Redeem now</button>
  ${heading('td', 't', F('9b612.svg'), 'TOP', 'DEALS,', 'PICKED JUST FOR YOU')}
  ${dec('tx', F('c2f52.svg'), [37.29, 724.85, 31.906, 30.349], [28.475, 26.646, 'rotate(-8deg) scaleY(-1)'], 'hb')}
  ${dec('tx', F('1984d.svg'), [305, 723.2, 26, 26], [26, 26], 'sp')}
  <div class="d3-abs d3-deck" data-no-drag aria-roledescription="carousel" aria-label="Top deals">${DATA.deck.map(deckCard).join('')}</div>
  ${heading('rs', 'r', F('ae09d.svg'), 'LET\'S', 'RESTOCK,', 'AT LOW PRICES')}
  ${dec('rx', G('d36b2.svg'), [333, 1322, 31.906, 30.349], [28.475, 26.645, 'rotate(8deg) scaleY(-1)'], 'hb', -0.9)}
  <div class="d3-abs d3-refill" data-k="refill" data-no-drag aria-roledescription="carousel" aria-label="Restock at low prices">${DATA.refill.map(refillCard).join('')}</div>
  ${dec('rx', G('99ac9.svg'), [-39.98, 1254, 134.451, 400], [80.595, 392.604, 'rotate(-8deg) scaleY(-1)'], 'under')}
  <img class="d3-abs f5-arc rv" data-k="arc" src="${F('89823.svg')}" alt="" draggable="false">
  <button class="d3-abs f5-cta sb rv" data-k="cta" type="button">See all basics</button>
  <div class="d3-abs f5-end rv" data-k="end" data-node-id="1520:59360">
    <svg class="ck" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="22" fill="#E6F6EE"/><path class="mk" d="M14.5 22.5L19.5 27.5L29.5 17" pathLength="1" fill="none" stroke="#0F8857" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><p class="t">You're all caught up</p><p class="s">Fresh picks land here every morning</p>
    <button class="top" type="button"><img src="${G('d7473.svg')}" alt="" draggable="false">Back to top</button>
  </div>
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
// key: [delay on the clock (ms), from-transform, group, offset in its group (ms)]. Top to bottom: the light behind the bot
// first; each sticker rises in as one piece (ribbon and words together), then its hearts and sparkles pop in around it;
// the middle coupon rises and its neighbours fan out from under it; the panel and "Redeem now"; the deck's front
// card rises and the cards behind it fan out from under it (deck.fan); the carousel's middle card rises (its neighbours
// glide out with the scroll, refill.reveal); the arc and "See all basics"; the feed's end last
const BEATS = {
  bg: [0, 'scale(1.04)', 'bg', 0],
  h: [0, 'translateY(14px) scale(.96)', 'hey', 0], hx: [200, 'scale(.4)', 'hey', 200],
  cp1: [300, 'translateY(30px) scale(.96)', 'coupons', 0], cp0: [470, 'translateX(46px) scale(.94)', 'coupons', 170], cp2: [470, 'translateX(-46px) scale(.94)', 'coupons', 170],
  shape: [520, 'translateY(24px)', 'redeem', 0], redeem: [560, 'translateY(16px) scale(.97)', 'redeem', 40],
  t: [640, 'translateY(14px) scale(.96)', 'top', 0], tx: [840, 'scale(.4)', 'top', 200],
  deck: [940, 'translateY(56px) scale(.96)', 'deck', 0],
  r: [1100, 'translateY(14px) scale(.96)', 'restock', 0], rx: [1300, 'scale(.4)', 'restock', 200],
  refill: [1280, null, 'refill', 0],
  arc: [1440, 'translateY(10px)', 'cta', 0], cta: [1440, 'translateY(16px) scale(.97)', 'cta', 60],
  end: [1560, 'translateY(20px)', 'end', 0],
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
  if (k === 'end') tick(delay + 200);              // (the green check plays as "You're all caught up" glides in)
  playIn(el, b[1], delay);
  if (k === 'deck') deck.fan(delay + 480);   // (once the front card is mostly in, so the ones behind never show through it)
}
// the product names end the way Figma ends them: two lines, cut at the last character that fits, then "…" (the web's
// line clamp only cuts at a whole word — "(16+kg)…" where Figma has "(16+kg) S…"). Measured once the fonts are in, on a
// copy laid out as the middle / front card has it (198 wide)
let namesFit = false;
function fitNames() {
  if (namesFit) return;
  const go = () => {
    if (namesFit) return;
    const probe = document.createElement('p');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;width:198px;margin:0;visibility:hidden;display:block';
    page.appendChild(probe);
    $$('.pc .nm').forEach((el) => {
      const full = el.dataset.full || el.textContent, refill = el.closest('.pc.r');
      el.dataset.full = full; el.title = full;
      probe.style.font = `500 14px/${refill ? 20 : 19}px ${getComputedStyle(el).fontFamily}`;
      probe.style.letterSpacing = refill ? '-0.1px' : '0';
      const max = 2 * (refill ? 20 : 19) + 1, fits = (t) => { probe.textContent = t; return probe.offsetHeight <= max; };
      if (fits(full)) { el.textContent = full; return; }
      let lo = 0, hi = full.length;                       // (the longest start that, with "…", still fits in two lines)
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (fits(full.slice(0, mid).trimEnd() + '…')) lo = mid; else hi = mid - 1; }
      el.textContent = full.slice(0, lo).trimEnd() + '…';
    });
    probe.remove();
    namesFit = true;
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
}
// the feed's end, "You're all caught up": the green disc pops in on a lively spring (a reward beat — 0.5 → 1.1 → 0.97 →
// 1, 560 ms) and the tick draws itself on over it, short stroke then long (360 ms in-out, from 220 ms in, the stroke's
// own length), with a success haptic as it lands. Every time it comes into view; reduced motion: there at once
function tick(delay) {
  const svg = $('.f5-end .ck'), disc = svg.querySelector('.bg'), mark = svg.querySelector('.mk');
  [disc, mark].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  clearTimeout(tick.t);
  if (reduce.matches) { mark.style.strokeDashoffset = '0'; return; }
  mark.style.strokeDashoffset = '1';
  disc.animate([{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1.1)', opacity: 1, offset: 0.42 }, { transform: 'scale(.97)', offset: 0.72 }, { transform: 'scale(1)' }],
    { duration: 560, delay, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'backwards' });
  const draw = mark.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 360, delay: delay + 220, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' });
  draw.finished.then(() => { mark.style.strokeDashoffset = '0'; draw.cancel(); }, () => {});
  tick.t = setTimeout(() => H('success'), delay + 520);
}
function reveal({ withBot = false } = {}) {
  live = true;
  fitNames();
  coupons.roles(); deck.roles();
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
  const anchorOf = (g, el) => (g === 'deck' ? $('.d3-deck .d3-dk.is-top') : g === 'refill' ? $('.d3-refill') : g === 'coupons' ? $('.d3-coupons') : el.closest('.f5-hd') || el);
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
  // what's below the screen waits for the scroll: it plays in as it comes into view — and hides again once it has gone
  // back below the screen, so scrolling down again plays it again. Anything already showing on the first fold plays in
  // with the rest (Figma 867:7773: the carousel's top peeks in at the bottom edge)
  const below = [], seq = [];
  Object.values(groups).forEach((g) => {
    if (g.name === 'bg') { play(g); return; }                 // (the light behind the bot: at once)
    const seen = Math.min(VH, g.y + g.h) - Math.max(0, g.y);
    (seen <= 0 ? below : seq).push(g);
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
  live = false; lazyIO && lazyIO.disconnect(); lazyIO = null; dock.reset();
  page.querySelectorAll('.rv').forEach(cancelOwn);
  scroller.scrollTop = 0; onScroll();
  coupons.jump(0); deck.reset(); refill.jump(0); nudges.stop();
  page.querySelectorAll('.gc.is-collected').forEach((c) => c.classList.remove('is-collected'));
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
  const el = e.target.closest('.d3-cslot, .d3-dk, .d3-rslot, .f5-cta, .f5-end .top'); if (!el || !window.orbi) return;
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
$('.f5-cta.sb').addEventListener('click', () => { H('tap'); bot.cheer(); bot.hop(1.2); });
// "Redeem now": copies the middle coupon's code (it turns to "copied"), the bot jumps for it
$('.f5-cta.rd').addEventListener('click', () => coupons.collect());
// "Back to top": the page glides back up (an ease-out on its own clock, interruptible by a touch), the bot comes back
// to the centre as it arrives
$('.f5-end .top').addEventListener('click', () => {
  H('tap');
  const from = scroller.scrollTop; if (from <= 0) return;
  if (reduce.matches) { scroller.scrollTop = 0; return; }
  const ms = Math.min(900, 420 + from * 0.18), t0 = performance.now();
  let stop = false; const halt = () => { stop = true; };
  scroller.addEventListener('touchstart', halt, { once: true, passive: true }); scroller.addEventListener('wheel', halt, { once: true, passive: true });
  const step = (now) => {
    if (stop) return;
    const u = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - u, 3);
    scroller.scrollTop = from * (1 - e);
    if (u < 1) requestAnimationFrame(step); else { scroller.removeEventListener('touchstart', halt); scroller.removeEventListener('wheel', halt); }
  };
  requestAnimationFrame(step);
});

// the hearts' and sparkles' loops (yf-page.css f5Beat / f5Twinkle): paused while they're off screen
(() => {
  const calm = new IntersectionObserver((ents) => ents.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { root: scroller, rootMargin: '80px 0px' });
  $$('.f5-dec').forEach((el) => { el.classList.add('is-off'); calm.observe(el); });
})();

// ─── scroll: the bot reads along ──────────────────────────────────────────────────────────────────────────────
let lastY = 0;
function onScroll() {
  const top = scroller.scrollTop;
  if (live && Math.abs(top - lastY) > 2 && top > 0) bot.look(0, top > lastY ? 0.22 : -0.1, 380);   // reading down / back up
  lastY = top;
  if (live) refill.scrolled(top);                 // the carousel's side cards glide out as it scrolls into view
  dock.update(top);
}
scroller.addEventListener('scroll', onScroll, { passive: true });
// the bot rests big at the top centre (main.js VIEW.page, where Figma draws it) while you're at the top of the page;
// once you start scrolling it glides up into the top-right corner at its small size, and comes back to the centre when
// you scroll back to the top (hysteresis: out past 40 px, back under 12 px) — iteration 4's dock
const dock = (() => {
  const CORNER = { cx: 336, cy: 72, unit: 17 };
  let on = false;
  return {
    update(top) {
      if (!live || curating || !window.orbi || !window.orbi.pageOpen) return;
      const want = on ? top > 12 : top > 40;
      if (want === on) return;
      on = want; window.orbi.stage(on ? CORNER : null);
    },
    reset() { on = false; },
  };
})();
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

// the square-to-quad homography (Heckbert), as a CSS matrix3d for a w × h element with its origin at 0 0
function m3d(q, w, h) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  const f = (v) => +v.toFixed(6);
  return `matrix3d(${f(a / w)},${f(d / w)},0,${f(g / w)},${f(b / h)},${f(e / h)},0,${f(hh / h)},0,0,1,0,${f(x0)},${f(y0)},0,1)`;
}

// the gift coupons (Figma 1520:59245 + the two d3-cslot renders): the middle one flat, 180 × 276 at (98, 305); its
// neighbours turned away from the middle in perspective at half strength — their near edge 212 tall, 41 px in from the
// middle coupon's side, the far edge going off the screen's edge (the quads fitted to Figma's renders: top and bottom
// edges converging on the same vanishing point, the visible slice the same share of the coupon). In between, every
// corner travels straight from one pose to the next and the card is drawn through them as a true perspective map, so
// the turn reads as one card rotating; further out they slide on and fade away. The offers twice over, so one is always
// coming in from the edge. Swipe them round (the carousel spring); a tap on a side one brings it forward; a tap on the
// middle one, or "Redeem now", copies its code.
const coupons = (() => {
  const stage = $('.d3-coupons'), slots = [...stage.querySelectorAll('.d3-cslot')], N = slots.length, W = 180, Hc = 276;
  const FLAT = [[0, 0], [W, 0], [W, Hc], [0, Hc]];
  const SIDE_R = [[221, 28], [301.4, 69], [301.4, 210.95], [221, 240.3]];                     // (right: near edge first)
  const SIDE_L = SIDE_R.map(([x, y]) => [W - x, y]).map((p, i, a) => a[[1, 0, 3, 2][i]]);   // (mirrored about the middle)
  const lerpQ = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const quad = (d) => {
    const a = Math.abs(d), side = d > 0 ? SIDE_R : SIDE_L;
    if (a <= 1) return lerpQ(FLAT, side, a);
    const dx = (d > 0 ? 1 : -1) * (a - 1) * 120;                                             // (on past the edge)
    return side.map(([x, y]) => [x + dx, y]);
  };
  // the flip's elastic landing: a spring (ω 11, ζ .72 — about 4 % past, then settled) sampled into a CSS linear() curve
  if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)')) {
    const w = 11, z = 0.72, wd = w * Math.sqrt(1 - z * z), T = 0.9, n = 45;
    const pts = Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * T; return i === n ? 1 : 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); });
    document.documentElement.style.setProperty('--gc-flip', `linear(${pts.map((p) => p.toFixed(4)).join(', ')})`);
  }
  const collect = (slot) => {
    slot = slot || slots.find((s) => Math.abs(loop.wrapD(+s.dataset.i)) < 0.5);
    const o = slot.dataset.o, on = !slot.firstElementChild.classList.contains('is-collected');
    slots.filter((s) => s.dataset.o === o).forEach((s) => s.firstElementChild.classList.toggle('is-collected', on));   // (its twin too)
    // …and the coupon itself gives a little: it dips as it turns, rebounds just past full size and settles (on the
    // individual scale property, so it never meets the reveal's or the carousel's transforms)
    if (on && !reduce.matches) slot.firstElementChild.animate([{ scale: 1 }, { scale: 0.96, offset: 0.3 }, { scale: 1.025, offset: 0.62 }, { scale: 0.995, offset: 0.82 }, { scale: 1 }],
      { duration: 760, easing: 'cubic-bezier(0.37, 0, 0.63, 1)' });
    if (on) { try { navigator.clipboard && navigator.clipboard.writeText(DATA.coupons[o].code).catch(() => {}); } catch {} }
    H(on ? 'success' : 'tap');
    if (on) bot.hop(1.4);
  };
  const loop = loopCarousel({ stage, count: N, step: 200, tapToFocus: true, onTap: collect,
    place: (wrapD) => slots.forEach((el, i) => {
      const d = wrapD(i), a = Math.abs(d);
      el.style.transform = m3d(quad(d), W, Hc);
      el.style.setProperty('--k', Math.min(1, a).toFixed(3));   // (the bank card turns see-through towards the side, yf-page.css)
      el.style.opacity = a <= 1 ? (1 - 0.5 * a).toFixed(3) : Math.max(0, 0.5 * (2 - a)).toFixed(3);   // Figma: the side coupons at 50 %
      el.style.zIndex = String(10 - Math.round(a * 3));
      el.style.visibility = a >= 2 ? 'hidden' : '';
      el.classList.toggle('is-mid', a < 0.5);
      el.setAttribute('aria-hidden', String(a >= 0.5));
    }) });
  stage.addEventListener('click', (e) => e.preventDefault());
  return {
    jump: (i) => loop.jump(i), collect: () => collect(null),
    roles() { assignRoles(slots.map((s) => s.firstElementChild), loop.wrapD, { '-1': 'cp0', 0: 'cp1', 1: 'cp2' }); },
  };
})();
// the reveal's beats go to whichever items are in those slots now; the rest are simply there
function assignRoles(els, wrapD, map) {
  els.forEach((el, i) => {
    const k = map[Math.round(wrapD(i))];
    el.dataset.k = k || '';
    if (!k) { el.getAnimations().forEach((a) => a.cancel()); held(el); }
  });
}

// the deck of top picks: the front card flat (Figma 789:12983, 222 × 324 at 71.5, 266), the two behind it as Figma's
// ghost cards — the nearer one 196 wide tipped +2.67°, 14 px higher, the far one 219 wide tipped −2°, 27 px higher, both
// washed (--g) to the ghosts' white-to-#EEF0F4 — sharp, no blur (user, 2026-11-12). Drag the front card sideways and it follows the
// finger, tilting; let go past 96 px or with a flick and it swings out that side and tucks in at the back of the pile
// while the others step forward — every card on its own spring (the MOVE spring: stiffness 280.6, damping 27.14),
// interruptible, carrying the hand's speed. A tap on a card peeking out behind brings the next one forward.
const deck = (() => {
  const stage = $('.d3-deck'), cards = [...stage.querySelectorAll('.d3-dk')];
  // slot k: x, y (of the card's top centre), rotation (deg), scale, blur (px), opacity, ghost wash
  const SLOT = [
    { x: 0, y: 0, r: 0, s: 1, b: 0, o: 1, g: 0 },
    { x: 6.1, y: -14.2, r: 2.67, s: 0.8845, b: 0, o: 1, g: 1 },        // 789:10254 (drawn over the far one)
    { x: 0, y: -27.2, r: -2, s: 0.9865, b: 0, o: 0.8, g: 1 },          // 789:10249
    { x: 0, y: -27.2, r: -2, s: 0.9865, b: 0, o: 0, g: 1 },
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
    c.style.filter = '';   // (the cards behind are sharp: no blur)
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

// the basics carousel (Figma 1523:61102 – 61105): the middle card 222 × 326 at (76, 1401), its neighbours Figma's Small
// card (181 × 276, centred on the middle one) with their centres 225.5 either side. Each card is the middle card scaled to
// 81.5 % at the side, and morphs as it moves (--k: 0 in the middle → 1 at the side, yf-page.css): the buttons keep their
// 32 px, the type steps down only 14 → 13 and the nudge line fades out, as in Figma's Small card. Drag or flick it round;
// a tap on a side card brings it forward.
const refill = (() => {
  const stage = $('.d3-refill'), slots = [...stage.querySelectorAll('.d3-rslot')];
  const PITCH = 225.5, SS = 181 / 222;
  // the side cards turn slightly in 3D, away from the middle — their inner edge (next to the middle card) going back,
  // the outer edge coming forward (user, 2026-11-12: inverted) — by TILT° at the side, growing
  // with the card's distance from the middle (flat in the middle, so the turn eases in and out as you swipe); each card
  // seen through its own perspective, so the two sides mirror each other
  const TILT = 12, PERSP = 900;
  const loop = loopCarousel({ stage, count: slots.length, step: PITCH, tapToFocus: true, place: (wrapD) => slots.forEach((el, i) => {
    const d = wrapD(i), a = Math.abs(d), k = Math.min(1, a);
    el.style.transform = `perspective(${PERSP}px) translate3d(${(d * PITCH).toFixed(2)}px, 0, 0) rotateY(${(-Math.sign(d) * TILT * k).toFixed(3)}deg) scale(${(1 - (1 - SS) * k).toFixed(4)})`;
    el.style.setProperty('--k', k.toFixed(4));
    // (the type morphs in 16 steps — 0.1 px of size each, below what the eye can see — so its glyphs are re-rasterised a
    // handful of times per swipe instead of every frame)
    el.style.setProperty('--kt', (Math.round(k * 16) / 16).toFixed(4));
    el.style.opacity = a <= 1 ? '1' : Math.max(0, 2 - a).toFixed(3);
    el.style.zIndex = String(10 - Math.round(a * 3));
    el.style.visibility = a > 1.9 ? 'hidden' : '';
    el.classList.toggle('is-mid', a < 0.5);
    el.setAttribute('aria-hidden', String(a >= 0.5));
  }) });
  // the reveal: the middle card is solid from the start — it's opaque within 160 ms — and scales up from 86 % to full on
  // the page's soft settle (expo-out, 1.1 s); once it's nearly full size, its two neighbours slide out from behind it —
  // together, on one slow critically damped spring (stiffness 60, ζ 1: it starts from rest, so they ease out rather than
  // shoot out, glide, and settle with no bounce — 95 % there at ≈ 0.6 s, at rest by ≈ 0.9 s) — from completely hidden
  // behind it (250 px in, at 90 %: inside the middle card's edges, so nothing pokes out) to their slots. Opaque all the
  // way, no fade: it's the middle card that hides them, so nothing is ever seen through anything. A touch mid-reveal
  // finishes it at once.
  const SIDE = { from: 250, s0: 0.9, K: 60, Z: 1, after: 380 };
  const springPath = (() => {            // progress 0 → 1 of that spring, sampled every 1/60 s until it's settled
    const c = 2 * SIDE.Z * Math.sqrt(SIDE.K), out = [0];
    let x = 1, v = 0;
    for (let f = 1; f < 120; f++) {
      for (let k = 0; k < 8; k++) { v += (-SIDE.K * x - c * v) / 480; x += v / 480; }
      out.push(1 - x);
      if (Math.abs(x) < 0.0008 && Math.abs(v) < 0.01) break;
    }
    out[out.length - 1] = 1;
    return out;
  })();
  let running = [];
  const finish = () => { running.forEach((a) => { try { a.finish(); } catch {} }); running = []; };
  const drop = () => { running.forEach((a) => a.cancel()); running = []; };   // (cancelled, not finished: nothing is left showing)
  stage.addEventListener('pointerdown', finish);   // (touched mid-reveal: everything straight to where it belongs)
  return {
    jump: loop.jump,
    hide() { drop(); slots.forEach((sl) => { sl.firstElementChild.style.transform = ''; cancelOwn(sl.firstElementChild); }); },   // (back to hidden, to play in again)
    reveal(delay) {
      drop();
      const d0 = reduce.matches ? 0 : delay, n = springPath.length - 1;
      slots.forEach((s) => {
        const d = Math.round(loop.wrapD(+s.dataset.i)), c = s.firstElementChild;
        c.style.transform = ''; cancelOwn(c);
        if (reduce.matches || Math.abs(d) > 1) { held(c); return; }
        if (d === 0) {
          const a = c.animate([{ transform: 'scale(.86)' }, { transform: 'none' }], { duration: REVEAL.ms, delay: d0, easing: REVEAL.ease, fill: 'both' });
          const b = c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: d0, easing: FADE_IN, fill: 'both' });
          running.push(a, b);
          Promise.all([a.finished, b.finished]).then(() => { held(c); a.cancel(); b.cancel(); }, () => {});
          return;
        }
        // (no backwards fill: until it starts it stays hidden by the page's own .rv; it starts once the middle card is solid)
        const a = c.animate(springPath.map((p, i) => ({ transform: `translate3d(${(-d * SIDE.from * (1 - p)).toFixed(2)}px, 0, 0) scale(${(SIDE.s0 + (1 - SIDE.s0) * p).toFixed(4)})`, opacity: 1, offset: i / n })),
          { duration: n * (1000 / 60), delay: d0 + SIDE.after, easing: 'linear', fill: 'forwards' });
        running.push(a);
        a.finished.then(() => { held(c); a.cancel(); }, () => {});
      });
    },
    scrolled() {},
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
// every image on the page decoded up front (not on its first paint, mid-reveal, which costs a dropped frame or two)
$$('img').forEach((im) => { if (im.decode) im.decode().catch(() => {}); });
// photos fetched up front, so nothing pops in mid-reveal
[...DATA.deck, ...DATA.refill].forEach((it) => { const im = new Image(); im.src = SRC(it); });
coupons.jump(0); deck.reset(); refill.jump(0);
(function ink() { if (window.orbi) window.orbi.statusInk(0); else requestAnimationFrame(ink); })();   // (a light page: dark status-bar content)
window.yfPage = { reveal, reset, scroller, coupons, deck, refill };
