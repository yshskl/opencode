# Task-Templates Skill - 常用任务模板库

## 目的

提供常用软件开发任务的标准化模板，加速任务定义过程。

## 适用场景

当task-coordinator需要快速定义常见任务时，使用本模板库。

---

## 模板列表

### 1. CRUD API 任务模板

**用途**: 快速创建包含增删改查功能的API任务

```json
{
  "template": "crud_api",
  "name": "实现XXX的CRUD API",
  "description": "实现XXX的创建、查询、更新、删除接口",
  "agent": "backend-developer",
  "phase": "backend",
  "context_template": {
    "model_name": "实体名称",
    "fields": [{ "name": "字段名", "type": "类型", "required": true }],
    "api_endpoints": [
      "POST /api/xxx - 创建",
      "GET /api/xxx - 列表",
      "GET /api/xxx/:id - 详情",
      "PUT /api/xxx/:id - 更新",
      "DELETE /api/xxx/:id - 删除"
    ]
  },
  "expected_output": {
    "files": ["backend/src/routes/xxx.ts", "backend/src/models/xxx.ts", "backend/src/services/xxx.ts"]
  },
  "quality_criteria": ["所有CRUD操作都有对应endpoint", "有基本的错误处理和验证", "有基本的单元测试"]
}
```

---

### 2. 页面开发任务模板

**用途**: 快速创建前端页面开发任务

```json
{
  "template": "page_development",
  "name": "实现XXX页面",
  "description": "实现XXX的管理页面，包含列表、表单等",
  "agent": "frontend-developer",
  "phase": "frontend",
  "context_template": {
    "page_name": "页面名称",
    "features": ["列表展示", "新增表单", "编辑表单", "详情弹窗"],
    "api_dependencies": ["对应的后端API"]
  },
  "expected_output": {
    "files": ["frontend/src/views/xxx/Index.vue", "frontend/src/views/xxx/Form.vue"]
  },
  "quality_criteria": ["界面美观、交互流畅", "响应式设计", "有基本的加载和错误状态"]
}
```

---

### 3. 数据库表设计任务模板

**用途**: 快速创建数据库表设计任务

```json
{
  "template": "table_design",
  "name": "设计XXX表",
  "description": "设计XXX的数据表结构",
  "agent": "database-designer",
  "phase": "database",
  "context_template": {
    "table_name": "表名",
    "fields": [{ "name": "字段名", "type": "类型", "constraints": "约束" }],
    "relationships": ["与其它表的关系"]
  },
  "expected_output": {
    "files": ["context/shared/schema.sql"]
  },
  "quality_criteria": ["有主键", "有必要的索引", "有外键关系"]
}
```

---

### 4. 测试生成任务模板

**用途**: 快速创建测试生成任务

```json
{
  "template": "test_generation",
  "name": "生成XXX测试",
  "description": "为XXX模块生成测试用例",
  "agent": "integration-tester",
  "phase": "test",
  "context_template": {
    "target": "测试目标",
    "type": "unit|integration|e2e",
    "coverage_goal": "覆盖率目标"
  },
  "expected_output": {
    "files": ["tests/xxx.test.ts"]
  },
  "quality_criteria": ["覆盖率>80%", "包含边缘情况", "测试可独立运行"]
}
```

---

### 5. 代码审查任务模板

**用途**: 快速创建代码审查任务

```json
{
  "template": "code_review",
  "name": "审查XXX代码",
  "description": "对XXX模块进行代码质量审查",
  "agent": "code-reviewer",
  "phase": "review",
  "context_template": {
    "target": "审查目标",
    "focus_areas": ["代码质量", "安全", "性能"]
  },
  "expected_output": {
    "files": ["context/reports/code_review_xxx.md"]
  },
  "quality_criteria": ["无严重安全漏洞", "代码质量评分>7/10", "有具体的优化建议"]
}
```

---

### 6. 文档生成任务模板

**用途**: 快速创建文档生成任务

```json
{
  "template": "documentation",
  "name": "生成XXX文档",
  "description": "生成XXX相关的文档",
  "agent": "docs",
  "phase": "docs",
  "context_template": {
    "doc_type": "API文档|用户手册|架构文档",
    "target": "文档目标"
  },
  "expected_output": {
    "files": ["docs/xxx.md"]
  },
  "quality_criteria": ["内容完整", "格式规范", "易于理解"]
}
```

---

### 7. 部署配置任务模板

**用途**: 快速创建部署配置任务

```json
{
  "template": "deployment",
  "name": "生成XXX部署配置",
  "description": "生成XXX的部署配置文件",
  "agent": "devops-deployer",
  "phase": "deploy",
  "context_template": {
    "deployment_target": "部署目标",
    "environment": "dev|staging|prod",
    "infrastructure": "docker|k8s|serverless"
  },
  "expected_output": {
    "files": ["deploy/docker-compose.yml", "deploy/Dockerfile"]
  },
  "quality_criteria": ["配置完整", "有健康检查", "有日志配置"]
}
```

---

## 使用方法

### 模板选择流程

```
用户需求
    │
    ▼
┌────────────────────────────────────┐
│         模板选择流程                 │
├────────────────────────────────────┤
│ 1. 识别任务类型                     │
│ 2. 选择对应模板                     │
│ 3. 填写模板参数                    │
│ 4. 生成任务定义                     │
│ 5. 质量检查                        │
└────────────────────────────────────┘
```

### 模板参数填写

每个模板都需要填写以下参数：

| 参数             | 说明       | 来源               |
| ---------------- | ---------- | ------------------ |
| name             | 任务名称   | 用户需求           |
| description      | 任务描述   | 用户需求           |
| context_template | 上下文参数 | 从需求中提取       |
| quality_criteria | 质量标准   | 模板默认值，可调整 |

---

## 自定义模板

### 添加新模板

在 `templates/` 目录添加新的模板文件：

```json
// templates/custom_template.json
{
  "template": "custom_template",
  "name": "自定义任务名称",
  "description": "任务描述",
  "agent": "对应的子智能体",
  "phase": "所属阶段",
  "context_template": { ... },
  "expected_output": { ... },
  "quality_criteria": [ ... ]
}
```

### 模板继承

可以从现有模板继承并修改：

```json
{
  "extends": "crud_api",
  "name": "扩展的任务",
  "context_template": {
    "新增参数": "值"
  }
}
```

---

## 常用任务组合

### 组合1: 完整的功能开发

```
1. database-designer (表设计)
2. backend-developer (API开发)
3. frontend-developer (界面开发)
4. integration-tester (测试)
5. code-reviewer (审查)
```

### 组合2: API优先开发

```
1. system-architect (API设计)
2. backend-developer (后端实现)
3. frontend-developer (前端对接)
4. integration-tester (测试)
```

### 组合3: 现有功能修改

```
1. explore (分析现有代码)
2. backend-developer / frontend-developer (修改)
3. integration-tester (测试)
4. code-reviewer (审查)
```
