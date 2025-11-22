// ========== CONFIGURATION ==========
// Cấu hình API URL tại đây
const API_BASE_URL = 'https://cookie-switcher.vercel.app'; // Thay đổi URL này thành API URL của bạn

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

  // Load và render recent groups
  renderRecentGroups();

  // Join Group
  document.getElementById('join-group').addEventListener('click', async () => {
    const groupId = document.getElementById('group-id').value.trim();
    if (!groupId) return alert('Vui lòng nhập Group ID');
    if (!apiBaseUrl) return alert('Vui lòng cấu hình API_BASE_URL trong code');

    currentGroupId = groupId;
    // Lưu vào recent groups
    await addToRecentGroups(groupId);
    chrome.storage.local.set({ currentGroupId }, () => {
      updateGroupStatus('Đã tham gia: ' + groupId);
      syncGroup();
      renderRecentGroups();
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

  /**
   * Thêm group vào danh sách recent groups
   */
  async function addToRecentGroups(groupId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['recentGroups'], (result) => {
        let recentGroups = result.recentGroups || [];
        
        // Xóa group nếu đã tồn tại (để tránh trùng lặp)
        recentGroups = recentGroups.filter(g => g.id !== groupId);
        
        // Thêm group mới vào đầu danh sách
        recentGroups.unshift({
          id: groupId,
          joinedAt: Date.now()
        });
        
        // Chỉ giữ lại 10 group gần đây nhất
        recentGroups = recentGroups.slice(0, 10);
        
        chrome.storage.local.set({ recentGroups }, () => {
          resolve();
        });
      });
    });
  }

  /**
   * Render danh sách 3 group gần đây nhất
   */
  function renderRecentGroups() {
    const container = document.getElementById('recent-groups');
    container.innerHTML = '';

    chrome.storage.local.get(['recentGroups', 'currentGroupId'], (result) => {
      const recentGroups = result.recentGroups || [];
      const currentGroup = result.currentGroupId;
      
      // Lọc bỏ group hiện tại và chỉ lấy 3 group gần đây nhất
      const displayGroups = recentGroups
        .filter(g => g.id !== currentGroup)
        .slice(0, 3);

      if (displayGroups.length === 0) {
        container.innerHTML = '<i style="font-size: 12px; color: #999;">Chưa có group nào</i>';
        return;
      }

      displayGroups.forEach(group => {
        const item = document.createElement('div');
        item.className = 'recent-group-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'group-name';
        nameSpan.textContent = group.id;
        nameSpan.title = group.id; // Tooltip để xem full name
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'group-time';
        timeSpan.textContent = formatTimeAgo(group.joinedAt);
        
        item.appendChild(nameSpan);
        item.appendChild(timeSpan);
        
        // Click để tham gia lại group
        item.onclick = () => {
          document.getElementById('group-id').value = group.id;
          // Trigger join group
          document.getElementById('join-group').click();
        };
        
        container.appendChild(item);
      });
    });
  }

  /**
   * Format thời gian thành "X phút trước", "X giờ trước", etc.
   */
  function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
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
   * - Nếu domain cookies giống domain hiện tại: apply vào tab hiện tại và reload
   * - Nếu domain cookies khác domain hiện tại: mở tab mới, apply cookies, và reload tab mới
   */
  async function applyCookies(cookiesToApply, profileName) {
    try {
      if (!cookiesToApply || cookiesToApply.length === 0) {
        return alert('Không có cookies để áp dụng');
      }

      // Xác định domain của cookies từ cookie đầu tiên
      const firstCookie = cookiesToApply[0];
      let cookieDomain = firstCookie.domain;
      
      // Normalize domain: loại bỏ dấu chấm đầu nếu có (ví dụ: ".example.com" -> "example.com")
      if (cookieDomain.startsWith('.')) {
        cookieDomain = cookieDomain.substring(1);
      }

      // Tạo URL từ domain (giả định https)
      const cookieUrl = `https://${cookieDomain}`;
      const cookieHostname = cookieDomain.toLowerCase();

      // Lấy domain hiện tại từ tab
      const currentHostname = url.hostname.toLowerCase();

      // Hàm helper để lấy base domain (loại bỏ subdomain)
      // Ví dụ: "www.facebook.com" -> "facebook.com", "facebook.com" -> "facebook.com"
      function getBaseDomain(hostname) {
        const parts = hostname.split('.');
        // Nếu có ít nhất 2 phần, lấy 2 phần cuối (ví dụ: "facebook.com")
        // Nếu có nhiều hơn 2 phần, có thể là subdomain (ví dụ: "www.facebook.com" -> "facebook.com")
        if (parts.length >= 2) {
          return parts.slice(-2).join('.');
        }
        return hostname;
      }

      const cookieBaseDomain = getBaseDomain(cookieHostname);
      const currentBaseDomain = getBaseDomain(currentHostname);

      // So sánh base domain: nếu base domain giống nhau thì coi là cùng domain
      // Ví dụ: "www.facebook.com" và "facebook.com" đều có base domain là "facebook.com"
      const isSameDomain = cookieBaseDomain === currentBaseDomain;

      let targetTab = tab;
      let targetDomain = domain;

      if (isSameDomain) {
        // Ví dụ 1: Domain giống nhau - Apply vào tab hiện tại
        targetTab = tab;
        targetDomain = domain;
      } else {
        // Ví dụ 2: Domain khác nhau - Mở tab mới
        const newTab = await chrome.tabs.create({ url: cookieUrl, active: true });
        targetTab = newTab;
        targetDomain = cookieUrl;
        
        // Đợi tab mới load xong và navigate đến URL đúng trước khi apply cookies
        await new Promise((resolve) => {
          const listener = (tabId, changeInfo, tabInfo) => {
            if (tabId === newTab.id) {
              // Kiểm tra xem tab đã navigate đến URL đúng chưa
              if (changeInfo.status === 'complete' && tabInfo.url && 
                  (tabInfo.url.startsWith('https://') || tabInfo.url.startsWith('http://'))) {
                // Đợi thêm một chút để đảm bảo trang đã load hoàn toàn
                setTimeout(() => {
                  chrome.tabs.onUpdated.removeListener(listener);
                  resolve();
                }, 500);
                return;
              }
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
          
          // Timeout sau 5 giây nếu tab không load
          setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }, 5000);
        });
      }

      // Xóa tất cả cookie hiện tại của target domain
      const currentCookies = await chrome.cookies.getAll({ url: targetDomain });
      await Promise.all(currentCookies.map(c => 
        chrome.cookies.remove({ url: targetDomain, name: c.name })
      ));
      
      // Set cookie mới (sanitize)
      for (const c of cookiesToApply) {
        try {
          const { hostOnly, session, storeId, sameSite, id, expirationDate, ...sanitized } = c;
          if (expirationDate) sanitized.expirationDate = expirationDate;
          if (sameSite) sanitized.sameSite = sameSite;
          await chrome.cookies.set({ ...sanitized, url: targetDomain });
        } catch (e) {
          console.warn(`Lỗi khi set cookie ${c.name}:`, e);
        }
      }

      alert("Đã chuyển sang tài khoản: " + profileName);
      
      // Reload tab (tab hiện tại hoặc tab mới)
      chrome.tabs.reload(targetTab.id);
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
