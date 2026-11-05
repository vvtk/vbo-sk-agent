# VBO SkAgent — 入门指南

使用 AI 一步步创建你的第一个 SketchUp 插件。
复制提示词，将 `[方括号]` 中的内容替换为你的描述，然后粘贴到 AI 工具中。

---

## 步骤 0：快速验证（POC）

> 适用场景：你有一个简单想法，希望在创建完整插件前先验证是否可行。

```
I want to try something: [DESCRIBE YOUR IDEA -- e.g. "select all faces larger than 10m² and color them red"].

Can you prototype this directly via command.rb first?
Don't create a full plugin yet -- just run it as a quick test in SketchUp.
If it works, we'll turn it into a proper plugin later.
```

**为什么先做验证？** 许多想法都可以通过桥接在 30 秒内验证。即使没成功，也能尽早发现问题、节省后续时间。

---

## 步骤 1：创建插件

> 适用场景：验证成功，或你的想法一开始就需要完整插件。

```
I want to create a new SketchUp plugin called "[YOUR PLUGIN NAME]".
It should: [SHORT DESCRIPTION -- e.g. "draw a 3D pipe between two points"]

Please:
1. Create the folder structure in the Plugins directory
2. Create the entry point file with SketchupExtension registration
3. Create a loader with menu under Extensions
4. Add a placeholder main file with a simple test (draw a line or show a messagebox)
5. Load it into SketchUp via the bridge and confirm it works
```

---

## 步骤 2：先规划，再编码

> 适用场景：你有一个想法，但不知道从哪里开始。

```
I want my plugin "[YOUR PLUGIN NAME]" to do the following:
- [Feature 1 -- e.g. "Let user click two points to draw a pipe"]
- [Feature 2 -- e.g. "Show a dialog to pick pipe diameter"]
- [Feature 3 -- e.g. "Calculate total pipe length"]

Please create a development plan:
1. Break this into phases (start simple, add features gradually)
2. List the files needed and what each file does
3. Identify which SketchUp API classes I'll need
4. Start with Phase 1 only -- we'll do the rest later
```

---

## 步骤 3：实现第一阶段

> 适用场景：你已有计划，准备开始开发第一个功能。

```
Let's implement Phase 1 of "[YOUR PLUGIN NAME]":
[DESCRIBE PHASE 1 -- e.g. "User activates the tool, clicks two points, a line is drawn between them"]

Please:
1. Write the code for this phase
2. Load it into SketchUp via the bridge
3. Test it -- run a quick check to confirm it loaded without errors
4. Tell me what to do in SketchUp to test it manually (what to click, what to expect)
```

---

## 步骤 4：修复错误（限制重试次数）

> 适用场景：功能未按预期运行，希望 AI 找出并修复问题。

```
I tested [WHAT YOU DID] and got this problem:
[DESCRIBE THE ISSUE -- e.g. "nothing happens when I click" or "I see an error in the console"]

Please:
1. Inspect the current code
2. Write a test via the bridge to reproduce the issue
3. Fix the bug
4. Reload the fixed code into SketchUp
5. Run the test again to confirm the fix works

IMPORTANT: Maximum 3 retry attempts. If still failing after 3 tries,
stop and explain what's wrong -- do NOT keep retrying.
Show me the code before running anything that modifies the model.
```

**注意：** 务必限制重试次数，避免 AI 不断尝试导致模型损坏。如果三次仍未修复，请让 AI 停下来解释原因。

---

## 步骤 5：添加对话框

> 适用场景：插件需要用户输入数字、选择选项或勾选复选框。

```
Add a dialog to "[YOUR PLUGIN NAME]" that lets the user:
- [Input 1 -- e.g. "Enter pipe diameter (default: 50mm)"]
- [Input 2 -- e.g. "Choose material from a dropdown"]
- [Button -- e.g. "Click OK to apply"]

Use SketchUp's UI::HtmlDialog. Keep the design simple and clean.
Load it into SketchUp and test that the dialog opens correctly.
```

---

## 步骤 6：添加工具栏

> 适用场景：希望通过工具栏按钮访问插件功能。

```
Add a toolbar to "[YOUR PLUGIN NAME]" with these buttons:
- [Button 1 -- e.g. "Draw Pipe -- activates the pipe drawing tool"]
- [Button 2 -- e.g. "Settings -- opens the settings dialog"]

Use simple icons (you can use colored rectangles or basic shapes for now).
Load it into SketchUp and confirm the toolbar appears.
```

---

## 步骤 7：继续下一阶段

> 适用场景：上一阶段已完成，准备添加更多功能。

```
Phase 1 of "[YOUR PLUGIN NAME]" is working. Let's move to Phase 2:
[DESCRIBE PHASE 2]

Please:
1. Review what we have so far
2. Plan what needs to change or be added
3. Implement, load into SketchUp, and test
4. Tell me what to test manually
```

---

## 步骤 8：最终检查

> 适用场景：插件功能基本完成，希望全面检查。

```
Please do a full check on "[YOUR PLUGIN NAME]":
1. Load all files into SketchUp via the bridge
2. Check for any Ruby errors or warnings
3. List all features and confirm each one works
4. Check for common issues: menu duplication, missing icons, undone operations
5. Give me a summary: what works, what needs fixing
```

---

## 步骤 9：学习 SketchUp API

> 适用场景：你想了解如何通过 SketchUp Ruby API 实现某个功能。

```
I want to [DESCRIBE -- e.g. "change the color of a selected face to red"].
What SketchUp Ruby API should I use? Show me a working example
and run it in SketchUp to demonstrate.
```

---

## 步骤 10：打包插件

> 适用场景：插件已准备好分享或分发。

```
My plugin "[YOUR PLUGIN NAME]" is ready. Please:
1. Review the file structure and make sure it follows SketchUp extension conventions
2. Create a .rbz file (zip the entry point + folder)
3. Tell me how to install it on another computer
```

---

## 出售你的插件

你可以通过 **VBO 开发者计划**出售插件。

**流程：**
1. 完成插件并充分测试
2. 发送邮件至 **support@vbosolution.com**，并附上插件名称、简介、RBZ 文件或 GitHub 仓库地址，以及演示视频或截图（如有）
3. VBO 将审核代码，并按需协助进行代码安全处理
4. 收入分成：**你获得 85%，VBO 获得 15%**
5. 插件可上架 VBO 商店和 Extension Warehouse

计划提供全球 SketchUp 用户渠道、自动许可与激活系统、代码加密和技术支持。

联系邮箱：**support@vbosolution.com**
