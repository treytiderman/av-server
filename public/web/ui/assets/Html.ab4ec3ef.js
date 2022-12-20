import{S as St,i as It,s as Mt,e,c as a,t as Ot,a as p,b as d,h as l,n as vt,d as s}from"./index.eedbf297.js";function Bt(Ct){let r,S,I,M,T,O,B,q,n,R,ht,U,ft,A,E,N,mt,P,F,Q,$,_,j,z,G,H,J,K,V,L,W,X,Y,o,Z,ct,g,xt,tt,yt,et,Tt,lt,_t,it,Ht,dt,u,Lt,wt,Dt,k,b,v,h,f,m,c,x,y,kt,st,at,ot,nt,w,pt,rt,ut,D,bt,C;return{c(){r=e("section"),r.innerHTML=`<h1>Heading h1</h1> 
  <p>Paragraph of text...
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Dolore doloribus nobis error repellat vitae, sit quasi 
    earum eveniet necessitatibus architecto alias officia 
    nemo accusamus ratione, delectus sint aut porro nam.</p> 
  <br/> 
  <div><h2>Smaller Heading h2</h2> 
    <h6>Sub heading h6</h6></div> 
  <br/> 
  <h3>Heading h3</h3> 
  <br/> 
  <h4>Heading h4</h4> 
  <br/> 
  <h5>Sub Heading h5</h5>`,S=a(),I=e("hr"),M=a(),T=e("section"),T.innerHTML=`<div><h2>Decoration</h2> 
    <h6>Italic, Bold, Underline, Strikethrough, and Highlight text</h6></div> 
  <div class="flex svelte-ft0h96"><span><i>Italic text</i></span> 
    <span><b>Bold text</b></span> 
    <span><u>Underline text</u></span> 
    <span><s>Strikethrough text</s></span> 
    <span><q>Quote text</q></span> 
    <span><a href="/#">Anchor / Link</a></span> 
    <span>Highlight <mark>text</mark></span> 
    <span>2<sup>16</sup></span> 
    <span>A<sub>b</sub></span></div>`,O=a(),B=e("hr"),q=a(),n=e("section"),R=e("div"),R.innerHTML=`<h2>Block Text</h2> 
    <h6>Code, Pre-Code, and Blockquote examples</h6>`,ht=a(),U=e("p"),U.innerHTML=`<span>Here is a code block</span> 
    <code>const app = document.getElementById(&#39;app&#39;)</code>`,ft=a(),A=e("div"),E=e("pre"),N=e("code"),N.textContent=`// Sort by id
array.sort(function (a, b) {
  let x = a.id.toLowerCase();
  let y = b.id.toLowerCase();
  if (x < y) {return 1;}
  if (x > y) {return -1;}
  return 0;
});`,mt=a(),P=e("blockquote"),P.innerHTML=`<p class="indent">In the beginning the Universe was created. 
      This has made a lot of people very angry 
      and has been widely regarded as a bad move.</p> 
    <cite>Douglas Adams</cite>`,F=a(),Q=e("hr"),$=a(),_=e("section"),_.innerHTML=`<h2>Lists</h2> 
  <ol><li>Item 1</li> 
    <li>Item 2</li> 
    <li>Item 3</li></ol> 
  <ul><li>List Item</li> 
    <li>List Item with sub points
      <ul><li>List Item</li> 
        <li>List Item</li></ul></li> 
    <li>List Item with text that wraps to the next line if the width is small enough</li> 
    <li>Last List Item
      <ol><li>Item 1</li> 
        <li>Item 2</li> 
        <li>Item 3</li></ol></li></ul> 
  <dl><dt>Term</dt><dd>Detail 1</dd><dd>Detail 2</dd><dt>Term</dt><dd>Detail 1 with text that wraps to the next line if the width is small enough</dd><dd>Detail 2</dd></dl>`,j=a(),z=e("hr"),G=a(),H=e("section"),H.innerHTML=`<h2>Tables</h2> 
  <div style="overflow-x: auto"><table><thead><tr><th>Heading 1</th> 
          <th>Heading 2</th> 
          <th>Heading 3</th></tr></thead> 
      <tbody><tr><td>Row 1, Data 1</td> 
          <td>Row 1, Data 2</td> 
          <td>Row 1, Data 3</td></tr> 
        <tr><td>Row 2, Data 1</td> 
          <td>Row 2, Data 2</td> 
          <td>Row 2, Data 3</td></tr> 
        <tr><td>Row 3, Data 1</td> 
          <td>Row 3, Data 2</td> 
          <td>Row 3, Data 3</td></tr></tbody></table></div> 
  <div style="overflow-x: auto"><table style="width: 100%;"><thead><tr><th>Symbol</th><th>Dec</th><th>Hex</th><th>Binary</th><th>Description</th></tr></thead> 
      <tbody><tr><td>A</td><td>65</td><td>41</td><td>1000001</td><td>Uppercase A</td></tr> 
        <tr><td>B</td><td>66</td><td>42</td><td>1000010</td><td>Uppercase B</td></tr> 
        <tr><td>C</td><td>67</td><td>43</td><td>1000011</td><td>Uppercase C</td></tr> 
        <tr><td>D</td><td>68</td><td>44</td><td>1000100</td><td>Uppercase D</td></tr> 
        <tr><td>E</td><td>69</td><td>45</td><td>1000101</td><td>Uppercase E</td></tr> 
        <tr><td>F</td><td>70</td><td>46</td><td>1000110</td><td>Uppercase F</td></tr></tbody></table></div>`,J=a(),K=e("hr"),V=a(),L=e("section"),L.innerHTML=`<h2>Buttons</h2> 
  <div class="flex svelte-ft0h96"><button>Button Tag</button> 
    <button disabled="">Button disabled</button> 
    <input type="button" value="Button Type"/> 
    <input type="reset" value="Reset Type"/> 
    <input type="submit" value="Submit Type"/> 
    <input type="file"/></div>`,W=a(),X=e("hr"),Y=a(),o=e("section"),Z=e("h2"),Z.textContent="Inputs",ct=a(),g=e("div"),g.innerHTML=`<label>Text Type <br/> 
      <input type="text" placeholder="placeholder..."/></label>`,xt=a(),tt=e("div"),tt.innerHTML=`<label>Password Type <br/> 
      <input type="password" placeholder="password..."/></label>`,yt=a(),et=e("div"),et.innerHTML=`<label>Number Type <br/> 
      <input type="number" placeholder="420..."/></label>`,Tt=a(),lt=e("div"),lt.innerHTML=`<label>Date <br/> 
      <input type="date"/></label>`,_t=a(),it=e("div"),it.innerHTML=`<label>Time <br/> 
      <input type="time"/></label>`,Ht=a(),dt=e("div"),u=e("label"),Lt=Ot("Select "),wt=e("br"),Dt=a(),k=e("select"),b=e("optgroup"),v=e("option"),v.textContent="Option 1",h=e("option"),h.textContent="Option 2",f=e("option"),f.textContent="Option 3",m=e("optgroup"),c=e("option"),c.textContent="Option 1",x=e("option"),x.textContent="Option 2 with extra text",y=e("option"),y.textContent="Option 3",kt=a(),st=e("div"),st.innerHTML=`<label>Textarea <br/> 
      <textarea>Test</textarea></label>`,at=a(),ot=e("hr"),nt=a(),w=e("section"),w.innerHTML=`<h2>Checkbox / Radio</h2> 
  <div><input type="checkbox" name="chxSet1" id="chx1"/> 
    <label for="chx1">Not Checked</label></div> 
  <div><input type="checkbox" name="chxSet1" id="chx2" checked=""/> 
    <label for="chx2">Checked</label></div> 
  <div><input type="checkbox" name="chxSet1" id="chx3" disabled=""/> 
    <label for="chx3">Disabled</label></div> 
  <div><input type="checkbox" name="chxSet1" id="chx4" disabled="" checked=""/> 
    <label for="chx4">Disabled and Checked</label></div> 
  <br/> 
  <div><input type="radio" name="radioSet1" id="rad1"/> 
    <label for="rad1">Not Checked</label></div> 
  <div><input type="radio" name="radioSet1" id="rad2" checked=""/> 
    <label for="rad2">Checked</label></div> 
  <div><input type="radio" name="radioSet2" id="rad3" disabled=""/> 
    <label for="rad3">Disabled</label></div> 
  <div><input type="radio" name="radioSet2" id="rad4" disabled="" checked=""/> 
    <label for="rad4">Disabled and Checked</label></div>`,pt=a(),rt=e("hr"),ut=a(),D=e("section"),D.innerHTML=`<h2>Details</h2> 
  <details><summary>Details</summary>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique in 
    laboriosam incidunt at explicabo reprehenderit dolores. Eveniet, 
    exercitationem sequi quis explicabo iure laudantium veritatis, aliquid 
    odio, molestiae nulla assumenda pariatur.</details>`,bt=a(),C=e("footer"),C.innerHTML='<section class="width-sm center svelte-ft0h96"><p>7-28-2022</p></section>',p(r,"class","svelte-ft0h96"),p(T,"class","svelte-ft0h96"),p(n,"class","svelte-ft0h96"),p(_,"class","svelte-ft0h96"),p(H,"class","svelte-ft0h96"),p(L,"class","svelte-ft0h96"),v.__value="Option 1",v.value=v.__value,h.__value="Option 2",h.value=h.__value,f.__value="Option 3",f.value=f.__value,p(b,"label","Optgroup 1"),c.__value="Option 1",c.value=c.__value,x.__value="Option 2 with extra text",x.value=x.__value,y.__value="Option 3",y.value=y.__value,p(m,"label","Optgroup 2"),p(o,"class","svelte-ft0h96"),p(w,"class","svelte-ft0h96"),p(D,"class","svelte-ft0h96")},m(t,i){d(t,r,i),d(t,S,i),d(t,I,i),d(t,M,i),d(t,T,i),d(t,O,i),d(t,B,i),d(t,q,i),d(t,n,i),l(n,R),l(n,ht),l(n,U),l(n,ft),l(n,A),l(A,E),l(E,N),l(n,mt),l(n,P),d(t,F,i),d(t,Q,i),d(t,$,i),d(t,_,i),d(t,j,i),d(t,z,i),d(t,G,i),d(t,H,i),d(t,J,i),d(t,K,i),d(t,V,i),d(t,L,i),d(t,W,i),d(t,X,i),d(t,Y,i),d(t,o,i),l(o,Z),l(o,ct),l(o,g),l(o,xt),l(o,tt),l(o,yt),l(o,et),l(o,Tt),l(o,lt),l(o,_t),l(o,it),l(o,Ht),l(o,dt),l(dt,u),l(u,Lt),l(u,wt),l(u,Dt),l(u,k),l(k,b),l(b,v),l(b,h),l(b,f),l(k,m),l(m,c),l(m,x),l(m,y),l(o,kt),l(o,st),d(t,at,i),d(t,ot,i),d(t,nt,i),d(t,w,i),d(t,pt,i),d(t,rt,i),d(t,ut,i),d(t,D,i),d(t,bt,i),d(t,C,i)},p:vt,i:vt,o:vt,d(t){t&&s(r),t&&s(S),t&&s(I),t&&s(M),t&&s(T),t&&s(O),t&&s(B),t&&s(q),t&&s(n),t&&s(F),t&&s(Q),t&&s($),t&&s(_),t&&s(j),t&&s(z),t&&s(G),t&&s(H),t&&s(J),t&&s(K),t&&s(V),t&&s(L),t&&s(W),t&&s(X),t&&s(Y),t&&s(o),t&&s(at),t&&s(ot),t&&s(nt),t&&s(w),t&&s(pt),t&&s(rt),t&&s(ut),t&&s(D),t&&s(bt),t&&s(C)}}}class Rt extends St{constructor(r){super(),It(this,r,null,Bt,Mt,{})}}export{Rt as default};
