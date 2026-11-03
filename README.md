# Workshop 02 · 芽芽的林间秘密花园

一个供学员下载、运行和继续创作的 3D 小岛项目。使用 Vite + Three.js，包含芽芽、树、苔藓窝、灯笼、果篮、水碗、蘑菇、踏脚石和花草。

## 快速开始

先安装支持 Vite 8 的 Node.js（20.19+ 或 22.12+；建议 Node.js 24），然后在项目文件夹中运行：

```sh
npm ci
npm run dev
```

打开终端显示的本地地址（默认 http://127.0.0.1:5173/）。拖动鼠标环绕观察、滚轮缩放，点击“重置视角”回到初始构图。若端口被占用，先停止占用该端口的服务再启动。

检查生产构建：

```sh
npm run build
npm run preview
```

模型体积较大，下载和首次加载需要时间。若模型加载失败，页面会保留占位形状并提示错误；占位形状不代表真实模型加载成功。

## 学习资料

1. [教程入口](docs/workshop02/README.md)
2. [完整教程](docs/workshop02/Workshop02_完整教程.md)
3. [提示词合集](docs/workshop02/Workshop02_提示词合集.md)
4. [通用 Prompt 模板](docs/workshop02/Workshop02_通用Prompt模板.md)

这是已经完成场景组装的示例项目。直接体验只需运行上面的命令；从零跟做时，请在自己的项目副本中按步骤操作，不必把所有提示词重新应用到成品上。

## 文件结构

- `index.html`：网页入口。
- `src/main.js`、`src/style.css`：小岛场景和界面。
- `public/models/`：网页实际加载的模型，必须保留。
- `models/`：原始模型素材，供跟做和替换参考。
- `draft png/`、`woodland_lantern.png`：概念图和参考图片。
- `woodland_lantern.glb`：灯笼原始素材。
- `docs/workshop02/`：学员教程和提示词。
- `docs/evidence/`：教程配套截图和演示 GIF；教学重演与历史截图不代表本次运行验证。
- `package.json`、`package-lock.json`：启动命令与锁定的依赖版本。

当前版本不包含课程策划案、内部制作记录和讲师录制脚本。`node_modules/`、`dist/`、个人进度记录和临时输出不会提交。

## 功能边界

目前支持静态场景展示、环绕、缩放和重置视角。角色移动、点击互动、声音、碰撞和公开部署不是本项目已实现功能。本次仓库整理不改变场景代码或模型；请按教程自行检查浏览器表现。真实手机、Safari / Firefox、低端 GPU、限速网络及正式部署需要另外验证。
