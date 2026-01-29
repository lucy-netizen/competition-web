<template>
  <div class="dataset-list">
    <el-row :gutter="20">
      <el-col :span="24" v-for="item in datasetList" :key="item.id">
        <!-- 重点：点击整个卡片跳转，并应用丝滑位移样式 -->
        <el-card shadow="hover" class="clickable-card" @click.native="goToDetail(item.id)">
          <template #header>
            <div class="card-header">
              <span>{{ item.title }}</span>
              <el-tag type="primary" size="small">相似度 {{ item.similarity }}%</el-tag>
            </div>
          </template>

          <!-- 改为左右布局 -->
          <el-row :gutter="16">
            <!-- 左边图片 -->
            <el-col :span="8">
              <!-- 兼容数据库字段 thumbnail_url -->
              <img :src="item.thumbnailUrl || item.thumbnail_url" class="thumbnail" />
            </el-col>
            <!-- 右边数据 -->
            <el-col :span="16">
              <div class="desc">{{ item.description }}</div>
              <div class="meta">
                <div>CSTR: {{ item.cstr }}</div>
                <div>DOI: {{ item.doi }}</div>
              </div>
              <!-- 下载按钮：使用 .stop 阻止冒泡，防止触发卡片点击跳转 -->
              <el-button
                  type="primary"
                  size="small"
                  style="margin-top:10px"
                  @click.stop="downloadFile(item)"
                  :disabled="!item.downloadUrl && !item.download_url"
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
    // 跳转详情页
    goToDetail(id) {
      this.$router.push(`/post/${id}`)
    },
    async getDatasetList() {
      this.loading = true
      this.error = ''

      try {
        const res = await getDatasetsApi()
        this.datasetList = res.data
      } catch (err) {
        this.error = err.message || '未知错误'
        console.error('数据加载失败:', err)
      } finally {
        this.loading = false
      }
    },
    downloadFile(item) {
      const url = item.downloadUrl || item.download_url;
      if (!url) return;

      const link = document.createElement('a')
      link.download = item.title || 'dataset'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.dataset-list {
  padding: 20px;
}

/* 整个卡片的点击样式与位移效果 */
.clickable-card {
  cursor: pointer;
  transition: all 0.3s ease !important;
}

.clickable-card:hover {
  transform: translateX(10px);
  border-color: #409EFF;
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

.loading-container i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>