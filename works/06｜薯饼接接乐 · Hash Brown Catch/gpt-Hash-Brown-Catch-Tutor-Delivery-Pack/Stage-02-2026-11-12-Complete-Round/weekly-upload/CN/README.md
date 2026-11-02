# Hash Brown Catch 阶段 02 完整单局

面向喜欢可爱像素风与短局挑战的休闲玩家。玩家移动篮子接取薯饼，游戏以计分、动画与音效回应。

## 当前范围

保留核心交互，加入默认 60 秒完整单局、焦黑薯饼 −10、炸弹 −20、简单／适中／困难／地狱／自定义、逐渐加速、按难度记录本机最高分。自定义可选 30／60／90／120 秒。没有长期金币、商城、道具和彩蛋。

## 运行与操作

需要现代桌面或手机浏览器；本地启动需要 Python 3。仓库按 game/ 存放源码时，在根目录执行 python3 -m http.server 8000，然后打开 http://localhost:8000/game/ 。Windows 可以用 py -3 -m http.server 8000。解压本地包时可直接运行 Launch-Game.py。鼠标、触控、左右键或 A/D 移动，Space/P 暂停。音效需首次交互后启动。无需 API key 或其他秘密配置。

## 小组分工 建议并待实际确认

- CHEN Yueru：完善危险物辨识、难度说明和结算界面，检查界面文字与玩法是否一致。
- MA Qianran：核对难度、危险物、计时暂停及高速碰撞，修复实际发现的问题。
- LI Jiarui：检查完整一局、重玩、最高分和手机操作，并记录实际结果。

## 项目与记录入口

- 仓库：https://github.com/sd5913/Hash-Brown-Catch
- 看板：https://github.com/orgs/sd5913/projects/6
- 试玩／下载：[待填实际可访问 URL；未发布前使用本地包]
- 本周进度：docs/progress/2026-11-12.md
- 检查记录：docs/tests/
- 素材与 AI：docs/credits.md

## 限制

本地存档不跨设备、浏览器、端口或阶段同步。浏览器禁用存储时可能仅当前会话保存。没有登录系统、云存档和全球排行榜。独立启动文件需要 Python 3；手机运行需要可访问的 HTTP 服务。未假设任何线上地址对教授可访问。实际兼容性、玩家测试与 tutor 意见待补充。

## 检查

Node.js 仅用于可选规则检查：进入 game 后运行 node check-stage.cjs。生成时检查见 docs/BUILD_CHECKS.txt；团队需另外记录自己的测试。
