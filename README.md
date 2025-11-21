# 🟢 Cookie Switcher

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/thanhtuanxzx/Cookie-Switcher)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=flat-square&logo=google-chrome)](https://github.com/thanhtuanxzx/Cookie-Switcher)

Một tiện ích mở rộng Chrome giúp bạn dễ dàng chuyển đổi giữa các tài khoản bằng cách lưu và áp dụng cookie đã lưu, với tính năng chia sẻ cookie realtime qua Shared Group.

**🔗 Repository**: [https://github.com/thanhtuanxzx/Cookie-Switcher](https://github.com/thanhtuanxzx/Cookie-Switcher)

## 📋 Tổng quan

Dự án bao gồm:
- **Chrome Extension**: Phần mở rộng trình duyệt để quản lý và chuyển đổi cookie
- **Backend API**: Server API trên Vercel với MongoDB để chia sẻ cookie realtime

## 🏗️ Cấu trúc dự án

```
Cookie-Switcher/
├── extension/              # Chrome Extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── styles.css
│   ├── icon.png
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   └── LICENSE
│
├── api/                    # Backend API (Vercel)
│   ├── health.js
│   └── groups/
│       ├── save.js
│       └── [groupId].js
│
├── lib/                    # Backend libraries
│   ├── db.js
│   └── cookieModel.js
│
├── package.json           # Backend dependencies
├── vercel.json            # Vercel configuration
├── .gitignore
│
├── README.md              # File này
├── BACKEND_README.md       # Tài liệu Backend API
├── DEPLOY.md              # Hướng dẫn deploy backend
├── SHARED_GROUP_SETUP.md  # Hướng dẫn setup Shared Group
└── USAGE.md               # Hướng dẫn sử dụng
```

## 🚀 Bắt đầu nhanh

### 1. Cài đặt Extension

```bash
# Clone repository
git clone https://github.com/thanhtuanxzx/Cookie-Switcher.git
cd Cookie-Switcher

# Cài đặt extension
# 1. Mở Chrome → chrome://extensions/
# 2. Bật "Developer mode"
# 3. Click "Load unpacked"
# 4. Chọn thư mục extension/
```

Xem chi tiết tại [extension/README.md](./extension/README.md)

### 2. Setup Backend (Tùy chọn - cho Shared Group)

```bash
# Cài đặt dependencies
npm install

# Tạo file .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Deploy lên Vercel
vercel
```

Xem chi tiết tại [DEPLOY.md](./DEPLOY.md)

## 🎯 Tính năng

### Extension
- 💾 Lưu cookie của tài khoản hiện tại
- 🔀 Chuyển đổi nhanh chóng giữa các tài khoản
- 📁 Xuất/nhập cookie dưới dạng JSON
- 🧹 Quản lý và xóa tài khoản
- 👥 **Shared Group**: Chia sẻ cookie realtime với team

### Backend API
- 🔌 RESTful API cho Shared Group
- 💾 Lưu trữ trên MongoDB Atlas
- ⚡ Serverless trên Vercel
- 🔄 Realtime sync giữa nhiều người dùng

## 📚 Tài liệu

- [Extension README](./extension/README.md) - Tài liệu Chrome Extension
- [Backend README](./BACKEND_README.md) - Tài liệu Backend API
- [Deploy Guide](./DEPLOY.md) - Hướng dẫn deploy backend
- [Shared Group Setup](./SHARED_GROUP_SETUP.md) - Hướng dẫn setup Shared Group
- [Usage Guide](./USAGE.md) - Hướng dẫn sử dụng

## 🛠️ Công nghệ

### Extension
- Chrome Extension Manifest V3
- HTML/CSS/JavaScript
- Chrome APIs (cookies, storage, tabs)

### Backend
- Node.js (ES Modules)
- Vercel Serverless Functions
- MongoDB Atlas
- Mongoose ODM

## 📝 Quyền sử dụng

Extension yêu cầu các quyền:
- `cookies`: Đọc và ghi cookie
- `storage`: Lưu trữ dữ liệu
- `tabs`: Tương tác với tab
- `activeTab`: Truy cập tab đang hoạt động
- `scripting`: Thực thi script
- `<all_urls>`: Hoạt động trên tất cả website

## ⚠️ Lưu ý bảo mật

- Cookie chứa thông tin đăng nhập nhạy cảm
- Chỉ sử dụng trên các website đáng tin cậy
- Khi dùng Shared Group, chỉ chia sẻ với người tin cậy
- Thường xuyên xóa các tài khoản không còn sử dụng

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Xem [extension/CONTRIBUTING.md](./extension/CONTRIBUTING.md) để biết thêm chi tiết.

## 📞 Liên hệ

**👨‍💻 Tác giả**: [Thanhtuanxzx](https://github.com/thanhtuanxzx)

**📧 GitHub**: [https://github.com/thanhtuanxzx](https://github.com/thanhtuanxzx)

**📘 Facebook**: [https://www.facebook.com/nguyen.thanh.tuan.945489](https://www.facebook.com/nguyen.thanh.tuan.945489)

## 📄 Giấy phép

Dự án này được phát hành dưới giấy phép MIT. Xem file [extension/LICENSE](./extension/LICENSE) để biết thêm chi tiết.

## 🏷️ Tags

`chrome-extension` `cookie-manager` `account-switcher` `javascript` `manifest-v3` `privacy-focused` `open-source` `vercel` `mongodb` `serverless` `shared-group` `realtime-sync`

## 📊 Thống kê

![GitHub stars](https://img.shields.io/github/stars/thanhtuanxzx/Cookie-Switcher?style=social&cacheSeconds=300)
![GitHub forks](https://img.shields.io/github/forks/thanhtuanxzx/Cookie-Switcher?style=social&cacheSeconds=300)
![GitHub issues](https://img.shields.io/github/issues/thanhtuanxzx/Cookie-Switcher?cacheSeconds=300)
![GitHub license](https://img.shields.io/github/license/thanhtuanxzx/Cookie-Switcher?cacheSeconds=300)

## 🎉 Cảm ơn

Cảm ơn bạn đã sử dụng Cookie Switcher! Nếu dự án hữu ích, hãy cho một ⭐ trên GitHub.

---

*Được phát triển với ❤️ bởi [Thanhtuanxzx](https://github.com/thanhtuanxzx)*
