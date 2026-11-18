/**
 * 首页脚本共享的小型数据工具。
 *
 * events.json 属于外部输入。渲染前统一把非字符串值转换为空字符串，
 * 可以避免 undefined、null 或对象被意外显示在页面上。这里不负责业务
 * 默认文案；“地点待确认”等语义化回退应留在对应的渲染模块中。
 */
export function toText(value) {
  return typeof value === "string" ? value : "";
}
