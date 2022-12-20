import{S as w,i as x,s as K,e as v,c as n,a as i,b as T,h as t,n as q,d as C,w as X}from"./index.eedbf297.js";function O(d,l,o){const r=d.slice();return r[1]=l[o],r}function S(d){let l;return{c(){l=v("div"),i(l,"class","color-square svelte-1a0p6at"),i(l,"style",`background: oklch(${d[1].lightness} ${d[1].chroma} ${d[1].hue});`)},m(o,r){T(o,l,r)},p:q,d(o){o&&C(l)}}}function Y(d){let l,o,r,s,b,y,k,$,f,_,h,m,H,L,p,u=d[0],c=[];for(let a=0;a<u.length;a+=1)c[a]=S(O(d,u,a));return{c(){l=v("article"),o=v("aside"),o.innerHTML="<h2>Settings</h2>",r=n(),s=v("section"),b=v("div"),b.innerHTML=`<h2>Colors OKLCH</h2> 
      <h6>Only works in Safari as of 11/27/22</h6>`,y=n(),k=v("div");for(let a=0;a<c.length;a+=1)c[a].c();$=n(),f=v("br"),_=n(),h=v("div"),h.innerHTML=`<div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 30);"></div> 
      
      <div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 82);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 82);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 82);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 82);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 82);"></div> 
      
      <div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 160);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 160);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 160);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 160);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 160);"></div> 
      
      <div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 230);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 230);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 230);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 230);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 230);"></div> 
      
      <div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 290);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 290);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 290);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 290);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 290);"></div> 

      <div class="color-square svelte-1a0p6at" style="background: oklch(15% 0.10 350);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(30% 0.20 350);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(60% 0.30 350);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(75% 0.23 350);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: oklch(85% 0.10 350);"></div>`,m=n(),H=v("br"),L=n(),p=v("div"),p.innerHTML=`<div class="color-square svelte-1a0p6at" style="background: lch(25% 50 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(50% 90 30);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(75% 50 30);"></div> 

      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 70);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 70);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 70);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(50% 90 70);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(75% 50 70);"></div> 
      
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 120);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 120);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 120);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(50% 90 120);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(75% 50 120);"></div> 

      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 300);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 300);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(25% 50 300);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(50% 90 300);"></div> 
      <div class="color-square svelte-1a0p6at" style="background: lch(75% 50 300);"></div>`,i(o,"class","svelte-1a0p6at"),i(k,"class","color-squares svelte-1a0p6at"),i(h,"class","color-squares svelte-1a0p6at"),i(p,"class","color-squares svelte-1a0p6at"),i(s,"class","svelte-1a0p6at"),i(l,"class","svelte-1a0p6at")},m(a,g){T(a,l,g),t(l,o),t(l,r),t(l,s),t(s,b),t(s,y),t(s,k);for(let e=0;e<c.length;e+=1)c[e].m(k,null);t(s,$),t(s,f),t(s,_),t(s,h),t(s,m),t(s,H),t(s,L),t(s,p)},p(a,[g]){if(g&1){u=a[0];let e;for(e=0;e<u.length;e+=1){const M=O(a,u,e);c[e]?c[e].p(M,g):(c[e]=S(M),c[e].c(),c[e].m(k,null))}for(;e<c.length;e+=1)c[e].d(1);c.length=u.length}},i:q,o:q,d(a){a&&C(l),X(c,a)}}}let j=3,z=1;function A(d){let l=[];for(let o=0;o<z;o++)for(let r=0;r<j;r++){let s={lightness:25*r+"%",chroma:"0.3",hue:"290"};l.push(s)}return[l]}class D extends w{constructor(l){super(),x(this,l,A,Y,K,{})}}export{D as default};
