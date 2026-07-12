# HƯỚNG DẪN CHẠY WEB — ĐỌC 3 PHÚT LÀ XONG

## Cấu trúc (chỉ 4 file)

    index.html          ← khung. KHÔNG cần sửa
    assets/style.css    ← giao diện. KHÔNG cần sửa
    assets/app.js       ← engine. KHÔNG cần sửa
    data/data.js        ← ⭐ CHỈ SỬA FILE NÀY

## Bạn chỉ làm 1 việc: sửa data/data.js

Mở `data/data.js`, thay 5 sản phẩm mẫu bằng dữ liệu thật từ sheet DATABASE
trong file Excel. Lưu → mở lại web → **mọi trang tự cập nhật.**

Không cần đụng HTML. Không cần biết code.

### Mỗi sản phẩm cần gì

    tested: true    → 🟢 Đã mua & nếm thật     (mới được có điểm)
    tested: false   → 🟡 Chưa test              (diem: null — BẮT BUỘC)

    chua / dam / hau: thang 1–5   (SỐ ĐO, không dùng tính từ)
    link: "https://..."           ← dán link affiliate thật vào đây

### ⚠️ QUY TẮC KHÔNG ĐƯỢC PHẠM
Ghi `tested: true` cho sản phẩm chưa nếm = **mất toàn bộ niềm tin = mất cả dự án.**
Niềm tin xây bằng năm, sập bằng ngày. Đây là tài sản thế chấp của cả mô hình.

---

## Web tự làm gì cho bạn (không cần bạn nghĩ)

| Trang | Engine tự tính |
|---|---|
| **Đáng mua nhất** | Tự chọn 1 quán quân (điểm cao nhất) + 1 "rẻ mà ổn" (giá/100g thấp nhất) + 1 "nâng cấp" |
| **Nên mua gì?** | Bộ lọc 3 câu → tự chấm điểm khớp → trả Top 3 |
| **So sánh** | Tự dựng bảng A vs B, tự tô ô thắng |
| **Bảng giá** | Tự tính giá/100g, tự sắp xếp — **đây là tài sản GEO** |
| **Review** | Tự sinh box quyết định + thanh số đo |
| **Cách test** | Quy trình công khai — con hào thay cho gương mặt |

---

## Đưa lên mạng (chọn 1)

**Cách dễ nhất — Netlify (miễn phí, 2 phút):**
1. Vào netlify.com → Sign up
2. Kéo cả thư mục này thả vào ô "Deploy"
3. Xong. Có link ngay.
4. Domain settings → gắn tên miền bạn mua

**Hoặc Cloudflare Pages / Vercel** — cùng cách, đều miễn phí.

**Không cần WordPress, không cần hosting trả phí, không cần plugin.**
Web tĩnh = nhanh nhất = Google thích nhất.

---

## Checklist trước khi chạy thật

- [ ] Đã thay `SITE.ten` và `SITE.domain` trong data.js
- [ ] Đã thay 5 SP mẫu bằng SP thật
- [ ] Đã dán **link affiliate thật** (đang là `#`)
- [ ] Mọi SP `tested: false` đều có `diem: null`
- [ ] Đã sửa `canonical` + `og:` trong index.html thành domain thật
- [ ] Đã gắn Google Analytics (mở app.js, tìm dòng `// THẬT: gtag(...)`)

---

## Nhớ một điều

Web này **không sinh ra dữ liệu**. Dữ liệu sinh ra web.
Nó đẹp hay xấu không quyết định gì — **10 dòng đầu tiên trong data.js mới quyết định.**
