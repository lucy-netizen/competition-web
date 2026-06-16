# 高校学科竞赛全生命周期管理与智能备赛服务系统 - 项目最终认知备忘

## 1. 项目定位

项目名称统一为：高校学科竞赛全生命周期管理与智能备赛服务系统。

本系统面向高校学科竞赛组织管理场景，服务对象包括学生、指导教师和管理员三类角色。系统覆盖赛事发布与审核、学生报名组队、项目过程管理、作品提交、教师评审、获奖公示、备赛资源管理、智能搜索、AI 智能备赛和数据分析驾驶舱，形成竞赛从发布到成果归档的全生命周期闭环。

说明：PDS 是早期模板残留，不作为最终项目名称使用。

## 2. 项目路径

前端项目路径：

```text
D:\pds_sdu-web-v1.0
```

后端项目路径：

```text
D:\Program Files\bbs-springboot\pds_sdu-springboot-v1.0
```

后端竞赛业务核心包：

```text
mojian-server/src/main/java/com/mojian/competition
```

后端演示数据脚本：

```text
mojian-server/src/main/resources/sql
```

## 3. 开发环境与技术栈

前端开发工具：

```text
WebStorm 2025.3.2
```

后端开发工具：

```text
IntelliJ 2025.3.1.1
```

数据库工具：

```text
MySQL Workbench 8.0 CE
```

前端技术：

```text
Vue2
Vite
Vue Router
Vuex
Element UI
Axios
ECharts
Sass
```

后端技术：

```text
Spring Boot 2.7.0
MyBatis-Plus
MySQL
Redis
Sa-Token
Knife4j
DeepSeek API
```

数据库：

```text
competition_manage_system
```

## 4. 本地运行地址

前端地址：

```text
http://localhost:3000
```

后端地址：

```text
http://localhost:8800
```

后端接口文档：

```text
http://localhost:8800/doc.html
```

前端开发代理：

```text
/dev-api -> http://localhost:8800
```

当前项目尚未部署到云端或公有服务器，产品说明文档中的公网访问链接部分暂时保留为空。

## 5. 演示账号

密码均为：

```text
123456
```

管理员：

```text
admin
```

教师：

```text
teacher_li
teacher_wang
```

学生：

```text
student_chen
student_zhao
student_sun
student_zhou
```

推荐录像使用顺序：

```text
admin -> student_chen -> teacher_li
```

## 6. 角色与权限

### 学生

学生角色侧重参赛流程：

- 赛事浏览与报名
- 团队组建与成员管理
- 参赛项目进度维护
- 作品提交与版本记录
- 备赛资源下载
- 获奖信息查询
- AI 智能备赛
- 全站搜索

### 教师

教师角色侧重指导与评审：

- 指导老师工作台
- 发布赛事
- 查看指导团队
- 查看指导项目
- 团队资质审核
- 作品评审
- 获奖信息录入
- 结合资源和 AI 结果指导学生备赛

前端最终版中，教师可以访问：

```text
/admin/competition
/admin/review
```

### 管理员

管理员角色侧重平台统筹：

- 管理员工作台
- 数据分析驾驶舱
- 赛事审核与状态管理
- 全量项目与提交查看
- 作品评审与成果归档
- 用户管理
- 师生账号筛选
- 获奖成果统计

管理员专属页面：

```text
/analytics
/admin/user
```

## 7. 前端核心路由

```text
/                         首页/赛事大厅
/competition/detail/:id   赛事详情
/team                     我的团队
/team/detail/:id          团队详情
/project                  我的项目
/project/submit/:projectId 作品提交
/resource                 备赛资源
/ai-chat                  智能备赛
/award                    获奖公示
/notification             系统通知
/submission               我的提交记录
/analytics                数据分析驾驶舱
/admin/competition        赛事管理
/admin/review             作品评审
/admin/user               用户管理
/user/profile             角色工作台
/login                    登录
/register                 注册
```

## 8. 后端核心控制器

```text
UserController                  用户注册、登录、认证、用户列表
CompetitionController           赛事发布、审核、状态更新、查询
CompetitionManageController     赛事管理兼容入口
CompetitionOverviewController   首页和数据看板聚合接口
TeamController                  团队创建、绑定教师、审核、状态更新
TeamMemberController            团队成员申请、审核、查询
ProjectController               项目创建、进度更新、详情查询
ProjectMilestoneController      项目里程碑创建、状态更新、查询
SubmissionController            作品提交、提交历史、全部评审列表
AwardReviewController           作品评审、获奖录入、获奖查询
CompetitionResourceController   资源上传、下载、按类型查询、已发布资源
SystemNotificationController    通知发送、已读、未读、列表
SystemOperationLogController    操作日志保存与查询
WorkbenchController             学生、教师、管理员角色工作台
AlChatRecordController          AI 智能备赛问答与历史记录
FrontendCompatibilityController 旧模板接口兼容
```

## 9. 数据分析驾驶舱

页面：

```text
/analytics
```

技术：

```text
ECharts
```

管理员端展示内容：

- 开放赛事数量
- 参赛团队数量
- 参赛项目数量
- 备赛资源数量
- 赛事类型分布
- 月度报名趋势
- 热门资源下载排行
- 运营观察建议

### 赛事类型分布

使用饼图或环形图展示不同类型赛事的占比，例如创新创业类、程序设计类、数学建模类、学科竞赛类、科研训练类。用于帮助管理员了解不同竞赛方向的资源投入和学生参与结构。

演示讲解重点：

```text
图表通过不同颜色展示赛事类型占比，管理员可以直观看到当前平台中哪类赛事最多，从而调整宣传重点和资源配置。
```

### 月度报名趋势

使用折线图展示不同月份报名团队数量变化。横轴为月份，纵轴为报名团队数量，折线走势体现报名热度变化。

演示讲解重点：

```text
折线图反映平台报名活跃度变化，例如 5 月到 6 月报名数量明显增长，管理员可以据此判断竞赛宣传高峰和报名截止提醒时间。
```

### 热门资源下载排行

使用柱状图展示下载量最高的备赛资源，如项目计划书模板、评审评分标准、答辩课件、往届优秀案例等。

演示讲解重点：

```text
柱状图根据资源下载次数排序，帮助管理员和教师识别学生最需要的备赛材料，也能为后续资源推荐和资料补充提供依据。
```

## 10. AI 智能备赛

页面：

```text
/ai-chat
```

推荐在学生端演示。

原因：

```text
AI 智能备赛的主要使用者是学生，场景更自然：学生在准备项目摘要、答辩 PPT、创新点表达和材料清单时，可以直接向 AI 提问。
```

后端实现：

- 前端调用后端接口
- 后端从环境变量读取 `DEEPSEEK_API_KEY`
- 后端构造系统提示词
- 可拼接关联赛事和项目上下文
- 后端请求 DeepSeek
- 返回结构化备赛建议
- 保存问答历史记录

相关接口：

```text
POST /competition/ai-chat/ask
POST /competition/ai-chat/send
POST /competition/ai-chat/chat
GET  /competition/ai-chat/list/by-user
GET  /competition/ai-chat/history
```

推荐演示问题：

```text
帮我优化创新创业大赛项目摘要
```

或：

```text
请根据当前项目，给出答辩 PPT 的结构建议
```

推荐讲解词：

```text
智能备赛模块接入 DeepSeek 大模型。学生可以关联自己的项目或赛事后提问，后端会结合项目名称、进度、项目描述和赛事信息生成针对性的备赛建议，帮助学生优化项目摘要、答辩结构、创新点表达和材料清单。
```

## 11. 全站搜索

位置：

```text
顶部导航搜索按钮
```

功能：

- 搜索赛事
- 搜索项目
- 搜索备赛资源
- 搜索获奖信息
- 推荐关键词
- 快速入口
- 关键词高亮
- 分类结果展示

推荐关键词：

```text
评分标准
答辩 PPT
AI备赛
项目计划书
一等奖
```

推荐讲解词：

```text
全站搜索可以聚合检索赛事、项目、备赛资源和获奖信息，并对命中的关键词进行高亮展示，帮助学生和教师快速定位备赛资料和相关竞赛信息。
```

## 12. 备赛资源中心

页面：

```text
/resource
```

功能：

- 资源列表
- 资源类型筛选
- 关键词搜索
- 文件类型识别
- 下载次数展示
- 真实文件下载接口
- 后端文件不可用时导出资源说明

后端下载接口：

```text
POST /competition/resource/download
```

## 13. 完整业务闭环

系统主业务链路：

```text
管理员/教师发布赛事
-> 管理员审核赛事
-> 学生浏览赛事
-> 学生报名并创建团队
-> 学生创建参赛项目
-> 学生维护项目进度
-> 学生提交作品版本
-> 教师/管理员评审作品
-> 录入分数和获奖等级
-> 获奖公示
-> 管理员通过数据分析驾驶舱查看平台运行情况
```

## 14. 推荐演示录像结构

目标时长：

```text
4分30秒 - 5分钟
```

推荐顺序：

```text
1. 项目运行环境
2. 管理员端：工作台 + 数据分析 + 赛事审核
3. 学生端：赛事浏览 + 团队 + 项目 + 提交 + AI 智能备赛 + 搜索资源
4. 教师端：指导工作台 + 赛事发布/作品评审
5. 获奖公示与总结
```

## 15. 演示录像重点调整

AI 智能备赛：

```text
放在学生端展示。
```

教师端：

```text
重点讲指导项目、团队资质审核、作品评审、评分与获奖录入。
```

管理员端：

```text
重点讲数据分析驾驶舱、赛事审核、用户管理、全量统筹和成果归档。
```

数据分析讲解需要具体说明 ECharts 如何展示：

```text
赛事类型分布：饼图/环形图
月度报名趋势：折线图
热门资源排行：柱状图
```

## 16. 构建验证

前端构建命令：

```text
npm.cmd run build
```

结果：

```text
构建成功
```

说明：直接运行 `npm run build` 会被 PowerShell 执行策略拦截，使用 `npm.cmd run build` 可正常构建。

后端构建命令：

```text
mvn -pl mojian-server -am -DskipTests package
```

结果：

```text
BUILD SUCCESS
```

构建警告：

- 前端 Sass `@import` 废弃警告，不影响构建
- 前端 chunk 体积警告，不影响构建
- 后端部分依赖版本和过时 API 警告，不影响构建

## 17. 产品说明文档中暂留内容

云端或公网部署链接暂时为空。

后续产品说明文档中可以写：

```text
项目当前已完成本地前后端联调，后续可部署至云服务器或公有服务器。

公网访问链接：待部署后补充
后端接口地址：待部署后补充
```

## 18. 后续交付材料结构建议

```text
高校学科竞赛全生命周期管理与智能备赛服务系统/
├─ 1_产品说明文档/
│  └─ 产品说明文档.docx 或 PDF
├─ 2_演示录像/
│  └─ 高校学科竞赛全生命周期管理与智能备赛服务系统_演示录像.mp4
├─ 3_项目源码/
│  ├─ pds_sdu-web-v1.0/
│  └─ pds_sdu-springboot-v1.0/
├─ 4_数据库文件/
│  └─ competition_manage_system.sql
└─ 5_部署说明/
   └─ 部署与访问说明.txt
```

