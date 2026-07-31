# Hướng dẫn gắn sản phẩm từ listing Shopee → data.js

> Mục tiêu: từ **một trang bán trên Shopee** (hoặc web nhà rang), điền thành **một object trong mảng `SP`** ở `data/data.js`, rồi build ra trang `/review/<slug>`.
>
> **Hiến pháp (không được vi phạm):** Chưa nếm mù → **không** có điểm, **không** có Flavor Profile. Mô tả vị lấy từ nhà bán phải ghi rõ *"nhà rang mô tả / công bố"*. Trường chưa biết để `null`/`""`, **không bịa**. Đúng > đầy đủ.

---

## 0. Trước tiên: xác định TRẠNG THÁI của gói

Đây là bước quan trọng nhất, quyết định điền trường nào. Có 3 mức (`confidence`):

| Trạng thái | `confidence` | `tested` | `daUong` | Có điểm? | Có Flavor Profile (chua/đậm…)? |
|---|---|---|---|---|---|
| **Mới nghiên cứu** — mới xem Shopee, chưa mua | `editor_research` | `false` | `false` | Không | Không |
| **Đã uống** — đã mua & uống thật, chưa nếm mù | `editor_tasted` | `false` | `true` | Không | Không |
| **Đã nếm mù** — đã mua + nếm mù + chấm điểm | `blind_tested` | `true` | `true` | **Có** | **Có** |

> **Chỉ đọc listing Shopee = trạng thái "Mới nghiên cứu".** Uống rồi mới lên "Đã uống". Nếm mù chấm điểm xong mới lên "Đã nếm mù". Mô tả vị trên Shopee là của nhà bán → **không** biến nó thành điểm của Gu.

---

## 1. Bảng ánh xạ: thông tin trên Shopee → trường trong SP

| Thấy trên Shopee | Điền vào trường | Ví dụ |
|---|---|---|
| Tên sản phẩm | `ten` | `"Heirloom Sơn Farm — 100% Arabica 250g"` |
| Giá (chọn 1 mốc khối lượng) | `gia` (số, không dấu chấm) | `265000` |
| Khối lượng gói đó | `gram` | `250` |
| Ảnh gói (tải về) | `anh` | `"assets/img/products/son-heirloom.jpg"` |
| Link sản phẩm (→ đổi thành link tiếp thị) | `link` | `"https://s.shopee.vn/xxxx"` |
| Tên shop / nhà rang | `brand` (phải khớp một `ROASTER`) | `"Sơn Pacamara"` |
| "Giống: …" | `giong` | `"Heirloom (Arabica lâu năm)"` |
| "Phương pháp lên men / sơ chế: …" | `process` | `"Double washed"` |
| "Rang ở mức: …" | `roast` | `"Light"` (Light/Medium/Dark) |
| "Vùng trồng: …" | `vungSlug` + `xaHuyen` | `"lac-duong"` · `"Sơn Farm, Đà Lạt"` |
| "Phù hợp pha …" | `pha` (mảng mã) | `["v60"]` |
| Mô tả hương vị của nhà bán | `flavor` (ghi rõ *nhà rang mô tả*) | (xem ví dụ §4) |
| Giải/chứng nhận (nếu có, thật) | `chungNhan` | `"Top 14 Thế giới · CQI 2024"` |

**Giá trị cố định cho `pha`:** `"v60"` (pour over), `"phin"`, `"espresso"`, `"coldbrew"`. Chọn theo gợi ý pha của nhà rang; rang sáng → thường `["v60"]`, rang đậm/medium → `["phin","espresso"]`.

**Giá trị cho `vungSlug`:** `"cau-dat"` · `"lac-duong"` · `"nam-ban"` · `"da-lat"`. Không rõ để `""`.

> **`gia`/`gram`:** trang tự tính **giá/100g** để so công bằng (`gia / gram * 100`). Nếu listing có 250g và 500g, cứ chọn **một** mốc (thường 250g cho dễ so), rồi nói mốc kia trong `faq`. Ví dụ: 250g = 265.000₫ (106k/100g), 500g = 500.000₫ (100k/100g).

---

## 2. Link Shopee & nhãn nút mua (tự động)

Nút mua **tự đổi chữ** theo link, không cần chỉnh tay:

- Link chứa `shopee.` (kể cả link rút gọn `s.shopee.vn/...`) → nút hiện **"Mua trên Shopee"**.
- Link khác (web nhà rang, beacons, v.v.) → nút hiện **"Mua chính hãng"**.

**Cách lấy link tiếp thị liên kết (affiliate) Shopee — để có hoa hồng:**
1. Vào **Shopee Affiliate** (affiliate.shopee.vn), đăng nhập tài khoản CTV.
2. Dán link sản phẩm gốc vào công cụ **tạo link tiếp thị** → nhận link rút gọn dạng `https://s.shopee.vn/xxxxxxx`.
3. Dán link đó vào trường `link`. (Nhãn nút tự thành "Mua trên Shopee".)

> Nếu **chưa** có link affiliate: cứ để **link chính hãng của nhà rang** (nút "Mua chính hãng") — vẫn trung thực và mua được. Đừng dán link Shopee thường nếu muốn có hoa hồng; phải là link tạo từ tài khoản CTV. **Không bịa mã affiliate.**

Người mua **không trả thêm đồng nào** — hoa hồng do sàn/nhà rang trả. Câu này đã có sẵn ở footer + FAQ, không cần nhắc lại trong sản phẩm.

---

## 3. Mẫu copy-paste (dán vào mảng `SP` trong `data/data.js`)

### Mẫu "Mới nghiên cứu" (chỉ mới xem Shopee — dùng thường xuyên nhất)

```js
{ id:"ma-noi-bo", guPick:"collector", confidence:"editor_research", verificationDate:"2026-07-31",
  selectionCriteria:{signature:false,community:true,khacBiet:true,hocThuat:true,benVung:false},
  brand:"Tên Nhà Rang", ten:"Tên Gói + Khối Lượng", nhom:"hat", gia:265000, gram:250,
  slug:"ten-goi-khong-dau", pha:["v60"],
  vungSlug:"lac-duong", xaHuyen:"Xã/Huyện, Tỉnh",
  giong:"", doCao:"", process:"", roast:"Light", ngayRang:"",
  tested:false, daUong:false, chungNhan:"", diem:null, chua:null, dam:null, hau:null,
  chot:"Một câu định vị ngắn (≤15 từ).",
  flavor:"Mô tả từ nhà rang (ghi rõ 'nhà rang mô tả'). Gu chưa nếm mù nên chưa gắn điểm.",
  notes:[], tags:["Tag 1","Tag 2","Tag 3"],
  nen:["Phù hợp nếu…"], khong:["Không hợp nếu…"],
  faq:[ {q:"Câu hỏi người mua hay hỏi?", a:"Trả lời ngắn, thật."} ],
  link:"https://s.shopee.vn/xxxx", anh:"assets/img/products/anh-goi.jpg" },
```

### Sau khi UỐNG THẬT (chưa nếm mù) → sửa 3 chỗ

```js
confidence:"editor_tasted",
daUong:true,
flavor:"Đã mua và uống thật — <cảm nhận thật, ngắn>. Điểm chấm mù (blind) sẽ cập nhật sau — chúng tôi không gắn số khi chưa chấm mù.",
```

### Sau khi NẾM MÙ + chấm điểm → thêm điểm & hồ sơ vị

```js
confidence:"blind_tested", tested:true,
diem:9.0, chua:4, dam:3, hau:5, ngot:4, sach:5,   // số của người nếm mù, thang /5 (điểm tổng /10)
notes:["Hoa","Đào","Cam vàng"],                    // ghi chú vị — chỉ khi đã nếm
viSaoDiem:["Lý do 1","Lý do 2","Lý do 3"],
```

> Đổi 3 số `roast`/`giong`/`process` cũng ảnh hưởng **bộ chọn "Chọn giúp bạn"** ở trang chủ: gói chưa nếm được ước lượng khuynh hướng vị từ các trường **khách quan** này (rang sáng → thiên chua; Robusta/rang đậm → thiên đậm) để không gợi ý ngược gu. Điền đúng `roast`/`giong`/`process` giúp gợi ý chính xác — và đây **chỉ** dùng để xếp hạng, **không** hiện thành điểm.

---

## 4. Ví dụ thật — gói Heirloom (đã làm)

Listing Shopee ghi: *"100% Arabica Rang Sáng · 250gr = 265.000₫ / 500gr = 500.000₫ · Giống Heirloom (arabica lâu năm) · Farm: Sơn Farm · Vùng: Đà Lạt · Lên men: Double washed · Hương cam chanh tươi, đường nâu, chua sáng, hậu ngọt nhẹ · Hợp pour over."*

→ Điền thành (giữ **"chưa nếm mù"** vì mới đọc listing, chưa uống thật):

```js
{ id:"sp-heirloom", guPick:"collector", confidence:"editor_research", verificationDate:"2026-07-31",
  brand:"Sơn Pacamara", ten:"Heirloom Sơn Farm — 100% Arabica 250g", nhom:"hat", gia:265000, gram:250,
  slug:"son-pacamara-heirloom", pha:["v60"],
  vungSlug:"lac-duong", xaHuyen:"Sơn Farm, Đà Lạt",
  giong:"Heirloom (Arabica lâu năm)", doCao:"", process:"Double washed", roast:"Light", ngayRang:"",
  tested:false, daUong:false, chungNhan:"", diem:null, chua:null, dam:null, hau:null,
  chot:"Heirloom Sơn Farm — Arabica lâu năm, double washed rang sáng; chua sáng, cam chanh.",
  flavor:"Lô Heirloom …, sơ chế double washed, rang sáng. Nhà rang mô tả: cam chanh tươi, đường nâu, chua sáng, hậu ngọt nhẹ. Gu chưa nếm mù nên chưa gắn điểm; thông số và mô tả vị lấy từ nhà rang.",
  notes:[], tags:["Heirloom","Chua sáng","Pour over"],
  nen:["Thích Arabica giống lâu năm","Pha V60 / pour over để tôn hương"],
  khong:["Thích vị đậm kiểu Robusta","Chủ yếu pha phin (rang sáng dễ chua gắt)"],
  faq:[ {q:"Có gói lớn hơn không?", a:"Có: 250g (265.000₫) và 500g (500.000₫) — 500g rẻ hơn ~30k/100g."} ],
  link:"https://store.sonpacamara.com/...", anh:"assets/img/products/son-heirloom.jpg" },
```

Lưu ý điểm trung thực: mô tả vị **gán cho nhà rang**, `diem/chua/dam` để `null`, trạng thái hiện *"Chưa nếm"*.

---

## 5. Ảnh sản phẩm

- Tải ảnh gói (nền sạch, rõ bao bì) về `assets/img/products/<ten>.jpg`.
- Đặt tên không dấu, gạch nối: `son-heirloom.jpg`.
- Trỏ `anh:"assets/img/products/son-heirloom.jpg"`.
- Nên tối ưu dung lượng (< ~200KB) trước khi commit.

---

## 6. Build · kiểm tra · đẩy lên

```bash
# 1. Tăng số phiên bản cache (để trình duyệt tải bản mới) — đổi ở 2 nơi:
#    scripts/build-reviews.mjs (const CSS_V) và index.html (?v=…)
# 2. Build lại toàn bộ trang tĩnh:
node scripts/build-reviews.mjs
# 3. Xem thử tại chỗ:
python3 -m http.server 8099   # mở http://localhost:8099/review/<slug>.html
# 4. Commit & đẩy:
git add -A
git commit -m "Thêm sản phẩm <tên> (mới nghiên cứu từ Shopee)"
git push -u origin claude/gucaphe-coffee-data-h73vid
```

Kiểm nhanh sau build:
- Trang `/review/<slug>` hiện đúng **giá/100g**, đúng trạng thái (**Chưa nếm** / Đã uống / Đã nếm mù).
- Gói chưa nếm **không** hiện Flavor Profile hay điểm.
- Nút mua đúng nhãn (**Mua trên Shopee** nếu link Shopee, ngược lại **Mua chính hãng**).
- Gói xuất hiện ở `/ca-phe` và trong bộ chọn trang chủ.

---

## 7. Checklist trung thực (đọc lại trước khi commit)

- [ ] Chưa nếm mù → `tested:false`, `diem/chua/dam/hau = null`, **không** có `notes`/`viSaoDiem`.
- [ ] Mô tả vị lấy từ nhà bán → có chữ *"nhà rang mô tả / công bố"*.
- [ ] Điểm SCA (nếu nhà rang công bố) ghi rõ *"nhà rang công bố"*, **không** trộn với điểm Gu.
- [ ] `gia`/`gram` là số thật trên listing; không rõ giá → `gia:null` (hiện "Giá đang cập nhật").
- [ ] `brand` khớp đúng một nhà rang trong `ROASTER`.
- [ ] `link`: link affiliate thật, hoặc link chính hãng — **không** bịa mã.
- [ ] Không dùng emoji trang trí.
