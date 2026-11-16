# Development history / 迭代历史

Dates use Hong Kong time. 复盘记录问题与调整方向，版本说明记录实际改动。

## 2026-11-16 · v1 · 首次制作 / Initial build

**深夜汤馆与共同解谜 / Late-night soup house & shared mysteries**

建立暗绿与暖金的汤馆界面，整理36道去重参考题并加入1道原创试玩题。支持搜索筛选、单人及房间码多人游玩、AI或房主真人主持、四种回答、共享提问次数、记录与线索板；加入个人便签、手写与导入题库，以及私人／指定房间／公开可见范围。已检查权限隔离、汤底保密和并发计次。

Built a dark-green and warm-gold soup-house interface, with 36 deduplicated reference stories and one original practice puzzle. Added search and filters, solo and room-code multiplayer, AI or human hosting, four answer types, shared question limits, history and a clue board. Personal notes, writing/import tools and private/room/public puzzle scopes are included. Authorization, solution secrecy and concurrent quotas were checked.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

试用后发现，“来一碗想不通的汤”读起来不自然。

The original soup metaphor felt unnatural during use.

**下一轮方向 / Direction for the next stage**

让首页邀请更简洁，保留深夜讲故事的氛围。

Make the invitation simpler while keeping the late-night storytelling mood.

## 2026-11-16 · v1.1 · 首页文案 / Homepage copy

**故事才刚开始 / The story is just beginning**

将首页标题改为“夜深了，故事才刚开始。”，同步精简介绍文案。

Changed the homepage headline to “夜深了，故事才刚开始。” and shortened the introduction.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

只问了题型和少量事实，右侧就显示了完整汤底，推理过程被打断。

The clue board revealed the full solution after only a few basic questions, interrupting the mystery.

**下一轮方向 / Direction for the next stage**

限制线索来源，避免提前透露尚未问出的信息。

Restrict clue sources so unasked details stay hidden.

## 2026-11-16 · v1.2 · 线索防剧透 / Spoiler-safe clues

**线索只引用玩家提问 / Clues quote player questions**

线索板改为引用玩家已提出且获肯定的问题；同步过滤旧记录，排除题型类提问。

Changed the clue board to quote confirmed player questions, applied the same filter to older records, and excluded puzzle-type questions.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

次数用完后仍想继续猜；还原完整故事时，只回答“是”缺少完成感。选下一道题也需要离开当前页面。

Reaching the limit did not mean wanting to stop; a plain yes lacked closure after reconstructing the story. Choosing another puzzle also meant leaving the room view.

**下一轮方向 / Direction for the next stage**

让继续推理、确认猜对和进入下一局衔接得更顺畅。

Make continuing, recognizing a solution and starting another round flow smoothly.

## 2026-11-16 · v1.3 · 揭晓与下一碗 / Reveals and next puzzles

**猜中真相，继续下一碗 / Solve the mystery, choose the next**

提问达到15次或设定上限时可选择立即解锁或继续猜，超限显示负数，不限模式保持不限。约95%语义还原时提示接近真相，99%或完整猜对时回复“完全正确！”并展示汤底；真人主持可手动判断。加入本局随机换汤、关键词搜索及难度筛选，多人由房主操作。移除游戏内内容提示框。

Added optional reveals at 15 questions or the configured limit, with continued questioning and negative remaining counts; unlimited stays unlimited. Semantic completion around 95% prompts an optional reveal; 99% or a complete reconstruction gives “完全正确！” and opens the solution. Human hosts can make the same judgments. Added in-room random selection, search and difficulty filtering, controlled by the multiplayer host. Removed the in-game content notice.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

普通提问和完整故事共用入口，不容易区分；次数快用完时，也缺少整理推理的引导。

Ordinary questions and complete reconstructions shared one input mode, with little guidance near the limit.

**下一轮方向 / Direction for the next stage**

增加主动核验的入口，并在合适的时机提醒整理完整故事。

Provide a clear verification entry and timely prompts to assemble the whole story.

## 2026-11-16 · v1.4 · 主动核验 / Story verification

**讲出故事，核验推理 / Tell the story, check the reasoning**

提问区新增“核验故事”，支持文字和语音输入，按语义判断完整推理。通过后揭晓，未通过可继续猜。剩余3次、满15问及次数用完时提供核验入口。

Added “核验故事” for typed or spoken reconstructions, checked by meaning. Passing reveals the solution; failed attempts can continue. Verification is also available at three remaining questions, 15 questions and the limit.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

挑选下一道题时，无法直接分辨哪些已经玩过、知道了汤底。

It was hard to distinguish new stories from those whose solutions were already known.

**下一轮方向 / Direction for the next stage**

保留可管理的游玩标记，让选题和重新挑战更方便。

Keep manageable played markers to support choosing new stories and replaying old ones.

## 2026-11-16 · v1.5 · 品汤档案 / Played puzzle archive

**记住喝过的汤 / Remember the stories you played**

新增“已玩过”标签和“我的档案”，支持逐题或全部清除标记。记录仅保存在当前浏览器，不保存汤底。

Added played labels and a personal archive with individual and full reset controls. Records stay in the current browser without solution text.

## Related milestones / 相关里程碑

- **2026-11-16** — 配置服务端 AI 密钥并重新部署，真实提问验证了“是／不是”、线索收集、次数累计与汤底隐藏。此项是配置及验证，不另计一个代码版本。

  Configured the server-side AI secret and redeployed. Live questions verified yes/no answers, clue collection, question counting and solution secrecy. Configuration and verification are not counted as another code version.

- **2026-11-16** — 添加 mystery.yueruchen.online 自定义域名并配置DNS；接入作品集时HTTPS已激活，平台仍在完成域名路由发布。

  Added mystery.yueruchen.online and configured DNS. HTTPS was active at portfolio integration, while the platform was completing domain routing.
