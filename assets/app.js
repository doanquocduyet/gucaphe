/* ============================================================
   APP.JS — ENGINE
   Đọc data.js → tự sinh ra mọi trang.
   Khớp đúng schema data.js: nhom · gram · gia · tested · diem
   ============================================================ */

const $ = s => document.querySelector(s);
const money   = n => n.toLocaleString('vi-VN') + '₫';
const per100  = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const get     = id => SP.find(x => x.id === id);
const PHA_TEN  = { phin:'Phin', v60:'V60 / Pour over', coldbrew:'Cold brew' };
const NHOM_TEN = { hat:'Cà phê hạt', gear:'Dụng cụ', qua:'Quà tặng' };

/* ---- Ảnh sản phẩm: dùng p.anh nếu có, không thì tự sinh ô theo độ rang ---- */
const ROAST_BG = {
  'Light':        ['#E7CE93','#D3AC63'],
  'Light-medium': ['#DEB983','#C4965A'],
  'Medium':       ['#C69566','#9C6B41'],
  'Medium-dark':  ['#8A5E3C','#5E3C26'],
  'Dark':         ['#6A462E','#382315']
};
const beanSvg = fill => `<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
  <ellipse cx="12" cy="12" rx="7" ry="9.4" transform="rotate(26 12 12)" fill="${fill}"/>
  <path d="M12 3.4C9.4 7.6 14.6 16.4 12 20.6" stroke="rgba(40,25,15,.30)" stroke-width="1.3" fill="none"/>
</svg>`;
function thumb(p, cls = '') {
  if (p.anh) return `<div class="thumb ${cls}"><img src="${p.anh}" alt="${p.brand} — ${p.ten}" loading="lazy"></div>`;
  const [c1, c2] = ROAST_BG[p.roast] || ['#C69566', '#9C6B41'];
  return `<div class="thumb thumb-gen ${cls}" style="background:linear-gradient(145deg,${c1},${c2})" aria-label="Ảnh minh hoạ ${p.ten}">
    <div class="thumb-ic">${beanSvg('rgba(255,255,255,.92)')}${beanSvg('rgba(255,255,255,.66)')}</div>
    ${p.roast ? `<div class="thumb-l">${p.roast}</div>` : ''}
  </div>`;
}

/* ---- Affiliate click (đếm ngầm cho analytics, không phô ra UI) ---- */
let CLICK = 0;
function aff(id) {
  CLICK++;
  // THẬT: gtag('event','affiliate_click',{item:id});
  const p = get(id);
  if (p && p.link && p.link !== '#') window.open(p.link, '_blank', 'noopener');
}

/* ---- Nhãn minh bạch — KHÔNG BAO GIỜ ghi sai ---- */
const nhan = p => p.tested
  ? '<span class="tag-t">🟢 Đã nếm thật</span>'
  : '<span class="tag-u">🟡 Chưa nếm — theo mô tả nhà bán</span>';

/* ---- Badge tự động — tính từ dữ liệu, không gắn tay ---- */
const BEST_ID  = (SP.filter(p => p.tested && p.diem != null).sort((a,b) => b.diem - a.diem)[0] || {}).id;
const CHEAP_ID = (SP.filter(p => per100(p)).sort((a,b) => per100(a) - per100(b))[0] || {}).id;
const badges = p => [
  p.id === BEST_ID  ? '<span class="bdg bdg-best">★ Điểm cao nhất</span>' : '',
  p.id === CHEAP_ID ? '<span class="bdg bdg-cheap">Rẻ nhất /100g</span>' : ''
].join('');

/* ---- Tasting notes dạng chip (chỉ cho loại ĐÃ nếm) ---- */
const noteChips = p => (p.tested && p.notes && p.notes.length)
  ? `<div class="notes">${p.notes.map(n => `<span class="note-chip">${n}</span>`).join('')}</div>` : '';
/* Đã nếm → chip; chưa nếm → giữ nguyên câu "theo mô tả nhà bán" */
const flavorLine = p => noteChips(p) || `<div class="flavor-txt">${p.flavor}</div>`;

/* ---- Hồ sơ vùng trồng ---- */
const prov = p => {
  const bits = [p.origin, p.giong, p.process].filter(Boolean);
  return bits.length ? `<div class="prov">${bits.join(' · ')}</div>` : '';
};

/* ---- Chip độ tươi (chỉ hiện khi có ngày rang) ---- */
const freshChip = p => p.ngayRang
  ? `<span class="tag-fresh">🗓 Rang ${p.ngayRang}</span>` : '';

/* ---- Thanh số đo (số đo > tính từ) ---- */
const bar = (label, v) => v == null ? '' : `
  <div class="spec">
    <div class="spec-l">${label}</div>
    <div class="spec-v">${v}<span class="of">/5</span></div>
    <div class="track"><i style="width:${v / 5 * 100}%"></i></div>
  </div>`;

/* ---- Dải 3 cam kết (dùng lại ở hero) ---- */
const TRUST = `
  <div class="trust">
    <div class="tp"><b>Mua bằng tiền của mình</b><span>Không nhận hàng tài trợ</span></div>
    <div class="tp"><b>Nếm mù rồi mới chấm</b><span>Che nhãn trước khi chấm điểm</span></div>
    <div class="tp"><b>Công khai quy trình</b><span>Khoá lại trước khi mở gói</span></div>
  </div>`;

/* ============ 1 · GỢI Ý MUA (quy tắc 1 lựa chọn) ============ */
function renderTop() {
  const hat = SP.filter(p => p.nhom === 'hat' && p.tested).sort((a, b) => b.diem - a.diem);
  const daTest = SP.filter(p => p.tested).length;

  if (!hat.length) {
    $('#top').innerHTML = `
      <div class="eyebrow">Cà phê đặc sản Việt Nam</div>
      <h1>Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.</h1>
      <p class="lead">Các sản phẩm dưới đây đang chờ được nếm. Điểm số chỉ xuất hiện sau khi
      chúng tôi thật sự mua và nếm mù.</p>
      ${TRUST}`;
    return;
  }

  const best  = hat[0];
  let   cheap = [...hat].sort((a, b) => per100(a) - per100(b))[0];
  if (cheap.id === best.id && hat[1]) cheap = hat[1];
  const up = SP.filter(p => p.nhom === 'hat' && p.id !== best.id && p.id !== cheap.id)
               .sort((a, b) => b.gia - a.gia)[0];

  $('#top').innerHTML = `
    <div class="hero-top">
      <div class="hero-copy">
        <div class="eyebrow">Gợi ý mua · Cà phê đặc sản Việt Nam</div>
        <h1>Nếu chỉ mua 1 loại, nên mua loại nào?</h1>
        <div class="chips">
          <span class="fresh"><i class="dot"></i>Cập nhật ${SITE.capNhat}</span>
          <span class="fresh">${daTest} sản phẩm đã nếm thật</span>
        </div>
      </div>
      <div class="hero-media"><img src="assets/img/hero.jpg" alt="Pha V60 cà phê đặc sản Việt Nam"></div>
    </div>

    <div class="pick">
      <div class="pick-flag">
        <span>★ Lựa chọn của chúng tôi</span>
        <span class="mono dim">Điểm cao nhất khi nếm mù</span>
      </div>
      <div class="pick-grid">
        <div class="sc"><div class="sc-n">${best.diem}</div><div class="sc-l">Điểm nếm mù</div></div>
        <div class="vd">
          <div class="vd-top">
            ${thumb(best, 'thumb-vd')}
            <div>
              <div class="vd-h">${best.brand} — ${best.ten}</div>
              ${flavorLine(best)}
              ${prov(best)}
            </div>
          </div>
          <div class="who">
            <div><h4>Nên mua nếu</h4><ul>${best.nen.map(x => `<li class="y">${x}</li>`).join('')}</ul></div>
            <div><h4>Cân nhắc nếu</h4><ul>${best.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="buy">
          <div class="pl">Giá tham khảo</div>
          <div class="pr">${money(best.gia)}</div>
          <div class="pp">${money(per100(best))}/100g · ${best.gram}g</div>
          <button class="cta" onclick="aff('${best.id}')">Xem trên Shopee</button>
          <div class="cta-note">Link tiếp thị liên kết · bạn không trả thêm đồng nào</div>
        </div>
      </div>
    </div>

    <div class="alts">
      <div class="alt">
        <div class="alt-tag">Tiết kiệm nhất</div>
        <div class="alt-n">${cheap.brand} — ${cheap.ten}</div>
        <div class="alt-w">${money(cheap.gia)} · <b>${money(per100(cheap))}/100g</b> — rẻ nhất tính theo 100g.</div>
        <button class="alt-cta" onclick="aff('${cheap.id}')">Xem giá</button>
      </div>
      ${up ? `
      <div class="alt">
        <div class="alt-tag">Nâng cấp nếu dư ngân sách</div>
        <div class="alt-n">${up.brand} — ${up.ten}</div>
        <div class="alt-w">${money(up.gia)} · ${up.tested ? '' : '<b>chưa nếm</b> · '}${up.flavor}</div>
        <button class="alt-cta" onclick="aff('${up.id}')">Xem giá</button>
      </div>` : ''}
    </div>

    ${TRUST}
    <div class="band"><img src="assets/img/band.jpg" alt="Thưởng thức cà phê đặc sản Việt Nam" loading="lazy"></div>`;
}

/* ============ 2 · ĐÁNH GIÁ TỪNG LOẠI ============ */
function renderReviews() {
  $('#reviews').innerHTML = `
    <div class="eyebrow">Đánh giá · Mua thật, nếm mù</div>
    <h2>Từng loại một</h2>
    <div class="rv-list">
    ${SP.map(p => `
      <div class="rv">
        <div class="rv-head">
          ${thumb(p, 'thumb-rv')}
          <div class="rv-head-txt">
            <div class="rv-brand">${p.brand}</div>
            <div class="rv-name">${p.ten} ${badges(p)}</div>
          </div>
          <div class="rv-right">
            ${p.diem != null ? `<div class="rv-score">${p.diem}</div>` : `<div class="rv-noscore">—</div>`}
            ${nhan(p)}
            ${freshChip(p)}
          </div>
        </div>
        <div class="specs">
          ${bar('Độ chua', p.chua)}${bar('Độ đậm', p.dam)}${bar('Hậu vị', p.hau)}
          ${per100(p) ? `<div class="spec"><div class="spec-l">Giá / 100g</div><div class="spec-v">${(per100(p)/1000).toFixed(0)}<span class="of">k</span></div><div class="track"><i style="width:${Math.min(per100(p)/1500*100,100)}%"></i></div></div>` : ''}
        </div>
        <div class="rv-body">
          <div class="rv-flavor">${flavorLine(p)}</div>
          <div class="rv-meta">
            ${p.origin  ? `<span><b>Vùng</b> ${p.origin}</span>` : ''}
            ${p.giong   ? `<span><b>Giống</b> ${p.giong}</span>` : ''}
            ${p.roast   ? `<span><b>Rang</b> ${p.roast}</span>` : ''}
            ${p.process ? `<span><b>Sơ chế</b> ${p.process}</span>` : ''}
            <span><b>Hợp</b> ${p.pha.map(x => PHA_TEN[x] || x).join(' · ')}</span>
          </div>
          <div class="who">
            <div><h4>Nên mua nếu</h4><ul>${p.nen.map(x => `<li class="y">${x}</li>`).join('')}</ul></div>
            <div><h4>Cân nhắc nếu</h4><ul>${p.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="rv-buy">
          <div><span class="pr-sm">${money(p.gia)}</span> ${per100(p) ? `<span class="dim mono">${money(per100(p))}/100g</span>` : ''}</div>
          <button class="mini" onclick="aff('${p.id}')">Xem trên Shopee</button>
        </div>
      </div>`).join('')}
    </div>`;
}

/* ============ 3 · SO SÁNH ============ */
function renderCompare() {
  $('#compare').innerHTML = `
    <div class="eyebrow">So sánh</div>
    <h2>Nên chọn cái nào?</h2>
    ${CAP_SS.map(c => {
      const a = get(c.a), b = get(c.b);
      if (!a || !b) return '';
      const pa = per100(a), pb = per100(b);
      const cheaper = (x, y) => (x != null && y != null && x < y) ? 'win' : '';

      return `
      <h3 class="cmp-t">${c.tieuDe}</h3>
      <div class="cmp-wrap"><table>
        <thead><tr><th></th>
          <th>${a.brand}<br><span class="dim mono th-sub">${money(a.gia)}</span></th>
          <th>${b.brand}<br><span class="dim mono th-sub">${money(b.gia)}</span></th>
        </tr></thead>
        <tbody>
          <tr><td>Trạng thái</td><td>${nhan(a)}</td><td>${nhan(b)}</td></tr>
          <tr><td>Hương vị</td><td>${a.flavor}</td><td>${b.flavor}</td></tr>
          <tr><td>Khối lượng</td><td>${a.gram ? a.gram+'g' : '—'}</td><td>${b.gram ? b.gram+'g' : '—'}</td></tr>
          <tr><td><b>Giá / 100g</b></td>
            <td class="mono ${cheaper(pa,pb)}"><b>${pa ? money(pa) : '—'}</b></td>
            <td class="mono ${cheaper(pb,pa)}"><b>${pb ? money(pb) : '—'}</b></td></tr>
          ${a.diem != null && b.diem != null ? `<tr><td>Điểm nếm mù</td>
            <td class="${a.diem>b.diem?'win':''}">${a.diem}</td>
            <td class="${b.diem>a.diem?'win':''}">${b.diem}</td></tr>`
            : `<tr><td>Điểm nếm mù</td><td>${a.diem != null ? a.diem : '<span class="dim">chưa nếm</span>'}</td><td>${b.diem != null ? b.diem : '<span class="dim">chưa nếm</span>'}</td></tr>`}
          <tr><td>Mua</td>
            <td><button class="mini" onclick="aff('${a.id}')">Xem giá</button></td>
            <td><button class="mini" onclick="aff('${b.id}')">Xem giá</button></td></tr>
        </tbody>
      </table></div>`;
    }).join('')}`;
}

/* ============ 4 · CHỌN NHANH ============ */
const F = { pha: null, gia: null, chua: null };
function renderEngine() {
  $('#engine').innerHTML = `
    <div class="eyebrow">Chọn nhanh</div>
    <h2>Bạn nên mua gì?</h2>
    <p class="lead">Trả lời 3 câu, nhận gợi ý phù hợp — không phải đọc hết mọi bài.</p>
    <div class="fbox">
      <div class="fq">1 · Bạn pha bằng gì?</div>
      <div class="chips-row" data-g="pha">
        <button class="chip" data-v="phin">Phin</button>
        <button class="chip" data-v="v60">V60 / Pour over</button>
        <button class="chip" data-v="coldbrew">Cold brew</button>
      </div>
      <div class="fq">2 · Ngân sách?</div>
      <div class="chips-row" data-g="gia">
        <button class="chip" data-v="200">Dưới 200k</button>
        <button class="chip" data-v="300">200–300k</button>
        <button class="chip" data-v="999">Trên 300k</button>
      </div>
      <div class="fq">3 · Bạn thấy vị chua thế nào?</div>
      <div class="chips-row" data-g="chua">
        <button class="chip" data-v="2">Ngại — càng ít chua càng tốt</button>
        <button class="chip" data-v="3">Bình thường</button>
        <button class="chip" data-v="5">Thích chua sáng</button>
      </div>
      <div class="fres" id="fres"><div class="fempty">Chọn cả 3 mục để xem gợi ý →</div></div>
    </div>`;

  document.querySelectorAll('#engine .chip').forEach(c => c.onclick = () => {
    const g = c.parentElement.dataset.g;
    c.parentElement.querySelectorAll('.chip').forEach(x => x.classList.remove('sel'));
    c.classList.add('sel');
    F[g] = c.dataset.v;
    runEngine();
  });
}

function runEngine() {
  const box = $('#fres');
  if (!F.pha || !F.gia || !F.chua) return;

  const hits = SP.filter(p => p.nhom === 'hat')
    .map(p => {
      let s = 0;
      if (p.pha.includes(F.pha)) s += 3;
      const g = +F.gia;
      if ((g === 200 && p.gia < 200000) || (g === 300 && p.gia >= 200000 && p.gia < 300000) || (g === 999 && p.gia >= 300000)) s += 2;
      if (p.chua <= +F.chua) s += 2;
      if (p.tested) s += 1;
      return { ...p, s };
    })
    .filter(p => p.s >= 3)
    .sort((a, b) => b.s - a.s || (b.diem || 0) - (a.diem || 0))
    .slice(0, 3);

  if (!hits.length) {
    box.innerHTML = '<div class="fempty">Chưa có loại nào khớp cả 3 tiêu chí — thử nới ngân sách hoặc đổi cách pha.</div>';
    return;
  }
  box.innerHTML = hits.map((p, i) => `
    <div class="hit">
      <div class="hit-rank">${i === 0 ? '★' : i + 1}</div>
      <div class="hit-body">
        <div class="hit-n">${p.brand} — ${p.ten} ${nhan(p)}</div>
        <div class="hit-w">${p.flavor} · độ chua ${p.chua}/5 · ${money(per100(p))}/100g</div>
      </div>
      <div class="hit-p">${money(p.gia)}</div>
      <button class="mini" onclick="aff('${p.id}')">Xem giá</button>
    </div>`).join('');
}

/* ============ 5 · BẢNG GIÁ ============ */
function renderPrices() {
  const caPhe = SP.filter(p => p.nhom !== 'gear');
  const gear  = SP.filter(p => p.nhom === 'gear');

  $('#prices').innerHTML = `
    <div class="eyebrow">Bảng giá · Cập nhật ${SITE.capNhat}</div>
    <h2>Giá cà phê đặc sản Việt Nam</h2>
    <p class="lead">Giá tham khảo tại thời điểm cập nhật. <b>Giá/100g</b> giúp so sánh công bằng giữa các gói
    khác khối lượng.</p>

    <div class="cmp-wrap"><table class="price-t">
      <thead><tr>
        <th>Sản phẩm</th><th>Khối lượng</th><th>Giá</th>
        <th>Giá/100g</th><th>Trạng thái</th><th></th>
      </tr></thead>
      <tbody>
      ${[...caPhe].sort((a,b)=>(per100(a)||9e9)-(per100(b)||9e9)).map(p => `
        <tr>
          <td class="pt-n"><b>${p.brand}</b> ${badges(p)}<br><span class="dim">${p.ten}</span></td>
          <td class="mono">${p.gram ? p.gram+'g' : '—'}</td>
          <td class="mono">${money(p.gia)}</td>
          <td class="mono"><b>${per100(p) ? money(per100(p)) : '—'}</b></td>
          <td>${nhan(p)}</td>
          <td><button class="mini sm" onclick="aff('${p.id}')">Xem giá</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>

    ${gear.length ? `
    <h3 style="margin-top:32px">Dụng cụ</h3>
    <div class="cmp-wrap"><table class="price-t">
      <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
      ${[...gear].sort((a,b)=>a.gia-b.gia).map(p => `
        <tr>
          <td class="pt-n"><b>${p.brand}</b><br><span class="dim">${p.ten}</span></td>
          <td class="mono">${money(p.gia)}</td>
          <td>${nhan(p)}</td>
          <td><button class="mini sm" onclick="aff('${p.id}')">Xem giá</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>` : ''}

    <p class="foot-note">Sản phẩm gắn nhãn 🟡 là chúng tôi <b>chưa nếm</b> — thông số lấy từ mô tả nhà bán,
    chưa có điểm số. Chúng tôi chỉ chấm điểm sau khi mua và nếm mù.</p>`;
}

/* ============ 6 · MINH BẠCH ============ */
function renderMethod() {
  $('#method').innerHTML = `
    <div class="eyebrow">Minh bạch</div>
    <h2>Cách chúng tôi test</h2>
    <div class="gallery">
      <figure><img src="assets/img/p1-farm.jpg" alt="Quả cà phê chín trên cành" loading="lazy"><figcaption>Vùng trồng — quả chín</figcaption></figure>
      <figure><img src="assets/img/p2-grind.jpg" alt="Cà phê vừa xay" loading="lazy"><figcaption>Cùng cỡ xay cho mọi loại</figcaption></figure>
      <figure><img src="assets/img/p3-cup.jpg" alt="Dàn ly nếm mù" loading="lazy"><figcaption>Nếm mù — che nhãn</figcaption></figure>
      <figure><img src="assets/img/p4-taste.jpg" alt="Múc nếm chấm điểm" loading="lazy"><figcaption>Chấm điểm theo quy trình</figcaption></figure>
    </div>
    <div class="method">
      <p><b>Công bố TRƯỚC khi mở gói hàng — khoá lại, không sửa.</b></p>
      <ol>${QUY_TRINH.map(x => `<li>${x}</li>`).join('')}</ol>
    </div>
    <div class="note">
      <b>Vì sao điểm số đáng tin:</b> nó là <b>hệ quả của một quy trình ai cũng kiểm chứng lại được</b> —
      cùng cỡ xay, cùng tỷ lệ, cùng nhiệt độ, nếm mù. Thẩm quyền đến từ phương pháp, không từ lời khen.
    </div>
    <div class="note">
      <b>Về hoa hồng:</b> chúng tôi nhận hoa hồng tiếp thị liên kết nếu bạn mua qua link trên trang —
      <b>bạn không trả thêm đồng nào</b>. Link có ở <b>cả sản phẩm chúng tôi khuyên cân nhắc</b>,
      nên không có lý do gì để khen sai. Sản phẩm nào chưa nếm, chúng tôi ghi rõ 🟡.
    </div>

    ${typeof TU_DIEN !== 'undefined' && TU_DIEN.length ? `
    <h3 style="margin-top:36px">Từ điển nhanh</h3>
    <p class="lead" style="font-size:15px">Các thuật ngữ dùng trên trang — giải thích ngắn gọn, đủ để chọn mua.</p>
    <div class="dict">
      ${TU_DIEN.map(x => `<div class="dict-i"><dt>${x.t}</dt><dd>${x.d}</dd></div>`).join('')}
    </div>` : ''}

    ${typeof FAQ !== 'undefined' && FAQ.length ? `
    <h3 style="margin-top:36px">Câu hỏi thường gặp</h3>
    <div class="faq">
      ${FAQ.map((f, i) => `
      <details class="faq-i"${i === 0 ? ' open' : ''}>
        <summary>${f.q}</summary>
        <p>${f.a}</p>
      </details>`).join('')}
    </div>` : ''}`;
}

/* ============ 7 · KIẾN THỨC ============ */
function renderKienThuc() {
  if (typeof BAIVIET === 'undefined' || !BAIVIET.length) return;
  $('#kienthuc').innerHTML = `
    <div class="eyebrow">Kiến thức cà phê</div>
    <h2>Hiểu trước khi mua</h2>
    <p class="lead">Ba điều nên biết để chọn đúng gu — và không trách nhầm hạt.</p>
    <div class="arts">
      ${BAIVIET.map(b => `
      <details class="art">
        <summary>
          <img class="art-img" src="${b.anh}" alt="${b.tieuDe}" loading="lazy">
          <div class="art-copy">
            <div class="art-tag">${b.tag}</div>
            <div class="art-t">${b.tieuDe}</div>
            <div class="art-dek">${b.dek}</div>
            <div class="art-more"></div>
          </div>
        </summary>
        <div class="art-full">${b.than}</div>
      </details>`).join('')}
    </div>`;
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  $('#logo').innerHTML = SITE.ten.replace(/\s(.+)/, ' <span>$1</span>');
  $('#tagline').textContent = SITE.tagline;
  renderTop(); renderReviews(); renderCompare(); renderEngine(); renderPrices(); renderKienThuc(); renderMethod();

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    };
  });
});
