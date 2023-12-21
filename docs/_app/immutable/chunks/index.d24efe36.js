var D=Object.defineProperty;var B=(e,t,n)=>t in e?D(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var $=(e,t,n)=>(B(e,typeof t!="symbol"?t+"":t,n),n);import{r as h,n as y,q as w,v as T,f as A,w as H,x as N,y as L,z as j,A as b,B as I,C as R,D as M}from"./scheduler.e294089e.js";let p=!1;function P(){p=!0}function q(){p=!1}function z(e,t,n,i){for(;e<t;){const r=e+(t-e>>1);n(r)<=i?e=r+1:t=r}return e}function O(e){if(e.hydrate_init)return;e.hydrate_init=!0;let t=e.childNodes;if(e.nodeName==="HEAD"){const s=[];for(let a=0;a<t.length;a++){const f=t[a];f.claim_order!==void 0&&s.push(f)}t=s}const n=new Int32Array(t.length+1),i=new Int32Array(t.length);n[0]=-1;let r=0;for(let s=0;s<t.length;s++){const a=t[s].claim_order,f=(r>0&&t[n[r]].claim_order<=a?r+1:z(1,r,d=>t[n[d]].claim_order,a))-1;i[s]=n[f]+1;const c=f+1;n[c]=s,r=Math.max(c,r)}const o=[],l=[];let u=t.length-1;for(let s=n[r]+1;s!=0;s=i[s-1]){for(o.push(t[s-1]);u>=s;u--)l.push(t[u]);u--}for(;u>=0;u--)l.push(t[u]);o.reverse(),l.sort((s,a)=>s.claim_order-a.claim_order);for(let s=0,a=0;s<l.length;s++){for(;a<o.length&&l[s].claim_order>=o[a].claim_order;)a++;const f=a<o.length?o[a]:null;e.insertBefore(l[s],f)}}function F(e,t){e.appendChild(t)}function G(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function se(e){const t=E("style");return t.textContent="/* empty */",J(G(e),t),t.sheet}function J(e,t){return F(e.head||e,t),t.sheet}function K(e,t){if(p){for(O(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;t!==e.actual_end_child?(t.claim_order!==void 0||t.parentNode!==e)&&e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling}else(t.parentNode!==e||t.nextSibling!==null)&&e.appendChild(t)}function ae(e,t,n){p&&!n?K(e,t):(t.parentNode!==e||t.nextSibling!=n)&&e.insertBefore(t,n||null)}function V(e){e.parentNode&&e.parentNode.removeChild(e)}function le(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function E(e){return document.createElement(e)}function W(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function g(e){return document.createTextNode(e)}function oe(){return g(" ")}function ue(){return g("")}function ce(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function Q(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function fe(e,t){for(const n in t)Q(e,n,t[n])}function _e(e){return e.dataset.svelteH}function de(e){return e===""?null:+e}function U(e){return Array.from(e.childNodes)}function X(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function S(e,t,n,i,r=!1){X(e);const o=(()=>{for(let l=e.claim_info.last_index;l<e.length;l++){const u=e[l];if(t(u)){const s=n(u);return s===void 0?e.splice(l,1):e[l]=s,r||(e.claim_info.last_index=l),u}}for(let l=e.claim_info.last_index-1;l>=0;l--){const u=e[l];if(t(u)){const s=n(u);return s===void 0?e.splice(l,1):e[l]=s,r?s===void 0&&e.claim_info.last_index--:e.claim_info.last_index=l,u}}return i()})();return o.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,o}function C(e,t,n,i){return S(e,r=>r.nodeName===t,r=>{const o=[];for(let l=0;l<r.attributes.length;l++){const u=r.attributes[l];n[u.name]||o.push(u.name)}o.forEach(l=>r.removeAttribute(l))},()=>i(t))}function me(e,t,n){return C(e,t,n,E)}function he(e,t,n){return C(e,t,n,W)}function Y(e,t){return S(e,n=>n.nodeType===3,n=>{const i=""+t;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>g(t),!0)}function pe(e){return Y(e," ")}function $e(e,t){t=""+t,e.data!==t&&(e.data=t)}function ye(e,t){e.value=t??""}function ge(e,t,n,i){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}function xe(e,t,n){for(let i=0;i<e.options.length;i+=1){const r=e.options[i];if(r.__value===t){r.selected=!0;return}}(!n||t!==void 0)&&(e.selectedIndex=-1)}function ve(e,t,n){e.classList.toggle(t,!!n)}function we(e,t){const n=[];let i=0;for(const r of t.childNodes)if(r.nodeType===8){const o=r.textContent.trim();o===`HEAD_${e}_END`?(i-=1,n.push(r)):o===`HEAD_${e}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function Ne(e,t){return new e(t)}const m=new Set;let _;function be(){_={r:0,c:[],p:_}}function Ae(){_.r||h(_.c),_=_.p}function Z(e,t){e&&e.i&&(m.delete(e),e.i(t))}function Ee(e,t,n,i){if(e&&e.o){if(m.has(e))return;m.add(e),_.c.push(()=>{m.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function Se(e){e&&e.c()}function Ce(e,t){e&&e.l(t)}function k(e,t,n){const{fragment:i,after_update:r}=e.$$;i&&i.m(t,n),N(()=>{const o=e.$$.on_mount.map(I).filter(A);e.$$.on_destroy?e.$$.on_destroy.push(...o):h(o),e.$$.on_mount=[]}),r.forEach(N)}function ee(e,t){const n=e.$$;n.fragment!==null&&(L(n.after_update),h(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function te(e,t){e.$$.dirty[0]===-1&&(R.push(e),M(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function De(e,t,n,i,r,o,l,u=[-1]){const s=j;b(e);const a=e.$$={fragment:null,ctx:[],props:o,update:y,not_equal:r,bound:w(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(s?s.$$.context:[])),callbacks:w(),dirty:u,skip_bound:!1,root:t.target||s.$$.root};l&&l(a.root);let f=!1;if(a.ctx=n?n(e,t.props||{},(c,d,...x)=>{const v=x.length?x[0]:d;return a.ctx&&r(a.ctx[c],a.ctx[c]=v)&&(!a.skip_bound&&a.bound[c]&&a.bound[c](v),f&&te(e,c)),d}):[],a.update(),f=!0,h(a.before_update),a.fragment=i?i(a.ctx):!1,t.target){if(t.hydrate){P();const c=U(t.target);a.fragment&&a.fragment.l(c),c.forEach(V)}else a.fragment&&a.fragment.c();t.intro&&Z(e.$$.fragment),k(e,t.target,t.anchor),q(),T()}b(s)}class Be{constructor(){$(this,"$$");$(this,"$$set")}$destroy(){ee(this,1),this.$destroy=y}$on(t,n){if(!A(n))return y;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!H(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ne="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ne);export{W as A,he as B,fe as C,le as D,ce as E,_e as F,ye as G,de as H,xe as I,ve as J,we as K,Be as S,ae as a,Ae as b,pe as c,Z as d,ue as e,V as f,E as g,me as h,De as i,U as j,Q as k,ge as l,g as m,Y as n,$e as o,be as p,Ne as q,Se as r,oe as s,Ee as t,Ce as u,k as v,ee as w,K as x,G as y,se as z};
