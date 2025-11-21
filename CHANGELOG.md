# 📝 Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi lại trong file này.

Format dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án này tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-21

### ✨ Added
- Tính năng lưu và chuyển đổi cookie local
- Chia sẻ profiles trong group qua backend API
- Import/Export cookie dưới dạng JSON
- UI popup với các chức năng cơ bản
- Backend API với Next.js và MongoDB
- API endpoints:
  - `GET /api/groups/[groupId]` - Lấy profiles trong group
  - `POST /api/groups/save` - Lưu/update profile
  - `POST /api/groups/removeProfile` - Xóa profile khỏi group
  - `GET /api/health` - Health check endpoint
- Support Manifest V3
- Auto-reload tab sau khi apply cookie
- Track shared profiles để chỉ owner mới có thể unshare

### 🔧 Technical
- Chrome Extension với Manifest V3
- Next.js API routes
- MongoDB với Mongoose
- Service worker (background.js)
- Local storage cho profiles
- Cookie sanitization khi apply

### 📚 Documentation
- README.md với hướng dẫn đầy đủ
- CONTRIBUTING.md
- CHANGELOG.md
- API documentation

---

## [Unreleased]

### 🎯 Planned Features
- [ ] Thêm authentication cho API
- [ ] Encrypt cookies trước khi lưu
- [ ] Thêm UI cho việc quản lý groups
- [ ] Support multiple browsers (Firefox, Edge)
- [ ] Thêm unit tests
- [ ] Thêm integration tests
- [ ] Internationalization (i18n)
- [ ] Dark mode
- [ ] Cookie expiration warnings
- [ ] Batch operations (apply multiple profiles)
- [ ] Profile templates
- [ ] Cookie validation before save

### 🔄 Improvements
- [ ] Cải thiện error handling
- [ ] Thêm loading states
- [ ] Optimize database queries
- [ ] Cải thiện UI/UX
- [ ] Thêm keyboard shortcuts
- [ ] Search/filter profiles

### 🐛 Known Issues
- Cookie với SameSite=None cần Secure flag
- Một số cookie có thể không apply được do browser restrictions
- Group ID không có authentication (bất kỳ ai biết ID đều có thể truy cập)

---

## Version History

### [1.0.0] - Initial Release
- First stable release
- Core functionality implemented
- Basic documentation

---

## Legend

- `Added` - Tính năng mới
- `Changed` - Thay đổi trong chức năng hiện có
- `Deprecated` - Tính năng sẽ bị xóa trong tương lai
- `Removed` - Tính năng đã bị xóa
- `Fixed` - Sửa bug
- `Security` - Cải thiện bảo mật

---

**Note**: Changelog này được maintain từ version 1.0.0 trở đi.

