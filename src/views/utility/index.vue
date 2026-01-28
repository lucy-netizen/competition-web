<template>
  <div class="utility-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1 class="main-title">数据检索工具</h1>
      <div class="title-line"></div>
      <p class="page-desc">整合行星探测数据处理工具，提供专业分析能力，助力行星科学研究</p>
    </div>

    <!-- 工具卡片容器 -->
    <div class="tool-card-container">
      <div
          class="tool-card"
          v-for="tool in toolList"
          :key="tool.id"
      >
        <!-- 工具图片（调用方法获取路径，避免模板new关键字） -->
        <div class="tool-img-box">
          <img
              :src="getImageUrl(tool.imageName)"
              :alt="tool.name"
              class="tool-img"
              title="工具展示图"
          />
        </div>
        <!-- 工具基础信息 -->
        <div class="tool-info-box">
          <h3 class="tool-name">{{ tool.name }}</h3>
          <div class="tool-meta">
            <span class="version">版本：{{ tool.version }}</span>
            <span class="date">发布：{{ tool.releaseDate }}</span>
          </div>
          <p class="tool-intro">{{ tool.intro }}</p>
          <!-- 仅保留查看详情按钮，点击跳转对应详情页 -->
          <button class="detail-btn" @click="goToDetail(tool)">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Utility',
  data() {
    return {
      // 工具列表：替换imageName为你的实际图片名、detailIntro为你的实际介绍即可
      toolList: [
        {
          id: 1,
          name: '行星探测图像超分和融合',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool1.png', // 对应src/assets/toolimgs/下的图片名
          intro: '对行星遥感图像进行超分辨率增强与多源数据融合，提升图像细节表现力',
          detailIntro: '介绍：\n'+
              '本工具主要用于行星探测图像的超分辨率增强和图像光谱特征与图像中空间细节融合。本工具超分模块利用深度开展超分辨率网络（USRNet）的两个模型，即“USRNet”和“USRNet_tiny”以及真实图像超分（RealSR）模型和高效亚像素卷积神网络（ESPCN）模型。其中USRNet模型可供用户手动选择去除影像的固定的噪声和模糊核。该模型适用于需要高质量图像输出且计算资源充足的场景。USRNet_tiny模型处理更快速、资源使用率更低，适用于计算机资源有限或需要实时处理的情况。RealSR模型专注于现实世界中带有噪声和模糊的图像，视觉效果更好。ESPCN模型适用于由双三次采样得到的低分辨率图像。融合方法包括Brovey变换、HIS变换、GS变换和PNN。基于图像信息融合技术，将遥感图像中空间细节与多光谱图像的光谱特征结合起来，生成具有空间和光谱信息的高质量遥感图像。本工具的主要目标用户为行星探测的科技工作者。同时也面向我国行星探测工程，旨在提升数据质量和利用价值。\n',
          downloadUrl: 'test.zip'
        },
        {
          id: 2,
          name: '基于可见近红外光谱数据的月球与火星物质成分反演工具',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool2.png',
          intro: '利用光谱数据反演行星表面物质成分，支持月球与火星多区域数据解析',
          detailIntro: '介绍：\n'+
              '本工具通过集成自研算法和多种成熟反演方法，构建了月球、火星物质成分反演算法体系，支持多种载荷数据作为输入，对月球和火星表面的物质成分进行反演。\n' +
              '基于LSCC提供的Apollo和我国嫦娥五号样品成分信息，结合实验室矿物混合光谱真值，构建了月球主要造岩矿物的定量反演模型，可将月球M3光谱数据作为输入，对月表典型区域的高钙辉石、低钙辉石和橄榄石及其含量进行定量反演；使用Apollo、LUNA和嫦娥系列采样点成分信息作为真值，采用PLS算法构建了月表典型地区Fe、Ti元素含量的反演模型，并能分析其空间分布特征，可使用月球Clementine、WAC、MI和IIM光谱数据作为输入，分别采用自主研发的CAE+SVR机器学习模型和参数法反演月表典型区域Fe、Ti元素及其含量的定量反演；基于火星矿物的实验室光谱数据和成像光谱数据，利用因子分析和目标转换（FATT）算法将成像光谱数据转为特征向量，将类火星矿物实验室光谱数据作为因变量，利用最小二乘方法拟合，采用RMSE作为矿物识别的指标，构建了火星矿物自动识别方法。该方法可自动识别成像光谱数据中的矿物种类，结合光谱匹配系数（SAM、SID、SID_SA）可绘制矿物空间分布图。能够指认典型区域主要蚀变矿物硅酸盐、氧化物、硫酸盐、层状硅酸盐的种类，并提取其吸收峰深度等光谱特征参数及其空间分布特征。经测试验证反演结果与公开数据一致。成果指标满足立项时提出的完成四种物质成分反演的功能。\n',
          downloadUrl: 'test.zip'
        },
        {
          id: 3,
          name: '基于微波和雷达数据的月球与火星次表层结构信息解译模型工具',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool3.png',
          intro: '通过微波与雷达数据解析行星次表层结构，实现地下层理与物质分布探测',
          detailIntro: '介绍：\n'+
              '本工具面向行星次表层结构识别与地质解释需求，自主研发了具有完全自主知识产权的 LMGPR 月球及火星次表层结构解释软件系统（登记号：2025SR1645259）。该软件以雷达数据的自动化处理与反演成像为核心，构建了从原始雷达回波信号到行星地下结构图像的完整处理链，实现了数据导入、信号预处理、波场反演、成像绘制与成果输出的全流程一体化设计。其总体研究目标在于建立一套面向行星环境的高精度雷达数据成像与解释技术体系，为月球与火星地质结构、沉积环境及演化过程的科学研究提供技术支撑。\n',
          downloadUrl: 'test.zip'
        },
        {
          id: 4,
          name: '行星数据三维可视化工具',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool4.png',
          intro: '将行星多源数据转换为三维模型，支持交互式视角查看与参数调整',
          detailIntro: '介绍：\n'+
              '本工具是一套基于三维虚拟现实技术实现的月球与火星三维可视化工具，具体功能包括：（1）构建月球与火星三维模型的虚拟现实场景，实现三维行星的渲染与交互控制；（2）月球与火星探测图像标量在行星三维模型上的科学可视化；（3）月球与火星地质对象、人类探测着陆点等矢量数据在三维模型上的精确绘制；（4）本地图层文件的附加与渲染。',
          downloadUrl: 'test.zip'
        },
        {
          id: 5,
          name: '火星风场中尺度涡流提取与风场可视化',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool5.png',
          intro: '可视化火星大气风场分布，支持时间序列动态演示与风速参数标注',
          detailIntro: '介绍：\n'+
              '本工具是一套火星风场流线可视化系统，所实现的功能包括：开展火星大气风场的流线可视化，能够调整火星日、流线速度、粒子数、透明度等信息；实现火星风场中的涡旋中心和涡旋边界的提取，并能够以动画的形式展现涡旋序列的位置和形态。',
          downloadUrl: 'test.zip'
        },
        {
          id: 6,
          name: '月球与火星形貌特征自动识别与定年分析工具',
          version: 'V1.0',
          releaseDate: '2025/07/26',
          imageName: 'tool6.png',
          intro: '介绍：\n'+
              '自动识别行星表面撞击坑、山脊等形貌特征，并完成地质年代定年分析',
          detailIntro: '本工具针对月球和火星地质地貌研究时的数据处理需求，实现了月球与火星表面过程研究中常用处理功能，主要包括：（1）月球和火星表面多尺度地形因子计算；（2）基于深度学习的月球撞击坑、石块和火星撞击坑、沙丘自动提取；（3）月球和火星表面地质单元撞击坑统计定年；（4）典型地质要素制图。这一工具的主要目的是帮助研究者更便捷地分析和理解行星表面的地形特征，提取典型形貌要素，从而加速研究效率。',
          downloadUrl: 'test.zip'
        }
      ]
    }
  },
  methods: {
    // 封装图片路径获取方法，避开Vue2模板new关键字限制
    getImageUrl(imageName) {
      return new URL(`./src/assets/toolimgs/${imageName}`, import.meta.url).href
    },
    // 点击查看详情，跳转至对应工具详情页并携带参数
    goToDetail(tool) {
      this.$router.push({
        path: '/utility/detail',
        query: {
          name: tool.name,
          imageName: tool.imageName,
          detailIntro: tool.detailIntro,
          downloadUrl: tool.downloadUrl
        }
      })
    }
  }
}
</script>

<style scoped>
/* 页面整体样式 */
.utility-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: "Microsoft YaHei", "Segoe UI", sans-serif;
  color: #333;
  background-color: #f8f9fa;
}
/* 标题区域 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}
.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 10px;
  letter-spacing: 2px;
}
.title-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, #4299e1, #38b2ac);
  margin: 0 auto 20px;
  border-radius: 3px;
}
.page-desc {
  font-size: 1.2rem;
  color: #666;
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.8;
}
/* 工具卡片容器 - 栅格布局，自适应列数 */
.tool-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}
/* 工具卡片样式 */
.tool-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}
.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}
/* 工具图片容器 */
.tool-img-box {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}
.tool-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-in-out;
}
.tool-card:hover .tool-img {
  transform: scale(1.1);
}
/* 工具信息区域 */
.tool-info-box {
  padding: 20px;
}
.tool-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 10px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tool-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.tool-intro {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  margin: 0 0 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* 查看详情按钮 */
.detail-btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  background-color: #4299e1;
  color: #fff;
  border-color: #4299e1;
}
.detail-btn:hover {
  background-color: #3182ce;
}
/* 自适应媒体查询 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.2rem;
  }
  .tool-card-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .tool-img-box {
    height: 160px;
  }
}
@media (max-width: 480px) {
  .utility-page {
    padding: 20px 15px;
  }
  .main-title {
    font-size: 1.8rem;
  }
}
</style>