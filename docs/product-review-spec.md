# Gu Cà Phê — Product Review Specification v1.0

Mỗi trang `/review/<slug>` là **một bản ghi dữ liệu (structured record)**, không phải một bài viết.
Claude Code / người biên tập chỉ **đổ dữ liệu vào `data/data.js`** (mảng `SP`) — template tự render.
**Không sáng tác. Không bịa số. Thiếu dữ liệu thì section tự ẩn.**

Template ở `scripts/build-reviews.mjs` → hàm `productReviewBody(p, tested)`.
Đổi UX ở một chỗ này → toàn bộ trang sản phẩm đồng bộ.

---

## 1. Thứ tự section (khoá — không đổi, không thêm, không bớt)

```
Hero  →  Gu Verdict  →  Thông số  →  Flavor Profile  →  Ghi chú vị  →
Hợp gu ai (Gu Match)  →  Vì sao Gu chấm  →  Review chi tiết  →
Test Protocol  →  FAQ  →  Sản phẩm tương tự  →  Footer
```

## 2. JSON Schema (tên trường trong `SP[]`)

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | string | ✓ | định danh nội bộ |
| `slug` | string | ✓ | URL `/review/<slug>` |
| `brand` | string | ✓ | tên nhà rang (khớp `ROASTER`) |
| `ten` | string | ✓ | tên gói (kèm khối lượng) |
| `gia` | number | ✓ | giá (VND) |
| `gram` | number | ✓ | khối lượng → tự tính giá/100g |
| `vungSlug` | string | ✓ | khớp `VUNG` (`lac-duong`…) |
| `giong` `process` `roast` | string | — | Giống · Sơ chế · Rang |
| `pha` | string[] | — | mã cách pha (`v60`,`phin`,`espresso`) |
| `tags` | string[] | — | 3 tag vị ngắn (thẻ sản phẩm) |
| `chungNhan` | string | — | chứng nhận/thành tích (hiện khi chưa chấm) |
| `link` | string | ✓ | link affiliate |
| `anh` | string | — | ảnh gói |
| **Đánh giá — CHỈ điền khi ĐÃ NẾM MÙ** | | | |
| `tested` | bool | ✓ | `true` khi đã nếm mù |
| `diem` | number | tested | điểm tổng /10 |
| `chua` `dam` `hau` `ngot` `sach` | number 0–5 | tested | Flavor Profile (thang /5) |
| `notes` | string[] | tested | Ghi chú vị (đào, hoa, mật ong…) |
| `viSaoDiem` | string[] | tested | 3–4 lý do chấm điểm |
| `chot` | string | — | 1 câu định vị ở Hero (≤ 15 từ) |
| `nhanXet` | string | — | Gu Verdict (~50–60 từ, là **kết luận**) |
| `nen` / `khong` | string[] | — | Gu Match: Phù hợp / Không phù hợp |
| `faq` | {q,a}[] | — | ≤ 3 câu |
| `review` | HTML | — | đoạn đánh giá dài (tuỳ chọn) |
| `daUong` | bool | — | đã mua & uống thật nhưng chưa nếm mù |

## 3. Quy tắc ẩn/hiện section

- **Flavor Profile · Ghi chú vị · Vì sao Gu chấm** → chỉ hiện khi `tested === true`.
  Sản phẩm `daUong`/chưa thử: **ẩn hoàn toàn** (không bịa vị, không bịa điểm).
- **Thông số · Gu Match · Test Protocol · Sản phẩm tương tự** → luôn hiện (dữ liệu chung).
- **Gu Verdict** → dùng `nhanXet`; nếu trống, rơi về câu `verdict(p)` trung thực theo trạng thái.
- **FAQ · Review chi tiết** → hiện khi có `faq` / `review`.
- Mọi trường trống → section/hàng tương ứng biến mất, không để lại chỗ trống.

## 4. Quy tắc trung thực (bất biến — không được vi phạm)

1. **Chưa nếm mù thì KHÔNG có điểm và KHÔNG có Flavor Profile.** Không suy ra sao cảm quan từ mô tả nhà bán.
2. Flavor Profile (`chua`…`sach`) là **số của người đã nếm mù gói đó**, không phải AI đoán, không phải "vị thường gặp của vùng".
3. Điểm `diem` và schema `Review` chỉ gắn khi `tested`. (Đã có sẵn trong `schema(p)`.)
4. Trạng thái luôn ghi rõ: `Đã nếm mù` · `Đã uống` · `Chưa nếm`.
5. Không dùng emoji trang trí (quiet luxury). Sao (★) chỉ dùng cho **dữ liệu** cảm quan.

## 5. Copywriting

- `chot`: một câu, khẳng định, ≤ 15 từ. Vd *"Một trong những Arabica cân bằng nhất Gu từng thử."*
- `nhanXet`: **kết luận**, không mô tả lan man. ~50–60 từ.
- `viSaoDiem` / `nen` / `khong`: cụm ngắn, mỗi ý một dòng.
- `faq`: câu hỏi đúng ý người mua ("Hợp V60?", "Người mới nên mua?", "Có đáng tiền?").

## 6. Điểm · tag · related

- Điểm `/10` là **điểm tổng nếm mù**, không phải trung bình các thanh /5 (hai thang khác nhau, nêu rõ).
- Flavor Profile thang **/5**; ghi chú "không phải điểm quy đổi".
- `Sản phẩm tương tự` = `related(p)` (3 gói khác), tự động.
- `tags` (3 cái) chỉ để thẻ sản phẩm ở hub `/ca-phe`, không phải điểm.

## 7. Thêm một sản phẩm mới (quy trình)

1. Thêm 1 object vào `SP[]` theo schema mục 2.
2. Chưa nếm mù → `tested:false`, để trống các trường đánh giá.
3. `node scripts/build-reviews.mjs` → trang `/review/<slug>` sinh ra tự động.
4. Sau khi nếm mù: đổi `tested:true`, điền `diem` + `chua/dam/hau/ngot/sach` + `notes` + `viSaoDiem`.
   Flavor Profile, Vì sao Gu chấm, điểm số **tự xuất hiện**. Không sửa template.
