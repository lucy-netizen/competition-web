<template>
  <div class="profile-wrapper">
    <!-- 1. 顶部个人信息 (参考 Image 3 居中风格) -->
    <div class="profile-header-card">
      <el-card shadow="never" class="header-main centered-design">
        <div class="header-content">
          <div class="avatar-box">
            <el-avatar :size="110" :src="userInfo.avatar" @click.native="showCropper = true"></el-avatar>
          </div>
          <div class="info-detail">
            <h2 class="nickname">{{ userInfo.nickname }}</h2>
            <p class="signature-text">{{ userInfo.signature || '这个人很懒，还没有写简介...' }}</p>
            <!-- 建议：18px 字体，精致且有存在感 -->
            <el-button round class="edit-btn-top" @click="openEditDialog">编辑个人资料</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 2. 下方分栏布局 -->
    <el-row :gutter="20" class="main-content-row">
      <!-- 左侧内容区 (1.10 功能整合) -->
      <el-col :xs="24" :sm="24" :md="18">
        <el-card shadow="never" class="content-tabs-card">
          <el-tabs v-model="currentTab" class="main-tabs">

            <!-- 我的发布 -->
            <el-tab-pane name="topics">
              <span slot="label"><i class="el-icon-chat-dot-round"></i> 我的发布</span>
              <div class="tab-body">
                <div class="action-bar">
                  <el-input v-model="params.title" size="mini" placeholder="搜索话题标题..." style="width: 250px; margin-right: 10px"></el-input>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                  <el-button type="success" size="mini" icon="el-icon-edit" @click="$router.push('/editor')" style="float: right">发布新话题</el-button>
                </div>
                <div v-loading="loading" v-if="posts.length">
                  <div v-for="post in posts" :key="post.id" class="list-item-card">
                    <div class="item-main">
                      <h4 @click="viewPost(post.id)">{{ post.title }}</h4>
                      <p>{{ post.summary }}</p>
                      <div class="item-meta">
                        <span><i class="el-icon-time"></i> {{ post.createTime }}</span>
                        <span><i class="el-icon-view"></i> {{ post.quantity }} 阅读</span>
                        <span><i class="el-icon-star-off"></i> {{ post.likeNum || 0 }} 点赞</span>
                      </div>
                    </div>
                    <div class="item-actions">
                      <el-button type="text" size="small" @click="editPost(post.id)">编辑</el-button>
                      <el-button type="text" size="small" class="delete-text" @click="deletePost(post)">删除</el-button>
                    </div>
                  </div>
                  <div class="pagination-center">
                    <el-pagination background @current-change="handlePostChange" :current-page="params.pageNum" :page-size="params.pageSize" :total="total" layout="prev, pager, next"></el-pagination>
                  </div>
                </div>
                <el-empty v-else description="暂无话题"></el-empty>
              </div>
            </el-tab-pane>

            <!-- 我的数据 (实时联动接口) -->
            <el-tab-pane name="data">
              <span slot="label"><i class="el-icon-data-line"></i> 我的数据</span>
              <div class="tab-body data-panel">
                <el-row :gutter="20">
                  <el-col :span="6" v-for="d in liveDataStats" :key="d.label">
                    <div class="stat-box">
                      <div class="label">{{ d.label }}</div>
                      <div class="value">{{ d.value }}</div>
                    </div>
                  </el-col>
                </el-row>
                <el-empty description="更详尽的数据报表统计中..."></el-empty>
              </div>
            </el-tab-pane>

            <!-- 我的互动 (精准改动点：优化标签顺序) -->
            <el-tab-pane name="interaction">
              <span slot="label"><i class="el-icon-set-up"></i> 我的互动</span>
              <div class="tab-body">
                <el-tabs type="border-card" v-model="interactionSubTab">
                  <!-- 1. 我的点赞 -->
                  <el-tab-pane label="我的点赞" name="likes">
                    <div v-loading="loading" v-if="myLikes.length">
                      <div v-for="like in myLikes" :key="like.id" class="list-item-card">
                        <div class="item-main">
                          <h4 @click="viewPost(like.id)">{{ like.title }}</h4>
                          <div class="item-meta"><span>点赞于：{{ like.createTime }}</span></div>
                        </div>
                        <el-button type="text" class="delete-text" @click="cancelLike(like.id)">取消点赞</el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无点赞的内容"></el-empty>
                  </el-tab-pane>

                  <!-- 2. 我的收藏 -->
                  <el-tab-pane label="我的收藏" name="favorites">
                    <div v-loading="loading" v-if="myFavorites.length">
                      <div v-for="fav in myFavorites" :key="fav.id" class="list-item-card">
                        <div class="item-main">
                          <h4 @click="viewPost(fav.id)">{{ fav.title }}</h4>
                          <div class="item-meta"><span>收藏于：{{ fav.createTime }}</span></div>
                        </div>
                        <el-button type="text" class="delete-text" @click="cancelFavorite(fav.id)">取消收藏</el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无收藏的内容"></el-empty>
                  </el-tab-pane>

                  <!-- 3. 我的关注 -->
                  <el-tab-pane label="我的关注" name="follow">
                    <el-empty description="暂无关注的人"></el-empty>
                  </el-tab-pane>

                  <!-- 4. 收到的赞 -->
                  <el-tab-pane label="收到的赞" name="received_likes">
                    <el-empty description="暂时还没有人给您点赞哦，快去发布精彩话题吧！"></el-empty>
                  </el-tab-pane>

                  <!-- 5. 收到的收藏 -->
                  <el-tab-pane label="收到的收藏" name="received_favorites">
                    <el-empty description="您的文章还没有被收藏过，继续加油哦！"></el-empty>
                  </el-tab-pane>

                  <!-- 6. 我的粉丝 -->
                  <el-tab-pane label="我的粉丝" name="fans">
                    <el-empty description="暂无粉丝"></el-empty>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>

            <!-- 意见反馈 (提交+记录) -->
            <el-tab-pane name="feedback">
              <span slot="label"><i class="el-icon-message"></i> 意见反馈</span>
              <div class="tab-body">
                <el-tabs type="border-card" v-model="feedbackSubTab">
                  <el-tab-pane label="提交反馈" name="submit">
                    <el-form :model="feedbackForm" label-width="80px" style="max-width: 600px; padding-top: 20px">
                      <el-form-item label="反馈类型">
                        <el-select v-model="feedbackForm.type">
                          <el-option v-for="item in feedbackTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="详细内容"><el-input type="textarea" :rows="5" v-model="feedbackForm.content"></el-input></el-form-item>
                      <el-form-item><el-button type="primary" @click="submitFeedback">立即提交</el-button></el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="我的反馈" name="history">
                    <div v-loading="loading" v-if="myFeedbacks.length">
                      <div v-for="f in myFeedbacks" :key="f.id" class="feedback-history-item">
                        <div class="f-header">
                          <el-tag size="mini">{{ getFeedbackTypeName(f.type) }}</el-tag>
                          <span class="f-time">{{ f.createTime }}</span>
                          <el-tag :type="f.status == 1 ? 'success' : 'info'" size="mini" class="f-status">{{ f.status == 1 ? '已处理' : '待处理' }}</el-tag>
                        </div>
                        <div class="f-body">{{ f.content }}</div>
                        <div class="f-reply" v-if="f.replyContent">
                          <div class="reply-title"><i class="el-icon-chat-dot-round"></i> 管理员回复：</div>
                          <div class="reply-text">{{ f.replyContent }}</div>
                        </div>
                      </div>
                      <el-pagination background @current-change="handleFeedbackPageChange" :current-page="params.pageNum" :page-size="params.pageSize" layout="prev, pager, next" :total="feedbackTotal"></el-pagination>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>

            <!-- 账号绑定 (Image 4 风格) -->
            <el-tab-pane name="binding">
              <span slot="label"><i class="el-icon-link"></i> 账号绑定</span>
              <div class="tab-body">
                <div class="binding-tips">
                  <el-alert title="安全提示" type="info" description="绑定社交账号后，您可以享受更便捷的登录体验。" show-icon :closable="false"></el-alert>
                </div>
                <div class="binding-list-full">
                  <div v-for="acc in boundAccounts" :key="acc.type" class="binding-card-row">
                    <div class="acc-icon-box"><i :class="acc.icon" :style="{color: acc.color}"></i></div>
                    <div class="acc-info-text">
                      <div class="name">{{ acc.name }}</div>
                      <div class="status-desc">{{ acc.isBound ? (acc.username || '已关联') : '未关联第三方账号' }}</div>
                    </div>
                    <div class="acc-ops">
                      <el-tag :type="acc.isBound ? 'success' : 'info'" size="small" effect="dark">{{ acc.isBound ? '已绑定' : '未绑定' }}</el-tag>
                      <el-button :type="acc.isBound ? 'danger' : 'primary'" size="small"
                                 :icon="acc.isBound ? 'el-icon-close' : 'el-icon-link'"
                                 @click="acc.isBound ? unbindAccount(acc.type) : bindAccount(acc.type)">
                        {{ acc.isBound ? '解除' : '去绑定' }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 个人资料 (新增展示项) -->
            <el-tab-pane name="profile_view">
              <span slot="label"><i class="el-icon-user"></i> 个人资料</span>
              <div class="tab-body" style="padding: 20px">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="用户昵称">{{ userInfo.nickname }}</el-descriptions-item>
                  <el-descriptions-item label="联系邮箱">{{ userInfo.email }}</el-descriptions-item>
                  <el-descriptions-item label="性别">
                    <el-tag size="small">{{ userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : '保密' }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="个人简介">{{ userInfo.signature || '这个人很懒，还没有写简介...' }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>

            <!-- 个人设置 -->
            <el-tab-pane name="settings">
              <span slot="label"><i class="el-icon-lock"></i> 个人设置</span>
              <div class="tab-body">
                <h3 class="inner-title">密码修改</h3>
                <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="110px" style="max-width: 450px">
                  <el-form-item label="旧密码" prop="oldPassword"><el-input type="password" v-model="passwordForm.oldPassword" show-password></el-input></el-form-item>
                  <el-form-item label="新密码" prop="newPassword"><el-input type="password" v-model="passwordForm.newPassword" show-password></el-input></el-form-item>
                  <el-form-item label="确认新密码" prop="confirmPassword"><el-input type="password" v-model="passwordForm.confirmPassword" show-password></el-input></el-form-item>
                  <el-form-item><el-button type="primary" @click="submitPasswordChange">确认修改</el-button></el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>

      <!-- 右侧辅助栏 -->
      <el-col :xs="24" :sm="24" :md="6">
        <el-card shadow="never" class="side-card">
          <div slot="header" class="side-title"><span><i class="el-icon-trophy"></i> 个人成就</span></div>
          <div class="ach-list">
            <div class="ach-item"><i class="el-icon-thumb" style="background:#ff7875"></i> <span>获赞 {{ statistics.likes || 0 }}</span></div>
            <div class="ach-item"><i class="el-icon-view" style="background:#ff9c6e"></i> <span>阅读 {{ statistics.views || 0 }}</span></div>
            <div class="ach-item"><i class="el-icon-coin" style="background:#ffc069"></i> <span>积分 {{ userInfo.points || 0 }}</span></div>
          </div>
        </el-card>

        <el-card shadow="never" class="side-card">
          <div class="follow-stats">
            <div class="stat-unit"><div class="v">{{ statistics.following || 0 }}</div><div class="l">关注</div></div>
            <div class="sep"></div>
            <div class="stat-unit"><div class="v">{{ statistics.followers || 0 }}</div><div class="l">粉丝</div></div>
          </div>
        </el-card>

        <el-card shadow="never" class="side-card sign-panel">
          <el-button type="danger" :disabled="signInStatus" @click="handleSignIn" style="width:100%" round>
            {{ signInStatus ? '今日已签到' : '立即签到' }}
          </el-button>
          <div class="sign-info">连续签到 <span>{{ signInStats.continuousDays }}</span> 天</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗：编辑资料 -->
    <el-dialog title="编辑个人资料" :visible.sync="editDialogVisible" width="500px" append-to-body>
      <el-form :model="profileForm" label-width="90px">
        <el-form-item label="用户昵称"><el-input v-model="profileForm.nickname"></el-input></el-form-item>
        <el-form-item label="联系邮箱"><el-input v-model="profileForm.email"></el-input></el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.sex">
            <el-radio :label="1">男</el-radio><el-radio :label="2">女</el-radio><el-radio :label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自我介绍"><el-input type="textarea" :rows="3" v-model="profileForm.signature"></el-input></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitProfile" :loading="loading">保存修改</el-button></div>
    </el-dialog>

    <AvatarCropper :visible.sync="showCropper" :user="userInfo" @update-avatar="handleAvatarUpdate" />
  </div>
</template>

<script>
// --- 完整保留所有接口导入 ---
import {
  getUserInfoApi, updateProfileApi, updatePasswordApi,
  getMyCommentApi, delMyCommentApi, getMyLikeApi, getMyReplyApi, getMyFeedbackApi, addFeedbackApi,
  signInApi, getSignInStatusApi, getSignInStatsApi
} from '@/api/user'
// 导入新的统计接口 (待会后端实现)
import request from '@/utils/request'
export function getUserStatsApi() {
  return request({ url: '/protal/user/statistics', method: 'get' })
}

import { getMyArticleApi, likeArticleApi, delArticleApi } from '@/api/article'
import { getDictDataApi } from '@/api/dict'
import AvatarCropper from '@/components/common/AvatarCropper.vue'
import { marked } from "marked";

export default {
  name: 'Profile',
  components: { AvatarCropper },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) callback(new Error('两次输入的密码不一致'))
      else callback()
    }
    return {
      userInfo: {},
      currentTab: 'topics',
      interactionSubTab: 'likes', // ★★★ 初始标签设为“我的点赞”
      feedbackSubTab: 'submit',
      editDialogVisible: false,
      showCropper: false,
      loading: false,
      total: 0,
      feedbackTotal: 0,
      params: { pageNum: 1, pageSize: 10, title: '' },
      profileForm: { nickname: '', email: '', sex: 0, signature: '' },
      passwordForm: { oldPassword: '', newPassword: '', confirmPassword: '' },
      feedbackForm: { type: '', content: '' },
      // 实时统计
      statistics: { posts: 0, likes: 0, followers: 0, following: 0, views: 0 },
      posts: [],
      myComments: [],
      myReplies: [],
      myLikes: [],
      myFavorites: [],
      myFeedbacks: [],
      signInStatus: false,
      signInStats: { continuousDays: 0, totalDays: 0 },
      feedbackTypes: [],
      boundAccounts: [
        { type: 'github', name: 'GitHub', icon: 'fab fa-github', isBound: true, username: 'y2411037', color: '#333' },
        { type: 'gitee', name: '码云 (Gitee)', icon: 'fab fa-git-alt', isBound: true, username: 'github_user', color: '#C71D23' }
      ],
      passwordRules: {
        oldPassword: [{ required: true, message: '必填', trigger: 'blur' }],
        newPassword: [{ required: true, min: 6, message: '至少6位', trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    liveDataStats() {
      return [
        { label: '话题总数', value: this.statistics.posts || 0 },
        { label: '获赞总数', value: this.statistics.likes || 0 },
        { label: '全站阅读', value: this.statistics.views || 0 },
        { label: '签到总天数', value: this.signInStats.totalDays || 0 }
      ]
    }
  },
  watch: {
    currentTab(val) { this.params.pageNum = 1; this.loadDataByTab(val) },
    interactionSubTab(val) { this.loadInteractionData(val) },
    feedbackSubTab(val) { if(val === 'history') this.getMyFeedbacks() }
  },
  created() { this.init() },
  methods: {
    init() {
      getUserInfoApi().then(res => {
        this.userInfo = res.data.sysUser;
        Object.assign(this.profileForm, res.data.sysUser);
      });
      // 核心：调用实时统计接口
      getUserStatsApi().then(res => {
        if (res.data) this.statistics = res.data;
      });
      this.getDicts(); this.getSignInStatus(); this.getSignInStats();
      this.loadDataByTab(this.currentTab);
    },
    loadDataByTab(tab) {
      if (tab === 'topics') this.getMyArticle()
      if (tab === 'interaction') this.loadInteractionData(this.interactionSubTab)
    },
    loadInteractionData(tab) {
      if (tab === 'likes') this.getMyLikes()
      if (tab === 'favorites') this.getMyFavorites()
      if (tab === 'follow') { /* 加载我的关注逻辑 */ }
      if (tab === 'fans') { /* 加载我的粉丝逻辑 */ }
    },
    getMyArticle() {
      this.loading = true;
      getMyArticleApi(this.params).then(res => {
        this.posts = res.data.records; this.total = res.data.total
      }).finally(() => this.loading = false);
    },
    getMyComment() { getMyCommentApi(this.params).then(res => this.myComments = res.data.records) },
    getMyReplies() { getMyReplyApi(this.params).then(res => this.myReplies = res.data.records) },
    getMyLikes() { getMyLikeApi(this.params).then(res => this.myLikes = res.data.records) },
    getMyFavorites() { this.myFavorites = []; },
    cancelFavorite(id) { this.$message.success('已从收藏夹移除'); this.getMyFavorites(); },
    getMyFeedbacks() {
      this.loading = true;
      getMyFeedbackApi(this.params).then(res => {
        this.myFeedbacks = res.data.records; this.feedbackTotal = res.data.total
      }).finally(() => this.loading = false);
    },
    getFeedbackTypeName(val) { const t = this.feedbackTypes.find(i => i.value == val); return t ? t.label : '其他' },
    handleSearch() { this.params.pageNum = 1; this.getMyArticle(); },
    handlePostChange(p) { this.params.pageNum = p; this.getMyArticle(); },
    handleFeedbackPageChange(p) { this.params.pageNum = p; this.getMyFeedbacks(); },
    viewPost(id) { this.$router.push(`/post/${id}`) },
    editPost(id) { this.$router.push(`/editor?id=${id}`) },
    deletePost(row) {
      this.$confirm(`确定删除话题 '${row.title}'?`).then(() => {
        delArticleApi(row.id).then(() => { this.$message.success('已删除'); this.getMyArticle(); })
      })
    },
    deleteComment(id) { delMyCommentApi(id).then(() => { this.$message.success('评论已删除'); this.getMyComment(); }) },
    cancelLike(id) { likeArticleApi(id).then(() => { this.$message.success('已取消点赞'); this.getMyLikes(); }) },
    bindAccount(type) { this.$confirm('确定跳转绑定吗？').then(() => this.$message.info('正在跳转...')) },
    unbindAccount(type) { this.$confirm('确定解除绑定吗？').then(() => this.$message.success('已解除')) },
    openEditDialog() { Object.assign(this.profileForm, this.userInfo); this.editDialogVisible = true; },
    submitProfile() {
      this.loading = true;
      updateProfileApi(this.profileForm).then(() => {
        this.$message.success('修改已保存'); this.editDialogVisible = false; this.init();
      }).finally(() => this.loading = false);
    },
    submitPasswordChange() {
      this.$refs.passwordForm.validate(v => { if(v) updatePasswordApi(this.passwordForm).then(() => this.$message.success('修改成功')) })
    },
    submitFeedback() {
      addFeedbackApi(this.feedbackForm).then(() => {
        this.$message.success('感谢反馈'); this.feedbackForm.content = ''; this.feedbackSubTab = 'history'
      })
    },
    handleSignIn() { signInApi().then(() => { this.$message.success('签到成功'); this.getSignInStatus(); this.getSignInStats(); }) },
    getSignInStatus() { getSignInStatusApi().then(res => this.signInStatus = res.data) },
    getSignInStats() { getSignInStatsApi().then(res => this.signInStats = res.data) },
    getDicts() { getDictDataApi(['feedback_type']).then(res => this.feedbackTypes = res.data) },
    parseContent(c) { return marked(c || "") },
    handleAvatarUpdate(url) { this.userInfo.avatar = url }
  }
}
</script>

<style scoped lang="scss">
/* 零改动，完全保留你现在的样式定义 */
.profile-wrapper { max-width: 1200px; margin: 20px auto; padding: 0 15px; background: #f4f5f5; min-height: 100vh; }
.profile-header-card { margin-bottom: 20px; .header-main { border: none; text-align: center; padding: 40px 0;
  .avatar-box { margin-bottom: 15px; .el-avatar { border: 4px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.1); cursor: pointer; } }
  .nickname { font-size: 26px; color: #333; margin: 10px 0; font-weight: 600; }
  .signature-text { color: #666; font-size: 15px; margin-bottom: 25px; }
  .edit-btn-top { color: #f06292; border: 2px solid #f06292; font-size: 18px; padding: 10px 30px; font-weight: 500; transition: all 0.3s; &:hover { background: #f06292; color: #fff; } }
}}
.binding-list-full { display: flex; flex-direction: column; gap: 16px;
  .binding-card-row { background: #fff; border: 1px solid #ebeef5; border-radius: 8px; padding: 24px 35px; display: flex; align-items: center;
    .acc-icon-box { width: 54px; height: 54px; background: #f0f9ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 25px; i { font-size: 26px; } }
    .acc-info-text { flex: 1; .name { font-size: 17px; font-weight: bold; } .status-desc { font-size: 13px; color: #999; } }
    .acc-ops { display: flex; align-items: center; gap: 18px; }
  }
}
.list-item-card { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f0f0f0; .item-main { h4 { margin: 0 0 10px; cursor: pointer; &:hover { color: #f06292; } } p { color: #777; font-size: 13px; } .item-meta { font-size: 12px; color: #999; display: flex; gap: 18px; } } .delete-text { color: #ff7875; } }
.stat-box { text-align: center; padding: 25px; background: #fafafa; border-radius: 8px; margin-bottom: 20px; .label { font-size: 13px; color: #999; margin-bottom: 10px; } .value { font-size: 22px; font-weight: bold; } }
.feedback-history-item { padding: 18px; border-bottom: 1px solid #f0f0f0; .f-header { display: flex; justify-content: space-between; margin-bottom: 10px; } .f-reply { margin-top: 12px; padding: 12px; background: #f9f9f9; border-radius: 6px; } }
.side-card { margin-bottom: 20px; border: none; .side-title { font-weight: bold; font-size: 14px; } }
.ach-list { .ach-item { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; i { width: 30px; height: 30px; border-radius: 50%; color: #fff; text-align: center; line-height: 30px; } } }
.follow-stats { display: flex; justify-content: space-around; text-align: center; .sep { width: 1px; background: #eee; } .v { font-size: 18px; font-weight: bold; } .l { font-size: 12px; color: #999; } }
.sign-panel { text-align: center; .sign-info { margin-top: 10px; font-size: 12px; color: #666; span { color: #f06292; font-weight: bold; } } }
.interaction-card { padding: 15px; border-bottom: 1px dashed #eee; .i-footer { display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #999; } }
.pagination-center { margin-top: 25px; text-align: center; }
</style>