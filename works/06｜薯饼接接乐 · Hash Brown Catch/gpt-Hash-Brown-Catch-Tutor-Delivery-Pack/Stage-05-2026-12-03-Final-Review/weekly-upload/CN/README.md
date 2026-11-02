# Hash Brown Catch 阶段 05 最终评审版本

面向喜欢可爱像素风与短局挑战的休闲玩家。玩家移动篮子接取薯饼，游戏以计分、动画与音效回应。

## 当前范围

保留第四阶段功能，新增画面下方简明规则和分数／金币说明、独立 Delivery Guide、结算页 R 键重玩及可见按键提示。重点是交付清晰度和操作完善；这只是为最终评审准备的版本，实际最终状态需根据之后测试和 tutor 意见更新。

## 运行与操作

需要现代桌面或手机浏览器；本地启动需要 Python 3。仓库按 game/ 存放源码时，在根目录执行 python3 -m http.server 8000，然后打开 http://localhost:8000/game/ 。Windows 可以用 py -3 -m http.server 8000。解压本地包时可直接运行 Launch-Game.py。鼠标、触控、左右键或 A/D 移动，Space/P 暂停。音效需首次交互后启动。无需 API key 或其他秘密配置。

## 小组分工 建议并待实际确认

- CHEN Yueru：检查视觉一致性、准备视频和整体演示，确认视频与最终游戏匹配。
- MA Qianran：负责最后修复和规则回归，准备核心代码讲解。
- LI Jiarui：检查 README、版本包、看板及权限，汇总三人真实贡献及证据链接。

## 项目与记录入口

- 仓库：https://github.com/sd5913/Hash-Brown-Catch
- 看板：https://github.com/orgs/sd5913/projects/6
- 试玩／下载：[待填实际可访问 URL；未发布前使用本地包]
- 本周进度：docs/progress/2026-12-03.md
- 检查记录：docs/tests/
- 素材与 AI：docs/credits.md

## 限制

本地存档不跨设备、浏览器、端口或阶段同步。浏览器禁用存储时可能仅当前会话保存。没有登录系统、云存档和全球排行榜。独立启动文件需要 Python 3；手机运行需要可访问的 HTTP 服务。未假设任何线上地址对教授可访问。实际兼容性、玩家测试与 tutor 意见待补充。

## 检查

Node.js 仅用于可选规则检查：进入 game 后运行 node check-stage.cjs。生成时检查见 docs/BUILD_CHECKS.txt；团队需另外记录自己的测试。
