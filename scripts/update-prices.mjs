/* ============================================================
   update-prices.mjs — CẬP NHẬT GIÁ TỰ ĐỘNG TỪ SHOPEE
   ============================================================
   Chạy bởi GitHub Action (.github/workflows/update-prices.yml).
   KHÔNG chạy được trong môi trường Claude (Shopee chặn egress) —
   chỉ sống trên runner GitHub.

   NGUYÊN TẮC (điều 31 của dự án): KHÔNG BAO GIỜ BỊA GIÁ.
     - Lấy được giá thật  -> cập nhật trường `gia`.
     - Không lấy được    -> GIỮ NGUYÊN giá cũ, ghi vào báo cáo.
   Chỉ sửa trường `gia` và `SITE.capNhat`. Không đụng gì khác.
   ============================================================ */

import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';

const DATA_PATH = new URL('../data/data.js', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/* ---- 1. Đọc data.js để lấy danh sách SP (id + link) ---- */
const raw = readFileSync(DATA_PATH, 'utf8');

// eval an toàn trong sandbox nhỏ chỉ để ĐỌC mảng SP.
function loadSP(src) {
  const sandbox = { SITE: null, QUY_TRINH: null, SP: null, CAP_SS: null };
  const fn = new Function(
    'ctx',
    src.replace(/\bconst\s+(SITE|QUY_TRINH|SP|CAP_SS)\b/g, 'ctx.$1') +
      '\nreturn ctx;'
  );
  return fn(sandbox).SP || [];
}
const SP = loadSP(raw);

/* ---- 2. Parse shopId + itemId từ link Shopee ---- */
// Hỗ trợ: .../ten-san-pham-i.SHOP.ITEM   và   .../product/SHOP/ITEM
function parseIds(url) {
  let m = url.match(/-i\.(\d+)\.(\d+)/);
  if (m) return { shopId: m[1], itemId: m[2] };
  m = url.match(/product\/(\d+)\/(\d+)/);
  if (m) return { shopId: m[1], itemId: m[2] };
  return null;
}

// Link rút gọn (s.shopee.vn/...) -> theo redirect để lấy URL cuối.
async function resolveUrl(url) {
  if (!/^https?:\/\/s\.shopee\.vn/i.test(url)) return url;
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA } });
    return r.url || url;
  } catch {
    return url;
  }
}

/* ---- 3. Gọi API giá của Shopee (best-effort, chịu anti-bot) ---- */
async function fetchPrice(shopId, itemId, referer) {
  const api = `https://shopee.vn/api/v4/pdp/get_pc?shop_id=${shopId}&item_id=${itemId}`;
  const headers = {
    'User-Agent': UA,
    'Referer': referer || 'https://shopee.vn/',
    'x-api-source': 'pc',
    'x-shopee-language': 'vi',
    'af-ac-enc-dat': '',
    'Accept': 'application/json',
  };
  // 3 lần thử, backoff nhẹ.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(api, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const item = json?.data?.item;
      if (!item) throw new Error('no item in response (anti-bot?)');
      // Shopee lưu giá * 100000. Ưu tiên price_min (biến thể rẻ nhất).
      const rawPrice = item.price_min ?? item.price ?? null;
      if (rawPrice == null) throw new Error('no price field');
      return Math.round(rawPrice / 100000);
    } catch (e) {
      if (attempt === 3) return { error: String(e.message || e) };
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

/* ---- 4. Ghi lại giá mới vào data.js (giữ nguyên format) ---- */
function setGia(src, id, newGia) {
  // Trong block của product có id này, thay số ở dòng `gia:` đầu tiên.
  const re = new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?gia:\\s*)\\d+`);
  return src.replace(re, `$1${newGia}`);
}

function today() {
  // Ngày theo giờ VN (workflow set TZ=Asia/Ho_Chi_Minh).
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/* ---- 5. Chạy ---- */
const report = { updated: [], unchanged: [], skipped: [], failed: [] };
let out = raw;

for (const p of SP) {
  const link = (p.link || '').trim();
  if (!link || link === '#') {
    report.skipped.push({ id: p.id, ten: p.ten, ly_do: 'chưa có link Shopee' });
    continue;
  }
  const finalUrl = await resolveUrl(link);
  const ids = parseIds(finalUrl);
  if (!ids) {
    report.skipped.push({ id: p.id, ten: p.ten, ly_do: 'link không phải dạng Shopee hợp lệ' });
    continue;
  }
  const result = await fetchPrice(ids.shopId, ids.itemId, finalUrl);
  if (typeof result === 'object' && result?.error) {
    report.failed.push({ id: p.id, ten: p.ten, ly_do: result.error, gia_cu: p.gia });
    continue;
  }
  const newGia = result;
  if (newGia === p.gia) {
    report.unchanged.push({ id: p.id, ten: p.ten, gia: p.gia });
  } else {
    out = setGia(out, p.id, newGia);
    report.updated.push({ id: p.id, ten: p.ten, gia_cu: p.gia, gia_moi: newGia });
  }
  // Nghỉ ngắn giữa các request cho lịch sự.
  await new Promise((r) => setTimeout(r, 800));
}

// Nếu có bất kỳ thay đổi giá -> cập nhật SITE.capNhat.
if (report.updated.length > 0) {
  out = out.replace(/(capNhat:\s*["']).*?(["'])/, `$1${today()}$2`);
  writeFileSync(DATA_PATH, out, 'utf8');
}

/* ---- 6. In báo cáo (hiện trong tab Summary của Action) ---- */
function section(title, rows, fmt) {
  if (!rows.length) return '';
  return `\n### ${title} (${rows.length})\n` + rows.map(fmt).join('\n') + '\n';
}
const md =
  `# Báo cáo cập nhật giá — ${today()}\n` +
  section('✅ Đã đổi giá', report.updated, (r) => `- **${r.ten}**: ${r.gia_cu.toLocaleString('vi')}đ → ${r.gia_moi.toLocaleString('vi')}đ`) +
  section('➖ Giá không đổi', report.unchanged, (r) => `- ${r.ten}: ${r.gia.toLocaleString('vi')}đ`) +
  section('⚠️ Không lấy được giá (giữ giá cũ — bạn có thể chụp màn hình gửi lại)', report.failed, (r) => `- **${r.ten}** — lý do: \`${r.ly_do}\``) +
  section('⏭️ Bỏ qua', report.skipped, (r) => `- ${r.ten} — ${r.ly_do}`);

console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

// Xuất số lượng thay đổi để workflow quyết định có commit không.
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${report.updated.length}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `failed=${report.failed.length}\n`);
}
