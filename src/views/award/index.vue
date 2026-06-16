<template>
  <div class="award-page">
    <section class="award-hero">
      <div>
        <span class="eyebrow">Award Gallery</span>
        <h1>获奖公示</h1>
        <p>集中展示赛事评审结果、获奖团队、指导老师和项目成果，便于学生复盘、教师追踪和管理员归档。</p>
      </div>
      <div class="hero-stats">
        <div
          v-for="stat in awardStats"
          :key="stat.label"
          class="stat-card"
        >
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <section class="award-toolbar">
      <div class="filter-group">
        <button
          v-for="level in filterLevels"
          :key="level"
          class="filter-btn"
          :class="{ active: activeLevel === level }"
          @click="activeLevel = level"
        >
          {{ level }}
        </button>
      </div>
      <button class="refresh-btn" @click="getAwardList">
        <i class="fas fa-sync-alt" :class="{ rotating: loading }"></i>
        刷新
      </button>
    </section>

    <section class="award-list" v-loading="loading">
      <article
        v-for="award in filteredAwards"
        :key="award.reviewId || `${award.projectName}-${award.awardLevel}`"
        class="award-card"
      >
        <div class="card-main">
          <span class="award-badge" :class="getAwardClass(award.awardLevel)">
            {{ award.awardLevel || '入围' }}
          </span>
          <h3>{{ award.projectName || '未命名项目' }}</h3>
          <p>{{ award.reviewComment || '暂无评审意见，后续可在评审归档中补充项目亮点和改进方向。' }}</p>
        </div>

        <div class="card-grid">
          <span>
            <i class="fas fa-trophy"></i>
            {{ award.competitionName || '未绑定赛事' }}
          </span>
          <span>
            <i class="fas fa-users"></i>
            {{ award.teamName || '未绑定团队' }}
          </span>
          <span>
            <i class="fas fa-user-tie"></i>
            {{ award.guideTeacherName || '暂无指导老师' }}
          </span>
          <span>
            <i class="fas fa-star"></i>
            {{ award.score || 0 }} 分
          </span>
        </div>

        <div class="card-footer">
          <span>公示时间：{{ formatDate(award.createTime) || '待同步' }}</span>
        </div>
      </article>

      <div v-if="filteredAwards.length === 0 && !loading" class="empty-tip">
        <i class="fas fa-medal"></i>
        <strong>暂无获奖公示</strong>
        <span>评审完成后，获奖项目会自动汇总到这里。</span>
      </div>
    </section>
  </div>
</template>

<script>
import { formatDateTime, getResponseData } from '@/utils/competition'

export default {
  name: 'AwardPage',
  data() {
    return {
      awardList: [],
      activeLevel: '全部',
      loading: false
    }
  },
  computed: {
    filterLevels() {
      return ['全部', '一等奖', '二等奖', '三等奖']
    },
    filteredAwards() {
      if (this.activeLevel === '全部') return this.awardList
      return this.awardList.filter(item => item.awardLevel === this.activeLevel)
    },
    awardStats() {
      const countByLevel = level => this.awardList.filter(item => item.awardLevel === level).length
      return [
        { label: '公示项目', value: this.awardList.length },
        { label: '一等奖', value: countByLevel('一等奖') },
        { label: '二等奖', value: countByLevel('二等奖') },
        { label: '三等奖', value: countByLevel('三等奖') }
      ]
    }
  },
  created() {
    this.getAwardList()
  },
  methods: {
    async getAwardList() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/overview/awards')
        this.awardList = getResponseData(res, [])
      } catch (err) {
        this.$message.warning('获奖看板接口暂不可用')
        this.awardList = []
      } finally {
        this.loading = false
      }
    },
    formatDate(value) {
      return formatDateTime(value)
    },
    getAwardClass(level) {
      const levelMap = {
        '一等奖': 'first',
        '二等奖': 'second',
        '三等奖': 'third'
      }
      return levelMap[level] || 'default'
    }
  }
}
</script>

<style scoped>
.award-page {
  max-width: 1208px;
  margin: 0 auto;
  padding: 32px 24px 72px;
  color: #1a1a1a;
  font-family: "Notion Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}

.award-hero,
.award-toolbar,
.award-card,
.empty-tip {
  border: 1px solid #e5e3df;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 50px rgba(10, 21, 48, 0.06);
}

.award-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: end;
  padding: 38px 32px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(230, 224, 245, 0.9), rgba(254, 247, 214, 0.88)),
    #ffffff;
}

.eyebrow {
  display: inline-flex;
  color: #5645d4;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 14px;
}

.award-hero h1 {
  margin: 0;
  color: #0a1530;
  font-size: 40px;
  line-height: 1.18;
  letter-spacing: 0;
}

.award-hero p {
  max-width: 690px;
  margin: 16px 0 0;
  color: #5d5b54;
  font-size: 16px;
  line-height: 1.65;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 132px);
  gap: 12px;
}

.stat-card {
  min-height: 92px;
  padding: 18px;
  border-radius: 8px;
  background: #0a1530;
  color: #ffffff;
}

.stat-card strong {
  display: block;
  font-size: 30px;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-card span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.award-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin: 22px 0;
  padding: 16px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn,
.refresh-btn {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.filter-btn {
  background: #f6f5f4;
  color: #5d5b54;
}

.filter-btn.active {
  background: #5645d4;
  color: #ffffff;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0a1530;
  color: #ffffff;
}

.filter-btn:hover,
.refresh-btn:hover {
  transform: translateY(-1px);
}

.award-list {
  display: grid;
  gap: 16px;
  min-height: 220px;
}

.award-card {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
  gap: 26px;
  padding: 24px;
}

.card-main h3 {
  margin: 14px 0 10px;
  color: #0a1530;
  font-size: 22px;
  line-height: 1.3;
  letter-spacing: 0;
}

.card-main p {
  margin: 0;
  color: #5d5b54;
  font-size: 14px;
  line-height: 1.7;
}

.award-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 12px;
  border-radius: 999px;
  color: #0a1530;
  font-size: 13px;
  font-weight: 700;
}

.award-badge.first {
  background: #f9e79f;
}

.award-badge.second {
  background: #dcecfa;
}

.award-badge.third {
  background: #ffe8d4;
}

.award-badge.default {
  background: #e6e0f5;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
  color: #5d5b54;
  font-size: 14px;
}

.card-grid span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
}

.card-grid i {
  color: #5645d4;
}

.card-footer {
  grid-column: 1 / -1;
  padding-top: 16px;
  border-top: 1px solid #ede9e4;
  color: #787671;
  font-size: 13px;
}

.empty-tip {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 56px 24px;
  color: #787671;
  text-align: center;
}

.empty-tip i {
  color: #5645d4;
  font-size: 34px;
}

.empty-tip strong {
  color: #0a1530;
  font-size: 18px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .award-page {
    padding: 20px 14px 48px;
  }

  .award-hero,
  .award-card {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .award-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .refresh-btn {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .award-hero {
    padding: 28px 20px;
  }

  .award-hero h1 {
    font-size: 32px;
  }

  .card-grid,
  .hero-stats {
    grid-template-columns: 1fr;
  }
}

/* Capsule visual pass */
.award-page {
  max-width: 1320px;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}

.award-hero,
.award-toolbar,
.award-card,
.empty-tip {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.award-hero {
  position: relative;
  overflow: hidden;
  padding: 38px 36px;
  background:
    radial-gradient(ellipse at 86% 20%, rgba(232, 93, 78, 0.18), transparent 42%),
    radial-gradient(ellipse at 12% 86%, rgba(242, 209, 96, 0.28), transparent 44%),
    #fff;
}

.award-hero::after {
  content: 'AWARD';
  position: absolute;
  right: 28px;
  bottom: 24px;
  padding: 12px 28px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(8deg);
}

.eyebrow {
  display: inline-flex;
  padding: 9px 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.award-hero h1,
.stat-card strong,
.card-main h3,
.empty-tip strong {
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.award-hero h1 {
  font-size: 44px;
  line-height: 1.05;
}

.award-hero p,
.card-main p,
.card-grid,
.card-footer,
.empty-tip {
  color: #4a4a4a;
}

.stat-card {
  border: 2px solid var(--capsule-outline);
  border-radius: 28px;
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
}

.stat-card:nth-child(2) { background: var(--capsule-yellow); }
.stat-card:nth-child(3) { background: var(--capsule-sky); }
.stat-card:nth-child(4) { background: var(--capsule-mint); }

.stat-card span {
  color: #4a4a4a;
}

.filter-btn,
.refresh-btn,
.award-badge {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  color: var(--capsule-ink);
  font-weight: 800;
}

.filter-btn {
  background: #fff;
}

.filter-btn.active,
.refresh-btn {
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.award-card {
  background: #fff;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.award-card:nth-child(2n + 1) {
  background: #fffdf2;
}

.award-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 var(--capsule-shadow);
}

.award-badge,
.award-badge.first,
.award-badge.second,
.award-badge.third,
.award-badge.default {
  background: var(--capsule-lime);
}

.award-badge.first { background: var(--capsule-yellow); }
.award-badge.second { background: var(--capsule-sky); }
.award-badge.third { background: var(--capsule-peach); }
.award-badge.default { background: var(--capsule-lavender); }

.card-grid span {
  min-height: 32px;
  padding: 6px 10px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: #fff;
}

.card-grid i,
.empty-tip i {
  color: var(--capsule-coral);
}

.card-footer {
  border-top: 2px solid var(--capsule-outline);
}

@media (max-width: 900px) {
  .award-page {
    padding: 94px 16px 48px;
  }

  .award-hero::after {
    position: static;
    width: max-content;
    margin-top: 12px;
  }
}

@media (max-width: 560px) {
  .award-hero h1 {
    font-size: 36px;
  }
}
</style>
