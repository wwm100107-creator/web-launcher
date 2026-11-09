# DevLaunch — Personal Web & Tool Launcher

Một giao diện trung tâm điều khiển (Personal Portal / Web Launcher) hiện đại, siêu nhẹ, giúp bạn quản lý tập trung toàn bộ các tool web, server localhost, dự án khách hàng và tiện ích phát triển hàng ngày.

---

## Điểm nổi bật & Tính năng

1. **Giao diện hiện đại (Bento Grid & Glassmorphism):**
   - Tông màu Dark Mode chuẩn developer, hiệu ứng ánh sáng mượt mà.
   - Thẻ hiển thị rõ tên, địa chỉ rút gọn, mô tả ngắn gọn, nhãn danh mục và môi trường.

2. **Tìm kiếm tức thì & Phím tắt (Command Palette):**
   - Nhấn **`Ctrl + K`** hoặc **`/`**: Mở thanh tìm kiếm nhanh, gõ từ khóa và bấm **`Enter`** để mở ngay tool mong muốn.
   - Nhấn **`Alt + N`**: Mở nhanh cửa sổ thêm tool mới.
   - Nhấn **`Esc`**: Đóng nhanh các popup/modal.

3. **Tự động bắt Favicon & Logo:**
   - Khi bạn dán địa chỉ web (VD: `https://github.com`, `https://claude.ai`), hệ thống sẽ tự động bắt logo chất lượng cao của trang web đó.
   - Cho phép nhập URL icon riêng hoặc emoji tùy ý.

4. **Phân loại & Lọc thông minh:**
   - Phân nhóm theo **Danh mục** (AI & Trợ lý, Dev & Localhost, Dự án Khách hàng, Utilities,...).
   - Bộ lọc **Môi trường** (Localhost, Production, Staging, Dev, Internal).
   - Chức năng **Ghim ưu tiên (Pin to Top)** cho các tool thường xuyên sử dụng nhất.

5. **Lưu trữ & Sao lưu an toàn:**
   - Lưu trữ tự động vào `localStorage` của trình duyệt.
   - Hỗ trợ **Xuất file JSON (Export Backup)** và **Nhập file JSON (Import)** để đồng bộ qua các máy tính khác dễ dàng.

---

## Cách sử dụng

### Cách 1: Chạy trực tiếp (Không cần cài đặt)
Chỉ cần mở thư mục:
```text
C:\Users\uypc1\.gemini\antigravity\scratch\web-launcher
```
Và **click đúp vào file `index.html`** để mở ngay trên trình duyệt Chrome, Edge, Brave hoặc Firefox!

### Cách 2: Chạy qua Live Server / Local Web Server
Nếu bạn muốn chạy dạng port như `http://localhost:5500`:
- Trong VS Code: Click chuột phải vào `index.html` chọn **Open with Live Server**.
- Hoặc dùng Python:
  ```powershell
  cd "C:\Users\uypc1\.gemini\antigravity\scratch\web-launcher"
  python -m http.server 3333
  ```
  Sau đó truy cập `http://localhost:3333`.

### Cách 3: Đưa lên mạng miễn phí (Vercel / GitHub Pages / Cloudflare)
Vì đây là Web tĩnh hoàn toàn (Static Web App), bạn có thể:
- **Kéo thả thư mục vào [Vercel](https://vercel.com) hoặc [Netlify Drop](https://app.netlify.com/drop)** để có một domain online riêng (truy cập mọi lúc mọi nơi).
- Đẩy lên kho lưu trữ **GitHub** và bật tính năng **GitHub Pages**.

---

## Bảng phím tắt nhanh

| Phím tắt | Chức năng |
| :--- | :--- |
| **`Ctrl + K`** hoặc **`/`** | Mở Command Palette tìm kiếm nhanh |
| **`↑` / `↓`** và **`Enter`** | Di chuyển và chọn tool trong Command Palette |
| **`Alt + N`** | Mở form thêm tool mới |
| **`Esc`** | Đóng tất cả cửa sổ popup |
