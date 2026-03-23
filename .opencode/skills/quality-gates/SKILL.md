# Quality-Gates Skill - 质量门禁规范

## 目的

定义软件开发各阶段的质量门禁检查标准，确保每个阶段的输出符合要求后再进入下一阶段。

## 适用范围

task-coordinator 在任务执行前后使用本规范进行检查。

## 质量门禁总览

```
需求分析 → 质量门禁 → 任务分解 → 质量门禁 → 执行任务 → 质量门禁 → 最终报告
              │                  │                  │
              ▼                  ▼                  ▼
          检查完整性          检查可执行性        检查完成度
```

---

## 质量门禁阶段

### 阶段1: 需求分析质量门禁

**触发时机**: requirement-analyzer 完成需求分析后

**检查项**:

| 检查项         | 优先级      | 通过条件                    | 不通过处理           |
| -------------- | ----------- | --------------------------- | -------------------- |
| 用户故事数量   | REQUIRED    | ≥ 3个                       | 要求补充更多用户故事 |
| 功能需求完整性 | REQUIRED    | 覆盖核心功能                | 识别缺失需求         |
| 非功能需求     | REQUIRED    | 包含性能/安全/可用性至少2项 | 要求补充             |
| 需求一致性     | REQUIRED    | 无冲突需求                  | 解决冲突后再继续     |
| 需求可测试性   | RECOMMENDED | 每个需求可验证              | 标记为可选           |

**检查输出**:

```json
{
  "gate": "requirement_analysis",
  "status": "passed",
  "checks": [
    {
      "item": "用户故事数量",
      "status": "passed",
      "details": "5个用户故事"
    },
    {
      "item": "功能需求完整性",
      "status": "passed",
      "details": "覆盖注册、登录、管理等核心功能"
    },
    {
      "item": "非功能需求",
      "status": "passed",
      "details": "包含性能、安全、可用性"
    },
    {
      "item": "需求一致性",
      "status": "failed",
      "details": "用户注册和匿名访问需求存在潜在冲突",
      "suggestion": "需要明确匿名用户的权限范围"
    }
  ],
  "overall_status": "partial",
  "passed_count": 3,
  "failed_count": 1,
  "action": "需要解决需求冲突后再继续"
}
```

---

### 阶段2: 任务分解质量门禁

**触发时机**: atomic-task skill 完成任务分解后

**检查项**:

| 检查项       | 优先级      | 通过条件             | 不通过处理     |
| ------------ | ----------- | -------------------- | -------------- |
| 任务完整性   | REQUIRED    | 所有功能都有对应任务 | 补充缺失任务   |
| 任务可执行性 | REQUIRED    | 每个任务可独立执行   | 调整任务粒度   |
| 依赖完整性   | REQUIRED    | 所有依赖关系已识别   | 补充依赖关系   |
| 无循环依赖   | REQUIRED    | DAG无环              | 修复循环依赖   |
| 并行机会识别 | RECOMMENDED | 识别出可并行任务     | 标记可并行任务 |

**检查输出**:

```json
{
  "gate": "task_decomposition",
  "status": "passed",
  "checks": [
    {
      "item": "任务完整性",
      "status": "passed",
      "details": "10个任务覆盖所有功能"
    },
    {
      "item": "任务可执行性",
      "status": "passed",
      "details": "每个任务都有明确的输入输出"
    },
    {
      "item": "依赖完整性",
      "status": "passed",
      "details": "已识别5个依赖关系"
    },
    {
      "item": "无循环依赖",
      "status": "passed",
      "details": "依赖图无环"
    },
    {
      "item": "并行机会识别",
      "status": "passed",
      "details": "3个任务可并行执行"
    }
  ],
  "overall_status": "passed"
}
```

---

### 阶段3: 开发完成质量门禁

**触发时机**: 子智能体（backend/frontend/database）完成开发后

**检查项**:

| 检查项     | 优先级      | 通过条件        | 不通过处理   |
| ---------- | ----------- | --------------- | ------------ |
| 代码编译   | REQUIRED    | 无编译错误      | 修复编译错误 |
| 代码风格   | RECOMMENDED | 符合项目规范    | 标记警告     |
| 单元测试   | RECOMMENDED | 有基本测试覆盖  | 标记警告     |
| 文档完整性 | RECOMMENDED | 有基本的API文档 | 标记警告     |

**检查输出**:

```json
{
  "gate": "development_complete",
  "status": "passed",
  "checks": [
    {
      "item": "代码编译",
      "status": "passed",
      "details": "无编译错误"
    },
    {
      "item": "代码风格",
      "status": "warning",
      "details": "部分变量命名与规范不一致，建议统一"
    },
    {
      "item": "单元测试",
      "status": "passed",
      "details": "覆盖主要功能"
    }
  ],
  "overall_status": "passed"
}
```

---

### 阶段4: 测试完成质量门禁

**触发时机**: integration-tester 完成测试后

**检查项**:

| 检查项       | 优先级      | 通过条件     | 不通过处理     |
| ------------ | ----------- | ------------ | -------------- |
| 测试通过率   | REQUIRED    | > 90%        | 修复失败的测试 |
| 测试覆盖率   | REQUIRED    | > 80%        | 补充测试用例   |
| 测试可维护性 | RECOMMENDED | 测试代码规范 | 标记警告       |

**检查输出**:

```json
{
  "gate": "test_complete",
  "status": "partial",
  "checks": [
    {
      "item": "测试通过率",
      "status": "passed",
      "details": "95%通过"
    },
    {
      "item": "测试覆盖率",
      "status": "failed",
      "details": "覆盖率65%，低于80%要求",
      "suggestion": "需要补充边缘情况的测试"
    }
  ],
  "overall_status": "partial",
  "action": "建议补充测试后再部署"
}
```

---

### 阶段5: 代码审查质量门禁

**触发时机**: code-reviewer 完成审查后

**检查项**:

| 检查项   | 优先级      | 通过条件       | 不通过处理   |
| -------- | ----------- | -------------- | ------------ |
| 安全漏洞 | REQUIRED    | 无严重漏洞     | 修复安全漏洞 |
| 代码质量 | RECOMMENDED | 无严重质量问题 | 标记警告     |
| 性能问题 | RECOMMENDED | 无明显性能问题 | 标记警告     |

**检查输出**:

```json
{
  "gate": "code_review",
  "status": "passed",
  "checks": [
    {
      "item": "安全漏洞",
      "status": "passed",
      "details": "无严重安全漏洞"
    },
    {
      "item": "代码质量",
      "status": "warning",
      "details": "发现3个中等建议"
    },
    {
      "item": "性能问题",
      "status": "passed",
      "details": "无明显性能问题"
    }
  ],
  "overall_status": "passed"
}
```

---

## 质量门禁状态

### 状态类型

| 状态    | 标记 | 含义             | 后续动作                 |
| ------- | ---- | ---------------- | ------------------------ |
| passed  | ✅   | 检查通过         | 继续下一阶段             |
| partial | ⚠️   | 部分通过，有警告 | 可以继续，但建议处理警告 |
| failed  | ❌   | 检查未通过       | 必须修复才能继续         |
| skipped | ⏭️   | 检查跳过         | 不影响流程               |

### 处理规则

| 状态    | REQUIRED项 | RECOMMENDED项 |
| ------- | ---------- | ------------- |
| passed  | 继续       | 可选处理      |
| partial | 必须处理   | 可选处理      |
| failed  | 阻塞流程   | -             |
| skipped | 可选处理   | 可选处理      |

---

## 质量门禁配置

### 项目类型适配

#### Greenfield（全新开发）

- 需求分析门禁: 严格（必须通过REQUIRED项）
- 开发门禁: 严格
- 测试门禁: 严格（覆盖率>80%）

#### Brownfield（二次开发）

- 需求分析门禁: 宽松（可从现有代码推导）
- 开发门禁: 宽松（允许遗留代码）
- 测试门禁: 适中（覆盖率>70%）

#### Mixed（混合模式）

- 根据实际情况调整各阶段门禁

---

## 质量门禁检查流程

```
执行任务
    │
    ▼
┌────────────────────────────────────┐
│      质量门禁检查流程                │
├────────────────────────────────────┤
│ 1. 确定检查阶段                     │
│ 2. 读取对应检查项定义               │
│ 3. 执行检查                         │
│ 4. 汇总结果                        │
│ 5. 判定状态                        │
│ 6. 输出建议                        │
└────────────────────────────────────┘
         │
         ▼
   继续/暂停/终止
```

---

## 质量门禁结果记录

### 记录格式

```json
{
  "workflow": "用户管理系统",
  "gates": [
    {
      "name": "requirement_analysis",
      "status": "partial",
      "timestamp": "2024-01-01T10:00:00Z",
      "passed_checks": 3,
      "failed_checks": 1,
      "action_taken": "解决需求冲突后继续"
    },
    {
      "name": "task_decomposition",
      "status": "passed",
      "timestamp": "2024-01-01T10:05:00Z",
      "passed_checks": 5,
      "failed_checks": 0,
      "action_taken": "继续执行"
    }
  ],
  "final_status": "partial"
}
```

---

## 最佳实践

### Do's

✅ 在每个关键阶段执行质量门禁  
✅ REQUIRED项必须通过才能继续  
✅ 记录所有门禁检查结果  
✅ 根据项目类型调整门禁标准

### Don'ts

❌ 不要跳过质量门禁直接进入下一阶段  
❌ 不要忽视WARNING级别的问题  
❌ 不要在有阻塞性问题时强行继续  
❌ 不要忘记记录门禁结果
