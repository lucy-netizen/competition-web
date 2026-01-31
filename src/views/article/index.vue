<template>
  <div class="planetary-detail-page" v-loading="loading">
    <!-- 1. 顶部面包屑：隐藏了发布时间 -->
    <div class="breadcrumb-container">
      <div class="status-group">
        <span class="status-badge">公开数据集</span>
        <span class="divider">/</span>
        <span class="category-name" @click="$router.back()" style="cursor: pointer;">
          {{ article.categoryName || '行星科学数据' }}
        </span>
      </div>
      <div class="meta-info-group">
        <!-- <span class="pub-date"><i class="far fa-calendar-check"></i> 发布于 {{ article.createTime || '2026-01-27' }}</span> -->
        <span class="license-info"><i class="fab fa-creative-commons"></i> CC BY-NC-SA 4.0</span>
      </div>
    </div>

    <div class="content-layout">
      <!-- ================= 左侧主内容区 (学术核心) ================= -->
      <main class="main-content">
        <header class="article-header">
          <h1 class="data-title">
            {{ article.title }}
            <el-tooltip content="跳转至原始资源" placement="top">
              <i class="fas fa-external-link-alt" @click="openExternal(article.originalUrl || article.downloadUrl)"></i>
            </el-tooltip>
          </h1>

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
        </header>

        <!-- 1. 作者展示：完全复刻关键词标签逻辑 -->
        <section class="section-card">
          <div class="meta-grid">
            <div class="meta-cell">
              <span class="label">作者：</span>
              <div class="tag-wrap">
                <span v-for="auth in authors" :key="auth" class="science-tag">{{ auth }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. 数据摘要 -->
        <section id="description" class="section-card">
          <h2 class="section-title">数据摘要</h2>
          <div class="description-content">
            <div v-if="article.description" class="rich-text" v-html="article.description"></div>
            <div v-else class="placeholder-text">
              本数据集记录了行星探测任务中的关键科学观测数据。包含多光谱影像、雷达回波、以及化学元素反演结果。
              数据经过初级校正和精细化处理，可直接用于行星地质、大气环境及演化历史的研究。
            </div>
          </div>
        </section>

        <!-- 3. 关键词与分类：所属分类也完全同步标签逻辑，拆分为独立标签 -->
        <section class="section-card">
          <div class="meta-grid">
            <div class="meta-cell">
              <span class="label">关键词：</span>
              <div class="tag-wrap">
                <span v-for="tag in keywords" :key="tag" class="science-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="meta-cell">
              <span class="label">所属分类：</span>
              <div class="tag-wrap">
                <!-- 修改点 1：分类标签拆分渲染 -->
                <span v-for="cat in categories" :key="cat" class="science-tag category-style">{{ cat }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 数据实体下载 -->
        <section id="download" class="section-card">
          <h2 class="section-title">数据实体与下载</h2>
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
                <div class="file-type-icon">
                  <i class="fas fa-file-archive" style="color: #94a3b8; font-size: 35px;"></i>
                </div>
                <div class="file-info">
                  <div class="filename">{{ article.title || 'PDS_DATA_SET' }}</div>
                  <div class="file-meta">
                    <span class="size">科学数据包</span>
                    <span class="dot">·</span>
                    <span class="md5">状态: 已挂载本地节点</span>
                  </div>
                </div>
                <div class="file-actions">
                  <el-button type="primary" size="small" icon="el-icon-link" @click="handleDownload">
                    点击下载
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. 引用本数据 -->
        <section id="cite" class="section-card">
          <h2 class="section-title">引用本数据</h2>
          <div class="citation-container">
            <div class="citation-body">
              <p class="cite-text">{{ dynamicCitation }}</p>
              <button class="copy-btn" @click="copyText(dynamicCitation)">
                <i class="far fa-copy"></i> 复制引用
              </button>
            </div>
          </div>
        </section>

        <!-- 6. 数据统计 -->
        <section id="statistics" class="section-card">
          <h2 class="section-title">数据访问统计</h2>
          <div class="stats-overview">
            <div class="stat-box">
              <span class="num">{{ article.views || 0 }}</span>
              <span class="lab">总阅读次数</span>
            </div>
            <div class="stat-box">
              <span class="num">{{ article.downloads || 0 }}</span>
              <span class="lab">数据下载量</span>
            </div>
          </div>

          <div class="charts-layout">
            <!--
            <div class="chart-block">
              <h3 class="chart-subtitle">近一年访问趋势</h3>
              <div ref="barChart" class="echart-box"></div>
            </div>

            <div class="chart-block map-full-width">
              <h3 class="chart-subtitle">地理分布</h3>
              <div ref="mapChart" class="echart-box map-box"></div>
            </div>
            -->
          </div>
        </section>
      </main>

      <!-- ================= 右侧侧边栏 (链接卡片) ================= -->
      <aside class="sidebar-content">
        <div class="author-info-card">
          <div class="avatar-wrap">
            <el-avatar :size="70" :src="formatAvatar(article.authorAvatar || article.avatar)"></el-avatar>
          </div>
          <div class="author-name-tag">{{ article.nickname || authors[0] }}</div>
          <button class="follow-btn-main" :class="{ followed: article.isFollowed }" @click="handleFollow">
            <i :class="article.isFollowed ? 'el-icon-check' : 'el-icon-plus'"></i>
            {{ article.isFollowed ? '已关注' : '关注' }}
          </button>
        </div>

        <div class="side-action-card">
          <div class="action-btn-item" @click="handleLike">
            <i class="fas fa-thumbs-up" :class="{ active: article.isLike }"></i>
            <span>{{ article.likes || 0 }}</span>
          </div>
          <div class="action-btn-item" @click="handleFav">
            <i class="fas fa-star" :class="{ active: article.isFavorite }"></i>
            <span>{{ article.favorites || 0 }}</span>
          </div>
          <div class="action-btn-item" @click="$message.info('分享功能正在接入...')">
            <i class="fas fa-share-alt"></i>
            <span>分享</span>
          </div>
        </div>

        <div class="link-card">
          <h4 class="card-label">该数据集已被纳入</h4>
          <a href="https://moon.bao.ac.cn/" target="_blank" class="card-link special">
            中国探月工程科学数据中心 <i class="fas fa-link"></i>
          </a>
        </div>

        <!-- 修改点 2：关联论文布局去图片，统一格式 -->
        <div class="link-card journal-card">
          <h4 class="card-label">关联论文 / 补充</h4>
          <a @click="openExternal('https://igg.cas.cn/xwzx/yjcg/202201/t20220106_6334625.html')" class="card-link" style="cursor: pointer;">
            嫦娥五号着陆区月表物质成分分析报告 <i class="fas fa-link"></i>
          </a>
        </div>

        <div class="link-card recommend-card">
          <h4 class="card-label">推荐数据集</h4>
          <div v-for="(rec, index) in recommendations" :key="index" class="rec-item" @click="openExternal(rec.url)">
            <p class="rec-title">{{ rec.title }}</p>
            <p class="rec-meta">数据集; 科学研究; {{ rec.subject }}</p>
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
        <a href="javascript:void(0)" class="nav-link" @click="handleDownload">
          前往仓库
        </a>
      </div>
    </nav>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {
  getArticleDetailApi,
  likeArticleApi,
  favArticleApi,
  followUserApi,
  getDatasetDetailApi,
  downloadDatasetApi
} from '@/api/article'
import { getUserInfoApi } from '@/api/user'

export default {
  name: 'PlanetaryDataDetail',
  data() {
    return {
      article: {
        categoryName: '',
        views: 0,
        downloads: 0,
        likes: 0,
        favorites: 0,
        follows: 0
      },
      userInfo: {},
      loading: false,
      fileQuery: '',
      citeType: 'GB/T 7714',
      barChart: null,
      mapChart: null,
      recommendations: [
        { title: '国家空间科学数据中心 (NSSDC)', subject: '空间科学核心库', url: 'https://www.nssdc.ac.cn/' },
        { title: 'ESA PSA (欧洲航天局行星档案)', subject: 'ESA数据集', url: 'https://archives.esac.esa.int/psa/' },
        { title: 'JAXA DARTS (日本宇宙航空研究开发机构)', subject: '小行星探测数据', url: 'https://darts.isas.jaxa.jp/en/' },
        { title: 'Zenodo (Open Science 数据集)', subject: '开放科学资源', url: 'https://zenodo.org/' }
      ]
    }
  },
  computed: {
    authors() {
      const authStr = this.article.authors || this.article.author;
      if (!authStr) return ['空间科学中心'];
      return authStr.split(/[,，;；]/).map(s => s.trim()).filter(s => s);
    },
    keywords() {
      if (!this.article.keywords) return ['月球', '火星', '深空探测'];
      return this.article.keywords.split(/[,，]/).map(s => s.trim());
    },
    // ★ 核心逻辑：将分类字符串拆分为数组，用于标签平铺显示
    categories() {
      if (!this.article.categoryName) return ['通用行星科学'];
      return this.article.categoryName.split(/[,，;；]/).map(s => s.trim()).filter(s => s);
    },
    dynamicCitation() {
      const year = new Date().getFullYear();
      const title = this.article.title || '行星数据集';
      return `${this.authors.join(', ')}. ${title}[DS]. 行星数据发布系统, ${year}.`;
    }
  },
  methods: {
    formatAvatar(url) {
      if (!url) return 'https://img.shiyit.com/base/avatar.png';
      if (url.startsWith('http')) return url;
      return process.env.VUE_APP_BASE_API + url;
    },
    async fetchDetail() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        getUserInfoApi().then(res => {
          if (res.data && res.data.sysUser) this.userInfo = res.data.sysUser;
        }).catch(() => {});

        let res = await getDatasetDetailApi(id).catch(() => null);
        if (!res || !res.data) res = await getArticleDetailApi(id);

        const rawData = res.data;
        this.article = {
          ...rawData,
          views: rawData.views !== undefined ? rawData.views : (rawData.quantity || 0),
          downloads: rawData.downloads || 0,
          likes: rawData.likes || 0,
          favorites: rawData.favorites || 0,
          follows: rawData.follows || 0,
          authors: rawData.authors || rawData.author || '',
          categoryName: rawData.categoryName || rawData.tags || ''
        };

        this.$nextTick(() => {
          this.initBarChart();
          this.initMapChart();
        });
      } catch (err) {
        this.$message.error('数据加载失败');
      } finally {
        this.loading = false;
      }
    },

    initBarChart() {
      const dom = this.$refs.barChart;
      if (!dom) return;
      if (this.barChart) this.barChart.dispose();
      this.barChart = echarts.init(dom);
      this.barChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { top: 20, left: 40, right: 20, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['2月', '3月', '4', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月'],
          axisLabel: { interval: 0, fontSize: 11 }
        },
        yAxis: { type: 'value' },
        series: [{
          name: '阅读量',
          type: 'bar',
          barWidth: '40%',
          data: [0, 0, 0, 0, 0, 0, 150, 320, 280, 450, 700, this.article.views || 0],
          itemStyle: { color: '#0369a1', borderRadius: [4, 4, 0, 0] }
        }]
      });
    },

    async initMapChart() {
      const dom = this.$refs.mapChart;
      if (!dom) return;
      if (this.mapChart) this.mapChart.dispose();
      this.mapChart = echarts.init(dom);
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json');
        const worldJson = await response.json();
        echarts.registerMap('world', worldJson);
        this.mapChart.setOption({
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
        });
      } catch (e) { console.warn('地图加载失败'); }
    },

    copyText(text) {
      if (!text) return;
      navigator.clipboard.writeText(text);
      this.$message.success('已复制到剪贴板');
    },

    async handleDownload() {
      const id = this.$route.params.id;
      const path = this.article.downloadUrl || this.article.fileUrl;
      if (!path) return this.$message.warning('该数据集暂未挂载物理文件');

      try {
        await downloadDatasetApi(id);
        this.$set(this.article, 'downloads', (this.article.downloads || 0) + 1);
        const fullUrl = path.startsWith('http') ? path : process.env.VUE_APP_BASE_API + path;
        window.open(fullUrl, '_blank');
        this.$message.success('正在提取科学数据包...');
      } catch (err) { window.open(path, '_blank'); }
    },

    openExternal(url) {
      if (url) window.open(url, '_blank');
    },

    // ★ 修改点 3：补回被删掉的所有提示消息
    async handleFollow() {
      const id = this.$route.params.id;
      try {
        const res = await followUserApi(id);
        if (res.data === true) {
          this.$set(this.article, 'isFollowed', true);
          this.$set(this.article, 'follows', (this.article.follows || 0) + 1);
          this.$message.success('已关注作者');
        } else {
          this.$set(this.article, 'isFollowed', false);
          this.$set(this.article, 'follows', Math.max(0, (this.article.follows || 0) - 1));
          this.$message.info('已取消关注');
        }
      } catch (err) { this.$message.error('操作过快，请稍后再试'); }
    },

    async handleLike() {
      const id = this.$route.params.id;
      try {
        const res = await likeArticleApi(id);
        if (res.data === true) {
          this.$set(this.article, 'isLike', true);
          this.$set(this.article, 'likes', (this.article.likes || 0) + 1);
          this.$message.success('点赞成功');
        } else {
          this.$set(this.article, 'isLike', false);
          this.$set(this.article, 'likes', Math.max(0, (this.article.likes || 0) - 1));
          this.$message.info('已取消点赞');
        }
      } catch (err) { this.$message.error('操作过快，请稍后再试'); }
    },

    async handleFav() {
      const id = this.$route.params.id;
      try {
        const res = await favArticleApi(id);
        if (res.data === true) {
          this.$set(this.article, 'isFavorite', true);
          this.$set(this.article, 'favorites', (this.article.favorites || 0) + 1);
          this.$message.success('已加入收藏夹');
        } else {
          this.$set(this.article, 'isFavorite', false);
          this.$set(this.article, 'favorites', Math.max(0, (this.article.favorites || 0) - 1));
          this.$message.info('已从收藏夹移除');
        }
      } catch (err) { this.$message.error('操作过快，请稍后再试'); }
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
  .category-name { margin-left: 10px; font-weight: 700; color: $pds-dark; transition: 0.3s; &:hover { color: $pds-blue; } }
  .meta-info-group { color: #64748b; font-size: 13px; span { margin-left: 20px; i { margin-right: 5px; } } }
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
}

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
}

/* ★ 统一的科学标签样式 */
.tag-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
.science-tag {
  background: rgba($pds-blue, 0.08);
  color: $pds-blue;
  border: 1px solid rgba($pds-blue, 0.2);
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  &.category-style {
    background: rgba(#10b981, 0.08);
    color: #059669;
    border-color: rgba(#10b981, 0.2);
  }
}

.meta-grid { display: flex; flex-direction: column; gap: 22px; }
.meta-cell {
  display: flex; align-items: center; flex-wrap: wrap;
  .label { font-weight: bold; color: #64748b; margin-right: 12px; min-width: 80px; }
}

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
  .file-list {
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
}

.citation-container {
  background: #f8fafc; padding: 25px; border-radius: 10px;
  .citation-body {
    background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 15px; position: relative;
    .cite-text { line-height: 1.8; color: #334155; font-size: 15px; padding-right: 100px; }
    .copy-btn { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: $pds-blue; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }
  }
}

.stats-overview {
  display: flex; gap: 40px; margin-bottom: 40px;
  .stat-box {
    display: flex; flex-direction: column;
    .num { font-size: 36px; font-weight: 900; color: $pds-blue; font-family: 'Arial Black', sans-serif; }
    .lab { font-size: 12px; color: #94a3b8; }
  }
}
.charts-layout {
  display: flex; flex-direction: column; gap: 30px;
  .chart-block { background: white; border: 1px solid #f1f5f9; border-radius: 12px; padding: 25px; width: 100%; box-sizing: border-box; }
  .chart-subtitle { font-size: 15px; color: #475569; margin-bottom: 15px; font-weight: 600; }
  .echart-box { width: 100%; height: 400px; }
}

.sidebar-content { display: flex; flex-direction: column; gap: 25px; }
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

.rec-item {
  padding: 15px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;
  &:last-child { border: none; }
  .rec-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; &:hover { color: $pds-blue; } }
  .rec-meta { font-size: 12px; color: #94a3b8; }
}

.floating-nav-bar {
  position: fixed; bottom: 35px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.9);
  backdrop-filter: blur(15px); padding: 10px 30px; border-radius: 50px; box-shadow: 0 15px 40px rgba(0,0,0,0.15); border: 1px solid $pds-border; z-index: 1000;
  .nav-wrapper {
    display: flex; align-items: center; gap: 15px;
    .nav-title { font-weight: 800; color: #94a3b8; font-size: 12px; margin-right: 10px; }
    .nav-link { text-decoration: none; color: #475569; font-size: 14px; font-weight: 600; padding: 8px 18px; border-radius: 30px; &:hover { background: $pds-blue; color: white; } }
  }
}
</style>