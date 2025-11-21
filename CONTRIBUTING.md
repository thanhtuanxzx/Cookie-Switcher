# 🤝 Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Cookie Switcher! Tài liệu này sẽ hướng dẫn bạn cách đóng góp hiệu quả.

## 📋 Mục lục

- [Code of Conduct](#code-of-conduct)
- [Cách đóng góp](#cách-đóng-góp)
- [Quy trình Development](#quy-trình-development)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

Khi tham gia dự án này, bạn đồng ý tuân thủ:

- Tôn trọng tất cả các thành viên và đóng góp của họ
- Chấp nhận feedback một cách xây dựng
- Tập trung vào những gì tốt nhất cho cộng đồng
- Thể hiện sự đồng cảm với các thành viên khác

## 🚀 Cách đóng góp

### Báo cáo Bug

Nếu bạn tìm thấy bug, vui lòng:

1. Kiểm tra xem bug đã được báo cáo chưa trong [Issues](https://github.com/thanhtuanxzx/Cookie-Switcher/issues)
2. Nếu chưa, tạo issue mới với:
   - Mô tả rõ ràng về bug
   - Các bước để reproduce
   - Expected behavior vs Actual behavior
   - Screenshots (nếu có)
   - Environment info (Chrome version, OS, etc.)

### Đề xuất tính năng

1. Kiểm tra xem tính năng đã được đề xuất chưa
2. Tạo issue với label "enhancement"
3. Mô tả chi tiết:
   - Vấn đề mà tính năng giải quyết
   - Cách tính năng hoạt động
   - Lợi ích của tính năng

### Đóng góp code

1. Fork repository
2. Tạo branch mới từ `main`
3. Thực hiện thay đổi
4. Test kỹ lưỡng
5. Submit Pull Request

## 💻 Quy trình Development

### Setup môi trường

```bash
# 1. Fork và clone repository
git clone https://github.com/YOUR_USERNAME/Cookie-Switcher.git
cd Cookie-Switcher

# 2. Cài đặt dependencies
npm install

# 3. Tạo branch mới
git checkout -b feature/your-feature-name

# 4. Cấu hình environment
# Tạo file .env với MONGO_URI
```

### Cấu trúc code

- `extension/`: Code của Chrome Extension
- `lib/`: Backend libraries và models
- `pages/api/`: Next.js API routes
- Mỗi file nên có một mục đích rõ ràng

### Testing

Trước khi submit PR, hãy test:

- [ ] Extension hoạt động trên Chrome >= 88
- [ ] Tất cả chức năng local hoạt động đúng
- [ ] API endpoints hoạt động đúng (nếu có thay đổi)
- [ ] Không có console errors
- [ ] UI/UX không bị ảnh hưởng tiêu cực

## 📝 Coding Standards

### JavaScript

- Sử dụng ES6+ syntax
- Sử dụng `const` và `let`, tránh `var`
- Sử dụng arrow functions khi phù hợp
- Thêm comments cho logic phức tạp
- Sử dụng async/await thay vì callbacks khi có thể

**Ví dụ tốt:**
```javascript
async function applyCookies(cookiesToApply, profileName) {
  try {
    const current = await chrome.cookies.getAll({ url: domain });
    await Promise.all(current.map(c => chrome.cookies.remove({ url: domain, name: c.name })));
    // ... rest of code
  } catch (error) {
    console.error('Apply cookies error:', error);
  }
}
```

**Ví dụ không tốt:**
```javascript
function applyCookies(cookiesToApply, profileName) {
  chrome.cookies.getAll({ url: domain }, function(current) {
    current.forEach(function(c) {
      chrome.cookies.remove({ url: domain, name: c.name }, function() {
        // nested callbacks - khó đọc
      });
    });
  });
}
```

### Naming Conventions

- **Variables & Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes/Components**: `PascalCase`
- **Files**: `camelCase.js` hoặc `kebab-case.js`

### Comments

- Thêm JSDoc comments cho functions phức tạp
- Giải thích "tại sao" chứ không chỉ "cái gì"
- Cập nhật comments khi code thay đổi

**Ví dụ:**
```javascript
/**
 * Áp dụng cookies cho domain hiện tại
 * Xóa tất cả cookies cũ trước khi set cookies mới để tránh conflict
 * 
 * @param {Array} cookiesToApply - Mảng các cookie objects
 * @param {string} profileName - Tên profile để hiển thị
 */
async function applyCookies(cookiesToApply, profileName) {
  // ...
}
```

### Error Handling

- Luôn sử dụng try-catch cho async operations
- Hiển thị error messages rõ ràng cho user
- Log errors vào console để debug

```javascript
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  alert('Lỗi: ' + error.message);
}
```

## 📨 Commit Messages

Sử dụng format sau cho commit messages:

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Types

- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Thay đổi documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Thêm hoặc sửa tests
- `chore`: Maintenance tasks

### Ví dụ

```
feat: thêm chức năng export cookie sang JSON

Cho phép người dùng xuất cookie hiện tại ra file JSON
để backup hoặc chia sẻ với người khác.

Closes #123
```

```
fix: sửa lỗi không apply cookie khi domain có subdomain

Cookie không được apply đúng khi domain có subdomain.
Đã sửa bằng cách normalize domain trước khi apply.

Fixes #456
```

## 🔄 Pull Request Process

### Trước khi tạo PR

1. **Sync với upstream:**
```bash
git remote add upstream https://github.com/thanhtuanxzx/Cookie-Switcher.git
git fetch upstream
git rebase upstream/main
```

2. **Test kỹ lưỡng:**
   - Test tất cả chức năng liên quan
   - Kiểm tra không có lỗi lint
   - Test trên nhiều Chrome versions nếu có thể

3. **Update documentation:**
   - Cập nhật README.md nếu có thay đổi API
   - Thêm comments cho code mới
   - Update CHANGELOG.md nếu cần

### Tạo PR

1. Push branch lên fork của bạn
2. Tạo Pull Request trên GitHub
3. Điền đầy đủ thông tin:
   - **Title**: Mô tả ngắn gọn
   - **Description**: 
     - Mô tả chi tiết thay đổi
     - Link đến related issues
     - Screenshots (nếu có UI changes)
     - Checklist các điểm đã test

### Template PR

```markdown
## Mô tả
Mô tả ngắn gọn về thay đổi

## Loại thay đổi
- [ ] Bug fix
- [ ] Tính năng mới
- [ ] Breaking change
- [ ] Documentation update

## Cách test
1. Bước 1
2. Bước 2
3. ...

## Screenshots (nếu có)
...

## Related Issues
Closes #123
```

### Review Process

- Maintainer sẽ review code
- Có thể yêu cầu thay đổi
- Sau khi approve, code sẽ được merge

## 🎯 Priority Areas

Các lĩnh vực cần đóng góp:

1. **Testing**: Thêm unit tests và integration tests
2. **Documentation**: Cải thiện docs, thêm examples
3. **Security**: Review và cải thiện security
4. **Performance**: Optimize code và database queries
5. **UI/UX**: Cải thiện giao diện và trải nghiệm người dùng
6. **Internationalization**: Thêm hỗ trợ đa ngôn ngữ

## ❓ Câu hỏi?

Nếu có câu hỏi, vui lòng:

- Tạo issue với label "question"
- Liên hệ maintainer qua email: contact@thanhtuanxzx.dev
- Tham gia discussion trên GitHub

## 🙏 Cảm ơn

Cảm ơn bạn đã dành thời gian đóng góp cho Cookie Switcher! Mọi đóng góp, dù nhỏ, đều được đánh giá cao.

---

Happy coding! 🚀

