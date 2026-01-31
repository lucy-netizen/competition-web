<script setup>
import { ref, computed } from 'vue'

// PDS实验室数据（保留文字）
const pdsLab = ref({
  title: 'PDS实验室',
  englishTitle: 'PDS Laboratory',
  description: '山东大学威海行星数据系统实验室（PDS）为国内首家符合NASA标准的行星数据系统实验室，由山东大学与圣路易斯华盛顿大学行星数据系统地球科学节点合作建立，存档了国际行星探测任务的科学数据镜像近100 TB，可为月球地形地貌研究提供强有力的数据支撑。',
  images: [
    { url: 'public/images/computing.jpg', caption: 'PDS实验室数据处理中心' },
    { url: 'public/images/pds.jpg', caption: 'PDS实验室工作环境' }
  ]
})

// 行星表面物质实验室（只有图片）
const surfaceLab = ref({
  title: '行星表面物质实验室',
  englishTitle: 'Planetary Surface Materials Laboratory',
  images: [
    { url: 'public/images/surface.jpg', caption: '行星表面物质实验室'}
  ]})

// 行星环境模拟实验室（只有图片）
const environmentLab = ref({
  title: '行星环境模拟实验室',
  englishTitle: 'Planetary Environment Simulation Laboratory',
  images: [
    { url: 'public/images/moni.jpg', caption: '行星环境模拟实验室' }
  ]
})

// 理化与材料测试中心设备（更新：添加链接）
const testingCenter = ref({
  title: '理化与材料测试中心',
  englishTitle: 'Physical & Chemical Testing Center',
  instruments: [
    {
      name: '场发射电子探针显微分析仪',
      image: 'public/images/test.jpg',
      link: ''
    },
    {
      name: '场发射扫描电子显微镜',
      image: 'public/images/micro.jpg',
      link: 'http://dxyq.wh.sdu.edu.cn/genee/equipment/35'
    },
    {
      name: 'X射线衍射仪',
      image: 'public/images/x.jpg',
      link: 'http://dxyq.wh.sdu.edu.cn/genee/equipment/32'
    },
    {
      name: '傅里叶中红外光谱仪',
      image: 'public/images/red.jpg',
      link: ''
    },
    {
      name: '可见近红外光谱仪',
      image: 'public/images/visible.jpg',
      link: 'http://dxyq.wh.sdu.edu.cn/genee/equipment/34'
    }
  ]
})

// 计算属性，将设备分成两行
const firstRowInstruments = computed(() => testingCenter.value.instruments.slice(0, 3))
const secondRowInstruments = computed(() => testingCenter.value.instruments.slice(3, 5))

// 点击仪器图片的处理函数
const handleInstrumentClick = (instrument) => {
  if (instrument.link) {
    window.open(instrument.link, '_blank')
  }
}
</script>

<template>
  <div class="academic-page">
    <!-- PDS实验室部分（保留文字） -->
    <section class="academic-section pds-section">
      <header class="section-header">
        <div class="title-container">
          <h1 class="main-title">{{ pdsLab.title }}</h1>
          <h2 class="sub-title">{{ pdsLab.englishTitle }}</h2>
          <div class="title-divider"></div>
        </div>
      </header>

      <div class="section-content">
        <div class="text-content">
          <div class="description-wrapper">
            <p class="description">{{ pdsLab.description }}</p>
          </div>
        </div>

        <div class="image-content double-images">
          <div class="image-wrapper" v-for="(image, index) in pdsLab.images" :key="index">
            <img
                :src="image.url"
                :alt="image.caption"
                class="lab-image"
            />
            <div class="image-caption">
              {{ image.caption }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 行星表面物质实验室和行星环境模拟实验室并列显示 -->
    <div class="labs-row">
      <!-- 行星表面物质实验室（只有图片） -->
      <section class="academic-section surface-section small-section">
        <header class="section-header">
          <div class="title-container">
            <h1 class="main-title">{{ surfaceLab.title }}</h1>
            <h2 class="sub-title">{{ surfaceLab.englishTitle }}</h2>
            <div class="title-divider"></div>
          </div>
        </header>

        <div class="section-content image-only">
          <div class="image-content single-image">
            <div class="image-wrapper">
              <img
                  :src="surfaceLab.images[0].url"
                  :alt="surfaceLab.images[0].caption"
                  class="lab-image"
              />
              <div class="image-caption">
                {{ surfaceLab.images[0].caption }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 行星环境模拟实验室（只有图片） -->
      <section class="academic-section environment-section small-section">
        <header class="section-header">
          <div class="title-container">
            <h1 class="main-title">{{ environmentLab.title }}</h1>
            <h2 class="sub-title">{{ environmentLab.englishTitle }}</h2>
            <div class="title-divider"></div>
          </div>
        </header>

        <div class="section-content image-only">
          <div class="image-content single-image">
            <div class="image-wrapper">
              <img
                  :src="environmentLab.images[0].url"
                  :alt="environmentLab.images[0].caption"
                  class="lab-image"
              />
              <div class="image-caption">
                {{ environmentLab.images[0].caption }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 理化与材料测试中心（只有图片网格） -->
    <section class="academic-section testing-section">
      <header class="section-header">
        <div class="title-container">
          <h1 class="main-title">{{ testingCenter.title }}</h1>
          <h2 class="sub-title">{{ testingCenter.englishTitle }}</h2>
          <div class="title-divider"></div>
        </div>
      </header>

      <div class="section-content image-only">
        <!-- 第一行：3个设备 -->
        <div class="instruments-grid first-row">
          <div
              class="instrument-card"
              v-for="(instrument, index) in firstRowInstruments"
              :key="index"
              :class="{ 'has-link': instrument.link }"
              @click="handleInstrumentClick(instrument)"
          >
            <div class="instrument-image-wrapper">
              <img
                  :src="instrument.image"
                  :alt="instrument.name"
                  class="instrument-image"
              />
            </div>
            <div class="instrument-info">
              <h3 class="instrument-name">{{ instrument.name }}</h3>
              <div v-if="instrument.link" class="instrument-link-hint">
                <span class="link-icon">🔗</span>
                <span class="link-text">点击查看详情</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二行：2个设备，宽度更大 -->
        <div class="instruments-grid second-row">
          <div
              class="instrument-card wide-card"
              v-for="(instrument, index) in secondRowInstruments"
              :key="index"
              :class="{ 'has-link': instrument.link }"
              @click="handleInstrumentClick(instrument)"
          >
            <div class="instrument-image-wrapper">
              <img
                  :src="instrument.image"
                  :alt="instrument.name"
                  class="instrument-image"
              />
            </div>
            <div class="instrument-info">
              <h3 class="instrument-name">{{ instrument.name }}</h3>
              <div v-if="instrument.link" class="instrument-link-hint">
                <span class="link-icon">🔗</span>
                <span class="link-text">点击查看详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="page-footer">
      <p class="footer-text">行星科学实验室平台 - 探索宇宙奥秘，服务国家战略</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.academic-page {
  padding: 1.5rem 1rem;
  font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif;
  background: #f8f9fa;
  color: #2c3e50;
  line-height: 1.6;
}

.academic-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-left: 4px solid #3498db;

  &.pds-section {
    border-left-color: #05a346; // 绿色
  }

  &.surface-section {
    border-left-color: #0c4c8e; // 深蓝色
  }

  &.environment-section {
    border-left-color: #4f9ce8; // 浅蓝色
  }

  &.testing-section {
    border-left-color: #9b59b6; // 紫色
  }
}

.section-header {
  margin-bottom: 1.25rem;
  text-align: center;


  .title-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .main-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.4rem;
    letter-spacing: 0.5px;
    font-family: 'Georgia', 'SimHei', serif;
    text-transform: none;
  }

  .sub-title {
    font-size: 0.8rem;
    font-weight: 400;
    color: #7f8c8d;
    margin-bottom: 0.75rem;
    font-style: normal;
    font-family: 'Georgia', 'SimSun', serif;
  }

  .title-divider {
    width: 100px;
    height: 3px;
    background: #3498db;
    margin: 0 auto;

  }
}

// 通用内容布局
.section-content {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 1.5rem;
  align-items: start;
  min-height: auto;

  &.image-only {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;

    &.image-only {
      flex-direction: column;
    }
  }
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .description-wrapper {
    .description {
      font-size: 1rem;
      color: #2c3e50;
      margin-bottom: 0.75rem;
      line-height: 1.7;
      font-weight: 400;
      text-align: justify;
      font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif;
      letter-spacing: normal;
    }
  }
}

// 图片区域样式
.image-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &.double-images {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    height: auto;

    .image-wrapper {
      height: 100%;
    }
  }

  &.single-image {
    .image-wrapper {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;

      &.large-image {
        max-width: 900px;
      }
    }
  }

  .image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgb(148, 198, 232);
    border: 1px solid #94c6e8;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgb(241, 249, 255);
    }

    .lab-image {
      width: 100%;
      height: 350px; /* 从250px增大到350px */
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .image-caption {
      padding: 0.25rem 0.75rem;
      background: #f8f9fa;
      color: #7f8c8d;
      font-size: 0.65rem;
      text-align: center;
      border-top: 1px solid #ecf0f1;
      font-style: italic;
      font-family: 'Georgia', 'SimSun', serif;
      font-weight: 500;
    }
  }
}

// 仪器设备网格 - 第一行（3个设备）
.instruments-grid {
  &.first-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    width: 80%;
    .instrument-info {
      min-height: auto;
      padding: 0.1px;
    }
    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &.second-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    width: auto;
    height: auto;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.instrument-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(148, 198, 232);
  border: 1px solid #94c6e8;
  transition: all 0.3s ease;
  height: 280px; /* 从200px增大到280px */
  display: flex;
  flex-direction: column;
  cursor: default;

  &.has-link {
    cursor: pointer;
    position: relative;

    &:hover {
      border-color: #3498db;
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.2);

      .instrument-image {
        transform: scale(1.1);
      }

      .instrument-link-hint {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgb(241, 249, 255);

    .instrument-image {
      transform: scale(1.1);
    }
  }

  // 第二行的卡片宽度更大
  &.wide-card {
    .instrument-image-wrapper {
      height: auto;
    }

    .instrument-info {
      min-height: auto;
      padding: 0;
    }
  }

  .instrument-image-wrapper {
    height: 280px; /* 从200px增大到280px */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);

    .instrument-image {
      width: 700px;
      max-width: 200%;
      height: 245px; /* 从175px增大到245px */
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.5s ease;
    }
  }

  .instrument-info {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 45px;
    position: relative;

    .instrument-name {
      font-size: 0.7rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
      font-family: 'Georgia', 'SimHei', serif;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .instrument-link-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      margin-top: 0.25rem;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.3s ease;

      .link-icon {
        font-size: 0.5rem;
      }

      .link-text {
        font-size: 0.45rem;
        color: #3498db;
        font-weight: 500;
      }
    }
  }
}

.page-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #bdc3c7;
  text-align: center;

  .footer-text {
    color: #7f8c8d;
    font-size: 0.5rem;
    font-style: italic;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-weight: 400;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .academic-page {
    padding: 1rem 0.5rem;
  }

  .academic-section {
    padding: 1rem 0.75rem;
    margin-bottom: 1rem;
  }

  .section-header {
    margin-bottom: 1rem;

    .main-title {
      font-size: 1.25rem;
    }

    .sub-title {
      font-size: 0.55rem;
    }
  }

  .section-content {
    gap: 1rem;
  }

  .text-content .description-wrapper .description {
    font-size: 0.8rem;
    line-height: 1.75;
  }

  .image-content {
    &.double-images {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .image-wrapper .lab-image {
      height: 245px; /* 从175px增大到245px */
    }
  }

  .instrument-card {
    .instrument-image-wrapper {
      height: 175px; /* 从125px增大到175px */

      .instrument-image {
        max-width: 85%;
        max-height: 85%;
      }
    }

    &.wide-card {
      .instrument-image-wrapper {
        height: 196px; /* 从140px增大到196px */
      }
    }

    .instrument-info {
      .instrument-name {
        font-size: 0.75rem;
      }

      .instrument-link-hint {
        opacity: 1;
        transform: translateY(0);

        .link-text {
          font-size: 0.4rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .section-header {
    .main-title {
      font-size: 0.85rem;
    }

    .sub-title {
      font-size: 0.5rem;
    }
  }

  .academic-section {
    padding: 0.75rem 0.5rem;
  }

  .image-content {
    .image-wrapper {
      .lab-image {
        height: 196px; /* 从140px增大到196px */
      }

      .image-caption {
        padding: 0.5rem;
        font-size: 0.5rem;
      }
    }
  }

  .instruments-grid {
    &.first-row, &.second-row {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }

  .instrument-card {
    .instrument-image-wrapper {
      height: 154px; /* 从110px增大到154px */
    }

    &.wide-card {
      .instrument-image-wrapper {
        height: 168px; /* 从120px增大到168px */
      }
    }

    .instrument-info {
      padding: 0.6rem;

      .instrument-name {
        font-size: 0.6rem;
      }

      .instrument-link-hint {
        .link-icon {
          font-size: 0.45rem;
        }

        .link-text {
          font-size: 0.35rem;
        }
      }
    }
  }
}

// 动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.academic-section {
  animation: fadeIn 0.6s ease-out;
}

.image-wrapper {
  animation: fadeIn 0.8s ease-out;
}

.instrument-card {
  animation: fadeIn 0.8s ease-out;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
}

// 新增：实验室并列布局
.labs-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

//行星实验室
.academic-section.small-section {
  padding: 1rem;
  margin-bottom: 0;

  .section-header {
    margin-bottom: 0.75rem;

    .main-title {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .sub-title {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .title-divider {
      width: 80px;
      height: 2px;
    }
  }

  .section-content.image-only {
    .image-content.single-image {
      .image-wrapper {
        .lab-image {
          height: 220px; /* 从150px增大到210px */
        }

        .image-caption {
          padding: 0.5rem;
          font-size: 0.7rem;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .labs-row {
    gap: 0.75rem;
  }

  .academic-section.small-section {
    padding: 0.75rem;

    .section-header {
      .main-title {
        font-size: 0.8rem;
      }

      .sub-title {
        font-size: 0.5rem;
      }
    }

    .section-content.image-only {
      .image-content.single-image {
        .image-wrapper {
          .lab-image {
            height: 175px; /* 从125px增大到175px */
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .labs-row {
    grid-template-columns: 1fr;
  }

  .academic-section.small-section {
    padding: 0.6rem;

    .section-header {
      .main-title {
        font-size: 0.7rem;
      }

      .sub-title {
        font-size: 0.45rem;
      }
    }

    .section-content.image-only {
      .image-content.single-image {
        .image-wrapper {
          .lab-image {
            height: 140px; /* 从100px增大到140px */
          }

          .image-caption {
            padding: 0.4rem;
            font-size: 0.45rem;
          }
        }
      }
    }
  }
}
</style>