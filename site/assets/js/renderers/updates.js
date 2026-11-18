import { toText } from "../utils.js";

// 首页空间有限，日历与通知均只展示最近的三项。
const HOME_ITEM_LIMIT = 3;

/** 创建一个日历条目；有详情地址时使用链接，否则使用普通容器。 */
function createCalendarItem(item) {
  const row = document.createElement(item.url ? "a" : "div");
  const date = document.createElement("time");
  const description = document.createElement("span");
  const title = document.createElement("strong");
  const location = document.createElement("small");

  if (item.url) row.href = item.url;
  date.dateTime = toText(item.date);
  date.textContent = toText(item.date).slice(5).replace("-", ".");
  title.textContent = toText(item.label);
  location.textContent = toText(item.location) || "地点待确认";

  description.append(title, location);
  row.append(date, description);
  return row;
}

/**
 * 渲染本学年日历。只有存在有效数组和目标容器时才替换默认占位内容。
 */
export function renderCalendar(items) {
  const calendar = document.querySelector("#calendar-list");

  if (!calendar || !Array.isArray(items) || items.length === 0) return;

  calendar.className = "data-list";
  calendar.replaceChildren(
    ...items.slice(0, HOME_ITEM_LIMIT).map(createCalendarItem),
  );
}

/** 创建一个公开通知链接，日期使用 time 元素保留机器可读值。 */
function createNoticeItem(item) {
  const link = document.createElement("a");
  const date = document.createElement("time");
  const title = document.createElement("strong");

  link.href = toText(item.url);
  date.dateTime = toText(item.date);
  date.textContent = toText(item.date);
  title.textContent = toText(item.title);
  link.append(date, title);
  return link;
}

/** 渲染最新公开通知；无数据时保留“暂无已确认通知”的静态说明。 */
export function renderNotices(items) {
  const notices = document.querySelector("#notice-list");

  if (!notices || !Array.isArray(items) || items.length === 0) return;

  notices.className = "data-list";
  notices.replaceChildren(
    ...items.slice(0, HOME_ITEM_LIMIT).map(createNoticeItem),
  );
}
