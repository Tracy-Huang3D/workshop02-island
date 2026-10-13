# Workshop 02 教程入口

## 《从一个模型出发，搭建自己的 3D 小岛》

这套材料面向第一次接触 3D 网页场景的学习者。建议按以下顺序阅读：

1. [Workshop02_完整教程.md](./Workshop02_完整教程.md)：学生跟做正文，覆盖 Step 00–10。
2. [Workshop02_提示词合集.md](./Workshop02_提示词合集.md)：按工具和步骤快速复制提示词。
3. [Workshop02_通用Prompt模板.md](./Workshop02_通用Prompt模板.md)：把芽芽案例替换成自己的主角、世界和周边资产。
4. [Workshop02_媒体补充清单.md](./Workshop02_媒体补充清单.md)：查看已有截图与待补录屏。
5. [Workshop02_制作与验证记录.md](./Workshop02_制作与验证记录.md)：讲师课前核验、真实资产映射和未测试边界。

## 准备事项

- Workshop 01 的主模型，或本项目提供的芽芽 GLB。
- Node.js 与 npm。
- 可查看本地网页的浏览器。
- 图像工具和 Tripo 网页端账号（如果要从参考图生成自己的周边模型）。

本项目实际使用 Vite + Three.js，依赖由根目录 `package-lock.json` 锁定。普通学习者只需在项目根目录运行：

```sh
npm ci
npm run dev
```

再打开终端显示的地址；本项目开发预览为 `http://127.0.0.1:5173/`。

## 配套文件

- 根目录 `src/main.js`：场景、灯光、相机、模型加载和观察操作。
- 根目录 `src/style.css`：界面样式。
- 根目录 `public/models/`：网页加载的稳定模型路径。
- 根目录 `docs/workshop02-progress.md`：逐轮历史进度和证据。
- 根目录 `docs/evidence/`：截图和检查结果。

本节不要求公开部署、角色移动、故事卡片、点击收集、声音或复杂动画；这些内容放到 Workshop 03。
