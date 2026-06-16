<template>
  <div class="admin-competition-page">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <button class="primary-btn" @click="showPublishModal = true">发布新赛事</button>
    </div>

    <div class="table-box">
      <table class="admin-table">
        <thead>
        <tr>
          <th>赛事名称</th>
          <th>赛事类型</th>
          <th>报名时间</th>
          <th>比赛时间</th>
          <th>状态</th>
          <th v-if="!isTeacher">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in competitionList" :key="item.competitionId">
          <td>{{ item.competitionName || item.title || item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.signUpStartTime || item.registrationTime || item.regEndTime || '-' }} ~ {{ item.signUpEndTime || item.regEndTime || '-' }}</td>
          <td>{{ item.competitionStartTime || '-' }} ~ {{ item.competitionEndTime || item.competitionTime || item.submitEndTime || '-' }}</td>
          <td>
              <span class="status-tag" :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
          </td>
          <td class="action-cell" v-if="!isTeacher">
            <button class="text-btn" @click="auditCompetition(item.competitionId, '已通过')" v-if="item.status === '未审核'">
              通过
            </button>
            <button class="text-btn danger" @click="auditCompetition(item.competitionId, '已驳回')" v-if="item.status === '未审核'">
              驳回
            </button>
            <button class="text-btn" @click="updateStatus(item.competitionId, item.status === '报名中' ? '已结束' : '报名中')">
              {{ item.status === '报名中' ? '结束' : '上架' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 发布赛事弹窗 -->
    <div class="modal-mask" v-if="showPublishModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h3>发布新赛事</h3>
          <i class="fas fa-times close-icon" @click="showPublishModal = false"></i>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label>赛事名称 <span class="required">*</span></label>
              <input type="text" v-model="publishForm.competitionName" placeholder="请输入赛事名称">
            </div>
            <div class="form-item">
              <label>赛事类型 <span class="required">*</span></label>
              <select v-model="publishForm.type">
                <option value="学科竞赛">学科竞赛</option>
                <option value="创新创业大赛">创新创业大赛</option>
                <option value="技能竞赛">技能竞赛</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>报名开始时间</label>
              <input type="date" v-model="publishForm.signUpStartTime">
            </div>
            <div class="form-item">
              <label>报名结束时间</label>
              <input type="date" v-model="publishForm.signUpEndTime">
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>比赛开始时间</label>
              <input type="date" v-model="publishForm.competitionStartTime">
            </div>
            <div class="form-item">
              <label>比赛结束时间</label>
              <input type="date" v-model="publishForm.competitionEndTime">
            </div>
          </div>
          <div class="form-item">
            <label>赛事详情</label>
            <textarea v-model="publishForm.description" rows="5" placeholder="请输入赛事详情、参赛要求、奖项设置等"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showPublishModal = false">取消</button>
          <button class="confirm-btn" @click="publishCompetition">确认发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime, getCurrentUserId, getResponseData, isSuccess } from '@/utils/competition'

export default {
  name: 'AdminCompetition',
  data() {
    return {
      competitionList: [],
      showPublishModal: false,
      publishForm: {
        competitionName: '',
        type: '学科竞赛',
        signUpStartTime: '',
        signUpEndTime: '',
        competitionStartTime: '',
        competitionEndTime: '',
        description: '',
        publisherId: 1
      }
    }
  },
  created() {
    this.getCompetitionList()
  },
  computed: {
    currentRole() {
      return this.$store.state.userInfo?.role
    },
    isTeacher() {
      return ['teacher', '教师'].includes(this.currentRole)
    },
    pageTitle() {
      return this.isTeacher ? '赛事发布' : '赛事管理'
    }
  },
  methods: {
    async getCompetitionList() {
      try {
        const res = await this.$http.get('/competition/competition/list/all')
        this.competitionList = getResponseData(res, [])
      } catch (err) {
        console.error('获取赛事列表失败', err)
      }
    },
    async auditCompetition(id, status) {
      try {
        const res = await this.$http.post('/competition/competition/audit', null, {
          params: { competitionId: id, status }
        })
        if (isSuccess(res)) {
          alert('操作成功')
          this.getCompetitionList()
        }
      } catch (err) {
        console.error('审核失败', err)
      }
    },
    async updateStatus(id, status) {
      try {
        const res = await this.$http.post('/competition/competition/update-status', null, {
          params: { competitionId: id, status }
        })
        if (isSuccess(res)) {
          alert('操作成功')
          this.getCompetitionList()
        }
      } catch (err) {
        console.error('状态更新失败', err)
      }
    },
    async publishCompetition() {
      if (!this.publishForm.competitionName) {
        alert('请填写赛事名称')
        return
      }
      try {
        const payload = this.buildPublishPayload()
        const res = await this.$http.post('/competition/publish', payload)
        if (isSuccess(res)) {
          alert('发布成功')
          this.showPublishModal = false
          this.resetPublishForm()
          this.getCompetitionList()
        } else {
          alert(res.message || '发布失败')
        }
      } catch (err) {
        console.error('发布失败', err)
        alert(err.response?.data?.message || err.message || '发布失败，请检查接口')
      }
    },
    buildPublishPayload() {
      return {
        ...this.publishForm,
        title: this.publishForm.competitionName,
        name: this.publishForm.competitionName,
        content: this.publishForm.description,
        regEndTime: formatDateTime(this.publishForm.signUpEndTime) || undefined,
        submitEndTime: formatDateTime(this.publishForm.competitionEndTime) || undefined,
        publisherId: getCurrentUserId(1),
        status: this.publishForm.status || '未审核',
        level: this.publishForm.level || '校级'
      }
    },
    resetPublishForm() {
      this.publishForm = {
        competitionName: '',
        type: '学科竞赛',
        signUpStartTime: '',
        signUpEndTime: '',
        competitionStartTime: '',
        competitionEndTime: '',
        description: '',
        publisherId: getCurrentUserId(1)
      }
    },
    getStatusClass(status) {
      const map = {
        '未审核': 'warning',
        '报名中': 'success',
        '已结束': 'default',
        '已驳回': 'danger'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.admin-competition-page {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.primary-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
.table-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
}
.admin-table thead {
  background: #fafafa;
}
.admin-table th,
.admin-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
}
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-tag.warning { background: #fff8e4; color: #9f7b2f; }
.status-tag.success { background: #eef8f2; color: #4f8d72; }
.status-tag.default { background: #f5f5f5; color: #999; }
.status-tag.danger { background: #fbefed; color: #b77a71; }
.action-cell {
  display: flex;
  gap: 10px;
}
.text-btn {
  background: none;
  border: none;
  color: #6F8FA8;
  cursor: pointer;
  padding: 0;
}
.text-btn.danger {
  color: #b77a71;
}
/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}
.modal-content.large {
  width: 800px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}
.close-icon {
  cursor: pointer;
  color: #999;
}
.modal-body {
  padding: 20px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}
.form-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-item label {
  font-size: 14px;
  color: #333;
}
.required {
  color: #b77a71;
}
.form-item input,
.form-item select,
.form-item textarea {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e8e8e8;
}
.cancel-btn {
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
}
.confirm-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
