"use client";

import { useState } from "react";

export function QuarterSummary() {
  const [expanded, setExpanded] = useState(false);

  return <div className={`quarter-summary-document${expanded ? " is-expanded" : " is-collapsed"}`}>
    <button className="quarter-summary-toggle" type="button" aria-expanded={expanded} aria-controls="quarter-summary-content" onClick={() => setExpanded((value) => !value)}>
      <span>{expanded ? "收起全文" : "展开查看完整判断"}</span><b aria-hidden="true">{expanded ? "−" : "+"}</b>
    </button>
    {expanded && <div id="quarter-summary-content" className="quarter-summary-content quarter-summary-static">
      <h2>平台整体</h2>
      <ol>
        <li><strong>长视频平台的用户、时长、收入继续收缩，短剧平台持续高速增长</strong>
          <ol>
            <li><strong>红果的 MAU 首次超过腾讯视频：</strong>26Q2 红果免费短剧 MAU 3.68 亿（同比 +74%）、DAU 1.57 亿（+106%），均超过腾讯视频的 3.19 亿（-12%）和 5051 万（-25%）；红果 DAU 已达到腾讯视频的 3.1 倍，腾讯、爱奇艺 DAU 均降至 2018 年以来最低。</li>
            <li><strong>红果持续吸收长视频用户，同时继续拓展新用户：</strong>从 MAU 看，26Q2 红果与爱腾重叠用户升至 1.61 亿（环比 +10%），红果独家用户升至 2.08 亿（+22%）；爱腾独家用户降至 3.03 亿（-10%）。</li>
            <li><strong>时长格局的差距进一步扩大：</strong>短剧平台总用户时长达到 325.9 亿小时（同比 +142%），已是爱优腾芒等长视频平台合计的 1.7 倍，长视频用户总时长 186.7 亿小时（同比 -14%），长视频平台的基本盘继续承压。</li>
            <li><strong>长视频平台收入持续下滑：</strong>长视频会员收入同比下滑 4%、广告收入同比下滑 4%，会员数同比 -3%～+7%，ARPPU 同比 -12%～1%，会员单价在下跌。腾讯视频外渠收入同比增长 +2.1%，占会员收入的 37%，自渠拉新能力持续减弱。</li>
          </ol>
        </li>
        <li><strong>短剧市场：免费持续替代付费，AI 短剧收入首次超过真人</strong>
          <ol>
            <li><strong>短剧持续从付费转向免费：</strong>26Q2 短剧平台 IAA 广告收入达到 317 亿，其中抖音 163.0 亿、红果 91.0 亿；IAP 付费短剧收入仅 30.8 亿（-26%）。IAA 已占两类平台收入合计的 91%。</li>
            <li><strong>AI 短剧收入环比翻倍，超过真人短剧：</strong>26Q2 AI 短剧收入 218 亿（+127%），收入首次超过真人短剧的 130 亿（-19%）。AI 短剧已经贡献整体短剧市场的 63%。</li>
          </ol>
        </li>
        <li><strong>趋势判断：</strong>
          <ol>
            <li>长视频用户和收入缓慢下滑仍是长周期趋势；短剧继续依靠免费模式、广告变现和更短的生产周期扩大市场。</li>
            <li>AI 内容正在依靠成本优势替代中腰部真人内容，但 OGV 和短剧的精品还需持续观察下一季度表现（vs PUGV 已有部分精品 AI 剧情内容）。</li>
          </ol>
        </li>
      </ol>

      <h2>分品类</h2>
      <ol>
        <li><strong>动画：</strong>
          <ol>
            <li><strong>番剧：</strong>23Q1 以来（有复盘数据以来）同比播放持续下跌，本季度下跌幅度（同比 -17%）与 25Q2（同比 -18%）相比略有收窄；分平台看，26Q1 各平台有效播放同比均有不同程度下跌，B 站下跌幅度最小。</li>
            <li><strong>国创：</strong>24Q2 以来连续 9 个季度同比播放下跌，本季度下跌幅度（同比 -25%）较 25Q1（同比 -15%）大幅扩大；分平台看，26Q1 各平台有效播放同比均有不同程度下跌，优酷跌幅最小（同比 -2%），B 站跌幅第二小（同比 -12%），爱奇艺（同比 -22%）、腾讯（同比 -36%）跌幅明显。
              <ol>
                <li><strong>国创新作播放回落，腾讯贡献进一步提升：</strong>1）26Q2 国创长片新作腾讯视频贡献 5.2 亿，占比 82%，是主要播放来源。B 站新作播放降至 0.7 亿，同比下降 82%。同期全网新片供给 27 部，腾讯独播 16 部，独播供给显著领先。2）玄幻、奇幻仍是新作主要题材；长线 IP 续作占据新作主力，纯新 IP 难突围。3）新作中头部内容供给量稳定，但档内差距依然显著：26Q2 与 25Q2 均有 3 部新作进入千万级集均播放，头部第一名与同档其他作品仍存在明显断层。</li>
                <li><strong>国创头部内容：</strong>TOP50 国创长片有效播放跌幅超大盘，同比 -20% vs 国创大盘同比 -12%。进一步下拆发现下滑主要由 TOP11-50 内容贡献，国创用户消费进一步向少数长线头部内容集中。分平台看，腾讯头部老作播放下滑，新进榜多为腰尾部，内容补位不足；B 站《凡人修仙传》《牧神记》持续增长，但其他头部内容播放水位下降；优酷头部内容池相比去年明显扩容，《光阴之外》等多部内容进入 TOP50，长线 IP《沧元图》《师兄啊师兄》播放也大幅提升。</li>
              </ol>
            </li>
          </ol>
        </li>
        <li><strong>横屏剧集：</strong>
          <ol>
            <li><strong>横屏长剧：</strong>1）<strong>用户继续流失，</strong>26Q2 热播剧播放 152 亿（-15%），TOP10 长剧集均 V30 下降 20%。2）<strong>芒果TV少量回升，</strong>主要来自 2 部高投入的独家剧集《良陈美锦》《耀眼》，局部供给驱动增长，但不影响大盘下行。3）<strong>头部内容中，古偶仍是基本盘 5/10，</strong>但没有超级爆款，<strong>TOP2 为悬疑和年代剧的高口碑内容</strong>（豆瓣 8+）——《低智商犯罪》《主角》。</li>
            <li><strong>横屏短剧：</strong><strong>大盘有所回升，</strong>但主要由爱奇艺头部定制《灵魂摆渡·十年》单个内容带动，其他内容水位较低。</li>
          </ol>
        </li>
        <li><strong>综艺：热播综艺触底平稳，播放小幅回升（+8%），</strong>主要来自头部综 N 代播放上涨，《五哈6》作为 TOP1 综艺，占 TOP10 整体播放的 34%；榜单继续由综 N 代主导，唯一进入 TOP10 的新综艺为演技综艺，<strong>无模式创新。</strong></li>
        <li><strong>电影：26Q2 新上新院线电影播放 9.8 亿，</strong>同比 -8%。<strong>B 站覆盖院线新片 TOP50 中的 33 部，</strong>覆盖率升至 66%，单片份额较高的仍为动画电影和海外片。院线票房 26Q2 54.8 亿，仍处低位，<strong>后续线上新供给继续承压。</strong></li>
        <li><strong>纪录片：</strong>26Q2 月榜 TOP 内容主要题材为<strong>职业纪实、医疗、自然</strong>；头部内容中<strong>B 站覆盖率高，仅 2 部作品 B 站没有播出</strong>（《十三邀》《了不起的妈妈》）。</li>
      </ol>
    </div>}
  </div>;
}
