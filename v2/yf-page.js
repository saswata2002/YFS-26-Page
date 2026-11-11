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
const A = (f) => `f/${f}`;
const N = (id) => `f/n/${id}.jpg`;                               // Neha's feed: noon.com product photos                                     // this iteration's art (Figma exports + noon photos)

// ─── data: live from noon.com/uae-en (2026-11-09) — the homepage's bank offers (Emirates Islamic 09–12 Nov, tabby
// 08–12 Nov), the 11.11 sale's top deals, and household staples from the grocery store (prices as listed that day)
const money = (v) => (Math.round(v * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const pct = (it) => Math.floor((1 - it.price / it.was) * 100);   // (noon rounds its % off down)
const DATA = {
  coupons: [   // the hero coupon first (Figma's "Midnight Gold"), then the others round the ring
    { title: `30% extra off up to ${D}150`, sub: 'with Emirates Islamic', code: 'EIB30', ends: '12/11/2026', card: 'ei', look: 'gold' },
    { title: `20% extra off up to ${D}100`, sub: 'with Emirates Islamic', code: 'EIB20', ends: '12/11/2026', card: 'ei2', look: 'ice' },
    { title: `25% extra off up to ${D}100`, sub: 'when you pay with tabby', code: 'TABBYCASH25', ends: '12/11/2026', card: 'tabby', look: 'mint' },
  ],
  // Neha (the Mystique dossier, InterOp data to 26 Oct 2026) — every product a live noon.com/uae-en listing (2026-11-10:
  // name, price, was, rating as listed; photos in f/n/). Kept out on purpose, as the dossier asks: anything health-related,
  // the child's gender or age, and birthday or anniversary framing.
  deck: [      // "the big buys she is still researching": the MacBook, iPhone, office chair, dressing table, washing machine
    { src: N('d0'), name: 'Apple MacBook Pro 16-inch, M4 Pro chip, 24GB RAM, 512GB SSD, Silver', price: 8599, was: 15019, rating: 4.5, express: true },
    { src: N('d1'), name: 'Apple iPhone 17 Pro 256 GB (eSIM only) Cosmic Orange 5G', price: 3999, was: 4699, rating: 4.5, express: true },
    { src: N('d2'), name: 'DROGO Ergonomic Office Chair, High Back with Adaptive Lumbar Support, Pro Grey', price: 929, was: 1699, rating: 5.0, express: true },
    { src: N('d3'), name: 'SUNLIT HOME Modern Wooden Dressing Table Vanity Set with Mirror & 4 Drawers', price: 284, was: 699, rating: 3.9, express: true },
    { src: N('d4'), name: 'Midea 8KG Front Load Washing Machine, BLDC Inverter, 1400 RPM, 15 Programs', price: 849, was: 1199, rating: 4.7, express: true },
  ],
  refill: [    // "a toddler moving up a size": Size 6 pants from the brand she buys, her toddler snacks, the overdue bath care
    { src: N('t0'), name: 'Pampers Ultimate Comfort Pants Diapers Size 6 (16+kg) Super Saving Pack', price: 44.89, was: 74.01, rating: 4.7, last: 'Your next size up' },
    { src: N('t1'), name: 'Pampers Aloe Vera Pants Diapers Size 6 Mega Box 68 Count', price: 99, was: 175, rating: 4.6, last: 'Your next size up' },
    { src: N('t2'), name: 'Gerber Puffs Vanilla 1.48 Oz', price: 21.5, was: 29.25, rating: 4.8, last: 'Last bought 8 Oct' },
    { src: N('t3'), name: 'Kiddylicious Veggie Straws, 120g (10x12g)', price: 41.84, was: 60, rating: 5.0, last: 'Last bought 8 Oct' },
    { src: N('t4'), name: 'Aveeno Baby Gentle Wash And Shampoo, 532 ml', price: 86, was: 94, rating: 5.0, last: 'Last bought 28 Aug' },
  ],
};
const IMG = (k) => A(`p/${k}.webp`);
// every product card carries the same three: a wishlist heart, the express · Today tag and the rating (yf-page.css .meta)
const EX = `<img class="ex" src="${A('d26a7.svg')}" alt="express · Today" draggable="false">`;
const RT = (r) => `<span class="w-rt"><img src="${A('w/star.svg')}" alt="" draggable="false">${(+r || 4.3).toFixed(1)}</span>`;   // (4.3 where noon shows no rating yet)
const META = () => `<div class="meta">${EX}</div>`;   // (the rating sits on the photo: RT, bottom-left)

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
    <div class="holo"><i class="grad"></i><img class="rays" src="${A('9d964.svg')}" alt="" draggable="false"><div class="bank bank-${c.card}">${CARD[c.card]}</div></div>
    <img class="dash" src="${A('40b1b.svg')}" alt="" draggable="false">
    <p class="t1">${c.title}</p><p class="t2">${c.sub}</p>
    <i class="strip"></i><p class="exp">EXPIRES ON ${c.ends}</p>
  </div>
  <div class="back"><i class="ck">${CHECK}</i><b>Code copied</b><span class="cd">${c.code}</span><em>Applied at checkout</em></div>
</div></div>`;
const priceRow = (it) => `<div class="pr"><b><i>${D}</i>${money(it.price)}</b><s>${money(it.was)}</s><em>${pct(it)}%</em></div>`;
const deckCard = (it, i) => `<div class="d3-dk" data-i="${i}"><div class="in rv">
  <div class="main"><div class="ph"><img src="${it.src || IMG(it.img)}" alt="" draggable="false"></div><i class="tint"></i>${RT(it.rating)}
    <button class="d3-wish" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button></div>
  <div class="info"><p class="nm">${it.name}</p>${priceRow(it)}${META()}
    <button class="d3-add" type="button" aria-label="Add to cart">${PLUS}<span class="ok">${CHECK}</span></button></div>
</div></div>`;
const refillCard = (it, i) => `<div class="d3-rslot" data-i="${i}" data-drop="${Math.round(it.was - it.price)}"><div class="d3-rf rv">
  <div class="main"><div class="ph"><img src="${it.src || IMG(it.img)}" alt="" draggable="false"></div><i class="tint"></i>${RT(it.rating)}
    <button class="d3-wish" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button></div>
  <div class="info"><p class="nm">${it.name}</p><div class="pr"><b><i>${D}</i> ${money(it.price)}</b><span class="wp"><s>${money(it.was)}</s><em>${pct(it)}%</em></span></div>${META()}${it.last ? `<p class="last">${it.last}</p>` : ''}${it.badge ? `<p class="last drop">${it.badge}</p>` : ''}</div>
  <button class="d3-add" type="button" aria-label="Add to cart">${PLUS}<span class="ok">${CHECK}</span></button>
</div></div>`;
const PCT = ['08887', '8b80f', 'a1be9'].map((f) => `<img src="${A(f + '.svg')}" alt="" draggable="false">`).join('');
const HEART_SM = '<svg class="hs" viewBox="41 1.7 10.5 9.5" aria-hidden="true"><path d="M47.0508 2.71063H45.5508L45.0508 1.71063H42.5508L41.0508 3.21063V6.71063L45.5508 11.2106H47.0508L51.5508 6.71063V3.21063L50.0508 1.71063H47.5508L47.0508 2.71063Z" fill="#A493FF"/></svg>';
const tickerUnit = `<span class="u"><b>Flash deals</b><span class="pc">${PCT}</span><b>Win discounts on ${HEART_SM} brands</b></span>`;
const cta = (label, cls) => `<button class="d3-abs d3-cta ${cls} rv" type="button"><span class="lb">${label}</span></button>`;
const two = (y, a, b, k) => `<h2 class="d3-abs d3-title" style="top:${y}px"><span class="ln rv" data-k="${k}a">${a}</span><span class="ln rv" data-k="${k}b">${b}</span></h2>`;

// the top chevrons, Figma "Group 1410130025" (1473:49856) layer by layer — the same paths, paints, 52 % and 2 px blur as
// its export (f/ce7ef.svg) — except the lines: Figma's 1 px INSIDE strokes are drawn as strokes clipped by their masks, and
// the export dropped the width (a 0.5 px line the blur all but erased); 2.7 matches Figma's rendered line brightness
// (measured against its frame render — the browser's blur spreads a thin line more) — split so each chevron can carry the quiet loop in yf-page.css (.cv-i / .cv-m / .cv-o)
const CHEVRONS = `<defs>
  <filter id="cvBlur" x="1.88921" y="96.7729" width="712.349" height="522.582" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2"/></filter>
  <linearGradient id="cvP0" x1="358.064" y1="472.569" x2="358.064" y2="780.875" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-color="#D2D2D2"/></linearGradient>
  <linearGradient id="cvP1" x1="358.064" y1="210.686" x2="358.064" y2="552.914" gradientUnits="userSpaceOnUse"><stop offset="0.6" stop-color="#3D3D3D"/><stop offset="1" stop-color="white"/></linearGradient>
  <linearGradient id="cvP2" x1="358.064" y1="222.13" x2="358.064" y2="494.075" gradientUnits="userSpaceOnUse"><stop offset="0.6" stop-color="#3D3D3D"/><stop offset="1" stop-color="#D2D2D2"/></linearGradient>
  <path id="cvS1" d="M353.166 212.414C356.088 210.299 360.039 210.299 362.962 212.414L587.498 374.987C592.103 378.321 592.103 385.182 587.498 388.516L362.962 551.088C360.039 553.204 356.088 553.204 353.166 551.088L128.629 388.516C124.024 385.182 124.024 378.321 128.629 374.987L353.166 212.414Z"/>
  <path id="cvS3" d="M353.166 224.232C356.088 222.116 360.039 222.116 362.961 224.232L538.461 351.299C543.066 354.633 543.066 361.494 538.461 364.828L362.961 491.896C360.039 494.012 356.088 494.012 353.166 491.896L177.667 364.828C173.062 361.494 173.062 354.633 177.667 351.299L353.166 224.232Z"/>
  <mask id="cvM0" fill="white"><path d="M353.166 102.36C356.088 100.244 360.039 100.244 362.962 102.36L706.785 351.299C711.39 354.633 711.39 361.494 706.785 364.828L362.962 613.768C360.039 615.884 356.089 615.884 353.166 613.768L9.34293 364.828C4.73797 361.494 4.73797 354.633 9.34293 351.299L353.166 102.36Z"/></mask>
  <mask id="cvM2" fill="white"><use href="#cvS1"/></mask>
  <mask id="cvM4" fill="white"><use href="#cvS3"/></mask>
</defs>
<g opacity="0.52" filter="url(#cvBlur)">
  <path d="M353.166 254.269C356.088 252.153 360.039 252.153 362.962 254.269L559.513 396.579C564.118 399.913 564.118 406.774 559.513 410.108L362.962 552.418C360.039 554.534 356.088 554.534 353.166 552.418L156.614 410.108C152.009 406.774 152.009 399.913 156.614 396.579L353.166 254.269Z" fill="black"/>
  <g class="cvr rv" data-r="2"><g class="cv cv-o"><path d="M9.34293 364.828L353.166 613.768C356.088 615.884 360.039 615.884 362.962 613.768L706.785 364.828C711.39 361.494 711.39 354.633 706.785 351.299L362.962 102.36C360.039 100.244 356.088 100.244 353.166 102.36L9.34294 351.299C4.73797 354.633 4.73796 361.494 9.34293 364.828Z" stroke="#8A8A8A" stroke-width="2.7" mask="url(#cvM0)"/></g></g>
  <g class="cvr rv" data-r="1"><g class="cv cv-m" opacity="0.7"><use href="#cvS1" fill="url(#cvP0)"/><path d="M128.629 388.516L353.166 551.088C356.088 553.204 360.039 553.204 362.962 551.088L587.498 388.516C592.103 385.182 592.103 378.321 587.498 374.987L362.962 212.414C360.039 210.299 356.088 210.299 353.166 212.414L128.629 374.987C124.024 378.321 124.024 385.182 128.629 388.516Z" stroke="url(#cvP1)" stroke-width="2.7" mask="url(#cvM2)"/></g></g>
  <g class="cvr rv" data-r="0"><g class="cv cv-i" opacity="0.7"><use href="#cvS3" fill="#161616"/><path d="M177.667 364.828L353.166 491.896C356.088 494.012 360.039 494.012 362.961 491.896L538.461 364.828C543.066 361.494 543.066 354.633 538.461 351.299L362.961 224.232C360.039 222.116 356.088 222.116 353.166 224.232L177.667 351.299C173.062 354.633 173.062 361.494 177.667 364.828Z" stroke="url(#cvP2)" stroke-width="2.7" mask="url(#cvM4)"/></g></g>
</g>`;
// ─── below "Shop all deals": the "For You" widgets, Figma For-You 352:7748 (its Frame 2147242854, 390:23398) ──────
// Blocks 40 apart, in normal flow (.d3-more, yf-page.css) instead of at absolute x / y (Figma's stacked "Top deals"
// was dropped as redundant): the sale strip, wishlist deals by category, three refill-style carousels (price drops · stock up · lowest prices),
// flash deals with a live countdown, and two 2 × 2 grids. Art: the Figma exports in f/w/. The carousels' hero card
// is Figma's; its neighbours are this page's own refill staples, so a swipe shows different products
const W = (f) => A(`w/${f}`);
const MORE = {
  // "deals, straight from your wishlist": what she carted or wishlisted and didn't buy, then what she only looked at
  tabs: [
    { label: ['Toys'], items: [
      { src: N('w0'), name: 'BAYBEE Wooden Pancake Pretend Play Kitchen Set with 20 Pcs Play Food', price: 59, was: 102.2, tag: 'In your cart' },
      { src: N('w1'), name: 'Jellycat Bartholomew Bear Bathrobe Outfit Plush, 22cm', price: 112, was: 157.87, rating: 4.5, tag: 'In your cart' },
      { src: N('w2'), name: 'PEAKY KIDS 130 pcs Magnetic Tiles Building Set', price: 109.99, was: 199, rating: 4.3, tag: 'In your cart' } ] },
    { label: ['Home'], items: [
      { src: N('w3'), name: 'WaterScience Hand Shower Filter for Chlorine & Hard Water', price: 144, was: 224.95, rating: 4.6, tag: 'In your cart' },
      { src: N('w4'), name: 'Siesta Zen Ultra Soft Oversized Comforter Queen 230x210cm', price: 125.84, was: 178.09, tag: 'In your cart' },
      { src: N('w5'), name: 'Arabest Queen Size Down Comforter Insert, Microfiber White', price: 115, was: 188, rating: 4.3 } ] },
    { label: ['Viewed'], items: [
      { src: N('w6'), name: 'ALO Yoga 30" Inseam Suit Up Trouser, Wide Leg, Navy', price: 105, was: 259, rating: 4.2, tag: 'You viewed' },
      { src: N('w7'), name: 'Ameya Yellow Embroidered Organza Kurta Set with Dupatta', price: 375, tag: 'You viewed' },
      { src: N('w8'), name: 'Ameya Purple Embroidered Kurta Trousers with Dupatta Set', price: 275, tag: 'You viewed' } ] },
    { label: ['Snacks'], items: [
      { src: N('w9'), name: 'Quest Protein Tortilla Chips, Chili Lime, Box of 8', price: 105.99, was: 113.99, rating: 5.0, tag: 'In your cart' },
      { src: N('w10'), name: 'Quest Protein Tortilla Chips, Spicy Sweet Chili, Box of 8', price: 113.99, rating: 5.0 },
      { src: N('w11'), name: 'Quest Protein Tortilla Chips, Ranch, Box of 8', price: 113.99, rating: 5.0 } ] },
  ],
  // "things she saved for herself": her carted / wishlisted skincare, at today's prices
  drops: [
    { src: N('p0'), name: 'Beauty of Joseon Relief Sun Rice + Probiotics SPF 50+ Sunscreen, 50ml', price: 34.4, was: 100, rating: 4.2 },
    { src: N('p1'), name: 'rhode Barrier Butter Intensive Moisture Balm, 100ml', price: 231.99, was: 280, rating: 4.9 },
    { src: N('p2'), name: 'CeraVe Moisturizing Cream for Dry to Very Dry Skin, 454g', price: 72, was: 128, rating: 4.4 },
    { src: N('p3'), name: 'Beauty of Joseon Relief Sun Aqua-Fresh Rice + B5 SPF 50+, 50ml', price: 29, was: 100, rating: 4.5 },
    { src: N('p4'), name: 'CeraVe Moisturising Cream, 50ml', price: 19.95, was: 34, rating: 4.4 },
  ],
  // "the household stock-up", from her own brands, with when she last bought each (most come round again before the sale)
  stock: [
    { src: N('s0'), name: 'Fine Facial Tissue Boxes, 2 Ply, 5 x 200 Sheets, White', price: 21.26, was: 34.27, rating: 4.4, last: 'Last bought 8 Oct' },
    { src: N('s1'), name: 'Fairy Plus Lemon Dishwashing Liquid, Pack of 3 x 600ml', price: 21.45, was: 33.6, rating: 4.5, last: 'Last bought 7 Oct' },
    { src: N('s2'), name: 'Tide Fast Action Laundry Detergent Powder', price: 40, was: 76.27, rating: 4.7, last: 'Last bought 7 Oct' },
    { src: N('s3'), name: 'Earth Green Choice Garbage Bags, Twin Pack, 50 Gallons, 40 Bags', price: 19, was: 47, rating: 5.0, last: 'Last bought 28 Aug' },
    { src: N('s4'), name: 'Nescafe Classic Coffee Jar, 190g', price: 19.95, was: 36.19, rating: 4.5, last: 'Last bought 28 Aug' },
  ],
  // "toys she has already shortlisted", then more for the same stage: building and pretend play
  lowest: [
    { src: N('l0'), name: 'LEGO DUPLO Deluxe Brick Box 10914, 85 Pieces', price: 111, was: 199, rating: 4.8 },
    { src: N('l1'), name: 'LEGO DUPLO Bluey Ice Cream Trip 10458, 22 Pieces', price: 81, was: 129, rating: 4.7 },
    { src: N('l2'), name: 'Learning Resources New Sprouts Cure It! Doctor Kit, 6 Pieces', price: 126.11, was: 149, rating: 4.3 },
    { src: N('l3'), name: 'Sanirell 10 in 1 Montessori Busy Book', price: 38.64, was: 69.99, rating: 5.0 },
    { src: N('l4'), name: 'unikbebe 50 PCS Soft Silicone Stacking Blocks with Wheels', price: 56.99, was: 158, rating: 5.0 },
  ].map((it) => ({ ...it, badge: `You save ${D}${Math.round(it.was - it.price)}` })),
  // "making the home toddler-proof": the gates she viewed on 5 Oct, plus corner guards and cabinet locks
  flash: [
    { src: N('f0'), name: 'BAYBEE 75 cm Auto Close Safety Baby Gate, Extra Tall, White', price: 129, was: 249, rating: 4.0, locked: true },
    { src: N('f1'), name: 'RADIANCES 6.5 ft Baby Proofing Edge & Corner Guards, White', price: 24.99, was: 99.99, rating: 3.7 },
    { src: N('f2'), name: 'Gonice Child Safety Strap Locks for Cabinets & Drawers, 10 Pack', price: 27.92, was: 59, rating: 4.1 },
  ],
  // "the festive home season": candles, lights and refills (she already owns a tree and ornaments)
  festive: [
    { src: N('g0'), name: 'Bath & Body Works Dark Velvet 3-Wick Jar Candle, 411g', price: 75, was: 129, rating: 4.8, tag: 'Festive home' },
    { src: N('g1'), name: 'Dunekart Snowflake Christmas Lights, 80 LED, 10M, Warm White', price: 22.9, was: 36.9, rating: 5.0, tag: 'Festive home' },
    { src: N('g2'), name: 'Angju Flameless LED Candles with Remote & Timer, 4 Pcs', price: 57.99, was: 175.99, rating: 5.0, tag: 'Festive home' },
    { src: N('g3'), name: 'LONGFINE Shangri-la Reed Diffuser Refill, 260ml', price: 42, was: 69, rating: 3.0, tag: 'Festive home' },
  ],
  // "her weekly basket": the repeats noon.com carries (her fresh eggs, milk, avocado and berries are on Minutes)
  weekly: [
    { src: N('k0'), name: 'Kewpie Roasted Sesame Dressing, 210ml', price: 10.36, was: 24.31, rating: 5.0, tag: 'Every 2 weeks' },
    { src: N('k1'), name: 'India Mills Fresh n Cottage Malai Paneer Cubes, 825g', price: 14.68, was: 26.6, rating: 3.4, tag: 'Every week' },
    { src: N('k2'), name: 'MTR Dosa Mix, 200g', price: 2.7, was: 5.67, rating: 2.0, tag: 'Every 3 weeks' },
    { src: N('k3'), name: 'Gerber Organic NutriPuffs Raspberry & Banana, 35g', price: 16.2, was: 27.27, rating: 4.3, tag: 'Toddler snack' },
  ],
};
const HEART_ON = '<svg class="on" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 7.05C4 5.4 5.3 4.2 6.8 4.2c.5 0 1 .2 1.2.5.2-.3.7-.5 1.2-.5 1.5 0 2.8 1.2 2.8 2.85 0 2-2.3 3.6-4 4.95-1.7-1.35-4-2.95-4-4.95z" fill="#f43f5e"/></svg>';
const heartBtn = (src) => `<button class="w-heart" type="button" aria-label="Add to wishlist" aria-pressed="false"><img src="${W(src)}" alt="" draggable="false">${HEART_ON}</button>`;
const addBtn = (cls, src) => `<button class="d3-add ${cls}" type="button" aria-label="Add to cart"><img class="pl" src="${W(src)}" alt="" draggable="false"><span class="ok">${CHECK}</span></button>`;
const head = (a, b, l0, l1) => `<div class="w-head">
  <span class="w-leaf l0 rv" data-scroll style="left:${l0[0]}px;top:${l0[1]}px"><img src="${W('leaf-l.svg')}" alt="" draggable="false"></span>
  <span class="w-leaf l1 rv" data-scroll style="left:${l1[0]}px;top:${l1[1]}px"><img src="${W('leaf-r.svg')}" alt="" draggable="false"></span>
  <h2 class="d3-title"><span class="ln rv" data-scroll>${a}</span><span class="ln rv" data-scroll>${b}</span></h2></div>`;
const foot = (label) => `<div class="w-foot"><img class="w-arc" src="${W('arc.svg')}" alt="" draggable="false">${cta(label, 'more').replace('rv"', 'rv" data-scroll')}</div>`;
const tickU = (pcs) => `<span class="u"><b>Yellow Friday sale</b><span class="pc">${pcs}</span><b>Crazy deals every day</b><span class="pc">${pcs}</span></span>`;
const tick = (cls, files) => { const pcs = files.map((f) => `<img src="${W(f)}" alt="" draggable="false">`).join(''); return `<div class="w-tick ${cls}" aria-label="Yellow Friday sale, crazy deals every day"><div class="run">${tickU(pcs).repeat(4)}</div></div>`; };
const lightTick = () => tick('lt', ['pc0.svg', 'pc1-l.svg', 'pc2-l.svg']);
// wishlist deals: a category tab bar over a sideways row of small cards
const skuCard = (it) => `<div class="w-card w-sku"><div class="media"><div class="ph"><img src="${it.src}" alt="" draggable="false"></div>
    ${heartBtn('heart.svg')}${addBtn('w-add-sku', 'plus-blue.svg')}${it.tag ? `<span class="tag">${it.tag}</span>` : ''}${RT(it.rating)}</div>
  <div class="bd"><p class="nm">${it.name}</p><div class="pr"><b>${D}${money(it.price)}</b>${it.was ? `<s>${money(it.was)}</s><em>${pct(it)}%</em>` : ''}</div>${META()}</div></div>`;
const tabs = () => `<div class="w-tabs" role="tablist">${MORE.tabs.map((t, i) => `<button class="w-tab${i ? '' : ' is-on'}" type="button" role="tab" aria-selected="${!i}" data-t="${i}">
  <span>${t.label.join('<br>')}</span><i class="bar"></i></button>`).join('')}</div>`;
const skuRow = (list) => list.map(skuCard).join('');
// flash deals: the countdown between the energy cubes, then a sideways row of locked / upcoming deals
const CUBE = [['s', 0, 44, 1.46, 4.64, 45.79], ['m', 11, 28, 13.42, 18.72, 30.99], ['l', 33, 0, 37, 45.74, 4.94]];
const cubes = (side) => `<div class="w-cubes ${side} rv" data-scroll aria-hidden="true">${CUBE.map(([k, x, y, fx, bx, by]) => `<i class="c ${k}">
  <img class="o" src="${W(`cube-${k}.svg`)}" alt="" style="left:${x}px;top:${y}px" draggable="false"><i class="f" style="left:${fx}px;top:${y}px"></i><span class="b" style="left:${bx}px;top:${by}px"><img src="${W(`bolt-${k}.svg`)}" alt="" draggable="false"></span></i>`).join('')}</div>`;
const flashCard = (it) => `<div class="w-card w-flash"><div class="media"><div class="ph"><img src="${it.src}" alt="" draggable="false">${it.locked ? `<img class="lock" src="${W('lock.svg')}" alt="Locked deal" draggable="false">` : ''}</div>${heartBtn('heart.svg')}${RT(it.rating)}</div>
  <div class="bd"><p class="nm">${it.name}</p><div class="pr"><b>${D} ${money(it.price)}</b><s>${money(it.was)}</s><em>${pct(it)}%</em></div>${META()}</div>
  <button class="w-remind" type="button" aria-pressed="false"><img src="${W('bell.svg')}" alt="" draggable="false"><span class="ok">${CHECK}</span><b>Remind me</b></button></div>`;
const flash = () => `<section class="w-sec w-flashs"><div class="w-fhead"><h2 class="d3-title"><span class="ln rv" data-scroll>Flash deals</span></h2>
  <div class="w-clock rv" data-scroll role="timer" aria-label="Ends in"><span><b data-u="h">03</b><em>HRS</em></span><span><b data-u="m">14</b><em>MIN</em></span><span><b data-u="s">19</b><em>SEC</em></span></div>
  ${cubes('l')}${cubes('r')}</div>
  <div class="w-row w-frow rv" data-scroll data-no-drag>${MORE.flash.map(flashCard).join('')}</div></section>`;
// the 2 × 2 grids: white product cards with a gradient tag
const gridCard = (it) => `<div class="w-card w-grid"><div class="media"><div class="ph"><img src="${it.src}" alt="" draggable="false"></div>
    <span class="tag">${it.tag}</span>${heartBtn('heart.svg')}${addBtn('w-add-grid', 'plus.svg')}${RT(it.rating)}</div>
  <div class="bd"><p class="nm">${it.name}</p><div class="pr"><b>${D}${money(it.price)}</b><s>${D}${money(it.was)}</s></div>${META()}</div></div>`;
const grid = (a, b, l0, l1, list, label) => `<section class="w-sec w-grids">${head(a, b, l0, l1)}
  <div class="w-g rv" data-scroll>${list.map(gridCard).join('')}</div>${foot(label)}</section>`;
const carousel = (list, extra = '') => `<div class="d3-refill w-flow" data-no-drag data-scroll aria-roledescription="carousel"${extra}>${list.map(refillCard).join('')}</div>`;
const MORE_HTML = `<div class="d3-abs d3-more">
  ${lightTick()}
  <section class="w-sec w-wish">${head('Your saves,', 'now on sale', [102, -1.74], [276, 47.58])}
    <div class="w-cat rv" data-scroll>${tabs()}<div class="w-row w-srow" data-no-drag>${skuRow(MORE.tabs[0].items)}</div></div>${foot('See all saves')}</section>
  ${lightTick()}
  <section class="w-sec w-drops">${head('Price drops', 'on your favourites', [87.43, -1.74], [306.65, 47.58])}
    <div class="w-lcd rv" data-scroll><b>DROP BY DHM <strong>${Math.round(MORE.drops[0].was - MORE.drops[0].price)}</strong></b><i class="scan"></i></div>
    ${carousel(MORE.drops, ' data-lcd')}${foot('See price drops')}</section>
  ${tick('dk', ['pc0.svg', 'pc1.svg', 'pc2.svg'])}
  ${flash()}
  <section class="w-sec w-stock">${head('Stock up for', 'Yellow Friday', [96, 0.03], [282, 49.36])}${carousel(MORE.stock)}${foot('Shop household')}</section>
  ${grid('Get your home', 'festive-ready', [80, -4.74], [298, 42.58], MORE.festive, 'Shop festive')}
  <section class="w-sec w-stock w-low">${head('Lowest prices', 'on playtime', [86, -0.97], [276, 49.36])}${carousel(MORE.lowest)}${foot('Shop toys')}</section>
  ${grid('Your weekly', 'basket', [100, -2.97], [262, 44.36], MORE.weekly, 'See your basket')}
</div>`;
const scroller = document.createElement('div');
scroller.className = 'yf-scroll d3-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="d3">
  <svg class="d3-abs d3-bg rv" data-k="bg" viewBox="0 0 716.128 716.128" fill="none" aria-hidden="true" data-node-id="1473:49856">${CHEVRONS}</svg>
  <span class="d3-abs d3-leaf l0 rv" data-k="leafL"><img src="${A('cc1fe.svg')}" alt="" draggable="false"></span>
  <span class="d3-abs d3-leaf l1 rv" data-k="leafR"><img src="${A('c576a.svg')}" alt="" draggable="false"></span>
  ${two(117.26, 'Hey Neha', 'Here are your coupons!', 't')}
  <div class="d3-abs d3-coupons" data-no-drag aria-roledescription="carousel">${[...DATA.coupons, ...DATA.coupons].map(coupon).join('')}</div>
  ${cta('Redeem now', 'redeem').replace('rv"', 'rv" data-k="cta"')}
  <img class="d3-abs d3-shape rv" data-k="shape" src="${A('94761.svg')}" alt="" draggable="false">
  ${CUBES('l')}${CUBES('r')}
  ${two(640.11, 'Still deciding?', 'Your big buys, on sale', 'p')}
  <div class="d3-abs d3-deck" data-no-drag aria-roledescription="carousel">${DATA.deck.map(deckCard).join('')}</div>
  <div class="d3-abs d3-ticker rv" data-scroll aria-label="Flash deals, win discounts on brands"><div class="run">${tickerUnit.repeat(4)}</div></div>
  ${two(1365.24, 'Time to restock', 'for your little one', 'q').replace(/rv" data-k="q(a|b)"/g, 'rv" data-scroll')}
  <div class="d3-abs d3-refill" data-no-drag data-scroll aria-roledescription="carousel">${DATA.refill.map(refillCard).join('')}</div>
  <img class="d3-abs d3-arc rv" data-scroll src="${A('e5712.svg')}" alt="" draggable="false">
  ${cta('See all basics', 'all').replace('rv"', 'rv" data-scroll')}
</div>`;   // (iteration 5: only the first three widgets — coupons, big buys, restock; MORE_HTML's widgets are left out)
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
// iteration 4: the bot rests big at the top centre (main.js VIEW.page), so everything but the top chevrons moves
// down by DY to sit under it
const DY = 84;
// …and the deck's card is drawn smaller than Figma's (yf-page.css: 396 tall, not 498), so everything below the deck
// (the strip, the refill picks, "Shop all deals", the widgets) moves up by the LIFT it saves
const LIFT = 100;
// (the refill card above "Shop all deals" is GROW taller for its express · rating row, so what's under it moves down)
const GROW = 24;
[...page.children].forEach((el) => {
  if (el.classList.contains('d3-bg')) return;
  const y = parseFloat(getComputedStyle(el).top);
  el.style.top = `${y + DY - (y > 1290 ? LIFT : 0) + (y > 1850 ? GROW : 0)}px`;
});
// the page ends under the last widget: the third one's "See all basics" button, 48 px of room below it
const moreEl = page.querySelector('.d3-more');   // (absent in iteration 5)
const lastEl = page.querySelector('.d3-cta.all');
const fit = () => { page.style.height = `${Math.ceil(lastEl.offsetTop + lastEl.offsetHeight + 48)}px`; };
fit();
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
// how each beat plays (its beat delay is used when the reveal runs on the clock; with the bot rising it's a beat's offset
// within its group — title lines, coupon fan — and the group starts when the bot has risen clear of it)
function playBeat(el, delay) {
  const k = el.dataset.k, b = BEATS[k];
  if (k === 'bg') {
    // the top chevrons: each line comes in on its own after a short beat — the inner one behind the bot first, then
    // outwards, 180 ms apart — easing down 10 px into place as it fades up (wrappers .cvr, so the loop on .cv keeps running)
    cancelOwn(el); el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' });
    [...el.querySelectorAll('.cvr')].sort((a, c) => a.dataset.r - c.dataset.r).forEach((g, i) =>
      playIn(g, 'translateY(-10px)', delay + (reduce.matches ? 0 : 260 + i * 180), { ms: 1300, fadeMs: 900 }));
  }
  else if (k === 'arrows') [...el.children].forEach((c, i) => playIn(c, b[1], delay + i * 70));   // small cube to big
  else playIn(el, b[1], delay);
  if (k === 'deck') deck.fan(delay + 480);   // (once the front card is mostly in, so the ones behind never show through it)
}
// the groups that rise together, with the offsets inside them (ms)
const GROUP = { ta: ['title', 0], tb: ['title', 60], leafL: ['title', 160], leafR: ['title', 210], cp1: ['coupons', 0], cp0: ['coupons', 170], cp2: ['coupons', 170],
  cta: ['cta', 0], shape: ['shape', 0], pa: ['picks', 0], pb: ['picks', 60], arrows: ['picks', 90], deck: ['deck', 0], bg: ['bg', 0] };
function reveal({ withBot = false } = {}) {
  live = true;
  coupons.roles(); deck.roles();
  const items = $$('[data-k]').filter((el) => BEATS[el.dataset.k]);
  if (!withBot || reduce.matches) items.forEach((el) => playBeat(el, BEATS[el.dataset.k][0]));
  else revealWithBot(items);
  setTimeout(() => H('tick'), 320);
  // a backstop: anything at the top that's on screen but still hidden 1.6 s in (its group's beat never fired) plays in now
  setTimeout(() => {
    if (!live) return;
    const vb = scroller.getBoundingClientRect();
    items.forEach((el) => {
      if (getComputedStyle(el).opacity !== '0' || el.getAnimations().some((x) => !(x instanceof CSSAnimation))) return;
      const r = el.getBoundingClientRect(); if (r.bottom > vb.top && r.top < vb.bottom) playIn(el, 'translateY(14px)', 0);
    });
  }, reduce.matches ? 0 : 1600);
  io && io.disconnect();
  // each block below plays in as it scrolls into view — and resets once it has gone back below the screen (scrolling
  // up), so scrolling down again plays it in again
  const shown = new Set();
  io = new IntersectionObserver((ents) => {
    let k = 0;
    ents.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) {
        if (shown.has(el)) return; shown.add(el);
        if (el.classList.contains('d3-refill')) { refills.get(el).reveal((k++) * 80); return; }
        playIn(el, el.classList.contains('d3-cta') ? 'translateY(16px) scale(.97)' : 'translateY(24px)', (k++) * 80);
      } else if (shown.has(el) && belowView(e)) {
        shown.delete(el);
        if (el.classList.contains('d3-refill')) refills.get(el).hide(); else cancelOwn(el);
      }
    });
  }, { root: scroller, threshold: 0.1, rootMargin: '0px 0px -6% 0px' });   // (a touch inside the edge, so the glide is seen)
  $$('[data-scroll]').forEach((el) => io.observe(el));
}
// gone back out through the bottom of the screen (the user scrolled back up past it)
const belowView = (e) => e.rootBounds && e.boundingClientRect.bottom > e.rootBounds.bottom;   // (left through the bottom edge, not the top — tall blocks stop counting as visible while their top is still on screen)
function revealWithBot(items) {
  const sr = sheet.getBoundingClientRect(), VH = scroller.clientHeight || 812;
  const topOf = { title: $('.d3-title'), coupons: $('.d3-coupons'), cta: $('.d3-cta.redeem'), shape: $('.d3-shape'), picks: $$('.d3-title')[1], deck: $('.d3-deck .d3-dk.is-top') || $('.d3-deck .d3-dk') };
  const anchorOf = { deck: $('.d3-deck') };
  const groups = {};
  items.forEach((el) => {
    const [g, off] = GROUP[el.dataset.k] || ['bg', 0];
    if (!groups[g]) {
      const r = g === 'bg' ? null : topOf[g].getBoundingClientRect();
      groups[g] = { name: g, y: r ? r.top - sr.top : -1e9, h: r ? r.height : 0, anchor: anchorOf[g] || topOf[g], els: [] };
    }
    groups[g].els.push([el, off]);
  });
  const play = (g) => g.els.forEach(([el, off]) => playBeat(el, off));
  // what's (mostly) below the screen waits for the scroll: it plays in as it comes into view, like the rest of the page
  const below = [], seq = [];
  Object.values(groups).forEach((g) => {
    if (g.name === 'bg') { play(g); return; }
    const seen = Math.min(VH, g.y + g.h) - Math.max(0, g.y);
    (seen < Math.min(60, g.h * 0.5) ? below : seq).push(g);   // (less than half of it, or 60 px, showing)
  });
  if (below.length) {
    const shownLazy = new Set();
    const lazy = new IntersectionObserver((ents) => ents.forEach((e) => {
      const g = below.find((x) => x.anchor === e.target); if (!g) return;
      if (e.isIntersecting && !shownLazy.has(g)) {
        shownLazy.add(g);
        if (g.name === 'deck') { deck.roles(); playBeat($('.d3-dk.is-top .in'), 0); } else play(g);   // (the deck: whichever card is in front now)
      } else if (!e.isIntersecting && shownLazy.has(g) && belowView(e)) {
        shownLazy.delete(g);                                                    // back below the screen: hidden again, ready to replay
        if (g.name === 'deck') deck.hide(); else g.els.forEach(([el]) => cancelOwn(el));
      }
    }), { root: scroller, threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    below.forEach((g) => lazy.observe(g.anchor));
  }
  // what's on screen plays in top to bottom, 70 ms apart — each block no sooner than the bot has risen clear of it
  seq.sort((a, b) => a.y - b.y);
  const t0 = performance.now(), HALF = 1.2, CLEAR = 10, GAP = 70;      // the bot's half height (units, with BOT_SCALE) + a margin (px)
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
  live = false; io && io.disconnect(); dock.reset();
  page.querySelectorAll('.rv').forEach(cancelOwn);
  scroller.scrollTop = 0; onScroll();
  coupons.jump(0); deck.reset(); refills.forEach((r) => r.jump(0));
  page.querySelectorAll('.d3-cp.is-collected').forEach((c) => c.classList.remove('is-collected'));
  more.reset();
  page.querySelectorAll('.d3-add.is-on, .d3-wish.is-on, .w-heart.is-on, .w-remind.is-on').forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
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
  const el = e.target.closest('.d3-cp, .d3-dk, .d3-rf, .d3-cta, .d3-cubes, .w-card, .w-tab'); if (!el || !window.orbi) return;
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
  dock.update(top);
}
scroller.addEventListener('scroll', onScroll, { passive: true });
// iteration 4: the bot rests big at the top centre while you're at the top of the page; once you start scrolling it
// glides up into the top-right corner at its small size (iteration 1–3's spot), and comes back to the centre when
// you scroll back to the top (hysteresis: out past 40 px, back under 12 px)
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
  let order = cards.map((_, i) => i), raf = 0, drag = null, fanned = 0;   // (how many cards behind the front one are out)
  const st = cards.map(() => ({ ...SLOT[0], v: { x: 0, y: 0, r: 0, s: 0, b: 0, o: 0 }, t: { ...SLOT[0] }, fly: 0 }));
  const paint = () => cards.forEach((c, i) => {
    const s = st[i];
    c.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(3)}deg) scale(${s.s.toFixed(4)})`;
    const b = Math.round(s.b * 10) / 10; c.style.filter = b > 0.05 ? `blur(${b}px)` : '';
    c.style.opacity = s.o.toFixed(3);
  });
  const layer = () => order.forEach((ci, k) => { cards[ci].style.zIndex = String(st[ci].fly ? 40 : 30 - k); cards[ci].classList.toggle('is-top', k === 0); });
  const aim = () => order.forEach((ci, k) => { if (!st[ci].fly) st[ci].t = { ...slot(k <= fanned ? k : 0) }; if (k > fanned) st[ci].t.o = 0; });
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
    if (on) flyToBot(b.closest('.d3-dk, .d3-rf, .w-card').querySelector('.ph'));
  });
  const cubesL = $('.d3-cubes.l'), cubesR = $('.d3-cubes.r');
  cubesL.addEventListener('click', () => throwTop(-1)); cubesR.addEventListener('click', () => throwTop(1));
  return {
    reset() { order = cards.map((_, i) => i); fanned = 0; st.forEach((s) => { s.fly = 0; Object.assign(s, SLOT[0]); KEYS.forEach((p) => { s.v[p] = 0; }); }); aim(); order.forEach((ci, k) => { if (k) st[ci].o = 0; }); layer(); paint(); },
    // scrolled back away below the screen: the cards behind tuck back under the front one (instantly, it's off screen)
    // and the front one goes back to hidden, so the next scroll down plays the whole entrance again
    hide() {
      fanned = 0;
      order.forEach((ci, k) => { const st0 = st[ci]; if (k && !st0.fly) { Object.assign(st0, { ...slot(0), o: 0 }); KEYS.forEach((p) => { st0.v[p] = 0; }); } });
      aim(); paint();
      cards.forEach((c) => cancelOwn(c.firstElementChild));
    },
    // the reveal: the front card lands first; then the cards behind it come out from under it one at a time
    fan(delay) {
      const d = reduce.matches ? 0 : delay, step = reduce.matches ? 0 : 140;
      [1, 2, Infinity].forEach((n, i) => setTimeout(() => { if (!live) return; fanned = Math.max(fanned, n); aim(); run(); }, d + i * step));
    },
    roles() { cards.forEach((c, i) => { const el = c.firstElementChild; el.dataset.k = i === order[0] ? 'deck' : ''; if (i !== order[0]) { el.getAnimations().forEach((a) => a.cancel()); el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' }); } }); },
  };
})();

// the refill carousels — the one above "Shop all deals" and the three below it (Figma 1474:50538): a 236-wide main card with its neighbours either side at 80 %, 20 apart and
// 35.5 lower. Each card morphs as it moves (--k: 0 in the middle → 1 at the side, driven by yf-page.css): its photo
// box goes from 3 : 4 to the side cards' shorter one, the "Last purchased" line folds away and the + slides from
// the photo's corner (dark ink) down to the card's corner (white ink). A tap on a side card brings it forward
const makeRefill = (stage) => {
  const slots = [...stage.querySelectorAll('.d3-rslot')];
  // "Price drops": its LCD badge reads the drop of whichever card is in the middle
  const lcd = stage.hasAttribute('data-lcd') && stage.previousElementSibling.querySelector('strong');
  const onLand = lcd ? (at) => {
    lcd.textContent = slots[((at % slots.length) + slots.length) % slots.length].dataset.drop;
    const box = lcd.closest('.w-lcd'); box.classList.remove('is-swap'); void box.offsetWidth; box.classList.add('is-swap');   // (a burst of flicker on the new number)
  } : null;
  const PITCH = 232.4, SS = 0.8, DY = 35.5;
  const loop = loopCarousel({ stage, count: slots.length, step: PITCH, tapToFocus: true, onLand, place: (wrapD) => slots.forEach((el, i) => {
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
    hide() { slots.forEach((sl) => cancelOwn(sl.firstElementChild)); },   // (back to hidden, to play in again)
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
};
const refills = new Map($$('.d3-refill').map((st) => [st, makeRefill(st)]));
// the deck's wishlist heart: fills red with a pop, like the refill's
$('.d3-deck').addEventListener('click', (e) => {
  const b = e.target.closest('.d3-wish'); if (!b) return;
  const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', String(on));
  H(on ? 'success' : 'tap');
  if (on && !reduce.matches) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: 0.25 }, { transform: 'scale(1.18)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 460, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
  if (on) bot.hop(1.1);
});

// the widgets below "Shop all deals": hearts, category tabs, flash reminders, the countdown, the CTAs
const more = !moreEl ? { reset() {} } : (() => {
  const pop = (el) => { if (!reduce.matches) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: 0.25 }, { transform: 'scale(1.18)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 460, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }); };
  const row = moreEl.querySelector('.w-srow'), tabBtns = [...moreEl.querySelectorAll('.w-tab')];
  const pick = (t) => {
    tabBtns.forEach((b, i) => { const on = i === t; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', String(on)); });
    // each tab is its own shortlist, sliding in
    row.innerHTML = skuRow(MORE.tabs[t].items); row.scrollLeft = 0;
    if (!reduce.matches) [...row.children].forEach((c, i) => playIn(c, 'translateX(24px)', i * 50, { ms: 700, fadeMs: 360 }));
  };
  moreEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.w-tab');
    if (tab) { if (!tab.classList.contains('is-on')) { H('tick'); pick(+tab.dataset.t); } return; }
    const heart = e.target.closest('.w-heart');
    if (heart) { const on = heart.classList.toggle('is-on'); heart.setAttribute('aria-pressed', String(on)); H(on ? 'success' : 'tap'); if (on) { pop(heart); bot.hop(1.1); } return; }
    const rem = e.target.closest('.w-remind');
    if (rem) { const on = rem.classList.toggle('is-on'); rem.setAttribute('aria-pressed', String(on)); rem.querySelector('b').textContent = on ? 'Reminder set' : 'Remind me'; H(on ? 'success' : 'tap'); if (on) bot.hop(1.1); return; }
    if (e.target.closest('.d3-cta.more')) { H('tap'); bot.hop(1.2); }
  });
  // the flash countdown: 03 : 14 : 19 when the page opens, ticking down while it's on screen
  const START = 3 * 3600 + 14 * 60 + 19, u = Object.fromEntries([...moreEl.querySelectorAll('.w-clock b')].map((b) => [b.dataset.u, b]));
  let left = START, timer = 0;
  const show = () => { const p = (n) => String(n).padStart(2, '0'); u.h.textContent = p(Math.floor(left / 3600)); u.m.textContent = p(Math.floor(left / 60) % 60); u.s.textContent = p(left % 60); };
  new IntersectionObserver(([e]) => {
    clearInterval(timer); timer = 0;
    if (e.isIntersecting) timer = setInterval(() => { left = left > 0 ? left - 1 : START; show(); }, 1000);
  }, { root: scroller }).observe(moreEl.querySelector('.w-clock'));
  return {
    reset() {
      left = START; show();
      if (!tabBtns[0].classList.contains('is-on')) pick(0);
      moreEl.querySelectorAll('.w-remind.is-on b').forEach((b) => { b.textContent = 'Remind me'; });
      moreEl.querySelectorAll('.w-row').forEach((r) => { r.scrollLeft = 0; });
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
  curFx.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.06)' }], { duration: 220, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'both' })   // (gone before the bot is clear of them)
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
  else if (e.detail === 'closing') { if (curating) { curateCancel(); window.orbi.setState('idle'); } }
  else if (e.detail === 'closed') { curateCancel(); reset(); }
});
// photos fetched up front, so nothing pops in mid-reveal
[...DATA.deck, ...DATA.refill].forEach((it) => { const im = new Image(); im.src = it.src || IMG(it.img); });
coupons.jump(0); deck.reset(); refills.forEach((r) => r.jump(0));
// the dark page wants light status-bar content (applied only while the page is up)
(function ink() { if (window.orbi) window.orbi.statusInk(document.documentElement.classList.contains('is-light') ? 0 : 1); else requestAnimationFrame(ink); })();
// the light theme: the switcher's sun / moon under 4 turns the bot's page light (yf-page.css .is-light), remembered
// per viewer (a convenience only, so a blocked localStorage just starts dark)
(() => {
  const btn = document.getElementById('vtheme'); if (!btn) return;
  const set = (on) => {
    document.documentElement.classList.toggle('is-light', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.dataset.tip = on ? 'Dark theme' : 'Light theme';
    btn.setAttribute('aria-label', on ? 'Dark theme for the bot page' : 'Light theme for the bot page');
    if (window.orbi) window.orbi.statusInk(on ? 0 : 1);   // (dark status-bar content over the light page)
    try { localStorage.setItem('yf-theme', on ? 'light' : 'dark'); } catch {}
  };
  let saved = false; try { saved = localStorage.getItem('yf-theme') === 'light'; } catch {}
  set(saved);
  btn.addEventListener('click', () => { H('tap'); set(!document.documentElement.classList.contains('is-light')); });
})();
window.yfPage = { reveal, reset, scroller, deck, coupons };
