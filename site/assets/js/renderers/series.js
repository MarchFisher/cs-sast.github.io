import { toText } from "../utils.js";

/**
 * 创建赛事成长路径中的一个列表项。
 *
 * 使用 textContent 写入数据，避免把 JSON 内容当作 HTML 解析；链接地址
 * 已由构建检查验证为 HTTPS 或站内路径。箭头只是装饰，因此对辅助技术
 * 隐藏，赛事名称、简介和适合人群仍由链接整体提供。
 */
function createSeriesItem(event) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const sequence = document.createElement("span");
  const description = document.createElement("div");
  const title = document.createElement("h3");
  const summary = document.createElement("p");
  const audience = document.createElement("small");
  const arrow = document.createElement("b");

  link.href = toText(event.detailPath);
  sequence.textContent = toText(event.sequence);
  title.textContent = toText(event.name);
  summary.textContent = toText(event.summary);
  audience.textContent = toText(event.audience);
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  description.append(title, summary, audience);
  link.append(sequence, description, arrow);
  item.append(link);
  return item;
}

/**
 * 用数据中的完整赛事系列替换 HTML 预置列表。
 * 数据缺失或结构不正确时直接返回，从而保留静态 HTML 作为降级内容。
 */
export function renderSeries(series) {
  const list = document.querySelector("#event-series");

  if (!list || !Array.isArray(series) || series.length === 0) return;
  list.replaceChildren(...series.map(createSeriesItem));
}
