<template>
  <div class="admin-user-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <div class="filter-box">
        <select v-model="filterRole" @change="applyFilters">
          <option value="">全部角色</option>
          <option value="学生">学生</option>
          <option value="教师">教师</option>
          <option value="管理员">管理员</option>
        </select>
        <select v-model="filterDepartment" @change="applyFilters">
          <option value="">全部院系</option>
          <option v-for="dept in departmentList" :key="dept" :value="dept">{{ dept }}</option>
        </select>
        <button class="refresh-btn" type="button" @click="getUserList">刷新</button>
      </div>
    </div>

    <div class="table-box">
      <table class="admin-table">
        <thead>
        <tr>
          <th>用户名</th>
          <th>真实姓名</th>
          <th>角色</th>
          <th>所属院系</th>
          <th>实名认证状态</th>
          <th>注册时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="6" class="table-empty">正在加载用户数据...</td>
        </tr>
        <tr v-else-if="!userList.length">
          <td colspan="6" class="table-empty">暂无用户数据，请确认后端服务已启动并导入演示数据</td>
        </tr>
        <template v-else>
          <tr v-for="user in userList" :key="user.userId">
            <td>{{ user.username }}</td>
            <td>{{ user.realName || '-' }}</td>
            <td>{{ getRoleText(user.role) }}</td>
            <td>{{ user.department || '-' }}</td>
            <td>
                <span class="status-tag" :class="isVerified(user.idCardVerified) ? 'success' : 'warning'">
                  {{ isVerified(user.idCardVerified) ? '已认证' : '未认证' }}
                </span>
            </td>
            <td>{{ user.createTime || '-' }}</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getResponseData } from '@/utils/competition'

export default {
  name: 'AdminUser',
  data() {
    return {
      loading: false,
      allUserList: [],
      userList: [],
      departmentList: [],
      filterRole: '',
      filterDepartment: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.loading = true
      try {
        const res = await this.$http.get('/competition/user/list')
        this.allUserList = getResponseData(res, []).map(this.normalizeUser)
        this.departmentList = [...new Set(this.allUserList.map(item => item.department).filter(Boolean))]
        this.applyFilters()
      } catch (err) {
        console.error('获取用户列表失败', err)
        this.allUserList = []
        this.userList = []
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.userList = this.allUserList.filter(user => {
        const matchRole = !this.filterRole || user.role === this.filterRole
        const matchDepartment = !this.filterDepartment || user.department === this.filterDepartment
        return matchRole && matchDepartment
      })
    },
    normalizeUser(user) {
      return {
        userId: user.userId || user.id || user.user_id || user.username,
        username: user.username || user.userName || '-',
        realName: user.realName || user.real_name || user.nickname || '-',
        role: this.normalizeRole(user.role),
        department: user.department || user.college || user.deptName || '',
        idCardVerified: user.idCardVerified ?? user.id_card_verified ?? user.verified ?? 0,
        createTime: user.createTime || user.create_time || '-'
      }
    },
    normalizeRole(role) {
      const map = {
        student: '学生',
        teacher: '教师',
        department_admin: '管理员',
        super_admin: '管理员',
        admin: '管理员',
        '老师': '教师',
        '院系管理员': '管理员',
        '超级管理员': '管理员'
      }
      return map[role] || role || '-'
    },
    isVerified(value) {
      return value === true || value === 1 || value === '1' || value === '已认证'
    },
    getRoleText(role) {
      const map = {
        'student': '学生',
        'teacher': '教师',
        'department_admin': '管理员',
        'super_admin': '管理员',
        'admin': '管理员'
      }
      return map[role] || role
    }
  }
}
</script>

<style scoped>
.admin-user-page {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filter-box {
  display: flex;
  gap: 10px;
}
.filter-box select {
  padding: 6px 12px;
  border: 1px solid rgba(120, 132, 150, 0.22);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.86);
  color: #394150;
}
.refresh-btn {
  padding: 6px 14px;
  border: 1px solid rgba(120, 132, 150, 0.24);
  border-radius: 6px;
  background: #f7fafc;
  color: #526071;
  cursor: pointer;
}
.table-box {
  border: 1px solid rgba(120, 132, 150, 0.18);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
}
.admin-table thead {
  background: #f7fafc;
}
.admin-table th,
.admin-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(120, 132, 150, 0.14);
  font-size: 14px;
  color: #394150;
}
.table-empty {
  text-align: center !important;
  color: #7b8794 !important;
  padding: 28px 15px !important;
}
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-tag.success { background: #eef8f2; color: #4f8d72; }
.status-tag.warning { background: #fff8e4; color: #9f7b2f; }
</style>
