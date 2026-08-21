"use client";

import { EditableInsight } from "./EditableInsight";

type LongSeries = {
  name: string;
  v30: number;
  genre: string;
  platforms: string[];
};

type ShortSeries = {
  name: string;
  v30: number;
  genre: string;
  revenue: number | string;
};

const platformLogos: Record<string, string> = {
  爱奇艺: "/ogv-market-review/platform-logos/iqiyi.png",
  腾讯视频: "/ogv-market-review/platform-logos/tencent-video.png",
  芒果TV: "/ogv-market-review/platform-logos/mango-tv.png",
  优酷: "/ogv-market-review/platform-logos/youku.png",
};

const long25: LongSeries[] = [
  { name: "藏海传", v30: 4351, genre: "古装 × 男频逆袭", platforms: ["优酷"] },
  { name: "折腰", v30: 3266, genre: "古装 × 爱情", platforms: ["腾讯视频"] },
  { name: "临江仙", v30: 3239, genre: "古装 × 爱情", platforms: ["爱奇艺"] },
  { name: "无忧渡", v30: 2812, genre: "古装 × 爱情", platforms: ["爱奇艺"] },
  { name: "蛮好的人生", v30: 2585, genre: "现实生活", platforms: ["优酷"] },
  { name: "棋士", v30: 2583, genre: "悬疑 × 刑侦罪案", platforms: ["腾讯视频"] },
  { name: "乌云之上", v30: 2336, genre: "悬疑 × 刑侦罪案", platforms: ["爱奇艺"] },
  { name: "借命而生", v30: 1755, genre: "悬疑 × 刑侦罪案", platforms: ["爱奇艺"] },
  { name: "无尽的尽头", v30: 1725, genre: "悬疑 × 刑侦罪案", platforms: ["爱奇艺"] },
  { name: "淮水竹亭", v30: 1651, genre: "古装 × 爱情", platforms: ["爱奇艺"] },
];

const long26: LongSeries[] = [
  { name: "低智商犯罪", v30: 3888.71, genre: "悬疑 × 喜剧", platforms: ["爱奇艺"] },
  { name: "主角", v30: 3872.29, genre: "年代剧 × 女性成长", platforms: ["腾讯视频"] },
  { name: "蜜语纪", v30: 3471.39, genre: "都市 × 爱情", platforms: ["爱奇艺", "腾讯视频"] },
  { name: "月鳞绮纪", v30: 2399.84, genre: "古装 × 爱情", platforms: ["优酷"] },
  { name: "家业", v30: 1990.18, genre: "古装 × 爱情", platforms: ["爱奇艺"] },
  { name: "佳偶天成", v30: 1702.99, genre: "古装 × 爱情", platforms: ["腾讯视频", "爱奇艺"] },
  { name: "翘楚", v30: 1599.53, genre: "古装 × 爱情", platforms: ["腾讯视频"] },
  { name: "南部档案", v30: 1421.76, genre: "悬疑 × 奇幻", platforms: ["爱奇艺"] },
  { name: "白日提灯", v30: 1384.38, genre: "古装 × 爱情", platforms: ["腾讯视频"] },
  { name: "方圆八百米", v30: 1333.59, genre: "悬疑 × 刑侦罪案", platforms: ["腾讯视频"] },
];

const short25: ShortSeries[] = [
  { name: "彼岸灯塔", v30: 332, genre: "犯罪悬疑", revenue: 1200 },
  { name: "逆天成仙", v30: 285, genre: "逆袭修仙", revenue: 1200 },
  { name: "狮城山海", v30: 273, genre: "近代其他", revenue: "爱奇艺定制" },
  { name: "名不虚传", v30: 257, genre: "神医逆袭", revenue: 1100 },
  { name: "藏珠", v30: 235, genre: "古装爱情 / 伪骨科", revenue: 800 },
  { name: "我叫赵甲第之锋芒", v30: 221, genre: "都市逆袭", revenue: 700 },
  { name: "宫墙厌", v30: 208, genre: "古装爱情 / 小妈文学", revenue: 600 },
  { name: "我能预见成功率", v30: 194, genre: "金手指逆袭", revenue: 800 },
  { name: "麻衣神婿", v30: 190, genre: "复仇逆袭", revenue: 500 },
  { name: "权宠", v30: 165, genre: "古装爱情 / 女帝", revenue: 300 },
];

const short26: ShortSeries[] = [
  { name: "灵魂摆渡·十年", v30: 1257, genre: "奇幻惊悚", revenue: "爱奇艺定制" },
  { name: "她的罪名", v30: 366, genre: "犯罪悬疑", revenue: 1318 },
  { name: "憨婿", v30: 221, genre: "男频爽剧", revenue: 2000 },
  { name: "嫁金枝", v30: 214, genre: "古装爱情", revenue: 1000 },
  { name: "有港回信", v30: 196, genre: "都市爱情", revenue: 1000 },
  { name: "罪无可逃", v30: 190, genre: "犯罪悬疑", revenue: 700 },
  { name: "罪案痕迹", v30: 188, genre: "犯罪悬疑", revenue: 917 },
  { name: "婚后再心动", v30: 187, genre: "都市爱情", revenue: 600 },
  { name: "暴锋雨", v30: 159, genre: "犯罪悬疑", revenue: 600 },
  { name: "着迷", v30: 134, genre: "都市爱情", revenue: 1500 },
];

function genreClass(genre: string) {
  if (genre.includes("爱情") || genre.includes("伪骨科") || genre.includes("小妈")) return "genre-love";
  if (genre.includes("悬疑") || genre.includes("犯罪") || genre.includes("刑侦")) return "genre-suspense";
  if (genre.includes("现实")) return "genre-reality";
  if (genre.includes("年代") || genre.includes("近代")) return "genre-period";
  if (genre.includes("奇幻") || genre.includes("惊悚") || genre.includes("修仙")) return "genre-fantasy";
  if (genre.includes("爽剧") || genre.includes("逆袭") || genre.includes("神医") || genre.includes("金手指")) return "genre-male";
  return "genre-other";
}

function PlatformLogos({ platforms }: { platforms: string[] }) {
  return <span className="top-series-platforms">{platforms.map((platform) => (
    <img key={platform} className={`platform-logo platform-logo-${platform}`} src={platformLogos[platform]} alt={platform} />
  ))}</span>;
}

function LongQuarter({ quarter, rows }: { quarter: string; rows: LongSeries[] }) {
  const max = Math.max(...long25.map((row) => row.v30), ...long26.map((row) => row.v30));
  return <article className="top-series-quarter">
    <h6>{quarter} TOP10</h6>
    <div className="top-series-grid top-series-grid-long top-series-grid-head"><span>剧名</span><span>集均 V30（万）</span><span>内容题材</span><span>播出平台</span></div>
    {rows.map((row) => <div className="top-series-grid top-series-grid-long top-series-row" key={`${quarter}-${row.name}`}>
      <span className="top-series-name">{row.name}</span>
      <span className="top-series-bar-cell"><i style={{ width: `${Math.max(12, row.v30 / max * 62)}%` }} /><b>{Math.round(row.v30).toLocaleString("zh-CN")}</b></span>
      <span className={`top-series-genre ${genreClass(row.genre)}`}>{row.genre}</span>
      <PlatformLogos platforms={row.platforms} />
    </div>)}
  </article>;
}

function ShortQuarter({ quarter, rows }: { quarter: string; rows: ShortSeries[] }) {
  const max = Math.max(...short25.map((row) => row.v30), ...short26.map((row) => row.v30));
  const revenueMax = Math.max(
    ...short25.map((row) => typeof row.revenue === "number" ? row.revenue : 0),
    ...short26.map((row) => typeof row.revenue === "number" ? row.revenue : 0),
  );
  return <article className="top-series-quarter">
    <h6>{quarter} TOP10</h6>
    <div className="top-series-grid top-series-grid-short top-series-grid-head"><span>剧名</span><span>集均 V30（万）</span><span>内容题材</span><span>分账金额（万）</span></div>
    {rows.map((row) => <div className="top-series-grid top-series-grid-short top-series-row" key={`${quarter}-${row.name}`}>
      <span className="top-series-name">{row.name}</span>
      <span className="top-series-bar-cell"><i style={{ width: `${Math.max(10, row.v30 / max * 62)}%` }} /><b>{row.v30.toLocaleString("zh-CN")}</b></span>
      <span className={`top-series-genre ${genreClass(row.genre)}`}>{row.genre}</span>
      <span
        className={`top-series-revenue ${typeof row.revenue === "number" ? "top-series-revenue-heat" : "top-series-revenue-note"}`}
        style={typeof row.revenue === "number" ? { backgroundColor: `rgb(190 72 76 / ${0.14 + row.revenue / revenueMax * 0.28})` } : undefined}
      >
        {typeof row.revenue === "number" ? row.revenue.toLocaleString("zh-CN") : row.revenue}
      </span>
    </div>)}
  </article>;
}

export function LongDramaTopSeries() {
  return <section className="top-series-part top-series-part-embedded">
      <div className="horizontal-drama-lead">
        <EditableInsight
          lead="头部题材观察"
          body="古偶仍然是基本盘 5/10，但没有超级爆款；TOP2 两部都为主流题材 × 高口碑，悬疑喜剧《低智商犯罪》豆瓣评分 8.2；年代剧《主角》豆瓣评分 8.1。拼播仍然是趋势，TOP10 出现 2 部爱奇艺和腾讯的拼播作品。"
          highlights={["3 部集均 V30 超过 3,000 万", "低于 25Q2"]}
          storageKey="ogv-market-review:26q2:horizontal-drama-top10"
        />
      </div>
      <div className="top-series-evidence"><div className="top-series-quarters"><LongQuarter quarter="25Q2" rows={long25} /><LongQuarter quarter="26Q2" rows={long26} /></div></div>
      <p className="horizontal-drama-source">数据来源：云和数据</p>
    </section>;
}

export function ShortDramaTopSeries() {
  return <section className="top-series-part top-series-part-embedded">
      <div className="horizontal-drama-lead">
        <EditableInsight
          lead="26Q2《灵魂摆渡·十年》集均 V30 明显领先"
          body="其余项目多集中在 130–370 万，与去年比下滑。题材上主要为犯罪、爱情、男频爽剧。"
          highlights={["集均 V30 明显领先", "130-370 万"]}
          storageKey="ogv-market-review:26q2:horizontal-short-drama-top10"
        />
      </div>
      <div className="top-series-evidence"><div className="top-series-quarters"><ShortQuarter quarter="25Q2" rows={short25} /><ShortQuarter quarter="26Q2" rows={short26} /></div></div>
    </section>;
}
