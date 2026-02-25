<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

# ✨ MindFlow — 沉浸式 Markdown 笔记

> 一款现代化的本地 Markdown 笔记应用，拥有实时预览、代码高亮、目录导航、多主题切换、文件夹分类和图片管理等功能。数据完全存储在浏览器本地，无需后端服务。

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

### 🔧 Markdown 快捷工具栏
- **一键格式化** — 标题、加粗、斜体、删除线、高亮、行内代码、代码块
- **插入元素** — 链接、图片、无序/有序/任务列表、引用块、分隔线、表格
- **智能 Toggle** — 选中已格式化文本再次点击可取消格式
- **键盘快捷键** — `Ctrl+B` 加粗 / `Ctrl+I` 斜体 / `Ctrl+D` 删除线 / `Ctrl+E` 代码 / `Ctrl+K` 链接

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

### 🎭 多主题系统
- **6 种精选主题** — 午夜深蓝 🌑 / GitHub 暗色 🐙 / 翡翠绿 🌲 / 玫瑰粉 🌸 / 经典亮色 ☀️ / 落日橙 🌅
- **一键切换** — 侧边栏顶部下拉菜单，含主题色预览
- **自动记忆** — 主题选择持久化到 LocalStorage，刷新后保持
- **CSS 变量驱动** — 基于 CSS Custom Properties，所有组件统一响应主题变化

### 📁 文件夹分类
- **创建文件夹** — 侧边栏文件夹区域，点击 + 号内联创建
- **重命名 / 删除** — hover 文件夹显示操作图标，删除时笔记自动移到"未分类"
- **按文件夹筛选** — 支持"全部笔记"、各文件夹、"未分类"三种视图
- **笔记移动** — 笔记卡片 hover 显示文件夹图标，点击弹出移动菜单
- **智能创建** — 在某文件夹视图下新建的笔记自动归入该文件夹
- **笔记计数** — 每个文件夹旁显示包含的笔记数量

### 📂 导入 / 导出
- **导出当前笔记** — 保存为 `.md` 文件
- **导出全部** — JSON 格式批量备份所有笔记
- **导出为 PDF** — 通过浏览器打印功能，支持任意长度的多页内容
- **导入笔记** — 支持 `.md` 和 `.json` 文件导入

### 🔍 其他特性
- **全文搜索** — 按标题和内容即时过滤笔记列表
- **自定义滚动条** — 统一的极简滚动条样式
- **渐入动画** — 预览内容渲染时带有微妙的淡入效果

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 7 |
| 样式 | Tailwind CSS 4 + CSS Custom Properties |
| Markdown | react-markdown + remark-gfm + rehype-raw |
| 代码高亮 | react-syntax-highlighter (Prism) |
| 数据持久化 | LocalStorage |

---

## 📦 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/ccc0508/Markdown-Note.git
cd Markdown-Note

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
├── index.css                        # 全局样式（CSS 变量驱动）
├── themes.ts                        # 6 种主题定义
├── components/
│   ├── Editor/
│   │   └── Editor.tsx               # Markdown 编辑器（含图片上传）
│   ├── NoteList/
│   │   ├── NoteList.tsx             # 笔记列表侧边栏
│   │   ├── NoteItem.tsx             # 单条笔记卡片
│   │   ├── SearchBar.tsx            # 搜索栏
│   │   └── FolderList.tsx           # 文件夹列表（新增）
│   ├── Preview/
│   │   ├── Preview.tsx              # Markdown 实时预览
│   │   ├── CodeBlock.tsx            # 代码块渲染 + 复制按钮
│   │   └── TableOfContents.tsx      # 目录导航组件
│   └── ThemeSwitcher/
│       └── ThemeSwitcher.tsx        # 主题切换下拉菜单
├── hooks/
│   ├── useNotes.ts                  # 笔记 + 文件夹 CRUD / 搜索 / 导入导出
│   ├── useTheme.ts                  # 主题状态管理 + CSS 变量注入
│   └── useDebounce.ts              # 防抖 Hook
├── types/
│   └── note.ts                      # Note + Folder 类型定义
└── utils/
    └── storage.ts                   # LocalStorage 工具 + 图片 / 文件夹存储
```

---

## 🗺️ 路线图

- [x] 文件夹分类
- [x] 多主题支持（6 种内置主题）
- [x] PDF 导出
- [x] Markdown 快捷工具栏（加粗、斜体、链接等）
- [ ] 云端同步（可选 WebDAV / GitHub Gist）
- [ ] PWA 离线支持
- [ ] 笔记间双向链接 `[[wikilink]]`
- [ ] 标签系统

---

## 📄 许可证

[MIT License](LICENSE)

---

<p align="center">
  使用 ❤️ 和 React 构建
</p>
