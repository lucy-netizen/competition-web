<template>
  <div class="register-page">
    <div class="register-box">
      <div class="register-header">
        <h1>用户注册</h1>
        <p>欢迎加入创新创业赛事管理平台</p>
      </div>
      <div class="register-form">
        <div class="form-item">
          <label>用户名 <span class="required">*</span></label>
          <input
              type="text"
              v-model="registerForm.username"
              placeholder="请设置登录用户名"
          >
        </div>
        <div class="form-item">
          <label>登录密码 <span class="required">*</span></label>
          <input
              type="password"
              v-model="registerForm.password"
              placeholder="请设置登录密码"
          >
        </div>
        <div class="form-item">
          <label>确认密码 <span class="required">*</span></label>
          <input
              type="password"
              v-model="confirmPassword"
              placeholder="请再次输入密码"
          >
        </div>
        <div class="form-item">
          <label>真实姓名</label>
          <input
              type="text"
              v-model="registerForm.realName"
              placeholder="请输入真实姓名"
          >
        </div>
        <div class="form-item">
          <label>用户角色 <span class="required">*</span></label>
          <select v-model="registerForm.role">
            <option value="student">学生</option>
            <option value="teacher">老师</option>
          </select>
        </div>
        <div class="form-item">
          <label>所属院系</label>
          <input
              type="text"
              v-model="registerForm.department"
              placeholder="请输入所属院系"
          >
        </div>
        <button class="register-btn" @click="register" :disabled="loading">
          {{ loading ? '注册中...' : '立即注册' }}
        </button>
        <div class="form-footer">
          <span>已有账号？<router-link to="/login">立即登录</router-link></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        realName: '',
        role: 'student',
        department: ''
      },
      confirmPassword: '',
      loading: false
    }
  },
  methods: {
    async register() {
      if (!this.registerForm.username || !this.registerForm.password) {
        alert('请填写用户名和密码')
        return
      }
      if (this.registerForm.password !== this.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      this.loading = true
      try {
        const res = await this.$http.post('/competition/user/register', this.registerForm)
        if (res.data.code === 200) {
          alert('注册成功，请登录')
          this.$router.push('/login')
        } else {
          alert(res.data.msg || '注册失败')
        }
      } catch (err) {
        console.error('注册失败', err)
        alert('注册失败，请检查网络')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
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
.register-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 400px;
  max-width: 90%;
}
.register-header {
  text-align: center;
  margin-bottom: 30px;
}
.register-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}
.register-header p {
  color: #666;
  font-size: 14px;
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
.form-item select {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
}
.register-btn {
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
.register-btn:disabled {
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
