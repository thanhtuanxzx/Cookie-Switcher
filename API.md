# 🔌 API Documentation

Tài liệu chi tiết về Backend API của Cookie Switcher.

## 📋 Mục lục

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Base URL

```
Production: https://cookie-switcher.vercel.app
Development: http://localhost:3000
```

Tất cả endpoints đều bắt đầu với `/api/`

## 🔐 Authentication

**Hiện tại**: API không yêu cầu authentication. Group ID được sử dụng như một public identifier.

**Lưu ý bảo mật**: 
- Bất kỳ ai biết Group ID đều có thể truy cập và modify profiles trong group
- Nên sử dụng Group ID phức tạp, khó đoán
- Không chia sẻ Group ID công khai nếu không muốn người khác truy cập

**Tương lai**: Có thể thêm authentication trong các version sau.

## 📡 Endpoints

### Health Check

#### `GET /api/health`

Kiểm tra trạng thái của API server.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK`: Server hoạt động bình thường
- `405 Method Not Allowed`: Method không được phép

---

### Get Group Profiles

#### `GET /api/groups/[groupId]`

Lấy danh sách tất cả profiles trong một group.

**Request:**
```http
GET /api/groups/team-marketing
```

**Path Parameters:**
- `groupId` (string, required): ID của group

**Response Success:**
```json
{
  "groupId": "team-marketing",
  "profiles": [
    {
      "profileName": "Tài khoản 1",
      "cookies": [
        {
          "name": "session_id",
          "value": "abc123",
          "domain": ".example.com",
          "path": "/",
          "secure": true,
          "httpOnly": true,
          "sameSite": "Lax",
          "expirationDate": 1735689600
        }
      ],
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "profileName": "Tài khoản 2",
      "cookies": [...],
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

**Response Empty Group:**
```json
{
  "groupId": "team-marketing",
  "profiles": []
}
```

**Status Codes:**
- `200 OK`: Thành công
- `400 Bad Request`: Thiếu groupId
- `405 Method Not Allowed`: Method không được phép
- `500 Internal Server Error`: Lỗi server

**Example:**
```bash
curl https://cookie-switcher.vercel.app/api/groups/team-marketing
```

---

### Save/Update Profile

#### `POST /api/groups/save`

Lưu một profile mới hoặc cập nhật profile đã tồn tại trong group.

**Request:**
```http
POST /api/groups/save
Content-Type: application/json

{
  "groupId": "team-marketing",
  "profileName": "Tài khoản 1",
  "cookies": [
    {
      "name": "session_id",
      "value": "abc123",
      "domain": ".example.com",
      "path": "/",
      "secure": true,
      "httpOnly": true,
      "sameSite": "Lax",
      "expirationDate": 1735689600
    }
  ]
}
```

**Request Body:**
- `groupId` (string, required): ID của group
- `profileName` (string, required): Tên của profile
- `cookies` (array, required): Mảng các cookie objects

**Cookie Object Structure:**
```typescript
{
  name: string;           // Tên cookie
  value: string;          // Giá trị cookie
  domain: string;         // Domain (ví dụ: ".example.com")
  path: string;          // Path (thường là "/")
  secure?: boolean;       // Secure flag
  httpOnly?: boolean;     // HttpOnly flag
  sameSite?: string;     // "Strict" | "Lax" | "None"
  expirationDate?: number; // Unix timestamp
}
```

**Response Success:**
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

**Response Error:**
```json
{
  "success": false,
  "message": "groupId and profileName are required"
}
```

**Status Codes:**
- `200 OK`: Lưu thành công
- `400 Bad Request`: Thiếu required fields hoặc cookies không phải array
- `405 Method Not Allowed`: Method không được phép
- `500 Internal Server Error`: Lỗi server

**Behavior:**
- Nếu group chưa tồn tại, group mới sẽ được tạo
- Nếu profile đã tồn tại trong group, profile sẽ được cập nhật
- Nếu profile chưa tồn tại, profile mới sẽ được thêm vào

**Example:**
```bash
curl -X POST https://cookie-switcher.vercel.app/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "team-marketing",
    "profileName": "Tài khoản 1",
    "cookies": [
      {
        "name": "session_id",
        "value": "abc123",
        "domain": ".example.com",
        "path": "/",
        "secure": true,
        "httpOnly": true,
        "sameSite": "Lax"
      }
    ]
  }'
```

---

### Remove Profile

#### `POST /api/groups/removeProfile`

Xóa một profile khỏi group (unshare).

**Request:**
```http
POST /api/groups/removeProfile
Content-Type: application/json

{
  "groupId": "team-marketing",
  "profileName": "Tài khoản 1"
}
```

**Request Body:**
- `groupId` (string, required): ID của group
- `profileName` (string, required): Tên của profile cần xóa

**Response Success:**
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

**Response Error:**
```json
{
  "success": false,
  "message": "Group not found"
}
```

**Status Codes:**
- `200 OK`: Xóa thành công
- `400 Bad Request`: Thiếu required fields
- `404 Not Found`: Group hoặc profile không tồn tại
- `405 Method Not Allowed`: Method không được phép
- `500 Internal Server Error`: Lỗi server

**Example:**
```bash
curl -X POST https://cookie-switcher.vercel.app/api/groups/removeProfile \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "team-marketing",
    "profileName": "Tài khoản 1"
  }'
```

---

## ⚠️ Error Handling

### Error Response Format

Tất cả errors đều trả về format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message (optional, chỉ trong development)"
}
```

### Common Error Codes

- `400 Bad Request`: Request không hợp lệ (thiếu fields, wrong format)
- `404 Not Found`: Resource không tồn tại
- `405 Method Not Allowed`: HTTP method không được phép
- `500 Internal Server Error`: Lỗi server (database, network, etc.)

### Error Examples

**Missing Required Field:**
```json
{
  "success": false,
  "message": "groupId and profileName are required"
}
```

**Invalid Data Type:**
```json
{
  "success": false,
  "message": "cookies must be an array"
}
```

**Not Found:**
```json
{
  "success": false,
  "message": "Group not found"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "MongoDB connection failed"
}
```

---

## 🚦 Rate Limiting

**Hiện tại**: Không có rate limiting.

**Tương lai**: Có thể thêm rate limiting để bảo vệ server:
- 100 requests/minute per IP
- 1000 requests/hour per IP

---

## 💡 Examples

### JavaScript/Extension

```javascript
// Get group profiles
async function getGroupProfiles(groupId) {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}`);
  const data = await response.json();
  return data.profiles;
}

// Save profile
async function saveProfile(groupId, profileName, cookies) {
  const response = await fetch(`${API_BASE_URL}/api/groups/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, profileName, cookies })
  });
  const data = await response.json();
  return data;
}

// Remove profile
async function removeProfile(groupId, profileName) {
  const response = await fetch(`${API_BASE_URL}/api/groups/removeProfile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, profileName })
  });
  const data = await response.json();
  return data;
}
```

### Python

```python
import requests

API_BASE_URL = "https://cookie-switcher.vercel.app"

# Get group profiles
def get_group_profiles(group_id):
    response = requests.get(f"{API_BASE_URL}/api/groups/{group_id}")
    return response.json()

# Save profile
def save_profile(group_id, profile_name, cookies):
    response = requests.post(
        f"{API_BASE_URL}/api/groups/save",
        json={
            "groupId": group_id,
            "profileName": profile_name,
            "cookies": cookies
        }
    )
    return response.json()

# Remove profile
def remove_profile(group_id, profile_name):
    response = requests.post(
        f"{API_BASE_URL}/api/groups/removeProfile",
        json={
            "groupId": group_id,
            "profileName": profile_name
        }
    )
    return response.json()
```

### cURL

```bash
# Health check
curl https://cookie-switcher.vercel.app/api/health

# Get profiles
curl https://cookie-switcher.vercel.app/api/groups/my-group

# Save profile
curl -X POST https://cookie-switcher.vercel.app/api/groups/save \
  -H "Content-Type: application/json" \
  -d '{"groupId":"my-group","profileName":"Test","cookies":[]}'

# Remove profile
curl -X POST https://cookie-switcher.vercel.app/api/groups/removeProfile \
  -H "Content-Type: application/json" \
  -d '{"groupId":"my-group","profileName":"Test"}'
```

---

## 🔒 Security Considerations

1. **Group ID**: Sử dụng Group ID phức tạp, khó đoán
2. **Cookie Data**: Cookie chứa thông tin nhạy cảm, không chia sẻ công khai
3. **HTTPS**: Luôn sử dụng HTTPS trong production
4. **Validation**: Validate input data trước khi lưu
5. **Rate Limiting**: Sẽ được thêm trong tương lai

---

## 📊 Database Schema

### SharedCookie Collection

```javascript
{
  _id: ObjectId,
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

---

## 🐛 Troubleshooting

### Connection Issues
- Kiểm tra API URL có đúng không
- Kiểm tra network connection
- Kiểm tra CORS settings

### Data Issues
- Kiểm tra format của request body
- Kiểm tra required fields
- Kiểm tra cookie format

### Server Issues
- Kiểm tra MongoDB connection
- Kiểm tra server logs
- Sử dụng `/api/health` để kiểm tra server status

---

## 📝 Notes

- Tất cả timestamps đều sử dụng UTC
- Cookie expirationDate là Unix timestamp (seconds)
- Group ID không phân biệt hoa thường (case-insensitive)
- Profile names trong cùng một group phải unique

---

**Last Updated**: 2025-01-15

