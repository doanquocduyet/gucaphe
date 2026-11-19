# GU CÀ PHÊ — ghi chú cho mọi phiên làm việc

Web review cà phê đặc sản Việt Nam (trọng tâm Lâm Đồng: Cầu Đất, Nam Ban, Lạc Dương, Đà Lạt): mua thật, nếm mù, chấm điểm, kèm link mua (affiliate). Địa chỉ chính: **https://www.gucaphe.vn**.
Chủ web: gọi là **"Chú"**, tự xưng **"cháu"**, luôn trả lời **tiếng Việt**, ngắn gọn, dễ hiểu.

## 1. Luật trung thực (quan trọng hơn mọi thứ khác)

- **"Đúng > đầy đủ".** Thiếu thì để trống (`null` / `""`), **không bịa**.
- **"Chưa uống thì không chấm."** Điểm (`diem`, `chua`, `dam`, `hau`…) chỉ có khi `tested:true`, tức là đã **nếm mù thật**. Hiện chỉ `son-pacamara-lang-biang` có điểm (9.3). Gói đã uống nhưng chưa nếm mù thì gắn `daUong:true`, không có số.
- Không bịa review, lời khách, số đơn, doanh thu, lịch sử, giải thưởng, chứng nhận, giá, ngày, mã/ID (GA, `sameAs`, link mạng xã hội). Vị do nhà rang mô tả phải ghi rõ "nhà rang công bố".
- Mọi con số, tên, ngày trong bài/tin phải **đọc được ở nguồn đã dẫn**. Không kiểm được thì bỏ. Không biến suy đoán thành sự thật.
- Chú từng yêu cầu "lấp đầy như web chạy 1 năm, doanh thu cao" → phần bịa thì **từ chối**, chỉ lấp bằng dữ liệu thật.
- Tham khảo web/dự án khác thì **chỉ lấy ý tưởng**, không chép nội dung, không nhắc tới chúng.

## 2. Cấu trúc

- Web tĩnh trên **Vercel**, tự deploy từ nhánh **`main`** (`vercel.json`: cleanUrls, redirect, cache).
- `data/data.js` là **nguồn dữ liệu chính** (cùng `data/gia-ca-phe.json` cho trang giá), gồm các const: `SITE, QUY_TRINH, SP, CAP_SS, TU_DIEN, FAQ, BAIVIET, XUAT_BAN, TRA_LOI_NHANH, MUA_GI, TIN, VUNG, ROASTER, NHUCAU`.
- `node scripts/build-reviews.mjs` sinh **mọi trang trừ trang chủ**: `review/*`, `vung-trong/*`, `nha-rang/*`, `kien-thuc/*`, `bat-dau/*`, các hub (`ca-phe, vung-trong, nha-rang, kien-thuc, tin-tuc, gia-ca-phe, cach-test, bat-dau`), `sitemap.xml`, `feed.xml`, `llms.txt`. **Không sửa tay file sinh ra.** Muốn đổi thì sửa `data.js` hoặc script rồi build lại.
- Thêm const mới vào `data.js` → phải thêm tên vào mảng `names` trong `loadData()` (`scripts/build-reviews.mjs`), nếu không build sẽ bỏ qua.
- **`index.html` là file tĩnh, sửa tay.** Trong đó có khối `#top` (bản tĩnh cho crawler, phải khớp `renderTop()` trong `assets/app.js`), schema ItemList "đã review" (11 gói) và nhiều URL tuyệt đối. Phần động của trang chủ (tin, gói…) do `assets/app.js` đọc `data.js` trên trình duyệt.
- `assets/style.css`, `assets/app.js`, `assets/i18n.js` (chuyển VI/EN). Sửa CSS/i18n thì tăng `CSS_V` trong build script **và** các `?v=` trong `index.html`.
- Ảnh trong `assets/img/` (ảnh OG ở `og/`, thẻ OG từng trang ở `og/cards/<id>.jpg`, tạo bằng `scripts/gen-og-cards.mjs`, cần `sharp`; không bắt buộc, thiếu thì dùng ảnh mặc định).
- `data/gia-ca-phe.json`: `arabica` (theo ngày, Yahoo KC=F), `robusta` (theo tháng, FRED PCOFFROBUSDM) do lệnh hằng ngày tự cập nhật. `noiDia` (giá nhân xô trong nước) **ghi tay** từ tin đã kiểm.
- Tài liệu: `docs/product-review-spec.md`, `docs/product-template.js`, `docs/them-san-pham-tu-shopee.md` (thêm sản phẩm). `docs/chu-de-bai.json` là danh sách chủ đề bài sắp viết. `HUONG-DAN.md` và `DEPLOY.md` là bản cũ (07/2026), nhiều chỗ lỗi thời, nên tin file này hơn.
- `.vercelignore` chặn deploy: `_nguon/`, `docs/`, `scripts/`, `.github/`, `CLAUDE.md`, `DEPLOY.md`, `HUONG-DAN.md`. File mới chỉ dùng nội bộ thì thêm vào đây.

## 3. Build và kiểm tra

```bash
node --check data/data.js && node scripts/build-reviews.mjs   # phải in dòng "Xong. … hub · … review · … bài …"
```
- Kiểm thêm bằng python3: mọi `<script type="application/ld+json">` trong trang đã đổi đều `json.loads` được; `feed.xml` parse được (`xml.dom.minidom`); trang mới có trong `sitemap.xml` và `llms.txt`; link nội bộ không chết (đường dẫn `/x/y` phải có file `x/y.html`).
- Xem thử: `python3 -m http.server 8000`, rồi dùng Playwright (`/opt/node22/lib/node_modules/playwright/index.mjs`). Tắt server bằng một lệnh `pkill -f http.server` **riêng** (lệnh này trả mã 144, gộp chung sẽ làm hỏng chuỗi lệnh).

## 4. Git

- Trước khi sửa: `git fetch origin && git pull --rebase origin main`. Lệnh lấy giá commit vào `main` **mỗi ngày**, nên main hầu như luôn có commit mới.
- Nhánh làm việc: `claude/gucaphe-coffee-data-h73vid`. Xong việc đẩy **cả hai**: `git push origin HEAD:main` (để lên web) và nhánh làm việc.
- Xung đột ở file sinh ra (`sitemap.xml`, `feed.xml`, `llms.txt`, `*.html`): lấy bản của main, build lại.
- Thông điệp commit tiếng Anh, ngắn.

## 5. Tên miền và SEO

- `ORIGIN = 'https://www.gucaphe.vn'` (đầu build script). `gucaphe.vn` chuyển 308 sang www. Muốn đổi sang tên miền không www thì phải **đổi trên Vercel trước**, nếu không sẽ thành vòng lặp chuyển hướng. `index.html` và `robots.txt` có URL viết tay.
- Mỗi trang có: meta robots `max-snippet:-1…`, canonical, RSS, `BASE_GRAPH` (Organization `#org` + WebSite `#website`; schema các trang chỉ trỏ `@id`). Bài có Article (+ `abstract`/`speakable` từ Trả lời nhanh), FAQPage, BreadcrumbList. Review chỉ có schema Review khi đã nếm mù.
- `robots.txt` mở cho bot AI (GPTBot, ClaudeBot, PerplexityBot…). `llms.txt` là bản đồ nội dung cho AI.
- Ngày: `XUAT_BAN` = ngày đăng thật (khoá = id bài, hoặc `review/<slug>`). `SITE.capNhat` = ngày cập nhật chung. Với bài viết, build tự lấy ngày mới hơn trong hai ngày này cho `dateModified` và `lastmod` trong sitemap.

## 6. Viết bài kiến thức (BAIVIET)

Mỗi bài là một object, thêm vào **cuối** mảng `BAIVIET`:
```js
{ id:"slug-khong-dau", tag:"Kiến thức", mucDo:"Người mới", docPhut:5, anh:"assets/img/…",   // anh: tuỳ chọn
  tieuDe:"Câu hỏi người đọc hay gõ?", dek:"Một câu tóm ý.",
  than:"<p>…</p><h3>Câu hỏi con?</h3><p>Câu đầu trả lời thẳng… <span class='src'>(theo …)</span></p>",
  faq:[{q:"…?", a:"…"}],                 // 3–5 câu, văn thường, không HTML
  links:[{label:"…", href:"/kien-thuc/…"}, {label:"Tên nguồn", href:"https://…"}],
  guTried:{giong:"…", tenGoi:"…", href:"/review/…"} }   // CHỈ khi Gu đã uống thật gói đúng giống đó
```
- `mucDo` quyết định nhóm trên /kien-thuc: `Người mới` · `Thực hành` · `Chọn mua` · `Giống cà phê` (giá trị khác thì vào "Bài khác"). `tag:"Bắt đầu với cà phê"` dành riêng cho lộ trình 6 bước /bat-dau, không dùng cho bài mới.
- `than`: chuỗi trong ngoặc kép, thuộc tính HTML dùng nháy đơn. Trích dẫn dùng ngoặc kép cong “ ”, không dùng `"` thẳng. Mỗi `<h3>` (build nâng thành h2, đủ 5 mục thì tự có mục lục) là một câu hỏi, câu đầu của mục trả lời thẳng. Hộp lưu ý: `<div class='callout'>…</div>`.
- `docPhut` ≈ số chữ ÷ 200, làm tròn lên. Ảnh: chỉ dùng file **có sẵn** trong `assets/img/` nếu đúng nội dung, không thì bỏ trống.
- Kèm theo: `TRA_LOI_NHANH[id]` (1–3 câu, chỉ tóm điều bài đã viết, **không ghi giá**) và `XUAT_BAN[id] = "YYYY-MM-DD"` (ngày lên web).
- Cụm "Giống cà phê" có `thuTu` và link "Bài trước / Bài kế / Về đầu cụm".
- Nguồn tốt: cơ quan nhà nước, viện nghiên cứu (WASI…), SCA, World Coffee Research, ICO, CQI, báo chính thống, tạp chí khoa học.

## 7. Tin tức (TIN) và giá trong nước

- Định nghĩa từng trường nằm trong chú thích ngay trên `const TIN = [`. Tin mới thêm lên **đầu** mảng, **giữ toàn bộ tin cũ**, `id` không bao giờ đổi (vì là địa chỉ `/tin-tuc#id`).
- `ngay` = ngày **nguồn công bố**. Chi tiết lấy từ nguồn thứ hai thì ghi `nguon2`/`nguonTen2`.
- `noiDia` trong `gia-ca-phe.json`: `{ngay, thap, cao, lamDong, nguon, nguonTen}`, số nguyên đ/kg, `ngay` là **ngày của giá**.

## 8. Tự động hoá

| Việc | Ở đâu | Lịch (giờ VN) |
|---|---|---|
| Giá Shopee + giá cà phê thế giới | GitHub Actions `.github/workflows/update-prices.yml` (không tốn quota Claude) | cron 07:37, thực tế GitHub hay trễ tới ~14:00 |
| Tin cà phê đặc sản hằng tuần (+ mốc giá trong nước) | Lịch chạy `trig_0175R89TmFhzNGGchaPyNJqk` → phiên `session_01PcgTUbEPz7A6226L5deULf` | Thứ Hai 08:17 |
| Bài kiến thức mới, **chờ Chú duyệt** | Lịch chạy `trig_01DYdr72ySEPaxNPJfq3jAPj` → phiên `session_01PcgTUarNBSkfUaX7x1QJ5Y` | ngày 2 và 16, 09:23 |

- Bài mới: lấy chủ đề `todo` đầu tiên trong `docs/chu-de-bai.json`, viết trên nhánh `bai-moi/<id>`, đổi trạng thái thành `cho-duyet`, gửi Chú link so sánh. Chú nhắn **"duyệt"** trong phiên đó thì mới đưa lên `main` (`trangThai` → `done`). Đang có bài chờ duyệt thì lượt sau không viết thêm.
- **Không làm việc tay trong phiên của lịch chạy.** Phiên phình to sẽ làm mỗi lượt tốn quota gấp nhiều lần. Tài khoản dùng **chung quota** cho khoảng 8 lịch chạy của 4 web. Từng hỏng vì chạm giới hạn tuần (16/11/2026) và giới hạn 5 giờ (18/11/2026).
- Không sửa được prompt của lịch chạy từ phiên khác. Muốn đổi thì tạo lịch mới rồi tắt lịch cũ (tắt chứ không xoá, để giữ lịch sử).

## 9. Bẫy đã gặp

- Báo Việt Nam "giá cà phê hôm nay ngày X" thường ghi giá của phiên **1–2 ngày trước**, nên phải ghi đúng ngày của giá.
- Báo mới đăng lại sự kiện cũ. Ví dụ: chỉ dẫn địa lý "Lâm Đồng" cho cà phê đã cấp từ tháng 10/2025, không phải tin mới.
- Từng có chi tiết lọt vào tin dù không có trong nguồn. Phải kiểm từng câu với nguồn.
- Tỉnh Lâm Đồng hiện nay gồm cả Đắk Nông và Bình Thuận cũ (Nghị quyết 202/2025/QH15, hiệu lực 01/07/2025). Số liệu "Lâm Đồng" phải ghi rõ mốc thời gian, và tên xã/huyện phải kiểm theo thời điểm.
- `index.html` tĩnh nên dễ lệch với dữ liệu: thêm hoặc chấm điểm gói thì nhớ sửa ItemList và khối `#top`.
- 6 bài lộ trình người mới nằm ở **`/bat-dau/<id>`**, không phải `/kien-thuc/<id>`: `ca-phe-dac-san-la-gi, arabica-robusta, ca-phe-chua, mua-goi-nao-dau-tien, co-can-may-dat-tien, gu-cham-diem-the-nao`. Link sai đường dẫn sẽ thành link chết.

## 10. Việc Chú còn phải tự làm

- Nếm mù 10 gói chưa có điểm (rồi đổi `tested:true` và điền điểm thật).
- Gửi link mạng xã hội thật để thêm `sameAs` cho Organization.
- Google Search Console: thêm Domain property, gửi `https://www.gucaphe.vn/sitemap.xml`.
- Đăng gói bài Facebook đã soạn.

## 11. Văn phong

Tiếng Việt gọn, dễ hiểu cho người mới. Viết lại bằng lời của mình. Không emoji, không giật tít. Không dùng chữ máy móc (tự động, AI, bot, script, thuật toán) **trong nội dung web**. Không hứa điều chưa làm.
