# AGENTS.md — Markdown 笔记应用

本文档为 AI 编码代理（如 Gemini、GitHub Copilot 等）提供项目上下文和开发规范，帮助 Agent 理解项目结构、技术栈和编码约定，以更高效地协助开发。

---

## 项目概述

一款基于浏览器的轻量级 Markdown 笔记应用。支持笔记的创建、编辑、删除和搜索。界面采用左右分栏布局：左侧为笔记列表和 Markdown 编辑器，右侧为实时渲染预览。数据存储在浏览器 LocalStorage 中，代码块支持语法高亮。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| CSS | Tailwind CSS 3 |
| Markdown | react-markdown + remark-gfm |
| 代码高亮 | react-syntax-highlighter (Prism) |
| 存储 | LocalStorage |

---

## 项目结构

```
project/
├── src/
│   ├── components/           # UI 组件（按功能模块分目录）
│   │   ├── NoteList/         # 笔记列表面板
│   │   ├── Editor/           # Markdown 编辑器
│   │   ├── Preview/          # 实时预览面板
│   │   └── Layout/           # 布局组件
│   ├── hooks/                # 自定义 React Hooks
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式 + Tailwind
├── docs/
│   ├── PRD.md                # 产品需求文档
│   └── TechnicalDesign.md    # 技术设计文档
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── AGENTS.md                 # 本文件
```

---

## 编码规范

### 通用规则

1. **语言**：所有代码使用 TypeScript，禁止 `any` 类型（除非有充分理由并添加注释说明）
2. **组件**：使用函数组件 + Hooks，不使用 Class 组件
3. **导出**：组件使用命名导出（`export function`），不使用默认导出
4. **命名**：
   - 组件/类型：PascalCase（`NoteList`、`NoteItem`）
   - 函数/变量：camelCase（`createNote`、`activeNoteId`）
   - 常量：UPPER_SNAKE_CASE（`STORAGE_KEY`）
   - 文件名：与导出的主组件/模块同名（`NoteList.tsx`）
5. **注释**：关键逻辑用中文注释说明意图，简单代码不加冗余注释

### React 规范

1. **状态管理**：使用 `useState` + `useContext`，不引入外部状态库
2. **副作用**：所有副作用使用 `useEffect`，注意清理函数
3. **性能优化**：
   - 列表项使用 `React.memo`
   - 计算密集操作使用 `useMemo`
   - 回调函数使用 `useCallback`（在有性能需求时）
4. **Props**：使用 TypeScript interface 定义 Props 类型，命名为 `XxxProps`

### 样式规范

1. 使用 Tailwind CSS utility classes，尽量不写自定义 CSS
2. 组件布局使用 Flexbox（`flex`）
3. 响应式设计使用 Tailwind 断点前缀（`md:`、`lg:`）
4. 颜色使用 Tailwind 调色板，保持一致性

### 文件组织

1. 每个组件目录包含：主组件文件 + 可选的子组件文件
2. 自定义 Hook 放在 `src/hooks/` 目录
3. 类型定义放在 `src/types/` 目录
4. 工具函数放在 `src/utils/` 目录

---

## 数据模型

```typescript
interface Note {
  id: string;          // crypto.randomUUID() 生成
  title: string;       // 笔记标题
  content: string;     // Markdown 原始内容
  createdAt: number;   // Date.now() 时间戳
  updatedAt: number;   // Date.now() 时间戳
}
```

**LocalStorage Key**: `markdown-notes-app`

---

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

---

## 开发注意事项

> [!IMPORTANT]
> 以下约定对 AI Agent 协助开发至关重要。

### DO ✅

- 所有新组件必须定义 Props 的 TypeScript 接口
- 修改笔记数据后确保调用 `storage.saveNotes()` 持久化
- 新增功能时更新对应的类型定义
- 保持组件职责单一，一个组件只做一件事
- 使用 `useDebounce` 控制自动保存频率

### DON'T ❌

- 不要使用 `dangerouslySetInnerHTML` 渲染 Markdown（使用 `react-markdown`）
- 不要直接操作 DOM（使用 React 的声明式方式）
- 不要在组件中直接调用 `localStorage`（通过 `storage` 工具模块）
- 不要使用 `any` 类型
- 不要使用 Class 组件

---

## 关键依赖说明

| 依赖 | 用途 | 重要提示 |
|------|------|----------|
| `react-markdown` | Markdown → React 组件 | 通过 `components` prop 自定义渲染 |
| `remark-gfm` | GFM 扩展支持 | 作为 `remarkPlugins` 传入 |
| `react-syntax-highlighter` | 代码块高亮 | 使用 Prism 版本，按需导入主题 |

---

## 上下文参考

- **PRD 文档**：[docs/PRD.md](file:///d:/develop/Antigravity/project/docs/PRD.md)
- **技术设计**：[docs/TechnicalDesign.md](file:///d:/develop/Antigravity/project/docs/TechnicalDesign.md)
