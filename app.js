/**
 * My Tools Launcher — Minimalist & Fast
 */

const STORAGE_KEY = "my_launcher_tools_v2";

// Chỉ giữ lại đúng tool của bạn
const DEFAULT_TOOLS = [
  {
    id: "tool-office-info-editor",
    name: "Office Info Editor",
    url: "https://office-info-editor.vercel.app/",
    desc: "Công cụ chỉnh sửa và quản lý thông tin văn phòng trực tuyến"
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
    const saved = localStorage.getItem(STORAGE_KEY);
    tools = saved ? JSON.parse(saved) : DEFAULT_TOOLS;
  } catch (e) {
    tools = DEFAULT_TOOLS;
  }
}

function saveTools() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  render();
}

function getFaviconUrl(url) {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch (e) {
    return null;
  }
}

function formatDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.port ? `:${parsed.port}` : "");
  } catch (e) {
    return url;
  }
}

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
    const favicon = getFaviconUrl(tool.url);
    const domain = formatDomain(tool.url);

    return `
      <div class="tool-card group relative bg-[#161b22] hover:bg-[#1c2128] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg">
        <div>
          <!-- Header Card: Icon, Title, Actions -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0">
                ${
                  favicon
                    ? `<img src="${favicon}" alt="${tool.name}" class="w-6 h-6 object-contain rounded" onerror="this.onerror=null; this.parentElement.innerHTML='<i data-lucide=&quot;globe&quot; class=&quot;w-5 h-5 text-blue-400&quot;></i>'; lucide.createIcons();">`
                    : `<i data-lucide="globe" class="w-5 h-5 text-blue-400"></i>`
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
    document.getElementById("toolDesc").value = "";
    modal.classList.remove("hidden");
    document.getElementById("toolName").focus();
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
    const desc = document.getElementById("toolDesc").value.trim();

    if (!name || !url) return;

    if (id) {
      // Update
      const tool = tools.find(t => t.id === id);
      if (tool) {
        tool.name = name;
        tool.url = url;
        tool.desc = desc;
      }
    } else {
      // Add new
      tools.push({
        id: "tool-" + Date.now(),
        name,
        url,
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
