import{S as cl,i as fl,s as pl,C as ll,b as H,q as k,r as ve,u as $,w as _e,d as j,D as Rl,E as _l,F as ml,G as Ll,e as u,g as d,a as c,k as a,o as E,H as Tl,J as Kl,K as Ul,A as ol,t as y,p as ee,I as pe,h as ie,m as re,n as Wl,y as oe,L as Xl,v as P,f as Me,j as xe,l as Ne,z as tl,B as Yl,M as Ql,N as Le}from"./index.6af32dc5.js";function hl(s){let l,t,e,n,o,i,f,r=s[1]&&bl(s);const p=s[10].default,w=Ll(p,s,s[9],null);return{c(){l=u("dialog"),t=u("main"),r&&r.c(),e=d(),w&&w.c(),c(t,"style",n=s[8].style),c(t,"class","svelte-lhl7oj"),c(l,"class","svelte-lhl7oj")},m(S,h){H(S,l,h),a(l,t),r&&r.m(t,null),a(t,e),w&&w.m(t,null),s[12](t),o=!0,i||(f=[E(l,"mousedown",s[13]),E(l,"mouseup",s[6]),E(l,"mouseleave",s[6]),E(l,"mousemove",s[7])],i=!0)},p(S,h){S[1]?r?(r.p(S,h),h&2&&k(r,1)):(r=bl(S),r.c(),k(r,1),r.m(t,e)):r&&(ve(),$(r,1,1,()=>{r=null}),_e()),w&&w.p&&(!o||h&512)&&Tl(w,p,S,S[9],o?Ul(p,S[9],h,null):Kl(S[9]),null),(!o||h&256&&n!==(n=S[8].style))&&c(t,"style",n)},i(S){o||(k(r),k(w,S),o=!0)},o(S){$(r),$(w,S),o=!1},d(S){S&&j(l),r&&r.d(),w&&w.d(S),s[12](null),i=!1,ol(f)}}}function bl(s){let l,t,e,n,o,i,f,r=s[2]&&gl(s);return{c(){l=u("h2"),t=y(s[1]),e=d(),r&&r.c(),n=ll(),c(l,"class","svelte-lhl7oj")},m(p,w){H(p,l,w),a(l,t),H(p,e,w),r&&r.m(p,w),H(p,n,w),o=!0,i||(f=E(l,"mousedown",s[5]),i=!0)},p(p,w){(!o||w&2)&&ee(t,p[1]),p[2]?r?(r.p(p,w),w&4&&k(r,1)):(r=gl(p),r.c(),k(r,1),r.m(n.parentNode,n)):r&&(ve(),$(r,1,1,()=>{r=null}),_e())},i(p){o||(k(r),o=!0)},o(p){$(r),o=!1},d(p){p&&j(l),p&&j(e),r&&r.d(p),p&&j(n),i=!1,f()}}}function gl(s){let l,t,e,n,o;return t=new pe({props:{name:"xmark"}}),{c(){l=u("button"),ie(t.$$.fragment),c(l,"class","dialogExit svelte-lhl7oj")},m(i,f){H(i,l,f),re(t,l,null),e=!0,n||(o=E(l,"click",s[11]),n=!0)},p:Wl,i(i){e||(k(t.$$.fragment,i),e=!0)},o(i){$(t.$$.fragment,i),e=!1},d(i){i&&j(l),oe(t),n=!1,o()}}}function Zl(s){let l,t,e=s[0]&&hl(s);return{c(){e&&e.c(),l=ll()},m(n,o){e&&e.m(n,o),H(n,l,o),t=!0},p(n,[o]){n[0]?e?(e.p(n,o),o&1&&k(e,1)):(e=hl(n),e.c(),k(e,1),e.m(l.parentNode,l)):e&&(ve(),$(e,1,1,()=>{e=null}),_e())},i(n){t||(k(e),t=!0)},o(n){$(e),t=!1},d(n){e&&e.d(n),n&&j(l)}}}function et(s,l,t){let{$$slots:e={},$$scope:n}=l;const o=Rl();let{show:i=!0}=l,{title:f}=l,{closeIcon:r=!0}=l,p,w,S,h={x:0,y:0},b;function g(x){p=!0,w={x:x.clientX,y:x.clientY};let U=b.style.transform;U===""&&(U="0, 0"),U=U.replace("translate(","").replace("px","").replace("px","").replace(")","").split(","),h={x:Number(U[0]),y:Number(U[1])}}function A(){p=!1}function m(x){x.preventDefault(),p&&(S={x:x.clientX-w.x+h.x,y:x.clientY-w.y+h.y},t(3,b.style.transform=`translate(${S.x}px, ${S.y}px)`,b))}const I=()=>o("close");function v(x){Xl[x?"unshift":"push"](()=>{b=x,t(3,b)})}const N=()=>{event.target.localName==="dialog"&&o("close")};return s.$$set=x=>{t(8,l=_l(_l({},l),ml(x))),"show"in x&&t(0,i=x.show),"title"in x&&t(1,f=x.title),"closeIcon"in x&&t(2,r=x.closeIcon),"$$scope"in x&&t(9,n=x.$$scope)},l=ml(l),[i,f,r,b,o,g,A,m,l,n,e,I,v,N]}class lt extends cl{constructor(l){super(),fl(this,l,et,Zl,pl,{show:0,title:1,closeIcon:2})}}function kl(s){let l,t,e,n,o=P(s[0].value.ip,!0)+"",i,f;return t=new pe({props:{name:"circle-exclamation"}}),{c(){l=u("div"),ie(t.$$.fragment),e=d(),n=u("small"),i=y(o),c(l,"class","flex error-message")},m(r,p){H(r,l,p),re(t,l,null),a(l,e),a(l,n),a(n,i),f=!0},p(r,p){(!f||p&1)&&o!==(o=P(r[0].value.ip,!0)+"")&&ee(i,o)},i(r){f||(k(t.$$.fragment,r),f=!0)},o(r){$(t.$$.fragment,r),f=!1},d(r){r&&j(l),oe(t)}}}function wl(s){let l,t,e,n,o=Me(s[0].value.mask,!0)+"",i,f;return t=new pe({props:{name:"circle-exclamation"}}),{c(){l=u("div"),ie(t.$$.fragment),e=d(),n=u("small"),i=y(o),c(l,"class","flex error-message")},m(r,p){H(r,l,p),re(t,l,null),a(l,e),a(l,n),a(n,i),f=!0},p(r,p){(!f||p&1)&&o!==(o=Me(r[0].value.mask,!0)+"")&&ee(i,o)},i(r){f||(k(t.$$.fragment,r),f=!0)},o(r){$(t.$$.fragment,r),f=!1},d(r){r&&j(l),oe(t)}}}function Sl(s){let l,t,e,n,o=P(s[0].value.gateway,!0)+"",i,f;return t=new pe({props:{name:"circle-exclamation"}}),{c(){l=u("div"),ie(t.$$.fragment),e=d(),n=u("small"),i=y(o),c(l,"class","flex error-message")},m(r,p){H(r,l,p),re(t,l,null),a(l,e),a(l,n),a(n,i),f=!0},p(r,p){(!f||p&1)&&o!==(o=P(r[0].value.gateway,!0)+"")&&ee(i,o)},i(r){f||(k(t.$$.fragment,r),f=!0)},o(r){$(t.$$.fragment,r),f=!1},d(r){r&&j(l),oe(t)}}}function Il(s){let l,t,e,n,o=P(s[0].value.dns[0],!0)+"",i,f;return t=new pe({props:{name:"circle-exclamation"}}),{c(){l=u("div"),ie(t.$$.fragment),e=d(),n=u("small"),i=y(o),c(l,"class","flex error-message")},m(r,p){H(r,l,p),re(t,l,null),a(l,e),a(l,n),a(n,i),f=!0},p(r,p){(!f||p&1)&&o!==(o=P(r[0].value.dns[0],!0)+"")&&ee(i,o)},i(r){f||(k(t.$$.fragment,r),f=!0)},o(r){$(t.$$.fragment,r),f=!1},d(r){r&&j(l),oe(t)}}}function Dl(s){let l,t,e,n,o=P(s[0].value.dns[1],!0)+"",i,f;return t=new pe({props:{name:"circle-exclamation"}}),{c(){l=u("div"),ie(t.$$.fragment),e=d(),n=u("small"),i=y(o),c(l,"class","flex error-message")},m(r,p){H(r,l,p),re(t,l,null),a(l,e),a(l,n),a(n,i),f=!0},p(r,p){(!f||p&1)&&o!==(o=P(r[0].value.dns[1],!0)+"")&&ee(i,o)},i(r){f||(k(t.$$.fragment,r),f=!0)},o(r){$(t.$$.fragment,r),f=!1},d(r){r&&j(l),oe(t)}}}function tt(s){let l,t,e,n,o,i,f,r,p,w,S,h=!P(s[0].value.ip)&&s[0].value.ip!=="",b,g,A,m,I,v,N,x,U,J,z=!Me(s[0].value.mask)&&s[0].value.mask!=="",me,R,le,V,L,Q,W,Z,Ie,te,ue,he,Ae=!P(s[0].value.gateway)&&s[0].value.gateway!=="",be,de,K,T,ye,q,se,ge,M,De,sl,Te,Ke,Ue=!P(s[0].value.dns[0])&&s[0].value.dns[0]!=="",nl,X,Qe,We,ke,He,al,ce,Xe,je,il,Ve,Ze=!P(s[0].value.dns[1])&&s[0].value.dns[1]!=="",qe,Re,ze,rl,we,Ce,Oe,Fe,Be,Ee,Pe,Ge,Je,ne,G,Se,el,ae=h&&kl(s),Y=z&&wl(s),O=Ae&&Sl(s),F=Ue&&Il(s),B=Ze&&Dl(s);return Fe=new pe({props:{name:"check",size:"1"}}),Je=new pe({props:{name:"square-plus",size:"1"}}),{c(){l=u("article"),t=u("div"),e=u("label"),n=y("IP address "),o=u("br"),i=d(),f=u("input"),p=d(),w=u("br"),S=d(),ae&&ae.c(),b=d(),g=u("label"),A=y("Subnet Mask "),m=u("br"),I=d(),v=u("input"),x=d(),U=u("br"),J=d(),Y&&Y.c(),me=d(),R=u("label"),le=y("Gateway "),V=u("span"),V.textContent="(optional)",L=d(),Q=u("br"),W=d(),Z=u("input"),te=d(),ue=u("br"),he=d(),O&&O.c(),be=d(),de=u("div"),K=u("label"),T=y("DNS 1 "),ye=u("span"),ye.textContent="(optional)",q=d(),se=u("br"),ge=d(),M=u("input"),sl=d(),Te=u("br"),Ke=d(),F&&F.c(),nl=d(),X=u("label"),Qe=y("DNS 2 "),We=u("span"),We.textContent="(optional)",ke=d(),He=u("br"),al=d(),ce=u("input"),je=d(),il=u("br"),Ve=d(),B&&B.c(),qe=d(),Re=u("div"),ze=u("br"),rl=d(),we=u("div"),Ce=u("button"),Oe=y(`Set 
          `),ie(Fe.$$.fragment),Ee=d(),Pe=u("button"),Ge=y(`Save 
          `),ie(Je.$$.fragment),c(f,"type","text"),f.autofocus=!0,c(f,"placeholder",r=s[0].placeholder.ip),c(f,"class","svelte-11f8sij"),xe(f,"error",!P(s[0].value.ip)&&s[0].value.ip!==""),c(v,"type","text"),c(v,"placeholder",N=s[0].placeholder.mask),c(v,"class","svelte-11f8sij"),xe(v,"error",!Me(s[0].value.mask)&&s[0].value.mask!==""),c(V,"class","dim"),c(Z,"type","text"),c(Z,"placeholder",Ie=s[0].placeholder.gateway),c(Z,"class","svelte-11f8sij"),xe(Z,"error",!P(s[0].value.gateway)&&s[0].value.gateway!==""),c(t,"class","grid"),c(ye,"class","dim"),c(M,"type","text"),c(M,"placeholder",De=s[0].placeholder.dns[0]),c(M,"class","svelte-11f8sij"),xe(M,"error",!P(s[0].value.dns[0])&&s[0].value.dns[0]!==""),xe(M,"correct",P(s[0].value.dns[0])),c(We,"class","dim"),c(ce,"type","text"),c(ce,"placeholder",Xe=s[0].placeholder.dns[1]),c(ce,"class","svelte-11f8sij"),xe(ce,"error",!P(s[0].value.dns[1])&&s[0].value.dns[1]!==""),c(Ce,"class","green svelte-11f8sij"),Ce.disabled=Be=(P(s[0].value.ip)&&Me(s[0].value.mask)&&(P(s[0].value.gateway)||s[0].value.gateway==="")&&(P(s[0].value.dns[0])||s[0].value.dns[0]==="")&&(P(s[0].value.dns[1])||s[0].value.dns[1]===""))===!1,c(Pe,"class","cyan svelte-11f8sij"),Pe.disabled=ne=(P(s[0].value.ip)&&Me(s[0].value.mask)&&(P(s[0].value.gateway)||s[0].value.gateway==="")&&(P(s[0].value.dns[0])||s[0].value.dns[0]==="")&&(P(s[0].value.dns[1])||s[0].value.dns[1]===""))===!1,c(we,"class","buttons svelte-11f8sij"),c(de,"class","grid"),c(l,"class","svelte-11f8sij")},m(_,C){H(_,l,C),a(l,t),a(t,e),a(e,n),a(e,o),a(e,i),a(e,f),Ne(f,s[0].value.ip),a(e,p),a(e,w),a(e,S),ae&&ae.m(e,null),a(t,b),a(t,g),a(g,A),a(g,m),a(g,I),a(g,v),Ne(v,s[0].value.mask),a(g,x),a(g,U),a(g,J),Y&&Y.m(g,null),a(t,me),a(t,R),a(R,le),a(R,V),a(R,L),a(R,Q),a(R,W),a(R,Z),Ne(Z,s[0].value.gateway),a(R,te),a(R,ue),a(R,he),O&&O.m(R,null),a(l,be),a(l,de),a(de,K),a(K,T),a(K,ye),a(K,q),a(K,se),a(K,ge),a(K,M),Ne(M,s[0].value.dns[0]),a(K,sl),a(K,Te),a(K,Ke),F&&F.m(K,null),a(de,nl),a(de,X),a(X,Qe),a(X,We),a(X,ke),a(X,He),a(X,al),a(X,ce),Ne(ce,s[0].value.dns[1]),a(X,je),a(X,il),a(X,Ve),B&&B.m(X,null),a(de,qe),a(de,Re),a(Re,ze),a(Re,rl),a(Re,we),a(we,Ce),a(Ce,Oe),re(Fe,Ce,null),a(we,Ee),a(we,Pe),a(Pe,Ge),re(Je,Pe,null),G=!0,f.focus(),Se||(el=[E(f,"input",s[2]),E(f,"keyup",s[3]),E(v,"input",s[4]),E(v,"keyup",s[5]),E(Z,"input",s[6]),E(Z,"keyup",s[7]),E(M,"input",s[8]),E(M,"keyup",s[9]),E(ce,"input",s[10]),E(ce,"keyup",s[11]),E(Ce,"click",s[12]),E(Pe,"click",s[13])],Se=!0)},p(_,[C]){(!G||C&1&&r!==(r=_[0].placeholder.ip))&&c(f,"placeholder",r),C&1&&f.value!==_[0].value.ip&&Ne(f,_[0].value.ip),(!G||C&1)&&xe(f,"error",!P(_[0].value.ip)&&_[0].value.ip!==""),C&1&&(h=!P(_[0].value.ip)&&_[0].value.ip!==""),h?ae?(ae.p(_,C),C&1&&k(ae,1)):(ae=kl(_),ae.c(),k(ae,1),ae.m(e,null)):ae&&(ve(),$(ae,1,1,()=>{ae=null}),_e()),(!G||C&1&&N!==(N=_[0].placeholder.mask))&&c(v,"placeholder",N),C&1&&v.value!==_[0].value.mask&&Ne(v,_[0].value.mask),(!G||C&1)&&xe(v,"error",!Me(_[0].value.mask)&&_[0].value.mask!==""),C&1&&(z=!Me(_[0].value.mask)&&_[0].value.mask!==""),z?Y?(Y.p(_,C),C&1&&k(Y,1)):(Y=wl(_),Y.c(),k(Y,1),Y.m(g,null)):Y&&(ve(),$(Y,1,1,()=>{Y=null}),_e()),(!G||C&1&&Ie!==(Ie=_[0].placeholder.gateway))&&c(Z,"placeholder",Ie),C&1&&Z.value!==_[0].value.gateway&&Ne(Z,_[0].value.gateway),(!G||C&1)&&xe(Z,"error",!P(_[0].value.gateway)&&_[0].value.gateway!==""),C&1&&(Ae=!P(_[0].value.gateway)&&_[0].value.gateway!==""),Ae?O?(O.p(_,C),C&1&&k(O,1)):(O=Sl(_),O.c(),k(O,1),O.m(R,null)):O&&(ve(),$(O,1,1,()=>{O=null}),_e()),(!G||C&1&&De!==(De=_[0].placeholder.dns[0]))&&c(M,"placeholder",De),C&1&&M.value!==_[0].value.dns[0]&&Ne(M,_[0].value.dns[0]),(!G||C&1)&&xe(M,"error",!P(_[0].value.dns[0])&&_[0].value.dns[0]!==""),(!G||C&1)&&xe(M,"correct",P(_[0].value.dns[0])),C&1&&(Ue=!P(_[0].value.dns[0])&&_[0].value.dns[0]!==""),Ue?F?(F.p(_,C),C&1&&k(F,1)):(F=Il(_),F.c(),k(F,1),F.m(K,null)):F&&(ve(),$(F,1,1,()=>{F=null}),_e()),(!G||C&1&&Xe!==(Xe=_[0].placeholder.dns[1]))&&c(ce,"placeholder",Xe),C&1&&ce.value!==_[0].value.dns[1]&&Ne(ce,_[0].value.dns[1]),(!G||C&1)&&xe(ce,"error",!P(_[0].value.dns[1])&&_[0].value.dns[1]!==""),C&1&&(Ze=!P(_[0].value.dns[1])&&_[0].value.dns[1]!==""),Ze?B?(B.p(_,C),C&1&&k(B,1)):(B=Dl(_),B.c(),k(B,1),B.m(X,null)):B&&(ve(),$(B,1,1,()=>{B=null}),_e()),(!G||C&1&&Be!==(Be=(P(_[0].value.ip)&&Me(_[0].value.mask)&&(P(_[0].value.gateway)||_[0].value.gateway==="")&&(P(_[0].value.dns[0])||_[0].value.dns[0]==="")&&(P(_[0].value.dns[1])||_[0].value.dns[1]===""))===!1))&&(Ce.disabled=Be),(!G||C&1&&ne!==(ne=(P(_[0].value.ip)&&Me(_[0].value.mask)&&(P(_[0].value.gateway)||_[0].value.gateway==="")&&(P(_[0].value.dns[0])||_[0].value.dns[0]==="")&&(P(_[0].value.dns[1])||_[0].value.dns[1]===""))===!1))&&(Pe.disabled=ne)},i(_){G||(k(ae),k(Y),k(O),k(F),k(B),k(Fe.$$.fragment,_),k(Je.$$.fragment,_),G=!0)},o(_){$(ae),$(Y),$(O),$(F),$(B),$(Fe.$$.fragment,_),$(Je.$$.fragment,_),G=!1},d(_){_&&j(l),ae&&ae.d(),Y&&Y.d(),O&&O.d(),F&&F.d(),B&&B.d(),oe(Fe),oe(Je),Se=!1,ol(el)}}}function st(s,l,t){const e=Rl();let{data:n={value:{ip:"192.168.1.2",mask:"255.255.255.0",gateway:"192.168.1.1",dns:["192.168.1.1","1.1.1.1"]},placeholder:{ip:"192.168.1.2",mask:"255.255.255.0",gateway:"192.168.1.1",dns:["192.168.1.1","1.1.1.1"]}}}=l;function o(){n.value.ip=this.value,t(0,n)}const i=I=>{I.key==="p"&&t(0,n.value.ip=n.placeholder.ip,n)};function f(){n.value.mask=this.value,t(0,n)}const r=I=>{I.key==="p"&&t(0,n.value.mask=n.placeholder.mask,n)};function p(){n.value.gateway=this.value,t(0,n)}const w=I=>{I.key==="p"&&t(0,n.value.gateway=n.placeholder.gateway,n)};function S(){n.value.dns[0]=this.value,t(0,n)}const h=I=>{I.key==="p"&&t(0,n.value.dns[0]=n.placeholder.dns[0],n)};function b(){n.value.dns[1]=this.value,t(0,n)}const g=I=>{I.key==="p"&&t(0,n.value.dns[1]=n.placeholder.dns[1],n)},A=()=>e("set",n.value),m=()=>e("save",n.value);return s.$$set=I=>{"data"in I&&t(0,n=I.data)},[n,e,o,i,f,r,p,w,S,h,b,g,A,m]}class nt extends cl{constructor(l){super(),fl(this,l,st,tt,pl,{data:0})}}function $l(s,l,t){const e=s.slice();return e[25]=l[t],e}function xl(s,l,t){const e=s.slice();return e[25]=l[t],e}function yl(s,l,t){const e=s.slice();return e[28]=l[t],e[30]=t,e}function Cl(s,l,t){const e=s.slice();return e[28]=l[t],e[30]=t,e}function Pl(s,l,t){const e=s.slice();return e[34]=l[t],e}function Nl(s,l,t){const e=s.slice();return e[37]=l[t],e}function at(s){let l,t;return l=new nt({props:{data:s[0].setIp}}),l.$on("save",s[6]),l.$on("set",s[7]),{c(){ie(l.$$.fragment)},m(e,n){re(l,e,n),t=!0},p(e,n){const o={};n[0]&1&&(o.data=e[0].setIp),l.$set(o)},i(e){t||(k(l.$$.fragment,e),t=!0)},o(e){$(l.$$.fragment,e),t=!1},d(e){oe(l,e)}}}function Ml(s){let l,t=s[37].name+"",e,n;return{c(){l=u("option"),e=y(t),l.__value=n=s[37].name,l.value=l.__value},m(o,i){H(o,l,i),a(l,e)},p(o,i){i[0]&1&&t!==(t=o[37].name+"")&&ee(e,t),i[0]&1&&n!==(n=o[37].name)&&(l.__value=n,l.value=l.__value)},d(o){o&&j(l)}}}function Al(s){let l,t=s[0].nicSelected.ipsAdded,e=[];for(let n=0;n<t.length;n+=1)e[n]=Hl(Pl(s,t,n));return{c(){for(let n=0;n<e.length;n+=1)e[n].c();l=ll()},m(n,o){for(let i=0;i<e.length;i+=1)e[i].m(n,o);H(n,l,o)},p(n,o){if(o[0]&1){t=n[0].nicSelected.ipsAdded;let i;for(i=0;i<t.length;i+=1){const f=Pl(n,t,i);e[i]?e[i].p(f,o):(e[i]=Hl(f),e[i].c(),e[i].m(l.parentNode,l))}for(;i<e.length;i+=1)e[i].d(1);e.length=t.length}},d(n){tl(e,n),n&&j(l)}}}function Hl(s){let l,t,e,n,o=s[34].ip+"",i,f,r,p,w,S,h=s[34].mask+"",b,g,A;return{c(){l=u("div"),t=u("div"),t.textContent="+ IP:",e=d(),n=u("div"),i=y(o),f=d(),r=u("div"),p=u("div"),p.textContent="Mask:",w=d(),S=u("div"),b=y(h),g=d(),A=u("br"),c(t,"class","svelte-1n4bv2x"),c(n,"class","svelte-1n4bv2x"),c(l,"class","flex bright svelte-1n4bv2x"),c(p,"class","svelte-1n4bv2x"),c(S,"class","svelte-1n4bv2x"),c(r,"class","svelte-1n4bv2x")},m(m,I){H(m,l,I),a(l,t),a(l,e),a(l,n),a(n,i),H(m,f,I),H(m,r,I),a(r,p),a(r,w),a(r,S),a(S,b),H(m,g,I),H(m,A,I)},p(m,I){I[0]&1&&o!==(o=m[34].ip+"")&&ee(i,o),I[0]&1&&h!==(h=m[34].mask+"")&&ee(b,h)},d(m){m&&j(l),m&&j(f),m&&j(r),m&&j(g),m&&j(A)}}}function jl(s){let l,t=s[0].nicSelected.dns,e=[];for(let n=0;n<t.length;n+=1)e[n]=Vl(Cl(s,t,n));return{c(){for(let n=0;n<e.length;n+=1)e[n].c();l=ll()},m(n,o){for(let i=0;i<e.length;i+=1)e[i].m(n,o);H(n,l,o)},p(n,o){if(o[0]&1){t=n[0].nicSelected.dns;let i;for(i=0;i<t.length;i+=1){const f=Cl(n,t,i);e[i]?e[i].p(f,o):(e[i]=Vl(f),e[i].c(),e[i].m(l.parentNode,l))}for(;i<e.length;i+=1)e[i].d(1);e.length=t.length}},d(n){tl(e,n),n&&j(l)}}}function Vl(s){let l,t,e,n=s[30]+1+"",o,i,f,r,p=s[28]+"",w,S;return{c(){l=u("div"),t=u("div"),e=y("DNS"),o=y(n),i=y(":"),f=d(),r=u("div"),w=y(p),S=d(),c(t,"class","svelte-1n4bv2x"),c(r,"class","svelte-1n4bv2x"),c(l,"class","svelte-1n4bv2x")},m(h,b){H(h,l,b),a(l,t),a(t,e),a(t,o),a(t,i),a(l,f),a(l,r),a(r,w),a(l,S)},p(h,b){b[0]&1&&p!==(p=h[28]+"")&&ee(w,p)},d(h){h&&j(l)}}}function it(s){let l,t,e,n,o,i,f,r,p,w,S,h,b,g,A,m,I,v,N,x,U,J,z,me,R,le,V,L,Q,W,Z,Ie,te,ue,he;const Ae=[ut,ot],be=[];function de(q,se){return q[0].presetSelected.name==="DHCP"?0:1}Q=de(s),W=be[Q]=Ae[Q](s);let K=s[0].presets,T=[];for(let q=0;q<K.length;q+=1)T[q]=ql($l(s,K,q));const ye=q=>$(T[q],1,1,()=>{T[q]=null});return{c(){l=u("div"),t=u("div"),e=u("span"),n=u("button"),n.textContent="IP",o=d(),i=u("span"),f=u("button"),f.textContent="Mask",r=d(),p=u("span"),w=u("button"),w.textContent="Gateway",S=d(),h=u("span"),b=u("button"),b.textContent="DNS1",g=d(),A=u("span"),m=u("button"),m.textContent="DNS2",I=d(),v=u("button"),N=u("span"),N.textContent="DHCP",x=d(),U=u("span"),U.textContent="-",J=d(),z=u("span"),z.textContent="-",me=d(),R=u("span"),R.textContent="-",le=d(),V=u("span"),V.textContent="-",L=d(),W.c(),Ie=d();for(let q=0;q<T.length;q+=1)T[q].c();c(n,"class","svelte-1n4bv2x"),c(e,"class","svelte-1n4bv2x"),c(f,"class","svelte-1n4bv2x"),c(i,"class","svelte-1n4bv2x"),c(w,"class","svelte-1n4bv2x"),c(p,"class","svelte-1n4bv2x"),c(b,"class","svelte-1n4bv2x"),c(h,"class","svelte-1n4bv2x"),c(m,"class","svelte-1n4bv2x"),c(A,"class","svelte-1n4bv2x"),c(t,"class","svelte-1n4bv2x"),c(N,"class","svelte-1n4bv2x"),c(U,"class","svelte-1n4bv2x"),c(z,"class","svelte-1n4bv2x"),c(R,"class","svelte-1n4bv2x"),c(V,"class","svelte-1n4bv2x"),c(v,"class",Z=Le(s[0].presetSelected.name==="DHCP"?"presetSelected":"")+" svelte-1n4bv2x"),c(l,"class","presetTable svelte-1n4bv2x")},m(q,se){H(q,l,se),a(l,t),a(t,e),a(e,n),a(t,o),a(t,i),a(i,f),a(t,r),a(t,p),a(p,w),a(t,S),a(t,h),a(h,b),a(t,g),a(t,A),a(A,m),a(l,I),a(l,v),a(v,N),a(v,x),a(v,U),a(v,J),a(v,z),a(v,me),a(v,R),a(v,le),a(v,V),a(v,L),be[Q].m(v,null),a(l,Ie);for(let ge=0;ge<T.length;ge+=1)T[ge].m(l,null);te=!0,ue||(he=[E(n,"click",s[15]),E(f,"click",s[16]),E(w,"click",s[17]),E(b,"click",s[18]),E(m,"click",s[19]),E(v,"click",s[20])],ue=!0)},p(q,se){let ge=Q;if(Q=de(q),Q!==ge&&(ve(),$(be[ge],1,1,()=>{be[ge]=null}),_e(),W=be[Q],W||(W=be[Q]=Ae[Q](q),W.c()),k(W,1),W.m(v,null)),(!te||se[0]&1&&Z!==(Z=Le(q[0].presetSelected.name==="DHCP"?"presetSelected":"")+" svelte-1n4bv2x"))&&c(v,"class",Z),se[0]&257){K=q[0].presets;let M;for(M=0;M<K.length;M+=1){const De=$l(q,K,M);T[M]?(T[M].p(De,se),k(T[M],1)):(T[M]=ql(De),T[M].c(),k(T[M],1),T[M].m(l,null))}for(ve(),M=K.length;M<T.length;M+=1)ye(M);_e()}},i(q){if(!te){k(W);for(let se=0;se<K.length;se+=1)k(T[se]);te=!0}},o(q){$(W),T=T.filter(Boolean);for(let se=0;se<T.length;se+=1)$(T[se]);te=!1},d(q){q&&j(l),be[Q].d(),tl(T,q),ue=!1,ol(he)}}}function rt(s){let l,t,e,n,o,i,f,r,p,w,S,h=s[0].presetSelected.name==="DHCP"&&zl(),b=s[0].presets,g=[];for(let m=0;m<b.length;m+=1)g[m]=Jl(xl(s,b,m));const A=m=>$(g[m],1,1,()=>{g[m]=null});return{c(){l=u("div"),t=u("button"),e=u("h3"),e.textContent="DHCP",n=d(),o=u("span"),o.textContent="Request an address",i=d(),h&&h.c(),r=d();for(let m=0;m<g.length;m+=1)g[m].c();c(o,"class","svelte-1n4bv2x"),c(t,"class",f=Le(s[0].presetSelected.name==="DHCP"?"presetSelected":"")+" svelte-1n4bv2x"),c(l,"class","presetButtons svelte-1n4bv2x")},m(m,I){H(m,l,I),a(l,t),a(t,e),a(t,n),a(t,o),a(t,i),h&&h.m(t,null),a(l,r);for(let v=0;v<g.length;v+=1)g[v].m(l,null);p=!0,w||(S=E(t,"click",s[13]),w=!0)},p(m,I){if(m[0].presetSelected.name==="DHCP"?h?I[0]&1&&k(h,1):(h=zl(),h.c(),k(h,1),h.m(t,null)):h&&(ve(),$(h,1,1,()=>{h=null}),_e()),(!p||I[0]&1&&f!==(f=Le(m[0].presetSelected.name==="DHCP"?"presetSelected":"")+" svelte-1n4bv2x"))&&c(t,"class",f),I[0]&257){b=m[0].presets;let v;for(v=0;v<b.length;v+=1){const N=xl(m,b,v);g[v]?(g[v].p(N,I),k(g[v],1)):(g[v]=Jl(N),g[v].c(),k(g[v],1),g[v].m(l,null))}for(ve(),v=b.length;v<g.length;v+=1)A(v);_e()}},i(m){if(!p){k(h);for(let I=0;I<b.length;I+=1)k(g[I]);p=!0}},o(m){$(h),g=g.filter(Boolean);for(let I=0;I<g.length;I+=1)$(g[I]);p=!1},d(m){m&&j(l),h&&h.d(),tl(g,m),w=!1,S()}}}function ot(s){let l,t,e;return t=new pe({props:{name:"square-outline"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function ut(s){let l,t,e;return t=new pe({props:{name:"square-check"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function ct(s){let l,t,e;return t=new pe({props:{name:"square-outline"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function ft(s){let l,t,e;return t=new pe({props:{name:"square-check"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function ql(s){let l,t,e=s[25].ip+"",n,o,i,f=s[25].mask+"",r,p,w,S=(s[25].gateway||"-")+"",h,b,g,A=(s[25].dns[0]||"-")+"",m,I,v,N=(s[25].dns[1]||"-")+"",x,U,J,z,me,R,le,V,L;const Q=[ft,ct],W=[];function Z(te,ue){return te[25].name===te[0].presetSelected.name?0:1}J=Z(s),z=W[J]=Q[J](s);function Ie(){return s[21](s[25])}return{c(){l=u("button"),t=u("span"),n=y(e),o=d(),i=u("span"),r=y(f),p=d(),w=u("span"),h=y(S),b=d(),g=u("span"),m=y(A),I=d(),v=u("span"),x=y(N),U=d(),z.c(),me=d(),c(t,"class","svelte-1n4bv2x"),c(i,"class","svelte-1n4bv2x"),c(w,"class","svelte-1n4bv2x"),c(g,"class","svelte-1n4bv2x"),c(v,"class","svelte-1n4bv2x"),c(l,"class",R=Le(s[25].name===s[0].presetSelected.name?"presetSelected":"")+" svelte-1n4bv2x")},m(te,ue){H(te,l,ue),a(l,t),a(t,n),a(l,o),a(l,i),a(i,r),a(l,p),a(l,w),a(w,h),a(l,b),a(l,g),a(g,m),a(l,I),a(l,v),a(v,x),a(l,U),W[J].m(l,null),a(l,me),le=!0,V||(L=E(l,"click",Ie),V=!0)},p(te,ue){s=te,(!le||ue[0]&1)&&e!==(e=s[25].ip+"")&&ee(n,e),(!le||ue[0]&1)&&f!==(f=s[25].mask+"")&&ee(r,f),(!le||ue[0]&1)&&S!==(S=(s[25].gateway||"-")+"")&&ee(h,S),(!le||ue[0]&1)&&A!==(A=(s[25].dns[0]||"-")+"")&&ee(m,A),(!le||ue[0]&1)&&N!==(N=(s[25].dns[1]||"-")+"")&&ee(x,N);let he=J;J=Z(s),J!==he&&(ve(),$(W[he],1,1,()=>{W[he]=null}),_e(),z=W[J],z||(z=W[J]=Q[J](s),z.c()),k(z,1),z.m(l,me)),(!le||ue[0]&1&&R!==(R=Le(s[25].name===s[0].presetSelected.name?"presetSelected":"")+" svelte-1n4bv2x"))&&c(l,"class",R)},i(te){le||(k(z),le=!0)},o(te){$(z),le=!1},d(te){te&&j(l),W[J].d(),V=!1,L()}}}function zl(s){let l,t,e;return t=new pe({props:{name:"check"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function Ol(s){let l,t,e=s[25].gateway+"",n;return{c(){l=u("span"),t=y("Gate: "),n=y(e),c(l,"class","svelte-1n4bv2x")},m(o,i){H(o,l,i),a(l,t),a(l,n)},p(o,i){i[0]&1&&e!==(e=o[25].gateway+"")&&ee(n,e)},d(o){o&&j(l)}}}function Fl(s){let l,t=s[25].dns,e=[];for(let n=0;n<t.length;n+=1)e[n]=El(yl(s,t,n));return{c(){for(let n=0;n<e.length;n+=1)e[n].c();l=ll()},m(n,o){for(let i=0;i<e.length;i+=1)e[i].m(n,o);H(n,l,o)},p(n,o){if(o[0]&1){t=n[25].dns;let i;for(i=0;i<t.length;i+=1){const f=yl(n,t,i);e[i]?e[i].p(f,o):(e[i]=El(f),e[i].c(),e[i].m(l.parentNode,l))}for(;i<e.length;i+=1)e[i].d(1);e.length=t.length}},d(n){tl(e,n),n&&j(l)}}}function Bl(s){let l,t,e=s[30]+1+"",n,o,i=s[28]+"",f;return{c(){l=u("div"),t=y("DNS"),n=y(e),o=y(": "),f=y(i)},m(r,p){H(r,l,p),a(l,t),a(l,n),a(l,o),a(l,f)},p(r,p){p[0]&1&&i!==(i=r[28]+"")&&ee(f,i)},d(r){r&&j(l)}}}function El(s){let l,t=s[25].dns[s[30]]&&Bl(s);return{c(){t&&t.c(),l=ll()},m(e,n){t&&t.m(e,n),H(e,l,n)},p(e,n){e[25].dns[e[30]]?t?t.p(e,n):(t=Bl(e),t.c(),t.m(l.parentNode,l)):t&&(t.d(1),t=null)},d(e){t&&t.d(e),e&&j(l)}}}function Gl(s){let l,t,e;return t=new pe({props:{name:"check"}}),{c(){l=u("div"),ie(t.$$.fragment),c(l,"class","checkmark svelte-1n4bv2x")},m(n,o){H(n,l,o),re(t,l,null),e=!0},i(n){e||(k(t.$$.fragment,n),e=!0)},o(n){$(t.$$.fragment,n),e=!1},d(n){n&&j(l),oe(t)}}}function Jl(s){let l,t,e=s[25].ip+"",n,o,i,f,r=s[25].mask+"",p,w,S,h,b,g,A,m,I,v=s[25].gateway&&Ol(s),N=s[25].dns.length>0&&Fl(s),x=s[25].name===s[0].presetSelected.name&&Gl();function U(){return s[14](s[25])}return{c(){l=u("button"),t=u("h3"),n=y(e),o=d(),i=u("span"),f=y("Mask: "),p=y(r),w=d(),v&&v.c(),S=d(),N&&N.c(),h=d(),x&&x.c(),b=d(),c(i,"class","svelte-1n4bv2x"),c(l,"class",g=Le(s[25].name===s[0].presetSelected.name?"presetSelected":"")+" svelte-1n4bv2x")},m(J,z){H(J,l,z),a(l,t),a(t,n),a(l,o),a(l,i),a(i,f),a(i,p),a(l,w),v&&v.m(l,null),a(l,S),N&&N.m(l,null),a(l,h),x&&x.m(l,null),a(l,b),A=!0,m||(I=E(l,"click",U),m=!0)},p(J,z){s=J,(!A||z[0]&1)&&e!==(e=s[25].ip+"")&&ee(n,e),(!A||z[0]&1)&&r!==(r=s[25].mask+"")&&ee(p,r),s[25].gateway?v?v.p(s,z):(v=Ol(s),v.c(),v.m(l,S)):v&&(v.d(1),v=null),s[25].dns.length>0?N?N.p(s,z):(N=Fl(s),N.c(),N.m(l,h)):N&&(N.d(1),N=null),s[25].name===s[0].presetSelected.name?x?z[0]&1&&k(x,1):(x=Gl(),x.c(),k(x,1),x.m(l,b)):x&&(ve(),$(x,1,1,()=>{x=null}),_e()),(!A||z[0]&1&&g!==(g=Le(s[25].name===s[0].presetSelected.name?"presetSelected":"")+" svelte-1n4bv2x"))&&c(l,"class",g)},i(J){A||(k(x),A=!0)},o(J){$(x),A=!1},d(J){J&&j(l),v&&v.d(),N&&N.d(),x&&x.d(),m=!1,I()}}}function pt(s){let l,t,e,n,o,i,f,r,p,w,S,h,b,g,A=s[0].nicSelected.ip+"",m,I,v,N,x,U,J=s[0].nicSelected.mask+"",z,me,R,le,V,L,Q=s[0].nicSelected.gateway+"",W,Z,Ie,te,ue,he,Ae,be,de,K,T,ye,q=s[0].nicSelected.ipIsDhcp+"",se,ge,M,De,sl,Te,Ke=s[0].nicSelected.interfaceMetric+"",Ue,nl,X,Qe,We,ke,He,al,ce,Xe,je,il,Ve,Ze,qe,Re,ze,rl,we,Ce,Oe,Fe,Be,Ee,Pe,Ge,Je,ne,G,Se,el,ae;l=new lt({props:{title:"Create Network Preset",show:s[0].setIp.show,$$slots:{default:[at]},$$scope:{ctx:s}}}),l.$on("close",s[12]);let Y=s[0].nics,O=[];for(let D=0;D<Y.length;D+=1)O[D]=Ml(Nl(s,Y,D));let F=s[0].nicSelected.ipsAdded.length>0&&Al(s),B=s[0].nicSelected.dns.length>0&&jl(s);ce=new pe({props:{name:"square-plus",size:"1"}}),Ve=new pe({props:{name:"check",size:"1"}}),ze=new pe({props:{name:"plus",size:"1"}}),Oe=new pe({props:{name:"trash",size:"1"}}),Ge=new pe({props:{name:"arrows-rotate",size:".8",inline:!0,color:"var(--color-text-dim)"}});const _=[rt,it],C=[];function dl(D,fe){return D[0].presetViewMode==="buttons"?0:D[0].presetViewMode==="table"?1:-1}return~(ne=dl(s))&&(G=C[ne]=_[ne](s)),{c(){ie(l.$$.fragment),t=d(),e=u("article"),n=u("aside"),o=u("h2"),o.textContent="Server Interfaces",i=d(),f=u("label"),r=y("Interface "),p=u("br"),w=d(),S=u("select");for(let D=0;D<O.length;D+=1)O[D].c();h=d(),b=u("div"),g=u("h3"),m=y(A),I=d(),v=u("div"),N=u("div"),N.textContent="Mask:",x=d(),U=u("div"),z=y(J),me=d(),R=u("div"),le=u("div"),le.textContent="Gate:",V=d(),L=u("div"),W=y(Q),Z=d(),Ie=u("br"),te=d(),F&&F.c(),ue=d(),B&&B.c(),he=d(),Ae=u("br"),be=d(),de=u("div"),K=u("div"),K.textContent="DHCP:",T=d(),ye=u("div"),se=y(q),ge=d(),M=u("div"),De=u("div"),De.textContent="Metric:",sl=d(),Te=u("div"),Ue=y(Ke),nl=d(),X=u("section"),Qe=u("h2"),Qe.textContent="Preset Actions",We=d(),ke=u("div"),He=u("button"),al=y(`New 
        `),ie(ce.$$.fragment),Xe=d(),je=u("button"),il=y(`Set 
        `),ie(Ve.$$.fragment),Ze=d(),qe=u("button"),Re=y(`Add 
        `),ie(ze.$$.fragment),rl=d(),we=u("button"),Ce=y(`Remove
        `),ie(Oe.$$.fragment),Fe=d(),Be=u("h2"),Ee=u("button"),Pe=y(`Select Preset
        `),ie(Ge.$$.fragment),Je=d(),G&&G.c(),c(N,"class","svelte-1n4bv2x"),c(U,"class","svelte-1n4bv2x"),c(v,"class","svelte-1n4bv2x"),c(le,"class","svelte-1n4bv2x"),c(L,"class","svelte-1n4bv2x"),c(R,"class","svelte-1n4bv2x"),c(K,"class","svelte-1n4bv2x"),c(ye,"class","svelte-1n4bv2x"),c(de,"class","svelte-1n4bv2x"),c(De,"class","svelte-1n4bv2x"),c(Te,"class","svelte-1n4bv2x"),c(M,"class","svelte-1n4bv2x"),c(b,"class","nicInfo svelte-1n4bv2x"),c(n,"class","grid svelte-1n4bv2x"),c(He,"class","flex cyan"),c(je,"class","flex green"),c(qe,"class","flex yellow"),c(we,"class","flex red"),c(ke,"class","flex"),c(Ee,"class","svelte-1n4bv2x"),c(Be,"class","svelte-1n4bv2x"),c(X,"class","grid svelte-1n4bv2x"),c(e,"class","svelte-1n4bv2x")},m(D,fe){re(l,D,fe),H(D,t,fe),H(D,e,fe),a(e,n),a(n,o),a(n,i),a(n,f),a(f,r),a(f,p),a(f,w),a(f,S);for(let Ye=0;Ye<O.length;Ye+=1)O[Ye].m(S,null);a(n,h),a(n,b),a(b,g),a(g,m),a(b,I),a(b,v),a(v,N),a(v,x),a(v,U),a(U,z),a(b,me),a(b,R),a(R,le),a(R,V),a(R,L),a(L,W),a(b,Z),a(b,Ie),a(b,te),F&&F.m(b,null),a(b,ue),B&&B.m(b,null),a(b,he),a(b,Ae),a(b,be),a(b,de),a(de,K),a(de,T),a(de,ye),a(ye,se),a(b,ge),a(b,M),a(M,De),a(M,sl),a(M,Te),a(Te,Ue),a(e,nl),a(e,X),a(X,Qe),a(X,We),a(X,ke),a(ke,He),a(He,al),re(ce,He,null),a(ke,Xe),a(ke,je),a(je,il),re(Ve,je,null),a(ke,Ze),a(ke,qe),a(qe,Re),re(ze,qe,null),a(ke,rl),a(ke,we),a(we,Ce),re(Oe,we,null),a(X,Fe),a(X,Be),a(Be,Ee),a(Ee,Pe),re(Ge,Ee,null),a(X,Je),~ne&&C[ne].m(X,null),Se=!0,el||(ae=[E(S,"input",s[1]),E(He,"click",s[2]),E(je,"click",s[3]),E(qe,"click",s[4]),E(we,"click",s[5]),E(Ee,"click",s[10])],el=!0)},p(D,fe){const Ye={};if(fe[0]&1&&(Ye.show=D[0].setIp.show),fe[0]&1|fe[1]&512&&(Ye.$$scope={dirty:fe,ctx:D}),l.$set(Ye),fe[0]&1){Y=D[0].nics;let $e;for($e=0;$e<Y.length;$e+=1){const vl=Nl(D,Y,$e);O[$e]?O[$e].p(vl,fe):(O[$e]=Ml(vl),O[$e].c(),O[$e].m(S,null))}for(;$e<O.length;$e+=1)O[$e].d(1);O.length=Y.length}(!Se||fe[0]&1)&&A!==(A=D[0].nicSelected.ip+"")&&ee(m,A),(!Se||fe[0]&1)&&J!==(J=D[0].nicSelected.mask+"")&&ee(z,J),(!Se||fe[0]&1)&&Q!==(Q=D[0].nicSelected.gateway+"")&&ee(W,Q),D[0].nicSelected.ipsAdded.length>0?F?F.p(D,fe):(F=Al(D),F.c(),F.m(b,ue)):F&&(F.d(1),F=null),D[0].nicSelected.dns.length>0?B?B.p(D,fe):(B=jl(D),B.c(),B.m(b,he)):B&&(B.d(1),B=null),(!Se||fe[0]&1)&&q!==(q=D[0].nicSelected.ipIsDhcp+"")&&ee(se,q),(!Se||fe[0]&1)&&Ke!==(Ke=D[0].nicSelected.interfaceMetric+"")&&ee(Ue,Ke);let ul=ne;ne=dl(D),ne===ul?~ne&&C[ne].p(D,fe):(G&&(ve(),$(C[ul],1,1,()=>{C[ul]=null}),_e()),~ne?(G=C[ne],G?G.p(D,fe):(G=C[ne]=_[ne](D),G.c()),k(G,1),G.m(X,null)):G=null)},i(D){Se||(k(l.$$.fragment,D),k(ce.$$.fragment,D),k(Ve.$$.fragment,D),k(ze.$$.fragment,D),k(Oe.$$.fragment,D),k(Ge.$$.fragment,D),k(G),Se=!0)},o(D){$(l.$$.fragment,D),$(ce.$$.fragment,D),$(Ve.$$.fragment,D),$(ze.$$.fragment,D),$(Oe.$$.fragment,D),$(Ge.$$.fragment,D),$(G),Se=!1},d(D){oe(l,D),D&&j(t),D&&j(e),tl(O,D),F&&F.d(),B&&B.d(),oe(ce),oe(Ve),oe(ze),oe(Oe),oe(Ge),~ne&&C[ne].d(),el=!1,ol(ae)}}}function dt(s,l,t){let e={nics:[{name:"Fake NIC",interfaceMetric:"xx",ipIsDhcp:!1,ip:"xxx.xxx.xxx.xxx",mask:"xxx.xxx.xxx.xxx",gateway:"xxx.xxx.xxx.xxx",ipsAdded:[{ip:"xxx.xxx.xxx.xxx",mask:"xxx.xxx.xxx.xxx"}],dnsIsDhcp:!1,dns:["xxx.xxx.xxx.xxx","xxx.xxx.xxx.xxx"]},{name:"Fake WiFi",interfaceMetric:"75",ipIsDhcp:!0,ip:"10.0.1.69",mask:"255.255.0.0",gateway:"10.0.1.1",dnsIsDhcp:!0,dns:["10.0.1.5","10.0.1.7"],ipsAdded:[]},{name:"Fake Ethernet",interfaceMetric:"25",ipIsDhcp:!1,ip:"192.168.1.9",mask:"255.255.255.0",gateway:"192.168.1.254",dnsIsDhcp:!1,dns:["192.168.1.1"],ipsAdded:[{ip:"169.254.0.9",mask:"255.255.0.0"},{ip:"192.168.2.9",mask:"255.255.255.0"},{ip:"192.168.3.9",mask:"255.255.255.0"}]}],nicSelected:{name:"Fake NIC",interfaceMetric:"xx",ipIsDhcp:!1,ip:"xxx.xxx.xxx.xxx",mask:"xxx.xxx.xxx.xxx",gateway:"xxx.xxx.xxx.xxx",ipsAdded:[{ip:"xxx.xxx.xxx.xxx",mask:"xxx.xxx.xxx.xxx"}],dnsIsDhcp:!1,dns:["xxx.xxx.xxx.xxx","xxx.xxx.xxx.xxx"]},setIp:{show:!1,value:{ip:"",mask:"",gateway:"",dns:["",""]},placeholder:{ip:"192.168.1.2",mask:"255.255.255.0",gateway:"192.168.1.1",dns:["192.168.1.1","1.1.1.1"]}},presetDHCP:{name:"DHCP",ipIsDhcp:!0,dnsIsDhcp:!0},presetSelected:{name:"DHCP",ipIsDhcp:!0,dnsIsDhcp:!0},presetViewMode:"buttons",presets:[{name:"00",ipIsDhcp:!1,ip:"192.168.0.9",mask:"255.255.0.0",gateway:"192.168.0.1",dnsIsDhcp:!1,dns:["192.168.0.1","1.1.1.1"]},{name:"0",ipIsDhcp:!1,ip:"192.168.0.9",mask:"255.255.255.0",gateway:"192.168.0.1",dnsIsDhcp:!1,dns:["192.168.0.1","1.1.1.1"]},{name:"1",ipIsDhcp:!1,ip:"192.168.1.9",mask:"255.255.255.0",gateway:"192.168.1.1",dnsIsDhcp:!1,dns:["192.168.1.1","1.1.1.1"]},{name:"2",ipIsDhcp:!1,ip:"192.168.2.9",mask:"255.255.255.0",gateway:"192.168.2.1",dnsIsDhcp:!1,dns:["192.168.2.1","1.1.1.1"]},{name:"3",ipIsDhcp:!1,ip:"192.168.3.9",mask:"255.255.255.0",gateway:"192.168.3.1",dnsIsDhcp:!1,dns:["192.168.3.1","1.1.1.1"]},{name:"10",ipIsDhcp:!1,ip:"10.0.0.9",mask:"255.0.0.0",gateway:"10.0.0.1",dnsIsDhcp:!1,dns:["10.0.0.1","1.1.1.1"]},{name:"169",ipIsDhcp:!1,ip:"169.254.0.9",mask:"255.255.0.0",gateway:"",dnsIsDhcp:!1,dns:[]},{name:"172",ipIsDhcp:!1,ip:"172.22.0.9",mask:"255.255.0.0",gateway:"172.22.0.2",dnsIsDhcp:!1,dns:["172.22.0.2","1.1.1.1"]}]};function n(V){const L=V.target.value;t(0,e.nicSelected=e.nics.find(Q=>Q.name===L),e),console.log("Interface selected changed to",L,e.nicSelected)}function o(){e.presetSelected.ipIsDhcp?(t(0,e.setIp.placeholder={ip:e.nicSelected.ip||"192.168.1.2",mask:e.nicSelected.mask||"255.255.255.0",gateway:e.nicSelected.gateway||"192.168.1.1"},e),t(0,e.setIp.placeholder.dns=[e.nicSelected.dns[0]||"192.168.1.1",e.nicSelected.dns[1]||"1.1.1.1"],e),console.log("Open Popup to create a preset with the selected interface as the placeholders",e.setIp.placeholder)):(t(0,e.setIp.placeholder={ip:e.presetSelected.ip||"192.168.1.2",mask:e.presetSelected.mask||"255.255.255.0",gateway:e.presetSelected.gateway||"192.168.1.1"},e),t(0,e.setIp.placeholder.dns=[e.presetSelected.dns[0]||"192.168.1.1",e.presetSelected.dns[1]||"1.1.1.1"],e),console.log("Open Popup to create a preset with the selected preset as the placeholders",e.setIp.placeholder)),t(0,e.setIp.show=!0,e)}function i(){console.log("Set selected preset as network settings",e.presetSelected)}function f(){console.log("Add selected preset to network settings",e.presetSelected)}function r(){t(0,e.presets=e.presets.filter(V=>V.name!==e.presetSelected.name),e),t(0,e.presetSelected=e.presetDHCP,e),m(),console.log("Remove selected preset from list",e.presetSelected)}function p(V){const L=JSON.parse(JSON.stringify(V.detail));L.name=Date.now(),L.ipIsDhcp=!1,L.dnsIsDhcp=!1,t(0,e.presets=[...e.presets,L],e),t(0,e.setIp.show=!1,e),m(),console.log("SetIP popup saved new preset",L)}function w(V){const L={...V.detail,name:Date.now()};t(0,e.setIp.show=!1,e),console.log("SetIP popup set these settings",L)}function S(V){t(0,e.presetSelected=V,e),console.log("Selected preset changed to",e.presetSelected)}function h(){t(0,e.presetSelected=e.presetDHCP,e),console.log("Selected preset changed to DHCP",e.presetSelected)}function b(){e.presetViewMode==="buttons"?t(0,e.presetViewMode="table",e):e.presetViewMode==="table"?t(0,e.presetViewMode="buttons",e):t(0,e.presetViewMode="table",e),console.log("Preset View Mode Changed to",e.presetViewMode)}function g(V){t(0,e.presets=Ql(e.presets,V),e),m()}function A(){const V=localStorage.getItem("networkPresets");if(V===null||V===""){console.log("No presets in local storage. Using the default presets");return}const L=JSON.parse(V);L.length===0?console.log("No presets in local storage. Using the default presets"):(t(0,e.presets=L,e),console.log("Retrieved presets from local storage"),console.table(L))}function m(){localStorage.setItem("networkPresets",JSON.stringify(e.presets)),console.log("Presets saved to local storage",e.presets)}return Yl(async()=>{A(),document.documentElement.offsetWidth>1200&&t(0,e.presetViewMode="table",e)}),[e,n,o,i,f,r,p,w,S,h,b,g,()=>t(0,e.setIp.show=!1,e),()=>h(),V=>S(V),()=>g("ip"),()=>g("mask"),()=>g("gateway"),()=>g("dns"),()=>g("dns"),()=>h(),V=>S(V)]}class _t extends cl{constructor(l){super(),fl(this,l,dt,pt,pl,{},null,[-1,-1])}}export{_t as default};
