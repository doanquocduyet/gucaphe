/* ============================================================
   update-coffee-prices.mjs — GIÁ CÀ PHÊ THẾ GIỚI CHO TRANG /gia-ca-phe
   ============================================================
   Chạy bởi GitHub Action (.github/workflows/update-prices.yml), 08:00 mỗi sáng.
   Chạy tay: node scripts/update-coffee-prices.mjs

   Nguồn:
     - Arabica New York (ICE, hợp đồng gần nhất, cent/lb), theo NGÀY, đủ
       mở cửa / cao / thấp / đóng cửa / khối lượng: Yahoo Finance, mã KC=F.
     - Robusta thế giới (cent/lb, trung bình THÁNG): IMF Primary Commodity
       Prices, qua FRED (mã PCOFFROBUSDM). Quy đổi sang USD/tấn để dễ đọc.

   NGUYÊN TẮC: KHÔNG BAO GIỜ BỊA GIÁ.
     - Tải được và hợp lệ  -> ghi đè chuỗi đó.
     - Tải lỗi             -> GIỮ NGUYÊN chuỗi cũ, báo lỗi ra log.
   Giá nhân xô trong nước (`noiDia`) KHÔNG do script này ghi — nó được thêm
   tay mỗi tuần từ bản tin giá đã kiểm (xem Routine tin tức hằng tuần).
   ============================================================ */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';

const OUT = new URL('../data/gia-ca-phe.json', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const START = '2020-01-01';
const LB_PER_TON = 2204.62262; // 1 tấn = 2.204,62 pound

const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const data = {
  capNhat: old.capNhat || null,
  arabica: old.arabica || [],
  robusta: old.robusta || [],
  noiDia: old.noiDia || []
};
const loi = [];

/* ---- Arabica theo ngày: Yahoo Finance KC=F ---- */
async function layArabica() {
  const p1 = Math.floor(Date.parse(START + 'T00:00:00Z') / 1000);
  const p2 = Math.floor(Date.now() / 1000) + 86400;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/KC=F?period1=${p1}&period2=${p2}&interval=1d`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Yahoo HTTP ${r.status}`);
  const j = await r.json();
  const res = j && j.chart && j.chart.result && j.chart.result[0];
  if (!res || !res.timestamp) throw new Error('Yahoo trả dữ liệu rỗng');
  const q = res.indicators.quote[0];
  // Yahoo đặt mốc mỗi phiên lúc 00:00 giờ New York (≈04:00–05:00 UTC), nên lấy ngày
  // theo UTC là đúng ngày giao dịch. Đã đối chiếu: phiên 28/10/2026 đóng cửa 286,75 cent/lb,
  // khớp Báo Văn hóa ngày 30/10/2026. ĐỪNG cộng gmtoffset (sẽ lùi một ngày).
  const rows = [];
  const r2 = n => Math.round(n * 100) / 100;
  res.timestamp.forEach((t, i) => {
    const o = q.open[i], h = q.high[i], l = q.low[i], c = q.close[i];
    if ([o, h, l, c].some(v => v == null || !isFinite(v) || v <= 0)) return; // bỏ phiên thiếu số
    const d = new Date(t * 1000).toISOString().slice(0, 10);
    rows.push([d, r2(o), r2(h), r2(l), r2(c), q.volume[i] || 0]);
  });
  // Mỗi ngày một phiên (nếu trùng ngày, giữ bản sau cùng)
  const byDay = new Map(rows.map(x => [x[0], x]));
  const out = [...byDay.values()].sort((a, b) => a[0].localeCompare(b[0]));
  if (out.length < 1000) throw new Error(`Yahoo chỉ trả ${out.length} phiên — nghi dữ liệu thiếu, không ghi`);
  return out;
}

/* ---- Robusta theo tháng: IMF qua FRED ---- */
async function layRobusta() {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=PCOFFROBUSDM&cosd=${START}`;
  // FRED trả 503 cho User-Agent giả trình duyệt; tự giới thiệu đúng tên thì được.
  const r = await fetch(url, { headers: { 'User-Agent': 'gucaphe.vn price updater (+https://gucaphe.vn)', Accept: 'text/csv' } });
  if (!r.ok) throw new Error(`FRED HTTP ${r.status}`);
  const txt = await r.text();
  const out = [];
  for (const line of txt.trim().split(/\r?\n/).slice(1)) {
    const [d, v] = line.split(',');
    const cents = Number(v);
    if (!/^\d{4}-\d{2}-01$/.test(d) || !isFinite(cents) || cents <= 0) continue; // FRED ghi "." khi thiếu
    out.push([d.slice(0, 7), Math.round(cents / 100 * LB_PER_TON)]);
  }
  if (out.length < 60) throw new Error(`FRED chỉ trả ${out.length} tháng — nghi dữ liệu thiếu, không ghi`);
  return out;
}

for (const [ten, fn, key] of [['Arabica (Yahoo KC=F)', layArabica, 'arabica'], ['Robusta (IMF/FRED)', layRobusta, 'robusta']]) {
  try {
    data[key] = await fn();
    const last = data[key][data[key].length - 1];
    console.log(`✓ ${ten}: ${data[key].length} điểm, mới nhất ${last[0]}`);
  } catch (e) {
    loi.push(`${ten}: ${e.message}`);
    console.warn(`⚠️  ${ten}: ${e.message} — giữ nguyên dữ liệu cũ`);
  }
}

const before = JSON.stringify({ a: old.arabica, r: old.robusta });
const after = JSON.stringify({ a: data.arabica, r: data.robusta });
const changed = before !== after;
if (changed) data.capNhat = new Date().toISOString();
writeFileSync(OUT, JSON.stringify(data) + '\n', 'utf8');
console.log(changed ? 'Đã ghi data/gia-ca-phe.json' : 'Giá không đổi.');

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed ? 1 : 0}\nfailed=${loi.length}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY && loi.length) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Giá cà phê thế giới — lỗi\n${loi.map(x => `- ${x}`).join('\n')}\n`);
}
