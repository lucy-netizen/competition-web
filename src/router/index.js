import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index.vue'
import NotFound from '@/views/404/404.vue'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Layout,
    meta: {
      title: "大学生竞赛管理系统",
      loading: true
    },
    children: [
      // 首页/赛事大厅
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '赛事大厅 - 竞赛管理系统',
          transition: 'fade',
          icon: 'fas fa-home',
          loading: true
        }
      },
      // 赛事详情页
      {
        path: '/competition/detail/:id',
        name: 'CompetitionDetail',
        component: () => import('@/views/competition/detail/index.vue'),
        props: true,
        meta: {
          transition: 'fade',
          title: '赛事详情 - 竞赛管理系统',
          hidden: true
        }
      },
      // 我的团队
      {
        path: '/team',
        name: 'Team',
        component: () => import('@/views/team/index.vue'),
        meta: {
          transition: 'fade',
          title: "我的团队 - 竞赛管理系统",
          icon: 'fas fa-users',
          requireAuth: true
        }
      },
      // 团队详情页
      {
        path: '/team/detail/:id',
        name: 'TeamDetail',
        component: () => import('@/views/team/detail/index.vue'),
        props: true,
        meta: {
          transition: 'fade',
          title: '团队详情 - 竞赛管理系统',
          requireAuth: true,
          hidden: true
        }
      },
      // 我的参赛项目
      {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: {
          transition: 'fade',
          title: '我的项目 - 竞赛管理系统',
          icon: 'fas fa-project-diagram',
          requireAuth: true
        }
      },
      // 作品提交页面
      {
        path: '/project/submit/:projectId',
        name: 'ProjectSubmit',
        component: () => import('@/views/project/submit/index.vue'),
        props: true,
        meta: {
          transition: 'fade',
          title: '作品提交 - 竞赛管理系统',
          requireAuth: true,
          hidden: true
        }
      },
      // 备赛资源中心
      {
        path: '/resource',
        name: 'Resource',
        component: () => import('@/views/resource/index.vue'),
        meta: {
          transition: 'fade',
          title: '备赛资源 - 竞赛管理系统',
          icon: 'fas fa-book-open'
        }
      },
      // 智能备赛
      {
        path: '/ai-chat',
        name: 'AiChat',
        component: () => import('@/views/ai-chat/index.vue'),
        meta: {
          transition: 'fade',
          title: '智能备赛 - 竞赛管理系统',
          icon: 'fas fa-robot'
        }
      },
      // 获奖公示
      {
        path: '/award',
        name: 'Award',
        component: () => import('@/views/award/index.vue'),
        meta: {
          transition: 'fade',
          title: '获奖公示 - 竞赛管理系统',
          icon: 'fas fa-trophy'
        }
      },
      // 关于系统
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: {
          transition: 'fade',
          title: '关于系统 - 竞赛管理系统',
          icon: 'fas fa-info-circle'
        }
      },
      // 系统通知
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: {
          transition: 'fade',
          title: '系统通知 - 竞赛管理系统',
          icon: 'fas fa-bell',
          requireAuth: true
        }
      },
      // 我的提交记录
      {
        path: '/submission',
        name: 'Submission',
        component: () => import('@/views/submission/index.vue'),
        meta: {
          transition: 'fade',
          title: '我的提交记录 - 竞赛管理系统',
          icon: 'fas fa-upload',
          requireAuth: true
        }
      },
      // 【管理员】数据分析
      {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/index.vue'),
        meta: {
          transition: 'fade',
          title: '数据分析 - 竞赛管理系统',
          icon: 'fas fa-chart-line',
          requireAuth: true,
          requireAdmin: true
        }
      },
      // 【教师/管理员】赛事发布与管理
      {
        path: '/admin/competition',
        name: 'AdminCompetition',
        component: () => import('@/views/admin/competition/index.vue'),
        meta: {
          transition: 'fade',
          title: '赛事管理 - 竞赛管理系统',
          icon: 'fas fa-calendar-check',
          requireAuth: true,
          requireTeacherOrAdmin: true
        }
      },
      // 【教师/管理员】作品评审
      {
        path: '/admin/review',
        name: 'AdminReview',
        component: () => import('@/views/admin/review/index.vue'),
        meta: {
          transition: 'fade',
          title: '作品评审 - 竞赛管理系统',
          icon: 'fas fa-list-check',
          requireAuth: true,
          requireTeacherOrAdmin: true
        }
      },
      // 【管理员】用户管理
      {
        path: '/admin/user',
        name: 'AdminUser',
        component: () => import('@/views/admin/user/index.vue'),
        meta: {
          transition: 'fade',
          title: '用户管理 - 竞赛管理系统',
          icon: 'fas fa-user-cog',
          requireAuth: true,
          requireAdmin: true
        }
      },
      // 个人中心
      {
        path: '/user/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心 - 竞赛管理系统',
          icon: 'fas fa-user',
          requireAuth: true,
          hidden: true
        }
      },
      // 登录页
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '用户登录',
          hidden: true,
          fullscreen: true
        }
      },
      // 注册页
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/register/index.vue'),
        meta: {
          title: '用户注册',
          hidden: true,
          fullscreen: true
        }
      },
      // 消息通知详情
      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('@/views/notifications/index.vue'),
        meta: {
          title: '消息通知',
          requireAuth: true,
          hidden: true
        }
      },
      // 404页面
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {
          hidden: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

// 解决重复点击导航时，控制台出现报错
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 关闭搜索框（兼容原项目逻辑）
  store.commit('SET_SEARCH_VISIBLE', false)
  const hasLocalUser = !!(sessionStorage.getItem('user') || localStorage.getItem('userInfo') || store.state.userInfo)
  if (to.meta.requireAuth && !hasLocalUser) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  const currentUser = getLocalUser()
  const role = currentUser && currentUser.role
  if (to.meta.requireTeacherOrAdmin) {
    const allowedRoles = ['教师', 'teacher', '管理员', 'admin', 'super_admin', 'department_admin']
    if (!allowedRoles.includes(role)) {
      next('/user/profile')
      return
    }
  }
  if (to.meta.requireAdmin) {
    const adminRoles = ['管理员', 'admin', 'super_admin', 'department_admin']
    if (!adminRoles.includes(role)) {
      next('/user/profile')
      return
    }
  }
  next()
})

function getLocalUser() {
  const rawUser = sessionStorage.getItem('user') || localStorage.getItem('userInfo')
  if (rawUser) {
    try {
      return JSON.parse(rawUser)
    } catch (err) {
      return null
    }
  }
  return store.state.userInfo
}

export default router
