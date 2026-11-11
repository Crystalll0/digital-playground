# Digital Playground

Crystal 的数字游乐场，收录手势交互、生成艺术、小游戏和小工具。

**在线作品集：https://crystalll0.github.io/digital-playground/**

## 怎么看这个仓库

| 位置 | 内容 |
| --- | --- |
| `index.html` | 作品集首页 |
| `play/` | 每个作品整理好的最终版，可以直接在浏览器里打开试玩 |
| `works/` | 每个作品的全部原始文件和历史版本 |

仓库的提交记录按文件当时的修改时间排列，每次提交对应一个版本，所以在 **Commits / History** 里能看到每个作品是怎么一步步改出来的。要只看某一个作品的历史，在 `works/` 里打开它的文件夹，再点右上角的 **History**。

## 作品

| № | 作品 | 类型 | 试玩 |
| --- | --- | --- | --- |
| 01 | 手势 · 绽放 Nocturne Bloom | 手势 · 生成艺术 | `play/bloom/` |
| 02 | 手势 · 取景框 Gesture Window | 手势 | `play/window/` |
| 03 | 手势 · 星云 Gesture Nebula | 手势 · 粒子 | `play/nebula/` |
| 04 | 撕开现实 Tear Reality | 手势 · WebGL | `play/tear-reality/` |
| 05 | 流场花园 Flow Garden | 生成艺术 | `play/flow-garden/` |
| 06 | 薯饼接接乐 Hash Brown Catch | 游戏 | `play/hash-brown-catch/` |
| 07 | 理大食乜机 PolyU Lunch Machine | 游戏 · 工具 | `play/polyu-eats/` |
| 08 | 月隐 Moonveil | 网站 | `works/01｜月隐 · MOONVEIL ｜占卜/` |
| 09 | 安可工作室 Encore Studio | 网站 | `works/02｜安可工作室 · Encore Studio｜ 启德 · 手链/` |
| 10 | 纸间 Paper Room | 工具 | `works/04｜纸间 · Paper Room｜折纸&剪纸/PAPER-ROOM 3/dist/` |
| 11 | 行迹 The Personal Atlas | 工具 | `works/07｜行迹 · The Personal Atlas/行迹旅行手札 3/本地版/` |
| 12 | 爪爪衣橱 Pawmoire | 网站（需要服务器，线上版另有地址） | `works/05｜爪爪衣橱· Pawmoire｜宠物换装/` |
| 13 | 序章 Index | 工具 | `works/03｜序章 · Index ｜日程&计划/` |
| 14 | 毛孩子日历 Pet Calendar | 工具 | `play/pet-calendar/` |

## 说明

- 手势类作品需要摄像头和网络（用来加载 MediaPipe 手势模型）。画面只在本机处理，不会上传。
- `play/` 里的版本为了能在 GitHub Pages 上独立运行，做了少量调整：
  - 绽放：把 47MB 的单文件拆成页面和 6 组花朵帧
  - 理大食乜机：菜式数据改成随页面附带的只读快照
  - 流场花园：保存按钮改成直接下载
- 以下内容没有放进仓库：zip 压缩包（与文件夹里的内容重复）、`.openai` 部署配置、各项目 `.gitignore` 里排除的文件（依赖、环境变量等）。

© Crystal
