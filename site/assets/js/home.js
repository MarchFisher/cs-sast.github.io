/**
 * 首页脚本入口。
 *
 * 本文件只负责请求数据和安排渲染顺序，不直接创建 DOM 元素。各区域的
 * 展示逻辑放在 renderers/ 中，因此修改某个首页区块时不需要理解整条
 * 数据加载流程。请求失败时保留 HTML 里的默认占位内容，页面仍可使用。
 */
import { renderCurrentEvent, renderRecruitment } from "./renderers/status.js";
import { renderSeries } from "./renderers/series.js";
import { renderCalendar, renderNotices } from "./renderers/updates.js";

async function loadHomeData() {
  const response = await fetch("data/events.json");

  if (!response.ok) {
    throw new Error(`首页数据请求失败：${response.status}`);
  }

  return response.json();
}

async function initializeHomePage() {
  try {
    const data = await loadHomeData();

    renderSeries(data.eventSeries);
    renderCurrentEvent(data);
    renderCalendar(data.calendar);
    renderNotices(data.notices);
    renderRecruitment(data.recruitment);
  } catch (error) {
    // 静态占位内容本身已经可读，加载失败时无需清空页面或打断访问者。
    console.warn("首页动态数据未加载，已保留默认内容。", error);
  }
}

initializeHomePage();
