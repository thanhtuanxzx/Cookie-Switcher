# 🟢 Cookie Switcher

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/thanhtuanxzx/Cookie-Switcher)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=flat-square&logo=google-chrome)](https://github.com/thanhtuanxzx/Cookie-Switcher)

Một tiện ích mở rộng Chrome giúp bạn dễ dàng chuyển đổi giữa các tài khoản bằng cách lưu và áp dụng cookie đã lưu.

**🔗 Repository**: [https://github.com/thanhtuanxzx/Cookie-Switcher](https://github.com/thanhtuanxzx/Cookie-Switcher)

## 📋 Mô tả

Cookie Switcher cho phép bạn:
- Lưu cookie của tài khoản hiện tại với tên tùy chỉnh
- Chuyển đổi nhanh chóng giữa các tài khoản đã lưu
- Xuất/nhập cookie dưới dạng file JSON
- Quản lý và xóa các tài khoản đã lưu

## 🚀 Tính năng

- **💾 Lưu Cookie**: Lưu trữ cookie của tài khoản hiện tại
- **🔀 Chuyển tài khoản**: Chuyển đổi nhanh chóng giữa các tài khoản đã lưu
- **📁 Xuất/Nhập**: Xuất cookie ra file JSON hoặc nhập từ file JSON
- **🧹 Quản lý**: Xóa từng tài khoản hoặc xóa tất cả
- **🎨 Giao diện thân thiện**: Thiết kế đơn giản, dễ sử dụng

## 📦 Cài đặt

### Từ GitHub Repository
```bash
git clone https://github.com/thanhtuanxzx/Cookie-Switcher.git
cd Cookie-Switcher
```

### Cài đặt Extension
1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật "Developer mode" ở góc trên bên phải
3. Nhấn "Load unpacked" và chọn thư mục chứa extension
4. Extension sẽ xuất hiện trong thanh công cụ Chrome

### Cập nhật từ GitHub
```bash
git pull origin main
```
Sau đó reload extension trong Chrome Extensions page.

## 🎯 Cách sử dụng

### Lưu tài khoản
1. Đăng nhập vào tài khoản bạn muốn lưu
2. Nhấn vào icon Cookie Switcher trên thanh công cụ
3. Nhập tên tài khoản vào ô "Nhập tên tài khoản..."
4. Nhấn "💾 Lưu Cookie"

### Chuyển tài khoản
1. Nhấn vào icon Cookie Switcher
2. Trong phần "🔀 Chuyển tài khoản", nhấn vào tên tài khoản bạn muốn chuyển
3. Trang sẽ tự động tải lại với cookie của tài khoản đã chọn

### Xuất/Nhập Cookie
- **Xuất**: Nhấn "📄 Xuất Cookie (.json)" để tải file JSON chứa cookie hiện tại
- **Nhập**: Chọn file JSON và nhấn "📂 Nhập Cookie" để áp dụng cookie từ file

## 🔧 Cấu trúc dự án

```
Cookie-Switcher/
├── manifest.json      # Cấu hình extension
├── popup.html         # Giao diện popup
├── popup.js           # Logic xử lý popup
├── background.js      # Service worker
├── styles.css         # CSS styling
├── icon.png           # Icon extension
├── package.json       # NPM package metadata
├── README.md          # Tài liệu dự án
├── LICENSE            # MIT License
├── CONTRIBUTING.md    # Hướng dẫn đóng góp
├── CHANGELOG.md       # Lịch sử thay đổi
└── .gitignore         # Git ignore rules
```

## 🛠️ Công nghệ sử dụng

- **Manifest V3**: Sử dụng Chrome Extension Manifest V3
- **Chrome APIs**: 
  - `chrome.cookies`: Quản lý cookie
  - `chrome.storage`: Lưu trữ dữ liệu
  - `chrome.tabs`: Tương tác với tab
- **HTML/CSS/JavaScript**: Giao diện và logic

## 📝 Quyền sử dụng

Extension yêu cầu các quyền sau:
- `cookies`: Để đọc và ghi cookie
- `storage`: Để lưu trữ dữ liệu tài khoản
- `tabs`: Để tương tác với tab hiện tại
- `activeTab`: Để truy cập tab đang hoạt động
- `scripting`: Để thực thi script
- `<all_urls>`: Để hoạt động trên tất cả website

## ⚠️ Lưu ý bảo mật

- Cookie chứa thông tin đăng nhập nhạy cảm, hãy cẩn thận khi chia sẻ
- Chỉ sử dụng extension trên các website đáng tin cậy
- Thường xuyên xóa các tài khoản không còn sử dụng

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:
1. Fork repository từ [https://github.com/thanhtuanxzx/Cookie-Switcher](https://github.com/thanhtuanxzx/Cookie-Switcher)
2. Clone fork của bạn:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Cookie-Switcher.git
   ```
3. Tạo branch mới cho tính năng của bạn:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Commit các thay đổi:
   ```bash
   git add .
   git commit -m "Add: mô tả tính năng mới"
   ```
5. Push lên fork của bạn:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Tạo Pull Request trên GitHub

### Cấu trúc commit message
- `Add:` - Thêm tính năng mới
- `Fix:` - Sửa lỗi
- `Update:` - Cập nhật tính năng hiện có
- `Remove:` - Xóa tính năng
- `Docs:` - Cập nhật tài liệu

## 🚀 Setup Repository (Lần đầu)

Nếu bạn muốn push code lên repository GitHub:

```bash
# Khởi tạo git repository
git init

# Thêm remote origin
git remote add origin https://github.com/thanhtuanxzx/Cookie-Switcher.git

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit: Cookie Switcher Chrome Extension"

# Push lên main branch
git branch -M main
git push -u origin main
```

## 📞 Liên hệ

**👨‍💻 Tác giả**: [Thanhtuanxzx](https://github.com/thanhtuanxzx)

**📧 GitHub**: [https://github.com/thanhtuanxzx](https://github.com/thanhtuanxzx)

**📘 Facebook**: [https://www.facebook.com/nguyen.thanh.tuan.945489](https://www.facebook.com/nguyen.thanh.tuan.945489)

## 📄 Giấy phép

Dự án này được phát hành dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📚 Tài liệu khác

- [📝 Changelog](CHANGELOG.md) - Lịch sử các thay đổi
- [🤝 Contributing](CONTRIBUTING.md) - Hướng dẫn đóng góp
- [🔒 Privacy Policy](#privacy-policy) - Chính sách bảo mật

## 🔒 Privacy Policy

Cookie Switcher cam kết bảo vệ quyền riêng tư của người dùng:

- **Dữ liệu lưu trữ**: Extension chỉ lưu trữ cookie trên thiết bị của bạn
- **Không thu thập**: Chúng tôi không thu thập, gửi hoặc chia sẻ dữ liệu cá nhân
- **Lưu trữ local**: Tất cả dữ liệu được lưu trữ locally trong Chrome storage
- **Quyền kiểm soát**: Bạn có thể xóa tất cả dữ liệu bất cứ lúc nào

## 🏷️ Tags

`chrome-extension` `cookie-manager` `account-switcher` `javascript` `manifest-v3` `privacy-focused` `open-source`

## 📊 Thống kê

![GitHub stars](https://img.shields.io/github/stars/thanhtuanxzx/Cookie-Switcher?style=social&cacheSeconds=300)
![GitHub forks](https://img.shields.io/github/forks/thanhtuanxzx/Cookie-Switcher?style=social&cacheSeconds=300)
![GitHub issues](https://img.shields.io/github/issues/thanhtuanxzx/Cookie-Switcher?cacheSeconds=300)
![GitHub license](https://img.shields.io/github/license/thanhtuanxzx/Cookie-Switcher?cacheSeconds=300)


## 🎉 Cảm ơn

Cảm ơn bạn đã sử dụng Cookie Switcher! Nếu extension hữu ích, hãy cho một ⭐ trên GitHub.

---

*Được phát triển với ❤️ bởi [Thanhtuanxzx](https://github.com/thanhtuanxzx)*
