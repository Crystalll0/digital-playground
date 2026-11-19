# Digital Playground

用双手让花朵绽放，在像素早餐店接薯饼，或把旅行照片做成手札。这个作品集收录了 Crystal 的交互实验、游戏和创意工具，也记录了它们如何从原型逐步成形。

Open your hand to make a flower bloom, catch hash browns in a pixel-art diner, or turn travel photos into a journal. Explore Crystal’s interactive projects and follow their development from the first prototype.

[浏览中文作品集](https://crystalll0.github.io/digital-playground/?lang=cn#works) · [Explore in English](https://crystalll0.github.io/digital-playground/?lang=en#works)

## 仓库导览 · Repository guide

| 位置 / Path | 内容 / Contents |
| --- | --- |
| `index.html` | 双语作品集首页与迭代时间线 / Bilingual portfolio and project timeline |
| `play/` | 为 GitHub Pages 整理的可运行版本 / Browser builds prepared for GitHub Pages |
| `works/` | 项目文件与历史版本 / Project files and archived versions |

从作品集卡片打开项目。选择「迭代记录」可查看设计变化。要查看源码修改，可在 GitHub 打开对应文件夹并选择 **History**。

Open a project from its portfolio card. Select **History** on the card for design changes, or open its folder on GitHub and select **History** for code changes.

## 作品 · Projects

| № | 作品 / Project | 类型 / Type | 文件位置或线上入口 / Path or live link |
| --- | --- | --- | --- |
| 01 | 手势 · 绽放 Nocturne Bloom | 手势 · 生成艺术 / Gesture interaction · Generative art | `play/bloom/` |
| 02 | 手势 · 取景框 Gesture Window | 手势 / Gesture interaction | `play/window/` |
| 03 | 手势 · 星云 Gesture Nebula | 手势 · 粒子 / Gesture interaction · Particles | `play/nebula/` |
| 04 | 撕开现实 Tear Reality | 手势 · WebGL / Gesture interaction · WebGL | `play/tear-reality/` |
| 05 | 流场花园 Flow Garden | 生成艺术 / Generative art | `play/flow-garden/` |
| 06 | 薯饼接接乐 Hash Brown Catch | 游戏 / Game | `play/hash-brown-catch/` |
| 07 | 理大食乜机 PolyU Lunch Machine | 游戏 · 工具 / Game · Tool | `play/polyu-eats/` |
| 08 | 月隐 Moonveil | 网站 / Website | `works/01｜月隐 · MOONVEIL ｜占卜/` |
| 09 | 安可工作室 Encore Studio | 网站 / Website | `works/02｜安可工作室 · Encore Studio｜ 启德 · 手链/` |
| 10 | 纸间 Paper Room | 工具 / Tool | `works/04｜纸间 · Paper Room｜折纸&剪纸/PAPER-ROOM 3/dist/` |
| 11 | 行迹 The Personal Atlas | 工具 / Tool | `works/07｜行迹 · The Personal Atlas/行迹旅行手札 3/本地版/` |
| 12 | 爪爪衣橱 Pawmoire | 网站（需要服务器，线上版另有地址） / Hosted web app | `works/05｜爪爪衣橱· Pawmoire｜宠物换装/` |
| 13 | 序章 Prologue | 工具 / Tool | `works/03｜序章 · Index ｜日程&计划/` |
| 14 | 毛孩子日历 Pet Calendar | 工具 / Tool | `play/pet-calendar/` |
| 15 | 深夜汤馆 Situation Puzzles | 游戏 · AI · 多人解谜 / AI-hosted multiplayer puzzle game | [在线游玩](https://mystery.yueruchen.online/) |

## 运行说明 · Running the projects

Gesture experiments need camera access and a network connection to load the hand-tracking model. Camera frames are processed on your device. Situation Puzzles runs on a separate service. You can join a room by code and sign in to save a personal puzzle collection.

- 深夜汤馆的游戏后端在在线服务运行，GitHub Pages 仅提供作品集入口；网站现已公开，任何持有链接的人可打开；保存个人题库仍需登录。项目介绍与迭代记录位于 `works/15｜深夜汤馆 · Situation Puzzles/`。

- 手势类作品需要摄像头和网络（用来加载 MediaPipe 手势模型）。画面只在本机处理，不会上传。
- `play/` 里的版本为了能在 GitHub Pages 上独立运行，做了少量调整：
  - 绽放：把 47MB 的单文件拆成页面和 6 组花朵帧
  - 理大食乜机：菜式数据改成随页面附带的只读快照
  - 流场花园：保存按钮改成直接下载
- 以下内容没有放进仓库：zip 压缩包（与文件夹里的内容重复）、`.openai` 部署配置、各项目 `.gitignore` 里排除的文件（依赖、环境变量等）。

© Crystal
