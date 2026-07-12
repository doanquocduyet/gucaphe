# DEPLOY — LÀM THEO ĐÚNG THỨ TỰ, KHÔNG CẦN NGHĨ

> **Dùng luôn account GitHub + Vercel đang có.** Không cần tạo mới.
> GitHub cho unlimited repo, Vercel cho nhiều project — 3 web hay 30 web đều miễn phí.
> Mọi thứ trong gói này **đã cấu hình sẵn cho gucaphe.vn**. Bạn không phải sửa gì.

---

## BƯỚC 1 — Giải nén

Giải nén file zip. Bạn sẽ có thư mục `gucaphe/` với cấu trúc:

    gucaphe/
    ├── index.html
    ├── vercel.json        ← cấu hình sẵn
    ├── robots.txt         ← cho Google + AI crawler
    ├── sitemap.xml
    ├── .gitignore
    ├── HUONG-DAN.md
    ├── DEPLOY.md          ← file bạn đang đọc
    ├── assets/
    │   ├── style.css
    │   └── app.js
    └── data/
        └── data.js        ← ⭐ file DUY NHẤT bạn sẽ sửa sau này

⚠️ **Giữ nguyên cấu trúc thư mục.** `assets/` và `data/` phải là thư mục con.
Kéo 5 file nằm phẳng ra ngoài = web trắng trang.

---

## BƯỚC 2 — Kiểm tra web chạy được (30 giây)

Mở file `index.html` bằng trình duyệt (double-click).
Thấy trang có "★ ĐÁNG MUA NHẤT", bảng giá, bộ lọc → **OK, chạy được.**

---

## BƯỚC 3 — Đẩy lên GitHub

**Cách A — GitHub Desktop (dễ hơn, không cần gõ lệnh):**
1. Mở GitHub Desktop → `File` → `Add Local Repository` → chọn thư mục `gucaphe`
2. Nó báo "not a git repository" → bấm **`create a repository`**
3. Name: `gucaphe` → bấm **Create Repository**
4. Bấm **Publish repository** (bỏ tick "Keep this code private" nếu muốn public)
5. Xong.

**Cách B — Terminal (copy nguyên khối này):**

```bash
cd đường/dẫn/tới/gucaphe

git init
git add .
git commit -m "init gucaphe"
git branch -M main
```

Rồi lên github.com → **New repository** → tên `gucaphe` → **Create**.
GitHub sẽ hiện link repo. Copy link đó, rồi chạy:

```bash
git remote add origin https://github.com/TEN-CUA-BAN/gucaphe.git
git push -u origin main
```

*(thay `TEN-CUA-BAN` bằng username GitHub của bạn)*

---

## BƯỚC 4 — Deploy trên Vercel (2 phút)

1. Vào **vercel.com** → đăng nhập bằng account đang có
2. Bấm **Add New** → **Project**
3. Tìm repo `gucaphe` → bấm **Import**
4. Màn hình cấu hình hiện ra:
   - **Framework Preset:** chọn **Other** ← quan trọng, đừng để nó tự đoán
   - **Build Command:** để trống
   - **Output Directory:** để trống
   - **Install Command:** để trống
5. Bấm **Deploy**

Chờ ~30 giây → có link `gucaphe-xxx.vercel.app`
**Mở link kiểm tra web chạy được chưa.** Chạy được thì sang bước 5.

---

## BƯỚC 5 — Gắn tên miền gucaphe.vn

Trong Vercel: **Project** → **Settings** → **Domains** → ô Add domain → gõ:

    gucaphe.vn

Bấm **Add**. Vercel hiện bản ghi DNS cần thêm.

Sang **trang quản lý tên miền** (nơi bạn mua gucaphe.vn) → tìm mục **DNS** / **Quản lý bản ghi** → thêm:

| Loại | Host/Tên | Trỏ về |
|---|---|---|
| **A** | `@` | IP mà Vercel đưa (thường `76.76.21.21`) |
| **CNAME** | `www` | `cname.vercel-dns.com` |

**Lưu ý:** Vercel hiển thị chính xác giá trị cần dùng — **copy từ màn hình Vercel**, đừng dùng số trong bảng này nếu nó khác.

Chờ DNS lan truyền: **10 phút → vài giờ** (domain `.vn` đôi khi tới 24h). Bình thường, cứ đợi.

Khi Vercel hiện dấu ✓ xanh cạnh domain → **web sống.**

---

## XONG. TỪ GIỜ MỌI THỨ TỰ ĐỘNG

Mỗi lần bạn sửa file và `git push` (hoặc bấm Push trong GitHub Desktop),
**Vercel tự deploy lại.** Không cần vào Vercel nữa.

---

# GIỜ MỚI LÀ VIỆC THẬT: ĐIỀN DỮ LIỆU

Web đang chạy nhưng **trống rỗng** — 5 sản phẩm mẫu là giả, để bạn thấy nó hoạt động thế nào.

## Sửa duy nhất 1 file: `data/data.js`

Mở file → tìm khối `const SP = [` → xoá 5 sản phẩm mẫu → dán sản phẩm thật vào.

**Mẫu 1 sản phẩm (copy khối này, sửa giá trị):**

```js
  {
    id: "a1",                       // mã bất kỳ, không trùng nhau
    brand: "Tên thương hiệu",
    ten: "Tên sản phẩm 250g",
    nhom: "hat",                    // "hat" | "gear" | "qua"
    gia: 239000,                    // số, không có dấu chấm
    gram: 250,                      // khối lượng (gear thì để null)
    tested: true,                   // 🟢 true = ĐÃ mua & nếm thật
    diem: 9.2,                      // CHỈ điền khi tested: true
    chua: 2, dam: 4, hau: 4,        // thang 1-5
    pha: ["phin", "v60"],           // "phin" | "v60" | "coldbrew"
    origin: "Cầu Đất, Lâm Đồng",
    giong: "Bourbon",
    roast: "Medium",
    process: "Washed",
    flavor: "Chocolate, hạt dẻ, hậu ngọt",
    nen: ["Lý do 1", "Lý do 2"],           // ai NÊN mua
    khong: ["Lý do 1", "Lý do 2"],         // ai KHÔNG nên mua
    link: "https://s.shopee.vn/..."        // ← DÁN LINK AFFILIATE THẬT
  },
```

## ⚠️ HAI QUY TẮC KHÔNG ĐƯỢC PHẠM

**1. Chưa test thì KHÔNG được có điểm:**
```js
    tested: false,
    diem: null,        // ← BẮT BUỘC null
```

**2. Ghi `tested: true` cho hàng chưa nếm = mất toàn bộ niềm tin.**
Đây là tài sản thế chấp của cả mô hình. Xây bằng năm, sập bằng ngày.

## Sửa xong thì

```bash
git add .
git commit -m "them du lieu that"
git push
```

Vercel tự deploy. Mở web → **toàn bộ trang tự mọc lại**: bảng giá tự tính giá/100g,
xếp hạng tự chọn quán quân, bộ lọc tự chấm điểm, bảng so sánh tự tô ô thắng.

**Bạn không đụng vào HTML một dòng nào.**

---

## CHECKLIST CUỐI

- [ ] Web chạy trên vercel.app
- [ ] Domain gucaphe.vn đã trỏ ✓
- [ ] Đã thay 5 SP mẫu bằng SP thật
- [ ] Đã dán link affiliate thật (đang là `#`)
- [ ] Mọi SP `tested: false` đều có `diem: null`
- [ ] Gắn Google Analytics *(mở `assets/app.js`, tìm dòng `// THẬT: gtag(...)`)*

---

**Nhớ:** web không sinh ra dữ liệu. **Dữ liệu sinh ra web.**
Nó đẹp hay xấu không quyết định gì — **10 dòng đầu tiên trong `data.js` mới quyết định.**
