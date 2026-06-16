<template>
  <div class="submission-page">
    <section class="submission-hero">
      <div>
        <span class="eyebrow">Submission Archive</span>
        <h1>我的提交记录</h1>
        <p>按当前登录用户聚合展示作品版本、所属团队、关联赛事和提交时间，适合学生自查、教师评审和管理员归档。</p>
      </div>
      <button class="ghost-btn" @click="getSubmissionList">
        <i class="fas fa-sync-alt" :class="{ rotating: loading }"></i>
        刷新
      </button>
    </section>

    <section class="filter-box">
      <div class="select-wrap">
        <i class="fas fa-project-diagram"></i>
        <select v-model="filterProjectId" @change="getSubmissionList">
          <option value="">全部项目</option>
          <option
            v-for="item in projectList"
            :key="item.projectId"
            :value="item.projectId"
          >
            {{ item.projectName }}
          </option>
        </select>
      </div>
      <span>{{ submissionList.length }} 条提交记录</span>
    </section>

    <section class="submission-list" v-loading="loading">
      <article
        v-for="item in submissionList"
        :key="item.submissionId"
        class="submission-card"
      >
        <div class="card-header">
          <div>
            <span class="version-tag">{{ item.version || '暂无版本' }}</span>
            <h3>{{ item.projectName || '未命名项目' }}</h3>
          </div>
          <time>{{ formatTime(item.submitTime || item.createTime) || '待同步' }}</time>
        </div>

        <div class="card-info">
          <span><i class="fas fa-users"></i> {{ item.teamName || '未绑定团队' }}</span>
          <span><i class="fas fa-trophy"></i> {{ item.competitionTitle || item.competitionName || '未绑定赛事' }}</span>
          <span><i class="fas fa-file"></i> {{ item.fileName || getFileName(item.filePath) || '作品文件' }}</span>
          <span><i class="fas fa-weight-hanging"></i> {{ formatSize(item.fileSize) }}</span>
        </div>

        <div class="card-footer">
          <button class="download-btn" @click="exportSubmissionInfo(item)">
            <i class="fas fa-file-export"></i>
            导出说明
          </button>
          <button class="default-btn" v-if="item.projectId" @click="$router.push(`/project/submit/${item.projectId}`)">
            <i class="fas fa-upload"></i>
            继续提交
          </button>
        </div>
      </article>

      <div v-if="submissionList.length === 0 && !loading" class="empty-tip">
        <i class="fas fa-inbox"></i>
        <strong>暂无作品提交记录</strong>
        <span>学生可在“我的项目”中进入作品提交，教师和管理员可在评审后台查看提交情况。</span>
      </div>
    </section>
  </div>
</template>

<script>
import { downloadTextFile, formatDateTime, getCurrentUserId, getResponseData } from '@/utils/competition'

export default {
  name: 'SubmissionPage',
  data() {
    return {
      loading: false,
      submissionList: [],
      projectList: [],
      filterProjectId: ''
    }
  },
  created() {
    this.getWorkbenchProjects()
    this.getSubmissionList()
  },
  methods: {
    async getWorkbenchProjects() {
      try {
        const res = await this.$http.get('/competition/workbench', {
          params: { userId: getCurrentUserId() }
        })
        const workbench = getResponseData(res, {})
        this.projectList = workbench.projects || []
      } catch (err) {
        this.projectList = []
      }
    },
    async getSubmissionList() {
      this.loading = true
      try {
        const res = this.filterProjectId
          ? await this.$http.get('/competition/submission/list/by-project', {
            params: { projectId: this.filterProjectId }
          })
          : await this.$http.get('/competition/submission/list/by-user', {
            params: { userId: getCurrentUserId() }
          })
        this.submissionList = getResponseData(res, [])
      } catch (err) {
        try {
          const fallback = await this.$http.get('/competition/workbench/submissions', {
            params: { userId: getCurrentUserId() }
          })
          this.submissionList = getResponseData(fallback, [])
        } catch (fallbackErr) {
          this.submissionList = []
          this.$message.warning('提交记录接口暂不可用')
        }
      } finally {
        this.loading = false
      }
    },
    formatTime(value) {
      return formatDateTime(value, false)
    },
    formatSize(size) {
      const value = Number(size || 0)
      if (!value) return '未记录大小'
      if (value < 1024) return `${value} B`
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
      return `${(value / 1024 / 1024).toFixed(1)} MB`
    },
    getFileName(filePath = '') {
      return String(filePath).split(/[\\/]/).pop()
    },
    exportSubmissionInfo(item) {
      const content = [
        `项目名称：${item.projectName || '-'}`,
        `团队名称：${item.teamName || '-'}`,
        `赛事名称：${item.competitionTitle || item.competitionName || '-'}`,
        `版本号：${item.version || '-'}`,
        `文件名：${item.fileName || this.getFileName(item.filePath) || '-'}`,
        `文件路径：${item.filePath || '-'}`,
        `文件大小：${this.formatSize(item.fileSize)}`,
        `提交时间：${item.submitTime || item.createTime || '-'}`
      ].join('\n')
      downloadTextFile(`${item.projectName || '作品提交'}-${item.version || '记录'}.txt`, content)
    }
  }
}
</script>

<style scoped>
.submission-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}
.submission-hero,
.filter-box,
.submission-card,
.empty-tip {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}
.submission-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 36px;
  background:
    radial-gradient(ellipse at 86% 20%, rgba(139, 180, 247, 0.18), transparent 42%),
    radial-gradient(ellipse at 12% 88%, rgba(232, 93, 78, 0.16), transparent 42%),
    #fff;
}
.eyebrow {
  display: inline-flex;
  width: max-content;
  padding: 9px 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.submission-hero h1,
.submission-card h3,
.empty-tip strong {
  margin: 12px 0;
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}
.submission-hero h1 {
  font-size: 48px;
  line-height: 1.05;
}
.submission-hero p,
.card-info,
.empty-tip span {
  color: #4a4a4a;
  line-height: 1.7;
}
.filter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 24px 0;
  padding: 18px;
}
.select-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 16px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-cream);
}
.select-wrap select {
  border: 0;
  outline: none;
  background: transparent;
  color: var(--capsule-ink);
  font-weight: 800;
}
.submission-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.submission-card {
  padding: 24px;
  background: #fff;
}
.submission-card:nth-child(2n + 1) {
  background: #fffdf2;
}
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}
.version-tag,
.card-header time,
.ghost-btn,
.download-btn,
.default-btn {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  color: var(--capsule-ink);
  font-weight: 800;
}
.version-tag {
  display: inline-flex;
  padding: 6px 12px;
  background: var(--capsule-lime);
}
.card-header time {
  padding: 6px 12px;
  background: var(--capsule-lavender);
  white-space: nowrap;
}
.card-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0;
}
.card-info span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 6px 10px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: #fff;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 2px solid var(--capsule-outline);
}
.ghost-btn,
.download-btn,
.default-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  background: var(--capsule-yellow);
  cursor: pointer;
}
.download-btn {
  background: #fff;
}
.default-btn {
  background: var(--capsule-sky);
}
.empty-tip {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 260px;
  padding: 32px;
  text-align: center;
}
.empty-tip i {
  color: #6f8fa8;
  font-size: 34px;
}
.rotating {
  animation: rotate 0.8s linear infinite;
}
@keyframes rotate {
  to { transform: rotate(360deg); }
}
@media (max-width: 900px) {
  .submission-list {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .submission-page {
    padding: 94px 16px 48px;
  }
  .submission-hero,
  .filter-box,
  .card-header,
  .card-footer {
    align-items: stretch;
    flex-direction: column;
  }
  .submission-hero {
    padding: 30px 22px;
  }
  .submission-hero h1 {
    font-size: 36px;
  }
  .card-info {
    grid-template-columns: 1fr;
  }
}
</style>
