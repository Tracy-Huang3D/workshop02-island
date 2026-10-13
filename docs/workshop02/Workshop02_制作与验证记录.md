# Workshop 02 制作与验证记录

## 资料依据

核对过的项目文件包括根目录 README、`Workshop02_策划案对齐版.md`、`Workshop02_策划案对齐版 (1).md`、`src/main.js`、`src/style.css`、`package.json`、`package-lock.json`、`docs/workshop02-progress.md`、`docs/evidence/` 和 `public/models/`。未发现可用的 AGENTS.md；当前目录没有可作为证据的 Git 历史。

## 项目事实

- 技术栈：Vite 8.3.4 + Three.js 0.186.1。
- 实际验证环境：Node.js 24.21.0、npm 11.19.0。
- 入口：`src/main.js`；样式：`src/style.css`。
- 启动：`npm ci`、`npm run dev`；实际开发地址 `http://127.0.0.1:5173/`。
- 构建：`npm run build`；生产预览命令 `npm run preview`。
- 场景小岛、灯光、相机和观察功能由代码搭建；模型由 GLB 加载。

## 真实资产映射

|资产|稳定网页路径|原始文件|网页状态|
|---|---|---|---|
|芽芽|`public/models/yaya.glb`|` 芽芽.glb`|原版，加载|
|树|`public/models/forest-tree.glb`|`forest_tree.glb`|原版，加载|
|苔藓窝|`public/models/moss-rest-nest.glb`|`moss_rest_nest.glb`|原版，加载|
|灯笼|`public/models/woodland-lantern.glb`|`woodland_lantern.glb`|原版，加载|
|果篮|`public/models/fruit-basket.glb`|`fruit_basket.glb`|原版，加载|
|叶形水碗|`public/models/leaf-bowl.glb`|`leaf_bowl.glb`|原版，加载|
|蘑菇凳|`public/models/peach-mushroom.glb`|`peach_mushroom.glb`|原版，加载|
|踏脚石|`public/models/optimized/garden-stepping-stone.glb`|`Garden_Stepping_Stone.glb`|优化副本，复用 5 次|
|花草|`public/models/cream-daisies.glb`|`Cream_Daisies.glb`|原版，复用 4 次|

原始 9 个 GLB 合计 558,760,936 bytes；网页请求 9 个独立文件，实例复用不重复下载。原始文件均保留。唯一确认的首尾空格是 ` 芽芽.glb` 的开头半角空格。PNG（场景草稿、角色图、独立对象图）是参考图，不是网页模型。

无法从现有项目确认每个 GLB 是否确实在 Tripo 中生成、具体版本、额度、耗时或授权来源；教程把 Tripo 流程写成可跟做教学，不把缺少的历史操作证据写成已核实事实。

## 已验证

- 本地开发服务启动，重启后 9 个独立模型可见。
- 芽芽、树、窝、灯笼、果篮、水碗、蘑菇凳、踏脚石、花草均有加载状态和失败提示；正常成功后对应占位移除。
- 鼠标环绕、滚轮缩放、重置视角、窗口尺寸调整和刷新加载通过。
- `npm run build` 通过；仍有主 JavaScript 超过 500 kB 的非阻断提示。
- Step 09 有同视角前后和侧面证据。
- Step 10A 只优化踏脚石：67,460,144 B → 50,922,040 B，三角面约减少 30%，当前网页接入优化版，外观对比未见明显损失。
- 当前浏览器控制台正常路径无新增 error/warn。

## 未验证或部分完成

- 真正禁用浏览器缓存后的冷加载。
- Safari、Firefox、真实手机触摸、低端 GPU、限速网络。
- 完整性能剖析、准确加载时间对比、逐顶点接触/碰撞。
- 其他 8 个模型的优化副本和外观对比。
- 正式录屏、公开部署。
- 芽芽远侧后脚完全无遮挡；部分角度存在自身遮挡。
- 切线警告未阻止当前浏览器显示，但其他环境未测；不写成所有设备无影响。

## 讲师课前准备

1. 运行 `npm ci`、`npm run dev`，确认 5173 可访问。
2. 提前打开 `docs/evidence/09-before.png`、`09-after.png`、`10b-restart.png`。
3. 在当前 Tripo 网页端核对上传、生成、旋转查看和 GLB 导出的按钮名称、额度与耗时文案。
4. 录制媒体清单中的待补 GIF/录屏；不要创建空白媒体。
5. 将本机绝对路径改写成相对路径后再发给学生。
6. 保留根目录原始素材和 `package-lock.json`；不要将本地预览地址说成公开网站。

## 2026-10-12 媒体补录

本轮使用真实本地浏览器录制并抽帧合成 GIF，保存于 `docs/evidence/gifs/`：

- `w02-current-observation.gif`：真实执行环绕、缩放、重置；9 个独立 GLB 已加载，控制位置变化通过，控制台错误为空。
- `w02-s10-restart.gif`：真实停止本项目 5173 服务、确认请求中断、重新启动、刷新并重新加载 9 个模型，再执行观察操作。新服务 PID 和加载状态写入 `recording-manifest.json`。

另外三段是教学重演，不是历史首次开发录像：

- `w02-s07-basic-reenactment.gif`：通过暂缓 GLB 请求重演占位空间观察。
- `w02-s08-yaya-reenactment.gif`：暂停并释放真实芽芽 GLB 请求，重演“占位→真实模型”。等待时间经过剪辑，不代表网络耗时。
- `w02-s09-path-reenactment.gif`：依据 `08g-results.json` 的旧路径坐标和当前代码坐标重演路径变化；真实历史结果仍以 `09-before.png`、`09-after.png`、`09-side.png` 为准。

GIF 的画面尺寸为 1000×800；它们用于教学观察，不用于加载性能计时。没有把教学重演写成历史过程，也没有新增场景功能。`recording-manifest.json` 保存了帧数、时长、浏览器版本、控制检查结果和错误收集结果。
