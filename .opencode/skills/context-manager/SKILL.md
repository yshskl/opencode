# Context-Manager Skill - 上下文管理规范

## 目的

定义任务上下文的存储、读取和传递规则，实现智能体间的上下文共享，最小化token消耗。

## 核心原则

### 上下文传递 vs 内容传递

| 方式         | 说明                               | 适用场景            |
| ------------ | ---------------------------------- | ------------------- |
| **内容传递** | 在prompt中直接传递完整内容         | 不推荐，token消耗大 |
| **路径传递** | 只传递文件路径，让子智能体自行读取 | 推荐，减少上下文    |

### 传递规则

```
✅ 正确: "请读取 context/requirements.json 文件了解需求"
❌ 错误: "用户管理系统需要以下功能：1.用户注册...（完整需求内容）"
```

---

## 上下文文件结构

### 目录结构

```
context/                          # 上下文根目录
├── project_info.json            # 项目基本信息
├── requirements.json            # 需求文档
├── requirements.md              # 需求说明
├── tasks.json                   # 任务列表
├── task_01/
│   ├── context.json             # 任务1输入上下文
│   └── result.json              # 任务1执行结果
├── task_02/
│   ├── context.json             # 任务2输入上下文
│   └── result.json              # 任务2执行结果
├── shared/
│   ├── schema.sql               # 共享的数据库Schema
│   ├── api_spec.yaml            # 共享的API规范
│   └── config.json              # 共享的配置
└── reports/
    ├── quality_gate.json        # 质量门禁结果
    └── final_report.md          # 最终报告
```

### 文件命名规则

| 文件       | 命名                   | 说明                   |
| ---------- | ---------------------- | ---------------------- |
| 项目信息   | `project_info.json`    | 项目名称、类型、技术栈 |
| 需求文档   | `requirements.json`    | 结构化需求             |
| 任务列表   | `tasks.json`           | 所有任务定义           |
| 任务上下文 | `task_XX/context.json` | 任务输入               |
| 任务结果   | `task_XX/result.json`  | 任务输出               |
| 共享资源   | `shared/*.json`        | 多任务共享的数据       |

---

## 上下文文件格式

### 项目信息 (project_info.json)

```json
{
  "project_name": "用户管理系统",
  "project_type": "greenfield",
  "tech_stack": {
    "backend": "TypeScript/Node.js",
    "frontend": "Vue 3",
    "database": "PostgreSQL"
  },
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

### 任务上下文 (task_XX/context.json)

```json
{
  "task_id": "task_01",
  "task_name": "实现用户API",
  "description": "实现用户的CRUD API",
  "dependencies": {
    "input_files": ["context/shared/schema.sql"],
    "reference_files": ["context/requirements.json"]
  },
  "constraints": ["使用RESTful风格", "返回JSON格式", "JWT认证"],
  "requirements": ["用户注册", "用户登录", "用户查询", "用户修改", "用户删除"],
  "expected_output": {
    "files": ["backend/src/routes/user.ts"],
    "format": "TypeScript"
  },
  "quality_criteria": ["所有API都有对应endpoint", "有基本的错误处理"]
}
```

### 任务结果 (task_XX/result.json)

```json
{
  "task_id": "task_01",
  "status": "success",
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T10:30:00Z",
  "duration_seconds": 1800,
  "output_files": [
    {
      "path": "backend/src/routes/user.ts",
      "type": "code",
      "description": "用户路由"
    },
    {
      "path": "backend/src/models/user.ts",
      "type": "code",
      "description": "用户模型"
    }
  ],
  "quality_check": {
    "passed": true,
    "issues": []
  },
  "errors": [],
  "warnings": [
    {
      "severity": "low",
      "message": "缺少某些边界情况的处理",
      "suggestion": "后续可以补充"
    }
  ]
}
```

---

## 上下文管理流程

### 创建上下文

```
用户需求
    │
    ▼
┌────────────────────────────────────┐
│      创建上下文流程                  │
├────────────────────────────────────┤
│ 1. 创建context目录                  │
│ 2. 写入project_info.json           │
│ 3. 调用requirement-analyzer生成需求│
│ 4. 写入requirements.json           │
│ 5. 生成tasks.json                  │
│ 6. 为每个任务创建子目录             │
└────────────────────────────────────┘
```

### 任务上下文传递

```
task-coordinator
    │
    ▼
┌────────────────────────────────────┐
│      上下文传递流程                  │
├────────────────────────────────────┤
│ 1. 读取任务定义(tasks.json)        │
│ 2. 准备该任务的context.json        │
│ 3. 读取依赖任务的输出作为输入        │
│ 4. 写入task_XX/context.json        │
│ 5. 调用子智能体，传递文件路径       │
│ 6. 子智能体读取context.json执行    │
└────────────────────────────────────┘
         │
         ▼
   子智能体执行
```

### 子智能体读取规则

子智能体收到任务时，必须读取以下文件：

```
必须读取:
├── context/project_info.json      # 了解项目基本信息
├── context/requirements.json      # 了解需求
├── context/tasks.json            # 了解任务列表
└── context/task_XX/context.json   # 了解本任务的具体要求

可选读取(如果存在):
├── context/shared/schema.sql      # 共享的数据库Schema
├── context/shared/api_spec.yaml   # 共享的API规范
└── context/shared/config.json     # 共享的配置
```

---

## 路径传递示例

### 错误的传递方式（直接传递内容）

```
用户：请实现用户API，需要以下字段：
- id: number
- username: string
- email: string
- password: string (加密存储)
创建 users 表，包含以上字段，实现 CRUD 操作...
```

### 正确的传递方式（路径传递）

```
用户：请实现用户API

task-coordinator 传递给子智能体：

请读取以下文件了解需求：
- context/requirements.json (需求文档)
- context/shared/schema.sql (数据库Schema参考)

具体任务在 context/task_backend_01/context.json 中定义。

输出要求：
- 代码写入 backend/src/ 目录
- 测试写入 tests/ 目录
```

---

## 共享资源管理

### 写入共享资源

当某个任务的输出需要被其他任务使用时，写入 `shared/` 目录：

```json
// database-designer 写入
context/shared/schema.sql

// backend-developer 读取
context/shared/schema.sql

// frontend-developer 读取
context/shared/api_spec.yaml
```

### 共享资源列表

| 资源         | 路径                             | 使用者            |
| ------------ | -------------------------------- | ----------------- |
| 数据库Schema | `context/shared/schema.sql`      | backend, frontend |
| API规范      | `context/shared/api_spec.yaml`   | backend, frontend |
| 配置         | `context/shared/config.json`     | all               |
| 技术栈       | `context/shared/tech_stack.json` | all               |

---

## 上下文清理

### 清理规则

- 任务完成后，保留 `context/task_XX/result.json`
- 可以删除 `context/task_XX/context.json`（输入已保存在结果中）
- 最终报告生成后，可选择压缩或归档整个 `context/` 目录

### 清理时机

| 时机         | 操作                      |
| ------------ | ------------------------- |
| 任务完成后   | 删除已不用的输入文件      |
| 工作流完成后 | 归档或删除整个context目录 |
| 用户要求时   | 提供完整的context下载     |

---

## 示例：完整上下文流程

### Step 1: 初始化

```bash
# 创建目录
mkdir -p context/task_01 context/task_02 context/shared context/reports
```

### Step 2: 写入项目信息

```json
// context/project_info.json
{
  "project_name": "用户管理系统",
  "project_type": "greenfield",
  "tech_stack": {
    "backend": "TypeScript/Node.js",
    "frontend": "Vue 3",
    "database": "PostgreSQL"
  }
}
```

### Step 3: 需求分析后写入需求

```json
// context/requirements.json
{
  "user_stories": [
    {
      "id": "US001",
      "title": "用户注册",
      "description": "新用户可以注册账号",
      "acceptance_criteria": ["用户名唯一", "密码加密", "邮箱验证"]
    }
  ]
}
```

### Step 4: 数据库设计后写入Schema

```sql
-- context/shared/schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 5: 后端开发读取并执行

```json
// context/task_02/context.json
{
  "task_id": "task_02",
  "task_name": "实现用户API",
  "dependencies": {
    "input_files": ["context/shared/schema.sql"]
  },
  "expected_output": {
    "files": ["backend/src/routes/user.ts"]
  }
}
```

---

## 最佳实践

### Do's

✅ 使用路径传递而非内容传递  
✅ 保持context目录结构一致  
✅ 每个任务独立一个子目录  
✅ 及时写入任务结果

### Don'ts

❌ 不要在prompt中传递完整文件内容  
❌ 不要跳过context直接执行任务  
❌ 不要让多个任务写同一文件  
❌ 不要忘记写入任务结果
