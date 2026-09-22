const posts = window.BLOG_NOTES || [];

const projects = [
  ["01", "CFD 快速预测引擎", "C++17 / OpenMP / POD / ROM", "有限元网格处理、任意平面切片与机器学习快速预测。"],
  ["02", "核动力预测系统", "C++ / Qt / VTK / ONNX Runtime / CUDA", "工业可视化客户端与 GPU 推理服务。"],
  ["03", "IPP 数学库 ARM 移植", "C++ / ARM NEON / 飞腾", "核心数学函数的向量化实现与精度验证。"],
  ["04", "OpenCV 阅前检测", "C++17 / OpenCV / Go", "题块检测、涂改识别与服务化部署。"],
  ["05", "企业 Coding Agent", "TUI / VS Code / LLM / Agent", "多模型反代、开发工具集成与团队工作流。"]
];

const app = document.querySelector("#app");
const dialog = document.querySelector("#search-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");
const commonTags = ["C++", "Effective C++", "最佳实践"];
const tagCounts = new Map();
posts.forEach(post => post.tags.forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)));
let previousSection = "";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function safeDecode(value) {
  try { return decodeURIComponent(value); } catch { return ""; }
}

function articleURL(post) {
  return post.url;
}

function tagsMarkup(tags) {
  return tags.map(tag => `<a class="tag" href="#tags/${encodeURIComponent(tag)}">${escapeHTML(tag)}</a>`).join("");
}

function postMarkup(post) {
  return `<li class="post-item">
    <h2 class="post-heading"><a class="post-title" href="${articleURL(post)}">${escapeHTML(post.title)}</a></h2>
    <p class="post-summary">${escapeHTML(post.summary)}</p>
    <div class="post-meta"><a href="#reading">${escapeHTML(post.category)}</a><span class="meta-divider" aria-hidden="true">·</span><time datetime="${post.date}">${post.date}</time><span class="meta-divider" aria-hidden="true">·</span>
      <span class="post-tags">${tagsMarkup(post.tags.slice(0, 2))}${post.tags.length > 2 ? `<a class="more-tags" href="${articleURL(post)}" aria-label="查看本文全部 ${post.tags.length} 个标签">+${post.tags.length - 2}</a>` : ""}</span>
    </div>
  </li>`;
}

function pageHeader(title, description = "") {
  return `<header class="page-header"><h1 class="page-title">${escapeHTML(title)}</h1>${description ? `<p class="page-description">${escapeHTML(description)}</p>` : ""}</header>`;
}

function home() {
  return `<section class="page"><div class="intro">
    <h1 class="motto">「保持好奇，记录每一次工程实践」</h1>
    <p class="count">${posts.length} 篇文章 · 读书笔记</p>
  </div><ul class="post-list">${posts.map(postMarkup).join("")}</ul></section>`;
}

function readingPage() {
  return `<section class="page">${pageHeader("读书笔记", "读过的书、留下的问题，以及逐渐弄明白的原理。")}<p class="reading-count count">${posts.length} 篇笔记</p><ul class="post-list">${posts.map(postMarkup).join("")}</ul></section>`;
}

function filterMarkup(tag, count, selected) {
  const active = tag === selected;
  return `<a class="tag-filter${active ? " active" : ""}" href="${tag ? "#tags/" + encodeURIComponent(tag) : "#tags"}"${active ? ' aria-current="true"' : ""}>${escapeHTML(tag || "全部")}<span class="tag-count" aria-label="${count} 篇文章">${count}</span></a>`;
}

function tagsPage(selected = "") {
  const extraTags = [...tagCounts.keys()].filter(tag => !commonTags.includes(tag)).sort((a, b) => a.localeCompare(b));
  const filtered = selected ? posts.filter(post => post.tags.includes(selected)) : posts;
  const extraOpen = extraTags.includes(selected);
  return `<section class="page">
    ${pageHeader("Tags", "按主题查找文章")}
    <nav class="tag-filters" aria-label="按标签筛选">
      <div class="tag-row">${filterMarkup("", posts.length, selected)}${commonTags.filter(tag => tagCounts.has(tag)).map(tag => filterMarkup(tag, tagCounts.get(tag), selected)).join("")}</div>
      ${extraTags.length ? `<details class="extra-tags"${extraOpen ? " open" : ""}><summary>更多标签 · ${extraTags.length}</summary>
        <div class="tag-row">${extraTags.map(tag => filterMarkup(tag, tagCounts.get(tag), selected)).join("")}</div>
      </details>` : ""}
    </nav>
    <div class="result-heading"><h2>${escapeHTML(selected || "全部文章")}</h2><span class="count">${filtered.length} 篇</span>${selected ? '<a class="filter-reset" href="#tags">清除筛选</a>' : ""}</div>
    ${filtered.length ? `<ul class="post-list">${filtered.map(postMarkup).join("")}</ul>` : '<p class="empty">还没有这个标签的文章，请选择其他标签。</p>'}
  </section>`;
}

function projectsPage() {
  return `<section class="page">${pageHeader("Projects", "数值计算、工业软件与 AI 工程实践")}<div class="project-list">${projects.map(p => `<article class="project"><span class="project-no">${p[0]}</span><h2>${escapeHTML(p[1])}</h2><p>${escapeHTML(p[3])}</p><p class="project-stack">${escapeHTML(p[2])}</p></article>`).join("")}</div></section>`;
}

function aboutPage() {
  return `<section class="page">${pageHeader("About Me")}<div class="page-copy about-copy">
    <p>我是小智，2024 届软件工程本科毕业，目前从事计算流体力学（CFD）方向的 C++ 研发工作。</p>
    <h2>IT 技能</h2>
    <ul>
      <li>技术栈：C++、OpenMP、ARM NEON。</li>
      <li>关注底层原理、并行计算、性能优化与计算机体系结构。</li>
      <li>探索 AI Agent 的工程应用，喜欢把想法做成真正能用的东西。</li>
      <li>产品思维学习中，也在学习从需求和使用者的角度看问题。</li>
    </ul>
    <h2>擅长领域</h2>
    <ul><li>C++ 工程开发</li><li>网格与数值数据处理</li><li>CFD 相关软件开发</li></ul>
    <h2>编程语言</h2>
    <ul><li>主要使用：C++</li><li>了解语法：Go</li></ul>
    <h2>电脑环境</h2>
    <ul><li>服务器：懒猫微服</li><li>笔记本：MacBook Air，M4，16 GB 内存 + 512 GB 存储</li></ul>
    <h2>时间分配</h2>
    <ol>
      <li>工作：CFD 算法开发。</li>
      <li>学习：CSAPP、数据结构。</li>
      <li>练武：新极真会空手道，目前橙带十级。</li>
      <li>旅行：暂无，但希望有机会，可能只能等裁员了。</li>
    </ol>
    <h2>宠物</h2>
    <p>家里有三只小猫。</p>
    <ul>
      <li>蹦蹦：一只橘白小伙子。</li>
      <li>球球：一只布偶姑娘。</li>
      <li>小咪：刚捡来的小橘白小伙子，个头超小，超级能吃。</li>
    </ul>
    <h2>性格</h2>
    <ul>
      <li>对感兴趣的事情保持好奇，喜欢弄明白背后的原理。</li>
      <li>关注实际效果，希望学到的东西能用得上。</li>
      <li>希望日子简单自在，有时间练武，也有机会看看世界。</li>
    </ul>
    <h2>感谢支持</h2>
    <ul><li>这里记录技术实践、读书笔记，以及运动和生活中的点滴。</li><li>欢迎交流，也欢迎指出文章中的错误。</li></ul>
    <h2>我的推特</h2>
    <p><a href="https://x.com/zhistor26" target="_blank" rel="noopener noreferrer">@zhistor26</a></p>
    <p>欢迎和我聊聊技术、运动，也聊聊猫。</p>
    <p>邮箱：<a href="mailto:zhistor26@gmail.com">zhistor26@gmail.com</a></p>
    <p class="about-motto">悟已往之不谏，知来者之可追。</p>
  </div></section>`;
}

function feedsPage() {
  const feedURL = new URL("./feed.xml", location.href).href;
  return `<section class="page">${pageHeader("Feeds", "用你喜欢的 RSS 阅读器订阅更新")}<div class="page-copy"><p><a class="feed-url" href="./feed.xml">${escapeHTML(feedURL)}</a></p><p>复制上面的地址，添加到 RSS 阅读器即可。</p></div></section>`;
}

function articlePage(encodedTitle) {
  const post = posts.find(item => item.title === safeDecode(encodedTitle));
  return `<section class="page">${pageHeader(post ? post.title : "文章未找到")}<a class="back-link" href="${post ? articleURL(post) : '#reading'}">${post ? '阅读完整笔记 →' : '← 返回读书笔记'}</a></section>`;
}

function route(moveFocus = true) {
  const hash = location.hash.slice(1) || "home";
  const section = hash.split("/")[0];
  const filterFocus = document.activeElement?.closest(".tag-filter, .filter-reset");
  const retainedFilter = section === "tags" && previousSection === "tags" && filterFocus ? filterFocus.getAttribute("href") : null;
  document.querySelectorAll(".nav a").forEach(link => {
    const active = link.getAttribute("href") === "#" + section;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (hash === "reading") app.innerHTML = readingPage();
  else if (section === "tags") app.innerHTML = tagsPage(safeDecode(hash.slice(5)));
  else if (hash === "projects") app.innerHTML = projectsPage();
  else if (hash === "feeds") app.innerHTML = feedsPage();
  else if (hash === "about") app.innerHTML = aboutPage();
  else if (section === "article") app.innerHTML = articlePage(hash.slice(8));
  else app.innerHTML = home();

  const pageTitle = app.querySelector("h1")?.textContent;
  document.title = (hash === "home" || hash === "search") ? "小智 · C++ / CFD / HPC" : (pageTitle || "小智") + " · 小智";
  if (moveFocus) {
    const target = retainedFilter ? [...app.querySelectorAll(".tag-filter")].find(link => link.getAttribute("href") === retainedFilter) : null;
    (target || app).focus({ preventScroll: true });
    if (!target) window.scrollTo({ top: 0, behavior: "instant" });
  }
  previousSection = section;
  if (hash === "search" && !dialog.open) openSearch();
}

function renderSearch(query = "") {
  const q = query.trim().toLowerCase();
  const matched = q ? posts.filter(post => [post.title, post.summary, ...post.tags].join(" ").toLowerCase().includes(q)) : posts.slice(0, 5);
  searchStatus.textContent = q ? `找到 ${matched.length} 篇文章` : "最近文章";
  searchResults.innerHTML = matched.length ? matched.map(post => `<a class="search-result" href="${articleURL(post)}"><strong>${escapeHTML(post.title)}</strong><span>${post.date} · ${escapeHTML(post.tags.slice(0, 2).join(" / "))}</span></a>`).join("") : '<p class="empty">试试 C++、Effective C++ 或最佳实践。</p>';
}

document.querySelector(".skip-link").addEventListener("click", event => {
  event.preventDefault();
  app.focus({ preventScroll: true });
  app.scrollIntoView({ block: "start", behavior: "instant" });
});
function openSearch() {
  searchInput.value = "";
  renderSearch();
  dialog.showModal();
  searchInput.focus();
}
document.querySelector("#search-open").addEventListener("click", openSearch);
document.querySelector(".close").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", event => renderSearch(event.target.value));
searchResults.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link) return;
  dialog.close();
  if (link.getAttribute("href") === location.hash) route();
});
dialog.addEventListener("click", event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
window.addEventListener("hashchange", () => route());
route(false);
