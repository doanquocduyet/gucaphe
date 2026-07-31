/* ============================================================
   build-reviews.mjs — SINH TRANG TĨNH (REVIEW + VÙNG TRỒNG) + SITEMAP
   ============================================================
   Đọc data/data.js → tạo:
     • /review/<slug>.html       cho mỗi sản phẩm (từ mảng SP)
     • /nha-rang/<slug>.html      cho mỗi nhà rang (từ mảng ROASTER)
     • /vung-trong/<slug>.html   cho mỗi vùng trồng (từ mảng VUNG)
     • sitemap.xml               (trang chủ + review + nhà rang + vùng trồng)
   Liên kết nội bộ: Vùng → Nhà rang → Sản phẩm → Review (và ngược lại).
   Nội dung "nướng" tĩnh vào HTML (không phụ thuộc JS) — để Google VÀ
   trình thu thập AI (ChatGPT, Perplexity) đọc được ngay, không cần render.

   NGUYÊN TẮC: KHÔNG BỊA. Gói chưa nếm → không có điểm, không có
   schema đánh giá. Chỉ dùng đúng dữ liệu trong data.js.

   Chạy tay:  node scripts/build-reviews.mjs
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://gucaphe.vn';
const CSS_V = '20260808';

/* ---- Ảnh OG (1200×630, không chèn chữ). Mỗi trang dùng ảnh riêng nếu đủ nét,
   còn lại rơi về ảnh mặc định sang trọng (pour-over). Ảnh cắt sẵn ở assets/img/og/. ---- */
const OG_DEFAULT = `${ORIGIN}/assets/img/og/default.jpg`;
const OG_SET = new Set(['cau-dat.jpg', 'nam-ban.jpg', 'lac-duong.jpg', 'da-lat.jpg',
  'cherries-branch.jpg', 'green-beans.jpg', 'art-natural-drying.jpg',
  'son-pacamara-lot.jpg', 'son-heirloom.jpg', 'bui-fine-robusta.jpg', 'dehavi-yellow-bourbon.jpg',
  'art-cherry-hand.jpg', 'espresso-pull.jpg', 'green-beans-hand.jpg', 'cup-espresso.jpg', 'roasting.jpg']);
const ogForSrc = src => {
  const b = src ? src.split('/').pop() : '';
  return b && OG_SET.has(b) ? `${ORIGIN}/assets/img/og/${b}` : OG_DEFAULT;
};
const ogMeta = (img, alt) => `<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt || 'Gu Cà Phê — cà phê đặc sản Lâm Đồng')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">`;

/* ---- Đọc data.js trong sandbox nhỏ (chỉ để LẤY dữ liệu) ---- */
function loadData(src) {
  const names = ['SITE', 'QUY_TRINH', 'SP', 'CAP_SS', 'TU_DIEN', 'FAQ', 'BAIVIET', 'VUNG', 'ROASTER', 'NHUCAU', 'MUA_GI'];
  const re = new RegExp('\\bconst\\s+(' + names.join('|') + ')\\b', 'g');
  const fn = new Function('ctx', src.replace(re, 'ctx.$1') + '\nreturn ctx;');
  return fn({});
}
const raw = readFileSync(join(ROOT, 'data/data.js'), 'utf8');
const { SITE, SP, VUNG = [], ROASTER = [], QUY_TRINH = [], FAQ = [], TU_DIEN = [], BAIVIET = [], NHUCAU = [], MUA_GI = [] } = loadData(raw);
const SP_BY_ID = {}; SP.forEach(p => { SP_BY_ID[p.id] = p; });
const VUNG_BY_SLUG = {}; VUNG.forEach(v => { VUNG_BY_SLUG[v.slug] = v; });
// Nối ngược sản phẩm → nhà rang (product id có trong roaster.sanPham)
const ROASTER_BY_PID = {};
ROASTER.forEach(r => (r.sanPham || []).forEach(id => { ROASTER_BY_PID[id] = r; }));

/* ---- Helpers ---- */
const money  = n => (n == null ? '' : Number(n).toLocaleString('vi-VN') + '₫');
const per100 = p => (p.gram && p.gia != null) ? Math.round(p.gia / p.gram * 100) : null;
/* 3 tầng trung thực: đã chấm mù (có điểm) · đã uống (chưa chấm mù) · chưa thử */
const isScored = p => p.tested && p.diem != null;
const statusTxt = p => isScored(p) ? `${p.diem}/10` : (p.daUong ? 'Đã uống' : 'Chưa nếm');
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ROAST_BG = {
  'Light':'#C9A876','Light-medium':'#B08D5B','Medium':'#8A6A44',
  'Medium-dark':'#5E4530','Dark':'#3B2A1C'
};
const PHA_TEN = { phin:'Phin', v60:'V60 / Pour over', espresso:'Espresso', coldbrew:'Cold brew' };

const cuesOf = p => [p.xaHuyen, p.giong, p.doCao, p.process, p.roast ? 'Rang ' + p.roast.toLowerCase() : null]
  .filter(Boolean);

/* ============================================================
   KHUNG TRANG DÙNG CHUNG — menu + footer + <head> nhất quán mọi trang
   ============================================================ */
const MENU = [
  ['/nha-rang', 'Nhà rang', 'nharang'],
  ['/ca-phe', 'Cà phê', 'caphe'],
  ['/vung-trong', 'Vùng trồng', 'vung'],
  ['/kien-thuc', 'Kiến thức', 'kienthuc'],
  ['/cach-test', 'Cách test', 'method']
];
function siteNav(active) {
  return `<nav>
  <div class="wrap nav-in">
    <a id="logo" href="/" aria-label="Gu Cà Phê — trang chủ">
      <svg class="logo-bean" width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <g transform="rotate(-24 16 16)"><ellipse cx="16" cy="16" rx="8.4" ry="12.6" fill="#6E4A2B"/><path d="M16 4.6 C 12.2 9.6, 12.2 22.4, 16 27.4" fill="none" stroke="#FBFAF8" stroke-width="1.9" stroke-linecap="round"/></g>
      </svg>
      <span class="logo-txt"><b>GU</b> CÀ PHÊ</span>
    </a>
    <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Mở menu">
    <label for="nav-toggle" class="nav-burger" aria-hidden="true"><span></span><span></span><span></span></label>
    <ul class="nav-links">
      ${MENU.map(([h, l, k]) => {
        const cls = [k === 'method' ? 'learn' : '', k === active ? 'on' : ''].filter(Boolean).join(' ');
        return `<li><a href="${h}"${cls ? ` class="${cls}"` : ''}>${l}</a></li>`;
      }).join('')}
      <li class="nav-close-li"><label for="nav-toggle" class="nav-x" aria-label="Đóng menu">Đóng</label></li>
    </ul>
  </div>
</nav>`;
}
function siteFooter() {
  return `<footer>
  <div class="wrap">
    <div id="tagline">${esc(SITE.tagline)}</div>
    <a class="foot-newbie" href="/bat-dau">Người mới bắt đầu? →</a>
    <div>
      <a href="/nha-rang">Nhà rang</a>
      <a href="/ca-phe">Cà phê</a>
      <a href="/vung-trong">Vùng trồng</a>
      <a href="/kien-thuc">Kiến thức</a>
      <a href="/cach-test">Cách test</a>
    </div>
    <p class="foot-legal">Chúng tôi mua mọi sản phẩm bằng tiền của mình. Điểm số chỉ đến từ nếm mù (che nhãn, che giá);
    gói đã uống nhưng chưa chấm mù thì ghi rõ “Đã uống”, không gắn số. Link trên trang là link tiếp thị liên kết —
    bạn không trả thêm đồng nào, và link có ở cả sản phẩm chúng tôi khuyên cân nhắc.</p>
  </div>
</footer>`;
}
function pageHead({ title, desc, url, ogType = 'article', schema = '', ogImage = OG_DEFAULT, ogAlt = '' }) {
  const ga = (SITE.ga4 || '').trim();
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Gu Cà Phê">
${ogMeta(ogImage, ogAlt)}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${schema}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
  try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){} /* bật :active trên iOS */
  var GA=${JSON.stringify(ga)};
  window.dataLayer=window.dataLayer||[];
  window.guTrack=function(ev,p){try{if(window.gtag)gtag('event',ev,p||{});dataLayer.push(Object.assign({event:ev},p||{}));}catch(e){}};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA,{anonymize_ip:true});}
})();
</script>
</head>`;
}
function pageShell({ title, desc, url, ogType, schema, active, main, ogImage, ogAlt }) {
  return `${pageHead({ title, desc, url, ogType, schema, ogImage, ogAlt })}
<body class="rp-body">
${siteNav(active)}
${main}
${siteFooter()}
</body>
</html>
`;
}
function itemListSchema(name, items) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ItemList', name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: it.url, name: it.name }))
  })}</script>`;
}
function roasterCardHTML(r) {
  const a = roasterAvg(r);
  const badge = a ? `<span class="vg-badge">${a.avg}/10</span>`
    : (r.chungNhan ? `<span class="vg-badge vg-badge-cred">${esc(r.chungNhan)}</span>` : '');
  const p = (r.sanPham || []).map(id => SP_BY_ID[id]).filter(Boolean)[0];
  const src = p && p.anh ? (/^https?:/.test(p.anh) ? p.anh : '/' + p.anh) : '';
  const img = src ? `<div class="vg-card-img"><img src="${esc(src)}" alt="${esc(r.ten)}" loading="lazy"></div>` : '';
  return `<a class="vg-card rc" href="/nha-rang/${r.slug}">
      ${img}
      <div class="vg-card-body">
        <div class="vg-card-top"><div class="vg-card-name">${esc(r.ten)}</div>${badge}</div>
        ${r.theManh ? `<div class="rc-strength">${esc(r.theManh)}</div>` : ''}
        <div class="vg-card-tag">${esc(r.gioiThieu)}</div>
        ${r.hopAi ? `<div class="rc-fit"><b>Hợp:</b> ${esc(r.hopAi)} · Vùng ${esc(r.vungChinh)}</div>` : `<div class="vg-card-meta">Vùng: ${esc(r.vungChinh)}</div>`}
        <div class="rc-trust"><span>Đã mua</span><span>Đã uống</span><span>Đã tìm hiểu</span></div>
        <span class="vg-card-go">Xem hồ sơ →</span>
      </div>
    </a>`;
}
function regionCardHTML(v) {
  const src = v.anh ? (/^https?:/.test(v.anh) ? v.anh : '/' + v.anh) : '';
  const img = src
    ? `<div class="vg-card-img vg-card-img--name"><img src="${esc(src)}" alt="Cà phê ${esc(v.ten)}" loading="lazy"><div class="vg-card-imgscrim"></div><div class="vg-card-imgname">${esc(v.ten)}</div></div>`
    : '';
  const tags = (v.tags && v.tags.length)
    ? `<div class="vg-card-tags">${v.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>`
    : '';
  const viLine = v.viNgan
    ? `<div class="vg-card-vi"><span class="vg-card-vi-k">Vị thường gặp</span> ${esc(v.viNgan)}</div>`
    : '';
  return `<a class="vg-card vg-card--region" href="/vung-trong/${v.slug}">
      ${img}
      <div class="vg-card-body">
        ${viLine}
        ${tags}
        <div class="vg-card-meta">${[v.doCao, v.giong].filter(Boolean).map(esc).join(' · ')}</div>
        <span class="vg-card-go">Tìm hiểu →</span>
      </div>
    </a>`;
}

/* ---- Thanh số đo ---- */
const bar = (label, v) => v == null ? '' : `
        <div class="spec">
          <div class="spec-l">${label}</div>
          <div class="spec-v">${v}<span class="of">/5</span></div>
          <div class="track"><i style="width:${v / 5 * 100}%"></i></div>
        </div>`;

/* ---- Câu chốt ngắn (thật, không khoa trương) ---- */
function verdict(p) {
  const tested = SP.filter(x => x.tested && x.diem != null);
  const top = tested.length ? Math.max(...tested.map(x => x.diem)) : null;
  if (!(p.tested && p.diem != null))
    return p.daUong
      ? `Gói này chúng tôi đã <b>mua và uống thật</b>, thấy ngon — nhưng chưa <b>chấm mù</b> (che nhãn, che giá) theo quy trình, nên chưa gắn điểm số. Không bịa số cho cảm nhận chưa đo lường.`
      : `Gói này chúng tôi <b>chưa thử</b> — thông số lấy từ mô tả nhà bán, ghi rõ để bạn tự cân nhắc chứ không chấm điểm.`;
  if (p.diem === top && tested.length > 1)
    return `Trong tất cả các gói chúng tôi đã nếm mù, đây là gói <b>điểm cao nhất (${p.diem}/10)</b> — khó thất vọng nhất để bắt đầu.`;
  return `Đã nếm mù, chấm <b>${p.diem}/10</b> — hợp gu, cân bằng, không có điểm trừ đáng kể.`;
}

/* ---- Đoạn mở đầu editorial (nội dung thật cho SEO) ---- */
function intro(p) {
  const c = cuesOf(p).join(', ');
  if (p.tested && p.diem != null) {
    return `<p><b>${esc(p.brand)} — ${esc(p.ten)}</b> là cà phê đặc sản Việt Nam${c ? ` (${esc(c)})` : ''}. `
      + `Chúng tôi mua ẩn danh bằng tiền của mình, pha cùng một điều kiện với mọi gói khác — cỡ xay medium, tỷ lệ 1:15, nước 92°C — rồi <b>nếm mù</b> (che nhãn) trước khi chấm. `
      + `Kết quả: <b>${p.diem}/10</b>.</p>`;
  }
  if (p.daUong)
    return `<p><b>${esc(p.brand)} — ${esc(p.ten)}</b>${c ? ` (${esc(c)})` : ''} là gói chúng tôi đã <b>mua và uống thật</b>, thấy ngon. `
      + `Nhưng chúng tôi <b>chưa chấm mù</b> (che nhãn, che giá) theo quy trình, nên trang này <b>chưa gắn điểm số</b> — chỉ nói đúng những gì đã trải nghiệm, không bịa số. Điểm mù sẽ cập nhật sau.</p>`;
  return `<p><b>${esc(p.brand)} — ${esc(p.ten)}</b>${c ? ` (${esc(c)})` : ''} hiện <b>chưa được chúng tôi thử</b>, nên trang này <b>không chấm điểm</b>. `
    + `Thông số bên dưới lấy từ mô tả của nhà bán. Chúng tôi liệt kê để bạn có đủ thông tin cân nhắc, và ghi rõ nhãn “Chưa nếm” — không giả vờ đã thử.</p>`;
}

function flavorPara(p) {
  const notes = (p.tested && p.notes && p.notes.length)
    ? `Ghi chú vị khi nếm mù: <b>${p.notes.map(esc).join(' · ')}</b>. `
    : '';
  return `<p>${notes}${esc(p.flavor || '')}</p>`;
}

/* ---- Nhãn nút mua theo nơi bán thật (Shopee vs trang chính hãng nhà rang) ---- */
const isShopee = p => /shopee\./i.test(p.link || '');
const buyLabel = p => 'Mua gói này';
const buyChannel = p => isShopee(p) ? 'shopee' : 'brand';

/* ---- Nút mua (affiliate) — rel="sponsored" đúng chuẩn Google ---- */
function buyLink(p, label) {
  const url = esc(p.link || '#');
  const alts = [];
  if (p.lazada) alts.push(`<a class="cta-alt" href="${esc(p.lazada)}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'lazada',position:'review_page',tested:${p.tested ? 1 : 0}})">Lazada</a>`);
  if (p.tiki)   alts.push(`<a class="cta-alt" href="${esc(p.tiki)}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'tiki',position:'review_page',tested:${p.tested ? 1 : 0}})">Tiki</a>`);
  return `<a class="cta" href="${url}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'${buyChannel(p)}',position:'review_page',tested:${p.tested ? 1 : 0}})">${label || buyLabel(p)} · ${money(p.gia)}</a>`
    + (alts.length ? `<div class="cta-alts"><span>Hoặc:</span>${alts.join('')}</div>` : '');
}

/* ---- Ảnh / swatch độ rang ---- */
function media(p) {
  if (p.anh) return `<div class="rp-thumb"><img src="/${esc(p.anh)}" alt="${esc(p.brand)} — ${esc(p.ten)}" loading="eager"></div>`;
  const bg = ROAST_BG[p.roast] || '#8A6A44';
  return `<div class="rp-thumb rp-thumb-gen" style="background:${bg}"><span>${esc(p.roast || '')}</span></div>`;
}

/* ---- JSON-LD ---- */
function schema(p) {
  const url = `${ORIGIN}/review/${p.slug}`;
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.brand} ${p.ten}`,
    brand: { '@type': 'Brand', name: p.brand },
    category: 'Cà phê đặc sản',
    description: p.flavor || `${p.brand} ${p.ten}`,
    url,
    offers: {
      '@type': 'Offer',
      price: p.gia,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url
    }
  };
  // Chỉ gắn đánh giá khi đã nếm mù — điểm là thật, không bịa.
  if (p.tested && p.diem != null) {
    product.review = {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: p.diem, bestRating: 10, worstRating: 0 },
      author: { '@type': 'Organization', name: 'Gu Cà Phê' },
      reviewBody: p.flavor || (p.notes && p.notes.length ? p.notes.join(', ') + '.' : '')
    };
  }
  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gu Cà Phê', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Cà phê', item: `${ORIGIN}/ca-phe` },
      { '@type': 'ListItem', position: 3, name: `${p.brand} ${p.ten}` }
    ]
  };
  const faq = (p.faq && p.faq.length) ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  } : null;
  return `<script type="application/ld+json">${JSON.stringify(product)}</script>\n`
    + `<script type="application/ld+json">${JSON.stringify(crumb)}</script>`
    + (faq ? `\n<script type="application/ld+json">${JSON.stringify(faq)}</script>` : '');
}

/* ---- Gói liên quan ---- */
function related(p) {
  const others = SP.filter(x => x.id !== p.id).slice(0, 3);
  if (!others.length) return '';
  return `
    <section class="rp-related">
      <h2>Gói khác trong danh mục</h2>
      <div class="rp-rel-grid">
        ${others.map(o => `
        <a class="rp-rel" href="/review/${o.slug}">
          <div class="rp-rel-brand">${esc(o.brand)}</div>
          <div class="rp-rel-name">${esc(o.ten)}</div>
          <div class="rp-rel-meta">${o.tested && o.diem != null ? `<b>${o.diem}/10</b> · ` : ''}${money(o.gia)}</div>
        </a>`).join('')}
      </div>
    </section>`;
}

/* ---- Liên kết chéo: review → nhà rang + vùng ---- */
function crossLinks(p) {
  const r = ROASTER_BY_PID[p.id];
  const v = VUNG_BY_SLUG[p.vungSlug];
  const bits = [];
  if (r) bits.push(`<a href="/nha-rang/${r.slug}">Nhà rang: <b>${esc(r.ten)}</b></a>`);
  if (v) bits.push(`<a href="/vung-trong/${v.slug}">Vùng: <b>${esc(v.ten)}</b></a>`);
  return bits.length ? `<div class="rp-xlinks">${bits.join('')}</div>` : '';
}

/* ============================================================
   PRODUCT REVIEW TEMPLATE — bản ghi dữ liệu, KHÔNG viết bài.
   Thứ tự khoá: Hero → Gu Verdict → Thông số → Flavor Profile →
   Tasting Notes → Gu Match → Vì sao Gu chấm → Review ngắn →
   Test Protocol → FAQ → Sản phẩm tương tự.
   Mỗi section TỰ ẨN khi thiếu dữ liệu. Không bịa số.
   Flavor Profile / Tasting Notes / Vì sao Gu chấm CHỈ hiện khi đã nếm mù.
   ============================================================ */
const FLAVOR_ROWS = [['chua', 'Độ chua'], ['dam', 'Body'], ['ngot', 'Ngọt'], ['hau', 'Hậu vị'], ['sach', 'Độ sạch']];

function productReviewBody(p, tested) {
  const r = ROASTER_BY_PID[p.id];
  const v = VUNG_BY_SLUG[p.vungSlug];

  // HERO
  const hero = `<header class="rp-hero">
    ${media(p)}
    <div class="rp-hero-body">
      <div class="eyebrow">${p.guPick ? esc(GUPICK[p.guPick]) + ' · ' : ''}Review${tested ? ' · Đã nếm mù' : (p.confidence === 'editor_research' ? ' · Mới nghiên cứu' : '')}</div>
      <div class="rp-brand">${r ? `<a href="/nha-rang/${r.slug}">${esc(p.brand)}</a>` : esc(p.brand)}</div>
      <h1>${esc(p.ten)}</h1>
      ${p.chot ? `<p class="rp-chot">${esc(p.chot)}</p>` : ''}
      ${crossLinks(p)}
      <div class="rp-buy">
        <div class="rp-price-row">
          ${tested ? `<div class="rp-score">${p.diem}<span>/10</span></div>` : ''}
          ${!tested && p.chungNhan ? `<div class="rp-cred">${esc(p.chungNhan)}</div>` : ''}
          <div class="rp-price">${p.gia != null ? `<b>${money(p.gia)}</b>${per100(p) ? `<span>${money(per100(p))} / 100g · ${p.gram}g</span>` : ''}` : '<b class="rp-tbd">Giá đang cập nhật</b>'}</div>
        </div>
        ${buyLink(p)}
        <p class="rp-aff-note">${isShopee(p)
          ? 'Link tiếp thị liên kết — bạn mua đúng giá Shopee niêm yết, không trả thêm đồng nào.'
          : `Dẫn tới trang bán chính hãng của ${esc(p.brand)} — bạn mua đúng giá niêm yết, không trả thêm đồng nào.`}</p>
      </div>
    </div>
  </header>`;

  // 1 · GU VERDICT
  const researchNote = p.confidence === 'editor_research' ? `<div class="pv-research">
    <span class="pv-research-k">Mới nghiên cứu</span>
    <p>Gu <b>chưa mua & nếm</b> gói này — thông tin lấy từ nguồn chính thức của nhà rang. Trường nào chưa xác minh sẽ để trống. Điểm số của Gu chỉ có sau khi nếm mù.</p>
  </div>` : '';

  const verdictSec = `<section class="pv-verdict">
    <span class="pv-kick">Gu Cà Phê nhận xét</span>
    <p>${p.nhanXet ? esc(p.nhanXet) : verdict(p)}</p>
  </section>`;

  // 2 · THÔNG SỐ CHUẨN
  const specRows = [
    ['Nhà rang', r ? `<a href="/nha-rang/${r.slug}">${esc(p.brand)}</a>` : esc(p.brand)],
    ['Vùng', v ? `<a href="/vung-trong/${v.slug}">${esc(v.ten)}</a>` : esc(p.xaHuyen || '')],
    ['Giống', esc(p.giong || '')],
    ['Sơ chế', esc(p.process || '')],
    ['Rang', esc(p.roast || '')],
    ['Khối lượng', p.gram ? `${p.gram}g` : ''],
    ['Giá', money(p.gia)],
    ['Giá / 100g', per100(p) ? `${money(per100(p))}` : ''],
    ['Hợp pha', (p.pha && p.pha.length) ? p.pha.map(x => PHA_TEN[x] || x).join(' · ') : ''],
    ['Nếm mù', tested ? '✓ Đã chấm mù' : '']
  ].filter(x => x[1]);
  const specSec = `<section class="pv-sec">
    <h2 class="rg-h">Thông số</h2>
    <table class="pv-specs"><tbody>${specRows.map(([k, val]) => `<tr><th>${k}</th><td>${val}</td></tr>`).join('')}</tbody></table>
  </section>`;

  // 3 · FLAVOR PROFILE (chỉ khi đã nếm mù + có dữ liệu)
  const flavorBars = FLAVOR_ROWS.filter(([k]) => p[k] != null);
  const flavorSec = (tested && flavorBars.length) ? `<section class="pv-sec">
    <h2 class="rg-h">Hồ sơ hương vị</h2>
    <p class="pv-note">Ghi nhận từ bài <b>nếm mù</b> gói này — thang /5, không phải điểm quy đổi.</p>
    <div class="pv-bars">${flavorBars.map(([k, label]) => bar(label, p[k])).join('')}</div>
  </section>` : '';

  // 4 · TASTING NOTES
  const notesSec = (tested && p.notes && p.notes.length) ? `<section class="pv-sec">
    <h2 class="rg-h">Ghi chú vị</h2>
    <div class="pv-notes">${p.notes.map(n => `<span>${esc(n)}</span>`).join('')}</div>
  </section>` : '';

  // 5 · GU MATCH
  const matchSec = ((p.nen && p.nen.length) || (p.khong && p.khong.length)) ? `<section class="pv-sec">
    <h2 class="rg-h">Hợp gu ai?</h2>
    <div class="rg-fit-cols">
      ${(p.nen && p.nen.length) ? `<div class="rg-fit-col rg-fit--yes"><div class="rg-fit-cap">Phù hợp</div><ul>${p.nen.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${(p.khong && p.khong.length) ? `<div class="rg-fit-col rg-fit--no"><div class="rg-fit-cap">Không phù hợp</div><ul>${p.khong.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>` : '';

  // 6 · VÌ SAO GU CHẤM (chỉ khi đã nếm mù)
  const whySec = (tested && p.viSaoDiem && p.viSaoDiem.length) ? `<section class="pv-sec">
    <h2 class="rg-h">Vì sao Gu chấm ${p.diem}/10?</h2>
    <ul class="rr-why-list">${p.viSaoDiem.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  </section>` : '';

  // 7 · REVIEW NGẮN (tuỳ chọn — chỉ khi có p.review)
  const reviewSec = p.review ? `<section class="pv-sec">
    <h2 class="rg-h">Đánh giá chi tiết</h2>
    <div class="pv-review">${p.review}</div>
  </section>` : '';

  // 8 · TEST PROTOCOL (chỉ hiện ở gói đã nếm mù — moat)
  const protoSec = tested ? `<section class="pv-proto">
    <span class="pv-kick">Cách Gu chấm mù</span>
    <ul class="pv-proto-list"><li>Mua thật</li><li>Nếm mù (che nhãn)</li><li>Nước 92°C</li><li>Tỷ lệ 1:15</li><li>Xay medium</li></ul>
    <p class="pv-proto-note">Gói này đã qua đủ quy trình trên và được chấm mù. <a href="/cach-test">Xem quy trình đầy đủ →</a></p>
  </section>` : '';

  // 9 · FAQ
  const faqSec = (p.faq && p.faq.length) ? `<section class="rg-faq">
    <h2 class="rg-h">Câu hỏi thường gặp</h2>
    <dl>${p.faq.map(f => `<div class="rg-faq-item"><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl>
  </section>` : '';

  const ctaFoot = `<div class="rp-cta-foot">${buyLink(p, 'Mua ' + esc(p.brand))}</div>`;

  return `${hero}
  ${researchNote}
  ${verdictSec}
  ${specSec}
  ${flavorSec}
  ${notesSec}
  ${matchSec}
  ${whySec}
  ${reviewSec}
  ${protoSec}
  ${ctaFoot}
  ${faqSec}
  ${related(p)}`;
}

/* ---- Trang review đầy đủ ---- */
function page(p) {
  const url = `${ORIGIN}/review/${p.slug}`;
  const tested = p.tested && p.diem != null;
  const title = `${p.brand} ${p.ten} — Review${tested ? ` & điểm nếm mù ${p.diem}/10` : (p.daUong ? ' (đã uống)' : ' (chưa nếm)')} | Gu Cà Phê`;
  const firstSentence = (p.flavor || '').split('.')[0];
  const desc = tested
    ? `${p.brand} ${p.ten}: nếm mù chấm ${p.diem}/10. ${firstSentence}. Giá ${money(p.gia)}${per100(p) ? `, ${money(per100(p))}/100g` : ''}. Review trung lập từ Gu Cà Phê.`
    : (p.daUong
      ? `${p.brand} ${p.ten}: chúng tôi đã mua và uống thật, thấy ngon — chưa chấm mù nên chưa gắn điểm. Giá ${money(p.gia)}${per100(p) ? `, ${money(per100(p))}/100g` : ''}. Review trung thực từ Gu Cà Phê.`
      : `${p.brand} ${p.ten}: chưa thử nên chưa chấm điểm — thông số từ nhà bán, giá ${money(p.gia)}. Gu Cà Phê ghi rõ gói nào đã test.`);
  const ga = (SITE.ga4 || '').trim();

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Gu Cà Phê">
${ogMeta(ogForSrc(p.anh), `${p.brand} ${p.ten}`)}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${schema(p)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
  try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){} /* bật :active trên iOS */
  var GA=${JSON.stringify(ga)};
  window.dataLayer=window.dataLayer||[];
  window.guTrack=function(ev,p){try{if(window.gtag)gtag('event',ev,p||{});dataLayer.push(Object.assign({event:ev},p||{}));}catch(e){}};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA,{anonymize_ip:true});}
})();
</script>
</head>
<body class="rp-body">
${siteNav('caphe')}

<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb">
    <a href="/">Gu Cà Phê</a><i>/</i><a href="/ca-phe">Cà phê</a><i>/</i><span>${esc(p.brand)} ${esc(p.ten)}</span>
  </nav>

  ${productReviewBody(p, tested)}

  <a class="rp-home" href="/">← Về trang chủ Gu Cà Phê</a>
</main>
<div class="buybar">
  <div class="wrap buybar-in">
    <div class="buybar-info"><b>${esc(p.brand)}</b> · ${money(p.gia)}${per100(p) ? ` <span>· ${money(per100(p))}/100g</span>` : ''}${tested ? ` <span>· ${p.diem}/10</span>` : ''}</div>
    <a class="cta cta-sm" href="${esc(p.link || '#')}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'${buyChannel(p)}',position:'review_stickybar',tested:${tested ? 1 : 0}})">${buyLabel(p)} →</a>
  </div>
</div>

${siteFooter()}

</body>
</html>
`;
}

/* ============================================================
   TRANG VÙNG TRỒNG (/vung-trong/<slug>)
   ============================================================ */
function isoDate(dmy) {
  const m = String(dmy || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '2026-07-13';
}

// Sản phẩm thuộc vùng: khớp vungSlug. Hub (Lâm Đồng) gom mọi tiểu vùng.
function regionProducts(v) {
  if (v.hub) {
    const subs = VUNG.filter(x => !x.hub).map(x => x.slug);
    return SP.filter(p => subs.includes(p.vungSlug));
  }
  return SP.filter(p => p.vungSlug === v.slug);
}
// Nhà rang có vùng nguyên liệu chính là vùng này (hub gom hết).
function regionRoasters(v) {
  if (v.hub) return ROASTER.slice();
  return ROASTER.filter(r => r.vungSlug === v.slug);
}
// Điểm trung bình nhà rang — chỉ tính gói đã nếm.
function roasterAvg(r) {
  const t = (r.sanPham || []).map(id => SP_BY_ID[id]).filter(p => p && p.tested && p.diem != null);
  if (!t.length) return null;
  return { avg: Math.round(t.reduce((s, p) => s + p.diem, 0) / t.length * 10) / 10, n: t.length };
}

function prodCard(p) {
  return `
        <div class="vg-prod">
          <div class="vg-prod-head">
            <div>
              <div class="vg-prod-brand">${esc(p.brand)}</div>
              <div class="vg-prod-name">${esc(p.ten)}</div>
            </div>
            ${p.tested && p.diem != null ? `<div class="vg-prod-score">${p.diem}<span>/10</span></div>` : `<div class="vg-prod-ut">${p.daUong ? 'Đã uống' : 'Chưa nếm'}</div>`}
          </div>
          <div class="vg-prod-meta">${cuesOf(p).map(esc).join(' · ')}</div>
          <div class="vg-prod-foot">
            <div class="vg-prod-price"><b>${money(p.gia)}</b>${per100(p) ? ` · ${money(per100(p))}/100g` : ''}</div>
            <div class="vg-prod-act">
              <a class="vg-prod-review" href="/review/${p.slug}">Đọc review →</a>
              ${buyLink(p)}
            </div>
          </div>
        </div>`;
}

/* ---- Sao cảm quan (kiến thức vùng, không phải điểm nếm mù của Gu) ---- */
const stars = n => { n = Math.max(0, Math.min(5, n | 0)); return '<span class="stars">' + '★'.repeat(n) + '<span class="stars-off">' + '★'.repeat(5 - n) + '</span></span>'; };

/* ---- Bốn thuộc tính cảm quan thường gặp của vùng (kiến thức vùng) ---- */
const SENSES = [['chua', 'Độ chua'], ['body', 'Body'], ['hoa', 'Hương hoa'], ['choco', 'Chocolate']];

/* ---- Box "tóm tắt 10 giây" — phần AI dễ trích nhất ---- */
function regionSummaryBox(v) {
  const c = v.camQuan || {};
  const facts = [
    ['Giống', esc(v.giong || '—')],
    ['Độ cao', esc(v.doCao || '—')],
    ['Hợp', esc(v.hopPha || '—')],
    ['Không hợp', esc(v.khongHopNgan || '—')]
  ];
  const hasSense = SENSES.some(([k]) => c[k] != null);
  return `<section class="rg-sum" aria-label="Tóm tắt nhanh">
    <div class="rg-sum-head">
      <span class="rg-sum-kick">Gu Cà Phê tóm tắt</span>
      <h2 class="rg-sum-t">${esc(v.ten)} trong 10 giây</h2>
    </div>
    ${v.dinhNghia ? `<p class="rg-sum-def">${esc(v.dinhNghia)}</p>` : ''}
    <div class="rg-sum-cols">
      <dl class="rg-sum-facts">
        ${facts.map(([k, val]) => `<div class="rg-sum-row"><dt>${k}</dt><dd>${val}</dd></div>`).join('')}
      </dl>
      ${hasSense ? `<div class="rg-snap">
        <div class="rg-snap-cap">Vị thường gặp</div>
        ${SENSES.map(([k, label]) => c[k] != null ? `<div class="rg-snap-row"><span class="rg-snap-l">${label}</span>${stars(c[k])}</div>` : '').join('')}
      </div>` : ''}
    </div>
    <p class="rg-sum-note">Đặc tính vị <b>thường gặp</b> của vùng — không phải điểm nếm mù của Gu. Vị thực tế còn tuỳ giống, cách sơ chế và mức rang của từng nhà rang.</p>
  </section>`;
}

/* ---- Bảng so sánh 3 vùng — người đọc & AI hiểu trong 5 giây ---- */
function regionCompareTable(current) {
  const regions = VUNG.filter(x => !x.hub);
  if (regions.length < 2) return '';
  const rows = [
    ['Độ cao', r => esc(r.doCao || '—')],
    ['Độ chua', r => r.camQuan && r.camQuan.chua != null ? stars(r.camQuan.chua) : '—'],
    ['Body', r => r.camQuan && r.camQuan.body != null ? stars(r.camQuan.body) : '—'],
    ['Hương hoa', r => r.camQuan && r.camQuan.hoa != null ? stars(r.camQuan.hoa) : '—'],
    ['Chocolate', r => r.camQuan && r.camQuan.choco != null ? stars(r.camQuan.choco) : '—'],
    ['Hợp pha', r => esc(r.hopPha || '—')]
  ];
  return `<section class="rg-cmp">
    <h2 class="rg-h">So sánh ba vùng</h2>
    <div class="rg-cmp-scroll">
      <table class="rg-cmp-tbl">
        <thead><tr><th></th>${regions.map(r => `<th class="${r.slug === current.slug ? 'is-cur' : ''}">${esc(r.ten)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${regions.map(r => `<td class="${r.slug === current.slug ? 'is-cur' : ''}">${fn(r)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function regionPage(v) {
  const url = `${ORIGIN}/vung-trong/${v.slug}`;
  const prods = regionProducts(v);
  const roasters = regionRoasters(v);
  const title = `Cà phê ${v.ten} — đặc điểm, hương vị & gói đáng mua | Gu Cà Phê`;
  const desc = `Cà phê ${v.ten} (${v.tinh}): ${v.tagline} Độ cao ${v.doCao}, giống ${v.giong}. ${v.vi}`;
  const facts = [
    ['Vị trí', v.tinh], ['Độ cao', v.doCao], ['Giống', v.giong], ['Hợp pha', v.hopPha]
  ].filter(x => x[1]);
  const ga = (SITE.ga4 || '').trim();

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Cà phê ${v.ten} — đặc điểm & hương vị`,
    description: desc.slice(0, 200),
    inLanguage: 'vi-VN',
    author: { '@type': 'Organization', name: 'Gu Cà Phê' },
    publisher: { '@type': 'Organization', name: 'Gu Cà Phê' },
    datePublished: isoDate(SITE.capNhat),
    mainEntityOfPage: url
  };
  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gu Cà Phê', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Vùng trồng', item: `${ORIGIN}/vung-trong` },
      { '@type': 'ListItem', position: 3, name: `Cà phê ${v.ten}` }
    ]
  };

  const others = VUNG.filter(x => x.slug !== v.slug);
  const subRegions = VUNG.filter(x => !x.hub && x.slug !== v.slug);
  const scoredN = prods.filter(p => p.tested && p.diem != null).length;
  const drunkN = prods.filter(p => p.daUong && !(p.tested && p.diem != null)).length;
  const faqSchema = (v.faq && v.faq.length) ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: v.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  } : null;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Gu Cà Phê">
${ogMeta(ogForSrc(v.anh), `Cà phê ${v.ten}`)}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(article)}</script>
<script type="application/ld+json">${JSON.stringify(crumb)}</script>
${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
  try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){} /* bật :active trên iOS */
  var GA=${JSON.stringify(ga)};
  window.dataLayer=window.dataLayer||[];
  window.guTrack=function(ev,p){try{if(window.gtag)gtag('event',ev,p||{});dataLayer.push(Object.assign({event:ev},p||{}));}catch(e){}};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA,{anonymize_ip:true});}
})();
</script>
</head>
<body class="rp-body">
${siteNav('vung')}

<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb">
    <a href="/">Gu Cà Phê</a><i>/</i><a href="/vung-trong">Vùng trồng</a><i>/</i><span>Cà phê ${esc(v.ten)}</span>
  </nav>

  <header class="vg-hero${v.anh ? ' has-img' : ''}">
    ${v.anh ? `<div class="vg-hero-media"><img src="/${v.anh}" alt="Cà phê ${esc(v.ten)} — vùng trồng ${esc(v.tinh)}" fetchpriority="high"></div>` : ''}
    <div class="vg-hero-txt">
      <div class="eyebrow">Vùng trồng · Lâm Đồng</div>
      <h1>Cà phê ${esc(v.ten)}</h1>
      <p class="vg-hero-tag">${esc(v.tagline)}</p>
      <div class="vg-facts">
        ${facts.map(([k, val]) => `<div class="vg-fact"><span>${esc(k)}</span><b>${esc(val)}</b></div>`).join('')}
      </div>
    </div>
  </header>

  ${regionSummaryBox(v)}

  <article class="rp-article vg-article">
    <h2 class="rg-h">Vì sao ${esc(v.ten)} có vị như vậy?</h2>
    ${(v.taiSao || v.than || []).join('\n    ')}
    ${v.hopPhaVi ? `<p class="rg-brew"><b>Cách pha:</b> ${esc(v.hopPhaVi)}</p>` : ''}
    ${(v.giongMoTa && v.giongMoTa.length) ? `<ul class="rg-giong">${v.giongMoTa.map(([g, d]) => `<li><b>${esc(g)}</b> — ${esc(d)}</li>`).join('')}</ul>` : ''}
  </article>

  ${v.diemDacBiet ? `<aside class="rg-special">
    <div class="rg-special-cap">${esc(v.diemDacBiet.title)}</div>
    ${v.diemDacBiet.html}
  </aside>` : ''}

  ${(v.nen || v.khong) ? `<section class="rg-fit">
    <h2 class="rg-h">Ai nên chọn ${esc(v.ten)}?</h2>
    <div class="rg-fit-cols">
      ${(v.nen && v.nen.length) ? `<div class="rg-fit-col rg-fit--yes"><div class="rg-fit-cap">Hợp nếu bạn</div><ul>${v.nen.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${(v.khong && v.khong.length) ? `<div class="rg-fit-col rg-fit--no"><div class="rg-fit-cap">Cân nhắc nếu bạn</div><ul>${v.khong.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    </div>
    ${subRegions.length ? `<div class="rg-fit-cross">${subRegions.map(o => `<a href="/vung-trong/${o.slug}">Thích ${esc((o.huongChinh || '').toLowerCase() || o.ten)}? → ${esc(o.ten)}</a>`).join('')}</div>` : ''}
  </section>` : ''}

  ${v.nhanXet ? `<aside class="rg-note">
    <div class="rg-note-cap">Nhận xét của Gu</div>
    <p>${esc(v.nhanXet)}</p>
  </aside>` : ''}

  ${v.banDo ? `<figure class="vg-map">
    <img src="/${v.banDo}" alt="Bản đồ vùng trồng cà phê Lâm Đồng — Lạc Dương, Cầu Đất, Lâm Hà, Di Linh, Đắk Nông" loading="lazy">
    ${v.banDoCaption ? `<figcaption>${esc(v.banDoCaption)}</figcaption>` : ''}
  </figure>` : ''}

  <section class="vg-prods">
    <div class="rg-prods-head">
      <h2 class="rg-h">Gói từ vùng này</h2>
      ${prods.length ? `<div class="rg-prods-count"><span class="rg-cnt rg-cnt--scored">Đã chấm mù ${scoredN}</span><span class="rg-cnt rg-cnt--drunk">Đã uống ${drunkN}</span></div>` : ''}
    </div>
    ${prods.length
      ? `<div class="pc-grid">${prods.map(p => pcard(p)).join('')}</div>`
      : `<div class="vg-empty">
          <p>Chúng tôi <b>chưa nếm mù</b> gói nào ghi rõ xuất xứ ${esc(v.ten)} — nên chưa gắn sản phẩm ở đây. Đúng nguyên tắc của Gu: chưa thử thì không gợi ý.</p>
          <p>Gói Lâm Đồng gần nhất chúng tôi đã chấm là <b>Sơn Pacamara — Lang Biang</b> (Lạc Dương, cùng tỉnh).</p>
          <div class="vg-empty-cta">
            <a class="cta" href="/review/son-pacamara-lang-biang">Xem gói Lâm Đồng đã nếm →</a>
            <a class="cta-line" href="/#pick">Để chúng tôi chọn theo gu bạn</a>
          </div>
        </div>`}
  </section>

  ${roasters.length ? `
  <section class="rp-related">
    <h2 class="rg-h">${roasters.length === 1 ? `Nhà rang tiêu biểu của ${esc(v.ten)}` : `Nhà rang tiêu biểu`}</h2>
    <div class="rp-rel-grid">
      ${roasters.map(r => {
        const a = roasterAvg(r);
        return `
      <a class="rp-rel" href="/nha-rang/${r.slug}">
        <div class="rp-rel-brand">Nhà rang</div>
        <div class="rp-rel-name">${esc(r.ten)}</div>
        <div class="rp-rel-meta">${a ? `<b>${a.avg}/10</b>` : `<span class="rp-ut">${esc(r.chungNhan || 'Đã uống')}</span>`}</div>
      </a>`;
      }).join('')}
    </div>
  </section>` : ''}

  ${regionCompareTable(v)}

  ${(v.faq && v.faq.length) ? `<section class="rg-faq">
    <h2 class="rg-h">Câu hỏi thường gặp về cà phê ${esc(v.ten)}</h2>
    <dl>${v.faq.map(f => `<div class="rg-faq-item"><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl>
  </section>` : ''}

  ${(v.themVao && v.themVao.length) ? `<details class="rg-more">
    <summary>Biết thêm về ${esc(v.ten)}</summary>
    <div class="rg-more-body">${v.themVao.join('\n    ')}</div>
  </details>` : ''}

  ${others.length ? `
  <section class="rp-related">
    <h2 class="rg-h">Vùng trồng khác</h2>
    <div class="rp-rel-grid">
      ${others.map(o => `
      <a class="rp-rel" href="/vung-trong/${o.slug}">
        <div class="rp-rel-brand">${o.hub ? 'Tổng quan' : 'Tiểu vùng'}</div>
        <div class="rp-rel-name">Cà phê ${esc(o.ten)}</div>
        <div class="rp-rel-meta">${esc(o.viNgan || o.doCao || '')}</div>
      </a>`).join('')}
    </div>
  </section>` : ''}

  <a class="rp-home" href="/">← Về trang chủ Gu Cà Phê</a>
</main>

${siteFooter()}

</body>
</html>
`;
}

/* ============================================================
   TRANG NHÀ RANG (/nha-rang/<slug>) — Vùng → Nhà rang → Sản phẩm → Review
   ============================================================ */
/* ---- Mức giá tương đối giữa các nhà rang (từ giá/100g gói chính) ---- */
const ROASTER_PER100 = ROASTER.map(r => {
  const p = (r.sanPham || []).map(id => SP_BY_ID[id]).filter(Boolean)[0];
  return { slug: r.slug, v: p ? (per100(p) || 0) : 0 };
}).filter(x => x.v > 0).sort((a, b) => a.v - b.v);
function priceTier(r) {
  const idx = ROASTER_PER100.findIndex(x => x.slug === r.slug);
  if (idx < 0) return '';
  const third = Math.ceil(ROASTER_PER100.length / 3);
  return idx < third ? '$' : (idx < third * 2 ? '$$' : '$$$');
}

function roasterPage(r) {
  const url = `${ORIGIN}/nha-rang/${r.slug}`;
  const prods = (r.sanPham || []).map(id => SP_BY_ID[id]).filter(Boolean);
  const a = roasterAvg(r);
  const vung = VUNG_BY_SLUG[r.vungSlug];
  const title = `${r.ten} — hồ sơ nhà rang, sản phẩm & điểm nếm mù | Gu Cà Phê`;
  const desc = `${r.ten}: ${r.gioiThieu} Vùng nguyên liệu ${r.vungChinh}.${a ? ` Điểm ${a.avg}/10 (${a.n} gói đã nếm) trên Gu.` : ''}`;
  const ga = (SITE.ga4 || '').trim();

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: r.ten,
    description: r.gioiThieu,
    url,
    areaServed: r.vungChinh
  };
  if (r.web) org.sameAs = [r.web];
  if (a) org.aggregateRating = {
    '@type': 'AggregateRating', ratingValue: a.avg, bestRating: 10, worstRating: 0, ratingCount: a.n
  };
  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gu Cà Phê', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Nhà rang', item: `${ORIGIN}/nha-rang` },
      { '@type': 'ListItem', position: 3, name: r.ten }
    ]
  };
  const others = ROASTER.filter(x => x.slug !== r.slug);
  const tier = priceTier(r);
  const scoredProd = prods.find(p => p.tested && p.diem != null);
  const scored = !!scoredProd;
  const faqSchema = (r.faq && r.faq.length) ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: r.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  } : null;
  const conf = [['Đã mua', true], ['Đã uống', true], ['Đã tìm hiểu', true], [scored ? 'Đã chấm mù' : 'Chưa chấm mù', scored]];

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Gu Cà Phê">
${ogMeta(ogForSrc(prods[0] && prods[0].anh), r.ten)}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(org)}</script>
<script type="application/ld+json">${JSON.stringify(crumb)}</script>
${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
  try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){} /* bật :active trên iOS */
  var GA=${JSON.stringify(ga)};
  window.dataLayer=window.dataLayer||[];
  window.guTrack=function(ev,p){try{if(window.gtag)gtag('event',ev,p||{});dataLayer.push(Object.assign({event:ev},p||{}));}catch(e){}};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA,{anonymize_ip:true});}
})();
</script>
</head>
<body class="rp-body">
${siteNav('nharang')}

<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb">
    <a href="/">Gu Cà Phê</a><i>/</i><a href="/nha-rang">Nhà rang</a><i>/</i><span>${esc(r.ten)}</span>
  </nav>

  ${vung && vung.anh ? `<div class="rr-cover">
    <img src="${/^https?:/.test(vung.anh) ? vung.anh : '/' + vung.anh}" alt="Vùng nguyên liệu ${esc(vung.ten)}" fetchpriority="high">
    <div class="rr-cover-scrim"></div>
    <span class="rr-cover-cap">Vùng nguyên liệu · ${esc(vung.ten)}</span>
  </div>` : ''}

  <header class="vg-hero${a ? ' has-score' : ''}">
    <div class="eyebrow">Nhà rang${vung ? ` · ${esc(vung.ten)}` : ''}</div>
    <h1>${esc(r.ten)}</h1>
    ${a ? `<div class="rr-score"><span class="rr-score-n">${a.avg}<i>/10</i></span><span class="rr-score-t">Điểm nếm mù cao nhất Gu chấm tới nay${a.n ? ` · ${a.n} gói đã nếm mù` : ''}</span></div>` : ''}
    <p class="vg-hero-tag">${esc(r.motCau || r.gioiThieu)}</p>
    ${scoredProd ? `<a class="cta rr-cta" href="/review/${scoredProd.slug}">Xem gói đạt ${a.avg}/10 — ${esc(scoredProd.ten)} →</a>` : ''}
    <div class="vg-facts">
      <div class="vg-fact"><span>Vùng nguyên liệu</span><b>${vung ? `<a href="/vung-trong/${vung.slug}">${esc(r.vungChinh)}</a>` : esc(r.vungChinh)}</b></div>
      ${(r.doiTuong || r.hopAi) ? `<div class="vg-fact"><span>Phù hợp</span><b>${esc(r.doiTuong || r.hopAi)}</b></div>` : ''}
      ${tier ? `<div class="vg-fact"><span>Mức giá</span><b>${tier}</b></div>` : ''}
      <div class="vg-fact"><span>${a ? 'Gu Score' : 'Trạng thái'}</span><b>${a ? `${a.avg}/10` : 'Đã uống · chưa chấm mù'}</b></div>
    </div>
  </header>

  ${r.verdict ? `<section class="gv">
    <div class="gv-head"><span class="gv-kick">Gu Cà Phê nhận xét</span><p class="gv-line">${esc(r.verdict)}</p></div>
    <div class="gv-cols">
      ${(r.hopNhat && r.hopNhat.length) ? `<div class="gv-col gv--yes"><div class="gv-cap">Nên chọn nếu bạn</div><ul>${r.hopNhat.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${(r.khongHop && r.khongHop.length) ? `<div class="gv-col gv--no"><div class="gv-cap">Cân nhắc nếu bạn</div><ul>${r.khongHop.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    </div>
    <div class="gv-conf">${conf.map(([k, ok]) => `<span class="gv-conf-i ${ok ? 'is-on' : 'is-off'}">${ok ? '✓' : '○'} ${k}</span>`).join('')}</div>
  </section>` : ''}

  ${(r.chuoi && r.chuoi.length) ? `<section class="chain" aria-label="Chuỗi sản xuất">
    ${r.chuoiNote ? `<div class="chain-cap">${esc(r.chuoiNote)}</div>` : ''}
    <div class="chain-flow">${r.chuoi.map((s, i) => `${i ? '<span class="chain-arrow" aria-hidden="true">→</span>' : ''}<span class="chain-step"><span class="chain-n">${i + 1}</span>${esc(s)}</span>`).join('')}</div>
  </section>` : ''}

  <section class="vg-prods">
    <h2 class="rg-h">Sản phẩm Gu đã mua</h2>
    ${prods.length
      ? `<div class="pc-grid">${prods.map(p => pcard(p)).join('')}</div>`
      : `<div class="vg-empty">
          <p>Gu <b>chưa mua & nếm mù</b> gói nào của ${esc(r.ten)}. Đúng nguyên tắc: chưa thử thì không chấm, không gợi ý.</p>
          <div class="vg-empty-cta">
            ${vung ? `<a class="cta" href="/vung-trong/${vung.slug}">Xem vùng ${esc(vung.ten)} →</a>` : ''}
            <a class="cta-line" href="/#pick">Để chúng tôi chọn theo gu bạn</a>
          </div>
        </div>`}
  </section>

  ${(a && r.viSaoDiem && r.viSaoDiem.length) ? `<section class="rr-why">
    <h2 class="rg-h">Vì sao Gu chấm ${a.avg}/10?</h2>
    <p class="rr-why-note">Điểm đến từ bài <b>nếm mù</b> (che nhãn, che giá) gói ${esc(scoredProd ? scoredProd.ten : '')} — không phải cảm nhận chung về nhà rang.</p>
    <ul class="rr-why-list">${r.viSaoDiem.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  </section>` : ''}

  ${(r.diemManh || r.diemCanBiet) ? `<section class="rg-fit">
    <h2 class="rg-h">Điều Gu đánh giá cao ở ${esc(r.ten)}</h2>
    <div class="rg-fit-cols rg-fit--weighted">
      ${(r.diemManh && r.diemManh.length) ? `<div class="rg-fit-col rg-fit--yes"><div class="rg-fit-cap">Điểm mạnh</div><ul>${r.diemManh.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${(r.diemCanBiet && r.diemCanBiet.length) ? `<div class="rg-fit-col rg-fit--no"><div class="rg-fit-cap">Điểm cần biết</div><ul>${r.diemCanBiet.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>` : ''}

  <article class="rp-article vg-article">
    ${r.lichSu ? `<h2 class="rp-sub">Hồ sơ &amp; năng lực</h2>${r.lichSu}` : `<p><i>Hồ sơ chi tiết về ${esc(r.ten)} đang được Gu biên soạn.</i></p>`}
    ${r.chungNhan ? `<p class="rp-cred-line"><b>Chứng nhận / thành tích:</b> ${esc(r.chungNhan)}${r.web ? ` · <a href="${esc(r.web)}" target="_blank" rel="nofollow noopener">Trang chính thức ↗</a>` : ''}</p>` : ''}
  </article>

  ${(r.faq && r.faq.length) ? `<section class="rg-faq">
    <h2 class="rg-h">Câu hỏi thường gặp về ${esc(r.ten)}</h2>
    <dl>${r.faq.map(f => `<div class="rg-faq-item"><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl>
  </section>` : ''}

  ${others.length ? `
  <section class="rp-related">
    <h2 class="rg-h">Nếu ${esc(r.ten)} chưa hợp bạn</h2>
    <div class="rn-grid">
      ${others.map(o => `<a class="rn" href="/nha-rang/${o.slug}">
        <span class="rn-need">${esc(o.nhuCau || o.hopAi || '')}</span>
        <span class="rn-name">${esc(o.ten)}</span>
        ${o.theManh ? `<span class="rn-manh">${esc(o.theManh)}</span>` : ''}
      </a>`).join('')}
    </div>
  </section>` : ''}

  <a class="rp-home" href="/">← Về trang chủ Gu Cà Phê</a>
</main>
${siteFooter()}

</body>
</html>
`;
}

/* ---- Hero cho trang hub: ảnh banner + tiêu đề nổi trên ảnh, lead ở dưới ---- */
// Dính các cụm từ đi đôi bằng non-breaking space để tiêu đề không bị ngắt xấu
const NB = '\u00A0';
function hubHero(img, eyebrow, title, leadHTML, extra = '') {
  const t = esc(title).replace(/đặc sản/g, 'đặc' + NB + 'sản').replace(/Lâm Đồng/g, 'Lâm' + NB + 'Đồng');
  return `<header class="hub-hero">
    <div class="hub-hero-banner">
      <img src="${img}" alt="${esc(title)}" fetchpriority="high">
      <div class="hub-hero-scrim"></div>
      <div class="hub-hero-cap"><div class="eyebrow">${esc(eyebrow)}</div><h1>${t}</h1></div>
    </div>
    ${leadHTML ? `<div class="hub-hero-text"><p class="lead">${leadHTML}</p>${extra}</div>` : ''}
  </header>`;
}

/* ============================================================
   HUB PAGES — /nha-rang · /ca-phe · /vung-trong · /kien-thuc · /cach-test
   ============================================================ */
const VUNG_ORDER = ['nam-ban', 'cau-dat', 'lac-duong', 'da-lat'];

function hubNhaRang() {
  const url = `${ORIGIN}/nha-rang`;
  const ordered = VUNG_ORDER.flatMap(s => ROASTER.filter(r => r.vungSlug === s))
    .concat(ROASTER.filter(r => !VUNG_ORDER.includes(r.vungSlug)));
  const list = ordered.length === ROASTER.length ? ordered : ROASTER;
  const schema = itemListSchema('Nhà rang cà phê đặc sản Lâm Đồng',
    ROASTER.map(r => ({ url: `${ORIGIN}/nha-rang/${r.slug}`, name: r.ten })));
  const needCards = list.filter(r => r.nhuCau).map(r => `<a class="rn" href="/nha-rang/${r.slug}">
      <span class="rn-need">${esc(r.nhuCau)}</span>
      <span class="rn-name">${esc(r.ten)}</span>
      ${r.theManh ? `<span class="rn-manh">${esc(r.theManh)}</span>` : ''}
    </a>`).join('');
  const cmpTable = list.every(r => r.theManh && r.hopAi) ? `<section class="rg-cmp">
    <h2 class="rg-h">So sánh nhanh sáu nhà rang</h2>
    <div class="rg-cmp-scroll">
      <table class="rc-tbl">
        <thead><tr><th>Nhà rang</th><th>Thế mạnh</th><th>Hợp ai</th></tr></thead>
        <tbody>${list.map(r => `<tr><td><a href="/nha-rang/${r.slug}">${esc(r.ten)}</a></td><td>${esc(r.theManh)}</td><td>${esc(r.hopAi)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </section>` : '';
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Nhà rang</span></nav>
  ${hubHero('/assets/img/hero/roasting.jpg', 'Nhà rang', 'Nhà rang chúng tôi chọn đồng hành',
    'Không phải nhà rang lớn nhất — mà là những nơi chúng tôi đã <b>mua, uống, tìm hiểu</b> và sẵn sàng giới thiệu cho bạn. Chỉ sáu, không hơn.',
    '<p class="hub-fair">Thứ tự bên dưới <b>không phải xếp hạng</b> — mỗi nhà một thế mạnh riêng. Điểm số chỉ gắn khi đã nếm mù chính thức.</p>')}

  <p class="hub-intro">Gu Cà Phê hiện theo dõi và đánh giá <b>6 nhà rang</b> tại Lâm Đồng. Danh sách này <b>không dựa trên phí tài trợ</b>, mà dựa trên việc chúng tôi đã mua sản phẩm, uống thử và tìm hiểu trực tiếp từng đơn vị.</p>

  ${needCards ? `<section class="seg-wrap">
    <div class="hub-sec-head">
      <div class="eyebrow">① Chọn nhanh theo nhu cầu</div>
      <h2 class="hub-sec-t">Bạn hợp nhà rang nào?</h2>
      <p class="hub-sec-sub">Mỗi nhà một thế mạnh — bấm vào nhu cầu giống bạn nhất.</p>
    </div>
    <div class="rn-grid">${needCards}</div>
  </section>` : ''}

  <section class="cmp-sec">
    <div class="hub-sec-head">
      <div class="eyebrow">② Sáu hồ sơ</div>
      <h2 class="hub-sec-t">Hồ sơ từng nhà rang</h2>
    </div>
    <div class="vg-grid">${list.map(roasterCardHTML).join('')}</div>
  </section>

  ${cmpTable}
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: '6 nhà rang cà phê đặc sản Lâm Đồng chúng tôi chọn đồng hành | Gu Cà Phê',
    desc: 'Sáu nhà rang cà phê đặc sản Lâm Đồng Gu đã mua, uống và tìm hiểu: Bùi, Dehavi, Tám Trình, Sơn Pacamara, The Married Beans, Là Việt — mỗi nhà một thế mạnh, hợp ai.',
    url, ogType: 'website', schema, active: 'nharang', main,
    ogImage: ogForSrc('roasting.jpg'), ogAlt: 'Nhà rang cà phê đặc sản Lâm Đồng'
  });
}

function buyMini(p, pos) {
  return `<a class="cta cta-sm" href="${esc(p.link || '#')}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'shopee',position:'${pos}',tested:${p.tested ? 1 : 0}})">Mua</a>`;
}
/* Thẻ sản phẩm dạng hình — 3 ô/hàng, ít chữ. anh = ảnh thật (dán link vào data.js),
   chưa có thì hiện swatch màu rang. Muốn đọc kỹ thì bấm vào. */
function pcard(p, pos) {
  const t = p.tested && p.diem != null;
  const src = p.anh ? (/^https?:/.test(p.anh) ? p.anh : '/' + p.anh) : '';
  const media = src
    ? `<img src="${esc(src)}" alt="${esc(p.brand)} — ${esc(p.ten)}" loading="lazy">`
    : `<div class="pc-swatch" style="background:${ROAST_BG[p.roast] || '#8A6A44'}"><span>${esc(p.roast ? 'Rang ' + p.roast.toLowerCase() : 'Đặc sản')}</span></div>`;
  const badge = t ? `<span class="pc-badge pc-badge-scored">${p.diem}</span>` : '';
  const rchip = p.confidence === 'editor_research' ? `<span class="pc-research">Mới nghiên cứu</span>` : '';
  return `<div class="pc" data-tested="${t ? 1 : 0}" data-diem="${p.diem || 0}" data-gia="${p.gia || 0}" data-per100="${per100(p) || 0}">
      <a class="pc-media" href="/review/${p.slug}">${media}${badge}${rchip}</a>
      <div class="pc-body">
        ${p.guPick ? `<div class="pc-gp pc-gp--${p.guPick}">${GUPICK[p.guPick]}</div>` : ''}
        <div class="pc-brand">${esc(p.brand)}</div>
        <a class="pc-name" href="/review/${p.slug}">${esc(p.ten)}</a>
        ${p.chungNhan ? `<div class="pc-cred"><span class="pc-cred-ic">✓</span>${esc(p.chungNhan)}</div>` : ''}
        ${(p.tags && p.tags.length) ? `<div class="pc-tags">${p.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="pc-meta">${priceHTML(p)}</div>
        <div class="pc-foot">${buyMini(p, pos || 'product_card')}<a class="pc-detail" href="/review/${p.slug}">Chi tiết →</a></div>
      </div>
    </div>`;
}
const GUPICK = { editor: 'Editor’s Pick', signature: 'Signature', collector: 'Collector' };
const priceHTML = p => p.gia != null
  ? `${money(p.gia)}${per100(p) ? ` · <span>${money(per100(p))}/100g</span>` : ''}`
  : `<span class="pc-tbd">Giá đang cập nhật</span>`;
/* ---- Bộ chọn theo vị — dùng chung /ca-phe & /vung-trong (nhất quán "ngôn ngữ hương vị") ---- */
function tasteSelector(title) {
  const subs = VUNG.filter(v => !v.hub);
  const byChua = [...subs].sort((a, b) => ((b.camQuan && b.camQuan.chua) || 0) - ((a.camQuan && a.camQuan.chua) || 0));
  const byChoco = [...subs].sort((a, b) => ((b.camQuan && b.camQuan.choco) || 0) - ((a.camQuan && a.camQuan.choco) || 0));
  const chuaR = byChua[0];
  const chocoR = byChoco[0];
  const canBangR = subs.find(x => x !== chuaR && x !== chocoR) || subs[0];
  const tastes = [
    ['#C79A5B', 'Chua sáng · hương hoa', chuaR],
    ['#9A6E44', 'Cân bằng · dễ uống', canBangR],
    ['#3A2718', 'Đậm · chocolate', chocoR]
  ].filter(t => t[2]);
  if (!tastes.length) return '';
  return `<section class="vg-taste">
    <div class="vg-taste-q">${esc(title || 'Bạn thích vị nào?')}</div>
    <div class="vg-taste-opts">
      ${tastes.map(([sw, label, r]) => `<a class="vg-taste-opt" href="/vung-trong/${r.slug}"><span class="vg-taste-sw" style="background:${sw}"></span><span class="vg-taste-l">${esc(label)}</span><span class="vg-taste-r">→ ${esc(r.ten)}</span></a>`).join('')}
    </div>
  </section>`;
}

function hubCaPhe() {
  const url = `${ORIGIN}/ca-phe`;
  const rank = SP.slice().sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0) || (b.diem || 0) - (a.diem || 0));
  const seg = NHUCAU.map((n, i) => {
    const p = SP_BY_ID[n.spId]; if (!p) return '';
    const t = p.tested && p.diem != null;
    const tag = t ? `<span class="seg-score">${p.diem}/10</span>` : '';
    return `<div class="seg">
        <div class="seg-need">
          <span class="seg-n">${String(i + 1).padStart(2, '0')}</span>
          <div><div class="seg-label">${esc(n.label)}</div><div class="seg-vi">${esc(n.vi)}</div></div>
        </div>
        <a class="seg-answer" href="/review/${p.slug}">
          <div class="seg-answer-top"><span class="seg-answer-name"><b>${esc(p.brand)}</b> · ${esc(p.ten)}</span>${tag}</div>
          <div class="seg-answer-price">${money(p.gia)}${per100(p) ? ` · ${money(per100(p))}/100g` : ''}</div>
        </a>
        <div class="seg-foot">${buyMini(p, 'ca_phe_segment')}<a class="seg-detail" href="/review/${p.slug}">Chi tiết →</a></div>
      </div>`;
  }).join('');
  const schema = itemListSchema('Cà phê đặc sản Lâm Đồng',
    SP.map(p => ({ url: `${ORIGIN}/review/${p.slug}`, name: `${p.brand} ${p.ten}` })));
  const nGoi = SP.length;
  const nRang = ROASTER.filter(r => (r.sanPham || []).some(id => SP_BY_ID[id])).length;
  const nCham = SP.filter(p => p.tested && p.diem != null).length;
  const nUong = SP.filter(p => (p.tested && p.diem != null) || p.daUong).length;
  const nNC = SP.filter(p => p.confidence === 'editor_research').length;
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Cà phê</span></nav>
  ${hubHero('/assets/img/products/hand-beans.jpg', 'Cà phê', 'Cà phê đặc sản Lâm Đồng',
    'Bộ sưu tập tuyển chọn — mỗi gói đại diện cho một phần bức tranh cà phê đặc sản. Gói nào Gu đã <b>chấm mù</b> thì có điểm; gói mới nghiên cứu từ nguồn chính thức được ghi rõ <b>“Mới nghiên cứu”</b>. Không phải bảng xếp hạng.')}

  <p class="hub-intro">Gu Cà Phê đã <b>mua và uống thật ${nUong} gói</b> từ <b>${nRang} nhà rang</b> ở Lâm Đồng${nCham ? `, trong đó <b>${nCham} gói đã chấm mù</b>` : ''}${nNC ? `; thêm <b>${nNC} gói đang nghiên cứu</b> từ nguồn chính thức (ghi rõ nhãn “Mới nghiên cứu”, chưa gắn điểm)` : ''}. Mỗi gói được chọn vì bổ sung một góc khác của bản đồ cà phê đặc sản.</p>

  ${NHUCAU.length ? `<section class="seg-wrap">
    <div class="hub-sec-head">
      <div class="eyebrow">① Chọn nhanh theo nhu cầu</div>
      <h2 class="hub-sec-t">Bắt đầu từ nhu cầu của bạn</h2>
      <p class="hub-sec-sub">Bấm vào nhóm giống bạn nhất — chúng tôi trỏ thẳng <b>một gói hợp nhất</b>, khỏi phải so cả bảng. Chỉ mất khoảng 20 giây.</p>
    </div>
    <div class="seg-grid">${seg}</div>
  </section>` : ''}

  ${tasteSelector('Không biết chọn? Bắt đầu từ vị bạn thích')}

  <section class="cmp-sec">
    <div class="hub-sec-head">
      <div class="eyebrow">② Tất cả sản phẩm</div>
      <div class="cmp-bar">
        <h2 class="hub-sec-t">Bộ sưu tập tuyển chọn của Gu</h2>
        <div class="cmp-sortbar">
          <span>Sắp theo:</span>
          <button class="on" onclick="cpSort('diem',this)">Điểm cao</button>
          <button onclick="cpSort('gia',this)">Giá thấp</button>
          <button onclick="cpSort('per100',this)">Giá/100g</button>
        </div>
      </div>
      <p class="hub-sec-sub">Mỗi gói được chọn vì đại diện cho một phần của bức tranh cà phê đặc sản — không phải catalog.</p>
    </div>
    <div class="gu-legend">
      <span class="gu-legend-t">Nhãn tuyển chọn:</span>
      <span class="pc-gp pc-gp--editor">Editor’s Pick</span> gói đại diện nhà rang ·
      <span class="pc-gp pc-gp--signature">Signature</span> gói đặc trưng ·
      <span class="pc-gp pc-gp--collector">Collector</span> dòng hiếm ·
      <span class="pc-research pc-research--inline">Mới nghiên cứu</span> Gu chưa nếm
    </div>
    <div class="pc-grid">${rank.map(p => pcard(p, 'ca_phe_card')).join('')}</div>
  </section>

  <a class="hub-cta" href="/kien-thuc">
    <span class="hub-cta-k">Mới uống specialty?</span>
    <span class="hub-cta-t">Đọc nền tảng trước — chỉ 5 phút</span>
    <span class="hub-cta-go">Vào Kiến thức →</span>
  </a>
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>
  <script>
  function cpSort(k,btn){
    document.querySelectorAll('.cmp-sortbar button').forEach(function(b){b.classList.toggle('on',b===btn);});
    var g=document.querySelector('.pc-grid'); if(!g) return;
    var dir=(k==='diem')?-1:1;
    [].slice.call(g.querySelectorAll('.pc')).sort(function(a,b){
      return (parseFloat(a.dataset[k])-parseFloat(b.dataset[k]))*dir;
    }).forEach(function(x){g.appendChild(x);});
  }
  </script>`;
  return pageShell({
    title: 'Cà phê đặc sản Lâm Đồng — đã nếm mù, chấm điểm, giá/100g | Gu Cà Phê',
    desc: 'Cà phê đặc sản Lâm Đồng: điểm nếm mù, giá, giá/100g, mua ở đâu. Gợi ý gói theo nhu cầu — mới uống, gu đậm, mở quán, tự rang.',
    url, ogType: 'website', schema, active: 'caphe', main,
    ogImage: ogForSrc('cup-espresso.jpg'), ogAlt: 'Cà phê đặc sản Lâm Đồng'
  });
}

function hubVung() {
  const url = `${ORIGIN}/vung-trong`;
  const hub = VUNG.find(v => v.hub);
  const subs = VUNG.filter(v => !v.hub);
  const schema = itemListSchema('Vùng trồng cà phê Lâm Đồng',
    VUNG.map(v => ({ url: `${ORIGIN}/vung-trong/${v.slug}`, name: `Cà phê ${v.ten}` })));
  const taste = tasteSelector('Bạn thích vị nào?');
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Vùng trồng</span></nav>
  ${hubHero('/assets/img/regions/da-lat.jpg', 'Vùng trồng', 'Chọn vùng, chọn đúng gu',
    'Bạn thích cà phê chua sáng hương hoa, hay đậm đà chocolate? Mỗi vùng ở Lâm Đồng cho một chất vị riêng — chọn đúng vùng là bước đầu để chọn đúng gói.')}
  ${taste}
  ${hub ? `<section class="hub-group"><div class="vg-grid">${regionCardHTML(hub)}</div></section>` : ''}
  <section class="hub-group">
    <div class="vg-grid">${subs.map(regionCardHTML).join('')}</div>
  </section>
  ${regionCompareTable({ slug: '' })}
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Vùng trồng cà phê Lâm Đồng — Cầu Đất, Lạc Dương, Nam Ban | Gu Cà Phê',
    desc: 'Ba tiểu vùng cà phê đặc sản Lâm Đồng: Cầu Đất, Lạc Dương, Nam Ban — độ cao, giống, hương vị đặc trưng và gói đáng mua từng vùng.',
    url, ogType: 'website', schema, active: 'vung', main,
    ogImage: ogForSrc('regions/da-lat.jpg'), ogAlt: 'Vùng trồng cà phê Lâm Đồng'
  });
}

/* ---- Minh hoạ mang thông tin (SVG/CSS, không ảnh, không bịa số) ---- */
function diagNaturalWashed() {
  const col = (mod, ten, sub, steps, tags) => `<div class="kt-diag-col ${mod}">
      <div class="kt-diag-h"><b>${ten}</b><span class="kt-diag-sub">${sub}</span></div>
      <ol class="kt-diag-steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol>
      <div class="kt-diag-res"><span class="kt-diag-res-k">Trong ly</span><div class="kt-diag-tags">${tags.map(t => `<span>${t}</span>`).join('')}</div></div>
    </div>`;
  return `<figure class="kt-diag kt-diag--nw" aria-label="So sánh sơ chế Washed và Natural">
    ${col('is-washed', 'Washed', 'Sơ chế ướt', ['Tách vỏ quả', 'Rửa sạch nhớt', 'Phơi khô hạt'], ['Sạch', 'Sáng', 'Chua thanh'])}
    <div class="kt-diag-vs">so với</div>
    ${col('is-natural', 'Natural', 'Sơ chế khô', ['Phơi nguyên quả', 'Ủ trong lớp thịt ngọt', 'Tách vỏ khô'], ['Ngọt đậm', 'Body dày', 'Trái cây chín'])}
  </figure>`;
}
function diagRoastScale() {
  const step = (bg, ten, vi, pha) => `<div class="kt-roast-step">
      <span class="kt-roast-bean" style="background:${bg}"></span>
      <b>${ten}</b><span class="kt-roast-vi">${vi}</span><em class="kt-roast-pha">${pha}</em>
    </div>`;
  return `<figure class="kt-diag kt-roast" aria-label="Thang độ rang từ sáng đến đậm">
    <div class="kt-roast-bar"></div>
    <div class="kt-roast-steps">
      ${step('#B07A2A', 'Rang sáng', 'Chua, hương hoa', 'V60 / pour over')}
      ${step('#7A5433', 'Rang vừa', 'Cân bằng, linh hoạt', 'Phin & pour over')}
      ${step('#3A2718', 'Rang đậm', 'Chocolate, đắng, body dày', 'Phin · espresso')}
    </div>
  </figure>`;
}
function diagGrind() {
  const row = (name, size, count, methods) => `<div class="gr-row">
      <div class="gr-name">${name}</div>
      <div class="gr-dots" aria-hidden="true">${Array.from({ length: count }).map(() => `<span style="width:${size}px;height:${size}px"></span>`).join('')}</div>
      <div class="gr-methods">${methods.map(m => `<span>${esc(m)}</span>`).join('')}</div>
    </div>`;
  return `<figure class="kt-diag kt-grind" aria-label="Cỡ xay cà phê theo cách pha">
    ${row('Xay thô', 9, 6, ['Cold brew', 'French Press'])}
    ${row('Xay thường', 7, 10, ['Pour over / V60'])}
    ${row('Xay mịn vừa', 5, 15, ['Aeropress', 'Pha phin', 'Moka pot'])}
    ${row('Xay mịn', 3, 22, ['Pha máy (espresso)'])}
  </figure>`;
}
function diagBrewing() {
  const COLS = ['Cách pha', 'Cỡ xay', 'Tỉ lệ', 'Cà phê', 'Nước', 'Nhiệt độ', 'Thời gian'];
  const ROWS = [
    ['Pour over / V60', 'Vừa', '1:15', '15–18g', '225–280ml', '91°C', '4–5 phút'],
    ['Espresso', 'Rất mịn', '1:2–1:3', '18–20g', '36–40ml*', '92–94°C', '30–45 giây'],
    ['Phin', 'Vừa', '1:4', '20g', '80ml', '91°C', '4–5 phút'],
    ['Cold brew', 'Thô', '1:10', '50g', '500ml', 'Lạnh 4–6°C', '~20 giờ'],
    ['Moka pot', 'Mịn', '—', '18g', '240ml', '—', '—'],
    ['Aeropress', 'Vừa', '1:14', '16g', '224ml', '90°C', '2,5–3 phút']
  ];
  return `<figure class="kt-diag kt-brew" aria-label="Công thức pha chuẩn theo cách pha">
    <div class="kt-brew-scroll">
      <table class="kt-brew-tbl">
        <thead><tr>${COLS.map((c, i) => `<th${i === 0 ? ' class="is-m"' : ''}>${c}</th>`).join('')}</tr></thead>
        <tbody>${ROWS.map(r => `<tr>${r.map((v, i) => i === 0 ? `<th scope="row">${v}</th>` : `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
    <figcaption>*Espresso: lượng nước lấy ra khỏi ly, không phải nước đổ vào. Con số là điểm khởi đầu — tinh chỉnh theo gu.</figcaption>
  </figure>`;
}
function diagFreshness() {
  const P = [
    ['0–7 ngày', 'Degas', 'Hạt còn nhả khí CO₂ — vị chưa ổn định, nước khó thấm đều.', false],
    ['7–45 ngày', 'Tuần vàng', 'Thời điểm ngon nhất: hương vị ổn định, ngọt và thơm nhất.', true],
    ['sau 45 ngày', 'Về sau', 'Vẫn uống được nếu bảo quản kín, chỉ kém tươi và thơm dần.', false]
  ];
  return `<figure class="kt-diag kt-fresh" aria-label="Cà phê ngon nhất khi nào tính theo ngày rang">
    <div class="kt-fresh-bar"></div>
    <div class="kt-fresh-steps">
      ${P.map(([t, name, desc, gold]) => `<div class="kt-fresh-step${gold ? ' is-gold' : ''}">
        <div class="kt-fresh-t">${t}</div>
        <div class="kt-fresh-n">${name}</div>
        <div class="kt-fresh-d">${desc}</div>
      </div>`).join('')}
    </div>
  </figure>`;
}
const DIAGRAMS = { 'natural-washed': diagNaturalWashed, 'rang-sang-dam': diagRoastScale, 'co-xay': diagGrind, 'cong-thuc-pha': diagBrewing, 'do-tuoi': diagFreshness };

/* Giải thích 5 trục cảm quan Gu ghi nhận (dùng ở /cach-test) */
function diagFlavorAxes() {
  const AX = [
    ['Độ chua', 'Vị chua sáng kiểu cam, chanh, trái cây — dấu hiệu Arabica vùng cao, không phải chua hỏng.'],
    ['Body', 'Độ dày, cảm giác “đầy miệng” của ly — từ mỏng nhẹ tới dày như chocolate.'],
    ['Ngọt', 'Vị ngọt tự nhiên và hậu ngọt, không phải do thêm đường.'],
    ['Hậu vị', 'Vị đọng lại sau khi nuốt — dài và sạch, hay ngắn và gắt.'],
    ['Độ sạch', 'Ly cà phê trong trẻo, rõ vị hay bị đục, tạp.']
  ];
  return `<figure class="kt-diag kt-axes" aria-label="Các trục cảm quan Gu ghi nhận">
    ${AX.map(([k, d]) => `<div class="kt-axis"><div class="kt-axis-k">${esc(k)}</div><div class="kt-axis-scale" aria-hidden="true"><span>nhẹ</span><i></i><span>đậm</span></div><div class="kt-axis-d">${esc(d)}</div></div>`).join('')}
  </figure>`;
}

/* Nhóm bài theo mức độ — mỗi nhóm là một lưới thẻ gọn, bấm vào mở trang bài riêng */
const KT_GROUPS = [
  { key: 'Người mới', kick: 'Nền tảng', title: 'Người mới bắt đầu từ đây',
    sub: 'Vài phút để đọc bao bì như dân trong nghề: sơ chế, độ rang, cỡ xay, và specialty có đáng tiền không.' },
  { key: 'Thực hành', kick: 'Pha & bảo quản', title: 'Ra ly ngon từ gói bạn đã có',
    sub: 'Công thức nền theo từng cách pha và cách đọc ngày rang để uống đúng “tuần vàng”.' },
  { key: 'Chọn mua', kick: 'So sánh', title: 'Chọn đúng gói để mua',
    sub: 'So sánh thẳng giữa các nhà, nối tới gói thật đã mua và uống.' }
];

const ktImg = b => b.anh ? (/^https?:/.test(b.anh) ? b.anh : '/' + b.anh) : '';

/* Lộ trình người mới "Bắt đầu với cà phê" — route riêng /bat-dau, tách khỏi /kien-thuc */
const BATDAU_TAG = 'Bắt đầu với cà phê';
const isBatDau = b => b.tag === BATDAU_TAG;
const artBase = b => (isBatDau(b) ? 'bat-dau' : 'kien-thuc');
const batDauSteps = () => BAIVIET.filter(isBatDau).sort((a, b) => (a.thuTu || 0) - (b.thuTu || 0));
/* Gói Gu khuyên cho người mới = gói điểm nếm mù cao nhất (tự cập nhật theo dữ liệu) */
const topPick = () => SP.filter(p => p.tested && p.diem != null).sort((a, b) => b.diem - a.diem)[0] || SP[0];

/* Thẻ bài — ảnh + tag + thời gian đọc + tiêu đề + dek, bấm mở /<route>/<id> */
function ktCard(b) {
  const src = ktImg(b);
  return `<a class="kt-card" href="/${artBase(b)}/${b.id}">
    ${src ? `<div class="kt-card-img"><img src="${esc(src)}" alt="${esc(b.tieuDe)}" loading="lazy"></div>` : ''}
    <div class="kt-card-body">
      <div class="kt-card-meta"><span class="kt-card-tag">${esc(b.tag)}</span>${b.docPhut ? `<span class="kt-card-min">${b.docPhut} phút đọc</span>` : ''}</div>
      <h3 class="kt-card-t">${esc(b.tieuDe)}</h3>
      <p class="kt-card-dek">${esc(b.dek)}</p>
      <span class="kt-card-go">Đọc →</span>
    </div>
  </a>`;
}

/* Trang bài riêng — /kien-thuc/<id> hoặc /bat-dau/<id>. Một chủ đề mỗi trang. */
function articlePage(b) {
  const bd = isBatDau(b);
  const base = artBase(b);
  const hubHref = bd ? '/bat-dau' : '/kien-thuc';
  const hubName = bd ? 'Bắt đầu với cà phê' : 'Kiến thức';
  const url = `${ORIGIN}/${base}/${b.id}`;
  const src = ktImg(b);
  const steps = bd ? batDauSteps() : [];
  const stepChip = bd && b.thuTu ? `Bước ${b.thuTu}/${steps.length}` : '';
  const meta = `<div class="kt-meta">${[b.tag, stepChip, b.docPhut ? `Đọc ${b.docPhut} phút` : '', b.mucDo]
    .filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</div>`;
  const faqBlock = (b.faq && b.faq.length) ? `<section class="kta-faq">
    <h2 class="kta-faq-h">Câu hỏi thường gặp</h2>
    ${b.faq.map((f, i) => `<details class="faq-i"${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
  </section>` : '';
  const linksBlock = (b.links && b.links.length)
    ? `<div class="kt-art-links">${b.links.map(l => `<a href="${l.href}">${esc(l.label)} →</a>`).join('')}</div>` : '';

  // Thân bài — chèn thẻ gói Gu khuyên vào marker {{GU_PICK}} (bài 4 lộ trình người mới)
  let body = b.than;
  if (body.includes('{{GU_PICK}}')) {
    const tp = topPick();
    const card = `<div class="bd-pick"><div class="bd-pick-cap">Gu khuyên bạn bắt đầu với:</div><div class="pc-grid bd-pick-grid">${pcard(tp, 'bat_dau_pick')}</div></div>`;
    body = body.split('{{GU_PICK}}').join(card);
  }

  // Đọc tiếp — bat-dau: bước kế trong lộ trình; kien-thuc: bài cùng nhóm
  let moreBlock = '';
  if (bd) {
    const next = steps.find(s => (s.thuTu || 0) === (b.thuTu || 0) + 1);
    moreBlock = `<section class="kta-more">
      <h2 class="kta-more-h">${next ? 'Bước tiếp theo' : 'Hoàn thành lộ trình'}</h2>
      ${next ? `<div class="kt-grid">${ktCard(next)}</div>` : `<p class="bd-done">Bạn đã đọc hết lộ trình người mới. Giờ chọn gói đầu tiên: <a href="/ca-phe">Xem các gói Gu khuyên →</a></p>`}
      <a class="bd-allsteps" href="/bat-dau">Xem cả 6 bước →</a>
    </section>`;
  } else {
    const related = [...BAIVIET.filter(x => !isBatDau(x) && x.id !== b.id && x.mucDo === b.mucDo),
      ...BAIVIET.filter(x => !isBatDau(x) && x.id !== b.id && x.mucDo !== b.mucDo)].slice(0, 3);
    moreBlock = related.length ? `<section class="kta-more">
      <h2 class="kta-more-h">Đọc tiếp</h2>
      <div class="kt-grid">${related.map(ktCard).join('')}</div>
    </section>` : '';
  }

  const schemas = [];
  schemas.push(`<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: b.tieuDe, description: b.dek, inLanguage: 'vi-VN',
    ...(src ? { image: `${ORIGIN}${src}` } : {}),
    mainEntityOfPage: url, publisher: { '@type': 'Organization', name: 'Gu Cà Phê' }
  })}</script>`);
  schemas.push(`<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gu Cà Phê', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: hubName, item: `${ORIGIN}${hubHref}` },
      { '@type': 'ListItem', position: 3, name: b.tieuDe, item: url }
    ]
  })}</script>`);
  if (b.faq && b.faq.length) schemas.push(`<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: b.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  })}</script>`);

  const main = `<main class="rp wrap kta-wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><a href="${hubHref}">${hubName}</a><i>/</i><span>${esc(b.tag)}</span></nav>
  <article class="kta">
    <header class="kta-head">
      ${meta}
      <h1 class="kta-t">${b.tieuDe}</h1>
      <p class="kta-dek">${b.dek}</p>
    </header>
    ${src ? `<figure class="kta-hero"><img src="${esc(src)}" alt="${esc(b.tieuDe)}" fetchpriority="high"></figure>` : ''}
    ${DIAGRAMS[b.id] ? DIAGRAMS[b.id]() : ''}
    <div class="kt-art-body kta-body">${body}</div>
    ${linksBlock}
  </article>
  ${faqBlock}
  ${moreBlock}
  <a class="rp-home" href="${hubHref}">← ${bd ? 'Lộ trình người mới' : 'Tất cả bài kiến thức'}</a>
  </main>`;
  return pageShell({
    title: `${b.tieuDe} | ${hubName} — Gu Cà Phê`,
    desc: b.dek, url, ogType: 'article', schema: schemas.join('\n'), active: bd ? 'batdau' : 'kienthuc', main,
    ogImage: ogForSrc(b.anh), ogAlt: b.tieuDe
  });
}

function hubKienThuc() {
  const url = `${ORIGIN}/kien-thuc`;

  // Lưới thẻ theo nhóm mức độ — gọn, có ảnh, bấm mở trang bài riêng (không nhảy trong trang)
  const covered = new Set();
  const groups = KT_GROUPS.map(g => {
    const arts = BAIVIET.filter(b => b.mucDo === g.key);
    arts.forEach(b => covered.add(b.id));
    if (!arts.length) return '';
    return `<section class="kt-group">
      <div class="kt-group-head"><span class="eyebrow">${esc(g.kick)}</span><h2 class="kt-group-t">${esc(g.title)}</h2><p class="kt-group-sub">${esc(g.sub)}</p></div>
      <div class="kt-grid">${arts.map(ktCard).join('')}</div>
    </section>`;
  }).join('');
  const rest = BAIVIET.filter(b => !isBatDau(b) && !covered.has(b.id));
  const restBlock = rest.length ? `<section class="kt-group">
    <div class="kt-group-head"><h2 class="kt-group-t">Bài khác</h2></div>
    <div class="kt-grid">${rest.map(ktCard).join('')}</div>
  </section>` : '';

  // Băng dẫn người mới sang lộ trình /bat-dau
  const newbie = batDauSteps().length ? `<a class="kt-newbie" href="/bat-dau">
    <span class="kt-newbie-k">Mới uống cà phê?</span>
    <span class="kt-newbie-t">Lộ trình 6 bước cho người mới — từ “đặc sản là gì” tới “nên mua gói nào”.</span>
    <span class="kt-newbie-go">Bắt đầu →</span>
  </a>` : '';

  // Mua gì? — câu hỏi intent cao, nối thẳng tới gói/vùng thật
  const muaGi = MUA_GI.length ? `<section class="kt-buy">
    <div class="kt-buy-head">
      <span class="kt-buy-kick">Mua gì?</span>
      <h2 class="kt-buy-t">Bạn đang phân vân chọn mua?</h2>
      <p class="kt-buy-sub">Trả lời nhanh những câu hỏi hay gặp nhất — nối thẳng tới gói hoặc vùng thật.</p>
    </div>
    <div class="kt-buy-grid">
      ${MUA_GI.map(m => `<a class="kt-buy-card" href="${m.href}">
        <div class="kt-buy-q">${esc(m.q)}</div>
        <p class="kt-buy-a">${m.a}</p>
        <span class="kt-buy-go">${esc(m.label)} →</span>
      </a>`).join('')}
    </div>
  </section>` : '';

  // Từ điển — thu gọn trong <details> để trang không dài lê thê
  const tudien = TU_DIEN.length ? `<section class="kt-tudien">
    <details class="kt-tudien-d">
      <summary><span class="kt-tudien-s">Từ điển cà phê nhanh</span><span class="kt-tudien-c">${TU_DIEN.length} thuật ngữ</span></summary>
      <div class="kt-def-grid">${TU_DIEN.map(t => `<div class="kt-def"><dt>${esc(t.t)}</dt><dd>${esc(t.d)}</dd></div>`).join('')}</div>
    </details>
  </section>` : '';

  // Schema FAQ gộp (bài viết + Mua gì) cho AI Search
  const allFaq = [...BAIVIET.filter(b => !isBatDau(b)).flatMap(b => b.faq || []), ...MUA_GI.map(m => ({ q: m.q, a: m.a.replace(/<[^>]+>/g, '') }))];
  const schema = allFaq.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: allFaq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  })}</script>` : '';

  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Kiến thức</span></nav>
  ${hubHero('/assets/img/products/beans-tin.jpg', 'Kiến thức', 'Hiểu trước khi mua',
    'Chọn sai không phải vì hạt dở, mà vì không biết mình đang mua gì. Vài bài ngắn để bạn đọc bao bì như dân trong nghề — rồi trả lời thẳng câu “tôi nên mua gì?”.')}
  ${newbie}
  ${groups}
  ${restBlock}
  ${muaGi}
  ${tudien}
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Kiến thức cà phê đặc sản — Natural/Washed, độ rang, mua gì? | Gu Cà Phê',
    desc: 'Học nền tảng cà phê đặc sản trong 10 phút: Natural khác Washed, rang sáng hay đậm, specialty có đáng tiền, và nên mua gói nào theo nhu cầu — dưới 200k, ít chua, pha phin, pha V60.',
    url, ogType: 'website', schema, active: 'kienthuc', main,
    ogImage: ogForSrc('art-natural-drying.jpg'), ogAlt: 'Kiến thức cà phê đặc sản'
  });
}

/* /bat-dau — lộ trình 6 bước cho người mới, dạng đường đi có đánh số */
function hubBatDau() {
  const url = `${ORIGIN}/bat-dau`;
  const steps = batDauSteps();
  const totalMin = steps.reduce((s, b) => s + (b.docPhut || 2), 0);
  const path = steps.map(b => `<a class="bd-step" href="/bat-dau/${b.id}">
    <span class="bd-step-n">${b.thuTu}</span>
    <span class="bd-step-body">
      <span class="bd-step-t">${esc(b.tieuDe)}</span>
      <span class="bd-step-dek">${esc(b.dek)}</span>
    </span>
    <span class="bd-step-go">→</span>
  </a>`).join('');
  const schema = steps.length ? itemListSchema('Lộ trình bắt đầu với cà phê đặc sản',
    steps.map(b => ({ url: `${ORIGIN}/bat-dau/${b.id}`, name: b.tieuDe }))) : '';
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Người mới</span></nav>
  ${hubHero('/assets/img/espresso-pull.jpg', 'Người mới', 'Bắt đầu với cà phê',
    `Sáu bài ngắn, đọc hết trong ~${totalMin} phút. Đi lần lượt từ “cà phê đặc sản là gì” tới “nên mua gói nào” — để bạn <b>hết sợ vị lạ, biết mua gì, và hiểu vì sao tin Gu</b>.`)}
  <p class="hub-intro">Không cần đọc lung tung. Cứ đi từ bước 1 tới bước 6, mỗi bài dắt sang bài kế — như một lối đi thẳng, không ngõ cụt.</p>
  <section class="bd-path">${path}</section>
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Bắt đầu với cà phê đặc sản — lộ trình 6 bước cho người mới | Gu Cà Phê',
    desc: 'Mới uống cà phê đặc sản? Lộ trình 6 bước: đặc sản là gì, Arabica/Robusta, cà phê chua có phải hỏng, mua gói nào đầu tiên, có cần máy đắt tiền, và cách Gu chọn gói.',
    url, ogType: 'website', schema, active: 'batdau', main,
    ogImage: ogForSrc('espresso-pull.jpg'), ogAlt: 'Bắt đầu với cà phê đặc sản'
  });
}

function hubCachTest() {
  const url = `${ORIGIN}/cach-test`;
  const faqSchema = FAQ.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  })}</script>` : '';
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Cách test</span></nav>
  ${hubHero('/assets/img/p4-taste.jpg', 'Minh bạch', 'Phương pháp đánh giá',
    'Chúng tôi công bố phương pháp trước khi đánh giá bất kỳ sản phẩm nào và giữ nguyên trong suốt quá trình. Thẩm quyền đến từ phương pháp, không từ lời khen.')}

  <section class="commit">
    <h2 class="commit-t">Cam kết của Gu Cà Phê</h2>
    <ul class="commit-list">
      <li>Mua bằng tiền của chúng tôi.</li>
      <li>Không nhận mẫu tài trợ.</li>
      <li>Không chấm điểm khi chưa nếm mù.</li>
      <li>Công khai phương pháp trước khi đánh giá.</li>
      <li>Sửa sai công khai nếu phát hiện sai sót.</li>
    </ul>
  </section>

  <h2 class="method-h">Quy trình 5 bước</h2>
  <ol class="steps">${QUY_TRINH.map(x => `<li><span>${x}</span></li>`).join('')}</ol>

  <h2 class="method-h">Gu ghi nhận những trục vị nào?</h2>
  ${diagFlavorAxes()}

  <div class="gallery">
    <figure><img src="/assets/img/p2-grind.jpg" alt="Cà phê xay cùng một cỡ" loading="lazy"><figcaption>Cùng cỡ xay</figcaption></figure>
    <figure><img src="/assets/img/p3-cup.jpg" alt="Các mẫu che nhãn để nếm mù" loading="lazy"><figcaption>Che nhãn · nếm mù</figcaption></figure>
    <figure><img src="/assets/img/p4-taste.jpg" alt="Chấm cảm quan bằng thìa cupping" loading="lazy"><figcaption>Chấm cảm quan</figcaption></figure>
    <figure><img src="/assets/img/products/beans-tin.jpg" alt="Ghi phiếu chấm điểm" loading="lazy"><figcaption>Ghi phiếu chấm</figcaption></figure>
  </div>

  <div class="method-notes">
    <p><b>Vì sao điểm số đáng tin:</b> điểm số là kết quả của một quy trình mà bất kỳ ai cũng có thể lặp lại — cùng cỡ xay, cùng tỷ lệ, cùng nhiệt độ và nếm mù. Thẩm quyền đến từ phương pháp, không từ lời khen.</p>
    <p><b>Về hoa hồng:</b> Chúng tôi có thể nhận hoa hồng tiếp thị liên kết nếu bạn mua qua liên kết trên trang; bạn không trả thêm chi phí nào. Liên kết xuất hiện cả ở sản phẩm được khuyên mua và sản phẩm được khuyên cân nhắc, vì vậy doanh thu không quyết định điểm số.</p>
  </div>

  <section class="method-limit">
    <h2>Giới hạn của phương pháp</h2>
    <p>Điểm số phản ánh kết quả trong điều kiện thử nghiệm của Gu Cà Phê. Khẩu vị mỗi người khác nhau; điểm số không nhằm thay thế sở thích cá nhân, mà giúp việc so sánh trở nên công bằng và nhất quán.</p>
  </section>

  ${FAQ.length ? `<div class="faq">${FAQ.map((f, i) => `<details class="faq-i"${i === 0 ? ' open' : ''}><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>` : ''}

  <div class="method-meta">
    <p><b>Cập nhật phương pháp:</b> 28/07/2026 · phiên bản 1.0</p>
    <p>Nếu quy trình thay đổi, chúng tôi sẽ công bố công khai trên trang này trước khi áp dụng cho các bài đánh giá mới.</p>
  </div>

  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Phương pháp đánh giá cà phê — mua ẩn danh, nếm mù, chấm cảm quan | Gu Cà Phê',
    desc: 'Phương pháp đánh giá cà phê của Gu Cà Phê: mua ẩn danh, pha cùng điều kiện (cỡ xay medium, 1:15, 92°C), nếm mù rồi mới công bố điểm. Cam kết, giới hạn phương pháp và chính sách hoa hồng minh bạch.',
    url, ogType: 'website', schema: faqSchema, active: 'method', main,
    ogImage: ogForSrc('espresso-pull.jpg'), ogAlt: 'Phương pháp đánh giá cà phê của Gu'
  });
}

/* ---- Ghi file ---- */
mkdirSync(join(ROOT, 'review'), { recursive: true });
const urls = [];
for (const p of SP) {
  if (!p.slug) { console.warn(`⚠️  Bỏ qua ${p.id}: thiếu slug`); continue; }
  writeFileSync(join(ROOT, 'review', `${p.slug}.html`), page(p), 'utf8');
  urls.push(`${ORIGIN}/review/${p.slug}`);
  console.log(`✓ review/${p.slug}.html`);
}

/* ---- Ghi trang vùng trồng ---- */
if (VUNG.length) mkdirSync(join(ROOT, 'vung-trong'), { recursive: true });
const regionUrls = [];
for (const v of VUNG) {
  if (!v.slug) { console.warn(`⚠️  Bỏ qua vùng thiếu slug`); continue; }
  writeFileSync(join(ROOT, 'vung-trong', `${v.slug}.html`), regionPage(v), 'utf8');
  regionUrls.push(`${ORIGIN}/vung-trong/${v.slug}`);
  console.log(`✓ vung-trong/${v.slug}.html`);
}

/* ---- Ghi trang nhà rang ---- */
if (ROASTER.length) mkdirSync(join(ROOT, 'nha-rang'), { recursive: true });
const roasterUrls = [];
for (const r of ROASTER) {
  if (!r.slug) { console.warn(`⚠️  Bỏ qua nhà rang thiếu slug`); continue; }
  writeFileSync(join(ROOT, 'nha-rang', `${r.slug}.html`), roasterPage(r), 'utf8');
  roasterUrls.push(`${ORIGIN}/nha-rang/${r.slug}`);
  console.log(`✓ nha-rang/${r.slug}.html`);
}

/* ---- Ghi hub pages (trang danh mục / hub theo menu) ---- */
const HUBS = [
  ['nha-rang', hubNhaRang], ['ca-phe', hubCaPhe], ['vung-trong', hubVung],
  ['kien-thuc', hubKienThuc], ['cach-test', hubCachTest],
  ...(batDauSteps().length ? [['bat-dau', hubBatDau]] : [])
];
const hubUrls = [];
for (const [slug, fn] of HUBS) {
  writeFileSync(join(ROOT, `${slug}.html`), fn(), 'utf8');
  hubUrls.push(`${ORIGIN}/${slug}`);
  console.log(`✓ ${slug}.html`);
}

/* ---- Ghi trang bài riêng: /kien-thuc/<id> và /bat-dau/<id> ---- */
if (BAIVIET.length) mkdirSync(join(ROOT, 'kien-thuc'), { recursive: true });
if (batDauSteps().length) mkdirSync(join(ROOT, 'bat-dau'), { recursive: true });
const articleUrls = [];
for (const b of BAIVIET) {
  if (!b.id) { console.warn('⚠️  Bỏ qua bài thiếu id'); continue; }
  const base = artBase(b);
  writeFileSync(join(ROOT, base, `${b.id}.html`), articlePage(b), 'utf8');
  articleUrls.push(`${ORIGIN}/${base}/${b.id}`);
  console.log(`✓ ${base}/${b.id}.html`);
}

/* ---- Cập nhật sitemap.xml (trang chủ + hub + review + nhà rang + vùng trồng) ---- */
const lastmod = isoDate(SITE.capNhat);
const entry = (u, pri) => `  <url>
    <loc>${u}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${pri}</priority>
  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${hubUrls.map(u => entry(u, '0.9')).join('\n')}
${urls.map(u => entry(u, '0.8')).join('\n')}
${articleUrls.map(u => entry(u, '0.7')).join('\n')}
${roasterUrls.map(u => entry(u, '0.7')).join('\n')}
${regionUrls.map(u => entry(u, '0.7')).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
const total = hubUrls.length + urls.length + articleUrls.length + roasterUrls.length + regionUrls.length + 1;
console.log(`✓ sitemap.xml (${total} URL)`);
console.log(`\nXong. ${hubUrls.length} hub · ${urls.length} review · ${articleUrls.length} bài · ${roasterUrls.length} nhà rang · ${regionUrls.length} vùng trồng.`);
