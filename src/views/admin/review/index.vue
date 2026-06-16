<template>
  <div class="admin-review-page">
    <div class="page-header">
      <h1>作品评审管理</h1>
    </div>

    <div class="table-box">
      <table class="admin-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>参赛团队</th>
          <th>参赛赛事</th>
          <th>最新版本</th>
          <th>提交时间</th>
          <th>评审状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in submissionList" :key="item.submissionId">
          <td>{{ item.projectName }}</td>
          <td>{{ item.teamName }}</td>
          <td>{{ item.competitionName }}</td>
          <td>{{ item.version }}</td>
          <td>{{ item.createTime }}</td>
          <td>
              <span class="status-tag" :class="item.reviewStatus === '已评审' ? 'success' : 'warning'">
                {{ item.reviewStatus || '待评审' }}
              </span>
          </td>
          <td class="action-cell">
            <a :href="item.fileUrl" target="_blank" class="text-btn">下载作品</a>
            <button class="text-btn" @click="openReviewDialog(item)">评审</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 评审弹窗 -->
    <div class="modal-mask" v-if="showReviewDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>作品评审</h3>
          <i class="fas fa-times close-icon" @click="showReviewDialog = false"></i>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>最终得分 <span class="required">*</span></label>
            <input type="number" v-model="reviewForm.score" placeholder="请输入0-100分" min="0" max="100">
          </div>
          <div class="form-item">
            <label>获奖等级</label>
            <select v-model="reviewForm.awardLevel">
              <option value="">请选择</option>
              <option value="一等奖">一等奖</option>
              <option value="二等奖">二等奖</option>
              <option value="三等奖">三等奖</option>
              <option value="优秀奖">优秀奖</option>
              <option value="未获奖">未获奖</option>
            </select>
          </div>
          <div class="form-item">
            <label>评审意见</label>
            <textarea v-model="reviewForm.reviewComment" rows="4" placeholder="请输入评审意见"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showReviewDialog = false">取消</button>
          <button class="confirm-btn" @click="submitReview">确认提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResponseData, isSuccess } from '@/utils/competition'

export default {
  name: 'AdminReview',
  data() {
    return {
      submissionList: [],
      showReviewDialog: false,
      reviewForm: {
        submissionId: '',
        score: '',
        awardLevel: '',
        reviewComment: ''
      }
    }
  },
  created() {
    this.getSubmissionList()
  },
  methods: {
    async getSubmissionList() {
      try {
        const res = await this.$http.get('/competition/submission/list/all')
        this.submissionList = getResponseData(res, [])
      } catch (err) {
        console.error('获取作品列表失败', err)
      }
    },
    openReviewDialog(item) {
      this.reviewForm = {
        submissionId: item.submissionId,
        score: '',
        awardLevel: '',
        reviewComment: ''
      }
      this.showReviewDialog = true
    },
    async submitReview() {
      if (!this.reviewForm.score) {
        alert('请输入评审得分')
        return
      }
      try {
        const res = await this.$http.post('/competition/award/review', this.reviewForm)
        if (isSuccess(res)) {
          alert('评审提交成功')
          this.showReviewDialog = false
          this.getSubmissionList()
        }
      } catch (err) {
        console.error('评审提交失败', err)
      }
    }
  }
}
</script>

<style scoped>
.admin-review-page {
  padding: 20px;
}
.page-header {
  margin-bottom: 20px;
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
.status-tag.success { background: #eef8f2; color: #4f8d72; }
.status-tag.warning { background: #fff8e4; color: #9f7b2f; }
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
  text-decoration: none;
}
/* 弹窗样式和赛事管理页面一致 */
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
