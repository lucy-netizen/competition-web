<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <h1>竞赛管理系统</h1>
        <p>欢迎登录创新创业赛事管理平台</p>
      </div>
      <div class="demo-accounts">
        <span>演示账号</span>
        <button @click="fillDemo('admin')">管理员</button>
        <button @click="fillDemo('teacher_li')">教师</button>
        <button @click="fillDemo('student_chen')">学生</button>
      </div>
      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input
              type="text"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              @keyup.enter="login"
          >
        </div>
        <div class="form-item">
          <label>密码</label>
          <input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              @keyup.enter="login"
          >
        </div>
        <button class="login-btn" @click="login" :disabled="loading">
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
        <div class="form-footer">
          <span>还没有账号？<router-link to="/register">立即注册</router-link></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResponseData, isSuccess } from '@/utils/competition'

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    fillDemo(username) {
      this.loginForm.username = username
      this.loginForm.password = '123456'
    },
    async login() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.warning('请输入用户名和密码')
        return
      }
      this.loading = true
      try {
        const res = await this.$http.post('/competition/user/login', null, {
          params: this.loginForm
        })
        if (isSuccess(res)) {
          const userInfo = getResponseData(res, {})
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.$store.commit('SET_USER_INFO', userInfo)
          this.$message.success('登录成功')
          this.$router.push(this.$route.query.redirect || '/user/profile')
        } else {
          this.$message.error(res.message || res.data?.message || '登录失败')
        }
      } catch (err) {
        console.error('登录失败', err)
        this.$message.error('登录失败，请检查后端服务或账号密码')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at 18% 16%, rgba(191, 209, 234, 0.36), transparent 34%),
    radial-gradient(ellipse at 84% 18%, rgba(214, 205, 232, 0.3), transparent 32%),
    linear-gradient(135deg, #f4f3ed 0%, #eef2f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 400px;
  max-width: 90%;
}
.login-header {
  text-align: center;
  margin-bottom: 18px;
}
.login-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}
.login-header p {
  color: #666;
  font-size: 14px;
}
.demo-accounts {
  display: grid;
  grid-template-columns: 1fr repeat(3, auto);
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  padding: 10px;
  border-radius: 8px;
  background: #f6f8fb;
  color: #64748b;
  font-size: 13px;
}
.demo-accounts button {
  border: none;
  border-radius: 6px;
  background: #e8f3ff;
  color: #0f766e;
  padding: 6px 8px;
  cursor: pointer;
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
.form-item input {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
}
.login-btn {
  width: 100%;
  background: #6F8FA8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}
.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}
.form-footer a {
  color: #6F8FA8;
  text-decoration: none;
}
</style>
