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
const CSS_V = '20260746';

/* ---- Đọc data.js trong sandbox nhỏ (chỉ để LẤY dữ liệu) ---- */
function loadData(src) {
  const names = ['SITE', 'QUY_TRINH', 'SP', 'CAP_SS', 'TU_DIEN', 'FAQ', 'BAIVIET', 'VUNG', 'ROASTER', 'NHUCAU'];
  const re = new RegExp('\\bconst\\s+(' + names.join('|') + ')\\b', 'g');
  const fn = new Function('ctx', src.replace(re, 'ctx.$1') + '\nreturn ctx;');
  return fn({});
}
const raw = readFileSync(join(ROOT, 'data/data.js'), 'utf8');
const { SITE, SP, VUNG = [], ROASTER = [], QUY_TRINH = [], FAQ = [], TU_DIEN = [], BAIVIET = [], NHUCAU = [] } = loadData(raw);
const SP_BY_ID = {}; SP.forEach(p => { SP_BY_ID[p.id] = p; });
const VUNG_BY_SLUG = {}; VUNG.forEach(v => { VUNG_BY_SLUG[v.slug] = v; });
// Nối ngược sản phẩm → nhà rang (product id có trong roaster.sanPham)
const ROASTER_BY_PID = {};
ROASTER.forEach(r => (r.sanPham || []).forEach(id => { ROASTER_BY_PID[id] = r; }));

/* ---- Helpers ---- */
const money  = n => Number(n).toLocaleString('vi-VN') + '₫';
const per100 = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
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
    <ul class="nav-links">
      ${MENU.map(([h, l, k]) => {
        const cls = [k === 'method' ? 'learn' : '', k === active ? 'on' : ''].filter(Boolean).join(' ');
        return `<li><a href="${h}"${cls ? ` class="${cls}"` : ''}>${l}</a></li>`;
      }).join('')}
    </ul>
  </div>
</nav>`;
}
function siteFooter() {
  return `<footer>
  <div class="wrap">
    <div id="tagline">${esc(SITE.tagline)}</div>
    <div>
      <a href="/nha-rang">Nhà rang</a>
      <a href="/ca-phe">Cà phê</a>
      <a href="/vung-trong">Vùng trồng</a>
      <a href="/kien-thuc">Kiến thức</a>
      <a href="/cach-test">Cách test</a>
    </div>
    <p class="foot-legal">Chúng tôi mua mọi sản phẩm bằng tiền của mình và nếm mù.
    Link trên trang là link tiếp thị liên kết — bạn không trả thêm đồng nào,
    và link có ở cả sản phẩm chúng tôi khuyên cân nhắc. Gói nào chưa nếm, trang ghi rõ.</p>
  </div>
</footer>`;
}
function pageHead({ title, desc, url, ogType = 'article', schema = '' }) {
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
  var GA=${JSON.stringify(ga)};
  window.dataLayer=window.dataLayer||[];
  window.guTrack=function(ev,p){try{if(window.gtag)gtag('event',ev,p||{});dataLayer.push(Object.assign({event:ev},p||{}));}catch(e){}};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA,{anonymize_ip:true});}
})();
</script>
</head>`;
}
function pageShell({ title, desc, url, ogType, schema, active, main }) {
  return `${pageHead({ title, desc, url, ogType, schema })}
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
  return `<a class="vg-card" href="/nha-rang/${r.slug}">
      <div class="vg-card-top"><div class="vg-card-name">${esc(r.ten)}</div>${a ? `<span class="vg-badge">${a.avg}/10</span>` : ''}</div>
      <div class="vg-card-tag">${esc(r.gioiThieu)}</div>
      <div class="vg-card-meta">Vùng: ${esc(r.vungChinh)}</div>
      <span class="vg-card-go">Xem hồ sơ →</span>
    </a>`;
}
function regionCardHTML(v) {
  return `<a class="vg-card${v.hub ? ' vg-hub' : ''}" href="/vung-trong/${v.slug}">
      <div class="vg-card-top"><div class="vg-card-name">${esc(v.ten)}</div>${v.hub ? '<span class="vg-badge">Tổng quan</span>' : ''}</div>
      <div class="vg-card-tag">${esc(v.tagline)}</div>
      <div class="vg-card-meta">${[v.doCao, v.giong].filter(Boolean).map(esc).join(' · ')}</div>
      <span class="vg-card-go">Tìm hiểu →</span>
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
    return `Gói này chúng tôi <b>chưa nếm mù</b> — thông số lấy từ mô tả nhà bán, chúng tôi ghi rõ để bạn tự cân nhắc chứ không chấm điểm.`;
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
  return `<p><b>${esc(p.brand)} — ${esc(p.ten)}</b>${c ? ` (${esc(c)})` : ''} hiện <b>chưa được chúng tôi nếm mù</b>, nên trang này <b>không chấm điểm</b>. `
    + `Thông số bên dưới lấy từ mô tả của nhà bán. Chúng tôi liệt kê để bạn có đủ thông tin cân nhắc, và ghi rõ nhãn “Chưa nếm” — không giả vờ đã thử.</p>`;
}

function flavorPara(p) {
  const notes = (p.tested && p.notes && p.notes.length)
    ? `Ghi chú vị khi nếm mù: <b>${p.notes.map(esc).join(' · ')}</b>. `
    : '';
  return `<p>${notes}${esc(p.flavor || '')}</p>`;
}

/* ---- Nút mua (affiliate) — rel="sponsored" đúng chuẩn Google ---- */
function buyLink(p, label) {
  const url = esc(p.link || '#');
  const alts = [];
  if (p.lazada) alts.push(`<a class="cta-alt" href="${esc(p.lazada)}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'lazada',position:'review_page',tested:${p.tested ? 1 : 0}})">Lazada</a>`);
  if (p.tiki)   alts.push(`<a class="cta-alt" href="${esc(p.tiki)}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'tiki',position:'review_page',tested:${p.tested ? 1 : 0}})">Tiki</a>`);
  return `<a class="cta" href="${url}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'shopee',position:'review_page',tested:${p.tested ? 1 : 0}})">${label || 'Mua trên Shopee'} · ${money(p.gia)}</a>`
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
  return `<script type="application/ld+json">${JSON.stringify(product)}</script>\n`
    + `<script type="application/ld+json">${JSON.stringify(crumb)}</script>`;
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
          <div class="rp-rel-meta">${o.tested && o.diem != null ? `<b>${o.diem}/10</b>` : '<span class="rp-ut">Chưa nếm</span>'} · ${money(o.gia)}</div>
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

/* ---- Trang review đầy đủ ---- */
function page(p) {
  const url = `${ORIGIN}/review/${p.slug}`;
  const tested = p.tested && p.diem != null;
  const title = `${p.brand} ${p.ten} — Review${tested ? ` & điểm nếm mù ${p.diem}/10` : ' (chưa nếm)'} | Gu Cà Phê`;
  const firstSentence = (p.flavor || '').split('.')[0];
  const desc = tested
    ? `${p.brand} ${p.ten}: nếm mù chấm ${p.diem}/10. ${firstSentence}. Giá ${money(p.gia)}${per100(p) ? `, ${money(per100(p))}/100g` : ''}. Review trung lập từ Gu Cà Phê.`
    : `${p.brand} ${p.ten}: chưa nếm mù nên chưa chấm điểm — thông số từ nhà bán, giá ${money(p.gia)}. Gu Cà Phê ghi rõ gói nào đã test.`;
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

  <header class="rp-hero">
    ${media(p)}
    <div class="rp-hero-body">
      <div class="eyebrow">Review · ${tested ? 'Đã nếm mù' : 'Chưa nếm'}</div>
      <div class="rp-brand">${ROASTER_BY_PID[p.id] ? `<a href="/nha-rang/${ROASTER_BY_PID[p.id].slug}">${esc(p.brand)}</a>` : esc(p.brand)}</div>
      <h1>${esc(p.ten)}</h1>
      ${cuesOf(p).length ? `<div class="cues">${cuesOf(p).map(esc).join('<i>·</i>')}</div>` : ''}
      ${crossLinks(p)}
      <div class="rp-verdict">${verdict(p)}</div>
      <div class="rp-buy">
        <div class="rp-price-row">
          ${tested ? `<div class="rp-score">${p.diem}<span>/10</span></div>` : `<div class="rp-noscore">Chưa chấm điểm</div>`}
          <div class="rp-price"><b>${money(p.gia)}</b>${per100(p) ? `<span>${money(per100(p))} / 100g · ${p.gram}g</span>` : ''}</div>
        </div>
        ${buyLink(p)}
        <p class="rp-aff-note">Link tiếp thị liên kết — bạn mua đúng giá Shopee niêm yết, không trả thêm đồng nào.</p>
      </div>
    </div>
  </header>

  <article class="rp-article">
    ${intro(p)}
    ${flavorPara(p)}

    <div class="rp-specs">
      ${bar('Độ chua', p.chua)}${bar('Độ đậm', p.dam)}${bar('Hậu vị', p.hau)}
      ${per100(p) ? `<div class="spec"><div class="spec-l">Giá / 100g</div><div class="spec-v">${(per100(p)/1000).toFixed(0)}<span class="of">k</span></div><div class="track"><i style="width:${Math.min(per100(p)/1500*100,100)}%"></i></div></div>` : ''}
    </div>

    ${p.pha && p.pha.length ? `<p class="rp-pha"><b>Hợp cách pha:</b> ${p.pha.map(x => PHA_TEN[x] || x).join(' · ')}.</p>` : ''}

    <div class="rp-who">
      <div><h3>Nên mua nếu</h3><ul>${(p.nen || []).map(x => `<li class="y">${esc(x)}</li>`).join('')}</ul></div>
      <div><h3>Cân nhắc nếu</h3><ul>${(p.khong || []).map(x => `<li class="n">${esc(x)}</li>`).join('')}</ul></div>
    </div>

    <div class="rp-method">
      <p><b>Cách chúng tôi test:</b> mua ẩn danh, không nhận hàng tài trợ; pha cùng cỡ xay medium, tỷ lệ 1:15, nước 92°C; nếm mù (che nhãn) rồi mới chấm điểm. Gói nào chưa nếm thì không có điểm — không ngoại lệ. <a href="/cach-test">Xem quy trình đầy đủ →</a></p>
    </div>

    <div class="rp-cta-foot">
      ${buyLink(p, 'Mua ' + esc(p.brand))}
    </div>
  </article>

  ${related(p)}

  <a class="rp-home" href="/">← Về trang chủ Gu Cà Phê</a>
</main>
<div class="buybar">
  <div class="wrap buybar-in">
    <div class="buybar-info"><b>${esc(p.brand)}</b> · ${money(p.gia)}${per100(p) ? ` <span>· ${money(per100(p))}/100g</span>` : ''}${tested ? ` <span>· ${p.diem}/10</span>` : ''}</div>
    <a class="cta cta-sm" href="${esc(p.link || '#')}" target="_blank" rel="sponsored nofollow noopener" onclick="guTrack('affiliate_click',{item_id:'${p.id}',price:${p.gia},channel:'shopee',position:'review_stickybar',tested:${tested ? 1 : 0}})">Mua trên Shopee →</a>
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
            ${p.tested && p.diem != null ? `<div class="vg-prod-score">${p.diem}<span>/10</span></div>` : `<div class="vg-prod-ut">Chưa nếm</div>`}
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
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(article)}</script>
<script type="application/ld+json">${JSON.stringify(crumb)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
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

  <article class="rp-article vg-article">
    ${(v.than || []).join('\n    ')}
    ${v.vi ? `<p class="vg-vi"><b>Vị đặc trưng:</b> ${esc(v.vi)}</p>` : ''}
    ${(v.diemNhan && v.diemNhan.length) ? `<ul class="vg-highlights">${v.diemNhan.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
  </article>

  ${v.banDo ? `<figure class="vg-map">
    <img src="/${v.banDo}" alt="Bản đồ vùng trồng cà phê Lâm Đồng — Lạc Dương, Cầu Đất, Lâm Hà, Di Linh, Đắk Nông" loading="lazy">
    ${v.banDoCaption ? `<figcaption>${esc(v.banDoCaption)}</figcaption>` : ''}
  </figure>` : ''}

  <section class="vg-prods">
    <h2>Gói từ vùng này</h2>
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
    <h2>Nhà rang trong vùng</h2>
    <div class="rp-rel-grid">
      ${roasters.map(r => {
        const a = roasterAvg(r);
        return `
      <a class="rp-rel" href="/nha-rang/${r.slug}">
        <div class="rp-rel-brand">Nhà rang</div>
        <div class="rp-rel-name">${esc(r.ten)}</div>
        <div class="rp-rel-meta">${a ? `<b>${a.avg}/10</b>` : '<span class="rp-ut">Chưa nếm</span>'}</div>
      </a>`;
      }).join('')}
    </div>
  </section>` : ''}

  ${others.length ? `
  <section class="rp-related">
    <h2>Vùng trồng khác</h2>
    <div class="rp-rel-grid">
      ${others.map(o => `
      <a class="rp-rel" href="/vung-trong/${o.slug}">
        <div class="rp-rel-brand">${o.hub ? 'Tổng quan' : 'Tiểu vùng'}</div>
        <div class="rp-rel-name">Cà phê ${esc(o.ten)}</div>
        <div class="rp-rel-meta">${esc(o.doCao || '')}</div>
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
  const others = ROASTER.filter(x => x.slug !== r.slug).slice(0, 3);

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
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(org)}</script>
<script type="application/ld+json">${JSON.stringify(crumb)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<script>
(function(){
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

  <header class="vg-hero">
    <div class="eyebrow">Nhà rang${vung ? ` · ${esc(vung.ten)}` : ''}</div>
    <h1>${esc(r.ten)}</h1>
    <p class="vg-hero-tag">${esc(r.gioiThieu)}</p>
    <div class="vg-facts">
      <div class="vg-fact"><span>Vùng nguyên liệu</span><b>${vung ? `<a href="/vung-trong/${vung.slug}">${esc(r.vungChinh)}</a>` : esc(r.vungChinh)}</b></div>
      <div class="vg-fact"><span>Điểm trên Gu</span><b>${a ? `${a.avg}/10 · ${a.n} gói đã nếm` : 'Chưa nếm'}</b></div>
      <div class="vg-fact"><span>Website</span><b>${r.web ? `<a href="${esc(r.web)}" target="_blank" rel="nofollow noopener">Trang chính thức ↗</a>` : 'đang cập nhật'}</b></div>
    </div>
  </header>

  <article class="rp-article vg-article">
    <p class="rp-lead">${esc(r.gioiThieu)}</p>
    ${r.lichSu ? `<h2 class="rp-sub">Lịch sử &amp; hồ sơ</h2>${r.lichSu}` : `<p><i>Hồ sơ chi tiết về ${esc(r.ten)} đang được Gu biên soạn.</i></p>`}
  </article>

  <section class="vg-prods">
    <h2>Sản phẩm trên Gu Cà Phê</h2>
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

  ${others.length ? `
  <section class="rp-related">
    <h2>Nhà rang khác</h2>
    <div class="rp-rel-grid">
      ${others.map(o => `
      <a class="rp-rel" href="/nha-rang/${o.slug}">
        <div class="rp-rel-brand">Nhà rang</div>
        <div class="rp-rel-name">${esc(o.ten)}</div>
        <div class="rp-rel-meta">${esc(o.vungChinh)}</div>
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
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Nhà rang</span></nav>
  <header class="hub-head">
    <div class="eyebrow">Nhà rang</div>
    <h1>6 nhà rang chúng tôi chọn đồng hành</h1>
    <p class="lead">Sau khi đi thực địa, gặp người làm và nếm sâu, chúng tôi chọn ra sáu nhà rang xứng đáng để
    đồng hành và giới thiệu với bạn — mỗi nhà một vùng nguyên liệu, một câu chuyện, một thế mạnh. Chỉ sáu, không hơn.</p>
  </header>
  <div class="vg-grid">${list.map(roasterCardHTML).join('')}</div>
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: '6 nhà rang cà phê đặc sản Lâm Đồng chúng tôi chọn đồng hành | Gu Cà Phê',
    desc: 'Sáu nhà rang cà phê đặc sản Lâm Đồng Gu chọn đồng hành sau khi đi thực địa và nếm sâu: Bùi, Dehavi, Tám Trình, Sơn Pacamara, The Married Beans, Là Việt.',
    url, ogType: 'website', schema, active: 'nharang', main
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
  return `<div class="pc" data-tested="${t ? 1 : 0}" data-diem="${p.diem || 0}" data-gia="${p.gia}" data-per100="${per100(p) || 0}">
      <a class="pc-media" href="/review/${p.slug}">${media}${t ? `<span class="pc-badge">${p.diem}</span>` : `<span class="pc-badge pc-badge-ut">Chưa nếm</span>`}</a>
      <div class="pc-body">
        <div class="pc-brand">${esc(p.brand)}</div>
        <a class="pc-name" href="/review/${p.slug}">${esc(p.ten)}</a>
        <div class="pc-meta">${money(p.gia)}${per100(p) ? ` · <span>${money(per100(p))}/100g</span>` : ''}</div>
        <div class="pc-foot">${buyMini(p, pos || 'product_card')}<a class="pc-detail" href="/review/${p.slug}">Chi tiết →</a></div>
      </div>
    </div>`;
}
function hubCaPhe() {
  const url = `${ORIGIN}/ca-phe`;
  const rank = SP.slice().sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0) || (b.diem || 0) - (a.diem || 0));
  const seg = NHUCAU.map(n => {
    const p = SP_BY_ID[n.spId]; if (!p) return '';
    const t = p.tested && p.diem != null;
    return `<div class="seg">
        <div class="seg-label">${esc(n.label)}</div>
        <div class="seg-vi">${esc(n.vi)}</div>
        <a class="seg-pick" href="/review/${p.slug}"><small>${esc(p.brand)}</small>${esc(p.ten)}</a>
        <div class="seg-foot"><span class="seg-price">${money(p.gia)}${t ? ` · ${p.diem}/10` : ' · chưa nếm'}</span>${buyMini(p, 'ca_phe_segment')}</div>
      </div>`;
  }).join('');
  const schema = itemListSchema('Cà phê đặc sản Lâm Đồng',
    SP.map(p => ({ url: `${ORIGIN}/review/${p.slug}`, name: `${p.brand} ${p.ten}` })));
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Cà phê</span></nav>
  <header class="hub-head">
    <div class="eyebrow">Cà phê</div>
    <h1>Cà phê đặc sản Lâm Đồng</h1>
    <p class="lead">Đã nếm mù thì có điểm; chưa nếm ghi rõ. Xem nhanh, so giá/100g, bấm mua — muốn kỹ thì mở chi tiết.</p>
  </header>

  ${NHUCAU.length ? `<section class="seg-wrap">
    <h2 class="hub-group-t">Mua cho ai?</h2>
    <div class="seg-grid">${seg}</div>
  </section>` : ''}

  <section class="cmp-sec">
    <div class="cmp-bar">
      <h2 class="hub-group-t">${SP.length} gói</h2>
      <div class="cmp-sortbar">
        <span>Sắp theo:</span>
        <button class="on" onclick="cpSort('diem',this)">Điểm cao</button>
        <button onclick="cpSort('gia',this)">Giá thấp</button>
        <button onclick="cpSort('per100',this)">Giá/100g</button>
      </div>
    </div>
    <div class="pc-grid">${rank.map(p => pcard(p, 'ca_phe_card')).join('')}</div>
  </section>

  <p class="foot-note">Chưa rõ Arabica khác Robusta chỗ nào, Natural khác Washed ra sao, hay pha phin nên chọn rang gì?
  <a href="/kien-thuc">Đọc Kiến thức trước khi mua →</a></p>
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
    url, ogType: 'website', schema, active: 'caphe', main
  });
}

function hubVung() {
  const url = `${ORIGIN}/vung-trong`;
  const hub = VUNG.find(v => v.hub);
  const subs = VUNG.filter(v => !v.hub);
  const schema = itemListSchema('Vùng trồng cà phê Lâm Đồng',
    VUNG.map(v => ({ url: `${ORIGIN}/vung-trong/${v.slug}`, name: `Cà phê ${v.ten}` })));
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Vùng trồng</span></nav>
  <header class="hub-head">
    <div class="eyebrow">Vùng trồng</div>
    <h1>Vùng nguyên liệu cà phê Lâm Đồng</h1>
    <p class="lead">Gần như toàn bộ Arabica đặc sản Việt Nam đến từ cao nguyên này. Mỗi tiểu vùng cho một chất vị riêng —
    hiểu vùng trồng để chọn đúng gu, không chọn theo bao bì.</p>
  </header>
  ${hub ? `<section class="hub-group"><div class="vg-grid">${regionCardHTML(hub)}</div></section>` : ''}
  <section class="hub-group">
    <h2 class="hub-group-t">Tiểu vùng</h2>
    <div class="vg-grid">${subs.map(regionCardHTML).join('')}</div>
  </section>
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Vùng trồng cà phê Lâm Đồng — Cầu Đất, Nam Ban, Lạc Dương, Đà Lạt | Gu Cà Phê',
    desc: 'Các vùng nguyên liệu cà phê đặc sản Lâm Đồng: Cầu Đất, Nam Ban, Lạc Dương, Đà Lạt — độ cao, giống, hương vị đặc trưng và gói đáng mua từng vùng.',
    url, ogType: 'website', schema, active: 'vung', main
  });
}

function hubKienThuc() {
  const url = `${ORIGIN}/kien-thuc`;
  const main = `<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb"><a href="/">Gu Cà Phê</a><i>/</i><span>Kiến thức</span></nav>
  <header class="hub-head">
    <div class="eyebrow">Kiến thức</div>
    <h1>Hiểu trước khi mua</h1>
    <p class="lead">Chọn sai không phải vì hạt dở, mà vì không biết mình đang mua gì. Vài bài ngắn để bạn đọc bao bì như dân trong nghề.</p>
  </header>
  ${BAIVIET.map(b => `<article class="kt-art" id="${b.id}">
    <div class="kt-art-tag">${esc(b.tag)}</div>
    <h2>${b.tieuDe}</h2>
    <p class="kt-art-dek">${b.dek}</p>
    <div class="kt-art-body">${b.than}</div>
  </article>`).join('')}
  ${TU_DIEN.length ? `<section class="kt-tudien">
    <h2>Từ điển cà phê nhanh</h2>
    <dl>${TU_DIEN.map(t => `<div class="kt-def"><dt>${esc(t.t)}</dt><dd>${esc(t.d)}</dd></div>`).join('')}</dl>
  </section>` : ''}
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Kiến thức cà phê đặc sản — Natural/Washed, độ rang, giá trị specialty | Gu Cà Phê',
    desc: 'Kiến thức chọn cà phê đặc sản: Natural khác Washed, rang sáng hay rang đậm theo cách pha, vì sao specialty đắt, và từ điển thuật ngữ cà phê.',
    url, ogType: 'website', active: 'kienthuc', main
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
  <header class="hub-head">
    <div class="eyebrow">Minh bạch</div>
    <h1>Cách chúng tôi test</h1>
    <p class="lead">Công bố trước khi mở gói hàng — khoá lại, không sửa. Thẩm quyền đến từ phương pháp, không từ lời khen.</p>
  </header>
  <ol class="steps">${QUY_TRINH.map(x => `<li><span>${x}</span></li>`).join('')}</ol>
  <div class="gallery">
    <figure><img src="/assets/img/p1-farm.jpg" alt="Quả cà phê chín trên cành" loading="lazy"><figcaption>Vùng trồng — quả chín</figcaption></figure>
    <figure><img src="/assets/img/p2-grind.jpg" alt="Cà phê vừa xay" loading="lazy"><figcaption>Cùng cỡ xay</figcaption></figure>
    <figure><img src="/assets/img/p3-cup.jpg" alt="Dàn mẫu nếm mù" loading="lazy"><figcaption>Che nhãn</figcaption></figure>
    <figure><img src="/assets/img/p4-taste.jpg" alt="Chấm điểm bằng thìa cupping" loading="lazy"><figcaption>Chấm điểm</figcaption></figure>
  </div>
  <div class="method-notes">
    <p><b>Vì sao điểm số đáng tin:</b> nó là hệ quả của một quy trình ai cũng kiểm chứng lại được —
    cùng cỡ xay, cùng tỷ lệ, cùng nhiệt độ, nếm mù. Thẩm quyền đến từ phương pháp, không từ lời khen.</p>
    <p><b>Về hoa hồng:</b> chúng tôi nhận hoa hồng tiếp thị liên kết nếu bạn mua qua link trên trang —
    bạn không trả thêm đồng nào. Link có ở cả sản phẩm chúng tôi khuyên cân nhắc,
    nên không có lý do gì để khen sai. Gói nào chưa nếm, trang ghi rõ <b>“Chưa nếm”</b>.</p>
  </div>
  ${FAQ.length ? `<div class="faq">${FAQ.map((f, i) => `<details class="faq-i"${i === 0 ? ' open' : ''}><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>` : ''}
  <a class="rp-home" href="/">← Về trang chủ</a>
  </main>`;
  return pageShell({
    title: 'Cách chúng tôi test cà phê — mua ẩn danh, nếm mù, chấm điểm | Gu Cà Phê',
    desc: 'Quy trình đánh giá cà phê của Gu Cà Phê: mua ẩn danh, pha cùng điều kiện (cỡ xay medium, 1:15, 92°C), nếm mù rồi mới chấm. Minh bạch chính sách hoa hồng.',
    url, ogType: 'website', schema: faqSchema, active: 'method', main
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
  ['kien-thuc', hubKienThuc], ['cach-test', hubCachTest]
];
const hubUrls = [];
for (const [slug, fn] of HUBS) {
  writeFileSync(join(ROOT, `${slug}.html`), fn(), 'utf8');
  hubUrls.push(`${ORIGIN}/${slug}`);
  console.log(`✓ ${slug}.html`);
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
${roasterUrls.map(u => entry(u, '0.7')).join('\n')}
${regionUrls.map(u => entry(u, '0.7')).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
const total = hubUrls.length + urls.length + roasterUrls.length + regionUrls.length + 1;
console.log(`✓ sitemap.xml (${total} URL)`);
console.log(`\nXong. ${hubUrls.length} hub · ${urls.length} review · ${roasterUrls.length} nhà rang · ${regionUrls.length} vùng trồng.`);
