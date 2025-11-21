# Backend API - Cookie Switcher

Backend API cho tính năng chia sẻ cookie realtime của Chrome Extension Cookie Switcher.

## 📋 Yêu cầu

- Node.js 18+
- MongoDB Atlas account
- Vercel account (hoặc có thể chạy local)

## 🚀 Cài đặt Local

```bash
# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cập nhật MONGO_URI trong .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## 📁 Cấu trúc Files

```
.
├── api/
│   ├── health.js              # Health check endpoint
│   └── groups/
│       ├── save.js            # Lưu/update cookie profile
│       └── [groupId].js       # Lấy tất cả profiles trong group
├── lib/
│   ├── db.js                  # MongoDB connection
│   └── cookieModel.js         # Mongoose schema
├── package.json
├── vercel.json                # Vercel configuration
└── .env.example
```

## 🔌 API Endpoints

### 1. Health Check

**GET** `/api/health`

Trả về:
```json
{
  "status": "ok"
}
```

### 2. Lưu Cookie Profile

**POST** `/api/groups/save`

Body:
```json
{
  "groupId": "marketing-team",
  "profileName": "acc1",
  "cookies": [
    {
      "name": "session",
      "value": "abc123",
      "domain": ".example.com",
      "path": "/",
      "secure": true,
      "httpOnly": true,
      "sameSite": "Lax",
      "expirationDate": 1234567890
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Saved",
  "data": {
    "groupId": "marketing-team",
    "profileName": "acc1",
    "profilesCount": 1
  }
}
```

### 3. Lấy Profiles trong Group

**GET** `/api/groups/[groupId]`

Ví dụ: `GET /api/groups/marketing-team`

Response:
```json
{
  "groupId": "marketing-team",
  "profiles": [
    {
      "profileName": "acc1",
      "cookies": [...],
      "updatedAt": "2025-01-XX..."
    },
    {
      "profileName": "acc2",
      "cookies": [...],
      "updatedAt": "2025-01-XX..."
    }
  ]
}
```

Nếu group không tồn tại:
```json
{
  "groupId": "non-existent",
  "profiles": []
}
```

## 🚀 Deploy lên Vercel

Xem file [DEPLOY.md](./DEPLOY.md) để biết hướng dẫn chi tiết.

Tóm tắt:
1. Push code lên GitHub
2. Import project vào Vercel
3. Set environment variable `MONGO_URI`
4. Deploy

## 🧪 Test API

### Test với cURL

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

## 🔒 Bảo mật

- Backend không có authentication (cần thêm nếu muốn bảo mật hơn)
- Group ID là public, ai biết ID đều có thể truy cập
- Khuyến nghị: Thêm authentication token hoặc API key

## 📝 Notes

- MongoDB connection được cache để tránh tạo nhiều kết nối (quan trọng với Vercel serverless)
- Schema tự động tạo index trên `groupId` để query nhanh
- Mỗi profile có `updatedAt` để track thời gian cập nhật

