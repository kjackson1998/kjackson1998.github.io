const t=window.Matter.Vector;function e(t){function e(t){const e=t.replace(/-/g,"+").replace(/_/g,"/");return e+"==".slice(0,(3-e.length%4)%3)}try{if(!t)throw"No auth token";const o=function(t){const o=t.split("."),s={header:JSON.parse(atob(e(o[0]))),payload:JSON.parse(atob(e(o[1]))),sig:e(o[2])};if((s.sig?.length??0)<=0)throw"Invalid JWT - no signature";return s}(t),s=o.payload.identifier;if((s?.length??0)<=0)throw"Invalid JWT - no identifier";if("agent-token"!=o.payload.sub)throw"Invalid JWT - not an agent token";return console.log("Hello, "+s+"!"),t}catch(t){console.log(t)}return null}function o(t){return(t=t??0).toFixed(0)+"s"}function s(t){canvas.gameOptions.starColor=t.currentTarget.innerText,t.currentTarget.parentNode.querySelectorAll(".button").forEach((t=>t.classList.remove("selected"))),t.currentTarget.classList.add("selected"),window.localStorage&&window.localStorage.setItem("starColor",t.currentTarget.innerText)}function n(e){const o=e.parentElement.getBoundingClientRect();if(e.width=o.width,e.height=o.height,null==e.world)return;const s=e.world.screenToWorld(t.create(0,0)),n=e.world.screenToWorld(t.create(0,0));e.world.offset=t.add(e.world.offset,t.sub(n,s))}function r(t){if("KeyS"==t.code){const t=this.document.querySelector(".mainControlSide");t.classList.contains("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}}async function l(t){t.preventDefault();!function(t){if(0==t.worldStack.length)return;t.world=t.worldStack.pop()}(t.currentTarget),u(t)}function a(t){const e=t.currentTarget,o=d(t);0===t.button&&(e.isMouseDown=Date.now(),e.lastMouse=o,e.mouseMoved=!1)}function c(t){const e=t.currentTarget;0===t.button&&(Date.now()-e.isMouseDown<200&&function(t){const e=t.currentTarget;null!=e.hoverRenderable&&e.world&&e.world.click(t)}(t),e.isMouseDown=0,e.lastMouse=null)}function d(e){if(null==e.clientX)return t.create(e.clientX,e.clientY);const o=e.currentTarget.getBoundingClientRect();return t.create(e.clientX-o.left,e.clientY-o.top)}function h(e){const o=e.currentTarget,s=d(e);if(null!=o.world){const n=o.world.screenToWorld(s);for(i=0;i<Math.abs(e.deltaY);i++)e.deltaY<0?o.world.scale*=1.001:o.world.scale*=.999;const r=o.world.screenToWorld(s);o.world.offset=t.sub(o.world.offset,t.sub(r,n))}}function u(e){const o=d(e),s=e.currentTarget;if(s.isMouseDown){if(null!=s.world){const e=s.world.screenToWorld(s.lastMouse),n=s.world.screenToWorld(o);s.world.offset=t.sub(s.world.offset,t.sub(n,e))}s.lastMouse=o,s.mouseMoved=!0}if(null!=s.world){let e=Number.MAX_VALUE,n=null;for(const r of s.world.renderables){const i=t.magnitudeSquared(t.sub(o,r.getScreenPos(s.world)));if(i<e){const t=r.getScreenHitRadius();i<t*t&&(e=i,n=r)}}null!=n?(document.getElementById("statusBar").innerText=n.getTooltipText(),s.hoverRenderable=n):(document.getElementById("statusBar").innerText="",s.hoverRenderable=null)}}function y(t,e){t.world&&t.worldStack.push(t.world),t.world=e}function p(t){requestAnimationFrame((()=>p(t))),null!=t.canvas.world?t.canvas.world.render(t):t.clearRect(0,0,t.canvas.width,t.canvas.height)}window.addEventListener("load",(function(i){const d=document.getElementById("canvas"),m=d.getContext("2d"),g=d.parentElement.getBoundingClientRect();d.width=g.width,d.height=g.height,d.isMouseDown=!1,d.lastMouse=null,d.worldStack=[],d.gameOptions={},d.addEventListener("mousedown",a),d.addEventListener("mouseup",c),d.addEventListener("mousemove",u),d.addEventListener("wheel",h),d.addEventListener("contextmenu",l);new ResizeObserver((t=>{for(let e of t)e.target==d.parentElement&&n(d)})).observe(d.parentElement),window.addEventListener("keypress",r);let S=this.document.getElementById("starColorSelector");S.querySelectorAll(".button").forEach((t=>t.addEventListener("click",s))),function(t){if(!window.localStorage)return;let e=window.localStorage.getItem("starColor");e||(e="type");Array.from(t.querySelectorAll(".button")).find((t=>t.innerText==e)).click()}(S);let T=this.document.getElementById("authKeyInput");if(window.localStorage){const t=e(window.localStorage.getItem("authKey"));t&&(w.authKey=t,T.value=t)}T.addEventListener("input",(t=>{const o=e(t.currentTarget.value);o&&(w.authKey=o,window.localStorage.setItem("authKey",o))})),w.fetchMyShips().then((t=>{t.forEach((t=>function(t){let e=this.document.getElementById("shipListShipNameTemplate"),s=this.document.getElementById("shipListShipCargoTemplate"),n=this.document.getElementById("shipListShipFuelTemplate"),r=this.document.getElementById("shipListShipCooldownTemplate"),i=this.document.getElementById("shipList"),l=this.document.importNode(e.content,!0);l.querySelector(".shipListShipName").innerText=t.symbol,i.appendChild(l);let a=this.document.importNode(s.content,!0);a.querySelector(".shipListShipCargoUnits").innerText=t.cargo.units,a.querySelector(".shipListShipCargoCapacity").innerText=t.cargo.capacity,i.appendChild(a);let c=this.document.importNode(n.content,!0);c.querySelector(".shipListShipFuelCurrent").innerText=t.fuel.current,c.querySelector(".shipListShipFuelCapacity").innerText=t.fuel.capacity,i.appendChild(c);let d=this.document.importNode(r.content,!0);d.querySelector(".shipListShipCooldownRemaining").innerText=o(t.cooldown.remainingSeconds),d.querySelector(".shipListShipCooldownTotal").innerText=o(t.cooldown.totalSeconds),i.appendChild(d)}(t)))})),requestAnimationFrame((()=>p(m)));const M=x(i);w.fetchGalaxy().then((e=>{const o=new b(e.map((t=>new f(t))),d.gameOptions),s=t.create(150,150);o.setFullView(s,d),y(d,o),u(M)}))}));class w{static constants={systemTypes:{BLUE_STAR:{fillColor:M(0,0,128)},RED_STAR:{fillColor:M(64,0,0)},ORANGE_STAR:{fillColor:M(128,64,0)},WHITE_DWARF:{fillColor:M(192,192,192)},BLACK_HOLE:{strokeColor:M(255,255,255),fillColor:M(0,0,0)},UNSTABLE:{fillColor:M(128,0,128)},NEUTRON_STAR:{fillColor:M(128,128,255)},HYPERGIANT:{fillColor:M(255,128,128)},YOUNG_STAR:{fillColor:M(0,64,0)}},factions:{QUANTUM:{fillColor:M(64,0,0)},DOMINION:{fillColor:M(255,0,0)},GALACTIC:{fillColor:M(0,64,0)},COBALT:{fillColor:M(0,192,0)},ECHO:{fillColor:M(0,255,0)},VOID:{fillColor:M(0,0,64)},AEGIS:{fillColor:M(0,0,192)},COSMIC:{fillColor:M(64,64,0)},OBSIDIAN:{fillColor:M(192,192,0)}}};static baseUrl="https://api.spacetraders.io/v2/";static authKey=null;static fixBase(t){try{return new URL(t),t}catch(e){return w.baseUrl+t}}static async callApiPaged(t,e,o){t=this.fixBase(t);const s=[];let n,r,i=1;do{if((t=new URL(t)).searchParams.set("limit",20),t.searchParams.set("page",i),t=t.toString(),r=await w.callApi(t,e,o),200!=r.status)return r.pagedData=s,r;n=await r.json(),s.push(...n.data),i++}while(n.meta.page<n.meta.total/n.meta.limit);return r.pagedData=s,r}static async callApi(t,e,o){t=this.fixBase(t);const s={Accept:"application/json"};w.authKey&&(s.Authorization="Bearer "+w.authKey);const n={headers:s};return e&&(n.method=e),o&&(n.body=JSON.stringify(o)),await fetch(t,n)}static async fetchGalaxy(){const t=await fetch("data/systems.json.gz");if(404==t.status)throw"Could not load systems.";const e=new DecompressionStream("gzip"),o=t.body.pipeThrough(e).getReader(),s=new TextDecoder;let n="",r=!1;for(;!r;){const{value:t,done:e}=await o.read();t&&(n+=s.decode(t)),r=e}return JSON.parse(n)}static async fetchMyShips(){const t=await w.callApiPaged("my/ships");if(200!=t.status)throw"Could not load my ships: "+await t.text();return t.pagedData}static async fetchSystem(t){const e=await w.callApi(`systems/${t}`);if(200!=e.status)throw"Could not load system data: "+await e.text();const o=(await e.json()).data,s=await w.callApiPaged(`systems/${o.symbol}/waypoints`);if(200!=e.status)throw`Could not load ${t} data: `+await e.text();o.waypoints=s.pagedData;let n={[o.symbol]:o};return o.waypoints.forEach((t=>n[t.symbol]=t)),Object.values(n).forEach((t=>t.children=[])),o.waypoints.forEach((t=>{let e=t.orbits;null==e&&(e=o.symbol),t.parent=n[e],n[e].children.push(t)})),o}}class m{getAbsoluteWorldPos(){throw"Not implemented"}getScreenPos(t){throw"Not implemented"}render(t,e,o){throw"Not implemented"}getScreenHitRadius(){throw"Not implemented"}getTooltipText(){throw"Not implemented"}}class f extends m{static radius=4;constructor(t,e){super(),this.system=t,this.asOrigin=e}getAbsoluteWorldPos(){return this.asOrigin?t.create(0,0):t.create(this.system.x,this.system.y)}getScreenPos(e){return this.asOrigin?e.worldToScreen(t.create(0,0)):e.worldToScreen(t.create(this.system.x,this.system.y))}getScreenHitRadius(){return 4*f.radius}getTooltipText(){return`${this.system.symbol} ${this.system.type}`}render(t,e,o){if(0==e)return!0;const s=this.getScreenPos(o);t.beginPath(),t.arc(s.x,s.y,f.radius,0,2*Math.PI),t.closePath(),t.strokeWidth=2;const n=o.getOption("starColor");"type"==n?this.setStyleBySystemType(t):"faction"==n?this.setStyleBySystemFaction(t):"waypoints"==n?this.setStyleBySystemWaypoints(t):"jumpgates"==n&&this.setStyleBySystemJumpgates(t),t.stroke(),t.fill()}setStyleBySystemJumpgates(t){t.strokeStyle=C(255,255,255,.5);const e=this.system.waypoints.some((t=>"JUMP_GATE"==t.type));t.fillStyle=e?M(48,128,48):M(0,0,0)}setStyleBySystemWaypoints(t){t.strokeStyle=C(255,255,255,.5);const e=this.system.waypoints?.length??0;t.fillStyle=e<=0?M(0,0,0):e<=3?M(16,32,16):e<=9?M(32,64,32):M(48,128,48)}setStyleBySystemType(t){t.strokeStyle=C(255,255,255,.1);const e=w.constants.systemTypes[this.system.type];e?(t.fillStyle=e.fillColor,e.strokeColor&&(t.strokeStyle=e.strokeColor)):(t.fillStyle=M(255,255,255),console.log("Unknown system type: "+system.type))}setStyleBySystemFaction(t){if(t.strokeStyle=C(255,255,255,1),this.system.factions?.length>1)throw"multiple factions: "+JSON.stringify(this.system);const e=this.system.factions[0]?.symbol??null;if(e){const o=w.constants.factions[e];o?t.fillStyle=o.fillColor:(t.fillStyle=M(255,255,255),console.log("Unknown system faction: "+e))}else t.strokeStyle=C(255,255,255,.2),t.fillStyle=C(0,0,0,0)}}class g extends m{static radius=6;constructor(t){super(),this.waypoint=t}getAbsoluteWorldPos(){return t.create(this.waypoint.x,this.waypoint.y)}getScreenPos(e){let o=this.waypoint;for(;null!=o.parent;)o=o.parent;if(this.waypoint.parent==o)return e.worldToScreen(t.create(this.waypoint.x,this.waypoint.y));if(null!=this.waypoint.parent&&this.waypoint.parent!=o){const o=e.worldToScreen(t.create(this.waypoint.parent.x,this.waypoint.parent.y)),s=this.waypoint.parent.children.indexOf(this.waypoint),n=-s*(2*Math.PI/8.5),r=4*g.radius+s*g.radius*1,i=t.mult(t.create(Math.cos(n),Math.sin(n)),r);return t.add(o,i)}return e.worldToScreen(t.create(this.waypoint.x,this.waypoint.y))}getScreenHitRadius(){return 4*g.radius}getTooltipText(){return`${this.waypoint.symbol} ${this.waypoint.type} [${this.waypoint.traits.map((t=>t.name)).join(", ")}]`}render(e,o,s){const n=this.getScreenPos(s);let r=this.waypoint;for(;null!=r.parent;)r=r.parent;if(0==o&&null!=this.waypoint.parent){let o;e.beginPath(),o=this.waypoint.parent==r?s.worldToScreen(t.create(0,0)):s.worldToScreen(t.create(this.waypoint.parent.x,this.waypoint.parent.y)),e.arc(o.x,o.y,t.magnitude(t.sub(n,o)),0,2*Math.PI),e.strokeWidth=1,e.strokeStyle=M(64,64,64),e.closePath(),this.waypoint.parent==r&&e.setLineDash([10,5]),e.stroke(),e.setLineDash([])}if(0==o)return!0;e.beginPath(),e.arc(n.x,n.y,g.radius,0,2*Math.PI),e.closePath(),e.strokeWidth=2,e.strokeStyle=M(255,255,255),this.waypoint.type,e.fillStyle=M(0,0,255),e.stroke(),e.fill()}}class S{constructor(e,o){this.renderables=e,this.options={global:o},this.scale=1,this.offset=t.create(0,0),this.computeWorldBounds()}computeWorldBounds(){this.worldMin=t.create(Number.MAX_VALUE,Number.MAX_VALUE),this.worldMax=t.create(Number.MIN_VALUE,Number.MIN_VALUE);for(const t of this.renderables){const e=t.getAbsoluteWorldPos();this.worldMin.x=Math.min(this.worldMin.x,e.x),this.worldMax.x=Math.max(this.worldMax.x,e.x),this.worldMin.y=Math.min(this.worldMin.y,e.y),this.worldMax.y=Math.max(this.worldMax.y,e.y)}this.worldMin.x==Number.MAX_VALUE&&(this.worldMin.x=-1),this.worldMin.y==Number.MAX_VALUE&&(this.worldMin.y=-1),this.worldMax.x==Number.MIN_VALUE&&(this.worldMax.x=1),this.worldMax.y==Number.MIN_VALUE&&(this.worldMax.y=1)}setFullView(e,o){this.offset=t.create(0,0),this.scale=1;const s=t.create(0,0),n=t.create(o.width,o.height),r=t.add(s,e),i=t.sub(n,e),l=t.sub(i,r),a=t.sub(this.worldMax,this.worldMin),c=l.x/a.x,d=l.y/a.y;this.scale=Math.min(c,d);const h=t.add(r,t.div(t.sub(i,r),2)),u=t.add(this.worldMin,t.div(t.sub(this.worldMax,this.worldMin),2));this.offset=t.sub(u,this.screenToWorld(h))}screenToWorld(e){return e=t.div(e,this.scale),e=t.add(e,this.offset)}worldToScreen(e){return e=t.sub(e,this.offset),e=t.mult(e,this.scale)}render(t){t.clearRect(0,0,t.canvas.width,t.canvas.height);let e=0,o=this.renderables??[];do{let s=o;o=[];for(const n of s)n.render(t,e,this)&&o.push(n);e++}while(o.length>0)}getOption(t){return this.options[t]??this.options.global[t]}click(t){}}class T extends S{}class b extends S{click(e){const o=e.currentTarget;if(null==o.hoverRenderable)return;o.worldCache=o.worldCache??{};const s=o.worldCache[o.hoverRenderable.system.symbol];if(s)return y(o,s),void u(e);const n=x(e);w.fetchSystem(o.hoverRenderable.system.symbol).then((e=>{const s=[];s.push(new f(e,!0)),function t(e){e.children.forEach((e=>{s.push(new g(e)),t(e)}))}(e);const r=new T(s,o.gameOptions),i=t.create(150,150);r.setFullView(i,o),o.worldCache[e.symbol]=r,y(o,r),u(n)}))}}function x(t){return{currentTarget:t.currentTarget,button:t.button,clientX:t.clientX,clientY:t.clientY,deltaX:t.deltaX,deltaY:t.deltaY}}function M(t,e,o){return`rgb(${t},${e},${o})`}function C(t,e,o,s){return`rgb(${t},${e},${o},${s})`}