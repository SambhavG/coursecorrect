import { n as noop, i as identity, r as run_all, s as safe_not_equal, f as src_url_equal, e as component_subscribe, h as is_function, c as create_slot, j as assign, u as update_slot_base, g as get_all_dirty_from_scope, d as get_slot_changes, k as compute_rest_props, l as exclude_internal_props, m as null_to_empty, p as set_store_value, t as tick, q as add_render_callback, v as action_destroyer, o as onMount } from "../chunks/scheduler.59be48c0.js";
import { y as get_root_for_style, f as detach, z as append_empty_stylesheet, t as transition_out, d as transition_in, S as SvelteComponent, i as init, g as element, h as claim_element, j as children, k as attr, a as insert_hydration, x as append_hydration, A as svg_element, e as empty, B as claim_svg_element, C as set_svg_attributes, D as destroy_each, r as create_component, u as claim_component, v as mount_component, w as destroy_component, p as group_outros, b as check_outros, s as space, m as text, c as claim_space, n as claim_text, E as listen, o as set_data, F as get_svelte_dataset, G as set_input_value, H as select_option, I as to_number, J as select_value, q as construct_svelte_component, l as set_style, K as head_selector } from "../chunks/index.0f5ae8f1.js";
import { w as writable } from "../chunks/index.c467d646.js";
/* empty css                         */const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop$1(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next2 = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next2.length;
  if (deleted) {
    node.style.animation = next2.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
function create_animation(node, from, fn, params) {
  if (!from)
    return noop;
  const to = node.getBoundingClientRect();
  if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
    return noop;
  const {
    delay = 0,
    duration = 300,
    easing = identity,
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay,
    // @ts-ignore todo:
    end = start_time + duration,
    tick: tick2 = noop,
    css
  } = fn(node, { from, to }, params);
  let running = true;
  let started = false;
  let name;
  function start() {
    if (css) {
      name = create_rule(node, 0, 1, duration, delay, easing, css);
    }
    if (!delay) {
      started = true;
    }
  }
  function stop() {
    if (css)
      delete_rule(node, name);
    running = false;
  }
  loop$1((now2) => {
    if (!started && now2 >= start_time) {
      started = true;
    }
    if (started && now2 >= end) {
      tick2(1, 0);
      stop();
    }
    if (!running) {
      return false;
    }
    if (started) {
      const p = now2 - start_time;
      const t = 0 + 1 * easing(p / duration);
      tick2(t, 1 - t);
    }
    return true;
  });
  start();
  tick2(0, 1);
  return stop;
}
function fix_position(node) {
  const style = getComputedStyle(node);
  if (style.position !== "absolute" && style.position !== "fixed") {
    const { width, height } = style;
    const a = node.getBoundingClientRect();
    node.style.position = "absolute";
    node.style.width = width;
    node.style.height = height;
    add_transform(node, a);
  }
}
function add_transform(node, a) {
  const b = node.getBoundingClientRect();
  if (a.left !== b.left || a.top !== b.top) {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
  }
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function fix_and_outro_and_destroy_block(block, lookup) {
  block.f();
  outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next2, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert(block) {
    transition_in(block, 1);
    block.m(node, next2);
    lookup.set(block.key, block);
    next2 = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next2 = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}
function get_spread_update(levels, updates) {
  const update = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update))
      update[key] = void 0;
  }
  return update;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
const prerender = true;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const years = writable(["Frosh", "Sophomore", "Junior", "Senior", "Coterm"]);
const quarters = writable(["Summer", "Fall", "Winter", "Spring"]);
const allCourses = writable([]);
const reviewData = writable(void 0);
const courseTable = writable([]);
const courseTableList = writable([]);
const selectedCourse = writable({});
const selectedCoursePinned = writable(false);
const searchFilters = writable({
  meta: {
    "filterGridCourses": false,
    "filterNotOffered": false
  },
  WAYS: {
    "AII": false,
    "SI": false,
    "SMA": false,
    "CE": false,
    "AQR": false,
    "EDP": false,
    "ER": false,
    "FR": false
  },
  units: {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6+": false
  },
  hours: {
    "min": 0,
    "max": 100
  },
  averageEval: {
    "min": 0,
    "max": 5
  },
  percentCompleted: {
    "min": 0,
    "max": 100
  },
  QuartersOffered: {
    "Autumn": false,
    "Winter": false,
    "Spring": false,
    "Summer": false
  },
  sortBy: "alphabetical",
  sortOrder: "ascending"
});
const resultCategories = writable([
  {
    type: "exactMatchResults",
    results: [],
    title: "Exact Match",
    hide: false,
    numResults: 100,
    defaultNumResults: 100,
    numResultsShowing: 0,
    numResultsFound: 0
  },
  {
    type: "sameDepartmentResults",
    results: [],
    title: "Same Department",
    hide: false,
    numResults: 9999,
    defaultNumResults: 9999,
    numResultsShowing: 0,
    numResultsFound: 0
  },
  {
    type: "titleResults",
    results: [],
    title: "Title Match",
    hide: false,
    numResults: 100,
    defaultNumResults: 100,
    numResultsShowing: 0,
    numResultsFound: 0
  },
  {
    type: "descriptionResults",
    results: [],
    title: "Description Match",
    hide: false,
    numResults: 100,
    defaultNumResults: 100,
    numResultsShowing: 0,
    numResultsFound: 0
  }
]);
const isDragging$1 = writable(false);
const prefs = writable({
  courseTableData: {
    "Links": true,
    "WAYS": true,
    "Percent completed & eval": true,
    "Checkboxes": false,
    "Bump button": false
  },
  transferUnits: [
    {
      "name": "Total",
      "value": 0
    },
    {
      "name": "Math AP",
      "value": 0
    },
    {
      "name": "Chemistry AP",
      "value": 0
    },
    {
      "name": "Mechanics AP",
      "value": 0
    },
    {
      "name": "E&M AP",
      "value": 0
    },
    {
      "name": "CS AP",
      "value": 0
    },
    {
      "name": "Language AP",
      "value": 0
    }
  ]
});
const bachelorsDegreeChoices = writable([]);
const mastersDegreeChoices = writable([]);
const compiledDegree = writable({});
const compiledMastersDegree = writable({});
const bachelorsDegreeChoice = writable("BLANK");
const mastersDegreeChoice = writable("BLANK");
const showWelcomeModalOnLoad = writable(false);
const showWelcomeModal = writable(false);
const panelCollapsed = writable({
  //PERSISTENT
  courseData: false,
  search: false,
  ways: false,
  bsTracker: false,
  msTracker: false,
  config: false,
  summer: true,
  years: {
    "Frosh": false,
    "Sophomore": false,
    "Junior": false,
    "Senior": false,
    "Coterm": false
  }
});
const compressedTable = writable([]);
const courseDataSlider = writable(0);
const xkcd_svelte_svelte_type_style_lang = "";
function create_fragment$x(ctx) {
  let section;
  let img;
  let img_src_value;
  return {
    c() {
      section = element("section");
      img = element("img");
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      img = claim_element(section_nodes, "IMG", { src: true, alt: true, class: true });
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      if (!src_url_equal(img.src, img_src_value = /*image*/
      ctx[0]))
        attr(img, "src", img_src_value);
      attr(img, "alt", "XKCD comic");
      attr(img, "class", "svelte-cdo3i9");
      attr(section, "class", "svelte-cdo3i9");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      append_hydration(section, img);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*image*/
      1 && !src_url_equal(img.src, img_src_value = /*image*/
      ctx2[0])) {
        attr(img, "src", img_src_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(section);
      }
    }
  };
}
function instance$y($$self, $$props, $$invalidate) {
  let $bachelorsDegreeChoice;
  component_subscribe($$self, bachelorsDegreeChoice, ($$value) => $$invalidate(1, $bachelorsDegreeChoice = $$value));
  let image = "https://imgs.xkcd.com/comics/every_majors_terrible.png";
  let xkcdLut = {
    BioE: ["circumappendiceal_somectomy", "flinch"],
    Biology: ["mushrooms", "flinch", "paper_title"],
    CS: [
      "the_general_problem",
      "not_really_into_pokemon",
      "code_quality",
      "travel_ghosts",
      "working_for_google",
      "compiling",
      "git_commit",
      "success",
      "future_self"
    ],
    Econ: [
      "the_economic_argument",
      "money",
      "correlation",
      "peer_review",
      "investing",
      "advertising",
      "curve_fitting"
    ],
    English: ["i_could_care_less", "sustainable", "etymonline", "odyssey", "bookstore"],
    Humbio: [
      "answers",
      "incision",
      "old_timers",
      "2024",
      "circumappendiceal_somectomy",
      "gut_fauna",
      "strengths_and_weaknesses",
      "advent",
      "sick_day",
      "coronavirus_research"
    ],
    IR: ["terminology", "congress", "edge_cake", "iceland"],
    Math: [
      "garbage_math",
      "convincing_pickup_line",
      "forgot_algebra",
      "proof",
      "polar_cartesian",
      "mobius_battle",
      "euler_diagrams",
      "math_paper",
      "set_theory"
    ],
    MechE: [
      "quadcopter",
      "airaware",
      "my_phone_is_dying",
      "heat_pump",
      "engineering_hubris",
      "wing_lift",
      "work",
      "the_wrong_stuff"
    ],
    "MS&E": [
      "spinal_tap_amps",
      "engineering_hubris",
      "engineer_syllogism",
      "unicode",
      "work"
    ],
    Polisci: ["lincoln_douglas", "congress", "open_letter", "chain_of_command"],
    Symsys: ["kites", "engineer_syllogism", "work", "curve_fitting", "the_wrong_stuff"],
    Physics: [
      "swingset",
      "felsius",
      "higgs_boson",
      "interdisciplinary",
      "flinch",
      "heat_pump"
    ],
    Psychology: ["interdisciplinary", "walking_into_things", "brain_worms", "fmri"],
    other: ["in_your_classroom", "every_majors_terrible", "scientific_field_prefixes"]
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$bachelorsDegreeChoice*/
    2) {
      {
        try {
          let major = $bachelorsDegreeChoice.split("_")[2];
          let random = Math.floor(Math.random() * 1e4);
          let xkcdKey = Object.keys(xkcdLut).find((key) => major == key);
          if (!xkcdKey || xkcdLut[xkcdKey].length == 0)
            xkcdKey = "other";
          let randomIndex = random % xkcdLut[xkcdKey].length;
          $$invalidate(0, image = `https://imgs.xkcd.com/comics/${xkcdLut[xkcdKey][randomIndex]}.png`);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  return [image, $bachelorsDegreeChoice];
}
class Xkcd extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$y, create_fragment$x, safe_not_equal, {});
  }
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function flip(node, { from, to }, params = {}) {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;
  const [ox, oy] = style.transformOrigin.split(" ").map(parseFloat);
  const dx = from.left + from.width * ox / to.width - (to.left + ox);
  const dy = from.top + from.height * oy / to.height - (to.top + oy);
  const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
  return {
    delay,
    duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
    easing,
    css: (t, u) => {
      const x = u * dx;
      const y = u * dy;
      const sx = t + u * from.width / to.width;
      const sy = t + u * from.height / to.height;
      return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
    }
  };
}
const FINALIZE_EVENT_NAME = "finalize";
const CONSIDER_EVENT_NAME = "consider";
function dispatchFinalizeEvent(el, items, info) {
  el.dispatchEvent(
    new CustomEvent(FINALIZE_EVENT_NAME, {
      detail: { items, info }
    })
  );
}
function dispatchConsiderEvent(el, items, info) {
  el.dispatchEvent(
    new CustomEvent(CONSIDER_EVENT_NAME, {
      detail: { items, info }
    })
  );
}
const DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
const DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
const DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
const DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";
const DRAGGED_LEFT_TYPES = {
  LEFT_FOR_ANOTHER: "leftForAnother",
  OUTSIDE_OF_ANY: "outsideOfAny"
};
function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl2) {
  containerEl.dispatchEvent(
    new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
      detail: { indexObj, draggedEl: draggedEl2 }
    })
  );
}
function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl2, theOtherDz) {
  containerEl.dispatchEvent(
    new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
      detail: { draggedEl: draggedEl2, type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER, theOtherDz }
    })
  );
}
function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl2) {
  containerEl.dispatchEvent(
    new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
      detail: { draggedEl: draggedEl2, type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY }
    })
  );
}
function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl2) {
  containerEl.dispatchEvent(
    new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
      detail: { indexObj, draggedEl: draggedEl2 }
    })
  );
}
function dispatchDraggedLeftDocument(draggedEl2) {
  window.dispatchEvent(
    new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
      detail: { draggedEl: draggedEl2 }
    })
  );
}
const TRIGGERS = {
  DRAG_STARTED: "dragStarted",
  DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
  DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
  DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
  DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
  DRAGGED_LEFT_ALL: "draggedLeftAll",
  DROPPED_INTO_ZONE: "droppedIntoZone",
  DROPPED_INTO_ANOTHER: "droppedIntoAnother",
  DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
  DRAG_STOPPED: "dragStopped"
};
const SOURCES = {
  POINTER: "pointer",
  KEYBOARD: "keyboard"
};
const SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
const SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item";
const SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";
const DRAGGED_ELEMENT_ID = "dnd-action-dragged-el";
let ITEM_ID_KEY = "id";
let activeDndZoneCount = 0;
function incrementActiveDropZoneCount() {
  activeDndZoneCount++;
}
function decrementActiveDropZoneCount() {
  if (activeDndZoneCount === 0) {
    throw new Error("Bug! trying to decrement when there are no dropzones");
  }
  activeDndZoneCount--;
}
const isOnServer = typeof window === "undefined";
function getBoundingRectNoTransforms(el) {
  let ta;
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const tx = style.transform;
  if (tx) {
    let sx, sy, dx, dy;
    if (tx.startsWith("matrix3d(")) {
      ta = tx.slice(9, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[5];
      dx = +ta[12];
      dy = +ta[13];
    } else if (tx.startsWith("matrix(")) {
      ta = tx.slice(7, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[3];
      dx = +ta[4];
      dy = +ta[5];
    } else {
      return rect;
    }
    const to = style.transformOrigin;
    const x = rect.x - dx - (1 - sx) * parseFloat(to);
    const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
    const w = sx ? rect.width / sx : el.offsetWidth;
    const h = sy ? rect.height / sy : el.offsetHeight;
    return {
      x,
      y,
      width: w,
      height: h,
      top: y,
      right: x + w,
      bottom: y + h,
      left: x
    };
  } else {
    return rect;
  }
}
function getAbsoluteRectNoTransforms(el) {
  const rect = getBoundingRectNoTransforms(el);
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
function getAbsoluteRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
function findCenter(rect) {
  return {
    x: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2
  };
}
function calcDistance(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}
function isPointInsideRect(point, rect) {
  return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}
function findCenterOfElement(el) {
  return findCenter(getAbsoluteRect(el));
}
function isCenterOfAInsideB(elA, elB) {
  const centerOfA = findCenterOfElement(elA);
  const rectOfB = getAbsoluteRectNoTransforms(elB);
  return isPointInsideRect(centerOfA, rectOfB);
}
function calcDistanceBetweenCenters(elA, elB) {
  const centerOfA = findCenterOfElement(elA);
  const centerOfB = findCenterOfElement(elB);
  return calcDistance(centerOfA, centerOfB);
}
function isElementOffDocument(el) {
  const rect = getAbsoluteRect(el);
  return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}
function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
  const rect = getAbsoluteRect(el);
  if (!isPointInsideRect(point, rect)) {
    return null;
  }
  return {
    top: point.y - rect.top,
    bottom: rect.bottom - point.y,
    left: point.x - rect.left,
    // TODO - figure out what is so special about right (why the rect is too big)
    right: Math.min(rect.right, document.documentElement.clientWidth) - point.x
  };
}
let dzToShadowIndexToRect;
function resetIndexesCache() {
  dzToShadowIndexToRect = /* @__PURE__ */ new Map();
}
resetIndexesCache();
function resetIndexesCacheForDz(dz) {
  dzToShadowIndexToRect.delete(dz);
}
function cacheShadowRect(dz) {
  const shadowElIndex = Array.from(dz.children).findIndex((child) => child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME));
  if (shadowElIndex >= 0) {
    if (!dzToShadowIndexToRect.has(dz)) {
      dzToShadowIndexToRect.set(dz, /* @__PURE__ */ new Map());
    }
    dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
    return shadowElIndex;
  }
  return void 0;
}
function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
  if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
    return null;
  }
  const children2 = collectionBelowEl.children;
  if (children2.length === 0) {
    return { index: 0, isProximityBased: true };
  }
  const shadowElIndex = cacheShadowRect(collectionBelowEl);
  for (let i = 0; i < children2.length; i++) {
    if (isCenterOfAInsideB(floatingAboveEl, children2[i])) {
      const cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
      if (cachedShadowRect) {
        if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
          return { index: shadowElIndex, isProximityBased: false };
        }
      }
      return { index: i, isProximityBased: false };
    }
  }
  let minDistanceSoFar = Number.MAX_VALUE;
  let indexOfMin = void 0;
  for (let i = 0; i < children2.length; i++) {
    const distance = calcDistanceBetweenCenters(floatingAboveEl, children2[i]);
    if (distance < minDistanceSoFar) {
      minDistanceSoFar = distance;
      indexOfMin = i;
    }
  }
  return { index: indexOfMin, isProximityBased: true };
}
const SCROLL_ZONE_PX = 25;
function makeScroller() {
  let scrollingInfo;
  function resetScrolling2() {
    scrollingInfo = { directionObj: void 0, stepPx: 0 };
  }
  resetScrolling2();
  function scrollContainer(containerEl) {
    const { directionObj, stepPx } = scrollingInfo;
    if (directionObj) {
      containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
      window.requestAnimationFrame(() => scrollContainer(containerEl));
    }
  }
  function calcScrollStepPx(distancePx) {
    return SCROLL_ZONE_PX - distancePx;
  }
  function scrollIfNeeded2(pointer, elementToScroll) {
    if (!elementToScroll) {
      return false;
    }
    const distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
    if (distances === null) {
      resetScrolling2();
      return false;
    }
    const isAlreadyScrolling = !!scrollingInfo.directionObj;
    let [scrollingVertically, scrollingHorizontally] = [false, false];
    if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
      if (distances.bottom < SCROLL_ZONE_PX) {
        scrollingVertically = true;
        scrollingInfo.directionObj = { x: 0, y: 1 };
        scrollingInfo.stepPx = calcScrollStepPx(distances.bottom);
      } else if (distances.top < SCROLL_ZONE_PX) {
        scrollingVertically = true;
        scrollingInfo.directionObj = { x: 0, y: -1 };
        scrollingInfo.stepPx = calcScrollStepPx(distances.top);
      }
      if (!isAlreadyScrolling && scrollingVertically) {
        scrollContainer(elementToScroll);
        return true;
      }
    }
    if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
      if (distances.right < SCROLL_ZONE_PX) {
        scrollingHorizontally = true;
        scrollingInfo.directionObj = { x: 1, y: 0 };
        scrollingInfo.stepPx = calcScrollStepPx(distances.right);
      } else if (distances.left < SCROLL_ZONE_PX) {
        scrollingHorizontally = true;
        scrollingInfo.directionObj = { x: -1, y: 0 };
        scrollingInfo.stepPx = calcScrollStepPx(distances.left);
      }
      if (!isAlreadyScrolling && scrollingHorizontally) {
        scrollContainer(elementToScroll);
        return true;
      }
    }
    resetScrolling2();
    return false;
  }
  return {
    scrollIfNeeded: scrollIfNeeded2,
    resetScrolling: resetScrolling2
  };
}
function toString(object) {
  return JSON.stringify(object, null, 2);
}
function getDepth(node) {
  if (!node) {
    throw new Error("cannot get depth of a falsy node");
  }
  return _getDepth(node, 0);
}
function _getDepth(node, countSoFar = 0) {
  if (!node.parentElement) {
    return countSoFar - 1;
  }
  return _getDepth(node.parentElement, countSoFar + 1);
}
function areObjectsShallowEqual(objA, objB) {
  if (Object.keys(objA).length !== Object.keys(objB).length) {
    return false;
  }
  for (const keyA in objA) {
    if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) {
      return false;
    }
  }
  return true;
}
function areArraysShallowEqualSameOrder(arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false;
  }
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}
const INTERVAL_MS$1 = 200;
const TOLERANCE_PX = 10;
const { scrollIfNeeded: scrollIfNeeded$1, resetScrolling: resetScrolling$1 } = makeScroller();
let next$1;
function observe(draggedEl2, dropZones, intervalMs = INTERVAL_MS$1) {
  let lastDropZoneFound;
  let lastIndexFound;
  let lastIsDraggedInADropZone = false;
  let lastCentrePositionOfDragged;
  const dropZonesFromDeepToShallow = Array.from(dropZones).sort((dz1, dz2) => getDepth(dz2) - getDepth(dz1));
  function andNow() {
    const currentCenterOfDragged = findCenterOfElement(draggedEl2);
    const scrolled = scrollIfNeeded$1(currentCenterOfDragged, lastDropZoneFound);
    if (!scrolled && lastCentrePositionOfDragged && Math.abs(lastCentrePositionOfDragged.x - currentCenterOfDragged.x) < TOLERANCE_PX && Math.abs(lastCentrePositionOfDragged.y - currentCenterOfDragged.y) < TOLERANCE_PX) {
      next$1 = window.setTimeout(andNow, intervalMs);
      return;
    }
    if (isElementOffDocument(draggedEl2)) {
      dispatchDraggedLeftDocument(draggedEl2);
      return;
    }
    lastCentrePositionOfDragged = currentCenterOfDragged;
    let isDraggedInADropZone = false;
    for (const dz of dropZonesFromDeepToShallow) {
      if (scrolled)
        resetIndexesCacheForDz(lastDropZoneFound);
      const indexObj = findWouldBeIndex(draggedEl2, dz);
      if (indexObj === null) {
        continue;
      }
      const { index } = indexObj;
      isDraggedInADropZone = true;
      if (dz !== lastDropZoneFound) {
        lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl2, dz);
        dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl2);
        lastDropZoneFound = dz;
      } else if (index !== lastIndexFound) {
        dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl2);
        lastIndexFound = index;
      }
      break;
    }
    if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
      dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl2);
      lastDropZoneFound = void 0;
      lastIndexFound = void 0;
      lastIsDraggedInADropZone = false;
    } else {
      lastIsDraggedInADropZone = true;
    }
    next$1 = window.setTimeout(andNow, intervalMs);
  }
  andNow();
}
function unobserve() {
  clearTimeout(next$1);
  resetScrolling$1();
  resetIndexesCache();
}
const INTERVAL_MS = 300;
let mousePosition;
function updateMousePosition(e) {
  const c = e.touches ? e.touches[0] : e;
  mousePosition = { x: c.clientX, y: c.clientY };
}
const { scrollIfNeeded, resetScrolling } = makeScroller();
let next;
function loop() {
  if (mousePosition) {
    const scrolled = scrollIfNeeded(mousePosition, document.documentElement);
    if (scrolled)
      resetIndexesCache();
  }
  next = window.setTimeout(loop, INTERVAL_MS);
}
function armWindowScroller() {
  window.addEventListener("mousemove", updateMousePosition);
  window.addEventListener("touchmove", updateMousePosition);
  loop();
}
function disarmWindowScroller() {
  window.removeEventListener("mousemove", updateMousePosition);
  window.removeEventListener("touchmove", updateMousePosition);
  mousePosition = void 0;
  window.clearTimeout(next);
  resetScrolling();
}
function svelteNodeClone(el) {
  const cloned = el.cloneNode(true);
  const values = [];
  const elIsSelect = el.tagName === "SELECT";
  const selects = elIsSelect ? [el] : [...el.querySelectorAll("select")];
  for (const select of selects) {
    values.push(select.value);
  }
  if (selects.length <= 0) {
    return cloned;
  }
  const clonedSelects = elIsSelect ? [cloned] : [...cloned.querySelectorAll("select")];
  for (let i = 0; i < clonedSelects.length; i++) {
    const select = clonedSelects[i];
    const value = values[i];
    const optionEl = select.querySelector(`option[value="${value}"`);
    if (optionEl) {
      optionEl.setAttribute("selected", true);
    }
  }
  return cloned;
}
const FEATURE_FLAG_NAMES = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
});
const featureFlagsMap = {
  [FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT]: false
};
function getFeatureFlag(flagName) {
  if (!FEATURE_FLAG_NAMES[flagName])
    throw new Error(`Can't get non existing feature flag ${flagName}! Supported flags: ${Object.keys(FEATURE_FLAG_NAMES)}`);
  return featureFlagsMap[flagName];
}
const TRANSITION_DURATION_SECONDS = 0.2;
function trs(property) {
  return `${property} ${TRANSITION_DURATION_SECONDS}s ease`;
}
function createDraggedElementFrom(originalElement, positionCenterOnXY) {
  const rect = originalElement.getBoundingClientRect();
  const draggedEl2 = svelteNodeClone(originalElement);
  copyStylesFromTo(originalElement, draggedEl2);
  draggedEl2.id = DRAGGED_ELEMENT_ID;
  draggedEl2.style.position = "fixed";
  let elTopPx = rect.top;
  let elLeftPx = rect.left;
  draggedEl2.style.top = `${elTopPx}px`;
  draggedEl2.style.left = `${elLeftPx}px`;
  if (positionCenterOnXY) {
    const center = findCenter(rect);
    elTopPx -= center.y - positionCenterOnXY.y;
    elLeftPx -= center.x - positionCenterOnXY.x;
    window.setTimeout(() => {
      draggedEl2.style.top = `${elTopPx}px`;
      draggedEl2.style.left = `${elLeftPx}px`;
    }, 0);
  }
  draggedEl2.style.margin = "0";
  draggedEl2.style.boxSizing = "border-box";
  draggedEl2.style.height = `${rect.height}px`;
  draggedEl2.style.width = `${rect.width}px`;
  draggedEl2.style.transition = `${trs("top")}, ${trs("left")}, ${trs("background-color")}, ${trs("opacity")}, ${trs("color")} `;
  window.setTimeout(() => draggedEl2.style.transition += `, ${trs("width")}, ${trs("height")}`, 0);
  draggedEl2.style.zIndex = "9999";
  draggedEl2.style.cursor = "grabbing";
  return draggedEl2;
}
function moveDraggedElementToWasDroppedState(draggedEl2) {
  draggedEl2.style.cursor = "grab";
}
function morphDraggedElementToBeLike(draggedEl2, copyFromEl, currentMouseX, currentMouseY) {
  copyStylesFromTo(copyFromEl, draggedEl2);
  const newRect = copyFromEl.getBoundingClientRect();
  const draggedElRect = draggedEl2.getBoundingClientRect();
  const widthChange = newRect.width - draggedElRect.width;
  const heightChange = newRect.height - draggedElRect.height;
  if (widthChange || heightChange) {
    const relativeDistanceOfMousePointerFromDraggedSides = {
      left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
      top: (currentMouseY - draggedElRect.top) / draggedElRect.height
    };
    if (!getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT)) {
      draggedEl2.style.height = `${newRect.height}px`;
      draggedEl2.style.width = `${newRect.width}px`;
    }
    draggedEl2.style.left = `${parseFloat(draggedEl2.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange}px`;
    draggedEl2.style.top = `${parseFloat(draggedEl2.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange}px`;
  }
}
function copyStylesFromTo(copyFromEl, copyToEl) {
  const computedStyle = window.getComputedStyle(copyFromEl);
  Array.from(computedStyle).filter(
    (s) => s.startsWith("background") || s.startsWith("padding") || s.startsWith("font") || s.startsWith("text") || s.startsWith("align") || s.startsWith("justify") || s.startsWith("display") || s.startsWith("flex") || s.startsWith("border") || s === "opacity" || s === "color" || s === "list-style-type" || // copying with and height to make up for rect update timing issues in some browsers
    getFeatureFlag(FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) && (s === "width" || s === "height")
  ).forEach((s) => copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s)));
}
function styleDraggable(draggableEl, dragDisabled) {
  draggableEl.draggable = false;
  draggableEl.ondragstart = () => false;
  if (!dragDisabled) {
    draggableEl.style.userSelect = "none";
    draggableEl.style.WebkitUserSelect = "none";
    draggableEl.style.cursor = "grab";
  } else {
    draggableEl.style.userSelect = "";
    draggableEl.style.WebkitUserSelect = "";
    draggableEl.style.cursor = "";
  }
}
function hideElement(dragTarget) {
  dragTarget.style.display = "none";
  dragTarget.style.position = "fixed";
  dragTarget.style.zIndex = "-5";
}
function decorateShadowEl(shadowEl) {
  shadowEl.style.visibility = "hidden";
  shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}
function unDecorateShadowElement(shadowEl) {
  shadowEl.style.visibility = "";
  shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}
function styleActiveDropZones(dropZones, getStyles = () => {
}, getClasses = () => []) {
  dropZones.forEach((dz) => {
    const styles = getStyles(dz);
    Object.keys(styles).forEach((style) => {
      dz.style[style] = styles[style];
    });
    getClasses(dz).forEach((c) => dz.classList.add(c));
  });
}
function styleInactiveDropZones(dropZones, getStyles = () => {
}, getClasses = () => []) {
  dropZones.forEach((dz) => {
    const styles = getStyles(dz);
    Object.keys(styles).forEach((style) => {
      dz.style[style] = "";
    });
    getClasses(dz).forEach((c) => dz.classList.contains(c) && dz.classList.remove(c));
  });
}
function preventShrinking(el) {
  const originalMinHeight = el.style.minHeight;
  el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
  const originalMinWidth = el.style.minWidth;
  el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
  return function undo() {
    el.style.minHeight = originalMinHeight;
    el.style.minWidth = originalMinWidth;
  };
}
const DEFAULT_DROP_ZONE_TYPE$1 = "--any--";
const MIN_OBSERVATION_INTERVAL_MS = 100;
const MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3;
const DEFAULT_DROP_TARGET_STYLE$1 = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
let originalDragTarget;
let draggedEl;
let draggedElData;
let draggedElType;
let originDropZone;
let originIndex;
let shadowElData;
let shadowElDropZone;
let dragStartMousePosition;
let currentMousePosition;
let isWorkingOnPreviousDrag = false;
let finalizingPreviousDrag = false;
let unlockOriginDzMinDimensions;
let isDraggedOutsideOfAnyDz = false;
let scheduledForRemovalAfterDrop = [];
const typeToDropZones$1 = /* @__PURE__ */ new Map();
const dzToConfig$1 = /* @__PURE__ */ new Map();
const elToMouseDownListener = /* @__PURE__ */ new WeakMap();
function registerDropZone$1(dropZoneEl, type) {
  if (!typeToDropZones$1.has(type)) {
    typeToDropZones$1.set(type, /* @__PURE__ */ new Set());
  }
  if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
    typeToDropZones$1.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}
function unregisterDropZone$1(dropZoneEl, type) {
  typeToDropZones$1.get(type).delete(dropZoneEl);
  decrementActiveDropZoneCount();
  if (typeToDropZones$1.get(type).size === 0) {
    typeToDropZones$1.delete(type);
  }
}
function watchDraggedElement() {
  armWindowScroller();
  const dropZones = typeToDropZones$1.get(draggedElType);
  for (const dz of dropZones) {
    dz.addEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
    dz.addEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
    dz.addEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
  }
  window.addEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
  const observationIntervalMs = Math.max(
    MIN_OBSERVATION_INTERVAL_MS,
    ...Array.from(dropZones.keys()).map((dz) => dzToConfig$1.get(dz).dropAnimationDurationMs)
  );
  observe(draggedEl, dropZones, observationIntervalMs * 1.07);
}
function unWatchDraggedElement() {
  disarmWindowScroller();
  const dropZones = typeToDropZones$1.get(draggedElType);
  for (const dz of dropZones) {
    dz.removeEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
    dz.removeEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
    dz.removeEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
  }
  window.removeEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
  unobserve();
}
function findShadowPlaceHolderIdx(items) {
  return items.findIndex((item) => item[ITEM_ID_KEY] === SHADOW_PLACEHOLDER_ITEM_ID);
}
function findShadowElementIdx(items) {
  return items.findIndex((item) => !!item[SHADOW_ITEM_MARKER_PROPERTY_NAME] && item[ITEM_ID_KEY] !== SHADOW_PLACEHOLDER_ITEM_ID);
}
function handleDraggedEntered(e) {
  let { items, dropFromOthersDisabled } = dzToConfig$1.get(e.currentTarget);
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }
  isDraggedOutsideOfAnyDz = false;
  items = items.filter((item) => item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY]);
  if (originDropZone !== e.currentTarget) {
    const originZoneItems = dzToConfig$1.get(originDropZone).items;
    const newOriginZoneItems = originZoneItems.filter((item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
    dispatchConsiderEvent(originDropZone, newOriginZoneItems, {
      trigger: TRIGGERS.DRAGGED_ENTERED_ANOTHER,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
  } else {
    const shadowPlaceHolderIdx = findShadowPlaceHolderIdx(items);
    if (shadowPlaceHolderIdx !== -1) {
      items.splice(shadowPlaceHolderIdx, 1);
    }
  }
  const { index, isProximityBased } = e.detail.indexObj;
  const shadowElIdx = isProximityBased && index === e.currentTarget.children.length - 1 ? index + 1 : index;
  shadowElDropZone = e.currentTarget;
  items.splice(shadowElIdx, 0, shadowElData);
  dispatchConsiderEvent(e.currentTarget, items, { trigger: TRIGGERS.DRAGGED_ENTERED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER });
}
function handleDraggedLeft(e) {
  if (!isWorkingOnPreviousDrag)
    return;
  const { items, dropFromOthersDisabled } = dzToConfig$1.get(e.currentTarget);
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone && e.currentTarget !== shadowElDropZone) {
    return;
  }
  const shadowElIdx = findShadowElementIdx(items);
  const shadowItem = items.splice(shadowElIdx, 1)[0];
  shadowElDropZone = void 0;
  const { type, theOtherDz } = e.detail;
  if (type === DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY || type === DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER && theOtherDz !== originDropZone && dzToConfig$1.get(theOtherDz).dropFromOthersDisabled) {
    isDraggedOutsideOfAnyDz = true;
    shadowElDropZone = originDropZone;
    const originZoneItems = dzToConfig$1.get(originDropZone).items;
    originZoneItems.splice(originIndex, 0, shadowItem);
    dispatchConsiderEvent(originDropZone, originZoneItems, {
      trigger: TRIGGERS.DRAGGED_LEFT_ALL,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
  }
  dispatchConsiderEvent(e.currentTarget, items, {
    trigger: TRIGGERS.DRAGGED_LEFT,
    id: draggedElData[ITEM_ID_KEY],
    source: SOURCES.POINTER
  });
}
function handleDraggedIsOverIndex(e) {
  const { items, dropFromOthersDisabled } = dzToConfig$1.get(e.currentTarget);
  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }
  isDraggedOutsideOfAnyDz = false;
  const { index } = e.detail.indexObj;
  const shadowElIdx = findShadowElementIdx(items);
  items.splice(shadowElIdx, 1);
  items.splice(index, 0, shadowElData);
  dispatchConsiderEvent(e.currentTarget, items, { trigger: TRIGGERS.DRAGGED_OVER_INDEX, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER });
}
function handleMouseMove(e) {
  e.preventDefault();
  const c = e.touches ? e.touches[0] : e;
  currentMousePosition = { x: c.clientX, y: c.clientY };
  draggedEl.style.transform = `translate3d(${currentMousePosition.x - dragStartMousePosition.x}px, ${currentMousePosition.y - dragStartMousePosition.y}px, 0)`;
}
function handleDrop$1() {
  finalizingPreviousDrag = true;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("touchmove", handleMouseMove);
  window.removeEventListener("mouseup", handleDrop$1);
  window.removeEventListener("touchend", handleDrop$1);
  unWatchDraggedElement();
  moveDraggedElementToWasDroppedState(draggedEl);
  if (!shadowElDropZone) {
    shadowElDropZone = originDropZone;
  }
  let { items, type } = dzToConfig$1.get(shadowElDropZone);
  styleInactiveDropZones(
    typeToDropZones$1.get(type),
    (dz) => dzToConfig$1.get(dz).dropTargetStyle,
    (dz) => dzToConfig$1.get(dz).dropTargetClasses
  );
  let shadowElIdx = findShadowElementIdx(items);
  if (shadowElIdx === -1)
    shadowElIdx = originIndex;
  items = items.map((item) => item[SHADOW_ITEM_MARKER_PROPERTY_NAME] ? draggedElData : item);
  function finalizeWithinZone() {
    unlockOriginDzMinDimensions();
    dispatchFinalizeEvent(shadowElDropZone, items, {
      trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
    if (shadowElDropZone !== originDropZone) {
      dispatchFinalizeEvent(originDropZone, dzToConfig$1.get(originDropZone).items, {
        trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
        id: draggedElData[ITEM_ID_KEY],
        source: SOURCES.POINTER
      });
    }
    unDecorateShadowElement(shadowElDropZone.children[shadowElIdx]);
    cleanupPostDrop();
  }
  animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
}
function animateDraggedToFinalPosition(shadowElIdx, callback) {
  const shadowElRect = getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx]);
  const newTransform = {
    x: shadowElRect.left - parseFloat(draggedEl.style.left),
    y: shadowElRect.top - parseFloat(draggedEl.style.top)
  };
  const { dropAnimationDurationMs } = dzToConfig$1.get(shadowElDropZone);
  const transition = `transform ${dropAnimationDurationMs}ms ease`;
  draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
  draggedEl.style.transform = `translate3d(${newTransform.x}px, ${newTransform.y}px, 0)`;
  window.setTimeout(callback, dropAnimationDurationMs);
}
function scheduleDZForRemovalAfterDrop(dz, destroy) {
  scheduledForRemovalAfterDrop.push({ dz, destroy });
  window.requestAnimationFrame(() => {
    hideElement(dz);
    document.body.appendChild(dz);
  });
}
function cleanupPostDrop() {
  draggedEl.remove();
  originalDragTarget.remove();
  if (scheduledForRemovalAfterDrop.length) {
    scheduledForRemovalAfterDrop.forEach(({ dz, destroy }) => {
      destroy();
      dz.remove();
    });
    scheduledForRemovalAfterDrop = [];
  }
  draggedEl = void 0;
  originalDragTarget = void 0;
  draggedElData = void 0;
  draggedElType = void 0;
  originDropZone = void 0;
  originIndex = void 0;
  shadowElData = void 0;
  shadowElDropZone = void 0;
  dragStartMousePosition = void 0;
  currentMousePosition = void 0;
  isWorkingOnPreviousDrag = false;
  finalizingPreviousDrag = false;
  unlockOriginDzMinDimensions = void 0;
  isDraggedOutsideOfAnyDz = false;
}
function dndzone$2(node, options) {
  let initialized = false;
  const config = {
    items: void 0,
    type: void 0,
    flipDurationMs: 0,
    dragDisabled: false,
    morphDisabled: false,
    dropFromOthersDisabled: false,
    dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
    dropTargetClasses: [],
    transformDraggedElement: () => {
    },
    centreDraggedOnCursor: false
  };
  let elToIdx = /* @__PURE__ */ new Map();
  function addMaybeListeners() {
    window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, { passive: false });
    window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, { passive: false, capture: false });
    window.addEventListener("mouseup", handleFalseAlarm, { passive: false });
    window.addEventListener("touchend", handleFalseAlarm, { passive: false });
  }
  function removeMaybeListeners() {
    window.removeEventListener("mousemove", handleMouseMoveMaybeDragStart);
    window.removeEventListener("touchmove", handleMouseMoveMaybeDragStart);
    window.removeEventListener("mouseup", handleFalseAlarm);
    window.removeEventListener("touchend", handleFalseAlarm);
  }
  function handleFalseAlarm() {
    removeMaybeListeners();
    originalDragTarget = void 0;
    dragStartMousePosition = void 0;
    currentMousePosition = void 0;
  }
  function handleMouseMoveMaybeDragStart(e) {
    e.preventDefault();
    const c = e.touches ? e.touches[0] : e;
    currentMousePosition = { x: c.clientX, y: c.clientY };
    if (Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX || Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX) {
      removeMaybeListeners();
      handleDragStart();
    }
  }
  function handleMouseDown(e) {
    if (e.target !== e.currentTarget && (e.target.value !== void 0 || e.target.isContentEditable)) {
      return;
    }
    if (e.button) {
      return;
    }
    if (isWorkingOnPreviousDrag) {
      return;
    }
    e.stopPropagation();
    const c = e.touches ? e.touches[0] : e;
    dragStartMousePosition = { x: c.clientX, y: c.clientY };
    currentMousePosition = { ...dragStartMousePosition };
    originalDragTarget = e.currentTarget;
    addMaybeListeners();
  }
  function handleDragStart() {
    isWorkingOnPreviousDrag = true;
    const currentIdx = elToIdx.get(originalDragTarget);
    originIndex = currentIdx;
    originDropZone = originalDragTarget.parentElement;
    const rootNode = originDropZone.getRootNode();
    const originDropZoneRoot = rootNode.body || rootNode;
    const { items, type, centreDraggedOnCursor } = config;
    draggedElData = { ...items[currentIdx] };
    draggedElType = type;
    shadowElData = { ...draggedElData, [SHADOW_ITEM_MARKER_PROPERTY_NAME]: true };
    const placeHolderElData = { ...shadowElData, [ITEM_ID_KEY]: SHADOW_PLACEHOLDER_ITEM_ID };
    draggedEl = createDraggedElementFrom(originalDragTarget, centreDraggedOnCursor && currentMousePosition);
    function keepOriginalElementInDom() {
      if (!draggedEl.parentElement) {
        originDropZoneRoot.appendChild(draggedEl);
        draggedEl.focus();
        watchDraggedElement();
        hideElement(originalDragTarget);
        originDropZoneRoot.appendChild(originalDragTarget);
      } else {
        window.requestAnimationFrame(keepOriginalElementInDom);
      }
    }
    window.requestAnimationFrame(keepOriginalElementInDom);
    styleActiveDropZones(
      Array.from(typeToDropZones$1.get(config.type)).filter((dz) => dz === originDropZone || !dzToConfig$1.get(dz).dropFromOthersDisabled),
      (dz) => dzToConfig$1.get(dz).dropTargetStyle,
      (dz) => dzToConfig$1.get(dz).dropTargetClasses
    );
    items.splice(currentIdx, 1, placeHolderElData);
    unlockOriginDzMinDimensions = preventShrinking(originDropZone);
    dispatchConsiderEvent(originDropZone, items, { trigger: TRIGGERS.DRAG_STARTED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER });
    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("touchmove", handleMouseMove, { passive: false, capture: false });
    window.addEventListener("mouseup", handleDrop$1, { passive: false });
    window.addEventListener("touchend", handleDrop$1, { passive: false });
  }
  function configure({
    items = void 0,
    flipDurationMs: dropAnimationDurationMs = 0,
    type: newType = DEFAULT_DROP_ZONE_TYPE$1,
    dragDisabled = false,
    morphDisabled = false,
    dropFromOthersDisabled = false,
    dropTargetStyle = DEFAULT_DROP_TARGET_STYLE$1,
    dropTargetClasses = [],
    transformDraggedElement = () => {
    },
    centreDraggedOnCursor = false
  }) {
    config.dropAnimationDurationMs = dropAnimationDurationMs;
    if (config.type && newType !== config.type) {
      unregisterDropZone$1(node, config.type);
    }
    config.type = newType;
    registerDropZone$1(node, newType);
    config.items = [...items];
    config.dragDisabled = dragDisabled;
    config.morphDisabled = morphDisabled;
    config.transformDraggedElement = transformDraggedElement;
    config.centreDraggedOnCursor = centreDraggedOnCursor;
    if (initialized && isWorkingOnPreviousDrag && !finalizingPreviousDrag && (!areObjectsShallowEqual(dropTargetStyle, config.dropTargetStyle) || !areArraysShallowEqualSameOrder(dropTargetClasses, config.dropTargetClasses))) {
      styleInactiveDropZones(
        [node],
        () => config.dropTargetStyle,
        () => dropTargetClasses
      );
      styleActiveDropZones(
        [node],
        () => dropTargetStyle,
        () => dropTargetClasses
      );
    }
    config.dropTargetStyle = dropTargetStyle;
    config.dropTargetClasses = [...dropTargetClasses];
    function getConfigProp(dz, propName) {
      return dzToConfig$1.get(dz) ? dzToConfig$1.get(dz)[propName] : config[propName];
    }
    if (initialized && isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) {
      if (dropFromOthersDisabled) {
        styleInactiveDropZones(
          [node],
          (dz) => getConfigProp(dz, "dropTargetStyle"),
          (dz) => getConfigProp(dz, "dropTargetClasses")
        );
      } else {
        styleActiveDropZones(
          [node],
          (dz) => getConfigProp(dz, "dropTargetStyle"),
          (dz) => getConfigProp(dz, "dropTargetClasses")
        );
      }
    }
    config.dropFromOthersDisabled = dropFromOthersDisabled;
    dzToConfig$1.set(node, config);
    const shadowElIdx = findShadowElementIdx(config.items);
    for (let idx = 0; idx < node.children.length; idx++) {
      const draggableEl = node.children[idx];
      styleDraggable(draggableEl, dragDisabled);
      if (idx === shadowElIdx) {
        config.transformDraggedElement(draggedEl, draggedElData, idx);
        if (!morphDisabled) {
          morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y);
        }
        decorateShadowEl(draggableEl);
        continue;
      }
      draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
      draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));
      if (!dragDisabled) {
        draggableEl.addEventListener("mousedown", handleMouseDown);
        draggableEl.addEventListener("touchstart", handleMouseDown);
        elToMouseDownListener.set(draggableEl, handleMouseDown);
      }
      elToIdx.set(draggableEl, idx);
      if (!initialized) {
        initialized = true;
      }
    }
  }
  configure(options);
  return {
    update: (newOptions) => {
      configure(newOptions);
    },
    destroy: () => {
      function destroyDz() {
        unregisterDropZone$1(node, dzToConfig$1.get(node).type);
        dzToConfig$1.delete(node);
      }
      if (isWorkingOnPreviousDrag) {
        scheduleDZForRemovalAfterDrop(node, destroyDz);
      } else {
        destroyDz();
      }
    }
  };
}
const INSTRUCTION_IDs$1 = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
const ID_TO_INSTRUCTION = {
  [INSTRUCTION_IDs$1.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
  [INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
};
const ALERT_DIV_ID = "dnd-action-aria-alert";
let alertsDiv;
function initAriaOnBrowser() {
  if (alertsDiv) {
    return;
  }
  alertsDiv = document.createElement("div");
  (function initAlertsDiv() {
    alertsDiv.id = ALERT_DIV_ID;
    alertsDiv.style.position = "fixed";
    alertsDiv.style.bottom = "0";
    alertsDiv.style.left = "0";
    alertsDiv.style.zIndex = "-5";
    alertsDiv.style.opacity = "0";
    alertsDiv.style.height = "0";
    alertsDiv.style.width = "0";
    alertsDiv.setAttribute("role", "alert");
  })();
  document.body.prepend(alertsDiv);
  Object.entries(ID_TO_INSTRUCTION).forEach(([id, txt]) => document.body.prepend(instructionToHiddenDiv(id, txt)));
}
function initAria() {
  if (isOnServer)
    return null;
  if (document.readyState === "complete") {
    initAriaOnBrowser();
  } else {
    window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
  }
  return { ...INSTRUCTION_IDs$1 };
}
function destroyAria() {
  if (isOnServer || !alertsDiv)
    return;
  Object.keys(ID_TO_INSTRUCTION).forEach((id) => {
    var _a;
    return (_a = document.getElementById(id)) == null ? void 0 : _a.remove();
  });
  alertsDiv.remove();
  alertsDiv = void 0;
}
function instructionToHiddenDiv(id, txt) {
  const div = document.createElement("div");
  div.id = id;
  div.innerHTML = `<p>${txt}</p>`;
  div.style.display = "none";
  div.style.position = "fixed";
  div.style.zIndex = "-5";
  return div;
}
function alertToScreenReader(txt) {
  if (isOnServer)
    return;
  if (!alertsDiv) {
    initAriaOnBrowser();
  }
  alertsDiv.innerHTML = "";
  const alertText = document.createTextNode(txt);
  alertsDiv.appendChild(alertText);
  alertsDiv.style.display = "none";
  alertsDiv.style.display = "inline";
}
const DEFAULT_DROP_ZONE_TYPE = "--any--";
const DEFAULT_DROP_TARGET_STYLE = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
let isDragging = false;
let draggedItemType;
let focusedDz;
let focusedDzLabel = "";
let focusedItem;
let focusedItemId;
let focusedItemLabel = "";
const allDragTargets = /* @__PURE__ */ new WeakSet();
const elToKeyDownListeners = /* @__PURE__ */ new WeakMap();
const elToFocusListeners = /* @__PURE__ */ new WeakMap();
const dzToHandles = /* @__PURE__ */ new Map();
const dzToConfig = /* @__PURE__ */ new Map();
const typeToDropZones = /* @__PURE__ */ new Map();
let INSTRUCTION_IDs;
function registerDropZone(dropZoneEl, type) {
  if (typeToDropZones.size === 0) {
    INSTRUCTION_IDs = initAria();
    window.addEventListener("keydown", globalKeyDownHandler);
    window.addEventListener("click", globalClickHandler);
  }
  if (!typeToDropZones.has(type)) {
    typeToDropZones.set(type, /* @__PURE__ */ new Set());
  }
  if (!typeToDropZones.get(type).has(dropZoneEl)) {
    typeToDropZones.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}
function unregisterDropZone(dropZoneEl, type) {
  if (focusedDz === dropZoneEl) {
    handleDrop();
  }
  typeToDropZones.get(type).delete(dropZoneEl);
  decrementActiveDropZoneCount();
  if (typeToDropZones.get(type).size === 0) {
    typeToDropZones.delete(type);
  }
  if (typeToDropZones.size === 0) {
    window.removeEventListener("keydown", globalKeyDownHandler);
    window.removeEventListener("click", globalClickHandler);
    INSTRUCTION_IDs = void 0;
    destroyAria();
  }
}
function globalKeyDownHandler(e) {
  if (!isDragging)
    return;
  switch (e.key) {
    case "Escape": {
      handleDrop();
      break;
    }
  }
}
function globalClickHandler() {
  if (!isDragging)
    return;
  if (!allDragTargets.has(document.activeElement)) {
    handleDrop();
  }
}
function handleZoneFocus(e) {
  if (!isDragging)
    return;
  const newlyFocusedDz = e.currentTarget;
  if (newlyFocusedDz === focusedDz)
    return;
  focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";
  const { items: originItems } = dzToConfig.get(focusedDz);
  const originItem = originItems.find((item) => item[ITEM_ID_KEY] === focusedItemId);
  const originIdx = originItems.indexOf(originItem);
  const itemToMove = originItems.splice(originIdx, 1)[0];
  const { items: targetItems, autoAriaDisabled } = dzToConfig.get(newlyFocusedDz);
  if (newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top || newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left) {
    targetItems.push(itemToMove);
    if (!autoAriaDisabled) {
      alertToScreenReader(`Moved item ${focusedItemLabel} to the end of the list ${focusedDzLabel}`);
    }
  } else {
    targetItems.unshift(itemToMove);
    if (!autoAriaDisabled) {
      alertToScreenReader(`Moved item ${focusedItemLabel} to the beginning of the list ${focusedDzLabel}`);
    }
  }
  const dzFrom = focusedDz;
  dispatchFinalizeEvent(dzFrom, originItems, { trigger: TRIGGERS.DROPPED_INTO_ANOTHER, id: focusedItemId, source: SOURCES.KEYBOARD });
  dispatchFinalizeEvent(newlyFocusedDz, targetItems, { trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD });
  focusedDz = newlyFocusedDz;
}
function triggerAllDzsUpdate() {
  dzToHandles.forEach(({ update }, dz) => update(dzToConfig.get(dz)));
}
function handleDrop(dispatchConsider = true) {
  if (!dzToConfig.get(focusedDz).autoAriaDisabled) {
    alertToScreenReader(`Stopped dragging item ${focusedItemLabel}`);
  }
  if (allDragTargets.has(document.activeElement)) {
    document.activeElement.blur();
  }
  if (dispatchConsider) {
    dispatchConsiderEvent(focusedDz, dzToConfig.get(focusedDz).items, {
      trigger: TRIGGERS.DRAG_STOPPED,
      id: focusedItemId,
      source: SOURCES.KEYBOARD
    });
  }
  styleInactiveDropZones(
    typeToDropZones.get(draggedItemType),
    (dz) => dzToConfig.get(dz).dropTargetStyle,
    (dz) => dzToConfig.get(dz).dropTargetClasses
  );
  focusedItem = null;
  focusedItemId = null;
  focusedItemLabel = "";
  draggedItemType = null;
  focusedDz = null;
  focusedDzLabel = "";
  isDragging = false;
  triggerAllDzsUpdate();
}
function dndzone$1(node, options) {
  const config = {
    items: void 0,
    type: void 0,
    dragDisabled: false,
    zoneTabIndex: 0,
    dropFromOthersDisabled: false,
    dropTargetStyle: DEFAULT_DROP_TARGET_STYLE,
    dropTargetClasses: [],
    autoAriaDisabled: false
  };
  function swap(arr, i, j) {
    if (arr.length <= 1)
      return;
    arr.splice(j, 1, arr.splice(i, 1, arr[j])[0]);
  }
  function handleKeyDown(e) {
    switch (e.key) {
      case "Enter":
      case " ": {
        if ((e.target.disabled !== void 0 || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (isDragging) {
          handleDrop();
        } else {
          handleDragStart(e);
        }
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (!isDragging)
          return;
        e.preventDefault();
        e.stopPropagation();
        const { items } = dzToConfig.get(node);
        const children2 = Array.from(node.children);
        const idx = children2.indexOf(e.currentTarget);
        if (idx < children2.length - 1) {
          if (!config.autoAriaDisabled) {
            alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx + 2} in the list ${focusedDzLabel}`);
          }
          swap(items, idx, idx + 1);
          dispatchFinalizeEvent(node, items, { trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD });
        }
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        if (!isDragging)
          return;
        e.preventDefault();
        e.stopPropagation();
        const { items } = dzToConfig.get(node);
        const children2 = Array.from(node.children);
        const idx = children2.indexOf(e.currentTarget);
        if (idx > 0) {
          if (!config.autoAriaDisabled) {
            alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx} in the list ${focusedDzLabel}`);
          }
          swap(items, idx, idx - 1);
          dispatchFinalizeEvent(node, items, { trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD });
        }
        break;
      }
    }
  }
  function handleDragStart(e) {
    setCurrentFocusedItem(e.currentTarget);
    focusedDz = node;
    draggedItemType = config.type;
    isDragging = true;
    const dropTargets = Array.from(typeToDropZones.get(config.type)).filter((dz) => dz === focusedDz || !dzToConfig.get(dz).dropFromOthersDisabled);
    styleActiveDropZones(
      dropTargets,
      (dz) => dzToConfig.get(dz).dropTargetStyle,
      (dz) => dzToConfig.get(dz).dropTargetClasses
    );
    if (!config.autoAriaDisabled) {
      let msg = `Started dragging item ${focusedItemLabel}. Use the arrow keys to move it within its list ${focusedDzLabel}`;
      if (dropTargets.length > 1) {
        msg += `, or tab to another list in order to move the item into it`;
      }
      alertToScreenReader(msg);
    }
    dispatchConsiderEvent(node, dzToConfig.get(node).items, { trigger: TRIGGERS.DRAG_STARTED, id: focusedItemId, source: SOURCES.KEYBOARD });
    triggerAllDzsUpdate();
  }
  function handleClick(e) {
    if (!isDragging)
      return;
    if (e.currentTarget === focusedItem)
      return;
    e.stopPropagation();
    handleDrop(false);
    handleDragStart(e);
  }
  function setCurrentFocusedItem(draggableEl) {
    const { items } = dzToConfig.get(node);
    const children2 = Array.from(node.children);
    const focusedItemIdx = children2.indexOf(draggableEl);
    focusedItem = draggableEl;
    focusedItem.tabIndex = 0;
    focusedItemId = items[focusedItemIdx][ITEM_ID_KEY];
    focusedItemLabel = children2[focusedItemIdx].getAttribute("aria-label") || "";
  }
  function configure({
    items = [],
    type: newType = DEFAULT_DROP_ZONE_TYPE,
    dragDisabled = false,
    zoneTabIndex = 0,
    dropFromOthersDisabled = false,
    dropTargetStyle = DEFAULT_DROP_TARGET_STYLE,
    dropTargetClasses = [],
    autoAriaDisabled = false
  }) {
    config.items = [...items];
    config.dragDisabled = dragDisabled;
    config.dropFromOthersDisabled = dropFromOthersDisabled;
    config.zoneTabIndex = zoneTabIndex;
    config.dropTargetStyle = dropTargetStyle;
    config.dropTargetClasses = dropTargetClasses;
    config.autoAriaDisabled = autoAriaDisabled;
    if (config.type && newType !== config.type) {
      unregisterDropZone(node, config.type);
    }
    config.type = newType;
    registerDropZone(node, newType);
    if (!autoAriaDisabled) {
      node.setAttribute("aria-disabled", dragDisabled);
      node.setAttribute("role", "list");
      node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs.DND_ZONE_ACTIVE);
    }
    dzToConfig.set(node, config);
    if (isDragging) {
      node.tabIndex = node === focusedDz || focusedItem.contains(node) || config.dropFromOthersDisabled || focusedDz && config.type !== dzToConfig.get(focusedDz).type ? -1 : 0;
    } else {
      node.tabIndex = config.zoneTabIndex;
    }
    node.addEventListener("focus", handleZoneFocus);
    for (let i = 0; i < node.children.length; i++) {
      const draggableEl = node.children[i];
      allDragTargets.add(draggableEl);
      draggableEl.tabIndex = isDragging ? -1 : 0;
      if (!autoAriaDisabled) {
        draggableEl.setAttribute("role", "listitem");
      }
      draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
      draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
      if (!dragDisabled) {
        draggableEl.addEventListener("keydown", handleKeyDown);
        elToKeyDownListeners.set(draggableEl, handleKeyDown);
        draggableEl.addEventListener("click", handleClick);
        elToFocusListeners.set(draggableEl, handleClick);
      }
      if (isDragging && config.items[i][ITEM_ID_KEY] === focusedItemId) {
        focusedItem = draggableEl;
        focusedItem.tabIndex = 0;
        draggableEl.focus();
      }
    }
  }
  configure(options);
  const handles = {
    update: (newOptions) => {
      configure(newOptions);
    },
    destroy: () => {
      unregisterDropZone(node, config.type);
      dzToConfig.delete(node);
      dzToHandles.delete(node);
    }
  };
  dzToHandles.set(node, handles);
  return handles;
}
function dndzone(node, options) {
  validateOptions(options);
  const pointerZone = dndzone$2(node, options);
  const keyboardZone = dndzone$1(node, options);
  return {
    update: (newOptions) => {
      validateOptions(newOptions);
      pointerZone.update(newOptions);
      keyboardZone.update(newOptions);
    },
    destroy: () => {
      pointerZone.destroy();
      keyboardZone.destroy();
    }
  };
}
function validateOptions(options) {
  const {
    items,
    flipDurationMs: flipDurationMs2,
    type,
    dragDisabled,
    morphDisabled,
    dropFromOthersDisabled,
    zoneTabIndex,
    dropTargetStyle,
    dropTargetClasses,
    transformDraggedElement,
    autoAriaDisabled,
    centreDraggedOnCursor,
    ...rest
  } = options;
  if (Object.keys(rest).length > 0) {
    console.warn(`dndzone will ignore unknown options`, rest);
  }
  if (!items) {
    throw new Error("no 'items' key provided to dndzone");
  }
  const itemWithMissingId = items.find((item) => !{}.hasOwnProperty.call(item, ITEM_ID_KEY));
  if (itemWithMissingId) {
    throw new Error(`missing '${ITEM_ID_KEY}' property for item ${toString(itemWithMissingId)}`);
  }
  if (dropTargetClasses && !Array.isArray(dropTargetClasses)) {
    throw new Error(`dropTargetClasses should be an array but instead it is a ${typeof dropTargetClasses}, ${toString(dropTargetClasses)}`);
  }
  if (zoneTabIndex && !isInt(zoneTabIndex)) {
    throw new Error(`zoneTabIndex should be a number but instead it is a ${typeof zoneTabIndex}, ${toString(zoneTabIndex)}`);
  }
}
function isInt(value) {
  return !isNaN(value) && function(x) {
    return (x | 0) === x;
  }(parseFloat(value));
}
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function get_each_context$7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[10] = list[i][0];
  child_ctx[11] = list[i][1];
  return child_ctx;
}
function create_dynamic_element(ctx) {
  let svelte_element;
  let svelte_element_levels = [
    /*attrs*/
    ctx[11]
  ];
  let svelte_element_data = {};
  for (let i = 0; i < svelte_element_levels.length; i += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  }
  return {
    c() {
      svelte_element = svg_element(
        /*tag*/
        ctx[10]
      );
      this.h();
    },
    l(nodes) {
      svelte_element = claim_svg_element(
        nodes,
        /*tag*/
        ctx[10],
        {}
      );
      children(svelte_element).forEach(detach);
      this.h();
    },
    h() {
      set_svg_attributes(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert_hydration(target, svelte_element, anchor);
    },
    p(ctx2, dirty) {
      set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*iconNode*/
      32 && /*attrs*/
      ctx2[11]]));
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
    }
  };
}
function create_each_block$7(ctx) {
  let previous_tag = (
    /*tag*/
    ctx[10]
  );
  let svelte_element_anchor;
  let svelte_element = (
    /*tag*/
    ctx[10] && create_dynamic_element(ctx)
  );
  return {
    c() {
      if (svelte_element)
        svelte_element.c();
      svelte_element_anchor = empty();
    },
    l(nodes) {
      if (svelte_element)
        svelte_element.l(nodes);
      svelte_element_anchor = empty();
    },
    m(target, anchor) {
      if (svelte_element)
        svelte_element.m(target, anchor);
      insert_hydration(target, svelte_element_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (
        /*tag*/
        ctx2[10]
      ) {
        if (!previous_tag) {
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*tag*/
          ctx2[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else if (safe_not_equal(
          previous_tag,
          /*tag*/
          ctx2[10]
        )) {
          svelte_element.d(1);
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*tag*/
          ctx2[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else {
          svelte_element.p(ctx2, dirty);
        }
      } else if (previous_tag) {
        svelte_element.d(1);
        svelte_element = null;
        previous_tag = /*tag*/
        ctx2[10];
      }
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element_anchor);
      }
      if (svelte_element)
        svelte_element.d(detaching);
    }
  };
}
function create_fragment$w(ctx) {
  let svg;
  let each_1_anchor;
  let svg_stroke_width_value;
  let svg_class_value;
  let current;
  let each_value = ensure_array_like(
    /*iconNode*/
    ctx[5]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
  }
  const default_slot_template = (
    /*#slots*/
    ctx[9].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[8],
    null
  );
  let svg_levels = [
    defaultAttributes,
    /*$$restProps*/
    ctx[6],
    { width: (
      /*size*/
      ctx[2]
    ) },
    { height: (
      /*size*/
      ctx[2]
    ) },
    { stroke: (
      /*color*/
      ctx[1]
    ) },
    {
      "stroke-width": svg_stroke_width_value = /*absoluteStrokeWidth*/
      ctx[4] ? Number(
        /*strokeWidth*/
        ctx[3]
      ) * 24 / Number(
        /*size*/
        ctx[2]
      ) : (
        /*strokeWidth*/
        ctx[3]
      )
    },
    {
      class: svg_class_value = `lucide-icon lucide lucide-${/*name*/
      ctx[0]} ${/*$$props*/
      ctx[7].class ?? ""}`
    }
  ];
  let svg_data = {};
  for (let i = 0; i < svg_levels.length; i += 1) {
    svg_data = assign(svg_data, svg_levels[i]);
  }
  return {
    c() {
      svg = svg_element("svg");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        width: true,
        height: true,
        stroke: true,
        "stroke-width": true,
        class: true
      });
      var svg_nodes = children(svg);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(svg_nodes);
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.l(svg_nodes);
      svg_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_svg_attributes(svg, svg_data);
    },
    m(target, anchor) {
      insert_hydration(target, svg, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(svg, null);
        }
      }
      append_hydration(svg, each_1_anchor);
      if (default_slot) {
        default_slot.m(svg, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*iconNode*/
      32) {
        each_value = ensure_array_like(
          /*iconNode*/
          ctx2[5]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$7(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$7(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(svg, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        256)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[8],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[8]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[8],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
        defaultAttributes,
        dirty & /*$$restProps*/
        64 && /*$$restProps*/
        ctx2[6],
        (!current || dirty & /*size*/
        4) && { width: (
          /*size*/
          ctx2[2]
        ) },
        (!current || dirty & /*size*/
        4) && { height: (
          /*size*/
          ctx2[2]
        ) },
        (!current || dirty & /*color*/
        2) && { stroke: (
          /*color*/
          ctx2[1]
        ) },
        (!current || dirty & /*absoluteStrokeWidth, strokeWidth, size*/
        28 && svg_stroke_width_value !== (svg_stroke_width_value = /*absoluteStrokeWidth*/
        ctx2[4] ? Number(
          /*strokeWidth*/
          ctx2[3]
        ) * 24 / Number(
          /*size*/
          ctx2[2]
        ) : (
          /*strokeWidth*/
          ctx2[3]
        ))) && { "stroke-width": svg_stroke_width_value },
        (!current || dirty & /*name, $$props*/
        129 && svg_class_value !== (svg_class_value = `lucide-icon lucide lucide-${/*name*/
        ctx2[0]} ${/*$$props*/
        ctx2[7].class ?? ""}`)) && { class: svg_class_value }
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      destroy_each(each_blocks, detaching);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$x($$self, $$props, $$invalidate) {
  const omit_props_names = ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { name } = $$props;
  let { color = "currentColor" } = $$props;
  let { size = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode } = $$props;
  $$self.$$set = ($$new_props) => {
    $$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("name" in $$new_props)
      $$invalidate(0, name = $$new_props.name);
    if ("color" in $$new_props)
      $$invalidate(1, color = $$new_props.color);
    if ("size" in $$new_props)
      $$invalidate(2, size = $$new_props.size);
    if ("strokeWidth" in $$new_props)
      $$invalidate(3, strokeWidth = $$new_props.strokeWidth);
    if ("absoluteStrokeWidth" in $$new_props)
      $$invalidate(4, absoluteStrokeWidth = $$new_props.absoluteStrokeWidth);
    if ("iconNode" in $$new_props)
      $$invalidate(5, iconNode = $$new_props.iconNode);
    if ("$$scope" in $$new_props)
      $$invalidate(8, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [
    name,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode,
    $$restProps,
    $$props,
    $$scope,
    slots
  ];
}
class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$x, create_fragment$w, safe_not_equal, {
      name: 0,
      color: 1,
      size: 2,
      strokeWidth: 3,
      absoluteStrokeWidth: 4,
      iconNode: 5
    });
  }
}
const Icon$1 = Icon;
function create_default_slot$h(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$v(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "arrow-left" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$h] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$w($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Arrow_left extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$w, create_fragment$v, safe_not_equal, {});
  }
}
const ArrowLeft = Arrow_left;
function create_default_slot$g(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$u(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "arrow-right" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$g] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$v($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Arrow_right extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$v, create_fragment$u, safe_not_equal, {});
  }
}
const ArrowRight = Arrow_right;
function create_default_slot$f(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$t(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "chevrons-down-up" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$f] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$u($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "m7 20 5-5 5 5" }], ["path", { "d": "m7 4 5 5 5-5" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Chevrons_down_up extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$u, create_fragment$t, safe_not_equal, {});
  }
}
const ChevronsDownUp = Chevrons_down_up;
function create_default_slot$e(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$s(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "chevrons-up-down" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$e] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$t($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "m7 15 5 5 5-5" }], ["path", { "d": "m7 9 5-5 5 5" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Chevrons_up_down extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$t, create_fragment$s, safe_not_equal, {});
  }
}
const ChevronsUpDown = Chevrons_up_down;
function create_default_slot$d(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$r(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "contact-2" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$d] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$s($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M16 18a4 4 0 0 0-8 0" }],
    ["circle", { "cx": "12", "cy": "11", "r": "3" }],
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "8",
        "y1": "2",
        "y2": "4"
      }
    ],
    [
      "line",
      {
        "x1": "16",
        "x2": "16",
        "y1": "2",
        "y2": "4"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Contact_2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$s, create_fragment$r, safe_not_equal, {});
  }
}
const Contact2 = Contact_2;
function create_default_slot$c(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$q(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "corner-down-left" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$c] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$r($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["polyline", { "points": "9 10 4 15 9 20" }],
    ["path", { "d": "M20 4v7a4 4 0 0 1-4 4H4" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Corner_down_left extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$r, create_fragment$q, safe_not_equal, {});
  }
}
const CornerDownLeft = Corner_down_left;
function create_default_slot$b(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$p(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "flask-conical" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$b] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$q($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"
      }
    ],
    ["path", { "d": "M8.5 2h7" }],
    ["path", { "d": "M7 16h10" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Flask_conical extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$q, create_fragment$p, safe_not_equal, {});
  }
}
const FlaskConical = Flask_conical;
function create_default_slot$a(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$o(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "flower" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$a] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$p($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }],
    ["path", { "d": "m8 16 1.5-1.5" }],
    ["path", { "d": "M14.5 9.5 16 8" }],
    ["path", { "d": "m8 8 1.5 1.5" }],
    ["path", { "d": "M14.5 14.5 16 16" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Flower extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$p, create_fragment$o, safe_not_equal, {});
  }
}
const Flower$1 = Flower;
function create_default_slot$9(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$n(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "info" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$9] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$o($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Info extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$o, create_fragment$n, safe_not_equal, {});
  }
}
const Info$1 = Info;
function create_default_slot$8(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$m(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "link" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$8] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$n($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      }
    ],
    [
      "path",
      {
        "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Link extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$n, create_fragment$m, safe_not_equal, {});
  }
}
const Link$1 = Link;
function create_default_slot$7(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$l(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "music" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$7] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$m($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M9 18V5l12-2v13" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    ["circle", { "cx": "18", "cy": "16", "r": "3" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Music extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$m, create_fragment$l, safe_not_equal, {});
  }
}
const Music$1 = Music;
function create_default_slot$6(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$k(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "pin-off" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$6] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$l($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "line",
      {
        "x1": "2",
        "x2": "22",
        "y1": "2",
        "y2": "22"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "17",
        "y2": "22"
      }
    ],
    [
      "path",
      {
        "d": "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12"
      }
    ],
    ["path", { "d": "M15 9.34V6h1a2 2 0 0 0 0-4H7.89" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Pin_off extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$l, create_fragment$k, safe_not_equal, {});
  }
}
const PinOff = Pin_off;
function create_default_slot$5(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$j(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "rocket" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$5] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
      }
    ],
    [
      "path",
      {
        "d": "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
      }
    ],
    [
      "path",
      {
        "d": "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
      }
    ],
    [
      "path",
      {
        "d": "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Rocket extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$j, safe_not_equal, {});
  }
}
const Rocket$1 = Rocket;
function create_default_slot$4(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$i(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "sigma" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$4] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "M18 7V4H6l6 8-6 8h12v-3" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Sigma extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$i, safe_not_equal, {});
  }
}
const Sigma$1 = Sigma;
function create_default_slot$3(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$h(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "train-track" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$3] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$i($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M2 17 17 2" }],
    ["path", { "d": "m2 14 8 8" }],
    ["path", { "d": "m5 11 8 8" }],
    ["path", { "d": "m8 8 8 8" }],
    ["path", { "d": "m11 5 8 8" }],
    ["path", { "d": "m14 2 8 8" }],
    ["path", { "d": "M7 22 22 7" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Train_track extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$h, safe_not_equal, {});
  }
}
const TrainTrack = Train_track;
function create_default_slot$2(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$g(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "trash-2" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      {
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      }
    ],
    [
      "path",
      {
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "10",
        "y1": "11",
        "y2": "17"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "11",
        "y2": "17"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Trash_2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$g, safe_not_equal, {});
  }
}
const Trash2 = Trash_2;
function create_default_slot$1(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$f(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "x" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class X extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$f, safe_not_equal, {});
  }
}
const X$1 = X;
function create_default_slot(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$e(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "zap" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "polygon",
      {
        "points": "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      }
    ]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Zap extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$e, safe_not_equal, {});
  }
}
const Zap$1 = Zap;
function mulberry32(a) {
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function courseColor(course) {
  if (!course)
    return;
  if (!course.code)
    return;
  let dept = course.dept;
  let deptInt = 0;
  for (let i = 0; i < dept.length; i++) {
    deptInt += dept.charCodeAt(i) * Math.pow(10, i);
  }
  deptInt += 10;
  let rand = mulberry32(deptInt) * 360;
  if (!(course == null ? void 0 : course.ms)) {
    return "background: linear-gradient(to right, hsl(" + rand + ", 100%, 35%), hsla(" + rand + ", 100%, 35%, .5))";
  }
  return "background: repeating-linear-gradient(45deg, hsl(" + rand + ", 50%, 35%), hsl(" + rand + ", 50%, 35%) 1em, hsl(" + rand + ", 50%, 30%) 1em, hsl(" + rand + ", 50%, 30%) 2em)";
}
function listOfCourseObjsIncludesCode(list, course) {
  if (list.map((c) => c.code).includes(course.code)) {
    return true;
  }
  return false;
}
function create_else_block$6(ctx) {
  let div;
  return {
    c() {
      div = element("div");
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      children(div).forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_7$1(ctx) {
  let sigma;
  let current;
  sigma = new Sigma$1({ props: { size: iconSize } });
  return {
    c() {
      create_component(sigma.$$.fragment);
    },
    l(nodes) {
      claim_component(sigma.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(sigma, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(sigma.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(sigma.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(sigma, detaching);
    }
  };
}
function create_if_block_6$2(ctx) {
  let traintrack;
  let current;
  traintrack = new TrainTrack({ props: { size: iconSize } });
  return {
    c() {
      create_component(traintrack.$$.fragment);
    },
    l(nodes) {
      claim_component(traintrack.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(traintrack, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(traintrack.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(traintrack.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(traintrack, detaching);
    }
  };
}
function create_if_block_5$2(ctx) {
  let zap;
  let current;
  zap = new Zap$1({ props: { size: iconSize } });
  return {
    c() {
      create_component(zap.$$.fragment);
    },
    l(nodes) {
      claim_component(zap.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(zap, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(zap.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(zap.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(zap, detaching);
    }
  };
}
function create_if_block_4$2(ctx) {
  let music;
  let current;
  music = new Music$1({ props: { size: iconSize } });
  return {
    c() {
      create_component(music.$$.fragment);
    },
    l(nodes) {
      claim_component(music.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(music, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(music.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(music.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(music, detaching);
    }
  };
}
function create_if_block_3$2(ctx) {
  let rocket;
  let current;
  rocket = new Rocket$1({ props: { size: smallerSize } });
  return {
    c() {
      create_component(rocket.$$.fragment);
    },
    l(nodes) {
      claim_component(rocket.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(rocket, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(rocket.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(rocket.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(rocket, detaching);
    }
  };
}
function create_if_block_2$6(ctx) {
  let contact2;
  let current;
  contact2 = new Contact2({ props: { size: smallerSize } });
  return {
    c() {
      create_component(contact2.$$.fragment);
    },
    l(nodes) {
      claim_component(contact2.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(contact2, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(contact2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(contact2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(contact2, detaching);
    }
  };
}
function create_if_block_1$8(ctx) {
  let flaskconical;
  let current;
  flaskconical = new FlaskConical({ props: { size: smallerSize } });
  return {
    c() {
      create_component(flaskconical.$$.fragment);
    },
    l(nodes) {
      claim_component(flaskconical.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(flaskconical, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(flaskconical.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(flaskconical.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(flaskconical, detaching);
    }
  };
}
function create_if_block$c(ctx) {
  let flower;
  let current;
  flower = new Flower$1({ props: { size: iconSize } });
  return {
    c() {
      create_component(flower.$$.fragment);
    },
    l(nodes) {
      claim_component(flower.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(flower, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(flower.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(flower.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(flower, detaching);
    }
  };
}
function create_fragment$d(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [
    create_if_block$c,
    create_if_block_1$8,
    create_if_block_2$6,
    create_if_block_3$2,
    create_if_block_4$2,
    create_if_block_5$2,
    create_if_block_6$2,
    create_if_block_7$1,
    create_else_block$6
  ];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*ways*/
      ctx2[0] == "AII"
    )
      return 0;
    if (
      /*ways*/
      ctx2[0] == "SMA"
    )
      return 1;
    if (
      /*ways*/
      ctx2[0] == "SI"
    )
      return 2;
    if (
      /*ways*/
      ctx2[0] == "AQR"
    )
      return 3;
    if (
      /*ways*/
      ctx2[0] == "CE"
    )
      return 4;
    if (
      /*ways*/
      ctx2[0] == "EDP"
    )
      return 5;
    if (
      /*ways*/
      ctx2[0] == "ER"
    )
      return 6;
    if (
      /*ways*/
      ctx2[0] == "FR"
    )
      return 7;
    return 8;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
let iconSize = "18";
let smallerSize = "18";
function instance$e($$self, $$props, $$invalidate) {
  let { ways = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("ways" in $$props2)
      $$invalidate(0, ways = $$props2.ways);
  };
  return [ways];
}
class WAYSIcons extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$d, safe_not_equal, { ways: 0 });
  }
}
const Course_svelte_svelte_type_style_lang = "";
function create_if_block_6$1(ctx) {
  let div2;
  let div0;
  let button0;
  let textContent = "Bump";
  let t1;
  let div1;
  let button1;
  let textContent_1 = "Reset";
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.textContent = textContent;
      t1 = space();
      div1 = element("div");
      button1 = element("button");
      button1.textContent = textContent_1;
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      button0 = claim_element(div0_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button0) !== "svelte-gqkr48")
        button0.textContent = textContent;
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      button1 = claim_element(div1_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button1) !== "svelte-xsuzg4")
        button1.textContent = textContent_1;
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button0, "class", "svelte-1hoshgp");
      attr(div0, "class", "checkboxContainer svelte-1hoshgp");
      attr(button1, "class", "svelte-1hoshgp");
      attr(div1, "class", "checkboxContainer svelte-1hoshgp");
      attr(div2, "class", "checkboxesContainer svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, button0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, button1);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*bump*/
            ctx[6]
          ),
          listen(
            button1,
            "click",
            /*resetBump*/
            ctx[7]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_5$1(ctx) {
  let div2;
  let div0;
  let input0;
  let t0;
  let t1;
  let div1;
  let input1;
  let t2;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      input0 = element("input");
      t0 = text("\n						MS");
      t1 = space();
      div1 = element("div");
      input1 = element("input");
      t2 = text("\n						C/SNC");
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      input0 = claim_element(div0_nodes, "INPUT", { type: true });
      t0 = claim_text(div0_nodes, "\n						MS");
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      input1 = claim_element(div1_nodes, "INPUT", { type: true });
      t2 = claim_text(div1_nodes, "\n						C/SNC");
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input0, "type", "checkbox");
      input0.checked = /*msChecked*/
      ctx[1];
      attr(div0, "class", "checkboxContainer svelte-1hoshgp");
      attr(input1, "type", "checkbox");
      input1.checked = /*csncChecked*/
      ctx[2];
      attr(div1, "class", "checkboxContainer svelte-1hoshgp");
      attr(div2, "class", "checkboxesContainer svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, input0);
      append_hydration(div0, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, input1);
      append_hydration(div1, t2);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "change",
            /*updateMs*/
            ctx[8]
          ),
          listen(
            input1,
            "change",
            /*updateSnc*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*msChecked*/
      2) {
        input0.checked = /*msChecked*/
        ctx2[1];
      }
      if (dirty & /*csncChecked*/
      4) {
        input1.checked = /*csncChecked*/
        ctx2[2];
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2$5(ctx) {
  let div;
  let t;
  let current_block_type_index;
  let if_block1;
  let current;
  let if_block0 = (
    /*course*/
    ctx[0].ways.length >= 1 && create_if_block_4$1(ctx)
  );
  const if_block_creators = [create_if_block_3$1, create_else_block$5];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*course*/
      ctx2[0].ways.length >= 2
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t = space();
      if_block1.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (if_block0)
        if_block0.l(div_nodes);
      t = claim_space(div_nodes);
      if_block1.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "ways svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append_hydration(div, t);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*course*/
        ctx2[0].ways.length >= 1
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*course*/
          1) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_4$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
    }
  };
}
function create_if_block_4$1(ctx) {
  let div;
  let waysicon;
  let div_class_value;
  let current;
  waysicon = new WAYSIcons({
    props: { ways: (
      /*course*/
      ctx[0].ways[0]
    ) }
  });
  return {
    c() {
      div = element("div");
      create_component(waysicon.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(waysicon.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = null_to_empty("ways1 " + /*course*/
      ctx[0].ways[0]) + " svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(waysicon, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const waysicon_changes = {};
      if (dirty & /*course*/
      1)
        waysicon_changes.ways = /*course*/
        ctx2[0].ways[0];
      waysicon.$set(waysicon_changes);
      if (!current || dirty & /*course*/
      1 && div_class_value !== (div_class_value = null_to_empty("ways1 " + /*course*/
      ctx2[0].ways[0]) + " svelte-1hoshgp")) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(waysicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(waysicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(waysicon);
    }
  };
}
function create_else_block$5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "ways2 svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_3$1(ctx) {
  let div;
  let waysicon;
  let div_class_value;
  let current;
  waysicon = new WAYSIcons({
    props: { ways: (
      /*course*/
      ctx[0].ways[1]
    ) }
  });
  return {
    c() {
      div = element("div");
      create_component(waysicon.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(waysicon.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = null_to_empty("ways2 " + /*course*/
      ctx[0].ways[1]) + " svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(waysicon, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const waysicon_changes = {};
      if (dirty & /*course*/
      1)
        waysicon_changes.ways = /*course*/
        ctx2[0].ways[1];
      waysicon.$set(waysicon_changes);
      if (!current || dirty & /*course*/
      1 && div_class_value !== (div_class_value = null_to_empty("ways2 " + /*course*/
      ctx2[0].ways[1]) + " svelte-1hoshgp")) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(waysicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(waysicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(waysicon);
    }
  };
}
function create_if_block_1$7(ctx) {
  let div2;
  let div0;
  let a0;
  let link0;
  let a0_href_value;
  let t;
  let div1;
  let a1;
  let link1;
  let a1_href_value;
  let current;
  link0 = new Link$1({ props: { size: linkSize$1 } });
  link1 = new Link$1({ props: { class: "icon", size: linkSize$1 } });
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      a0 = element("a");
      create_component(link0.$$.fragment);
      t = space();
      div1 = element("div");
      a1 = element("a");
      create_component(link1.$$.fragment);
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      a0 = claim_element(div0_nodes, "A", { href: true, target: true, class: true });
      var a0_nodes = children(a0);
      claim_component(link0.$$.fragment, a0_nodes);
      a0_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      a1 = claim_element(div1_nodes, "A", { href: true, target: true, class: true });
      var a1_nodes = children(a1);
      claim_component(link1.$$.fragment, a1_nodes);
      a1_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a0, "href", a0_href_value = 'https://explorecourses.stanford.edu/search?q="' + /*course*/
      ctx[0].code + '"');
      attr(a0, "target", "_blank");
      attr(a0, "class", "svelte-1hoshgp");
      attr(div0, "class", "classLink svelte-1hoshgp");
      attr(a1, "href", a1_href_value = /*course*/
      ctx[0].carta_link);
      attr(a1, "target", "_blank");
      attr(a1, "class", "svelte-1hoshgp");
      attr(div1, "class", "classLink svelte-1hoshgp");
      attr(div2, "class", "classLinks svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, a0);
      mount_component(link0, a0, null);
      append_hydration(div2, t);
      append_hydration(div2, div1);
      append_hydration(div1, a1);
      mount_component(link1, a1, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*course*/
      1 && a0_href_value !== (a0_href_value = 'https://explorecourses.stanford.edu/search?q="' + /*course*/
      ctx2[0].code + '"')) {
        attr(a0, "href", a0_href_value);
      }
      if (!current || dirty & /*course*/
      1 && a1_href_value !== (a1_href_value = /*course*/
      ctx2[0].carta_link)) {
        attr(a1, "href", a1_href_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(link0.$$.fragment, local);
      transition_in(link1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(link0.$$.fragment, local);
      transition_out(link1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(link0);
      destroy_component(link1);
    }
  };
}
function create_if_block$b(ctx) {
  let div2;
  let div0;
  let t0_value = (
    /*course*/
    (ctx[0].percent_outcomes_completed == -1 ? "" : (
      /*course*/
      ctx[0].percent_outcomes_completed
    )) + ""
  );
  let t0;
  let div0_style_value;
  let t1;
  let div1;
  let t2_value = (
    /*course*/
    (ctx[0].average_rating == -1 ? "" : (
      /*course*/
      ctx[0].average_rating
    )) + ""
  );
  let t2;
  let div1_style_value;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      t2 = text(t2_value);
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, t0_value);
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      var div1_nodes = children(div1);
      t2 = claim_text(div1_nodes, t2_value);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "percentCompleted svelte-1hoshgp");
      attr(div0, "style", div0_style_value = percentCompletedColor(
        /*course*/
        ctx[0].percent_outcomes_completed
      ));
      attr(div1, "class", "averageEval svelte-1hoshgp");
      attr(div1, "style", div1_style_value = averageEvalColor(
        /*course*/
        ctx[0].average_rating
      ));
      attr(div2, "class", "percentCompletedAndAverageEval svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1 && t0_value !== (t0_value = /*course*/
      (ctx2[0].percent_outcomes_completed == -1 ? "" : (
        /*course*/
        ctx2[0].percent_outcomes_completed
      )) + ""))
        set_data(t0, t0_value);
      if (dirty & /*course*/
      1 && div0_style_value !== (div0_style_value = percentCompletedColor(
        /*course*/
        ctx2[0].percent_outcomes_completed
      ))) {
        attr(div0, "style", div0_style_value);
      }
      if (dirty & /*course*/
      1 && t2_value !== (t2_value = /*course*/
      (ctx2[0].average_rating == -1 ? "" : (
        /*course*/
        ctx2[0].average_rating
      )) + ""))
        set_data(t2, t2_value);
      if (dirty & /*course*/
      1 && div1_style_value !== (div1_style_value = averageEvalColor(
        /*course*/
        ctx2[0].average_rating
      ))) {
        attr(div1, "style", div1_style_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
    }
  };
}
function create_fragment$c(ctx) {
  let button;
  let div5;
  let div1;
  let t0;
  let t1;
  let div0;
  let span0;
  let t2_value = (
    /*course*/
    ctx[0].code + ""
  );
  let t2;
  let t3;
  let span1;
  let t4_value = (
    /*course*/
    ctx[0].short_title + ""
  );
  let t4;
  let t5;
  let div4;
  let t6;
  let t7;
  let t8;
  let div2;
  let t9_value = (
    /*course*/
    (ctx[0].int_hours == -1 ? 0 : (
      /*course*/
      ctx[0].int_hours
    )) + ""
  );
  let t9;
  let t10;
  let div3;
  let t11_value = (
    /*course*/
    ctx[0].units_taking + ""
  );
  let t11;
  let div5_style_value;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*$prefs*/
    ctx[5].courseTableData["Bump button"] && create_if_block_6$1(ctx)
  );
  let if_block1 = (
    /*$prefs*/
    ctx[5].courseTableData["Checkboxes"] && create_if_block_5$1(ctx)
  );
  let if_block2 = (
    /*$prefs*/
    ctx[5].courseTableData["WAYS"] && create_if_block_2$5(ctx)
  );
  let if_block3 = (
    /*$prefs*/
    ctx[5].courseTableData["Links"] && create_if_block_1$7(ctx)
  );
  let if_block4 = (
    /*$prefs*/
    ctx[5].courseTableData["Percent completed & eval"] && create_if_block$b(ctx)
  );
  return {
    c() {
      button = element("button");
      div5 = element("div");
      div1 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      div0 = element("div");
      span0 = element("span");
      t2 = text(t2_value);
      t3 = space();
      span1 = element("span");
      t4 = text(t4_value);
      t5 = space();
      div4 = element("div");
      if (if_block2)
        if_block2.c();
      t6 = space();
      if (if_block3)
        if_block3.c();
      t7 = space();
      if (if_block4)
        if_block4.c();
      t8 = space();
      div2 = element("div");
      t9 = text(t9_value);
      t10 = space();
      div3 = element("div");
      t11 = text(t11_value);
      this.h();
    },
    l(nodes) {
      button = claim_element(nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      div5 = claim_element(button_nodes, "DIV", { class: true, style: true });
      var div5_nodes = children(div5);
      div1 = claim_element(div5_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      if (if_block0)
        if_block0.l(div1_nodes);
      t0 = claim_space(div1_nodes);
      if (if_block1)
        if_block1.l(div1_nodes);
      t1 = claim_space(div1_nodes);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      span0 = claim_element(div0_nodes, "SPAN", { class: true });
      var span0_nodes = children(span0);
      t2 = claim_text(span0_nodes, t2_value);
      span0_nodes.forEach(detach);
      t3 = claim_space(div0_nodes);
      span1 = claim_element(div0_nodes, "SPAN", { class: true });
      var span1_nodes = children(span1);
      t4 = claim_text(span1_nodes, t4_value);
      span1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t5 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      if (if_block2)
        if_block2.l(div4_nodes);
      t6 = claim_space(div4_nodes);
      if (if_block3)
        if_block3.l(div4_nodes);
      t7 = claim_space(div4_nodes);
      if (if_block4)
        if_block4.l(div4_nodes);
      t8 = claim_space(div4_nodes);
      div2 = claim_element(div4_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      t9 = claim_text(div2_nodes, t9_value);
      div2_nodes.forEach(detach);
      t10 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      t11 = claim_text(div3_nodes, t11_value);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      button_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(span0, "class", "classCode svelte-1hoshgp");
      attr(span1, "class", "className svelte-1hoshgp");
      attr(div0, "class", "classCodeSpanContainer svelte-1hoshgp");
      attr(div1, "class", "leftSide svelte-1hoshgp");
      attr(div2, "class", "classHours svelte-1hoshgp");
      attr(div3, "class", "classUnits svelte-1hoshgp");
      attr(div4, "class", "rightSide svelte-1hoshgp");
      attr(div5, "class", "coverUpButton svelte-1hoshgp");
      attr(div5, "style", div5_style_value = courseColor(
        /*course*/
        ctx[0]
      ));
      attr(button, "class", "section svelte-1hoshgp");
    },
    m(target, anchor) {
      insert_hydration(target, button, anchor);
      append_hydration(button, div5);
      append_hydration(div5, div1);
      if (if_block0)
        if_block0.m(div1, null);
      append_hydration(div1, t0);
      if (if_block1)
        if_block1.m(div1, null);
      append_hydration(div1, t1);
      append_hydration(div1, div0);
      append_hydration(div0, span0);
      append_hydration(span0, t2);
      append_hydration(div0, t3);
      append_hydration(div0, span1);
      append_hydration(span1, t4);
      append_hydration(div5, t5);
      append_hydration(div5, div4);
      if (if_block2)
        if_block2.m(div4, null);
      append_hydration(div4, t6);
      if (if_block3)
        if_block3.m(div4, null);
      append_hydration(div4, t7);
      if (if_block4)
        if_block4.m(div4, null);
      append_hydration(div4, t8);
      append_hydration(div4, div2);
      append_hydration(div2, t9);
      append_hydration(div4, t10);
      append_hydration(div4, div3);
      append_hydration(div3, t11);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button,
            "mouseenter",
            /*mouseenter_handler*/
            ctx[10]
          ),
          listen(
            button,
            "click",
            /*click_handler*/
            ctx[11]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*$prefs*/
        ctx2[5].courseTableData["Bump button"]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_6$1(ctx2);
          if_block0.c();
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*$prefs*/
        ctx2[5].courseTableData["Checkboxes"]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_5$1(ctx2);
          if_block1.c();
          if_block1.m(div1, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if ((!current || dirty & /*course*/
      1) && t2_value !== (t2_value = /*course*/
      ctx2[0].code + ""))
        set_data(t2, t2_value);
      if ((!current || dirty & /*course*/
      1) && t4_value !== (t4_value = /*course*/
      ctx2[0].short_title + ""))
        set_data(t4, t4_value);
      if (
        /*$prefs*/
        ctx2[5].courseTableData["WAYS"]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & /*$prefs*/
          32) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_2$5(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div4, t6);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (
        /*$prefs*/
        ctx2[5].courseTableData["Links"]
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty & /*$prefs*/
          32) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_1$7(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(div4, t7);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      if (
        /*$prefs*/
        ctx2[5].courseTableData["Percent completed & eval"]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
        } else {
          if_block4 = create_if_block$b(ctx2);
          if_block4.c();
          if_block4.m(div4, t8);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
      if ((!current || dirty & /*course*/
      1) && t9_value !== (t9_value = /*course*/
      (ctx2[0].int_hours == -1 ? 0 : (
        /*course*/
        ctx2[0].int_hours
      )) + ""))
        set_data(t9, t9_value);
      if ((!current || dirty & /*course*/
      1) && t11_value !== (t11_value = /*course*/
      ctx2[0].units_taking + ""))
        set_data(t11, t11_value);
      if (!current || dirty & /*course*/
      1 && div5_style_value !== (div5_style_value = courseColor(
        /*course*/
        ctx2[0]
      ))) {
        attr(div5, "style", div5_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block2);
      transition_in(if_block3);
      current = true;
    },
    o(local) {
      transition_out(if_block2);
      transition_out(if_block3);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
let linkSize$1 = "14";
function averageEvalColor(averageEval) {
  if (averageEval == -1) {
    return "";
  }
  let hue = 0;
  if (averageEval > 3) {
    hue = (averageEval - 3) / 2 * 120;
  }
  return "background-color: hsl(" + hue + ", 100%, 50%)";
}
function percentCompletedColor(percentCompleted) {
  if (percentCompleted == -1) {
    return "";
  }
  let hue = 0;
  if (percentCompleted > 50) {
    hue = (percentCompleted - 50) / 50 * 120;
  }
  return "background-color: hsl(" + hue + ", 100%, 50%)";
}
function instance$d($$self, $$props, $$invalidate) {
  let $courseTable;
  let $selectedCoursePinned;
  let $selectedCourse;
  let $prefs;
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(12, $courseTable = $$value));
  component_subscribe($$self, selectedCoursePinned, ($$value) => $$invalidate(3, $selectedCoursePinned = $$value));
  component_subscribe($$self, selectedCourse, ($$value) => $$invalidate(4, $selectedCourse = $$value));
  component_subscribe($$self, prefs, ($$value) => $$invalidate(5, $prefs = $$value));
  let { course = {} } = $$props;
  let msChecked = false;
  let csncChecked = false;
  function updateCourseById(id, property, newValue) {
    for (let i = 0; i < $courseTable.length; i++) {
      for (let j = 0; j < $courseTable[i].quarters.length; j++) {
        for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
          if ($courseTable[i].quarters[j].courses[k].id == id) {
            set_store_value(courseTable, $courseTable[i].quarters[j].courses[k][property] = newValue, $courseTable);
            return;
          }
        }
      }
    }
  }
  function bump() {
    updateCourseById(course.id, "bump", course.bump + 1);
  }
  function resetBump() {
    updateCourseById(course.id, "bump", 0);
  }
  function updateMs(e) {
    $$invalidate(1, msChecked = e.target.checked);
    updateCourseById(course.id, "ms", msChecked);
  }
  function updateSnc(e) {
    $$invalidate(2, csncChecked = e.target.checked);
    updateCourseById(course.id, "csnc", csncChecked);
  }
  const mouseenter_handler = () => {
    if (!$selectedCoursePinned) {
      set_store_value(selectedCourse, $selectedCourse = course, $selectedCourse);
    }
  };
  const click_handler = () => {
    set_store_value(selectedCourse, $selectedCourse = course, $selectedCourse);
    set_store_value(selectedCoursePinned, $selectedCoursePinned = true, $selectedCoursePinned);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  $$self.$$set = ($$props2) => {
    if ("course" in $$props2)
      $$invalidate(0, course = $$props2.course);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*msChecked, course, csncChecked*/
    7) {
      {
        if (msChecked != course.ms) {
          $$invalidate(1, msChecked = course.ms);
        }
        if (csncChecked != course.csnc) {
          $$invalidate(2, csncChecked = course.csnc);
        }
      }
    }
  };
  return [
    course,
    msChecked,
    csncChecked,
    $selectedCoursePinned,
    $selectedCourse,
    $prefs,
    bump,
    resetBump,
    updateMs,
    updateSnc,
    mouseenter_handler,
    click_handler
  ];
}
class Course extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$c, safe_not_equal, { course: 0 });
  }
}
const Search_svelte_svelte_type_style_lang = "";
function get_each_context$6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[43] = list[i];
  return child_ctx;
}
function get_each_context_1$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[46] = list[i];
  return child_ctx;
}
function get_each_context_2$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[49] = list[i];
  child_ctx[50] = list;
  child_ctx[51] = i;
  return child_ctx;
}
function get_each_context_3$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[49] = list[i];
  child_ctx[52] = list;
  child_ctx[53] = i;
  return child_ctx;
}
function get_each_context_4$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[54] = list[i];
  child_ctx[55] = list;
  child_ctx[56] = i;
  return child_ctx;
}
function get_each_context_5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[57] = list[i];
  child_ctx[58] = list;
  child_ctx[59] = i;
  return child_ctx;
}
function get_each_context_6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[60] = list[i];
  child_ctx[61] = list;
  child_ctx[62] = i;
  return child_ctx;
}
function get_each_context_7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[43] = list[i];
  child_ctx[63] = list;
  child_ctx[64] = i;
  return child_ctx;
}
function create_if_block_1$6(ctx) {
  let div34;
  let div0;
  let t0;
  let select0;
  let option0;
  let textContent = "Alphabetical";
  let option1;
  let textContent_1 = "Units";
  let option2;
  let textContent_2 = "Hours";
  let option3;
  let textContent_3 = "Eval";
  let option4;
  let textContent_4 = "% Completed";
  let t6;
  let select1;
  let option5;
  let textContent_5 = "Ascending";
  let option6;
  let textContent_6 = "Descending";
  let t9;
  let div1;
  let t10;
  let div9;
  let button0;
  let textContent_7 = "Reset all filter settings";
  let t12;
  let div2;
  let input0;
  let t13;
  let label0;
  let textContent_8 = "Hide courses already added to planner";
  let t15;
  let div3;
  let input1;
  let t16;
  let label1;
  let textContent_9 = "Hide courses not offered";
  let t18;
  let div8;
  let div4;
  let textContent_10 = "Match type settings";
  let t20;
  let div5;
  let textContent_11 = "Search bar speed is proportional to these numbers";
  let t22;
  let div7;
  let div6;
  let t23;
  let div10;
  let t24;
  let div28;
  let div18;
  let button1;
  let textContent_12 = "Clear filters";
  let t26;
  let div17;
  let div13;
  let div11;
  let textContent_13 = "Units";
  let t28;
  let div12;
  let t29;
  let div16;
  let div14;
  let textContent_14 = "WAYS";
  let t31;
  let div15;
  let t32;
  let div27;
  let div19;
  let textContent_15 = "Hours";
  let t34;
  let div20;
  let t35;
  let input2;
  let t36;
  let input3;
  let t37;
  let div21;
  let textContent_16 = "Average Eval";
  let t39;
  let div22;
  let t40;
  let input4;
  let t41;
  let input5;
  let t42;
  let div23;
  let textContent_17 = "Percent Completed";
  let t44;
  let div24;
  let t45;
  let input6;
  let t46;
  let input7;
  let t47;
  let div25;
  let textContent_18 = "Quarters Offered";
  let t49;
  let div26;
  let t50;
  let div29;
  let t51;
  let div33;
  let div32;
  let button2;
  let textContent_19 = "Clear filters";
  let t53;
  let div30;
  let textContent_20 = "Degree requirements";
  let t55;
  let div31;
  let t56;
  let t57;
  let div35;
  let input8;
  let t58;
  let button3;
  let textContent_21 = "Filters";
  let mounted;
  let dispose;
  let each_value_7 = ensure_array_like(
    /*$resultCategories*/
    ctx[3]
  );
  let each_blocks_5 = [];
  for (let i = 0; i < each_value_7.length; i += 1) {
    each_blocks_5[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
  }
  let each_value_6 = ensure_array_like(Object.keys(
    /*$searchFilters*/
    ctx[1].units
  ));
  let each_blocks_4 = [];
  for (let i = 0; i < each_value_6.length; i += 1) {
    each_blocks_4[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
  }
  let each_value_5 = ensure_array_like(Object.keys(
    /*$searchFilters*/
    ctx[1].WAYS
  ));
  let each_blocks_3 = [];
  for (let i = 0; i < each_value_5.length; i += 1) {
    each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
  }
  let each_value_4 = ensure_array_like(Object.keys(
    /*$searchFilters*/
    ctx[1].QuartersOffered
  ));
  let each_blocks_2 = [];
  for (let i = 0; i < each_value_4.length; i += 1) {
    each_blocks_2[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
  }
  let each_value_3 = ensure_array_like(Object.keys(
    /*$searchFilters*/
    ctx[1].degreeSpecific.checkboxes
  ));
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_1[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
  }
  let each_value_2 = ensure_array_like(Object.keys(
    /*$searchFilters*/
    ctx[1].degreeSpecificMs.checkboxes
  ));
  let each_blocks = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
  }
  return {
    c() {
      div34 = element("div");
      div0 = element("div");
      t0 = text("Sort by\n				");
      select0 = element("select");
      option0 = element("option");
      option0.textContent = textContent;
      option1 = element("option");
      option1.textContent = textContent_1;
      option2 = element("option");
      option2.textContent = textContent_2;
      option3 = element("option");
      option3.textContent = textContent_3;
      option4 = element("option");
      option4.textContent = textContent_4;
      t6 = space();
      select1 = element("select");
      option5 = element("option");
      option5.textContent = textContent_5;
      option6 = element("option");
      option6.textContent = textContent_6;
      t9 = space();
      div1 = element("div");
      t10 = space();
      div9 = element("div");
      button0 = element("button");
      button0.textContent = textContent_7;
      t12 = space();
      div2 = element("div");
      input0 = element("input");
      t13 = space();
      label0 = element("label");
      label0.textContent = textContent_8;
      t15 = space();
      div3 = element("div");
      input1 = element("input");
      t16 = space();
      label1 = element("label");
      label1.textContent = textContent_9;
      t18 = space();
      div8 = element("div");
      div4 = element("div");
      div4.textContent = textContent_10;
      t20 = space();
      div5 = element("div");
      div5.textContent = textContent_11;
      t22 = space();
      div7 = element("div");
      div6 = element("div");
      for (let i = 0; i < each_blocks_5.length; i += 1) {
        each_blocks_5[i].c();
      }
      t23 = space();
      div10 = element("div");
      t24 = space();
      div28 = element("div");
      div18 = element("div");
      button1 = element("button");
      button1.textContent = textContent_12;
      t26 = space();
      div17 = element("div");
      div13 = element("div");
      div11 = element("div");
      div11.textContent = textContent_13;
      t28 = space();
      div12 = element("div");
      for (let i = 0; i < each_blocks_4.length; i += 1) {
        each_blocks_4[i].c();
      }
      t29 = space();
      div16 = element("div");
      div14 = element("div");
      div14.textContent = textContent_14;
      t31 = space();
      div15 = element("div");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t32 = space();
      div27 = element("div");
      div19 = element("div");
      div19.textContent = textContent_15;
      t34 = space();
      div20 = element("div");
      t35 = text("Min:\n						");
      input2 = element("input");
      t36 = text("\n						Max:\n						");
      input3 = element("input");
      t37 = space();
      div21 = element("div");
      div21.textContent = textContent_16;
      t39 = space();
      div22 = element("div");
      t40 = text("Min:\n						");
      input4 = element("input");
      t41 = text("\n						Max:\n						");
      input5 = element("input");
      t42 = space();
      div23 = element("div");
      div23.textContent = textContent_17;
      t44 = space();
      div24 = element("div");
      t45 = text("Min:\n						");
      input6 = element("input");
      t46 = text("\n						Max:\n						");
      input7 = element("input");
      t47 = space();
      div25 = element("div");
      div25.textContent = textContent_18;
      t49 = space();
      div26 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t50 = space();
      div29 = element("div");
      t51 = space();
      div33 = element("div");
      div32 = element("div");
      button2 = element("button");
      button2.textContent = textContent_19;
      t53 = space();
      div30 = element("div");
      div30.textContent = textContent_20;
      t55 = space();
      div31 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t56 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t57 = space();
      div35 = element("div");
      input8 = element("input");
      t58 = space();
      button3 = element("button");
      button3.textContent = textContent_21;
      this.h();
    },
    l(nodes) {
      div34 = claim_element(nodes, "DIV", { class: true });
      var div34_nodes = children(div34);
      div0 = claim_element(div34_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, "Sort by\n				");
      select0 = claim_element(div0_nodes, "SELECT", { name: true, id: true, class: true });
      var select0_nodes = children(select0);
      option0 = claim_element(select0_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option0) !== "svelte-xif9qq")
        option0.textContent = textContent;
      option1 = claim_element(select0_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option1) !== "svelte-3toipc")
        option1.textContent = textContent_1;
      option2 = claim_element(select0_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option2) !== "svelte-sghj74")
        option2.textContent = textContent_2;
      option3 = claim_element(select0_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option3) !== "svelte-1e7vzt2")
        option3.textContent = textContent_3;
      option4 = claim_element(select0_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option4) !== "svelte-108oz7w")
        option4.textContent = textContent_4;
      select0_nodes.forEach(detach);
      t6 = claim_space(div0_nodes);
      select1 = claim_element(div0_nodes, "SELECT", { name: true, id: true, class: true });
      var select1_nodes = children(select1);
      option5 = claim_element(select1_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option5) !== "svelte-1s5m8da")
        option5.textContent = textContent_5;
      option6 = claim_element(select1_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option6) !== "svelte-uln4oe")
        option6.textContent = textContent_6;
      select1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t9 = claim_space(div34_nodes);
      div1 = claim_element(div34_nodes, "DIV", { class: true });
      children(div1).forEach(detach);
      t10 = claim_space(div34_nodes);
      div9 = claim_element(div34_nodes, "DIV", { class: true });
      var div9_nodes = children(div9);
      button0 = claim_element(div9_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button0) !== "svelte-uk1bs")
        button0.textContent = textContent_7;
      t12 = claim_space(div9_nodes);
      div2 = claim_element(div9_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      input0 = claim_element(div2_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t13 = claim_space(div2_nodes);
      label0 = claim_element(div2_nodes, "LABEL", { for: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(label0) !== "svelte-1bdvpx7")
        label0.textContent = textContent_8;
      div2_nodes.forEach(detach);
      t15 = claim_space(div9_nodes);
      div3 = claim_element(div9_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      input1 = claim_element(div3_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t16 = claim_space(div3_nodes);
      label1 = claim_element(div3_nodes, "LABEL", { for: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(label1) !== "svelte-1q8a1se")
        label1.textContent = textContent_9;
      div3_nodes.forEach(detach);
      t18 = claim_space(div9_nodes);
      div8 = claim_element(div9_nodes, "DIV", { class: true });
      var div8_nodes = children(div8);
      div4 = claim_element(div8_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div4) !== "svelte-11ktrg9")
        div4.textContent = textContent_10;
      t20 = claim_space(div8_nodes);
      div5 = claim_element(div8_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div5) !== "svelte-1jy9hw6")
        div5.textContent = textContent_11;
      t22 = claim_space(div8_nodes);
      div7 = claim_element(div8_nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      div6 = claim_element(div7_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      for (let i = 0; i < each_blocks_5.length; i += 1) {
        each_blocks_5[i].l(div6_nodes);
      }
      div6_nodes.forEach(detach);
      div7_nodes.forEach(detach);
      div8_nodes.forEach(detach);
      div9_nodes.forEach(detach);
      t23 = claim_space(div34_nodes);
      div10 = claim_element(div34_nodes, "DIV", { class: true });
      children(div10).forEach(detach);
      t24 = claim_space(div34_nodes);
      div28 = claim_element(div34_nodes, "DIV", { class: true });
      var div28_nodes = children(div28);
      div18 = claim_element(div28_nodes, "DIV", { class: true });
      var div18_nodes = children(div18);
      button1 = claim_element(div18_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button1) !== "svelte-1i2r97a")
        button1.textContent = textContent_12;
      t26 = claim_space(div18_nodes);
      div17 = claim_element(div18_nodes, "DIV", { class: true });
      var div17_nodes = children(div17);
      div13 = claim_element(div17_nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      div11 = claim_element(div13_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div11) !== "svelte-z1gikm")
        div11.textContent = textContent_13;
      t28 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      for (let i = 0; i < each_blocks_4.length; i += 1) {
        each_blocks_4[i].l(div12_nodes);
      }
      div12_nodes.forEach(detach);
      div13_nodes.forEach(detach);
      t29 = claim_space(div17_nodes);
      div16 = claim_element(div17_nodes, "DIV", { class: true });
      var div16_nodes = children(div16);
      div14 = claim_element(div16_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div14) !== "svelte-1qomjr3")
        div14.textContent = textContent_14;
      t31 = claim_space(div16_nodes);
      div15 = claim_element(div16_nodes, "DIV", { class: true });
      var div15_nodes = children(div15);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].l(div15_nodes);
      }
      div15_nodes.forEach(detach);
      div16_nodes.forEach(detach);
      div17_nodes.forEach(detach);
      div18_nodes.forEach(detach);
      t32 = claim_space(div28_nodes);
      div27 = claim_element(div28_nodes, "DIV", { class: true });
      var div27_nodes = children(div27);
      div19 = claim_element(div27_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div19) !== "svelte-duw9wq")
        div19.textContent = textContent_15;
      t34 = claim_space(div27_nodes);
      div20 = claim_element(div27_nodes, "DIV", { class: true });
      var div20_nodes = children(div20);
      t35 = claim_text(div20_nodes, "Min:\n						");
      input2 = claim_element(div20_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      t36 = claim_text(div20_nodes, "\n						Max:\n						");
      input3 = claim_element(div20_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      div20_nodes.forEach(detach);
      t37 = claim_space(div27_nodes);
      div21 = claim_element(div27_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div21) !== "svelte-1hsioty")
        div21.textContent = textContent_16;
      t39 = claim_space(div27_nodes);
      div22 = claim_element(div27_nodes, "DIV", { class: true });
      var div22_nodes = children(div22);
      t40 = claim_text(div22_nodes, "Min:\n						");
      input4 = claim_element(div22_nodes, "INPUT", {
        type: true,
        step: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      t41 = claim_text(div22_nodes, "\n						Max:\n						");
      input5 = claim_element(div22_nodes, "INPUT", {
        type: true,
        step: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      div22_nodes.forEach(detach);
      t42 = claim_space(div27_nodes);
      div23 = claim_element(div27_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div23) !== "svelte-1qpj3gp")
        div23.textContent = textContent_17;
      t44 = claim_space(div27_nodes);
      div24 = claim_element(div27_nodes, "DIV", { class: true });
      var div24_nodes = children(div24);
      t45 = claim_text(div24_nodes, "Min:\n						");
      input6 = claim_element(div24_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      t46 = claim_text(div24_nodes, "\n						Max:\n						");
      input7 = claim_element(div24_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        placeholder: true,
        class: true
      });
      div24_nodes.forEach(detach);
      t47 = claim_space(div27_nodes);
      div25 = claim_element(div27_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div25) !== "svelte-ekgbdt")
        div25.textContent = textContent_18;
      t49 = claim_space(div27_nodes);
      div26 = claim_element(div27_nodes, "DIV", { class: true });
      var div26_nodes = children(div26);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].l(div26_nodes);
      }
      div26_nodes.forEach(detach);
      div27_nodes.forEach(detach);
      div28_nodes.forEach(detach);
      t50 = claim_space(div34_nodes);
      div29 = claim_element(div34_nodes, "DIV", { class: true });
      children(div29).forEach(detach);
      t51 = claim_space(div34_nodes);
      div33 = claim_element(div34_nodes, "DIV", { class: true });
      var div33_nodes = children(div33);
      div32 = claim_element(div33_nodes, "DIV", { class: true });
      var div32_nodes = children(div32);
      button2 = claim_element(div32_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button2) !== "svelte-1nk1c89")
        button2.textContent = textContent_19;
      t53 = claim_space(div32_nodes);
      div30 = claim_element(div32_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div30) !== "svelte-21c3x5")
        div30.textContent = textContent_20;
      t55 = claim_space(div32_nodes);
      div31 = claim_element(div32_nodes, "DIV", { class: true });
      var div31_nodes = children(div31);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].l(div31_nodes);
      }
      t56 = claim_space(div31_nodes);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div31_nodes);
      }
      div31_nodes.forEach(detach);
      div32_nodes.forEach(detach);
      div33_nodes.forEach(detach);
      div34_nodes.forEach(detach);
      t57 = claim_space(nodes);
      div35 = claim_element(nodes, "DIV", { class: true });
      var div35_nodes = children(div35);
      input8 = claim_element(div35_nodes, "INPUT", {
        type: true,
        placeholder: true,
        class: true
      });
      t58 = claim_space(div35_nodes);
      button3 = claim_element(div35_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button3) !== "svelte-1e6i8f4")
        button3.textContent = textContent_21;
      div35_nodes.forEach(detach);
      this.h();
    },
    h() {
      option0.__value = "alphabetical";
      set_input_value(option0, option0.__value);
      option1.__value = "units";
      set_input_value(option1, option1.__value);
      option2.__value = "hours";
      set_input_value(option2, option2.__value);
      option3.__value = "eval";
      set_input_value(option3, option3.__value);
      option4.__value = "percentCompleted";
      set_input_value(option4, option4.__value);
      attr(select0, "name", "sortBy");
      attr(select0, "id", "sortBy");
      attr(select0, "class", "svelte-qaoubl");
      if (
        /*$searchFilters*/
        ctx[1].sortBy === void 0
      )
        add_render_callback(() => (
          /*select0_change_handler*/
          ctx[12].call(select0)
        ));
      option5.__value = "ascending";
      set_input_value(option5, option5.__value);
      option6.__value = "descending";
      set_input_value(option6, option6.__value);
      attr(select1, "name", "sortOrder");
      attr(select1, "id", "sortOrder");
      attr(select1, "class", "svelte-qaoubl");
      if (
        /*$searchFilters*/
        ctx[1].sortOrder === void 0
      )
        add_render_callback(() => (
          /*select1_change_handler*/
          ctx[13].call(select1)
        ));
      attr(div0, "class", "filter sortFilter svelte-qaoubl");
      attr(div1, "class", "horizontalLine svelte-qaoubl");
      attr(button0, "class", "clearFilterButton svelte-qaoubl");
      attr(input0, "type", "checkbox");
      attr(input0, "id", "filterGridCourses");
      attr(input0, "name", "filterGridCourses");
      attr(input0, "class", "svelte-qaoubl");
      attr(label0, "for", "filterGridCourses");
      attr(div2, "class", "option leftAlign svelte-qaoubl");
      attr(input1, "type", "checkbox");
      attr(input1, "id", "filterGridCourses");
      attr(input1, "name", "filterGridCourses");
      attr(input1, "class", "svelte-qaoubl");
      attr(label1, "for", "filterGridCourses");
      attr(div3, "class", "option leftAlign svelte-qaoubl");
      attr(div4, "class", "title svelte-qaoubl");
      attr(div5, "class", "title svelte-qaoubl");
      attr(div6, "class", "filter matchTypeGridFilter svelte-qaoubl");
      attr(div7, "class", "filters svelte-qaoubl");
      attr(div8, "class", "filter svelte-qaoubl");
      attr(div9, "class", "filter svelte-qaoubl");
      attr(div10, "class", "horizontalLine svelte-qaoubl");
      attr(button1, "class", "clearFilterButton svelte-qaoubl");
      attr(div11, "class", "title svelte-qaoubl");
      attr(div12, "class", "options svelte-qaoubl");
      attr(div13, "class", "filter svelte-qaoubl");
      attr(div14, "class", "title svelte-qaoubl");
      attr(div15, "class", "options svelte-qaoubl");
      attr(div16, "class", "filter svelte-qaoubl");
      attr(div17, "class", "unitsAndWays svelte-qaoubl");
      attr(div18, "class", "filter svelte-qaoubl");
      attr(div19, "class", "title svelte-qaoubl");
      attr(input2, "type", "number");
      attr(input2, "id", "minHours");
      attr(input2, "name", "minHours");
      attr(input2, "placeholder", "Min");
      attr(input2, "class", "svelte-qaoubl");
      attr(input3, "type", "number");
      attr(input3, "id", "maxHours");
      attr(input3, "name", "maxHours");
      attr(input3, "placeholder", "Max");
      attr(input3, "class", "svelte-qaoubl");
      attr(div20, "class", "fieldOptions svelte-qaoubl");
      attr(div21, "class", "title svelte-qaoubl");
      attr(input4, "type", "number");
      attr(input4, "step", ".1");
      attr(input4, "id", "minEval");
      attr(input4, "name", "minEval");
      attr(input4, "placeholder", "Min");
      attr(input4, "class", "svelte-qaoubl");
      attr(input5, "type", "number");
      attr(input5, "step", ".1");
      attr(input5, "id", "maxEval");
      attr(input5, "name", "maxEval");
      attr(input5, "placeholder", "Max");
      attr(input5, "class", "svelte-qaoubl");
      attr(div22, "class", "fieldOptions svelte-qaoubl");
      attr(div23, "class", "title svelte-qaoubl");
      attr(input6, "type", "number");
      attr(input6, "id", "minPercentCompleted");
      attr(input6, "name", "minPercentCompleted");
      attr(input6, "placeholder", "Min");
      attr(input6, "class", "svelte-qaoubl");
      attr(input7, "type", "number");
      attr(input7, "id", "maxPercentCompleted");
      attr(input7, "name", "maxPercentCompleted");
      attr(input7, "placeholder", "Max");
      attr(input7, "class", "svelte-qaoubl");
      attr(div24, "class", "fieldOptions svelte-qaoubl");
      attr(div25, "class", "title svelte-qaoubl");
      attr(div26, "class", "options svelte-qaoubl");
      attr(div27, "class", "filter svelte-qaoubl");
      attr(div28, "class", "filters svelte-qaoubl");
      attr(div29, "class", "horizontalLine svelte-qaoubl");
      attr(button2, "class", "clearFilterButton svelte-qaoubl");
      attr(div30, "class", "title svelte-qaoubl");
      attr(div31, "class", "options svelte-qaoubl");
      attr(div32, "class", "filter svelte-qaoubl");
      attr(div33, "class", "filters svelte-qaoubl");
      attr(div34, "class", "filtersMenuContainer svelte-qaoubl");
      attr(input8, "type", "text");
      attr(input8, "placeholder", "% for all courses");
      attr(input8, "class", "svelte-qaoubl");
      attr(button3, "class", "filtersHeaderButton svelte-qaoubl");
      attr(div35, "class", "inputContainer inputContainer2 svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div34, anchor);
      append_hydration(div34, div0);
      append_hydration(div0, t0);
      append_hydration(div0, select0);
      append_hydration(select0, option0);
      append_hydration(select0, option1);
      append_hydration(select0, option2);
      append_hydration(select0, option3);
      append_hydration(select0, option4);
      select_option(
        select0,
        /*$searchFilters*/
        ctx[1].sortBy,
        true
      );
      append_hydration(div0, t6);
      append_hydration(div0, select1);
      append_hydration(select1, option5);
      append_hydration(select1, option6);
      select_option(
        select1,
        /*$searchFilters*/
        ctx[1].sortOrder,
        true
      );
      append_hydration(div34, t9);
      append_hydration(div34, div1);
      append_hydration(div34, t10);
      append_hydration(div34, div9);
      append_hydration(div9, button0);
      append_hydration(div9, t12);
      append_hydration(div9, div2);
      append_hydration(div2, input0);
      input0.checked = /*$searchFilters*/
      ctx[1].meta.filterGridCourses;
      append_hydration(div2, t13);
      append_hydration(div2, label0);
      append_hydration(div9, t15);
      append_hydration(div9, div3);
      append_hydration(div3, input1);
      input1.checked = /*$searchFilters*/
      ctx[1].meta.filterNotOffered;
      append_hydration(div3, t16);
      append_hydration(div3, label1);
      append_hydration(div9, t18);
      append_hydration(div9, div8);
      append_hydration(div8, div4);
      append_hydration(div8, t20);
      append_hydration(div8, div5);
      append_hydration(div8, t22);
      append_hydration(div8, div7);
      append_hydration(div7, div6);
      for (let i = 0; i < each_blocks_5.length; i += 1) {
        if (each_blocks_5[i]) {
          each_blocks_5[i].m(div6, null);
        }
      }
      append_hydration(div34, t23);
      append_hydration(div34, div10);
      append_hydration(div34, t24);
      append_hydration(div34, div28);
      append_hydration(div28, div18);
      append_hydration(div18, button1);
      append_hydration(div18, t26);
      append_hydration(div18, div17);
      append_hydration(div17, div13);
      append_hydration(div13, div11);
      append_hydration(div13, t28);
      append_hydration(div13, div12);
      for (let i = 0; i < each_blocks_4.length; i += 1) {
        if (each_blocks_4[i]) {
          each_blocks_4[i].m(div12, null);
        }
      }
      append_hydration(div17, t29);
      append_hydration(div17, div16);
      append_hydration(div16, div14);
      append_hydration(div16, t31);
      append_hydration(div16, div15);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        if (each_blocks_3[i]) {
          each_blocks_3[i].m(div15, null);
        }
      }
      append_hydration(div28, t32);
      append_hydration(div28, div27);
      append_hydration(div27, div19);
      append_hydration(div27, t34);
      append_hydration(div27, div20);
      append_hydration(div20, t35);
      append_hydration(div20, input2);
      set_input_value(
        input2,
        /*$searchFilters*/
        ctx[1].hours.min
      );
      append_hydration(div20, t36);
      append_hydration(div20, input3);
      set_input_value(
        input3,
        /*$searchFilters*/
        ctx[1].hours.max
      );
      append_hydration(div27, t37);
      append_hydration(div27, div21);
      append_hydration(div27, t39);
      append_hydration(div27, div22);
      append_hydration(div22, t40);
      append_hydration(div22, input4);
      set_input_value(
        input4,
        /*$searchFilters*/
        ctx[1].averageEval.min
      );
      append_hydration(div22, t41);
      append_hydration(div22, input5);
      set_input_value(
        input5,
        /*$searchFilters*/
        ctx[1].averageEval.max
      );
      append_hydration(div27, t42);
      append_hydration(div27, div23);
      append_hydration(div27, t44);
      append_hydration(div27, div24);
      append_hydration(div24, t45);
      append_hydration(div24, input6);
      set_input_value(
        input6,
        /*$searchFilters*/
        ctx[1].percentCompleted.min
      );
      append_hydration(div24, t46);
      append_hydration(div24, input7);
      set_input_value(
        input7,
        /*$searchFilters*/
        ctx[1].percentCompleted.max
      );
      append_hydration(div27, t47);
      append_hydration(div27, div25);
      append_hydration(div27, t49);
      append_hydration(div27, div26);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div26, null);
        }
      }
      append_hydration(div34, t50);
      append_hydration(div34, div29);
      append_hydration(div34, t51);
      append_hydration(div34, div33);
      append_hydration(div33, div32);
      append_hydration(div32, button2);
      append_hydration(div32, t53);
      append_hydration(div32, div30);
      append_hydration(div32, t55);
      append_hydration(div32, div31);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div31, null);
        }
      }
      append_hydration(div31, t56);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div31, null);
        }
      }
      insert_hydration(target, t57, anchor);
      insert_hydration(target, div35, anchor);
      append_hydration(div35, input8);
      set_input_value(
        input8,
        /*query*/
        ctx[0]
      );
      append_hydration(div35, t58);
      append_hydration(div35, button3);
      if (!mounted) {
        dispose = [
          listen(
            select0,
            "change",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            select0,
            "change",
            /*select0_change_handler*/
            ctx[12]
          ),
          listen(
            select1,
            "change",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            select1,
            "change",
            /*select1_change_handler*/
            ctx[13]
          ),
          listen(
            button0,
            "click",
            /*click_handler_1*/
            ctx[14]
          ),
          listen(
            input0,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input0,
            "change",
            /*input0_change_handler*/
            ctx[15]
          ),
          listen(
            input1,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[16]
          ),
          listen(
            button1,
            "click",
            /*click_handler_3*/
            ctx[20]
          ),
          listen(
            input2,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input2,
            "input",
            /*input2_input_handler*/
            ctx[23]
          ),
          listen(
            input3,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input3,
            "input",
            /*input3_input_handler*/
            ctx[24]
          ),
          listen(
            input4,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input4,
            "input",
            /*input4_input_handler*/
            ctx[25]
          ),
          listen(
            input5,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input5,
            "input",
            /*input5_input_handler*/
            ctx[26]
          ),
          listen(
            input6,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input6,
            "input",
            /*input6_input_handler*/
            ctx[27]
          ),
          listen(
            input7,
            "input",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(
            input7,
            "input",
            /*input7_input_handler*/
            ctx[28]
          ),
          listen(
            button2,
            "click",
            /*click_handler_4*/
            ctx[30]
          ),
          listen(
            input8,
            "input",
            /*input8_input_handler*/
            ctx[33]
          ),
          listen(
            button3,
            "click",
            /*click_handler_5*/
            ctx[34]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$searchFilters*/
      2) {
        select_option(
          select0,
          /*$searchFilters*/
          ctx2[1].sortBy
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        select_option(
          select1,
          /*$searchFilters*/
          ctx2[1].sortOrder
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input0.checked = /*$searchFilters*/
        ctx2[1].meta.filterGridCourses;
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input1.checked = /*$searchFilters*/
        ctx2[1].meta.filterNotOffered;
      }
      if (dirty[0] & /*$resultCategories, searchResultsFunction, checkboxFunction*/
      392) {
        each_value_7 = ensure_array_like(
          /*$resultCategories*/
          ctx2[3]
        );
        let i;
        for (i = 0; i < each_value_7.length; i += 1) {
          const child_ctx = get_each_context_7(ctx2, each_value_7, i);
          if (each_blocks_5[i]) {
            each_blocks_5[i].p(child_ctx, dirty);
          } else {
            each_blocks_5[i] = create_each_block_7(child_ctx);
            each_blocks_5[i].c();
            each_blocks_5[i].m(div6, null);
          }
        }
        for (; i < each_blocks_5.length; i += 1) {
          each_blocks_5[i].d(1);
        }
        each_blocks_5.length = each_value_7.length;
      }
      if (dirty[0] & /*$searchFilters, searchResultsFunction*/
      130) {
        each_value_6 = ensure_array_like(Object.keys(
          /*$searchFilters*/
          ctx2[1].units
        ));
        let i;
        for (i = 0; i < each_value_6.length; i += 1) {
          const child_ctx = get_each_context_6(ctx2, each_value_6, i);
          if (each_blocks_4[i]) {
            each_blocks_4[i].p(child_ctx, dirty);
          } else {
            each_blocks_4[i] = create_each_block_6(child_ctx);
            each_blocks_4[i].c();
            each_blocks_4[i].m(div12, null);
          }
        }
        for (; i < each_blocks_4.length; i += 1) {
          each_blocks_4[i].d(1);
        }
        each_blocks_4.length = each_value_6.length;
      }
      if (dirty[0] & /*$searchFilters, searchResultsFunction*/
      130) {
        each_value_5 = ensure_array_like(Object.keys(
          /*$searchFilters*/
          ctx2[1].WAYS
        ));
        let i;
        for (i = 0; i < each_value_5.length; i += 1) {
          const child_ctx = get_each_context_5(ctx2, each_value_5, i);
          if (each_blocks_3[i]) {
            each_blocks_3[i].p(child_ctx, dirty);
          } else {
            each_blocks_3[i] = create_each_block_5(child_ctx);
            each_blocks_3[i].c();
            each_blocks_3[i].m(div15, null);
          }
        }
        for (; i < each_blocks_3.length; i += 1) {
          each_blocks_3[i].d(1);
        }
        each_blocks_3.length = each_value_5.length;
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input2.value) !== /*$searchFilters*/
      ctx2[1].hours.min) {
        set_input_value(
          input2,
          /*$searchFilters*/
          ctx2[1].hours.min
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input3.value) !== /*$searchFilters*/
      ctx2[1].hours.max) {
        set_input_value(
          input3,
          /*$searchFilters*/
          ctx2[1].hours.max
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input4.value) !== /*$searchFilters*/
      ctx2[1].averageEval.min) {
        set_input_value(
          input4,
          /*$searchFilters*/
          ctx2[1].averageEval.min
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input5.value) !== /*$searchFilters*/
      ctx2[1].averageEval.max) {
        set_input_value(
          input5,
          /*$searchFilters*/
          ctx2[1].averageEval.max
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input6.value) !== /*$searchFilters*/
      ctx2[1].percentCompleted.min) {
        set_input_value(
          input6,
          /*$searchFilters*/
          ctx2[1].percentCompleted.min
        );
      }
      if (dirty[0] & /*$searchFilters*/
      2 && to_number(input7.value) !== /*$searchFilters*/
      ctx2[1].percentCompleted.max) {
        set_input_value(
          input7,
          /*$searchFilters*/
          ctx2[1].percentCompleted.max
        );
      }
      if (dirty[0] & /*$searchFilters, searchResultsFunction*/
      130) {
        each_value_4 = ensure_array_like(Object.keys(
          /*$searchFilters*/
          ctx2[1].QuartersOffered
        ));
        let i;
        for (i = 0; i < each_value_4.length; i += 1) {
          const child_ctx = get_each_context_4$1(ctx2, each_value_4, i);
          if (each_blocks_2[i]) {
            each_blocks_2[i].p(child_ctx, dirty);
          } else {
            each_blocks_2[i] = create_each_block_4$1(child_ctx);
            each_blocks_2[i].c();
            each_blocks_2[i].m(div26, null);
          }
        }
        for (; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].d(1);
        }
        each_blocks_2.length = each_value_4.length;
      }
      if (dirty[0] & /*$searchFilters, searchResultsFunction*/
      130) {
        each_value_3 = ensure_array_like(Object.keys(
          /*$searchFilters*/
          ctx2[1].degreeSpecific.checkboxes
        ));
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3$2(ctx2, each_value_3, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_3$2(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div31, t56);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_3.length;
      }
      if (dirty[0] & /*$searchFilters, searchResultsFunction*/
      130) {
        each_value_2 = ensure_array_like(Object.keys(
          /*$searchFilters*/
          ctx2[1].degreeSpecificMs.checkboxes
        ));
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2$2(ctx2, each_value_2, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_2$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div31, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_2.length;
      }
      if (dirty[0] & /*query*/
      1 && input8.value !== /*query*/
      ctx2[0]) {
        set_input_value(
          input8,
          /*query*/
          ctx2[0]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div34);
        detach(t57);
        detach(div35);
      }
      destroy_each(each_blocks_5, detaching);
      destroy_each(each_blocks_4, detaching);
      destroy_each(each_blocks_3, detaching);
      destroy_each(each_blocks_2, detaching);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_7(ctx) {
  let div;
  let label0;
  let t0;
  let label0_for_value;
  let t1;
  let input0;
  let input0_id_value;
  let input0_name_value;
  let t2;
  let input1;
  let input1_id_value;
  let input1_name_value;
  let t3;
  let label1;
  let t4;
  let t5_value = (
    /*category*/
    ctx[43].title.toLowerCase() + ""
  );
  let t5;
  let label1_for_value;
  let t6;
  let mounted;
  let dispose;
  function click_handler_2() {
    return (
      /*click_handler_2*/
      ctx[17](
        /*category*/
        ctx[43]
      )
    );
  }
  function input0_change_handler_1() {
    ctx[18].call(
      input0,
      /*each_value_7*/
      ctx[63],
      /*category_index_1*/
      ctx[64]
    );
  }
  function input1_input_handler() {
    ctx[19].call(
      input1,
      /*each_value_7*/
      ctx[63],
      /*category_index_1*/
      ctx[64]
    );
  }
  return {
    c() {
      div = element("div");
      label0 = element("label");
      t0 = text("Hide");
      t1 = space();
      input0 = element("input");
      t2 = space();
      input1 = element("input");
      t3 = space();
      label1 = element("label");
      t4 = text("# results - ");
      t5 = text(t5_value);
      t6 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      label0 = claim_element(div_nodes, "LABEL", { for: true });
      var label0_nodes = children(label0);
      t0 = claim_text(label0_nodes, "Hide");
      label0_nodes.forEach(detach);
      t1 = claim_space(div_nodes);
      input0 = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t2 = claim_space(div_nodes);
      input1 = claim_element(div_nodes, "INPUT", {
        class: true,
        type: true,
        id: true,
        name: true
      });
      t3 = claim_space(div_nodes);
      label1 = claim_element(div_nodes, "LABEL", { for: true });
      var label1_nodes = children(label1);
      t4 = claim_text(label1_nodes, "# results - ");
      t5 = claim_text(label1_nodes, t5_value);
      label1_nodes.forEach(detach);
      t6 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(label0, "for", label0_for_value = /*category*/
      ctx[43].type);
      attr(input0, "type", "checkbox");
      attr(input0, "id", input0_id_value = /*category*/
      ctx[43].type);
      attr(input0, "name", input0_name_value = /*category*/
      ctx[43].type);
      attr(input0, "class", "svelte-qaoubl");
      attr(input1, "class", "numResultsInput svelte-qaoubl");
      attr(input1, "type", "number");
      attr(input1, "id", input1_id_value = /*category*/
      ctx[43].type);
      attr(input1, "name", input1_name_value = /*category*/
      ctx[43].type);
      attr(label1, "for", label1_for_value = /*category*/
      ctx[43].type);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, label0);
      append_hydration(label0, t0);
      append_hydration(div, t1);
      append_hydration(div, input0);
      input0.checked = /*category*/
      ctx[43].hide;
      append_hydration(div, t2);
      append_hydration(div, input1);
      set_input_value(
        input1,
        /*category*/
        ctx[43].numResults
      );
      append_hydration(div, t3);
      append_hydration(div, label1);
      append_hydration(label1, t4);
      append_hydration(label1, t5);
      append_hydration(div, t6);
      if (!mounted) {
        dispose = [
          listen(input0, "click", click_handler_2),
          listen(input0, "change", input0_change_handler_1),
          listen(
            input1,
            "change",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input1, "input", input1_input_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$resultCategories*/
      8 && label0_for_value !== (label0_for_value = /*category*/
      ctx[43].type)) {
        attr(label0, "for", label0_for_value);
      }
      if (dirty[0] & /*$resultCategories*/
      8 && input0_id_value !== (input0_id_value = /*category*/
      ctx[43].type)) {
        attr(input0, "id", input0_id_value);
      }
      if (dirty[0] & /*$resultCategories*/
      8 && input0_name_value !== (input0_name_value = /*category*/
      ctx[43].type)) {
        attr(input0, "name", input0_name_value);
      }
      if (dirty[0] & /*$resultCategories*/
      8) {
        input0.checked = /*category*/
        ctx[43].hide;
      }
      if (dirty[0] & /*$resultCategories*/
      8 && input1_id_value !== (input1_id_value = /*category*/
      ctx[43].type)) {
        attr(input1, "id", input1_id_value);
      }
      if (dirty[0] & /*$resultCategories*/
      8 && input1_name_value !== (input1_name_value = /*category*/
      ctx[43].type)) {
        attr(input1, "name", input1_name_value);
      }
      if (dirty[0] & /*$resultCategories*/
      8 && to_number(input1.value) !== /*category*/
      ctx[43].numResults) {
        set_input_value(
          input1,
          /*category*/
          ctx[43].numResults
        );
      }
      if (dirty[0] & /*$resultCategories*/
      8 && t5_value !== (t5_value = /*category*/
      ctx[43].title.toLowerCase() + ""))
        set_data(t5, t5_value);
      if (dirty[0] & /*$resultCategories*/
      8 && label1_for_value !== (label1_for_value = /*category*/
      ctx[43].type)) {
        attr(label1, "for", label1_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_6(ctx) {
  let div;
  let input;
  let input_id_value;
  let input_name_value;
  let t0;
  let label;
  let t1_value = (
    /*unit*/
    ctx[60] + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let mounted;
  let dispose;
  function input_change_handler() {
    ctx[21].call(
      input,
      /*unit*/
      ctx[60]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t0 = claim_space(div_nodes);
      label = claim_element(div_nodes, "LABEL", { for: true });
      var label_nodes = children(label);
      t1 = claim_text(label_nodes, t1_value);
      label_nodes.forEach(detach);
      t2 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(input, "id", input_id_value = /*unit*/
      ctx[60]);
      attr(input, "name", input_name_value = /*unit*/
      ctx[60]);
      attr(input, "class", "svelte-qaoubl");
      attr(label, "for", label_for_value = /*unit*/
      ctx[60]);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$searchFilters*/
      ctx[1].units[
        /*unit*/
        ctx[60]
      ];
      append_hydration(div, t0);
      append_hydration(div, label);
      append_hydration(label, t1);
      append_hydration(div, t2);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input, "change", input_change_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$searchFilters*/
      2 && input_id_value !== (input_id_value = /*unit*/
      ctx[60])) {
        attr(input, "id", input_id_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2 && input_name_value !== (input_name_value = /*unit*/
      ctx[60])) {
        attr(input, "name", input_name_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input.checked = /*$searchFilters*/
        ctx[1].units[
          /*unit*/
          ctx[60]
        ];
      }
      if (dirty[0] & /*$searchFilters*/
      2 && t1_value !== (t1_value = /*unit*/
      ctx[60] + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*$searchFilters*/
      2 && label_for_value !== (label_for_value = /*unit*/
      ctx[60])) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_5(ctx) {
  let div;
  let input;
  let input_id_value;
  let input_name_value;
  let t0;
  let label;
  let t1_value = (
    /*way*/
    ctx[57] + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let mounted;
  let dispose;
  function input_change_handler_1() {
    ctx[22].call(
      input,
      /*way*/
      ctx[57]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t0 = claim_space(div_nodes);
      label = claim_element(div_nodes, "LABEL", { for: true });
      var label_nodes = children(label);
      t1 = claim_text(label_nodes, t1_value);
      label_nodes.forEach(detach);
      t2 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(input, "id", input_id_value = /*way*/
      ctx[57]);
      attr(input, "name", input_name_value = /*way*/
      ctx[57]);
      attr(input, "class", "svelte-qaoubl");
      attr(label, "for", label_for_value = /*way*/
      ctx[57]);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$searchFilters*/
      ctx[1].WAYS[
        /*way*/
        ctx[57]
      ];
      append_hydration(div, t0);
      append_hydration(div, label);
      append_hydration(label, t1);
      append_hydration(div, t2);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input, "change", input_change_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$searchFilters*/
      2 && input_id_value !== (input_id_value = /*way*/
      ctx[57])) {
        attr(input, "id", input_id_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2 && input_name_value !== (input_name_value = /*way*/
      ctx[57])) {
        attr(input, "name", input_name_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input.checked = /*$searchFilters*/
        ctx[1].WAYS[
          /*way*/
          ctx[57]
        ];
      }
      if (dirty[0] & /*$searchFilters*/
      2 && t1_value !== (t1_value = /*way*/
      ctx[57] + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*$searchFilters*/
      2 && label_for_value !== (label_for_value = /*way*/
      ctx[57])) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_4$1(ctx) {
  let div;
  let input;
  let input_id_value;
  let input_name_value;
  let t0;
  let label;
  let t1_value = (
    /*quarter*/
    ctx[54] + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let mounted;
  let dispose;
  function input_change_handler_2() {
    ctx[29].call(
      input,
      /*quarter*/
      ctx[54]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t0 = claim_space(div_nodes);
      label = claim_element(div_nodes, "LABEL", { for: true });
      var label_nodes = children(label);
      t1 = claim_text(label_nodes, t1_value);
      label_nodes.forEach(detach);
      t2 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(input, "id", input_id_value = /*quarter*/
      ctx[54]);
      attr(input, "name", input_name_value = /*quarter*/
      ctx[54]);
      attr(input, "class", "svelte-qaoubl");
      attr(label, "for", label_for_value = /*quarter*/
      ctx[54]);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$searchFilters*/
      ctx[1].QuartersOffered[
        /*quarter*/
        ctx[54]
      ];
      append_hydration(div, t0);
      append_hydration(div, label);
      append_hydration(label, t1);
      append_hydration(div, t2);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input, "change", input_change_handler_2)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$searchFilters*/
      2 && input_id_value !== (input_id_value = /*quarter*/
      ctx[54])) {
        attr(input, "id", input_id_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2 && input_name_value !== (input_name_value = /*quarter*/
      ctx[54])) {
        attr(input, "name", input_name_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input.checked = /*$searchFilters*/
        ctx[1].QuartersOffered[
          /*quarter*/
          ctx[54]
        ];
      }
      if (dirty[0] & /*$searchFilters*/
      2 && t1_value !== (t1_value = /*quarter*/
      ctx[54] + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*$searchFilters*/
      2 && label_for_value !== (label_for_value = /*quarter*/
      ctx[54])) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_3$2(ctx) {
  let div;
  let input;
  let input_id_value;
  let input_name_value;
  let t0;
  let label;
  let t1_value = (
    /*thisDegreeFilter*/
    ctx[49] + ""
  );
  let t1;
  let label_for_value;
  let mounted;
  let dispose;
  function input_change_handler_3() {
    ctx[31].call(
      input,
      /*thisDegreeFilter*/
      ctx[49]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      t1 = text(t1_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t0 = claim_space(div_nodes);
      label = claim_element(div_nodes, "LABEL", { for: true });
      var label_nodes = children(label);
      t1 = claim_text(label_nodes, t1_value);
      label_nodes.forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(input, "id", input_id_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(input, "name", input_name_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(input, "class", "svelte-qaoubl");
      attr(label, "for", label_for_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$searchFilters*/
      ctx[1].degreeSpecific.checkboxes[
        /*thisDegreeFilter*/
        ctx[49]
      ];
      append_hydration(div, t0);
      append_hydration(div, label);
      append_hydration(label, t1);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input, "change", input_change_handler_3)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$searchFilters*/
      2 && input_id_value !== (input_id_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(input, "id", input_id_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2 && input_name_value !== (input_name_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(input, "name", input_name_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input.checked = /*$searchFilters*/
        ctx[1].degreeSpecific.checkboxes[
          /*thisDegreeFilter*/
          ctx[49]
        ];
      }
      if (dirty[0] & /*$searchFilters*/
      2 && t1_value !== (t1_value = /*thisDegreeFilter*/
      ctx[49] + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*$searchFilters*/
      2 && label_for_value !== (label_for_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_2$2(ctx) {
  let div;
  let input;
  let input_id_value;
  let input_name_value;
  let t0;
  let label;
  let t1_value = (
    /*thisDegreeFilter*/
    ctx[49] + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let mounted;
  let dispose;
  function input_change_handler_4() {
    ctx[32].call(
      input,
      /*thisDegreeFilter*/
      ctx[49]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", {
        type: true,
        id: true,
        name: true,
        class: true
      });
      t0 = claim_space(div_nodes);
      label = claim_element(div_nodes, "LABEL", { for: true });
      var label_nodes = children(label);
      t1 = claim_text(label_nodes, t1_value);
      label_nodes.forEach(detach);
      t2 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(input, "id", input_id_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(input, "name", input_name_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(input, "class", "svelte-qaoubl");
      attr(label, "for", label_for_value = /*thisDegreeFilter*/
      ctx[49]);
      attr(div, "class", "option svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$searchFilters*/
      ctx[1].degreeSpecificMs.checkboxes[
        /*thisDegreeFilter*/
        ctx[49]
      ];
      append_hydration(div, t0);
      append_hydration(div, label);
      append_hydration(label, t1);
      append_hydration(div, t2);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "click",
            /*searchResultsFunction*/
            ctx[7]
          ),
          listen(input, "change", input_change_handler_4)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$searchFilters*/
      2 && input_id_value !== (input_id_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(input, "id", input_id_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2 && input_name_value !== (input_name_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(input, "name", input_name_value);
      }
      if (dirty[0] & /*$searchFilters*/
      2) {
        input.checked = /*$searchFilters*/
        ctx[1].degreeSpecificMs.checkboxes[
          /*thisDegreeFilter*/
          ctx[49]
        ];
      }
      if (dirty[0] & /*$searchFilters*/
      2 && t1_value !== (t1_value = /*thisDegreeFilter*/
      ctx[49] + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*$searchFilters*/
      2 && label_for_value !== (label_for_value = /*thisDegreeFilter*/
      ctx[49])) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$a(ctx) {
  let div2;
  let div0;
  let t0;
  let t1_value = (
    /*category*/
    ctx[43].title + ""
  );
  let t1;
  let t2;
  let div1;
  let div2_class_value;
  let t3;
  let div3;
  let t4;
  let t5_value = (
    /*category*/
    ctx[43].numResultsShowing + ""
  );
  let t5;
  let t6;
  let t7_value = (
    /*category*/
    ctx[43].numResultsFound + ""
  );
  let t7;
  let t8;
  let div4;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let div4_class_value;
  let dndzone_action;
  let current;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(
    /*category*/
    ctx[43].results
  );
  const get_key = (ctx2) => (
    /*course*/
    ctx2[46].id
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$4(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$4(key, child_ctx));
  }
  function consider_handler(...args) {
    return (
      /*consider_handler*/
      ctx[35](
        /*category*/
        ctx[43],
        ...args
      )
    );
  }
  function finalize_handler(...args) {
    return (
      /*finalize_handler*/
      ctx[36](
        /*category*/
        ctx[43],
        ...args
      )
    );
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      div1 = element("div");
      t3 = space();
      div3 = element("div");
      t4 = text("Showing ");
      t5 = text(t5_value);
      t6 = text(" of ");
      t7 = text(t7_value);
      t8 = space();
      div4 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      children(div0).forEach(detach);
      t0 = claim_space(div2_nodes);
      t1 = claim_text(div2_nodes, t1_value);
      t2 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      children(div1).forEach(detach);
      div2_nodes.forEach(detach);
      t3 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      t4 = claim_text(div3_nodes, "Showing ");
      t5 = claim_text(div3_nodes, t5_value);
      t6 = claim_text(div3_nodes, " of ");
      t7 = claim_text(div3_nodes, t7_value);
      div3_nodes.forEach(detach);
      t8 = claim_space(nodes);
      div4 = claim_element(nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div4_nodes);
      }
      div4_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "resultsHorizontalLine svelte-qaoubl");
      attr(div1, "class", "resultsHorizontalLine svelte-qaoubl");
      attr(div2, "class", div2_class_value = "resultsHeader " + /*category*/
      ctx[43].type + "header svelte-qaoubl");
      attr(div3, "class", "resultsHeader resultsHeaderShowing svelte-qaoubl");
      attr(div4, "class", div4_class_value = "results " + /*category*/
      ctx[43].type + " svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div2, t0);
      append_hydration(div2, t1);
      append_hydration(div2, t2);
      append_hydration(div2, div1);
      insert_hydration(target, t3, anchor);
      insert_hydration(target, div3, anchor);
      append_hydration(div3, t4);
      append_hydration(div3, t5);
      append_hydration(div3, t6);
      append_hydration(div3, t7);
      insert_hydration(target, t8, anchor);
      insert_hydration(target, div4, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div4, null);
        }
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(dndzone_action = dndzone.call(null, div4, {
            items: (
              /*category*/
              ctx[43].results
            ),
            flipDurationMs: flipDurationMs$2,
            dropTargetStyle: {}
          })),
          listen(div4, "consider", consider_handler),
          listen(div4, "finalize", finalize_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if ((!current || dirty[0] & /*$resultCategories*/
      8) && t1_value !== (t1_value = /*category*/
      ctx[43].title + ""))
        set_data(t1, t1_value);
      if (!current || dirty[0] & /*$resultCategories*/
      8 && div2_class_value !== (div2_class_value = "resultsHeader " + /*category*/
      ctx[43].type + "header svelte-qaoubl")) {
        attr(div2, "class", div2_class_value);
      }
      if ((!current || dirty[0] & /*$resultCategories*/
      8) && t5_value !== (t5_value = /*category*/
      ctx[43].numResultsShowing + ""))
        set_data(t5, t5_value);
      if ((!current || dirty[0] & /*$resultCategories*/
      8) && t7_value !== (t7_value = /*category*/
      ctx[43].numResultsFound + ""))
        set_data(t7, t7_value);
      if (dirty[0] & /*$resultCategories*/
      8) {
        each_value_1 = ensure_array_like(
          /*category*/
          ctx[43].results
        );
        group_outros();
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].r();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div4, fix_and_outro_and_destroy_block, create_each_block_1$4, null, get_each_context_1$4);
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].a();
        check_outros();
      }
      if (!current || dirty[0] & /*$resultCategories*/
      8 && div4_class_value !== (div4_class_value = "results " + /*category*/
      ctx[43].type + " svelte-qaoubl")) {
        attr(div4, "class", div4_class_value);
      }
      if (dndzone_action && is_function(dndzone_action.update) && dirty[0] & /*$resultCategories*/
      8)
        dndzone_action.update.call(null, {
          items: (
            /*category*/
            ctx[43].results
          ),
          flipDurationMs: flipDurationMs$2,
          dropTargetStyle: {}
        });
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
        detach(t3);
        detach(div3);
        detach(t8);
        detach(div4);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_1$4(key_1, ctx) {
  let div;
  let course_1;
  let rect;
  let stop_animation = noop;
  let current;
  course_1 = new Course({ props: { course: (
    /*course*/
    ctx[46]
  ) } });
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      create_component(course_1.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      claim_component(course_1.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(course_1, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const course_1_changes = {};
      if (dirty[0] & /*$resultCategories*/
      8)
        course_1_changes.course = /*course*/
        ctx[46];
      course_1.$set(course_1_changes);
    },
    r() {
      rect = div.getBoundingClientRect();
    },
    f() {
      fix_position(div);
      stop_animation();
    },
    a() {
      stop_animation();
      stop_animation = create_animation(div, rect, flip, { duration: flipDurationMs$2 });
    },
    i(local) {
      if (current)
        return;
      transition_in(course_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(course_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(course_1);
    }
  };
}
function create_each_block$6(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*category*/
    ctx[43].results && /*category*/
    ctx[43].results.length != 0 && create_if_block$a(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*category*/
        ctx2[43].results && /*category*/
        ctx2[43].results.length != 0
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*$resultCategories*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$a(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let section;
  let div0;
  let input;
  let t0;
  let button;
  let textContent = "Filters";
  let t2;
  let t3;
  let t4;
  let div1;
  let current;
  let mounted;
  let dispose;
  let if_block = (
    /*showFilters*/
    ctx[2] && create_if_block_1$6(ctx)
  );
  let each_value = ensure_array_like(
    /*$resultCategories*/
    ctx[3]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      section = element("section");
      div0 = element("div");
      input = element("input");
      t0 = space();
      button = element("button");
      button.textContent = textContent;
      t2 = space();
      if (if_block)
        if_block.c();
      t3 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t4 = space();
      div1 = element("div");
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      div0 = claim_element(section_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      input = claim_element(div0_nodes, "INPUT", {
        type: true,
        placeholder: true,
        class: true
      });
      t0 = claim_space(div0_nodes);
      button = claim_element(div0_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button) !== "svelte-1whoyzh")
        button.textContent = textContent;
      div0_nodes.forEach(detach);
      t2 = claim_space(section_nodes);
      if (if_block)
        if_block.l(section_nodes);
      t3 = claim_space(section_nodes);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(section_nodes);
      }
      t4 = claim_space(section_nodes);
      div1 = claim_element(section_nodes, "DIV", { class: true });
      children(div1).forEach(detach);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "text");
      attr(input, "placeholder", "% for all courses");
      attr(input, "class", "svelte-qaoubl");
      attr(button, "class", "filtersHeaderButton svelte-qaoubl");
      attr(div0, "class", "inputContainer svelte-qaoubl");
      attr(div1, "class", "spacer svelte-qaoubl");
      attr(section, "class", "svelte-qaoubl");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      append_hydration(section, div0);
      append_hydration(div0, input);
      set_input_value(
        input,
        /*query*/
        ctx[0]
      );
      append_hydration(div0, t0);
      append_hydration(div0, button);
      append_hydration(section, t2);
      if (if_block)
        if_block.m(section, null);
      append_hydration(section, t3);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(section, null);
        }
      }
      append_hydration(section, t4);
      append_hydration(section, div1);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[10]
          ),
          listen(
            button,
            "click",
            /*click_handler*/
            ctx[11]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*query*/
      1 && input.value !== /*query*/
      ctx2[0]) {
        set_input_value(
          input,
          /*query*/
          ctx2[0]
        );
      }
      if (
        /*showFilters*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1$6(ctx2);
          if_block.c();
          if_block.m(section, t3);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*$resultCategories, handleDndConsider, handleDndFinalize*/
      104) {
        each_value = ensure_array_like(
          /*$resultCategories*/
          ctx2[3]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$6(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$6(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(section, t4);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if (if_block)
        if_block.d();
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
const flipDurationMs$2 = 300;
function randomizeId(course) {
  return {
    ...course,
    id: course.id.split("|")[0] + "|" + Math.random().toString(36).substring(7)
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let $resultCategories;
  let $searchFilters;
  let $allCourses;
  let $isDragging;
  let $courseTableList;
  component_subscribe($$self, resultCategories, ($$value) => $$invalidate(3, $resultCategories = $$value));
  component_subscribe($$self, searchFilters, ($$value) => $$invalidate(1, $searchFilters = $$value));
  component_subscribe($$self, allCourses, ($$value) => $$invalidate(38, $allCourses = $$value));
  component_subscribe($$self, isDragging$1, ($$value) => $$invalidate(39, $isDragging = $$value));
  component_subscribe($$self, courseTableList, ($$value) => $$invalidate(40, $courseTableList = $$value));
  let showFilters = false;
  let query = "%";
  function doesCourseFitFilters(course, filters) {
    if (filters.meta.filterGridCourses && listOfCourseObjsIncludesCode($courseTableList, course)) {
      return false;
    }
    if (filters.meta.filterNotOffered && course.seasons_offered.length == 0) {
      return false;
    }
    let unitsFilterActive = false;
    Object.keys(filters.units).forEach((unit) => {
      if (filters.units[unit]) {
        unitsFilterActive = true;
      }
    });
    if (unitsFilterActive) {
      let units_taking = parseInt(course.units_taking);
      let unitsFilterFits = false;
      Object.keys(filters.units).forEach((unit) => {
        if (filters.units[unit] && unit == "6+" && units_taking >= 6) {
          unitsFilterFits = true;
        } else if (filters.units[unit] && units_taking == parseInt(unit)) {
          unitsFilterFits = true;
        }
      });
      if (!unitsFilterFits) {
        return false;
      }
    }
    let waysFilterActive = false;
    Object.keys(filters.WAYS).forEach((way) => {
      if (filters.WAYS[way]) {
        waysFilterActive = true;
      }
    });
    if (waysFilterActive) {
      let waysFilterFits = false;
      Object.keys(filters.WAYS).forEach((way) => {
        if (filters.WAYS[way] && course.ways.includes(way)) {
          waysFilterFits = true;
        }
      });
      if (!waysFilterFits) {
        return false;
      }
    }
    if (filters.hours.min != "" && course.int_hours < filters.hours.min) {
      return false;
    }
    if (filters.hours.max != "" && course.int_hours > filters.hours.max) {
      return false;
    }
    if (course.average_rating != "-1") {
      if (filters.averageEval.min != "" && course.average_rating < filters.averageEval.min) {
        return false;
      }
      if (filters.averageEval.max != "" && course.average_rating > filters.averageEval.max) {
        return false;
      }
    }
    if (filters.percentCompleted.min != "" && course.percent_outcomes_completed < filters.percentCompleted.min) {
      return false;
    }
    if (filters.percentCompleted.max != "" && course.percent_outcomes_completed > filters.percentCompleted.max) {
      return false;
    }
    let quartersOfferedFilterActive = false;
    Object.keys(filters.QuartersOffered).forEach((quarter) => {
      if (filters.QuartersOffered[quarter]) {
        quartersOfferedFilterActive = true;
      }
    });
    if (quartersOfferedFilterActive) {
      let quartersOfferedFilterFits = false;
      Object.keys(filters.QuartersOffered).forEach((quarter) => {
        if (filters.QuartersOffered[quarter] && (course.seasons_offered.includes(quarter) || course.seasons_offered.includes(quarter.toLowerCase()))) {
          quartersOfferedFilterFits = true;
        }
      });
      if (!quartersOfferedFilterFits) {
        return false;
      }
    }
    let degreeSpecificFilterActive = false;
    Object.keys(filters.degreeSpecific.checkboxes).forEach((checkbox) => {
      if (filters.degreeSpecific.checkboxes[checkbox]) {
        degreeSpecificFilterActive = true;
      }
    });
    Object.keys(filters.degreeSpecificMs.checkboxes).forEach((checkbox) => {
      if (filters.degreeSpecificMs.checkboxes[checkbox]) {
        degreeSpecificFilterActive = true;
      }
    });
    if (degreeSpecificFilterActive) {
      let degreeSpecificFilterFits = false;
      Object.keys(filters.degreeSpecific.luts).forEach((lut) => {
        if (filters.degreeSpecific.checkboxes[lut] && filters.degreeSpecific.luts[lut].includes(course.code)) {
          degreeSpecificFilterFits = true;
        }
      });
      Object.keys(filters.degreeSpecificMs.luts).forEach((lut) => {
        if (filters.degreeSpecificMs.checkboxes[lut] && filters.degreeSpecificMs.luts[lut].includes(course.code)) {
          degreeSpecificFilterFits = true;
        }
      });
      if (!degreeSpecificFilterFits) {
        return false;
      }
    }
    return true;
  }
  function clearFilters(filter) {
    if (filter == 0) {
      set_store_value(searchFilters, $searchFilters.meta.filterGridCourses = false, $searchFilters);
      set_store_value(searchFilters, $searchFilters.meta.filterNotOffered = false, $searchFilters);
      for (let i = 0; i < $resultCategories.length; i++) {
        set_store_value(resultCategories, $resultCategories[i].hide = false, $resultCategories);
        set_store_value(resultCategories, $resultCategories[i].numResults = $resultCategories[i].defaultNumResults, $resultCategories);
      }
    } else if (filter == 1) {
      Object.keys($searchFilters.WAYS).forEach((way) => {
        set_store_value(searchFilters, $searchFilters.WAYS[way] = false, $searchFilters);
      });
      Object.keys($searchFilters.units).forEach((unit) => {
        set_store_value(searchFilters, $searchFilters.units[unit] = false, $searchFilters);
      });
      Object.keys($searchFilters.QuartersOffered).forEach((quarter) => {
        set_store_value(searchFilters, $searchFilters.QuartersOffered[quarter] = false, $searchFilters);
      });
      set_store_value(searchFilters, $searchFilters.hours.min = 0, $searchFilters);
      set_store_value(searchFilters, $searchFilters.hours.max = 24, $searchFilters);
      set_store_value(searchFilters, $searchFilters.averageEval.min = 0, $searchFilters);
      set_store_value(searchFilters, $searchFilters.averageEval.max = 5, $searchFilters);
      set_store_value(searchFilters, $searchFilters.percentCompleted.min = 0, $searchFilters);
      set_store_value(searchFilters, $searchFilters.percentCompleted.max = 100, $searchFilters);
    } else if (filter == 2) {
      Object.keys($searchFilters.degreeSpecific.checkboxes).forEach((checkbox) => {
        set_store_value(searchFilters, $searchFilters.degreeSpecific.checkboxes[checkbox] = false, $searchFilters);
      });
      Object.keys($searchFilters.degreeSpecificMs.checkboxes).forEach((checkbox) => {
        set_store_value(searchFilters, $searchFilters.degreeSpecificMs.checkboxes[checkbox] = false, $searchFilters);
      });
    } else if (filter == 3) {
      set_store_value(searchFilters, $searchFilters.sortBy = "alphabetical", $searchFilters);
      set_store_value(searchFilters, $searchFilters.sortOrder = "ascending", $searchFilters);
    }
  }
  let scrollPosition = 0;
  function handleDndConsider(e, type) {
    scrollPosition = document.scrollingElement.scrollTop;
    $resultCategories.forEach((category) => {
      if (category.type == type) {
        category.results = e.detail.items;
      }
    });
    resultCategories.set($resultCategories);
    set_store_value(isDragging$1, $isDragging = true, $isDragging);
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  }
  function handleDndFinalize(e, type) {
    scrollPosition = document.scrollingElement.scrollTop;
    $resultCategories.forEach((category) => {
      if (category.type == type) {
        category.results = e.detail.items;
      }
    });
    resultCategories.set($resultCategories);
    set_store_value(isDragging$1, $isDragging = false, $isDragging);
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  }
  function searchResultsFunction() {
    if (typeof window !== "undefined") {
      const scrollPosition2 = document.scrollingElement.scrollTop;
      tick().then(() => {
        document.scrollingElement.scrollTop = scrollPosition2;
      });
    }
    let queryUpper = query.toUpperCase().trim();
    let queryLower = query.toLowerCase().trim();
    let workingList = sortCourses($allCourses.filter((course) => doesCourseFitFilters(course, $searchFilters)));
    let exactMatchResults = [];
    let totalExactMatchResults = 0;
    let sameDepartmentResults = [];
    let totalSameDepartmentResults = 0;
    let titleResults = [];
    let totalTitleResults = 0;
    let descriptionResults = [];
    let totalDescriptionResults = 0;
    if (query == "") {
      $resultCategories.forEach((category) => {
        category.results = [];
      });
      resultCategories.set($resultCategories);
      return;
    }
    if (query == "%") {
      queryUpper = "";
      queryLower = "";
    }
    let numResults = {};
    let hidden = {};
    $resultCategories.forEach((category) => {
      numResults[category.type] = category.numResults;
      hidden[category.type] = category.hide;
    });
    if (!hidden.sameDepartmentResults) {
      sameDepartmentResults = workingList.filter((course) => course.dept === queryUpper.split(" ")[0]);
      totalSameDepartmentResults = sameDepartmentResults.length;
      sameDepartmentResults = sameDepartmentResults.slice(0, numResults.sameDepartmentResults);
    }
    if (!hidden.exactMatchResults) {
      exactMatchResults = workingList.filter((course) => course.code.includes(queryUpper));
      totalExactMatchResults = exactMatchResults.length;
      exactMatchResults = exactMatchResults.slice(0, numResults.exactMatchResults);
    }
    if (!hidden.titleResults) {
      titleResults = workingList.filter((course) => !exactMatchResults.includes(course)).filter((course) => course.short_title.toLowerCase().includes(queryLower));
      totalTitleResults = titleResults.length;
      titleResults = titleResults.slice(0, numResults.titleResults);
    }
    if (!hidden.descriptionResults) {
      descriptionResults = workingList.filter((course) => !exactMatchResults.includes(course)).filter((course) => !titleResults.includes(course)).filter((course) => course.description.includes(queryLower));
      totalDescriptionResults = descriptionResults.length;
      descriptionResults = descriptionResults.slice(0, numResults.descriptionResults);
    }
    exactMatchResults = exactMatchResults.map(randomizeId);
    sameDepartmentResults = sameDepartmentResults.map(randomizeId);
    titleResults = titleResults.map(randomizeId);
    descriptionResults = descriptionResults.map(randomizeId);
    $resultCategories.forEach((category) => {
      if (category.type == "exactMatchResults") {
        category.results = exactMatchResults;
        category.numResultsFound = totalExactMatchResults;
        category.numResultsShowing = exactMatchResults.length;
      } else if (category.type == "sameDepartmentResults") {
        category.results = sameDepartmentResults;
        category.numResultsFound = totalSameDepartmentResults;
        category.numResultsShowing = sameDepartmentResults.length;
      } else if (category.type == "titleResults") {
        category.results = titleResults;
        category.numResultsFound = totalTitleResults;
        category.numResultsShowing = titleResults.length;
      } else if (category.type == "descriptionResults") {
        category.results = descriptionResults;
        category.numResultsFound = totalDescriptionResults;
        category.numResultsShowing = descriptionResults.length;
      }
    });
    resultCategories.set($resultCategories);
  }
  function sortCourses(courses) {
    if ($searchFilters.sortBy == "alphabetical" && $searchFilters.sortOrder == "ascending") {
      return courses;
    } else if ($searchFilters.sortBy == "alphabetical" && $searchFilters.sortOrder == "descending") {
      return courses.reverse();
    } else if ($searchFilters.sortBy == "units" && $searchFilters.sortOrder == "ascending") {
      return courses.sort((a, b) => a.units_taking - b.units_taking);
    } else if ($searchFilters.sortBy == "units" && $searchFilters.sortOrder == "descending") {
      return courses.sort((a, b) => b.units_taking - a.units_taking);
    } else if ($searchFilters.sortBy == "hours" && $searchFilters.sortOrder == "ascending") {
      return courses.sort((a, b) => a.hours - b.hours);
    } else if ($searchFilters.sortBy == "hours" && $searchFilters.sortOrder == "descending") {
      return courses.sort((a, b) => b.hours - a.hours);
    } else if ($searchFilters.sortBy == "eval" && $searchFilters.sortOrder == "ascending") {
      return courses.sort((a, b) => a.average_rating - b.average_rating);
    } else if ($searchFilters.sortBy == "eval" && $searchFilters.sortOrder == "descending") {
      return courses.sort((a, b) => b.average_rating - a.average_rating);
    } else if ($searchFilters.sortBy == "percentCompleted" && $searchFilters.sortOrder == "ascending") {
      return courses.sort((a, b) => a.percent_outcomes_completed - b.percent_outcomes_completed);
    } else if ($searchFilters.sortBy == "percentCompleted" && $searchFilters.sortOrder == "descending") {
      return courses.sort((a, b) => b.percent_outcomes_completed - a.percent_outcomes_completed);
    }
  }
  let searchResultsTimeout = null;
  function checkboxFunction(type) {
    $resultCategories.forEach((category) => {
      if (category.type == type) {
        category.hide = !category.hide;
      }
    });
    resultCategories.set($resultCategories);
    searchResultsFunction();
  }
  function input_input_handler() {
    query = this.value;
    $$invalidate(0, query), $$invalidate(1, $searchFilters), $$invalidate(9, searchResultsTimeout);
  }
  const click_handler = () => {
    $$invalidate(2, showFilters = !showFilters);
  };
  function select0_change_handler() {
    $searchFilters.sortBy = select_value(this);
    searchFilters.set($searchFilters);
  }
  function select1_change_handler() {
    $searchFilters.sortOrder = select_value(this);
    searchFilters.set($searchFilters);
  }
  const click_handler_1 = () => {
    clearFilters(0);
    clearFilters(1);
    clearFilters(2);
    clearFilters(3);
    searchResultsFunction();
  };
  function input0_change_handler() {
    $searchFilters.meta.filterGridCourses = this.checked;
    searchFilters.set($searchFilters);
  }
  function input1_change_handler() {
    $searchFilters.meta.filterNotOffered = this.checked;
    searchFilters.set($searchFilters);
  }
  const click_handler_2 = (category) => {
    checkboxFunction(category.type);
    searchResultsFunction();
  };
  function input0_change_handler_1(each_value_7, category_index_1) {
    each_value_7[category_index_1].hide = this.checked;
    resultCategories.set($resultCategories);
  }
  function input1_input_handler(each_value_7, category_index_1) {
    each_value_7[category_index_1].numResults = to_number(this.value);
    resultCategories.set($resultCategories);
  }
  const click_handler_3 = () => {
    clearFilters(1);
    searchResultsFunction();
  };
  function input_change_handler(unit) {
    $searchFilters.units[unit] = this.checked;
    searchFilters.set($searchFilters);
  }
  function input_change_handler_1(way) {
    $searchFilters.WAYS[way] = this.checked;
    searchFilters.set($searchFilters);
  }
  function input2_input_handler() {
    $searchFilters.hours.min = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input3_input_handler() {
    $searchFilters.hours.max = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input4_input_handler() {
    $searchFilters.averageEval.min = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input5_input_handler() {
    $searchFilters.averageEval.max = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input6_input_handler() {
    $searchFilters.percentCompleted.min = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input7_input_handler() {
    $searchFilters.percentCompleted.max = to_number(this.value);
    searchFilters.set($searchFilters);
  }
  function input_change_handler_2(quarter) {
    $searchFilters.QuartersOffered[quarter] = this.checked;
    searchFilters.set($searchFilters);
  }
  const click_handler_4 = () => {
    clearFilters(2);
    searchResultsFunction();
  };
  function input_change_handler_3(thisDegreeFilter) {
    $searchFilters.degreeSpecific.checkboxes[thisDegreeFilter] = this.checked;
    searchFilters.set($searchFilters);
  }
  function input_change_handler_4(thisDegreeFilter) {
    $searchFilters.degreeSpecificMs.checkboxes[thisDegreeFilter] = this.checked;
    searchFilters.set($searchFilters);
  }
  function input8_input_handler() {
    query = this.value;
    $$invalidate(0, query), $$invalidate(1, $searchFilters), $$invalidate(9, searchResultsTimeout);
  }
  const click_handler_5 = () => {
    $$invalidate(2, showFilters = !showFilters);
  };
  const consider_handler = (category, e) => handleDndConsider(e, category.type);
  const finalize_handler = (category, e) => handleDndFinalize(e, category.type);
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*$searchFilters, query, searchResultsTimeout*/
    515) {
      {
        searchFilters.set($searchFilters);
        $$invalidate(0, query), $$invalidate(1, $searchFilters), $$invalidate(9, searchResultsTimeout);
        clearTimeout(searchResultsTimeout);
        $$invalidate(9, searchResultsTimeout = setTimeout(
          () => {
            searchResultsFunction();
          },
          500
        ));
      }
    }
  };
  return [
    query,
    $searchFilters,
    showFilters,
    $resultCategories,
    clearFilters,
    handleDndConsider,
    handleDndFinalize,
    searchResultsFunction,
    checkboxFunction,
    searchResultsTimeout,
    input_input_handler,
    click_handler,
    select0_change_handler,
    select1_change_handler,
    click_handler_1,
    input0_change_handler,
    input1_change_handler,
    click_handler_2,
    input0_change_handler_1,
    input1_input_handler,
    click_handler_3,
    input_change_handler,
    input_change_handler_1,
    input2_input_handler,
    input3_input_handler,
    input4_input_handler,
    input5_input_handler,
    input6_input_handler,
    input7_input_handler,
    input_change_handler_2,
    click_handler_4,
    input_change_handler_3,
    input_change_handler_4,
    input8_input_handler,
    click_handler_5,
    consider_handler,
    finalize_handler
  ];
}
class Search extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$b, safe_not_equal, {}, null, [-1, -1, -1]);
  }
}
const WAYSTracker_svelte_svelte_type_style_lang = "";
function create_if_block$9(ctx) {
  let div1;
  let div0;
  let t;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t = text(
        /*errorMessage*/
        ctx[3]
      );
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
      var div0_nodes = children(div0);
      t = claim_text(
        div0_nodes,
        /*errorMessage*/
        ctx[3]
      );
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "hiddenNotif svelte-gg0kul");
      attr(div0, "style", "font-size: 1em");
      attr(div1, "class", "solutionTextContainer svelte-gg0kul");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
      append_hydration(div1, div0);
      append_hydration(div0, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*errorMessage*/
      8)
        set_data(
          t,
          /*errorMessage*/
          ctx2[3]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
    }
  };
}
function create_fragment$a(ctx) {
  let div33;
  let div0;
  let textContent = "WAYS";
  let t1;
  let t2;
  let div4;
  let button0;
  let arrowleft;
  let t3;
  let div3;
  let div1;
  let t4;
  let t5_value = (
    /*currentSolution*/
    ctx[1] + 1 + ""
  );
  let t5;
  let t6;
  let t7_value = (
    /*waysGrids*/
    ctx[0].length + ""
  );
  let t7;
  let t8;
  let div2;
  let t9;
  let t10;
  let t11;
  let button1;
  let arrowright;
  let t12;
  let div32;
  let div13;
  let div6;
  let div5;
  let textContent_1 = "AII";
  let t14;
  let waysicons0;
  let div6_class_value;
  let t15;
  let div8;
  let div7;
  let textContent_2 = "AII";
  let t17;
  let waysicons1;
  let div8_class_value;
  let t18;
  let div10;
  let div9;
  let textContent_3 = "SI";
  let t20;
  let waysicons2;
  let div10_class_value;
  let t21;
  let div12;
  let div11;
  let textContent_4 = "SI";
  let t23;
  let waysicons3;
  let div12_class_value;
  let t24;
  let div22;
  let div15;
  let div14;
  let textContent_5 = "SMA";
  let t26;
  let waysicons4;
  let div15_class_value;
  let t27;
  let div17;
  let div16;
  let textContent_6 = "SMA";
  let t29;
  let waysicons5;
  let div17_class_value;
  let t30;
  let div19;
  let div18;
  let textContent_7 = "CE";
  let t32;
  let waysicons6;
  let div19_class_value;
  let t33;
  let div21;
  let div20;
  let textContent_8 = "CE";
  let t35;
  let waysicons7;
  let div21_class_value;
  let t36;
  let div31;
  let div24;
  let div23;
  let textContent_9 = "AQR";
  let t38;
  let waysicons8;
  let div24_class_value;
  let t39;
  let div26;
  let div25;
  let textContent_10 = "EDP";
  let t41;
  let waysicons9;
  let div26_class_value;
  let t42;
  let div28;
  let div27;
  let textContent_11 = "ER";
  let t44;
  let waysicons10;
  let div28_class_value;
  let t45;
  let div30;
  let div29;
  let textContent_12 = "FR";
  let t47;
  let waysicons11;
  let div30_class_value;
  let current;
  let mounted;
  let dispose;
  let if_block = (
    /*errorMessage*/
    ctx[3] && create_if_block$9(ctx)
  );
  arrowleft = new ArrowLeft({
    props: { size: "2em", style: "cursor: pointer;" }
  });
  arrowright = new ArrowRight({
    props: { size: "2em", style: "cursor: pointer;" }
  });
  waysicons0 = new WAYSIcons({ props: { ways: "AII" } });
  waysicons1 = new WAYSIcons({ props: { ways: "AII" } });
  waysicons2 = new WAYSIcons({ props: { ways: "SI" } });
  waysicons3 = new WAYSIcons({ props: { ways: "SI" } });
  waysicons4 = new WAYSIcons({ props: { ways: "SMA" } });
  waysicons5 = new WAYSIcons({ props: { ways: "SMA" } });
  waysicons6 = new WAYSIcons({ props: { ways: "CE" } });
  waysicons7 = new WAYSIcons({ props: { ways: "CE" } });
  waysicons8 = new WAYSIcons({ props: { ways: "AQR" } });
  waysicons9 = new WAYSIcons({ props: { ways: "EDP" } });
  waysicons10 = new WAYSIcons({ props: { ways: "ER" } });
  waysicons11 = new WAYSIcons({ props: { ways: "FR" } });
  return {
    c() {
      div33 = element("div");
      div0 = element("div");
      div0.textContent = textContent;
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      div4 = element("div");
      button0 = element("button");
      create_component(arrowleft.$$.fragment);
      t3 = space();
      div3 = element("div");
      div1 = element("div");
      t4 = text("Solution ");
      t5 = text(t5_value);
      t6 = text(" of ");
      t7 = text(t7_value);
      t8 = space();
      div2 = element("div");
      t9 = text(
        /*currentNumWaysFulfilled*/
        ctx[2]
      );
      t10 = text(" fulfilled");
      t11 = space();
      button1 = element("button");
      create_component(arrowright.$$.fragment);
      t12 = space();
      div32 = element("div");
      div13 = element("div");
      div6 = element("div");
      div5 = element("div");
      div5.textContent = textContent_1;
      t14 = space();
      create_component(waysicons0.$$.fragment);
      t15 = space();
      div8 = element("div");
      div7 = element("div");
      div7.textContent = textContent_2;
      t17 = space();
      create_component(waysicons1.$$.fragment);
      t18 = space();
      div10 = element("div");
      div9 = element("div");
      div9.textContent = textContent_3;
      t20 = space();
      create_component(waysicons2.$$.fragment);
      t21 = space();
      div12 = element("div");
      div11 = element("div");
      div11.textContent = textContent_4;
      t23 = space();
      create_component(waysicons3.$$.fragment);
      t24 = space();
      div22 = element("div");
      div15 = element("div");
      div14 = element("div");
      div14.textContent = textContent_5;
      t26 = space();
      create_component(waysicons4.$$.fragment);
      t27 = space();
      div17 = element("div");
      div16 = element("div");
      div16.textContent = textContent_6;
      t29 = space();
      create_component(waysicons5.$$.fragment);
      t30 = space();
      div19 = element("div");
      div18 = element("div");
      div18.textContent = textContent_7;
      t32 = space();
      create_component(waysicons6.$$.fragment);
      t33 = space();
      div21 = element("div");
      div20 = element("div");
      div20.textContent = textContent_8;
      t35 = space();
      create_component(waysicons7.$$.fragment);
      t36 = space();
      div31 = element("div");
      div24 = element("div");
      div23 = element("div");
      div23.textContent = textContent_9;
      t38 = space();
      create_component(waysicons8.$$.fragment);
      t39 = space();
      div26 = element("div");
      div25 = element("div");
      div25.textContent = textContent_10;
      t41 = space();
      create_component(waysicons9.$$.fragment);
      t42 = space();
      div28 = element("div");
      div27 = element("div");
      div27.textContent = textContent_11;
      t44 = space();
      create_component(waysicons10.$$.fragment);
      t45 = space();
      div30 = element("div");
      div29 = element("div");
      div29.textContent = textContent_12;
      t47 = space();
      create_component(waysicons11.$$.fragment);
      this.h();
    },
    l(nodes) {
      div33 = claim_element(nodes, "DIV", { class: true });
      var div33_nodes = children(div33);
      div0 = claim_element(div33_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-1qomjr3")
        div0.textContent = textContent;
      t1 = claim_space(div33_nodes);
      if (if_block)
        if_block.l(div33_nodes);
      t2 = claim_space(div33_nodes);
      div4 = claim_element(div33_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      button0 = claim_element(div4_nodes, "BUTTON", { class: true });
      var button0_nodes = children(button0);
      claim_component(arrowleft.$$.fragment, button0_nodes);
      button0_nodes.forEach(detach);
      t3 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      t4 = claim_text(div1_nodes, "Solution ");
      t5 = claim_text(div1_nodes, t5_value);
      t6 = claim_text(div1_nodes, " of ");
      t7 = claim_text(div1_nodes, t7_value);
      div1_nodes.forEach(detach);
      t8 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      t9 = claim_text(
        div2_nodes,
        /*currentNumWaysFulfilled*/
        ctx[2]
      );
      t10 = claim_text(div2_nodes, " fulfilled");
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      t11 = claim_space(div4_nodes);
      button1 = claim_element(div4_nodes, "BUTTON", { class: true });
      var button1_nodes = children(button1);
      claim_component(arrowright.$$.fragment, button1_nodes);
      button1_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      t12 = claim_space(div33_nodes);
      div32 = claim_element(div33_nodes, "DIV", { class: true });
      var div32_nodes = children(div32);
      div13 = claim_element(div32_nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      div6 = claim_element(div13_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div5 = claim_element(div6_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div5) !== "svelte-8hwbmp")
        div5.textContent = textContent_1;
      t14 = claim_space(div6_nodes);
      claim_component(waysicons0.$$.fragment, div6_nodes);
      div6_nodes.forEach(detach);
      t15 = claim_space(div13_nodes);
      div8 = claim_element(div13_nodes, "DIV", { class: true });
      var div8_nodes = children(div8);
      div7 = claim_element(div8_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div7) !== "svelte-8hwbmp")
        div7.textContent = textContent_2;
      t17 = claim_space(div8_nodes);
      claim_component(waysicons1.$$.fragment, div8_nodes);
      div8_nodes.forEach(detach);
      t18 = claim_space(div13_nodes);
      div10 = claim_element(div13_nodes, "DIV", { class: true });
      var div10_nodes = children(div10);
      div9 = claim_element(div10_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div9) !== "svelte-1j4s5tk")
        div9.textContent = textContent_3;
      t20 = claim_space(div10_nodes);
      claim_component(waysicons2.$$.fragment, div10_nodes);
      div10_nodes.forEach(detach);
      t21 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      div11 = claim_element(div12_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div11) !== "svelte-1j4s5tk")
        div11.textContent = textContent_4;
      t23 = claim_space(div12_nodes);
      claim_component(waysicons3.$$.fragment, div12_nodes);
      div12_nodes.forEach(detach);
      div13_nodes.forEach(detach);
      t24 = claim_space(div32_nodes);
      div22 = claim_element(div32_nodes, "DIV", { class: true });
      var div22_nodes = children(div22);
      div15 = claim_element(div22_nodes, "DIV", { class: true });
      var div15_nodes = children(div15);
      div14 = claim_element(div15_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div14) !== "svelte-xodaov")
        div14.textContent = textContent_5;
      t26 = claim_space(div15_nodes);
      claim_component(waysicons4.$$.fragment, div15_nodes);
      div15_nodes.forEach(detach);
      t27 = claim_space(div22_nodes);
      div17 = claim_element(div22_nodes, "DIV", { class: true });
      var div17_nodes = children(div17);
      div16 = claim_element(div17_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div16) !== "svelte-xodaov")
        div16.textContent = textContent_6;
      t29 = claim_space(div17_nodes);
      claim_component(waysicons5.$$.fragment, div17_nodes);
      div17_nodes.forEach(detach);
      t30 = claim_space(div22_nodes);
      div19 = claim_element(div22_nodes, "DIV", { class: true });
      var div19_nodes = children(div19);
      div18 = claim_element(div19_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div18) !== "svelte-1d9k44s")
        div18.textContent = textContent_7;
      t32 = claim_space(div19_nodes);
      claim_component(waysicons6.$$.fragment, div19_nodes);
      div19_nodes.forEach(detach);
      t33 = claim_space(div22_nodes);
      div21 = claim_element(div22_nodes, "DIV", { class: true });
      var div21_nodes = children(div21);
      div20 = claim_element(div21_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div20) !== "svelte-1d9k44s")
        div20.textContent = textContent_8;
      t35 = claim_space(div21_nodes);
      claim_component(waysicons7.$$.fragment, div21_nodes);
      div21_nodes.forEach(detach);
      div22_nodes.forEach(detach);
      t36 = claim_space(div32_nodes);
      div31 = claim_element(div32_nodes, "DIV", { class: true });
      var div31_nodes = children(div31);
      div24 = claim_element(div31_nodes, "DIV", { class: true });
      var div24_nodes = children(div24);
      div23 = claim_element(div24_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div23) !== "svelte-gv1ou6")
        div23.textContent = textContent_9;
      t38 = claim_space(div24_nodes);
      claim_component(waysicons8.$$.fragment, div24_nodes);
      div24_nodes.forEach(detach);
      t39 = claim_space(div31_nodes);
      div26 = claim_element(div31_nodes, "DIV", { class: true });
      var div26_nodes = children(div26);
      div25 = claim_element(div26_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div25) !== "svelte-12z16cn")
        div25.textContent = textContent_10;
      t41 = claim_space(div26_nodes);
      claim_component(waysicons9.$$.fragment, div26_nodes);
      div26_nodes.forEach(detach);
      t42 = claim_space(div31_nodes);
      div28 = claim_element(div31_nodes, "DIV", { class: true });
      var div28_nodes = children(div28);
      div27 = claim_element(div28_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div27) !== "svelte-1dqkojz")
        div27.textContent = textContent_11;
      t44 = claim_space(div28_nodes);
      claim_component(waysicons10.$$.fragment, div28_nodes);
      div28_nodes.forEach(detach);
      t45 = claim_space(div31_nodes);
      div30 = claim_element(div31_nodes, "DIV", { class: true });
      var div30_nodes = children(div30);
      div29 = claim_element(div30_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div29) !== "svelte-158l35c")
        div29.textContent = textContent_12;
      t47 = claim_space(div30_nodes);
      claim_component(waysicons11.$$.fragment, div30_nodes);
      div30_nodes.forEach(detach);
      div31_nodes.forEach(detach);
      div32_nodes.forEach(detach);
      div33_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "title svelte-gg0kul");
      attr(button0, "class", "svelte-gg0kul");
      attr(div1, "class", "line1");
      attr(div2, "class", "line2");
      attr(div3, "class", "textStack");
      attr(button1, "class", "svelte-gg0kul");
      attr(div4, "class", "solutionTextContainer svelte-gg0kul");
      attr(div5, "class", "text svelte-gg0kul");
      attr(div6, "class", div6_class_value = null_to_empty("AII AII1 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][0]) + " svelte-gg0kul");
      attr(div7, "class", "text svelte-gg0kul");
      attr(div8, "class", div8_class_value = null_to_empty("AII AII1 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][1]) + " svelte-gg0kul");
      attr(div9, "class", "text svelte-gg0kul");
      attr(div10, "class", div10_class_value = null_to_empty("SI SI1 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][2]) + " svelte-gg0kul");
      attr(div11, "class", "text svelte-gg0kul");
      attr(div12, "class", div12_class_value = null_to_empty("SI SI2 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][3]) + " svelte-gg0kul");
      attr(div13, "class", "row1 svelte-gg0kul");
      attr(div14, "class", "text svelte-gg0kul");
      attr(div15, "class", div15_class_value = null_to_empty("SMA SMA1 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][4]) + " svelte-gg0kul");
      attr(div16, "class", "text svelte-gg0kul");
      attr(div17, "class", div17_class_value = null_to_empty("SMA SMA2 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][5]) + " svelte-gg0kul");
      attr(div18, "class", "text svelte-gg0kul");
      attr(div19, "class", div19_class_value = null_to_empty("CE CE1 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][6]) + " svelte-gg0kul");
      attr(div20, "class", "text svelte-gg0kul");
      attr(div21, "class", div21_class_value = null_to_empty("CE CE2 " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][7]) + " svelte-gg0kul");
      attr(div22, "class", "row2 svelte-gg0kul");
      attr(div23, "class", "text svelte-gg0kul");
      attr(div24, "class", div24_class_value = null_to_empty("AQR " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][8]) + " svelte-gg0kul");
      attr(div25, "class", "text svelte-gg0kul");
      attr(div26, "class", div26_class_value = null_to_empty("EDP " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][9]) + " svelte-gg0kul");
      attr(div27, "class", "text svelte-gg0kul");
      attr(div28, "class", div28_class_value = null_to_empty("ER " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][10]) + " svelte-gg0kul");
      attr(div29, "class", "text svelte-gg0kul");
      attr(div30, "class", div30_class_value = null_to_empty("FR " + /*waysGrids*/
      ctx[0][
        /*currentSolution*/
        ctx[1]
      ][11]) + " svelte-gg0kul");
      attr(div31, "class", "row3 svelte-gg0kul");
      attr(div32, "class", "table svelte-gg0kul");
      attr(div33, "class", "content svelte-gg0kul");
    },
    m(target, anchor) {
      insert_hydration(target, div33, anchor);
      append_hydration(div33, div0);
      append_hydration(div33, t1);
      if (if_block)
        if_block.m(div33, null);
      append_hydration(div33, t2);
      append_hydration(div33, div4);
      append_hydration(div4, button0);
      mount_component(arrowleft, button0, null);
      append_hydration(div4, t3);
      append_hydration(div4, div3);
      append_hydration(div3, div1);
      append_hydration(div1, t4);
      append_hydration(div1, t5);
      append_hydration(div1, t6);
      append_hydration(div1, t7);
      append_hydration(div3, t8);
      append_hydration(div3, div2);
      append_hydration(div2, t9);
      append_hydration(div2, t10);
      append_hydration(div4, t11);
      append_hydration(div4, button1);
      mount_component(arrowright, button1, null);
      append_hydration(div33, t12);
      append_hydration(div33, div32);
      append_hydration(div32, div13);
      append_hydration(div13, div6);
      append_hydration(div6, div5);
      append_hydration(div6, t14);
      mount_component(waysicons0, div6, null);
      append_hydration(div13, t15);
      append_hydration(div13, div8);
      append_hydration(div8, div7);
      append_hydration(div8, t17);
      mount_component(waysicons1, div8, null);
      append_hydration(div13, t18);
      append_hydration(div13, div10);
      append_hydration(div10, div9);
      append_hydration(div10, t20);
      mount_component(waysicons2, div10, null);
      append_hydration(div13, t21);
      append_hydration(div13, div12);
      append_hydration(div12, div11);
      append_hydration(div12, t23);
      mount_component(waysicons3, div12, null);
      append_hydration(div32, t24);
      append_hydration(div32, div22);
      append_hydration(div22, div15);
      append_hydration(div15, div14);
      append_hydration(div15, t26);
      mount_component(waysicons4, div15, null);
      append_hydration(div22, t27);
      append_hydration(div22, div17);
      append_hydration(div17, div16);
      append_hydration(div17, t29);
      mount_component(waysicons5, div17, null);
      append_hydration(div22, t30);
      append_hydration(div22, div19);
      append_hydration(div19, div18);
      append_hydration(div19, t32);
      mount_component(waysicons6, div19, null);
      append_hydration(div22, t33);
      append_hydration(div22, div21);
      append_hydration(div21, div20);
      append_hydration(div21, t35);
      mount_component(waysicons7, div21, null);
      append_hydration(div32, t36);
      append_hydration(div32, div31);
      append_hydration(div31, div24);
      append_hydration(div24, div23);
      append_hydration(div24, t38);
      mount_component(waysicons8, div24, null);
      append_hydration(div31, t39);
      append_hydration(div31, div26);
      append_hydration(div26, div25);
      append_hydration(div26, t41);
      mount_component(waysicons9, div26, null);
      append_hydration(div31, t42);
      append_hydration(div31, div28);
      append_hydration(div28, div27);
      append_hydration(div28, t44);
      mount_component(waysicons10, div28, null);
      append_hydration(div31, t45);
      append_hydration(div31, div30);
      append_hydration(div30, div29);
      append_hydration(div30, t47);
      mount_component(waysicons11, div30, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[5]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*errorMessage*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$9(ctx2);
          if_block.c();
          if_block.m(div33, t2);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if ((!current || dirty & /*currentSolution*/
      2) && t5_value !== (t5_value = /*currentSolution*/
      ctx2[1] + 1 + ""))
        set_data(t5, t5_value);
      if ((!current || dirty & /*waysGrids*/
      1) && t7_value !== (t7_value = /*waysGrids*/
      ctx2[0].length + ""))
        set_data(t7, t7_value);
      if (!current || dirty & /*currentNumWaysFulfilled*/
      4)
        set_data(
          t9,
          /*currentNumWaysFulfilled*/
          ctx2[2]
        );
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div6_class_value !== (div6_class_value = null_to_empty("AII AII1 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][0]) + " svelte-gg0kul")) {
        attr(div6, "class", div6_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div8_class_value !== (div8_class_value = null_to_empty("AII AII1 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][1]) + " svelte-gg0kul")) {
        attr(div8, "class", div8_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div10_class_value !== (div10_class_value = null_to_empty("SI SI1 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][2]) + " svelte-gg0kul")) {
        attr(div10, "class", div10_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div12_class_value !== (div12_class_value = null_to_empty("SI SI2 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][3]) + " svelte-gg0kul")) {
        attr(div12, "class", div12_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div15_class_value !== (div15_class_value = null_to_empty("SMA SMA1 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][4]) + " svelte-gg0kul")) {
        attr(div15, "class", div15_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div17_class_value !== (div17_class_value = null_to_empty("SMA SMA2 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][5]) + " svelte-gg0kul")) {
        attr(div17, "class", div17_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div19_class_value !== (div19_class_value = null_to_empty("CE CE1 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][6]) + " svelte-gg0kul")) {
        attr(div19, "class", div19_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div21_class_value !== (div21_class_value = null_to_empty("CE CE2 " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][7]) + " svelte-gg0kul")) {
        attr(div21, "class", div21_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div24_class_value !== (div24_class_value = null_to_empty("AQR " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][8]) + " svelte-gg0kul")) {
        attr(div24, "class", div24_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div26_class_value !== (div26_class_value = null_to_empty("EDP " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][9]) + " svelte-gg0kul")) {
        attr(div26, "class", div26_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div28_class_value !== (div28_class_value = null_to_empty("ER " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][10]) + " svelte-gg0kul")) {
        attr(div28, "class", div28_class_value);
      }
      if (!current || dirty & /*waysGrids, currentSolution*/
      3 && div30_class_value !== (div30_class_value = null_to_empty("FR " + /*waysGrids*/
      ctx2[0][
        /*currentSolution*/
        ctx2[1]
      ][11]) + " svelte-gg0kul")) {
        attr(div30, "class", div30_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(arrowleft.$$.fragment, local);
      transition_in(arrowright.$$.fragment, local);
      transition_in(waysicons0.$$.fragment, local);
      transition_in(waysicons1.$$.fragment, local);
      transition_in(waysicons2.$$.fragment, local);
      transition_in(waysicons3.$$.fragment, local);
      transition_in(waysicons4.$$.fragment, local);
      transition_in(waysicons5.$$.fragment, local);
      transition_in(waysicons6.$$.fragment, local);
      transition_in(waysicons7.$$.fragment, local);
      transition_in(waysicons8.$$.fragment, local);
      transition_in(waysicons9.$$.fragment, local);
      transition_in(waysicons10.$$.fragment, local);
      transition_in(waysicons11.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(arrowleft.$$.fragment, local);
      transition_out(arrowright.$$.fragment, local);
      transition_out(waysicons0.$$.fragment, local);
      transition_out(waysicons1.$$.fragment, local);
      transition_out(waysicons2.$$.fragment, local);
      transition_out(waysicons3.$$.fragment, local);
      transition_out(waysicons4.$$.fragment, local);
      transition_out(waysicons5.$$.fragment, local);
      transition_out(waysicons6.$$.fragment, local);
      transition_out(waysicons7.$$.fragment, local);
      transition_out(waysicons8.$$.fragment, local);
      transition_out(waysicons9.$$.fragment, local);
      transition_out(waysicons10.$$.fragment, local);
      transition_out(waysicons11.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div33);
      }
      if (if_block)
        if_block.d();
      destroy_component(arrowleft);
      destroy_component(arrowright);
      destroy_component(waysicons0);
      destroy_component(waysicons1);
      destroy_component(waysicons2);
      destroy_component(waysicons3);
      destroy_component(waysicons4);
      destroy_component(waysicons5);
      destroy_component(waysicons6);
      destroy_component(waysicons7);
      destroy_component(waysicons8);
      destroy_component(waysicons9);
      destroy_component(waysicons10);
      destroy_component(waysicons11);
      mounted = false;
      run_all(dispose);
    }
  };
}
function numWaysFulfilled(ways) {
  if (!ways) {
    return 0;
  }
  let count = 0;
  for (let i = 0; i < ways.length; i++) {
    if (ways[i] == "achieved") {
      count++;
    }
  }
  return count;
}
function isSuperset(waysFilling1, waysFilling2) {
  for (const key of ["AII", "SI", "SMA", "CE", "AQR", "EDP", "ER", "FR"]) {
    if (waysFilling1[key].have < waysFilling2[key].have) {
      return false;
    }
  }
  return true;
}
function instance$b($$self, $$props, $$invalidate) {
  let $courseTableList;
  component_subscribe($$self, courseTableList, ($$value) => $$invalidate(4, $courseTableList = $$value));
  let waysGrids = [];
  let currentSolution = 0;
  let currentNumWaysFulfilled = 0;
  let errorMessage = "";
  const click_handler = () => {
    $$invalidate(1, currentSolution--, currentSolution);
    if (currentSolution < 0) {
      $$invalidate(1, currentSolution = waysGrids.length - 1);
    }
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  const click_handler_1 = () => {
    $$invalidate(1, currentSolution++, currentSolution);
    if (currentSolution >= waysGrids.length) {
      $$invalidate(1, currentSolution = 0);
    }
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$courseTableList, waysGrids*/
    17) {
      {
        try {
          let ways = [];
          for (let i = 0; i < $courseTableList.length; i++) {
            let course = $courseTableList[i];
            if (course.ways.length > 0) {
              if (course.ways.length == 1 && course.ways[0] == "CE" && course.units_taking > 1) {
                ways.push(["CE"]);
              }
              ways.push(course.ways);
            }
          }
          let baselineWAYS = {
            AII: { have: 0, need: 2 },
            SI: { have: 0, need: 2 },
            SMA: { have: 0, need: 2 },
            CE: { have: 0, need: 2 },
            AQR: { have: 0, need: 1 },
            EDP: { have: 0, need: 1 },
            ER: { have: 0, need: 1 },
            FR: { have: 0, need: 1 }
          };
          ways.filter((way) => way.length == 1).forEach((way) => {
            if (baselineWAYS[way[0]].have < baselineWAYS[way[0]].need) {
              baselineWAYS[way[0]].have++;
            }
          });
          ways = ways.filter((way) => way.length == 2);
          for (let i = 0; i < 1e3; i++) {
            let notDiscard = [];
            let oldLength = ways.length;
            ways.forEach((way) => {
              let way1 = way[0];
              let needWay1 = baselineWAYS[way1].have < baselineWAYS[way1].need;
              let way2 = way[1];
              let needWay2 = baselineWAYS[way2].have < baselineWAYS[way2].need;
              let discard = false;
              if (!(needWay1 && needWay2)) {
                discard = true;
              }
              if (needWay1 && !needWay2) {
                baselineWAYS[way1].have++;
                if (way1 == "CE" && baselineWAYS["CE"].have == 1) {
                  baselineWAYS["CE"].have++;
                }
              } else if (needWay2 && !needWay1) {
                baselineWAYS[way2].have++;
                if (way2 == "CE" && baselineWAYS["CE"].have == 1) {
                  baselineWAYS["CE"].have++;
                }
              }
              if (!discard) {
                notDiscard.push(way);
              }
            });
            ways = notDiscard;
            if (ways.length == oldLength) {
              break;
            }
          }
          let possibleFillings = [];
          possibleFillings.push(baselineWAYS);
          for (let i = 0; i < ways.length; i++) {
            let newFillings = [];
            possibleFillings.forEach((filling) => {
              let filling1 = JSON.parse(JSON.stringify(filling));
              let filling2 = JSON.parse(JSON.stringify(filling));
              let way1 = ways[i][0];
              let way2 = ways[i][1];
              if (filling1[way1].have < filling1[way1].need) {
                filling1[way1].have++;
                if (way1 == "CE" && filling1["CE"].have == 1) {
                  filling1["CE"].have++;
                }
              }
              newFillings.push(filling1);
              if (filling2[way2].have < filling2[way2].need) {
                filling2[way2].have++;
                if (way2 == "CE" && filling2["CE"].have == 1) {
                  filling2["CE"].have++;
                }
              }
              newFillings.push(filling2);
            });
            possibleFillings = newFillings;
            possibleFillings = possibleFillings.filter((filling, index) => {
              let string = JSON.stringify(filling);
              return possibleFillings.findIndex((filling2) => {
                return JSON.stringify(filling2) == string;
              }) == index;
            });
          }
          let toDiscard = [];
          for (let i = 0; i < possibleFillings.length; i++) {
            for (let j = i + 1; j < possibleFillings.length; j++) {
              if (isSuperset(possibleFillings[i], possibleFillings[j])) {
                toDiscard.push(j);
              } else if (isSuperset(possibleFillings[j], possibleFillings[i])) {
                toDiscard.push(i);
              }
            }
          }
          possibleFillings = possibleFillings.filter((filling, index) => {
            return !toDiscard.includes(index);
          });
          possibleFillings.sort((a, b) => {
            let aCount = 0;
            let bCount = 0;
            for (const key of ["AII", "SI", "SMA", "CE", "AQR", "EDP", "ER", "FR"]) {
              aCount += a[key].have;
              bCount += b[key].have;
            }
            if (aCount > bCount) {
              return -1;
            }
            if (aCount < bCount) {
              return 1;
            }
            for (const key of ["AII", "SI", "SMA", "CE", "AQR", "EDP", "ER", "FR"]) {
              if (a[key].have > b[key].have) {
                return -1;
              }
              if (a[key].have < b[key].have) {
                return 1;
              }
            }
            return 0;
          });
          $$invalidate(0, waysGrids = []);
          possibleFillings.forEach((filling) => {
            let waysGrid = [];
            for (const key of ["AII", "SI", "SMA", "CE", "AQR", "EDP", "ER", "FR"]) {
              for (let i = 0; i < filling[key].need; i++) {
                if (filling[key].have > i) {
                  waysGrid.push("achieved");
                } else {
                  waysGrid.push("notAchieved");
                }
              }
            }
            waysGrids.push(waysGrid);
          });
          $$invalidate(3, errorMessage = "");
        } catch (e) {
          console.log(e);
          $$invalidate(3, errorMessage = "An error has occurred");
        }
      }
    }
    if ($$self.$$.dirty & /*currentSolution, waysGrids*/
    3) {
      {
        if (currentSolution >= waysGrids.length) {
          $$invalidate(1, currentSolution = 0);
        }
        $$invalidate(2, currentNumWaysFulfilled = numWaysFulfilled(waysGrids[currentSolution]));
      }
    }
  };
  return [
    waysGrids,
    currentSolution,
    currentNumWaysFulfilled,
    errorMessage,
    $courseTableList,
    click_handler,
    click_handler_1
  ];
}
class WAYSTracker extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$a, safe_not_equal, {});
  }
}
const QuarterDND_svelte_svelte_type_style_lang = "";
function get_each_context$5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[22] = list[i];
  return child_ctx;
}
function create_each_block$5(key_1, ctx) {
  let div;
  let course_1;
  let t;
  let rect;
  let stop_animation = noop;
  let current;
  course_1 = new Course({ props: { course: (
    /*course*/
    ctx[22]
  ) } });
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      create_component(course_1.$$.fragment);
      t = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      claim_component(course_1.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(course_1, div, null);
      append_hydration(div, t);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const course_1_changes = {};
      if (dirty & /*quarter*/
      1)
        course_1_changes.course = /*course*/
        ctx[22];
      course_1.$set(course_1_changes);
    },
    r() {
      rect = div.getBoundingClientRect();
    },
    f() {
      fix_position(div);
      stop_animation();
    },
    a() {
      stop_animation();
      stop_animation = create_animation(div, rect, flip, { duration: flipDurationMs$1 });
    },
    i(local) {
      if (current)
        return;
      transition_in(course_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(course_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(course_1);
    }
  };
}
function create_fragment$9(ctx) {
  let section;
  let div0;
  let t0_value = (
    /*$years*/
    ctx[7][
      /*y*/
      ctx[1]
    ] + " " + /*$quarters*/
    ctx[8][
      /*q*/
      ctx[2]
    ]
  );
  let t0;
  let t1;
  let div1;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let dndzone_action;
  let t2;
  let div6;
  let div2;
  let input;
  let t3;
  let button;
  let cornerdownleft;
  let t4;
  let div5;
  let div3;
  let t5;
  let t6;
  let div4;
  let t7;
  let current;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*quarter*/
    ctx[0].courses
  );
  const get_key = (ctx2) => (
    /*course*/
    ctx2[22].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$5(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
  }
  cornerdownleft = new CornerDownLeft({
    props: {
      size: "2em",
      color: (
        /*searchCourse*/
        ctx[4] ? "green" : "gray"
      )
    }
  });
  cornerdownleft.$on(
    "click",
    /*handleClick*/
    ctx[13]
  );
  return {
    c() {
      section = element("section");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      div6 = element("div");
      div2 = element("div");
      input = element("input");
      t3 = space();
      button = element("button");
      create_component(cornerdownleft.$$.fragment);
      t4 = space();
      div5 = element("div");
      div3 = element("div");
      t5 = text(
        /*totalHours*/
        ctx[5]
      );
      t6 = space();
      div4 = element("div");
      t7 = text(
        /*totalUnits*/
        ctx[6]
      );
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      div0 = claim_element(section_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, t0_value);
      div0_nodes.forEach(detach);
      t1 = claim_space(section_nodes);
      div1 = claim_element(section_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div1_nodes);
      }
      div1_nodes.forEach(detach);
      t2 = claim_space(section_nodes);
      div6 = claim_element(section_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div2 = claim_element(div6_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      input = claim_element(div2_nodes, "INPUT", {
        type: true,
        placeholder: true,
        class: true
      });
      t3 = claim_space(div2_nodes);
      button = claim_element(div2_nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      claim_component(cornerdownleft.$$.fragment, button_nodes);
      button_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      t4 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div3 = claim_element(div5_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      t5 = claim_text(
        div3_nodes,
        /*totalHours*/
        ctx[5]
      );
      div3_nodes.forEach(detach);
      t6 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      t7 = claim_text(
        div4_nodes,
        /*totalUnits*/
        ctx[6]
      );
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "title svelte-1y908un");
      attr(div1, "class", "courseDndList svelte-1y908un");
      attr(input, "type", "text");
      attr(input, "placeholder", "course");
      attr(input, "class", "svelte-1y908un");
      attr(button, "class", "svelte-1y908un");
      attr(div2, "class", "addCourse svelte-1y908un");
      attr(div3, "class", "totalHours svelte-1y908un");
      attr(div4, "class", "totalUnits svelte-1y908un");
      attr(div5, "class", "totals svelte-1y908un");
      attr(div6, "class", "bottomHalf svelte-1y908un");
      attr(section, "class", "svelte-1y908un");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      append_hydration(section, div0);
      append_hydration(div0, t0);
      append_hydration(section, t1);
      append_hydration(section, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append_hydration(section, t2);
      append_hydration(section, div6);
      append_hydration(div6, div2);
      append_hydration(div2, input);
      set_input_value(
        input,
        /*search*/
        ctx[3]
      );
      append_hydration(div2, t3);
      append_hydration(div2, button);
      mount_component(cornerdownleft, button, null);
      append_hydration(div6, t4);
      append_hydration(div6, div5);
      append_hydration(div5, div3);
      append_hydration(div3, t5);
      append_hydration(div5, t6);
      append_hydration(div5, div4);
      append_hydration(div4, t7);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(dndzone_action = dndzone.call(null, div1, {
            items: (
              /*quarter*/
              ctx[0].courses
            ),
            flipDurationMs: flipDurationMs$1,
            dropTargetStyle: {}
          })),
          listen(
            div1,
            "consider",
            /*consider_handler*/
            ctx[14]
          ),
          listen(
            div1,
            "finalize",
            /*finalize_handler*/
            ctx[15]
          ),
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[16]
          ),
          listen(
            input,
            "input",
            /*updateSearchCourse*/
            ctx[11]
          ),
          listen(
            input,
            "keydown",
            /*handleKeyDown*/
            ctx[12]
          ),
          listen(
            button,
            "click",
            /*handleClick*/
            ctx[13]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & /*$years, y, $quarters, q*/
      390) && t0_value !== (t0_value = /*$years*/
      ctx2[7][
        /*y*/
        ctx2[1]
      ] + " " + /*$quarters*/
      ctx2[8][
        /*q*/
        ctx2[2]
      ]))
        set_data(t0, t0_value);
      if (dirty & /*quarter*/
      1) {
        each_value = ensure_array_like(
          /*quarter*/
          ctx2[0].courses
        );
        group_outros();
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].r();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, fix_and_outro_and_destroy_block, create_each_block$5, null, get_each_context$5);
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].a();
        check_outros();
      }
      if (dndzone_action && is_function(dndzone_action.update) && dirty & /*quarter*/
      1)
        dndzone_action.update.call(null, {
          items: (
            /*quarter*/
            ctx2[0].courses
          ),
          flipDurationMs: flipDurationMs$1,
          dropTargetStyle: {}
        });
      if (dirty & /*search*/
      8 && input.value !== /*search*/
      ctx2[3]) {
        set_input_value(
          input,
          /*search*/
          ctx2[3]
        );
      }
      const cornerdownleft_changes = {};
      if (dirty & /*searchCourse*/
      16)
        cornerdownleft_changes.color = /*searchCourse*/
        ctx2[4] ? "green" : "gray";
      cornerdownleft.$set(cornerdownleft_changes);
      if (!current || dirty & /*totalHours*/
      32)
        set_data(
          t5,
          /*totalHours*/
          ctx2[5]
        );
      if (!current || dirty & /*totalUnits*/
      64)
        set_data(
          t7,
          /*totalUnits*/
          ctx2[6]
        );
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(cornerdownleft.$$.fragment, local);
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(cornerdownleft.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      destroy_component(cornerdownleft);
      mounted = false;
      run_all(dispose);
    }
  };
}
const flipDurationMs$1 = 200;
function calculateTotalHours(courses) {
  let total = 0;
  for (let i = 0; i < courses.length; i++) {
    let thisHours = courses[i].int_hours;
    if (thisHours != -1) {
      total += thisHours;
    }
  }
  return total;
}
function calculateTotalUnits$1(courses) {
  let total = 0;
  for (let i = 0; i < courses.length; i++) {
    let thisUnits = courses[i].units_taking;
    total += thisUnits;
  }
  return total;
}
function instance$a($$self, $$props, $$invalidate) {
  let $courseTable;
  let $allCourses;
  let $isDragging;
  let $years;
  let $quarters;
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(18, $courseTable = $$value));
  component_subscribe($$self, allCourses, ($$value) => $$invalidate(19, $allCourses = $$value));
  component_subscribe($$self, isDragging$1, ($$value) => $$invalidate(20, $isDragging = $$value));
  component_subscribe($$self, years, ($$value) => $$invalidate(7, $years = $$value));
  component_subscribe($$self, quarters, ($$value) => $$invalidate(8, $quarters = $$value));
  let { quarter } = $$props;
  let { y } = $$props;
  let { q } = $$props;
  let search = "";
  let searchCourse = null;
  let totalHours = 0;
  let totalUnits = 0;
  let scrollPosition = 0;
  function handleDndConsider(e, y2, q2) {
    scrollPosition = document.scrollingElement.scrollTop;
    set_store_value(courseTable, $courseTable[y2].quarters[q2].courses = e.detail.items, $courseTable);
    set_store_value(isDragging$1, $isDragging = true, $isDragging);
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  }
  function handleDndFinalize(e, y2, q2) {
    scrollPosition = document.scrollingElement.scrollTop;
    set_store_value(courseTable, $courseTable[y2].quarters[q2].courses = e.detail.items, $courseTable);
    set_store_value(isDragging$1, $isDragging = false, $isDragging);
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  }
  function updateSearchCourse(e) {
    let course = $allCourses.find((course2) => course2.code.toLowerCase().replace(/\s+/g, "") === search.toLowerCase().replace(/\s+/g, ""));
    if (course === void 0) {
      $$invalidate(4, searchCourse = null);
    }
    $$invalidate(4, searchCourse = course);
  }
  function addCourse() {
    $$invalidate(4, searchCourse = { ...searchCourse });
    $$invalidate(4, searchCourse.id = searchCourse.id.split("|")[0] + "|" + Math.random().toString(36).substring(7), searchCourse);
    $courseTable[y].quarters[q].courses.push(searchCourse);
    courseTable.set($courseTable);
    $$invalidate(4, searchCourse = null);
    $$invalidate(3, search = "");
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && searchCourse != null) {
      addCourse();
    }
  }
  function handleClick() {
    if (searchCourse != null) {
      addCourse();
    }
    const scrollPosition2 = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition2;
    });
  }
  const consider_handler = (e) => handleDndConsider(e, y, q);
  const finalize_handler = (e) => handleDndFinalize(e, y, q);
  function input_input_handler() {
    search = this.value;
    $$invalidate(3, search);
  }
  $$self.$$set = ($$props2) => {
    if ("quarter" in $$props2)
      $$invalidate(0, quarter = $$props2.quarter);
    if ("y" in $$props2)
      $$invalidate(1, y = $$props2.y);
    if ("q" in $$props2)
      $$invalidate(2, q = $$props2.q);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*quarter*/
    1) {
      {
        $$invalidate(5, totalHours = calculateTotalHours(quarter.courses));
        $$invalidate(6, totalUnits = calculateTotalUnits$1(quarter.courses));
      }
    }
  };
  return [
    quarter,
    y,
    q,
    search,
    searchCourse,
    totalHours,
    totalUnits,
    $years,
    $quarters,
    handleDndConsider,
    handleDndFinalize,
    updateSearchCourse,
    handleKeyDown,
    handleClick,
    consider_handler,
    finalize_handler,
    input_input_handler
  ];
}
class QuarterDND extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$9, safe_not_equal, { quarter: 0, y: 1, q: 2 });
  }
}
const PanelCollapseContainer_svelte_svelte_type_style_lang = "";
function create_else_block_1$3(ctx) {
  let chevronsdownup;
  let current;
  chevronsdownup = new ChevronsDownUp({});
  return {
    c() {
      create_component(chevronsdownup.$$.fragment);
    },
    l(nodes) {
      claim_component(chevronsdownup.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(chevronsdownup, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(chevronsdownup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chevronsdownup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(chevronsdownup, detaching);
    }
  };
}
function create_if_block_1$5(ctx) {
  let chevronsupdown;
  let current;
  chevronsupdown = new ChevronsUpDown({});
  return {
    c() {
      create_component(chevronsupdown.$$.fragment);
    },
    l(nodes) {
      claim_component(chevronsupdown.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(chevronsupdown, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(chevronsupdown.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chevronsupdown.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(chevronsupdown, detaching);
    }
  };
}
function create_else_block$4(ctx) {
  let div;
  let t;
  return {
    c() {
      div = element("div");
      t = text(
        /*panelName*/
        ctx[1]
      );
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t = claim_text(
        div_nodes,
        /*panelName*/
        ctx[1]
      );
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "hiddenNotif svelte-emj2nl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*panelName*/
      2)
        set_data(
          t,
          /*panelName*/
          ctx2[1]
        );
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$8(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*props*/
    ctx[3]
  ];
  var switch_value = (
    /*content*/
    ctx[2]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    if (dirty !== void 0 && dirty & /*props*/
    8) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*props*/
        ctx2[3]
      )]);
    } else {
      for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
      }
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*content*/
      4 && switch_value !== (switch_value = /*content*/
      ctx2[2])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*props*/
        8 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*props*/
          ctx2[3]
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_fragment$8(ctx) {
  let section;
  let button;
  let current_block_type_index;
  let if_block0;
  let t;
  let current_block_type_index_1;
  let if_block1;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_1$5, create_else_block_1$3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*$panelCollapsed*/
      ctx2[4][
        /*panelId*/
        ctx2[0]
      ]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const if_block_creators_1 = [create_if_block$8, create_else_block$4];
  const if_blocks_1 = [];
  function select_block_type_1(ctx2, dirty) {
    if (!/*$panelCollapsed*/
    ctx2[4][
      /*panelId*/
      ctx2[0]
    ])
      return 0;
    return 1;
  }
  current_block_type_index_1 = select_block_type_1(ctx);
  if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
  return {
    c() {
      section = element("section");
      button = element("button");
      if_block0.c();
      t = space();
      if_block1.c();
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      button = claim_element(section_nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      if_block0.l(button_nodes);
      button_nodes.forEach(detach);
      t = claim_space(section_nodes);
      if_block1.l(section_nodes);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "class", "switchPanelButton svelte-emj2nl");
      attr(section, "class", "svelte-emj2nl");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      append_hydration(section, button);
      if_blocks[current_block_type_index].m(button, null);
      append_hydration(section, t);
      if_blocks_1[current_block_type_index_1].m(section, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        }
        transition_in(if_block0, 1);
        if_block0.m(button, null);
      }
      let previous_block_index_1 = current_block_type_index_1;
      current_block_type_index_1 = select_block_type_1(ctx2);
      if (current_block_type_index_1 === previous_block_index_1) {
        if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
          if_blocks_1[previous_block_index_1] = null;
        });
        check_outros();
        if_block1 = if_blocks_1[current_block_type_index_1];
        if (!if_block1) {
          if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(section, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if_blocks[current_block_type_index].d();
      if_blocks_1[current_block_type_index_1].d();
      mounted = false;
      dispose();
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let $panelCollapsed;
  component_subscribe($$self, panelCollapsed, ($$value) => $$invalidate(4, $panelCollapsed = $$value));
  let { panelId } = $$props;
  let { panelName } = $$props;
  let { content } = $$props;
  let { props = {} } = $$props;
  const click_handler = () => {
    set_store_value(panelCollapsed, $panelCollapsed[panelId] = !$panelCollapsed[panelId], $panelCollapsed);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  $$self.$$set = ($$props2) => {
    if ("panelId" in $$props2)
      $$invalidate(0, panelId = $$props2.panelId);
    if ("panelName" in $$props2)
      $$invalidate(1, panelName = $$props2.panelName);
    if ("content" in $$props2)
      $$invalidate(2, content = $$props2.content);
    if ("props" in $$props2)
      $$invalidate(3, props = $$props2.props);
  };
  return [panelId, panelName, content, props, $panelCollapsed, click_handler];
}
class PanelCollapseContainer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$8, safe_not_equal, {
      panelId: 0,
      panelName: 1,
      content: 2,
      props: 3
    });
  }
}
const Grid_svelte_svelte_type_style_lang = "";
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[8] = list[i];
  child_ctx[10] = i;
  return child_ctx;
}
function get_each_context_1$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i];
  child_ctx[13] = i;
  return child_ctx;
}
function create_else_block_1$2(ctx) {
  let chevronsdownup;
  let current;
  chevronsdownup = new ChevronsDownUp({});
  return {
    c() {
      create_component(chevronsdownup.$$.fragment);
    },
    l(nodes) {
      claim_component(chevronsdownup.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(chevronsdownup, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(chevronsdownup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chevronsdownup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(chevronsdownup, detaching);
    }
  };
}
function create_if_block_2$4(ctx) {
  let chevronsupdown;
  let current;
  chevronsupdown = new ChevronsUpDown({});
  return {
    c() {
      create_component(chevronsupdown.$$.fragment);
    },
    l(nodes) {
      claim_component(chevronsupdown.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(chevronsupdown, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(chevronsupdown.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chevronsupdown.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(chevronsupdown, detaching);
    }
  };
}
function create_else_block$3(ctx) {
  let div;
  let t0_value = (
    /*year*/
    ctx[8].id + ""
  );
  let t0;
  let t1;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = text(" year");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_text(div_nodes, " year");
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "hiddenNotif svelte-p6nopf");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*$courseTable*/
      4 && t0_value !== (t0_value = /*year*/
      ctx2[8].id + ""))
        set_data(t0, t0_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$7(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let current;
  let each_value_1 = ensure_array_like(
    /*year*/
    ctx[8].quarters
  );
  const get_key = (ctx2) => (
    /*quarter*/
    ctx2[11].id
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$3(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$3(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "yearContainer svelte-p6nopf");
      attr(
        div,
        "style",
        /*rowStyle*/
        ctx[1]
      );
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*$courseTable, $panelCollapsed*/
      5) {
        each_value_1 = ensure_array_like(
          /*year*/
          ctx2[8].quarters
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1$3, null, get_each_context_1$3);
        check_outros();
      }
      if (!current || dirty & /*rowStyle*/
      2) {
        attr(
          div,
          "style",
          /*rowStyle*/
          ctx2[1]
        );
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_if_block_1$4(ctx) {
  let div;
  let quarterdnd;
  let t;
  let current;
  quarterdnd = new QuarterDND({
    props: {
      quarter: (
        /*quarter*/
        ctx[11]
      ),
      y: (
        /*y*/
        ctx[10]
      ),
      q: (
        /*q*/
        ctx[13]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(quarterdnd.$$.fragment);
      t = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(quarterdnd.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "quarterContainer svelte-p6nopf");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(quarterdnd, div, null);
      append_hydration(div, t);
      current = true;
    },
    p(ctx2, dirty) {
      const quarterdnd_changes = {};
      if (dirty & /*$courseTable*/
      4)
        quarterdnd_changes.quarter = /*quarter*/
        ctx2[11];
      if (dirty & /*$courseTable*/
      4)
        quarterdnd_changes.y = /*y*/
        ctx2[10];
      if (dirty & /*$courseTable*/
      4)
        quarterdnd_changes.q = /*q*/
        ctx2[13];
      quarterdnd.$set(quarterdnd_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(quarterdnd.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(quarterdnd.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(quarterdnd);
    }
  };
}
function create_each_block_1$3(key_1, ctx) {
  let first;
  let show_if = !/*$panelCollapsed*/
  ctx[0].summer || !/*quarter*/
  ctx[11].id.includes("Summer");
  let if_block_anchor;
  let current;
  let if_block = show_if && create_if_block_1$4(ctx);
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l(nodes) {
      first = empty();
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h() {
      this.first = first;
    },
    m(target, anchor) {
      insert_hydration(target, first, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*$panelCollapsed, $courseTable*/
      5)
        show_if = !/*$panelCollapsed*/
        ctx[0].summer || !/*quarter*/
        ctx[11].id.includes("Summer");
      if (show_if) {
        if (if_block) {
          if_block.p(ctx, dirty);
          if (dirty & /*$panelCollapsed, $courseTable*/
          5) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1$4(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_each_block$4(key_1, ctx) {
  let div;
  let button;
  let current_block_type_index;
  let if_block0;
  let t0;
  let current_block_type_index_1;
  let if_block1;
  let t1;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_2$4, create_else_block_1$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*$panelCollapsed*/
      ctx2[0].years[
        /*year*/
        ctx2[8].id
      ]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  function click_handler() {
    return (
      /*click_handler*/
      ctx[5](
        /*year*/
        ctx[8]
      )
    );
  }
  const if_block_creators_1 = [create_if_block$7, create_else_block$3];
  const if_blocks_1 = [];
  function select_block_type_1(ctx2, dirty) {
    if (!/*$panelCollapsed*/
    ctx2[0].years[
      /*year*/
      ctx2[8].id
    ])
      return 0;
    return 1;
  }
  current_block_type_index_1 = select_block_type_1(ctx);
  if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      button = element("button");
      if_block0.c();
      t0 = space();
      if_block1.c();
      t1 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      button = claim_element(div_nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      if_block0.l(button_nodes);
      button_nodes.forEach(detach);
      t0 = claim_space(div_nodes);
      if_block1.l(div_nodes);
      t1 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "class", "svelte-p6nopf");
      attr(div, "class", "yearAndCollapseButtonContainer svelte-p6nopf");
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, button);
      if_blocks[current_block_type_index].m(button, null);
      append_hydration(div, t0);
      if_blocks_1[current_block_type_index_1].m(div, null);
      append_hydration(div, t1);
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block0.c();
        }
        transition_in(if_block0, 1);
        if_block0.m(button, null);
      }
      let previous_block_index_1 = current_block_type_index_1;
      current_block_type_index_1 = select_block_type_1(ctx);
      if (current_block_type_index_1 === previous_block_index_1) {
        if_blocks_1[current_block_type_index_1].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
          if_blocks_1[previous_block_index_1] = null;
        });
        check_outros();
        if_block1 = if_blocks_1[current_block_type_index_1];
        if (!if_block1) {
          if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
          if_block1.c();
        } else {
          if_block1.p(ctx, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div, t1);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if_blocks[current_block_type_index].d();
      if_blocks_1[current_block_type_index_1].d();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$7(ctx) {
  let section;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let current;
  let each_value = ensure_array_like(
    /*$courseTable*/
    ctx[2]
  );
  const get_key = (ctx2) => (
    /*year*/
    ctx2[8].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$4(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
  }
  return {
    c() {
      section = element("section");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { style: true, class: true });
      var section_nodes = children(section);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(section_nodes);
      }
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(
        section,
        "style",
        /*sectionStyle*/
        ctx[3]()
      );
      attr(section, "class", "svelte-p6nopf");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(section, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*rowStyle, $courseTable, $panelCollapsed, document*/
      7) {
        each_value = ensure_array_like(
          /*$courseTable*/
          ctx2[2]
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let $panelCollapsed;
  let $quarters;
  let $years;
  let $courseTable;
  component_subscribe($$self, panelCollapsed, ($$value) => $$invalidate(0, $panelCollapsed = $$value));
  component_subscribe($$self, quarters, ($$value) => $$invalidate(4, $quarters = $$value));
  component_subscribe($$self, years, ($$value) => $$invalidate(7, $years = $$value));
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(2, $courseTable = $$value));
  if (typeof window !== "undefined") {
    document.body.clientWidth;
    window.addEventListener("resize", () => {
      document.body.clientWidth;
    });
  }
  function sectionStyle() {
    return "grid-template-rows: repeat(" + $years.length + ", 1fr)";
  }
  let rowStyle = "";
  const click_handler = (year) => {
    set_store_value(panelCollapsed, $panelCollapsed.years[year.id] = !$panelCollapsed.years[year.id], $panelCollapsed);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$quarters, $panelCollapsed*/
    17) {
      {
        $$invalidate(1, rowStyle = "grid-template-columns: repeat(" + ($quarters.length - ($panelCollapsed.summer ? 1 : 0)) + ", minmax(0, 1fr))");
      }
    }
  };
  return [
    $panelCollapsed,
    rowStyle,
    $courseTable,
    sectionStyle,
    $quarters,
    click_handler
  ];
}
class Grid extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$7, safe_not_equal, {});
  }
}
const GeneralizedDegreeTracker_svelte_svelte_type_style_lang = "";
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[8] = list[i];
  child_ctx[10] = i;
  return child_ctx;
}
function get_each_context_1$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i];
  child_ctx[13] = i;
  return child_ctx;
}
function create_if_block_2$3(ctx) {
  let div;
  let div_style_value;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "progressBar svelte-w8ydld");
      attr(div, "style", div_style_value = generateProgressStyle(
        /*cell*/
        ctx[11]
      ));
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*data*/
      1 && div_style_value !== (div_style_value = generateProgressStyle(
        /*cell*/
        ctx2[11]
      ))) {
        attr(div, "style", div_style_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_1$3(ctx) {
  let div;
  let info;
  let current;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[7](
        /*cell*/
        ctx[11]
      )
    );
  }
  info = new Info$1({ props: { size: "1.3em" } });
  info.$on("click", click_handler);
  return {
    c() {
      div = element("div");
      create_component(info.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(info.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "infoIcon svelte-w8ydld");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(info, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    i(local) {
      if (current)
        return;
      transition_in(info.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(info.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(info);
    }
  };
}
function create_each_block_1$2(key_1, ctx) {
  var _a, _b;
  let div;
  let t0_value = (
    /*cell*/
    (ctx[11].value ? (
      /*cell*/
      ctx[11].value
    ) : "") + ""
  );
  let t0;
  let t1;
  let t2;
  let div_style_value;
  let current;
  let if_block0 = (
    /*cell*/
    ((_a = ctx[11]) == null ? void 0 : _a.progress) && create_if_block_2$3(ctx)
  );
  let if_block1 = (
    /*cell*/
    ((_b = ctx[11]) == null ? void 0 : _b.info) && create_if_block_1$3(ctx)
  );
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      if (if_block0)
        if_block0.c();
      t2 = space();
      if (if_block1)
        if_block1.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_space(div_nodes);
      if (if_block0)
        if_block0.l(div_nodes);
      t2 = claim_space(div_nodes);
      if (if_block1)
        if_block1.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "cell svelte-w8ydld");
      attr(div, "style", div_style_value = generateCellStyle(
        /*cell*/
        ctx[11]
      ));
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      if (if_block0)
        if_block0.m(div, null);
      append_hydration(div, t2);
      if (if_block1)
        if_block1.m(div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      var _a2, _b2;
      ctx = new_ctx;
      if ((!current || dirty & /*data*/
      1) && t0_value !== (t0_value = /*cell*/
      (ctx[11].value ? (
        /*cell*/
        ctx[11].value
      ) : "") + ""))
        set_data(t0, t0_value);
      if (
        /*cell*/
        (_a2 = ctx[11]) == null ? void 0 : _a2.progress
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_2$3(ctx);
          if_block0.c();
          if_block0.m(div, t2);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*cell*/
        (_b2 = ctx[11]) == null ? void 0 : _b2.info
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
          if (dirty & /*data*/
          1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$3(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*data*/
      1 && div_style_value !== (div_style_value = generateCellStyle(
        /*cell*/
        ctx[11]
      ))) {
        attr(div, "style", div_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_each_block$3(key_1, ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let div_style_value;
  let current;
  let each_value_1 = ensure_array_like(
    /*row*/
    ctx[8].cells
  );
  const get_key = (ctx2) => (
    /*j*/
    ctx2[13]
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$2(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$2(key, child_ctx));
  }
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "row svelte-w8ydld");
      attr(div, "style", div_style_value = rowGridStyle(
        /*row*/
        ctx[8]
      ));
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*generateCellStyle, data, alert, generateProgressStyle*/
      1) {
        each_value_1 = ensure_array_like(
          /*row*/
          ctx[8].cells
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1$2, null, get_each_context_1$2);
        check_outros();
      }
      if (!current || dirty & /*data*/
      1 && div_style_value !== (div_style_value = rowGridStyle(
        /*row*/
        ctx[8]
      ))) {
        attr(div, "style", div_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_if_block$6(ctx) {
  let div2;
  let div0;
  let t0_value = (
    /*getQuarter*/
    ctx[6](
      /*$courseDataSlider*/
      ctx[4]
    ) + ""
  );
  let t0;
  let t1;
  let div1;
  let input;
  let input_max_value;
  let input_value_value;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      input = element("input");
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true, style: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, t0_value);
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      var div1_nodes = children(div1);
      input = claim_element(div1_nodes, "INPUT", {
        type: true,
        min: true,
        max: true,
        class: true
      });
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "cell svelte-w8ydld");
      set_style(div0, "height", "3em");
      attr(input, "type", "range");
      attr(input, "min", "0");
      attr(input, "max", input_max_value = /*$years*/
      ctx[3].length * /*$quarters*/
      ctx[2].length - 1);
      input.value = input_value_value = /*$years*/
      ctx[3].length * /*$quarters*/
      ctx[2].length - 1;
      attr(input, "class", "slider svelte-w8ydld");
      attr(div1, "class", "cell svelte-w8ydld");
      set_style(div1, "text-align", "center");
      set_style(div1, "padding", ".5em");
      attr(div2, "class", "row svelte-w8ydld");
      set_style(div2, "grid-template-columns", "1.65fr 4fr");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, input);
      if (!mounted) {
        dispose = listen(
          input,
          "input",
          /*handleSliderInput*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*$courseDataSlider*/
      16 && t0_value !== (t0_value = /*getQuarter*/
      ctx2[6](
        /*$courseDataSlider*/
        ctx2[4]
      ) + ""))
        set_data(t0, t0_value);
      if (dirty & /*$years, $quarters*/
      12 && input_max_value !== (input_max_value = /*$years*/
      ctx2[3].length * /*$quarters*/
      ctx2[2].length - 1)) {
        attr(input, "max", input_max_value);
      }
      if (dirty & /*$years, $quarters*/
      12 && input_value_value !== (input_value_value = /*$years*/
      ctx2[3].length * /*$quarters*/
      ctx2[2].length - 1)) {
        input.value = input_value_value;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$6(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t;
  let current;
  let each_value = ensure_array_like(
    /*data*/
    ctx[0].rows
  );
  const get_key = (ctx2) => (
    /*i*/
    ctx2[10]
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$3(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
  }
  let if_block = (
    /*showSlider*/
    ctx[1] && create_if_block$6(ctx)
  );
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      t = claim_space(div_nodes);
      if (if_block)
        if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "content svelte-w8ydld");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      append_hydration(div, t);
      if (if_block)
        if_block.m(div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*rowGridStyle, data, generateCellStyle, alert, generateProgressStyle*/
      1) {
        each_value = ensure_array_like(
          /*data*/
          ctx2[0].rows
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, t, get_each_context$3);
        check_outros();
      }
      if (
        /*showSlider*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$6(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block)
        if_block.d();
    }
  };
}
function generateCellStyle(cell) {
  let style = "";
  if (cell == null ? void 0 : cell.toggle) {
    style += "background-color: var(--color-good);";
  }
  if (cell == null ? void 0 : cell.isTitle) {
    style += "font-weight: bold;";
    style += "font-size: 2em;";
  }
  if (cell == null ? void 0 : cell.textAlign) {
    style += "text-align: " + cell.textAlign + ";";
  }
  if (!(cell == null ? void 0 : cell.noBorder)) {
    style += "border: 1px solid var(--color-text-light);";
  }
  return style;
}
function generateProgressStyle(cell) {
  let style = "";
  if (!(cell == null ? void 0 : cell.toggle) && (cell == null ? void 0 : cell.progress)) {
    let progressVal = cell.progress;
    if (typeof progressVal == "string" && progressVal.includes("/")) {
      let [num, denom] = progressVal.split("/");
      progressVal = parseInt(num) / parseInt(denom);
    }
    style += "width: " + progressVal * 100 + "%; ";
    let redStop = 0;
    let yellowStop = 0.5;
    let greenStop = 1;
    let red = 255;
    let green = 0;
    let blue = 0;
    if (progressVal > yellowStop) {
      red = 255 - (progressVal - yellowStop) / (greenStop - yellowStop) * 255;
      green = 255;
    }
    if (progressVal > redStop && progressVal < yellowStop) {
      red = 255;
      green = progressVal / yellowStop * 255;
    }
    style += "background-color: rgb(" + Math.round(red) + "," + Math.round(green) + "," + Math.round(blue) + ");";
  }
  return style;
}
function rowGridStyle(row) {
  let style = "";
  let totalWeight = 0;
  for (let cell of row.cells) {
    totalWeight += cell.weight || 1;
  }
  style += "grid-template-columns: ";
  for (let cell of row.cells) {
    style += (cell.weight || 1) / totalWeight + "fr ";
  }
  return style;
}
function instance$7($$self, $$props, $$invalidate) {
  let $quarters;
  let $years;
  let $courseDataSlider;
  component_subscribe($$self, quarters, ($$value) => $$invalidate(2, $quarters = $$value));
  component_subscribe($$self, years, ($$value) => $$invalidate(3, $years = $$value));
  component_subscribe($$self, courseDataSlider, ($$value) => $$invalidate(4, $courseDataSlider = $$value));
  let { data } = $$props;
  let { showSlider = false } = $$props;
  function handleSliderInput(event) {
    set_store_value(courseDataSlider, $courseDataSlider = parseInt(event.target.value), $courseDataSlider);
  }
  function getQuarter(index) {
    for (let year of $years) {
      for (let quarter of $quarters) {
        if (index == 0) {
          return year + " " + quarter;
        }
        index--;
      }
    }
  }
  const click_handler = (cell) => {
    alert(cell.info);
  };
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2)
      $$invalidate(0, data = $$props2.data);
    if ("showSlider" in $$props2)
      $$invalidate(1, showSlider = $$props2.showSlider);
  };
  return [
    data,
    showSlider,
    $quarters,
    $years,
    $courseDataSlider,
    handleSliderInput,
    getQuarter,
    click_handler
  ];
}
class GeneralizedDegreeTracker extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$6, safe_not_equal, { data: 0, showSlider: 1 });
  }
}
const CourseDataPanel_svelte_svelte_type_style_lang = "";
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[13] = list[i];
  return child_ctx;
}
function get_each_context_1$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  return child_ctx;
}
function get_each_context_2$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  return child_ctx;
}
function get_each_context_3$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[21] = list[i];
  child_ctx[23] = i;
  return child_ctx;
}
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[24] = list[i];
  return child_ctx;
}
function create_else_block_1$1(ctx) {
  let div;
  let b;
  let t0_value = (
    /*course*/
    ctx[0].max_units + ""
  );
  let t0;
  let t1;
  let t2_value = (
    /*unitsTaking*/
    ctx[1] == 1 ? "" : "s"
  );
  let t2;
  return {
    c() {
      div = element("div");
      b = element("b");
      t0 = text(t0_value);
      t1 = text(" unit");
      t2 = text(t2_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      b = claim_element(div_nodes, "B", {});
      var b_nodes = children(b);
      t0 = claim_text(b_nodes, t0_value);
      b_nodes.forEach(detach);
      t1 = claim_text(div_nodes, " unit");
      t2 = claim_text(div_nodes, t2_value);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "courseUnits svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, b);
      append_hydration(b, t0);
      append_hydration(div, t1);
      append_hydration(div, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1 && t0_value !== (t0_value = /*course*/
      ctx2[0].max_units + ""))
        set_data(t0, t0_value);
      if (dirty & /*unitsTaking*/
      2 && t2_value !== (t2_value = /*unitsTaking*/
      ctx2[1] == 1 ? "" : "s"))
        set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_7(ctx) {
  let div;
  let select;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t0;
  let t1_value = (
    /*unitsTaking*/
    ctx[1] == 1 ? "" : "s"
  );
  let t1;
  let mounted;
  let dispose;
  let each_value_4 = ensure_array_like(
    /*hoursArray*/
    ctx[3]
  );
  const get_key = (ctx2) => (
    /*i*/
    ctx2[24]
  );
  for (let i = 0; i < each_value_4.length; i += 1) {
    let child_ctx = get_each_context_4(ctx, each_value_4, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_4(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = text("\n					unit");
      t1 = text(t1_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      select = claim_element(div_nodes, "SELECT", { class: true });
      var select_nodes = children(select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select_nodes);
      }
      select_nodes.forEach(detach);
      t0 = claim_text(div_nodes, "\n					unit");
      t1 = claim_text(div_nodes, t1_value);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(select, "class", "svelte-1yiw3nv");
      attr(div, "class", "courseUnits svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*unitsTaking*/
        ctx[1]
      );
      append_hydration(div, t0);
      append_hydration(div, t1);
      if (!mounted) {
        dispose = listen(
          select,
          "change",
          /*updateUnitsTaking*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*hoursArray*/
      8) {
        each_value_4 = ensure_array_like(
          /*hoursArray*/
          ctx2[3]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_4, each_1_lookup, select, destroy_block, create_each_block_4, null, get_each_context_4);
      }
      if (dirty & /*unitsTaking, hoursArray*/
      10) {
        select_option(
          select,
          /*unitsTaking*/
          ctx2[1]
        );
      }
      if (dirty & /*unitsTaking*/
      2 && t1_value !== (t1_value = /*unitsTaking*/
      ctx2[1] == 1 ? "" : "s"))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_4(key_1, ctx) {
  let option;
  let t_value = (
    /*i*/
    ctx[24] + ""
  );
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option = claim_element(nodes, "OPTION", {});
      var option_nodes = children(option);
      t = claim_text(option_nodes, t_value);
      option_nodes.forEach(detach);
      this.h();
    },
    h() {
      option.__value = option_value_value = /*i*/
      ctx[24];
      set_input_value(option, option.__value);
      this.first = option;
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*hoursArray*/
      8 && t_value !== (t_value = /*i*/
      ctx[24] + ""))
        set_data(t, t_value);
      if (dirty & /*hoursArray*/
      8 && option_value_value !== (option_value_value = /*i*/
      ctx[24])) {
        option.__value = option_value_value;
        set_input_value(option, option.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_if_block_6(ctx) {
  let div;
  let t0_value = (
    /*course*/
    ctx[0].ways[0] + ""
  );
  let t0;
  let t1;
  let waysicons;
  let div_class_value;
  let current;
  waysicons = new WAYSIcons({
    props: { ways: (
      /*course*/
      ctx[0].ways[0]
    ) }
  });
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      create_component(waysicons.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_space(div_nodes);
      claim_component(waysicons.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = null_to_empty("WAYS " + /*course*/
      ctx[0].ways[0]) + " svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      mount_component(waysicons, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if ((!current || dirty & /*course*/
      1) && t0_value !== (t0_value = /*course*/
      ctx2[0].ways[0] + ""))
        set_data(t0, t0_value);
      const waysicons_changes = {};
      if (dirty & /*course*/
      1)
        waysicons_changes.ways = /*course*/
        ctx2[0].ways[0];
      waysicons.$set(waysicons_changes);
      if (!current || dirty & /*course*/
      1 && div_class_value !== (div_class_value = null_to_empty("WAYS " + /*course*/
      ctx2[0].ways[0]) + " svelte-1yiw3nv")) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(waysicons.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(waysicons.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(waysicons);
    }
  };
}
function create_if_block_5(ctx) {
  let div;
  let t0_value = (
    /*course*/
    ctx[0].ways[1] + ""
  );
  let t0;
  let t1;
  let waysicons;
  let div_class_value;
  let current;
  waysicons = new WAYSIcons({
    props: { ways: (
      /*course*/
      ctx[0].ways[1]
    ) }
  });
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      create_component(waysicons.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_space(div_nodes);
      claim_component(waysicons.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = null_to_empty("WAYS " + /*course*/
      ctx[0].ways[1]) + " svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      mount_component(waysicons, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if ((!current || dirty & /*course*/
      1) && t0_value !== (t0_value = /*course*/
      ctx2[0].ways[1] + ""))
        set_data(t0, t0_value);
      const waysicons_changes = {};
      if (dirty & /*course*/
      1)
        waysicons_changes.ways = /*course*/
        ctx2[0].ways[1];
      waysicons.$set(waysicons_changes);
      if (!current || dirty & /*course*/
      1 && div_class_value !== (div_class_value = null_to_empty("WAYS " + /*course*/
      ctx2[0].ways[1]) + " svelte-1yiw3nv")) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(waysicons.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(waysicons.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(waysicons);
    }
  };
}
function create_if_block_4(ctx) {
  let div;
  let t0;
  let t1_value = (
    /*course*/
    ctx[0].average_rating + ""
  );
  let t1;
  let t2;
  return {
    c() {
      div = element("div");
      t0 = text("Rated ");
      t1 = text(t1_value);
      t2 = text("/5");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, "Rated ");
      t1 = claim_text(div_nodes, t1_value);
      t2 = claim_text(div_nodes, "/5");
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "averageEval svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      append_hydration(div, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1 && t1_value !== (t1_value = /*course*/
      ctx2[0].average_rating + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_3(ctx) {
  let div;
  let t0;
  let t1_value = (
    /*course*/
    ctx[0].percent_outcomes_completed + ""
  );
  let t1;
  let t2;
  return {
    c() {
      div = element("div");
      t0 = text("Completion rate: ");
      t1 = text(t1_value);
      t2 = text("%");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, "Completion rate: ");
      t1 = claim_text(div_nodes, t1_value);
      t2 = claim_text(div_nodes, "%");
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "percentCompleted svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      append_hydration(div, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1 && t1_value !== (t1_value = /*course*/
      ctx2[0].percent_outcomes_completed + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_else_block$2(ctx) {
  let div1;
  let textContent = `<div class="season notOffered svelte-1yiw3nv">Not offered</div>`;
  return {
    c() {
      div1 = element("div");
      div1.innerHTML = textContent;
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-1r81aya")
        div1.innerHTML = textContent;
      this.h();
    },
    h() {
      attr(div1, "class", "seasonsOffered svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
    }
  };
}
function create_if_block_2$2(ctx) {
  let div;
  let each_value_3 = ensure_array_like(
    /*course*/
    ctx[0].seasons_offered
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "seasonsOffered svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1) {
        each_value_3 = ensure_array_like(
          /*course*/
          ctx2[0].seasons_offered
        );
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3$1(ctx2, each_value_3, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_3$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_3.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block_3$1(ctx) {
  let div;
  let t0_value = (
    /*season*/
    ctx[21] + ""
  );
  let t0;
  let t1;
  let div_class_value;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = null_to_empty("season " + /*season*/
      ctx[21]) + " svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*course*/
      1 && t0_value !== (t0_value = /*season*/
      ctx2[21] + ""))
        set_data(t0, t0_value);
      if (dirty & /*course*/
      1 && div_class_value !== (div_class_value = null_to_empty("season " + /*season*/
      ctx2[21]) + " svelte-1yiw3nv")) {
        attr(div, "class", div_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_2$1(ctx) {
  let div;
  let t_value = (
    /*r*/
    ctx[16] + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t = claim_text(div_nodes, t_value);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "review svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*reviewDataParsed*/
      4 && t_value !== (t_value = /*r*/
      ctx2[16] + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_1$1(ctx) {
  let div;
  let t_value = (
    /*r*/
    ctx[16] + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t = claim_text(div_nodes, t_value);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "review svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*reviewDataParsed*/
      4 && t_value !== (t_value = /*r*/
      ctx2[16] + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_1$2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "horizontalLine svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block$2(ctx) {
  let div6;
  let div0;
  let t0_value = (
    /*instructor*/
    ctx[13] + ""
  );
  let t0;
  let t1;
  let div5;
  let div2;
  let div1;
  let t2_value = (
    /*reviewDataParsed*/
    ctx[2].data[
      /*instructor*/
      ctx[13]
    ].positive.length + ""
  );
  let t2;
  let t3;
  let t4;
  let t5;
  let div4;
  let div3;
  let t6_value = (
    /*reviewDataParsed*/
    ctx[2].data[
      /*instructor*/
      ctx[13]
    ].negative.length + ""
  );
  let t6;
  let t7;
  let t8;
  let t9;
  let show_if = (
    /*instructor*/
    ctx[13] != Object.keys(
      /*reviewDataParsed*/
      ctx[2].data
    )[Object.keys(
      /*reviewDataParsed*/
      ctx[2].data
    ).length - 1]
  );
  let if_block_anchor;
  let each_value_2 = ensure_array_like(
    /*reviewDataParsed*/
    ctx[2].data[
      /*instructor*/
      ctx[13]
    ].positive
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
  }
  let each_value_1 = ensure_array_like(
    /*reviewDataParsed*/
    ctx[2].data[
      /*instructor*/
      ctx[13]
    ].negative
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
  }
  let if_block = show_if && create_if_block_1$2();
  return {
    c() {
      div6 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div5 = element("div");
      div2 = element("div");
      div1 = element("div");
      t2 = text(t2_value);
      t3 = text(" likely positive");
      t4 = space();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t5 = space();
      div4 = element("div");
      div3 = element("div");
      t6 = text(t6_value);
      t7 = text(" potentially negative");
      t8 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t9 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l(nodes) {
      div6 = claim_element(nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div0 = claim_element(div6_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, t0_value);
      div0_nodes.forEach(detach);
      t1 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div2 = claim_element(div5_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      t2 = claim_text(div1_nodes, t2_value);
      t3 = claim_text(div1_nodes, " likely positive");
      div1_nodes.forEach(detach);
      t4 = claim_space(div2_nodes);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].l(div2_nodes);
      }
      div2_nodes.forEach(detach);
      t5 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      t6 = claim_text(div3_nodes, t6_value);
      t7 = claim_text(div3_nodes, " potentially negative");
      div3_nodes.forEach(detach);
      t8 = claim_space(div4_nodes);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div4_nodes);
      }
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      t9 = claim_space(nodes);
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h() {
      attr(div0, "class", "teacherName svelte-1yiw3nv");
      attr(div1, "class", "positiveReviewCount svelte-1yiw3nv");
      attr(div2, "class", "positiveReviews svelte-1yiw3nv");
      attr(div3, "class", "negativeReviewCount svelte-1yiw3nv");
      attr(div4, "class", "negativeReviews svelte-1yiw3nv");
      attr(div5, "class", "reviewsBlock svelte-1yiw3nv");
      attr(div6, "class", "teachersBlock");
    },
    m(target, anchor) {
      insert_hydration(target, div6, anchor);
      append_hydration(div6, div0);
      append_hydration(div0, t0);
      append_hydration(div6, t1);
      append_hydration(div6, div5);
      append_hydration(div5, div2);
      append_hydration(div2, div1);
      append_hydration(div1, t2);
      append_hydration(div1, t3);
      append_hydration(div2, t4);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div2, null);
        }
      }
      append_hydration(div5, t5);
      append_hydration(div5, div4);
      append_hydration(div4, div3);
      append_hydration(div3, t6);
      append_hydration(div3, t7);
      append_hydration(div4, t8);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div4, null);
        }
      }
      insert_hydration(target, t9, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*reviewDataParsed*/
      4 && t0_value !== (t0_value = /*instructor*/
      ctx2[13] + ""))
        set_data(t0, t0_value);
      if (dirty & /*reviewDataParsed*/
      4 && t2_value !== (t2_value = /*reviewDataParsed*/
      ctx2[2].data[
        /*instructor*/
        ctx2[13]
      ].positive.length + ""))
        set_data(t2, t2_value);
      if (dirty & /*reviewDataParsed, Object*/
      4) {
        each_value_2 = ensure_array_like(
          /*reviewDataParsed*/
          ctx2[2].data[
            /*instructor*/
            ctx2[13]
          ].positive
        );
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2$1(ctx2, each_value_2, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_2$1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div2, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_2.length;
      }
      if (dirty & /*reviewDataParsed*/
      4 && t6_value !== (t6_value = /*reviewDataParsed*/
      ctx2[2].data[
        /*instructor*/
        ctx2[13]
      ].negative.length + ""))
        set_data(t6, t6_value);
      if (dirty & /*reviewDataParsed, Object*/
      4) {
        each_value_1 = ensure_array_like(
          /*reviewDataParsed*/
          ctx2[2].data[
            /*instructor*/
            ctx2[13]
          ].negative
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1$1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_1$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div4, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_1.length;
      }
      if (dirty & /*reviewDataParsed*/
      4)
        show_if = /*instructor*/
        ctx2[13] != Object.keys(
          /*reviewDataParsed*/
          ctx2[2].data
        )[Object.keys(
          /*reviewDataParsed*/
          ctx2[2].data
        ).length - 1];
      if (show_if) {
        if (if_block)
          ;
        else {
          if_block = create_if_block_1$2();
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div6);
        detach(t9);
        detach(if_block_anchor);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block$5(ctx) {
  let button;
  let pinoff;
  let current;
  let mounted;
  let dispose;
  pinoff = new PinOff({});
  return {
    c() {
      button = element("button");
      create_component(pinoff.$$.fragment);
      this.h();
    },
    l(nodes) {
      button = claim_element(nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      claim_component(pinoff.$$.fragment, button_nodes);
      button_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "class", "unpinButton svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, button, anchor);
      mount_component(pinoff, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[10]
        );
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(pinoff.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(pinoff.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      destroy_component(pinoff);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$5(ctx) {
  var _a, _b, _c, _d, _e;
  let div13;
  let div6;
  let div0;
  let span0;
  let t0_value = (
    /*course*/
    ctx[0].code + ""
  );
  let t0;
  let t1;
  let span1;
  let t2_value = (
    /*course*/
    ((_b = (_a = ctx[0]) == null ? void 0 : _a.long_title) == null ? void 0 : _b.substring(
      /*course*/
      ctx[0].long_title.indexOf(":") + 2
    )) + ""
  );
  let t2;
  let div0_style_value;
  let t3;
  let div4;
  let div1;
  let b;
  let t4_value = (
    /*course*/
    (ctx[0].int_hours == -1 ? 0 : (
      /*course*/
      ctx[0].int_hours
    )) + ""
  );
  let t4;
  let t5;
  let t6;
  let t7;
  let t8;
  let t9;
  let div2;
  let a0;
  let link0;
  let a0_href_value;
  let t10;
  let div3;
  let a1;
  let link1;
  let a1_href_value;
  let t11;
  let div5;
  let t12;
  let t13;
  let t14;
  let p;
  let t15_value = (
    /*course*/
    ctx[0].description + ""
  );
  let t15;
  let t16;
  let div12;
  let div7;
  let textContent = "Sentiment classification is AI-generated - categorizations may be inaccurate";
  let t18;
  let div11;
  let div8;
  let textContent_1 = "Overall review count:";
  let t20;
  let div9;
  let t21_value = (
    /*reviewDataParsed*/
    ((_c = ctx[2].totals) == null ? void 0 : _c.numPositive) + ""
  );
  let t21;
  let t22;
  let t23_value = (
    /*reviewDataParsed*/
    ((_d = ctx[2].totals) == null ? void 0 : _d.numNegative) + ""
  );
  let t23;
  let t24;
  let t25;
  let div10;
  let t26;
  let t27;
  let current;
  function select_block_type(ctx2, dirty) {
    if (
      /*course*/
      ctx2[0].min_units != /*course*/
      ctx2[0].max_units
    )
      return create_if_block_7;
    return create_else_block_1$1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = (
    /*course*/
    ctx[0].ways && /*course*/
    ctx[0].ways.length >= 1 && create_if_block_6(ctx)
  );
  let if_block2 = (
    /*course*/
    ctx[0].ways && /*course*/
    ctx[0].ways.length >= 2 && create_if_block_5(ctx)
  );
  link0 = new Link$1({ props: { size: linkSize } });
  link1 = new Link$1({ props: { class: "icon", size: linkSize } });
  let if_block3 = (
    /*course*/
    ctx[0].average_rating != -1 && create_if_block_4(ctx)
  );
  let if_block4 = (
    /*course*/
    ctx[0].percent_outcomes_completed != -1 && create_if_block_3(ctx)
  );
  function select_block_type_1(ctx2, dirty) {
    var _a2, _b2;
    if (
      /*course*/
      ((_b2 = (_a2 = ctx2[0]) == null ? void 0 : _a2.seasons_offered) == null ? void 0 : _b2.length) > 0
    )
      return create_if_block_2$2;
    return create_else_block$2;
  }
  let current_block_type_1 = select_block_type_1(ctx);
  let if_block5 = current_block_type_1(ctx);
  let each_value = ensure_array_like(Object.keys(
    /*reviewDataParsed*/
    (_e = ctx[2]) == null ? void 0 : _e.data
  ));
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  let if_block6 = (
    /*$selectedCoursePinned*/
    ctx[4] && create_if_block$5(ctx)
  );
  return {
    c() {
      div13 = element("div");
      div6 = element("div");
      div0 = element("div");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      span1 = element("span");
      t2 = text(t2_value);
      t3 = space();
      div4 = element("div");
      div1 = element("div");
      b = element("b");
      t4 = text(t4_value);
      t5 = text(" h/week");
      t6 = space();
      if_block0.c();
      t7 = space();
      if (if_block1)
        if_block1.c();
      t8 = space();
      if (if_block2)
        if_block2.c();
      t9 = space();
      div2 = element("div");
      a0 = element("a");
      create_component(link0.$$.fragment);
      t10 = space();
      div3 = element("div");
      a1 = element("a");
      create_component(link1.$$.fragment);
      t11 = space();
      div5 = element("div");
      if (if_block3)
        if_block3.c();
      t12 = space();
      if (if_block4)
        if_block4.c();
      t13 = space();
      if_block5.c();
      t14 = space();
      p = element("p");
      t15 = text(t15_value);
      t16 = space();
      div12 = element("div");
      div7 = element("div");
      div7.textContent = textContent;
      t18 = space();
      div11 = element("div");
      div8 = element("div");
      div8.textContent = textContent_1;
      t20 = space();
      div9 = element("div");
      t21 = text(t21_value);
      t22 = text(" likely positive,\n				");
      t23 = text(t23_value);
      t24 = text(" potentially negative");
      t25 = space();
      div10 = element("div");
      t26 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t27 = space();
      if (if_block6)
        if_block6.c();
      this.h();
    },
    l(nodes) {
      div13 = claim_element(nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      div6 = claim_element(div13_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div0 = claim_element(div6_nodes, "DIV", { class: true, style: true });
      var div0_nodes = children(div0);
      span0 = claim_element(div0_nodes, "SPAN", { class: true });
      var span0_nodes = children(span0);
      t0 = claim_text(span0_nodes, t0_value);
      span0_nodes.forEach(detach);
      t1 = claim_space(div0_nodes);
      span1 = claim_element(div0_nodes, "SPAN", { class: true });
      var span1_nodes = children(span1);
      t2 = claim_text(span1_nodes, t2_value);
      span1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t3 = claim_space(div6_nodes);
      div4 = claim_element(div6_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div1 = claim_element(div4_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      b = claim_element(div1_nodes, "B", {});
      var b_nodes = children(b);
      t4 = claim_text(b_nodes, t4_value);
      b_nodes.forEach(detach);
      t5 = claim_text(div1_nodes, " h/week");
      div1_nodes.forEach(detach);
      t6 = claim_space(div4_nodes);
      if_block0.l(div4_nodes);
      t7 = claim_space(div4_nodes);
      if (if_block1)
        if_block1.l(div4_nodes);
      t8 = claim_space(div4_nodes);
      if (if_block2)
        if_block2.l(div4_nodes);
      t9 = claim_space(div4_nodes);
      div2 = claim_element(div4_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      a0 = claim_element(div2_nodes, "A", { href: true, target: true });
      var a0_nodes = children(a0);
      claim_component(link0.$$.fragment, a0_nodes);
      a0_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      t10 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      a1 = claim_element(div3_nodes, "A", { href: true, target: true });
      var a1_nodes = children(a1);
      claim_component(link1.$$.fragment, a1_nodes);
      a1_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      t11 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      if (if_block3)
        if_block3.l(div5_nodes);
      t12 = claim_space(div5_nodes);
      if (if_block4)
        if_block4.l(div5_nodes);
      t13 = claim_space(div5_nodes);
      if_block5.l(div5_nodes);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      t14 = claim_space(div13_nodes);
      p = claim_element(div13_nodes, "P", { class: true });
      var p_nodes = children(p);
      t15 = claim_text(p_nodes, t15_value);
      p_nodes.forEach(detach);
      t16 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      div7 = claim_element(div12_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div7) !== "svelte-s5tfo8")
        div7.textContent = textContent;
      t18 = claim_space(div12_nodes);
      div11 = claim_element(div12_nodes, "DIV", { class: true });
      var div11_nodes = children(div11);
      div8 = claim_element(div11_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div8) !== "svelte-1xb4evx")
        div8.textContent = textContent_1;
      t20 = claim_space(div11_nodes);
      div9 = claim_element(div11_nodes, "DIV", { class: true });
      var div9_nodes = children(div9);
      t21 = claim_text(div9_nodes, t21_value);
      t22 = claim_text(div9_nodes, " likely positive,\n				");
      t23 = claim_text(div9_nodes, t23_value);
      t24 = claim_text(div9_nodes, " potentially negative");
      div9_nodes.forEach(detach);
      t25 = claim_space(div11_nodes);
      div10 = claim_element(div11_nodes, "DIV", { class: true });
      children(div10).forEach(detach);
      t26 = claim_space(div11_nodes);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div11_nodes);
      }
      div11_nodes.forEach(detach);
      div12_nodes.forEach(detach);
      t27 = claim_space(div13_nodes);
      if (if_block6)
        if_block6.l(div13_nodes);
      div13_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(span0, "class", "courseCode svelte-1yiw3nv");
      attr(span1, "class", "courseName svelte-1yiw3nv");
      attr(div0, "class", "courseCodeAndNameContainer svelte-1yiw3nv");
      attr(div0, "style", div0_style_value = courseColor(
        /*course*/
        ctx[0]
      ));
      attr(div1, "class", "courseHours svelte-1yiw3nv");
      attr(a0, "href", a0_href_value = 'https://explorecourses.stanford.edu/search?q="' + /*course*/
      ctx[0].code + '"');
      attr(a0, "target", "_blank");
      attr(div2, "class", "classLink svelte-1yiw3nv");
      attr(a1, "href", a1_href_value = /*course*/
      ctx[0].carta_link);
      attr(a1, "target", "_blank");
      attr(div3, "class", "classLink svelte-1yiw3nv");
      attr(div4, "class", "hoursUnitsWaysData svelte-1yiw3nv");
      attr(div5, "class", "ratingCompletionData svelte-1yiw3nv");
      attr(div6, "class", "header svelte-1yiw3nv");
      attr(p, "class", "courseDesc svelte-1yiw3nv");
      attr(div7, "class", "disclaimer svelte-1yiw3nv");
      attr(div8, "class", "totalsHeader svelte-1yiw3nv");
      attr(div9, "class", "totalsHeaderNonBold svelte-1yiw3nv");
      attr(div10, "class", "horizontalLine svelte-1yiw3nv");
      attr(div11, "class", "courseReviewsBlocks svelte-1yiw3nv");
      attr(div12, "class", "courseReviews svelte-1yiw3nv");
      attr(div13, "class", "content svelte-1yiw3nv");
    },
    m(target, anchor) {
      insert_hydration(target, div13, anchor);
      append_hydration(div13, div6);
      append_hydration(div6, div0);
      append_hydration(div0, span0);
      append_hydration(span0, t0);
      append_hydration(div0, t1);
      append_hydration(div0, span1);
      append_hydration(span1, t2);
      append_hydration(div6, t3);
      append_hydration(div6, div4);
      append_hydration(div4, div1);
      append_hydration(div1, b);
      append_hydration(b, t4);
      append_hydration(div1, t5);
      append_hydration(div4, t6);
      if_block0.m(div4, null);
      append_hydration(div4, t7);
      if (if_block1)
        if_block1.m(div4, null);
      append_hydration(div4, t8);
      if (if_block2)
        if_block2.m(div4, null);
      append_hydration(div4, t9);
      append_hydration(div4, div2);
      append_hydration(div2, a0);
      mount_component(link0, a0, null);
      append_hydration(div4, t10);
      append_hydration(div4, div3);
      append_hydration(div3, a1);
      mount_component(link1, a1, null);
      append_hydration(div6, t11);
      append_hydration(div6, div5);
      if (if_block3)
        if_block3.m(div5, null);
      append_hydration(div5, t12);
      if (if_block4)
        if_block4.m(div5, null);
      append_hydration(div5, t13);
      if_block5.m(div5, null);
      append_hydration(div13, t14);
      append_hydration(div13, p);
      append_hydration(p, t15);
      append_hydration(div13, t16);
      append_hydration(div13, div12);
      append_hydration(div12, div7);
      append_hydration(div12, t18);
      append_hydration(div12, div11);
      append_hydration(div11, div8);
      append_hydration(div11, t20);
      append_hydration(div11, div9);
      append_hydration(div9, t21);
      append_hydration(div9, t22);
      append_hydration(div9, t23);
      append_hydration(div9, t24);
      append_hydration(div11, t25);
      append_hydration(div11, div10);
      append_hydration(div11, t26);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div11, null);
        }
      }
      append_hydration(div13, t27);
      if (if_block6)
        if_block6.m(div13, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      var _a2, _b2, _c2, _d2, _e2;
      if ((!current || dirty & /*course*/
      1) && t0_value !== (t0_value = /*course*/
      ctx2[0].code + ""))
        set_data(t0, t0_value);
      if ((!current || dirty & /*course*/
      1) && t2_value !== (t2_value = /*course*/
      ((_b2 = (_a2 = ctx2[0]) == null ? void 0 : _a2.long_title) == null ? void 0 : _b2.substring(
        /*course*/
        ctx2[0].long_title.indexOf(":") + 2
      )) + ""))
        set_data(t2, t2_value);
      if (!current || dirty & /*course*/
      1 && div0_style_value !== (div0_style_value = courseColor(
        /*course*/
        ctx2[0]
      ))) {
        attr(div0, "style", div0_style_value);
      }
      if ((!current || dirty & /*course*/
      1) && t4_value !== (t4_value = /*course*/
      (ctx2[0].int_hours == -1 ? 0 : (
        /*course*/
        ctx2[0].int_hours
      )) + ""))
        set_data(t4, t4_value);
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div4, t7);
        }
      }
      if (
        /*course*/
        ctx2[0].ways && /*course*/
        ctx2[0].ways.length >= 1
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*course*/
          1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_6(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div4, t8);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*course*/
        ctx2[0].ways && /*course*/
        ctx2[0].ways.length >= 2
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & /*course*/
          1) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_5(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div4, t9);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*course*/
      1 && a0_href_value !== (a0_href_value = 'https://explorecourses.stanford.edu/search?q="' + /*course*/
      ctx2[0].code + '"')) {
        attr(a0, "href", a0_href_value);
      }
      if (!current || dirty & /*course*/
      1 && a1_href_value !== (a1_href_value = /*course*/
      ctx2[0].carta_link)) {
        attr(a1, "href", a1_href_value);
      }
      if (
        /*course*/
        ctx2[0].average_rating != -1
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_4(ctx2);
          if_block3.c();
          if_block3.m(div5, t12);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (
        /*course*/
        ctx2[0].percent_outcomes_completed != -1
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
        } else {
          if_block4 = create_if_block_3(ctx2);
          if_block4.c();
          if_block4.m(div5, t13);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
      if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx2)) && if_block5) {
        if_block5.p(ctx2, dirty);
      } else {
        if_block5.d(1);
        if_block5 = current_block_type_1(ctx2);
        if (if_block5) {
          if_block5.c();
          if_block5.m(div5, null);
        }
      }
      if ((!current || dirty & /*course*/
      1) && t15_value !== (t15_value = /*course*/
      ctx2[0].description + ""))
        set_data(t15, t15_value);
      if ((!current || dirty & /*reviewDataParsed*/
      4) && t21_value !== (t21_value = /*reviewDataParsed*/
      ((_c2 = ctx2[2].totals) == null ? void 0 : _c2.numPositive) + ""))
        set_data(t21, t21_value);
      if ((!current || dirty & /*reviewDataParsed*/
      4) && t23_value !== (t23_value = /*reviewDataParsed*/
      ((_d2 = ctx2[2].totals) == null ? void 0 : _d2.numNegative) + ""))
        set_data(t23, t23_value);
      if (dirty & /*Object, reviewDataParsed*/
      4) {
        each_value = ensure_array_like(Object.keys(
          /*reviewDataParsed*/
          (_e2 = ctx2[2]) == null ? void 0 : _e2.data
        ));
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div11, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (
        /*$selectedCoursePinned*/
        ctx2[4]
      ) {
        if (if_block6) {
          if_block6.p(ctx2, dirty);
          if (dirty & /*$selectedCoursePinned*/
          16) {
            transition_in(if_block6, 1);
          }
        } else {
          if_block6 = create_if_block$5(ctx2);
          if_block6.c();
          transition_in(if_block6, 1);
          if_block6.m(div13, null);
        }
      } else if (if_block6) {
        group_outros();
        transition_out(if_block6, 1, 1, () => {
          if_block6 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(link0.$$.fragment, local);
      transition_in(link1.$$.fragment, local);
      transition_in(if_block6);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(link0.$$.fragment, local);
      transition_out(link1.$$.fragment, local);
      transition_out(if_block6);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div13);
      }
      if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      destroy_component(link0);
      destroy_component(link1);
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      if_block5.d();
      destroy_each(each_blocks, detaching);
      if (if_block6)
        if_block6.d();
    }
  };
}
let linkSize = "20";
function instance$6($$self, $$props, $$invalidate) {
  let $courseTable;
  let $allCourses;
  let $reviewData;
  let $selectedCourse;
  let $selectedCoursePinned;
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(11, $courseTable = $$value));
  component_subscribe($$self, allCourses, ($$value) => $$invalidate(7, $allCourses = $$value));
  component_subscribe($$self, reviewData, ($$value) => $$invalidate(8, $reviewData = $$value));
  component_subscribe($$self, selectedCourse, ($$value) => $$invalidate(9, $selectedCourse = $$value));
  component_subscribe($$self, selectedCoursePinned, ($$value) => $$invalidate(4, $selectedCoursePinned = $$value));
  let course = {};
  let unitsTaking = 0;
  function updateUnitsTaking(e) {
    updateCourseById(course.id, "units_taking", +e.target.value);
    $$invalidate(0, course), $$invalidate(9, $selectedCourse), $$invalidate(7, $allCourses);
  }
  let thisReviewData = void 0;
  let reviewDataParsed = {
    totals: { numPositive: 0, numNegative: 0 },
    data: {}
  };
  let hoursArray = [];
  function updateCourseById(id, property, newValue) {
    for (let i = 0; i < $courseTable.length; i++) {
      for (let j = 0; j < $courseTable[i].quarters.length; j++) {
        for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
          if ($courseTable[i].quarters[j].courses[k].id == id) {
            set_store_value(courseTable, $courseTable[i].quarters[j].courses[k][property] = newValue, $courseTable);
            return;
          }
        }
      }
    }
  }
  const click_handler = () => {
    set_store_value(selectedCoursePinned, $selectedCoursePinned = false, $selectedCoursePinned);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$selectedCourse*/
    512) {
      $$invalidate(0, course = $selectedCourse);
    }
    if ($$self.$$.dirty & /*course, $allCourses*/
    129) {
      {
        if (!course.code) {
          let firstCourse = $allCourses.find((c) => c.code === "CS 106A");
          firstCourse = $allCourses[0];
          if (firstCourse) {
            $$invalidate(0, course = firstCourse);
          }
        }
      }
    }
    if ($$self.$$.dirty & /*unitsTaking, course*/
    3) {
      {
        if (unitsTaking != course.units_taking) {
          $$invalidate(1, unitsTaking = course.units_taking);
        }
      }
    }
    if ($$self.$$.dirty & /*course, $reviewData*/
    257) {
      {
        if (course.code && $reviewData != void 0) {
          $$invalidate(6, thisReviewData = $reviewData[course.code]);
        }
      }
    }
    if ($$self.$$.dirty & /*thisReviewData, course, reviewDataParsed*/
    69) {
      {
        if (thisReviewData) {
          $$invalidate(2, reviewDataParsed = {
            totals: { numPositive: 0, numNegative: 0 },
            data: {}
          });
          thisReviewData.forEach((r) => {
            let sentiment = parseFloat(r.substring(1, r.indexOf("]")));
            let rNoSentiment = r.substring(r.indexOf("]") + 1);
            let term = rNoSentiment.substring(2, rNoSentiment.indexOf("]"));
            let pastOfferings = course == null ? void 0 : course.past_offerings;
            let instructors = [];
            let thisInstructor = "";
            if (pastOfferings != void 0) {
              pastOfferings.forEach((offering) => {
                if (offering.term === term) {
                  instructors.push(offering.instructor_name);
                }
              });
            }
            if (instructors.length == 0) {
              thisInstructor = "Unknown";
            } else if (instructors.length == 1) {
              thisInstructor = instructors[0];
            } else if (instructors.length > 1) {
              thisInstructor = "One of several";
            }
            if (reviewDataParsed.data[thisInstructor] == void 0) {
              $$invalidate(2, reviewDataParsed.data[thisInstructor] = { positive: [], negative: [] }, reviewDataParsed);
            }
            const sentimentThreshold = -0.5;
            rNoSentiment = "[" + thisInstructor + "] " + rNoSentiment;
            if (sentiment > sentimentThreshold) {
              $$invalidate(2, reviewDataParsed.totals.numPositive++, reviewDataParsed);
              reviewDataParsed.data[thisInstructor].positive.push(rNoSentiment);
            } else if (sentiment <= sentimentThreshold) {
              $$invalidate(2, reviewDataParsed.totals.numNegative++, reviewDataParsed);
              reviewDataParsed.data[thisInstructor].negative.push(rNoSentiment);
            }
          });
          if (reviewDataParsed.data["One of several"] != void 0) {
            let val = reviewDataParsed.data["One of several"];
            delete reviewDataParsed.data["One of several"];
            $$invalidate(2, reviewDataParsed.data["One of several"] = val, reviewDataParsed);
          }
          if (reviewDataParsed.data["Unknown"] != void 0) {
            let val = reviewDataParsed.data["Unknown"];
            delete reviewDataParsed.data["Unknown"];
            $$invalidate(2, reviewDataParsed.data["Unknown"] = val, reviewDataParsed);
          }
        }
      }
    }
    if ($$self.$$.dirty & /*course*/
    1) {
      {
        $$invalidate(3, hoursArray = Array.from(
          {
            length: course.max_units - course.min_units + 1
          },
          (_, i) => course.min_units + i
        ));
      }
    }
  };
  return [
    course,
    unitsTaking,
    reviewDataParsed,
    hoursArray,
    $selectedCoursePinned,
    updateUnitsTaking,
    thisReviewData,
    $allCourses,
    $reviewData,
    $selectedCourse,
    click_handler
  ];
}
class CourseDataPanel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$5, safe_not_equal, {});
  }
}
const Trash_svelte_svelte_type_style_lang = "";
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[4] = list[i];
  return child_ctx;
}
function create_if_block$4(ctx) {
  let section;
  let div0;
  let trash2;
  let t;
  let div1;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let dndzone_action;
  let current;
  let mounted;
  let dispose;
  trash2 = new Trash2({ props: { size: "15em" } });
  let each_value = ensure_array_like(
    /*items*/
    ctx[0]
  );
  const get_key = (ctx2) => (
    /*item*/
    ctx2[4].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$1(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
  }
  return {
    c() {
      section = element("section");
      div0 = element("div");
      create_component(trash2.$$.fragment);
      t = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      div0 = claim_element(section_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      claim_component(trash2.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach);
      t = claim_space(section_nodes);
      div1 = claim_element(section_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div1_nodes);
      }
      div1_nodes.forEach(detach);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "trashIcon svelte-1afnv7n");
      attr(div1, "class", "dndzone svelte-1afnv7n");
      attr(section, "class", "svelte-1afnv7n");
    },
    m(target, anchor) {
      insert_hydration(target, section, anchor);
      append_hydration(section, div0);
      mount_component(trash2, div0, null);
      append_hydration(section, t);
      append_hydration(section, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(dndzone_action = dndzone.call(null, div1, {
            items: (
              /*items*/
              ctx[0]
            ),
            flipDurationMs,
            dropTargetStyle: {}
          })),
          listen(
            div1,
            "consider",
            /*handleDndConsider*/
            ctx[2]
          ),
          listen(
            div1,
            "finalize",
            /*handleDndFinalize*/
            ctx[3]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*items*/
      1) {
        each_value = ensure_array_like(
          /*items*/
          ctx2[0]
        );
        group_outros();
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].r();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].a();
        check_outros();
      }
      if (dndzone_action && is_function(dndzone_action.update) && dirty & /*items*/
      1)
        dndzone_action.update.call(null, {
          items: (
            /*items*/
            ctx2[0]
          ),
          flipDurationMs,
          dropTargetStyle: {}
        });
    },
    i(local) {
      if (current)
        return;
      transition_in(trash2.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(trash2.$$.fragment, local);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      destroy_component(trash2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block$1(key_1, ctx) {
  let div;
  let course;
  let t;
  let rect;
  let stop_animation = noop;
  let current;
  course = new Course({ props: { course: (
    /*item*/
    ctx[4]
  ) } });
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      create_component(course.$$.fragment);
      t = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      claim_component(course.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      this.first = div;
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(course, div, null);
      append_hydration(div, t);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const course_changes = {};
      if (dirty & /*items*/
      1)
        course_changes.course = /*item*/
        ctx[4];
      course.$set(course_changes);
    },
    r() {
      rect = div.getBoundingClientRect();
    },
    f() {
      fix_position(div);
      stop_animation();
    },
    a() {
      stop_animation();
      stop_animation = create_animation(div, rect, flip, { duration: flipDurationMs });
    },
    i(local) {
      if (current)
        return;
      transition_in(course.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(course.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(course);
    }
  };
}
function create_fragment$4(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$isDragging*/
    ctx[1] && create_if_block$4(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*$isDragging*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$isDragging*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$4(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
const flipDurationMs = 300;
function instance$5($$self, $$props, $$invalidate) {
  let $isDragging;
  component_subscribe($$self, isDragging$1, ($$value) => $$invalidate(1, $isDragging = $$value));
  let items = [];
  function handleDndConsider(e) {
    $$invalidate(0, items = e.detail.items);
    set_store_value(isDragging$1, $isDragging = true, $isDragging);
  }
  function handleDndFinalize(e) {
    $$invalidate(0, items = []);
    set_store_value(isDragging$1, $isDragging = false, $isDragging);
  }
  return [items, $isDragging, handleDndConsider, handleDndFinalize];
}
class Trash extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$4, safe_not_equal, {});
  }
}
const ConfigPanel_svelte_svelte_type_style_lang = "";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[33] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[33] = list[i];
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[38] = list[i];
  child_ctx[40] = i;
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[41] = list[i];
  child_ctx[42] = list;
  child_ctx[43] = i;
  return child_ctx;
}
function create_else_block_1(ctx) {
  let t;
  return {
    c() {
      t = text("Hide search");
    },
    l(nodes) {
      t = claim_text(nodes, "Hide search");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_2$1(ctx) {
  let t;
  return {
    c() {
      t = text("Show search");
    },
    l(nodes) {
      t = claim_text(nodes, "Show search");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_else_block$1(ctx) {
  let t;
  return {
    c() {
      t = text("Hide summer");
    },
    l(nodes) {
      t = claim_text(nodes, "Hide summer");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block_1$1(ctx) {
  let t;
  return {
    c() {
      t = text("Show summer");
    },
    l(nodes) {
      t = claim_text(nodes, "Show summer");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block$3(ctx) {
  let div4;
  let div3;
  let div2;
  let div0;
  let textContent = "Clear all courses?";
  let t1;
  let div1;
  let button0;
  let textContent_1 = "Yes";
  let t3;
  let button1;
  let textContent_2 = "No";
  let mounted;
  let dispose;
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      div0.textContent = textContent;
      t1 = space();
      div1 = element("div");
      button0 = element("button");
      button0.textContent = textContent_1;
      t3 = space();
      button1 = element("button");
      button1.textContent = textContent_2;
      this.h();
    },
    l(nodes) {
      div4 = claim_element(nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-z40frn")
        div0.textContent = textContent;
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      button0 = claim_element(div1_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button0) !== "svelte-x7e5es")
        button0.textContent = textContent_1;
      t3 = claim_space(div1_nodes);
      button1 = claim_element(div1_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button1) !== "svelte-1nt1gkl")
        button1.textContent = textContent_2;
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "modalTitle");
      attr(button0, "class", "svelte-lt0ixy");
      attr(button1, "class", "svelte-lt0ixy");
      attr(div1, "class", "modalButtons");
      attr(div2, "class", "modalContent");
      attr(div3, "class", "modal");
      attr(div4, "class", "clearCoursesModal");
    },
    m(target, anchor) {
      insert_hydration(target, div4, anchor);
      append_hydration(div4, div3);
      append_hydration(div3, div2);
      append_hydration(div2, div0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, button0);
      append_hydration(div1, t3);
      append_hydration(div1, button1);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler_4*/
            ctx[15]
          ),
          listen(
            button1,
            "click",
            /*click_handler_5*/
            ctx[16]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_3(ctx) {
  let div;
  let input;
  let t0;
  let t1_value = (
    /*courseTableData*/
    ctx[41] + ""
  );
  let t1;
  let t2;
  let mounted;
  let dispose;
  function input_change_handler() {
    ctx[17].call(
      input,
      /*courseTableData*/
      ctx[41]
    );
  }
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      input = claim_element(div_nodes, "INPUT", { type: true });
      t0 = claim_space(div_nodes);
      t1 = claim_text(div_nodes, t1_value);
      t2 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(input, "type", "checkbox");
      attr(div, "class", "checkbox svelte-lt0ixy");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, input);
      input.checked = /*$prefs*/
      ctx[5].courseTableData[
        /*courseTableData*/
        ctx[41]
      ];
      append_hydration(div, t0);
      append_hydration(div, t1);
      append_hydration(div, t2);
      if (!mounted) {
        dispose = [
          listen(input, "change", input_change_handler),
          listen(
            input,
            "change",
            /*change_handler*/
            ctx[18]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*$prefs*/
      32) {
        input.checked = /*$prefs*/
        ctx[5].courseTableData[
          /*courseTableData*/
          ctx[41]
        ];
      }
      if (dirty[0] & /*$prefs*/
      32 && t1_value !== (t1_value = /*courseTableData*/
      ctx[41] + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_2(ctx) {
  let option;
  let t_value = (
    /*transferUnit*/
    ctx[38].name + ""
  );
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option = claim_element(nodes, "OPTION", {});
      var option_nodes = children(option);
      t = claim_text(option_nodes, t_value);
      option_nodes.forEach(detach);
      this.h();
    },
    h() {
      option.__value = /*i*/
      ctx[40];
      set_input_value(option, option.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$prefs*/
      32 && t_value !== (t_value = /*transferUnit*/
      ctx2[38].name + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_each_block_1(ctx) {
  let option;
  let t_value = (
    /*choice*/
    ctx[33].degree + ""
  );
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option = claim_element(nodes, "OPTION", {});
      var option_nodes = children(option);
      t = claim_text(option_nodes, t_value);
      option_nodes.forEach(detach);
      this.h();
    },
    h() {
      option.__value = option_value_value = /*choice*/
      ctx[33].uniqueID;
      set_input_value(option, option.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$bachelorsDegreeChoices*/
      64 && t_value !== (t_value = /*choice*/
      ctx2[33].degree + ""))
        set_data(t, t_value);
      if (dirty[0] & /*$bachelorsDegreeChoices*/
      64 && option_value_value !== (option_value_value = /*choice*/
      ctx2[33].uniqueID)) {
        option.__value = option_value_value;
        set_input_value(option, option.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_each_block(ctx) {
  let option;
  let t_value = (
    /*choice*/
    ctx[33].degree + ""
  );
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option = claim_element(nodes, "OPTION", {});
      var option_nodes = children(option);
      t = claim_text(option_nodes, t_value);
      option_nodes.forEach(detach);
      this.h();
    },
    h() {
      option.__value = option_value_value = /*choice*/
      ctx[33].uniqueID;
      set_input_value(option, option.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$mastersDegreeChoices*/
      128 && t_value !== (t_value = /*choice*/
      ctx2[33].degree + ""))
        set_data(t, t_value);
      if (dirty[0] & /*$mastersDegreeChoices*/
      128 && option_value_value !== (option_value_value = /*choice*/
      ctx2[33].uniqueID)) {
        option.__value = option_value_value;
        set_input_value(option, option.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_fragment$3(ctx) {
  let div23;
  let div0;
  let textContent = "Settings";
  let t1;
  let div1;
  let textContent_1 = `<b>Collapse (left bar) when done</b>`;
  let t3;
  let div2;
  let textContent_2 = `<b>All data is stored locally; export frequently</b>`;
  let t5;
  let div9;
  let div3;
  let textContent_3 = `<a class="github-button" href="https://github.com/sambhavg/coursecorrect" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star sambhavg/coursecorrect on GitHub">Star</a>`;
  let t7;
  let div4;
  let button0;
  let textContent_4 = "Export data";
  let t9;
  let a1;
  let t10;
  let div5;
  let button1;
  let textContent_5 = "Import data";
  let t12;
  let input0;
  let t13;
  let div6;
  let button2;
  let t14;
  let div7;
  let button3;
  let t15;
  let div8;
  let button4;
  let textContent_6 = "Clear all courses";
  let t17;
  let t18;
  let div10;
  let textContent_7 = "Course data";
  let t20;
  let div11;
  let t21;
  let div12;
  let textContent_8 = `<b>Use checkboxes to add to masters degree or mark credit/satisfactory/no credit. Use bump button
			to bump a course down to the next requirement</b>`;
  let t23;
  let div14;
  let div13;
  let textContent_9 = "Transfer units";
  let t25;
  let select0;
  let t26;
  let input1;
  let t27;
  let div15;
  let textContent_10 = `<b>Set total transfer units, then AP units</b>`;
  let t29;
  let div22;
  let div16;
  let textContent_11 = "Degree checker";
  let t31;
  let div17;
  let select1;
  let select1_value_value;
  let t32;
  let div18;
  let select2;
  let select2_value_value;
  let t33;
  let div19;
  let textContent_12 = `<b>Add courses to masters degree by enabling &quot;checkboxes&quot; above, then checking courses as &quot;ms&quot;</b>`;
  let t35;
  let div20;
  let textContent_13 = `<b>The degree checker is designed to cover the 80% most common cases. There are no accuracy
				guarantees; consult official materials.</b>`;
  let t37;
  let div21;
  let textContent_14 = `Implemented degrees include those which have more than 50 students per year. Implementations
			are at <a href="https://github.com/SambhavG/coursecorrect/tree/main/src/routes/degrees" target="_blank">src/routes/degrees</a>`;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*$panelCollapsed*/
      ctx2[4].search
    )
      return create_if_block_2$1;
    return create_else_block_1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  function select_block_type_1(ctx2, dirty) {
    if (
      /*$panelCollapsed*/
      ctx2[4].summer
    )
      return create_if_block_1$1;
    return create_else_block$1;
  }
  let current_block_type_1 = select_block_type_1(ctx);
  let if_block1 = current_block_type_1(ctx);
  let if_block2 = (
    /*showClearCoursesModal*/
    ctx[0] && create_if_block$3(ctx)
  );
  let each_value_3 = ensure_array_like(Object.keys(
    /*$prefs*/
    ctx[5].courseTableData
  ));
  let each_blocks_3 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let each_value_2 = ensure_array_like(
    /*$prefs*/
    ctx[5].transferUnits
  );
  let each_blocks_2 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }
  let each_value_1 = ensure_array_like(
    /*$bachelorsDegreeChoices*/
    ctx[6]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = ensure_array_like(
    /*$mastersDegreeChoices*/
    ctx[7]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div23 = element("div");
      div0 = element("div");
      div0.textContent = textContent;
      t1 = space();
      div1 = element("div");
      div1.innerHTML = textContent_1;
      t3 = space();
      div2 = element("div");
      div2.innerHTML = textContent_2;
      t5 = space();
      div9 = element("div");
      div3 = element("div");
      div3.innerHTML = textContent_3;
      t7 = space();
      div4 = element("div");
      button0 = element("button");
      button0.textContent = textContent_4;
      t9 = space();
      a1 = element("a");
      t10 = space();
      div5 = element("div");
      button1 = element("button");
      button1.textContent = textContent_5;
      t12 = space();
      input0 = element("input");
      t13 = space();
      div6 = element("div");
      button2 = element("button");
      if_block0.c();
      t14 = space();
      div7 = element("div");
      button3 = element("button");
      if_block1.c();
      t15 = space();
      div8 = element("div");
      button4 = element("button");
      button4.textContent = textContent_6;
      t17 = space();
      if (if_block2)
        if_block2.c();
      t18 = space();
      div10 = element("div");
      div10.textContent = textContent_7;
      t20 = space();
      div11 = element("div");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t21 = space();
      div12 = element("div");
      div12.innerHTML = textContent_8;
      t23 = space();
      div14 = element("div");
      div13 = element("div");
      div13.textContent = textContent_9;
      t25 = space();
      select0 = element("select");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t26 = space();
      input1 = element("input");
      t27 = space();
      div15 = element("div");
      div15.innerHTML = textContent_10;
      t29 = space();
      div22 = element("div");
      div16 = element("div");
      div16.textContent = textContent_11;
      t31 = space();
      div17 = element("div");
      select1 = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t32 = space();
      div18 = element("div");
      select2 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t33 = space();
      div19 = element("div");
      div19.innerHTML = textContent_12;
      t35 = space();
      div20 = element("div");
      div20.innerHTML = textContent_13;
      t37 = space();
      div21 = element("div");
      div21.innerHTML = textContent_14;
      this.h();
    },
    l(nodes) {
      div23 = claim_element(nodes, "DIV", { class: true });
      var div23_nodes = children(div23);
      div0 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-h3vxd0")
        div0.textContent = textContent;
      t1 = claim_space(div23_nodes);
      div1 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-18ev73z")
        div1.innerHTML = textContent_1;
      t3 = claim_space(div23_nodes);
      div2 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div2) !== "svelte-lh84ox")
        div2.innerHTML = textContent_2;
      t5 = claim_space(div23_nodes);
      div9 = claim_element(div23_nodes, "DIV", { class: true });
      var div9_nodes = children(div9);
      div3 = claim_element(div9_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div3) !== "svelte-13y94bh")
        div3.innerHTML = textContent_3;
      t7 = claim_space(div9_nodes);
      div4 = claim_element(div9_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      button0 = claim_element(div4_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button0) !== "svelte-1hst2fi")
        button0.textContent = textContent_4;
      t9 = claim_space(div4_nodes);
      a1 = claim_element(div4_nodes, "A", { id: true, style: true });
      children(a1).forEach(detach);
      div4_nodes.forEach(detach);
      t10 = claim_space(div9_nodes);
      div5 = claim_element(div9_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      button1 = claim_element(div5_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button1) !== "svelte-kga8sx")
        button1.textContent = textContent_5;
      t12 = claim_space(div5_nodes);
      input0 = claim_element(div5_nodes, "INPUT", { id: true, type: true, style: true });
      div5_nodes.forEach(detach);
      t13 = claim_space(div9_nodes);
      div6 = claim_element(div9_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      button2 = claim_element(div6_nodes, "BUTTON", { class: true });
      var button2_nodes = children(button2);
      if_block0.l(button2_nodes);
      button2_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      t14 = claim_space(div9_nodes);
      div7 = claim_element(div9_nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      button3 = claim_element(div7_nodes, "BUTTON", { class: true });
      var button3_nodes = children(button3);
      if_block1.l(button3_nodes);
      button3_nodes.forEach(detach);
      div7_nodes.forEach(detach);
      t15 = claim_space(div9_nodes);
      div8 = claim_element(div9_nodes, "DIV", { class: true });
      var div8_nodes = children(div8);
      button4 = claim_element(div8_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button4) !== "svelte-1lxrguf")
        button4.textContent = textContent_6;
      t17 = claim_space(div8_nodes);
      if (if_block2)
        if_block2.l(div8_nodes);
      div8_nodes.forEach(detach);
      div9_nodes.forEach(detach);
      t18 = claim_space(div23_nodes);
      div10 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div10) !== "svelte-16udskt")
        div10.textContent = textContent_7;
      t20 = claim_space(div23_nodes);
      div11 = claim_element(div23_nodes, "DIV", { class: true });
      var div11_nodes = children(div11);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].l(div11_nodes);
      }
      div11_nodes.forEach(detach);
      t21 = claim_space(div23_nodes);
      div12 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div12) !== "svelte-waodzu")
        div12.innerHTML = textContent_8;
      t23 = claim_space(div23_nodes);
      div14 = claim_element(div23_nodes, "DIV", { class: true });
      var div14_nodes = children(div14);
      div13 = claim_element(div14_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div13) !== "svelte-k80iny")
        div13.textContent = textContent_9;
      t25 = claim_space(div14_nodes);
      select0 = claim_element(div14_nodes, "SELECT", { class: true });
      var select0_nodes = children(select0);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].l(select0_nodes);
      }
      select0_nodes.forEach(detach);
      t26 = claim_space(div14_nodes);
      input1 = claim_element(div14_nodes, "INPUT", {
        class: true,
        type: true,
        placeholder: true
      });
      div14_nodes.forEach(detach);
      t27 = claim_space(div23_nodes);
      div15 = claim_element(div23_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div15) !== "svelte-m652ny")
        div15.innerHTML = textContent_10;
      t29 = claim_space(div23_nodes);
      div22 = claim_element(div23_nodes, "DIV", { class: true });
      var div22_nodes = children(div22);
      div16 = claim_element(div22_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div16) !== "svelte-s3awp9")
        div16.textContent = textContent_11;
      t31 = claim_space(div22_nodes);
      div17 = claim_element(div22_nodes, "DIV", { class: true });
      var div17_nodes = children(div17);
      select1 = claim_element(div17_nodes, "SELECT", { class: true });
      var select1_nodes = children(select1);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].l(select1_nodes);
      }
      select1_nodes.forEach(detach);
      div17_nodes.forEach(detach);
      t32 = claim_space(div22_nodes);
      div18 = claim_element(div22_nodes, "DIV", { class: true });
      var div18_nodes = children(div18);
      select2 = claim_element(div18_nodes, "SELECT", { class: true });
      var select2_nodes = children(select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select2_nodes);
      }
      select2_nodes.forEach(detach);
      div18_nodes.forEach(detach);
      t33 = claim_space(div22_nodes);
      div19 = claim_element(div22_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div19) !== "svelte-qi0sf3")
        div19.innerHTML = textContent_12;
      t35 = claim_space(div22_nodes);
      div20 = claim_element(div22_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div20) !== "svelte-1n9iha1")
        div20.innerHTML = textContent_13;
      t37 = claim_space(div22_nodes);
      div21 = claim_element(div22_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div21) !== "svelte-gzijyw")
        div21.innerHTML = textContent_14;
      div22_nodes.forEach(detach);
      div23_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "title svelte-lt0ixy");
      attr(div1, "class", "info svelte-lt0ixy");
      attr(div2, "class", "info svelte-lt0ixy");
      attr(div3, "class", "githubButton");
      attr(button0, "class", "svelte-lt0ixy");
      attr(a1, "id", "downloadAnchorElem");
      set_style(a1, "display", "none");
      attr(div4, "class", "exportAllData");
      attr(button1, "class", "svelte-lt0ixy");
      attr(input0, "id", "importDataInput");
      attr(input0, "type", "file");
      set_style(input0, "display", "none");
      attr(div5, "class", "importData");
      attr(button2, "class", "svelte-lt0ixy");
      attr(div6, "class", "showHideSearch");
      attr(button3, "class", "svelte-lt0ixy");
      attr(div7, "class", "showHideSummer");
      attr(button4, "class", "svelte-lt0ixy");
      attr(div8, "class", "clearContainer");
      attr(div9, "class", "buttonContainer svelte-lt0ixy");
      attr(div10, "class", "header svelte-lt0ixy");
      attr(div11, "class", "courseTableDataCheckboxes svelte-lt0ixy");
      attr(div12, "class", "info svelte-lt0ixy");
      attr(div13, "class", "header svelte-lt0ixy");
      attr(select0, "class", "svelte-lt0ixy");
      attr(input1, "class", "transferUnitUnits svelte-lt0ixy");
      attr(input1, "type", "number");
      attr(input1, "placeholder", "Transfer unit units");
      attr(div14, "class", "transferUnits svelte-lt0ixy");
      attr(div15, "class", "info svelte-lt0ixy");
      attr(div16, "class", "header svelte-lt0ixy");
      attr(select1, "class", "degreeDropdown svelte-lt0ixy");
      attr(div17, "class", "bachelorsDegreeDropdown svelte-lt0ixy");
      attr(select2, "class", "degreeDropdown svelte-lt0ixy");
      attr(div18, "class", "bachelorsDegreeDropdown svelte-lt0ixy");
      attr(div19, "class", "info svelte-lt0ixy");
      attr(div20, "class", "info svelte-lt0ixy");
      attr(div21, "class", "info svelte-lt0ixy");
      attr(div22, "class", "degreeCheckerConfig svelte-lt0ixy");
      attr(div23, "class", "content svelte-lt0ixy");
    },
    m(target, anchor) {
      var _a, _b;
      insert_hydration(target, div23, anchor);
      append_hydration(div23, div0);
      append_hydration(div23, t1);
      append_hydration(div23, div1);
      append_hydration(div23, t3);
      append_hydration(div23, div2);
      append_hydration(div23, t5);
      append_hydration(div23, div9);
      append_hydration(div9, div3);
      append_hydration(div9, t7);
      append_hydration(div9, div4);
      append_hydration(div4, button0);
      append_hydration(div4, t9);
      append_hydration(div4, a1);
      append_hydration(div9, t10);
      append_hydration(div9, div5);
      append_hydration(div5, button1);
      append_hydration(div5, t12);
      append_hydration(div5, input0);
      append_hydration(div9, t13);
      append_hydration(div9, div6);
      append_hydration(div6, button2);
      if_block0.m(button2, null);
      append_hydration(div9, t14);
      append_hydration(div9, div7);
      append_hydration(div7, button3);
      if_block1.m(button3, null);
      append_hydration(div9, t15);
      append_hydration(div9, div8);
      append_hydration(div8, button4);
      append_hydration(div8, t17);
      if (if_block2)
        if_block2.m(div8, null);
      append_hydration(div23, t18);
      append_hydration(div23, div10);
      append_hydration(div23, t20);
      append_hydration(div23, div11);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        if (each_blocks_3[i]) {
          each_blocks_3[i].m(div11, null);
        }
      }
      append_hydration(div23, t21);
      append_hydration(div23, div12);
      append_hydration(div23, t23);
      append_hydration(div23, div14);
      append_hydration(div14, div13);
      append_hydration(div14, t25);
      append_hydration(div14, select0);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(select0, null);
        }
      }
      append_hydration(div14, t26);
      append_hydration(div14, input1);
      set_input_value(
        input1,
        /*$prefs*/
        ctx[5].transferUnits[
          /*selectedTransferUnit*/
          ctx[1]
        ].value
      );
      append_hydration(div23, t27);
      append_hydration(div23, div15);
      append_hydration(div23, t29);
      append_hydration(div23, div22);
      append_hydration(div22, div16);
      append_hydration(div22, t31);
      append_hydration(div22, div17);
      append_hydration(div17, select1);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(select1, null);
        }
      }
      select_option(
        select1,
        //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
        /*$bachelorsDegreeChoices*/
        (_a = ctx[6].find(
          /*func*/
          ctx[22]
        )) == null ? void 0 : _a.uniqueID
      );
      append_hydration(div22, t32);
      append_hydration(div22, div18);
      append_hydration(div18, select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select2, null);
        }
      }
      select_option(
        select2,
        //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
        /*$mastersDegreeChoices*/
        (_b = ctx[7].find(
          /*func_1*/
          ctx[24]
        )) == null ? void 0 : _b.uniqueID
      );
      append_hydration(div22, t33);
      append_hydration(div22, div19);
      append_hydration(div22, t35);
      append_hydration(div22, div20);
      append_hydration(div22, t37);
      append_hydration(div22, div21);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*downloadData*/
            ctx[9]
          ),
          listen(
            button1,
            "click",
            /*click_handler*/
            ctx[11]
          ),
          listen(
            input0,
            "change",
            /*importData*/
            ctx[10]
          ),
          listen(
            button2,
            "click",
            /*click_handler_1*/
            ctx[12]
          ),
          listen(
            button3,
            "click",
            /*click_handler_2*/
            ctx[13]
          ),
          listen(
            button4,
            "click",
            /*click_handler_3*/
            ctx[14]
          ),
          listen(
            select0,
            "change",
            /*change_handler_1*/
            ctx[19]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[20]
          ),
          listen(
            input1,
            "change",
            /*change_handler_2*/
            ctx[21]
          ),
          listen(
            select1,
            "change",
            /*change_handler_3*/
            ctx[23]
          ),
          listen(
            select2,
            "change",
            /*change_handler_4*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      var _a, _b, _c, _d;
      if (current_block_type !== (current_block_type = select_block_type(ctx2))) {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(button2, null);
        }
      }
      if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx2))) {
        if_block1.d(1);
        if_block1 = current_block_type_1(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(button3, null);
        }
      }
      if (
        /*showClearCoursesModal*/
        ctx2[0]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block$3(ctx2);
          if_block2.c();
          if_block2.m(div8, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty[0] & /*$prefs*/
      32) {
        each_value_3 = ensure_array_like(Object.keys(
          /*$prefs*/
          ctx2[5].courseTableData
        ));
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3(ctx2, each_value_3, i);
          if (each_blocks_3[i]) {
            each_blocks_3[i].p(child_ctx, dirty);
          } else {
            each_blocks_3[i] = create_each_block_3(child_ctx);
            each_blocks_3[i].c();
            each_blocks_3[i].m(div11, null);
          }
        }
        for (; i < each_blocks_3.length; i += 1) {
          each_blocks_3[i].d(1);
        }
        each_blocks_3.length = each_value_3.length;
      }
      if (dirty[0] & /*$prefs*/
      32) {
        each_value_2 = ensure_array_like(
          /*$prefs*/
          ctx2[5].transferUnits
        );
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2(ctx2, each_value_2, i);
          if (each_blocks_2[i]) {
            each_blocks_2[i].p(child_ctx, dirty);
          } else {
            each_blocks_2[i] = create_each_block_2(child_ctx);
            each_blocks_2[i].c();
            each_blocks_2[i].m(select0, null);
          }
        }
        for (; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].d(1);
        }
        each_blocks_2.length = each_value_2.length;
      }
      if (dirty[0] & /*$prefs, selectedTransferUnit*/
      34 && to_number(input1.value) !== /*$prefs*/
      ctx2[5].transferUnits[
        /*selectedTransferUnit*/
        ctx2[1]
      ].value) {
        set_input_value(
          input1,
          /*$prefs*/
          ctx2[5].transferUnits[
            /*selectedTransferUnit*/
            ctx2[1]
          ].value
        );
      }
      if (dirty[0] & /*$bachelorsDegreeChoices*/
      64) {
        each_value_1 = ensure_array_like(
          /*$bachelorsDegreeChoices*/
          ctx2[6]
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(select1, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty[0] & /*$bachelorsDegreeChoices, $bachelorsDegreeChoice*/
      72 && select1_value_value !== (select1_value_value = //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
      /*$bachelorsDegreeChoices*/
      (_a = ctx2[6].find(
        /*func*/
        ctx2[22]
      )) == null ? void 0 : _a.uniqueID)) {
        select_option(
          select1,
          //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
          /*$bachelorsDegreeChoices*/
          (_b = ctx2[6].find(
            /*func*/
            ctx2[22]
          )) == null ? void 0 : _b.uniqueID
        );
      }
      if (dirty[0] & /*$mastersDegreeChoices*/
      128) {
        each_value = ensure_array_like(
          /*$mastersDegreeChoices*/
          ctx2[7]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty[0] & /*$mastersDegreeChoices, $mastersDegreeChoice*/
      132 && select2_value_value !== (select2_value_value = //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
      /*$mastersDegreeChoices*/
      (_c = ctx2[7].find(
        /*func_1*/
        ctx2[24]
      )) == null ? void 0 : _c.uniqueID)) {
        select_option(
          select2,
          //Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
          /*$mastersDegreeChoices*/
          (_d = ctx2[7].find(
            /*func_1*/
            ctx2[24]
          )) == null ? void 0 : _d.uniqueID
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div23);
      }
      if_block0.d();
      if_block1.d();
      if (if_block2)
        if_block2.d();
      destroy_each(each_blocks_3, detaching);
      destroy_each(each_blocks_2, detaching);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $courseTable;
  let $allCourses;
  let $compressedTable;
  let $quarters;
  let $years;
  let $mastersDegreeChoice;
  let $bachelorsDegreeChoice;
  let $panelCollapsed;
  let $showWelcomeModalOnLoad;
  let $prefs;
  let $bachelorsDegreeChoices;
  let $mastersDegreeChoices;
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(26, $courseTable = $$value));
  component_subscribe($$self, allCourses, ($$value) => $$invalidate(27, $allCourses = $$value));
  component_subscribe($$self, compressedTable, ($$value) => $$invalidate(28, $compressedTable = $$value));
  component_subscribe($$self, quarters, ($$value) => $$invalidate(29, $quarters = $$value));
  component_subscribe($$self, years, ($$value) => $$invalidate(30, $years = $$value));
  component_subscribe($$self, mastersDegreeChoice, ($$value) => $$invalidate(2, $mastersDegreeChoice = $$value));
  component_subscribe($$self, bachelorsDegreeChoice, ($$value) => $$invalidate(3, $bachelorsDegreeChoice = $$value));
  component_subscribe($$self, panelCollapsed, ($$value) => $$invalidate(4, $panelCollapsed = $$value));
  component_subscribe($$self, showWelcomeModalOnLoad, ($$value) => $$invalidate(31, $showWelcomeModalOnLoad = $$value));
  component_subscribe($$self, prefs, ($$value) => $$invalidate(5, $prefs = $$value));
  component_subscribe($$self, bachelorsDegreeChoices, ($$value) => $$invalidate(6, $bachelorsDegreeChoices = $$value));
  component_subscribe($$self, mastersDegreeChoices, ($$value) => $$invalidate(7, $mastersDegreeChoices = $$value));
  function clearCourses() {
    let coursesObj = [];
    for (let i = 0; i < $years.length; i++) {
      coursesObj.push({ id: $years[i], quarters: [] });
      for (let j = 0; j < $quarters.length; j++) {
        coursesObj[i].quarters.push({
          id: $years[i] + " " + $quarters[j],
          courses: []
        });
      }
    }
    set_store_value(courseTable, $courseTable = coursesObj, $courseTable);
  }
  function downloadData() {
    let data = {
      compressedTable: $compressedTable,
      years: $years,
      quarters: $quarters,
      prefs: $prefs,
      showWelcomeModalOnLoad: $showWelcomeModalOnLoad,
      panelCollapsed: $panelCollapsed,
      bachelorsDegreeChoice: $bachelorsDegreeChoice,
      mastersDegreeChoice: $mastersDegreeChoice
    };
    let date = /* @__PURE__ */ new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0") + "_" + date.getHours().toString().padStart(2, "0") + "-" + date.getMinutes().toString().padStart(2, "0") + "-" + date.getSeconds().toString().padStart(2, "0");
    let fileName = "coursecorrect_data_export_" + dateString + ".json";
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    let dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName);
    dlAnchorElem.click();
  }
  function importData(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e2) => {
      let data = JSON.parse(e2.target.result);
      set_store_value(compressedTable, $compressedTable = data.compressedTable, $compressedTable);
      courseTable.set($courseTable);
      set_store_value(years, $years = data.years, $years);
      set_store_value(quarters, $quarters = data.quarters, $quarters);
      set_store_value(prefs, $prefs = data.prefs, $prefs);
      set_store_value(showWelcomeModalOnLoad, $showWelcomeModalOnLoad = data.showWelcomeModalOnLoad, $showWelcomeModalOnLoad);
      set_store_value(panelCollapsed, $panelCollapsed = data.panelCollapsed, $panelCollapsed);
      set_store_value(bachelorsDegreeChoice, $bachelorsDegreeChoice = data.bachelorsDegreeChoice, $bachelorsDegreeChoice);
      set_store_value(mastersDegreeChoice, $mastersDegreeChoice = data.mastersDegreeChoice, $mastersDegreeChoice);
      decompressCourses();
    };
    reader.readAsText(file);
  }
  function decompressCourses() {
    set_store_value(courseTable, $courseTable = [], $courseTable);
    let coursesObj = [];
    for (let i = 0; i < $years.length; i++) {
      coursesObj.push({ id: $years[i], quarters: [] });
      for (let j = 0; j < $quarters.length; j++) {
        coursesObj[i].quarters.push({
          id: $years[i] + " " + $quarters[j],
          courses: []
        });
        for (let k = 0; k < $compressedTable[i].quarters[j].courses.length; k++) {
          let course = $compressedTable[i].quarters[j].courses[k];
          let decompressedCourse = $allCourses.find((c) => c.code == course.code);
          decompressedCourse = JSON.parse(JSON.stringify(decompressedCourse));
          decompressedCourse.bump = course.bump;
          decompressedCourse.csnc = course.csnc;
          decompressedCourse.ms = course.ms;
          decompressedCourse.units_taking = course.units_taking;
          decompressedCourse.id = decompressedCourse.id.split("|")[0] + "|" + Math.random().toString(36).substring(7);
          coursesObj[i].quarters[j].courses.push(decompressedCourse);
        }
      }
    }
    set_store_value(courseTable, $courseTable = coursesObj, $courseTable);
  }
  let showClearCoursesModal = false;
  let selectedTransferUnit = 0;
  const click_handler = () => {
    document.getElementById("importDataInput").click();
  };
  const click_handler_1 = () => {
    set_store_value(panelCollapsed, $panelCollapsed.search = !$panelCollapsed.search, $panelCollapsed);
    panelCollapsed.set($panelCollapsed);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  const click_handler_2 = () => {
    set_store_value(panelCollapsed, $panelCollapsed.summer = !$panelCollapsed.summer, $panelCollapsed);
    panelCollapsed.set($panelCollapsed);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  const click_handler_3 = () => {
    $$invalidate(0, showClearCoursesModal = !showClearCoursesModal);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  const click_handler_4 = () => {
    clearCourses();
    $$invalidate(0, showClearCoursesModal = false);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  const click_handler_5 = () => {
    $$invalidate(0, showClearCoursesModal = false);
    const scrollPosition = document.scrollingElement.scrollTop;
    tick().then(() => {
      document.scrollingElement.scrollTop = scrollPosition;
    });
  };
  function input_change_handler(courseTableData) {
    $prefs.courseTableData[courseTableData] = this.checked;
    prefs.set($prefs);
  }
  const change_handler = () => {
    prefs.set($prefs);
  };
  const change_handler_1 = (e) => {
    $$invalidate(1, selectedTransferUnit = e.target.value);
  };
  function input1_input_handler() {
    $prefs.transferUnits[selectedTransferUnit].value = to_number(this.value);
    prefs.set($prefs);
  }
  const change_handler_2 = () => {
    prefs.set($prefs);
  };
  const func = (choice) => choice.uniqueID === $bachelorsDegreeChoice;
  const change_handler_3 = (e) => {
    set_store_value(bachelorsDegreeChoice, $bachelorsDegreeChoice = e.target.value, $bachelorsDegreeChoice);
  };
  const func_1 = (choice) => choice.uniqueID === $mastersDegreeChoice;
  const change_handler_4 = (e) => {
    set_store_value(mastersDegreeChoice, $mastersDegreeChoice = e.target.value, $mastersDegreeChoice);
  };
  return [
    showClearCoursesModal,
    selectedTransferUnit,
    $mastersDegreeChoice,
    $bachelorsDegreeChoice,
    $panelCollapsed,
    $prefs,
    $bachelorsDegreeChoices,
    $mastersDegreeChoices,
    clearCourses,
    downloadData,
    importData,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5,
    input_change_handler,
    change_handler,
    change_handler_1,
    input1_input_handler,
    change_handler_2,
    func,
    change_handler_3,
    func_1,
    change_handler_4
  ];
}
class ConfigPanel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$3, safe_not_equal, {}, null, [-1, -1]);
  }
}
const OnStartInfoModal_svelte_svelte_type_style_lang = "";
function create_if_block$2(ctx) {
  let div2;
  let button0;
  let x;
  let t0;
  let button1;
  let textContent = "Don't show again";
  let t2;
  let div1;
  let textContent_1 = `<h2>CourseCorrect</h2> <p>This is a 5 year course planner. Use in conjuction with other services (Explorecourses,
				Carta, etc.) for best results.</p> <h2>Start</h2> <p>Set your preferences, degree, and transfer units. Make sure to configure &quot;Total&quot; transfer
				units.</p> <p>Search for courses in the top left or directly enter them in each quarter. Use
				filters/sorting aggressively.</p> <h2>Star</h2> <p>Please star this project on Github if you found it helpful!</p> <div class="githubButton"><a class="github-button" href="https://github.com/sambhavg/coursecorrect" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star sambhavg/coursecorrect on GitHub">Star</a></div> <h2>Other info</h2> <p>CourseCorrect was made to be used full-screen on computers; if the site is jumbled, zoom
				out.</p> <p>If the entire website breaks, clear the cache and cookies. Site might be buggy on Safari.</p> <p>Data is stored locally on your browser. Export your data frequently.</p> <p>Degrees with more than 50 students/year are implemented.</p> <h2>Disclaimer</h2> <p>All data and calculations may contain errors. Consult official university materials for
				ground truths.</p> <p>There are no correctness guarantees.</p>`;
  let current;
  let mounted;
  let dispose;
  x = new X$1({ props: { size: "3em" } });
  return {
    c() {
      div2 = element("div");
      button0 = element("button");
      create_component(x.$$.fragment);
      t0 = space();
      button1 = element("button");
      button1.textContent = textContent;
      t2 = space();
      div1 = element("div");
      div1.innerHTML = textContent_1;
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      button0 = claim_element(div2_nodes, "BUTTON", { class: true });
      var button0_nodes = children(button0);
      claim_component(x.$$.fragment, button0_nodes);
      button0_nodes.forEach(detach);
      t0 = claim_space(div2_nodes);
      button1 = claim_element(div2_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button1) !== "svelte-1xgh153")
        button1.textContent = textContent;
      t2 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-k5eiw9")
        div1.innerHTML = textContent_1;
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button0, "class", "close-button svelte-1r3lo9d");
      attr(button1, "class", "dont-show-again-button svelte-1r3lo9d");
      attr(div1, "class", "svelte-1r3lo9d");
      attr(div2, "class", "modal svelte-1r3lo9d");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, button0);
      mount_component(x, button0, null);
      append_hydration(div2, t0);
      append_hydration(div2, button1);
      append_hydration(div2, t2);
      append_hydration(div2, div1);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*close*/
            ctx[1]
          ),
          listen(
            button1,
            "click",
            /*dontShowAgain*/
            ctx[2]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(x.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(x.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(x);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$2(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$showWelcomeModal*/
    ctx[0] && create_if_block$2(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*$showWelcomeModal*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$showWelcomeModal*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $showWelcomeModalOnLoad;
  let $showWelcomeModal;
  component_subscribe($$self, showWelcomeModalOnLoad, ($$value) => $$invalidate(3, $showWelcomeModalOnLoad = $$value));
  component_subscribe($$self, showWelcomeModal, ($$value) => $$invalidate(0, $showWelcomeModal = $$value));
  function close() {
    set_store_value(showWelcomeModal, $showWelcomeModal = false, $showWelcomeModal);
  }
  function dontShowAgain() {
    set_store_value(showWelcomeModal, $showWelcomeModal = false, $showWelcomeModal);
    set_store_value(showWelcomeModalOnLoad, $showWelcomeModalOnLoad = false, $showWelcomeModalOnLoad);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$showWelcomeModalOnLoad*/
    8) {
      {
        set_store_value(showWelcomeModal, $showWelcomeModal = $showWelcomeModalOnLoad, $showWelcomeModal);
      }
    }
  };
  return [$showWelcomeModal, close, dontShowAgain, $showWelcomeModalOnLoad];
}
class OnStartInfoModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$2, safe_not_equal, {});
  }
}
let degree$N = {
  "degree": "No Degree Selected",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "BLANK",
  "lookuptables": {},
  "requirements": []
};
let degree$M = {
  "degree": "B.S. BioE",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_BioE_BS_Standard",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CME": ["CME 10[02]"],
    "MATH": ["MATH 5[13]"],
    "Stats": ["CME 106", "STATS 110", "STATS 141"],
    "Science": ["CHEM 31[ABMX]", "CHEM 33", "BIO 8[234]", "PHYS 4[13]"],
    "PHYS 41": ["PHYSICS 41"],
    "PHYS 43": ["PHYSICS 43"],
    "CHEM 31 AB": ["CHEM 31[AB]"],
    "CHEM 31 MX": ["CHEM 31[MX]"],
    "Other Science": ["CHEM 33", "BIO 8[234]"],
    "TIS": ["BIOE 131"],
    "Eng Fund Req": ["BIOE 80", "CS 106[ABX]"],
    "Eng Fund Elec": ["ENGR 10", "ENGR 14", "ENGR 15", "ENGR 20", "ENGR 21", "ENGR 40M", "ENGR 42", "ENGR 50", "ENGR 50E", "ENGR 50M", "ENGR 55", "ENGR 60", "ENGR 62", "ENGR 62X", "ENGR 65", "ENGR 76", "ENGR 80", "BIOE 80", "ENGR 90", "CEE 70"],
    "Core": ["BIOE 42", "BIOE 44", "BIOE 101", "BIOE 103", "BIOE 123", "BIOE 141A", "BIOE 141B"],
    "Depth": ["BIOE 51", "BIOE 220", "BIOE 122", "BIOE 201C", "BIOE 209", "BIOE 211", "BIOE 212", "BIOE 214", "BIOE 217", "BIOE 221", "BIOE 222", "BIOE 224", "BIOE 225", "BIOE 227", "BIOE 231", "BIOE 260", "BIOE 279", "BIOE 281", "BIOE 291", "BIOE 301A", "BIOE 301B", "BIOE 301E", "BIOE 301P"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Calculus",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "name": "Math",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "CME",
              "amount": 2
            },
            {
              "lut": "MATH",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Stats",
          "amount": 0
        }
      ]
    },
    {
      "name": "Science",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "CHEM 31 AB",
              "amount": 2
            },
            {
              "lut": "CHEM 31 MX"
            }
          ]
        },
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "PHYS 41"
            }
          ]
        },
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "PHYS 43"
            }
          ]
        },
        {
          "lut": "Other Science",
          "amount": 3
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "name": "Eng Fund",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "lut": "Eng Fund Req",
          "amount": 2
        },
        {
          "lut": "Eng Fund Elec"
        }
      ]
    },
    {
      "lut": "Core",
      "amount": 7
    },
    {
      "lut": "Depth",
      "amount": 3
    }
  ]
};
let degree$L = {
  "degree": "B.S. Biology (General)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Biology_BS_General",
  "lookuptables": {
    "Core": ["BIO 8[123456]"],
    "Lab": ["BIO 4[3567]"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Math": ["MATH 51", "CME 100"],
    "Mechanics": ["PHYSICS 2[12]", "PHYSICS 4[12]"],
    "E&M": ["PHYSICS 2[34]", "PHYSICS 4[34]"],
    "First chem": ["CHEM 31A", "CHEM 31B"],
    "Second chem": ["CHEM 33", "CHEM 121"],
    "Stats": ["BIO 141", "STATS 60", "CME 106", "CS 109"],
    "Electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^BIO "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<",
        "number": 100
      }
    ],
    "Out-of-department Electives": ["BIOC 241", "BIOE 241", "BIOPHYS 241", "SBIO 241", "BIOE 101", "BIOE 103", "BIOE 214", "BIOMEDIN 214", "GENE 214", "CS 274", "BIOE 217", "BIOMEDIN 217", "GENE 217", "CS 275", "BIOE 220", "RAD 220", "BIOE 231", "BIOE 279", "BIOPHYS 279", "BIOMEDIN 279", "CME 279", "CS 279", "BIOE 450", "CHEMENG 450", "BIOMEDIN 210", "CS 270", "BIOMEDIN 214", "BIOMEDIN 217", "BIOMEDIN 273A", "CS 273A", "DBIO 273A", "BIOMEDIN 273B", "BIODS 237", "CS 273B", "GENE 236", "BIOMEDIN 279", "BIOPHYS 279", "BIOE 279", "CME 279", "CS 279", "BIOPHYS 241", "BIOPHYS 279", "BIOMEDIN 221", "BIODS 237", "BIOMEDIN 273B", "CS 273B", "GENE 236", "CBIO 101", "PATH 101", "CBIO 240", "CBIO 275", "IMMUNOL 275", "CHEMENG 450", "CSB 210", "CSB 220", "CHEM 141", "CHEM 143", "CHEM 181", "CHEM 183", "CHEM 184", "CHEM 185", "CEE 162I", "CEE 177", "CEE 274D", "CS 109", "CS 270", "CS 273A", "CS 273B", "CS 274", "CS 275", "CS 279", "DBIO 201", "DBIO 210", "DBIO 273A", "EARTHSYS 114", "EARTHSYS 132", "EARTHSYS 141", "EARTHSYS 142", "EARTHSYS 144", "EARTHSYS 146B", "EARTHSYS 151", "EARTHSYS 152", "EARTHSYS 155", "EARTHSYS 158", "EARTHSYS 240", "ENERGY 240", "ESS 132", "ESS 141", "ESS 151", "ESS 152", "ESS 155", "ESS 158", "ESS 162", "ESS 164", "ESS 239", "GENE 202", "GENE 211", "GENE 214", "GENE 217", "GENE 235", "GENE 236", "GEOLSCI 132", "GEOLSCI 240", "GEOPHYS 141", "HUMBIO 113", "HUMBIO 114", "HUMBIO 135", "HUMBIO 153", "HUMBIO 154C", "IMMUNOL 201", "IMMUNOL 202", "IMMUNOL 205", "IMMUNOL 206", "IMMUNOL 209", "IMMUNOL 275", "IMMUNOL 286", "MI 115B", "MI 185", "MCP 156", "NBIO 206", "OSPAUSTL 10", "OSPAUSTL 28", "OSPAUSTL 32", "OSPSANTG 85", "PATH 101", "PHYSICS 105", "PSYCH 121", "PSYCH 202", "PSYCH 221", "RAD 220", "STATS 116", "STATS 191", "STATS 200", "SBIO 241", "STEMREM 201A", "SURG 101", "SUSTAIN 103", "MED 103", "PUBLPOL 183", "SOC 103", "SYMSYS 195I"],
    "WIM": ["BIO 46", "BIO 47", "BIO 127", "BIO 168", "BIO 196A", "BIO 199A", "BIO 199W"]
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 4
    },
    {
      "lut": "Lab",
      "amount": 2
    },
    {
      "type": "or",
      "name": "Math",
      "content": [
        {
          "type": "and",
          "name": "Math",
          "bundle": true,
          "content": [
            {
              "type": "or",
              "name": "MATH 19",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 3
                },
                {
                  "lut": "MATH 19"
                }
              ]
            },
            {
              "type": "or",
              "name": "MATH 20",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 6
                },
                {
                  "lut": "MATH 20"
                }
              ]
            },
            {
              "type": "or",
              "name": "MATH 21",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 10
                },
                {
                  "lut": "MATH 21"
                }
              ]
            }
          ]
        },
        {
          "lut": "Math"
        }
      ]
    },
    {
      "type": "and",
      "name": "Physics",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics",
              "amount": 2
            }
          ]
        },
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M",
              "amount": 2
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Chemistry",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "First chem",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Second chem",
          "amount": 2
        }
      ]
    },
    {
      "lut": "Stats"
    },
    {
      "name": "Electives",
      "minUnits": 23,
      "bundleName": " ",
      "csnc": 1,
      "lutList": ["Core", "Lab", "Electives", "Out-of-department Electives"]
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
};
let degree$K = {
  "degree": "B.S. Computer Science (AI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_AI",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["CS 221"],
    "B AI Methods": ["CS 224R", "CS 228", "CS 229", "CS 229M", "CS 229T", "CS 234", "CS 238"],
    "B NLP": ["CS 124", "CS 224N", "CS 224S", "CS 224U", "CS 224V"],
    "B Vision": ["CS 131", "CS 231A", "CS 231N"],
    "B Robotics": ["CS 123", "CS 223A", "CS 237A"],
    "C AI Methods": ["CS 157", "CS 205L", "CS 230", "CS 236", "CS 257", "STATS 315A", "STATS 315B"],
    "C Comp Bio": ["CS 235", "CS 279", "CS 371"],
    "C Info & Web": ["CS 224W", "CS 276"],
    "C Ethics": ["CS 256"],
    "C Robotics & Control": ["CS 225A", "CS 327A", "CS 329", "ENGR 205", "MS&E 251", "MS&E 351"],
    "C Other": ["CS 151", "CS 227B"],
    "Track Elective": ["CS 325B", "CS 326", "CS 329D", "CS 330", "CS 428", "EE 263", "EE 28", "EE 364A", "EE 364B", "MS&E 252", "MS&E 352", "MS&E 355", "PHIL 152", "PSYCH 204A", "PSYCH 204B", "PSYCH 209", "STATS 200", "STATS 202", "STATS 203", "STATS 205", "STATS 271"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "A, B, C",
          "bundle": true,
          "content": [
            {
              "lut": "A"
            },
            {
              "type": "or",
              "amount": 2,
              "lutList": ["B AI Methods", "B NLP", "B Vision", "B Robotics"]
            },
            {
              "lutList": ["B AI Methods", "B NLP", "B Vision", "B Robotics", "C AI Methods", "C Comp Bio", "C Info & Web", "C Ethics", "C Robotics & Control", "C Other"]
            }
          ]
        },
        {
          "name": "Elective",
          "amount": 3,
          "lutList": ["B AI Methods", "B NLP", "B Vision", "B Robotics", "C AI Methods", "C Comp Bio", "C Info & Web", "C Ethics", "C Robotics & Control", "C Other", "Track Elective", "General CS Elective"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$J = {
  "degree": "B.S. Computer Science (Biocomp)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Biocomp",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "Comp Genomics": ["CS 173A"],
    "AI (221)": ["CS 221"],
    "Datasets/bases": ["CS 145", "CS 246"],
    "Web/Data vis": ["CS 142", "CS 147L", "CS 448B"],
    "Comp Bio": ["CS 279", "CS 371", "BIOMEDIN 210", "BIOMEDIN 214", "BIOMEDIN 215", "BIOMEDIN 217", "BIOMEDIN 219", "BIOMEDIN 220", "BIOMEDIN 222", "BIOMEDIN 260", "BIOMEDIN 273B", "IMMUNOL 207"],
    "AI": ["CS 224R", "CS 224W", "CS 228", "CS 229", "CS 229S", "CS 234", "CS 238", "CS 124", "CS 224N", "CS 224V", "CS 131", "CS 231N"],
    "Quant tools": ["CS 147", "CS 148", "CS 154", "CS 166", "CS 168", "CS 185", "CS 230", "CS 248A", "CS 353", "BIO 183", "BIO 187", "BIOC 241", "BIOMEDIN 248", "EE 263", "EE 364A", "MS&E 152", "MS&E 252", "STATS 141", "STATS 202", "STATS 203", "STATS 205", "STATS 206", "STATS 211", "STATS 315A", "STATS 315B", "CHEMENG 150", "APPPHYS 294", "CS 142", "CS 147L", "CS 448B"],
    "Application": ["BIOE 220", "CHEMENG 150", "CHEMENG 174", "GENE 211", "ME 281", "APPPHYS 294", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 112", "BIO 214", "BIO 230", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 141", "CHEM 143", "CHEM 171", "BIOC 241", "DBIO 210", "SURG 101"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Requirements",
      "bundle": true,
      "content": [
        {
          "lut": "Comp Genomics"
        },
        {
          "lut": "AI (221)"
        },
        {
          "lut": "Datasets/bases"
        },
        {
          "lut": "Web/Data vis"
        }
      ]
    },
    {
      "type": "and",
      "name": "Electives",
      "bundle": true,
      "content": [
        {
          "lut": "Comp Bio"
        },
        {
          "lut": "AI"
        },
        {
          "lutList": ["Quant tools", "Comp Bio", "AI"]
        },
        {
          "lutList": ["Application", "Comp Bio"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$I = {
  "degree": "B.S. Computer Science (Comp Eng)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_CompEng",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["EE 108", "EE 180"],
    "B": ["EE 10[12][AB]"],
    "C Digital Systems": ["EE 109", "EE 271", "CS 112", "CS 140E"],
    "C Robotics and Mechatronics": ["CS 205L", "CS 223A", "ME 210", "CS 225A"],
    "C Networking": ["CS 112", "CS 140E", "CS 144", "CS 240", "CS 240LX", "CS 241", "CS 244", "CS 244B", "EE 179"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "content": [
        {
          "type": "and",
          "name": "A, B",
          "bundle": true,
          "content": [
            {
              "lut": "A",
              "amount": 2
            },
            {
              "lut": "B",
              "amount": 2
            }
          ]
        },
        {
          "type": "or",
          "name": "C",
          "amount": 3,
          "content": [
            {
              "lut": "C Digital Systems",
              "amount": 3
            },
            {
              "lut": "C Robotics and Mechatronics",
              "amount": 3
            },
            {
              "lut": "C Networking",
              "amount": 3
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$H = {
  "degree": "B.S. Computer Science (Graphics)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Graphics",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "Core": ["CS 225A", "CS 248A", "CS 248B", "CS 231N"],
    "Depth": ["CS 205L", "CS 223A", "CS 225A", "CS 231A", "CS 231N", "CS 233", "CS 248A", "CS 248B", "CS 348B", "CS 348C", "CS 348E", "CS 348K", "CS 348I", "CS 348N", "CS 448I", "EE 267"],
    "Track Elective": ["CS 123", "CS 131", "CS 148", "CS 149", "CS 221", "CS 224N", "CS 224R", "CS 229", "CS 230", "CS 234", "CS 236", "CS 236G", "CS 331B", "CS 448B", "CS 448M", "CS 448Z", "EE 261"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "lut": "Core",
          "amount": 2
        },
        {
          "lut": "Depth",
          "amount": 2
        },
        {
          "type": "and",
          "name": "Elective",
          "amount": 2,
          "bundle": true,
          "content": [
            {
              "lutList": ["Depth", "Track Elective"]
            },
            {
              "lut": "General CS Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$G = {
  "degree": "B.S. Computer Science (HCI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_HCI",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A1": ["CS 147"],
    "A2": ["CS 247[A-Z]*"],
    "A3": ["CS 347"],
    "B": ["CS 142", "CS 147L"],
    "C": ["CS 177", "CS 278", "CS 448B"],
    "Track Elective": ["CS 177", "CS 194H", "CS 206", "CS 210A", "CS 247[A-Z]*", "CS 377"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "A, B",
          "bundle": true,
          "content": [
            {
              "lut": "A1"
            },
            {
              "lut": "A2"
            },
            {
              "lut": "A3"
            },
            {
              "lut": "B"
            }
          ]
        },
        {
          "type": "and",
          "name": "C, Electives",
          "amount": 3,
          "bundle": true,
          "content": [
            {
              "lut": "C"
            },
            {
              "lutList": ["C", "Track Elective"]
            },
            {
              "lutList": ["C", "Track Elective", "General CS Elective"]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$F = {
  "degree": "B.S. Computer Science (Information)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Information",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["CS 124", "CS 145"],
    "B Info-based AI applications": ["CS 224N", "CS 224S", "CS 229", "CS 233", "CS 234"],
    "B Database and Information Systems": ["CS 112", "CS 140E", "CS 142", "CS 147L", "CS 151", "CS 245", "CS 246"],
    "B Information Systems in Biology": ["CS 235", "CS 270", "CS 274"],
    "B Information Systems on the Web": ["CS 224W"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "A, B",
          "bundle": true,
          "content": [
            {
              "lut": "A",
              "amount": 2
            },
            {
              "name": "B",
              "type": "or",
              "amount": 2,
              "lutList": ["B Info-based AI applications", "B Database and Information Systems", "B Information Systems in Biology", "B Information Systems on the Web"]
            }
          ]
        },
        {
          "name": "Elective",
          "amount": 3,
          "lutList": ["B Info-based AI applications", "B Database and Information Systems", "B Information Systems in Biology", "B Information Systems on the Web", "General CS Elective"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$E = {
  "degree": "B.S. Computer Science (Systems)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Systems",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["CS 112", "CS 140E"],
    "B": ["CS 143", "EE 180"],
    "C": ["CS 144", "CS 145", "CS 149", "CS 155", "CS 190", "CS 217", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 245", "EE 271", "EE 282"],
    "Track Elective": ["CS 241", "CS 295", "CS 340R", "CS 343D", "CS 349D", "CS 349H", "CS 448I", "EE 108", "EE 382A", "EE 382C", "EE 384S"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "A, B, C",
          "bundle": true,
          "content": [
            {
              "lut": "A"
            },
            {
              "lut": "B"
            },
            {
              "amount": 2,
              "lutList": ["B", "C"]
            }
          ]
        },
        {
          "name": "Elective",
          "amount": 3,
          "lutList": ["C", "Track Elective", "General CS Elective"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$D = {
  "degree": "B.S. Computer Science (Theory)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Theory",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["CS 154"],
    "B": ["CS 168", "CS 255", "CS 261", "CS 265"],
    "C": ["CS 143", "CS 151", "CS 155", "CS 157", "CS 163", "CS 166", "CS 205L", "CS 228", "CS 233", "CS 235", "CS 236", "CS 242", "CS 250", "CS 251", "CS 254", "CS 259Q", "CS 263", "CS 269I", "CS 353", "CS 354", "MS&E 310", "PHIL 151"],
    "Track Elective": ["CS 254B", "CME 302", "CME 305", "PHIL 152"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "A, B, C",
          "bundle": true,
          "content": [
            {
              "lut": "A"
            },
            {
              "lut": "B"
            },
            {
              "amount": 2,
              "lutList": ["B", "C"]
            }
          ]
        },
        {
          "name": "Elective",
          "amount": 3,
          "lutList": ["B", "C", "Track Elective", "General CS Elective"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$C = {
  "degree": "B.S. Computer Science (Unspecialized)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Unspecialized",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["CS 154"],
    "B": ["CS 112", "CS 140E", "CS 143"],
    "C": ["CS 144", "CS 155", "CS 190", "CS 242", "CS 244", "EE 180"],
    "D": ["CS 221", "CS 223A", "CS 228", "CS 229", "CS 231A"],
    "E": ["CS 145", "CS 147", "CS 148", "CS 235", "CS 248A"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]*", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 25,
      "content": [
        {
          "type": "and",
          "name": "ABCDE",
          "bundle": true,
          "content": [
            {
              "lut": "A"
            },
            {
              "lut": "B"
            },
            {
              "lutList": ["B", "C"]
            },
            {
              "lut": "D"
            },
            {
              "lut": "E"
            }
          ]
        },
        {
          "name": "Elective",
          "amount": 2,
          "lutList": ["General CS Elective"]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
};
let degree$B = {
  "degree": "B.A. Economics",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Econ_BA_Standard",
  "lookuptables": {
    "Core": ["ECON 1", "ECON 5[012]", "ECON 102[AB]"],
    "Field": [
      {
        type: "add",
        method: "regex",
        string: "^ECON"
      },
      {
        type: "remove",
        method: "number",
        comparator: "<",
        number: 200
      },
      {
        type: "remove",
        method: "number",
        comparator: ">=",
        number: 300
      },
      {
        type: "add",
        method: "regex",
        string: "^ECON (102C|102D|108|111|112|113|118|125|126|127|135|136|137|140|141|144|146|147|149|150|155|156|157|158|160|165|166|177|178|179|198|199D)$"
      }
    ],
    "Elective": [
      {
        type: "add",
        method: "regex",
        string: "^ECON"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(FINANCE 345|HRP 392|MED 432|ACCT 313|BIO 141|CME 100|CME 103|CME 106|CS 103|CS 109|CS 161|CS 221|CS 224M|CS 227B|CS 228|CS 229|CS 230|CS 269I|EARTHSYS 144|ECON 204|ENGR 60|ENGR 150|ESS 268|INTLPOL 272|FINANCE 320|FINANCE 323|FINANCE 327|FINANCE 377|FINANCE 385|GSBGEN 336|GSBGEN 561|GSBGEN 562|GSBGEN 646|HISTORY 200E|HISTORY 269|HISTORY 279|HRP 252|BMI 251|MED 252|HRP 259|HUMBIO 111|HUMBIO 124E|MED 236|INTLPOL 207|INTLPOL 272|ESS 268|LAW 7502|MATH 113|MATH 114|MATH 115|MATH 118|MATH 120|MATH 136|MATH 151|MATH 161|MATH 171|MATH 172|MATH 175|MATH 180|MATH 50V|MATH 113V|MATH 61CM|MATH 62CM|MATH 61DM|MS&E 120|MS&E 211|MS&E 111|MS&E 221|MS&E 226|MS&E 231|MS&E 245A|MS&E 252|MSE 120|MSE 121|OSPFLOR 26|OSPFLOR 27|OSPHONGK 22|OSPOXFRD 199A|PHIL 50|POLISCI 110C|POLISCI 247G|PUBLPOL 105|PUBLPOL 113|PUBLPOL 174|URBAN 173|PUBLPOL 303D|PUBLPOL 184|PUBLPOL 302B|SINY 128|SINY 202|SOC 114|STANFORD SUMMER M52A|B|MATH103|STAT 110|MS&E 120|STAT 116|STAT 191|STAT 200|STAT 202|STAT 204|STAT 206|STAT 207|STAT 208|STAT 209|STAT 209A|STAT 216|STAT 217|STAT 218|STAT 219|STAT 221|STAT 222|STAT 237|STAT 240|STAT 243|STAT 245|STAT 245P|STAT 315B|STRAMGT 329|EARTHSYS 121|HUMBIO 110|EDUC 107|MS&E 145|MS&E 125|ECON 154|MS&E 241)$"
      }
    ],
    "WIM/Cap": ["ECON 101"]
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 6
    },
    {
      "type": "and",
      "name": "Field",
      "minUnits": 25,
      "content": [
        {
          "name": " ",
          "lut": "Field"
        }
      ]
    },
    {
      "type": "and",
      "name": "Elective",
      "minUnits": 20,
      "content": [
        {
          "name": " ",
          "lut": "Elective"
        }
      ]
    },
    {
      "lut": "WIM/Cap",
      "amount": 1
    }
  ]
};
let degree$A = {
  "degree": "B.A. English (Literature)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_English_BA_Literature",
  "lookuptables": {
    "Intro I": ["ENGLISH 10[ABCDEF]"],
    "Intro II": ["ENGLISH 11[ABC]"],
    "Intro III": ["ENGLISH 12[ABCD]"],
    "Methodology": ["ENGLISH 16[01]"],
    "Pre-1800": ["ENGLISH 115E", "ENGLISH 122C", "ENGLISH 104C", "ENGLISH 114B", "ENGLISH 107B", "ENGLISH 114C", "ENGLISH 115C", "ENGLISH 115G", "ENGLISH 200C", "ENGLISH 201", "ENGLISH 237", "ENGLISH 251B", "ENGLISH 180A", "ENGLISH 175", "ENGLISH 215E", "ENGLISH 140C"],
    "Literature": [
      {
        "type": "add",
        "method": "regex",
        "string": "^ENGLISH"
      }
    ],
    "WIM": ["ENGLISH 5[ABCDEFGHIJKLMNOPRSTUVW]", "ENGLISH 5[ABCDEFG]A"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Intro",
      "bundle": true,
      "content": [
        {
          "lut": "Intro I"
        },
        {
          "lut": "Intro II"
        },
        {
          "lut": "Intro III"
        }
      ]
    },
    {
      "lut": "Methodology",
      "amount": 2
    },
    {
      "lut": "Pre-1800"
    },
    {
      "lut": "WIM"
    },
    {
      "lut": "Literature",
      "amount": 7,
      "minUnits": 35,
      "bundleName": " "
    }
  ]
};
let degree$z = {
  "degree": "B.A. Humbio",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Humbio_BA_Standard",
  "infoText": "No lookup tables for breadth/depth; bump courses as needed",
  "lookuptables": {
    "Core": ["HUMBIO [234][AB]"],
    "Stats": ["BIO 141", "CME 106", "CS 109", "ECON 102A", "EDUC 400A", "EPI 259", "EPI 262", "HUMBIO 88", "HUMBIO 89", "MATH 151", "SOC 180B", "STATS 101", "STATS 110", "STATS 116"],
    "Upper Division": [
      {
        type: "add",
        method: "regex",
        string: "^HUMBIO"
      },
      {
        type: "remove",
        method: "number",
        comparator: "<",
        number: 100
      },
      {
        type: "remove",
        method: "number",
        comparator: ">",
        number: 189
      },
      {
        type: "add",
        method: "regex",
        string: "^(OSPCPTWN 43|OSPCPTWN 49|OSPCPTWN 67|OSPHONGK 44|OPSMADRD 10|OSPMADRD 57|OSPMADRD 72|OSPOXFRD 67|OSPPARIS 18|OSPPARIS 76|OSPSANTG 25|OSPSANTG 57|OSPSANTG 58|OSPAUSTL 10|OSPAUSTL 28|OSPAUSTL 32)$"
      }
    ],
    "WIM": ["HUMBIO [234][AB]"],
    "Capstone practicum": ["HUMBIO 191"],
    "Capstone thesis": ["HUMBIO 192[AWS]"],
    "Breadth": [".*"],
    "Depth": [".*"]
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 6
    },
    {
      "name": "Stats, upper div",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "lut": "Stats",
          "amount": 3
        },
        {
          "lut": "Upper Division",
          "amount": 2
        }
      ]
    },
    {
      "name": "Capstone",
      "type": "or",
      "content": [
        {
          "lut": "Capstone practicum"
        },
        {
          "lut": "Capstone thesis",
          "amount": 2,
          "minUnits": 6
        }
      ]
    },
    {
      "type": "observe",
      "lut": "WIM",
      "amount": 3
    },
    {
      "type": "and",
      "name": "Breadth",
      "minUnits": 20,
      "content": [
        {
          "name": " ",
          "lut": "Breadth"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 20,
      "content": [
        {
          "name": " ",
          "lut": "Depth"
        }
      ]
    }
  ]
};
let degree$y = {
  "degree": "B.S. Humbio",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Humbio_BS_Standard",
  "infoText": "No lookup tables for breadth/depth; bump courses as needed",
  "lookuptables": {
    "Core": ["HUMBIO [234][AB]"],
    "Stats": ["BIO 141", "CME 106", "CS 109", "ECON 102A", "EDUC 400A", "EPI 259", "EPI 262", "HUMBIO 88", "HUMBIO 89", "MATH 151", "SOC 180B", "STATS 101", "STATS 110", "STATS 116"],
    "Upper Division": [
      {
        type: "add",
        method: "regex",
        string: "^HUMBIO"
      },
      {
        type: "remove",
        method: "number",
        comparator: "<",
        number: 100
      },
      {
        type: "remove",
        method: "number",
        comparator: ">",
        number: 189
      },
      {
        type: "add",
        method: "regex",
        string: "^(OSPCPTWN 43|OSPCPTWN 49|OSPCPTWN 67|OSPHONGK 44|OPSMADRD 10|OSPMADRD 57|OSPMADRD 72|OSPOXFRD 67|OSPPARIS 18|OSPPARIS 76|OSPSANTG 25|OSPSANTG 57|OSPSANTG 58|OSPAUSTL 10|OSPAUSTL 28|OSPAUSTL 32)$"
      }
    ],
    "WIM": ["HUMBIO [234][AB]"],
    "Capstone practicum": ["HUMBIO 191"],
    "Capstone thesis": ["HUMBIO 192[AWS]"],
    "Breadth": [".*"],
    "Depth": [".*"]
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 6
    },
    {
      "name": "Stats, upper div",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "lut": "Stats",
          "amount": 3
        },
        {
          "lut": "Upper Division",
          "amount": 2
        }
      ]
    },
    {
      "name": "Capstone",
      "type": "or",
      "content": [
        {
          "lut": "Capstone practicum"
        },
        {
          "lut": "Capstone thesis",
          "amount": 2,
          "minUnits": 6
        }
      ]
    },
    {
      "type": "observe",
      "lut": "WIM",
      "amount": 3
    },
    {
      "lut": "Breadth",
      "minUnits": 20
    },
    {
      "lut": "Depth",
      "minUnits": 20
    }
  ]
};
let degree$x = {
  "degree": "B.A. International Relations",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_IR_BA_Standard",
  "infoText": "Fill one to 20, one to 15, and total 40. Bump courses if necessary.",
  "lookuptables": {
    "International Politics": ["POLISCI 101", "INTNLREL 101"],
    "Comparative Governance": ["INTNLREL 102", "HISTORY 102", "POLISCI 114D", "INTNLREL 114D"],
    "American Foreign Policy": ["INTNLREL 100C", "POLISCI 110C", "POLISCI 110X", "INTNLREL 110D", "POLISCI 110D", "AMSTUD 110D", "POLISCI 110Y", "INTNLREL 154", "HISTORY 166C", "INTNLREL 168A", "HISTORY 259E", "INTNLREL 168W", "HISTORY 152K", "INTNLREL 173", "HISTORY 261G", "INTNLREL 174", "HISTORY 252B"],
    "Introductory Economics": ["ECON 1", "ECON 5[012]"],
    "Applied Economics": ["EARTHSYS 112", "EARTHSYS 212", "ESS 112", "HISTORY 103D", "EASTASN 179", "EASTASN 279", "ECON 106", "ECON 111", "ECON 118", "ECON 124", "ECON 125", "ECON 126", "ECON 127", "ECON 131", "ECON 135", "ECON 141", "ECON 143", "ECON 149", "ECON 150", "ECON 155", "ECON 162", "ECON 165", "ECON 166", "EDUC 306A", "HISTORY 200E", "INTLPOL 207", "INTNLREL 110C", "POLISCI 110C", "POLISCI 110X", "INTNLREL 123", "INTNLREL 147", "OSPBER 82", "OSPFLOR 26", "OSPMADRD 54", "OSPPARIS 91", "OSPSANTG 119X", "POLISCI 110G", "POLISCI 213R", "POLISCI 141", "SIW 103", "SOC 114"],
    "Skills": ["CS 109", "ECON 102A", "POLISCI 150A", "STATS 60", "PSYCH 10", "STATS 101"],
    "Africa": ["AFRICAAM 49S", "AFRICAAM 133", "AFRICAAM 145B", "AFRICAST 111", "AFRICAST 112", "AFRICAST 127", "AFRICAST 132", "AFRICAST 135", "AFRICAST 211", "ANTHRO 27N", "ARTHIST 127A", "COMPLIT 133", "COMPLIT 233A", "CSRE 133E", "FRENCH 133", "HISTORY 45B", "HISTORY 48Q", "HISTORY 106A", "HISTORY 145B", "HISTORY 147", "INTNLREL 62Q", "OSPCPTWN 10", "OSPCPTWN 30", "OSPCPTWN 38", "OSPCPTWN 45", "POLISCI 46N", "POLISCI 146A"],
    "Comp Intnl Gov": ["CHINA 146", "COMM 180", "CS 182", "EARTHSYS 61Q", "EARTHSYS 112", "EARTHSYS 212", "EASTASN 162", "ESS 61Q", "ESS 112", "ETHICSOC 131S", "ETHICSOC 182", "ETHICSOC 280", "GERMAN 270", "HISTORY 48Q", "HISTORY 103D", "HISTORY 173", "HISTORY 181B", "HISTORY 187", "HISTORY 202G", "HISTORY 204E", "HISTORY 205K", "HISTORY 224C", "HUMRTS 103", "HUMRTS 106", "INTLPOL 203", "INTLPOL 217", "INTLPOL 231B", "INTLPOL 280", "INTNLREL 60Q", "INTNLREL 61Q", "INTNLREL 63Q", "INTNLREL 64Q", "INTNLREL 114D", "INTNLREL 122", "INTNLREL 124", "INTNLREL 131", "INTNLREL 135A", "INTNLREL 140A", "INTNLREL 140C", "INTNLREL 145", "INTNLREL 158", "INTNLREL 160", "INTNLREL 180A", "LAW 5005", "OSPBER 71", "OSPBER 79", "OSPFLOR 78", "OSPMADRD 48", "OSPOXFRD 36", "OSPPARIS 32", "OSPPARIS 91", "OSPPARIS 122X", "OSPSANTG 20", "OSPSANTG 68", "OSPSANTG 116X", "PHIL 82", "POLISCI 46N", "POLISCI 110G", "POLISCI 130", "POLISCI 131L", "POLISCI 140P", "POLISCI 143S", "POLISCI 146A", "POLISCI 147", "POLISCI 148", "POLISCI 149T", "POLISCI 182", "POLISCI 113", "POLISCI 214R", "POLISCI 215A", "POLISCI 244U", "POLISCI 245R", "POLISCI 246A", "POLISCI 247G", "POLISCI 248S", "PUBLPOL 182", "REES 231B", "SINY 144", "SIW 119", "THINK 51"],
    "East and South Asia": ["CHINA 112", "CHINA 115", "CHINA 146", "CHINA 157", "EARTHSYS 138", "EASTASN 77", "EASTASN 94", "EASTASN 97", "EASTASN 117", "EASTASN 162", "EASTASN 168", "EASTASN 179", "EASTASN 189K", "EASTASN 277", "EASTASN 279", "EASTASN 285", "EASTASN 289K", "EASTASN 297", "ECON 124", "ECON 131", "FILMEDIA 134", "FILMEDIA 334", "HISTORY 67S", "HISTORY 95", "HISTORY 98", "HISTORY 98S", "HISTORY 106A", "HISTORY 195", "HISTORY 195C", "HISTORY 197", "HISTORY 198", "HISTORY 290", "HISTORY 292D", "HISTORY 293F", "HISTORY 392D", "INTLPOL 244", "INTLPOL 246", "INTNLREL 143", "INTNLREL 158", "JAPAN 125", "OSPKYOTO 13", "POLISCI 148", "RELIGST 56", "SOC 111", "SOC 117A", "SOC 211", "SOC 217A", "SOC 217B", "THINK 55"],
    "Economic Development/World Economy": ["BIOMEDIN 156", "CEE 107A", "EARTHSYS 41N", "EARTHSYS 103", "EARTHSYS 106", "EARTHSYS 112", "EARTHSYS 212", "EASTASN 179", "EASTASN 279", "ECON 106", "ECON 111", "ECON 118", "ECON 124", "ECON 125", "ECON 126", "ECON 127", "ECON 131", "ECON 141", "ECON 143", "ECON 149", "ECON 150", "ECON 155", "ECON 159", "ECON 162", "ECON 165", "ECON 166", "ESS 112", "GERMAN 109", "HISTORY 103D", "HISTORY 200E", "HISTORY 201A", "HISTORY 202B", "INTLPOL 203", "INTLPOL 227", "INTNLREL 110C", "INTNLREL 114D", "INTNLREL 123", "INTNLREL 135A", "INTNLREL 147", "MED 262", "MS&E 185", "MS&E 271", "OSPBER 79", "OSPBER 82", "OSPBER 126X", "OSPFLOR 26", "OSPFLOR 78", "OSPMADRD 54", "OSPPARIS 91", "OSPPARIS 122X", "OSPSANTG 119X", "POLISCI 110C", "POLISCI 110G", "POLISCI 110X", "POLISCI 127A", "POLISCI 143S", "POLISCI 213R", "POLISCI 141", "POLISCI 247G", "PUBLPOL 104", "PUBLPOL 107", "PUBLPOL 143", "PUBLPOL 204", "SIW 103", "SOC 114", "SOC 137"],
    "Environment, Energy, Natural Resources": ["ANTHRO 123B", "ANTHRO 123C", "ANTHRO 135B", "ANTHRO 166", "ANTHRO 266", "BIO 117", "BIO 138", "BIO 179", "BIO 238", "BIOHOPK 187H", "BIOHOPK 287H", "CEE 64", "CEE 70", "CEE 107A", "CEE 107S", "CEE 146S", "CEE 171G", "CEE 175A", "CEE 207A", "CEE 263D", "CEE 275A", "CHEMENG 60Q", "CSRE 125E", "SUSTAIN 2", "EARTHSYS 10", "EARTHSYS 41N", "EARTHSYS 46N", "EARTHSYS 61Q", "EARTHSYS 101", "EARTHSYS 102", "EARTHSYS 103", "EARTHSYS 104", "EARTHSYS 105", "EARTHSYS 106", "EARTHSYS 107", "EARTHSYS 111", "EARTHSYS 112", "EARTHSYS 114", "EARTHSYS 125", "EARTHSYS 139", "EARTHSYS 159", "EARTHSYS 185", "EARTHSYS 188", "EARTHSYS 196", "EARTHSYS 205", "EARTHSYS 212", "EARTHSYS 214", "EARTHSYS 225", "EARTHSYS 239", "EARTHSYS 243", "EARTHSYS 288", "EARTHSYS 296", "ECON 17N", "ECON 106", "ECON 155", "ECON 159", "ECON 209", "EE 60N", "ENERGY 101", "ENERGY 102", "ENGR 60", "ENGR 90", "ENVRES 250", "ESS 46N", "ESS 61Q", "ESS 107", "ESS 111", "ESS 112", "GEOPHYS 60N", "HISTORY 103D", "HUMBIO 3B", "HUMBIO 114", "INTNLREL 61Q", "INTNLREL 131", "INTNLREL 135A", "INTNLREL 146A", "MS&E 92Q", "OSPAUSTL 10", "OSPCPTWN 10", "OSPSANTG 29", "PUBLPOL 159", "STS 190"],
    "Europe and Russia": ["AFRICAAM 133", "CSRE 133E", "ENGLISH 145D", "FRENCH 120", "FRENCH 132", "FRENCH 133", "FRENCH 140", "GERMAN 101", "GERMAN 109", "GERMAN 120", "HISTORY 106B", "HISTORY 110C", "HISTORY 139", "HISTORY 185B", "HISTORY 224A", "HISTORY 227D", "HISTORY 228", "HISTORY 230C", "HISTORY 284", "ILAC 130", "ILAC 136", "ILAC 193", "INTLPOL 231B", "INTNLREL 122", "INTNLREL 124", "ITALIAN 129", "ITALIAN 155", "JEWISHST 155D", "JEWISHST 185B", "JEWISHST 282", "OSPBER 17", "OSPBER 60", "OSPBER 70", "OSPBER 71", "OSPBER 77", "OSPBER 79", "OSPBER 82", "OSPBER 126X", "OSPBER 174", "OSPFLOR 15", "OSPFLOR 26", "OSPFLOR 45", "OSPFLOR 48", "OSPFLOR 49", "OSPFLOR 65", "OSPFLOR 78", "OSPFLOR 111Y", "OSPMADRD 54", "OSPMADRD 57", "OSPMADRD 61", "OSPMADRD 72", "OSPMADRD 74", "OSPMADRD 75", "OSPOXFRD 36", "OSPOXFRD 117W", "OSPPARIS 32", "OSPPARIS 91", "OSPPARIS 122X", "POLISCI 113", "POLISCI 246A", "REES 231B", "SLAVIC 147", "SLAVIC 148"],
    "International History and Culture": ["AFRICAAM 49S", "AFRICAAM 133", "AMELANG 126", "ANTHRO 1", "ANTHRO 16", "ANTHRO 147B", "ARCHLGY 173", "ARTHIST 1A", "ARTHIST 1B", "ARTHIST 106", "ARTHIST 190A", "ARTHIST 203", "CHINA 157", "CLASSICS 163", "CLASSICS 391", "COMPLIT 100", "COMPLIT 145", "COMPLIT 237", "COMPLIT 249A", "CSRE 5C", "CSRE 105C", "CSRE 133E", "DLCL 100", "EASTASN 77", "EASTASN 189K", "EASTASN 277", "ENGLISH 145D", "ENGR 159Q", "FEMGEN 5C", "FEMGEN 101", "FEMGEN 105C", "FILMEDIA 134", "FILMEDIA 135", "FILMEDIA 334", "FRENCH 130", "FRENCH 131", "FRENCH 132", "FRENCH 133", "FRENCH 140", "FRENCH 175", "FRENCH 205", "FRENCH 228E", "FRENCH 265", "GERMAN 120", "GERMAN 131", "GERMAN 132", "GERMAN 133", "GERMAN 175", "GERMAN 222", "GLOBAL 249A", "HISTORY 3F", "HISTORY 5C", "HISTORY 50C", "HISTORY 67S", "HISTORY 86Q", "HISTORY 102", "HISTORY 103F", "HISTORY 105C", "HISTORY 110C", "HISTORY 113", "HISTORY 139", "HISTORY 145B", "HISTORY 147", "HISTORY 150C", "HISTORY 152K", "HISTORY 178", "HISTORY 181B", "HISTORY 185B", "HISTORY 187", "HISTORY 194B", "HISTORY 198", "HISTORY 200E", "HISTORY 202B", "HISTORY 202G", "HISTORY 204E", "HISTORY 204G", "HISTORY 205K", "HISTORY 206C", "HISTORY 206E", "HISTORY 227D", "HISTORY 230C", "HISTORY 243G", "HISTORY 281K", "HISTORY 284", "HISTORY 284F", "HISTORY 292D", "HISTORY 293F", "HUMRTS 106", "ILAC 130", "ILAC 131", "ILAC 136", "ILAC 157", "ILAC 161", "ILAC 175", "ILAC 193", "ILAC 278A", "INTNLREL 5C", "INTNLREL 103F", "INTNLREL 105C", "INTNLREL 154", "INTNLREL 168A", "INTNLREL 168W", "INTNLREL 173", "INTNLREL 174", "INTNLREL 175", "INTNLREL 179", "INTNLREL 182", "INTNLREL 183", "ITALIAN 101", "ITALIAN 127", "ITALIAN 128", "ITALIAN 129", "ITALIAN 152", "ITALIAN 175", "JEWISHST 106", "LINGUIST 167", "MATSCI 159Q", "MUSIC 7B", "OSPBER 17", "OSPBER 70", "OSPBER 77", "OSPFLOR 15", "OSPFLOR 34", "OSPFLOR 48", "OSPFLOR 49", "OSPFLOR 64", "OSPFLOR 111Y", "OSPFLOR 115Y", "OSPKYOCT 142", "OSPKYOTO 13", "OSPMADRD 43", "OSPMADRD 47", "OSPMADRD 74", "OSPMADRD 80", "OSPOXFRD 76", "OSPPARIS 30", "OSPPARIS 92", "OSPSANTG 68", "OSPSANTG 118X", "POLISCI 46N", "POLISCI 131L", "POLISCI 149S", "REES 301B", "RELIGST 1", "RELIGST 56", "RELIGST 61", "RELIGST 119", "SLAVIC 77Q", "SLAVIC 129", "SLAVIC 145", "SLAVIC 146", "SLAVIC 156", "SLAVIC 188", "SLAVIC 198", "SLAVIC 230", "SOC 217B", "THINK 12", "THINK 60", "URBANST 153"],
    "International Security": ["BIOE 122", "COMM 177Y", "EARTHSYS 61Q", "EASTASN 168", "EASTASN 285", "EASTASN 297", "EMED 122", "ESS 61Q", "HISTORY 3F", "HISTORY 3N", "HISTORY 10N", "HISTORY 102", "HISTORY 103F", "HISTORY 150C", "HISTORY 152K", "HISTORY 201A", "HISTORY 202G", "HISTORY 204G", "HISTORY 206C", "HISTORY 224C", "HISTORY 252B", "HISTORY 290", "INTLPOL 213", "INTLPOL 217", "INTLPOL 233", "INTLPOL 244", "INTLPOL 246", "INTLPOL 268", "INTLPOL 321", "INTNLREL 60Q", "INTNLREL 61Q", "INTNLREL 102", "INTNLREL 103F", "INTNLREL 110D", "INTNLREL 131", "INTNLREL 140A", "INTNLREL 140C", "INTNLREL 145", "INTNLREL 154", "INTNLREL 160", "INTNLREL 168A", "INTNLREL 168W", "INTNLREL 173", "INTNLREL 174", "INTNLREL 182", "INTNLREL 183", "MS&E 193", "MS&E 297", "OSPFLOR 49", "OSPCPTWN 10", "OSPKYOCT 142", "POLISCI 110D", "POLISCI 110Y", "POLISCI 114S", "POLISCI 118P", "POLISCI 149S", "POLISCI 113", "POLISCI 214R", "POLISCI 215", "PUBLPOL 122", "PUBLPOL 123", "THINK 12", "THINK 19", "THINK 54", "THINK 60"],
    "Latin American and Iberian Studies": ["AMSTUD 142", "CHILATST 180E", "COMPLIT 100", "COMPLIT 142", "CSRE 142", "CSRE 180E", "DLCL 100", "EARTHSYS 138", "ENGLISH 172E", "FRENCH 175", "GERMAN 175", "HISTORY 106B", "HISTORY 173", "HISTORY 174", "HISTORY 178", "HISTORY 206E", "HISTORY 279", "ILAC 130", "ILAC 131", "ILAC 132", "ILAC 136", "ILAC 140", "ILAC 161", "ILAC 175", "ILAC 193", "INTNLREL 146A", "INTNLREL 147", "INTNLREL 179", "ITALIAN 175", "OSPMADRD 14", "OSPMADRD 43", "OSPMADRD 47", "OSPMADRD 54", "OSPMADRD 55", "OSPMADRD 57", "OSPMADRD 60", "OSPMADRD 61", "OSPMADRD 72", "OSPMADRD 74", "OSPMADRD 75", "OSPSANTG 14", "OSPSANTG 20", "OSPSANTG 29", "OSPSANTG 58", "OSPSANTG 68", "OSPSANTG 71", "OSPSANTG 116X", "OSPSANTG 118X", "OSPSANTG 119X", "POLISCI 248S", "POLISCI 348S", "URBANST 153"],
    "Middle East and Central Asia": ["ARTHIST 106", "CLASSICS 171", "GLOBAL 133", "GLOBAL 134", "HISTORY 181B", "HISTORY 185B", "HISTORY 187", "HISTORY 224A", "HISTORY 282J", "HISTORY 282K", "HISTORY 283E", "HISTORY 283K", "HISTORY 284", "HISTORY 284F", "INTLPOL 238", "JEWISHST 185B", "POLISCI 118P", "POLISCI 149S", "POLISCI 149T", "POLISCI 215A", "POLISCI 245R", "POLISCI 246A", "RELIGST 61"],
    "Social Development and Human Well-Being": ["AFRICAST 111", "AFRICAST 112", "ANTHRO 126", "ANTHRO 137", "ANTHRO 182N", "ARTHIST 190A", "CHILATST 180E", "CHINA 115", "COMM 177Y", "COMM 180", "COMPLIT 100", "CS 182", "CSRE 5C", "CSRE 105C", "CSRE 180E", "DLCL 100", "EARTHSYS 41N", "EARTHSYS 112", "EARTHSYS 212", "ECON 155", "EDUC 136", "EDUC 202", "ESS 112", "ETHICSOC 136R", "ETHICSOC 182", "ETHICSOC 280", "FEMGEN 5C", "FEMGEN 101", "FEMGEN 105C", "FEMGEN 136", "FRENCH 175", "GERMAN 175", "HISTORY 5C", "HISTORY 103D", "HISTORY 105C", "HISTORY 106A", "HISTORY 106B", "HISTORY 113", "HISTORY 174", "HISTORY 185B", "HISTORY 201A", "HISTORY 204D", "HISTORY 204E", "HISTORY 206E", "HISTORY 224C", "HISTORY 243G", "HUMBIO 26", "HUMBIO 57", "HUMBIO 114", "HUMBIO 122M", "HUMRTS 101", "HUMRTS 103", "HUMRTS 108", "HUMRTS 110", "HUMRTS 115", "ILAC 175", "INTLPOL 210", "INTLPOL 213", "INTLPOL 238", "INTLPOL 250", "INTLPOL 280", "INTNLREL 5C", "INTNLREL 60Q", "INTNLREL 62Q", "INTNLREL 105C", "INTNLREL 114D", "INTNLREL 136R", "INTNLREL 140C", "INTNLREL 141A", "INTNLREL 142", "INTNLREL 145", "INTNLREL 160", "INTNLREL 180A", "ITALIAN 175", "MED 159", "MS&E 92Q", "MS&E 185", "MS&E 271", "OSPBER 71", "OSPBER 83", "OSPBER 174", "OSPCPTWN 38", "OSPCPTWN 45", "OSPFLOR 65", "OSPFLOR 78", "OSPMADRD 57", "OSPMADRD 60", "OSPMADRD 61", "OSPMADRD 72", "OSPOXFRD 117W", "OSPSANTG 71", "PEDS 223", "PEDS 225", "PHIL 76", "PHIL 82", "POLISCI 133", "POLISCI 136R", "POLISCI 143S", "POLISCI 149S", "POLISCI 182", "POLISCI 244U", "POLISCI 247G", "PSYC 51Q", "PSYCH 75", "PUBLPOL 134", "PUBLPOL 168", "PUBLPOL 182", "RELIGST 1", "RELIGST 119", "SOC 118", "SOC 126", "SOC 134", "SOC 137", "SPANLANG 108SL", "THINK 19", "THINK 48", "URBANST 114", "URBANST 145", "URBANST 153"],
    "WIM": ["INTNLREL 103F", "INTNLREL 110C", "POLISCI 110C", "INTNLREL 110D", "POLISCI 110D", "AMSTUD 110D", "INTNLREL 140C", "HISTORY 201C", "INTNLREL 158", "POLISCI 148", "INTNLREL 168W", "INTNLREL 174", "HISTORY 252B", "INTNLREL 200B", "POLISCI 103", "PUBLPOL 103C", "ETHICSOC 171", "PHIL 171", "POLISCI 336S"],
    "All IR": [
      {
        "type": "add",
        "method": "regex",
        "string": "^INTNLREL"
      }
    ]
  },
  "requirements": [
    {
      "name": "Required",
      "amount": 6,
      "lutList": ["International Politics", "Comparative Governance", "American Foreign Policy", "Introductory Economics", "Applied Economics", "Skills"]
    },
    {
      "lut": "Africa",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Governance",
      "lut": "Comp Intnl Gov",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Asia",
      "lut": "East and South Asia",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Economics",
      "lut": "Economic Development/World Economy",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Environment",
      "lut": "Environment, Energy, Natural Resources",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Europe/Russia",
      "lut": "Europe and Russia",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Hist/Culture",
      "lut": "International History and Culture",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Security",
      "lut": "International Security",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "LatAm",
      "lut": "Latin American and Iberian Studies",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "MidEast/Asia",
      "lut": "Middle East and Central Asia",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "name": "Social Dev",
      "lut": "Social Development and Human Well-Being",
      "bundleName": " ",
      "minUnits": 20
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
};
let degree$w = {
  "degree": "B.S. Mathematics",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Math_BS_Standard",
  "lookuptables": {
    "Core above 63, counts towards 57 req": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 63
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^MATH (19[389]|193X)$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(MATH 56|STATS 116|PHIL 15[12])$"
      }
    ],
    "All Math, counts towards 57 req": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^MATH (19[389]|193X|51M)$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(STATS 116|PHIL 15[12])$"
      }
    ],
    "Graduate Math": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<",
        "number": 200
      }
    ],
    "Electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<",
        "number": 101
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^MATH 19[38]$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA 100|AA 218|BIO 141|BIOE 101|CHEM 15[13]|CHEM 17[135]|CLASSICS 136|CS 10[39]|CS 121|CS 148|CS 154|CS 154N|CS 157|CS 16[1678]|CS 205L|CS 22[189]|CS 229A|CS 229T|CS 229M|CS 23[0345]|CS 25[01456]|CS 259Q|CS 26[1578]|CS 269Q|CS 35[45]|CME 108|ECON 50|ECON 51|ECON 52|ECON 102A|ECON 102B|ECON 102C|ECON 103|ECON 111|ECON 136|ECON 137|ECON 140|ECON 160|ECCON 162|ECON 18[012]|ECON 20[234]|ECON 284|EE 1[45]|EE 30|EE 6[02]|EE 263|EE 274|EE 276A|EE 364[AB]|EE 376A|EE 387|ENGR 1[45]|ENGR 30|ENGR 6[02]|ESS 246A|MS&E 11[12]|MS&E 121|MS&E 211|MS&E 220|MS&E 232H|MS&E 245A|MS&E 245B|MS&E 310|MUSIC 320|MUSIC 423|MUSIC 424|PHIL 15[01249]|PHIL 162|PHIL 25[04]|PHYSICS 14N|PHYSICS 45|PHYSICS 6[35]|PHYSICS 70|PHYSICS 10[0478]|PHYSICS 11[023]|PHYSICS 12[01]|PHYSICS 13[014]|PHYSICS 16[01]|PHYSICS 17[012]|PHYSICS 21[026]|PHYSICS 22[03]|PHYSICS 23[014]|PHYSICS 24[01]|PHYSICS 252|PHYSICS 26[01269]|STATS 110|STATS 116|STATS 141|STATS 160|STATS 191|STATS 20[03567]|STATS 21[378]|STATS 229|STATS 231|STATS 240|STATS 27[01]|STATS 305A|STATS 315B|STATS 318|STATS 376A)$"
      }
    ],
    "WIM": ["^MATH (101|109|110|120|171)$"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "minUnits": 57,
      "content": [
        {
          "name": "8 above 63",
          "amount": 8,
          "lut": "Core above 63, counts towards 57 req",
          "modifiers": ["countGradAsFour"]
        },
        {
          "type": "or",
          "name": "More units",
          "content": [
            {
              "type": "transferUnits",
              "id": "Math AP"
            },
            {
              "type": "transferUnits",
              "id": "Other math"
            },
            {
              "lut": "All Math, counts towards 57 req",
              "amount": 0
            }
          ]
        }
      ]
    },
    {
      "lut": "Electives",
      "amount": 4,
      "csnc": 1
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
};
let degree$v = {
  "degree": "B.S. MechE (Dynamic Systems)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MechE_BS_DynamicSystems",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Stats": ["CME 106", "STATS 110", "STATS 116"],
    "ODEs": ["CME 102", "MATH 53"],
    "Math": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Physics": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHYSICS"
      }
    ],
    "CHEM 31": ["CHEM 31A", "CHEM 31B", "CHEM 31M"],
    "CHEM 33": ["CHEM 33"],
    "Chemistry": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CHEM"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Science": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(BIO|PHYSICS|CHEM|BIOPHYS|APPHYS|CEE|BIOE|HUMBIO|EARTHSYS|GEOPHYS|ENVRES|ENERGY)"
      }
    ],
    "TIS": ["AA 252", "BIOE 131", "COMM 120W", "CS 181", "HUMBIO 174", "MS&E 193"],
    "Eng Fund": ["ENGR 14", "CS 106A", "CS 106B"],
    "Core": ["ENGR 15", "ME 1", "ME [378]0", "ME 10[234]", "ME 131", "ME 123", "ME 170[AB]"],
    "Dynamic systems required": ["ME 161", "ENGR 105"],
    "Dynamic systems optional": ["ME 327", "ENGR 205", "ME 210", "ME 220", "ME 331A", "ME 485"],
    "Materials and structures required": ["ME 149", "ME 152"],
    "Materials and structures optional": ["ME 234", "ME 241", "ME 281", "ME 283", "ME 287", "ME 331A", "ME 335A", "ME 338", "ME 339"],
    "Product realization required": ["ME 127", "ME 128", "ME 129"],
    "Product realization optional": ["ENGR 110", "ENGR 240", "CME 106", "ME 210", "ME 217", "ME 263", "ME 298"],
    "Thermo, fluids, heat transfer required": ["ME 132", "ME 133", "ME 149"],
    "Thermo, fluids, heat transfer optional": ["ME 250", "ME 257", "ME 351A", "ME 351B", "ME 352A", "ME 352B", "ME 352C", "ME 362A", "ME 370A", "ME 370B", "ME 371", "AA 283"],
    "ME 191": ["ME 191"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 24,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Stats"
        },
        {
          "lut": "ODEs"
        },
        {
          "lut": "Math",
          "amount": 0
        }
      ]
    },
    {
      "type": "and",
      "name": "Science",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 20,
      "content": [
        {
          //Chem/physics
          "name": "AAAAA",
          "type": "or",
          "amount": 4,
          "content": [
            {
              "type": "or",
              "name": "Mechanics",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Mechanics AP",
                  "cutoff": 5
                },
                {
                  "lut": "Mechanics"
                }
              ]
            },
            {
              "type": "or",
              "name": "E&M",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "E&M AP",
                  "cutoff": 5
                },
                {
                  "lut": "E&M"
                }
              ]
            },
            {
              "lut": "Physics"
            },
            {
              "type": "or",
              "name": "Science Elective",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Chemistry AP",
                  "cutoff": 5
                }
              ]
            },
            {
              "lut": "CHEM 31"
            },
            {
              "lut": "CHEM 33"
            },
            {
              "lut": "Chemistry"
            }
          ]
        },
        {
          "lut": "Science",
          "amount": 0
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Core",
      "amount": 12
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 18,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Dynamic systems required",
          "amount": 2
        },
        {
          "lut": "Dynamic systems optional",
          "amount": 2
        },
        {
          "name": "Elective",
          "lutList": ["Dynamic systems required", "Dynamic systems optional", "Materials and structures required", "Materials and structures optional", "Product realization required", "Product realization optional", "Thermo, fluids, heat transfer required", "Thermo, fluids, heat transfer optional", "ME 191"]
        }
      ]
    }
  ]
};
let degree$u = {
  "degree": "B.S. MechE (Materials)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MechE_BS_Materials",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Stats": ["CME 106", "STATS 110", "STATS 116"],
    "ODEs": ["CME 102", "MATH 53"],
    "Math": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Physics": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHYSICS"
      }
    ],
    "CHEM 31": ["CHEM 31A", "CHEM 31B", "CHEM 31M"],
    "CHEM 33": ["CHEM 33"],
    "Chemistry": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CHEM"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Science": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(BIO|PHYSICS|CHEM|BIOPHYS|APPHYS|CEE|BIOE|HUMBIO|EARTHSYS|GEOPHYS|ENVRES|ENERGY)"
      }
    ],
    "TIS": ["AA 252", "BIOE 131", "COMM 120W", "CS 181", "HUMBIO 174", "MS&E 193"],
    "Eng Fund": ["ENGR 14", "CS 106A", "CS 106B"],
    "Core": ["ENGR 15", "ME 1", "ME [378]0", "ME 10[234]", "ME 131", "ME 123", "ME 170[AB]"],
    "Dynamic systems required": ["ME 161", "ENGR 105"],
    "Dynamic systems optional": ["ME 327", "ENGR 205", "ME 210", "ME 220", "ME 331A", "ME 485"],
    "Materials and structures required": ["ME 149", "ME 152"],
    "Materials and structures optional": ["ME 234", "ME 241", "ME 281", "ME 283", "ME 287", "ME 331A", "ME 335A", "ME 338", "ME 339"],
    "Product realization required": ["ME 127", "ME 128", "ME 129"],
    "Product realization optional": ["ENGR 110", "ENGR 240", "CME 106", "ME 210", "ME 217", "ME 263", "ME 298"],
    "Thermo, fluids, heat transfer required": ["ME 132", "ME 133", "ME 149"],
    "Thermo, fluids, heat transfer optional": ["ME 250", "ME 257", "ME 351A", "ME 351B", "ME 352A", "ME 352B", "ME 352C", "ME 362A", "ME 370A", "ME 370B", "ME 371", "AA 283"],
    "ME 191": ["ME 191"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 24,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Stats"
        },
        {
          "lut": "ODEs"
        },
        {
          "lut": "Math",
          "amount": 0
        }
      ]
    },
    {
      "type": "and",
      "name": "Science",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 20,
      "content": [
        {
          //Chem/physics
          "name": "AAAAA",
          "type": "or",
          "amount": 4,
          "content": [
            {
              "type": "or",
              "name": "Mechanics",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Mechanics AP",
                  "cutoff": 5
                },
                {
                  "lut": "Mechanics"
                }
              ]
            },
            {
              "type": "or",
              "name": "E&M",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "E&M AP",
                  "cutoff": 5
                },
                {
                  "lut": "E&M"
                }
              ]
            },
            {
              "lut": "Physics"
            },
            {
              "type": "or",
              "name": "Science Elective",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Chemistry AP",
                  "cutoff": 5
                }
              ]
            },
            {
              "lut": "CHEM 31"
            },
            {
              "lut": "CHEM 33"
            },
            {
              "lut": "Chemistry"
            }
          ]
        },
        {
          "lut": "Science",
          "amount": 0
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Core",
      "amount": 12
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 18,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Materials and structures required",
          "amount": 2
        },
        {
          "lut": "Materials and structures optional",
          "amount": 2
        },
        {
          "name": "Elective",
          "lutList": ["Dynamic systems required", "Dynamic systems optional", "Materials and structures required", "Materials and structures optional", "Product realization required", "Product realization optional", "Thermo, fluids, heat transfer required", "Thermo, fluids, heat transfer optional", "ME 191"]
        }
      ]
    }
  ]
};
let degree$t = {
  "degree": "B.S. MechE (Product Realization)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MechE_BS_ProductRealization",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Stats": ["CME 106", "STATS 110", "STATS 116"],
    "ODEs": ["CME 102", "MATH 53"],
    "Math": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Physics": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHYSICS"
      }
    ],
    "CHEM 31": ["CHEM 31A", "CHEM 31B", "CHEM 31M"],
    "CHEM 33": ["CHEM 33"],
    "Chemistry": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CHEM"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Science": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(BIO|PHYSICS|CHEM|BIOPHYS|APPHYS|CEE|BIOE|HUMBIO|EARTHSYS|GEOPHYS|ENVRES|ENERGY)"
      }
    ],
    "TIS": ["AA 252", "BIOE 131", "COMM 120W", "CS 181", "HUMBIO 174", "MS&E 193"],
    "Eng Fund": ["ENGR 14", "CS 106A", "CS 106B"],
    "Core": ["ENGR 15", "ME 1", "ME [378]0", "ME 10[234]", "ME 131", "ME 123", "ME 170[AB]"],
    "Dynamic systems required": ["ME 161", "ENGR 105"],
    "Dynamic systems optional": ["ME 327", "ENGR 205", "ME 210", "ME 220", "ME 331A", "ME 485"],
    "Materials and structures required": ["ME 149", "ME 152"],
    "Materials and structures optional": ["ME 234", "ME 241", "ME 281", "ME 283", "ME 287", "ME 331A", "ME 335A", "ME 338", "ME 339"],
    "Product realization required": ["ME 127", "ME 128", "ME 129"],
    "Product realization optional": ["ENGR 110", "ENGR 240", "CME 106", "ME 210", "ME 217", "ME 263", "ME 298"],
    "Thermo, fluids, heat transfer required": ["ME 132", "ME 133", "ME 149"],
    "Thermo, fluids, heat transfer optional": ["ME 250", "ME 257", "ME 351A", "ME 351B", "ME 352A", "ME 352B", "ME 352C", "ME 362A", "ME 370A", "ME 370B", "ME 371", "AA 283"],
    "ME 191": ["ME 191"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 24,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Stats"
        },
        {
          "lut": "ODEs"
        },
        {
          "lut": "Math",
          "amount": 0
        }
      ]
    },
    {
      "type": "and",
      "name": "Science",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 20,
      "content": [
        {
          //Chem/physics
          "name": "AAAAA",
          "type": "or",
          "amount": 4,
          "content": [
            {
              "type": "or",
              "name": "Mechanics",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Mechanics AP",
                  "cutoff": 5
                },
                {
                  "lut": "Mechanics"
                }
              ]
            },
            {
              "type": "or",
              "name": "E&M",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "E&M AP",
                  "cutoff": 5
                },
                {
                  "lut": "E&M"
                }
              ]
            },
            {
              "lut": "Physics"
            },
            {
              "type": "or",
              "name": "Science Elective",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Chemistry AP",
                  "cutoff": 5
                }
              ]
            },
            {
              "lut": "CHEM 31"
            },
            {
              "lut": "CHEM 33"
            },
            {
              "lut": "Chemistry"
            }
          ]
        },
        {
          "lut": "Science",
          "amount": 0
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Core",
      "amount": 12
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 18,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Product realization required",
          "amount": 3
        },
        {
          "lut": "Product realization optional",
          "amount": 1
        },
        {
          "name": "Elective",
          "lutList": ["Dynamic systems required", "Dynamic systems optional", "Materials and structures required", "Materials and structures optional", "Product realization required", "Product realization optional", "Thermo, fluids, heat transfer required", "Thermo, fluids, heat transfer optional", "ME 191"]
        }
      ]
    }
  ]
};
let degree$s = {
  "degree": "B.S. MechE (Thermo, Fluids, Heat)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MechE_BS_ThermoFluidsHeat",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Stats": ["CME 106", "STATS 110", "STATS 116"],
    "ODEs": ["CME 102", "MATH 53"],
    "Math": [
      {
        "type": "add",
        "method": "regex",
        "string": "^MATH"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Physics": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHYSICS"
      }
    ],
    "CHEM 31": ["CHEM 31A", "CHEM 31B", "CHEM 31M"],
    "CHEM 33": ["CHEM 33"],
    "Chemistry": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CHEM"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "ACE"
      }
    ],
    "Science": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(BIO|PHYSICS|CHEM|BIOPHYS|APPHYS|CEE|BIOE|HUMBIO|EARTHSYS|GEOPHYS|ENVRES|ENERGY)"
      }
    ],
    "TIS": ["AA 252", "BIOE 131", "COMM 120W", "CS 181", "HUMBIO 174", "MS&E 193"],
    "Eng Fund": ["ENGR 14", "CS 106A", "CS 106B"],
    "Core": ["ENGR 15", "ME 1", "ME [378]0", "ME 10[234]", "ME 131", "ME 123", "ME 170[AB]"],
    "Dynamic systems required": ["ME 161", "ENGR 105"],
    "Dynamic systems optional": ["ME 327", "ENGR 205", "ME 210", "ME 220", "ME 331A", "ME 485"],
    "Materials and structures required": ["ME 149", "ME 152"],
    "Materials and structures optional": ["ME 234", "ME 241", "ME 281", "ME 283", "ME 287", "ME 331A", "ME 335A", "ME 338", "ME 339"],
    "Product realization required": ["ME 127", "ME 128", "ME 129"],
    "Product realization optional": ["ENGR 110", "ENGR 240", "CME 106", "ME 210", "ME 217", "ME 263", "ME 298"],
    "Thermo, fluids, heat transfer required": ["ME 132", "ME 133", "ME 149"],
    "Thermo, fluids, heat transfer optional": ["ME 250", "ME 257", "ME 351A", "ME 351B", "ME 352A", "ME 352B", "ME 352C", "ME 362A", "ME 370A", "ME 370B", "ME 371", "AA 283"],
    "ME 191": ["ME 191"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 24,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Stats"
        },
        {
          "lut": "ODEs"
        },
        {
          "lut": "Math",
          "amount": 0
        }
      ]
    },
    {
      "type": "and",
      "name": "Science",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 20,
      "content": [
        {
          //Chem/physics
          "name": "AAAAA",
          "type": "or",
          "amount": 4,
          "content": [
            {
              "type": "or",
              "name": "Mechanics",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Mechanics AP",
                  "cutoff": 5
                },
                {
                  "lut": "Mechanics"
                }
              ]
            },
            {
              "type": "or",
              "name": "E&M",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "E&M AP",
                  "cutoff": 5
                },
                {
                  "lut": "E&M"
                }
              ]
            },
            {
              "lut": "Physics"
            },
            {
              "type": "or",
              "name": "Science Elective",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Chemistry AP",
                  "cutoff": 5
                }
              ]
            },
            {
              "lut": "CHEM 31"
            },
            {
              "lut": "CHEM 33"
            },
            {
              "lut": "Chemistry"
            }
          ]
        },
        {
          "lut": "Science",
          "amount": 0
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Core",
      "amount": 12
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 18,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Thermo, fluids, heat transfer required",
          "amount": 3
        },
        {
          "lut": "Thermo, fluids, heat transfer optional",
          "amount": 1
        },
        {
          "name": "Elective",
          "lutList": ["Dynamic systems required", "Dynamic systems optional", "Materials and structures required", "Materials and structures optional", "Product realization required", "Product realization optional", "Thermo, fluids, heat transfer required", "Thermo, fluids, heat transfer optional", "ME 191"]
        }
      ]
    }
  ]
};
let degree$r = {
  "degree": "B.S. MS&E",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MS&E_BS_Standard",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Math": ["CME 100", "MATH 51", "ENGR 108", "MS&E 12[015]"],
    "Science": ["BIO 8[123456]", "CHEM 31B", "CHEM 33", "PHYS [24][13]"],
    "Math/Stats/Engr fund": ["CME 100", "CME 102", "ENGR 108", "CME 104", "CME 108", "CME 192", "MATH 5[123]", "MATH 6[123][CD]M", "CEE 101D", "CEE 201D", "CS 103", "ENGR 62", "ENGR 62X", "MATH 104", "MATH 106", "MATH 109", "MATH 110", "MATH 113", "MATH 115", "MATH 120", "MATH 121", "MATH 131P", "MS&E 121", "CME 106", "STATS 60", "STATS 160", "STATS 110", "STATS 116", "CS 109", "EE 178", "MATH 151", "MS&E 120", "MS&E 125", "CEE 203", "BIO 30", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 45", "BIO 46", "BIO 47", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 2", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "ENGR 10", "ENGR 14", "ENGR 15", "ENGR 20", "CHEME 20", "ENGR 21", "ENGR 40M", "ENGR 42", "ENGR 50", "ENGR 50E", "ENGR 50M", "ENGR 55", "ENGR 62", "MS&E 111", "ENGR 62X", "MS&E 111X", "ENGR 65", "EE 65", "ENGR 76", "ENGR 80", "BIOE 80", "ENGR 90", "CEE 70", "PSYCH 50"],
    "TIS": ["AA 252", "BIOE 131", "CEE 102A", "COMM 120W", "CS 152", "CS 181", "CS 182", "CS 278", "EARTHSYS 125", "ENGR 117", "ENGR 148", "MS&E 134", "MS&E 193", "POLISCI 114S", "PUBLPOL 134", "STS 1"],
    "Eng Fund": ["CS 106[AB]", "MS&E 111", "MS&E 111DS", "MS&E 111X"],
    "Eng Depth": ["CS 106B", "ECON 1", "ECON 50", "MS&E 108", "MS&E 180"],
    "F&D": ["ECON 51", "MS&E 141", "ECON 143", "MS&E 140", "MS&E 240", "MS&E 145", "MS&E 245A", "MS&E 146", "MS&E 249", "MS&E 152", "MS&E 252", "MS&E 245B", "MS&E 246", "MS&E 248", "MS&E 250A", "MS&E 250B"],
    "O&A": ["MS&E 112", "MS&E 212", "MS&E 130", "MS&E 134", "MS&E 135", "MS&E 213", "MS&E 223", "MS&E 226", "MS&E 228", "MS&E 230", "MS&E 231", "MS&E 232", "MS&E 232H", "MS&E 233", "MS&E 234", "MS&E 236", "MS&E 251", "MS&E 260", "MS&E 262", "MS&E 263", "MS&E 267", "MS&E 463", "MS&E 264"],
    "OTP": ["ENGR 145", "ENGR 145S", "ENGR 148", "ENGR 248", "MS&E 175", "MS&E 182", "MS&E 183", "MS&E 184", "MS&E 185", "MS&E 188", "MS&E 193", "MS&E 243", "MS&E 292"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math, Science",
      "minUnits": 36,
      "content": [
        {
          "type": "and",
          "name": "Math",
          "bundle": true,
          "content": [
            {
              "type": "or",
              "name": "MATH 19",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 3
                },
                {
                  "lut": "MATH 19"
                }
              ]
            },
            {
              "type": "or",
              "name": "MATH 20",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 6
                },
                {
                  "lut": "MATH 20"
                }
              ]
            },
            {
              "type": "or",
              "name": "MATH 21",
              "amount": 0,
              "content": [
                {
                  "type": "transfer",
                  "id": "Math AP",
                  "cutoff": 10
                },
                {
                  "lut": "MATH 21"
                }
              ]
            },
            {
              "lut": "Math",
              "amount": 5
            }
          ]
        },
        {
          "type": "and",
          "name": "Science",
          "bundle": true,
          "content": [
            {
              "lut": "Science"
            },
            {
              "lut": "Math/Stats/Engr fund"
            }
          ]
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "type": "observe",
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Eng Depth",
      "amount": 5
    },
    {
      "type": "and",
      "name": "Depth Conc",
      "bundle": true,
      "content": [
        {
          "lut": "F&D",
          "amount": 2
        },
        {
          "lut": "O&A",
          "amount": 2
        },
        {
          "lut": "OTP",
          "amount": 2
        },
        {
          "type": "or",
          "amount": 2,
          "content": [
            {
              "lut": "F&D",
              "amount": 2
            },
            {
              "lut": "O&A",
              "amount": 2
            },
            {
              "lut": "OTP",
              "amount": 2
            }
          ]
        }
      ]
    }
  ]
};
let degree$q = {
  "degree": "B.A. Political Science",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Polisci_BA_Standard",
  "infoText": "Fill one to 25, one to 15, plus 20 more. Bump courses if necessary.",
  "lookuptables": {
    "POLISCI 1": ["POLISCI 1"],
    "Methods": ["POLISCI 150A", "STATS 60", "STATS 101", "ECON 102A", "CS 106A"],
    "Data Science": ["POLISCI 127", "POLISCI 141A", "POLISCI 147P", "POLISCI 355A", "POLISCI 150A", "POLISCI 150B", "POLISCI 355B", "POLISCI 150C", "POLISCI 355C", "POLISCI 151", "POLISCI 354", "POLISCI 354", "POLISCI 153Z", "POLISCI 154", "POLISCI 156", "POLISCI 182", "POLISCI 227C", "POLISCI 241S", "POLISCI 247A", "POLISCI 347A", "POLISCI 251A", "POLISCI 344", "POLISCI 356A", "POLISCI 356B", "POLISCI 358", "COMM 106", "COMM 206", "COMM 154", "COMM 254", "CSRE 154T", "SOC 154", "CS 106A", "ENGR 70A", "CS 106B", "ENGR 70B", "CS 109", "ECON 121", "EARTHSYS 120", "PUBPOL 120", "PUBPOL 220", "ECON 180", "OSPOXFRD 82", "STATS 101", "STATS 110"],
    "Elections, Representation, and Governance": ["POLISCI 20N", "POLISCI 20Q", "POLISCI 23Q", "POLISCI 25N", "POLISCI 29N", "POLISCI 31N", "POLISCI 34Q", "POLISCI 72", "POLISCI 75", "POLISCI 82", "POLISCI 102", "POLISCI 104", "POLISCI 110D", "POLISCI 110Y", "POLISCI 115", "POLISCI 120B", "POLISCI 120C", "POLISCI 120Z", "POLISCI 121", "POLISCI 121L", "POLISCI 124A", "POLISCI 124L", "POLISCI 125M", "POLISCI 125P", "POLISCI 125S", "POLISCI 127", "POLISCI 128F", "POLISCI 128S", "POLISCI 130", "POLISCI 131L", "POLISCI 132A", "POLISCI 134P", "POLISCI 134L", "POLISCI 135", "POLISCI 140P", "POLISCI 143C", "POLISCI 143S", "POLISCI 147", "POLISCI 147B", "POLISCI 147P", "POLISCI 148", "POLISCI 348", "POLISCI 149T", "POLISCI 150A", "POLISCI 355A", "POLISCI 213E", "POLISCI 217A", "POLISCI 220", "POLISCI 220C", "POLISCI 320C", "POLISCI 220R", "POLISCI 320R", "POLISCI 222", "POLISCI 222F", "POLISCI 222P", "POLISCI 222S", "POLISCI 223", "POLISCI 223A", "POLISCI 224", "POLISCI 226", "POLISCI 226A", "POLISCI 226T", "POLISCI 326T", "POLISCI 227C", "POLISCI 228C", "POLISCI 234", "POLISCI 240A", "POLISCI 340A", "POLISCI 241", "POLISCI 241A", "POLISCI 242G", "POLISCI 342G", "POLISCI 241B", "POLISCI 244A", "POLISCI 244U", "POLISCI 344U", "POLISCI 245R", "POLISCI 246A", "POLISCI 246P", "POLISCI 247G", "POLISCI 248S", "POLISCI 348S", "POLISCI 311E", "POLISCI 327C", "POLISCI 344", "ANTHRO 182D", "ANTHRO 282D", "CSRE 182C", "HISTORY 282D", "HISTORY 382D", "SOC 182H", "COMM 130N", "COMM 157", "COMM 257", "COMM 357", "CSRE 220", "ECON 116", "AMSTUD 116", "HISTORY 156", "ECON 155", "EDUC 197", "FEMGEN 297", "SOC 134", "EDUC 220D", "HISTORY 258E", "HISTORY 4", "HISTORY 104", "HIST 70", "HIST 170B", "HISTORY 81B", "HISTORY 181B", "HISTORY 87", "HISTORY 187", "HISTORY 152", "HISTORY 352B", "HISTORY 153", "HISTORY 158C", "AMSTUD 165", "EDUC 165", "EDUC 265", "HISTORY 204G", "REES 304G", "HISTORY 252", "HISTORY 352", "HISTORY 261G", "INTNLREL 173", "HISTORY 288", "HISTORY 388", "JEWISHST 288", "JEWISHST 388", "HUMBIO 120", "HUMBIO 120A", "HUMBIO 120B", "HUMBIO 129S", "HUMBIO 173", "PUBLPOL 173", "LAW 2519", "MS&E 193", "MS&E 293", "INTLPOL 256", "GEOSCI 167", "GEOSCI 267", "OSPBER 115X", "OSPCPTWN 69", "OSPFLOR 12", "OSPFLOR 43", "OSPFLOR 78", "OSPISTAN 72", "OSPOXFRD 22", "OSPOXFRD 24", "OSPOXFRD 36", "OSPOXFRD 82", "OSPPARIS 32", "OSPPARIS 122X", "OSPSANTG 116X", "OSPSANTG 129X", "PHIL 179W", "PHIL 279W", "CSRE 179W", "ETHICSOC 179W", "PUBLPOL 132", "PUBLPOL 232", "PUBLPOL 135", "PUBLPOL 154", "PUBLPOL 156", "PUBLPOL 209", "PUBLPOL 353A", "SIW 105", "SIW 106", "SIW 107", "SIW 124", "SIW 156", "SOC 118", "SOC 218", "SOC 135", "SOC 235", "SOC 136", "SOC 236", "SOC 145", "SOC 245", "CSRE 145", "THINK 47", "THINK 51", "URBANST 112", "CSRE 149A", "SOC 149", "SOC 249"],
    "International Relations": ["POLISCI 10N", "POLISCI 43Q", "POLISCI 101", "POLISCI 101Z", "POLISCI 110C", "POLISCI 110X", "POLISCI 110D", "POLISCI 110Y", "POLISCI 110G", "POLISCI 111", "POLISCI 113", "POLISCI 114D", "POLISCI 314D", "POLISCI 114S", "POLISCI 115", "POLISCI 115B", "POLISCI 115E", "POLISCI 116", "POLISCI 116M", "POLISCI 116A", "POLISCI 117", "POLISCI 317", "POLISCI 118P", "POLISCI 136R", "POLISCI 336", "POLISCI 142", "POLISCI 143C", "POLISCI 147", "POLISCI 149S", "POLISCI 210A", "POLISCI 211A", "POLISCI 211B", "POLISCI 211N", "POLISCI 311N", "POLISCI 212A", "POLISCI 213A", "POLISCI 213E", "POLISCI 214", "POLISCI 214R", "POLISCI 314R", "POLISCI 215A", "POLISCI 217A", "POLISCI 218T", "POLISCI 235", "POLISCI 237", "POLISCI 242", "POLISCI 342", "POLISCI 248D", "POLISCI 312", "AFRICAST 111", "AFRICAST 211", "AFRICAST 112", "AFRICAST 212", "ANTHRO 337", "ECON 106", "ECON 206", "EARTHSYS 106", "EARTHSYS 206", "ESS 106", "ESS 206", "HISTORY 102", "INTNLREL 102", "HISTORY 106A", "HISTORY 106B", "HISTORY 261G", "INTNLREL 173", "HISTORY 279", "HISTORY 379", "HISTORY 288", "HISTORY 388", "JEWISHST 288", "JEWISHST 388", "INTLPOL 217", "INTLPOL 219", "INTLPOL 244", "INTLPOL 246", "INTLPOL 280", "ETHICSOC 280", "HUMRTS 103", "INTNLREL 180A", "INTNLREL 103F", "HISTORY 3F", "HISTORY 103F", "INTNLREL 123", "INTNLREL 140A", "INTNLREL 140C", "INTNLREL 140X", "HISTORY 201C", "INTNLREL 142", "AFRICAST 142", "AFRICAST 242", "INTNLREL 182", "MS&E 93Q", "MS&E 193", "MS&E 293", "INTLPOL 256", "GEOSCI 167", "GEOSCI 267", "OSPBER 77", "OSPBER 82", "OSPBER 126X", "OSPCPTWN 10", "OSPCPTWN 31", "OSPFLOR 64", "OSPFLOR 65", "OSPPARIS 122X", "OSPSANTG 129X", "SIW 119", "SOC 111", "SOC 211", "INTNLREL 143", "SOC 117A", "SOC 217A", "THINK 19"],
    "Justice and Law": ["POLISCI 29N", "POLISCI 31N", "POLISCI 31Q", "POLISCI 102", "POLISCI 103", "POLISCI 336S", "POLISCI 114D", "POLISCI 314D", "POLISCI 122", "POLISCI 125P", "POLISCI 126", "POLISCI 127A", "POLISCI 128F", "POLISCI 128S", "POLISCI 130", "POLISCI 131L", "POLISCI 132A", "POLISCI 133", "POLISCI 133Z", "POLISCI 134", "POLISCI 134E", "POLISCI 338", "POLISCI 134L", "POLISCI 134P", "POLISCI 135", "POLISCI 135E", "POLISCI 235E", "POLISCI 136R", "POLISCI 336", "POLISCI 137", "POLISCI 137A", "POLISCI 337A", "POLISCI 182", "POLISCI 211A", "POLISCI 221A", "POLISCI 222S", "POLISCI 223", "POLISCI 225L", "POLISCI 325L", "POLISCI 226A", "POLISCI 228C", "POLISCI 230", "POLISCI 230A", "POLISCI 330A", "POLISCI 231", "POLISCI 331", "POLISCI 231A", "POLISCI 232", "POLISCI 232T", "POLISCI 332T", "POLISCI 233", "POLISCI 234", "POLISCI 234N", "POLISCI 234S", "POLISCI 234P", "POLISCI 334P", "POLISCI 235", "POLISCI 235A", "POLISCI 335A", "POLISCI 235B", "POLISCI 335B", "POLISCI 235C", "POLISCI 335C", "POLISCI 235N", "POLISCI 236", "POLISCI 236S", "POLISCI 237", "POLISCI 237R", "POLISCI 337R", "POLISCI 238R", "POLISCI 327C", "POLISCI 333M", "POLISCI 338B", "POLISCI 432R", "COMM 130N", "CSRE 220", "EDUC 220D", "HISTORY 258E", "HISTORY 152", "HISTORY 352B", "HISTORY 204G", "HISTORY 304G", "REES 304G", "HISTORY 252", "HISTORY 352", "HUMBIO 173", "PUBLPOL 173", "INTLPOL 280", "ETHICSOC 280", "HUMRTS 103", "INTNLREL 180A", "INTNLREL 140A", "LAW 2519", "OSPCPTWN 45", "OSPFLOR 12", "OSPFLOR 43", "OSPFLOR 65", "OSPOXFRD 18", "OSPOXFRD 24", "OSPSANTG 20", "PHIL 2", "ETHICSOC 20", "PHIL 175W", "PHIL 275W", "ETHICSOC 175W", "PHIL 179W", "PHIL 279W", "CSRE 179W", "ETHICSOC 179W", "PUBLPOL 106", "PUBLPOL 206", "ECON 154", "PUBLPOL 132", "PUBLPOL 232", "RELIGST 208", "AFRICAAM 208", "AMSTUD 208", "FEMGEN 208", "HISTORY 268", "SIW 105", "SIW 106", "SIW 107", "SOC 136", "SOC 236", "THINK 19", "THINK 42", "THINK 47", "URBANST 112", "CSRE 149A", "SOC 149", "SOC 249"],
    "Political Economy and Development": ["POLISCI 25N", "POLISCI 31Q", "POLISCI 34Q", "POLISCI 43Q", "POLISCI 46N", "POLISCI 101", "POLISCI 101Z", "POLISCI 102", "POLISCI 103", "POLISCI 336S", "POLISCI 104", "POLISCI 110C", "POLISCI 110X", "POLISCI 110G", "POLISCI 114D", "POLISCI 314D", "POLISCI 115E", "POLISCI 116", "POLISCI 117", "POLISCI 317", "POLISCI 118P", "POLISCI 120B", "POLISCI 121", "POLISCI 121L", "POLISCI 122", "POLISCI 124L", "POLISCI 324L", "POLISCI 125M", "POLISCI 125S", "POLISCI 127", "POLISCI 127A", "POLISCI 137A", "POLISCI 337A", "POLISCI 141", "POLISCI 141A", "POLISCI 142", "POLISCI 143S", "POLISCI 147", "POLISCI 147B", "POLISCI 148", "POLISCI 348", "POLISCI 149S", "POLISCI 149T", "POLISCI 153", "POLISCI 354", "POLISCI 153Z", "POLISCI 210A", "POLISCI 213E", "POLISCI 214", "POLISCI 220", "POLISCI 220C", "POLISCI 320C", "POLISCI 220R", "POLISCI 320R", "POLISCI 221A", "POLISCI 222P", "POLISCI 223", "POLISCI 225L", "POLISCI 325L", "POLISCI 226", "POLISCI 230", "POLISCI 231", "POLISCI 331", "POLISCI 232", "POLISCI 232T", "POLISCI 332T", "POLISCI 234P", "POLISCI 334P", "POLISCI 236", "POLISCI 236S", "POLISCI 238R", "POLISCI 241", "POLISCI 241A", "POLISCI 241B", "POLISCI 241S", "POLISCI 241T", "POLISCI 242G", "POLISCI 342G", "POLISCI 244A", "POLISCI 244C", "POLISCI 244D", "POLISCI 244U", "POLISCI 344U", "POLISCI 245C", "POLISCI 245R", "POLISCI 246A", "POLISCI 446A", "POLISCI 246P", "POLISCI 346P", "POLISCI 247A", "POLISCI 347A", "POLISCI 247G", "POLISCI 248D", "POLISCI 348D", "POLISCI 248S", "POLISCI 348S", "POLISCI 311E", "POLISCI 312", "POLISCI 327C", "POLISCI 344", "AFRICAST 111", "AFRICAST 211", "AFRICAST 112", "AFRICAST 212", "AFRICAAM 211", "AFRICAAM 111", "ANTHRO 337", "CLASSICS 116", "ETHICSOC 106", "HUMRTS 106", "COMM 157", "COMM 257", "COMM 357", "ECON 1", "ECON 50", "ECON 51", "ECON 52", "ECON 102A", "ECON 102B", "ECON 106", "ECON 206", "EARTHSYS 106", "EARTHSYS 206", "ESS 106", "ESS 206", "ECON 113", "PUBLPOL 354", "ECON 116", "AMSTUD 116", "HISTORY 156", "ECON 155", "EDUC 197", "FEMGEN 297", "SOC 134", "HISTORY 70", "HISTORY 170B", "HISTORY 87", "HISTORY 187", "HISTORY 106A", "HISTORY 106B", "HISTORY 181B", "HUMBIO 129S", "INTLPOL 244", "INTLPOL 246", "INTNLREL 123", "INTNLREL 140C", "INTNLREL 140X", "HISTORY 201C", "INTNLREL 142", "AFRICAST 142", "AFRICAST 242", "MS&E 180", "OSPBER 79", "OSPBER 115X", "OSPBER 126X", "OSPCPTWN 10", "OSPCPTWN 31", "OSPCPTWN 69", "OSPCPTWN 76", "OSPFLOR 64", "OSPFLOR 78", "OSPISTAN 72", "OSPOXFRD 18", "OSPOXFRD 36", "OSPPARIS 32", "OSPSANTG 116X", "PUBLPOL 106", "PUBLPOL 206", "ECON 154", "SIW 103", "SOC 111", "SOC 211", "INTNLREL 143", "SOC 117A", "SOC 217A", "SOC 135", "SOC 235", "SOC 145", "SOC 245", "CSRE 145", "THINK 42"],
    "Seminar": [
      {
        "type": "add",
        "method": "regex",
        "string": "^POLISCI"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<",
        "number": 200
      }
    ],
    "WIM": ["POLISCI 103", "POLISCI 110C", "POLISCI 110D", "POLISCI 120C", "POLISCI 121", "POLISCI 148", "POLISCI 236S", "POLISCI 299A"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "PS 1, Methods",
      "bundle": true,
      "content": [
        {
          "lut": "POLISCI 1"
        },
        {
          "lut": "Methods"
        }
      ]
    },
    {
      "lut": "Data Science",
      "bundleName": " ",
      "minUnits": 25
    },
    {
      "name": "Governance",
      "lut": "Elections, Representation, and Governance",
      "bundleName": " ",
      "minUnits": 25
    },
    {
      "name": "IR",
      "lut": "International Relations",
      "bundleName": " ",
      "minUnits": 25
    },
    {
      "name": "Law",
      "lut": "Justice and Law",
      "bundleName": " ",
      "minUnits": 25
    },
    {
      "name": "Political Econ",
      "lut": "Political Economy and Development",
      "bundleName": " ",
      "minUnits": 25
    },
    {
      "type": "observe",
      "lut": "Seminar"
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
};
let degree$p = {
  "degree": "B.A. Psychology",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Psychology_BA_Standard",
  "lookuptables": {
    "Intro": ["PSYCH 1", "PSYCH 10"],
    "A": ["PSYCH 30", "PSYCH 35", "PSYCH 45", "PSYCH 50"],
    "B": ["PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 80, PSYCH 90", "PSYCH 95"],
    "WIM": ["PSYCH 138", "PSYCH 144", "PSYCH 164", "PSYCH 175", "PSYCH 180", "PSYCH 150"],
    "Elective": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PSYCH"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(BIO 150|PSYC 135|PSYC 139)$"
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Units",
      "minUnits": 70,
      "content": [
        {
          "lut": "Intro",
          "amount": 2
        },
        {
          "name": "Core",
          "type": "and",
          "bundle": true,
          "content": [
            {
              "lut": "A",
              "amount": 2
            },
            {
              "lut": "B",
              "amount": 2
            },
            {
              "lutList": ["A", "B"],
              "amount": 1
            }
          ]
        },
        {
          "lut": "Elective"
        }
      ]
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
};
let degree$o = {
  "degree": "B.S. SymSys (AI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_AI",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Programming": ["CS 107", "CS 107E"],
    "AI Intro": ["CS 221"],
    "AI Depth": ["CS 223A", "CS 224N", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 228", "CS 229", "CS 231A", "CS 231N", "CS 234", "CS 237A", "CS 237B", "CS 238"],
    "Integ concentration": ["COMM 324", "COMM 326", "CS 131", "CS 181", "CS 182", "CS 281", "CS 229M", "CS 230", "CS 257", "CS 325B", "CS 379C", "CS 384", "CS 470", "EDUC 234", "LINGUIST 180", "MUSIC 220C", "NENS 220", "OTOHNS 206", "PHIL 356C", "PHIL 359", "PSYCH 164", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 293", "STATS 220", "SYMSYS 202"],
    "Contingent Electives": ["ANTHRO 100X", "BIOE 177", "BIOE 273", "BIOMEDIN 210", "BIOMEDIN 214", "COMM 153B", "COMM 230A", "CS 142", "CS 152", "CS 205L", "CS 217", "CS 227B", "CS 236", "CS 246", "CS 329D", "CS 330", "CS 348I", "CS 348K", "EE 104", "EE 374", "ENGLISH 384B", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "ESS 224", "GLOBAL 124", "INTLPOL 259", "LAW 807S", "LAW 4039", "MS&E 135", "MS&E 234", "MUSIC 220B", "MUSIC 220C", "PHIL 20N", "PHIL 134A", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 232", "PUBLPOL 103F", "STATS 200", "STATS 202", "STATS 315A", "STATS 315B", "SYMSYS 104", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "AI",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming"
        },
        {
          "type": "observe",
          "lut": "AI Intro"
        },
        {
          "type": "observe",
          "lut": "AI Depth"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Programming", "AI Intro", "AI Depth", "Contingent Electives"]
    }
  ]
};
let degree$n = {
  "degree": "B.S. SymSys (Applied Logic)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_AppliedLogic",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Metalogic": ["PHIL 151"],
    "Computability": ["PHIL 152", "CS 154"],
    "Comp logic": ["CS 151", "CS 157", "CS 257"],
    "Set theory": ["MATH 161"],
    "Integ concentration": ["CS 151", "CS 163", "CS 204", "CS 227B", "CS 228", "CS 242", "CS 254", "CS 257", "CS 281", "CS 358A", "LINGUIST 130A", "LINGUIST 230B", "PHIL 154", "PHIL 162", "PHIL 184B", "PHIL 351D", "PHIL 356C", "PHIL 359", "PSYCH 204", "PSYCH 220A", "PSYCH 293"],
    "Contingent Electives": ["ANTHRO 100X", "BIOE 177", "BIOE 273", "COMM 153B", "CS 254B", "EE 374", "ENGR 148", "GLOBAL 124", "LAW 807S", "LINGUIST 230C", "MATH 56", "OTOHNS 206", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PUBLPOL 103F", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Metalogic"
        },
        {
          "type": "observe",
          "lut": "Computability"
        },
        {
          "type": "observe",
          "lut": "Comp logic"
        },
        {
          "type": "observe",
          "lut": "Set theory"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Metalogic", "Computability", "Comp logic", "Set theory", "Contingent Electives"]
    }
  ]
};
let degree$m = {
  "degree": "B.S. SymSys (Biomed)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_Biomed",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Phil/Eth inquiry": ["BIOE 131", "BIOE 177", "HUMBIO 171E", "HUMBIO 178A", "HUMBIO 174", "NBIO 101", "PHIL 85", "PHIL 134A", "PHIL 167D", "PHIL 168M", "PHIL 178M", "PHIL 360", "PHIL 368A", "SYMSYS 202", "SYMSYS 205"],
    "Theory and math": ["BIO 183", "BIO 223", "BIO 251", "BIODS 215", "BIOMEDIN 219", "ECON 136", "EE 102A", "GEOPHYS 128", "HUMBIO 88", "HUMBIO 89", "HUMBIO 154B", "MS&E 292", "STATS 141", "STATS 215"],
    "Comp/Design methods": ["BIODS 220", "BIOE 273", "BIOE 313", "BIOE 375", "BIOMEDIN 210", "BIOMEDIN 260", "BIOMEDIN 273B", "BIOMEDIN 279", "CS 247B", "CS 247S", "CS 273A", "CS 372", "CS 379C", "CS 448B", "GENE 211", "HUMBIO 51", "HUMBIO 151R", "OTOHNS 206", "PSYC 223B", "PSYCH 204B", "STATS 155", "STATS 220", "SYMSYS 245"],
    "Science": ["BIO 81", "BIO 82", "BIO 84", "BIO 150", "BIO 151", "BIO 204", "BIODS 215", "HUMBIO 4B", "HUMBIO 51", "HUMBIO 151R", "HUMBIO 154B", "MS&E 292", "NBIO 206", "PSYC 124", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 121", "PSYCH 162", "PSYCH 168", "PSYCH 169", "PSYCH 202", "PSYCH 204A", "PSYCH 232", "PSYCH 254"],
    "Integ concentration": ["BIOMEDIN 210", "BIOMEDIN 220", "BIOMEDIN 260", "BIOMEDIN 273A", "BIOMEDIN 273B", "BIOMEDIN 279", "COMM 326", "COMM 372G", "CS 325B", "CS 372", "CS 379C", "HUMBIO 146", "OTOHNS 206", "PHIL 167D", "PHIL 168M", "PHIL 178M", "PHIL 360", "PHIL 368A", "PSYC 223B", "PSYCH 121", "PSYCH 162", "PSYCH 169", "PSYCH 202", "PSYCH 204A", "PSYCH 204B", "PSYCH 232", "PSYCH 254", "PSYCH 273", "STATS 220", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 83", "BIO 103", "BIOE 177", "COMM 153B", "CS 152", "CS 257", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "LAW 807S", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 118F", "PSYCH 144", "PSYCH 220A", "PSYCH 278", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 104", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Phil/Eth inquiry"
        },
        {
          "type": "observe",
          "lut": "Theory and math"
        },
        {
          "type": "observe",
          "lut": "Comp/Design methods"
        },
        {
          "type": "observe",
          "lut": "Science"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Phil/Eth inquiry", "Theory and math", "Comp/Design methods", "Science", "Contingent Electives"]
    }
  ]
};
let degree$l = {
  "degree": "B.S. SymSys (Cog Sci)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_CognitiveScience",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Cognitive Neuroscience": ["PSYCH 30", "PSYCH 45", "PSYCH 50"],
    "Inferential Statistics": ["ANTHRO 116", "MS&E 125", "MS&E 226", "PSYCH 10", "PSYCH 253", "SOC 180B", "STATS 110", "STATS 191", "STATS 101", "STATS 200", "STATS 202"],
    "Research Methods": ["CS 107", "CS 107E", "CS 129", "CS 229", "LINGUIST 180", "LINGUIST 188", "LINGUIST 245B", "PHIL 167D", "PSYCH 164", "PSYCH 170", "PSYCH 187", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 240A", "PSYCH 242", "PSYCH 249", "PSYCH 251", "PSYCH 253", "PSYCH 262", "STATS 220"],
    "Cog Sci Depth": ["CS 224N", "LINGUIST 110", "LINGUIST 140", "LINGUIST 180", "LINGUIST 188", "LINGUIST 236", "LINGUIST 248", "PHIL 181", "PHIL 194D", "PHIL 385D", "PSYCH 140", "CS 131", "CS 205A", "CS 231A", "LINGUIST 105", "MUSIC 251", "OTOHNS 206", "PSYCH 30", "PSYCH 221", "PSYCH 250", "PSYCH 263", "COMM 108", "COMM 322", "CS 227B", "CS 228", "CS 238", "CS 398", "EDUC 307", "EDUC 368", "PHIL 184", "PHIL 184B", "PHIL 186", "PHIL 187", "PHIL 194A", "PHIL 386", "PSYCH 45", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 118F", "PSYCH 141", "PSYCH 144", "PSYCH 147", "PSYCH 154", "PSYCH 160", "PSYCH 169", "PSYCH 175", "PSYCH 205", "PSYCH 226", "PSYCH 266", "PSYCH 278", "PSYCH 285", "PSYCH 293", "SYMSYS 203", "BIO 150", "EDUC 266", "GENE 104Q", "MED 142", "NBIO 206", "NBIO 258", "PHIL 167D", "PHIL 360", "PHIL 368A", "PSYCH 50", "PSYCH 162", "PSYCH 164", "PSYCH 168", "PSYCH 202", "PSYCH 204A", "PSYCH 204B", "PSYCH 209", "PSYCH 232", "PSYCH 249", "PSYCH 254", "PSYCH 263", "PSYCH 287", "CS 154", "CS 205A", "CS 229M", "CS 234", "CS 237A", "ECON 160", "EE 376A", "ETHICSOC 187", "HUMBIO 174A", "PHIL 82T", "PHIL 152", "PHIL 153L", "PHIL 154", "PHIL 351D", "PSYCH 204", "PSYCH 220A", "SYMSYS 207", "SYMSYS 208"],
    "Integ concentration": ["COMM 326", "COMM 372G", "CS 131", "CS 181", "CS 182", "CS 221", "CS 227B", "CS 228", "CS 229", "CS 230", "CS 231A", "CS 234", "CS 238", "CS 325B", "CS 379C", "CS 470", "EDUC 218", "EE 104", "LINGUIST 180", "MUSIC 220C", "MUSIC 257", "NBIO 101", "OTOHNS 206", "PHIL 134A", "PHIL 356C", "PHIL 357", "PHIL 359", "PHIL 360", "PHIL 368A", "PSYC 125", "PSYCH 164", "PSYCH 204", "PSYCH 209", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 293", "STATS 220", "SYMSYS 202", "SYMSYS 205", "SYMSYS 207", "SYMSYS 208"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 205L", "CS 257", "ENGLISH 384B", "EE 374", "GLOBAL 124", "HUMBIO 4B", "HUMBIO 146", "HUMBIO 171E", "LAW 807S", "LINGUIST 154", "PHIL 134A", "PHIL 171", "PSYC 60N", "PSYC 135", "PSYC 265", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Cognitive Neuroscience"
        },
        {
          "type": "observe",
          "lut": "Inferential Statistics"
        },
        {
          "type": "observe",
          "lut": "Research Methods"
        },
        {
          "type": "observe",
          "lut": "Cog Sci Depth"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Cognitive Neuroscience", "Inferential Statistics", "Research Methods", "Cog Sci Depth", "Contingent Electives"]
    }
  ]
};
let degree$k = {
  "degree": "B.S. SymSys (Comp Found)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_ComputationalFoundations",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Computer Systems I": ["CS 107", "CS 107E"],
    "Computer Systems II": ["CS 110", "CS 111"],
    "Theory of Computation Depth": ["CS 154", "PHIL 152"],
    "Algorithms": ["CS 161"],
    "Integ concentration": ["CS 151", "CS 157", "CS 163", "CS 181", "CS 182", "CS 257", "CS 281", "CS 294S", "CS 349T", "CS 379C", "EE 374", "PHIL 154", "PHIL 359", "PSYCH 204", "PSYCH 220A"],
    "Contingent Electives": ["ANTHRO 100X", "BIOE 177", "BIOE 273", "COMM 153B", "CS 152", "GLOBAL 124", "INTLPOL 268", "LAW 807S", "OTOHNS 206", "PHIL 20N", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PUBLPOL 103F", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Computer Systems I"
        },
        {
          "type": "observe",
          "lut": "Computer Systems II"
        },
        {
          "type": "observe",
          "lut": "Theory of Computation Depth"
        },
        {
          "type": "observe",
          "lut": "Algorithms"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Computer Systems I", "Computer Systems II", "Theory of Computation Depth", "Algorithms", "Contingent Electives"]
    }
  ]
};
let degree$j = {
  "degree": "B.S. SymSys (Comp Soc Sci)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_ComputationalSocialScience",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Social Behavior": ["BIO 30", "BIO 81", "COMM 1", "ECON 1", "ECON 46", "ECON 50", "ECON 160", "ECON 178", "ECON 180", "EDUC 101", "LINGUIST 150", "MS&E 135", "MS&E 180", "MS&E 232", "OSPSANTG 46", "POLISCI 1", "POLISCI 101", "POLISCI 120C", "PSYCH 70", "PSYCH 154", "SOC 1", "SOC 126", "SOC 130", "SOC 146", "SOC 160"],
    "Statistical Inference": ["ECON 102A", "ECON 102B", "EDUC 400A", "MS&E 125", "MS&E 226", "SOC 180B", "STATS 110", "STATS 191", "STATS 200", "STATS 202"],
    "Computational Data Methods": ["CS 129", "CS 224N", "CS 224W", "CS 228", "CS 229", "CS 230", "CS 238", "CS 246", "CS 448B", "ECON 102B", "LINGUIST 180", "LINGUIST 188", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "STATS 216"],
    "Social Data Science": ["COMM 106", "COMM 206", "COMM 173E", "ENGR 150", "ECON 102D", "ECON 151", "POLISCI 151", "EDUC 143", "EDUC 423", "SOC 302", "MS&E 231", "SOC 278", "POLISCI 150A", "POLISCI 355A", "POLISCI 150C", "POLISCI 355C", "PSYCH 290", "SOC 281", "SYMSYS 195T", "SOC 180A", "CSRE 180A", "SOC 280A", "SOC 194", "SOC 369", "EDUC 316"],
    "Integ concentration": ["COMM 322", "COMM 326", "CS 124", "LINGUIST 180", "LINGUIST 280", "CS 152", "CS 181", "CS 182", "COMM 180", "ETHICSOC 182", "PHIL 82", "POLISCI 182", "PUBLPOL 182", "CS 184", "PUBLPOL 170", "CS 206", "COMM 281", "CS 224W", "CS 246", "CS 278", "CS 281", "CS 325B", "EARTHSYS 162", "EARTHSYS 262", "CS 384", "ECON 160", "ECON 178", "ECON 180", "MS&E 234", "PHIL 171", "ETHICSOC 171", "POLISCI 103", "POLISCI 336S", "PUBLPOL 103C", "PHIL 171P", "ETHICSOC 130", "POLISCI 130", "PHIL 359", "PSYCH 154", "PSYCH 262", "PSYCH 293", "PHIL 350", "SOC 154", "COMM 154", "COMM 254", "CSRE 154T", "SOC 254C", "SYMSYS 104", "ANTHRO 104D", "CSRE 104"],
    "Contingent Electives": ["ANTHRO 100X", "ANTHRO 116", "ANTHRO 132D", "BIO 61", "BIO 85", "BIO 103", "BIO 145", "BIOE 177", "BIOE 273", "COMM 106", "COMM 153B", "COMM 158", "COMM 173E", "COMM 176", "COMM 177B", "COMM 177P", "COMM 177T", "COMM 230A", "CS 102", "CS 145", "CS 205L", "CS 236", "CS 257", "ECON 47", "ECON 106", "ECON 118", "ECON 125", "ECON 144", "ECON 150", "ECON 155", "EDUC 260B", "EE 374", "ENGLISH 384B", "ENGR 145", "ENGR 148", "ESS 224", "GLOBAL 124", "INTLPOL 259", "INTLPOL 268D", "LAW 807S", "LINGUIST 154", "LINGUIST 156", "LINGUIST 157", "LINGUIST 234", "LINGUIST 250", "LINGUIST 258", "LINGUIST 285", "LINGUIST 278", "MGTECON 634", "MS&E 121", "MS&E 125", "MS&E 184", "MS&E 190", "MS&E 201", "MS&E 221", "MS&E 223", "MS&E 230", "MS&E 231", "MS&E 234", "MS&E 243", "MS&E 280", "MS&E 292", "OSPOXFRD 16", "OSPOXFRD 76", "OTOHNS 206", "PHIL 2", "PHIL 60", "PHIL 170", "PHIL 171", "PHIL 171P", "PHIL 174B", "PHIL 175B", "POLISCI 1", "POLISCI 120Z", "POLISCI 150A", "POLISCI 150C", "POLISCI 223A", "POLISCI 227C", "POLISCI 241A", "POLISCI 241S", "PSYC 60N", "PSYC 86Q", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 170", "PSYCH 265", "PSYCH 278", "PUBLPOL 103F", "SOC 1", "SOC 3", "SOC 10", "SOC 14N", "SOC 31N", "SOC 45Q", "SOC 114", "SOC 118", "SOC 124", "SOC 130", "SOC 133D", "SOC 167VP", "SOC 168", "SOC 179A", "STATS 101", "STATS 191", "STATS 200", "STATS 202", "STATS 203", "STATS 209", "STATS 211", "STS 191W", "SYMSYS 176S", "OSPGEN 47", "SYMSYS 201"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Social Behavior"
        },
        {
          "type": "observe",
          "lut": "Statistical Inference"
        },
        {
          "type": "observe",
          "lut": "Computational Data Methods"
        },
        {
          "type": "observe",
          "lut": "Social Data Science"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Social Behavior", "Statistical Inference", "Computational Data Methods", "Social Data Science", "Contingent Electives"]
    }
  ]
};
let degree$i = {
  "degree": "B.S. SymSys (Computer Music)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_ComputerMusic",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Computer-Generated Music I": ["MUSIC 220A"],
    "Computer-Generated Music II": ["MUSIC 220B"],
    "Music and the Mind & Brain": ["MUSIC 1A", "MUSIC 251", "MUSIC 351A", "MUSIC 351B", "PSYCH 30", "PSYCH 50"],
    "Music HCI/Design": ["CS 147", "MUSIC 128", "MUSIC 250A", "MUSIC 256A"],
    "Integ concentration": ["MUSIC 128", "MUSIC 220C", "MUSIC 250A", "MUSIC 251", "MUSIC 253", "MUSIC 254", "MUSIC 256A", "MUSIC 257", "MUSIC 351A", "MUSIC 356", "MUSIC 364"],
    "Contingent Electives": ["ANTHRO 100X", "BIOE 177", "BIOE 273", "CS 108", "CS 257", "COMM 153B", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "LAW 807S", "LINGUIST 105", "LINGUIST 110", "MUSIC 1A", "MUSIC 222", "OTOHNS 206", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 220A", "PUBLPOL 103F", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Computer-Generated Music I"
        },
        {
          "type": "observe",
          "lut": "Computer-Generated Music II"
        },
        {
          "type": "observe",
          "lut": "Music and the Mind & Brain"
        },
        {
          "type": "observe",
          "lut": "Music HCI/Design"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Computer-Generated Music I", "Computer-Generated Music II", "Music and the Mind & Brain", "Music HCI/Design", "Contingent Electives"]
    }
  ]
};
let degree$h = {
  "degree": "B.S. SymSys (Decision Making)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_DecisionMakingAndRationality",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Philosophical Inquiry": ["HUMBIO 171E", "ME 120", "MS&E 234", "MS&E 254", "MS&E 299", "PHIL 73", "PHIL 82", "PHIL 111", "PHIL 133S", "PHIL 164", "PHIL 166", "PHIL 169", "PHIL 170", "PHIL 171", "PHIL 172", "PHIL 176A", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 187", "PHIL 359", "PHIL 388", "POLISCI 131L", "POLISCI 230A", "PSYCH 160", "SYMSYS 202", "SYMSYS 205", "THINK 57"],
    "Formal Decision Theories": ["ECON 51", "ECON 136", "ECON 160", "ECON 180", "ECON 182", "ECON 289", "ECON 290", "IPS 204A", "MS&E 232", "MS&E 232H", "PHIL 154", "Phil 157", "PHIL 351", "PHIL 351C", "PHIL 351D", "PHIL 359", "POLISCI 356A", "PUBLPOL 51"],
    "Empirical Findings and Explanations": ["BIO 150", "COMM 137W", "ECON 178", "ECON 179", "ECON 279", "EDUC 375A", "GSBGEN 646", "LAW 333", "POLISCI 123", "POLISCI 351B", "POLISCI 351C", "PSYCH 154", "PSYCH 160", "PSYCH 168", "PSYCH 205", "PSYCH 212", "PSYCH 215", "PSYCH 223", "PSYCH 232", "PSYCH 254", "PUBLPOL 102", "SOC 114", "SOC 115", "SOC 126", "SOC 187", "SYMSYS 203"],
    "Methods and Applications": ["BIOE 177", "BIOMEDIN 219", "BIOMEDIN 251", "CEE 146A", "CEE 206", "COMM 106", "COMM 124", "CS 29N", "CS 181", "CS 182", "CS 228", "CS 234", "CS 238", "CS 239", "CS 261", "CS 325B", "ECON 50", "ECON 102B", "ECON 102C", "ECON 135", "ECON 136", "ECON 137", "ECON 141", "ECON 150", "ECON 155", "ECON 162", "ECON 181", "ECON 182", "ECON 288", "EDUC 247", "EE 374", "ENGR 62", "ESS 224", "INTLPOL 259", "IPS 207A", "MED 275B", "MS&E 121", "MS&E 135", "MS&E 152", "MS&E 175", "MS&E 180", "MS&E 189", "MS&E 226", "MS&E 230", "MS&E 231", "MS&E 239", "MS&E 245A", "MS&E 250A", "MS&E 250B", "MS&E 251", "MS&E 252", "MS&E 260", "MS&E 272", "MS&E 332", "MS&E 352", "MS&E 353", "MS&E 355", "PHIL 49", "PHIL 73", "POLISCI 153", "PSYCH 10", "PSYCH 152", "PSYCH 170", "PSYCH 251", "PSYCH 253", "PSYCH 265", "PSYCH 278", "STATS 191", "STATS 200", "STATS 202", "STATS 211", "STATS 217", "STATS 218", "STATS 263", "STATS 310A", "STATS 310B", "STATS 310C", "SYMSYS 195B", "SYMSYS 195D", "SYMSYS 201", "URBANST 132"],
    "Integ concentration": ["COMM 154", "CS 152", "CS 181", "CS 182", "CS 228", "CS 234", "CS 238", "CS 239", "CS 261", "CS 281", "CS 325B", "MS&E 231", "MS&E 239", "PHIL 184", "PHIL 184B", "PHIL 187", "PHIL 359", "PSYC 125", "PSYCH 154", "PSYCH 160", "PSYCH 220A", "PSYCH 223", "PSYCH 232", "PSYCH 254", "SYMSYS 104", "SYMSYS 201", "SYMSYS 203"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "COMM 230A", "CS 205L", "CS 257", "ECON 102D", "ECON 151", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "HUMBIO 4B", "HUMBIO 146", "LAW 807S", "MS&E 33N", "OTOHNS 206", "OSPOXFRD 76", "PHIL 134A", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Philosophical Inquiry"
        },
        {
          "type": "observe",
          "lut": "Formal Decision Theories"
        },
        {
          "type": "observe",
          "lut": "Empirical Findings and Explanations"
        },
        {
          "type": "observe",
          "lut": "Methods and Applications"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Philosophical Inquiry", "Formal Decision Theories", "Empirical Findings and Explanations", "Methods and Applications", "Contingent Electives"]
    }
  ]
};
let degree$g = {
  "degree": "B.S. SymSys (HCI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_HCI",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Introduction to HCI": ["CS 147"],
    "Design Methods": ["CS 194H", "CS 247A", "CS 247B", "CS 247G", "CS 247I", "CS 247S"],
    "HCI Theory": ["COMM 145", "COMM 166", "COMM 172", "CS 347", "ME 341"],
    "User Interface Implementation": ["CS 108", "CS 142"],
    "Integ concentration": ["COMM 120W", "COMM 145", "COMM 166", "COMM 172", "COMM 322", "COMM 324", "COMM 326", "COMM 372G", "CS 181", "CS 182", "CS 152", "CS 184", "CS 206", "CS 247I", "CS 278", "CS 347", "CS 377E", "CS 377G", "CS 377Q", "CS 377U", "CS 470", "EDUC 230", "EDUC 281", "EDUC 255A", "EDUC 302", "EDUC 342", "EDUC 391", "ME 115B", "ME 341", "MUSIC 256A", "SYMSYS 201", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "ANTHRO 155", "ARTSTUDI 130", "ARTSINST 142", "ARTSTUDI 160", "ARTSTUDI 168", "ARTSTUDI 169", "ARTSTUDI 179", "BIOE 177", "BIOE 273", "COMM 1", "COMM 1B", "COMM 106", "COMM 124", "COMM 153B", "COMM 154", "COMM 230A", "COMM 230B", "COMM 230C", "COMM 314", "CS 80Q", "CS 187", "CS 257", "EDUC 191", "EDUC 423", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 150", "ENGR 245", "GLOBAL 124", "HUMBIO 82A", "INTLPOL 259", "LAW 807S", "ME 101", "ME 105", "ME 115A", "ME 203", "ME 210", "ME 216A", "MED 147", "MED 275B", "MS&E 125", "MS&E 135", "MS&E 234", "MUSIC 257", "OTOHNS 206", "PHIL 71H", "PSYC 60N", "PSYC 135", "PSYCH 10", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 220A", "PSYCH 265", "PSYCH 278", "PUBLPOL 103F", "SOC 167VP", "STS 1", "STATS 101", "STATS 191", "STATS 200", "STATS 202", "STATS 203", "STATS 263", "SYMSYS 104", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Introduction to HCI"
        },
        {
          "type": "observe",
          "lut": "Design Methods"
        },
        {
          "type": "observe",
          "lut": "HCI Theory"
        },
        {
          "type": "observe",
          "lut": "User Interface Implementation"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Introduction to HCI", "Design Methods", "HCI Theory", "User Interface Implementation", "Contingent Electives"]
    }
  ]
};
let degree$f = {
  "degree": "B.S. SymSys (Human-Centered AI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_HumanCenteredAI",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Digital Technology Ethics and Policy": ["CS 181", "CS 182", "CS 281"],
    "Human Impact": ["AFRICAAM 200N", "ANTHRO 132D", "ANTHRO 134A", "BIOE 177", "COMM 120W", "COMM 124", "COMM 145", "COMM 154", "COMM 172", "COMM 184", "COMM 322", "COMPLIT 244", "CS 139", "CS 209", "CS 323", "CS 384", "DESIGN 283Q", "ENGLISH 106A", "GLOBAL 124", "INTLPOL 221", "LAW 4039", "LAW 4045", "LAW 4050", "MS&E 184", "MS&E 193", "MS&E 234", "NBIO 101", "OSPOXFRD 29", "PHIL 174B", "POLISCI 115", "PSYC 63Q", "PUBLPOL 134", "SOC 124", "STS 1", "SYMSYS 104", "SYMSYS 201"],
    "Augmenting Human Capabilities": ["BIOE 273", "BIOMEDIN 220", "COMM 166", "COMM 177B", "COMM 280", "COMM 326", "CEE 329", "CS 147", "CS 152", "CS 184", "CS 247A", "CS 247B", "CS 247I", "CS 247S", "CS 278", "CS 325B", "CS 335", "CS 372", "CS 448B", "CS 470", "ECON 136", "EDUC 211", "EDUC 236", "EDUC 266", "EDUC 281", "EDUC 302", "ENGLISH 108A", "ENGLISH 384B", "GSBGEN 596", "HUMBIO 135S", "HUMBIO 151R", "MUSIC 220C", "MUSIC 257", "LAW 808J", "OTOHNS 206", "PSYC 60N", "PSYC 124", "PSYC 135", "PSYC 223B", "PSYC 240", "PSYCH 12N", "PSYCH 24N", "PSYCH 273", "PSYCH 290", "SOC 167VP", "SYMSYS 245"],
    "Intelligence": ["CS 124", "CS 129", "CS 131", "CS 221", "CS 223A", "CS 224N", "CS 229", "CS 230", "CS 231N", "LINGUIST 188", "LINGUIST 285"],
    "Integ concentration": ["COMM 166", "COMM 172", "CS 184", "CS 206", "CS 221", "CS 223A", "CS 229", "CS 230", "CS 238", "CS 247I", "CS 278", "CS 281", "CS 325B", "CS 335", "CS 372", "CS 379C", "CS 384", "EDUC 234", "EDUC 266", "EDUC 281", "EDUC 342", "LINGUIST 180", "LINGUIST 285", "OTOHNS 206", "PHIL 167D", "PHIL 168M", "PHIL 359", "PHIL 360", "PHIL 368A", "PHIL 385B", "PHIL 386", "PSYC 124", "PSYC 223B", "PSYC 240", "PSYCH 121", "PSYCH 145", "PSYCH 154", "PSYCH 164", "PSYCH 162", "PSYCH 169", "PSYCH 202", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "PSYCH 232", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 254", "PSYCH 273", "PSYCH 278", "PSYCH 293", "STATS 216", "STATS 220", "STATS 315B", "SYMSYS 202", "SYMSYS 205", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "COMM 153B", "COMM 230A", "CS 110", "CS 193A", "CS 257", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "ESS 224", "HUMBIO 171E", "INTLPOL 259", "INTLPOL 268", "LAW 807S", "PHIL 20N", "PHIL 134A", "PSYCH 24N", "PSYCH 144", "PSYCH 265", "PUBLPOL 103F", "SOC 45Q", "STATS 191", "STATS 200", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Digital Technology Ethics and Policy"
        },
        {
          "type": "observe",
          "lut": "Human Impact"
        },
        {
          "type": "observe",
          "lut": "Augmenting Human Capabilities"
        },
        {
          "type": "observe",
          "lut": "Intelligence"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Digital Technology Ethics and Policy", "Human Impact", "Augmenting Human Capabilities", "Intelligence", "Contingent Electives"]
    }
  ]
};
let degree$e = {
  "degree": "B.S. SymSys (Learning)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_Learning",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Computational Learning": ["CS 205L", "CS 221", "CS 224N", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 234", "CS 236", "CS 325B", "EDUC 234", "EE 104", "EE 376A", "LINGUIST 180", "MS&E 234", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "PSYCH 249", "STATS 220", "STATS 315A", "STATS 315B", "STATS 101"],
    "Human Learning": ["CS 428A", "EDUC 101", "EDUC 115N", "EDUC 204", "EDUC 218", "EDUC 261E", "EDUC 266", "EDUC 307", "EDUC 368", "EDUC 378", "HUMBIO 4B", "LINGUIST 140", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 140", "PSYCH 141", "PSYCH 161", "PSYCH 169", "PSYCH 175", "PSYCH 202", "PSYCH 204", "PSYCH 209", "PSYCH 226", "PSYCH 249", "PSYCH 251", "PSYCH 265", "PSYCH 266"],
    "Learning Environment Design": ["ARTSTUDI 160", "COMM 166", "COMM 322", "CS 147", "CS 194H", "CS 398", "EDUC 234A", "EDUC 230", "EDUC 236", "EDUC 211", "EDUC 333A", "EDUC 342", "EDUC 298", "EDUC 303", "EDUC 391", "EDUC 281", "MUSIC 257", "EDUC 328", "EDUC 426", "MUSIC 257", "PSYCH 287", "SYMSYS 245"],
    "Integ concentration": ["COMM 326", "CS 181", "CS 182", "CS 198", "CS 221", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 234", "CS 379C", "CS 398", "EDUC 218", "EDUC 251", "EDUC 261E", "EDUC 266", "EE 104", "LINGUIST 180", "PHIL 184B", "PSYCH 182", "PSYCH 204", "PSYCH 209", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 262", "PSYCH 273", "PSYCH 293", "STATS 220", "SYMSYS 197", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 83", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 152", "CS 205L", "CS 257", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "GLOBAL 124", "HUMBIO 146", "HUMBIO 171E", "LAW 807S", "LINGUIST 154", "MUSIC 251", "OTOHNS 206", "PHIL 134A", "PSYC 60N", "PSYC 135", "PSYCH 10", "PSYCH 12N", "PSYCH 24N", "PSYCH 80", "PSYCH 118F", "PSYCH 144", "PSYCH 168", "PSYCH 278", "PUBLPOL 103F", "SOC 45Q", "STATS 191", "STATS 200", "SYMSYS 104", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Computational Learning"
        },
        {
          "type": "observe",
          "lut": "Human Learning"
        },
        {
          "type": "observe",
          "lut": "Learning Environment Design"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Computational Learning", "Human Learning", "Learning Environment Design", "Contingent Electives"]
    }
  ]
};
let degree$d = {
  "degree": "B.S. SymSys (Math)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_MathematicalFoundations",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Multivariate Calculus and Linear Algebra": ["MATH 52", "MATH 53", "MATH 63CM", "MATH 62CM", "MATH 62DM", "MATH 63DM"],
    "Matrix Theory and Applications": ["MATH 104", "MATH 113"],
    "Applied Mathematics and Statistics": ["CME 107", "CME 263", "CS 205L", "CS 229M", "EE 263", "EE 276", "MATH 108", "MATH 110", "MATH 136", "MATH 158", "MATH 159", "STATS 110", "MS&E 111", "MS&E 111X", "MS&E 121", "MS&E 201", "MS&E 213", "MS&E 221", "PSYCH 253", "STATS 191", "STATS 200", "STATS 202", "STATS 216", "STATS 217"],
    "Integ concentration": ["CS 129", "CS 151", "CS 154", "CS 157", "CS 161", "CS 163", "CS 205L", "CS 224W", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 254", "CS 255", "CS 259Q", "CS 246", "CS 325B", "CS 379C", "ECON 160", "ECON 178", "ECON 180", "EE 374", "MATH 114", "MS&E 252", "PHIL 151", "PHIL 152", "PHIL 154", "PHIL 155", "PHIL 162", "PHIL 184B", "PHIL 353", "PHIL 359", "PSYCH 154", "PSYCH 204", "PSYCH 204B", "PSYCH 209", "PSYCH 232", "PSYCH 242", "PSYCH 249", "PSYCH 253", "SOC 154", "STATS 220"],
    "Contingent Electives": ["ANTHRO 100X", "BIOE 177", "BIOE 273", "BIOMEDIN 219", "COMM 153B", "CS 250", "CS 254B", "CS 257", "CS 263", "EE 377", "GEOPHYS 128", "GLOBAL 124", "LAW 807S", "MATH 56", "MATH 83N", "MATH 107", "MATH 115", "MATH 120", "MATH 144", "MATH 152", "MATH 171", "OTOHNS 206", "PHIL 3N", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 220A", "PUBLPOL 103F", "STATS 203", "STATS 206", "STATS 218", "STATS 221", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Multivariate Calculus and Linear Algebra"
        },
        {
          "type": "observe",
          "lut": "Matrix Theory and Applications"
        },
        {
          "type": "observe",
          "lut": "Applied Mathematics and Statistics"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Multivariate Calculus and Linear Algebra", "Matrix Theory and Applications", "Applied Mathematics and Statistics", "Contingent Electives"]
    }
  ]
};
let degree$c = {
  "degree": "B.S. SymSys (Media & Comm)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_MediaAndCommunication",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Introduction": ["COMM 1"],
    "Statistical and Data Analysis Methods": ["ANTHRO 116", "COMM 173E", "CS 229", "MS&E 125", "MS&E 226", "PSYCH 253", "SOC 180B", "STATS 60", "STATS 110", "STATS 191", "STATS 101", "STATS 200", "STATS 202"],
    "Research Methods": ["COMM 106", "CSRE 433", "CS 142", "CS 147", "CS 347", "CS 448B", "EDUC 143", "EDUC 200B", "EDUC 211", "EDUC 236", "HUMBIO 82A", "MS&E 135", "MS&E 231", "MS&E 387", "ME 341", "PHIL 60", "POLISCI 150A", "POLISCI 150C", "PSYCH 170", "PSYCH 251", "SOC 10", "SOC 180A", "SOC 194", "SOC 369", "STATS 209", "STATS 211", "STS 191W"],
    "Effects, Ethics, and Policy": ["AFRICAAM 200N", "ANTHRO 132D", "ANTHRO 134A", "BIOE 177", "COMM 1B", "COMM 108", "COMM 120W", "COMM 124", "COMM 125", "COMM 135", "COMM 145", "COMM 153B", "COMM 154", "COMM 162", "COMM 164", "COMM 166", "COMM 172", "COMM 180", "COMM 184", "COMM 186W", "COMM 230A", "COMM 322", "CS 181", "CS 182", "CS 281", "CS 209", "ENGLISH 106A", "ECON 46", "ECON 47", "INTLPOL 221", "LAW 4039", "LAW 4045", "LAW 4050", "LINGUIST 156", "MS&E 135", "MS&E 184", "MS&E 234", "NBIO 101", "PHIL 174B", "POLISCI 223A", "POLISCI 227C", "PSYC 86Q", "PSYCH 103", "SOC 31N", "SOC 124", "SOC 126", "SOC 141P", "STS 1", "SYMSYS 201"],
    "Integ concentration": ["COMM 164", "COMM 166", "COMM 172", "COMM 176", "COMM 177B", "COMM 177P", "COMM 177T", "COMM 322", "COMM 324", "COMM 326", "COMM 372G", "CS 152", "CS 181", "CS 182", "CS 206", "CS 224W", "CS 278", "LINGUIST 134A", "LINGUIST 150", "OTOHNS 206", "PSYCH 278", "SOC 154", "SYMSYS 201"],
    "Contingent Electives": ["ANTHRO 100X", "ANTHRO 166A", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 257", "EDUC 260B", "EE 374", "ENGLISH 384B", "GLOBAL 124", "HUMBIO 82B", "INTLPOL 259", "LAW 807S", "LINGUIST 1", "LINGUIST 54N", "LINGUIST 127", "LINGUIST 154", "LINGUIST 234", "LINGUIST 258", "LINGUIST 285", "LINGUIST 278", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 80", "PSYCH 144", "PSYCH 155", "PSYCH 220A", "PSYCH 241", "PSYCH 265", "PUBLPOL 103F", "SOC 45Q", "STATS 202", "STATS 203", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Introduction"
        },
        {
          "type": "observe",
          "lut": "Statistical and Data Analysis Methods"
        },
        {
          "type": "observe",
          "lut": "Research Methods"
        },
        {
          "type": "observe",
          "lut": "Effects, Ethics, and Policy"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Introduction", "Statistical and Data Analysis Methods", "Research Methods", "Effects, Ethics, and Policy", "Contingent Electives"]
    }
  ]
};
let degree$b = {
  "degree": "B.S. SymSys (Natural Language)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_NaturalLanguage",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Mathematical/Computational Foundations": ["CS 154", "CS 221", "CS 229", "PHIL 154", "PSYCH 204", "PSYCH 209", "PSYCH 251"],
    "Computational Linguistics": ["CS 124", "CS 224N", "CS 224S", "CS 224U", "CS 276", "PSYCH 290"],
    "Phonetics/Phonology/Speech": ["LINGUIST 105", "LINGUIST 107", "LINGUIST 110", "LINGUIST 112", "LINGUIST 157", "LINGUIST 205B", "LINGUIST 207A", "LINGUIST 210A", "LINGUIST 213", "LINGUIST 260A"],
    "Morphosyntax": ["LINGUIST 121A", "LINGUIST 121B", "LINGUIST 217", "LINGUIST 222A", "LINGUIST 225D", "LINGUIST 260B"],
    "Semantics/Pragmatics/Philosophy of Language": ["LINGUIST 130A", "LINGUIST 130B", "LINGUIST 134A", "LINGUIST 230B", "LINGUIST 230C", "LINGUIST 232A", "LINGUIST 236", "LINGUIST 272B", "PHIL 137", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 194D", "PHIL 194K", "LINGUIST 230P", "PHIL 348", "PHIL 385D"],
    "Psycholinguistics": ["LINGUIST 140", "LINGUIST 245B", "LINGUIST 246", "LINGUIST 248", "PSYCH 131", "PSYCH 132", "PSYCH 140", "PSYCH 209"],
    "Sociolinguistics and Language Change": ["LINGUIST 47N", "LINGUIST 65", "LINGUIST 116A", "LINGUIST 134A", "LINGUIST 150", "LINGUIST 150E", "LINGUIST 152", "LINGUIST 154", "LINGUIST 155F", "LINGUIST 156", "LINGUIST 157", "LINGUIST 160", "LINGUIST 167", "LINGUIST 168", "LINGUIST 250", "LINGUIST 255K"],
    "Integ concentration": ["COMM 324", "CS 221", "CS 276", "CS 384", "LINGUIST 180", "PHIL 137", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 194D", "PHIL 194K", "PHIL 348", "PHIL 356C", "PHIL 357", "PHIL 359", "PHIL 385D", "PSYC 126", "PSYCH 204", "PSYCH 209", "PSYCH 247", "PSYCH 278", "SYMSYS 205", "SYMSYS 207"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 152", "CS 205L", "CS 257", "EE 374", "ENGLISH 384B", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "INTLPOL 259", "LAW 807S", "MUSIC 451A", "OTOHNS 206", "PSYC 60N", "PSYC 135", "PSYCH 10", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 220A", "PUBLPOL 103F", "SOC 45Q", "STATS 191", "STATS 200", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "type": "observe",
      "name": "Conc Core",
      "amount": 4,
      "lutList": ["Mathematical/Computational Foundations", "Computational Linguistics", "Phonetics/Phonology/Speech", "Morphosyntax", "Semantics/Pragmatics/Philosophy of Language", "Psycholinguistics", "Sociolinguistics and Language Change"]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Mathematical/Computational Foundations", "Computational Linguistics", "Phonetics/Phonology/Speech", "Morphosyntax", "Semantics/Pragmatics/Philosophy of Language", "Psycholinguistics", "Sociolinguistics and Language Change", "Contingent Electives"]
    }
  ]
};
let degree$a = {
  "degree": "B.S. SymSys (Neuroscience)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_Neuroscience",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Basic Neuroscience (1 required)": ["BIO 84", "BIO 150", "BIO 151", "BIO 153", "BIO 154", "HUMBIO 4A", "NBIO 206", "PSYCH 121"],
    "Systems Neuroscience (1 required)": ["BIO 158", "BIO 222", "EDUC 266", "EDUC 464", "MUSIC 451A", "PSYC 124", "PSYC 149", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 141", "PSYCH 154", "PSYCH 162", "PSYCH 169", "PSYCH 205", "PSYCH 224", "Psych 226", "PSYCH 232", "PSYCH 254", "PSYCH 266"],
    "Computational Approaches": ["BIOE 101", "BIOE 300B", "EE 124", "CS 223A", "CS 229", "CS 330", "CS 379C", "MATSCI 384", "MUSIC 257", "OTOHNS 206", "PSYCH 164", "PSYCH 204", "PSYCH 204A", "PSYCH 204B", "PSYCH 209", "PSYCH 249", "PSYCH 287", "STATS 220"],
    "Biological and Computational Approaches to Vision": ["CS 131", "CS 231A", "CS 231N", "EDUC 464", "PSYCH 30", "PSYCH 221", "PSYCH 224", "PSYCH 250", "PSYCH 263"],
    "Philosophical and Theoretical Approaches": ["HUMBIO 146", "HUMBIO 171E", "NBIO 101", "PHIL 134A", "PHIL 167D", "PHIL 168R", "PHIL 186", "PHIL 360", "PHIL 368A", "PSYC 125", "PSYCH 242", "SYMSYS 207", "SYMSYS 266"],
    "Methodological Foundations": ["BIOE 291", "CS 205A", "CS 205L", "CS 448B", "EE 102A", "EE 102B", "EE 261", "EE 263", "MATH 104", "MATH 113", "MS&E 211", "PSYCH 10", "PSYCH 187", "PSYCH 204A", "PSYCH 251", "PSYCH 253", "STATS 110", "STATS 141", "STATS 191", "STATS 200"],
    "Integ concentration": ["CS 131", "CS 221", "CS 228", "CS 229", "CS 230", "CS 231A", "CS 234", "CS 330", "CS 379C", "EDUC 266", "OTOHNS 206", "PHIL 167D", "PHIL 357", "PHIL 360", "PHIL 368A", "PSYCH 125", "PSYC 223B", "PSYCH 121", "PSYCH 162", "PSYCH 164", "PSYCH 169", "PSYCH 202", "PSYCH 204", "PSYCH 204A", "PSYCH 204B", "PSYCH 209", "PSYCH 220A", "PSYCH 232", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 254", "PSYCH 263", "STATS 220", "SYMSYS 202", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 83", "BIO 86", "BIOE 177", "BIOE 273", "COMM 153B", "CS 205L", "CS 257", "EE 374", "GLOBAL 124", "HUMBIO 4B", "LAW 807S", "ME 234", "PSYC 60N", "PSYC 63Q", "PSYC 83", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 90", "PSYCH 118F", "PSYCH 144", "PSYCH 168", "PSYCH 278", "PUBLPOL 103F", "SYMSYS 104"],
    "Recommended Add-ons": ["NSUR 239", "NSUR 249"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    //We don't check the fact that we need 1 from category 1 and 2
    {
      "type": "observe",
      "name": "Conc Core",
      "amount": 4,
      "lutList": ["Basic Neuroscience (1 required)", "Systems Neuroscience (1 required)", "Computational Approaches", "Biological and Computational Approaches to Vision", "Philosophical and Theoretical Approaches", "Methodological Foundations"]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Basic Neuroscience (1 required)", "Systems Neuroscience (1 required)", "Computational Approaches", "Biological and Computational Approaches to Vision", "Philosophical and Theoretical Approaches", "Methodological Foundations", "Contingent Electives"]
    }
  ]
};
let degree$9 = {
  "degree": "B.S. SymSys (Phil Foundations)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_PhilosophicalFoundations",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": "add",
        "method": "regex",
        "string": "^PHIL"
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^PHIL 99$"
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^THINK 69$"
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]*", "CS 177", "SYMSYS 196"],
    "Philosophy of Mind and Language": ["PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 183", "PHIL 183B", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 185", "PHIL 185W", "PHIL 186", "PHIL 187", "PHIL 188W", "PHIL 189G"],
    "Ethics, Historical, and Political Philosophy": ["PHIL 100", "PHIL 102", "PHIL 107B", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 194P"],
    "Logic": ["CS 154", "PHIL 152", "PHIL 154", "PHIL 350-series", "PHIL 359"],
    "Philosophy of Science": ["PHIL 20N", "PHIL 162", "PHIL 164", "PHIL 165", "PHIL 167D", "PHIL 168R", "PHIL 169", "PHIL 360", "SYMSYS 207"],
    "Integ concentration": ["CS 181", "CS 182", "CS 281", "CS 384", "NBIO 101", "PHIL 134A", "PHIL 162", "PHIL 167D", "PHIL 169", "PHIL 184B", "PHIL 194D", "PHIL 194T", "PHIL 194Y", "PHIL 350", "PHIL 359", "PHIL 360", "PHIL 368A", "PHIL 385B", "PSYC 125", "PSYCH 160", "SYMSYS 202", "SYMSYS 205", "SYMSYS 207"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 257", "EE 374", "GLOBAL 124", "HUMBIO 146", "HUMBIO 171E", "LAW 807S", "OTOHNS 206", "PHIL 134A", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 168", "PSYCH 220A", "PSYCH 278", "PUBLPOL 103F", "RELIGST 11N", "SOC 45Q", "SYMSYS 104"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1"
    },
    {
      "type": "and",
      "name": "Math, Multi",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
        {
          "lut": "Multivariate systems"
        }
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro"
        },
        {
          "lut": "WIM"
        },
        {
          "lut": "Advanced PHIL"
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1"
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp"
        },
        {
          "lut": "Probability"
        }
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II"
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1"
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A"
                },
                {
                  "lut": "Programming III 2B"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych"
        },
        {
          "lut": "Advanced psych"
        },
        {
          "lut": "Linguistic theory"
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area"
        },
        {
          "lut": "Small seminar"
        },
        {
          "lut": "Practicum"
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"]
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Philosophy of Mind and Language"
        },
        {
          "type": "observe",
          "lut": "Ethics, Historical, and Political Philosophy"
        },
        {
          "type": "observe",
          "lut": "Logic"
        },
        {
          "type": "observe",
          "lut": "Philosophy of Science"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Philosophy of Mind and Language", "Ethics, Historical, and Political Philosophy", "Logic", "Philosophy of Science", "Contingent Electives"]
    }
  ]
};
let degree$8 = {
  "degree": "M.S. Computer Science (AI)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_AI",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 221"],
    "Depth B": ["CS 223A", "CS 224N", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 228", "CS 229", "CS 231A", "CS 231N", "CS 234", "CS 237A", "CS 237B", "CS 238"],
    "Depth C": ["CS 205L", "CS 224R", "CS 225A", "CS 227B", "CS 229M", "CS 230", "CS 233", "CS 235", "CS 236", "CS 239", "CS 246", "CS 257", "CS 270", "CS 271", "CS 273A", "CS 273B", "CS 274", "CS 275", "CS 279", "CS 281", "CS 322", "CS 324", "CS 325B", "CS 326", "CS 327A", "CS 329[A-Z]*", "CS 330", "CS 331B", "CS 332", "CS 333", "CS 345", "CS 348N", "CS 361", "CS 368", "CS 371", "CS 375", "CS 377[A-Z]*", "CS 379[A-Z]*", "CS 398", "CS 399", "CS 428A", "CS 428B", "CS 432", "EE 263", "EE 276", "EE 278", "EE 364A", "EE 364B", "EE 377", "EE 378B", "ENGR 205", "ENGR 209A", "MS&E 226", "MS&E 252", "PSYCH 209", "STATS 202", "STATS 315A", "STATS 315B"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A"
        },
        {
          "lut": "Depth B",
          "amount": 4
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
};
let degree$7 = {
  "degree": "M.S. Computer Science (Biocomp)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Biocomp",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS [12]73A"],
    "Depth B": ["CS 221"],
    "Depth C": ["CS 142", "CS 147L", "CS 193X", "CS 145", "CS 246", "CS 448B"],
    "Depth D": ["CS 279", "CS 371", "BIOMEDIN 210", "BIOMEDIN 214", "BIOMEDIN 215", "BIOMEDIN 217", "BIOMEDIN 219", "BIOMEDIN 220", "BIOMEDIN 222", "BIOMEDIN 260", "CS 273B", "IMMUNOL 207"],
    "Depth E": ["CS 124", "CS 131", "CS 147", "CS 148", "CS 154", "CS 166", "CS 168", "CS 185", "CS 224N", "CS 224W", "CS 228", "CS 229", "CS 229B", "CS 229S", "CS 229T", "CS 230", "CS 231N", "CS 234", "CS 238", "CS 248/248A", "CS 353", "CS 399", "BIO 183", "BIO 187", "STATS 215", "STATS 256"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A"
        },
        {
          "lut": "Depth B"
        },
        {
          "lut": "Depth C",
          "amount": 2
        },
        {
          "lut": "Depth D",
          "amount": 3
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C", "Depth D", "Depth E"]
        }
      ]
    }
  ]
};
let degree$6 = {
  "degree": "M.S. Computer Science (HCI)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_HCI",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 147", "CS 247[A-Z]*", "CS 347", "CS 142", "CS 147L"],
    "Depth B": ["CS 278", "CS 448B"],
    "Depth C": ["CS 177", "CS 194H", "CS 206", "CS 210A", "CS 224C", "CS 247[A-Z]*", "CS 329X", "CS 377[A-Z]*"],
    "Depth D": ["ARTSTUD 130", "ARTSTUD 163", "ARTSTUD 165A", "ARTSTUD 169A", "ARTSTUD 231A", "COMM 224", "COMM 272", "COMM 324", "ME 115A", "ME 115C", "ME 216A", "COMM 254", "COMM 314", "EDUC 200B", "MS&E 125", "PSYCH 251", "PSYCH 252", "PSYCH 253", "STATS 203", "CS 498C", "EDUC 281", "EDUC 342", "EDUC 432", "MS&E 184", "MS&E 231", "MS&E 334", "ME 203", "ME 210", "ME 216A", "MUSIC 220A", "MUSIC 220B", "MUSIC 220C", "MUSIC 250A", "MUSIC 256A", "PSYCH 204", "PSYCH 209", "SYMSYS 245", "DESIGN 204", "DESIGN 292", "DESIGN 231", "DESIGN 236P", "DESIGN 240", "LAW 809E", "DESIGN 283Q", "DESIGN 262", "DESIGN 315", "DESIGN 259", "DESIGN 282", "DESIGN 276", "ME 206[AB]", "ENGR 231", "DESIGN 294", "DESIGN 268", "DESIGN 399", "DESIGN 368", "DESIGN 245", "DESIGN 265", "DESIGN 284", "DESIGN 287", "DESIGN 261", "DESIGN 187N", "DESIGN 255", "DESIGN 273", "DESIGN 251", "DESIGN 204"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A"
        },
        {
          "lut": "Depth B"
        },
        {
          "lutList": ["Depth B", "Depth C"],
          "amount": 2
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C", "Depth D"]
        }
      ]
    }
  ]
};
let degree$5 = {
  "degree": "M.S. Computer Science (Information)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Information",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 145"],
    "Depth B": ["CS 224N", "CS 224W", "CS 229", "CS 245", "CS 246", "CS 263", "CS 281"],
    "Depth C": ["CS 125", "CS 144", "CS 151", "CS 190", "CS 221", "CS 224S", "CS 224U", "CS 224V", "CS 228", "CS 229B", "CS 229M", "CS 229S", "CS 230", "CS 231A", "CS 231N", "CS 233", "CS 234", "CS 236", "CS 238", "CS 240", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 251", "CS 255", "CS 261", "CS 265", "CS 270", "CS 271", "CS 272", "CS [12]73A", "CS 273B", "CS 274", "CS 275", "CS 279", "CS 281", "CS 320", "CS 324", "CS 325B", "CS 329H", "CS 329S", "CS 329X", "CS 349D", "CS 349H", "CS 399", "MS&E 226", "STATS 315A", "STATS 315B"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A"
        },
        {
          "lut": "Depth B",
          "amount": 4
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
};
let degree$4 = {
  "degree": "M.S. Computer Science (Security)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Security",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 140", "CS 212", "CS 140E", "CS 112", "CS 144", "CS 155", "CS 255", "CS 356"],
    "Depth B": ["CS 142", "CS 152", "CS 190", "CS 240[A-Z]*", "CS 244", "CS 244B", "CS 249I", "CS 253", "CS 261", "CS 265", "CS 340[A-Z]*", "CS 355"],
    "Depth C": ["CS 245", "CS 251", "CS 294S", "CS 399", "EE 384S"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
          "amount": 5
        },
        {
          "lut": "Depth B",
          "amount": 3
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
};
let degree$3 = {
  "degree": "M.S. Computer Science (Software Theory)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_SoftwareTheory",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 242", "CS 243"],
    "Depth B": ["CS 221", "CS 244", "CS 245", "CS 341"],
    "Depth C": ["CS 255", "CS 350", "CS 355", "CS 356"],
    "Depth D": ["CS 151", "CS 250", "CS 261", "CS 265", "CS 294S", "CS 295", "CS 315B", "CS 349H", "CS 357", "CS 357S", "CS 399"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
          "amount": 2
        },
        {
          "lut": "Depth B"
        },
        {
          "lut": "Depth C"
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C", "Depth D"]
        }
      ]
    }
  ]
};
let degree$2 = {
  "degree": "M.S. Computer Science (Systems)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Systems",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 140", "CS 212", "CS 140E", "CS 112", "CS 112E", "CS 144", "CS 240"],
    "Depth B": ["CS 190", "CS 242", "CS 243", "CS 244", "CS 245", "CS 248", "CS 248A", "CS 348B", "EE 271", "EE 282"],
    "Depth C": ["CS 149", "CS 217", "CS 229S", "CS 241", "CS 244B", "CS 246", "CS 251", "CS 255", "CS 270", "CS 272", "CS 294S", "CS 295", "CS 315B", "CS 316", "CS 340[A-Z]*", "CS 343D", "CS 344[A-Z]*", "CS 348[A-Z]*", "CS 349[A-Z]*", "CS 356", "CS 357S", "CS 399", "CS 448[A-Z]*", "EE 267", "EE 273", "EE 382C", "EE 384A", "EE 384C", "EE 384S"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
          "amount": 3
        },
        {
          "lut": "Depth B",
          "amount": 4
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
};
let degree$1 = {
  "degree": "M.S. Computer Science (Theory)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Theory",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 154", "CS 261"],
    "Depth B": ["CS 151", "CS 163", "CS 166", "CS 168", "CS 228", "CS 229T", "CS 233", "CS 236", "CS 246", "CS 250", "CS 251", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 263", "CS 265", "CS 269I", "CS 328", "CS 331", "CS 351", "CS 354", "CS 355", "CS 358", "CS 359[A-Z]*", "CS 368", "CS 369[A-Z]*", "CS 399", "CS 468", "EE 364A", "MS&E 310", "MS&E 319"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
          "amount": 2
        },
        {
          "lutList": ["Depth A", "Depth B"]
        }
      ]
    }
  ]
};
let degree = {
  "degree": "M.S. Computer Science (Vis Comp)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_VisualComputing",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 248A", "CS 248B", "CS 231N"],
    "Depth B": ["CS 205L", "CS 223A", "CS 231A", "CS 233", "CS 348[BCEIKN]", "CS 448I"],
    "Depth C": ["CS 123", "CS 131", "CS 148", "CS 149", "CS 221", "CS 224N", "CS 224R", "CS 229", "CS 230", "CS 234", "CS 236", "CS 236G", "CS 331B", "CS 448B", "CS 448M", "CS 448Z", "EE 261"],
    "CS dept electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^CS"
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 111
      },
      {
        "type": "remove",
        "method": "regex",
        "string": "^(CS 19[38]|CS 390[A-C])$"
      }
    ],
    "All SoE": [
      {
        "type": "add",
        "method": "regex",
        "string": "^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) "
      },
      {
        "type": "remove",
        "method": "number",
        "comparator": "<=",
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
          "amount": 2
        },
        {
          "lutList": ["Depth A", "Depth B"],
          "amount": 3
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
};
function instance$2($$self, $$props, $$invalidate) {
  let $mastersDegreeChoices;
  let $bachelorsDegreeChoices;
  component_subscribe($$self, mastersDegreeChoices, ($$value) => $$invalidate(0, $mastersDegreeChoices = $$value));
  component_subscribe($$self, bachelorsDegreeChoices, ($$value) => $$invalidate(1, $bachelorsDegreeChoices = $$value));
  let ug_degrees = [
    degree$N,
    degree$M,
    degree$L,
    degree$K,
    degree$J,
    degree$I,
    degree$H,
    degree$G,
    degree$F,
    degree$E,
    degree$D,
    degree$C,
    degree$B,
    degree$A,
    degree$z,
    degree$y,
    degree$x,
    degree$w,
    degree$v,
    degree$u,
    degree$t,
    degree$s,
    degree$r,
    degree$q,
    degree$p,
    degree$o,
    degree$n,
    degree$m,
    degree$l,
    degree$k,
    degree$j,
    degree$i,
    degree$h,
    degree$g,
    degree$f,
    degree$e,
    degree$d,
    degree$c,
    degree$b,
    degree$a,
    degree$9
  ];
  let masters_degrees = [
    degree$N,
    degree$8,
    degree$7,
    degree$6,
    degree$5,
    degree$4,
    degree$3,
    degree$2,
    degree$1,
    degree
  ];
  onMount(async () => {
    set_store_value(bachelorsDegreeChoices, $bachelorsDegreeChoices = ug_degrees, $bachelorsDegreeChoices);
    set_store_value(mastersDegreeChoices, $mastersDegreeChoices = masters_degrees, $mastersDegreeChoices);
  });
  return [];
}
class LoadInAllDegrees extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, null, safe_not_equal, {});
  }
}
function checkRequirement(compiledDegree2, allCourses2, grid, originalList, list, transfer, requirement, isMs) {
  requirement = JSON.parse(JSON.stringify(requirement));
  let type = (requirement == null ? void 0 : requirement.type) || "consume";
  let name = (requirement == null ? void 0 : requirement.name) || (requirement == null ? void 0 : requirement.lut) || (requirement == null ? void 0 : requirement.id) || "unnamed requirement";
  let lut = requirement == null ? void 0 : requirement.lut;
  let lutList = requirement == null ? void 0 : requirement.lutList;
  let amount = (requirement == null ? void 0 : requirement.amount) ?? 1;
  let minUnits = (requirement == null ? void 0 : requirement.minUnits) || 0;
  let csnc = (requirement == null ? void 0 : requirement.csnc) || 0;
  let allowBS = (requirement == null ? void 0 : requirement.allowBS) ?? false;
  let content = requirement == null ? void 0 : requirement.content;
  let bundle = (requirement == null ? void 0 : requirement.bundle) || false;
  let bundleName = (requirement == null ? void 0 : requirement.bundleName) ?? name;
  let id = requirement == null ? void 0 : requirement.id;
  let cutoff = (requirement == null ? void 0 : requirement.cutoff) || 0;
  let modifiers = (requirement == null ? void 0 : requirement.modifiers) || [];
  let validKeys = ["type", "name", "lut", "lutList", "amount", "minUnits", "csnc", "content", "bundle", "bundleName", "id", "cutoff", "modifiers", "allowBS"];
  Object.keys(requirement).forEach((key) => {
    if (!validKeys.includes(key)) {
      console.log("Unrecognized key in requirement: " + key);
    }
  });
  list = JSON.parse(JSON.stringify(list));
  if (type === "consume" || type === "observe") {
    let coursesAllowed = [];
    if (lut) {
      coursesAllowed = compiledDegree2.lookuptables[lut];
    } else if (lutList) {
      lutList.forEach((lut2) => {
        coursesAllowed = [...coursesAllowed, ...compiledDegree2.lookuptables[lut2]];
      });
    }
    let coursesMatching = filterCourseObjsByLut(list, coursesAllowed);
    if (type === "observe") {
      coursesMatching = filterCourseObjsByLut(originalList, coursesAllowed);
      if (isMs && !allowBS) {
        coursesMatching = coursesMatching.filter((course) => {
          return course.ms;
        });
      }
    }
    let coursesExtracted = [];
    let amountStillNeeded = amount;
    coursesMatching = coursesMatching.filter((course) => {
      if (course.csnc && csnc > 0) {
        csnc--;
        return true;
      }
      return !course.csnc;
    });
    let coursesToDeBump = [];
    coursesMatching = coursesMatching.filter((course) => {
      if (course.bump > 0) {
        coursesToDeBump.push(course);
        return type === "observe";
      }
      return true;
    });
    coursesToDeBump.forEach((course) => {
      list.map((course2) => {
        if (course2.id === course.id) {
          course2.bump--;
        }
      });
    });
    let numUnits = 0;
    while ((amountStillNeeded > 0 || numUnits < minUnits) && coursesMatching.length > 0) {
      let course = coursesMatching[0];
      coursesMatching = coursesMatching.slice(1);
      coursesExtracted.push(course);
      amountStillNeeded--;
      numUnits += course.units_taking;
      if (modifiers.includes("countGradAsFour") && course.dept == "MATH" && course.number >= 200) {
        numUnits++;
      }
      if (type === "consume") {
        list = list.filter((course2) => {
          return course2.id !== course.id;
        });
      }
    }
    let fulfilled = amountStillNeeded <= 0 && numUnits >= minUnits;
    let cellValues = [name];
    if (bundleName != void 0) {
      cellValues[0] = bundleName;
    }
    coursesExtracted.forEach((course) => {
      cellValues.push(course.code);
    });
    while (cellValues.length < amount + 1) {
      cellValues.push("");
    }
    if (numUnits < minUnits && cellValues[cellValues.length - 1] !== "") {
      cellValues.push("");
    }
    let retVal = {
      fulfilled,
      cellValues,
      coursesExtracted,
      //These are course objects
      numUnits,
      list
    };
    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name,
        numNeeded: minUnits,
        numHas: numUnits
      };
    }
    return retVal;
  } else if (type === "and") {
    let requirementChecks = [];
    content.forEach((req) => {
      if (req === content[content.length - 1]) {
        let numUnitsAlreadyTaken = requirementChecks.map((check) => {
          return check.numUnits;
        }).reduce((a, b) => {
          return a + b;
        }, 0);
        req.minUnits = Math.max(minUnits - numUnitsAlreadyTaken, req.minUnits || 0);
      }
      requirementChecks.push(checkRequirement(compiledDegree2, allCourses2, grid, originalList, list, transfer, req, isMs));
      list = requirementChecks[requirementChecks.length - 1].list;
    });
    let numUnits = requirementChecks.map((check) => {
      return check.numUnits;
    }).reduce((a, b) => {
      return a + b;
    }, 0);
    let fulfilled = requirementChecks.every((check) => {
      return check.fulfilled;
    }) && numUnits >= minUnits;
    let cellValuesArray = [];
    requirementChecks.forEach((check) => {
      if (check.cellValues) {
        cellValuesArray.push(check.cellValues);
      } else {
        check.cellValuesArray.forEach((cellValues2) => {
          cellValuesArray.push(cellValues2);
        });
      }
    });
    let cellValues = [name];
    if (bundle) {
      cellValues[0] = bundleName;
      cellValuesArray.forEach((cellValuesElem) => {
        cellValuesElem = cellValuesElem.slice(1);
        cellValues = [...cellValues, ...cellValuesElem];
      });
    }
    let retVal = {
      fulfilled,
      cellValuesArray,
      coursesExtracted: requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat(),
      numUnits,
      list
    };
    if (bundle) {
      retVal.cellValues = cellValues;
      delete retVal.cellValuesArray;
    }
    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name,
        numNeeded: minUnits,
        numHas: numUnits
      };
    }
    return retVal;
  } else if (type === "or") {
    let requirementChecks = [];
    let fulfilled = false;
    let numUnits = 0;
    let coursesExtracted = [];
    if (!content) {
      content = lutList.map((lut2) => {
        return { lut: lut2 };
      });
    }
    let done = false;
    content.forEach((req) => {
      if (done)
        return;
      if (req === content[content.length - 1]) {
        let numUnitsAlreadyTaken = requirementChecks.map((check) => {
          return check.numUnits;
        }).reduce((a, b) => {
          return a + b;
        }, 0);
        req.minUnits = Math.max(minUnits - numUnitsAlreadyTaken, req.minUnits || 0);
      }
      requirementChecks.push(checkRequirement(compiledDegree2, allCourses2, grid, originalList, list, transfer, req, isMs));
      list = requirementChecks[requirementChecks.length - 1].list;
      fulfilled = requirementChecks.some((check) => {
        return check.fulfilled;
      });
      numUnits = requirementChecks.map((check) => {
        return check.numUnits;
      }).reduce((a, b) => {
        return a + b;
      }, 0);
      coursesExtracted = requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat();
      done = fulfilled && numUnits >= minUnits && (coursesExtracted.length >= amount || amount == 1);
    });
    fulfilled = requirementChecks.some((check) => {
      return check.fulfilled;
    }) && numUnits >= minUnits && coursesExtracted.length >= amount;
    if (done) {
      let coursesExtracted2 = requirementChecks.filter((check) => {
        return !check.fulfilled;
      }).map((check) => {
        return check.coursesExtracted;
      }).flat();
      list = list.concat(coursesExtracted2);
    }
    let cellValues = [name];
    if (bundleName != void 0) {
      cellValues[0] = bundleName;
    }
    requirementChecks.forEach((check) => {
      let cellValues2 = check.cellValues.slice(1);
      while (cellValues2[cellValues2.length - 1] === "") {
        cellValues2 = cellValues2.slice(0, cellValues2.length - 1);
      }
      cellValues = [...cellValues, ...cellValues2];
    });
    while (cellValues.length < amount + 1) {
      cellValues.push("");
    }
    if ((numUnits < minUnits || !fulfilled) && cellValues[cellValues.length - 1] !== "") {
      cellValues.push("");
    }
    let retVal = {
      fulfilled,
      cellValues,
      coursesExtracted: requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat(),
      numUnits,
      list
    };
    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name,
        numNeeded: minUnits,
        numHas: numUnits
      };
    }
    return retVal;
  } else if (type === "transfer") {
    let numUnits = getTransferUnits(transfer, id);
    if (numUnits >= cutoff) {
      return {
        fulfilled: true,
        cellValues: [name, id],
        coursesExtracted: ["TRANSFER COURSE"],
        numUnits,
        list
      };
    } else {
      return {
        fulfilled: false,
        cellValues: [name, ""],
        coursesExtracted: [],
        numUnits,
        list
      };
    }
  } else if (type === "transferUnits") {
    let numUnits = getTransferUnits(transfer, id);
    return {
      fulfilled: true,
      cellValues: [name, numUnits > 0 ? "Transfer" : ""],
      coursesExtracted: [],
      numUnits,
      list
    };
  } else {
    console.log("Invalid requirement type");
    throw "Invalid requirement type";
  }
}
function GeneralizedDegreeCheck(degree2, allCourses2, grid, list, transfer) {
  let listCopy = JSON.parse(JSON.stringify(list));
  listCopy = listCopy.filter((course) => {
    return !course.ms;
  });
  let listCopyOnlyMs = JSON.parse(JSON.stringify(list));
  listCopyOnlyMs = listCopyOnlyMs.filter((course) => {
    return course.ms;
  });
  let totalUnits = 0;
  if (degree2.level === "undergraduate") {
    totalUnits = calculateTotalUnits(listCopy, transfer, false);
  }
  if (degree2.level === "graduate") {
    totalUnits = calculateTotalUnits(listCopyOnlyMs, transfer, true);
  }
  let reqResults = [];
  degree2.requirements.forEach((req, i) => {
    try {
      if (degree2.level === "undergraduate") {
        reqResults = [...reqResults, checkRequirement(degree2, allCourses2, grid, list, listCopy, transfer, req, false)];
        listCopy = reqResults[i].list;
      } else if (degree2.level === "graduate") {
        reqResults = [...reqResults, checkRequirement(degree2, allCourses2, grid, list, listCopyOnlyMs, transfer, req, true)];
        listCopyOnlyMs = reqResults[i].list;
      }
    } catch (e) {
      console.log("Error in requirement: ");
      console.log(req);
      console.log(e);
    }
  });
  let unprocessedRows = [];
  reqResults.forEach((reqResult) => {
    if (reqResult == null ? void 0 : reqResult.numericFulfilled) {
      unprocessedRows.push([
        "PROGRESSBAR",
        reqResult.numericFulfilled.name,
        reqResult.numericFulfilled.numHas,
        reqResult.numericFulfilled.numNeeded
      ]);
    }
    if (reqResult == null ? void 0 : reqResult.cellValues) {
      let thingToPush = reqResult.cellValues;
      if (reqIsFulfilled(reqResult.cellValues)) {
        thingToPush = ["✔", ...thingToPush];
      } else {
        thingToPush = ["ㅤ", ...thingToPush];
      }
      unprocessedRows.push(thingToPush);
    } else if (reqResult == null ? void 0 : reqResult.cellValuesArray) {
      reqResult.cellValuesArray.forEach((cellValues) => {
        let thingToPush = cellValues;
        if (reqIsFulfilled(cellValues)) {
          thingToPush = ["✔", ...thingToPush];
        } else {
          thingToPush = ["ㅤ", ...thingToPush];
        }
        unprocessedRows.push(thingToPush);
      });
    }
  });
  let rows = [];
  rows.push({
    cells: [
      {
        value: degree2.degree,
        isTitle: true,
        noBorder: true
      }
    ]
  });
  if (degree2.level === "undergraduate") {
    rows.push({
      cells: [
        { value: totalUnits > 180 ? "✔" : "ㅤ", noBorder: true, weight: 0.25 },
        { value: "Total units", noBorder: true },
        { value: totalUnits + "/180", progress: totalUnits / 180, weight: 3 }
      ]
    });
  } else if (degree2.level === "graduate") {
    rows.push({
      cells: [
        { value: totalUnits > 45 ? "✔" : "ㅤ", noBorder: true, weight: 0.25 },
        { value: "Total units", noBorder: true },
        { value: totalUnits + "/45", progress: totalUnits / 45, weight: 3 }
      ]
    });
  }
  if (degree2.infoText) {
    rows.push({
      cells: [
        { value: degree2.infoText, noBorder: true, weight: 4 }
      ]
    });
  }
  unprocessedRows.forEach((row) => {
    if (row[0] === "PROGRESSBAR") {
      let cells = [];
      cells.push({ value: row[2] >= row[3] ? "✔" : "ㅤ", noBorder: true, weight: 0.25 });
      cells.push({ value: row[1], noBorder: true, weight: 1 });
      cells.push({ value: row[2] + "/" + row[3], progress: row[2] / row[3], weight: 3 });
      rows.push({ cells });
    } else if (row.length <= 6) {
      let cells = [];
      cells.push({ value: row[0], noBorder: true, weight: 0.25 });
      cells.push({ value: row[1], noBorder: true, weight: 1 });
      for (let i = 2; i < row.length; i++) {
        cells.push({ value: row[i], weight: 3 / (row.length - 2) });
      }
      rows.push({ cells });
    } else {
      let cells1 = [];
      let cells2 = [];
      cells1.push({ value: row[0], noBorder: true, weight: 0.25 });
      cells1.push({ value: row[1], noBorder: true, weight: 1 });
      cells2.push({ value: "ㅤ", noBorder: true, weight: 0.25 });
      cells2.push({ value: "ㅤ", noBorder: true, weight: 1 });
      let topCells = Math.ceil((row.length - 2) / 2);
      let bottomCells = row.length - 2 - topCells;
      for (let i = 0; i < topCells; i++) {
        cells1.push({ value: row[i + 2], weight: 3 / topCells });
      }
      for (let i = 0; i < bottomCells; i++) {
        cells2.push({ value: row[i + 2 + topCells], weight: 3 / bottomCells });
      }
      rows.push({ cells: cells1 });
      rows.push({ cells: cells2 });
    }
  });
  rows = { rows };
  return rows;
}
function reqIsFulfilled(cellValues) {
  let res = true;
  cellValues.forEach((cellValue) => {
    if (cellValue == "" || cellValue == "ㅤ" || cellValue == [""]) {
      res = false;
    }
  });
  return res;
}
function filterCourseObjsByLut(list, lut) {
  return list.filter((course) => {
    return lut.includes(course.code);
  });
}
function getTransferUnits(transfer, key) {
  var _a;
  let ret = (_a = transfer.filter((obj) => {
    return obj.name === key;
  })[0]) == null ? void 0 : _a.value;
  if (ret === void 0) {
    return 0;
  }
  return ret;
}
function calculateTotalUnits(courses, transfer, isMS) {
  let totalUnits = 0;
  courses.forEach((course) => {
    totalUnits += course.units_taking;
  });
  if (transfer && !isMS) {
    totalUnits += getTransferUnits(transfer, "Total");
  }
  return totalUnits;
}
function courseRegexMatch(allCourses2, regex) {
  if (Array.isArray(regex) && typeof regex[0] === "string") {
    regex = regex.map((str) => {
      if (str[0] === "^" || str[str.length - 1] === "$") {
        return str;
      }
      return "^" + str + "$";
    });
    let coursesMatchingARegex = [];
    regex.forEach((str) => {
      coursesMatchingARegex = [...coursesMatchingARegex, ...allCourses2.filter((course) => {
        return course.code.match(str);
      })];
    });
    coursesMatchingARegex = coursesMatchingARegex.map((course) => {
      return course.code;
    });
    return [...new Set(coursesMatchingARegex)];
  }
  let allMatchingCourses = [];
  for (let i = 0; i < regex.length; i++) {
    let thisRegexObject = regex[i];
    let thisMatchingCourses = [];
    if (thisRegexObject.method == "regex") {
      thisMatchingCourses = allCourses2.filter((course) => {
        return course.code.match(thisRegexObject.string);
      });
    } else if (thisRegexObject.method == "number") {
      let number = thisRegexObject.number;
      let comparator = thisRegexObject.comparator;
      thisMatchingCourses = allCourses2.filter((course) => {
        if (comparator == ">=") {
          return course.number >= number;
        } else if (comparator == "<=") {
          return course.number <= number;
        } else if (comparator == ">") {
          return course.number > number;
        } else if (comparator == "<") {
          return course.number < number;
        }
      });
    }
    if (thisRegexObject.type == "add") {
      allMatchingCourses = [...allMatchingCourses, ...thisMatchingCourses];
    } else if (thisRegexObject.type == "remove") {
      allMatchingCourses = allMatchingCourses.filter((course) => {
        return !thisMatchingCourses.includes(course);
      });
    }
  }
  return allMatchingCourses.map((course) => {
    return course.code;
  });
}
function compileDegree(degree2, allCourses2) {
  let compiledDegree2 = JSON.parse(JSON.stringify(degree2));
  Object.keys(degree2.lookuptables).forEach((key) => {
    compiledDegree2.lookuptables[key] = extendLutToCrosslisted(allCourses2, courseRegexMatch(allCourses2, degree2.lookuptables[key]));
  });
  return compiledDegree2;
}
function extendLutToCrosslisted(allCourses2, lut) {
  let newLut = [];
  lut.forEach((course) => {
    let foundCourse = allCourses2.filter((c) => {
      return c.code === course;
    })[0];
    newLut = newLut.concat(foundCourse.codes);
  });
  newLut = [...new Set(newLut)];
  return newLut;
}
const Main_svelte_svelte_type_style_lang = "";
function create_if_block_2(ctx) {
  let div1;
  let search;
  let t;
  let div0;
  let current;
  search = new Search({});
  return {
    c() {
      div1 = element("div");
      create_component(search.$$.fragment);
      t = space();
      div0 = element("div");
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      claim_component(search.$$.fragment, div1_nodes);
      t = claim_space(div1_nodes);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      children(div0).forEach(detach);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "scrollArea svelte-y5vvwt");
      attr(div1, "class", "searchContainer svelte-y5vvwt");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
      mount_component(search, div1, null);
      append_hydration(div1, t);
      append_hydration(div1, div0);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(search.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(search.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(search);
    }
  };
}
function create_else_block(ctx) {
  let panelcollapsecontainer;
  let current;
  panelcollapsecontainer = new PanelCollapseContainer({
    props: {
      panelId: "generalizedDegreeTracker",
      panelName: "Degree Check",
      content: GeneralizedDegreeTracker,
      props: {
        data: (
          /*degreeTrackerData*/
          ctx[5]
        ),
        showSlider: true
      }
    }
  });
  return {
    c() {
      create_component(panelcollapsecontainer.$$.fragment);
    },
    l(nodes) {
      claim_component(panelcollapsecontainer.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(panelcollapsecontainer, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const panelcollapsecontainer_changes = {};
      if (dirty & /*degreeTrackerData*/
      32)
        panelcollapsecontainer_changes.props = {
          data: (
            /*degreeTrackerData*/
            ctx2[5]
          ),
          showSlider: true
        };
      panelcollapsecontainer.$set(panelcollapsecontainer_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(panelcollapsecontainer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(panelcollapsecontainer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(panelcollapsecontainer, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "title");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$1(ctx) {
  let div;
  let panelcollapsecontainer;
  let current;
  panelcollapsecontainer = new PanelCollapseContainer({
    props: {
      panelId: "generalizedDegreeTracker",
      panelName: "M Degree Check",
      content: GeneralizedDegreeTracker,
      props: {
        data: (
          /*mastersDegreeTrackerData*/
          ctx[6]
        )
      }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(panelcollapsecontainer.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(panelcollapsecontainer.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "generalizedDegreeTrackerContainer svelte-y5vvwt");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(panelcollapsecontainer, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const panelcollapsecontainer_changes = {};
      if (dirty & /*mastersDegreeTrackerData*/
      64)
        panelcollapsecontainer_changes.props = {
          data: (
            /*mastersDegreeTrackerData*/
            ctx2[6]
          )
        };
      panelcollapsecontainer.$set(panelcollapsecontainer_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(panelcollapsecontainer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(panelcollapsecontainer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(panelcollapsecontainer);
    }
  };
}
function create_fragment$1(ctx) {
  let loadinalldegrees;
  let t0;
  let section;
  let t1;
  let div11;
  let div0;
  let t2;
  let div1;
  let trash;
  let t3;
  let div10;
  let onstartinfomodal;
  let t4;
  let div5;
  let div2;
  let panelcollapsecontainer0;
  let t5;
  let div3;
  let current_block_type_index;
  let if_block1;
  let t6;
  let t7;
  let div4;
  let panelcollapsecontainer1;
  let t8;
  let div6;
  let panelcollapsecontainer2;
  let t9;
  let div7;
  let grid;
  let t10;
  let footer;
  let textContent = `<p>Made by <a href="https://sambhavg.github.io" class="svelte-y5vvwt">Sambhav Gupta</a> with Svelte</p>`;
  let t14;
  let div8;
  let textContent_1 = `<a class="github-button" href="https://github.com/sambhavg/coursecorrect" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star sambhavg/coursecorrect on GitHub">Star</a>`;
  let t16;
  let xkcd;
  let t17;
  let div9;
  let current;
  loadinalldegrees = new LoadInAllDegrees({});
  let if_block0 = !/*$panelCollapsed*/
  ctx[3].search && create_if_block_2();
  trash = new Trash({});
  onstartinfomodal = new OnStartInfoModal({});
  panelcollapsecontainer0 = new PanelCollapseContainer({
    props: {
      panelId: "ways",
      panelName: "WAYS",
      content: WAYSTracker
    }
  });
  const if_block_creators = [create_if_block_1, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*$bachelorsDegreeChoices*/
      ctx2[1].length == 0
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block2 = (
    /*$mastersDegreeChoices*/
    ctx[0].length != 0 && /*$mastersDegreeChoice*/
    ctx[2] != "BLANK" && create_if_block$1(ctx)
  );
  panelcollapsecontainer1 = new PanelCollapseContainer({
    props: {
      panelId: "config",
      panelName: "Settings",
      content: ConfigPanel
    }
  });
  panelcollapsecontainer2 = new PanelCollapseContainer({
    props: {
      panelId: "courseData",
      panelName: "Course Data",
      content: CourseDataPanel
    }
  });
  grid = new Grid({});
  xkcd = new Xkcd({});
  return {
    c() {
      create_component(loadinalldegrees.$$.fragment);
      t0 = space();
      section = element("section");
      if (if_block0)
        if_block0.c();
      t1 = space();
      div11 = element("div");
      div0 = element("div");
      t2 = space();
      div1 = element("div");
      create_component(trash.$$.fragment);
      t3 = space();
      div10 = element("div");
      create_component(onstartinfomodal.$$.fragment);
      t4 = space();
      div5 = element("div");
      div2 = element("div");
      create_component(panelcollapsecontainer0.$$.fragment);
      t5 = space();
      div3 = element("div");
      if_block1.c();
      t6 = space();
      if (if_block2)
        if_block2.c();
      t7 = space();
      div4 = element("div");
      create_component(panelcollapsecontainer1.$$.fragment);
      t8 = space();
      div6 = element("div");
      create_component(panelcollapsecontainer2.$$.fragment);
      t9 = space();
      div7 = element("div");
      create_component(grid.$$.fragment);
      t10 = space();
      footer = element("footer");
      footer.innerHTML = textContent;
      t14 = space();
      div8 = element("div");
      div8.innerHTML = textContent_1;
      t16 = space();
      create_component(xkcd.$$.fragment);
      t17 = space();
      div9 = element("div");
      this.h();
    },
    l(nodes) {
      claim_component(loadinalldegrees.$$.fragment, nodes);
      t0 = claim_space(nodes);
      section = claim_element(nodes, "SECTION", { style: true, class: true });
      var section_nodes = children(section);
      if (if_block0)
        if_block0.l(section_nodes);
      t1 = claim_space(section_nodes);
      div11 = claim_element(section_nodes, "DIV", { class: true });
      var div11_nodes = children(div11);
      div0 = claim_element(div11_nodes, "DIV", { class: true });
      children(div0).forEach(detach);
      t2 = claim_space(div11_nodes);
      div1 = claim_element(div11_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      claim_component(trash.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach);
      t3 = claim_space(div11_nodes);
      div10 = claim_element(div11_nodes, "DIV", { class: true });
      var div10_nodes = children(div10);
      claim_component(onstartinfomodal.$$.fragment, div10_nodes);
      t4 = claim_space(div10_nodes);
      div5 = claim_element(div10_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div2 = claim_element(div5_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      claim_component(panelcollapsecontainer0.$$.fragment, div2_nodes);
      div2_nodes.forEach(detach);
      t5 = claim_space(div5_nodes);
      div3 = claim_element(div5_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      if_block1.l(div3_nodes);
      div3_nodes.forEach(detach);
      t6 = claim_space(div5_nodes);
      if (if_block2)
        if_block2.l(div5_nodes);
      t7 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      claim_component(panelcollapsecontainer1.$$.fragment, div4_nodes);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      t8 = claim_space(div10_nodes);
      div6 = claim_element(div10_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      claim_component(panelcollapsecontainer2.$$.fragment, div6_nodes);
      div6_nodes.forEach(detach);
      t9 = claim_space(div10_nodes);
      div7 = claim_element(div10_nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      claim_component(grid.$$.fragment, div7_nodes);
      div7_nodes.forEach(detach);
      t10 = claim_space(div10_nodes);
      footer = claim_element(div10_nodes, "FOOTER", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(footer) !== "svelte-mdbyqg")
        footer.innerHTML = textContent;
      t14 = claim_space(div10_nodes);
      div8 = claim_element(div10_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div8) !== "svelte-15mcdvu")
        div8.innerHTML = textContent_1;
      t16 = claim_space(div10_nodes);
      claim_component(xkcd.$$.fragment, div10_nodes);
      t17 = claim_space(div10_nodes);
      div9 = claim_element(div10_nodes, "DIV", { class: true });
      children(div9).forEach(detach);
      div10_nodes.forEach(detach);
      div11_nodes.forEach(detach);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "scrollArea svelte-y5vvwt");
      attr(div1, "class", "trashContainer svelte-y5vvwt");
      attr(div2, "class", "waysTrackerContainer svelte-y5vvwt");
      attr(div3, "class", "generalizedDegreeTrackerContainer svelte-y5vvwt");
      attr(div4, "class", "configPanelContainer svelte-y5vvwt");
      attr(div5, "class", "dataHeader svelte-y5vvwt");
      attr(div6, "class", "courseDataPanelContainer svelte-y5vvwt");
      attr(div7, "class", "gridContainer svelte-y5vvwt");
      attr(footer, "class", "svelte-y5vvwt");
      attr(div8, "class", "githubButton svelte-y5vvwt");
      attr(div9, "class", "giantSpace svelte-y5vvwt");
      attr(div10, "class", "gridAndInfoContainer svelte-y5vvwt");
      attr(div11, "class", "gridAndInfoAndScrollContainer svelte-y5vvwt");
      attr(
        section,
        "style",
        /*overallStyle*/
        ctx[4]
      );
      attr(section, "class", "svelte-y5vvwt");
    },
    m(target, anchor) {
      mount_component(loadinalldegrees, target, anchor);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, section, anchor);
      if (if_block0)
        if_block0.m(section, null);
      append_hydration(section, t1);
      append_hydration(section, div11);
      append_hydration(div11, div0);
      append_hydration(div11, t2);
      append_hydration(div11, div1);
      mount_component(trash, div1, null);
      append_hydration(div11, t3);
      append_hydration(div11, div10);
      mount_component(onstartinfomodal, div10, null);
      append_hydration(div10, t4);
      append_hydration(div10, div5);
      append_hydration(div5, div2);
      mount_component(panelcollapsecontainer0, div2, null);
      append_hydration(div5, t5);
      append_hydration(div5, div3);
      if_blocks[current_block_type_index].m(div3, null);
      append_hydration(div5, t6);
      if (if_block2)
        if_block2.m(div5, null);
      append_hydration(div5, t7);
      append_hydration(div5, div4);
      mount_component(panelcollapsecontainer1, div4, null);
      append_hydration(div10, t8);
      append_hydration(div10, div6);
      mount_component(panelcollapsecontainer2, div6, null);
      append_hydration(div10, t9);
      append_hydration(div10, div7);
      mount_component(grid, div7, null);
      append_hydration(div10, t10);
      append_hydration(div10, footer);
      append_hydration(div10, t14);
      append_hydration(div10, div8);
      append_hydration(div10, t16);
      mount_component(xkcd, div10, null);
      append_hydration(div10, t17);
      append_hydration(div10, div9);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!/*$panelCollapsed*/
      ctx2[3].search) {
        if (if_block0) {
          if (dirty & /*$panelCollapsed*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2();
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(section, t1);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div3, null);
      }
      if (
        /*$mastersDegreeChoices*/
        ctx2[0].length != 0 && /*$mastersDegreeChoice*/
        ctx2[2] != "BLANK"
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & /*$mastersDegreeChoices, $mastersDegreeChoice*/
          5) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$1(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div5, t7);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*overallStyle*/
      16) {
        attr(
          section,
          "style",
          /*overallStyle*/
          ctx2[4]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(loadinalldegrees.$$.fragment, local);
      transition_in(if_block0);
      transition_in(trash.$$.fragment, local);
      transition_in(onstartinfomodal.$$.fragment, local);
      transition_in(panelcollapsecontainer0.$$.fragment, local);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(panelcollapsecontainer1.$$.fragment, local);
      transition_in(panelcollapsecontainer2.$$.fragment, local);
      transition_in(grid.$$.fragment, local);
      transition_in(xkcd.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loadinalldegrees.$$.fragment, local);
      transition_out(if_block0);
      transition_out(trash.$$.fragment, local);
      transition_out(onstartinfomodal.$$.fragment, local);
      transition_out(panelcollapsecontainer0.$$.fragment, local);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(panelcollapsecontainer1.$$.fragment, local);
      transition_out(panelcollapsecontainer2.$$.fragment, local);
      transition_out(grid.$$.fragment, local);
      transition_out(xkcd.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(section);
      }
      destroy_component(loadinalldegrees, detaching);
      if (if_block0)
        if_block0.d();
      destroy_component(trash);
      destroy_component(onstartinfomodal);
      destroy_component(panelcollapsecontainer0);
      if_blocks[current_block_type_index].d();
      if (if_block2)
        if_block2.d();
      destroy_component(panelcollapsecontainer1);
      destroy_component(panelcollapsecontainer2);
      destroy_component(grid);
      destroy_component(xkcd);
    }
  };
}
let dumpLocalStorage = false;
function instance$1($$self, $$props, $$invalidate) {
  let $courseTable;
  let $allCourses;
  let $compressedTable;
  let $quarters;
  let $years;
  let $prefs;
  let $courseTableList;
  let $compiledMastersDegree;
  let $mastersDegreeChoices;
  let $compiledDegree;
  let $bachelorsDegreeChoices;
  let $mastersDegreeChoice;
  let $bachelorsDegreeChoice;
  let $searchFilters;
  let $courseDataSlider;
  let $panelCollapsed;
  let $showWelcomeModalOnLoad;
  let $reviewData;
  let $isDragging;
  component_subscribe($$self, courseTable, ($$value) => $$invalidate(8, $courseTable = $$value));
  component_subscribe($$self, allCourses, ($$value) => $$invalidate(9, $allCourses = $$value));
  component_subscribe($$self, compressedTable, ($$value) => $$invalidate(10, $compressedTable = $$value));
  component_subscribe($$self, quarters, ($$value) => $$invalidate(11, $quarters = $$value));
  component_subscribe($$self, years, ($$value) => $$invalidate(12, $years = $$value));
  component_subscribe($$self, prefs, ($$value) => $$invalidate(13, $prefs = $$value));
  component_subscribe($$self, courseTableList, ($$value) => $$invalidate(14, $courseTableList = $$value));
  component_subscribe($$self, compiledMastersDegree, ($$value) => $$invalidate(15, $compiledMastersDegree = $$value));
  component_subscribe($$self, mastersDegreeChoices, ($$value) => $$invalidate(0, $mastersDegreeChoices = $$value));
  component_subscribe($$self, compiledDegree, ($$value) => $$invalidate(16, $compiledDegree = $$value));
  component_subscribe($$self, bachelorsDegreeChoices, ($$value) => $$invalidate(1, $bachelorsDegreeChoices = $$value));
  component_subscribe($$self, mastersDegreeChoice, ($$value) => $$invalidate(2, $mastersDegreeChoice = $$value));
  component_subscribe($$self, bachelorsDegreeChoice, ($$value) => $$invalidate(17, $bachelorsDegreeChoice = $$value));
  component_subscribe($$self, searchFilters, ($$value) => $$invalidate(21, $searchFilters = $$value));
  component_subscribe($$self, courseDataSlider, ($$value) => $$invalidate(18, $courseDataSlider = $$value));
  component_subscribe($$self, panelCollapsed, ($$value) => $$invalidate(3, $panelCollapsed = $$value));
  component_subscribe($$self, showWelcomeModalOnLoad, ($$value) => $$invalidate(19, $showWelcomeModalOnLoad = $$value));
  component_subscribe($$self, reviewData, ($$value) => $$invalidate(22, $reviewData = $$value));
  component_subscribe($$self, isDragging$1, ($$value) => $$invalidate(20, $isDragging = $$value));
  let mounted = false;
  let overallStyle = "";
  onMount(async () => {
    try {
      const res = await fetch("./final_data_no_reviews.json");
      set_store_value(allCourses, $allCourses = await res.json(), $allCourses);
      $allCourses.sort((a, b) => {
        if (a.dept != b.dept) {
          return a.dept.localeCompare(b.dept);
        }
        if (a.number != b.number) {
          return a.number - b.number;
        }
        if (a.modifier != b.modifier) {
          return a.modifier.localeCompare(b.modifier);
        }
      });
    } catch (err) {
      console.log(err);
    }
    let reviewDataPromise = Promise.all([
      fetch("./reviews/reviews0000.json"),
      fetch("./reviews/reviews1000.json"),
      fetch("./reviews/reviews2000.json"),
      fetch("./reviews/reviews3000.json"),
      fetch("./reviews/reviews4000.json"),
      fetch("./reviews/reviews5000.json"),
      fetch("./reviews/reviews6000.json"),
      fetch("./reviews/reviews7000.json"),
      fetch("./reviews/reviews8000.json"),
      fetch("./reviews/reviews9000.json"),
      fetch("./reviews/reviews10000.json"),
      fetch("./reviews/reviews11000.json"),
      fetch("./reviews/reviews12000.json"),
      fetch("./reviews/reviews13000.json")
    ]).then((responses) => {
      return Promise.all(responses.map((response) => {
        return response.json();
      }));
    }).then((data) => {
      let allReviews = {};
      for (let i = 0; i < data.length; i++) {
        allReviews = { ...allReviews, ...data[i] };
      }
      return allReviews;
    }).catch((error) => {
      console.log(error);
    });
    reviewDataPromise.then((data) => {
      set_store_value(reviewData, $reviewData = data, $reviewData);
    });
    for (let i = 0; i < $allCourses.length; i++) {
      set_store_value(allCourses, $allCourses[i].id = i + "|" + Math.random().toString(36).substring(7), $allCourses);
      set_store_value(allCourses, $allCourses[i].ms = false, $allCourses);
      set_store_value(allCourses, $allCourses[i].csnc = false, $allCourses);
      set_store_value(allCourses, $allCourses[i].units_taking = $allCourses[i].max_units, $allCourses);
      set_store_value(allCourses, $allCourses[i].bump = 0, $allCourses);
    }
    const isBrowser = typeof window !== "undefined";
    let storedCompressedCourseTable = null;
    let storedPrefs = null;
    let storedShowWelcomeModalOnLoad = null;
    let storedPanelCollapsed = null;
    let storedBachelorsDegreeChoice = null;
    let storedMastersDegreeChoice = null;
    if (isBrowser && !dumpLocalStorage) {
      storedCompressedCourseTable = localStorage.getItem("compressedTable");
      storedPrefs = localStorage.getItem("prefs");
      storedShowWelcomeModalOnLoad = localStorage.getItem("showWelcomeModalOnLoad");
      storedPanelCollapsed = localStorage.getItem("panelCollapsed");
      storedBachelorsDegreeChoice = localStorage.getItem("bachelorsDegreeChoice");
      storedMastersDegreeChoice = localStorage.getItem("mastersDegreeChoice");
    }
    if (storedPrefs) {
      set_store_value(prefs, $prefs = JSON.parse(storedPrefs), $prefs);
    }
    if (storedShowWelcomeModalOnLoad) {
      set_store_value(showWelcomeModalOnLoad, $showWelcomeModalOnLoad = JSON.parse(storedShowWelcomeModalOnLoad), $showWelcomeModalOnLoad);
    } else {
      set_store_value(showWelcomeModalOnLoad, $showWelcomeModalOnLoad = true, $showWelcomeModalOnLoad);
    }
    if (storedPanelCollapsed) {
      set_store_value(panelCollapsed, $panelCollapsed = JSON.parse(storedPanelCollapsed), $panelCollapsed);
    }
    if (storedBachelorsDegreeChoice) {
      set_store_value(bachelorsDegreeChoice, $bachelorsDegreeChoice = JSON.parse(storedBachelorsDegreeChoice), $bachelorsDegreeChoice);
    }
    if (storedMastersDegreeChoice) {
      set_store_value(mastersDegreeChoice, $mastersDegreeChoice = JSON.parse(storedMastersDegreeChoice), $mastersDegreeChoice);
    }
    if (storedCompressedCourseTable && storedCompressedCourseTable !== "[]") {
      set_store_value(compressedTable, $compressedTable = JSON.parse(storedCompressedCourseTable), $compressedTable);
      decompressCourses();
      cleanCourseTable();
    } else {
      let coursesObj = [];
      for (let i = 0; i < $years.length; i++) {
        coursesObj.push({ id: $years[i], quarters: [] });
        for (let j = 0; j < $quarters.length; j++) {
          coursesObj[i].quarters.push({
            id: $years[i] + " " + $quarters[j],
            courses: []
          });
        }
      }
      set_store_value(courseTable, $courseTable = coursesObj, $courseTable);
      compressCourses();
    }
    fetch("https://api.counterapi.dev/v1/sambhavg.github.io/coursecorrect/up");
    set_store_value(courseDataSlider, $courseDataSlider = $years.length * $quarters.length - 1, $courseDataSlider);
    $$invalidate(7, mounted = true);
  });
  function setDegreeSpecificSearchFilters(compiledDegree2) {
    set_store_value(searchFilters, $searchFilters.degreeSpecific = { checkboxes: {}, luts: {} }, $searchFilters);
    if (compiledDegree2 == {}) {
      return;
    }
    Object.keys(compiledDegree2.lookuptables).forEach((key) => {
      set_store_value(searchFilters, $searchFilters.degreeSpecific.luts[key] = compiledDegree2.lookuptables[key], $searchFilters);
      set_store_value(searchFilters, $searchFilters.degreeSpecific.checkboxes[key] = false, $searchFilters);
    });
    searchFilters.set($searchFilters);
  }
  function setDegreeSpecificSearchFiltersMs(compiledDegree2) {
    set_store_value(searchFilters, $searchFilters.degreeSpecificMs = { checkboxes: {}, luts: {} }, $searchFilters);
    if (compiledDegree2 == {}) {
      return;
    }
    Object.keys(compiledDegree2.lookuptables).forEach((key) => {
      set_store_value(searchFilters, $searchFilters.degreeSpecificMs.luts[key] = compiledDegree2.lookuptables[key], $searchFilters);
      set_store_value(searchFilters, $searchFilters.degreeSpecificMs.checkboxes[key] = false, $searchFilters);
    });
    searchFilters.set($searchFilters);
  }
  function cleanCourseTable() {
    var _a;
    for (let i = 0; i < $courseTable.length; i++) {
      for (let j = 0; j < $courseTable[i].quarters.length; j++) {
        for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
          if (((_a = $courseTable[i].quarters[j].courses[k]) == null ? void 0 : _a.isDndShadowItem) != void 0) {
            delete $courseTable[i].quarters[j].courses[k].isDndShadowItem;
          }
        }
      }
    }
  }
  let degreeTrackerData;
  let mastersDegreeTrackerData;
  function compressCourses() {
    set_store_value(compressedTable, $compressedTable = [], $compressedTable);
    let coursesObj = [];
    for (let i = 0; i < $years.length; i++) {
      coursesObj.push({ id: $years[i], quarters: [] });
      for (let j = 0; j < $quarters.length; j++) {
        coursesObj[i].quarters.push({
          id: $years[i] + " " + $quarters[j],
          courses: []
        });
        for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
          let course = $courseTable[i].quarters[j].courses[k];
          let compressedCourse = {
            code: course.code,
            bump: course.bump,
            csnc: course.csnc,
            ms: course.ms,
            units_taking: course.units_taking
          };
          coursesObj[i].quarters[j].courses.push(compressedCourse);
        }
      }
    }
    set_store_value(compressedTable, $compressedTable = coursesObj, $compressedTable);
    const isBrowser = typeof window !== "undefined";
    if (isBrowser && mounted) {
      if ($compressedTable.length != 0) {
        localStorage.setItem("compressedTable", JSON.stringify($compressedTable));
      }
    }
  }
  function decompressCourses() {
    set_store_value(courseTable, $courseTable = [], $courseTable);
    let coursesObj = [];
    for (let i = 0; i < $years.length; i++) {
      coursesObj.push({ id: $years[i], quarters: [] });
      for (let j = 0; j < $quarters.length; j++) {
        coursesObj[i].quarters.push({
          id: $years[i] + " " + $quarters[j],
          courses: []
        });
        for (let k = 0; k < $compressedTable[i].quarters[j].courses.length; k++) {
          let course = $compressedTable[i].quarters[j].courses[k];
          let decompressedCourse = $allCourses.find((c) => c.code == course.code);
          decompressedCourse = JSON.parse(JSON.stringify(decompressedCourse));
          decompressedCourse.bump = course.bump;
          decompressedCourse.csnc = course.csnc;
          decompressedCourse.ms = course.ms;
          decompressedCourse.units_taking = course.units_taking;
          decompressedCourse.id = decompressedCourse.id.split("|")[0] + "|" + Math.random().toString(36).substring(7);
          coursesObj[i].quarters[j].courses.push(decompressedCourse);
        }
      }
    }
    set_store_value(courseTable, $courseTable = coursesObj, $courseTable);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$isDragging, $panelCollapsed, overallStyle*/
    1048600) {
      {
        if ($isDragging) {
          $$invalidate(4, overallStyle = "overflow: hidden;");
        } else {
          $$invalidate(4, overallStyle = "");
        }
        if ($panelCollapsed.search) {
          $$invalidate(4, overallStyle += "grid-template-columns: minmax(0, 1fr); width: 100%;");
        } else {
          $$invalidate(4, overallStyle += "grid-template-columns: minmax(0, 1fr) minmax(0, 3.1fr);");
        }
      }
    }
    if ($$self.$$.dirty & /*mounted, $compressedTable, $years, $quarters, $prefs, $showWelcomeModalOnLoad, $panelCollapsed, $bachelorsDegreeChoice, $mastersDegreeChoice*/
    670860) {
      {
        const isBrowser = typeof window !== "undefined";
        if (isBrowser && mounted) {
          if ($compressedTable.length != 0) {
            localStorage.setItem("compressedTable", JSON.stringify($compressedTable));
          }
          localStorage.setItem("years", JSON.stringify($years));
          localStorage.setItem("quarters", JSON.stringify($quarters));
          localStorage.setItem("prefs", JSON.stringify($prefs));
          localStorage.setItem("showWelcomeModalOnLoad", JSON.stringify($showWelcomeModalOnLoad));
          localStorage.setItem("panelCollapsed", JSON.stringify($panelCollapsed));
          localStorage.setItem("bachelorsDegreeChoice", JSON.stringify($bachelorsDegreeChoice));
          localStorage.setItem("mastersDegreeChoice", JSON.stringify($mastersDegreeChoice));
        }
      }
    }
    if ($$self.$$.dirty & /*$courseTable*/
    256) {
      {
        courseTable.set($courseTable);
        if ($courseTable.length != 0) {
          compressCourses();
        }
      }
    }
    if ($$self.$$.dirty & /*$courseTable, $quarters, $courseDataSlider*/
    264448) {
      {
        let courseTableListItems = [];
        for (let i = 0; i < $courseTable.length; i++) {
          for (let j = 0; j < $courseTable[i].quarters.length; j++) {
            for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
              if (i * $quarters.length + j > $courseDataSlider)
                break;
              courseTableListItems.push($courseTable[i].quarters[j].courses[k]);
            }
          }
        }
        set_store_value(courseTableList, $courseTableList = courseTableListItems, $courseTableList);
      }
    }
    if ($$self.$$.dirty & /*$bachelorsDegreeChoices, $bachelorsDegreeChoice, $allCourses, $compiledDegree*/
    197122) {
      {
        if ($bachelorsDegreeChoices.length !== 0) {
          let choiceFullDegree = $bachelorsDegreeChoices.find((degree2) => degree2.uniqueID == $bachelorsDegreeChoice);
          set_store_value(compiledDegree, $compiledDegree = compileDegree(choiceFullDegree, $allCourses), $compiledDegree);
          setDegreeSpecificSearchFilters($compiledDegree);
        }
      }
    }
    if ($$self.$$.dirty & /*$mastersDegreeChoices, $mastersDegreeChoice, $allCourses, $compiledMastersDegree*/
    33285) {
      {
        if ($mastersDegreeChoices.length !== 0) {
          let choiceFullDegree = $mastersDegreeChoices.find((degree2) => degree2.uniqueID == $mastersDegreeChoice);
          set_store_value(compiledMastersDegree, $compiledMastersDegree = compileDegree(choiceFullDegree, $allCourses), $compiledMastersDegree);
          setDegreeSpecificSearchFiltersMs($compiledMastersDegree);
        }
      }
    }
    if ($$self.$$.dirty & /*$bachelorsDegreeChoices, $compiledDegree, $allCourses, $courseTable, $courseTableList, $prefs, $mastersDegreeChoices, $compiledMastersDegree*/
    123651) {
      {
        if ($bachelorsDegreeChoices.length !== 0) {
          $$invalidate(5, degreeTrackerData = GeneralizedDegreeCheck($compiledDegree, $allCourses, $courseTable, $courseTableList, $prefs.transferUnits));
        }
        if ($mastersDegreeChoices.length !== 0) {
          $$invalidate(6, mastersDegreeTrackerData = GeneralizedDegreeCheck($compiledMastersDegree, $allCourses, $courseTable, $courseTableList, $prefs.transferUnits));
        }
      }
    }
  };
  return [
    $mastersDegreeChoices,
    $bachelorsDegreeChoices,
    $mastersDegreeChoice,
    $panelCollapsed,
    overallStyle,
    degreeTrackerData,
    mastersDegreeTrackerData,
    mounted,
    $courseTable,
    $allCourses,
    $compressedTable,
    $quarters,
    $years,
    $prefs,
    $courseTableList,
    $compiledMastersDegree,
    $compiledDegree,
    $bachelorsDegreeChoice,
    $courseDataSlider,
    $showWelcomeModalOnLoad,
    $isDragging
  ];
}
class Main extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
  }
}
const _page_svelte_svelte_type_style_lang = "";
function create_if_block(ctx) {
  let h1;
  let textContent = "CourseCorrect was made for 💻 🖥️ and may need a bigger screen to display properly! Please use\n			a bigger screen or zoom out.";
  let t1;
  let button;
  let textContent_1 = "Hide";
  let mounted;
  let dispose;
  return {
    c() {
      h1 = element("h1");
      h1.textContent = textContent;
      t1 = space();
      button = element("button");
      button.textContent = textContent_1;
      this.h();
    },
    l(nodes) {
      h1 = claim_element(nodes, "H1", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(h1) !== "svelte-hvhkit")
        h1.textContent = textContent;
      t1 = claim_space(nodes);
      button = claim_element(nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button) !== "svelte-s985lo")
        button.textContent = textContent_1;
      this.h();
    },
    h() {
      attr(h1, "class", "svelte-1r7s47q");
      attr(button, "class", "svelte-1r7s47q");
    },
    m(target, anchor) {
      insert_hydration(target, h1, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, button, anchor);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[2]
        );
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(h1);
        detach(t1);
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let meta;
  let t0;
  let section;
  let t1;
  let main;
  let current;
  let if_block = (
    /*width*/
    ctx[0] < 1200 && !/*hide*/
    ctx[1] && create_if_block(ctx)
  );
  main = new Main({});
  return {
    c() {
      meta = element("meta");
      t0 = space();
      section = element("section");
      if (if_block)
        if_block.c();
      t1 = space();
      create_component(main.$$.fragment);
      this.h();
    },
    l(nodes) {
      const head_nodes = head_selector("svelte-t32ptj", document.head);
      meta = claim_element(head_nodes, "META", { name: true, content: true });
      head_nodes.forEach(detach);
      t0 = claim_space(nodes);
      section = claim_element(nodes, "SECTION", { class: true });
      var section_nodes = children(section);
      if (if_block)
        if_block.l(section_nodes);
      t1 = claim_space(section_nodes);
      claim_component(main.$$.fragment, section_nodes);
      section_nodes.forEach(detach);
      this.h();
    },
    h() {
      document.title = "Home";
      attr(meta, "name", "description");
      attr(meta, "content", "Svelte demo app");
      attr(section, "class", "svelte-1r7s47q");
    },
    m(target, anchor) {
      append_hydration(document.head, meta);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, section, anchor);
      if (if_block)
        if_block.m(section, null);
      append_hydration(section, t1);
      mount_component(main, section, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*width*/
        ctx2[0] < 1200 && !/*hide*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          if_block.m(section, t1);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(main.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(main.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(section);
      }
      detach(meta);
      if (if_block)
        if_block.d();
      destroy_component(main);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let width = 1500;
  let hide = false;
  onMount(() => {
    $$invalidate(0, width = window.innerWidth);
    window.addEventListener("resize", () => {
      $$invalidate(0, width = window.innerWidth);
    });
  });
  const click_handler = () => $$invalidate(1, hide = true);
  return [width, hide, click_handler];
}
class Page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Page as component,
  _page as universal
};
