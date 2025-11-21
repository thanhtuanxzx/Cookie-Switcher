// ========== CONFIGURATION ==========
// Cấu hình API URL tại đây
const API_BASE_URL = 'http://localhost:3000'; // Thay đổi URL này thành API URL của bạn

// ========== END CONFIGURATION ==========

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = `${url.protocol}//${url.hostname}`;

  // Hiển thị cookies hiện tại
  const cookieListEl = document.getElementById("cookie-list");
  const cookies = await chrome.cookies.getAll({ url: domain });

  cookieListEl.innerHTML = cookies.length
    ? cookies.map(c => `<div><strong>${c.name}</strong>: ${c.value}</div>`).join("")
    : "<i>Không có cookie nào.</i>";

  // ========== SHARED GROUP FUNCTIONS ==========
  let currentGroupId = null;
  const apiBaseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash

  // Load Group ID từ storage
  chrome.storage.local.get(['currentGroupId'], (result) => {
    if (result.currentGroupId) {
      currentGroupId = result.currentGroupId;
      document.getElementById('group-id').value = currentGroupId;
      updateGroupStatus('Đã tham gia: ' + currentGroupId);
      syncGroup();
    }
  });

  // Join Group
  document.getElementById('join-group').addEventListener('click', async () => {
    const groupId = document.getElementById('group-id').value.trim();
    if (!groupId) return alert('Vui lòng nhập Group ID');
    if (!apiBaseUrl) return alert('Vui lòng cấu hình API_BASE_URL trong code');

    currentGroupId = groupId;
    chrome.storage.local.set({ currentGroupId }, () => {
      updateGroupStatus('Đã tham gia: ' + groupId);
      syncGroup();
    });
  });

  // Leave Group
  document.getElementById('leave-group').addEventListener('click', () => {
    if (!currentGroupId) {
      return alert('Bạn chưa tham gia group nào');
    }
    if (confirm(`Bạn có chắc muốn rời khỏi group "${currentGroupId}"?`)) {
      const groupIdToRemove = currentGroupId;
      currentGroupId = null;
      // Xóa danh sách mySharedProfiles của group này
      chrome.storage.local.remove([`mySharedProfiles_${groupIdToRemove}`, 'currentGroupId'], async () => {
        document.getElementById('group-id').value = '';
        updateGroupStatus('Đã rời khỏi group');
        await renderSharedProfiles([]);
      });
    }
  });

  // Sync Group (Refresh Shared Profiles)
  document.getElementById('sync-group').addEventListener('click', () => {
    if (!currentGroupId) {
      return alert('Vui lòng tham gia group trước');
    }
    if (!apiBaseUrl) {
      return alert('Vui lòng cấu hình API_BASE_URL trong code');
    }
    syncGroup();
  });

  /**
   * Đồng bộ shared profiles từ server
   */
  async function syncGroup() {
    if (!currentGroupId || !apiBaseUrl) return;

    updateGroupStatus('Đang đồng bộ...');
    try {
      const response = await fetch(`${apiBaseUrl}/api/groups/${currentGroupId}`);
      const data = await response.json();

      if (data.profiles && data.profiles.length > 0) {
        await renderSharedProfiles(data.profiles);
        updateGroupStatus(`Đã đồng bộ ${data.profiles.length} profile(s)`);
      } else {
        await renderSharedProfiles([]);
        updateGroupStatus('Group chưa có profile nào');
      }
    } catch (error) {
      console.error('Sync error:', error);
      updateGroupStatus('Lỗi đồng bộ: ' + error.message);
      await renderSharedProfiles([]);
    }
  }

  /**
   * Render Shared Profiles (từ server)
   * Chỉ hiển thị nút Unshare cho profiles mà user đã share
   */
  async function renderSharedProfiles(profiles) {
    const container = document.getElementById('shared-profiles');
    container.innerHTML = '';

    if (!currentGroupId) {
      container.innerHTML = '<i style="font-size: 12px; color: #999;">Chưa tham gia group</i>';
      return;
    }

    if (profiles.length === 0) {
      container.innerHTML = '<i style="font-size: 12px; color: #999;">Chưa có profile nào trong group</i>';
      return;
    }

    // Lấy danh sách profiles mà user này đã share
    const mySharedKey = `mySharedProfiles_${currentGroupId}`;
    const result = await chrome.storage.local.get([mySharedKey]);
    const mySharedProfiles = result[mySharedKey] || [];

    profiles.forEach(profile => {
      const row = document.createElement('div');
      row.className = 'profile-row shared-profile-row';
      row.style.display = 'flex';
      row.style.gap = '6px';
      row.style.marginBottom = '6px';

      // Button Apply
      const btnApply = document.createElement('button');
      btnApply.textContent = '🌐 ' + profile.profileName;
      btnApply.className = 'profile-btn apply-btn';
      btnApply.style.flex = '1';

      btnApply.onclick = async () => {
        await applyCookies(profile.cookies, profile.profileName);
      };

      row.appendChild(btnApply);

      // Chỉ hiển thị nút Unshare nếu user này là người đã share profile này
      if (mySharedProfiles.includes(profile.profileName)) {
        const btnUnshare = document.createElement('button');
        btnUnshare.textContent = '🔒 Unshare';
        btnUnshare.className = 'unshare-btn';
        btnUnshare.style.flex = '0 0 80px';
        btnUnshare.title = 'Thu hồi chia sẻ profile này (chỉ người share mới có thể thu hồi)';

        btnUnshare.onclick = async () => {
          if (confirm(`Bạn có chắc muốn thu hồi chia sẻ profile "${profile.profileName}"?`)) {
            await unshareProfile(profile.profileName);
          }
        };

        row.appendChild(btnUnshare);
      }

      container.appendChild(row);
    });
  }

  /**
   * Share một local profile lên group
   */
  async function shareProfile(profileName) {
    if (!currentGroupId || !apiBaseUrl) {
      return alert('Vui lòng tham gia group trước khi chia sẻ');
    }

    // Lấy profile từ local storage
    const result = await chrome.storage.local.get([profileName]);
    if (!result[profileName]) {
      return alert('Không tìm thấy profile trong local storage');
    }

    const cookies = result[profileName];

    try {
      updateGroupStatus('Đang chia sẻ...');
      const response = await fetch(`${apiBaseUrl}/api/groups/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: currentGroupId,
          profileName: profileName,
          cookies: cookies
        })
      });

      const data = await response.json();
      if (data.success) {
        // Lưu profileName vào danh sách "mySharedProfiles" để track profiles mà user này đã share
        const mySharedKey = `mySharedProfiles_${currentGroupId}`;
        chrome.storage.local.get([mySharedKey], (result) => {
          const mySharedProfiles = result[mySharedKey] || [];
          if (!mySharedProfiles.includes(profileName)) {
            mySharedProfiles.push(profileName);
            chrome.storage.local.set({ [mySharedKey]: mySharedProfiles });
          }
        });

        updateGroupStatus('Đã chia sẻ thành công');
        // Refresh shared profiles
        await syncGroup();
        alert(`Đã chia sẻ profile "${profileName}" lên group`);
      } else {
        throw new Error(data.message || 'Lỗi khi chia sẻ');
      }
    } catch (error) {
      console.error('Share error:', error);
      updateGroupStatus('Lỗi chia sẻ: ' + error.message);
      alert('Lỗi khi chia sẻ: ' + error.message);
    }
  }

  /**
   * Unshare (thu hồi chia sẻ) một profile khỏi group
   */
  async function unshareProfile(profileName) {
    if (!currentGroupId || !apiBaseUrl) {
      return alert('Vui lòng tham gia group trước');
    }

    try {
      updateGroupStatus('Đang thu hồi chia sẻ...');
      const response = await fetch(`${apiBaseUrl}/api/groups/removeProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: currentGroupId,
          profileName: profileName
        })
      });

      const data = await response.json();
      if (data.success) {
        // Xóa profileName khỏi danh sách "mySharedProfiles"
        const mySharedKey = `mySharedProfiles_${currentGroupId}`;
        chrome.storage.local.get([mySharedKey], (result) => {
          const mySharedProfiles = result[mySharedKey] || [];
          const updatedList = mySharedProfiles.filter(name => name !== profileName);
          chrome.storage.local.set({ [mySharedKey]: updatedList });
        });

        updateGroupStatus('Đã thu hồi chia sẻ');
        // Refresh shared profiles
        await syncGroup();
        alert(`Đã thu hồi chia sẻ profile "${profileName}"`);
      } else {
        throw new Error(data.message || 'Lỗi khi thu hồi chia sẻ');
      }
    } catch (error) {
      console.error('Unshare error:', error);
      updateGroupStatus('Lỗi thu hồi: ' + error.message);
      alert('Lỗi khi thu hồi chia sẻ: ' + error.message);
    }
  }

  function updateGroupStatus(message) {
    document.getElementById('group-status').textContent = message;
  }

  // ========== END SHARED GROUP FUNCTIONS ==========

  // ========== LOCAL PROFILES FUNCTIONS ==========

  /**
   * Lưu profile local (KHÔNG tự động share)
   */
  document.getElementById("save-profile").addEventListener("click", async () => {
    const name = document.getElementById("profile-name").value.trim();
    if (!name) return alert("Vui lòng nhập tên tài khoản");
    
    // Lưu local ONLY - không auto sync
    chrome.storage.local.set({ [name]: cookies }, async () => {
      alert("Đã lưu cookie cho: " + name);
      document.getElementById("profile-name").value = '';
      renderLocalProfiles();
    });
  });

  /**
   * Render Local Profiles
   */
  function renderLocalProfiles() {
    const container = document.getElementById("local-profiles");
    container.innerHTML = "";

    chrome.storage.local.get(null, (profiles) => {
      // Filter out system keys (currentGroupId, etc.)
      const profileKeys = Object.keys(profiles).filter(key => 
        key !== 'currentGroupId' && Array.isArray(profiles[key])
      );

      if (profileKeys.length === 0) {
        container.innerHTML = '<i style="font-size: 12px; color: #999;">Chưa có profile local nào</i>';
        return;
      }

      profileKeys.forEach(profileName => {
        const savedCookies = profiles[profileName];
        const row = document.createElement("div");
        row.className = 'profile-row local-profile-row';
        row.style.display = "flex";
        row.style.gap = "6px";
        row.style.marginBottom = "6px";

        // Button Apply
        const btnApply = document.createElement("button");
        btnApply.textContent = "🔁 " + profileName;
        btnApply.className = "profile-btn apply-btn";
        btnApply.style.flex = "1";

        btnApply.onclick = async () => {
          await applyCookies(savedCookies, profileName);
        };

        // Button Share
        const btnShare = document.createElement("button");
        btnShare.textContent = "📤 Share";
        btnShare.className = "share-btn";
        btnShare.style.flex = "0 0 80px";
        btnShare.title = 'Chia sẻ profile này lên group';

        btnShare.onclick = async () => {
          await shareProfile(profileName);
        };

        // Button Delete
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "❌";
        btnDelete.className = "delete-btn";
        btnDelete.style.flex = "0 0 40px";
        btnDelete.title = 'Xóa profile này';

        btnDelete.onclick = () => {
          if (confirm(`Bạn có chắc muốn xóa tài khoản "${profileName}"?`)) {
            chrome.storage.local.remove(profileName, () => {
              renderLocalProfiles();
            });
          }
        };

        row.appendChild(btnApply);
        row.appendChild(btnShare);
        row.appendChild(btnDelete);
        container.appendChild(row);
      });
    });
  }

  /**
   * Apply cookies (dùng chung cho cả local và shared)
   */
  async function applyCookies(cookiesToApply, profileName) {
    try {
      // Xóa tất cả cookie hiện tại của domain
      const current = await chrome.cookies.getAll({ url: domain });
      await Promise.all(current.map(c => chrome.cookies.remove({ url: domain, name: c.name })));
      
      // Set cookie mới (sanitize)
      for (const c of cookiesToApply) {
        try {
          const { hostOnly, session, storeId, sameSite, id, expirationDate, ...sanitized } = c;
          if (expirationDate) sanitized.expirationDate = expirationDate;
          if (sameSite) sanitized.sameSite = sameSite;
          await chrome.cookies.set({ ...sanitized, url: domain });
        } catch (e) {
          console.warn(`Lỗi khi set cookie ${c.name}:`, e);
        }
      }
      alert("Đã chuyển sang tài khoản: " + profileName);
      chrome.tabs.reload(tab.id);
    } catch (error) {
      console.error('Apply cookies error:', error);
      alert('Lỗi khi áp dụng cookie: ' + error.message);
    }
  }

  // Load local profiles khi mở popup
  renderLocalProfiles();

  // ========== END LOCAL PROFILES FUNCTIONS ==========

  // ========== UTILITY FUNCTIONS ==========

  document.getElementById("clear-profiles").addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn xóa tất cả tài khoản đã lưu? (Group ID sẽ được giữ lại)")) {
      chrome.storage.local.get(['currentGroupId'], (result) => {
        chrome.storage.local.clear(() => {
          // Restore groupId
          if (result.currentGroupId) {
            chrome.storage.local.set({ currentGroupId: result.currentGroupId });
          }
          renderLocalProfiles();
          alert("Đã xóa tất cả tài khoản.");
        });
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

  // ========== END UTILITY FUNCTIONS ==========
});
