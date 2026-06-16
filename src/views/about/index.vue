<template>
  <div class="about-page">
    <section class="about-hero">
      <div>
        <span class="eyebrow">Competition Platform</span>
        <h1>关于系统</h1>
        <p>大学生竞赛管理系统面向学生、指导老师和院系管理员，覆盖赛事发布报名、团队管理、项目进度、作品提交、评审获奖、资源沉淀和角色工作台。</p>
      </div>
      <div class="about-mark">PDS</div>
    </section>

    <section class="role-grid">
      <article v-for="role in roles" :key="role.title" class="role-card">
        <i :class="role.icon"></i>
        <h2>{{ role.title }}</h2>
        <p>{{ role.desc }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      roles: [
        {
          title: '学生用户',
          icon: 'fas fa-user-graduate',
          desc: '赛事浏览与报名、团队组建与管理、项目进度维护、作品提交、资源下载和获奖查询。'
        },
        {
          title: '指导老师',
          icon: 'fas fa-chalkboard-teacher',
          desc: '赛事信息发布、团队资质审核、指导项目绑定、线上指导、作品评审和获奖录入。'
        },
        {
          title: '院系管理员',
          icon: 'fas fa-user-shield',
          desc: '赛事审核、全量数据查看、获奖成果归档、报表导出和师生账号管理。'
        }
      ]
    }
  }
}
</script>

<style scoped>
.about-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 104px 32px 72px;
  color: var(--capsule-ink);
  font-family: var(--font-body);
}
.about-hero,
.role-card {
  border: 2px solid var(--capsule-outline);
  border-radius: 32px;
  background: #fff;
  box-shadow: 8px 8px 0 var(--capsule-shadow);
}
.about-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 36px;
  background:
    radial-gradient(ellipse at 86% 20%, rgba(196, 217, 78, 0.2), transparent 42%),
    radial-gradient(ellipse at 12% 88%, rgba(197, 181, 224, 0.26), transparent 42%),
    #fff;
}
.eyebrow {
  display: inline-flex;
  width: max-content;
  padding: 9px 18px;
  border: 2px solid var(--capsule-outline);
  border-radius: 9999px;
  background: var(--capsule-yellow);
  color: var(--capsule-ink);
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.about-hero h1,
.role-card h2 {
  margin: 12px 0;
  color: var(--capsule-ink);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}
.about-hero h1 {
  font-size: 48px;
  line-height: 1.05;
}
.about-hero p,
.role-card p {
  color: #4a4a4a;
  line-height: 1.75;
}
.about-mark {
  display: grid;
  place-items: center;
  width: 126px;
  height: 126px;
  border: 2px solid var(--capsule-outline);
  border-radius: 50%;
  background: var(--capsule-sky);
  box-shadow: 8px 8px 0 var(--capsule-shadow);
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 800;
}
.role-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
}
.role-card {
  padding: 28px;
}
.role-card:nth-child(1) { background: var(--capsule-peach); }
.role-card:nth-child(2) { background: var(--capsule-sky); }
.role-card:nth-child(3) { background: var(--capsule-mint); }
.role-card i {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 2px solid var(--capsule-outline);
  border-radius: 50%;
  background: #fff;
  box-shadow: 4px 4px 0 var(--capsule-shadow);
  font-size: 22px;
}
@media (max-width: 900px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .about-page {
    padding: 94px 16px 48px;
  }
  .about-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 22px;
  }
  .about-hero h1 {
    font-size: 36px;
  }
}
</style>
