<template>
  <el-dialog
    :visible.sync="$store.state.searchVisible"
    title="全站搜索"
    width="720px"
    custom-class="competition-search-dialog"
    @opened="handleOpened"
    @update:visible="handleClose"
  >
    <div class="search-input-wrapper" :class="{ loading }">
      <i class="fas fa-search search-icon"></i>
      <input
        ref="searchInput"
        v-model="keyword"
        type="text"
        class="search-input"
        placeholder="搜索赛事、项目、备赛资源、获奖信息..."
        @keyup.enter="handleSearch"
      />
      <button v-if="keyword" class="clear-btn" @click="clearSearch" aria-label="清空搜索">
        <i class="fas fa-times"></i>
      </button>
      <span class="enter-tip">
        <i class="fas fa-level-down-alt fa-rotate-90"></i>
        按回车搜索
      </span>
    </div>

    <div v-if="!hasSearched" class="search-guide">
      <section>
        <h4>
          <i class="fas fa-bolt"></i>
          快速入口
        </h4>
        <div class="quick-grid">
          <button
            v-for="item in quickLinks"
            :key="item.path"
            class="quick-link"
            @click="goTo(item.path)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </section>

      <section>
        <h4>
          <i class="fas fa-lightbulb"></i>
          推荐关键词
        </h4>
        <div class="keyword-tags">
          <button
            v-for="item in suggestedKeywords"
            :key="item"
            class="keyword-tag"
            @click="searchKeyword(item)"
          >
            {{ item }}
          </button>
        </div>
      </section>
    </div>

    <div v-else class="result-summary">
      <span>找到 {{ searchResults.length }} 条与 “{{ keyword.trim() }}” 相关的结果</span>
      <button @click="clearSearch">重新搜索</button>
    </div>

    <div v-if="searchResults.length > 0" class="search-results" v-loading="loading">
      <article
        v-for="item in searchResults"
        :key="item.id"
        class="search-result-item"
        @click="handleResultClick(item)"
      >
        <div class="result-icon" :class="item.colorClass">
          <i :class="item.icon"></i>
        </div>
        <div class="result-main">
          <div class="result-header">
            <span class="result-type">{{ item.typeLabel }}</span>
            <h3 v-html="highlightKeyword(item.title)"></h3>
          </div>
          <p v-html="highlightKeyword(item.summary)"></p>
          <div class="result-footer">
            <span v-for="meta in item.meta" :key="meta">
              {{ meta }}
            </span>
          </div>
        </div>
        <i class="fas fa-arrow-right result-arrow"></i>
      </article>
    </div>

    <el-empty
      v-if="hasSearched && searchResults.length === 0 && !loading"
      description="暂无匹配结果，可以换个关键词试试"
    />
  </el-dialog>
</template>

<script>
import { getResponseData } from '@/utils/competition'

const FALLBACK_DATA = {
  competitions: [
    {
      competitionId: 1,
      competitionName: '山东大学第十届互联网+创新创业大赛',
      title: '山东大学第十届互联网+创新创业大赛',
      type: '创新创业类',
      status: '报名中',
      publisherName: '创新创业学院',
      content: '面向互联网+、智能制造、数字经济和社会服务项目，覆盖报名、组队、提交与评审。'
    },
    {
      competitionId: 2,
      competitionName: '齐鲁软件设计与开发挑战赛',
      title: '齐鲁软件设计与开发挑战赛',
      type: '程序设计类',
      status: '评审中',
      publisherName: '软件学院',
      content: '聚焦软件工程实践、代码质量、团队协作和产品化表达。'
    }
  ],
  projects: [
    {
      projectId: 1,
      projectName: 'PDS竞赛全流程协同平台',
      projectDesc: '覆盖赛事发布、团队组建、项目提交、评审获奖与通知提醒。',
      teamName: '智启未来队',
      competitionTitle: '山东大学第十届互联网+创新创业大赛',
      progress: 72
    },
    {
      projectId: 6,
      projectName: 'AI备赛问答助手',
      projectDesc: '根据赛事通知、评分细则和项目材料，辅助学生准备答辩。',
      teamName: '算法青藤队',
      competitionTitle: '齐鲁软件设计与开发挑战赛',
      progress: 42
    }
  ],
  resources: [
    {
      resourceId: 1,
      title: '项目计划书模板',
      type: '模板材料',
      fileName: 'project-plan-template.docx',
      downloadCount: 86
    },
    {
      resourceId: 2,
      title: '校级评审评分标准',
      type: '评分标准',
      fileName: 'rubric.pdf',
      downloadCount: 74
    }
  ],
  awards: [
    {
      reviewId: 1,
      projectName: '学生成长数据画像',
      teamName: '数智先锋队',
      competitionName: '全国大学生数据智能应用竞赛校内选拔',
      awardLevel: '一等奖',
      score: 92
    },
    {
      reviewId: 2,
      projectName: '教室能耗智能监测终端',
      teamName: '低功耗实验室',
      competitionName: '智能硬件创意设计赛',
      awardLevel: '二等奖',
      score: 86
    }
  ]
}

export default {
  name: 'SearchDialog',
  data() {
    return {
      keyword: '',
      loading: false,
      hasSearched: false,
      rawData: null,
      searchResults: [],
      searchTimeout: null,
      quickLinks: [
        { label: '赛事大厅', path: '/', icon: 'fas fa-home' },
        { label: '我的项目', path: '/project', icon: 'fas fa-project-diagram' },
        { label: '备赛资源', path: '/resource', icon: 'fas fa-book-open' },
        { label: '获奖公示', path: '/award', icon: 'fas fa-medal' },
        { label: '智能备赛', path: '/ai-chat', icon: 'fas fa-robot' },
        { label: '数据分析', path: '/analytics', icon: 'fas fa-chart-line' }
      ],
      suggestedKeywords: ['互联网+', '答辩 PPT', '评分标准', 'AI备赛', '项目计划书', '一等奖']
    }
  },
  watch: {
    keyword() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        if (this.keyword.trim()) {
          this.handleSearch()
        } else {
          this.searchResults = []
          this.hasSearched = false
        }
      }, 260)
    }
  },
  methods: {
    async handleOpened() {
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus()
        }
      })
      if (!this.rawData) {
        await this.loadSearchData()
      }
    },
    async loadSearchData() {
      const requests = [
        this.$http.get('/competition/overview/competitions'),
        this.$http.get('/competition/overview/projects'),
        this.$http.get('/competition/resource/list/active'),
        this.$http.get('/competition/overview/awards')
      ]

      const results = await Promise.allSettled(requests)
      this.rawData = {
        competitions: this.resolveResult(results[0], FALLBACK_DATA.competitions),
        projects: this.resolveResult(results[1], FALLBACK_DATA.projects),
        resources: this.resolveResult(results[2], FALLBACK_DATA.resources),
        awards: this.resolveResult(results[3], FALLBACK_DATA.awards)
      }
    },
    resolveResult(result, fallback) {
      if (result.status !== 'fulfilled') return fallback
      const data = getResponseData(result.value, fallback)
      return Array.isArray(data) && data.length ? data : fallback
    },
    async handleSearch() {
      const value = this.keyword.trim().toLowerCase()
      if (!value) {
        this.searchResults = []
        this.hasSearched = false
        return
      }

      this.loading = true
      try {
        if (!this.rawData) {
          await this.loadSearchData()
        }
        this.searchResults = this.normalizeResults()
          .filter(item => item.searchText.includes(value))
          .slice(0, 18)
        this.hasSearched = true
      } finally {
        this.loading = false
      }
    },
    normalizeResults() {
      const competitions = (this.rawData?.competitions || []).map(item => ({
        id: `competition-${item.competitionId}`,
        type: 'competition',
        typeLabel: '赛事',
        title: item.competitionName || item.title || item.name || '未命名赛事',
        summary: item.description || item.content || item.remark || '查看赛事详情、报名状态和参赛要求。',
        meta: [
          item.type || item.competitionType || '综合赛事',
          item.status || '待同步',
          item.publisherName ? `发布人 ${item.publisherName}` : ''
        ].filter(Boolean),
        icon: 'fas fa-trophy',
        colorClass: 'sky',
        path: item.competitionId ? `/competition/detail/${item.competitionId}` : '/'
      }))

      const projects = (this.rawData?.projects || []).map(item => ({
        id: `project-${item.projectId || item.projectName}`,
        type: 'project',
        typeLabel: '项目',
        title: item.projectName || '未命名项目',
        summary: item.description || item.projectDesc || '查看项目进度、团队、提交次数和最新版本。',
        meta: [
          item.teamName || '未绑定团队',
          item.competitionName || item.competitionTitle || '未绑定赛事',
          `${Number(item.progress || 0)}%`
        ].filter(Boolean),
        icon: 'fas fa-diagram-project',
        colorClass: 'mint',
        path: '/project'
      }))

      const resources = (this.rawData?.resources || []).map(item => ({
        id: `resource-${item.resourceId || item.title}`,
        type: 'resource',
        typeLabel: '资源',
        title: item.title || item.resourceName || item.fileName || '备赛资源',
        summary: item.description || `文件名：${item.fileName || '暂无文件名'}`,
        meta: [
          item.type || '综合资料',
          `${Number(item.downloadCount || 0)} 次下载`
        ],
        icon: 'fas fa-book-open',
        colorClass: 'yellow',
        path: '/resource'
      }))

      const awards = (this.rawData?.awards || []).map(item => ({
        id: `award-${item.reviewId || item.projectName}`,
        type: 'award',
        typeLabel: '获奖',
        title: item.projectName || '获奖项目',
        summary: item.reviewComment || item.competitionName || '查看获奖等级、团队和评分信息。',
        meta: [
          item.awardLevel || '入围',
          item.teamName || '未绑定团队',
          item.score ? `${item.score} 分` : ''
        ].filter(Boolean),
        icon: 'fas fa-medal',
        colorClass: 'lavender',
        path: '/award'
      }))

      return [...competitions, ...projects, ...resources, ...awards].map(item => ({
        ...item,
        searchText: [
          item.title,
          item.summary,
          ...item.meta,
          item.typeLabel
        ].join(' ').toLowerCase()
      }))
    },
    highlightKeyword(text) {
      if (!this.keyword || !text) return text
      const keywords = this.keyword.split(/\s+/).filter(Boolean)
      let result = this.escapeHtml(String(text))
      keywords.forEach(keyword => {
        const regex = new RegExp(`(${this.escapeRegExp(keyword)})`, 'gi')
        result = result.replace(regex, '<mark>$1</mark>')
      })
      return result
    },
    escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    },
    escapeRegExp(text) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    handleResultClick(item) {
      this.goTo(item.path)
    },
    searchKeyword(value) {
      this.keyword = value
      this.handleSearch()
    },
    goTo(path) {
      this.close()
      this.$router.push(path)
    },
    clearSearch() {
      this.keyword = ''
      this.searchResults = []
      this.hasSearched = false
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus()
        }
      })
    },
    close() {
      this.$store.commit('SET_SEARCH_VISIBLE', false)
      this.keyword = ''
      this.searchResults = []
      this.hasSearched = false
    },
    handleClose() {
      this.close()
    },
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.close()
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    document.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style lang="scss" scoped>
:deep(.competition-search-dialog) {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 70px rgba(73, 82, 93, 0.18);
  backdrop-filter: blur(20px) saturate(135%);

  .el-dialog__header {
    padding: 24px 28px 10px;
  }

  .el-dialog__title {
    color: #20232a;
    font-weight: 800;
  }

  .el-dialog__body {
    padding: 18px 28px 28px;
  }
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 58px;
  padding: 0 16px;
  border: 1px solid rgba(210, 216, 224, 0.9);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: #6f8fa8;
    box-shadow: 0 0 0 4px rgba(111, 143, 168, 0.12);
  }

  &.loading::after {
    content: '';
    width: 18px;
    height: 18px;
    border: 2px solid #d9dfe6;
    border-top-color: #6f8fa8;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

.search-icon {
  margin-right: 12px;
  color: #6f7681;
  font-size: 18px;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #20232a;
  font-size: 16px;
}

.clear-btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: rgba(214, 205, 232, 0.45);
  color: #646974;
  cursor: pointer;
}

.enter-tip {
  margin-left: 12px;
  color: #8a9099;
  font-size: 12px;
  white-space: nowrap;
}

.search-guide {
  display: grid;
  gap: 22px;
  margin-top: 22px;
}

.search-guide h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #20232a;
  font-size: 15px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.quick-link,
.keyword-tag {
  border: 1px solid rgba(210, 216, 224, 0.78);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  color: #20232a;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 14px;
}

.quick-link:hover,
.keyword-tag:hover,
.search-result-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(73, 82, 93, 0.12);
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  padding: 9px 14px;
}

.result-summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0 12px;
  color: #646974;
  font-size: 13px;
}

.result-summary button {
  border: 0;
  background: transparent;
  color: #6f8fa8;
  cursor: pointer;
  font-weight: 800;
}

.search-results {
  display: grid;
  gap: 12px;
  max-height: 58vh;
  overflow-y: auto;
  padding-right: 4px;
}

.search-result-item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(210, 216, 224, 0.78);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.result-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  color: #20232a;

  &.sky { background: rgba(191, 209, 234, 0.72); }
  &.mint { background: rgba(201, 230, 216, 0.72); }
  &.yellow { background: rgba(243, 226, 167, 0.72); }
  &.lavender { background: rgba(214, 205, 232, 0.72); }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.result-type {
  flex: none;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(191, 209, 234, 0.56);
  color: #35495d;
  font-size: 12px;
  font-weight: 800;
}

.result-header h3 {
  min-width: 0;
  margin: 0;
  color: #20232a;
  font-size: 16px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-main p {
  margin: 0 0 8px;
  color: #646974;
  font-size: 13px;
  line-height: 1.6;
}

.result-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #8a9099;
  font-size: 12px;
}

.result-arrow {
  color: #9aa1aa;
}

:deep(mark) {
  padding: 0 2px;
  border-radius: 3px;
  background: rgba(243, 226, 167, 0.82);
  color: #20232a;
  font-weight: 800;
}

@media (max-width: 720px) {
  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .enter-tip {
    display: none;
  }

  .search-result-item {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .result-arrow {
    display: none;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
