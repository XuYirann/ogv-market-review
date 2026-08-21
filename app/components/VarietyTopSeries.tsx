"use client";

import { EditableInsight } from "./EditableInsight";

type VarietySeries = {
  name: string;
  plays: number;
  genre: string;
  platforms: string[];
  isNew?: boolean;
};

const platformLogos: Record<string, string> = {
  爱奇艺: "/ogv-market-review/platform-logos/iqiyi.png",
  腾讯视频: "/ogv-market-review/platform-logos/tencent-video.png",
  芒果TV: "/ogv-market-review/platform-logos/mango-tv.png",
  优酷: "/ogv-market-review/platform-logos/youku.png",
  bilibili: "/ogv-market-review/platform-logos/bilibili.png",
};

const variety25: VarietySeries[] = [
  { name: "哈哈哈哈哈第5季", plays: 7.6839, platforms: ["爱奇艺", "腾讯视频"], genre: "明星社交 / 游戏" },
  { name: "奔跑吧第9季", plays: 4.6126, platforms: ["爱奇艺", "腾讯视频", "优酷"], genre: "明星社交 / 游戏" },
  { name: "乘风2025", plays: 3.7481, platforms: ["芒果TV"], genre: "舞台竞演" },
  { name: "种地吧第3季", plays: 2.1766, platforms: ["爱奇艺"], genre: "户外 / 生活" },
  { name: "大侦探·拾光季", plays: 2.0925, platforms: ["芒果TV"], genre: "推理解谜" },
  { name: "无限超越班第三季", plays: 2.027, platforms: ["优酷"], genre: "演技 / 竞演" },
  { name: "你好，星期六2025", plays: 1.9141, platforms: ["芒果TV"], genre: "明星社交 / 游戏" },
  { name: "开始推理吧第3季", plays: 1.8739, platforms: ["腾讯视频"], genre: "推理解谜" },
  { name: "这是我的西游", plays: 1.4562, platforms: ["优酷"], genre: "户外 / 游戏" },
  { name: "天赐的声音第6季", plays: 1.2928, platforms: ["爱奇艺", "腾讯视频", "优酷", "bilibili"], genre: "舞台竞演" },
];

const variety26: VarietySeries[] = [
  { name: "哈哈哈哈哈第6季", plays: 8.9032, platforms: ["爱奇艺", "腾讯视频"], genre: "明星社交 / 游戏" },
  { name: "奔跑吧第10季", plays: 4.9804, platforms: ["爱奇艺", "腾讯视频", "优酷"], genre: "明星社交 / 游戏" },
  { name: "乘风2026", plays: 4.4687, platforms: ["芒果TV"], genre: "舞台竞演" },
  { name: "妻子的浪漫旅行2026", plays: 1.6205, platforms: ["芒果TV"], genre: "旅行" },
  { name: "怦然心动20岁：冬季", plays: 1.231, platforms: ["优酷"], genre: "恋爱 / 素人" },
  { name: "五十公里桃花坞第6季", plays: 1.1782, platforms: ["腾讯视频"], genre: "明星社交 / 游戏" },
  { name: "开始推理吧第4季", plays: 1.0606, platforms: ["腾讯视频"], genre: "推理解谜" },
  { name: "种地吧第4季", plays: 1.0508, platforms: ["爱奇艺"], genre: "户外 / 生活" },
  { name: "无限超越班第四季", plays: .8725, platforms: ["优酷"], genre: "演技 / 竞演" },
  { name: "奋斗吧人生-演员篇", plays: .8178, platforms: ["腾讯视频"], genre: "演技 / 竞演", isNew: true },
];

function genreClass(genre: string) {
  if (genre.includes("恋爱") || genre.includes("素人")) return "genre-love";
  if (genre.includes("推理")) return "genre-suspense";
  if (genre.includes("户外") || genre.includes("生活") || genre.includes("旅行")) return "genre-reality";
  if (genre.includes("舞台") || genre.includes("演技") || genre.includes("竞演")) return "genre-period";
  if (genre.includes("明星") || genre.includes("社交") || genre.includes("游戏")) return "genre-male";
  return "genre-other";
}

function PlatformLogos({ platforms }: { platforms: string[] }) {
  return <span className="top-series-platforms variety-platforms">{platforms.map((platform) => (
    <img key={platform} className={`platform-logo platform-logo-${platform}`} src={platformLogos[platform]} alt={platform} />
  ))}</span>;
}

function VarietyQuarter({ quarter, rows }: { quarter: string; rows: VarietySeries[] }) {
  const max = Math.max(...variety25.map((row) => row.plays), ...variety26.map((row) => row.plays));
  return <article className="top-series-quarter variety-top-quarter">
    <h6>{quarter}</h6>
    <div className="top-series-grid variety-top-grid top-series-grid-head"><span>综艺名</span><span>有效播放（亿）</span><span>内容题材</span><span>播出平台</span></div>
    {rows.map((row) => <div className="top-series-grid variety-top-grid top-series-row" key={`${quarter}-${row.name}`}>
      <span className="top-series-name">{row.name}{row.isNew && <em className="variety-new-tag">新综艺</em>}</span>
      <span className="top-series-bar-cell"><i className={row.isNew ? "variety-new-bar" : undefined} style={{ width: `${Math.max(10, row.plays / max * 68)}%` }} /><b>{row.plays.toFixed(1)}</b></span>
      <span className={`top-series-genre ${genreClass(row.genre)}`}>{row.genre}</span>
      <PlatformLogos platforms={row.platforms} />
    </div>)}
  </article>;
}

export function VarietyTopSeries() {
  return <section className="horizontal-drama-efficiency horizontal-drama-top-series variety-top-series">
    <div className="horizontal-drama-subhead"><span>02</span><h4>TOP10 综艺对比</h4></div>
    <div className="horizontal-drama-lead">
      <EditableInsight
        lead="头部综艺热度更加集中"
        body="《五哈第6季》单季播放 8.9 亿，占 TOP10 的 34%，较去年同期头部集中度继续提高。榜单仍以综 N 代为主，唯一新综艺《奋斗吧人生-演员篇》为演技综艺，无模式创新，且播放仅 0.8 亿。"
        highlights={["26.2 亿", "下降 9%", "8.9 亿", "34%", "唯一新综艺", "0.8 亿"]}
        storageKey="ogv-market-review:26q2:variety-top10-v1"
      />
    </div>
    <div className="top-series-evidence variety-top-evidence">
      <div className="variety-top-legend"><span><i />常规综艺</span><span><i className="variety-new-bar" />新综艺</span></div>
      <div className="top-series-quarters"><VarietyQuarter quarter="25Q2" rows={variety25} /><VarietyQuarter quarter="26Q2" rows={variety26} /></div>
    </div>
    <p className="horizontal-drama-source variety-source">数据来源：云合数据；有效播放为对应综艺在当季的播放量。</p>
  </section>;
}
