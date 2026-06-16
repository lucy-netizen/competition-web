<template>
  <header class="site-header" :class="{ 'header-hidden': !isHeaderVisible, 'on-hero': isHeroHeader }">
    <nav class="navbar">
      <!-- 移动端菜单按钮 -->
      <button class="menu-btn" @click="handleOpenMobileMenu">
        <i class="fas fa-bars"></i>
      </button>

      <div class="nav-left">
        <router-link to="/" class="logo">
          <img :src="$store.state.webSiteInfo.logo || '/images/pds.jpg'" :alt="$store.state.webSiteInfo.name || '大学生竞赛管理系统'">
          <span class="logo-text">{{$store.state.webSiteInfo.name || '大学生竞赛管理系统'}}</span>
        </router-link>
      </div>

      <div class="nav-center">
        <div
            v-for="item in filteredMenuItems"
            :key="item.name"
            class="nav-item"
            @mouseleave="handleMouseLeave"
        >
          <router-link
              :to="item.path"
              class="nav-link"
              :class="{
              'has-dropdown': item.children,
              'active': isActive(item),
              [item.colorClass]: true
            }"
              @mouseenter="handleMouseEnter(item)"
          >
            <i :class="item.icon"></i>
            {{ item.name }}
            <i v-if="item.children" class="fas fa-chevron-down dropdown-icon"></i>
          </router-link>

          <div v-if="item.children"
               class="dropdown-menu"
               :class="{ active: activeDropdown === item.name }"
          >
            <a
                href="javascript:void(0)"
                v-for="child in item.children"
                :key="`${item.name}-${child.name}`"
                class="dropdown-item"
                :class="{ 'active': isChildActive(child) }"
                @click="handleDropdownItemClick(child)"
            >
              <i :class="child.icon"></i>
              {{ child.name }}
            </a>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <a href="javascript:void(0)" class="search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
          <span class="search-text">搜索</span>
        </a>

        <!-- 消息按钮 适配竞赛系统路由 -->
        <router-link to="/notification" class="message-btn">
          <i class="far fa-bell"></i>
          <span class="message-count" v-if="showBage()" />
        </router-link>

        <!-- 移动端搜索按钮 -->
        <button class="mobile-search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
        </button>

        <div class="user-info">
          <div v-if="$store.state.userInfo" class="user-section" @mouseleave="showDropdown = false">
            <div class="avatar" @mouseenter="showDropdown = true">
              <el-avatar :src="safeAvatar"  />
            </div>
            <!-- 用户下拉菜单 适配竞赛系统角色 -->
            <div class="user-dropdown" v-show="showDropdown">
              <div class="dropdown-header">
                <img :src="safeAvatar" :alt="$store.state.userInfo.nickname || $store.state.userInfo.realName">
                <div class="user-details">
                  <span class="username">{{ $store.state.userInfo.nickname || $store.state.userInfo.realName || $store.state.userInfo.username }}</span>
                  <span class="role">{{ getRoleText($store.state.userInfo.role) }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/user/profile" class="dropdown-item">
                <i class="fas fa-columns"></i>
                角色工作台
              </router-link>
              <router-link to="/submission" class="dropdown-item">
                <i class="fas fa-upload"></i>
                我的提交记录
              </router-link>
              <!-- 管理员专属入口 -->
              <router-link to="/analytics" class="dropdown-item" v-if="isAdminRole($store.state.userInfo.role)">
                <i class="fas fa-chart-line"></i>
                数据分析驾驶舱
              </router-link>
              <router-link to="/admin/competition" class="dropdown-item" v-if="isAdminRole($store.state.userInfo.role)">
                <i class="fas fa-cog"></i>
                管理后台
              </router-link>
              <div class="dropdown-item" @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i>
                退出登录
              </div>
            </div>
          </div>
          <div v-else class="avatar" @click="handleLogin">
            <el-avatar class="avatar-icon"
                       :src="$store.state.webSiteInfo.touristAvatar || '/images/visible.jpg'"
            />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      searchQuery: '',
      showSearchPanel: false,
      showMobileSearch: false,
      lastScrollTop: 0,
      isHeaderVisible: true,
      // 竞赛管理系统专属菜单 完全匹配路由配置
      menuItems: [
        {
          name: '赛事大厅',
          path: '/',
          icon: 'fas fa-home',
          colorClass: 'home-link'
        },
        {
          name: '赛事管理',
          path: '/',
          icon: 'fas fa-trophy',
          colorClass: 'hot-link',
          children: [
            {
              name: '赛事大厅',
              path: '/',
              icon: 'fas fa-home',
              colorClass: 'home-link'
            },
            {
              name: '我的团队',
              path: '/team',
              icon: 'fas fa-users',
              colorClass: 'friend-link'
            },
            {
              name: '我的项目',
              path: '/project',
              icon: 'fas fa-project-diagram',
              colorClass: 'code-link'
            },
            {
              name: '提交记录',
              path: '/submission',
              icon: 'fas fa-upload',
              colorClass: 'about-me-link'
            }
          ]
        },
        {
          name: '备赛资源',
          path: '/resource',
          icon: 'fas fa-book-open',
          colorClass: 'message-link'
        },
        {
          name: '智能备赛',
          path: '/ai-chat',
          icon: 'fas fa-robot',
          colorClass: 'talk-link'
        },
        {
          name: '获奖公示',
          path: '/award',
          icon: 'fas fa-medal',
          colorClass: 'photos-link'
        },
        {
          name: '关于系统',
          path: '/about',
          icon: 'fas fa-info-circle',
          colorClass: 'about-link',
          children: [
            {
              name: '系统介绍',
              path: '/about',
              icon: 'fas fa-info',
              colorClass: 'about-me-link'
            },
            {
              name: '网站源码',
              path: 'https://gitee.com/quequnlong',
              icon: 'fab fa-github',
              colorClass: 'github-link',
              external: true
            },
            {
              name: '后台管理',
              path: import.meta.env.VITE_APP_ADMIN_URL || 'http://localhost:8800',
              icon: 'fas fa-tv',
              colorClass: 'admin-link',
              external: true
            }
          ]
        }
      ],
      activeDropdown: null,
      showDropdown: false,
      showSearch: false,
      unreadCount: 0,
      scrollTop: 0,
      heroHeaderLimit: 640,
      documentClickHandler: null,
    }
  },
  computed: {
    filteredMenuItems() {
      return this.roleMenuItems.map(item => ({
        ...item,
        path: item.children ? item.children[0].path : item.path
      }))
    },
    roleMenuItems() {
      const role = this.$store.state.userInfo?.role
      const baseItems = [
        {
          name: '赛事大厅',
          path: '/',
          icon: 'fas fa-home',
          colorClass: 'home-link'
        }
      ]

      if (this.isTeacherRole(role)) {
        return [
          ...baseItems,
          {
            name: '指导工作台',
            path: '/user/profile',
            icon: 'fas fa-chalkboard-teacher',
            colorClass: 'hot-link'
          },
          {
            name: '赛事发布',
            path: '/admin/competition',
            icon: 'fas fa-calendar-plus',
            colorClass: 'message-link'
          },
          {
            name: '团队审核',
            path: '/team',
            icon: 'fas fa-user-check',
            colorClass: 'friend-link'
          },
          {
            name: '作品评审',
            path: '/admin/review',
            icon: 'fas fa-clipboard-check',
            colorClass: 'talk-link'
          },
          {
            name: '获奖录入',
            path: '/award',
            icon: 'fas fa-medal',
            colorClass: 'photos-link'
          }
        ]
      }

      if (this.isAdminRole(role)) {
        return [
          ...baseItems,
          {
            name: '统筹工作台',
            path: '/user/profile',
            icon: 'fas fa-chart-pie',
            colorClass: 'hot-link'
          },
          {
            name: '数据分析',
            path: '/analytics',
            icon: 'fas fa-chart-line',
            colorClass: 'message-link'
          },
          {
            name: '赛事审核',
            path: '/admin/competition',
            icon: 'fas fa-check-double',
            colorClass: 'friend-link'
          },
          {
            name: '全量数据',
            path: '/project',
            icon: 'fas fa-database',
            colorClass: 'code-link'
          },
          {
            name: '报表归档',
            path: '/admin/review',
            icon: 'fas fa-file-export',
            colorClass: 'talk-link'
          },
          {
            name: '账号管理',
            path: '/admin/user',
            icon: 'fas fa-user-cog',
            colorClass: 'about-link'
          }
        ]
      }

      return this.menuItems
    },
    isHeroHeader() {
      return this.$route.path === '/' && this.scrollTop < this.heroHeaderLimit
    },
    safeAvatar() {
      const avatar = this.$store.state.userInfo?.avatar
      if (!avatar || /127\.0\.0\.1:8800|localhost:8800/.test(avatar)) {
        return '/images/visible.jpg'
      }
      return avatar
    }
  },
  methods: {
    // 竞赛系统角色文本映射
    getRoleText(role) {
      const roleMap = {
        'student': '学生',
        'teacher': '指导老师',
        'department_admin': '院系管理员',
        'super_admin': '超级管理员',
        'admin': '管理员',
        '学生': '学生',
        '教师': '指导老师',
        '管理员': '管理员'
      }
      return roleMap[role] || '普通用户'
    },
    isTeacherRole(role) {
      return ['teacher', '教师'].includes(role)
    },
    isAdminRole(role) {
      return ['admin', '管理员', 'super_admin', 'department_admin'].includes(role)
    },
    handleOpenMobileMenu() {
      this.$store.commit('SET_MOBILE_MENU_VISIBLE', true)
    },
    handleSearch() {
      this.$store.commit('SET_SEARCH_VISIBLE', true)
    },
    handleLogin() {
      this.$router.push('/login')
    },
    closeAllPanels() {
      this.showMobileSearch = false
    },
    closeMobileSearch() {
      this.showMobileSearch = false
      this.searchQuery = ''
    },
    handleMobileSearch(tag) {
      this.searchQuery = tag
      this.$refs.mobileSearchInput.focus()
    },
    handleMouseEnter(item) {
      if (item.children) {
        this.activeDropdown = item.name
      }
    },
    handleMouseLeave() {
      this.activeDropdown = null
    },
    isActive(item) {
      if (item.children) {
        return item.children.some(child => this.isChildActive(child))
      }
      return this.$route.path === item.path
    },
    isChildActive(child) {
      return this.$route.path === child.path
    },
    handleDropdownItemClick(item) {
      this.activeDropdown = null
      if (item.external) {
        window.open(item.path, '_blank')
        return
      }
      this.$router.push(item.path)
    },
    handleLogout() {
      this.$store.dispatch('logout')
      this.$message.success('已退出登录')
      this.showDropdown = false
    },
    showBage() {
      return this.$store.state.isUnread
    },
    updateHeroHeaderLimit() {
      const viewportHeight = window.innerHeight || 720
      this.heroHeaderLimit = Math.max(420, viewportHeight - 120)
    },
    handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
      this.scrollTop = currentScrollTop

      if (currentScrollTop < 100) {
        this.isHeaderVisible = true
        this.lastScrollTop = currentScrollTop
        return
      }

      if (currentScrollTop > this.lastScrollTop) {
        this.isHeaderVisible = false
      } else {
        this.isHeaderVisible = true
      }

      this.lastScrollTop = currentScrollTop
    },
  },
  mounted() {
    this.updateHeroHeaderLimit()
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.updateHeroHeaderLimit)
    this.documentClickHandler = (e) => {
      const userSection = this.$el.querySelector('.user-section')
      if (userSection && !userSection.contains(e.target)) {
        this.showDropdown = false
      }
    }
    document.addEventListener('click', this.documentClickHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.updateHeroHeaderLimit)
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler)
    }
  }
}
</script>

<style lang="scss" scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(245, 245, 240, 0.86);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-bottom: 2px solid #1E1E1E;
  transition: all 0.3s ease;
  transform: translateY(0);

  &.header-hidden {
    transform: translateY(-100%);
    box-shadow: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(245, 245, 240, 0));
    pointer-events: none;
  }

  &.on-hero {
    background: rgba(245, 245, 240, 0.82);
    border-bottom-color: #1E1E1E;

    &::after {
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.28), rgba(245, 245, 240, 0));
    }

    .nav-left .logo .logo-text,
    .nav-link,
    .message-btn,
    .menu-btn,
    .mobile-search-btn {
      color: #1A1A1A;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #1A1A1A;
      background: #F2D160;
    }

    .search-btn {
      background: #FFFFFF;
      border-color: #1E1E1E;
      color: #1A1A1A;
    }

    .user-info .avatar {
      border-color: #1E1E1E;
    }
  }
}

.navbar {
  max-width: 1320px;
  margin: 0 auto;
  padding: 8px 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 76px;
  position: relative;
}

.nav-left {
  margin-right: 50px;
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 10px;

    img {
      height: 42px;
      width: 42px;
      border: 2px solid #1E1E1E;
      border-radius: 50%;
      box-shadow: 4px 4px 0 rgba(26, 26, 26, 0.08);
    }

    .logo-text {
      font-size: 1.08em;
      font-weight: 700;
      color: #1A1A1A;
      background: none;
      -webkit-text-fill-color: currentColor;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media screen and (max-width: 1400px) {
      .logo-text {
        max-width: 160px;
        font-size: 1.1em;
      }
    }

    @media screen and (max-width: 1200px) {
      .logo-text {
        max-width: 140px;
        font-size: 1em;
      }
    }

    @media screen and (max-width: 1000px) {
      .logo-text {
        max-width: 120px;
        font-size: 0.9em;
      }
    }
  }
}

.nav-center {
  display: flex;
  gap: $spacing-md;
  flex: 1;
  font-size: 1em;
  .nav-item {
    position: relative;
    white-space: nowrap;

    &:hover {
      .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }

      .nav-link .dropdown-icon {
        transform: rotate(180deg);
      }
    }
  }

  .nav-link {
    color: #1A1A1A;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 8px 13px;
    border: 2px solid transparent;
    border-radius: 9999px;
    font-size: 0.88em;
    position: relative;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    i {
      font-size: 1.1em;
    }

    &:hover, &.active {
      color: #1A1A1A;
      background: #FFFFFF;
      border-color: #1E1E1E;
      box-shadow: 4px 4px 0 rgba(26, 26, 26, 0.08);
    }

    &.has-dropdown {
      padding-right: $spacing-lg;

      .dropdown-icon {
        position: absolute;
        right: $spacing-sm;
        font-size: 0.8em;
        transition: transform 0.3s ease;
      }
    }

    &.home-link i { color: #4CAF50; }
    &.archive-link i { color: #9C27B0; }
    &.clock-link i { color: #00BCD4; }
    &.category-link i { color: #FF9800; }
    &.tag-link i { color: #E91E63; }
    &.talk-link i { color: #2196F3; }
    &.code-link i { color: #607D8B; }
    &.hot-link i { color: #F44336; }
    &.photos-link i { color: #9b36f4; }
    &.message-link i { color: #009688; }
    &.friend-link i { color: #3F51B5; }
    &.about-link i { color: #795548; }
    &.about-me-link i { color: #8BC34A; }
    &.github-link i { color: #333333; }
    &.changelog-link i { color: #673AB7; }
    &.resource-link i { color: #009688; }

    &:hover {
      i {
        transform: scale(1.1);
      }
    }

    i {
      transition: transform 0.3s ease;
      font-size: 1.2em;
    }
  }

  @media screen and (max-width: 1400px) {
    .nav-link {
      font-size: 0.85em;
      padding: $spacing-sm $spacing-sm;
      gap: $spacing-xs;
    }
  }

  @media screen and (max-width: 1200px) {
    gap: $spacing-sm;

    .nav-link {
      font-size: 0.8em;
      padding: $spacing-xs $spacing-sm;

      i {
        font-size: 1em;
      }

      .dropdown-icon {
        display: none;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .nav-link {
      i {
        display: none;
      }

      padding: $spacing-xs $spacing-xs;
      font-size: 0.75em;
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-left: auto;
  position: relative;
  right: 0px;

  .search-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 108px;
    padding: 8px 16px;
    background: #FFFFFF;
    border-radius: 9999px;
    color: #1A1A1A;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 2px solid #1E1E1E;
    box-shadow: 4px 4px 0 rgba(26, 26, 26, 0.08);

    i {
      font-size: 0.9em;
      transition: transform 0.3s ease;
    }

    .search-text {
      font-size: 0.9em;
      font-weight: 500;
    }

    &:hover {
      background: #F2D160;
      color: #1A1A1A;
      border-color: #1E1E1E;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(26, 26, 26, 0.08);

      i {
        transform: scale(1.1);
      }
    }
  }

  .message-btn {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px;
    color: #1A1A1A;
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 50%;

    i {
      font-size: 1.2em;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #1A1A1A;
      background: #C4D94E;

      i {
        transform: scale(1.1);
      }
    }

    .message-count {
      position: absolute;
      top: 2px;
      right: 2px;
      background: #d8a39a;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      transform: none;
      padding: 0;
    }
  }

  .user-info {
    .user-section {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 8px;
        background: transparent;
      }
    }

    .avatar {
      width: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 50%;
      overflow: hidden;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #1E1E1E;
      box-shadow: 4px 4px 0 rgba(26, 26, 26, 0.08);

      &:hover {
        transform: translate(-2px, -2px);
        background: #C5B5E0;
      }

      .avatar-icon {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      background: var(--surface);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      z-index: 1000;
      animation: slideDown 0.2s ease;

      .dropdown-header {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(135deg, $primary, $secondary);
        color: #fff;

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .user-details {
          .username {
            display: block;
            font-weight: 500;
            font-size: 16px;
          }

          .role {
            display: block;
            font-size: 13px;
            opacity: 0.8;
            margin-top: 2px;
          }
        }
      }

      .dropdown-divider {
        height: 1px;
        background: var(--border-color);
        margin: 8px 0;
      }

      .dropdown-item {
        padding: 12px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;

        i {
          font-size: 16px;
          opacity: 0.8;
        }

        &:hover {
          background: var(--hover-bg);
          color: $primary;

          i {
            opacity: 1;
          }
        }
      }
    }
  }
}

.menu-btn,
.mobile-search-btn {
  display: none;
  background: none;
  border: none;
  padding: $spacing-sm;
  font-size: 1.2em;
  color: $text-secondary;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: $primary;
  }
}

.mobile-search {
  position: fixed;
  top: 0;
  bottom: 0;
  background: white;
  width: 80%;
  max-width: 360px;
  z-index: 1100;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;

  &.active {
    transform: translateX(0);
  }
}


@include responsive(lg) {
  .nav-center {
    display: none;
  }

  .nav-right .search-btn {
    width: 160px;
  }
}

@include responsive(md) {
  .navbar {
    padding: 8px 18px;
  }

  .menu-btn,
  .mobile-search-btn {
    display: block;
  }

  .nav-center,
  .nav-right .search-btn {
    display: none;
  }

  .nav-left {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-right: 0;

    .logo {
      img {
        height: 40px;
        width: 42px;
      }

      .logo-text {
        max-width: 160px;
        font-size: 1em;
        display: block;
      }
    }
  }

  .nav-right .user-info {
    display: none;
  }

  .nav-right .message-btn {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .nav-left .logo .logo-text {
    max-width: 120px;
    font-size: 1.3em;
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  background: var(--surface);
  border-radius: $border-radius-md;
  box-shadow: $shadow-lg;
  width: max-content;
  min-width: 120px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  padding: $spacing-xs 0;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    width: 100%;
    height: 8px;
    background: transparent;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 8px $spacing-md;
    height: 36px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-size: 0.9em;
    i {
      width: 16px;
      text-align: center;
      font-size: 0.9em;
      color: var(--text-secondary);
      margin-right: 8px;
    }

    &:hover {
      color: $primary;
      background: var(--hover-bg);

      i {
        color: $primary;
      }
    }
  }

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }

  @keyframes dropdownEnter {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &.active {
    animation: dropdownEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式适配 */
:root[data-theme='dark'] {
  .site-header {
    background: rgba(var(--surface-rgb), 0.75);
    backdrop-filter: blur(10px) saturate(160%);
    -webkit-backdrop-filter: blur(10px) saturate(160%);
    border-bottom-color: rgba(var(--border-color-rgb), 0.15);
  }

  .user-dropdown {
    background: var(--surface);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    .dropdown-item {
      color: var(--text-primary);

      &:hover {
        background: var(--hover-bg);
      }
    }
  }
}

/* 深色模式图标颜色适配 */
:root[data-theme='dark'] {
  .nav-link {
    &.home-link i { color: #81C784; }
    &.archive-link i { color: #CE93D8; }
    &.clock-link i { color: #4DD0E1; }
    &.category-link i { color: #FFB74D; }
    &.tag-link i { color: #F06292; }
    &.talk-link i { color: #64B5F6; }
    &.code-link i { color: #90A4AE; }
    &.hot-link i { color: #EF5350; }
    &.message-link i { color: #4DB6AC; }
    &.friend-link i { color: #7986CB; }
    &.about-link i { color: #A1887F; }
    &.about-me-link i { color: #AED581; }
    &.github-link i { color: #FFFFFF; }
    &.changelog-link i { color: #9575CD; }
  }
}

/* 图标悬浮动画 */
@keyframes iconFloat {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}

.nav-link:hover i {
  animation: iconFloat 0.6s ease-in-out;
}

/* 字体样式 */
.nav-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 0;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
