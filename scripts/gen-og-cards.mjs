/* ============================================================
   gen-og-cards.mjs — Tạo ảnh Open Graph 1200×630 có thương hiệu
   cho từng sản phẩm / bài viết / nhà rang (để share lên MXH & AI
   preview hiện đúng ảnh + tên, thay vì ảnh mặc định chung).

   CHẠY THỦ CÔNG khi nội dung đổi (thêm sản phẩm/bài/nhà rang):
     npm install --no-save sharp   # nếu chưa có
     node scripts/gen-og-cards.mjs
   Kết quả ghi vào assets/img/og/cards/<slug>.jpg (commit các file này).
   Build chính (build-reviews.mjs) KHÔNG phụ thuộc sharp — nó chỉ trỏ
   og:image tới card nếu file tồn tại, không thì rơi về ảnh mặc định.
   ============================================================ */
import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTDIR = join(ROOT, 'assets/img/og/cards');
mkdirSync(OUTDIR, { recursive: true });

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Đọc dữ liệu từ data.js (chỉ lấy SP, BAIVIET, ROASTER) */
const raw = readFileSync(join(ROOT, 'data/data.js'), 'utf8');
const names = ['SP', 'BAIVIET', 'ROASTER'];
const re = new RegExp('\\bconst\\s+(' + names.join('|') + ')\\b', 'g');
const { SP = [], BAIVIET = [], ROASTER = [] } = (new Function('ctx', raw.replace(re, 'ctx.$1') + '\nreturn ctx;'))({});
const SP_BY_ID = {}; SP.forEach(p => { SP_BY_ID[p.id] = p; });

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function makeCard({ title, kicker, sub, imgPath, out }) {
  const W = 1200, H = 630, IMGW = 470, PAD = 68, TW = W - IMGW - PAD * 2 + 10;
  const t = String(title);
  const fs = t.length > 46 ? 39 : t.length > 32 ? 45 : 53;
  const maxch = Math.max(10, Math.floor(TW / (fs * 0.52)));
  const lines = wrap(t, maxch).slice(0, 3);
  const lh = fs * 1.12, titleTop = 248;
  const titleSvg = lines.map((l, i) =>
    `<text x="${PAD}" y="${titleTop + i * lh}" font-family="DejaVu Sans" font-size="${fs}" font-weight="700" fill="#2B2320">${esc(l)}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#FBF7F0"/>
    <rect x="${W - IMGW}" y="0" width="${IMGW}" height="${H}" fill="#EDE4D6"/>
    <rect x="0" y="0" width="10" height="${H}" fill="#A15C2A"/>
    <text x="${PAD}" y="118" font-family="DejaVu Sans Mono" font-size="25" font-weight="700" letter-spacing="6" fill="#A15C2A">GU CÀ PHÊ</text>
    <text x="${PAD}" y="162" font-family="DejaVu Sans" font-size="20" fill="#7A6A5C">${esc((kicker || '').slice(0, 58))}</text>
    ${titleSvg}
    <text x="${PAD}" y="${titleTop + lines.length * lh + 34}" font-family="DejaVu Sans" font-size="26" font-weight="700" fill="#A15C2A">${esc(sub || '')}</text>
    <line x1="${PAD}" y1="540" x2="${W - IMGW - PAD}" y2="540" stroke="#E3D8C6" stroke-width="2"/>
    <text x="${PAD}" y="580" font-family="DejaVu Sans Mono" font-size="19" letter-spacing="2" fill="#7A6A5C">Mua thật · Nếm mù · Chấm điểm</text>
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const comp = [];
  const ip = imgPath ? join(ROOT, String(imgPath).replace(/^\//, '')) : '';
  if (ip && existsSync(ip)) {
    const img = await sharp(ip).resize({ width: IMGW, height: H, fit: 'cover', position: 'centre' }).toBuffer();
    comp.push({ input: img, left: W - IMGW, top: 0 });
  }
  await sharp(base).composite(comp).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUTDIR, out));
  return out;
}

let n = 0;
/* Sản phẩm */
for (const p of SP) {
  if (!p.slug) continue;
  const sub = (p.tested && p.diem != null) ? `${p.brand} · ${p.diem}/10`
    : `${p.brand} · ${p.daUong ? 'Đã uống' : 'Chưa nếm'}`;
  const kicker = [p.giong, p.xaHuyen].filter(Boolean).join(' · ') || 'Cà phê đặc sản';
  await makeCard({ title: p.ten, kicker, sub, imgPath: p.anh, out: `${p.slug}.jpg` });
  n++;
}
/* Bài viết */
for (const b of BAIVIET) {
  if (!b.id) continue;
  const kicker = [b.tag, b.docPhut ? `Đọc ${b.docPhut} phút` : ''].filter(Boolean).join(' · ');
  await makeCard({ title: b.tieuDe, kicker, sub: b.mucDo || 'Kiến thức', imgPath: b.anh, out: `${b.id}.jpg` });
  n++;
}
/* Nhà rang */
for (const r of ROASTER) {
  if (!r.slug) continue;
  const prod = (r.sanPham || []).map(id => SP_BY_ID[id]).filter(Boolean)[0];
  await makeCard({
    title: r.ten, kicker: `Nhà rang · ${r.vungChinh || 'Lâm Đồng'}`,
    sub: r.theManh || 'Cà phê đặc sản', imgPath: prod && prod.anh, out: `${r.slug}.jpg`
  });
  n++;
}
console.log(`✓ Đã tạo ${n} ảnh OG card trong assets/img/og/cards/`);
