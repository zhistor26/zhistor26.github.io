# zhistor26.github.io

Zhistor的个人博客｜记录 C++、计算流体力学、并行计算与性能优化，分享学习笔记和生活点滴。

## 在线访问

- 博客：<https://zhistor26.github.io/>
- 读书笔记：<https://zhistor26.github.io/#reading>
- Effective C++：<https://zhistor26.github.io/reading/effective-cpp.html>
- RSS：<https://zhistor26.github.io/feed.xml>

## 当前内容

目前收录 Effective C++ 读书笔记。原稿包含条款 01–25、29–40，共 37 条笔记和 285 个代码块；没有补写缺失条款。阅读页目录按内容分为 6 组，可以折叠，并提供返回目录入口。

## 文件说明

- `notes/*.md`：读书笔记的 Markdown 源文，日常修改这里。
- `reading/*.html`：从 Markdown 生成的阅读页面。
- `content/notes.js`：从笔记元数据生成的文章索引。
- `scripts/build-notes.py`：生成阅读页面、索引和 RSS 的脚本。
- `index.html`、`app.js`、`style.css`：博客首页、导航、About 和样式。
- `feed.xml`：RSS 订阅源。
- `.nojekyll`：使 GitHub Pages 直接发布静态文件。

## 写作与发布

1. 修改 `notes/effective-cpp.md`，或在 `notes/` 下新增 `.md` 文件。
2. 保留文件顶部的元数据；新笔记使用唯一的 `slug`，日期采用 `YYYY-MM-DD`。
3. 安装 Python 3 和 [Pandoc](https://pandoc.org/installing.html)，在仓库根目录运行：

   ```sh
   python3 scripts/build-notes.py
   ```

4. 将 Markdown 和生成的 `reading/`、`content/notes.js`、`feed.xml` 一并提交到 `main`，GitHub Pages 会重新发布。

此仓库不在 GitHub Actions 中自动转换 Markdown，修改源文后需要运行上面的生成命令。不要直接编辑生成的 HTML。

## 本地预览

```sh
python3 -m http.server 8000
```

访问 <http://localhost:8000>。已生成的网站不需要 npm 或服务器端程序。

## 版权与使用

本仓库公开展示，但不授予额外的开源使用许可。对于小智（zhistor26）依法享有著作权的原创内容，保留所有权利。

除适用法律允许的使用及 GitHub 服务条款授予的权限外，未经事先许可，不得复制、转载、分发或改编上述原创内容，亦不得将其用于商业用途。授权联系：zhistor26@gmail.com。

公开仓库允许他人按 GitHub 服务条款查看及 Fork；本声明不限制这些平台权限，也不能从技术上阻止内容被复制。

第三方代码、字体、图片、引用内容等的权利属于相应权利人，适用各自的许可或使用条件，不受本声明重新授权。

参考：[GitHub 仓库许可说明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) · [GitHub 服务条款](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
