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

## 2026-11-16 · v1.4 · 主动核验 / Story verification

根据作者试用反馈，在提问区加入“核验故事”，可输入或口述完整推理，按语义而非原文核对；通过后揭晓，未通过则鼓励继续推理而不泄露汤底。剩余3次时提示立即核验或再猜猜，15问及次数用完的提醒也加入核验入口。

Following author tryouts, added a dedicated story-verification mode for typed or spoken reconstructions. Semantic agreement passes; incomplete attempts receive encouragement without solution hints. Added a three-questions-left prompt and verification access from the 15-question and limit reminders.

## 体验复盘 · 作者试用 / Experience reviews · Author tryouts

### 首页文案 · 体验复盘 / Author tryout

**观察与反馈 / Observation & feedback:** 作者试用后觉得“来一碗想不通的汤”读起来奇怪，汤馆主题与中文表达需要更自然地衔接。

The author found the original headline awkward and wanted more natural Chinese wording.

**提出的调整及对应迭代 / Proposed change and iteration:** 保留深夜氛围，提出改用“故事才刚开始”；下一版据此调整标题及介绍。

Keep the late-night mood and revise the invitation to “the story is just beginning”; the next stage updates the copy.

### 线索防剧透 · 体验复盘 / Author tryout

**观察与反馈 / Observation & feedback:** 作者仅询问题型和少量事实，就发现右侧线索板提前显示完整汤底，直接破坏了推理体验。

During a tryout, the author saw the clue board reveal the full solution after only a few basic questions.

**提出的调整及对应迭代 / Proposed change and iteration:** 作者要求避免提前剧透；下一版取消AI线索摘要，只引用玩家已提出并获肯定的内容，同时过滤旧记录。

The author requested spoiler prevention; the next stage removes generated summaries and quotes only confirmed player questions, including legacy records.

### 揭晓与下一碗 · 体验复盘 / Author tryout

**观察与反馈 / Observation & feedback:** 作者提出次数达到上限后仍想继续推理；接近或已猜对完整故事时，仅回答“是”缺少完成反馈，也不方便在本页继续挑选下一道汤。

The author wanted to keep guessing past the limit, receive completion feedback for reconstructed stories, and choose the next puzzle in the room.

**提出的调整及对应迭代 / Proposed change and iteration:** 依建议加入继续猜与负数计次、接近真相提示、完整猜对揭晓，以及随机换汤和搜索筛选入口。

Add optional overtime, near-solution prompts, correct-story reveals, and in-room random selection and search.

### 主动核验 · 体验复盘 / Author tryout

**观察与反馈 / Observation & feedback:** 作者试用后提出，应有独立入口提交完整故事核验；“我猜出来了 · 核验故事”过长，次数快用完时也需要更清晰的引导。

The author requested a dedicated full-story check, a shorter button label, and clearer guidance near the question limit.

**提出的调整及对应迭代 / Proposed change and iteration:** 将按钮简化为“核验故事”，支持文字或语音；剩3次、满15问或超限时提供核验入口，未通过可继续猜且不泄露答案。

Use “核验故事”, support text or voice, and offer verification at three remaining questions, 15 questions or the limit, without revealing answers on failed attempts.

## 2026-11-16 · v1.5 · 品汤档案 / Played puzzle archive

根据作者提出的复玩辨识需求，实际查看汤底后显示“已玩过”标签，加入“我的档案”，支持逐题或全部清除标记。记录只保存在当前浏览器，不保存汤底，不跨设备同步。

Following the author’s replay-identification request, mark a puzzle as played after its solution is viewed. Added a personal archive with per-puzzle and full reset controls. Records remain in the current browser without solution text or cross-device synchronization.

**体验复盘 · 作者试用 / Author tryout**

观察与反馈：作者提出，玩过且已经知道汤底的题目需要明显标记，方便挑选新故事；同时希望能够自行去掉标记。

The author requested visible labels for stories whose solutions are already known, with a way to clear those labels.

提出的调整及对应迭代：下一版加入“已玩过”标签和“我的档案”，只在实际看过汤底后记录，提供逐题及全部清除，并明确浏览器本地保存范围。

Add played labels and a personal archive after actual solution viewing, with individual/full resets and clear browser-local storage wording.

## Related milestones / 相关里程碑

- **2026-11-16** — 配置服务端 AI 密钥并重新部署，真实提问验证了“是／不是”、线索收集、次数累计与汤底隐藏。此项是配置及验证，不另计一个代码版本。

  Configured the server-side AI secret and redeployed. Live questions verified yes/no answers, clue collection, question counting and solution secrecy. Configuration and verification are not counted as another code version.

- **2026-11-16** — 添加 mystery.yueruchen.online 自定义域名并配置DNS；接入作品集时HTTPS已激活，平台仍在完成域名路由发布。

  Added mystery.yueruchen.online and configured DNS. HTTPS was active at portfolio integration, while the platform was completing domain routing.

## Recorded author feedback / 作者反馈

“来一碗想不通的汤”被作者认为不自然，因此改为“夜深了，故事才刚开始。”。此反馈来自实际对话，不代表外部用户研究。

The author found the original headline unnatural. The revised wording preserves the late-night mood while inviting players into a story; no external user study is claimed.
