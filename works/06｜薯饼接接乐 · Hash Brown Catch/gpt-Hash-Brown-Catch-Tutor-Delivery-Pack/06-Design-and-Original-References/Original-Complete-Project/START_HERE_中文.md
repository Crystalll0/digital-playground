# Hash Brown Catch 接住薯饼！完整项目包

## 最快开始

1. **先完整解压 ZIP**，不要在压缩包内直接运行。
2. **Mac：**双击 `Start-Game-Mac.command`。若 macOS 未保留执行权限，在终端进入本文件夹，运行 `python3 Launch-Game.py`。
3. **Windows：**双击 `Start-Game-Windows.bat`；或运行 `py -3 Launch-Game.py`。
4. 浏览器会自动打开游戏。保留终端窗口，结束时按 Ctrl+C。

需要 Python 3；启动脚本不需要安装额外 Python 包。也可以用 VS Code 的 Live Server 打开 `Game-and-Website` 文件夹。
**不要直接双击 index.html 运行**：p5.js 加载背景图时需要通过本地 HTTP 服务。
游戏运行所需的 p5.js、字体和图片已包含；本地启动后无需依赖在线素材或 API Key。

## 包含内容

- **Game-and-Website/**：完整英文网站与小游戏、难度与自定义设置、碰撞、帧动画、音效代码、长期金币、商城、装扮、三种道具及土豆狗彩蛋。
- **Game-and-Website/assets/**：三张场景原图、字体、p5.js 和相应许可文件。薯饼、幽灵、炸弹、道具与土豆狗精灵由游戏代码实时绘制。
- **Game-and-Website/_reel/**：视频演示场景、镜头编排及录制页面的可编辑 HTML/JavaScript 源代码。
- **Video-and-Audio/**：36 秒 1080p / 30fps MP4、原创音乐与音效混合 WAV、音频生成脚本、分镜联系表。
- **UI-and-IP-Concepts/**：最初中英文设定板，以及 Crunch Club、Butter Morning、Potato Panic 三个视觉方向。
- **UI-Development-Previews/**：网页、角色修改、薯饼堆叠和商城的历史预览；以 `Game-and-Website` 中的当前可运行版本为准。
- **MANIFEST_SHA256.json**：各文件的大小与 SHA-256 校验值。

## 在线版

https://hash-brown-crunch-club.wry-toast-5992.chatgpt.site

在线版目前为私密访问，需要使用有访问权限的 ChatGPT 账号登录。这个本地项目包可以独立运行。

## 游戏说明

鼠标移动/拖拽、触屏拖拽，或键盘方向键 / A、D 控制篮子。空格暂停。
普通薯饼 +10 分并立即存入 2 金币；漏接 −2 分；焦黑薯饼 −10 分；炸弹 −20 分。
漏接和危险物不会扣长期钱包。闹钟 +5 秒（每局上限 +15 秒）、咖啡减速 4 秒、可乐提供一次护盾。
每局约 12% 概率安排一次原创土豆狗来访；接到后本局之前与之后赚取的金币全部翻倍，每局最多一次。
商城为外观解锁，价格为 60／120／240 游戏金币。

钱包、穿戴和最高分保存在当前浏览器的 localStorage；不同浏览器、设备、网站域名或本地端口不会自动共享进度。本包不包含个人浏览器存档或账号凭证。

## 修改和检查源码

主要文件：`index.html`、`style.css`、`game.js`、`game-core.js`、`economy.js`、`shop.js`、`shop.css`。
若电脑安装了 Node.js，在 `Game-and-Website` 内执行：

```sh
node check-rules.cjs
node check-progression.cjs
```

Node.js 仅用于规则检查，不是运行游戏所必需。

## 视频演示源文件

启动本地游戏后，在浏览器打开 `http://localhost:8000/_reel/capture.html`（如启动脚本显示其他端口，以实际端口为准）。
点击 **RENDER DEMO REEL**，完成后点击 **DOWNLOAD CAPTURE**。此页面使用独立的演示存档，不影响正常游戏的钱包。
录制页输出 IVF 或 WebM；用 FFmpeg 合成 WAV 音轨后导出 MP4。现成 MP4 已在 `Video-and-Audio` 中，可直接播放。
可编辑 `Game-and-Website/_reel/director.js` 中的字幕、时间线与镜头；`engine.js` 是用于安排功能演示的游戏引擎副本。
配乐重新生成需要 Python 3 和 NumPy：运行 `Video-and-Audio/make_audio.py`。
这些是 HTML/JavaScript 视频演示源代码与音频素材，非 After Effects 或 Premiere 工程文件。

## 制作记录

概念和设计方向由 Crystal Chen 提出并迭代；ChatGPT 协助实现、绘制代码精灵、生成背景及制作演示视频。
本包保留最初的视觉方案和当前可运行版本；历史概念图中的 UI、角色及占位数值可能与最终游戏不同。
演示视频使用安排好的功能展示场景，含彩蛋效果演示。完整技术说明见 `Game-and-Website/README_SOURCE.md`。
