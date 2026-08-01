/* ============ i18n — chuyển VI / EN toàn web (client-side) ============
   Mọi phần tử có [data-i18n] mang một "khoá" (chuỗi tiếng Việt).
   VI: khôi phục đúng HTML gốc (giữ <b>, <br>…). EN: dùng bản dịch trong DICT.
   Nội dung dài chưa có trong DICT → giữ nguyên tiếng Việt.
   Lưu lựa chọn ở localStorage; tự áp dụng lại khi trang chủ render động. */
(function () {
  var DICT = {
    /* ---- Điều hướng / footer ---- */
    "Nhà rang": "Roasters",
    "Cà phê": "Coffee",
    "Vùng trồng": "Regions",
    "Kiến thức": "Learn",
    "Cách test": "How we test",
    "Đóng": "Close",
    "Người mới bắt đầu? →": "New to coffee? →",
    "Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.": "We buy it, taste it blind, and score it — so you don't have to guess.",
    "Chúng tôi mua mọi sản phẩm bằng tiền của mình. Điểm số chỉ đến từ nếm mù (che nhãn, che giá); gói đã uống nhưng chưa chấm mù thì ghi rõ “Đã uống”, không gắn số. Link trên trang là link tiếp thị liên kết — bạn không trả thêm đồng nào, và link có ở cả sản phẩm chúng tôi khuyên cân nhắc.": "We buy every product with our own money. Scores come only from blind tasting (labels and prices hidden); a pack we've drunk but not yet cupped blind is marked “Tasted”, with no score. Links on this site are affiliate links — you pay nothing extra, and links appear on packs we advise caution about too.",
    "Chúng tôi mua mọi sản phẩm bằng tiền của mình và nếm mù. Link trên trang là link tiếp thị liên kết — bạn không trả thêm đồng nào, và link có ở cả sản phẩm chúng tôi khuyên cân nhắc. Gói nào chưa nếm, trang ghi rõ.": "We buy every product with our own money and taste it blind. Links on this site are affiliate links — you pay nothing extra, and links appear on packs we advise caution about too. Anything not yet tasted is clearly marked.",

    /* ---- Nút mua ---- */
    "Mua gói này": "Buy this pack",

    /* ---- Hero trang chủ ---- */
    "Cà phê đặc sản · Lâm Đồng": "Specialty coffee · Lâm Đồng",
    "Chưa uống thì không chấm": "We don't score<br>what we haven't drunk",
    "Mua thật · Nếm mù · Chấm điểm": "Bought for real · Tasted blind · Scored",
    "Nếm mù = uống thử che nhãn, che giá — để chấm cho công bằng.": "<b>Blind tasting</b> = we taste with the label and price hidden, to score it fairly.",
    "Chọn đúng gu trong 15 giây": "Find your taste in 15s",
    "Phương pháp đánh giá": "How we test",
    "Không nhận bài tài trợ": "No sponsored posts",
    "Mới uống cà phê? Bắt đầu →": "New to coffee? Start →"
  };

  var KEY = "gu_lang";
  var obs = null;
  function getLang() { try { return localStorage.getItem(KEY) || "vi"; } catch (e) { return "vi"; } }

  function translate(lang) {
    if (obs) obs.disconnect();
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute("data-i18n");
      if (el.__i18nVi == null) el.__i18nVi = el.innerHTML; // HTML gốc (VI)
      var next = (lang === "en" && DICT[key] != null) ? DICT[key] : el.__i18nVi;
      if (el.innerHTML !== next) el.innerHTML = next;
    }
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    var btns = document.querySelectorAll("[data-lang-toggle]");
    for (var j = 0; j < btns.length; j++) btns[j].textContent = lang === "en" ? "VI" : "EN";
    if (obs) obs.observe(document.body, { childList: true, subtree: true });
  }

  window.guSetLang = function (lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} translate(lang); };
  window.guApplyLang = function () { translate(getLang()); };

  function init() {
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-lang-toggle]") : null;
      if (!t) return;
      e.preventDefault();
      window.guSetLang(getLang() === "en" ? "vi" : "en");
    });
    var pending = false;
    obs = new MutationObserver(function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; translate(getLang()); });
    });
    translate(getLang());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
