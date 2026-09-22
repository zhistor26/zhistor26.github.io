#!/usr/bin/env python3
"""Build the reading pages and RSS from notes/*.md. Requires Python 3 and Pandoc."""
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from email.utils import format_datetime
import json
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://zhistor26.github.io'

def pandoc(source, input_format, output_format):
    return subprocess.run(['pandoc', '-f', input_format, '-t', output_format, '--wrap=none', '--no-highlight'], input=source, text=True, capture_output=True, check=True).stdout

def plain(value):
    if isinstance(value, list): return ''.join(plain(v) for v in value)
    if not isinstance(value, dict): return str(value) if isinstance(value, str) else ''
    kind, content = value.get('t'), value.get('c')
    if kind in ('Str', 'MetaString'): return content
    if kind in ('Space', 'SoftBreak', 'LineBreak'): return ' '
    if kind == 'Code': return content[1]
    return plain(content)

posts = []
(ROOT / 'reading').mkdir(exist_ok=True)
(ROOT / 'content').mkdir(exist_ok=True)
for path in sorted((ROOT / 'notes').glob('*.md')):
    document = json.loads(pandoc(path.read_text(), 'gfm+yaml_metadata_block', 'json'))
    metadata = document['meta']
    title, date, slug, description = (plain(metadata[name]) for name in ['title', 'date', 'slug', 'description'])
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug), 'Invalid note slug'
    datetime.strptime(date, '%Y-%m-%d')
    tags = [plain(tag) for tag in metadata['tags']['c']]
    blocks = document['blocks']
    if blocks and blocks[0]['t'] == 'Header' and blocks[0]['c'][0] == 1: blocks.pop(0)
    sections = []
    for block in blocks:
        if block['t'] != 'Header': continue
        label = plain(block['c'][2])
        match = re.match(r'条款\s*(\d+)', label)
        if match:
            anchor = f'item-{int(match[1]):02d}'
            block['c'][1][0] = anchor
            sections.append((anchor, label))
    body = pandoc(json.dumps(document, ensure_ascii=False), 'json', 'html5')
    def section_links(items):
        return '<ul>' + ''.join(f'<li><a href="#{anchor}">{escape(label)}</a></li>' for anchor, label in items) + '</ul>'
    groups = [
        (1, 4, '语言基础与初始化'),
        (5, 12, '构造、析构与赋值'),
        (13, 17, '资源管理'),
        (18, 25, '接口与类型设计'),
        (26, 31, '异常安全与编译依赖'),
        (32, 40, '继承与面向对象'),
    ]
    if slug == 'effective-cpp':
        toc_parts = []
        for first, last, label in groups:
            items = [(anchor, title) for anchor, title in sections if first <= int(anchor.split('-')[1]) <= last]
            if not items: continue
            item_range = items[0][0].split('-')[1] + '–' + items[-1][0].split('-')[1]
            toc_parts.append(f'<details class="toc-group"><summary>{escape(label)}<span class="toc-range">{item_range}</span></summary>{section_links(items)}</details>')
        toc = '<div class="toc-groups">' + ''.join(toc_parts) + '</div>'
    else:
        toc = section_links(sections)
    tag_links = ' '.join(f'<span class="reading-tag">{escape(tag)}</span>' for tag in tags)
    page = f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(title)} · 小智</title>
  <meta name="description" content="{escape(description, quote=True)}">
  <link rel="canonical" href="{SITE}/reading/{slug}.html">
  <link rel="stylesheet" href="../style.css?v=6">
  <link rel="alternate" type="application/rss+xml" title="小智的博客" href="../feed.xml">
</head>
<body>
  <a class="skip-link" href="#article-content">跳到正文</a>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="../" aria-label="返回首页">小智</a>
      <nav class="nav" aria-label="主要导航">
        <a href="../#tags">Tags</a><a href="../#projects">Projects</a>
        <a class="active" href="../#reading" aria-current="page">Notes</a>
        <a href="../#search">Search</a><a href="../feed.xml">Feeds</a><a href="../#about">About</a>
      </nav>
    </header>
    <main>
      <article class="reading-article">
        <header class="article-header">
          <a class="reading-category" href="../#reading">Notes</a>
          <h1 class="page-title">{escape(title)}</h1>
          <div class="post-meta"><time datetime="{date}">{date}</time><span aria-hidden="true">·</span>{tag_links}</div>
          <a class="markdown-link" href="../notes/{path.name}" download>下载 Markdown 源文 ↓</a>
        </header>
        <details class="article-toc" id="article-toc"><summary>目录 · {len(sections)} 条笔记</summary>{toc}</details>
        <div id="article-content" class="page-copy reading-content" tabindex="-1">{body}</div>
        <a class="back-link" href="../#reading">← Notes</a>
      </article>
    </main>
    <footer class="site-footer"><span>© 2026 小智</span><span>C++ / CFD / HPC Engineer</span></footer>
  </div>
  <a class="toc-shortcut" href="#article-toc" aria-label="返回文章目录">↑ 目录</a>
</body>
</html>
'''
    (ROOT / 'reading' / f'{slug}.html').write_text(page)
    posts.append({'title': title, 'summary': description, 'tags': tags, 'date': date, 'category': '读书笔记', 'url': f'./reading/{slug}.html', 'markdown': f'./notes/{path.name}'})
posts.sort(key=lambda post: post['date'], reverse=True)
(ROOT / 'content/notes.js').write_text('// Generated by scripts/build-notes.py from notes/*.md.\nwindow.BLOG_NOTES = ' + json.dumps(posts, ensure_ascii=False, indent=2).replace('<', '\\u003c') + ';\n')

feed = ET.Element('rss', {'version': '2.0'})
channel = ET.SubElement(feed, 'channel')
for key, value in [('title', '小智的博客'), ('link', SITE + '/'), ('description', 'C++、计算流体力学与读书笔记'), ('language', 'zh-CN')]: ET.SubElement(channel, key).text = value
for post in posts:
    item = ET.SubElement(channel, 'item')
    url = SITE + post['url'][1:]
    for key, value in [('title', post['title']), ('link', url), ('guid', url), ('description', post['summary']), ('category', post['category']), ('pubDate', format_datetime(datetime.strptime(post['date'], '%Y-%m-%d').replace(tzinfo=timezone.utc), usegmt=True))]: ET.SubElement(item, key).text = value
ET.indent(feed)
ET.ElementTree(feed).write(ROOT / 'feed.xml', encoding='utf-8', xml_declaration=True)
print(f'Built {len(posts)} reading note(s), content/notes.js, and feed.xml.')
