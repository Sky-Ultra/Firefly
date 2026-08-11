---
translationOf: markdown-mermaid.md
sourceHash: sha256:a852bad9963930115f4166c47362085787defbf74577a19748da0665af995081
---
## A Practical Guide to Mermaid Diagrams in Markdown

This post shows how to build several kinds of diagrams in Markdown with Mermaid, including flowcharts, sequence diagrams, Gantt charts, class diagrams, and state diagrams.

## Flowchart Example

Flowcharts work well for processes and step-by-step algorithms.




```mermaid
graph TD
    A[开始] --> B{条件检查}
    B -->|是| C[处理步骤 1]
    B -->|否| D[处理步骤 2]
    C --> E[子过程]
    D --> E
    subgraph E [子过程详情]
        E1[子步骤 1] --> E2[子步骤 2]
        E2 --> E3[子步骤 3]
    end
    E --> F{另一个决策}
    F -->|选项 1| G[结果 1]
    F -->|选项 2| H[结果 2]
    F -->|选项 3| I[结果 3]
    G --> J[结束]
    H --> J
    I --> J
```

## Sequence Diagram Example

A sequence diagram traces how objects interact over time.

```mermaid
sequenceDiagram
    participant User as 用户
    participant WebApp as 网页应用
    participant Server as 服务器
    participant Database as 数据库

    User->>WebApp: 提交登录请求
    WebApp->>Server: 发送认证请求
    Server->>Database: 查询用户凭据
    Database-->>Server: 返回用户数据
    Server-->>WebApp: 返回认证结果
    
    alt 认证成功
        WebApp->>User: 显示欢迎页面
        WebApp->>Server: 请求用户数据
        Server->>Database: 获取用户偏好
        Database-->>Server: 返回偏好设置
        Server-->>WebApp: 返回用户数据
        WebApp->>User: 加载个性化界面
    else 认证失败
        WebApp->>User: 显示错误消息
        WebApp->>User: 提示重新输入
    end
```

## Gantt Chart Example

Gantt charts are a clear way to show a project schedule and its progress.

```mermaid
gantt
    title 网站开发项目时间线
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d
    
    section 设计阶段
    需求分析      :a1, 2023-10-01, 7d
    UI设计                 :a2, after a1, 10d
    原型创建        :a3, after a2, 5d
    
    section 开发阶段
    前端开发      :b1, 2023-10-20, 15d
    后端开发       :b2, after a2, 18d
    数据库设计           :b3, after a1, 12d
    
    section 测试阶段
    单元测试              :c1, after b1, 8d
    集成测试       :c2, after b2, 10d
    用户验收测试   :c3, after c2, 7d
    
    section 部署
    生产环境部署     :d1, after c3, 3d
    发布                    :milestone, after d1, 0d
```

## Class Diagram Example

A class diagram captures a system's static structure: its classes, properties, methods, and the relationships between them.

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : 写作
    User "1" -- "*" Comment : 发表
    Article "1" -- "*" Comment : 拥有
    Article "1" -- "*" Category : 属于
```

## State Diagram Example

A state diagram follows the sequence of states an object passes through during its lifetime.

```mermaid
stateDiagram-v2
    [*] --> 草稿
    
    草稿 --> 审核中 : 提交
    审核中 --> 草稿 : 拒绝
    审核中 --> 已批准 : 批准
    已批准 --> 已发布 : 发布
    已发布 --> 已归档 : 归档
    已发布 --> 草稿 : 撤回
    
    state 已发布 {
        [*] --> 活跃
        活跃 --> 隐藏 : 临时隐藏
        隐藏 --> 活跃 : 恢复
        活跃 --> [*]
        隐藏 --> [*]
    }
    
    已归档 --> [*]
```

## Pie Chart Example

Pie charts are useful when the main point is the proportion each value represents.

```mermaid
pie title 网站流量来源分析
    "搜索引擎" : 45.6
    "直接访问" : 30.1
    "社交媒体" : 15.3
    "推荐链接" : 6.4
    "其他来源" : 2.6
```

## Summary

Mermaid is a capable way to draw diagrams without leaving a Markdown document. The examples above cover flowcharts, sequence diagrams, Gantt charts, class diagrams, state diagrams, and pie charts. Each one can make a complicated process or data structure easier to follow.

To use Mermaid, mark a fenced code block with the `mermaid` language and describe the diagram in its compact text syntax. Mermaid turns that description into the finished visual.

It is worth trying in a technical post or project document whenever a diagram can explain something more clearly than another paragraph.
