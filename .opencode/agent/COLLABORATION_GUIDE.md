# Opencode 智能体协作规范

## 一、概述

本文档定义了适用于 Opencode 环境的智能体协作规范。由于 Opencode 不支持全局流水线协调智能体和文件锁机制，采用**串行协作 + 用户协调模式**。

## 二、目录结构

```
${project_root}/
├── .opencode/                    # Opencode 配置
│   └── agent/                    # Agent 定义文件
│       └── *.md                  # Agent markdown 文件
├── config/                       # 项目配置
│   ├── project_mode.json         # 项目模式（greenfield/brownfield/mixed）
│   ├── tech_stack.json           # 技术栈
│   └── agent_config.json         # Agent 配置
├── requirements/                  # 需求文档
│   ├── analyzed_requirements.json
│   └── srs_v1.0.md
├── design/                        # 设计文档
│   ├── uiux/
│   │   └── uiux_design_spec.json
│   ├── architecture/
│   │   ├── system_architecture.json
│   │   └── api_spec.yaml
│   └── database/
│       ├── schema_ddl.sql
│       └── data_dictionary.md
├── code/                         # 代码
│   ├── backend/
│   └── frontend/
├── output/                       # 输出报告
│   ├── assessment/
│   ├── estimations/
│   ├── testing/
│   ├── reviews/
│   └── deployment/
└── collaboration/                # 协作文件
    ├── pipeline_status.md        # 状态记录（用户维护）
    ├── api_contract_discussion.md
    ├── design_feedback.md
    ├── architecture_review.md
    └── integration_issues.md
```

## 三、Agent 协作规范

### 3.1 权限设置原则

| Agent 类型 | 主要权限                     | 说明             |
| ---------- | ---------------------------- | ---------------- |
| 分析类     | read, glob, grep, list       | 只读，无需写入   |
| 设计类     | read, edit, glob, grep, list | 需要生成设计文档 |
| 开发类     | read, edit, glob, grep, list | 需要生成代码     |
| 测试/审查  | read, edit                   | 生成报告         |

### 3.2 输入输出规范

每个 Agent 的输入输出通过文件传递：

| Agent                | 主要输入                                | 主要输出                                |
| -------------------- | --------------------------------------- | --------------------------------------- |
| project-assessor     | 项目目录                                | project_mode.json, assessment_report.md |
| requirement-analyzer | project_mode.json                       | analyzed_requirements.json              |
| project-estimator    | analyzed_requirements.json              | estimation_report.md                    |
| uiux-designer        | analyzed_requirements.json              | uiux_design_spec.json                   |
| system-architect     | requirements, estimations, uiux         | system_architecture.json, api_spec.yaml |
| database-designer    | system_architecture.json, api_spec.yaml | schema_ddl.sql                          |
| backend-developer    | api_spec.yaml, schema_ddl.sql           | 后端代码                                |
| frontend-developer   | uiux_design_spec.json, api_spec.yaml    | 前端代码                                |
| integration-tester   | 代码, api_spec                          | integration_test_report.md              |
| code-reviewer        | 代码                                    | code_review_report.md                   |
| devops-deployer      | 所有产出                                | deployment_guide.md, Docker配置         |

### 3.3 协作流程

#### 标准流程（Greenfield）

1. 用户启动 `@project-assessor` 评估项目
2. 用户启动 `@requirement-analyzer` 分析需求
3. 用户启动 `@project-estimator` 进行估算
4. 用户启动 `@uiux-designer` 进行 UI/UX 设计
5. 用户启动 `@system-architect` 进行架构设计
6. 用户启动 `@database-designer` 设计数据库
7. 用户启动 `@backend-developer` 开发后端
8. 用户启动 `@frontend-developer` 开发前端
9. 用户启动 `@integration-tester` 进行测试
10. 用户启动 `@code-reviewer` 进行审查
11. 用户启动 `@devops-deployer` 生成部署配置

#### 二次开发流程（Brownfield）

1. `@environment-adapter` 适配现有项目
2. `@project-assessor` 分析现有代码 → 识别 brownfield 模式
3. `@requirement-analyzer` 逆向推导需求 + 新需求
4. 后续流程同标准流程

## 四、状态管理

### 4.1 pipeline_status.md

用户手动维护流水线状态：

```markdown
# 流水线状态

## 项目: 我的项目

## 开始时间: 2024-01-01

| 阶段 | Agent                | 状态      | 完成时间 | 输出文件                   |
| ---- | -------------------- | --------- | -------- | -------------------------- |
| 0    | project-assessor     | ✅ 完成   | 10:00    | project_mode.json          |
| 1    | requirement-analyzer | ✅ 完成   | 10:30    | analyzed_requirements.json |
| 2    | project-estimator    | 🔄 运行中 | -        | -                          |
| 3    | uiux-designer        | ⏳ 待执行 | -        | -                          |
| ...  | ...                  | ...       | ...      | ...                        |

## 当前阶段

- 阶段 2: 项目估算 - 运行中
- 预计完成: 11:00

## 阻塞问题

- 无
```

### 4.2 协作文件使用

| 文件                       | 用途         | 更新者         |
| -------------------------- | ------------ | -------------- |
| api_contract_discussion.md | API 接口讨论 | 前后端开发     |
| design_feedback.md         | 设计反馈     | UI/UX、前后端  |
| architecture_review.md     | 架构评审     | 架构师、DBA    |
| integration_issues.md      | 集成问题     | 测试、所有开发 |

## 五、质量检查

### 5.1 阶段门禁

| 阶段        | 门禁条件                    | 说明          |
| ----------- | --------------------------- | ------------- |
| 需求 → 估算 | 需求文档包含至少3个用户故事 | -             |
| 估算 → 设计 | 估算报告完成                | -             |
| 设计 → 开发 | API 规范完整                | 包含核心 CRUD |
| 开发 → 测试 | 代码通过编译                | -             |
| 测试 → 审查 | 测试通过率 > 70%            | -             |

### 5.2 质量检查清单

**需求阶段**：

- [ ] 需求完整性
- [ ] 无冲突需求
- [ ] 非功能需求定义

**架构阶段**：

- [ ] API 规范完整
- [ ] 技术选型合理
- [ ] 无循环依赖

**开发阶段**：

- [ ] 代码规范
- [ ] 无安全漏洞
- [ ] 单元测试覆盖

## 六、Agent 调用规范

### 6.1 调用方式

```bash
# 通过 Task tool 调用
@project-assessor
@requirement-analyzer
...

# 或使用 /subagent_type 命令
/subagent_type project-assessor
```

### 6.2 上下文传递

每个 Agent 执行后，用户应将关键信息传递给下一个 Agent：

```markdown
## 上一阶段总结

**已完成**: 项目评估
**项目模式**: greenfield
**核心发现**:

- 代码完整性: 15%
- 文档完整性: 0%
- 推荐从需求分析开始

**下一步**: 请启动 @requirement-analyzer 进行需求分析
```

### 6.3 会话管理建议

1. 每个阶段完成后，用户手动记录关键输出位置
2. 在调用下一个 Agent 前，复述上一阶段的核心结论
3. 定期更新 pipeline_status.md

## 七、错误处理

### 7.1 常见问题

| 问题           | 处理方式                         |
| -------------- | -------------------------------- |
| Agent 执行失败 | 检查输入文件是否正确，修正后重试 |
| 质量门禁不通过 | 修复问题后重新执行该 Agent       |
| 需求变更       | 从需求分析阶段重新开始           |

### 7.2 回滚流程

1. 手动删除该阶段的输出文件
2. 修正导致失败的问题
3. 重新执行该 Agent
4. 更新 pipeline_status.md

## 八、输出文件命名规范

| 类型       | 命名格式                   | 示例        |
| ---------- | -------------------------- | ----------- |
| 项目模式   | project_mode.json          | -           |
| 需求文档   | analyzed_requirements.json | -           |
| SRS        | srs_v{major}.{minor}.md    | srs_v1.0.md |
| 估算报告   | estimation_report.md       | -           |
| 设计规范   | uiux_design_spec.json      | -           |
| 架构文档   | system_architecture.json   | -           |
| API 规范   | api_spec.yaml              | -           |
| 数据库 DDL | schema_ddl.sql             | -           |
| 数据字典   | data_dictionary.md         | -           |
| 测试报告   | integration_test_report.md | -           |
| 审查报告   | code_review_report.md      | -           |
| 部署指南   | deployment_guide.md        | -           |

## 九、快速开始

### 9.1 新项目

```bash
# 1. 初始化目录结构
# 2. 配置 tech_stack.json

# 3. 启动项目评估
@project-assessor

# 4. 按顺序执行后续 Agent
```

### 9.2 查看状态

```bash
# 查看 pipeline_status.md
# 检查协作文件
# 根据状态继续执行
```

## 十、最佳实践

1. **顺序执行**: 严格按照阶段顺序执行，确保前置条件满足
2. **状态记录**: 每次完成后更新 pipeline_status.md
3. **上下文传递**: 调用下一个 Agent 前复述关键信息
4. **协作沟通**: 使用协作文件记录讨论和问题
5. **质量优先**: 不通过质量门禁不进入下一阶段
