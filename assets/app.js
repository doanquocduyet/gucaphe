/* ============================================================
   APP.JS — ENGINE · GU CÀ PHÊ
   Đọc data.js → tự sinh mọi trang.
   Giọng thương hiệu: curator có gu — ít chữ, chắc, không hô hào.
   ============================================================ */
/* Bật :active trên iOS (Safari chỉ áp :active khi trang có listener touch) */
try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){}

const $ = s => document.querySelector(s);
const money   = n => n == null ? '' : n.toLocaleString('vi-VN') + '₫';
const per100  = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const get     = id => SP.find(x => x.id === id);
const reviewUrl = p => p && p.slug ? `/review/${p.slug}` : null;

/* ============ ĐO LƯỜNG — FUNNEL QUYẾT ĐỊNH ============
   Tự bật khi SITE.ga4 có Measurement ID. Nếu trống thì im lặng,
   trang chạy y nguyên. Mọi sự kiện cũng đẩy vào dataLayer (sẵn cho GTM). */
(function initGA() {
  const id = (typeof SITE !== 'undefined' && SITE.ga4) ? SITE.ga4.trim() : '';
  window.dataLayer = window.dataLayer || [];
  if (!id) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
})();
function track(ev, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', ev, params || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: ev }, params || {}));
  } catch (e) {}
}

/* ---- Affiliate click — sự kiện tiền + mở sàn (mặc định Shopee, sẵn cho Lazada/Tiki) ---- */
let CLICK = 0;
const CHANNELS = { shopee: 'link', lazada: 'lazada', tiki: 'tiki' };
function aff(id, channel, pos) {
  CLICK++;
  const p = get(id); if (!p) return;
  channel = channel || 'shopee';
  const url = p[CHANNELS[channel] || 'link'];
  track('affiliate_click', {
    item_id: id, item_brand: p.brand, item_name: p.ten,
    price: p.gia, per100: per100(p), value: p.gia, currency: 'VND',
    channel, tested: p.tested ? 1 : 0, position: pos || 'unknown'
  });
  if (url && url !== '#') window.open(url, '_blank', 'noopener');
}

/* ---- Nhãn nút mua theo nơi bán thật (Shopee vs trang chính hãng) ---- */
const isShopee = p => /shopee\./i.test(p.link || '');
const buyLabel = p => 'Mua gói này';

/* ---- Nút mua: hiện giá ngay trên nút (neo giá) + kênh phụ nếu có link ---- */
function buyCTA(p, pos, label) {
  const ch = isShopee(p) ? 'shopee' : 'brand';
  const main = `<button class="cta" onclick="aff('${p.id}','${ch}','${pos}')">${label || T(buyLabel(p))} · ${money(p.gia)}</button>`;
  const alts = [];
  if (p.lazada) alts.push(`<button class="cta-alt" onclick="aff('${p.id}','lazada','${pos}')">Lazada</button>`);
  if (p.tiki)   alts.push(`<button class="cta-alt" onclick="aff('${p.id}','tiki','${pos}')">Tiki</button>`);
  return main + (alts.length ? `<div class="cta-alts"><span>Hoặc:</span>${alts.join('')}</div>` : '');
}

/* ---- Expert cues: vùng · giống · sơ chế · rang — tín hiệu chuyên môn ---- */
const cues = p => {
  const bits = [p.xaHuyen, p.giong, p.process, p.roast ? 'Rang ' + p.roast.toLowerCase() : null]
    .filter(Boolean);
  return bits.length ? `<div class="cues">${bits.join('<i>·</i>')}</div>` : '';
};

/* ---- Màu swatch theo độ rang (dùng cho thẻ gợi ý khi không có ảnh) ---- */
const ROAST_BG = {
  'Light':'#C9A876','Light-medium':'#B08D5B','Medium':'#8A6A44',
  'Medium-dark':'#5E4530','Dark':'#3B2A1C'
};

/* ============ i18n cho trang chủ (nội dung render động) ============
   T(vi) trả bản tiếng Anh khi đang ở chế độ EN, ngược lại giữ tiếng Việt.
   Chuỗi chưa có trong HOME_EN → giữ nguyên tiếng Việt. */
const HOME_EN = {
  // Picker — khung
  "Gợi ý riêng": "For you",
  "Chọn giúp bạn": "Let us choose",
  "Cho chúng tôi biết gu của bạn — chúng tôi chốt một gói hợp nhất.": "Tell us your taste — we'll pick the one pack for you.",
  "Chọn lại từ đầu": "Start over",
  "Bạn thích ly cà phê thế nào?": "How do you like your coffee?",
  "Chưa rõ gu của mình — cứ chọn giúp tôi →": "Not sure yet — just pick for me →",
  "Bạn pha bằng gì?": "How do you brew?",
  "Lần trước bạn dừng ở": "Last time you stopped at",
  "Lần trước bạn chọn": "Last time you chose",
  "Vẫn vậy chứ?": "Still the same?",
  "chưa rõ gu": "not sure yet",
  // Taste labels
  "Chua sáng, trái cây": "Bright & fruity", "Floral, cam chanh, mọng nước": "Floral, citrus, juicy",
  "Cân bằng, dễ uống": "Balanced, easy", "Không quá chua, không gắt": "Not too sour, not harsh",
  "Đậm, chocolate": "Bold, chocolate", "Đậm đà, đầy miệng, ít chua": "Rich, full-bodied, low acidity",
  // Brew labels
  "Phin": "Phin", "Pha phin truyền thống": "Traditional Vietnamese filter",
  "V60 · Pour over": "V60 · Pour over", "Rót tay, giấy lọc": "Hand-poured, paper filter",
  "Máy · Espresso": "Machine · Espresso", "Espresso, latte": "Espresso, latte",
  "Cold brew": "Cold brew", "Ủ lạnh, uống mát": "Cold-steeped, served cool",
  "Máy": "Machine",
  // Picker result
  "Gợi ý cho bạn": "Our pick for you",
  "về gói gợi ý": "back to our pick",
  "Bạn muốn": "You want", "vậy gói này": "then this one",
  "pha": "brewed", "chúng tôi chọn": "we choose",
  "Dành cho": "For", "Thích": "You like", "mọi vị": "any taste", "người mới bắt đầu": "beginners",
  "Đã uống": "Tasted", "Chưa nếm": "Not tasted yet",
  "Đọc review đầy đủ →": "Read full review →",
  "Hợp nếu": "Good if", "Cân nhắc nếu": "Consider if",
  "Vẫn chưa ưng?": "Still not it?", "Chưa đúng gu?": "Not your taste?", "Đổi nhanh:": "Switch fast:",
  "Đây là gói khớp gu bạn nhất trong danh mục hiện tại.": "This is the best match for your taste in our current lineup.",
  // verdict
  "Gói hợp cách pha của bạn nhất — chúng tôi đã uống thật và thấy ngon; chưa chấm mù nên chưa gắn số.": "The best match for how you brew — we've drunk it for real and liked it; not cupped blind yet, so no score.",
  "Gói hợp cách pha của bạn nhất — chúng tôi chưa thử, nên ghi rõ để bạn cân nhắc.": "The best match for how you brew — we haven't tried it yet, so we flag it for you.",
  "Nếu đây là ly specialty đầu tiên của bạn, gần như không thể chọn sai gói này.": "If this is your first specialty cup, it's almost impossible to go wrong with this one.",
  "Trong tất cả gói chúng tôi đã nếm mù, đây là gói bạn khó thất vọng nhất.": "Of everything we've tasted blind, this is one of the hardest coffees not to like.",
  "Hợp gu bạn và an toàn — rất khó để hối tiếc khi bắt đầu bằng gói này.": "Matches your taste and safe — very hard to regret starting here.",
  // Negotiation
  "Đắt quá": "Too pricey", "rẻ hơn": "cheaper",
  "Chua sáng hơn": "Brighter", "chua sáng, trái cây hơn": "brighter and fruitier",
  "Đậm hơn": "Bolder", "đậm đà, đầy miệng hơn": "bolder and fuller",
  "Dễ uống hơn": "Easier", "nhẹ đô, dễ uống hơn": "lighter and easier",
  // Buy button
  "Mua gói này": "Buy this pack",
  // Peak
  "Độc lập biên tập": "Editorially independent",
  "Không có bài viết tài trợ.<br>Không có điểm số cho thứ chúng tôi": "No sponsored posts.<br>No score for anything we",
  "chưa bỏ vào miệng": "haven't put in our mouths",
  // Hubs
  "Cà phê": "Coffee", "Nhà rang": "Roasters", "Vùng trồng": "Regions", "Kiến thức": "Learn",
  "Khám phá": "Explore",
  "Đi thẳng vào thứ bạn cần.": "Go straight to what you need.",
  "Mọi thứ được sắp theo đúng nhu cầu.": "Everything arranged around what you need.",
  "Danh mục gói đặc sản — đã nếm mù, chấm điểm, quy giá về 100g.": "Our specialty packs — tasted blind, scored, priced per 100g.",
  "Đã nếm mù · đã uống thật": "Tasted blind · drunk for real",
  "Xem tất cả →": "See all →",
  "Hồ sơ các nhà rang Lâm Đồng chúng tôi chọn đồng hành, xếp theo vùng nguyên liệu.": "Profiles of the Lâm Đồng roasters we work with, grouped by sourcing region.",
  "Chọn lọc · thực địa": "Curated · on the ground",
  "Xem hồ sơ →": "See profiles →",
  "Cầu Đất · Lạc Dương · Nam Ban — mỗi vùng một chất vị.": "Cầu Đất · Lạc Dương · Nam Ban — each region its own character.",
  "Tiểu vùng Lâm Đồng": "Lâm Đồng sub-regions",
  "Tìm hiểu →": "Learn more →",
  "Natural/Washed, độ rang, specialty đắt ở đâu — đọc trước khi mua.": "Natural vs washed, roast levels, why specialty costs more — read before you buy.",
  "Đọc trước khi mua": "Read before buying",
  "Đọc →": "Read →",
  // Tagline
  "Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.": "We buy it, taste it blind, and score it — so you don't have to guess.",

  /* ---- Bullet "Hợp nếu / Cân nhắc nếu" của rec-card (chỉ hiện ở Home) ---- */
  "Pha V60 hoặc pour over": "You brew V60 or pour over",
  "Thích vị trái cây, chua sáng": "You like bright, fruity cups",
  "Chấp nhận 108.000₫/100g cho hạt tốt": "You'll pay 108,000₫/100g for great beans",
  "Chỉ có phin — rang sáng pha phin dễ chua gắt": "A phin is all you have — light roast can turn sharp in it",
  "Quen gu đậm đắng": "You're used to dark, bitter coffee",
  "Muốn cà phê uống hằng ngày giá mềm": "You want a cheap everyday cup",
  "Muốn thử giống hiếm Pacamara": "You want to try the rare Pacamara variety",
  "Pha V60 / pour over để tôn hương": "You brew V60 / pour over to lift the aromatics",
  "Thích khám phá lô lên men": "You enjoy exploring fermented lots",
  "Chủ yếu pha phin đậm sữa": "You mostly make strong phin with milk",
  "Thích vị quen, an toàn": "You prefer familiar, safe flavours",
  "Thích Arabica giống lâu năm": "You like old-variety Arabica",
  "Thích vị chua sáng, cam chanh": "You like bright, citrusy cups",
  "Thích vị đậm kiểu Robusta": "You like bold, Robusta-style coffee",
  "Chủ yếu pha phin (rang sáng dễ chua gắt)": "You mostly brew phin (light roast can turn sharp)",
  "Thích ngọt dày, trái cây nhiệt đới": "You like deep sweetness and tropical fruit",
  "Muốn một gói pha kiểu gì cũng hợp": "You want one pack that works with any brew",
  "Mê cold brew ngọt mát": "You love smooth, sweet cold brew",
  "Thích chua sáng gắt thuần rang nhạt": "You want sharp, purely light-roast acidity",
  "Tìm single-origin lô rõ vùng": "You're after a single-origin with a clear lot",
  "Muốn thử đặc sản đạt giải quốc tế": "You want an internationally awarded specialty",
  "Gu đậm đà": "You like it bold and full",
  "Pha phin hoặc espresso": "You brew phin or espresso",
  "Ngân sách rất eo hẹp": "You're on a very tight budget",
  "Thích chua sáng nhẹ kiểu Arabica": "You prefer light, bright Arabica",
  "Gu phin Việt truyền thống, dễ uống": "You like easy, traditional Vietnamese phin",
  "Muốn blend Robusta-Arabica cân bằng": "You want a balanced Robusta–Arabica blend",
  "Uống phin hằng ngày, giá mềm": "You drink phin daily and want it affordable",
  "Thích chua sáng, trái cây kiểu Arabica rang sáng": "You like bright, fruity light-roast Arabica",
  "Tìm single-origin rõ lô, rõ vùng": "You're after a single-origin with a clear lot and region",
  "Chủ yếu pha pour over / V60": "You mostly brew pour over / V60",
  "Mới uống đặc sản": "You're new to specialty coffee",
  "Thích ngọt trái cây, chocolate sữa": "You like fruity sweetness and milk chocolate",
  "Pha phin hoặc pha máy": "You brew phin or a machine",
  "Muốn dòng đạt giải quốc tế": "You want an award-winning lot",
  "Thích rang nhạt, chua sáng gắt": "You want sharp, bright light roasts",
  "Pha máy espresso, moka pot": "You brew espresso or moka pot",
  "Thích Arabica chua thanh, hậu ngọt": "You like clean-acidity Arabica with a sweet finish",
  "Muốn single-origin Cầu Đất giá mềm": "You want an affordable Cầu Đất single-origin",
  "Gu đậm đắng kiểu Robusta": "You like bold, bitter Robusta",
  "Chủ yếu uống phin đậm sữa": "You mostly drink strong phin with milk",
  "Pha máy espresso, moka pot tại nhà": "You brew espresso or moka pot at home",
  "Gu đậm vừa, ít gắt": "You like it moderately bold and smooth",
  "Muốn chọn tỉ lệ Robusta/Arabica": "You want to pick the Robusta/Arabica ratio",
  "Thích chua sáng thuần Arabica rang nhạt": "You want bright, pure light-roast Arabica",
  "Thích chua sáng, trái cây, caramel": "You like bright fruit and caramel",
  "Pha V60 / pour over hoặc cold brew": "You brew V60 / pour over or cold brew",
  "Muốn gói rang sẵn, pha ngay": "You want roasted beans ready to brew",
  "Thích vị đậm, socola": "You like bold, chocolatey cups",
  "Gu đậm, mạnh, socola đắng": "You like bold, strong, dark-chocolate coffee",
  "Pha phin, moka pot, espresso, French press": "You brew phin, moka pot, espresso or French press",
  "Muốn gói ngon giá mềm (50k/100g)": "You want a great pack that stays cheap (50k/100g)",
  "Thích chua sáng, trái cây": "You like bright, fruity cups",
  "Muốn gói rang sáng pha pour over": "You want a light roast for pour over"
};
function LANG() { return (window.guGetLang ? window.guGetLang() : 'vi'); }
function T(vi) { return (LANG() === 'en' && HOME_EN[vi] != null) ? HOME_EN[vi] : vi; }

/* ============ 1 · HERO — lời hứa, không phải quảng cáo ============ */
function renderTop() {
  $('#top').innerHTML = `
    <div class="hero-stage">
      <picture class="hero-bg">
        <source media="(min-width:861px)" srcset="assets/img/hero/brew-wide.jpg">
        <img src="assets/img/hero/pour.jpg" alt="Cà phê đặc sản Lâm Đồng — pha thủ công" fetchpriority="high">
      </picture>
      <div class="hero-scrim"></div>
      <div class="hero-inner">
        <div class="hero-eyebrow" data-i18n="Cà phê đặc sản · Lâm Đồng">Cà phê đặc sản · Lâm Đồng</div>
        <h1 data-i18n="Chưa uống thì không chấm">Chưa uống<br>thì không chấm</h1>
        <div class="hero-sign" data-i18n="Mua thật · Nếm mù · Chấm điểm">Mua thật · Nếm mù · Chấm điểm</div>
        <p class="hero-note" data-i18n="Nếm mù = uống thử che nhãn, che giá — để chấm cho công bằng."><b>Nếm mù</b> = uống thử che nhãn, che giá — để chấm cho công bằng.</p>
        <div class="hero-cta-row">
          <button class="cta" data-i18n="Chọn đúng gu trong 15 giây" onclick="document.querySelector('#pick').scrollIntoView({behavior:'smooth'})">Chọn đúng gu trong 15 giây</button>
          <button class="cta-ghost" data-i18n="Phương pháp đánh giá" onclick="location.href='/cach-test'">Phương pháp đánh giá</button>
        </div>
      </div>
    </div>
    <div class="hero-proof">
      <div class="wrap hero-proof-in">
        <span class="hp-item" data-i18n="Không nhận bài tài trợ">Không nhận bài tài trợ</span>
        <a class="hp-newbie" href="/bat-dau" data-i18n="Mới uống cà phê? Bắt đầu →">Mới uống cà phê? Bắt đầu →</a>
      </div>
    </div>`;
}

/* ============ 2 · DECISION ENGINE v2 — dẫn dắt, không chỉ trả lời ============
   Intent (gu vị) → Context (cách pha) → chọn 1 gói + VÌ SAO hợp bạn
   + điều bạn có thể chưa thích + nếu không hợp thì thử gói khác.
   Ghi nhớ lựa chọn bằng localStorage (adaptive, không cần login).
   Gu vị chấm trên dữ liệu chua/đậm thật của từng gói — không bịa. */
const INTENTS = [
  { k:'phin',     label:'Phin',           sub:'Pha phin truyền thống', match:p => p.pha.includes('phin') },
  { k:'v60',      label:'V60 · Pour over',sub:'Rót tay, giấy lọc',      match:p => p.pha.includes('v60') },
  { k:'espresso', label:'Máy · Espresso', sub:'Espresso, latte',        match:p => /dark/i.test(p.roast||'') || p.pha.includes('espresso') },
  { k:'coldbrew', label:'Cold brew',      sub:'Ủ lạnh, uống mát',       match:p => p.pha.includes('coldbrew') }
];
const TASTES = [
  { k:'sang',    label:'Chua sáng, trái cây', sub:'Floral, cam chanh, mọng nước' },
  { k:'canbang', label:'Cân bằng, dễ uống',   sub:'Không quá chua, không gắt' },
  { k:'dam',     label:'Đậm, chocolate',       sub:'Đậm đà, đầy miệng, ít chua' }
];
const TLAB = {}; TASTES.forEach(t => TLAB[t.k] = t.label);
const BLAB = {}; INTENTS.forEach(t => BLAB[t.k] = t.label.replace(/\s·.*/, ''));

/* Ước lượng gu vị từ thuộc tính KHÁCH QUAN (độ rang · giống · sơ chế) —
   CHỈ dùng để XẾP HẠNG gợi ý, KHÔNG bao giờ hiển thị như điểm cảm quan.
   Gói đã nếm mù có chua/đậm THẬT thì luôn ưu tiên số thật; gói chưa nếm thì
   suy ra khuynh hướng vị để không gợi ý ngược gu (vd Robusta rang đậm cho
   người thích 'chua sáng'). Đây là ước lượng để sắp xếp, không phải điểm chấm. */
function estTaste(p) {
  if (p.chua != null && p.dam != null) return { chua: p.chua, dam: p.dam };
  let c = 3, d = 3;
  const roast = (p.roast || '').toLowerCase();
  const giong = (p.giong || '').toLowerCase();
  const proc  = (p.process || '').toLowerCase();
  if (/medium[\s-]*light|light[\s-]*medium/.test(roast)) { c += 0.5; d -= 0.1; }
  else if (/light|sáng/.test(roast))  { c += 1.2; d -= 0.6; }
  else if (/dark|đậm/.test(roast))    { c -= 1.2; d += 1.2; }
  else if (/medium/.test(roast))      { d += 0.3; }
  if (/robusta/.test(giong))          { c -= 1.6; d += 1.6; }
  else if (/arabica|bourbon|catimor|caturra|typica|heirloom|pacamara|cherry/.test(giong)) { c += 0.3; }
  if (/natural/.test(proc))           { d += 0.5; c -= 0.2; }
  else if (/washed/.test(proc))       { c += 0.4; }
  const clamp = x => Math.max(1, Math.min(5, x));
  return { chua: p.chua != null ? p.chua : clamp(c), dam: p.dam != null ? p.dam : clamp(d) };
}
const ec = p => estTaste(p).chua;
const ed = p => estTaste(p).dam;

/* Điểm hợp = gu vị (chua/đậm thật hoặc ước lượng khách quan) + cách pha + độ tin cậy.
   Gu vị được ưu tiên hơn cách pha — không gợi ý gói ngược gu chỉ vì trùng cách pha. */
function fit(p, taste, brew) {
  const { chua, dam } = estTaste(p);
  let s = 0;
  if (taste === 'sang')    s += chua * 2 - dam * 0.6;
  if (taste === 'canbang') s += 6 - (Math.abs(chua - 3) + Math.abs(dam - 3));
  if (taste === 'dam')     s += dam * 2 - chua * 0.6;
  if (taste === 'moi')     s += (p.tested ? 4 : 0) + (6 - (Math.abs(chua - 3) + Math.abs(dam - 3))) + p.pha.length;
  // Cách pha: thưởng nếu gói pha được kiểu này, PHẠT NẶNG nếu không —
  // để không bao giờ gợi ý gói mà chính card của nó ghi "hợp cách pha khác".
  const it = INTENTS.find(x => x.k === brew);
  if (brew && it) s += it.match(p) ? 2.5 : -4;
  s += p.tested ? 1.5 : 0;
  return s;
}
const rank = (taste, brew) => SP
  .map(p => ({ p, s: fit(p, taste, brew) }))
  .sort((a, b) => b.s - a.s || (b.p.diem || 0) - (a.p.diem || 0));

/* ---- NEGOTIATION: recommendation là đối thoại, không phải output cố định.
   Mỗi phản đối ("đắt quá", "muốn đậm hơn") chỉ hiện khi CÓ gói tốt hơn theo trục đó. ---- */
const OBJ = [
  { k:'cheap',  label:'Đắt quá',      say:'rẻ hơn',              better:(p,c)=>per100(p) && per100(p) < per100(c), rk:(a,b)=>per100(a)-per100(b) },
  { k:'bright', label:'Chua sáng hơn',say:'chua sáng, trái cây hơn', better:(p,c)=>ec(p) > ec(c),  rk:(a,b)=>ec(b)-ec(a) },
  { k:'bold',   label:'Đậm hơn',      say:'đậm đà, đầy miệng hơn',   better:(p,c)=>ed(p) > ed(c),  rk:(a,b)=>ed(b)-ed(a) },
  { k:'easy',   label:'Dễ uống hơn',  say:'nhẹ đô, dễ uống hơn', better:(p,c)=>ed(p) < ed(c),  rk:(a,b)=>ed(a)-ed(b) }
];
const availObj = cur => OBJ.filter(o => SP.some(p => p.id !== cur.id && o.better(p, cur)));
function resolveObj(o, cur) {
  return SP.filter(p => p.id !== cur.id && o.better(p, cur))
    .sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0) || o.rk(a, b))[0];
}

/* ---- COGNITIVE COMPRESSION: một câu chốt trước, con số ở dưới ---- */
function verdict(p, taste) {
  if (!(p.tested && p.diem != null))
    return p.daUong
      ? T('Gói hợp cách pha của bạn nhất — chúng tôi đã uống thật và thấy ngon; chưa chấm mù nên chưa gắn số.')
      : T('Gói hợp cách pha của bạn nhất — chúng tôi chưa thử, nên ghi rõ để bạn cân nhắc.');
  if (taste === 'moi')
    return T('Nếu đây là ly specialty đầu tiên của bạn, gần như không thể chọn sai gói này.');
  const top = Math.max(...SP.filter(x => x.tested && x.diem != null).map(x => x.diem));
  if (p.diem === top)
    return T('Trong tất cả gói chúng tôi đã nếm mù, đây là gói bạn khó thất vọng nhất.');
  return T('Hợp gu bạn và an toàn — rất khó để hối tiếc khi bắt đầu bằng gói này.');
}

let TASTE = null, BREW = null, CURID = null, NEGO = null;
try { TASTE = localStorage.getItem('gu_taste'); BREW = localStorage.getItem('gu_brew'); } catch (e) {}
const memPick = () => { try { return get(localStorage.getItem('gu_pick')); } catch (e) { return null; } };

function renderPick() {
  const back = TASTE || BREW;
  $('#pick').innerHTML = `
    <div class="decide-panel">
      <div class="decide-head">
        <div class="decide-kicker">${T('Gợi ý riêng')}</div>
        <h2 class="decide-title">${T('Chọn giúp bạn')}</h2>
        <p class="decide-lead">${T('Cho chúng tôi biết gu của bạn — chúng tôi chốt một gói hợp nhất.')}</p>
        ${back ? `<div class="decide-back">${memPick() ? `${T('Lần trước bạn dừng ở')} <b>${memPick().brand} · ${memPick().ten}</b>. ${T('Vẫn vậy chứ?')}` : `${T('Lần trước bạn chọn')} <b>${TASTE === 'moi' ? T('người mới bắt đầu') : (T(TLAB[TASTE]) || T('chưa rõ gu'))}</b>${BREW ? ` · <b>${T(BLAB[BREW])}</b>` : ''}. ${T('Vẫn vậy chứ?')}`}
          <button class="decide-reset" onclick="deReset()">${T('Chọn lại từ đầu')}</button></div>` : ''}
      </div>

      <div class="de-step">
        <div class="de-q"><span class="de-n">1</span> ${T('Bạn thích ly cà phê thế nào?')}</div>
        <div class="decide-chips de-taste">
          ${TASTES.map(t => `<button class="dchip${t.k === TASTE ? ' on' : ''}" data-k="${t.k}" onclick="deTaste('${t.k}')"><b>${T(t.label)}</b><span>${T(t.sub)}</span></button>`).join('')}
        </div>
        <button class="de-skip${TASTE === 'moi' ? ' on' : ''}" onclick="deTaste('moi')">${T('Chưa rõ gu của mình — cứ chọn giúp tôi →')}</button>
      </div>

      <div class="de-step de-step2${TASTE ? ' show' : ''}">
        <div class="de-q"><span class="de-n">2</span> ${T('Bạn pha bằng gì?')}</div>
        <div class="decide-chips de-brew">
          ${INTENTS.map(it => `<button class="dchip${it.k === BREW ? ' on' : ''}" data-k="${it.k}" onclick="deBrew('${it.k}')"><b>${T(it.label)}</b><span>${T(it.sub)}</span></button>`).join('')}
        </div>
      </div>

      <div id="decide-out"></div>
    </div>`;
  if (TASTE) drawRec();
}

function deTaste(k) {
  TASTE = k; CURID = null; NEGO = null; track('taste_select', { taste: k });
  try { localStorage.setItem('gu_taste', k); } catch (e) {}
  document.querySelectorAll('.de-taste .dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  const skip = document.querySelector('.de-skip'); if (skip) skip.classList.toggle('on', k === 'moi');
  const s2 = document.querySelector('.de-step2'); if (s2) s2.classList.add('show');
  drawRec();
}
function deBrew(k) {
  BREW = k; CURID = null; NEGO = null; track('brew_select', { brew: k });
  try { localStorage.setItem('gu_brew', k); } catch (e) {}
  document.querySelectorAll('.de-brew .dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  drawRec();
  const out = document.getElementById('decide-out');
  if (out) out.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deReset() {
  TASTE = null; BREW = null; CURID = null; NEGO = null;
  try { localStorage.removeItem('gu_taste'); localStorage.removeItem('gu_brew'); localStorage.removeItem('gu_pick'); } catch (e) {}
  renderPick(); $('#pick').scrollIntoView({ behavior: 'smooth' });
}
/* Đàm phán: người dùng phản đối → đổi gói theo trục đó */
function deObj(k) {
  const cur = CURID ? get(CURID) : rank(TASTE, BREW)[0].p;
  const o = OBJ.find(x => x.k === k); if (!o) return;
  const next = resolveObj(o, cur); if (!next) return;
  track('negotiate', { objection: k, from: cur.id, to: next.id });
  CURID = next.id; NEGO = o.say; drawRec();
  const out = document.getElementById('decide-out');
  if (out) out.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deBase() { CURID = null; NEGO = null; drawRec(); }

function drawRec() {
  const out = document.getElementById('decide-out'); if (!out) return;
  const base = rank(TASTE, BREW)[0].p;
  const best = CURID ? (get(CURID) || base) : base;
  try { localStorage.setItem('gu_pick', best.id); } catch (e) {}
  track('recommendation_shown', {
    item_id: best.id, item_name: best.ten, taste: TASTE, brew: BREW || null,
    negotiated: CURID ? 1 : 0, tested: best.tested ? 1 : 0, score: best.diem
  });
  const tlabel = T(TASTE === 'moi' ? 'người mới bắt đầu' : (TLAB[TASTE] || 'mọi vị'));
  const speak = NEGO
    ? `${T('Bạn muốn')} <b>${T(NEGO)}</b> → ${T('vậy gói này')}`
    : `${T(TASTE === 'moi' ? 'Dành cho' : 'Thích')} <b>${tlabel}</b>${BREW ? ` · ${T('pha')} <b>${T(BLAB[BREW])}</b>` : ''} → ${T('chúng tôi chọn')}`;
  const objs = availObj(best);
  const src = best.anh ? (/^https?:/.test(best.anh) ? best.anh : '/' + best.anh) : '';
  const badge = (best.tested && best.diem != null)
    ? `<span class="rec-badge rec-badge-score">${best.diem}<i>/10</i></span>`
    : (best.daUong ? `<span class="rec-badge rec-badge-tasted">${T('Đã uống')}</span>` : `<span class="rec-badge rec-badge-ut">${T('Chưa nếm')}</span>`);
  const media = src
    ? `<img src="${src}" alt="${best.brand} — ${best.ten}">`
    : `<div class="rec-photo-gen" style="background:${ROAST_BG[best.roast] || '#8A6A44'}"></div>`;
  out.innerHTML = `
    <div class="rec">
      <div class="rec-head">
        <span class="rec-tag">${T('Gợi ý cho bạn')}</span>
        <span class="rec-intent">${speak}</span>
        ${CURID ? `<button class="rec-undo" onclick="deBase()">↺ ${T('về gói gợi ý')}</button>` : ''}
      </div>
      <div class="rec-card">
        <a class="rec-photo" href="${reviewUrl(best)}">${media}${badge}</a>
        <div class="rec-detail">
          <div class="rec-brand">${best.brand}${best.chungNhan && !(best.tested && best.diem != null) ? ` · <span class="rec-cred">${best.chungNhan}</span>` : ''}</div>
          <a class="rec-name" href="${reviewUrl(best)}">${best.ten}</a>
          <p class="rec-verdict">${verdict(best, TASTE)}</p>
          <div class="rec-cues">${cues(best)}</div>
          <div class="rec-priceline">
            <div class="rec-price">${money(best.gia)}<span>${money(per100(best))} / 100g · ${best.gram}g</span></div>
          </div>
          <div class="rec-actions">
            ${buyCTA(best, 'rec')}
            ${reviewUrl(best) ? `<a class="rec-review-link" href="${reviewUrl(best)}">${T('Đọc review đầy đủ →')}</a>` : ''}
          </div>
        </div>
      </div>
      <div class="rec-more">
        <div class="rec-more-col rec-more-y"><h5>${T('Hợp nếu')}</h5><ul>${best.nen.slice(0, 2).map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
        ${best.khong && best.khong.length ? `<div class="rec-more-col rec-more-n"><h5>${T('Cân nhắc nếu')}</h5><ul><li>${T(best.khong[0])}</li></ul></div>` : ''}
      </div>
      ${objs.length ? `
      <div class="nego">
        <span class="nego-l">${T(CURID ? 'Vẫn chưa ưng?' : 'Chưa đúng gu?')} ${T('Đổi nhanh:')}</span>
        ${objs.map(o => `<button class="nego-chip" onclick="deObj('${o.k}')">${T(o.label)}</button>`).join('')}
      </div>` : `<div class="nego"><span class="nego-l">${T('Đây là gói khớp gu bạn nhất trong danh mục hiện tại.')}</span></div>`}
    </div>`;
  const rec = out.firstElementChild;
  if (rec) { rec.classList.remove('in'); void rec.offsetWidth; rec.classList.add('in'); }
}

/* ============ PEAK — tuyên ngôn trên ảnh, phá nhịp ============ */
function renderPeak() {
  $('#peak').innerHTML = `
    <img class="peak-bg" src="assets/img/band-life.jpg" alt="Pha pour over cà phê đặc sản" loading="lazy">
    <div class="peak-scrim"></div>
    <div class="peak-in">
      <div class="peak-kicker">${T('Độc lập biên tập')}</div>
      <p class="peak-setup">${T('Không có bài viết tài trợ.<br>Không có điểm số cho thứ chúng tôi')}</p>
      <p class="peak-punch">${T('chưa bỏ vào miệng')}</p>
    </div>`;
}

/* ============ HUB ROUTER — trang chủ chỉ dẫn đường, không dump ============ */
function renderHubs() {
  const el = $('#hubs'); if (!el) return;
  const best = SP.filter(p => p.tested && p.diem != null).sort((a, b) => b.diem - a.diem)[0];
  const nBai = (typeof BAIVIET !== 'undefined') ? BAIVIET.length : 0;
  const hubs = [
    { href:'/ca-phe',    k:'Cà phê',     img:'assets/img/p3-cup.jpg',                 alt:'Bộ mẫu cà phê đặc sản', d:'Danh mục gói đặc sản — đã nếm mù, chấm điểm, quy giá về 100g.', m:'Đã nếm mù · đã uống thật', go:'Xem tất cả →' },
    { href:'/nha-rang',  k:'Nhà rang',   img:'assets/img/products/hand-beans.jpg',    alt:'Hạt cà phê vừa rang', d:'Hồ sơ các nhà rang Lâm Đồng chúng tôi chọn đồng hành, xếp theo vùng nguyên liệu.', m:'Chọn lọc · thực địa', go:'Xem hồ sơ →' },
    { href:'/vung-trong',k:'Vùng trồng', img:'assets/img/regions/cau-dat.jpg',        alt:'Quả cà phê chín trên cây', d:'Cầu Đất · Lạc Dương · Nam Ban — mỗi vùng một chất vị.', m:'Tiểu vùng Lâm Đồng', go:'Tìm hiểu →' },
    { href:'/kien-thuc', k:'Kiến thức',  img:'assets/img/products/beans-tin.jpg',     alt:'Ghi chú nếm thử cà phê', d:'Natural/Washed, độ rang, specialty đắt ở đâu — đọc trước khi mua.', m:'Đọc trước khi mua', go:'Đọc →' }
  ];
  el.innerHTML = `
    <div class="eyebrow">${T('Khám phá')}</div>
    <h2>${T('Đi thẳng vào thứ bạn cần.')}</h2>
    <p class="lead">${T('Mọi thứ được sắp theo đúng nhu cầu.')}</p>
    <div class="home-hubs">
      ${hubs.map(h => `
      <a class="home-hub" href="${h.href}">
        <div class="home-hub-img"><img src="${h.img}" alt="${h.alt}" loading="lazy"></div>
        <div class="home-hub-body">
          <div class="home-hub-k">${T(h.k)}</div>
          <div class="home-hub-d">${T(h.d)}</div>
          <div class="home-hub-meta">${T(h.m)}</div>
          <span class="home-hub-go">${T(h.go)}</span>
        </div>
      </a>`).join('')}
    </div>`;
}

/* ---- Render toàn bộ trang chủ (gọi lại khi đổi ngôn ngữ) ---- */
function renderHome() {
  const tg = $('#tagline'); if (tg) tg.textContent = T(SITE.tagline);
  renderTop(); renderPick(); renderHubs(); renderPeak();
}
/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Logo giờ là markup tĩnh (bean + wordmark) trong index.html — không ghi đè.
  renderHome();
  document.addEventListener('guLangChanged', renderHome);

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    };
  });
});
