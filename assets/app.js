/* ============================================================
   APP.JS — ENGINE · GU CÀ PHÊ
   Đọc data.js → tự sinh mọi trang.
   Giọng thương hiệu: curator có gu — ít chữ, chắc, không hô hào.
   ============================================================ */
/* Bật :active trên iOS (Safari chỉ áp :active khi trang có listener touch) */
try{window.addEventListener('touchstart',function(){},{passive:true});}catch(e){}

const $ = s => document.querySelector(s);
const money   = n => n.toLocaleString('vi-VN') + '₫';
const per100  = p => p.gram ? Math.round(p.gia / p.gram * 100) : null;
const get     = id => SP.find(x => x.id === id);
const PHA_TEN = { phin:'Phin', v60:'V60 / Pour over', coldbrew:'Cold brew' };
const reviewUrl = p => p && p.slug ? `/review/${p.slug}` : null;

/* ============ ĐO LƯỜNG — FUNNEL QUYẾT ĐỊNH ============
   Tự bật khi SITE.ga4 có Measurement ID. Nếu trống thì im lặng,
   trang chạy y nguyên. Mọi sự kiện cũng đẩy vào dataLayer (sẵn cho GTM). */
(function initGA() {
  const id = (typeof SITE !== 'undefined' && SITE.ga4) ? SITE.ga4.trim() : '';
  window.dataLayer = window.dataLayer || [];
  if (!id) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
})();
function track(ev, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', ev, params || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: ev }, params || {}));
  } catch (e) {}
}

/* ---- Affiliate click — sự kiện tiền + mở sàn (mặc định Shopee, sẵn cho Lazada/Tiki) ---- */
let CLICK = 0;
const CHANNELS = { shopee: 'link', lazada: 'lazada', tiki: 'tiki' };
function aff(id, channel, pos) {
  CLICK++;
  const p = get(id); if (!p) return;
  channel = channel || 'shopee';
  const url = p[CHANNELS[channel] || 'link'];
  track('affiliate_click', {
    item_id: id, item_brand: p.brand, item_name: p.ten,
    price: p.gia, per100: per100(p), value: p.gia, currency: 'VND',
    channel, tested: p.tested ? 1 : 0, position: pos || 'unknown'
  });
  if (url && url !== '#') window.open(url, '_blank', 'noopener');
}

/* ---- Nhãn nút mua theo nơi bán thật (Shopee vs trang chính hãng) ---- */
const isShopee = p => /shopee\./i.test(p.link || '');
const buyLabel = p => isShopee(p) ? 'Mua trên Shopee' : 'Mua chính hãng';

/* ---- Nút mua: hiện giá ngay trên nút (neo giá) + kênh phụ nếu có link ---- */
function buyCTA(p, pos, label) {
  const ch = isShopee(p) ? 'shopee' : 'brand';
  const main = `<button class="cta" onclick="aff('${p.id}','${ch}','${pos}')">${label || buyLabel(p)} · ${money(p.gia)}</button>`;
  const alts = [];
  if (p.lazada) alts.push(`<button class="cta-alt" onclick="aff('${p.id}','lazada','${pos}')">Lazada</button>`);
  if (p.tiki)   alts.push(`<button class="cta-alt" onclick="aff('${p.id}','tiki','${pos}')">Tiki</button>`);
  return main + (alts.length ? `<div class="cta-alts"><span>Hoặc:</span>${alts.join('')}</div>` : '');
}

/* ---- Nhãn minh bạch — không emoji, không bao giờ ghi sai ---- */
const nhan = p => p.tested
  ? '<span class="tag tag-t">Đã nếm mù</span>'
  : (p.daUong ? '<span class="tag tag-tasted">Đã uống</span>' : '<span class="tag tag-u">Chưa nếm</span>');

/* ---- Expert cues: vùng · giống · sơ chế · rang — tín hiệu chuyên môn ---- */
const cues = p => {
  const bits = [p.xaHuyen, p.giong, p.process, p.roast ? 'Rang ' + p.roast.toLowerCase() : null]
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
  $('#top').innerHTML = `
    <div class="hero-stage">
      <picture class="hero-bg">
        <source media="(min-width:861px)" srcset="assets/img/hero/brew-wide.jpg">
        <img src="assets/img/hero/pour.jpg" alt="Cà phê đặc sản Lâm Đồng — pha thủ công" fetchpriority="high">
      </picture>
      <div class="hero-scrim"></div>
      <div class="hero-inner">
        <div class="hero-eyebrow">Cà phê đặc sản · Lâm Đồng</div>
        <h1>Chưa uống<br>thì không chấm</h1>
        <div class="hero-sign">Mua thật · Nếm mù · Chấm điểm</div>
        <p class="hero-note"><b>Nếm mù</b> = uống thử che nhãn, che giá — để chấm cho công bằng.</p>
        <div class="hero-cta-row">
          <button class="cta" onclick="document.querySelector('#pick').scrollIntoView({behavior:'smooth'})">Chọn đúng gu trong 15 giây</button>
          <button class="cta-ghost" onclick="location.href='/cach-test'">Phương pháp đánh giá</button>
        </div>
      </div>
    </div>
    <div class="hero-proof">
      <div class="wrap hero-proof-in">
        <span class="hp-item">Không nhận bài tài trợ</span>
        <a class="hp-newbie" href="/bat-dau">Mới uống cà phê? Bắt đầu →</a>
      </div>
    </div>`;
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
  { k:'dam',     label:'Đậm, chocolate',       sub:'Đậm đà, đầy miệng, ít chua' }
];
const TLAB = {}; TASTES.forEach(t => TLAB[t.k] = t.label);
const BLAB = {}; INTENTS.forEach(t => BLAB[t.k] = t.label.replace(/\s·.*/, ''));

/* Ước lượng gu vị từ thuộc tính KHÁCH QUAN (độ rang · giống · sơ chế) —
   CHỈ dùng để XẾP HẠNG gợi ý, KHÔNG bao giờ hiển thị như điểm cảm quan.
   Gói đã nếm mù có chua/đậm THẬT thì luôn ưu tiên số thật; gói chưa nếm thì
   suy ra khuynh hướng vị để không gợi ý ngược gu (vd Robusta rang đậm cho
   người thích 'chua sáng'). Đây là ước lượng để sắp xếp, không phải điểm chấm. */
function estTaste(p) {
  if (p.chua != null && p.dam != null) return { chua: p.chua, dam: p.dam };
  let c = 3, d = 3;
  const roast = (p.roast || '').toLowerCase();
  const giong = (p.giong || '').toLowerCase();
  const proc  = (p.process || '').toLowerCase();
  if (/light|sáng/.test(roast))       { c += 1.2; d -= 0.6; }
  else if (/dark|đậm/.test(roast))    { c -= 1.2; d += 1.2; }
  else if (/medium/.test(roast))      { d += 0.3; }
  if (/robusta/.test(giong))          { c -= 1.6; d += 1.6; }
  else if (/arabica|bourbon|catimor|caturra|typica|heirloom|pacamara|cherry/.test(giong)) { c += 0.3; }
  if (/natural/.test(proc))           { d += 0.5; c -= 0.2; }
  else if (/washed/.test(proc))       { c += 0.4; }
  const clamp = x => Math.max(1, Math.min(5, x));
  return { chua: p.chua != null ? p.chua : clamp(c), dam: p.dam != null ? p.dam : clamp(d) };
}
const ec = p => estTaste(p).chua;
const ed = p => estTaste(p).dam;

/* Điểm hợp = gu vị (chua/đậm thật hoặc ước lượng khách quan) + cách pha + độ tin cậy.
   Gu vị được ưu tiên hơn cách pha — không gợi ý gói ngược gu chỉ vì trùng cách pha. */
function fit(p, taste, brew) {
  const { chua, dam } = estTaste(p);
  let s = 0;
  if (taste === 'sang')    s += chua * 2 - dam * 0.6;
  if (taste === 'canbang') s += 6 - (Math.abs(chua - 3) + Math.abs(dam - 3));
  if (taste === 'dam')     s += dam * 2 - chua * 0.6;
  if (taste === 'moi')     s += (p.tested ? 4 : 0) + (6 - (Math.abs(chua - 3) + Math.abs(dam - 3))) + p.pha.length;
  const it = INTENTS.find(x => x.k === brew);
  if (brew && it && it.match(p)) s += 2.5;
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
  { k:'bright', label:'Chua sáng hơn',say:'chua sáng, trái cây hơn', better:(p,c)=>ec(p) > ec(c),  rk:(a,b)=>ec(b)-ec(a) },
  { k:'bold',   label:'Đậm hơn',      say:'đậm đà, đầy miệng hơn',   better:(p,c)=>ed(p) > ed(c),  rk:(a,b)=>ed(b)-ed(a) },
  { k:'easy',   label:'Dễ uống hơn',  say:'nhẹ đô, dễ uống hơn', better:(p,c)=>ed(p) < ed(c),  rk:(a,b)=>ed(a)-ed(b) }
];
const availObj = cur => OBJ.filter(o => SP.some(p => p.id !== cur.id && o.better(p, cur)));
function resolveObj(o, cur) {
  return SP.filter(p => p.id !== cur.id && o.better(p, cur))
    .sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0) || o.rk(a, b))[0];
}

/* ---- COGNITIVE COMPRESSION: một câu chốt trước, con số ở dưới ---- */
function verdict(p, taste) {
  if (!(p.tested && p.diem != null))
    return p.daUong
      ? `Gói hợp cách pha của bạn nhất — chúng tôi đã uống thật và thấy ngon; chưa chấm mù nên chưa gắn số.`
      : `Gói hợp cách pha của bạn nhất — chúng tôi chưa thử, nên ghi rõ để bạn cân nhắc.`;
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
    return p.daUong
      ? (p.chungNhan ? `<b>Đã uống thật</b> — ${p.chungNhan}. Chưa chấm mù nên chưa gắn số.` : `<b>Đã uống thật</b>, thấy ngon — chưa chấm mù nên chưa gắn số.`)
      : `Chúng tôi <b>chưa thử</b> gói này — thông số từ nhà bán, trang ghi rõ.`;
  const top = Math.max(...t.map(x => x.diem));
  const maxChua = Math.max(...t.map(x => x.chua || 0));
  const maxDam  = Math.max(...t.map(x => x.dam  || 0));
  const cheap = t.slice().sort((a, b) => per100(a) - per100(b))[0];
  // Điểm & giá là tín hiệu trung lập với gu — luôn được phép nói
  if (p.diem === top && t.length > 1) return `<b>Điểm cao nhất</b> trong ${t.length} gói chúng tôi đã nếm mù.`;
  // Điểm mạnh về vị: chỉ nói khi khớp gu vừa chọn
  if (taste === 'sang' && p.chua === maxChua && maxChua >= 4) return `Gói <b>chua sáng, thiên trái cây</b> rõ nhất trong nhóm đã nếm — đúng gu bạn.`;
  if (taste === 'dam'  && p.dam  === maxDam  && maxDam  >= 4) return `Gói <b>đậm đà, đầy miệng</b> nhất trong nhóm đã nếm — đúng gu bạn.`;
  if (cheap && p.id === cheap.id)         return `<b>Rẻ nhất tính theo 100g</b> trong nhóm đã nếm — an toàn để bắt đầu.`;
  return `Đã nếm mù, chấm <b>${p.diem}/10</b> — cân bằng, không điểm trừ đáng kể.`;
}

let TASTE = null, BREW = null, CURID = null, NEGO = null;
try { TASTE = localStorage.getItem('gu_taste'); BREW = localStorage.getItem('gu_brew'); } catch (e) {}
const memPick = () => { try { return get(localStorage.getItem('gu_pick')); } catch (e) { return null; } };

function renderPick() {
  const back = TASTE || BREW;
  $('#pick').innerHTML = `
    <div class="decide-panel">
      <div class="decide-head">
        <div class="decide-kicker">Gợi ý riêng</div>
        <h2 class="decide-title">Chọn giúp bạn</h2>
        <p class="decide-lead">Cho chúng tôi biết gu của bạn — chúng tôi chốt một gói hợp nhất.</p>
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

      <div id="decide-out"></div>
    </div>`;
  if (TASTE) drawRec();
}

function deTaste(k) {
  TASTE = k; CURID = null; NEGO = null; track('taste_select', { taste: k });
  try { localStorage.setItem('gu_taste', k); } catch (e) {}
  document.querySelectorAll('.de-taste .dchip').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  const skip = document.querySelector('.de-skip'); if (skip) skip.classList.toggle('on', k === 'moi');
  const s2 = document.querySelector('.de-step2'); if (s2) s2.classList.add('show');
  drawRec();
}
function deBrew(k) {
  BREW = k; CURID = null; NEGO = null; track('brew_select', { brew: k });
  try { localStorage.setItem('gu_brew', k); } catch (e) {}
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
  track('negotiate', { objection: k, from: cur.id, to: next.id });
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
  track('recommendation_shown', {
    item_id: best.id, item_name: best.ten, taste: TASTE, brew: BREW || null,
    negotiated: CURID ? 1 : 0, tested: best.tested ? 1 : 0, score: best.diem
  });
  const tlabel = TASTE === 'moi' ? 'người mới bắt đầu' : (TLAB[TASTE] || 'mọi vị');
  const speak = NEGO
    ? `Bạn muốn <b>${NEGO}</b> → vậy gói này`
    : `${TASTE === 'moi' ? 'Dành cho' : 'Thích'} <b>${tlabel}</b>${BREW ? ` · pha <b>${BLAB[BREW]}</b>` : ''} → chúng tôi chọn`;
  const objs = availObj(best);
  const src = best.anh ? (/^https?:/.test(best.anh) ? best.anh : best.anh) : '';
  const badge = (best.tested && best.diem != null)
    ? `<span class="rec-badge rec-badge-score">${best.diem}<i>/10</i></span>`
    : (best.daUong ? `<span class="rec-badge rec-badge-tasted">Đã uống</span>` : `<span class="rec-badge rec-badge-ut">Chưa nếm</span>`);
  const media = src
    ? `<img src="${src}" alt="${best.brand} — ${best.ten}">`
    : `<div class="rec-photo-gen" style="background:${ROAST_BG[best.roast] || '#8A6A44'}"></div>`;
  out.innerHTML = `
    <div class="rec">
      <div class="rec-head">
        <span class="rec-tag">Gợi ý cho bạn</span>
        <span class="rec-intent">${speak}</span>
        ${CURID ? `<button class="rec-undo" onclick="deBase()">↺ về gói gợi ý</button>` : ''}
      </div>
      <div class="rec-card">
        <a class="rec-photo" href="${reviewUrl(best)}">${media}${badge}</a>
        <div class="rec-detail">
          <div class="rec-brand">${best.brand}${best.chungNhan && !(best.tested && best.diem != null) ? ` · <span class="rec-cred">${best.chungNhan}</span>` : ''}</div>
          <a class="rec-name" href="${reviewUrl(best)}">${best.ten}</a>
          <p class="rec-verdict">${verdict(best, TASTE)}</p>
          <div class="rec-cues">${cues(best)}</div>
          <div class="rec-priceline">
            <div class="rec-price">${money(best.gia)}<span>${money(per100(best))} / 100g · ${best.gram}g</span></div>
          </div>
          <div class="rec-actions">
            ${buyCTA(best, 'rec')}
            ${reviewUrl(best) ? `<a class="rec-review-link" href="${reviewUrl(best)}">Đọc review đầy đủ →</a>` : ''}
          </div>
        </div>
      </div>
      <div class="rec-more">
        <div class="rec-more-col rec-more-y"><h5>Hợp nếu</h5><ul>${best.nen.slice(0, 2).map(x => `<li>${x}</li>`).join('')}</ul></div>
        ${best.khong && best.khong.length ? `<div class="rec-more-col rec-more-n"><h5>Cân nhắc nếu</h5><ul><li>${best.khong[0]}</li></ul></div>` : ''}
      </div>
      ${objs.length ? `
      <div class="nego">
        <span class="nego-l">${CURID ? 'Vẫn chưa ưng?' : 'Chưa đúng gu?'} Đổi nhanh:</span>
        ${objs.map(o => `<button class="nego-chip" onclick="deObj('${o.k}')">${o.label}</button>`).join('')}
      </div>` : `<div class="nego"><span class="nego-l">Đây là gói khớp gu bạn nhất trong danh mục hiện tại.</span></div>`}
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
          ${reviewUrl(p) ? `<a class="mx-review" href="${reviewUrl(p)}">Đọc review →</a>` : ''}
        </div>
        <div class="mx-per">${per100(p) ? money(per100(p)) : '—'}<small>${money(p.gia)} / ${p.gram}g</small></div>
        <div class="mx-score">${p.diem != null ? p.diem : '<span class="ut">Chưa nếm</span>'}</div>
        <div class="mx-act"><button class="cta" onclick="aff('${p.id}','shopee','matrix')">Mua →</button></div>
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
  const el = $('#atmos'); if (el) el.innerHTML = '';
}

/* ============ PEAK — tuyên ngôn trên ảnh, phá nhịp ============ */
function renderPeak() {
  $('#peak').innerHTML = `
    <img class="peak-bg" src="assets/img/band-life.jpg" alt="Pha pour over cà phê đặc sản" loading="lazy">
    <div class="peak-scrim"></div>
    <div class="peak-in">
      <div class="peak-kicker">Độc lập biên tập</div>
      <p class="peak-setup">Không có bài viết tài trợ.<br>Không có điểm số cho thứ chúng tôi</p>
      <p class="peak-punch">chưa bỏ vào miệng</p>
    </div>`;
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
            ${buyCTA(p, 'review')}
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
          ${reviewUrl(p) ? `<a class="rv-full-link" href="${reviewUrl(p)}">Trang review đầy đủ của ${p.brand} · ${p.ten} →</a>` : ''}
        </div>
      </div>`).join('')}
    </div>`;
}

/* ============ VÙNG TRỒNG — hub cà phê Lâm Đồng (Cầu Đất · Nam Ban) ============ */
function regionUrl(v) { return `/vung-trong/${v.slug}`; }
function renderVung() {
  if (typeof VUNG === 'undefined' || !VUNG.length) return;
  $('#vungtrong').innerHTML = `
    <div class="eyebrow">Vùng trồng</div>
    <h2>Cà phê Lâm Đồng.</h2>
    <p class="lead">Gần như toàn bộ Arabica đặc sản Việt Nam đến từ cao nguyên này.
    Mỗi tiểu vùng — <b>Cầu Đất</b>, <b>Nam Ban</b>, Lạc Dương — cho một chất vị riêng.
    Hiểu vùng trồng để chọn đúng gu, không chọn theo bao bì.</p>
    <div class="vg-grid">
      ${VUNG.map(v => `
      <a class="vg-card${v.hub ? ' vg-hub' : ''}" href="${regionUrl(v)}">
        <div class="vg-card-top">
          <div class="vg-card-name">${v.ten}</div>
          ${v.hub ? '<span class="vg-badge">Tổng quan</span>' : ''}
        </div>
        <div class="vg-card-tag">${v.tagline}</div>
        <div class="vg-card-meta">${[v.doCao, v.giong].filter(Boolean).join('<i>·</i>')}</div>
        <span class="vg-card-go">Tìm hiểu →</span>
      </a>`).join('')}
    </div>`;
}

/* ============ HUB ROUTER — trang chủ chỉ dẫn đường, không dump ============ */
function renderHubs() {
  const el = $('#hubs'); if (!el) return;
  const best = SP.filter(p => p.tested && p.diem != null).sort((a, b) => b.diem - a.diem)[0];
  const nBai = (typeof BAIVIET !== 'undefined') ? BAIVIET.length : 0;
  const hubs = [
    { href:'/ca-phe',    k:'Cà phê',     img:'assets/img/p3-cup.jpg',                 alt:'Bộ mẫu cà phê đặc sản', d:'Danh mục gói đặc sản — đã nếm mù, chấm điểm, quy giá về 100g.', m:'Đã nếm mù · đã uống thật', go:'Xem tất cả →' },
    { href:'/nha-rang',  k:'Nhà rang',   img:'assets/img/products/hand-beans.jpg',    alt:'Hạt cà phê vừa rang', d:'Hồ sơ các nhà rang Lâm Đồng chúng tôi chọn đồng hành, xếp theo vùng nguyên liệu.', m:'Chọn lọc · thực địa', go:'Xem hồ sơ →' },
    { href:'/vung-trong',k:'Vùng trồng', img:'assets/img/regions/cau-dat.jpg',        alt:'Quả cà phê chín trên cây', d:'Cầu Đất · Lạc Dương · Nam Ban — mỗi vùng một chất vị.', m:'Tiểu vùng Lâm Đồng', go:'Tìm hiểu →' },
    { href:'/kien-thuc', k:'Kiến thức',  img:'assets/img/products/beans-tin.jpg',     alt:'Ghi chú nếm thử cà phê', d:'Natural/Washed, độ rang, specialty đắt ở đâu — đọc trước khi mua.', m:'Đọc trước khi mua', go:'Đọc →' }
  ];
  el.innerHTML = `
    <div class="eyebrow">Khám phá</div>
    <h2>Đi thẳng vào thứ bạn cần.</h2>
    <p class="lead">Mọi thứ được sắp theo đúng nhu cầu.</p>
    <div class="home-hubs">
      ${hubs.map(h => `
      <a class="home-hub" href="${h.href}">
        <div class="home-hub-img"><img src="${h.img}" alt="${h.alt}" loading="lazy"></div>
        <div class="home-hub-body">
          <div class="home-hub-k">${h.k}</div>
          <div class="home-hub-d">${h.d}</div>
          <div class="home-hub-meta">${h.m}</div>
          <span class="home-hub-go">${h.go}</span>
        </div>
      </a>`).join('')}
    </div>`;
}

/* ============ NHÀ RANG — 6 nhà cà phê xịn nhất Lâm Đồng ============ */
function roasterUrl(r) { return `/nha-rang/${r.slug}`; }
function roasterAvg(r) {
  const t = (r.sanPham || []).map(id => get(id)).filter(p => p && p.tested && p.diem != null);
  if (!t.length) return null;
  return Math.round(t.reduce((s, p) => s + p.diem, 0) / t.length * 10) / 10;
}
function renderRoaster() {
  if (typeof ROASTER === 'undefined' || !ROASTER.length) return;
  $('#nharang').innerHTML = `
    <div class="eyebrow">Nhà rang</div>
    <h2>6 nhà cà phê xịn nhất Lâm Đồng.</h2>
    <p class="lead">Chúng tôi không dàn trải. Chọn ra 6 nhà đại diện cho các vùng nguyên liệu —
    mỗi nhà một hồ sơ: vùng, sản phẩm đã nếm, điểm và link chính thức.</p>
    <div class="vg-grid">
      ${ROASTER.map(r => {
        const avg = roasterAvg(r);
        return `
      <a class="vg-card" href="${roasterUrl(r)}">
        <div class="vg-card-top">
          <div class="vg-card-name">${r.ten}</div>
          ${avg != null ? `<span class="vg-badge">${avg}/10</span>` : ''}
        </div>
        <div class="vg-card-tag">${r.gioiThieu}</div>
        <div class="vg-card-meta">Vùng: ${r.vungChinh}</div>
        <span class="vg-card-go">Xem hồ sơ →</span>
      </a>`;
      }).join('')}
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
  // Logo giờ là markup tĩnh (bean + wordmark) trong index.html — không ghi đè.
  $('#tagline').textContent = SITE.tagline;
  renderTop(); renderPick(); renderHubs(); renderPeak(); renderAtmos();

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    };
  });
});
