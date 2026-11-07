/* ══ The bot's full page: "Yellow Friday" — 1:1 with Figma Sas-Motion 543:78780 ═══════════════════════════════
   Built into #orbiSheet at Figma's own x / y (yf/page.css). orbi/main.js opens it (a zoom out of the bot's button);
   this file holds a short "Curating for you" beat (the bot at the centre), then plays the content in and runs the page's interactions:
     · the reveal — hero greeting, date, the card (rising), its peeks sliding out from behind it, the CTA, the
       coupons, then each section as it scrolls into view; Apple-style springs, 60 ms staggers
     · the ticker CTA flipping "Shop now" ↔ "Get it in 1hr.", a live flash-deal countdown, Remind me toggles,
       sliding tab underline, swipeable rows, a light parallax on the hero while scrolling, press dips, haptics */
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
const TAB_ICONS = [
  '<path d="M25.0679 11.877L16.8639 4.84549C16.0712 4.16586 15.0615 3.79219 14.0173 3.79199H13.9823C12.9382 3.79187 11.9285 4.16512 11.1356 4.84433L2.93044 11.877C2.75423 12.0281 2.64528 12.2431 2.62756 12.4746C2.60983 12.7061 2.68479 12.9351 2.83594 13.1113C2.9871 13.2875 3.20206 13.3965 3.43354 13.4142C3.66502 13.4319 3.89406 13.357 4.07028 13.2058L4.95928 12.444V21.0003C4.9602 21.8509 5.29852 22.6665 5.9 23.2679C6.50148 23.8694 7.31699 24.2077 8.16761 24.2087H11.3759C11.608 24.2087 11.8306 24.1165 11.9947 23.9524C12.1588 23.7883 12.2509 23.5657 12.2509 23.3337V16.3337C12.2509 16.1789 12.3124 16.0306 12.4218 15.9212C12.5312 15.8118 12.6796 15.7503 12.8343 15.7503H15.1676C15.3223 15.7503 15.4707 15.8118 15.5801 15.9212C15.6895 16.0306 15.7509 16.1789 15.7509 16.3337V23.3337C15.7509 23.8167 16.1429 24.2087 16.6259 24.2087H19.8343C20.6849 24.2077 21.5004 23.8694 22.1019 23.2679C22.7034 22.6665 23.0417 21.8509 23.0426 21.0003V12.444L23.9304 13.2058C24.0178 13.2806 24.1191 13.3374 24.2284 13.373C24.3378 13.4086 24.453 13.4222 24.5677 13.4132C24.6823 13.4043 24.7941 13.3728 24.8965 13.3205C24.999 13.2683 25.0901 13.1965 25.1648 13.109C25.3157 12.9329 25.3905 12.7041 25.3727 12.4729C25.355 12.2416 25.2462 12.0269 25.0703 11.8758L25.0679 11.877ZM21.2914 12.1523V21.0003C21.2914 21.8042 20.6369 22.4587 19.8331 22.4587H17.4998V16.3337C17.4998 15.048 16.4521 14.0003 15.1664 14.0003H12.8331C11.5463 14.0003 10.4998 15.048 10.4998 16.3337V22.4587H8.16644C7.36261 22.4587 6.70811 21.8042 6.70811 21.0003V12.1512C6.70811 11.3847 7.04178 10.6578 7.62511 10.1573L8.98428 8.99299L12.2743 6.17199C12.7501 5.76455 13.3559 5.54069 13.9823 5.54083H14.0173C14.6426 5.54083 15.2493 5.76483 15.7253 6.17199L17.4636 7.66183L17.8206 7.96749L20.3744 10.1562C20.6619 10.4028 20.8926 10.7086 21.0507 11.0528C21.2088 11.397 21.2905 11.7713 21.2903 12.15L21.2914 12.1523Z" fill="white"/>',
  '<path d="M11.9875 3.33453C12.5574 2.87416 13.2679 2.62305 14.0006 2.62305C14.7332 2.62305 15.4437 2.87416 16.0137 3.33453L16.2587 3.5352C17.5233 4.57586 19.271 6.18703 20.7445 8.17153C22.309 10.2785 23.6262 12.893 23.6262 15.7502L23.625 15.8039C23.6108 18.3473 22.5905 20.7817 20.787 22.5751C18.9835 24.3685 16.5434 25.3752 14 25.3752C11.4473 25.3752 8.99913 24.3611 7.1941 22.5561C5.38906 20.7511 4.375 18.3029 4.375 15.7502C4.375 12.8919 5.69333 10.2785 7.25667 8.17153C8.82817 6.05403 10.7123 4.36353 11.9875 3.33453ZM6.125 15.7502C6.125 17.8388 6.95469 19.8418 8.43153 21.3187C9.90838 22.7955 11.9114 23.6252 14 23.6252C15.038 23.6252 16.0658 23.42 17.0242 23.0214C17.9826 22.6228 18.8528 22.0387 19.5846 21.3026C20.3165 20.5665 20.8956 19.693 21.2887 18.7323C21.6817 17.7716 21.881 16.7427 21.875 15.7047C21.8622 13.3959 20.7865 11.164 19.3387 9.21453C17.8897 7.26153 16.1303 5.67603 14.9147 4.69603C14.656 4.48681 14.3333 4.37267 14.0006 4.37267C13.6679 4.37267 13.3452 4.48681 13.0865 4.69603C11.872 5.67603 10.1115 7.26153 8.6625 9.21453C7.20533 11.1757 6.125 13.425 6.125 15.7502Z" fill="white"/><path d="M7.875 15.75C7.875 15.5179 7.96719 15.2954 8.13128 15.1313C8.29538 14.9672 8.51794 14.875 8.75 14.875C8.98206 14.875 9.20462 14.9672 9.36872 15.1313C9.53281 15.2954 9.625 15.5179 9.625 15.75C9.62654 16.9098 10.088 18.0217 10.9081 18.8419C11.7282 19.662 12.8402 20.1235 14 20.125C14.2321 20.125 14.4546 20.2172 14.6187 20.3813C14.7828 20.5454 14.875 20.7679 14.875 21C14.875 21.2321 14.7828 21.4546 14.6187 21.6187C14.4546 21.7828 14.2321 21.875 14 21.875C12.376 21.8735 10.819 21.2276 9.67068 20.0793C8.52235 18.931 7.87654 17.374 7.875 15.75Z" fill="white"/>',
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.8337 3.10254C14.9212 3.10217 16.9402 3.84818 18.5259 5.20588C20.1117 6.56358 21.1598 8.44349 21.481 10.5062H22.7503C23.0597 10.5062 23.3565 10.6291 23.5753 10.8479C23.7941 11.0667 23.917 11.3635 23.917 11.6729V11.7254C23.917 12.1314 24.1118 12.5222 24.4537 12.801C24.8293 13.0713 25.1352 13.427 25.3462 13.8388C25.5571 14.2506 25.6671 14.7067 25.667 15.1694V21.0027C25.667 21.1233 25.6596 21.2427 25.6448 21.3609C25.5956 21.7602 25.4642 22.1451 25.259 22.4912C25.0538 22.8374 24.7792 23.1373 24.4525 23.3722C24.289 23.5005 24.1561 23.6636 24.0635 23.8497C23.9708 24.0357 23.9208 24.2401 23.917 24.4479V24.5004C23.917 24.8098 23.7941 25.1065 23.5753 25.3253C23.3565 25.5441 23.0597 25.667 22.7503 25.667H18.0837C17.7742 25.667 17.4775 25.5441 17.2587 25.3253C17.0399 25.1065 16.917 24.8098 16.917 24.5004V24.4479C16.913 24.24 16.8628 24.0356 16.77 23.8495C16.6772 23.6634 16.544 23.5004 16.3803 23.3722C16.0047 23.102 15.6988 22.7463 15.4878 22.3345C15.2768 21.9227 15.1669 21.4666 15.167 21.0039V15.1705C15.167 14.9652 15.188 14.7626 15.23 14.5627L15.2312 14.5569C15.3834 13.8491 15.7934 13.2233 16.3815 12.801C16.545 12.6727 16.6779 12.5096 16.7705 12.3236C16.8631 12.1375 16.9132 11.9332 16.917 11.7254V11.6729C16.917 11.3635 17.0399 11.0667 17.2587 10.8479C17.4775 10.6291 17.7742 10.5062 18.0837 10.5062H20.298C19.9823 8.75649 19.0619 7.17331 17.6975 6.03328C16.3332 4.89325 14.6116 4.26886 12.8337 4.26921H11.667C9.65577 4.26921 7.72692 5.06816 6.30477 6.49031C4.88261 7.91246 4.08366 9.84131 4.08366 11.8525V16.5355C4.08366 16.9987 4.26799 17.4432 4.59699 17.7722L5.25033 18.4255V15.7492C5.25033 15.1304 5.49616 14.5369 5.93374 14.0993C6.37133 13.6617 6.96482 13.4159 7.58366 13.4159C8.2025 13.4159 8.79599 13.6617 9.23357 14.0993C9.67116 14.5369 9.91699 15.1304 9.91699 15.7492V23.3337C9.91699 23.9525 9.67116 24.546 9.23357 24.9836C8.79599 25.4212 8.2025 25.667 7.58366 25.667C6.96482 25.667 6.37133 25.4212 5.93374 24.9836C5.49616 24.546 5.25033 23.9525 5.25033 23.3337V20.0752L3.77216 18.597C3.22507 18.0504 2.91747 17.3089 2.91699 16.5355V11.8525C2.91699 9.5319 3.83886 7.3063 5.47981 5.66535C7.12075 4.02441 9.34635 3.10254 11.667 3.10254H12.8337ZM7.58366 14.5825C7.27424 14.5825 6.97749 14.7055 6.7587 14.9242C6.53991 15.143 6.41699 15.4398 6.41699 15.7492V23.3337C6.41699 23.6431 6.53991 23.9399 6.7587 24.1587C6.97749 24.3775 7.27424 24.5004 7.58366 24.5004C7.89308 24.5004 8.18982 24.3775 8.40862 24.1587C8.62741 23.9399 8.75033 23.6431 8.75033 23.3337V15.7492C8.75033 15.4398 8.62741 15.143 8.40862 14.9242C8.18982 14.7055 7.89308 14.5825 7.58366 14.5825ZM18.0837 13.4194C17.6195 13.4194 17.1744 13.6037 16.8462 13.9319C16.518 14.2601 16.3337 14.7052 16.3337 15.1694V21.0027C16.3337 21.4668 16.518 21.912 16.8462 22.2401C17.1744 22.5683 17.6195 22.7527 18.0837 22.7527H22.7503C23.2145 22.7527 23.6596 22.5683 23.9878 22.2401C24.3159 21.912 24.5003 21.4668 24.5003 21.0027V15.1694C24.5003 14.7052 24.3159 14.2601 23.9878 13.9319C23.6596 13.6037 23.2145 13.4194 22.7503 13.4194H18.0837Z" fill="white"/>',
  '<path d="M7.58366 9.33333C7.89308 9.33333 8.18982 9.21042 8.40862 8.99162C8.62741 8.77283 8.75033 8.47609 8.75033 8.16667C8.75033 7.85725 8.62741 7.5605 8.40862 7.34171C8.18982 7.12292 7.89308 7 7.58366 7C7.27424 7 6.97749 7.12292 6.7587 7.34171C6.53991 7.5605 6.41699 7.85725 6.41699 8.16667C6.41699 8.47609 6.53991 8.77283 6.7587 8.99162C6.97749 9.21042 7.27424 9.33333 7.58366 9.33333ZM7.58366 12.25C7.89308 12.25 8.18982 12.1271 8.40862 11.9083C8.62741 11.6895 8.75033 11.3928 8.75033 11.0833C8.75033 10.7739 8.62741 10.4772 8.40862 10.2584C8.18982 10.0396 7.89308 9.91667 7.58366 9.91667C7.27424 9.91667 6.97749 10.0396 6.7587 10.2584C6.53991 10.4772 6.41699 10.7739 6.41699 11.0833C6.41699 11.3928 6.53991 11.6895 6.7587 11.9083C6.97749 12.1271 7.27424 12.25 7.58366 12.25ZM16.287 5.9045C17.1062 5.8593 17.9277 5.87178 18.7452 5.94183C18.9711 5.96784 19.1781 6.08082 19.3221 6.25681C19.4662 6.4328 19.5361 6.65798 19.517 6.88463C19.4979 7.11127 19.3913 7.32157 19.2197 7.47094C19.0482 7.62032 18.8253 7.69704 18.5982 7.68483C17.8609 7.62376 17.1203 7.61284 16.3815 7.65217C16.1497 7.66485 15.9224 7.58496 15.7496 7.43005C15.5767 7.27515 15.4725 7.05792 15.4598 6.82617C15.4471 6.59441 15.527 6.36711 15.6819 6.19426C15.8368 6.02142 16.0541 5.91719 16.2858 5.9045" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21.0319 3.31359C19.2335 2.95348 17.3906 2.87085 15.5672 3.06859C12.9202 2.98128 10.2706 3.11396 7.64555 3.46526C6.7325 3.58673 5.88109 3.99328 5.21262 4.62697C4.54416 5.26066 4.09275 6.08916 3.92271 6.99442C3.06836 11.5517 3.05452 16.2268 3.88188 20.7891L3.92271 21.0061C4.09246 21.9114 4.5436 22.74 5.21185 23.3739C5.88011 24.0078 6.73138 24.4146 7.64438 24.5364C10.2764 24.8864 12.9294 25.0194 15.5765 24.9331C17.3942 25.1279 19.234 25.0451 21.0319 24.6858C21.9324 24.5058 22.7534 24.047 23.3786 23.3744C24.0039 22.7019 24.4016 21.8496 24.5155 20.9384C25.0732 16.4748 25.0907 11.9598 24.568 7.49259L24.5155 7.06092C24.4016 6.14972 24.0039 5.29748 23.3786 4.62491C22.7534 3.95235 21.9324 3.49358 21.0319 3.31359ZM11.4162 23.1353C10.9078 22.5037 10.5854 21.743 10.4852 20.9384L10.4327 20.5068C9.91013 16.039 9.92775 11.5245 10.4852 7.06092C10.5851 6.25649 10.9071 5.49578 11.415 4.86409C10.2317 4.93073 9.05137 5.04242 7.87655 5.19892C7.32847 5.27178 6.8174 5.51584 6.41621 5.89629C6.01502 6.27674 5.74421 6.77415 5.64238 7.31759C4.81476 11.7343 4.81476 16.2662 5.64238 20.6829C5.74414 21.2262 6.01479 21.7235 6.41575 22.1039C6.8167 22.4843 7.32752 22.7285 7.87538 22.8016C9.05294 22.9587 10.2332 23.0691 11.4162 23.1353ZM14.3119 5.02975C16.4165 4.60975 18.5842 4.60975 20.6889 5.02975C21.7972 5.25259 22.6395 6.15909 22.7784 7.27909C23.337 11.7428 23.337 16.2588 22.7784 20.7226C22.7123 21.2515 22.4869 21.7477 22.132 22.1453C21.7771 22.5429 21.3095 22.8231 20.7915 22.9486L20.6889 22.9719C18.5842 23.3919 16.4165 23.3919 14.3119 22.9719C13.7716 22.8637 13.279 22.5883 12.904 22.1846C12.529 21.7809 12.2905 21.2694 12.2224 20.7226L12.171 20.3026C11.6636 15.9752 11.6804 11.6024 12.2212 7.27909C12.3612 6.15909 13.2035 5.25142 14.3119 5.02975Z" fill="white"/>',
];
const EXPRESS = '<img class="ex" src="yf/express.svg" width="57" height="17" alt="express" draggable="false">';

// ─── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
const KM = '<svg viewBox="0 0 8 8" aria-hidden="true"><path d="M6.35387 3.15889C6.54718 3.08371 6.64384 3.04612 6.67206 2.99195C6.69652 2.945 6.69655 2.88907 6.67215 2.84209C6.64399 2.78789 6.54738 2.75019 6.35415 2.67478L0.870497 0.534821C0.696068 0.466752 0.608854 0.432717 0.553124 0.451334C0.504726 0.467503 0.466745 0.505484 0.450577 0.553881C0.43196 0.609611 0.465994 0.696826 0.534064 0.871254L2.67403 6.35491C2.74943 6.54813 2.78714 6.64475 2.84133 6.6729C2.88831 6.69731 2.94424 6.69728 2.9912 6.67282C3.04536 6.6446 3.08295 6.54794 3.15813 6.35462L4.01151 4.16022C4.02677 4.12098 4.0344 4.10136 4.04618 4.08484C4.05663 4.07019 4.06943 4.05739 4.08408 4.04694C4.1006 4.03516 4.12022 4.02753 4.15946 4.01226L6.35387 3.15889Z" fill="#8BB7F1" stroke="#F2F3F7" stroke-width="0.892128" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
const IMG = (k) => `yf/noon/${k}.webp`;
const icCard = (it) => `<div class="yf-ic yf-press yf-rv"><div class="ph${it.cover ? ' cover' : ''}"><img src="${IMG(it.img)}" alt="" draggable="false"></div><span class="km">-${off(it)}%</span><div class="nm">${it.name}</div><div class="pr"><b><i>${D}</i>${money(it.price)}</b><s>${D}${money(it.was)}</s></div></div>`;
const inv = (top, left, id) => `<div class="yf-row yf-inv" id="${id}" style="top:${top}px" data-pad="${left}" data-no-drag data-scroll><div class="rail"></div></div>`;   // (filled by its loop)
const pc = (p, x, y) => `<div class="yf-pc yf-rv" data-scroll style="left:${x}px;top:${y}px"><div class="ph${p.cover ? ' cover' : ''}"><img src="${IMG(p.img)}" alt="" draggable="false"></div>
  <div class="nm"><b>${p.brand}</b>${p.title}</div><div class="prow"><span class="cur">${D}</span><span class="pz">${money(p.price)}</span><span class="was">${money(p.was)}</span></div>
  <button class="yf-remind yf-press" type="button">${BELL}<span>Remind me</span></button></div>`;
const title = (y, h2, sub) => `<div class="yf-abs yf-title yf-rv" data-scroll style="top:${y}px"><h2>${h2}</h2><p>${sub}</p></div>`;
// ─── layout: one rhythm below the hero (Figma's sections, re-spaced evenly): a 16 px side margin, cards 10 apart,
// 56 between sections, 20 from a section's title to its content
const M = 16, GAP = 56, TT = 20, TITLE_H = 73.6, ROW_H = 225.9, CARD_H = 236, CARD_W = 166.5, COL2 = M + CARD_W + 10;
const L = (() => {
  const o = {}; let y = 568.3 + 48;                             // the hero's CTA ends here
  o.coupons = y += GAP; y += 224;
  o.wishT = y += GAP; o.wish = y += TITLE_H + TT; y += ROW_H;
  o.flashT = y += GAP; o.timer = y += TITLE_H + TT; o.flash = y += 52 + 16; y += CARD_H;
  o.restT = y += GAP; o.tabs = y += TITLE_H + 16; o.rest = y += 65 + TT; y += ROW_H;
  o.megaT = y += GAP; o.mega1 = y += TITLE_H + TT; o.mega2 = y += CARD_H + 10; y += CARD_H;
  o.lowT = y += GAP; o.low = y += TITLE_H + TT; y += 150;
  o.end = Math.ceil(y + 64);
  return o;
})();
const heroCard = (it, i) => `<div class="yf-hc" data-i="${i}"><div class="in yf-rv"><div class="ph"><img src="${IMG(it.img)}" alt="" draggable="false"></div><i class="shade"></i><p class="cap">${it.tag}<br><b>${it.name}</b></p><i class="dim"></i></div></div>`;
const coupon = (c, i) => `<div class="yf-cslot" data-i="${i}"><div class="yf-coupon yf-press yf-rv"><div class="in"><div class="ph${c.cover ? ' cover' : ''}"><img src="${IMG(c.img)}" alt="" draggable="false"></div><p>${c.l1}<b>${c.l2}</b></p></div></div></div>`;

const scroller = document.createElement('div');
scroller.className = 'yf-scroll';
scroller.setAttribute('data-no-drag', '');
scroller.innerHTML = `<div class="yf" style="height:${L.end}px">
  <div class="yf-abs yf-hi yf-rv" data-k="hi">Hi Neha!</div>
  <img class="yf-abs yf-date yf-rv" data-k="date" src="yf/date.webp" alt="Yellow Friday sale" draggable="false">
  <svg class="yf-abs yf-ring yf-rv" data-k="ring" viewBox="0 0 434 96" aria-hidden="true"><defs><linearGradient id="yfRing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#3d3d3d"/></linearGradient></defs><ellipse cx="217" cy="48" rx="216.4" ry="47.2" fill="none" stroke="url(#yfRing)" stroke-width="1"/></svg>
  <div class="yf-abs yf-hero" data-no-drag aria-roledescription="carousel">${DATA.hero.map(heroCard).join('')}</div>
  <button class="yf-abs yf-cta yf-press yf-rv" data-k="cta" type="button"><div class="flip"><span>Shop now</span><span>Get it in 1hr.</span></div></button>
  <div class="yf-abs yf-coupons" data-no-drag style="top:${L.coupons}px">${[...DATA.coupons, ...DATA.coupons].map(coupon).join('')}</div>
  ${title(L.wishT, 'Wishlist', DATA.sub.wish)}
  ${inv(L.wish, M, 'yfWish')}
  ${title(L.flashT, 'Flash deals', DATA.sub.flash)}
  <div class="yf-abs yf-timer yf-rv" data-scroll style="top:${L.timer}px">
    <div class="yf-tile" style="left:0"><b data-t="h">03</b><i>HRS</i></div><span class="yf-colon" style="left:56px">:</span>
    <div class="yf-tile" style="left:67.5px"><b data-t="m">14</b><i>MIN</i></div><span class="yf-colon" style="left:123.5px">:</span>
    <div class="yf-tile" style="left:135px"><b data-t="s">19</b><i>SEC</i></div>
  </div>
  ${pc(DATA.flash[0], M, L.flash)}${pc(DATA.flash[1], COL2, L.flash)}
  ${title(L.restT, 'Restock', DATA.sub.restock)}
  <div class="yf-abs yf-tabs yf-rv" data-scroll style="top:${L.tabs}px">${['Home', 'Beauty', 'Laptops', 'Mobiles'].map((t, i) => `<div class="yf-tab${i ? '' : ' is-on'}" data-i="${i}"><svg viewBox="0 0 28 28" aria-hidden="true">${TAB_ICONS[i]}</svg><span>${t}</span></div>`).join('')}<i class="yf-tabline"></i></div>
  ${inv(L.rest, M, 'yfRestock')}
  ${title(L.megaT, 'Mega deals', DATA.sub.mega)}
  ${pc(DATA.mega[0], M, L.mega1)}${pc(DATA.mega[1], COL2, L.mega1)}${pc(DATA.mega[2], M, L.mega2)}${pc(DATA.mega[3], COL2, L.mega2)}
  ${title(L.lowT, 'Lowest price', DATA.sub.low)}
  <div class="yf-abs yf-low yf-press yf-rv" data-scroll style="top:${L.low}px"><div class="p"><img src="${IMG(DATA.low.img)}" alt="" draggable="false"></div>
    <div class="t">${DATA.low.title}</div><div class="v">${money(DATA.low.price)}</div>${EXPRESS}</div>
</div>`;
sheet.appendChild(scroller);
sheet.classList.add('is-yf');
// the "Curating for you" beat: the bot holds at the screen's centre with this line under it, then hands over to the page
const curate = document.createElement('div');
curate.className = 'yf-curate';
curate.setAttribute('aria-live', 'polite');
curate.innerHTML = '<b>Curating for you</b>';
sheet.appendChild(curate);
const page = scroller.firstElementChild;
const $ = (s) => page.querySelector(s), $$ = (s) => [...page.querySelectorAll(s)];

// ─── the reveal ─────────────────────────────────────────────────────────────────────────────────────────────
// hero beats, timed from the end of the curating beat (the bot leaving for its corner): ms delay, from-transform
const BEATS = {
  hi: [0, 'translateY(12px)'], date: [70, 'translateY(12px)'], card: [120, 'translateY(24px) scale(.97)'], ring: [200, 'scale(.97)'],
  peekL: [230, 'translateX(28px) scale(.97)'], peekR: [230, 'translateX(-28px) scale(.97)'],
  cta: [300, 'translateY(12px)'], cp1: [380, 'translateY(20px)'], cp0: [440, 'translateY(20px)'], cp2: [440, 'translateY(20px)'],
};
let io = null, live = false;
function playIn(el, from, delay) {
  el.getAnimations().forEach((a) => a.cancel());
  const d = reduce.matches ? 0 : delay;
  el.animate([{ transform: reduce.matches ? 'none' : from }, { transform: 'none' }], { duration: REVEAL.ms, easing: REVEAL.ease, delay: d, fill: 'both' });
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: REVEAL.fadeMs, easing: REVEAL.fade, delay: d, fill: 'both' });
}
function reveal() {
  live = true;
  hero.roles(); coupons.roles();
  $$('[data-k]').forEach((el) => { const b = BEATS[el.dataset.k]; if (b) playIn(el, b[1], b[0]); });
  setTimeout(() => H('tick'), 300);
  io && io.disconnect();
  io = new IntersectionObserver((ents) => {
    let k = 0;
    ents.filter((e) => e.isIntersecting).forEach((e) => {
      io.unobserve(e.target);
      if (e.target.classList.contains('yf-inv')) rows[e.target.id].cards().forEach((c) => playIn(c, 'translateY(20px)', (k++) * 70));   // a row: its cards, left to right
      else playIn(e.target, 'translateY(20px)', (k++) * 70);
    });
  }, { root: scroller, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });   // (a touch inside the edge, so the glide is seen)
  $$('[data-scroll]').forEach((el) => io.observe(el));
}
function reset() {
  live = false; io && io.disconnect();
  page.querySelectorAll('.yf-rv').forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  scroller.scrollTop = 0; onScroll();
  hero.jump(1); coupons.jump(1); Object.values(rows).forEach((r) => r.jump(0));
}

// ─── interactions ───────────────────────────────────────────────────────────────────────────────────────────
// the ticker CTA
const flip = $('.yf-cta .flip'); let flipped = false;
setInterval(() => {
  if (!live || document.hidden) return;
  flipped = !flipped;
  flip.animate([{ transform: `translateY(${flipped ? 0 : -56.4}px)` }, { transform: `translateY(${flipped ? -56.4 : 0}px)` }], { duration: SNAPPY.ms, easing: SNAPPY.ease, fill: 'forwards' });
}, 2600);
$('.yf-cta').addEventListener('click', () => H('tap'));
// the flash-deal countdown (03:14:19 when the page first opens)
const end = Date.now() + ((3 * 60 + 14) * 60 + 19) * 1000;
const tEls = { h: $('[data-t="h"]'), m: $('[data-t="m"]'), s: $('[data-t="s"]') };
function tick() {
  const s = Math.max(0, Math.floor((end - Date.now()) / 1000)), v = { h: Math.floor(s / 3600), m: Math.floor(s / 60) % 60, s: s % 60 };
  for (const k of ['h', 'm', 's']) {
    const t = String(v[k]).padStart(2, '0'), el = tEls[k];
    if (el.textContent !== t) { el.textContent = t; if (live && !reduce.matches) el.animate([{ transform: 'translateY(-8px)', opacity: 0.2 }, { transform: 'none', opacity: 1 }], { duration: SNAPPY.ms, easing: SNAPPY.ease }); }
  }
}
tick(); setInterval(tick, 1000);
// Remind me
page.addEventListener('click', (e) => {
  const b = e.target.closest('.yf-remind'); if (!b) return;
  const on = b.classList.toggle('is-on');
  b.querySelector('span').textContent = on ? 'Reminder set' : 'Remind me';
  H(on ? 'success' : 'tap');
  if (on && !reduce.matches) b.querySelector('svg').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-out' });
});
// tabs: the underline slides on a spring
const line = $('.yf-tabline'), TAB_W = (375 - 2 * M) / 4; let tabAt = 0;
$$('.yf-tab').forEach((t) => t.addEventListener('click', () => {
  const i = +t.dataset.i; if (i === tabAt) return;
  $$('.yf-tab').forEach((x) => x.classList.toggle('is-on', x === t));
  line.animate([{ transform: `translateX(${tabAt * TAB_W}px)` }, { transform: `translateX(${i * TAB_W}px)` }], { duration: SNAPPY.ms, easing: SNAPPY.ease, fill: 'forwards' });
  const dir = i > tabAt ? 1 : -1;
  tabAt = i; H('tick');
  // the row's cards swap: the old ones slip out the way the tab moved, the new ones slide in after them (60 ms stagger)
  rows.yfRestock.cards().forEach((c, k) => { c.getAnimations().forEach((a) => a.cancel()); c.style.opacity = 1;
    c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 24}px)` }],
      { duration: 160, delay: k * 25, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }); });
  setTimeout(() => {
    if (tabAt !== i) return;
    rows.yfRestock.set(DATA.restock[i]);
    rows.yfRestock.cards().forEach((c, k) => {
      c.animate([{ transform: reduce.matches ? 'none' : `translateX(${dir * 36}px)` }, { transform: 'none' }], { duration: SMOOTH.ms, easing: SMOOTH.ease, delay: k * 60, fill: 'both' });
      c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: FADE, delay: k * 60, fill: 'both' });
    });
  }, 180);
}));
// hero parallax while scrolling (the card lags, the peeks drift, the greeting fades)
const heroEls = { stage: $('.yf-hero'), hi: $('.yf-hi'), date: $('.yf-date') };
function onScroll() {
  const y = Math.min(scroller.scrollTop, 700);
  heroEls.stage.style.translate = `0 ${(y * 0.12).toFixed(1)}px`;
  heroEls.hi.style.translate = heroEls.date.style.translate = `0 ${(y * 0.3).toFixed(1)}px`;

}
scroller.addEventListener('scroll', onScroll, { passive: true });
// press haptics on cards
page.addEventListener('pointerdown', (e) => { if (e.target.closest('.yf-press') && !e.target.closest('.yf-remind')) H('tick'); });

// ─── carousels: every one loops ────────────────────────────────────────────────────────────────────────────────
// One engine for all of them: a continuous position `pos` (in items) that a drag moves 1 : 1, a flick carries its
// speed into a spring (stiffness 240, damping 30.4 — ζ .98, no visible overshoot) which lands on a whole item, and every item is
// placed from its wrapped distance to `pos` — so there is no first or last card, the row just keeps going round.
// Axis-locked: a mostly-vertical drag is left to the page's scroll. One selection tick per item that lands.
function loopCarousel({ stage, count, step, place, tapToFocus = false }) {
  let n = count, pos = 0, vel = 0, target = 0, raf = 0, drag = null, landed = 0, idleUntil = 0;
  const norm = (i) => ((i % n) + n) % n;
  const wrapD = (i) => { let d = i - pos; d -= Math.round(d / n) * n; return d; };
  const render = () => place(wrapD);
  function run() {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      for (let h = dt; h > 1e-6; h -= 1 / 240) { const k = Math.min(h, 1 / 240); vel += (240 * (target - pos) - 30.4 * vel) * k; pos += vel * k; }   // ζ .98: lands without a wobble
      const at = norm(Math.round(target));
      if (at !== landed && Math.abs(target - pos) < 0.5) { landed = at; H('tick'); }
      if (Math.abs(target - pos) < 0.0015 && Math.abs(vel) < 0.01) { pos = target = norm(Math.round(target)); vel = 0; render(); raf = 0; return; }
      render(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  const go = (t) => { target = t; if (!raf) run(); };
  stage.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    cancelAnimationFrame(raf); raf = 0;
    drag = { x: e.clientX, y: e.clientY, p0: pos, t: performance.now(), lx: e.clientX, v: 0, axis: null, id: e.pointerId, item: e.target.closest('[data-i]') };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 6) { drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (drag.axis === 'x') stage.setPointerCapture(e.pointerId); }
    if (drag.axis !== 'x') return;
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    drag.v = 0.8 * ((e.clientX - drag.lx) / dt) + 0.2 * drag.v; drag.lx = e.clientX; drag.t = now;
    pos = drag.p0 - dx / step; vel = 0; target = pos; render();
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; idleUntil = performance.now() + 8000;
    if (d.axis === 'x') { const v = -d.v * 1000 / step; vel = v; go(Math.round(pos + Math.max(-1.4, Math.min(1.4, v * 0.18)))); }
    else if (!d.axis && tapToFocus && d.item) go(Math.round(pos + wrapD(+d.item.dataset.i)));   // a tap on a side item brings it forward
    else go(Math.round(pos));
  };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  return {
    wrapD, go,
    get target() { return target; }, get busy() { return !!drag || performance.now() < idleUntil; },
    jump(i) { cancelAnimationFrame(raf); raf = 0; pos = target = landed = i; vel = 0; render(); },
    resize(m) { n = m; pos = target = landed = 0; vel = 0; render(); },
  };
}

// the hero: a 3D cover-flow of noon's top deals. Each card is placed by a projective transform (matrix3d) that maps
// its 232 × 282.7 face onto a quad: the Figma card's rectangle in the middle, Figma's tilted "peek" trapezoids on
// either side, a smaller one further out (faded). Interpolating the quads tilts the cards smoothly as they turn.
// It drifts on by itself every 4.5 s until touched.
const hero = (() => {
  const stage = $('.yf-hero'), cards = [...stage.querySelectorAll('.yf-hc')], N = cards.length;
  const CW = 232, CH = 282.7;
  // quads (TL, TR, BR, BL) in stage coordinates (the stage sits at page 0, 249 — the Figma card's top)
  const Q = {
    0: [[71.5, 0], [303.5, 0], [303.5, 282.7], [71.5, 282.7]],   // (centred: Figma's sat at 71)
    1: [[315.7, 22], [419.7, 76.7], [419.7, 213.7], [315.7, 260.7]],
    2: [[430, 66], [490, 98], [490, 180], [430, 212]],
  };
  const mirror = (q) => [[375 - q[1][0], q[1][1]], [375 - q[0][0], q[0][1]], [375 - q[3][0], q[3][1]], [375 - q[2][0], q[2][1]]];
  const quadAt = (d) => {                                         // d: signed distance from the centre, in cards
    const a = Math.min(2, Math.abs(d)), k = Math.floor(Math.min(a, 1.999)), t = a - k;
    const q = Q[k].map((p, j) => [p[0] + (Q[k + 1][j][0] - p[0]) * t, p[1] + (Q[k + 1][j][1] - p[1]) * t]);
    return d < 0 ? mirror(q) : q;
  };
  // the square-to-quad homography (Heckbert), as a CSS matrix3d for a w × h element with its origin at 0 0
  function m3d(q, w, h) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
    const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    const den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
    const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
    const f = (v) => +v.toFixed(6);
    return `matrix3d(${f(a / w)},${f(d / w)},0,${f(g / w)},${f(b / h)},${f(e / h)},0,${f(hh / h)},0,0,1,0,${f(x0)},${f(y0)},0,1)`;
  }
  const loop = loopCarousel({ stage, count: N, step: 180, tapToFocus: true, place: (wrapD) => cards.forEach((c, i) => {
    const d = wrapD(i), a = Math.abs(d);
    c.style.transform = m3d(quadAt(d), CW, CH);
    c.style.opacity = a >= 2 ? 0 : a <= 1 ? 1 : (2 - a).toFixed(3);
    c.style.zIndex = String(10 - Math.round(a * 3));
    c.style.setProperty('--dim', Math.min(1, a).toFixed(3));        // side cards dim (Figma: 60 %), captions fade
    c.style.visibility = a >= 2 ? 'hidden' : '';
  }) });
  stage.addEventListener('click', (e) => e.preventDefault());
  setInterval(() => { if (live && !loop.busy && !document.hidden && window.orbi && window.orbi.pageOpen) loop.go(Math.round(loop.target) + 1); }, 4500);
  return {
    jump: loop.jump,
    roles() { assignRoles(cards.map((c) => c.querySelector('.in')), loop.wrapD, { 0: 'card', '-1': 'peekL', 1: 'peekR' }); },
  };
})();
// the reveal's beats go to whichever items are in those slots now; the rest are simply there
function assignRoles(els, wrapD, map) {
  els.forEach((el, i) => {
    const k = map[Math.round(wrapD(i))];
    el.dataset.k = k || '';
    if (!k) { el.getAnimations().forEach((a) => a.cancel()); el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1, fill: 'both' }); }
  });
}

// the coupons: the hero coupon in the middle, smaller ones either side (Figma's three), on round — the three offers
// twice over, so one is always coming in from the edge
const coupons = (() => {
  const stage = $('.yf-coupons'), slots = [...stage.querySelectorAll('.yf-cslot')], N = slots.length;
  // by distance from the middle: centre x, top, scale (the 168 × 224 coupon; Figma's side ones are 126 × 168 = 75 %)
  // (Figma's row sat 15.8 px left of centre; the hero coupon is centred now, the side ones 20 px either side)
  const S = [{ cx: 187.5, y: 0, s: 1 }, { cx: 167, y: 28, s: 0.75 }, { cx: 307, y: 56, s: 0.6 }, { cx: 420, y: 70, s: 0.5 }];
  const at = (d) => {
    const a = Math.min(3, Math.abs(d)), k = Math.min(2, Math.floor(a)), t = a - k, A = S[k], B = S[k + 1];
    const off = k === 0 ? B.cx * t : A.cx + (B.cx - A.cx) * t;
    return { cx: 187.5 + Math.sign(d) * off, y: A.y + (B.y - A.y) * t, s: A.s + (B.s - A.s) * t };
  };
  const loop = loopCarousel({ stage, count: N, step: 167, tapToFocus: true, place: (wrapD) => slots.forEach((el, i) => {
    const d = wrapD(i), p = at(d);
    el.style.transform = `translate3d(${(p.cx - 84 * p.s).toFixed(2)}px, ${p.y.toFixed(2)}px, 0) scale(${p.s.toFixed(4)})`;
    el.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
  }) });
  return {
    jump: loop.jump,
    roles() { assignRoles(slots.map((s) => s.firstElementChild), loop.wrapD, { '-1': 'cp0', 0: 'cp1', 1: 'cp2' }); },
  };
})();

// the product rows (Wishlist, Restock): cards 146.3 wide, 16 apart, from the 16 px margin, going round
const rows = {};
for (const row of $$('.yf-inv')) {
  const rail = row.querySelector('.rail'), pad = +row.dataset.pad, PITCH = 146.3 + M;   // (cards as far apart as the margin: the one before sits just off the edge)
  let els = [];
  const loop = loopCarousel({ stage: row, count: 1, step: PITCH, place: (wrapD) => els.forEach((el, i) => {
    let d = wrapD(i); if (d < -1.5) d += els.length;                   // (a row runs left → right: keep one card to spare on the left)
    el.style.transform = `translate3d(${(pad + d * PITCH).toFixed(2)}px, 0, 0)`;
  }) });
  rows[row.id] = {
    set(items) {
      let list = items; while (list.length * PITCH < 375 + 3 * PITCH) list = list.concat(items);   // enough cards to fill the turn
      rail.innerHTML = list.map((it, i) => `<div class="yf-li" data-i="${i}">${icCard(it)}</div>`).join('');
      els = [...rail.children]; loop.resize(els.length);
    },
    jump: loop.jump,
    cards: () => els.map((el) => el.firstElementChild).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left),
  };
}
rows.yfWish.set(DATA.wish);
rows.yfRestock.set(DATA.restock[0]);
hero.jump(1); coupons.jump(1);

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
  curate.style.top = `${spot.cy + spot.unit + 34}px`;
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
  window.orbi.setState('idle');
  window.orbi.stage(null);                                     // the bot springs up to its corner…
  H('tick');
  setTimeout(() => { if (window.orbi.pageOpen) reveal(); }, 90);   // …and the page arrives behind it
}
function curateCancel() {
  curating = false; clearTimeout(curateT);
  curate.getAnimations().forEach((a) => a.cancel());
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
