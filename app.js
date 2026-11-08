/**
 * DevLaunch — Personal Web & Tool Launcher
 * Pure JavaScript, no dependencies required
 */

// Default Seed Data
const DEFAULT_CATEGORIES = [
  "Tất cả",
  "AI & Trợ lý",
  "Dev & Localhost",
  "Dự án Khách hàng",
  "Utilities & Tools",
  "Quản trị & Server"
];

const DEFAULT_TOOLS = [
  {
    id: "tool-office-editor",
    name: "Office Info Editor",
    url: "https://office-info-editor.vercel.app/",
    category: "Utilities & Tools",
    env: "prod",
    desc: "Công cụ chỉnh sửa và quản lý thông tin văn phòng trực tuyến",
    icon: "",
    pinned: true,
    createdAt: Date.now()
  },
  {
    id: "tool-1",
    name: "Local Web App (Dev)",
    url: "http://localhost:3000",
    category: "Dev & Localhost",
    env: "localhost",
    desc: "Frontend React/Next.js đang code dở tại máy",
    icon: "",
    pinned: true,
    createdAt: Date.now() - 100000
  },
  {
    id: "tool-2",
    name: "Backend API Server",
    url: "http://localhost:8000/docs",
    category: "Dev & Localhost",
    env: "localhost",
    desc: "FastAPI Swagger Documentation & Endpoints test",
    icon: "",
    pinned: true,
    createdAt: Date.now() - 90000
  },
  {
    id: "tool-3",
    name: "Claude AI",
    url: "https://claude.ai",
    category: "AI & Trợ lý",
    env: "prod",
    desc: "Trợ lý AI hỗ trợ code, refactor và review kiến trúc",
    icon: "",
    pinned: true,
    createdAt: Date.now() - 80000
  },
  {
    id: "tool-4",
    name: "ChatGPT OpenAI",
    url: "https://chatgpt.com",
    category: "AI & Trợ lý",
    env: "prod",
    desc: "Mô hình ngôn ngữ lớn cho brainstorming & dịch thuật",
    icon: "",
    pinned: false,
    createdAt: Date.now() - 70000
  },
  {
    id: "tool-5",
    name: "Database Admin (phpMyAdmin / pgAdmin)",
    url: "http://localhost:8080",
    category: "Quản trị & Server",
    env: "localhost",
    desc: "Giao diện quản lý cơ sở dữ liệu nội bộ",
    icon: "",
    pinned: false,
    createdAt: Date.now() - 60000
  },
  {
    id: "tool-6",
    name: "GitHub Repositories",
    url: "https://github.com",
    category: "Utilities & Tools",
    env: "prod",
    desc: "Mã nguồn các dự án cá nhân & công ty",
    icon: "",
    pinned: false,
    createdAt: Date.now() - 50000
  },
  {
    id: "tool-7",
    name: "Vercel Dashboard",
    url: "https://vercel.com/dashboard",
    category: "Quản trị & Server",
    env: "prod",
    desc: "Quản lý deploy và serverless functions",
    icon: "",
    pinned: false,
    createdAt: Date.now() - 40000
  }
];

// App State
let state = {
  tools: [],
  categories: [],
  selectedCategory: "Tất cả",
  selectedEnv: "all",
  searchQuery: "",
  paletteIndex: 0
};

// LocalStorage Keys
const STORAGE_KEYS = {
  TOOLS: "devlaunch_tools",
  CATEGORIES: "devlaunch_categories"
};

// Initialize State
function init() {
  loadData();
  setupEventListeners();
  renderAll();
}

function loadData() {
  try {
    const savedTools = localStorage.getItem(STORAGE_KEYS.TOOLS);
    state.tools = savedTools ? JSON.parse(savedTools) : DEFAULT_TOOLS;

    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    state.categories = savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;

    // Ensure 'Tất cả' is always first
    if (!state.categories.includes("Tất cả")) {
      state.categories.unshift("Tất cả");
    }
  } catch (e) {
    console.error("Lỗi khi đọc localStorage:", e);
    state.tools = DEFAULT_TOOLS;
    state.categories = DEFAULT_CATEGORIES;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(state.tools));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(state.categories));
  renderAll();
}

// Favicon Helper
function getFaviconUrl(url, customIcon) {
  if (customIcon && customIcon.trim() !== "") {
    return customIcon.trim();
  }
  try {
    const parsed = new URL(url);
    // If localhost, fallback to default icon
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return null;
    }
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch (err) {
    return null;
  }
}

// Format Domain for Subtitle
function formatUrlDomain(url) {
  try {
    const parsed = new URL(url);
    if (parsed.port) {
      return `${parsed.hostname}:${parsed.port}`;
    }
    return parsed.hostname;
  } catch (e) {
    return url;
  }
}

// Env Badge Styles
function getEnvBadge(env) {
  const envMap = {
    localhost: { label: "Local", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    prod: { label: "Prod", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    staging: { label: "Staging", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    dev: { label: "Dev", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    internal: { label: "Internal", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
  };
  const config = envMap[env] || { label: env || "Link", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return `<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.bg}">${config.label}</span>`;
}

// Main Render Function
function renderAll() {
  renderCategoriesBar();
  renderTools();
  updateStats();
  refreshIcons();
}

function updateStats() {
  const total = state.tools.length;
  document.getElementById("totalToolsBadge").innerText = `${total} tool${total > 1 ? 's' : ''}`;
}

// Render Categories
function renderCategoriesBar() {
  const bar = document.getElementById("categoriesBar");
  bar.innerHTML = "";

  state.categories.forEach(cat => {
    const btn = document.createElement("button");
    const isActive = state.selectedCategory === cat;
    btn.className = `category-pill whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
      isActive
        ? "active bg-blue-600/15 border-blue-500/50 text-blue-400"
        : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
    }`;

    // Count for category
    const count = cat === "Tất cả" 
      ? state.tools.length 
      : state.tools.filter(t => t.category === cat).length;

    btn.innerHTML = `<span>${cat}</span> <span class="text-[10px] opacity-60 ml-1">(${count})</span>`;
    btn.onclick = () => {
      state.selectedCategory = cat;
      renderAll();
    };
    bar.appendChild(btn);
  });
}

// Filter Logic
function getFilteredTools() {
  return state.tools.filter(tool => {
    // Category match
    const matchCat = state.selectedCategory === "Tất cả" || tool.category === state.selectedCategory;

    // Environment match
    const matchEnv = state.selectedEnv === "all" || tool.env === state.selectedEnv;

    // Search query match
    const query = state.searchQuery.toLowerCase().trim();
    let matchQuery = true;
    if (query !== "") {
      const name = (tool.name || "").toLowerCase();
      const url = (tool.url || "").toLowerCase();
      const desc = (tool.desc || "").toLowerCase();
      const cat = (tool.category || "").toLowerCase();
      matchQuery = name.includes(query) || url.includes(query) || desc.includes(query) || cat.includes(query);
    }

    return matchCat && matchEnv && matchQuery;
  });
}

// Render Tools Grid
function renderTools() {
  const filtered = getFilteredTools();
  const pinnedList = filtered.filter(t => t.pinned);
  const normalList = filtered.filter(t => !t.pinned);

  const pinnedSection = document.getElementById("pinnedSection");
  const pinnedGrid = document.getElementById("pinnedGrid");
  const toolsGrid = document.getElementById("toolsGrid");
  const emptyState = document.getElementById("emptyState");
  const visibleCountText = document.getElementById("visibleCountText");
  const filterStatusAlert = document.getElementById("filterStatusAlert");
  const filterStatusText = document.getElementById("filterStatusText");

  // Show/hide filter alert
  const hasFilter = state.selectedCategory !== "Tất cả" || state.selectedEnv !== "all" || state.searchQuery !== "";
  if (hasFilter) {
    filterStatusAlert.classList.remove("hidden");
    filterStatusText.innerText = `Đang lọc: ${state.selectedCategory !== "Tất cả" ? state.selectedCategory : ""} ${state.selectedEnv !== "all" ? `• Môi trường: ${state.selectedEnv}` : ""} ${state.searchQuery ? `• Từ khóa: "${state.searchQuery}"` : ""}`;
  } else {
    filterStatusAlert.classList.add("hidden");
  }

  visibleCountText.innerText = `${filtered.length} mục`;

  // Handle Empty State
  if (filtered.length === 0) {
    pinnedSection.classList.add("hidden");
    toolsGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  } else {
    toolsGrid.classList.remove("hidden");
    emptyState.classList.add("hidden");
  }

  // Pinned Section
  if (pinnedList.length > 0) {
    pinnedSection.classList.remove("hidden");
    pinnedGrid.innerHTML = pinnedList.map(tool => createToolCardHtml(tool)).join("");
  } else {
    pinnedSection.classList.add("hidden");
  }

  // Normal List
  toolsGrid.innerHTML = normalList.map(tool => createToolCardHtml(tool)).join("");
}

// Create Tool Card HTML
function createToolCardHtml(tool) {
  const favicon = getFaviconUrl(tool.url, tool.icon);
  const domain = formatUrlDomain(tool.url);

  // Fallback icon container
  const iconMarkup = favicon
    ? `<img src="${favicon}" alt="${tool.name}" class="w-7 h-7 rounded-lg object-contain" onerror="this.onerror=null; this.parentElement.innerHTML='<i data-lucide=&quot;globe&quot; class=&quot;w-5 h-5 text-blue-400&quot;></i>'; lucide.createIcons();">`
    : `<div class="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs"><i data-lucide="${tool.env === 'localhost' ? 'terminal' : 'globe'}" class="w-4 h-4"></i></div>`;

  return `
    <div class="tool-card group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-sm">
      <!-- Card Top: Icon, Title, Actions -->
      <div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-1.5 shadow-sm group-hover:border-blue-500/30 transition">
              ${iconMarkup}
            </div>
            <div class="min-w-0 flex-1">
              <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-sm text-slate-100 hover:text-blue-400 truncate block transition" title="${tool.name}">
                ${tool.name}
              </a>
              <span class="text-[11px] text-slate-400 font-mono truncate block" title="${tool.url}">
                ${domain}
              </span>
            </div>
          </div>

          <!-- Quick Action Buttons on Card -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="togglePin('${tool.id}')" title="${tool.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition">
              <i data-lucide="pin" class="w-3.5 h-3.5 ${tool.pinned ? 'fill-amber-400 text-amber-400' : ''}"></i>
            </button>
            <button onclick="openEditModal('${tool.id}')" title="Sửa tool" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed min-h-[2rem]">
          ${tool.desc || '<span class="italic text-slate-600">Không có mô tả</span>'}
        </p>
      </div>

      <!-- Card Bottom: Tags & Open Button -->
      <div class="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 overflow-hidden">
          ${getEnvBadge(tool.env)}
          <span class="text-[10px] text-slate-500 truncate max-w-[90px] bg-slate-950/40 px-2 py-0.5 rounded-full border border-slate-800/80">
            ${tool.category}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button onclick="copyToClipboard('${tool.url}')" title="Sao chép link" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
          </button>
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition flex items-center justify-center" title="Mở trang web">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Toggle Pin
window.togglePin = function(id) {
  const tool = state.tools.find(t => t.id === id);
  if (tool) {
    tool.pinned = !tool.pinned;
    saveData();
    showToast(tool.pinned ? "Đã ghim tool lên đầu trang" : "Đã bỏ ghim tool");
  }
};

// Copy link to clipboard
window.copyToClipboard = function(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast("Đã sao chép link URL vào bộ nhớ đệm!");
  }).catch(() => {
    showToast("Không thể sao chép link", true);
  });
};

// Toast notification helper
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMsg");
  const iconEl = document.getElementById("toastIcon");

  msgEl.innerText = message;
  if (isError) {
    iconEl.setAttribute("data-lucide", "alert-circle");
    iconEl.className = "w-4 h-4 text-rose-400";
  } else {
    iconEl.setAttribute("data-lucide", "check-circle");
    iconEl.className = "w-4 h-4 text-emerald-400";
  }
  refreshIcons();

  toast.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-3", "pointer-events-none");
  }, 2500);
}

// Refresh Lucide Icons
function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==================== EVENT LISTENERS & MODALS ====================

function setupEventListeners() {
  // Environment filter buttons
  document.querySelectorAll(".env-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".env-pill").forEach(b => b.classList.remove("active-env"));
      btn.classList.add("active-env");
      state.selectedEnv = btn.dataset.env;
      renderAll();
    });
  });

  // Clear filters button
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    state.selectedCategory = "Tất cả";
    state.selectedEnv = "all";
    state.searchQuery = "";
    document.querySelectorAll(".env-pill").forEach(b => {
      if (b.dataset.env === "all") b.classList.add("active-env");
      else b.classList.remove("active-env");
    });
    renderAll();
  });

  // Search Palette triggers
  const openPalette = () => {
    document.getElementById("commandPaletteModal").classList.remove("hidden");
    const input = document.getElementById("paletteSearchInput");
    input.value = "";
    input.focus();
    renderPaletteResults("");
  };

  document.getElementById("searchBarBtn").addEventListener("click", openPalette);
  document.getElementById("mobileSearchBtn").addEventListener("click", openPalette);
  document.getElementById("closePaletteBtn").addEventListener("click", () => {
    document.getElementById("commandPaletteModal").classList.add("hidden");
  });

  // Global Keyboard shortcuts (Ctrl+K, Esc, Alt+N)
  window.addEventListener("keydown", (e) => {
    // Ctrl + K or Cmd + K or '/' (when not typing in an input)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette();
    } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openPalette();
    } else if (e.key === "Escape") {
      closeAllModals();
    } else if (e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      openAddModal();
    }
  });

  // Command palette search input
  const paletteInput = document.getElementById("paletteSearchInput");
  paletteInput.addEventListener("input", (e) => {
    renderPaletteResults(e.target.value);
  });

  paletteInput.addEventListener("keydown", (e) => {
    const items = document.querySelectorAll(".palette-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.paletteIndex = (state.paletteIndex + 1) % items.length;
      updatePaletteSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.paletteIndex = (state.paletteIndex - 1 + items.length) % items.length;
      updatePaletteSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[state.paletteIndex]) {
        items[state.paletteIndex].click();
      }
    }
  });

  // Add Tool Modal triggers
  document.getElementById("openAddModalBtn").addEventListener("click", openAddModal);
  document.getElementById("emptyAddBtn").addEventListener("click", openAddModal);
  document.getElementById("closeToolFormBtn").addEventListener("click", closeToolFormModal);
  document.getElementById("cancelToolFormBtn").addEventListener("click", closeToolFormModal);

  // Form submit
  document.getElementById("toolForm").addEventListener("submit", handleToolFormSubmit);

  // Delete tool button in form
  document.getElementById("deleteToolBtn").addEventListener("click", () => {
    const id = document.getElementById("toolFormId").value;
    if (id && confirm("Bạn có chắc chắn muốn xóa tool này khỏi danh sách?")) {
      state.tools = state.tools.filter(t => t.id !== id);
      saveData();
      closeToolFormModal();
      showToast("Đã xóa tool thành công");
    }
  });

  // Category Manager Modal
  document.getElementById("openCategoryModalBtn").addEventListener("click", openCategoryModal);
  document.getElementById("closeCategoryModalBtn").addEventListener("click", closeCategoryModal);
  document.getElementById("addCategoryBtn").addEventListener("click", handleAddCategory);

  // Data Menu dropdown
  const dataMenuBtn = document.getElementById("dataMenuBtn");
  const dataMenuDropdown = document.getElementById("dataMenuDropdown");
  dataMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dataMenuDropdown.classList.toggle("hidden");
  });

  window.addEventListener("click", () => {
    dataMenuDropdown.classList.add("hidden");
  });

  // Export JSON
  document.getElementById("exportJsonBtn").addEventListener("click", exportDataToJson);

  // Import JSON trigger
  const importInput = document.getElementById("importJsonInput");
  document.getElementById("importJsonBtnTrigger").addEventListener("click", () => {
    importInput.click();
  });
  importInput.addEventListener("change", importDataFromJson);

  // Reset to Defaults
  document.getElementById("resetDefaultsBtn").addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn khôi phục về danh sách mẫu mặc định? Dữ liệu hiện tại sẽ được ghi đè.")) {
      state.tools = DEFAULT_TOOLS;
      state.categories = DEFAULT_CATEGORIES;
      state.selectedCategory = "Tất cả";
      saveData();
      showToast("Đã đặt lại dữ liệu mặc định!");
    }
  });

  // Close modals when clicking backdrop
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
}

function closeAllModals() {
  document.getElementById("commandPaletteModal").classList.add("hidden");
  document.getElementById("toolFormModal").classList.add("hidden");
  document.getElementById("categoryModal").classList.add("hidden");
}

// ==================== COMMAND PALETTE ====================

function renderPaletteResults(query) {
  const list = document.getElementById("paletteResults");
  const q = query.toLowerCase().trim();
  state.paletteIndex = 0;

  const matches = state.tools.filter(t => {
    if (!q) return true;
    return (t.name || "").toLowerCase().includes(q) ||
           (t.url || "").toLowerCase().includes(q) ||
           (t.desc || "").toLowerCase().includes(q) ||
           (t.category || "").toLowerCase().includes(q);
  });

  if (matches.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs">
        Không tìm thấy tool khớp với "${query}"
      </div>
    `;
    return;
  }

  list.innerHTML = matches.map((tool, idx) => {
    const favicon = getFaviconUrl(tool.url, tool.icon);
    return `
      <div class="palette-item flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-slate-800/70 transition ${idx === 0 ? 'selected' : ''}" data-url="${tool.url}">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1">
            ${favicon ? `<img src="${favicon}" class="w-5 h-5 object-contain">` : `<i data-lucide="globe" class="w-4 h-4 text-blue-400"></i>`}
          </div>
          <div class="truncate">
            <div class="font-medium text-xs text-white truncate">${tool.name}</div>
            <div class="text-[10px] text-slate-400 font-mono truncate">${tool.url}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${getEnvBadge(tool.env)}
          <span class="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">${tool.category}</span>
        </div>
      </div>
    `;
  }).join("");

  // Attach click listener
  document.querySelectorAll(".palette-item").forEach(item => {
    item.addEventListener("click", () => {
      const url = item.dataset.url;
      window.open(url, "_blank");
      document.getElementById("commandPaletteModal").classList.add("hidden");
    });
  });

  refreshIcons();
}

function updatePaletteSelection() {
  const items = document.querySelectorAll(".palette-item");
  items.forEach((item, idx) => {
    if (idx === state.paletteIndex) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("selected");
    }
  });
}

// ==================== ADD / EDIT TOOL MODAL ====================

function openAddModal() {
  populateCategorySelect();
  document.getElementById("toolFormId").value = "";
  document.getElementById("toolFormTitle").innerText = "Thêm Tool Mới";
  document.getElementById("toolFormName").value = "";
  document.getElementById("toolFormUrl").value = "";
  document.getElementById("toolFormDesc").value = "";
  document.getElementById("toolFormIcon").value = "";
  document.getElementById("toolFormEnv").value = "localhost";
  document.getElementById("toolFormPinned").checked = false;
  document.getElementById("deleteToolBtn").classList.add("hidden");

  document.getElementById("toolFormModal").classList.remove("hidden");
  document.getElementById("toolFormName").focus();
}

window.openEditModal = function(id) {
  const tool = state.tools.find(t => t.id === id);
  if (!tool) return;

  populateCategorySelect();
  document.getElementById("toolFormId").value = tool.id;
  document.getElementById("toolFormTitle").innerText = "Chỉnh sửa Tool";
  document.getElementById("toolFormName").value = tool.name;
  document.getElementById("toolFormUrl").value = tool.url;
  document.getElementById("toolFormDesc").value = tool.desc || "";
  document.getElementById("toolFormIcon").value = tool.icon || "";
  document.getElementById("toolFormCategory").value = tool.category || state.categories[1];
  document.getElementById("toolFormEnv").value = tool.env || "localhost";
  document.getElementById("toolFormPinned").checked = !!tool.pinned;
  document.getElementById("deleteToolBtn").classList.remove("hidden");

  document.getElementById("toolFormModal").classList.remove("hidden");
};

function closeToolFormModal() {
  document.getElementById("toolFormModal").classList.add("hidden");
}

function populateCategorySelect() {
  const select = document.getElementById("toolFormCategory");
  select.innerHTML = "";
  // Exclude 'Tất cả'
  state.categories.filter(c => c !== "Tất cả").forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function handleToolFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("toolFormId").value;
  const name = document.getElementById("toolFormName").value.trim();
  const url = document.getElementById("toolFormUrl").value.trim();
  const category = document.getElementById("toolFormCategory").value;
  const env = document.getElementById("toolFormEnv").value;
  const desc = document.getElementById("toolFormDesc").value.trim();
  const icon = document.getElementById("toolFormIcon").value.trim();
  const pinned = document.getElementById("toolFormPinned").checked;

  if (!name || !url) return;

  if (id) {
    // Edit existing
    const tool = state.tools.find(t => t.id === id);
    if (tool) {
      tool.name = name;
      tool.url = url;
      tool.category = category;
      tool.env = env;
      tool.desc = desc;
      tool.icon = icon;
      tool.pinned = pinned;
      showToast("Đã cập nhật thông tin tool!");
    }
  } else {
    // Add new
    const newTool = {
      id: "tool-" + Date.now(),
      name,
      url,
      category,
      env,
      desc,
      icon,
      pinned,
      createdAt: Date.now()
    };
    state.tools.unshift(newTool);
    showToast("Đã thêm tool mới thành công!");
  }

  saveData();
  closeToolFormModal();
}

// ==================== CATEGORY MANAGER MODAL ====================

function openCategoryModal() {
  renderCategoryManagerList();
  document.getElementById("categoryModal").classList.remove("hidden");
  document.getElementById("newCategoryInput").focus();
}

function closeCategoryModal() {
  document.getElementById("categoryModal").classList.add("hidden");
}

function renderCategoryManagerList() {
  const list = document.getElementById("categoryManagerList");
  list.innerHTML = "";

  state.categories.forEach(cat => {
    if (cat === "Tất cả") return; // Cannot delete 'Tất cả'

    const count = state.tools.filter(t => t.category === cat).length;
    const row = document.createElement("div");
    row.className = "flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs";
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="folder" class="w-4 h-4 text-slate-400"></i>
        <span class="text-white font-medium">${cat}</span>
        <span class="text-slate-500 text-[10px]">(${count} tools)</span>
      </div>
      <button onclick="deleteCategory('${cat}')" class="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-1 rounded-lg transition" title="Xóa danh mục">
        <i data-lucide="trash" class="w-3.5 h-3.5"></i>
      </button>
    `;
    list.appendChild(row);
  });

  refreshIcons();
}

function handleAddCategory() {
  const input = document.getElementById("newCategoryInput");
  const name = input.value.trim();

  if (!name) return;
  if (state.categories.includes(name)) {
    alert("Danh mục này đã tồn tại!");
    return;
  }

  state.categories.push(name);
  input.value = "";
  saveData();
  renderCategoryManagerList();
  showToast(`Đã thêm danh mục "${name}"`);
}

window.deleteCategory = function(name) {
  if (confirm(`Bạn có chắc muốn xóa danh mục "${name}"? Các tool thuộc danh mục này sẽ chuyển về "Tất cả".`)) {
    state.categories = state.categories.filter(c => c !== name);
    state.tools.forEach(t => {
      if (t.category === name) {
        t.category = "Tất cả";
      }
    });
    if (state.selectedCategory === name) {
      state.selectedCategory = "Tất cả";
    }
    saveData();
    renderCategoryManagerList();
    showToast(`Đã xóa danh mục "${name}"`);
  }
};

// ==================== EXPORT & IMPORT ====================

function exportDataToJson() {
  const data = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    categories: state.categories,
    tools: state.tools
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `devlaunch-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Đã tải xuống file sao lưu JSON!");
}

function importDataFromJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const parsed = JSON.parse(event.target.result);
      if (Array.isArray(parsed.tools)) {
        state.tools = parsed.tools;
        if (Array.isArray(parsed.categories)) {
          state.categories = parsed.categories;
        }
        saveData();
        showToast("Đã khôi phục dữ liệu thành công!");
      } else {
        alert("File JSON không hợp lệ hoặc sai cấu trúc!");
      }
    } catch (err) {
      alert("Lỗi khi đọc file JSON: " + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

// Run on load
document.addEventListener("DOMContentLoaded", init);
