# Hướng dẫn sử dụng tính năng Shared Group

## 🎯 Tính năng

Shared Group cho phép nhiều người dùng chia sẻ cookie profiles realtime thông qua Group ID. Khi một người lưu profile mới, tất cả người khác trong cùng group sẽ tự động nhận được.

## 📋 Các bước sử dụng

### 1. Cấu hình Backend API

1. Deploy backend lên Vercel (xem [DEPLOY.md](./DEPLOY.md))
2. Lấy URL API (ví dụ: `https://your-api.vercel.app`)

### 2. Cấu hình Extension

1. Mở extension Cookie Switcher
2. Trong phần "👥 Shared Group", nhập API URL vào ô "API URL"
3. Click "💾 Lưu API URL"

### 3. Tạo hoặc tham gia Group

#### Tạo Group mới:
1. Nhập Group ID (ví dụ: `team-marketing`, `dev-group`)
2. Click "🔗 Tham gia Group"
3. Lưu profile cookie đầu tiên (sẽ tự động tạo group trên server)

#### Tham gia Group có sẵn:
1. Nhập Group ID của group bạn muốn tham gia
2. Click "🔗 Tham gia Group"
3. Click "🔄 Đồng bộ" để tải các profiles từ server

### 4. Lưu và chia sẻ Cookie

1. Đăng nhập vào tài khoản bạn muốn chia sẻ
2. Nhập tên profile (ví dụ: `acc1`)
3. Click "💾 Lưu Cookie"
4. Nếu đã bật "Tự động đồng bộ khi lưu", profile sẽ tự động được upload lên server
5. Nếu chưa bật, click "🔄 Đồng bộ" sau khi lưu

### 5. Sử dụng Cookie từ Group

1. Click "🔄 Đồng bộ" để tải danh sách profiles mới nhất
2. Trong phần "Shared Profiles", click vào profile bạn muốn sử dụng
3. Trang sẽ tự động reload với cookie của profile đó

## 🔄 Auto Sync

Bật "Tự động đồng bộ khi lưu" để:
- Tự động upload profile lên server khi lưu
- Không cần click "🔄 Đồng bộ" thủ công

## 💡 Use Cases

### Team Marketing
- Group ID: `marketing-team`
- Tất cả thành viên team có thể chia sẻ tài khoản social media

### Development Team
- Group ID: `dev-team`
- Chia sẻ tài khoản test/staging giữa các developer

### Personal Multi-Device
- Group ID: `my-devices`
- Đồng bộ cookie giữa các máy tính của bạn

## ⚠️ Lưu ý

1. **Bảo mật**: Group ID là public, ai biết ID đều có thể truy cập
2. **Cookie nhạy cảm**: Chỉ chia sẻ với người tin cậy
3. **API URL**: Cần cấu hình đúng API URL trước khi sử dụng
4. **Network**: Cần kết nối internet để đồng bộ

## 🐛 Troubleshooting

### Không đồng bộ được
- Kiểm tra API URL đã đúng chưa
- Kiểm tra kết nối internet
- Kiểm tra Group ID đã đúng chưa
- Xem console để kiểm tra lỗi

### Profile không hiển thị
- Click "🔄 Đồng bộ" để refresh
- Kiểm tra Group ID có đúng không
- Kiểm tra backend có hoạt động không (test `/api/health`)

### Lỗi khi chuyển cookie
- Kiểm tra domain của cookie có khớp với website hiện tại không
- Một số cookie có thể không thể set do security policy

