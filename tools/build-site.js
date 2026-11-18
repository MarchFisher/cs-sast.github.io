const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "site");
const output = path.join(root, "dist");

// 公共布局由浏览器端 Web Component 加载，构建只需复制静态站点。
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
fs.writeFileSync(path.join(output, ".nojekyll"), "");
console.log(`Built static site in ${path.relative(root, output)}/`);
