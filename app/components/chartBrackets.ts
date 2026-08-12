import * as echarts from "echarts";

export type BracketComparison = {
  previousIndex: number;
  currentIndex: number;
  previousValue: number;
  currentValue: number;
  label: string;
  color?: string;
  level?: number;
  xAxisIndex?: number;
  yAxisIndex?: number;
};

export function setBracketAnnotations(chart: echarts.ECharts, comparisons: BracketComparison[]) {
  const graphics: echarts.GraphicComponentOption[] = [];
  comparisons.forEach((item, index) => {
    const xAxisIndex = item.xAxisIndex ?? 0;
    const yAxisIndex = item.yAxisIndex ?? 0;
    const previous = chart.convertToPixel({ xAxisIndex, yAxisIndex }, [item.previousIndex, item.previousValue]);
    const current = chart.convertToPixel({ xAxisIndex, yAxisIndex }, [item.currentIndex, item.currentValue]);
    if (!Array.isArray(previous) || !Array.isArray(current) || previous.some(Number.isNaN) || current.some(Number.isNaN)) return;
    const color = item.color ?? "#aeb5b0";
    const lift = 28 + (item.level ?? 0) * 22;
    const topY = Math.min(previous[1], current[1]) - lift;
    const midX = (previous[0] + current[0]) / 2;
    const bubbleWidth = Math.max(42, item.label.length * 8 + 16);
    graphics.push({
      id: `comparison-${index}`,
      type: "group",
      silent: true,
      z: 100,
      children: [
        { type: "polyline", shape: { points: [[previous[0], previous[1] - 7], [previous[0], topY], [current[0], topY], [current[0], current[1] - 7]] }, style: { stroke: color, lineWidth: 1.25, fill: "none" } },
        { type: "polygon", shape: { points: [[current[0] - 4, current[1] - 11], [current[0] + 4, current[1] - 11], [current[0], current[1] - 4]] }, style: { fill: color } },
        { type: "rect", shape: { x: midX - bubbleWidth / 2, y: topY - 11, width: bubbleWidth, height: 22, r: 11 }, style: { fill: "#fbfcf9", stroke: "#c9ceca", lineWidth: 1 } },
        { type: "text", style: { x: midX, y: topY, text: item.label, fill: "#c74337", font: "600 10px sans-serif", textAlign: "center", textVerticalAlign: "middle" } },
      ],
    });
  });
  chart.setOption({ graphic: graphics }, { replaceMerge: ["graphic"], silent: true });
}
