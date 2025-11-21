# 🚀 Hướng dẫn Setup Shared Group - Cookie Switcher

## 📋 Tổng quan

Tính năng Shared Group cho phép nhiều người dùng chia sẻ cookie profiles realtime thông qua một Group ID chung. Khi một người lưu profile mới, tất cả người khác trong cùng group sẽ tự động nhận được.

## 🏗️ Kiến trúc

```
Extension (Client)  ←→  Backend API (Vercel)  ←→  MongoDB Atlas
     ↓                        ↓                        ↓
  Lưu cookie local      Lưu vào database      Lưu trữ dữ liệu
  Sync lên server       Fetch từ database     Query profiles
```

## 📦 Cấu trúc Files

### Backend
```
api/
├── health.js              # Health check
└── groups/
    ├── save.js           # POST /api/groups/save
    └── [groupId].js      # GET /api/groups/[groupId]

lib/
├── db.js                 # MongoDB connection
└── cookieModel.js        # Mongoose schema

package.json
vercel.json
```

### Extension
```
popup.html                # UI với Shared Group section
popup.js                  # Logic sync với backend
manifest.json            # Extension config
```

## 🔧 Setup Backend

### Bước 1: Tạo MongoDB Atlas

1. Đăng ký tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster miễn phí
3. Tạo database user
4. Whitelist IP: `0.0.0.0/0` (hoặc IP cụ thể)
5. Lấy connection string

### Bước 2: Deploy lên Vercel

**Cách 1: Qua Dashboard**
1. Push code lên GitHub
2. Vào [Vercel Dashboard](https://vercel.com)
3. Import project
4. Set environment variable: `MONGO_URI`
5. Deploy

**Cách 2: Qua CLI**
```bash
npm i -g vercel
vercel login
vercel
vercel env add MONGO_URI
vercel --prod
```

### Bước 3: Test API

```bash
# Health check
curl https://your-api.vercel.app/api/health

# Save cookie
curl -X POST https://your-api.vercel.app/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "test-group",
    "profileName": "test-profile",
    "cookies": [{"name": "test", "value": "123"}]
  }'

# Get group
curl https://your-api.vercel.app/api/groups/test-group
```

## 🔌 Setup Extension

### Bước 1: Load Extension

1. Mở Chrome → `chrome://extensions/`
2. Bật "Developer mode"
3. Click "Load unpacked"
4. Chọn thư mục extension

### Bước 2: Cấu hình API URL

1. Mở extension popup
2. Scroll xuống phần "👥 Shared Group"
3. Nhập API URL (ví dụ: `https://your-api.vercel.app`)
4. Click "💾 Lưu API URL"

### Bước 3: Sử dụng

1. **Tạo Group mới:**
   - Nhập Group ID (ví dụ: `team-marketing`)
   - Click "🔗 Tham gia Group"
   - Lưu profile đầu tiên

2. **Tham gia Group có sẵn:**
   - Nhập Group ID
   - Click "🔗 Tham gia Group"
   - Click "🔄 Đồng bộ"

3. **Chia sẻ Cookie:**
   - Đăng nhập vào tài khoản
   - Nhập tên profile
   - Click "💾 Lưu Cookie"
   - (Nếu bật auto-sync, sẽ tự động upload)

4. **Sử dụng Cookie từ Group:**
   - Click "🔄 Đồng bộ"
   - Click vào profile trong "Shared Profiles"

## 📊 Database Schema

```javascript
{
  groupId: String (unique, indexed),
  profiles: [
    {
      profileName: String,
      cookies: Array,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Luồng hoạt động

### Lưu Cookie lên Group
```
User lưu profile
    ↓
Extension lưu local
    ↓
POST /api/groups/save
    ↓
MongoDB lưu/update
    ↓
Response success
```

### Đồng bộ từ Group
```
User click "Đồng bộ"
    ↓
GET /api/groups/[groupId]
    ↓
MongoDB query
    ↓
Return profiles
    ↓
Extension hiển thị
```

### Chuyển Cookie
```
User click profile
    ↓
Extension xóa cookie cũ
    ↓
Extension set cookie mới
    ↓
Reload tab
```

## 🛡️ Bảo mật

### Hiện tại
- ❌ Không có authentication
- ❌ Group ID là public
- ✅ Chỉ lưu trữ local và MongoDB (không gửi đi đâu khác)

### Khuyến nghị cải thiện
- Thêm API key authentication
- Thêm user authentication
- Encrypt cookie trước khi lưu
- Rate limiting

## 🐛 Troubleshooting

### Backend không hoạt động
- Kiểm tra MONGO_URI trong Vercel
- Kiểm tra MongoDB connection
- Xem logs trong Vercel Dashboard

### Extension không sync
- Kiểm tra API URL đã đúng chưa
- Kiểm tra Group ID
- Mở DevTools → Console để xem lỗi
- Test API bằng cURL

### Cookie không apply
- Kiểm tra domain cookie có khớp không
- Một số cookie có security policy không cho phép set
- Thử reload trang

## 📝 Notes

- MongoDB connection được cache để tránh tạo nhiều kết nối (quan trọng với Vercel serverless)
- Extension lưu API URL và Group ID trong `chrome.storage.local`
- Auto-sync chỉ hoạt động khi đã join group và có API URL

## 🔗 Links

- [Backend README](./BACKEND_README.md)
- [Deploy Guide](./DEPLOY.md)
- [Usage Guide](./USAGE.md)

