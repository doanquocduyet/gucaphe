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
      <button class="cta" onclick="document.querySelector('#pick').scrollIntoView({behavior:'smooth'})">Chọn giúp tôi trong 15 giây</button>
      <button class="cta-line" onclick="document.querySelector('#method').scrollIntoView({behavior:'smooth'})">Cách chúng tôi test</button>
    </div>
    <div class="proof">
      <div class="proof-i"><b>${nem}</b><span>Đã nếm mù</span></div>
      <div class="proof-i"><b>${chua}</b><span>Đang chờ nếm</span></div>
      <div class="proof-i"><b>0</b><span>Bài tài trợ</span></div>
    </div>
    <div class="proof-cap">Cập nhật ${SITE.capNhat} · con số thật, cập nhật theo từng mẻ mua.</div>`;
}

/* ============ 2 · DECISION ENGINE — hệ thống chọn giúp bạn ============
   Một câu hỏi (cách pha) quyết định câu trả lời. Hệ thống nghĩ trước,
   người dùng không phải đọc hết bảng. Recommendation-first, browse-second. */
const INTENTS = [
  { k:'phin',     label:'Phin',          sub:'Pha phin truyền thống', match:p => p.pha.includes('phin') },
  { k:'v60',      label:'V60 · Pour over',sub:'Rót tay, giấy lọc',     match:p => p.pha.includes('v60') },
  { k:'espresso', label:'Máy · Espresso', sub:'Espresso, latte',       match:p => /dark/i.test(p.roast||'') || p.pha.includes('espresso') },
  { k:'coldbrew', label:'Cold brew',      sub:'Ủ lạnh, uống mát',      match:p => p.pha.includes('coldbrew') }
];

const pickFor = it => {
  const pool = SP.filter(it.match);
  return (pool.length ? pool : SP).slice().sort((a, b) =>
    (b.tested ? 1 : 0) - (a.tested ? 1 : 0) ||
    (b.diem || 0) - (a.diem || 0) ||
    (per100(a) || 9e9) - (per100(b) || 9e9))[0];
};

/* Dòng lý do — chỉ nói sự thật rút từ dữ liệu, không cường điệu */
function confLine(p) {
  const t = SP.filter(x => x.tested && x.diem != null);
  if (!(p.tested && p.diem != null))
    return `Hợp cách pha của bạn nhất trong danh mục. Chúng tôi <b>chưa nếm mù</b> gói này — thông số lấy từ nhà bán, và trang ghi rõ.`;
  const top = Math.max(...t.map(x => x.diem));
  const maxChua = Math.max(...t.map(x => x.chua || 0));
  const maxDam  = Math.max(...t.map(x => x.dam  || 0));
  const cheap = t.slice().sort((a, b) => per100(a) - per100(b))[0];
  if (p.diem === top && t.length > 1) return `<b>Điểm cao nhất</b> trong ${t.length} gói chúng tôi đã nếm mù.`;
  if (p.chua === maxChua && maxChua >= 4) return `Gói <b>chua sáng, thiên trái cây</b> rõ nhất trong nhóm đã nếm.`;
  if (p.dam === maxDam && maxDam >= 4)    return `Gói <b>đậm, dày thân</b> nhất trong nhóm đã nếm.`;
  if (cheap && p.id === cheap.id)         return `<b>Rẻ nhất tính theo 100g</b> trong nhóm đã nếm.`;
  return `Đã nếm mù, chấm <b>${p.diem}/10</b> — cân bằng, không có điểm trừ đáng kể.`;
}

let DECIDE = 'v60';
function renderPick() {
  $('#pick').innerHTML = `
    <div class="decide-head">
      <div class="eyebrow">Chọn giúp bạn · 15 giây</div>
      <h2>Bạn pha bằng gì?<br>Chúng tôi lo phần còn lại.</h2>
      <p class="decide-lead">Cách pha quyết định gói nào hợp — chúng tôi đã nếm mù để trả lời sẵn.
      Bạn không phải đọc hết bảng. Chọn một, xem ngay gói nên mua.</p>
    </div>
    <div class="decide-chips">
      ${INTENTS.map(it => `<button class="dchip${it.k === DECIDE ? ' on' : ''}" data-k="${it.k}" onclick="decide('${it.k}')">
        <b>${it.label}</b><span>${it.sub}</span></button>`).join('')}
    </div>
    <div id="decide-out"></div>`;
  decide(DECIDE, true);
}

function decide(k, silent) {
  DECIDE = k;
  const it = INTENTS.find(x => x.k === k) || INTENTS[0];
  const p  = pickFor(it);
  if (!silent) document.querySelectorAll('.dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  const out = document.getElementById('decide-out');
  if (!out || !p) return;
  out.innerHTML = `
    <div class="rec">
      <div class="pick-media">
        <img src="assets/img/hero.jpg" alt="Buổi nếm mù của Gu Cà Phê">
        <span class="pick-media-cap">Buổi nếm mù · 1:15 · 92°C</span>
      </div>
      <div class="pick-info">
        <div class="rec-intent">Pha <b>${it.label.replace(/\s·.*/, '')}</b> → chúng tôi chọn</div>
        <div class="pick-brand">${p.brand}</div>
        <div class="pick-name">${p.ten}</div>
        <div class="rec-conf">${confLine(p)}</div>
        <div class="pick-notes">${(p.tested && p.notes && p.notes.length) ? p.notes.join(' · ') + '.' : p.flavor}</div>
        <div class="pick-cues">${cues(p)}</div>
        <ul class="pick-why">
          ${p.nen.slice(0, 3).map(x => `<li><b>+</b> ${x}</li>`).join('')}
        </ul>
      </div>
      <div class="pick-side">
        ${p.tested && p.diem != null
          ? `<div class="pick-score">${p.diem}</div><div class="pick-score-l">Điểm nếm mù / 10</div>`
          : `<div class="rec-untested">Chưa nếm</div><div class="pick-score-l">Chưa chấm điểm</div>`}
        <div class="pick-price">${money(p.gia)}</div>
        <div class="pick-per">${money(per100(p))} / 100g · ${p.gram}g</div>
        <button class="cta" onclick="aff('${p.id}')">Xem giá trên Shopee</button>
        <div class="cta-note"><a href="#matrix" onclick="event.preventDefault();document.querySelector('#matrix').scrollIntoView({behavior:'smooth'})">Hoặc xem cả ${SP.length} gói trong bảng →</a></div>
      </div>
    </div>`;
  const rec = out.firstElementChild;
  if (rec) { rec.classList.remove('in'); void rec.offsetWidth; rec.classList.add('in'); }
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
