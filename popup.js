document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = `${url.protocol}//${url.hostname}`;

  const cookieListEl = document.getElementById("cookie-list");
  const cookies = await chrome.cookies.getAll({ url: domain });

  cookieListEl.innerHTML = cookies.length
    ? cookies.map(c => `<div><strong>${c.name}</strong>: ${c.value}</div>`).join("")
    : "<i>Không có cookie nào.</i>";

  document.getElementById("save-profile").addEventListener("click", () => {
    const name = document.getElementById("profile-name").value.trim();
    if (!name) return alert("Vui lòng nhập tên tài khoản");
    chrome.storage.local.set({ [name]: cookies }, () => {
      alert("Đã lưu cookie cho: " + name);
      loadProfiles();
    });
  });

  function loadProfiles() {
    const container = document.getElementById("profile-buttons");
    container.innerHTML = "";
    chrome.storage.local.get(null, (profiles) => {
      Object.entries(profiles).forEach(([name, savedCookies]) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.gap = "6px";
        row.style.marginBottom = "6px";

        const btnSwitch = document.createElement("button");
        btnSwitch.textContent = "🔁 " + name;
        btnSwitch.className = "profile-btn";
        btnSwitch.style.flex = "1";

        btnSwitch.onclick = async () => {
          const current = await chrome.cookies.getAll({ url: domain });
          await Promise.all(current.map(c => chrome.cookies.remove({ url: domain, name: c.name })));
          for (const c of savedCookies) {
            try {
              const { hostOnly, session, storeId, sameSite, id, expirationDate, ...sanitized } = c;
              if (expirationDate) sanitized.expirationDate = expirationDate;
              if (sameSite) sanitized.sameSite = sameSite;
              await chrome.cookies.set({ ...sanitized, url: domain });
            } catch (e) {
              console.warn(`Lỗi khi set cookie ${c.name}:`, e);
            }
          }
          alert("Đã chuyển sang tài khoản: " + name);
          chrome.tabs.reload(tab.id);
        };

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "❌";
        btnDelete.className = "delete-btn";
        btnDelete.style.flex = "0 0 40px";
        btnDelete.onclick = () => {
          if (confirm(`Bạn có chắc muốn xóa tài khoản "${name}"?`)) {
            chrome.storage.local.remove(name, () => {
              loadProfiles();
            });
          }
        };

        row.appendChild(btnSwitch);
        row.appendChild(btnDelete);
        container.appendChild(row);
      });
    });
  }

  loadProfiles();

  document.getElementById("clear-profiles").addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn xóa tất cả tài khoản đã lưu?")) {
      chrome.storage.local.clear(() => {
        loadProfiles();
        alert("Đã xóa tất cả tài khoản.");
      });
    }
  });

  document.getElementById("export-cookies").addEventListener("click", async () => {
    const cookies = await chrome.cookies.getAll({ url: domain });
    const blob = new Blob([JSON.stringify(cookies, null, 2)], { type: "application/json" });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "cookies.json";
    a.click();
  });

  document.getElementById("import-cookies").addEventListener("click", () => {
    const fileInput = document.getElementById("import-file");
    if (!fileInput.files.length) return alert("Chọn file JSON trước đã.");

    const reader = new FileReader();
    reader.onload = async (e) => {
      let importedCookies;
      try {
        importedCookies = JSON.parse(e.target.result);
      } catch (err) {
        return alert("Không thể đọc file JSON.");
      }

      const existing = await chrome.cookies.getAll({ url: domain });
      for (const c of existing) {
        await chrome.cookies.remove({ url: domain, name: c.name });
      }

      for (const c of importedCookies) {
        try {
          const { hostOnly, session, storeId, sameSite, id, expirationDate, ...sanitized } = c;
          if (expirationDate) sanitized.expirationDate = expirationDate;
          if (sameSite) sanitized.sameSite = sameSite;
          await chrome.cookies.set({ ...sanitized, url: domain });
        } catch (e) {
          console.warn(`Không thể set cookie ${c.name}:`, e);
        }
      }

      alert("Đã nhập cookie thành công. Trang sẽ được tải lại.");
      chrome.tabs.reload(tab.id);
    };

    reader.readAsText(fileInput.files[0]);
  });
});
