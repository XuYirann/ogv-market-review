"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import data from "../data/animationTrend.json";
import vvRankingData from "../data/animationVvRanking.json";
import top50Data from "../data/animationTop50.json";
import { EditableInsight } from "./EditableInsight";
import { type BracketComparison, setBracketAnnotations } from "./chartBrackets";
import { getChartLayout, resizeResponsiveChart } from "./chartResponsive";

type QuarterFilter = "Q1" | "Q2" | "Q3" | "Q4" | "all";
type ChartKind = "total" | "japanese" | "chinese";

const categoryColors: Record<string, string> = { 其他: "#385577", 国创: "#b7d9ea", 日番: "#ed8f8b" };
const platformColors: Record<string, string> = { 优酷: "#89D8F0", 爱奇艺: "#C0D688", 腾讯视频: "#A9BACF", bilibili: "#D99AAF" };
const legendOrder: Record<ChartKind, string[]> = {
  total: ["日番", "国创", "其他"],
  japanese: ["bilibili", "腾讯视频", "爱奇艺", "优酷"],
  chinese: ["bilibili", "腾讯视频", "爱奇艺", "优酷"],
};
const pct = (current: number, previous: number) => previous ? `${current >= previous ? "+" : ""}${((current / previous - 1) * 100).toFixed(0)}%` : "–";

type VvTier = ">1kw" | "100-1kw" | "<100w";
type VvRankingItem = { period: string; name: string; value: number; tier: VvTier };
const vvTiers: VvTier[] = [">1kw", "100-1kw", "<100w"];
const vvTierLabels: Record<VvTier, string> = { ">1kw": "头部｜> 1,000 万", "100-1kw": "腰部｜100–1,000 万", "<100w": "长尾｜< 100 万" };
const formatVv = (value: number) => value < 10000 ? "<1 万" : `${Math.round(value / 10000)} 万`;

function VvRankingPanel({ period }: { period: "25Q2" | "26Q2" }) {
  const rows = (vvRankingData as VvRankingItem[]).filter((item) => item.period.toUpperCase() === period.toUpperCase());
  const maxValue = Math.max(...rows.map((item) => item.value), 1);
  const releaseCount = period === "25Q2" ? 26 : 7;
  return <article className="animation-vv-panel">
    <header className="animation-vv-panel-head"><div><strong>{period} 国创长片新作</strong><span>按集均 VV 从高到低</span></div><b>共上新 {releaseCount} 部</b></header>
    <div className="animation-vv-scroll" tabIndex={0} aria-label={`${period} 国创长片新作集均VV排序`}>
      {vvTiers.map((tier) => {
        const items = rows.filter((item) => item.tier === tier).sort((a, b) => b.value - a.value);
        return <section className={`animation-vv-tier animation-vv-tier-${tier.replace(/[^a-z0-9]/gi, "-")}`} key={tier}>
          <div className="animation-vv-tier-head"><strong>{vvTierLabels[tier]}</strong><span>{items.length} 部</span></div>
          {items.map((item, index) => <div className="animation-vv-row" key={`${period}-${item.name}`}>
            <span className="animation-vv-rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="animation-vv-name" title={item.name}>{item.name}</span>
            <span className="animation-vv-bar-cell"><i style={{ width: `${Math.max(1, item.value / maxValue * 100)}%` }} /></span>
            <strong className="animation-vv-value">{formatVv(item.value)}</strong>
          </div>)}
        </section>;
      })}
    </div>
  </article>;
}

function VvRankingModule() {
  return <section className="animation-vv-followup">
    <div className="horizontal-drama-lead">
      <EditableInsight
        lead="头部供给数量稳定，但档内差距依然显著"
        body="26Q2 与 25Q2 均有 3 部新作进入千万级集均播放，但头部第一名与同档其他作品仍存在明显断层；腰部作品更加集中，长尾项目数量较多。"
        highlights={["均有 3 部", "明显断层", "长尾项目数量较多"]}
        storageKey="ogv-market-review:26q2:animation-vv-ranking-v1"
      />
    </div>
    <div className="animation-vv-frame"><div className="animation-vv-quarter-grid"><VvRankingPanel period="25Q2" /><VvRankingPanel period="26Q2" /></div></div>
  </section>;
}

type Top50ChartKind = "platform" | "structure";
const top50StructureColors: Record<string, string> = { "TOP11–50": "#b7d9ea", TOP10: "#385577" };

function Top50Chart({ kind }: { kind: Top50ChartKind }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "svg" });
    const source = kind === "platform" ? top50Data.platform : top50Data.structure;
    const order = kind === "platform" ? ["腾讯视频", "bilibili", "优酷", "爱奇艺"] : ["TOP10", "TOP11–50"];
    const colors = kind === "platform" ? platformColors : top50StructureColors;
    const renderSeries = [...order].reverse();
    const totals = source.periods.map((_, index) => order.reduce((sum, name) => sum + Number(source.series.find((item) => item.name === name)?.values[index] ?? 0), 0));
    const layoutSpec = { left: 42, right: kind === "platform" ? 94 : 88, top: 68, bottom: 42, variant: "right-legend" as const, minRight: kind === "platform" ? 94 : 88 };
    chart.setOption({
      animationDuration: 420,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${Number(value).toFixed(1)} 亿` },
      grid: getChartLayout(ref.current.clientWidth, layoutSpec).grid,
      xAxis: { type: "category", data: source.periods, axisTick: { show: false }, axisLine: { lineStyle: { color: "#aeb7b0" } }, axisLabel: { color: "#737c76", fontSize: 10 } },
      yAxis: { type: "value", name: "亿", nameTextStyle: { color: "#737c76", fontSize: 9 }, axisLabel: { color: "#737c76", fontSize: 9 }, splitLine: { lineStyle: { color: "#e4e7e4" } } },
      series: [
        ...renderSeries.map((name) => {
          const item = source.series.find((entry) => entry.name === name)!;
          return { name, type: "bar" as const, stack: "total", data: item.values, barMaxWidth: 54, itemStyle: { color: colors[name] }, label: { show: true, position: "inside" as const, color: name === "TOP10" || name === "腾讯视频" ? "#fff" : "#263038", fontSize: 9, formatter: ({ value, dataIndex }: { value: number; dataIndex: number }) => kind === "platform" && value < 4.5 ? "" : value < 1 ? "" : `${value.toFixed(1)}\n(${(value / totals[dataIndex] * 100).toFixed(0)}%)` } };
        }),
        { name: "柱顶合计", type: "bar", data: totals, barMaxWidth: 54, barGap: "-100%", silent: true, z: 20, itemStyle: { color: "transparent" }, label: { show: true, position: "top", distance: 7, color: "#161917", fontSize: 11, fontWeight: 700, formatter: ({ value }: { value: number }) => value.toFixed(1) } },
      ],
    });
    const draw = () => {
      const comparisons: BracketComparison[] = [{ previousIndex: 0, currentIndex: 1, previousValue: totals[0], currentValue: totals[1], label: pct(totals[1], totals[0]), targetGap: 26, labelFontSize: 8 }];
      order.forEach((name, index) => {
        const item = source.series.find((entry) => entry.name === name)!;
        comparisons.push({ previousIndex: 0, currentIndex: 1, previousValue: item.values[1], currentValue: item.values[1], variant: "sideLabel", title: name, label: `同比 ${pct(item.values[1], item.values[0])}`, swatchColor: colors[name], labelFontSize: 8, labelY: 88 + index * (kind === "platform" ? 52 : 74), legendWidth: kind === "platform" ? 90 : 84, legendRightInset: 0 });
      });
      if (kind === "platform") source.periods.forEach((_, dataIndex) => {
        const small = renderSeries.map((name, seriesIndex) => ({ name, seriesIndex, item: source.series.find((entry) => entry.name === name)! })).filter(({ item }) => item.values[dataIndex] > 0 && item.values[dataIndex] < 4.5);
        small.forEach(({ name, seriesIndex, item }, smallIndex) => {
          const value = item.values[dataIndex];
          const lower = renderSeries.slice(0, seriesIndex).reduce((sum, lowerName) => sum + (source.series.find((entry) => entry.name === lowerName)?.values[dataIndex] ?? 0), 0);
          const shiftByPlatform: Record<string, number> = { bilibili: -18, 优酷: 14, 爱奇艺: -8 };
          const elbowByPlatform: Record<string, number> = { bilibili: 35, 优酷: 31, 爱奇艺: 29 };
          comparisons.push({ previousIndex: dataIndex, currentIndex: dataIndex, previousValue: lower + value / 2, currentValue: lower + value / 2, label: `${value.toFixed(1)}\n(${(value / totals[dataIndex] * 100).toFixed(0)}%)`, variant: "barCallout", color: colors[name], labelFontSize: 8, labelYShift: shiftByPlatform[name] ?? (smallIndex * 12), arrowOffset: elbowByPlatform[name] ?? 31, barHalfWidth: 27 });
        });
      });
      setBracketAnnotations(chart, comparisons);
    };
    requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => ref.current && resizeResponsiveChart(chart, ref.current, layoutSpec, draw));
    observer.observe(ref.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [kind]);
  return <div ref={ref} className="animation-top50-chart" role="img" aria-label={kind === "platform" ? "TOP50国创分平台有效播放" : "TOP50国创有效播放结构"} />;
}

function Top10DetailTable() {
  return <div className="animation-top10-table-wrap">
    <div className="animation-top10-table" role="table" aria-label="26Q2国创长片TOP10播放明细">
      <div className="animation-top10-row animation-top10-head" role="row"><span>排名</span><span>剧名</span><span>26Q2</span><span>25Q2</span><span>同比</span></div>
      {top50Data.top10.map((item, index) => <div className="animation-top10-row" role="row" key={item.name}>
        <span>{String(index + 1).padStart(2, "0")}</span><strong title={item.name}>{item.name}</strong><span>{(item.current / 100000000).toFixed(1)} 亿</span><span>{item.previous == null ? "—" : `${(item.previous / 100000000).toFixed(1)} 亿`}</span><b className={item.previous != null && item.current < item.previous ? "negative" : ""}>{item.previous == null ? "新上榜" : pct(item.current, item.previous)}</b>
      </div>)}
    </div>
  </div>;
}

function Top50Module() {
  return <section className="animation-top50-section">
    <div className="horizontal-drama-lead">
      <div className="horizontal-drama-subhead"><span>03</span><h4>国创 TOP50 下拆</h4></div>
      <EditableInsight
        lead="TOP50 播放继续收缩，头部集中度逆势提升"
        body="26Q2 国创长片 TOP50 有效播放 64.8 亿，同比下降 20%；其中 TOP10 播放 41.0 亿，同比下降 15%，降幅小于 11–50 名的 28%，TOP10 占比提升至 63%。腾讯视频仍贡献 43.9 亿，但同比下降 32%；B站与优酷分别增至 11.9 亿和 7.1 亿。"
        highlights={["64.8 亿", "下降 20%", "41.0 亿", "下降 15%", "28%", "提升至 63%", "43.9 亿", "下降 32%", "11.9 亿", "7.1 亿"]}
        storageKey="ogv-market-review:26q2:animation-top50-v1"
      />
    </div>
    <div className="animation-top50-grid">
      <article className="horizontal-drama-panel"><header><h5>TOP50 国创分平台有效播放（亿）</h5></header><Top50Chart kind="platform" /></article>
      <article className="horizontal-drama-panel"><header><h5>TOP50 国创有效播放（亿）</h5></header><Top50Chart kind="structure" /></article>
      <article className="horizontal-drama-panel"><header><h5>26Q2 TOP10 播放明细</h5></header><Top10DetailTable /></article>
    </div>
  </section>;
}

function AnimationChart({ kind, filter }: { kind: ChartKind; filter: QuarterFilter }) {
  const ref = useRef<HTMLDivElement>(null);
  const view = useMemo(() => {
    const indexes = data.periods
      .map((period, index) => ({ period, index }))
      .filter(({ period }) => period >= "24Q2" && (filter === "all" || period.endsWith(filter)));
    return {
      periods: indexes.map(({ period }) => period),
      series: data[kind].series.map((item) => ({ ...item, values: indexes.map(({ index }) => item.values[index]) })),
    };
  }, [filter, kind]);

  useEffect(() => {
    if (!ref.current || !view.periods.length) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "svg" });
    const layoutSpec = { left: 40, right: kind === "total" ? 78 : 76, top: 66, bottom: 42, variant: "right-legend" as const, minRight: kind === "total" ? 78 : 76 };
    const colors = kind === "total" ? categoryColors : platformColors;
    const totals = view.periods.map((_, index) => view.series.reduce((sum, item) => sum + Number(item.values[index] ?? 0), 0));
    chart.setOption({
      animationDuration: 420,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${Number(value).toFixed(1)} 亿` },
      grid: getChartLayout(ref.current.clientWidth, layoutSpec).grid,
      xAxis: { type: "category", data: view.periods, axisTick: { show: false }, axisLine: { lineStyle: { color: "#aeb7b0" } }, axisLabel: { color: "#737c76", fontSize: 9, interval: filter === "all" ? 3 : 0 } },
      yAxis: { type: "value", name: "亿", nameTextStyle: { color: "#737c76", fontSize: 9 }, axisLabel: { color: "#737c76", fontSize: 9 }, splitLine: { lineStyle: { color: "#e4e7e4" } } },
      series: [
        ...view.series.map((item) => ({
          name: item.name,
          type: "bar" as const,
          stack: "total",
          data: item.values,
          barMaxWidth: 36,
          itemStyle: { color: colors[item.name] },
          label: {
            show: filter !== "all",
            position: "inside" as const,
            color: item.name === "其他" || item.name === "腾讯视频" ? "#fff" : "#263038",
            fontSize: 8,
            formatter: ({ value, dataIndex }: { value: number; dataIndex: number }) => value < 2.5 ? "" : `${value.toFixed(0)}\n(${(value / totals[dataIndex] * 100).toFixed(0)}%)`,
          },
        })),
        { name: "柱顶合计", type: "bar", data: totals, barMaxWidth: 36, barGap: "-100%", silent: true, z: 20, itemStyle: { color: "transparent" }, label: { show: true, position: "top", distance: 7, color: "#161917", fontSize: 10, fontWeight: 700, formatter: ({ value }: { value: number }) => value.toFixed(0) } },
      ],
    });

    const draw = () => {
      const currentIndex = view.periods.length - 1;
      const previousIndex = currentIndex - 1;
      if (filter === "all" || previousIndex < 0) return setBracketAnnotations(chart, []);
      const comparisons: BracketComparison[] = [{
        previousIndex, currentIndex,
        previousValue: totals[previousIndex], currentValue: totals[currentIndex],
        label: pct(totals[currentIndex], totals[previousIndex]), targetGap: 24, labelFontSize: 8,
      }];
      legendOrder[kind].forEach((name, index) => {
        const item = view.series.find((entry) => entry.name === name);
        if (!item) return;
        const current = Number(item.values[currentIndex]);
        const previous = Number(item.values[previousIndex]);
        comparisons.push({
          previousIndex, currentIndex, previousValue: current, currentValue: current,
          variant: "sideLabel", title: name, label: `同比 ${pct(current, previous)}`,
          swatchColor: colors[name], labelFontSize: 8, labelY: 86 + index * (kind === "total" ? 66 : 54),
          legendWidth: kind === "total" ? 74 : 72,
          legendRightInset: 0,
        });
      });
      setBracketAnnotations(chart, comparisons);
    };
    requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => ref.current && resizeResponsiveChart(chart, ref.current, layoutSpec, draw));
    observer.observe(ref.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [filter, kind, view]);

  return <div ref={ref} className="animation-chart" role="img" aria-label={kind === "total" ? "动画有效播放分品类" : kind === "japanese" ? "分平台日番有效播放" : "分平台国创有效播放"} />;
}

function NewReleaseChart({ filter }: { filter: QuarterFilter }) {
  const ref = useRef<HTMLDivElement>(null);
  const view = useMemo(() => {
    const indexes = data.newRelease.periods.map((period, index) => ({ period, index })).filter(({ period }) => filter === "all" || period.endsWith(filter));
    return {
      periods: indexes.map(({ period }) => period),
      series: data.newRelease.series.map((item) => ({ ...item, values: indexes.map(({ index }) => item.values[index]) })),
    };
  }, [filter]);

  useEffect(() => {
    if (!ref.current || !view.periods.length) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "svg" });
    const layoutSpec = { left: 42, right: 100, top: 66, bottom: 42, variant: "right-legend" as const, minRight: 100 };
    const totals = view.periods.map((_, index) => view.series.reduce((sum, item) => sum + Number(item.values[index] ?? 0), 0));
    chart.setOption({
      animationDuration: 420,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${Number(value).toFixed(2)} 亿` },
      grid: getChartLayout(ref.current.clientWidth, layoutSpec).grid,
      xAxis: { type: "category", data: view.periods, axisTick: { show: false }, axisLine: { lineStyle: { color: "#aeb7b0" } }, axisLabel: { color: "#737c76", fontSize: 10 } },
      yAxis: { type: "value", name: "亿", nameTextStyle: { color: "#737c76", fontSize: 9 }, axisLabel: { color: "#737c76", fontSize: 9 }, splitLine: { lineStyle: { color: "#e4e7e4" } } },
      series: [
        ...view.series.map((item) => ({
          name: item.name, type: "bar" as const, stack: "total", data: item.values, barMaxWidth: 48,
          itemStyle: { color: platformColors[item.name] },
          label: { show: true, position: "inside" as const, color: "#263038", fontSize: 9, formatter: ({ value, dataIndex }: { value: number; dataIndex: number }) => item.name !== "bilibili" && value < 2 ? "" : value <= 0 ? "" : `${value.toFixed(1)}\n(${(value / totals[dataIndex] * 100).toFixed(0)}%)` },
        })),
        { name: "柱顶合计", type: "bar", data: totals, barMaxWidth: 48, barGap: "-100%", silent: true, z: 20, itemStyle: { color: "transparent" }, label: { show: true, position: "top", distance: 7, color: "#161917", fontSize: 11, fontWeight: 700, formatter: ({ value }: { value: number }) => value.toFixed(1) } },
      ],
    });
    const draw = () => {
      const currentIndex = view.periods.length - 1;
      const previousIndex = currentIndex - 1;
      if (previousIndex < 0) return setBracketAnnotations(chart, []);
      const comparisons: BracketComparison[] = [{ previousIndex, currentIndex, previousValue: totals[previousIndex], currentValue: totals[currentIndex], label: pct(totals[currentIndex], totals[previousIndex]), targetGap: 24, labelFontSize: 8 }];
      ["腾讯视频", "bilibili", "优酷", "爱奇艺"].forEach((name, index) => {
        const item = view.series.find((entry) => entry.name === name);
        if (!item) return;
        comparisons.push({ previousIndex, currentIndex, previousValue: Number(item.values[currentIndex]), currentValue: Number(item.values[currentIndex]), variant: "sideLabel", title: name, label: `同比 ${pct(Number(item.values[currentIndex]), Number(item.values[previousIndex]))}`, swatchColor: platformColors[name], labelFontSize: 8, labelY: 84 + index * 54, legendWidth: 96, legendRightInset: 0 });
      });
      view.periods.forEach((_, dataIndex) => {
        const small = view.series.map((item, seriesIndex) => ({ item, seriesIndex })).filter(({ item }) => item.name !== "bilibili" && Number(item.values[dataIndex]) > 0 && Number(item.values[dataIndex]) < 2);
        small.forEach(({ item, seriesIndex }, smallIndex) => {
          const value = Number(item.values[dataIndex]);
          const lower = view.series.slice(0, seriesIndex).reduce((sum, entry) => sum + Number(entry.values[dataIndex] ?? 0), 0);
          const shiftByPlatform: Record<string, number> = { 优酷: -10, 爱奇艺: 8 };
          const elbowByPlatform: Record<string, number> = { 优酷: 31, 爱奇艺: 28 };
          comparisons.push({ previousIndex: dataIndex, currentIndex: dataIndex, previousValue: lower + value / 2, currentValue: lower + value / 2, label: `${value.toFixed(1)}\n(${(value / totals[dataIndex] * 100).toFixed(0)}%)`, variant: "barCallout", color: platformColors[item.name], labelFontSize: 8, labelYShift: shiftByPlatform[item.name] ?? (smallIndex * 10), arrowOffset: elbowByPlatform[item.name] ?? 29, barHalfWidth: 24 });
        });
      });
      setBracketAnnotations(chart, comparisons);
    };
    requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => ref.current && resizeResponsiveChart(chart, ref.current, layoutSpec, draw));
    observer.observe(ref.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [view]);

  if (!view.periods.length) return <div className="animation-new-release-empty">当前季度暂无有效播放数据</div>;
  return <div ref={ref} className="animation-new-release-chart" role="img" aria-label="国创长片新作分平台有效播放" />;
}

function SupplyPanel({ filter }: { filter: QuarterFilter }) {
  const candidates = data.supply.filter((item) => filter === "all" || item.period.endsWith(filter));
  const current = candidates.at(-1);
  if (!current) return <div className="animation-supply-empty">当前季度暂无上新及独播数据</div>;
  const max = Math.max(...current.platforms.map((item) => item.exclusive + item.nonExclusive));
  return <div className="animation-supply" aria-label={`${current.period}分平台上新及独播数量`}>
    <div className="animation-supply-meta"><strong>{current.period}</strong><span>全网新片供给 {current.total} 部</span></div>
    <div className="animation-supply-head"><span>平台</span><span>独播内容举例</span><span>非独 / 独播</span></div>
    {[...current.platforms].sort((a, b) => ["腾讯视频", "爱奇艺", "bilibili", "优酷"].indexOf(a.name) - ["腾讯视频", "爱奇艺", "bilibili", "优酷"].indexOf(b.name)).map((item) => <div className="animation-supply-row" key={item.name}>
      <strong>{item.name}</strong>
      <div className="animation-supply-examples">{item.examples.length ? item.examples.map((example) => <span key={example}>{example}</span>) : <span>—</span>}</div>
      <div className="animation-supply-counts">
        <div className="animation-supply-bar" style={{ width: `${Math.max(18, (item.exclusive + item.nonExclusive) / max * 100)}%` }}>
          <i className="non-exclusive" style={{ flex: item.nonExclusive }}>{item.nonExclusive}</i>
          <i className="exclusive" style={{ flex: item.exclusive, background: platformColors[item.name] }}>{item.exclusive}</i>
        </div>
        <b>{item.exclusive + item.nonExclusive}</b>
      </div>
    </div>)}
  </div>;
}

export function AnimationTrend() {
  const [filter, setFilter] = useState<QuarterFilter>("Q2");
  return <section className="horizontal-drama-trend animation-trend">
    <div className="horizontal-drama-lead">
      <div className="horizontal-drama-subhead"><span>01</span><h4>动画大盘趋势</h4></div>
      <EditableInsight
        lead="动画大盘继续收缩，国创降幅更明显"
        body="26Q2 动画有效播放 138.9 亿，同比下降 25%；其中日番 35.1 亿，同比下降 21%，国创 101.2 亿，同比下降 27%。分平台看，B站日番播放 24.5 亿，同比下降 8%，表现相对稳健；腾讯视频国创播放降至 61.7 亿，同比下降 36%，是国创大盘下滑的主要来源。"
        highlights={["138.9 亿", "下降 25%", "35.1 亿", "下降 21%", "101.2 亿", "下降 27%", "24.5 亿", "下降 8%", "61.7 亿", "下降 36%"]}
        storageKey="ogv-market-review:26q2:animation-trend-v1"
      />
    </div>
    <div className="horizontal-drama-quarter-filter" aria-label="选择季度">
      <span>显示季度</span>
      {(["Q1", "Q2", "Q3", "Q4", "all"] as const).map((quarter) => <button key={quarter} type="button" className={filter === quarter ? "selected" : ""} aria-pressed={filter === quarter} onClick={() => setFilter(quarter)}>{quarter === "all" ? "全部" : quarter}</button>)}
    </div>
    <div className="animation-charts">
      <article className="horizontal-drama-panel"><header><h5>byQ 动画有效播放（亿）</h5></header><AnimationChart kind="total" filter={filter} /></article>
      <article className="horizontal-drama-panel"><header><h5>byQ 分平台日番有效播放（亿）</h5></header><AnimationChart kind="japanese" filter={filter} /></article>
      <article className="horizontal-drama-panel"><header><h5>byQ 分平台国创有效播放（亿）</h5></header><AnimationChart kind="chinese" filter={filter} /></article>
    </div>
    <p className="horizontal-drama-source animation-source">注：仅包括爱优腾B站 5 分钟以上内容；数据来源：{data.source}。</p>
    <section className="animation-new-release-section">
      <div className="horizontal-drama-lead">
        <div className="horizontal-drama-subhead"><span>02</span><h4>国创长片新作下拆</h4></div>
        <EditableInsight
          lead="国创新作播放回落，腾讯贡献进一步集中"
          body="26Q2 国创长片新作有效播放 6.3 亿，同比下降 24%；腾讯视频贡献 5.2 亿，占比 82%，是主要播放来源。B站新作播放降至 0.7 亿，同比下降 82%。同期全网新片供给 27 部，腾讯独播 16 部，独播供给显著领先。"
          highlights={["6.3 亿", "下降 24%", "5.2 亿", "占比 82%", "0.7 亿", "下降 82%", "27 部", "独播 16 部"]}
          storageKey="ogv-market-review:26q2:animation-new-release-v1"
        />
      </div>
      <div className="animation-new-release-grid">
        <article className="horizontal-drama-panel"><header><h5>分平台有效播放（亿）</h5></header><NewReleaseChart filter={filter} /></article>
        <article className="horizontal-drama-panel"><header><h5>分平台上新及独播数量</h5></header><SupplyPanel filter={filter} /></article>
      </div>
      <p className="horizontal-drama-source animation-source">云和数据对爱优腾存在高估、对 B 站存在低估，此页 B 站播放已用站内数据修正；独播指内容只有单平台可播放，不代表真正有独播版权。数据来源：{data.source}。</p>
      <VvRankingModule />
    </section>
    <Top50Module />
  </section>;
}
