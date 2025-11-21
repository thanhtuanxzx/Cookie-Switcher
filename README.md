# 🍪 Cookie Switcher

Chrome Extension để chuyển đổi giữa các tài khoản bằng cách lưu và áp dụng cookie đã lưu. Hỗ trợ quản lý cookie local và chia sẻ profile giữa các thành viên trong group.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Cài đặt](#cài-đặt)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [API Documentation](#api-documentation)
- [Kiến trúc dự án](#kiến-trúc-dự-án)
- [Phát triển](#phát-triển)
- [Đóng góp](#đóng-góp)
- [License](#license)

## 🎯 Tổng quan

Cookie Switcher là một Chrome Extension được xây dựng với Manifest V3, cho phép người dùng:

- **Quản lý cookie local**: Lưu và chuyển đổi giữa các tài khoản trên cùng một domain
- **Chia sẻ profile**: Chia sẻ cookie profiles với các thành viên trong group thông qua backend API
- **Import/Export**: Xuất và nhập cookie dưới dạng JSON

## ✨ Tính năng

### 🔐 Quản lý Cookie Local
- Lưu cookie của tài khoản hiện tại với tên tùy chỉnh
- Chuyển đổi nhanh giữa các tài khoản đã lưu
- Xóa profile không cần thiết
- Xóa tất cả profiles (giữ lại Group ID)

### 👥 Chia sẻ Profile (Shared Group)
- Tham gia group bằng Group ID
- Chia sẻ profile local lên group
- Đồng bộ và áp dụng profiles từ các thành viên khác
- Thu hồi chia sẻ profile (chỉ người share mới có thể thu hồi)

### 📁 Import/Export
- Xuất cookie hiện tại ra file JSON
- Nhập cookie từ file JSON

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Chrome/Chromium browser (version >= 88.0.0)
- Node.js (cho backend API)
- MongoDB (cho backend API)

### Cài đặt Extension

1. **Clone repository:**
```bash
git clone https://github.com/thanhtuanxzx/Cookie-Switcher.git
cd Cookie-Switcher
```

2. **Cài đặt extension:**
   - Mở Chrome và vào `chrome://extensions/`
   - Bật "Developer mode" (góc trên bên phải)
   - Click "Load unpacked"
   - Chọn thư mục `extension/`

3. **Cấu hình API URL:**
   - Mở file `extension/popup.js`
   - Tìm dòng `const API_BASE_URL = 'https://cookie-switcher.vercel.app';`
   - Thay đổi URL thành API URL của bạn (hoặc giữ nguyên nếu dùng server mặc định)

### Cài đặt Backend API (Tùy chọn)

Nếu bạn muốn tự host backend API:

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Cấu hình environment variables:**
   - Tạo file `.env` trong thư mục gốc:
```env
MONGO_URI=mongodb://localhost:27017/cookie-switcher
# hoặc MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cookie-switcher
```

3. **Chạy development server:**
```bash
npm run dev
```

4. **Build và deploy:**
```bash
npm run build
npm start
```

## 📖 Hướng dẫn sử dụng

### Lưu và chuyển đổi tài khoản

1. **Lưu cookie hiện tại:**
   - Truy cập website mà bạn muốn lưu cookie
   - Click vào icon extension
   - Nhập tên tài khoản (ví dụ: "Tài khoản 1")
   - Click "💾 Lưu Cookie"

2. **Chuyển đổi tài khoản:**
   - Click vào icon extension
   - Tìm profile trong danh sách "📁 Local Profiles"
   - Click vào tên profile để áp dụng cookie
   - Trang sẽ tự động reload với cookie mới

### Chia sẻ profile trong group

1. **Tham gia group:**
   - Nhập Group ID (ví dụ: "team-marketing")
   - Click "🔗 Tham gia Group"
   - Group ID sẽ được lưu và tự động load khi mở extension

2. **Chia sẻ profile:**
   - Lưu profile local trước (xem phần trên)
   - Click nút "📤 Share" bên cạnh profile muốn chia sẻ
   - Profile sẽ được upload lên server và hiển thị cho các thành viên khác

3. **Đồng bộ profiles:**
   - Click "🔄 Đồng bộ" để tải danh sách profiles mới nhất từ server
   - Profiles từ các thành viên khác sẽ hiển thị trong phần "👥 Shared Group"

4. **Áp dụng shared profile:**
   - Click vào tên profile trong danh sách shared profiles
   - Cookie sẽ được áp dụng và trang reload

5. **Thu hồi chia sẻ:**
   - Chỉ người đã share profile mới thấy nút "🔒 Unshare"
   - Click "🔒 Unshare" để xóa profile khỏi group

### Import/Export Cookie

1. **Xuất cookie:**
   - Click "📄 Xuất Cookie (.json)"
   - File `cookies.json` sẽ được tải về

2. **Nhập cookie:**
   - Click "Choose File" và chọn file JSON
   - Click "📂 Nhập Cookie"
   - Cookie sẽ được áp dụng và trang reload

## 🔌 API Documentation

Backend API được xây dựng với Next.js và MongoDB. Các endpoints:

### GET `/api/groups/[groupId]`

Lấy danh sách profiles trong group.

**Request:**
```
GET /api/groups/team-marketing
```

**Response:**
```json
{
  "groupId": "team-marketing",
  "profiles": [
    {
      "profileName": "Tài khoản 1",
      "cookies": [...],
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST `/api/groups/save`

Lưu hoặc cập nhật profile trong group.

**Request:**
```json
{
  "groupId": "team-marketing",
  "profileName": "Tài khoản 1",
  "cookies": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Saved",
  "data": {
    "groupId": "team-marketing",
    "profileName": "Tài khoản 1",
    "profilesCount": 3
  }
}
```

### POST `/api/groups/removeProfile`

Xóa profile khỏi group (unshare).

**Request:**
```json
{
  "groupId": "team-marketing",
  "profileName": "Tài khoản 1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile removed from group",
  "data": {
    "groupId": "team-marketing",
    "profileName": "Tài khoản 1",
    "remainingProfiles": 2
  }
}
```

## 🏗️ Kiến trúc dự án

```
Cookie-Switcher/
├── extension/              # Chrome Extension
│   ├── manifest.json      # Manifest V3 configuration
│   ├── popup.html         # UI của extension
│   ├── popup.js           # Logic chính của extension
│   ├── background.js      # Service worker
│   ├── styles.css         # CSS styling
│   └── icon.png          # Extension icon
│
├── lib/                   # Backend libraries
│   ├── db.js             # MongoDB connection
│   └── cookieModel.js    # Mongoose schema cho SharedCookie
│
├── pages/                 # Next.js API routes
│   └── api/
│       └── groups/
│           ├── [groupId].js    # GET group profiles
│           ├── save.js         # POST save/update profile
│           └── removeProfile.js # POST remove profile
│
├── package.json           # Dependencies và scripts
├── next.config.js        # Next.js configuration
└── vercel.json           # Vercel deployment config
```

### Extension Architecture

- **Manifest V3**: Sử dụng service worker thay vì background page
- **Permissions**: 
  - `cookies`: Đọc và ghi cookie
  - `storage`: Lưu trữ local profiles
  - `tabs`, `activeTab`: Truy cập tab hiện tại
  - `scripting`: Reload tab sau khi apply cookie

### Backend Architecture

- **Next.js API Routes**: Serverless functions cho API endpoints
- **MongoDB**: Lưu trữ shared profiles theo group
- **Mongoose**: ODM cho MongoDB

### Database Schema

```javascript
SharedCookie {
  groupId: String (unique, indexed),
  profiles: [{
    profileName: String,
    cookies: Array,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 💻 Phát triển

### Development Setup

1. **Clone và cài đặt:**
```bash
git clone https://github.com/thanhtuanxzx/Cookie-Switcher.git
cd Cookie-Switcher
npm install
```

2. **Cấu hình environment:**
```bash
# Tạo file .env
echo "MONGO_URI=your_mongodb_connection_string" > .env
```

3. **Chạy development server:**
```bash
npm run dev
```

4. **Load extension:**
   - Mở `chrome://extensions/`
   - Load unpacked từ thư mục `extension/`
   - Cập nhật `API_BASE_URL` trong `popup.js` nếu cần

### Scripts

- `npm run dev`: Chạy Next.js development server
- `npm run build`: Build production
- `npm start`: Chạy production server
- `npm run package`: Tạo zip file cho extension (Linux/Mac)

### Testing API

Sử dụng các script test có sẵn:

**Windows (PowerShell):**
```powershell
.\test-api.ps1
```

**Linux/Mac:**
```bash
./test-api.sh
```

Hoặc test thủ công với curl:

```bash
# Test GET group
curl https://cookie-switcher.vercel.app/api/groups/test-group

# Test POST save
curl -X POST https://cookie-switcher.vercel.app/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{"groupId":"test-group","profileName":"Test","cookies":[]}'
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Guidelines

- Tuân thủ code style hiện tại
- Thêm comments cho code phức tạp
- Test kỹ trước khi submit PR
- Cập nhật documentation nếu cần

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](extension/LICENSE) để biết thêm chi tiết.

## 👤 Tác giả

**Thanhtuanxzx**

- GitHub: [@thanhtuanxzx](https://github.com/thanhtuanxzx)
- Facebook: [Nguyễn Thành Tuấn](https://www.facebook.com/nguyen.thanh.tuan.945489)
- Email: contact@thanhtuanxzx.dev

## 🔗 Liên kết

- [Repository](https://github.com/thanhtuanxzx/Cookie-Switcher)
- [Issues](https://github.com/thanhtuanxzx/Cookie-Switcher/issues)
- [Sponsor](https://github.com/sponsors/thanhtuanxzx)

## ⚠️ Lưu ý bảo mật

- **Cookie chứa thông tin nhạy cảm**: Không chia sẻ cookie với người không tin cậy
- **Group ID công khai**: Bất kỳ ai biết Group ID đều có thể truy cập profiles trong group
- **Sử dụng Group ID phức tạp**: Tránh dùng Group ID dễ đoán (ví dụ: "test", "123")
- **Xóa profile khi không dùng**: Thu hồi chia sẻ profile khi không cần thiết

## 🐛 Troubleshooting

### Extension không hoạt động
- Kiểm tra Chrome version (>= 88.0.0)
- Reload extension trong `chrome://extensions/`
- Kiểm tra console errors (F12)

### API không kết nối được
- Kiểm tra `API_BASE_URL` trong `popup.js`
- Kiểm tra network connection
- Kiểm tra CORS settings trên server

### Cookie không được áp dụng
- Kiểm tra domain có đúng không
- Kiểm tra permissions trong manifest.json
- Thử reload trang thủ công

---

⭐ Nếu dự án này hữu ích, hãy cho một star trên GitHub!

