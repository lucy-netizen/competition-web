<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 若项目有Element Plus/全局消息提示可直接用，无则用原生alert兼容
// 推荐项目有UI库的话，替换为ElMessage/this.$message，体验更好

const router = useRouter()

// 页面核心数据：月球与行星 + 6个数据挖掘工具（可直接修改工具名称/描述/图片）
const pageData = ref({
  title: '月球与行星',
  englishTitle: 'Moon & Planets',
  description: '整合行星探测数据处理工具，提供图像融合、光谱反演、数据可视化等专业分析能力，助力行星科学研究。'
})

// 数据检索工具列表（可根据实际需求增删/修改）
const toolList = ref([
  {
    id: 1,
    name: '行星探测图像超分和融合',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool1.jpg', // 图片建议放在src/assets/images下，直接用此路径
    intro: '对行星遥感图像进行超分辨率增强与多源数据融合，提升图像细节表现力。',
    zipName: '行星图像超分融合工具_V1.0.zip' // 模拟下载的压缩包名称
  },
  {
    id: 2,
    name: '基于可见近红外光谱的月火物质成分反演',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool2.jpg',
    intro: '利用光谱数据反演行星表面物质成分，支持月球与火星多区域数据解析。',
    zipName: '月火物质成分反演工具_V1.0.zip'
  },
  {
    id: 3,
    name: '月火次表层结构微波雷达分析',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool3.jpg',
    intro: '通过微波与雷达数据解析行星次表层结构，实现地下层理与物质分布探测。',
    zipName: '月火次表层分析工具_V1.0.zip'
  },
  {
    id: 4,
    name: '行星数据三维可视化工具',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool4.jpg',
    intro: '将行星多源数据转换为三维模型，支持交互式视角查看与参数调整。',
    zipName: '行星数据三维可视化工具_V1.0.zip'
  },
  {
    id: 5,
    name: '火星风场流线动态可视化',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool5.jpg',
    intro: '可视化火星大气风场分布，支持时间序列动态演示与风速参数标注。',
    zipName: '火星风场可视化工具_V1.0.zip'
  },
  {
    id: 6,
    name: '月火形貌特征自动识别与定年',
    version: 'V1.0',
    releaseDate: '2025/07/26',
    imageUrl: '/assets/images/tool6.jpg',
    intro: '自动识别行星表面撞击坑、山脊等形貌特征，并完成地质年代定年分析。',
    zipName: '月火形貌识别定年工具_V1.0.zip'
  }
])

// 查看详情：路由跳转（复用配置的/utility路由，若后续加详情页可直接修改path）
const goToDetail = (tool) => {
  // 目前先跳转到自身页面+提示，后续可修改为path: '/utility-1/detail/' + tool.id
  router.push({
    path: '/utility-1',
    query: { toolId: tool.id, toolName: tool.name } // 携带工具参数，方便后续扩展详情页
  })
  // 模拟详情页跳转提示
  alert(`已进入【${tool.name}】详情页，后续可在此开发工具详情内容！`)
}

// 下载按钮：装饰性+模拟压缩包下载提示（无实际接口，仅前端展示效果）
const mockDownload = (tool, e) => {
  e.stopPropagation() // 阻止冒泡，避免触发卡片的「查看详情」
  // 模拟下载提示，还原压缩包下载的真实体验
  const tip = `✅ 【${tool.zipName}】\n压缩包开始下载！\n文件大小：约286MB\n预计下载时间：10-30秒`
  alert(tip)
  // 若项目有Element Plus，替换为以下代码（注释掉上面的alert即可）
  // ElMessage.success(`【${tool.zipName}】压缩包已开始下载，请注意查收！`)
}
</script>

<template>
  <div class="utility-page">
    <!-- 页面标题区域：月球与行星 -->
    <div class="page-header">
      <h1 class="main-title">{{ pageData.title }}</h1>
      <h2 class="sub-title">{{ pageData.englishTitle }}</h2>
      <div class="title-line"></div>
      <p class="page-desc">{{ pageData.description }}</p>
    </div>

    <!-- 工具卡片核心区域：网格布局+悬停放大 -->
    <div class="tool-card-container">
      <div
          class="tool-card"
          v-for="tool in toolList"
          :key="tool.id"
          @click="goToDetail(tool)"
      >
        <!-- 工具图片：鼠标悬停放大 -->
        <div class="tool-img-box">
          <img
              :src="tool.imageUrl"
              :alt="tool.name"
              class="tool-img"
              title="点击查看工具详情"
          />
        </div>
        <!-- 工具信息 -->
        <div class="tool-info-box">
          <h3 class="tool-name">{{ tool.name }}</h3>
          <div class="tool-meta">
            <span class="version">版本：{{ tool.version }}</span>
            <span class="date">发布：{{ tool.releaseDate }}</span>
          </div>
          <p class="tool-intro">{{ tool.intro }}</p>
          <!-- 操作按钮：查看详情 + 装饰性下载 -->
          <div class="tool-btn-group">
            <button class="btn detail-btn" @click="goToDetail(tool)">查看详情</button>
            <button class="btn download-btn" @click="mockDownload(tool, $event)">下载工具</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
/* 全局页面样式：适配项目整体布局，无外依赖 */
.utility-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: "Microsoft YaHei", "Segoe UI", sans-serif;
  color: #333;
  background-color: #f8f9fa;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}
.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 10px;
  letter-spacing: 2px;
}
.sub-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #4a5568;
  margin: 0 0 15px;
  font-style: italic;
}
.title-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, #4299e1, #38b2ac);
  margin: 0 auto 20px;
  border-radius: 3px;
}
.page-desc {
  font-size: 1.2rem;
  color: #666;
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.8;
}

/* 工具卡片容器：自适应网格布局，适配电脑/平板 */
.tool-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

/* 工具卡片样式：悬浮抬升 */
.tool-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}
.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

/* 工具图片：悬停放大核心效果，固定比例避免变形 */
.tool-img-box {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}
.tool-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-in-out;
}
.tool-card:hover .tool-img {
  transform: scale(1.1); /* 鼠标悬停图片放大1.1倍，效果自然不夸张 */
}

/* 工具信息区域：内边距适配，文字排版舒适 */
.tool-info-box {
  padding: 20px;
}
.tool-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 10px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tool-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.tool-intro {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  margin: 0 0 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 按钮组：查看详情+下载，样式区分明显 */
.tool-btn-group {
  display: flex;
  gap: 10px;
}
.btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
.detail-btn {
  background-color: #f0f7ff;
  color: #4299e1;
  border-color: #4299e1;
}
.detail-btn:hover {
  background-color: #e1f0ff;
}
.download-btn {
  background-color: #38b2ac;
  color: #fff;
}
.download-btn:hover {
  background-color: #319795;
}

/* 响应式适配：手机端单列显示，适配各种设备 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.2rem;
  }
  .sub-title {
    font-size: 1.3rem;
  }
  .tool-card-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .tool-img-box {
    height: 160px;
  }
}
@media (max-width: 480px) {
  .utility-page {
    padding: 20px 15px;
  }
  .main-title {
    font-size: 1.8rem;
  }
  .tool-btn-group {
    flex-direction: column;
  }
}
</style>