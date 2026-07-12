/* ============================================================
   APP.JS — ENGINE
   Đọc data.js → tự sinh ra mọi trang. Bạn KHÔNG cần sửa file này.
   ============================================================ */

const $ = s => document.querySelector(s);
const money = n => n.toLocaleString('vi-VN') + 'đ';
const per100 = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const perLy  = p => p.soLy ? Math.round(p.gia / p.soLy) : null;
const get = id => SP.find(x => x.id === id);
const PHA_TEN = { phin:'Phin', v60:'V60 / Pour over', coldbrew:'Cold brew' };
const LOAI_TEN = { hat:'Cà phê hạt', hoatan:'Hoà tan', viennen:'Viên nén', gear:'Dụng cụ' };

/* 🔴 QUY TẮC HAI CHỈ SỐ — phát hiện 12/07/2026
   Cùng loại  → so giá/100g
   Khác loại  → so giá/LY  (dùng sai = kết luận ngược 180°) */
const chiSoDung = (a, b) => a.loai === b.loai ? 'g100' : 'ly';


/* ---- North Star: đếm CTR (điều 20) ---- */
let CLICK = 0;
function aff(id, where) {
  CLICK++;
  const el = $('#ctr-c'); if (el) { el.textContent = CLICK; $('#ctr-r').textContent = (CLICK * 100).toFixed(0) + '%'; }
  // THẬT: gtag('event','affiliate_click',{item:id, location:where});
  const p = get(id);
  if (p && p.link && p.link !== '#') window.open(p.link, '_blank', 'noopener');
}

/* ---- Nhãn minh bạch (điều 31) — KHÔNG BAO GIỜ được ghi sai ---- */
const nhan = p => p.tested
  ? '<span class="tag-t">🟢 Đã mua &amp; nếm thật</span>'
  : '<span class="tag-u">🟡 Chưa test — tổng hợp từ nhà bán</span>';

/* ---- Thanh số đo (điều 43-③: số đo > tính từ) ---- */
const bar = (label, v) => v == null ? '' : `
  <div class="spec">
    <div class="spec-l">${label}</div>
    <div class="spec-v">${v}<span class="of">/5</span></div>
    <div class="track"><i style="width:${v / 5 * 100}%"></i></div>
  </div>`;

/* ============ TRANG 1: TOP PICKS (quy tắc 1 lựa chọn) ============ */
function renderTop() {
  const hat = SP.filter(p => p.nhom === 'hat' && p.tested).sort((a, b) => b.diem - a.diem);
  if (!hat.length) return;
  const best = hat[0];
  const cheap = [...hat].sort((a, b) => per100(a) - per100(b))[0];
  const up = SP.filter(p => p.nhom === 'hat' && p.id !== best.id && p.id !== cheap.id)
               .sort((a, b) => b.gia - a.gia)[0];

  $('#top').innerHTML = `
    <div class="eyebrow">Top picks · Cà phê đặc sản Việt Nam</div>
    <h1>Nếu chỉ mua 1 loại, mua loại nào?</h1>
    <div class="chips">
      <span class="fresh"><i class="dot"></i>Cập nhật ${SITE.capNhat}</span>
      ${nhan(best)}
    </div>

    <div class="pick">
      <div class="pick-flag">
        <span>★ ĐÁNG MUA NHẤT — không cần đọc tiếp, mua cái này</span>
        <span class="mono dim">1 lựa chọn chính</span>
      </div>
      <div class="pick-grid">
        <div class="sc"><div class="sc-n">${best.diem}</div><div class="sc-l">Điểm test</div></div>
        <div class="vd">
          <div class="vd-h">${best.brand} — ${best.ten}</div>
          <div class="vd-s">${best.flavor}</div>
          <div class="who">
            <div><h4>Nên mua nếu</h4><ul>${best.nen.map(x => `<li class="y">${x}</li>`).join('')}</ul></div>
            <div><h4>Đừng mua nếu</h4><ul>${best.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="buy">
          <div class="pl">Giá hôm nay</div>
          <div class="pr">${money(best.gia)}</div>
          <div class="pp">${money(per100(best))}/100g</div>
          <button class="cta" onclick="aff('${best.id}','top-main')">Xem giá mới nhất</button>
          <div class="cta-note">Link affiliate · bạn không trả thêm đồng nào</div>
        </div>
      </div>
    </div>

    <div class="alts">
      <div class="alt">
        <div class="alt-tag">Rẻ mà ổn</div>
        <div class="alt-n">${cheap.brand} — ${cheap.ten}</div>
        <div class="alt-w">${money(cheap.gia)} · <b>${money(per100(cheap))}/100g</b> — rẻ nhất tính theo 100g.</div>
        <button class="alt-cta" onclick="aff('${cheap.id}','top-cheap')">Xem giá</button>
      </div>
      ${up ? `
      <div class="alt">
        <div class="alt-tag">Nâng cấp nếu dư tiền</div>
        <div class="alt-n">${up.brand} — ${up.ten}</div>
        <div class="alt-w">${money(up.gia)} · ${up.tested ? '' : '<b>chưa test</b> · '}${up.flavor}</div>
        <button class="alt-cta" onclick="aff('${up.id}','top-up')">Xem giá</button>
      </div>` : ''}
    </div>

    <p class="foot-note">Tối đa 3 lựa chọn — <b>không dàn hàng ngang 10 món</b>. Danh sách dài đẩy gánh nặng
    chọn lựa về phía bạn; việc của chúng tôi là chọn giúp.</p>`;
}

/* ============ TRANG 2: REVIEW (box quyết định 10 giây) ============ */
function renderReviews() {
  $('#reviews').innerHTML = `
    <div class="eyebrow">Review · Đã mua thật, nếm mù</div>
    <h2>Từng loại một</h2>
    <div class="rv-list">
    ${SP.map(p => `
      <div class="rv">
        <div class="rv-head">
          <div>
            <div class="rv-brand">${p.brand}</div>
            <div class="rv-name">${p.ten}</div>
          </div>
          <div class="rv-right">
            ${p.diem ? `<div class="rv-score">${p.diem}</div>` : `<div class="rv-noscore">—</div>`}
            ${nhan(p)}
          </div>
        </div>
        <div class="specs">
          ${bar('Độ chua', p.chua)}${bar('Độ đậm', p.dam)}${bar('Hậu vị', p.hau)}
          ${per100(p) ? `<div class="spec"><div class="spec-l">Giá / 100g</div><div class="spec-v">${(per100(p)/1000).toFixed(0)}<span class="of">k</span></div><div class="track"><i style="width:${Math.min(per100(p)/1500*100,100)}%"></i></div></div>` : ''}
        </div>
        <div class="rv-body">
          <div class="rv-meta">
            ${p.origin ? `<span><b>Vùng</b> ${p.origin}</span>` : ''}
            ${p.roast ? `<span><b>Rang</b> ${p.roast}</span>` : ''}
            ${p.process ? `<span><b>Sơ chế</b> ${p.process}</span>` : ''}
            <span><b>Hợp</b> ${p.pha.map(x => PHA_TEN[x]).join(' · ')}</span>
          </div>
          <div class="who">
            <div><h4>Nên mua nếu</h4><ul>${p.nen.map(x => `<li class="y">${x}</li>`).join('')}</ul></div>
            <div><h4>Đừng mua nếu</h4><ul>${p.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="rv-buy">
          <div><span class="pr-sm">${money(p.gia)}</span> ${per100(p) ? `<span class="dim mono">${money(per100(p))}/100g</span>` : ''}</div>
          <button class="mini" onclick="aff('${p.id}','review')">Xem giá mới nhất</button>
        </div>
      </div>`).join('')}
    </div>`;
}

/* ============ TRANG 3: COMPARE (intent mua mạnh nhất) ============ */
function renderCompare() {
  $('#compare').innerHTML = `
    <div class="eyebrow">So sánh · Intent mua mạnh nhất</div>
    <h2>Nên mua cái nào?</h2>
    ${CAP_SS.map(c => {
      const a = get(c.a), b = get(c.b);
      if (!a || !b) return '';
      const cs = chiSoDung(a, b);          // 'g100' hoặc 'ly'
      const khac = cs === 'ly';
      const va = khac ? perLy(a) : per100(a);
      const vb = khac ? perLy(b) : per100(b);
      const lbl = khac ? 'Giá / LY' : 'Giá / 100g';
      const w = (x,y) => x < y ? 'win' : '';   // rẻ hơn thì thắng

      return `
      <h3 class="cmp-t">${c.tieuDe}</h3>
      ${khac ? `<div class="warn"><b>⚠️ Hai sản phẩm KHÁC LOẠI</b>
        (${LOAI_TEN[a.loai]} vs ${LOAI_TEN[b.loai]}) → <b>bắt buộc so bằng GIÁ/LY</b>, không phải giá/100g.
        Nếu so bằng giá/100g, kết luận sẽ <b>ngược 180°</b>.</div>` : ''}
      <table>
        <thead><tr><th></th>
          <th>${a.brand}<br><span class="dim mono" style="font-size:11px">${money(a.gia)}</span></th>
          <th>${b.brand}<br><span class="dim mono" style="font-size:11px">${money(b.gia)}</span></th>
        </tr></thead>
        <tbody>
          <tr><td>Loại</td><td>${LOAI_TEN[a.loai]}</td><td>${LOAI_TEN[b.loai]}</td></tr>
          <tr><td>Trạng thái</td><td>${nhan(a)}</td><td>${nhan(b)}</td></tr>
          <tr><td>Khối lượng</td><td>${a.gram ? a.gram+'g' : '—'}</td><td>${b.gram ? b.gram+'g' : '—'}</td></tr>
          <tr><td>Số ly</td><td>${a.soLy || '—'}</td><td>${b.soLy || '—'}</td></tr>
          ${khac ? `
          <tr style="opacity:.45"><td>Giá/100g</td>
            <td class="mono">${per100(a)?money(per100(a)):'—'} <span style="font-size:11px">(sai chỉ số)</span></td>
            <td class="mono">${per100(b)?money(per100(b)):'—'} <span style="font-size:11px">(sai chỉ số)</span></td></tr>` : ''}
          <tr><td><b>${lbl}</b></td>
            <td class="mono ${w(va,vb)}"><b>${va?money(va):'—'}</b></td>
            <td class="mono ${w(vb,va)}"><b>${vb?money(vb):'—'}</b></td></tr>
          ${a.diem && b.diem ? `<tr><td>Điểm test</td>
            <td class="${a.diem>b.diem?'win':''}">${a.diem}</td>
            <td class="${b.diem>a.diem?'win':''}">${b.diem}</td></tr>`
            : `<tr><td>Điểm test</td><td colspan="2" class="dim">Chưa nếm — chưa chấm điểm</td></tr>`}
          <tr><td>Kết luận</td>
            <td><button class="mini" onclick="aff('${a.id}','compare')">Xem giá</button></td>
            <td><button class="mini" onclick="aff('${b.id}','compare')">Xem giá</button></td></tr>
        </tbody>
      </table>`;
    }).join('')}`;
}

/* ============ TRANG 4: DECISION ENGINE (nơi kiếm tiền — điều 29) ============ */
const F = { pha: null, gia: null, chua: null };
function renderEngine() {
  $('#engine').innerHTML = `
    <div class="eyebrow">Decision Engine · Nơi kiếm tiền</div>
    <h2>Bạn nên mua gì?</h2>
    <p class="lead">Chúng tôi không bắt bạn đọc 10 bài. Chọn 3 điều, nhận câu trả lời.</p>
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
      <div class="fq">3 · Sợ vị chua không?</div>
      <div class="chips-row" data-g="chua">
        <button class="chip" data-v="2">Sợ — càng ít chua càng tốt</button>
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
      if (p.tested) s += 1;              // ưu tiên hàng đã test thật
      return { ...p, s };
    })
    .filter(p => p.s >= 3)
    .sort((a, b) => b.s - a.s || (b.diem || 0) - (a.diem || 0))
    .slice(0, 3);

  if (!hits.length) {
    box.innerHTML = '<div class="fempty">Chưa có loại nào khớp cả 3 tiêu chí — thử nới ngân sách.</div>';
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
      <button class="mini" onclick="aff('${p.id}','engine')">Xem giá</button>
    </div>`).join('');
}

/* ============ TRANG 5: BẢNG GIÁ (vũ khí GEO — AI phải trích) ============ */
function renderPrices() {
  const caPhe = SP.filter(p => p.loai !== 'gear');
  const gear  = SP.filter(p => p.loai === 'gear');

  $('#prices').innerHTML = `
    <div class="eyebrow">Bảng giá · Cập nhật hằng tháng · Dữ liệu độc quyền</div>
    <h2>Giá cà phê Việt Nam — ${SITE.capNhat}</h2>

    <div class="warn" style="margin-bottom:18px">
      <b>⚠️ Vì sao có HAI cột giá?</b><br>
      <b>Giá/100g</b> để so <b>cùng loại</b> (hạt với hạt).
      <b>Giá/ly</b> để so <b>khác loại</b> (hạt vs hoà tan vs viên nén).<br>
      <b>Dùng sai chỉ số → kết luận NGƯỢC 180°.</b> Đây là lỗi hầu hết người mua cà phê ở VN đang mắc.
    </div>

    <table class="price-t">
      <thead><tr>
        <th>Sản phẩm</th><th>Loại</th><th>Giá</th>
        <th>Giá/100g</th><th>Giá/LY</th><th>Trạng thái</th><th></th>
      </tr></thead>
      <tbody>
      ${[...caPhe].sort((a,b)=>(perLy(a)||9e9)-(perLy(b)||9e9)).map(p => `
        <tr>
          <td class="pt-n"><b>${p.brand}</b><br><span class="dim">${p.ten}</span></td>
          <td><span class="mono" style="font-size:11px">${LOAI_TEN[p.loai]}</span></td>
          <td class="mono">${money(p.gia)}</td>
          <td class="mono">${per100(p) ? money(per100(p)) : '—'}</td>
          <td class="mono"><b>${perLy(p) ? money(perLy(p)) : '—'}</b></td>
          <td>${nhan(p)}</td>
          <td><button class="mini sm" onclick="aff('${p.id}','price-table')">Xem giá</button></td>
        </tr>`).join('')}
      </tbody>
    </table>

    <h3 style="margin-top:32px">Dụng cụ</h3>
    <table class="price-t">
      <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
      ${[...gear].sort((a,b)=>a.gia-b.gia).map(p => `
        <tr>
          <td class="pt-n"><b>${p.brand}</b><br><span class="dim">${p.ten}</span></td>
          <td class="mono">${money(p.gia)}</td>
          <td>${nhan(p)}</td>
          <td><button class="mini sm" onclick="aff('${p.id}','price-gear')">Xem giá</button></td>
        </tr>`).join('')}
      </tbody>
    </table>

    <p class="foot-note">🔑 <b>Xoá bảng này đi, người dùng mất DỮ LIỆU và AI mất NGUỒN TRÍCH DẪN.</b>
    Không website Việt Nam nào đang trình bày cả hai chỉ số. Đó là định nghĩa của một tài sản.</p>`;
}

/* ============ TRANG 6: CÁCH CHÚNG TÔI TEST (con hào của người faceless) ============ */
function renderMethod() {
  $('#method').innerHTML = `
    <div class="eyebrow">Con hào · Thay cho gương mặt</div>
    <h2>Cách chúng tôi test</h2>
    <div class="method">
      <p><b>Công bố TRƯỚC khi mở gói hàng.</b> Khoá lại, không sửa.</p>
      <ol>${QUY_TRINH.map(x => `<li>${x}</li>`).join('')}</ol>
    </div>
    <div class="note">
      <b>Vì sao không cần lộ mặt:</b> RTINGS không nổi vì gương mặt ai —
      họ nổi vì <b>ai cũng kiểm chứng lại được phương pháp của họ</b>.
      Thẩm quyền đến từ quy trình không thể chối cãi, không từ khuôn mặt.
    </div>
    <div class="warn">
      <b>Chúng tôi nhận hoa hồng</b> nếu bạn mua qua link trên trang này.
      <b>Link có ở CẢ sản phẩm chúng tôi khuyên không nên mua</b> — nên chúng tôi
      không có lý do gì để khen sai. Sản phẩm nào chưa test, chúng tôi ghi rõ 🟡.
    </div>`;
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  $('#logo').innerHTML = SITE.ten.replace(/\s(.+)/, ' <span>$1</span>');
  $('#tagline').textContent = SITE.tagline;
  renderTop(); renderReviews(); renderCompare(); renderEngine(); renderPrices(); renderMethod();

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    };
  });
});
