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
  xOffset?: number;
  targetGap?: number;
  variant?: "bracket" | "difference";
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
    const xOffset = item.xOffset ?? 0;
    const targetGap = item.targetGap ?? 20;
    previous[0] += xOffset;
    current[0] += xOffset;
    const lift = 24 + (item.level ?? 0) * 22;
    const topY = Math.min(previous[1], current[1]) - targetGap - lift;
    const previousEndY = previous[1] - targetGap;
    const currentEndY = current[1] - targetGap;
    const midX = (previous[0] + current[0]) / 2;
    const bubbleWidth = Math.max(42, item.label.length * 8 + 16);
    if (item.variant === "difference") {
      const arrowX = current[0] + 18;
      const bubbleX = arrowX + 12;
      const descending = current[1] > previous[1];
      const arrowY = current[1] - 3;
      const labelY = (previous[1] + current[1]) / 2;
      const arrowPoints = descending
        ? [[arrowX - 4, arrowY - 7], [arrowX + 4, arrowY - 7], [arrowX, arrowY]]
        : [[arrowX - 4, arrowY + 7], [arrowX + 4, arrowY + 7], [arrowX, arrowY]];
      graphics.push({
        id: `comparison-${index}`,
        type: "group",
        silent: true,
        z: 100,
        children: [
          { type: "line", shape: { x1: previous[0], y1: previous[1], x2: arrowX, y2: previous[1] }, style: { stroke: "#68716b", lineWidth: 1.2, lineDash: [4, 3] } },
          { type: "line", shape: { x1: arrowX, y1: previous[1], x2: arrowX, y2: arrowY }, style: { stroke: "#c74337", lineWidth: 1.8 } },
          { type: "polygon", shape: { points: arrowPoints }, style: { fill: "#c74337" } },
          { type: "rect", shape: { x: bubbleX, y: labelY - 11, width: bubbleWidth, height: 22, r: 11 }, style: { fill: "#fbfcf9", stroke: "#c9ceca", lineWidth: 1 } },
          { type: "text", style: { x: bubbleX + bubbleWidth / 2, y: labelY, text: item.label, fill: "#c74337", font: "600 10px sans-serif", textAlign: "center", textVerticalAlign: "middle" } },
        ],
      });
      return;
    }
    graphics.push({
      id: `comparison-${index}`,
      type: "group",
      silent: true,
      z: 100,
      children: [
        { type: "polyline", shape: { points: [[previous[0], previousEndY], [previous[0], topY], [current[0], topY], [current[0], currentEndY - 4]] }, style: { stroke: color, lineWidth: 1.25, fill: "none" } },
        { type: "polygon", shape: { points: [[current[0] - 4, currentEndY - 8], [current[0] + 4, currentEndY - 8], [current[0], currentEndY - 1]] }, style: { fill: color } },
        { type: "rect", shape: { x: midX - bubbleWidth / 2, y: topY - 11, width: bubbleWidth, height: 22, r: 11 }, style: { fill: "#fbfcf9", stroke: "#c9ceca", lineWidth: 1 } },
        { type: "text", style: { x: midX, y: topY, text: item.label, fill: "#c74337", font: "600 10px sans-serif", textAlign: "center", textVerticalAlign: "middle" } },
      ],
    });
  });
  chart.setOption({ graphic: graphics }, { replaceMerge: ["graphic"], silent: true });
}
