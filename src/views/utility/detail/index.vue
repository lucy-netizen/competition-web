<template>
  <div class="tool-detail-page">
    <div class="breadcrumb">
      <router-link to="/utility">数据检索工具</router-link>
      <span> / </span>
      <span>{{ toolInfo.name }}</span>
    </div>

    <div class="detail-content">
      <h1 class="tool-title">{{ toolInfo.name }}</h1>
      <div class="tool-version">版本：V1.0</div>

      <div class="tool-img-container">
        <img
            :src="require(`@/assets/toolImgs/${toolInfo.imageName}`)"
            :alt="toolInfo.name"
            class="tool-detail-img"
        />
      </div>

      <div class="tool-desc-container">
        <h3>工具介绍</h3>
        <p class="tool-detail-desc">{{ toolInfo.detailIntro }}</p>
      </div>

      <div class="download-container">
        <a
            href="javascript:;"
            @click="virtualDownload"
            class="download-btn"
        >
          <i class="fas fa-download"></i>
          点击下载工具
        </a>
        <p class="download-tip">提示：点击后将在新窗口下载工具压缩包</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolDetail',
  data() {
    return {
      toolInfo: {
        name: '工具详情',
        imageName: 'tool1.png',
        detailIntro: '暂无工具介绍',
        downloadUrl: 'test.zip'
      }
    }
  },
  created() {
    this.getToolInfoFromQuery()
  },
  watch: {
    $route() {
      this.getToolInfoFromQuery()
    }
  },
  methods: {
    getToolInfoFromQuery() {
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
    // 虚拟下载核心方法：模拟下载压缩包到本地
    virtualDownload() {
      const a = document.createElement('a')
      a.href = require(`@/assets/toolImgs/${this.toolInfo.downloadUrl}`)
      a.download = `${this.toolInfo.name}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      alert(`《${this.toolInfo.name}》工具包下载成功！已保存至本地默认下载路径～`)
    }
  }
}
</script>

<style scoped lang="css">
.tool-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Microsoft YaHei", "Segoe UI", sans-serif;
  color: #333;
  background-color: #f8f9fa;
  min-height: 80vh;
}
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
.detail-content {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.tool-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  text-align: center;
  margin: 0 0 10px;
}
.tool-version {
  text-align: center;
  color: #999;
  font-size: 1rem;
  margin: 0 0 30px;
}
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
}
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