# Workshop 02 · workshop02-island

## 项目简介

这是 Workshop 02 的独立 3D 小岛空间草稿项目「芽芽的林间秘密花园」。项目以 Workshop 01 的角色模型为基础，经过概念设计、参考图准备、周边资产生成和 Codex 场景组装，完成一个可以继续拓展的 3D 小岛空间草稿。本仓库仅对应 Workshop 02 小岛项目，不包含 `Tripo_Club_3D_Web_Tutorial` 或 Case 2 的其他项目内容。

## Workshop 02 目标

学习者从 Workshop 01 的角色模型出发，完成：

1. 概念设计与场景构图；
2. 参考图准备与周边资产拆分；
3. 使用 Tripo 生成或整理周边 GLB 资产；
4. 使用 Codex / Three.js 将角色和环境资产组装成可在浏览器中观察的 3D 小岛；
5. 为后续空间拓展、互动和发布保留清晰的项目结构。

## 当前真实实现

当前网页使用 Vite + Three.js，已接入 9 个独立场景资产：芽芽、树、苔藓窝、林间灯笼、果篮、叶形水碗、蘑菇凳、踏脚石和花草。场景包含：

- 小岛地面、灯光、阴影、相机和环境氛围；
- GLB 资产的相对路径加载；
- 单个模型加载失败时保留对应程序化占位，并显示错误路径与信息；
- 自动按模型包围盒缩放和落地摆放；
- 鼠标拖动环绕、滚轮缩放、窗口尺寸变化重置构图；
- 「重置视角」按钮；
- 窄屏样式和加载状态提示。

当前资产是静态展示，尚未实现点亮灯笼、拾取物件、角色移动、水面动画、碰撞系统、用户编辑器或公开部署。

## 安装、启动与构建

环境验证记录使用 Node.js 24.21.0 与 npm 11.19.0。推荐在项目根目录执行：

```sh
npm ci
npm run dev
```

然后打开终端显示的本地地址（默认为 `http://127.0.0.1:5173/`）。生产构建与本地预览：

```sh
npm run build
npm run preview
```

`npm run build` 会生成被 Git 忽略的 `dist/`；它不是源文件，也不会作为仓库内容提交。

## 文件与资产入口

- `index.html`：网页入口。
- `src/main.js`：Three.js 场景、灯光、相机、GLB 加载、占位回退和观察操作。
- `src/style.css`：界面和窄屏样式。
- `public/models/`：网页运行时实际读取的 GLB 文件；路径均为相对项目根目录的 `/models/...`。
- `models/`：保留的原始 GLB 资产，便于追溯来源；网页不直接从此目录读取。
- `draft png/`：概念草稿、参考图和资产预览图。
- `woodland_lantern.png`：灯笼资产预览图。
- `docs/evidence/`：已有浏览器截图、检查结果和录屏材料。
- `docs/workshop02/`：整理后的 Workshop 02 教学入口、完整教程、提示词和验证记录。
- `scripts/`：项目检查和录制辅助脚本；部分脚本需要本机 Chrome 与外部 Playwright 运行时，不是普通启动依赖。

## 教程入口

建议按以下顺序阅读：

1. [Workshop 02 教程入口](docs/workshop02/README.md)
2. [Workshop02 完整教程](docs/workshop02/Workshop02_完整教程.md)
3. [Workshop02 提示词合集](docs/workshop02/Workshop02_提示词合集.md)
4. [Workshop02 通用 Prompt 模板](docs/workshop02/Workshop02_通用Prompt模板.md)
5. [制作与验证记录](docs/workshop02/Workshop02_制作与验证记录.md)
6. [项目进度与证据](docs/workshop02-progress.md)

## 已知限制与验证边界

- 所有网页实际使用的 GLB 已保存在仓库的 `public/models/` 中；引用不依赖本机绝对路径。
- 单个 GLB 文件最大约 64 MiB，低于 GitHub 单文件 100 MiB 限制，因此本次不使用 Git LFS；仓库仍包含较多大体积 3D 资源，克隆和首次加载需要时间。
- 已记录的验证包括构建、重启后 9 项模型加载、环绕、缩放、重置视角和正常流程控制台错误检查；这些记录见 `docs/workshop02-progress.md` 与 `docs/evidence/`。
- Safari / Firefox、真实手机触摸、低端 GPU、限速网络、逐顶点碰撞、生产环境部署和公开 URL 尚未完成独立验证。
- `dist/`、`node_modules/`、缓存、系统文件、日志和临时输出不会上传。

## Workshop 03 可拓展方向

Workshop 03 可以在当前静态空间基础上继续验证：新增区域、至少一种可重复使用的互动、一次基于体验反馈的布局调整，以及独立的公开发布流程。以上是后续方向，不是本仓库当前已完成的功能。
