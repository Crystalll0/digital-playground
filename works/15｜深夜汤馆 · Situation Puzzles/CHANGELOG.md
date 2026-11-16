# Development history / 迭代历史

Dates use Hong Kong time. Initial work is grouped by actual change round rather than every deployment or configuration action.

## 2026-11-16 · v1 · 首次制作 / Initial build

**深夜汤馆与共同解谜 / Late-night soup house & shared mysteries**

建立暗绿与暖金的汤馆界面，整理36道去重参考题并加入1道原创试玩题。支持搜索筛选、单人及房间码多人游玩、AI或房主真人主持、四种回答、共享提问次数、记录与线索板；加入个人便签、手写与导入题库，以及私人／指定房间／公开可见范围。已检查权限隔离、汤底保密和并发计次。

Built a dark-green and warm-gold soup-house interface, with 36 deduplicated reference stories and one original practice puzzle. Added search and filters, solo and room-code multiplayer, AI or human hosting, four answer types, shared question limits, history and a clue board. Personal notes, writing/import tools and private/room/public puzzle scopes are included. Authorization, solution secrecy and concurrent quotas were checked.

## 2026-11-16 · v1.1 · 首页文案 / Homepage copy

**故事才刚开始 / The story is just beginning**

根据作者认为“来一碗想不通的汤”不自然的试用反馈，将首页标题改为“夜深了，故事才刚开始。”，介绍同步改为“有些故事，只讲了一半。独自推敲，或与朋友一起，拼回真相。”，并发布到原站点。

Following the author's feedback that the original soup metaphor sounded unnatural, revised the headline to “夜深了，故事才刚开始。” and simplified the supporting invitation to piece together the truth alone or with friends. Published the copy update to the existing site.

## 2026-11-16 · v1.2 · 线索防剧透 / Spoiler-safe clues

**线索只引用玩家提问 / Clues quote player questions**

修复初期提问就出现完整答案的问题：AI不再生成线索摘要，线索板只引用玩家已提出且得到肯定回答的问题；旧记录也经过同样过滤，题型问题不收集为线索。

Fixed premature solution disclosure: AI no longer writes clue summaries. The clue board quotes only player questions confirmed as true, filters legacy records, and excludes puzzle-type questions.

## 2026-11-16 · v1.3 · 揭晓与下一碗 / Reveals and next puzzles

**猜中真相，继续下一碗 / Solve the mystery, choose the next**

提问达到15次或设定上限时可选择立即解锁或继续猜，超限显示负数，不限模式保持不限。约95%语义还原时提示接近真相，99%或完整猜对时回复“完全正确！”并展示汤底；真人主持可手动判断。加入本局随机换汤、关键词搜索及难度筛选，多人由房主操作。移除游戏内内容提示框。

Added optional reveals at 15 questions or the configured limit, with continued questioning and negative remaining counts; unlimited stays unlimited. Semantic completion around 95% prompts an optional reveal; 99% or a complete reconstruction gives “完全正确！” and opens the solution. Human hosts can make the same judgments. Added in-room random selection, search and difficulty filtering, controlled by the multiplayer host. Removed the in-game content notice.

## Related milestones / 相关里程碑

- **2026-11-16** — 配置服务端 AI 密钥并重新部署，真实提问验证了“是／不是”、线索收集、次数累计与汤底隐藏。此项是配置及验证，不另计一个代码版本。

  Configured the server-side AI secret and redeployed. Live questions verified yes/no answers, clue collection, question counting and solution secrecy. Configuration and verification are not counted as another code version.

- **2026-11-16** — 添加 mystery.yueruchen.online 自定义域名并配置DNS；接入作品集时HTTPS已激活，平台仍在完成域名路由发布。

  Added mystery.yueruchen.online and configured DNS. HTTPS was active at portfolio integration, while the platform was completing domain routing.

## Recorded author feedback / 作者反馈

“来一碗想不通的汤”被作者认为不自然，因此改为“夜深了，故事才刚开始。”。此反馈来自实际对话，不代表外部用户研究。

The author found the original headline unnatural. The revised wording preserves the late-night mood while inviting players into a story; no external user study is claimed.
