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

/* ============ 2 · DECISION ENGINE v2 — dẫn dắt, không chỉ trả lời ============
   Intent (gu vị) → Context (cách pha) → chọn 1 gói + VÌ SAO hợp bạn
   + điều bạn có thể chưa thích + nếu không hợp thì thử gói khác.
   Ghi nhớ lựa chọn bằng localStorage (adaptive, không cần login).
   Gu vị chấm trên dữ liệu chua/đậm thật của từng gói — không bịa. */
const INTENTS = [
  { k:'phin',     label:'Phin',           sub:'Pha phin truyền thống', match:p => p.pha.includes('phin') },
  { k:'v60',      label:'V60 · Pour over',sub:'Rót tay, giấy lọc',      match:p => p.pha.includes('v60') },
  { k:'espresso', label:'Máy · Espresso', sub:'Espresso, latte',        match:p => /dark/i.test(p.roast||'') || p.pha.includes('espresso') },
  { k:'coldbrew', label:'Cold brew',      sub:'Ủ lạnh, uống mát',       match:p => p.pha.includes('coldbrew') }
];
const TASTES = [
  { k:'sang',    label:'Chua sáng, trái cây', sub:'Floral, cam chanh, mọng nước' },
  { k:'canbang', label:'Cân bằng, dễ uống',   sub:'Không quá chua, không gắt' },
  { k:'dam',     label:'Đậm, chocolate',       sub:'Thân dày, ít chua' }
];
const TLAB = {}; TASTES.forEach(t => TLAB[t.k] = t.label);
const BLAB = {}; INTENTS.forEach(t => BLAB[t.k] = t.label.replace(/\s·.*/, ''));

/* Điểm hợp = gu vị (dữ liệu chua/đậm) + cách pha + độ tin cậy (đã nếm) */
function fit(p, taste, brew) {
  const chua = p.chua || 3, dam = p.dam || 3;
  let s = 0;
  if (taste === 'sang')    s += chua * 2 - dam * 0.6;
  if (taste === 'canbang') s += 6 - (Math.abs(chua - 3) + Math.abs(dam - 3));
  if (taste === 'dam')     s += dam * 2 - chua * 0.6;
  if (taste === 'moi')     s += (p.tested ? 4 : 0) + (6 - (Math.abs(chua - 3) + Math.abs(dam - 3))) + p.pha.length;
  const it = INTENTS.find(x => x.k === brew);
  if (brew && it && it.match(p)) s += 4;
  s += p.tested ? 1.5 : 0;
  return s;
}
const rank = (taste, brew) => SP
  .map(p => ({ p, s: fit(p, taste, brew) }))
  .sort((a, b) => b.s - a.s || (b.p.diem || 0) - (a.p.diem || 0));

/* ---- NEGOTIATION: recommendation là đối thoại, không phải output cố định.
   Mỗi phản đối ("đắt quá", "muốn đậm hơn") chỉ hiện khi CÓ gói tốt hơn theo trục đó. ---- */
const OBJ = [
  { k:'cheap',  label:'Đắt quá',      say:'rẻ hơn',              better:(p,c)=>per100(p) && per100(p) < per100(c), rk:(a,b)=>per100(a)-per100(b) },
  { k:'bright', label:'Chua sáng hơn',say:'chua sáng, trái cây hơn', better:(p,c)=>(p.chua||3) > (c.chua||3),  rk:(a,b)=>(b.chua||3)-(a.chua||3) },
  { k:'bold',   label:'Đậm hơn',      say:'đậm, dày thân hơn',   better:(p,c)=>(p.dam||3) > (c.dam||3),        rk:(a,b)=>(b.dam||3)-(a.dam||3) },
  { k:'easy',   label:'Nhẹ đô hơn',   say:'nhẹ đô, dễ uống hơn', better:(p,c)=>(p.dam||3) < (c.dam||3),        rk:(a,b)=>(a.dam||3)-(b.dam||3) }
];
const availObj = cur => OBJ.filter(o => SP.some(p => p.id !== cur.id && o.better(p, cur)));
function resolveObj(o, cur) {
  return SP.filter(p => p.id !== cur.id && o.better(p, cur))
    .sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0) || o.rk(a, b))[0];
}

/* ---- COGNITIVE COMPRESSION: một câu chốt trước, con số ở dưới ---- */
function verdict(p, taste) {
  if (!(p.tested && p.diem != null))
    return `Gói hợp cách pha của bạn nhất — chúng tôi chưa nếm mù, nên ghi rõ để bạn cân nhắc.`;
  if (taste === 'moi')
    return `Nếu đây là ly specialty đầu tiên của bạn, gần như không thể chọn sai gói này.`;
  const top = Math.max(...SP.filter(x => x.tested && x.diem != null).map(x => x.diem));
  if (p.diem === top)
    return `Trong tất cả gói chúng tôi đã nếm mù, đây là gói bạn khó thất vọng nhất.`;
  return `Hợp gu bạn và an toàn — rất khó để hối tiếc khi bắt đầu bằng gói này.`;
}

/* Dòng tin cậy — chỉ nói sự thật rút từ dữ liệu, KHÔNG khoe điểm mạnh
   trái với gu người dùng vừa chọn (vd đừng khoe "đậm nhất" cho người thích chua sáng). */
function confLine(p, taste) {
  const t = SP.filter(x => x.tested && x.diem != null);
  if (!(p.tested && p.diem != null))
    return `Chúng tôi <b>chưa nếm mù</b> gói này — thông số từ nhà bán, trang ghi rõ.`;
  const top = Math.max(...t.map(x => x.diem));
  const maxChua = Math.max(...t.map(x => x.chua || 0));
  const maxDam  = Math.max(...t.map(x => x.dam  || 0));
  const cheap = t.slice().sort((a, b) => per100(a) - per100(b))[0];
  // Điểm & giá là tín hiệu trung lập với gu — luôn được phép nói
  if (p.diem === top && t.length > 1) return `<b>Điểm cao nhất</b> trong ${t.length} gói chúng tôi đã nếm mù.`;
  // Điểm mạnh về vị: chỉ nói khi khớp gu vừa chọn
  if (taste === 'sang' && p.chua === maxChua && maxChua >= 4) return `Gói <b>chua sáng, thiên trái cây</b> rõ nhất trong nhóm đã nếm — đúng gu bạn.`;
  if (taste === 'dam'  && p.dam  === maxDam  && maxDam  >= 4) return `Gói <b>đậm, dày thân</b> nhất trong nhóm đã nếm — đúng gu bạn.`;
  if (cheap && p.id === cheap.id)         return `<b>Rẻ nhất tính theo 100g</b> trong nhóm đã nếm — an toàn để bắt đầu.`;
  return `Đã nếm mù, chấm <b>${p.diem}/10</b> — cân bằng, không điểm trừ đáng kể.`;
}

let TASTE = null, BREW = null, CURID = null, NEGO = null;
try { TASTE = localStorage.getItem('gu_taste'); BREW = localStorage.getItem('gu_brew'); } catch (e) {}
const memPick = () => { try { return get(localStorage.getItem('gu_pick')); } catch (e) { return null; } };

function renderPick() {
  const back = TASTE || BREW;
  $('#pick').innerHTML = `
    <div class="decide-head">
      <div class="eyebrow">Chọn giúp bạn</div>
      <h2>Đừng chọn một mình.<br>Trả lời hai câu, chúng tôi chốt.</h2>
      <p class="decide-lead">Chúng tôi không đưa bạn cả bảng rồi để bạn tự đoán. Nói gu của bạn —
      chúng tôi loại bớt, chọn một, và nói thẳng <b>vì sao hợp bạn</b> (và chỗ nào có thể chưa).</p>
      ${back ? `<div class="decide-back">${memPick() ? `Lần trước bạn dừng ở <b>${memPick().brand} · ${memPick().ten}</b>. Vẫn vậy chứ?` : `Lần trước bạn chọn <b>${TLAB[TASTE] || 'chưa rõ gu'}</b>${BREW ? ` · <b>${BLAB[BREW]}</b>` : ''}. Vẫn vậy chứ?`}
        <button class="decide-reset" onclick="deReset()">Chọn lại từ đầu</button></div>` : ''}
    </div>

    <div class="de-step">
      <div class="de-q"><span class="de-n">1</span> Bạn thích ly cà phê thế nào?</div>
      <div class="decide-chips de-taste">
        ${TASTES.map(t => `<button class="dchip${t.k === TASTE ? ' on' : ''}" data-k="${t.k}" onclick="deTaste('${t.k}')"><b>${t.label}</b><span>${t.sub}</span></button>`).join('')}
      </div>
      <button class="de-skip${TASTE === 'moi' ? ' on' : ''}" onclick="deTaste('moi')">Chưa rõ gu của mình — cứ chọn giúp tôi →</button>
    </div>

    <div class="de-step de-step2${TASTE ? ' show' : ''}">
      <div class="de-q"><span class="de-n">2</span> Bạn pha bằng gì?</div>
      <div class="decide-chips de-brew">
        ${INTENTS.map(it => `<button class="dchip${it.k === BREW ? ' on' : ''}" data-k="${it.k}" onclick="deBrew('${it.k}')"><b>${it.label}</b><span>${it.sub}</span></button>`).join('')}
      </div>
    </div>

    <div id="decide-out"></div>`;
  if (TASTE) drawRec();
}

function deTaste(k) {
  TASTE = k; CURID = null; NEGO = null; try { localStorage.setItem('gu_taste', k); } catch (e) {}
  document.querySelectorAll('.de-taste .dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  const skip = document.querySelector('.de-skip'); if (skip) skip.classList.toggle('on', k === 'moi');
  const s2 = document.querySelector('.de-step2'); if (s2) s2.classList.add('show');
  drawRec();
}
function deBrew(k) {
  BREW = k; CURID = null; NEGO = null; try { localStorage.setItem('gu_brew', k); } catch (e) {}
  document.querySelectorAll('.de-brew .dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  drawRec();
  const out = document.getElementById('decide-out');
  if (out) out.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deReset() {
  TASTE = null; BREW = null; CURID = null; NEGO = null;
  try { localStorage.removeItem('gu_taste'); localStorage.removeItem('gu_brew'); localStorage.removeItem('gu_pick'); } catch (e) {}
  renderPick(); $('#pick').scrollIntoView({ behavior: 'smooth' });
}
/* Đàm phán: người dùng phản đối → đổi gói theo trục đó */
function deObj(k) {
  const cur = CURID ? get(CURID) : rank(TASTE, BREW)[0].p;
  const o = OBJ.find(x => x.k === k); if (!o) return;
  const next = resolveObj(o, cur); if (!next) return;
  CURID = next.id; NEGO = o.say; drawRec();
  const out = document.getElementById('decide-out');
  if (out) out.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deBase() { CURID = null; NEGO = null; drawRec(); }

function drawRec() {
  const out = document.getElementById('decide-out'); if (!out) return;
  const base = rank(TASTE, BREW)[0].p;
  const best = CURID ? (get(CURID) || base) : base;
  try { localStorage.setItem('gu_pick', best.id); } catch (e) {}
  const tlabel = TASTE === 'moi' ? 'người mới bắt đầu' : (TLAB[TASTE] || 'mọi vị');
  const speak = NEGO
    ? `Bạn muốn <b>${NEGO}</b> → vậy gói này`
    : `${TASTE === 'moi' ? 'Dành cho' : 'Thích'} <b>${tlabel}</b>${BREW ? ` · pha <b>${BLAB[BREW]}</b>` : ''} → chúng tôi chọn`;
  const objs = availObj(best);
  out.innerHTML = `
    <div class="rec">
      <div class="pick-media">
        <img src="assets/img/hero.jpg" alt="Buổi nếm mù của Gu Cà Phê">
        <span class="pick-media-cap">Buổi nếm mù · 1:15 · 92°C</span>
      </div>
      <div class="pick-info">
        <div class="rec-intent">${speak}${CURID ? ` · <button class="rec-undo" onclick="deBase()">↺ về gói gợi ý</button>` : ''}</div>
        <div class="pick-brand">${best.brand}</div>
        <div class="pick-name">${best.ten}</div>
        <div class="rec-verdict">${verdict(best, TASTE)}</div>
        <div class="rec-conf">${confLine(best, TASTE)}</div>
        <div class="pick-notes">${(best.tested && best.notes && best.notes.length) ? best.notes.join(' · ') + '.' : best.flavor}</div>
        <div class="pick-cues">${cues(best)}</div>
        <div class="rec-why">
          <h4>Vì sao hợp bạn</h4>
          <ul class="pick-why">${best.nen.slice(0, 3).map(x => `<li><b>+</b> ${x}</li>`).join('')}</ul>
        </div>
        ${best.khong && best.khong.length ? `<div class="rec-warn"><h4>Điều bạn có thể chưa thích</h4><p>${best.khong[0]}</p></div>` : ''}
      </div>
      <div class="pick-side">
        ${best.tested && best.diem != null
          ? `<div class="pick-score">${best.diem}</div><div class="pick-score-l">Điểm nếm mù / 10</div>`
          : `<div class="rec-untested">Chưa nếm</div><div class="pick-score-l">Chưa chấm điểm</div>`}
        <div class="pick-price">${money(best.gia)}</div>
        <div class="pick-per">${money(per100(best))} / 100g · ${best.gram}g</div>
        <button class="cta" onclick="aff('${best.id}')">Xem giá trên Shopee</button>
        <div class="assure">
          <div><b>Chắc cỡ nào?</b><span>Nếm mù · cùng cỡ xay · 1:15 · 92°C</span></div>
          <div><b>Lỡ không hợp?</b><span>Đổi gu ngay bên dưới, không phải đọc lại từ đầu</span></div>
          <div><b>Gói ${best.gram}g</b><span>Đủ nhỏ để thử trước khi mua thêm</span></div>
        </div>
      </div>
    </div>
    ${objs.length ? `
    <div class="nego">
      <span class="nego-l">${CURID ? 'Vẫn chưa ưng?' : 'Chưa đúng gu của bạn?'} Nói cho chúng tôi:</span>
      ${objs.map(o => `<button class="nego-chip" onclick="deObj('${o.k}')">${o.label}</button>`).join('')}
    </div>` : `<div class="nego"><span class="nego-l">Đây đã là gói khớp gu bạn nhất trong danh mục hiện tại.</span></div>`}`;
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
