<script setup>
import { ref } from 'vue'

// 云计算存储中心数据
const storageCenter = ref({
  title: '云计算存储中心',
  englishTitle: 'Cloud Computing Storage Center',
  description: '云计算存储中心是现代企业数据基础设施的核心组成部分，提供安全、可靠、弹性可扩展的数据存储服务。中心采用分布式存储架构和多重数据冗余技术，确保数据的高可用性和持久性。',
  imageUrl: '/images/computing.jpg'
})

// PDS实验室数据
const pdsLab = ref({
  title: 'PDS实验室',
  englishTitle: 'PDS Laboratory',
  description: 'PDS实验室专注于数据存储技术的研究与开发，致力于推动存储技术的创新与突破。实验室拥有一流的研发团队和先进的测试环境，为云计算存储中心提供核心技术支持。',
  imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
})
</script>

<template>
  <div class="content-page">
    <!-- 云计算存储中心部分 -->
    <section class="content-section cloud-storage-section">
      <!-- 标题区域 -->
      <header class="section-header">
        <h1 class="main-title">{{ storageCenter.title }}</h1>
        <h2 class="sub-title">{{ storageCenter.englishTitle }}</h2>
        <div class="title-divider"></div>
      </header>

      <!-- 内容区域 - 调整比例让图片更大 -->
      <div class="section-content cloud-storage-content">
        <!-- 左侧文字描述 -->
        <div class="text-content cloud-text">
          <div class="description-wrapper">
            <p class="description">{{ storageCenter.description }}</p>
            <p class="additional-description">
              该中心采用最新的全闪存架构和智能数据管理平台，通过AI算法优化数据分布和访问路径，
              显著提升I/O性能并降低能耗。同时，提供完善的数据迁移、容灾备份和合规性管理工具，
              满足企业级应用对数据存储的全方位需求。
            </p>
            <p class="additional-description">
              云计算存储中心支持多协议访问，包括S3、NFS、CIFS等，兼容各类应用系统。
              通过全球内容分发网络，实现数据的低延迟访问，为全球用户提供一致的高质量服务体验。
            </p>
          </div>
        </div>

        <!-- 右侧图片 - 加大图片区域 -->
        <div class="image-content cloud-image">
          <div class="image-wrapper cloud-image-wrapper">
            <img
                :src="storageCenter.imageUrl"
                :alt="storageCenter.title"
                class="main-image cloud-main-image"
            />
            <div class="image-caption">
              云计算存储中心基础设施 - 高标准数据中心机房
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PDS实验室部分 -->
    <section class="content-section pds-section">
      <!-- 标题区域 -->
      <header class="section-header">
        <h1 class="main-title">{{ pdsLab.title }}</h1>
        <h2 class="sub-title">{{ pdsLab.englishTitle }}</h2>
        <div class="title-divider"></div>
      </header>

      <!-- 内容区域 -->
      <div class="section-content">
        <!-- 左侧文字描述 -->
        <div class="text-content">
          <div class="description-wrapper">
            <p class="description">{{ pdsLab.description }}</p>
            <p class="additional-description">
              PDS实验室致力于存储技术的前沿研究，涵盖新型存储介质、存储架构优化、
              数据压缩算法、存储安全等多个方向。实验室与国内外多所高校和研究机构建立合作关系，
              共同推动存储技术的发展。
            </p>
            <p class="additional-description">
              实验室配备先进的测试设备，包括高性能服务器集群、全闪存阵列、
              网络模拟环境等，能够模拟各种复杂的应用场景，为存储产品的研发提供可靠的测试环境。
            </p>
          </div>
        </div>

        <!-- 右侧图片 -->
        <div class="image-content">
          <div class="image-wrapper">
            <img
                :src="pdsLab.imageUrl"
                :alt="pdsLab.title"
                class="main-image"
            />
            <div class="image-caption">
              PDS实验室内部 - 研发与测试环境
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="page-footer">
      <p class="footer-text">云计算存储中心 & PDS实验室 - 创新驱动未来</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.content-page {
  max-width: 1600px; /* 增加最大宽度 */
  margin: 0 auto;
  padding: 2rem 2rem 1rem;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  color: #333;
}

.content-section {
  margin-bottom: 4rem;

  &.pds-section {
    padding-top: 2rem;
    border-top: 2px solid #f0f0f0;
  }
}

.section-header {
  margin-bottom: 2.5rem;

  .main-title {
    font-size: 2.8rem;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
  }

  .sub-title {
    font-size: 1.5rem;
    font-weight: 400;
    color: #4a5568;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .title-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #4299e1, #38b2ac);
  }
}

/* 默认的左右布局 */
.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* 云计算存储中心特殊布局 - 图片更大 */
.cloud-storage-content {
  grid-template-columns: 1fr 1.5fr; /* 图片区域更宽 */
  gap: 4rem; /* 增加间距 */

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.cloud-text {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中文字 */
}

.cloud-image {
  .cloud-image-wrapper {
    border-radius: 16px; /* 更大的圆角 */
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); /* 更强的阴影 */
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    height: 100%; /* 占满高度 */
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-8px) scale(1.01); /* 更强的悬停效果 */
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
    }

    .cloud-main-image {
      width: 100%;
      height: 500px; /* 固定高度，图片更大 */
      object-fit: cover; /* 保持图片比例并填满容器 */
      display: block;
      transition: transform 0.7s ease;

      &:hover {
        transform: scale(1.05); /* 图片悬停放大效果 */
      }

      @media (max-width: 768px) {
        height: 350px; /* 移动端调整高度 */
      }
    }

    .image-caption {
      padding: 1.2rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
      color: #2d3748; /* 更深的文字颜色 */
      font-size: 1.1rem; /* 稍大的字体 */
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-style: italic;
      font-weight: 500;
    }
  }
}

/* PDS实验室保持原样 */
.pds-section {
  .section-header {
    .main-title {
      color: #2d3748;
    }

    .title-divider {
      background: linear-gradient(to right, #38b2ac, #4299e1);
    }
  }

  .image-content .image-wrapper {
    box-shadow: 0 15px 35px rgba(56, 178, 172, 0.1);

    .main-image {
      height: 400px; /* PDS图片保持较小高度 */
      object-fit: cover;

      @media (max-width: 768px) {
        height: 300px;
      }
    }
  }
}

.text-content {
  .description-wrapper {
    .description {
      font-size: 1.2rem;
      color: #2d3748;
      margin-bottom: 1.5rem;
      line-height: 1.8;
      font-weight: 500;
    }

    .additional-description {
      font-size: 1.1rem;
      color: #4a5568;
      line-height: 1.7;
      margin-bottom: 1.2rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* 普通图片样式 */
.image-content:not(.cloud-image) {
  .image-wrapper {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .main-image {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.03);
      }
    }

    .image-caption {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      color: #4a5568;
      font-size: 1rem;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-style: italic;
    }
  }
}

.page-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
  text-align: center;

  .footer-text {
    color: #718096;
    font-size: 1rem;
    font-style: italic;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .content-page {
    padding: 1.5rem;
  }

  .section-header {
    margin-bottom: 2rem;

    .main-title {
      font-size: 2.2rem;
    }

    .sub-title {
      font-size: 1.3rem;
    }
  }

  .section-content,
  .cloud-storage-content {
    gap: 1.5rem;
  }

  .text-content {
    .description-wrapper {
      .description {
        font-size: 1.1rem;
      }

      .additional-description {
        font-size: 1rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .section-header {
    .main-title {
      font-size: 1.8rem;
    }

    .sub-title {
      font-size: 1.1rem;
    }
  }
}
</style>