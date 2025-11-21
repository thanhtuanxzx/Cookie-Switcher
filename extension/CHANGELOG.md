# 📝 Changelog

Tất cả các thay đổi quan trọng của dự án Cookie Switcher sẽ được ghi lại trong file này.

Format dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Changelog file để theo dõi các thay đổi
- Contributing guidelines
- MIT License

### Changed
- Cải thiện README với thông tin chi tiết hơn

## [1.0.0] - 2025-01-27

### Added
- 🎉 Phiên bản đầu tiên của Cookie Switcher
- 💾 Lưu cookie của tài khoản hiện tại với tên tùy chỉnh
- 🔀 Chuyển đổi nhanh chóng giữa các tài khoản đã lưu
- 📁 Xuất cookie ra file JSON
- 📂 Nhập cookie từ file JSON
- 🧹 Xóa từng tài khoản hoặc xóa tất cả
- 🎨 Giao diện popup thân thiện với người dùng
- 👨‍💻 Thông tin tác giả trong popup
- 🔒 Sử dụng Chrome Extension Manifest V3
- 🌐 Hỗ trợ tất cả website với quyền `<all_urls>`

### Technical Details
- **Manifest Version**: 3
- **Permissions**: cookies, storage, tabs, activeTab, scripting
- **Host Permissions**: <all_urls>
- **Service Worker**: background.js
- **UI**: popup.html với styles.css
- **Storage**: Chrome local storage API

### Security Features
- Xử lý cookie an toàn với proper sanitization
- Error handling cho các trường hợp edge case
- Không lưu trữ thông tin nhạy cảm không cần thiết

---

## 📋 Legend

- **Added** - Tính năng mới
- **Changed** - Thay đổi trong tính năng hiện có
- **Deprecated** - Tính năng sẽ bị xóa trong tương lai
- **Removed** - Tính năng đã bị xóa
- **Fixed** - Sửa lỗi
- **Security** - Cải thiện bảo mật

## 🔗 Links

- [GitHub Repository](https://github.com/thanhtuanxzx/Cookie-Switcher)
- [Author Profile](https://github.com/thanhtuanxzx)
- [Facebook](https://www.facebook.com/nguyen.thanh.tuan.945489)
