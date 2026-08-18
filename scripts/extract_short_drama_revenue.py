"""Extract short-drama revenue workbooks into a compact website dataset."""

from __future__ import annotations

import json
from pathlib import Path

from openpyxl import load_workbook


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "data_for_HTML" / "1.4_短漫剧.xlsx"
OUTPUT = ROOT / "app" / "data" / "shortDramaRevenue.json"


def rows(workbook, sheet: str, period_key: str):
    worksheet = workbook[sheet]
    values = list(worksheet.values)
    headers = [str(value) if value is not None else "" for value in values[0]]
    result = []
    for raw in values[1:]:
        if not raw or raw[0] is None:
            continue
        row = {headers[index]: value for index, value in enumerate(raw) if index < len(headers) and headers[index]}
        result.append({"period": str(row.pop(period_key)), **{key: round(float(value), 2) for key, value in row.items() if value is not None}})
    return result


def main():
    workbook = load_workbook(SOURCE, data_only=True, read_only=True)
    payload = {
        "source": "QuestMobile；行业规模测算",
        "iap": rows(workbook, "1_1_短剧平台_IAP收入_亿", "quarter"),
        "iaa": rows(workbook, "1_2_短剧平台_IAA收入_亿", "quarter"),
        "liveAction": rows(workbook, "2_市场规模_真人短剧收入_亿", "真人短剧"),
        "ai": rows(workbook, "2_市场规模_AI短剧收入_亿", "AI短剧"),
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Extracted short-drama revenue data to {OUTPUT}")


if __name__ == "__main__":
    main()
