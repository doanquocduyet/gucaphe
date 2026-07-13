/* ============================================================
   DATA.JS — NGUỒN DUY NHẤT CỦA TOÀN BỘ WEB
   ============================================================
   Điều 22: DATABASE CÓ TRƯỚC WEBSITE.
   Bạn CHỈ cần sửa file này. Toàn bộ trang tự mọc ra.
   KHÔNG cần đụng HTML.

   ⚠️ QUY TẮC KHÔNG ĐƯỢC PHẠM (điều 31):
      tested: true   → 🟢 ĐÃ mua & nếm thật  (mới được có điểm)
      tested: false  → 🟡 CHƯA test          (diem: null BẮT BUỘC)
      Ghi sai = mất toàn bộ niềm tin = mất cả dự án.
   ============================================================ */

const SITE = {
  ten: "GU CÀ PHÊ",
  tagline: "Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.",
  capNhat: "13/07/2026",
  domain: "gucaphe.vn"
};

/* ---- Công bố TRƯỚC khi mở gói hàng ---- */
const QUY_TRINH = [
  "Mua <b>ẩn danh</b> trên Shopee/TikTok bằng tiền của chúng tôi — không nhận hàng tài trợ.",
  "Cùng cỡ xay <code>medium</code> · tỷ lệ <code>1:15</code> · nước <code>92°C</code>.",
  "Nếm <b>mù</b>: che nhãn, chấm điểm xong mới bóc ra xem là loại nào.",
  "Thang điểm: độ chua · độ đậm · hậu vị · giá/100g.",
  "Điểm số là <b>hệ quả của quy trình</b>, không phải ý kiến cá nhân."
];

/* ============================================================
   SẢN PHẨM — 5 mẫu để bạn thấy web chạy thế nào.
   XOÁ HẾT và thay bằng dữ liệu THẬT từ sheet DATABASE.
   ============================================================ */

const SP = [
  {
    id: "lb1",
    brand: "Sơn Pacamara",
    ten: "Lang Biang Specialty 250g — mùa mới 2026",
    nhom: "hat", gia: 270000, gram: 250,
    tested: true, diem: 9.3,
    chua: 4, dam: 3, hau: 5,
    pha: ["v60"],
    origin: "Lạc Dương, Lâm Đồng",
    giong: "Catimor, Caturra", roast: "Light", process: "Natural",
    flavor: "Hoa, đào, cam vàng, mật ong. Hậu vị sạch, kéo dài.",
    nen: ["Pha V60 hoặc pour over", "Thích vị trái cây, chua sáng", "Chấp nhận 108.000đ/100g cho hạt tốt"],
    khong: ["Chỉ có phin — rang sáng pha phin dễ chua gắt", "Quen gu đậm đắng", "Muốn cà phê uống hằng ngày giá mềm"],
    link: "https://s.shopee.vn/AUsMz3wGhY"
  },
  {
    id: "vs1",
    brand: "Message Coffee",
    ten: "Vietnam Specialty nguyên chất 500g",
    nhom: "hat", gia: 160000, gram: 500,
    tested: true, diem: 8.7,
    chua: 3, dam: 4, hau: 4,
    pha: ["phin", "v60"],
    origin: "Việt Nam",
    giong: "Arabica", roast: "Medium", process: "Washed",
    flavor: "Caramel, chocolate sữa, trái cây chín. Cân bằng, dễ uống.",
    nen: ["Uống hằng ngày — rẻ nhất tính theo 100g (32.000đ)", "Pha phin hay V60 đều được", "Người mới thử specialty"],
    khong: ["Muốn vị đặc biệt, tinh tế", "Muốn hương hoa rõ như dòng rang sáng"],
    link: "https://s.shopee.vn/5q6XQUE2Ai"
  },
  {
    id: "es1",
    brand: "Stupiducks",
    ten: "Red Bull Espresso 250g — rang đậm",
    nhom: "hat", gia: 270000, gram: 250,
    tested: false, diem: null,
    chua: 2, dam: 5, hau: 4,
    pha: ["phin"],
    origin: "Việt Nam",
    giong: "Arabica", roast: "Dark", process: null,
    flavor: "Theo mô tả nhà bán: chocolate đen, hạnh nhân. Đậm, ít chua.",
    nen: ["Pha máy espresso, latte, cappuccino"],
    khong: ["Thích vị chua sáng, trái cây", "Pha V60"],
    link: "https://s.shopee.vn/AAFWaRxXNW"
  },
  {
    id: "fm1",
    brand: "Sơn Pacamara",
    ten: "Fruit Mood — Cold Brew 250g",
    nhom: "hat", gia: 245000, gram: 250,
    tested: false, diem: null,
    chua: 4, dam: 3, hau: 3,
    pha: ["coldbrew"],
    origin: "Việt Nam",
    giong: "Pacamara", roast: "Light-medium", process: null,
    flavor: "Theo mô tả nhà bán: hợp cold brew, vị trái cây.",
    nen: ["Chuyên pha cold brew"],
    khong: ["Pha nóng", "Chưa có dụng cụ ủ lạnh"],
    link: "https://s.shopee.vn/9zw6O8yAiV"
  }
];

/* ---- Cặp so sánh (Compare = intent mua mạnh nhất) ---- */
const CAP_SS = [
  { a: "lb1", b: "vs1", tieuDe: "Lang Biang 270k vs Vietnam Specialty 160k — đắt hơn có đáng không?" }
];
