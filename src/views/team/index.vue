<template>
  <div class="team-page">
    <section class="page-hero">
      <div>
        <span class="eyebrow">Team Board</span>
        <h1>我的团队</h1>
        <p>展示团队状态、成员规模、关联赛事和项目数量，适合快速说明学生参赛协作流程。</p>
      </div>
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        创建团队
      </button>
    </section>

    <div class="team-list" v-loading="loading">
      <article
        v-for="team in teamList"
        :key="team.teamId"
        class="team-card"
        @click="goToDetail(team.teamId)"
      >
        <div class="card-header">
          <span class="status-tag" :class="getStatusClass(team.status)">{{ team.status || '组建中' }}</span>
          <strong>{{ team.memberCount || 0 }} 人</strong>
        </div>
        <h3>{{ team.teamName }}</h3>
        <p>{{ team.description || '团队介绍暂未填写，可在详情页完善成员分工、项目方向和竞赛计划。' }}</p>
        <div class="card-info">
          <span><i class="fas fa-trophy"></i>{{ team.competitionName || '未绑定赛事' }}</span>
          <span><i class="fas fa-user"></i>队长：{{ team.leaderName || '-' }}</span>
          <span><i class="fas fa-user-tie"></i>指导：{{ team.guideTeacherName || '暂无' }}</span>
          <span><i class="fas fa-project-diagram"></i>项目：{{ team.projectCount || 0 }}</span>
        </div>
      </article>

      <div v-if="teamList.length === 0 && !loading" class="empty-tip">
        <i class="fas fa-users"></i>
        <span>暂无团队</span>
        <small>可以先创建团队，或导入后端演示数据。</small>
      </div>
    </div>

    <div class="modal-mask" v-if="showCreateModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建参赛团队</h3>
          <i class="fas fa-times close-icon" @click="showCreateModal = false"></i>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>团队名称</label>
            <input type="text" v-model="createForm.teamName" placeholder="请输入团队名称">
          </div>
          <div class="form-item">
            <label>参赛赛事</label>
            <select v-model="createForm.competitionId">
              <option value="">请选择参赛赛事</option>
              <option v-for="item in competitionList" :key="item.competitionId" :value="item.competitionId">
                {{ item.title || item.competitionName }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>团队介绍</label>
            <textarea v-model="createForm.description" placeholder="请输入团队介绍"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showCreateModal = false">取消</button>
          <button class="confirm-btn" @click="createTeam">确认创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUserId, getResponseData, isSuccess } from '@/utils/competition'

export default {
  name: 'TeamPage',
  data() {
    return {
      teamList: [],
      competitionList: [],
      loading: false,
      showCreateModal: false,
      createForm: {
        teamName: '',
        competitionId: '',
        description: '',
        leaderId: getCurrentUserId()
      }
    }
  },
  created() {
    this.getTeamList()
    this.getCompetitionList()
    if (this.$route.query.competitionId) {
      this.createForm.competitionId = this.$route.query.competitionId
    }
  },
  methods: {
    async getTeamList() {
      this.loading = true
      try {
        const params = {}
        if (this.$route.query.competitionId) params.competitionId = this.$route.query.competitionId
        const res = await this.$http.get('/competition/overview/teams', { params })
        this.teamList = getResponseData(res, [])
      } catch (err) {
        this.$message.warning('团队看板接口暂不可用')
        this.teamList = []
      } finally {
        this.loading = false
      }
    },
    async getCompetitionList() {
      try {
        const res = await this.$http.get('/competition/competition/list/active')
        this.competitionList = getResponseData(res, [])
      } catch (err) {
        this.competitionList = []
      }
    },
    async createTeam() {
      if (!this.createForm.teamName || !this.createForm.competitionId) {
        this.$message.warning('请填写团队名称并选择赛事')
        return
      }
      try {
        const res = await this.$http.post('/competition/team/create', this.createForm)
        if (isSuccess(res)) {
          this.$message.success('创建成功')
          this.showCreateModal = false
          this.getTeamList()
        } else {
          this.$message.error(res.message || '创建失败')
        }
      } catch (err) {
        this.$message.error('创建团队失败，请检查接口')
      }
    },
    goToDetail(id) {
      this.$router.push(`/team/detail/${id}`)
    },
    getStatusClass(status) {
      return {
        warning: status === '组建中',
        success: status === '已通过',
        locked: status === '已锁定'
      }
    }
  }
}
</script>

<style scoped>
.team-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}
.page-hero,
.team-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 52px rgba(28, 45, 70, 0.08);
}
.page-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  margin-bottom: 22px;
}
.eyebrow {
  color: #0f766e;
  font-size: 13px;
  font-weight: 800;
}
.page-hero h1 {
  margin: 8px 0 10px;
  color: #172033;
  font-size: 38px;
}
.page-hero p {
  max-width: 760px;
  color: #64748b;
  line-height: 1.7;
}
.primary-btn,
.confirm-btn,
.cancel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 800;
}
.primary-btn,
.confirm-btn {
  height: 44px;
  padding: 0 18px;
  background: #1d8cf8;
  color: #fff;
}
.team-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.team-card {
  padding: 22px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.team-card:hover {
  transform: translateY(-4px);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-header strong {
  color: #0f766e;
  font-size: 26px;
}
.status-tag {
  padding: 5px 9px;
  border-radius: 999px;
  background: #eef6f8;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
}
.status-tag.warning { background: #fff7e6; color: #d97706; }
.status-tag.success { background: #e8f7ee; color: #047857; }
.status-tag.locked { background: #eef2ff; color: #4f46e5; }
.team-card h3 {
  margin: 16px 0 10px;
  color: #172033;
  font-size: 22px;
}
.team-card p {
  min-height: 52px;
  color: #64748b;
  line-height: 1.7;
}
.card-info {
  display: grid;
  gap: 10px;
  color: #64748b;
  font-size: 14px;
}
.card-info span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.empty-tip {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 280px;
  color: #64748b;
}
.empty-tip i {
  color: #0f766e;
  font-size: 34px;
}
.empty-tip span {
  color: #172033;
  font-weight: 800;
}
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}
.modal-content {
  width: 520px;
  max-width: calc(100% - 32px);
  border-radius: 8px;
  background: #fff;
}
.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #edf2f7;
}
.modal-footer {
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #edf2f7;
  border-bottom: 0;
}
.close-icon {
  cursor: pointer;
  color: #64748b;
}
.modal-body {
  padding: 20px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.form-item label {
  color: #172033;
  font-weight: 800;
}
.form-item input,
.form-item select,
.form-item textarea {
  border: 1px solid #dbe3ef;
  border-radius: 6px;
  padding: 10px 12px;
}
.form-item textarea {
  min-height: 90px;
  resize: vertical;
}
.cancel-btn {
  height: 38px;
  padding: 0 16px;
  background: #f1f5f9;
  color: #64748b;
}
.confirm-btn {
  height: 38px;
}
@media (max-width: 1100px) {
  .team-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .team-page {
    padding: 18px 14px 36px;
  }
  .page-hero {
    flex-direction: column;
  }
  .team-list {
    grid-template-columns: 1fr;
  }
}

/* Capsule visual pass */
.team-page {
  max-width: 1320px;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}

.page-hero,
.team-card,
.modal-content {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.page-hero {
  position: relative;
  overflow: hidden;
  padding: 38px 36px;
  background:
    radial-gradient(ellipse at 88% 18%, rgba(139, 180, 247, 0.22), transparent 42%),
    radial-gradient(ellipse at 10% 88%, rgba(245, 184, 149, 0.24), transparent 40%),
    #fff;
}

.page-hero::after {
  content: 'TEAM';
  position: absolute;
  right: 28px;
  bottom: 24px;
  padding: 12px 28px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-8deg);
}

.eyebrow {
  display: inline-flex;
  padding: 9px 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.page-hero h1,
.team-card h3,
.card-header strong,
.modal-header h3 {
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.page-hero h1 {
  font-size: 44px;
  line-height: 1.05;
}

.page-hero p,
.team-card p,
.card-info,
.close-icon {
  color: #4a4a4a;
}

.primary-btn,
.confirm-btn,
.cancel-btn,
.status-tag {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-weight: 800;
}

.primary-btn,
.confirm-btn {
  background: var(--capsule-sky);
  color: var(--capsule-ink);
}

.cancel-btn {
  background: #fff;
  color: var(--capsule-ink);
}

.team-card {
  background: #fffdf2;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.team-card:nth-child(3n + 2) {
  background: #f8fbff;
}

.team-card:nth-child(3n + 3) {
  background: #fff;
}

.team-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 var(--capsule-shadow);
}

.card-header strong {
  color: var(--capsule-ink);
}

.status-tag,
.status-tag.warning,
.status-tag.success,
.status-tag.locked {
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.status-tag.success {
  background: var(--capsule-mint);
}

.status-tag.locked {
  background: var(--capsule-sky);
}

.card-info span {
  min-height: 32px;
  padding: 6px 10px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: #fff;
}

.empty-tip {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.empty-tip i {
  color: #6f8fa8;
}

.empty-tip span {
  color: var(--capsule-ink);
}

.modal-mask {
  background: rgba(26, 26, 26, 0.42);
}

.modal-header,
.modal-footer {
  border-color: var(--capsule-outline);
}

.form-item input,
.form-item select,
.form-item textarea {
  border: 2px solid var(--capsule-outline);
  border-radius: 18px;
  background: var(--capsule-cream);
  color: var(--capsule-ink);
}

@media (max-width: 760px) {
  .team-page {
    padding: 94px 16px 48px;
  }

  .page-hero {
    padding: 30px 22px;
  }

  .page-hero::after {
    position: static;
    width: max-content;
    margin-top: 12px;
  }

  .page-hero h1 {
    font-size: 36px;
  }
}
</style>
