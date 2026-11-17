# 深夜汤馆 · Situation Puzzles

夜深了，故事才刚开始。  
A late-night lateral thinking mystery game, designed by Crystal Chen.

**Live site / 在线入口:** [mystery.yueruchen.online](https://mystery.yueruchen.online/)  
**Platform URL / 平台入口:** [Situation Puzzles](https://situation-puzzles-crystal.wry-toast-5992.chatgpt.site/)

> Current access: public. Anyone with the link can open the game and join a room. Sign-in is required to save a personal collection; private puzzle scopes and hidden solutions remain protected. 网站现已公开，保存个人题库需登录，私人题目和未揭晓的汤底仍受保护。

## Language / 语言

Use the EN / 中文 control in the header. The browser remembers the selection. Common controls switch directly; puzzle text and dynamic interface content are translated on demand using the configured AI service, so the first English view may take a moment and requires working API access. Nickname and input values are preserved, and option values remain stable. English voice input and standard-answer readout follow the selected language. Automated translation quality still needs bilingual playtesting.

The portfolio groups this project into ten functional stages. Both stage and date views use the same history. The Works grid features Situation Puzzles beside Nocturne Bloom, followed by alternating rows of three small and two large cards.

## Experience / 玩法

- Play solo or join the same room using a custom or random numeric room code.
- Choose an AI host or a human host. Ordinary questions receive 是 / 不是 / 是与不是 / 无关; a complete semantic reconstruction receives 完全正确！ and opens the solution.
- Review shared questions and confirmed clues; keep unconfirmed thoughts in a private browser-local notebook.
- Change the shared question limit during play, including unlimited. At 15 questions or the configured limit, choose to unlock or keep guessing; remaining counts stop at zero.
- Submit a complete reconstruction through “核验故事” using text or voice. Meaning matters rather than exact wording; failed checks do not reveal missing facts. A reminder at three remaining questions and the 15-question/limit dialogs offer direct access. Each submission counts as one question.
- An independent audit checks key facts and contradictions before accepting a reconstruction. Near-complete answers invite more detail without automatically revealing the solution. Human hosts can also mark near-complete or correct guesses.
- Select another puzzle without leaving the room: random, keyword search or difficulty filter. The room host controls shared puzzle changes.
- Clues quote confirmed player questions rather than AI-generated solution summaries, including when reading older records.
- Search and filter 36 deduplicated reference stories plus one original practice puzzle.
- Write puzzles manually, save drafts, import structured TXT/JSON or paste text. Optional AI generation and revision require server-side API access.
- Choose private, designated-room or public puzzle visibility. Players do not receive the solution until reveal; human hosts and authors can know it in advance.

单人或房间码多人共同解谜；可选择 AI 店主或由房主担任真人 DM。共享提问记录、确认线索与次数，个人猜想留在私有便签。支持题库搜索筛选、上传、在线创作及三种可见范围。

## Cooperative and competitive rooms / 合作与对抗

Cooperative rooms solve one story together with shared question and hint counts. Competitive rooms draw an AI-hosted puzzle unseen by every active participant, using each player’s current-browser played markers submitted when ready. The draw occurs only after everyone is ready; no shared unseen candidates means the lobby stays sealed and untimed. at least two players must all click Start before it is revealed and the shared clock begins. Each player sees only their own questions, clues, hints and counts. Opponents show question and failed-verification counts, near-solution, verified-success and withdrawal statuses. First successful story verification wins; others can continue or withdraw. Hints and counts are individual, and room-wide changes or premature reveals are blocked. Players may withdraw or leave; rejoining after the start is disabled for new members. Start time is shared, while each browser receives it on the room synchronization poll.

API tests cover sealed lobby visibility, readiness, private records, status-only opponent data, winner recognition and withdrawal guards. Real multiplayer browser play still needs broader testing.

## Hints, voice and imports / 提示、语音与导入

- Hints have a separate shared limit (default 3; 0 means unlimited). Solo players can change the limit immediately. In multiplayer, both requesting a hint and changing the limit need an anonymous timed ballot. After 10 seconds, more yes than no passes; more no rejects. Abstentions do not enter the comparison. A tie receives one five-second extension, settled as soon as a majority appears; another tie ends the request. Each player shares a 60-second initiation cooldown across both request types. The initiator starts with a yes vote, and votes can change before settlement. Only an approved, delivered hint reserves a slot; failures consume none.
- AI hints are short directional nudges with a spoiler check; human hosts can write a hint or preview an AI suggestion before sending. Hint generation is not a guarantee against every possible spoiler.
- Enter submits and Shift+Enter inserts a line break, with Chinese IME composition protected.
- Click to start recording and click again to stop. A timer and microphone input meter show recording state, with a two-minute ceiling. Transcripts are appended for manual review, with longer text retained. Actual microphone accuracy still requires device testing.
- Import links may point to public webpages or share redirects. Login walls, automation restrictions and image-only pages may prevent extraction. Loading and error feedback appear inside the dialog.
- PNG/JPG/WebP images up to 5MB can be uploaded, pasted or dropped into the import dialog. Preview and AI OCR produce editable text; review and parse it before saving. Link reading, OCR and saving require sign-in. No extracted content is automatically published.

Timed ballot checks cover majority outcomes, abstentions, ties, extensions, anonymity, shared cooldowns, failed-generation refunds, human-host approval and concurrent settlement. The hint/voting/import/OCR paths passed mocked API integration checks, alongside existing room and secrecy tests. Real microphone and OCR accuracy are not established by these tests.

## Welcome and nicknames / 入馆引导与昵称

First visits show short host dialogue with highlights, arrows and subtle animation. Skip or close at any time; replay the current page guide from 入馆须知. Tour completion and default nicknames are saved in the current browser. Room display names can be changed at any time without changing previous message signatures. Story verification sits beside submitting a question.

## Personal archive / 我的档案

Viewing a solution marks that puzzle as played in the current browser. “我的档案” lists known stories and allows clearing one or all labels without deleting puzzles or room conversations. Visitors can use it without sign-in. Play records include permitted questions and answers, revealed solutions and available question/time/hint statistics. Personal records remain browser-local and can be deleted. Manual played markers also exclude stories from solo random draws and competitive selection.

实际查看汤底后显示“已玩过”，可在“我的档案”中逐题或一键清除。游玩记录可查看问答、已揭晓汤底及已记录的提问／用时／提示统计，仅保存在当前浏览器，不跨设备同步。可手动标记已玩；删除个人记录不会删除共享房间。

## Verification / 验证情况

Room authorization, solution secrecy, host-only settings, human answers, clues, scope changes, duplicate imports and concurrent question limits were checked. Browser checks covered room creation, example questions and editing controls. Live API tests confirmed yes/no answers, clue collection and question counting.

Voice transcription and AI-assisted puzzle writing are implemented but have **not yet completed live testing**. Room synchronization polls approximately every three seconds. No fixed player cap is imposed in the application, but this is not an unlimited-capacity or load-tested service.

语音识别与 AI 写汤尚未完成实测；多人同步约每三秒刷新。程序没有固定人数上限，但实际容量仍受托管资源及 API 限制影响。

The latest update passed focused clue/progress unit tests and the production build. The new semantic-completion flow still needs broader live playtesting.

最新一轮加入接近真相提示、猜对揭晓、超限继续猜，以及本局随机／搜索换汤。已通过线索和进度判断单元测试及生产构建；AI语义完成判断仍需更多真实对局验证。

## This portfolio archive / 作品集归档范围

This folder documents the live project and its development. GitHub Pages hosts the portfolio; the game backend and private puzzle records remain on the live service. No API keys, private user data or puzzle solutions are included here.

本目录收录介绍与迭代记录，游戏仍在在线服务运行；不把密钥、私人题库或汤底放进公开作品集。

See [CHANGELOG.md](CHANGELOG.md) for dated development records. All dates use Hong Kong time.

## Puzzle feedback / 题目反馈

Submit a difficulty suggestion and optional rating, reason or proposed changes beside the puzzle. Feedback Records shows your submissions. Click the top-left logo 19 times to reveal administrator access. The existing administrator account is required only to set or reset a 12–128-character passphrase. Thereafter the passphrase works without account sign-in, with optional 30-day device access. Administrators can review all feedback and edit public puzzle difficulty. Passphrases are stored as salted PBKDF2 hashes; device sessions are server-checked, expire automatically and are revoked by logout or passphrase reset. Normal Feedback Records shows only the visitor's own submissions.
