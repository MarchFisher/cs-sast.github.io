import { toText } from "../utils.js";

// 数据状态与面向访问者的短标签保持集中映射，避免散落条件判断。
const statusLabels = {
  preview: "预告",
  registration: "报名中",
  upcoming: "即将开赛",
  finished: "已结束",
};

// 首页优先展示仍可参与或即将发生的赛事，不把已结束赛事当作当前赛事。
const activeEventStatuses = ["registration", "upcoming", "preview"];

/**
 * 更新首页首屏的学年和当前赛事卡片。
 * 如果没有活动中的赛事，只更新学年，并保留 HTML 中“资料核对中”的
 * 默认说明，避免用不完整数据覆盖更明确的占位信息。
 */
export function renderCurrentEvent(data) {
  const academicYear = document.querySelector("#active-academic-year");
  academicYear.textContent = toText(data.activeAcademicYear).replace("-", "—");

  const editions = Array.isArray(data.editions) ? data.editions : [];
  const currentEvent = editions.find((edition) =>
    activeEventStatuses.includes(edition.status),
  );

  if (!currentEvent) return;

  document.querySelector("#current-status").textContent =
    statusLabels[currentEvent.status] || "当前赛事";
  document.querySelector("#current-event-title").textContent = toText(
    currentEvent.title,
  );
  document.querySelector("#current-event-summary").textContent =
    toText(currentEvent.audience) || "具体信息请查看赛事详情。";
  document.querySelector("#data-review-status").textContent =
    `核对于 ${toText(currentEvent.lastReviewed)}`;
}

/**
 * 更新首页底部的招新状态。
 * 只有状态明确为 open 且提供链接时才把按钮改成正式招新入口；其他
 * 状态继续指向“加入我们”说明页，避免暴露未确认或已失效的地址。
 */
export function renderRecruitment(recruitment) {
  if (!recruitment) return;

  document.querySelector("#recruitment-state").textContent = toText(
    recruitment.label,
  );

  if (recruitment.status !== "open" || !recruitment.url) return;

  const link = document.querySelector("#recruitment-link");
  link.href = recruitment.url;
  link.textContent = "查看招新信息";
}
