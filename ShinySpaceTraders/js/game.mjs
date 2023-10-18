import t from"./spaceTraders.mjs";const{t:i}=window.Matter,s={};function o(o){s.i=new t((function(...t){return window.fetch(...t)})),s.o=new n,s.l=new r;const l=document.getElementById("canvas"),h=l.getContext("2d"),f=l.parentElement.getBoundingClientRect();l.width=f.width,l.height=f.height,l.h=!1,l.u=null,l.p=[],l.m={},l.addEventListener("mousedown",w),l.addEventListener("mouseup",m),l.addEventListener("mousemove",y),l.addEventListener("wheel",C),l.addEventListener("contextmenu",d);new ResizeObserver((t=>{for(let i of t)i.target==l.parentElement&&u(l)})).observe(l.parentElement),window.addEventListener("keypress",p);let S=this.document.getElementById("starColorSelector");S.querySelectorAll(".button").forEach((t=>t.addEventListener("click",c))),a(S);let g=this.document.getElementById("authKeyInput");if(window.localStorage){const t=e(window.localStorage.getItem("authKey"));t&&(s.i.S=t,g.value=t)}g.addEventListener("input",(t=>{const i=e(t.currentTarget.value);i&&(s.i.S=i,window.localStorage.setItem("authKey",i))})),s.o.C().then((()=>{throw"Game state exited."})),requestAnimationFrame((()=>L(h)));const N=P(o);O().then((t=>{const s=new B(t.map((t=>new $(t))),l.m),o=i.create(150,150);s.T(o,l),T(l,s),y(N)}))}window.addEventListener("load",o);class n{constructor(){this.L=[]}async C(){for(;;)await this.update(),await new Promise((t=>setTimeout(t,5e3)))}async update(){const t=await s.i.N();this.L=t,s.l.A(t)}}function e(t){function i(t){const i=t.replace(/-/g,"+").replace(/_/g,"/");return i+"==".slice(0,(3-i.length%4)%3)}try{if(!t)throw"No auth token";const s=function(t){const s=t.split("."),o={O:JSON.parse(atob(i(s[0]))),R:JSON.parse(atob(i(s[1]))),M:i(s[2])};if((o.M?.length??0)<=0)throw"Invalid JWT - no signature";return o}(t),o=s.R.identifier;if((o?.length??0)<=0)throw"Invalid JWT - no identifier";if("agent-token"!=s.R.sub)throw"Invalid JWT - not an agent token";return console.log("Hello, "+o+"!"),t}catch(t){console.log("Hello, anonymous!")}return null}function l(t){return(t=t??0).toFixed(0)+"s"}class r{constructor(){this.$=window.document.getElementById("shipListShipNameTemplate"),this.I=window.document.getElementById("shipListShipCargoTemplate"),this.U=window.document.getElementById("shipListShipFuelTemplate"),this.k=window.document.getElementById("shipListShipCooldownTemplate"),this.B=window.document.getElementById("shipList")}A(t){let i=[...this.B.children].filter((t=>null!=t.F));for(const t of i)t.P=!0;for(const s of t){let t=i.filter((t=>t.F==s.W));t.forEach((t=>t.P=!1)),t.length<=0&&(t=this.D(s)),this.H(s,t)}for(const t of i.filter((t=>t.P)))this.B.removeChild(t)}D(t){let i=window.document.importNode(shipListShipNameTemplate.content,!0);this.B.appendChild(i),i=this.B.lastElementChild,i.F=t.W;let s=window.document.importNode(shipListShipCargoTemplate.content,!0);this.B.appendChild(s),s=this.B.lastElementChild,s.F=t.W;let o=window.document.importNode(shipListShipFuelTemplate.content,!0);this.B.appendChild(o),o=this.B.lastElementChild,o.F=t.W;let n=window.document.importNode(shipListShipCooldownTemplate.content,!0);return this.B.appendChild(n),n=this.B.lastElementChild,n.F=t.W,[i,s,o,n]}H(t,i){i.forEach((i=>{let s;s=i.querySelector(".shipListShipName"),s&&(s.innerText=t.W),s=i.querySelector(".shipListShipCargoUnits"),s&&(s.innerText=t.v.units),s=i.querySelector(".shipListShipCargoCapacity"),s&&(s.innerText=t.v.J),s=i.querySelector(".shipListShipFuelCurrent"),s&&(s.innerText=t.G._),s=i.querySelector(".shipListShipFuelCapacity"),s&&(s.innerText=t.G.J),s=i.querySelector(".shipListShipCooldownRemaining"),s&&(s.innerText=l(t.Y.K)),s=i.querySelector(".shipListShipCooldownTotal"),s&&(s.innerText=l(t.Y.j))}))}}function h(){let t=this.document.getElementById("shipListShipNameTemplate"),i=this.document.getElementById("shipListShipCargoTemplate"),s=this.document.getElementById("shipListShipFuelTemplate"),o=this.document.getElementById("shipListShipCooldownTemplate"),n=this.document.getElementById("shipList");for(let e=0;e<15;e++){let l=this.document.importNode(t.content,!0);l.querySelector(".shipListShipName").innerText=`Ship ${e}`,n.appendChild(l);let r=this.document.importNode(i.content,!0);r.querySelector(".shipListShipCargoUnits").innerText="0",r.querySelector(".shipListShipCargoCapacity").innerText="100",n.appendChild(r);let h=this.document.importNode(s.content,!0);h.querySelector(".shipListShipFuelCurrent").innerText="100",h.querySelector(".shipListShipFuelCapacity").innerText="9999",n.appendChild(h);let a=this.document.importNode(o.content,!0);a.querySelector(".shipListShipCooldownRemaining").innerText="0",a.querySelector(".shipListShipCooldownTotal").innerText="0",n.appendChild(a)}}function a(t){if(!window.localStorage)return;let i=window.localStorage.getItem("starColor");i||(i="type"),Array.from(t.querySelectorAll(".button")).find((t=>t.innerText==i)).click()}function c(t){canvas.m.starColor=t.currentTarget.innerText,t.currentTarget.parentNode.querySelectorAll(".button").forEach((t=>t.classList.remove("selected"))),t.currentTarget.classList.add("selected"),window.localStorage&&window.localStorage.setItem("starColor",t.currentTarget.innerText)}function u(t){const s=t.parentElement.getBoundingClientRect();if(t.width=s.width,t.height=s.height,null==t.V)return;const o=t.V.X(i.create(0,0)),n=t.V.X(i.create(0,0));t.V.offset=i.add(t.V.offset,i.sub(n,o))}function p(t){if("INPUT"!=document.activeElement.tagName&&"TEXTAREA"!=document.activeElement.tagName&&"KeyS"==t.code){const t=this.document.querySelector(".mainControlSide");t.classList.contains("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}}function f(t){const i=t.currentTarget;i.V&&i.V.click(t)}async function d(t){t.preventDefault();const i=t.currentTarget;i.V&&i.V.q(t)}function w(t){const i=t.currentTarget,s=S(t);0===t.button&&(i.h=Date.now(),i.u=s,i.Z=!1)}function m(t){const i=t.currentTarget;0===t.button&&(Date.now()-i.h<200&&f(t),i.h=0,i.u=null)}function S(t){if(null==t.clientX)return i.create(t.clientX,t.clientY);const s=t.currentTarget.getBoundingClientRect();return i.create(t.clientX-s.left,t.clientY-s.top)}function C(t){const s=t.currentTarget,o=S(t);if(null!=s.V){const n=s.V.X(o);for(let i=0;i<Math.abs(t.deltaY);i++)t.deltaY<0?s.V.scale*=1.001:s.V.scale*=.999;const e=s.V.X(o);s.V.offset=i.sub(s.V.offset,i.sub(e,n))}}function y(t){const s=S(t),o=t.currentTarget;if(o.h){if(null!=o.V){const t=o.V.X(o.u),n=o.V.X(s);o.V.offset=i.sub(o.V.offset,i.sub(n,t))}o.u=s,o.Z=!0}if(null!=o.V){let t=Number.MAX_VALUE,n=null;for(const e of o.V.tt){const l=i.it(i.sub(s,e.st(o.V)));if(l<t){const i=e.ot();l<i*i&&(t=l,n=e)}}null!=n?(document.getElementById("statusBar").innerText=n.nt(),o.et=n):(document.getElementById("statusBar").innerText="",o.et=null)}}function T(t,i){t.V&&t.p.push(t.V),t.V=i}function g(t){0!=t.p.length&&(t.V=t.p.pop())}function L(t){requestAnimationFrame((()=>L(t))),null!=t.canvas.V?t.canvas.V.lt(t):t.clearRect(0,0,t.canvas.width,t.canvas.height)}function N(t){const s=t.canvas.width,o=t.canvas.height;A(t,i.create(0,0)),A(t,i.create(s,0)),A(t,i.create(0,o)),A(t,i.create(s,o)),A(t,i.create(s/2,o/2)),A(t,i.create(s-1,o/2)),A(t,i.create(s/2,o-1))}function A(t,i){i.x+=.5,i.y+=.5,t.beginPath(),t.arc(i.x,i.y,13,0,2*Math.PI),t.moveTo(i.x-20,i.y),t.lineTo(i.x+20,i.y),t.moveTo(i.x+20,i.y),t.lineTo(i.x-20,i.y),t.moveTo(i.x,i.y-20),t.lineTo(i.x,i.y+20),t.moveTo(i.x,i.y+20),t.lineTo(i.x,i.y-20),t.closePath(),t.strokeWidth=1,t.strokeStyle=W(255,0,255),t.stroke()}const b={rt:{ht:{ct:W(0,0,128)},ut:{ct:W(64,0,0)},ft:{ct:W(128,64,0)},dt:{ct:W(192,192,192)},wt:{St:W(255,255,255),ct:W(0,0,0)},Ct:{ct:W(128,0,128)},yt:{ct:W(128,128,255)},Tt:{ct:W(255,128,128)},gt:{ct:W(0,64,0)}},Lt:{Nt:{ct:W(128,0,0)},At:{ct:W(0,128,0)},bt:{ct:W(0,0,128)},Ot:{ct:W(128,128,0)},Rt:{ct:W(128,0,128)},Mt:{ct:W(0,128,128)},$t:{ct:W(64,32,32)},It:{ct:W(32,64,32)},Et:{ct:W(32,32,64)},Ut:{ct:W(64,64,32)},kt:{ct:W(64,32,64)},Bt:{ct:W(32,64,64)}}};async function O(){const t=await fetch("data/systems.json.gz");if(404==t.status)throw"Could not load systems.";const i=new DecompressionStream("gzip"),s=t.body.pipeThrough(i).getReader(),o=new TextDecoder;let n="",e=!1;for(;!e;){const{value:t,done:i}=await s.read();t&&(n+=o.decode(t)),e=i}return JSON.parse(n)}async function R(t){const i=await s.i.Ft(`systems/${t}`);if(200!=i.status)throw"Could not load system data: "+await i.text();const o=(await i.json()).data,n=await s.i.xt(`systems/${o.W}/waypoints`);if(200!=i.status)throw`Could not load ${t} data: `+await i.text();o.Pt=n.Wt;let e={[o.W]:o};return o.Pt.forEach((t=>e[t.W]=t)),Object.values(e).forEach((t=>t.children=[])),o.Pt.forEach((t=>{let i=t.Dt;null==i&&(i=o.W),t.parent=e[i],e[i].children.push(t)})),o}class M{Ht(){throw"Not implemented"}st(t){throw"Not implemented"}lt(t,i,s){throw"Not implemented"}ot(){throw"Not implemented"}nt(){throw"Not implemented"}}class $ extends M{static vt=4;constructor(t,i){super(),this.system=t,this.Jt=i}Ht(){return this.Jt?i.create(0,0):i.create(this.system.x,this.system.y)}st(t){return this.Jt?t._t(i.create(0,0)):t._t(i.create(this.system.x,this.system.y))}ot(){return 4*$.vt}nt(){return`${this.system.W} ${this.system.type}`}lt(t,i,s){if(0==i)return!0;const o=this.st(s);t.beginPath(),t.arc(o.x,o.y,$.vt,0,2*Math.PI),t.closePath(),t.strokeWidth=2;const n=s.Gt("starColor");"type"==n?this.Kt(t):"faction"==n?this.Yt(t):"waypoints"==n?this.jt(t):"jumpgates"==n&&this.zt(t),t.stroke(),t.fill()}zt(t){t.strokeStyle=D(255,255,255,.5);const i=this.system.Pt.some((t=>"JUMP_GATE"==t.type));t.fillStyle=i?W(48,128,48):W(0,0,0)}jt(t){t.strokeStyle=D(255,255,255,.5),t.fillStyle=W(0,0,0);let i=this.system.Pt?.length??0;if(i<=0)return;i=Math.min(i,10);const s=i/10*90;t.fillStyle=`hsl(220, ${s}%, ${.7*s}%)`}Kt(t){t.strokeStyle=D(255,255,255,.1);const i=b.rt[this.system.type];i?(t.fillStyle=i.ct,i.St&&(t.strokeStyle=i.St)):(t.fillStyle=W(255,255,255),console.log("Unknown system type: "+system.type))}Yt(t){if(t.strokeStyle=D(255,255,255,1),this.system.Lt?.length>1)throw"multiple factions: "+JSON.stringify(this.system);const i=this.system.Lt[0]?.W??null;if(i){const s=b.Lt[i];s?t.fillStyle=s.ct:(t.fillStyle=W(255,255,255),console.log("Unknown system faction: "+i))}else t.strokeStyle=D(255,255,255,.2),t.fillStyle=D(0,0,0,0)}}class I extends M{static vt=6;constructor(t){super(),this.Vt=t}Ht(){return i.create(this.Vt.x,this.Vt.y)}st(t){let s=this.Vt;for(;null!=s.parent;)s=s.parent;if(this.Vt.parent==s)return t._t(i.create(this.Vt.x,this.Vt.y));if(null!=this.Vt.parent&&this.Vt.parent!=s){const s=t._t(i.create(this.Vt.parent.x,this.Vt.parent.y)),o=this.Vt.parent.children.indexOf(this.Vt),n=-o*(2*Math.PI/8.5),e=4*I.vt+o*I.vt*1,l=i.Xt(i.create(Math.cos(n),Math.sin(n)),e);return i.add(s,l)}return t._t(i.create(this.Vt.x,this.Vt.y))}ot(){return 4*I.vt}nt(){return`${this.Vt.W} ${this.Vt.type} [${this.Vt.qt.map((t=>t.name)).join(", ")}]`}lt(t,s,o){const n=this.st(o);let e=this.Vt;for(;null!=e.parent;)e=e.parent;if(0==s&&null!=this.Vt.parent){let s;t.beginPath(),s=this.Vt.parent==e?o._t(i.create(0,0)):o._t(i.create(this.Vt.parent.x,this.Vt.parent.y)),t.arc(s.x,s.y,i.Qt(i.sub(n,s)),0,2*Math.PI),t.strokeWidth=1,t.strokeStyle=W(64,64,64),t.closePath(),this.Vt.parent==e&&t.setLineDash([10,5]),t.stroke(),t.setLineDash([])}if(0==s)return!0;t.beginPath(),t.arc(n.x,n.y,I.vt,0,2*Math.PI),t.closePath(),t.strokeWidth=2,t.strokeStyle=W(255,255,255),this.Vt.type,t.fillStyle=W(0,0,255),t.stroke(),t.fill()}}async function E(t){await new Promise((i=>setTimeout(i,t)))}class U{constructor(t,s){this.tt=t,this.options={global:s},this.scale=1,this.offset=i.create(0,0),this.Zt()}Zt(){this.ti=i.create(Number.MAX_VALUE,Number.MAX_VALUE),this.ii=i.create(Number.MIN_VALUE,Number.MIN_VALUE);for(const t of this.tt){const i=t.Ht();this.ti.x=Math.min(this.ti.x,i.x),this.ii.x=Math.max(this.ii.x,i.x),this.ti.y=Math.min(this.ti.y,i.y),this.ii.y=Math.max(this.ii.y,i.y)}this.ti.x==Number.MAX_VALUE&&(this.ti.x=-1),this.ti.y==Number.MAX_VALUE&&(this.ti.y=-1),this.ii.x==Number.MIN_VALUE&&(this.ii.x=1),this.ii.y==Number.MIN_VALUE&&(this.ii.y=1)}T(t,s){this.offset=i.create(0,0),this.scale=1;const o=i.create(0,0),n=i.create(s.width,s.height),e=i.add(o,t),l=i.sub(n,t),r=i.sub(l,e),h=i.sub(this.ii,this.ti),a=r.x/h.x,c=r.y/h.y;this.scale=Math.min(a,c);const u=i.add(e,i.div(i.sub(l,e),2)),p=i.add(this.ti,i.div(i.sub(this.ii,this.ti),2));this.offset=i.sub(p,this.X(u))}X(t){return t=i.div(t,this.scale),t=i.add(t,this.offset)}_t(t){return t=i.sub(t,this.offset),t=i.Xt(t,this.scale)}lt(t){t.clearRect(0,0,t.canvas.width,t.canvas.height);let i=0,s=this.tt??[];do{let o=s;s=[];for(const n of o)n.lt(t,i,this)&&s.push(n);i++}while(s.length>0)}Gt(t){return this.options[t]??this.options.global[t]}click(t){}q(t){}}class k extends U{q(t){g(t.currentTarget),y(t)}}class B extends U{click(t){const s=t.currentTarget;if(null==s.et)return;s.si=s.si??{};const o=s.si[s.et.system.W];if(o)return T(s,o),void y(t);const n=P(t);R(s.et.system.W).then((t=>{const o=[];o.push(new $(t,!0)),function t(i){i.children.forEach((i=>{o.push(new I(i)),t(i)}))}(t);const e=new k(o,s.m),l=i.create(150,150);e.T(l,s),s.si[t.W]=e,T(s,e),y(n)}))}}async function F(t){const i=(new TextEncoder).encode(t),s=await crypto.subtle.digest("SHA-256",i);return Array.from(new Uint8Array(s))}function x(t){const i=t.slice(0,4);let s=0;for(let t=0;t<i.length;t++)s=s<<8|i[t];return s}function P(t){return{currentTarget:t.currentTarget,button:t.button,clientX:t.clientX,clientY:t.clientY,deltaX:t.deltaX,deltaY:t.deltaY}}function W(t,i,s){return`rgb(${t},${i},${s})`}function D(t,i,s,o){return`rgb(${t},${i},${s},${o})`}