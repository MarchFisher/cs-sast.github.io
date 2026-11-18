# 公开赛事数据模型

站点将可重复使用的赛事信息保存在 `site/data/events.json`，结构约束位于 `site/data/events.schema.json`。首页在 JavaScript 可用时读取该数据；加载失败或关闭 JavaScript 时保留可阅读的静态内容。

## 设计原则

- 只保存已经确认可以公开的信息。
- 当届赛事与历史届次分离，避免把赛事系列的长期介绍和某一年的安排混在一起。
- 日期统一使用 `YYYY-MM-DD`，学年统一使用 `YYYY-YYYY`。
- ID 和路径使用英文小写及连字符。
- 无法确认的字段使用 `null` 或暂不创建记录，不能猜测。
- 每条赛事届次和通知必须记录公开来源及最后核对日期。

## 顶层字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `schemaVersion` | number | 数据模型版本，当前为 `1` |
| `activeAcademicYear` | string | 首页展示的当前学年 |
| `lastReviewed` | string/null | 整份数据最后核对日期 |
| `eventSeries` | array | 四类长期存在的赛事系列 |
| `editions` | array | 某个学年的具体赛事届次 |
| `calendar` | array | 首页学年日历条目 |
| `notices` | array | 已确认的公开通知 |
| `recruitment` | object | 当前招新状态与入口 |

## 赛事系列 `eventSeries`

赛事系列描述长期稳定的信息，不包含当届日期或报名链接。

| 字段 | 含义 |
| --- | --- |
| `id` | 稳定、唯一的英文 ID |
| `name` / `shortName` | 完整名称与简称 |
| `sequence` | 首页成长路径中的两位编号 |
| `summary` | 不依赖具体届次的简介 |
| `audience` | 适合人群的概括 |
| `detailPath` | 赛事详情页或锚点路径 |

## 赛事届次 `editions`

每一届赛事单独创建记录。`seriesId` 必须引用一个已有的赛事系列。

状态 `status` 只能使用：

- `preview`：预告，正式信息尚未全部发布。
- `registration`：报名中。
- `upcoming`：报名结束、即将开赛。
- `finished`：已经结束。

日期、地点、参赛对象、章程、报名和档案分别使用 `startDate`、`endDate`、`location`、`audience`、`rulesUrl`、`registrationUrl` 和 `archiveUrl`。未知信息使用 `null`。

每条记录的 `sources` 至少包含一个公开来源：

```json
{
  "label": "赛事正式通知",
  "url": "https://example.edu/official-notice"
}
```

只有来源核对完成后才能填写 `lastReviewed` 并提交记录。

## 日历与通知

`calendar` 用于首页的关键日期摘要。每条记录通过 `editionId` 关联赛事届次，并包含日期、名称、地点和可选链接。

`notices` 只保存正式公开的通知，包含发布日期、标题、链接、来源和核对日期。群聊消息或无法长期访问的临时文件不能作为唯一公开来源。

## 招新状态

`recruitment.status` 只能使用：

- `open`：正在招新，`url` 应提供公开报名或说明入口。
- `closed`：本轮招新已结束。
- `pending-confirmation`：状态尚未确认，不展示报名按钮。

## 完整届次示例

以下仅展示字段格式，示例值不得直接作为真实赛事信息发布：

```json
{
  "id": "example-event-2026",
  "seriesId": "fanruan-cup",
  "academicYear": "2026-2027",
  "title": "示例赛事名称",
  "status": "preview",
  "startDate": null,
  "endDate": null,
  "location": null,
  "audience": "以正式章程为准",
  "rulesUrl": null,
  "registrationUrl": null,
  "archiveUrl": null,
  "sources": [{ "label": "示例来源", "url": "https://example.edu/notice" }],
  "lastReviewed": "2026-11-17"
}
```

## 编辑与检查

1. 从可靠公开来源核对事实和授权边界。
2. 修改 `site/data/events.json`，不要直接修改生成目录 `dist/`。
3. 运行 `npm test` 检查 JSON、引用关系、重复 ID、日期、链接和站点构建。
4. 在 Pull Request 中列出新增来源和最后核对日期。

不得写入报名表、手机号、私人邮箱、学号、签到、准入码、财务资料、未公开成绩或无法确认授权的个人信息。
