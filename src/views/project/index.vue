<template>
  <div class="project-page">
    <section class="page-hero">
      <div>
        <span class="eyebrow">Project Board</span>
        <h1>我的参赛项目</h1>
        <p>集中查看项目进度、提交次数、最新版本和指导老师信息，提供项目从立项到提交的完整过程。</p>
      </div>
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        创建项目
      </button>
    </section>

    <section class="stats-row">
      <div v-for="item in stats" :key="item.label" class="stat-card">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </div>
    </section>

    <div class="project-list" v-loading="loading">
      <article
        v-for="project in projectList"
        :key="project.projectId"
        class="project-card"
      >
        <div class="card-header">
          <div>
            <span class="status-tag">{{ project.status || '进行中' }}</span>
            <h3>{{ project.projectName }}</h3>
          </div>
          <strong>{{ normalizeProgress(project.progress) }}%</strong>
        </div>

        <p>{{ project.description || project.projectDesc || '项目介绍暂未填写，可在后续完善作品摘要、技术路线和成果材料。' }}</p>

        <div class="progress-bar">
          <i :style="{ width: `${normalizeProgress(project.progress)}%` }"></i>
        </div>

        <div class="card-info">
          <span><i class="fas fa-users"></i> {{ project.teamName || '未绑定团队' }}</span>
          <span><i class="fas fa-trophy"></i> {{ project.competitionName || project.competitionTitle || '未绑定赛事' }}</span>
          <span><i class="fas fa-user-tie"></i> {{ project.guideTeacherName || '暂无指导老师' }}</span>
          <span><i class="fas fa-cloud-upload-alt"></i> 提交 {{ project.submissionCount || 0 }} 次</span>
          <span><i class="fas fa-code-branch"></i> {{ project.latestVersion || '暂无版本' }}</span>
        </div>

        <div class="card-footer">
          <button class="default-btn" @click="goToSubmit(project.projectId)">
            <i class="fas fa-upload"></i>
            提交作品
          </button>
        </div>
      </article>

      <div v-if="projectList.length === 0 && !loading" class="empty-tip">
        <i class="fas fa-project-diagram"></i>
        <span>暂无参赛项目</span>
        <small>请先创建团队并绑定赛事，或导入后端演示数据。</small>
      </div>
    </div>

    <div class="modal-mask" v-if="showCreateModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建参赛项目</h3>
          <i class="fas fa-times close-icon" @click="showCreateModal = false"></i>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>项目名称</label>
            <input type="text" v-model="createForm.projectName" placeholder="请输入项目名称">
          </div>
          <div class="form-item">
            <label>所属团队</label>
            <select v-model="createForm.teamId">
              <option value="">请选择所属团队</option>
              <option v-for="item in teamList" :key="item.teamId" :value="item.teamId">
                {{ item.teamName }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>项目介绍</label>
            <textarea v-model="createForm.description" placeholder="请输入项目介绍"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showCreateModal = false">取消</button>
          <button class="confirm-btn" @click="createProject">确认创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResponseData, isSuccess } from '@/utils/competition'

export default {
  name: 'ProjectPage',
  data() {
    return {
      projectList: [],
      teamList: [],
      loading: false,
      showCreateModal: false,
      createForm: {
        projectName: '',
        teamId: '',
        description: ''
      }
    }
  },
  computed: {
    stats() {
      const completed = this.projectList.filter(item => this.normalizeProgress(item.progress) >= 100).length
      const submissions = this.projectList.reduce((sum, item) => sum + Number(item.submissionCount || 0), 0)
      const avg = this.projectList.length
        ? Math.round(this.projectList.reduce((sum, item) => sum + this.normalizeProgress(item.progress), 0) / this.projectList.length)
        : 0
      return [
        { label: '项目总数', value: this.projectList.length },
        { label: '平均进度', value: `${avg}%` },
        { label: '已完成项目', value: completed },
        { label: '作品提交', value: submissions }
      ]
    }
  },
  created() {
    this.getProjectList()
    this.getTeamList()
  },
  methods: {
    async getProjectList() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/overview/projects')
        this.projectList = getResponseData(res, [])
      } catch (err) {
        this.$message.warning('项目看板接口暂不可用')
        this.projectList = []
      } finally {
        this.loading = false
      }
    },
    async getTeamList() {
      try {
        const res = await this.$http.get('/competition/overview/teams')
        this.teamList = getResponseData(res, [])
      } catch (err) {
        this.teamList = []
      }
    },
    async createProject() {
      if (!this.createForm.projectName || !this.createForm.teamId) {
        this.$message.warning('请填写项目名称并选择团队')
        return
      }
      try {
        const payload = {
          ...this.createForm,
          projectDesc: this.createForm.description,
          progress: 0
        }
        const res = await this.$http.post('/competition/project/create', payload)
        if (isSuccess(res)) {
          this.$message.success('创建成功')
          this.showCreateModal = false
          this.createForm = {
            projectName: '',
            teamId: '',
            description: ''
          }
          this.getProjectList()
        } else {
          this.$message.error(res.message || '创建失败')
        }
      } catch (err) {
        this.$message.error('创建项目失败，请检查接口')
      }
    },
    goToSubmit(projectId) {
      this.$router.push(`/project/submit/${projectId}`)
    },
    normalizeProgress(progress) {
      const value = Number(progress || 0)
      return Math.max(0, Math.min(100, value))
    }
  }
}
</script>

<style scoped>
.project-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}
.page-hero,
.stat-card,
.project-card {
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
  margin-bottom: 18px;
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
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.stat-card {
  padding: 20px;
}
.stat-card strong {
  display: block;
  color: #172033;
  font-size: 28px;
  margin-bottom: 6px;
}
.stat-card span {
  color: #64748b;
}
.primary-btn,
.default-btn,
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
.project-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.project-card {
  padding: 22px;
}
.card-header,
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.card-header h3 {
  margin: 10px 0 0;
  color: #172033;
  font-size: 22px;
}
.card-header strong {
  color: #0f766e;
  font-size: 30px;
}
.status-tag {
  padding: 5px 9px;
  border-radius: 999px;
  background: #e8f7ee;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
}
.project-card p {
  color: #64748b;
  line-height: 1.7;
}
.progress-bar {
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: #edf2f7;
  margin: 16px 0;
}
.progress-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f9cf4a, #0f766e);
}
.card-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  color: #64748b;
  font-size: 14px;
}
.card-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.card-footer {
  margin-top: 18px;
  justify-content: flex-end;
}
.default-btn {
  height: 38px;
  padding: 0 14px;
  background: #eef6f8;
  color: #0f766e;
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
@media (max-width: 980px) {
  .page-hero {
    flex-direction: column;
  }
  .stats-row,
  .project-list {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .project-page {
    padding: 18px 14px 36px;
  }
  .card-info {
    grid-template-columns: 1fr;
  }
}

/* Capsule visual pass */
.project-page {
  max-width: 1320px;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}

.page-hero,
.stat-card,
.project-card,
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
    radial-gradient(ellipse at 86% 20%, rgba(196, 217, 78, 0.22), transparent 40%),
    radial-gradient(ellipse at 12% 88%, rgba(197, 181, 224, 0.26), transparent 42%),
    #fff;
}

.page-hero::after {
  content: 'PROJECT';
  position: absolute;
  right: 28px;
  bottom: 24px;
  padding: 12px 28px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-sky);
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
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.page-hero h1,
.stat-card strong,
.project-card h3,
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
.project-card p,
.card-info,
.stat-card span,
.close-icon {
  color: #4a4a4a;
}

.stat-card:nth-child(1) { background: var(--capsule-lavender); }
.stat-card:nth-child(2) { background: var(--capsule-mint); }
.stat-card:nth-child(3) { background: var(--capsule-sky); }
.stat-card:nth-child(4) { background: var(--capsule-yellow); }

.primary-btn,
.default-btn,
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

.default-btn,
.cancel-btn {
  background: #fff;
  color: var(--capsule-ink);
}

.project-card {
  background: rgba(255, 255, 255, 0.72);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.project-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 var(--capsule-shadow);
}

.status-tag {
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

@media (max-width: 640px) {
  .project-page {
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
