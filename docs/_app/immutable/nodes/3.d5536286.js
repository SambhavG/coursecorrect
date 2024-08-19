import { s as safe_not_equal, f as src_url_equal, n as noop } from "../chunks/scheduler.59be48c0.js";
import { S as SvelteComponent, i as init, g as element, h as claim_element, j as children, f as detach, k as attr, l as set_style, a as insert_hydration } from "../chunks/index.0f5ae8f1.js";
const prerender = true;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
function create_fragment(ctx) {
  let iframe;
  let iframe_src_value;
  return {
    c() {
      iframe = element("iframe");
      this.h();
    },
    l(nodes) {
      iframe = claim_element(nodes, "IFRAME", { src: true, style: true });
      children(iframe).forEach(detach);
      this.h();
    },
    h() {
      if (!src_url_equal(iframe.src, iframe_src_value = "https://sambhavg.github.io/dine"))
        attr(iframe, "src", iframe_src_value);
      set_style(iframe, "width", "100%");
      set_style(iframe, "height", "100vh");
      set_style(iframe, "border", "none");
    },
    m(target, anchor) {
      insert_hydration(target, iframe, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(iframe);
      }
    }
  };
}
class Page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
export {
  Page as component,
  _page as universal
};
