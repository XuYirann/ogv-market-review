import type { Metadata } from "next";
import { DauChart, MauChart } from "./components/DauChart";
import { EditableInsight } from "./components/EditableInsight";
import { DurationStackedCharts } from "./components/DurationStackedCharts";
import { AudienceOverlapChart } from "./components/AudienceOverlapChart";
import { ShortDramaRevenueCharts } from "./components/ShortDramaRevenueCharts";
import { QuarterSummary } from "./components/QuarterSummary";
import { audienceQuarterContent, durationQuarterContent, overlapQuarterContent, shortDramaRevenueQuarterContent } from "./content/26Q2";
import { CategoryFramework } from "./components/CategoryFramework";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "26Q2 OGV 市场复盘 | 平台大盘",
  description: "可复用的 OGV 季度市场复盘框架",
};

const sections = [
  { id: "summary", index: "总览", label: "本季判断" },
  { id: "audience", index: "01", label: "平台" },
  { id: "attention", index: "02", label: "时长格局" },
  { id: "revenue", index: "03", label: "收入结构" },
  { id: "short-drama-revenue", index: "04", label: "短漫剧收入" },
];

const categorySections = [
  { id: "category-animation", index: "01", label: "动画" },
  { id: "category-horizontal-drama", index: "02", label: "横屏剧集" },
  { id: "category-variety", index: "03", label: "综艺" },
  { id: "category-film", index: "04", label: "电影" },
  { id: "category-documentary", index: "05", label: "纪录片" },
];

const modules = [
  {
    id: "audience",
    index: "01",
    title: "用户量",
    visuals: ["平台用户趋势", "用户重合结构"],
  },
  {
    id: "attention",
    index: "02",
    title: "时长格局",
    question: "用户注意力正在向哪些内容形态迁移？",
    visuals: ["行业总时长趋势", "人均时长对比"],
  },
  {
    id: "revenue",
    index: "03",
    title: "收入结构",
    question: "免费模式与付费模式如何重塑市场规模？",
    visuals: ["市场收入趋势", "付费/免费收入结构"],
  },
  {
    id: "short-drama-revenue",
    index: "04",
    title: "短漫剧收入",
    visuals: ["IAA & IAP 平台收入", "真人与 AI 短剧收入"],
  },
];

function ModuleSection({ module }: { module: (typeof modules)[number] }) {
  const isAudience = module.id === "audience";
  const isDuration = module.id === "attention";
  const isShortDramaRevenue = module.id === "short-drama-revenue";
  const isUnderConstruction = module.id === "revenue";
  const audienceInsight = audienceQuarterContent.insights[0];
  const durationInsight = durationQuarterContent.insights[0];
  const overlapInsight = overlapQuarterContent.insights[0];
  const shortDramaRevenueInsight = shortDramaRevenueQuarterContent.insights[0];

  return (
    <section id={module.id} className="report-section">
      <div className="section-heading">
        <span className="section-index">{module.index}</span>
        <div>
          <h2>{module.title}</h2>
        </div>
      </div>

      {isUnderConstruction && <div className="category-under-construction" role="img" aria-label="建设中">🚧</div>}

      {!isUnderConstruction && isAudience && <div className="audience-analysis-group">
        <EditableInsight lead={audienceInsight.lead} body={audienceInsight.body} highlights={audienceInsight.highlights} />
        <div className="audience-charts">
          <DauChart />
          <MauChart />
        </div>
      </div>}

      {!isUnderConstruction && isAudience && <div className="overlap-analysis-group">
        <EditableInsight lead={overlapInsight.lead} body={overlapInsight.body} highlights={overlapInsight.highlights} storageKey="ogv-market-review:26q2:overlap-insight" />
        <AudienceOverlapChart />
      </div>}

      {!isUnderConstruction && isDuration && <div className="duration-analysis-group">
        <EditableInsight lead={durationInsight.lead} body={durationInsight.body} highlights={durationInsight.highlights} storageKey="ogv-market-review:26q2:duration-insight" />
        <DurationStackedCharts />
      </div>}

      {isShortDramaRevenue && <div className="short-revenue-analysis-group">
        <EditableInsight lead={shortDramaRevenueInsight.lead} body={shortDramaRevenueInsight.body} highlights={shortDramaRevenueInsight.highlights} storageKey="ogv-market-review:26q2:short-drama-revenue-insight" />
        <ShortDramaRevenueCharts />
      </div>}

      {!isUnderConstruction && !isDuration && !isShortDramaRevenue && <div className="module-grid">
        {!isAudience && <article className="chart-shell chart-primary">
          <div className="chart-header">
            <div>
              <span>核心视图</span>
              <h3>{module.visuals[0]}</h3>
            </div>
            <b>等待数据</b>
          </div>
          <div className="chart-empty">
            <div className="axis-y" />
            <div className="axis-x" />
            <div className="empty-message">
              <strong>图表将在数据接入后自动生成</strong>
              <span>当前仅确认信息层级与图表位置</span>
            </div>
          </div>
        </article>}

        {!isAudience && <aside className="analysis-shell">
          <div className="analysis-title">
            <span>本季结论</span>
            <b>待撰写</b>
          </div>
          <p>数据更新后，由关键变化自动生成结论草稿，再进行人工校准。</p>
          <div className="analysis-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </aside>}

        {!isAudience && <article className="chart-shell chart-secondary">
          <div className="chart-header">
            <div>
              <span>结构视图</span>
              <h3>{module.visuals[1]}</h3>
            </div>
            <b>等待数据</b>
          </div>
          <div className="compact-empty">
            <i /><i /><i /><i />
          </div>
        </article>}
      </div>}
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="返回顶部">
          <span className="brand-mark">OGV</span>
          <span>市场复盘</span>
        </a>
        <nav aria-label="报告导航">
          <a className="active" href="#overview">平台大盘</a>
          <a href="#categories">分品类</a>
          <span>方法与口径</span>
        </nav>
        <div className="quarter">26Q2</div>
      </header>

      <div id="top" className="page-frame">
        <aside className="side-index" aria-label="报告章节">
          <div className="side-index-group">
            <a className="side-index-title" href="#overview">平台大盘</a>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{section.index}</span>{section.label}
              </a>
            ))}
          </div>
          <div className="side-index-group category-index-group">
            <a className="side-index-title" href="#categories">分品类市场</a>
            {categorySections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{section.index}</span>{section.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="report">
          <section id="summary" className="quarter-summary">
            <div className="quarter-summary-heading"><span>26Q2</span><h1>本季判断</h1></div>
            <QuarterSummary />
          </section>

          <section id="overview" className="hero">
            <div className="hero-copy">
              <p className="eyebrow">PART 01</p>
              <h1>平台大盘</h1>
            </div>
          </section>

          {modules.map((module) => <ModuleSection key={module.id} module={module} />)}

          <CategoryFramework />

        </div>
      </div>
    </main>
  );
}
