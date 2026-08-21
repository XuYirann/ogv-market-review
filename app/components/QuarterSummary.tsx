"use client";

import { useEffect, useState } from "react";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";

const storageKey = "ogv-market-review:26Q2:quarter-summary-markdown-v2";

const normalizeSummaryMarkdown = (value: string) => {
  let nestedNumberDepth = 0;

  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((sourceLine) => {
      let line = sourceLine
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\\\*\\\*/g, "**")
        .replace(/\*\*[ \t]+(?=\S)/g, "**")
        .replace(/(?<=\S)[ \t]+\*\*(?=[ \t]*$)/g, "**")
        .replace(/(\*\*[^*\n]+?\*\*)(?=[\p{L}\p{N}])/gu, "$1 ");
      const heading = line.match(/^\s*(?:#{1,6}\s*)?(?:\*{1,2})?\s*(平台整体|分品类)\s*(?:\*{1,2})?\s*[：:]?\s*$/u);

      if (heading) {
        nestedNumberDepth = 0;
        return `## ${heading[1]}`;
      }

      // Word/富文本粘贴常把 a.、b.、i. 变成普通段落。这里仅重编码行首编号，正文保持原样。
      const manualSubItem = line.match(/^\s*(i{1,3}|[a-z])[.、]\s+(.+)$/iu);
      if (manualSubItem) {
        const isRomanSubItem = /^i{1,3}$/iu.test(manualSubItem[1]);
        nestedNumberDepth = isRomanSubItem ? 2 : 1;
        return `${isRomanSubItem ? "      " : "   "}1. ${manualSubItem[2]}`;
      }

      const manualNumber = line.match(/^(\d+)[.、]\s+(.+)$/u);
      if (manualNumber && nestedNumberDepth === 2) {
        return `         1. ${manualNumber[2]}`;
      }

      if (manualNumber) nestedNumberDepth = 0;
      if (!line.trim()) nestedNumberDepth = 0;
      return line;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
};

const defaultMarkdown = normalizeSummaryMarkdown(`## 平台整体

1. **长视频平台的用户与时长继续收缩，短剧对用户注意力的替代从“增量补充”进入“格局逆转”。**
   1. **红果在用户规模上完成全面反超：**26Q2 红果免费短剧 MAU **3.68 亿（同比 +74%）**、DAU **1.57 亿（+106%）**，均超过腾讯视频的 3.19 亿（-12%）和 5051 万（-25%）；红果 DAU 已达到腾讯视频的 **3.1 倍**，腾讯、爱奇艺 DAU 均降至 2018 年以来最低。
   2. **红果一边吸收长视频用户，一边继续拓展独立用户：**26Q2 红果与爱腾重叠用户升至 **1.61 亿（环比 +10%）**，红果独家用户升至 **2.08 亿（+22%）**；爱腾独家用户降至 **3.03 亿（-10%）**。用户迁移不只是存量平台之间的此消彼长，红果自身仍在扩大新增用户池。
   3. **时长格局的逆转进一步扩大：**短剧平台总用户时长达到 **325.9 亿小时（同比 +142%）**，已是爱优腾芒及其他长视频平台合计 186.7 亿小时（-14%）的 **1.7 倍**；其中红果贡献 300.3 亿小时（+141%）。腾讯视频、优酷视频时长分别同比下降 29%、35%，长视频用户价值的基本盘继续承压。

2. **免费模式成为短剧增长的绝对主引擎，AI 短剧在 26Q2 首次超过真人短剧。**
   1. **IAA 加速、IAP 继续萎缩：**26Q2 短剧平台 IAA 广告收入达到 **317.4 亿（同比 +188%）**，其中抖音 163.0 亿、红果 91.0 亿；IAP 付费短剧收入仅 30.8 亿（-26%）。IAA 已占两类平台收入合计的 **91%**，短剧商业模式进一步从用户付费转向广告变现。
   2. **AI 短剧从起量阶段进入规模替代阶段：**26Q2 AI 短剧收入环比增长 **129% 至 218 亿**，首次超过真人短剧的 130 亿；真人短剧收入环比下降 19%。AI 短剧已经贡献真人与 AI 短剧合计收入的 **63%**，替代速度明显快于 26Q1。

3. **趋势判断：**长视频用户和注意力缓慢下滑仍是长周期趋势；短剧依靠免费分发、广告变现和更短生产周期持续扩大市场。AI 内容的成本和迭代优势正在优先替代标准化程度较高的中腰部真人短剧，但头部精品内容能否同步建立，仍决定这一轮增长能否从规模扩张转向稳定留存。

## 分品类

1. **横屏剧集：**26Q2 长剧有效播放 **411 亿，同比下降 20%**，热播剧 TOP50 播放 152 亿（-15%）。头部和腰尾部同步承压：TOP10 同比下降 5%，11–50 下降 24%，TOP10 集均 V30 下降 20%；说明本季并非单纯供给减少，而是头部单剧效率和腰尾部承接能力同时走弱。平台侧爱奇艺同比小幅增长，芒果TV由低基数回升，但不足以扭转大盘下行。
2. **综艺：**整体有效播放 67 亿，同比基本持平（-1%），热播综艺回升至 46 亿（+8%）；腾讯、芒果、爱奇艺分别增长 26%、11%、9%，优酷下降 33%。但 TOP10 合计仍下降 9%，《哈哈哈哈哈第6季》一档占 TOP10 的 34%，榜单继续由综 N 代主导；唯一进入 TOP10 的新综艺播放仅 0.8 亿，市场企稳主要依赖存量 IP，而非新模式突破。
3. **电影：**26Q2 电影有效播放 **46.4 亿，同比下降 18%**，院线电影上新 TOP50 播放 9.8 亿（-8%）；新片 TOP10 相对稳定（6.32 亿、-9%），存量影片 TOP10 明显收缩（1.41 亿、-41%）。B站覆盖院线新片 TOP50 中的 33 部，覆盖率升至 66%，播放同比增长 10%至 1.1 亿；但季度院线票房仅 54.8 亿，仍处低位，后续线上新增供给继续承压。
4. **纪录片：**26Q2 月榜题材明显向职业纪实集中，职业纪实覆盖项目由去年同期 2 个增至 6 个，医疗、自然题材各有 3 个项目进入榜单；罪案由 5 个降至 1 个，美食题材本季未再进入头部。用户兴趣从泛罪案、美食存量内容转向具有明确人物、职业和现实现场的纪实内容，可重点关注医疗、职业与自然类轻量项目。`);

export function QuarterSummary() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedMarkdown = window.localStorage.getItem(storageKey);
    const savedMarkdown = normalizeSummaryMarkdown(storedMarkdown || defaultMarkdown);
    if (storedMarkdown && storedMarkdown !== savedMarkdown) {
      window.localStorage.setItem(storageKey, savedMarkdown);
    }
    const loadSavedMarkdown = window.setTimeout(() => {
      setMarkdown(savedMarkdown);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(loadSavedMarkdown);
  }, []);

  const update = (value: string) => {
    const normalized = normalizeSummaryMarkdown(value);
    setMarkdown(normalized);
    window.localStorage.setItem(storageKey, normalized);
  };

  return <div className={`quarter-summary-document${expanded ? " is-expanded" : " is-collapsed"}`}>
    <button className="quarter-summary-toggle" type="button" aria-expanded={expanded} aria-controls="quarter-summary-content" onClick={() => setExpanded((value) => !value)}>
      <span>{expanded ? "收起全文" : "展开查看完整判断"}</span><b aria-hidden="true">{expanded ? "−" : "+"}</b>
    </button>
    {expanded && <div id="quarter-summary-content" className="quarter-summary-content">
      {ready
        ? <MDXEditor
              className="quarter-summary-editor"
              contentEditableClassName="quarter-summary-editor-content"
              markdown={markdown}
              onChange={update}
              plugins={[
                headingsPlugin({ allowedHeadingLevels: [2, 3] }),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
              ]}
            />
        : <div className="quarter-summary-editor-loading" aria-label="正在载入本季判断" />}
    </div>}
  </div>;
}
