<script setup>
import { ref } from 'vue'

// 云计算存储中心数据
const storageCenter = ref({
  title: '云计算存储中心',
  englishTitle: 'Cloud Computing Storage Center',
  description: '山东大学（威海）超级计算中心是校区重要的高性能计算平台，其核心是一个采用了CPU、GPU、MIC三重异构架构的高性能计算集群。根据其官网信息，该集群总计拥有856个CPU计算核心，结合GPU与MIC节点的算力，整体理论计算峰值超过41Tflops（即每秒41万亿次浮点运算），并配备了200TB容量的Lustre并行存储系统，能为校内的科研工作提供强大的计算与数据处理支持。',
  imageUrl: '/images/computing.jpg'
})

// PDS实验室数据
const pdsLab = ref({
  title: 'PDS实验室',
  englishTitle: 'PDS Laboratory',
  description: '山东大学（威海）的行星数据系统实验室（简称PDS实验室）是国内行星科学领域一个特色鲜明的国家级科研与教学平台。该实验室于2007年与美国华盛顿大学圣路易斯分校合作建立，是国内首个按照美国宇航局标准建设的行星科学机构，旨在服务于国家嫦娥工程、天问一号火星探测等重大深空探测战略。',
  imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
})
</script>

<template>
  <div class="academic-page">
    <!-- 云计算存储中心部分 -->
    <section class="academic-section cloud-storage-section">
      <!-- 标题区域 -->
      <header class="section-header">
        <div class="title-container">
          <h1 class="main-title">{{ storageCenter.title }}</h1>
          <h2 class="sub-title">{{ storageCenter.englishTitle }}</h2>
          <div class="title-divider"></div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="section-content">
        <!-- 左侧文字描述 -->
        <div class="text-content">
          <div class="description-wrapper">
            <p class="description">{{ storageCenter.description }}</p>
            <p class="additional-description">
              机房采用了业界先进的自适应液态冷却系统，专门为高密度、高功耗的计算设备提供高效、静音的散热保障，确保了整个计算平台的稳定可靠运行，为校内的科研项目提供了坚实的算力支撑。
            </p>

          </div>
        </div>

        <!-- 右侧图片 -->
        <div class="image-content">
          <div class="image-wrapper">
            <img
                :src="storageCenter.imageUrl"
                :alt="storageCenter.title"
                class="main-image"
            />
            <div class="image-caption">
              云计算存储中心基础设施 - 高标准数据中心机房
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PDS实验室部分 -->
    <section class="academic-section pds-section">
      <!-- 标题区域 -->
      <header class="section-header">
        <div class="title-container">
          <h1 class="main-title">{{ pdsLab.title }}</h1>
          <h2 class="sub-title">{{ pdsLab.englishTitle }}</h2>
          <div class="title-divider"></div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="section-content">
        <!-- 左侧文字描述 -->
        <div class="text-content">
          <div class="description-wrapper">
            <p class="description">{{ pdsLab.description }}</p>
            <p class="additional-description">
              PDS实验室以行星遥感与地质学、陨石与行星样品分析为核心研究方向，并建立了配套的行星光谱学、表面物质与环境模拟等专业实验室。作为山东大学空间科学研究院行星科学研究中心以及山东省光学天文与日地空间环境重点实验室的核心组成部分，实验室在凌宗成教授带领下，不仅深度参与了我国多项深空探测任务的数据分析和标准制定工作，还通过“天文与空间科学菁英班”以及与华盛顿大学等机构的联合培养项目，致力于培养行星科学领域的拔尖创新人才，是我国连接行星科学前沿研究与国家深空探测工程应用的重要桥梁。
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
              PDS实验室
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
.academic-page {
  padding: 3rem 2rem;
  font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif; /* 更换为无衬线字体，更适合显示数字 */
  background: #f8f9fa;
  color: #2c3e50;
  line-height: 1.6; /* 调整行高 */
}

.academic-section {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
  padding: 3rem;
  border-left: 4px solid #3498db;

  &.pds-section {
    border-left-color: #2ecc71;
  }
}

.section-header {
  margin-bottom: 2.5rem;
  text-align: center;

  .title-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .main-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.8rem;
    letter-spacing: 0.5px;
    font-family: 'Georgia', 'SimHei', serif;
    text-transform: none; /* 确保不转换大小写 */
  }

  .sub-title {
    font-size: 1.3rem;
    font-weight: 400;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
    font-style: normal;
    font-family: 'Georgia', 'SimSun', serif; /* 改为衬线字体 */
  }

  .title-divider {
    width: 100px;
    height: 2px;
    background: #3498db;
    margin: 0 auto;

    .pds-section & {
      background: #2ecc71;
    }
  }
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 3rem;
  align-items: start;
  min-height: auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    min-height: auto;
  }
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .description-wrapper {
    .description {
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      line-height: 1.7;
      font-weight: 400;
      text-align: justify;
      font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif; /* 更换字体 */
      letter-spacing: normal; /* 恢复正常字间距 */
    }

    .additional-description {
      font-size: 1rem;
      color: #34495e;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      text-align: justify;
      font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif; /* 更换字体 */
      font-weight: 400;
      letter-spacing: normal; /* 恢复正常字间距 */

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.image-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #ecf0f1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .main-image {
      width: 100%;
      height: 450px;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }

    .image-caption {
      padding: 1.2rem 1.5rem;
      background: #f8f9fa;
      color: #7f8c8d;
      font-size: 1rem;
      text-align: center;
      border-top: 1px solid #ecf0f1;
      font-style: italic;
      font-family: 'Georgia', 'SimSun', serif; /* 改为衬线字体 */
      font-weight: 500;
    }
  }
}

.page-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #bdc3c7;
  text-align: center;

  .footer-text {
    color: #7f8c8d;
    font-size: 1rem; /* 稍大字体 */
    font-style: italic;
    font-family: 'Georgia', 'Times New Roman', serif; /* 学术字体 */
    font-weight: 400;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .academic-page {
    padding: 2rem 1rem;
  }

  .academic-section {
    padding: 2rem 1.5rem;
    margin-bottom: 2rem;
  }

  .section-header {
    margin-bottom: 2rem;

    .main-title {
      font-size: 2rem;
    }

    .sub-title {
      font-size: 1.1rem;
    }
  }

  .section-content {
    gap: 2rem;
    min-height: auto;
  }

  .text-content {
    .description-wrapper {
      .description {
        font-size: 1.15rem;
        line-height: 1.75;
      }

      .additional-description {
        font-size: 1.1rem;
        line-height: 1.7;
      }
    }
  }

  .image-content .image-wrapper .main-image {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .section-header {
    .main-title {
      font-size: 1.7rem;
    }

    .sub-title {
      font-size: 1rem;
    }
  }

  .academic-section {
    padding: 1.5rem 1rem;
  }

  .image-content .image-wrapper .main-image {
    height: 280px;
  }

  .text-content .description-wrapper {
    .description {
      font-size: 1.1rem;
      line-height: 1.7;
    }

    .additional-description {
      font-size: 1.05rem;
      line-height: 1.65;
    }
  }
}
</style>