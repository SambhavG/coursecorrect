function g(){}const S=t=>t;function k(t,n){for(const e in n)t[e]=n[e];return t}function w(t){return t()}function A(){return Object.create(null)}function j(t){t.forEach(w)}function E(t){return typeof t=="function"}function B(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function C(t){return Object.keys(t).length===0}function v(t,...n){if(t==null){for(const o of n)o(void 0);return g}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function D(t,n,e){t.$$.on_destroy.push(v(n,e))}function F(t,n,e,o){if(t){const r=y(t,n,e,o);return t[0](r)}}function y(t,n,e,o){return t[1]&&o?k(e.ctx.slice(),t[1](o(n))):e.ctx}function P(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const a=[],f=Math.max(n.dirty.length,r.length);for(let u=0;u<f;u+=1)a[u]=n.dirty[u]|r[u];return a}return n.dirty|r}return n.dirty}function U(t,n,e,o,r,a){if(r){const f=y(n,e,o,a);t.p(f,r)}}function G(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}function H(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}function I(t,n){const e={};n=new Set(n);for(const o in t)!n.has(o)&&o[0]!=="$"&&(e[o]=t[o]);return e}function J(t){return t??""}function K(t,n,e){return t.set(e),n}function L(t){return t&&E(t.destroy)?t.destroy:g}let l;function _(t){l=t}function m(){if(!l)throw new Error("Function called outside component initialization");return l}function N(t){m().$$.on_mount.push(t)}function Q(t){m().$$.after_update.push(t)}const i=[],p=[];let s=[];const b=[],x=Promise.resolve();let h=!1;function O(){h||(h=!0,x.then(z))}function R(){return O(),x}function q(t){s.push(t)}const d=new Set;let c=0;function z(){if(c!==0)return;const t=l;do{try{for(;c<i.length;){const n=i[c];c++,_(n),M(n.$$)}}catch(n){throw i.length=0,c=0,n}for(_(null),i.length=0,c=0;p.length;)p.pop()();for(let n=0;n<s.length;n+=1){const e=s[n];d.has(e)||(d.add(e),e())}s.length=0}while(i.length);for(;b.length;)b.pop()();h=!1,d.clear(),_(t)}function M(t){if(t.fragment!==null){t.update(),j(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(q)}}function T(t){const n=[],e=[];s.forEach(o=>t.indexOf(o)===-1?n.push(o):e.push(o)),e.forEach(o=>o()),s=n}export{_ as A,w as B,i as C,O as D,Q as a,p as b,F as c,P as d,D as e,E as f,G as g,k as h,S as i,I as j,H as k,J as l,K as m,g as n,N as o,L as p,A as q,j as r,B as s,R as t,U as u,z as v,C as w,q as x,T as y,l as z};