<template>
  <div class="dataset-list">
    <el-row :gutter="20">
      <el-col :span="24" v-for="item in datasetList" :key="item.id">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ item.title }}</span>
<!--              <el-tag type="primary" size="small">相似度  {{ item.similarity }}%</el-tag>-->
            </div>
          </template>

          <!-- 改为左右布局 -->
          <el-row :gutter="16">
            <!-- 左边图片 -->
            <el-col :span="8">
              <img :src="item.thumbnailUrl" class="thumbnail" />
            </el-col>
            <!-- 右边数据 -->
            <el-col :span="16">
              <div class="desc">{{ item.description }}</div>
              <div class="meta">
                <div>CSTR: {{ item.cstr }}</div>
                <div>DOI: {{ item.doi }}</div>
              </div>
              <!-- 下载按钮，使用click事件实现直接下载 -->
              <el-button
                  type="primary"
                  size="small"
                  style="margin-top:10px"
                  @click="downloadFile(item)"
                  :disabled="!item.downloadUrl"
              >
                下载数据
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i>
      <span>加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <span>数据加载失败: {{ error }}</span>
    </div>

    <!-- 空数据状态 -->
    <div v-if="!loading && !error && datasetList.length === 0" class="empty-container">
      <i class="fas fa-file-alt"></i>
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
import { getDatasetsApi } from '@/api/dataset'

export default {
  components: {
  },
  data() {
    return {
      datasetList: [],
      loading: false,
      error: ''
    }
  },
  mounted() {
    this.getDatasetList()
  },
  methods: {
    async getDatasetList() {
      this.loading = true
      this.error = ''

      try {
        // 使用真实API请求
        const res = await getDatasetsApi()
        this.datasetList = res.data
      } catch (err) {
        this.error = err.message || '未知错误'
        console.error('数据加载失败:', err)
      } finally {
        this.loading = false
      }
    },
    // 直接下载文件的方法
    downloadFile(item) {
      if (!item.downloadUrl) return

      // 创建一个临时的a标签
      const link = document.createElement('a')
      // 设置下载属性，指定文件名（如果需要）
      link.download = item.title || 'dataset'
      // 设置链接地址
      link.href = item.downloadUrl
      // 模拟点击
      document.body.appendChild(link)
      link.click()
      // 清理
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.dataset-list {
  padding: 20px;
}

/* 调整图片样式 */
.thumbnail {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
}

.desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.meta {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #999;
}

.loading-container i,
.error-container i,
.empty-container i {
  margin-right: 10px;
  font-size: 20px;
}

/* 为加载图标添加旋转动画 */
.loading-container i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>