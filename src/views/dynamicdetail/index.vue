<template>
  <div class="article-page" v-loading="loading">
    <!-- 固定操作栏：仅保留点赞、收藏、沉浸式浏览 -->
    <div class="floating-action-bar" :style="{ left: actionBarLeft }">
      <el-tooltip class="item" effect="dark" content="点赞" placement="top-start">
        <div class="action-item" @click="toggleLike">
          <el-badge :value="article.likeNum || 0" class="item">
            <div class="action-button">
              <i class="fas fa-thumbs-up" :class="{ active: article.isLike }"></i>
            </div>
          </el-badge>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="收藏" placement="top-start">
        <div class="action-item" @click="toggleFavorite">
          <el-badge :value="article.favoriteNum || 0" class="item">
            <div class="action-button">
              <i class="fas fa-star" :class="{ active: article.isFavorite }"></i>
            </div>
          </el-badge>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="沉浸式浏览" placement="top-start">
        <div class="action-item" @click="toggleSidebar">
          <div class="action-button">
            <i class="fas fa-expand"></i>
          </div>
        </div>
      </el-tooltip>
    </div>

    <div class="content-layout" id="articleBox" :class="{ center: !showSidebar }">
      <main class="article-main">
        <!-- 文章头部：删除评论数统计项 -->
        <header class="article-header">
          <div class="article-title">{{ article.title }}</div>

          <div class="article-info">
            <div class="author-info">
              <img v-lazy="article.avatar" alt="作者头像" class="author-avatar" src="https://img.shiyit.com/base/mojian/img-error.jpg">
              <div class="author-meta">
                <span class="author-name">{{ article.nickname }}</span>
                <div class="post-meta">
                  <time class="publish-time">
                    <i class="far fa-calendar-alt"></i>
                    {{ article.createTime }}
                  </time>
                  <span class="meta-divider">·</span>
                  <span class="category">
                    <i class="fas fa-folder"></i>
                    {{ article.category.name }}
                  </span>
                </div>
              </div>
            </div>

            <div class="article-stats">
              <div class="stat-item">
                <i class="far fa-eye"></i>
                <span>{{ article.quantity || 0 }} 阅读</span>
              </div>
              <div class="stat-item">
                <i class="far fa-clock"></i>
                <span>{{ readTime }} 分钟</span>
              </div>
            </div>
          </div>
        </header>

        <!-- AI简短介绍：保留 -->
        <div v-if="article.aiDescribe" class="ai-description">
          <div class="ai-header" @click="isAiDescriptionExpanded = !isAiDescriptionExpanded">
            <i class="fas fa-robot"></i>
            <span>AI 摘要</span>
            <i class="fas" :class="isAiDescriptionExpanded ? 'fa-chevron-up' : 'fa-chevron-down'" style="margin-left:auto;"></i>
          </div>
          <transition
              name="expand"
              @enter="startTransition"
              @leave="endTransition"
              mode="out-in"
          >
            <div class="ai-content" v-show="isAiDescriptionExpanded">
              <span class="typing-text" ref="typingText"></span>
              <div class="ai-description-text">
                摘要由平台通过智能技术生成
              </div>
            </div>
          </transition>
        </div>

        <!-- 文章内容：保留 -->
        <article class="article-content">
          <div v-if="article.readType === 1" v-html="article.content"></div>
          <div v-else-if="article.readType === 2" class="locked-content member">
            <div class="preview-content" v-html="getPreviewContent(article.content)"></div>
            <div class="content-locker">
              <div class="locker-icon">
                <i class="fas fa-crown"></i>
              </div>
              <h3>会员专享内容</h3>
              <p>成为会员即可阅读全文</p>
              <el-button type="primary" @click="handleUpgrade">立即开通会员</el-button>
            </div>
          </div>
          <div v-else-if="article.readType === 3" class="locked-content paid">
            <div class="preview-content" v-html="getPreviewContent(article.content)"></div>
            <div class="content-locker">
              <div class="locker-icon">
                <i class="fas fa-lock"></i>
              </div>
              <h3>付费阅读</h3>
              <p>支付 1 元即可阅读全文</p>
              <el-button type="primary" @click="handlePurchase">立即购买</el-button>
            </div>
          </div>
        </article>

        <!-- 文章底部：移除版权声明，保留标签和分享 -->
        <footer class="article-footer">
          <!-- 标签部分保持不变 -->
          <div class="tags-section">
            <i class="fas fa-tags"></i>
            <div class="tags-list">
              <router-link v-for="tag in article.tags || []" :key="tag.id" :to="`/tags?tagId=${tag.id}&tagName=${tag.name}`"
                           class="tag-item">
                {{ tag.name }}
              </router-link>
            </div>
          </div>

          <!-- 修改操作按钮部分 -->
          <div class="article-actions">
            <button class="action-btn like" :class="{ active: article.isLike }" @click="toggleLike">
              <i class="fas fa-heart"></i>
              <span>{{ article.likeNum || 0 }}</span>
            </button>
            <div class="share-dropdown" v-click-outside="closeShareMenu">
              <button class="action-btn share" @click="toggleShareMenu">
                <i class="fas fa-share-alt"></i>
                分享
              </button>
              <div class="share-menu" v-show="showShareMenu">
                <button class="share-item" @click="shareToQQ">
                  <i class="fab fa-qq"></i>
                  QQ好友
                </button>
                <button class="share-item" @click="shareToQzone">
                  <i class="fas fa-star"></i>
                  QQ空间
                </button>
                <button class="share-item" @click="shareToWeibo">
                  <i class="fab fa-weibo"></i>
                  微博
                </button>
                <button class="share-item" @click="shareToWechat">
                  <i class="fab fa-weixin"></i>
                  微信
                </button>
                <button class="share-item" @click="copyLink">
                  <i class="fas fa-link"></i>
                  复制链接
                </button>
              </div>
            </div>
          </div>
        </footer>

        <!-- 移到文章末尾（原评论区位置） -->
        <div class="copyright-section">
          <div class="copyright-notice">
            <div class="notice-header">
              <i class="fas fa-copyright"></i>
              <span>版权声明</span>
            </div>
            <div class="notice-content">
              <div v-if="article.isOriginal" class="notice-item">
                <i class="fas fa-check-circle"></i>
                <span>本文由 {{ article.nickname }} 原创发布</span>
              </div>
              <div v-else class="notice-item">
                <i class="fas fa-share-alt"></i>
                <span>本文转载自：<a :href="article.originalUrl" target="_blank" rel="noopener noreferrer" :href="article.originalUrl || '#'">{{ article.originalUrl || '未知来源' }}</a></span>
              </div>
              <div class="notice-item">
                <i class="fas fa-calendar-alt"></i>
                <span>发布时间：{{ article.createTime }}</span>
              </div>
              <div class="notice-item">
                <i class="fab fa-creative-commons-sa"></i>
                <span>
                  版权协议：
                  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
                    CC BY-NC-SA 4.0
                  </a>
                </span>
              </div>
              <div class="notice-item notice-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>未经许可，禁止转载、摘编、复制或建立镜像。欢迎转发分享！</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <mj-image-preview ref="imagePreview" />
    <payment-dialog
        :visible.sync="showPaymentDialog"
        :title="article.title"
        :price="1"
        :article-id="$route.params.id"
        @payment-success="handlePaymentSuccess"
    />
    <membership-dialog
        :visible.sync="showMembershipDialog"
        @payment-success="handleMembershipSuccess"
    />
  </div>
</template>

<script>
import { getArticleDetailApi, likeArticleApi } from '@/api/article'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import PaymentDialog from '@/components/PaymentDialog/index.vue'
import MembershipDialog from '@/components/MembershipDialog/index.vue'
import { marked } from 'marked'

export default {
  name: 'DynamicDetail',
  components: {
    PaymentDialog,
    MembershipDialog
  },
  props: {
    id: {
      type: [String, Number],
      required: false,
      default: ''
    }
  },
  data() {
    return {
      article: {
        title: '',
        category: {},
        isOriginal: true,
        readType: 1,
        price: 0,
        likeNum: 0,
        favoriteNum: 0,
        quantity: 0,
        aiDescribe: '',
        isLike: false,
        isFavorite: false,
        isDislike: false,
        dislikeNum: 0,
        tags: [],
        nickname: '',
        createTime: '',
        avatar: '',
        content: '',
        originalUrl: ''
      },
      readProgress: 0,
      showShareMenu: false,
      readTime: 0,
      likeDebounce: false,
      loading: false,
      actionBarLeft: '0px',
      showSidebar: false,
      collapsedCodeBlocks: new Set(),
      images: [],
      showPaymentDialog: false,
      showMembershipDialog: false,
      isAiDescriptionExpanded: true
    }
  },
  computed: {
    currentUrl() {
      return window.location.href
    }
  },
  methods: {
    async getArticle() {
      this.loading = true
      hljs.configure({
        ignoreUnescapedHTML: true
      })
      try {
        // 优先使用props的id，没有则用路由参数
        const dynamicId = this.id || this.$route.params.id
        const res = await getArticleDetailApi(dynamicId)
        this.article = {
          ...this.article, // 合并默认值，避免未定义
          ...res.data,
          content: res.data.content ? this.addLazyLoadToImages(res.data.content) : ''
        }

        await this.$nextTick()
        setTimeout(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block)
          })
          this.addCopyButtons()
          this.addLineNumbers()
          this.initImagePreview()
          this.updateActionBarPosition()
          this.initializeCodeBlocks()

          if (this.article.aiDescribe) {
            const typingText = this.$refs.typingText
            if (typingText) {
              const htmlContent = marked(this.article.aiDescribe || '')
              typingText.innerHTML = htmlContent
            }
          }
        }, 100)

        const textContent = this.article.content.replace(/<[^>]+>/g, ' ')
        this.readTime = Math.ceil(textContent.split(/\s+/).length / 300)
      } catch (error) {
        this.$message.error('获取动态详情失败')
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    addLazyLoadToImages(content) {
      return content.replace(
          /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
          '<img$1src="' + this.getLoadingImage() + '" data-src="$2" class="lazy-image" alt="文章图片" $3>'
      )
    },
    getLoadingImage() {
      return 'https://img.shiyit.com/base/mojian/lazy.gif'
    },
    toggleLike() {
      if (this.likeDebounce) {
        this.$message.warning('请于 5 秒后再试')
        return
      }
      const dynamicId = this.id || this.$route.params.id
      likeArticleApi(dynamicId).then(() => {
        if (this.article.isLike) {
          this.article.likeNum--
        } else {
          this.article.likeNum++
        }
        this.$message.success(this.article.isLike ? '取消点赞成功' : '点赞成功')
        this.article.isLike = !this.article.isLike
        this.likeDebounce = true
        setTimeout(() => {
          this.likeDebounce = false
        }, 5000)
      })
    },
    toggleShareMenu() {
      this.showShareMenu = !this.showShareMenu
    },
    closeShareMenu() {
      this.showShareMenu = false
    },
    shareToQQ() {
      const url = encodeURIComponent(this.currentUrl)
      const title = encodeURIComponent(this.article.title)
      const summary = encodeURIComponent(this.article.summary || '')
      const pic = encodeURIComponent(this.article.avatar || '')
      window.open(
          `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${summary}&pics=${pic}`,
          "renren-share", "width=490,height=700")
      this.closeShareMenu()
    },
    shareToQzone() {
      const url = encodeURIComponent(this.currentUrl)
      const title = encodeURIComponent(this.article.title)
      const summary = encodeURIComponent(this.article.summary || '')
      const pic = encodeURIComponent(this.article.avatar || '')
      window.open(
          `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}&summary=${summary}&pics=${pic}`,
          "renren-share", "width=490,height=700"
      )
      this.closeShareMenu()
    },
    shareToWeibo() {
      const url = encodeURIComponent(this.currentUrl)
      const title = encodeURIComponent(`${this.article.title} - 拾壹博客`)
      window.open(
          `https://service.weibo.com/share/share.php?url=${url}&title=${title}`, // 修复HTTP不安全链接
          "renren-share", "width=490,height=700")
      this.closeShareMenu()
    },
    shareToWechat() {
      window.open(
          `https://api.pwmqr.com/qrcode/create/?url=${window.location.href}`,
          "renren-share", "width=490,height=700")
      this.closeShareMenu()
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.currentUrl)
        this.$message.success('链接已复制到剪贴板')
      } catch (err) {
        this.$message.error('复制失败，请手动复制')
      }
      this.closeShareMenu()
    },
    addCopyButtons() {
      const codeBlocks = document.querySelectorAll('.article-content pre')
      if (!codeBlocks.length) return

      codeBlocks.forEach(pre => {
        if (pre.querySelector('.code-header')) return

        const buttonWrapper = document.createElement('div')
        buttonWrapper.className = 'code-header'

        const copyButton = document.createElement('button')
        copyButton.className = 'copy-button'
        copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制' // 修复多余<符号
        copyButton.title = '复制代码'

        copyButton.addEventListener('click', async () => {
          try {
            const code = pre.querySelector('code')
            await navigator.clipboard.writeText(code.textContent)
            copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制'
            copyButton.classList.add('copied')
            setTimeout(() => {
              copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制'
              copyButton.classList.remove('copied')
            }, 2000)
            this.$message.success('复制成功')
          } catch (err) {
            this.$message.error('复制失败，请手动复制')
          }
        })

        buttonWrapper.appendChild(copyButton)
        pre.appendChild(buttonWrapper)
      })
    },
    initImagePreview() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            const actualSrc = img.getAttribute('data-src')
            if (actualSrc) {
              const tempImg = new Image()
              tempImg.onload = () => {
                img.src = actualSrc
                img.classList.add('loaded')
              }
              tempImg.onerror = () => {
                img.src = 'https://img.shiyit.com/base/mojian/img-error.jpg'
                img.classList.add('error')
              }
              tempImg.src = actualSrc
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      })

      setTimeout(() => {
        const lazyImages = document.querySelectorAll('.lazy-image')
        lazyImages.forEach(img => {
          observer.observe(img)
        })

        this.images = Array.from(document.querySelectorAll('.article-content img')).map(img =>
            img.getAttribute('data-src') || img.getAttribute('src')
        )

        document.querySelectorAll('.article-content img').forEach(img => {
          img.style.cursor = 'zoom-in'
          img.addEventListener('click', this.handleImageClick)
        })
      }, 200)
    },
    handleImageClick(e) {
      const img = e.target
      if (img.tagName === 'IMG') {
        if (this.$refs.imagePreview) {
          this.$refs.imagePreview.show(this.images, this.images.indexOf(img.src))
        }
      }
    },
    toggleFavorite() {
      this.$message.warning('暂未开放')
      // 移除不可达代码
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
      this.$nextTick(() => {
        this.updateActionBarPosition()
      })
    },
    updateActionBarPosition() {
      const articleBox = document.getElementById("articleBox")
      if (articleBox) {
        const rect = articleBox.getBoundingClientRect()
        this.actionBarLeft = (rect.left - 95) + 'px'
      }
    },
    initializeCodeBlocks() {
      const codeBlocks = document.querySelectorAll('.article-content pre')
      codeBlocks.forEach((pre, index) => {
        const oldButton = pre.querySelector('.expand-button')
        if (oldButton) {
          oldButton.remove()
        }

        const actualHeight = pre.scrollHeight

        if (actualHeight > 500) {
          pre.classList.add('collapsed')

          const expandButton = document.createElement('button')
          expandButton.className = 'expand-button'
          expandButton.innerHTML = '<i class="fas fa-chevron-down"></i>展开代码'

          expandButton.onclick = (e) => {
            e.stopPropagation()
            const isCollapsed = pre.classList.contains('collapsed')
            if (isCollapsed) {
              pre.classList.remove('collapsed')
              expandButton.innerHTML = '<i class="fas fa-chevron-up"></i>收起代码'
              this.collapsedCodeBlocks.delete(index)
            } else {
              pre.classList.add('collapsed')
              expandButton.innerHTML = '<i class="fas fa-chevron-down"></i>展开代码'
              this.collapsedCodeBlocks.add(index)
            }
          }

          pre.appendChild(expandButton)
        }
      })
    },
    addLineNumbers() {
      const codeBlocks = document.querySelectorAll('.article-content pre code')
      codeBlocks.forEach((code) => {
        const pre = code.parentElement

        if (!pre.querySelector('.line-numbers')) {
          const lines = code.textContent.split('\n').length
          const lineNumbers = document.createElement('div')
          lineNumbers.className = 'line-numbers'

          for (let i = 1; i <= lines; i++) {
            const span = document.createElement('span')
            span.textContent = i
            lineNumbers.appendChild(span)
          }

          pre.insertBefore(lineNumbers, code)
        }
      })
    },
    getPreviewContent(content) {
      const div = document.createElement('div')
      div.innerHTML = content
      const text = div.textContent || div.innerText
      return text.substring(0, 300) + '...'
    },
    handleUpgrade() {
      if (!this.$store?.state?.userInfo) { // 可选链避免报错
        this.$message.warning('请先登录')
        return
      }
      this.showMembershipDialog = true
    },
    handlePurchase() {
      if (!this.$store?.state?.userInfo) {
        this.$message.warning('请先登录')
        return
      }
      this.showPaymentDialog = true
    },
    handlePaymentSuccess() {
      this.getArticle()
    },
    handleMembershipSuccess() {
      this.getArticle()
    },
    startTransition(element) {
      element.style.height = 'auto'
      const height = element.scrollHeight
      element.style.height = '0px'
      element.offsetHeight
      element.style.height = height + 'px'
    },
    endTransition(element) {
      element.style.height = element.scrollHeight + 'px'
      element.offsetHeight
      element.style.height = '0px'
    }
  },
  async created() {
    await this.getArticle()
    window.addEventListener('resize', this.updateActionBarPosition)
  },
  mounted() {
    this.$nextTick(() => {
      this.initImagePreview()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateActionBarPosition)
    const images = document.querySelectorAll('.article-content img')
    images.forEach(img => {
      img.removeEventListener('click', this.handleImageClick)
    })
  },
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.getArticle()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 定义缺失的SCSS变量（匹配项目通用样式）
$spacing-xl: 20px;
$spacing-lg: 16px;
$spacing-md: 12px;
$spacing-sm: 8px;
$border-radius-lg: 8px;
$shadow-md: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

// 混入响应式方法
@mixin responsive($breakpoint) {
  @if $breakpoint == lg {
    @media (max-width: 1024px) {
      @content;
    }
  }
}

// 新增版权声明区域样式（移到末尾后）
.copyright-section {
  padding: $spacing-xl;
  background: var(--card-bg, #fff);
  border-top: 1px solid var(--border-color, #e5e7eb);
}

// 保留原有布局
.article-page {
  max-width: 1300px;
  margin: 0 auto;
  padding: $spacing-lg;
  @include responsive(lg) {
    padding: $spacing-sm;
  }
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1100px;
  margin: 0 auto;
  gap: $spacing-md * 2;
  transition: all 0.3s ease;

  @include responsive(lg) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    padding: 0;
  }
}

.article-main {
  background: var(--card-bg, #fff);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
}

// 补充基础样式避免布局错乱
.floating-action-bar {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
}

.action-item {
  margin: 10px 0;
  cursor: pointer;
}

.article-header {
  padding: $spacing-lg;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.article-content {
  padding: $spacing-lg;
}

.article-footer {
  padding: $spacing-lg;
  border-top: 1px solid var(--border-color, #e5e7eb);
}
</style>