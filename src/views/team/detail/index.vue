<template>
  <div class="team-detail">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <h1>{{ teamInfo.teamName }}</h1>
    </div>

    <div class="detail-content" v-if="teamInfo.teamId">
      <div class="base-info">
        <div class="info-item">
          <p><span>参赛赛事：</span>{{ teamInfo.competitionName }}</p>
          <p><span>团队状态：</span>{{ teamInfo.status }}</p>
          <p><span>队长：</span>{{ teamInfo.leaderName }}</p>
          <p><span>指导老师：</span>{{ teamInfo.guideTeacherName || '暂未绑定' }}</p>
        </div>
      </div>

      <div class="desc-box">
        <h3>团队介绍</h3>
        <p>{{ teamInfo.description }}</p>
      </div>

      <div class="member-box">
        <h3>团队成员</h3>
        <div class="member-list">
          <div
              v-for="member in memberList"
              :key="member.recordId"
              class="member-item"
          >
            <span>{{ member.realName || member.username }}</span>
            <span class="role-tag">{{ member.role === 'leader' ? '队长' : '成员' }}</span>
            <span class="status-tag" :class="member.joinStatus === '已加入' ? 'success' : 'warning'">
              {{ member.joinStatus }}
            </span>
          </div>
        </div>
      </div>

      <div class="action-box">
        <button class="primary-btn" @click="goToProject">查看参赛项目</button>
        <button class="default-btn">邀请成员加入</button>
        <button class="default-btn">绑定指导老师</button>
      </div>
    </div>

    <div v-else class="loading-tip">加载中...</div>
  </div>
</template>

<script>
export default {
  name: 'TeamDetail',
  data() {
    return {
      teamId: this.$route.params.id,
      teamInfo: {},
      memberList: []
    }
  },
  created() {
    this.getTeamDetail()
    this.getMemberList()
  },
  methods: {
    async getTeamDetail() {
      try {
        const res = await this.$http.get('/competition/team/detail', {
          params: { teamId: this.teamId }
        })
        if (res.data.code === 200) {
          this.teamInfo = res.data.data
        }
      } catch (err) {
        console.error('获取团队详情失败', err)
      }
    },
    async getMemberList() {
      try {
        const res = await this.$http.get('/competition/team-member/list/by-team', {
          params: { teamId: this.teamId }
        })
        if (res.data.code === 200) {
          this.memberList = res.data.data
        }
      } catch (err) {
        console.error('获取成员列表失败', err)
      }
    },
    goToProject() {
      this.$router.push({
        path: '/project',
        query: { teamId: this.teamId }
      })
    }
  }
}
</script>

<style scoped>
.team-detail {
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
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
}
.info-item p {
  margin: 8px 0;
  font-size: 14px;
}
.info-item span {
  color: #666;
  margin-right: 6px;
}
.desc-box, .member-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.desc-box h3, .member-box h3 {
  margin-bottom: 15px;
  font-size: 18px;
}
.member-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fafafa;
  border-radius: 4px;
}
.role-tag {
  background: #e6f7ff;
  color: #6F8FA8;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-tag.success {
  background: #f6ffed;
  color: #4f8d72;
}
.status-tag.warning {
  background: #fff7e6;
  color: #9f7b2f;
}
.action-box {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}
.primary-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
}
.default-btn {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
}
.loading-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
