# Hướng dẫn Deploy Backend lên Vercel

## 1. Chuẩn bị

### 1.1. Tạo MongoDB Atlas

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster miễn phí
3. Tạo database user
4. Whitelist IP (hoặc `0.0.0.0/0` để cho phép tất cả)
5. Lấy connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 1.2. Cài đặt Vercel CLI (tùy chọn)

```bash
npm i -g vercel
```

## 2. Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard

1. Truy cập [Vercel](https://vercel.com) và đăng nhập
2. Click "New Project"
3. Import repository từ GitHub/GitLab
4. Trong phần "Environment Variables", thêm:
   - Key: `MONGO_URI`
   - Value: Connection string từ MongoDB Atlas
5. Click "Deploy"

### Cách 2: Deploy qua CLI

```bash
# Đăng nhập
vercel login

# Deploy
vercel

# Set environment variable
vercel env add MONGO_URI

# Deploy production
vercel --prod
```

## 3. Test API

Sau khi deploy, bạn sẽ nhận được URL như: `https://your-project.vercel.app`

### Test Health Check

```bash
curl https://your-project.vercel.app/api/health
```

Kết quả mong đợi:
```json
{"status":"ok"}
```

### Test Save Cookie

```bash
curl -X POST https://your-project.vercel.app/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "test-group",
    "profileName": "test-profile",
    "cookies": [
      {
        "name": "session",
        "value": "abc123",
        "domain": ".example.com"
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

### Test Get Group

```bash
curl https://your-project.vercel.app/api/groups/test-group
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

## 4. Cấu hình Extension

Sau khi có URL backend, cập nhật trong `popup.js`:

```javascript
const API_BASE_URL = 'https://your-project.vercel.app/api';
```

## 5. Troubleshooting

### Lỗi kết nối MongoDB

- Kiểm tra MONGO_URI trong Vercel Environment Variables
- Kiểm tra IP whitelist trong MongoDB Atlas
- Kiểm tra username/password

### Lỗi 500 Internal Server Error

- Xem logs trong Vercel Dashboard
- Kiểm tra format của request body
- Đảm bảo mongoose đã được cài đặt

### Lỗi CORS (nếu có)

Vercel tự động xử lý CORS cho API routes, không cần cấu hình thêm.

