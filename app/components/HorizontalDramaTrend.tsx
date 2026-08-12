"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditableInsight } from "./EditableInsight";
import data from "../data/horizontalDramaTrend.json";

const colors: Record<string, string> = {
  老剧: "#d9dfe8", 上新国产剧: "#385577",
  爱奇艺: "#385577", 腾讯视频: "#7191bc", 优酷: "#b9c5d7", 芒果TV: "#ef8b45", 其他: "#b7beb8",
};

function yoy(values: (number | null)[]) {
  const current = values.at(-1);
  const previous = values.at(-5);
  if (current == null || previous == null || previous === 0) return null;
  return (current / previous - 1) * 100;
}

type QuarterFilter = "Q1" | "Q2" | "Q3" | "Q4" | "all";

function StackedChart({ kind, quarterFilter }: { kind: "total" | "platform"; quarterFilter: QuarterFilter }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const source = data[kind];
  const { periods, series } = useMemo(() => {
    const start = quarterFilter === "all" ? Math.max(0, source.periods.length - 17) : 0;
    const indexes = source.periods
      .map((period, index) => ({ period, index }))
      .filter(({ period, index }) => index >= start && (quarterFilter === "all" || period.endsWith(quarterFilter)));
    return {
      periods: indexes.map(({ period }) => period),
      series: source.series.map((item) => ({ ...item, values: indexes.map(({ index }) => item.values[index]) })),
    };
  }, [quarterFilter, source]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animationDuration: 420,
      color: series.map((item) => colors[item.name]),
      grid: { left: 48, right: 18, top: 48, bottom: 68 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value.toFixed(1)} 亿` },
      legend: { bottom: 12, itemWidth: 10, itemHeight: 10, textStyle: { color: "#58615b", fontSize: 10 } },
      xAxis: { type: "category", data: periods, axisTick: { show: false }, axisLine: { lineStyle: { color: "#aeb7b0" } }, axisLabel: { color: "#737c76", fontSize: 10, interval: quarterFilter === "all" ? 3 : 0 } },
      yAxis: { type: "value", name: "亿", nameTextStyle: { color: "#737c76" }, axisLabel: { color: "#737c76", fontSize: 10 }, splitLine: { lineStyle: { color: "#e4e7e4" } } },
      series: series.map((item) => ({
        name: item.name, type: "bar", stack: "total", data: item.values, barMaxWidth: 30,
        emphasis: { focus: "series" },
      })),
    });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [periods, series]);

  return <div ref={chartRef} className="horizontal-drama-chart" role="img" aria-label={kind === "total" ? "季度长剧有效播放" : "分平台TOP50上新长剧播放"} />;
}

export function HorizontalDramaTrend() {
  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>("Q2");
  const totalYoy = yoy(data.total.totals);
  const newYoy = yoy(data.total.series.find((item) => item.name === "上新国产剧")!.values);
  const platformYoys = Object.fromEntries(data.platform.series.map((item) => [item.name, yoy(item.values)]));
  const pct = (value: number | null) => `${value != null && value > 0 ? "+" : ""}${value?.toFixed(0)}%`;
  const body = `26Q2 长剧有效播放 411 亿，同比 ${pct(totalYoy)}；其中上新国产剧 152 亿，同比 ${pct(newYoy)}。TOP50 上新长剧播放 152 亿，同比 -15%；腾讯、优酷分别下降 ${Math.abs(platformYoys["腾讯视频"]!).toFixed(0)}%、${Math.abs(platformYoys["优酷"]!).toFixed(0)}%，爱奇艺增长 ${platformYoys["爱奇艺"]!.toFixed(0)}%，芒果TV从 5 亿增至 13 亿。`;
  return (
    <section className="horizontal-drama-trend">
      <div className="horizontal-drama-subhead"><span>01</span><h4>大盘趋势</h4></div>
      <EditableInsight lead="长剧播放继续下滑，上新剧跌得更多" body={body} highlights={["411 亿", pct(totalYoy), "152 亿", pct(newYoy), "下降 16%、52%", "增长 3%", "5 亿增至 13 亿"]} storageKey="ogv-market-review:26q2:horizontal-drama-trend" />
      <div className="horizontal-drama-quarter-filter" aria-label="选择季度">
        <span>显示季度</span>
        {(["Q1", "Q2", "Q3", "Q4", "all"] as const).map((quarter) => (
          <button key={quarter} type="button" className={quarterFilter === quarter ? "selected" : ""} aria-pressed={quarterFilter === quarter} onClick={() => setQuarterFilter(quarter)}>
            {quarter === "all" ? "全部" : quarter}
          </button>
        ))}
      </div>
      <div className="horizontal-drama-charts">
        <article className="horizontal-drama-panel"><header><div><span>季度趋势</span><h5>长剧有效播放</h5></div><b>亿</b></header><StackedChart kind="total" quarterFilter={quarterFilter} /></article>
        <article className="horizontal-drama-panel"><header><div><span>平台拆分</span><h5>TOP50 上新长剧播放</h5></div><b>亿</b></header><StackedChart kind="platform" quarterFilter={quarterFilter} /></article>
      </div>
      <p className="horizontal-drama-source">数据来源：{data.source}</p>
    </section>
  );
}
