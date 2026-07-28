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

/* ============================================================
   SCHEMA CHUẨN CHO MỖI SẢN PHẨM (SP) — thêm nhà mới thì theo đúng bộ này.
   Định danh:   id · brand(nhà rang) · ten · gia · gram · slug · nhom · pha[]
   Vùng nguyên liệu: vungSlug ("nam-ban"|"cau-dat"|"lac-duong"|"da-lat"|null) · xaHuyen
   Nguồn/kỹ thuật:   giong · doCao (vd "1550 MASL") · process · roast · ngayRang
   Đánh giá (điền khi đã nếm mù, còn lại null): tested · diem · chua · dam · hau · notes[]
   Mô tả:            flavor · nen[] · khong[]
   Thương mại:       link (Shopee/CTV/web nhà) · lazada · tiki (tuỳ chọn) · anh
   → Chỉ cần đổi tested:false→true + điền diem/chua/dam/hau là bảng xếp hạng,
     schema Review và trang /review TỰ cập nhật. Trường chưa biết để null/"" — KHÔNG bịa.
   ============================================================ */
const SP = [
  { id:"lb1", brand:"Sơn Pacamara", ten:"Lang Biang Specialty 250g", nhom:"hat", gia:270000, gram:250,
    slug:"son-pacamara-lang-biang", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Lạc Dương, Lâm Đồng",
    giong:"Catimor, Caturra", doCao:"", process:"Natural", roast:"Light", ngayRang:"",
    tested:true, daUong:true, chungNhan:"Farm minh bạch · Lạc Dương", diem:9.3, chua:4, dam:3, hau:5,
    flavor:"Hoa, đào, cam vàng, mật ong. Hậu vị sạch và kéo dài.", notes:["Hoa","Đào","Cam vàng","Mật ong"],
    nen:["Pha V60 hoặc pour over","Thích vị trái cây, chua sáng","Chấp nhận 108.000₫/100g cho hạt tốt"],
    khong:["Chỉ có phin — rang sáng pha phin dễ chua gắt","Quen gu đậm đắng","Muốn cà phê uống hằng ngày giá mềm"],
    link:"https://s.shopee.vn/AUsMz3wGhY", anh:"assets/img/products/cherries-branch.jpg" },
  /* ===== 3 nhà Nam Ban — so sánh trung lập. Chưa nếm mù → tested:false. ===== */
  { id:"nb-bui", brand:"Bui Coffee Supply", ten:"Fine Robusta Nam Ban (lên men muối) 250g", nhom:"hat", gia:179000, gram:250,
    slug:"bui-fine-robusta-nam-ban", pha:["phin","espresso"],
    vungSlug:"nam-ban", xaHuyen:"Nam Ban, Lâm Hà",
    giong:"Fine Robusta", doCao:"", process:"Lên men muối (Natri Clorua)", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Top 14 Thế giới · CQI 2024", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — thân dày, hậu ngọt, đúng chất Fine Robusta đấu giải. Đây là gói để lại ấn tượng mạnh nhất với chúng tôi. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    nen:["Muốn thử đặc sản đạt giải quốc tế","Gu đậm, thân dày","Pha phin hoặc espresso"],
    khong:["Ngân sách rất eo hẹp","Thích chua sáng nhẹ kiểu Arabica"],
    link:"https://buicoffeesupply.com/san-pham/fine-robusta-nam-ban-len-men-muoi/", anh:"assets/img/products/beans-tin.jpg" },
  { id:"nb-tamtrinh", brand:"Tám Trình Coffee", ten:"Arabica Cầu Đất & Lạc Dương Blend (pha máy) 250g", nhom:"hat", gia:150000, gram:250,
    slug:"tam-trinh-arabica-blend", pha:["espresso","phin"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất + Lạc Dương, Lâm Đồng",
    giong:"Arabica blend", doCao:"", process:"Washed", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"30 năm · nhà máy xuất khẩu", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — blend cân bằng, dễ uống, hợp pha máy/phin. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    nen:["Mở quán, cần nguồn ổn định","Mua sỉ nhân xanh","Thích blend cân bằng"],
    khong:["Chỉ mua lẻ 1 gói thử","Muốn single-origin rõ vùng"],
    link:"https://tamtrinhcoffee.com/arabica-blend-ca-phe-pha-may/", anh:"assets/img/products/tamtrinh-natural.jpg" },
  { id:"nb-dehavi", brand:"Dehavi (Hân Vinh)", ten:"Cà phê Đặc Sản Arabica Lạc Dương 250g", nhom:"hat", gia:130000, gram:250,
    slug:"dehavi-arabica-lac-duong", pha:["phin","espresso"],
    vungSlug:"lac-duong", xaHuyen:"Lạc Dương, Lâm Đồng",
    giong:"Arabica", doCao:"", process:"Rang mộc nguyên chất", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"OCOP 4 sao · ISO 22000", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — sạch, dịu, dễ tiếp cận cho người mới uống đặc sản; giá mềm nhất nhóm. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    nen:["Mới uống đặc sản","Ngân sách vừa","Muốn thử mà không tốn nhiều"],
    khong:["Muốn dòng đạt giải quốc tế","Cần sơ chế đặc biệt"],
    link:"https://shopee.vn/dehavicoffee_official", anh:"assets/img/products/dehavi-bag.jpg" },
  /* ===== 2 nhà mới (Thay đổi ③) — số liệu tra web thật 07/2026, giá THAM KHẢO, tested:false. ===== */
  { id:"mb-yellowcherry", brand:"The Married Beans", ten:"Yellow Cherry Natural Cầu Đất (nhân xanh) 500g", nhom:"hat", gia:450000, gram:500,
    slug:"married-beans-yellow-cherry-cau-dat", pha:["v60","coldbrew"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất, Xuân Trường, Đà Lạt",
    giong:"Yellow Cherry (Arabica)", doCao:"1550 MASL", process:"Natural lên men sâu", roast:"", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Chứng nhận SGS · Cầu Đất 1.550m", diem:null, chua:null, dam:null, hau:null,
    flavor:"Nhân xanh (green bean, cần rang trước khi pha). Rang lên uống thử: trái cây nhiệt đới, rượu mận, ngọt thanh — hợp Cold Brew, Pour Over rang sáng. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
    notes:["Trái cây nhiệt đới","Rượu mận","Ngọt thanh"],
    nen:["Người tự rang / có mối rang","Thích lô truy xuất rõ nguồn gốc"],
    khong:["Muốn mua về pha uống ngay (đây là nhân xanh)","Chưa có thiết bị rang"],
    link:"https://www.themarriedbeans.com/collections/ca-phe-dac-san-specialty-coffee", anh:"assets/img/products/green-beans.jpg" },
  { id:"lv-balanced", brand:"Là Việt Coffee", ten:"Là Việt Balanced 100% Arabica (hạt rang) 250g", nhom:"hat", gia:160000, gram:250,
    slug:"la-viet-balanced-arabica-da-lat", pha:["phin","espresso"],
    vungSlug:"da-lat", xaHuyen:"Đà Lạt, Lâm Đồng",
    giong:"Arabica (Catimor/Bourbon)", doCao:"~1500m", process:"Medium roast blend", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Asia Top 80 · Đà Lạt", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — cân bằng chua-đắng, dịu, tinh tế; hợp phin, moka pot, máy pha, mua về pha ngay. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
    notes:["Cân bằng","Dịu","Tinh tế"],
    nen:["Muốn Arabica Đà Lạt dễ uống","Pha phin/máy tại nhà","Thương hiệu uy tín Asia Top 80"],
    khong:["Muốn single-origin lô rõ vùng","Thích vị mạnh gắt kiểu Robusta"],
    link:"https://beacons.ai/laviet.coffee", anh:"assets/img/products/hand-beans.jpg" }
];

const CAP_SS = [];

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
    a:"Điểm số chỉ đến từ nếm mù (che nhãn, che giá) theo quy trình. Nhiều gói chúng tôi đã mua và uống thật, thấy ngon — nhưng chưa chấm mù chính thức nên chưa gắn số. Gói đã uống ghi rõ nhãn “Đã uống”; gói đã chấm mù mới có điểm. Chúng tôi không bịa số cho cảm nhận chưa đo lường." },
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

/* ---- Vùng nguyên liệu — hub kiến thức cà phê Lâm Đồng.
   `diaDanh` để đối chiếu; sản phẩm nối vùng qua trường vungSlug của SP.
   Trường vi / than (mô tả CHỮ) là phần soạn nội dung riêng — để placeholder khi chưa có. ---- */
const VUNG = [
  {
    slug: "lam-dong", ten: "Lâm Đồng", hub: true,
    anh: "assets/img/regions/da-lat.jpg",
    banDo: "assets/img/regions/lam-dong-map.png",
    banDoCaption: "Bản đồ vùng trồng: Lâm Đồng nằm ở lõi cao nguyên — Lạc Dương, Cầu Đất (Arabica) và Lâm Hà, Di Linh (Robusta).",
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
    anh: "assets/img/regions/cau-dat.jpg",
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
    anh: "assets/img/regions/nam-ban.jpg",
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
  },
  {
    slug: "lac-duong", ten: "Lạc Dương",
    anh: "assets/img/regions/lac-duong.jpg",
    diaDanh: ["Lạc Dương", "Lang Biang", "Đạ Sar"],
    tinh: "Lạc Dương, Lâm Đồng",
    doCao: "~1.400–1.500m",
    giong: "Arabica (Catimor, Bourbon)",
    hopPha: "V60 / Pour over",
    tagline: "Arabica dưới chân Lang Biang — sạch, cân bằng.",
    vi: "Arabica dưới chân núi Lang Biang — sạch, cân bằng, nhiều nông hộ người K'Ho.",
    diemNhan: ["Dưới chân núi Lang Biang", "Arabica vùng cao", "Nhiều nông hộ K'Ho"],
    than: [
      "<p><b>Lạc Dương</b> nằm ngay dưới chân núi Lang Biang, phía bắc Đà Lạt, ở độ cao khoảng 1.400–1.500m. Đây là một trong những vùng Arabica đặc sản đáng chú ý nhất Lâm Đồng, với nhiều nông hộ người <b>K'Ho</b> canh tác lâu đời.</p>",
      "<p>Khí hậu mát quanh năm cùng độ cao lớn khiến quả cà phê chín chậm, cho hạt có <b>độ chua cân bằng, thân sạch và hậu vị dễ chịu</b>. Các giống phổ biến là Catimor và Bourbon. Nhiều lô ở đây được sơ chế bằng phương pháp phơi chậm gác mái của người K'Ho, giúp hạt khô đều và ít phụ thuộc thời tiết. Cà phê Lạc Dương hợp pha V60 hoặc pour over để tôn vị.</p>"
    ]
  },
  {
    slug: "da-lat", ten: "Đà Lạt (thành phố)",
    anh: "assets/img/regions/da-lat.jpg",
    diaDanh: ["Đà Lạt", "Trại Mát"],
    tinh: "TP Đà Lạt, Lâm Đồng",
    doCao: "~1.500m",
    giong: "Arabica",
    hopPha: "Đa dạng",
    tagline: "Trung tâm roastery & văn hóa cà phê đặc sản.",
    vi: "Trung tâm roastery và văn hóa cà phê đặc sản của cả vùng cao nguyên.",
    diemNhan: ["Nơi tụ hội roastery specialty", "Văn hóa pour over", "Điểm đến cà phê"],
    than: [
      "<p><b>Đà Lạt</b> — thành phố ở độ cao khoảng 1.500m — không chỉ là vùng trồng mà còn là nơi hội tụ các nhà rang và quán specialty của Lâm Đồng. Đây là điểm mà văn hóa uống cà phê đặc sản Việt Nam thể hiện rõ nhất: pour over, cold brew, single origin thay cho cà phê pha sẵn.</p>",
      "<p>Xung quanh Đà Lạt là các tiểu vùng trồng Arabica trứ danh như Cầu Đất, Trại Mát. Trong thành phố, nhiều roastery vừa rang vừa mở quán để khách trải nghiệm trực tiếp từ hạt tới ly. Nếu các vùng khác kể câu chuyện <b>nguyên liệu</b>, thì Đà Lạt kể câu chuyện <b>trải nghiệm và tay nghề rang pha</b>.</p>"
    ]
  }
];

/* ---- Nhà rang — hồ sơ 6 nhà. Kiến trúc: Vùng → Nhà rang → Sản phẩm → Review.
   `sanPham` liệt kê id sản phẩm của nhà trên Gu (để nối review + tính điểm TB).
   `vungSlug` trỏ vùng nguyên liệu chính. gioiThieu/lichSu (chữ) để soạn thêm sau. ---- */
const ROASTER = [
  {
    slug: "bui-coffee-supply", ten: "Bui Coffee Supply",
    vungChinh: "Nam Ban", vungSlug: "nam-ban", web: "https://buicoffeesupply.com",
    gioiThieu: "Nhà rang chuyên nghiệp và có thành tích quốc tế cao nhất trong nhóm chúng tôi theo dõi ở Lâm Đồng. Muốn thử một hạt Fine Robusta được thế giới công nhận thì đây là nơi bắt đầu.",
    lichSu: "<p>Bui Coffee Supply ra đời năm 2021 với phương châm <b>“Work for better coffee”</b>, đặt nông trại Bui Origin tại Mê Linh, Lâm Hà. Cột mốc lớn nhất: dòng <b>Fine Robusta Nam Ban</b> đạt <b>Top 14 Thế Giới năm 2024</b> theo cuộc thi của CQI, cùng nhiều giải Vietnam Amazing Cup 2024–2026.</p><p>Về năng lực, xưởng rang công suất hơn <b>5 tấn mỗi ngày</b>, đạt các chứng nhận FDA, HACCP, ISO 22000 và xuất khẩu tới hơn 12 quốc gia. Điểm khác biệt của Bùi nằm ở mảng sơ chế sáng tạo — lên men muối, decaf, yếm khí kéo dài — cho ra những hạt có hương vị rất riêng. Chúng tôi xếp Bùi vào nhóm cà phê đặc sản đấu giải, không phải cà phê phổ thông.</p>",
    sanPham: ["nb-bui"], diemTB: null, chungNhan: "Top 14 Thế giới · CQI 2024"
  },
  {
    slug: "dehavi", ten: "Dehavi (Hân Vinh)",
    vungChinh: "Nam Ban", vungSlug: "nam-ban", web: "https://dehavi.com",
    gioiThieu: "Nhà bán lẻ giá mềm nhất trong nhóm, gốc ngay tại xã Nam Ban. Mới bắt đầu uống cà phê đặc sản và không muốn tốn nhiều thì Dehavi là điểm vào dễ chịu.",
    lichSu: "<p>Dehavi là thương hiệu rang xay của <b>Công ty TNHH Cà Phê Hân Vinh</b>, đặt tại thôn Đông Anh, xã Nam Ban, Lâm Hà — hơn <b>20 năm</b> làm nguyên liệu cà phê, đóng vai cầu nối giữa nông hộ với doanh nghiệp trong và ngoài nước.</p><p>Dehavi đạt chứng nhận <b>OCOP 4 sao</b>, ISO 22000, FDA, có nhà máy rang xay công suất lớn và vùng nguyên liệu trải nhiều tỉnh. Dòng đặc sản rang mộc nguyên chất của họ có giá tốt, hợp người uống phổ thông muốn thử hàng đặc sản mà không phải trả nhiều. Định vị của Dehavi là cà phê sạch, giá phải chăng, dễ tiếp cận.</p>",
    sanPham: ["nb-dehavi"], diemTB: null, chungNhan: "OCOP 4 sao · ISO 22000"
  },
  {
    slug: "tam-trinh", ten: "Tám Trình Coffee",
    vungChinh: "Nam Ban", vungSlug: "nam-ban", web: "https://tamtrinhcoffee.com",
    gioiThieu: "Thương hiệu lâu đời nhất trong nhóm, mạnh về sản xuất, xuất khẩu và du lịch trải nghiệm cà phê. Hợp người mở quán, mua sỉ hoặc muốn tham quan tour cà phê.",
    lichSu: "<p>Tám Trình là công ty cà phê <b>30 năm tuổi</b> đặt tại Gia Lâm, Lâm Hà — trên cung đường du lịch ngoại thành nổi tiếng của Đà Lạt, gần Thác Voi. Họ có nhà máy xuất khẩu riêng, khu du lịch trải nghiệm với các tour cà phê nhiều độ dài, phục vụ cả tiếng Việt, tiếng Anh và tiếng Hàn.</p><p>Trên kệ bán lẻ, thế mạnh của Tám Trình là mảng <b>nhân xanh</b> và cà phê sỉ với nhiều loại Robusta chế biến kỹ. Vì là nhà sản xuất lâu năm quy mô lớn, họ hợp với người cần nguồn ổn định để mở quán. Với người mua lẻ về pha, chúng tôi ưu tiên các gói Arabica của họ hơn là dòng blend thương mại.</p>",
    sanPham: ["nb-tamtrinh"], diemTB: null, chungNhan: "30 năm · nhà máy xuất khẩu"
  },
  {
    slug: "son-pacamara", ten: "Sơn Pacamara",
    vungChinh: "Lạc Dương", vungSlug: "lac-duong", web: "",
    gioiThieu: "Farm kiêm roastery nhỏ của ông Sơn tại Đà Lạt, làm Arabica vùng cao theo kiểu thủ công, minh bạch. Đây là nhà làm ra gói cà phê chúng tôi chấm cao nhất tới giờ.",
    lichSu: "<p>Sơn Pacamara là câu chuyện của <b>ông Sơn</b> — người mua đất ở Đà Lạt hơn hai mươi năm trước để trồng rau và hoa, tình cờ có sẵn vài cây Catimor trên đất, rồi bén duyên với cà phê đặc sản. Phương châm của ông ghi thẳng trên bao bì: <b>“No secrets, just passion”</b> (không giấu nghề, chỉ có đam mê).</p><p>Farm và roastery nằm ngay tại Đà Lạt, dưới chân vùng Lang Biang, chuyên các dòng Arabica như <b>Lang Biang</b> và <b>Heirloom</b>. Ông Sơn còn rang thuê cho các nông hộ khác, mỗi gói cà phê gửi kèm ghi chú về người trồng và cách pha. Sơn Pacamara mở cửa farm cho bất kỳ ai muốn tìm hiểu — đúng tinh thần cởi mở mà chúng tôi đánh giá cao.</p>",
    sanPham: ["lb1"], diemTB: "9.3/10 · 1 gói đã nếm", chungNhan: "Farm minh bạch · Lạc Dương"
  },
  {
    slug: "the-married-beans", ten: "The Married Beans",
    vungChinh: "Cầu Đất", vungSlug: "cau-dat", web: "https://www.themarriedbeans.com",
    gioiThieu: "Nhà làm cà phê đặc sản nghiêm túc bậc nhất ở Cầu Đất, ghi rõ độ cao, giống, sơ chế và hương vị cho từng lô. Chúng tôi đã uống và thấy ngon — điểm chấm mù sẽ cập nhật sau.",
    lichSu: "<p>The Married Beans thành lập năm 2015 tại Đà Lạt (số ĐKKD do Sở KHĐT Lâm Đồng cấp 08/07/2015), cửa hàng ở 06 Nguyễn Văn Trỗi. Họ đồng hành với bà con nông dân các vùng <b>Cầu Đất, Đạ Sar, Lang Biang</b>, hiện liên kết hơn <b>60 nông hộ</b> canh tác khoảng <b>120 hecta</b> cà phê đặc sản.</p><p>Điểm khiến chúng tôi chú ý: mỗi lô cà phê của họ đều ghi minh bạch giống, độ cao, phương pháp sơ chế và tasting note — đúng kiểu dữ liệu mà Gu Cà Phê trân trọng. Họ đạt chứng nhận quốc tế <b>SGS</b> và có mảng xuất khẩu nhân xanh. Lưu ý: phần lớn hàng bán trên web của họ là nhân xanh (cà phê sống, cần rang trước khi pha), không phải hạt rang uống ngay.</p>",
    sanPham: ["mb-yellowcherry"], diemTB: null, chungNhan: "Chứng nhận SGS · Cầu Đất"
  },
  {
    slug: "la-viet", ten: "Là Việt Coffee",
    vungChinh: "Đà Lạt", vungSlug: "da-lat", web: "https://laviet.coffee",
    gioiThieu: "Roastery kiêm quán specialty biểu tượng của thành phố Đà Lạt, tự trồng, sơ chế, rang và pha. Chúng tôi đã uống và thấy ngon — điểm chấm mù sẽ cập nhật sau.",
    lichSu: "<p>Là Việt thành lập năm 2015 bởi Trần Nhật Quang, theo triết lý <b>“plant, process, roast and brew”</b> (trồng, sơ chế, rang và pha) — làm chủ toàn bộ chuỗi từ hạt tới ly. Không gian rang mở ngay trong quán để khách nhìn thấy cả quy trình.</p><p>Đây là một trong những cái tên specialty được biết đến nhiều nhất Đà Lạt, từng lọt danh sách <b>Asia’s Top 80</b> quán cà phê, cộng đồng theo dõi lớn trên mạng xã hội. Họ tập trung vào Arabica Đà Lạt vùng cao, có dòng hạt rang bán lẻ theo ba mức rang, đóng túi có van và ghi ngày rang — thuận tiện để mua về pha tại nhà. Nếu Sơn Pacamara đại diện cho farm thủ công thì Là Việt đại diện cho văn hóa và trải nghiệm cà phê đô thị.</p>",
    sanPham: ["lv-balanced"], diemTB: null, chungNhan: "Asia Top 80 · Đà Lạt"
  }
];

/* ---- Gợi ý theo nhu cầu — "Mua cho ai". Mỗi nhóm khách trỏ tới 1 gói (spId).
   Dùng ở hub /ca-phe để khách quyết định nhanh rồi bấm mua. ---- */
const NHUCAU = [
  { label: "Mới uống · tiết kiệm", vi: "Nhập môn đặc sản, không tốn nhiều tiền.", spId: "nb-dehavi" },
  { label: "Ngon chuẩn giải quốc tế", vi: "Fine Robusta Nam Ban — Top 14 Thế Giới 2024.", spId: "nb-bui" },
  { label: "Chua sáng · pha V60", vi: "Arabica vùng cao, gói điểm nếm mù cao nhất.", spId: "lb1" },
  { label: "Mở quán · mua sỉ", vi: "Nguồn ổn định, mạnh nhân xanh và số lượng.", spId: "nb-tamtrinh" },
  { label: "Cà phê Đà Lạt uống ngày", vi: "Hạt rang pha ngay, cân bằng, dễ uống.", spId: "lv-balanced" },
  { label: "Tự rang · lô đặc biệt", vi: "Nhân xanh Cầu Đất, sơ chế lên men sâu.", spId: "mb-yellowcherry" }
];
