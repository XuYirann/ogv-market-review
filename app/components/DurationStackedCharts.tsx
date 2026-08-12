"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";
import durationData from "../data/platformAudienceTotalDuration.json";

const colors: Record<string, string> = {
  腾讯视频: "#486b9f",
  爱奇艺: "#7ba900",
  芒果TV: "#df661d",
  优酷视频: "#00aee8",
  红果免费短剧: "#ef3f3a",
  红果免费漫剧: "#ff7168",
  河马剧场: "#98506e",
  其他长视频平台: "#26364d",
  其他短剧平台: "#9b6bde",
};

const groups = [
  {
    title: "传统长视频平台总用户时长",
    platforms: ["腾讯视频", "爱奇艺", "芒果TV", "优酷视频", "其他长视频平台"],
  },
  {
    title: "短剧平台总用户时长",
    platforms: ["红果免费短剧", "红果免费漫剧", "河马剧场", "其他短剧平台"],
  },
] as const;

function yoyAt(values: (number | null)[], index: number) {
  const current = values[index];
  const previous = values[index - 4];
  if (current == null || previous == null || previous === 0) return null;
  return (current / previous - 1) * 100;
}

function StackedDurationChart({
  title,
  platforms,
  showHint,
}: {
  title: string;
  platforms: readonly string[];
  showHint: boolean;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const lastIndex = durationData.periods.length - 1;
  const defaultStartIndex = Math.max(0, lastIndex - 19);
  const [startPeriod, setStartPeriod] = useState(durationData.periods[defaultStartIndex]);
  const [endPeriod, setEndPeriod] = useState(durationData.periods[lastIndex]);
  const [rangePreset, setRangePreset] = useState("5");
  const [activePlatforms, setActivePlatforms] = useState<string[]>([...platforms]);

  const startIndex = Math.max(0, durationData.periods.indexOf(startPeriod));
  const rawEndIndex = durationData.periods.indexOf(endPeriod);
  const endIndex = rawEndIndex < startIndex ? lastIndex : rawEndIndex;

  const visibleData = useMemo(() => {
    const series = platforms
      .map((name) => durationData.series.find((series) => series.name === name))
      .filter((series): series is (typeof durationData.series)[number] => series != null && activePlatforms.includes(series.name))
      .map((series) => ({ ...series, values: series.values.slice(startIndex, endIndex + 1) }))
      .sort((a, b) => (b.values.at(-1) ?? 0) - (a.values.at(-1) ?? 0));
    return { periods: durationData.periods.slice(startIndex, endIndex + 1), series };
  }, [activePlatforms, endIndex, platforms, startIndex]);

  const quarterTotals = useMemo(() => visibleData.periods.map((period, visibleIndex) => {
    const sourceIndex = startIndex + visibleIndex;
    const total = platforms.reduce((sum, platform) => {
      const series = durationData.series.find((item) => item.name === platform);
      return sum + (series?.values[sourceIndex] ?? 0);
    }, 0);
    return { period, total };
  }), [platforms, startIndex, visibleData.periods]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" });
    chart.setOption({
      animationDuration: 420,
      color: visibleData.series.map((series) => colors[series.name]),
      grid: { left: 58, right: 176, top: 42, bottom: 58 },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(27, 32, 29, .94)",
        borderWidth: 0,
        padding: [12, 14],
        textStyle: { color: "#f3f6f3", fontSize: 12 },
        valueFormatter: (value: number) => `${Number(value).toFixed(1)} 亿小时`,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: visibleData.periods,
        axisLine: { lineStyle: { color: "#b8c0ba" } },
        axisTick: { show: false },
        axisLabel: { color: "#7b847e", fontSize: 11, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        name: "总时长（亿小时）",
        nameGap: 18,
        nameTextStyle: { color: "#5f6862", align: "left", fontSize: 12, fontWeight: 600 },
        axisLabel: { color: "#7b847e", fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#e2e6e2" } },
      },
      dataZoom: [{ type: "inside", zoomOnMouseWheel: "shift", moveOnMouseMove: true }],
      series: visibleData.series.map((series) => {
        const source = durationData.series.find((item) => item.name === series.name);
        const yoy = source ? yoyAt(source.values, endIndex) : null;
        const yoyLabel = yoy == null ? "-" : `${yoy > 0 ? "+" : ""}${yoy.toFixed(0)}%`;
        return {
          name: series.name,
          type: "line",
          data: series.values,
          showSymbol: false,
          smooth: 0.15,
          clip: false,
          lineStyle: { width: 2.1, color: colors[series.name] },
          areaStyle: { opacity: 0.14, color: colors[series.name] },
          emphasis: { focus: "series" },
          endLabel: {
            show: true,
            distance: 8,
            formatter: () => `{platform|${series.name}}  {yoy|${yoyLabel}}`,
            rich: {
              platform: { color: colors[series.name], fontSize: 11, fontWeight: 650 },
              yoy: { color: yoy != null && yoy < 0 ? "#c74337" : "#161917", fontSize: 11, fontWeight: 650 },
            },
          },
          labelLayout: { moveOverlap: "shiftY" },
        };
      }),
    });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [endIndex, visibleData]);

  const setRange = (years: number) => {
    const quarters = years * 4;
    setStartPeriod(durationData.periods[Math.max(0, lastIndex - quarters + 1)]);
    setEndPeriod(durationData.periods[lastIndex]);
    setRangePreset(String(years));
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms((current) => current.includes(platform)
      ? current.length === 1 ? current : current.filter((item) => item !== platform)
      : [...current, platform]);
  };

  return (
    <article className={`duration-chart-module${platforms.length === 4 ? " duration-chart-short" : ""}`}>
      <div className="dau-header">
        <div><span>平台时长趋势</span><h3>{title}（亿小时）</h3></div>
        <div className="duration-controls chart-controls-compact">
          <div className="range-buttons" aria-label="时间范围">
            <button className={rangePreset === "1" ? "selected" : ""} type="button" onClick={() => setRange(1)}>近 1 年</button>
            <button className={rangePreset === "5" ? "selected" : ""} type="button" onClick={() => setRange(5)}>近 5 年</button>
          </div>
          <div className="quarter-controls">
            <label>开始<select value={startPeriod} onChange={(event) => { setStartPeriod(event.target.value); setRangePreset("custom"); }}>{durationData.periods.slice(0, endIndex + 1).map((period) => <option key={period}>{period}</option>)}</select></label>
            <label>结束<select value={endPeriod} onChange={(event) => { setEndPeriod(event.target.value); setRangePreset("custom"); }}>{durationData.periods.slice(startIndex).map((period) => <option key={period}>{period}</option>)}</select></label>
          </div>
        </div>
      </div>
      <div className="series-toggles" aria-label="选择平台">
        {platforms.map((platform) => <button key={platform} type="button" className={activePlatforms.includes(platform) ? "active" : ""} onClick={() => togglePlatform(platform)} aria-pressed={activePlatforms.includes(platform)}><i style={{ backgroundColor: colors[platform] }} /><span>{platform}</span></button>)}
      </div>
      <div className="quarter-total-row" aria-label="各季度平台合计时长">
        <span>平台合计</span>
        <div className="quarter-total-strip" style={{ gridTemplateColumns: `repeat(${quarterTotals.length}, minmax(0, 1fr))` }}>
          {quarterTotals.map(({ period, total }) => <b key={period} title={`${period} 合计 ${total.toFixed(1)} 亿小时`}>{total >= 100 ? total.toFixed(0) : total.toFixed(1)}</b>)}
        </div>
        <i aria-hidden="true" />
      </div>
      <div ref={chartRef} className="duration-chart" role="img" aria-label={`${startPeriod}至${endPeriod}${title}绝对值重叠面积趋势图`} />
      <div className="chart-meta">
        <p className="chart-hint">{showHint ? "悬停查看季度数据；Shift + 滚轮缩放；点击平台显隐。" : "悬停查看季度数据。"}</p>
        <p className="chart-source">数据来源：{durationData.source}</p>
      </div>
    </article>
  );
}

export function DurationStackedCharts() {
  return <div className="duration-charts">{groups.map((group, index) => <StackedDurationChart key={group.title} {...group} showHint={index === 0} />)}</div>;
}
