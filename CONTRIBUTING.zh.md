# 为 OpenCode 做贡献 / Contributing to OpenCode

我们希望让你轻松地为 OpenCode 做贡献。以下是最常见的会被合并的更改类型： / We want to make it easy for you to contribute to OpenCode. Here are the most common type of changes that get merged:

Bug 修复 / Bug fixes
Additional LSPs / Formatters / 额外的 LSP / 格式化工具
LLM 性能改进 / Improvements to LLM performance
支持新的 providers / Support for new providers
修复特定环境的奇怪问题 / Fixes for environment-specific quirks
修复缺失的标准行为 / Missing standard behavior
文档改进 / Documentation improvements

但是，任何 UI 或核心产品功能都必须经过核心团队的设计审查才能实施。 / However, any UI or core product feature must go through a design review with the core team before implementation.

如果你不确定 PR 是否会被接受，可以随时询问维护者，或查找带有以下标签的 issues： / If you are unsure if a PR would be accepted, feel free to ask a maintainer or look for issues with any of the following labels:

[`help wanted`](https://github.com/anomalyco/opencode/issues?q=is%3Aissue%20state%3Aopen%20label%3Ahelp-wanted) — 需要帮助 / Help wanted
[`good first issue`](https://github.com/anomalyco/opencode/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22) — 适合首次贡献 / Good first issue
[`bug`](https://github.com/anomalyco/opencode/issues?q=is%3Aissue%20state%3Aopen%20label%3Abug) — Bug 报告 / Bug reports
[`perf`](https://github.com/anomalyco/opencode/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22perf%22) — 性能问题 / Performance issues

> [!NOTE] / 注意
忽略这些保护措施的 PR 可能会被关闭。 / PRs that ignore these guardrails will likely be closed.

想要认领一个 issue？留下评论，维护者可能会将它分配给你，除非我们已经在处理了。 / Want to take on an issue? Leave a comment and a maintainer may assign it to you unless it is something we are already working on.

## 添加新的 Providers / Adding New Providers

新的 providers 不需要太多（如果有的话）代码更改，但如果你想添加对新 provider 的支持，首先向以下仓库提交 PR： / New providers shouldn't require many if ANY code changes, but if you want to add support for a new provider first make a PR to:
https://github.com/anomalyco/models.dev

## 开发 OpenCode / Developing OpenCode

要求：Bun 1.3+ / Requirements: Bun 1.3+
从仓库根目录安装依赖并启动开发服务器： / Install dependencies and start the dev server from the repo root:

```bash
bun install
bun dev
```

### 针对不同目录运行 / Running against a different directory

默认情况下，`bun dev` 在 `packages/opencode` 目录中运行 OpenCode。要针对不同的目录或仓库运行： / By default, `bun dev` runs OpenCode in the `packages/opencode` directory. To run it against a different directory or repository:

```bash
bun dev <directory>
```

在 opencode 仓库本身根目录运行 OpenCode： / To run OpenCode in the root of the opencode repo itself:

```bash
bun dev .
```

### 构建 "localcode" / Building a "localcode"

编译独立的可执行文件： / To compile a standalone executable:

```bash
./packages/opencode/script/build.ts --single
```

然后运行它： / Then run it with:

```bash
./packages/opencode/dist/opencode-<platform>/bin/opencode
```

将 `<platform>` 替换为你的平台（例如 `darwin-arm64`、`linux-x64`）。 / Replace `<platform>` with your platform (e.g., `darwin-arm64`, `linux-x64`).

核心部分： / Core pieces:
`packages/opencode`：OpenCode 核心业务逻辑和服务器。 / OpenCode core business logic & server.
`packages/opencode/src/cli/cmd/tui/`：TUI 代码，使用 SolidJS 和 [opentui](https://github.com/sst/opentui) 编写。 / The TUI code, written in SolidJS with [opentui](https://github.com/sst/opentui).
`packages/app`：共享的 Web UI 组件，使用 SolidJS 编写。 / The shared web UI components, written in SolidJS
`packages/desktop`：原生桌面应用，使用 Tauri 构建（封装 `packages/app`）。 / The native desktop app, built with Tauri (wraps `packages/app`).
`packages/plugin`：`@opencode-ai/plugin` 的源码。 / Source for `@opencode-ai/plugin`.

### 理解 bun dev 与 opencode / Understanding bun dev vs opencode

在开发过程中，`bun dev` 是构建的 `opencode` 命令的本地等价物。两者运行相同的 CLI 接口： / During development, `bun dev` is the local equivalent of the built `opencode` command. Both run the same CLI interface:

```bash
# 开发（从项目根目录）/ Development (from project root)
bun dev --help           # 显示所有可用命令 / Show all available commands
bun dev serve            # 启动无头 API 服务器 / Start headless API server
bun dev web              # 启动服务器 + 打开 Web 界面 / Start server + open web interface
bun dev <directory>      # 在指定目录启动 TUI / Start TUI in specific directory

# 生产环境 / Production
opencode --help          # 显示所有可用命令 / Show all available commands
opencode serve           # 启动无头 API 服务器 / Start headless API server
opencode web             # 启动服务器 + 打开 Web 界面 / Start server + open web interface
opencode <directory>     # 在指定目录启动 TUI / Start TUI in specific directory
```

### 运行 API 服务器 / Running the API Server

启动 OpenCode 无头 API 服务器： / To start the OpenCode headless API server:

```bash
bun dev serve
```

默认情况下，这会在端口 4096 上启动无头服务器。你可以指定不同的端口： / This starts the headless server on port 4096 by default. You can specify a different port:

```bash
bun dev serve --port 8080
```

### 运行 Web 应用 / Running the Web App

测试开发过程中的 UI 更改： / To test UI changes during development:

1. **首先，启动 OpenCode 服务器**（参见上面的 [运行 API 服务器](#running-the-api-server) 部分）/ **First, start the OpenCode server** (see [Running the API Server](#running-the-api-server) section above)
2. **然后运行 Web 应用：** / **Then run the web app:**

```bash
bun run --cwd packages/app dev
```

这会在 http://localhost:5173（或输出中显示的类似端口）启动本地开发服务器。大多数 UI 更改可以在这里测试，但服务器必须运行才能获得完整功能。 / This starts a local dev server at http://localhost:5173 (or similar port shown in output). Most UI changes can be tested here, but the server must be running for full functionality.

### 运行桌面应用 / Running the Desktop App

桌面应用是一个封装 Web UI 的原生 Tauri 应用程序。 / The desktop app is a native Tauri application that wraps the web UI.

运行原生桌面应用： / To run the native desktop app:

```bash
bun run --cwd packages/desktop tauri dev
```

这会在 http://localhost:1420 启动 Web 开发服务器并打开原生窗口。 / This starts the web dev server on http://localhost:1420 and opens the native window.

如果你只需要 Web 开发服务器（不带原生 shell）： / If you only want the web dev server (no native shell):

```bash
bun run --cwd packages/desktop dev
```

创建生产 `dist/` 并构建原生应用包： / To create a production `dist/` and build the native app bundle:

```bash
bun run --cwd packages/desktop tauri build
```

这会通过 Tauri 的 `beforeBuildCommand` 自动运行 `bun run --cwd packages/desktop build`。 / This runs `bun run --cwd packages/desktop build` automatically via Tauri's `beforeBuildCommand`.

> [!NOTE] / 注意
运行桌面应用需要额外的 Tauri 依赖（Rust 工具链、平台特定库）。参见 [Tauri 前置要求](https://v2.tauri.app/start/prerequisites/) 了解设置说明。 / Running the desktop app requires additional Tauri dependencies (Rust toolchain, platform-specific libraries). See the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for setup instructions.

> [!NOTE] / 注意
如果你修改了 API 或 SDK（例如 `packages/opencode/src/server/server.ts`），请运行 `./script/generate.ts` 来重新生成 SDK 和相关文件。 / If you make changes to the API or SDK (e.g. `packages/opencode/src/server/server.ts`), run `./script/generate.ts` to regenerate the SDK and related files.

请尝试遵循 [样式指南](./AGENTS.md)。 / Please try to follow the [style guide](./AGENTS.md).

### 设置调试器 / Setting up a Debugger

Bun 调试目前还有一些问题。我们希望本指南能帮助你设置好并避免一些痛点。 / Bun debugging is currently rough around the edges. We hope this guide helps you get set up and avoid some pain points.

调试 OpenCode 最可靠的方式是通过 `bun run --inspect=<url> dev ...` 在终端中手动运行，然后通过该 URL 附加调试器。其他方法可能导致断点映射不正确，至少在 VSCode 中是这样（YMMV）。 / The most reliable way to debug OpenCode is to run it manually in a terminal via `bun run --inspect=<url> dev ...` and attach your debugger via that URL. Other methods can result in breakpoints being mapped incorrectly, at least in VSCode (YMMV).

注意事项： / Caveats:

如果你想运行 OpenCode TUI 并在服务器代码中触发断点，你可能需要运行 `bun dev spawn` 而不是通常的 `bun dev`。这是因为 `bun dev` 在工作线程中运行服务器，断点可能在那里不工作。 / If you want to run the OpenCode TUI and have breakpoints triggered in the server code, you might need to run `bun dev spawn` instead of the usual `bun dev`. This is because `bun dev` runs the server in a worker thread and breakpoints might not work there.
如果 `spawn` 对你不起作用，你可以单独调试服务器： / If `spawn` does not work for you, you can debug the server separately:
调试服务器： / Debug server: `bun run --inspect=ws://localhost:6499/ --cwd packages/opencode ./src/index.ts serve --port 4096`,
然后用 `opencode attach http://localhost:4096` 附加 TUI / then attach TUI with `opencode attach http://localhost:4096`
调试 TUI： / Debug TUI: `bun run --inspect=ws://localhost:6499/ --cwd packages/opencode --conditions=browser ./src/index.ts`

其他技巧： / Other tips and tricks:

根据你的工作流程，你可能想使用 `--inspect-wait` 或 `--inspect-brk` 而不是 `--inspect`。 / You might want to use `--inspect-wait` or `--inspect-brk` instead of `--inspect`, depending on your workflow.
在每次调用时指定 `--inspect=ws://localhost:6499/` 可能很累，你可以改用 `export BUN_OPTIONS=--inspect=ws://localhost:6499/`。 / Specifying `--inspect=ws://localhost:6499/` on every invocation can be tiresome, you may want to `export BUN_OPTIONS=--inspect=ws://localhost:6499/` instead.

#### VSCode 设置 / VSCode Setup

如果你使用 VSCode，你可以使用我们的示例配置 [.vscode/settings.example.json](.vscode/settings.example.json) 和 [.vscode/launch.example.json](.vscode/launch.example.json)。 / If you use VSCode, you can use our example configurations [.vscode/settings.example.json](.vscode/settings.example.json) and [.vscode/launch.example.json](.vscode/launch.example.json).

一些调试方法可能有问题： / Some debug methods that can be problematic:

使用 `"request": "launch"` 的调试配置可能导致断点映射不正确，从而无法使用。 / Debug configurations with `"request": "launch"` can have breakpoints incorrectly mapped and thus unusable.
在 VSCode `JavaScript Debug Terminal` 中运行 OpenCode 也会出现同样的问题。 / The same problem arises when running OpenCode in the VSCode `JavaScript Debug Terminal`.

也就是说，你可以尝试这些方法，因为它们可能对你有效。 / With that said, you may want to try these methods, as they might work for you.

## Pull Request 期望 / Pull Request Expectations

### Issue 优先策略 / Issue First Policy

**所有 PR 必须引用一个已存在的 issue。** 在打开 PR 之前，创建一个描述 bug 或功能的 issue。这有助于维护者分类并防止重复工作。没有链接 issue 的 PR 可能会在不审查的情况下被关闭。 / **All PRs must reference an existing issue.** Before opening a PR, open an issue describing the bug or feature. This helps maintainers triage and prevents duplicate work. PRs without a linked issue may be closed without review.

在 PR 描述中使用 `Fixes #123` 或 `Closes #123` 来链接 issue / Use `Fixes #123` or `Closes #123` in your PR description to link the issue
对于小的修复，简短的 issue 就可以了——只需要足够的内容让维护者理解问题 / For small fixes, a brief issue is fine - just enough context for maintainers to understand the problem

### 一般要求 / General Requirements

保持 PR 小而专注 / Keep pull requests small and focused
解释问题以及你的更改如何修复它 / Explain the issue and why your change fixes it
在添加新功能之前，确保代码库中不存在该功能 / Before adding new functionality, ensure it doesn't already exist elsewhere in the codebase

### UI 更改 / UI Changes

如果你的 PR 包含 UI 更改，请附上显示前后对比的截图或视频。这有助于维护者更快地审查并给你更快的反馈。 / If your PR includes UI changes, please include screenshots or videos showing the before and after. This helps maintainers review faster and gives you quicker feedback.

### 逻辑更改 / Logic Changes

对于非 UI 更改（bug 修复、新功能、重构），请解释**你如何验证它的工作**： / For non-UI changes (bug fixes, new features, refactors), explain **how you verified it works**:

你测试了什么？ / What did you test?
审查者如何重现/确认修复？ / How can a reviewer reproduce/confirm the fix?

### 不要 AI 生成的文本墙 / No AI-Generated Walls of Text

冗长的 AI 生成的 PR 描述和 issues 是不可接受的，可能会被忽略。请尊重维护者的时间： / Long, AI-generated PR descriptions and issues are not acceptable and may be ignored. Respect the maintainers' time:

写简短、专注的描述 / Write short, focused descriptions
用你自己的话解释更改了什么以及为什么 / Explain what changed and why in your own words
如果你无法简要解释，你的 PR 可能太大了 / If you can't explain it briefly, your PR might be too large

### PR 标题 / PR Titles

PR 标题应遵循 conventional commit 标准： / PR titles should follow conventional commit standards:

`feat:` 新功能或功能 / new feature or functionality
`fix:` bug 修复 / bug fix
`docs:` 文档或 README 更改 / documentation or README changes
`chore:` 维护任务、依赖更新等 / maintenance tasks, dependency updates, etc.
`refactor:` 不改变行为的代码重构 / code refactoring without changing behavior
`test:` 添加或更新测试 / adding or updating tests

你可以选择包含一个范围来指示受影响的包： / You can optionally include a scope to indicate which package is affected:

`feat(app):` app 包中的功能 / feature in the app package
`fix(desktop):` desktop 包中的 bug 修复 / bug fix in the desktop package
`chore(opencode):` opencode 包中的维护 / maintenance in the opencode package

示例： / Examples:

`docs: update contributing guidelines` — 文档：更新贡献指南 / update contributing guidelines
`fix: resolve crash on startup` — 修复：解决启动时崩溃 / resolve crash on startup
`feat: add dark mode support` — 特性：添加暗色模式支持 / add dark mode support
`feat(app): add dark mode support` — 特性(app)：添加暗色模式支持 / add dark mode support
`fix(desktop): resolve crash on startup` — 修复(desktop)：解决启动时崩溃 / resolve crash on startup
`chore: bump dependency versions` — 杂务：更新依赖版本 / bump dependency versions

### 样式偏好 / Style Preferences

这些不是严格执行的，只是通用指南： / These are not strictly enforced, they are just general guidelines:

**函数：** 将逻辑保留在单个函数中，除非拆分出来能增加明确的复用或组合好处。 / **Functions:** Keep logic within a single function unless breaking it out adds clear reuse or composition benefits.
**解构：** 不要对变量进行不必要的解构。 / **Destructuring:** Do not do unnecessary destructuring of variables.
**控制流：** 避免 `else` 语句。 / **Control flow:** Avoid `else` statements.
**错误处理：** 优先使用 `.catch(...)` 而不是 `try`/`catch`（如果可以的话）。 / **Error handling:** Prefer `.catch(...)` instead of `try`/`catch` when possible.
**类型：** 使用精确的类型，避免 `any`。 / **Types:** Reach for precise types and avoid `any`.
**变量：** 坚持使用不可变模式，避免 `let`。 / **Variables:** Stick to immutable patterns and avoid `let`.
**命名：** 选择简洁的单字标识符，只要它们仍然具有描述性。 / **Naming:** Choose concise single-word identifiers when they remain descriptive.
**运行时 API：** 在合适时使用 Bun 辅助函数，如 `Bun.file()`。 / **Runtime APIs:** Use Bun helpers such as `Bun.file()` when they fit the use case.

## 功能请求 / Feature Requests

对于全新功能，先进行设计讨论。打开一个 issue 描述问题、你提出的方法（可选），以及为什么它属于 OpenCode。核心团队会帮助决定是否应该推进；请等待那个批准而不是直接打开功能 PR。 / For net-new functionality, start with a design conversation. Open an issue describing the problem, your proposed approach (optional), and why it belongs in OpenCode. The core team will help decide whether it should move forward; please wait for that approval instead of opening a feature PR directly.

## 信任与担保系统 / Trust & Vouch System

该项目使用 [vouch](https://github.com/mitchellh/vouch) 来管理贡献者信任。担保列表保存在 [`.github/VOUCHED.td`](.github/VOUCHED.td) 中。 / This project uses [vouch](https://github.com/mitchellh/vouch) to manage contributor trust. The vouch list is maintained in [`.github/VOUCHED.td`](.github/VOUCHED.td).

### 它如何工作 / How it works

**已担保的用户 (Vouched users)** 是被明确信任的贡献者。 / **Vouched users** are explicitly trusted contributors.
**被谴责的用户 (Denounced users)** 被明确阻止。来自被谴责用户的 issues 和 PR 会自动关闭。如果你被谴责了，你可以通过 [Discord](https://opencode.ai/discord) 联系维护者请求取消担保。 / **Denounced users** are explicitly blocked. Issues and pull requests from denounced users are automatically closed. If you have been denounced, you can request to be unvouched by reaching out to a maintainer on [Discord](https://opencode.ai/discord).
**其他所有人** 可以正常参与——你不需要被担保才能打开 issues 或 PRs。 / **Everyone else** can participate normally — you don't need to be vouched to open issues or PRs.

### 对于维护者 / For maintainers

有写权限的合作者可以通过在任何 issue 上评论来管理担保列表： / Collaborators with write access can manage the vouch list by commenting on any issue:

`vouch` — 为 issue 作者担保 / vouch for the issue author
`vouch @username` — 为特定用户担保 / vouch for a specific user
`denounce` — 谴责 issue 作者 / denounce the issue author
`denounce @username` — 谴责特定用户 / denounce a specific user
`denounce @username <reason>` — 带原因谴责 / denounce with a reason
`unvouch` / `unvouch @username` — 从列表中移除某人 / remove someone from the list

更改会自动提交到 `.github/VOUCHED.td`。 / Changes are committed automatically to `.github/VOUCHED.td`.

### 谴责政策 / Denouncement policy

谴责保留给反复提交低质量 AI 生成贡献、垃圾邮件或其他恶意行为的人。这不用于分歧或诚实错误。 / Denouncement is reserved for users who repeatedly submit low-quality AI-generated contributions, spam, or otherwise act in bad faith. It is not used for disagreements or honest mistakes.

## Issue 要求 / Issue Requirements

所有 issues **必须** 使用我们的 issue 模板之一： / All issues **must** use one of our issue templates:

**Bug report** — 用于报告 bug（需要描述）/ for reporting bugs (requires a description)
**Feature request** — 用于建议增强（需要验证复选框和描述）/ for suggesting enhancements (requires verification checkbox and description)
**Question** — 用于提问（需要问题内容）/ for asking questions (requires the question)

不允许空白 issues。当新 issue 打开时，自动化检查会验证它是否遵循模板并符合我们的贡献指南。如果 issue 不符合要求，你会收到一条评论解释需要修复什么，并且有 **2 小时** 时间编辑 issue。之后它会自动关闭。 / Blank issues are not allowed. When a new issue is opened, an automated check verifies that it follows a template and meets our contributing guidelines. If the issue doesn't meet the requirements, you'll receive a comment explaining what needs to be fixed and have **2 hours** to edit the issue. After that, it will be automatically closed.

Issues 可能会被标记： / Issues may be flagged for:

未使用模板 / Not using a template
必填字段留空或填写占位符文本 / Required fields left empty or filled with placeholder text
AI 生成的文本墙 / AI-generated walls of text
缺少有意义的内容 / Missing meaningful content

如果你认为你的 issue 被错误标记了，请告诉维护者。 / If you believe your issue was incorrectly flagged, let a maintainer know.
