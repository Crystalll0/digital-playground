# 深夜汤馆 · Situation Puzzles

迭代记录合并为10个功能阶段，日期为香港时间。

## 阶段 1 / Stage 1 · 创建单人和多人解谜功能

2026-11-16

建立暗绿暖金界面与37道去重题库，支持搜索筛选、单人、房间码合作、AI或真人主持、问答记录、线索和题库创作导入。

Create solo and cooperative puzzles

Built the green-and-gold interface with 37 puzzles, search, solo and room-code cooperation, AI/human hosting, shared logs, clues and puzzle authoring/imports.

## 阶段 2 / Stage 2 · 修改首页文案、修复剧透并新增中英文

2026-11-16

精简首页标题和介绍；线索板只引用已获肯定的玩家提问，过滤旧记录中的剧透。新增中英文切换，记住语言偏好。

Update copy, fix spoilers and add Chinese/English

Simplified homepage copy, restricted clues to confirmed player questions, and filtered older spoilers. Added Chinese/English switching with remembered preference.

## 阶段 3 / Stage 3 · 新增故事核验、揭晓和换题功能

2026-11-16

按语义核验完整故事，猜对后揭晓，接近真相及次数用完时提供提醒；可超限继续猜，并在局内随机或搜索换题。

Add story verification, reveals and puzzle switching

Added semantic story verification, solve reveals and progress/limit prompts, optional overtime, and in-room random selection/search.

## 阶段 4 / Stage 4 · 新增游玩档案、排行榜和进度存档

2026-11-16

新增已玩标签、可删除的游玩／对抗记录与私人存档。支持复盘、按用时或提问次数查看最终排行榜，并从存档继续为单人或合作房间。

Add records, rankings and resumable saves

Added played labels, deletable play/competitive records and private saves, reviews, time/question rankings, and resume into solo/cooperative rooms.

## 阶段 5 / Stage 5 · 新增首次访问指引与昵称设置

2026-11-16

各页面首次显示可跳过的店主引导；修复弹窗、箭头和反复滚动，保存默认昵称并支持房间内改名。

Add first-visit guides and nickname settings

Added skippable first-visit tours, fixed card/arrow positioning and repeated scrolling, and saved default and editable room nicknames.

## 阶段 6 / Stage 6 · 新增提示、匿名投票并优化语音输入

2026-11-16

提示独立计次，AI给方向或由真人DM确认发送。多人提示及上限修改采用10秒匿名投票、平票加时和60秒申请间隔。支持Enter发送，优化录音状态、时长和长文本转写。

Add hints, anonymous voting and voice improvements

Added counted AI/human hints, ten-second anonymous ballots with tie extensions and request cooldowns, Enter submission, and improved recording feedback and long transcription.

## 阶段 7 / Stage 7 · 扩展链接读取并新增图片文字识别

2026-11-16

支持公开网页及分享跳转，导入弹窗显示读取和解析结果；可上传、粘贴、拖入图片，识别为可编辑文字，检查后保存。登录墙、图片网页等仍可能无法直接读取。

Expand link imports and add image OCR

Added public webpages and checked redirects, visible import feedback, and upload/paste/drop image OCR with editable review before saving. Login walls and image-only pages may still block extraction.

## 阶段 8 / Stage 8 · 新增对抗模式与多DM主持

2026-11-16

对抗局全员准备后统一开局，各自问答和提示互相隔离，只公开对手进度。支持多位自愿DM、稍后决定主持、名额上限投票及知情者旁观，修复模式单选。

Add competitive play and multiple human DMs

Added synchronized competitive starts, private question/hint histories and status-only opponents, plus volunteer multiple DMs, deferred hosting, capacity votes and informed spectators; fixed exclusive mode selection.

## 阶段 9 / Stage 9 · 修复换汤与核验，新增反馈和管理员评级

2026-11-17

按题目隔离汤底请求，避免换汤后泄露答案或误标已玩；完整故事增加关键事实与矛盾复核，接近时提示继续补充。新增难度建议、好评／差评、理由与修改方案，管理员登录后可查看全部反馈；支持手动标记已玩、档案统计和题库通关提示，并修正题型判断、英文标点与排版，移除汤底额外说明。 管理员入口改为连续点击Logo19次并验证口令；首次设置／重置需原管理员账号授权，可记住设备30天、随时退出，并在线调整公开题库难度，所有访客同步生效。

Fix puzzle switching and verification; add feedback and administrator ratings

Isolate solution requests by puzzle to prevent cross-round reveals and incorrect played markers. Independently audit core facts and contradictions, with an almost-there prompt for incomplete reconstructions. Add difficulty suggestions, optional ratings, reasons and proposed edits, plus authenticated administrator review. Add manual played markers, archive statistics and a completion dialog; correct genre answers, English punctuation and layout, and remove editorial solution addenda. Reveal administrator access with 19 consecutive logo clicks and a server-verified passphrase. Initial setup/reset requires the existing administrator account; optionally remember a device for 30 days, sign out at any time, and edit public puzzle difficulty for all visitors.

## 阶段 10 / Stage 10 · 对抗随机题排除所有参赛者已玩题目

2026-11-17

每位玩家准备时同步当前浏览器的已玩标记，包含手动标记及看过汤底的题目。全部参赛者准备后，排除所有人的已玩题合集，再随机抽取共同未玩题；没有符合条件的题目时提示无法开局，不揭题、不计时。支持两人或多人，退出玩家不参与筛选，个人已玩清单不向对手公开。

Exclude every participant's played puzzles from competitive draws

Sync each participant's current-browser played markers when they ready up, including manual markers and revealed solutions. Once everyone is ready, exclude the union of all active participants' played puzzles and draw from the remaining shared unseen pool. If none remain, keep the lobby sealed and untimed with a clear message. Supports two or more players, excludes withdrawn players, and keeps individual played lists private.
