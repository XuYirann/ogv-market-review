"use client";

import { useEffect, useRef } from "react";

function HighlightedText({ text, highlights }: { text: string; highlights: readonly string[] }) {
  const parts = highlights.reduce<(string | { value: string; key: string })[]>((current, highlight) => {
    return current.flatMap((part) => {
      if (typeof part !== "string") return [part];
      return part.split(highlight).flatMap((segment, index, values) =>
        index < values.length - 1 ? [segment, { value: highlight, key: `${highlight}-${index}` }] : [segment],
      );
    });
  }, [text]);

  return parts.map((part, index) =>
    typeof part === "string" ? part : <strong key={`${part.key}-${index}`}>{part.value}</strong>,
  );
}

export function EditableInsight({
  lead,
  body,
  highlights,
  storageKey = "ogv-market-review:26q2:platform-insight",
}: {
  lead: string;
  body: string;
  highlights: readonly string[];
  storageKey?: string;
}) {
  const editorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved && editorRef.current) editorRef.current.textContent = saved;
  }, [storageKey]);

  return (
    <div className="audience-insight">
      <p
        ref={editorRef}
        className="insight-editor"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="平台洞察，点击后可直接编辑"
        onBlur={(event) => window.localStorage.setItem(storageKey, event.currentTarget.textContent ?? "")}
      >
        <b>{lead}：</b>
        <HighlightedText text={body} highlights={highlights} />
      </p>
    </div>
  );
}
