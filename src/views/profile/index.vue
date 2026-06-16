<template>
  <div class="workbench-page">
    <section class="workbench-hero glass-panel">
      <div class="hero-copy">
        <span class="eyebrow">{{ workbench.role || roleLabel }} Workbench</span>
        <h1>{{ workbench.title || `${roleLabel}工作台` }}</h1>
        <p>{{ heroDescription }}</p>
        <div class="hero-meta">
          <span><i class="fas fa-calendar-check"></i> 今日工作台</span>
          <span><i class="fas fa-layer-group"></i> 角色数据聚合</span>
        </div>
      </div>
      <div class="identity-card">
        <div class="avatar-mark">{{ avatarText }}</div>
        <div>
          <strong>{{ workbench.realName || currentUser.realName || currentUser.nickname || currentUser.username || '未登录用户' }}</strong>
          <span>{{ workbench.username || currentUser.username || 'competition user' }}</span>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <article v-for="item in statCards" :key="item.label" class="stat-card glass-panel" :class="item.tone">
        <div class="stat-icon">
          <i :class="item.icon"></i>
        </div>
        <div>
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.hint }}</small>
        </div>
      </article>
    </section>

    <section class="workbench-layout">
      <main class="main-panel glass-panel">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Role Actions</span>
            <h2>当前角色功能</h2>
          </div>
        </div>
        <div class="action-grid">
          <button
            v-for="action in actionCards"
            :key="action.label"
            class="action-card"
            @click="goAction(action)"
          >
            <i :class="action.icon"></i>
            <span>
              <strong>{{ action.label }}</strong>
              <small>{{ action.desc }}</small>
            </span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <section class="content-card glass-panel">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">{{ primarySection.eyebrow }}</span>
              <h2>{{ primarySection.title }}</h2>
            </div>
            <button class="ghost-btn" @click="refreshWorkbench">
              <i class="fas fa-sync-alt" :class="{ rotating: loading }"></i>
              刷新
            </button>
          </div>

          <div class="data-list" v-if="primaryItems.length">
            <article v-for="item in primaryItems" :key="item.key" class="data-row">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.desc }}</p>
              </div>
              <span>{{ item.meta }}</span>
            </article>
          </div>
          <div v-else class="empty-tip">
            <i class="fas fa-inbox"></i>
            <strong>暂无相关数据</strong>
            <span>可以先使用上方功能入口完成当前角色的核心流程。</span>
          </div>
        </section>
      </main>

      <aside class="side-panel">
        <section class="todo-card glass-panel">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Todo</span>
              <h2>待办提醒</h2>
            </div>
          </div>
          <div class="todo-list" v-if="todos.length">
            <button
              v-for="todo in todos"
              :key="`${todo.type}-${todo.relatedId}-${todo.title}`"
              class="todo-row"
              :class="todo.priority"
              @click="goTodo(todo)"
            >
              <span>{{ todo.priority || 'normal' }}</span>
              <strong>{{ todo.title }}</strong>
              <small>{{ todo.content }}</small>
            </button>
          </div>
          <div v-else class="empty-mini">当前没有紧急待办</div>
        </section>

        <section class="resource-card glass-panel">
          <span class="eyebrow">Resources</span>
          <h2>备赛资源</h2>
          <p>根据角色工作台同步展示资源入口，学生可下载资料，教师和管理员可用于指导与归档。</p>
          <button @click="$router.push('/resource')">
            进入资源中心
            <i class="fas fa-arrow-right"></i>
          </button>
        </section>
      </aside>
    </section>
  </div>
</template>

<script>
import { getCurrentCompetitionUser, getCurrentUserId, getResponseData } from '@/utils/competition'

const ACTION_META = {
  '赛事浏览与报名': { icon: 'fas fa-trophy', path: '/', desc: '查看报名中赛事与赛程详情' },
  '团队组建与成员管理': { icon: 'fas fa-users', path: '/team', desc: '创建团队、查看成员和指导老师' },
  '参赛项目进度维护': { icon: 'fas fa-project-diagram', path: '/project', desc: '维护项目进度、里程碑和版本' },
  '作品提交与版本记录': { icon: 'fas fa-upload', path: '/submission', desc: '查看我的提交记录并追踪版本' },
  '备赛资源下载': { icon: 'fas fa-book-open', path: '/resource', desc: '下载模板、课件和评分标准' },
  '获奖信息查询': { icon: 'fas fa-medal', path: '/award', desc: '查看获奖公示与评审结果' },
  '赛事信息发布': { icon: 'fas fa-calendar-plus', path: '/admin/competition', desc: '发布赛事并维护赛事资料' },
  '参赛团队资质审核': { icon: 'fas fa-user-check', path: '/team', desc: '审核团队状态与参赛资格' },
  '指导项目绑定': { icon: 'fas fa-link', path: '/project', desc: '跟进指导团队和项目绑定关系' },
  '项目线上指导': { icon: 'fas fa-comments', path: '/ai-chat', desc: '辅助学生完善项目材料' },
  '参赛作品评审': { icon: 'fas fa-clipboard-check', path: '/admin/review', desc: '查看提交作品并录入评分' },
  '获奖信息录入': { icon: 'fas fa-award', path: '/admin/review', desc: '维护奖项与评审归档' },
  '本院系赛事审核': { icon: 'fas fa-check-double', path: '/admin/competition', desc: '审核赛事发布与状态流转' },
  '参赛全量数据查看': { icon: 'fas fa-chart-pie', path: '/admin/competition', desc: '查看赛事、团队、项目总览' },
  '获奖成果统计归档': { icon: 'fas fa-medal', path: '/award', desc: '汇总获奖成果和评审结果' },
  '数据报表导出': { icon: 'fas fa-file-export', path: '/admin/review', desc: '整理提交与评审数据' },
  '本院系师生账号管理': { icon: 'fas fa-user-cog', path: '/admin/user', desc: '管理教师与学生账号' }
}

export default {
  name: 'ProfileWorkbench',
  data() {
    return {
      loading: false,
      workbench: {},
      currentUser: getCurrentCompetitionUser() || {}
    }
  },
  computed: {
    roleLabel() {
      const role = this.workbench.role || this.currentUser.role || '学生'
      const map = {
        student: '学生',
        teacher: '教师',
        admin: '管理员',
        super_admin: '管理员',
        department_admin: '管理员'
      }
      return map[role] || role
    },
    avatarText() {
      const name = this.workbench.realName || this.currentUser.realName || this.currentUser.nickname || this.currentUser.username || '竞'
      return String(name).slice(-2)
    },
    heroDescription() {
      if (this.roleLabel === '教师') {
        return '聚焦赛事发布、团队资质审核、指导项目绑定、线上指导、作品评审和获奖录入。'
      }
      if (this.roleLabel === '管理员') {
        return '聚焦赛事审核、全量数据查看、获奖成果归档、报表导出和师生账号管理。'
      }
      return '聚焦赛事浏览报名、团队管理、项目进度维护、作品提交、资源下载和获奖查询。'
    },
    statCards() {
      const stats = this.workbench.stats || {}
      const map = this.roleLabel === '教师'
        ? [
          ['publishedCompetitionCount', '发布赛事'],
          ['guidedTeamCount', '指导团队'],
          ['guidedProjectCount', '指导项目'],
          ['reviewedProjectCount', '已评审项目']
        ]
        : this.roleLabel === '管理员'
          ? [
            ['competitionCount', '赛事总数'],
            ['teamCount', '团队总数'],
            ['projectCount', '项目总数'],
            ['awardCount', '获奖成果'],
            ['teacherCount', '教师账号'],
            ['studentCount', '学生账号']
          ]
          : [
            ['myTeamCount', '我的团队'],
            ['myProjectCount', '我的项目'],
            ['mySubmissionCount', '作品提交'],
            ['myAwardCount', '获奖结果']
          ]

      return map.map(([key, label], index) => ({
        label,
        value: stats[key] ?? 0,
        icon: this.getStatIcon(label),
        hint: this.getStatHint(label),
        tone: `tone-${(index % 6) + 1}`
      }))
    },
    actionCards() {
      const actions = this.workbench.allowedActions || []
      return actions.map(label => ({
        label,
        ...(ACTION_META[label] || { icon: 'fas fa-circle-dot', path: '/', desc: '进入相关业务模块' })
      }))
    },
    todos() {
      return this.workbench.todos || []
    },
    primarySection() {
      if (this.roleLabel === '管理员') return { eyebrow: 'Admin Data', title: '全量项目与提交概览' }
      if (this.roleLabel === '教师') return { eyebrow: 'Guidance', title: '指导项目与待评审作品' }
      return { eyebrow: 'My Progress', title: '我的项目与提交进度' }
    },
    primaryItems() {
      const source = this.roleLabel === '管理员'
        ? [...(this.workbench.projects || []), ...(this.workbench.submissions || [])]
        : this.roleLabel === '教师'
          ? (this.workbench.projects || [])
          : [...(this.workbench.projects || []), ...(this.workbench.submissions || [])]

      return source.slice(0, 8).map((item, index) => {
        const isSubmission = item.submissionId
        return {
          key: `${isSubmission ? 'submission' : 'project'}-${item.submissionId || item.projectId || index}`,
          title: isSubmission ? (item.projectName || '未命名提交') : (item.projectName || '未命名项目'),
          desc: isSubmission
            ? `${item.teamName || '未绑定团队'} · ${item.competitionTitle || '未绑定赛事'}`
            : `${item.teamName || '未绑定团队'} · 进度 ${item.progress ?? 0}% · 提交 ${item.submissionCount ?? 0} 次`,
          meta: isSubmission ? (item.version || '暂无版本') : (item.awardLevel || item.latestVersion || '进行中')
        }
      })
    }
  },
  created() {
    if (!this.currentUser || !getCurrentUserId(null)) {
      this.$message.warning('请先登录后查看角色工作台')
      this.$router.push('/login')
      return
    }
    this.refreshWorkbench()
  },
  methods: {
    async refreshWorkbench() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/workbench', {
          params: { userId: getCurrentUserId() }
        })
        this.workbench = getResponseData(res, {})
      } catch (err) {
        this.workbench = this.buildFallbackWorkbench()
        this.$message.warning('角色工作台接口暂不可用，已展示本地演示结构')
      } finally {
        this.loading = false
      }
    },
    buildFallbackWorkbench() {
      const role = this.currentUser.role || '学生'
      const label = role === 'teacher' ? '教师' : role === 'admin' ? '管理员' : role
      return {
        role: label,
        title: `${label || '学生'}工作台`,
        realName: this.currentUser.realName || this.currentUser.nickname || this.currentUser.username,
        username: this.currentUser.username,
        stats: {},
        allowedActions: label === '教师'
          ? ['赛事信息发布', '参赛团队资质审核', '指导项目绑定', '项目线上指导', '参赛作品评审', '获奖信息录入']
          : label === '管理员'
            ? ['本院系赛事审核', '参赛全量数据查看', '获奖成果统计归档', '数据报表导出', '本院系师生账号管理']
            : ['赛事浏览与报名', '团队组建与成员管理', '参赛项目进度维护', '作品提交与版本记录', '备赛资源下载', '获奖信息查询'],
        todos: []
      }
    },
    getStatIcon(label) {
      if (label.includes('赛事')) return 'fas fa-trophy'
      if (label.includes('团队')) return 'fas fa-users'
      if (label.includes('项目')) return 'fas fa-project-diagram'
      if (label.includes('提交')) return 'fas fa-upload'
      if (label.includes('获奖')) return 'fas fa-medal'
      if (label.includes('教师')) return 'fas fa-chalkboard-teacher'
      if (label.includes('学生')) return 'fas fa-user-graduate'
      return 'fas fa-chart-bar'
    },
    getStatHint(label) {
      if (label.includes('赛事')) return '赛事流程'
      if (label.includes('团队')) return '团队协同'
      if (label.includes('项目')) return '项目进度'
      if (label.includes('提交')) return '版本记录'
      if (label.includes('获奖')) return '成果归档'
      if (label.includes('账号')) return '账号管理'
      return '实时概览'
    },
    goAction(action) {
      this.$router.push(action.path)
    },
    goTodo(todo) {
      const routeMap = {
        TEAM: '/team',
        TEAM_AUDIT: '/team',
        SUBMISSION: todo.relatedId ? `/project/submit/${todo.relatedId}` : '/submission',
        PROGRESS: '/project',
        REVIEW: '/admin/review',
        COMPETITION_AUDIT: '/admin/competition'
      }
      this.$router.push(routeMap[todo.type] || '/')
    }
  }
}
</script>

<style scoped>
.workbench-page {
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 28px 48px;
  color: #18212f;
  font-family: var(--font-body);
  overflow: hidden;
}
.workbench-page::before,
.workbench-page::after {
  content: "";
  position: fixed;
  z-index: 0;
  pointer-events: none;
  filter: blur(8px);
}
.workbench-page::before {
  inset: 76px 0 auto 0;
  height: 360px;
  background:
    radial-gradient(circle at 16% 30%, rgba(199, 232, 225, 0.74), transparent 28%),
    radial-gradient(circle at 72% 22%, rgba(214, 205, 232, 0.58), transparent 30%),
    linear-gradient(135deg, rgba(243, 249, 248, 0.96), rgba(244, 247, 252, 0.76));
}
.workbench-page::after {
  right: -90px;
  bottom: 80px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(191, 209, 234, 0.38);
}
.workbench-page > * {
  position: relative;
  z-index: 1;
}
.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 18px 46px rgba(79, 99, 124, 0.12);
  backdrop-filter: blur(18px);
}
.workbench-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 160px;
  padding: 22px 28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 88% 18%, rgba(214, 205, 232, 0.62), transparent 34%),
    radial-gradient(circle at 8% 92%, rgba(243, 226, 167, 0.38), transparent 32%),
    rgba(255, 255, 255, 0.72);
}
.hero-copy {
  min-width: 0;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  width: max-content;
  padding: 6px 11px;
  border: 1px solid rgba(111, 143, 168, 0.18);
  border-radius: 9999px;
  background: rgba(235, 247, 242, 0.82);
  color: #526173;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.workbench-hero h1,
.section-heading h2,
.stat-card strong,
.resource-card h2 {
  color: #141b2a;
  font-family: var(--font-body);
  letter-spacing: 0;
}
.workbench-hero h1 {
  margin: 14px 0 8px;
  font-size: 34px;
  line-height: 1.12;
  font-weight: 900;
}
.workbench-hero p {
  max-width: 760px;
  margin: 0;
  font-size: 15px;
}
.workbench-hero p,
.resource-card p,
.data-row p,
.action-card small,
.identity-card span {
  color: #647082;
  line-height: 1.55;
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.hero-meta span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.64);
  color: #59677a;
  font-size: 12px;
  font-weight: 700;
}
.identity-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 236px;
  padding: 12px 14px;
  border: 1px solid rgba(111, 143, 168, 0.18);
  border-radius: 24px;
  background: rgba(237, 234, 248, 0.78);
  box-shadow: 0 14px 28px rgba(110, 102, 142, 0.12);
}
.avatar-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #233044;
  font-weight: 900;
}
.identity-card strong,
.identity-card span {
  display: block;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 92px;
  padding: 16px;
  border-radius: 20px;
}
.stat-card.tone-1 { background: rgba(214, 205, 232, 0.62); }
.stat-card.tone-2 { background: rgba(201, 230, 216, 0.62); }
.stat-card.tone-3 { background: rgba(191, 209, 234, 0.62); }
.stat-card.tone-4 { background: rgba(243, 226, 167, 0.58); }
.stat-card.tone-5 { background: rgba(232, 199, 174, 0.5); }
.stat-card.tone-6 { background: rgba(221, 232, 165, 0.54); }
.stat-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.62);
  color: #4f6f8a;
  font-size: 17px;
}
.stat-card span,
.stat-card small {
  display: block;
}
.stat-card span {
  color: #667085;
  font-size: 13px;
  font-weight: 700;
}
.stat-card strong {
  display: block;
  margin: 2px 0;
  color: #111827;
  font-size: 28px;
  line-height: 1;
  font-weight: 900;
}
.stat-card small {
  color: #788395;
  font-size: 12px;
}
.workbench-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 336px;
  gap: 16px;
}
.main-panel,
.todo-card,
.resource-card,
.content-card {
  padding: 18px;
  border-radius: 24px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.section-heading h2 {
  margin: 8px 0 0;
  font-size: 22px;
  font-weight: 900;
}
.section-heading.compact h2 {
  font-size: 20px;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.action-card,
.ghost-btn,
.todo-row,
.resource-card button {
  border: 1px solid rgba(111, 143, 168, 0.16);
  background: rgba(255, 255, 255, 0.62);
  color: #1f2937;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.action-card {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 10px;
  min-height: 74px;
  padding: 12px 14px;
  border-radius: 18px;
  text-align: left;
}
.action-card > i:first-child {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.74);
  color: #4f6f8a;
}
.action-card strong,
.action-card small {
  display: block;
}
.action-card strong {
  font-size: 14px;
}
.action-card small {
  margin-top: 2px;
  font-size: 12px;
}
.action-card:nth-child(1) { background: rgba(232, 199, 174, 0.42); }
.action-card:nth-child(2) { background: rgba(191, 209, 234, 0.48); }
.action-card:nth-child(3) { background: rgba(201, 230, 216, 0.48); }
.action-card:nth-child(4) { background: rgba(214, 205, 232, 0.48); }
.action-card:nth-child(5) { background: rgba(243, 226, 167, 0.44); }
.action-card:nth-child(6) { background: rgba(221, 232, 165, 0.42); }
.action-card:hover,
.ghost-btn:hover,
.todo-row:hover,
.resource-card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(79, 99, 124, 0.14);
  background: rgba(255, 255, 255, 0.86);
}
.content-card {
  background: rgba(255, 255, 255, 0.58);
}
.data-list {
  display: grid;
  gap: 9px;
}
.data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(111, 143, 168, 0.13);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
}
.data-row strong,
.data-row span {
  color: #1f2937;
  font-weight: 900;
}
.data-row strong {
  font-size: 14px;
}
.data-row p {
  margin: 4px 0 0;
  font-size: 12px;
}
.data-row span {
  flex: 0 0 auto;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(235, 247, 242, 0.82);
  color: #4f6f8a;
  font-size: 12px;
}
.ghost-btn,
.resource-card button {
  min-height: 34px;
  padding: 0 13px;
  border-radius: 12px;
  background: rgba(243, 226, 167, 0.48);
  color: #344054;
}
.side-panel {
  display: grid;
  align-content: start;
  gap: 14px;
}
.todo-list {
  display: grid;
  gap: 9px;
}
.todo-row {
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  text-align: left;
}
.todo-row.high {
  background: rgba(232, 199, 174, 0.48);
}
.todo-row.medium {
  background: rgba(243, 226, 167, 0.5);
}
.todo-row span {
  width: max-content;
  padding: 3px 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.76);
  color: #344054;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}
.todo-row strong {
  font-size: 14px;
}
.todo-row small {
  font-size: 12px;
}
.todo-row small,
.empty-mini,
.empty-tip span {
  color: #667085;
}
.resource-card {
  background:
    linear-gradient(135deg, rgba(201, 230, 216, 0.58), rgba(191, 209, 234, 0.42)),
    rgba(255, 255, 255, 0.62);
}
.resource-card h2 {
  margin: 10px 0 8px;
  font-size: 20px;
  font-weight: 900;
}
.resource-card p {
  margin: 0 0 14px;
  font-size: 13px;
}
.resource-card button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
}
.empty-tip,
.empty-mini {
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 130px;
  text-align: center;
}
.empty-tip i {
  color: #6f8fa8;
  font-size: 24px;
}
.rotating {
  animation: rotate 0.8s linear infinite;
}
@keyframes rotate {
  to { transform: rotate(360deg); }
}
@media (max-width: 1080px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .workbench-layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .workbench-page {
    padding: 18px 14px 36px;
  }
  .workbench-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px 18px;
  }
  .workbench-hero h1 {
    font-size: 28px;
  }
  .identity-card {
    min-width: 0;
    width: 100%;
    border-radius: 20px;
  }
  .stats-grid,
  .action-grid {
    grid-template-columns: 1fr;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .data-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
