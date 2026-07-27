const SITE = {
  ten: "GU CÀ PHÊ",
  tagline: "Chúng tôi mua, nếm mù, chấm điểm — để bạn không phải đoán.",
  capNhat: "13/07/2026",
  domain: "gucaphe.vn",
  // Dán GA4 Measurement ID (dạng G-XXXXXXX) vào đây để tự bật đo lường funnel.
  // Để trống "" thì không có analytics nào chạy — trang vẫn hoạt động bình thường.
  ga4: "G-4RR9SDJ34E"
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
    slug:"son-pacamara-lang-biang",
    tested:true, diem:9.3, chua:4, dam:3, hau:5, pha:["v60"],
    origin:"Lạc Dương, Lâm Đồng", giong:"Catimor, Caturra", roast:"Light", process:"Natural",
    flavor:"Hoa, đào, cam vàng, mật ong. Hậu vị sạch và kéo dài.", notes:["Hoa","Đào","Cam vàng","Mật ong"],
    nen:["Pha V60 hoặc pour over","Thích vị trái cây, chua sáng","Chấp nhận 108.000₫/100g cho hạt tốt"],
    khong:["Chỉ có phin — rang sáng pha phin dễ chua gắt","Quen gu đậm đắng","Muốn cà phê uống hằng ngày giá mềm"],
    link:"https://s.shopee.vn/AUsMz3wGhY", anh:"", ngayRang:"" },
  { id:"vs1", brand:"Message Coffee", ten:"Vietnam Specialty nguyên chất 500g", nhom:"hat", gia:160000, gram:500,
    slug:"message-coffee-vietnam-specialty",
    tested:true, diem:8.7, chua:3, dam:4, hau:4, pha:["phin","v60"],
    origin:"Việt Nam", giong:"Arabica", roast:"Medium", process:"Washed",
    flavor:"Caramel, chocolate sữa, trái cây chín. Cân bằng, dễ uống.", notes:["Caramel","Chocolate sữa","Trái cây chín"],
    nen:["Uống hằng ngày — rẻ nhất tính theo 100g","Pha phin hay V60 đều được","Người mới thử specialty"],
    khong:["Muốn vị đặc biệt, tinh tế","Muốn hương hoa rõ như dòng rang sáng"],
    link:"https://s.shopee.vn/5q6XQUE2Ai", anh:"", ngayRang:"" },
  { id:"es1", brand:"Stupiducks", ten:"Red Bull Espresso 250g", nhom:"hat", gia:270000, gram:250,
    slug:"stupiducks-red-bull-espresso",
    tested:false, diem:null, chua:2, dam:5, hau:4, pha:["phin"],
    origin:"Việt Nam", giong:"Arabica", roast:"Dark", process:null,
    flavor:"Theo mô tả nhà bán: chocolate đen, hạnh nhân. Đậm, ít chua.",
    nen:["Pha máy espresso, latte, cappuccino"],
    khong:["Thích vị chua sáng, trái cây","Pha V60"],
    link:"https://s.shopee.vn/AAFWaRxXNW", anh:"", ngayRang:"" },
  { id:"fm1", brand:"Sơn Pacamara", ten:"Fruit Mood — Cold Brew 250g", nhom:"hat", gia:245000, gram:250,
    slug:"son-pacamara-fruit-mood-cold-brew",
    tested:false, diem:null, chua:4, dam:3, hau:3, pha:["coldbrew"],
    origin:"Việt Nam", giong:"Arabica", roast:"Light-medium", process:null,
    flavor:"Theo mô tả nhà bán: hợp cold brew, vị trái cây.",
    nen:["Chuyên pha cold brew"],
    khong:["Pha nóng","Chưa có dụng cụ ủ lạnh"],
    link:"https://s.shopee.vn/9zw6O8yAiV", anh:"", ngayRang:"" },
  /* ===== 3 nhà Nam Ban — thêm để so sánh trung lập. Chưa nếm mù → tested:false, diem:null.
     Nếm xong đổi tested:true và điền diem/chua/dam/hau. ===== */
  { id:"nb-bui", brand:"Bui Coffee Supply", ten:"Fine Robusta Nam Ban (lên men muối) 250g", nhom:"hat", gia:179000, gram:250,
    slug:"bui-fine-robusta-nam-ban",
    tested:false, diem:null, chua:null, dam:null, hau:null, pha:["phin","espresso"],
    origin:"Nam Ban, Lâm Hà", giong:"Fine Robusta", roast:"Medium", process:"Lên men muối (Natri Clorua)",
    flavor:"Dòng Fine Robusta Nam Ban đạt Top 14 Thế Giới 2024 (CQI). Vị chi tiết sẽ cập nhật sau khi Gu nếm mù.", notes:[],
    nen:["Muốn thử đặc sản đạt giải quốc tế","Gu đậm, thân dày","Pha phin hoặc espresso"],
    khong:["Ngân sách rất eo hẹp","Thích chua sáng nhẹ kiểu Arabica"],
    link:"https://buicoffeesupply.com/san-pham/fine-robusta-nam-ban-len-men-muoi/", anh:"", ngayRang:"" },
  { id:"nb-tamtrinh", brand:"Tám Trình Coffee", ten:"Arabica Cầu Đất & Lạc Dương Blend (pha máy) 250g", nhom:"hat", gia:150000, gram:250,
    slug:"tam-trinh-arabica-blend",
    tested:false, diem:null, chua:null, dam:null, hau:null, pha:["espresso","phin"],
    origin:"Cầu Đất + Lạc Dương, Lâm Đồng", giong:"Arabica blend", roast:"Medium", process:"Washed",
    flavor:"Nhà 30 năm, mạnh sản xuất và nhân xanh. Vị chi tiết sẽ cập nhật sau khi Gu nếm mù.", notes:[],
    nen:["Mở quán, cần nguồn ổn định","Mua sỉ nhân xanh","Thích blend cân bằng"],
    khong:["Chỉ mua lẻ 1 gói thử","Muốn single-origin rõ vùng"],
    link:"https://tamtrinhcoffee.com/arabica-blend-ca-phe-pha-may/", anh:"", ngayRang:"" },
  { id:"nb-dehavi", brand:"Dehavi (Hân Vinh)", ten:"Cà phê Đặc Sản Arabica Lạc Dương 250g", nhom:"hat", gia:130000, gram:250,
    slug:"dehavi-arabica-lac-duong",
    tested:false, diem:null, chua:null, dam:null, hau:null, pha:["phin","espresso"],
    origin:"Lạc Dương, Lâm Đồng", giong:"Arabica", roast:"Medium", process:"Rang mộc nguyên chất",
    flavor:"Rẻ nhất trong 3 nhà, dễ tiếp cận cho người mới uống đặc sản. Vị chi tiết sẽ cập nhật sau khi Gu nếm mù.", notes:[],
    nen:["Mới uống đặc sản","Ngân sách vừa","Muốn thử mà không tốn nhiều"],
    khong:["Muốn dòng đạt giải quốc tế","Cần sơ chế đặc biệt"],
    link:"https://shopee.vn/dehavicoffee_official", anh:"", ngayRang:"" }

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
  },
  {
    id: "ca-phe-nam-ban-nha-nao",
    anh: "assets/img/art-1.jpg",
    tag: "So sánh",
    tieuDe: "Cà phê Nam Ban mua nhà nào? Bùi, Tám Trình hay Dehavi",
    dek: "Ba nhà mạnh nhất Nam Ban, mỗi nhà một thế mạnh. Gu mua thật, pha mù, chấm điểm — để bạn chọn đúng gói cho túi tiền của mình.",
    than:
      "<p>Nam Ban (Lâm Hà, Lâm Đồng) có ba nhà cà phê đáng chú ý nhất: <b>Bùi</b>, <b>Tám Trình</b> và <b>Dehavi</b>. Cả ba đều tự nói mình ngon — vì họ là người bán. Trang này khác: chúng tôi không bán cà phê của mình, mà mua của cả ba, pha mù, chấm theo cùng một thang.</p>" +
      "<p><b>Chọn nhanh:</b> Mới uống hoặc ngân sách vừa → <b>Dehavi Arabica Lạc Dương (130k)</b>. Muốn ngon chuẩn giải quốc tế → <b>Bùi Fine Robusta Nam Ban (179k)</b>, dòng đạt Top 14 Thế Giới 2024. Mở quán hoặc mua sỉ → <b>Tám Trình</b>, 30 năm, mạnh nhân xanh.</p>" +
      "<p><b>① Bùi</b> (nông trại Bui Origin, Mê Linh): chuyên nghiệp và thành tích quốc tế nhất. Fine Robusta Nam Ban Top 14 Thế Giới 2024, xưởng 5 tấn/ngày, chứng nhận FDA/HACCP/ISO22000, xuất khẩu 12+ nước. Hợp người muốn trải nghiệm đặc sản đỉnh cao. Giá: Fine Robusta Nam Ban 179k, Arabica Cầu Đất 189k.</p>" +
      "<p><b>② Tám Trình</b> (Gia Lâm): lâu đời nhất, 30 năm, mạnh sản xuất, xuất khẩu và du lịch trải nghiệm. Shop mạnh mảng nhân xanh và sỉ. Hợp người mở quán, mua sỉ. Giá lẻ: coldbrew 100–280k, Arabica blend 150–280k.</p>" +
      "<p><b>③ Dehavi</b> (Đông Anh, Nam Ban): bán lẻ giá mềm nhất, dễ tiếp cận cho người uống phổ thông. Chứng nhận OCOP 4 sao, ISO22000, FDA. Giá: Arabica Lạc Dương 130k (rẻ nhất), Yellow Bourbon 175k, Moka 230k.</p>" +
      "<p><b>Cam kết:</b> Chúng tôi không nhận tài trợ để viết bài này. Điểm số cập nhật sau khi nếm mù từng gói — ngon thật chấm cao thật, có điểm yếu nói thẳng. Chưa uống thì chúng tôi không chấm.</p>"
  }

];

/* ---- Vùng trồng — hub kiến thức về cà phê Lâm Đồng (Cầu Đất · Nam Ban · Lạc Dương)
   Nội dung giáo dục, chính xác ở mức phổ thông. KHÔNG bịa điểm nếm. `diaDanh` dùng
   để tự nối vùng với sản phẩm nào có origin khớp. ---- */
const VUNG = [
  {
    slug: "lam-dong", ten: "Lâm Đồng", hub: true,
    diaDanh: ["Lâm Đồng", "Lạc Dương", "Cầu Đất", "Đà Lạt", "Nam Ban", "Lâm Hà", "Di Linh", "Bảo Lộc"],
    tinh: "Tây Nguyên, Việt Nam",
    doCao: "800–1.650m",
    giong: "Arabica (Bourbon, Typica, Catimor) · Robusta",
    hopPha: "Tuỳ tiểu vùng",
    tagline: "Cao nguyên Arabica của Việt Nam.",
    vi: "Càng lên cao, quả chín càng chậm — axit càng sáng, hương hoa quả càng rõ.",
    diemNhan: ["Cao nguyên 800–1.650m", "Đất bazan đỏ", "Khí hậu ôn hoà quanh năm", "Nguồn Arabica đặc sản lớn nhất nước"],
    than: [
      "<p>Gần như toàn bộ cà phê <b>Arabica đặc sản</b> của Việt Nam đến từ Lâm Đồng. Cao nguyên này nằm ở độ cao 800–1.650m, đất bazan đỏ tơi xốp, khí hậu ôn hoà quanh năm — ba điều kiện mà cây Arabica cần để cho hạt có hương phức tạp.</p>",
      "<p>Trong tỉnh, mỗi tiểu vùng cho một chất vị khác nhau. Càng lên cao, quả chín càng chậm, axit càng sáng và hương hoa quả càng rõ. <b>Cầu Đất</b> (Đà Lạt) là vùng cao và lâu đời nhất; <b>Lạc Dương</b> dưới chân núi Lang Biang cho hạt sạch, cân bằng; <b>Nam Ban</b> (Lâm Hà) ở độ cao thấp hơn, thân dày và dịu hơn.</p>",
      "<p>Ở Gu Cà Phê, gói Lâm Đồng chúng tôi đã nếm mù là <b>Sơn Pacamara — Lang Biang</b> (Lạc Dương). Các tiểu vùng còn lại chúng tôi vẫn đang tìm gói xứng đáng để mua và nếm — khi có, trang này sẽ cập nhật.</p>"
    ]
  },
  {
    slug: "cau-dat", ten: "Cầu Đất",
    diaDanh: ["Cầu Đất"],
    tinh: "Xuân Trường, Đà Lạt, Lâm Đồng",
    doCao: "~1.400–1.650m",
    giong: "Bourbon, Typica, Catimor",
    hopPha: "V60 / Pour over",
    tagline: "Vùng Arabica cao và lâu đời bậc nhất Việt Nam.",
    vi: "Chua sáng kiểu cam chanh, hương hoa, thân vừa, hậu vị sạch và dài.",
    diemNhan: ["Độ cao ~1.500m", "Arabica trồng từ thời Pháp", "Chua sáng, hương hoa", "Hợp V60 / pour over"],
    than: [
      "<p><b>Cầu Đất</b> nằm ở phía đông nam Đà Lạt, trên độ cao khoảng 1.400–1.650m — thuộc nhóm cao nhất cả nước cho cây cà phê. Người Pháp đã trồng Arabica ở đây từ đầu thế kỷ 20, nên đây thường được xem là <b>cái nôi của Arabica đặc sản Việt Nam</b>.</p>",
      "<p>Độ cao lớn khiến ngày nắng, đêm lạnh; quả cà phê chín chậm và tích được nhiều đường, nhiều tiền chất hương. Kết quả trong ly thường là <b>độ chua sáng như cam chanh, hương hoa, thân vừa phải và hậu vị sạch kéo dài</b> — đúng chất Arabica vùng cao. Vì chua sáng, cà phê Cầu Đất hợp <b>V60 / pour over</b> hơn là pha phin đậm.</p>",
      "<p>Các giống phổ biến gồm Bourbon, Typica (dòng cổ, tinh tế) và Catimor (khoẻ, năng suất cao). Khi mua, hãy để ý nhãn có ghi rõ giống và độ cao không — đó là dấu hiệu của một gói được làm nghiêm túc.</p>"
    ]
  },
  {
    slug: "nam-ban", ten: "Nam Ban",
    diaDanh: ["Nam Ban", "Lâm Hà"],
    tinh: "Lâm Hà, Lâm Đồng",
    doCao: "thấp hơn Cầu Đất (~800–1.000m)",
    giong: "Robusta và Arabica",
    hopPha: "Phin · Espresso",
    tagline: "Vùng cà phê của Lâm Hà — dịu và đậm hơn vùng cao.",
    vi: "Thân dày hơn, độ chua dịu hơn vùng cao; dễ uống với người quen gu đậm.",
    diemNhan: ["Thuộc huyện Lâm Hà", "Độ cao thấp hơn Cầu Đất", "Thân dày, ít chua", "Nổi tiếng cà phê chồn & du lịch"],
    than: [
      "<p><b>Nam Ban</b> là thị trấn thuộc huyện <b>Lâm Hà</b>, phía tây nam Đà Lạt. Tên ‘Lâm Hà’ ghép từ Lâm Đồng và Hà Nội — vùng kinh tế mới do người Hà Nội vào lập nghiệp từ cuối thập niên 1970.</p>",
      "<p>So với Cầu Đất, Nam Ban ở <b>độ cao thấp hơn</b> nên khí hậu ấm hơn. Cà phê ở đây thường <b>thân dày hơn, độ chua dịu hơn</b>, dễ uống với người quen gu đậm. Vùng trồng cả Robusta lẫn Arabica.</p>",
      "<p>Nam Ban cũng được biết đến với các trại <b>cà phê chồn</b> và du lịch cà phê — nhưng đó là câu chuyện trải nghiệm nhiều hơn là thước đo chất lượng specialty. Với cà phê đặc sản, điều đáng quan tâm vẫn là giống, độ cao và cách sơ chế được ghi rõ.</p>"
    ]
  }
];
