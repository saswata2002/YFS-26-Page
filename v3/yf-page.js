/* ══ Iteration 03 — the bot's full page, 1:1 with Figma Saswata 1544:61922 ("For you", 375 × 3624); built on iteration 02 (copy of 01, the Lottie bot). The notes below are from the earlier build it grew out of ═══
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
const A = (f) => `../f/${f}`;                    // this iteration's art
const F = (f) => A(`f7/${f}`);                // Figma 789:10090's exports
const G = (f) => A(`f8/${f}`);                // Figma 1520:59225's exports

// ─── iteration 03: Figma Saswata 1544:61922 "For you" (375 × 3624) ──────────────────────────────────────────────
// Every box at its Figma x / y (the art in ../f/f9/). Top to bottom: the sun-ray ground and the bot; "HEY NEHA," and
// "YOUR YELLOW FRIDAY GOT BETTER"; the coupons — the noon One ticket flat in the middle (its code, its live countdown),
// the bank offers either side turned away in perspective at 62 %; "TOP DEALS, PICKED JUST FOR YOU" and the deck (the
// front card with its red "Deal ends in" bar, two smaller copies behind it); the wavy edge; "LET'S RESTOCK, AT LOW
// PRICES" and the basics carousel ("Expires in" on the middle card); "See all basics"; "TIME TO RESTOCK" — four
// last-bought cards in a 2 × 2 grid — and "SEE ALL →"; "BEST DEALS, STRAIGHT FROM YOUR FAVS" with its category tabs
// and a row of products.
const G9 = (f) => A(`f9/${f}`);
const num = (v) => (v % 1 ? v.toFixed(2) : String(v));      // Figma: "16.20", "899" — no thousands comma
const pct = (it) => (it.off != null ? it.off : Math.floor((1 - it.price / it.was) * 100));
const DATA = {
  // the coupons, middle first: the noon One ticket, then Emirates Islamic 20 % (Figma: on the right) and tabby 25 % (left)
  coupons: [
    { kind: 'one', t1: '10% cashback', t2: 'with noon One', code: 'ONE', st: '#fff1a8', ends: 8 * 3600 + 12 * 60 + 40 },
    { t1b: '20% extra off', t1: `up to ${D}100`, t2: 'with Emirates Islamic cards', card: 'ei', tier: 'Platinum', code: 'EIB20', h0: '#3c60ca', h1: '#7ba6e4', strip: '#b3dbff', pill: '#d4dcec' },
    { t1b: '10% off', t1: `up to ${D}100`, t2: 'when you pay with tabby', card: 'tabby', code: 'TABBY10', h0: '#2b8871', h1: '#5fcaa4', strip: '#a5efcb', pill: '#cee9d7' },
  ],
  deck: [
    { src: G9('39ec9.png'), name: 'Apple MacBook Pro 16-inch,\nM4 Pro chip, 24GB RAM,\n512GB SSD, Space Black', price: 846, was: 1399, off: 60, rating: 4.5, save: 20, ship: 'Thu, 13 Nov', ends: 3 * 3600 + 20 * 60 + 10 },
    { src: G9('00ff6.png'), name: 'Apple Airpods Pro 2 Wireless Earbuds with MagSafe Charging Case', price: 899, was: 1399, off: 33, rating: 4.3, save: 25, ship: 'Thu, 13 Nov', ends: 2 * 3600 + 48 * 60 + 5 },
    { src: A('fy/df9f1.png'), name: 'Ninja Crispi 4 in 1 Air Fryer Cooking System 4.2L & 3.1 L Glass', price: 899, was: 1399, off: 33, rating: 4.3, save: 30, ship: 'Fri, 14 Nov', ends: 5 * 3600 + 2 * 60 + 44 },
    { img: 'deck1', name: 'Samsung Galaxy S26 Ultra Dual SIM Cobalt Violet 12GB RAM 256GB 5G', price: 3349, was: 5099, rating: 4.6, save: 50, ship: 'Thu, 13 Nov', ends: 1 * 3600 + 15 * 60 + 30 },
    { img: 'deck2', name: 'Hisense 7Kg Front Loading Washing Machine, 1200RPM, Steam Wash', price: 749, was: 999, rating: 4.4, save: 15, ship: 'Sat, 15 Nov', ends: 4 * 3600 + 40 * 60 + 12 },
    { img: 'deck3', name: 'Hawkins Futura 5L Hard Anodised Deep Kadhai with Steel Lid', price: 67, was: 204, rating: 4.5, save: 5, ship: 'Thu, 13 Nov', ends: 6 * 3600 + 5 * 60 + 9 },
    { img: 'deck4', name: 'FUJIFILM Instax Mini EVO Hybrid Instant Camera, Gentle Rose', price: 779, was: 999, rating: 4.2, save: 20, ship: 'Fri, 14 Nov', ends: 3 * 3600 + 58 * 60 + 41 },
  ],
  refill: [    // index 0 is the middle card, 1 to its right, the last to its left
    { src: G9('4716a.png'), name: 'Pampers Ultimate Comfort Pants Diapers Size 6 (16+kg) Super Saving Pack', price: 44.89, was: 74.01, off: 39, rating: 4.7, prev: 65 },
    { src: G9('2e34c.png'), name: 'MTR Dosa Mix, 200g', price: 2.7, was: 5.67, off: 52, rating: 2.0, prev: 4 },
    { src: A('fy/5e392.png'), name: 'Fine Facial Tissue 200 Sheets 2 Ply Pack of 10 White', price: 39.28, was: 59, off: 33, rating: 4.3, prev: 49 },
    { img: 'refill1', name: 'Persil Power Gel Liquid Laundry Detergent Deep Clean 4.8L', price: 41.7, was: 82.6, rating: 4.5, prev: 55 },
    { src: A('fy/d1e4f.png'), name: 'Fine Kitchen Towel 60 Sheets 3 Ply Pack of 12 Rolls White 26.5x21cm', price: 30.7, was: 39.19, off: 22, rating: 4.3, prev: 36 },
    { img: 'refill3', name: 'Fairy Lavender Dishwashing Liquid, 3X Grease Cutting Power', price: 12.9, was: 18.34, rating: 4.6, prev: 16 },
    { src: A('fy/c7a58.png'), name: 'Nescafe Classic Coffee Jar 190grams Single', price: 30.7, was: 39.19, off: 22, rating: 4.3, prev: 38 },
    { src: G9('c4463.png'), name: 'Gerber Organic NutriPuffs Raspberry & Banana, 35g', price: 16.2, was: 27.27, off: 41, rating: 4.3, prev: 21 },
  ],
  // "TIME TO RESTOCK" (1544:62382 …): the grid's four last-bought cards, at their Figma x / y
  grid: [[16.1, 2236], [194.1, 2236], [194.1, 2541], [17.1, 2541]].map(([x, y]) => ({ x, y, src: G9('f4887.png'), last: 'Last bought on 18 Nov', price: 75, was: 129, off: 44, rating: 4.7, qty: '500ml', unit: `${D}2.35/ml`, lower: 20 })),
  // "BEST DEALS, STRAIGHT FROM YOUR FAVS" (1544:62505): the row of products under the tabs
  best: [
    { src: G9('00ff6.png'), size: 122, name: 'Apple Airpods Pro 2 Wireless Earbuds', tag: 'Best Seller', ex: '3b16e', exw: 2.06 },
    { src: G9('1a4eb.png'), size: 142, name: 'Whirlpool 7 kg Magic Clean ', ad: true, ex: '55dab', exw: 3.29 },
    { src: G9('6648e.png'), size: 122, name: 'MAYNOS Suction Phone Case Mount', addOn: true, ex: '95048', exw: 2.06 },
  ],
  tabs: [['Electronics', '& Appliances', 94], ['Beauty', '&Skincare', 101], ['Electronics', '', 101], ['Electronics', '', 101], ['Electronics', '', 101], ['Electronics', '', 101], ['Electronics', '', 90]],
};
const SRC = (it) => it.src || A(`p/${it.img}.webp`);

// ─── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Figma's outline/heart (18 × 18), inline so it can fill
const HEART = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M16 6.54545C16 4.58735 14.3677 3 12.3542 3C10.8487 3 9.55633 3.88737 9 5.1536C8.44367 3.88737 7.15131 3 5.64583 3C3.6323 3 2 4.58735 2 6.54545C2 12.2344 9 16 9 16C9 16 16 12.2344 16 6.54545Z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const hms = (s) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((v) => String(v).padStart(2, '0'));
const cd = (s) => `<span data-cd="${s}">${hms(s).join(':')}</span>`;   // (a live countdown: yf-page.js ticks every [data-cd] each second)
// the nudge strips ("Nudges - PLP"): each line at Figma's own offset in its strip; the strip rolls one line every 2.6 s
// (the first again at the end, so it loops). `tops` rides on the strip for the ticker
const strip = (cls, lines, tops) => `<span class="ng ${cls}" aria-label="${lines[0][1]}"><span class="run" data-tops="${tops.join(',')}">${lines.map(([ic, t, k], i) => `<span class="${k || ''}" style="top:${tops[i]}px"><img src="${G9(ic)}" alt="" draggable="false"><b>${t}</b></span>`).join('')}</span></span>`;
const RF_NUDGE = (it) => strip('rf', [['84179.svg', `Prev bought at ${D}${it.prev}`, 'red'], ['34db5.svg', 'Free delivery'], ['45818.svg', 'Selling out fast'], ['8774b.svg', '5k+ units sold'], ['9a64f.svg', '#2 Bestseller'], ['66677.svg', 'Lowest price in 30 days'], ['84179.svg', `Prev bought at ${D}${it.prev}`, 'red']],
  [-0.33, 40.76, 75.01, 109.25, 143.49, 177.73, 211.97]);
const W_NUDGE = (it) => strip('wc', [['08708.svg', `${D}${it.lower} lower than last buy`, 'dk'], ['f5983.svg', 'Free delivery'], ['1cc12.svg', 'Selling out fast'], ['0ce6d.svg', '5k+ units sold'], ['9549f.svg', '#2 Bestseller'], ['3222a.svg', 'Lowest price in 30 days'], ['08708.svg', `${D}${it.lower} lower than last buy`, 'dk']],
  [0.4, 48, 88, 128, 168, 208, 248]);
const addBtn = (plus, cls = '') => `<button class="pc-add ${cls}" type="button" aria-label="Add to cart" aria-pressed="false"><img class="pl" src="${G9(plus)}" alt="" draggable="false"><span class="ok">${CHECK}</span></button>`;
const wishBtn = (cls = '') => `<button class="pc-wish ${cls}" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button>`;
// the deck's card (1544:62199, 233 wide): the red "Deal ends in" bar, the photo, the rating, +, ♡; name, the red price
// pill, the offers chip, supermall + the delivery date
const deckCard = (it, i) => `<div class="d3-dk" data-i="${i}"><div class="pc9 dk rv">
  <div class="bar"><img src="${G9('ee5e9.svg')}" alt="" draggable="false"><b>Deal ends in ${cd(it.ends)}</b></div>
  <div class="main"><div class="ph"><img src="${SRC(it)}" alt="" draggable="false"></div>
    <span class="rt"><img src="${G9('a64d1.svg')}" alt="" draggable="false"><b>${it.rating.toFixed(1)}</b></span>
    ${addBtn('39e01.svg')}<button class="pc-wish o" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button></div>
  <div class="dt">
    <p class="nm">${it.name}</p>
    <div class="pr"><b><i>${D}</i> ${num(it.price)}</b><s>${num(it.was)}</s><em>${pct(it)}%</em></div>
    <span class="off9">Save ${D}${it.save} with offers</span>
    <div class="sh"><span class="sm"><img class="a" src="${G9('b06a7.svg')}" alt="" draggable="false"><img class="b" src="${G9('98244.svg')}" alt="supermall" draggable="false"></span><b>${it.ship}</b></div>
  </div>
</div></div>`;
// the basics carousel's card (middle 1544:62296, 222 × 402; the sides 1544:62269 / 62332, 181 × 276): it morphs from
// one to the other as it moves (--k 0 → 1, yf-page.css) — the "Expires in" bar folds away, the rating leaves the photo
// for the line under the name (where the nudge line was), the type steps down
const refillCard = (it, i) => `<div class="d3-rslot" data-i="${i}"><div class="pc9 rf rv">
  <div class="bar"><b>Expires in ${cd(9600 + 600 * i + 10)}</b></div>
  <div class="main"><div class="ph"><img src="${SRC(it)}" alt="" draggable="false"></div>
    ${addBtn('2ed6e.svg')}${wishBtn()}
    <span class="rt on"><img src="${G9('538c8.svg')}" alt="" draggable="false"><b>${it.rating.toFixed(1)}</b></span></div>
  <div class="dt">
    <p class="nm">${it.name}</p>
    <div class="r2">${RF_NUDGE(it)}<span class="rt by"><img src="${G9('5bc43.svg')}" alt="" draggable="false"><b>${it.rating.toFixed(1)}</b></span></div>
    <div class="pr"><b><i>${D}</i> ${num(it.price)}</b><s>${num(it.was)}</s><em>${pct(it)}%</em></div>
    <img class="ex" src="${G9('2232f.svg')}" alt="express · Today" draggable="false">
  </div>
</div></div>`;
// "TIME TO RESTOCK"'s card (1544:62382, 166 × 295)
const gridCard = (it, i) => `<div class="d3-abs pc9 wc rv" data-k="wc${i}" style="left:${it.x}px;top:${it.y}px">
  <div class="main"><div class="ph"><img src="${it.src}" alt="" draggable="false"></div>
    <span class="rt"><img src="${G9('538c8.svg')}" alt="" draggable="false"><b>${it.rating.toFixed(1)}</b></span>
    <span class="lb">${it.last}</span></div>
  <b class="p1"><i>${D}</i>${it.price}</b><s class="p2"><i>${D}</i>${it.was}</s><em class="p3">${it.off}%</em>
  ${addBtn('2ed6e.svg')}
  <span class="qt"><b>${it.qty}</b><img src="${G9('7ae0d.svg')}" alt="" draggable="false"><b>${it.unit}</b></span>
  ${W_NUDGE(it)}
</div>`;
// "BEST DEALS"' product (1544:62506, 134 wide)
const skuCard = (it) => `<div class="pc9 sku9">
  <div class="main"><div class="ph" style="width:${it.size}px;height:${it.size}px"><img src="${it.src}" alt="" draggable="false"></div>
    <button class="pc-wish o" type="button" aria-label="Add to wishlist" aria-pressed="false">${HEART}</button>
    ${it.addOn ? addBtn('e4d22.svg', 'blue') : addBtn('93b8e.svg')}
    ${it.tag ? `<span class="tg">${it.tag}</span>` : ''}${it.ad ? '<span class="adt">Ad</span>' : ''}</div>
  <div class="dt">
    <p class="nm">${it.name}</p>
    <span class="rt"><img src="${G9('10bd8.svg')}" alt="" draggable="false"><b>4.3 </b><i>(128)</i></span>
    <div class="p1"><b><i>${D}</i>109</b><span class="bp"><img src="${G9('a94c6.svg')}" alt="" draggable="false">Best price</span></div>
    <div class="p2"><b><i>${D}</i>129</b><s><i>${D}</i><u>299</u></s><em>33%</em></div>
    <img class="ex" src="${G9(it.ex + '.svg')}" alt="express" draggable="false" style="width:${(97 * (1 - it.exw / 100)).toFixed(2)}px">
  </div>
</div>`;
// a sticker heading: its words (and the ribbon behind them, if it has one) placed by their centres, tipped as in Figma;
// it reveals as one piece. words: [text, cls, cx, cy, deg] — cls: a (white 36), g (gradient 40), w (white 40), c (black sub)
const wd = ([t, cls, cx, cy, deg, extra = '']) => `<span class="w ${cls}" style="left:${cx}px;top:${cy}px;transform:translate(-50%,-50%) rotate(${deg}deg)"><b data-t="${t}"${extra}><span>${t}</span></b></span>`;
const heading9 = (k, ribbon, words, cls, [y0, h]) => `<div class="d3-abs h9 ${cls} rv" data-k="${k}" style="top:${y0}px;height:${h}px"><i class="in" style="top:${-y0}px">${ribbon || ''}${words.map(wd).join('')}</i></div>`;
const rib = (src, l, t, w, h, wrap) => (wrap
  ? `<i class="rbw" style="left:${wrap[0]}px;top:${wrap[1]}px;width:${wrap[2]}px;height:${wrap[3]}px;transform:translate(-50%,-50%) rotate(${wrap[4]}deg)"><img class="rb" src="${G9(src)}" alt="" draggable="false" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px"></i>`
  : `<img class="rb" src="${G9(src)}" alt="" draggable="false" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px">`);
// a decoration at Figma's wrapper box [left, top, w, h]; the art [w, h] inside it with its tilt / flip; `loop` = beat / twinkle
const dec = (k, src, [l, t, w, h], [iw, ih, tf = 'none'], loop, d = 0) => `<span class="d3-abs f5-dec${loop ? ` ${loop}` : ''}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px${d ? `;animation-delay:${d}s` : ''}"><i class="t" style="width:${iw}px;height:${ih}px;transform:${tf}"><img class="rv" data-k="${k}" src="${src}" alt="" draggable="false"></i></span>`;
// a coupon: the bank offers are the earlier iterations' gift coupon (180 × 276); the middle one is noon One's ticket
// (1544:61942, 196 × 275) — its stamp-edged ticket, the One logo, the offer, the "ONE" code pill (copy), the tear line
// with "ends in" and the live HRS : MINS : SECS. Collected (a tap on the middle one, or on its code): it flips to its back
const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" pathLength="1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BANK = {
  ei: (c) => `<i class="chip"></i><img class="lg" src="${G('c31f9.png')}" alt="Emirates Islamic" draggable="false"><b class="visa">VISA</b><em class="tier">${c.tier}</em>`,
  tabby: () => `<img class="tb" src="${A('p/logo-tabby.png')}" alt="tabby" draggable="false"><span class="split">Split in 4. No interest.</span>`,
};
const TICKET = 'M15 .5H165A14.5 14.5 0 0 1 179.5 15V155A10 10 0 0 0 179.5 175V261A14.5 14.5 0 0 1 165 275.5H15A14.5 14.5 0 0 1 .5 261V175A10 10 0 0 0 .5 155V15A14.5 14.5 0 0 1 15 .5Z';
const backOf = (c) => `<div class="back" aria-hidden="true"><i class="ck">${TICK}</i><b>Code copied</b><span class="cd">${c.code}</span><em>Applied at checkout</em></div>`;
const tile = (v, l, k) => `<span class="tl"><b data-cdp="${k}">${v}</b><i>${l}</i></span>`;
const oneFace = (c) => {
  const [h, m, s] = hms(c.ends);
  return `<div class="face">
    <img class="stamp" src="${G9('c1e87.svg')}" alt="" draggable="false">
    <img class="logo" src="${G9('28c05.svg')}" alt="noon One" draggable="false">
    <p class="t1">${c.t1}</p><p class="t2">${c.t2}</p>
    <span class="code" role="button" aria-label="Copy code ONE"><b>${c.code}</b><img src="${G9('fcae2.svg')}" alt="" draggable="false"></span>
    <img class="perf" src="${G9('01779.svg')}" alt="" draggable="false">
    <span class="lbl">ends in</span>
    <span class="cdn" data-cdt="${c.ends}">${tile(h, 'HRS', 'h')}<i class="co">:</i>${tile(m, 'MINS', 'm')}<i class="co">:</i>${tile(s, 'SECS', 's')}</span>
  </div>`;
};
const coupon = (c, i) => (c.kind === 'one'
  ? `<div class="d3-cslot one" data-i="${i}" data-o="${i % DATA.coupons.length}" data-w="196" data-h="275"><div class="gc one rv" style="--st:${c.st}" role="button" aria-label="${c.t1} ${c.t2}">${oneFace(c)}${backOf(c)}</div></div>`
  : `<div class="d3-cslot" data-i="${i}" data-o="${i % DATA.coupons.length}" data-w="180" data-h="276"><div class="gc bk rv" style="--h0:${c.h0};--h1:${c.h1};--st:${c.strip};--pill:${c.pill}" role="button" aria-label="${c.t1b} ${c.t1.replace(D, 'AED ')} ${c.t2}">
  <div class="face">
    <svg class="tk" viewBox="0 0 180 276" aria-hidden="true"><path d="${TICKET}"/></svg>
    <div class="holo"><i class="grad"></i><img class="rays" src="${G('9a150.png')}" alt="" draggable="false"><div class="bank ${c.card}">${BANK[c.card](c)}</div></div>
    <i class="tear"></i>
    <p class="t1"><b>${c.t1b}</b> ${c.t1}</p><p class="t2">${c.t2}</p>
    <p class="exp"><span>EXPIRES ON <b>12/11/2026</b></span></p>
  </div>
  ${backOf(c)}
</div></div>`);

const scroller = document.createElement('div');
scroller.className = 'yf-scroll d3-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="d3 f9" data-node-id="1544:61922">
  <img class="d3-abs f9-bg rv" data-k="bg" src="${G9('5c7e9.svg')}" alt="" draggable="false">
  <img class="d3-abs f9-sun rv" data-k="sun" src="${G9('c61f0.svg')}" alt="" draggable="false">
  ${heading9('h', '', [['HEY', 'a', 137.95, 204.6, -3, ' style="line-height:45.611px"'], ['NEHA,', 'g n1', 237.8, 197.65, -3, ' style="line-height:48px"']], 'hn', [160, 80])}
  <div class="d3-abs f9-subw rv" data-k="hs"><p class="f9-sub" style="left:191.7px;top:16.75px">YOUR YELLOW FRIDAY GOT BETTER</p></div>
  <div class="d3-abs d3-coupons" data-no-drag aria-roledescription="carousel" aria-label="Coupons">${[...DATA.coupons, ...DATA.coupons].map(coupon).join('')}</div>
  ${heading9('t', rib('eb163.svg', 57.23, 659.96, 249.97, 74.95), [['TOP DEALS,', 'a', 187.3, 670.35, -1.64, ' style="line-height:45.611px"'], ['PICKED JUST FOR YOU', 'c', 179.95, 705.25, -0.37, ' style="font-size:21px;line-height:20px"']], 'td', [630, 110])}
  ${dec('tx', G9('7709b.svg'), [-5.63, 666.38, 35.254, 47.099], [30.374, 43.874, 'scaleY(-1) rotate(173.34deg)'], 'hb')}
  ${dec('tx', G9('d8127.svg'), [326.79, 649.01, 57.054, 67.936], [40.087, 57.904, 'rotate(19.41deg)'], 'hb', -0.9)}
  <div class="d3-abs d3-deck" data-no-drag aria-roledescription="carousel" aria-label="Top deals">${DATA.deck.map(deckCard).join('')}</div>
  <img class="d3-abs f9-wave" src="${G9('63203.svg')}" alt="" draggable="false">
  ${heading9('r', rib('986ac.svg', 88.84, 1380.98, 192.13, 74.68), [['LET’S', 'a', 91.75, 1393.05, -3, ' style="line-height:45.611px"'], ['RESTOCK,', 'wb', 235.45, 1382.65, -3, ' style="line-height:48px"'], ['AT LOW PRICES', 'c', 184.35, 1424.25, -2.5, ' style="font-size:21px;line-height:20px"']], 'rs', [1345, 115])}
  <div class="d3-abs d3-refill" data-k="refill" data-no-drag aria-roledescription="carousel" aria-label="Restock at low prices">${DATA.refill.map(refillCard).join('')}</div>
  <button class="d3-abs f5-cta sb rv" data-k="cta" type="button"><i class="sh"><i class="s1"></i><i class="s2"></i></i><b>See all basics</b></button>
  ${heading9('w', rib('ede65.svg', -7.353, -8.043, 355.06, 87.675, [186.1, 2155, 342, 70, -2.07]), [['TIME TO', 'a', 92.9, 2130.55, -3, ' style="line-height:38px"'], ['RESTOCK,', 'g n2', 264.4, 2120.05, -3, ' style="line-height:40px"'], ['YOUR ESSENTIAL AT ALL TIME LOW', 'c', 185.35, 2164.2, -3.24]], 'wt', [2085, 120])}
  ${DATA.grid.map(gridCard).join('')}
  <img class="d3-abs f9-arc rv" data-k="warc" src="${G9('2a32c.svg')}" alt="" draggable="false">
  <button class="d3-abs f5-cta sa rv" data-k="wcta" type="button"><b>SEE ALL  →</b></button>
  <div class="d3-abs f9-best" data-node-id="1544:62490">
    ${heading9('b', rib('329c8.svg', 33.14, 24.52, 309.07, 87.08), [['BEST', 'a', 131.25, 45.45, -3, ' style="line-height:38px"'], ['DEALS,', 'a d6', 242.85, 38.5, -3, ' style="line-height:40px"'], ['STRAIGHT FROM YOUR FAVS', 'c', 185.2, 77.6, -2.5]], 'bd', [0, 100])}
    ${dec('bx', G9('05228.svg'), [313.87, 42.99, 40.204, 37.419], [36, 34.727, 'rotate(-8deg)'], 'hb')}
    ${dec('bx', G9('1984d.svg'), [9.87, 24, 26, 26], [26, 26], 'sp')}
    <div class="tabs9 rv" data-k="btabs" role="tablist" aria-label="Categories">${DATA.tabs.map(([a, b, w], i) => `<button class="tb9${i === 0 ? ' on' : ''}" type="button" role="tab" aria-selected="${i === 0}" style="width:${w}px"><img src="${G9(i === 0 ? '2c213.svg' : i < 4 ? '74d4b.svg' : 'c3176.svg')}" alt="" draggable="false"><span>${a}${b ? `<br>${b}` : ''}</span></button>`).join('')}<i class="ul" aria-hidden="true"></i></div>
    <div class="skus rv" data-k="bsku">${DATA.best.map(skuCard).join('')}</div>
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
  bg: [0, 'scale(1.04)', 'bg', 0], sun: [0, 'translateY(24px)', 'bg', 0],
  h: [0, 'translateY(14px) scale(.96)', 'hey', 0], hs: [140, 'translateY(10px)', 'hey', 140],
  cp1: [300, 'translateY(30px) scale(.96)', 'coupons', 0], cp0: [470, 'translateX(46px) scale(.94)', 'coupons', 170], cp2: [470, 'translateX(-46px) scale(.94)', 'coupons', 170],
  t: [640, 'translateY(14px) scale(.96)', 'top', 0], tx: [840, 'scale(.4)', 'top', 200],
  deck: [940, 'translateY(56px) scale(.96)', 'deck', 0],
  r: [1100, 'translateY(14px) scale(.96)', 'restock', 0],
  refill: [1280, null, 'refill', 0],
  cta: [1440, 'translateY(16px) scale(.97)', 'cta', 0],
  w: [1560, 'translateY(14px) scale(.96)', 'grid', 0],
  wc0: [1620, 'translateY(20px)', 'grid1', 0], wc1: [1680, 'translateY(20px)', 'grid1', 60],
  wc3: [1740, 'translateY(20px)', 'grid2', 0], wc2: [1800, 'translateY(20px)', 'grid2', 60],
  warc: [1860, 'translateY(10px)', 'wcta', 0], wcta: [1860, 'translateY(16px) scale(.97)', 'wcta', 60],
  b: [1920, 'translateY(14px) scale(.96)', 'best', 0], bx: [2120, 'scale(.4)', 'best', 200],
  btabs: [2000, 'translateY(12px)', 'best', 100], bsku: [2060, 'translateY(16px)', 'best', 180],
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
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;margin:0;visibility:hidden;display:block';
    page.appendChild(probe);
    const SPEC = { dk: [210, 14.809, 20.096, -0.0899], rf: [198, 14, 20, -0.1], sku9: [126, 14, 18, -0.14] };   // (as the front / middle card lays it out)
    $$('.pc9 .nm').forEach((el) => {
      const full = el.dataset.full || el.textContent, kind = ['dk', 'rf', 'sku9'].find((k) => el.closest('.pc9').classList.contains(k));
      const [w, fs, lh, ls] = SPEC[kind];
      el.dataset.full = full; el.title = full;
      probe.style.whiteSpace = kind === 'dk' ? 'pre-line' : 'normal'; probe.style.width = `${w}px`; probe.style.font = `500 ${fs}px/${lh}px ${getComputedStyle(el).fontFamily}`; probe.style.letterSpacing = `${ls}px`;
      const max = 2 * lh + 1, fits = (t) => { probe.textContent = t; return probe.offsetHeight <= max; };
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
  nudges.start(); clocks.start();
}
// gone back out through the bottom of the screen (the user scrolled back up past it)
const belowView = (e) => e.rootBounds && e.boundingClientRect.bottom > e.rootBounds.bottom;
function revealWithBot(items) {
  const sr = sheet.getBoundingClientRect(), VH = scroller.clientHeight || 812;
  const boxOf = (el) => (el.getBoundingClientRect().height > 0 ? el : el.querySelector('.w, p, img') || el);
  const anchorOf = (g, el) => (g === 'deck' ? $('.d3-deck .d3-dk.is-top') : g === 'refill' ? $('.d3-refill') : g === 'coupons' ? $('.d3-coupons') : boxOf(el));
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
  // (a block that sits under the bot's resting spot — HEY NEHA, right under it — never gets "cleared": it starts as the
  // bot comes in to land, within 40 px of its spot, so the page never sits empty while the bot settles; 600 ms at most)
  const t0 = performance.now(), HALF = 1.2, CLEAR = 10, GAP = 70, NEAR = 40, rest = window.orbi.pageSpot;
  let last = -1e9;
  const tick = () => {
    if (!live || !window.orbi.pageOpen) return;
    const now = performance.now(), v = window.orbi.view, bottom = v.cy + v.unit * HALF + CLEAR;
    const landing = Math.abs(v.cy - rest.cy) < NEAR && Math.abs(v.cx - rest.cx) < NEAR;
    if (seq.length && now - last >= GAP && (seq[0].y > bottom || landing || now - t0 > 600)) { play(seq.shift()); last = now; }
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
  { const t = $('.f9-best .tabs9'), bs = [...t.querySelectorAll('.tb9')], ul = t.querySelector('.ul');   // (the tabs back to the first)
    bs.forEach((b, i) => { b.classList.toggle('on', !i); b.setAttribute('aria-selected', String(!i)); });
    ul.style.transform = `translate3d(${bs[0].offsetLeft}px,0,0)`; ul.style.width = `${bs[0].offsetWidth}px`; t.scrollLeft = 0; $('.f9-best .skus').scrollLeft = 0; }
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
  const el = e.target.closest('.d3-cslot, .d3-dk, .d3-rslot, .f5-cta, .pc9, .tb9'); if (!el || !window.orbi) return;
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
  if (on) flyToBot(b.closest('.pc9, .pc').querySelector('.main'));
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
$('.f5-cta.sa').addEventListener('click', () => { H('tap'); bot.cheer(); bot.hop(1.2); });
// (the One ticket's code pill is part of the middle coupon: a tap on it copies the code, as a tap anywhere on it does)
// "BEST DEALS"' tabs: the black underline slides to the tapped one (the MOVE spring), its label goes black; the row of
// products re-deals (a soft stagger in)
(() => {
  const tabs = $('.f9-best .tabs9'), btns = [...tabs.querySelectorAll('.tb9')], ul = tabs.querySelector('.ul');
  const put = (b, anim) => {
    const x = b.offsetLeft, w = b.offsetWidth;
    if (anim && !reduce.matches) {
      const cs = getComputedStyle(ul);
      ul.animate([{ transform: cs.transform, width: cs.width }, { transform: `translate3d(${x}px,0,0)`, width: `${w}px` }],
        { duration: 544, easing: 'linear(0, 0.0703, 0.2268, 0.4093, 0.5803, 0.7206, 0.8248, 0.8962, 0.9419, 0.9693, 0.9848, 0.9929, 0.9969, 0.9988, 0.9996, 1)' });
    }
    ul.style.transform = `translate3d(${x}px,0,0)`; ul.style.width = `${w}px`;
  };
  requestAnimationFrame(() => put(btns[0], false));
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.tb9'); if (!b || b.classList.contains('on')) return;
    btns.forEach((t) => { const on = t === b; t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on)); });
    put(b, true); H('tick');
    const r = b.offsetLeft + b.offsetWidth - tabs.clientWidth + 12, l = b.offsetLeft - 12;
    if (r > tabs.scrollLeft) tabs.scrollTo({ left: r, behavior: reduce.matches ? 'auto' : 'smooth' });
    else if (l < tabs.scrollLeft) tabs.scrollTo({ left: l, behavior: reduce.matches ? 'auto' : 'smooth' });
    if (!reduce.matches) $$('.f9-best .pc9.sku9').forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 60 * i, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }));
  });
})();
// the live countdowns: every [data-cd] (h:m:s) and the One ticket's tiles tick once a second while the page is up
const clocks = (() => {
  const els = $$('[data-cd]').map((el) => ({ el, s: +el.dataset.cd }));
  const tiles = $$('[data-cdt]').map((el) => ({ el, s: +el.dataset.cdt, b: ['h', 'm', 's'].map((k) => el.querySelector(`[data-cdp="${k}"]`)) }));
  let t = 0;
  const tick = () => {
    els.forEach((c) => { c.s = Math.max(0, c.s - 1); c.el.textContent = hms(c.s).join(':'); });
    tiles.forEach((c) => { c.s = Math.max(0, c.s - 1); hms(c.s).forEach((v, i) => { if (c.b[i].textContent !== v) c.b[i].textContent = v; }); });
  };
  return { start() { clearInterval(t); t = setInterval(() => { if (!document.hidden) tick(); }, 1000); }, stop() { clearInterval(t); } };
})();
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
  // the bot's dock, mapped to the scroll: over the first 320 px of scroll it glides from its spot at the top centre to
  // the top-right corner — level with the ✕ (both centred at y 85) — shrinking as it goes, on a smootherstep of the
  // scroll position (slow off the top, slow into the corner). It follows that position through a critically damped
  // spring (ω 14, no overshoot), so a flick never throws it across and it eases into place; scroll back up and it
  // retraces the same path, landing exactly on its spot at the top
  const CORNER = { cx: 336, cy: 85, unit: 17 }, D = 320, W = 14;
  let on = false, cur = 0, vel = 0, goal = 0, raf = 0, last = 0;
  const place = () => {
    const A = window.orbi.pageSpot, e = cur;
    window.orbi.stage({ cx: A.cx + (CORNER.cx - A.cx) * e, cy: A.cy + (CORNER.cy - A.cy) * e, unit: A.unit + (CORNER.unit - A.unit) * e }, { snap: true });
  };
  const home = () => {                                         // (glued onto its spot, then handed back — pull-to-close needs it unstaged)
    on = false; window.orbi.stage({ ...window.orbi.pageSpot }, { snap: true });
    requestAnimationFrame(() => requestAnimationFrame(() => { if (!on) window.orbi.stage(null); }));
  };
  const step = (now) => {
    raf = 0;
    if (!live || curating || !window.orbi || !window.orbi.pageOpen) return;
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); vel += (W * W * (goal - cur) - 2 * W * vel) * k; cur += vel * k; }
    if (Math.abs(goal - cur) < 0.0004 && Math.abs(vel) < 0.003) { cur = goal; vel = 0; }
    if (goal === 0 && cur <= 0.0004) { cur = 0; vel = 0; if (on) home(); return; }
    on = true; place();
    if (cur !== goal || vel) raf = requestAnimationFrame(step);
  };
  return {
    update(top) {
      if (!live || curating || !window.orbi || !window.orbi.pageOpen) return;
      const u = Math.max(0, Math.min(1, top / D)); goal = u * u * u * (u * (u * 6 - 15) + 10);
      if (!raf && (goal !== cur || vel)) { last = performance.now(); raf = requestAnimationFrame(step); }
    },
    reset() { cancelAnimationFrame(raf); raf = 0; on = false; cur = vel = goal = 0; },
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
  const stage = $('.d3-coupons'), slots = [...stage.querySelectorAll('.d3-cslot')], N = slots.length;
  // iteration 03 (the stage at y 280): the One ticket flat at Figma's (88, 284.7), 196 × 275; a bank coupon (180 × 276)
  // flat on the same centre; either side, the coupon turned away — the quad of Figma's side PNGs (1544:62360 / 62361,
  // fitted to their edges: the near edge 195 tall at x 57.1 / 317.4, the far edge 138 tall off the screen's edge)
  const size = (el) => [+el.dataset.w, +el.dataset.h];
  const FLAT = (el) => { const [w, h] = size(el), x = 186 - w / 2, y = 142.2 - h / 2; return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; };
  const SIDE_R = [[317.4, 49.2], [393.5, 78.1], [393.5, 215.6], [317.4, 244.5]];             // (right: near edge first)
  const SIDE_L = [[-19, 78.1], [57.1, 49.2], [57.1, 244.6], [-19, 215.7]];
  const lerpQ = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const quad = (d, el) => {
    const a = Math.abs(d), side = d > 0 ? SIDE_R : SIDE_L;
    if (a <= 1) return lerpQ(FLAT(el), side, a);
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
      el.style.transform = m3d(quad(d, el), ...size(el));
      el.style.setProperty('--k', Math.min(1, a).toFixed(3));   // (the bank card turns see-through towards the side, yf-page.css)
      el.style.opacity = a <= 1 ? (1 - 0.38 * a).toFixed(3) : Math.max(0, 0.62 * (2 - a)).toFixed(3);   // Figma: the side coupons at 62 %
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
    { x: -0.55, y: -13, r: 0, s: 0.8708, b: 0, o: 1, g: 0 },           // 1544:62139 (drawn over the far one)
    { x: -0.14, y: -26, r: 0, s: 0.7456, b: 0, o: 1, g: 0 },           // 1544:62079
    { x: -0.14, y: -26, r: 0, s: 0.7456, b: 0, o: 0, g: 0 },
  ];
  // the pile leans the way the last card was flicked (the share build's Option 1): a flick to the left mirrors it
  let lean = 1;
  const slot = (k) => { const q = SLOT[Math.min(k, 3)]; return { ...q, x: lean * q.x, r: lean * q.r }; };
  const KEYS = ['x', 'y', 'r', 's', 'b', 'o', 'g'], K = 280.6, C = 27.14;
  let order = cards.map((_, i) => i), raf = 0, drag = null, fanned = 0;   // (how many cards behind the front one are out)
  let barLive = false, fanT = 0, fanPoll = 0, barT = 0;                  // (the bar shows once the deck has landed on the page)
  const BAR_S = 0.36;                                          // (its unfold, s)
  // iteration 02 — the throw tucks the card in behind only once its (rotated) outline is clear of the new front card,
  // so it never pops from in front to behind while the two overlap; its speed carries straight on through that moment
  // (one continuous arc: out, round, and back in under the pile, still visible until it lands behind the far card)
  const W = 233, HGT = () => cards[0].offsetHeight || 471;
  const extentX = (q, h) => {                                  // the card's left/right edge (its origin is the top centre)
    const a = q.r * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), xs = [-W / 2, W / 2].flatMap((x) => [0, h].map((y) => q.x + q.s * (x * c - y * sn)));
    return [Math.min(...xs), Math.max(...xs)];
  };
  const clearOfFront = (i) => {
    const s = st[i], h = HGT(), [l, r] = extentX(s, h), [fl, fr] = extentX(SLOT[0], h);
    return s.fly > 0 ? l > fr + 2 : r < fl - 2;
  };
  const st = cards.map(() => ({ ...SLOT[0], v: { x: 0, y: 0, r: 0, s: 0, b: 0, o: 0, g: 0 }, t: { ...SLOT[0] }, fly: 0 }));
  const paint = () => cards.forEach((c, i) => {
    const s = st[i];
    c.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(3)}deg) scale(${s.s.toFixed(4)})`;
    c.style.filter = '';   // (the cards behind are sharp: no blur)
    c.style.opacity = s.o.toFixed(3);
    c.style.setProperty('--g', Math.max(0, Math.min(1, s.g)).toFixed(3));
    // (iteration 03: the red "Deal ends in" bar is the front card's only — Figma's copies behind have none — so it folds
    // away as a card shrinks into the pile and unfolds as one grows to the front, on the same spring as its scale)
    c.style.setProperty('--bar', (1 - Math.pow(1 - (s.bar || 0), 3)).toFixed(3));   // (ease-out: it unfolds, then settles)
  });
  const layer = () => order.forEach((ci, k) => { cards[ci].style.zIndex = String(st[ci].fly && !st[ci].tucked ? 40 : 30 - k); cards[ci].classList.toggle('is-top', k === 0); cards[ci].setAttribute('aria-hidden', String(k !== 0)); });
  const aim = () => order.forEach((ci, k) => {
    const s = st[ci], q = { ...slot(k <= fanned ? k : 0) }; if (k > fanned) q.o = 0;
    if (s.ret) { s.ret.to = q; s.t.o = q.o; } else if (!s.fly) s.t = q; else if (k > fanned) s.t.o = 0;
  });
  function run() {
    if (raf) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      let moving = false;
      st.forEach((s, i) => {
        // the bar: the front card's (and a thrown card keeps its own as it leaves), unfolding once it has fully come forward
        const wantBar = barLive && (s.fly || (order[0] === i && s.s > 0.99));
        if (!wantBar) s.bar = 0; else if ((s.bar || 0) < 1) { s.bar = Math.min(1, (s.bar || 0) + dt / BAR_S); moving = true; }
        if (drag && drag.ci === i && drag.axis === 'x') return;
        if (hinting && hinting.ci === i) {
          const t = now - hinting.t0;
          if (learned || drag || order[0] !== i || t >= SLIDE_END) { hinting = null; aim(); }
          else {
            const dx = slideAt(t);
            s.x = dx; s.y = Math.abs(dx) * 0.04; s.r = dx * 0.045; KEYS.forEach((p) => { s.v[p] = 0; });
            leanIn(dx); moving = true; return;
          }
        }
        for (let h = dt; h > 1e-6; h -= 1 / 240) {
          const k = Math.min(h, 1 / 240);
          KEYS.forEach((p) => { const c = p === 'o' || p === 'b' || p === 'g' ? 0.8 : 1; s.v[p] += (K * c * (s.t[p] - s[p]) - C * Math.sqrt(c) * s.v[p]) * k; s[p] += s.v[p] * k; });
        }
        // out of the frame — its whole tilted outline past the screen's edge (the card's centre is at x 183): to the back
        // of the pile, unseen
        if (s.fly) { const [l, r] = extentX(s, HGT()); if ((s.fly > 0 ? 183 + l > 379 : 183 + r < -4) || performance.now() - s.flyT > 1000) recycle(i); }
        if (s.ret) {
          const u = Math.min(1, (now - s.ret.t0) / 220), e = u * u * u * (u * (u * 6 - 15) + 10);
          KEYS.forEach((p) => { if (p !== 'o') s.t[p] = s.ret.from[p] + (s.ret.to[p] - s.ret.from[p]) * e; });
          if (u >= 1) { s.t = { ...s.ret.to }; s.ret = null; }
        }
        const dest = s.ret ? s.ret.to : s.t;
        if (s.back && dest.o === 0) {                             // sliding back in under the pile: there until it lands
          const d = Math.hypot(s.x - dest.x, s.y - dest.y), u = Math.min(1, d / 90);
          s.o = u * u * (3 - 2 * u); s.v.o = 0;
          if (d < 0.6 && !s.ret) s.back = false;
        } else if (s.back && !s.ret) s.back = false;
        const still = KEYS.every((p) => Math.abs(s.t[p] - s[p]) < (p === 's' || p === 'o' || p === 'g' ? 0.0008 : 0.04) && Math.abs(s.v[p]) < 0.05);
        if (still) KEYS.forEach((p) => { s[p] = s.t[p]; s.v[p] = 0; }); else moving = true;
        if (s.ret || s.back) moving = true;                       // (a card on its way back keeps the loop going)
      });
      paint();
      raf = moving || drag || hinting ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  }
  // the thrown card swings out to the side, then — behind everything now — slides back into the last slot of the pile,
  // so you watch it go to the end of the stack
  function recycle(i) {
    const s = st[i], q = { ...slot(order.indexOf(i)) };
    if (order.indexOf(i) > fanned) q.o = 0;
    s.fly = 0; s.tucked = false; s.back = false; s.ret = null; s.bar = 0;
    Object.assign(s, q, { o: 0 }); s.t = q; KEYS.forEach((p) => { s.v[p] = 0; });   // (it reappears at the back by fading in)
    layer();
  }
  function throwTop(dir, v = 0) {
    const ci = order[0], s = st[ci];
    lean = dir;   // (the pile swings to lean after it)
    // (out past the screen's edge on the move spring, carrying the hand's speed; it tips further and drops a little
    // as it goes, like a card tossed off the pile)
    s.fly = dir; s.flyT = performance.now(); s.back = false; s.tucked = false; s.t = { x: dir * 540, y: s.y + 26, r: dir * 12, s: 1, b: 0, o: 1, g: 0 };
    learned = true; stopHint();
    s.v.x = Math.max(Math.abs(s.v.x), Math.abs(v) * 1000, 900) * dir;
    order = [...order.slice(1), ci];
    aim(); layer(); H('tick'); run();
  }
  stage.addEventListener('pointerdown', (e) => {
    if (e.button || e.target.closest('button')) return;
    const c = e.target.closest('.d3-dk'); if (!c) return;
    stopHint();
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
    // (thrown once the card is 96 px out, or the finger has travelled 96 px — a swipe that starts while the nudge has
    // the card off to one side still counts as the swipe it is — or on a flick)
    const dx = st[d.ci].x, moved = dx - d.x0;
    if (Math.abs(dx) > 96 || Math.abs(moved) > 96 || Math.abs(d.v) > 0.55) throwTop(Math.sign(Math.abs(d.v) > 0.55 ? d.v : Math.abs(moved) > 96 ? moved : dx), d.v);
    else { aim(); run(); }
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);

  // iteration 02 — first-time nudge (FTUX): once the deck has landed and the scroll has come to rest with it on screen,
  // the front card leans left, then right, then settles — a hand testing the swipe — so you can see it moves. All on the
  // card's own spring (the MOVE spring), so it eases in and out with no start or stop: pose left (−16 px, −4°, pivoting
  // low on the card), pose right (+12 px, +3°) 300 ms later, home at 600 ms. Twice at most per arrival (2.4 s apart),
  // never again once you've swiped the deck; any touch on it stops it. Reduced motion: none.
  let learned = false, hintT = [], hintRaf = 0, hints = 0;
  // the nudge is a phantom swipe: the front card slides right as if a thumb were dragging it (46 px, with the drag's
  // own tilt and lift), back across to the left (38 px), then home — and the cards behind lean in under it exactly as
  // they do for a real drag, so it reads as "this moves sideways". Each leg eases in and out (in-out cubic): 440 ms
  // out, a 110 ms hold, 580 ms across, a 110 ms hold, 520 ms home. Twice at most per arrival (2.4 s apart), never
  // again once you've swiped the deck; any touch on it stops it at once. Reduced motion: none.
  const SLIDE = [[0, 0], [440, 46], [550, 46], [1130, -38], [1240, -38], [1760, 0]], SLIDE_END = 1760;
  const io3 = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const slideAt = (t) => { for (let i = 1; i < SLIDE.length; i++) if (t <= SLIDE[i][0]) { const [ta, xa] = SLIDE[i - 1], [tb, xb] = SLIDE[i]; return xa + (xb - xa) * io3((t - ta) / (tb - ta)); } return 0; };
  let hinting = null;
  // (the pile behind a dragged card: each card a step towards its next slot, as far as the card has gone)
  const leanIn = (dx) => { const p = Math.min(1, Math.abs(dx) / 180); order.slice(1).forEach((cj, k) => { const A0 = slot(k + 1), B0 = slot(k); st[cj].t = Object.fromEntries(KEYS.map((q) => [q, A0[q] + (B0[q] - A0[q]) * p * 0.5])); if (k + 1 > fanned) st[cj].t.o = 0; }); };
  function stopHint() {
    const was = hintT.length || hintRaf || armed;
    hintT.forEach(clearTimeout); hintT = []; cancelAnimationFrame(hintRaf); hintRaf = 0; armed = false; clearInterval(poll); poll = 0;
    const ci = order[0], s = st[ci];
    if (hinting) { hinting = null; if (!drag) aim(); }
    if (was && s && !s.fly && !drag) { s.t = { ...slot(0) }; run(); }
  }
  let lastScroll = 0, armed = false, poll = 0;
  const check = () => {
    if (!armed || !live || learned || drag || hints >= 2) return;
    const r = stage.querySelector('.d3-dk.is-top').getBoundingClientRect(), sr = scroller.getBoundingClientRect();
    const seen = (Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) / r.height;
    if (seen > 0.8 && !raf && performance.now() - lastScroll > 220) { armed = false; clearInterval(poll); poll = 0; play(); }
  };
  scroller.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
  function hint(wait = 0) {
    if (learned || reduce.matches || hints >= 2) return;
    hintT.push(setTimeout(() => { armed = true; clearInterval(poll); poll = setInterval(check, 300); check(); }, wait));
  }
  function play() {
    hints++;
    hinting = { ci: order[0], t0: performance.now() };
    run();
    if (hints < 2) hintT.push(setTimeout(() => hint(0), SLIDE_END + 2400));
  }

  return {
    next: (dir = 1) => throwTop(dir),
    hint: () => { hints = 0; hint(0); }, get hints() { return hints; }, get learned() { return learned; }, st, order: () => order,
    reset() { stopHint(); hints = 0; clearTimeout(fanT); clearTimeout(barT); clearInterval(fanPoll); fanPoll = 0; cancelAnimationFrame(raf); raf = 0; drag = null; lean = 1; order = cards.map((_, i) => i); fanned = 0; barLive = false; st.forEach((s) => { s.fly = 0; s.bar = 0; s.ret = null; s.back = false; Object.assign(s, SLOT[0]); KEYS.forEach((p) => { s.v[p] = 0; }); }); aim(); order.forEach((ci, k) => { if (k) st[ci].o = 0; }); layer(); paint(); },
    // scrolled back away below the screen: the cards behind tuck back under the front one (instantly, it's off screen)
    // and the front one goes back to hidden, so the next scroll down plays the whole entrance again
    hide() {
      stopHint(); hints = 0; clearTimeout(fanT); clearTimeout(barT); clearInterval(fanPoll); fanPoll = 0;
      fanned = 0; barLive = false; st.forEach((s0) => { s0.bar = 0; });
      order.forEach((ci, k) => { const s0 = st[ci]; if (k && !s0.fly) { Object.assign(s0, { ...slot(0), o: 0 }); KEYS.forEach((p) => { s0.v[p] = 0; }); } });
      aim(); paint();
      cards.forEach((c) => cancelOwn(c.firstElementChild));
    },
    // the reveal: the front card lands first; then the cards behind it come out from under it one at a time
    fan(delay) {
      const d = reduce.matches ? 0 : delay, step = reduce.matches ? 0 : 140;
      clearTimeout(fanT); clearInterval(fanPoll); clearTimeout(barT);
      // (the red bar comes in as the front card lands — ~120 ms after it starts rising — not with the fan)
      barT = setTimeout(() => { if (!live) return; barLive = true; run(); }, Math.max(0, d - 360));
      const go = () => {
        clearInterval(fanPoll); fanPoll = 0; scroller.removeEventListener('scroll', check);
        [1, 2, Infinity].forEach((n, i) => setTimeout(() => { if (!live) return; fanned = Math.max(fanned, n); aim(); run(); }, i * step));
        hint(2 * step + 520);                                     // (the nudge, once the pile has fanned out and landed)
      };
      // (started scrolling, and the deck's front card at least a fifth on screen)
      const check = () => {
        if (!live) return;
        const r = stage.querySelector('.d3-dk.is-top').getBoundingClientRect(), sr = scroller.getBoundingClientRect();
        const seen = (Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)) / r.height;
        if (scroller.scrollTop > 8 && seen >= 0.2) go();
      };
      fanT = setTimeout(() => { if (!live) return; scroller.addEventListener('scroll', check, { passive: true }); fanPoll = setInterval(check, 200); check(); }, d);
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
  const TILT = 12, PERSP = 900, DROP = 50.84;
  // the "Expires in" bar (--rb, per card): the widget has to have landed first; the middle card's bar wipes in (0.46 s,
  // eased out) once the carousel has come to rest; a card that has gone to the side loses it
  let landed = false, rbRaf = 0, lastPlace = 0, rbLast = 0, landT = 0;
  const rb = [];
  const rbTick = (now) => {
    const dt = Math.min(0.05, (now - (rbLast || now)) / 1000); rbLast = now;
    let anim = false;
    slots.forEach((el, i) => {
      const d = Math.abs(loop.wrapD(i)); let v = rb[i] || 0;
      if (landed && d < 0.02 && now - lastPlace > 60) { if (v < 1) { v = Math.min(1, v + dt / 0.36); anim = true; } }
      else if (d >= 0.999) v = 0;
      rb[i] = v; el.style.setProperty('--rb', (1 - Math.pow(1 - v, 3)).toFixed(3));
    });
    rbRaf = anim || now - lastPlace < 160 ? requestAnimationFrame(rbTick) : 0;
    if (!rbRaf) rbLast = 0;
  };
  const kick = () => { if (!rbRaf) rbRaf = requestAnimationFrame(rbTick); };   // (iteration 03: Figma's side cards sit 50.84 px lower than the middle one's top)
  const loop = loopCarousel({ stage, count: slots.length, step: PITCH, tapToFocus: true, place: (wrapD) => slots.forEach((el, i) => {
    const d = wrapD(i), a = Math.abs(d), k = Math.min(1, a);
    el.style.transform = `perspective(${PERSP}px) translate3d(${(d * PITCH).toFixed(2)}px, ${(DROP * k).toFixed(2)}px, 0) rotateY(${(-Math.sign(d) * TILT * k).toFixed(3)}deg) scale(${(1 - (1 - SS) * k).toFixed(4)})`;
    el.style.setProperty('--k', k.toFixed(4));
    // (the type morphs in 16 steps — 0.1 px of size each, below what the eye can see — so its glyphs are re-rasterised a
    // handful of times per swipe instead of every frame)
    el.style.setProperty('--kt', (Math.round(k * 16) / 16).toFixed(4));
    el.style.opacity = a <= 1 ? '1' : Math.max(0, 2 - a).toFixed(3);
    el.style.zIndex = String(10 - Math.round(a * 3));
    el.style.visibility = a > 1.9 ? 'hidden' : '';
    el.classList.toggle('is-mid', a < 0.5);
    el.setAttribute('aria-hidden', String(a >= 0.5));
    lastPlace = performance.now(); kick();
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
    jump: (i) => { landed = false; slots.forEach((sl, k) => { rb[k] = 0; sl.style.setProperty('--rb', '0'); }); loop.jump(i); },
    hide() { drop(); landed = false; slots.forEach((sl, i) => { rb[i] = 0; sl.style.setProperty('--rb', '0'); sl.firstElementChild.style.transform = ''; cancelOwn(sl.firstElementChild); }); },   // (back to hidden, to play in again)
    reveal(delay) {
      drop();
      const d0 = reduce.matches ? 0 : delay, n = springPath.length - 1;
      clearTimeout(landT); landT = setTimeout(() => { landed = true; kick(); }, d0 + (reduce.matches ? 0 : 120));   // (as the middle card comes in)
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
  const runs = $$('.ng .run').map((r) => ({ r, tops: r.dataset.tops.split(',').map(Number), lab: r.parentElement, lines: [...r.children].map((c) => c.textContent) }));
  let i = 0, t = 0, back = 0;
  const set = (k, anim) => runs.forEach(({ r, tops, lab, lines }) => {
    r.style.transition = anim ? '' : 'none';
    const y = tops[k] - tops[0]; r.style.transform = y ? `translate3d(0, ${-y}px, 0)` : '';
    lab.setAttribute('aria-label', lines[k]);
  });
  const L = runs.length ? runs[0].tops.length : 1;
  const step = () => {
    if (!live || document.hidden) return;
    i += 1; set(i, true);
    if (i === L - 1) back = setTimeout(() => { i = 0; set(0, false); }, 700);
  };
  return {
    start() { clearInterval(t); clearTimeout(back); if (!reduce.matches) t = setInterval(step, 2600); },
    stop() { clearInterval(t); clearTimeout(back); i = 0; set(0, false); },
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
  else if (e.detail === 'closing') { if (curating) { curateCancel(); window.orbi.setState('idle'); } live = false; nudges.stop(); clocks.stop(); }
  else if (e.detail === 'closed') { curateCancel(); reset(); }
});
// every image on the page decoded up front (not on its first paint, mid-reveal, which costs a dropped frame or two)
$$('img').forEach((im) => { if (im.decode) im.decode().catch(() => {}); });
// photos fetched up front, so nothing pops in mid-reveal
[...DATA.deck, ...DATA.refill].forEach((it) => { const im = new Image(); im.src = SRC(it); });
// the top feather shows only once the page has scrolled (at the top, Figma's sun rays run up under the status bar)
(() => { const f = sheet.querySelector('.yf-mini'); const set = () => f && f.classList.toggle('on', scroller.scrollTop > 6); scroller.addEventListener('scroll', set, { passive: true }); set(); })();
coupons.jump(0); deck.reset(); refill.jump(0);
(function ink() { if (window.orbi) window.orbi.statusInk(0); else requestAnimationFrame(ink); })();   // (a light page: dark status-bar content)
window.yfPage = { reveal, reset, scroller, coupons, deck, refill };
