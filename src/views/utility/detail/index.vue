<template>
  <div class="tool-detail-page">
    <!-- 面包屑导航 - 可返回工具初始页 -->
    <div class="breadcrumb">
      <router-link to="/utility">数据检索工具</router-link>
      <span> / </span>
      <span>{{ toolInfo.name }}</span>
    </div>

    <!-- 详情核心内容 -->
    <div class="detail-content">
      <!-- 工具标题 + 版本 -->
      <h1 class="tool-title">{{ toolInfo.name }}</h1>
      <div class="tool-version">版本：V1.0</div>

      <!-- 工具图片（调用方法获取路径） -->
      <div class="tool-img-container">
        <img
            :src="getImageUrl(toolInfo.imageName)"
            :alt="toolInfo.name"
            class="tool-detail-img"
            title="工具详情图"
        />
      </div>

      <!-- 工具完整介绍 -->
      <div class="tool-desc-container">
        <h3>工具介绍</h3>
        <p class="tool-detail-desc">{{ toolInfo.detailIntro }}</p>
      </div>

      <!-- 虚拟下载按钮 - 详情页专属下载功能 -->
      <div class="download-container">
        <button class="download-btn" @click="virtualDownload">
          <i class="fas fa-download"></i> 点击下载工具
        </button>
        <p class="download-tip">提示：点击后将下载工具压缩包到本地</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolDetail',
  data() {
    return {
      // 工具详情默认值，后续由路由参数赋值
      toolInfo: {
        name: '工具详情',
        imageName: 'tool1.png',
        detailIntro: '暂无工具介绍',
        downloadUrl: 'test.zip'
      }
    }
  },
  // 页面创建时获取路由参数
  created() {
    this.getToolParams()
  },
  // 监听路由变化，防止同页面跳转参数不更新
  watch: {
    $route() {
      this.getToolParams()
    }
  },
  methods: {
    // 封装图片/压缩包路径获取方法，避开Vue2模板new关键字限制
    getImageUrl(fileName) {
      return new URL(`./src/assets/toolimgs/${fileName}`, import.meta.url).href
    },
    // 获取路由传递的工具参数
    getToolParams() {
      const query = this.$route.query
      if (query) {
        this.toolInfo = {
          ...this.toolInfo,
          name: query.name || this.toolInfo.name,
          imageName: query.imageName || this.toolInfo.imageName,
          detailIntro: query.detailIntro || this.toolInfo.detailIntro,
          downloadUrl: query.downloadUrl || this.toolInfo.downloadUrl
        }
      }
    },
    // 虚拟下载核心方法 - 模拟下载压缩包到本地
    virtualDownload() {
      // 创建a标签实现下载
      const downloadLink = document.createElement('a')
      // 设置下载文件路径（调用封装方法获取test.zip路径）
      downloadLink.href = this.getImageUrl(this.toolInfo.downloadUrl)
      // 设置下载后的文件名（工具名+zip）
      downloadLink.download = `${this.toolInfo.name}.zip`
      // 触发点击下载
      document.body.appendChild(downloadLink)
      downloadLink.click()
      // 移除临时a标签
      document.body.removeChild(downloadLink)
      // 下载成功提示
      alert(`《${this.toolInfo.name}》工具压缩包已成功下载到本地！`)
    }
  }
}
</script>

<style scoped>
/* 页面整体样式 */
.tool-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Microsoft YaHei", "Segoe UI", sans-serif;
  color: #333;
  background-color: #f8f9fa;
  min-height: 80vh;
}
/* 面包屑导航 */
.breadcrumb {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 20px;
}
.breadcrumb a {
  color: #4299e1;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
/* 详情内容容器 */
.detail-content {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
/* 工具标题 */
.tool-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  text-align: center;
  margin: 0 0 10px;
}
/* 工具版本 */
.tool-version {
  text-align: center;
  color: #999;
  font-size: 1rem;
  margin: 0 0 30px;
}
/* 工具图片容器 */
.tool-img-container {
  text-align: center;
  margin: 0 0 40px;
}
.tool-detail-img {
  max-width: 100%;
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}
/* 工具介绍区域 */
.tool-desc-container {
  margin: 0 0 40px;
}
.tool-desc-container h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 15px;
  padding-left: 10px;
  border-left: 4px solid #4299e1;
}
.tool-detail-desc {
  font-size: 1.1rem;
  line-height: 2;
  color: #555;
  text-align: justify;
  white-space: pre-line; /* 解析介绍中的换行符，让文字排版更清晰 */
}
/* 下载按钮区域 */
.download-container {
  text-align: center;
  margin-top: 50px;
}
.download-btn {
  display: inline-block;
  padding: 15px 40px;
  background: linear-gradient(135deg, #4299e1, #38b2ac);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  border: none;
  cursor: pointer;
}
.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(66, 153, 225, 0.4);
}
.download-tip {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #999;
}
/* 自适应媒体查询 */
@media (max-width: 768px) {
  .detail-content {
    padding: 20px;
  }
  .tool-title {
    font-size: 1.6rem;
  }
  .tool-detail-img {
    max-height: 400px;
  }
  .tool-detail-desc {
    font-size: 1rem;
    line-height: 1.8;
  }
  .download-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
@media (max-width: 480px) {
  .tool-detail-page {
    padding: 20px 15px;
  }
  .tool-detail-img {
    max-height: 300px;
  }
}
</style>