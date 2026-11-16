# Development history / 迭代历史

Dates use Hong Kong time. 复盘记录问题与调整方向，版本说明记录实际改动。

## 2026-11-16 · v1 · 首次制作 / Initial build

**创建单人和多人合作解谜功能 / Late-night soup house & shared mysteries**

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

**修改首页标题与介绍 / The story is just beginning**

将首页标题改为“夜深了，修改首页标题与介绍。”，同步精简介绍文案。

Changed the homepage headline to “夜深了，修改首页标题与介绍。” and shortened the introduction.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

只问了题型和少量事实，右侧就显示了完整汤底，推理过程被打断。

The clue board revealed the full solution after only a few basic questions, interrupting the mystery.

**下一轮方向 / Direction for the next stage**

限制线索来源，避免提前透露尚未问出的信息。

Restrict clue sources so unasked details stay hidden.

## 2026-11-16 · v1.2 · 线索防剧透 / Spoiler-safe clues

**修复线索板提前泄露汤底 / Clues quote player questions**

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

**新增猜对反馈、揭晓提醒和换题功能 / Solve the mystery, choose the next**

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

**新增完整故事核验功能 / Tell the story, check the reasoning**

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

**新增已玩标记和个人档案 / Remember the stories you played**

新增“已玩过”标签和“我的档案”，支持逐题或全部清除标记。记录仅保存在当前浏览器，不保存汤底。

Added played labels and a personal archive with individual and full reset controls. Records stay in the current browser without solution text.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

首次进入各页面时，缺少与汤馆氛围结合的功能介绍；核验入口与提问按钮分离，昵称的保存和房间改名方式也不够清楚。

First visits lacked an atmospheric introduction. Verification sat apart from submitting questions, and nickname persistence and room renaming needed clearer controls.

**下一轮方向 / Direction for the next stage**

用简短的店主对白带路，让主要操作集中在顺手的位置，并区分默认昵称和房间显示昵称。

Guide visitors with short host dialogue, group related actions, and distinguish default names from room display names.

## 2026-11-16 · v1.6 · 店主带路 / Guided first visit

新增分页面首次引导，以店主对白、高亮和箭头介绍功能，支持跳过、关闭和重看。首次引导后可保存默认昵称，开房自动带入；房间内可随时修改显示昵称。将“核验故事”移到提问按钮旁。

Added page-specific first-visit tours with host dialogue, highlights and arrows, plus skip, close and replay controls. A default nickname can be saved after the welcome and reused when entering rooms; room display names remain editable. Moved story verification beside the question button.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

试用时，弹窗固定在右下角，与功能区距离过远；箭头错位，房间页面还会被反复拉动。顶部介绍也漏掉了写汤入口。

Cards stayed in the bottom-right corner far from their targets. Arrows were misaligned and room polling repeatedly moved the page; the header tour missed the writing entry.

**下一轮方向 / Direction for the next stage**

让欢迎语独立居中，其余指引贴近目标，按页面从上到下介绍，并让滚动只发生在真正切换步骤时。

Center the welcome, place other cards near their targets, guide from top to bottom, and scroll only when changing steps.

## 2026-11-16 · v1.7 · 指引定位 / Anchored guide cards

欢迎弹窗居中且不显示箭头；后续弹窗按高亮区域就近定位，箭头连接真实边界。首页顺序调整为欢迎、顶部、中间入座区、下方汤单。顶部高亮包含写汤与新增上传题库入口。修复房间轮询导致引导反复滚动，缩小过大的高亮范围。

Centered the welcome without an arrow, anchored later cards beside highlighted targets, and connected arrows to measured edges. Reordered the homepage tour to welcome, header, seating actions and menu. Included writing and a new upload entry in the header highlight. Fixed repeated scrolling on room polls and narrowed oversized highlights.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

推理卡住时缺少轻微提示；多人调整提示次数需要共同决定。提问后希望直接按Enter发送，录音也存在内容截断和状态不清楚的问题。

Stalled reasoning needed light hints and shared control over their limit. Sending should work with Enter, while recording needed clearer state and fewer truncation problems.

**下一轮方向 / Direction for the next stage**

把提示与问答分别计次，加入全员表决；补齐键盘发送、录音反馈与长语音转写流程。

Count hints independently, add unanimous voting, and improve keyboard submission, recording feedback and longer transcription.

## 2026-11-16 · v1.8 · 轻提示与语音 / Hints and voice

新增独立计次的提示按钮，开局可设上限；AI给轻微方向，真人主持可自行填写或预览AI建议再发送。单人局内可直接修改，多人须全体成员同意。Enter发送、Shift+Enter换行，兼容中文输入法选字。录音改为点击开始／结束，增加计时和实时音量波形，最长2分钟；转写保留长文本、追加到输入框，采用中文提示和较完整的转写模型。

Added separately counted hints, configurable at setup. AI gives gentle directions; human hosts can write hints or preview AI suggestions before sending. Solo limits change immediately; multiplayer changes require unanimous consent. Enter sends and Shift+Enter adds a line, with IME protection. Recording uses click-to-start/stop with a timer and live input meter, up to two minutes. Longer transcripts are appended for review with Chinese context and the full transcription model.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

粘贴小红书链接后，读取和解析看起来没有反应；只支持知乎也限制了题库来源。截图里的题目还需要手动录入。

A pasted Xiaohongshu link appeared unresponsive, the Zhihu-only restriction narrowed sources, and screenshots required manual typing.

**下一轮方向 / Direction for the next stage**

扩大公开网页的读取范围，在弹窗内说明结果，并提供图片转文字入口，让内容先检查再导入。

Broaden public webpage support, keep feedback in the dialog, and add reviewed image-to-text imports.

## 2026-11-16 · v1.9 · 链接与图片导入 / Links and image imports

链接读取扩展至公开网页与分享短链接，逐次检查跳转地址。导入弹窗内显示加载、成功和失败原因，空内容不再显示解析成功。新增PNG/JPG/WebP图片上传、剪贴板粘贴和拖入，预览后识别原文并填入文本框，检查后再解析、保存。登录限制、反自动读取和纯图片网页仍可能无法读取；不会自动公开识别内容。

Expanded link reading to public webpages and short links with checked redirects. Loading and errors stay inside the import dialog, and empty inputs no longer appear successful. Added PNG/JPG/WebP upload, clipboard paste and drag-and-drop, followed by image preview and OCR into editable text before parsing or saving. Login walls, automated-access restrictions and image-only pages may still block URL extraction; recognized content is never automatically published.

### 体验复盘 · 试用记录 / Experience review · Tryout notes

**观察与反馈 / Observation & feedback**

房间人数多时，等待所有人同意容易让提示申请停滞；也需要避免连续发起申请，并保留不表态的选择。

In larger rooms, waiting for unanimous consent could stall requests. Repeated requests also needed a pause and a way to abstain.

**下一轮方向 / Direction for the next stage**

用短时匿名投票兼顾节奏与意愿，统一提示和次数修改的规则，并处理平票、弃票与申请间隔。

Use short anonymous ballots for both hints and limit changes, with clear tie, abstention and cooldown rules.

## 2026-11-16 · v1.10 · 匿名限时投票 / Timed anonymous ballots

多人查看提示和修改提示上限统一采用匿名投票：10秒后比较赞反票，弃票不计入；平票加时5秒，加时中出现多数即结算，仍平票则结束。发起者默认赞成，每位玩家两类申请共用60秒间隔，可查看倒计时和更改自己的选择。投票未通过或生成失败不扣提示次数，真人主持只在通过后发送提示。

Unified multiplayer hint requests and limit changes under anonymous ballots: compare yes/no totals after 10 seconds, ignoring abstentions. Ties get one five-second extension; a majority during the extension settles immediately, and another tie ends the request. Initiators default to yes; each player shares a 60-second initiation cooldown across both request types. Added countdowns and editable votes. Failed ballots or hint generation consume no hints; human hosts send only after approval.

### 体验复盘 · 试用记录

**观察与反馈**

合作解谜之外，还希望同房间玩家各自推理，比谁先还原真相，并能看到对手进展而不被剧透。

**下一轮方向**

增加统一开局计时的对抗模式，隔离个人记录，只公开进度，并提供弃权和退出。

## 2026-11-16 · v1.11 · 多人对抗 / Competitive rooms

**新增多人对抗模式 / Add multiplayer competitive mode**

新增随机封题的对抗房间，至少两人全部准备后统一展示汤面并计时。问答、线索、提示和计数按玩家隔离，仅公开对手的提问次数、核验失败次数、接近真相、核验成功和弃权状态。以首位核验成功判定胜出，支持弃权和退出；合作模式仍共享同一汤和提问、提示次数。

Added competitive rooms with a randomly sealed puzzle, revealed with a shared timer after at least two players are ready. Questions, clues, hints and counts stay private per player; opponents expose only counts and progress/withdrawal statuses. First successful story verification wins. Withdrawal and exit are supported; cooperative rooms retain shared questions and hints.

### 体验复盘 · 试用记录

观察与反馈：人工主持只能由房主担任，无法稍后决定或多人协作；对抗模式与朋友同桌也出现了同时选中的状态。

下一轮方向：拆分房主与DM权限，增加可投票调整的主持名额，同时让三个模式互斥选择。

## 2026-11-16 · v1.12 · 多DM与模式单选 / Multiple DMs and mode selection

**新增多位真人DM与名额投票，修复模式单选**

新增“真人主持·稍后决定DM”，开房设定DM名额上限，入房后可自行认领或退出。至少1位DM才能开局，进行中无人主持时暂停提问。修改上限采用匿名限时投票，不能少于在任人数。退出DM后保留知情旁观身份，不能提问或核验；同一问题只接受首条DM回答。修复朋友同桌与对抗模式同时选中的问题。

Added deferred human-host selection, initial DM capacity, and volunteer join/leave controls. At least one DM is required to start, and questions pause if none remain. Capacity changes use anonymous timed ballots and cannot remove occupied slots. Former DMs remain informed spectators and cannot ask or verify. Only the first answer is accepted. Fixed simultaneous cooperative/competitive selection.

### 体验复盘 · 试用记录

观察与反馈：先完成的玩家需要反馈和后续去向，完整榜单也应等其他玩家结束；个人档案还缺少问答复盘和暂停后继续游玩的入口。

下一轮方向：补齐个人完成提示、最终榜单和可回看的对抗记录，并将暂停进度保存为独立私人存档。

## 2026-11-16 · v1.13 · 排行榜与存档 / Leaderboards and checkpoints

**新增对抗排行榜、游玩记录与进度存档**

核验成功后显示完成顺序，其他玩家可继续；全员成功或弃权后展示最终排行榜。支持按用时或提问次数排序，记录提示次数及无提示标签。成功后可换汤、复盘或退出，稍后从对抗记录联网查看结果。档案新增游玩记录、对抗记录和存档，支持删除；存档保留进度并可继续为单人或合作新房间，删除私人存档不影响共享原房间。

Show completion order after verification while others continue; finalize standings when everyone solves or withdraws. Sort by time or question count and show hint use. Finished players can leave, review or play another puzzle, then refresh results from competitive records. Added deletable play records, competitive history and private checkpoints, resumable into new solo or cooperative rooms without changing the original shared room.

## Related milestones / 相关里程碑

- **2026-11-16** — 配置服务端 AI 密钥并重新部署，真实提问验证了“是／不是”、线索收集、次数累计与汤底隐藏。此项是配置及验证，不另计一个代码版本。

  Configured the server-side AI secret and redeployed. Live questions verified yes/no answers, clue collection, question counting and solution secrecy. Configuration and verification are not counted as another code version.

- **2026-11-16** — 添加 mystery.yueruchen.online 自定义域名并配置DNS；接入作品集时HTTPS已激活，平台仍在完成域名路由发布。

  Added mystery.yueruchen.online and configured DNS. HTTPS was active at portfolio integration, while the platform was completing domain routing.
