<template>
  <div class="competition-detail">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <h1>{{ competitionInfo.competitionName }}</h1>
    </div>

    <div class="detail-content" v-if="competitionInfo.competitionId">
      <div class="base-info">
        <div class="info-item">
          <span>赛事类型：{{ competitionInfo.type }}</span>
          <span>主办方：{{ competitionInfo.publisherName }}</span>
          <span>报名时间：{{ competitionInfo.signUpStartTime }} ~ {{ competitionInfo.signUpEndTime }}</span>
          <span>比赛时间：{{ competitionInfo.competitionStartTime }} ~ {{ competitionInfo.competitionEndTime }}</span>
        </div>
        <div class="status-tag large" :class="competitionInfo.status === '报名中' ? 'active' : 'disabled'">
          {{ competitionInfo.status }}
        </div>
      </div>

      <div class="desc-box">
        <h3>赛事详情</h3>
        <p>{{ competitionInfo.description }}</p>
      </div>

      <div class="action-box">
        <button
            class="primary-btn"
            :disabled="competitionInfo.status !== '报名中'"
            @click="createTeam"
        >
          立即报名/创建团队
        </button>
      </div>
    </div>

    <div v-else class="loading-tip">加载中...</div>
  </div>
</template>

<script>
export default {
  name: 'CompetitionDetail',
  data() {
    return {
      competitionId: this.$route.params.id,
      competitionInfo: {}
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      try {
        const res = await this.$http.get('/competition/competition/detail', {
          params: { competitionId: this.competitionId }
        })
        if (res.data.code === 200) {
          this.competitionInfo = res.data.data
        }
      } catch (err) {
        console.error('获取赛事详情失败', err)
      }
    },
    createTeam() {
      // 跳转到团队创建页面，携带赛事ID
      this.$router.push({
        path: '/team',
        query: { competitionId: this.competitionId }
      })
    }
  }
}
</script>

<style scoped>
.competition-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
.base-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #666;
}
.status-tag.large {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}
.status-tag.active {
  background: #f0f9ff;
  color: #6F8FA8;
}
.status-tag.disabled {
  background: #f5f5f5;
  color: #999;
}
.desc-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}
.desc-box h3 {
  margin-bottom: 15px;
  font-size: 18px;
}
.action-box {
  text-align: center;
}
.primary-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 30px;
  font-size: 16px;
  cursor: pointer;
}
.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.loading-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
