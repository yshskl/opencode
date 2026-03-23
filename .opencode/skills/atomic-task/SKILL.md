# Atomic-Task Skill - 原子任务定义

## 目的

定义软件开发中"原子任务"的标准格式、分解规则和质量要求。

## 原子任务定义

原子任务是软件开发流程中**不可再分的最小执行单元**。每个原子任务：

- 可以独立执行
- 有明确的完成标准
- 由一个子智能体负责执行

## 原子任务标准格式

```json
{
  "task_id": "唯一标识符",
  "name": "任务名称",
  "description": "任务描述",
  "agent": "最适合的子智能体",
  "phase": "所属阶段",
  "dependencies": ["依赖的任务ID"],
  "parallel": true|false,
  "context": {
    "files": ["相关文件列表"],
    "constraints": ["约束条件"],
    "requirements": ["具体要求"]
  },
  "expected_output": {
    "files": ["产出的文件"],
    "format": "输出格式要求"
  },
  "quality_criteria": ["质量检查标准"]
}
```

## 字段说明

| 字段             | 必填 | 说明                                                                                 |
| ---------------- | ---- | ------------------------------------------------------------------------------------ |
| task_id          | 是   | 唯一标识，格式：`phase_序号`，如 `req_01`, `dev_01`                                  |
| name             | 是   | 简洁的任务名称                                                                       |
| description      | 是   | 任务描述，说明要做什么                                                               |
| agent            | 是   | 执行任务的子智能体类型                                                               |
| phase            | 是   | 所属阶段：requirement/architecture/backend/frontend/database/test/review/deploy/docs |
| dependencies     | 是   | 依赖的任务ID数组，空数组表示无依赖                                                   |
| parallel         | 是   | 是否可以并行执行                                                                     |
| context          | 是   | 任务上下文，包含文件、约束等                                                         |
| expected_output  | 是   | 期望输出，包含产出文件和格式                                                         |
| quality_criteria | 是   | 质量检查标准                                                                         |

## 任务分解规则

### 1. 分解原则

- **单一职责**: 每个任务只负责一个功能点
- **可独立执行**: 任务不依赖其他任务即可开始
- **明确验收**: 有明确的完成标准和输出要求
- **合理粒度**: 任务不要太大（难以评估）也不要太小（效率低）

### 2. 分解流程

```
需求文档
    │
    ▼
┌────────────────────────────────────┐
│          任务分解流程                │
├────────────────────────────────────┤
│ 1. 识别核心功能模块                  │
│ 2. 每个模块分解为子任务              │
│ 3. 识别依赖关系                     │
│ 4. 标记可并行任务                   │
│ 5. 验证任务完整性                   │
└────────────────────────────────────┘
    │
    ▼
原子任务列表
```

### 3. 按阶段分解

#### 需求分析阶段 (requirement)

| 任务           | 说明                 | 智能体               |
| -------------- | -------------------- | -------------------- |
| 收集用户故事   | 收集并整理用户故事   | requirement-analyzer |
| 识别功能需求   | 列出所有功能需求     | requirement-analyzer |
| 识别非功能需求 | 性能、安全、可用性等 | requirement-analyzer |
| 优先级排序     | 划分优先级           | requirement-analyzer |

#### 架构设计阶段 (architecture)

| 任务         | 说明         | 智能体           |
| ------------ | ------------ | ---------------- |
| 系统架构设计 | 设计系统架构 | system-architect |
| 技术选型     | 选择技术栈   | system-architect |
| API设计      | 定义API接口  | system-architect |

#### 数据库设计阶段 (database)

| 任务       | 说明         | 智能体            |
| ---------- | ------------ | ----------------- |
| 表结构设计 | 设计数据库表 | database-designer |
| 索引设计   | 设计索引     | database-designer |
| 关系设计   | 设计表关系   | database-designer |

#### 后端开发阶段 (backend)

| 任务           | 说明               | 智能体            |
| -------------- | ------------------ | ----------------- |
| 实现API        | 实现后端API        | backend-developer |
| 实现业务逻辑   | 实现业务逻辑       | backend-developer |
| 实现数据访问层 | 实现DAO/Repository | backend-developer |

#### 前端开发阶段 (frontend)

| 任务         | 说明         | 智能体             |
| ------------ | ------------ | ------------------ |
| 实现页面组件 | 实现UI组件   | frontend-developer |
| 实现交互逻辑 | 实现交互逻辑 | frontend-developer |
| 对接API      | 对接后端API  | frontend-developer |

#### 测试阶段 (test)

| 任务         | 说明             | 智能体             |
| ------------ | ---------------- | ------------------ |
| 生成单元测试 | 生成单元测试用例 | integration-tester |
| 生成集成测试 | 生成集成测试用例 | integration-tester |
| 执行测试     | 执行测试         | integration-tester |

#### 代码审查阶段 (review)

| 任务         | 说明         | 智能体        |
| ------------ | ------------ | ------------- |
| 代码质量审查 | 检查代码质量 | code-reviewer |
| 安全审查     | 检查安全漏洞 | code-reviewer |
| 性能审查     | 检查性能问题 | code-reviewer |

#### 部署阶段 (deploy)

| 任务         | 说明                 | 智能体          |
| ------------ | -------------------- | --------------- |
| 生成部署配置 | 生成Docker/Compose等 | devops-deployer |
| 配置CI/CD    | 配置CI/CD流水线      | devops-deployer |
| 部署脚本     | 编写部署脚本         | devops-deployer |

#### 文档阶段 (docs)

| 任务         | 说明         | 智能体 |
| ------------ | ------------ | ------ |
| 生成API文档  | 生成API文档  | docs   |
| 生成用户手册 | 生成用户手册 | docs   |
| 生成架构文档 | 生成架构文档 | docs   |

## 依赖关系处理

### 有向无环图 (DAG)

任务依赖关系必须是有向无环图，不能有循环依赖。

```
正确示例:
task_A → task_B → task_C
task_D → task_E

错误示例（循环依赖）:
task_A → task_B → task_C → task_A
```

### 依赖类型

| 类型     | 说明         | 示例                  |
| -------- | ------------ | --------------------- |
| 数据依赖 | 输出作为输入 | API实现依赖数据库设计 |
| 顺序依赖 | 必须先完成   | 集成测试依赖代码开发  |
| 并行依赖 | 无依赖       | 两个独立的API可以并行 |

### 并行执行识别

满足以下条件时可以并行执行：

1. 无依赖关系
2. 或所有依赖任务已完成

## 质量检查标准

### 任务级别检查

每个任务必须满足：

| 标准     | 说明                         |
| -------- | ---------------------------- |
| 完整性   | 所有必要字段都已填写         |
| 可执行性 | 任务描述清晰，可执行         |
| 独立性   | 任务不依赖其他任务的中间结果 |
| 可验收性 | 有明确的完成标准和输出要求   |

### 任务列表级别检查

| 标准     | 说明                   |
| -------- | ---------------------- |
| 完整性   | 所有功能都有对应的任务 |
| 无遗漏   | 没有未分配的任务       |
| 无冗余   | 没有重复的任务         |
| 依赖完整 | 所有依赖关系都已识别   |

## 上下文管理

### 传递给子智能体的上下文

```json
{
  "task": {
    "id": "task_01",
    "name": "实现用户API",
    "description": "实现用户管理的CRUD API"
  },
  "context_file": "context/task_01_context.json",
  "constraints": ["使用RESTful风格", "返回JSON格式"],
  "expected_output": {
    "files": ["src/api/user.ts"],
    "format": "TypeScript"
  }
}
```

### 上下文文件内容

```
context/
├── requirements.json      # 需求文档
├── requirements.md        # 需求说明
├── tasks.json            # 任务列表
├── task_01_context.json  # 任务1上下文（数据库设计输出）
├── task_01_result.json   # 任务1执行结果
├── task_02_context.json  # 任务2上下文（任务1的输出）
├── task_02_result.json   # 任务2执行结果
└── ...
```

## 示例

### 用户管理系统任务分解示例

```json
{
  "project": "用户管理系统",
  "project_type": "greenfield",
  "tasks": [
    {
      "task_id": "req_01",
      "name": "收集用户故事",
      "description": "收集并整理用户管理系统相关的用户故事",
      "agent": "requirement-analyzer",
      "phase": "requirement",
      "dependencies": [],
      "parallel": true,
      "context": {
        "files": [],
        "constraints": [],
        "requirements": ["用户注册", "用户登录", "用户信息管理"]
      },
      "expected_output": {
        "files": ["context/requirements.json"],
        "format": "JSON"
      },
      "quality_criteria": ["至少3个用户故事", "每个故事有验收标准"]
    },
    {
      "task_id": "db_01",
      "name": "设计用户表结构",
      "description": "设计用户表和角色表的结构",
      "agent": "database-designer",
      "phase": "database",
      "dependencies": ["req_01"],
      "parallel": false,
      "context": {
        "files": ["context/requirements.json"],
        "constraints": ["使用PostgreSQL", "支持未来扩展"],
        "requirements": ["用户表包含基本信息", "角色表支持多角色"]
      },
      "expected_output": {
        "files": ["context/schema_ddl.sql"],
        "format": "SQL"
      },
      "quality_criteria": ["包含主键和外键", "有必要的索引"]
    },
    {
      "task_id": "backend_01",
      "name": "实现用户API",
      "description": "实现用户的CRUD API",
      "agent": "backend-developer",
      "phase": "backend",
      "dependencies": ["db_01"],
      "parallel": false,
      "context": {
        "files": ["context/schema_ddl.sql", "context/requirements.json"],
        "constraints": ["RESTful风格", "JWT认证"],
        "requirements": ["注册", "登录", "查询", "修改", "删除"]
      },
      "expected_output": {
        "files": ["backend/src/routes/user.ts", "backend/src/models/user.ts"],
        "format": "TypeScript"
      },
      "quality_criteria": ["所有API都有对应endpoint", "有基本的错误处理"]
    },
    {
      "task_id": "frontend_01",
      "name": "实现用户管理界面",
      "description": "实现用户管理的Web界面",
      "agent": "frontend-developer",
      "phase": "frontend",
      "dependencies": ["backend_01"],
      "parallel": false,
      "context": {
        "files": ["context/requirements.json"],
        "constraints": ["使用Vue 3", "响应式设计"],
        "requirements": ["用户列表", "用户表单", "用户详情"]
      },
      "expected_output": {
        "files": ["frontend/src/views/UserManage.vue"],
        "format": "Vue"
      },
      "quality_criteria": ["界面美观", "交互流畅"]
    },
    {
      "task_id": "test_01",
      "name": "生成用户模块测试",
      "description": "生成用户模块的测试用例",
      "agent": "integration-tester",
      "phase": "test",
      "dependencies": ["backend_01", "frontend_01"],
      "parallel": false,
      "context": {
        "files": ["backend/src/routes/user.ts", "frontend/src/views/UserManage.vue"],
        "constraints": [],
        "requirements": ["覆盖主要功能点"]
      },
      "expected_output": {
        "files": ["tests/user.test.ts"],
        "format": "TypeScript"
      },
      "quality_criteria": ["覆盖率>80%"]
    }
  ]
}
```
