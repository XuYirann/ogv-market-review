"use client";
import data from "../data/filmTop10.json";
import { EditableInsight } from "./EditableInsight";

type Row = [string, number];
function QuarterList({ quarter, rows, max }: { quarter: string; rows: Row[]; max: number }) {
  return <div className="film-top10-quarter"><h6>{quarter}</h6><div className="film-top10-list">
    {rows.map(([name, value], index) => <div className="film-top10-row" key={`${quarter}-${name}`}>
      <span className="film-top10-rank">{String(index + 1).padStart(2, "0")}</span>
      <span className="film-top10-name" title={name}>{name}</span>
      <span className="film-top10-bar"><i style={{ width: `${Math.max(4, value / max * 100)}%` }} /></span>
      <b>{value.toFixed(2)}</b>
    </div>)}
  </div></div>;
}

function Top10Panel({ title, rows25, rows26 }: { title: string; rows25: Row[]; rows26: Row[] }) {
  const sharedMax = Math.max(...rows25.map((row) => row[1]), ...rows26.map((row) => row[1]));
  return <article className="horizontal-drama-panel film-top10-panel"><header><h5>{title}</h5></header><div className="film-top10-quarters"><QuarterList quarter="25Q2" rows={rows25} max={sharedMax}/><QuarterList quarter="26Q2" rows={rows26} max={sharedMax}/></div></article>;
}

export function FilmTop10() {
  return <section className="horizontal-drama-efficiency film-top10">
    <div className="horizontal-drama-lead"><div className="horizontal-drama-subhead"><span>02</span><h4>Top 10 电影对比</h4></div>
      <EditableInsight lead="新片头部小幅回落，存量头部明显收缩" body="26Q2 Top 10 新上院线电影有效播放 6.32 亿，同比下降 9%；Top 10 存量院线电影有效播放 1.41 亿，同比下降 41%。新片头部相对稳定，但存量影片缺少高播放项目支撑。" highlights={["6.32 亿","下降 9%","1.41 亿","下降 41%"]} storageKey="ogv-market-review:26q2:film-top10-v1"/>
    </div>
    <div className="film-top10-layout">
      <Top10Panel title="Top 10 新上院线电影有效播放（亿）" rows25={data.newRelease["25Q2"] as Row[]} rows26={data.newRelease["26Q2"] as Row[]}/>
      <Top10Panel title="Top 10 存量院线电影有效播放（亿）" rows25={data.catalog["25Q2"] as Row[]} rows26={data.catalog["26Q2"] as Row[]}/>
    </div>
    <p className="horizontal-drama-source film-top10-source">数据来源：{data.source}；时间范围：25Q2、26Q2。</p>
  </section>;
}
