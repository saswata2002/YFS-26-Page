/* ══ Iteration 2 — the bot's page as a playground ════════════════════════════════════════════════════════════
   Same arrival as iteration 1 (the circle out of the bot, "Curating for you", the bot to its corner), then a page
   made to be played with, built into #orbiSheet by this file (styles: v2/yf-page.css):
     · Hi Neha + the Yellow Friday lettering, over two crossing sale tapes that run faster as you scroll
     · a swipe deck of noon's top deals: drag the top card (it tilts and stamps WANT / PASS), fling it — a WANT flies
       up into the bot and lands in "Your picks"; pass / want / undo buttons; when it's empty it deals again
     · category bubbles that pour in and jostle (drag and fling them; tap to pick) and a grid that FLIP-shuffles to
       what you picked
     · three mystery boxes that bob and wiggle — tap one: the lid pops, a coupon rises, confetti, the bot cheers
     · the flash deals (countdown, Remind me sends the product to the bot) and the lowest price
   Kept from iteration 1: the curating beat, the black feathered mini header, pull-down-to-close, the bot's glances. */
const sheet = document.getElementById('orbiSheet');
const D = '';                                            // Noontree's dirham glyph
const H = (k) => { try { window.Haptics && window.Haptics[k] && window.Haptics[k](); } catch {} };
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// Apple-ish springs as CSS linear() (sampled damped spring; response r s, damping ζ)
function springEase(response, zeta, n = 48) {
  const w = (2 * Math.PI) / response, wd = w * Math.sqrt(Math.max(1e-6, 1 - zeta * zeta));
  const at = (t) => (zeta >= 1 ? 1 - (1 + w * t) * Math.exp(-w * t) : 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t)));
  let T = 0.05; while (T < 4 && Math.abs(1 - at(T)) > 0.001) T += 0.02;
  return { ms: Math.round(T * 1000), ease: `linear(${Array.from({ length: n + 1 }, (_, i) => (i === n ? 1 : at((i / n) * T)).toFixed(4)).join(', ')})` };
}
const SNAPPY = springEase(0.42, 0.96);                         // small UI (tabs, ticker, digits): quick, no visible bounce
// the reveal: a long, soft settle (expo-out) for the move, a quicker fade — content glides in rather than pops
const REVEAL = { ms: 1000, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', fadeMs: 620, fade: 'cubic-bezier(0.25, 0.1, 0.25, 1)' };
const SMOOTH = { ms: REVEAL.ms, ease: REVEAL.ease };
const FADE = 'cubic-bezier(0.33, 1, 0.68, 1)';

const BELL = '<svg viewBox="0 0 14 14" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.521 9.60368C11.521 9.95719 11.3806 10.2962 11.1306 10.5462C10.8807 10.7962 10.5416 10.9366 10.1881 10.9366L8.31269 10.9372C8.31269 11.2853 8.17441 11.6191 7.92827 11.8653C7.68213 12.1114 7.34829 12.2497 7.00019 12.2497C6.6521 12.2497 6.31826 12.1114 6.07212 11.8653C5.82597 11.6191 5.68769 11.2853 5.68769 10.9372L3.81228 10.9366C3.57112 10.9366 3.33449 10.8711 3.12759 10.7472C2.9207 10.6233 2.75129 10.4456 2.63743 10.233C2.52356 10.0204 2.4695 9.78095 2.48101 9.54007C2.49252 9.29918 2.56916 9.06593 2.70278 8.86517V8.86401C3.31821 7.94262 3.64647 6.85936 3.64603 5.75134V5.24967C3.64603 4.36009 3.99941 3.50695 4.62844 2.87792C5.25747 2.24889 6.11061 1.89551 7.00019 1.89551C7.88977 1.89551 8.74292 2.24889 9.37195 2.87792C10.001 3.50695 10.3544 4.36009 10.3544 5.24967V5.75076C10.3544 6.82409 10.6624 7.87409 11.2404 8.77709L11.2976 8.86459C11.4434 9.08276 11.521 9.34118 11.521 9.60368ZM7.00019 2.77051C6.34268 2.77051 5.71209 3.03171 5.24716 3.49664C4.78222 3.96157 4.52103 4.59216 4.52103 5.24967V5.75076C4.52103 7.03118 4.14186 8.28417 3.43078 9.34992C3.38485 9.41892 3.35851 9.49909 3.35456 9.58188C3.35061 9.66467 3.36921 9.74697 3.40837 9.82002C3.44753 9.89307 3.50578 9.95412 3.57692 9.99667C3.64805 10.0392 3.72939 10.0617 3.81228 10.0616H10.1881C10.2709 10.0615 10.3522 10.039 10.4233 9.99644C10.4943 9.95386 10.5525 9.8928 10.5916 9.81977C10.6307 9.74674 10.6492 9.66447 10.6452 9.58173C10.6413 9.49899 10.6149 9.41888 10.569 9.34992C9.85775 8.28442 9.47853 7.03186 9.47936 5.75076V5.24967C9.47936 4.59216 9.21816 3.96157 8.75323 3.49664C8.2883 3.03171 7.65771 2.77051 7.00019 2.77051Z" fill="white"/></svg>';

// ─── data: live from noon.com/uae-en (2026-11-07) — the homepage's own modules: 11.11 flash sale, mega deals, lowest
// prices, the appliance / home / beauty coupon carousels. Product photos are noon's (yf/noon/, trimmed to the product).
const money = (v) => (Math.round(v * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const off = (it) => Math.round((1 - it.price / it.was) * 100);
const DATA = {
  hero: [   // the 3D carousel (starts on index 1): tagline, bold name
    { img: 'hero0', tag: 'Hear every detail with', name: 'Galaxy Buds4 Pro', price: 519, was: 560 },
    { img: 'hero1', tag: 'Run lighter in the', name: 'Nike Run Defy', price: 165, was: 329 },
    { img: 'hero2', tag: 'Meet Galaxy AI on the', name: 'Samsung Galaxy S25', price: 1899, was: 3199 },
    { img: 'hero3', tag: 'Style it your way with', name: 'Dyson Airwrap i.d.', price: 1529, was: 2299 },
    { img: 'hero4', tag: 'Cinema at home with', name: 'Samsung OLED S90F', price: 4609, was: 9499 },
  ],
  coupons: [   // left, centre (hero), right
    { img: 'cp0', l1: '10% off on', l2: 'Appliances' },
    { img: 'cp1', l1: '10% off up to', l2: `${D}50`, cover: true },
    { img: 'cp2', l1: 'Buy 2, get', l2: '15% off' },
  ],
  wish: [
    { img: 'wish0', name: 'Beauty of Joseon Relief Sun SPF 50+', price: 34.4, was: 100 },
    { img: 'wish1', name: 'Anua Niacinamide 10% + TXA 4% Serum', price: 48.9, was: 108.27 },
    { img: 'wish2', name: 'ISDIN Fusion Water Magic SPF 50+', price: 69.99, was: 185 },
  ],
  restock: [   // by tab: Home, Beauty, Laptops, Mobiles
    [{ img: 'home0', name: 'Danube Home Urbane King Comforter Set', price: 79, was: 199, cover: true },
     { img: 'home1', name: 'T G H Striped Flannel Fleece Blanket', price: 44.99, was: 80 },
     { img: 'home2', name: 'Pan Home Grimsby 6-Door Wardrobe', price: 1399, was: 2199, cover: true }],
    [{ img: 'beauty0', name: 'Dyson Airwrap i.d. Multi-styler', price: 1529, was: 2299 },
     { img: 'beauty1', name: 'Arabiyat Oud Al Layl Gift Set', price: 34, was: 140 },
     { img: 'beauty2', name: 'Some by Mi Cica Peptide Scalp Tonic', price: 34.2, was: 95 }],
    [{ img: 'laptops0', name: 'Lenovo IdeaPad 5 2-in-1, Core i5, 1TB', price: 3099, was: 5099 },
     { img: 'laptops1', name: 'ASUS Vivobook S14, Core 5, 512GB', price: 3708, was: 3995 },
     { img: 'laptops2', name: 'SteelSeries Arctis Nova Pro Wired', price: 729, was: 1319 }],
    [{ img: 'mobiles0', name: 'Nothing Phone 3, 12GB, 256GB', price: 1899, was: 2999 },
     { img: 'mobiles1', name: 'Redmi Note 15 Pro+, 12GB, 512GB', price: 1449, was: 1799 },
     { img: 'mobiles2', name: 'realme 16 Pro 5G, 12GB, 256GB', price: 1199, was: 1999 }],
  ],
  flash: [
    { img: 'flash0', brand: 'PUMA', title: 'Softride Enzo 6 Running Shoes', price: 165, was: 369 },
    { img: 'flash1', brand: 'TOMMY HILFIGER', title: 'Logo Crew Neck T-Shirt', price: 89, was: 209, cover: true },
  ],
  mega: [
    { img: 'mega0', brand: 'Xiaomi', title: 'TV S Pro Mini LED 75"', price: 3379, was: 3999 },
    { img: 'mega1', brand: 'Samsung', title: 'Galaxy A36 5G, 8GB RAM, 256GB, Awesome Lavender', price: 998, was: 1399 },
    { img: 'mega2', brand: 'Adidas', title: 'Grand Court Base 2.0 Sneakers', price: 145, was: 329 },
    { img: 'mega3', brand: 'EZVIZ', title: 'C6N G1 3K Indoor Security Camera, 360° View', price: 99, was: 159 },
  ],
  low: { img: 'low0', title: 'JBL Go 4 Portable Waterproof Speaker, Big Pro Sound with Punchy Bass', price: 106.88 },
  sub: {
    wish: 'Price drops on beauty you saved', flash: '11.11 flash sale, while stocks last', restock: 'Back in stock, picked for you',
    mega: 'Top brands at their best prices', low: 'Lowest price in a year',
  },
};
const IMG = (k) => `../yf/noon/${k}.webp`;

const EXPRESS = '<img class="ex" src="../yf/express.svg" width="57" height="17" alt="express" draggable="false">';
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const X_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.3-9.4C1.6 7.6 3.7 4.4 7 4.4c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.3 0 5.4 3.2 4.3 6.5-1.7 4.8-9.3 9.4-9.3 9.4z" fill="currentColor"/></svg>';
const UNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4.5 11.5 9 16M5 11.5h9a5 5 0 010 10h-2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ─── what the page plays with ─────────────────────────────────────────────────────────────────────────────────
// the swipe deck: noon's top deals, each on its own pastel
const DECK = [
  { img: 'hero1', brand: 'Nike', name: 'Run Defy', price: 165, was: 329, bg: '#FFF1C9' },
  { img: 'hero2', brand: 'Samsung', name: 'Galaxy S25, 12GB, 128GB', price: 1899, was: 3199, bg: '#DDF5EA' },
  { img: 'hero3', brand: 'Dyson', name: 'Airwrap i.d. Multi-styler', price: 1529, was: 2299, bg: '#E7E4FF' },
  { img: 'hero0', brand: 'Samsung', name: 'Galaxy Buds4 Pro', price: 519, was: 560, bg: '#E3EEFF' },
  { img: 'mega2', brand: 'Adidas', name: 'Grand Court Base 2.0', price: 145, was: 329, bg: '#FFE1E1' },
  { img: 'hero4', brand: 'Samsung', name: '65" OLED S90F 4K', price: 4609, was: 9499, bg: '#ECECF2' },
  { img: 'wish0', brand: 'Beauty of Joseon', name: 'Relief Sun SPF 50+', price: 34.4, was: 100, bg: '#FFF4E0' },
  { img: 'mega0', brand: 'Xiaomi', name: 'TV S Pro Mini LED 75"', price: 3379, was: 3999, bg: '#E0F4FF' },
];
// every product, one shape (for the grid)
const ITEM = {};
DATA.hero.forEach((it) => { ITEM[it.img] = { img: it.img, name: it.name, price: it.price, was: it.was }; });
[...DATA.wish, ...DATA.restock.flat()].forEach((it) => { ITEM[it.img] = { img: it.img, name: it.name, price: it.price, was: it.was, cover: it.cover }; });
[...DATA.flash, ...DATA.mega].forEach((it) => { ITEM[it.img] = { img: it.img, name: `${it.brand} ${it.title}`, price: it.price, was: it.was, cover: it.cover }; });
ITEM.low0 = { img: 'low0', name: 'JBL Go 4 Portable Speaker', price: DATA.low.price, was: null };
// the bubbles: what you're into → what the grid shows
const CATS = [
  { k: 'home', h: '#FF9F43', t: 'Home', e: '🏠', r: 48, items: ['home0', 'home1', 'home2'] },
  { k: 'beauty', h: '#FF6FA5', t: 'Beauty', e: '💄', r: 46, items: ['wish0', 'wish1', 'wish2', 'beauty1', 'beauty2'] },
  { k: 'laptops', h: '#4FA3FF', t: 'Laptops', e: '💻', r: 44, items: ['laptops0', 'laptops1'] },
  { k: 'mobiles', h: '#36D399', t: 'Mobiles', e: '📱', r: 50, items: ['mobiles0', 'mobiles1', 'mobiles2', 'mega1'] },
  { k: 'fashion', h: '#A698FF', t: 'Fashion', e: '👟', r: 46, items: ['flash0', 'flash1', 'mega2'] },
  { k: 'tv', h: '#FF5A6E', t: 'TVs', e: '📺', r: 42, items: ['mega0', 'hero4'] },
  { k: 'audio', h: '#FEEE00', t: 'Audio', e: '🎧', r: 44, items: ['hero0', 'laptops2', 'low0'] },
  { k: 'gadgets', h: '#5EE7DF', t: 'Gadgets', e: '⌚', r: 42, items: ['mega3', 'hero3'] },
];
const TOP = ['hero2', 'mega2', 'wish1', 'laptops0', 'mobiles0', 'home1'];
// the mystery boxes: noon's three homepage coupons, each in its own wrapping
const BOXES = [
  { c1: '#FFF25A', c2: '#F2C200', rib: '#141414' },
  { c1: '#FF8DB8', c2: '#E2457F', rib: '#FFFFFF' },
  { c1: '#A698FF', c2: '#6B55F0', rib: '#FEEE00' },
];
const TAPE = '11.11 ✦ UP TO 70% OFF ✦ FREE DELIVERY ✦ YELLOW FRIDAY ✦ ';
// shop by budget: every deal, cheapest first
const BUDGET = Object.values(ITEM).filter((it) => it.price).sort((a, b) => a.price - b.price);
const STOPS = [100, 250, 500, 1000, 2000, 5000];                         // the slider's marked budgets (ticks as you pass them)
// spin & win: the wheel's six prizes (clockwise from the top)
const PRIZES = [
  { t: '10% off', s: 'on your next order', c: '#FEEE00', ink: '#121212' },
  { t: 'Free delivery', s: 'on any order', c: '#1E1E1E', ink: '#FFFFFF' },
  { t: `${D}20 back`, s: 'cashback in your wallet', c: '#FF8DB8', ink: '#121212' },
  { t: '5% off', s: 'on electronics', c: '#FFFFFF', ink: '#121212' },
  { t: '15% off', s: 'on beauty', c: '#A698FF', ink: '#121212' },
  { t: 'Free gift', s: 'with orders over 199', c: '#2A2A2A', ink: '#FEEE00' },
];
// scratch & reveal: the hidden deal
const SCRATCH = { img: 'wish1', l1: 'Extra 20% off', l2: 'Beauty & skincare', code: 'GLOW20' };

// ─── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
// every section opens the same way: a little eyebrow label, the Modak title, a line under it — and a soft wash of the
// section's own colour behind it, so the long black page gets depth and each part its own feel
const SECTION = {
  'What are you into?': ['Pick your vibe', '#8D7BFF'], 'Deals by day': ['Coming up', '#4FA3FF'], 'Shop by budget': ['Smart shopping', '#36D399'],
  'Bundle & save': ['Save more', '#FF9F43'], 'Scan my style': ['Just for you', '#FF6FA5'], 'Spin & win': ['Play', '#FEEE00'],
  'Your rewards': ['Wallet', '#FFB400'], 'Mystery boxes': ['Surprise', '#FF6FA5'], 'Scratch & reveal': ['Play', '#E2457F'],
  'Trending near you': ['Live', '#FF5A6E'], 'Flash deals': ['Ending soon', '#FF7A3D'], 'Golden deal': ['Best price', '#FFC93C'], 'Rate the sale': ['Feedback', '#FEEE00'],
};
const title = (h2, sub) => { const [eb, tint] = SECTION[h2] || ['', '#FEEE00']; return `<div class="p-title" data-stagger style="--tint:${tint}"><span class="eb${eb === 'Live' ? ' live' : ''}"><i></i>${eb}</span><h2>${h2}</h2><p>${sub}</p></div>`; };
const pc = (p) => `<div class="yf-pc"><div class="ph${p.cover ? ' cover' : ''}"><img src="${IMG(p.img)}" alt="" draggable="false"></div>
  <div class="nm"><b>${p.brand}</b>${p.title}</div><div class="prow"><span class="cur">${D}</span><span class="pz">${money(p.price)}</span><span class="was">${money(p.was)}</span></div>
  <button class="yf-remind yf-press" type="button">${BELL}<span>Remind me</span></button></div>`;
const card = (it, i) => `<div class="p-card" data-i="${i}" style="--bg:${it.bg}"><div class="ph"><img src="${IMG(it.img)}" alt="" draggable="false"></div>
  <span class="off">-${off(it)}%</span><div class="info"><small>${it.brand}</small><b>${it.name}</b><p><i>${D}</i>${money(it.price)}<s>${D}${money(it.was)}</s></p></div>
  <span class="st want">WANT</span><span class="st pass">PASS</span></div>`;
const gc = (k) => { const it = ITEM[k]; return `<div class="p-gc yf-press" data-k="${k}" hidden><div class="ph${it.cover ? ' cover' : ''}"><img src="${IMG(k)}" alt="" draggable="false" loading="lazy"></div>
  <button class="lk" type="button" aria-label="Like">${HEART}<i class="ring"></i>${'<i class="bit"></i>'.repeat(8)}</button>
  <div class="nm">${it.name}</div><div class="pr"><b><i>${D}</i>${money(it.price)}</b>${it.was ? `<s>${D}${money(it.was)}</s><em>-${off(it)}%</em>` : '<em class="lo">Lowest</em>'}</div></div>`; };
const box = (b, i) => { const c = DATA.coupons[i]; return `<button class="p-box" type="button" data-i="${i}" style="--c1:${b.c1};--c2:${b.c2};--rib:${b.rib};--d:${i * 0.45}s">
  <span class="cpn"><small>${c.l1}</small><b>${c.l2}</b><em>${CHECK}Collected</em></span>
  <span class="shadow"></span><span class="body"><i class="rv"></i></span><span class="lid"><i class="rv"></i><i class="bow l"></i><i class="bow r"></i></span></button>`; };
const DAYS = [
  { t: 'Today', when: 'Live now · ends midnight', items: ['flash0', 'mega1'] },
  { t: 'Tomorrow', when: 'Drops tomorrow at 9 am', items: ['hero3', 'laptops0'] },
  { t: 'Weekend', when: 'Saturday & Sunday only', items: ['mega0', 'home2'] },
];
const SCAN = ['hero1', 'wish0', 'hero2', 'mega2', 'hero0'];
const NEAR = ['hero2', 'mega2', 'wish1', 'hero0', 'laptops1', 'beauty1', 'mega0', 'home1', 'flash1', 'mobiles1', 'hero3'];
const NEAR_SPOTS = [[24, 34, 92], [128, 10, 74], [214, 44, 104], [62, 138, 70], [146, 104, 96], [252, 156, 68], [20, 214, 64], [110, 206, 80], [206, 228, 74]];   // left, top, size
const GRID_KEYS = [...new Set([...TOP, ...CATS.flatMap((c) => c.items)])];

const scroller = document.createElement('div');
scroller.className = 'yf-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="yf p-page">
  <div class="p-hi yf-rv" data-k="hi">Hi Neha!</div>
  <img class="p-date yf-rv" data-k="date" src="../yf/date.webp" alt="Yellow Friday sale" draggable="false">
  <div class="p-tapes yf-rv" data-k="tape" aria-hidden="true">
    <div class="tape a"><div class="run"><span>${TAPE.repeat(3)}</span><span>${TAPE.repeat(3)}</span></div></div>
    <div class="tape b"><div class="run"><span>${TAPE.repeat(3)}</span><span>${TAPE.repeat(3)}</span></div></div>
  </div>
  <div class="p-streak yf-rv" data-k="streak">
    <div class="fl"><svg class="flame" viewBox="0 0 48 60" aria-hidden="true"><defs><linearGradient id="pFl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF5A1F"/><stop offset=".6" stop-color="#FFB400"/><stop offset="1" stop-color="#FEEE00"/></linearGradient></defs><path class="o" d="M24 2c3 9 14 15 14 30a14 14 0 01-28 0c0-7 4-11 7-15 0 5 2 8 5 9-2-9 0-17 2-24z" fill="url(#pFl)"/><path class="i" d="M24 30c2 4 7 7 7 13a7 7 0 01-14 0c0-4 3-7 5-9 0 3 1 4 2 4-1-3-1-6 0-8z" fill="#FFF6B0"/></svg><i class="spk"></i><i class="spk"></i><i class="spk"></i></div>
    <div class="mid"><b><span class="sn">2</span>-day streak</b><small class="sl">Check in today for 5% off</small>
      <div class="days">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<i class="${i < 2 ? 'on' : i === 2 ? 'today' : ''}"><em>${CHECK}</em><u>${d}</u></i>`).join('')}</div></div>
    <button class="go" type="button"><span>Check in</span></button>
  </div>
  <div class="p-title yf-rv" data-k="deckT" style="--tint:#FEEE00"><span class="eb"><i></i>Swipe to shop</span><h2>Swipe your <span class="flipw"><span>deals</span></span></h2><p>Right to want it, left to pass</p></div>
  <div class="p-deck" data-no-drag>${DECK.map(card).join('')}
    <div class="p-done"><b>That's your shortlist!</b><span>Every deal you wanted is with the bot</span><button class="p-again yf-press" type="button">Deal again</button></div>
  </div>
  <div class="p-acts yf-rv" data-k="acts"><i class="p-coach" aria-hidden="true"></i>
    <button class="p-act pass yf-press" type="button" aria-label="Pass">${X_ICON}</button>
    <button class="p-act undo yf-press" type="button" aria-label="Undo">${UNDO}</button>
    <button class="p-act want yf-press" type="button" aria-label="Want">${HEART}</button>
  </div>
  <div class="p-picks yf-rv" data-k="picks"><span class="lbl">Your picks</span><span class="ava"></span><span class="n"><b>0</b></span></div>

  ${title('What are you into?', 'Tap a few, flick them around')}
  <div class="p-bubbles" data-no-drag>${CATS.map((c, i) => `<button class="p-bubble" type="button" data-i="${i}" style="--r:${c.r}px;--h:${c.h}"><span class="e">${c.e}</span><span class="t">${c.t}</span><i class="ck">${CHECK}</i></button>`).join('')}</div>
  <div class="p-gridhead yf-rv" data-scroll><b>Top picks</b><span>for you</span></div>
  <div class="p-grid" data-stagger>${GRID_KEYS.map(gc).join('')}</div>

  ${title('Deals by day', 'Swipe through what\'s dropping when')}
  <div class="p-days yf-rv" data-scroll>
    <div class="seg"><i class="pill"></i>${DAYS.map((d, i) => `<button type="button" data-i="${i}">${d.t}</button>`).join('')}</div>
    <div class="pager" data-no-drag>${DAYS.map((d) => `<div class="pg"><div class="when">${d.when}</div><div class="two">${d.items.map((k) => { const it = ITEM[k]; return `<div class="dc"><div class="ph${it.cover ? ' cover' : ''}"><img src="${IMG(k)}" alt="" draggable="false" loading="lazy"></div><span>${it.name}</span><b><i>${D}</i>${money(it.price)}</b></div>`; }).join('')}</div></div>`).join('')}</div>
  </div>

  ${title('Shop by budget', 'Slide to set what you want to spend')}
  <div class="p-budget yf-rv" data-scroll>
    <span class="bagchip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 016 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><b>0</b></span>
    <div class="val"><span>Under</span><b><i>${D}</i><em>1,000</em></b></div>
    <div class="track" data-no-drag><i class="fill"></i>${STOPS.map((v) => `<i class="stop" data-v="${v}"></i>`).join('')}<span class="knob"></span></div>
    <div class="ends"><span>${D}50</span><span>${D}5,000</span></div>
    <div class="count"><b>0</b> deals in your budget</div>
  </div>
  <div class="p-brow" data-stagger data-no-drag>${BUDGET.map((it) => `<div class="p-bc" data-p="${it.price}"><div class="ph${it.cover ? ' cover' : ''}"><img src="${IMG(it.img)}" alt="" draggable="false" loading="lazy"><span class="step" data-n="0"><button class="mn" type="button" aria-label="One less">−</button><em>0</em><button class="pl" type="button" aria-label="Add to bag">+</button></span></div><b><i>${D}</i>${money(it.price)}</b><span>${it.name}</span></div>`).join('')}</div>

  ${title('Bundle & save', 'Turn the dial: the more you add, the more you save')}
  <div class="p-dial yf-rv" data-scroll>
    <div class="ring" data-no-drag>
      <svg viewBox="0 0 240 240" aria-hidden="true"><circle class="trk" cx="120" cy="120" r="98"/><circle class="arc" cx="120" cy="120" r="98" pathLength="100"/>
        ${[...Array(6)].map((_, i) => { const a = (i / 6) * 2 * Math.PI - Math.PI / 2; return `<circle class="tk" cx="${(120 + 98 * Math.cos(a)).toFixed(1)}" cy="${(120 + 98 * Math.sin(a)).toFixed(1)}" r="3"/>`; }).join('')}</svg>
      <span class="knob"></span>
      <div class="mid"><b class="n">1</b><small>items</small></div>
    </div>
    <div class="save"><div><small>You save</small><b class="pct">0%</b></div><div><small>That's about</small><b class="amt"><i>${D}</i><em>0</em></b></div></div>
    <div class="avas"></div>
  </div>

  ${title('Scan my style', 'Let the bot read your vibe')}
  <div class="p-scan yf-rv" data-scroll>
    <div class="deck">${SCAN.map((k, i) => `<div class="pol" style="--r:${[-6, 4, -2, 7, -9][i]}deg"><div class="ph"><img src="${IMG(k)}" alt="" draggable="false"></div><span>${ITEM[k].name.split(' ').slice(0, 2).join(' ')}</span></div>`).join('')}<i class="beam"></i></div>
    <div class="res"><b>Your vibe: <em>Sporty minimal</em></b><span>Clean whites, everyday tech, easy skincare</span></div>
    <button class="go" type="button"><span>Scan my style</span></button>
  </div>

  ${title('Spin & win', 'Give the wheel a flick')}
  <div class="p-wheel yf-rv" data-scroll>
    <div class="stage" data-no-drag>
      <svg class="disc" viewBox="-130 -130 260 260" aria-hidden="true">${PRIZES.map((p, i) => {
        const a0 = (i * 60 - 90 - 30) * Math.PI / 180, a1 = (i * 60 - 90 + 30) * Math.PI / 180, r = 126;
        return `<path d="M0 0L${(r * Math.cos(a0)).toFixed(2)} ${(r * Math.sin(a0)).toFixed(2)}A${r} ${r} 0 0 1 ${(r * Math.cos(a1)).toFixed(2)} ${(r * Math.sin(a1)).toFixed(2)}Z" fill="${p.c}"/>
          <text transform="rotate(${i * 60}) translate(0 -80)${i * 60 > 90 && i * 60 < 270 ? ' rotate(180)' : ''}" fill="${p.ink}" text-anchor="middle" dominant-baseline="middle">${p.t}</text>`;   // (the lower ones turned to read upright)
      }).join('')}<circle r="126" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>${PRIZES.map((p, i) => `<circle cx="${(118 * Math.sin((i * 60 + 30) * Math.PI / 180)).toFixed(2)}" cy="${(-118 * Math.cos((i * 60 + 30) * Math.PI / 180)).toFixed(2)}" r="3" fill="rgba(255,255,255,.7)"/>`).join('')}</svg>
      <span class="ptr"></span>
      <button class="hub yf-press" type="button">SPIN</button>
    </div>
    <div class="won"><span class="ck">${CHECK}</span><div><b>Spin to win a prize</b><small>Drag the wheel or tap SPIN</small></div></div>
  </div>

  ${title('Your rewards', 'Everything you win prints right here · tap to fan out')}
  <div class="p-wallet yf-rv" data-scroll data-no-drag>
    <div class="slot"><i></i><span>noon rewards</span></div>
    <div class="stack"></div>
  </div>

  ${title('Mystery boxes', 'Tap one to see what\'s inside')}
  <div class="p-boxes" data-stagger>${BOXES.map(box).join('')}</div>

  ${title('Scratch & reveal', 'Rub the card to see your deal')}
  <div class="p-scratch yf-rv" data-scroll>
    <div class="under"><div class="ph"><img src="${IMG(SCRATCH.img)}" alt="" draggable="false"></div>
      <div class="tx"><small>You found</small><b>${SCRATCH.l1}</b><span>${SCRATCH.l2}</span><em>${SCRATCH.code}</em></div></div>
    <canvas class="foil" data-no-drag></canvas>
  </div>
  <div class="p-slide yf-rv is-locked" data-scroll data-no-drag>
    <i class="glow"></i><span class="lbl"><b>Slide to apply ${SCRATCH.code}</b><em>Scratch the card first</em></span>
    <span class="done">${CHECK}<b>${SCRATCH.code} applied</b></span>
    <span class="knob"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </div>

  ${title('Trending near you', 'What Dubai Marina is buying right now')}
  <div class="p-near yf-rv" data-scroll>${NEAR_SPOTS.map((sp, i) => `<button class="nb" type="button" style="left:${sp[0]}px;top:${sp[1]}px;--s:${sp[2]}px" data-i="${i}"><span class="in"><img src="${IMG(NEAR[i % NEAR.length])}" alt="" draggable="false"></span></button>`).join('')}<span class="badge"></span></div>

  ${title('Flash deals', DATA.sub.flash)}
  <div class="p-flip yf-rv" data-scroll>${['h', 'm', 's'].map((k, i) => `${i ? '<span class="col">:</span>' : ''}<div class="unit"><div class="flap" data-t="${k}"><span class="top"><b>00</b></span><span class="bot"><b>00</b></span><span class="ftop"><b>00</b></span><span class="fbot"><b>00</b></span><i class="hinge"></i></div><small>${['HRS', 'MIN', 'SEC'][i]}</small></div>`).join('')}</div>
  <div class="p-flash" data-stagger>${pc(DATA.flash[0])}${pc(DATA.flash[1])}</div>

  ${title('Golden deal', 'Lowest price in a year · tilt it')}
  <div class="p-gold yf-rv" data-scroll data-no-drag><div class="card">
    <i class="holo"></i><i class="glare"></i>
    <div class="ph"><img src="${IMG(DATA.low.img)}" alt="" draggable="false"></div>
    <div class="tx"><small>LOWEST PRICE ✦ 365 DAYS</small><b>JBL Go 4</b><span>Portable waterproof speaker</span><strong><i>${D}</i>${money(DATA.low.price)}</strong>${EXPRESS}</div>
  </div></div>
  <button class="p-hold yf-rv" data-scroll type="button"><i class="fill"></i><span class="lbl">Hold to grab it</span><span class="lbl ink" aria-hidden="true">Hold to grab it</span><span class="ok">${CHECK}<b>Grabbed! It's with the bot</b></span></button>

  ${title('Rate the sale', 'How\'s your Yellow Friday? Drag across the stars')}
  <div class="p-rate yf-rv" data-scroll>
    <div class="face"><span>🙂</span></div>
    <div class="stars" data-no-drag>${[...Array(5)].map((_, i) => `<i data-i="${i}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg></i>`).join('')}</div>
    <p class="say">Tap or slide to rate</p>
  </div>

  <div class="p-end yf-rv" data-scroll>
    <span class="spark"></span><b>You're all caught up</b><small>Yellow Friday ends in <em class="endt">03:14:19</em></small>
    <button class="top" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Back to top</span></button>
  </div>
</div>`;
sheet.appendChild(scroller);
sheet.classList.add('is-yf');
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
// confetti: one canvas over the page, bursts on demand
const confettiCv = document.createElement('canvas');
confettiCv.className = 'p-confetti';
sheet.appendChild(confettiCv);
const page = scroller.firstElementChild;
const $ = (s) => page.querySelector(s), $$ = (s) => [...page.querySelectorAll(s)];

// ─── the reveal ─────────────────────────────────────────────────────────────────────────────────────────────
// the top beats, timed from the end of the curating beat (the bot leaving for its corner): ms delay, from-transform.
// The deck deals its cards in (deck.deal); everything further down plays in as it scrolls into view.
const BEATS = {
  hi: [0, 'translateY(12px)'], date: [70, 'translateY(12px)'], tape: [150, 'translateY(18px) scale(.98)'], streak: [210, 'translateY(18px) scale(.98)'],
  deckT: [270, 'translateY(14px)'], acts: [520, 'translateY(14px)'], picks: [600, 'translateY(10px)'],
};
let io = null, live = false;
function playIn(el, from, delay) {
  el.getAnimations().forEach((a) => a.cancel());
  const d = reduce.matches ? 0 : delay;
  el.animate([{ transform: reduce.matches ? 'none' : from }, { transform: 'none' }], { duration: REVEAL.ms, easing: REVEAL.ease, delay: d, fill: 'both' });
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: REVEAL.fadeMs, easing: REVEAL.fade, delay: d, fill: 'both' });
}
const BLURIN = 'blur(5px)';
// lists and titles reveal piece by piece: the container flips on, its children glide up out of a soft blur one after
// another (55 ms apart; only the first eight wait their turn). fill 'backwards' only: once played, each child is back
// to its own CSS (a dimmed budget card stays dimmed).
function stagger(box) {
  box.classList.add('is-in');
  const kids = [...box.children].filter((c) => !c.hidden && c.offsetParent !== null);
  kids.forEach((c, i) => {
    if (reduce.matches) return;
    const d = Math.min(i, 8) * 55;
    const soft = box.classList.contains('p-title');                         // (blur only on the light title text)
    c.animate(soft ? [{ transform: 'translateY(18px)', filter: 'blur(5px)' }, { transform: 'none', filter: 'blur(0)' }] : [{ transform: 'translateY(22px) scale(.97)' }, { transform: 'none' }],
      { duration: 900, easing: REVEAL.ease, delay: d, fill: 'backwards' });
    c.animate([{ opacity: 0 }, { opacity: getComputedStyle(c).opacity }], { duration: 520, easing: REVEAL.fade, delay: d, fill: 'backwards' });
  });
}
function reveal() {
  live = true;
  $$('[data-k]').forEach((el) => { const b = BEATS[el.dataset.k]; if (b) playIn(el, b[1], b[0]); });
  deck.deal(260); flipWord.start();
  setTimeout(() => H('tick'), 300);
  io && io.disconnect();
  io = new IntersectionObserver((ents) => {
    let k = 0;
    ents.filter((e) => e.isIntersecting).forEach((e) => {
      io.unobserve(e.target);
      if (e.target.hasAttribute('data-stagger')) setTimeout(() => stagger(e.target), (k++) * 60);
      else playIn(e.target, 'translateY(24px) scale(.98)', (k++) * 70);
    });
  }, { root: scroller, threshold: 0.1, rootMargin: '0px 0px -8% 0px' });   // (a touch inside the edge, so the glide is seen)
  $$('[data-scroll], [data-stagger]').forEach((el) => io.observe(el));
  coach.start(1500);
  bubbles.watch(); gold.start();
}
function reset() {
  live = false; io && io.disconnect();
  page.querySelectorAll('.yf-rv').forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  scroller.scrollTop = 0; onScroll();
  deck.reset(); picks.reset(); bubbles.reset(); grid.reset(); boxes.reset(); budget.reset(); wheel.reset(); scratch.reset(); slide.reset(); flipWord.reset();
  sheetUI.reset(); hold.reset(); $$('.p-gc .lk.is-on').forEach((b) => b.classList.remove('is-on', 'pop'));
  $$('[data-stagger]').forEach((b) => { b.classList.remove('is-in'); [...b.children].forEach((c) => c.getAnimations().forEach((a) => a.cancel())); });
  dial.reset(); wallet.reset(); coach.reset(); peek.reset();
  streak.reset(); scan.reset(); days.reset(); bag.reset(); near.reset(); rate.reset();
  mini.reset();
}

// ─── the bot, from the page ─────────────────────────────────────────────────────────────────────────────────
// hops, a happy beat, glances at what's touched, looks the way the page scrolls, catches what's sent to it
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
  lookAt(el, ms = 1100) {
    if (!window.orbi) return;
    const sr = sheet.getBoundingClientRect(), r = el.getBoundingClientRect(), v = window.orbi.view;
    bot.look(clamp((r.left + r.width / 2 - sr.left - v.cx) / 260, -0.55, 0.55), clamp((r.top + r.height / 2 - sr.top - v.cy) / 900, -0.15, 0.32), ms);
  },
  t: 0, lt: 0,
};
// something flies up into the bot on an arc (shrinking, tipping), and the bot catches it with a hop
function flyToBot(src, done) {
  if (!src || reduce.matches || !window.orbi) { bot.hop(1.4); done && done(); return; }
  const sr = sheet.getBoundingClientRect(), r = src.getBoundingClientRect(), v = window.orbi.view;
  const fly = src.cloneNode(true); fly.classList.add('yf-fly');
  Object.assign(fly.style, { left: `${r.left - sr.left}px`, top: `${r.top - sr.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  sheet.appendChild(fly);
  const x1 = v.cx - (r.left - sr.left) - r.width / 2, y1 = v.cy - (r.top - sr.top) - r.height / 2;
  const cx = x1 * 0.35, cy = Math.min(0, y1) - 120;                         // the arc's control point: up and over
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const kf = Array.from({ length: 17 }, (_, i) => {
    const u = ease(i / 16), q = 1 - u, x = 2 * q * u * cx + u * u * x1, y = 2 * q * u * cy + u * u * y1;
    return { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - 0.86 * u).toFixed(3)}) rotate(${(-14 * u).toFixed(1)}deg)`, opacity: i > 14 ? 0 : 1, offset: i / 16 };
  });
  fly.animate(kf, { duration: 760, easing: 'linear', fill: 'both' }).onfinish = () => { fly.remove(); bot.hop(1.6); H('pop'); bot.cheer(); done && done(); };
}
// a tap on anything you can pick: the bot glances at it
page.addEventListener('pointerup', (e) => {
  const el = e.target.closest('.p-gc, .p-box, .yf-pc, .yf-low, .p-act, .p-picks'); if (el) bot.lookAt(el);
});
page.addEventListener('pointerdown', (e) => { if (e.target.closest('.yf-press') && !e.target.closest('.yf-remind, .p-act')) H('tick'); });

// confetti: little paper bits thrown up from a point, falling and fading (canvas, only while there's some)
const confetti = (() => {
  const ctx = confettiCv.getContext('2d'), COLS = ['#FEEE00', '#FF6FA5', '#8D7BFF', '#FFFFFF', '#36D399', '#FF9F43'];
  let parts = [], raf = 0, last = 0;
  const size = () => { const r = sheet.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); confettiCv.width = r.width * d; confettiCv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  function frame(now) {
    const dt = Math.min(2, (now - last) / 16.7); last = now;
    ctx.clearRect(0, 0, confettiCv.width, confettiCv.height);
    parts = parts.filter((p) => (p.life -= dt) > 0);
    for (const p of parts) {
      p.vy += 0.32 * dt; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
      ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 30); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2 * Math.abs(Math.cos(p.a * 1.7)), p.w, p.h * Math.abs(Math.cos(p.a * 1.7)) + 1);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(frame) : 0;
  }
  return {
    burst(x, y, n = 54) {
      if (reduce.matches) return;
      if (!raf) size();
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, sp = 5 + Math.random() * 7;
        parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, w: 5 + Math.random() * 4, h: 8 + Math.random() * 6, c: COLS[i % COLS.length], life: 70 + Math.random() * 40 });
      }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    },
    clear() { parts = []; cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, confettiCv.width, confettiCv.height); },
  };
})();
const sheetPoint = (el) => { const sr = sheet.getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - sr.left, y: r.top + r.height / 2 - sr.top }; };

// ─── the swipe deck ─────────────────────────────────────────────────────────────────────────────────────────
// A stack of deal cards. Drag the top one: it follows the finger, tilts with it, and stamps WANT or PASS as it
// goes; the card under it rises to take its place. Let go past the edge (or flick) and it's away — a WANT is sent up
// into the bot and lands in "Your picks", a PASS flies off. The buttons do the same, undo brings the last one back,
// and when the deck's empty it can deal again. The bot watches the card you're holding.
const deck = (() => {
  const stage = $('.p-deck'), cards = [...stage.querySelectorAll('.p-card')], done = stage.querySelector('.p-done');
  const N = cards.length, OUT = 470;
  let at = 0, hist = [], drag = null, busy = false;
  const slot = (k) => (k <= 2 ? `translate3d(0, ${k * 16}px, 0) scale(${(1 - k * 0.055).toFixed(3)})` : 'translate3d(0, 32px, 0) scale(.89)');
  const stamps = (c, x) => { c.style.setProperty('--want', clamp(x / 90, 0, 1).toFixed(3)); c.style.setProperty('--pass', clamp(-x / 90, 0, 1).toFixed(3)); };
  function layout(animate = true, stagger = 0) {
    cards.forEach((c, i) => {
      const k = i - at;
      if (k < 0) return;
      c.style.transition = animate ? `transform .62s cubic-bezier(0.16, 1, 0.3, 1) ${stagger * k}ms, opacity .4s ease ${stagger * k}ms` : 'none';
      c.style.transform = slot(k); c.style.opacity = k <= 2 ? 1 : 0; c.style.zIndex = String(20 - k); c.style.visibility = '';
      c.classList.toggle('is-top', k === 0); stamps(c, 0);
    });
    done.classList.toggle('is-on', at >= N);
  }
  function away(dir, vy = 0, tilt = 1) {
    const c = cards[at]; if (!c || busy) return;
    busy = true;
    const it = DECK[at], from = c.style.transform || slot(0), dx = parseFloat(c.dataset.dx || 0), dy = parseFloat(c.dataset.dy || 0);
    stamps(c, dir * 90);
    c.style.transition = 'none';
    const a = c.animate([{ transform: from }, { transform: `translate3d(${dir * OUT}px, ${(dy * 0.25 + clamp(vy * 0.12, -120, 120) - 30).toFixed(1)}px, 0) rotate(${dir * 24 * tilt}deg)` }],
      { duration: Math.abs(dx) > 60 ? 360 : 460, easing: 'cubic-bezier(0.3, 0.55, 0.35, 1)', fill: 'forwards' });
    a.onfinish = () => { c.style.visibility = 'hidden'; };
    if (dir > 0) { flyToBot(c.querySelector('.ph'), () => picks.add(it)); H('success'); }
    else { H('tap'); bot.look(-0.45, 0.1, 500); }
    hist.push({ i: at, dir }); at++; c.dataset.dx = c.dataset.dy = 0;
    layout();
    setTimeout(() => { busy = false; }, 160);
  }
  function undo() {
    const h = hist.pop(); if (!h || busy) return;
    const c = cards[h.i];
    c.getAnimations().forEach((a) => a.cancel());
    c.style.transition = 'none'; c.style.visibility = ''; c.style.opacity = 1; c.style.zIndex = '30';
    c.style.transform = `translate3d(${h.dir * OUT}px, -30px, 0) rotate(${h.dir * 26}deg)`;
    void c.offsetWidth;
    at = h.i; layout();
    if (h.dir > 0) picks.remove(DECK[h.i].img);
    H('tick');
  }
  // dragging the top card
  stage.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('.p-card.is-top'); if (!c || busy || e.button) return;
    const r = c.getBoundingClientRect();
    drag = { c, x: e.clientX, y: e.clientY, dx: 0, dy: 0, axis: null, id: e.pointerId, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: performance.now(),
      tilt: (e.clientY - r.top) / r.height > 0.62 ? -1 : 1 };              // (held low, the card tips the other way, like a real one)
  });
  addEventListener('pointermove', (e) => {
    const d = drag; if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.axis && Math.hypot(dx, dy) > 6) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'x') { try { stage.setPointerCapture(e.pointerId); } catch {} d.c.style.transition = 'none'; d.c.classList.add('is-held'); }
      else { drag = null; return; }
    }
    if (d.axis !== 'x') return;
    const now = performance.now(), dt = Math.max(1, now - d.lt);
    d.vx = 0.8 * ((e.clientX - d.lx) / dt) + 0.2 * d.vx; d.vy = 0.8 * ((e.clientY - d.ly) / dt) + 0.2 * d.vy; d.lx = e.clientX; d.ly = e.clientY; d.lt = now;
    d.dx = dx; d.dy = dy; d.c.dataset.dx = dx; d.c.dataset.dy = dy;
    d.c.style.transform = `translate3d(${dx.toFixed(1)}px, ${(dy * 0.25).toFixed(1)}px, 0) rotate(${(dx * 0.06 * d.tilt).toFixed(2)}deg)`;
    stamps(d.c, dx);
    const next = cards[at + 1], p = clamp(Math.abs(dx) / 140, 0, 1);       // the card underneath rises to meet it
    if (next) { next.style.transition = 'none'; next.style.transform = `translate3d(0, ${(16 * (1 - p)).toFixed(1)}px, 0) scale(${(1 - 0.055 * (1 - p)).toFixed(3)})`; }
    const was = d.armed, armed = Math.abs(dx) > 110; if (armed !== was) { d.armed = armed; H('tick'); }
    bot.look(clamp(dx / 300, -0.5, 0.5), 0.12, 700);
  });
  const end = (e) => {
    const d = drag; if (!d || e.pointerId !== d.id) return;
    drag = null; d.c.classList.remove('is-held');
    if (d.axis !== 'x') return;
    if (Math.abs(d.dx) > 110 || Math.abs(d.vx) > 0.6) away(Math.sign(Math.abs(d.dx) > 30 ? d.dx : d.vx), d.vy * 1000, d.tilt);
    else { d.c.dataset.dx = d.c.dataset.dy = 0; layout(); }                // not far enough: it springs back to the stack
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  $('.p-act.pass').addEventListener('click', () => away(-1));
  $('.p-act.want').addEventListener('click', () => away(1));
  $('.p-act.undo').addEventListener('click', undo);
  done.querySelector('.p-again').addEventListener('click', () => deal(0, true));
  // dealing: the cards drop in from above, one after another, onto the stack
  function deal(delay = 0, again = false) {
    at = 0; hist = [];
    cards.forEach((c, i) => {
      c.getAnimations().forEach((a) => a.cancel());
      c.style.transition = 'none'; c.style.visibility = ''; c.dataset.dx = c.dataset.dy = 0;
      c.style.opacity = 0; c.style.transform = `translate3d(${((i % 2 ? 1 : -1) * 30).toFixed(0)}px, ${again ? -140 : 120}px, 0) rotate(${(i % 2 ? 7 : -7)}deg) scale(.94)`;
    });
    done.classList.remove('is-on');
    void stage.offsetWidth;
    // dealt back to front: the third card lands first and the top one last, each turning opaque in a blink, so a card
    // never shows through the one in front of it (all fading together read as a ghost)
    setTimeout(() => {
      cards.forEach((c, i) => {
        const k = i - at, d = reduce.matches ? 0 : Math.max(0, 2 - k) * 90;
        c.style.zIndex = String(20 - k); c.classList.toggle('is-top', k === 0);
        if (k > 2) { c.style.transition = 'none'; c.style.transform = slot(k); c.style.opacity = 0; return; }
        c.style.transition = `transform .66s cubic-bezier(0.16, 1, 0.3, 1) ${d}ms, opacity .14s linear ${d}ms`;
        c.style.transform = slot(k); c.style.opacity = 1;
      });
      H('tick');
    }, reduce.matches ? 0 : delay);
  }
  return {
    deal,
    reset() { cards.forEach((c) => { c.getAnimations().forEach((a) => a.cancel()); c.style.transition = 'none'; c.style.opacity = 0; }); at = 0; hist = []; done.classList.remove('is-on'); },
  };
})();

// your picks: the wanted deals' faces stack up in a pill, the count rolls over
const picks = (() => {
  const el = $('.p-picks'), ava = el.querySelector('.ava'), n = el.querySelector('.n');
  let list = [];
  function count() {
    const old = n.querySelector('b:last-child'), nu = document.createElement('b'); nu.textContent = list.length; n.appendChild(nu);
    old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-14px)', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).onfinish = () => old.remove();
    nu.animate([{ transform: 'translateY(14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: REVEAL.ease, fill: 'both' });
    el.animate([{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 420, easing: REVEAL.ease });
    el.classList.toggle('has', list.length > 0);
  }
  return {
    add(it) {
      list.push(it.img);
      const f = document.createElement('i'); f.dataset.k = it.img; f.style.setProperty('--bg', it.bg); f.innerHTML = `<img src="${IMG(it.img)}" alt="" draggable="false">`;
      ava.prepend(f);
      f.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(0.3, 1.2, 0.5, 1)', fill: 'both' });
      [...ava.children].slice(4).forEach((x) => x.remove());
      count();
    },
    remove(k) {
      const i = list.lastIndexOf(k); if (i < 0) return;
      list.splice(i, 1);
      const f = ava.querySelector(`[data-k="${k}"]`);
      if (f) f.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.2)', opacity: 0 }], { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }).onfinish = () => f.remove();
      count();
    },
    reset() { list = []; ava.innerHTML = ''; n.innerHTML = '<b>0</b>'; el.classList.remove('has'); },
  };
})();

// ─── the bubbles ────────────────────────────────────────────────────────────────────────────────────────────
// Category bubbles that pour in, float and jostle (a little physics: each drifts to the middle, they push each
// other apart, bounce off the edges). Drag one around, fling it into the others; tap one to pick it — it swells,
// turns yellow and the grid below re-shuffles to what you picked.
const bubbles = (() => {
  const stage = $('.p-bubbles'), W = 375, HS = 280, R = 60;
  const B = [...stage.querySelectorAll('.p-bubble')].map((el, i) => ({ el, i, base: CATS[i].r, r: CATS[i].r, tr: CATS[i].r, x: 0, y: 0, vx: 0, vy: 0, sel: false }));
  let raf = 0, last = 0, held = null, t0 = 0, seen = false, visible = false;
  const place = () => B.forEach((b) => { b.el.style.transform = `translate3d(${(b.x - R).toFixed(2)}px, ${(b.y - R).toFixed(2)}px, 0) scale(${(b.r / R).toFixed(4)})`; });
  function pour() {
    B.forEach((b, i) => { b.x = 60 + ((i * 97) % 255); b.y = -70 - i * 46; b.vx = (Math.random() - 0.5) * 2; b.vy = 3 + Math.random() * 2; b.r = b.tr = b.base; b.sel = false; b.el.classList.remove('is-sel'); });
    place(); t0 = performance.now();
  }
  function step(now) {
    const dt = Math.min(2, (now - last) / 16.7); last = now;
    const t = (now - t0) / 1000;
    B.forEach((b) => {
      if (b === held) return;
      const k = b.sel ? 2.4 : 1;
      b.vx += ((W / 2 - b.x) * 0.0011 * k + Math.sin(t * 0.8 + b.i * 1.7) * 0.012) * dt;
      b.vy += ((HS / 2 - b.y) * 0.0016 * k + Math.cos(t * 0.7 + b.i * 2.3) * 0.012) * dt;
      b.vx *= Math.pow(0.975, dt); b.vy *= Math.pow(0.975, dt);
      b.x += b.vx * dt; b.y += b.vy * dt;
    });
    for (let it = 0; it < 3; it++) {                                    // push apart
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], c = B[j], dx = c.x - a.x, dy = c.y - a.y, dist = Math.hypot(dx, dy) || 0.01, min = a.r + c.r + 4;
        if (dist >= min) continue;
        const o = (min - dist), nx = dx / dist, ny = dy / dist, wa = a === held ? 0 : c === held ? 1 : 0.5, wc = 1 - wa;
        a.x -= nx * o * wa; a.y -= ny * o * wa; c.x += nx * o * wc; c.y += ny * o * wc;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { const imp = -rv * 0.6; if (a !== held) { a.vx -= nx * imp * wa * 2; a.vy -= ny * imp * wa * 2; } if (c !== held) { c.vx += nx * imp * wc * 2; c.vy += ny * imp * wc * 2; } }
      }
    }
    B.forEach((b) => {                                                  // the walls (the top only once they're in)
      b.r += (b.tr - b.r) * Math.min(1, 0.2 * dt);
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.55; } if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.55; }
      if (b.y > HS - b.r) { b.y = HS - b.r; b.vy = -Math.abs(b.vy) * 0.55; } if (b.y < b.r && t > 1.6) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.55; }
    });
    place();
    raf = visible && live ? requestAnimationFrame(step) : 0;
  }
  const run = () => { if (!raf && visible && live) { last = performance.now(); raf = requestAnimationFrame(step); } };
  const vis = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !seen && live) { seen = true; pour(); }
    run();
  }, { root: scroller, threshold: 0.2 });
  // touch: drag, fling, tap to pick
  let g = null;
  stage.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.p-bubble'); if (!el) return;
    const b = B[+el.dataset.i], r = stage.getBoundingClientRect();
    g = { b, id: e.pointerId, ox: e.clientX - r.left - b.x, oy: e.clientY - r.top - b.y, sx: e.clientX, sy: e.clientY, moved: false, lx: e.clientX, ly: e.clientY, lt: performance.now(), vx: 0, vy: 0 };
    held = b; b.el.classList.add('is-held'); try { el.setPointerCapture(e.pointerId); } catch {}
    run();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id) return;
    if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 6) g.moved = true;
    const r = stage.getBoundingClientRect(), now = performance.now(), dt = Math.max(1, now - g.lt) / 16.7;
    g.vx = 0.7 * ((e.clientX - g.lx) / dt) + 0.3 * g.vx; g.vy = 0.7 * ((e.clientY - g.ly) / dt) + 0.3 * g.vy; g.lx = e.clientX; g.ly = e.clientY; g.lt = now;
    g.b.x = clamp(e.clientX - r.left - g.ox, g.b.r, W - g.b.r); g.b.y = clamp(e.clientY - r.top - g.oy, g.b.r, HS - g.b.r);
  });
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return;
    const d = g; g = null; held = null; d.b.el.classList.remove('is-held');
    if (d.moved) { d.b.vx = clamp(d.vx, -22, 22); d.b.vy = clamp(d.vy, -22, 22); H('tick'); return; }
    const b = d.b; b.sel = !b.sel; b.tr = b.sel ? b.base * 1.24 : b.base; b.vy -= 2.5;
    b.el.classList.toggle('is-sel', b.sel); H(b.sel ? 'success' : 'tap');
    if (b.sel) bot.hop(0.7);
    bot.lookAt(b.el, 900);
    grid.update(B.filter((x) => x.sel).map((x) => CATS[x.i]));
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  return {
    watch() { vis.disconnect(); vis.observe(stage); },
    reset() { vis.disconnect(); cancelAnimationFrame(raf); raf = 0; seen = false; visible = false; held = null; g = null; B.forEach((b, i) => { b.x = 60 + ((i * 97) % 255); b.y = -120; b.sel = false; b.r = b.tr = b.base; b.el.classList.remove('is-sel'); }); place(); },
  };
})();

// the grid: what you picked (or our top picks). Changing it plays a FLIP shuffle — cards that stay glide to their
// new places, the ones that go fade back, the new ones rise in — and the grid's height eases to fit.
const grid = (() => {
  const el = $('.p-grid'), head = $('.p-gridhead');
  const cards = new Map($$('.p-gc').map((c) => [c.dataset.k, c]));
  let cur = [];
  const want = (sel) => (sel.length ? [...new Set(sel.flatMap((c) => c.items))].slice(0, 6) : TOP);
  function show(keys, animate) {
    const next = keys, nextSet = new Set(next), before = el.offsetHeight;
    const vis = cur.map((k) => cards.get(k));
    const first = new Map(vis.map((c) => [c, c.getBoundingClientRect()]));
    const leaving = vis.filter((c) => !nextSet.has(c.dataset.k));
    const swap = () => {
      leaving.forEach((c) => { c.hidden = true; c.getAnimations().forEach((a) => a.cancel()); });
      next.forEach((k) => { const c = cards.get(k); el.appendChild(c); c.hidden = false; });
      cur = next;
      if (!animate) return;
      next.forEach((k, idx) => {
        const c = cards.get(k), f = first.get(c), l = c.getBoundingClientRect();
        if (f) { const dx = f.left - l.left, dy = f.top - l.top; if (Math.abs(dx) + Math.abs(dy) > 0.5) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 640, easing: REVEAL.ease }); }
        else c.animate([{ opacity: 0, transform: 'translateY(18px) scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 640, easing: REVEAL.ease, delay: 40 + idx * 40, fill: 'both' });
      });
      const after = el.offsetHeight;
      if (Math.abs(after - before) > 1) el.animate([{ height: `${before}px` }, { height: `${after}px` }], { duration: 520, easing: REVEAL.ease });
    };
    if (animate && leaving.length) {
      leaving.forEach((c) => c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 170, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }));
      el.style.height = `${before}px`;
      setTimeout(() => { el.style.height = ''; swap(); }, 170);
    } else swap();
  }
  function headline(sel) {
    const b = head.querySelector('b'), s = head.querySelector('span');
    const txt = sel.length ? `${sel.length === 1 ? sel[0].t : `${sel.length} picks`}` : 'Top picks', sub = sel.length ? `${want(sel).length} deals for you` : 'for you';
    if (b.textContent === txt && s.textContent === sub) return;
    head.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 140, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () => {
      b.textContent = txt; s.textContent = sub;
      head.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: REVEAL.ease });
    };
  }
  return {
    update(sel) { headline(sel); show(want(sel), true); },
    reset() { cards.forEach((c) => { c.hidden = true; }); cur = []; show(TOP, false); head.querySelector('b').textContent = 'Top picks'; head.querySelector('span').textContent = 'for you'; },
  };
})();

// ─── the mystery boxes ──────────────────────────────────────────────────────────────────────────────────────
// Three wrapped boxes bob and now and then wiggle. Tap one: it squashes, the lid pops off and spins away, its coupon
// rises out ("Collected"), confetti flies and the bot cheers. Each opens once (until the page is opened again).
const boxes = (() => {
  const els = $$('.p-box');
  els.forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('is-open')) { b.querySelector('.cpn').animate([{ transform: 'translateY(-62px) scale(1)' }, { transform: 'translateY(-68px) scale(1.06)' }, { transform: 'translateY(-62px) scale(1)' }], { duration: 360, easing: 'ease-out' }); H('tick'); return; }
    b.classList.add('is-opening');
    H('tap');
    setTimeout(() => {
      b.classList.add('is-open');
      const p = sheetPoint(b); confetti.burst(p.x, p.y - 20);
      H('success'); bot.hop(1.3); bot.cheer(); bot.lookAt(b, 1200);
      const c = DATA.coupons[+b.dataset.i]; wallet.add({ t: c.l2, s: c.l1.replace(/ (on|up to)$/, ''), c: BOXES[+b.dataset.i].c1 });
    }, reduce.matches ? 0 : 260);
  }));
  return { reset() { els.forEach((b) => b.classList.remove('is-open', 'is-opening')); confetti.clear(); } };
})();

// ─── a rolling number (after Runmo's day counter / Circle's balance ticker on 60fps.design) ─────────────────────
// Each digit is a 0–9 column that slides to its value; while it's moving fast it picks up a little vertical blur.
function odometer(el) {
  let str = '';
  const build = (s) => {
    el.innerHTML = [...s].map((ch) => (/\d/.test(ch) ? `<span class="od"><span class="col">${'0123456789'.split('').map((d) => `<span class="odd">${d}</span>`).join('')}</span></span>` : `<span class="sep">${ch}</span>`)).join('');
  };
  return {
    set(text, instant) {
      if (text === str) return;
      const old = str; str = text;
      if (old.length !== text.length) build(text);
      [...text].forEach((ch, i) => {
        if (!/\d/.test(ch)) return;
        const col = el.children[i].firstElementChild, y = `translateY(${-+ch * 10}%)`;
        if (instant || old.length !== text.length) { col.style.transition = 'none'; col.style.transform = y; return; }
        if (col.style.transform === y) return;
        col.style.transition = 'transform .5s cubic-bezier(0.16, 1, 0.3, 1), filter .5s ease';
        col.style.transform = y; col.style.filter = 'blur(1.2px)';
        clearTimeout(col.t); col.t = setTimeout(() => { col.style.filter = ''; }, 160);
      });
    },
  };
}

// ─── shop by budget ─────────────────────────────────────────────────────────────────────────────────────────
// Scrub the knob: the budget rolls over above it (₼50 → ₼5,000 on a log scale, so the low end has room), deals over
// it dim and step back, the count updates, and you feel a tick as you pass each marked budget. Tap the track to jump.
const budget = (() => {
  const el = $('.p-budget'), track = el.querySelector('.track'), knob = el.querySelector('.knob'), fill = el.querySelector('.fill');
  const amt = odometer(el.querySelector('.val em')), cnt = odometer(el.querySelector('.count b')), cards = $$('.p-bc');
  // (after CRED's ticket-pop slider on 60fps.design) coins pop up out of the knob as it moves, on a spring
  const pops = []; let popRaf = 0, lastPop = 0, lastPopT = 0;
  function pop(x, dir) {
    if (reduce.matches || pops.length > 22) return;
    const c = document.createElement('i'); c.className = 'coin'; c.innerHTML = '<b>' + D + '</b>'; el.appendChild(c);
    pops.push({ c, x, y: track.offsetTop + 18, vx: -dir * (0.6 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.2, vy: -(4.2 + Math.random() * 2.6), r: (Math.random() - 0.5) * 40, vr: (Math.random() - 0.5) * 9, s: 0, vs: 0, life: 0 });
    if (!popRaf) { lastPopT = performance.now(); popRaf = requestAnimationFrame(popStep); }
  }
  function popStep(now) {
    const dt = Math.min(2, (now - lastPopT) / 16.7); lastPopT = now;
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i]; p.life += dt;
      p.vs += ((1 - p.s) * 0.28 - p.vs * 0.42) * dt; p.s += p.vs * dt;                        // the pop: a quick spring to full size
      p.vy += 0.26 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      const o = p.life < 26 ? 1 : Math.max(0, 1 - (p.life - 26) / 14);
      p.c.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.r.toFixed(1)}deg) scale(${Math.max(0, p.s).toFixed(3)})`;
      p.c.style.opacity = o.toFixed(3);
      if (o <= 0) { p.c.remove(); pops.splice(i, 1); }
    }
    popRaf = pops.length ? requestAnimationFrame(popStep) : 0;
  }
  const MIN = 50, MAX = 5000, toV = (t) => MIN * Math.pow(MAX / MIN, t), toT = (v) => Math.log(v / MIN) / Math.log(MAX / MIN);
  const nice = (v) => (v < 200 ? Math.round(v / 10) * 10 : v < 1000 ? Math.round(v / 25) * 25 : Math.round(v / 100) * 100);
  let t = toT(1000), held = null, lastStop = -1, shown = -1;
  el.querySelectorAll('.stop').forEach((s) => { s.style.left = `${(toT(+s.dataset.v) * 100).toFixed(2)}%`; });
  function set(nt, quiet) {
    t = clamp(nt, 0, 1);
    const v = nice(toV(t)), pct = `${(t * 100).toFixed(2)}%`;
    knob.style.left = pct; fill.style.width = pct;
    amt.set(v.toLocaleString('en-US'), quiet);
    if (held && !quiet) {                                                // a coin for every few px of travel
      const kx = knob.offsetLeft + track.offsetLeft;
      if (Math.abs(kx - lastPop) > 9) { pop(kx, Math.sign(kx - lastPop)); lastPop = kx; }
    }
    let n = 0; cards.forEach((c) => { const ok = +c.dataset.p <= v; c.classList.toggle('is-out', !ok); n += ok; });
    if (n !== shown) { shown = n; cnt.set(String(n), quiet); }
    const stop = STOPS.filter((s) => v >= s).length;
    if (stop !== lastStop) { if (!quiet && lastStop >= 0) H('tick'); lastStop = stop; }
  }
  const at = (x) => { const r = track.getBoundingClientRect(); return (x - r.left) / r.width; };
  track.addEventListener('pointerdown', (e) => {
    held = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: e.target === knob ? 'x' : null };
    if (held.axis) { try { track.setPointerCapture(e.pointerId); } catch {} el.classList.add('is-held'); }
    lastPop = knob.offsetLeft + track.offsetLeft;
  });
  track.addEventListener('pointermove', (e) => {
    if (!held || e.pointerId !== held.id) return;
    if (!held.axis && Math.hypot(e.clientX - held.x, e.clientY - held.y) > 6) {
      held.axis = Math.abs(e.clientX - held.x) > Math.abs(e.clientY - held.y) ? 'x' : 'y';
      if (held.axis === 'x') { try { track.setPointerCapture(e.pointerId); } catch {} el.classList.add('is-held'); } else { held = null; return; }
    }
    if (held.axis === 'x') set(at(e.clientX));
  });
  const up = (e) => {
    if (!held || e.pointerId !== held.id) return;
    const h = held; held = null; el.classList.remove('is-held');
    if (!h.axis) {                                                        // a tap on the track: glide there
      const from = t, to = clamp(at(e.clientX), 0, 1), t0 = performance.now();
      const step = (now) => { const u = Math.min(1, (now - t0) / 420), k = 1 - Math.pow(1 - u, 3); set(from + (to - from) * k); if (u < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); H('tick');
    }
  };
  track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
  return { reset() { lastStop = -1; shown = -1; pops.splice(0).forEach((p) => p.c.remove()); set(toT(1000), true); } };
})();

// ─── spin & win ─────────────────────────────────────────────────────────────────────────────────────────────
// Grab the wheel and turn it, then let go: it carries your flick and slows on friction, the pointer clicks over each
// peg (a tick each time), and where it stops is your prize — it lights up below, with confetti and a happy bot. The
// SPIN hub gives it a good flick for you. A gentle nudge just turns it; only a real spin plays for a prize.
const wheel = (() => {
  const el = $('.p-wheel'), stage = el.querySelector('.stage'), disc = el.querySelector('.disc'), ptr = el.querySelector('.ptr'), hub = el.querySelector('.hub');
  const won = el.querySelector('.won'), wonB = won.querySelector('b'), wonS = won.querySelector('small');
  let ang = 0, vel = 0, raf = 0, g = null, spun = 0, lastPeg = 0;
  const draw = () => { disc.style.transform = `rotate(${ang.toFixed(2)}deg)`; };
  const peg = () => Math.floor((ang + 30) / 60);
  function flap() { H('tick'); ptr.classList.remove('flap'); void ptr.offsetWidth; ptr.classList.add('flap'); }
  function run() {
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(2, (now - last) / 16.7); last = now;
      ang += vel * dt; spun += Math.abs(vel * dt);
      if (spun > 300 && Math.abs(vel) < 1.6) {                            // the last stretch: ease into the nearest prize's middle
        const tgt = Math.round(ang / 60) * 60; vel += ((tgt - ang) * 0.012 - vel * 0.22) * dt;
      } else vel *= Math.pow(0.986, dt);                                  // (friction)
      const pg = peg(); if (pg !== lastPeg) { lastPeg = pg; flap(); }
      draw();
      if (Math.abs(vel) < 0.02 && (spun <= 300 || Math.abs(ang - Math.round(ang / 60) * 60) < 0.3)) { raf = 0; vel = 0; if (spun > 300) land(); spun = 0; return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function land() {
    const i = ((Math.round(-ang / 60) % 6) + 6) % 6, p = PRIZES[i];          // the segment under the pointer
    won.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.94)', opacity: 0 }], { duration: 140, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () => {
      wonB.textContent = `You won ${p.t}`; wonS.textContent = p.s; won.classList.add('is-on');
      won.animate([{ transform: 'scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(0.3, 1.25, 0.5, 1)' });
    };
    const pt = sheetPoint(stage); confetti.burst(pt.x, pt.y - 40, 46);
    H('success'); bot.lookAt(stage, 1400); wallet.add({ t: p.t, s: p.s, c: p.c === '#1E1E1E' || p.c === '#2A2A2A' ? '#FEEE00' : p.c });
    // (after Duolingo's reward pop on 60fps.design) the prize pops up big over the wheel with a burst of rays, holds a
    // beat, then flies up into the bot
    const badge = document.createElement('div');
    badge.className = 'p-prize'; badge.style.setProperty('--c', p.c === '#1E1E1E' || p.c === '#2A2A2A' ? '#FEEE00' : p.c);   // (dark prizes pop in noon yellow)
    const col = p.c === '#1E1E1E' || p.c === '#2A2A2A' ? '#FEEE00' : p.c;
    badge.innerHTML = `<i class="rays">${'<i></i>'.repeat(12)}</i><span class="p-prize-disc" style="background:${col}"><b>${p.t}</b></span>`;
    stage.appendChild(badge);
    if (reduce.matches) { setTimeout(() => badge.remove(), 900); return; }
    badge.querySelector('.p-prize-disc').animate([{ transform: 'scale(0)' }, { transform: 'scale(1.16)', offset: 0.55 }, { transform: 'scale(.96)', offset: 0.8 }, { transform: 'scale(1)' }], { duration: 620, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)', fill: 'both' });
    badge.querySelector('.rays').animate([{ transform: 'scale(.4) rotate(0)', opacity: 0 }, { transform: 'scale(1) rotate(30deg)', opacity: 1, offset: 0.3 }, { transform: 'scale(1.25) rotate(70deg)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'both' });
    setTimeout(() => { const d = badge.querySelector('.p-prize-disc'); flyToBot(d, () => badge.remove()); d.style.visibility = 'hidden'; }, 1050);
  }
  const angAt = (e) => { const r = stage.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.hub')) return;
    cancelAnimationFrame(raf); raf = 0; vel = 0;
    g = { id: e.pointerId, a: angAt(e), t: performance.now(), v: 0, x: e.clientX, y: e.clientY, on: false };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id) return;
    if (!g.on) { if (Math.hypot(e.clientX - g.x, e.clientY - g.y) < 6) return; g.on = true; try { stage.setPointerCapture(e.pointerId); } catch {} el.classList.add('is-held'); }
    const a = angAt(e); let d = a - g.a; if (d > 180) d -= 360; if (d < -180) d += 360;
    const now = performance.now(), dt = Math.max(1, now - g.t) / 16.7;
    g.v = 0.7 * (d / dt) + 0.3 * g.v; g.a = a; g.t = now;
    ang += d; spun += Math.abs(d); draw();
    const pg = peg(); if (pg !== lastPeg) { lastPeg = pg; flap(); }
  });
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return;
    const d = g; g = null; el.classList.remove('is-held');
    if (!d.on) return;
    vel = clamp(d.v, -38, 38); spun = Math.abs(vel) > 6 ? 400 : 0; run();
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  hub.addEventListener('click', () => { if (raf) return; vel = 22 + Math.random() * 14; spun = 400; H('tap'); run(); });
  return { reset() { cancelAnimationFrame(raf); raf = 0; vel = 0; ang = 0; spun = 0; lastPeg = 0; draw(); won.classList.remove('is-on'); wonB.textContent = 'Spin to win a prize'; wonS.textContent = 'Drag the wheel or tap SPIN'; } };
})();

// ─── scratch & reveal ───────────────────────────────────────────────────────────────────────────────────────
// A foil card over a hidden deal. Rub it with a finger: the foil comes away under it (soft-edged strokes, a faint
// tick now and then). Once about half is off, the rest lifts away by itself and the deal pops — confetti, a cheer.
const scratch = (() => {
  const el = $('.p-scratch'), cv = el.querySelector('.foil'), ctx = cv.getContext('2d'), under = el.querySelector('.under');
  let W = 0, Hc = 0, dpr = 1, g = null, done = false, moves = 0, lastTick = 0;
  function paint() {
    const r = el.getBoundingClientRect(); W = r.width || 343; Hc = r.height || 168; dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = Hc * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    const gr = ctx.createLinearGradient(0, 0, W, Hc); gr.addColorStop(0, '#FFF59A'); gr.addColorStop(0.45, '#FEEE00'); gr.addColorStop(0.55, '#FFF8B8'); gr.addColorStop(1, '#F2C200');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, Hc);
    ctx.fillStyle = 'rgba(18,18,18,.08)';
    for (let y = -20; y < Hc + 20; y += 26) for (let x = (y / 26) % 2 ? 0 : 22; x < W; x += 44) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore(); }
    ctx.fillStyle = '#121212'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 22px Noontree, sans-serif'; ctx.fillText('SCRATCH ME', W / 2, Hc / 2 - 8);
    ctx.font = '600 13px Noontree, sans-serif'; ctx.fillStyle = 'rgba(18,18,18,.6)'; ctx.fillText('a deal is hiding under here', W / 2, Hc / 2 + 16);
    ctx.globalCompositeOperation = 'destination-out';
  }
  function rub(x0, y0, x1, y1) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = 38; ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.lineWidth = 52; ctx.strokeStyle = 'rgba(0,0,0,.35)';                // (a soft edge round the stroke)
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  function cleared() {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 4 * 97) { n++; if (d[i] < 60) clear++; }
    return clear / n;
  }
  function finish() {
    done = true;
    cv.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(1.04)' }], { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
    under.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1.03)' }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' });
    el.classList.add('is-done'); slide.unlock(); wallet.add({ t: SCRATCH.l1, s: `${SCRATCH.l2} · ${SCRATCH.code}`, c: '#FF8DB8' });
    const pt = sheetPoint(el); confetti.burst(pt.x, pt.y, 50);
    H('success'); bot.hop(1.4); bot.cheer(); bot.lookAt(el, 1200);
  }
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', (e) => { if (done) return; const [x, y] = pos(e); g = { id: e.pointerId, x, y }; try { cv.setPointerCapture(e.pointerId); } catch {} rub(x, y, x + 0.1, y); });
  cv.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id || done) return;
    const [x, y] = pos(e); rub(g.x, g.y, x, y); g.x = x; g.y = y;
    const now = performance.now(); if (now - lastTick > 90) { lastTick = now; H('tick'); }
    if (++moves % 12 === 0 && cleared() > 0.5) finish();
  });
  const up = (e) => { if (!g || e.pointerId !== g.id) return; g = null; if (!done && cleared() > 0.5) finish(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  return {
    reset() { done = false; moves = 0; g = null; el.classList.remove('is-done'); cv.getAnimations().forEach((a) => a.cancel()); requestAnimationFrame(paint); },
  };
})();

// ─── slide to apply (after CRED's swipe-to-pay on 60fps.design) ─────────────────────────────────────────────
// Locked until the card's scratched. Then drag the knob along: a glow fills the track behind it and the label fades
// as you go. Let go past ~82 % and it runs to the end, the knob swells across the track and becomes "GLOW20 applied";
// short of that it springs back. A tap nudges it, so it's clear it slides.
const slide = (() => {
  const el = $('.p-slide'), knob = el.querySelector('.knob'), glow = el.querySelector('.glow'), lbl = el.querySelector('.lbl');
  let x = 0, max = 0, g = null, state = 'locked', raf = 0;
  const KN = 52, PAD = 4;
  const place = () => { knob.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`; glow.style.width = `${(x + KN + PAD * 2).toFixed(1)}px`; lbl.style.opacity = (1 - Math.min(1, x / (max * 0.6))).toFixed(3); };
  const measure = () => { max = el.clientWidth - KN - PAD * 2; };
  function springTo(to, done) {
    cancelAnimationFrame(raf); let v = 0, last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); v += ((to - x) * 320 - v * 34) * k; x += v * k; }
      place();
      if (Math.abs(to - x) < 0.4 && Math.abs(v) < 6) { x = to; place(); raf = 0; done && done(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function success() {
    state = 'done'; el.classList.add('is-done');
    H('success'); bot.hop(1.3); bot.cheer(); bot.lookAt(el, 1200);
    const pt = sheetPoint(el); confetti.burst(pt.x, pt.y - 10, 36);
  }
  knob.addEventListener('pointerdown', (e) => {
    if (state !== 'ready') { if (state === 'locked') { el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 340, easing: 'ease-out' }); H('error'); } return; }
    measure(); cancelAnimationFrame(raf); raf = 0;
    g = { id: e.pointerId, x0: e.clientX - x, sx: e.clientX, moved: false, armed: false };
    try { knob.setPointerCapture(e.pointerId); } catch {} el.classList.add('is-held');
  });
  knob.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id) return;
    if (Math.abs(e.clientX - g.sx) > 4) g.moved = true;
    x = clamp(e.clientX - g.x0, 0, max); place();
    const armed = x > max * 0.82; if (armed !== g.armed) { g.armed = armed; H('tick'); }
  });
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return;
    const d = g; g = null; el.classList.remove('is-held');
    if (!d.moved) { springTo(46, () => springTo(0)); H('tick'); return; }          // a tap: a nudge to show it slides
    if (x > max * 0.82) springTo(max, success); else springTo(0);
  };
  knob.addEventListener('pointerup', up); knob.addEventListener('pointercancel', up);
  return {
    unlock() { state = 'ready'; el.classList.remove('is-locked'); el.animate([{ transform: 'scale(.97)' }, { transform: 'none' }], { duration: 520, easing: REVEAL.ease }); },
    reset() { cancelAnimationFrame(raf); raf = 0; x = 0; state = 'locked'; el.classList.add('is-locked'); el.classList.remove('is-done', 'is-held'); place(); },
  };
})();

// the deck title's last word flips through a few (after Brick's value-prop text flip on 60fps.design)
const flipWord = (() => {
  const box = $('.flipw'), WORDS = ['deals', 'steals', 'faves', 'gifts']; let i = 0, t = 0;
  function next() {
    if (!live || document.hidden || reduce.matches) return;
    const old = box.firstElementChild, nu = document.createElement('span'); i = (i + 1) % WORDS.length; nu.textContent = WORDS[i];
    box.appendChild(nu);
    const w0 = old.offsetWidth, w1 = nu.offsetWidth;
    box.animate([{ width: `${w0}px` }, { width: `${w1}px` }], { duration: 520, easing: REVEAL.ease });
    old.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: 'translateY(-70%)', opacity: 0, filter: 'blur(3px)' }], { duration: 320, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).onfinish = () => old.remove();
    nu.animate([{ transform: 'translateY(70%)', opacity: 0, filter: 'blur(3px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 560, easing: REVEAL.ease, delay: 60, fill: 'both' });
  }
  return {
    start() { clearInterval(t); t = setInterval(next, 2200); },
    reset() { clearInterval(t); i = 0; box.innerHTML = '<span>deals</span>'; },
  };
})();

// ─── like (after X's like animation / Duolingo's gem drop on 60fps.design) ──────────────────────────────────
// The heart on a grid card: it springs up and fills, a ring flashes out and eight bits burst away; tap again to unlike.
page.addEventListener('click', (e) => {
  const b = e.target.closest('.p-gc .lk'); if (!b) return;
  e.stopPropagation();
  const on = b.classList.toggle('is-on');
  b.classList.remove('pop'); void b.offsetWidth; if (on) b.classList.add('pop');
  if (!on) b.querySelector('svg').animate([{ transform: 'scale(1)' }, { transform: 'scale(.8)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
  H(on ? 'pop' : 'tick'); if (on) bot.lookAt(b, 700);
}, true);

// ─── the product sheet (after Plasma's offer card → bottom sheet on 60fps.design) ───────────────────────────
// Tap a grid card: the page dims and blurs, a sheet rises from the bottom and the card's photo flies from its place
// in the grid into the sheet (a shared element). Drag the sheet down, tap the backdrop or ✕ to close it — the photo
// flies back into its card. "Add to picks" sends it up to the bot.
const sheetUI = (() => {
  const el = document.createElement('div');
  el.className = 'p-sheet'; el.setAttribute('aria-hidden', 'true'); el.setAttribute('data-no-drag', '');   // (its own drag, not the page's)
  el.innerHTML = `<i class="scrim"></i><div class="panel"><i class="grab"></i><button class="x" type="button" aria-label="Close">${X_ICON}</button>
    <div class="ph"><img alt="" draggable="false"></div>
    <div class="body"><span class="sh-tag"></span><b class="sh-nm"></b><div class="sh-pr"><strong></strong><s></s></div>
      <p class="sh-note">Free delivery · Get it in 1 hr · 30-day returns</p>
      <div class="cta"><button class="add" type="button">${HEART}<span>Add to picks</span></button><button class="rem" type="button">${BELL}<span>Remind me</span></button></div></div></div>`;
  sheet.appendChild(el);
  const panel = el.querySelector('.panel'), ph = el.querySelector('.ph'), img = ph.querySelector('img'), scrim = el.querySelector('.scrim');
  let cur = null, open = false, drag = null, flyEl = null;
  const OPEN_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  function flight(fromR, toR, ms, after) {                                    // the photo, from one box to another
    flyEl && flyEl.remove();
    const sr = sheet.getBoundingClientRect(); flyEl = document.createElement('div'); flyEl.className = 'p-sheet-fly';
    flyEl.innerHTML = `<img src="${img.src}" alt="">`; flyEl.classList.toggle('cover', ph.classList.contains('cover'));
    Object.assign(flyEl.style, { left: `${toR.left - sr.left}px`, top: `${toR.top - sr.top}px`, width: `${toR.width}px`, height: `${toR.height}px` });
    sheet.appendChild(flyEl);
    const dx = fromR.left - toR.left, dy = fromR.top - toR.top, sx = fromR.width / toR.width, sy = fromR.height / toR.height;
    flyEl.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: '11px' }, { transform: 'none', borderRadius: '18px' }], { duration: ms, easing: OPEN_EASE, fill: 'both' })
      .onfinish = () => { after && after(); flyEl && flyEl.remove(); flyEl = null; };
  }
  function show(card) {
    const k = card.dataset.k, it = ITEM[k];
    cur = card; open = true;
    img.src = IMG(k); ph.classList.toggle('cover', !!it.cover);
    el.querySelector('.sh-tag').textContent = it.was ? `-${off(it)}% today` : 'Lowest price';
    el.querySelector('.sh-nm').textContent = it.name;
    el.querySelector('.sh-pr strong').innerHTML = `<i>${D}</i>${money(it.price)}`;
    el.querySelector('.sh-pr s').innerHTML = it.was ? `${D}${money(it.was)}` : '';
    el.classList.add('is-on'); el.setAttribute('aria-hidden', 'false'); scroller.style.overflow = 'hidden';
    panel.getAnimations().forEach((a) => a.cancel()); panel.style.transform = '';
    const from = card.querySelector('.ph').getBoundingClientRect(), to = ph.getBoundingClientRect();   // (the photo's place in the sheet, at rest)
    ph.style.visibility = 'hidden'; card.querySelector('.ph').style.visibility = 'hidden';
    panel.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 620, easing: OPEN_EASE });
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out', fill: 'both' });
    flight(from, to, 620, () => { ph.style.visibility = ''; });
    H('tap'); bot.lookAt(card, 900);
  }
  function hide(fast) {
    if (!open) return; open = false;
    const card = cur, back = card.querySelector('.ph');
    const to = back.getBoundingClientRect(), from = ph.getBoundingClientRect();
    const py = parseFloat((panel.style.transform.match(/translateY\(([-\d.]+)px/) || [0, 0])[1]);
    ph.style.visibility = 'hidden';
    panel.animate([{ transform: `translateY(${py}px)` }, { transform: 'translateY(100%)' }], { duration: fast ? 300 : 420, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
    scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease-in', fill: 'forwards' });
    // the photo flies back to its card
    const sr = sheet.getBoundingClientRect(); flyEl && flyEl.remove(); flyEl = document.createElement('div'); flyEl.className = 'p-sheet-fly';
    flyEl.innerHTML = `<img src="${img.src}" alt="">`; flyEl.classList.toggle('cover', ph.classList.contains('cover'));
    Object.assign(flyEl.style, { left: `${from.left - sr.left}px`, top: `${from.top - sr.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    sheet.appendChild(flyEl);
    flyEl.animate([{ transform: 'none', borderRadius: '18px' }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`, borderRadius: '11px' }],
      { duration: 480, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'forwards' }).onfinish = () => {
      back.style.visibility = ''; flyEl && flyEl.remove(); flyEl = null;
      el.classList.remove('is-on'); el.setAttribute('aria-hidden', 'true'); ph.style.visibility = '';
      panel.getAnimations().forEach((a) => a.cancel()); scrim.getAnimations().forEach((a) => a.cancel()); panel.style.transform = '';
    };
    scroller.style.overflow = '';
  }
  // opening: a tap on a grid card (not its heart)
  page.addEventListener('click', (e) => { const c = e.target.closest('.p-gc'); if (c && !e.target.closest('.lk') && !peek.swallow()) show(c); });
  scrim.addEventListener('click', () => hide());
  el.querySelector('.x').addEventListener('click', () => hide());
  el.querySelector('.add').addEventListener('click', () => {
    if (!cur) return; const k = cur.dataset.k;
    flyToBot(ph, () => picks.add({ img: k, bg: '#f4f5f8' })); H('success'); setTimeout(() => hide(true), 120);
  });
  el.querySelector('.rem').addEventListener('click', (e) => { const b = e.currentTarget; b.classList.toggle('is-on'); b.querySelector('span').textContent = b.classList.contains('is-on') ? 'Reminder set' : 'Remind me'; H('success'); });
  // drag it down to close
  panel.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { id: e.pointerId, y: e.clientY, v: 0, ly: e.clientY, lt: performance.now() }; try { panel.setPointerCapture(e.pointerId); } catch {} });
  panel.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const now = performance.now(), dy = e.clientY - drag.y; drag.v = 0.8 * ((e.clientY - drag.ly) / Math.max(1, now - drag.lt) * 1000) + 0.2 * drag.v; drag.ly = e.clientY; drag.lt = now;
    const y = dy > 0 ? dy : dy / (1 - dy / 60) * 0.3;                          // (pulling up: a little rubber band)
    panel.style.transform = `translateY(${y.toFixed(1)}px)`; scrim.style.opacity = String(Math.max(0.2, 1 - Math.max(0, dy) / 500));
  });
  const up = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; const dy = e.clientY - d.y;
    if (dy > 120 || d.v > 700) { hide(true); return; }
    const py = parseFloat((panel.style.transform.match(/translateY\(([-\d.]+)px/) || [0, 0])[1]);
    panel.style.transform = ''; scrim.style.opacity = '';
    panel.animate([{ transform: `translateY(${py}px)` }, { transform: 'none' }], { duration: 480, easing: OPEN_EASE });
  };
  panel.addEventListener('pointerup', up); panel.addEventListener('pointercancel', up);
  return { get open() { return open; }, close: () => hide(true), reset() { if (open) { open = false; el.classList.remove('is-on'); scroller.style.overflow = ''; $$('.p-gc .ph').forEach((p) => { p.style.visibility = ''; }); flyEl && flyEl.remove(); } } };
})();

// ─── the golden deal (after Binge's gyro glare, CRED's gold card and Apple Wallet's holographic pattern) ─────
// A gold card that tilts toward your finger (or the phone's tilt, where the browser allows it): a glare follows the
// light, a holographic sheen shifts colour with the angle. Left alone it sways a little so the light keeps moving.
const gold = (() => {
  const wrap = $('.p-gold'), card = wrap.querySelector('.card');
  let tx = 0, ty = 0, cx = 0, cy = 0, vx = 0, vy = 0, raf = 0, touching = false, t0 = performance.now(), gyro = null, visible = false;
  function step(now) {
    const idle = !touching && !gyro;
    const tgtX = idle ? Math.sin((now - t0) / 1600) * 0.35 : tx, tgtY = idle ? Math.cos((now - t0) / 2100) * 0.25 : ty;
    vx += ((tgtX - cx) * 0.09 - vx * 0.32); vy += ((tgtY - cy) * 0.09 - vy * 0.32); cx += vx; cy += vy;   // a soft spring to the target tilt
    card.style.transform = `rotateY(${(cx * 16).toFixed(2)}deg) rotateX(${(-cy * 14).toFixed(2)}deg)`;
    card.style.setProperty('--gx', `${(50 + cx * 46).toFixed(1)}%`); card.style.setProperty('--gy', `${(50 + cy * 46).toFixed(1)}%`);
    card.style.setProperty('--hue', `${(cx * 90 + cy * 60).toFixed(1)}deg`);
    raf = visible && live ? requestAnimationFrame(step) : 0;
  }
  const run = () => { if (!raf && visible && live) raf = requestAnimationFrame(step); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }, { root: scroller }).observe(wrap);
  const aim = (e) => { const r = card.getBoundingClientRect(); tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1); ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1); };
  card.addEventListener('pointerdown', (e) => {
    touching = true; aim(e); run(); H('tick');
    if (!gyro && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then((s) => { if (s === 'granted') listenGyro(); }).catch(() => {});
  });
  card.addEventListener('pointermove', (e) => { if (touching || e.pointerType === 'mouse') { if (e.pointerType === 'mouse') touching = true; aim(e); run(); } });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => card.addEventListener(t, () => { touching = false; }));
  function listenGyro() {
    addEventListener('deviceorientation', (e) => { if (e.beta == null) return; gyro = true; tx = clamp((e.gamma || 0) / 25, -1, 1); ty = clamp(((e.beta || 0) - 45) / 25, -1, 1); run(); });
  }
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') listenGyro();   // (Android: no permission needed)
  return { start: run };
})();

// ─── hold to grab (after Opal's hold-to-commit on 60fps.design) ─────────────────────────────────────────────
// Press and hold: a luminous fill runs across the button (ticks at each quarter); let go early and it drains back.
// Held to the end, it flashes, turns into "Grabbed!", and the golden deal flies up into the bot.
const hold = (() => {
  const btn = $('.p-hold'), fill = btn.querySelector('.fill');
  const MS = 1100; let p = 0, raf = 0, holding = false, done = false, last = 0, q = 0;
  const draw = () => { fill.style.transform = `scaleX(${p.toFixed(4)})`; btn.style.setProperty('--p', p.toFixed(3)); };
  function step(now) {
    const dt = now - last; last = now;
    if (holding) p = Math.min(1, p + dt / MS); else p = Math.max(0, p - dt / 260);
    const nq = Math.floor(p * 4); if (holding && nq > q && nq < 4) H('tick'); q = nq;
    draw();
    if (holding && p >= 1) { complete(); raf = 0; return; }
    raf = (holding || p > 0) ? requestAnimationFrame(step) : 0;
  }
  const go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
  function complete() {
    done = true; holding = false; btn.classList.add('is-done'); btn.classList.remove('is-holding');
    H('success'); bot.cheer();
    flyToBot($('.p-gold .ph'), () => picks.add({ img: DATA.low.img, bg: '#FFE89A' }));
    const pt = sheetPoint(btn); confetti.burst(pt.x, pt.y - 10, 34);
  }
  btn.addEventListener('pointerdown', (e) => { if (done || e.button) return; holding = true; q = Math.floor(p * 4); btn.classList.add('is-holding'); try { btn.setPointerCapture(e.pointerId); } catch {} H('tap'); go(); });
  const let_go = () => { if (!holding) return; holding = false; btn.classList.remove('is-holding'); go(); };
  btn.addEventListener('pointerup', let_go); btn.addEventListener('pointercancel', let_go);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  return { reset() { cancelAnimationFrame(raf); raf = 0; p = 0; q = 0; holding = false; done = false; btn.classList.remove('is-done', 'is-holding'); draw(); } };
})();

// ─── a toast (for quick actions): a pill rises from the bottom, holds, sinks ─────────────────────────────────
const toast = (() => {
  const el = document.createElement('div'); el.className = 'p-toast'; el.setAttribute('aria-live', 'polite'); sheet.appendChild(el);
  let t = 0;
  return (msg) => {
    el.innerHTML = `${CHECK}<span>${msg}</span>`; clearTimeout(t);
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([{ transform: 'translate(-50%, 24px) scale(.94)', opacity: 0 }, { transform: 'translate(-50%, 0) scale(1)', opacity: 1 }], { duration: 520, easing: REVEAL.ease, fill: 'forwards' });
    t = setTimeout(() => el.animate([{ transform: 'translate(-50%, 0)', opacity: 1 }, { transform: 'translate(-50%, 16px) scale(.96)', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }), 1700);
  };
})();

// ─── coachmark (after Revolut's feature-buttons coachmark pulse on 60fps.design) ────────────────────────────
// The first time the deck is up, a glowing ring walks over ✕, ♥ and ↺ while the line under the title says what each
// does. It bows out as soon as you touch the deck or a button, and the line goes back to normal.
const coach = (() => {
  const ring = $('.p-coach'), sub = $('[data-k="deckT"] p'), acts = $('.p-acts');
  const STEPS = [['.p-act.pass', 'Tap ✕ to pass on a deal'], ['.p-act.want', 'Tap ♥ and the bot keeps it for you'], ['.p-act.undo', 'Changed your mind? Undo it']];
  const BASE = 'Right to want it, left to pass';
  let t = 0, i = 0, on = false, done = false;
  function say(txt) {
    sub.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 160, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () => {
      sub.textContent = txt; sub.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: REVEAL.ease });
    };
  }
  function step() {
    if (!on) return;
    if (i >= STEPS.length) { stop(); return; }
    const [sel, txt] = STEPS[i++], b = $(sel), ar = acts.getBoundingClientRect(), r = b.getBoundingClientRect();
    ring.style.width = ring.style.height = `${r.width + 14}px`;
    ring.style.transform = `translate(${(r.left - ar.left - 7).toFixed(1)}px, ${(r.top - ar.top - 7).toFixed(1)}px)`;
    ring.classList.add('is-on'); say(txt); H('tick');
    t = setTimeout(step, 1900);
  }
  function stop() {
    if (!on) return; on = false; done = true; clearTimeout(t); ring.classList.remove('is-on');
    if (sub.textContent !== BASE) say(BASE);
  }
  ['pointerdown'].forEach((ev) => { $('.p-deck').addEventListener(ev, stop); acts.addEventListener(ev, stop); });
  return {
    start(delay) { if (done || reduce.matches) return; clearTimeout(t); t = setTimeout(() => { on = true; i = 0; ring.style.transition = 'none'; step(); requestAnimationFrame(() => { ring.style.transition = ''; }); }, delay); },
    reset() { clearTimeout(t); on = false; done = false; i = 0; ring.classList.remove('is-on'); sub.textContent = BASE; },
  };
})();

// ─── bundle & save dial (after Runmo's drag-to-adjust distance wheel on 60fps.design) ───────────────────────
// Drag round the ring: the knob follows your finger, the arc fills, the count in the middle rolls (1–6), the saving
// climbs and little faces of deals pop in for each item. A tick at each step; on release it settles on the nearest.
const dial = (() => {
  const el = $('.p-dial'), ring = el.querySelector('.ring'), arc = el.querySelector('.arc'), knob = el.querySelector('.knob');
  const nOd = odometer(el.querySelector('.n')), pctEl = el.querySelector('.pct'), amtOd = odometer(el.querySelector('.amt em')), avas = el.querySelector('.avas');
  const DISC = [0, 0, 5, 10, 15, 18, 20], AVG = 149, FACES = ['hero1', 'wish1', 'mega3', 'beauty1', 'hero0', 'home1'], MAXV = 6;
  let v = 1, g = null, raf = 0, lastN = 1;
  function draw() {
    const t = (v - 1) / (MAXV - 1) * (5 / 6);                                // 1 → top, 6 → five sixths round
    arc.style.strokeDasharray = `${(t * 100).toFixed(2)} 100`;
    const a = t * 2 * Math.PI - Math.PI / 2, R = 98 / 240 * ring.clientWidth, c = ring.clientWidth / 2;
    knob.style.transform = `translate(${(c + R * Math.cos(a)).toFixed(1)}px, ${(c + R * Math.sin(a)).toFixed(1)}px)`;
    const n = Math.round(v);
    if (n !== lastN) {
      lastN = n; H('tick');
      nOd.set(String(n)); el.querySelector('.mid small').textContent = n === 1 ? 'item' : 'items';
      pctEl.textContent = `${DISC[n]}%`; amtOd.set(String(Math.round(n * AVG * DISC[n] / 100)));
      pctEl.animate([{ transform: 'scale(1.15)' }, { transform: 'none' }], { duration: 420, easing: REVEAL.ease });
      faces(n);
    }
  }
  function faces(n) {
    const have = avas.children.length;
    for (let i = have; i < n; i++) {
      const f = document.createElement('i'); f.innerHTML = `<img src="${IMG(FACES[i])}" alt="" draggable="false">`; avas.appendChild(f);
      f.animate([{ transform: 'translateY(10px) scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(0.3, 1.25, 0.5, 1)' });
    }
    [...avas.children].slice(n).forEach((f) => { if (f.dataset.out) return; f.dataset.out = 1; f.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.4)', opacity: 0 }], { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }).onfinish = () => f.remove(); });
  }
  const angleV = (e) => {                                                     // finger → value, continuous across the top
    const r = ring.getBoundingClientRect(); let a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) + Math.PI / 2;
    if (a < 0) a += 2 * Math.PI;
    let t = a / (2 * Math.PI) / (5 / 6);
    if (t > 1.1) t = (g && g.v > 3.5) ? 1 : 0;                                   // (in the gap past 6: hold the nearer end)
    return 1 + clamp(t, 0, 1) * (MAXV - 1);
  };
  ring.addEventListener('pointerdown', (e) => {
    cancelAnimationFrame(raf); g = { id: e.pointerId, v };
    try { ring.setPointerCapture(e.pointerId); } catch {} el.classList.add('is-held');
    v = angleV(e); g.v = v; draw();
  });
  ring.addEventListener('pointermove', (e) => { if (!g || e.pointerId !== g.id) return; const nv = angleV(e); if (Math.abs(nv - g.v) < 3) { v = nv; g.v = nv; draw(); } });
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return; g = null; el.classList.remove('is-held');
    const to = Math.round(v), from = v, t0 = performance.now();
    const step = (now) => { const u = Math.min(1, (now - t0) / 360), k = 1 - Math.pow(1 - u, 3); v = from + (to - from) * k; draw(); if (u < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    if (to >= 3) { bot.lookAt(el, 800); }
  };
  ring.addEventListener('pointerup', up); ring.addEventListener('pointercancel', up);
  return { reset() { cancelAnimationFrame(raf); v = 1; lastN = 0; avas.innerHTML = ''; draw(); } };
})();

// ─── your rewards (after CRED's printing tickets + autopay bills stack on 60fps.design) ─────────────────────
// Every reward you win prints out of the slot — a ticket feeding out in little jolts — and drops onto the stack. The
// stack quietly cycles (the top ticket slips to the back) while you look; tap it and it fans out into a list, tap again
// to gather it up. Rewards won while the wallet's off screen wait and print as you scroll to it.
const wallet = (() => {
  const el = $('.p-wallet'), stack = el.querySelector('.stack');
  let list = [], open = false, queue = [], visible = false, cyc = 0, printing = false;
  const ticket = (r) => `<div class="tk" style="--c:${r.c}"><div class="stub"><b>${r.t.length > 9 ? '★' : r.t.replace(/ off$/, '')}</b><small>${r.t.length > 9 ? '' : /off$/.test(r.t) ? 'OFF' : ''}</small></div>
    <div class="info"><b>${r.t}</b><span>${r.s}</span><em>Valid till 11.11 · auto-applied</em></div></div>`;
  function layout(animate = true) {
    const kids = [...stack.children];
    kids.forEach((c, k) => {
      c.style.transition = animate ? 'transform .6s cubic-bezier(0.16, 1, 0.3, 1), opacity .35s ease' : 'none';
      c.style.zIndex = String(50 - k);
      if (open) { c.style.transform = `translate3d(0, ${k * 98}px, 0)`; c.style.opacity = 1; }
      else { c.style.transform = k <= 2 ? `translate3d(0, ${k * 12}px, 0) scale(${(1 - k * 0.05).toFixed(3)})` : 'translate3d(0, 24px, 0) scale(.9)'; c.style.opacity = k <= 2 ? 1 : 0; }
    });
    const h = open ? Math.max(1, kids.length) * 98 - 10 : 112;
    stack.animate([{ height: `${stack.offsetHeight}px` }, { height: `${h}px` }], { duration: 560, easing: REVEAL.ease }); stack.style.height = `${h}px`;
    el.classList.toggle('is-open', open);
  }
  function print(r) {
    printing = true;
    stack.insertAdjacentHTML('afterbegin', ticket(r)); const c = stack.firstElementChild; list.unshift(r);
    if (reduce.matches) { layout(false); printing = false; flush(); return; }
    c.style.transition = 'none'; c.style.zIndex = '60'; c.style.transform = 'translate3d(0, -104px, 0)';
    // feeding out of the slot in jolts, then dropping onto the stack
    c.animate([{ transform: 'translate3d(0, -104px, 0)' }, { transform: 'translate3d(0, -78px, 0)', offset: 0.18 }, { transform: 'translate3d(0, -78px, 0)', offset: 0.28 },
      { transform: 'translate3d(0, -50px, 0)', offset: 0.46 }, { transform: 'translate3d(0, -50px, 0)', offset: 0.56 }, { transform: 'translate3d(0, -20px, 0)', offset: 0.74 },
      { transform: 'translate3d(0, -14px, 0) rotate(-1.5deg)', offset: 0.84 }, { transform: 'translate3d(0, 0, 0)' }], { duration: 1150, easing: 'cubic-bezier(0.3, 0.6, 0.35, 1)' })
      .onfinish = () => { c.style.transform = 'none'; layout(); printing = false; setTimeout(flush, 250); };
    [0, 320, 640].forEach((d) => setTimeout(() => H('tick'), d));
    el.querySelector('.slot').animate([{ transform: 'none' }, { transform: 'translateY(1px)' }, { transform: 'none' }], { duration: 160, iterations: 4 });
    setTimeout(() => layout(), 900);
  }
  function flush() { if (!printing && visible && queue.length) print(queue.shift()); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting && live; flush(); }, { root: scroller, threshold: 0.35 }).observe(el);
  // the idle cycle: the top ticket slips to the back
  setInterval(() => {
    if (!visible || open || printing || stack.children.length < 2 || document.hidden || reduce.matches) return;
    const top = stack.firstElementChild;
    top.animate([{ transform: top.style.transform, opacity: 1 }, { opacity: 0, offset: 0.55 }, { transform: 'translate3d(0, -30px, 0) scale(.94)', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' })
      .onfinish = () => {
        stack.appendChild(top); list.push(list.shift());
        const k = stack.children.length - 1;                                    // (re-placed at the back while invisible…)
        top.style.transition = 'none'; top.style.opacity = 0; top.style.transform = k <= 2 ? `translate3d(0, ${k * 12}px, 0) scale(${(1 - k * 0.05).toFixed(3)})` : 'translate3d(0, 24px, 0) scale(.9)';
        top.getAnimations().forEach((a) => a.cancel()); void top.offsetWidth;
        layout();                                                               // (…then everything settles, and it fades in there)
      };
  }, 2800);
  stack.addEventListener('click', () => { if (printing) return; open = !open; layout(); H('tick'); });
  return {
    add(r) { queue.push(r); flush(); },
    reset() { open = false; queue = []; printing = false; list = []; stack.innerHTML = ''; stack.insertAdjacentHTML('beforeend', ticket({ t: 'Free delivery', s: 'Welcome to Yellow Friday', c: '#FEEE00' })); list.push({}); layout(false); },
  };
})();

// ─── long-press quick actions (after ChatGPT's long-press picker / Instagram's hold menu on 60fps.design) ───
// Press and hold a grid card: it lifts out of a blurred page and a menu of quick actions opens under it. Without
// lifting your finger, slide onto an action (each one you pass lights up, with a tick) and let go to do it — or let
// go anywhere, then tap one. Tap outside to put the card back.
const peek = (() => {
  const el = document.createElement('div'); el.className = 'p-peek'; el.setAttribute('data-no-drag', '');
  el.innerHTML = `<i class="scrim"></i><div class="lift"></div><div class="menu">
    <button type="button" data-a="like">${HEART}<span>Like</span></button><button type="button" data-a="remind">${BELL}<span>Remind me</span></button>
    <button type="button" data-a="add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>Add to picks</span></button>
    <button type="button" data-a="share"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Share</span></button></div>`;
  sheet.appendChild(el);
  const lift = el.querySelector('.lift'), menu = el.querySelector('.menu'), items = [...menu.children];
  let timer = 0, press = null, open = false, card = null, hot = null, swallowUntil = 0;
  function show(c) {
    open = true; card = c; swallowUntil = performance.now() + 600;
    const sr = sheet.getBoundingClientRect(), r = c.getBoundingClientRect();
    lift.innerHTML = ''; const cl = c.cloneNode(true); cl.hidden = false; cl.classList.remove('yf-press'); lift.appendChild(cl);
    Object.assign(lift.style, { left: `${r.left - sr.left}px`, top: `${r.top - sr.top}px`, width: `${r.width}px` });
    const below = r.bottom - sr.top + 196 < sr.height;                            // the menu goes under the card, or over it near the bottom
    menu.style.left = `${clamp(r.left - sr.left + r.width / 2 - 110, 12, sr.width - 232)}px`;
    menu.style.top = below ? `${r.bottom - sr.top + 12}px` : `${r.top - sr.top - 196}px`;
    menu.style.transformOrigin = below ? '50% 0' : '50% 100%';
    el.classList.add('is-on'); c.style.visibility = 'hidden'; scroller.style.overflow = 'hidden';
    lift.animate([{ transform: 'none' }, { transform: 'scale(1.06)' }], { duration: 420, easing: 'cubic-bezier(0.3, 1.3, 0.5, 1)', fill: 'forwards' });
    menu.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.22, 1.2, 0.36, 1)' });
    items.forEach((b, i) => b.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 60 + i * 40, easing: REVEAL.ease, fill: 'backwards' }));
    el.querySelector('.scrim').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'both' });
    H('snap'); bot.lookAt(c, 1400);
  }
  function hide() {
    if (!open) return; open = false;
    const c = card;
    lift.animate([{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'forwards' });
    menu.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.8)', opacity: 0 }], { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
    el.querySelector('.scrim').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = () => {
      el.classList.remove('is-on'); c.style.visibility = ''; [lift, menu, el.querySelector('.scrim')].forEach((x) => x.getAnimations().forEach((a) => a.cancel())); setHot(null);
    };
    scroller.style.overflow = '';
  }
  function setHot(b) { if (b === hot) return; hot && hot.classList.remove('is-hot'); hot = b; if (b) { b.classList.add('is-hot'); H('tick'); } }
  function act(a) {
    const c = card;
    if (a === 'like') { const lk = c.querySelector('.lk'); lk.click(); toast(lk.classList.contains('is-on') ? 'Liked' : 'Like removed'); }
    if (a === 'remind') { toast('We\'ll remind you when it drops'); H('success'); }
    if (a === 'add') { flyToBot(lift.querySelector('.ph'), () => picks.add({ img: c.dataset.k, bg: '#f4f5f8' })); H('success'); }
    if (a === 'share') { try { navigator.clipboard && navigator.clipboard.writeText(`https://www.noon.com/uae-en/ — ${ITEM[c.dataset.k].name}`); } catch {} toast('Link copied'); }
    hide();
  }
  page.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('.p-gc'); if (!c || e.target.closest('.lk') || e.button) return;
    press = { x: e.clientX, y: e.clientY, id: e.pointerId };
    clearTimeout(timer); timer = setTimeout(() => { if (press) show(c); }, 430);
  });
  addEventListener('pointermove', (e) => {
    if (press && !open && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 8) { clearTimeout(timer); press = null; }
    if (open && press && e.pointerId === press.id) { const b = document.elementFromPoint(e.clientX, e.clientY); setHot(b && b.closest('.p-peek .menu button')); }
  });
  addEventListener('pointerup', (e) => {
    clearTimeout(timer);
    if (open && press && e.pointerId === press.id && hot) { act(hot.dataset.a); }
    press = null;
  });
  addEventListener('pointercancel', () => { clearTimeout(timer); press = null; });
  scroller.addEventListener('touchmove', (e) => { if (open && e.cancelable) e.preventDefault(); }, { passive: false });
  page.addEventListener('contextmenu', (e) => { if (e.target.closest('.p-gc')) e.preventDefault(); });
  el.querySelector('.scrim').addEventListener('click', hide);
  items.forEach((b) => b.addEventListener('click', () => { if (open) act(b.dataset.a); }));
  return { swallow: () => open || performance.now() < swallowUntil, reset() { if (open) { open = false; el.classList.remove('is-on'); card && (card.style.visibility = ''); scroller.style.overflow = ''; } } };
})();

// ─── daily streak (after Duolingo's streak moments) ───────────────────────────────────────────────────────────
// Check in: the button presses and becomes "Checked in", today's dot fills with a pop and a ring, the flame jumps
// and throws sparks, the streak rolls from 2 to 3 and a 5% reward prints into your rewards. The flame flickers idly.
const streak = (() => {
  const el = $('.p-streak'), btn = el.querySelector('.go'), num = odometer(el.querySelector('.sn')), today = el.querySelector('.days .today'), fl = el.querySelector('.fl');
  let done = false;
  btn.addEventListener('click', () => {
    if (done) { fl.animate([{ transform: 'none' }, { transform: 'scale(1.12) rotate(-6deg)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.3, 1.3, 0.5, 1)' }); H('tick'); return; }
    done = true; el.classList.add('is-done'); btn.querySelector('span').textContent = 'Checked in';
    today.classList.add('on', 'pop');
    fl.classList.remove('jump'); void fl.offsetWidth; fl.classList.add('jump');
    setTimeout(() => num.set('3'), 180);
    el.querySelector('.sl').textContent = '5% off unlocked!';
    H('success'); bot.hop(1.2); bot.cheer(); bot.lookAt(el, 1000);
    wallet.add({ t: '5% off', s: 'Streak reward · day 3', c: '#FFB400' });
  });
  return { reset() { done = false; el.classList.remove('is-done'); btn.querySelector('span').textContent = 'Check in'; today.classList.remove('on', 'pop'); num.set('2', true); el.querySelector('.sl').textContent = 'Check in today for 5% off'; } };
})();

// ─── deals by day (after Revolut's select-plan tab scroll on 60fps.design) ──────────────────────────────────
// Swipe the pages (they snap) or tap a tab: the yellow pill under the tabs follows the scroll continuously — it
// slides and stretches between tabs as a page goes by — and each label brightens as its page comes in. A tick per page.
const days = (() => {
  const el = $('.p-days'), pager = el.querySelector('.pager'), pill = el.querySelector('.pill'), tabs = [...el.querySelectorAll('.seg button')];
  let page_ = 0;
  function sync() {
    const w = pager.clientWidth || 1, f = clamp(pager.scrollLeft / w, 0, tabs.length - 1), i = Math.floor(f), t = f - i, a = tabs[i], b = tabs[Math.min(tabs.length - 1, i + 1)];
    const x = a.offsetLeft + (b.offsetLeft - a.offsetLeft) * t, wd = a.offsetWidth + (b.offsetWidth - a.offsetWidth) * t;
    const stretch = 1 + Math.sin(t * Math.PI) * 0.18;                         // (it stretches a little mid-way, like it's being pulled)
    pill.style.transform = `translateX(${x.toFixed(1)}px) scaleX(${stretch.toFixed(3)})`; pill.style.width = `${wd.toFixed(1)}px`;
    tabs.forEach((tb, k) => tb.style.setProperty('--on', Math.max(0, 1 - Math.abs(f - k)).toFixed(3)));
    const np = Math.round(f); if (np !== page_) { page_ = np; H('tick'); }
  }
  pager.addEventListener('scroll', sync, { passive: true });
  tabs.forEach((tb, k) => tb.addEventListener('click', () => { pager.scrollTo({ left: k * pager.clientWidth, behavior: reduce.matches ? 'auto' : 'smooth' }); }));
  return { reset() { pager.scrollLeft = 0; page_ = 0; requestAnimationFrame(sync); } };
})();

// ─── add to bag (a button that morphs into a stepper) ───────────────────────────────────────────────────────
// The + on a budget card swells into a − n + stepper; the count rolls, the bag chip at the top bumps. Down to 0 it
// shrinks back into a +.
const bag = (() => {
  const chip = $('.bagchip'), chipN = odometer(chip.querySelector('b'));
  let total = 0;
  function bump() { chipN.set(String(total)); chip.classList.toggle('has', total > 0); chip.animate([{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(0.3, 1.3, 0.5, 1)' }); }
  page.addEventListener('click', (e) => {
    const b = e.target.closest('.p-bc .step button'); if (!b) return;
    e.stopPropagation();
    const st = b.parentElement; let n = +st.dataset.n; const em = st.querySelector('em');
    const d = b.classList.contains('pl') ? 1 : -1; if (n + d < 0 || n + d > 9) { st.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 200 }); H('error'); return; }
    n += d; total += d; st.dataset.n = n; st.classList.toggle('open', n > 0);
    em.textContent = n; em.animate([{ transform: `translateY(${d * 60}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: REVEAL.ease });
    H(d > 0 ? 'tick' : 'tap'); bump();
    if (d > 0 && n === 1) bot.lookAt(st, 700);
  });
  return { reset() { total = 0; chipN.set('0', true); chip.classList.remove('has'); $$('.p-bc .step').forEach((st) => { st.dataset.n = 0; st.classList.remove('open'); st.querySelector('em').textContent = '0'; }); } };
})();

// ─── scan my style (after Picky's card scan sort on 60fps.design) ───────────────────────────────────────────
// A stack of polaroids. Tap "Scan my style": a beam sweeps while the cards shuffle — the top one swivels out and
// tucks in at the back, again and again — then they deal out into a fan of three and your vibe appears under them.
const scan = (() => {
  const el = $('.p-scan'), deckEl = el.querySelector('.deck'), btn = el.querySelector('.go'), res = el.querySelector('.res');
  let cards = [...deckEl.querySelectorAll('.pol')], busy = false, t = 0;
  const STACK = (k) => `translate3d(${k * 2}px, ${k * -3}px, 0) rotate(var(--r))`;
  function stackUp(animate) { cards.forEach((c, k) => { c.style.transition = animate ? 'transform .5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'; c.style.zIndex = String(10 - k); c.style.transform = STACK(k); }); }
  function shuffleOnce() {
    const top = cards[0];
    top.animate([{ transform: top.style.transform }, { transform: 'translate3d(120px, -20px, 0) rotate(18deg)', offset: 0.45 }, { transform: STACK(cards.length - 1) }], { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    setTimeout(() => { top.style.zIndex = '0'; }, 140);
    cards.push(cards.shift()); setTimeout(() => stackUp(true), 150); H('tick');
  }
  function fan() {
    const pos = [[-96, 16, -9], [0, 0, 0], [96, 16, 9]];
    cards.forEach((c, k) => { c.style.transition = 'transform .7s cubic-bezier(0.22, 1.1, 0.36, 1), opacity .4s'; c.style.transform = k < 3 ? `translate3d(${pos[k][0]}px, ${pos[k][1]}px, 0) rotate(${pos[k][2]}deg) scale(.92)` : 'translate3d(0, 30px, 0) scale(.7)'; c.style.opacity = k < 3 ? 1 : 0; c.style.zIndex = String(k === 1 ? 12 : 11 - k); });
  }
  btn.addEventListener('click', () => {
    if (busy) return; busy = true; el.classList.remove('is-done'); el.classList.add('is-scanning'); btn.querySelector('span').textContent = 'Scanning your vibe…';
    cards.forEach((c) => { c.style.opacity = 1; }); stackUp(true);
    let n = 0; H('tap');
    t = setInterval(() => {
      if (++n > 7) {
        clearInterval(t); el.classList.remove('is-scanning'); el.classList.add('is-done'); fan();
        btn.querySelector('span').textContent = 'Scan again'; busy = false; H('success'); bot.cheer(); bot.lookAt(el, 1000);
        return;
      }
      shuffleOnce();
    }, 290);
  });
  return { reset() { clearInterval(t); busy = false; cards = [...deckEl.querySelectorAll('.pol')]; el.classList.remove('is-done', 'is-scanning'); btn.querySelector('span').textContent = 'Scan my style'; cards.forEach((c) => { c.style.opacity = 1; }); stackUp(false); } };
})();

// ─── trending near you (after Circle's splash bubbles pop on 60fps.design) ──────────────────────────────────
// A cluster of product bubbles breathing gently. Every so often one pops — shrinks away and comes back as another
// product — and a little badge says how many sold nearby. Tap one: it bounces, and you get the count.
const near = (() => {
  const el = $('.p-near'), bubbles_ = [...el.querySelectorAll('.nb')], badge = el.querySelector('.badge');
  let t = 0, next = bubbles_.length, visible = false;
  const sold = () => 6 + Math.floor(Math.random() * 40);
  function say(b, txt) {
    badge.textContent = txt;
    const r = b.offsetLeft + b.offsetWidth / 2, y = b.offsetTop;
    badge.style.left = `${clamp(r, 60, el.clientWidth - 60)}px`; badge.style.top = `${y - 8}px`;
    badge.getAnimations().forEach((a) => a.cancel());
    badge.animate([{ opacity: 0, transform: 'translate(-50%, 6px) scale(.8)' }, { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.18 }, { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.8 }, { opacity: 0, transform: 'translate(-50%, -6px) scale(.96)' }],
      { duration: 1800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
  }
  function pop() {
    if (!visible || !live || document.hidden || reduce.matches) return;
    const b = bubbles_[Math.floor(Math.random() * bubbles_.length)], img = b.querySelector('img');
    const inn = b.querySelector('.in');
    inn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: 0.25 }, { transform: 'scale(0)' }], { duration: 380, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' }).onfinish = () => {
      img.src = IMG(NEAR[next++ % NEAR.length]);
      inn.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.08)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(0.3, 0.8, 0.4, 1)', fill: 'forwards' });
      say(b, `${sold()} sold nearby`);
    };
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { root: scroller, threshold: 0.3 }).observe(el);
  t = setInterval(pop, 1500);
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.nb'); if (!b) return;
    b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.88)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(0.3, 0.8, 0.4, 1)' });
    say(b, `${sold()} people bought this today`); H('tick'); bot.lookAt(b, 800);
  });
  return { reset() { badge.getAnimations().forEach((a) => a.cancel()); } };
})();

// ─── rate your yellow friday ────────────────────────────────────────────────────────────────────────────────
// Slide a finger across the stars (or tap one): each star you reach pops in yellow with a tick, the face above
// changes its mind with you, the line says it in words. Let go on five and it celebrates.
const rate = (() => {
  const el = $('.p-rate'), stars = [...el.querySelectorAll('.stars i')], face = el.querySelector('.face span'), say = el.querySelector('.say'), row = el.querySelector('.stars');
  const FACES = ['🙂', '😕', '😐', '🙂', '😀', '🤩'], WORDS = ['Tap or slide to rate', 'Not great', 'It\'s okay', 'Pretty good', 'Loving it', 'Best sale ever!'];
  let v = 0, g = null;
  function set(n) {
    if (n === v) return;
    const up = n > v; v = n;
    stars.forEach((s, i) => {
      const on = i < n, was = s.classList.contains('on'); s.classList.toggle('on', on);
      if (on && !was) s.animate([{ transform: 'scale(.6) rotate(-20deg)' }, { transform: 'scale(1.25) rotate(8deg)', offset: 0.6 }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.3, 1, 0.5, 1)' });
    });
    face.animate([{ transform: 'scale(1)' }, { transform: `scale(.6) rotate(${up ? -14 : 14}deg)`, opacity: 0.2 }], { duration: 110, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () => {
      face.textContent = FACES[n]; face.animate([{ transform: 'scale(.6)', opacity: 0.2 }, { transform: 'scale(1.12)', offset: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(0.3, 1, 0.5, 1)' });
    };
    say.textContent = WORDS[n];
    H('tick');
  }
  const at = (x) => { const r = row.getBoundingClientRect(); return clamp(Math.ceil((x - r.left) / (r.width / 5)), 1, 5); };
  row.addEventListener('pointerdown', (e) => { g = { id: e.pointerId }; try { row.setPointerCapture(e.pointerId); } catch {} set(at(e.clientX)); });
  row.addEventListener('pointermove', (e) => { if (g && e.pointerId === g.id) set(at(e.clientX)); });
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return; g = null;
    if (v === 5) { const pt = sheetPoint(row); confetti.burst(pt.x, pt.y, 40); H('success'); bot.hop(1.3); bot.cheer(); } else bot.lookAt(row, 700);
  };
  row.addEventListener('pointerup', up); row.addEventListener('pointercancel', up);
  return { reset() { v = 0; stars.forEach((s) => s.classList.remove('on')); face.textContent = FACES[0]; say.textContent = WORDS[0]; } };
})();

// ─── off-screen calm: looping decorations pause while their section is out of view ─────────────────────────
const calm = new IntersectionObserver((ents) => ents.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { root: scroller, rootMargin: '120px 0px' });
$$('.p-tapes, .p-streak, .p-acts, .p-boxes, .p-near, .p-slide, .p-scan, .p-end, .p-title, .p-gold').forEach((el) => { el.classList.add('is-off'); calm.observe(el); });

// ─── the rest of the page ───────────────────────────────────────────────────────────────────────────────────
// Remind me: the bell rings, the product is sent up to the bot
page.addEventListener('click', (e) => {
  const b = e.target.closest('.yf-remind'); if (!b) return;
  const on = b.classList.toggle('is-on');
  b.querySelector('span').textContent = on ? 'Reminder set' : 'Remind me';
  H(on ? 'success' : 'tap');
  if (on && !reduce.matches) b.querySelector('svg').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-out' });
  if (on) flyToBot(b.closest('.yf-pc').querySelector('.ph'));
});
// the flash-deal countdown (03:14:19 when the page first opens)
const end = Date.now() + ((3 * 60 + 14) * 60 + 19) * 1000;
// a split-flap clock: on each change the top half of the old number folds down over the new one, and the new
// number's bottom half falls into place (a hinge shadow passes as it turns)
const tEls = { h: $('.flap[data-t="h"]'), m: $('.flap[data-t="m"]'), s: $('.flap[data-t="s"]') };
function flipTo(el, t) {
  const [top, bot_, ftop, fbot] = ['.top b', '.bot b', '.ftop b', '.fbot b'].map((q) => el.querySelector(q));
  const old = top.textContent; if (old === t) return;
  if (!live || reduce.matches) { top.textContent = bot_.textContent = ftop.textContent = fbot.textContent = t; return; }
  ftop.textContent = old; bot_.textContent = old; top.textContent = t; fbot.textContent = t;
  el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
  clearTimeout(el._t); el._t = setTimeout(() => { bot_.textContent = t; el.classList.remove('go'); }, 620);
}
const endT = $('.endt');
function tick() {
  const s = Math.max(0, Math.floor((end - Date.now()) / 1000)), v = { h: Math.floor(s / 3600), m: Math.floor(s / 60) % 60, s: s % 60 };
  for (const k of ['h', 'm', 's']) flipTo(tEls[k], String(v[k]).padStart(2, '0'));
  endT.textContent = ['h', 'm', 's'].map((k) => String(v[k]).padStart(2, '0')).join(':');
}
$('.p-end .top').addEventListener('click', () => { scroller.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' }); H('tap'); });
tick(); setInterval(tick, 1000);
// scrolling: the greeting drifts, the tapes run faster with the scroll's speed, the bot looks the way you're going
const heroEls = { hi: $('.p-hi'), date: $('.p-date'), tapes: $$('.tape .run') };
let lastY = 0, lastT = 0, tapeBoost = 0, tapeRaf = 0;
let tapeRate = 1;
function tapeSpeed() {
  tapeBoost *= 0.94;
  tapeRate += (1 + tapeBoost - tapeRate) * 0.12;                           // the rate eases toward the target: no lurch
  heroEls.tapes.forEach((r) => r.getAnimations().forEach((a) => { a.playbackRate = tapeRate; }));
  tapeRaf = Math.abs(tapeRate - 1) > 0.01 || tapeBoost > 0.02 ? requestAnimationFrame(tapeSpeed) : 0;
  if (!tapeRaf) { tapeRate = 1; heroEls.tapes.forEach((r) => r.getAnimations().forEach((a) => { a.playbackRate = 1; })); }
}
function onScroll() {
  const top = scroller.scrollTop, y = Math.min(top, 700), now = performance.now();
  heroEls.hi.style.translate = heroEls.date.style.translate = `0 ${(y * 0.3).toFixed(1)}px`;
  if (live && Math.abs(top - lastY) > 2 && top > 0) bot.look(0, top > lastY ? 0.22 : -0.1, 380);   // reading down / back up
  const v = Math.abs(top - lastY) / Math.max(8, now - lastT);
  tapeBoost = Math.min(3, Math.max(tapeBoost, v * 1.6)); if (!tapeRaf && tapeBoost > 0.02) tapeRaf = requestAnimationFrame(tapeSpeed);
  lastY = top; lastT = now;
  mini.update(top);
}
scroller.addEventListener('scroll', onScroll, { passive: true });
// the mini header: once the greeting has scrolled away, a black feathered top settles in with the page's name
const mini = (() => {
  const el = document.createElement('div');
  el.className = 'yf-mini'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="tt">Yellow Friday sale</div>';
  sheet.appendChild(el);
  let on = false;
  return {
    update(top) { const show = top > 150; if (show !== on) { on = show; el.classList.toggle('is-on', on); } },
    reset() { on = false; el.classList.remove('is-on'); },
  };
})();

// pull down at the top of the page to close it: the page lifts into the card it closes as and follows the finger
// (a little resistance); let go past 110 px (or with a flick) and it drops away, otherwise it springs back
(() => {
  let g = null, raf = 0;
  const rubber = (dy) => (dy <= 0 ? 0 : (dy * 0.92) / (1 + dy / 1100));
  const begin = (x, y, target) => {
    if (!window.orbi || !window.orbi.pageOpen || curating || scroller.scrollTop > 0) return;
    if (sheetUI.open || target.closest('button, .p-card, .p-bubbles, .track, .p-wheel .stage, .foil, .p-slide, .p-gold, .p-dial, .p-wallet, .p-days .pager, .p-rate .stars, .p-near')) return;   // (those have their own drags)
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
  const stop = () => {
    if (!g) return; const d = g; g = null; if (!d.on) return;
    if (d.py > 110 || d.v > 650) { window.orbi.release(true, Math.max(0, d.v)); return; }
    let py = d.py, v = 0, last = performance.now();                       // spring back (critically damped)
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); v += (-260 * py - 32 * v) * k; py += v * k; }
      if (py < 0.3 && Math.abs(v) < 5) { window.orbi.pull(0); return; }
      window.orbi.pull(py); raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  scroller.addEventListener('touchstart', (e) => { if (e.touches.length === 1) begin(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
  scroller.addEventListener('touchmove', (e) => { if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
  scroller.addEventListener('touchend', stop); scroller.addEventListener('touchcancel', stop);
  scroller.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && !e.button) begin(e.clientX, e.clientY, e.target); });
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') move(e.clientX, e.clientY, null); });
  addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse') stop(); });
})();
grid.reset(); deck.reset(); bubbles.reset(); budget.reset(); wheel.reset(); slide.reset(); dial.reset(); wallet.reset(); days.reset(); rate.reset(); document.fonts.ready.then(() => scratch.reset());

// ─── the curating beat ──────────────────────────────────────────────────────────────────────────────────────
// tap → the page zooms open (empty, dark) while the bot flies to the screen's centre and grows; "Curating for you"
// blurs up under it and shimmers while the bot looks around (its Working pose); then the line dissolves, the bot
// springs up to its corner beside "Hi Neha!" and the page reveals behind it.
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
  curFx.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', delay: reduce.matches ? 0 : 300, fill: 'both' });
  curate.getAnimations().forEach((a) => a.cancel());
  curate.animate([{ opacity: 0, transform: 'translateY(10px) scale(.96)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
    { duration: SMOOTH.ms, easing: SMOOTH.ease, delay: reduce.matches ? 0 : CURATE.textIn, fill: 'both' });
}
function curateEnd() {
  if (!curating) return;
  curating = false; clearTimeout(curateT);
  curate.getAnimations().forEach((a) => a.cancel());
  curate.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-6px) scale(.98)', filter: 'blur(6px)' }],
    { duration: 220, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' });
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

// ─── lifecycle: orbi/main.js fires orbi:page ────────────────────────────────────────────────────────────────
addEventListener('orbi:page', (e) => {
  if (e.detail === 'opening') { reset(); curateStart(); }
  else if (e.detail === 'landed' && curating) { window.orbi.setState('working'); curateT = setTimeout(curateEnd, CURATE.hold); }
  else if (e.detail === 'closing') { if (curating) { curateCancel(); window.orbi.setState('idle'); } }
  else if (e.detail === 'closed') { curateCancel(); reset(); }
});
// the dark page wants light status-bar content (applied only while the page is up)
(function ink() { if (window.orbi) window.orbi.statusInk(1); else requestAnimationFrame(ink); })();
window.yfPage = { reveal, reset, scroller };
