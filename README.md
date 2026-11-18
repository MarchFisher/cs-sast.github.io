# 赛事部官网

东南大学计软智科协赛事部的静态优先官方网站。本项目目前处于阶段 0：仓库和协作流程准备。

## 本地运行

本项目只需要 Node.js 18 或更高版本，不依赖第三方 npm 包。

```bash
npm run check
npm run build
python3 -m http.server 8000 -d dist
```

打开 `http://localhost:8000` 查看构建结果。也可以直接打开 `site/index.html` 进行简单预览。

## 目录

- `site/`：公开站点源码与数据。
- `tools/`：构建和内容检查脚本。
- `docs/`：公开的协作、个人页面及上线配置文档。
- `.github/`：Pull Request 模板和自动化工作流。

提交内容前请阅读 [贡献指南](docs/Contributing.md)、[公开赛事数据模型](docs/DataModel.md) 和 [隐私检查清单](docs/PrivacyChecklist.md)。
