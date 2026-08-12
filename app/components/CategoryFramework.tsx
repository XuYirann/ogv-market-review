"use client";

import { useState } from "react";

type Category = {
  id: string;
  index: string;
  name: string;
  scope: string;
  question: string;
  modules: { title: string; question: string; views: string[] }[];
  sources: string[];
};

const categories: Category[] = [
  {
    id: "animation",
    index: "01",
    name: "动画",
    scope: "番剧 · 国创",
    question: "存量头部集中度继续提高时，新内容还有哪些突围窗口？",
    modules: [
      { title: "大盘趋势", question: "番剧与国创的消费规模是否止跌？", views: ["季度有效播放趋势", "分平台同比贡献"] },
      { title: "新作供给", question: "新作数量、题材和播放效率如何变化？", views: ["上新量与播放量", "题材构成与集均播放"] },
      { title: "头部结构", question: "增长来自长线 IP 还是季度新作？", views: ["TOP50 分层", "连续在榜与新进内容"] },
      { title: "平台格局", question: "各平台靠什么内容获得份额？", views: ["平台播放份额", "平台代表项目"] },
      { title: "业务启示", question: "B 站应守住什么、补足什么？", views: ["机会判断", "关注清单"] },
    ],
    sources: ["云合有效播放", "项目上新表", "TOP50 项目明细", "题材标签"],
  },
  {
    id: "horizontal-drama",
    index: "02",
    name: "横屏剧集",
    scope: "长剧 · 横屏短剧",
    question: "大盘收缩下，什么题材、量级和合作模式仍能穿越周期？",
    modules: [
      { title: "大盘趋势", question: "长剧与横屏短剧的播放水位如何变化？", views: ["季度有效播放", "热播与上新拆分"] },
      { title: "内容效率", question: "下滑来自供给减少还是单剧效率下降？", views: ["上新数 × 集均播放", "头腰尾分层"] },
      { title: "题材机会", question: "哪些主流题材稳健，哪些小众题材难破圈？", views: ["题材水位矩阵", "超预期项目归因"] },
      { title: "头部与平台", question: "TOP 内容及平台份额如何迁移？", views: ["TOP10 / TOP50", "独播与拼播结构"] },
      { title: "储备判断", question: "未来两个季度的供给方向是什么？", views: ["开机量与量级", "待播题材结构"] },
    ],
    sources: ["云合剧集明细", "上新项目表", "题材与量级标签", "待播国产剧统计"],
  },
  {
    id: "vertical-drama",
    index: "03",
    name: "竖屏短剧",
    scope: "真人短剧 · AI 短剧",
    question: "AI 内容正在替代哪部分真人供给，用户需求发生了什么变化？",
    modules: [
      { title: "市场结构", question: "真人与 AI 短剧的规模如何消长？", views: ["收入与消耗趋势", "真人 / AI 占比"] },
      { title: "题材需求", question: "男女性频与题材偏好如何迁移？", views: ["题材消耗占比", "用户性别结构"] },
      { title: "内容形态", question: "仿真人、漫剧与演绎内容谁更有效？", views: ["形态消耗占比", "上新量与剧目 ARPU"] },
      { title: "头部内容", question: "爆款率和头部题材是否出现突破？", views: ["头部项目榜", "爆款率对比"] },
      { title: "产业判断", question: "成本与产能迁移会如何影响供给？", views: ["制作效率", "平台政策与产能"] },
    ],
    sources: ["短剧投流数据", "平台收入数据", "项目榜单", "平台政策追踪"],
  },
  {
    id: "variety",
    index: "04",
    name: "综艺",
    scope: "长综艺 · 新综艺",
    question: "存量综 N 代主导的市场里，是否出现新的节目模式和平台机会？",
    modules: [
      { title: "大盘趋势", question: "整体与热播综艺播放是否企稳？", views: ["季度有效播放", "上新 / 存量贡献"] },
      { title: "头部内容", question: "新综艺能否进入头部？", views: ["TOP10 榜单", "新综 / 综 N 代结构"] },
      { title: "平台表现", question: "各平台依赖哪些节目获得份额？", views: ["平台播放趋势", "平台头部项目"] },
      { title: "模式观察", question: "有哪些值得跟进的新模式？", views: ["节目模式标签", "创新案例"] },
      { title: "业务启示", question: "采买、自制与合作应关注什么？", views: ["机会判断", "项目观察池"] },
    ],
    sources: ["云合综艺明细", "节目上新表", "节目模式标签"],
  },
  {
    id: "film",
    index: "05",
    name: "电影",
    scope: "院线新片 · 存量影片",
    question: "院线供给低迷如何传导至网络播放与平台份额？",
    modules: [
      { title: "大盘趋势", question: "电影有效播放是否继续加速下滑？", views: ["季度有效播放", "新片 / 存量拆分"] },
      { title: "头部影片", question: "头部水位和内容构成如何变化？", views: ["TOP 影片榜", "内容类型结构"] },
      { title: "平台格局", question: "各平台电影份额和单项目效率如何？", views: ["平台播放份额", "单项目份额"] },
      { title: "院线传导", question: "票房与上映供给将如何影响后续季度？", views: ["票房与供给趋势", "网络上线前瞻"] },
      { title: "业务启示", question: "B 站适合争取哪些窗口与片单？", views: ["机会判断", "待上线片单"] },
    ],
    sources: ["云合电影明细", "院线票房数据", "影片上线日期", "平台播放明细"],
  },
  {
    id: "documentary",
    index: "06",
    name: "纪录片",
    scope: "头部项目 · 模式观察",
    question: "哪些题材与短时长形态更适合平台消费和商业合作？",
    modules: [
      { title: "头部扫描", question: "本季用户在看哪些项目？", views: ["头部项目榜", "题材聚类"] },
      { title: "形态观察", question: "时长、集数和发行方式有何变化？", views: ["单集时长分布", "精编 / 原版结构"] },
      { title: "合作模式", question: "哪些项目体现新的招商或平台合作方式？", views: ["合作案例", "出品与播出平台"] },
      { title: "业务启示", question: "哪些轻量内容模式值得复用？", views: ["模式结论", "项目观察池"] },
    ],
    sources: ["项目播放榜", "项目基础信息", "出品与招商信息"],
  },
];

export function CategoryFramework() {
  const [selectedId, setSelectedId] = useState(categories[0].id);
  const category = categories.find((item) => item.id === selectedId) ?? categories[0];

  return (
    <section id="categories" className="category-framework">
      <header className="category-intro">
        <div>
          <span>PART 02</span>
          <h2>分品类市场</h2>
        </div>
        <p>统一回答市场变化，再保留每个品类真正不同的内容逻辑。当前先确认结构，数据与结论按模块逐步接入。</p>
      </header>

      <div className="category-tabs" role="tablist" aria-label="选择内容品类">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === category.id}
            className={item.id === category.id ? "selected" : ""}
            onClick={() => setSelectedId(item.id)}
          >
            <small>{item.index}</small>
            <strong>{item.name}</strong>
            <span>{item.scope}</span>
          </button>
        ))}
      </div>

      <article className="category-detail" id={`category-${category.id}`}>
        <div className="category-thesis">
          <span>{category.index} / {category.name}</span>
          <h3>{category.question}</h3>
          <p>{category.scope}</p>
        </div>

        <div className="category-flow">
          {category.modules.map((module, index) => (
            <section key={module.title} className="category-module">
              <div className="category-module-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h4>{module.title}</h4>
                  <p>{module.question}</p>
                </div>
              </div>
              <div className="category-view-list">
                {module.views.map((view) => <span key={view}>{view}</span>)}
              </div>
            </section>
          ))}
        </div>

        <footer className="category-data-footer">
          <strong>待接数据</strong>
          <div>{category.sources.map((source) => <span key={source}>{source}</span>)}</div>
        </footer>
      </article>
    </section>
  );
}
