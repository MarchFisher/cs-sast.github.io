# 贡献指南

## 开始修改

1. Fork 仓库或从最新的 `main` 创建单独分支。
2. 每个分支只处理一个明确任务。
3. 修改后运行 `npm test`。
4. 视觉修改需在 Pull Request 中提供桌面端和移动端截图。
5. 填写 Pull Request 模板并等待至少一次人工审核。

## 内容边界

- 仅提交已经确认可以公开的资料，并记录来源。
- 不得提交手机号、私人邮箱、学号、准入码、签到表、报名表、财务材料、密码或令牌。
- 姓名、昵称、照片、个人介绍和外部链接必须经本人确认。
- 文件夹名和文件名必须使用英文；网页正文可以使用中文。
- 外部链接必须使用 HTTPS。新窗口链接需添加 `rel="noopener noreferrer"`。

## 提交信息

使用能够说明改动的提交信息，例如：

```text
feat: add event overview page
docs: clarify profile privacy rules
fix: correct archive navigation link
```

避免使用没有上下文的 `update` 或 `fix`。

## Review 重点

- 内容是否准确且具有公开依据。
- 是否意外包含个人信息或密钥。
- 页面在移动端、键盘操作和无 JavaScript 环境下是否可用。
- 图片是否压缩、得到授权并具有合适的替代文本。
- 是否只修改了当前任务需要的文件。
