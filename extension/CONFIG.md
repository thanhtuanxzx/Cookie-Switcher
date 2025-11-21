# ⚙️ Cấu hình Extension

## 🔧 Cấu hình API URL

API URL được cấu hình trực tiếp trong code, không cần nhập trong UI.

### Cách cấu hình:

1. Mở file `popup.js`
2. Tìm dòng:
   ```javascript
   const API_BASE_URL = 'https://your-api.vercel.app';
   ```
3. Thay đổi URL thành API URL của bạn:
   ```javascript
   const API_BASE_URL = 'https://your-actual-api.vercel.app';
   ```
4. Lưu file và reload extension trong Chrome

### Ví dụ:

```javascript
// API URL của bạn
const API_BASE_URL = 'https://cookie-switcher-api.vercel.app';
```

### Lưu ý:

- Không cần thêm dấu `/` ở cuối URL
- URL phải là HTTPS (Vercel tự động cung cấp HTTPS)
- Sau khi thay đổi, cần reload extension để áp dụng

### Kiểm tra API URL:

Sau khi cấu hình, bạn có thể test bằng cách:
1. Mở extension popup
2. Nhập Group ID và click "Tham gia Group"
3. Nếu có lỗi, kiểm tra Console (F12) để xem chi tiết

