/* ============================================================
   MẪU ĐĂNG SẢN PHẨM — Gu Cà Phê
   Cách dùng: copy 1 trong 2 khối dưới, dán vào mảng `SP` trong
   data/data.js, điền dữ liệu, rồi chạy:  node scripts/build-reviews.mjs
   Trang /review/<slug> sẽ tự sinh theo template chuẩn.

   NGUYÊN TẮC (bắt buộc):
   • Chưa nếm mù  → tested:false, KHÔNG điền diem/chua/dam/hau/ngot/sach/notes/viSaoDiem.
   • Đã nếm mù   → tested:true, ĐIỀN đủ điểm + 5 thanh vị + notes + viSaoDiem.
   • Trường chưa biết để "" hoặc bỏ — KHÔNG bịa. Section thiếu dữ liệu tự ẩn.
   Chi tiết: docs/product-review-spec.md
   ============================================================ */


/* ---------- MẪU A · ĐÃ UỐNG, CHƯA NẾM MÙ (không có điểm) ---------- */
{
  id:"ma-san-pham",                         // định danh nội bộ, duy nhất
  brand:"Tên Nhà Rang",                     // phải khớp một ROASTER
  ten:"Tên Gói + Khối Lượng (vd 250g)",
  nhom:"hat",                               // "hat" | "xay" | "goi"
  gia:0, gram:250,                          // → tự tính giá/100g
  slug:"ten-goi-khong-dau",                 // URL /review/<slug>
  pha:["v60"],                              // "v60" | "phin" | "espresso" (nhiều được)
  vungSlug:"lac-duong",                     // khớp VUNG; không rõ để ""
  xaHuyen:"Xã/Huyện, Tỉnh",
  giong:"", doCao:"", process:"", roast:"", ngayRang:"",

  tested:false, daUong:true,                // đã mua & uống thật, chưa nếm mù
  chungNhan:"Chứng nhận / thành tích (nếu có)",
  diem:null, chua:null, dam:null, hau:null, ngot:null, sach:null,   // để null khi chưa nếm mù

  chot:"Một câu định vị ngắn (≤15 từ).",    // hiện ở Hero (tuỳ chọn)
  nhanXet:"Gu Verdict ~50–60 từ: kết luận, không mô tả lan man.",
  flavor:"Mô tả ngắn để làm meta/description (không hiện thành đoạn dài).",
  notes:[],                                 // để trống khi chưa nếm mù
  tags:["Tag 1","Tag 2","Tag 3"],           // 3 tag vị ngắn cho thẻ ở /ca-phe
  nen:["Phù hợp nếu…","…"],                 // Gu Match — Phù hợp
  khong:["Không hợp nếu…","…"],             // Gu Match — Không phù hợp
  faq:[
    {q:"Câu hỏi người mua hay hỏi?", a:"Trả lời ngắn, thật."}
  ],
  link:"https://link-affiliate", anh:"assets/img/products/anh-goi.jpg"
},


/* ---------- MẪU B · ĐÃ NẾM MÙ (có điểm + hồ sơ vị) ---------- */
{
  id:"ma-san-pham",
  brand:"Tên Nhà Rang",
  ten:"Tên Gói + Khối Lượng",
  nhom:"hat",
  gia:0, gram:250,
  slug:"ten-goi-khong-dau",
  pha:["v60"],
  vungSlug:"lac-duong",
  xaHuyen:"Xã/Huyện, Tỉnh",
  giong:"", doCao:"", process:"", roast:"", ngayRang:"",

  tested:true, daUong:true,                 // đã nếm mù xong
  chungNhan:"",                             // khi đã có điểm thì không cần badge chứng nhận
  diem:9.0,                                 // điểm tổng /10 (từ bài nếm mù)
  chua:4, dam:3, hau:5, ngot:4, sach:5,     // Flavor Profile /5 — SỐ CỦA NGƯỜI NẾM MÙ

  chot:"Một câu định vị ngắn.",
  nhanXet:"Gu Verdict ~50–60 từ.",
  flavor:"Mô tả vị ngắn (meta).",
  notes:["Hoa","Đào","Cam vàng","Mật ong"], // Ghi chú vị (chỉ khi đã nếm)
  viSaoDiem:["Lý do 1","Lý do 2","Lý do 3","Lý do 4"],  // Vì sao Gu chấm
  tags:["Tag 1","Tag 2","Tag 3"],
  nen:["Phù hợp nếu…"],
  khong:["Không hợp nếu…"],
  faq:[
    {q:"Có hợp pha V60?", a:"…"},
    {q:"Người mới nên mua?", a:"…"},
    {q:"Giá có đáng?", a:"…"}
  ],
  // review:"<p>Đoạn đánh giá dài (tuỳ chọn) — chỉ điền khi thật sự cần.</p>",
  link:"https://link-affiliate", anh:"assets/img/products/anh-goi.jpg"
},
