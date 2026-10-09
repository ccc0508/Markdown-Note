# EvoAgent Webhook 联调检查

这份文档用于验证本仓库的自动 PR 审查链路。此次变更仅新增说明文档，不改变笔记应用的功能。

## 验证流程

1. 创建本次草稿 PR，触发 GitHub 的 pull_request 通知。
2. EvoAgent 校验通知签名，下载 PR Diff 并创建后台审查任务。
3. Lead、领域审查角色和 Critic 完成协作，生成审查报告。
4. EvoAgent 将报告发布为本 PR 的评论。

## 成功条件

- GitHub 的 Webhook 投递收到成功响应。
- 管理台中出现与本 PR 对应的任务，最终状态为 SUCCESS。
- 本 PR 下出现包含审查结果的 EvoAgent 评论。

文档变更可以没有可报告的代码缺陷；报告成功生成并回写才是本次联调的检查目标。此 PR 无需合并即可完成测试。
