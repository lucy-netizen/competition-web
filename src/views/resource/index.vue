<template>
  <div class="resource-page">
    <section class="resource-hero">
      <div>
        <span class="eyebrow">Resource Center</span>
        <h1>备赛资源中心</h1>
        <p>汇集答辩模板、评分细则、往届作品、报名指南和样例数据，支持按资源类型快速筛选。</p>
      </div>
      <div class="resource-summary">
        <div>
          <strong>{{ resourceList.length }}</strong>
          <span>已发布资源</span>
        </div>
        <div>
          <strong>{{ totalDownloads }}</strong>
          <span>累计下载</span>
        </div>
      </div>
    </section>

    <section class="resource-toolbar">
      <div class="tab-list">
        <button
          v-for="tab in tabList"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: currentTab === tab.value }"
          @click="changeTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="toolbar-search">
        <i class="fas fa-search"></i>
        <input v-model="keyword" placeholder="搜索资源标题、文件名或类型">
      </div>
    </section>

    <div class="resource-list" v-loading="loading">
      <article
        v-for="resource in filteredResources"
        :key="resource.resourceId"
        class="resource-card"
      >
        <div class="resource-icon" :class="getFileType(resource.fileName)">
          <i :class="getFileIcon(resource.fileName)"></i>
        </div>
        <div class="card-main">
          <div class="card-header">
            <h3>{{ resource.title }}</h3>
            <span>{{ resource.status || '已发布' }}</span>
          </div>
          <p>{{ resource.description || `文件名：${resource.fileName || '未命名资源'}` }}</p>
          <div class="card-info">
            <span><i class="fas fa-folder"></i>{{ resource.type || '综合资料' }}</span>
            <span><i class="fas fa-user"></i>{{ resource.uploaderName || `上传者 ${resource.uploaderId || '-'}` }}</span>
            <span><i class="fas fa-download"></i>{{ resource.downloadCount || 0 }} 次</span>
            <span><i class="far fa-clock"></i>{{ formatTime(resource.createTime) || '近期更新' }}</span>
          </div>
        </div>
        <button class="download-btn" @click="handleDownload(resource)">
          <i class="fas fa-download"></i>
          {{ canRealDownload(resource) ? '下载文件' : '导出说明' }}
        </button>
      </article>

      <div v-if="filteredResources.length === 0 && !loading" class="empty-tip">
        <i class="fas fa-folder-open"></i>
        <span>暂无相关资源</span>
        <small>可以切换分类或清空搜索条件。</small>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadTextFile, formatDateTime, getResponseData } from '@/utils/competition'

export default {
  name: 'ResourcePage',
  data() {
    return {
      tabList: [
        { label: '全部', value: 'all' },
        { label: '学习资料', value: '学习资料' },
        { label: '往届作品', value: '往届作品' },
        { label: '课件', value: '课件' },
        { label: '答辩材料', value: '答辩材料' },
        { label: '评分标准', value: '评分标准' },
        { label: '模板材料', value: '模板材料' },
        { label: '报名指南', value: '报名指南' },
        { label: '样例数据', value: '样例数据' }
      ],
      currentTab: 'all',
      keyword: '',
      resourceList: [],
      loading: false
    }
  },
  computed: {
    filteredResources() {
      const words = this.keyword.trim().toLowerCase()
      return this.resourceList.filter(item => {
        const matchTab = this.currentTab === 'all' || item.type === this.currentTab
        if (!words) return matchTab

        const source = [
          item.title,
          item.fileName,
          item.type,
          item.description,
          item.uploaderName
        ].join(' ').toLowerCase()

        return matchTab && source.includes(words)
      })
    },
    totalDownloads() {
      return this.resourceList.reduce((sum, item) => sum + Number(item.downloadCount || 0), 0)
    }
  },
  created() {
    this.getResourceList()
  },
  methods: {
    async getResourceList() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/resource/list/active')
        this.resourceList = getResponseData(res, [])
      } catch (err) {
        this.$message.warning('资源接口暂不可用，已进入空状态')
        this.resourceList = []
      } finally {
        this.loading = false
      }
    },
    changeTab(value) {
      this.currentTab = value
    },
    canRealDownload(resource) {
      return resource.fileExists === true || resource.canDownload === true || resource.fileReady === true
    },
    async handleDownload(resource) {
      if (!this.canRealDownload(resource)) {
        this.exportResourceInfo(resource)
        this.$message.info('已导出资源说明')
        return
      }

      try {
        const res = await this.$http.post('/competition/resource/download', null, {
          params: { resourceId: resource.resourceId },
          responseType: 'blob'
        })
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = resource.fileName || `${resource.title || 'resource'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.$message.success('下载成功')
        this.getResourceList()
      } catch (err) {
        this.exportResourceInfo(resource)
        this.$message.warning('后端文件不可用，已导出资源说明')
      }
    },
    exportResourceInfo(resource) {
      const content = [
        `资源名称：${resource.title || '-'}`,
        `资源类型：${resource.type || '-'}`,
        `文件名：${resource.fileName || '-'}`,
        `上传者：${resource.uploaderName || resource.uploaderId || '-'}`,
        `下载次数：${resource.downloadCount || 0}`,
        `发布时间：${resource.createTime || '-'}`,
        '',
        '说明：保存文件路径元数据'
      ].join('\n')
      downloadTextFile(`${resource.title || '备赛资源'}-说明.txt`, content)
    },
    formatTime(timeStr) {
      return formatDateTime(timeStr)
    },
    getFileType(fileName = '') {
      const lower = fileName.toLowerCase()
      if (lower.endsWith('.pdf')) return 'pdf'
      if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return 'ppt'
      if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) return 'excel'
      if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'doc'
      return 'file'
    },
    getFileIcon(fileName = '') {
      const type = this.getFileType(fileName)
      const iconMap = {
        pdf: 'fas fa-file-pdf',
        ppt: 'fas fa-file-powerpoint',
        excel: 'fas fa-file-excel',
        doc: 'fas fa-file-word',
        file: 'fas fa-file-alt'
      }
      return iconMap[type]
    }
  }
}
</script>

<style scoped>
.resource-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}
.resource-hero,
.resource-toolbar,
.resource-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 52px rgba(28, 45, 70, 0.08);
}
.resource-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  margin-bottom: 22px;
}
.eyebrow {
  color: #0f766e;
  font-weight: 800;
  font-size: 13px;
}
.resource-hero h1 {
  margin: 8px 0 10px;
  font-size: 38px;
  color: #172033;
}
.resource-hero p {
  max-width: 760px;
  color: #64748b;
  line-height: 1.7;
}
.resource-summary {
  display: grid;
  grid-template-columns: repeat(2, 120px);
  gap: 12px;
  align-content: center;
}
.resource-summary div {
  padding: 18px;
  border-radius: 8px;
  background: #172033;
  color: #fff;
}
.resource-summary strong {
  display: block;
  margin-bottom: 8px;
  font-size: 28px;
}
.resource-summary span {
  color: #a8b0bf;
  font-size: 13px;
}
.resource-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  margin-bottom: 22px;
}
.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tab-btn {
  border: none;
  border-radius: 6px;
  background: transparent;
  padding: 10px 14px;
  cursor: pointer;
  color: #516073;
  font-weight: 700;
}
.tab-btn.active {
  background: #0f766e;
  color: #fff;
}
.toolbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 320px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  background: #f6f8fb;
  color: #64748b;
}
.toolbar-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
}
.resource-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.resource-card {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px;
}
.resource-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 8px;
  background: #eef6f8;
  color: #0f766e;
  font-size: 24px;
}
.resource-icon.pdf { background: #fff1f1; color: #dc2626; }
.resource-icon.ppt { background: #fff4dc; color: #d97706; }
.resource-icon.excel { background: #e8f8ee; color: #15803d; }
.resource-icon.doc { background: #e8f2ff; color: #2563eb; }
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.card-header h3 {
  margin: 0;
  color: #172033;
  font-size: 19px;
}
.card-header span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #e8f7ee;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
}
.card-main p {
  margin: 0 0 12px;
  color: #64748b;
  line-height: 1.6;
}
.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  color: #64748b;
  font-size: 13px;
}
.card-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  border: none;
  border-radius: 6px;
  padding: 0 14px;
  background: #1d8cf8;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}
.empty-tip {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 260px;
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
@media (max-width: 980px) {
  .resource-hero,
  .resource-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .resource-summary,
  .resource-list {
    grid-template-columns: 1fr;
  }
  .toolbar-search {
    width: auto;
  }
}
@media (max-width: 640px) {
  .resource-page {
    padding: 18px 14px 36px;
  }
  .resource-card {
    grid-template-columns: 1fr;
  }
  .download-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Capsule visual pass */
.resource-page {
  max-width: 1320px;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}

.resource-hero,
.resource-toolbar,
.resource-card,
.empty-tip {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}

.resource-hero {
  position: relative;
  overflow: hidden;
  padding: 38px 36px;
  background:
    radial-gradient(ellipse at 86% 20%, rgba(242, 209, 96, 0.28), transparent 42%),
    radial-gradient(ellipse at 12% 86%, rgba(168, 230, 207, 0.26), transparent 42%),
    #fff;
}

.resource-hero::after {
  content: 'RESOURCE';
  position: absolute;
  right: 28px;
  bottom: 24px;
  padding: 12px 28px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-peach);
  color: var(--capsule-ink);
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-7deg);
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

.resource-hero h1,
.resource-summary strong,
.card-header h3 {
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.resource-hero h1 {
  font-size: 44px;
  line-height: 1.05;
}

.resource-hero p,
.card-main p,
.card-info,
.empty-tip {
  color: #4a4a4a;
}

.resource-summary div {
  border: 2px solid var(--capsule-outline);
  border-radius: 28px;
  background: var(--capsule-lavender);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
}

.resource-summary div:nth-child(2) {
  background: var(--capsule-mint);
}

.resource-summary span {
  color: #4a4a4a;
}

.resource-toolbar {
  padding: 18px;
}

.tab-btn,
.download-btn,
.card-header span {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-weight: 800;
}

.tab-btn {
  background: #fff;
  color: var(--capsule-ink);
}

.tab-btn.active {
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.toolbar-search {
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-cream);
  color: var(--capsule-ink);
}

.resource-card {
  background: #fff;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.resource-card:nth-child(2n + 1) {
  background: #fffdf2;
}

.resource-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 var(--capsule-shadow);
}

.resource-icon,
.resource-icon.pdf,
.resource-icon.ppt,
.resource-icon.excel,
.resource-icon.doc {
  border: 2px solid var(--capsule-outline);
  border-radius: 50%;
  background: var(--capsule-sky);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
}

.resource-icon.pdf { background: var(--capsule-peach); }
.resource-icon.ppt { background: var(--capsule-yellow); }
.resource-icon.excel { background: var(--capsule-mint); }
.resource-icon.doc { background: var(--capsule-lavender); }

.card-header span {
  background: var(--capsule-lime);
  color: var(--capsule-ink);
}

.download-btn {
  background: var(--capsule-sky);
  color: var(--capsule-ink);
}

.empty-tip i {
  color: #6f8fa8;
}

.empty-tip span {
  color: var(--capsule-ink);
}

@media (max-width: 640px) {
  .resource-page {
    padding: 94px 16px 48px;
  }

  .resource-hero {
    padding: 30px 22px;
  }

  .resource-hero::after {
    position: static;
    width: max-content;
    margin-top: 12px;
  }

  .resource-hero h1 {
    font-size: 36px;
  }
}
</style>
