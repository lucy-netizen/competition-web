<template>
  <div class="submit-page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <h1>作品提交</h1>
    </div>

    <div class="submit-content">
      <div class="base-info">
        <h3>项目信息</h3>
        <p>项目名称：{{ projectInfo.projectName }}</p>
        <p>当前最新版本：{{ latestSubmission.version || '暂无提交' }}</p>
        <p>提交时间：{{ latestSubmission.createTime || '-' }}</p>
      </div>

      <div class="submit-form">
        <div class="form-item">
          <label>版本号 <span class="required">*</span></label>
          <input type="text" v-model="submitForm.version" placeholder="请输入版本号，如v1.0">
        </div>
        <div class="form-item">
          <label>作品说明 <span class="required">*</span></label>
          <textarea v-model="submitForm.description" placeholder="请输入本次提交的作品说明、更新内容"></textarea>
        </div>
        <div class="form-item">
          <label>作品文件 <span class="required">*</span></label>
          <div class="upload-box">
            <button class="upload-btn">选择文件</button>
            <span v-if="submitForm.fileUrl" class="file-name">{{ submitForm.fileUrl }}</span>
            <span v-else class="upload-tip">支持zip、rar、pdf、word格式</span>
          </div>
        </div>
      </div>

      <div class="action-box">
        <button class="primary-btn" @click="submitWork">确认提交</button>
      </div>

      <div class="history-box">
        <h3>提交历史</h3>
        <div class="history-list">
          <div
              v-for="item in submissionList"
              :key="item.submissionId"
              class="history-item"
          >
            <div class="history-info">
              <span class="version">版本：{{ item.version }}</span>
              <span class="time">提交时间：{{ item.createTime }}</span>
            </div>
            <p class="desc">{{ item.description }}</p>
            <a :href="item.fileUrl" target="_blank" class="download-btn">
              <i class="fas fa-download"></i> 下载文件
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectSubmit',
  data() {
    return {
      projectId: this.$route.params.projectId,
      projectInfo: {},
      latestSubmission: {},
      submissionList: [],
      submitForm: {
        projectId: this.$route.params.projectId,
        version: '',
        description: '',
        fileUrl: ''
      }
    }
  },
  created() {
    this.getProjectInfo()
    this.getSubmissionList()
    this.getLatestSubmission()
  },
  methods: {
    async getProjectInfo() {
      try {
        const res = await this.$http.get('/competition/project/detail', {
          params: { projectId: this.projectId }
        })
        if (res.data.code === 200) {
          this.projectInfo = res.data.data
        }
      } catch (err) {
        console.error('获取项目信息失败', err)
      }
    },
    async getSubmissionList() {
      try {
        const res = await this.$http.get('/competition/submission/list/by-project', {
          params: { projectId: this.projectId }
        })
        if (res.data.code === 200) {
          this.submissionList = res.data.data
        }
      } catch (err) {
        console.error('获取提交历史失败', err)
      }
    },
    async getLatestSubmission() {
      try {
        const res = await this.$http.get('/competition/submission/latest', {
          params: { projectId: this.projectId }
        })
        if (res.data.code === 200) {
          this.latestSubmission = res.data.data || {}
        }
      } catch (err) {
        console.error('获取最新版本失败', err)
      }
    },
    async submitWork() {
      if (!this.submitForm.version || !this.submitForm.description || !this.submitForm.fileUrl) {
        alert('请填写完整提交信息')
        return
      }
      try {
        const res = await this.$http.post('/competition/submission/submit', this.submitForm)
        if (res.data.code === 200) {
          alert('提交成功')
          this.submitForm = {
            projectId: this.projectId,
            version: '',
            description: '',
            fileUrl: ''
          }
          this.getSubmissionList()
          this.getLatestSubmission()
        } else {
          alert(res.data.msg || '提交失败')
        }
      } catch (err) {
        console.error('提交作品失败', err)
      }
    }
  }
}
</script>

<style scoped>
.submit-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.page-header {
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
  margin-bottom: 30px;
}
.base-info h3 {
  margin-bottom: 15px;
  font-size: 18px;
}
.base-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
.submit-form {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}
.form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-item label {
  font-size: 14px;
  color: #333;
}
.required {
  color: #b77a71;
}
.form-item input,
.form-item textarea {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
}
.form-item textarea {
  min-height: 100px;
  resize: vertical;
}
.upload-box {
  display: flex;
  align-items: center;
  gap: 15px;
}
.upload-btn {
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
.upload-tip {
  color: #999;
  font-size: 14px;
}
.file-name {
  color: #6F8FA8;
  font-size: 14px;
}
.action-box {
  text-align: center;
  margin-bottom: 40px;
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
.history-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
}
.history-box h3 {
  margin-bottom: 15px;
  font-size: 18px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.history-item {
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
}
.history-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.version {
  font-weight: bold;
  color: #333;
}
.time {
  font-size: 14px;
  color: #666;
}
.desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.download-btn {
  font-size: 14px;
  color: #6F8FA8;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
