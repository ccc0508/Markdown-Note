<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

# ✨ MindFlow — 沉浸式 Markdown 笔记

> 一款现代化的本地 Markdown 笔记应用，拥有实时预览、代码高亮、目录导航和图片管理等功能。数据完全存储在浏览器本地，无需后端服务。

---

## 🖼️ 预览

| 编辑 + 实时预览 | 目录导航 |
|:---:|:---:|
| 左侧 Markdown 编辑，右侧实时渲染 | 自动提取标题生成可点击的大纲 |

---

## 🚀 功能特性

### 📝 编辑器
- **实时双栏预览** — 左编辑 / 右预览，所见即所得
- **防抖自动保存** — 停止输入 400ms 后自动保存至 LocalStorage
- **Tab 缩进支持** — 编辑器内 Tab 键插入缩进而非切换焦点

### 🎨 Markdown 渲染
- **GFM 完整支持** — 表格、删除线、脚注等 GitHub 风格语法
- **代码块语法高亮** — 支持数十种编程语言，含一键复制按钮
- **`==高亮文字==`** — 扩展语法，绿色高亮显示
- **数学公式** — 行内与块级公式渲染

### ✅ 任务列表
- **交互式复选框** — 在预览面板中直接点击切换 ✓/✗ 状态
- **已完成项样式** — 勾选后自动显示删除线 + 文字变灰
- **编辑器同步** — 预览中的切换实时反映到编辑器源码

### 📋 列表样式
- **无序列表** — 多级嵌套自动切换标记（实心圆 → 空心圆 → 方块）
- **有序列表** — 靛蓝色编号，支持嵌套独立计数
- **任务列表** — 自定义复选框样式，带 hover 动画

### 🖼️ 图片管理
- **三种插入方式** — 按钮上传 / Ctrl+V 粘贴 / 拖拽到编辑器
- **独立存储机制** — 图片 Base64 数据与笔记内容分离存储，编辑器中仅显示短引用 `![alt](img:xxxxxxxx)`
- **性能优化** — 避免因内联 Base64 导致编辑器卡顿

### 📑 目录导航
- **自动生成** — 解析所有 `#` ~ `######` 标题生成大纲
- **层级缩进** — 根据标题级别自动缩进显示
- **点击跳转** — 平滑滚动到对应章节
- **可折叠** — 一键收起/展开目录面板
- **智能过滤** — 跳过代码块内的 `#` 符号

### 📂 导入 / 导出
- **导出当前笔记** — 保存为 `.md` 文件
- **导出全部** — JSON 格式批量备份所有笔记
- **导入笔记** — 支持 `.md` 和 `.json` 文件导入

### 🔍 其他特性
- **全文搜索** — 按标题和内容即时过滤笔记列表
- **深色主题** — 精心调配的暗色配色方案，长时间使用不疲劳
- **自定义滚动条** — 统一的极简滚动条样式
- **渐入动画** — 预览内容渲染时带有微妙的淡入效果

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 7 |
| 样式 | Tailwind CSS 4 |
| Markdown | react-markdown + remark-gfm + rehype-raw |
| 代码高亮 | react-syntax-highlighter |
| 数据持久化 | LocalStorage |

---

## 📦 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
npm run build
npm run preview
```

---

## 📁 项目结构

```
src/
├── App.tsx                          # 应用根组件
├── main.tsx                         # 入口文件
├── index.css                        # 全局样式 + Markdown 预览样式
├── components/
│   ├── Editor/
│   │   └── Editor.tsx               # Markdown 编辑器（含图片上传）
│   ├── NoteList/
│   │   └── NoteList.tsx             # 笔记列表侧边栏
│   └── Preview/
│       ├── Preview.tsx              # Markdown 实时预览
│       ├── CodeBlock.tsx            # 代码块渲染 + 复制按钮
│       └── TableOfContents.tsx      # 目录导航组件
├── hooks/
│   ├── useNotes.ts                  # 笔记 CRUD + 搜索 + 导入导出
│   └── useDebounce.ts              # 防抖 Hook
├── types/
│   └── note.ts                      # Note 类型定义
└── utils/
    └── storage.ts                   # LocalStorage 工具 + 图片存储
```

---

## 🗺️ 路线图

- [ ] 文件夹 / 标签分类
- [ ] Markdown 快捷工具栏（加粗、斜体、链接等）
- [ ] 多主题支持（浅色 / 深色 / 自定义）
- [ ] 云端同步（可选 WebDAV / GitHub Gist）
- [ ] PWA 离线支持
- [ ] 笔记间双向链接 `[[wikilink]]`

---

## 📄 许可证

[MIT License](LICENSE)

---

<p align="center">
  使用 ❤️ 和 React 构建
</p>
