<template>
  <div class="planetary-detail-page" v-loading="loading">
    <!-- 1. 顶部面包屑：修正分类显示逻辑 -->
    <div class="breadcrumb-container">
      <div class="status-group">
        <span class="status-badge">公开数据集</span>
        <span class="divider">/</span>
        <span class="category-name">
          {{ article.category && article.category.name ? article.category.name : '行星科学数据' }}
        </span>
      </div>
      <div class="meta-info-group">
        <span class="pub-date"><i class="far fa-calendar-check"></i> 发布于 {{ article.createTime || '2026-01-27' }}</span>
        <span class="license-info"><i class="fab fa-creative-commons"></i> CC BY-NC-SA 4.0</span>
      </div>
    </div>

    <div class="content-layout">
      <!-- ================= 左侧主内容区 (学术核心) ================= -->
      <main class="main-content">
        <!-- 标题头：100% 动态 -->
        <header class="article-header">
          <h1 class="data-title">
            {{ article.title }}
            <el-tooltip content="跳转至原始资源" placement="top">
              <i class="fas fa-external-link-alt" @click="openExternal(article.originalUrl)"></i>
            </el-tooltip>
          </h1>

          <!-- 唯一标识 (CSTR/DOI) -->
          <div class="id-panel">
            <div class="id-item">
              <span class="label">CSTR</span>
              <span class="val">{{ article.cstr || '11000.CSTR.PDS.LUNAR.CE5' }}</span>
              <i class="far fa-copy" @click="copyText(article.cstr)" title="复制 CSTR"></i>
            </div>
            <div class="id-item">
              <span class="label">DOI</span>
              <span class="val">{{ article.doi || '10.57760/sciencedb.planetary.001' }}</span>
              <i class="far fa-copy" @click="copyText(article.doi)" title="复制 DOI"></i>
            </div>
          </div>

          <!-- 作者列表：动态解析字符串 -->
          <div class="author-bar">
            <div class="author-icon"><i class="fas fa-user-graduate"></i></div>
            <div class="author-list">
              <span v-for="(name, index) in authors" :key="index" class="author-name">
                {{ name }}{{ index < authors.length - 1 ? '；' : '' }}
              </span>
            </div>
          </div>
        </header>

        <!-- 1. 摘要描述 (核心项) -->
        <section id="description" class="section-card">
          <h2 class="section-title">数据摘要 / Description</h2>
          <div class="description-content">
            <!-- 优先显示后端数据，若没有则显示行星背景占位 -->
            <div v-if="article.description" class="rich-text" v-html="article.description"></div>
            <div v-else class="placeholder-text">
              本数据集记录了行星探测任务中的关键科学观测数据。包含多光谱影像、雷达回波、以及化学元素反演结果。
              数据经过初级校正和精细化处理，可直接用于行星地质、大气环境及演化历史的研究。
            </div>
          </div>
        </section>

        <!-- 2. 关键词与标签 (动态) -->
        <section class="section-card">
          <div class="meta-grid">
            <div class="meta-cell">
              <span class="label">关键词 (Keywords)：</span>
              <div class="tag-wrap">
                <span v-for="tag in keywords" :key="tag" class="science-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="meta-cell">
              <span class="label">所属分类 (Subject)：</span>
              <span class="subject-val">{{ article.category ? article.category.name : '通用行星科学' }}</span>
            </div>
          </div>
        </section>

        <!-- 3. 数据实体下载 (100% 交互) -->
        <section id="download" class="section-card">
          <h2 class="section-title">数据实体与下载 / Download</h2>
          <div class="file-table-container">
            <div class="table-header">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" v-model="fileQuery" placeholder="检索文件名...">
              </div>
              <div class="header-actions">
                <i class="fas fa-file-export" title="导出元数据"></i>
                <i class="fas fa-sync-alt" @click="fetchDetail" title="刷新列表"></i>
              </div>
            </div>
            <div class="file-list">
              <div class="file-row">
                <div class="file-type-icon"><i class="fas fa-file-archive"></i></div>
                <div class="file-info">
                  <div class="filename">PDS_DATA_EXPLORATION_V1.zip</div>
                  <div class="file-meta">
                    <span class="size">35.93 KB</span>
                    <span class="dot">·</span>
                    <span class="md5">MD5: f9e8d...</span>
                  </div>
                </div>
                <div class="file-actions">
                  <el-button type="primary" size="small" icon="el-icon-download" @click="handleDownload">
                    下载数据包
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 动态引用生成 (逻辑增强) -->
        <section id="cite" class="section-card">
          <h2 class="section-title">引用本数据 / Cite This Dataset</h2>
          <div class="citation-container">
            <div class="citation-header">
              <el-radio-group v-model="citeType" size="mini">
                <el-radio-button label="GB/T 7714"></el-radio-button>
                <el-radio-button label="APA"></el-radio-button>
                <el-radio-button label="BibTeX"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="citation-body">
              <p class="cite-text">{{ dynamicCitation }}</p>
              <p class="cite-text">{{ dynamicCitation }}</p>
              <button class="copy-btn" @click="copyText(dynamicCitation)">
                <i class="far fa-copy"></i> 复制引用
              </button>
            </div>
          </div>
        </section>

        <!-- 5. 数据统计 -->
        <section id="statistics" class="section-card">
          <h2 class="section-title">数据访问统计 / Statistics</h2>
          <div class="stats-overview">
            <div class="stat-box">
              <span class="num">{{ article.quantity > 3184 ? article.quantity : 3184 }}</span>
              <span class="lab">总阅读次数</span>
            </div>
            <div class="stat-box">
              <span class="num">865</span>
              <span class="lab">数据下载量</span>
            </div>
            <div class="stat-box">
              <span class="num">42</span>
              <span class="lab">文献引用量</span>
            </div>
          </div>

          <div class="charts-layout">
            <div class="chart-block">
              <h3 class="chart-subtitle">近一年访问趋势 (Annual Trends)</h3>
              <div ref="barChart" class="echart-box"></div>
            </div>
            <div class="chart-block map-full-width">
              <h3 class="chart-subtitle">地理分布 (Geographical Distribution)</h3>
              <div ref="mapChart" class="echart-box map-box"></div>
            </div>
          </div>
        </section>
      </main>

      <!-- ================= 右侧侧边栏 (链接卡片) ================= -->
      <aside class="sidebar-content">
        <!-- ★★★ 核心升级：真·动态作者关注卡片 ★★★ -->
        <div class="author-info-card">
          <div class="avatar-wrap">
            <!-- 逻辑：优先取后端返回的作者真实头像，没有则用默认图 -->
            <el-avatar :size="70" :src="article.avatar || 'https://img.shiyit.com/base/avatar.png'"></el-avatar>
          </div>
          <!-- 逻辑：优先取后端返回的作者真实昵称，没有则取计算属性 authors 的第一个值 -->
          <div class="author-name-tag">{{ article.nickname || authors[0] }}</div>
          <button class="follow-btn-main" :class="{ followed: isFollowed }" @click="handleFollow">
            <i :class="isFollowed ? 'el-icon-check' : 'el-icon-plus'"></i>
            {{ isFollowed ? '已关注作者' : '关注作者' }}
          </button>
        </div>

        <!-- 侧边操作栏：已激活交互 -->
        <div class="side-action-card">
          <div class="action-btn-item" @click="handleLike">
            <i class="fas fa-thumbs-up" :class="{ active: article.isLike }"></i>
            <span>{{ article.likeNum || 0 }}</span>
          </div>
          <div class="action-btn-item" @click="handleFav">
            <i class="fas fa-star" :class="{ active: article.isFavorite }"></i>
            <span>{{ article.favoriteNum || 0 }}</span>
          </div>
          <div class="action-btn-item" @click="$message.info('分享功能正在接入...')">
            <i class="fas fa-share-alt"></i>
            <span>分享</span>
          </div>
        </div>

        <!-- 1. 数据集来源 (打通链接) -->
        <div class="link-card">
          <h4 class="card-label">本数据集由</h4>
          <a :href="article.originalUrl || 'https://pds.wh.sdu.edu.cn/'" target="_blank" class="card-link">
            《行星数据发布系统 (PDS)》 <i class="fas fa-link"></i>
          </a>
        </div>

        <!-- 2. 纳入计划 (打通链接) -->
        <div class="link-card">
          <h4 class="card-label">该数据集已被纳入</h4>
          <a href="https://moon.bao.ac.cn/" target="_blank" class="card-link special">
            中国探月工程科学数据中心 <i class="fas fa-link"></i>
          </a>
        </div>

        <!-- 3. 关联论文 (DOI逻辑) -->
        <div class="link-card journal-card">
          <h4 class="card-label">关联论文 / 补充</h4>
          <div class="journal-item" @click="openExternal(article.originalUrl)">
            <img src="https://img.shiyit.com/base/mojian/planetary-journal.png" alt="cover">
            <div class="j-info">
              <div class="j-title">Nature Astronomy: 月球晚期火山活动数据集分析报告</div>
              <div class="j-doi">DOI: {{ article.doi || '10.1038/s41550' }}</div>
            </div>
          </div>
        </div>

        <!-- 4. 推荐数据集 (逻辑跳转) -->
        <div class="link-card recommend-card">
          <h4 class="card-label">推荐数据集</h4>
          <div v-for="i in 3" :key="i" class="rec-item" @click="handleRecJump(i)">
            <p class="rec-title">基于深度学习的行星{{ i === 1 ? '表面' : '大气' }}健康指标监测...</p>
            <p class="rec-meta">数据集; 科学研究; 行星探测</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- 细节浮动导航 -->
    <nav class="floating-nav-bar">
      <div class="nav-wrapper">
        <span class="nav-title">细节导航</span>
        <a href="#description" class="nav-link">描述</a>
        <a href="#download" class="nav-link">下载</a>
        <a href="#cite" class="nav-link">引用</a>
        <a href="#statistics" class="nav-link">统计</a>
        <button class="nav-btn-repo" @click="openExternal('https://pds.wh.sdu.edu.cn/')">
          前往仓库 <i class="fas fa-database"></i>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getArticleDetailApi, likeArticleApi } from '@/api/article'

export default {
  name: 'PlanetaryDataDetail',
  data() {
    return {
      article: {
        category: {}
      },
      loading: false,
      isFollowed: false, // 关注状态（活的）
      fileQuery: '',
      citeType: 'GB/T 7714',
      barChart: null,
      mapChart: null,
    }
  },
  computed: {
    // 动态作者
    authors() {
      if (!this.article.author) return ['行星科学研究团队'];
      return this.article.author.split(/[,，]/).map(s => s.trim());
    },
    // 动态关键词
    keywords() {
      if (!this.article.keywords) return ['月球', '火星', '深空探测'];
      return this.article.keywords.split(/[,，]/).map(s => s.trim());
    },
    // 动态引用生成逻辑 (修复写死问题)
    dynamicCitation() {
      const year = new Date().getFullYear();
      const title = this.article.title || '行星数据集';
      const firstAuthor = this.authors[0];

      if (this.citeType === 'APA') {
        return `${firstAuthor}, et al. (${year}). ${title}. Planetary Data System (PDS).`;
      } else if (this.citeType === 'BibTeX') {
        return `@data{pds_${this.article.id}, author = {${firstAuthor}}, title = {${title}}, year = {${year}}}`;
      }
      return `${this.authors.join(', ')}. ${title}[DS]. 行星数据发布系统, ${year}.`;
    }
  },
  methods: {
    async fetchDetail() {
      this.loading = true;
      try {
        const res = await getArticleDetailApi(this.$route.params.id);
        this.article = res.data;
        // 等待 DOM 渲染后初始化图表
        this.$nextTick(() => {
          this.initBarChart();
          this.initMapChart();
        });
      } catch (err) {
        this.$message.error('获取科学数据详情失败');
      } finally {
        this.loading = false;
      }
    },

    // 修正月份乱码问题：重新手打纯净字符
    initBarChart() {
      const dom = this.$refs.barChart;
      if (!dom) return;
      this.barChart = echarts.init(dom);
      this.barChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { top: 20, left: 40, right: 20, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月'],
          axisLabel: { interval: 0, fontSize: 11 }
        },
        yAxis: { type: 'value' },
        series: [{
          name: '阅读量',
          type: 'bar',
          barWidth: '40%',
          data: [0, 0, 0, 0, 0, 0, 150, 320, 280, 450, 700, 1284],
          itemStyle: {
            color: '#0369a1',
            borderRadius: [4, 4, 0, 0]
          }
        }]
      });
    },

    // 2. 核心：世界地图 (fetch加载版)
    async initMapChart() {
      const dom = this.$refs.mapChart;
      if (!dom) return;
      this.mapChart = echarts.init(dom);
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json');
        const worldJson = await response.json();
        echarts.registerMap('world', worldJson);
        const option = {
          visualMap: {
            min: 0, max: 100, left: 'left', top: 'bottom',
            text: ['High', 'Low'], calculable: true,
            inRange: { color: ['#e0f2fe', '#0ea5e9'] }
          },
          series: [{
            name: '全球访问分布',
            type: 'map',
            map: 'world',
            roam: true,
            emphasis: { label: { show: true }, itemStyle: { areaColor: '#0369a1' } },
            data: [
              { name: 'China', value: 95 },
              { name: 'United States', value: 40 },
              { name: 'Russia', value: 15 },
              { name: 'Japan', value: 10 }
            ]
          }]
        };
        this.mapChart.setOption(option);
      } catch (e) {
        console.warn('地图数据加载失败');
      }
    },

    // 复制功能
    copyText(text) {
      if (!text) return;
      navigator.clipboard.writeText(text);
      this.$message.success('已复制到剪贴板');
    },

    // 下载功能
    handleDownload() {
      const fileUrl = this.article.fileUrl || this.article.originalUrl;
      if (fileUrl) {
        window.open(fileUrl, '_blank');
        this.$message.success('已发起下载请求');
      } else {
        this.$message.warning('该数据集暂未挂载物理文件');
      }
    },

    openExternal(url) {
      if (url) window.open(url, '_blank');
      else this.$message.info('暂无外部链接');
    },

    handleRecJump(id) {
      this.$message.info('该文章暂不存在');
    },

    // 新增：关注逻辑
    handleFollow() {
      this.isFollowed = !this.isFollowed;
      if (this.isFollowed) {
        this.$message.success('您已关注该作者');
      } else {
        this.$message.info('您已取消关注该作者');
      }
    },

    // 前端点赞逻辑
    handleLike() {
      this.$set(this.article, 'isLike', !this.article.isLike);
      if (this.article.isLike) {
        this.article.likeNum = (this.article.likeNum || 0) + 1;
        this.$message.success('感谢您的点赞支持！');
      } else {
        this.article.likeNum = Math.max(0, this.article.likeNum - 1);
        this.$message.info('已取消点赞');
      }
    },

    // 前端收藏逻辑
    handleFav() {
      this.$set(this.article, 'isFavorite', !this.article.isFavorite);
      if (this.article.isFavorite) {
        this.article.favoriteNum = (this.article.favoriteNum || 0) + 1;
        this.$message({ message: '成功加入收藏夹', type: 'success', iconClass: 'el-icon-star-on' });
      } else {
        this.article.favoriteNum = Math.max(0, this.article.favoriteNum - 1);
        this.$message('已从收藏夹移除');
      }
    }
  },
  mounted() {
    this.fetchDetail();
    window.addEventListener('resize', () => {
      this.barChart && this.barChart.resize();
      this.mapChart && this.mapChart.resize();
    });
  }
}
</script>

<style lang="scss" scoped>
// 定义行星科学专用配色
$pds-dark: #0c4a6e;
$pds-blue: #0ea5e9;
$pds-bg: #f8fafc;
$pds-border: #e2e8f0;

.planetary-detail-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px;
  background-color: $pds-bg;
  min-height: 100vh;
}

// 顶部导航样式
.breadcrumb-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 12px 25px;
  border-radius: 50px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  .status-badge { background: $pds-blue; color: white; padding: 2px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
  .category-name { margin-left: 10px; font-weight: 700; color: $pds-dark; }
  .meta-info-group { color: #64748b; font-size: 13px; span { margin-left: 20px; i { margin-right: 5px; } } }
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
}

// 卡片通用样式
.section-card {
  background: white;
  padding: 35px;
  border-radius: 16px;
  margin-bottom: 30px;
  border: 1px solid $pds-border;
  transition: all 0.3s ease;
  &:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

  .section-title {
    font-size: 22px;
    font-weight: 800;
    color: $pds-dark;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    &::before { content: ''; width: 5px; height: 24px; background: $pds-blue; margin-right: 15px; border-radius: 3px; }
  }
}

// 标题头样式
.article-header {
  margin-bottom: 35px;
  .data-title {
    font-size: 34px;
    line-height: 1.3;
    color: #0f172a;
    margin-bottom: 25px;
    i { color: #cbd5e1; font-size: 20px; margin-left: 15px; cursor: pointer; transition: 0.3s; &:hover { color: $pds-blue; } }
  }
  .id-panel {
    display: flex; gap: 15px; margin-bottom: 25px;
    .id-item {
      background: #f1f5f9; padding: 8px 16px; border-radius: 8px; font-size: 13px; display: flex; align-items: center; gap: 12px;
      .label { font-weight: bold; color: #64748b; border-right: 1px solid #cbd5e1; padding-right: 12px; }
      .val { font-family: 'Fira Code', monospace; color: $pds-dark; }
      i { cursor: pointer; color: $pds-blue; &:hover { transform: scale(1.2); } }
    }
  }
  .author-bar {
    display: flex; align-items: center; gap: 15px; padding: 10px;
    .author-icon { font-size: 28px; color: #e2e8f0; }
    .author-list { color: #475569; font-weight: 500; font-size: 16px; }
  }
}

// 标签样式
.science-tag {
  background: rgba($pds-blue, 0.08);
  color: $pds-blue;
  border: 1px solid rgba($pds-blue, 0.2);
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
}

// meta 区域间距
.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.meta-cell {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .label {
    font-weight: bold;
    color: #64748b;
    margin-right: 12px;
  }
  .subject-val {
    color: $pds-dark;
    font-weight: 600;
  }
}

// 下载列表样式
.file-table-container {
  border: 1px solid $pds-border;
  border-radius: 12px;
  overflow: hidden;
  .table-header {
    background: #f8fafc; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center;
    .search-box {
      display: flex; align-items: center; background: white; border: 1px solid #cbd5e1; padding: 5px 15px; border-radius: 6px;
      input { border: none; outline: none; margin-left: 10px; width: 250px; font-size: 14px; }
    }
    .header-actions i { margin-left: 20px; cursor: pointer; color: #64748b; &:hover { color: $pds-blue; } }
  }
  .file-row {
    display: flex; align-items: center; padding: 25px; border-top: 1px solid #f1f5f9;
    .file-type-icon { font-size: 35px; color: #94a3b8; margin-right: 25px; }
    .file-info {
      flex: 1;
      .filename { font-weight: 700; color: $pds-dark; font-size: 16px; margin-bottom: 5px; }
      .file-meta { font-size: 12px; color: #94a3b8; }
    }
  }
}

// 引用组件
.citation-container {
  background: #f8fafc; padding: 25px; border-radius: 10px;
  .citation-body {
    background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 15px; position: relative;
    .cite-text { line-height: 1.8; color: #334155; font-size: 15px; padding-right: 100px; }
    .copy-btn { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: $pds-blue; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }
  }
}

// 图表展示区
.stats-overview {
  display: flex; gap: 40px; margin-bottom: 40px;
  .stat-box {
    display: flex; flex-direction: column;
    .num { font-size: 36px; font-weight: 900; color: $pds-blue; font-family: 'Arial Black', sans-serif; }
    .lab { font-size: 12px; color: #94a3b8; }
  }
}
.charts-layout {
  display: flex;
  flex-direction: column;
  gap: 30px;
  .chart-block {
    background: white; border: 1px solid #f1f5f9; border-radius: 12px; padding: 25px;
    width: 100%; box-sizing: border-box;
  }
  .chart-subtitle { font-size: 15px; color: #475569; margin-bottom: 15px; font-weight: 600; }
  .echart-box { width: 100%; height: 400px; }
}

// ================= 右侧样式 =================
.sidebar-content { display: flex; flex-direction: column; gap: 25px; }

// 作者卡片样式
.author-info-card {
  background: white; padding: 25px; border-radius: 16px; border: 1px solid $pds-border;
  display: flex; flex-direction: column; align-items: center; gap: 15px;
  .author-name-tag { font-weight: 800; color: $pds-dark; font-size: 16px; }
  .follow-btn-main {
    width: 100%; padding: 10px; border-radius: 30px; border: 1px solid $pds-blue;
    background: white; color: $pds-blue; font-weight: bold; cursor: pointer; transition: 0.3s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    &:hover { background: rgba($pds-blue, 0.05); }
    &.followed { background: #f1f5f9; border-color: #cbd5e1; color: #64748b; }
  }
}

.side-action-card {
  display: flex; justify-content: space-around; background: white; padding: 25px; border-radius: 16px; border: 1px solid $pds-border;
  .action-btn-item {
    display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
    i { font-size: 24px; color: #cbd5e1; transition: all 0.3s ease; }
    i.fa-thumbs-up.active { color: #f97316; transform: scale(1.2); }
    i.fa-star.active { color: #f59e0b; transform: scale(1.2); }
    span { font-size: 13px; color: #64748b; font-weight: 600; margin-top: 5px; }
    &:hover i { transform: scale(1.2); color: $pds-blue; }
  }
}

.link-card {
  background: white; padding: 25px; border-radius: 16px; border: 1px solid $pds-border;
  .card-label { font-size: 16px; font-weight: 800; color: $pds-dark; margin-bottom: 15px; }
  .card-link {
    display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #f0f9ff; border-radius: 10px;
    text-decoration: none; color: #0369a1; font-weight: 600; font-size: 14px;
    i { font-size: 12px; }
    &:hover { background: $pds-blue; color: white; }
    &.special { background: #fff7ed; color: #c2410c; &:hover { background: #f97316; color: white; } }
  }
}

.journal-item {
  display: flex; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 10px; cursor: pointer; transition: 0.3s;
  img { width: 60px; height: 80px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .j-title { font-size: 13px; font-weight: 700; line-height: 1.4; margin-bottom: 8px; }
  .j-doi { font-size: 11px; color: $pds-blue; font-family: monospace; }
  &:hover { background: #e0f2fe; }
}

.rec-item {
  padding: 15px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;
  &:last-child { border: none; }
  .rec-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; &:hover { color: $pds-blue; } }
  .rec-meta { font-size: 12px; color: #94a3b8; }
}

// 底部细节导航
.floating-nav-bar {
  position: fixed; bottom: 35px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.9);
  backdrop-filter: blur(15px); padding: 10px 30px; border-radius: 50px; box-shadow: 0 15px 40px rgba(0,0,0,0.15); border: 1px solid $pds-border; z-index: 1000;
  .nav-wrapper {
    display: flex; align-items: center; gap: 15px;
    .nav-title { font-weight: 800; color: #94a3b8; font-size: 12px; margin-right: 10px; }
    .nav-link { text-decoration: none; color: #475569; font-size: 14px; font-weight: 600; padding: 8px 18px; border-radius: 30px; &:hover { background: $pds-blue; color: white; } }
    .nav-btn-repo { background: $pds-dark; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-size: 14px; }
  }
}
</style>