"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditableInsight } from "./EditableInsight";
import data from "../data/horizontalDramaTrend.json";

const colors: Record<string, string> = {
  其他: "#d9dfe8", "热播剧 TOP50": "#385577",
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
    const indexes = source.periods
      .map((period, index) => ({ period, index }))
      .filter(({ period }) => Number(period.slice(0, 2)) >= 22 && (quarterFilter === "all" || period.endsWith(quarterFilter)));
    let displaySeries = source.series.map((item) => ({ ...item }));
    if (kind === "total") displaySeries = [displaySeries[1], displaySeries[0]];
    return {
      periods: indexes.map(({ period }) => period),
      series: displaySeries.map((item) => ({ ...item, values: indexes.map(({ index }) => item.values[index]) })),
    };
  }, [quarterFilter, source]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const totals = periods.map((_, index) => series.reduce((sum, item) => sum + Number(item.values[index] ?? 0), 0));
    const latestYoy = totals.length > 1 && totals.at(-2) ? (totals.at(-1)! / totals.at(-2)! - 1) * 100 : null;
    const baseValues = series[0]?.values ?? [];
    const baseYoy = baseValues.length > 1 && baseValues.at(-2) ? (Number(baseValues.at(-1)) / Number(baseValues.at(-2)) - 1) * 100 : null;
    const yoyText = (value: number | null) => value == null ? "" : `${value > 0 ? "+" : ""}${value.toFixed(0)}%`;
    const latestIndex = periods.length - 1;
    const previousIndex = periods.length - 2;
    const showComparison = quarterFilter !== "all" && periods.length >= 2;
    chart.setOption({
      animationDuration: 420,
      color: series.map((item) => colors[item.name]),
      grid: { left: 48, right: 28, top: 62, bottom: 68 },
      tooltip: { show: false },
      legend: { bottom: 12, data: series.map((item) => item.name), itemWidth: 10, itemHeight: 10, textStyle: { color: "#58615b", fontSize: 10 } },
      xAxis: { type: "category", data: periods, axisTick: { show: false }, axisLine: { lineStyle: { color: "#aeb7b0" } }, axisLabel: { color: "#737c76", fontSize: 10, interval: quarterFilter === "all" ? 3 : 0 } },
      yAxis: { type: "value", axisLabel: { color: "#737c76", fontSize: 10 }, splitLine: { lineStyle: { color: "#e4e7e4" } } },
      series: [
        ...series.map((item, seriesIndex) => ({
        name: item.name, type: "bar" as const, stack: "total", data: item.values, barMaxWidth: 36,
        emphasis: { focus: "series" },
        label: {
          show: true,
          position: "inside" as const,
          color: item.name === "其他" || item.name === "优酷" ? "#263038" : "#ffffff",
          fontSize: quarterFilter === "all" ? 8 : 10,
          formatter: ({ value, dataIndex }: { value: number | null; dataIndex: number }) => {
            if (value == null || Math.abs(value) < .5) return "";
            const share = totals[dataIndex] ? Number(value) / totals[dataIndex] * 100 : 0;
            return `${Number(value).toFixed(0)}\n(${share.toFixed(0)}%)`;
          },
        },
        markLine: seriesIndex === 0 && showComparison ? {
          silent: true,
          symbol: ["none", "arrow"],
          symbolSize: [0, 8],
          lineStyle: { color: "#c74337", width: 1.5 },
          label: { show: true, position: "end", color: "#c74337", backgroundColor: "#f9faf7", borderColor: "#c9ceca", borderWidth: 1, borderRadius: 12, padding: [4, 8], formatter: yoyText(baseYoy) },
          data: [[
            { coord: [periods[previousIndex], Number(baseValues[previousIndex])], symbol: "none" },
            { coord: [periods[latestIndex], Number(baseValues[latestIndex])], symbol: "arrow" },
          ]],
        } : undefined,
      })),
        {
          name: "柱顶合计", type: "bar" as const, data: totals, barMaxWidth: 36, barGap: "-100%", silent: true, z: 20,
          itemStyle: { color: "rgba(0,0,0,0)" },
          emphasis: { disabled: true },
          label: { show: true, position: "top" as const, distance: 8, color: "#161917", fontSize: 12, fontWeight: 700, formatter: ({ value }: { value: number }) => Number(value).toFixed(0) },
          markLine: showComparison ? {
            silent: true,
            symbol: ["none", "arrow"],
            symbolSize: [0, 8],
            lineStyle: { color: "#aeb5b0", width: 1.2 },
            label: { show: true, position: "middle", color: "#c74337", backgroundColor: "#f9faf7", borderColor: "#c9ceca", borderWidth: 1, borderRadius: 12, padding: [4, 8], formatter: yoyText(latestYoy) },
            data: [[
              { coord: [periods[previousIndex], totals[previousIndex]], symbol: "none" },
              { coord: [periods[latestIndex], totals[latestIndex]], symbol: "arrow" },
            ]],
          } : undefined,
        },
      ],
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
  const newYoy = yoy(data.total.series.find((item) => item.name === "热播剧 TOP50")!.values);
  const platformYoys = Object.fromEntries(data.platform.series.map((item) => [item.name, yoy(item.values)]));
  const pct = (value: number | null) => `${value != null && value > 0 ? "+" : ""}${value?.toFixed(0)}%`;
  const body = `26Q2 长剧有效播放 411 亿，同比 ${pct(totalYoy)}；其中热播剧 TOP50 播放 152 亿，同比 ${pct(newYoy)}。分平台 TOP50 上新长剧播放 152 亿，同比 -15%；腾讯、优酷分别下降 ${Math.abs(platformYoys["腾讯视频"]!).toFixed(0)}%、${Math.abs(platformYoys["优酷"]!).toFixed(0)}%，爱奇艺增长 ${platformYoys["爱奇艺"]!.toFixed(0)}%，芒果TV从 5 亿增至 13 亿。`;
  return (
    <section className="horizontal-drama-trend">
      <div className="horizontal-drama-subhead"><span>01</span><h4>大盘趋势</h4></div>
      <EditableInsight lead="长剧播放继续下滑，热播剧也在跌" body={body} highlights={["411 亿", pct(totalYoy), "152 亿", pct(newYoy), "下降 16%、52%", "增长 3%", "5 亿增至 13 亿"]} storageKey="ogv-market-review:26q2:horizontal-drama-trend-v2" />
      <div className="horizontal-drama-quarter-filter" aria-label="选择季度">
        <span>显示季度</span>
        {(["Q1", "Q2", "Q3", "Q4", "all"] as const).map((quarter) => (
          <button key={quarter} type="button" className={quarterFilter === quarter ? "selected" : ""} aria-pressed={quarterFilter === quarter} onClick={() => setQuarterFilter(quarter)}>
            {quarter === "all" ? "全部" : quarter}
          </button>
        ))}
      </div>
      <div className="horizontal-drama-charts">
        <article className="horizontal-drama-panel"><header><h5>byQ 长剧有效播放（亿）</h5></header><StackedChart kind="total" quarterFilter={quarterFilter} /></article>
        <article className="horizontal-drama-panel"><header><h5>byQ 分平台 TOP50 上新长剧播放（亿）</h5></header><StackedChart kind="platform" quarterFilter={quarterFilter} /></article>
      </div>
      <p className="horizontal-drama-source">数据来源：{data.source}</p>
    </section>
  );
}
