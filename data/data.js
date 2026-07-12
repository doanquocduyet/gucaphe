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
  capNhat: "12/07/2026",
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
    id: "a1",
    brand: "Brand A",
    ten: "Arabica Cầu Đất 250g",
    nhom: "hat",
    gia: 239000,
    gram: 250,
    tested: true,
    diem: 9.2,
    chua: 2, dam: 4, hau: 4,
    pha: ["phin", "v60"],
    origin: "Cầu Đất, Lâm Đồng",
    giong: "Bourbon",
    roast: "Medium",
    process: "Washed",
    flavor: "Chocolate, hạt dẻ, hậu ngọt",
    nen: ["Quen gu phin, sợ arabica chua gắt", "Pha phin hoặc V60 đều được", "Muốn hạt rang mộc, không tẩm"],
    khong: ["Thích vị trái cây, chua sáng rõ", "Chỉ pha espresso máy"],
    link: "#"
  },
  {
    id: "b1",
    brand: "Brand B",
    ten: "Arabica Lâm Đồng 250g",
    nhom: "hat",
    gia: 265000,
    gram: 250,
    tested: true,
    diem: 8.4,
    chua: 4, dam: 3, hau: 3,
    pha: ["v60", "coldbrew"],
    origin: "Lâm Đồng",
    giong: "Typica",
    roast: "Light",
    process: "Natural",
    flavor: "Trái cây, chua sáng",
    nen: ["Pha V60 hoặc cold brew", "Thích vị trái cây rõ"],
    khong: ["Pha phin (bị chua gắt)", "Người mới thử arabica lần đầu"],
    link: "#"
  },
  {
    id: "c1",
    brand: "Brand C",
    ten: "Blend 70/30 · 1kg",
    nhom: "hat",
    gia: 190000,
    gram: 1000,
    tested: true,
    diem: 8.1,
    chua: 1, dam: 5, hau: 3,
    pha: ["phin", "coldbrew"],
    origin: "Lâm Đồng + Đắk Lắk",
    giong: "Blend",
    roast: "Medium-dark",
    process: "Washed",
    flavor: "Đậm, chocolate đen",
    nen: ["Uống hằng ngày, cần rẻ", "Pha phin truyền thống"],
    khong: ["Muốn cảm nhận vị tinh tế", "Pha pour over"],
    link: "#"
  },
  {
    id: "d1",
    brand: "Brand D",
    ten: "Specialty lô nhỏ 250g",
    nhom: "hat",
    gia: 319000,
    gram: 250,
    tested: false,
    diem: null,
    chua: 4, dam: 3, hau: 4,
    pha: ["v60", "coldbrew"],
    origin: "Cầu Đất, Lâm Đồng",
    giong: "Bourbon",
    roast: "Light",
    process: "Honey",
    flavor: "Theo mô tả nhà bán: mật ong, cam",
    nen: ["Pha V60 kỹ, có cân và cối xay tốt"],
    khong: ["Người mới", "Pha phin"],
    link: "#"
  },
  {
    id: "g1",
    brand: "Gear Brand",
    ten: "Cối xay tay",
    nhom: "gear",
    gia: 890000,
    gram: null,
    tested: true,
    diem: 8.8,
    chua: null, dam: null, hau: null,
    pha: ["phin", "v60", "coldbrew"],
    origin: null, giong: null, roast: null, process: null,
    flavor: "Chỉnh được 30+ nấc, xay đều",
    nen: ["Ai cũng nên có — xay tươi hơn hẳn mua xay sẵn", "Ngân sách dưới 1 triệu"],
    khong: ["Cần xay nhiều hơn 3 ly/lần (mỏi tay)"],
    link: "#"
  }
];

/* ---- Cặp so sánh (Compare = intent mua mạnh nhất) ---- */
const CAP_SS = [
  { a: "a1", b: "b1", tieuDe: "Brand A vs Brand B — nên mua loại nào?" }
];
