<template>
  <div class="about-container" ref="container">

    <!-- 固定导航栏 -->
    <nav class="fixed-navbar">
      <div class="nav-container">
        <ul class="nav-menu">
          <li
              v-for="section in sections"
              :key="section.id"
              :class="{ active: currentSection === section.id }"
              @click="scrollToSection(section.id)"
          >
            <span class="nav-text">{{ section.label }}</span>
            <div class="nav-indicator"></div>
          </li>
        </ul>
      </div>
    </nav>




    <!-- 页眉 -->
    <header class="page-header">
      <h1 class="institute-title">山东大学行星科学团队</h1>
      <div class="header-divider"></div>
      <p class="header-subtitle">山东大学空间科学研究院 </p>
      <p class="header-subtitle">行星科学研究中心 </p>
    </header>

    <!-- 主要内容区域 -->
    <main class="content-main">
      <!-- 团队介绍 -->
      <section id="team-intro" class="content-section">
        <div class="section-header">
          <div class="section-marker">01</div>
          <div>
            <h3>团队介绍</h3>
            <p class="section-subtitle">Team Introduction</p>
          </div>
        </div>
        <div class="section-content">
          <h4>研究内容</h4>
          <p>
            行星科学是以太阳系行星及其他小天体形成和演化为研究目标的一门新兴交叉学科。以探月工程为标志的我国深空探测任务正在深入开展，行星科学随着深空探测的发展而逐渐成为空间科学的热点研究领域。本课题组以行星遥感与光谱学为主要研究方向，利用我国与国际上深空探测的最新数据开展行星遥感研究，结合地面实验室的样品光谱学与矿物化学研究进行联合科学解译，认识太阳系行星（月球、火星、金星、小天体等）的起源和演化规律。此外，我们还将以行星光谱探测载荷为主要对象，结合探测任务数据科学分析引领和拓展行星探测有效载荷的研发及标定工作。
          </p>

          <h4>主要研究方向</h4>
          <p>
            利用行星科学数据进行相应的科学研究是行星科学数据的主要价值所在。山东大学行星科学团队（Planetary Science Team of Shandong University）的主要研究兴趣为行星光谱与遥感研究，利用行星遥感光谱数据和实验室光谱数据，理解行星表面物质分布特征、环境条件以及行星起源与演化等科学问题。我们的研究主要包括以下5个方面：
          </p>
          <ul class="research-list">
            <li>
              <strong>行星遥感光谱学与深空探测研究：</strong>
              围绕国家深空探测任务需求，分析和解译其返回的各类影像、光谱及能谱等遥感和就位探测数据，获取行星表面元素、矿物与岩石类型等物质成分组成和空间分布特征，探究行星的起源与地质演化历史；
            </li>
            <li>
              <strong>行星表面物质及环境实验研究：</strong>
              利用激光拉曼、扫描电镜、电子探针、红外光谱仪等手段，开展返回样品、陨石和行星模拟物的物质成分研究，通过行星样品和环境模拟实验研究太空风化、水岩作用、火星大气及尘暴等环境过程及机理，开展行星遥感光谱与地面实验室光谱数据的联合研究；
            </li>
            <li>
              <strong>行星数据系统（PDS）标准与人工智能应用：</strong>
              开展行星探测数据标准研究、归档和数据的分发，推动行星数据标准（PDS）在中国深空探测中的应用和发展，开展行星大数据挖掘与深度学习等人工智能应用研究；
            </li>
            <li>
              <strong>行星光谱探测载荷研发及标定：</strong>
              开展行星探测中光谱仪器载荷研发和标定工作；
            </li>
            <li>
              <strong>行星资源勘查与利用：</strong>
              开展行星资源勘查与原位利用等相关研究和技术开发。
            </li>
          </ul>

          <h4>实验室和仪器设施</h4>
          <p>
            现有山东大学威海行星数据系统（PDS）实验室、行星表面物质实验室、行星环境模拟实验室，依托理化与材料测试中心，拥有激光显微拉曼光谱仪、傅里叶变换红外光谱仪、X射线衍射谱仪、电子探针、场发射扫描电子显微镜等大型仪器设备，为科研活动和研究生培养提供了充足的空间和实验条件。
          </p>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">15+</div>
              <div class="stat-label">核心研究人员</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">40+</div>
              <div class="stat-label">在读研究生</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5</div>
              <div class="stat-label">主要研究方向</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 研究队伍 -->
      <section id="research-team" class="content-section">
        <div class="section-header">
          <div class="section-marker">02</div>
          <div>
            <h3>研究队伍</h3>
            <p class="section-subtitle">Research Team</p>
          </div>
        </div>
        <div class="section-content">
          <div class="team-hierarchy">
            <div class="hierarchy-level">
              <h4>学术带头人</h4>
              <div class="leader-card">
                <div class="leader-title">课题组长 (PI)</div>
                <div class="leader-name">凌宗成 教授</div>
                <div class="leader-bio">国家重大人才计划入选者，行星遥感与光谱学专家</div>
              </div>
            </div>

            <div class="hierarchy-level">
              <h4>核心教研团队 (14人)</h4>
              <div class="faculty-grid">
                <div v-for="member in facultyMembers" :key="member" class="faculty-card">
                  <div class="faculty-name">{{ member }}</div>
                </div>
              </div>
            </div>

            <div class="hierarchy-level">
              <h4>科研支持团队</h4>
              <div class="support-team">
                <div class="support-role">科研助理</div>
                <div class="support-name">陈博</div>
              </div>
            </div>

            <div class="hierarchy-level">
              <h4>研究生团队 (41人)</h4>
              <div class="student-container">
                <div class="student-group">
                  <div class="student-names">
                    <span v-for="(student, index) in studentMembers" :key="index" class="student-item">
                      {{ student }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 科研成果主模块 -->
      <section id="scientific-achievements" class="achievements-container">

        <!-- 模块标题 -->
        <div class="module-header">
          <h2>科研成果</h2>
          <p class="module-subtitle">以国家深空探测任务为牵引，在行星科学领域取得系列原创性突破</p>
        </div>

        <!-- 视图切换按钮 -->
        <div class="view-toggle">
          <button
              @click="currentView = 'galaxy'"
              :class="{ active: currentView === 'galaxy' }"
              aria-label="切换到科研星系视图"
          >
            <i class="fas fa-satellite"></i> 研究领域星系图
          </button>
          <button
              @click="currentView = 'timeline'"
              :class="{ active: currentView === 'timeline' }"
              aria-label="切换到时间轴视图"
          >
            <i class="fas fa-history"></i> 成果演进时间轴
          </button>
        </div>

        <!-- 视图内容区域 -->
        <div class="view-content">

          <!-- 科研星系图视图 (默认) -->
          <transition name="fade" mode="out-in">
            <div v-if="currentView === 'galaxy'" key="galaxy" class="galaxy-view">

              <!-- 星系图容器 -->
              <div class="galaxy-container">
                <!-- 中心团队标识 -->
                <div class="galaxy-center">
                  <div class="center-logo">
                    <i class="fas fa-atom"></i>
                  </div>
                  <div class="center-label">
                    行星科学团队
                  </div>
                </div>

                <!-- 动态生成四大研究领域“星球” -->
                <div
                    v-for="field in researchFields"
                    :key="field.id"
                    class="research-planet"
                    :class="[field.id, { active: activeField === field.id }]"
                    :style="{
                top: field.position.y + '%',
                left: field.position.x + '%',
                 width: `max(${field.count / 8 + 3}rem, ${field.name.length * 0.8}rem)`, // 文字长度决定最小宽度
                 height: `max(${field.count / 8 + 3}rem, ${field.name.length * 0.8}rem)`,
                 minWidth: '8rem', // 最小宽度兜底（适配短名称）
                 minHeight: '8rem'
              }"
                    @mouseenter="setActiveField(field.id)"
                    @mouseleave="activeField = null"
                    @click="toggleFieldDetail(field.id)"
                >
                  <div class="planet-icon">
                    <i :class="field.icon"></i>
                  </div>
                  <div class="planet-label">{{ field.name }}</div>
                  <div class="planet-count">{{ field.count }}项成果</div>
                </div>

                <!-- 连接轨道线 -->
                <svg class="galaxy-orbit" width="100%" height="100%">
                  <circle cx="50%" cy="50%" r="40%" fill="none" stroke="rgba(52, 152, 219, 0.1)" stroke-width="1"/>
                </svg>
              </div>

              <!-- 选中领域详情面板 -->
              <transition name="slide">
                <div v-if="activeDetail" class="detail-panel">
                  <div class="detail-header">
                    <h3>
                      <i :class="activeDetail.icon"></i>
                      {{ activeDetail.name }} 领域主要成果
                    </h3>
                    <button @click="activeDetail = null" class="close-btn" aria-label="关闭详情">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div class="detail-content">
                    <ul class="achievement-list">
                      <li v-for="(item, index) in activeDetail.achievements" :key="index">
                        <a
                            :href="item.reportUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="achievement-link"
                        >
                        <span class="achievement-date">{{ item.date }}</span>
                        <span class="achievement-title">{{ item.title }}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
          </transition>

          <!-- 时间轴视图 -->
          <transition name="fade" mode="out-in">
            <div v-if="currentView === 'timeline'" key="timeline" class="timeline-view">
              <div class="timeline-container">
                <!-- 时间轴主线（垂直方向） -->
                <div class="timeline-line"></div>

                <!-- 按阶段分组的时间节点（垂直排列） -->
                <div
                    v-for="(stageGroup, index) in timelineData"
                    :key="stageGroup.year"
                    class="timeline-stage-group"
                >
                  <!-- 阶段节点 -->
                  <div class="stage-node">
                    <div class="stage-dot"></div>
                    <div class="stage-label">{{ stageGroup.year }}</div>
                  </div>

                  <!-- 该阶段下的成果卡片（横向排列） -->
                  <div class="achievement-cards-horizontal">
                    <div
                        v-for="achievement in stageGroup.achievements"
                        :key="achievement.id"
                        class="achievement-card-horizontal"
                        :class="achievement.field"
                    >
                      <div class="card-field">
                        <i :class="getFieldIcon(achievement.field)"></i>
                        {{ getFieldName(achievement.field) }}
                      </div>
                      <div class="card-title">{{ achievement.title }}</div>
                      <div class="card-period">{{ achievement.date }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>


      </section>

      <!-- 所获奖励 -->
      <section id="awards" class="content-section">
        <div class="section-header">
          <div class="section-marker">04</div>
          <div>
            <h3>所获奖励与科研项目</h3>
            <p class="section-subtitle">Honors & Research Projects</p>
          </div>
        </div>
        <div class="section-content">
          <div class="projects-intro">
            <p>团队长期致力于行星科学研究，承担了多项国家及省部级重要科研项目，为我国深空探测任务提供了坚实的科学与技术支持。以下为部分代表性科研项目列表：</p>
          </div>

          <div class="projects-table-container">
            <table class="projects-table">
              <thead>
              <tr>
                <th class="col-no">编号</th>
                <th class="col-name">项目名称</th>
                <th class="col-source">项目来源</th>
                <th class="col-funding">经费 (万元)</th>
                <th class="col-period">起止时间</th>
                <th class="col-leader">负责人</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="project in researchProjects" :key="project.id">
                <td class="col-no">{{ project.id }}</td>
                <td class="col-name">{{ project.name }}</td>
                <td class="col-source">{{ project.source }}</td>
                <td class="col-funding">{{ project.funding }}</td>
                <td class="col-period">{{ project.period }}</td>
                <td class="col-leader">{{ project.leader }}</td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>



    </main>

    <!-- 页脚 -->
    <footer class="page-footer">
      <div class="footer-content">
        <div class="contact-info">
          <h4>联系信息</h4>
          <p><i class="fas fa-map-marker-alt"></i> 山东省威海市文化西路180号</p>
          <p><i class="fas fa-envelope"></i> pds@sdu.edu.cn</p>

        </div>
        <div class="footer-note">
          <p>© 2026 山东大学空间科学研究院行星科学研究中心 版权所有</p>
          <p class="footer-sub">探索宇宙奥秘，服务国家战略</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Aboutus',
  data() {
    return {

      researchProjects: [
        { id: 1, name: '月球与行星科学', source: '山东省自然科学杰出青年基金', funding: '60', period: '2015.7-2018.7', leader: '凌宗成' },
        { id: 2, name: '火星含水硫酸铁的实验室模拟与遥感探测', source: '国家自然科学基金面上项目', funding: '95', period: '2015.1-2018.12', leader: '凌宗成' },
        { id: 3, name: '月球数字地质图编研', source: '科技部基础性工作专项子课题', funding: '100', period: '2015.1-2019.12', leader: '凌宗成' },
        { id: 4, name: '基于嫦娥一号干涉成像光谱数据的月表镁元素和镁指数填图', source: '国家自然科学基金', funding: '52', period: '2013.1-2015.12', leader: '凌宗成' },
        { id: 5, name: '基于嫦娥一号干涉成像光谱仪数据的月表 FeO 反演', source: '国家自然科学基金', funding: '24', period: '2011.1-2013.12', leader: '凌宗成' },
        { id: 6, name: '基于嫦娥一号干涉成像光谱仪数据的月表 TiO2 反演', source: '山东省自然科学基金', funding: '4', period: '2011.7-2014.7', leader: '凌宗成' },
        { id: 7, name: '模拟环境下火星表面高氯酸盐起源的反应路径研究', source: '国家自然科学基金', funding: '86.6', period: '2016.1-2019.12', leader: '武中臣' },
        { id: 8, name: '月面岩石的地球化学分类研究', source: '国家自然科学基金子课题', funding: '20', period: '2014.1-2017.12', leader: '张江' },
        { id: 9, name: '介质阻挡放电非热激发原子发射检测液相中超量重金属研究', source: '国家自然科学基金主任基金', funding: '10', period: '2013.1-2013.12', leader: '武中臣' },
        { id: 10, name: '模拟条件下火星表面高氯盐水合物的光谱特征研究', source: '山东省英才基金项目', funding: '15', period: '2015.9-2018.9', leader: '武中臣' },
        { id: 11, name: '介质阻挡放电激发小分子大气污染物检测方法研究', source: '山东省优秀中青年科学家奖励基金', funding: '5', period: '2010.10-2013.10', leader: '武中臣' },
        { id: 12, name: '基于"嫦娥一号"地形和光谱数据的月表纹理与地质演化研究', source: '山东省自然科学基金', funding: '11', period: '2015.9-2018.9', leader: '李勃' },
        { id: 13, name: '嫦娥一号遥感数据的月表纹理与地质演化研究', source: '山东大学基本科研业务费青年培养项目', funding: '8', period: '2015.1-2016.12', leader: '李勃' },
        { id: 14, name: '模拟火星环境下的岩石风化效应研究', source: '山东大学基本科研业务费（自然科学类重点项目）', funding: '17', period: '2014.3-2016.02', leader: '武中臣' },
        { id: 15, name: '模拟火星大气中甲烷定量分析新方法研究', source: '中国科学院行星科学重点实验室开放课题基金', funding: '4', period: '2014.1-2015.12', leader: '武中臣' },
        { id: 16, name: '模拟火星环境下高氯酸盐潮解的影响因素研究', source: '中国科学院月球与深空探测重点实验室开放基金', funding: '3', period: '2015.7-2017.6', leader: '武中臣' }
      ],
      currentSection: 'team-intro',
      progressTop: 100,
      sections: [
        { id: 'team-intro', label: '团队介绍' },
        { id: 'research-team', label: '研究队伍' },
        { id: 'scientific-achievements', label: '科研成果' },
        { id: 'awards', label: '所获奖励' }
      ],
      facultyMembers: [
        '武中臣 教授',
        '吕英波 教授',
        '付晓辉 教授',
        '李勃 副教授',
        '乔乐 副教授',
        '肖阿阳 副研究员',
        '刘长卿 副研究员',
        '张江 讲师',
        '陈剑 讲师',
        '辛艳青 高级实验师',
        '倪宇恒 实验师',
        '曲洪坤 博士后',
        '曹海军 博士后',
        '毛文硕 博士后'
      ],
      studentMembers: [
        '卢学金',
        '张聆汐',
        '尹承翔',
        '王天伟',
        '鞠恩明',
        '刘毅恒',
        '潘辰安',
        '贾子祎',
        '汪鑫',
        '金国斌',
        '邹启',
        '苏鸣宇',
        '赵士祺',
        '刘方超',
        '曹陈宇',
        '王晨宇',
        '张玉征',
        '杨茜',
        '李进',
        '池思越',
        '孔嘉琪',
        '李瑞新',
        '刘广阔',
        '孙宪洋',
        '杨瑜',
        '张睿泽',
        '任鹏宇',
        '董晓彤',
        '苏博文',
        '满晨',
        '周紫璇',
        '张靖东',
        '李金航',
        '董俊烽',
        '陶慧聪',
        '魏小茼',
        '苏雨欣',
        '羊璟',
        '余龙娇',
        '向文迪',
        '张涵'
      ],
      // 当前激活的视图
      currentView: 'galaxy',

      // 当前激活的研究领域
      activeField: null,

      // 当前显示的详情面板
      activeDetail: null,

      // 四大研究领域数据（基于您的分类清单）
      researchFields: [
        {
          id: 'lunar',
          name: '月球科学',
          count: 34,
          icon: 'fas fa-moon',
          position: { x: 10, y: 50 },
          achievements: [
            { title: '首份镁环月面真值！行星科学团队揭示月球南极-艾肯盆地深部岩石类型及成因', date: '2025-07-08',reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3669.htm' },
            { title: '行星科学团队发现嫦娥六号着陆区月海玄武岩厚度特征与南极-艾肯盆地火山活动的地质联系', date: '2025-06-03' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3660.htm'},
            { title: '行星科学团队揭示月球太空风化的纬度效应及单质铁成长机制', date: '2025-06-03' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3659.htm'},
            { title: '行星科学团队利用嫦娥六号月壤揭示月球年轻月海风化层演化新机制', date: '2025-04-04' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3589.htm'},
            { title: '行星科学团队揭示月背年轻火山活动奥秘', date: '2025-03-09' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3549.htm'},
            { title: '行星科学团队揭示月球南极极区平原地貌成因机制', date: '2024-07-12' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3389.htm'},
            { title: '行星科学团队在月球陨石研究方面取得进展', date: '2024-02-19' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3232.htm'},
            { title: '行星科学团队在月海玄武岩时空分布研究方面取得新进展', date: '2023-04-13' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2939.htm'},
            { title: '“年轻”的月岩 ，“不年轻”的月壤', date: '2022-12-23' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2902.htm'},
            { title: '嫦娥四号光谱探测揭秘月球南极-艾肯成分异常区成因', date: '2022-06-09' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2761.htm'},
            { title: '月球危海盆地的物质分布与地质演化研究', date: '2022-05-18' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2740.htm'},
            { title: '行星科学课题组在嫦娥四号着陆区物质组成研究方面取得新进展', date: '2022-03-29' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2719.htm'},
            { title: '行星科学课题组在嫦娥五号采样区撞击历史研究方面取得新进展', date: '2021-11-18' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2649.htm'},
            { title: '行星科学课题组在月球早期火山活动研究方面取得新进展', date: '2021-11-02' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2631.htm'},
            { title: '嫦娥五号着陆区周围3个撞击坑的形成年龄及地质意义', date: '2021-11-02' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2629.htm'},
            { title: '两块富镁月球陨石提供了月球背面岩石类型和镁质岩套岩石成因的新证据', date: '2021-09-14',reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/3509.htm' },
            { title: '遥感研究揭示嫦娥五号着陆区非月海溅射物的岩石学特征', date: '2021-05-28' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2489.htm'},
            { title: '嫦娥五号着陆区地质特征研究及对返回样品物源的制约', date: '2021-04-30' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2460.htm'},
            { title: '行星科学团队证实“地球风”可在月球表面生成水', date: '2021-04-02' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2409.htm'},
            { title: '基于月面就位探测和实验室光谱学实验的嫦娥四号红外成像光谱仪数据光度校正方法研究', date: '2020-10-22' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2274.htm'},
            { title: '月球不规则月海斑块的分类研究', date: '2020-05-29' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2250.htm'},
            { title: '月球Cauchy 5小型盾状火山的地质特征及成因研究', date: '2020-05-29' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2249.htm'},
            { title: '嫦娥四号着陆点岩石的矿物组合：基于玉兔二号红外成像光谱仪的研究结果', date: '2020-05-22' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2240.htm'},
            { title: '基于嫦娥四号红外成像光谱仪数据的光度校正', date: '2020-05-22' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2239.htm'},
            { title: '嫦娥四号红外成像光谱仪数据的初步矿物学分析结果', date: '2020-05-09' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2232.htm'},
            { title: '冯卡门撞击坑月海和非月海物质的化学组分、矿物学和定年研究', date: '2020-01-02' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2346.htm'},
            { title: '月球极区平坦坑底永久阴影区LOLA 1064 nm反照率研究：对表层水冰出露及未来就位探测的启示', date: '2019-09-23' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2119.htm'},
            { title: '月球Ina构造的地质特征研究：晚期熔岩湖岩浆泡沫喷发及异常撞击坑统计年龄的证据', date: '2019-09-23' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2118.htm'},
            { title: '嫦娥四号月球背面着陆区地质特征研究', date: '2019-09-23' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2117.htm'},
            { title: '月球遥感研究揭示嫦娥四号着陆区次表层结构', date: '2019-09-15' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2107.htm'},
            { title: '基于高分辨率影像（LROC）的嫦娥四号着陆区选择和巡视路径规划', date: '2019-09-11' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/2097.htm'},
            { title: '“玉兔号”月球车就位探测数据分析论文在《Nature Communications》发表', date: '2015-12-28' ,reportUrl:'https://pds.wh.sdu.edu.cn/info/1277/1842.htm'}
          ]
        },
        {
          id: 'mars',
          name: '火星探测',
          count: 14,
          icon: 'fas fa-mars',
          position: { x: 70, y: 20 },
          achievements: [
            { title: '行星科学团队发现祝融号火星车在乌托邦平原发现水铝英石等含水矿物', date: '2024-10-01',reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3409.htm' },
            { title: '行星科学团队在火星尘暴活动中钙钛矿太阳能电池的耐受性研究方面取得新进展', date: '2024-05-27' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3320.htm'},
            { title: '行星科学团队在火星硫酸盐研究方面取得新进展', date: '2024-05-08' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3279.htm'},
            { title: '行星科学团队在火星LIBS光谱定量分析方法方面取得新进展', date: '2024-02-19' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3231.htm'},
            { title: '行星科学团队在火星大气涡旋研究方面取得新进展', date: '2024-02-19' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3230.htm'},
            { title: '行星科学团队在火星相关硫酸钙复盐研究方面取得进展', date: '2023-06-02' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3019.htm'},
            { title: '天问一号着陆区的水蚀变作用：祝融号火星实地探测新认识', date: '2022-12-23' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2901.htm'},
            { title: '行星科学团队与美国圣路易斯华盛顿大学合作揭示火星γ相硬石膏高稳定性之谜', date: '2022-04-18' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2729.htm'},
            { title: '水热合成实验揭示皂石结晶度对其光谱特征的影响', date: '2022-03-29' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2720.htm'},
            { title: '“天问一号”着陆区乌托邦平原南部尘卷风轨迹的初步研究', date: '2021-09-02' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2570.htm'},
            { title: '火星俄菲峡谷“矿物碗”区域含水硫酸盐的空间分布和来源', date: '2021-08-22' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2549.htm'},
            { title: '“天问一号”火星探测预选着陆区Isidis-Elysium平原的尘暴概率研究', date: '2020-07-29' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2290.htm'},
            { title: '黄钾铁矾和其它火星相关次生矿物的实验室拉曼和可见近红外光谱学研究', date: '2020-01-24' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2349.htm'},
            { title: '火星环境下四方纤铁矿的稳定性及光谱变化特征', date: '2019-09-15' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2106.htm'}
          ]
        },
        {
          id: 'venus',
          name: '金星与小天体',
          count: 4,
          icon: 'fas fa-venus',
          position: { x: 65, y: 60 },
          achievements: [
            { title: '行星科学团队在金星大气紫外吸收特征成因研究方面取得新进展', date: '2025-09-07' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3709.htm'},
            { title: '行星科学团队在金星闪电实验室模拟研究方面取得新进展', date: '2023-05-06' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2979.htm'},
            { title: '武中臣教授在火星表面高氯酸盐起源研究方面获进展', date: '2018-11-16' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/1836.htm'},

          ]
        },
        {
          id: 'tech',
          name: '技术方法与载荷',
          count: 8,
          icon: 'fas fa-satellite-dish',
          position: { x: 7, y: 10 },
          achievements: [
            { title: '行星科学团队利用深度学习模型给出百米级“分布图”', date: '2025-09-08' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3719.htm'},
            { title: '行星科学团队成功开发山东大学远程拉曼光谱系统，助力行星物质研究', date: '2025-03-11',reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3559.htm' },
            { title: '行星科学团队两篇论文分别入选Wiley旗下杂志年度高被引和高下载论文', date: '2024-05-08' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3281.htm'},
            { title: '行星科学团队在模拟深空低压条件下制备出了高品质钙钛矿单晶', date: '2024-03-31',reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3259.htm' },
            { title: '行星科学团队在有机无机杂化钙钛矿单晶生长及其深空光电探测研究方面取得新进展', date: '2024-02-19' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3232.htm'},
            { title: '山东大学行星科学团队在硅酸盐混合物的拉曼定量研究方面取得新进展', date: '2023-06-05' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/3029.htm'},
            { title: '利用卷积神经网络对ChemCam光谱数据进行定量分析', date: '2020-07-29' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2273.htm'},
            { title: '基于主成分载荷空间距离的LIBS特征谱线选择及矿物元素丰度研究方法', date: '2019-09-17' ,reportUrl: 'https://pds.wh.sdu.edu.cn/info/1277/2111.htm'}
          ]
        }
      ],

      // 时间轴数据
      timelineData: [
        {
          year: '2015-2018',
          achievements: [
            {
              id: 'early-1',
              title: '参与嫦娥工程数据分析，发表首篇Nature Communications论文，奠定团队研究基础',
              field: 'lunar',
              date: '2015-2018'
            },
            {
              id: 'early-2',
              title: '开展火星环境模拟实验，建立行星表面物质实验室，为后续探测任务提供技术储备',
              field: 'mars',
              date: '2015-2018'
            }
          ]
        },
        {
          year: '2019-2021',
          achievements: [
            {
              id: 'growth-1',
              title: '参与嫦娥四号任务，实现人类首次月球背面就位探测，在月球地质研究方面取得突破',
              field: 'lunar',
              date: '2019-2021'
            },
            {
              id: 'growth-2',
              title: '参与天问一号任务预研，开展火星尘暴、水冰探测等关键技术研究',
              field: 'mars',
              date: '2019-2021'
            },
            {
              id: 'growth-3',
              title: '证实"地球风"可在月球表面生成水，为月球水资源研究提供新视角',
              field: 'lunar',
              date: '2021'
            }
          ]
        },
        {
          year: '2022-2023',
          achievements: [
            {
              id: 'breakthrough-1',
              title: '发布全球首幅1:250万月球岩石类型图，参与嫦娥五号月壤样品研究，成果发表于Nature Astronomy',
              field: 'lunar',
              date: '2022-2023'
            },
            {
              id: 'breakthrough-2',
              title: '解析天问一号着陆区水蚀变作用，在火星水资源探测方面取得重要进展',
              field: 'mars',
              date: '2022-2023'
            },
            {
              id: 'breakthrough-3',
              title: '成功开发远程拉曼光谱系统，在行星探测载荷技术方面实现自主创新',
              field: 'tech',
              date: '2023'
            }
          ]
        },
        {
          year: '2024-2025',
          achievements: [
            {
              id: 'innovate-1',
              title: '发现祝融号火星车在乌托邦平原发现水铝英石等含水矿物，揭示火星水活动新证据',
              field: 'mars',
              date: '2024'
            },
            {
              id: 'innovate-2',
              title: '参与嫦娥六号任务研究，揭示月球南极-艾肯盆地深部物质组成，成果引起国际关注',
              field: 'lunar',
              date: '2024-2025'
            },
            {
              id: 'innovate-3',
              title: '开发深度学习模型实现百米级行星表面物质分布预测，推动行星科学人工智能应用',
              field: 'tech',
              date: '2025'
            },
            {
              id: 'innovate-4',
              title: '开展金星大气紫外吸收特征研究，拓展团队在小天体与金星探测领域的研究方向',
              field: 'venus',
              date: '2025'
            }
          ]
        }
      ]

    }
  },
  mounted() {
    this.setupScrollListener();
    // 使用debounce优化滚动监听
   // this.debouncedScroll = debounce(this.handleScroll, 50);
    window.addEventListener('scroll', this.debouncedScroll);
    window.addEventListener('resize', this.handleResize);
    document.title = '关于我们 - 拾壹博客';
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 设置激活的研究领域
    setActiveField(fieldId) {
      this.activeField = fieldId;},
    // 切换显示领域详情面板
    toggleFieldDetail(fieldId) {
      if (this.activeDetail && this.activeDetail.id === fieldId) {
        this.activeDetail = null;
      } else {
        const field = this.researchFields.find(f => f.id === fieldId);
        this.activeDetail = field;
      }
    },
    // 根据领域ID获取图标
    getFieldIcon(fieldId) {
      const field = this.researchFields.find(f => f.id === fieldId);
      return field ? field.icon : 'fas fa-question';
    },

    // 根据领域ID获取名称
    getFieldName(fieldId) {
      const field = this.researchFields.find(f => f.id === fieldId);
      return field ? field.name : '其他';
    },
    setupScrollListener() {
      this.handleScroll()
    },
    handleScroll() {
      // 更新进度条位置
      const scrollY = window.scrollY;
      this.progressTop = Math.max(50, 100 - scrollY * 0.1);

      // 获取所有章节元素
      const sections = this.sections.map(section => {
        const element = document.getElementById(section.id);
        if (!element) return { id: section.id, top: 0, bottom: 0 };

        const rect = element.getBoundingClientRect();
        return {
          id: section.id,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height
        };
      });

      // 当前滚动位置
      const currentScroll = window.scrollY + 100; // 加一些偏移量，让切换更平滑

      // 找到当前所在的章节
      let activeSection = this.currentSection;

      for (const section of sections) {
        if (currentScroll >= section.top && currentScroll < section.bottom) {
          activeSection = section.id;
          break;
        }
      }

      // 如果滚动到了最后一部分
      if (currentScroll >= sections[sections.length - 1].top) {
        activeSection = sections[sections.length - 1].id;
      }

      // 更新当前激活的章节
      if (activeSection !== this.currentSection) {
        this.currentSection = activeSection;
      }
    },
    handleResize() {
      this.handleScroll()
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        this.currentSection = sectionId
      }
    }
  }
}
</script>

<style scoped>
/* 正式字体定义 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600&display=swap');

.about-container {
  font-family: 'Noto Serif SC', 'Source Han Serif', 'SimSun', serif;
  color: #1a1a1a;
  line-height: 1.4;
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px 20px 20px 150px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  position: relative;
  min-height: 100vh;
  letter-spacing: 0.01em;
}
/* 固定导航栏样式 */
.fixed-navbar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 15px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(52, 152, 219, 0.1);
  backdrop-filter: blur(10px);
}

.nav-container {
  width: 100%;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-menu li {
  position: relative;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: "Times New Roman", Times, serif;
  font-weight: 500;
  color: #5d6d7e;
  font-size: 0.85rem;
  white-space: nowrap;
}

.nav-menu li:hover {
  background: rgba(52, 152, 219, 0.08);
  color: #2c3e50;
  transform: translateX(5px);
}



.nav-text {
  display: block;
  font-family: "Times New Roman", Times, serif;
  transition: color 0.3s ease;
}



/* 响应式调整 */
@media (max-width: 1100px) {
  .fixed-navbar {
    left: 15px;
    padding: 12px 8px;
  }

  .nav-menu li {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .fixed-navbar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    border-radius: 12px 12px 0 0;
    padding: 10px 15px;
  }

  .nav-menu {
    flex-direction: row;
    justify-content: space-around;
    gap: 5px;
  }

  .nav-menu li {
    flex: 1;
    text-align: center;
    padding: 10px 5px;
  }

  .nav-indicator {
    left: 50%;
    top: -8px;
    transform: translateX(-50%) scaleX(0);
    width: 60%;
    height: 4px;
  }

  .nav-menu li.active .nav-indicator {
    transform: translateX(-50%) scaleX(1);
  }

  .nav-menu li:hover {
    transform: translateY(-3px);
  }
}

@media (max-width: 480px) {
  .nav-menu li {
    font-size: 0.75rem;
    padding: 8px 4px;
  }
}

/* 页眉 */
/* 页眉 - 科技感增强版 */
.page-header {
  text-align: center;
  margin-bottom: 0;
  padding: 60px 20px 40px;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.95) 0%,
  rgba(248, 250, 252, 0.9) 50%,
  rgba(240, 249, 255, 0.85) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
  #3498db, #2c3e50, #3498db);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.page-header::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle,
  rgba(52, 152, 219, 0.1) 0%,
  rgba(52, 152, 219, 0.05) 40%,
  transparent 70%);
  z-index: 0;
}

@keyframes shimmer {
  0%, 100% { background-position: -200% 0; }
  50% { background-position: 200% 0; }
}

.institute-title {
  font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 5px;
  letter-spacing: -0.8px;
  text-shadow:
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 0 0 rgba(52, 152, 219, 0.3);
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    text-shadow:
        0 4px 8px rgba(0, 0, 0, 0.1),
        0 0 20px rgba(52, 152, 219, 0.3);
  }
  100% {
    text-shadow:
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 0 30px rgba(52, 152, 219, 0.5);
  }
}

.header-divider {
  width: 180px;
  height: 6px;
  background: linear-gradient(90deg,
  transparent 0%,
  #3498db 20%,
  #2c3e50 50%,
  #3498db 80%,
  transparent 100%);
  margin: 0 auto 20px;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.header-divider::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.8),
  transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.header-subtitle {
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Georgia', 'SimHei', serif;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #5d6d7e, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.header-subtitle:hover {
  transform: translateY(-2px);
  text-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .page-header {
    padding: 40px 20px 30px;
    margin-bottom: 30px;
  }

  .institute-title {
    font-size: 2.4rem;
  }

  .header-divider {
    width: 150px;
    height: 5px;
  }

  .header-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 15px 25px;
    margin-bottom: 25px;
    border-radius: 15px;
  }

  .institute-title {
    font-size: 2rem;
    letter-spacing: -0.5px;
  }

  .header-divider {
    width: 120px;
    height: 4px;
  }

  .header-subtitle {
    font-size: 1rem;
    letter-spacing: 1px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 25px 10px 20px;
    margin-bottom: 20px;
  }

  .institute-title {
    font-size: 1.8rem;
  }

  .header-divider {
    width: 100px;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }
}

/* 主要内容区 */
.content-main {
  position: relative;
}
.content-section p {
  font-family: 'Noto Serif SC', 'Source Han Serif', 'SimSun', serif;
  font-size: 0.8rem;
  line-height: 1.8;
  color: #2c3e50;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: justify;

}
.content-section {
  background: #fcffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  padding: 10px 60px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;
}

.content-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.content-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, #3498db, #2c3e50);
  opacity: 0.8;
}

/* 章节头部 */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.section-marker {
  font-family: 'Source Serif Pro', serif;
  font-size: 3.3rem;
  font-weight: 700;
  color: rgba(52, 152, 219, 0.15);
  margin-right: 30px;
  line-height: 1;
}

.section-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 5px 0;
  letter-spacing: -0.3px;
  font-family: 'Noto Serif SC', serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-subtitle {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 团队介绍部分 */
.content-section h4 {
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 25px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
}
.research-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.research-list li {
  margin-bottom: 5px;
  padding: 10px;
  background: #f1f9ff;
  border-left: 4px solid rgba(0, 55, 119, 0.89);
  border-radius: 6px;
  line-height: 1.6;
  font-family: 'SimSun', '宋体', serif;
  font-size: 0.8rem;
}

.research-list strong {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 5px;
  font-family: 'Times New Roman', 'Times', serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #f1f9ff;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f9ff 100%);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-family: 'Source Serif Pro', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

/* 研究队伍部分 */
.team-hierarchy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hierarchy-level h4 {
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e8eef5;
  font-weight: 600;
  font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif;
}

.leader-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #f1f9ff 100%);
  border-radius: 10px;
  padding: 10px;
  border-left: 5px solid #2598e6;
  max-width: 600px;
}



.leader-title {
  font-size: 0.7rem;
  color: #2598e6;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
}

.leader-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  font-family: 'Noto Serif SC', serif;
}

.leader-bio {
  font-size: 0.75rem;
  color: #5d6d7e;
  line-height: 1.6;
  font-family: 'SimSun', '宋体', serif;
}

.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 5px;
}

.faculty-card {
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  color: #2c3e50;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

.faculty-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.faculty-name {
  font-family: 'Times New Roman', 'Times', serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.3;
  letter-spacing: 0.02em;
}

.support-team {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  background: #f8fafc;
  padding: 15px 25px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.support-role {
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  font-family: 'Times New Roman', 'Times', serif;
}

.support-name {
  font-size: 0.8rem;
  color: #2c3e50;
  font-weight: 500;
  font-family: 'Times New Roman', 'Times', serif;
}

.student-container {
  background: #f1f9ff;
  border-radius: 12px;
  padding: 5px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.student-group {
  font-family: 'Times New Roman', 'Times', serif;
}

.student-names {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 6px;

}

.student-item {
  background: #ffffff;
  padding: 5px 3px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'Times New Roman', 'Times', serif;
  color: #003161;
  border: 1px solid #ffffff;
  text-align: center;
  transition: all 0.2s ease;
  font-weight: 500;
}

.student-item:hover {
  background: rgba(148, 198, 232, 0.27);
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
/* 科研成果时间线 */

.timeline-content h5 {
  font-size: 0.9rem;
  color: #34495e;
  margin-bottom: 12px;
  font-weight: 600;
  font-family: 'Arial', 'Helvetica', 'Microsoft YaHei', sans-serif;
}

.timeline-content p {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 0;
}

/* 所获奖励部分 */
.projects-intro {
  margin-bottom: 10px;
  color: #4a5568;
  line-height: 1.7;
}

.projects-table-container {
  overflow-x: auto;
  margin-bottom: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.projects-table thead {
  background: linear-gradient(135deg, #155ea1 0%, rgb(64, 127, 207) 100%);
  color: #f4fbff;
}

.projects-table th {
  padding: 16px 12px;
  font-weight: 600;
  text-align: left;
  border: none;
  font-family: 'Times New Roman', 'Times', serif;
  font-size: 0.8rem;
}

.projects-table tbody tr {
  border-bottom: 1px solid #7599f8;
  transition: background-color 0.2s ease;

}

.projects-table tbody tr:hover {
  background-color: #f1f9ff;
}

.projects-table td {
  padding: 14px 12px;
  color: #4a5568;
  vertical-align: top;
  font-family: 'Times New Roman', 'Times', serif;
  font-size: 0.8rem;
}

/* 列宽优化 */
.col-no { width: 4%; text-align: center; }
.col-name { width: 30%; }
.col-source { width: 28%; }
.col-funding { width: 10%; text-align: center; }
.col-period { width: 15%; }
.col-leader { width: 20%; }



/* 响应式调整 */
@media (max-width: 768px) {
  .projects-table-container {
    border-radius: 6px;
  }

  .projects-table {
    font-size: 0.9rem;
  }

  .projects-table th,
  .projects-table td {
    padding: 12px 8px;
  }
}





/* 页脚 */
.page-footer {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  color: #64748b;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;

}

.contact-info h4 {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
}

.contact-info p {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: #5d6d7e;
  font-family: 'Times New Roman', 'Times', serif;
  font-size: 0.8rem;
}

.contact-info i {
  margin-right: 12px;
  color: rgba(0, 98, 202, 0.85);
  width: 20px;
  text-align: center;
}

.footer-note {
  text-align: right;
  max-width: 400px;
}

.footer-note p {
  margin-bottom: 8px;
  color: #64748b;
  font-family: 'Times New Roman', 'Times', serif;
  font-size: 0.8rem;
}

.footer-sub {
  font-size: 0.6rem;
  color: #94a3b8;
  font-style: italic;
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .about-container {
    padding: 40px 40px 60px 100px;
  }
}

@media (max-width: 900px) {
  .about-container {
    padding: 30px 30px 50px 80px;
  }

  .institute-title {
    font-size: 2.2rem;
  }

  .content-section {
    padding: 40px 35px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .faculty-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .about-container {
    padding: 20px 20px 40px 20px;
  }
  .institute-title {
    font-size: 1.8rem;
  }

  .content-section {
    padding: 30px 25px;
    margin-bottom: 40px;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .section-marker {
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 2.5rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
  .footer-note {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .about-container {
    padding: 15px 15px 30px 15px;
  }
  .institute-title {
    font-size: 1.5rem;
  }
  .content-section {
    padding: 25px 20px;
  }
  .faculty-grid {
    grid-template-columns: 1fr;
  }

}
/* 科研成果主容器 */
.achievements-container {
  background: white;
  border-radius: 16px;
  padding: 50px 60px;
  margin: 40px 0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  border-left: 6px solid #791ae4; /* 科研成果模块主题色 */
  transform: translateZ(0);
  contain: layout style paint; /* 提升渲染性能 */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
  will-change: opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 模块标题 */
.module-header h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 5px;
  text-align: center;
}

.module-subtitle {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-bottom: 40px;
  font-style: italic;
  font-family: 'Times New Roman', 'Times', serif;
}

/* 视图切换按钮 */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.view-toggle button {
  padding: 12px 28px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 50px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  font-size: 0.8rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
display: flex;
  align-items: center;
  gap: 10px;
}

.view-toggle button:hover {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
}

.view-toggle button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

/* 星系图视图 */
.galaxy-view {
  position: relative;
  min-height: 600px;
}

.galaxy-container {
  position: relative;
  width: 100%;
  height: 650px; /* 适当增高，给星球更多布局空间 */
  margin: 0 auto;
  background: linear-gradient(135deg, #fafdff 0%, #f0f7ff 100%);
  border-radius: 16px; /* 增加圆角，更美观 */
  overflow: hidden;
}
.galaxy-orbit {
  width: 100%;
  height: 100%;
}

.galaxy-orbit circle {
  cx: 50%;
  cy: 50%;
  r: 42%; /* 调整轨道半径，适配星球新位置 */
  fill: none;
  stroke: rgba(52, 152, 219, 0.15); /* 加深轨道线颜色，更明显 */
  stroke-width: 1.5;
  stroke-dasharray: 5, 3; /* 虚线效果，更具科技感 */
}
/* 中心团队标识 */
.galaxy-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.center-logo {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #2c3e50, #3498db); /* 更稳重的颜色 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.2); /* 更专业的阴影 */
  border: 3px solid rgba(255, 255, 255, 0.8); /* 添加白色边框 */
}

.center-logo i {
  font-size: 5rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); /* 文字阴影 */
}

.center-label {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
  white-space: nowrap;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  display: inline-block;
  border: 1px solid rgba(52, 152, 219, 0.2);
}
/* 研究领域“星球” */
.research-planet {
  position: absolute;
  border-radius: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  transform-origin: center;
  background: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 0.5rem 0.8rem; /* 增加内边距，给文字留空间 */
  text-align: center; /* 文字居中 */
  line-height: 1.4;
  will-change: transform;
  transform: translateZ(0); /* 触发GPU加速 */
}

.research-planet:hover {
  transform: scale(1.15);
  z-index: 10;
}

.research-planet.active {
  transform: scale(1.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 不同领域“星球”的配色 */
/* 月球科学：蓝色渐变 */
.research-planet.lunar {
  border: 3px solid #3498db;
  color: #2980b9;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(52, 152, 219, 0.1));

}

/* 火星探测：红色渐变 */
.research-planet.mars {
  border: 3px solid #e74c3c;
  color: #c0392b;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.05), rgba(231, 76, 60, 0.1));

}

/* 金星与小天体：橙色渐变 */
.research-planet.venus {
  border: 3px solid #f39c12;
  color: #d35400;
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.05), rgba(243, 156, 18, 0.1));

}

/* 技术方法与载荷：绿色渐变 */
.research-planet.tech {
  border: 3px solid #2ecc71;
  color: rgba(8, 149, 67, 0.84);
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.05), rgba(46, 204, 113, 0.1));

}

/*  hover 效果强化：增加阴影和缩放比例 */
.research-planet:hover {
  transform: scale(1.2);
  z-index: 10;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.research-planet.active {
  transform: scale(1.25);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border-width: 4px; /* 激活时边框加粗，突出显示 */
}
.planet-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}


.planet-label {
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  font-size: 1.2rem;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 长文字强制换行 */
  margin-bottom: 0.5rem;
  color: inherit; /* 继承星球颜色，保持一致性 */
}

.planet-count {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.3rem;
}

/* 星球图标：调整大小和间距 */
.planet-icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: inherit;
}

/* 详情面板 */
.detail-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 20;
  animation: slideUp 0.3s ease;
  will-change: transform, opacity; /* 提示浏览器进行GPU加速 */
  backface-visibility: hidden; /* 防止闪烁 */
  -webkit-font-smoothing: antialiased; /* 字体平滑 */
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* 使用贝塞尔曲线使动画更自然 */
  will-change: transform, opacity;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.detail-header h3 {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.achievement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.achievement-list li {
  padding: 12px 15px;
  border-bottom: 1px dashed #e2e8f0;
  display: flex;
  align-items: flex-start;
  transition: background 0.2s;
}

.achievement-list li:hover {
  background: #f8fafc;
}

.achievement-date {
  flex: 0 0 100px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.achievement-title {
  flex: 1;
  color: #4a5568;
  line-height: 1.5;
  font-family: "Times New Roman", Times, serif;
}

/* 时间轴视图 */
.timeline-view {
  padding: 20px 0;
}

.timeline-container {
  position: relative;
  min-height: 500px;
  margin-left: 100px;
}

.timeline-line {
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #9b59b6, #3498db);
  border-radius: 2px;
}

.card-field {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .achievements-container {
    padding: 40px 30px;
  }

  .galaxy-container {
    height: 500px;
  }


}

@media (max-width: 768px) {
  .achievements-container {
    padding: 30px 20px;
    margin: 20px 0;
  }

  .module-header h2 {
    font-size: 1.8rem;
  }

  .view-toggle {
    flex-direction: column;
    align-items: center;
  }

  .galaxy-container {
    height: 400px;
  }

  .center-logo {
    width: 60px;
    height: 60px;
  }

  .center-logo i {
    font-size: 1.8rem;
  }

  .timeline-container {
    margin-left: 60px;
  }


}

@media (max-width: 480px) {
  .achievements-summary {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
/* 科研成果容器 */
.achievements-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  padding: 50px 60px;
  margin-bottom: 60px;
  border: 1px solid rgb(224, 232, 241);
  position: relative;
  overflow: visible; /* 修改为visible防止内容被截断 */
  min-height: 600px; /* 添加最小高度 */
}

/* 星系图容器 */
.galaxy-container {
  position: relative;
  height: 600px; /* 增加高度 */
  width: 80%;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0f7ff 100%);
  border-radius: 12px;
  overflow: visible; /* 修改为visible */
  margin-bottom: 20px;
}

/* 研究领域星球 */
.research-planet {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  padding: 15px; /* 增加内边距 */
  text-align: center;
  word-wrap: break-word; /* 允许文字换行 */
  white-space: normal; /* 修改为normal */
}

.planet-label {
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: normal; /* 修改为normal允许换行 */
  line-height: 1.3;
  margin-bottom: 5px;
  text-align: center;
}

.planet-count {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* 详情面板优化 */
.detail-panel {
  position: fixed; /* 改为fixed定位 */
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  max-height: 70vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 25px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

.detail-content {
  max-height: calc(70vh - 100px);
  overflow-y: auto;
}

.achievement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: none; /* 移除固定高度 */
}

.achievement-list li {
  padding: 15px 20px; /* 增加内边距 */
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  transition: background 0.2s;
  gap: 15px; /* 增加间距 */
}

.achievement-date {
  flex: 0 0 120px; /* 增加宽度 */
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.achievement-title {
  flex: 1;
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

/* 时间轴卡片优化 */
.achievement-card {
  background: white;
  border-radius: 12px; /* 增加圆角 */
  padding: 20px; /* 增加内边距 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #3498db;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  min-height: 120px; /* 设置最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 0.8rem; /* 增大字体 */
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 12px;
  font-weight: 500;
}

.card-field {
  font-size: 0.8rem; /* 增大字体 */
  color: #7f8c8d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}


/* 响应式设计优化 */
@media (max-width: 1100px) {
  .achievements-container {
    padding: 40px 30px;
  }

  .galaxy-container {
    height: 500px;
  }

  .research-planet {
    padding: 12px;
    min-width: 100px;
  }

  .planet-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .achievements-container {
    padding: 30px 20px;
    margin: 20px 0;
  }

  .galaxy-container {
    height: 400px;
  }

  .research-planet {
    padding: 8px;
    min-width: 80px;
  }

  .planet-label {
    font-size: 0.7rem;
  }

  .detail-panel {
    width: 95%;
    bottom: 10px;
  }

  .achievement-list li {
    flex-direction: column;
    gap: 8px;
  }

  .achievement-date {
    flex: none;
  }
}

@media (max-width: 480px) {
  .galaxy-container {
    height: 350px;
  }

  .research-planet {
    min-width: 70px;
    padding: 6px;
  }

  .planet-label {
    font-size: 0.65rem;
  }

  .achievement-card {
    padding: 15px;
    min-height: 100px;
  }

  .card-title {
    font-size: 1rem;
  }
}
/* 添加到style部分 */
.card-period {
  font-size: 0.85rem;
  color: #718096;
  font-style: italic;
  margin-top: 8px;
}

/* 垂直时间轴样式 */
.timeline-view {
  padding: 20px 0;
}

.timeline-container {
  position: relative;
  padding-left: 80px; /* 给阶段标签留空间，替代 margin-left */
  margin: 40px 0;
  min-height: auto;
}

.timeline-line {
  position: absolute;
  left: -60px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #9b59b6, #3498db);
  border-radius: 2px;
}

/* 阶段组垂直排列 */
.timeline-stage-group {
  position: relative; /* 改为相对定位，避免层级冲突 */
  width: 100%;
  margin-bottom: 60px; /* 增加阶段之间的垂直间距，避免上下遮挡 */
  padding-top: 10px;
}
.timeline-stage-group:last-child {
  margin-bottom: 20px;
}
/* 阶段节点样式 */
.stage-node {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-right: 30px;
  position: relative;
  left: -90px;
}

.stage-dot {
  width: 16px;
  height: 16px;
  background: white;
  border: 4px solid #9b59b6;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.3);
}

.stage-label {
  background: #2c3e50;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: nowrap;
  margin-left: 15px;
  min-width: 120px;
  text-align: center;
}

/* 横向卡片容器 */
/* 卡片容器：垂直堆叠，自动换行，取消横向滚动 */
.achievement-cards-horizontal {
  display: grid; /* 网格布局，自动适配宽度 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 自动分栏，最小宽度280px */
  gap: 20px; /* 卡片之间的间距（水平+垂直），避免相邻卡片遮挡 */
  width: 100%;
  padding: 0; /* 移除多余内边距 */
  overflow-x: visible; /* 取消横向滚动 */
}

/* 卡片样式：自适应宽度，优化内边距和高度 */
.achievement-card-horizontal {
  background: white;
  border-radius: 10px;
  padding: 18px; /* 适度内边距，避免内容溢出 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #3498db;
  transition: all 0.3s ease;
  flex: none; /* 取消弹性布局限制 */
  min-height: 130px; /* 最小高度保证内容不挤压 */
  width: 100%; /* 自适应网格宽度 */
}

.achievement-card-horizontal:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* 横向卡片中不同领域的颜色 */
.achievement-card-horizontal.lunar {
  border-left-color: #3498db;
}

.achievement-card-horizontal.mars {
  border-left-color: #e74c3c;
}

.achievement-card-horizontal.venus {
  border-left-color: #f39c12;
}

.achievement-card-horizontal.tech {
  border-left-color: #2ecc71;
}

/* 横向卡片的标题样式（缩小字体） */
.achievement-card-horizontal .card-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 0.75rem;
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 8px;
  font-weight: 500;
}

.achievement-card-horizontal .card-field {
  font-size: 0.65rem;
  color: #7f8c8d;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.achievement-card-horizontal .card-period {
  font-size: 0.75rem;
  color: #a0aec0;
  font-style: italic;
}



.achievement-cards-horizontal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.achievement-cards-horizontal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.achievement-cards-horizontal::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
/* 成果链接样式：覆盖整个列表项 */
.achievement-link {
  display: flex;
  width: 100%;
  text-decoration: none; /* 去掉默认下划线 */
  color: inherit; /* 继承原有文字颜色 */
  cursor: pointer;
}

/* hover 效果：背景变色+文字高亮，提示可点击 */
.achievement-link:hover {
  color: #3498db; /*  hover 时文字变主题色 */
}

/* hover 时列表项背景同步变化 */
.achievement-list li:hover {
  background: #f0f7ff;
}


.achievement-link:hover .achievement-title {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .timeline-container {
    margin-left: 100px;
  }
  .stage-label {
    background: #2c3e50;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-family: 'Noto Serif SC', serif;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    margin-left: 12px;
    min-width: 120px;
    text-align: center;
  }
  .stage-node {
    display: flex;
    align-items: center;
    position: absolute;
    left: -70px; /* 相对于容器的 padding-left 定位 */
    top: 20px;
  }

  .achievement-card-horizontal {
    flex: 0 0 220px;
  }
}

/* 平板屏幕（768px以下）：卡片单列布局 */
@media (max-width: 768px) {
  .timeline-container {
    padding-left: 60px; /* 缩小左边距 */
  }

  .achievement-cards-horizontal {
    grid-template-columns: 1fr; /* 单列布局，避免横向挤压 */
  }

  .stage-node {
    left: -50px;
    top: 10px;
  }

  .stage-label {
    min-width: 100px;
    font-size: 0.85rem;
    padding: 5px 10px;
  }
}

/* 手机屏幕（480px以下）：进一步缩小边距 */
@media (max-width: 480px) {
  .timeline-container {
    padding-left: 40px;
  }

  .achievement-card-horizontal {
    padding: 15px;
    min-height: 110px;
  }

  .stage-label {
    min-width: 80px;
    font-size: 0.8rem;
  }
}

</style>
📋