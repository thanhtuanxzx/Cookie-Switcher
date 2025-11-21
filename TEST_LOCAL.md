# 🧪 Hướng dẫn Test Backend Local

## 📋 Yêu cầu

- Node.js 18+
- MongoDB Atlas account (hoặc MongoDB local)
- Đã cài đặt dependencies: `npm install`

## 🚀 Các bước test

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Tạo file .env

Tạo file `.env` ở root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3000
```

**Lưu ý**: Thay `MONGO_URI` bằng connection string thực tế từ MongoDB Atlas.

### 3. Chạy server local

```bash
npm run dev
```

Hoặc:

```bash
node server.js
```

Server sẽ chạy tại: `http://localhost:3000`

### 4. Test các endpoints

#### Health Check

```bash
curl http://localhost:3000/api/health
```

Kết quả mong đợi:
```json
{"status":"ok"}
```

#### Save Cookie Profile

```bash
curl -X POST http://localhost:3000/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "test-group",
    "profileName": "test-profile",
    "cookies": [
      {
        "name": "session",
        "value": "abc123",
        "domain": ".example.com",
        "path": "/",
        "secure": true,
        "httpOnly": true
      }
    ]
  }'
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Saved",
  "data": {
    "groupId": "test-group",
    "profileName": "test-profile",
    "profilesCount": 1
  }
}
```

#### Get Group

```bash
curl http://localhost:3000/api/groups/test-group
```

Kết quả mong đợi:
```json
{
  "groupId": "test-group",
  "profiles": [
    {
      "profileName": "test-profile",
      "cookies": [...],
      "updatedAt": "2025-01-XX..."
    }
  ]
}
```

## 🧪 Test với Postman hoặc Thunder Client

### 1. Health Check
- **Method**: GET
- **URL**: `http://localhost:3000/api/health`

### 2. Save Cookie
- **Method**: POST
- **URL**: `http://localhost:3000/api/groups/save`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "groupId": "test-group",
  "profileName": "test-profile",
  "cookies": [
    {
      "name": "session",
      "value": "abc123",
      "domain": ".example.com"
    }
  ]
}
```

### 3. Get Group
- **Method**: GET
- **URL**: `http://localhost:3000/api/groups/test-group`

## 🔧 Cấu hình Extension để test local

1. Mở file `extension/popup.js`
2. Tìm dòng:
   ```javascript
   const API_BASE_URL = 'https://your-api.vercel.app';
   ```
3. Thay đổi thành:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000';
   ```
4. Lưu và reload extension

**Lưu ý**: Chrome extension có thể chặn HTTP (không phải HTTPS). Nếu gặp lỗi CORS hoặc mixed content:
- Thử dùng `http://127.0.0.1:3000` thay vì `http://localhost:3000`
- Hoặc cấu hình CORS trong server.js (đã có sẵn)

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB

```
Error: connect ECONNREFUSED
```

**Giải pháp**:
- Kiểm tra MONGO_URI trong file .env
- Kiểm tra IP whitelist trong MongoDB Atlas
- Kiểm tra username/password

### Lỗi CORS

```
Access to fetch at 'http://localhost:3000' from origin 'chrome-extension://...' has been blocked by CORS policy
```

**Giải pháp**:
- Server đã có CORS middleware, đảm bảo server đang chạy
- Thử dùng `http://127.0.0.1:3000` thay vì `localhost`

### Port đã được sử dụng

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Giải pháp**:
- Đổi PORT trong file .env
- Hoặc kill process đang dùng port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill
  ```

## 📝 Notes

- Server local chỉ dùng để test, không dùng cho production
- Đảm bảo MongoDB connection string đúng
- Có thể test với nhiều group ID khác nhau
- Data sẽ được lưu vào MongoDB thật, cẩn thận khi test

## 🔄 So sánh với Vercel

| Feature | Local Server | Vercel |
|---------|-------------|--------|
| URL | http://localhost:3000 | https://your-api.vercel.app |
| Hot reload | Cần restart | Tự động |
| Environment | .env file | Vercel Dashboard |
| Logs | Console | Vercel Dashboard |

