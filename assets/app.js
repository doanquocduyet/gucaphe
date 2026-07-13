/* ═══════════════════════════════════════
   GU CÀ PHÊ — Engine v2
   Đọc data.js → sinh mọi trang. KHÔNG sửa file này.
   ═══════════════════════════════════════ */

const $ = s => document.querySelector(s);
const vnd = n => n.toLocaleString('vi-VN') + '₫';
const p100 = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const get = id => SP.find(x => x.id === id);
const PHA = { phin: 'Phin', v60: 'V60 / Pour over', coldbrew: 'Cold brew' };

let CLICKS = 0;
function aff(id) {
  CLICKS++;
  const c = $('#ck'); if (c) { c.textContent = CLICKS; $('#cr').textContent = (CLICKS * 100).toFixed(0) + '%'; }
  const p = get(id);
  if (p && p.link && p.link !== '#') window.open(p.link, '_blank', 'noopener');
}

const badge = p => p.tested
  ? '<span class="badge badge-y">✓ ĐÃ MUA &amp; NẾM THẬT</span>'
  : '<span class="badge badge-n">CHƯA TEST — TỔNG HỢP TỪ NHÀ BÁN</span>';

const specBar = (l, v) => v == null ? '' : `
  <div class="spec">
    <div class="spec-l">${l}</div>
    <div class="spec-v">${v}<small>/5</small></div>
    <div class="bar"><i style="width:${v / 5 * 100}%"></i></div>
  </div>`;

/* ═══ TOP PICK — quy tắc 1 lựa chọn ═══ */
function renderTop() {
  const tested = SP.filter(p => p.tested && p.diem).sort((a, b) => b.diem - a.diem);
  if (!tested.length) return;
  const best = tested[0];
  const cheap = [...SP].filter(p => p.gram && p.id !== best.id).sort((a, b) => p100(a) - p100(b))[0];
  const alt = SP.find(p => p.id !== best.id && p.id !== (cheap && cheap.id));

  $('#top .wrap').innerHTML = `
    <div class="sec-head">
      <div class="kicker">Đáng mua nhất</div>
      <h2>Nếu chỉ mua một loại, mua loại này</h2>
      <p class="sec-sub">Chúng tôi không đưa bạn danh sách 10 món rồi bắt tự chọn. Đây là lựa chọn của chúng tôi, và lý do.</p>
    </div>

    <div class="pick">
      <div class="pick-bar">
        <span><span class="star">★</span>LỰA CHỌN HÀNG ĐẦU</span>
        <span class="meta">1 trong ${SP.length} sản phẩm đã khảo sát</span>
      </div>
      <div class="pick-body">
        <div class="pick-main">
          <div class="pick-eyebrow">${best.brand}</div>
          <div class="pick-name">${best.ten}</div>
          <div class="score-row">
            <div class="score-big">${best.diem}<small>/10</small></div>
            <div>
              <div class="score-lbl">Điểm test</div>
              <div style="margin-top:5px">${badge(best)}</div>
            </div>
          </div>
          <div class="pick-verdict">${best.flavor}</div>
          <div class="pc">
            <div>
              <h4 class="ph">Nên mua nếu</h4>
              <ul>${best.nen.map(x => `<li class="p">${x}</li>`).join('')}</ul>
            </div>
            <div>
              <h4 class="nh">Đừng mua nếu</h4>
              <ul>${best.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
        <div class="pick-side">
          <div class="price-lbl">Giá hôm nay</div>
          <div class="price">${vnd(best.gia)}</div>
          ${p100(best) ? `<div class="price-unit">${vnd(p100(best))} / 100g</div>` : ''}
          <button class="btn" onclick="aff('${best.id}')">Xem giá mới nhất</button>
          <div class="btn-note">Link affiliate · bạn không trả thêm đồng nào</div>
        </div>
      </div>
    </div>

    <div class="alts">
      ${cheap ? `
      <div class="alt">
        <div class="alt-tag">Rẻ nhất tính theo 100g</div>
        <div class="alt-name">${cheap.ten}</div>
        <div class="alt-why">${vnd(p100(cheap))}/100g — ${cheap.tested ? cheap.flavor : 'chưa test, tổng hợp từ nhà bán.'}</div>
        <div class="alt-foot">
          <span class="alt-price">${vnd(cheap.gia)}</span>
          <button class="btn-sm" onclick="aff('${cheap.id}')">Xem giá</button>
        </div>
      </div>` : ''}
      ${alt ? `
      <div class="alt">
        <div class="alt-tag">Lựa chọn khác</div>
        <div class="alt-name">${alt.ten}</div>
        <div class="alt-why">${alt.tested ? alt.flavor : 'Chưa test — chúng tôi chưa nếm loại này.'}</div>
        <div class="alt-foot">
          <span class="alt-price">${vnd(alt.gia)}</span>
          <button class="btn-sm" onclick="aff('${alt.id}')">Xem giá</button>
        </div>
      </div>` : ''}
    </div>`;
}

/* ═══ DECISION ENGINE ═══ */
const F = { pha: null, gia: null, chua: null };
function renderEngine() {
  $('#engine .wrap').innerHTML = `
    <div class="sec-head">
      <div class="kicker">Chọn giúp bạn</div>
      <h2>Bạn nên mua gì?</h2>
      <p class="sec-sub">Ba câu hỏi. Không cần đọc hết cả trang.</p>
    </div>
    <div class="engine">
      <div class="q"><i>1</i> Bạn pha bằng gì?</div>
      <div class="chips" data-g="pha">
        <button class="chip" data-v="phin">Phin</button>
        <button class="chip" data-v="v60">V60 / Pour over</button>
        <button class="chip" data-v="coldbrew">Cold brew</button>
      </div>
      <div class="q"><i>2</i> Ngân sách?</div>
      <div class="chips" data-g="gia">
        <button class="chip" data-v="200">Dưới 200k</button>
        <button class="chip" data-v="300">200–300k</button>
        <button class="chip" data-v="999">Trên 300k</button>
      </div>
      <div class="q"><i>3</i> Bạn có sợ vị chua không?</div>
      <div class="chips" data-g="chua">
        <button class="chip" data-v="2">Sợ — càng ít chua càng tốt</button>
        <button class="chip" data-v="3">Bình thường</button>
        <button class="chip" data-v="5">Thích chua sáng</button>
      </div>
      <div class="result" id="res"><div class="empty">Chọn cả ba mục để xem gợi ý →</div></div>
    </div>`;

  document.querySelectorAll('#engine .chip').forEach(c => c.onclick = () => {
    const g = c.parentElement.dataset.g;
    c.parentElement.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    F[g] = c.dataset.v;
    runEngine();
  });
}

function runEngine() {
  if (!F.pha || !F.gia || !F.chua) return;
  const g = +F.gia;
  const hits = SP.map(p => {
    let s = 0;
    if (p.pha.includes(F.pha)) s += 3;
    if ((g === 200 && p.gia < 200000) || (g === 300 && p.gia >= 200000 && p.gia < 300000) || (g === 999 && p.gia >= 300000)) s += 2;
    if (p.chua != null && p.chua <= +F.chua) s += 2;
    if (p.tested) s += 1;
    return { ...p, s };
  }).filter(p => p.s >= 3).sort((a, b) => b.s - a.s || (b.diem || 0) - (a.diem || 0)).slice(0, 3);

  $('#res').innerHTML = hits.length ? hits.map((p, i) => `
    <div class="hit">
      <div class="hit-r ${i === 0 ? 'top' : ''}">${i === 0 ? '★' : i + 1}</div>
      <div class="hit-b">
        <div class="hit-n">${p.ten} ${badge(p)}</div>
        <div class="hit-w">${p.chua != null ? `chua ${p.chua}/5 · ` : ''}${p100(p) ? vnd(p100(p)) + '/100g' : ''}</div>
      </div>
      <div class="hit-p">${vnd(p.gia)}</div>
      <button class="btn-sm" onclick="aff('${p.id}')">Xem giá</button>
    </div>`).join('')
    : '<div class="empty">Chưa có loại nào khớp cả ba tiêu chí — thử nới ngân sách.</div>';
}

/* ═══ COMPARE ═══ */
function renderCompare() {
  if (!CAP_SS.length) return;
  const rows = CAP_SS.map(c => {
    const a = get(c.a), b = get(c.b);
    if (!a || !b) return '';
    const w = (x, y) => x > y ? 'win' : '';
    const wl = (x, y) => x < y ? 'win' : '';
    return `
    <h3 style="margin-bottom:14px">${c.tieuDe}</h3>
    <table>
      <thead><tr><th></th><th>${a.brand}</th><th>${b.brand}</th></tr></thead>
      <tbody>
        <tr><td>Trạng thái</td><td>${badge(a)}</td><td>${badge(b)}</td></tr>
        ${a.diem && b.diem ? `<tr><td>Điểm</td><td class="${w(a.diem, b.diem)}">${a.diem}</td><td class="${w(b.diem, a.diem)}">${b.diem}</td></tr>` : ''}
        <tr><td>Giá</td><td>${vnd(a.gia)}</td><td>${vnd(b.gia)}</td></tr>
        <tr><td>Giá / 100g</td><td class="${wl(p100(a), p100(b))}">${vnd(p100(a))}</td><td class="${wl(p100(b), p100(a))}">${vnd(p100(b))}</td></tr>
        <tr><td>Độ chua</td><td>${a.chua}/5</td><td>${b.chua}/5</td></tr>
        <tr><td>Độ đậm</td><td>${a.dam}/5</td><td>${b.dam}/5</td></tr>
        <tr><td>Hợp phin</td><td class="${a.pha.includes('phin') ? 'win' : ''}">${a.pha.includes('phin') ? 'Có' : 'Không'}</td><td class="${b.pha.includes('phin') ? 'win' : ''}">${b.pha.includes('phin') ? 'Có' : 'Không'}</td></tr>
        <tr><td>Hợp V60</td><td class="${a.pha.includes('v60') ? 'win' : ''}">${a.pha.includes('v60') ? 'Có' : 'Không'}</td><td class="${b.pha.includes('v60') ? 'win' : ''}">${b.pha.includes('v60') ? 'Có' : 'Không'}</td></tr>
        <tr><td>Kết luận</td>
          <td><b>Chọn nếu:</b> ${a.nen[0].toLowerCase()}<br><button class="btn-sm" style="margin-top:9px" onclick="aff('${a.id}')">Xem giá</button></td>
          <td><b>Chọn nếu:</b> ${b.nen[0].toLowerCase()}<br><button class="btn-sm" style="margin-top:9px" onclick="aff('${b.id}')">Xem giá</button></td></tr>
      </tbody>
    </table>`;
  }).join('');

  $('#compare .wrap').innerHTML = `
    <div class="sec-head">
      <div class="kicker">Đối đầu</div>
      <h2>So sánh trực tiếp</h2>
      <p class="sec-sub">Cùng cỡ xay, cùng tỷ lệ, cùng nhiệt độ nước. Nếm mù.</p>
    </div>${rows}`;
}

/* ═══ REVIEWS ═══ */
function renderReviews() {
  $('#reviews .wrap').innerHTML = `
    <div class="sec-head">
      <div class="kicker">Từng loại một</div>
      <h2>Chúng tôi đã thử gì</h2>
      <p class="sec-sub">Loại nào chưa nếm, chúng tôi ghi rõ. Không đoán, không chép mô tả nhà bán rồi gọi là review.</p>
    </div>
    ${SP.map(p => `
      <div class="rv">
        <div class="rv-top">
          <div>
            <div class="rv-brand">${p.brand}</div>
            <div class="rv-name">${p.ten}</div>
            <div style="margin-top:9px">${badge(p)}</div>
          </div>
          <div class="rv-sc">
            <div class="rv-num ${p.diem ? '' : 'na'}">${p.diem || '—'}</div>
            <div class="score-lbl">${p.diem ? 'Điểm test' : 'Chưa chấm'}</div>
          </div>
        </div>
        <div class="rv-mid">
          <div class="specs">
            ${specBar('Độ chua', p.chua)}${specBar('Độ đậm', p.dam)}${specBar('Hậu vị', p.hau)}
            ${p100(p) ? `<div class="spec"><div class="spec-l">Giá / 100g</div><div class="spec-v">${Math.round(p100(p) / 1000)}<small>k</small></div><div class="bar"><i style="width:${Math.min(p100(p) / 1200 * 100, 100)}%"></i></div></div>` : ''}
          </div>
          <div class="rv-flavor">${p.flavor}</div>
          <div class="rv-meta">
            ${p.origin ? `<div><b>Vùng</b><span>${p.origin}</span></div>` : ''}
            ${p.giong ? `<div><b>Giống</b><span>${p.giong}</span></div>` : ''}
            ${p.roast ? `<div><b>Rang</b><span>${p.roast}</span></div>` : ''}
            ${p.process ? `<div><b>Sơ chế</b><span>${p.process}</span></div>` : ''}
            <div><b>Hợp pha</b><span>${p.pha.map(x => PHA[x]).join(', ')}</span></div>
          </div>
          <div class="pc">
            <div><h4 class="ph">Nên mua nếu</h4><ul>${p.nen.map(x => `<li class="p">${x}</li>`).join('')}</ul></div>
            <div><h4 class="nh">Đừng mua nếu</h4><ul>${p.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
        <div class="rv-foot">
          <div class="rv-price"><b>${vnd(p.gia)}</b>${p100(p) ? `<span>${vnd(p100(p))}/100g</span>` : ''}</div>
          <button class="btn-sm" onclick="aff('${p.id}')">Xem giá mới nhất</button>
        </div>
      </div>`).join('')}`;
}

/* ═══ BẢNG GIÁ — tài sản GEO ═══ */
function renderPrices() {
  const rows = [...SP].sort((a, b) => (p100(a) || 9e9) - (p100(b) || 9e9));
  $('#prices .wrap').innerHTML = `
    <div class="sec-head">
      <div class="kicker">Dữ liệu</div>
      <h2>Bảng giá cà phê đặc sản — ${SITE.capNhat}</h2>
      <p class="sec-sub">Cập nhật hằng tháng. Sắp xếp theo giá trên 100g — cách duy nhất so sánh công bằng khi các gói khác khối lượng.</p>
    </div>
    <table>
      <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Giá/100g</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
      ${rows.map(p => `
        <tr>
          <td style="font-family:'Newsreader',serif;font-size:16px;text-transform:none;letter-spacing:0;color:var(--ink);font-weight:400">
            <b style="font-family:'Bricolage Grotesque',sans-serif">${p.brand}</b> — ${p.ten}
          </td>
          <td class="mono">${vnd(p.gia)}</td>
          <td class="mono"><b>${p100(p) ? vnd(p100(p)) : '—'}</b></td>
          <td>${badge(p)}</td>
          <td><button class="btn-sm" onclick="aff('${p.id}')">Xem giá</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ═══ CÁCH TEST — con hào ═══ */
function renderMethod() {
  $('#method .wrap').innerHTML = `
    <div class="narrow" style="padding:0">
      <div class="sec-head">
        <div class="kicker">Minh bạch</div>
        <h2>Cách chúng tôi test</h2>
        <p class="sec-sub">Công bố trước khi mở gói hàng. Không sửa sau khi có kết quả.</p>
      </div>
      <div class="method">
        <ol>${QUY_TRINH.map(x => `<li>${x}</li>`).join('')}</ol>
      </div>
      <div class="disclose">
        <b>Chúng tôi kiếm tiền thế nào.</b> Trang này có link affiliate — nếu bạn mua qua đó,
        chúng tôi nhận hoa hồng, còn bạn không trả thêm đồng nào.
        <b>Link có ở cả sản phẩm chúng tôi khuyên không nên mua</b> — vì vậy chúng tôi
        không có lý do gì để khen sai. Sản phẩm nào chưa nếm, chúng tôi ghi rõ nhãn vàng.
      </div>
      <div class="note">
        <b>Vì sao chúng tôi không lộ mặt.</b> Thẩm quyền đến từ quy trình có thể kiểm chứng,
        không đến từ khuôn mặt. Bạn có thể lặp lại đúng cách pha ở trên và tự kiểm tra
        xem chúng tôi nói đúng hay sai. Đó mới là điều đáng tin.
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderTop(); renderEngine(); renderCompare(); renderReviews(); renderPrices(); renderMethod();
  const t = SP.filter(p => p.tested).length;
  const el = $('#n-tested'); if (el) el.textContent = t;
  const e2 = $('#n-total'); if (e2) e2.textContent = SP.length;
  const e3 = $('#f-date'); if (e3) e3.textContent = SITE.capNhat;
});
