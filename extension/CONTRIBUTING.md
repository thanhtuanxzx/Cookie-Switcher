# 🤝 Hướng dẫn đóng góp cho Cookie Switcher

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Cookie Switcher! Dưới đây là hướng dẫn chi tiết để bạn có thể đóng góp một cách hiệu quả.

## 📋 Mục lục

- [Cách đóng góp](#cách-đóng-góp)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Quy tắc code](#quy-tắc-code)
- [Báo cáo lỗi](#báo-cáo-lỗi)
- [Đề xuất tính năng](#đề-xuất-tính-năng)
- [Pull Request](#pull-request)

## 🚀 Cách đóng góp

### 1. Fork và Clone
```bash
# Fork repository trên GitHub, sau đó clone fork của bạn
git clone https://github.com/YOUR_USERNAME/Cookie-Switcher.git
cd Cookie-Switcher

# Thêm upstream remote
git remote add upstream https://github.com/thanhtuanxzx/Cookie-Switcher.git
```

### 2. Tạo Branch
```bash
# Tạo branch mới cho tính năng/lỗi của bạn
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/issue-description
```

### 3. Phát triển
- Viết code theo quy tắc đã định
- Test kỹ lưỡng trước khi commit
- Cập nhật documentation nếu cần

### 4. Commit
```bash
git add .
git commit -m "Add: mô tả ngắn gọn về thay đổi"
```

### 5. Push và Pull Request
```bash
git push origin feature/your-feature-name
```
Sau đó tạo Pull Request trên GitHub.

## 🔄 Quy trình phát triển

### Cấu trúc Branch
- `main`: Branch chính, code ổn định
- `feature/*`: Tính năng mới
- `fix/*`: Sửa lỗi
- `docs/*`: Cập nhật tài liệu
- `refactor/*`: Refactor code

### Commit Message Convention
```
type(scope): description

body (optional)

footer (optional)
```

**Types:**
- `Add:` - Thêm tính năng mới
- `Fix:` - Sửa lỗi
- `Update:` - Cập nhật tính năng hiện có
- `Remove:` - Xóa tính năng
- `Docs:` - Cập nhật tài liệu
- `Style:` - Thay đổi format, không ảnh hưởng logic
- `Refactor:` - Refactor code
- `Test:` - Thêm/sửa test
- `Chore:` - Cập nhật build tools, dependencies

**Examples:**
```
Add: export cookies functionality
Fix: cookie import error on invalid JSON
Update: improve popup UI design
Docs: add installation guide
```

## 📝 Quy tắc Code

### JavaScript
- Sử dụng ES6+ features
- Tên biến/hàm rõ ràng, có ý nghĩa
- Comment cho logic phức tạp
- Xử lý error properly

### HTML/CSS
- Semantic HTML
- Responsive design
- CSS variables cho colors
- Consistent naming convention

### Chrome Extension
- Tuân thủ Manifest V3
- Proper error handling
- Security best practices
- User privacy protection

## 🐛 Báo cáo lỗi

Khi báo cáo lỗi, vui lòng cung cấp:

1. **Mô tả chi tiết** lỗi gặp phải
2. **Các bước tái tạo** lỗi
3. **Kết quả mong đợi** vs **kết quả thực tế**
4. **Môi trường**:
   - Chrome version
   - OS
   - Extension version
5. **Screenshots** nếu có thể
6. **Console logs** nếu có lỗi JavaScript

### Template báo cáo lỗi:
```markdown
## 🐛 Bug Report

**Mô tả lỗi:**
Mô tả ngắn gọn về lỗi

**Các bước tái tạo:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Kết quả mong đợi:**
Mô tả kết quả mong đợi

**Kết quả thực tế:**
Mô tả kết quả thực tế

**Môi trường:**
- Chrome Version: [e.g. 120.0.6099.109]
- OS: [e.g. Windows 11, macOS 14, Ubuntu 22.04]
- Extension Version: [e.g. 1.0.0]

**Screenshots:**
Nếu có thể, thêm screenshots

**Additional context:**
Thêm thông tin khác nếu cần
```

## 💡 Đề xuất tính năng

Khi đề xuất tính năng mới:

1. **Kiểm tra** xem tính năng đã được đề xuất chưa
2. **Mô tả chi tiết** tính năng
3. **Giải thích** tại sao tính năng này hữu ích
4. **Đề xuất** cách implement (nếu có thể)

### Template đề xuất tính năng:
```markdown
## 💡 Feature Request

**Tính năng mong muốn:**
Mô tả ngắn gọn về tính năng

**Vấn đề cần giải quyết:**
Mô tả vấn đề mà tính năng này sẽ giải quyết

**Giải pháp đề xuất:**
Mô tả chi tiết cách bạn muốn tính năng hoạt động

**Alternatives đã xem xét:**
Mô tả các giải pháp khác đã xem xét

**Additional context:**
Thêm thông tin khác nếu cần
```

## 🔀 Pull Request

### Checklist trước khi tạo PR:
- [ ] Code đã được test kỹ lưỡng
- [ ] Không có console errors
- [ ] Documentation đã được cập nhật
- [ ] Commit messages rõ ràng
- [ ] Code tuân thủ quy tắc đã định
- [ ] Không có conflicts với main branch

### Template Pull Request:
```markdown
## 📝 Description
Mô tả ngắn gọn về thay đổi

## 🔗 Related Issue
Closes #(issue number)

## 🧪 Testing
- [ ] Tested on Chrome [version]
- [ ] Tested on [OS]
- [ ] No console errors
- [ ] All features working as expected

## 📸 Screenshots
Nếu có thay đổi UI, thêm screenshots

## 📋 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 📞 Liên hệ

Nếu có câu hỏi về việc đóng góp:

- **GitHub Issues**: Tạo issue trên repository
- **Email**: [GitHub profile](https://github.com/thanhtuanxzx)
- **Facebook**: [Nguyễn Thành Tuấn](https://www.facebook.com/nguyen.thanh.tuan.945489)

## 🙏 Cảm ơn

Cảm ơn bạn đã đóng góp cho Cookie Switcher! Mọi đóng góp dù nhỏ đều được đánh giá cao.

---

*Happy coding! 🚀*
