const SITE = {
  ten: "GU CÀ PHÊ",
  tagline: "Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.",
  capNhat: "13/07/2026",
  domain: "gucaphe.vn"
};

const QUY_TRINH = [
  "Mua <b>ẩn danh</b> trên Shopee bằng tiền của chúng tôi — không nhận hàng tài trợ, không nhận mẫu thử từ nhà bán.",
  "Pha cùng điều kiện cho mọi loại: cỡ xay <code>medium</code>, tỷ lệ <code>1:15</code>, nước <code>92°C</code>.",
  "Nếm <b>mù</b> — che nhãn, chấm điểm xong mới bóc ra xem là loại nào.",
  "Chấm bốn tiêu chí: độ chua, độ đậm, hậu vị, và giá trên 100g.",
  "Loại nào chúng tôi <b>chưa nếm</b>, trang sẽ ghi rõ nhãn vàng — không chấm điểm, không giả vờ đã thử."
];

const SP = [
  { id:"lb1", brand:"Sơn Pacamara", ten:"Lang Biang Specialty 250g", nhom:"hat", gia:270000, gram:250,
    tested:true, diem:9.3, chua:4, dam:3, hau:5, pha:["v60"],
    origin:"Lạc Dương, Lâm Đồng", giong:"Catimor, Caturra", roast:"Light", process:"Natural",
    flavor:"Hoa, đào, cam vàng, mật ong. Hậu vị sạch và kéo dài.", notes:["Hoa","Đào","Cam vàng","Mật ong"],
    nen:["Pha V60 hoặc pour over","Thích vị trái cây, chua sáng","Chấp nhận 108.000₫/100g cho hạt tốt"],
    khong:["Chỉ có phin — rang sáng pha phin dễ chua gắt","Quen gu đậm đắng","Muốn cà phê uống hằng ngày giá mềm"],
    link:"https://s.shopee.vn/AUsMz3wGhY", anh:"", ngayRang:"" },
  { id:"vs1", brand:"Message Coffee", ten:"Vietnam Specialty nguyên chất 500g", nhom:"hat", gia:160000, gram:500,
    tested:true, diem:8.7, chua:3, dam:4, hau:4, pha:["phin","v60"],
    origin:"Việt Nam", giong:"Arabica", roast:"Medium", process:"Washed",
    flavor:"Caramel, chocolate sữa, trái cây chín. Cân bằng, dễ uống.", notes:["Caramel","Chocolate sữa","Trái cây chín"],
    nen:["Uống hằng ngày — rẻ nhất tính theo 100g","Pha phin hay V60 đều được","Người mới thử specialty"],
    khong:["Muốn vị đặc biệt, tinh tế","Muốn hương hoa rõ như dòng rang sáng"],
    link:"https://s.shopee.vn/5q6XQUE2Ai", anh:"", ngayRang:"" },
  { id:"es1", brand:"Stupiducks", ten:"Red Bull Espresso 250g", nhom:"hat", gia:270000, gram:250,
    tested:false, diem:null, chua:2, dam:5, hau:4, pha:["phin"],
    origin:"Việt Nam", giong:"Arabica", roast:"Dark", process:null,
    flavor:"Theo mô tả nhà bán: chocolate đen, hạnh nhân. Đậm, ít chua.",
    nen:["Pha máy espresso, latte, cappuccino"],
    khong:["Thích vị chua sáng, trái cây","Pha V60"],
    link:"https://s.shopee.vn/AAFWaRxXNW", anh:"", ngayRang:"" },
  { id:"fm1", brand:"Sơn Pacamara", ten:"Fruit Mood — Cold Brew 250g", nhom:"hat", gia:245000, gram:250,
    tested:false, diem:null, chua:4, dam:3, hau:3, pha:["coldbrew"],
    origin:"Việt Nam", giong:"Arabica", roast:"Light-medium", process:null,
    flavor:"Theo mô tả nhà bán: hợp cold brew, vị trái cây.",
    nen:["Chuyên pha cold brew"],
    khong:["Pha nóng","Chưa có dụng cụ ủ lạnh"],
    link:"https://s.shopee.vn/9zw6O8yAiV", anh:"", ngayRang:"" }
];

const CAP_SS = [
  { a:"lb1", b:"vs1", tieuDe:"Lang Biang 270k vs Vietnam Specialty 160k — đắt hơn có đáng không?" }
];

/* ---- Từ điển nhanh — định nghĩa ngắn, đúng, không màu mè ---- */
const TU_DIEN = [
  { t:"Specialty", d:"Cà phê đạt từ 80/100 điểm theo thang SCA, truy xuất được nguồn gốc, sơ chế và rang có kiểm soát." },
  { t:"Natural (sơ chế khô)", d:"Phơi nguyên quả rồi mới tách vỏ — vị ngọt đậm, thiên trái cây chín." },
  { t:"Washed (sơ chế ướt)", d:"Tách vỏ, rửa sạch nhớt trước khi phơi — vị sạch, sáng, dễ cảm nhận hương gốc." },
  { t:"Rang sáng (Light)", d:"Giữ độ chua và hương hoa quả của hạt — hợp V60/pour over, pha phin dễ chua gắt." },
  { t:"Rang đậm (Dark)", d:"Body dày, vị chocolate, đắng rõ — hợp phin, espresso, ít chua." },
  { t:"V60 / Pour over", d:"Pha giấy lọc rót tay — tôn hương thơm và vị chua sáng, cần cỡ xay đều." },
  { t:"Cold brew", d:"Ủ cà phê với nước lạnh 12–18 giờ — ít chua, ngọt dịu, uống mát." },
  { t:"Giá /100g", d:"Quy đổi giá về mỗi 100g để so công bằng giữa các gói 250g, 500g khác nhau." }
];

/* ---- FAQ — hiện trên trang, đồng bộ với schema SEO trong index.html ---- */
const FAQ = [
  { q:"Cà phê specialty là gì?",
    a:"Là cà phê đạt từ 80/100 điểm theo thang SCA — truy xuất được vùng trồng, giống, cách sơ chế. Trên trang này, mỗi sản phẩm đều ghi rõ ba thông tin đó." },
  { q:"Mua qua link trên trang có đắt hơn không?",
    a:"Không. Bạn mua đúng giá Shopee niêm yết, chúng tôi nhận hoa hồng từ sàn — bạn không trả thêm đồng nào." },
  { q:"Vì sao có sản phẩm không có điểm số?",
    a:"Vì chúng tôi chưa mua và chưa nếm mù loại đó. Sản phẩm chưa nếm được ghi rõ nhãn vàng, thông số lấy từ mô tả nhà bán — chúng tôi không giả vờ đã thử." },
  { q:"Vì sao so giá theo 100g thay vì theo gói?",
    a:"Các gói có khối lượng khác nhau (250g, 500g…). Quy về giá/100g mới thấy gói 160.000₫/500g thực ra rẻ hơn nhiều gói 270.000₫/250g." }
];

/* ---- Kiến thức — bài viết ngắn, hiểu trước khi mua ---- */
const BAIVIET = [
  {
    id: "natural-washed",
    anh: "assets/img/art-1.jpg",
    tag: "Sơ chế",
    tieuDe: "Natural hay Washed — vị khác nhau chỗ nào?",
    dek: "Cùng một hạt, hai cách sơ chế cho hai ly hoàn toàn khác. Chọn sai, bạn trách nhầm hạt.",
    than:
      "<p><b>Washed (sơ chế ướt)</b> tách sạch lớp thịt quả trước khi phơi hạt. Ly cà phê <b>sạch, sáng, rõ nét</b> — bạn cảm được đúng chất của giống và vùng đất, chua thanh như trái cây tươi. Đa số specialty rang sáng đi theo hướng này.</p>" +
      "<p><b>Natural (sơ chế khô)</b> phơi nguyên cả quả, để hạt ngâm trong lớp thịt ngọt nhiều tuần. Kết quả: <b>ngọt đậm, thân dày, thiên trái cây chín</b> — dâu, mận, đôi khi hơi lên men như rượu vang. Bù lại, vị kém sạch và mỗi mẻ dễ lệch nhau hơn.</p>" +
      "<p><b>Chọn thế nào?</b> Thích trong trẻo, tinh tế → Washed. Thích ngọt bùng nổ, trái cây rõ → Natural. Trường <i>Sơ chế</i> ở mỗi sản phẩm cho bạn biết ngay mình sắp uống kiểu nào.</p>"
  },
  {
    id: "rang-sang-dam",
    anh: "assets/img/art-2.jpg",
    tag: "Độ rang",
    tieuDe: "Rang sáng hay rang đậm — chọn theo cách pha",
    dek: "Độ rang quyết định ‘ngon hay dở’ nhiều hơn cả giống hạt. Quen phin mà mua nhầm rang sáng là dễ chê oan.",
    than:
      "<p><b>Rang sáng (Light)</b> giữ độ chua và hương hoa quả của hạt. Tuyệt vời với <b>V60 / pour over</b>, nhưng <b>pha phin dễ chua gắt</b> vì phin ngâm lâu, chiết ra nhiều axit.</p>" +
      "<p><b>Rang đậm (Dark)</b> đốt bớt axit, đổi lại <b>thân dày, vị chocolate, đắng rõ</b>. Hợp phin truyền thống và espresso, uống với sữa vẫn ‘gồng’ được vị.</p>" +
      "<p><b>Quy tắc nhanh:</b> Phin → chọn Medium đến Dark. V60 / pour over → chọn Light đến Medium. Cột <i>Rang</i> và <i>Hợp</i> ở mỗi sản phẩm đã ghi sẵn để bạn khỏi đoán.</p>"
  },
  {
    id: "vi-sao-specialty-dat",
    anh: "assets/img/art-3.jpg",
    tag: "Đáng tiền không?",
    tieuDe: "Specialty đắt hơn — bạn trả tiền cho điều gì?",
    dek: "Một gói 250g specialty có thể đắt gấp 3–4 lần cà phê phổ thông. Đáng hay không tuỳ cách bạn uống.",
    than:
      "<p><b>1. Điểm số thật.</b> Specialty là hạt đạt từ 80/100 theo thang SCA — được chấm mù bởi bên thứ ba, không phải nhà bán tự phong.</p>" +
      "<p><b>2. Truy xuất nguồn gốc.</b> Bạn biết vùng trồng, giống, cách sơ chế — không phải ‘cà phê nguyên chất’ chung chung.</p>" +
      "<p><b>3. Hái chọn quả chín.</b> Chỉ hái quả chín đỏ thay vì tuốt cả cành xanh–chín làm tăng chi phí nhân công, nhưng đó là gốc rễ của vị ngọt sạch.</p>" +
      "<p><b>Có đáng không?</b> Nếu bạn pha máy/pour over và thật sự để ý vị — đáng. Nếu pha phin đậm uống với sữa mỗi sáng, một gói rang mộc giá mềm có khi hợp hơn. Chúng tôi không ép — chỉ tính giúp bạn <b>giá/100g</b> để so cho sòng phẳng.</p>"
  }
];
