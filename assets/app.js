/* ============================================================
   APP.JS — ENGINE · GU CÀ PHÊ
   Đọc data.js → tự sinh mọi trang.
   Giọng thương hiệu: curator có gu — ít chữ, chắc, không hô hào.
   ============================================================ */

const $ = s => document.querySelector(s);
const money   = n => n.toLocaleString('vi-VN') + '₫';
const per100  = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const get     = id => SP.find(x => x.id === id);
const PHA_TEN = { phin:'Phin', v60:'V60 / Pour over', coldbrew:'Cold brew' };

/* ---- Affiliate click ---- */
let CLICK = 0;
function aff(id) {
  CLICK++;
  // THẬT: gtag('event','affiliate_click',{item:id});
  const p = get(id);
  if (p && p.link && p.link !== '#') window.open(p.link, '_blank', 'noopener');
}

/* ---- Nhãn minh bạch — không emoji, không bao giờ ghi sai ---- */
const nhan = p => p.tested
  ? '<span class="tag tag-t">Đã nếm mù</span>'
  : '<span class="tag tag-u">Chưa nếm</span>';

/* ---- Expert cues: vùng · giống · sơ chế · rang — tín hiệu chuyên môn ---- */
const cues = p => {
  const bits = [p.origin, p.giong, p.process, p.roast ? 'Rang ' + p.roast.toLowerCase() : null]
    .filter(Boolean);
  return bits.length ? `<div class="cues">${bits.join('<i>·</i>')}</div>` : '';
};

/* ---- Tasting notes (chỉ loại đã nếm) / mô tả nhà bán ---- */
const flavorLine = p => (p.tested && p.notes && p.notes.length)
  ? `<div class="notes-line">${p.notes.join(' · ')}.</div>`
  : `<div class="flavor-txt">${p.flavor}</div>`;

/* ---- Thanh số đo ---- */
const bar = (label, v) => v == null ? '' : `
  <div class="spec">
    <div class="spec-l">${label}</div>
    <div class="spec-v">${v}<span class="of">/5</span></div>
    <div class="track"><i style="width:${v / 5 * 100}%"></i></div>
  </div>`;

/* ---- Ô sản phẩm: ảnh thật nếu có, không thì swatch màu rang (dữ liệu, không giả ảnh) ---- */
const ROAST_BG = {
  'Light':'#C9A876','Light-medium':'#B08D5B','Medium':'#8A6A44',
  'Medium-dark':'#5E4530','Dark':'#3B2A1C'
};
function thumb(p, cls = '') {
  if (p.anh) return `<div class="thumb ${cls}"><img src="${p.anh}" alt="${p.brand} — ${p.ten}" loading="lazy"></div>`;
  const c = ROAST_BG[p.roast] || '#8A6A44';
  return `<div class="thumb thumb-gen ${cls}" style="background:${c}" aria-label="Độ rang ${p.roast || ''}">
    <span class="thumb-l">${p.roast || ''}</span></div>`;
}

/* ============ 1 · HERO — lời hứa, không phải quảng cáo ============ */
function renderTop() {
  const nem  = SP.filter(p => p.tested).length;
  const chua = SP.filter(p => !p.tested).length;
  $('#top').innerHTML = `
    <div class="eyebrow">Gu Cà Phê · Curator cà phê đặc sản Việt Nam</div>
    <h1>Chưa uống<br>thì không chấm.</h1>
    <p class="lead">Mỗi gói trên trang đều được chúng tôi <b>mua bằng tiền của mình</b> và nếm mù.
    Không nhận mẫu để đổi lấy lời khen. Gói nào chưa nếm, chúng tôi ghi thẳng: <b>Chưa nếm</b>.</p>
    <div class="hero-cta-row">
      <button class="cta" onclick="document.querySelector('#matrix').scrollIntoView({behavior:'smooth'})">Xem những gì đã nếm</button>
      <button class="cta-line" onclick="document.querySelector('#method').scrollIntoView({behavior:'smooth'})">Cách chúng tôi test</button>
    </div>
    <div class="proof">
      <div class="proof-i"><b>${nem}</b><span>Đã nếm mù</span></div>
      <div class="proof-i"><b>${chua}</b><span>Đang chờ nếm</span></div>
      <div class="proof-i"><b>0</b><span>Bài tài trợ</span></div>
    </div>
    <div class="proof-cap">Cập nhật ${SITE.capNhat} · con số thật, cập nhật theo từng mẻ mua.</div>`;
}

/* ============ 2 · SIGNATURE + LỰA CHỌN THÁNG NÀY ============ */
function renderPick() {
  const best = SP.filter(p => p.tested && p.diem != null).sort((a, b) => b.diem - a.diem)[0];

  $('#pick').innerHTML = `
    <p class="sig-line">Điểm số không phải ý kiến.<br>Nó là <b>hệ quả của một quy trình</b> ai cũng kiểm chứng lại được.</p>

    ${best ? `
    <div class="pick">
      <div class="pick-media">
        <img src="assets/img/hero.jpg" alt="Rót V60 trong buổi nếm mù của Gu Cà Phê">
        <span class="pick-media-cap">Buổi nếm mù · 1:15 · 92°C</span>
      </div>
      <div class="pick-info">
        <span class="eyebrow">Đang trên máy xay của chúng tôi</span>
        <div class="pick-brand">${best.brand}</div>
        <div class="pick-name">${best.ten}</div>
        <div class="pick-notes">${(best.notes && best.notes.join(' · ')) || best.flavor}.</div>
        <div class="pick-cues">${cues(best)}</div>
        <ul class="pick-why">
          ${best.nen.slice(0, 3).map(x => `<li><b>+</b> ${x}</li>`).join('')}
        </ul>
      </div>
      <div class="pick-side">
        <div class="pick-score">${best.diem}</div>
        <div class="pick-score-l">Điểm nếm mù / 10</div>
        <div class="pick-price">${money(best.gia)}</div>
        <div class="pick-per">${money(per100(best))} / 100g · ${best.gram}g</div>
        <button class="cta" onclick="aff('${best.id}')">Xem giá trên Shopee</button>
        <div class="cta-note">Link tiếp thị liên kết — bạn không trả thêm đồng nào.</div>
      </div>
    </div>` : ''}`;
}

/* ============ 3 · BẢNG TUYỂN CHỌN ============ */
function renderMatrix() {
  const rows = [...SP].sort((a, b) =>
    (b.tested ? 1 : 0) - (a.tested ? 1 : 0) ||
    (b.diem || 0) - (a.diem || 0) ||
    (per100(a) || 9e9) - (per100(b) || 9e9));
  const bestId  = (rows.find(p => p.tested) || {}).id;
  const cheapId = ([...SP].filter(p => per100(p)).sort((a, b) => per100(a) - per100(b))[0] || {}).id;

  const nem = SP.filter(p => p.tested).length, chua = SP.length - nem;

  $('#matrix').innerHTML = `
    <div class="mx-head">
      <div>
        <div class="eyebrow">Bảng tuyển chọn · ${SITE.capNhat}</div>
        <h2>Chúng tôi đã lọc.<br>Bạn chỉ cần chọn.</h2>
      </div>
      <p class="lead" style="max-width:34ch;font-size:16.5px">Giá quy về 100g để so sòng phẳng
      giữa các gói khác khối lượng. Gói nào chưa nếm thì không có điểm — không ngoại lệ.</p>
    </div>
    <div class="mx-filter">
      <button class="active" data-f="all"  onclick="mxFilter('all',this)">Tất cả · ${SP.length}</button>
      <button data-f="nem"  onclick="mxFilter('nem',this)">Đã nếm · ${nem}</button>
      <button data-f="chua" onclick="mxFilter('chua',this)">Chưa nếm · ${chua}</button>
    </div>
    <div class="mx" data-f="all">
      <div class="mx-cols"><span>Sản phẩm</span><span>Giá / 100g</span><span>Điểm</span><span></span></div>
      ${rows.map(p => `
      <div class="mx-row" data-tested="${p.tested ? 1 : 0}">
        <div>
          ${p.id === bestId ? '<div class="mx-pick-note">Lựa chọn của chúng tôi</div>' : ''}
          ${p.id === cheapId ? '<div class="mx-pick-note">Rẻ nhất tính theo 100g</div>' : ''}
          <div class="mx-name"><small>${p.brand}</small>${p.ten}</div>
          ${cues(p)}
        </div>
        <div class="mx-per">${per100(p) ? money(per100(p)) : '—'}<small>${money(p.gia)} / ${p.gram}g</small></div>
        <div class="mx-score">${p.diem != null ? p.diem : '<span class="ut">Chưa nếm</span>'}</div>
        <div class="mx-act"><button class="cta" onclick="aff('${p.id}')">Xem giá</button></div>
      </div>`).join('')}
    </div>
    <p class="foot-note">Giá tham khảo tại thời điểm cập nhật · Link có ở cả sản phẩm chúng tôi khuyên cân nhắc — nên không có lý do để khen sai.</p>`;
}

function mxFilter(f, btn) {
  const mx = $('.mx'); if (mx) mx.dataset.f = f;
  document.querySelectorAll('.mx-filter button').forEach(b => b.classList.toggle('active', b === btn));
}

/* ============ KHUÔN HÌNH GIỮA TRANG ============ */
function renderAtmos() {
  $('#atmos').innerHTML = `<div class="atmos-img"><img src="assets/img/band-life.jpg" alt="Pha pour over đặc sản" loading="lazy"></div>`;
}

/* ============ PEAK — điểm dừng, phá nhịp ============ */
function renderPeak() {
  $('#peak').innerHTML = `<p class="peak-line">Không có bài viết tài trợ.<br>
    Không có điểm số cho thứ chúng tôi <b>chưa bỏ vào miệng.</b></p>`;
}

/* ============ 4 · REVIEW CHI TIẾT ============ */
function renderReviews() {
  $('#reviews').innerHTML = `
    <div class="eyebrow">Sổ nếm</div>
    <h2>Chi tiết từng gói.</h2>
    <div class="rv-list">
    ${SP.map(p => `
      <div class="rv">
        <div class="rv-top">
          ${thumb(p, 'thumb-rv')}
          <div class="rv-head-txt">
            <div class="rv-brand">${p.brand}</div>
            <div class="rv-name">${p.ten} ${nhan(p)}</div>
            ${flavorLine(p)}
          </div>
          <div class="rv-top-right">
            ${p.diem != null ? `<div class="rv-score">${p.diem}</div>` : `<div class="rv-noscore">Chưa chấm điểm</div>`}
            <div class="rv-price"><b>${money(p.gia)}</b>${per100(p) ? `${money(per100(p))}/100g` : ''}</div>
            <button class="cta" onclick="aff('${p.id}')">Xem giá trên Shopee</button>
            <button class="rv-toggle" type="button" onclick="this.closest('.rv').classList.toggle('open')"></button>
          </div>
        </div>
        <div class="rv-detail">
          <div class="specs">
            ${bar('Độ chua', p.chua)}${bar('Độ đậm', p.dam)}${bar('Hậu vị', p.hau)}
            ${per100(p) ? `<div class="spec"><div class="spec-l">Giá / 100g</div><div class="spec-v">${(per100(p)/1000).toFixed(0)}<span class="of">k</span></div><div class="track"><i style="width:${Math.min(per100(p)/1500*100,100)}%"></i></div></div>` : ''}
          </div>
          <div class="rv-meta">${cues(p)}
            <div class="cues" style="margin-top:6px">Hợp: ${p.pha.map(x => PHA_TEN[x] || x).join('<i>·</i>')}</div>
          </div>
          <div class="who">
            <div><h4>Nên mua nếu</h4><ul>${p.nen.map(x => `<li class="y">${x}</li>`).join('')}</ul></div>
            <div><h4>Cân nhắc nếu</h4><ul>${p.khong.map(x => `<li class="n">${x}</li>`).join('')}</ul></div>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
}

/* ============ 5 · KIẾN THỨC ============ */
function renderKienThuc() {
  if (typeof BAIVIET === 'undefined' || !BAIVIET.length) return;
  $('#kienthuc').innerHTML = `
    <div class="eyebrow">Kiến thức</div>
    <h2>Hiểu trước khi mua.</h2>
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

/* ============ 6 · CÁCH TEST — nền mực ============ */
function renderMethod() {
  $('#method').innerHTML = `
    <div class="eyebrow">Minh bạch</div>
    <h2>Cách chúng tôi test.</h2>
    <p class="lead">Công bố trước khi mở gói hàng — khoá lại, không sửa.</p>
    <ol class="steps">${QUY_TRINH.map(x => `<li><span>${x}</span></li>`).join('')}</ol>
    <div class="gallery">
      <figure><img src="assets/img/p1-farm.jpg" alt="Quả cà phê chín trên cành" loading="lazy"><figcaption>Vùng trồng — quả chín</figcaption></figure>
      <figure><img src="assets/img/p2-grind.jpg" alt="Cà phê vừa xay" loading="lazy"><figcaption>Cùng cỡ xay</figcaption></figure>
      <figure><img src="assets/img/p3-cup.jpg" alt="Dàn mẫu nếm mù" loading="lazy"><figcaption>Che nhãn</figcaption></figure>
      <figure><img src="assets/img/p4-taste.jpg" alt="Chấm điểm bằng thìa cupping" loading="lazy"><figcaption>Chấm điểm</figcaption></figure>
    </div>
    <div class="method-notes">
      <p><b>Vì sao điểm số đáng tin:</b> nó là hệ quả của một quy trình ai cũng kiểm chứng lại được —
      cùng cỡ xay, cùng tỷ lệ, cùng nhiệt độ, nếm mù. Thẩm quyền đến từ phương pháp, không từ lời khen.</p>
      <p><b>Về hoa hồng:</b> chúng tôi nhận hoa hồng tiếp thị liên kết nếu bạn mua qua link trên trang —
      bạn không trả thêm đồng nào. Link có ở cả sản phẩm chúng tôi khuyên cân nhắc,
      nên không có lý do gì để khen sai. Gói nào chưa nếm, trang ghi rõ <b>“Chưa nếm”</b>.</p>
    </div>
    ${typeof FAQ !== 'undefined' && FAQ.length ? `
    <div class="faq">
      ${FAQ.map((f, i) => `
      <details class="faq-i"${i === 0 ? ' open' : ''}>
        <summary>${f.q}</summary>
        <p>${f.a}</p>
      </details>`).join('')}
    </div>` : ''}`;
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  $('#logo').innerHTML = SITE.ten.replace(/\s(.+)/, ' <span>$1</span>');
  $('#tagline').textContent = SITE.tagline;
  renderTop(); renderPick(); renderMatrix(); renderPeak(); renderReviews(); renderAtmos(); renderKienThuc(); renderMethod();

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    };
  });
});
