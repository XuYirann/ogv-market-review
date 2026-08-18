"use client";

import data from "../data/documentaryRanking.json";
import { EditableInsight } from "./EditableInsight";

type Rank = number | null;
export type DocumentaryQuarter = keyof typeof data.comparisons;

const countHeat = (count: number) => ({
  backgroundColor: `rgb(78 123 104 / ${count === 0 ? 0.04 : 0.1 + count / 8 * 0.54})`,
  color: count >= 5 ? "#ffffff" : "#26352f",
});

const rankPalettes = {
  previous: ["#FDEEEE", "#F6D6D6", "#EEAAAA", "#C27B7B", "#D45959"],
  current: ["#EDF1F5", "#DCE5EF", "#C0CCDB", "#9FB3CA", "#728FB6"],
};

const rankHeat = (rank: Rank, period: keyof typeof rankPalettes) => {
  if (rank == null) return undefined;
  const level = Math.min(4, Math.floor((10 - rank) / 2));
  return { backgroundColor: rankPalettes[period][level], color: level >= 3 ? "#ffffff" : "#263038" };
};

export function DocumentaryQuarterSelect({ value, onChange }: { value: DocumentaryQuarter; onChange: (quarter: DocumentaryQuarter) => void }) {
  return <label className="documentary-quarter-select"><span>选择季度</span><select value={value} onChange={(event) => onChange(event.target.value as DocumentaryQuarter)}>{data.availableQuarters.map((quarter) => <option key={quarter} value={quarter}>{quarter}</option>)}</select></label>;
}

export function DocumentaryRanking({ quarter }: { quarter: DocumentaryQuarter }) {
  const comparison = data.comparisons[quarter];
  const previousTotal = comparison.groups.reduce((sum, group) => sum + group.previousCount, 0);
  const currentTotal = comparison.groups.reduce((sum, group) => sum + group.currentCount, 0);
  const change = previousTotal ? Math.round((currentTotal / previousTotal - 1) * 100) : 0;
  const newGenres = comparison.groups.filter((group) => group.status === "new").map((group) => group.genre);
  const disappearedGenres = comparison.groups.filter((group) => group.status === "disappeared").map((group) => group.genre);
  const leadingGenre = [...comparison.groups].sort((a, b) => b.currentCount - a.currentCount)[0];

  return (
    <section className="documentary-ranking">
      <div className="horizontal-drama-lead documentary-lead" key={quarter}>
        <EditableInsight
          lead={`${quarter} 头部题材向${leadingGenre.genre}集中`}
          body={`${quarter} 月榜共覆盖 ${currentTotal} 个项目，较去年同期 ${previousTotal} 个${change >= 0 ? "增长" : "减少"} ${Math.abs(change)}%；${leadingGenre.genre}以 ${leadingGenre.currentCount} 个项目成为本季最集中题材。${newGenres.length ? `新增题材为${newGenres.join("、")}` : "本季无新增题材"}${disappearedGenres.length ? `，${disappearedGenres.join("、")}本季未再上榜。` : "。"}`}
          highlights={[`${currentTotal} 个项目`, `${previousTotal} 个`, `${Math.abs(change)}%`, `${leadingGenre.currentCount} 个项目`, ...newGenres, ...disappearedGenres]}
          storageKey={`ogv-market-review:documentary:${quarter}:insight-v1`}
        />
      </div>
      <div className="documentary-table-wrap">
        <div className="documentary-module-title"><h4>纪录片月度 TOP10 题材扫描</h4><span>{comparison.previousQuarter} vs {quarter}</span></div>
        <div className="documentary-table" role="table" aria-label={`${quarter} 纪录片月度排名，按题材分组并对比去年同期`}>
          <div className="documentary-period-bands" aria-hidden="true"><span /><span /><b>{comparison.previousQuarter}</b><b>{quarter}</b><span /></div>
          <div className="documentary-row documentary-head" role="row">
            <span role="columnheader">题材</span><span role="columnheader">名称</span>
            {comparison.months.map((month) => <span role="columnheader" key={`previous-${month}`}>{month}排名</span>)}
            {comparison.months.map((month) => <span role="columnheader" key={`current-${month}`}>{month}排名</span>)}
            <span role="columnheader">本季上榜次数</span>
          </div>
          {comparison.groups.map((group) => (
            <div className={`documentary-group documentary-group-${group.status}`} key={group.genre}>
              <div className="documentary-group-row" role="row">
                <span className="documentary-genre" role="rowheader">{group.genre}</span>
                <span className="documentary-status">{group.status === "new" && <em>新增题材</em>}{group.status === "disappeared" && <em>本季消失</em>}</span>
                <span className="documentary-count-pair"><small>去年同期项目数</small><strong style={countHeat(group.previousCount)}>{group.previousCount}</strong></span>
                <span className="documentary-count-pair"><small>本季项目数</small><strong style={countHeat(group.currentCount)}>{group.currentCount}</strong></span>
              </div>
              {group.projects.map((project) => (
                <div className="documentary-row documentary-project-row" role="row" key={project.name}>
                  <span aria-hidden="true" /><span className="documentary-project-name" role="cell">{project.name}</span>
                  {project.previousRanks.map((rank, index) => <span className="documentary-rank documentary-rank-previous" role="cell" style={rankHeat(rank as Rank, "previous")} key={`previous-${project.name}-${index}`}>{rank ?? "—"}</span>)}
                  {project.currentRanks.map((rank, index) => <span className="documentary-rank" role="cell" style={rankHeat(rank as Rank, "current")} key={`current-${project.name}-${index}`}>{rank ?? "—"}</span>)}
                  <strong className="documentary-appearances" role="cell">{project.appearances}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="documentary-footer"><span>颜色越深，项目数越多 / 月度排名越靠前</span></div>
    </section>
  );
}
