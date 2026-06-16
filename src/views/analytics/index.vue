<template>
  <div class="analytics-page">
    <section class="analytics-hero glass-panel">
      <div>
        <span class="eyebrow">Analytics</span>
        <h1>竞赛数据分析驾驶舱</h1>
        <p>面向管理员汇总赛事、团队、项目和资源数据，用稳定的可视化看板支撑演示与后续运营分析。</p>
      </div>
      <button class="refresh-btn" @click="refreshDashboard" :disabled="loading">
        <i class="fas fa-sync-alt" :class="{ rotating: loading }"></i>
        刷新数据
      </button>
    </section>

    <section class="stat-grid">
      <article
        v-for="item in statCards"
        :key="item.label"
        class="stat-card glass-panel"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.hint }}</small>
      </article>
    </section>

    <section class="chart-grid">
      <article class="chart-card glass-panel">
        <div class="chart-heading">
          <div>
            <span class="eyebrow">Distribution</span>
            <h2>赛事类型分布</h2>
          </div>
        </div>
        <div ref="typeChart" class="chart-box"></div>
      </article>

      <article class="chart-card wide glass-panel">
        <div class="chart-heading">
          <div>
            <span class="eyebrow">Trend</span>
            <h2>月度报名趋势</h2>
          </div>
        </div>
        <div ref="trendChart" class="chart-box"></div>
      </article>

      <article class="chart-card wide glass-panel">
        <div class="chart-heading">
          <div>
            <span class="eyebrow">Resources</span>
            <h2>热门资源下载排行</h2>
          </div>
        </div>
        <div ref="resourceChart" class="chart-box"></div>
      </article>

      <article class="insight-card glass-panel">
        <span class="eyebrow">Insights</span>
        <h2>运营观察</h2>
        <div class="insight-list">
          <div v-for="item in insights" :key="item.title" class="insight-row">
            <i :class="item.icon"></i>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getResponseData } from '@/utils/competition'

const PALETTE = ['#BFD1EA', '#C9E6D8', '#D6CDE8', '#F3E2A7', '#D8A39A']

const FALLBACK_DATA = {
  stats: {
    activeCompetitionCount: 12,
    teamCount: 128,
    projectCount: 86,
    resourceCount: 36
  },
  typeDistribution: [
    { name: '创新创业类', value: 34 },
    { name: '程序设计类', value: 22 },
    { name: '数学建模类', value: 18 },
    { name: '学科竞赛类', value: 16 },
    { name: '科研训练类', value: 10 }
  ],
  monthlyTrend: [
    { month: '1月', value: 12 },
    { month: '2月', value: 18 },
    { month: '3月', value: 36 },
    { month: '4月', value: 52 },
    { month: '5月', value: 78 },
    { month: '6月', value: 96 }
  ],
  resourceRanking: [
    { name: '项目计划书模板', value: 86 },
    { name: '校级评审评分标准', value: 74 },
    { name: '答辩课件', value: 63 },
    { name: '往届优秀案例', value: 58 },
    { name: '报名指南', value: 42 }
  ]
}

export default {
  name: 'AnalyticsDashboard',
  data() {
    return {
      loading: false,
      dashboard: { ...FALLBACK_DATA.stats },
      typeDistribution: [...FALLBACK_DATA.typeDistribution],
      monthlyTrend: [...FALLBACK_DATA.monthlyTrend],
      resourceRanking: [...FALLBACK_DATA.resourceRanking],
      charts: []
    }
  },
  computed: {
    statCards() {
      return [
        { label: '开放赛事', value: this.dashboard.activeCompetitionCount ?? 12, hint: '当前可报名' },
        { label: '参赛团队', value: this.dashboard.teamCount ?? 128, hint: '累计组队' },
        { label: '参赛项目', value: this.dashboard.projectCount ?? 86, hint: '项目沉淀' },
        { label: '备赛资源', value: this.dashboard.resourceCount ?? 36, hint: '模板/课件/案例' }
      ]
    },
    insights() {
      return [
        {
          icon: 'fas fa-layer-group',
          title: '创新创业类占比最高',
          text: '建议优先补齐计划书模板、商业模式说明和答辩材料。'
        },
        {
          icon: 'fas fa-chart-line',
          title: '报名趋势持续走高',
          text: '5-6 月报名增长明显，适合集中推送审核和提交提醒。'
        },
        {
          icon: 'fas fa-book-open',
          title: '模板资源下载活跃',
          text: '热门资源可沉淀为首页推荐和教师指导标准材料。'
        }
      ]
    }
  },
  mounted() {
    this.refreshDashboard()
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    this.charts.forEach(chart => chart && chart.dispose())
  },
  methods: {
    async refreshDashboard() {
      this.loading = true
      try {
        await Promise.all([
          this.fetchDashboardStats(),
          this.fetchResourceRanking()
        ])
      } finally {
        this.loading = false
        this.$nextTick(this.renderCharts)
      }
    },
    async fetchDashboardStats() {
      try {
        const res = await this.$http.get('/competition/overview/dashboard')
        this.dashboard = {
          ...FALLBACK_DATA.stats,
          ...getResponseData(res, {})
        }
      } catch (err) {
        this.dashboard = { ...FALLBACK_DATA.stats }
      }
    },
    async fetchResourceRanking() {
      try {
        const res = await this.$http.get('/competition/resource/list/active')
        const resources = getResponseData(res, [])
        if (!Array.isArray(resources) || !resources.length) return
        this.resourceRanking = resources
          .map(item => ({
            name: item.resourceName || item.name || '备赛资源',
            value: Number(item.downloadCount || item.downloads || 0)
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      } catch (err) {
        this.resourceRanking = [...FALLBACK_DATA.resourceRanking]
      }
    },
    renderCharts() {
      this.charts.forEach(chart => chart && chart.dispose())
      this.charts = [
        this.renderTypeChart(),
        this.renderTrendChart(),
        this.renderResourceChart()
      ].filter(Boolean)
    },
    renderTypeChart() {
      if (!this.$refs.typeChart) return null
      const chart = echarts.init(this.$refs.typeChart)
      chart.setOption({
        color: PALETTE,
        tooltip: { trigger: 'item' },
        legend: {
          bottom: 0,
          icon: 'circle',
          textStyle: { color: '#60636a' }
        },
        series: [{
          name: '赛事类型',
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '44%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: 'rgba(255,255,255,0.86)',
            borderWidth: 4,
            borderRadius: 10
          },
          label: {
            color: '#272a31',
            fontWeight: 700,
            formatter: '{b}\n{d}%'
          },
          data: this.typeDistribution
        }]
      })
      return chart
    },
    renderTrendChart() {
      if (!this.$refs.trendChart) return null
      const chart = echarts.init(this.$refs.trendChart)
      chart.setOption({
        color: ['#6F8FA8'],
        tooltip: { trigger: 'axis' },
        grid: { top: 32, right: 24, bottom: 34, left: 44 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.monthlyTrend.map(item => item.month),
          axisLine: { lineStyle: { color: '#cfd5dc' } },
          axisLabel: { color: '#60636a' }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#60636a' },
          splitLine: { lineStyle: { color: 'rgba(120, 126, 138, 0.14)' } }
        },
        series: [{
          name: '报名团队',
          type: 'line',
          smooth: true,
          symbolSize: 10,
          lineStyle: { width: 4 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(111, 143, 168, 0.24)' },
              { offset: 1, color: 'rgba(111, 143, 168, 0.02)' }
            ])
          },
          data: this.monthlyTrend.map(item => item.value)
        }]
      })
      return chart
    },
    renderResourceChart() {
      if (!this.$refs.resourceChart) return null
      const chart = echarts.init(this.$refs.resourceChart)
      chart.setOption({
        color: ['#C9E6D8'],
        tooltip: { trigger: 'axis' },
        grid: { top: 28, right: 24, bottom: 44, left: 54 },
        xAxis: {
          type: 'category',
          data: this.resourceRanking.map(item => item.name),
          axisLine: { lineStyle: { color: '#cfd5dc' } },
          axisLabel: {
            color: '#60636a',
            interval: 0,
            width: 80,
            overflow: 'break'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#60636a' },
          splitLine: { lineStyle: { color: 'rgba(120, 126, 138, 0.14)' } }
        },
        series: [{
          name: '下载量',
          type: 'bar',
          barWidth: 34,
          itemStyle: {
            borderRadius: [12, 12, 4, 4],
            color: params => PALETTE[params.dataIndex % PALETTE.length]
          },
          data: this.resourceRanking.map(item => item.value)
        }]
      })
      return chart
    },
    resizeCharts() {
      this.charts.forEach(chart => chart && chart.resize())
    }
  }
}
</script>

<style scoped>
.analytics-page {
  min-height: calc(100vh - 76px);
  padding: 104px 32px 72px;
  background:
    radial-gradient(ellipse at 16% 12%, rgba(191, 209, 234, 0.28), transparent 34%),
    radial-gradient(ellipse at 86% 18%, rgba(214, 205, 232, 0.24), transparent 34%),
    linear-gradient(135deg, #f4f3ed 0%, #eef2f4 50%, #f7f4ed 100%);
  color: #20232a;
  font-family: var(--font-body);
}

.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 24px 70px rgba(73, 82, 93, 0.12);
  backdrop-filter: blur(22px) saturate(135%);
}

.analytics-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  max-width: 1320px;
  margin: 0 auto 22px;
  padding: 34px;
}

.eyebrow {
  display: inline-flex;
  width: max-content;
  margin-bottom: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(191, 209, 234, 0.72);
  color: #35495d;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.analytics-hero h1,
.chart-heading h2,
.insight-card h2 {
  margin: 0;
  color: #20232a;
  font-family: var(--font-body);
  font-weight: 800;
  letter-spacing: 0;
}

.analytics-hero h1 {
  font-size: 44px;
  line-height: 1.12;
}

.analytics-hero p,
.insight-row p,
.stat-card span,
.stat-card small {
  color: #646974;
  line-height: 1.65;
}

.analytics-hero p {
  max-width: 720px;
  margin: 12px 0 0;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: #20232a;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}

.refresh-btn:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

.stat-grid,
.chart-grid {
  display: grid;
  max-width: 1320px;
  margin: 0 auto;
  gap: 18px;
}

.stat-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 18px;
}

.stat-card {
  min-height: 138px;
  padding: 24px;
}

.stat-card:nth-child(1) { background: rgba(191, 209, 234, 0.74); }
.stat-card:nth-child(2) { background: rgba(201, 230, 216, 0.74); }
.stat-card:nth-child(3) { background: rgba(214, 205, 232, 0.74); }
.stat-card:nth-child(4) { background: rgba(243, 226, 167, 0.72); }

.stat-card strong {
  display: block;
  margin: 8px 0 6px;
  font-size: 38px;
  line-height: 1;
}

.chart-grid {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.35fr);
}

.chart-card,
.insight-card {
  min-height: 360px;
  padding: 24px;
}

.chart-card.wide {
  min-width: 0;
}

.chart-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.chart-heading h2,
.insight-card h2 {
  font-size: 24px;
}

.chart-box {
  width: 100%;
  height: 290px;
}

.insight-card {
  background: rgba(255, 255, 255, 0.74);
}

.insight-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.insight-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border-radius: 20px;
  background: rgba(244, 243, 237, 0.74);
}

.insight-row i {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #d6cde8;
  color: #20232a;
}

.insight-row strong {
  color: #20232a;
}

.insight-row p {
  margin: 4px 0 0;
  font-size: 13px;
}

.rotating {
  animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media (max-width: 1180px) {
  .stat-grid,
  .chart-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .analytics-page {
    padding: 94px 16px 48px;
  }

  .analytics-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 26px;
  }

  .analytics-hero h1 {
    font-size: 34px;
  }

  .stat-grid,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .chart-card,
  .insight-card {
    min-height: 320px;
  }
}
</style>
