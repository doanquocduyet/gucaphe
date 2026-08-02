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
    link:"https://s.shopee.vn/8pkbckR0IT", anh:"assets/img/products/son-lang-biang.webp" },

  /* ===== Sơn Pacamara — 2 gói micro-lot khác (xác minh từ store chính thức). ===== */
  { id:"sp-pacamara", guPick:"signature", confidence:"editor_tasted", verificationDate:"2026-07-31",
    selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true},
    brand:"Sơn Pacamara", ten:"Pacamara Sơn Farm — Micro-lot 100g", nhom:"hat", gia:220000, gram:100,
    slug:"son-pacamara-pacamara", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Sơn Farm, Đà Lạt",
    giong:"Pacamara", doCao:"", process:"Double anaerobic washed", roast:"Light", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Nhà rang công bố 81–83 SCA", diem:null, chua:null, dam:null, hau:null,
    chot:"Giống Pacamara hiếm, lên men anaerobic — chính là nguồn cảm hứng đặt tên Sơn Pacamara.",
    flavor:"Đã mua và uống thật — cân bằng giữa độ chua sáng, thể chất (body) vừa và dư vị ngọt ngào. Micro-lot Pacamara lên men anaerobic từ Sơn Farm (bản New Crop 2026); nhà rang công bố 81–83 điểm SCA. Điểm chấm mù (blind) của Gu sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[], tags:["Chua sáng","Body vừa","Dư vị ngọt"],
    nen:["Muốn thử giống hiếm Pacamara","Pha V60 / pour over để tôn hương","Thích khám phá lô lên men"],
    khong:["Chủ yếu pha phin đậm sữa","Thích vị quen, an toàn"],
    faq:[
      {q:"Pacamara là giống gì?",a:"Là giống lai hạt to hiếm (Pacas × Maragogipe), cho tách cà phê phức hợp, thường thấy ở các cuộc thi đặc sản. Cũng là giống đặt tên cho thương hiệu Sơn Pacamara."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu đã mua và uống thật — thấy cân bằng, dễ chịu — nhưng chưa nếm mù nên chưa gắn điểm của Gu. Nhà rang công bố 81–83 điểm SCA. Nếm mù xong Gu sẽ cập nhật điểm."},
      {q:"Hợp pha gì?",a:"Rang sáng, lên men anaerobic nên hợp pour over (V60, Chemex) để tôn hương trái cây và hoa; không hợp pha phin đậm."}
    ],
    link:"https://s.shopee.vn/60QQdAGwIl", anh:"assets/img/products/son-pacamara-bag.webp" },

  { id:"sp-heirloom", guPick:"collector", confidence:"editor_tasted", verificationDate:"2026-07-31",
    selectionCriteria:{signature:false,community:true,khacBiet:true,hocThuat:true,benVung:false},
    brand:"Sơn Pacamara", ten:"Heirloom Sơn Farm — 100% Arabica 250g", nhom:"hat", gia:265000, gram:250,
    slug:"son-pacamara-heirloom", pha:["v60"],
    vungSlug:"lac-duong", xaHuyen:"Sơn Farm, Đà Lạt",
    giong:"Heirloom (Arabica lâu năm)", doCao:"", process:"Double washed", roast:"Light", ngayRang:"",
    tested:false, daUong:true, chungNhan:"", diem:null, chua:null, dam:null, hau:null,
    chot:"Heirloom Sơn Farm — Arabica lâu năm, double washed rang sáng; chua sáng, cam chanh.",
    flavor:"Đã mua và uống thật — chua sáng kiểu cam chanh, ngọt nhẹ như đường nâu, hậu sạch; hợp pour over (V60, Chemex). Lô Heirloom (Arabica lâu năm, Sơn Farm, Đà Lạt), double washed, rang sáng. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[], tags:["Heirloom","Chua sáng","Pour over"],
    nen:["Thích Arabica giống lâu năm","Pha V60 / pour over để tôn hương","Thích vị chua sáng, cam chanh"],
    khong:["Thích vị đậm kiểu Robusta","Chủ yếu pha phin (rang sáng dễ chua gắt)"],
    faq:[
      {q:"Heirloom là giống gì?",a:"Ở đây “Heirloom” chỉ các cây Arabica lâu năm trồng tại Sơn Farm (không xác định rõ giống). Nhà rang lên men double washed để giữ vị sạch và sáng."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu chưa nếm mù gói này nên chưa gắn điểm. Mô tả vị (cam chanh, đường nâu, chua sáng) là do nhà rang công bố; khi nào nếm mù xong Gu sẽ cập nhật."},
      {q:"Có gói lớn hơn không?",a:"Có. Ngoài gói 250g (265.000₫) còn gói 500g (500.000₫) — quy ra 100g thì gói 500g rẻ hơn khoảng 30.000₫."}
    ],
    link:"https://s.shopee.vn/19DTxusCw", anh:"assets/img/products/son-heirloom-2026.webp" },

  { id:"sp-fruitmood", guPick:"signature", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true}, brand:"Sơn Pacamara", ten:"Fruit Mood — Special Blend 250g", nhom:"hat", gia:255000, gram:250,
    slug:"son-pacamara-fruit-mood", pha:["v60","coldbrew","phin","espresso"],
    vungSlug:"da-lat", xaHuyen:"Đà Lạt + Lang Biang, Lâm Đồng",
    giong:"Blend Arabica (Typica, Heirloom)", doCao:"", process:"Washed", roast:"Medium-light", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Sơn Pacamara · Special Blend", diem:null, chua:null, dam:null, hau:null,
    chot:"Fruit Mood — blend Đà Lạt + Lang Biang, ngọt dày, đậm vị, trái cây nhiệt đới.",
    flavor:"Đã mua và uống thật — ngọt dày, đậm vị nhưng vẫn tươi tắn trái cây nhiệt đới (xoài, caramel). Blend Special của Sơn Pacamara: hạt Đà Lạt (rang vừa) trộn Lang Biang (rang sáng), 100% Arabica specialty — hợp mọi cách pha, từ pour over, phin, espresso đến cold brew. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[], tags:["Ngọt dày · trái cây","Đậm vị","Mọi cách pha"],
    nen:["Thích ngọt dày, trái cây nhiệt đới","Muốn một gói pha kiểu gì cũng hợp","Mê cold brew ngọt mát"],
    khong:["Thích chua sáng gắt thuần rang nhạt","Tìm single-origin lô rõ vùng"],
    faq:[
      {q:"Fruit Mood pha kiểu gì cũng được?",a:"Đúng vậy — blend rang vừa-sáng, hợp pour over, phin, espresso và cold brew. Cold brew cho ra vị ngọt trái cây rất dễ uống."},
      {q:"Fruit Mood blend từ gì?",a:"Hạt Đà Lạt rang vừa trộn Lang Biang rang sáng (100% Arabica specialty), cho vị ngọt dày, đậm mà vẫn tươi trái cây. Tên cũ là Breezy Blend."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu đã mua và uống thật, thấy ngọt dày dễ chịu, nhưng chưa nếm mù nên chưa gắn điểm."}
    ],
    link:"https://s.shopee.vn/40fMFepaQu", anh:"assets/img/products/son-fruit-mood.webp" },

  /* ===== 3 nhà Nam Ban — so sánh trung lập. Chưa nếm mù → tested:false. ===== */
  { id:"nb-bui", guPick:"editor", confidence:"editor_tasted", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:true}, brand:"Bui Coffee Supply", ten:"Fine Robusta Nam Ban (lên men muối) 250g", nhom:"hat", gia:179000, gram:250,
    slug:"bui-fine-robusta-nam-ban", pha:["phin","espresso"],
    vungSlug:"nam-ban", xaHuyen:"Nam Ban, Lâm Hà",
    giong:"Fine Robusta", doCao:"", process:"Lên men muối (Natri Clorua)", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Top 14 Thế giới · CQI 2024", diem:null, chua:null, dam:null, hau:null,
    flavor:"Đã mua và uống thật — đậm, cảm giác đầy miệng, hậu ngọt, đúng chất Fine Robusta đấu giải. Đây là gói để lại ấn tượng mạnh nhất với chúng tôi. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    tags:["Đậm đầy miệng","Hậu ngọt","Pha phin/máy"],
    nen:["Muốn thử đặc sản đạt giải quốc tế","Gu đậm đà","Pha phin hoặc espresso"],
    khong:["Ngân sách rất eo hẹp","Thích chua sáng nhẹ kiểu Arabica"],
    link:"https://buicoffeesupply.com/san-pham/fine-robusta-nam-ban-len-men-muoi/", anh:"assets/img/products/bui-fine-robusta.jpg" },
  { id:"tt-sanhdieu", guPick:"editor", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:false,khacBiet:true,hocThuat:true,benVung:true}, brand:"Tám Trình Coffee", ten:"Golden Birds Sành Điệu — 70% Robusta / 30% Arabica 250g", nhom:"hat", gia:135000, gram:250,
    slug:"tam-trinh-golden-birds-sanh-dieu", pha:["phin"],
    vungSlug:"nam-ban", xaHuyen:"Lâm Hà (Robusta) + Lạc Dương (Arabica)",
    giong:"Blend 70% Robusta + 30% Arabica", doCao:"", process:"", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Tám Trình · từ 1995 · tem truy xuất nguồn gốc", diem:null, chua:null, dam:null, hau:null,
    chot:"Golden Birds Sành Điệu — blend Robusta-Arabica rang mộc, dễ uống, hợp phin.",
    flavor:"Đã mua và uống thật — dễ uống, cân bằng, không kén gu; đắng dịu, hậu ngọt, hợp pha phin hằng ngày. Dòng Golden Birds ‘Sành Điệu’ của Tám Trình: 70% Robusta (Lâm Hà) trộn 30% Arabica (Lạc Dương), rang mộc không tẩm ướp. Nhà rang mô tả: đắng dịu hơn dòng truyền thống, thơm tự nhiên, thanh ngọt hậu. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.", notes:[],
    tags:["Dễ uống","Đắng dịu, hậu ngọt","Pha phin"],
    nen:["Gu phin Việt truyền thống, dễ uống","Muốn blend Robusta-Arabica cân bằng","Uống phin hằng ngày, giá mềm"],
    khong:["Thích chua sáng, trái cây kiểu Arabica rang sáng","Tìm single-origin rõ lô, rõ vùng","Chủ yếu pha pour over / V60"],
    faq:[
      {q:"Gói này hợp pha gì?",a:"Blend 70% Robusta rang mộc, làm riêng cho pha phin truyền thống — đậm, đắng dịu, hậu ngọt. Không phải gói pour over rang sáng."},
      {q:"Có mấy cỡ gói?",a:"Có 250g và 500g, kèm combo 2 gói 500g; giá dao động 135.000₫–490.000₫ theo trọng lượng. Chọn Nguyên hạt hoặc Bột pha phin."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu đã mua và uống thật, thấy dễ uống và cân bằng, nhưng chưa nếm mù nên chưa gắn điểm. Mô tả vị theo cảm nhận thật cộng công bố của nhà rang."}
    ],
    link:"https://s.shopee.vn/9ANS2eMm0w", anh:"assets/img/products/golden-birds-sanh-dieu.webp" },
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
    link:"https://s.shopee.vn/9V0IonuyQr", anh:"assets/img/products/dehavi-yellow-bourbon-bag.webp" },
  { id:"dh-arabica", guPick:"signature", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:true,khacBiet:false,hocThuat:true,benVung:true}, brand:"Dehavi (Hân Vinh)", ten:"100% Arabica Cầu Đất Pha Máy (Dehavi) 250g", nhom:"hat", gia:105000, gram:250,
    slug:"dehavi-arabica-pha-may", pha:["espresso","phin"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất, Đà Lạt",
    giong:"Arabica Catimor", doCao:"1.650–1.700m", process:"Washed / Honey", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Dehavi · Cầu Đất 1.650m", diem:null, chua:null, dam:null, hau:null,
    chot:"100% Arabica Cầu Đất pha máy — chua thanh, thảo mộc, hậu ngọt.",
    flavor:"Đã mua và uống thật — chua thanh, hương thảo mộc, hậu ngọt; bản Honey cân bằng hơn. 100% Arabica Cầu Đất (Catimor, 1.650–1.700m), rang mộc, chế biến Washed/Honey; làm cho pha máy nhưng pha phin cũng tốt. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[], tags:["Chua thanh","Pha máy/phin","Arabica Cầu Đất"],
    nen:["Pha máy espresso, moka pot","Thích Arabica chua thanh, hậu ngọt","Muốn single-origin Cầu Đất giá mềm"],
    khong:["Gu đậm đắng kiểu Robusta","Chủ yếu uống phin đậm sữa"],
    faq:[
      {q:"Washed và Honey khác gì?",a:"Washed cho vị sạch, chua thanh, hương thảo mộc; Honey ngọt và cân bằng hơn. Chọn theo gu."},
      {q:"Gói này hợp pha gì?",a:"Làm cho pha máy (espresso, moka pot), pha phin / pour over vẫn tốt. Rang medium."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu chưa nếm mù nên chưa gắn điểm. Mô tả vị theo nhà rang công bố; nếm mù xong Gu sẽ cập nhật."}
    ],
    link:"https://s.shopee.vn/2qTOqpC9bY", anh:"assets/img/products/dehavi-arabica-pha-may.webp" },
  { id:"dh-blend", guPick:"collector", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:true,khacBiet:false,hocThuat:true,benVung:true}, brand:"Dehavi (Hân Vinh)", ten:"Blend Robusta–Arabica Pha Máy (Dehavi) 250g", nhom:"hat", gia:80000, gram:250,
    slug:"dehavi-blend-pha-may", pha:["espresso","phin"],
    vungSlug:"nam-ban", xaHuyen:"Robusta Nam Ban + Arabica Cầu Đất",
    giong:"Blend Robusta (Nam Ban) + Arabica (Cầu Đất)", doCao:"", process:"Natural / Honey", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Dehavi · rang mộc", diem:null, chua:null, dam:null, hau:null,
    chot:"Blend pha máy Robusta Nam Ban + Arabica Cầu Đất — đậm đà vừa, ít gắt.",
    flavor:"Đã mua và uống thật — đậm đà vừa phải, ít gắt, dậy hương Robusta hoà quyện chua thanh và hậu ngọt của Arabica. Blend pha máy của Dehavi: Robusta Nam Ban + Arabica Cầu Đất, rang mộc, Natural/Honey, tỉ lệ tuỳ chọn (5-5, 7-3, 9-1 — càng nhiều Robusta càng đậm và nhiều caffeine). Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[], tags:["Đậm đà vừa","Pha máy/phin","Robusta–Arabica"],
    nen:["Pha máy espresso, moka pot tại nhà","Gu đậm vừa, ít gắt","Muốn chọn tỉ lệ Robusta/Arabica"],
    khong:["Thích chua sáng thuần Arabica rang nhạt","Tìm single-origin lô rõ vùng"],
    faq:[
      {q:"Tỉ lệ 5-5, 7-3, 9-1 khác gì nhau?",a:"Số đầu là % Robusta. 9-1 nhiều Robusta nhất → đậm và nhiều caffeine nhất; 5-5 cân bằng, dịu hơn. Giá dao động 80.000₫–195.000₫ theo cỡ gói (250g/500g)."},
      {q:"Gói này hợp pha gì?",a:"Làm riêng cho pha máy (espresso, moka pot), pha phin vẫn tốt. Rang mộc, đậm đà vừa."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu chưa nếm mù nên chưa gắn điểm. Mô tả vị theo nhà rang công bố."}
    ],
    link:"https://s.shopee.vn/1BLArefshh", anh:"assets/img/products/dehavi-blend-pha-may.webp" },
  /* ===== 2 nhà mới (Thay đổi ③) — số liệu tra web thật 07/2026, giá THAM KHẢO, tested:false. ===== */
  { id:"mb-redbourbon", guPick:"collector", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:true,khacBiet:true,hocThuat:true,benVung:false}, brand:"The Married Beans", ten:"Red Bourbon rang sáng Cầu Đất 250g", nhom:"hat", gia:275000, gram:250,
    slug:"married-beans-red-bourbon-cau-dat", pha:["v60","coldbrew"],
    vungSlug:"cau-dat", xaHuyen:"Cầu Đất, Lâm Đồng",
    giong:"Red Bourbon (Arabica)", doCao:"", process:"Washed", roast:"Light", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Specialty · Lâm Đồng", diem:null, chua:null, dam:null, hau:null,
    chot:"Red Bourbon washed rang sáng — chua sáng, cam chanh, caramel.",
    flavor:"Đã mua và uống thật — chua tươi sáng kiểu cam chanh (citrus), ngọt caramel/đường cháy, vị sạch cân bằng, hương dịu nhẹ; hợp pour over (V60, Kalita, Chemex) và cold brew. Lô Red Bourbon 100% Arabica, washed, rang sáng từ The Married Beans (Lâm Đồng). Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa nếm mù.",
    notes:[],
    tags:["Chua sáng","Cam chanh · caramel","Pour over/cold brew"],
    nen:["Thích chua sáng, trái cây, caramel","Pha V60 / pour over hoặc cold brew","Muốn gói rang sẵn, pha ngay"],
    khong:["Thích vị đậm, socola","Chủ yếu pha phin (rang sáng dễ chua gắt)"],
    faq:[
      {q:"Red Bourbon là gì?",a:"Là biến chủng Arabica cho quả chín màu đỏ, nổi tiếng vị ngọt cân bằng và chua trái cây thanh. Gói này 100% Red Bourbon, sơ chế washed, rang sáng."},
      {q:"Gói này hợp pha gì?",a:"Rang sáng, sơ chế washed nên hợp pour over (V60, Kalita, Chemex) và cold brew để tôn hương cam chanh, caramel. Pha phin dễ bị chua gắt."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu chưa nếm mù nên chưa gắn điểm. Mô tả vị (cam chanh, caramel, chua sáng) là do nhà rang công bố; khi nào nếm mù xong Gu sẽ cập nhật."}
    ],
    link:"https://s.shopee.vn/6pzXG4v0W8", anh:"assets/img/products/married-beans-red-bourbon.webp" },
  { id:"lv-rich", guPick:"editor", confidence:"editor_tasted", verificationDate:"2026-07-31", selectionCriteria:{signature:true,community:true,khacBiet:false,hocThuat:false,benVung:true}, brand:"Là Việt Coffee", ten:"Là Việt RICH — 100% Arabica 250g", nhom:"hat", gia:125000, gram:250,
    slug:"la-viet-rich-arabica-da-lat", pha:["espresso","phin"],
    vungSlug:"da-lat", xaHuyen:"Đà Lạt, Lâm Đồng",
    giong:"Arabica Catimor", doCao:"", process:"Wet process (washed)", roast:"Medium", ngayRang:"",
    tested:false, daUong:true, chungNhan:"Asia Top 80 · Đà Lạt", diem:null, chua:null, dam:null, hau:null,
    chot:"Là Việt RICH — Arabica rang đậm, socola đen, mạnh; giá mềm.",
    flavor:"Đã mua và uống thật — đậm, mạnh, socola đắng rõ; ngon với người thích gu đậm. Nhà rang mô tả: vị socola đen, đậm, mạnh — 100% Arabica Catimor sơ chế ướt, rang medium. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
    notes:[],
    tags:["Đậm mạnh","Socola đắng","Pha phin/máy"],
    nen:["Gu đậm, mạnh, socola đắng","Pha phin, moka pot, espresso, French press","Muốn gói ngon giá mềm (50k/100g)"],
    khong:["Thích chua sáng, trái cây","Muốn gói rang sáng pha pour over"],
    faq:[
      {q:"Gói này hợp pha gì?",a:"Rang medium, vị đậm mạnh nên hợp phin, moka pot, máy espresso và French press. Không phải gói pour over rang sáng."},
      {q:"Gói này bao nhiêu điểm?",a:"Gu đã mua và uống thật, thấy ngon với gu đậm, nhưng chưa nếm mù nên chưa gắn điểm. Mô tả vị (socola đắng, đậm) theo nhà rang công bố."},
      {q:"Giá 125.000₫ có đáng không?",a:"Quy ra 50.000₫/100g — thuộc nhóm mềm nhất ở đây mà vẫn 100% Arabica specialty. Đáng cho gu đậm uống hằng ngày."}
    ],
    link:"https://s.shopee.vn/6VMgqhk3FM", anh:"assets/img/products/la-viet-rich.webp" }
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
    a:"Không. Bạn mua đúng giá niêm yết tại nơi bán (Shopee hoặc trang chính hãng của nhà rang); chúng tôi nhận hoa hồng tiếp thị — bạn không trả thêm đồng nào." },
  { q:"Vì sao có sản phẩm không có điểm số?",
    a:"Chúng tôi chỉ công bố điểm sau khi hoàn thành bài nếm mù. Một số gói đã uống nhưng chưa qua quy trình này được gắn nhãn “Đã uống” thay vì điểm số. Chúng tôi không chấm điểm dựa trên cảm nhận nhớ lại." },
  { q:"Vì sao so giá theo 100g thay vì theo gói?",
    a:"Các gói có khối lượng khác nhau (250g, 500g…). Quy về giá/100g mới thấy gói 160.000₫/500g thực ra rẻ hơn nhiều gói 270.000₫/250g." }
];

/* ---- Kiến thức — bài viết ngắn, hiểu trước khi mua ---- */
const BAIVIET = [
  {
    id: "ca-phe-tu-goc-den-ly",
    anh: "assets/img/coffee-cherry-sorting.jpg",
    tag: "Kiến thức",
    docPhut: 9, mucDo: "Toàn cảnh",
    tieuDe: "Cà phê thực sự là gì? Từ cái cây ngoài vườn đến hạt cà phê Việt đi khắp thế giới",
    dek: "Vì sao cùng gọi là cà phê mà giá chênh nhau 5–10 lần? Chất lượng một hạt cà phê được tạo ra từ đâu, và vì sao Việt Nam xuất khẩu thứ 2 thế giới? Một bài đủ để hiểu tường tận.",
    than:
      "<p>Mỗi sáng hàng triệu người Việt uống cà phê. Việt Nam cũng là một trong những nước sản xuất và xuất khẩu cà phê lớn nhất thế giới. Nhưng nếu đưa một người đang uống cà phê một quả cà phê vừa hái và hỏi “từ quả này làm sao thành ly anh đang uống?” — không phải ai cũng trả lời được.</p>" +
      "<p>Càng ít người biết vì sao có ly cà phê vài chục nghìn, có loại vài trăm nghìn; vì sao cùng một giống trồng hai nơi lại khác vị; hay vì sao người ta ghi trên gói cà phê những thứ như độ cao, giống, vùng trồng, cách sơ chế. Muốn hiểu, nên quay về nơi đơn giản nhất: cái cây.</p>" +

      "<h3>Vì sao gọi là “cà phê”? Có phải vì có caffeine?</h3>" +
      "<p>Không — logic gần như ngược lại. Tên “coffee” có trước thuật ngữ hóa học “caffeine”. Từ này có lịch sử ngôn ngữ đi qua nhiều chặng, thường được truy về tiếng Ả Rập <i>qahwa</i>, qua tiếng Thổ <i>kahve</i>, tiếng Hà Lan <i>koffie</i>; tiếng Việt “cà phê” vay qua tiếng Pháp <i>café</i> thời người Pháp mang cây vào. Còn caffeine là tên một hợp chất tự nhiên trong hạt — tên caffeine bắt nguồn từ cách gọi cà phê trong các ngôn ngữ châu Âu, xuất hiện sau khi hợp chất này được phân lập và nghiên cứu từ cà phê.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> Không phải cây được gọi là cà phê vì nó chứa caffeine. Caffeine cũng không riêng gì cà phê — trà, cacao, guarana đều có. Và hạt cà phê không chỉ có caffeine: nó chứa cả carbohydrate, lipid, protein, acid hữu cơ và hàng trăm hợp chất khác tạo nên mùi vị.</div>" +

      "<h3>Hạt cà phê thực chất là gì?</h3>" +
      "<p>Cà phê là cây thuộc chi <i>Coffea</i>. Cây ra hoa, hoa thành quả — quả chín đỏ hoặc vàng, trông như quả anh đào nhỏ. Bên trong mỗi quả thường có hai hạt nằm úp vào nhau. Thứ ta gọi là “hạt cà phê” chính là hạt bên trong quả đó. Nói gọn cả hành trình: <b>Đất → cây → hoa → quả → thu hoạch → sơ chế → nhân xanh → rang → xay → pha → ly cà phê.</b></p>" +
      "<p>Ly cà phê chỉ là đoạn cuối. Muốn hiểu chất lượng, phải đi ngược chuỗi này về mảnh đất.</p>" +

      "<h3>Arabica và Robusta — và một hiểu lầm cần bỏ</h3>" +
      "<p>Arabica gốc Ethiopia, nhiều giống, tiềm năng hương thơm và độ phức tạp cao, nhưng đòi hỏi điều kiện khắt khe. Robusta thích nghi rộng hơn, năng suất cao, nhiều caffeine — Việt Nam đặc biệt mạnh loại này.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> Arabica không mặc định là ngon, Robusta không mặc định là hàng thấp cấp. Giống chỉ là một biến số. Một cây tiềm năng tốt nhưng trồng sai chỗ, hái quả xanh, sơ chế lỗi, rang cháy vẫn cho ly dở. Ngược lại, Robusta được chọn giống và làm kỹ có thể cho chất lượng rất cao — đó chính là Fine Robusta.</div>" +

      "<h3>Vì sao vùng trồng quyết định vị?</h3>" +
      "<p>Cùng một giống, trồng hai nơi cho kết quả khác nhau — vì cây không sống trong phòng thí nghiệm, mà trong cả một hệ sinh thái: độ cao + nhiệt độ + mưa + ánh sáng + đất + nước + giống + cách người trồng chăm sóc. Rượu vang gọi đó là <i>terroir</i>; cà phê có logic tương tự.</p>" +
      "<p>Độ cao đáng chú ý: nơi phù hợp, quả chín chậm hơn giúp hạt tích lũy hương và vị chua thanh khác đi. Nhưng không thể nói đơn giản “càng cao càng ngon” — mỗi giống có vùng thích nghi riêng. Đó là lý do cà phê Cầu Đất khác cà phê Nam Ban dù cách nhau không xa.</p>" +

      "<h3>Đất ảnh hưởng thế nào? (không như bạn nghĩ)</h3>" +
      "<p>Đất tác động qua nhiều yếu tố: khả năng giữ và thoát nước, độ sâu tầng đất, cấu trúc, độ pH, chất hữu cơ, dinh dưỡng, hệ vi sinh, khả năng bén rễ. Tây Nguyên nổi tiếng đất đỏ bazan, rất thuận cho cây lâu năm.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> “Đất đỏ bazan nên cà phê ngon” là nói quá đơn giản. Đất không bơm thẳng “vị chocolate” hay “vị trái cây” vào hạt. Đất tạo môi trường cho rễ hoạt động; cây dùng nước, khoáng, ánh sáng để tạo quả. Phải hỏi đủ: đất gì + độ cao nào + khí hậu ra sao + giống gì + trồng thế nào.</div>" +

      "<h3>Người trồng quyết định chất lượng đến đâu?</h3>" +
      "<p>Rất nhiều. Hai vườn cạnh nhau — cùng đất, cùng độ cao, cùng giống — nhưng một bên quản lý dinh dưỡng tốt, tỉa cành, kiểm soát sâu bệnh, hái đúng quả chín; bên kia hái lẫn quả xanh, quả khô. Hai lô cà phê sẽ không giống nhau. Quả cà phê như trái cây: độ chín quyết định thành phần bên trong. Và hái xong vẫn chưa xong — sơ chế sai thì lô rất tốt ngoài vườn vẫn hỏng.</p>" +
      "<p>Thiên nhiên tạo tiềm năng. Người trồng và người làm cà phê quyết định giữ lại được bao nhiêu.</p>" +

      "<h3>Sơ chế: nơi quả biến thành nguyên liệu cho nhà rang</h3>" +
      "<p>Sau khi hái, phải tách hạt và làm khô. Ba cách chính: <b>Natural</b> (phơi cả quả còn thịt — thường có xu hướng vị trái cây đậm hơn), <b>Washed</b> (rửa sạch thịt trước khi phơi — thường cho vị trong trẻo hơn), <b>Honey</b> (giữ lại một phần lớp nhầy). Xu hướng chứ không phải quy luật — sơ chế không đảm bảo một profile cố định, còn tùy giống, vùng và tay nghề. Đây là lý do cùng nông trại, cùng giống, cùng vụ mà hai lô sơ chế khác nhau cho hai trải nghiệm hoàn toàn khác.</p>" +

      "<h3>Đo chất lượng cà phê bằng cách nào?</h3>" +
      "<p>Không có máy bỏ hạt vào rồi hiện “ngon”. Đo hai tầng. <b>Tầng vật lý:</b> độ ẩm, kích thước, khối lượng riêng, độ đồng đều, tỷ lệ hạt lỗi/đen/vỡ, tạp chất. Nhưng hạt đẹp chưa chắc uống ngon — nên còn <b>tầng hai: nếm.</b> Người ta rang mẫu rồi thử nếm trong điều kiện chuẩn (gọi là <i>cupping</i>), đánh giá hương, vị, độ chua, độ ngọt, cảm giác trong miệng, hậu vị.</p>" +

      "<h3>Ai đặt ra chữ “Specialty Coffee” — và con số 80 từ đâu ra?</h3>" +
      "<p>Muốn hiểu đúng Specialty Coffee, phải tách hai chuyện thường bị nhập làm một: người đặt ra thuật ngữ không phải người đặt ra mốc 80 điểm.</p>" +
      "<p>Năm 1974 tại Mỹ, <b>Erna Knutsen</b> — một người kinh doanh cà phê nhân xanh ở San Francisco — dùng thuật ngữ “Specialty Coffee” để nói về những loại cà phê có hương vị đặc biệt, được tạo ra trong những điều kiện phù hợp, đặc biệt là vi khí hậu. Điều bà nhìn thấy đơn giản mà quan trọng: không phải mọi hạt cà phê đều giống nhau, và không nên bán tất cả như một loại hàng hóa vô danh. Bà không phải cơ quan quản lý, cũng không đặt ra mốc 80/100 — ảnh hưởng của bà là ở chỗ nhận ra, gọi tên và góp phần hình thành một phân khúc mới.</p>" +
      "<p>Sau đó ngành lớn dần. Năm 1982, Hiệp hội Cà phê Đặc sản Hoa Kỳ (SCAA) ra đời để có diễn đàn chung và xây tiêu chuẩn chất lượng. Các phương pháp đánh giá ngày càng được chuẩn hóa; trong hệ thống chấm điểm dùng rộng rãi, cà phê được đánh giá trên thang 100, và 80/100 trở thành ngưỡng phân loại quen thuộc của specialty grade.</p>" +
      "<div class='callout'><b>⚠️ Hiểu cho đúng con số 80:</b> Đó là 80 điểm trên thang 100, không phải “80 tiêu chí”. Nó không phải con số Erna Knutsen nghĩ ra, và cũng không phải một “định luật tự nhiên” khiến hạt 79,9 là cà phê thường còn hạt 80,0 bỗng thành đặc sản. Nó là một ngưỡng phân loại do ngành xây dựng để có ngôn ngữ chung khi đánh giá và giao dịch.</div>" +
      "<p>Ngày nay Hiệp hội Cà phê Đặc sản (SCA) — hình thành năm 2017 từ việc hợp nhất SCAA của Mỹ và SCAE của châu Âu — tiếp tục phát triển cách đánh giá này, và không còn xem một điểm tổng duy nhất là toàn bộ câu chuyện. Có thể hiểu lịch sử chữ Specialty bằng ba bước: <b>1974</b> — nhận ra sự khác biệt (Erna Knutsen); <b>sau đó</b> — tìm cách đo và chuẩn hóa sự khác biệt (ngành specialty); <b>ngày nay</b> — hiểu giá trị của sự khác biệt rộng hơn một con số (SCA hiện đại). Không phải một con số làm hạt cà phê trở nên đặc biệt — con số chỉ là một trong những cách con người cố đo và nói về sự khác biệt của nó.</p>" +

      "<h3>Specialty Coffee thực sự là gì?</h3>" +
      "<p>Đây là một chữ rất hay bị hiểu sai. Specialty Coffee không đơn giản nghĩa là “cà phê ngon”, “cà phê đắt”, “Arabica”, hay “cứ đạt 80 điểm là xong”.</p>" +
      "<p>Trong cách phân loại truyền thống, cà phê đạt từ 80/100 trở lên khi được chấm theo hệ thống chuyên môn thì được xem là specialty grade. Nhưng nếu chỉ nói “Specialty là cà phê trên 80 điểm” thì ngày nay chưa đủ. SCA hiện định nghĩa: Specialty Coffee là cà phê hoặc trải nghiệm cà phê được công nhận bởi những thuộc tính khác biệt, và chính những thuộc tính đó tạo ra giá trị gia tăng đáng kể trên thị trường.</p>" +
      "<p>“Thuộc tính khác biệt” có thể nằm ngay trong hạt và trong ly — hương, vị, cảm giác trong miệng, đặc điểm vật lý của hạt. Nhưng cũng có thể gắn với thông tin phía sau nó — nguồn gốc, giống, người sản xuất, cách canh tác, cách sơ chế. Đây là điểm quan trọng nhất: nó không chỉ hỏi “cà phê này ngon không?”, mà hỏi “cà phê này có gì khác biệt, và điều khác biệt ấy có tạo ra giá trị không?”</p>" +
      "<p>Một lô có hương vị đặc biệt, một giống hiếm, một vùng trồng thể hiện đặc tính riêng, một cách sơ chế tạo profile khác, một nông trại truy xuất rõ ràng — đều có thể là thuộc tính tạo nên giá trị. Vì vậy cũng cần phân biệt: có nguồn gốc rõ chưa chắc đã là specialty; Arabica chưa chắc là specialty; đắt tiền chưa chắc là specialty; một người thấy ngon cũng chưa đủ gọi là specialty. Và mốc 80/100, dù quan trọng trong lịch sử và vẫn dùng rộng rãi trong thương mại, không còn diễn tả toàn bộ cách ngành nhìn giá trị một hạt cà phê. Nói đơn giản nhất: cà phê hàng hóa được giao dịch vì nó là cà phê; Specialty Coffee được trả thêm giá trị vì người ta nhận ra điều đặc biệt của chính nó. Đó là lúc một hạt cà phê không còn vô danh — nó bắt đầu có một hộ chiếu.</p>" +

      "<h3>Vì sao Việt Nam xuất khẩu cà phê hàng đầu thế giới?</h3>" +
      "<p>Việt Nam xuất khẩu cà phê lớn thứ hai thế giới, chỉ sau Brazil, chiếm khoảng 17% sản lượng toàn cầu; riêng Robusta thì đứng số 1 thế giới. Năm 2024 xuất khẩu đạt kỷ lục khoảng 5,48 tỷ USD. Trung tâm là Tây Nguyên (Đắk Lắk, Lâm Đồng, Đắk Nông, Gia Lai, Kon Tum) — chiếm khoảng 90% sản lượng cả nước.</p>" +
      "<p>Nhưng lợi thế không chỉ ở thiên nhiên. Nó nằm ở cả một hệ thống: vùng trồng quy mô lớn + kinh nghiệm nông dân hàng chục năm + năng suất cao + thu mua + chế biến + logistics + ngành xuất khẩu. Một nước không thể xuất hàng triệu tấn chỉ nhờ trồng được cây — phải có cả cỗ máy chuỗi cung ứng phía sau.</p>" +

      "<h3>Nước ngoài nhập cà phê Việt về làm gì? Có phải chỉ để uống?</h3>" +
      "<p>Nhiều người hình dung: Việt Nam trồng → đóng bao → nước ngoài mua → pha uống. Thực tế chuỗi dài hơn nhiều. Phần lớn xuất đi dưới dạng nhân xanh (hạt sống chưa rang), rồi mới vào chuỗi công nghiệp toàn cầu:</p>" +
      "<ul>" +
      "<li><b>Rang &amp; bán dưới thương hiệu của họ:</b> một gói cà phê mang nhãn châu Âu, Mỹ, Nhật có thể chứa hạt Việt mà người uống cuối không hề biết.</li>" +
      "<li><b>Phối trộn (blend):</b> Robusta Việt được trộn vào để tăng body, caffeine, tạo lớp crema dày cho espresso.</li>" +
      "<li><b>Cà phê hòa tan:</b> Robusta rang, xay, chiết xuất rồi sấy thành cà phê hòa tan — một mảng cực lớn.</li>" +
      "<li><b>Chiết xuất &amp; hợp chất:</b> trong sản xuất cà phê decaf, caffeine được tách khỏi hạt rồi tinh sạch, có thể thành nguyên liệu cho ngành khác. Hạt xanh cũng chứa chlorogenic acid đang được nghiên cứu.</li>" +
      "<li><b>Đồ uống &amp; thực phẩm:</b> cà phê hoặc chiết xuất đi vào nước đóng chai, kem, bánh, kẹo, chocolate.</li>" +
      "</ul>" +
      "<div class='callout'><b>⚠️ Nói cho đúng:</b> Không phải cứ rời cảng Việt Nam là hạt được đem rang pha ngay. Một hạt Robusta Tây Nguyên có thể qua vài quốc gia, một nhà rang, một nhà máy thực phẩm trước khi tới người dùng. Các ứng dụng như chiết caffeine là điều CÓ THỂ của cà phê nói chung — không có nghĩa nước ngoài nhập lượng lớn cà phê Việt để chiết caffeine; đầu ra chính vẫn là rang, blend và cà phê hòa tan. Cũng cần phân biệt: caffeine có mặt trong vài loại thuốc giảm đau phối hợp không có nghĩa thuốc đó “làm từ cà phê” — đó là hai chất khác nhau.</div>" +

      "<h3>Nghịch lý — và chỗ đứng của cà phê đặc sản Việt</h3>" +
      "<p>Việt Nam rất mạnh ở sản xuất nguyên liệu, nhưng phần giá trị cao thường nằm ở khâu sau: rang → thương hiệu → phân phối → trải nghiệm. Một container cà phê nhân và hàng triệu ly làm ra từ nó là hai thế giới giá trị khác hẳn. Đó là lý do cà phê đặc sản quan trọng: thay vì chỉ bán thật nhiều, nó giúp thế giới biết từng hạt đến từ đâu — nâng cà phê Việt từ “nhiều” lên “tinh”.</p>" +
      "<p>Rượu vang không chỉ nói “rượu Pháp” mà nói Bordeaux, Burgundy. Cà phê cũng đang đi theo: quốc gia → vùng → nông trại → giống → lô → cách sơ chế. Càng truy về gần mảnh đất, hạt cà phê càng có danh tính rõ.</p>" +

      "<h3>Muốn hiểu cà phê, hãy đi ngược từ chiếc ly về mảnh đất</h3>" +
      "<p>Một ly cà phê mất vài phút để pha, nhưng phía sau là vài năm cây trưởng thành, nhiều tháng quả phát triển, hàng chục quyết định của người trồng, người sơ chế, người rang. Lần tới cầm một gói cà phê, thay vì chỉ hỏi “ngon không?”, thử hỏi thêm: Nó từ đâu? Giống gì? Ai trồng? Hái thế nào? Sơ chế ra sao? Đo chất lượng bằng cách nào? Khi bắt đầu hỏi những câu đó, ta không còn chỉ uống cà phê — ta bắt đầu hiểu một hạt cà phê.</p>" +
      "<p><b>Gu khuyên:</b> Đây là lý do trong mỗi bài đánh giá, Gu luôn ghi rõ giống, vùng, độ cao, cách sơ chế — để mỗi gói có “hộ chiếu” của nó. <a href='/ca-phe'>Xem những gói Gu đã uống và đánh giá</a>, hoặc nếu mới bắt đầu, đọc <a href='/bat-dau/ca-phe-chua'>vì sao cà phê ngon lại chua</a>.</p>",
    faq: [
      { q: "Vì sao gọi là “cà phê”? Có phải vì có caffeine?", a: "Không. Từ “coffee” có lịch sử ngôn ngữ đi qua nhiều chặng, thường truy về tiếng Ả Rập qahwa, qua tiếng Thổ kahve, tiếng Hà Lan koffie; tiếng Việt vay qua tiếng Pháp café. Tên caffeine bắt nguồn từ cách gọi cà phê trong các ngôn ngữ châu Âu và xuất hiện sau khi hợp chất này được phân lập, nghiên cứu từ cà phê. Nhiều cây khác như trà, cacao cũng có caffeine." },
      { q: "Specialty coffee nghĩa là cà phê đắt tiền?", a: "Không. Giá cao không tự biến cà phê thành specialty. Cốt lõi là những thuộc tính khác biệt tạo ra giá trị, và khả năng nhận biết, truy xuất chúng xuyên suốt chuỗi sản xuất. Mốc 80/100 điểm là cách hiểu phổ biến trong lịch sử, nhưng định nghĩa nay rộng hơn một con số." },
      { q: "Việt Nam chủ yếu trồng Arabica hay Robusta?", a: "Robusta, chiếm phần áp đảo. Việt Nam vẫn trồng Arabica ở vùng phù hợp như Lâm Đồng, Sơn La, Điện Biên, Quảng Trị." },
      { q: "Đất đỏ bazan có phải cứ trồng là ngon?", a: "Không. Đất bazan thuận lợi cho cây, nhưng chất lượng là kết quả của cả hệ thống: đất + độ cao + khí hậu + giống + cách trồng + độ chín khi hái + sơ chế. Vườn đất tốt mà làm ẩu vẫn cho hạt kém." },
      { q: "Hai vườn cạnh nhau có thể cho chất lượng khác nhau không?", a: "Có. Cách quản lý cây, nước, dinh dưỡng, sâu bệnh, độ chín khi hái có thể khiến hai lô khác hẳn dù điều kiện tự nhiên gần giống nhau." },
      { q: "Cà phê càng trồng cao càng ngon?", a: "Không phải lúc nào cũng vậy. Độ cao ảnh hưởng môi trường sinh trưởng, nhưng mỗi giống có vùng thích nghi riêng. Phải xét cùng nhiệt độ, đất, mưa, giống, cách canh tác." },
      { q: "Làm sao biết cà phê tốt hay xấu?", a: "Kết hợp kiểm tra vật lý (độ ẩm, kích thước, hạt lỗi…) với thử nếm cảm quan. Không thể chỉ nhìn hạt hay chỉ nhìn giá." },
      { q: "Vì sao Việt Nam xuất khẩu cà phê nhiều như vậy?", a: "Vì có vùng Robusta quy mô rất lớn ở Tây Nguyên, khí hậu phù hợp, năng suất cao, nông dân kinh nghiệm lâu năm, và cả hệ thống thu mua–chế biến–xuất khẩu quy mô công nghiệp. Riêng Robusta, Việt Nam đứng số 1 thế giới." },
      { q: "Nước ngoài nhập cà phê Việt về chỉ để uống?", a: "Không hẳn. Phần lớn là nhân xanh, đi vào chuỗi công nghiệp: rang bán dưới thương hiệu khác, trộn blend, làm cà phê hòa tan, chế biến thành đồ uống và thực phẩm. Nhưng đầu ra cốt lõi vẫn là thực phẩm và đồ uống." },
      { q: "Một hạt cà phê ngon được tạo ra ở nhà rang hay ngoài vườn?", a: "Cả chuỗi đều quan trọng, nhưng tiềm năng của hạt được tạo ra ngoài vườn — từ giống, vùng trồng, quá trình phát triển quả. Rang giỏi không cứu được hạt nguyên liệu tệ; pha giỏi không lấy lại được thứ đã mất ngoài vườn." }
    ],
    links: [
      { label: "Xem các gói Gu đã đánh giá", href: "/ca-phe" },
      { label: "Vì sao cà phê ngon lại chua", href: "/bat-dau/ca-phe-chua" }
    ]
  },
  {
    id: "vong-tron-huong-vi-robusta-2025",
    anh: "assets/img/robusta-wheel-en.png",
    tag: "Kiến thức",
    docPhut: 14, mucDo: "Chuyên sâu",
    tieuDe: "Robusta có 103 cách để nói về hương vị: Vòng tròn hương vị Canephora 2025 và câu chuyện của Lâm Đồng",
    dek: "Robusta lâu nay thường được nhớ bằng vài chữ: đắng, mạnh, nhiều caffeine. Nhưng năm 2025, một nghiên cứu khoa học đã xây dựng vòng tròn hương vị đầu tiên dành riêng cho Coffea canephora từ 67 mẫu ở 13 quốc gia, 49 chuyên gia thử nếm và 103 mô tả cảm quan. Đáng chú ý: Việt Nam có mặt trong nghiên cứu, với mẫu từ Gia Lai, Đắk Lắk và Lâm Đồng.",
    than:
      "<p>Nếu hỏi một người bình thường <b>“Robusta có vị gì?”</b>, câu trả lời thường rất ngắn: đắng, đậm, mạnh, nhiều caffeine. Còn nếu hỏi về cà phê có hương hoa, trái cây, caramel hay những tầng hương phức tạp, người ta thường nghĩ ngay đến Arabica.</p>" +
      "<p>Cách nghĩ đó có nguyên nhân lịch sử. Một phần rất lớn Coffea canephora — loài cà phê thường được gọi là Robusta — từ lâu được sản xuất và giao dịch trong phân khúc commodity. Trong khi đó, thế giới specialty coffee phát triển mạnh quanh Arabica, từ cách chấm điểm đến bộ từ vựng cảm quan.</p>" +
      "<p>Nhưng có một câu hỏi đáng đặt ra: <b>nếu chúng ta chưa có đủ từ để mô tả một loại cà phê, liệu có phải loại cà phê đó đơn giản — hay chỉ là ngôn ngữ của chúng ta chưa đủ?</b></p>" +
      "<p>Năm 2025, một nhóm nhà khoa học đã đi khá sâu vào câu hỏi này. Kết quả là một <b>vòng tròn hương vị dành riêng cho Coffea canephora</b>, gồm 103 descriptor. Và với Việt Nam, câu chuyện đặc biệt thú vị: trong những hạt cà phê được dùng để xây dựng chính công cụ đó, <b>có cà phê từ Lâm Đồng</b>.</p>" +
      "<figure><img src='/assets/img/robusta-wheel-en.png' alt='Vòng tròn hương vị Coffea canephora — 103 descriptor, ba tầng' loading='lazy'><figcaption>Vòng tròn hương vị Coffea canephora — 103 mô tả, ba tầng. Dựa trên Carvalho và cộng sự (2025); đồ hoạ: Gu Cà Phê.</figcaption></figure>" +

      "<h3>Trước hết: Robusta và Coffea canephora có phải một?</h3>" +
      "<p>Tên khoa học của loài là <b>Coffea canephora</b>. Trong đời sống và thương mại, chúng ta quen gọi nó là <b>Robusta</b>. Tuy nhiên nếu nói thật chính xác về thực vật học, “Canephora” và “Robusta” không hoàn toàn là hai từ đồng nghĩa.</p>" +
      "<p>Nghiên cứu năm 2025 cũng lưu ý rằng Coffea canephora có các nhóm/kiểu trồng thương mại khác nhau, nổi bật là <b>Robusta và Conilon</b>, với những khác biệt nhất định về chất lượng ly. Vì vậy tên chính xác nhất của công cụ khoa học mới là <b>Coffea canephora flavour wheel</b>. Trong bài này Gu vẫn dùng “Vòng tròn hương vị Robusta” ở những chỗ cần dễ hiểu, vì đó là cách người Việt quen gọi.</p>" +

      "<h3>Vòng tròn hương vị cà phê là gì?</h3>" +
      "<p>Hãy tưởng tượng bạn uống một ly cà phê và cảm thấy “có mùi gì đó quen lắm...” nhưng không biết gọi tên. Vòng tròn hương vị — <i>flavor wheel</i> — giống như một <b>tấm bản đồ từ vựng cho mũi và miệng</b>.</p>" +
      "<p>Người thử thường bắt đầu từ một nhóm rộng: <b>Fruity</b> — trái cây. Sau đó đi sâu hơn: <b>Citrus fruit</b> — trái cây họ cam chanh. Rồi cụ thể hơn nữa: <b>Lemon</b> — chanh.</p>" +
      "<p>Nó không làm cho cà phê ngon hơn. Nó giúp con người <b>gọi tên thứ đang có trong ly một cách có hệ thống hơn</b>. Và khi người trồng, người sơ chế, trader, nhà rang, cupper và người mua cùng có một bộ từ tương đối thống nhất, họ có thể nói chuyện với nhau chính xác hơn về chất lượng.</p>" +

      "<h3>Vấn đề: bộ từ vựng cũ chưa đại diện tốt cho Canephora chất lượng cao</h3>" +
      "<p>Đây là phần cần hiểu thật chính xác. Không nên nói đơn giản “trước đây người ta lấy vòng Arabica để chấm Robusta nên Robusta bị chấm oan” — paper không chứng minh điều đó. Câu chuyện tinh tế hơn.</p>" +
      "<p>Bộ <b>World Coffee Research Sensory Lexicon</b> đứng sau Coffee Taster’s Flavor Wheel hiện đại được phát triển từ nhiều loại mẫu cà phê. Trong đó có cả Robusta, nhưng những mẫu Robusta được sử dụng là <b>commercial Robusta</b>; còn những mẫu specialty trong bộ dữ liệu đó là Arabica.</p>" +
      "<p>Các tác giả nghiên cứu 2025 chỉ ra một hệ quả quan trọng: <b>những thuộc tính aroma, taste và mouthfeel tích cực của Robusta chất lượng cao chưa được đại diện đầy đủ trong coffee lexicon và flavor wheel hiện hành</b>.</p>" +
      "<p>Đây là khác biệt rất lớn. Không phải công cụ cũ “sai”. Không phải Arabica “áp bức” Robusta. Mà là: <b>dữ liệu dùng để xây công cụ cũ chưa bao phủ đủ thế giới cảm quan của Canephora chất lượng cao</b>. Vì vậy Canephora cần được nghiên cứu bằng chính Canephora.</p>" +

      "<h3>Năm 2025: lần đầu có nghiên cứu xây flavor wheel riêng cho Coffea canephora</h3>" +
      "<p>Ngày <b>13 tháng 5 năm 2025</b>, nghiên cứu <b>“Development of a flavour wheel for Coffea canephora using rate-all-that-apply”</b> được công bố trên <b>Scientific Reports</b>, thuộc Nature Portfolio.</p>" +
      "<p>Nhóm tác giả gồm: <b>Fabiana M. Carvalho</b> (UNICAMP, Brazil); <b>Enrique A. Alves</b> (EMBRAPA); <b>Mateus M. Artêncio</b> (University of São Paulo); <b>Alvaro L. L. Cassago</b> (University of São Paulo); <b>Lucas L. Pereira</b> (Federal Institute of Espírito Santo). Fabiana M. Carvalho là corresponding author.</p>" +
      "<p>Đây là chi tiết đáng nhấn mạnh vì trên mạng hiện có một số bài viết ghi sai tác giả hoặc gắn nghiên cứu với những tổ chức không phải nhóm tác giả của paper. Bản thân các tác giả cho biết đây là một <b>non-funded project</b> và cảm ơn nhiều cá nhân, doanh nghiệp, tổ chức trong cộng đồng specialty đã hỗ trợ mẫu và địa điểm cupping.</p>" +
      "<p>Nói ngắn gọn: <b>đây là một nghiên cứu khoa học peer-reviewed, không phải flavor wheel do một thương hiệu cà phê tự nghĩ ra</b>.</p>" +

      "<h3>Họ đã làm nghiên cứu như thế nào?</h3>" +
      "<p>Đây là lý do Gu thấy nghiên cứu này đáng đọc hơn một tấm poster đẹp. Nhóm nghiên cứu sử dụng tổng cộng <b>67 mẫu Coffea canephora</b> từ <b>13 quốc gia</b>, với nhiều nguồn gốc, mức chất lượng và phương pháp sau thu hoạch khác nhau — có cả specialty coffee và low-grade/commercial coffee, có cả các phương pháp như natural, honey và washed.</p>" +
      "<p>Tổng cộng <b>49 professional coffee graders</b> tham gia nghiên cứu, trong đó 40 người có chứng nhận <b>Q Grader và/hoặc R Grader</b>. Các chuyên gia thuộc cả phía nước xuất khẩu (Brazil) và nước nhập khẩu (cupping tại Switzerland).</p>" +
      "<p>Đây là một điểm hay của thiết kế nghiên cứu: nó không chỉ hỏi Canephora có những descriptor nào, mà còn xem <b>những người ở hai phía khác nhau của chuỗi cà phê có mô tả và đánh giá chúng giống nhau hay không</b>.</p>" +

      "<h3>RATA là gì?</h3>" +
      "<p>Tên paper có cụm <b>Rate-All-That-Apply — RATA</b>. Hiểu đơn giản, người thử được cung cấp một danh sách các thuật ngữ cảm quan; khi nếm một mẫu, họ chọn những từ thực sự phù hợp với thứ mình cảm nhận và đánh giá cường độ bằng thang điểm.</p>" +
      "<p>Nhưng danh sách đó không phải tự nhiên xuất hiện. Một nguồn dữ liệu rất lớn đứng phía sau nó đến từ <b>2.300 mẫu Coffea canephora Brazil được cupping từ năm 2019 đến 2023</b>. Từ dữ liệu có sẵn, tài liệu khoa học trước đó và những thuật ngữ phát sinh trong quá trình đánh giá, nhóm nghiên cứu xây dựng rồi tiếp tục làm sạch bộ từ vựng.</p>" +
      "<p>Ban đầu các graders tạo/chọn tổng cộng <b>202 thuật ngữ</b>. Sau khi gộp những từ gần nghĩa, còn <b>170 descriptor</b>. Sau đó, các descriptor có average mean score dưới 0,5 không được đưa vào hình flavor wheel cuối cùng để bảo đảm khả năng đọc. Kết quả: <b>103 descriptor</b>. Đó là nguồn gốc của con số 103.</p>" +

      "<h3>103 không có nghĩa một ly Robusta có 103 vị</h3>" +
      "<p>Đây là hiểu lầm rất dễ xảy ra. <b>103 descriptor là bộ từ xuất hiện trên toàn bộ vòng tròn cuối cùng</b> — không phải một hạt có 103 hương vị, không phải mỗi Robusta đều phải có 103 vị, và càng không phải checklist để người uống cố tìm đủ.</p>" +
      "<p>Hãy tưởng tượng flavor wheel giống bản đồ Việt Nam: bản đồ có Hà Nội, Huế, Đà Lạt, Cần Thơ... nhưng bạn đang đứng ở một nơi cụ thể. Một ly Robusta cũng vậy. Wheel cho bạn biết <b>những vùng ngôn ngữ có thể đi tới</b>; còn ly trước mặt thể hiện descriptor nào là chuyện của chính ly đó.</p>" +

      "<h3>Cấu trúc của Vòng tròn Canephora</h3>" +
      "<p>103 descriptor được tổ chức thành <b>ba tầng</b>. <b>Tier 1 — nhóm lớn</b> (vòng trong cùng), ví dụ: Roasted, Sweet, Fruity, Cocoa. <b>Tier 2 — nhóm nhỏ hơn</b>, ví dụ từ Fruity có thể đi vào một nhóm trái cây cụ thể hơn. <b>Tier 3 — descriptor cụ thể</b> (vòng ngoài cùng), ví dụ: lemon.</p>" +
      "<p>Cách đọc vì vậy rất tự nhiên: <b>chung → hẹp hơn → cụ thể</b>. Người mới không cần nhìn vào 103 từ rồi hoảng; hãy bắt đầu từ câu đơn giản “nó làm mình liên tưởng đến nhóm gì?”.</p>" +

      "<h3>Phát hiện đáng chú ý: Roasted → Sweet → Fruity → Cocoa</h3>" +
      "<p>Khi tính average mean score cho các nhóm Tier 1, thứ tự đứng đầu là: <b>1. Roasted (Rang) · 2. Sweet (Ngọt) · 3. Fruity (Trái cây) · 4. Cocoa (Cacao)</b>. Ở đầu kia, <b>Salty (Mặn)</b> có average mean score thấp nhất.</p>" +
      "<p>Đây là một kết quả rất đáng suy nghĩ. Bởi hình ảnh phổ biến của Robusta thường xoay quanh đắng — mạnh — gắt. Nhưng khi 67 mẫu Canephora đa dạng được đưa cho các professional graders và mô tả bằng một vocabulary rộng hơn, những nhóm nổi bật ngay sau Roasted lại là Sweet, Fruity, Cocoa.</p>" +
      "<p>Điều này không có nghĩa mọi Robusta đều ngọt và trái cây, cũng không có nghĩa bitterness biến mất. Nhưng nó cho thấy một điều chắc chắn hơn: <b>thế giới cảm quan của Coffea canephora rộng hơn rất nhiều so với chữ “đắng”</b>.</p>" +

      "<h3>Caramel là descriptor cụ thể nổi bật nhất</h3>" +
      "<p>Trong các descriptor riêng lẻ được phân tích, <b>Caramel</b> đạt average mean score cao nhất: <b>21,4</b>. Điều này khá thú vị. Khi nói Robusta, chúng ta thường nói body, đắng, caffeine; nhưng dữ liệu cảm quan của nghiên cứu lại cho thấy caramel có vai trò rất nổi bật trong tập mẫu.</p>" +
      "<p>Một lần nữa: đây là kết quả của <b>tập 67 mẫu nghiên cứu</b>, không phải tuyên bố rằng mọi Robusta trên thế giới đều có caramel. Flavor science luôn cần giữ ranh giới đó.</p>" +

      "<h3>Canephora thực sự có những descriptor rất khác</h3>" +
      "<p>Paper cho thấy có sự chồng lấn đáng kể giữa Canephora wheel và Arabica wheel — điều này hợp lý, vì cả hai đều là cà phê. Nhưng các tác giả cũng tìm thấy những khác biệt đáng chú ý, với đóng góp đáng kể từ những nhóm như <b>positive woody</b> (ví dụ oak barrel, cedar), <b>aromatic spices</b> (ví dụ cardamom, rosemary) và <b>fermented alcoholic</b> (ví dụ rum, liqueur). Những descriptor này không hiện diện theo cùng cách trong Arabica flavor wheel. Và đặc biệt có một nhóm rất thú vị: <b>Umami</b>.</p>" +

      "<h3>Umami trong cà phê Robusta là gì?</h3>" +
      "<p>Trong Canephora wheel, các tác giả xếp những descriptor như <b>tomato</b> (cà chua), <b>fermented soy sauce / shoyu</b> (nước tương lên men), <b>coconut water</b> (nước dừa) và <b>mushroom</b> (nấm) vào nhóm <b>Umami</b>. Paper cho rằng các descriptor này <b>dường như là những đặc tính riêng đáng chú ý của C. canephora so với Arabica wheel</b>, đồng thời nhấn mạnh rằng cần nghiên cứu thêm để hiểu nền tảng hóa học của sự khác biệt.</p>" +
      "<p>Hai chữ cuối rất quan trọng: <b>cần nghiên cứu thêm</b>. Chúng ta không nên nhảy từ “người thử cảm nhận umami” sang “Robusta có nhiều glutamate nên tạo umami” nếu nghiên cứu này chưa chứng minh cơ chế đó. Flavor wheel mô tả <b>cái con người cảm nhận</b>; nó chưa tự động giải thích toàn bộ <b>tại sao về mặt hóa học</b>.</p>" +

      "<h3>“Nước dừa” trong cà phê có nghĩa người ta cho nước dừa vào?</h3>" +
      "<p>Không. Đây là nguyên tắc cơ bản của sensory. Khi một cupper nói “tôi cảm nhận coconut water”, họ đang mô tả một <b>liên tưởng cảm quan</b>. Tương tự khi một cà phê được mô tả lemon, chocolate, caramel, jasmine, cedar... không có nghĩa những thứ đó được bỏ vào cà phê.</p>" +
      "<p>Hàng trăm hợp chất dễ bay hơi, các chất tạo vị và sự tương tác của chúng tạo ra tín hiệu cảm giác. Bộ não so sánh tín hiệu đó với “thư viện mùi vị” mà chúng ta đã tích lũy từ trước. Descriptor đơn giản là cách nói: <b>“cái này làm tôi nhớ đến cái gì?”</b></p>" +

      "<h3>Còn mít và sầu riêng thì sao?</h3>" +
      "<p>Đây là một chi tiết Gu muốn nói thật rõ, vì trên mạng đang có nhiều infographic và bài viết kể rằng wheel mới có mít, sầu riêng, thanh long... Paper gốc cho phép kiểm tra chuyện này.</p>" +
      "<p><b>Jackfruit (mít)</b> thực sự xuất hiện trong danh sách 170 descriptor sau khi nhóm thuật ngữ. Nhưng average mean score của jackfruit chỉ là <b>0,20</b>, trong khi ngưỡng để descriptor được đưa lên wheel cuối cùng là <b>≥ 0,50</b>. Vì vậy: <b>mít KHÔNG nằm trong 103 descriptor của flavor wheel cuối cùng</b> — nó xuất hiện trong dữ liệu nghiên cứu, nhưng bị loại khỏi graphic cuối. Đây là hai chuyện khác nhau.</p>" +
      "<p>Còn những claim như sầu riêng, thanh long thì không nên đưa vào danh sách chính thức của wheel nếu không chỉ ra được dữ liệu gốc tương ứng. Đây chính là lý do Gu ưu tiên paper hơn infographic: một chi tiết nhỏ sai có thể được copy hàng trăm lần và cuối cùng biến thành “sự thật trên Internet”.</p>" +

      "<h3>Việt Nam không chỉ “có mặt” — Lâm Đồng thực sự có mẫu trong nghiên cứu</h3>" +
      "<p>Đây là phần đặc biệt nhất với Gu. Bảng mẫu của paper ghi rõ:</p>" +
      "<ul>" +
      "<li><b>Cupping session 1 — Development.</b> Việt Nam: Gia Lai; Lâm Đồng — 3 mẫu, gồm 2 specialty natural và 1 low-grade.</li>" +
      "<li><b>Cupping session 2 — Validation.</b> Việt Nam: Đắk Lắk; Lâm Đồng — 4 mẫu specialty, với các phương pháp natural, honey và washed.</li>" +
      "</ul>" +
      "<p>Vậy chúng ta có thể nói chắc chắn: <b>Lâm Đồng có mẫu Coffea canephora tham gia quá trình phát triển và xác nhận flavor wheel 2025</b>. Đây không phải suy đoán — nó nằm trong Table 2 của paper.</p>" +

      "<h3>Nhưng điều đó KHÔNG có nghĩa 103 descriptor là “hương vị Robusta Lâm Đồng”</h3>" +
      "<p>Đây là ranh giới Gu muốn giữ rất chặt. Nghiên cứu sử dụng 67 mẫu từ 13 quốc gia; wheel là kết quả tổng hợp của <b>toàn bộ tập mẫu</b>. Do đó không thể nhìn thấy “coconut water” rồi viết “Robusta Lâm Đồng có vị nước dừa”, cũng không thể nhìn thấy “star fruit” rồi kết luận “đây là vị khế đặc trưng của Việt Nam”. Muốn nói descriptor nào đặc trưng cho Lâm Đồng, cần phân tích dữ liệu ở cấp từng mẫu hoặc thực hiện nghiên cứu riêng. Paper hiện tại không cho phép Gu nhảy tới kết luận đó.</p>" +

      "<h3>Và càng chưa thể nói Nam Ban có vị gì</h3>" +
      "<p>Nam Ban thuộc vùng Lâm Hà, Lâm Đồng. Điều đó khiến nghiên cứu này rất gần Gu về địa lý. Nhưng paper ghi <b>Lâm Đồng</b>, không ghi <b>Nam Ban</b> hay <b>Lâm Hà</b>. Vì vậy câu đúng không phải “khoa học đã chứng minh Robusta Nam Ban có 103 hương vị”.</p>" +
      "<div class='callout'>Câu đúng là: <b>một phần cà phê Canephora từ Lâm Đồng đã góp mặt trong nghiên cứu xây dựng flavor wheel; nhưng Robusta Nam Ban nằm ở đâu trên bản đồ 103 descriptor ấy thì chúng ta chưa biết.</b> Và chính chỗ “chưa biết” này mới thú vị.</div>" +

      "<h3>Robusta Nam Ban nằm ở đâu trên bản đồ ấy?</h3>" +
      "<p>Đây là câu Gu muốn theo đuổi — không phải bằng cách ngồi viết thêm, mà bằng cách đi ra ngoài. Lấy mẫu Robusta từ các farm, nhà sơ chế, nhà rang; các lot natural, washed, honey quanh Lâm Hà. Chuẩn hóa rang mẫu, chuẩn hóa nước, chuẩn hóa tỷ lệ. Blind cupping. Ghi descriptor. Lặp lại nhiều lần. So sánh mùa vụ, độ cao, giống, phương pháp sơ chế.</p>" +
      "<p>Rồi từ dữ liệu thật đó, Gu có thể bắt đầu xây <b>bản đồ cảm quan Robusta Lâm Hà</b>. Khi đó chúng ta mới có quyền nói: “Robusta vùng này thường xuất hiện descriptor gì?”, “Natural khác washed thế nào?”, “Farm A khác farm B ở đâu?”, “Lot mùa 2027 khác mùa 2026 thế nào?”. Đó không còn là content — <b>đó là dữ liệu gốc của vùng</b>.</p>" +

      "<h3>Người xuất khẩu và người nhập khẩu không hoàn toàn nếm giống nhau</h3>" +
      "<p>Nghiên cứu còn so sánh professional graders phía xuất khẩu tại Brazil với nhóm phía nhập khẩu cupping tại Switzerland. Các tác giả tìm thấy khác biệt về cách sử dụng descriptor, cường độ/tần suất của một số nhóm aroma/flavour, và điểm chất lượng cuối cùng.</p>" +
      "<p>Điều này không chứng minh nhóm nào “đúng” còn nhóm nào “sai”. Nó cho thấy sensory evaluation không hoàn toàn tách khỏi văn hóa, kinh nghiệm, reference quen thuộc, thị trường và quá trình đào tạo. Đây cũng là lý do việc xây một vocabulary có thể lặp lại rất quan trọng: hai người có thể cảm nhận tương tự nhau, nhưng nếu một người gọi nó bằng một từ khác, giao tiếp trong chuỗi giá trị lập tức khó hơn.</p>" +

      "<h3>Vậy flavor wheel có phải công cụ chấm điểm?</h3>" +
      "<p><b>Không.</b> Đây là một nhầm lẫn rất quan trọng. Flavor wheel chủ yếu trả lời “trong ly có những đặc tính cảm quan nào?”; còn chấm điểm chất lượng trả lời một câu hỏi khác: “chất lượng của ly này được đánh giá thế nào?”. Trong nghiên cứu, các graders vừa sử dụng RATA để mô tả, vừa sử dụng CQI/UCDA cupping protocol để đánh giá chất lượng. Hai việc có liên quan, nhưng không phải một. Một descriptor xuất hiện trên wheel cũng <b>không tự động là điểm cộng</b>. Wheel trước hết là <b>bản đồ mô tả</b>, không phải bảng xếp hạng ngon – dở.</p>" +

      "<h3>Vòng tròn mới có “minh oan” cho Robusta không?</h3>" +
      "<p>Gu không dùng chữ đó. Nó hấp dẫn về truyền thông nhưng khoa học không cần một phiên tòa. Nghiên cứu không chứng minh “Robusta trước đây bị cả thế giới đối xử bất công”. Nó chứng minh một điều cụ thể và giá trị hơn: <b>Coffea canephora thiếu một công cụ mô tả cảm quan được xây dựng từ tập mẫu Canephora đa dạng về nguồn gốc, processing và chất lượng</b>. Nghiên cứu 2025 bắt đầu lấp khoảng trống đó. Thay vì nói “Robusta được minh oan”, Gu thích nói: <b>Robusta cuối cùng có thêm một ngôn ngữ được xây từ chính Robusta</b>.</p>" +

      "<h3>Fine Robusta có phải cà phê trên 80 điểm?</h3>" +
      "<p>Cần cẩn thận với câu này giống như Specialty Coffee. Fine Canephora/Robusta là một hệ thống chất lượng phát triển quanh Canephora chất lượng cao, với lịch sử đánh giá riêng của Coffee Quality Institute và R Grader. Nhưng flavor wheel 2025 <b>không phải giấy chứng nhận Fine Robusta</b>, và cũng không biến một mẫu thành Fine Robusta chỉ vì người thử tìm thấy nhiều descriptor. Vai trò của nó là giúp <b>nhận diện, mô tả, hiểu và lập bản đồ đặc tính cảm quan Canephora một cách chuẩn hóa hơn</b> — một nền tảng rất hữu ích cho quality improvement và specialty Canephora. Nhưng <b>wheel ≠ chứng nhận chất lượng</b>.</p>" +

      "<h3>Vòng tròn hương vị có làm Robusta ngon hơn không?</h3>" +
      "<p>Không. Một tấm bản đồ không làm vùng đất đẹp hơn; nó chỉ giúp chúng ta hiểu vùng đất. Chất lượng ly vẫn bắt đầu từ: <b>genetics</b> (giống/cây), <b>environment</b> (đất, khí hậu, nước, độ cao), <b>farming</b> (dinh dưỡng, quản lý cây, sâu bệnh), <b>harvest</b> (độ chín và cách thu hoạch), <b>post-harvest</b> (natural, washed, honey, fermentation, drying), <b>storage</b> (bảo quản), <b>roasting</b> (rang) và <b>brewing</b> (pha).</p>" +
      "<p>Nếu quả xanh bị thu hoạch lẫn nhiều, sơ chế lỗi, phơi sai, bảo quản ẩm rồi rang cháy, 103 descriptor không cứu được nó. <b>Flavor wheel không tạo ra chất lượng. Nó giúp chúng ta nhìn thấy và nói về chất lượng rõ hơn.</b></p>" +

      "<h3>Tại sao chuyện này quan trọng với Việt Nam?</h3>" +
      "<p>Bởi Việt Nam không phải khán giả trong câu chuyện Canephora — chúng ta là một trong những trung tâm Robusta lớn nhất thế giới. Trong nhiều thập kỷ, lợi thế của cà phê Việt Nam nằm rất mạnh ở sản lượng, năng suất, chuỗi cung ứng và khả năng cung cấp nguyên liệu quy mô lớn. Điều đó không xấu: commodity là một thị trường khổng lồ và có vai trò thật.</p>" +
      "<p>Nhưng khi mọi thứ được bán chủ yếu dưới dạng “Vietnam Robusta” thì rất nhiều thông tin phía sau hạt biến mất: vùng nào? farm nào? giống gì? độ cao? mùa nào? quả chín bao nhiêu? processing gì? sensory profile ra sao? Khi bắt đầu trả lời được những câu đó, hạt cà phê dần thoát khỏi trạng thái vô danh. Và khi có vocabulary đủ tốt để mô tả nó, thị trường có thêm cơ sở để phân biệt <b>lot này với lot kia</b>. Đó mới là chỗ flavor wheel có giá trị kinh tế.</p>" +

      "<h3>Với Lâm Đồng, câu chuyện còn gần hơn</h3>" +
      "<p>Lâm Đồng không chỉ là cái tên Gu ghép vào bài để SEO — <b>Lâm Đồng thực sự xuất hiện trong sample set của nghiên cứu</b>. Nhưng Gu muốn đi thêm một bước mà paper quốc tế không thể làm thay: từ Canephora Lâm Đồng đi xuống Lâm Hà, rồi Nam Ban, rồi farm, rồi lot. Càng đi sâu, danh tính của hạt càng rõ.</p>" +
      "<p>Một ngày nào đó, thay vì chỉ viết “đây là Robusta Việt Nam”, chúng ta có thể nói: <b>“đây là Robusta từ một vườn cụ thể ở Lâm Hà, mùa vụ này, độ cao này, sơ chế theo cách này, và qua nhiều lần cupping nó thường thể hiện những descriptor này.”</b> Đó mới là lúc terroir bắt đầu có dữ liệu đứng phía sau.</p>" +

      "<h3>103 từ mới không phải điều quan trọng nhất</h3>" +
      "<p>Điều quan trọng hơn là <b>cách chúng ta sử dụng chúng</b>. Một poster có thể treo lên tường; một infographic có thể được share vài nghìn lần. Nhưng nếu nó không quay ngược trở lại người trồng, quả chín, processing, lot, cupping, feedback, giá mua, thì nó vẫn chỉ là poster.</p>" +
      "<p>Vòng tròn hương vị thực sự có giá trị khi người sản xuất có thể hỏi “tôi thay đổi cách làm này thì ly thay đổi thế nào?”; nhà sơ chế hỏi “natural và washed của cùng nguyên liệu khác nhau ở đâu?”; nhà rang hỏi “profile rang nào giữ được đặc tính của lot?”; người mua hỏi “tại sao lot này đáng giá hơn lot kia?”; và người uống cuối cùng hiểu “à, Robusta không chỉ có một vị.”</p>" +

      "<h3>Robusta không cần trở thành Arabica</h3>" +
      "<p>Có lẽ đây là điều hay nhất mà nghiên cứu này gợi ra. Trong nhiều năm, cách khen một Robusta đôi khi nghe giống “Robusta này thơm như Arabica”. Nhưng nếu Canephora có genetics khác, sinh hóa khác và một thế giới cảm quan riêng, tại sao tiêu chuẩn cao nhất của nó phải là giống một loài khác?</p>" +
      "<p>Một Robusta tốt không cần xin lỗi vì body lớn, cocoa, roasted, spice, woody, fermented hay những nét umami riêng của nó. Câu hỏi đúng hơn không phải “Robusta này giống Arabica đến đâu?”, mà là <b>“Canephora này thể hiện tốt đến đâu những gì chính nó có thể trở thành?”</b> Đó là một thay đổi nhỏ trong câu chữ, nhưng là thay đổi rất lớn trong cách nhìn một hạt cà phê.</p>" +

      "<div class='callout'><b>Bản dễ đọc:</b> nếu bạn mới bắt đầu và chỉ muốn hiểu ý chính một cách nhẹ nhàng, đọc bản viết lại đơn giản của bài này: <a href='/kien-thuc/robusta-khong-chi-vi-dang'>Robusta không chỉ có vị đắng: năm 2025, nó có vòng tròn hương vị của riêng mình</a>.</div>",
    faq: [
      { q: "Vòng tròn hương vị Robusta 2025 là gì?", a: "Là một flavor wheel được phát triển riêng cho Coffea canephora dựa trên nghiên cứu khoa học công bố năm 2025. Nó tổ chức 103 descriptor thành ba tầng để hỗ trợ việc nhận diện, mô tả và lập bản đồ các đặc tính aroma/flavour của Canephora." },
      { q: "Ai phát triển vòng tròn này?", a: "Nghiên cứu do Fabiana M. Carvalho cùng Enrique A. Alves, Mateus M. Artêncio, Alvaro L. L. Cassago và Lucas L. Pereira thực hiện. Fabiana M. Carvalho là corresponding author." },
      { q: "Nghiên cứu được công bố ở đâu?", a: "Trên tạp chí Scientific Reports, volume 15, article 16643, ngày 13/5/2025." },
      { q: "Có phải đây là nghiên cứu của SCA, WCR hay CQI không?", a: "Không nên ghi như vậy. Paper có sử dụng CQI/UCDA cupping protocol và có những người tham gia là Q/R Grader, nhưng nhóm tác giả thuộc UNICAMP, EMBRAPA, University of São Paulo và IFES. Paper cũng nói đây là một non-funded project với sự hỗ trợ tự nguyện từ nhiều thành viên cộng đồng cà phê." },
      { q: "Có bao nhiêu mẫu được nghiên cứu?", a: "67 mẫu Coffea canephora từ 13 quốc gia." },
      { q: "Có bao nhiêu người thử nếm?", a: "49 professional coffee graders, trong đó 40 người là Q Grader và/hoặc R Grader." },
      { q: "103 là gì?", a: "103 là số descriptor được đưa vào graphic cuối cùng của flavor wheel sau quá trình thu thập, gộp và lọc thuật ngữ." },
      { q: "Có phải nghiên cứu chỉ tìm được 103 từ?", a: "Không. Các graders tạo/chọn 202 thuật ngữ; sau khi gộp còn 170. Những descriptor có average mean score từ 0,5 trở lên được đưa lên wheel cuối, còn 103." },
      { q: "103 descriptor có nghĩa một ly Robusta có 103 vị?", a: "Không. Đây là vocabulary tổng hợp từ toàn bộ tập mẫu. Một ly cụ thể chỉ thể hiện một phần trong số đó." },
      { q: "Nhóm hương vị nổi bật nhất là gì?", a: "Theo average mean score của Tier 1, thứ tự cao nhất là: Roasted → Sweet → Fruity → Cocoa." },
      { q: "Descriptor riêng lẻ nào có average mean score cao nhất?", a: "Caramel, với average mean score 21,4 trong dữ liệu nghiên cứu." },
      { q: "Có Umami trong Robusta không?", a: "Nghiên cứu có nhóm Umami và xếp tomato, fermented soy sauce/shoyu, coconut water và mushroom vào nhóm này. Các tác giả cho rằng chúng dường như là những descriptor đáng chú ý riêng của Canephora so với Arabica wheel, nhưng cũng nhấn mạnh cần nghiên cứu thêm về cơ sở của sự khác biệt." },
      { q: "Có nước dừa thật trong cà phê không?", a: "Không. “Coconut water” là descriptor cảm quan — một sự liên tưởng về mùi/vị — không phải thành phần được thêm vào cà phê." },
      { q: "Vòng tròn có “mít” không?", a: "Không trong bản 103 descriptor cuối cùng. Jackfruit xuất hiện trong danh sách 170 thuật ngữ nhưng average mean score chỉ 0,20, dưới ngưỡng 0,50 để xuất hiện trên graphic cuối." },
      { q: "Có sầu riêng và thanh long không?", a: "Không nên khẳng định chúng thuộc wheel 103 nếu không có dữ liệu gốc chứng minh. Một số bài thứ cấp trên Internet đang trộn các thuật ngữ từng được đề xuất với các descriptor thực sự xuất hiện trên wheel cuối." },
      { q: "Có hạt điều không?", a: "Cần đọc đúng dữ liệu. “Cashew (caju)” xuất hiện trong danh sách 170 nhưng có average mean score 0,10, nên riêng thuật ngữ đó không đạt ngưỡng đưa vào graphic cuối. Không nên nhìn một danh sách sơ bộ rồi gọi tất cả là “103 hương vị chính thức”." },
      { q: "Có mẫu Việt Nam không?", a: "Có." },
      { q: "Có mẫu Lâm Đồng không?", a: "Có. Paper ghi rõ mẫu Việt Nam từ Gia Lai và Lâm Đồng ở cupping session 1, và Đắk Lắk và Lâm Đồng ở session 2." },
      { q: "Có mẫu Nam Ban hoặc Lâm Hà không?", a: "Paper không ghi cụ thể đến mức đó. Vì vậy chưa thể nói Nam Ban/Lâm Hà có mẫu trong nghiên cứu." },
      { q: "Có thể nói Robusta Lâm Đồng có vị nước dừa hay umami vì Lâm Đồng có mẫu không?", a: "Không. Wheel được xây từ toàn bộ 67 mẫu của 13 quốc gia. Muốn gán descriptor cụ thể cho Lâm Đồng cần dữ liệu ở cấp mẫu tương ứng." },
      { q: "Flavor wheel có phải bảng chấm điểm không?", a: "Không. Wheel chủ yếu dùng để mô tả aroma/flavour. Trong nghiên cứu, việc đánh giá chất lượng được thực hiện song song bằng CQI/UCDA cupping protocol." },
      { q: "Một descriptor xuất hiện trên wheel có phải luôn là vị tốt?", a: "Không. Descriptive và hedonic/quality evaluation là hai việc khác nhau. Flavor wheel trước hết giúp gọi tên thứ được cảm nhận." },
      { q: "Vòng tròn mới có chứng minh Robusta ngon hơn Arabica không?", a: "Không. Nghiên cứu không nhằm chứng minh loài nào ngon hơn. Nó xây một công cụ mô tả phù hợp hơn cho Canephora." },
      { q: "Có đúng trước đây Robusta bị chấm oan bằng tiêu chuẩn Arabica không?", a: "Đó là cách nói quá mạnh. Điều paper thực sự chỉ ra là những positive sensory attributes của high-quality Canephora chưa được đại diện đầy đủ trong lexicon/flavor wheel trước đó, vì Robusta dùng để xây công cụ cũ là commercial Robusta." },
      { q: "Fine Robusta là gì?", a: "Hiểu đơn giản là Canephora/Robusta chất lượng cao được sản xuất và đánh giá với mục tiêu chất lượng cảm quan cao hơn commodity Robusta. Tuy nhiên, flavor wheel 2025 không phải giấy chứng nhận Fine Robusta và 103 descriptor không phải thang điểm Fine Robusta." },
      { q: "Natural, honey và washed có tạo ra hương vị cố định không?", a: "Không. Processing có thể ảnh hưởng mạnh đến profile nhưng không đảm bảo một hương vị cố định. Giống, nguyên liệu quả, môi trường, fermentation, drying, storage, roasting và brewing đều tham gia vào kết quả cuối." },
      { q: "Người bình thường có sử dụng wheel được không?", a: "Có. Hãy bắt đầu từ nhóm rộng như Sweet, Fruity, Cocoa hoặc Roasted, sau đó mới đi ra những descriptor cụ thể. Không cần cố tìm thật nhiều vị." },
      { q: "Nếu tôi không nếm được các descriptor đó thì sao?", a: "Hoàn toàn bình thường. Khả năng sensory phụ thuộc vào kinh nghiệm, reference đã từng ngửi/nếm, văn hóa và luyện tập. Ngay trong nghiên cứu, nhóm graders xuất khẩu và nhập khẩu cũng có những khác biệt về cách mô tả và đánh giá." },
      { q: "Tại sao nghiên cứu này quan trọng với Việt Nam?", a: "Vì Việt Nam là một quốc gia sản xuất Canephora rất lớn và chính các mẫu Việt Nam — trong đó có Lâm Đồng — đã tham gia tập mẫu dùng để phát triển wheel. Quan trọng hơn, một vocabulary tốt hơn tạo điều kiện để Canephora được phân biệt theo chất lượng, origin, processing và sensory profile thay vì chỉ được nhìn như một nguyên liệu commodity đồng nhất." },
      { q: "Nó có ý nghĩa gì với Nam Ban, Lâm Hà?", a: "Chưa phải câu trả lời về hương vị Nam Ban. Nó cho chúng ta một bộ câu hỏi và một công cụ để bắt đầu tìm câu trả lời. Việc đáng làm tiếp theo là lấy mẫu thật quanh Lâm Hà, cupping có kiểm soát và xây dữ liệu cảm quan theo từng farm, lot, processing và mùa vụ. Nếu làm đủ lâu, chúng ta có thể trả lời bằng dữ liệu: Robusta Nam Ban thực sự có những gì?" }
    ],
    links: [
      { label: "Bản đơn giản: Robusta không chỉ có vị đắng", href: "/kien-thuc/robusta-khong-chi-vi-dang" },
      { label: "Vòng tròn hương vị (SCA) là gì?", href: "/kien-thuc/vong-tron-huong-vi" }
    ]
  },
  {
    id: "robusta-khong-chi-vi-dang",
    anh: "assets/img/robusta-wheel-vi.png",
    tag: "Kiến thức",
    docPhut: 7, mucDo: "Người mới",
    tieuDe: "Robusta không chỉ có vị đắng: năm 2025, nó có vòng tròn hương vị của riêng mình",
    dek: "Phần lớn chúng ta biết Robusta qua vị đắng, mạnh. Nhưng năm 2025, khoa học đã cho Coffea canephora một vòng tròn hương vị riêng — đây là bản viết lại đơn giản, ai đọc cũng hiểu.",
    than:
      "<p>Nếu trước giờ bạn nghĩ cà phê Robusta chỉ có vị đắng, mạnh và nhiều caffeine thì cũng bình thường. Phần lớn chúng ta biết Robusta theo cách đó. Arabica thường được nói là thơm, có vị hoa, trái cây, chua thanh và tinh tế; còn Robusta thì đậm, đắng, rẻ hơn và thường dùng để pha blend hoặc làm cà phê hòa tan.</p>" +
      "<p>Nhưng Robusta thực ra có nhiều hương vị hơn thế. Vấn đề là trong một thời gian dài, thế giới cà phê chưa có một bộ từ đủ tốt để mô tả riêng những gì có trong Robusta chất lượng cao. Đến năm 2025, chuyện đó bắt đầu thay đổi.</p>" +

      "<h3>Robusta có vòng tròn hương vị riêng</h3>" +
      "<p>Tháng 5/2025, một nhóm nhà khoa học do Fabiana M. Carvalho và các cộng sự thực hiện đã công bố nghiên cứu trên tạp chí Scientific Reports. Họ xây dựng một <b>vòng tròn hương vị dành riêng cho Coffea canephora</b>, loài cà phê mà chúng ta thường gọi là Robusta.</p>" +
      "<figure><img src='/assets/img/robusta-wheel-vi.png' alt='Vòng tròn hương vị Robusta — bản tiếng Việt' loading='lazy'><figcaption>Vòng tròn hương vị Robusta (bản tiếng Việt) — Gu Cà Phê.</figcaption></figure>" +
      "<p>Vòng tròn hương vị nghe có vẻ chuyên môn, nhưng thật ra rất dễ hiểu. Khi uống cà phê, đôi khi bạn thấy nó có mùi giống cacao, caramel, trái cây hay một thứ gì đó rất quen nhưng không biết gọi tên. Vòng tròn hương vị giống như một <b>tấm bản đồ giúp chúng ta tìm từ để gọi tên những gì mình đang ngửi và nếm được</b>.</p>" +
      "<p>Ví dụ bạn cảm thấy ly cà phê có gì đó giống trái cây. Bạn bắt đầu ở nhóm “trái cây”, rồi đi dần ra ngoài để tìm xem nó gần với loại trái cây nào hơn. Người mới uống cà phê dùng được, người rang cà phê dùng được, người thử nếm chuyên nghiệp cũng dùng được. Khác nhau chủ yếu ở mức độ luyện tập.</p>" +

      "<h3>Tại sao Robusta lại cần một vòng tròn riêng?</h3>" +
      "<p>Arabica và Robusta đều là cà phê nhưng không phải cùng một loài. Chúng khác nhau về di truyền, cây, điều kiện sinh trưởng, thành phần hóa học và cuối cùng là hương vị trong ly.</p>" +
      "<p>Thế giới specialty coffee trước đây đã có một vòng tròn hương vị rất nổi tiếng. Nhưng dữ liệu dùng để xây những công cụ cảm quan trước đó <b>chưa thể hiện đầy đủ thế giới hương vị của Canephora chất lượng cao</b>. Hiểu đơn giản giống như chúng ta có một cuốn từ điển rất tốt, nhưng cuốn từ điển ấy thiếu một số từ cần thiết để kể hết câu chuyện của Robusta.</p>" +
      "<p>Vì vậy nghiên cứu năm 2025 không nhằm chứng minh rằng “Robusta ngon hơn Arabica”, cũng không phải để nói trước đây Robusta “bị chấm oan”. Điều quan trọng hơn là: <b>Robusta bắt đầu có một bộ ngôn ngữ được xây từ chính Robusta để mô tả chính nó.</b></p>" +

      "<h3>Các nhà khoa học đã làm thế nào?</h3>" +
      "<p>Họ không ngồi nghĩ ra 103 mùi vị rồi vẽ thành một cái vòng. Nghiên cứu sử dụng <b>67 mẫu Coffea canephora đến từ 13 quốc gia</b>, có cả cà phê chất lượng cao lẫn cà phê thương mại và nhiều cách sơ chế khác nhau. Sau đó <b>49 chuyên gia thử nếm cà phê</b> tham gia đánh giá các mẫu.</p>" +
      "<p>Từ hàng trăm từ mô tả ban đầu, nhóm nghiên cứu lọc và sắp xếp lại thành <b>103 mô tả hương vị</b> xuất hiện trên vòng tròn cuối cùng. Con số 103 cần hiểu cho đúng: nó không có nghĩa <b>một ly Robusta có 103 vị</b>. Nó giống như một tấm bản đồ có 103 địa điểm — một ly cà phê cụ thể chỉ nằm ở một vài nơi trên tấm bản đồ đó.</p>" +

      "<h3>Điều thú vị nhất: Robusta không chỉ có “đắng”</h3>" +
      "<p>Khi các nhà nghiên cứu tổng hợp kết quả, những nhóm hương vị nổi bật nhất lần lượt là: <b>Rang → Ngọt → Trái cây → Cacao</b>.</p>" +
      "<p>Chỉ riêng kết quả này đã cho chúng ta một cách nhìn khác về Robusta. Người bình thường thường nghĩ tới Robusta bằng một chữ: <b>đắng</b>. Nhưng khi những mẫu Canephora khác nhau được thử nếm và mô tả kỹ hơn, người ta còn tìm thấy một thế giới gồm vị ngọt, trái cây, cacao, caramel, gia vị, gỗ và nhiều nhóm hương khác. Trong các mô tả riêng lẻ của nghiên cứu, <b>caramel là một descriptor nổi bật</b>.</p>" +
      "<p>Nghiên cứu còn ghi nhận một nhóm khá lạ với người mới uống cà phê: <b>umami</b>, với những liên tưởng như cà chua, nước tương lên men, nước dừa và nấm. Đọc đến đây nhiều người sẽ hỏi ngay: “ủa, trong cà phê có nước dừa với nước tương thật à?” Không.</p>" +

      "<h3>“Vị cacao”, “caramel” hay “nước dừa” nghĩa là gì?</h3>" +
      "<p>Khi người ta nói một ly cà phê có hương cacao, không có nghĩa người rang bỏ cacao vào. Nói có hương caramel cũng không có nghĩa hạt được tẩm caramel. Đó là <b>liên tưởng của mùi và vị</b>.</p>" +
      "<p>Ví dụ bạn ngửi một ly cà phê và mùi của nó làm não bạn nhớ đến caramel; người thử nếm sẽ dùng từ “caramel” để mô tả cảm giác đó. Cũng giống như khi chúng ta ngửi một loại nước hoa và nói “có mùi gỗ” hay “có mùi hoa” — trong chai nước hoa không nhất thiết có một miếng gỗ hay một bông hoa. Cà phê cũng vậy.</p>" +
      "<p>Đây cũng là lý do người đã từng ăn, uống và ngửi nhiều thứ thường có vốn từ cảm quan rộng hơn: não của họ có một “thư viện mùi vị” lớn hơn để so sánh.</p>" +

      "<h3>Vậy mít, sầu riêng có nằm trong vòng tròn Robusta không?</h3>" +
      "<p>Có khá nhiều bài trên Internet nói vòng tròn mới có mít, sầu riêng, thanh long và nhiều loại trái cây nhiệt đới khác. Nhưng cần phân biệt giữa <b>những từ từng xuất hiện trong quá trình nghiên cứu</b> và <b>103 từ thực sự được chọn vào vòng tròn cuối cùng</b>.</p>" +
      "<p>Ví dụ, <b>mít có xuất hiện trong danh sách từ ban đầu</b>, nhưng điểm của nó không đủ ngưỡng để được đưa vào vòng tròn 103 descriptor cuối cùng. Vì vậy nói “mít là một trong 103 hương vị trên vòng tròn Robusta 2025” là không chính xác. Gu chọn cách đơn giản: cái gì paper nói thì nói; cái gì paper chưa chứng minh thì không thêm cho bài nghe hấp dẫn hơn.</p>" +

      "<h3>Việt Nam có mặt trong nghiên cứu này không?</h3>" +
      "<p><b>Có. Và đây là phần rất đáng chú ý.</b> Trong giai đoạn đầu của nghiên cứu có các mẫu Việt Nam từ <b>Gia Lai và Lâm Đồng</b>. Ở giai đoạn tiếp theo lại có các mẫu từ <b>Đắk Lắk và Lâm Đồng</b>. Như vậy có thể nói chắc chắn rằng <b>cà phê Canephora từ Lâm Đồng đã tham gia vào tập mẫu dùng để phát triển và kiểm tra vòng tròn hương vị này</b>.</p>" +
      "<p>Nhưng phải dừng đúng ở đó. Nghiên cứu ghi “Lâm Đồng”, không ghi Nam Ban hay Lâm Hà; vì vậy chúng ta chưa thể nói Robusta Nam Ban đã được đưa vào nghiên cứu. Cũng không thể thấy trên vòng tròn có “nước dừa” rồi kết luận Robusta Lâm Đồng có vị nước dừa — 103 mô tả được tổng hợp từ <b>67 mẫu của 13 quốc gia</b>, chứ không phải riêng Lâm Đồng.</p>" +

      "<h3>Vậy Robusta Nam Ban có vị gì?</h3>" +
      "<p>Câu trả lời hiện nay rất đơn giản: <b>chúng ta chưa biết đủ để nói</b>. Và với Gu, đây lại là phần thú vị nhất.</p>" +
      "<p>Thay vì lấy một nghiên cứu quốc tế rồi cố gắn mọi hương vị trong đó vào Nam Ban, chúng ta có thể làm ngược lại: <b>đem Robusta Nam Ban ra nếm và tìm xem chính nó nằm ở đâu trên tấm bản đồ 103 hương vị này</b>. Lấy cà phê từ nhiều vườn quanh Nam Ban, Lâm Hà; lấy cả natural, honey, washed nếu có; rang mẫu theo cùng một cách, pha theo cùng một chuẩn rồi thử nếm nhiều lần; ghi lại từng mùi vị, từng vùng, từng mùa vụ.</p>" +
      "<p>Làm đủ lâu, chúng ta có thể bắt đầu trả lời những câu rất cụ thể: Robusta Nam Ban thường có nhóm hương gì? Vườn này khác vườn kia thế nào? Natural khác washed ra sao? Mùa năm nay khác mùa năm trước ở đâu? Khi ấy chúng ta mới có một <b>bản đồ hương vị Robusta của chính Lâm Hà</b>, dựa trên cà phê thật của vùng chứ không phải suy đoán từ Internet.</p>" +

      "<h3>Vòng tròn hương vị có làm cà phê ngon hơn không?</h3>" +
      "<p>Không. Nó chỉ giúp chúng ta <b>nhìn rõ hơn thứ đang có trong hạt</b>. Muốn có cà phê ngon, mọi chuyện vẫn bắt đầu từ ngoài vườn: giống cây, đất, khí hậu, cách chăm sóc, quả được hái chín tới đâu, cách sơ chế, lên men, phơi và bảo quản. Sau đó mới tới rang và pha.</p>" +
      "<p>Một quả cà phê hái xanh, sơ chế lỗi, phơi ẩm rồi rang cháy sẽ không trở thành cà phê ngon chỉ vì chúng ta có một vòng tròn 103 hương vị. Nói đơn giản: <b>flavor wheel không tạo ra chất lượng — nó giúp chúng ta gọi tên chất lượng.</b></p>" +

      "<h3>Điều quan trọng nhất của nghiên cứu này là gì?</h3>" +
      "<p>Không phải con số 103, cũng không phải tìm được một vài hương vị nghe lạ. Điều đáng chú ý nhất là cách chúng ta bắt đầu nhìn Robusta khác đi.</p>" +
      "<p>Robusta không cần phải giống Arabica mới được xem là ngon. Nếu hai loài cà phê khác nhau về cây, di truyền, hóa học và hương vị, thì một Robusta tốt nên được đánh giá dựa trên <b>những gì một Robusta tốt có thể trở thành</b>, chứ không phải dựa vào việc nó giống Arabica đến mức nào.</p>" +
      "<p>Năm 2025, khoa học cho Canephora một bộ từ rõ hơn để kể câu chuyện của chính nó. Còn với Gu, câu hỏi tiếp theo gần hơn nhiều: <b>trong 103 từ ấy, Robusta của Nam Ban sẽ chọn những từ nào?</b> Câu đó không thể tìm trên Google — phải uống mới biết.</p>" +

      "<div class='callout'><b>Muốn đọc kỹ hơn?</b> Bản đầy đủ của bài này có tên nghiên cứu, số liệu và cách Gu kiểm chứng từng chi tiết: <a href='/kien-thuc/vong-tron-huong-vi-robusta-2025'>Robusta có 103 cách để nói về hương vị: Vòng tròn hương vị Canephora 2025</a>.</div>",
    faq: [
      { q: "Robusta có phải chỉ có vị đắng không?", a: "Không. Đắng là một phần dễ nhận thấy của Robusta, nhưng nghiên cứu 2025 cho thấy Canephora có phổ cảm quan rộng hơn nhiều. Những nhóm nổi bật trong tập mẫu nghiên cứu gồm rang, ngọt, trái cây và cacao." },
      { q: "Vòng tròn hương vị Robusta là gì?", a: "Là một bản đồ giúp gọi tên những mùi và vị người ta cảm nhận được khi thử Coffea canephora. Vòng tròn công bố năm 2025 có 103 descriptor được sắp xếp thành các nhóm từ rộng đến cụ thể." },
      { q: "103 hương vị có nghĩa một ly Robusta có 103 vị không?", a: "Không. 103 là tổng số descriptor trên vòng tròn. Một ly cà phê cụ thể chỉ có thể thể hiện một phần trong số đó." },
      { q: "Ai làm vòng tròn hương vị Robusta 2025?", a: "Nó được phát triển từ nghiên cứu của Fabiana M. Carvalho và các cộng sự, công bố trên tạp chí khoa học Scientific Reports vào tháng 5/2025." },
      { q: "Họ nghiên cứu bao nhiêu cà phê?", a: "67 mẫu Coffea canephora từ 13 quốc gia, được 49 chuyên gia thử nếm chuyên nghiệp đánh giá." },
      { q: "Việt Nam có trong nghiên cứu không?", a: "Có. Nghiên cứu có các mẫu từ Việt Nam, trong đó bảng dữ liệu ghi Gia Lai, Đắk Lắk và Lâm Đồng ở các giai đoạn khác nhau." },
      { q: "Lâm Đồng có mẫu trong nghiên cứu không?", a: "Có. Lâm Đồng xuất hiện ở cả giai đoạn phát triển và giai đoạn xác nhận của nghiên cứu." },
      { q: "Nam Ban hoặc Lâm Hà có mẫu không?", a: "Chưa có bằng chứng trong paper. Nghiên cứu chỉ ghi Lâm Đồng, không ghi cụ thể Nam Ban hay Lâm Hà." },
      { q: "Có thể nói Robusta Lâm Đồng có vị nước dừa không?", a: "Chưa thể. Nước dừa là một descriptor trong nghiên cứu, nhưng vòng tròn được tổng hợp từ nhiều mẫu của 13 quốc gia. Không thể lấy một descriptor trên vòng tròn rồi tự gán cho Lâm Đồng." },
      { q: "Trong cà phê có thật sự có cacao, caramel hay nước dừa không?", a: "Thông thường không. Đó là những từ dùng để mô tả mùi và vị làm người uống liên tưởng đến cacao, caramel hay nước dừa." },
      { q: "Mít có nằm trong 103 descriptor không?", a: "Không. Jackfruit xuất hiện trong danh sách thuật ngữ trong quá trình nghiên cứu nhưng không đạt ngưỡng để xuất hiện trên vòng tròn 103 descriptor cuối cùng." },
      { q: "Vòng tròn này có dùng để chấm cà phê ngon hay dở không?", a: "Không trực tiếp. Nó chủ yếu giúp mô tả cà phê có mùi vị gì. Đánh giá chất lượng là một việc khác." },
      { q: "Vòng tròn hương vị có làm Robusta thành Specialty hay Fine Robusta không?", a: "Không. Một flavor wheel là công cụ mô tả cảm quan, không phải giấy chứng nhận chất lượng." },
      { q: "Robusta và Arabica loại nào ngon hơn?", a: "Không có câu trả lời chung. Chúng là hai loại cà phê khác nhau với đặc tính khác nhau. Một Robusta tốt không cần phải giống Arabica mới được xem là tốt." },
      { q: "Người bình thường có dùng vòng tròn hương vị được không?", a: "Có. Không cần biết chuyên môn. Khi uống, chỉ cần bắt đầu bằng câu hỏi rất đơn giản: ngoài đắng ra, ly cà phê này còn làm mình nhớ đến mùi hay vị gì?" },
      { q: "Vòng tròn này có ý nghĩa gì với Nam Ban?", a: "Nó chưa cho chúng ta biết Robusta Nam Ban có vị gì. Nhưng nó cho chúng ta một công cụ để bắt đầu tìm câu trả lời bằng cách lấy cà phê thật từ các vườn quanh Nam Ban, thử nếm có kiểm soát và ghi lại dữ liệu qua nhiều mùa vụ." }
    ],
    links: [
      { label: "Bản đầy đủ có nguồn nghiên cứu", href: "/kien-thuc/vong-tron-huong-vi-robusta-2025" },
      { label: "Vòng tròn hương vị (SCA) là gì?", href: "/kien-thuc/vong-tron-huong-vi" }
    ]
  },
  {
    id: "natural-washed",
    anh: "assets/img/art-natural-drying.jpg",
    tag: "Sơ chế",
    docPhut: 2, mucDo: "Người mới",
    tieuDe: "Natural hay Washed — vị khác nhau chỗ nào?",
    dek: "Cùng một hạt, hai cách sơ chế cho hai ly hoàn toàn khác. Chọn sai, bạn trách nhầm hạt.",
    than:
      "<p><b>Washed (sơ chế ướt)</b> tách sạch lớp thịt quả trước khi phơi hạt. Ly cà phê <b>sạch, sáng, rõ nét</b> — bạn cảm được đúng chất của giống và vùng đất, chua thanh như trái cây tươi. Đa số specialty rang sáng đi theo hướng này.</p>" +
      "<p><b>Natural (sơ chế khô)</b> phơi nguyên cả quả, để hạt ngâm trong lớp thịt ngọt nhiều tuần. Kết quả: <b>ngọt đậm, đầy miệng, thiên trái cây chín</b> — dâu, mận, đôi khi hơi lên men như rượu vang. Bù lại, vị kém sạch và mỗi mẻ dễ lệch nhau hơn.</p>" +
      "<p><b>Chọn thế nào?</b> Thích trong trẻo, tinh tế → Washed. Thích ngọt bùng nổ, trái cây rõ → Natural. Trường <i>Sơ chế</i> ở mỗi sản phẩm cho bạn biết ngay mình sắp uống kiểu nào.</p>",
    faq: [
      { q: "Natural khác Washed ở điểm nào?", a: "Washed tách sạch thịt quả trước khi phơi nên vị sạch, sáng, rõ nét. Natural phơi nguyên quả nên ngọt đậm, đầy miệng, thiên trái cây chín. Cùng một hạt, hai cách sơ chế cho hai ly khác hẳn." },
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
      "<p><b>Rang đậm (Dark)</b> đốt bớt axit, đổi lại <b>đậm đầy miệng, vị chocolate, đắng rõ</b>. Hợp phin truyền thống và espresso, uống với sữa vẫn ‘gồng’ được vị.</p>" +
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
    anh: "assets/img/espresso-pull.jpg",
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
    anh: "assets/img/art-cherry-hand.jpg",
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
  },
  {
    id: "vong-tron-huong-vi",
    anh: "assets/img/flavor-wheel-sca.jpg",
    tag: "Kiến thức",
    docPhut: 4, mucDo: "Người mới",
    tieuDe: "Vòng tròn hương vị cà phê: nó giúp gì cho bạn?",
    dek: "Bạn không cần học thuộc gì cả. Chỉ cần biết một điều: công cụ này giúp bạn gọi tên được cái mình đang nếm, thay vì chỉ nói 'ngon thật'.",
    than:
      "<p>Bạn có bao giờ uống một ly cà phê ngon và chỉ biết nói <i>'ngon thật'</i>, nhưng không tả được ngon ở chỗ nào không? Gần như ai mới uống cà phê cũng vậy — cảm nhận được mà không gọi tên được.</p>" +

      "<h3>Nó giúp gì cho bạn?</h3>" +
      "<p>Bạn <b>không cần nhớ hết</b> vòng tròn này. Bạn chỉ cần biết một điều: nó giúp bạn <b>gọi tên điều mình đang nếm</b>.</p>" +
      "<div class='flavor-eg'>" +
        "<p>Thay vì nói:</p>" +
        "<p class='eg-before'>“Ly này ngon.”</p>" +
        "<p>Bạn sẽ nói được:</p>" +
        "<p class='eg-after'>“Ly này có vị cam, socola và hậu ngọt.”</p>" +
      "</div>" +
      "<p>Đó chính là toàn bộ mục đích của vòng tròn hương vị. Không phải để thi cử, mà để bạn diễn tả được thứ mình thích — và lần sau biết đường tìm mua lại.</p>" +

      "<h3>Vòng tròn hương vị là gì?</h3>" +
      "<p>Nó là một tấm bản đồ các mùi vị có thể có trong cà phê, vẽ thành vòng tròn nhiều tầng, đọc từ <b>trong ra ngoài</b>:</p>" +
      "<p>• <b>Tầng trong cùng</b> — nhóm vị lớn: chua, ngọt, đắng, mùi trái cây, mùi hạt, mùi hoa…<br>" +
      "• <b>Tầng giữa</b> — chi tiết hơn: trong 'trái cây' tách ra họ cam quýt, họ berry, trái cây khô…<br>" +
      "• <b>Tầng ngoài cùng</b> — cụ thể nhất: trong 'berry' lại có dâu, việt quất, mâm xôi…</p>" +
      "<p>Càng ra ngoài càng chi tiết. <b>Ví dụ:</b> bạn thấy có mùi trái cây → nhìn sang nhóm trái cây → rồi nhận ra nó giống mùi cam hơn là mùi dâu. Vậy là xong, bạn vừa gọi tên được một hương vị.</p>" +
      "<figure><img src='/assets/img/flavor-wheel-tiers.jpg' alt='Vòng tròn hương vị đọc theo 3 bậc: vị chung, nhóm hương vị, mô tả cụ thể' loading='lazy'><figcaption>Đọc từ trong ra ngoài theo 3 bậc — <b>Bậc 1</b> vị chung → <b>Bậc 2</b> nhóm hương vị → <b>Bậc 3</b> mô tả cụ thể.</figcaption></figure>" +

      "<h3>Dùng thực tế: chỉ 3 câu hỏi</h3>" +
      "<p>Uống một ngụm, tự hỏi 3 câu, mỗi câu đi sâu một tầng:</p>" +
      "<p>1. <b>Vị chính là gì?</b> (chua / ngọt / đắng)<br>" +
      "2. <b>Có mùi gì đi kèm?</b> (trái cây / hoa / socola / hạt)<br>" +
      "3. <b>Cụ thể hơn được không?</b> (trái cây → cam hay berry?)</p>" +
      "<p>Không ai nhớ hết vòng tròn này ngay từ đầu. Bạn chỉ cần mỗi lần uống nhận ra thêm một mùi vị mới. Sau vài chục ly, bạn sẽ ngạc nhiên vì mình gọi tên hương vị dễ hơn hẳn.</p>" +

      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> Vị <b>chua</b> trong cà phê <b>không phải là hỏng</b>. Với người quen cà phê phin đậm, chua nghe như dở. Nhưng trong cà phê đặc sản, chua thanh (kiểu chua của trái cây tươi) là <b>dấu hiệu hạt tốt, trồng ở vùng núi cao</b>. Cái đắng gắt mà nhiều người tưởng là chuẩn cà phê, thật ra thường do rang cháy để át hạt kém. Vòng tròn giúp bạn phân biệt 'chua ngon' với 'chua hỏng'.</div>" +

      "<h3>Ai làm ra nó?</h3>" +
      "<p>Đây là công cụ do Hiệp hội Cà phê Đặc sản (SCA) cùng các nhà nghiên cứu phát triển, hiện được dùng rộng rãi trong ngành cà phê đặc sản trên thế giới — như một 'ngôn ngữ chung' để nói về hương vị. Nó không phải thước đo cứng: vị giác mỗi người một khác, cùng một ngụm hai người có thể tả hai kiểu. Vòng tròn chỉ cho bạn <b>bộ từ để diễn đạt</b> — dùng như la bàn, đừng dùng như thước.</p>" +

      "<h3>Vì sao Gu kể bạn nghe điều này</h3>" +
      "<p>Từ bây giờ, mỗi khi Gu mô tả một ly cà phê có vị <i>cam</i>, <i>socola</i> hay <i>hoa trắng</i>, bạn sẽ biết đó <b>không phải hương liệu được thêm vào</b> — mà là cách diễn tả hương vị <b>tự nhiên có sẵn trong hạt</b>. Và đó cũng là lý do Gu luôn cố gắng mô tả hương vị thật cụ thể, thay vì chỉ nói 'ngon' hay 'đậm'. Nói cụ thể thì bạn mới biết gói nào hợp gu mình.</p>" +

      "<p class='ghi-chu-nho'>Muốn xem hình gốc màu: tra từ khóa tiếng Anh 'Coffee Taster's Flavor Wheel' hoặc 'SCA flavor wheel' — trang SCA có bản tải miễn phí.</p>",
    links: [
      { label: "Cách Gu chấm điểm cà phê", href: "/cach-test" },
      { label: "Xem các gói Gu đã mô tả hương vị", href: "/ca-phe" }
    ]
  },

  /* ===== Lộ trình "Bắt đầu với cà phê" — 6 bài liền mạch cho người mới (route /bat-dau) ===== */
  {
    id: "ca-phe-dac-san-la-gi",
    tag: "Bắt đầu với cà phê",
    thuTu: 1, docPhut: 2,
    tieuDe: "Cà phê đặc sản là gì? Khác cà phê thường ở đâu?",
    dek: "Không phải cứ đắt là đặc sản. Đây là khác biệt thật, nói cho người chưa biết gì.",
    than:
      "<p>Bạn nghe 'cà phê đặc sản' (specialty coffee) và tưởng đó là cà phê đắt tiền cho dân sành? Không hẳn. Khác biệt nằm ở chỗ khác.</p>" +
      "<h3>Khác ở 3 điểm</h3>" +
      "<p><b>1. Được chấm điểm.</b> Cà phê đặc sản là cà phê được người thẩm định chuyên nghiệp chấm trên 80/100 điểm. Cà phê thường không qua bước chấm này.</p>" +
      "<p><b>2. Biết rõ nguồn gốc.</b> Đặc sản truy được: trồng ở đồi nào, độ cao bao nhiêu, ai trồng, hái tháng mấy. Cà phê thường trộn lẫn nhiều nguồn, không rõ từ đâu.</p>" +
      "<p><b>3. Để lộ vị thật của hạt.</b> Đặc sản rang vừa phải để giữ hương vị tự nhiên. Cà phê thường hay rang thật đậm — một phần để tạo vị 'mạnh' quen thuộc, một phần để che khuyết điểm của hạt kém.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> 'Đặc sản = đắt tiền để làm màu.' Thật ra giá cao hơn đến từ công sức: hái chín từng quả, sơ chế kỹ, trồng ở vùng núi cao sản lượng thấp. Bạn trả cho <b>chất lượng và sự minh bạch</b>, không phải cho thương hiệu.</div>" +
      "<p>Nói ngắn gọn: cà phê thường cho bạn <b>chất 'phê'</b> quen thuộc. Cà phê đặc sản cho bạn <b>hương vị</b> — chua thanh, ngọt hậu, thơm nhiều tầng — thứ mà cà phê rang cháy đã đốt mất.</p>" +
      "<p><b>Gu khuyên:</b> Tò mò rồi? Bài tiếp theo sẽ giúp bạn chọn: <a href='/bat-dau/arabica-robusta'>Arabica và Robusta khác nhau thế nào, nên uống loại nào?</a></p>"
  },
  {
    id: "arabica-robusta",
    tag: "Bắt đầu với cà phê",
    thuTu: 2, docPhut: 3,
    tieuDe: "Arabica và Robusta khác nhau thế nào? Tôi nên uống loại nào?",
    dek: "Hai loại hạt cà phê chính, khác nhau một trời một vực. Biết cái này là biết mình hợp gì.",
    than:
      "<p>Gần như mọi ly cà phê bạn từng uống đến từ một trong hai loại hạt: <b>Robusta</b> hoặc <b>Arabica</b>. Chúng khác nhau rõ rệt.</p>" +
      "<h3>Robusta — cà phê 'phê' quen thuộc</h3>" +
      "<p>Đắng mạnh, đậm, ít chua, nhiều caffeine (nên dễ tỉnh táo, dễ 'phê'). Đây là loại làm nên ly cà phê phin đen đá, cà phê sữa đá quen thuộc của người Việt. Trồng dễ, giá rẻ hơn.</p>" +
      "<h3>Arabica — cà phê 'hương vị'</h3>" +
      "<p>Thơm, chua thanh như trái cây, ngọt hậu, nhiều tầng vị. Ít caffeine hơn Robusta. Đây là loại cà phê đặc sản thế giới ưa chuộng, hợp pha để cảm nhận vị hơn là để 'phê'.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> 'Arabica xịn hơn, Robusta là hàng dởm.' Sai. Không loại nào tốt hơn — tùy gu. Và Việt Nam giờ có <b>Fine Robusta</b> (Robusta đặc sản chất lượng cao) ngon không kém, thậm chí đạt giải quốc tế.</div>" +
      "<h3>Vậy nên uống loại nào?</h3>" +
      "<p>• Thích <b>mạnh, đậm, tỉnh táo nhanh</b>, quen phin sữa đá → Robusta (hoặc Fine Robusta nếu muốn thử bản cao cấp).<br>" +
      "• Muốn thử <b>vị thơm, chua thanh, nhiều tầng</b>, uống chậm cảm nhận → Arabica.</p>" +
      "<p>Người mới muốn bước vào thế giới đặc sản thường bắt đầu với Arabica vì vị dễ gây bất ngờ ('ồ, cà phê mà có vị trái cây').</p>" +
      "<p><b>Gu khuyên:</b> Nghe 'chua thanh' mà thấy lạ? Đọc tiếp bài quan trọng nhất: <a href='/bat-dau/ca-phe-chua'>Cà phê chua có phải bị hỏng không?</a></p>"
  },
  {
    id: "ca-phe-chua",
    tag: "Bắt đầu với cà phê",
    thuTu: 3, docPhut: 3,
    tieuDe: "Cà phê chua có phải bị hỏng không?",
    dek: "Đây là hiểu lầm lớn nhất khiến nhiều người bỏ lỡ những ly cà phê ngon nhất đời.",
    than:
      "<p>Bạn uống một ngụm cà phê, thấy <b>chua</b>, và nghĩ ngay: 'hỏng rồi' hoặc 'pha dở'? Bạn không đơn độc — đây là phản xạ của hầu hết người Việt quen cà phê phin đậm. Nhưng nó là một hiểu lầm.</p>" +
      "<h3>Chua thanh là dấu hiệu hạt TỐT</h3>" +
      "<p>Cà phê ngon tự nhiên có vị chua thanh — giống vị chua tươi mát của cam, táo, hay chanh dây. Vị chua này đến từ hạt <b>Arabica trồng ở vùng núi cao</b>. Càng cao, khí hậu càng lạnh, quả chín càng chậm, vị chua thanh và hương thơm càng rõ. Đây là thứ dân cà phê khắp thế giới săn lùng.</p>" +
      "<h3>Vậy cái 'đắng gắt' quen thuộc là gì?</h3>" +
      "<p>Vị đắng gắt mà nhiều người tưởng là chuẩn mực cà phê, thật ra thường đến từ <b>rang cháy</b>. Rang thật đậm tạo vị đắng mạnh — và tiện thể che luôn khuyết điểm của hạt kém. Đắng không phải là dấu hiệu ngon; nhiều khi ngược lại.</p>" +
      "<div class='callout'><b>⚠️ Phân biệt 2 loại chua:</b> Có <b>chua thanh</b> (dễ chịu, mát, như trái cây tươi — đây là ngon) và <b>chua gắt</b> (khó chịu, như đồ ôi, gắt cổ — đây mới là hỏng hoặc pha sai). Vị giác bạn sẽ tự phân biệt được sau vài lần uống.</div>" +
      "<p>Thử thế này: lần tới uống cà phê đặc sản thấy chua, đừng vội chê. Nuốt xong, để ý xem có vị ngọt đọng lại không. Nếu có — đó chính là ly cà phê ngon mà trước giờ bạn tưởng là 'hỏng'.</p>" +
      "<p><b>Gu khuyên:</b> Hết sợ vị chua rồi? Giờ tới câu thực tế nhất: <a href='/bat-dau/mua-goi-nao-dau-tien'>Muốn uống ngon thì nên mua gói nào đầu tiên?</a></p>"
  },
  {
    id: "mua-goi-nao-dau-tien",
    tag: "Bắt đầu với cà phê",
    thuTu: 4, docPhut: 3,
    tieuDe: "Muốn uống ngon thì nên mua gói nào đầu tiên?",
    dek: "Đừng nhảy vào loại kỳ lạ nhất. Đây là gói dễ uống để bắt đầu, và gói Gu khuyên cụ thể.",
    than:
      "<p>Đứng trước hàng chục loại cà phê đặc sản với đủ tên lạ — honey, natural, yếm khí, lên men — người mới rất dễ hoang mang. Quy tắc đơn giản: <b>đừng bắt đầu bằng loại kỳ lạ nhất.</b></p>" +
      "<h3>Gói đầu tiên nên có 3 điều</h3>" +
      "<p><b>1. Là Arabica</b> (hoặc blend nhẹ) — vị dễ tiếp cận, không gây sốc.<br>" +
      "<b>2. Rang vừa (medium)</b> — cân bằng, không quá chua cũng không quá đắng.<br>" +
      "<b>3. Từ vùng quen thuộc</b> như Đà Lạt, Cầu Đất, Lạc Dương — nền tảng ổn định để bạn làm quen 'vị đặc sản'.</p>" +
      "<p>Uống gói này vài lần cho quen, rồi mới thử các loại đặc biệt hơn. Giống như tập bơi ở hồ nông trước khi ra biển.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> 'Mua ngay loại đắt/lạ nhất cho đáng.' Ngược lại — loại lên men, yếm khí có vị rất mạnh và lạ, người mới dễ thấy 'khó uống' rồi bỏ luôn cà phê đặc sản. Đi từ dễ đến khó.</div>" +
      "<h3>Gu khuyên gói cụ thể nào?</h3>" +
      "<p>Thay vì để bạn tự đoán, Gu đã mua thật, nếm mù và chấm điểm từng gói. Gói Gu khuyên cho người mới bắt đầu — dễ uống, điểm cao, đúng 3 tiêu chí trên — chính là gói này:</p>" +
      "{{GU_PICK}}" +
      "<p><b>Gu khuyên:</b> Lo phải mua máy móc đắt tiền để pha? Đọc tiếp: <a href='/bat-dau/co-can-may-dat-tien'>Có cần máy pha đắt tiền không?</a></p>"
  },
  {
    id: "co-can-may-dat-tien",
    tag: "Bắt đầu với cà phê",
    thuTu: 5, docPhut: 3,
    tieuDe: "Có cần máy pha đắt tiền không?",
    dek: "Không. Cái phin bạn đang có pha cà phê đặc sản vẫn ngon. Chỉ cần nhớ 2 điều.",
    than:
      "<p>Nhiều người tưởng uống cà phê đặc sản phải sắm máy pha vài triệu, cân điện tử, ấm cổ ngỗng... rồi thấy phiền quá nên thôi. Sự thật nhẹ nhàng hơn nhiều.</p>" +
      "<h3>Phin Việt Nam là đủ</h3>" +
      "<p>Cái <b>phin</b> bạn đang có pha cà phê đặc sản hoàn toàn ngon. Nếu muốn vị trong trẻo hơn để cảm nhận rõ hương trái cây, có thể thử thêm <b>phễu lọc giấy V60</b> (giá rẻ, vài chục nghìn) — nhưng không bắt buộc. Không cần máy đắt tiền nào cả để bắt đầu.</p>" +
      "<h3>2 điều quan trọng hơn cả dụng cụ</h3>" +
      "<p><b>1. Nước đừng quá sôi.</b> Nước đang sôi sùng sục (100°C) sẽ 'nấu cháy' cà phê, ra vị đắng gắt. Đun sôi xong, chờ khoảng 30 giây rồi hãy rót. Đây là mẹo nâng chất lượng ly cà phê rõ rệt mà không tốn đồng nào.</p>" +
      "<p><b>2. Cà phê nên mới xay.</b> Cà phê xay ra để lâu sẽ bay hết mùi thơm trong vòng ít phút. Nếu có điều kiện, mua hạt và xay tới đâu pha tới đó. Chưa có máy xay thì mua gói xay sẵn loại nhỏ, dùng nhanh trong 1–2 tuần.</p>" +
      "<div class='callout'><b>⚠️ Hiểu lầm phổ biến:</b> 'Cà phê dở là do chưa có máy xịn.' Thật ra hai lỗi phổ biến nhất — nước quá sôi và cà phê để lâu mất mùi — chẳng liên quan gì đến máy đắt tiền. Sửa hai lỗi này còn hiệu quả hơn mua máy triệu bạc.</div>" +
      "<p>Tóm lại: bắt đầu bằng phin sẵn có, nước nguội bớt một chút, cà phê càng mới càng tốt. Vậy là đủ để uống ngon.</p>" +
      "<p><b>Gu khuyên:</b> Câu cuối cùng, và là câu giúp bạn tin Gu: <a href='/bat-dau/gu-cham-diem-the-nao'>Gu chọn gói cà phê như thế nào?</a></p>"
  },
  {
    id: "gu-cham-diem-the-nao",
    tag: "Bắt đầu với cà phê",
    thuTu: 6, docPhut: 3,
    tieuDe: "Gu chọn gói cà phê như thế nào?",
    dek: "Điểm số của Gu đến từ đâu? Nói thẳng cách làm, để bạn tự quyết có tin hay không.",
    than:
      "<p>Bạn thấy Gu chấm gói này 9.3, gói kia 8.7 — và tự hỏi: điểm đó ở đâu ra, có phải phán bừa không? Câu hỏi đúng. Đây là cách Gu làm, nói thẳng.</p>" +
      "<h3>Mua thật bằng tiền của Gu</h3>" +
      "<p>Gu <b>tự bỏ tiền mua</b> cà phê trên thị trường như một khách hàng bình thường, không nhận hàng tài trợ, không nhận mẫu thử miễn phí từ nhà bán. Vì sao? Nhận đồ miễn phí thì khó chấm thẳng tay.</p>" +
      "<h3>Nếm mù — không biết trước gói nào</h3>" +
      "<p>Khi chấm điểm, Gu <b>nếm mù</b>: che nhãn, không biết đang uống gói của nhà nào, đánh số 1-2-3 rồi mới chấm. Chấm xong mới lật nhãn ra. Làm vậy để cảm tình với thương hiệu không làm lệch điểm.</p>" +
      "<h3>Chấm theo 6 tiêu chí</h3>" +
      "<p>Mỗi gói được cho điểm trên 6 mặt: <b>hương thơm, vị chua, độ đậm đà, vị ngọt, hậu vị, và cảm nhận tổng thể</b>. Cộng lại lấy trung bình ra điểm cuối. Không phải một con số cảm tính.</p>" +
      "<div class='callout'><b>⚠️ Về chuyện hoa hồng:</b> Gu có nhận hoa hồng khi bạn mua qua link giới thiệu. Nhưng điểm số được chấm mù <b>trước</b> khi có bất kỳ thỏa thuận nào, và <b>không nhà nào trả tiền để được điểm cao</b>. Gói dở thì Gu nói dở, hoặc loại thẳng khỏi web.</div>" +
      "<p>Đó là lý do khi Gu nói một gói đáng mua, bạn có thể tin — vì Gu chấm nó như một người mua khó tính, không phải như một người đi bán.</p>" +
      "<p><b>Gu khuyên:</b> Giờ bạn đã hiểu và tin cách Gu chọn. Xem gói Gu khuyên cho ly cà phê đặc sản đầu tiên của bạn: <b><a href='/ca-phe'>Gói Gu khuyên cho người mới →</a></b></p>"
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
    vi: "Đậm và đầy miệng hơn, độ chua dịu hơn vùng cao; dễ uống với người quen gu đậm.",
    diemNhan: ["Thuộc huyện Lâm Hà", "Độ cao thấp hơn Cầu Đất", "Đậm đà, ít chua", "Nổi tiếng cà phê chồn & du lịch"],
    than: [
      "<p><b>Nam Ban</b> là thị trấn thuộc huyện <b>Lâm Hà</b>, phía tây nam Đà Lạt. Tên ‘Lâm Hà’ ghép từ Lâm Đồng và Hà Nội — vùng kinh tế mới do người Hà Nội vào lập nghiệp từ cuối thập niên 1970.</p>",
      "<p>So với Cầu Đất, Nam Ban ở <b>độ cao thấp hơn</b> nên khí hậu ấm hơn. Cà phê ở đây thường <b>đậm và đầy miệng hơn, độ chua dịu hơn</b>, dễ uống với người quen gu đậm. Vùng trồng cả Robusta lẫn Arabica.</p>",
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
    sanPham: ["nb-dehavi", "dh-arabica", "dh-blend"], diemTB: null, chungNhan: "OCOP 4 sao · ISO 22000",
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
    sanPham: ["tt-sanhdieu"], diemTB: null, chungNhan: "30 năm · nhà máy xuất khẩu",
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
    sanPham: ["lb1", "sp-pacamara", "sp-heirloom", "sp-fruitmood"], diemTB: "9.3/10 · 1 gói đã nếm", chungNhan: "Farm minh bạch · Lạc Dương",
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
    sanPham: ["mb-redbourbon"], diemTB: null, chungNhan: "Chứng nhận SGS · Cầu Đất",
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
    sanPham: ["lv-rich"], diemTB: null, chungNhan: "Asia Top 80 · Đà Lạt",
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
  { label: "Phin Việt hằng ngày", vi: "Golden Birds Sành Điệu — blend rang mộc, dễ uống, giá mềm.", spId: "tt-sanhdieu" },
  { label: "Uống hằng ngày", vi: "Là Việt RICH — đậm, socola, giá mềm, pha ngay.", spId: "lv-rich" },
  { label: "Cold brew · pour over", vi: "Red Bourbon rang sáng — cam chanh, caramel, hợp pour over & cold brew.", spId: "mb-redbourbon" }
];
