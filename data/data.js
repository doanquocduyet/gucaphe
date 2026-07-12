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
    id: "combo10phin",
    brand: "Chưa rõ (Shopee)",
    ten: "Combo 10 Gói Cà Phê Phin Giấy",
    nhom: "hat",
    gia: 170000,
    gram: 120,
    tested: false,
    diem: null,
    chua: 2, dam: 4, hau: 3,
    pha: ["phin"],
    origin: "Việt Nam",
    giong: "Chưa rõ",
    roast: "Chưa rõ",
    process: "Chưa rõ",
    flavor: "Theo mô tả nhà bán: combo 10 gói phin giấy pha sẵn tiện lợi, vị cà phê truyền thống đậm đà. Đã bán 1k+, đánh giá 5.0 sao.",
    nen: ["Muốn pha nhanh, không cần dụng cụ", "Dân văn phòng, mang đi làm", "Thử vị cà phê phin tiện lợi"],
    khong: ["Muốn tự chỉnh cỡ xay, tỷ lệ pha", "Cần hạt rang mộc để pour over"],
    link: "#"
  },
  {
    id: "langbiang2026",
    brand: "Lang Biang",
    ten: "Lang Biang (Mùa mới 2026) Specialty",
    nhom: "hat",
    gia: 270000,
    gram: 250,
    tested: false,
    diem: null,
    chua: 4, dam: 3, hau: 4,
    pha: ["v60", "phin"],
    origin: "Lang Biang, Lâm Đồng",
    giong: "Arabica",
    roast: "Medium-light",
    process: "Chưa rõ",
    flavor: "Theo mô tả nhà bán: cà phê specialty vùng Lang Biang mùa mới 2026, hương vị tinh tế đặc trưng cao nguyên. Đã bán 1k+, đánh giá 5.0 sao.",
    nen: ["Thích arabica specialty vùng cao", "Pha V60 hoặc phin đều hợp", "Muốn thử lô mùa mới"],
    khong: ["Chỉ quen cà phê đậm truyền thống", "Ngân sách hạn chế"],
    link: "#"
  },
  {
    id: "midnightchoco",
    brand: "Chưa rõ (Shopee)",
    ten: "Cà Phê Midnight Chocolate 200g",
    nhom: "hat",
    gia: 202415,
    gram: 200,
    tested: false,
    diem: null,
    chua: 1, dam: 5, hau: 4,
    pha: ["phin", "coldbrew"],
    origin: "Việt Nam",
    giong: "Chưa rõ",
    roast: "Dark",
    process: "Chưa rõ",
    flavor: "Theo mô tả nhà bán: gu đậm rang tối, hương chocolate đen, hậu vị mạnh. Đã bán 967, đánh giá 4.8 sao.",
    nen: ["Thích cà phê đậm, rang tối", "Pha phin truyền thống hoặc cold brew", "Mê vị chocolate đen"],
    khong: ["Thích vị chua sáng, trái cây", "Nhạy caffeine"],
    link: "#"
  },
  {
    id: "vnspecialty",
    brand: "Chưa rõ (Shopee)",
    ten: "Cà Phê Vietnam Specialty (nguyên chất)",
    nhom: "hat",
    gia: 160000,
    gram: 250,
    tested: false,
    diem: null,
    chua: 3, dam: 4, hau: 3,
    pha: ["phin", "v60"],
    origin: "Việt Nam",
    giong: "Chưa rõ",
    roast: "Medium",
    process: "Chưa rõ",
    flavor: "Theo mô tả nhà bán: cà phê specialty nguyên chất 100%, không pha trộn, không tẩm. Đã bán 5k+, đánh giá 5.0 sao.",
    nen: ["Muốn cà phê nguyên chất, không tẩm", "Uống hằng ngày, giá vừa phải", "Pha phin hoặc V60 đều được"],
    khong: ["Cần hồ sơ nguồn gốc/giống chi tiết", "Thích gu rang tối rất đậm"],
    link: "#"
  },
  {
    id: "fruitmoodcoldbrew",
    brand: "Fruit Mood",
    ten: "Fruit Mood — Cà Phê Cold Brew Sơn",
    nhom: "hat",
    gia: 245000,
    gram: 250,
    tested: false,
    diem: null,
    chua: 5, dam: 2, hau: 3,
    pha: ["coldbrew", "v60"],
    origin: "Việt Nam",
    giong: "Arabica",
    roast: "Light",
    process: "Chưa rõ",
    flavor: "Theo mô tả nhà bán: dòng cà phê pha cold brew, thiên hương trái cây, chua sáng tươi mát. Đã bán 2k+, đánh giá 5.0 sao.",
    nen: ["Thích cold brew mát, vị trái cây", "Chua sáng, nhẹ nhàng", "Pha V60 cũng hợp"],
    khong: ["Quen gu phin đậm truyền thống", "Không thích vị chua"],
    link: "#"
  }
];

/* ---- Cặp so sánh (Compare = intent mua mạnh nhất) ---- */
const CAP_SS = [
  { a: "langbiang2026", b: "vnspecialty", tieuDe: "Lang Biang Specialty vs Vietnam Specialty — nên mua loại nào?" }
];
