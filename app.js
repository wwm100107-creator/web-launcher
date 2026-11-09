/**
 * My Tools Launcher — Minimalist & Smart Logo Resolver
 */

const STORAGE_KEY = "my_launcher_tools_v3";

// Cấu hình mặc định với logo SVG gốc của từng trang web
const DEFAULT_TOOLS = [
  {
    id: "tool-office-info-editor",
    name: "UyOffice Info",
    url: "https://office-info-editor.vercel.app/",
    icon: "https://office-info-editor.vercel.app/logo.svg",
    desc: "Công cụ chỉnh sửa và quản lý thông tin văn phòng trực tuyến"
  },
  {
    id: "tool-universal-converter",
    name: "UyConvert Pro",
    url: "https://universal-converter-liard.vercel.app/",
    icon: "https://universal-converter-liard.vercel.app/favicon.svg",
    desc: "Chuyển đổi định dạng đuôi của ảnh, video, file,..."
  }
];

let tools = [];
let searchQuery = "";

// Initialize
function init() {
  loadTools();
  setupEvents();
  render();
}

function loadTools() {
  try {
    // Check v3 or migrate from previous v2
    const savedV3 = localStorage.getItem(STORAGE_KEY);
    const savedV2 = localStorage.getItem("my_launcher_tools_v2");
    const raw = savedV3 || savedV2;

    tools = raw ? JSON.parse(raw) : DEFAULT_TOOLS;

    // Tự động cập nhật logo gốc chuẩn cho các web hiện có
    tools.forEach(t => {
      const url = (t.url || "").toLowerCase();
      if (url.includes("office-info-editor.vercel.app")) {
        t.name = t.name || "UyOffice Info";
        t.icon = "https://office-info-editor.vercel.app/logo.svg";
      } else if (url.includes("universal-converter-liard.vercel.app") || url.includes("universal-converter")) {
        t.name = t.name || "UyConvert Pro";
        t.icon = "https://universal-converter-liard.vercel.app/favicon.svg";
      }
    });

    // Lưu lại v3
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch (e) {
    tools = DEFAULT_TOOLS;
  }
}

function saveTools() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  render();
}

// Lấy danh sách các đường dẫn logo tiềm năng (thử lần lượt, tuyệt đối không dùng Google s2 hình mặt trăng)
function getIconCandidates(tool) {
  const candidates = [];
  if (tool.icon && tool.icon.trim() !== "") {
    candidates.push(tool.icon.trim());
  }

  try {
    const parsed = new URL(tool.url);
    const origin = parsed.origin;

    // Đoán các link logo thường gặp trên web hiện đại
    const commonPaths = [
      `${origin}/logo.svg`,
      `${origin}/favicon.svg`,
      `${origin}/icon.svg`,
      `${origin}/favicon.ico`,
      `${origin}/apple-touch-icon.png`
    ];

    commonPaths.forEach(p => {
      if (!candidates.includes(p)) {
        candidates.push(p);
      }
    });
  } catch (e) {}

  return candidates;
}

function formatDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.port ? `:${parsed.port}` : "");
  } catch (e) {
    return url;
  }
}

// Xử lý khi ảnh logo tải thất bại -> tự động thử đường dẫn tiếp theo, nếu hết thì hiện chữ cái đại diện đẹp mắt
window.handleIconError = function(img, candidatesJson, toolName) {
  let candidates = [];
  try {
    candidates = JSON.parse(decodeURIComponent(candidatesJson));
  } catch (e) {}

  const currentIdx = parseInt(img.dataset.idx || "0", 10);
  const nextIdx = currentIdx + 1;

  if (candidates && nextIdx < candidates.length) {
    img.dataset.idx = nextIdx;
    img.src = candidates[nextIdx];
  } else {
    // Nếu tất cả các link đều không có ảnh: Hiển thị avatar chữ cái gradient chuyên nghiệp
    const initial = (toolName || "T").trim().charAt(0).toUpperCase();
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
          ${initial}
        </div>
      `;
    }
  }
};

function render() {
  const toolsGrid = document.getElementById("toolsGrid");
  const emptyState = document.getElementById("emptyState");
  const countText = document.getElementById("toolsCountText");

  const q = searchQuery.toLowerCase().trim();
  const filtered = tools.filter(t => {
    if (!q) return true;
    return (t.name || "").toLowerCase().includes(q) ||
           (t.url || "").toLowerCase().includes(q) ||
           (t.desc || "").toLowerCase().includes(q);
  });

  countText.innerText = `${filtered.length} Tool${filtered.length > 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    toolsGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    refreshIcons();
    return;
  }

  toolsGrid.classList.remove("hidden");
  emptyState.classList.add("hidden");

  toolsGrid.innerHTML = filtered.map(tool => {
    const candidates = getIconCandidates(tool);
    const initialSrc = candidates.length > 0 ? candidates[0] : "";
    const candidatesAttr = encodeURIComponent(JSON.stringify(candidates));
    const domain = formatDomain(tool.url);

    return `
      <div class="tool-card group relative bg-[#161b22] hover:bg-[#1c2128] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg">
        <div>
          <!-- Header Card: Icon, Title, Actions -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                ${
                  initialSrc
                    ? `<img src="${initialSrc}" alt="${tool.name}" class="w-full h-full object-contain rounded-lg" data-idx="0" onerror="handleIconError(this, '${candidatesAttr}', '${tool.name.replace(/'/g, "\\'")}')">`
                    : `
                      <div class="w-full h-full rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        ${(tool.name || "T").charAt(0).toUpperCase()}
                      </div>
                    `
                }
              </div>
              <div class="min-w-0">
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-sm text-slate-100 hover:text-blue-400 truncate block transition" title="${tool.name}">
                  ${tool.name}
                </a>
                <span class="text-[11px] text-slate-400 font-mono truncate block" title="${tool.url}">
                  ${domain}
                </span>
              </div>
            </div>

            <!-- Edit & Delete buttons (shown on hover) -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onclick="editTool('${tool.id}')" title="Chỉnh sửa" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="deleteTool('${tool.id}')" title="Xóa tool" class="p-1 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed min-h-[1.5rem]">
            ${tool.desc || '<span class="italic text-slate-600">Không có ghi chú</span>'}
          </p>
        </div>

        <!-- Open button link -->
        <div class="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
          <button onclick="copyLink('${tool.url}')" class="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition">
            <i data-lucide="copy" class="w-3 h-3"></i> Copy link
          </button>
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-medium transition flex items-center gap-1.5">
            <span>Mở web</span>
            <i data-lucide="external-link" class="w-3 h-3"></i>
          </a>
        </div>
      </div>
    `;
  }).join("");

  refreshIcons();
}

// Copy link
window.copyLink = function(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert("Đã sao chép đường link vào bộ nhớ đệm!");
  });
};

// Delete tool
window.deleteTool = function(id) {
  if (confirm("Bạn có chắc muốn xóa tool này khỏi launcher?")) {
    tools = tools.filter(t => t.id !== id);
    saveTools();
  }
};

// Edit tool
window.editTool = function(id) {
  const tool = tools.find(t => t.id === id);
  if (!tool) return;

  document.getElementById("modalTitle").innerText = "Chỉnh sửa Tool";
  document.getElementById("toolId").value = tool.id;
  document.getElementById("toolName").value = tool.name;
  document.getElementById("toolUrl").value = tool.url;
  document.getElementById("toolIcon").value = tool.icon || "";
  document.getElementById("toolDesc").value = tool.desc || "";

  document.getElementById("toolModal").classList.remove("hidden");
};

function setupEvents() {
  // Search
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    render();
  });

  // Open Add Modal
  const modal = document.getElementById("toolModal");
  document.getElementById("openAddModalBtn").addEventListener("click", () => {
    document.getElementById("modalTitle").innerText = "Thêm Tool Mới";
    document.getElementById("toolId").value = "";
    document.getElementById("toolName").value = "";
    document.getElementById("toolUrl").value = "";
    document.getElementById("toolIcon").value = "";
    document.getElementById("toolDesc").value = "";
    modal.classList.remove("hidden");
    document.getElementById("toolName").focus();
  });

  // Button tự động tìm Logo trong modal
  document.getElementById("detectLogoBtn").addEventListener("click", () => {
    const urlInput = document.getElementById("toolUrl");
    const iconInput = document.getElementById("toolIcon");
    const rawUrl = urlInput.value.trim();

    if (!rawUrl) {
      alert("Vui lòng nhập đường dẫn URL trước khi tìm logo!");
      urlInput.focus();
      return;
    }

    try {
      const u = new URL(rawUrl);
      if (rawUrl.includes("office-info-editor")) {
        iconInput.value = `${u.origin}/logo.svg`;
      } else if (rawUrl.includes("universal-converter")) {
        iconInput.value = `${u.origin}/favicon.svg`;
      } else {
        iconInput.value = `${u.origin}/logo.svg`;
      }
    } catch (e) {
      alert("Đường dẫn URL không hợp lệ!");
    }
  });

  // Close Modal
  const closeModal = () => modal.classList.add("hidden");
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("cancelModalBtn").addEventListener("click", closeModal);

  // Form Submit
  document.getElementById("toolForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("toolId").value;
    const name = document.getElementById("toolName").value.trim();
    const url = document.getElementById("toolUrl").value.trim();
    const icon = document.getElementById("toolIcon").value.trim();
    const desc = document.getElementById("toolDesc").value.trim();

    if (!name || !url) return;

    if (id) {
      // Update
      const tool = tools.find(t => t.id === id);
      if (tool) {
        tool.name = name;
        tool.url = url;
        tool.icon = icon;
        tool.desc = desc;
      }
    } else {
      // Add new
      tools.push({
        id: "tool-" + Date.now(),
        name,
        url,
        icon,
        desc
      });
    }

    saveTools();
    closeModal();
  });

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", init);
