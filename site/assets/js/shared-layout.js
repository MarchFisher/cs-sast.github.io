/**
 * 公共页头和页脚 Web Component。
 *
 * Lite Server 通过 HTTP 提供页面，因此这里可以 fetch 独立 HTML 文件。
 * 组件使用 Light DOM（直接写入自定义元素内部），让全站现有 CSS 可以
 * 继续作用于 header 和 footer，不需要为 Shadow DOM 重复维护样式。
 */
const siteRoot = new URL("../../", import.meta.url);
const componentRoot = new URL("components/", siteRoot);
const templateRequests = new Map();

/**
 * 每个模板在一个页面生命周期内只请求一次。即使以后一个页面出现多个
 * 同类组件，也会复用同一个 Promise，避免重复网络请求。
 */
function loadTemplate(fileName) {
  if (!templateRequests.has(fileName)) {
    const request = fetch(new URL(fileName, componentRoot)).then((response) => {
      if (!response.ok) {
        throw new Error(`公共组件加载失败：${fileName} (${response.status})`);
      }
      return response.text();
    });
    templateRequests.set(fileName, request);
  }

  return templateRequests.get(fileName);
}

function resolveRootLinks(template) {
  return template.replaceAll("{{root}}", siteRoot.href);
}

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    try {
      const template = await loadTemplate("header.html");
      this.innerHTML = resolveRootLinks(template);
      this.markCurrentPage();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * current-page 由每个页面声明。模板里的 data-nav-page 是内部标记，
   * 完成匹配后删除，最终 DOM 只保留具有语义的 aria-current 属性。
   */
  markCurrentPage() {
    const currentPage = this.getAttribute("current-page");

    for (const link of this.querySelectorAll("[data-nav-page]")) {
      if (link.dataset.navPage === currentPage) {
        link.setAttribute("aria-current", "page");
      }
      link.removeAttribute("data-nav-page");
    }
  }
}

class SiteFooter extends HTMLElement {
  async connectedCallback() {
    try {
      const template = await loadTemplate("footer.html");
      this.innerHTML = resolveRootLinks(template);
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
