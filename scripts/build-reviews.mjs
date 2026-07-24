/* ============================================================
   build-reviews.mjs — SINH TRANG REVIEW CHI TIẾT CHO TỪNG GÓI
   ============================================================
   Đọc data/data.js → tạo /review/<slug>.html cho mỗi sản phẩm,
   rồi cập nhật sitemap.xml. Nội dung được "nướng" tĩnh vào HTML
   (không phụ thuộc JS) — để Google VÀ trình thu thập AI
   (ChatGPT, Perplexity) đọc được ngay, không cần render.

   NGUYÊN TẮC: KHÔNG BỊA. Gói chưa nếm → không có điểm, không có
   schema đánh giá. Chỉ dùng đúng dữ liệu trong data.js.

   Chạy tay:  node scripts/build-reviews.mjs
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://gucaphe.vn';
const CSS_V = '20260730';

/* ---- Đọc data.js trong sandbox nhỏ (chỉ để LẤY dữ liệu) ---- */
function loadData(src) {
  const names = ['SITE', 'QUY_TRINH', 'SP', 'CAP_SS', 'TU_DIEN', 'FAQ', 'BAIVIET'];
  const re = new RegExp('\\bconst\\s+(' + names.join('|') + ')\\b', 'g');
  const fn = new Function('ctx', src.replace(re, 'ctx.$1') + '\nreturn ctx;');
  return fn({});
}
const raw = readFileSync(join(ROOT, 'data/data.js'), 'utf8');
const { SITE, SP } = loadData(raw);

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

const cuesOf = p => [p.origin, p.giong, p.process, p.roast ? 'Rang ' + p.roast.toLowerCase() : null]
  .filter(Boolean);

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
      { '@type': 'ListItem', position: 2, name: 'Review', item: `${ORIGIN}/#reviews` },
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
${schema(p)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
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

<nav>
  <div class="wrap nav-in">
    <a id="logo" href="/">GU CÀ PHÊ</a>
    <ul class="nav-links">
      <li><a href="/#pick">Lựa chọn tháng này</a></li>
      <li><a href="/#matrix">Bảng tuyển chọn</a></li>
      <li><a href="/#reviews">Sổ nếm</a></li>
      <li><a href="/#method" class="learn">Cách test</a></li>
    </ul>
  </div>
</nav>

<main class="rp wrap">
  <nav class="rp-crumb" aria-label="Breadcrumb">
    <a href="/">Gu Cà Phê</a><i>/</i><a href="/#reviews">Review</a><i>/</i><span>${esc(p.brand)} ${esc(p.ten)}</span>
  </nav>

  <header class="rp-hero">
    ${media(p)}
    <div class="rp-hero-body">
      <div class="eyebrow">Review · ${tested ? 'Đã nếm mù' : 'Chưa nếm'}</div>
      <div class="rp-brand">${esc(p.brand)}</div>
      <h1>${esc(p.ten)}</h1>
      ${cuesOf(p).length ? `<div class="cues">${cuesOf(p).map(esc).join('<i>·</i>')}</div>` : ''}
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
      <p><b>Cách chúng tôi test:</b> mua ẩn danh, không nhận hàng tài trợ; pha cùng cỡ xay medium, tỷ lệ 1:15, nước 92°C; nếm mù (che nhãn) rồi mới chấm điểm. Gói nào chưa nếm thì không có điểm — không ngoại lệ. <a href="/#method">Xem quy trình đầy đủ →</a></p>
    </div>

    <div class="rp-cta-foot">
      ${buyLink(p, 'Mua ' + esc(p.brand))}
    </div>
  </article>

  ${related(p)}

  <a class="rp-home" href="/">← Về trang chủ Gu Cà Phê</a>
</main>

<footer>
  <div class="wrap">
    <div id="tagline">${esc(SITE.tagline)}</div>
    <div>
      <a href="/#pick">Lựa chọn tháng này</a>
      <a href="/#matrix">Bảng tuyển chọn</a>
      <a href="/#method">Cách chúng tôi test</a>
      <a href="/#method">Chính sách hoa hồng</a>
    </div>
    <p class="foot-legal">Chúng tôi mua mọi sản phẩm bằng tiền của mình và nếm mù.
    Link trên trang là link tiếp thị liên kết — bạn không trả thêm đồng nào,
    và link có ở cả sản phẩm chúng tôi khuyên cân nhắc. Gói nào chưa nếm, trang ghi rõ.</p>
  </div>
</footer>

</body>
</html>
`;
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

/* ---- Cập nhật sitemap.xml (trang chủ + mọi trang review) ---- */
function isoDate(dmy) {
  const m = String(dmy || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '2026-07-13';
}
const lastmod = isoDate(SITE.capNhat);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`✓ sitemap.xml (${urls.length + 1} URL)`);
console.log(`\nXong. ${urls.length} trang review.`);
