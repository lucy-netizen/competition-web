<template>
  <div class="moments-list" v-if="moments && moments.length > 0">
    <div class="moments-content">
      <div class="moments-row">
        <div class="moments-header">
          <i class="fas fa-comment-dots"></i>
          <span>赛事动态:</span>
        </div>
        <transition name="fade" mode="out-in">
          <div class="moment-item" :key="currentIndex">
            <span class="moment-text" @click="goToDetail" v-html="currentMoment.content" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MomentsList',
  // 新增props，父组件传数据进来
  props: {
    momentList: {
      type: Array,
      default: () => []
    },
    // 点击跳转的路由，可选
    detailPath: {
      type: String,
      default: '/moments'
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    }
  },
  computed: {
    // 计算当前显示的动态
    currentMoment() {
      return this.momentList[this.currentIndex] || {}
    },
    // 兼容原组件的moments变量
    moments() {
      return this.momentList
    }
  },
  mounted() {
    this.startRotation()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    goToDetail() {
      // 有id就跳详情，没有就跳列表
      if (this.currentMoment.id) {
        this.$router.push(`${this.detailPath}/${this.currentMoment.id}`)
      } else {
        this.$router.push(this.detailPath)
      }
    },
    startRotation() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      // 没有数据就不轮播
      if (!this.momentList || this.momentList.length === 0) return

      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.momentList.length
      }, 4000)
    }
  },
  // 监听数据变化，重启轮播
  watch: {
    momentList: {
      handler() {
        this.currentIndex = 0
        this.startRotation()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.moments-list {
  background: #FFFFFF;
  border: 2px solid #1E1E1E;
  border-radius: 9999px;
  padding: 12px 18px;
  margin-bottom: 0;
  box-shadow: 6px 6px 0 rgba(26, 26, 26, 0.08);
  font-family: "Space Grotesk", "Microsoft YaHei", system-ui, sans-serif;
}

.moments-content {
  .moments-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.moments-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1A1A1A;
  font-weight: 800;
  white-space: nowrap;
  letter-spacing: 0.04em;

  i {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 2px solid #1E1E1E;
    border-radius: 50%;
    background: #A8E6CF;
    color: #1A1A1A;
    font-size: 1.2em;
  }
}

.moment-item {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  max-height: 20px;
  overflow: hidden;
  .moment-text {
    color: #4A4A4A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    cursor: pointer;
    &:hover {
      color: #6F8FA8;
    }
  }
}

@media (max-width: 640px) {
  .moments-content .moments-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .moments-list {
    border-radius: 24px;
  }

  .moment-item {
    width: 100%;
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
