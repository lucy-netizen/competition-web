<template>
  <div class="competition-home">
    <section class="hero-dashboard capsule-hero">
      <div class="capsule-grain"></div>
      <div class="capsule-deco-pills" aria-hidden="true">
        <span class="capsule-pill pill-coral">Register</span>
        <span class="capsule-pill pill-lavender">Team Up</span>
        <span class="capsule-pill pill-sky">Project</span>
        <span class="capsule-pill pill-lime">Review</span>
        <span class="capsule-pill pill-yellow">2026</span>
        <span class="capsule-pill pill-peach">Award</span>
      </div>

      <div class="hero-content">
        <div class="hero-kicker">
          <span class="pulse-dot"></span>
          山东大学学生竞赛服务平台
        </div>
        <div class="hero-title-en">Competition Workspace</div>
        <h1>让每一场竞赛，都有清晰的工作台</h1>
        <div class="hero-subtitle-en">Plan, team up, submit, review. All in one elegant campus hub.</div>
        <p>
          从赛事报名、团队组建、项目推进到作品评审，用一个面向学生、教师和管理员的竞赛协作空间完成全流程管理。
        </p>

        <div class="hero-actions">
          <button class="primary-action" @click="goRoute('/team')">
            <i class="fas fa-users"></i>
            创建/加入团队
          </button>
          <button class="secondary-action" @click="goRoute('/resource')">
            <i class="fas fa-book-open"></i>
            查看备赛资源
          </button>
        </div>
      </div>

      <aside class="hero-workspace">
        <div class="mockup-bar">
          <span></span><span></span><span></span>
          <strong>Competition OS</strong>
        </div>
        <div class="overview-header">
          <div>
            <span>今日概览</span>
            <strong>{{ currentDate }}</strong>
          </div>
          <i class="fas fa-layer-group"></i>
        </div>

        <div class="stat-grid">
          <div
            v-for="stat in dashboardStats"
            :key="stat.label"
            class="stat-card"
          >
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.hint }}</small>
          </div>
        </div>

        <div class="process-card">
          <div class="process-title">
            <span>参赛流程</span>
            <span>{{ activeStep }}/4</span>
          </div>
          <div class="process-track">
            <div
              v-for="step in processSteps"
              :key="step.name"
              class="process-step"
              :class="{ done: step.index <= activeStep }"
            >
              <span>{{ step.index }}</span>
              <p>{{ step.name }}</p>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <section class="workspace-grid">
      <div class="main-column">
        <moments :momentList="momentList" detailPath="/competition" />

        <section class="feature-strip">
          <button
            v-for="feature in featureCards"
            :key="feature.title"
            class="feature-card"
            @click="goRoute(feature.path)"
          >
            <span class="feature-icon" :class="feature.theme">
              <i :class="feature.icon"></i>
            </span>
            <span>
              <strong>{{ feature.title }}</strong>
              <small>{{ feature.desc }}</small>
            </span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </section>

        <section class="competition-board">
          <div class="section-heading">
            <div>
              <span class="eyebrow">Competition Hub</span>
              <h2>正在报名的赛事</h2>
            </div>
            <button class="ghost-link" @click="refreshCompetitions">
              <i class="fas fa-sync-alt" :class="{ rotating: loading }"></i>
              刷新
            </button>
          </div>

          <div class="competition-grid">
            <article
              v-for="competition in displayCompetitions"
              :key="competition.competitionId"
              class="competition-card"
              @click="goToCompetitionDetail(competition.competitionId)"
            >
              <div class="card-topline">
                <span class="status-tag">{{ competition.status || '报名中' }}</span>
                <span>{{ formatTime(competition.regEndTime) || '滚动开放' }}</span>
              </div>
              <h3>{{ competition.title }}</h3>
              <p>{{ getCompetitionContent(competition.content) }}</p>
              <div class="card-meta">
                <span>
                  <i class="fas fa-user-tie"></i>
                  {{ competition.publisherName || `主办方 ${competition.publisherId || '教务处'}` }}
                </span>
                <span>
                  <i class="fas fa-users"></i>
                  {{ competition.teamCount || '开放组队' }}
                </span>
              </div>
              <div class="card-progress">
                <span>报名热度</span>
                <div class="progress-bar">
                  <i :style="{ width: `${competition.hot || 72}%` }"></i>
                </div>
              </div>
            </article>

            <div v-if="displayCompetitions.length === 0 && !loading" class="empty-state">
              <i class="fas fa-calendar-plus"></i>
              <span>暂无正在报名的赛事</span>
              <small>可以先创建团队、整理项目材料或查看备赛资源。</small>
            </div>
          </div>
        </section>
      </div>

      <aside class="side-column">
        <section class="timeline-card">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Schedule</span>
              <h2>关键节点</h2>
            </div>
          </div>
          <div class="timeline-list">
            <div
              v-for="item in timelineItems"
              :key="item.title"
              class="timeline-item"
            >
              <time>{{ item.date }}</time>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="resource-card">
          <div class="resource-visual">
            <span>Resource</span>
            <strong>备赛资料库</strong>
          </div>
          <p>沉淀往届作品、培训课件、评审标准和提交模板，支持按赛事阶段快速定位。</p>
          <button @click="goRoute('/resource')">
            进入资源中心
            <i class="fas fa-arrow-right"></i>
          </button>
        </section>

        <section class="notice-card">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Todo</span>
              <h2>快捷办理</h2>
            </div>
          </div>
          <button
            v-for="item in quickTasks"
            :key="item.label"
            class="task-row"
            @click="goRoute(item.path)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <small>{{ item.hint }}</small>
          </button>
        </section>
      </aside>
    </section>
  </div>
</template>

<script>
import moments from './components/moments.vue'
import { getResponseData } from '@/utils/competition'

export default {
  name: 'Home',
  components: {
    moments
  },
  data() {
    return {
      competitionList: [],
      dashboard: null,
      loading: false,
      activeStep: 2,
      momentList: [
        { id: 1, content: '创新创业类赛事报名通道已开放，请团队负责人尽快完善成员信息。' },
        { id: 2, content: '校级选拔赛项目计划书模板已更新，可在备赛资源中心下载。' },
        { id: 3, content: '指导老师评审安排将在系统通知中同步，请留意站内消息。' },
        { id: 4, content: '作品提交前请完成团队确认、附件上传和承诺书签署。' }
      ],
      fallbackCompetitions: [
        {
          competitionId: 7,
          title: '全国大学生创新创业训练计划',
          content: '围绕真实问题开展创新实践，支持跨学院组队、导师指导和项目孵化。',
          regEndTime: '2026-06-20 23:59:59',
          publisherName: '创新创业学院',
          status: '报名中',
          teamCount: '128 支团队',
          hot: 86
        },
        {
          competitionId: 8,
          title: 'ACM 程序设计竞赛校内选拔',
          content: '聚焦算法能力、工程实现与团队协作，完成校内选拔后推荐参加区域赛。',
          regEndTime: '2026-06-08 23:59:59',
          publisherName: '计算机科学与技术学院',
          status: '组队中',
          teamCount: '64 支团队',
          hot: 74
        },
        {
          competitionId: 9,
          title: '数学建模竞赛集训营',
          content: '提供专题训练、往届题库和模拟评审，帮助学生完成从选题到论文提交的闭环。',
          regEndTime: '2026-07-01 23:59:59',
          publisherName: '数学学院',
          status: '培训中',
          teamCount: '42 支团队',
          hot: 68
        }
      ],
      featureCards: [
        {
          title: '赛事大厅',
          desc: '查看报名、赛程和详情',
          icon: 'fas fa-trophy',
          path: '/',
          theme: 'orange'
        },
        {
          title: '我的团队',
          desc: '成员管理与参赛绑定',
          icon: 'fas fa-users',
          path: '/team',
          theme: 'blue'
        },
        {
          title: '我的项目',
          desc: '进度跟踪与作品提交',
          icon: 'fas fa-project-diagram',
          path: '/project',
          theme: 'green'
        },
        {
          title: '智能备赛',
          desc: 'AI 辅助选题和问答',
          icon: 'fas fa-robot',
          path: '/ai-chat',
          theme: 'violet'
        }
      ],
      processSteps: [
        { index: 1, name: '赛事报名' },
        { index: 2, name: '组队立项' },
        { index: 3, name: '作品提交' },
        { index: 4, name: '评审公示' }
      ],
      timelineItems: [
        {
          date: '05/30',
          title: '报名材料补全',
          desc: '完善团队成员、指导老师与项目摘要。'
        },
        {
          date: '06/08',
          title: '校级初审',
          desc: '管理员汇总作品，进入专家评审环节。'
        },
        {
          date: '06/20',
          title: '作品终稿提交',
          desc: '提交附件、演示视频与承诺书。'
        },
        {
          date: '07/01',
          title: '获奖结果公示',
          desc: '系统同步奖项、证书和后续推荐。'
        }
      ],
      quickTasks: [
        { label: '创建团队', hint: '2 分钟', icon: 'fas fa-user-plus', path: '/team' },
        { label: '提交作品', hint: '待完善', icon: 'fas fa-cloud-upload-alt', path: '/project' },
        { label: '查看通知', hint: '站内信', icon: 'far fa-bell', path: '/notification' },
        { label: '获奖公示', hint: '结果追踪', icon: 'fas fa-medal', path: '/award' }
      ]
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })
    },
    displayCompetitions() {
      return this.competitionList.length ? this.competitionList : this.fallbackCompetitions
    },
    dashboardStats() {
      if (this.dashboard) {
        return [
          { label: '开放赛事', value: this.dashboard.activeCompetitionCount ?? this.dashboard.competitionCount ?? this.dashboard.activeCompetitions ?? 0, hint: '正在报名' },
          { label: '参赛团队', value: this.dashboard.teamCount ?? this.dashboard.totalTeams ?? 0, hint: '系统内活跃' },
          { label: '参赛项目', value: this.dashboard.projectCount ?? this.dashboard.totalProjects ?? 0, hint: '立项追踪' },
          { label: '备赛资源', value: this.dashboard.resourceCount ?? this.dashboard.totalResources ?? 0, hint: '模板/课件/案例' }
        ]
      }

      const activeCount = this.displayCompetitions.length
      const teamCount = this.displayCompetitions.reduce((sum, item) => {
        const match = String(item.teamCount || '').match(/\d+/)
        return sum + (match ? Number(match[0]) : 18)
      }, 0)

      return [
        { label: '开放赛事', value: activeCount, hint: '正在报名' },
        { label: '参赛团队', value: teamCount, hint: '系统内活跃' },
        { label: '备赛资源', value: '36+', hint: '模板/课件/案例' },
        { label: '待办事项', value: '4', hint: '本周关注' }
      ]
    }
  },
  created() {
    this.getCompetitionList()
  },
  methods: {
    async getCompetitionList() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/competition/list/active')
        this.competitionList = getResponseData(res, []).map((item, index) => ({
          ...item,
          title: item.title || item.competitionName,
          hot: item.hot || item.applyProgress || [86, 74, 68, 61][index % 4]
        }))
      } catch (err) {
        this.competitionList = []
      } finally {
        this.loading = false
      }
    },
    refreshCompetitions() {
      this.getCompetitionList()
    },
    goRoute(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    handleSearch() {
      this.$store.commit('SET_SEARCH_VISIBLE', true)
    },
    goToCompetitionDetail(id) {
      if (!id) return
      this.$router.push(`/competition/detail/${id}`)
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      return timeStr.split(' ')[0]
    },
    getCompetitionContent(content) {
      if (!content) return '赛事信息正在完善中，请关注后续通知与报名安排。'
      return content.length > 86 ? `${content.slice(0, 86)}...` : content
    }
  }
}
</script>

<style lang="scss" scoped>
.competition-home {
  min-height: 100vh;
  margin-top: -76px;
  background: #fafaf9;
  color: #1a1a1a;
  font-family: "Notion Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.hero-dashboard {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding: 132px 32px 72px;
  background: #070f24;
}

.hero-content,
.hero-workspace {
  position: relative;
  z-index: 4;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-content {
  display: grid;
  justify-items: center;
  text-align: center;
  color: #ffffff;
}

.hero-kicker,
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
}

.hero-kicker {
  color: #d6b6f6;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1aae39;
  box-shadow: 0 0 0 7px rgba(26, 174, 57, 0.16);
}

.hero-title-en {
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-content h1 {
  max-width: 1280px;
  margin: 14px auto 12px;
  font-size: 56px;
  line-height: 1.16;
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
  text-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
}

.hero-subtitle-en {
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0;
}

.hero-content p {
  max-width: 760px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.76);
  font-size: 18px;
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.primary-action,
.secondary-action,
.ghost-link,
.resource-card button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.primary-action {
  background: #5645d4;
  color: #ffffff;
  box-shadow: rgba(86, 69, 212, 0.35) 0 14px 34px;
}

.secondary-action {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.primary-action:hover,
.secondary-action:hover,
.ghost-link:hover,
.resource-card button:hover {
  transform: translateY(-2px);
}

.hero-workspace {
  width: min(1040px, 100%);
  margin-top: 52px;
  padding: 0 22px 22px;
  border: 1px solid #e5e3df;
  border-radius: 12px;
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: rgba(15, 15, 15, 0.2) 0 24px 48px -8px;
}

.mockup-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  margin: 0 -22px 20px;
  padding: 0 18px;
  border-bottom: 1px solid #ede9e4;
  color: #5d5b54;
  font-size: 13px;
}

.mockup-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #bbb8b1;
}

.mockup-bar span:nth-child(1) { background: #ff64c8; }
.mockup-bar span:nth-child(2) { background: #f5d75e; }
.mockup-bar span:nth-child(3) { background: #2a9d99; }
.mockup-bar strong {
  margin-left: 8px;
  font-weight: 600;
}

.overview-header,
.section-heading,
.card-topline,
.card-meta,
.card-progress,
.process-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-header {
  margin-bottom: 18px;
}

.overview-header span {
  display: block;
  color: #787671;
  font-size: 13px;
  margin-bottom: 4px;
}

.overview-header strong {
  font-size: 18px;
  font-weight: 600;
}

.overview-header i {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: #e6e0f5;
  color: #391c57;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  min-height: 104px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e3df;
  background: #f6f5f4;
}

.stat-card:nth-child(1) { background: #e6e0f5; }
.stat-card:nth-child(2) { background: #d9f3e1; }
.stat-card:nth-child(3) { background: #dcecfa; }
.stat-card:nth-child(4) { background: #fef7d6; }

.stat-card span,
.stat-card small {
  color: #5d5b54;
}

.stat-card strong {
  display: block;
  margin: 10px 0 6px;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 600;
}

.process-card {
  margin-top: 14px;
  padding: 18px;
  border-radius: 12px;
  background: #fafaf9;
  border: 1px solid #e5e3df;
}

.process-title {
  margin-bottom: 18px;
  font-weight: 600;
}

.process-track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.process-step {
  text-align: center;
  color: #787671;
}

.process-step span {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin: 0 auto 8px;
  border-radius: 999px;
  background: #f0eeec;
  font-weight: 600;
}

.process-step p {
  font-size: 12px;
  margin: 0;
}

.process-step.done {
  color: #1a1a1a;
}

.process-step.done span {
  background: #5645d4;
  color: #fff;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.65fr);
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 32px 72px;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.feature-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  min-height: 100px;
  padding: 16px;
  border: 1px solid #e5e3df;
  border-radius: 12px;
  color: #37352f;
  cursor: pointer;
  text-align: left;
  box-shadow: none;
}

.feature-card:nth-child(1) { background: #ffe8d4; }
.feature-card:nth-child(2) { background: #dcecfa; }
.feature-card:nth-child(3) { background: #d9f3e1; }
.feature-card:nth-child(4) { background: #e6e0f5; }

.feature-card strong,
.feature-card small {
  display: block;
}

.feature-card strong {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 5px;
}

.feature-card small {
  color: #5d5b54;
  line-height: 1.45;
}

.feature-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.66);
}

.feature-icon.orange { color: #dd5b00; }
.feature-icon.blue { color: #0075de; }
.feature-icon.green { color: #1aae39; }
.feature-icon.violet { color: #5645d4; }

.competition-board,
.timeline-card,
.resource-card,
.notice-card {
  border-radius: 12px;
  border: 1px solid #e5e3df;
  box-shadow: none;
}

.competition-board {
  padding: 24px;
  background: #ffffff;
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 4px 0 0;
  font-size: 28px;
  line-height: 1.25;
  font-weight: 600;
  color: #1a1a1a;
}

.section-heading.compact h2 {
  font-size: 22px;
}

.eyebrow {
  color: #5645d4;
}

.ghost-link {
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #c8c4be;
}

.rotating {
  animation: rotate 0.8s linear infinite;
}

.competition-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.competition-card {
  display: flex;
  min-height: 270px;
  flex-direction: column;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #e5e3df;
  background: #ffffff;
  cursor: pointer;
  box-shadow: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.competition-card:hover {
  transform: translateY(-3px);
  box-shadow: rgba(15, 15, 15, 0.08) 0 4px 12px;
}

.competition-card h3 {
  margin: 18px 0 10px;
  font-size: 19px;
  line-height: 1.35;
  font-weight: 600;
}

.competition-card p {
  margin: 0;
  color: #5d5b54;
  line-height: 1.6;
  font-size: 14px;
}

.card-topline {
  color: #787671;
  font-size: 12px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #5645d4;
  color: #fff;
  font-weight: 600;
}

.card-meta {
  gap: 10px;
  margin-top: auto;
  padding-top: 18px;
  color: #5d5b54;
  font-size: 13px;
}

.card-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.card-progress {
  gap: 12px;
  margin-top: 16px;
  color: #5d5b54;
  font-size: 13px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #f0eeec;
}

.progress-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #5645d4, #ff64c8);
}

.timeline-card,
.notice-card {
  padding: 22px;
  background: #ffffff;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 14px;
}

.timeline-item time {
  display: grid;
  place-items: center;
  height: 34px;
  border-radius: 8px;
  background: #0a1530;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.timeline-item strong {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.timeline-item p {
  margin: 0;
  color: #5d5b54;
  font-size: 13px;
  line-height: 1.6;
}

.resource-card {
  padding: 22px;
  background: #f9e79f;
  color: #37352f;
}

.resource-card p {
  margin: 18px 0;
  color: #523410;
  line-height: 1.7;
}

.resource-card button {
  width: 100%;
  background: #000000;
  color: #ffffff;
}

.resource-visual {
  min-height: 118px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.resource-visual span {
  color: #793400;
  font-weight: 600;
  margin-bottom: 8px;
}

.resource-visual strong {
  font-size: 28px;
  font-weight: 600;
}

.task-row {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  padding: 0 4px;
  border: 0;
  border-bottom: 1px solid #ede9e4;
  background: transparent;
  color: #1a1a1a;
  cursor: pointer;
  text-align: left;
}

.task-row i {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #e6e0f5;
  color: #5645d4;
}

.task-row span {
  font-weight: 600;
}

.task-row small {
  color: #787671;
}

.empty-state {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  min-height: 220px;
  color: #5d5b54;
  text-align: center;
}

.empty-state i {
  margin-bottom: 12px;
  font-size: 30px;
  color: #5645d4;
}

.empty-state span {
  color: #1a1a1a;
  font-weight: 600;
}

.empty-state small {
  margin-top: 6px;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* Capsule visual system adaptation */
.competition-home {
  --capsule-cream: #F5F5F0;
  --capsule-ink: #1A1A1A;
  --capsule-outline: #1E1E1E;
  --capsule-coral: #D8A39A;
  --capsule-lime: #DDE8A5;
  --capsule-lavender: #D6CDE8;
  --capsule-sky: #BFD1EA;
  --capsule-violet: #B8ADD8;
  --capsule-yellow: #F3E2A7;
  --capsule-peach: #E8C7AE;
  --capsule-mint: #C9E6D8;
  --capsule-shadow: rgba(26, 26, 26, 0.08);
  background:
    radial-gradient(ellipse at 12% 18%, rgba(216, 163, 154, 0.11), transparent 34%),
    radial-gradient(ellipse at 82% 8%, rgba(139, 180, 247, 0.16), transparent 32%),
    var(--capsule-cream);
  color: var(--capsule-ink);
  font-family: "Space Grotesk", "Microsoft YaHei", system-ui, sans-serif;
}

.capsule-hero {
  min-height: 100vh;
  padding: 128px 32px 64px;
  background:
    radial-gradient(ellipse at 10% 75%, rgba(196, 217, 78, 0.18), transparent 42%),
    radial-gradient(ellipse at 88% 18%, rgba(160, 108, 232, 0.14), transparent 38%),
    radial-gradient(ellipse at 50% 50%, rgba(245, 184, 149, 0.12), transparent 55%),
    var(--capsule-cream);
  color: var(--capsule-ink);
}

.capsule-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

.capsule-deco-pills {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.capsule-pill {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  min-height: 40px;
  padding: 0 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  color: var(--capsule-ink);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 6px 6px 0 var(--capsule-shadow);
  animation: capsuleFloat 7s ease-in-out infinite;
}

.pill-coral {
  top: 17%;
  left: 7%;
  background: var(--capsule-peach);
  transform: rotate(-12deg);
}

.pill-lavender {
  top: 16%;
  right: 10%;
  min-width: 126px;
  background: var(--capsule-lavender);
  transform: rotate(8deg);
  animation-delay: -1.2s;
}

.pill-sky {
  top: 52%;
  left: 3%;
  background: var(--capsule-sky);
  transform: rotate(15deg);
  animation-delay: -2s;
}

.pill-lime {
  bottom: 22%;
  right: 8%;
  background: var(--capsule-lime);
  transform: rotate(-9deg);
  animation-delay: -3s;
}

.pill-yellow {
  top: 28%;
  left: 45%;
  width: 76px;
  height: 76px;
  min-width: 76px;
  border-radius: 50%;
  background: var(--capsule-yellow);
  animation-delay: -4s;
}

.pill-peach {
  bottom: 12%;
  left: 14%;
  background: var(--capsule-peach);
  transform: rotate(11deg);
  animation-delay: -5s;
}

.capsule-hero .hero-content,
.capsule-hero .hero-workspace {
  z-index: 4;
}

.capsule-hero .hero-content {
  color: var(--capsule-ink);
}

.capsule-hero .hero-kicker {
  min-height: 42px;
  padding: 0 22px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  box-shadow: 6px 6px 0 var(--capsule-shadow);
  backdrop-filter: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.capsule-hero .pulse-dot {
  width: 10px;
  height: 10px;
  border: 2px solid var(--capsule-outline);
  background: var(--capsule-lime);
  box-shadow: none;
}

.capsule-hero .hero-title-en {
  margin-top: 24px;
  color: rgba(26, 26, 26, 0.58);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.capsule-hero .hero-content h1 {
  max-width: 1140px;
  margin: 14px auto 16px;
  color: var(--capsule-ink);
  font-family: "Bodoni Moda", Georgia, serif;
  font-size: 64px;
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: 0;
  text-shadow: none;
}

.capsule-hero .hero-subtitle-en {
  color: rgba(26, 26, 26, 0.64);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.capsule-hero .hero-content p {
  max-width: 760px;
  color: #4a4a4a;
  font-size: 17px;
  line-height: 1.75;
}

.capsule-hero .primary-action,
.capsule-hero .secondary-action,
.ghost-link,
.resource-card button {
  min-height: 48px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  color: var(--capsule-ink);
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 6px 6px 0 var(--capsule-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.capsule-hero .primary-action {
  background: var(--capsule-sky);
}

.capsule-hero .secondary-action {
  background: #fff;
}

.capsule-hero .primary-action:hover,
.capsule-hero .secondary-action:hover,
.ghost-link:hover,
.resource-card button:hover,
.feature-card:hover,
.competition-card:hover,
.task-row:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.capsule-hero .hero-workspace {
  width: min(1080px, 100%);
  margin-top: 42px;
  padding: 0 24px 24px;
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 12px 12px 0 var(--capsule-shadow);
}

.capsule-hero .mockup-bar {
  height: 54px;
  margin: 0 -24px 22px;
  padding: 0 22px;
  border-bottom: 2px solid var(--capsule-outline);
  color: var(--capsule-ink);
}

.capsule-hero .mockup-bar span {
  border: 2px solid var(--capsule-outline);
}

.overview-header i,
.feature-icon,
.task-row i,
.timeline-item time,
.process-step span {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
}

.overview-header i {
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
}

.stat-card,
.feature-card,
.competition-board,
.competition-card,
.timeline-card,
.resource-card,
.notice-card,
.process-card {
  border: 2px solid var(--capsule-outline);
  border-radius: 28px;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.stat-card {
  background: #fff;
}

.stat-card:nth-child(1) { background: var(--capsule-lavender); }
.stat-card:nth-child(2) { background: var(--capsule-mint); }
.stat-card:nth-child(3) { background: var(--capsule-sky); }
.stat-card:nth-child(4) { background: var(--capsule-yellow); }

.stat-card strong,
.section-heading h2,
.competition-card h3,
.resource-visual strong {
  font-family: "Bodoni Moda", Georgia, serif;
  font-weight: 800;
  letter-spacing: 0;
}

.process-card {
  background: #fff;
}

.process-step.done span {
  background: var(--capsule-violet);
  color: #fff;
}

.workspace-grid {
  max-width: 1320px;
  padding-top: 72px;
}

.feature-card {
  border-radius: 9999px;
  background: #fff;
}

.feature-card:nth-child(1) { background: var(--capsule-peach); }
.feature-card:nth-child(2) { background: var(--capsule-sky); }
.feature-card:nth-child(3) { background: var(--capsule-mint); }
.feature-card:nth-child(4) { background: var(--capsule-lavender); }

.feature-icon {
  background: #fff;
  color: var(--capsule-ink) !important;
}

.competition-board,
.timeline-card,
.notice-card {
  background: #fff;
}

.eyebrow {
  color: #5f7890;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ghost-link {
  background: var(--capsule-yellow);
}

.competition-card {
  background: #fff;
}

.competition-card:nth-child(3n + 1) {
  background: #fff;
}

.competition-card:nth-child(3n + 2) {
  background: #fffdf2;
}

.competition-card:nth-child(3n + 3) {
  background: #f8fbff;
}

.status-tag {
  border: 2px solid var(--capsule-outline);
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.progress-bar {
  height: 14px;
  border: 2px solid var(--capsule-outline);
  background: var(--capsule-cream);
}

.progress-bar i {
  background: #8faac0;
}

.timeline-item time {
  background: var(--capsule-ink);
  color: #fff;
}

.resource-card {
  background: var(--capsule-yellow);
}

.resource-card button {
  background: #fff;
}

.task-row {
  min-height: 60px;
  border-bottom: 2px solid var(--capsule-outline);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.task-row:last-child {
  border-bottom: 0;
}

.task-row i {
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
}

@keyframes capsuleFloat {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -12px;
  }
}

@media (max-width: 1279px) {
  .hero-content h1 {
    font-size: 48px;
  }

  .capsule-hero .hero-content h1 {
    font-size: 54px;
    white-space: normal;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .feature-strip,
  .competition-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .competition-home {
    margin-top: -76px;
  }

  .hero-dashboard {
    padding: 116px 16px 48px;
  }

  .hero-content h1 {
    font-size: 36px;
    white-space: normal;
  }

  .capsule-hero {
    padding: 112px 16px 44px;
  }

  .capsule-deco-pills {
    opacity: 0.45;
  }

  .capsule-hero .hero-content h1 {
    font-size: 40px;
    line-height: 1.05;
  }

  .hero-content p {
    font-size: 16px;
  }

  .hero-subtitle-en {
    font-size: 14px;
  }

  .hero-actions {
    width: 100%;
  }

  .primary-action,
  .secondary-action {
    flex: 1 1 180px;
  }

  .hero-workspace {
    padding: 0 14px 14px;
  }

  .mockup-bar {
    margin: 0 -14px 14px;
  }

  .workspace-grid {
    padding: 48px 16px 56px;
  }

  .stat-grid,
  .feature-strip,
  .competition-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    border-radius: 28px;
  }

  .process-track {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 14px;
  }

  .card-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
