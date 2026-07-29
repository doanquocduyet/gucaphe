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
  "Mọi mẫu đều được pha trong <b>cùng điều kiện</b>: cỡ xay <code>medium</code>, tỷ lệ <code>1:15</code>, nước <code>92°C</code>.",
  "Nếm <b>mù</b> — che nhãn, che giá; chấm điểm xong mới bóc ra xem là loại nào.",
  "Ghi nhận <b>ba tiêu chí cảm quan</b>: độ chua, độ đậm, hậu vị. Đồng thời hiển thị giá quy đổi <code>/100g</code> để dễ so sánh — giá không phải tiêu chí cảm quan.",
  "Gói đã uống nhưng <b>chưa nếm mù</b> được gắn nhãn <b>“Đã uống”</b> — không công bố điểm số, không chấm theo cảm nhận nhớ lại."
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
   → MẪU ĐĂNG SẢN PHẨM copy-paste: docs/product-template.js
     ĐẶC TẢ đầy đủ (thứ tự section, quy tắc ẩn/hiện): docs/product-review-spec.md
   ============================================================ */
const SP = [
  { id:"lb1", guPick:"editor", confidence:"blind_tested", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true}, brand:"Sơn Pacamara", ten:"Lang Biang Specialty 250g", nhom:"hat", gia:270000, gram:250,
    slug:"son-pacamara-lang-biang", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Lạc Dương, Lâm Đồng",
    giong:"Catimor, Caturra", doCao:"", process:"Natural", roast:"Light", ngayRang:"",
    tested:true, daUong:true, chungNhan:"Farm minh bạch · Lạc Dương", diem:9.3, chua:4, dam:3, hau:5, ngot:4, sach:5,
    chot:"Một trong những Arabica cân bằng, sạch nhất Gu từng thử.",
    nhanXet:"Gói Arabica cân bằng và sạch, rất hợp người bắt đầu với V60. Chua sáng vừa phải kiểu cam chanh, hương hoa rõ, hậu vị ngọt kéo dài — không quá ‘đấu giải’, rất dễ thích. Giá 108k/100g là hợp lý cho chất lượng này.",
    flavor:"Hoa, đào, cam vàng, mật ong. Hậu vị sạch và kéo dài.", notes:["Hoa","Đào","Cam vàng","Mật ong"],
    tags:["Chua sáng","Hương hoa quả","Pha V60"],
    viSaoDiem:["Hậu vị rất sạch, kéo dài","Hương hoa rõ, chua sáng cân bằng","Không có lỗi vị (defect)","Giá/100g hợp lý cho chất lượng"],
    nen:["Pha V60 hoặc pour over","Thích vị trái cây, chua sáng","Chấp nhận 108.000₫/100g cho hạt tốt"],
    khong:["Chỉ có phin — rang sáng pha phin dễ chua gắt","Quen gu đậm đắng","Muốn cà phê uống hằng ngày giá mềm"],
    faq:[
      {q:"Gói này có hợp pha V60 không?",a:"Rất hợp. Rang sáng, chua sáng và hương hoa của gói này được V60 / pour over tôn lên rõ nhất. Pha phin dễ bị chua gắt."},
      {q:"Người mới nên bắt đầu với gói này?",a:"Hợp nếu bạn muốn làm quen vị Arabica chua sáng, sạch. Nếu quen gu phin đậm đắng thì nên chuyển dần."},
      {q:"Giá 270.000₫ có đáng không?",a:"Quy ra 108.000₫/100g — thuộc nhóm cao, nhưng đây là gói Gu chấm mù cao nhất tới nay (9,3/10). Với người thật sự để ý vị, đáng."}
    ],
    link:"https://s.shopee.vn/AUsMz3wGhY", anh:"assets/img/products/cherries-branch.jpg" },

  /* ===== Sơn Pacamara — 2 gói micro-lot khác (xác minh từ store chính thức). ===== */
  { id:"sp-pacamara", guPick:"signature", confidence:"editor_research", verificationDate:"2026-07-29",
    selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true},
    brand:"Sơn Pacamara", ten:"Pacamara Sơn Farm — Micro-lot", nhom:"hat", gia:205000, gram:100,
    slug:"son-pacamara-pacamara", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Sơn Farm, Đà Lạt",
    giong:"Pacamara", doCao:"", process:"Anaerobic washed", roast:"Light", ngayRang:"",
    tested:false, daUong:false, chungNhan:"", diem:null, chua:null, dam:null, hau:null,
    chot:"Giống Pacamara hiếm, lên men anaerobic — chính là nguồn cảm hứng đặt tên Sơn Pacamara.",
    flavor:"Micro-lot Pacamara lên men anaerobic từ Sơn Farm. Nhà rang mô tả vị chua trái cây mọng nước, hương hoa trắng, ngọt dày và công bố 81–83 điểm SCA. Gu chưa nếm mù nên chưa gắn điểm.",
    notes:[], tags:["Pacamara","Anaerobic","Pour over"],
    nen:["Muốn thử giống hiếm Pacamara","Pha V60 / pour over để tôn hương","Thích khám phá lô lên men"],
    khong:["Chủ yếu pha phin đậm sữa","Thích vị quen, an toàn"],
    faq:[
      {q:"Pacamara là giống gì?",a:"Là giống lai hạt to hiếm (Pacas × Maragogipe), cho tách cà phê phức hợp, thường thấy ở các cuộc thi đặc sản. Cũng là giống đặt tên cho thương hiệu Sơn Pacamara."},
      {q:"Gói này bao nhiêu điểm?",a:"Nhà rang công bố 81–83 điểm SCA. Gu chưa nếm mù gói này nên chưa gắn điểm của Gu — nếm xong sẽ cập nhật."},
      {q:"Hợp pha gì?",a:"Rang sáng, lên men anaerobic nên hợp pour over (V60, Chemex) để tôn hương trái cây và hoa; không hợp pha phin đậm."}
    ],
    link:"https://store.sonpacamara.com/products/goi-pacamara-tu-son-pacamara-micro-lot-specialty-coffee-viet-phu-hop-pour-over-light-roast", anh:"assets/img/products/son-pacamara-lot.jpg" },

  { id:"sp-heirloom", guPick:"collector", confidence:"editor_research", verificationDate:"2026-07-29",
    selectionCriteria:{signature:false,community:true,khacBiet:true,hocThuat:true,benVung:false},
    brand:"Sơn Pacamara", ten:"Heirloom Sơn Farm 250g", nhom:"hat", gia:null, gram:250,
    slug:"son-pacamara-heirloom", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Sơn Farm, Đà Lạt",
    giong:"Heirloom", doCao:"", process:"Washed", roast:"Light", ngayRang:"",
    tested:false, daUong:false, chungNhan:"", diem:null, chua:null, dam:null, hau:null,
    chot:"Giống Heirloom cổ, washed rang sáng — citrus, ngọt nhẹ.",
    flavor:"Lô Heirloom washed rang sáng từ Sơn Farm. Nhà rang mô tả vị citrus, đường nâu, ngọt nhẹ. Gu chưa nếm mù, chưa gắn điểm. Giá đang cập nhật.",
    notes:[], tags:["Heirloom","Washed","Pour over"],
    nen:["Thích Arabica giống cổ","Pha V60 / pour over","Thích vị citrus, ngọt nhẹ"],
    khong:["Thích vị đậm kiểu Robusta","Chủ yếu pha phin"],
    link:"https://store.sonpacamara.com/products/goi-heirloom-tu-son-pacamara-specialty-coffee-viet-phu-hop-pour-over-aeropress-cold-brew-light-roast", anh:"assets/img/products/son-heirloom.jpg" },

  /* ===== 3 nhà Nam Ban — so sánh trung lập. Chưa nếm mù → tested:false. ===== */
  { id:"nb-bui", guPick:"editor", confidence:"editor_tasted", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true}, brand:"Bui Coffee Supply", ten:"Fine Robusta Nam Ban (lên men muối) 250g", nhom:"hat", gia:179000, gram:250,
    slug:"bui-fine-robusta-nam-ban", pha:["phin","espresso"],
    vungSlug:"nam-ban", xaHuyen:"Nam Ban, Lâm Hà",
    giong:"Fine Robusta", doCao:"", process:"Lên men muối (Natri Clorua)", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Top 14 Thế giới · CQI 2024", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — thân dày, hậu ngọt, đúng chất Fine Robusta đấu giải. Đây là gói để lại ấn tượng mạnh nhất với chúng tôi. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    tags:["Thân dày","Hậu ngọt","Pha phin/máy"],
    nen:["Muốn thử đặc sản đạt giải quốc tế","Gu đậm, thân dày","Pha phin hoặc espresso"],
    khong:["Ngân sách rất eo hẹp","Thích chua sáng nhẹ kiểu Arabica"],
    link:"https://buicoffeesupply.com/san-pham/fine-robusta-nam-ban-len-men-muoi/", anh:"assets/img/products/bui-fine-robusta.jpg" },
  { id:"nb-tamtrinh", guPick:"editor", confidence:"editor_tasted", selectionCriteria:{signature:true,community:false,khacBiet:true,hocThuat:true,benVung:true}, brand:"Tám Trình Coffee", ten:"Arabica Cầu Đất & Lạc Dương Blend (pha máy) 250g", nhom:"hat", gia:150000, gram:250,
    slug:"tam-trinh-arabica-blend", pha:["espresso","phin"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất + Lạc Dương, Lâm Đồng",
    giong:"Arabica blend", doCao:"", process:"Washed", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"30 năm · nhà máy xuất khẩu", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — blend cân bằng, dễ uống, hợp pha máy/phin. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    tags:["Cân bằng","Dễ uống","Pha máy/phin"],
    nen:["Mở quán, cần nguồn ổn định","Mua sỉ nhân xanh","Thích blend cân bằng"],
    khong:["Chỉ mua lẻ 1 gói thử","Muốn single-origin rõ vùng"],
    link:"https://tamtrinhcoffee.com/arabica-blend-ca-phe-pha-may/", anh:"assets/img/products/tamtrinh-natural.jpg" },
  { id:"nb-dehavi", guPick:"editor", confidence:"editor_tasted", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true}, brand:"Dehavi (Hân Vinh)", ten:"Yellow Bourbon Cầu Đất 250g", nhom:"hat", gia:175000, gram:250,
    slug:"dehavi-yellow-bourbon-cau-dat", pha:["phin","espresso"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất, Đà Lạt, Lâm Đồng",
    giong:"Yellow Bourbon (Arabica)", doCao:"1.550–1.700m", process:"Full washed", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"OCOP 4 sao · ISO 22000", diem:null, chua:null, dam:null, hau:null,
    chot:"Yellow Bourbon Cầu Đất — ngọt trái cây, chocolate sữa, hậu vị sạch.",
    nhanXet:"Gói 100% Yellow Bourbon rang mộc từ Cầu Đất (1.550–1.700m), sơ chế full washed. Vị ngọt trái cây, chocolate sữa, thoáng hương nhài, hậu vị sạch — dễ uống, hợp cả pha phin lẫn pha máy. Là dòng chủ lực dễ tiếp cận của Dehavi cho người mới bước vào specialty.",
    flavor:"Đã mua và uống thật — ngọt trái cây, chocolate sữa, thoáng hương nhài, hậu vị sạch. 100% Yellow Bourbon rang mộc. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    tags:["Yellow Bourbon","Ngọt · chocolate","Cầu Đất 1.550m"],
    nen:["Mới uống đặc sản","Thích ngọt trái cây, chocolate sữa","Pha phin hoặc pha máy"],
    khong:["Muốn dòng đạt giải quốc tế","Thích rang nhạt, chua sáng gắt"],
    faq:[
      {q:"Yellow Bourbon là gì?",a:"Là biến chủng Arabica cho quả chín màu vàng, nổi tiếng vị ngọt và cân bằng. Gói này 100% Yellow Bourbon trồng ở Cầu Đất 1.550–1.700m, sơ chế full washed."},
      {q:"Gói này hợp pha gì?",a:"Rang medium, sơ chế washed nên linh hoạt — hợp pha phin và pha máy, vẫn ổn với pour over."},
      {q:"Có hợp người mới không?",a:"Rất hợp. Vị ngọt, sạch, dễ uống, giá dễ tiếp cận — là điểm vào specialty dễ chịu."}
    ],
    link:"https://shopee.vn/dehavicoffee_official", anh:"assets/img/products/dehavi-yellow-bourbon.jpg" },
  /* ===== 2 nhà mới (Thay đổi ③) — số liệu tra web thật 07/2026, giá THAM KHẢO, tested:false. ===== */
  { id:"mb-yellowcherry", guPick:"collector", confidence:"editor_tasted", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:false}, brand:"The Married Beans", ten:"Yellow Cherry Natural Cầu Đất (nhân xanh) 500g", nhom:"hat", gia:450000, gram:500,
    slug:"married-beans-yellow-cherry-cau-dat", pha:["v60","coldbrew"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất, Xuân Trường, Đà Lạt",
    giong:"Yellow Cherry (Arabica)", doCao:"1550 MASL", process:"Natural lên men sâu", roast:"", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Chứng nhận SGS · Cầu Đất 1.550m", diem:null, chua:null, dam:null, hau:null,
    flavor:"Dành cho người tự rang. Nhân xanh (green bean, cần rang trước khi pha). Rang lên uống thử: trái cây nhiệt đới, rượu mận, ngọt thanh — hợp Cold Brew, Pour Over rang sáng. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
    notes:["Trái cây nhiệt đới","Rượu mận","Ngọt thanh"],
    tags:["Nhân xanh","Cần tự rang","Trái cây nhiệt đới"],
    nen:["Người tự rang / có mối rang","Thích lô truy xuất rõ nguồn gốc"],
    khong:["Muốn mua về pha uống ngay (đây là nhân xanh)","Chưa có thiết bị rang"],
    link:"https://www.themarriedbeans.com/collections/ca-phe-dac-san-specialty-coffee", anh:"assets/img/products/green-beans.jpg" },
  { id:"lv-balanced", guPick:"editor", confidence:"editor_tasted", selectionCriteria:{signature:false,community:true,khacBiet:false,hocThuat:false,benVung:true}, brand:"Là Việt Coffee", ten:"Là Việt Balanced 100% Arabica (hạt rang) 250g", nhom:"hat", gia:160000, gram:250,
    slug:"la-viet-balanced-arabica-da-lat", pha:["phin","espresso"],
    vungSlug:"da-lat", xaHuyen:"Đà Lạt, Lâm Đồng",
    giong:"Arabica (Catimor/Bourbon)", doCao:"~1500m", process:"Medium roast blend", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Asia Top 80 · Đà Lạt", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — cân bằng chua-đắng, dịu, tinh tế; hợp phin, moka pot, máy pha, mua về pha ngay. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
    notes:["Cân bằng","Dịu","Tinh tế"],
    tags:["Cân bằng","Dễ uống","Pha phin/máy"],
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
    a:"Là cà phê đạt từ 80/100 điểm theo thang SCA — truy xuất được vùng trồng, giống, cách sơ chế. Trên trang này, mỗi sản phẩm đều ghi rõ ba thông tin đó. Lưu ý: specialty không đồng nghĩa với hợp khẩu vị mọi người — nó nói về chất lượng và tính minh bạch, không phải bạn có thích hay không." },
  { q:"Mua qua link trên trang có đắt hơn không?",
    a:"Không. Bạn mua đúng giá Shopee niêm yết, chúng tôi nhận hoa hồng từ sàn — bạn không trả thêm đồng nào." },
  { q:"Vì sao có sản phẩm không có điểm số?",
    a:"Chúng tôi chỉ công bố điểm sau khi hoàn thành bài nếm mù. Một số gói đã uống nhưng chưa qua quy trình này được gắn nhãn “Đã uống” thay vì điểm số. Chúng tôi không chấm điểm dựa trên cảm nhận nhớ lại." },
  { q:"Vì sao so giá theo 100g thay vì theo gói?",
    a:"Các gói có khối lượng khác nhau (250g, 500g…). Quy về giá/100g mới thấy gói 160.000₫/500g thực ra rẻ hơn nhiều gói 270.000₫/250g." }
];

/* ---- Kiến thức — bài viết ngắn, hiểu trước khi mua ---- */
const BAIVIET = [
  {
    id: "natural-washed",
    anh: "assets/img/art-1.jpg",
    tag: "Sơ chế",
    docPhut: 2, mucDo: "Người mới",
    tieuDe: "Natural hay Washed — vị khác nhau chỗ nào?",
    dek: "Cùng một hạt, hai cách sơ chế cho hai ly hoàn toàn khác. Chọn sai, bạn trách nhầm hạt.",
    than:
      "<p><b>Washed (sơ chế ướt)</b> tách sạch lớp thịt quả trước khi phơi hạt. Ly cà phê <b>sạch, sáng, rõ nét</b> — bạn cảm được đúng chất của giống và vùng đất, chua thanh như trái cây tươi. Đa số specialty rang sáng đi theo hướng này.</p>" +
      "<p><b>Natural (sơ chế khô)</b> phơi nguyên cả quả, để hạt ngâm trong lớp thịt ngọt nhiều tuần. Kết quả: <b>ngọt đậm, thân dày, thiên trái cây chín</b> — dâu, mận, đôi khi hơi lên men như rượu vang. Bù lại, vị kém sạch và mỗi mẻ dễ lệch nhau hơn.</p>" +
      "<p><b>Chọn thế nào?</b> Thích trong trẻo, tinh tế → Washed. Thích ngọt bùng nổ, trái cây rõ → Natural. Trường <i>Sơ chế</i> ở mỗi sản phẩm cho bạn biết ngay mình sắp uống kiểu nào.</p>",
    faq: [
      { q: "Natural khác Washed ở điểm nào?", a: "Washed tách sạch thịt quả trước khi phơi nên vị sạch, sáng, rõ nét. Natural phơi nguyên quả nên ngọt đậm, thân dày, thiên trái cây chín. Cùng một hạt, hai cách sơ chế cho hai ly khác hẳn." },
      { q: "Cà phê Natural có ngọt hơn Washed không?", a: "Thường là có. Vì phơi nguyên quả, hạt Natural ngấm nhiều đường từ lớp thịt hơn nên cảm giác ngọt đậm và thiên trái cây chín rõ hơn Washed." },
      { q: "Natural hợp pha gì?", a: "Natural body dày, ngọt đậm nên hợp cả phin lẫn pour over. Washed sạch và sáng thì tôn vị nhất khi pha V60 / pour over." }
    ],
    links: [
      { label: "Xem các gói đã thử", href: "/ca-phe" },
      { label: "Vị theo từng vùng trồng", href: "/vung-trong" }
    ]
  },
  {
    id: "rang-sang-dam",
    anh: "assets/img/art-2.jpg",
    tag: "Độ rang",
    docPhut: 2, mucDo: "Người mới",
    tieuDe: "Rang sáng hay rang đậm — chọn theo cách pha",
    dek: "Độ rang quyết định ‘ngon hay dở’ nhiều hơn cả giống hạt. Quen phin mà mua nhầm rang sáng là dễ chê oan.",
    than:
      "<p><b>Rang sáng (Light)</b> giữ độ chua và hương hoa quả của hạt. Tuyệt vời với <b>V60 / pour over</b>, nhưng <b>pha phin dễ chua gắt</b> vì phin ngâm lâu, chiết ra nhiều axit.</p>" +
      "<p><b>Rang đậm (Dark)</b> đốt bớt axit, đổi lại <b>thân dày, vị chocolate, đắng rõ</b>. Hợp phin truyền thống và espresso, uống với sữa vẫn ‘gồng’ được vị.</p>" +
      "<p><b>Quy tắc nhanh:</b> Phin → chọn Medium đến Dark. V60 / pour over → chọn Light đến Medium. Cột <i>Rang</i> và <i>Hợp</i> ở mỗi sản phẩm đã ghi sẵn để bạn khỏi đoán.</p>",
    faq: [
      { q: "Pha phin nên chọn rang sáng hay rang đậm?", a: "Chọn Medium đến Dark. Rang sáng ngâm lâu trong phin dễ chua gắt; rang đậm cho body dày, vị chocolate, hợp gu phin truyền thống hơn." },
      { q: "Rang sáng có phải chưa chín không?", a: "Không. Rang sáng (Light) là mức rang chủ đích để giữ độ chua và hương hoa quả của hạt — không phải rang thiếu. Nó chỉ hợp pha pour over hơn pha phin." },
      { q: "Rang đậm có ít caffeine hơn không?", a: "Chênh lệch rất nhỏ, gần như không đáng kể. Cảm giác 'mạnh' của rang đậm đến từ vị đắng và body, không phải từ lượng caffeine cao hơn." }
    ],
    links: [
      { label: "Gói hợp phin (body dày) — vùng Nam Ban", href: "/vung-trong/nam-ban" },
      { label: "Gói hợp V60 (chua sáng) — vùng Cầu Đất", href: "/vung-trong/cau-dat" }
    ]
  },
  {
    id: "co-xay",
    anh: "assets/img/products/beans-tin.jpg",
    tag: "Cỡ xay",
    docPhut: 2, mucDo: "Người mới",
    tieuDe: "Cỡ xay cà phê — chọn theo cách pha",
    dek: "Xay sai cỡ thì hạt ngon vẫn ra ly dở. Mỗi cách pha cần một cỡ xay riêng.",
    than:
      "<p>Cùng một gói cà phê, xay sai cỡ là ra ly khác hẳn. <b>Cỡ xay quyết định tốc độ nước chảy qua bột</b>: xay quá mịn thì nước chảy chậm, chiết quá nhiều — vị đắng gắt; xay quá thô thì nước chảy nhanh, chiết chưa tới — vị loãng và chua.</p>" +
      "<p><b>Quy tắc chung:</b> cách pha càng nhanh thì xay càng mịn. Espresso (pha máy) chỉ vài chục giây → xay <b>mịn</b>. Phin và Moka pot lâu hơn → <b>mịn vừa</b>. Pour over / V60 → cỡ <b>thường</b>. Cold brew ngâm nhiều giờ → xay <b>thô</b>.</p>" +
      "<p>Nếu mua hạt về tự xay, chỉnh cối theo bảng dưới rồi nếm và tinh chỉnh: <b>đắng gắt thì xay thô hơn, chua loãng thì xay mịn hơn</b>.</p>",
    faq: [
      { q: "Pha phin nên xay cỡ nào?", a: "Xay mịn vừa — cỡ như cát mịn. Mịn quá thì phin chảy quá chậm, dễ đắng; thô quá thì nước loãng, nhạt." },
      { q: "Pha máy (espresso) xay mịn hay thô?", a: "Xay mịn. Espresso chiết rất nhanh dưới áp suất nên cần bột mịn để đủ vị; xay thô sẽ ra chua và loãng." },
      { q: "Pha V60 nên xay cỡ nào?", a: "Cỡ thường (medium) — như đường cát. Đây là điểm cân bằng cho pour over; đắng thì xay thô hơn, chua loãng thì xay mịn hơn." }
    ],
    links: [
      { label: "Cách Gu pha khi test", href: "/cach-test" },
      { label: "Xem các gói đã thử", href: "/ca-phe" }
    ]
  },
  {
    id: "cong-thuc-pha",
    anh: "assets/img/p3-cup.jpg",
    tag: "Pha chuẩn",
    docPhut: 2, mucDo: "Thực hành",
    tieuDe: "Công thức pha chuẩn theo cách pha",
    dek: "Cùng một hạt, sai tỉ lệ hay nhiệt độ là hỏng. Đây là công thức nền để bắt đầu, rồi tinh chỉnh theo gu.",
    than:
      "<p>Không có con số nào đúng tuyệt đối, nhưng có <b>điểm khởi đầu chuẩn</b> cho từng cách pha. Pha xong thấy <b>đắng gắt → giảm cà phê hoặc hạ nhiệt độ</b>; thấy <b>chua loãng → tăng cà phê, xay mịn hơn hoặc tăng nhiệt</b>.</p>" +
      "<p>Bảng dưới là công thức nền Gu dùng khi thử. Tỉ lệ ghi theo dạng <b>cà phê : nước</b> — ví dụ 1:15 nghĩa là 1g cà phê cho 15ml nước.</p>",
    faq: [
      { q: "Tỉ lệ 1:15 nghĩa là gì?", a: "1g cà phê cho 15ml nước. Ví dụ 16g cà phê thì dùng khoảng 240ml nước. Tỉ lệ càng nhỏ (1:12) thì càng đậm, càng lớn (1:17) thì càng nhạt." },
      { q: "Nước pha cà phê nên bao nhiêu độ?", a: "Khoảng 90–93°C cho phần lớn cách pha. Nóng quá (sôi 100°C) dễ ra đắng gắt; nguội quá thì chiết chưa tới, chua và nhạt." },
      { q: "Pha phin theo tỉ lệ nào?", a: "Khoảng 1:4 — đậm hơn nhiều cách pha khác vì đây là kiểu pha đặc truyền thống. Ví dụ 20g cà phê cho ~80ml nước." }
    ],
    links: [
      { label: "Chọn cỡ xay theo cách pha", href: "/kien-thuc/co-xay" },
      { label: "Xem các gói đã thử", href: "/ca-phe" }
    ]
  },
  {
    id: "do-tuoi",
    anh: "assets/img/products/beans-tin.jpg",
    tag: "Độ tươi",
    docPhut: 2, mucDo: "Thực hành",
    tieuDe: "Cà phê ngon nhất khi nào? Đọc ngày rang",
    dek: "Cà phê vừa rang xong chưa chắc ngon nhất. Có một “tuần vàng” để thưởng thức.",
    than:
      "<p>Hạt cà phê rang xong vẫn <b>nhả khí CO₂</b> trong nhiều ngày (gọi là <i>degas</i>). Pha ngay lúc còn quá nhiều khí thì nước khó thấm đều, vị chưa ổn định. Vì vậy hãy nhìn <b>ngày rang</b> trên bao, đừng chỉ nhìn hạn dùng.</p>" +
      "<p>Bảo quản nơi khô mát, tránh nắng và không khí; xay tới đâu pha tới đó. Túi có van một chiều và ghi ngày rang là dấu hiệu nhà rang làm nghiêm túc.</p>",
    faq: [
      { q: "Cà phê rang xong bao lâu thì uống ngon nhất?", a: "Khoảng 7–45 ngày sau ngày rang — gọi là 'tuần vàng'. Trước đó hạt còn nhả khí, sau đó hương vị nhạt dần." },
      { q: "Cà phê để lâu có hỏng không?", a: "Sau ~45 ngày vẫn uống được nếu bảo quản kín, khô mát — chỉ kém tươi và thơm hơn. Đừng để nơi nóng, ẩm hay nắng chiếu." },
      { q: "Nên nhìn ngày rang hay hạn dùng?", a: "Ngày rang. Hạn dùng thường rất xa, còn chất lượng vị phụ thuộc thời gian kể từ ngày rang." }
    ],
    links: [
      { label: "Phương pháp đánh giá của Gu", href: "/cach-test" },
      { label: "Xem các gói đã thử", href: "/ca-phe" }
    ]
  },
  {
    id: "vi-sao-specialty-dat",
    anh: "assets/img/art-3.jpg",
    tag: "Đáng tiền không?",
    docPhut: 3, mucDo: "Người mới",
    tieuDe: "Specialty đắt hơn — bạn trả tiền cho điều gì?",
    dek: "Một gói 250g specialty có thể đắt gấp 3–4 lần cà phê phổ thông. Đáng hay không tuỳ cách bạn uống.",
    than:
      "<p><b>1. Điểm số thật.</b> Specialty là hạt đạt từ 80/100 theo thang SCA — được chấm mù bởi bên thứ ba, không phải nhà bán tự phong.</p>" +
      "<p><b>2. Truy xuất nguồn gốc.</b> Bạn biết vùng trồng, giống, cách sơ chế — không phải ‘cà phê nguyên chất’ chung chung.</p>" +
      "<p><b>3. Hái chọn quả chín.</b> Chỉ hái quả chín đỏ thay vì tuốt cả cành xanh–chín làm tăng chi phí nhân công, nhưng đó là gốc rễ của vị ngọt sạch.</p>" +
      "<p><b>Có đáng không?</b> Nếu bạn pha máy/pour over và thật sự để ý vị — đáng. Nếu pha phin đậm uống với sữa mỗi sáng, một gói rang mộc giá mềm có khi hợp hơn. Chúng tôi không ép — chỉ tính giúp bạn <b>giá/100g</b> để so cho sòng phẳng.</p>",
    faq: [
      { q: "Cà phê specialty là gì?", a: "Là cà phê đạt từ 80/100 điểm theo thang SCA, truy xuất được vùng trồng, giống và cách sơ chế. Nó nói về chất lượng và minh bạch, không đồng nghĩa với 'hợp khẩu vị mọi người'." },
      { q: "Vì sao cà phê specialty đắt hơn?", a: "Vì hái chọn quả chín, sơ chế và rang có kiểm soát, truy xuất nguồn gốc và đạt điểm cupping thật. Chi phí nhân công và kiểm soát chất lượng cao hơn cà phê phổ thông." },
      { q: "Người pha phin uống sữa có nên mua specialty không?", a: "Không bắt buộc. Nếu bạn pha phin đậm uống với sữa mỗi sáng, một gói rang mộc giá mềm có khi hợp hơn. Specialty đáng tiền nhất khi bạn pha pour over/máy và thật sự để ý vị." }
    ],
    links: [
      { label: "So giá/100g các gói đã thử", href: "/ca-phe" },
      { label: "Để Gu chọn theo gu của bạn", href: "/#pick" }
    ]
  },
  {
    id: "ca-phe-nam-ban-nha-nao",
    anh: "assets/img/art-1.jpg",
    tag: "So sánh",
    docPhut: 4, mucDo: "Chọn mua",
    tieuDe: "Nên mua cà phê Nam Ban của nhà nào?",
    dek: "Bùi, Tám Trình hay Dehavi — ba nhà mạnh nhất Nam Ban, mỗi nhà một thế mạnh. Gu mua thật, pha mù, chấm điểm để bạn chọn đúng gói cho túi tiền của mình.",
    than:
      "<p>Nam Ban (Lâm Hà, Lâm Đồng) có ba nhà cà phê đáng chú ý nhất: <b>Bùi</b>, <b>Tám Trình</b> và <b>Dehavi</b>. Cả ba đều tự nói mình ngon — vì họ là người bán. Trang này khác: chúng tôi không bán cà phê của mình, mà mua của cả ba, pha mù, chấm theo cùng một thang.</p>" +
      "<p><b>Chọn nhanh:</b> Mới uống, muốn Arabica dễ uống → <b>Dehavi Yellow Bourbon Cầu Đất (175k)</b>. Muốn ngon chuẩn giải quốc tế → <b>Bùi Fine Robusta Nam Ban (179k)</b>, dòng đạt Top 14 Thế Giới 2024. Mở quán hoặc mua sỉ → <b>Tám Trình</b>, 30 năm, mạnh nhân xanh.</p>" +
      "<p><b>① Bùi</b> (nông trại Bui Origin, Mê Linh): chuyên nghiệp và thành tích quốc tế nhất. Fine Robusta Nam Ban Top 14 Thế Giới 2024, xưởng 5 tấn/ngày, chứng nhận FDA/HACCP/ISO22000, xuất khẩu 12+ nước. Hợp người muốn trải nghiệm đặc sản đỉnh cao. Giá: Fine Robusta Nam Ban 179k, Arabica Cầu Đất 189k.</p>" +
      "<p><b>② Tám Trình</b> (Gia Lâm): lâu đời nhất, 30 năm, mạnh sản xuất, xuất khẩu và du lịch trải nghiệm. Shop mạnh mảng nhân xanh và sỉ. Hợp người mở quán, mua sỉ. Giá lẻ: coldbrew 100–280k, Arabica blend 150–280k.</p>" +
      "<p><b>③ Dehavi</b> (Đông Anh, Nam Ban): mạnh dòng Arabica rang mộc dễ uống, nhiều mức giá dễ tiếp cận. Chứng nhận OCOP 4 sao, ISO22000, FDA. Dòng chủ lực: Yellow Bourbon Cầu Đất 175k; ngoài ra có Arabica Lạc Dương 130k, Moka 230k.</p>" +
      "<p><b>Cam kết:</b> Chúng tôi không nhận tài trợ để viết bài này. Điểm số cập nhật sau khi nếm mù từng gói — ngon thật chấm cao thật, có điểm yếu nói thẳng. Chưa uống thì chúng tôi không chấm.</p>",
    faq: [
      { q: "Cà phê Nam Ban nên mua nhà nào?", a: "Tuỳ nhu cầu: mới uống, muốn Arabica dễ uống → Dehavi Yellow Bourbon Cầu Đất (175k). Muốn chuẩn giải quốc tế → Bùi Fine Robusta Nam Ban (179k), Top 14 Thế Giới 2024. Mở quán, mua sỉ → Tám Trình, 30 năm, mạnh nhân xanh." },
      { q: "Cà phê Bùi (Bui Coffee) có tốt không?", a: "Bùi là nhà có thành tích quốc tế cao nhất nhóm: Fine Robusta Nam Ban đạt Top 14 Thế Giới 2024, xưởng 5 tấn/ngày, chứng nhận FDA/HACCP/ISO 22000. Hợp người muốn trải nghiệm đặc sản đỉnh cao." },
      { q: "Cà phê Nam Ban rẻ nhất mua ở đâu?", a: "Trong nhóm chúng tôi theo dõi, Dehavi bán lẻ giá mềm nhất — Arabica Lạc Dương 130.000₫/250g (52k/100g), dễ tiếp cận cho người uống phổ thông." }
    ],
    links: [
      { label: "Đọc hồ sơ vùng Nam Ban", href: "/vung-trong/nam-ban" },
      { label: "Xem các nhà rang", href: "/nha-rang" }
    ]
  }
];

/* ---- Mua gì? — câu hỏi intent cao, nối thẳng tới sản phẩm/vùng thật ---- */
const MUA_GI = [
  { q: "Người mới nên bắt đầu với Arabica hay Robusta?",
    a: "Bắt đầu với <b>Arabica</b>: dịu, thơm, dễ uống và ít gắt. Robusta (kể cả Fine Robusta) mạnh và nhiều caffeine hơn — để dành khi bạn đã quen vị đậm.",
    label: "Vùng Arabica: Cầu Đất", href: "/vung-trong/cau-dat" },
  { q: "Dưới 200.000₫ nên mua gói nào?",
    a: "Dehavi — Yellow Bourbon Cầu Đất (175.000₫ · 70k/100g) là Arabica ngọt, dễ uống, dễ tiếp cận cho người mới.",
    label: "Xem Dehavi Yellow Bourbon", href: "/review/dehavi-yellow-bourbon-cau-dat" },
  { q: "Thích ít chua thì tránh loại nào?",
    a: "Tránh cà phê vùng cao <b>chua sáng</b> như Cầu Đất và các gói <b>rang sáng (Light)</b>. Chọn vùng thấp body dày như Nam Ban, rang Medium–Dark.",
    label: "Vùng ít chua: Nam Ban", href: "/vung-trong/nam-ban" },
  { q: "Pha phin nên chọn rang gì?",
    a: "Chọn <b>Medium đến Dark</b>. Rang sáng ngâm lâu trong phin dễ chua gắt; rang đậm cho body dày, vị chocolate hợp gu phin.",
    label: "Đọc: rang sáng hay rang đậm", href: "/kien-thuc/rang-sang-dam" },
  { q: "Pha V60 đầu tiên nên mua gói nào?",
    a: "Chọn gói <b>rang sáng, chua sáng</b>. Gói chúng tôi đã <b>chấm mù</b> và hợp V60 nhất là Sơn Pacamara — Lang Biang (9,3/10).",
    label: "Xem Sơn Pacamara — Lang Biang", href: "/review/son-pacamara-lang-biang" }
];

/* ---- Vùng nguyên liệu — hub kiến thức cà phê Lâm Đồng.
   `diaDanh` để đối chiếu; sản phẩm nối vùng qua trường vungSlug của SP.
   Trường vi / than (mô tả CHỮ) là phần soạn nội dung riêng — để placeholder khi chưa có. ---- */
const VUNG = [
  {
    slug: "cau-dat", ten: "Cầu Đất",
    anh: "assets/img/regions/cau-dat.jpg",
    diaDanh: ["Cầu Đất"],
    tinh: "Xuân Trường, Đà Lạt, Lâm Đồng",
    doCao: "~1.400–1.650m",
    giong: "Bourbon, Typica, Catimor",
    hopPha: "V60 / Pour over",
    tagline: "Chua sáng, hương hoa, hậu vị sạch — Arabica vùng cao 1.400–1.650m.",
    viNgan: "Chua sáng như cam chanh, hương hoa.",
    tags: ["Arabica", "Chua sáng", "Pour over"],
    camQuan: { chua: 5, body: 2, hoa: 5, choco: 1 },
    hopPhaVi: "V60 / pour over giữ được độ chua sáng và hương hoa tốt hơn pha phin.",
    nen: ["Thích pour over / V60", "Thích hương hoa, vị trái cây", "Thích chua sáng, uống không đường"],
    khong: ["Thích body thật dày", "Thích vị chocolate đậm", "Chủ yếu pha phin truyền thống"],
    giongMoTa: [
      ["Bourbon", "ngọt, hậu vị dày"],
      ["Typica", "tinh tế, thanh"],
      ["Catimor", "khoẻ, ổn định năng suất"]
    ],
    huongChinh: "Hoa · cam chanh",
    khongHopNgan: "Người thích cà phê đậm kiểu truyền thống",
    diemDacBiet: { title: "Điểm đặc biệt của Cầu Đất", html: "<p>Người Pháp trồng Arabica ở đây từ đầu thế kỷ 20 — Cầu Đất là <b>cái nôi của Arabica đặc sản Việt Nam</b>, và tới nay vẫn là chuẩn tham chiếu cho vị chua sáng, hương hoa của cà phê Việt.</p>" },
    dinhNghia: "Cầu Đất là vùng Arabica cao và lâu đời bậc nhất Việt Nam, nổi bật với độ chua sáng, hương hoa và hậu vị sạch.",
    motCau: "Cầu Đất là vùng Arabica ở Đà Lạt, độ cao ~1.400–1.650m, nổi bật với vị chua sáng kiểu cam chanh, hương hoa và hợp pha V60 / pour over.",
    taiSao: [
      "<p><b>Độ cao lớn (1.400–1.650m)</b> khiến ngày nắng, đêm lạnh; quả cà phê <b>chín chậm</b> và tích được nhiều đường, nhiều tiền chất hương. Vì vậy ly cà phê Cầu Đất thường có <b>độ chua sáng như cam chanh, hương hoa, thân vừa và hậu vị sạch kéo dài</b> — đúng chất Arabica vùng cao.</p>",
      "<p>Chính độ chua sáng và hương hoa này khiến Cầu Đất <b>hợp pha V60 / pour over</b> hơn pha phin đậm: cách pha chậm bằng giấy lọc giữ được lớp hương tinh tế mà phin dễ làm mất.</p>"
    ],
    nhanXet: "Nếu bạn muốn trải nghiệm 'specialty' rõ nhất — chua trái cây, thơm hoa, khác hẳn cà phê truyền thống — Cầu Đất là nơi để bắt đầu. Nhưng nếu bạn quen gu đậm đắng, hãy làm quen từ từ.",
    themVao: [
      "<p>Người Pháp đã trồng <a href=\"/kien-thuc\">Arabica</a> ở Cầu Đất từ đầu thế kỷ 20, nên đây thường được xem là <b>cái nôi của Arabica đặc sản Việt Nam</b>. Khi mua, hãy để ý nhãn có ghi rõ giống và độ cao — đó là dấu hiệu của một gói được làm nghiêm túc.</p>"
    ],
    faq: [
      { q: "Cà phê Cầu Đất có gì đặc biệt?", a: "Cầu Đất là vùng Arabica cao và lâu đời bậc nhất Việt Nam. Độ cao lớn cho cà phê chua sáng, hương hoa, hậu vị sạch — chất vị đặc sản rõ rệt, khác cà phê truyền thống." },
      { q: "Cà phê Cầu Đất hợp pha gì?", a: "Hợp pha V60 / pour over nhất, để giữ độ chua sáng và hương hoa. Pha phin vẫn được nhưng dễ làm mất lớp hương tinh tế." },
      { q: "Cầu Đất trồng giống cà phê nào?", a: "Chủ yếu Arabica: Bourbon và Typica (dòng cổ, tinh tế) cùng Catimor (khoẻ, năng suất cao)." },
      { q: "Cà phê Cầu Đất có chua không?", a: "Có, và đó là điểm mạnh. Độ chua ở đây là chua trái cây sáng kiểu cam chanh, không phải chua hỏng — dấu hiệu của Arabica vùng cao chất lượng." }
    ],
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
    tagline: "Body dày, vị chocolate rõ, ít chua — vùng thấp hơn Cầu Đất.",
    viNgan: "Body dày, chocolate, ít chua.",
    tags: ["Robusta & Arabica", "Chocolate", "Pha phin"],
    camQuan: { chua: 2, body: 5, hoa: 1, choco: 5 },
    diemDacBiet: { title: "Điểm đặc biệt của Nam Ban", html: "<p>Nam Ban là nơi <b><a href=\"/kien-thuc\">Fine Robusta</a></b> của Lâm Đồng phát triển mạnh — dòng Robusta chất lượng cao, sơ chế kỹ, phá vỡ định kiến 'Robusta chỉ để pha đậm rẻ tiền'.</p>" },
    hopPhaVi: "Body dày, ít chua nên hợp pha phin và espresso đậm kiểu quen thuộc.",
    nen: ["Thích body dày, vị đậm", "Thích vị chocolate, hạt dẻ", "Chủ yếu pha phin / espresso"],
    khong: ["Thích chua sáng, hương hoa", "Thích vị trái cây nhẹ kiểu vùng cao"],
    giongMoTa: [
      ["Robusta", "đậm, mạnh, nhiều caffeine"],
      ["Arabica", "dịu và thơm hơn"]
    ],
    huongChinh: "Chocolate · hạt dẻ",
    khongHopNgan: "Người thích vị chua sáng, hương hoa",
    dinhNghia: "Nam Ban là vùng cà phê của Lâm Hà (Lâm Đồng) có body dày, độ chua dịu và là nơi Fine Robusta của Lâm Đồng phát triển mạnh.",
    motCau: "Nam Ban là vùng cà phê của Lâm Hà, độ cao ~800–1.000m, nổi bật với body dày, độ chua dịu và phù hợp pha phin hoặc espresso.",
    taiSao: [
      "<p>So với Cầu Đất, Nam Ban ở <b>độ cao thấp hơn</b> (khoảng 800–1.000m) nên khí hậu ấm hơn, quả cà phê <b>chín nhanh hơn</b>. Quả chín nhanh tích ít axit hơn — vì vậy ly cà phê Nam Ban thường có <b>body dày, độ chua thấp và vị nghiêng về chocolate, hạt dẻ</b> thay vì chua sáng như vùng cao.</p>",
      "<p>Chính chất vị đậm, ít chua này khiến Nam Ban <b>hợp pha phin và <a href=\"/kien-thuc\">espresso</a></b> — gần với gu cà phê truyền thống mà nhiều người Việt đã quen. Vùng trồng cả Robusta lẫn Arabica, và là nơi <b><a href=\"/kien-thuc\">Fine Robusta</a></b> của Lâm Đồng phát triển mạnh.</p>"
    ],
    nhanXet: "Nếu bạn đang uống cà phê truyền thống và muốn thử specialty, Nam Ban thường dễ tiếp cận hơn Cầu Đất: vẫn đậm, vẫn hợp phin, nhưng sạch và rõ vị hơn.",
    themVao: [
      "<p>Bạn có thể biết Nam Ban qua các trại <b>cà phê chồn</b> và du lịch cà phê. Tuy nhiên với cà phê đặc sản, điều đáng quan tâm hơn vẫn là giống, độ cao và cách sơ chế được ghi rõ — chồn là câu chuyện trải nghiệm, không phải thước đo chất lượng.</p>",
      "<p>Về địa danh: Nam Ban là thị trấn thuộc huyện <b>Lâm Hà</b> — tên ghép từ Lâm Đồng và Hà Nội, vùng kinh tế mới do người Hà Nội vào lập nghiệp từ cuối thập niên 1970.</p>"
    ],
    faq: [
      { q: "Cà phê Nam Ban có phải specialty không?", a: "Có những lô Nam Ban đạt chuẩn specialty, đặc biệt ở dòng Fine Robusta. Nhưng 'Nam Ban' là tên vùng, không phải chứng nhận — chất lượng vẫn tuỳ từng nhà rang và từng lô. Hãy xem nhãn có ghi rõ giống, độ cao và cách sơ chế không." },
      { q: "Nam Ban trồng Arabica hay Robusta?", a: "Cả hai. Nam Ban trồng cả Robusta và Arabica, và được biết đến nhiều với Fine Robusta — dòng Robusta chất lượng cao, sơ chế kỹ." },
      { q: "Cà phê Nam Ban hợp pha phin không?", a: "Rất hợp. Vì body dày và ít chua, Nam Ban là một trong những vùng hợp pha phin và espresso nhất trong nhóm — gần với gu cà phê truyền thống." },
      { q: "Nam Ban khác Cầu Đất thế nào?", a: "Cầu Đất cao hơn (1.400–1.650m), chua sáng, hương hoa, hợp pour over. Nam Ban thấp hơn (~800–1.000m), body dày, ít chua, hợp phin. Nói ngắn: Cầu Đất thanh và chua, Nam Ban đậm và dịu." }
    ],
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
    tagline: "Arabica dưới chân Lang Biang — cân bằng hơn Cầu Đất, sáng hơn Nam Ban.",
    viNgan: "Cân bằng, ngọt hậu, trái cây nhẹ.",
    tags: ["Arabica", "Cân bằng", "Pour over"],
    camQuan: { chua: 4, body: 3, hoa: 4, choco: 2 },
    diemDacBiet: { title: "Điểm đặc biệt của Lạc Dương", html: "<p>Nhiều nông hộ người <b>K'Ho</b> vẫn dùng phương pháp <b>phơi chậm trên gác mái</b>, giúp hạt khô đều và giảm phụ thuộc thời tiết — một nét sơ chế bản địa hiếm nơi nào có.</p>" },
    hopPhaVi: "Vị cân bằng nên linh hoạt — pour over để tôn hương, pha phin vẫn ngon.",
    nen: ["Muốn vị cân bằng, dễ uống", "Thích ngọt hậu, trái cây nhẹ", "Vừa pour over vừa phin"],
    khong: ["Thích vị cực mạnh, gắt", "Muốn chua thật sáng kiểu Cầu Đất"],
    giongMoTa: [
      ["Catimor", "khoẻ, ổn định, dễ trồng"],
      ["Bourbon", "ngọt, hậu vị dày"]
    ],
    huongChinh: "Trái cây nhẹ · ngọt hậu",
    khongHopNgan: "Người muốn vị cực mạnh, gắt",
    dinhNghia: "Lạc Dương là vùng Arabica dưới chân núi Lang Biang, nổi bật với vị cân bằng, ngọt hậu và nhiều nông hộ người K'Ho canh tác.",
    motCau: "Lạc Dương là vùng Arabica ở độ cao ~1.400–1.500m dưới chân Lang Biang, nổi bật với vị cân bằng, ngọt hậu, trái cây nhẹ và hợp cả pour over lẫn phin.",
    taiSao: [
      "<p><b>Khí hậu mát quanh năm</b> cùng độ cao lớn (1.400–1.500m) khiến quả cà phê <b>chín chậm</b>, cho hạt có <b>độ chua cân bằng, thân sạch và hậu vị ngọt dễ chịu</b> — không gắt như vùng cao cực đoan, cũng không đậm nặng như vùng thấp.</p>",
      "<p>Nhiều lô ở đây được sơ chế bằng phương pháp <b>phơi chậm gác mái</b> của người K'Ho, giúp hạt khô đều và ít phụ thuộc thời tiết. Vị cân bằng khiến Lạc Dương <b>linh hoạt</b>: pour over để tôn hương, pha phin vẫn ngon.</p>"
    ],
    nhanXet: "Lạc Dương là lựa chọn an toàn nhất nếu bạn chưa chắc gu của mình: đủ sạch và thơm để thấy khác cà phê thường, nhưng không chua gắt đến mức khó uống.",
    themVao: [
      "<p>Lạc Dương nằm dưới chân núi Lang Biang, phía bắc Đà Lạt, với nhiều nông hộ người <b>K'Ho</b> canh tác lâu đời — một trong những vùng <a href=\"/kien-thuc\">Arabica</a> đặc sản đáng chú ý nhất Lâm Đồng.</p>"
    ],
    faq: [
      { q: "Cà phê Lạc Dương vị thế nào?", a: "Cân bằng, ngọt hậu, có nét trái cây nhẹ. Không chua gắt như Cầu Đất, cũng không đậm nặng như vùng thấp — dễ uống và linh hoạt." },
      { q: "Lạc Dương hợp pha gì?", a: "Cả hai. Vị cân bằng nên pour over tôn được hương, mà pha phin vẫn ngon — linh hoạt hơn nhiều vùng khác." },
      { q: "Cà phê Lạc Dương trồng giống nào?", a: "Chủ yếu Arabica: Catimor (khoẻ, ổn định) và Bourbon (ngọt, hậu vị dày), phần lớn do các nông hộ K'Ho canh tác." },
      { q: "Lạc Dương khác Cầu Đất thế nào?", a: "Cùng là Arabica vùng cao, nhưng Cầu Đất chua sáng và hương hoa rõ hơn, còn Lạc Dương cân bằng và dịu hơn — dễ uống hơn với người mới." }
    ],
    vi: "Arabica dưới chân núi Lang Biang — sạch, cân bằng, nhiều nông hộ người K'Ho.",
    diemNhan: ["Dưới chân núi Lang Biang", "Arabica vùng cao", "Nhiều nông hộ K'Ho"],
    than: [
      "<p><b>Lạc Dương</b> nằm ngay dưới chân núi Lang Biang, phía bắc Đà Lạt, ở độ cao khoảng 1.400–1.500m. Đây là một trong những vùng Arabica đặc sản đáng chú ý nhất Lâm Đồng, với nhiều nông hộ người <b>K'Ho</b> canh tác lâu đời.</p>",
      "<p>Khí hậu mát quanh năm cùng độ cao lớn khiến quả cà phê chín chậm, cho hạt có <b>độ chua cân bằng, thân sạch và hậu vị dễ chịu</b>. Các giống phổ biến là Catimor và Bourbon. Nhiều lô ở đây được sơ chế bằng phương pháp phơi chậm gác mái của người K'Ho, giúp hạt khô đều và ít phụ thuộc thời tiết. Cà phê Lạc Dương hợp pha V60 hoặc pour over để tôn vị.</p>"
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
    sanPham: ["nb-bui"], diemTB: null, chungNhan: "Top 14 Thế giới · CQI 2024",
    theManh: "Fine Robusta đạt giải", hopAi: "Muốn trải nghiệm đỉnh cao", doiTuong: "Fine Robusta",
    nhuCau: "Thử Fine Robusta đạt giải thế giới",
    motCau: "Bui Coffee Supply là nhà rang Fine Robusta nổi bật nhất trong nhóm Gu theo dõi tại Lâm Đồng, phù hợp cho người muốn trải nghiệm dòng Robusta chất lượng cao.",
    verdict: "Nếu chỉ muốn thử một Fine Robusta Việt Nam có thành tích quốc tế, Bui là nơi chúng tôi gợi ý bắt đầu.",
    hopNhat: ["Fine Robusta chất lượng cao", "Pha phin & espresso", "Thích body dày, vị chocolate"],
    khongHop: ["Thích Arabica chua sáng, hương hoa", "Người mới có thể thấy dòng lên men hơi lạ"],
    diemManh: ["Fine Robusta đạt Top 14 Thế Giới (CQI 2024)", "Thành tích quốc tế kiểm chứng được", "Minh bạch vùng nguyên liệu Nam Ban", "Mạnh sơ chế sáng tạo (lên men muối, yếm khí)"],
    diemCanBiet: ["Không phải lựa chọn đầu nếu bạn thích Arabica hương hoa", "Một số dòng lên men đặc biệt, người mới có thể thấy lạ"],
    faq: [
      { q: "Bui Coffee Supply có tốt không?", a: "Có. Đây là nhà rang có thành tích quốc tế cao nhất nhóm Gu theo dõi — Fine Robusta Nam Ban đạt Top 14 Thế Giới (CQI 2024), xưởng đạt FDA/HACCP/ISO 22000. Chúng tôi đã mua và uống thật, thấy ngon; điểm chấm mù sẽ cập nhật sau." },
      { q: "Bui mạnh nhất về gì?", a: "Fine Robusta — dòng Robusta chất lượng cao, sơ chế kỹ (lên men muối, yếm khí). Đây là thế mạnh khác biệt của Bui so với các nhà Arabica trong nhóm." },
      { q: "Bui có hợp người mới không?", a: "Hợp nếu bạn thích vị đậm, body dày, chocolate và pha phin/espresso. Nếu quen gu chua sáng nhẹ nhàng thì nên bắt đầu từ một nhà Arabica." },
      { q: "Fine Robusta của Bui có đáng tiền không?", a: "Với người muốn trải nghiệm Robusta đỉnh cao và đã quen vị đậm, đáng thử. Chúng tôi tính giá/100g ở trang sản phẩm để bạn so sòng phẳng." }
    ]
  },
  {
    slug: "dehavi", ten: "Dehavi (Hân Vinh)",
    vungChinh: "Nam Ban", vungSlug: "nam-ban", web: "https://dehavi.com",
    gioiThieu: "Nhà rang gốc Nam Ban, mạnh dòng Arabica rang mộc dễ uống. Dòng chủ lực Yellow Bourbon Cầu Đất hợp người mới bước vào cà phê đặc sản.",
    lichSu: "<p>Dehavi là thương hiệu rang xay của <b>Công ty TNHH Cà Phê Hân Vinh</b>, đặt tại thôn Đông Anh, xã Nam Ban, Lâm Hà — hơn <b>20 năm</b> làm nguyên liệu cà phê, đóng vai cầu nối giữa nông hộ với doanh nghiệp trong và ngoài nước.</p><p>Dehavi đạt chứng nhận <b>OCOP 4 sao</b>, ISO 22000, FDA, có nhà máy rang xay công suất lớn và vùng nguyên liệu trải nhiều tỉnh. Dòng đặc sản rang mộc nguyên chất của họ có giá tốt, hợp người uống phổ thông muốn thử hàng đặc sản mà không phải trả nhiều. Định vị của Dehavi là cà phê sạch, giá phải chăng, dễ tiếp cận.</p>",
    sanPham: ["nb-dehavi"], diemTB: null, chungNhan: "OCOP 4 sao · ISO 22000",
    theManh: "Yellow Bourbon dễ uống", hopAi: "Người mới specialty", doiTuong: "Người mới",
    nhuCau: "Mới uống specialty, Arabica dễ uống",
    motCau: "Dehavi là nhà rang giá mềm, dễ tiếp cận nhất trong nhóm Gu theo dõi, phù hợp người mới bắt đầu uống cà phê đặc sản.",
    verdict: "Nếu bạn mới chuyển sang specialty và muốn một Arabica ngọt, dễ uống, Dehavi Yellow Bourbon là điểm vào dễ chịu.",
    hopNhat: ["Người mới specialty", "Ngân sách dưới 200.000₫", "Pha phin, uống hằng ngày"],
    khongHop: ["Muốn trải nghiệm micro-lot, lô hiếm", "Muốn hương vị thật phức tạp"],
    diemManh: ["Dòng chủ lực Yellow Bourbon Cầu Đất — ngọt, dễ uống", "Chứng nhận OCOP 4 sao, ISO 22000, FDA", "Hơn 20 năm làm nguyên liệu, nguồn ổn định", "Nhiều mức giá, có cả dòng 130k dễ tiếp cận"],
    diemCanBiet: ["Không nhắm phân khúc lô hiếm / đấu giá", "Hương vị an toàn, ít 'gây bất ngờ'"],
    faq: [
      { q: "Dehavi có đáng mua không?", a: "Đáng, nếu bạn muốn một Arabica ngọt, sạch, dễ uống. Dòng chủ lực Yellow Bourbon Cầu Đất (175k) rang mộc, hợp người mới; Dehavi cũng có dòng 130k dễ tiếp cận hơn. Gu đã mua và uống thật." },
      { q: "Dehavi có hợp người mới không?", a: "Rất hợp. Định vị cà phê sạch, dễ uống, nhiều mức giá dễ tiếp cận — điểm vào lý tưởng cho người mới specialty." },
      { q: "Dehavi mạnh nhất về gì?", a: "Arabica giá tốt và độ phủ ổn định. Dehavi hơn 20 năm làm nguyên liệu, đạt OCOP 4 sao và ISO 22000." },
      { q: "Cà phê Dehavi có phải đặc sản không?", a: "Dòng rang mộc nguyên chất của họ hướng tới đặc sản phổ thông — minh bạch, có chứng nhận, nhưng không phải lô đấu giá." }
    ]
  },
  {
    slug: "tam-trinh", ten: "Tám Trình Coffee",
    vungChinh: "Nam Ban", vungSlug: "nam-ban", web: "https://tamtrinhcoffee.com",
    gioiThieu: "Thương hiệu lâu đời nhất trong nhóm, mạnh về sản xuất, xuất khẩu và du lịch trải nghiệm cà phê. Hợp người mở quán, mua sỉ hoặc muốn tham quan tour cà phê.",
    lichSu: "<p>Tám Trình là công ty cà phê <b>30 năm tuổi</b> đặt tại Gia Lâm, Lâm Hà — trên cung đường du lịch ngoại thành nổi tiếng của Đà Lạt, gần Thác Voi. Họ có nhà máy xuất khẩu riêng, khu du lịch trải nghiệm với các tour cà phê nhiều độ dài, phục vụ cả tiếng Việt, tiếng Anh và tiếng Hàn.</p><p>Trên kệ bán lẻ, thế mạnh của Tám Trình là mảng <b>nhân xanh</b> và cà phê sỉ với nhiều loại Robusta chế biến kỹ. Vì là nhà sản xuất lâu năm quy mô lớn, họ hợp với người cần nguồn ổn định để mở quán. Với người mua lẻ về pha, chúng tôi ưu tiên các gói Arabica của họ hơn là dòng blend thương mại.</p>",
    sanPham: ["nb-tamtrinh"], diemTB: null, chungNhan: "30 năm · nhà máy xuất khẩu",
    theManh: "Quy mô · nhân xanh & sỉ", hopAi: "Mở quán, mua sỉ", doiTuong: "Quán / sỉ",
    nhuCau: "Mở quán hoặc mua sỉ",
    motCau: "Tám Trình là nhà cà phê lâu đời quy mô lớn, mạnh về sản xuất, nhân xanh và bán sỉ, phù hợp người mở quán hoặc mua số lượng.",
    verdict: "Nếu bạn cần nguồn ổn định để mở quán hoặc mua sỉ, Tám Trình là lựa chọn hợp lý nhất trong nhóm.",
    hopNhat: ["Mở quán, mua sỉ", "Cần nguồn cung ổn định", "Quan tâm nhân xanh"],
    khongHop: ["Người mua lẻ tìm lô specialty tinh", "Ưu tiên micro-lot hiếm"],
    diemManh: ["30 năm kinh nghiệm, nhà máy xuất khẩu riêng", "Mạnh nhân xanh và bán sỉ", "Khu du lịch trải nghiệm cà phê", "Nguồn cung ổn định, quy mô lớn"],
    diemCanBiet: ["Dòng blend thương mại không phải thế mạnh vị", "Mua lẻ về pha nên ưu tiên các gói Arabica"],
    faq: [
      { q: "Tám Trình bán gì mạnh?", a: "Mạnh nhất là nhân xanh và cà phê sỉ, cùng du lịch trải nghiệm. Là nhà sản xuất 30 năm quy mô lớn, họ hợp người cần nguồn ổn định để mở quán." },
      { q: "Tám Trình có hợp mua lẻ không?", a: "Có, nhưng với mua lẻ về pha chúng tôi ưu tiên các gói Arabica của họ hơn dòng blend thương mại." },
      { q: "Tám Trình hợp mở quán không?", a: "Rất hợp. Nhà máy xuất khẩu riêng, mạnh nhân xanh và sỉ, nguồn cung ổn định — đúng nhu cầu của quán." }
    ]
  },
  {
    slug: "son-pacamara", ten: "Sơn Pacamara",
    vungChinh: "Lạc Dương", vungSlug: "lac-duong", web: "",
    gioiThieu: "Farm kiêm roastery nhỏ của ông Sơn tại Đà Lạt, làm Arabica vùng cao theo kiểu thủ công, minh bạch. Đây là nhà làm ra gói cà phê chúng tôi chấm cao nhất tới giờ.",
    lichSu: "<p>Sơn Pacamara là câu chuyện của <b>ông Sơn</b> — người mua đất ở Đà Lạt hơn hai mươi năm trước để trồng rau và hoa, tình cờ có sẵn vài cây Catimor trên đất, rồi bén duyên với cà phê đặc sản. Phương châm của ông ghi thẳng trên bao bì: <b>“No secrets, just passion”</b> (không giấu nghề, chỉ có đam mê).</p><p>Farm và roastery nằm ngay tại Đà Lạt, dưới chân vùng Lang Biang, chuyên các dòng Arabica như <b>Lang Biang</b> và <b>Heirloom</b>. Ông Sơn còn rang thuê cho các nông hộ khác, mỗi gói cà phê gửi kèm ghi chú về người trồng và cách pha. Sơn Pacamara mở cửa farm cho bất kỳ ai muốn tìm hiểu — đúng tinh thần cởi mở mà chúng tôi đánh giá cao.</p>",
    sanPham: ["lb1"], diemTB: "9.3/10 · 1 gói đã nếm", chungNhan: "Farm minh bạch · Lạc Dương",
    theManh: "Farm Arabica vùng cao", hopAi: "Thích pour over, farm minh bạch", doiTuong: "Pour over",
    chuoi: ["Trồng", "Rang", "Pha"], chuoiNote: "Farm kiêm roastery — tự trồng và rang",
    nhuCau: "Thích Arabica vùng cao, pour over",
    motCau: "Sơn Pacamara là farm kiêm roastery nhỏ làm Arabica vùng cao thủ công, minh bạch — nơi làm ra gói cà phê Gu chấm cao nhất tới nay.",
    verdict: "Nếu bạn thích Arabica vùng cao, pha pour over và trân trọng sự minh bạch, đây là nhà chúng tôi gợi ý trước tiên.",
    hopNhat: ["Thích Arabica vùng cao, chua sáng", "Pha V60 / pour over", "Trân trọng farm minh bạch"],
    khongHop: ["Chủ yếu uống phin sữa, gu đậm", "Không thích vị chua sáng"],
    viSaoDiem: ["Hương hoa rõ, sạch", "Chua sáng kiểu cam chanh, cân bằng", "Thân vừa, mượt", "Hậu vị ngọt kéo dài"],
    diemManh: ["Gói Gu chấm cao nhất tới nay: 9,3/10", "Farm & roastery minh bạch — 'No secrets, just passion'", "Arabica vùng cao Lang Biang", "Mỗi gói kèm ghi chú người trồng & cách pha"],
    diemCanBiet: ["Quy mô nhỏ, dòng hàng có thể giới hạn", "Không nhắm tới gu Robusta đậm"],
    faq: [
      { q: "Sơn Pacamara có tốt không?", a: "Rất tốt theo trải nghiệm của Gu — gói Lang Biang của họ là gói chúng tôi chấm mù cao nhất tới nay (9,3/10). Farm minh bạch, làm Arabica vùng cao thủ công." },
      { q: "Sơn Pacamara hợp pha gì?", a: "Hợp V60 / pour over để tôn độ chua sáng và hương hoa của Arabica vùng cao Lang Biang." },
      { q: "Sơn Pacamara khác Bui thế nào?", a: "Sơn mạnh Arabica vùng cao, chua sáng, hợp pour over. Bui mạnh Fine Robusta, body dày, hợp phin/espresso — hai gu gần như đối lập." }
    ]
  },
  {
    slug: "the-married-beans", ten: "The Married Beans",
    vungChinh: "Cầu Đất", vungSlug: "cau-dat", web: "https://www.themarriedbeans.com",
    gioiThieu: "Nhà làm cà phê đặc sản nghiêm túc bậc nhất ở Cầu Đất, ghi rõ độ cao, giống, sơ chế và hương vị cho từng lô. Chúng tôi đã uống và thấy ngon — điểm chấm mù sẽ cập nhật sau.",
    lichSu: "<p>The Married Beans thành lập năm 2015 tại Đà Lạt (số ĐKKD do Sở KHĐT Lâm Đồng cấp 08/07/2015), cửa hàng ở 06 Nguyễn Văn Trỗi. Họ đồng hành với bà con nông dân các vùng <b>Cầu Đất, Đạ Sar, Lang Biang</b>, hiện liên kết hơn <b>60 nông hộ</b> canh tác khoảng <b>120 hecta</b> cà phê đặc sản.</p><p>Điểm khiến chúng tôi chú ý: mỗi lô cà phê của họ đều ghi minh bạch giống, độ cao, phương pháp sơ chế và tasting note — đúng kiểu dữ liệu mà Gu Cà Phê trân trọng. Họ đạt chứng nhận quốc tế <b>SGS</b> và có mảng xuất khẩu nhân xanh. Lưu ý: phần lớn hàng bán trên web của họ là nhân xanh (cà phê sống, cần rang trước khi pha), không phải hạt rang uống ngay.</p>",
    sanPham: ["mb-yellowcherry"], diemTB: null, chungNhan: "Chứng nhận SGS · Cầu Đất",
    theManh: "Micro-lot, truy xuất kỹ", hopAi: "Dân specialty thích micro-lot", doiTuong: "Specialty",
    nhuCau: "Thích micro-lot, truy xuất rõ",
    motCau: "The Married Beans là nhà làm cà phê đặc sản nghiêm túc ở Cầu Đất, ghi rõ giống, độ cao và sơ chế cho từng lô — mạnh về truy xuất và micro-lot.",
    verdict: "Nếu bạn là dân specialty thích dữ liệu minh bạch từng lô, đây là nhà đáng theo dõi nhất ở Cầu Đất.",
    hopNhat: ["Dân specialty thích micro-lot", "Muốn truy xuất giống / độ cao / sơ chế", "Sẵn sàng tự rang nhân xanh"],
    khongHop: ["Muốn mua hạt rang uống ngay", "Người mới chưa có máy rang"],
    diemManh: ["Ghi minh bạch giống, độ cao, sơ chế, tasting note từng lô", "Liên kết 60+ nông hộ, ~120 ha Cầu Đất", "Chứng nhận quốc tế SGS", "Đúng kiểu dữ liệu Gu trân trọng"],
    diemCanBiet: ["Phần lớn hàng trên web là nhân xanh — cần tự rang trước khi pha", "Không hợp người muốn mua hạt rang sẵn tiện lợi"],
    faq: [
      { q: "The Married Beans có tốt không?", a: "Tốt cho dân specialty — họ ghi minh bạch giống, độ cao, sơ chế và tasting note từng lô, đạt chứng nhận SGS. Gu đã uống và thấy ngon; điểm chấm mù sẽ cập nhật sau." },
      { q: "The Married Beans bán hạt rang hay nhân xanh?", a: "Phần lớn hàng trên web của họ là nhân xanh (cà phê sống, cần tự rang trước khi pha), không phải hạt rang uống ngay. Hãy đọc kỹ nhãn." },
      { q: "The Married Beans khác Là Việt ở điểm nào?", a: "Married Beans mạnh về truy xuất và micro-lot Cầu Đất, thiên nhân xanh. Là Việt là roastery kiêm quán specialty ở Đà Lạt, bán hạt rang sẵn, mạnh về trải nghiệm." }
    ]
  },
  {
    slug: "la-viet", ten: "Là Việt Coffee",
    vungChinh: "Đà Lạt", vungSlug: "da-lat", web: "https://laviet.coffee",
    gioiThieu: "Roastery kiêm quán specialty biểu tượng của thành phố Đà Lạt, tự trồng, sơ chế, rang và pha. Chúng tôi đã uống và thấy ngon — điểm chấm mù sẽ cập nhật sau.",
    lichSu: "<p>Là Việt thành lập năm 2015 bởi Trần Nhật Quang, theo triết lý <b>“plant, process, roast and brew”</b> (trồng, sơ chế, rang và pha) — làm chủ toàn bộ chuỗi từ hạt tới ly. Không gian rang mở ngay trong quán để khách nhìn thấy cả quy trình.</p><p>Đây là một trong những cái tên specialty được biết đến nhiều nhất Đà Lạt, từng lọt danh sách <b>Asia’s Top 80</b> quán cà phê, cộng đồng theo dõi lớn trên mạng xã hội. Họ tập trung vào Arabica Đà Lạt vùng cao, có dòng hạt rang bán lẻ theo ba mức rang, đóng túi có van và ghi ngày rang — thuận tiện để mua về pha tại nhà. Nếu Sơn Pacamara đại diện cho farm thủ công thì Là Việt đại diện cho văn hóa và trải nghiệm cà phê đô thị.</p>",
    sanPham: ["lv-balanced"], diemTB: null, chungNhan: "Asia Top 80 · Đà Lạt",
    theManh: "Specialty & trải nghiệm Đà Lạt", hopAi: "Yêu văn hoá cà phê Đà Lạt", doiTuong: "Home brewer",
    chuoi: ["Trồng", "Sơ chế", "Rang", "Pha"], chuoiNote: "Làm chủ toàn bộ chuỗi — từ hạt tới ly",
    nhuCau: "Trải nghiệm cà phê Đà Lạt",
    motCau: "Là Việt là roastery kiêm quán specialty biểu tượng của Đà Lạt, làm chủ chuỗi từ trồng đến pha, mạnh về Arabica Đà Lạt và trải nghiệm cà phê.",
    verdict: "Nếu bạn yêu văn hoá cà phê Đà Lạt và muốn hạt rang sẵn tiện pha tại nhà, Là Việt là lựa chọn dễ chịu.",
    hopNhat: ["Yêu văn hoá cà phê Đà Lạt", "Muốn hạt rang sẵn, tiện pha", "Thích Arabica cân bằng, dễ uống"],
    khongHop: ["Người săn lô hiếm, đấu giá", "Muốn giá rẻ nhất nhóm"],
    diemManh: ["Làm chủ chuỗi: trồng, sơ chế, rang, pha", "Từng lọt Asia's Top 80 quán cà phê", "Hạt rang đóng túi có van, ghi ngày rang", "Ba mức rang, tiện mua về pha tại nhà"],
    diemCanBiet: ["Định vị thiên trải nghiệm & thương hiệu hơn lô hiếm", "Giá không phải rẻ nhất nhóm"],
    faq: [
      { q: "Là Việt có tốt không?", a: "Là một trong những cái tên specialty được biết đến nhiều nhất Đà Lạt, làm chủ chuỗi từ trồng đến pha, từng lọt Asia's Top 80. Gu đã uống và thấy ngon; điểm chấm mù sẽ cập nhật sau." },
      { q: "Là Việt hợp ai?", a: "Người yêu văn hoá cà phê Đà Lạt, muốn hạt rang sẵn tiện pha tại nhà, thích Arabica cân bằng dễ uống." },
      { q: "Cà phê Là Việt pha tại nhà được không?", a: "Được và tiện. Họ đóng túi có van, ghi ngày rang, có ba mức rang để chọn theo cách pha." }
    ]
  }
];

/* ---- Gợi ý theo nhu cầu — "Mua cho ai". Mỗi nhóm khách trỏ tới 1 gói (spId).
   Dùng ở hub /ca-phe để khách quyết định nhanh rồi bấm mua. ---- */
const NHUCAU = [
  { label: "Mới uống specialty", vi: "Arabica Yellow Bourbon ngọt, dễ uống cho người nhập môn.", spId: "nb-dehavi" },
  { label: "Đạt giải quốc tế", vi: "Fine Robusta Nam Ban — Top 14 Thế Giới 2024.", spId: "nb-bui" },
  { label: "Chua sáng · pha V60", vi: "Arabica vùng cao, gói điểm nếm mù cao nhất.", spId: "lb1" },
  { label: "Mở quán · mua sỉ", vi: "Nhà rang lớn, phù hợp mua số lượng.", spId: "nb-tamtrinh" },
  { label: "Uống hằng ngày", vi: "Hạt rang pha ngay, cân bằng, dễ uống.", spId: "lv-balanced" },
  { label: "Tự rang · lô đặc biệt", vi: "Nhân xanh Cầu Đất, sơ chế lên men sâu.", spId: "mb-yellowcherry" }
];
