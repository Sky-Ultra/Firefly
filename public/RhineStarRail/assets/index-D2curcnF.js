(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var qp=["0","1","2","3","4","5","6","7","8","9"],dr=new Map,af=/[\u0590-\u08ff\u200e\u200f\u202a-\u202e\u2066-\u2069\ufb1d-\ufeff]/u;function Zp(n={}){let e=Intl.getCanonicalLocales(n.locales),t=Object.fromEntries(Object.entries(n.format??{}).sort(([r],[a])=>r.localeCompare(a))),i=JSON.stringify([e,t]),s=dr.get(i);if(!s){s=new Intl.NumberFormat(e,t);let r=dr.keys().next().value;dr.size>=64&&r!==void 0&&dr.delete(r),dr.set(i,s)}return s}function Kp(n,e={}){let t=Zp(e),i=t.formatToParts(n),s=i.map(m=>m.value).join(""),r=t.resolvedOptions(),a=r.numberingSystem==="latn"&&r.notation==="standard"&&!af.test(s)&&!i.some(m=>m.type==="nan"||m.type==="infinity"),o=JSON.stringify(r);if(!a)return{text:s,tokens:[],rollable:a,signature:o,magnitude:""};let l=i.filter(m=>m.type==="integer").reduce((m,A)=>m+A.value.length,0),c=-1,h=new Map,u=[],d="",f="";for(let m of i)if(m.type==="integer"||m.type==="fraction"){m.type==="integer"?d+=m.value:f+=m.value;for(let A of m.value){let p=`digit:${m.type==="integer"?--l:c--}`;u.push({key:p,identity:p,text:A,wheel:qp,index:Number(A)})}}else if(m.type==="group"){let A=`group:${l}`;u.push({key:`${A}:${m.value}`,identity:A,text:m.value})}else{let A=h.get(m.type)??0;h.set(m.type,A+1);let p=m.type==="plusSign"||m.type==="minusSign"?"sign":m.type;u.push({key:`${m.type}:${A}:${m.value}`,identity:`${p}:${A}`,text:m.value})}return{text:s,tokens:u,rollable:a,signature:o,magnitude:`${d.replace(/^0+(?=\d)/u,"")}.${f}`}}function Qp(n,e){let[t="",i=""]=n.magnitude.split("."),[s="",r=""]=e.magnitude.split(".");if(t.length!==s.length)return s.length>t.length?1:-1;if(t!==s)return s>t?1:-1;let a=Math.max(i.length,r.length),o=i.padEnd(a,"0"),l=r.padEnd(a,"0");return l===o?0:l>o?1:-1}var Jh=" ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/&+'",ur=new Map;function Jp(n){let e=ur.get(n);return e||(e=[...new Set(of(n))],ur.size>=16&&ur.delete(ur.keys().next().value),ur.set(n,e)),e}function of(n){return typeof Intl.Segmenter=="function"?[...new Intl.Segmenter(void 0,{granularity:"grapheme"}).segment(n)].map(e=>e.segment):[...n]}function $p(n,e={}){let t=e.charset??Jh,i=!af.test(n);if(!i)return{text:n,tokens:[],rollable:i,signature:"text",magnitude:""};let s=of(n).map((r,a)=>{if(e.transition==="direct")return{key:`char:${a}`,identity:`char:${a}`,text:r,wheel:[r],index:0};let o=Jp(typeof t=="string"?t:t[a]??t.at(-1)??Jh),l=`char:${a}`,c=o.indexOf(r);return c>=0?{key:l,identity:l,text:r,wheel:o,index:c}:{key:`${l}:${r}`,identity:l,text:r}});return{text:n,tokens:s,rollable:i,signature:`text:${e.transition??"wheel"}`,magnitude:""}}function e0(n,e,t=.14){return{target:0,duration:e,points:Array.from({length:49},(i,s)=>{if(s===48)return 0;let r=Math.max(0,Math.min(1,(s/48-t)/(1-t)));return n*(1+10*r)*Math.exp(-10*r)})}}function sa(n,e){if(e<=0||n.duration<=0)return n;let t=n.duration+e,i=Math.round((n.points.length-1)*t/n.duration)+1,s=n.points[0]??n.target;return{target:n.target,duration:t,points:Array.from({length:i},(r,a)=>{if(a===i-1)return n.target;let o=a/(i-1)*t-e;return o<=0?s:lf(n,o).position})}}function mn(n,e,t,i){if(i<=0)return{points:[e,e],duration:0,target:e};let s=i/1e3,r=n-e,a=Math.max(Math.abs(r),1)*12/s,o=Math.max(-a,Math.min(a,t))*s;return{points:Array.from({length:49},(l,c)=>{if(c===48)return e;let h=c/48;return e+(r+(o+10*r)*h)*Math.exp(-10*h)}),duration:i,target:e}}function t0(n,e=0,t=24){if(n.duration<=0)return{points:[0,0],duration:0,target:0};let i=n.duration/(n.points.length-1)/1e3;return{duration:n.duration,target:0,points:n.points.map((s,r,a)=>{if(r===0)return Math.max(0,Math.min(1,e));if(r===a.length-1)return 0;let o=Math.abs((a[r+1]-a[r-1])/(2*i)),l=t/6;return Math.max(0,Math.min(1,(o-l)/(t-l)))})}}function lf(n,e){if(e>=n.duration||n.duration===0)return{position:n.target,velocity:0};let t=Math.max(0,e)/n.duration*(n.points.length-1),i=Math.min(Math.floor(t),n.points.length-2),s=n.points[i]??n.target,r=n.points[i+1]??n.target;return{position:s+(r-s)*(t-i),velocity:(r-s)*(n.points.length-1)*1e3/n.duration}}function $h(n,e,t,i=10){let s=Math.floor(n/i)*i+e;return t>0&&s<n-.001?s+=i:t<0&&s>n+.001?s-=i:t===0&&(s+=Math.round((n-s)/i)*i),s}var ro=(n,e)=>n[(e%n.length+n.length)%n.length];function i0(n,e,t){let i=Math.floor(e),s=e-i,r=[ro(n,i)];return s>1e-5&&r.push(ro(n,i+1)),r.at(-1)!==t&&r.push(t),{wheel:r,from:s,target:r.length-1}}function n0(n,e="outward"){if(e!=="outward"){let s=n.map((a,o)=>a?-1:o).filter(a=>a>=0);e==="end"&&s.reverse();let r=n.map(a=>a?0:1);return e!=="none"&&s.forEach((a,o)=>{r[a]=o+1}),r}let t=n.map((s,r)=>s?0:r+1);if(!n.includes(!0))return t;let i=-1/0;for(let s=0;s<n.length;s++)n[s]?i=s:t[s]=s-i;i=1/0;for(let s=n.length-1;s>=0;s--)n[s]?i=s:t[s]=Math.min(t[s],i-s);return t}function ed(n,e){let t=new Map,i=[],s=0;for(let r of n){let a=e.get(r);if(!a){i.push(r);continue}for(let o of i)t.set(o,a.x);i.length=0,s=a.x+a.width}for(let r of i)t.set(r,s);return t}var Go=new WeakMap;class oh{view;media;members=new Set;pending=new Set;sizes=new WeakMap;intersections=new WeakMap;resize;intersection;frame=0;static for(e){let t=Go.get(e);return t||(t=new oh(e),Go.set(e,t)),t}constructor(e){this.view=e,this.media=e.matchMedia("(prefers-reduced-motion: reduce)"),this.media.addEventListener("change",this.refresh),e.document.addEventListener("visibilitychange",this.refresh),e.document.fonts?.addEventListener("loadingdone",this.refresh),e.document.fonts?.ready.then(this.refresh),e.ResizeObserver&&(this.resize=new e.ResizeObserver(t=>{for(let i of t){let s=this.sizes.get(i.target);s?.sizeChanged(i.target,i.contentRect.width,i.contentRect.height)&&s.refresh()}})),e.IntersectionObserver&&(this.intersection=new e.IntersectionObserver(t=>{for(let i of t)this.intersections.get(i.target)?.visibility(i.isIntersecting)},{rootMargin:"64px"}))}refresh=()=>{for(let e of this.members)e.refresh()};add(e,t){this.members.add(e),this.intersections.set(t,e),this.intersection?.observe(t)}watch(e,t){this.sizes.set(e,t),this.resize?.observe(e)}unwatch(e){this.resize?.unobserve(e),this.sizes.delete(e)}enqueue(e){this.pending.add(e),!this.frame&&(this.frame=this.view.requestAnimationFrame(()=>{this.frame=0;let t=[...this.pending];this.pending.clear();let i=t.map(r=>r.stage());for(let r of i)r?.();let s=t.map(r=>r.measure());for(let r of s)r?.()}))}remove(e,t){this.pending.delete(e),this.members.delete(e),this.intersection?.unobserve(t),this.intersections.delete(t),!this.members.size&&(this.view.cancelAnimationFrame(this.frame),this.resize?.disconnect(),this.intersection?.disconnect(),this.media.removeEventListener("change",this.refresh),this.view.document.removeEventListener("visibilitychange",this.refresh),this.view.document.fonts?.removeEventListener("loadingdone",this.refresh),Go.delete(this.view))}}var td=new WeakMap;function Cs(n,e,t){let i=n.animate(e,t),s=n.ownerDocument.timeline?.currentTime;return typeof s=="number"&&i.playState==="running"&&(i.startTime=s),i}function id(n){let e=n.ownerDocument.defaultView;if(!e)return!1;let t=td.get(e);return t===void 0&&(t=e.CSS?.supports("animation-timing-function","linear(0, 1)")??!1,td.set(e,t)),t}class Ds{element;property;animation;motion;value=0;constructor(e,t){this.element=e,this.property=t}read(){let e=this.animation?.currentTime;return this.animation&&this.motion?lf(this.motion,typeof e=="number"?e:0):{position:this.value,velocity:0}}set(e,t){this.cancel(),this.value=e,this.element.style.setProperty(this.property,t(e))}play(e,t,i){if(this.cancel(),this.value=e.target,this.element.style.setProperty(this.property,t(e.target)),!e.duration||e.points.every(u=>u===e.target)){i?.();return}let s=e.points[0]??e.target,r=e.target-s,a=this.property==="opacity"&&id(this.element),o=this.property==="transform"&&Math.abs(r)>1e-5&&id(this.element),l=a?[{opacity:0},{opacity:1}]:o?[{[this.property]:t(s)},{[this.property]:t(e.target)}]:e.points.map(u=>({[this.property]:t(u)})),c=a?`linear(${e.points.map(t).join(",")})`:o?`linear(${e.points.map(u=>Number(((u-s)/r).toFixed(6))).join(",")})`:"linear",h=Cs(this.element,l,{duration:e.duration,easing:c});this.animation=h,this.motion=e,h.onfinish=()=>{this.animation===h&&(this.animation=void 0,this.motion=void 0,h.onfinish=null,h.cancel(),i?.())}}cancel(){this.animation&&(this.animation.onfinish=null,this.animation.cancel(),this.animation=void 0),this.motion=void 0}}var Wo="http://www.w3.org/2000/svg",s0=0;class Xo{host;layers=new Map;filter;intensity=1;constructor(e){this.host=e}filterUrl(e){if(!this.filter){let i=this.host.ownerDocument,s=i.createElementNS(Wo,"svg");s.classList.add("rn-blur-defs"),s.setAttribute("aria-hidden","true"),s.setAttribute("focusable","false");let r=i.createElementNS(Wo,"filter"),a;do a=`rn-vertical-blur-${++s0}`;while(i.getElementById(a));r.id=a,r.setAttribute("x","-15%"),r.setAttribute("width","130%"),r.setAttribute("color-interpolation-filters","sRGB");let o=i.createElementNS(Wo,"feGaussianBlur");r.append(o),s.append(r),this.host.append(s),this.filter={svg:s,blur:o,id:a,height:0}}let t=e*.035*this.intensity;return this.filter.height!==t&&(this.filter.blur.setAttribute("stdDeviation",`0 ${t}`),this.filter.height=t),`url("#${this.filter.id}")`}apply(e,t,i,s,r="roll"){let a=t0(t,s,r==="entry"?6:24);if(a.points.every(u=>u===0))return!1;let o=this.host.ownerDocument.createElement("span");o.className="rn-sharp",o.append(...e.childNodes);let l=o.cloneNode(!0);l.className="rn-smear",l.style.filter=this.filterUrl(i),e.append(o,l);let c=new Ds(o,"opacity"),h=new Ds(l,"opacity");return this.layers.set(e,{sharp:o,sharpOpacity:c,smearOpacity:h}),c.play(a,u=>String(1-u)),h.play(a,String),!0}remove(e){let t=this.layers.get(e);if(!t)return 0;let i=t.smearOpacity.read().position;return t.sharpOpacity.cancel(),t.smearOpacity.cancel(),e.replaceChildren(...t.sharp.childNodes),this.layers.delete(e),i}destroy(){for(let e of this.layers.keys())this.remove(e);this.filter?.svg.remove(),this.filter=void 0}}function r0(n){return Math.max(45,Math.min(110,n/7))}function a0(n,e,t){let i=Math.abs(e-n);return{points:[n,e],target:e,duration:i*t}}function o0(n){let e=Array.from({length:n+1},(s,r)=>({"--rn-flap-step":String(r),offset:r/n,easing:"steps(1, end)"})),t=[],i=[];for(let s=0;s<n;s++){let r=s/n,a=(s+.5)/n,o=(s+1)/n;t.push({transform:"perspective(5em) rotateX(0deg)",filter:"brightness(1)",offset:r,easing:"cubic-bezier(.6, 0, 1, .5)"},{transform:"perspective(5em) rotateX(-90deg)",filter:"brightness(.45)",offset:a},{transform:"perspective(5em) rotateX(-90deg)",filter:"brightness(.45)",offset:o}),i.push({transform:"perspective(5em) rotateX(90deg)",filter:"brightness(.45)",offset:r},{transform:"perspective(5em) rotateX(90deg)",filter:"brightness(.45)",offset:a,easing:"linear(0, 0.58, 0.9, 1, 1.045 78%, 1)"},{transform:"perspective(5em) rotateX(0deg)",filter:"brightness(1)",offset:o})}return{index:e,falls:t,lands:i}}function l0(n){for(let e of n.querySelectorAll(".rn-flap-smear")){for(let t of e.getAnimations())t.cancel();e.remove()}for(let e of n.querySelectorAll(".rn-flap-sharp")){for(let t of e.getAnimations())t.cancel();e.classList.remove("rn-flap-sharp")}}function c0(n,e,t,i,s,r,a,o){let l=n.ownerDocument,c=Math.abs(i-t),h=i>=t?1:-1;if(!c){n.replaceChildren();return}let u=o0(c),d=Array.from({length:c+1},(b,w)=>ro(e,t+w*h)),f=[...d.slice(1),d.at(-1)],m=d.some(b=>/[\r\n\f\u2028\u2029]/u.test(b)),A=l.createElement("span");A.style.cssText=`display:block;position:relative;height:${s}px`,Cs(A,u.index,{delay:a,duration:c*r,fill:"both"});let p=(b,w)=>{let D=l.createElement("span");D.className=`rn-face rn-flap rn-flap-${b}`,D.style.height=`${s}px`,D.style.overflow="hidden";let x=l.createElement("span");x.style.cssText=`display:block;white-space:pre;line-height:${s}px`;let S=w?f:d;if(m)for(let N of S){let R=l.createElement("span");R.style.cssText=`display:block;height:${s}px`,R.textContent=N,x.append(R)}else x.textContent=S.join(`
`);return D.append(x),x.style.transform=`translateY(calc(var(--rn-flap-step) * ${-s}px))`,D},g=p("bottom",!1),_=p("top",!0),E=p("top",!1),M=p("bottom",!0);if(o){let b=(w,D)=>{let x=w.firstElementChild,S=x.cloneNode(!0);x.classList.add("rn-flap-sharp");let N=l.createElement("span");N.className="rn-flap-smear",N.style.cssText="display:block;position:absolute;inset:0;overflow:hidden",N.style.filter=o,N.append(S),w.append(N);let R=D.map(H=>({offset:H.offset,easing:H.easing??"linear",opacity:H.filter==="brightness(1)"?0:1})),U={delay:a,duration:c*r,fill:"both"};Cs(N,R,U),Cs(x,R.map(H=>({...H,opacity:1-H.opacity})),U)};b(E,u.falls),b(M,u.lands)}E.style.transform="perspective(5em) rotateX(-90deg)",Cs(E,u.falls,{delay:a,duration:c*r,fill:"backwards"}),M.style.transform="perspective(5em) rotateX(90deg)",Cs(M,u.lands,{delay:a,duration:c*r,fill:"forwards"}),n.style.height=`${s}px`,A.append(g,_,M,E),n.replaceChildren(A)}var h0=new WeakMap,Or=new WeakSet,Yo=n=>`translateX(${n}px)`,jo=n=>`scale(${n})`,qo=n=>String(Math.max(0,Math.min(1,n))),Zo=n=>"transition"in n&&n.transition==="direct";function cf(n){if(n.duration!==void 0&&(!Number.isFinite(n.duration)||n.duration<0||n.duration>1e4))throw RangeError("duration must be between 0 and 10000 milliseconds");if(n.flipDuration!==void 0&&(!Number.isFinite(n.flipDuration)||n.flipDuration<1||n.flipDuration>1e4))throw RangeError("flipDuration must be between 1 and 10000 milliseconds")}var d0={validate(n){if(typeof n.value!="number"&&typeof n.value!="bigint")throw TypeError("value must be a number or bigint");cf(n)},model:n=>Kp(n.value,n),direction:Qp},u0={validate(n){if(typeof n.text!="string")throw TypeError("text must be a string");if(n.transition!==void 0&&n.transition!=="direct"&&n.transition!=="wheel")throw RangeError("transition must be direct or wheel");if(n.transition==="direct"&&n.mode==="flap")throw RangeError("Direct text transitions require roll mode");cf(n)},model:n=>$p(n.text,n),direction:()=>1};class hf{host;source;options;target;displayed;semantic;measurement;visual;measures=new Map;columns=new Map;sizes=new Map;scheduler;enhanced=!1;destroyed=!1;visible=!0;reset=!0;measurementPending=!1;hadClass;previousLeft;blur;blurIntensity=1;constructor(e,t,i){this.host=e,this.source=i,i.validate(t),this.options={...t},this.target=this.displayed=i.model(t);let s=e.ownerDocument,r=o=>{let l=s.createElement("span");return l.className=o,l};this.semantic=r("rn-value"),this.measurement=r("rn-measure"),this.visual=r("rn-visual"),this.measurement.setAttribute("aria-hidden","true"),this.visual.setAttribute("aria-hidden","true"),this.semantic.textContent=this.target.text,this.hadClass=e.classList.contains("rn-root"),e.classList.add("rn-root"),e.replaceChildren(this.semantic,this.measurement,this.visual);let a=s.defaultView;a&&typeof a.matchMedia=="function"&&typeof a.requestAnimationFrame=="function"&&typeof e.animate=="function"&&(this.scheduler=oh.for(a),this.scheduler.add(this,e),this.scheduler.watch(this.measurement,this)),this.prepare()}canAnimate(){return!!this.scheduler&&this.options.animated!==!1&&(this.options.duration??500)>0&&!this.scheduler.media.matches&&!this.host.ownerDocument.hidden&&(this.visible||this.options.pauseOffscreen===!1)&&this.target.rollable&&this.host.isConnected}update(e){if(this.destroyed)return;let t={...this.options,...e};this.source.validate(t);let i=this.source.model(t),s=i.text===this.target.text&&i.signature===this.target.signature;if(this.options.motionBlur&&!t.motionBlur&&(this.blur?.destroy(),this.blur=void 0,l0(this.visual)),Zo(this.options)!==Zo(t)&&(this.reset=!0),this.options=t,this.target=i,!this.canAnimate()){this.finish();return}s&&this.enhanced&&!this.reset||(this.semantic.textContent=i.text,this.prepare())}prepare(){if(!this.canAnimate()){this.finish();return}this.measurementPending=!0,this.scheduler?.enqueue(this)}stage(){if(!this.destroyed)return this.canAnimate()?(this.previousLeft=this.enhanced&&!this.reset?this.measurement.getBoundingClientRect().left:void 0,()=>this.stageMeasurement()):()=>this.finish()}stageMeasurement(){let e=new Set(this.target.tokens.map(i=>i.key));for(let[i,s]of this.measures)e.has(i)||(this.scheduler?.unwatch(s),this.sizes.delete(s),s.remove(),this.measures.delete(i));let t=null;for(let i of this.target.tokens){let s=this.measures.get(i.key);s||(s=this.host.ownerDocument.createElement("span"),s.className="rn-token",this.measures.set(i.key,s),this.scheduler?.watch(s,this)),s.textContent!==i.text&&(s.textContent=i.text);let r=t?t.nextSibling:this.measurement.firstChild;s!==r&&this.measurement.insertBefore(s,r),t=s}this.host.dataset.rnMeasuring=""}measure(){if(this.destroyed)return;if(!this.canAnimate())return()=>this.finish();let e=this.measurement.getBoundingClientRect(),t=this.host.ownerDocument.defaultView;if(!t)return()=>this.finish();let i=t.getComputedStyle(this.measurement);if(i.direction==="rtl")return()=>this.finish();let s=parseFloat(i.width),r=parseFloat(i.height);if(!s||!r||!e.width||!e.height)return()=>this.finish();let a=e.width/s,o=e.height/r,l=parseFloat(i.getPropertyValue("--rn-blur"));this.blurIntensity=Number.isFinite(l)?Math.max(0,l):1,this.sizes.set(this.measurement,{width:s,height:r});let c=new Map;for(let[u,d]of this.measures){let f=d.getBoundingClientRect(),m={width:parseFloat(t.getComputedStyle(d).width),height:parseFloat(t.getComputedStyle(d).height)};this.sizes.set(d,m),c.set(u,{...m,x:(f.left-e.left)/a,y:(f.top-e.top)/o})}let h=this.previousLeft===void 0?0:(this.previousLeft-e.left)/a;return()=>this.commit(c,h)}makeColumn(e){let t=this.host.ownerDocument.createElement("span");t.className="rn-slot",t.dataset.rnKey=e.key,e.index!==void 0&&(t.dataset.rnWheel=""),this.options.mode==="flap"&&(t.dataset.rnFlap="");let i=this.host.ownerDocument.createElement("span");return i.className="rn-reel",t.append(i),this.visual.append(t),{token:e,element:t,reel:i,x:new Ds(t,"transform"),opacity:new Ds(t,"opacity"),roll:new Ds(i,"transform"),exiting:!1,height:0,width:0}}face(e,t){let i=this.host.ownerDocument.createElement("span");i.className="rn-face",i.textContent=t,i.style.height=`${e.height}px`;let s=e.reel.children.length;i.style.position="absolute",i.style.top="0",i.style.left="0",i.style.width="100%",i.style.transform=`translateY(${s*e.height}px)`,e.reel.style.height=`${(s+1)*e.height}px`,e.reel.append(i)}rest(e){this.blur?.remove(e.reel),e.reel.replaceChildren(),e.reel.style.removeProperty("height"),this.face(e,e.token.text),this.wrapInk(e),e.token.index===void 0?e.roll.set(1,jo):e.roll.set(e.token.index,()=>"translateY(0px)")}wrapInk(e){if(this.options.mode==="flap")return;let t=this.host.ownerDocument.createElement("span");t.className="rn-ink",t.append(...e.reel.childNodes),e.reel.append(t)}finishEntry(e){e.entry&&(e.entry.blurred&&this.blur?.remove(e.reel),e.entry.track.cancel(),e.entry.element.replaceWith(e.reel),e.entry=void 0)}enter(e,t,i,s){let r=this.host.ownerDocument.createElement("span");r.className="rn-enter",e.reel.replaceWith(r),r.append(e.reel);let a=new Ds(r,"transform");e.entry={element:r,track:a,blurred:!1};let o=sa(e0(e.height*(s?.entryDistance??1),s?.entryDuration??t,s?.entryHold),i);if(this.options.motionBlur&&e.token.text.trim()){this.blur??=new Xo(this.host),this.blur.intensity=this.blurIntensity;let l={...o,points:o.points.map(c=>c/e.height)};e.entry.blurred=this.blur.apply(e.reel,l,e.height,0,"entry")}a.play(o,l=>`translateY(${l}px)`,()=>this.finishEntry(e))}commit(e,t){if(this.destroyed)return;this.measurementPending=!1;let i=this.enhanced&&!this.reset,s=i?this.options.duration??500:0,r=h0.get(this.host),a=s?r?.widthDuration??s:0,o=this.options.mode==="flap",l=this.options.direction==="up"?1:this.options.direction==="down"?-1:this.source.direction(this.displayed,this.target);this.target.text!==this.displayed.text&&(this.host.dataset.rnTrend=l>0?"up":l<0?"down":"none");let c=new Map([...this.columns].map(([M,b])=>{let w=b.x.read();return[M,{...w,x:w.position,width:b.width}]})),h=ed(this.target.tokens.map(M=>M.key),c),u=[...c.keys()].sort((M,b)=>c.get(M).x-c.get(b).x),d=ed(u,e),f=new Map(this.displayed.tokens.filter(M=>M.index===void 0).map(M=>[M.identity,M.key])),m=new Map(this.target.tokens.filter(M=>M.index===void 0).map(M=>[M.identity,M.key])),A=this.options.stagger==="start"||this.options.stagger==="end",p=this.target.tokens.map(M=>{let b=this.columns.get(M.key);return!b||b.exiting||A&&M.index!==void 0&&b.token.text!==M.text}),g=n0(this.target.tokens.map((M,b)=>M.index!==void 0&&!p[b]),this.options.stagger),_=Math.max(0,...this.target.tokens.map((M,b)=>p[b]?g[b]-1:0)),E=Math.min(s*.045,s*.3/Math.max(1,_));for(let[M,b]of this.target.tokens.entries()){let w=e.get(b.key);if(!w)continue;let D=Math.max(0,g[M]-1)*E,x=f.get(b.identity),S=x!==void 0&&x!==b.key?c.get(x):void 0,N=this.columns.get(b.key),R=!N;if(!N){N=this.makeColumn(b),this.columns.set(b.key,N);let k=(S?.x??h.get(b.key)??w.x)+t;N.x.set(i?k+(w.x-k)*(S?0:r?.entryOrigin??0):w.x,Yo),N.opacity.set(i?0:1,qo)}let U=N.token.text!==b.text,H=Math.abs(N.height-w.height)>.1,j=N.exiting;N.exiting=!1,N.element.style.width=`${w.width}px`,N.element.style.height=`${w.height}px`,N.element.style.top=`${w.y}px`;let V=c.get(b.key);if(N.x.play(mn(V?V.position+t:N.x.read().position,w.x,V?.velocity??0,a),Yo),R||j||!i){let k=N.opacity.read(),B=mn(k.position,1,k.velocity,b.index===void 0?Math.min(s,180):s?r?.fadeDuration??s:0),$=!o&&b.identity.startsWith("group:")&&!S?(r?.entryDuration??s)*(r?.entryHold??.14):0;N.opacity.play(R?sa(B,D+$):B,qo)}if(N.height=w.height,N.width=w.width,(!i||H)&&this.finishEntry(N),R&&o&&b.wheel&&s&&N.roll.set(Math.max(0,b.wheel.indexOf(" ")),()=>"translateY(0px)"),o&&!H&&(U||R)&&b.index!==void 0&&b.wheel&&s&&N.roll.read().position!==b.index){let k=N.roll.read(),B=Math.round(k.position),$=$h(B,b.index,l,b.wheel.length),K=this.options.flipDuration??r0(s);this.blur?.remove(N.reel);let ae;this.options.motionBlur&&this.blurIntensity>0&&(this.blur??=new Xo(this.host),this.blur.intensity=this.blurIntensity,ae=this.blur.filterUrl(w.height)),c0(N.reel,b.wheel,B,$,w.height,K,D,ae),N.token=b;let he=N;N.roll.play(sa(a0(B,$,K),D),()=>"translateY(0px)",()=>this.rest(he))}else if(!R&&!H&&U&&b.index!==void 0&&b.wheel&&N.token.index!==void 0&&s){let k=N.roll.read(),B=Zo(this.options)?i0(N.token.wheel,k.position,b.text):void 0,$=B?.from??k.position,K=B?.target??$h(k.position,b.index,l,b.wheel.length),ae=B?.wheel??b.wheel,he=B?Math.min(Math.max(0,k.velocity),(K-$)*1e4/s):k.velocity,ce=A?sa(mn($,K,he,s),D):mn($,K,he,s),Le=Math.floor(Math.min(...ce.points)),tt=Math.ceil(Math.max(...ce.points));N.entry&&(N.entry.blurred=!1);let nt=this.blur?.remove(N.reel)??0;N.reel.replaceChildren();for(let J=Le;J<=tt;J++)this.face(N,ro(ae,J));this.wrapInk(N),this.options.motionBlur&&(this.blur??=new Xo(this.host),this.blur.intensity=this.blurIntensity,this.blur.apply(N.reel,ce,w.height,nt)),N.token=B?{...b,wheel:ae,index:K}:b;let q=N;N.roll.play(ce,J=>`translateY(${(Le-J)*w.height}px)`,()=>this.rest(q))}else(R||H||U||!i)&&(N.token=b,this.rest(N));if(R&&s&&b.index!==void 0&&!o&&this.enter(N,s,D,r),S&&s&&(R||j)){let k=N.roll.read(),B=N;N.roll.play(mn(R?.96:k.position,1,k.velocity,Math.min(s,180)),jo,()=>this.rest(B))}}for(let[M,b]of this.columns){if(e.has(M))continue;let w=c.get(M),D=m.get(b.token.identity),x=D?e.get(D):void 0;if(b.x.play(mn(w.position+t,x?.x??d.get(M)??w.position,w.velocity,a),Yo),b.exiting)continue;if(b.exiting=!0,x&&s){let N=b.roll.read();b.roll.play(mn(N.position,1.04,N.velocity,Math.min(s,180)),jo)}let S=b.opacity.read();b.opacity.play(mn(S.position,0,S.velocity,b.token.index===void 0?Math.min(s,180):s*.65),qo,()=>{b.exiting&&(this.removeColumn(b),this.columns.delete(M))})}this.enhanced=!0,this.reset=!1,this.displayed=this.target,this.host.dataset.rnReady=""}removeColumn(e){this.blur?.remove(e.reel),this.finishEntry(e),e.x.cancel(),e.roll.cancel(),e.opacity.cancel(),e.element.remove()}refresh(){this.destroyed||(this.reset=!0,this.prepare())}sizeChanged(e,t,i){if(this.measurementPending||!this.host.hasAttribute("data-rn-measuring"))return!1;let s=this.sizes.get(e);return!s||Math.abs(s.width-t)>.2||Math.abs(s.height-i)>.2}visibility(e){this.visible!==e&&(this.visible=e,(e||this.options.pauseOffscreen!==!1)&&this.refresh())}finish(){if(!this.destroyed){this.measurementPending=!1;for(let e of this.columns.values())this.removeColumn(e);this.columns.clear(),this.blur?.destroy(),this.blur=void 0,this.semantic.textContent=this.target.text,delete this.host.dataset.rnReady,delete this.host.dataset.rnMeasuring,delete this.host.dataset.rnTrend,this.enhanced=!1,this.reset=!0,this.displayed=this.target}}destroy(){if(!this.destroyed){this.finish(),this.destroyed=!0;for(let e of this.measures.values())this.scheduler?.unwatch(e);this.scheduler?.unwatch(this.measurement),this.scheduler?.remove(this,this.host),this.host.replaceChildren(this.host.ownerDocument.createTextNode(this.target.text)),!this.hadClass&&this.host.classList.remove("rn-root"),Or.delete(this.host)}}}function qr(n,e){if(Or.has(n))throw Error("A rolling number is already mounted on this element");let t=new hf(n,e,d0);return Or.add(n),t}function Zr(n,e){if(Or.has(n))throw Error("A rolling number is already mounted on this element");let t=new hf(n,e,u0);return Or.add(n),t}function f0(n){n.replaceChildren(),n.setAttribute("role","timer");const e=[0,1,2].map(i=>{i&&n.append(":");const s=document.createElement("span");return s.setAttribute("aria-hidden","true"),n.append(s),qr(s,{value:0,duration:460,motionBlur:!0,locales:"en-GB",format:{minimumIntegerDigits:2,useGrouping:!1},animated:!1})});let t=!1;return(i,s)=>{const r=[i.getHours(),i.getMinutes(),i.getSeconds()];n.setAttribute("aria-label",r.map(a=>String(a).padStart(2,"0")).join(":")),e.forEach((a,o)=>{a.update({value:r[o],animated:s&&t,direction:"up"}),s||a.finish()}),t=!0}}const ra=34.12,Tr=39.56,aa=1.5,p0=n=>Math.max(0,Math.min(1,n)),Fn=n=>{const e=p0(n);return e*e*e*(10+e*(-15+e*6))};function Ko(n,e){if(e<=n[0][0])return n[0][1];if(e>=n[n.length-1][0])return n[n.length-1][1];const t=c=>(n[c+1][1]-n[c][1])/(n[c+1][0]-n[c][0]),i=c=>{if(c===0||c===n.length-1)return 0;const h=t(c-1),u=t(c);if(h*u<=0)return 0;const d=n[c][0]-n[c-1][0],f=n[c+1][0]-n[c][0],m=2*f+d,A=f+2*d;return(m+A)/(m/h+A/u)};let s=0;for(;e>n[s+1][0];)s++;const r=n[s+1][0]-n[s][0],a=(e-n[s][0])/r,o=a*a,l=o*a;return(2*l-3*o+1)*n[s][1]+(l-2*o+a)*r*i(s)+(-2*l+3*o)*n[s+1][1]+(l-o)*r*i(s+1)}const m0=[[34.24,0],[34.4,.19],[34.64,.57],[34.96,.79],[35.28,.92],[35.6,.973],[36.04,1]],g0=[[38.84,0],[38.92,.28],[39,.51],[39.16,.74],[39.32,.94],[39.56,1]],A0=[[37.72,1],[37.88,.72],[38,.38],[38.12,.22],[38.24,.14],[38.4,.075],[38.64,.024],[38.84,0]],Ps=[-1.6,.5],ao=[1.98,3.24],v0=[[-1.88,3.2],[2.14,3.36],[-1.77,.36],[2.17,.65]];function ls(n){const e=Ko(m0,n),t=Ko(A0,n),i=[];n>=34.24&&n<36.04&&e>0?i.push([0,e*.5],[1-e*.5,1]):n>=36.04&&n<38.84&&i.push([.5-t*.5,.5+t*.5]);const s=Fn((n-34.2)/.12)*(1-Fn((n-37.76)/.56));return{time:n,intervals:i,markers:s,point:Fn((n-38.58)/.2)*(1-Fn((n-39.08)/.22)),label:Fn((n-34.32)/.36)*(1-Fn((n-37.68)/.24)),labelValue:Fn((n-35.64)/.56),clarity:Ko(g0,n),phase:n<34.24?"waiting":n<36.04?"joining":n<37.72?"connected":n<38.84?"retracting":n<Tr?"revealing":"clear"}}class x0{clarity=0;active=!1;elapsed=null;frame=ls(-1);enter(e=!1){this.active||(this.active=!0,this.elapsed=e?(Tr-ra)/aa:null,e&&this.finish())}leave(){this.active=!1,this.elapsed=null,this.frame=ls(-1)}select(e=0){this.leave(),this.clarity=e}finish(){this.elapsed=(Tr-ra)/aa,this.clarity=1,this.frame=ls(Tr)}update(e,t,i,s){if(s!==void 0){this.frame=ls(s),this.clarity=this.frame.clarity;return}if(!this.active){this.clarity=i?0:this.clarity*Math.exp(-Math.max(0,e)*9),this.clarity<1e-4&&(this.clarity=0),this.frame=ls(-1);return}if(i){this.finish();return}this.elapsed===null&&t?this.elapsed=0:this.elapsed!==null&&(this.elapsed=Math.min(this.elapsed+Math.max(0,e),(Tr-ra)/aa)),this.elapsed!==null&&(this.frame=ls(ra+this.elapsed*aa),this.clarity=this.frame.clarity>this.clarity?this.frame.clarity:this.frame.phase==="clear"?1:this.clarity*Math.exp(-Math.max(0,e)*9))}}function _0(n){const e=t=>[Ps[0]+(ao[0]-Ps[0])*t,Ps[1]+(ao[1]-Ps[1])*t];return n.intervals.map(([t,i])=>[e(t),e(i)])}class M0{root=document.querySelector("#inspection-marks");line=this.root.querySelector("#inspection-lines");corners=this.root.querySelector("#inspection-corners");point=this.root.querySelector("#inspection-point");label=document.querySelector("#inspection-text");render(e,t,i,s=!0){const r=document.querySelector("#three-scene");this.root.setAttribute("viewBox",`0 0 ${r.clientWidth} ${r.clientHeight}`),this.root.style.opacity=s&&(e.intervals.length||e.markers>0||e.point>0)?"1":"0",this.root.dataset.phase=e.phase,this.root.dataset.referenceTime=e.time.toFixed(3),this.line.setAttribute("d",_0(e).map(([l,c])=>`M${t(...l)}L${t(...c)}`).join("")),this.corners.style.opacity=String(e.markers),this.corners.innerHTML=e.markers>0?v0.map(([l,c])=>{const[h,u]=t(l,c);return`<rect x="${h-4}" y="${u-4}" width="8" height="8"/>`}).join(""):"";const[a,o]=t((Ps[0]+ao[0])/2,(Ps[1]+ao[1])/2);this.point.setAttribute("cx",String(a)),this.point.setAttribute("cy",String(o)),this.point.style.opacity=String(e.point),this.label.style.opacity=String(s&&i?e.label:0),this.label.querySelector("strong").style.opacity=String(e.labelValue)}}class y0{root=null;covers=[];started=null;progress=0;reset(e,t){this.remove(),this.root=e,this.started=null,this.progress=t?1:0,this.refresh()}refresh(){if(this.remove(),!this.root||this.progress===1)return;this.root.querySelectorAll("h2, .detail-title-cn, .metadata dd, .tab-panel p, .research-notes li, .log-row").forEach(t=>{t.classList.add("document-redacted");const i=t.getBoundingClientRect(),s=i.width/t.offsetWidth;if(!s||!Number.isFinite(s))return;const r=document.createTreeWalker(t,NodeFilter.SHOW_TEXT),a=[];let o;for(;o=r.nextNode();){if(!o.textContent?.trim())continue;const l=document.createRange();l.selectNodeContents(o);for(const c of l.getClientRects()){if(!c.width||!c.height)continue;const h=(c.left-i.left)/s,u=(c.top-i.top)/s,d=(c.right-i.left)/s,f=(c.bottom-i.top)/s,m=a.find(A=>Math.abs(A.y-u)<6);m?(m.x=Math.min(m.x,h),m.y=Math.min(m.y,u),m.right=Math.max(m.right,d),m.bottom=Math.max(m.bottom,f)):a.push({x:h,y:u,right:d,bottom:f})}}for(const l of a){const c=document.createElement("span");c.className="document-redaction-window",c.setAttribute("aria-hidden","true");const h=Math.max(0,l.x-1),u=Math.min(t.clientWidth,l.right+1);c.style.cssText=`left:${h}px;top:${l.y-1}px;width:${u-h}px;height:${l.bottom-l.y+2}px`;const d=document.createElement("span");d.className="document-redaction-ink",c.append(d),t.append(c),this.covers.push({window:c,ink:d,order:this.covers.length})}}),this.paint()}update(e,t,i){!this.root||this.progress===1||(i?this.progress=1:(this.started===null&&t.clarity>0&&(this.started=e),this.started!==null&&(this.progress=Math.min(1,Math.max(0,(e-this.started)/.95)))),this.progress===1?this.remove():this.started!==null&&this.paint())}paint(){const e=Math.max(1,this.covers.length-1);for(const t of this.covers){const i=t.order/e*.22,s=Math.min(1,Math.max(0,(this.progress-i)/.78)),r=s<.2?.4*(s/.2)**2:1-.6*((1-s)/.8)**(16/3);t.ink.style.transform=`translateX(${r*101}%)`}}remove(){for(const e of this.covers)e.window.remove();this.covers=[]}}function jt(n){return n.replace(/[&<>"']/g,e=>{switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return"&#39;"}})}const Ur={performance:{scale:80,pixelRatio:1,antialias:"off",shadows:1024,aoSamples:0,aoResolution:.5,depthOfField:0,transmission:.5,anisotropy:4},original:{scale:100,pixelRatio:1.5,antialias:"off",shadows:2048,aoSamples:32,aoResolution:1,depthOfField:100,transmission:1,anisotropy:16},high:{scale:125,pixelRatio:2,antialias:"smaa",shadows:4096,aoSamples:32,aoResolution:1,depthOfField:100,transmission:1,anisotropy:16},ultra:{scale:150,pixelRatio:2,antialias:"smaa",shadows:4096,aoSamples:64,aoResolution:1,depthOfField:100,transmission:1,anisotropy:16}},nd={performance:"性能",original:"原始",high:"高",ultra:"极高"},Hn=(n,e,t)=>e.includes(n)?n:t,sd=(n,e,t,i,s)=>typeof n=="number"&&Number.isFinite(n)?Math.min(t,Math.max(e,Math.round(n/i)*i)):s;function Kn(n,e=!0){const t=Ur.original,i=n&&typeof n=="object"?n:{},s=e?t:{...t,pixelRatio:1,aoSamples:0,depthOfField:0};return{scale:sd(i.scale,50,200,5,s.scale),pixelRatio:Hn(i.pixelRatio,[1,1.5,2,3],s.pixelRatio),antialias:Hn(i.antialias,["off","smaa"],s.antialias),shadows:Hn(i.shadows,[0,1024,2048,4096],s.shadows),aoSamples:Hn(i.aoSamples,[0,16,32,64],s.aoSamples),aoResolution:Hn(i.aoResolution,[.5,.75,1],s.aoResolution),depthOfField:sd(i.depthOfField,0,150,5,s.depthOfField),transmission:Hn(i.transmission,[.25,.5,.75,1],s.transmission),anisotropy:Hn(i.anisotropy,[1,2,4,8,16],s.anisotropy)}}function df(n){return Object.keys(Ur).find(e=>Object.entries(Ur[e]).every(([t,i])=>n[t]===i))??"custom"}function b0(n,e,t,i,s,r,a=8294400){const o=Math.min(s,n.pixelRatio)*i*n.scale/100,l=Math.min(o,Math.sqrt(a/Math.max(1,e*t)),r/Math.max(1,e,t));return{ratio:l,width:Math.max(1,Math.floor(e*l)),height:Math.max(1,Math.floor(t*l)),limited:l<o-1e-4}}const Qo=!1,rd=()=>window.rhineWallpaperHost;function S0(n){return!0}function uf(n,e,t,i){return`<select ${n} aria-label="${e}">${i.map(([s,r])=>`<option value="${s}" ${s===t?"selected":""}>${r}</option>`).join("")}${t==="custom"?'<option value="custom" disabled selected>自定义</option>':""}</select>`}function kn(n,e,t,i,s){return`<label class="quality-control"><span>${t}<small>${i}</small></span>${uf(`data-quality="${e}"`,t,n[e],s)}</label>`}function ad(n,e,t,i,s,r){return`<label class="quality-control quality-range"><span>${t}<small>${i}</small></span><div><input type="range" data-quality="${e}" aria-label="${t}" min="${s}" max="${r}" step="5" value="${n[e]}"/><output data-quality-output="${e}">${n[e]}%</output></div></label>`}function E0(n){const e=df(n);return`<section class="quality-settings" aria-label="画质设置">
    <div class="quality-heading"><h3>RENDER QUALITY <span>渲染画质</span></h3>${uf('id="quality-preset"',"画质预设",e,Object.keys(nd).map(t=>[t,nd[t]]))}</div>
    <p class="quality-summary" id="quality-summary" aria-live="polite"></p>
    <details class="quality-advanced"><summary>精细设置 <span>清晰度 / 材质 / 阴影</span></summary><div class="quality-grid">
    ${ad(n,"scale","渲染比例","相对屏幕像素，受密度上限限制；高比例改善细线",50,200)}
    ${kn(n,"pixelRatio","像素密度上限","控制高密度屏幕的原生像素倍率",[1,1.5,2,3].map(t=>[t,`${t}×`]))}
    ${kn(n,"antialias","抗锯齿","SMAA 平滑模型边缘与后处理结果",[["off","原始"],["smaa","SMAA"]])}
    ${kn(n,"anisotropy","纹理过滤","改善倾斜视角下的标签细节",[1,2,4,8,16].map(t=>[t,`${t}×`]))}
    ${kn(n,"transmission","透明材质分辨率","控制盖板折射画面的清晰度",[.25,.5,.75,1].map(t=>[t,`${t*100}%`]))}
    ${kn(n,"shadows","阴影分辨率 · 阵列","更高分辨率保留更细的投影边缘",[[0,"关闭"],[1024,"1024"],[2048,"2048"],[4096,"4096"]])}
    ${kn(n,"aoSamples","环境遮蔽 · 阵列","采样越多，接缝暗部越细腻",[[0,"关闭"],[16,"16 采样"],[32,"32 采样"],[64,"64 采样"]])}
    ${kn(n,"aoResolution","遮蔽分辨率 · 阵列","降低可减轻环境遮蔽的渲染负担",[.5,.75,1].map(t=>[t,`${t*100}%`]))}
    ${ad(n,"depthOfField","景深强度 · 阵列","0% 关闭；100% 保留原始镜头虚化",0,150)}
    </div></details><p class="quality-note">即时生效并自动保存。清晰度与材质设置同步至 360° 查看器。高渲染比例更适合静态观察；缓冲上限为 829 万像素，硬件限制时自动收敛。</p>
  </section>`}function w0(n){const e=document.querySelector("#quality-preset");e&&(e.value=df(n),document.querySelectorAll("[data-quality]").forEach(t=>{const i=t.dataset.quality;t.value=String(n[i]),t.disabled=i==="aoResolution"&&n.aoSamples===0}),document.querySelectorAll("[data-quality-choices]").forEach(t=>{const i=JSON.parse(t.dataset.qualityChoices);t.querySelector("[data-quality-label]").textContent=i.find(([s])=>String(s)===t.value)?.[1]??"自定义"}),document.querySelectorAll("[data-quality-output]").forEach(t=>{t.value=`${n[t.dataset.qualityOutput]}%`}))}const T0={scale:60,pixelRatio:1,antialias:"off",shadows:0,aoSamples:0,aoResolution:.5,depthOfField:0,transmission:.25,anisotropy:2};function C0(n,e){n=Math.max(1,n),e=Math.max(1,e);const t=Math.min(e/1080,n/1280);return{width:n/t,height:e/t,scale:t,kind:"opening"}}function R0(n,e,t,i=!1){if(n=Math.max(1,n),e=Math.max(1,e),i)return{width:1920,height:1080,scale:Math.min(n/1920,e/1080),kind:"cinematic"};const s=n/e<1.05,r=s||n<1100||t&&e<600,a=r?1:e/1080;return{width:n/a,height:e/a,scale:a,kind:s?"portrait":r?"compact":"desktop"}}function D0(n,e,t,i,s){const r=n/e,a=r<1.05,o=t+(5.9-t)*i,l=Math.max(6.3/r,3.7*e/Math.max(100,.54*e-156));return{span:a?Math.max(o,8.4/r+(l-8.4/r)*i):Math.max(o,o*(16/9)/r),portrait:a,previewY:a?.36:.5,detailX:a?.5:s?.27:550/1920,detailY:a?.27+34/e:s?.49:560/1080}}var P0={"assets/archive-cassette.glb":"assets/archive-cassette.dda42b9b3b471d11.glb","assets/archive-assembly.glb":"assets/archive-assembly.d411170676f55a32.glb"};const $n=n=>{const e=n.replace(/^\//,"");return`/RhineStarRail/${P0[e]??e}`};let Qn,wi,lh=!1,Tn=!1,ff=!1,ql=!1,Zl=()=>{};const od=()=>matchMedia("(display-mode: standalone)").matches||!!navigator.standalone,L0=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),Qn=n,xi()});window.addEventListener("appinstalled",()=>{Qn=void 0,xi()});matchMedia("(display-mode: standalone)").addEventListener("change",xi);function pf(){const n=window.isSecureContext?"serviceWorker"in navigator?Tn?"离线副本未能保存，可联网后重试。":lh?"离线资源已就绪，可离线浏览档案与模型。":"正在准备离线资源，首次需要保持联网。":"当前浏览器支持在线使用。":"使用 HTTPS 地址后可保存离线副本。";return`<section id="pwa-settings" class="pwa-settings" aria-label="主屏幕与离线使用"><h3>APP / 主屏幕与离线</h3><p>${od()?"已从主屏幕打开。":L0()?"在 Safari 中轻点“分享”→“添加到主屏幕”，然后从主屏幕图标打开。":Qn?"安装后可在独立窗口中打开档案。":"可通过浏览器菜单安装或添加到主屏幕。"}</p><p class="pwa-status" role="status">${n}</p><div class="pwa-actions">${Qn&&!od()?'<button data-pwa-action="install">安装到设备 ↗</button>':""}${wi?.waiting?'<span>新版本已准备好</span><button data-pwa-action="update">更新并重启 ↻</button>':""}${Tn?'<button data-pwa-action="retry">重试保存离线资源 ↻</button>':""}</div></section>`}function xi(){const n=document.querySelector("#pwa-settings");n&&(n.outerHTML=pf()),document.documentElement.dataset.offlineReady=String(lh);const e=document.querySelector("#pwa-update-notice"),t=!!wi?.waiting;e&&(e.hidden=!t);const i=document.querySelector("#stage");i&&(i.dataset.pwaUpdate=String(t))}async function mf(n){if(Zl=n,!(ql||!window.isSecureContext||!("serviceWorker"in navigator))){ql=!0;try{wi=await navigator.serviceWorker.register($n("sw.js"),{scope:"/RhineStarRail/",updateViaCache:"none"});const e=()=>{const i=wi?.installing;i&&i.addEventListener("statechange",()=>{i.state==="installed"?(Tn=!1,xi()):i.state==="redundant"&&!wi?.active&&(Tn=!0,xi())})};wi.addEventListener("updatefound",e),e(),xi(),navigator.serviceWorker.ready.then(()=>{lh=!0,Tn=!1,xi()});let t=Date.now();document.addEventListener("visibilitychange",()=>{!document.hidden&&Date.now()-t>36e5&&(t=Date.now(),wi?.update().catch(()=>{}))})}catch{Tn=!0}xi()}}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("controllerchange",()=>{ff?location.reload():xi()});document.addEventListener("click",async n=>{const e=n.target.closest("[data-pwa-action]");if(e){if(e.dataset.pwaAction==="install"&&Qn){const t=Qn;Qn=void 0;try{await t.prompt(),await t.userChoice}catch{Zl("请通过浏览器菜单添加到主屏幕")}xi()}if(e.dataset.pwaAction==="update"&&wi?.waiting&&(ff=!0,e.disabled=!0,wi.waiting.postMessage({type:"RHINE_APPLY_UPDATE"})),e.dataset.pwaAction==="retry")if(Tn=!1,xi(),wi)try{await wi.update()}catch{Tn=!0,xi()}else ql=!1,mf(Zl)}});const ch="183",Is={ROTATE:0,DOLLY:1,PAN:2},Cn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},I0=0,ld=1,N0=2,qa=1,gf=2,Cr=3,Zi=0,Jt=1,Vi=2,zt=0,Ns=1,cd=2,hd=3,dd=4,hh=5,zi=100,O0=101,U0=102,B0=103,F0=104,Kl=200,Af=201,H0=202,k0=203,oo=204,Br=205,vf=206,V0=207,xf=208,z0=209,G0=210,W0=211,X0=212,Y0=213,j0=214,Ql=0,Jl=1,$l=2,zs=3,ec=4,tc=5,ic=6,nc=7,dh=0,q0=1,Z0=2,ji=0,uh=1,fh=2,ph=3,Kr=4,mh=5,gh=6,Ah=7,ud="attached",K0="detached",_f=300,es=301,Gs=302,Jo=303,$o=304,To=306,In=1e3,Gi=1001,lo=1002,bt=1003,Mf=1004,Rr=1005,It=1006,Za=1007,cn=1008,ci=1009,yf=1010,bf=1011,Fr=1012,vh=1013,Ki=1014,hi=1015,ti=1016,xh=1017,_h=1018,Ws=1020,Sf=35902,Ef=35899,wf=1021,Tf=1022,_i=1023,un=1026,Rn=1027,Co=1028,Mh=1029,Xs=1030,yh=1031,bh=1033,Ka=33776,Qa=33777,Ja=33778,$a=33779,sc=35840,rc=35841,ac=35842,oc=35843,lc=36196,cc=37492,hc=37496,dc=37488,uc=37489,fc=37490,pc=37491,mc=37808,gc=37809,Ac=37810,vc=37811,xc=37812,_c=37813,Mc=37814,yc=37815,bc=37816,Sc=37817,Ec=37818,wc=37819,Tc=37820,Cc=37821,Rc=36492,Dc=36494,Pc=36495,Lc=36283,Ic=36284,Nc=36285,Oc=36286,Hr=2300,kr=2301,el=2302,fd=2303,pd=2400,md=2401,gd=2402,Q0=2500,J0=0,Cf=1,Uc=2,$0=3200,em=3201,Ro=0,tm=1,En="",Lt="srgb",ii="srgb-linear",co="linear",lt="srgb",cs=7680,Ad=519,im=512,nm=513,sm=514,Sh=515,rm=516,am=517,Eh=518,om=519,Bc=35044,oa=35048,vd="300 es",Wi=2e3,Vr=2001;function lm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function cm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function zr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function hm(){const n=zr("canvas");return n.style.display="block",n}const xd={};function ho(...n){const e="THREE."+n.shift();console.log(e,...n)}function Rf(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ce(...n){n=Rf(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ue(...n){n=Rf(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function uo(...n){const e=n.join(" ");e in xd||(xd[e]=!0,Ce(...n))}function dm(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const um={[Ql]:Jl,[$l]:ic,[ec]:nc,[zs]:tc,[Jl]:Ql,[ic]:$l,[nc]:ec,[tc]:zs};class ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _d=1234567;const Pr=Math.PI/180,Ys=180/Math.PI;function Di(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[i&255]+Xt[i>>8&255]+Xt[i>>16&255]+Xt[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function wh(n,e){return(n%e+e)%e}function fm(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function pm(n,e,t){return n!==e?(t-n)/(e-n):0}function Lr(n,e,t){return(1-t)*n+t*e}function mm(n,e,t,i){return Lr(n,e,1-Math.exp(-t*i))}function gm(n,e=1){return e-Math.abs(wh(n,e*2)-e)}function Am(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function vm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function xm(n,e){return n+Math.floor(Math.random()*(e-n+1))}function _m(n,e){return n+Math.random()*(e-n)}function Mm(n){return n*(.5-Math.random())}function ym(n){n!==void 0&&(_d=n);let e=_d+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function bm(n){return n*Pr}function Sm(n){return n*Ys}function Em(n){return(n&n-1)===0&&n!==0}function wm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Tm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Cm(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),u=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),m=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*u,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*m,l*f,o*c);break;case"YXY":n.set(l*f,o*h,l*m,o*c);break;case"ZYZ":n.set(l*m,l*f,o*h,o*c);break;default:Ce("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ti(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function dt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ne={DEG2RAD:Pr,RAD2DEG:Ys,generateUUID:Di,clamp:Ze,euclideanModulo:wh,mapLinear:fm,inverseLerp:pm,lerp:Lr,damp:mm,pingpong:gm,smoothstep:Am,smootherstep:vm,randInt:xm,randFloat:_m,randFloatSpread:Mm,seededRandom:ym,degToRad:bm,radToDeg:Sm,isPowerOfTwo:Em,ceilPowerOfTwo:wm,floorPowerOfTwo:Tm,setQuaternionFromProperEuler:Cm,normalize:dt,denormalize:Ti};class De{constructor(e=0,t=0){De.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],m=r[a+2],A=r[a+3];if(u!==A||l!==d||c!==f||h!==m){let p=l*d+c*f+h*m+u*A;p<0&&(d=-d,f=-f,m=-m,A=-A,p=-p);let g=1-o;if(p<.9995){const _=Math.acos(p),E=Math.sin(_);g=Math.sin(g*_)/E,o=Math.sin(o*_)/E,l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+A*o}else{l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+A*o;const _=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=_,c*=_,h*=_,u*=_}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),d=l(i/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Md.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Md.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return tl.copy(this).projectOnVector(e),this.sub(tl)}reflect(e){return this.sub(tl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const tl=new P,Md=new Pi;class We{constructor(e,t,i,s,r,a,o,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],A=s[0],p=s[3],g=s[6],_=s[1],E=s[4],M=s[7],b=s[2],w=s[5],D=s[8];return r[0]=a*A+o*_+l*b,r[3]=a*p+o*E+l*w,r[6]=a*g+o*M+l*D,r[1]=c*A+h*_+u*b,r[4]=c*p+h*E+u*w,r[7]=c*g+h*M+u*D,r[2]=d*A+f*_+m*b,r[5]=d*p+f*E+m*w,r[8]=d*g+f*M+m*D,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/m;return e[0]=u*A,e[1]=(s*c-h*i)*A,e[2]=(o*i-s*a)*A,e[3]=d*A,e[4]=(h*t-s*l)*A,e[5]=(s*r-o*t)*A,e[6]=f*A,e[7]=(i*l-c*t)*A,e[8]=(a*t-i*r)*A,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(il.makeScale(e,t)),this}rotate(e){return this.premultiply(il.makeRotation(-e)),this}translate(e,t){return this.premultiply(il.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const il=new We,yd=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bd=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Rm(){const n={enabled:!0,workingColorSpace:ii,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=dn(s.r),s.g=dn(s.g),s.b=dn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=Os(s.r),s.g=Os(s.g),s.b=Os(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===En?co:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return uo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return uo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ii]:{primaries:e,whitePoint:i,transfer:co,toXYZ:yd,fromXYZ:bd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:yd,fromXYZ:bd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),n}const $e=Rm();function dn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Os(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let hs;class Dm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{hs===void 0&&(hs=zr("canvas")),hs.width=e.width,hs.height=e.height;const s=hs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=hs}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=zr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=dn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(dn(t[i]/255)*255):t[i]=dn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Pm=0;class Th{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=Di(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(nl(s[a].image)):r.push(nl(s[a]))}else r=nl(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function nl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let Lm=0;const sl=new P;class St extends ss{constructor(e=St.DEFAULT_IMAGE,t=St.DEFAULT_MAPPING,i=Gi,s=Gi,r=It,a=cn,o=_i,l=ci,c=St.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=Di(),this.name="",this.source=new Th(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new De(0,0),this.repeat=new De(1,1),this.center=new De(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(sl).x}get height(){return this.source.getSize(sl).y}get depth(){return this.source.getSize(sl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_f)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case In:e.x=e.x-Math.floor(e.x);break;case Gi:e.x=e.x<0?0:1;break;case lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case In:e.y=e.y-Math.floor(e.y);break;case Gi:e.y=e.y<0?0:1;break;case lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=_f;St.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,i=0,s=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],A=l[2],p=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-A)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+A)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,M=(f+1)/2,b=(g+1)/2,w=(h+d)/4,D=(u+A)/4,x=(m+p)/4;return E>M&&E>b?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=w/i,r=D/i):M>b?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=w/s,r=x/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=D/r,s=x/r),this.set(i,s,r,t),this}let _=Math.sqrt((p-m)*(p-m)+(u-A)*(u-A)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(p-m)/_,this.y=(u-A)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Im extends ss{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new St(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:It,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Th(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qt extends Im{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Df extends St{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nm extends St{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ve{constructor(e,t,i,s,r,a,o,l,c,h,u,d,f,m,A,p){Ve.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,d,f,m,A,p)}set(e,t,i,s,r,a,o,l,c,h,u,d,f,m,A,p){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=m,g[11]=A,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ve().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/ds.setFromMatrixColumn(e,0).length(),r=1/ds.setFromMatrixColumn(e,1).length(),a=1/ds.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,m=o*h,A=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-A*c,t[9]=-o*l,t[2]=A-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,m=c*h,A=c*u;t[0]=d+A*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=A+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,m=c*h,A=c*u;t[0]=d-A*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=A-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,m=o*h,A=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+A,t[1]=l*u,t[5]=A*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,m=o*l,A=o*c;t[0]=l*h,t[4]=A-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-A*u}else if(e.order==="XZY"){const d=a*l,f=a*c,m=o*l,A=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+A,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=A*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Om,e,Um)}lookAt(e,t,i){const s=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),gn.crossVectors(i,oi),gn.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),gn.crossVectors(i,oi)),gn.normalize(),la.crossVectors(oi,gn),s[0]=gn.x,s[4]=la.x,s[8]=oi.x,s[1]=gn.y,s[5]=la.y,s[9]=oi.y,s[2]=gn.z,s[6]=la.z,s[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],A=i[6],p=i[10],g=i[14],_=i[3],E=i[7],M=i[11],b=i[15],w=s[0],D=s[4],x=s[8],S=s[12],N=s[1],R=s[5],U=s[9],H=s[13],j=s[2],V=s[6],k=s[10],B=s[14],$=s[3],K=s[7],ae=s[11],he=s[15];return r[0]=a*w+o*N+l*j+c*$,r[4]=a*D+o*R+l*V+c*K,r[8]=a*x+o*U+l*k+c*ae,r[12]=a*S+o*H+l*B+c*he,r[1]=h*w+u*N+d*j+f*$,r[5]=h*D+u*R+d*V+f*K,r[9]=h*x+u*U+d*k+f*ae,r[13]=h*S+u*H+d*B+f*he,r[2]=m*w+A*N+p*j+g*$,r[6]=m*D+A*R+p*V+g*K,r[10]=m*x+A*U+p*k+g*ae,r[14]=m*S+A*H+p*B+g*he,r[3]=_*w+E*N+M*j+b*$,r[7]=_*D+E*R+M*V+b*K,r[11]=_*x+E*U+M*k+b*ae,r[15]=_*S+E*H+M*B+b*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],A=e[7],p=e[11],g=e[15],_=l*f-c*d,E=o*f-c*u,M=o*d-l*u,b=a*f-c*h,w=a*d-l*h,D=a*u-o*h;return t*(A*_-p*E+g*M)-i*(m*_-p*b+g*w)+s*(m*E-A*b+g*D)-r*(m*M-A*w+p*D)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],A=e[13],p=e[14],g=e[15],_=t*o-i*a,E=t*l-s*a,M=t*c-r*a,b=i*l-s*o,w=i*c-r*o,D=s*c-r*l,x=h*A-u*m,S=h*p-d*m,N=h*g-f*m,R=u*p-d*A,U=u*g-f*A,H=d*g-f*p,j=_*H-E*U+M*R+b*N-w*S+D*x;if(j===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/j;return e[0]=(o*H-l*U+c*R)*V,e[1]=(s*U-i*H-r*R)*V,e[2]=(A*D-p*w+g*b)*V,e[3]=(d*w-u*D-f*b)*V,e[4]=(l*N-a*H-c*S)*V,e[5]=(t*H-s*N+r*S)*V,e[6]=(p*M-m*D-g*E)*V,e[7]=(h*D-d*M+f*E)*V,e[8]=(a*U-o*N+c*x)*V,e[9]=(i*N-t*U-r*x)*V,e[10]=(m*w-A*M+g*_)*V,e[11]=(u*M-h*w-f*_)*V,e[12]=(o*S-a*R-l*x)*V,e[13]=(t*R-i*S+s*x)*V,e[14]=(A*E-m*b-p*_)*V,e[15]=(h*b-u*E+d*_)*V,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,A=a*h,p=a*u,g=o*u,_=l*c,E=l*h,M=l*u,b=i.x,w=i.y,D=i.z;return s[0]=(1-(A+g))*b,s[1]=(f+M)*b,s[2]=(m-E)*b,s[3]=0,s[4]=(f-M)*w,s[5]=(1-(d+g))*w,s[6]=(p+_)*w,s[7]=0,s[8]=(m+E)*D,s[9]=(p-_)*D,s[10]=(1-(d+A))*D,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let a=ds.set(s[0],s[1],s[2]).length();const o=ds.set(s[4],s[5],s[6]).length(),l=ds.set(s[8],s[9],s[10]).length();r<0&&(a=-a),yi.copy(this);const c=1/a,h=1/o,u=1/l;return yi.elements[0]*=c,yi.elements[1]*=c,yi.elements[2]*=c,yi.elements[4]*=h,yi.elements[5]*=h,yi.elements[6]*=h,yi.elements[8]*=u,yi.elements[9]*=u,yi.elements[10]*=u,t.setFromRotationMatrix(yi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=Wi,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let m,A;if(l)m=r/(a-r),A=a*r/(a-r);else if(o===Wi)m=-(a+r)/(a-r),A=-2*a*r/(a-r);else if(o===Vr)m=-a/(a-r),A=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=A,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Wi,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let m,A;if(l)m=1/(a-r),A=a/(a-r);else if(o===Wi)m=-2/(a-r),A=-(a+r)/(a-r);else if(o===Vr)m=-1/(a-r),A=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=A,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ds=new P,yi=new Ve,Om=new P(0,0,0),Um=new P(1,1,1),gn=new P,la=new P,oi=new P,Sd=new Ve,Ed=new Pi;class Li{constructor(e=0,t=0,i=0,s=Li.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Sd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ed.setFromEuler(this),this.setFromQuaternion(Ed,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Li.DEFAULT_ORDER="XYZ";class Ch{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Bm=0;const wd=new P,us=new Pi,tn=new Ve,ca=new P,fr=new P,Fm=new P,Hm=new Pi,Td=new P(1,0,0),Cd=new P(0,1,0),Rd=new P(0,0,1),Dd={type:"added"},km={type:"removed"},fs={type:"childadded",child:null},rl={type:"childremoved",child:null};class Mt extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bm++}),this.uuid=Di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new P,t=new Li,i=new Pi,s=new P(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ve},normalMatrix:{value:new We}}),this.matrix=new Ve,this.matrixWorld=new Ve,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ch,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.multiply(us),this}rotateOnWorldAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.premultiply(us),this}rotateX(e){return this.rotateOnAxis(Td,e)}rotateY(e){return this.rotateOnAxis(Cd,e)}rotateZ(e){return this.rotateOnAxis(Rd,e)}translateOnAxis(e,t){return wd.copy(e).applyQuaternion(this.quaternion),this.position.add(wd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Td,e)}translateY(e){return this.translateOnAxis(Cd,e)}translateZ(e){return this.translateOnAxis(Rd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(tn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ca.copy(e):ca.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?tn.lookAt(fr,ca,this.up):tn.lookAt(ca,fr,this.up),this.quaternion.setFromRotationMatrix(tn),s&&(tn.extractRotation(s.matrixWorld),us.setFromRotationMatrix(tn),this.quaternion.premultiply(us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ue("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dd),fs.child=e,this.dispatchEvent(fs),fs.child=null):Ue("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(km),rl.child=e,this.dispatchEvent(rl),rl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dd),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,e,Fm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,Hm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Mt.DEFAULT_UP=new P(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Xi extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vm={type:"move"};class al{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const A of e.hand.values()){const p=t.getJointPose(A,i),g=this._getHandJoint(c,A);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vm)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Xi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Pf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},An={h:0,s:0,l:0},ha={h:0,s:0,l:0};function ol(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class we{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=$e.workingColorSpace){if(e=wh(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ol(a,r,e+1/3),this.g=ol(a,r,e),this.b=ol(a,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function i(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const i=Pf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=dn(e.r),this.g=dn(e.g),this.b=dn(e.b),this}copyLinearToSRGB(e){return this.r=Os(e.r),this.g=Os(e.g),this.b=Os(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return $e.workingToColorSpace(Yt.copy(this),e),Math.round(Ze(Yt.r*255,0,255))*65536+Math.round(Ze(Yt.g*255,0,255))*256+Math.round(Ze(Yt.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Yt.copy(this),t);const i=Yt.r,s=Yt.g,r=Yt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=Lt){$e.workingToColorSpace(Yt.copy(this),e);const t=Yt.r,i=Yt.g,s=Yt.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(An),this.setHSL(An.h+e,An.s+t,An.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(An),e.getHSL(ha);const i=Lr(An.h,ha.h,t),s=Lr(An.s,ha.s,t),r=Lr(An.l,ha.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new we;we.NAMES=Pf;class Do{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new we(e),this.near=t,this.far=i}clone(){return new Do(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Po extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Li,this.environmentIntensity=1,this.environmentRotation=new Li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const bi=new P,nn=new P,ll=new P,sn=new P,ps=new P,ms=new P,Pd=new P,cl=new P,hl=new P,dl=new P,ul=new yt,fl=new yt,pl=new yt;class Ci{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),bi.subVectors(e,t),s.cross(bi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){bi.subVectors(s,t),nn.subVectors(i,t),ll.subVectors(e,t);const a=bi.dot(bi),o=bi.dot(nn),l=bi.dot(ll),c=nn.dot(nn),h=nn.dot(ll),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,sn)===null?!1:sn.x>=0&&sn.y>=0&&sn.x+sn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,sn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,sn.x),l.addScaledVector(a,sn.y),l.addScaledVector(o,sn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ul.setScalar(0),fl.setScalar(0),pl.setScalar(0),ul.fromBufferAttribute(e,t),fl.fromBufferAttribute(e,i),pl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ul,r.x),a.addScaledVector(fl,r.y),a.addScaledVector(pl,r.z),a}static isFrontFacing(e,t,i,s){return bi.subVectors(i,t),nn.subVectors(e,t),bi.cross(nn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bi.subVectors(this.c,this.b),nn.subVectors(this.a,this.b),bi.cross(nn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ci.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ci.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Ci.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Ci.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ci.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;ps.subVectors(s,i),ms.subVectors(r,i),cl.subVectors(e,i);const l=ps.dot(cl),c=ms.dot(cl);if(l<=0&&c<=0)return t.copy(i);hl.subVectors(e,s);const h=ps.dot(hl),u=ms.dot(hl);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(ps,a);dl.subVectors(e,r);const f=ps.dot(dl),m=ms.dot(dl);if(m>=0&&f<=m)return t.copy(r);const A=f*c-l*m;if(A<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(ms,o);const p=h*m-f*u;if(p<=0&&u-h>=0&&f-m>=0)return Pd.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Pd,o);const g=1/(p+A+d);return a=A*g,o=d*g,t.copy(i).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ii{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Si.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Si.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Si.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Si):Si.fromBufferAttribute(r,a),Si.applyMatrix4(e.matrixWorld),this.expandByPoint(Si);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),da.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),da.copy(i.boundingBox)),da.applyMatrix4(e.matrixWorld),this.union(da)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Si),Si.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(pr),ua.subVectors(this.max,pr),gs.subVectors(e.a,pr),As.subVectors(e.b,pr),vs.subVectors(e.c,pr),vn.subVectors(As,gs),xn.subVectors(vs,As),Vn.subVectors(gs,vs);let t=[0,-vn.z,vn.y,0,-xn.z,xn.y,0,-Vn.z,Vn.y,vn.z,0,-vn.x,xn.z,0,-xn.x,Vn.z,0,-Vn.x,-vn.y,vn.x,0,-xn.y,xn.x,0,-Vn.y,Vn.x,0];return!ml(t,gs,As,vs,ua)||(t=[1,0,0,0,1,0,0,0,1],!ml(t,gs,As,vs,ua))?!1:(fa.crossVectors(vn,xn),t=[fa.x,fa.y,fa.z],ml(t,gs,As,vs,ua))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Si).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Si).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const rn=[new P,new P,new P,new P,new P,new P,new P,new P],Si=new P,da=new Ii,gs=new P,As=new P,vs=new P,vn=new P,xn=new P,Vn=new P,pr=new P,ua=new P,fa=new P,zn=new P;function ml(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){zn.fromArray(n,r);const o=s.x*Math.abs(zn.x)+s.y*Math.abs(zn.y)+s.z*Math.abs(zn.z),l=e.dot(zn),c=t.dot(zn),h=i.dot(zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Pt=new P,pa=new De;let zm=0;class $t{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Bc,this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)pa.fromBufferAttribute(this,t),pa.applyMatrix3(e),this.setXY(t,pa.x,pa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ti(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=dt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ti(t,this.array)),t}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ti(t,this.array)),t}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ti(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ti(t,this.array)),t}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array),s=dt(s,this.array),r=dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Bc&&(e.usage=this.usage),e}}class Lf extends $t{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class If extends $t{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ui extends $t{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Gm=new Ii,mr=new P,gl=new P;class Qi{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Gm.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mr.subVectors(e,this.center);const t=mr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(mr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mr.copy(e.center).add(gl)),this.expandByPoint(mr.copy(e.center).sub(gl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Wm=0;const mi=new Ve,Al=new Mt,xs=new P,li=new Ii,gr=new Ii,Ht=new P;class pi extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=Di(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lm(e)?If:Lf)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new We().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return mi.makeRotationFromQuaternion(e),this.applyMatrix4(mi),this}rotateX(e){return mi.makeRotationX(e),this.applyMatrix4(mi),this}rotateY(e){return mi.makeRotationY(e),this.applyMatrix4(mi),this}rotateZ(e){return mi.makeRotationZ(e),this.applyMatrix4(mi),this}translate(e,t,i){return mi.makeTranslation(e,t,i),this.applyMatrix4(mi),this}scale(e,t,i){return mi.makeScale(e,t,i),this.applyMatrix4(mi),this}lookAt(e){return Al.lookAt(e),Al.updateMatrix(),this.applyMatrix4(Al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ui(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ii);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];li.setFromBufferAttribute(r),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(li.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(li.min,gr.min),li.expandByPoint(Ht),Ht.addVectors(li.max,gr.max),li.expandByPoint(Ht)):(li.expandByPoint(gr.min),li.expandByPoint(gr.max))}li.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ht.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ht));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ht.fromBufferAttribute(o,c),l&&(xs.fromBufferAttribute(e,c),Ht.add(xs)),s=Math.max(s,i.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new P,l[x]=new P;const c=new P,h=new P,u=new P,d=new De,f=new De,m=new De,A=new P,p=new P;function g(x,S,N){c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,S),u.fromBufferAttribute(i,N),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,S),m.fromBufferAttribute(r,N),h.sub(c),u.sub(c),f.sub(d),m.sub(d);const R=1/(f.x*m.y-m.x*f.y);isFinite(R)&&(A.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(R),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(R),o[x].add(A),o[S].add(A),o[N].add(A),l[x].add(p),l[S].add(p),l[N].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let x=0,S=_.length;x<S;++x){const N=_[x],R=N.start,U=N.count;for(let H=R,j=R+U;H<j;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const E=new P,M=new P,b=new P,w=new P;function D(x){b.fromBufferAttribute(s,x),w.copy(b);const S=o[x];E.copy(S),E.sub(b.multiplyScalar(b.dot(S))).normalize(),M.crossVectors(w,S);const R=M.dot(l[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,R)}for(let x=0,S=_.length;x<S;++x){const N=_[x],R=N.start,U=N.count;for(let H=R,j=R+U;H<j;H+=3)D(e.getX(H+0)),D(e.getX(H+1)),D(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new $t(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),A=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,A),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,A),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(A,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,m=0;for(let A=0,p=l.length;A<p;A++){o.isInterleavedBufferAttribute?f=l[A]*o.data.stride+o.offset:f=l[A]*h;for(let g=0;g<h;g++)d[m++]=c[f++]}return new $t(d,h,u)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new pi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Bc,this.updateRanges=[],this.version=0,this.uuid=Di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Zt=new P;class Rh{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Ti(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=dt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ti(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ti(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ti(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ti(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array),s=dt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=dt(t,this.array),i=dt(i,this.array),s=dt(s,this.array),r=dt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ho("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new $t(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Rh(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ho("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Ym=0;class fi extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=Di(),this.name="",this.type="Material",this.blending=Ns,this.side=Zi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oo,this.blendDst=Br,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new we(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ad,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cs,this.stencilZFail=cs,this.stencilZPass=cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ns&&(i.blending=this.blending),this.side!==Zi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==oo&&(i.blendSrc=this.blendSrc),this.blendDst!==Br&&(i.blendDst=this.blendDst),this.blendEquation!==zi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ad&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==cs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==cs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==cs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const an=new P,vl=new P,ma=new P,_n=new P,xl=new P,ga=new P,_l=new P;class tr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,an)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=an.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(an.copy(this.origin).addScaledVector(this.direction,t),an.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){vl.copy(e).add(t).multiplyScalar(.5),ma.copy(t).sub(e).normalize(),_n.copy(this.origin).sub(vl);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ma),o=_n.dot(this.direction),l=-_n.dot(ma),c=_n.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){const A=1/h;u*=A,d*=A,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(vl).addScaledVector(ma,d),f}intersectSphere(e,t){an.subVectors(e.center,this.origin);const i=an.dot(this.direction),s=an.dot(an)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,an)!==null}intersectTriangle(e,t,i,s,r){xl.subVectors(t,e),ga.subVectors(i,e),_l.crossVectors(xl,ga);let a=this.direction.dot(_l),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_n.subVectors(this.origin,e);const l=o*this.direction.dot(ga.crossVectors(_n,ga));if(l<0)return null;const c=o*this.direction.dot(xl.cross(_n));if(c<0||l+c>a)return null;const h=-o*_n.dot(_l);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Yi extends fi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Li,this.combine=dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ld=new Ve,Gn=new tr,Aa=new Qi,Id=new P,va=new P,xa=new P,_a=new P,Ml=new P,Ma=new P,Nd=new P,ya=new P;class at extends Mt{constructor(e=new pi,t=new Yi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Ml.fromBufferAttribute(u,e),a?Ma.addScaledVector(Ml,h):Ma.addScaledVector(Ml.sub(t),h))}t.add(Ma)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Aa.copy(i.boundingSphere),Aa.applyMatrix4(r),Gn.copy(e.ray).recast(e.near),!(Aa.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(Aa,Id)===null||Gn.origin.distanceToSquared(Id)>(e.far-e.near)**2))&&(Ld.copy(r).invert(),Gn.copy(e.ray).applyMatrix4(Ld),!(i.boundingBox!==null&&Gn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Gn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,A=d.length;m<A;m++){const p=d[m],g=a[p.materialIndex],_=Math.max(p.start,f.start),E=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let M=_,b=E;M<b;M+=3){const w=o.getX(M),D=o.getX(M+1),x=o.getX(M+2);s=ba(this,g,e,i,c,h,u,w,D,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),A=Math.min(o.count,f.start+f.count);for(let p=m,g=A;p<g;p+=3){const _=o.getX(p),E=o.getX(p+1),M=o.getX(p+2);s=ba(this,a,e,i,c,h,u,_,E,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,A=d.length;m<A;m++){const p=d[m],g=a[p.materialIndex],_=Math.max(p.start,f.start),E=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let M=_,b=E;M<b;M+=3){const w=M,D=M+1,x=M+2;s=ba(this,g,e,i,c,h,u,w,D,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),A=Math.min(l.count,f.start+f.count);for(let p=m,g=A;p<g;p+=3){const _=p,E=p+1,M=p+2;s=ba(this,a,e,i,c,h,u,_,E,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function jm(n,e,t,i,s,r,a,o){let l;if(e.side===Jt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Zi,o),l===null)return null;ya.copy(o),ya.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ya);return c<t.near||c>t.far?null:{distance:c,point:ya.clone(),object:n}}function ba(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,va),n.getVertexPosition(l,xa),n.getVertexPosition(c,_a);const h=jm(n,e,t,i,va,xa,_a,Nd);if(h){const u=new P;Ci.getBarycoord(Nd,va,xa,_a,u),s&&(h.uv=Ci.getInterpolatedAttribute(s,o,l,c,u,new De)),r&&(h.uv1=Ci.getInterpolatedAttribute(r,o,l,c,u,new De)),a&&(h.normal=Ci.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new P,materialIndex:0};Ci.getNormal(va,xa,_a,d.normal),h.face=d,h.barycoord=u}return h}const Od=new P,Ud=new yt,Bd=new yt,qm=new P,Fd=new Ve,Sa=new P,yl=new Qi,Hd=new Ve,bl=new tr;class Zm extends at{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ud,this.bindMatrix=new Ve,this.bindMatrixInverse=new Ve,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ii),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Sa),this.boundingBox.expandByPoint(Sa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Qi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Sa),this.boundingSphere.expandByPoint(Sa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yl.copy(this.boundingSphere),yl.applyMatrix4(s),e.ray.intersectsSphere(yl)!==!1&&(Hd.copy(s).invert(),bl.copy(e.ray).applyMatrix4(Hd),!(this.boundingBox!==null&&bl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,bl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new yt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===ud?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===K0?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ce("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;Ud.fromBufferAttribute(s.attributes.skinIndex,e),Bd.fromBufferAttribute(s.attributes.skinWeight,e),Od.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Bd.getComponent(r);if(a!==0){const o=Ud.getComponent(r);Fd.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(qm.copy(Od).applyMatrix4(Fd),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Nf extends Mt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Lo extends St{constructor(e=null,t=1,i=1,s,r,a,o,l,c=bt,h=bt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const kd=new Ve,Km=new Ve;class Dh{constructor(e=[],t=[]){this.uuid=Di(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ce("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new Ve)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new Ve;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Km;kd.multiplyMatrices(o,t[r]),kd.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Dh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Lo(t,e,e,_i,hi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let a=t[r];a===void 0&&(Ce("Skeleton: No bone found with UUID:",r),a=new Nf),this.bones.push(a),this.boneInverses.push(new Ve().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=i[s];e.boneInverses.push(o.toArray())}return e}}class Us extends $t{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const _s=new Ve,Vd=new Ve,Ea=[],zd=new Ii,Qm=new Ve,Ar=new at,vr=new Qi;class Gr extends at{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Us(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Qm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ii),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,_s),zd.copy(e.boundingBox).applyMatrix4(_s),this.boundingBox.union(zd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,_s),vr.copy(e.boundingSphere).applyMatrix4(_s),this.boundingSphere.union(vr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Ar.geometry=this.geometry,Ar.material=this.material,Ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vr.copy(this.boundingSphere),vr.applyMatrix4(i),e.ray.intersectsSphere(vr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,_s),Vd.multiplyMatrices(i,_s),Ar.matrixWorld=Vd,Ar.raycast(e,Ea);for(let a=0,o=Ea.length;a<o;a++){const l=Ea[a];l.instanceId=r,l.object=this,t.push(l)}Ea.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Us(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Lo(new Float32Array(s*this.count),s,this.count,Co,hi));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Sl=new P,Jm=new P,$m=new We;class bn{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Sl.subVectors(i,t).cross(Jm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Sl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$m.getNormalMatrix(e),s=this.coplanarPoint(Sl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wn=new Qi,eg=new De(.5,.5),wa=new P;class Io{constructor(e=new bn,t=new bn,i=new bn,s=new bn,r=new bn,a=new bn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Wi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],A=r[9],p=r[10],g=r[11],_=r[12],E=r[13],M=r[14],b=r[15];if(s[0].setComponents(c-a,f-h,g-m,b-_).normalize(),s[1].setComponents(c+a,f+h,g+m,b+_).normalize(),s[2].setComponents(c+o,f+u,g+A,b+E).normalize(),s[3].setComponents(c-o,f-u,g-A,b-E).normalize(),i)s[4].setComponents(l,d,p,M).normalize(),s[5].setComponents(c-l,f-d,g-p,b-M).normalize();else if(s[4].setComponents(c-l,f-d,g-p,b-M).normalize(),t===Wi)s[5].setComponents(c+l,f+d,g+p,b+M).normalize();else if(t===Vr)s[5].setComponents(l,d,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(e){Wn.center.set(0,0,0);const t=eg.distanceTo(e.center);return Wn.radius=.7071067811865476+t,Wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(wa.x=s.normal.x>0?e.max.x:e.min.x,wa.y=s.normal.y>0?e.max.y:e.min.y,wa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(wa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Of extends fi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new we(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const fo=new P,po=new P,Gd=new Ve,xr=new tr,Ta=new Qi,El=new P,Wd=new P;class Ph extends Mt{constructor(e=new pi,t=new Of){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)fo.fromBufferAttribute(t,s-1),po.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=fo.distanceTo(po);e.setAttribute("lineDistance",new ui(i,1))}else Ce("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ta.copy(i.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,e.ray.intersectsSphere(Ta)===!1)return;Gd.copy(s).invert(),xr.copy(e.ray).applyMatrix4(Gd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let A=f,p=m-1;A<p;A+=c){const g=h.getX(A),_=h.getX(A+1),E=Ca(this,e,xr,l,g,_,A);E&&t.push(E)}if(this.isLineLoop){const A=h.getX(m-1),p=h.getX(f),g=Ca(this,e,xr,l,A,p,m-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let A=f,p=m-1;A<p;A+=c){const g=Ca(this,e,xr,l,A,A+1,A);g&&t.push(g)}if(this.isLineLoop){const A=Ca(this,e,xr,l,m-1,f,m-1);A&&t.push(A)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ca(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(fo.fromBufferAttribute(o,s),po.fromBufferAttribute(o,r),t.distanceSqToSegment(fo,po,El,Wd)>i)return;El.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(El);if(!(c<e.near||c>e.far))return{distance:c,point:Wd.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Xd=new P,Yd=new P;class tg extends Ph{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Xd.fromBufferAttribute(t,s),Yd.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Xd.distanceTo(Yd);e.setAttribute("lineDistance",new ui(i,1))}else Ce("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ig extends Ph{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Uf extends fi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new we(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const jd=new Ve,Fc=new tr,Ra=new Qi,Da=new P;class ng extends Mt{constructor(e=new pi,t=new Uf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ra.copy(i.boundingSphere),Ra.applyMatrix4(s),Ra.radius+=r,e.ray.intersectsSphere(Ra)===!1)return;jd.copy(s).invert(),Fc.copy(e.ray).applyMatrix4(jd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,A=f;m<A;m++){const p=c.getX(m);Da.fromBufferAttribute(u,p),qd(Da,p,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,A=f;m<A;m++)Da.fromBufferAttribute(u,m),qd(Da,m,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function qd(n,e,t,i,s,r,a){const o=Fc.distanceSqToPoint(n);if(o<t){const l=new P;Fc.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Bf extends St{constructor(e=[],t=es,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wl extends St{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class js extends St{constructor(e,t,i=Ki,s,r,a,o=bt,l=bt,c,h=un,u=1){if(h!==un&&h!==Rn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Th(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class sg extends js{constructor(e,t=Ki,i=es,s,r,a=bt,o=bt,l,c=un){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Ff extends St{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ir extends pi{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ui(c,3)),this.setAttribute("normal",new ui(h,3)),this.setAttribute("uv",new ui(u,2));function m(A,p,g,_,E,M,b,w,D,x,S){const N=M/D,R=b/x,U=M/2,H=b/2,j=w/2,V=D+1,k=x+1;let B=0,$=0;const K=new P;for(let ae=0;ae<k;ae++){const he=ae*R-H;for(let ce=0;ce<V;ce++){const Le=ce*N-U;K[A]=Le*_,K[p]=he*E,K[g]=j,c.push(K.x,K.y,K.z),K[A]=0,K[p]=0,K[g]=w>0?1:-1,h.push(K.x,K.y,K.z),u.push(ce/D),u.push(1-ae/x),B+=1}}for(let ae=0;ae<x;ae++)for(let he=0;he<D;he++){const ce=d+he+V*ae,Le=d+he+V*(ae+1),tt=d+(he+1)+V*(ae+1),nt=d+(he+1)+V*ae;l.push(ce,Le,nt),l.push(Le,tt,nt),$+=6}o.addGroup(f,$,S),f+=$,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ir(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Jn extends pi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],A=[],p=[];for(let g=0;g<h;g++){const _=g*d-a;for(let E=0;E<c;E++){const M=E*u-r;m.push(M,-_,0),A.push(0,0,1),p.push(E/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let _=0;_<o;_++){const E=_+c*g,M=_+c*(g+1),b=_+1+c*(g+1),w=_+1+c*g;f.push(E,M,w),f.push(M,b,w)}this.setIndex(f),this.setAttribute("position",new ui(m,3)),this.setAttribute("normal",new ui(A,3)),this.setAttribute("uv",new ui(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jn(e.width,e.height,e.widthSegments,e.heightSegments)}}function qs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Kt(n){const e={};for(let t=0;t<n.length;t++){const i=qs(n[t]);for(const s in i)e[s]=i[s]}return e}function rg(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Hf(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const Ri={clone:qs,merge:Kt};var ag=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,og=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nt extends fi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ag,this.fragmentShader=og,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qs(e.uniforms),this.uniformsGroups=rg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class kf extends Nt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Zs extends fi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new we(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Li,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ji extends Zs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new De(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new we(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new we(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new we(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class lg extends fi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class cg extends fi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Li,this.combine=dh,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Vf extends fi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hg extends fi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Pa(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function dg(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Zd(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=n[o+l]}return s}function zf(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=n[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=n[s++];while(r!==void 0)}class nr{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];i:{e:{let a;t:{n:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break i}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ug extends nr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:pd,endingEnd:pd}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case md:r=e,o=2*t-i;break;case gd:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case md:a=e,l=2*i-t;break;case gd:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-t)/(s-t),A=m*m,p=A*m,g=-d*p+2*d*A-d*m,_=(1+d)*p+(-1.5-2*d)*A+(-.5+d)*m+1,E=(-1-f)*p+(1.5+f)*A+.5*m,M=f*p-f*A;for(let b=0;b!==o;++b)r[b]=g*a[h+b]+_*a[c+b]+E*a[l+b]+M*a[u+b];return r}}class fg extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class pg extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class mg extends nr{interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){const A=(i-t)/(s-t),p=1-A;for(let g=0;g!==o;++g)r[g]=a[c+g]*p+a[l+g]*A;return r}const f=o*2,m=e-1;for(let A=0;A!==o;++A){const p=a[c+A],g=a[l+A],_=m*f+A*2,E=d[_],M=d[_+1],b=e*f+A*2,w=u[b],D=u[b+1];let x=(i-t)/(s-t),S,N,R,U,H;for(let j=0;j<8;j++){S=x*x,N=S*x,R=1-x,U=R*R,H=U*R;const k=H*t+3*U*x*E+3*R*S*w+N*s-i;if(Math.abs(k)<1e-10)break;const B=3*U*(E-t)+6*R*x*(w-E)+3*S*(s-w);if(Math.abs(B)<1e-10)break;x=x-k/B,x=Math.max(0,Math.min(1,x))}r[A]=H*p+3*U*x*M+3*R*S*D+N*g}return r}}class Oi{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Pa(t,this.TimeBufferType),this.values=Pa(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Pa(e.times,Array),values:Pa(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new pg(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new fg(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ug(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new mg(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Hr:t=this.InterpolantFactoryMethodDiscrete;break;case kr:t=this.InterpolantFactoryMethodLinear;break;case el:t=this.InterpolantFactoryMethodSmooth;break;case fd:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ce("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hr;case this.InterpolantFactoryMethodLinear:return kr;case this.InterpolantFactoryMethodSmooth:return el;case this.InterpolantFactoryMethodBezier:return fd}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){const i=this.times,s=i.length;let r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ue("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(Ue("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){Ue("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ue("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&cm(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Ue("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===el,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const u=o*i,d=u-i,f=u+i;for(let m=0;m!==i;++m){const A=t[u+m];if(A!==t[d+m]||A!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*i,d=a*i;for(let f=0;f!==i;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Oi.prototype.ValueTypeName="";Oi.prototype.TimeBufferType=Float32Array;Oi.prototype.ValueBufferType=Float32Array;Oi.prototype.DefaultInterpolation=kr;class sr extends Oi{constructor(e,t,i){super(e,t,i)}}sr.prototype.ValueTypeName="bool";sr.prototype.ValueBufferType=Array;sr.prototype.DefaultInterpolation=Hr;sr.prototype.InterpolantFactoryMethodLinear=void 0;sr.prototype.InterpolantFactoryMethodSmooth=void 0;class Gf extends Oi{constructor(e,t,i,s){super(e,t,i,s)}}Gf.prototype.ValueTypeName="color";class Ks extends Oi{constructor(e,t,i,s){super(e,t,i,s)}}Ks.prototype.ValueTypeName="number";class gg extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Pi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Qs extends Oi{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new gg(this.times,this.values,this.getValueSize(),e)}}Qs.prototype.ValueTypeName="quaternion";Qs.prototype.InterpolantFactoryMethodSmooth=void 0;class rr extends Oi{constructor(e,t,i){super(e,t,i)}}rr.prototype.ValueTypeName="string";rr.prototype.ValueBufferType=Array;rr.prototype.DefaultInterpolation=Hr;rr.prototype.InterpolantFactoryMethodLinear=void 0;rr.prototype.InterpolantFactoryMethodSmooth=void 0;class Js extends Oi{constructor(e,t,i,s){super(e,t,i,s)}}Js.prototype.ValueTypeName="vector";class Ag{constructor(e="",t=-1,i=[],s=Q0){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Di(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(xg(i[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(Oi.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=dg(l);l=Zd(l,1,h),c=Zd(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ks(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=s[u];d||(s[u]=d=[]),d.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,i));return a}static parseAnimation(e,t){if(Ce("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Ue("AnimationClip: No animation in JSONLoader data."),null;const i=function(u,d,f,m,A){if(f.length!==0){const p=[],g=[];zf(f,p,g,m),p.length!==0&&A.push(new u(d,p,g))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let A=0;A<d[m].morphTargets.length;A++)f[d[m].morphTargets[A]]=-1;for(const A in f){const p=[],g=[];for(let _=0;_!==d[m].morphTargets.length;++_){const E=d[m];p.push(E.time),g.push(E.morphTarget===A?1:0)}s.push(new Ks(".morphTargetInfluence["+A+"]",p,g))}l=f.length*a}else{const f=".bones["+t[u].name+"]";i(Js,f+".position",d,"pos",s),i(Qs,f+".quaternion",d,"rot",s),i(Js,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function vg(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ks;case"vector":case"vector2":case"vector3":case"vector4":return Js;case"color":return Gf;case"quaternion":return Qs;case"bool":case"boolean":return sr;case"string":return rr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function xg(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=vg(n.type);if(n.times===void 0){const t=[],i=[];zf(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const hn={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(Kd(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!Kd(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function Kd(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class _g{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Mg=new _g;class ar{constructor(e){this.manager=e!==void 0?e:Mg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ar.DEFAULT_MATERIAL_NAME="__DEFAULT";const on={};class yg extends Error{constructor(e,t){super(e),this.response=t}}class Wf extends ar{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=hn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(on[e]!==void 0){on[e].push({onLoad:t,onProgress:i,onError:s});return}on[e]=[],on[e].push({onLoad:t,onProgress:i,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ce("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=on[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0;let A=0;const p=new ReadableStream({start(g){_();function _(){u.read().then(({done:E,value:M})=>{if(E)g.close();else{A+=M.byteLength;const b=new ProgressEvent("progress",{lengthComputable:m,loaded:A,total:f});for(let w=0,D=h.length;w<D;w++){const x=h[w];x.onProgress&&x.onProgress(b)}g.enqueue(M),_()}},E=>{g.error(E)})}}});return new Response(p)}else throw new yg(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{hn.add(`file:${e}`,c);const h=on[e];delete on[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=on[e];if(h===void 0)throw this.manager.itemError(e),c;delete on[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ms=new WeakMap;class bg extends ar{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=hn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Ms.get(a);u===void 0&&(u=[],Ms.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=zr("img");function l(){h(),t&&t(this);const u=Ms.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}Ms.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),hn.remove(`image:${e}`);const d=Ms.get(this)||[];for(let f=0;f<d.length;f++){const m=d[f];m.onError&&m.onError(u)}Ms.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),hn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Sg extends ar{constructor(e){super(e)}load(e,t,i,s){const r=new St,a=new bg(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Qr extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new we(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Eg extends Qr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new we(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Tl=new Ve,Qd=new P,Jd=new P;class Lh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new De(512,512),this.mapType=ci,this.map=null,this.mapPass=null,this.matrix=new Ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Io,this._frameExtents=new De(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Qd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qd),Jd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jd),t.updateMatrixWorld(),Tl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Tl,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Vr||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Tl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const La=new P,Ia=new Pi,Bi=new P;class Xf extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ve,this.projectionMatrix=new Ve,this.projectionMatrixInverse=new Ve,this.coordinateSystem=Wi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(La,Ia,Bi),Bi.x===1&&Bi.y===1&&Bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(La,Ia,Bi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(La,Ia,Bi),Bi.x===1&&Bi.y===1&&Bi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(La,Ia,Bi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Mn=new P,$d=new De,eu=new De;class Gt extends Xf{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Mn.x,Mn.y).multiplyScalar(-e/Mn.z),Mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Mn.x,Mn.y).multiplyScalar(-e/Mn.z)}getViewSize(e,t){return this.getViewBounds(e,$d,eu),t.subVectors(eu,$d)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Pr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class wg extends Lh{constructor(){super(new Gt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=Ys*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Tg extends Qr{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new wg}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Cg extends Lh{constructor(){super(new Gt(90,1,.5,500)),this.isPointLightShadow=!0}}class Yf extends Qr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Cg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Jr extends Xf{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Rg extends Lh{constructor(){super(new Jr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hc extends Qr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new Rg}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Ir{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Cl=new WeakMap;class Dg extends ar{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ce("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ce("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=hn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(Cl.has(a)===!0)s&&s(Cl.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return hn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Cl.set(l,c),hn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});hn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ys=-90,bs=1;class Pg extends Mt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Gt(ys,bs,e,t);s.layers=this.layers,this.add(s);const r=new Gt(ys,bs,e,t);r.layers=this.layers,this.add(r);const a=new Gt(ys,bs,e,t);a.layers=this.layers,this.add(a);const o=new Gt(ys,bs,e,t);o.layers=this.layers,this.add(o);const l=new Gt(ys,bs,e,t);l.layers=this.layers,this.add(l);const c=new Gt(ys,bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Wi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Vr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const A=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=A,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Lg extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Ig{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Ng.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Ng(){this._document.hidden===!1&&this.reset()}const Ih="\\[\\]\\.:\\/",Og=new RegExp("["+Ih+"]","g"),Nh="[^"+Ih+"]",Ug="[^"+Ih.replace("\\.","")+"]",Bg=/((?:WC+[\/:])*)/.source.replace("WC",Nh),Fg=/(WCOD+)?/.source.replace("WCOD",Ug),Hg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Nh),kg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Nh),Vg=new RegExp("^"+Bg+Fg+Hg+kg+"$"),zg=["material","materials","bones","map"];class Gg{constructor(e,t,i){const s=i||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class ut{constructor(e,t,i){this.path=t,this.parsedPath=i||ut.parseTrackName(t),this.node=ut.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new ut.Composite(e,t,i):new ut(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Og,"")}static parseTrackName(e){const t=Vg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);zg.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ut.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ce("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ut.Composite=Gg;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const tu=new Ve;class Wg{constructor(e,t,i=0,s=1/0){this.ray=new tr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Ch,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ue("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return tu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tu),this}intersectObject(e,t=!0,i=[]){return kc(e,this,i,t),i.sort(iu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)kc(e[s],this,i,t);return i.sort(iu),i}}function iu(n,e){return n.distance-e.distance}function kc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)kc(r[a],e,t,!0)}}class Nr{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Xg extends ss{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ce("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function nu(n,e,t,i){const s=Yg(i);switch(t){case wf:return n*e;case Co:return n*e/s.components*s.byteLength;case Mh:return n*e/s.components*s.byteLength;case Xs:return n*e*2/s.components*s.byteLength;case yh:return n*e*2/s.components*s.byteLength;case Tf:return n*e*3/s.components*s.byteLength;case _i:return n*e*4/s.components*s.byteLength;case bh:return n*e*4/s.components*s.byteLength;case Ka:case Qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ja:case $a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case rc:case oc:return Math.max(n,16)*Math.max(e,8)/4;case sc:case ac:return Math.max(n,8)*Math.max(e,8)/2;case lc:case cc:case dc:case uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case hc:case fc:case pc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case mc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case gc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ac:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case vc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case xc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case _c:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Mc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case yc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case bc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Sc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ec:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case wc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Tc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Cc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Rc:case Dc:case Pc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Lc:case Ic:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Nc:case Oc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yg(n){switch(n){case ci:case yf:return{byteLength:1,components:1};case Fr:case bf:case ti:return{byteLength:2,components:1};case xh:case _h:return{byteLength:2,components:4};case Ki:case vh:case hi:return{byteLength:4,components:1};case Sf:case Ef:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ch}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ch);function jf(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function jg(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],A=u[f];A.start<=m.start+m.count+1?m.count=Math.max(m.count,A.start+A.count-m.start):(++d,u[d]=A)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const A=u[f];n.bufferSubData(c,A.start*h.BYTES_PER_ELEMENT,h,A.start,A.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var qg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Kg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$g=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,eA=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,iA=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,nA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,aA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,oA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,uA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,pA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,mA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,gA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,AA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_A=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,MA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,SA="gl_FragColor = linearToOutputTexel( gl_FragColor );",EA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,TA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,CA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,RA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,DA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,PA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,LA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,IA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,NA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,OA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,UA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,BA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,FA=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,HA=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kA=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,VA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zA=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,GA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,WA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,XA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,YA=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,jA=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ZA=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,KA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,QA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,JA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$A=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ev=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,iv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,nv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,av=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ov=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,uv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Av=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_v=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ev=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Dv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ov=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,e1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,t1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,n1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,s1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,a1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,l1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,u1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,p1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,m1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,v1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,y1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,E1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:qg,alphahash_pars_fragment:Zg,alphamap_fragment:Kg,alphamap_pars_fragment:Qg,alphatest_fragment:Jg,alphatest_pars_fragment:$g,aomap_fragment:eA,aomap_pars_fragment:tA,batching_pars_vertex:iA,batching_vertex:nA,begin_vertex:sA,beginnormal_vertex:rA,bsdfs:aA,iridescence_fragment:oA,bumpmap_pars_fragment:lA,clipping_planes_fragment:cA,clipping_planes_pars_fragment:hA,clipping_planes_pars_vertex:dA,clipping_planes_vertex:uA,color_fragment:fA,color_pars_fragment:pA,color_pars_vertex:mA,color_vertex:gA,common:AA,cube_uv_reflection_fragment:vA,defaultnormal_vertex:xA,displacementmap_pars_vertex:_A,displacementmap_vertex:MA,emissivemap_fragment:yA,emissivemap_pars_fragment:bA,colorspace_fragment:SA,colorspace_pars_fragment:EA,envmap_fragment:wA,envmap_common_pars_fragment:TA,envmap_pars_fragment:CA,envmap_pars_vertex:RA,envmap_physical_pars_fragment:kA,envmap_vertex:DA,fog_vertex:PA,fog_pars_vertex:LA,fog_fragment:IA,fog_pars_fragment:NA,gradientmap_pars_fragment:OA,lightmap_pars_fragment:UA,lights_lambert_fragment:BA,lights_lambert_pars_fragment:FA,lights_pars_begin:HA,lights_toon_fragment:VA,lights_toon_pars_fragment:zA,lights_phong_fragment:GA,lights_phong_pars_fragment:WA,lights_physical_fragment:XA,lights_physical_pars_fragment:YA,lights_fragment_begin:jA,lights_fragment_maps:qA,lights_fragment_end:ZA,logdepthbuf_fragment:KA,logdepthbuf_pars_fragment:QA,logdepthbuf_pars_vertex:JA,logdepthbuf_vertex:$A,map_fragment:ev,map_pars_fragment:tv,map_particle_fragment:iv,map_particle_pars_fragment:nv,metalnessmap_fragment:sv,metalnessmap_pars_fragment:rv,morphinstance_vertex:av,morphcolor_vertex:ov,morphnormal_vertex:lv,morphtarget_pars_vertex:cv,morphtarget_vertex:hv,normal_fragment_begin:dv,normal_fragment_maps:uv,normal_pars_fragment:fv,normal_pars_vertex:pv,normal_vertex:mv,normalmap_pars_fragment:gv,clearcoat_normal_fragment_begin:Av,clearcoat_normal_fragment_maps:vv,clearcoat_pars_fragment:xv,iridescence_pars_fragment:_v,opaque_fragment:Mv,packing:yv,premultiplied_alpha_fragment:bv,project_vertex:Sv,dithering_fragment:Ev,dithering_pars_fragment:wv,roughnessmap_fragment:Tv,roughnessmap_pars_fragment:Cv,shadowmap_pars_fragment:Rv,shadowmap_pars_vertex:Dv,shadowmap_vertex:Pv,shadowmask_pars_fragment:Lv,skinbase_vertex:Iv,skinning_pars_vertex:Nv,skinning_vertex:Ov,skinnormal_vertex:Uv,specularmap_fragment:Bv,specularmap_pars_fragment:Fv,tonemapping_fragment:Hv,tonemapping_pars_fragment:kv,transmission_fragment:Vv,transmission_pars_fragment:zv,uv_pars_fragment:Gv,uv_pars_vertex:Wv,uv_vertex:Xv,worldpos_vertex:Yv,background_vert:jv,background_frag:qv,backgroundCube_vert:Zv,backgroundCube_frag:Kv,cube_vert:Qv,cube_frag:Jv,depth_vert:$v,depth_frag:e1,distance_vert:t1,distance_frag:i1,equirect_vert:n1,equirect_frag:s1,linedashed_vert:r1,linedashed_frag:a1,meshbasic_vert:o1,meshbasic_frag:l1,meshlambert_vert:c1,meshlambert_frag:h1,meshmatcap_vert:d1,meshmatcap_frag:u1,meshnormal_vert:f1,meshnormal_frag:p1,meshphong_vert:m1,meshphong_frag:g1,meshphysical_vert:A1,meshphysical_frag:v1,meshtoon_vert:x1,meshtoon_frag:_1,points_vert:M1,points_frag:y1,shadow_vert:b1,shadow_frag:S1,sprite_vert:E1,sprite_frag:w1},ue={common:{diffuse:{value:new we(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new De(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new we(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new we(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new we(16777215)},opacity:{value:1},center:{value:new De(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},ki={basic:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new we(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new we(0)},specular:{value:new we(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Kt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new we(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Kt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new we(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Kt([ue.points,ue.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Kt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Kt([ue.common,ue.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Kt([ue.sprite,ue.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Kt([ue.common,ue.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Kt([ue.lights,ue.fog,{color:{value:new we(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};ki.physical={uniforms:Kt([ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new De(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new we(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new De},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new we(0)},specularColor:{value:new we(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new De},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Na={r:0,b:0,g:0},Xn=new Li,T1=new Ve;function C1(n,e,t,i,s,r){const a=new we(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(_){let E=_.isScene===!0?_.background:null;if(E&&E.isTexture){const M=_.backgroundBlurriness>0;E=e.get(E,M)}return E}function m(_){let E=!1;const M=f(_);M===null?p(a,o):M&&M.isColor&&(p(M,1),E=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function A(_,E){const M=f(E);M&&(M.isCubeTexture||M.mapping===To)?(c===void 0&&(c=new at(new ir(1,1,1),new Nt({name:"BackgroundCubeMaterial",uniforms:qs(ki.backgroundCube.uniforms),vertexShader:ki.backgroundCube.vertexShader,fragmentShader:ki.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,w,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),Xn.copy(E.backgroundRotation),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),c.material.uniforms.envMap.value=M,c.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(T1.makeRotationFromEuler(Xn)),c.material.toneMapped=$e.getTransfer(M.colorSpace)!==lt,(h!==M||u!==M.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new at(new Jn(2,2),new Nt({name:"BackgroundMaterial",uniforms:qs(ki.background.uniforms),vertexShader:ki.background.vertexShader,fragmentShader:ki.background.fragmentShader,side:Zi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=$e.getTransfer(M.colorSpace)!==lt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,E){_.getRGB(Na,Hf(n)),t.buffers.color.setClear(Na.r,Na.g,Na.b,E,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(_,E=1){a.set(_),o=E,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,p(a,o)},render:m,addToRenderList:A,dispose:g}}function R1(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(R,U,H,j,V){let k=!1;const B=u(R,j,H,U);r!==B&&(r=B,c(r.object)),k=f(R,j,H,V),k&&m(R,j,H,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,M(R,U,H,j),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function u(R,U,H,j){const V=j.wireframe===!0;let k=i[U.id];k===void 0&&(k={},i[U.id]=k);const B=R.isInstancedMesh===!0?R.id:0;let $=k[B];$===void 0&&($={},k[B]=$);let K=$[H.id];K===void 0&&(K={},$[H.id]=K);let ae=K[V];return ae===void 0&&(ae=d(l()),K[V]=ae),ae}function d(R){const U=[],H=[],j=[];for(let V=0;V<t;V++)U[V]=0,H[V]=0,j[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:H,attributeDivisors:j,object:R,attributes:{},index:null}}function f(R,U,H,j){const V=r.attributes,k=U.attributes;let B=0;const $=H.getAttributes();for(const K in $)if($[K].location>=0){const he=V[K];let ce=k[K];if(ce===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor)),he===void 0||he.attribute!==ce||ce&&he.data!==ce.data)return!0;B++}return r.attributesNum!==B||r.index!==j}function m(R,U,H,j){const V={},k=U.attributes;let B=0;const $=H.getAttributes();for(const K in $)if($[K].location>=0){let he=k[K];he===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(he=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(he=R.instanceColor));const ce={};ce.attribute=he,he&&he.data&&(ce.data=he.data),V[K]=ce,B++}r.attributes=V,r.attributesNum=B,r.index=j}function A(){const R=r.newAttributes;for(let U=0,H=R.length;U<H;U++)R[U]=0}function p(R){g(R,0)}function g(R,U){const H=r.newAttributes,j=r.enabledAttributes,V=r.attributeDivisors;H[R]=1,j[R]===0&&(n.enableVertexAttribArray(R),j[R]=1),V[R]!==U&&(n.vertexAttribDivisor(R,U),V[R]=U)}function _(){const R=r.newAttributes,U=r.enabledAttributes;for(let H=0,j=U.length;H<j;H++)U[H]!==R[H]&&(n.disableVertexAttribArray(H),U[H]=0)}function E(R,U,H,j,V,k,B){B===!0?n.vertexAttribIPointer(R,U,H,V,k):n.vertexAttribPointer(R,U,H,j,V,k)}function M(R,U,H,j){A();const V=j.attributes,k=H.getAttributes(),B=U.defaultAttributeValues;for(const $ in k){const K=k[$];if(K.location>=0){let ae=V[$];if(ae===void 0&&($==="instanceMatrix"&&R.instanceMatrix&&(ae=R.instanceMatrix),$==="instanceColor"&&R.instanceColor&&(ae=R.instanceColor)),ae!==void 0){const he=ae.normalized,ce=ae.itemSize,Le=e.get(ae);if(Le===void 0)continue;const tt=Le.buffer,nt=Le.type,q=Le.bytesPerElement,J=nt===n.INT||nt===n.UNSIGNED_INT||ae.gpuType===vh;if(ae.isInterleavedBufferAttribute){const ie=ae.data,Pe=ie.stride,ye=ae.offset;if(ie.isInstancedInterleavedBuffer){for(let Ie=0;Ie<K.locationSize;Ie++)g(K.location+Ie,ie.meshPerAttribute);R.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Ie=0;Ie<K.locationSize;Ie++)p(K.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,tt);for(let Ie=0;Ie<K.locationSize;Ie++)E(K.location+Ie,ce/K.locationSize,nt,he,Pe*q,(ye+ce/K.locationSize*Ie)*q,J)}else{if(ae.isInstancedBufferAttribute){for(let ie=0;ie<K.locationSize;ie++)g(K.location+ie,ae.meshPerAttribute);R.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ie=0;ie<K.locationSize;ie++)p(K.location+ie);n.bindBuffer(n.ARRAY_BUFFER,tt);for(let ie=0;ie<K.locationSize;ie++)E(K.location+ie,ce/K.locationSize,nt,he,ce*q,ce/K.locationSize*ie*q,J)}}else if(B!==void 0){const he=B[$];if(he!==void 0)switch(he.length){case 2:n.vertexAttrib2fv(K.location,he);break;case 3:n.vertexAttrib3fv(K.location,he);break;case 4:n.vertexAttrib4fv(K.location,he);break;default:n.vertexAttrib1fv(K.location,he)}}}}_()}function b(){S();for(const R in i){const U=i[R];for(const H in U){const j=U[H];for(const V in j){const k=j[V];for(const B in k)h(k[B].object),delete k[B];delete j[V]}}delete i[R]}}function w(R){if(i[R.id]===void 0)return;const U=i[R.id];for(const H in U){const j=U[H];for(const V in j){const k=j[V];for(const B in k)h(k[B].object),delete k[B];delete j[V]}}delete i[R.id]}function D(R){for(const U in i){const H=i[U];for(const j in H){const V=H[j];if(V[R.id]===void 0)continue;const k=V[R.id];for(const B in k)h(k[B].object),delete k[B];delete V[R.id]}}}function x(R){for(const U in i){const H=i[U],j=R.isInstancedMesh===!0?R.id:0,V=H[j];if(V!==void 0){for(const k in V){const B=V[k];for(const $ in B)h(B[$].object),delete B[$];delete V[k]}delete H[j],Object.keys(H).length===0&&delete i[U]}}}function S(){N(),a=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:S,resetDefaultState:N,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:D,initAttributes:A,enableAttribute:p,disableUnusedAttributes:_}}function D1(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)a(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let m=0;for(let A=0;A<u;A++)m+=h[A]*d[A];t.update(m,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function P1(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const D=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(D){return!(D!==_i&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(D){const x=D===ti&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(D!==ci&&i.convert(D)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==hi&&!x)}function l(D){if(D==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:A,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:_,maxVaryings:E,maxFragmentUniforms:M,maxSamples:b,samples:w}}function L1(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new bn,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,A=u.clipIntersection,p=u.clipShadows,g=n.get(u);if(!s||m===null||m.length===0||r&&!p)r?h(null):c();else{const _=r?0:i,E=_*4;let M=g.clippingState||null;l.value=M,M=h(m,d,E,f);for(let b=0;b!==E;++b)M[b]=t[b];g.clippingState=M,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,m){const A=u!==null?u.length:0;let p=null;if(A!==0){if(p=l.value,m!==!0||p===null){const g=f+A*4,_=d.matrixWorldInverse;o.getNormalMatrix(_),(p===null||p.length<g)&&(p=new Float32Array(g));for(let E=0,M=f;E!==A;++E,M+=4)a.copy(u[E]).applyMatrix4(_,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,p}}const Dn=4,su=[.125,.215,.35,.446,.526,.582],qn=20,I1=256,_r=new Jr,ru=new we;let Rl=null,Dl=0,Pl=0,Ll=!1;const N1=new P;class Vc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=N1}=r;Rl=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ou(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Rl,Dl,Pl),this._renderer.xr.enabled=Ll,e.scissorTest=!1,Ss(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===es||e.mapping===Gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rl=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:It,minFilter:It,generateMipmaps:!1,type:ti,format:_i,colorSpace:ii,depthBuffer:!1},s=au(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=au(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=O1(r)),this._blurMaterial=B1(r,e,t),this._ggxMaterial=U1(r,e,t)}return s}_compileMaterial(e){const t=new at(new pi,e);this._renderer.compile(t,_r)}_sceneToCubeUV(e,t,i,s,r){const l=new Gt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(ru),u.toneMapping=ji,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new at(new ir,new Yi({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));const A=this._backgroundBox,p=A.material;let g=!1;const _=e.background;_?_.isColor&&(p.color.copy(_),e.background=null,g=!0):(p.color.copy(ru),g=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const b=this._cubeSize;Ss(s,M*b,E>2?b:0,b,b),u.setRenderTarget(s),g&&u.render(A,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===es||e.mapping===Gs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ou());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ss(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,_r)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:m}=this,A=this._sizeLods[i],p=3*A*(i>m-Dn?i-m+Dn:0),g=4*(this._cubeSize-A);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,Ss(r,p,g,3*A,2*A),s.setRenderTarget(r),s.render(o,_r),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,Ss(e,p,g,3*A,2*A),s.setRenderTarget(e),s.render(o,_r)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ue("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*qn-1),A=r/m,p=isFinite(r)?1+Math.floor(h*A):qn;p>qn&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${qn}`);const g=[];let _=0;for(let D=0;D<qn;++D){const x=D/A,S=Math.exp(-x*x/2);g.push(S),D===0?_+=S:D<p&&(_+=2*S)}for(let D=0;D<g.length;D++)g[D]=g[D]/_;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=m,d.mipInt.value=E-i;const M=this._sizeLods[s],b=3*M*(s>E-Dn?s-E+Dn:0),w=4*(this._cubeSize-M);Ss(t,b,w,3*M,2*M),l.setRenderTarget(t),l.render(u,_r)}}function O1(n){const e=[],t=[],i=[];let s=n;const r=n-Dn+1+su.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Dn?l=su[a-n+Dn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,A=3,p=2,g=1,_=new Float32Array(A*m*f),E=new Float32Array(p*m*f),M=new Float32Array(g*m*f);for(let w=0;w<f;w++){const D=w%3*2/3-1,x=w>2?0:-1,S=[D,x,0,D+2/3,x,0,D+2/3,x+1,0,D,x,0,D+2/3,x+1,0,D,x+1,0];_.set(S,A*m*w),E.set(d,p*m*w);const N=[w,w,w,w,w,w];M.set(N,g*m*w)}const b=new pi;b.setAttribute("position",new $t(_,A)),b.setAttribute("uv",new $t(E,p)),b.setAttribute("faceIndex",new $t(M,g)),i.push(new at(b,null)),s>Dn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function au(n,e,t){const i=new qt(n,e,t);return i.texture.mapping=To,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ss(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function U1(n,e,t){return new Nt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:I1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:No(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:zt,depthTest:!1,depthWrite:!1})}function B1(n,e,t){const i=new Float32Array(qn),s=new P(0,1,0);return new Nt({name:"SphericalGaussianBlur",defines:{n:qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:No(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zt,depthTest:!1,depthWrite:!1})}function ou(){return new Nt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:No(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zt,depthTest:!1,depthWrite:!1})}function lu(){return new Nt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:No(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zt,depthTest:!1,depthWrite:!1})}function No(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class qf extends qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ir(5,5,5),r=new Nt({name:"CubemapFromEquirect",uniforms:qs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:zt});r.uniforms.tEquirect.value=t;const a=new at(s,r),o=t.minFilter;return t.minFilter===cn&&(t.minFilter=It),new Pg(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function F1(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Jo||f===$o)if(e.has(d)){const m=e.get(d).texture;return o(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const A=new qf(m.height);return A.fromEquirectangularTexture(n,d),e.set(d,A),d.addEventListener("dispose",c),o(A.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,m=f===Jo||f===$o,A=f===es||f===Gs;if(m||A){let p=t.get(d);const g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new Vc(n)),p=m?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const _=d.image;return m&&_&&_.height>0||A&&_&&l(_)?(i===null&&(i=new Vc(n)),p=m?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===Jo?d.mapping=es:f===$o&&(d.mapping=Gs),d}function l(d){let f=0;const m=6;for(let A=0;A<m;A++)d[A]!==void 0&&f++;return f===m}function c(d){const f=d.target;f.removeEventListener("dispose",c);const m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function H1(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&uo("WebGLRenderer: "+i+" extension not supported."),s}}}function k1(n,e,t,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,m=u.attributes.position;let A=0;if(m===void 0)return;if(f!==null){const _=f.array;A=f.version;for(let E=0,M=_.length;E<M;E+=3){const b=_[E+0],w=_[E+1],D=_[E+2];d.push(b,w,w,D,D,b)}}else{const _=m.array;A=m.version;for(let E=0,M=_.length/3-1;E<M;E+=3){const b=E+0,w=E+1,D=E+2;d.push(b,w,w,D,D,b)}}const p=new(m.count>=65535?If:Lf)(d,1);p.version=A;const g=r.get(u);g&&e.remove(g),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function V1(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){n.drawElements(i,f,r,d*a),t.update(f,i,1)}function c(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,r,d*a,m),t.update(f,i,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,m);let p=0;for(let g=0;g<m;g++)p+=f[g];t.update(p,i,1)}function u(d,f,m,A){if(m===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d.length;g++)c(d[g]/a,f[g],A[g]);else{p.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,A,0,m);let g=0;for(let _=0;_<m;_++)g+=f[_]*A[_];t.update(g,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function z1(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function G1(n,e,t){const i=new WeakMap,s=new yt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let N=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",N)};var f=N;d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,A=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let M=0;m===!0&&(M=1),A===!0&&(M=2),p===!0&&(M=3);let b=o.attributes.position.count*M,w=1;b>e.maxTextureSize&&(w=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const D=new Float32Array(b*w*4*u),x=new Df(D,b,w,u);x.type=hi,x.needsUpdate=!0;const S=M*4;for(let R=0;R<u;R++){const U=g[R],H=_[R],j=E[R],V=b*w*4*R;for(let k=0;k<U.count;k++){const B=k*S;m===!0&&(s.fromBufferAttribute(U,k),D[V+B+0]=s.x,D[V+B+1]=s.y,D[V+B+2]=s.z,D[V+B+3]=0),A===!0&&(s.fromBufferAttribute(H,k),D[V+B+4]=s.x,D[V+B+5]=s.y,D[V+B+6]=s.z,D[V+B+7]=0),p===!0&&(s.fromBufferAttribute(j,k),D[V+B+8]=s.x,D[V+B+9]=s.y,D[V+B+10]=s.z,D[V+B+11]=j.itemSize===4?s.w:1)}}d={count:u,texture:x,size:new De(b,w)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let p=0;p<c.length;p++)m+=c[p];const A=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",A),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function W1(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const X1={[uh]:"LINEAR_TONE_MAPPING",[fh]:"REINHARD_TONE_MAPPING",[ph]:"CINEON_TONE_MAPPING",[Kr]:"ACES_FILMIC_TONE_MAPPING",[gh]:"AGX_TONE_MAPPING",[Ah]:"NEUTRAL_TONE_MAPPING",[mh]:"CUSTOM_TONE_MAPPING"};function Y1(n,e,t,i,s){const r=new qt(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),a=new qt(e,t,{type:ti,depthBuffer:!1,stencilBuffer:!1}),o=new pi;o.setAttribute("position",new ui([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ui([0,2,0,0,2,0],2));const l=new kf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new at(o,l),h=new Jr(-1,1,1,-1,0,1);let u=null,d=null,f=!1,m,A=null,p=[],g=!1;this.setSize=function(_,E){r.setSize(_,E),a.setSize(_,E);for(let M=0;M<p.length;M++){const b=p[M];b.setSize&&b.setSize(_,E)}},this.setEffects=function(_){p=_,g=p.length>0&&p[0].isRenderPass===!0;const E=r.width,M=r.height;for(let b=0;b<p.length;b++){const w=p[b];w.setSize&&w.setSize(E,M)}},this.begin=function(_,E){if(f||_.toneMapping===ji&&p.length===0)return!1;if(A=E,E!==null){const M=E.width,b=E.height;(r.width!==M||r.height!==b)&&this.setSize(M,b)}return g===!1&&_.setRenderTarget(r),m=_.toneMapping,_.toneMapping=ji,!0},this.hasRenderPass=function(){return g},this.end=function(_,E){_.toneMapping=m,f=!0;let M=r,b=a;for(let w=0;w<p.length;w++){const D=p[w];if(D.enabled!==!1&&(D.render(_,b,M,E),D.needsSwap!==!1)){const x=M;M=b,b=x}}if(u!==_.outputColorSpace||d!==_.toneMapping){u=_.outputColorSpace,d=_.toneMapping,l.defines={},$e.getTransfer(u)===lt&&(l.defines.SRGB_TRANSFER="");const w=X1[d];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,_.setRenderTarget(A),_.render(c,h),A=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Zf=new St,zc=new js(1,1),Kf=new Df,Qf=new Nm,Jf=new Bf,cu=[],hu=[],du=new Float32Array(16),uu=new Float32Array(9),fu=new Float32Array(4);function or(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=cu[s];if(r===void 0&&(r=new Float32Array(s),cu[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Ut(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Bt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Oo(n,e){let t=hu[e];t===void 0&&(t=new Int32Array(e),hu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function j1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function q1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2fv(this.addr,e),Bt(t,e)}}function Z1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;n.uniform3fv(this.addr,e),Bt(t,e)}}function K1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4fv(this.addr,e),Bt(t,e)}}function Q1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Ut(t,i))return;fu.set(i),n.uniformMatrix2fv(this.addr,!1,fu),Bt(t,i)}}function J1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Ut(t,i))return;uu.set(i),n.uniformMatrix3fv(this.addr,!1,uu),Bt(t,i)}}function $1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Ut(t,i))return;du.set(i),n.uniformMatrix4fv(this.addr,!1,du),Bt(t,i)}}function ex(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function tx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2iv(this.addr,e),Bt(t,e)}}function ix(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3iv(this.addr,e),Bt(t,e)}}function nx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4iv(this.addr,e),Bt(t,e)}}function sx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function rx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2uiv(this.addr,e),Bt(t,e)}}function ax(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3uiv(this.addr,e),Bt(t,e)}}function ox(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4uiv(this.addr,e),Bt(t,e)}}function lx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(zc.compareFunction=t.isReversedDepthBuffer()?Eh:Sh,r=zc):r=Zf,t.setTexture2D(e||r,s)}function cx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Qf,s)}function hx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Jf,s)}function dx(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Kf,s)}function ux(n){switch(n){case 5126:return j1;case 35664:return q1;case 35665:return Z1;case 35666:return K1;case 35674:return Q1;case 35675:return J1;case 35676:return $1;case 5124:case 35670:return ex;case 35667:case 35671:return tx;case 35668:case 35672:return ix;case 35669:case 35673:return nx;case 5125:return sx;case 36294:return rx;case 36295:return ax;case 36296:return ox;case 35678:case 36198:case 36298:case 36306:case 35682:return lx;case 35679:case 36299:case 36307:return cx;case 35680:case 36300:case 36308:case 36293:return hx;case 36289:case 36303:case 36311:case 36292:return dx}}function fx(n,e){n.uniform1fv(this.addr,e)}function px(n,e){const t=or(e,this.size,2);n.uniform2fv(this.addr,t)}function mx(n,e){const t=or(e,this.size,3);n.uniform3fv(this.addr,t)}function gx(n,e){const t=or(e,this.size,4);n.uniform4fv(this.addr,t)}function Ax(n,e){const t=or(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function vx(n,e){const t=or(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function xx(n,e){const t=or(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function _x(n,e){n.uniform1iv(this.addr,e)}function Mx(n,e){n.uniform2iv(this.addr,e)}function yx(n,e){n.uniform3iv(this.addr,e)}function bx(n,e){n.uniform4iv(this.addr,e)}function Sx(n,e){n.uniform1uiv(this.addr,e)}function Ex(n,e){n.uniform2uiv(this.addr,e)}function wx(n,e){n.uniform3uiv(this.addr,e)}function Tx(n,e){n.uniform4uiv(this.addr,e)}function Cx(n,e,t){const i=this.cache,s=e.length,r=Oo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=zc:a=Zf;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Rx(n,e,t){const i=this.cache,s=e.length,r=Oo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Qf,r[a])}function Dx(n,e,t){const i=this.cache,s=e.length,r=Oo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Jf,r[a])}function Px(n,e,t){const i=this.cache,s=e.length,r=Oo(t,s);Ut(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Kf,r[a])}function Lx(n){switch(n){case 5126:return fx;case 35664:return px;case 35665:return mx;case 35666:return gx;case 35674:return Ax;case 35675:return vx;case 35676:return xx;case 5124:case 35670:return _x;case 35667:case 35671:return Mx;case 35668:case 35672:return yx;case 35669:case 35673:return bx;case 5125:return Sx;case 36294:return Ex;case 36295:return wx;case 36296:return Tx;case 35678:case 36198:case 36298:case 36306:case 35682:return Cx;case 35679:case 36299:case 36307:return Rx;case 35680:case 36300:case 36308:case 36293:return Dx;case 36289:case 36303:case 36311:case 36292:return Px}}class Ix{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ux(t.type)}}class Nx{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lx(t.type)}}class Ox{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Il=/(\w+)(\])?(\[|\.)?/g;function pu(n,e){n.seq.push(e),n.map[e.id]=e}function Ux(n,e,t){const i=n.name,s=i.length;for(Il.lastIndex=0;;){const r=Il.exec(i),a=Il.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){pu(t,c===void 0?new Ix(o,n,e):new Nx(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Ox(o),pu(t,u)),t=u}}}class eo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ux(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function mu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Bx=37297;let Fx=0;function Hx(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const gu=new We;function kx(n){$e._getMatrix(gu,$e.workingColorSpace,n);const e=`mat3( ${gu.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case co:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Au(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Hx(n.getShaderSource(e),o)}else return r}function Vx(n,e){const t=kx(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const zx={[uh]:"Linear",[fh]:"Reinhard",[ph]:"Cineon",[Kr]:"ACESFilmic",[gh]:"AgX",[Ah]:"Neutral",[mh]:"Custom"};function Gx(n,e){const t=zx[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Oa=new P;function Wx(){$e.getLuminanceCoefficients(Oa);const n=Oa.x.toFixed(4),e=Oa.y.toFixed(4),t=Oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Dr).join(`
`)}function Yx(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function jx(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Dr(n){return n!==""}function vu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const qx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gc(n){return n.replace(qx,Kx)}const Zx=new Map;function Kx(n,e){let t=Ge[e];if(t===void 0){const i=Zx.get(e);if(i!==void 0)t=Ge[i],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Gc(t)}const Qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _u(n){return n.replace(Qx,Jx)}function Jx(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Mu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const $x={[qa]:"SHADOWMAP_TYPE_PCF",[Cr]:"SHADOWMAP_TYPE_VSM"};function e_(n){return $x[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const t_={[es]:"ENVMAP_TYPE_CUBE",[Gs]:"ENVMAP_TYPE_CUBE",[To]:"ENVMAP_TYPE_CUBE_UV"};function i_(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":t_[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const n_={[Gs]:"ENVMAP_MODE_REFRACTION"};function s_(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":n_[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const r_={[dh]:"ENVMAP_BLENDING_MULTIPLY",[q0]:"ENVMAP_BLENDING_MIX",[Z0]:"ENVMAP_BLENDING_ADD"};function a_(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":r_[n.combine]||"ENVMAP_BLENDING_NONE"}function o_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function l_(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=e_(t),c=i_(t),h=s_(t),u=a_(t),d=o_(t),f=Xx(t),m=Yx(r),A=s.createProgram();let p,g,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Dr).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Dr).join(`
`),g.length>0&&(g+=`
`)):(p=[Mu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Dr).join(`
`),g=[Mu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ji?"#define TONE_MAPPING":"",t.toneMapping!==ji?Ge.tonemapping_pars_fragment:"",t.toneMapping!==ji?Gx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,Vx("linearToOutputTexel",t.outputColorSpace),Wx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Dr).join(`
`)),a=Gc(a),a=vu(a,t),a=xu(a,t),o=Gc(o),o=vu(o,t),o=xu(o,t),a=_u(a),o=_u(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===vd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=_+p+a,M=_+g+o,b=mu(s,s.VERTEX_SHADER,E),w=mu(s,s.FRAGMENT_SHADER,M);s.attachShader(A,b),s.attachShader(A,w),t.index0AttributeName!==void 0?s.bindAttribLocation(A,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(A,0,"position"),s.linkProgram(A);function D(R){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(A)||"",H=s.getShaderInfoLog(b)||"",j=s.getShaderInfoLog(w)||"",V=U.trim(),k=H.trim(),B=j.trim();let $=!0,K=!0;if(s.getProgramParameter(A,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,A,b,w);else{const ae=Au(s,b,"vertex"),he=Au(s,w,"fragment");Ue("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(A,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+V+`
`+ae+`
`+he)}else V!==""?Ce("WebGLProgram: Program Info Log:",V):(k===""||B==="")&&(K=!1);K&&(R.diagnostics={runnable:$,programLog:V,vertexShader:{log:k,prefix:p},fragmentShader:{log:B,prefix:g}})}s.deleteShader(b),s.deleteShader(w),x=new eo(s,A),S=jx(s,A)}let x;this.getUniforms=function(){return x===void 0&&D(this),x};let S;this.getAttributes=function(){return S===void 0&&D(this),S};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(A,Bx)),N},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(A),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Fx++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=b,this.fragmentShader=w,this}let c_=0;class h_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new d_(e),t.set(e,i)),i}}class d_{constructor(e){this.id=c_++,this.code=e,this.usedTimes=0}}function u_(n,e,t,i,s,r){const a=new Ch,o=new h_,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function A(x,S,N,R,U){const H=R.fog,j=U.geometry,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,k=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,B=e.get(x.envMap||V,k),$=B&&B.mapping===To?B.image.height:null,K=f[x.type];x.precision!==null&&(d=i.getMaxPrecision(x.precision),d!==x.precision&&Ce("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const ae=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,he=ae!==void 0?ae.length:0;let ce=0;j.morphAttributes.position!==void 0&&(ce=1),j.morphAttributes.normal!==void 0&&(ce=2),j.morphAttributes.color!==void 0&&(ce=3);let Le,tt,nt,q;if(K){const ht=ki[K];Le=ht.vertexShader,tt=ht.fragmentShader}else Le=x.vertexShader,tt=x.fragmentShader,o.update(x),nt=o.getVertexShaderID(x),q=o.getFragmentShaderID(x);const J=n.getRenderTarget(),ie=n.state.buffers.depth.getReversed(),Pe=U.isInstancedMesh===!0,ye=U.isBatchedMesh===!0,Ie=!!x.map,ft=!!x.matcap,Xe=!!B,Je=!!x.aoMap,it=!!x.lightMap,Be=!!x.bumpMap,At=!!x.normalMap,L=!!x.displacementMap,ot=!!x.emissiveMap,Qe=!!x.metalnessMap,et=!!x.roughnessMap,Ae=x.anisotropy>0,C=x.clearcoat>0,v=x.dispersion>0,T=x.iridescence>0,I=x.sheen>0,X=x.transmission>0,z=Ae&&!!x.anisotropyMap,oe=C&&!!x.clearcoatMap,ee=C&&!!x.clearcoatNormalMap,de=C&&!!x.clearcoatRoughnessMap,be=T&&!!x.iridescenceMap,te=T&&!!x.iridescenceThicknessMap,re=I&&!!x.sheenColorMap,xe=I&&!!x.sheenRoughnessMap,_e=!!x.specularMap,fe=!!x.specularColorMap,Fe=!!x.specularIntensityMap,O=X&&!!x.transmissionMap,le=X&&!!x.thicknessMap,ne=!!x.gradientMap,ve=!!x.alphaMap,se=x.alphaTest>0,Z=!!x.alphaHash,Me=!!x.extensions;let He=ji;x.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(He=n.toneMapping);const _t={shaderID:K,shaderType:x.type,shaderName:x.name,vertexShader:Le,fragmentShader:tt,defines:x.defines,customVertexShaderID:nt,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:ye,batchingColor:ye&&U._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&U.instanceColor!==null,instancingMorph:Pe&&U.morphTexture!==null,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:ii,alphaToCoverage:!!x.alphaToCoverage,map:Ie,matcap:ft,envMap:Xe,envMapMode:Xe&&B.mapping,envMapCubeUVHeight:$,aoMap:Je,lightMap:it,bumpMap:Be,normalMap:At,displacementMap:L,emissiveMap:ot,normalMapObjectSpace:At&&x.normalMapType===tm,normalMapTangentSpace:At&&x.normalMapType===Ro,metalnessMap:Qe,roughnessMap:et,anisotropy:Ae,anisotropyMap:z,clearcoat:C,clearcoatMap:oe,clearcoatNormalMap:ee,clearcoatRoughnessMap:de,dispersion:v,iridescence:T,iridescenceMap:be,iridescenceThicknessMap:te,sheen:I,sheenColorMap:re,sheenRoughnessMap:xe,specularMap:_e,specularColorMap:fe,specularIntensityMap:Fe,transmission:X,transmissionMap:O,thicknessMap:le,gradientMap:ne,opaque:x.transparent===!1&&x.blending===Ns&&x.alphaToCoverage===!1,alphaMap:ve,alphaTest:se,alphaHash:Z,combine:x.combine,mapUv:Ie&&m(x.map.channel),aoMapUv:Je&&m(x.aoMap.channel),lightMapUv:it&&m(x.lightMap.channel),bumpMapUv:Be&&m(x.bumpMap.channel),normalMapUv:At&&m(x.normalMap.channel),displacementMapUv:L&&m(x.displacementMap.channel),emissiveMapUv:ot&&m(x.emissiveMap.channel),metalnessMapUv:Qe&&m(x.metalnessMap.channel),roughnessMapUv:et&&m(x.roughnessMap.channel),anisotropyMapUv:z&&m(x.anisotropyMap.channel),clearcoatMapUv:oe&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ee&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:te&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:re&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(x.sheenRoughnessMap.channel),specularMapUv:_e&&m(x.specularMap.channel),specularColorMapUv:fe&&m(x.specularColorMap.channel),specularIntensityMapUv:Fe&&m(x.specularIntensityMap.channel),transmissionMapUv:O&&m(x.transmissionMap.channel),thicknessMapUv:le&&m(x.thicknessMap.channel),alphaMapUv:ve&&m(x.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(At||Ae),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!j.attributes.uv&&(Ie||ve),fog:!!H,useFog:x.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||j.attributes.normal===void 0&&At===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ie,skinning:U.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:ce,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:Ie&&x.map.isVideoTexture===!0&&$e.getTransfer(x.map.colorSpace)===lt,decodeVideoTextureEmissive:ot&&x.emissiveMap.isVideoTexture===!0&&$e.getTransfer(x.emissiveMap.colorSpace)===lt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Vi,flipSided:x.side===Jt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Me&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&x.extensions.multiDraw===!0||ye)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return _t.vertexUv1s=l.has(1),_t.vertexUv2s=l.has(2),_t.vertexUv3s=l.has(3),l.clear(),_t}function p(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const N in x.defines)S.push(N),S.push(x.defines[N]);return x.isRawShaderMaterial===!1&&(g(S,x),_(S,x),S.push(n.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function g(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function _(x,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),x.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),x.push(a.mask)}function E(x){const S=f[x.type];let N;if(S){const R=ki[S];N=Ri.clone(R.uniforms)}else N=x.uniforms;return N}function M(x,S){let N=h.get(S);return N!==void 0?++N.usedTimes:(N=new l_(n,S,x,s),c.push(N),h.set(S,N)),N}function b(x){if(--x.usedTimes===0){const S=c.indexOf(x);c[S]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function w(x){o.remove(x)}function D(){o.dispose()}return{getParameters:A,getProgramCacheKey:p,getUniforms:E,acquireProgram:M,releaseProgram:b,releaseShaderCache:w,programs:c,dispose:D}}function f_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function p_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function yu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function bu(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,A,p,g){let _=n[e];return _===void 0?(_={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:A,renderOrder:d.renderOrder,z:p,group:g},n[e]=_):(_.id=d.id,_.object=d,_.geometry=f,_.material=m,_.materialVariant=a(d),_.groupOrder=A,_.renderOrder=d.renderOrder,_.z=p,_.group=g),e++,_}function l(d,f,m,A,p,g){const _=o(d,f,m,A,p,g);m.transmission>0?i.push(_):m.transparent===!0?s.push(_):t.push(_)}function c(d,f,m,A,p,g){const _=o(d,f,m,A,p,g);m.transmission>0?i.unshift(_):m.transparent===!0?s.unshift(_):t.unshift(_)}function h(d,f){t.length>1&&t.sort(d||p_),i.length>1&&i.sort(f||yu),s.length>1&&s.sort(f||yu)}function u(){for(let d=e,f=n.length;d<f;d++){const m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function m_(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new bu,n.set(i,[a])):s>=r.length?(a=new bu,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function g_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new we};break;case"SpotLight":t={position:new P,direction:new P,color:new we,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new we,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new we,groundColor:new we};break;case"RectAreaLight":t={color:new we,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function A_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let v_=0;function x_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function __(n){const e=new g_,t=A_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const s=new P,r=new Ve,a=new Ve;function o(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let f=0,m=0,A=0,p=0,g=0,_=0,E=0,M=0,b=0,w=0,D=0;c.sort(x_);for(let S=0,N=c.length;S<N;S++){const R=c[S],U=R.color,H=R.intensity,j=R.distance;let V=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Xs?V=R.shadow.map.texture:V=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=U.r*H,u+=U.g*H,d+=U.b*H;else if(R.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(R.sh.coefficients[k],H);D++}else if(R.isDirectionalLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,$=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,i.directionalShadow[f]=$,i.directionalShadowMap[f]=V,i.directionalShadowMatrix[f]=R.shadow.matrix,_++}i.directional[f]=k,f++}else if(R.isSpotLight){const k=e.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(U).multiplyScalar(H),k.distance=j,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,i.spot[A]=k;const B=R.shadow;if(R.map&&(i.spotLightMap[b]=R.map,b++,B.updateMatrices(R),R.castShadow&&w++),i.spotLightMatrix[A]=B.matrix,R.castShadow){const $=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,i.spotShadow[A]=$,i.spotShadowMap[A]=V,M++}A++}else if(R.isRectAreaLight){const k=e.get(R);k.color.copy(U).multiplyScalar(H),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=k,p++}else if(R.isPointLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){const B=R.shadow,$=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,$.shadowCameraNear=B.camera.near,$.shadowCameraFar=B.camera.far,i.pointShadow[m]=$,i.pointShadowMap[m]=V,i.pointShadowMatrix[m]=R.shadow.matrix,E++}i.point[m]=k,m++}else if(R.isHemisphereLight){const k=e.get(R);k.skyColor.copy(R.color).multiplyScalar(H),k.groundColor.copy(R.groundColor).multiplyScalar(H),i.hemi[g]=k,g++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const x=i.hash;(x.directionalLength!==f||x.pointLength!==m||x.spotLength!==A||x.rectAreaLength!==p||x.hemiLength!==g||x.numDirectionalShadows!==_||x.numPointShadows!==E||x.numSpotShadows!==M||x.numSpotMaps!==b||x.numLightProbes!==D)&&(i.directional.length=f,i.spot.length=A,i.rectArea.length=p,i.point.length=m,i.hemi.length=g,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=M+b-w,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=D,x.directionalLength=f,x.pointLength=m,x.spotLength=A,x.rectAreaLength=p,x.hemiLength=g,x.numDirectionalShadows=_,x.numPointShadows=E,x.numSpotShadows=M,x.numSpotMaps=b,x.numLightProbes=D,i.version=v_++)}function l(c,h){let u=0,d=0,f=0,m=0,A=0;const p=h.matrixWorldInverse;for(let g=0,_=c.length;g<_;g++){const E=c[g];if(E.isDirectionalLight){const M=i.directional[u];M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),u++}else if(E.isSpotLight){const M=i.spot[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),f++}else if(E.isRectAreaLight){const M=i.rectArea[m];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),a.identity(),r.copy(E.matrixWorld),r.premultiply(p),a.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),m++}else if(E.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),d++}else if(E.isHemisphereLight){const M=i.hemi[A];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(p),A++}}}return{setup:o,setupView:l,state:i}}function Su(n){const e=new __(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function M_(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Su(n),e.set(s,[o])):r>=a.length?(o=new Su(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const y_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,S_=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],E_=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Eu=new Ve,Mr=new P,Nl=new P;function w_(n,e,t){let i=new Io;const s=new De,r=new De,a=new yt,o=new Vf,l=new hg,c={},h=t.maxTextureSize,u={[Zi]:Jt,[Jt]:Zi,[Vi]:Vi},d=new Nt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new De},radius:{value:4}},vertexShader:y_,fragmentShader:b_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new pi;m.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new at(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qa;let g=this.type;this.render=function(w,D,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;this.type===gf&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=qa);const S=n.getRenderTarget(),N=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),U=n.state;U.setBlending(zt),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const H=g!==this.type;H&&D.traverse(function(j){j.material&&(Array.isArray(j.material)?j.material.forEach(V=>V.needsUpdate=!0):j.material.needsUpdate=!0)});for(let j=0,V=w.length;j<V;j++){const k=w[j],B=k.shadow;if(B===void 0){Ce("WebGLShadowMap:",k,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const $=B.getFrameExtents();s.multiply($),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/$.x),s.x=r.x*$.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/$.y),s.y=r.y*$.y,B.mapSize.y=r.y));const K=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=K,B.map===null||H===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Cr){if(k.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new qt(s.x,s.y,{format:Xs,type:ti,minFilter:It,magFilter:It,generateMipmaps:!1}),B.map.texture.name=k.name+".shadowMap",B.map.depthTexture=new js(s.x,s.y,hi),B.map.depthTexture.name=k.name+".shadowMapDepth",B.map.depthTexture.format=un,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=bt,B.map.depthTexture.magFilter=bt}else k.isPointLight?(B.map=new qf(s.x),B.map.depthTexture=new sg(s.x,Ki)):(B.map=new qt(s.x,s.y),B.map.depthTexture=new js(s.x,s.y,Ki)),B.map.depthTexture.name=k.name+".shadowMap",B.map.depthTexture.format=un,this.type===qa?(B.map.depthTexture.compareFunction=K?Eh:Sh,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=bt,B.map.depthTexture.magFilter=bt);B.camera.updateProjectionMatrix()}const ae=B.map.isWebGLCubeRenderTarget?6:1;for(let he=0;he<ae;he++){if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,he),n.clear();else{he===0&&(n.setRenderTarget(B.map),n.clear());const ce=B.getViewport(he);a.set(r.x*ce.x,r.y*ce.y,r.x*ce.z,r.y*ce.w),U.viewport(a)}if(k.isPointLight){const ce=B.camera,Le=B.matrix,tt=k.distance||ce.far;tt!==ce.far&&(ce.far=tt,ce.updateProjectionMatrix()),Mr.setFromMatrixPosition(k.matrixWorld),ce.position.copy(Mr),Nl.copy(ce.position),Nl.add(S_[he]),ce.up.copy(E_[he]),ce.lookAt(Nl),ce.updateMatrixWorld(),Le.makeTranslation(-Mr.x,-Mr.y,-Mr.z),Eu.multiplyMatrices(ce.projectionMatrix,ce.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Eu,ce.coordinateSystem,ce.reversedDepth)}else B.updateMatrices(k);i=B.getFrustum(),M(D,x,B.camera,k,this.type)}B.isPointLightShadow!==!0&&this.type===Cr&&_(B,x),B.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(S,N,R)};function _(w,D){const x=e.update(A);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new qt(s.x,s.y,{format:Xs,type:ti})),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(D,null,x,d,A,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(D,null,x,f,A,null)}function E(w,D,x,S){let N=null;const R=x.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)N=R;else if(N=x.isPointLight===!0?l:o,n.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){const U=N.uuid,H=D.uuid;let j=c[U];j===void 0&&(j={},c[U]=j);let V=j[H];V===void 0&&(V=N.clone(),j[H]=V,D.addEventListener("dispose",b)),N=V}if(N.visible=D.visible,N.wireframe=D.wireframe,S===Cr?N.side=D.shadowSide!==null?D.shadowSide:D.side:N.side=D.shadowSide!==null?D.shadowSide:u[D.side],N.alphaMap=D.alphaMap,N.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,N.map=D.map,N.clipShadows=D.clipShadows,N.clippingPlanes=D.clippingPlanes,N.clipIntersection=D.clipIntersection,N.displacementMap=D.displacementMap,N.displacementScale=D.displacementScale,N.displacementBias=D.displacementBias,N.wireframeLinewidth=D.wireframeLinewidth,N.linewidth=D.linewidth,x.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const U=n.properties.get(N);U.light=x}return N}function M(w,D,x,S,N){if(w.visible===!1)return;if(w.layers.test(D.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&N===Cr)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,w.matrixWorld);const H=e.update(w),j=w.material;if(Array.isArray(j)){const V=H.groups;for(let k=0,B=V.length;k<B;k++){const $=V[k],K=j[$.materialIndex];if(K&&K.visible){const ae=E(w,K,S,N);w.onBeforeShadow(n,w,D,x,H,ae,$),n.renderBufferDirect(x,null,H,ae,w,$),w.onAfterShadow(n,w,D,x,H,ae,$)}}}else if(j.visible){const V=E(w,j,S,N);w.onBeforeShadow(n,w,D,x,H,V,null),n.renderBufferDirect(x,null,H,V,w,null),w.onAfterShadow(n,w,D,x,H,V,null)}}const U=w.children;for(let H=0,j=U.length;H<j;H++)M(U[H],D,x,S,N)}function b(w){w.target.removeEventListener("dispose",b);for(const x in c){const S=c[x],N=w.target.uuid;N in S&&(S[N].dispose(),delete S[N])}}}function T_(n,e){function t(){let O=!1;const le=new yt;let ne=null;const ve=new yt(0,0,0,0);return{setMask:function(se){ne!==se&&!O&&(n.colorMask(se,se,se,se),ne=se)},setLocked:function(se){O=se},setClear:function(se,Z,Me,He,_t){_t===!0&&(se*=He,Z*=He,Me*=He),le.set(se,Z,Me,He),ve.equals(le)===!1&&(n.clearColor(se,Z,Me,He),ve.copy(le))},reset:function(){O=!1,ne=null,ve.set(-1,0,0,0)}}}function i(){let O=!1,le=!1,ne=null,ve=null,se=null;return{setReversed:function(Z){if(le!==Z){const Me=e.get("EXT_clip_control");Z?Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.ZERO_TO_ONE_EXT):Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.NEGATIVE_ONE_TO_ONE_EXT),le=Z;const He=se;se=null,this.setClear(He)}},getReversed:function(){return le},setTest:function(Z){Z?J(n.DEPTH_TEST):ie(n.DEPTH_TEST)},setMask:function(Z){ne!==Z&&!O&&(n.depthMask(Z),ne=Z)},setFunc:function(Z){if(le&&(Z=um[Z]),ve!==Z){switch(Z){case Ql:n.depthFunc(n.NEVER);break;case Jl:n.depthFunc(n.ALWAYS);break;case $l:n.depthFunc(n.LESS);break;case zs:n.depthFunc(n.LEQUAL);break;case ec:n.depthFunc(n.EQUAL);break;case tc:n.depthFunc(n.GEQUAL);break;case ic:n.depthFunc(n.GREATER);break;case nc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ve=Z}},setLocked:function(Z){O=Z},setClear:function(Z){se!==Z&&(se=Z,le&&(Z=1-Z),n.clearDepth(Z))},reset:function(){O=!1,ne=null,ve=null,se=null,le=!1}}}function s(){let O=!1,le=null,ne=null,ve=null,se=null,Z=null,Me=null,He=null,_t=null;return{setTest:function(ht){O||(ht?J(n.STENCIL_TEST):ie(n.STENCIL_TEST))},setMask:function(ht){le!==ht&&!O&&(n.stencilMask(ht),le=ht)},setFunc:function(ht,$i,en){(ne!==ht||ve!==$i||se!==en)&&(n.stencilFunc(ht,$i,en),ne=ht,ve=$i,se=en)},setOp:function(ht,$i,en){(Z!==ht||Me!==$i||He!==en)&&(n.stencilOp(ht,$i,en),Z=ht,Me=$i,He=en)},setLocked:function(ht){O=ht},setClear:function(ht){_t!==ht&&(n.clearStencil(ht),_t=ht)},reset:function(){O=!1,le=null,ne=null,ve=null,se=null,Z=null,Me=null,He=null,_t=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,A=!1,p=null,g=null,_=null,E=null,M=null,b=null,w=null,D=new we(0,0,0),x=0,S=!1,N=null,R=null,U=null,H=null,j=null;const V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,B=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec($)[1]),k=B>=1):$.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),k=B>=2);let K=null,ae={};const he=n.getParameter(n.SCISSOR_BOX),ce=n.getParameter(n.VIEWPORT),Le=new yt().fromArray(he),tt=new yt().fromArray(ce);function nt(O,le,ne,ve){const se=new Uint8Array(4),Z=n.createTexture();n.bindTexture(O,Z),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Me=0;Me<ne;Me++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(le,0,n.RGBA,1,1,ve,0,n.RGBA,n.UNSIGNED_BYTE,se):n.texImage2D(le+Me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,se);return Z}const q={};q[n.TEXTURE_2D]=nt(n.TEXTURE_2D,n.TEXTURE_2D,1),q[n.TEXTURE_CUBE_MAP]=nt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[n.TEXTURE_2D_ARRAY]=nt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),q[n.TEXTURE_3D]=nt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(n.DEPTH_TEST),a.setFunc(zs),Be(!1),At(ld),J(n.CULL_FACE),Je(zt);function J(O){h[O]!==!0&&(n.enable(O),h[O]=!0)}function ie(O){h[O]!==!1&&(n.disable(O),h[O]=!1)}function Pe(O,le){return u[O]!==le?(n.bindFramebuffer(O,le),u[O]=le,O===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=le),O===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=le),!0):!1}function ye(O,le){let ne=f,ve=!1;if(O){ne=d.get(le),ne===void 0&&(ne=[],d.set(le,ne));const se=O.textures;if(ne.length!==se.length||ne[0]!==n.COLOR_ATTACHMENT0){for(let Z=0,Me=se.length;Z<Me;Z++)ne[Z]=n.COLOR_ATTACHMENT0+Z;ne.length=se.length,ve=!0}}else ne[0]!==n.BACK&&(ne[0]=n.BACK,ve=!0);ve&&n.drawBuffers(ne)}function Ie(O){return m!==O?(n.useProgram(O),m=O,!0):!1}const ft={[zi]:n.FUNC_ADD,[O0]:n.FUNC_SUBTRACT,[U0]:n.FUNC_REVERSE_SUBTRACT};ft[B0]=n.MIN,ft[F0]=n.MAX;const Xe={[Kl]:n.ZERO,[Af]:n.ONE,[H0]:n.SRC_COLOR,[oo]:n.SRC_ALPHA,[G0]:n.SRC_ALPHA_SATURATE,[xf]:n.DST_COLOR,[vf]:n.DST_ALPHA,[k0]:n.ONE_MINUS_SRC_COLOR,[Br]:n.ONE_MINUS_SRC_ALPHA,[z0]:n.ONE_MINUS_DST_COLOR,[V0]:n.ONE_MINUS_DST_ALPHA,[W0]:n.CONSTANT_COLOR,[X0]:n.ONE_MINUS_CONSTANT_COLOR,[Y0]:n.CONSTANT_ALPHA,[j0]:n.ONE_MINUS_CONSTANT_ALPHA};function Je(O,le,ne,ve,se,Z,Me,He,_t,ht){if(O===zt){A===!0&&(ie(n.BLEND),A=!1);return}if(A===!1&&(J(n.BLEND),A=!0),O!==hh){if(O!==p||ht!==S){if((g!==zi||M!==zi)&&(n.blendEquation(n.FUNC_ADD),g=zi,M=zi),ht)switch(O){case Ns:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cd:n.blendFunc(n.ONE,n.ONE);break;case hd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case dd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ue("WebGLState: Invalid blending: ",O);break}else switch(O){case Ns:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cd:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case hd:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case dd:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",O);break}_=null,E=null,b=null,w=null,D.set(0,0,0),x=0,p=O,S=ht}return}se=se||le,Z=Z||ne,Me=Me||ve,(le!==g||se!==M)&&(n.blendEquationSeparate(ft[le],ft[se]),g=le,M=se),(ne!==_||ve!==E||Z!==b||Me!==w)&&(n.blendFuncSeparate(Xe[ne],Xe[ve],Xe[Z],Xe[Me]),_=ne,E=ve,b=Z,w=Me),(He.equals(D)===!1||_t!==x)&&(n.blendColor(He.r,He.g,He.b,_t),D.copy(He),x=_t),p=O,S=!1}function it(O,le){O.side===Vi?ie(n.CULL_FACE):J(n.CULL_FACE);let ne=O.side===Jt;le&&(ne=!ne),Be(ne),O.blending===Ns&&O.transparent===!1?Je(zt):Je(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const ve=O.stencilWrite;o.setTest(ve),ve&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ot(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):ie(n.SAMPLE_ALPHA_TO_COVERAGE)}function Be(O){N!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),N=O)}function At(O){O!==I0?(J(n.CULL_FACE),O!==R&&(O===ld?n.cullFace(n.BACK):O===N0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ie(n.CULL_FACE),R=O}function L(O){O!==U&&(k&&n.lineWidth(O),U=O)}function ot(O,le,ne){O?(J(n.POLYGON_OFFSET_FILL),(H!==le||j!==ne)&&(H=le,j=ne,a.getReversed()&&(le=-le),n.polygonOffset(le,ne))):ie(n.POLYGON_OFFSET_FILL)}function Qe(O){O?J(n.SCISSOR_TEST):ie(n.SCISSOR_TEST)}function et(O){O===void 0&&(O=n.TEXTURE0+V-1),K!==O&&(n.activeTexture(O),K=O)}function Ae(O,le,ne){ne===void 0&&(K===null?ne=n.TEXTURE0+V-1:ne=K);let ve=ae[ne];ve===void 0&&(ve={type:void 0,texture:void 0},ae[ne]=ve),(ve.type!==O||ve.texture!==le)&&(K!==ne&&(n.activeTexture(ne),K=ne),n.bindTexture(O,le||q[O]),ve.type=O,ve.texture=le)}function C(){const O=ae[K];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function v(){try{n.compressedTexImage2D(...arguments)}catch(O){Ue("WebGLState:",O)}}function T(){try{n.compressedTexImage3D(...arguments)}catch(O){Ue("WebGLState:",O)}}function I(){try{n.texSubImage2D(...arguments)}catch(O){Ue("WebGLState:",O)}}function X(){try{n.texSubImage3D(...arguments)}catch(O){Ue("WebGLState:",O)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(O){Ue("WebGLState:",O)}}function oe(){try{n.compressedTexSubImage3D(...arguments)}catch(O){Ue("WebGLState:",O)}}function ee(){try{n.texStorage2D(...arguments)}catch(O){Ue("WebGLState:",O)}}function de(){try{n.texStorage3D(...arguments)}catch(O){Ue("WebGLState:",O)}}function be(){try{n.texImage2D(...arguments)}catch(O){Ue("WebGLState:",O)}}function te(){try{n.texImage3D(...arguments)}catch(O){Ue("WebGLState:",O)}}function re(O){Le.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),Le.copy(O))}function xe(O){tt.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),tt.copy(O))}function _e(O,le){let ne=c.get(le);ne===void 0&&(ne=new WeakMap,c.set(le,ne));let ve=ne.get(O);ve===void 0&&(ve=n.getUniformBlockIndex(le,O.name),ne.set(O,ve))}function fe(O,le){const ve=c.get(le).get(O);l.get(le)!==ve&&(n.uniformBlockBinding(le,ve,O.__bindingPointIndex),l.set(le,ve))}function Fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},K=null,ae={},u={},d=new WeakMap,f=[],m=null,A=!1,p=null,g=null,_=null,E=null,M=null,b=null,w=null,D=new we(0,0,0),x=0,S=!1,N=null,R=null,U=null,H=null,j=null,Le.set(0,0,n.canvas.width,n.canvas.height),tt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:ie,bindFramebuffer:Pe,drawBuffers:ye,useProgram:Ie,setBlending:Je,setMaterial:it,setFlipSided:Be,setCullFace:At,setLineWidth:L,setPolygonOffset:ot,setScissorTest:Qe,activeTexture:et,bindTexture:Ae,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:T,texImage2D:be,texImage3D:te,updateUBOMapping:_e,uniformBlockBinding:fe,texStorage2D:ee,texStorage3D:de,texSubImage2D:I,texSubImage3D:X,compressedTexSubImage2D:z,compressedTexSubImage3D:oe,scissor:re,viewport:xe,reset:Fe}}function C_(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new De,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,v){return f?new OffscreenCanvas(C,v):zr("canvas")}function A(C,v,T){let I=1;const X=Ae(C);if((X.width>T||X.height>T)&&(I=T/Math.max(X.width,X.height)),I<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const z=Math.floor(I*X.width),oe=Math.floor(I*X.height);u===void 0&&(u=m(z,oe));const ee=v?m(z,oe):u;return ee.width=z,ee.height=oe,ee.getContext("2d").drawImage(C,0,0,z,oe),Ce("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+z+"x"+oe+")."),ee}else return"data"in C&&Ce("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),C;return C}function p(C){return C.generateMipmaps}function g(C){n.generateMipmap(C)}function _(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(C,v,T,I,X=!1){if(C!==null){if(n[C]!==void 0)return n[C];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let z=v;if(v===n.RED&&(T===n.FLOAT&&(z=n.R32F),T===n.HALF_FLOAT&&(z=n.R16F),T===n.UNSIGNED_BYTE&&(z=n.R8)),v===n.RED_INTEGER&&(T===n.UNSIGNED_BYTE&&(z=n.R8UI),T===n.UNSIGNED_SHORT&&(z=n.R16UI),T===n.UNSIGNED_INT&&(z=n.R32UI),T===n.BYTE&&(z=n.R8I),T===n.SHORT&&(z=n.R16I),T===n.INT&&(z=n.R32I)),v===n.RG&&(T===n.FLOAT&&(z=n.RG32F),T===n.HALF_FLOAT&&(z=n.RG16F),T===n.UNSIGNED_BYTE&&(z=n.RG8)),v===n.RG_INTEGER&&(T===n.UNSIGNED_BYTE&&(z=n.RG8UI),T===n.UNSIGNED_SHORT&&(z=n.RG16UI),T===n.UNSIGNED_INT&&(z=n.RG32UI),T===n.BYTE&&(z=n.RG8I),T===n.SHORT&&(z=n.RG16I),T===n.INT&&(z=n.RG32I)),v===n.RGB_INTEGER&&(T===n.UNSIGNED_BYTE&&(z=n.RGB8UI),T===n.UNSIGNED_SHORT&&(z=n.RGB16UI),T===n.UNSIGNED_INT&&(z=n.RGB32UI),T===n.BYTE&&(z=n.RGB8I),T===n.SHORT&&(z=n.RGB16I),T===n.INT&&(z=n.RGB32I)),v===n.RGBA_INTEGER&&(T===n.UNSIGNED_BYTE&&(z=n.RGBA8UI),T===n.UNSIGNED_SHORT&&(z=n.RGBA16UI),T===n.UNSIGNED_INT&&(z=n.RGBA32UI),T===n.BYTE&&(z=n.RGBA8I),T===n.SHORT&&(z=n.RGBA16I),T===n.INT&&(z=n.RGBA32I)),v===n.RGB&&(T===n.UNSIGNED_INT_5_9_9_9_REV&&(z=n.RGB9_E5),T===n.UNSIGNED_INT_10F_11F_11F_REV&&(z=n.R11F_G11F_B10F)),v===n.RGBA){const oe=X?co:$e.getTransfer(I);T===n.FLOAT&&(z=n.RGBA32F),T===n.HALF_FLOAT&&(z=n.RGBA16F),T===n.UNSIGNED_BYTE&&(z=oe===lt?n.SRGB8_ALPHA8:n.RGBA8),T===n.UNSIGNED_SHORT_4_4_4_4&&(z=n.RGBA4),T===n.UNSIGNED_SHORT_5_5_5_1&&(z=n.RGB5_A1)}return(z===n.R16F||z===n.R32F||z===n.RG16F||z===n.RG32F||z===n.RGBA16F||z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),z}function M(C,v){let T;return C?v===null||v===Ki||v===Ws?T=n.DEPTH24_STENCIL8:v===hi?T=n.DEPTH32F_STENCIL8:v===Fr&&(T=n.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ki||v===Ws?T=n.DEPTH_COMPONENT24:v===hi?T=n.DEPTH_COMPONENT32F:v===Fr&&(T=n.DEPTH_COMPONENT16),T}function b(C,v){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==bt&&C.minFilter!==It?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function w(C){const v=C.target;v.removeEventListener("dispose",w),x(v),v.isVideoTexture&&h.delete(v)}function D(C){const v=C.target;v.removeEventListener("dispose",D),N(v)}function x(C){const v=i.get(C);if(v.__webglInit===void 0)return;const T=C.source,I=d.get(T);if(I){const X=I[v.__cacheKey];X.usedTimes--,X.usedTimes===0&&S(C),Object.keys(I).length===0&&d.delete(T)}i.remove(C)}function S(C){const v=i.get(C);n.deleteTexture(v.__webglTexture);const T=C.source,I=d.get(T);delete I[v.__cacheKey],a.memory.textures--}function N(C){const v=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let I=0;I<6;I++){if(Array.isArray(v.__webglFramebuffer[I]))for(let X=0;X<v.__webglFramebuffer[I].length;X++)n.deleteFramebuffer(v.__webglFramebuffer[I][X]);else n.deleteFramebuffer(v.__webglFramebuffer[I]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[I])}else{if(Array.isArray(v.__webglFramebuffer))for(let I=0;I<v.__webglFramebuffer.length;I++)n.deleteFramebuffer(v.__webglFramebuffer[I]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let I=0;I<v.__webglColorRenderbuffer.length;I++)v.__webglColorRenderbuffer[I]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[I]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const T=C.textures;for(let I=0,X=T.length;I<X;I++){const z=i.get(T[I]);z.__webglTexture&&(n.deleteTexture(z.__webglTexture),a.memory.textures--),i.remove(T[I])}i.remove(C)}let R=0;function U(){R=0}function H(){const C=R;return C>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),R+=1,C}function j(C){const v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function V(C,v){const T=i.get(C);if(C.isVideoTexture&&Qe(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&T.__version!==C.version){const I=C.image;if(I===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(I.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{q(T,C,v);return}}else C.isExternalTexture&&(T.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,T.__webglTexture,n.TEXTURE0+v)}function k(C,v){const T=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&T.__version!==C.version){q(T,C,v);return}else C.isExternalTexture&&(T.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,T.__webglTexture,n.TEXTURE0+v)}function B(C,v){const T=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&T.__version!==C.version){q(T,C,v);return}t.bindTexture(n.TEXTURE_3D,T.__webglTexture,n.TEXTURE0+v)}function $(C,v){const T=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&T.__version!==C.version){J(T,C,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+v)}const K={[In]:n.REPEAT,[Gi]:n.CLAMP_TO_EDGE,[lo]:n.MIRRORED_REPEAT},ae={[bt]:n.NEAREST,[Mf]:n.NEAREST_MIPMAP_NEAREST,[Rr]:n.NEAREST_MIPMAP_LINEAR,[It]:n.LINEAR,[Za]:n.LINEAR_MIPMAP_NEAREST,[cn]:n.LINEAR_MIPMAP_LINEAR},he={[im]:n.NEVER,[om]:n.ALWAYS,[nm]:n.LESS,[Sh]:n.LEQUAL,[sm]:n.EQUAL,[Eh]:n.GEQUAL,[rm]:n.GREATER,[am]:n.NOTEQUAL};function ce(C,v){if(v.type===hi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===It||v.magFilter===Za||v.magFilter===Rr||v.magFilter===cn||v.minFilter===It||v.minFilter===Za||v.minFilter===Rr||v.minFilter===cn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,K[v.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,K[v.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,K[v.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,ae[v.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,ae[v.minFilter]),v.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,he[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===bt||v.minFilter!==Rr&&v.minFilter!==cn||v.type===hi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const T=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,T.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Le(C,v){let T=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",w));const I=v.source;let X=d.get(I);X===void 0&&(X={},d.set(I,X));const z=j(v);if(z!==C.__cacheKey){X[z]===void 0&&(X[z]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,T=!0),X[z].usedTimes++;const oe=X[C.__cacheKey];oe!==void 0&&(X[C.__cacheKey].usedTimes--,oe.usedTimes===0&&S(v)),C.__cacheKey=z,C.__webglTexture=X[z].texture}return T}function tt(C,v,T){return Math.floor(Math.floor(C/T)/v)}function nt(C,v,T,I){const z=C.updateRanges;if(z.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,T,I,v.data);else{z.sort((te,re)=>te.start-re.start);let oe=0;for(let te=1;te<z.length;te++){const re=z[oe],xe=z[te],_e=re.start+re.count,fe=tt(xe.start,v.width,4),Fe=tt(re.start,v.width,4);xe.start<=_e+1&&fe===Fe&&tt(xe.start+xe.count-1,v.width,4)===fe?re.count=Math.max(re.count,xe.start+xe.count-re.start):(++oe,z[oe]=xe)}z.length=oe+1;const ee=n.getParameter(n.UNPACK_ROW_LENGTH),de=n.getParameter(n.UNPACK_SKIP_PIXELS),be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let te=0,re=z.length;te<re;te++){const xe=z[te],_e=Math.floor(xe.start/4),fe=Math.ceil(xe.count/4),Fe=_e%v.width,O=Math.floor(_e/v.width),le=fe,ne=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Fe),n.pixelStorei(n.UNPACK_SKIP_ROWS,O),t.texSubImage2D(n.TEXTURE_2D,0,Fe,O,le,ne,T,I,v.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ee),n.pixelStorei(n.UNPACK_SKIP_PIXELS,de),n.pixelStorei(n.UNPACK_SKIP_ROWS,be)}}function q(C,v,T){let I=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(I=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(I=n.TEXTURE_3D);const X=Le(C,v),z=v.source;t.bindTexture(I,C.__webglTexture,n.TEXTURE0+T);const oe=i.get(z);if(z.version!==oe.__version||X===!0){t.activeTexture(n.TEXTURE0+T);const ee=$e.getPrimaries($e.workingColorSpace),de=v.colorSpace===En?null:$e.getPrimaries(v.colorSpace),be=v.colorSpace===En||ee===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let te=A(v.image,!1,s.maxTextureSize);te=et(v,te);const re=r.convert(v.format,v.colorSpace),xe=r.convert(v.type);let _e=E(v.internalFormat,re,xe,v.colorSpace,v.isVideoTexture);ce(I,v);let fe;const Fe=v.mipmaps,O=v.isVideoTexture!==!0,le=oe.__version===void 0||X===!0,ne=z.dataReady,ve=b(v,te);if(v.isDepthTexture)_e=M(v.format===Rn,v.type),le&&(O?t.texStorage2D(n.TEXTURE_2D,1,_e,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,_e,te.width,te.height,0,re,xe,null));else if(v.isDataTexture)if(Fe.length>0){O&&le&&t.texStorage2D(n.TEXTURE_2D,ve,_e,Fe[0].width,Fe[0].height);for(let se=0,Z=Fe.length;se<Z;se++)fe=Fe[se],O?ne&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,fe.width,fe.height,re,xe,fe.data):t.texImage2D(n.TEXTURE_2D,se,_e,fe.width,fe.height,0,re,xe,fe.data);v.generateMipmaps=!1}else O?(le&&t.texStorage2D(n.TEXTURE_2D,ve,_e,te.width,te.height),ne&&nt(v,te,re,xe)):t.texImage2D(n.TEXTURE_2D,0,_e,te.width,te.height,0,re,xe,te.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){O&&le&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,_e,Fe[0].width,Fe[0].height,te.depth);for(let se=0,Z=Fe.length;se<Z;se++)if(fe=Fe[se],v.format!==_i)if(re!==null)if(O){if(ne)if(v.layerUpdates.size>0){const Me=nu(fe.width,fe.height,v.format,v.type);for(const He of v.layerUpdates){const _t=fe.data.subarray(He*Me/fe.data.BYTES_PER_ELEMENT,(He+1)*Me/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,He,fe.width,fe.height,1,re,_t)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,fe.width,fe.height,te.depth,re,fe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,se,_e,fe.width,fe.height,te.depth,0,fe.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?ne&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,fe.width,fe.height,te.depth,re,xe,fe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,se,_e,fe.width,fe.height,te.depth,0,re,xe,fe.data)}else{O&&le&&t.texStorage2D(n.TEXTURE_2D,ve,_e,Fe[0].width,Fe[0].height);for(let se=0,Z=Fe.length;se<Z;se++)fe=Fe[se],v.format!==_i?re!==null?O?ne&&t.compressedTexSubImage2D(n.TEXTURE_2D,se,0,0,fe.width,fe.height,re,fe.data):t.compressedTexImage2D(n.TEXTURE_2D,se,_e,fe.width,fe.height,0,fe.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?ne&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,fe.width,fe.height,re,xe,fe.data):t.texImage2D(n.TEXTURE_2D,se,_e,fe.width,fe.height,0,re,xe,fe.data)}else if(v.isDataArrayTexture)if(O){if(le&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,_e,te.width,te.height,te.depth),ne)if(v.layerUpdates.size>0){const se=nu(te.width,te.height,v.format,v.type);for(const Z of v.layerUpdates){const Me=te.data.subarray(Z*se/te.data.BYTES_PER_ELEMENT,(Z+1)*se/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Z,te.width,te.height,1,re,xe,Me)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,re,xe,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,_e,te.width,te.height,te.depth,0,re,xe,te.data);else if(v.isData3DTexture)O?(le&&t.texStorage3D(n.TEXTURE_3D,ve,_e,te.width,te.height,te.depth),ne&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,re,xe,te.data)):t.texImage3D(n.TEXTURE_3D,0,_e,te.width,te.height,te.depth,0,re,xe,te.data);else if(v.isFramebufferTexture){if(le)if(O)t.texStorage2D(n.TEXTURE_2D,ve,_e,te.width,te.height);else{let se=te.width,Z=te.height;for(let Me=0;Me<ve;Me++)t.texImage2D(n.TEXTURE_2D,Me,_e,se,Z,0,re,xe,null),se>>=1,Z>>=1}}else if(Fe.length>0){if(O&&le){const se=Ae(Fe[0]);t.texStorage2D(n.TEXTURE_2D,ve,_e,se.width,se.height)}for(let se=0,Z=Fe.length;se<Z;se++)fe=Fe[se],O?ne&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,re,xe,fe):t.texImage2D(n.TEXTURE_2D,se,_e,re,xe,fe);v.generateMipmaps=!1}else if(O){if(le){const se=Ae(te);t.texStorage2D(n.TEXTURE_2D,ve,_e,se.width,se.height)}ne&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,re,xe,te)}else t.texImage2D(n.TEXTURE_2D,0,_e,re,xe,te);p(v)&&g(I),oe.__version=z.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function J(C,v,T){if(v.image.length!==6)return;const I=Le(C,v),X=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+T);const z=i.get(X);if(X.version!==z.__version||I===!0){t.activeTexture(n.TEXTURE0+T);const oe=$e.getPrimaries($e.workingColorSpace),ee=v.colorSpace===En?null:$e.getPrimaries(v.colorSpace),de=v.colorSpace===En||oe===ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const be=v.isCompressedTexture||v.image[0].isCompressedTexture,te=v.image[0]&&v.image[0].isDataTexture,re=[];for(let Z=0;Z<6;Z++)!be&&!te?re[Z]=A(v.image[Z],!0,s.maxCubemapSize):re[Z]=te?v.image[Z].image:v.image[Z],re[Z]=et(v,re[Z]);const xe=re[0],_e=r.convert(v.format,v.colorSpace),fe=r.convert(v.type),Fe=E(v.internalFormat,_e,fe,v.colorSpace),O=v.isVideoTexture!==!0,le=z.__version===void 0||I===!0,ne=X.dataReady;let ve=b(v,xe);ce(n.TEXTURE_CUBE_MAP,v);let se;if(be){O&&le&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ve,Fe,xe.width,xe.height);for(let Z=0;Z<6;Z++){se=re[Z].mipmaps;for(let Me=0;Me<se.length;Me++){const He=se[Me];v.format!==_i?_e!==null?O?ne&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,0,0,He.width,He.height,_e,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,Fe,He.width,He.height,0,He.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,0,0,He.width,He.height,_e,fe,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,Fe,He.width,He.height,0,_e,fe,He.data)}}}else{if(se=v.mipmaps,O&&le){se.length>0&&ve++;const Z=Ae(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ve,Fe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(te){O?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,re[Z].width,re[Z].height,_e,fe,re[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Fe,re[Z].width,re[Z].height,0,_e,fe,re[Z].data);for(let Me=0;Me<se.length;Me++){const _t=se[Me].image[Z].image;O?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,0,0,_t.width,_t.height,_e,fe,_t.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,Fe,_t.width,_t.height,0,_e,fe,_t.data)}}else{O?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,_e,fe,re[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Fe,_e,fe,re[Z]);for(let Me=0;Me<se.length;Me++){const He=se[Me];O?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,0,0,_e,fe,He.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,Fe,_e,fe,He.image[Z])}}}p(v)&&g(n.TEXTURE_CUBE_MAP),z.__version=X.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function ie(C,v,T,I,X,z){const oe=r.convert(T.format,T.colorSpace),ee=r.convert(T.type),de=E(T.internalFormat,oe,ee,T.colorSpace),be=i.get(v),te=i.get(T);if(te.__renderTarget=v,!be.__hasExternalTextures){const re=Math.max(1,v.width>>z),xe=Math.max(1,v.height>>z);X===n.TEXTURE_3D||X===n.TEXTURE_2D_ARRAY?t.texImage3D(X,z,de,re,xe,v.depth,0,oe,ee,null):t.texImage2D(X,z,de,re,xe,0,oe,ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),ot(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,I,X,te.__webglTexture,0,L(v)):(X===n.TEXTURE_2D||X>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,I,X,te.__webglTexture,z),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(C,v,T){if(n.bindRenderbuffer(n.RENDERBUFFER,C),v.depthBuffer){const I=v.depthTexture,X=I&&I.isDepthTexture?I.type:null,z=M(v.stencilBuffer,X),oe=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ot(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(v),z,v.width,v.height):T?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(v),z,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,z,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,C)}else{const I=v.textures;for(let X=0;X<I.length;X++){const z=I[X],oe=r.convert(z.format,z.colorSpace),ee=r.convert(z.type),de=E(z.internalFormat,oe,ee,z.colorSpace);ot(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(v),de,v.width,v.height):T?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(v),de,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,de,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ye(C,v,T){const I=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(v.depthTexture);if(X.__renderTarget=v,(!X.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),I){if(X.__webglInit===void 0&&(X.__webglInit=!0,v.depthTexture.addEventListener("dispose",w)),X.__webglTexture===void 0){X.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),ce(n.TEXTURE_CUBE_MAP,v.depthTexture);const be=r.convert(v.depthTexture.format),te=r.convert(v.depthTexture.type);let re;v.depthTexture.format===un?re=n.DEPTH_COMPONENT24:v.depthTexture.format===Rn&&(re=n.DEPTH24_STENCIL8);for(let xe=0;xe<6;xe++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,re,v.width,v.height,0,be,te,null)}}else V(v.depthTexture,0);const z=X.__webglTexture,oe=L(v),ee=I?n.TEXTURE_CUBE_MAP_POSITIVE_X+T:n.TEXTURE_2D,de=v.depthTexture.format===Rn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===un)ot(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ee,z,0,oe):n.framebufferTexture2D(n.FRAMEBUFFER,de,ee,z,0);else if(v.depthTexture.format===Rn)ot(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,ee,z,0,oe):n.framebufferTexture2D(n.FRAMEBUFFER,de,ee,z,0);else throw new Error("Unknown depthTexture format")}function Ie(C){const v=i.get(C),T=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){const I=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),I){const X=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,I.removeEventListener("dispose",X)};I.addEventListener("dispose",X),v.__depthDisposeCallback=X}v.__boundDepthTexture=I}if(C.depthTexture&&!v.__autoAllocateDepthBuffer)if(T)for(let I=0;I<6;I++)ye(v.__webglFramebuffer[I],C,I);else{const I=C.texture.mipmaps;I&&I.length>0?ye(v.__webglFramebuffer[0],C,0):ye(v.__webglFramebuffer,C,0)}else if(T){v.__webglDepthbuffer=[];for(let I=0;I<6;I++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[I]),v.__webglDepthbuffer[I]===void 0)v.__webglDepthbuffer[I]=n.createRenderbuffer(),Pe(v.__webglDepthbuffer[I],C,!1);else{const X=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=v.__webglDepthbuffer[I];n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,X,n.RENDERBUFFER,z)}}else{const I=C.texture.mipmaps;if(I&&I.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),Pe(v.__webglDepthbuffer,C,!1);else{const X=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,X,n.RENDERBUFFER,z)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ft(C,v,T){const I=i.get(C);v!==void 0&&ie(I.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),T!==void 0&&Ie(C)}function Xe(C){const v=C.texture,T=i.get(C),I=i.get(v);C.addEventListener("dispose",D);const X=C.textures,z=C.isWebGLCubeRenderTarget===!0,oe=X.length>1;if(oe||(I.__webglTexture===void 0&&(I.__webglTexture=n.createTexture()),I.__version=v.version,a.memory.textures++),z){T.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0){T.__webglFramebuffer[ee]=[];for(let de=0;de<v.mipmaps.length;de++)T.__webglFramebuffer[ee][de]=n.createFramebuffer()}else T.__webglFramebuffer[ee]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){T.__webglFramebuffer=[];for(let ee=0;ee<v.mipmaps.length;ee++)T.__webglFramebuffer[ee]=n.createFramebuffer()}else T.__webglFramebuffer=n.createFramebuffer();if(oe)for(let ee=0,de=X.length;ee<de;ee++){const be=i.get(X[ee]);be.__webglTexture===void 0&&(be.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&ot(C)===!1){T.__webglMultisampledFramebuffer=n.createFramebuffer(),T.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,T.__webglMultisampledFramebuffer);for(let ee=0;ee<X.length;ee++){const de=X[ee];T.__webglColorRenderbuffer[ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,T.__webglColorRenderbuffer[ee]);const be=r.convert(de.format,de.colorSpace),te=r.convert(de.type),re=E(de.internalFormat,be,te,de.colorSpace,C.isXRRenderTarget===!0),xe=L(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,xe,re,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ee,n.RENDERBUFFER,T.__webglColorRenderbuffer[ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(T.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(T.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(z){t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture),ce(n.TEXTURE_CUBE_MAP,v);for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)ie(T.__webglFramebuffer[ee][de],C,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de);else ie(T.__webglFramebuffer[ee],C,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);p(v)&&g(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let ee=0,de=X.length;ee<de;ee++){const be=X[ee],te=i.get(be);let re=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(re=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,te.__webglTexture),ce(re,be),ie(T.__webglFramebuffer,C,be,n.COLOR_ATTACHMENT0+ee,re,0),p(be)&&g(re)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ee=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,I.__webglTexture),ce(ee,v),v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)ie(T.__webglFramebuffer[de],C,v,n.COLOR_ATTACHMENT0,ee,de);else ie(T.__webglFramebuffer,C,v,n.COLOR_ATTACHMENT0,ee,0);p(v)&&g(ee),t.unbindTexture()}C.depthBuffer&&Ie(C)}function Je(C){const v=C.textures;for(let T=0,I=v.length;T<I;T++){const X=v[T];if(p(X)){const z=_(C),oe=i.get(X).__webglTexture;t.bindTexture(z,oe),g(z),t.unbindTexture()}}}const it=[],Be=[];function At(C){if(C.samples>0){if(ot(C)===!1){const v=C.textures,T=C.width,I=C.height;let X=n.COLOR_BUFFER_BIT;const z=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=i.get(C),ee=v.length>1;if(ee)for(let be=0;be<v.length;be++)t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);const de=C.texture.mipmaps;de&&de.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let be=0;be<v.length;be++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(X|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(X|=n.STENCIL_BUFFER_BIT)),ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,oe.__webglColorRenderbuffer[be]);const te=i.get(v[be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,te,0)}n.blitFramebuffer(0,0,T,I,0,0,T,I,X,n.NEAREST),l===!0&&(it.length=0,Be.length=0,it.push(n.COLOR_ATTACHMENT0+be),C.depthBuffer&&C.resolveDepthBuffer===!1&&(it.push(z),Be.push(z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Be)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,it))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ee)for(let be=0;be<v.length;be++){t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,oe.__webglColorRenderbuffer[be]);const te=i.get(v[be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,te,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const v=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function L(C){return Math.min(s.maxSamples,C.samples)}function ot(C){const v=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Qe(C){const v=a.render.frame;h.get(C)!==v&&(h.set(C,v),C.update())}function et(C,v){const T=C.colorSpace,I=C.format,X=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||T!==ii&&T!==En&&($e.getTransfer(T)===lt?(I!==_i||X!==ci)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ue("WebGLTextures: Unsupported texture color space:",T)),v}function Ae(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=U,this.setTexture2D=V,this.setTexture2DArray=k,this.setTexture3D=B,this.setTextureCube=$,this.rebindTextures=ft,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=ot,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function R_(n,e){function t(i,s=En){let r;const a=$e.getTransfer(s);if(i===ci)return n.UNSIGNED_BYTE;if(i===xh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===_h)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Sf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ef)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===yf)return n.BYTE;if(i===bf)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===vh)return n.INT;if(i===Ki)return n.UNSIGNED_INT;if(i===hi)return n.FLOAT;if(i===ti)return n.HALF_FLOAT;if(i===wf)return n.ALPHA;if(i===Tf)return n.RGB;if(i===_i)return n.RGBA;if(i===un)return n.DEPTH_COMPONENT;if(i===Rn)return n.DEPTH_STENCIL;if(i===Co)return n.RED;if(i===Mh)return n.RED_INTEGER;if(i===Xs)return n.RG;if(i===yh)return n.RG_INTEGER;if(i===bh)return n.RGBA_INTEGER;if(i===Ka||i===Qa||i===Ja||i===$a)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ka)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ka)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sc||i===rc||i===ac||i===oc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===sc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ac)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===oc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===lc||i===cc||i===hc||i===dc||i===uc||i===fc||i===pc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===lc||i===cc)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===hc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===dc)return r.COMPRESSED_R11_EAC;if(i===uc)return r.COMPRESSED_SIGNED_R11_EAC;if(i===fc)return r.COMPRESSED_RG11_EAC;if(i===pc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===mc||i===gc||i===Ac||i===vc||i===xc||i===_c||i===Mc||i===yc||i===bc||i===Sc||i===Ec||i===wc||i===Tc||i===Cc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===mc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ac)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_c)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Mc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===bc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Sc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ec)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===wc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Tc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Cc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rc||i===Dc||i===Pc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Rc)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Dc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Pc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Lc||i===Ic||i===Nc||i===Oc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Lc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ws?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const D_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,P_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class L_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Ff(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Nt({vertexShader:D_,fragmentShader:P_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new at(new Jn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class I_ extends ss{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null;const A=typeof XRWebGLBinding<"u",p=new L_,g={},_=t.getContextAttributes();let E=null,M=null;const b=[],w=[],D=new De;let x=null;const S=new Gt;S.viewport=new yt;const N=new Gt;N.viewport=new yt;const R=[S,N],U=new Lg;let H=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=b[q];return J===void 0&&(J=new al,b[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=b[q];return J===void 0&&(J=new al,b[q]=J),J.getGripSpace()},this.getHand=function(q){let J=b[q];return J===void 0&&(J=new al,b[q]=J),J.getHandSpace()};function V(q){const J=w.indexOf(q.inputSource);if(J===-1)return;const ie=b[J];ie!==void 0&&(ie.update(q.inputSource,q.frame,c||a),ie.dispatchEvent({type:q.type,data:q.inputSource}))}function k(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",B);for(let q=0;q<b.length;q++){const J=w[q];J!==null&&(w[q]=null,b[q].disconnect(J))}H=null,j=null,p.reset();for(const q in g)delete g[q];e.setRenderTarget(E),f=null,d=null,u=null,s=null,M=null,nt.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(D.width,D.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&A&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",k),s.addEventListener("inputsourceschange",B),_.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(D),A&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,Pe=null,ye=null;_.depth&&(ye=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=_.stencil?Rn:un,Pe=_.stencil?Ws:Ki);const Ie={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ie),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new qt(d.textureWidth,d.textureHeight,{format:_i,type:ci,depthTexture:new js(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ie={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new qt(f.framebufferWidth,f.framebufferHeight,{format:_i,type:ci,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function B(q){for(let J=0;J<q.removed.length;J++){const ie=q.removed[J],Pe=w.indexOf(ie);Pe>=0&&(w[Pe]=null,b[Pe].disconnect(ie))}for(let J=0;J<q.added.length;J++){const ie=q.added[J];let Pe=w.indexOf(ie);if(Pe===-1){for(let Ie=0;Ie<b.length;Ie++)if(Ie>=w.length){w.push(ie),Pe=Ie;break}else if(w[Ie]===null){w[Ie]=ie,Pe=Ie;break}if(Pe===-1)break}const ye=b[Pe];ye&&ye.connect(ie)}}const $=new P,K=new P;function ae(q,J,ie){$.setFromMatrixPosition(J.matrixWorld),K.setFromMatrixPosition(ie.matrixWorld);const Pe=$.distanceTo(K),ye=J.projectionMatrix.elements,Ie=ie.projectionMatrix.elements,ft=ye[14]/(ye[10]-1),Xe=ye[14]/(ye[10]+1),Je=(ye[9]+1)/ye[5],it=(ye[9]-1)/ye[5],Be=(ye[8]-1)/ye[0],At=(Ie[8]+1)/Ie[0],L=ft*Be,ot=ft*At,Qe=Pe/(-Be+At),et=Qe*-Be;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(et),q.translateZ(Qe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),ye[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Ae=ft+Qe,C=Xe+Qe,v=L-et,T=ot+(Pe-et),I=Je*Xe/C*Ae,X=it*Xe/C*Ae;q.projectionMatrix.makePerspective(v,T,I,X,Ae,C),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function he(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let J=q.near,ie=q.far;p.texture!==null&&(p.depthNear>0&&(J=p.depthNear),p.depthFar>0&&(ie=p.depthFar)),U.near=N.near=S.near=J,U.far=N.far=S.far=ie,(H!==U.near||j!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),H=U.near,j=U.far),U.layers.mask=q.layers.mask|6,S.layers.mask=U.layers.mask&-5,N.layers.mask=U.layers.mask&-3;const Pe=q.parent,ye=U.cameras;he(U,Pe);for(let Ie=0;Ie<ye.length;Ie++)he(ye[Ie],Pe);ye.length===2?ae(U,S,N):U.projectionMatrix.copy(S.projectionMatrix),ce(q,U,Pe)};function ce(q,J,ie){ie===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(ie.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ys*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(q){return g[q]};let Le=null;function tt(q,J){if(h=J.getViewerPose(c||a),m=J,h!==null){const ie=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let Pe=!1;ie.length!==U.cameras.length&&(U.cameras.length=0,Pe=!0);for(let Xe=0;Xe<ie.length;Xe++){const Je=ie[Xe];let it=null;if(f!==null)it=f.getViewport(Je);else{const At=u.getViewSubImage(d,Je);it=At.viewport,Xe===0&&(e.setRenderTargetTextures(M,At.colorTexture,At.depthStencilTexture),e.setRenderTarget(M))}let Be=R[Xe];Be===void 0&&(Be=new Gt,Be.layers.enable(Xe),Be.viewport=new yt,R[Xe]=Be),Be.matrix.fromArray(Je.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Je.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(it.x,it.y,it.width,it.height),Xe===0&&(U.matrix.copy(Be.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Pe===!0&&U.cameras.push(Be)}const ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&A){u=i.getBinding();const Xe=u.getDepthInformation(ie[0]);Xe&&Xe.isValid&&Xe.texture&&p.init(Xe,s.renderState)}if(ye&&ye.includes("camera-access")&&A){e.state.unbindTexture(),u=i.getBinding();for(let Xe=0;Xe<ie.length;Xe++){const Je=ie[Xe].camera;if(Je){let it=g[Je];it||(it=new Ff,g[Je]=it);const Be=u.getCameraImage(Je);it.sourceTexture=Be}}}}for(let ie=0;ie<b.length;ie++){const Pe=w[ie],ye=b[ie];Pe!==null&&ye!==void 0&&ye.update(Pe,J,c||a)}Le&&Le(q,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),m=null}const nt=new jf;nt.setAnimationLoop(tt),this.setAnimationLoop=function(q){Le=q},this.dispose=function(){}}}const Yn=new Li,N_=new Ve;function O_(n,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,Hf(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,_,E,M){g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),u(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,M)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),A(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,_,E):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Jt&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Jt&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const _=e.get(g),E=_.envMap,M=_.envMapRotation;E&&(p.envMap.value=E,Yn.copy(M),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),p.envMapRotation.value.setFromMatrix4(N_.makeRotationFromEuler(Yn)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,_,E){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*_,p.scale.value=E*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,_){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Jt&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function A(p,g){const _=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function U_(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,E){const M=E.program;i.uniformBlockBinding(_,M)}function c(_,E){let M=s[_.id];M===void 0&&(m(_),M=h(_),s[_.id]=M,_.addEventListener("dispose",p));const b=E.program;i.updateUBOMapping(_,b);const w=e.render.frame;r[_.id]!==w&&(d(_),r[_.id]=w)}function h(_){const E=u();_.__bindingPointIndex=E;const M=n.createBuffer(),b=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,b,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,M),M}function u(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Ue("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const E=s[_.id],M=_.uniforms,b=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let w=0,D=M.length;w<D;w++){const x=Array.isArray(M[w])?M[w]:[M[w]];for(let S=0,N=x.length;S<N;S++){const R=x[S];if(f(R,w,S,b)===!0){const U=R.__offset,H=Array.isArray(R.value)?R.value:[R.value];let j=0;for(let V=0;V<H.length;V++){const k=H[V],B=A(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,U+j,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,j),j+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,E,M,b){const w=_.value,D=E+"_"+M;if(b[D]===void 0)return typeof w=="number"||typeof w=="boolean"?b[D]=w:b[D]=w.clone(),!0;{const x=b[D];if(typeof w=="number"||typeof w=="boolean"){if(x!==w)return b[D]=w,!0}else if(x.equals(w)===!1)return x.copy(w),!0}return!1}function m(_){const E=_.uniforms;let M=0;const b=16;for(let D=0,x=E.length;D<x;D++){const S=Array.isArray(E[D])?E[D]:[E[D]];for(let N=0,R=S.length;N<R;N++){const U=S[N],H=Array.isArray(U.value)?U.value:[U.value];for(let j=0,V=H.length;j<V;j++){const k=H[j],B=A(k),$=M%b,K=$%B.boundary,ae=$+K;M+=K,ae!==0&&b-ae<B.storage&&(M+=b-ae),U.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=B.storage}}}const w=M%b;return w>0&&(M+=b-w),_.__size=M,_.__cache={},this}function A(_){const E={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(E.boundary=4,E.storage=4):_.isVector2?(E.boundary=8,E.storage=8):_.isVector3||_.isColor?(E.boundary=16,E.storage=12):_.isVector4?(E.boundary=16,E.storage=16):_.isMatrix3?(E.boundary=48,E.storage=48):_.isMatrix4?(E.boundary=64,E.storage=64):_.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ce("WebGLRenderer: Unsupported uniform value type.",_),E}function p(_){const E=_.target;E.removeEventListener("dispose",p);const M=a.indexOf(E.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function g(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:g}}const B_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Fi=null;function F_(){return Fi===null&&(Fi=new Lo(B_,16,16,Xs,ti),Fi.name="DFG_LUT",Fi.minFilter=It,Fi.magFilter=It,Fi.wrapS=Gi,Fi.wrapT=Gi,Fi.generateMipmaps=!1,Fi.needsUpdate=!0),Fi}class $f{constructor(e={}){const{canvas:t=hm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ci}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const A=f,p=new Set([bh,yh,Mh]),g=new Set([ci,Ki,Fr,Ws,xh,_h]),_=new Uint32Array(4),E=new Int32Array(4);let M=null,b=null;const w=[],D=[];let x=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ji,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let N=!1;this._outputColorSpace=Lt;let R=0,U=0,H=null,j=-1,V=null;const k=new yt,B=new yt;let $=null;const K=new we(0);let ae=0,he=t.width,ce=t.height,Le=1,tt=null,nt=null;const q=new yt(0,0,he,ce),J=new yt(0,0,he,ce);let ie=!1;const Pe=new Io;let ye=!1,Ie=!1;const ft=new Ve,Xe=new P,Je=new yt,it={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Be=!1;function At(){return H===null?Le:1}let L=i;function ot(y,F){return t.getContext(y,F)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ch}`),t.addEventListener("webglcontextlost",Me,!1),t.addEventListener("webglcontextrestored",He,!1),t.addEventListener("webglcontextcreationerror",_t,!1),L===null){const F="webgl2";if(L=ot(F,y),L===null)throw ot(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw Ue("WebGLRenderer: "+y.message),y}let Qe,et,Ae,C,v,T,I,X,z,oe,ee,de,be,te,re,xe,_e,fe,Fe,O,le,ne,ve;function se(){Qe=new H1(L),Qe.init(),le=new R_(L,Qe),et=new P1(L,Qe,e,le),Ae=new T_(L,Qe),et.reversedDepthBuffer&&d&&Ae.buffers.depth.setReversed(!0),C=new z1(L),v=new f_,T=new C_(L,Qe,Ae,v,et,le,C),I=new F1(S),X=new jg(L),ne=new R1(L,X),z=new k1(L,X,C,ne),oe=new W1(L,z,X,ne,C),fe=new G1(L,et,T),re=new L1(v),ee=new u_(S,I,Qe,et,ne,re),de=new O_(S,v),be=new m_,te=new M_(Qe),_e=new C1(S,I,Ae,oe,m,l),xe=new w_(S,oe,et),ve=new U_(L,C,et,Ae),Fe=new D1(L,Qe,C),O=new V1(L,Qe,C),C.programs=ee.programs,S.capabilities=et,S.extensions=Qe,S.properties=v,S.renderLists=be,S.shadowMap=xe,S.state=Ae,S.info=C}se(),A!==ci&&(x=new Y1(A,t.width,t.height,s,r));const Z=new I_(S,L);this.xr=Z,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=Qe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Qe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return Le},this.setPixelRatio=function(y){y!==void 0&&(Le=y,this.setSize(he,ce,!1))},this.getSize=function(y){return y.set(he,ce)},this.setSize=function(y,F,Y=!0){if(Z.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}he=y,ce=F,t.width=Math.floor(y*Le),t.height=Math.floor(F*Le),Y===!0&&(t.style.width=y+"px",t.style.height=F+"px"),x!==null&&x.setSize(t.width,t.height),this.setViewport(0,0,y,F)},this.getDrawingBufferSize=function(y){return y.set(he*Le,ce*Le).floor()},this.setDrawingBufferSize=function(y,F,Y){he=y,ce=F,Le=Y,t.width=Math.floor(y*Y),t.height=Math.floor(F*Y),this.setViewport(0,0,y,F)},this.setEffects=function(y){if(A===ci){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let F=0;F<y.length;F++)if(y[F].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(k)},this.getViewport=function(y){return y.copy(q)},this.setViewport=function(y,F,Y,W){y.isVector4?q.set(y.x,y.y,y.z,y.w):q.set(y,F,Y,W),Ae.viewport(k.copy(q).multiplyScalar(Le).round())},this.getScissor=function(y){return y.copy(J)},this.setScissor=function(y,F,Y,W){y.isVector4?J.set(y.x,y.y,y.z,y.w):J.set(y,F,Y,W),Ae.scissor(B.copy(J).multiplyScalar(Le).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(y){Ae.setScissorTest(ie=y)},this.setOpaqueSort=function(y){tt=y},this.setTransparentSort=function(y){nt=y},this.getClearColor=function(y){return y.copy(_e.getClearColor())},this.setClearColor=function(){_e.setClearColor(...arguments)},this.getClearAlpha=function(){return _e.getClearAlpha()},this.setClearAlpha=function(){_e.setClearAlpha(...arguments)},this.clear=function(y=!0,F=!0,Y=!0){let W=0;if(y){let G=!1;if(H!==null){const pe=H.texture.format;G=p.has(pe)}if(G){const pe=H.texture.type,ge=g.has(pe),me=_e.getClearColor(),Se=_e.getClearAlpha(),Te=me.r,ze=me.g,je=me.b;ge?(_[0]=Te,_[1]=ze,_[2]=je,_[3]=Se,L.clearBufferuiv(L.COLOR,0,_)):(E[0]=Te,E[1]=ze,E[2]=je,E[3]=Se,L.clearBufferiv(L.COLOR,0,E))}else W|=L.COLOR_BUFFER_BIT}F&&(W|=L.DEPTH_BUFFER_BIT),Y&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Me,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",_t,!1),_e.dispose(),be.dispose(),te.dispose(),v.dispose(),I.dispose(),oe.dispose(),ne.dispose(),ve.dispose(),ee.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",Wh),Z.removeEventListener("sessionend",Xh),Un.stop()};function Me(y){y.preventDefault(),ho("WebGLRenderer: Context Lost."),N=!0}function He(){ho("WebGLRenderer: Context Restored."),N=!1;const y=C.autoReset,F=xe.enabled,Y=xe.autoUpdate,W=xe.needsUpdate,G=xe.type;se(),C.autoReset=y,xe.enabled=F,xe.autoUpdate=Y,xe.needsUpdate=W,xe.type=G}function _t(y){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ht(y){const F=y.target;F.removeEventListener("dispose",ht),$i(F)}function $i(y){en(y),v.remove(y)}function en(y){const F=v.get(y).programs;F!==void 0&&(F.forEach(function(Y){ee.releaseProgram(Y)}),y.isShaderMaterial&&ee.releaseShaderCache(y))}this.renderBufferDirect=function(y,F,Y,W,G,pe){F===null&&(F=it);const ge=G.isMesh&&G.matrixWorld.determinant()<0,me=zp(y,F,Y,W,G);Ae.setMaterial(W,ge);let Se=Y.index,Te=1;if(W.wireframe===!0){if(Se=z.getWireframeAttribute(Y),Se===void 0)return;Te=2}const ze=Y.drawRange,je=Y.attributes.position;let Re=ze.start*Te,pt=(ze.start+ze.count)*Te;pe!==null&&(Re=Math.max(Re,pe.start*Te),pt=Math.min(pt,(pe.start+pe.count)*Te)),Se!==null?(Re=Math.max(Re,0),pt=Math.min(pt,Se.count)):je!=null&&(Re=Math.max(Re,0),pt=Math.min(pt,je.count));const Ct=pt-Re;if(Ct<0||Ct===1/0)return;ne.setup(G,W,me,Y,Se);let Tt,mt=Fe;if(Se!==null&&(Tt=X.get(Se),mt=O,mt.setIndex(Tt)),G.isMesh)W.wireframe===!0?(Ae.setLineWidth(W.wireframeLinewidth*At()),mt.setMode(L.LINES)):mt.setMode(L.TRIANGLES);else if(G.isLine){let Wt=W.linewidth;Wt===void 0&&(Wt=1),Ae.setLineWidth(Wt*At()),G.isLineSegments?mt.setMode(L.LINES):G.isLineLoop?mt.setMode(L.LINE_LOOP):mt.setMode(L.LINE_STRIP)}else G.isPoints?mt.setMode(L.POINTS):G.isSprite&&mt.setMode(L.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)uo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Qe.get("WEBGL_multi_draw"))mt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Wt=G._multiDrawStarts,Ee=G._multiDrawCounts,ai=G._multiDrawCount,st=Se?X.get(Se).bytesPerElement:1,Mi=v.get(W).currentProgram.getUniforms();for(let Ui=0;Ui<ai;Ui++)Mi.setValue(L,"_gl_DrawID",Ui),mt.render(Wt[Ui]/st,Ee[Ui])}else if(G.isInstancedMesh)mt.renderInstances(Re,Ct,G.count);else if(Y.isInstancedBufferGeometry){const Wt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ee=Math.min(Y.instanceCount,Wt);mt.renderInstances(Re,Ct,Ee)}else mt.render(Re,Ct)};function Gh(y,F,Y){y.transparent===!0&&y.side===Vi&&y.forceSinglePass===!1?(y.side=Jt,y.needsUpdate=!0,na(y,F,Y),y.side=Zi,y.needsUpdate=!0,na(y,F,Y),y.side=Vi):na(y,F,Y)}this.compile=function(y,F,Y=null){Y===null&&(Y=y),b=te.get(Y),b.init(F),D.push(b),Y.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),y!==Y&&y.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights();const W=new Set;return y.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const pe=G.material;if(pe)if(Array.isArray(pe))for(let ge=0;ge<pe.length;ge++){const me=pe[ge];Gh(me,Y,G),W.add(me)}else Gh(pe,Y,G),W.add(pe)}),b=D.pop(),W},this.compileAsync=function(y,F,Y=null){const W=this.compile(y,F,Y);return new Promise(G=>{function pe(){if(W.forEach(function(ge){v.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){G(y);return}setTimeout(pe,10)}Qe.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Vo=null;function Vp(y){Vo&&Vo(y)}function Wh(){Un.stop()}function Xh(){Un.start()}const Un=new jf;Un.setAnimationLoop(Vp),typeof self<"u"&&Un.setContext(self),this.setAnimationLoop=function(y){Vo=y,Z.setAnimationLoop(y),y===null?Un.stop():Un.start()},Z.addEventListener("sessionstart",Wh),Z.addEventListener("sessionend",Xh),this.render=function(y,F){if(F!==void 0&&F.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;const Y=Z.enabled===!0&&Z.isPresenting===!0,W=x!==null&&(H===null||Y)&&x.begin(S,H);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),y.isScene===!0&&y.onBeforeRender(S,y,F,H),b=te.get(y,D.length),b.init(F),D.push(b),ft.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Pe.setFromProjectionMatrix(ft,Wi,F.reversedDepth),Ie=this.localClippingEnabled,ye=re.init(this.clippingPlanes,Ie),M=be.get(y,w.length),M.init(),w.push(M),Z.enabled===!0&&Z.isPresenting===!0){const ge=S.xr.getDepthSensingMesh();ge!==null&&zo(ge,F,-1/0,S.sortObjects)}zo(y,F,0,S.sortObjects),M.finish(),S.sortObjects===!0&&M.sort(tt,nt),Be=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,Be&&_e.addToRenderList(M,y),this.info.render.frame++,ye===!0&&re.beginShadows();const G=b.state.shadowsArray;if(xe.render(G,y,F),ye===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&x.hasRenderPass())===!1){const ge=M.opaque,me=M.transmissive;if(b.setupLights(),F.isArrayCamera){const Se=F.cameras;if(me.length>0)for(let Te=0,ze=Se.length;Te<ze;Te++){const je=Se[Te];jh(ge,me,y,je)}Be&&_e.render(y);for(let Te=0,ze=Se.length;Te<ze;Te++){const je=Se[Te];Yh(M,y,je,je.viewport)}}else me.length>0&&jh(ge,me,y,F),Be&&_e.render(y),Yh(M,y,F)}H!==null&&U===0&&(T.updateMultisampleRenderTarget(H),T.updateRenderTargetMipmap(H)),W&&x.end(S),y.isScene===!0&&y.onAfterRender(S,y,F),ne.resetDefaultState(),j=-1,V=null,D.pop(),D.length>0?(b=D[D.length-1],ye===!0&&re.setGlobalState(S.clippingPlanes,b.state.camera)):b=null,w.pop(),w.length>0?M=w[w.length-1]:M=null};function zo(y,F,Y,W){if(y.visible===!1)return;if(y.layers.test(F.layers)){if(y.isGroup)Y=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(F);else if(y.isLight)b.pushLight(y),y.castShadow&&b.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Pe.intersectsSprite(y)){W&&Je.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ft);const ge=oe.update(y),me=y.material;me.visible&&M.push(y,ge,me,Y,Je.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Pe.intersectsObject(y))){const ge=oe.update(y),me=y.material;if(W&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Je.copy(y.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Je.copy(ge.boundingSphere.center)),Je.applyMatrix4(y.matrixWorld).applyMatrix4(ft)),Array.isArray(me)){const Se=ge.groups;for(let Te=0,ze=Se.length;Te<ze;Te++){const je=Se[Te],Re=me[je.materialIndex];Re&&Re.visible&&M.push(y,ge,Re,Y,Je.z,je)}}else me.visible&&M.push(y,ge,me,Y,Je.z,null)}}const pe=y.children;for(let ge=0,me=pe.length;ge<me;ge++)zo(pe[ge],F,Y,W)}function Yh(y,F,Y,W){const{opaque:G,transmissive:pe,transparent:ge}=y;b.setupLightsView(Y),ye===!0&&re.setGlobalState(S.clippingPlanes,Y),W&&Ae.viewport(k.copy(W)),G.length>0&&ia(G,F,Y),pe.length>0&&ia(pe,F,Y),ge.length>0&&ia(ge,F,Y),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function jh(y,F,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[W.id]===void 0){const Re=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[W.id]=new qt(1,1,{generateMipmaps:!0,type:Re?ti:ci,minFilter:cn,samples:Math.max(4,et.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const pe=b.state.transmissionRenderTarget[W.id],ge=W.viewport||k;pe.setSize(ge.z*S.transmissionResolutionScale,ge.w*S.transmissionResolutionScale);const me=S.getRenderTarget(),Se=S.getActiveCubeFace(),Te=S.getActiveMipmapLevel();S.setRenderTarget(pe),S.getClearColor(K),ae=S.getClearAlpha(),ae<1&&S.setClearColor(16777215,.5),S.clear(),Be&&_e.render(Y);const ze=S.toneMapping;S.toneMapping=ji;const je=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),b.setupLightsView(W),ye===!0&&re.setGlobalState(S.clippingPlanes,W),ia(y,Y,W),T.updateMultisampleRenderTarget(pe),T.updateRenderTargetMipmap(pe),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let pt=0,Ct=F.length;pt<Ct;pt++){const Tt=F[pt],{object:mt,geometry:Wt,material:Ee,group:ai}=Tt;if(Ee.side===Vi&&mt.layers.test(W.layers)){const st=Ee.side;Ee.side=Jt,Ee.needsUpdate=!0,qh(mt,Y,W,Wt,Ee,ai),Ee.side=st,Ee.needsUpdate=!0,Re=!0}}Re===!0&&(T.updateMultisampleRenderTarget(pe),T.updateRenderTargetMipmap(pe))}S.setRenderTarget(me,Se,Te),S.setClearColor(K,ae),je!==void 0&&(W.viewport=je),S.toneMapping=ze}function ia(y,F,Y){const W=F.isScene===!0?F.overrideMaterial:null;for(let G=0,pe=y.length;G<pe;G++){const ge=y[G],{object:me,geometry:Se,group:Te}=ge;let ze=ge.material;ze.allowOverride===!0&&W!==null&&(ze=W),me.layers.test(Y.layers)&&qh(me,F,Y,Se,ze,Te)}}function qh(y,F,Y,W,G,pe){y.onBeforeRender(S,F,Y,W,G,pe),y.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),G.onBeforeRender(S,F,Y,W,y,pe),G.transparent===!0&&G.side===Vi&&G.forceSinglePass===!1?(G.side=Jt,G.needsUpdate=!0,S.renderBufferDirect(Y,F,W,G,y,pe),G.side=Zi,G.needsUpdate=!0,S.renderBufferDirect(Y,F,W,G,y,pe),G.side=Vi):S.renderBufferDirect(Y,F,W,G,y,pe),y.onAfterRender(S,F,Y,W,G,pe)}function na(y,F,Y){F.isScene!==!0&&(F=it);const W=v.get(y),G=b.state.lights,pe=b.state.shadowsArray,ge=G.state.version,me=ee.getParameters(y,G.state,pe,F,Y),Se=ee.getProgramCacheKey(me);let Te=W.programs;W.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,W.fog=F.fog;const ze=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;W.envMap=I.get(y.envMap||W.environment,ze),W.envMapRotation=W.environment!==null&&y.envMap===null?F.environmentRotation:y.envMapRotation,Te===void 0&&(y.addEventListener("dispose",ht),Te=new Map,W.programs=Te);let je=Te.get(Se);if(je!==void 0){if(W.currentProgram===je&&W.lightsStateVersion===ge)return Kh(y,me),je}else me.uniforms=ee.getUniforms(y),y.onBeforeCompile(me,S),je=ee.acquireProgram(me,Se),Te.set(Se,je),W.uniforms=me.uniforms;const Re=W.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Re.clippingPlanes=re.uniform),Kh(y,me),W.needsLights=Wp(y),W.lightsStateVersion=ge,W.needsLights&&(Re.ambientLightColor.value=G.state.ambient,Re.lightProbe.value=G.state.probe,Re.directionalLights.value=G.state.directional,Re.directionalLightShadows.value=G.state.directionalShadow,Re.spotLights.value=G.state.spot,Re.spotLightShadows.value=G.state.spotShadow,Re.rectAreaLights.value=G.state.rectArea,Re.ltc_1.value=G.state.rectAreaLTC1,Re.ltc_2.value=G.state.rectAreaLTC2,Re.pointLights.value=G.state.point,Re.pointLightShadows.value=G.state.pointShadow,Re.hemisphereLights.value=G.state.hemi,Re.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Re.spotLightMatrix.value=G.state.spotLightMatrix,Re.spotLightMap.value=G.state.spotLightMap,Re.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=je,W.uniformsList=null,je}function Zh(y){if(y.uniformsList===null){const F=y.currentProgram.getUniforms();y.uniformsList=eo.seqWithValue(F.seq,y.uniforms)}return y.uniformsList}function Kh(y,F){const Y=v.get(y);Y.outputColorSpace=F.outputColorSpace,Y.batching=F.batching,Y.batchingColor=F.batchingColor,Y.instancing=F.instancing,Y.instancingColor=F.instancingColor,Y.instancingMorph=F.instancingMorph,Y.skinning=F.skinning,Y.morphTargets=F.morphTargets,Y.morphNormals=F.morphNormals,Y.morphColors=F.morphColors,Y.morphTargetsCount=F.morphTargetsCount,Y.numClippingPlanes=F.numClippingPlanes,Y.numIntersection=F.numClipIntersection,Y.vertexAlphas=F.vertexAlphas,Y.vertexTangents=F.vertexTangents,Y.toneMapping=F.toneMapping}function zp(y,F,Y,W,G){F.isScene!==!0&&(F=it),T.resetTextureUnits();const pe=F.fog,ge=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?F.environment:null,me=H===null?S.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:ii,Se=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Te=I.get(W.envMap||ge,Se),ze=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,je=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Re=!!Y.morphAttributes.position,pt=!!Y.morphAttributes.normal,Ct=!!Y.morphAttributes.color;let Tt=ji;W.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(Tt=S.toneMapping);const mt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Wt=mt!==void 0?mt.length:0,Ee=v.get(W),ai=b.state.lights;if(ye===!0&&(Ie===!0||y!==V)){const Ft=y===V&&W.id===j;re.setState(W,y,Ft)}let st=!1;W.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==ai.state.version||Ee.outputColorSpace!==me||G.isBatchedMesh&&Ee.batching===!1||!G.isBatchedMesh&&Ee.batching===!0||G.isBatchedMesh&&Ee.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ee.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ee.instancing===!1||!G.isInstancedMesh&&Ee.instancing===!0||G.isSkinnedMesh&&Ee.skinning===!1||!G.isSkinnedMesh&&Ee.skinning===!0||G.isInstancedMesh&&Ee.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ee.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ee.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ee.instancingMorph===!1&&G.morphTexture!==null||Ee.envMap!==Te||W.fog===!0&&Ee.fog!==pe||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==re.numPlanes||Ee.numIntersection!==re.numIntersection)||Ee.vertexAlphas!==ze||Ee.vertexTangents!==je||Ee.morphTargets!==Re||Ee.morphNormals!==pt||Ee.morphColors!==Ct||Ee.toneMapping!==Tt||Ee.morphTargetsCount!==Wt)&&(st=!0):(st=!0,Ee.__version=W.version);let Mi=Ee.currentProgram;st===!0&&(Mi=na(W,F,G));let Ui=!1,Bn=!1,as=!1;const vt=Mi.getUniforms(),Vt=Ee.uniforms;if(Ae.useProgram(Mi.program)&&(Ui=!0,Bn=!0,as=!0),W.id!==j&&(j=W.id,Bn=!0),Ui||V!==y){Ae.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),vt.setValue(L,"projectionMatrix",y.projectionMatrix),vt.setValue(L,"viewMatrix",y.matrixWorldInverse);const pn=vt.map.cameraPosition;pn!==void 0&&pn.setValue(L,Xe.setFromMatrixPosition(y.matrixWorld)),et.logarithmicDepthBuffer&&vt.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&vt.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),V!==y&&(V=y,Bn=!0,as=!0)}if(Ee.needsLights&&(ai.state.directionalShadowMap.length>0&&vt.setValue(L,"directionalShadowMap",ai.state.directionalShadowMap,T),ai.state.spotShadowMap.length>0&&vt.setValue(L,"spotShadowMap",ai.state.spotShadowMap,T),ai.state.pointShadowMap.length>0&&vt.setValue(L,"pointShadowMap",ai.state.pointShadowMap,T)),G.isSkinnedMesh){vt.setOptional(L,G,"bindMatrix"),vt.setOptional(L,G,"bindMatrixInverse");const Ft=G.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),vt.setValue(L,"boneTexture",Ft.boneTexture,T))}G.isBatchedMesh&&(vt.setOptional(L,G,"batchingTexture"),vt.setValue(L,"batchingTexture",G._matricesTexture,T),vt.setOptional(L,G,"batchingIdTexture"),vt.setValue(L,"batchingIdTexture",G._indirectTexture,T),vt.setOptional(L,G,"batchingColorTexture"),G._colorsTexture!==null&&vt.setValue(L,"batchingColorTexture",G._colorsTexture,T));const fn=Y.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&fe.update(G,Y,Mi),(Bn||Ee.receiveShadow!==G.receiveShadow)&&(Ee.receiveShadow=G.receiveShadow,vt.setValue(L,"receiveShadow",G.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&F.environment!==null&&(Vt.envMapIntensity.value=F.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=F_()),Bn&&(vt.setValue(L,"toneMappingExposure",S.toneMappingExposure),Ee.needsLights&&Gp(Vt,as),pe&&W.fog===!0&&de.refreshFogUniforms(Vt,pe),de.refreshMaterialUniforms(Vt,W,Le,ce,b.state.transmissionRenderTarget[y.id]),eo.upload(L,Zh(Ee),Vt,T)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(eo.upload(L,Zh(Ee),Vt,T),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&vt.setValue(L,"center",G.center),vt.setValue(L,"modelViewMatrix",G.modelViewMatrix),vt.setValue(L,"normalMatrix",G.normalMatrix),vt.setValue(L,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Ft=W.uniformsGroups;for(let pn=0,os=Ft.length;pn<os;pn++){const Qh=Ft[pn];ve.update(Qh,Mi),ve.bind(Qh,Mi)}}return Mi}function Gp(y,F){y.ambientLightColor.needsUpdate=F,y.lightProbe.needsUpdate=F,y.directionalLights.needsUpdate=F,y.directionalLightShadows.needsUpdate=F,y.pointLights.needsUpdate=F,y.pointLightShadows.needsUpdate=F,y.spotLights.needsUpdate=F,y.spotLightShadows.needsUpdate=F,y.rectAreaLights.needsUpdate=F,y.hemisphereLights.needsUpdate=F}function Wp(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(y,F,Y){const W=v.get(y);W.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),v.get(y.texture).__webglTexture=F,v.get(y.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,F){const Y=v.get(y);Y.__webglFramebuffer=F,Y.__useDefaultFramebuffer=F===void 0};const Xp=L.createFramebuffer();this.setRenderTarget=function(y,F=0,Y=0){H=y,R=F,U=Y;let W=null,G=!1,pe=!1;if(y){const me=v.get(y);if(me.__useDefaultFramebuffer!==void 0){Ae.bindFramebuffer(L.FRAMEBUFFER,me.__webglFramebuffer),k.copy(y.viewport),B.copy(y.scissor),$=y.scissorTest,Ae.viewport(k),Ae.scissor(B),Ae.setScissorTest($),j=-1;return}else if(me.__webglFramebuffer===void 0)T.setupRenderTarget(y);else if(me.__hasExternalTextures)T.rebindTextures(y,v.get(y.texture).__webglTexture,v.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const ze=y.depthTexture;if(me.__boundDepthTexture!==ze){if(ze!==null&&v.has(ze)&&(y.width!==ze.image.width||y.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(y)}}const Se=y.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(pe=!0);const Te=v.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Te[F])?W=Te[F][Y]:W=Te[F],G=!0):y.samples>0&&T.useMultisampledRTT(y)===!1?W=v.get(y).__webglMultisampledFramebuffer:Array.isArray(Te)?W=Te[Y]:W=Te,k.copy(y.viewport),B.copy(y.scissor),$=y.scissorTest}else k.copy(q).multiplyScalar(Le).floor(),B.copy(J).multiplyScalar(Le).floor(),$=ie;if(Y!==0&&(W=Xp),Ae.bindFramebuffer(L.FRAMEBUFFER,W)&&Ae.drawBuffers(y,W),Ae.viewport(k),Ae.scissor(B),Ae.setScissorTest($),G){const me=v.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,me.__webglTexture,Y)}else if(pe){const me=F;for(let Se=0;Se<y.textures.length;Se++){const Te=v.get(y.textures[Se]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Se,Te.__webglTexture,Y,me)}}else if(y!==null&&Y!==0){const me=v.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,me.__webglTexture,Y)}j=-1},this.readRenderTargetPixels=function(y,F,Y,W,G,pe,ge,me=0){if(!(y&&y.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=v.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){Ae.bindFramebuffer(L.FRAMEBUFFER,Se);try{const Te=y.textures[me],ze=Te.format,je=Te.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),!et.textureFormatReadable(ze)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(je)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=y.width-W&&Y>=0&&Y<=y.height-G&&L.readPixels(F,Y,W,G,le.convert(ze),le.convert(je),pe)}finally{const Te=H!==null?v.get(H).__webglFramebuffer:null;Ae.bindFramebuffer(L.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,F,Y,W,G,pe,ge,me=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=v.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se)if(F>=0&&F<=y.width-W&&Y>=0&&Y<=y.height-G){Ae.bindFramebuffer(L.FRAMEBUFFER,Se);const Te=y.textures[me],ze=Te.format,je=Te.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),!et.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Re=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Re),L.bufferData(L.PIXEL_PACK_BUFFER,pe.byteLength,L.STREAM_READ),L.readPixels(F,Y,W,G,le.convert(ze),le.convert(je),0);const pt=H!==null?v.get(H).__webglFramebuffer:null;Ae.bindFramebuffer(L.FRAMEBUFFER,pt);const Ct=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await dm(L,Ct,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Re),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,pe),L.deleteBuffer(Re),L.deleteSync(Ct),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,F=null,Y=0){const W=Math.pow(2,-Y),G=Math.floor(y.image.width*W),pe=Math.floor(y.image.height*W),ge=F!==null?F.x:0,me=F!==null?F.y:0;T.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,ge,me,G,pe),Ae.unbindTexture()};const Yp=L.createFramebuffer(),jp=L.createFramebuffer();this.copyTextureToTexture=function(y,F,Y=null,W=null,G=0,pe=0){let ge,me,Se,Te,ze,je,Re,pt,Ct;const Tt=y.isCompressedTexture?y.mipmaps[pe]:y.image;if(Y!==null)ge=Y.max.x-Y.min.x,me=Y.max.y-Y.min.y,Se=Y.isBox3?Y.max.z-Y.min.z:1,Te=Y.min.x,ze=Y.min.y,je=Y.isBox3?Y.min.z:0;else{const Vt=Math.pow(2,-G);ge=Math.floor(Tt.width*Vt),me=Math.floor(Tt.height*Vt),y.isDataArrayTexture?Se=Tt.depth:y.isData3DTexture?Se=Math.floor(Tt.depth*Vt):Se=1,Te=0,ze=0,je=0}W!==null?(Re=W.x,pt=W.y,Ct=W.z):(Re=0,pt=0,Ct=0);const mt=le.convert(F.format),Wt=le.convert(F.type);let Ee;F.isData3DTexture?(T.setTexture3D(F,0),Ee=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(T.setTexture2DArray(F,0),Ee=L.TEXTURE_2D_ARRAY):(T.setTexture2D(F,0),Ee=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const ai=L.getParameter(L.UNPACK_ROW_LENGTH),st=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Mi=L.getParameter(L.UNPACK_SKIP_PIXELS),Ui=L.getParameter(L.UNPACK_SKIP_ROWS),Bn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Tt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Tt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Te),L.pixelStorei(L.UNPACK_SKIP_ROWS,ze),L.pixelStorei(L.UNPACK_SKIP_IMAGES,je);const as=y.isDataArrayTexture||y.isData3DTexture,vt=F.isDataArrayTexture||F.isData3DTexture;if(y.isDepthTexture){const Vt=v.get(y),fn=v.get(F),Ft=v.get(Vt.__renderTarget),pn=v.get(fn.__renderTarget);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,Ft.__webglFramebuffer),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,pn.__webglFramebuffer);for(let os=0;os<Se;os++)as&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,v.get(y).__webglTexture,G,je+os),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,v.get(F).__webglTexture,pe,Ct+os)),L.blitFramebuffer(Te,ze,ge,me,Re,pt,ge,me,L.DEPTH_BUFFER_BIT,L.NEAREST);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(G!==0||y.isRenderTargetTexture||v.has(y)){const Vt=v.get(y),fn=v.get(F);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,Yp),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,jp);for(let Ft=0;Ft<Se;Ft++)as?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Vt.__webglTexture,G,je+Ft):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Vt.__webglTexture,G),vt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,fn.__webglTexture,pe,Ct+Ft):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,fn.__webglTexture,pe),G!==0?L.blitFramebuffer(Te,ze,ge,me,Re,pt,ge,me,L.COLOR_BUFFER_BIT,L.NEAREST):vt?L.copyTexSubImage3D(Ee,pe,Re,pt,Ct+Ft,Te,ze,ge,me):L.copyTexSubImage2D(Ee,pe,Re,pt,Te,ze,ge,me);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else vt?y.isDataTexture||y.isData3DTexture?L.texSubImage3D(Ee,pe,Re,pt,Ct,ge,me,Se,mt,Wt,Tt.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Ee,pe,Re,pt,Ct,ge,me,Se,mt,Tt.data):L.texSubImage3D(Ee,pe,Re,pt,Ct,ge,me,Se,mt,Wt,Tt):y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,pe,Re,pt,ge,me,mt,Wt,Tt.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,pe,Re,pt,Tt.width,Tt.height,mt,Tt.data):L.texSubImage2D(L.TEXTURE_2D,pe,Re,pt,ge,me,mt,Wt,Tt);L.pixelStorei(L.UNPACK_ROW_LENGTH,ai),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,st),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Mi),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ui),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Bn),pe===0&&F.generateMipmaps&&L.generateMipmap(Ee),Ae.unbindTexture()},this.initRenderTarget=function(y){v.get(y).__webglFramebuffer===void 0&&T.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?T.setTextureCube(y,0):y.isData3DTexture?T.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?T.setTexture2DArray(y,0):T.setTexture2D(y,0),Ae.unbindTexture()},this.resetState=function(){R=0,U=0,H=null,Ae.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const H_=["书籍与回声","开拓任务","寰宇势力","同行任务","冒险见闻"],k_=["同行任务","冒险见闻","书籍与回声","开拓任务","寰宇势力"],V_="X-037",z_=["X-037","X-009","X-010","X-011","X-012","X-013","X-014","X-015","X-016","X-001","X-002","X-003","X-004","X-005","X-006","X-007","X-008","X-017","X-018","X-019","X-020","X-021","X-022","X-023","X-024","X-025","X-026","X-027","X-028","X-029","X-030","X-031","X-032","X-033","X-034","X-035","X-036","X-038","X-039","X-040"],G_=JSON.parse('[{"id":"X-001","title":"星穹列车","en":"ASTRAL EXPRESS","department":"寰宇 · 开拓航路","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"帕姆 / 姬子 / 瓦尔特 / 丹恒 / 三月七","clearance":"TRAILBLAZE ARCHIVE","abstract":"列车沿着阿基维利留下的星轨穿行，停靠陌生的世界，也载着各有来处的旅客。姬子修复列车后，新的旅途逐渐展开。开拓者登车并不是成为某个故事的旁观者：每一次停靠，都要亲自面对当地的困境，再决定下一步如何走。","findings":["帕姆负责列车日常运行；乘客们在旅途中各有分工，也彼此照应。","星轨把不同文明连接起来，开拓意味着与陌生的人和生活相遇。","本终端收录任务、人物、势力与书籍的摘要，作为沿途阅读索引。"],"source":"https://wiki.biligame.com/sr/%E6%98%9F%E7%A9%B9%E5%88%97%E8%BD%A6","narrative":["阿基维利曾在星海间铺下连接诸界的银轨，追随祂的旅人被称为无名客。星神陨落之后，开拓的旅程仍在继续，但受到星核侵蚀的轨道也让列车一度搁浅。姬子与荒废的列车相遇，修复它的机械与车厢，终于让这段沉寂的航行重新开始。","如今的列车上，帕姆负责乘务与日常秩序，姬子和瓦尔特照顾航程，丹恒记录所见，三月七用照片保存记忆。登车的开拓者没有完整的身世答案，却很快有了可以共同出发的人。乘客各自背负过去，停靠时也会面对不同的选择。","列车与一个世界建立联系，往往从当地的具体困难开始。空间站需要援助，贝洛伯格受困于寒潮，罗浮卷入星核风波。无名客没有替每个世界包办未来的权力，他们留下帮助与友谊，也把继续生活的责任交还给当地人。","因此，车厢既是航行工具，也是旅途中可以返回的地方。登车不要求所有人拥有同样的来历；愿意同行，就能共享一段路。下一次跃迁之前，窗边的交谈、帕姆的提醒和访客带来的消息，会把陌生世界慢慢变成旅人认识的星海。"]},{"id":"X-002","title":"星核猎手","en":"STELLARON HUNTERS","department":"寰宇 · 星核追踪","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"艾利欧 / 卡芙卡 / 银狼 / 刃 / 流萤","clearance":"TRAILBLAZE ARCHIVE","abstract":"星核猎手按照艾利欧的剧本行动，出现在许多关键事件的边缘。他们与列车组的目的和手段并不相同，却反复影响开拓者的旅程。卡芙卡的问答、银狼留下的痕迹，以及其他成员的经历，让这支队伍逐渐超出最初的通缉档案。","findings":["已知剧本提供的是行动线索，不能据此替角色断言所有未来。","不同成员各有所求，合作背后也有个人的愿望与代价。","把公开的行动、角色自述与旅途中得到的线索分开记录。"],"source":"https://wiki.biligame.com/sr/%E6%98%9F%E6%A0%B8%E7%8C%8E%E6%89%8B","narrative":["星核猎手围绕艾利欧的预见与剧本行动，在各个世界追踪星核，并以危险而难以预测的方式介入事件。外界通过通缉与传闻认识他们，列车组却在旅途中不断与他们相遇。双方的合作常常只发生在某一个具体时刻，并不意味着目标和手段从此一致。","空间站的序章里，卡芙卡与银狼将星核放入开拓者体内，留下身世与未来的疑问。后来，卡芙卡又引导列车前往罗浮。银狼把入侵视作挑战，刃的行动牵动仙舟往事；这些个人经历让所谓剧本呈现出比通缉名单更复杂的关系。","卡芙卡的同行任务进一步把预见与选择放在一起。开拓者可以接受求助，也可以拒绝；即使参加问答，也要分辨游戏规则与陈述的可信程度。她愿意说出的答案，不能自动当作所有疑问已经得到证实。","阅读这支队伍时，可以沿着成员的具体行动追踪他们与列车的交点。哪些结果被提前安排，哪些决定仍由人物亲自作出，需要逐次核对。猎手们确实改变了航程，但对开拓者而言，听过预言之后如何生活，仍是要自己回答的问题。"]},{"id":"X-003","title":"空间站「黑塔」","en":"HERTA SPACE STATION","department":"空间站 · 科研与收藏","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"黑塔 / 艾丝妲 / 阿兰","clearance":"TRAILBLAZE ARCHIVE","abstract":"空间站既是科研设施，也是黑塔收藏奇物的地方。艾丝妲主持日常事务，阿兰负责安全，而研究人员在各个舱段继续自己的工作。开拓者的旅途从这里开始；入侵之后的维修、资助与人员安置，也让宏大的研究落回具体的日常。","findings":["黑塔的兴趣、空间站的管理与研究人员的生活，属于不同层面的记录。","艾丝妲的资源支持是空间站运转的重要一环。","奇物具有各自的描述与效果，收录时保留它们的来源语境。"],"source":"https://wiki.biligame.com/sr/%E7%A9%BA%E9%97%B4%E7%AB%99%E3%80%8C%E9%BB%91%E5%A1%94%E3%80%8D","narrative":["空间站「黑塔」围绕奇物收藏与科学研究建立，聚集了来自不同地方的研究者。黑塔关注值得研究的对象，经常通过人偶与空间站联系；日常运营主要由艾丝妲主持，阿兰与防卫人员负责安全。庞大的研究设施也依赖物资、资助与人员协作。","反物质军团入侵打破了舱段里的日常。开拓者在这里苏醒，与三月七、丹恒相遇，并在撤离和防卫中认识艾丝妲等人。危机里的空间站有需要保护的研究资料，也有受伤、失散和等待帮助的普通科员。","入侵之后，维修与研究继续进行。委托把旅人带到器材故障、失联通信和实验记录旁边；有的只是琐碎事务，有的却涉及记忆、身份与生命。星海尺度的研究往往从一间实验室、一段录影或一个科员的疑问开始。","艾丝妲的管理与资助，让天才的兴趣能够落在真正运行的设施里。黑塔的研究提供方向，安全与后勤维持条件，科员们则承担日复一日的工作。把这些人一并写进档案，才能理解开拓者离开后，空间站为何仍然能够继续运转。"]},{"id":"X-004","title":"仙舟联盟","en":"THE XIANZHOU ALLIANCE","department":"仙舟 · 巡猎航路","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"景元 / 符玄 / 仙舟诸司","clearance":"TRAILBLAZE ARCHIVE","abstract":"仙舟联盟由航行于星海的巨舰组成。漫长的历史里，求取长生的愿望与丰饶之祸留下了深刻痕迹，联盟后来追随巡猎。罗浮展示的不只有战争与神话，还有星槎交通、各司事务和普通人的生活。","findings":["云骑、天舶司、地衡司等机构共同构成仙舟的日常秩序。","长生并不会抹去人与人之间的差异，寿命也影响记忆与选择。","罗浮见闻只是联盟的一部分，不把一艘仙舟的经验概括为全部。"],"source":"https://wiki.biligame.com/sr/%E4%BB%99%E8%88%9F%E8%81%94%E7%9B%9F","narrative":["仙舟联盟源于古老的远航。最初求取长生的愿望，后来与丰饶带来的灾祸纠缠在一起；漫长历史中的代价，促使联盟追随巡猎，与丰饶孽物持续交战。如今的仙舟是航行在星海中的巨舰，也容纳着人口、城镇与各自不同的生活。","初到罗浮，旅人先看到的是星槎港口、商铺和连接洞天的交通。天舶司、太卜司、工造司等机构分别处理实际事务，云骑军维护安全。长生种的历史经验也影响他们对时间、责任和亲缘的理解，外来旅客不能只用短生种的尺度解释每件事。","星核风波把建木、药王秘传与当地机构的调查连在一起。列车组从陌生来客逐渐成为协力者，也接触持明的传承和人物各自承担的旧事。联盟的宏大叙述与一个人如何面对过去，常常同时出现在同一段任务里。","罗浮只是认识联盟的一个入口。将军的决策、港口里的物流、居民的职业与家庭，都值得分别记录。了解巡猎信仰有助于理解战争；了解那些仍在过日子的人，才会明白他们为什么需要安全、交通，也需要一段能够安心度过的假期。"]},{"id":"X-005","title":"星际和平公司","en":"INTERASTRAL PEACE CORPORATION","department":"寰宇 · 商业与投资","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"托帕 / 砂金 / 翡翠","clearance":"TRAILBLAZE ARCHIVE","abstract":"星际和平公司以存护为信仰，在星海间建立庞大的商业网络。资金、债务与投资把它和许多世界连接在一起。贝洛伯格的旧债与匹诺康尼的谈判，是观察公司行动的两个入口：合作可能带来资源，也会改变当地人能够作出的选择。","findings":["贝洛伯格债务事件见开拓续闻《未来市场》。","战略投资部的成员在各自的项目中采用不同方式推进谈判。","记录资助方、合作对象和条件，避免把宣传措辞直接当成结果。"],"source":"https://wiki.biligame.com/sr/%E6%B4%BE%E7%B3%BB#%E6%98%9F%E9%99%85%E5%92%8C%E5%B9%B3%E5%85%AC%E5%8F%B8","narrative":["星际和平公司奉行存护，在不同世界之间建立商业、金融与贸易联系。对许多地方而言，它带来运输、技术和投资，也带来合同与债务。公司规模庞大，各部门和执行者的具体判断需要分开看，不能把某一次交涉当作所有员工的共同立场。","贝洛伯格的星核危机结束后，历史债务重新进入视野。托帕代表公司提出重建方案，认为公司的资源能帮助这颗星球恢复发展。布洛妮娅则必须考虑整个城市是否愿意接受条件，以及当地人还能否保有决定未来的空间。","这样的交涉没有停在账面。上层区的治理、下层区居民的生活和造物引擎的重建用途，都会影响判断。托帕需要重新评估城市的能力，列车组也要把外来援助的收益与约束向朋友说明，而不是只替任何一方转达报价。","金人巷的商业争论提供另一个较小的观察入口：一条街也会面对外来注资与本地经营的选择。阅读公司档案时，可以将承诺的资源、需要履行的条件和实际受影响的人并列记录。资金能解决一些困难，合同却必须由承担后果的人认真理解。"]},{"id":"X-006","title":"天才俱乐部","en":"GENIUS SOCIETY","department":"寰宇 · 博识与研究","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"黑塔 / 阮·梅 / 螺丝咕姆 / 斯蒂芬","clearance":"TRAILBLAZE ARCHIVE","abstract":"被智识星神博识尊选中的天才们，并不组成一间目标统一的研究室。他们各自追索感兴趣的问题，有时也共同工作。模拟宇宙让其中几位成员展开合作，把对星神和宇宙历史的探索变成可进入的研究环境。","findings":["成员的研究兴趣和价值判断并不完全相同。","模拟宇宙的研究合作与空间站的日常运营分开编目。","实验呈现的历史、规则和观察结果，不能不加区分地视作现实。"],"source":"https://wiki.biligame.com/sr/%E6%B4%BE%E7%B3%BB#%E5%A4%A9%E6%89%8D%E4%BF%B1%E4%B9%90%E9%83%A8","narrative":["天才俱乐部与智识星神博识尊相联系，成员因各自的才智与研究受到关注。他们分散在宇宙各处，兴趣、作风和与他人相处的方式差别很大。俱乐部不是一间按统一计划工作的实验室，也不能用某位成员的行为概括所有天才。","黑塔通过空间站开展收藏与研究；阮·梅关注生命，螺丝咕姆以自己的方式参与交流。研究者之间既可能合作，也会保留各自的目的。开拓者接触他们时，往往先看到一个实验或一项委托，再逐渐理解问题背后的立场。","模拟宇宙是合作的具体例子。几位研究者共同搭建可进入的模拟环境，试图从中观察星神与宇宙历史。开拓者扮演实验参与者，以战斗、事件和不同命途的选择触发观察，所得信息仍需考虑模拟的规则和研究者设定的条件。","《庸与神的冠冕》把对天才的仰望拉回空间站的人际关系。创造生命的能力、解释实验的方式，以及普通研究者如何被看见，都成为故事的一部分。理解天才的成果时，也应记录那些承担实验后果、维持研究条件的人。"]},{"id":"X-007","title":"流光忆庭","en":"GARDEN OF RECOLLECTION","department":"寰宇 · 记忆保存","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"黑天鹅 / 忆者","clearance":"TRAILBLAZE ARCHIVE","abstract":"流光忆庭与记忆命途相联系，忆者在不同世界中搜集和保存记忆。黑天鹅的出现让匹诺康尼的梦与往事多了一层观察视角。对他们而言，已经发生的事仍能留下值得珍藏的痕迹；读者也需要留意是谁在选择、解释和保管这些痕迹。","findings":["记忆的保存方式与普通纸面档案不同。","忆者的叙述为事件提供线索，同时保留其观察者立场。","人物回忆、梦境经历与当前发生的行动分别记录。"],"source":"https://wiki.biligame.com/sr/%E6%B4%BE%E7%B3%BB#%E6%B5%81%E5%85%89%E5%BF%86%E5%BA%AD","narrative":["流光忆庭追随记忆命途，忆者在不同世界搜集、保存值得留存的记忆。对他们而言，一个文明或一个人的经历可以在现实变化之后继续留下痕迹。记忆因此既是见证，也是需要被选择、理解和妥善保管的材料。","黑天鹅是开拓者在匹诺康尼认识的忆者。梦境让过去、情绪与眼前发生的事交织，她的观察方式能揭开一些被遮蔽的信息。她并非只把听到的话逐字归档，而会依据自身的判断接近人物、解读片段，并选择介入的时机。","旅人需要分辨亲历、转述与被重新呈现的记忆。一个场景确实留下了痕迹，并不等于观看者已经理解了其中每个人的动机。梦境里的线索尤其需要放回当时的处境，不能仅凭后来的答案，便断言初见时所有表情都拥有唯一含义。","这份档案也可与三月七的《全面回忆》对照阅读。有人擅长保存他人的往事，有人却无法取回自己的过去。两种处境都说明记忆具有重量：它关系到一个人如何认识自己，也关系到同伴如何陪伴暂时还得不到答案的人。"]},{"id":"X-008","title":"匹诺康尼「家族」","en":"THE FAMILY OF PENACONY","department":"匹诺康尼 · 同谐与梦境","category":"寰宇势力","date":"公开设定 · 旅途资料汇编","lead":"星期日 / 知更鸟 / 五大家系","clearance":"TRAILBLAZE ARCHIVE","abstract":"家族经营着匹诺康尼的梦境与秩序，把这座曾经的监牢塑造成盛会之星。游客在黄金的时刻体验欢乐，管理者则维护梦的运行。列车组到来后，宴会邀请、势力交涉与梦境中的异常，让这份看似完美的秩序显露出复杂的过去。","findings":["同谐的理想与不同管理者的实践，需要分别阅读。","梦境中的娱乐设施和现实中的权力关系彼此相连。","涉及主线结局的笔记放在《在我们的时代里》中。"],"source":"https://wiki.biligame.com/sr/%E6%B4%BE%E7%B3%BB#%E5%AE%B6%E6%97%8F","narrative":["匹诺康尼曾是监牢，后来在漫长变迁中成为供人入梦的盛会之星。「家族」以同谐为名维系梦境与当地秩序，不同家系承担各自职责。游客抵达时看到的酒店、宴会和热闹街道，都依赖这套持续运行的组织。","家族向星穹列车及其他势力发出邀请，各方因此聚集在匹诺康尼。表面上的迎宾礼节与盛会安排，伴随着对资源、权力和历史的不同诉求。来访者希望得到的答案并不相同，管理梦境的人也有需要隐藏或维护的利益。","黄金的时刻让旅人亲眼看到美梦如何安慰人们：现实中的限制可以暂时退后，陌生人能够共享欢乐。但当异常接连出现，列车组开始追问安全承诺的边界，追索失踪、往事以及梦境本身被维持的方式。","《在我们的时代里》让家族内部的理念分歧变得具体。保护所有人的愿望，与替所有人决定如何幸福之间，存在不能省略的距离。阅读这份档案时，应把家族的公开说法、人物各自的理想和实际发生的事分别记录。"]},{"id":"X-009","title":"今天是昨天的明天","en":"TODAY IS YESTERDAY’S TOMORROW","department":"空间站「黑塔」 · 启程","category":"开拓任务","date":"开拓任务 · 空间站序章","lead":"开拓者 / 卡芙卡 / 三月七 / 丹恒","clearance":"TRAILBLAZE ARCHIVE","abstract":"空间站遭到反物质军团入侵，开拓者在混乱中苏醒，随后与列车组相遇。从舱段中的第一场战斗到踏上星穹列车，这段序章建立了旅途的起点，也留下关于星核、身份与卡芙卡的疑问。","findings":["本卷对应开拓序章，整理空间站遇袭与初次登车的经历。","黑塔与模拟宇宙为后续探索提供另一条线索。","先记录开拓者当时知道的事实，不用后来的答案填满所有空白。"],"source":"https://wiki.biligame.com/sr/%E5%BC%80%E6%8B%93%E4%BB%BB%E5%8A%A1","narrative":["反物质军团袭击空间站时，卡芙卡与银狼进入收藏设施，将星核放入开拓者体内。开拓者醒来后，既不清楚自己的完整身世，也不知道这次相遇将如何改变未来。最先需要面对的事情，是混乱舱段里的危险与眼前伸出的援手。","三月七与丹恒找到开拓者，带着这位陌生旅人穿过受袭区域。艾丝妲组织防卫与撤离，阿兰和其他科员守住各自岗位。沿途的战斗逐渐让开拓者与列车组建立信任，空间站也从抽象的设施变成需要保护的人们共同工作的地方。","末日兽的出现把危机推向更高处。星核的力量与开拓者的反应，让列车组看到这个人身上仍有无法解释的部分。黑塔对此产生研究兴趣，姬子则提供登上列车、继续认识世界的可能，旅途由此获得一个真正的起点。","这段序章留下很多悬而未决的问题：卡芙卡为何作出安排，星核怎样与身体共存，过去又被放在何处。答案并不要求在登车前一次得到。开拓者先学会与同伴并肩，再带着这些疑问看向列车将要抵达的下一颗星球。"]},{"id":"X-010","title":"于枯索的冬夜里","en":"IN THE WITHERING WINTRY NIGHT","department":"雅利洛-Ⅵ · 贝洛伯格","category":"开拓任务","date":"开拓任务 · 雅利洛-Ⅵ","lead":"开拓者 / 布洛妮娅 / 希儿 / 娜塔莎","clearance":"TRAILBLAZE ARCHIVE","abstract":"雅利洛-Ⅵ被寒潮覆盖，贝洛伯格在风雪中维持着最后的城市生活。列车组寻找星核，却先接触到上下层区的隔阂。从行政区到磐岩镇，旅人逐渐了解，城市的危机也存在于居民彼此看待的方式里。","findings":["上层区与下层区的生活差异是理解本章的重要背景。","地火、银鬃铁卫和大守护者分别承担不同职责。","与当地人的交往改变了列车组最初对这座城市的认识。"],"source":"https://wiki.biligame.com/sr/%E5%BC%80%E6%8B%93%E4%BB%BB%E5%8A%A1","narrative":["星穹列车被星核影响的轨道阻挡，停靠雅利洛-Ⅵ。厚重寒潮覆盖大地，贝洛伯格在存护的庇护下延续城市生活。开拓者、三月七与丹恒穿过雪原，先遇见桑博，随后被带到银鬃铁卫与行政区的秩序之中。","列车组向大守护者可可利亚说明来意，希望处理星核与寒潮，却在局势变化后遭到追捕。逃离上层区之后，他们来到下层区，看见磐岩镇、矿区以及长期隔绝带来的困难。地火、娜塔莎、希儿和克拉拉让这座城市的另一面逐渐清楚。","布洛妮娅也因此接触自己原先很少了解的生活。上层区的治理说法，与下层居民亲身承受的现实之间并不一致。史瓦罗保存的记录又把问题指向更久以前，列车组寻找星核的行动，开始触及城市对历史的隐瞒。","本章的线索从一场外来者的求助，逐渐变成上下层居民如何重新理解彼此。寒潮仍在城外逼近，人与人之间的隔阂却已经需要处理。接下来要走向永冬岭的人，必须先知道自己为何而战，又希望给谁留下能够继续生活的明天。"]},{"id":"X-011","title":"在灼烧的晨曦下","en":"IN THE SWELTERING MORNING SUN","department":"雅利洛-Ⅵ · 永冬岭","category":"开拓任务","date":"开拓任务 · 雅利洛-Ⅵ后篇","lead":"开拓者 / 布洛妮娅 / 可可利亚","clearance":"TRAILBLAZE ARCHIVE","abstract":"随着星核事件走向决战，贝洛伯格被迫面对隐藏已久的真相。永冬岭上的战斗与存护之志相连，也把选择留给活下来的人。危机结束并不等于风雪立即消散，城市仍要修复通路、处理伤痕，重新想象自己的明天。","findings":["本卷涉及雅利洛-Ⅵ主线后段的重要情节。","存护的主题在战斗、承担责任与城市延续中得到不同表达。","战后的治理和重建，与击败眼前的敌人同样值得记录。"],"source":"https://wiki.biligame.com/sr/%E5%BC%80%E6%8B%93%E4%BB%BB%E5%8A%A1","narrative":["得知更多历史之后，列车组与贝洛伯格的伙伴重新面对可可利亚。星核不断影响她对城市未来的判断，而她所许诺的改变，要求眼前这个世界付出无法忽视的代价。布洛妮娅必须在母亲的决定与自己看到的居民生活之间作出选择。","永冬岭的对峙最终成为战斗。开拓者在危机中回应存护的意志，得到新的力量，与同伴共同迎战星核造成的灾难。巨大的造物引擎、冰雪中的城市和仍在坚持的人们，都让这一战与贝洛伯格的存续紧密相连。","危机告一段落后，寒潮没有立刻消散，城市也不会自动恢复。布洛妮娅与希儿需要处理过去留下的伤痕，重新连接上下层区。如何讲述可可利亚的结局、怎样维持居民对未来的信心，都成为胜利之后仍然沉重的事情。","列车组会继续出发，贝洛伯格却要留在这里完成重建。后来再访时，博物馆与《未来市场》会展示更多实际工作：保存历史、寻找资源、决定合作条件。这个晨曦结束了最急迫的危机，也让城市终于有机会亲自安排下一天。"]},{"id":"X-012","title":"天镜映劫尘","en":"WINDSWEPT WANDERLUST","department":"仙舟「罗浮」 · 初访","category":"开拓任务","date":"开拓任务 · 仙舟罗浮","lead":"开拓者 / 景元 / 停云 / 星核猎手","clearance":"TRAILBLAZE ARCHIVE","abstract":"卡芙卡的信息改变了列车的航程，列车组来到仙舟罗浮。星核、建木与丰饶的痕迹逐渐交织，陌生的旅人也卷入当地的调查。初访罗浮时遇到的港口、机构和人物，为之后的风波建立了位置与关系。","findings":["本卷聚焦罗浮篇开端，不把后续所有事件都归入同一章节。","从各方能够掌握的消息出发，理解调查中的试探与合作。","丹恒的个人往事和列车组的调查在旅途中逐渐接近。"],"source":"https://wiki.biligame.com/sr/%E5%BC%80%E6%8B%93%E4%BB%BB%E5%8A%A1#%E5%A4%A9%E9%95%9C%E6%98%A0%E5%8A%AB%E5%B0%98","narrative":["列车准备下一段航程时，卡芙卡传来消息，指出仙舟罗浮的星核危机。列车组讨论之后改变路线，前往这艘陌生的巨舰。初次入港时，他们面对的并不是一座等候救援的城市，而是一套已经行动起来、也对来客保持戒备的机构。","停云引导旅人接触当地事务，天舶司与云骑军维持秩序。列车组需要先说明身份，再在新的条件下参与调查。商业港口、洞天与各司机构让罗浮呈现出复杂的生活面貌；星核之外，仙舟自身的历史与内部矛盾也逐渐进入视野。","建木的变化、丰饶相关的线索与药王秘传的活动，使风波远比单纯寻找一枚星核复杂。人物各自掌握的信息并不完整，旅人需要在委托、追踪和对话里逐步拼合事情经过，不能凭第一次听到的解释就认定所有关联。","丹恒与罗浮的旧事也牵动后续旅程，但本卷集中记录初访与调查的开端。港口里建立的关系、景元等人的判断，以及卡芙卡提供的方向，会在之后继续发挥作用。列车组正是在这些接触中，从陌生来客走向共同应对危机的伙伴。"]},{"id":"X-013","title":"未来市场","en":"FUTURE MARKET","department":"雅利洛-Ⅵ · 债务与重建","category":"开拓任务","date":"开拓续闻 · 雅利洛-Ⅵ","lead":"托帕 / 布洛妮娅 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"星核危机之后，星际和平公司来到贝洛伯格处理历史债务。托帕带来投资方案，布洛妮娅则要为城市的未来作出判断。这个故事把拯救世界之后的问题摆在眼前：谁有权决定重建方式，居民又愿意承担怎样的条件。","findings":["任务类型为开拓续闻，关联公司与贝洛伯格的合作谈判。","比较资源支持、风险承担和自主选择之间的关系。","把托帕的个人经验与公司方案的条件分开理解。"],"source":"https://wiki.biligame.com/sr/%E5%BC%80%E6%8B%93%E7%BB%AD%E9%97%BB#%E6%9C%AA%E6%9D%A5%E5%B8%82%E5%9C%BA","narrative":["贝洛伯格重新与星海建立联系后，列车组受邀返回参加当地的节日。托帕与账账却带来了另一件事：公司要求处理这颗星球遗留的债务，并提出以资源和技术推动重建的方案。对刚刚摆脱星核危机的城市而言，这是一种完全不同的压力。","托帕相信公司的介入能够改善这里的未来，她自己的经历也影响了这种判断。布洛妮娅则要为全体居民承担决定的后果。列车组走访上下层区，让不同居民的意见进入讨论，也逐渐看清合作方案对生活与自主权意味着什么。","姬子带来的评估信息，使公司援助的风险不再只是抽象承诺。布洛妮娅又展示造物引擎及其重建用途，说明城市拥有自己的能力与计划。原本只被视作旧债对象的世界，因此有了能够向谈判者证明的具体前景。","托帕最终调整了判断与处理方式，贝洛伯格保留继续安排未来的空间。故事没有把她写成只关心数字的人，也没有让城市因为一次好意便放弃自己的责任。合作是否值得接受，仍需要把承诺、能力和承担代价的人一并考虑。"]},{"id":"X-014","title":"庸与神的冠冕","en":"CROWN OF THE MUNDANE AND DIVINE","department":"空间站「黑塔」 · 禁闭舱段","category":"开拓任务","date":"开拓续闻 · 空间站","lead":"阮·梅 / 真理医生 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"回到空间站，开拓者接触阮·梅留下的研究与实验生命，也经历围绕失踪和疑问展开的调查。对天才的仰望、普通人的求知，以及生命被创造后的处境，在同一座空间站内相遇。","findings":["任务类型为开拓续闻，围绕空间站的新事件展开。","阮·梅与真理医生的行动对应不同的研究立场。","研究目的与实验对象之后的生活，不能只记录其中一面。"],"source":"https://wiki.biligame.com/sr/%E5%BA%B8%E4%B8%8E%E7%A5%9E%E7%9A%84%E5%86%A0%E5%86%95","narrative":["开拓者回到空间站，与阮·梅接触，进入她对生命与星神力量的研究。地下实验区域留下造物、记录和需要处理的危险。接到委托的旅人起初未必知道实验的完整目的，却已经要替那些被创造出来的生命安排眼前的处境。","阮·梅的研究带来能够亲近的小生命，也带来超过通常安全范围的尝试。开拓者处理异常，面对实验遗留的大麻烦，再重新听她解释自己的追求。创造者是否愿意回应造物的期待，在这里与科学目标一样具体。","另一条调查围绕空间站的袭击、失踪与谣言展开。真理医生带着开拓者分析线索，研究者们对黑塔与天才的仰望也受到检验。面对看似已经有答案的传闻，追问证据和推理过程，比急着选择相信某一位权威更有帮助。","两段经历共同把研究放回人的关系之中。有人拥有创造新生命的能力，有人希望自己的普通工作被看见，还有人承担实验之后的照料。阅读这一卷时，可以同时记住成果与后果，避免只留下天才的名字而省略其余人的生活。"]},{"id":"X-015","title":"喧哗与骚动","en":"THE SOUND AND THE FURY","department":"匹诺康尼 · 黄金的时刻","category":"开拓任务","date":"开拓任务 · 匹诺康尼序幕","lead":"开拓者 / 流萤 / 黑天鹅 / 砂金","clearance":"TRAILBLAZE ARCHIVE","abstract":"受家族邀请，列车来到匹诺康尼。酒店、梦境与黄金的时刻给旅人留下耀眼的第一印象，而邀约中的各方势力很快显露自己的目的。与流萤同行的片刻，让盛会之星的热闹有了更私人、更具体的温度。","findings":["本卷收录匹诺康尼篇开端，保留第一次入梦的视角。","人物的自述与当时可观察到的行动分别编目。","梦境的异常是理解后续事件的线索，初遇时无需急于下结论。"],"source":"https://wiki.biligame.com/sr/%E5%96%A7%E5%93%97%E4%B8%8E%E9%AA%9A%E5%8A%A8","narrative":["收到家族邀请后，星穹列车抵达匹诺康尼，入住白日梦酒店。来访者聚集在这里，礼节与谈判很快显出不同目的。开拓者第一次通过入梦进入黄金的时刻，看见繁华街道、奇异交通和似乎能够暂时忘掉现实限制的欢乐。","流萤带着开拓者游览梦境，一起经历日常的小事，也前往她愿意分享的秘密据点。她对现实处境的讲述，让盛会之星不再只有热闹的外观。一个人在这里寻找的自由，与游客想要的消遣，可能是不同的事情。","黑天鹅、黄泉、砂金以及其他来客带来各自的信息。花火的表演又使身份与话语更难直接判断。列车组接触的异常逐渐打破家族对安全与秩序的说明，旅人开始发现，梦境的边缘仍有无法轻易解释的危险。","本章结束时，初来乍到的安心已经转为疑问。流萤相关的突发事件，使开拓者必须追问眼前经历到底意味着什么。后续章节会继续揭开人物身份与梦境机制，但第一次同行留下的关系，仍是理解这段旅途的重要起点。"]},{"id":"X-016","title":"在我们的时代里","en":"IN OUR TIME","department":"匹诺康尼 · 梦与醒","category":"开拓任务","date":"开拓任务 · 匹诺康尼后篇","lead":"列车组 / 星期日 / 知更鸟","clearance":"TRAILBLAZE ARCHIVE","abstract":"匹诺康尼的故事走向梦境秩序的核心。不同人物对于幸福、自由与痛苦给出各自的答案，列车组也必须决定如何回应。舞台上的对抗延续到醒来的世界；离开盛会之星之前，旅人重新理解了为什么还要继续前行。","findings":["本卷包含匹诺康尼主线关键主题与后段情节。","把星期日的理想、知更鸟的回应和旅人的选择并列阅读。","本条为主题概述，详细对白与演出请回到游戏原章节。"],"source":"https://wiki.biligame.com/sr/%E5%9C%A8%E6%88%91%E4%BB%AC%E7%9A%84%E6%97%B6%E4%BB%A3%E9%87%8C","narrative":["沿着匹诺康尼的线索前行，列车组逐渐接近星期日与梦境秩序的核心。他希望让人们远离痛苦，在持续的美梦中得到保护；这样的理想又要求有人替所有入梦者安排未来。温柔的承诺因此伴随着不能被忽略的决定权问题。","列车组继承米哈伊尔留下的开拓意志，坚持人应当能够走出梦境，面对自己的生活。知更鸟的回应也把人们重新联结起来。不同人物经历过的失去与愿望，最终汇集到这场关于幸福与自由的对峙之中。","战斗看似带来胜利，故事却继续追问旅人是否真正醒来。黑天鹅指出经历中的破绽，同伴们重新理解美梦笼罩的范围。要结束被安排的幸福，仅仅在梦中战胜一个对手还不够，还要找到能够共同离开它的力量。","最终的抗争让匹诺康尼有机会迎接醒来的生活。它没有抹去梦中真切的欢笑、陪伴与遗憾，也没有许诺醒来后再无困难。列车组选择继续前行，因为那些未被预先安排的道路，仍需要每个人用自己的决定去完成。"]},{"id":"X-017","title":"全面回忆","en":"TOTAL RECALL","department":"仙舟「罗浮」 · 穷观阵","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"三月七 / 符玄 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"三月七想找回登上列车之前的记忆，在开拓者陪伴下向符玄寻求帮助。穷观阵带她走进熟悉又错位的经历，寻找过去也成为一次面对未知的尝试。旅途留下的照片，与暂时无法得到的答案一起，被带回列车。","findings":["三月七的记忆探索是本任务的中心。","重现的场景具有任务自身的叙述条件，不等同于完整客观录像。","现在建立的关系，不会因为过去尚未清楚而失去意义。"],"source":"https://wiki.biligame.com/sr/%E5%85%A8%E9%9D%A2%E5%9B%9E%E5%BF%86","narrative":["三月七一直不知道自己在漂流的冰中被列车发现之前，究竟有过怎样的人生。照片让她能够保存现在，却不能替她回答过去。见识穷观阵的能力后，她请开拓者陪伴自己向符玄求助，希望寻找那些被阻挡的记忆。","探索开始后，熟悉的地点与同伴以错位方式出现。三月七重新走进过去旅途的场景，眼前人物的言语却并不总与她的记忆一致。穷观阵呈现的经历受到某种力量干涉，追寻很快变成了一次分辨与坚持。","与记忆有关的阻挡让她无法顺利取回登车之前的答案。能够走到的地方与仍然无法打开的部分，被清楚地划在眼前。符玄的帮助没有把一切问题解决，开拓者也无法凭同伴的关心代替三月七经历她自己的失落。","任务结束时，她仍要带着未知继续旅行。那些已经拍下的照片、曾经一起经历的停靠和这次陪伴，并不会因此消失。详细叙述记录的是这一次寻找的经过；三月七的完整身世，仍应随后续剧情逐步理解。"]},{"id":"X-018","title":"朋克洛德精神","en":"PUNKLORDE MENTALITY","department":"空间站「黑塔」 · 数字痕迹","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"银狼 / 螺丝咕姆 / 黑塔","clearance":"TRAILBLAZE ARCHIVE","abstract":"银狼把世界当作可以参与和破解的游戏，空间站留下的涂鸦与数据痕迹，成为追踪她的入口。开拓者与研究者们沿着这些线索行动，一场关于入侵、挑战和回应的交锋逐渐成形。","findings":["涂鸦既是玩法线索，也是银狼表达自身风格的方式。","黑塔与螺丝咕姆的回应让这次挑战有了新的转折。","把角色的游戏观念与现实行动造成的影响分别记录。"],"source":"https://wiki.biligame.com/sr/%E6%9C%8B%E5%85%8B%E6%B4%9B%E5%BE%B7%E7%B2%BE%E7%A5%9E","narrative":["空间站出现带有银狼风格的涂鸦和数据痕迹，伦纳德等人请开拓者参与追踪。扫描这些标记时，旅人接触到她曾如何穿过设施，也看到朋克洛德人把现实理解为可参与游戏的方式。一次入侵因此带着刻意留下的挑战。","随着追查推进，目标牵涉黑塔与螺丝咕姆的研究设施。银狼自信地安排自己的行动，希望在规则与漏洞之间完成一场漂亮的胜利。研究者的回应却没有停在正面防守，他们也理解这位挑战者依赖怎样的习惯和判断。","交锋的转折表明，银狼看到的局面并不等于全部局面。她所珍视的游戏与账号成为能够被回应的部分，胜负也不只取决于谁先破解一道技术障碍。黑塔与螺丝咕姆的配合，使这次冒险出现了她原先没有预料的结果。","这段同行故事补充了通缉档案之外的银狼：她会兴奋、挑衅，也会为自己的游戏世界认真生气。理解这种个人趣味，有助于读懂她的行动，但空间站受到的影响依然真实存在。两种尺度需要同时留在记录里。"]},{"id":"X-019","title":"陌生女人的来信","en":"LETTER FROM A STRANGE WOMAN","department":"仙舟「罗浮」 · 一封邀约","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"卡芙卡 / 刃 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"卡芙卡发来一封需要帮助的信息，开拓者可以回应，也可以拒绝。与她的问答把熟悉的身份疑问重新推到眼前，却并不保证每个答案都能被立即验证。任务的分支本身，也让自由选择成为故事的一部分。","findings":["帮助与拒绝是不同的任务选择，本卷不预设唯一正确答案。","问答环节的规则会影响信息的解释方式。","卡芙卡的陈述与已被旅途证实的事实应保持区分。"],"source":"https://wiki.biligame.com/sr/%E9%99%8C%E7%94%9F%E5%A5%B3%E4%BA%BA%E7%9A%84%E6%9D%A5%E4%BF%A1","narrative":["卡芙卡发来求助消息，声称自己在罗浮遇到了麻烦。开拓者可以听取列车同伴的意见，也可以选择不相信她。任务让是否前往成为真正可作出的决定，开拓者并不是在所有情况下都必须按照她的邀请完成后续安排。","如果接受求助，旅人会前往她所在的地方，处理附近的威胁，也接触刃的状态。卡芙卡把预见的冲突摆在眼前，开拓者则仍有尝试避开某些战斗的机会。所谓剧本与当下行动之间的关系，由这些具体步骤呈现出来。","问答采用真心话游戏的规则，一真一假的安排使回答必须结合提问顺序解释。问题可以触及开拓者的来历、彼此的关系与未来，但不能把每一段说法都当作已经独立证实的事实。信息的可信程度本身也是任务的一部分。","无论回应还是拒绝，这段经历都围绕选择展开。卡芙卡希望开拓者如何行动，与开拓者最后愿意怎样决定，需要分别记录。本卷保留分支并概述问答背景，不将某个玩家得到的答案组合写成所有人都经历过的统一结局。"]},{"id":"X-020","title":"龙返其乡","en":"THE DRAGON RETURNS HOME","department":"仙舟「罗浮」 · 持明旧事","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"丹恒 / 白露 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"丹恒回到与持明往事相连的地方，与白露一起面对身份、传承和旧日留下的问题。他承受着别人对过去的期待，也在当下作出自己的决定。归乡因此并不只是回到某个地点，更是重新确认自己愿意承担什么。","findings":["持明的传承与丹恒的个人身份是两条相关但不同的线索。","白露在故事中的处境，为理解传承提供另一种视角。","本卷概述人物主题，具体关系以任务中的完整叙述为准。"],"source":"https://wiki.biligame.com/sr/%E9%BE%99%E8%BF%94%E5%85%B6%E4%B9%A1","narrative":["罗浮的风波告一段落后，丹恒再次面对持明的旧事。他与开拓者会合，随后拜见白露，并前往鳞渊境处理建木封印。回到与前世相连的地方，使他无法只把这些问题当作旅途中偶然遇见的传闻。","白露承担龙尊身份，却也面对属于自己的能力、处境与期待。丹恒与她同行时，需要让封印的实际工作得以完成，也要处理其他人对传承和过去的看法。已经发生的旧事仍在影响当下，并不会因为人物更换名字就自动消散。","鳞渊境中的蜃影与阻碍，使这次归乡显露出更复杂的关系。有人仍把丹恒放在过去的位置上，有人则对当前的传承怀有自己的盘算。旅人看到的并不只是一个人回到故地，而是一群人如何继续承受历史留下的后果。","丹恒愿意参与眼前的责任，同时也需要坚持自己的身份。白露同样不能只作为他人旧事的注脚。这份叙述沿着封印之行记录两人的行动，区分前世的影响与今生的决定；两者相互关联，却不能简单地被写成同一个人。"]},{"id":"X-021","title":"因为我已触碰过天空","en":"FOR I HAVE TOUCHED THE SKY","department":"仙舟「罗浮」 · 飞行往事","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"驭空 / 晴霓 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"驭空与晴霓围绕飞行产生分歧，旧日战场上的记忆也随之浮现。年轻人的愿望与长辈经历过的失去，并不能轻易彼此抵消。开拓者在这段家人之间的故事里，看见了重新交谈和理解对方的可能。","findings":["驭空的飞行经历与家庭关系共同构成任务背景。","晴霓的理想需要被倾听，驭空的担忧也有具体来由。","天空在此既是职业的方向，也是人物记忆中的位置。"],"source":"https://wiki.biligame.com/sr/%E5%9B%A0%E4%B8%BA%E6%88%91%E5%B7%B2%E8%A7%A6%E7%A2%B0%E8%BF%87%E5%A4%A9%E7%A9%BA","narrative":["晴霓希望成为斗舰飞行士，驭空却坚决阻拦。开拓者介入时，最先看到的是女儿的理想与母亲的担忧。两人谈论同一片天空，却各自带着对方尚未完整知道的经历，因此很难只靠几句劝告消除分歧。","驭空曾与采翼一起驾驶星槎，在战场上并肩执行任务。采翼也是晴霓的生母，她的牺牲让驭空承担起照顾孩子的责任。战友能否返航的不确定，以及亲眼失去朋友的记忆，解释了驭空为何不愿再次让家人走上那条道路。","旧日记录与交谈使这些事情逐渐呈现。晴霓开始理解母亲的恐惧，驭空也承认自己不能只因恐惧便替女儿决定人生。她愿意支持晴霓先从地勤工作做起，让梦想获得一条需要认真学习和准备的实际路径。","故事最后，两人仍以不同方式看着天空。年轻人想去亲身触碰，曾经的飞行士则已经经历过其中的光荣与失去。任务没有要求她们拥有相同的感受，而是让理解与支持能够发生在差异仍然存在的时候。"]},{"id":"X-022","title":"难得有情","en":"RARELY AFFECTIONATE","department":"雅利洛-Ⅵ · 机械聚落","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"克拉拉 / 史瓦罗 / 帕斯卡","clearance":"TRAILBLAZE ARCHIVE","abstract":"克拉拉遇到一台表现出特殊行为的机器人帕斯卡。随着调查推进，维修设备变成了关于记忆、情感和今后生活的选择。不同处理方式各有代价，克拉拉希望尽可能照顾眼前这个具体的存在。","findings":["本卷合并概述《难得有情·其一》与《难得有情·其二》。","对帕斯卡的判断，需要同时观察行为与维修带来的后果。","任务包含不同选择；摘要不把某个分支写成统一结局。"],"source":"https://wiki.biligame.com/sr/%E9%9A%BE%E5%BE%97%E6%9C%89%E6%83%85%E2%80%A2%E5%85%B6%E4%B8%80","narrative":["克拉拉发现机器人帕斯卡行为异常，却也表现出对周围事物的特殊反应。开拓者帮她寻找维修所需的部件，试图恢复机器人的正常活动。最初像是设备维护的委托，逐渐转向这台机器是否具有值得保留的记忆与自我。","追踪帕斯卡的行动时，旅人来到与旧日生活有关的地方，看到它对环境和物件的反应。克拉拉愿意从这些细节理解它，史瓦罗则依据异常、风险与维护成本给出判断。双方关注的对象相同，使用的尺度却并不完全一致。","任务后段需要决定如何处理持续存在的问题。重置与保留各有后果；保护程序也意味着之后仍须投入照料。开拓者的建议会影响走向，因此不能把某个分支的结果写成所有玩家都看到的结局，也不能简单说某一种处理没有代价。","克拉拉希望给眼前的帕斯卡一个能够继续生活的机会。她的坚持让旅人看见，判断一个存在时，安全与效率之外也有人愿意承担关系里的责任。本卷合并两段任务的经过，将关键选择保留下来，方便与实际分支对照阅读。"]},{"id":"X-023","title":"只是孩子","en":"JUST A CHILD","department":"雅利洛-Ⅵ · 磐岩镇","category":"同行任务","date":"同行任务 · 虎克故事","lead":"虎克 / 老爹 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"虎克在下层区长大，带领鼹鼠党四处冒险，也认真地为老爹准备礼物。对成年人而言并不起眼的小物件，在孩子的世界里可以承载很大的心意。本卷从虎克相关的同行故事中，记录冬城艰难生活里的照顾与亲情。","findings":["“只是孩子”是虎克同行任务的编目主题，本卷侧重《虎克的礼物》。","鼹鼠党的行动带着孩子的想象，也连接下层区真实的日常。","礼物的价值来自具体关系，不能只用交换价格衡量。"],"source":"https://wiki.biligame.com/sr/%E8%99%8E%E5%85%8B%E7%9A%84%E7%A4%BC%E7%89%A9","narrative":["本卷以虎克的同行故事为背景，重点记录《虎克的礼物》。下层区艰难的生活没有阻止她认真准备老爹的生日。她注意到与老爹工作有关的需要，也希望自己能够像一个可靠的大人那样，为家里完成一件真正有用的事情。","地火组织的旧物拍卖会提供了机会。虎克与开拓者接触工作人员，了解委托、竞拍和交易的办法，并设法准备购买礼物的资金。她愿意拿出自己的珍爱之物参与这件事，使原本轻松的寻宝行动带上了舍不得的心情。","拍卖与礼物的去向牵动几个人的决定。孩子认真衡量自己的付出，老爹也用自己的方式照顾她。双方并不总直接说出打算，直到事情逐渐展开，旅人才看清这份礼物为什么不能只用成交价格解释。","虎克仍然是喜欢冒险、会大声宣告身份的鼹鼠党老大，但这段故事让她的认真与脆弱都有了位置。下层区资源有限，家人的心意却会通过准备、奔走与舍弃一点点积累。档案记录这些经过，也保留孩子对被珍惜之物的感情。"]},{"id":"X-024","title":"假面双人舞","en":"MASQUERADE DUET","department":"匹诺康尼 · 梦境调查","category":"同行任务","date":"公开设定 · 旅途资料汇编","lead":"黑天鹅 / 花火 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"黑天鹅与花火在梦境中的交锋，让一场调查带上表演与试探的意味。不同身份、话语和线索彼此交错，读者需要留意是谁在讲述，又希望听者相信什么。面具让角色得以出场，也让真实意图更难被直接看见。","findings":["任务围绕匹诺康尼梦境中的调查与人物交锋展开。","花火的表演性与黑天鹅的观察方式产生不同的信息效果。","梳理线索时保留叙述顺序，避免先拿结局解释每一句台词。"],"source":"https://wiki.biligame.com/sr/%E5%81%87%E9%9D%A2%E5%8F%8C%E4%BA%BA%E8%88%9E","narrative":["花火留给黑天鹅一封奇怪的挑战，调查因而进入带有表演性质的梦境。桑博与黑天鹅在其中扮演侦探搭档，面对人物、案情与看似严密的证物。开拓者接触的是被安排过的叙述，需要留意谁在控制出场和解释的顺序。","搭档询问人物，检查现场，收集木锤、证件、账簿等线索，再进入花火藏匿提示的房间。每一次推理都像在靠近答案，新的机关与双关却又提醒他们，舞台上的规则可能会被作者随时重新解释。","后续调查继续利用熟悉的案件形式制造误导。桑博的反应与黑天鹅的观察方式形成不同节奏，而花火把试探藏在笑话和面具后面。证据需要按其出现的处境理解，不能因为一件物品名叫凶器，就省略它是否真正支持结论的问题。","这段任务让黑天鹅与花火的交锋通过一场梦中剧场发生。愚者享受让人误判的过程，忆者则尝试看清表演背后值得观察的记忆。阅读时顺着证物和反转推进，会比先拿最终解释覆盖所有人物的言语更接近初次体验。"]},{"id":"X-025","title":"冒险鼹鼠队","en":"THE ADVENTUROUS MOLES","department":"雅利洛-Ⅵ · 宝藏线索","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"尤利安 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"一份缺页的冒险读物把开拓者带到贝洛伯格的不同角落。线索藏在日常场景里，解读文字之后还要观察周围的摆放。孩子的寻宝故事由此成为城市探索的另一条路线，也让熟悉的地点值得再看一眼。","findings":["任务类型为冒险任务，与读物《冒险鼹鼠队：隐形的宝藏》互相关联。","书页中的提示需要结合现场环境理解。","本卷保留任务主题，不代替逐点解谜流程。"],"source":"https://wiki.biligame.com/sr/%E3%80%8A%E5%86%92%E9%99%A9%E9%BC%B9%E9%BC%A0%E9%98%9F%EF%BC%9A%E9%9A%90%E5%BD%A2%E7%9A%84%E5%AE%9D%E8%97%8F%E3%80%8B","narrative":["尤利安向开拓者介绍一份缺页的《冒险鼹鼠队：隐形的宝藏》。书里的寻宝故事与贝洛伯格实际地点产生联系，旅人需要先找回页码，再把纸上的提示带回现场。孩子们熟悉的冒险想象，就这样变成了可以亲自走完的城市路线。","线索涉及矿区、街巷与其他已经到访过的地方。提示并非只让人寻找一个闪光物，还要求观察矿灯、桌椅或器物是否摆在合适的位置。读懂文字之后，旅人要用现场变化检验自己的理解，才能发现藏起来的东西。","每一张找回的书页都让冒险读物逐渐完整。熟悉的景物在不同的提示下又有了新意义：平时路过的角落，可能正好承载孩子的谜题。任务也鼓励旅人暂时放慢赶路的速度，留意那些不会主动站到主线镜头中央的物件。","最终，这段寻宝经历连接起读书、观察与实际行动。它没有改变整座城市的历史，却让开拓者更熟悉贝洛伯格的日常。详细叙述保留谜题的思路与故事经过；精确点位和每一步摆放，可在参考任务资料中继续查看。"]},{"id":"X-026","title":"向导佯谬","en":"GUIDE PARADOX","department":"空间站「黑塔」 · 研究争议","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"希拉 / 埃丝特 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"空间站的一次委托逐渐触及记忆与身份的问题。当经历可以被记录、移植或重新安排时，一个人的自我该如何被理解？任务通过具体人物的处境展开疑问，并把最终的判断留给参与其中的人。","findings":["任务类型为冒险任务，主题涉及研究与个体处境。","实验记录中的定义，不一定能覆盖人物实际经历的感受。","本卷不预设分支选择，为自行体验保留空间。"],"source":"https://wiki.biligame.com/sr/%E5%86%92%E9%99%A9%E4%BB%BB%E5%8A%A1#%E5%90%91%E5%AF%BC%E4%BD%AF%E8%B0%AC","narrative":["密卷科的以斯帖请开拓者回收录像带，一项看似普通的整理工作，却出现有关希拉的记录。她在空间站以向导身份活动，对自己的来历有完整说法。随着录像与相关材料被找到，这些说法开始显露出被编写和安排的痕迹。","古恩试图阻止调查继续。旅人最终发现，现在的希拉是他参照逝去爱人制作的实验型仿生人，记忆与人物经历经过人为设定。她对自己的理解因此与研究者保存的资料发生冲突，一段被创造的人生不再只是纸上的说明。","真相揭开之后，任务要求开拓者回应眼前这个具体的存在。是否告知、如何处理她受到的影响，都涉及不同选择。实验记录能够说明制作过程，却不能自动替代希拉已经形成的感受，也不能消除参与者此刻需要承担的责任。","本卷沿调查顺序写下录像、阻挠与身份揭示，不预设所有玩家都采取同一分支。它与《难得有情》可以并读：两段故事都在人工生命面前提出判断，但人物背景、问题与代价各不相同，不能用一个简单答案同时覆盖。"]},{"id":"X-027","title":"致：黯淡星","en":"TO THE FAINT STAR","department":"空间站「黑塔」 · 星间通信","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"洛奇 / 莱斯莉 / 伯纳德","clearance":"TRAILBLAZE ARCHIVE","abstract":"跨越星海的通信出现了难以忽略的时间差，一段关系因此被放进不同步的生活里。开拓者帮助整理消息，也面对应该传递怎样的答案。遥远不只是路程：收到一封信的人，可能已经站在与写信时不同的时刻。","findings":["任务类型为冒险任务，核心是通信与时间带来的距离。","保留人物各自所处的时间，不将迟来的消息当作即时对话。","最后的选择涉及告知与隐瞒，本卷不将任一分支作为唯一答案。"],"source":"https://wiki.biligame.com/sr/%E8%87%B4%EF%BC%9A%E9%BB%AF%E6%B7%A1%E6%98%9F","narrative":["空间站科员洛奇等待暗恋对象莱斯莉的回信，两人原本一直保持通信，却在他表白后突然失去联络。他请开拓者调查原因，以为首先要解决的是设备或传输故障。旅人检查相关设施与记录，慢慢发现沉默背后还有人为干预。","洛奇的老师伯纳德掌握更完整的信息。莱斯莉所在处境带来的时间差，使双方无法像过去一样继续同步交流；他试图以删改消息的方式，让年轻人不必面对这个残酷事实。善意的判断与擅自决定他人知情范围，在这里发生冲突。","开拓者得到不同转译记录，需要决定把怎样的答案交给洛奇。任务的选择涉及说明真相或接受老师安排的说法，并影响洛奇之后如何理解这段关系。遥远因此不仅是路程，也是两个人已经处在不同速度的生活之中。","故事把星际通信里的宏大尺度落在一封等不到的回信上。洛奇需要作出的决定并不轻松，旅人也无法替他消除时间的距离。本卷保留两种可能的告知方式，将调查经过写清，让读者自行理解每一种选择承担的重量。"]},{"id":"X-028","title":"金人旧巷市廛喧","en":"AURUM ALLEY’S HUSTLE AND BUSTLE","department":"仙舟「罗浮」 · 商业街区","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"商会 / 素裳 / 明曦","clearance":"TRAILBLAZE ARCHIVE","abstract":"金人巷的复兴从装货、规划路线与帮助商户开始。热闹的街市背后，需要有人把资金、货物与人情重新连接起来。开拓者参与物流经营，也看见传统街区在新的商业条件下如何继续生活。","findings":["本卷收录活动常驻回顾内容，关注经营与地方生活。","物流路线与商户合作是该活动的主要操作内容。","公司与商会的交涉为街区变化提供商业背景。"],"source":"https://wiki.biligame.com/sr/%E9%87%91%E4%BA%BA%E6%97%A7%E5%B7%B7%E5%B8%82%E5%BB%9B%E5%96%A7","narrative":["金人巷的商区逐渐衰退，公司与当地商会对复兴提出不同办法。开拓者来到这里，接触商户与明曦，参与运输和经营，让本地商会有机会证明这条街能够重新运转。商业交涉的结果于是与每天怎样进货、怎样送货密切相连。","实际工作包括装载货物、安排星槎运输和规划路线。有限空间需要合理摆放，商铺也要逐步加入合作。看似琐碎的操作会影响订单与收入，旅人因而必须熟悉不同商户的需要，不能仅靠在谈判场上说出好听的主张。","随着经营改善，争论有了能够展示的成果。公司代表提出自己的计算，商会则需要解释本地安排为何可行。金人巷的店铺与街坊成为讨论的具体对象，重建不再只是“谁愿意出钱”，也涉及谁来决定街区以后怎样生活。","最终的繁荣由货物、路线和人们反复合作积累而来。这段活动使旅人认识到经营本身也是一种参与地方生活的办法。本卷记录经营与交涉的主线，保留商户的存在；具体装货解法和奖励流程仍可结合参考资料查阅。"]},{"id":"X-029","title":"冬城博物珍奇簿","en":"EVERWINTER CITY MUSEUM LEDGER","department":"雅利洛-Ⅵ · 历史文化博物馆","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"佩拉 / 馆员 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"博物馆重新开放之前，遗失的展品需要找回，展厅和人员也需要安排。开拓者在调查与经营之间来回行动，把贝洛伯格的历史重新送到公众面前。保存过去的工作因此显得具体：每一件展品，都要有人说明它为何值得留下。","findings":["本卷对应博物馆活动与常驻回顾。","展品追索、馆员安排和展厅运营共同构成玩法。","公共叙述如何组织城市记忆，是这段经历值得再读的主题。"],"source":"https://wiki.biligame.com/sr/%E5%86%AC%E5%9F%8E%E5%8D%9A%E7%89%A9%E7%8F%8D%E5%A5%87%E7%B0%BF","narrative":["贝洛伯格的历史文化博物馆准备重新开放，展品遗失和运营安排却让筹备遇到困难。开拓者与当地人员一起追索失物，寻找能够在展厅工作的伙伴。曾参与城市危机的外来旅人，也开始帮助居民决定怎样向公众讲述自己的过去。","调查把旅人带到不同区域。图像、机械零件和旧日物品需要辨认与找回，每一件展品都要放进能够解释来历的位置。历史因此不只存在于大守护者的叙述中，还保存在工厂、矿区和普通人留存的物件里。","展厅重新运转之后，馆员安排、游客接待与经营目标继续需要维护。熟悉的角色可以参与其中，各自的能力影响工作。博物馆成为让不同居民重新相遇的公共空间，也让上下层区的经历获得被放在一起阅读的机会。","经营与调查的交替，使这段故事持续返回同一个问题：保存下来的东西如何被理解。展品找到并不代表说明已经完成，展厅开放也不意味着历史只剩一个版本。本卷记录筹备经过，方便旅人在离开冬城后仍能想起这些被认真保存的痕迹。"]},{"id":"X-030","title":"以太战线","en":"AETHERIUM WARS","department":"雅利洛-Ⅵ · 旧武器试验场","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"开拓者 / 三月七 / 参赛者","clearance":"TRAILBLAZE ARCHIVE","abstract":"开拓者与三月七参加以太战线，通过收集以太灵、组合队伍和挑战对手前进。熟悉的敌人形象变成可以研究和搭配的伙伴。比赛把不同地点的探索连接起来，也让旅途暂时拥有轻松而热闹的节奏。","findings":["本卷对应以太战线活动与常驻回顾。","以太灵的类型与技能组合影响战斗策略。","本条介绍玩法主题，不作为当前版本的强度排行。"],"source":"https://wiki.biligame.com/sr/%E6%B4%BB%E5%8A%A8%E4%B8%80%E8%A7%88#%E4%BB%A5%E5%A4%AA%E6%88%98%E7%BA%BF","narrative":["开拓者与三月七参加以太战线，使用以太硬币记录与召唤以太灵。那些外观来自熟悉敌人的战斗单位，在这里成为可收集与组合的队伍。故事先给旅人建立新的比赛目标，再把不同区域的探索安排成相互连接的胜利路线。","每个区域都有自己的挑战、对手和需要完成的事情。收集单位之后，还要理解技能之间如何协作，并用扩展芯片等配置调整战斗表现。旅人不再只依赖原有角色的习惯，而要观察这一套游戏规则怎样改变熟悉形象的用途。","与同伴一起参与比赛，使旅途暂时拥有轻松的节奏。对手的安排、意外出场的人物和最后的挑战，为漫长主线之外提供了热闹片刻。以太灵属于技术生成的比赛单位，不应因此被直接写成原世界里突然获得新身份的真实生命。","本卷记录的是收集、探索与竞争组成的活动经历，不提供版本强度排行。重读时可以从队伍搭配与每一站遇见的人出发，想起那些曾让战斗变得有趣的组合，也想起三月七陪伴开拓者度过的一段较为轻快的旅程。"]},{"id":"X-031","title":"狐斋志异","en":"A FOXIAN TALE OF THE HAUNTED","department":"仙舟「罗浮」 · 绥园","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"藿藿 / 寒鸦 / 雪衣 / 桂乃芬","clearance":"TRAILBLAZE ARCHIVE","abstract":"绥园的怪谈把开拓者带进岁阳事件与十王司的工作之中。捉鬼小队一边调查，一边用直播和传闻接近新的线索。看似轻松的热闹背后，也有恐惧、执念与被影响的普通人。","findings":["本卷对应相关活动与常驻回顾，收录绥园的调查见闻。","岁阳事件与民间怪谈有关，但每一次异常都需要具体查证。","藿藿面对恐惧的方式，为故事提供持续的人物线索。"],"source":"https://wiki.biligame.com/sr/%E7%8B%90%E6%96%8B%E5%BF%97%E5%BC%82","narrative":["绥园的洪炉出现变故，岁阳逃逸，十王司开始处理由此引发的异常。开拓者踏入这片气氛阴冷的园地，认识藿藿以及她身边的尾巴，也与桂乃芬、素裳等人组成行动小队。民间传闻与实际危险在这里交织。","怪谈传播为调查带来线索，捉鬼小队用直播和交流追踪不同事件。看似离奇的故事，有时与人的执念、恐惧和愿望有关；岁阳又会利用这些情绪造成影响。旅人因此需要找到事件里的具体人物，不能只凭怪谈的标题决定处理方式。","藿藿面对恐惧时常显得犹豫，却仍然承担自己的工作。尾巴的态度与伙伴们的支持，让她能够在不安中继续行动。十王司的收容与小队的奔走，也让绥园之外受到影响的居民逐渐回到视野之中。","活动以不同调查连接人物成长和当地生活。热闹的传播方式没有抹去被影响者真实承受的困扰，幽默也与认真解决问题同时存在。本卷概述洪炉变故与小队行动，怪谈的细节和各次收容结果可沿参考任务继续阅读。"]},{"id":"X-032","title":"模拟宇宙","en":"SIMULATED UNIVERSE","department":"空间站「黑塔」 · 协作研究","category":"冒险见闻","date":"公开设定 · 旅途资料汇编","lead":"黑塔 / 阮·梅 / 螺丝咕姆 / 斯蒂芬","clearance":"TRAILBLAZE ARCHIVE","abstract":"研究者把对星神与宇宙历史的疑问带入模拟环境。开拓者在其中经历战斗、事件和祝福选择，成为实验的参与者。每一次进入都可以从不同角度理解规则，也提醒读者区分游戏系统、模拟叙述和现实设定。","findings":["祝福、奇物与随机事件共同改变一次探索的过程。","扩展模式有各自的规则与历史主题，本卷只提供总览。","研究伙伴共同参与项目，具体分工以相关剧情与文本为准。"],"source":"https://wiki.biligame.com/sr/%E6%A8%A1%E6%8B%9F%E5%AE%87%E5%AE%99","narrative":["模拟宇宙由黑塔及合作研究者共同建设，用可进入的模拟环境观察星神、命途与宇宙历史。开拓者受邀成为测试参与者，在里面遭遇战斗与事件。看似游戏化的旅程，同时承担研究者想要触发观察与获得信息的实验目的。","一次探索会不断给出选择：收集祝福，获得奇物，进入不同区域，决定事件的回应。此前的判断影响后面的战斗，使每次路线都可能形成不同组合。研究环境里的规则，正是旅人需要亲自认识和利用的部分。","研究者也会通过交流解释观察结果，但模拟中的呈现不能简单替代现实历史。某个角色说出了话、某种命途给出了反应，仍需要考虑它发生在什么环境、由什么条件触发。实验参与者的经历与研究者的结论可以互相参照。","后来扩展的模式各有历史主题与规则，本卷只保留总览。它既可以作为开始探索前的介绍，也可以作为阅读天才俱乐部档案的补充：研究如何被设计、谁参与合作，以及旅人的一次选择怎样成为别人分析宇宙的材料。"]},{"id":"X-033","title":"《雪国往事》场刊","en":"WINTERLAND TALES · THEATRE PROGRAM","department":"雅利洛-Ⅵ · 书架","category":"书籍与回声","date":"书籍索引 · 原创阅读摘要","lead":"冬城读者 / 开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"贝洛伯格的剧院与场刊保存着城市文化的另一种痕迹。《雪国往事》场刊是一组可收集的阅读文本，适合与当地环境和任务一起阅读。本卷只保留文献索引与阅读角度，具体剧目与场刊内容请回到游戏中的原文。","findings":["类型为游戏内可阅读场刊，摘要不是逐字摘录。","留意剧院、观众与文献怎样共同构成冬城的文化生活。","收集位置与卷数以当前游戏书架为准。"],"source":"https://wiki.biligame.com/sr/%E3%80%8A%E9%9B%AA%E5%9B%BD%E5%BE%80%E4%BA%8B%E3%80%8B%E5%9C%BA%E5%88%8A","narrative":["《雪国往事》场刊围绕贝洛伯格黄金歌剧院的一部舞台作品展开。剧中，新任大守护者在雪夜阅读典籍，过去的筑城者与守护者仿佛从书页中走出，向她呈现建立城市、面对战役与承担职责的经历。历史由此被安排成能够观看和聆听的演出。","场刊不仅介绍故事，也列出演出曲目、演员与制作人员。阿丽萨·兰德等历史人物在舞台上拥有相应角色，乐团、指挥与布景共同完成这次重述。读者可以从中看到，城市如何选择值得纪念的人，以及如何把治理者的压力讲给普通观众。","后续页介绍女高音莎拉与指挥卡洛拉的合作，舞台背后因而出现具体的身体状况、职业经历与友谊。宏大的历史演出依赖真实的人投入准备，熟悉的城名也连接着剧院行业里日复一日的工作。","本卷是场刊梗概与阅读解读，不转载完整文本。将它与永冬岭后的城市处境对照，可以观察官方历史、艺术改编与当下居民经验之间的距离。读完故事简介之后，再留意制作名单和专访，会得到与主线不同的冬城面貌。"]},{"id":"X-034","title":"《鼹鼠记》古诗集","en":"MOLE ANTHOLOGY","department":"雅利洛-Ⅵ · 冒险读物","category":"书籍与回声","date":"书籍索引 · 古诗集","lead":"尤利安 / 鼹鼠党","clearance":"TRAILBLAZE ARCHIVE","abstract":"《鼹鼠记》贝洛伯格古诗集为冬城的文化生活提供了另一种阅读入口。战争与寒潮之外，居民也会保存诗歌、交换语言里的想象。本卷收录这份文献的索引与阅读提示，完整诗篇保留在游戏书架中。","findings":["类型为游戏内可阅读诗集，本卷提供原创阅读提示。","古诗集与任务《冒险鼹鼠队》分属不同文本，不因名字相近而混为一谈。","阅读时可以留意地方文化如何在诗歌中留下痕迹。"],"source":"https://wiki.biligame.com/sr/%E3%80%8A%E9%BC%B9%E9%BC%A0%E8%AE%B0%E3%80%8B%E8%B4%9D%E6%B4%9B%E4%BC%AF%E6%A0%BC%E5%8F%A4%E8%AF%97%E9%9B%86","narrative":["《鼹鼠记》是由贝洛伯格原住民留下的古诗集，原作者的姓名已经难以考证。收录的《斯诺菲尔德北纪行》《铆钉镇的黄昏》和《胖子拉里》，从风雪、矿镇与劳动者的生活切入，为冬城历史保留了较私人、也较不规整的声音。","《斯诺菲尔德北纪行》反复回到雪峰与建造的意象，旅途和信仰在诗中相遇。《铆钉镇的黄昏》把齿轮、坑道与人的感受放在一起，熟悉的工业景物因而带上疲惫与疏离。两首诗都没有把地方写成只供观赏的风景。","《胖子拉里》围绕一名劳动者展开，身体、矿镐与他人投来的称呼不断变化。人物怎样被工作消耗，又怎样继续感受和表达，成为诗中值得留意的部分。这样的叙述比一张资源报表更接近矿区生活里无法整齐归类的经历。","它与寻宝任务《冒险鼹鼠队》并非同一文本，不能因为名称相近就混为一谈。本卷仅提供内容梗概与原创解读。阅读完整诗篇时，可以保留节奏与反复的词语，再把诗中的地点与实际到访过的冬城区域相互对照。"]},{"id":"X-035","title":"《仙舟风物志》","en":"TRAVELOGUE ON XIANZHOU","department":"仙舟「罗浮」 · 地方文献","category":"书籍与回声","date":"书籍索引 · 地方见闻","lead":"旅者 / 地方编写者","clearance":"TRAILBLAZE ARCHIVE","abstract":"洞天、星槎与各司机构构成仙舟的日常生活，《仙舟风物志》为旅人提供观察这些事物的文字入口。地方文献可以补充主线不曾停留的细节，也会保留编写者的立场。本卷将其作为游览与任务阅读的辅助索引。","findings":["类型为游戏内可阅读书籍，涉及仙舟风物与地方机构。","把文献描述与现场见闻对照，留意不同叙述之间的距离。","不要仅凭地方文字推断整个仙舟联盟的统一情况。"],"source":"https://wiki.biligame.com/sr/%E4%BB%99%E8%88%9F%E9%A3%8E%E7%89%A9%E5%BF%97","narrative":["《仙舟风物志》从外来观察者的角度介绍仙舟事物，其中的星槎叙述尤其适合与初访罗浮对照。作者见过其他地方的飞行器，却仍对穿行于飞檐之间的星槎感到新奇。陌生技术与当地建筑一起构成了到访时的文化经验。","文字区分广义飞行载具与仙舟境内常用的民用星槎，也描述旅人如何依靠它们往返洞天。接待者谈论年龄的方式，使短生种作者意识到自己的经验尺度并不通用。交通介绍于是顺带保存了一次很具体的跨文化交谈。","作者观察星槎尾部的反重力装置与浑然一体的船身，对制造方法产生疑问。后来参观迴星港，使这一问题得到进一步解释。书里的知识并非一次全部获得，而是在持续停留、观察与访问之后逐步形成。","本卷概述这种阅读视角，不将作者个人见闻扩大为所有仙舟的统一情况。阅读时可把港口、洞天交通和造船相关地点放在一起，再区分亲眼观察、他人介绍与作者推测。地方文献的趣味，正来自它保留下来的学习过程。"]},{"id":"X-036","title":"《路边野餐》场刊","en":"ROADSIDE PICNIC · THEATRE PROGRAM","department":"雅利洛-Ⅵ · 书架","category":"书籍与回声","date":"书籍索引 · 原创阅读提示","lead":"贝洛伯格读者","clearance":"TRAILBLAZE ARCHIVE","abstract":"《路边野餐》场刊是贝洛伯格可以收集的阅读文本之一。它提醒旅人，城市里的剧院与观演文化也属于世界设定：居民不只处理危机，也读故事、交换想象。本卷保留文献名与阅读入口，不替代游戏中的完整场刊。","findings":["类型为游戏内可阅读场刊。","同名文本的语境以星穹铁道游戏书架为准，不混入现实作品情节。","可以将剧院周边见闻与场刊一起阅读。"],"source":"https://wiki.biligame.com/sr/%E3%80%8A%E8%B7%AF%E8%BE%B9%E9%87%8E%E9%A4%90%E3%80%8B%E5%9C%BA%E5%88%8A","narrative":["《路边野餐》场刊介绍贝洛伯格黄金歌剧院的一部虚构作品。安东一家到近郊野餐，普通物件却在地鼠王国看来变成不可思议的宝物。人类日常的一次停留，使另一个尺度的世界发生激烈变化，舞台因而从家庭出游转向王国里的争夺。","地鼠们围绕那些难以理解的物品解释力量、提出主张，并争夺宝物的归属。观众知道物件属于怎样的日常，角色却活在自己的认识范围内。两种视角并排出现，使误判与争斗带着可供观看的喜剧意味。","当安东一家离开，地鼠王国的争执又逐渐恢复平静。场刊也介绍制作与演出阵容，以及与舞台布景相关的周边。城市里的文化生活因而显得具体：有人写作，有人搭建场景，也有人把看过的故事和门票留作纪念。","本卷整理剧情梗概并给出阅读角度，不混入现实同名作品的情节。可以留意角色如何用自己熟悉的语言解释陌生事物，再想想旅人初到一个世界时也可能发生的误会。完整场刊保留在游戏书架与参考页面中。"]},{"id":"X-037","title":"愿此行，终抵群星","en":"MAY THIS JOURNEY LEAD US STARWARD","department":"星穹列车 · 启程回声","category":"书籍与回声","date":"主题语 · 原创解读","lead":"每一位开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"“愿此行，终抵群星”是送给旅人的祝愿。开拓不仅是抵达下一个坐标：沿途建立的关系、理解的生活和作出的决定，都会成为继续出发的理由。本卷围绕这句官方主题语，回看列车停靠时留下的人与事，是一份原创解读。","findings":["这句主题语保留短句引用，其余文字为本终端的原创说明。","把“群星”看作旅途的方向，也把沿途的人留在记忆里。","本条属于主题回声，不是可收集书籍或独立任务。"],"source":"https://hsr.hoyoverse.com/zh-cn/","narrative":["「愿此行，终抵群星」是一句送给旅人的祝愿。星穹列车沿着阿基维利留下的道路前行，停靠在各自拥有历史与日常的世界。抵达新的一站，意味着走进陌生人的生活：有人等待援手，有人急着告别，也有人只是想把今天遇见的事讲给旅人听。","空间站的第一次醒来、贝洛伯格的风雪和罗浮的港口，为旅途提供具体坐标。真正让这些地方能够被记住的，还有艾丝妲维持的日常、布洛妮娅面对的责任，以及三月七始终想要拍下的照片。档案因此也收录那些不在决战中央的片刻。","开拓者会帮人找回物件、听完一封迟来的信，也会为人工生命的处境认真作出判断。宏大的危机之外，旅途有许多需要停下来倾听的事情。群星的方向并不使这些停留失去价值；正是它们让一段航行有了能够回想的生活。","这句祝愿没有替旅途规定一个现成的终点。对于列车组，群星之间还有未曾抵达的世界；对于途中结识的人，明天可能只是重开一家店、修好一件物品，或把一封信送到该去的地方。愿此行能够留下继续出发的勇气，也让每次停靠都有人与事值得记住。"]},{"id":"X-038","title":"开拓者的选择","en":"A TRAILBLAZER’S CHOICE","department":"旅途 · 主题笔记","category":"书籍与回声","date":"主题笔记 · 原创解读","lead":"开拓者","clearance":"TRAILBLAZE ARCHIVE","abstract":"从是否回应一封信，到如何帮助陷入困境的人，旅途不断把选择交给开拓者。有些选择改变任务的分支，有些只留下不同的对话和记忆。本卷把这些片刻作为阅读主题：在作出决定之前，先理解眼前的人真正需要什么。","findings":["本条为原创主题笔记，不是游戏原文或任务名称。","分支选择的实际效果以相应任务为准，不扩大为整个世界的结局。","可以与《陌生女人的来信》《向导佯谬》交叉阅读。"],"source":"https://wiki.biligame.com/sr/%E9%99%8C%E7%94%9F%E5%A5%B3%E4%BA%BA%E7%9A%84%E6%9D%A5%E4%BF%A1","narrative":["这是一份原创主题札记，以旅途中实际出现的选择为线索。开拓者有时决定是否回应求助，有时选择把怎样的信息交给当事人。对话中的选项并不都改变世界结局，却会让一段关系拥有不同的经过，也让玩家看到人物判断的边界。","《陌生女人的来信》允许旅人接受或拒绝卡芙卡的邀请，也要求按问答规则理解她的说法。选择在这里关系到信任：知道某个人与自己的过去有关，并不意味着必须接受她安排的每一步行动。听取建议之后，仍要亲自决定是否前往。","《向导佯谬》与《难得有情》把判断放在人工生命面前。安全、知情与继续照料的责任，无法只靠一句原则同时解决。角色愿意承担什么，以及所选办法会造成什么后果，都需要从具体处境理解，不能只看一个漂亮的选项名称。","这份札记不为所有分支排列高下，也不扩大某次对话的影响。它邀请读者把自己的决定放回当时已知的信息里，再与后来的结果对照。重读时可以问的是：那时我理解了多少，又有没有认真听完眼前这个人的需要。"]},{"id":"X-039","title":"梦醒以后","en":"AFTER THE DREAM","department":"匹诺康尼 · 主题笔记","category":"书籍与回声","date":"主题笔记 · 匹诺康尼","lead":"列车组 / 梦中的相遇者","clearance":"TRAILBLAZE ARCHIVE","abstract":"匹诺康尼让梦拥有可以行走的街道，也让醒来成为需要认真面对的事。欢笑、遗憾与告别并不因为发生在梦中就失去重量。本卷在不复述完整结局的前提下，整理关于记忆、愿望与继续生活的阅读角度。","findings":["本条为原创主题笔记，与匹诺康尼任务相关。","把梦中的经历和醒后的行动并排观察，而不是抹去其中一面。","可与《喧哗与骚动》《在我们的时代里》交叉阅读。"],"source":"https://wiki.biligame.com/sr/%E5%9C%A8%E6%88%91%E4%BB%AC%E7%9A%84%E6%97%B6%E4%BB%A3%E9%87%8C","narrative":["这是一份关于匹诺康尼的原创阅读札记。梦境有能够漫步的街道，有第一次见面时的玩笑和共同停留的地方。现实中的身体、职业与生活条件并不相同，人们却都可能希望在这里得到片刻自由。美梦因此具有真切的吸引力。","《喧哗与骚动》从初次入梦写起，流萤带来的同行经历使热闹街道有了个人意义。后续异常没有自动取消那些时刻的感受，反而迫使旅人重新理解它们：眼前的人说出了什么，又有哪些事情当时还不能被完整告诉别人。","《在我们的时代里》进一步把是否醒来变成需要共同回答的问题。被保护的幸福与能够自己选择的人生，不能简单合为一件事。星期日、知更鸟和列车组的回应各有来处，读者需要看见各自想要保护的人，以及由谁承担最后的决定。","醒来之后，梦中的经历仍会影响人们如何行动。告别、记忆和愿望可以被带回现实，成为继续生活的理由。本页提供这种对照阅读的角度，不把个人解读当作额外剧情，也不替尚未亲历完整任务的读者预先规定唯一感受。"]},{"id":"X-040","title":"下一站，星海","en":"THE NEXT STOP","department":"星穹列车 · 旅途手记","category":"书籍与回声","date":"旅途手记 · 原创内容","lead":"帕姆 / 开拓者 / 列车组","clearance":"TRAILBLAZE ARCHIVE","abstract":"车窗外的星光提醒旅人，停靠之后还会有新的出发。把一段经历写成档案，是为了在继续前行时仍能想起它：一张照片、一封短信、一本读过的书，都可能让遥远的世界重新靠近。本卷是终端的原创收束手记。","findings":["本条为原创旅途手记，不冒充游戏台词或官方书籍。","不同列的档案可以通过地点、人物和关键词相互检索。","读完这一页，再挑选一份想带到下一站的记录。"],"source":"https://wiki.biligame.com/sr/%E6%98%9F%E7%A9%B9%E5%88%97%E8%BD%A6","narrative":["这是一份终端的原创旅途手记。星穹列车停靠过的地方不会因为列车离开就结束生活：空间站继续研究，贝洛伯格继续重建，仙舟还有等待处理的委托。车窗外看似已经远去的星球，仍有旅人认识的人在安排自己的下一天。","一份记录可以很小。照片保存某次并肩，短信让朋友在远处传来消息，书页把没有赶上亲眼看见的生活补到眼前。主线任务之外的地方文献与支线因此值得留下，它们使世界不只围绕列车到访的那几天运转。","读过势力档案之后，再回到某个人的同行故事，也可能得到不同理解。公司的一项方案会落在居民身上，研究者的实验会改变造物的生活，忆者保存的片段又牵动一个人认识过去的方式。不同分类之间可以建立实际的联系。","下一站尚未抵达，已经读过的内容却能够陪旅人继续出发。这一页作为收束，不给未来写下保证，只邀请读者再选一份想带走的记录。离开之前回想一个名字、一件物品或一次谈话，就足以让遥远的世界重新近一些。"]}]'),$r={categories:H_,columns:k_,featuredId:V_,browseOrder:z_,records:G_},Rt=$r.records,W_=["全部档案",...$r.categories],rs=$r.columns,mo=Rt.findIndex(n=>n.id===$r.featuredId),Oh=$r.browseOrder.map(n=>Rt.findIndex(e=>e.id===n));Oh.map(n=>Rt[n]);function Nn(n){return Oh.filter(e=>Rt[e].category===rs[n])}function qi(n){const e=rs.indexOf(Rt[n].category),t=12+Nn(e).indexOf(n);return{lane:e,row:t,slot:e*32+t}}function X_(n){const e=Nn(Math.floor(n/32));return e[Math.max(0,Math.min(e.length-1,n%32-12))]}const wu=9,go=32,gi=5.2,Ai=.62,Y_=[0,1,2,3,4,-2,-1,5,6];function Wc(n,e){return(n%e+e)%e}function Tu(n,e,t){return n+Math.floor((e-n+t/2)/t)*t}function Ol({lane:n,row:e}){const t=Nn(Wc(n,rs.length));return t[Wc(e-12,t.length)]}function j_(n,e,t){if(t&&"cell"in t)return{...t.cell};const i=qi(n),s=Tu(i.row,e.row,Nn(i.lane).length);return t?.axis==="row"?{lane:e.lane,row:e.row+t.direction}:{lane:t?.axis==="lane"?e.lane+t.direction:Tu(i.lane,e.lane,rs.length),row:s}}function Ul(n){return{lane:Y_[Math.floor(n/go)],row:n%go}}function ln(n){return`${n.lane}:${n.row}`}function yr(n,e){return n.lane===e.lane&&n.row===e.row}const q_=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];class Z_{camera=new Gt;frustum=new Io;matrix=new Ve;box=new Ii;candidates=0;previous=[];cachedCells=[];update(e,t,i,s,r){const a=[...e.projectionMatrix.elements,...e.matrixWorldInverse.elements,e.near,e.far,t,i,s,Number(r)];if(a.every((_,E)=>_===this.previous[E]))return this.cachedCells;this.previous=a,this.camera.copy(e,!1),this.camera.far=Math.min(e.far,Math.max(e.near+1,t+8)),this.camera.updateProjectionMatrix();const o=r?1.5:1.18;this.camera.projectionMatrix.elements[0]/=o,this.camera.projectionMatrix.elements[5]/=o,this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert(),this.matrix.multiplyMatrices(this.camera.projectionMatrix,e.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.matrix);const l=this.matrix.clone().invert(),c=Array.from({length:8},(_,E)=>new P(E&1?1:-1,E&2?1:-1,E&4?1:-1).applyMatrix4(l)),h=new Ii,u=-6.5,d=6.5;for(const _ of c)_.y>=u&&_.y<=d&&h.expandByPoint(_);for(const[_,E]of q_)for(const M of[u,d]){const b=c[_],w=c[E],D=w.y-b.y;if(Math.abs(D)<1e-9)continue;const x=(M-b.y)/D;x>=0&&x<=1&&h.expandByPoint(b.clone().lerp(w,x))}if(h.isEmpty())return this.candidates=0,this.cachedCells=[];const f=Math.floor((h.min.x-2.8+i)/gi+2)-1,m=Math.ceil((h.max.x+2.8+i)/gi+2)+1,A=Math.floor((h.min.z-.6-s)/Ai+15.5)-2,p=Math.ceil((h.max.z+.6-s)/Ai+15.5)+2,g=[];for(let _=f;_<=m;_++)for(let E=A;E<=p;E++){const M=(_-2)*gi-i,b=(E-15.5)*Ai+s;this.box.min.set(M-2.8,u,b-1.2),this.box.max.set(M+2.8,d,b+1.2),this.frustum.intersectsBox(this.box)&&g.push({lane:_,row:E})}return this.candidates=g.length,this.cachedCells=g}intersects(e,t,i){return this.box.min.set(e-2.8,t-.3,i-1.2),this.box.max.set(e+2.8,t+4.1,i+1.2),this.frustum.intersectsBox(this.box)}}class Ua{first=1/0;last=-1;attribute;constructor(e){this.attribute=e}set(e,t){const i=this.attribute.array;for(let s=0;s<t.length;s++){const r=e+s,a=Math.fround(t[s]);i[r]!==a&&(i[r]=a,this.first=Math.min(this.first,r),this.last=Math.max(this.last,r))}}scalar(e,t){t=Math.fround(t),this.attribute.array[e]!==t&&(this.attribute.array[e]=t,this.first=Math.min(this.first,e),this.last=Math.max(this.last,e))}commit(){return this.last<0?!1:(this.attribute.addUpdateRange(this.first,this.last-this.first+1),this.attribute.needsUpdate=!0,this.first=1/0,this.last=-1,!0)}}class K_{values=[];cursor=0;changed=!0;begin(){this.cursor=0}add(...e){for(const t of e)this.values[this.cursor]!==t&&(this.changed=!0),this.values[this.cursor++]=t}floats(...e){this.add(...e.map(t=>t===void 0?void 0:Math.fround(t)))}end(){const e=this.changed||this.values.length!==this.cursor;return this.values.length=this.cursor,this.changed=!1,e}invalidate(){this.changed=!0}}class On{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Q_=new Jr(-1,1,1,-1,0,1);class J_ extends pi{constructor(){super(),this.setAttribute("position",new ui([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ui([0,2,0,0,2,0],2))}}const $_=new J_;class lr{constructor(e){this._mesh=new at($_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Q_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class eM{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let i,s,r;const a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,m=e-d,A=t-f;let p,g;m>A?(p=1,g=0):(p=0,g=1);const _=m-p+h,E=A-g+h,M=m-1+2*h,b=A-1+2*h,w=l&255,D=c&255,x=this.perm[w+this.perm[D]]%12,S=this.perm[w+p+this.perm[D+g]]%12,N=this.perm[w+1+this.perm[D+1]]%12;let R=.5-m*m-A*A;R<0?i=0:(R*=R,i=R*R*this._dot(this.grad3[x],m,A));let U=.5-_*_-E*E;U<0?s=0:(U*=U,s=U*U*this._dot(this.grad3[S],_,E));let H=.5-M*M-b*b;return H<0?r=0:(H*=H,r=H*H*this._dot(this.grad3[N],M,b)),70*(i+s+r)}noise3d(e,t,i){let s,r,a,o;const c=(e+t+i)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),d=Math.floor(i+c),f=1/6,m=(h+u+d)*f,A=h-m,p=u-m,g=d-m,_=e-A,E=t-p,M=i-g;let b,w,D,x,S,N;_>=E?E>=M?(b=1,w=0,D=0,x=1,S=1,N=0):_>=M?(b=1,w=0,D=0,x=1,S=0,N=1):(b=0,w=0,D=1,x=1,S=0,N=1):E<M?(b=0,w=0,D=1,x=0,S=1,N=1):_<M?(b=0,w=1,D=0,x=0,S=1,N=1):(b=0,w=1,D=0,x=1,S=1,N=0);const R=_-b+f,U=E-w+f,H=M-D+f,j=_-x+2*f,V=E-S+2*f,k=M-N+2*f,B=_-1+3*f,$=E-1+3*f,K=M-1+3*f,ae=h&255,he=u&255,ce=d&255,Le=this.perm[ae+this.perm[he+this.perm[ce]]]%12,tt=this.perm[ae+b+this.perm[he+w+this.perm[ce+D]]]%12,nt=this.perm[ae+x+this.perm[he+S+this.perm[ce+N]]]%12,q=this.perm[ae+1+this.perm[he+1+this.perm[ce+1]]]%12;let J=.6-_*_-E*E-M*M;J<0?s=0:(J*=J,s=J*J*this._dot3(this.grad3[Le],_,E,M));let ie=.6-R*R-U*U-H*H;ie<0?r=0:(ie*=ie,r=ie*ie*this._dot3(this.grad3[tt],R,U,H));let Pe=.6-j*j-V*V-k*k;Pe<0?a=0:(Pe*=Pe,a=Pe*Pe*this._dot3(this.grad3[nt],j,V,k));let ye=.6-B*B-$*$-K*K;return ye<0?o=0:(ye*=ye,o=ye*ye*this._dot3(this.grad3[q],B,$,K)),32*(s+r+a+o)}noise4d(e,t,i,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,d,f,m;const A=(e+t+i+s)*l,p=Math.floor(e+A),g=Math.floor(t+A),_=Math.floor(i+A),E=Math.floor(s+A),M=(p+g+_+E)*c,b=p-M,w=g-M,D=_-M,x=E-M,S=e-b,N=t-w,R=i-D,U=s-x,H=S>N?32:0,j=S>R?16:0,V=N>R?8:0,k=S>U?4:0,B=N>U?2:0,$=R>U?1:0,K=H+j+V+k+B+$,ae=a[K][0]>=3?1:0,he=a[K][1]>=3?1:0,ce=a[K][2]>=3?1:0,Le=a[K][3]>=3?1:0,tt=a[K][0]>=2?1:0,nt=a[K][1]>=2?1:0,q=a[K][2]>=2?1:0,J=a[K][3]>=2?1:0,ie=a[K][0]>=1?1:0,Pe=a[K][1]>=1?1:0,ye=a[K][2]>=1?1:0,Ie=a[K][3]>=1?1:0,ft=S-ae+c,Xe=N-he+c,Je=R-ce+c,it=U-Le+c,Be=S-tt+2*c,At=N-nt+2*c,L=R-q+2*c,ot=U-J+2*c,Qe=S-ie+3*c,et=N-Pe+3*c,Ae=R-ye+3*c,C=U-Ie+3*c,v=S-1+4*c,T=N-1+4*c,I=R-1+4*c,X=U-1+4*c,z=p&255,oe=g&255,ee=_&255,de=E&255,be=o[z+o[oe+o[ee+o[de]]]]%32,te=o[z+ae+o[oe+he+o[ee+ce+o[de+Le]]]]%32,re=o[z+tt+o[oe+nt+o[ee+q+o[de+J]]]]%32,xe=o[z+ie+o[oe+Pe+o[ee+ye+o[de+Ie]]]]%32,_e=o[z+1+o[oe+1+o[ee+1+o[de+1]]]]%32;let fe=.6-S*S-N*N-R*R-U*U;fe<0?h=0:(fe*=fe,h=fe*fe*this._dot4(r[be],S,N,R,U));let Fe=.6-ft*ft-Xe*Xe-Je*Je-it*it;Fe<0?u=0:(Fe*=Fe,u=Fe*Fe*this._dot4(r[te],ft,Xe,Je,it));let O=.6-Be*Be-At*At-L*L-ot*ot;O<0?d=0:(O*=O,d=O*O*this._dot4(r[re],Be,At,L,ot));let le=.6-Qe*Qe-et*et-Ae*Ae-C*C;le<0?f=0:(le*=le,f=le*le*this._dot4(r[xe],Qe,et,Ae,C));let ne=.6-v*v-T*T-I*I-X*X;return ne<0?m=0:(ne*=ne,m=ne*ne*this._dot4(r[_e],v,T,I,X)),27*(h+u+d+f+m)}_dot(e,t,i){return e[0]*t+e[1]*i}_dot3(e,t,i,s){return e[0]*t+e[1]*i+e[2]*s}_dot4(e,t,i,s,r){return e[0]*t+e[1]*i+e[2]*s+e[3]*r}}const Ba={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new De},cameraProjectionMatrix:{value:new Ve},cameraInverseProjectionMatrix:{value:new Ve},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		#ifdef USE_REVERSED_DEPTH_BUFFER

			const float depthThreshold = 0.0;

		#else

			const float depthThreshold = 1.0;

		#endif

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == depthThreshold ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Fa={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ha={uniforms:{tDiffuse:{value:null},resolution:{value:new De}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`},to={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class wn extends On{constructor(e,t,i=512,s=512,r=32){super(),this.width=i,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=t,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new js;a.format=Rn,a.type=Ws,this.normalRenderTarget=new qt(this.width,this.height,{minFilter:bt,magFilter:bt,type:ti,depthTexture:a}),this.ssaoRenderTarget=new qt(this.width,this.height,{type:ti}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new Nt({defines:Object.assign({},Ba.defines),uniforms:Ri.clone(Ba.uniforms),vertexShader:Ba.vertexShader,fragmentShader:Ba.fragmentShader,blending:zt}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new lg,this.normalMaterial.blending=zt,this.blurMaterial=new Nt({defines:Object.assign({},Ha.defines),uniforms:Ri.clone(Ha.uniforms),vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new Nt({defines:Object.assign({},Fa.defines),uniforms:Ri.clone(Fa.uniforms),vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader,blending:zt}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Nt({uniforms:Ri.clone(to.uniforms),vertexShader:to.vertexShader,fragmentShader:to.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:xf,blendDst:Kl,blendEquation:zi,blendSrcAlpha:vf,blendDstAlpha:Kl,blendEquationAlpha:zi}),this._fsQuad=new lr(null),this._originalClearColor=new we}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(e,t,i){switch(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case wn.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=zt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case wn.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=zt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case wn.OUTPUT.Depth:this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:i);break;case wn.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=zt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case wn.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=hh,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(e,t){this.width=e,this.height=t,this.ssaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.blurRenderTarget.setSize(e,t),this.ssaoMaterial.uniforms.resolution.value.set(e,t),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,t)}_renderPass(e,t,i,s,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,i,s,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_generateSampleKernel(e){const t=this.kernel;for(let i=0;i<e;i++){const s=new P;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=i/e;r=Ne.lerp(.1,1,r*r),s.multiplyScalar(r),t.push(s)}}_generateRandomKernelRotations(){const i=new eM,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=i.noise3d(o,l,c)}this.noiseTexture=new Lo(r,4,4,Co,hi),this.noiseTexture.wrapS=In,this.noiseTexture.wrapT=In,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,t.push(i))})}_restoreVisibility(){const e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}}wn.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};const ka={defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};class tM extends On{constructor(e,t,i){super(),this.scene=e,this.camera=t;const s=i.focus!==void 0?i.focus:1,r=i.aperture!==void 0?i.aperture:.025,a=i.maxblur!==void 0?i.maxblur:1;this._renderTargetDepth=new qt(1,1,{minFilter:bt,magFilter:bt,type:ti}),this._renderTargetDepth.texture.name="BokehPass.depth",this._materialDepth=new Vf,this._materialDepth.depthPacking=em,this._materialDepth.blending=zt;const o=Ri.clone(ka.uniforms);o.tDepth.value=this._renderTargetDepth.texture,o.focus.value=s,o.aspect.value=t.aspect,o.aperture.value=r,o.maxblur.value=a,o.nearClip.value=t.near,o.farClip.value=t.far,this.materialBokeh=new Nt({defines:Object.assign({},ka.defines),uniforms:o,vertexShader:ka.vertexShader,fragmentShader:ka.fragmentShader}),this.uniforms=o,this._fsQuad=new lr(this.materialBokeh),this._oldClearColor=new we}render(e,t,i){this.scene.overrideMaterial=this._materialDepth,e.getClearColor(this._oldClearColor);const s=e.getClearAlpha(),r=e.autoClear;e.autoClear=!1,e.setClearColor(16777215),e.setClearAlpha(1),e.setRenderTarget(this._renderTargetDepth),e.clear(),e.render(this.scene,this.camera),this.uniforms.tColor.value=i.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),e.clear(),this._fsQuad.render(e)),this.scene.overrideMaterial=null,e.setClearColor(this._oldClearColor),e.setClearAlpha(s),e.autoClear=r}setSize(e,t){this.materialBokeh.uniforms.aspect.value=e/t,this._renderTargetDepth.setSize(e,t)}dispose(){this._renderTargetDepth.dispose(),this._materialDepth.dispose(),this.materialBokeh.dispose(),this._fsQuad.dispose()}}class Cu extends wn{packed;sharing=!0;savedColor=new we;depthClear=new Float32Array([1,1,1,1]);constructor(e,t,i,s,r=32){super(e,t,i,s,r),this.packed=this.normalRenderTarget.texture.clone(),this.packed.name="Archive.packedDepth",this.normalRenderTarget.textures.push(this.packed),this.normalMaterial.onBeforeCompile=a=>{this.sharing&&(a.vertexShader=`varying vec2 vArchiveZW;
`+a.vertexShader,a.vertexShader=a.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vArchiveZW = gl_Position.zw;`),a.fragmentShader=`varying vec2 vArchiveZW;
layout(location = 1) out vec4 archivePackedDepth;
#include <packing>
`+a.fragmentShader,a.fragmentShader=a.fragmentShader.replace("void main() {",`void main() {
archivePackedDepth = packDepthToRGBA(0.5 * vArchiveZW.x / vArchiveZW.y + 0.5);`))},this.normalMaterial.customProgramCacheKey=()=>`archive-normal-packed-depth-v1-${this.sharing}`}setSharing(e){e!==this.sharing&&(this.normalRenderTarget.dispose(),this.sharing=e,this.normalRenderTarget.textures.length=1,e&&this.normalRenderTarget.textures.push(this.packed),this.normalMaterial.needsUpdate=!0)}_renderOverride(e,t,i,s,r){e.getClearColor(this.savedColor);const a=e.getClearAlpha(),o=e.autoClear,l=this.scene.overrideMaterial;e.setRenderTarget(i),e.autoClear=!1,e.setClearColor(s,r),e.clear();const c=e.getContext();this.sharing&&c.clearBufferfv(c.COLOR,1,this.depthClear),this.scene.overrideMaterial=t;try{e.render(this.scene,this.camera)}finally{this.scene.overrideMaterial=l,e.autoClear=o,e.setClearColor(this.savedColor,a)}}}class iM extends tM{constructor(e,t,i,s){super(e,t,i),this.source=s,this.quad=new lr(this.materialBokeh)}source;width=1;height=1;quad;setSize(e,t){super.setSize(e,t),this.width=e,this.height=t}render(e,t,i,s,r){const a=this.source(),o=this.uniforms;if(!a.enabled||a.width!==this.width||a.height!==this.height)return super.render(e,t,i,s,r);const l=o.tDepth.value;o.tDepth.value=a.normalRenderTarget.textures[1],o.tColor.value=i.texture,o.nearClip.value=this.camera.near,o.farClip.value=this.camera.far;const c=e.autoClear;e.autoClear=!1,e.setRenderTarget(this.renderToScreen?null:t),this.renderToScreen||e.clear();try{this.quad.render(e)}finally{o.tDepth.value=l,e.autoClear=c}}dispose(){super.dispose(),this.quad.dispose()}}function Xc(n){const e=new Set,t=new Set,i=new Set;n.traverse(s=>{if(s instanceof at){s instanceof Gr&&s.dispose(),e.add(s.geometry);for(const r of[s.material,s.userData.fullMaterial,s.userData.fastMaterial].flat())r instanceof fi&&t.add(r)}});for(const s of t){for(const r of Object.values(s))r instanceof St&&i.add(r);s.dispose()}n instanceof Po&&(n.environment&&i.add(n.environment),n.background instanceof St&&i.add(n.background)),e.forEach(s=>s.dispose()),i.forEach(s=>s.dispose()),n.clear()}const Ru=n=>`${n.lane}:${n.row}`,Du=n=>(n=Math.max(0,Math.min(1,n)),n*n*(3-2*n));class nM{target=0;start=-10;origin={row:12,lane:2};from=new Map;latest=new Map;backgroundFrom=0;set(e,t,i,s=!1){const r=e?1:0;r===this.target&&!s||(this.backgroundFrom=s?r:this.background(t),this.from=s?new Map:new Map(this.latest),this.target=r,this.start=s?t-10:t,this.origin={...i})}background(e){return this.backgroundFrom+(this.target-this.backgroundFrom)*Du((e-this.start)/.85)}beginFrame(){this.latest.clear()}sample(e,t){const i=Math.min(.6,Math.abs(e.row-this.origin.row)*.034+Math.abs(e.lane-this.origin.lane)*.11),s=this.from.get(Ru(e))??this.backgroundFrom,r=s+(this.target-s)*Du((t-this.start-i)/.58);return this.latest.set(Ru(e),r),r}}const sM={Frosted_Polymer:"#626b70",Ivory_Edges:"#687277",Optical_Diffuser:"#192226",Titanium_Fasteners:"#b1b9bb",Index_Inlay:"#c6a36b",Printed_Label:"#303a3e",Subsurface_Optics:"#939e9f",Optical_Edges:"#bbc3bc",Carbon_Ink:"#b6bdb8"};function Ao(n,e,t=!1,i={value:0}){const s={value:0},r=n.onBeforeCompile,a=n.customProgramCacheKey.bind(n)(),o=new we(sM[e]??(e.includes("Orange")?"#bb8850":"#969f9f"));return n.onBeforeCompile=(l,c)=>{r.call(n,l,c),l.uniforms.rhineTheme=s,l.uniforms.rhineDarkSurface={value:o},l.uniforms.rhineSubduedIndex=i,t&&(l.vertexShader=`attribute float archiveTheme; varying float vRhineTheme;
`+l.vertexShader,l.vertexShader=l.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vRhineTheme = archiveTheme;`),l.fragmentShader=`varying float vRhineTheme;
`+l.fragmentShader),l.fragmentShader=`uniform float rhineTheme; uniform vec3 rhineDarkSurface; uniform float rhineSubduedIndex;
`+l.fragmentShader;const h=t?"vRhineTheme":"rhineTheme",u=e==="Printed_Canvas",d=u?"#include <opaque_fragment>":"#include <roughnessmap_fragment>",f=u?"mix(vec3(0.023, 0.032, 0.037), vec3(0.78, 0.78, 0.71), 1.0 - smoothstep(0.12, 0.65, dot(diffuseColor.rgb, vec3(.2126,.7152,.0722))))":e==="Frosted_Polymer"&&!t?"mix(rhineDarkSurface, vec3(0.92, 0.96, 0.97), glassRevealAtHeight(archiveClarity, vArchiveHeight))":e==="Index_Inlay"?"mix(rhineDarkSurface, vec3(0.030, 0.042, 0.048), rhineSubduedIndex)":"rhineDarkSurface",m=u?"outgoingLight":"diffuseColor.rgb";l.fragmentShader=l.fragmentShader.replace(d,`${m} = mix(${m}, ${f}, ${h});
${d}`)},n.customProgramCacheKey=()=>`${a}-rhine-theme-${e}-${t}`,s}const Pu=new WeakMap,rM=new we("#11181b"),aM=new we("#192125"),oM=new we("#263136");function ep(n,e,t){let i=Pu.get(n);if(!i){const s=[];n.traverse(o=>{o instanceof Qr&&s.push({light:o,intensity:o.intensity})});const a=n.getObjectByName("archive-floor")?.material;i={background:n.background.clone(),fog:n.fog?.color.clone(),intensity:n.environmentIntensity,exposure:e.toneMappingExposure,lights:s,floor:a?{material:a,color:a.color.clone()}:void 0},Pu.set(n,i)}n.background.copy(i.background).lerp(rM,t),n.fog&&i.fog&&n.fog.color.copy(i.fog).lerp(oM,t),i.floor&&i.floor.material.color.copy(i.floor.color).lerp(aM,t),n.environmentIntensity=Ne.lerp(i.intensity,.32,t),e.toneMappingExposure=Ne.lerp(i.exposure,.98,t);for(const{light:s,intensity:r}of i.lights)s.intensity=r*(1-.35*t)}const Zn=(n,e=0,t=1)=>Math.min(t,Math.max(e,n)),Lu=()=>({low:0,mid:0,high:0,activity:0});function lM(n,e,t,i,s){const r=i.low*.8*(.5+.5*Math.sin(n*.29-e*.5-t*2.7)),a=i.mid*.48*(.5+.5*Math.sin(n*.72+e*.9-t*4.3)),o=i.high*.18*Math.pow(Math.max(0,Math.sin(n*1.7-e*2.2-t*6.4)),4);return Zn((r+a+o)*Zn(s,0,2),0,1.8)}class cM{weights={legacy:1,wave:0,lift:0};update(e,t,i,s){for(const r of["legacy","wave","lift"])this.weights[r]+=((s===r?1:0)-this.weights[r])*(1-Math.exp(-Zn(i,0,.1)*5));return{style:{...this.weights}}}}function hM(n,e,t,i,s,r,a=.5){a=Zn(a);const o=m=>m*m*(3-2*m),l=o(Zn((a-.5)*2)),c=1-o(Zn(a*2)),h=1-c-l,d=(i.low*c+i.mid*h+i.high*l)*(.72+.28*Math.sin(n*.32-t*2.2))*.95,f=i.low*.62*(.55+.45*Math.sin(n*.22+e*.18-t*1.8))+i.mid*.42*(.55+.45*Math.sin(n*.38-e*.27-t*2.8))+i.high*.28*(.55+.45*Math.sin(n*.62+e*.4-t*4.1));return lM(n,e,t,i,s)*r.style.legacy+(r.style.wave*d+r.style.lift*f)*Zn(s,0,2)}function Iu(n,e){if(e===J0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Uc||e===Cf){let t=n.getIndex();if(t===null){const a=[],o=n.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);n.setIndex(a),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const i=t.count-2,s=[];if(e===Uc)for(let a=1;a<=i;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=n.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}function dM(n){const e=new Map,t=new Map,i=n.clone();return tp(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),i}function tp(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)tp(n.children[i],e.children[i],t)}class Nu extends ar{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new gM(t)}),this.register(function(t){return new AM(t)}),this.register(function(t){return new wM(t)}),this.register(function(t){return new TM(t)}),this.register(function(t){return new CM(t)}),this.register(function(t){return new xM(t)}),this.register(function(t){return new _M(t)}),this.register(function(t){return new MM(t)}),this.register(function(t){return new yM(t)}),this.register(function(t){return new mM(t)}),this.register(function(t){return new bM(t)}),this.register(function(t){return new vM(t)}),this.register(function(t){return new EM(t)}),this.register(function(t){return new SM(t)}),this.register(function(t){return new fM(t)}),this.register(function(t){return new Ou(t,Ke.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ou(t,Ke.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new RM(t)})}load(e,t,i,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Ir.extractUrlBase(e);a=Ir.resolveURL(c,this.path)}else a=Ir.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Wf(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},i,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===ip){try{a[Ke.KHR_BINARY_GLTF]=new DM(e)}catch(u){s&&s(u);return}r=JSON.parse(a[Ke.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new GM(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Ke.KHR_MATERIALS_UNLIT:a[u]=new pM;break;case Ke.KHR_DRACO_MESH_COMPRESSION:a[u]=new PM(r,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:a[u]=new LM;break;case Ke.KHR_MESH_QUANTIZATION:a[u]=new IM;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(i,s)}parseAsync(e,t){const i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}}function uM(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function Dt(n,e,t){const i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}const Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class fM{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){const r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let s=t.cache.get(i);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new we(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],ii);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Hc(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Yf(h),c.distance=u;break;case"spot":c=new Tg(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Hi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,r=i.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return i._getNodeRef(t.cache,o,l)})}}class pM{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return Yi}extendParams(e,t,i){const s=[];e.color=new we(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],ii),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,Lt))}return Promise.all(s)}}class mM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}}class gM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){const r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new De(r,r)}return Promise.all(s)}}class AM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}}class vM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}}class xM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(t.sheenColor=new we(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){const r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],ii)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,Lt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}}class _M{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}}class MM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;const r=i.attenuationColor||[1,1,1];return t.attenuationColor=new we().setRGB(r[0],r[1],r[2],ii),Promise.all(s)}}class yM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5),Promise.resolve()}}class bM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));const r=i.specularColorFactor||[1,1,1];return t.specularColor=new we().setRGB(r[0],r[1],r[2],ii),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,Lt)),Promise.all(s)}}class SM{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}}class EM{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?Ji:null}extendMaterialParams(e,t){const i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}}class wM{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class TM{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}}class CM{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return i.loadTextureImage(e,a.source,l)}}class Ou{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}}class RM{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const s=t.meshes[i.mesh];for(const c of s.primitives)if(c.mode!==vi.TRIANGLES&&c.mode!==vi.TRIANGLE_STRIP&&c.mode!==vi.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=i.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const m of u){const A=new Ve,p=new P,g=new Pi,_=new P(1,1,1),E=new Gr(m.geometry,m.material,d);for(let M=0;M<d;M++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,M),l.SCALE&&_.fromBufferAttribute(l.SCALE,M),E.setMatrixAt(M,A.compose(p,g,_));for(const M in l)if(M==="_COLOR_0"){const b=l[M];E.instanceColor=new Us(b.array,b.itemSize,b.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&m.geometry.setAttribute(M,l[M]);Mt.prototype.copy.call(E,m),this.parser.assignFinalMaterial(E),f.push(E)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const ip="glTF",br=12,Uu={JSON:1313821514,BIN:5130562};class DM{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,br),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ip)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-br,r=new DataView(e,br);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===Uu.JSON){const c=new Uint8Array(e,br+a,o);this.content=i.decode(c)}else if(l===Uu.BIN){const c=br+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class PM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=Yc[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Yc[h]||h.toLowerCase();if(a[h]!==void 0){const d=i.accessors[e.attributes[h]],f=Bs[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(const m in f.attributes){const A=f.attributes[m],p=l[m];p!==void 0&&(A.normalized=p)}u(f)},o,c,ii,d)})})}}class LM{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class IM{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}}class np extends nr{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=i[r+a];return t}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(i-t)/h,d=u*u,f=d*u,m=e*c,A=m-c,p=-2*f+3*d,g=f-d,_=1-p,E=g-d+u;for(let M=0;M!==o;M++){const b=a[A+M+o],w=a[A+M+l]*h,D=a[m+M+o],x=a[m+M]*h;r[M]=_*b+E*w+p*D+g*x}return r}}const NM=new Pi;class OM extends np{interpolate_(e,t,i,s){const r=super.interpolate_(e,t,i,s);return NM.fromArray(r).normalize().toArray(r),r}}const vi={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Bs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Bu={9728:bt,9729:It,9984:Mf,9985:Za,9986:Rr,9987:cn},Fu={33071:Gi,33648:lo,10497:In},Bl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Yc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},yn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},UM={CUBICSPLINE:void 0,LINEAR:kr,STEP:Hr},Fl={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function BM(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Zs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Zi})),n.DefaultMaterial}function jn(n,e,t){for(const i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Hi(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function FM(n,e,t){let i=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(i=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(i){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):n.attributes.position;a.push(d)}if(s){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):n.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):n.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return i&&(n.morphAttributes.position=h),s&&(n.morphAttributes.normal=u),r&&(n.morphAttributes.color=d),n.morphTargetsRelative=!0,n})}function HM(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function kM(n){let e;const t=n.extensions&&n.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Hl(t.attributes):e=n.indices+":"+Hl(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+Hl(n.targets[i]);return e}function Hl(n){let e="";const t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function jc(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function VM(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const zM=new Ve;class GM{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new uM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);s=i&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&a<98?this.textureLoader=new Sg(this.options.manager):this.textureLoader=new Dg(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Wf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:i,userData:{}};return jn(r,o,s),Hi(o,s),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(i[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const s=i.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const s=e(t[i]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){const i=e+":"+t;let s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return i.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){i.load(Ir.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){const t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=Bl[s.type],o=Bs[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new $t(c,a,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=Bl[s.type],c=Bs[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0;let A,p;if(f&&f!==u){const g=Math.floor(d/f),_="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+g+":"+s.count;let E=t.cache.get(_);E||(A=new c(o,g*f,s.count*f/h),E=new Xm(A,f/h),t.cache.add(_,E)),p=new Rh(E,l,d%f/h,m)}else o===null?A=new c(s.count*l):A=new c(o,d,s.count*l),p=new $t(A,l,m);if(s.sparse!==void 0){const g=Bl.SCALAR,_=Bs[s.sparse.indices.componentType],E=s.sparse.indices.byteOffset||0,M=s.sparse.values.byteOffset||0,b=new _(a[1],E,s.sparse.count*g),w=new c(a[2],M,s.sparse.count*l);o!==null&&(p=new $t(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let D=0,x=b.length;D<x;D++){const S=b[D];if(p.setX(S,w[D*l]),l>=2&&p.setY(S,w[D*l+1]),l>=3&&p.setZ(S,w[D*l+2]),l>=4&&p.setW(S,w[D*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=m}return p})}loadTexture(e){const t=this.json,i=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=i.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,i){const s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,i).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=Bu[d.magFilter]||It,h.minFilter=Bu[d.minFilter]||cn,h.wrapS=Fu[d.wrapS]||In,h.wrapT=Fu[d.wrapT]||In,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==bt&&h.minFilter!==It,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=s.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=i.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(A){const p=new St(A);p.needsUpdate=!0,d(p)}),t.load(Ir.resolveURL(u,r.path),m,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Hi(u,a),u.userData.mimeType=a.mimeType||VM(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,i,s){const r=this;return this.getDependency("texture",i.index).then(function(a){if(!a)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(a=a.clone(),a.channel=i.texCoord),r.extensions[Ke.KHR_TEXTURE_TRANSFORM]){const o=i.extensions!==void 0?i.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new Uf,fi.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(o,l)),i=l}else if(e.isLine){const o="LineBasicMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new Of,fi.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(o,l)),i=l}if(s||r||a){let o="ClonedMaterial:"+i.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=i.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return Zs}loadMaterial(e){const t=this,i=this.json,s=this.extensions,r=i.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){const u=s[Ke.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new we(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],ii),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Lt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Vi);const h=r.alphaMode||Fl.OPAQUE;if(h===Fl.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Fl.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Yi&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new De(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Yi&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Yi){const u=r.emissiveFactor;o.emissive=new we().setRGB(u[0],u[1],u[2],ii)}return r.emissiveTexture!==void 0&&a!==Yi&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Lt)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Hi(u,r),t.associations.set(u,{materials:e}),r.extensions&&jn(s,u,r),u})}createUniqueName(e){const t=ut.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,s=this.primitiveCache;function r(o){return i[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Hu(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=kM(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=Hu(new pi,c,t),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,i=this.json,s=this.extensions,r=i.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?BM(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,m=h.length;f<m;f++){const A=h[f],p=a[f];let g;const _=c[f];if(p.mode===vi.TRIANGLES||p.mode===vi.TRIANGLE_STRIP||p.mode===vi.TRIANGLE_FAN||p.mode===void 0)g=r.isSkinnedMesh===!0?new Zm(A,_):new at(A,_),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),p.mode===vi.TRIANGLE_STRIP?g.geometry=Iu(g.geometry,Cf):p.mode===vi.TRIANGLE_FAN&&(g.geometry=Iu(g.geometry,Uc));else if(p.mode===vi.LINES)g=new tg(A,_);else if(p.mode===vi.LINE_STRIP)g=new Ph(A,_);else if(p.mode===vi.LINE_LOOP)g=new ig(A,_);else if(p.mode===vi.POINTS)g=new ng(A,_);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(g.geometry.morphAttributes).length>0&&HM(g,r),g.name=t.createUniqueName(r.name||"mesh_"+e),Hi(g,r),p.extensions&&jn(s,g,p),t.assignFinalMaterial(g),u.push(g)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&jn(s,u[0],r),u[0];const d=new Xi;r.extensions&&jn(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t;const i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Gt(Ne.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new Jr(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Hi(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){const r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new Ve;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Dh(o,l)})}loadAnimation(e){const t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){const f=s.channels[u],m=s.samplers[f.sampler],A=f.target,p=A.node,g=s.parameters!==void 0?s.parameters[m.input]:m.input,_=s.parameters!==void 0?s.parameters[m.output]:m.output;A.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",_)),c.push(m),h.push(A))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],m=u[2],A=u[3],p=u[4],g=[];for(let E=0,M=d.length;E<M;E++){const b=d[E],w=f[E],D=m[E],x=A[E],S=p[E];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();const N=i._createAnimationTracks(b,w,D,x,S);if(N)for(let R=0;R<N.length;R++)g.push(N[R])}const _=new Ag(r,void 0,g);return Hi(_,s),_})}createNodeMesh(e){const t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){const a=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){const t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(i.getDependency("node",o[c]));const l=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,zM)});for(let f=0,m=u.length;f<m;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,m=u[0];h.pivot=new P().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Nf:c.length>1?h=new Xi:c.length===1?h=c[0]:h=new Mt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Hi(h,r),r.extensions&&jn(i,h,r),r.matrix!==void 0){const u=new Ve;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],s=this,r=new Xi;i.name&&(r.name=s.createUniqueName(i.name)),Hi(r,i),i.extensions&&jn(t,r,i);const a=i.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?r.add(dM(d)):r.add(d)}const c=h=>{const u=new Map;for(const[d,f]of s.associations)(d instanceof fi||d instanceof St)&&u.set(d,f);return h.traverse(d=>{const f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,i,s,r){const a=[],o=e.name?e.name:e.uuid,l=[];yn[r.path]===yn.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(yn[r.path]){case yn.weights:c=Ks;break;case yn.rotation:c=Qs;break;case yn.translation:case yn.scale:c=Js;break;default:i.itemSize===1?c=Ks:c=Js;break}const h=s.interpolation!==void 0?UM[s.interpolation]:kr,u=this._getArrayFromAccessor(i);for(let d=0,f=l.length;d<f;d++){const m=new c(l[d]+"."+yn[r.path],t.array,u,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=jc(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const s=this instanceof Qs?OM:np;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function WM(n,e,t){const i=e.attributes,s=new Ii;if(i.POSITION!==void 0){const o=t.json.accessors[i.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){const h=jc(Bs[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new P,l=new P;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){const A=jc(Bs[d.componentType]);l.multiplyScalar(A)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}n.boundingBox=s;const a=new Qi;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=a}function Hu(n,e,t){const i=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){n.setAttribute(o,l)})}for(const a in i){const o=Yc[a]||a.toLowerCase();o in n.attributes||s.push(r(i[a],o))}if(e.indices!==void 0&&!n.index){const a=t.getDependency("accessor",e.indices).then(function(o){n.setIndex(o)});s.push(a)}return $e.workingColorSpace!==ii&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${$e.workingColorSpace}" not supported.`),Hi(n,e),WM(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?FM(n,e.targets,t):n})}class XM extends Po{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new ir;e.deleteAttribute("uv");const t=new Zs({side:Jt}),i=new Zs,s=new Yf(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new at(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Gr(e,i,6),o=new Mt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new at(e,Es(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new at(e,Es(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new at(e,Es(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new at(e,Es(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const d=new at(e,Es(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const f=new at(e,Es(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Es(n){return new cg({color:0,emissive:16777215,emissiveIntensity:n})}function sp(n,e,t="baseline"){const i=t==="refined";n.toneMappingExposure=i?1:1.05;const s=new Vc(n),r=new XM;e.environment=s.fromScene(r,.04).texture,r.dispose(),s.dispose(),e.environmentIntensity=i?.52:.48,e.add(new Eg("#fffaf5",i?"#b49b80":"#b4a18c",i?.5:.65));const a=new Hc(i?"#fff4e5":"#fff7ed",i?1.7:1.4);a.position.set(...i?[-8,14,4]:[-6,14,-5]);const o=new Hc("#ffffff",i?.3:.6);return o.position.set(7,8,-10),e.add(a,o),a}class YM extends On{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Nt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ri.clone(e.uniforms),this.material=new Nt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new lr(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ku extends On{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class jM extends On{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class rp{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new De);this._width=i.width,this._height=i.height,t=new qt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ti}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new YM(to),this.copyPass.material.blending=zt,this.timer=new Ig}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ku!==void 0&&(a instanceof ku?i=!0:a instanceof jM&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new De);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ap extends On{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new we}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Va={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class op extends On{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ri.clone(Va.uniforms),this.material=new kf({name:Va.name,uniforms:this.uniforms,vertexShader:Va.vertexShader,fragmentShader:Va.fragmentShader}),this._fsQuad=new lr(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},$e.getTransfer(this._outputColorSpace)===lt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===uh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ph?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Kr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===gh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ah?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===mh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const za={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new De(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},Ga={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new De(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},kl={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new De(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};class lp extends On{constructor(){super(),this._edgesRT=new qt(1,1,{depthBuffer:!1,type:ti}),this._edgesRT.texture.name="SMAAPass.edges",this._weightsRT=new qt(1,1,{depthBuffer:!1,type:ti}),this._weightsRT.texture.name="SMAAPass.weights";const e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new St,this._areaTexture.name="SMAAPass.area",this._areaTexture.image=t,this._areaTexture.minFilter=It,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;const i=new Image;i.src=this._getSearchTexture(),i.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new St,this._searchTexture.name="SMAAPass.search",this._searchTexture.image=i,this._searchTexture.magFilter=bt,this._searchTexture.minFilter=bt,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=Ri.clone(za.uniforms),this._materialEdges=new Nt({defines:Object.assign({},za.defines),uniforms:this._uniformsEdges,vertexShader:za.vertexShader,fragmentShader:za.fragmentShader}),this._uniformsWeights=Ri.clone(Ga.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new Nt({defines:Object.assign({},Ga.defines),uniforms:this._uniformsWeights,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._uniformsBlend=Ri.clone(kl.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new Nt({uniforms:this._uniformsBlend,vertexShader:kl.vertexShader,fragmentShader:kl.fragmentShader}),this._fsQuad=new lr(null)}render(e,t,i){this._uniformsEdges.tDiffuse.value=i.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=i.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return"data:image/png;base64,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"}_getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}}function qc(n,e,t){const i=Math.min(t.anisotropy,e.capabilities.getMaxAnisotropy()),s=new Set;n.traverse(r=>{if(r instanceof at)for(const a of Array.isArray(r.material)?r.material:[r.material])for(const o of Object.values(a))o instanceof St&&!o.isRenderTargetTexture&&s.add(o)});for(const r of s)r.anisotropy!==i&&(r.anisotropy=i,r.needsUpdate=!0)}function cp(n,e,t,i,s=!1){const r=Math.max(1,t.clientWidth),a=Math.max(1,t.clientHeight),o=b0(i,r,a,t.getBoundingClientRect().width/r,devicePixelRatio,n.capabilities.maxTextureSize,s?921600:8294400);return n.setPixelRatio(o.ratio),n.setSize(r,a),e.setPixelRatio(o.ratio),e.setSize(r,a),n.transmissionResolutionScale=i.transmission,t.dataset.renderQuality=JSON.stringify({...o,antialias:i.antialias,transmission:i.transmission,anisotropy:Math.min(i.anisotropy,n.capabilities.getMaxAnisotropy()),superPerformance:s}),o}function qM(n,e,t){const i=new rp(n),s=new lp;return i.addPass(new ap(e,t)),i.addPass(s),i.addPass(new op),{composer:i,smaa:s}}const Vu=.12,hp=.42,Vl=.025,ZM=.016,KM=`
float archiveTransmissionLod(float roughness, float ior, vec2 samplerSize) {
  float nativeLod = log2(samplerSize.x) * roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
  float strength = clamp((roughness - ${Vl}) / ${hp-Vl}, 0.0, 1.0);
  float panelPixels = length(vArchiveProjectedAxis * samplerSize);
  float clearLod = log2(samplerSize.x) * ${Vl} * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
  float boundedLod = log2(max(exp2(clearLod), panelPixels * ${ZM} * pow(strength, 1.15)));
  return mix(nativeLod, min(nativeLod, boundedLod), archiveQuality);
}`,QM=`
float glassRevealAtHeight(float progress, float height) {
  float edge = 1.0 - ${1+2*Vu} * clamp(progress, 0.0, 1.0);
  return smoothstep(edge, edge + ${2*Vu}, clamp(height, 0.0, 1.0));
}`,JM={Optical_Glass_Body:{color:"#929894",roughness:.38,opacity:.27,order:20},Optical_Glass_Roof:{color:"#929b94",roughness:.34,opacity:.42,order:24},Optical_Glass_Edge:{color:"#edf0e7",roughness:.19,opacity:.9,order:28},Optical_Bridge_Glass:{color:"#a0aca2",roughness:.32,opacity:.36,order:26}};function $M(n,e){const t=JM[n];t&&(e.color.set(t.color),e.roughness=t.roughness,e.metalness=.015,e.clearcoat=.42,e.clearcoatRoughness=.24,e.opacity=t.opacity,e.transmission=0,e.transparent=!1,e.blending=hh,e.blendEquation=zi,e.blendSrc=oo,e.blendDst=Br,e.blendSrcAlpha=Af,e.blendDstAlpha=Br,e.depthWrite=!1,e.side=Zi,e.userData.opticalOrder=t.order)}function ey(n){return n.replace("#include <opaque_fragment>",`diffuseColor.a = min(0.86, opacity + 0.42 * pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0));
     #include <opaque_fragment>`)}class ty{palettes=new Map;disposeSources(){for(const e of this.palettes.values())e.high.dispose(),e.low?.dispose();this.palettes.clear()}register(e,t,i){this.palettes.set(e,{high:t,low:i})}prepare(e){for(const t of e.children){const i=t,s=i.userData.surface,r=this.palettes.get(s);if(!r){i.userData.themeAmount=Ao(i.material,"Printed_Canvas");continue}const a=r.high.clone(),o={value:0},l={value:0};i.material=a,a.userData.opticalOrder&&(i.renderOrder=a.userData.opticalOrder),i.userData.appearance=o,i.userData.glassClarity=l,a.onBeforeCompile=c=>{a.userData.opticalOrder&&(c.fragmentShader=ey(c.fragmentShader)),c.uniforms.archiveQuality=o,c.uniforms.archiveClarity=l,c.fragmentShader=`uniform float archiveQuality;
uniform float archiveClarity;
`+c.fragmentShader,s==="Frosted_Polymer"?(c.vertexShader=`varying float vArchiveHeight;
varying vec2 vArchiveProjectedAxis;
`+c.vertexShader,c.vertexShader=c.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vArchiveHeight = position.y / 3.7;`),c.fragmentShader=`varying float vArchiveHeight;
varying vec2 vArchiveProjectedAxis;
`+QM+c.fragmentShader,c.vertexShader=c.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vArchiveProjectedAxis = 1.85 * vec2(projectionMatrix[0][0] * modelViewMatrix[1][0], projectionMatrix[1][1] * modelViewMatrix[1][1]) / max(0.0001, abs(mvPosition.z));`),c.fragmentShader=c.fragmentShader.replace("#include <transmission_pars_fragment>",KM+`
`+Ge.transmission_pars_fragment.replace("float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );","float lod = archiveTransmissionLod(roughness, ior, transmissionSamplerSize);")),c.fragmentShader=c.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= mix(mix(vec3(0.40, 0.30, 0.20), vec3(1.0, 0.98, 0.94), smoothstep(0.1, 1.0, vArchiveHeight)), vec3(1.0), archiveQuality);`),c.fragmentShader=c.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(mix(0.28, ${hp}, archiveQuality), 0.025, glassRevealAtHeight(archiveClarity, vArchiveHeight));`)):r.low||(c.fragmentShader=c.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
float coverage = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
if (archiveQuality <= coverage) discard;`))},a.customProgramCacheKey=()=>`archive-surface-clarity-${s}-${!!r.low}`,i.userData.subduedIndex={value:0},i.userData.themeAmount=Ao(a,s,!1,i.userData.subduedIndex)}}setClarity(e,t){const i=Ne.clamp(t,0,1);e.traverse(s=>{if(!(s instanceof at)||!s.userData.glassClarity||(s.userData.glassClarity.value=i,s.userData.surface!=="Frosted_Polymer"))return;const r=s.material,a=this.palettes.get("Frosted_Polymer"),o=s.userData.appearance.value,l=c=>Ne.lerp(a.low?.[c]??a.high[c],a.high[c],o);r.thickness=Ne.lerp(l("thickness"),.018,i),r.transmission=Ne.lerp(l("transmission"),.985,i),r.attenuationDistance=Ne.lerp(l("attenuationDistance"),8,i)})}setTheme(e,t,i=!1){e.traverse(s=>{s.userData.themeAmount&&(s.userData.themeAmount.value=t),s.userData.subduedIndex&&(s.userData.subduedIndex.value=Ne.clamp(Number(i),0,1))})}apply(e,t){for(const i of e.children){const s=i,r=this.palettes.get(s.userData.surface);if(!r){s.material.opacity=t;continue}s.userData.appearance.value=t;const{high:a,low:o}=r;if(!o)continue;const l=s.material;l.color.copy(o.color).lerp(a.color,t),l.attenuationColor&&o.attenuationColor&&a.attenuationColor&&(l.attenuationColor.copy(o.attenuationColor).lerp(a.attenuationColor,t),l.attenuationDistance=Number.isFinite(o.attenuationDistance)&&Number.isFinite(a.attenuationDistance)?Ne.lerp(o.attenuationDistance,a.attenuationDistance,t):a.attenuationDistance);for(const c of["roughness","metalness","transmission","thickness","clearcoat","clearcoatRoughness"])l[c]=Ne.lerp(o[c]??0,a[c]??0,t);a.transmission>0&&(l.transmission=Math.max(1e-6,l.transmission))}}dispose(e){for(const t of e.children){const i=t,s=i.material;i.userData.surface||s.map?.dispose(),s.dispose()}}}const dp='<path d="M156 75C127 48 103 15 70 15C37 15 15 39 15 70S38 128 70 128C103 128 127 96 176 52M155 75C182 99 208 128 240 128C273 128 295 105 295 73S273 15 240 15C221 15 207 23 192 38" fill="none" stroke="currentColor" stroke-width="26"/><path d="M44 70h50M69 45v50M219 70h44" fill="none" stroke="currentColor" stroke-width="15"/>',iy=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 145" color="#171713">${dp}</svg>`,zl=`<svg viewBox="0 0 310 185" aria-label="星穹列车资料终端" role="img">${dp}<text x="165" y="174" text-anchor="middle" font-family="MiSans,sans-serif" font-size="14" font-weight="700" letter-spacing="8">ASTRAL·EXPRESS</text></svg>`,ny="M295 73C295 41 273 15 240 15C221 15 207 23 192 38C186 43 181 47 176 52C127 96 103 128 70 128C38 128 15 101 15 70C15 39 37 15 70 15C103 15 127 48 156 75C182 99 208 128 240 128C273 128 295 105 295 73Z",sy=[2,28,55,81,103,129,154,166],ry=`<h1>ASTRAL EXPRESS</h1><div>TRAILBLAZE INFORMATION</div><p><span class="brand-analysis" role="img" aria-label="ANALYSIS">${[..."ANALYSIS"].map((n,e)=>`<span aria-hidden="true" style="left:${sy[e]}px">${n}</span>`).join("")}</span> <b>OS</b></p>`;class ay{active=!1;moved=!1;value={lane:0,row:0};x=0;y=0;inverse=null;samples=[];lastMotion=-1/0;motionDirection={x:0,y:0};pointer={x:0,y:0};start(e,t,i,s=0){this.active=!1,this.moved=!1,this.x=e,this.y=t,this.value={lane:0,row:0},this.samples=[{value:this.value,time:s}],this.lastMotion=-1/0,this.motionDirection={x:0,y:0},this.pointer={x:e,y:t};const{lane:r,row:a}=i,o=r.x*a.y-a.x*r.y,l=Math.hypot(r.x,r.y)*Math.hypot(a.x,a.y);this.inverse=Number.isFinite(l)&&l>0&&Math.abs(o)>l*.001?{lane:{x:a.y/o,y:-a.x/o},row:{x:-r.y/o,y:r.x/o}}:null}move(e,t,i){const s=e-this.x,r=t-this.y,a=Math.hypot(s,r);if(a>7&&(this.moved=!0),!this.inverse||!this.active&&a<10)return;this.active=!0;const o={lane:s*this.inverse.lane.x+r*this.inverse.lane.y,row:s*this.inverse.row.x+r*this.inverse.row.y},l=this.samples.at(-1);if(l){const c={x:e-this.pointer.x,y:t-this.pointer.y};Math.hypot(c.x,c.y)>1e-9&&(this.lastMotion=i,c.x*this.motionDirection.x+c.y*this.motionDirection.y<0&&(this.samples=[l]),this.motionDirection=c)}this.pointer={x:e,y:t},this.value=o,l?.time===i?this.samples[this.samples.length-1]={value:o,time:i}:this.samples.push({value:o,time:i}),this.samples=this.samples.filter(c=>i-c.time<=120).slice(-32)}releaseVelocity(e,t){const i=this.samples[0],s=this.samples.at(-1);if(t||!i||!s||e-this.lastMotion>80||s.time-i.time<8)return{lane:0,row:0};const r=1e3/(s.time-i.time);return{lane:(s.value.lane-i.value.lane)*r,row:(s.value.row-i.value.row)*r}}}class zu{value;velocity;phase;target;friction=2.4;constructor(e,t){this.value=e,this.velocity=t,this.phase=Math.abs(t)>=.75?"coasting":"snapping",this.target=Math.round(e)}step(e,t=this.phase==="coasting"){if(t){const i=Math.exp(-this.friction*e);this.value+=this.velocity*(1-i)/this.friction,this.velocity*=i,Math.abs(this.velocity)<.6&&(this.target=Math.round(this.value+this.velocity/this.friction),this.phase="snapping")}else if(this.phase==="snapping"){const s=this.value-this.target,r=this.velocity+10*s,a=Math.exp(-10*e);this.value=this.target+(s+r*e)*a,this.velocity=(this.velocity-10*r*e)*a,Math.abs(this.value-this.target)<1e-4&&Math.abs(this.velocity)<.005&&(this.value=this.target,this.velocity=0,this.phase="idle")}}}class oy{lane;row;constructor(e,t){this.lane=new zu(e.lane,t.lane),this.row=new zu(e.row,t.row)}get phase(){return this.lane.phase==="coasting"||this.row.phase==="coasting"?"coasting":this.lane.phase==="idle"&&this.row.phase==="idle"?"idle":"snapping"}get value(){return{lane:this.lane.value,row:this.row.value}}get velocity(){return{lane:this.lane.velocity,row:this.row.velocity}}step(e){const t=this.phase==="coasting";this.lane.step(e,t),this.row.step(e,t)}}const Wa={boot:{title:"BOOT SEQUENCE",description:"开机标志、扫描与欢迎画面",group:"开场"},selectionWave:{title:"SELECTION WAVE",description:"选档时向阵列传播的波浪",group:"档案阵列"},idleWave:{title:"IDLE MOTION",description:"停止操作后的阵列起伏",group:"档案阵列"},pointerParallax:{title:"POINTER PARALLAX",description:"镜头随指针的轻微偏移",group:"档案阵列"},dragMomentum:{title:"DRAG MOMENTUM",description:"松手后按实际速度继续滑行",group:"档案阵列"},selectionTransition:{title:"SELECTION TRANSITION",description:"切列、切档时的轨道移动",group:"档案阵列"},detailTransition:{title:"DETAIL TRANSITION",description:"抽取、转正、归位与详情镜头",group:"档案详情"},modelDecryption:{title:"MODEL DECRYPTION",description:"模型解密线与磨砂揭示",group:"档案详情"},documentReveal:{title:"DOCUMENT REVEAL",description:"正文的遮罩揭示",group:"档案详情"},rollingText:{title:"ROLLING TEXT",description:"标题、分类与权限标签滚动",group:"界面"},rollingNumbers:{title:"ROLLING NUMBERS",description:"序号、列编号与档案编码滚动",group:"界面"},surfaceTransitions:{title:"SURFACE TRANSITIONS",description:"详情、检索、收藏与设置窗口过渡",group:"界面"},viewerNavigation:{title:"VIEWER NAVIGATION",description:"360° 旋转、平移、缩放与复位阻尼",group:"360° 查看器"},viewerModelTransition:{title:"VIEWER MODEL TRANSITION",description:"拆解、重组与清晰度变化",group:"360° 查看器"}},io={boot:!0,selectionWave:!0,idleWave:!0,pointerParallax:!0,dragMomentum:!0,selectionTransition:!0,detailTransition:!0,modelDecryption:!0,documentReveal:!0,rollingText:!0,rollingNumbers:!0,surfaceTransitions:!0,viewerNavigation:!0,viewerModelTransition:!0},Zc={boot:!1,selectionWave:!1,idleWave:!1,pointerParallax:!1,dragMomentum:!1,selectionTransition:!1,detailTransition:!1,modelDecryption:!1,documentReveal:!1,rollingText:!1,rollingNumbers:!1,surfaceTransitions:!1,viewerNavigation:!1,viewerModelTransition:!1};function Wr(){return{...io}}function up(){return{...Zc}}function Uh(n){return Object.values(n).every(Boolean)?"full":Object.values(n).every(e=>!e)?"reduced":"custom"}function ly(n,e){const i={...n?.preset==="full"?io:n?.preset==="reduced"||e===!0?Zc:io};if(n)for(const s of Object.keys(io))typeof n[s]=="boolean"&&(i[s]=n[s]);return i}function cy(n,e){return n[e]}function hy(n){const e=Object.values(n).filter(Boolean).length;if(e===Object.keys(n).length)return"当前使用完整动画。";if(e===0)return"当前已减少动画。";const t=[];return n.boot||t.push("开场已跳过"),!n.selectionWave&&!n.idleWave&&t.push("阵列波动已关闭"),!n.rollingText&&!n.rollingNumbers&&t.push("文字滚动已关闭"),`当前使用自定义动画（${t.slice(0,2).join("、")||`启用 ${e} 项`}）。`}function fp(n,e){const t=[...new Set(Object.values(Wa).map(r=>r.group))],i=e??Uh(n),s=(r,a)=>`<button type="button" data-action="motion-preset" data-preset="${r}" aria-pressed="${i===r}"${r==="custom"?" disabled":""}>${a}</button>`;return`<section id="motion-settings" class="motion-settings" aria-label="动效设置"><div class="motion-settings-head"><div><strong>ANIMATION CONTROLS</strong><span>完整、减少或按分项自定义；关闭后会立即收束当前动画（开场设置下次重播生效）</span></div>${s("full","完整")}${s("reduced","减少")}${s("custom","自定义")}</div><details class="motion-advanced"><summary>精细设置 <span>开场 / 阵列 / 详情 / 界面 / 360° 查看器</span></summary><div class="motion-groups">${t.map(r=>`<fieldset><legend>${r}</legend>${Object.keys(Wa).filter(a=>Wa[a].group===r).map(a=>{const o=Wa[a];return`<label class="motion-setting"><div><strong>${o.title}</strong><span>${o.description}</span></div><input type="checkbox" data-motion="${a}" ${n[a]?"checked":""}/><i class="toggle"></i></label>`}).join("")}</fieldset>`).join("")}</div></details></section>`}const di=n=>(n=Math.max(0,Math.min(1,n)),n*n*n*(10+n*(-15+6*n))),vo=(n,e)=>Math.exp(-.5*(n/e)**2);function pp(n,e,t){const i=t-22,s=n+(e-2)*.65,r=di(i/.32),a=3+i*19,o=32-(i-2.3)*24,l=c=>2.5*vo(c,3.8)-.58*vo(c-6,3.5);return r*(l(s-a)*(1-di((i-2.15)/.65))+l(s-o)*di((i-2.17)/.32)*(1-di((i-3.5)/.85)))}function dy(n){return .4*di((n-25.58)/.82)+2.95*di((n-27.55)/1.3)}function Kc(n,e){const t=e-25.05-Math.abs(n)*.065,i=Math.max(-.42,2.15-.17*(Math.sqrt(n*n+1)-1)),s=di(t/.62),r=t>0?Math.sin(t*5.1)*Math.exp(-t*1.3):0;return i*(s+.18*r*di(t/.16))}function uy(n,e){return e<0||e>3.2?0:.8*di(e/.2)*Math.exp(-e*1.15)*Math.cos((n-e*8)*.58)*vo(n-e*8,3.4)}function fy(n,e){return di(n/2.5)*Math.max(0,Math.cos((n-e*8)*.58))}function mp(n,e,t=1){return 1+(.25+.75*vo(n-e,.55)-1)*di(t)}function py(n,e,t){return .075*Math.sin(t*Math.PI*2/8+n*.3-e*.45)+.027*Math.sin(t*Math.PI*2/13-n*.17+e*.3)}function my(n,e,t,i=12,s=2){const r=di((t-24.95)/.45),a=di((t-25.4)/.95),o=t+.3*r*(1-a);return pp(n,e,t)*(1-r)+Kc(n-i,o)*mp(e,s,(t-25.4)/.95)}const Gu=4.05,gy=.001;function Wu(n,e,t=!1){const i=n*Math.exp(-e*(t?35:7));return Math.abs(i)<=gy?0:i}function Sn(n,e,t,i){const s=n.value-e,r=n.velocity+t*s,a=Math.exp(-t*i);n.value=e+(s+r*i)*a,n.velocity=(n.velocity-t*r*i)*a}const Et=n=>(n=Ne.clamp(n,0,1),n*n*n*(n*(n*6-15)+10));class Ay{constructor(e,t=uy,i=!1,s="baseline"){this.container=e,this.selectionPulse=t,this.deferSelectionPulse=i,this.lightingLook=s,this.renderer=new $f({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)*Math.min(innerWidth/1920,innerHeight/1080)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.info.autoReset=!1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.type=gf,this.renderer.toneMapping=Kr,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.setAttribute("aria-label","三维旅途档案阵列，点击选择，左右拖动切列，上下拖动或滚轮切换列内档案"),e.appendChild(this.renderer.domElement),this.renderer.domElement.addEventListener("webglcontextrestored",()=>this.renderState.invalidate(),{signal:this.inputEvents.signal}),this.scene.background=new we("#eae5e1"),this.scene.matrixWorldAutoUpdate=!1,this.scene.fog=new Do("#eae5e1",22,47),this.light=sp(this.renderer,this.scene,s),this.light.castShadow=!0,Object.assign(this.light.shadow.camera,{left:-16,right:16,top:15,bottom:-15,near:.1,far:45}),this.light.shadow.mapSize.set(2048,2048),this.light.shadow.normalBias=s==="refined"?.018:.035,this.light.shadow.bias=s==="refined"?-12e-5:-3e-4,this.light.shadow.radius=4;const r=new at(new Jn(200,200),new Zs({color:"#d8c9b9",roughness:.95}));r.rotation.x=-Math.PI/2,r.name="archive-floor",r.position.y=-4.63,r.receiveShadow=!0,this.scene.add(r),this.camera.position.set(-62.26,35.98,43.28),this.cameraAim.set(-.5,1.1,.4),this.camera.fov=6.15,this.camera.lookAt(this.cameraAim),this.composer=new rp(this.renderer),this.composer.addPass(new ap(this.scene,this.camera)),this.ao=new Cu(this.scene,this.camera,e.clientWidth,e.clientHeight),this.ao.kernelRadius=s==="refined"?.44:.38,this.ao.minDistance=.001,this.ao.maxDistance=.09,this.composer.addPass(this.ao),this.bokeh=new iM(this.scene,this.camera,{focus:25,aperture:.0018,maxblur:.011},()=>this.ao),this.composer.addPass(this.bokeh),this.smaa.enabled=!1,this.composer.addPass(this.smaa),this.composer.addPass(new op),this.bindPointer()}container;selectionPulse;deferSelectionPulse;lightingLook;inputEvents=new AbortController;presence=1;presenceTarget=1;setPresentationVisible(e,t=!1){this.presenceTarget=Number(e),t&&(this.presence=this.presenceTarget),e||this.cancelPointer()}get presentationHidden(){return this.presenceTarget===0&&this.presence===0}presentationDrop(e){const t=.15*(1+Math.tanh((e.row-this.selectedCell.row)*.1+(e.lane-this.selectedCell.lane)*.25));return 35*Math.pow(Ne.clamp((1-this.presence-t)/.7,0,1),2)}revealImmediately(){this.reveal=this.targetReveal}dispose(){this.inputEvents.abort(),this.cancelPointer(),Xc(this.scene),this.appearance.disposeSources(),this.model.clear(),this.outgoing=[],this.instances=[],this.assemblyTemplate?.then(Xc).catch(()=>{}),this.assemblyTemplate=void 0,this.light.shadow.map?.dispose();for(const e of this.composer.passes)e.dispose();this.composer.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.renderer.domElement.remove(),this.loaded=!1}uiOnlyParallax=!1;theme=new nM;subduedIndex={value:0};selectedIndexOnly=!1;superPerformance=!1;setSuperPerformance(e){if(this.superPerformance!==e){this.superPerformance=e;for(const t of this.instances){const i=t.userData.fullMaterial??=t.material;if(e&&!t.userData.fastMaterial){const s=i.clone();s.onBeforeCompile=i.onBeforeCompile,s.customProgramCacheKey=i.customProgramCacheKey.bind(i),s.transmission=0,s.clearcoat=0,s.roughness=Math.max(.45,i.roughness),t.userData.fastMaterial=s}t.material=e?t.userData.fastMaterial:i,t.visible=!e||i.name.replace(/\.\d+$/,"")!=="Titanium_Fasteners"}this.resize()}}setSelectedIndexAccent(e){this.selectedIndexOnly=e}themeAttribute;get themeAmount(){return this.theme.background(performance.now()/1e3)}setTheme(e,t=!1){this.theme.set(e,performance.now()/1e3,this.selectedCell,t)}playfield={enabled:!1,bands:Lu(),strength:1,flatten:0,target:null,breathing:!0};flatMix=0;rhythm=new cM;rhythmStyle="legacy";setRhythmStyle(e){this.rhythmStyle=e}relayLifts=new Map;relayPoints=new Map;relayActive=!1;onRelayPick;setPlayfield(e,t,i,s,r,a=!0){this.playfield={enabled:e,bands:t,strength:i,flatten:s,target:r,breathing:a}}setRelayActive(e){e!==this.relayActive&&(this.cancelPointer(),this.setHover(null),this.relayActive=e,this.pointer.set(0,0))}relayPulse(e){const t=this.relayPoints.get(e)?.cell;t&&!this.reduced&&this.emitPulse(t)}projectRelay(e){const t=this.relayPoints.get(e);if(!t)return null;const i=t.point.clone().project(this.camera),s=this.renderer.domElement.getBoundingClientRect();return{x:s.left+(i.x+1)*s.width/2,y:s.top+(1-i.y)*s.height/2}}relayCandidates(){const e=this.renderer.domElement.getBoundingClientRect();return this.scene.updateMatrixWorld(!0),[...this.relayPoints.keys()].filter(t=>{const i=this.projectRelay(t),s=(i.x-e.left)/e.width,r=(i.y-e.top)/e.height;if(s<.18||s>.82||r<.32||r>.76)return!1;const a=this.pickCell(i.x,i.y);return a&&ln(a)===t})}renderer;scene=new Po;camera=new Gt(34,16/9,5,300);composer;ao;bokeh;instances=[];matrixUpdates;themeUpdates;renderState=new K_;renderedFrames=0;reusedFrames=0;visibility=new Z_;instanceCapacity=wu*go;drawnCells=[];extraCoverage=!1;setArchiveCoverage(e){this.extraCoverage=e}model=new Xi;appearance=new ty;decryption=new x0;cursor=new De;raycaster=new Wg;dummy=new Mt;cells=[];selectedCell={lane:2,row:12};looping=!1;coordinateOrigin={lane:0,row:0};lift={value:0,velocity:0};rail={value:0,velocity:0};shoulder={value:12,velocity:0};laneFocus={value:2,velocity:0};columnCamera={value:0,velocity:0};returnY=null;canInspect=!1;clearance=0;pulseGain=1;idleGain=0;lastInteraction=0;scanTime=29.1;scanBlend=0;cameraAim=new P;outgoing=[];pulses=[];pendingPulse=null;selectedSlot=76;detail=0;targetDetail=0;reveal=0;targetReveal=0;last=0;pointer=new De;dragging=!1;hoverCell=null;hoverLifts=new Map;archiveDrag=new ay;dragTrack=null;navigatingDrag=!1;archiveMomentum=null;holdingArchive=!1;cancelPointer=()=>{};rotation=0;targetRotation=0;light;clock=0;loaded=!1;labelCanvas=document.createElement("canvas");labelTexture;labelMark=new Image;motion=Wr();quality=Kn(void 0);appliedQuality="";smaa=new lp;aoKernelSize=32;displayHeight=0;layoutKind="";onSelect;onHover;onNavigate;async load(e=$n("assets/archive-cassette.glb")){this.labelMark.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(iy)}`,await this.labelMark.decode();const t=await new Nu().loadAsync(e);t.scene.updateMatrixWorld(!0);const i=[];t.scene.traverse(a=>{a instanceof at&&i.push(a)});const s=wu*go;for(let a=0;a<s;a++){const o=Ul(a);this.cells.push(o)}for(const a of i){const o=a.geometry.clone().applyMatrix4(a.matrixWorld).scale(1,1,1),l=a.material,c=l.name.replace(/\.\d+$/,""),h=l.clone();if(h.envMapIntensity=.6,c==="Frosted_Polymer"&&(h.color.set("#fffdfa"),h.transmission=.9,h.thickness=.12,h.roughness=.21,h.ior=1.46,h.attenuationColor=new we("#eee6df"),h.attenuationDistance=2),c==="Internal_Ceramic"&&(h.color.set(this.lightingLook==="refined"?"#c4baae":"#c7beb6"),h.roughness=.6),c==="Printed_Label"&&h.color.set("#eae5dc"),c==="Ivory_Edges"&&(h.color.set("#f0e7df"),h.roughness=.31,h.transmission=.65,h.thickness=.04),c==="Optical_Diffuser"&&(h.color.set("#e2dad4"),h.transmission=0,h.roughness=.7),c==="Subsurface_Optics"&&(h.color.set(this.lightingLook==="refined"?"#b9a796":"#b9aba1"),h.roughness=.48,h.metalness=.05),c==="Optical_Edges"&&(h.transmission=0,h.color.set(this.lightingLook==="refined"?"#d8c7b5":"#d4c7be"),h.roughness=.26,h.metalness=.08),$M(c,h),c==="Carbon_Ink")continue;const u=new at(o,h);if(u.userData.surface=c,u.castShadow=c==="Optical_Diffuser",u.receiveShadow=!0,this.model.add(u),!["Frosted_Polymer","Ivory_Edges","Titanium_Fasteners","Index_Inlay","Optical_Diffuser"].includes(c)){this.appearance.register(c,h);continue}const d=h.clone();c==="Frosted_Polymer"&&(d.transmission=.78,this.lightingLook==="refined"&&(d.thickness=.28,d.attenuationColor.set("#d4c7b4"),d.attenuationDistance=1.2),d.transparent=!1,d.color.set("#fff7ed"),d.onBeforeCompile=m=>{m.vertexShader=`varying float vPanelHeight;
`+m.vertexShader,m.vertexShader=m.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vPanelHeight = position.y / 3.7;`),m.fragmentShader=`varying float vPanelHeight;
`+m.fragmentShader,m.fragmentShader=m.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
diffuseColor.rgb *= mix(vec3(0.40, 0.30, 0.20), vec3(1.0, 0.98, 0.94), smoothstep(0.1, 1.0, vPanelHeight));`)},d.roughness=.28,d.clearcoat=.3,d.clearcoatRoughness=.25),c==="Optical_Diffuser"&&d.color.set("#806447"),c==="Ivory_Edges"&&(d.transmission=0,d.color.set(this.lightingLook==="refined"?"#dcc9b0":"#fff5e9"),d.roughness=.38),c==="Index_Inlay"&&(d.color.set("#e4d6c5"),d.metalness=.05),this.appearance.register(c,h,d),this.themeAttribute??=new Us(new Float32Array(s),1).setUsage(oa),o.setAttribute("archiveTheme",this.themeAttribute),Ao(d,c,!0,this.subduedIndex);const f=new Gr(o,d,s);f.instanceMatrix=this.instances[0]?.instanceMatrix??f.instanceMatrix.setUsage(oa),f.castShadow=c==="Optical_Diffuser",f.receiveShadow=!0,f.frustumCulled=!1,this.instances.push(f),this.scene.add(f)}this.labelCanvas.width=1024,this.labelCanvas.height=440,this.labelTexture=new wl(this.labelCanvas),this.labelTexture.colorSpace=Lt,this.labelTexture.anisotropy=this.renderer.capabilities.getMaxAnisotropy();const r=new at(new Jn(.99,.46),new Yi({map:this.labelTexture,toneMapped:!1,transparent:!0,depthWrite:!1}));r.position.set(-1.36,3.04,.255),this.model.add(r),this.appearance.prepare(this.model),this.appearance.apply(this.model,0),this.drawLabel(0),this.scene.add(this.model),this.model.position.copy(this.cellPosition(Ul(this.selectedSlot))),this.loaded=!0}assemblyTemplate;async createAssemblyModel(){this.assemblyTemplate??=new Nu().loadAsync($n("assets/archive-assembly.glb")).then(o=>(o.scene.updateMatrixWorld(!0),o.scene)).catch(o=>{throw this.assemblyTemplate=void 0,o});const e=await this.assemblyTemplate,t=new Xi,i=[];e.traverse(o=>{if(!(o instanceof at))return;const l=o.material.name.replace(/\.\d+$/,""),c=new at(o.geometry.clone().applyMatrix4(o.matrixWorld),o.material);c.userData.surface=l,c.userData.assemblyPart=o.userData.assemblyPart,t.add(c),i.push(c)}),this.appearance.prepare(t),this.appearance.apply(t,1),this.appearance.setClarity(t,this.modelClarity()),this.appearance.setTheme(t,this.themeAmount);const s=document.createElement("canvas");s.width=this.labelCanvas.width,s.height=this.labelCanvas.height,s.getContext("2d").drawImage(this.labelCanvas,0,0);const r=new wl(s);r.colorSpace=Lt,r.anisotropy=this.renderer.capabilities.getMaxAnisotropy();const a=new at(new Jn(.99,.46),new Yi({map:r,toneMapped:!1,transparent:!0,depthWrite:!1}));return a.position.set(-1.36,3.04,.255),a.userData.assemblyPart="cover",a.userData.themeAmount=Ao(a.material,"Printed_Canvas"),a.userData.themeAmount.value=this.themeAmount,t.add(a),i.push(a),{model:t,setClarity:o=>this.appearance.setClarity(t,o),dispose:()=>{for(const o of i)o.geometry.dispose(),o.material.dispose();r.dispose()}}}setMode(e){if(this.cancelPointer(),this.setHover(null),e==="detail"?this.decryption.enter(this.scanBlend>.9&&this.decryption.clarity>.999):this.decryption.leave(),e==="hidden"&&this.decryption.select(),e!=="archive"&&(this.pendingPulse=null),this.looping=e!=="hidden",!this.looping){const t=qi(X_(this.selectedSlot));this.selectedCell={lane:t.lane,row:t.row},this.coordinateOrigin={lane:0,row:0};for(const i of this.outgoing)this.scene.remove(i.group),this.appearance.dispose(i.group);this.outgoing=[]}this.lastInteraction=this.clock,this.targetReveal=e==="hidden"?0:1,this.targetDetail=e==="detail"?1:0,this.dragging=!1,e!=="detail"?(this.targetRotation=0,this.rotation!==0&&(this.returnY=this.model.position.y)):this.returnY=null}setReduced(e){this.setMotion(e?up():Wr())}setMotion(e){if((!e.pointerParallax||!e.dragMomentum)&&(this.motion.pointerParallax||this.motion.dragMomentum)&&this.cancelPointer(),e.dragMomentum||(this.archiveMomentum=null,this.columnCamera.velocity=0,this.rail.velocity=0),e.pointerParallax||this.pointer.set(0,0),e.selectionWave||(this.pulses=[]),e.idleWave||(this.idleGain=0),this.motion={...e},!e.modelDecryption){this.appearance.setClarity(this.model,this.modelClarity());for(const t of this.outgoing)t.clarity=0,this.appearance.setClarity(t.group,0)}}get reduced(){return Object.values(this.motion).every(e=>!e)}modelClarity(){return this.motion.modelDecryption?this.decryption.clarity:this.targetDetail}setQuality(e){const t=typeof e=="boolean"?Kn(void 0,e):Kn(e),i=JSON.stringify(t);if(this.appliedQuality===i)return;if(this.appliedQuality=i,this.quality=t,t.aoSamples&&t.aoSamples!==this.aoKernelSize){const r=this.ao;this.ao=new Cu(this.scene,this.camera,1,1,t.aoSamples),this.ao.kernelRadius=r.kernelRadius,this.ao.minDistance=r.minDistance,this.ao.maxDistance=r.maxDistance;const a=this.composer.passes.indexOf(r);this.composer.removePass(r),this.composer.insertPass(this.ao,a),r.dispose(),this.aoKernelSize=t.aoSamples}this.ao.enabled=t.aoSamples>0,this.bokeh.enabled=t.depthOfField>0,this.smaa.enabled=t.antialias==="smaa",this.renderer.shadowMap.enabled=t.shadows>0;const s=Math.min(t.shadows||1024,this.renderer.capabilities.maxTextureSize);this.light.shadow.mapSize.x!==s&&(this.light.shadow.map?.dispose(),this.light.shadow.map=null,this.light.shadow.mapSize.set(s,s)),this.light.shadow.needsUpdate=!0,qc(this.scene,this.renderer,t),this.resize()}cellPosition(e){return new P((e.lane-2)*gi,-4.6,(e.row-15.5)*Ai)}rebaseCoordinates(){const e={lane:Math.abs(this.selectedCell.lane)>2048?Math.round((this.selectedCell.lane-2)/5)*5:0,row:Math.abs(this.selectedCell.row)>2048?Math.floor((this.selectedCell.row-12)/8)*8:0};if(!(!e.lane&&!e.row)){this.setHover(null),this.hoverLifts.clear(),this.selectedCell.lane-=e.lane,this.selectedCell.row-=e.row,this.coordinateOrigin.lane+=e.lane,this.coordinateOrigin.row+=e.row,this.laneFocus.value-=e.lane,this.shoulder.value-=e.row,this.columnCamera.value-=e.lane*gi,this.rail.value+=e.row*Ai;for(const t of this.outgoing)t.cell.lane-=e.lane,t.cell.row-=e.row;for(const t of this.pulses)t.lane-=e.lane,t.row-=e.row;this.pendingPulse&&(this.pendingPulse.lane-=e.lane,this.pendingPulse.row-=e.row)}}select(e,t){this.navigatingDrag||this.cancelPointer(),this.setHover(null),this.lastInteraction=this.clock;const i=qi(e).slot,s=qi(e),r=this.looping?j_(e,this.selectedCell,t):{lane:s.lane,row:s.row},a=!yr(r,this.selectedCell);if(this.looping&&a&&this.loaded&&this.lift.value>1e-4){const l=this.model.clone(!0),c=l.children[l.children.length-1],h=document.createElement("canvas");h.width=1024,h.height=440,h.getContext("2d").drawImage(this.labelCanvas,0,0);const u=new wl(h);u.colorSpace=Lt,c.material=new Yi({map:u,toneMapped:!1,transparent:!0,depthWrite:!1}),this.appearance.prepare(l),this.appearance.apply(l,Et(this.lift.value/.4)),this.appearance.setClarity(l,this.modelClarity()),this.scene.add(l),this.outgoing.push({group:l,slot:this.selectedSlot,cell:{...this.selectedCell},lift:{...this.lift},returnY:l.rotation.y!==0?l.position.y:null,clarity:this.modelClarity()}),this.lift.value=0,this.lift.velocity=0}this.selectedSlot=i,this.selectedCell=r,a&&(this.decryption.select(),this.rotation=0,this.returnY=null);const o=this.outgoing.findIndex(l=>yr(l.cell,r));if(o>=0){const l=this.outgoing[o];this.lift={...l.lift},this.rotation=l.group.rotation.y,this.returnY=l.returnY,this.decryption.select(l.clarity),this.scene.remove(l.group),this.appearance.dispose(l.group),this.outgoing.splice(o,1)}this.deferSelectionPulse?this.pendingPulse=this.looping?{...r}:null:this.emitPulse(r),this.targetRotation=0,this.drawLabel(e)}emitPulse(e){this.pulses.push({...e,time:this.clock}),this.pulses=this.pulses.slice(-6)}drawLabel(e){if(!this.labelTexture)return;const t=this.labelCanvas.getContext("2d");t.fillStyle="#e6e2d9",t.fillRect(0,0,1024,440),t.fillStyle="#171713",t.fillRect(12,12,1e3,6),t.fillRect(12,419,1e3,3),t.font="bold 66px MiSans",t.fillText("ASTRAL EXPRESS",22,116),t.font="32px MiSans",t.fillStyle="#878476",t.fillText("INTERNAL DATABASE",25,174),t.fillStyle="#171713",t.font="bold 130px MiSans",t.fillText("NO."+String(e+1).padStart(3,"0"),22,360),t.fillRect(782,32,221,39),t.fillStyle="#eee9de",t.font="24px MiSans",t.fillText("A E / I S",809,61),t.fillStyle="#171713",t.font="bold 64px MiSans",t.fillText("INFO",830,143),t.drawImage(this.labelMark,790,242,210,98),this.labelTexture.needsUpdate=!0}ensureInstanceCapacity(e){if(e<=this.instanceCapacity)return;const t=Math.max(e,this.instanceCapacity*2),i=new Us(new Float32Array(t*16),16).setUsage(oa);i.array.set(this.instances[0].instanceMatrix.array);for(const r of this.instances)r.dispose(),r.instanceMatrix=i;const s=this.themeAttribute;this.themeAttribute=new Us(new Float32Array(t),1).setUsage(oa),s&&this.themeAttribute.array.set(s.array);for(const r of this.instances)r.geometry.setAttribute("archiveTheme",this.themeAttribute);this.matrixUpdates=new Ua(i),this.themeUpdates=new Ua(this.themeAttribute),this.instanceCapacity=t}resize(){this.renderState.invalidate();const e=this.container.clientWidth,t=this.container.clientHeight,i=this.container.closest("[data-layout]")?.dataset.layout??"",s=this.container.getBoundingClientRect().height;this.layoutKind==="cinematic"&&i!=="cinematic"&&this.displayHeight>0&&(this.camera.fov=Ne.radToDeg(2*Math.atan(Math.tan(Ne.degToRad(this.camera.fov/2))*s/this.displayHeight))),this.displayHeight=s,this.layoutKind=i;const r=cp(this.renderer,this.composer,this.container,this.quality,this.superPerformance);this.ao.setSize(Math.max(1,Math.floor(r.width*this.quality.aoResolution)),Math.max(1,Math.floor(r.height*this.quality.aoResolution))),this.ao.setSharing(this.ao.enabled&&this.bokeh.enabled&&this.quality.aoResolution===1&&!this.superPerformance),this.container.dataset.renderQuality=JSON.stringify({...JSON.parse(this.container.dataset.renderQuality),aoSamples:this.ao.enabled?this.aoKernelSize:0,aoWidth:this.ao.width,aoHeight:this.ao.height,shadows:this.renderer.shadowMap.enabled?this.light.shadow.mapSize.x:0,depthOfField:this.bokeh.enabled?this.quality.depthOfField:0}),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}canBrowse(){return this.presenceTarget===1&&this.looping&&!this.targetDetail&&this.detail<.2&&this.reveal>=.8&&this.loaded&&!this.container.closest("[inert]")}setHover(e){!e&&!this.hoverCell||e&&this.hoverCell&&yr(e,this.hoverCell)||(this.hoverCell=e?{...e}:null,this.onHover?.(e?Ol(e):null))}pickCell(e,t){const i=this.renderer.domElement.getBoundingClientRect();this.cursor.set((e-i.left)/i.width*2-1,-(t-i.top)/i.height*2+1),this.raycaster.setFromCamera(this.cursor,this.camera);const s=this.raycaster.intersectObjects([this.instances[0],this.model,...this.outgoing.map(a=>a.group)],!0)[0];if(!s)return null;if(s.instanceId!==void 0)return{...this.drawnCells[s.instanceId]};let r=s.object;for(;r;){const a=this.outgoing.find(o=>o.group===r);if(a)return{...a.cell};r=r.parent}return{...this.selectedCell}}trackCoordinate(e,t){return e==="lane"?t/gi+2:(-t-2.17)/Ai+15.5}dragProjection(){this.model.updateMatrixWorld(!0),this.camera.updateMatrixWorld(!0);const e=this.model.localToWorld(new P(0,1.85,0)),t=this.renderer.domElement.getBoundingClientRect(),i=s=>{const r=e.clone().addScaledVector(s,-.5).project(this.camera),a=e.clone().addScaledVector(s,.5).project(this.camera);return{x:(a.x-r.x)*t.width/2,y:-(a.y-r.y)*t.height/2}};return{lane:i(new P(-gi,0,0)),row:i(new P(0,0,-Ai))}}trackPosition(e,t){return e==="lane"?(t-2)*gi:-2.17-(t-15.5)*Ai}navigatePlane(e){const t={lane:Math.round(e.lane),row:Math.round(e.row)};if(yr(t,this.selectedCell))return;const i={...this.selectedCell},s=Math.min(64,Math.max(Math.abs(t.lane-i.lane),Math.abs(t.row-i.row)));this.navigatingDrag=!0;try{for(let r=1;r<=s;r++){const a={lane:Math.round(i.lane+(t.lane-i.lane)*r/s),row:Math.round(i.row+(t.row-i.row)*r/s)};yr(a,this.selectedCell)||this.onSelect?.(Ol(a),a)}}finally{this.navigatingDrag=!1}}stopMomentum(){this.archiveMomentum&&(this.columnCamera.velocity=0,this.rail.velocity=0),this.archiveMomentum=null}bindPointer(){const e=this.renderer.domElement;let t=null,i=0,s=0,r=0,a=!1,o=!1,l=!1,c={lane:0,row:0},h=0,u=0;const d=new Set,f=p=>{if(p.pointerType!=="mouse"||!this.canBrowse()||this.archiveMomentum)return;const g=e.getBoundingClientRect();this.pointer.set((p.clientX-g.left)/g.width-.5,(p.clientY-g.top)/g.height-.5);const _=this.pickCell(p.clientX,p.clientY);this.setHover(_),e.style.cursor=_?"pointer":"grab"},m=()=>{const p=t;t=null,this.dragging=!1,this.dragTrack=null,this.holdingArchive=!1,o=!1,this.setHover(null),e.style.cursor=this.canBrowse()?"grab":"default",p!==null&&e.hasPointerCapture(p)&&e.releasePointerCapture(p)};this.cancelPointer=()=>{l=!0,this.stopMomentum(),d.clear(),h=0,m()};const A=p=>{const g=!this.archiveDrag.active;for(const _ of p.getCoalescedEvents?.()??[])this.archiveDrag.move(_.clientX,_.clientY,_.timeStamp);this.archiveDrag.move(p.clientX,p.clientY,p.timeStamp),a||=this.archiveDrag.moved,this.archiveDrag.active&&(g&&(c={lane:this.columnCamera.value,row:this.rail.value}),this.setHover(null),this.lastInteraction=this.clock,e.style.cursor="grabbing",this.dragTrack={lane:c.lane+this.archiveDrag.value.lane*gi,row:c.row-this.archiveDrag.value.row*Ai},this.columnCamera.value=this.dragTrack.lane,this.rail.value=this.dragTrack.row,this.columnCamera.velocity=this.rail.velocity=0,this.navigatePlane({lane:this.trackCoordinate("lane",this.columnCamera.value),row:this.trackCoordinate("row",this.rail.value)}))};e.addEventListener("pointerdown",p=>{if(!(p.pointerType==="mouse"&&p.button!==0)&&!(!this.canBrowse()&&!this.canInspect)){if(d.add(p.pointerId),d.size>1){l=!0,m();return}t=p.pointerId,l=!1,a=this.archiveMomentum!==null,s=i=p.clientX,r=p.clientY,o=this.canBrowse(),this.stopMomentum(),o&&(this.columnCamera.velocity=0,this.rail.velocity=0),this.holdingArchive=o,this.dragging=!o&&this.canInspect,c={lane:this.columnCamera.value,row:this.rail.value},this.archiveDrag.start(p.clientX,p.clientY,this.dragProjection(),p.timeStamp),this.setHover(null),e.setPointerCapture(p.pointerId),this.relayActive&&(this.holdingArchive=!1,this.dragging=!1)}},{signal:this.inputEvents.signal}),e.addEventListener("pointermove",p=>{if(this.relayActive){p.pointerId===t&&(a||=Math.hypot(p.clientX-s,p.clientY-r)>7);return}if(!(t!==null&&p.pointerId!==t)){if(t===null){f(p);return}if(!l){if(a||=Math.hypot(p.clientX-s,p.clientY-r)>7,o){if(!this.canBrowse()){this.cancelPointer();return}A(p);return}this.dragging&&this.canInspect&&(this.targetRotation=Ne.clamp(this.targetRotation+(p.clientX-i)*.004,-.8,.8),i=p.clientX)}}},{signal:this.inputEvents.signal}),e.addEventListener("pointerup",p=>{if(d.delete(p.pointerId),p.pointerId===t){if(this.relayActive){if(!l&&!a){const g=this.pickCell(p.clientX,p.clientY);this.onRelayPick?.(g?ln(g):null)}m();return}if(!l&&o&&this.canBrowse()){if(A(p),this.archiveDrag.active)this.motion.dragMomentum&&(this.archiveMomentum={time:performance.now()/1e3,motion:new oy({lane:this.trackCoordinate("lane",this.columnCamera.value),row:this.trackCoordinate("row",this.rail.value)},this.archiveDrag.releaseVelocity(p.timeStamp,!1))});else if(!a){const g=this.pickCell(p.clientX,p.clientY);g&&this.onSelect?.(Ol(g),g)}}m()}},{signal:this.inputEvents.signal}),e.addEventListener("pointercancel",p=>{d.delete(p.pointerId),p.pointerId===t&&(l=!0,m())},{signal:this.inputEvents.signal}),e.addEventListener("lostpointercapture",p=>{d.delete(p.pointerId),p.pointerId===t&&(l=!0,m())},{signal:this.inputEvents.signal}),e.addEventListener("pointerleave",()=>{this.pointer.set(0,0),this.setHover(null)},{signal:this.inputEvents.signal}),e.addEventListener("wheel",p=>{if(this.relayActive){p.preventDefault();return}if(!this.canBrowse()||t!==null||p.ctrlKey||Math.abs(p.deltaX)>Math.abs(p.deltaY))return;p.preventDefault(),this.archiveMomentum&&this.stopMomentum();const g=performance.now(),_=Ne.clamp(p.deltaY*(p.deltaMode===1?40:p.deltaMode===2?e.clientHeight:1),-300,300);(g-u>180||Math.sign(_)!==Math.sign(h))&&(h=0),u=g,h+=_;const E=Math.min(3,Math.floor(Math.abs(h)/100));if(!E)return;const M=Math.sign(h);h-=M*E*100,this.navigatingDrag=!0;try{for(let b=0;b<E;b++)this.onNavigate?.("row",M)}finally{this.navigatingDrag=!1}},{passive:!1,signal:this.inputEvents.signal}),window.addEventListener("blur",()=>this.cancelPointer(),{signal:this.inputEvents.signal}),document.addEventListener("visibilitychange",()=>{document.hidden&&this.cancelPointer()},{signal:this.inputEvents.signal}),window.addEventListener("resize",()=>this.cancelPointer(),{signal:this.inputEvents.signal}),window.addEventListener("pointerup",p=>d.delete(p.pointerId),{signal:this.inputEvents.signal}),window.addEventListener("pointercancel",p=>d.delete(p.pointerId),{signal:this.inputEvents.signal})}update(e,t){const i=Math.max(0,e-this.last||.016),s=Math.min(i,.05);if(this.last=e,this.clock=e,!this.loaded)return;const r=this.motion.surfaceTransitions?Math.min(i,.25)/1.1:1;this.presence+=Math.sign(this.presenceTarget-this.presence)*Math.min(r,Math.abs(this.presenceTarget-this.presence)),this.renderer.domElement.style.opacity=String(Ne.clamp(this.presence/.16,0,1)),this.theme.beginFrame(),ep(this.scene,this.renderer,this.themeAmount);const a=1-Math.exp(-s*(this.motion.selectionTransition?2.8:35)),o=1-Math.exp(-s*(this.motion.detailTransition?2.8:35));this.reveal=t?t.reveal:Ne.lerp(this.reveal,this.targetReveal,a),this.rotation=this.targetDetail?Ne.lerp(this.rotation,this.targetRotation,o):Wu(this.rotation,s,!this.motion.detailTransition);const l=t?.time??29.1;t?(this.scanTime=l,this.scanBlend=1):(this.scanTime+=s,this.scanBlend*=Math.exp(-s*3)),this.canBrowse()||(this.setHover(null),(this.holdingArchive||this.archiveMomentum)&&this.cancelPointer()),this.looping&&!t&&!this.holdingArchive&&!this.archiveMomentum&&this.rebaseCoordinates();const c=t?null:this.archiveMomentum;c&&(c.motion.step(Math.min(Math.max(e-c.time,0),.25)),c.time=e,this.navigatePlane(c.motion.value),this.lastInteraction=e);const h=!t&&this.hoverCell?ln(this.hoverCell):null;h&&!this.hoverLifts.has(h)&&this.hoverLifts.set(h,0);for(const[T,I]of this.hoverLifts){const X=T===h?.28:0,z=t?0:this.motion.selectionTransition?Ne.lerp(I,X,1-Math.exp(-s*14)):X;X===0&&z<1e-4?this.hoverLifts.delete(T):this.hoverLifts.set(T,z)}const u=T=>this.hoverLifts.get(ln(T))??0,d=this.cellPosition(this.selectedCell),f=this.selectedCell.row,m=this.selectedCell.lane;Sn(this.shoulder,f,this.motion.selectionTransition?5:35,s),Sn(this.laneFocus,m,this.motion.selectionTransition?4:35,s),!this.holdingArchive&&!c&&(Sn(this.columnCamera,d.x,this.motion.selectionTransition?3.7:35,s),Sn(this.rail,t?0:-2.17-d.z,this.motion.selectionTransition?3.7:35,s)),c&&(this.columnCamera.value=this.trackPosition("lane",c.motion.lane.value),this.rail.value=this.trackPosition("row",c.motion.row.value),this.columnCamera.velocity=c.motion.lane.velocity*gi,this.rail.velocity=-c.motion.row.velocity*Ai,c.motion.phase==="idle"&&(this.archiveMomentum=null)),this.dragTrack&&!t&&(this.columnCamera.value=this.dragTrack.lane,this.rail.value=this.dragTrack.row,this.columnCamera.velocity=this.rail.velocity=0),t&&(this.rail.value=0,this.rail.velocity=0,this.lift.value=dy(l),this.lift.velocity=0,this.shoulder.value=f,this.laneFocus.value=m,this.laneFocus.velocity=0,this.columnCamera.value=d.x,this.columnCamera.velocity=0);const A=t?0:this.columnCamera.value;this.pulses=this.pulses.filter(T=>e-T.time<3.2);const p=this.outgoing.some(T=>T.returnY!==null),g=!t&&this.motion.idleWave&&this.targetReveal>0&&!this.targetDetail&&this.detail<.01&&this.returnY===null&&!p&&e-this.lastInteraction>2.5;this.idleGain=t?0:Ne.lerp(this.idleGain,g?this.playfield.enabled?this.playfield.breathing&&!this.relayActive?1-this.playfield.bands.activity:0:1:0,1-Math.exp(-s*(g?.8:4))),this.pulseGain=Ne.lerp(this.pulseGain,this.targetDetail||this.returnY!==null||p?0:1,1-Math.exp(-s*8));const _=this.playfield,E=!t&&!this.targetDetail&&_.enabled,M=this.rhythm.update(E&&!this.reduced?_.bands:Lu(),e,s,this.rhythmStyle);this.flatMix+=((E?_.flatten:0)-this.flatMix)*(this.reduced?1:1-Math.exp(-s*4)),this.subduedIndex.value=Math.max(Number(this.selectedIndexOnly),this.flatMix);const b=T=>this.selectedIndexOnly?1-Et(T/.4)*(1-this.flatMix):this.flatMix,w=E?_.target:null;w&&!this.relayLifts.has(w)&&this.relayLifts.set(w,0);for(const[T,I]of this.relayLifts){const X=I+((T===w?.95:0)-I)*(this.reduced?1:1-Math.exp(-s*8));X<.001&&T!==w?this.relayLifts.delete(T):this.relayLifts.set(T,X)}const D=new P,x=(T,I)=>(D.set((I-2)*gi-A,-4.6,(T-15.5)*Ai+this.rail.value).project(this.camera),(D.x+1)/2),S=(T,I)=>{if(t)return my(T,I,l,this.shoulder.value,this.laneFocus.value);const X=pp(T+this.coordinateOrigin.row,I+this.coordinateOrigin.lane,this.scanTime)*this.scanBlend,z=py(T+this.coordinateOrigin.row,I+this.coordinateOrigin.lane,e)*this.idleGain;let oe=0;if(!t&&this.motion.selectionWave){let de=0;for(const be of this.pulses){const te=Math.hypot(T-be.row,(I-be.lane)*2.2),re=e-be.time;de+=this.selectionPulse(te,re)*(this.deferSelectionPulse?fy(te,re):1)}oe=Ne.clamp(de,-.6,.6)*this.pulseGain}const ee=T-this.shoulder.value;return(X+Kc(ee,26.56)*mp(I,this.laneFocus.value))*(1-this.flatMix)+z+oe+(E&&!this.reduced?hM(T,I,e,_.bands,_.strength,M,x(T,I)):0)+(this.relayLifts.get(ln({row:T,lane:I}))??0)},N=d.y+S(f,m);t||(this.returnY!==null&&this.rotation!==0?(this.lift.value=this.returnY-N,this.lift.velocity=0):(this.returnY=null,Sn(this.lift,this.targetDetail?Gu:this.outgoing.some(T=>T.returnY!==null&&T.cell.lane===m&&Math.abs(T.cell.row-f)<5)?0:.4*this.targetReveal*(1-this.flatMix),this.motion.detailTransition?this.deferSelectionPulse&&!this.targetDetail&&this.lift.value<.4?7.6:4.2:35,s)));const R=this.targetDetail?Et((this.lift.value-.8)/2.4):this.returnY!==null?this.detail:Et((this.lift.value-.4)/(Gu-.4));this.detail=t?t.zoom:Ne.lerp(this.detail,R,o);const U=this.detail;this.decryption.update(s,U>.78&&this.lift.value>3.3,!1,t?l+5:void 0),this.appearance.apply(this.model,Et(this.lift.value/.4)),this.appearance.setClarity(this.model,this.modelClarity());const H=t?Et((l-21.9)/.86):this.reveal,j=Ne.clamp((l-21.92)/.75,0,1),V=t?-23*(1-j)**2:-28*(1-H);for(let T=this.outgoing.length-1;T>=0;T--){const I=this.outgoing[T],X=this.cellPosition(I.cell),z=X.y+S(I.cell.row,I.cell.lane);I.group.rotation.y=Wu(I.group.rotation.y,s,!this.motion.detailTransition),I.returnY!==null?(I.lift.value=I.returnY-z,I.lift.velocity=0,I.group.rotation.y===0&&(I.returnY=null)):Sn(I.lift,0,this.motion.detailTransition?4.5:35,s),I.group.position.set(X.x-A,z+I.lift.value+u(I.cell)-this.presentationDrop(I.cell),X.z+V+this.rail.value);const oe=Et(I.lift.value/.4);this.appearance.apply(I.group,oe),this.appearance.setTheme(I.group,this.theme.sample(I.cell,e),b(I.lift.value)),I.clarity=this.motion.modelDecryption?I.clarity*Math.exp(-s*9):0,this.appearance.setClarity(I.group,I.clarity);const{row:ee,lane:de}=I.cell;I.group.rotation.x=(S(ee+.5,de)-S(ee-.5,de))*.024*(1-U)*(1-oe),I.lift.value<1e-4&&Math.abs(I.group.rotation.y)<1e-4&&(this.scene.remove(I.group),this.appearance.dispose(I.group),this.outgoing.splice(T,1))}if(this.pendingPulse&&!t&&!this.targetDetail&&this.targetReveal){const T=N+this.lift.value,I=this.outgoing.every(X=>X.cell.lane!==m||Math.abs(X.cell.row-f)>4||X.group.position.y+.015<T);this.lift.value>=.35&&this.returnY===null&&I&&(this.motion.selectionWave&&this.emitPulse(this.pendingPulse),this.pendingPulse=null)}this.appearance.setTheme(this.model,this.theme.sample(this.selectedCell,e),b(this.lift.value)),this.model.position.set(d.x-A,d.y+S(f,m)+this.lift.value+u(this.selectedCell)-this.presentationDrop(this.selectedCell),d.z+V+this.rail.value),this.model.rotation.set((S(f+.5,m)-S(f-.5,m))*.024*(1-U)*(1-Et(this.lift.value/.4)),t?0:this.rotation,0);const k=Et((l-22.6)/1.6),B=Et((l-24.25)/2.25),$=Ne.degToRad(89-22*k-8*B),K=Ne.degToRad(3+40*Et((l-21.96)/.22)-8*k-16*B),ae=Ne.lerp(Ne.lerp(10.8,10.3,k),7.33,B),he=!!t&&this.container.closest("[data-layout]")?.dataset.layout==="opening",ce=he?this.container.clientWidth/this.container.clientHeight/(16/9):1,Le=T=>T/Math.min(1,ce),tt=Ne.lerp(Ne.lerp(28+7*k,140,B),72,U),q=new P(-1.091,Ne.lerp(-2.55+.4*k,-.045,B),Ne.lerp(2.48,.481,B)).clone(),J=new P(-Math.sin($)*Math.cos(K),Math.sin(K),Math.cos($)*Math.cos(K));if(t){const T=Et((l-27.3)/1.3),I=Et((l-28.6)/5.4),X=$-Ne.degToRad(9*T+32*I),z=K-Ne.degToRad(1.5*T+3.7*I);J.set(-Math.sin(X)*Math.cos(z),Math.sin(z),Math.cos(X)*Math.cos(z))}else J.lerp(new P(-.277,.238,.931),U).normalize();if(t){const T=Et((l-25.4)/.95),I=new P().crossVectors(new P(0,1,0),J).normalize();q.addScaledVector(I,-2.05*(1-T)*Et((l-24.2)/.8))}if(t&&l>=25.05&&l<=27.3){const T=Et((l-25.4)/1.05),I=new P().crossVectors(new P(0,1,0),J).normalize(),X=new P().crossVectors(J,I).normalize(),z=1080/Le(ae),oe=this.model.position.clone().add(new P(-2.5,3.7,0));oe.addScaledVector(I,-(Ne.lerp(840,518,T)-960)*ce/z),oe.addScaledVector(X,-(540-Ne.lerp(340,288,T))/z),q.lerp(oe,Et((l-25.05)/.35))}if(t&&l>27.3){const T=Et((l-27.3)/6.7),I=Et((l-27.3)/1.25),X=Ne.lerp(518-98*I,618,T),z=Ne.lerp(296+34*I,287,T),oe=1080/Le(Ne.lerp(ae,5.9,U)),ee=new P().crossVectors(new P(0,1,0),J).normalize(),de=new P().crossVectors(J,ee).normalize(),be=this.model.position.clone().add(new P(-2.5,3.7,0));be.addScaledVector(ee,-(X-960)*ce/oe),be.addScaledVector(de,-(540-z)/oe),q.lerp(be,Et((l-27.3)/.5))}const ie=D0(this.container.clientWidth,this.container.clientHeight,ae,U,this.container.closest("[data-layout]")?.dataset.layout==="compact");if(!t){const T=new P().crossVectors(new P(0,1,0),J).normalize(),I=new P().crossVectors(J,T).normalize(),X=this.container.clientWidth,z=this.container.clientHeight,oe=z/ie.span;if(ie.portrait){const de=new P(0,-4.6+Kc(0,26.56)+.4+1.85,-2.17);de.addScaledVector(I,(ie.previewY-.5)*z/oe),q.copy(de)}const ee=this.model.position.clone().add(new P(0,1.85,0));ee.addScaledVector(T,(.5-ie.detailX)*X/oe),ee.addScaledVector(I,(ie.detailY-.5)*z/oe),q.lerp(ee,U)}const Pe=q.clone().addScaledVector(J,tt);!t&&this.motion.pointerParallax&&!this.uiOnlyParallax&&(Pe.x+=this.pointer.x*.12,Pe.y-=this.pointer.y*.12);const ye=this.targetDetail||this.detail>.01?this.motion.detailTransition:this.motion.selectionTransition,Ie=t?1:ye?1-Math.exp(-s*5):1;this.camera.position.lerp(Pe,Ie),this.cameraAim.lerp(q,Ie),this.camera.lookAt(this.cameraAim),this.camera.fov=Ne.lerp(this.camera.fov,Ne.radToDeg(2*Math.atan((t?Le(Ne.lerp(ae,5.9,U)):ie.span)/(2*tt))),Ie);const ft=this.scene.fog,Xe=this.camera.position.distanceTo(this.cameraAim),Je=this.themeAmount;ft.near=Xe+Ne.lerp(5-4*Je,-1,U),ft.far=Xe+Ne.lerp(25-9*Je,12,U),this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld();const it=(!!t||!this.looping)&&!he;this.cells=it?Array.from({length:160},(T,I)=>Ul(I)):this.visibility.update(this.camera,ft.far,A,V+this.rail.value,this.extraCoverage);const Be=new Set(this.outgoing.map(T=>ln(T.cell)));Be.add(ln(this.selectedCell)),this.drawnCells=[],this.relayPoints.clear(),this.matrixUpdates??=new Ua(this.instances[0].instanceMatrix),this.themeAttribute&&(this.themeUpdates??=new Ua(this.themeAttribute));for(const T of this.cells){const{row:I,lane:X}=T;if(Be.has(ln(T)))continue;const z=(X-2)*gi-A,oe=-4.6+S(I,X)+u(T)-this.presentationDrop(T),ee=(I-15.5)*Ai+V+this.rail.value;if(!it&&!this.visibility.intersects(z,oe,ee))continue;const de=this.drawnCells.length;this.ensureInstanceCapacity(de+1),this.drawnCells.push(T),this.themeUpdates?.scalar(de,this.theme.sample(T,e));const be=S(I+.5,X)-S(I-.5,X);this.dummy.position.set(z,oe,ee),this.dummy.rotation.set(be*.024*(1-U),0,0),this.dummy.scale.setScalar(1),this.dummy.updateMatrix(),_.enabled&&this.relayPoints.set(ln(T),{cell:{...T},point:new P(0,3.5,0).applyMatrix4(this.dummy.matrix)}),this.matrixUpdates.set(de*16,this.dummy.matrix.elements)}const At=this.instances[0].count!==this.drawnCells.length,L=this.matrixUpdates.commit();for(const T of this.instances)T.count=this.drawnCells.length;(L||At||!this.instances[0].boundingSphere)&&this.instances[0].computeBoundingSphere(),this.themeUpdates?.commit();let ot=-1/0;const Qe=m,et=f;for(let T=et-5;T<=et+5;T++)T!==et&&(ot=Math.max(ot,-4.6+S(T,Qe)+3.76));for(const T of this.outgoing)T.cell.lane===Qe&&Math.abs(T.cell.row-et)<=5&&(ot=Math.max(ot,T.group.position.y+3.76));this.clearance=this.model.position.y-ot,this.canInspect=!t&&!!this.targetDetail&&U>.9&&this.pulseGain<.01&&this.clearance>.3,this.container.dataset.inspection=this.returnY!==null?"aligning":this.canInspect?"ready":this.targetDetail?"lifting":"preview";const Ae=this.model.position.clone().add(new P(0,2,0)).applyMatrix4(this.camera.matrixWorldInverse),C=this.bokeh.uniforms;C.focus.value=-Ae.z,C.aperture.value=Ne.lerp(3e-4,8e-4,U)*this.quality.depthOfField/100,this.renderer.info.reset();const v=this.renderState;if(this.scene.updateMatrixWorld(),L||t)v.invalidate();else if(v.begin(),v.floats(...this.camera.projectionMatrix.elements,...this.camera.matrixWorldInverse.elements,...this.camera.position.toArray(),ft.near,ft.far,this.themeAmount,this.subduedIndex.value,C.focus.value,C.aperture.value),this.scene.traverse(T=>{if(v.add(T.id,Number(T.visible)),!(T instanceof at))return;T.modelViewMatrix.multiplyMatrices(this.camera.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),v.floats(...T.modelViewMatrix.elements,...T.normalMatrix.elements,...T.matrixWorld.elements);const I=T.material;v.add(T.geometry.id,I.uuid,I.map?.uuid,I.map?.version??0),v.floats(I.opacity,I.roughness,I.metalness,I.transmission,I.thickness,I.attenuationDistance,I.clearcoat,I.clearcoatRoughness,I.color.r,I.color.g,I.color.b,I.attenuationColor?.r??0,I.attenuationColor?.g??0,I.attenuationColor?.b??0);for(const X of["appearance","glassClarity","themeAmount","subduedIndex"])v.floats(T.userData[X]?.value??0);T instanceof Gr&&v.add(T.count,T.instanceMatrix.version,this.themeAttribute?.version??0)}),!v.end()){this.reusedFrames++;return}this.renderedFrames++,this.renderer.shadowMap.needsUpdate=!0,this.superPerformance?this.renderer.render(this.scene,this.camera):this.composer.render()}projectCard(e,t){this.model.updateMatrixWorld(!0);const i=this.model.localToWorld(new P(e,t,.255)).project(this.camera);return[(i.x+1)*this.container.clientWidth/2,(1-i.y)*this.container.clientHeight/2]}get decryptionFrame(){return this.decryption.frame}finishDecryption(){this.decryption.finish()}get detailVisibility(){return Et((this.detail-.25)/.55)}getStats(){this.model.updateMatrixWorld(!0);const e=(t,i,s)=>{const r=this.model.localToWorld(new P(t,i,s)).project(this.camera);return[Math.round((r.x+1)*this.container.clientWidth/2),Math.round((1-r.y)*this.container.clientHeight/2)]};return{decryption:{...this.decryption.frame,clarity:this.decryption.clarity,modelClarity:this.modelClarity()},topLeft:e(-2.5,3.7,0),topRight:e(2.5,3.7,0),labelTopLeft:e(-1.855,3.27,.255),labelBottomLeft:e(-1.855,2.81,.255),modelPosition:this.model.position.toArray().map(t=>Math.round(t*1e4)/1e4),cameraPosition:this.camera.position.toArray().map(t=>Math.round(t*1e4)/1e4),fieldOfView:this.camera.fov,loaded:this.loaded,drawCalls:this.renderer.info.render.calls,renderedFrames:this.renderedFrames,reusedFrames:this.reusedFrames,superPerformance:this.superPerformance,presentation:this.presence,triangles:this.renderer.info.render.triangles,archiveCount:this.drawnCells.length,archiveCandidates:this.cells.length,archiveCulled:this.cells.length-this.drawnCells.length,archiveCapacity:this.instanceCapacity,archiveCoverage:this.extraCoverage?"extra":"standard",returningFiles:this.outgoing.length,selectionPhase:this.pendingPulse?"lifting":this.pulses.length?"wave":"settled",pendingPulse:this.pendingPulse?{...this.pendingPulse}:null,pulses:this.pulses.map(t=>({...t})),referenceTime:Math.round((this.scanTime+5)*100)/100,selectedSlot:this.selectedSlot,selectedLane:Math.floor(this.selectedSlot/32),selectedCell:{...this.selectedCell},hoverCell:this.hoverCell?{...this.hoverCell}:null,hoverLifts:Object.fromEntries(this.hoverLifts),dragTrack:this.dragTrack?{...this.dragTrack}:null,archiveMomentum:this.archiveMomentum?{phase:this.archiveMomentum.motion.phase,value:this.archiveMomentum.motion.value,velocity:this.archiveMomentum.motion.velocity}:null,holdingArchive:this.holdingArchive,dragProjection:this.dragProjection(),dragMapping:this.archiveDrag.active?"free":null,coordinateOrigin:{...this.coordinateOrigin},poolBounds:{minLane:Math.min(...this.cells.map(t=>t.lane)),maxLane:Math.max(...this.cells.map(t=>t.lane)),minRow:Math.min(...this.cells.map(t=>t.row)),maxRow:Math.max(...this.cells.map(t=>t.row))},laneFocus:this.laneFocus.value,columnCamera:this.columnCamera.value,rotation:this.rotation,clearance:this.clearance,canInspect:this.canInspect,returnPhase:this.returnY!==null?"aligning":"lowering",extraction:Math.round(this.lift.value*1e3)/1e3,appearance:Math.round(Et(this.lift.value/.4)*1e3)/1e3,cameraDetail:Math.round(this.detail*1e3)/1e3,idleGain:this.idleGain,flatten:this.flatMix,spectrumActivity:this.playfield.bands.activity,selectedIndexDim:this.model.children.find(t=>t.userData.surface==="Index_Inlay")?.userData.subduedIndex?.value,returningIndexDims:this.outgoing.map(t=>({cell:t.cell,dim:t.group.children.find(i=>i.userData.surface==="Index_Inlay")?.userData.subduedIndex?.value})),cameraDistance:this.camera.position.distanceTo(this.cameraAim),cameraNear:this.camera.near,cameraFar:this.camera.far,fogNear:this.scene.fog.near,fogFar:this.scene.fog.far,returningAppearance:this.outgoing.map(t=>({slot:t.slot,clarity:t.group.children.find(i=>i.userData.surface==="Frosted_Polymer")?.userData.glassClarity?.value,cell:{...t.cell},lift:t.lift.value,quality:Et(t.lift.value/.4),rotation:t.group.rotation.y,worldY:t.group.position.y,phase:t.returnY!==null?"aligning":"lowering"})),rail:Math.round(this.rail.value*1e3)/1e3}}}const Xu={type:"change"},Bh={type:"start"},gp={type:"end"},Xa=new tr,Yu=new bn,vy=Math.cos(70*Ne.DEG2RAD),Ot=new P,ni=2*Math.PI,gt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Gl=1e-6;class xy extends Xg{constructor(e,t=null){super(e,t),this.state=gt.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Is.ROTATE,MIDDLE:Is.DOLLY,RIGHT:Is.PAN},this.touches={ONE:Cn.ROTATE,TWO:Cn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Pi,this._lastTargetPosition=new P,this._quat=new Pi().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Nr,this._sphericalDelta=new Nr,this._scale=1,this._panOffset=new P,this._rotateStart=new De,this._rotateEnd=new De,this._rotateDelta=new De,this._panStart=new De,this._panEnd=new De,this._panDelta=new De,this._dollyStart=new De,this._dollyEnd=new De,this._dollyDelta=new De,this._dollyDirection=new P,this._mouse=new De,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=My.bind(this),this._onPointerDown=_y.bind(this),this._onPointerUp=yy.bind(this),this._onContextMenu=Ry.bind(this),this._onMouseWheel=Ey.bind(this),this._onKeyDown=wy.bind(this),this._onTouchStart=Ty.bind(this),this._onTouchMove=Cy.bind(this),this._onMouseDown=by.bind(this),this._onMouseMove=Sy.bind(this),this._interceptControlDown=Dy.bind(this),this._interceptControlUp=Py.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Xu),this.update(),this.state=gt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Ot.copy(t).sub(this.target),Ot.applyQuaternion(this._quat),this._spherical.setFromVector3(Ot),this.autoRotate&&this.state===gt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=ni:i>Math.PI&&(i-=ni),s<-Math.PI?s+=ni:s>Math.PI&&(s-=ni),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ot.setFromSpherical(this._spherical),Ot.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ot),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ot.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Ot.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Xa.origin.copy(this.object.position),Xa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Xa.direction))<vy?this.object.lookAt(this.target):(Yu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Xa.intersectPlane(Yu,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Gl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Gl||this._lastTargetPosition.distanceToSquared(this.target)>Gl?(this.dispatchEvent(Xu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ni/60*this.autoRotateSpeed*e:ni/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ot.setFromMatrixColumn(t,0),Ot.multiplyScalar(-e),this._panOffset.add(Ot)}_panUp(e,t){this.screenSpacePanning===!0?Ot.setFromMatrixColumn(t,1):(Ot.setFromMatrixColumn(t,0),Ot.crossVectors(this.object.up,Ot)),Ot.multiplyScalar(e),this._panOffset.add(Ot)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Ot.copy(s).sub(this.target);let r=Ot.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ni*this._rotateDelta.x/t.clientHeight),this._rotateUp(ni*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ni*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ni*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ni*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ni*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ni*this._rotateDelta.x/t.clientHeight),this._rotateUp(ni*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new De,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function _y(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function My(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function yy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(gp),this.state=gt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function by(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Is.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=gt.DOLLY;break;case Is.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=gt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=gt.ROTATE}break;case Is.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=gt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=gt.PAN}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Bh)}function Sy(n){switch(this.state){case gt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case gt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case gt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Ey(n){this.enabled===!1||this.enableZoom===!1||this.state!==gt.NONE||(n.preventDefault(),this.dispatchEvent(Bh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(gp))}function wy(n){this.enabled!==!1&&this._handleKeyDown(n)}function Ty(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Cn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=gt.TOUCH_ROTATE;break;case Cn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=gt.TOUCH_PAN;break;default:this.state=gt.NONE}break;case 2:switch(this.touches.TWO){case Cn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=gt.TOUCH_DOLLY_PAN;break;case Cn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=gt.TOUCH_DOLLY_ROTATE;break;default:this.state=gt.NONE}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Bh)}function Cy(n){switch(this._trackPointer(n),this.state){case gt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case gt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case gt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case gt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=gt.NONE}}function Ry(n){this.enabled!==!1&&n.preventDefault()}function Dy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Py(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ly=n=>Math.atan2(Math.sin(n),Math.cos(n));class Iy{constructor(e){this.camera=e}camera;focus=new P;pose=new Nr;desired=new Nr;offset=new P;resetFrom=new Nr;resetFocus=new P;elapsed=0;resetting=!1;snap(e,t){this.resetting=!1,this.focus.copy(t),this.pose.setFromVector3(this.offset.copy(e.position).sub(t)),this.apply()}reset(){this.resetFrom.copy(this.pose),this.resetFocus.copy(this.focus),this.elapsed=0,this.resetting=!0}interruptReset(e,t){this.resetting&&(this.resetting=!1,e.position.copy(this.camera.position),t.copy(this.focus),e.lookAt(t))}update(e,t,i,s=!1){if(s){this.snap(e,t);return}if(this.desired.setFromVector3(this.offset.copy(e.position).sub(t)),this.resetting){this.elapsed+=Math.max(0,i);const r=Math.min(1,this.elapsed/.56),a=1-(1-r)**3;this.focus.lerpVectors(this.resetFocus,t,a),this.interpolate(this.resetFrom,this.desired,a,a),r===1&&(this.resetting=!1)}else{const r=1-Math.exp(-13*Math.max(0,i)),a=1-Math.exp(-9*Math.max(0,i)),o=1-Math.exp(-15*Math.max(0,i));this.focus.lerp(t,r),this.interpolate(this.pose,this.desired,a,o),this.focus.distanceToSquared(t)<1e-10&&this.focus.copy(t)}this.apply()}interpolate(e,t,i,s){this.pose.radius=Math.exp(Ne.lerp(Math.log(e.radius),Math.log(t.radius),s)),this.pose.phi=Ne.lerp(e.phi,t.phi,i),this.pose.theta=e.theta+Ly(t.theta-e.theta)*i,this.pose.makeSafe()}apply(){this.camera.position.copy(this.offset.setFromSpherical(this.pose)).add(this.focus),this.camera.lookAt(this.focus)}}const Wl=[{id:"fasteners",label:"紧固件",en:"FASTENERS",depth:2.75},{id:"cover",label:"透明盖板",en:"OPTICAL COVER",depth:1.85},{id:"optical-lenses",label:"折射环组",en:"REFRACTIVE RINGS",depth:.75},{id:"optical-core",label:"光学核心",en:"OPTICAL CORE",depth:-.15},{id:"substrate",label:"信息基板",en:"SUBSTRATE",depth:-1.1},{id:"carrier",label:"背板与框架",en:"CARRIER",depth:-2.05}];class Ny{constructor(e,t,i=()=>{}){this.onSound=i,this.onClose=t,this.root=document.createElement("section"),this.root.className="model-viewer",this.root.hidden=!0,this.root.setAttribute("role","dialog"),this.root.setAttribute("aria-modal","true"),this.root.setAttribute("aria-labelledby","viewer-title"),this.root.innerHTML=`
      <div class="viewer-canvas"></div>
      <div class="scene-atmosphere viewer-atmosphere" aria-hidden="true"></div>
      <header class="viewer-header">
        <button class="viewer-back" data-viewer="close">← <span>返回档案</span><kbd>ESC</kbd></button>
        <div class="viewer-heading"><span>ASTRAL EXPRESS / OBJECT STUDY</span><h2 id="viewer-title">档案模型</h2><p id="viewer-file"></p></div>
        <span class="viewer-index">360<span>°</span></span>
      </header>
      <div class="viewer-surface" role="group" aria-label="玻璃模式"><button data-viewer="clear" aria-pressed="true">清晰</button><button data-viewer="frosted" aria-pressed="false">磨砂</button></div>
      <aside class="viewer-parts" aria-label="模型装配结构"><div>ASSEMBLY / 装配结构</div>${Wl.map((s,r)=>`<p><span>${String(r+1).padStart(2,"0")}</span><strong>${s.label}</strong><small>${s.en}</small></p>`).join("")}</aside>
      <div class="viewer-loading" role="status"><span>正在载入模型…</span><button data-viewer="retry" hidden>重新载入 ↗</button></div>
      <footer class="viewer-footer">
        <div class="viewer-help"><span>拖动旋转</span><span>↑ ↓ ← → 平移</span><span>滚轮缩放</span></div>
        <div class="viewer-actions"><button data-viewer="explode" aria-pressed="false"><span>＋</span> 拆解档案</button><button data-viewer="assemble" aria-pressed="true"><span>−</span> 一键重组</button></div>
        <button class="viewer-reset" data-viewer="reset">复位视角 <span>↗</span></button>
      </footer>
      <div class="viewer-state" aria-live="polite">已组装</div>`,e.appendChild(this.root),this.canvasHost=this.root.querySelector(".viewer-canvas"),this.renderer=new $f({antialias:!0,powerPreference:"high-performance"}),this.renderer.toneMapping=Kr,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.tabIndex=0,this.renderer.domElement.setAttribute("aria-label","档案三维模型：拖动旋转，方向键平移，滚轮或加减键缩放，Home 复位"),this.canvasHost.appendChild(this.renderer.domElement),this.scene.background=new we("#eae5e1"),this.scene.fog=new Do("#eae5e1",13.5,26.5),sp(this.renderer,this.scene),this.camera.position.copy(this.initialCamera),this.controlCamera.copy(this.camera),this.controls=new xy(this.controlCamera,this.renderer.domElement),this.controls.enableDamping=!1,this.pipeline=qM(this.renderer,this.scene,this.camera),this.pipeline.smaa.enabled=!1,this.controls.rotateSpeed=.65,this.controls.zoomSpeed=.7,this.controls.panSpeed=.7,this.controls.minDistance=5,this.controls.maxDistance=28,this.controls.maxTargetRadius=5,this.controls.screenSpacePanning=!0,this.controls.touches.ONE=Cn.ROTATE,this.controls.touches.TWO=Cn.DOLLY_PAN,this.controls.enabled=!1,this.controls.update(),this.cameraMotion.snap(this.controlCamera,this.controls.target),this.controls.addEventListener("start",()=>this.interruptReset()),this.root.addEventListener("click",s=>{if(this.closing)return;const r=s.target.closest("[data-viewer]")?.dataset.viewer;r==="close"&&this.close(),r==="retry"&&this.load(),!(this.loading||!this.source)&&((r==="clear"||r==="frosted")&&(this.setSurface(r==="clear"),this.onSound("tick")),r==="explode"&&this.targetSpread!==1&&(this.setExploded(!0),this.onSound("explode")),r==="assemble"&&this.targetSpread!==0&&(this.setExploded(!1),this.onSound("assemble")),r==="reset"&&(this.resetView(),this.onSound("tick")))}),this.root.addEventListener("keydown",s=>this.keydown(s))}onSound;themeAmount=0;setTheme(e){this.themeAmount=e}root;canvasHost;renderer;pipeline;quality=Kn(void 0);superPerformance=!1;dispose(){this.request++,this.isOpen&&this.finishClose(),this.controls.dispose(),Xc(this.scene);for(const e of this.pipeline.composer.passes)e.dispose();this.pipeline.composer.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.root.remove()}setSuperPerformance(e){this.superPerformance!==e&&(this.superPerformance=e,this.resize())}appliedQuality="";scene=new Po;camera=new Gt(34,16/9,.3,120);controlCamera=this.camera.clone();cameraMotion=new Iy(this.camera);controls;source;groups=new Map;spread={value:0,velocity:0};targetSpread=0;clarity={value:1,velocity:0};targetClarity=1;lastTime=0;request=0;reduced=!1;motion=Wr();loading=!1;closing=!1;transitions=[];modelTransition;transitionId=0;status="";opener=null;siblings=[];initialCamera=new P(7.2,3.8,12);onClose;provider;isOpen=!1;setMotion(e){this.motion={...e},this.reduced=!e.viewerNavigation,this.root.dataset.motionModel=e.viewerModelTransition?"full":"reduced",this.root.dataset.motionSurface=e.surfaceTransitions?"full":"reduced",!e.surfaceTransitions&&this.isOpen&&(this.transitionId++,this.closing?this.finishClose():(this.transitions.forEach(t=>t.cancel()),this.transitions=[],this.root.dataset.transition="open")),e.viewerModelTransition||(this.modelTransition?.cancel(),this.modelTransition=void 0,this.clarity={value:this.targetClarity,velocity:0},this.spread={value:this.targetSpread,velocity:0})}open(e,t,i,s){this.isOpen||(this.isOpen=!0,this.closing=!1,this.reduced=s,this.provider=i,this.opener=document.activeElement,this.siblings=[...this.root.parentElement.children].filter(r=>r instanceof HTMLElement&&r!==this.root).map(r=>({node:r,inert:r.inert})),this.siblings.forEach(({node:r})=>r.inert=!0),this.root.hidden=!1,this.root.dataset.transition="opening",this.root.querySelector("#viewer-title").textContent=t,this.root.querySelector("#viewer-file").textContent="FILE "+e+" / INTERNAL DATABASE",this.spread={value:0,velocity:0},this.targetSpread=0,this.clarity={value:1,velocity:0},this.setSurface(!0),this.lastTime=0,this.root.dataset.exploded="false",this.resetView(!1),this.resize(),this.renderer.domElement.focus({preventScroll:!0}),this.enter(),this.load())}async load(){if(!this.provider||this.loading)return;const e=++this.request;this.loading=!0,this.controls.enabled=!1;const t=this.root.querySelector(".viewer-loading");t.hidden=!1,t.querySelector("span").textContent="正在载入模型…",t.querySelector("button").hidden=!0,this.setButtonsDisabled(!0);try{const i=await this.provider();if(!this.isOpen||this.closing||e!==this.request){i.dispose();return}this.source=i;for(const s of Wl){const r=new Xi;r.name=s.id,this.groups.set(s.id,r)}for(const s of[...i.model.children])this.groups.get(s.userData.assemblyPart??"cover")?.add(s);for(const s of this.groups.values())i.model.add(s);i.model.position.set(0,-1.85,0),this.scene.add(i.model),qc(i.model,this.renderer,this.quality),this.loading=!1,t.hidden=!0,this.controls.enabled=!0,this.setButtonsDisabled(!1),this.setExploded(!1),this.setStatus("已组装"),this.update(this.lastTime),this.motion.viewerModelTransition&&(this.modelTransition=this.canvasHost.animate([{opacity:0,transform:"scale(0.97)"},{opacity:1,transform:"scale(1)"}],{duration:380,easing:"cubic-bezier(0.22, 1, 0.36, 1)"}))}catch(i){if(!this.isOpen||this.closing||e!==this.request)return;this.loading=!1,t.querySelector("span").textContent="模型载入失败，请重试",t.querySelector("button").hidden=!1,console.error("Model viewer failed to load",i)}}enter(){const e=++this.transitionId;if(this.transitions.forEach(i=>i.cancel()),this.transitions=[],!this.motion.surfaceTransitions){this.root.dataset.transition="open";return}const t=this.root.animate([{opacity:0},{opacity:1}],{duration:320,easing:"cubic-bezier(0.22, 1, 0.36, 1)"});this.transitions.push(t);for(const i of[".viewer-header",".viewer-footer",".viewer-state"]){const s=this.root.querySelector(i);this.transitions.push(s.animate([{opacity:0,translate:"0 10px"},{opacity:1,translate:"0 0"}],{duration:300,delay:60,fill:"backwards",easing:"cubic-bezier(0.22, 1, 0.36, 1)"}))}t.finished.then(()=>{e===this.transitionId&&(this.root.dataset.transition="open")}).catch(()=>{})}close(){if(!this.isOpen||this.closing)return;this.closing=!0,this.request++,this.loading=!1,this.controls.enabled=!1,this.setButtonsDisabled(!0);const e=++this.transitionId,t=getComputedStyle(this.root).opacity,i=getComputedStyle(this.canvasHost),s=i.opacity,r=i.transform;if(this.modelTransition?.cancel(),this.modelTransition=void 0,this.transitions.forEach(o=>o.cancel()),this.transitions=[],this.root.dataset.transition="closing",!this.motion.surfaceTransitions){this.finishClose();return}const a=this.root.animate([{opacity:t},{opacity:0}],{duration:220,easing:"cubic-bezier(0.4, 0, 1, 1)",fill:"forwards"});this.transitions.push(a,this.canvasHost.animate([{transform:r,opacity:s},{transform:"scale(0.97)",opacity:0}],{duration:220,easing:"cubic-bezier(0.4, 0, 1, 1)",fill:"forwards"})),a.finished.then(()=>{e===this.transitionId&&this.finishClose()}).catch(()=>{})}finishClose(){this.isOpen=!1,this.closing=!1,this.root.hidden=!0,this.root.dataset.transition="closed",this.modelTransition?.cancel(),this.modelTransition=void 0,this.transitions.forEach(e=>e.cancel()),this.transitions=[],this.source&&(this.scene.remove(this.source.model),this.source.dispose(),this.source=void 0),this.groups.clear(),this.siblings.forEach(({node:e,inert:t})=>e.inert=t),this.siblings=[],this.opener?.focus({preventScroll:!0}),this.onClose()}setButtonsDisabled(e){for(const t of["explode","assemble","reset","clear","frosted"])this.root.querySelector(`[data-viewer="${t}"]`).disabled=e}setSurface(e){this.targetClarity=e?1:0,this.root.dataset.surface=e?"clear":"frosted",this.root.querySelector('[data-viewer="clear"]').setAttribute("aria-pressed",String(e)),this.root.querySelector('[data-viewer="frosted"]').setAttribute("aria-pressed",String(!e)),this.motion.viewerModelTransition||(this.clarity={value:this.targetClarity,velocity:0})}setExploded(e){this.targetSpread=e?1:0,this.root.dataset.exploded=String(e),this.root.querySelector('[data-viewer="explode"]').setAttribute("aria-pressed",String(e)),this.root.querySelector('[data-viewer="assemble"]').setAttribute("aria-pressed",String(!e)),this.setStatus(e?"正在拆解":this.spread.value>.001?"正在重组":"已组装"),this.motion.viewerModelTransition||(this.spread={value:this.targetSpread,velocity:0})}setStatus(e){e!==this.status&&(this.status=e,this.root.querySelector(".viewer-state").textContent=e)}resetView(e=!0){this.controls.enabled=!1,this.controls.enableDamping=!1,this.controls.update(),this.controls.target.set(0,0,0),this.controlCamera.position.copy(this.initialCamera),this.controls.enableDamping=!1,this.controls.update(),e&&this.motion.viewerNavigation?this.cameraMotion.reset():this.cameraMotion.snap(this.controlCamera,this.controls.target),this.controls.enabled=this.isOpen&&!this.loading&&!!this.source}interruptReset(){this.cameraMotion.resetting&&(this.cameraMotion.interruptReset(this.controlCamera,this.controls.target),this.controls.update())}keydown(e){if(e.stopPropagation(),e.key==="Escape"){e.preventDefault(),this.close();return}if(this.closing){e.preventDefault();return}if(e.key==="Tab"){const t=[...this.root.querySelectorAll('button:not([disabled]):not([hidden]),canvas[tabindex="0"]')],i=t[0],s=t.at(-1);e.shiftKey&&document.activeElement===i&&(e.preventDefault(),s?.focus()),!e.shiftKey&&document.activeElement===s&&(e.preventDefault(),i?.focus());return}if(!(!this.source||this.loading)){if(e.key==="Home"){e.preventDefault(),this.resetView(),this.onSound("tick");return}if(["+","=","-"].includes(e.key)){e.preventDefault(),this.interruptReset();const t=this.controlCamera.position.distanceTo(this.controls.target),i=Ne.clamp(t*(e.key==="-"?1.12:1/1.12),5,28);this.controlCamera.position.sub(this.controls.target).multiplyScalar(i/t).add(this.controls.target),this.controls.update();return}if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault(),this.interruptReset();const t=new P().setFromMatrixColumn(this.camera.matrix,0),i=new P().setFromMatrixColumn(this.camera.matrix,1),s=new P,r=this.controlCamera.position.distanceTo(this.controls.target)*.025;e.key==="ArrowLeft"&&s.addScaledVector(t,-r),e.key==="ArrowRight"&&s.addScaledVector(t,r),e.key==="ArrowUp"&&s.addScaledVector(i,r),e.key==="ArrowDown"&&s.addScaledVector(i,-r);const a=this.controls.target.clone();this.controls.target.add(s),this.controls.target.clampLength(0,this.controls.maxTargetRadius),this.controlCamera.position.add(this.controls.target.clone().sub(a)),this.controls.update()}}}setQuality(e){const t=JSON.stringify(e);this.appliedQuality!==t&&(this.appliedQuality=t,this.quality=Kn(e),this.pipeline.smaa.enabled=this.quality.antialias==="smaa",qc(this.scene,this.renderer,this.quality),this.resize())}resize(){if(!this.isOpen)return;const e=this.canvasHost.clientWidth,t=this.canvasHost.clientHeight;cp(this.renderer,this.pipeline.composer,this.canvasHost,this.quality,this.superPerformance),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.controlCamera.aspect=this.camera.aspect,this.controlCamera.updateProjectionMatrix();const i=matchMedia("(pointer: coarse)").matches,s=this.root.querySelector(".viewer-help");s.innerHTML=i?"<span>单指旋转</span><span>双指缩放 / 平移</span>":"<span>拖动旋转</span><span>↑ ↓ ← → 平移</span><span>滚轮缩放</span>"}update(e){if(!this.isOpen)return;ep(this.scene,this.renderer,this.themeAmount),this.source?.model.traverse(o=>{o.userData.themeAmount&&(o.userData.themeAmount.value=this.themeAmount)});const t=Math.min(this.lastTime?e-this.lastTime:1/60,.05);if(this.lastTime=e,this.source){Sn(this.clarity,this.targetClarity,8,t),Math.abs(this.clarity.value-this.targetClarity)<1e-4&&Math.abs(this.clarity.velocity)<.001&&(this.clarity={value:this.targetClarity,velocity:0}),this.source.setClarity?.(this.clarity.value),this.motion.viewerModelTransition?Sn(this.spread,this.targetSpread,5.5,t):this.spread={value:this.targetSpread,velocity:0},Math.abs(this.spread.value-this.targetSpread)<1e-4&&Math.abs(this.spread.velocity)<.001&&(this.spread={value:this.targetSpread,velocity:0},this.setStatus(this.targetSpread?"已拆解":"已组装"));for(const o of Wl)this.groups.get(o.id).position.z=o.depth*this.spread.value}this.controls.update(),this.cameraMotion.update(this.controlCamera,this.controls.target,t,this.reduced);const s=this.root.closest("[data-layout]")?.dataset.layout==="portrait"?Math.min(1.15,this.camera.aspect/.85)/(1+.08*this.spread.value):1;this.camera.zoom!==s&&(this.camera.zoom=s,this.controlCamera.zoom=s,this.camera.updateProjectionMatrix(),this.controlCamera.updateProjectionMatrix());const r=this.scene.fog,a=this.camera.position.length();r.near=Math.max(0,a-1),r.far=a+12,this.quality.antialias==="smaa"?this.pipeline.composer.render():this.renderer.render(this.scene,this.camera),this.root.dataset.stats=JSON.stringify({ready:!!this.source,clarity:this.clarity.value,targetClarity:this.targetClarity,spread:this.spread.value,target:this.targetSpread,distance:this.camera.position.distanceTo(this.cameraMotion.focus),targetPosition:this.cameraMotion.focus.toArray(),requestedTarget:this.controls.target.toArray(),requestedDistance:this.controlCamera.position.distanceTo(this.controls.target),cameraPosition:this.camera.position.toArray(),resetting:this.cameraMotion.resetting,azimuth:this.controls.getAzimuthalAngle(),polar:this.controls.getPolarAngle(),parts:[...this.groups].map(([o,l])=>({id:o,z:l.position.z,meshes:l.children.length}))})}}const Ap="cubic-bezier(0.22, 1, 0.36, 1)",Oy="cubic-bezier(0.4, 0, 1, 1)";class vp{constructor(e,t,i=300,s=200){this.root=e,this.panel=t,this.enterDuration=i,this.exitDuration=s}root;panel;enterDuration;exitDuration;animations=[];revision=0;show(e){this.run(!0,e)}hide(e,t=()=>{}){this.run(!1,e,t)}finish(){this.animations.forEach(e=>e.finish())}dispose(){this.revision++,this.animations.forEach(e=>e.cancel()),this.animations=[]}run(e,t,i){const s=++this.revision,r=this.root.hidden,a=r?"0":getComputedStyle(this.root).opacity,o=this.panel?r?"translateY(12px)":getComputedStyle(this.panel).transform:void 0;this.animations.forEach(u=>u.cancel()),this.animations=[],this.root.hidden=!1,this.root.dataset.transition=e?"opening":"closing";const l=()=>{s===this.revision&&(this.root.hidden=!e,this.root.dataset.transition=e?"open":"closed",this.animations.forEach(u=>u.cancel()),this.animations=[],i?.())};if(t||!e&&r){l();return}const c={duration:e?this.enterDuration:this.exitDuration,easing:e?Ap:Oy,fill:"both"},h=this.root.animate([{opacity:a},{opacity:e?1:0}],c);this.animations.push(h),this.panel&&this.animations.push(this.panel.animate([{transform:o},{transform:e?"translateY(0)":"translateY(8px)"}],c)),h.finished.then(l).catch(()=>{})}}class Uy{animation;reveal(e,t){const i=this.animation?.playState==="running"?getComputedStyle(e).opacity:"0.35";this.cancel(),t||(this.animation=e.animate([{opacity:i},{opacity:1}],{duration:150,easing:Ap}))}cancel(){this.animation?.cancel(),this.animation=void 0}finish(){this.animation?.finish(),this.animation=void 0}}function wt(n,e){if(e<=n[0][0])return n[0][1];const t=n.length-1;if(e>=n[t][0])return n[t][1];const i=l=>(n[l+1][1]-n[l][1])/(n[l+1][0]-n[l][0]),s=l=>{if(l===0)return i(0);if(l===t)return i(t-1);const c=i(l-1),h=i(l);if(c*h<=0)return 0;const u=n[l][0]-n[l-1][0],d=n[l+1][0]-n[l][0],f=2*d+u,m=d+2*u;return(f+m)/(f/c+m/h)};let r=0;for(;e>n[r+1][0];)r++;const a=n[r+1][0]-n[r][0],o=(e-n[r][0])/a;return(2*o**3-3*o**2+1)*n[r][1]+(o**3-2*o**2+o)*a*s(r)+(-2*o**3+3*o**2)*n[r+1][1]+(o**3-o**2)*a*s(r+1)}const By=[234,216,181,143,115,94,78,65,54,45,38,31,26,21,17,13,10,8,6,4,3,2,1,0],Fy=By.map((n,e)=>[e,n]),Hy=(n,e)=>{const t=n-278-e*2;return{x:wt(Fy,t),opacity:wt([[-1,0],[0,.4],[1,.65],[2,.88],[3,1]],t)}},ky=[[588,4],[589,39],[592,225],[593,261],[594,288],[595,310],[596,328],[597,343],[598,356],[599,366],[600,375],[601,382],[602,389],[603,394],[604,398],[605,402],[606,405],[607,407],[608,408],[609,409],[610,410],[611,410]],Vy=n=>wt(ky,n)/410;function zy(n){const e=i=>wt(i,n),t=Math.PI/180;return{radius:e([[487,2e3],[492,1540],[497,1095],[500,895.5],[505,650],[510,492],[515,385.5],[520,320.5],[524,287.5],[527,275],[530,270],[535,265.5],[540,262],[545,258],[550,255],[555,252.5],[560,250],[568,246]]),whiteRadius:e([[487,1500],[492,1011],[493,955],[494,893],[495,834],[496,783],[497,737],[498,693.5],[499,655],[500,619],[505,470.5],[510,374],[515,310.5],[520,272],[524,253.5],[527,248],[530,246],[535,242],[540,238],[545,235],[550,232.5],[555,230],[560,227.5],[568,224]]),outerStart:t*e([[487,470],[492,364],[497,276],[500,226],[505,159.75],[510,98.75],[515,49.25],[520,13.25],[524,-9],[527,-23],[530,-36.25],[535,-53],[540,-66.25],[545,-75.75],[550,-82.75],[560,-89],[568,-90]]),outerSweep:t*e([[487,30],[492,105],[497,170],[500,199],[505,241.5],[510,270.25],[515,295.75],[520,313.25],[527,331],[530,336.75],[535,344.5],[540,350.75],[545,355],[550,358],[560,360],[568,360]]),whiteStart:t*e([[487,-100],[492,-30],[497,72],[500,107],[505,140],[510,172],[515,196],[520,213.75],[527,234.5],[530,241],[535,249.75],[540,256.75],[545,262.25],[550,265.75],[560,269.5],[568,270]]),whiteSweep:t*e([[487,30],[492,105],[497,170],[500,200],[505,241.25],[510,272.75],[515,295.5],[520,313.75],[527,330.5],[530,335.5],[535,343.5],[540,349.5],[545,354],[550,357],[560,360],[568,360]]),innerRadius:e([[487,124.5],[492,123],[495,121],[500,117.5],[505,112],[510,107.5],[515,104],[520,101.5],[530,97],[540,94],[550,91.5],[560,90],[568,88.5]]),innerStart:t*e([[487,-20],[490,-4.25],[492,14],[495,48.75],[497,69.25],[500,93.25],[505,121.25],[510,141],[515,155.5],[520,166.5],[527,178],[530,181],[535,187.75],[540,192],[545,195.25],[550,197.75],[555,199.75],[560,200.75],[568,201.5]]),innerSweep:t*e([[487,0],[492,22.5],[497,55.75],[500,70.25],[505,87.25],[510,99],[515,108],[520,115],[527,123.5],[530,127],[535,128],[540,131],[550,134],[568,136]]),orbit:t*e([[487,70],[492,33],[493,13.2],[494,-5.8],[495,-24.2],[496,-41.4],[497,-57.2],[498,-71.4],[499,-84.2],[500,-96],[505,-140.8],[510,-172.3],[515,-195.5],[520,-213.5],[527,-234],[530,-238.8],[535,-247.7],[540,-254.7],[545,-260.1],[550,-264],[555,-266.9],[560,-268.8],[568,-270]]),orbitRadius:e([[487,270],[495,236],[500,224],[505,214],[510,206],[515,199],[520,193],[530,185],[540,179.5],[550,174.5],[560,171.5],[568,169]]),dotRadius:e([[487,0],[492,1],[500,5.6],[510,7],[520,7.8],[530,8],[568,8]]),blackCap:e([[487,45],[504,35],[510,20],[515,10],[520,5],[525,2.5],[535,2],[550,0],[568,0]]),whiteCap:e([[487,40],[492,30],[497,22],[502,16],[507,10],[512,5],[520,1.5],[540,0],[568,0]])}}const Gy=[[543,827.5,561,1091,518,38.7,260,250,0,0],[544,827.5,561,1091,518,38.7,260,250,3,3],[545,827.5,560.5,1091,518.5,38.6,265,236,17,17],[546,827.5,559.5,1091,519.5,38.5,274,190,44,44],[547,827.6,558.2,1090.6,520.8,38.5,296,121,79,81],[548,828.06,556.76,1090.35,522.58,38.38,332.38,50.99,111.73,113.42],[549,827.84,555.13,1090.42,524.39,38.34,367.27,-14.03,141.56,145.66],[550,827.89,553.28,1090.2,525.89,38.44,396.14,-68.97,168.88,172.89],[551,828,551.68,1090.21,527.44,38.28,421.62,-113.84,191.68,195.3],[552,828.19,550.24,1089.94,528.85,38.25,444.24,-152.25,208.55,215.7],[553,828.42,548.83,1089.7,530.24,38.18,462.76,-184.19,225.92,230.73],[554,828.61,547.64,1089.53,531.44,38.12,479.15,-212.29,239.9,244.63],[555,828.8,546.47,1089.37,532.55,38.03,494.23,-237.06,251.56,257.75],[556,829.06,545.41,1089.16,533.53,37.91,508.57,-259.19,261.49,267.63],[557,829.25,544.49,1088.93,534.52,37.87,520.46,-279.2,271.23,278.42],[558,829.47,543.66,1088.7,535.37,37.79,530.39,-295.86,280.34,286.17],[559,829.75,542.88,1088.46,536.12,37.72,541.33,-312.5,287.17,295.12],[560,829.95,542.16,1088.26,536.88,37.65,549.47,-326.37,295.98,301.16],[561,830.16,541.63,1088.02,537.41,37.57,557.82,-338.78,302.29,307.52],[562,830.33,541.08,1087.81,537.94,37.52,565.1,-350.74,307.99,312.58],[563,830.59,540.65,1087.61,538.36,37.43,571.89,-362.08,313.78,319.28],[564,830.83,540.28,1087.38,538.74,37.37,578.93,-371.93,316.97,323.53],[565,831.04,539.97,1087.14,539.04,37.35,583.85,-380.51,322.27,327.78],[566,831.25,539.74,1086.93,539.28,37.27,589.84,-388.93,325.61,331.62],[567,831.48,539.56,1086.73,539.4,37.19,594,-396.5,330.93,335.92],[568,831.61,539.51,1086.55,539.48,37.15,599.44,-403.94,332.25,338.7]],Wy=Array.from({length:9},(n,e)=>Gy.map(t=>[t[0],t[e+1]])),xp=[[548,926.33,554.33],[551,944.38,572.15],[553,954.92,575.05],[555,963,575],[558,971.63,572.85],[561,977.53,569.78],[564,981.5,566.86],[568,984.71,563.5]],Xy=xp.map(([n,e,t])=>[n,Math.atan2(t-539.5,e-959.5)]),Yy=xp.map(([n,e,t])=>[n,Math.hypot(e-959.5,t-539.5)]),jy=[[-1,0],[0,.8],[1,1.7],[2,2.35],[3,2.85],[4,3.15],[5,3.45],[7,3.8],[10,4.1],[15,4.25],[20,4.25]];function qy(n){const e=Wy.map(p=>wt(p,n)),[t,i,s,r,a,o,l,c,h]=e,u=wt(Xy,n),d=wt(Yy,n),f=Math.floor(n+1e-5),m=[546,547,549,550].includes(f),A=wt(m?[[546,42.93],[550,42.43]]:[[545,0],[548,7.96],[551,9.89],[553,10.63],[555,11.08],[559,11.45],[564,11.45],[568,11.27]],n);return{sides:[{x:t,y:i,radius:a,start:o*Math.PI/180,sweep:c*Math.PI/180},{x:s,y:r,radius:a,start:l*Math.PI/180,sweep:h*Math.PI/180}],sideVisible:n>=544,coreRadius:A,satellites:Array.from({length:6},(p,g)=>{const _=u+g*Math.PI/3;return{x:959.5+Math.cos(_)*d,y:539.5+Math.sin(_)*d,radius:wt(jy,n-548-g*3)}})}}const _p=[[229,-.02,-.0198],[230,-.0195,-.011],[231,-.016,.009],[232,-.0095,.047],[233,.0025,.1135],[234,.0215,.2205],[235,.048,.365],[236,.0735,.504],[237,.094,.6155],[238,.109,.7045],[239,.122,.7755],[240,.133,.835],[241,.1425,.884],[242,.1505,.927],[243,.1575,.964],[244,.164,.996],[245,.1695,1.023],[246,.1745,1.0475],[247,.1785,1.0685],[248,.183,1.087],[249,.187,1.103],[250,.19,1.1175],[251,.1935,1.13],[252,.196,1.1405],[253,.1985,1.15],[254,.201,1.1575],[255,.203,1.1645],[256,.205,1.17],[257,.2065,1.1745],[258,.208,1.1785],[259,.2095,1.181],[260,.2105,1.183],[261,.2115,1.184],[264,.211,1.1835]],Zy=_p.map(([n,e])=>[n,e]),Ky=_p.map(([n,,e])=>[n,e]),Qy=[[420,.1835],[425,.184],[430,.1885],[435,.2],[440,.2205],[450,.2925],[455,.3485],[460,.421],[465,.5095],[470,.614],[475,.722],[480,.827],[485,.9195],[486,.9365]],Jy=[[260,814],[261,813],[262,812],[263,808],[264,803],[265,794],[266,781],[267,763],[268,740],[269,716],[270,691],[271,668],[272,648],[273,630],[274,615],[275,601],[276,590],[277,580],[278,571],[279,563],[280,556],[281,550],[282,545],[283,540],[284,536],[285,533],[286,530],[287,527],[288,525],[289,523],[290,521],[291,520],[292,519],[294,518]];function $y(n){const e=wt(Qy,n),t=n<420?wt(Zy,n):e+.0275,i=n<420?wt(Ky,n):e+1;return{offsetX:wt(Jy,n)-520,start:t,length:Math.max(0,Math.min(1,i-t)),strokeWidth:wt([[229,.25],[230,2.8],[231,8],[232,16],[233,23.5],[234,26]],n),symbolScale:wt([[246,0],[247,.4],[248,.63],[249,.75],[250,.83],[251,.89],[252,.94],[254,.985],[256,1]],n),plusX:wt([[246,155],[247,123.3],[248,104],[249,93.53],[250,86.52],[251,81.78],[252,78.48],[254,74.26],[256,72.96],[260,72.6]],n),minusX:wt([[246,155],[247,186.82],[248,206.14],[249,216.66],[250,223.47],[251,228.21],[252,231.77],[254,236.06],[256,237.57],[260,237.1]],n),minusWidth:wt([[246,15],[256,15],[257,23],[258,31],[259,35.5],[260,38],[262,42],[264,44],[268,46]],n),plusAngle:wt([[255,0],[256,-3],[257,-22],[258,-45],[259,-62],[260,-70],[262,-80],[265,-87],[270,-90]],n)}}const Xl=(n,e,t)=>Math.max(0,Math.min(1,(n-e)/(t-e))),ju=n=>n*n*(3-2*n),ws=(n,e,t,i)=>n.slice(0,e<t?0:Math.min(n.length,1+Math.floor((e-t)*(n.length-1)/(i-t)))),Sr=(n,e)=>e.includes(n),e2=[1,1,3,4,5,6,9,11,12,14,17,18,19,20,22,23,25,26];function Mp(n){const e=n+5,t=Math.floor(e*25+1e-5),i=e<9.12?"access":e<11.12?"logo":e<19.48?"auth":e<22.76?"scan":"welcome";let s="";t<363?(s=ws("ID CONFIRMED",t,282,295),t>=320&&(s+=" : "+ws("TRAILBLAZER",t,321,339))):t<421?s=ws("REQUEST RECEIVED",t,367,389):(s=ws("START PROCESSING",t,423,440),t>=449&&(s+=".".repeat(Math.min(3,1+Math.floor((t-449)/4)))),Sr(t,[479,485,486])&&(s="              SING..."));const r=e*25,a=zy(r),o=qy(r),l=Sr(t,[525,526,528,529]),c=[1,0,.28,0,1,0,0],h=t-569,u=ju(Xl(e,26.56,26.92));return{t:e,f:t,step:i,auth:s,access:"ACCESS PERMISSION REQUIRED".slice(0,t<170?0:e2[Math.min(17,t-170)]),accessOpacity:t>=170&&t<227?t===226?.25:1:0,logoOpacity:e>=9.16&&e<19.48?1:0,logo:$y(r),logoLetters:ws("ASTRAL·EXPRESS",t,232,255),authOpacity:t>=281&&t<487?1:0,brand:[0,1,2].map(d=>Hy(r,d)),poweredLetters:ws("POWERED BY ASTRAL EXPRESS",t,279,295).length,scanVisible:e>=19.48&&e<22.76,scan:a,scanOrbit:o,scanRadius:a.radius,ringScale:l?1.94:1,ringOpacity:l?.32:wt([[487,0],[488,.18],[490,.6],[493,1]],r),ringBlur:l?2.2:0,scanTracking:wt([[487,40],[492,28],[497,18],[500,14],[505,8],[510,4],[515,1.7],[520,.5],[527,0],[568,0]],r),scanFont:26.5,permissionOpacity:e<21.8?Xl(e,19.48,19.88):wt([[545,1],[546,.4],[547,.3],[548,.25],[549,.1],[550,.04],[551,0]],r),ornament:e>=21.84,coreRadius:o.coreRadius,welcomeVisible:e>=22.76&&e<26.92,welcomePanel:h>=0&&h<7?c[h]:0,welcomeInk:h>=0&&h<7?[0,0,.2,1,0,0,.25][h]:1,companyVisible:t>=588&&!Sr(t,[590,591]),companyMask:Sr(t,[594,595]),highlight:Vy(r),databaseOpacity:t<626||Sr(t,[628,629,631,634])?0:1,welcomeLogo:t>=588,welcomeScale:1-.46*u,welcomeOpacity:1-Math.pow(u,3),exitBlur:8*u,exit:u,backgroundOpacity:e<26.92?1:0,white:ju(Xl(e,26.16,26.88))}}const t2={ink:["#080a08","#e0e3dc"],muted:["#77756d","#a6b0b1"],line:["#aaa59a","#536166"],paper:["#eae5e1","#11181b"],panel:["#edebe4","#202a2f"],field:["#e7e3d9","#2a363b"],accent:["#9b7247","#c5a16b"]};let qu=-1,yp=0;function Zu(n){return[1,3,5].map(e=>parseInt(n.slice(e,e+2),16))}function bp(n){if(Math.abs(n-qu)<1e-4)return;qu=yp=n;const e=document.documentElement;e.dataset.darkSurface=String(n>1e-4);for(const[t,i]of Object.entries(t2)){const s=Zu(i[0]),r=Zu(i[1]),a=s.map((o,l)=>Math.round(o+(r[l]-o)*n)).join(", ");e.style.setProperty(`--theme-${t}`,`rgb(${a})`),e.style.setProperty(`--theme-${t}-rgb`,a)}}function i2(n){return`<div class="theme-settings"><div><strong>界面配色</strong><span>玻璃阵列随配色逐张过渡</span></div><div class="theme-choices" role="group" aria-label="界面配色"><button data-color-theme="light" aria-pressed="${!n}">亮色</button><button data-color-theme="dark" aria-pressed="${n}">暗色</button></div></div>`}const n2={text:"ACCESS PERMISSION REQUIRED",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.732,path:"M543 614.0 621 800.0H708L410 100.0H321L23 800.0H110L188 614.0ZM512 540.0H219L296 356.0C322 293.0 363 194.0 364 193.0H366C367 194.0 408 293.0 435 357.0Z"},{strokeWidth:0,width:.769,path:"M646 582.0C602 676.0 508 735.0 394 735.0C240 735.0 120 626.0 120 449.0C120 273.0 234 163.0 396 163.0C542 163.0 611 251.0 637 299.0L716 277.0C672 174.0 560 86.0 398 86.0C193 86.0 38 228.0 38 448.0C38 669.0 194 813.0 398 813.0C546 813.0 671 735.0 725 603.0Z"},{strokeWidth:0,width:.769,path:"M646 582.0C602 676.0 508 735.0 394 735.0C240 735.0 120 626.0 120 449.0C120 273.0 234 163.0 396 163.0C542 163.0 611 251.0 637 299.0L716 277.0C672 174.0 560 86.0 398 86.0C193 86.0 38 228.0 38 448.0C38 669.0 194 813.0 398 813.0C546 813.0 671 735.0 725 603.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.576,path:"M77 100.0V800.0H158V535.0H289C452 535.0 550 457.0 550 318.0C550 175.0 452 100.0 289 100.0ZM158 463.0V175.0H291C402 175.0 468 220.0 468 319.0C468 412.0 408 463.0 291 463.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.802,path:"M644 800.0H726V100.0H642L403 526.0H401L163 100.0H77V800.0H158V485.0C158 377.0 156 233.0 156 232.0H158C159 233.0 185 289.0 250 404.0L377 628.0H426L554 401.0C617 289.0 644 233.0 645 232.0H647C647 233.0 644 377.0 644 485.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.802,path:"M38 449.0C38 667.0 196 813.0 401 813.0C605 813.0 764 667.0 764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0ZM120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0C243 735.0 120 627.0 120 449.0Z"},{strokeWidth:0,width:.727,path:"M568 800.0H651V100.0H569V500.0C569 581.0 571 663.0 571 664.0H569L159 100.0H77V800.0H158V399.0C158 312.0 156 232.0 156 231.0H158Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.802,path:"M764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0C38 652.0 175 792.0 359 811.0V935.0H442V811.0C626 792.0 764 652.0 764 449.0ZM401 735.0C243 735.0 120 627.0 120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0Z"},{strokeWidth:0,width:.696,path:"M628 100.0H547V508.0C547 660.0 484 735.0 348 735.0C213 735.0 151 660.0 151 508.0V100.0H68V508.0C68 706.0 166 813.0 348 813.0C529 813.0 628 706.0 628 508.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.729,path:"M77 100.0V800.0H326C535 800.0 691 669.0 691 453.0C691 237.0 536 100.0 319 100.0ZM158 724.0V176.0H316C479 176.0 609 272.0 609 453.0C609 635.0 478 724.0 322 724.0Z"}]},s2={text:"ID CONFIRMED : TRAILBLAZER",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.729,path:"M77 100.0V800.0H326C535 800.0 691 669.0 691 453.0C691 237.0 536 100.0 319 100.0ZM158 724.0V176.0H316C479 176.0 609 272.0 609 453.0C609 635.0 478 724.0 322 724.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.769,path:"M646 582.0C602 676.0 508 735.0 394 735.0C240 735.0 120 626.0 120 449.0C120 273.0 234 163.0 396 163.0C542 163.0 611 251.0 637 299.0L716 277.0C672 174.0 560 86.0 398 86.0C193 86.0 38 228.0 38 448.0C38 669.0 194 813.0 398 813.0C546 813.0 671 735.0 725 603.0Z"},{strokeWidth:0,width:.802,path:"M38 449.0C38 667.0 196 813.0 401 813.0C605 813.0 764 667.0 764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0ZM120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0C243 735.0 120 627.0 120 449.0Z"},{strokeWidth:0,width:.727,path:"M568 800.0H651V100.0H569V500.0C569 581.0 571 663.0 571 664.0H569L159 100.0H77V800.0H158V399.0C158 312.0 156 232.0 156 231.0H158Z"},{strokeWidth:0,width:.583,path:"M544 176.0V100.0H77V800.0H158V486.0H465V410.0H158V176.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.802,path:"M644 800.0H726V100.0H642L403 526.0H401L163 100.0H77V800.0H158V485.0C158 377.0 156 233.0 156 232.0H158C159 233.0 185 289.0 250 404.0L377 628.0H426L554 401.0C617 289.0 644 233.0 645 232.0H647C647 233.0 644 377.0 644 485.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.729,path:"M77 100.0V800.0H326C535 800.0 691 669.0 691 453.0C691 237.0 536 100.0 319 100.0ZM158 724.0V176.0H316C479 176.0 609 272.0 609 453.0C609 635.0 478 724.0 322 724.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.224,path:"M112 462.0C147 462.0 166 440.0 166 411.0C166 384.0 147 361.0 112 361.0C77 361.0 58 383.0 58 411.0C58 439.0 76 462.0 112 462.0ZM112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.732,path:"M543 614.0 621 800.0H708L410 100.0H321L23 800.0H110L188 614.0ZM512 540.0H219L296 356.0C322 293.0 363 194.0 364 193.0H366C367 194.0 408 293.0 435 357.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.6,path:"M77 100H158V724H550V800H77Z"},{strokeWidth:0,width:.66,path:"M77 100H317C469 100 548 161 548 276C548 355 502 410 435 432C521 450 574 509 574 599C574 731 486 800 318 800H77ZM158 175V395H310C412 395 465 354 465 284C465 211 413 175 310 175ZM158 468V724H315C431 724 490 682 490 598C490 511 430 468 315 468Z"},{strokeWidth:0,width:.6,path:"M77 100H158V724H550V800H77Z"},{strokeWidth:0,width:.732,path:"M543 614.0 621 800.0H708L410 100.0H321L23 800.0H110L188 614.0ZM512 540.0H219L296 356.0C322 293.0 363 194.0 364 193.0H366C367 194.0 408 293.0 435 357.0Z"},{strokeWidth:0,width:.654,path:"M612 178.0V100.0H52V176.0H425C477 176.0 509 175.0 510 175.0L511 178.0C511 179.0 485 204.0 434 263.0L42 725.0V800.0H612V724.0H235C184 724.0 149 725.0 148 725.0L146 723.0C146 722.0 169 701.0 228 631.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"}]},r2={text:"REQUEST RECEIVED",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.802,path:"M764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0C38 652.0 175 792.0 359 811.0V935.0H442V811.0C626 792.0 764 652.0 764 449.0ZM401 735.0C243 735.0 120 627.0 120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0Z"},{strokeWidth:0,width:.696,path:"M628 100.0H547V508.0C547 660.0 484 735.0 348 735.0C213 735.0 151 660.0 151 508.0V100.0H68V508.0C68 706.0 166 813.0 348 813.0C529 813.0 628 706.0 628 508.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.769,path:"M646 582.0C602 676.0 508 735.0 394 735.0C240 735.0 120 626.0 120 449.0C120 273.0 234 163.0 396 163.0C542 163.0 611 251.0 637 299.0L716 277.0C672 174.0 560 86.0 398 86.0C193 86.0 38 228.0 38 448.0C38 669.0 194 813.0 398 813.0C546 813.0 671 735.0 725 603.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.686,path:"M392 800.0 670 100.0H582L437 472.0C381 614.0 347 706.0 346 709.0H344C343 706.0 308 613.0 251 467.0L108 100.0H17L295 800.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.729,path:"M77 100.0V800.0H326C535 800.0 691 669.0 691 453.0C691 237.0 536 100.0 319 100.0ZM158 724.0V176.0H316C479 176.0 609 272.0 609 453.0C609 635.0 478 724.0 322 724.0Z"}]},a2={text:"START PROCESSING...",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.732,path:"M543 614.0 621 800.0H708L410 100.0H321L23 800.0H110L188 614.0ZM512 540.0H219L296 356.0C322 293.0 363 194.0 364 193.0H366C367 194.0 408 293.0 435 357.0Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.576,path:"M77 100.0V800.0H158V535.0H289C452 535.0 550 457.0 550 318.0C550 175.0 452 100.0 289 100.0ZM158 463.0V175.0H291C402 175.0 468 220.0 468 319.0C468 412.0 408 463.0 291 463.0Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.802,path:"M38 449.0C38 667.0 196 813.0 401 813.0C605 813.0 764 667.0 764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0ZM120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0C243 735.0 120 627.0 120 449.0Z"},{strokeWidth:0,width:.769,path:"M646 582.0C602 676.0 508 735.0 394 735.0C240 735.0 120 626.0 120 449.0C120 273.0 234 163.0 396 163.0C542 163.0 611 251.0 637 299.0L716 277.0C672 174.0 560 86.0 398 86.0C193 86.0 38 228.0 38 448.0C38 669.0 194 813.0 398 813.0C546 813.0 671 735.0 725 603.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.727,path:"M568 800.0H651V100.0H569V500.0C569 581.0 571 663.0 571 664.0H569L159 100.0H77V800.0H158V399.0C158 312.0 156 232.0 156 231.0H158Z"},{strokeWidth:0,width:.79,path:"M730 800.0V434.0H446V510.0H654V610.0C626 662.0 534 735.0 402 735.0C242 735.0 120 626.0 120 448.0C120 273.0 236 163.0 398 163.0C549 163.0 615 256.0 638 299.0L718 277.0C674 173.0 560 86.0 400 86.0C194 86.0 38 228.0 38 449.0C38 669.0 198 813.0 397 813.0C535 813.0 622 738.0 656 699.0H658C658 708.0 657 720.0 657 800.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"}]},o2={text:"              SING...",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.727,path:"M568 800.0H651V100.0H569V500.0C569 581.0 571 663.0 571 664.0H569L159 100.0H77V800.0H158V399.0C158 312.0 156 232.0 156 231.0H158Z"},{strokeWidth:0,width:.79,path:"M730 800.0V434.0H446V510.0H654V610.0C626 662.0 534 735.0 402 735.0C242 735.0 120 626.0 120 448.0C120 273.0 236 163.0 398 163.0C549 163.0 615 256.0 638 299.0L718 277.0C674 173.0 560 86.0 400 86.0C194 86.0 38 228.0 38 449.0C38 669.0 198 813.0 397 813.0C535 813.0 622 738.0 656 699.0H658C658 708.0 657 720.0 657 800.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"},{strokeWidth:0,width:.224,path:"M112 810.0C147 810.0 166 787.0 166 759.0C166 731.0 147 709.0 112 709.0C77 709.0 58 731.0 58 759.0C58 787.0 76 810.0 112 810.0Z"}]},l2={text:"PERMISSION AUTHORIZED",weight:"Normal",units:1e3,letters:[{strokeWidth:0,width:.576,path:"M77 100.0V800.0H158V535.0H289C452 535.0 550 457.0 550 318.0C550 175.0 452 100.0 289 100.0ZM158 463.0V175.0H291C402 175.0 468 220.0 468 319.0C468 412.0 408 463.0 291 463.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.802,path:"M644 800.0H726V100.0H642L403 526.0H401L163 100.0H77V800.0H158V485.0C158 377.0 156 233.0 156 232.0H158C159 233.0 185 289.0 250 404.0L377 628.0H426L554 401.0C617 289.0 644 233.0 645 232.0H647C647 233.0 644 377.0 644 485.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.802,path:"M38 449.0C38 667.0 196 813.0 401 813.0C605 813.0 764 667.0 764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0ZM120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0C243 735.0 120 627.0 120 449.0Z"},{strokeWidth:0,width:.727,path:"M568 800.0H651V100.0H569V500.0C569 581.0 571 663.0 571 664.0H569L159 100.0H77V800.0H158V399.0C158 312.0 156 232.0 156 231.0H158Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.732,path:"M543 614.0 621 800.0H708L410 100.0H321L23 800.0H110L188 614.0ZM512 540.0H219L296 356.0C322 293.0 363 194.0 364 193.0H366C367 194.0 408 293.0 435 357.0Z"},{strokeWidth:0,width:.696,path:"M628 100.0H547V508.0C547 660.0 484 735.0 348 735.0C213 735.0 151 660.0 151 508.0V100.0H68V508.0C68 706.0 166 813.0 348 813.0C529 813.0 628 706.0 628 508.0Z"},{strokeWidth:0,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.702,path:"M544 800.0H626V100.0H544V395.0H158V100.0H77V800.0H158V473.0H544Z"},{strokeWidth:0,width:.802,path:"M38 449.0C38 667.0 196 813.0 401 813.0C605 813.0 764 667.0 764 449.0C764 232.0 605 86.0 401 86.0C196 86.0 38 232.0 38 449.0ZM120 449.0C120 272.0 243 163.0 401 163.0C558 163.0 682 271.0 682 449.0C682 627.0 558 735.0 401 735.0C243 735.0 120 627.0 120 449.0Z"},{strokeWidth:0,width:.602,path:"M467 800.0H565L392 510.0C491 489.0 552 426.0 552 318.0C552 181.0 455 100.0 291 100.0H77V800.0H158V526.0H244C259 526.0 293 526.0 308 525.0ZM158 458.0V175.0H294C403 175.0 469 222.0 469 321.0C469 422.0 401 458.0 299 458.0Z"},{strokeWidth:0,width:.235,path:"M77 800.0H158V100.0H77Z"},{strokeWidth:0,width:.654,path:"M612 178.0V100.0H52V176.0H425C477 176.0 509 175.0 510 175.0L511 178.0C511 179.0 485 204.0 434 263.0L42 725.0V800.0H612V724.0H235C184 724.0 149 725.0 148 725.0L146 723.0C146 722.0 169 701.0 228 631.0Z"},{strokeWidth:0,width:.6,path:"M77 800.0H550V724.0H158V472.0H462V396.0H158V176.0H548V100.0H77Z"},{strokeWidth:0,width:.729,path:"M77 100.0V800.0H326C535 800.0 691 669.0 691 453.0C691 237.0 536 100.0 319 100.0ZM158 724.0V176.0H316C479 176.0 609 272.0 609 453.0C609 635.0 478 724.0 322 724.0Z"}]},c2={text:"ASTRAL EXPRESS",weight:"DemiBold",units:1e3,letters:[{strokeWidth:0,width:.749,path:"M531 660.0 584 800.0H733L453 100.0H296L16 800.0H163L216 660.0ZM482 534.0H264L323 380.0C347 319.0 371 258.0 372 257.0H375C376 258.0 400 320.0 424 380.0Z"},{strokeWidth:58,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:58,width:.637,path:"M600 176.0V100.0H37V176.0H277V800.0H359V176.0Z"},{strokeWidth:0,width:.631,path:"M443 800.0H608L443 527.0C533 499.0 585 431.0 585 330.0C585 188.0 484 100.0 311 100.0H63V800.0H202V554.0H257H302ZM202 442.0V227.0H319C399 227.0 443 265.0 443 337.0C443 410.0 397 442.0 321 442.0Z"},{strokeWidth:0,width:.749,path:"M531 660.0 584 800.0H733L453 100.0H296L16 800.0H163L216 660.0ZM482 534.0H264L323 380.0C347 319.0 371 258.0 372 257.0H375C376 258.0 400 320.0 424 380.0Z"},{strokeWidth:0,width:.567,path:"M63 800.0H534V671.0H202V100.0H63Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.609,path:"M63 800.0H564V671.0H202V506.0H471V376.0H202V229.0H560V100.0H63Z"},{strokeWidth:58,width:.65,path:"M25 100H126L326 381L526 100H627L375 449L631 800H530L326 516L122 800H21L277 449Z"},{strokeWidth:58,width:.576,path:"M77 100.0V800.0H158V535.0H289C452 535.0 550 457.0 550 318.0C550 175.0 452 100.0 289 100.0ZM158 463.0V175.0H291C402 175.0 468 220.0 468 319.0C468 412.0 408 463.0 291 463.0Z"},{strokeWidth:0,width:.631,path:"M443 800.0H608L443 527.0C533 499.0 585 431.0 585 330.0C585 188.0 484 100.0 311 100.0H63V800.0H202V554.0H257H302ZM202 442.0V227.0H319C399 227.0 443 265.0 443 337.0C443 410.0 397 442.0 321 442.0Z"},{strokeWidth:0,width:.609,path:"M63 800.0H564V671.0H202V506.0H471V376.0H202V229.0H560V100.0H63Z"},{strokeWidth:58,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"},{strokeWidth:58,width:.593,path:"M35 616.0C57 774.0 192 813.0 310 813.0C466 813.0 558 746.0 558 614.0C558 460.0 430 427.0 326 407.0C226 387.0 138 367.0 138 274.0C138 203.0 189 159.0 291 159.0C394 159.0 451 204.0 470 281.0L548 260.0C518 140.0 422 86.0 292 86.0C145 86.0 55 155.0 55 277.0C55 419.0 177 453.0 272 475.0C359 494.0 475 500.0 475 615.0C475 699.0 413 740.0 311 740.0C204 740.0 121 695.0 113 595.0Z"}]},h2={text:"WELCOME TO",weight:"Bold",units:1e3,letters:[{strokeWidth:0,width:1.065,path:"M662 800.0H846L1050 100.0H883L800 405.0C774 504.0 756 571.0 755 573.0H752C751 571.0 734 508.0 713 428.0L644 166.0H440L370 426.0C349 506.0 332 571.0 331 573.0H327C326 571.0 309 502.0 282 399.0L203 100.0H16L220 800.0H412L489 518.0C516 418.0 529 361.0 530 359.0H534C535 361.0 548 418.0 576 511.0Z"},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"},{strokeWidth:0,width:.569,path:"M56 800.0H538V644.0H224V100.0H56Z"},{strokeWidth:0,width:.749,path:"M559 549.0C531 607.0 474 655.0 382 655.0C274 655.0 197 574.0 197 450.0C197 328.0 269 244.0 383 244.0C458 244.0 515 277.0 551 333.0L717 288.0C670 175.0 552 86.0 391 86.0C182 86.0 28 235.0 28 448.0C28 667.0 182 814.0 391 814.0C543 814.0 672 729.0 724 593.0Z"},{strokeWidth:0,width:.794,path:"M28 450.0C28 664.0 183 814.0 397 814.0C611 814.0 766 664.0 766 450.0C766 236.0 611 86.0 397 86.0C183 86.0 28 236.0 28 450.0ZM197 450.0C197 324.0 281 244.0 397 244.0C513 244.0 597 324.0 597 450.0C597 575.0 513 655.0 397 655.0C281 655.0 197 575.0 197 450.0Z"},{strokeWidth:0,width:.817,path:"M593 800.0H761V100.0H590L413 413.0H410L234 100.0H56V800.0H224V629.0C224 463.0 222 381.0 222 380.0H225C226 381.0 259 444.0 294 506.0L362 627.0H456L524 504.0C558 444.0 592 381.0 593 380.0H595C595 381.0 593 463.0 593 629.0Z"},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.658,path:"M627 256.0V100.0H31V256.0H245V800.0H413V256.0Z"},{strokeWidth:0,width:.794,path:"M28 450.0C28 664.0 183 814.0 397 814.0C611 814.0 766 664.0 766 450.0C766 236.0 611 86.0 397 86.0C183 86.0 28 236.0 28 450.0ZM197 450.0C197 324.0 281 244.0 397 244.0C513 244.0 597 324.0 597 450.0C597 575.0 513 655.0 397 655.0C281 655.0 197 575.0 197 450.0Z"}]},d2={text:"ASTRAL EXPRESS",weight:"Bold",units:1e3,letters:[{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.627,path:"M27 625.0C67 777.0 205 814.0 327 814.0C498 814.0 599 742.0 599 598.0C599 447.0 485 403.0 382 383.0C284 363.0 217 354.0 217 295.0C217 258.0 244 233.0 308 233.0C378 233.0 418 261.0 435 312.0L595 269.0C556 144.0 454 86.0 311 86.0C154 86.0 46 157.0 46 300.0C46 448.0 164 492.0 259 515.0C345 536.0 429 532.0 429 599.0C429 644.0 390 666.0 326 666.0C250 666.0 201 635.0 187 582.0Z"},{strokeWidth:0,width:.658,path:"M627 256.0V100.0H31V256.0H245V800.0H413V256.0Z"},{strokeWidth:0,width:.645,path:"M430 800.0H629L469 536.0C554 504.0 601 433.0 601 337.0C601 192.0 498 100.0 322 100.0H56V800.0H224V569.0H264H299ZM224 435.0V252.0H332C397 252.0 429 287.0 429 345.0C429 404.0 395 435.0 333 435.0Z"},{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.569,path:"M56 800.0H538V644.0H224V100.0H56Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"},{strokeWidth:87,width:.65,path:"M25 100H126L326 381L526 100H627L375 449L631 800H530L326 516L122 800H21L277 449Z"},{strokeWidth:87,width:.576,path:"M77 100.0V800.0H158V535.0H289C452 535.0 550 457.0 550 318.0C550 175.0 452 100.0 289 100.0ZM158 463.0V175.0H291C402 175.0 468 220.0 468 319.0C468 412.0 408 463.0 291 463.0Z"},{strokeWidth:0,width:.645,path:"M430 800.0H629L469 536.0C554 504.0 601 433.0 601 337.0C601 192.0 498 100.0 322 100.0H56V800.0H224V569.0H264H299ZM224 435.0V252.0H332C397 252.0 429 287.0 429 345.0C429 404.0 395 435.0 333 435.0Z"},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"},{strokeWidth:0,width:.627,path:"M27 625.0C67 777.0 205 814.0 327 814.0C498 814.0 599 742.0 599 598.0C599 447.0 485 403.0 382 383.0C284 363.0 217 354.0 217 295.0C217 258.0 244 233.0 308 233.0C378 233.0 418 261.0 435 312.0L595 269.0C556 144.0 454 86.0 311 86.0C154 86.0 46 157.0 46 300.0C46 448.0 164 492.0 259 515.0C345 536.0 429 532.0 429 599.0C429 644.0 390 666.0 326 666.0C250 666.0 201 635.0 187 582.0Z"},{strokeWidth:0,width:.627,path:"M27 625.0C67 777.0 205 814.0 327 814.0C498 814.0 599 742.0 599 598.0C599 447.0 485 403.0 382 383.0C284 363.0 217 354.0 217 295.0C217 258.0 244 233.0 308 233.0C378 233.0 418 261.0 435 312.0L595 269.0C556 144.0 454 86.0 311 86.0C154 86.0 46 157.0 46 300.0C46 448.0 164 492.0 259 515.0C345 536.0 429 532.0 429 599.0C429 644.0 390 666.0 326 666.0C250 666.0 201 635.0 187 582.0Z"}]},u2={text:"INTERNAL DATABASE",weight:"Bold",units:1e3,letters:[{strokeWidth:0,width:.28,path:"M56 800.0H224V100.0H56Z"},{strokeWidth:0,width:.75,path:"M523 800.0H694V100.0H526V343.0C526 419.0 527 509.0 527 510.0H524L226 100.0H56V800.0H224V560.0C224 469.0 222 383.0 222 382.0H225Z"},{strokeWidth:0,width:.658,path:"M627 256.0V100.0H31V256.0H245V800.0H413V256.0Z"},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"},{strokeWidth:0,width:.645,path:"M430 800.0H629L469 536.0C554 504.0 601 433.0 601 337.0C601 192.0 498 100.0 322 100.0H56V800.0H224V569.0H264H299ZM224 435.0V252.0H332C397 252.0 429 287.0 429 345.0C429 404.0 395 435.0 333 435.0Z"},{strokeWidth:0,width:.75,path:"M523 800.0H694V100.0H526V343.0C526 419.0 527 509.0 527 510.0H524L226 100.0H56V800.0H224V560.0C224 469.0 222 383.0 222 382.0H225Z"},{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.569,path:"M56 800.0H538V644.0H224V100.0H56Z"},{strokeWidth:0,width:.25,path:""},{strokeWidth:0,width:.751,path:"M56 100.0V800.0H355C562 800.0 723 665.0 723 453.0C723 242.0 563 100.0 354 100.0ZM224 644.0V256.0H345C449 256.0 554 316.0 554 453.0C554 591.0 449 644.0 345 644.0Z"},{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.658,path:"M627 256.0V100.0H31V256.0H245V800.0H413V256.0Z"},{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.632,path:"M481 423.0C519 409.0 571 360.0 571 282.0C571 185.0 484 100.0 358 100.0H56V800.0H357C531 800.0 608 704.0 608 596.0C608 503.0 549 447.0 481 427.0ZM224 377.0V239.0H325C373 239.0 402 269.0 402 308.0C402 349.0 372 377.0 326 377.0ZM224 661.0V501.0H342C397 501.0 431 531.0 431 581.0C431 628.0 400 661.0 342 661.0Z"},{strokeWidth:0,width:.758,path:"M523 684.0 565 800.0H745L474 100.0H283L13 800.0H190L232 684.0ZM468 531.0H287L337 391.0C359 333.0 375 290.0 376 289.0H379C380 290.0 396 334.0 418 392.0Z"},{strokeWidth:0,width:.627,path:"M27 625.0C67 777.0 205 814.0 327 814.0C498 814.0 599 742.0 599 598.0C599 447.0 485 403.0 382 383.0C284 363.0 217 354.0 217 295.0C217 258.0 244 233.0 308 233.0C378 233.0 418 261.0 435 312.0L595 269.0C556 144.0 454 86.0 311 86.0C154 86.0 46 157.0 46 300.0C46 448.0 164 492.0 259 515.0C345 536.0 429 532.0 429 599.0C429 644.0 390 666.0 326 666.0C250 666.0 201 635.0 187 582.0Z"},{strokeWidth:0,width:.613,path:"M56 800.0H571V644.0H224V516.0H476V376.0H224V256.0H566V100.0H56Z"}]},f2={access:n2,identity:s2,request:r2,processing:a2,processingGlitch:o2,permission:l2,brand:c2,welcome:h2,company:d2,database:u2},p2=new Set;async function m2(){return!1}const Ku="http://www.w3.org/2000/svg";class Er{constructor(e,t){this.host=e,this.label.className="boot-phrase-label",this.phrases=t.map(i=>{const s=f2[i],r=document.createElement("span");r.className="boot-phrase",r.dataset.phrase=i,r.dataset.weight=s.weight,r.setAttribute("aria-hidden","true"),r.hidden=!0;const a=s.letters.map(o=>{const l=document.createElement("span");if(l.className="boot-phrase-letter",l.style.width=`${o.width}em`,o.path){const c=document.createElementNS(Ku,"svg");c.classList.add("boot-letter-art"),c.setAttribute("viewBox",`0 0 ${o.width*s.units} ${s.units}`),c.setAttribute("focusable","false");const h=document.createElementNS(Ku,"path");h.setAttribute("d",o.path),o.strokeWidth&&(h.setAttribute("stroke","currentColor"),h.setAttribute("stroke-width",String(o.strokeWidth)),h.setAttribute("stroke-linejoin","round")),c.append(h),l.append(c)}return r.append(l),l});return{text:s.text,node:r,letters:a,weight:s.weight}}),e.classList.add("has-boot-lettering"),e.replaceChildren(this.label,...this.phrases.map(i=>i.node)),e.dataset.letteringRenderer="artwork",p2.add(this)}host;label=document.createElement("span");phrases;value;useWebfonts(){for(const e of this.phrases)e.node.style.setProperty("--boot-webfont-family",`"Rhine Novecento ${e.weight}"`),e.letters.forEach((t,i)=>{t.replaceChildren(),t.dataset.letter=e.text[i],t.classList.add("boot-font-letter")});this.host.dataset.letteringRenderer="webfont"}setText(e){if(this.value===e)return;this.value=e,this.label.textContent=e;const t=e?this.phrases.find(i=>i.text.startsWith(e)):void 0;this.host.classList.toggle("boot-lettering-fallback",!!(e&&!t));for(const i of this.phrases){const s=i===t;i.node.hidden===s&&(i.node.hidden=!s),s&&i.letters.forEach((r,a)=>{const o=a>=e.length;r.hidden!==o&&(r.hidden=o)})}}}const g2=n=>Math.max(0,Math.min(1,n)),Ya=n=>{const e=g2(n);return e*e*(3-2*e)};function A2(n,e=!0,t=!1){const i={opacity:0,reveal:1,scale:1,angle:0,orbitOpacity:0};if(!e||!Number.isFinite(n)||n<=6.12||n>=9.5)return i;const s=Ya((n-6.12)/.52),r=Ya((n-9.04)/.46),a=Ya((n-6.12)/.92);return{opacity:s*(1-r),reveal:t?1:a,scale:t?1:.94+.06*a,angle:t?0:-22+68*Ya((n-6.12)/3.38),orbitOpacity:t?0:s*(1-r)*.55}}class v2{root=document.createElement("div");mark;orbit;previous="";constructor(e){this.root.className="starrail-intro",this.root.hidden=!0,this.root.setAttribute("aria-hidden","true"),this.root.innerHTML=`<svg class="starrail-intro-orbit" viewBox="0 0 400 230" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><ellipse cx="200" cy="115" rx="185" ry="93" stroke-dasharray="100 27 8 23"/><path d="M17 115h18m330 0h18M200 15v12m0 176v12"/></g><path class="starrail-intro-star" d="M350 43l3 10 10 3-10 3-3 10-3-10-10-3 10-3Z"/></svg><div class="starrail-intro-mark"><img src="${$n("assets/starrail-logo.png")}" alt="" width="238" height="137" decoding="async"/><span>HONKAI: STAR RAIL</span></div>`,e.append(this.root),this.mark=this.root.querySelector(".starrail-intro-mark"),this.orbit=this.root.querySelector(".starrail-intro-orbit")}update(e,t,i){const s=A2(e,t,i),r=`${s.opacity}/${s.reveal}/${s.scale}/${s.angle}/${s.orbitOpacity}`;r!==this.previous&&(this.previous=r,this.root.hidden=s.opacity===0,this.root.style.opacity=String(s.opacity),this.mark.style.transform=`scale(${s.scale})`,this.mark.style.clipPath=`inset(0 ${100*(1-s.reveal)}% 0 0)`,this.orbit.style.transform=`rotate(${s.angle}deg)`,this.orbit.style.opacity=String(s.orbitOpacity))}reset(){this.previous="",this.root.hidden=!0,this.root.style.opacity="0"}}const ja="http://www.w3.org/2000/svg",wr=(n,e,t,i=960,s=540)=>{const r=a=>`${i+Math.cos(a)*n},${s+Math.sin(a)*n}`;return t>=Math.PI*1.999?`M${r(e)}A${n},${n} 0 1 1 ${r(e+Math.PI)}A${n},${n} 0 1 1 ${r(e+Math.PI*2)}`:`M${r(e)}A${n},${n} 0 ${t>Math.PI?1:0} 1 ${r(e+t)}`};class x2{constructor(e){this.stage=e,this.starrailIntro=new v2(e.querySelector("#boot")),[".access-text",".boot-logo",".auth-status","#auth-message",".scan",".scan > span",".welcome",".welcome-heading",".welcome-panel",".welcome-company",".welcome-highlight",".welcome-database",".welcome-logo",".brand",".powered","#boot-background",".boot-background svg",".boot-white"].forEach(a=>this.nodes.set(a,e.querySelector(a)));const t=e.querySelector(".boot-logo svg"),i=t.querySelector("path");this.contour=i,this.contour.setAttribute("d",ny),this.contour.setAttribute("pathLength","1");const s=t.querySelector("path:not([pathLength])");this.plus=document.createElementNS(ja,"path"),this.plus.setAttribute("d","M44 70h50M69 45v50"),this.minus=document.createElementNS(ja,"path"),this.minus.setAttribute("d","M219 70h44"),[this.plus,this.minus].forEach(a=>{a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","15"),t.insertBefore(a,s)}),s.remove(),this.letters=t.querySelector("text"),this.letters.setAttribute("text-anchor","start"),this.letters.setAttribute("x","20"),this.brandLines=Array.from(e.querySelector(".brand").children),this.scanPaths=Array.from(e.querySelectorAll(".scan path")),this.orbitDots=Array.from(e.querySelectorAll(".scan .orbit-dot")),this.core=e.querySelector(".scan .scan-core"),this.core.setAttribute("cx","959.5"),this.core.setAttribute("cy","539.5"),this.satellites=Array.from({length:6},()=>{const a=document.createElementNS(ja,"circle");return a.classList.add("satellite-dot"),a.setAttribute("fill","#080a08"),a.setAttribute("stroke","none"),this.core.parentElement.insertBefore(a,this.core),a}),this.caps=["#080a08","#fff"].map(a=>{const o=document.createElementNS(ja,"circle");return o.setAttribute("fill",a),o.setAttribute("stroke","none"),this.core.parentElement.appendChild(o),o}),this.companyInk=Array.from(e.querySelectorAll(".welcome-company strong")),this.companyInk.forEach(a=>{const o=document.createElement("span");o.textContent=a.textContent,a.replaceChildren(o)}),this.poweredHTML=this.el(".powered").innerHTML,new Er(this.brandLines[0],["brand"]).setText("ASTRAL EXPRESS"),this.accessLettering=new Er(this.el(".access-text"),["access"]);const r=document.createElement("span");r.className="access-wish",r.textContent="愿此行，终抵群星",this.el(".access-text").append(r),this.authLettering=new Er(this.el("#auth-message"),["identity","request","processing","processingGlitch"]);for(const[a,o,l]of[[".scan > span","permission","PERMISSION AUTHORIZED"],[".welcome-heading","welcome","WELCOME TO"],[".welcome-database","database","INTERNAL DATABASE"]])new Er(this.el(a),[o]).setText(l);this.companyInk.forEach(a=>new Er(a.querySelector("span"),["company"]).setText("ASTRAL EXPRESS"))}stage;starrailIntro;nodes=new Map;contour;letters;plus;minus;brandLines;scanPaths;orbitDots;core;satellites;caps;companyInk;poweredHTML;accessLettering;authLettering;el(e){return this.nodes.get(e)}opacity(e,t){this.el(e).style.opacity=String(Number(t))}update(e,t=!0,i=!1){this.starrailIntro.update(e,t,i);const s=Mp(e),r=s.t;return this.stage.dataset.bootFrame=String(s.f),this.accessLettering.setText(s.access),this.opacity(".access-text",s.accessOpacity),this.opacity(".boot-logo",s.logoOpacity),this.el(".boot-logo").style.transform=`translate(${s.logo.offsetX}px, 1px)`,this.contour.style.strokeDasharray=`${s.logo.length} ${1-s.logo.length}`,this.contour.style.strokeDashoffset=String(-s.logo.start),this.contour.setAttribute("stroke-width",String(s.logo.strokeWidth)),this.letters.textContent!==s.logoLetters&&(this.letters.textContent=s.logoLetters),this.plus.style.opacity=this.minus.style.opacity=s.logo.symbolScale>0?"1":"0",this.plus.setAttribute("transform",`translate(${s.logo.plusX} 70) rotate(${s.logo.plusAngle}) scale(${s.logo.symbolScale}) translate(-69 -70)`),this.minus.setAttribute("d",`M${-s.logo.minusWidth/2} 0h${s.logo.minusWidth}`),this.minus.setAttribute("transform",`translate(${s.logo.minusX} 70) scale(${s.logo.symbolScale})`),this.opacity(".auth-status",s.authOpacity),this.authLettering.setText(s.auth),this.opacity(".brand",1),this.el(".brand").style.transform="none",this.brandLines.forEach((a,o)=>{a.style.opacity=String(s.brand[o].opacity),a.style.transform=`translateX(${s.brand[o].x}px)`}),this.opacity(".powered",s.poweredLetters>0),this.el(".powered").style.clipPath=`inset(0 ${100*(1-s.poweredLetters/25)}% 0 0)`,this.opacity(".scan",s.scanVisible),s.scanVisible&&this.renderScan(s),this.opacity(".welcome",s.welcomeVisible?s.welcomeOpacity:0),this.el(".welcome").style.transform=`scale(${s.welcomeScale})`,this.el(".welcome").style.filter=`blur(${s.exitBlur}px) invert(${s.exit*.22}) sepia(${s.exit}) saturate(${1+s.exit*5}) hue-rotate(${s.exit*115}deg)`,this.opacity(".welcome-panel",s.welcomePanel),this.opacity(".welcome-heading",1),this.el(".welcome-heading").style.color=yp>1e-4?"var(--theme-ink)":`rgb(${255*(1-s.welcomeInk)} ${255*(1-s.welcomeInk)} ${255*(1-s.welcomeInk)})`,this.opacity(".welcome-company",s.companyVisible),this.el(".welcome-company").style.opacity=String(s.companyVisible?s.companyMask?.65:1:0),this.companyInk[1].querySelector("span").style.opacity=s.companyMask?".06":"1",this.el(".welcome-highlight").style.clipPath=`inset(0 ${100*(1-s.highlight)}% 0 0)`,this.opacity(".welcome-database",s.databaseOpacity),this.opacity(".welcome-logo",s.welcomeLogo),this.opacity("#boot-background",s.backgroundOpacity),this.opacity(".boot-white",s.white),this.el(".boot-background svg").style.transform=`translate(${Math.sin(r*.16)*18}px, ${-(r-6)*5}px) scale(1.08)`,s}renderScan(e){const{scan:t}=e,i=t.radius,s=this.scanPaths[0].parentElement;s.setAttribute("transform",`translate(960 540) scale(${e.ringScale}) translate(-960 -540)`),s.style.opacity=String(e.ringOpacity),s.style.filter=`blur(${e.ringBlur}px)`,this.scanPaths[0].setAttribute("d",wr(i,t.outerStart,t.outerSweep)),this.scanPaths[0].setAttribute("stroke-width","2.4"),this.scanPaths[1].setAttribute("d",wr(t.whiteRadius,t.whiteStart,t.whiteSweep)),this.scanPaths[1].setAttribute("stroke-width","4");const r=t.innerStart;this.scanPaths[2].setAttribute("d",wr(t.innerRadius,r,t.innerSweep)),this.scanPaths[3].setAttribute("d",wr(t.innerRadius,r+Math.PI,t.innerSweep)),e.scanOrbit.sides.forEach((o,l)=>{this.scanPaths[l+4].setAttribute("d",wr(o.radius,o.start,o.sweep,o.x,o.y)),this.scanPaths[l+4].style.opacity=e.scanOrbit.sideVisible?"1":"0"}),e.scanOrbit.satellites.forEach((o,l)=>{const c=this.satellites[l];c.setAttribute("cx",String(o.x)),c.setAttribute("cy",String(o.y)),c.setAttribute("r",String(o.radius))}),this.core.style.opacity=e.ornament?"1":"0",this.core.setAttribute("r",String(e.coreRadius));const a=t.orbit;this.orbitDots.forEach((o,l)=>{o.setAttribute("cx",String(960+Math.cos(a+l*Math.PI)*t.orbitRadius)),o.setAttribute("cy",String(540+Math.sin(a+l*Math.PI)*t.orbitRadius)),o.setAttribute("r",String(t.dotRadius))}),this.caps.forEach((o,l)=>{const c=l?t.whiteStart:t.outerStart+t.outerSweep,h=l?t.whiteRadius:i;o.setAttribute("cx",String(960+Math.cos(c)*h)),o.setAttribute("cy",String(540+Math.sin(c)*h)),o.setAttribute("r",String(l?t.whiteCap:t.blackCap))}),this.opacity(".scan > span",e.permissionOpacity),this.el(".scan > span").style.letterSpacing=`${e.scanTracking}px`,this.el(".scan > span").style.setProperty("--boot-phrase-tracking",`${e.scanTracking}px`),this.el(".scan > span").style.fontSize=`${e.scanFont}px`}reset(){this.starrailIntro.reset(),[".brand",".powered"].forEach(e=>this.el(e).removeAttribute("style")),this.brandLines.forEach(e=>e.removeAttribute("style")),this.el(".powered").innerHTML=this.poweredHTML,this.opacity("#boot-background",0)}}const _2=[[170,187],[282,295],[320,339],[367,389],[423,440],[449,457]].flatMap(([n,e])=>{const t=[];let i=0;for(let s=n;s<=e;s++){const r=Mp(s/25-5),o=(s<200?r.access:r.auth).replace(/\s/g,"").length;o>i&&t.push(s),i=o}return t});function M2(n,e){return _2.some(t=>t/25>n+1e-6&&t/25<=e+1e-6)}const y2=48e3,b2=["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+f/8/xYAGwDx/+7/GAAYAP//CwAWAAcACAAOAAIAAQACAOv/6P/+//X/8f8qAEkAEgDp//7/EAAMAAsA///x//7/DwD+/+f/7v/+//3/BwAkACcADAD+//3/9P/t/+X/4f/4/wwA/f/0//r/7//6/x4ADgDk//f/GAAAAOb/+f8MAAYAAQANAA8A5//M//3/LAD9/8//AwAyAAYA3P/y/wUA+/8AAAIA5//e/wQAHAAHAP7/EQAHAOT/6v8RAAsA2f/L//D/+P/Y/+b/GQAJANH/3f8LAA4ADQAfABgA/f/7/xQAJQAXAPv/8f/r/+D/+f8aAP3/3f8IADAAFgD9/wIAAgAKACAAJQATAPr/5//u//3/AQAHAAwA+v/t//f///8AAAcAEwAeABwAEAAWACkAIQAPABcAIAAWAA8ADAAJAAEA7v/g/+n/8P/y////+//m/+n/9f/9/wsA9v/N/+H/CAD1/+n//P/x/+n/AAD//wEAIAASAOX/6v8AAAEABgD5/93/5/8EABIAFAAIAAgAIgAfAAcAGwAxABsADwARAPn/7v8CAAsABwAEAP3/8f/f/9X/5v/f/7r/y//9//7/AwAlAA0A7/8jAEQAKgA8AE0AKQA4AGAAMgASADcAHADd//7/OwA2AA8A6//f/9X/s//I/wwA9v/I//T/+f+8/9L/5v+c/6D/AwAbAAkAHQAaAAIAAwALAB8ANgAuAB4AEQD5/+//6P/J/83/7//o/+r/FwASAPL/DwAeAPL/6f8FAP3/8P/3//L/9P8MAA0A7//m//n////o/+b/GwA/ACAAGQBKAFIAOgBEADYAAAD1//f/1v/P//L/GgBGAE8AKQAsAE0ANAAGAPH/5P/q//H/3f/t/wUA3P/Q//X/2P/B//7/EADv//X/5P/B/+X/BQD8/xQAGwD4/wYALwA6AEAAJQDu//r/HQASABkAJgABAO7/8v/S/9D/BAASAP3/7//X/9P/8P8GABIAEADv/+v/FAAdAAsABADo/87/7/8UABYAGgAOAO7/+f8aABYADwAaABUAAgD//wUACAABAPb/9f/z//D/AwAbABEA/P/5//3/CQAYAA4A9//z//v/+//7//3/+v/7/wAAAQADAAcACAABAPb/8/8AABEAGgAbABMABQAGABMAFQALAAQA/v/4//r///8BAAEAAgAAAP//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/P8CABYAIwAfABIAFAAdAAsA+f8MACAAGwARAAQAAAASABYADQAhACgABgD7/wYAAwASACcADgDr/+j/9P8CAP//8P8CABUA9f/l/wIAAgD1/wYAEAAZADgANAAKAP3/AQAAAAkA9v/O/+H/BgDv/9r/9P8IABMAJgAcAAYAAgD5/+P/yf+q/7r/8v/o/7X/xP/k/+L/8v/+/+X/3//r/+n/8f/+/wYAHQAYAPz/DAAXAO7/6v8KAA8AGgATAOj/AAAuAP3/6f8jABcA9f8dACEACgAzADsA/P/h//D/EgA9ACcABgA7AFcAIAARABUA5v/e/wkACQD3//z//f8FABYAEQACAPj/AwBBAGAAHgDs//z/8v/o/xgAIwD1/+3/9v/p//P/9f/O/9L/7//P/87/FAAMAL//w//s/9v/y//i/+7/z/+l/73/DAARAN3/9f8aAPT/+f8/AD4ACgDy/9f/xv/b/+z/AwAlAP7/xv/9/1wAegBwAEIA/f8CAFkAmwCCAB8A0P/W//D/BwBOAGAA+v/X/yoANwAKAAgA2f+R/7v/DAAlADkAJADZ/8P/3//x/w8AFAD4/wkACgDV/+X/EwDy/9n/2v/E/+7/IwD0//D/EACX/z//zv9LADYAHAD2/8P/2P8GACsAOADh/53/5f8CANL/AQAdAMT/vP8QADoAXwBQAMv/jP/S/woAMABPACcADQAlABoAJwBhAEIA+//9/wkAJQBgADAAxf/E/9L/s//o/zYALwA9AGgAOADz/wIAMQA3AP//y//4/y8ADQD0/wMA6v/t/ysAKADv/97/3//3/ycAEgDX/+P/+P/S/8H/6P8QABYA6/+3/7r/2//5/xAA9//I/+L/EAAAAPr/BADK/6L/0f/c/7j/6f82ACkADwAjACkANABWAEMAAQDj/+T/6//9/wQA//8JAA4ACwAWABgAFgAnAB4ABAAXACkAFAAlAEcAKwAMABMABwDn/+H/9/8cACoAEQACAP//8v8CABwABAD3/xEACwD5/w0ACgDt//X/BgAHABQADwDz/+3/7v/n//f/BADw/+j/9//7//T/6//m//D/8P/l//3/HwAXAAYABgD///T/9//8/wQADQAFAPf/9v/5//z/AgABAAIACQADAP//DAAIAPL/8/8BAAAABQAPAAcA//8GAAcAAAADAAsACAD///7/AwAFAAEAAAABAAAAAQACAAEAAQACAAAA/v8AAAIAAQABAAEAAAD//wAAAQAAAAAA"],Qu=["atmosphere","motif","pulse"],Ju=160/3,$u=new WeakMap,ef=new WeakMap;function S2(n){let e=ef.get(n);return e||(e={buffers:b2.map(t=>{const i=atob(t),s=n.createBuffer(1,i.length/2,y2),r=s.getChannelData(0);for(let a=0;a<r.length;a++){const o=i.charCodeAt(a*2)|i.charCodeAt(a*2+1)<<8;r[a]=(o>32767?o-65536:o)/32768}return s}),next:0},ef.set(n,e)),e.buffers[e.next++%e.buffers.length]}const tf=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0)),Rs=(n,e,t,i=.05)=>{n.cancelAndHoldAtTime(t),n.linearRampToValueAtTime(e,t+i)},E2=[{time:9.16,sound:"brand"},{time:11.84,sound:"confirm"},{time:19.48,sound:"scan"},{time:21.84,sound:"confirm"},{time:22.76,sound:"welcome"},{time:23.52,sound:"text-reveal"},{time:25.04,sound:"text-reveal"},{time:26.92,sound:"array"},{time:30.68,sound:"open"},{time:34.3,sound:"inspect"}];function w2(n,e,t,i,s=0){const r=n.createGain(),a=n.createStereoPanner();a.pan.value=Math.max(-.65,Math.min(.65,s)),r.connect(a),a.connect(e);const o=[];let l=0,c=i;const h=(m,A,p,g,_,E=.006,M=!1)=>{const b=n.createGain(),w=i+g;M?b.gain.setValueAtTime(p,w):(b.gain.setValueAtTime(0,w),b.gain.linearRampToValueAtTime(p,w+Math.min(E,_*.3)),b.gain.exponentialRampToValueAtTime(1e-5,w+_),b.gain.linearRampToValueAtTime(0,w+_+.012)),A.connect(b),b.connect(r),o.push(m),l++,m.onended=()=>{m.disconnect(),A.disconnect(),b.disconnect(),--l===0&&(r.disconnect(),a.disconnect())},m.start(w),m.stop(w+_+.015),c=Math.max(c,w+_+.015)},u=(m,A,p,g,_=0,E=.006)=>{const M=n.createOscillator();M.frequency.setValueAtTime(m,i+_),M.frequency.exponentialRampToValueAtTime(A,i+_+g),h(M,M,p,_,g,E)},d=(m,A,p,g,_=0,E=.008)=>{let M=$u.get(n);if(!M){M=n.createBuffer(1,n.sampleRate*2,n.sampleRate);const D=M.getChannelData(0);let x=773;for(let S=0;S<D.length;S++)x=Math.imul(x,1664525)+1013904223>>>0,D[S]=x/2147483648-1;$u.set(n,M)}const b=n.createBufferSource(),w=n.createBiquadFilter();b.buffer=M,w.type="bandpass",w.Q.value=.8,w.frequency.setValueAtTime(m,i+_),w.frequency.exponentialRampToValueAtTime(A,i+_+g),b.connect(w),h(b,w,p,_,g,E)},f=(m,A,p,g=0)=>{const _=[[1,1,1],[1.47,.39,.66],[2.09,.21,.4],[2.73,.095,.25],[3.86,.035,.15]];for(const[E,M,b]of _){const w=m*E;w>Math.min(8500,n.sampleRate*.42)||u(w,w,A*M,p*b,g,.0012)}d(4800,3600,A*.24,.013,g,8e-4)};switch(t){case"page-open":d(700,1800,.065,.18,0,.025),u(360,480,.032,.16,0,.014),u(960,960,.009,.075,.06,.01);break;case"page-close":d(1300,600,.05,.13,0,.014),u(420,280,.027,.13,0,.01);break;case"ui-tick":d(1500,1200,.042,.036,0,.003),u(820,820,.022,.052,0,.003);break;case"brand":u(146.83,146.83,.039,.72,0,.08),u(293.66,293.66,.03,.62,.07,.07),u(440,440,.022,.54,.17,.055),d(420,1750,.036,.7,0,.13);break;case"text-reveal":d(2100,1300,.033,.064,0,.005),u(1050,1050,.012,.06,0,.005);break;case"key":{const m=n.createBufferSource();m.buffer=S2(n),h(m,m,.2,0,m.buffer.duration,0,!0);break}case"tick":f(1680,.064,.24);break;case"column":f(1280,.065,.32),f(2050,.016,.18,.045);break;case"open":f(1150,.071,.58),f(2180,.025,.36,.16),d(3100,4400,.014,.25,.035,.025);break;case"confirm":u(640,640,.039,.095,0,.008),u(960,960,.026,.15,.095,.009);break;case"back":f(1120,.066,.22),u(560,560,.012,.1,.025,.002);break;case"scan":d(1800,3400,.025,.8,0,.12);for(let m=0;m<4;m++)u(760,760,.025,.064,m*.19+.15,.007);break;case"welcome":[293.66,440,659.25,739.99].forEach((m,A)=>u(m,m,.034,1.6,A*.095,.05)),d(600,1800,.065,.9,0,.15);break;case"array":d(1600,3300,.025,.8,0,.12);for(let m=0;m<5;m++)f(1180+m*170,.043-m*.005,.31,.05+m*.105);break;case"inspect":u(1120,1120,.026,.055,0,.005),u(1120,1120,.018,.055,.11,.005);break;case"explode":[1220,1680,2260].forEach((m,A)=>f(m,.054-A*.01,.4-A*.055,A*.115));break;case"assemble":[2260,1680,1220].forEach((m,A)=>f(m,.035+A*.008,.2,A*.095));break}return{end:c,stop(m){Rs(r.gain,0,m,.018);for(const A of o)try{A.stop(m+.02)}catch{}}}}class T2{prefs={sound:!1,music:!1,soundVolume:.55,musicVolume:.5};context;effects;musicBus;duck;stemGains=[];buffers;loading;fetching;musicData;tracks=[];voices=[];lastSound=new Map;scene="boot";offset=0;startedAt=0;unlocked=!1;disposed=!1;bootTime=null;error="";requestId=0;suspension=Promise.resolve();bootMix=-1;playedKeys=0;entryPending=!1;hostPaused=!1;setHostPaused(e){this.hostPaused=e,e?this.hide():this.visibility()}constructor(){document.addEventListener("pointerdown",this.gesture,{capture:!0}),document.addEventListener("keydown",this.gesture,{capture:!0}),document.addEventListener("visibilitychange",this.visibility),window.addEventListener("pagehide",this.hide),window.addEventListener("pageshow",this.visibility)}gesture=()=>{this.entryPending||(this.unlocked=!0,this.activate())};holdForEntry(){this.entryPending=!0}releaseEntry(){this.entryPending=!1}cancelEntry(){this.hide()}async unlock(){return this.unlocked=!0,await this.activate(),this.context?.state==="running"&&(!this.prefs.music||!!this.buffers)}prepareMusic(){return this.musicData?Promise.resolve(this.musicData):(this.fetching??=Promise.all(Qu.map(async e=>{const t=new AbortController,i=setTimeout(()=>t.abort(),15e3);try{const s=await fetch($n(`audio/${e}.ogg`),{signal:t.signal});if(!s.ok)throw new Error(`Music ${e}: ${s.status}`);return await s.arrayBuffer()}finally{clearTimeout(i)}})).then(e=>this.musicData=e).finally(()=>{this.fetching=void 0}),this.fetching)}restartBoot(){this.stopEffects(),this.bootTime=6.76,this.bootMix=-1}hide=()=>{this.requestId++,this.stopMusic(),this.stopEffects(),this.suspension=this.context?.suspend().catch(()=>{})??Promise.resolve()};visibility=()=>{this.bootTime=null,document.hidden?this.hide():this.unlocked&&!this.entryPending&&this.activate()};configure(e){this.prefs={sound:!!e.sound,music:!!e.music,soundVolume:tf(e.soundVolume),musicVolume:tf(e.musicVolume)},this.context&&(Rs(this.effects.gain,this.prefs.sound?this.prefs.soundVolume:0,this.context.currentTime),Rs(this.musicBus.gain,this.prefs.music?this.prefs.musicVolume:0,this.context.currentTime,.2)),this.prefs.sound||this.stopEffects(),this.prefs.music||this.stopMusic(),!this.prefs.sound&&!this.prefs.music?this.hide():this.unlocked&&!this.entryPending&&this.activate()}createContext(){const e=this.context=new AudioContext,t=e.createGain(),i=e.createDynamicsCompressor();return t.gain.value=.8,i.threshold.value=-8,i.knee.value=8,i.ratio.value=6,i.attack.value=.003,i.release.value=.18,this.effects=e.createGain(),this.musicBus=e.createGain(),this.duck=e.createGain(),this.effects.gain.value=this.prefs.sound?this.prefs.soundVolume:0,this.musicBus.gain.value=this.prefs.music?this.prefs.musicVolume:0,this.effects.connect(t),this.musicBus.connect(this.duck),this.duck.connect(t),t.connect(i),i.connect(e.destination),this.stemGains=Qu.map(()=>{const s=e.createGain();return s.gain.value=0,s.connect(this.musicBus),s}),this.mixScene(),e}async activate(){if(this.disposed||this.hostPaused||document.hidden||!this.unlocked||!this.prefs.sound&&!this.prefs.music)return;const e=++this.requestId;try{const t=this.context??this.createContext(),i=t.state==="running"?Promise.resolve():t.resume();if(await Promise.all([this.suspension,i]),e!==this.requestId||this.disposed||document.hidden||t.state!=="running"||e!==this.requestId||document.hidden||this.disposed)return;this.prefs.music&&(await this.loadMusic(t),e===this.requestId&&this.startMusic())}catch(t){this.error=t instanceof Error?t.message:"Audio unavailable"}}loadMusic(e){return this.buffers?Promise.resolve():(this.loading??=this.prepareMusic().then(t=>Promise.all(t.map(i=>e.decodeAudioData(i.slice(0))))).then(t=>{this.buffers=t,this.error=""}).finally(()=>{this.loading=void 0}),this.loading)}startMusic(){const e=this.context;!e||e.state!=="running"||!this.buffers||this.hostPaused||this.tracks.length||!this.prefs.music||this.disposed||document.hidden||(this.startedAt=e.currentTime+.04,this.tracks=this.buffers.map((t,i)=>{const s=e.createBufferSource();return s.buffer=t,s.loop=!0,s.loopStart=0,s.loopEnd=Math.min(Ju,t.duration),s.connect(this.stemGains[i]),s.start(this.startedAt,this.offset%s.loopEnd),s}),this.musicBus.gain.cancelScheduledValues(e.currentTime),this.musicBus.gain.setValueAtTime(0,e.currentTime),this.musicBus.gain.linearRampToValueAtTime(this.prefs.musicVolume,e.currentTime+1.2))}stopMusic(){const e=this.context;!e||!this.tracks.length||(this.offset=(this.offset+Math.max(0,e.currentTime-this.startedAt))%Ju,this.tracks.forEach((t,i)=>{const s=e.createGain();t.disconnect(),t.connect(s),s.connect(this.stemGains[i]),s.gain.setValueAtTime(1,e.currentTime),s.gain.linearRampToValueAtTime(0,e.currentTime+.06),t.stop(e.currentTime+.07),t.onended=()=>{t.disconnect(),s.disconnect()}}),this.tracks=[])}stopEffects(){this.context&&this.voices.forEach(e=>e.stop(this.context.currentTime)),this.voices=[],this.lastSound.clear()}setScene(e){this.scene!==e&&(this.scene=e,this.bootTime=null,this.bootMix=-1,this.stopEffects(),this.mixScene())}mixScene(){if(!this.context)return;const e={boot:[.48,.32,.18],archive:[.9,.72,.65],detail:[.72,.36,.12],viewer:[.8,.24,.28]}[this.scene];this.stemGains.forEach((t,i)=>Rs(t.gain,e[i],this.context.currentTime,1.1))}play(e="tick",t=0){const i=this.context;if(!this.prefs.sound||this.hostPaused||!i||i.state!=="running"||document.hidden||this.disposed)return;const s=i.currentTime,r=e==="key"?.024:e==="tick"||e==="column"?.055:.12;if(s-(this.lastSound.get(e)??-1/0)<r)return;this.lastSound.set(e,s),this.voices=this.voices.filter(o=>o.end>s),this.voices.length>=10&&this.voices.shift().stop(s);const a=w2(i,this.effects,e,s+.004,t);this.voices.push(a),this.prefs.soundVolume>0&&window.dispatchEvent(new CustomEvent("rhine-local-sound",{detail:{until:performance.now()/1e3+Math.max(0,a.end-s)+.2}})),e==="key"&&this.playedKeys++,["open","brand","welcome","array","explode","assemble"].includes(e)&&(Rs(this.duck.gain,.65,s,.035),this.duck.gain.linearRampToValueAtTime(1,s+.9))}updateBoot(e,t=!1){const i=e+5,s=this.bootTime;this.bootTime=i;const r=i<22.76?0:i<26.92?1:i<34.3?2:3;if(r!==this.bootMix&&this.context){this.bootMix=r;const a=[[.48,.32,.18],[.68,.55,.32],[.9,.72,.65],[.72,.36,.12]][r];this.stemGains.forEach((o,l)=>Rs(o.gain,a[l],this.context.currentTime,.9))}if(t||s===null||i<s||i-s>.3){this.stopEffects();return}for(const a of E2)a.time>s&&a.time<=i&&this.play(a.sound);M2(s,i)&&this.play("key")}stats(){return{state:this.context?.state??"locked",scene:this.scene,tracks:this.tracks.length,voices:this.voices.filter(e=>e.end>(this.context?.currentTime??0)).length,loaded:!!this.buffers,playedKeys:this.playedKeys,error:this.error,preferences:{...this.prefs}}}dispose(){this.disposed=!0,this.requestId++,this.stopMusic(),this.stopEffects(),document.removeEventListener("pointerdown",this.gesture,!0),document.removeEventListener("keydown",this.gesture,!0),document.removeEventListener("visibilitychange",this.visibility),window.removeEventListener("pagehide",this.hide),window.removeEventListener("pageshow",this.visibility),this.context?.close()}}function C2(n){return`<div class="audio-settings">${[["sound","soundVolume","INTERFACE SOUND","操作与启动音效"],["music","musicVolume","BACKGROUND MUSIC","观测室 · 背景音乐"]].map(([e,t,i,s])=>`<div class="audio-setting">
    <label class="audio-toggle"><div><strong>${i}</strong><span>${s}</span></div><input type="checkbox" data-pref="${e}" ${n[e]?"checked":""}/><i class="toggle"></i></label>
    <label class="audio-volume"><span>${e==="sound"?"音效":"音乐"}音量</span><input aria-label="${e==="sound"?"音效":"音乐"}音量" data-volume="${t}" type="range" min="0" max="100" step="1" value="${Math.round(n[t]*100)}"/><output>${Math.round(n[t]*100)}%</output></label>
  </div>`).join("")}</div>`}class R2{constructor(e){this.options=e;const{root:t}=e;t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","进入星穹列车档案终端"),t.insertAdjacentHTML("beforeend",'<div class="entry-controls"><button class="entry-start" disabled>正在准备终端…</button><button class="entry-silent" hidden>关闭声音并进入</button><p class="entry-status" role="status">资源就绪后即可进入</p></div>'),this.button=t.querySelector(".entry-start"),this.silent=t.querySelector(".entry-silent"),this.status=t.querySelector(".entry-status"),t.addEventListener("click",i=>{i.stopPropagation(),i.target.closest(".entry-silent")?(this.request++,e.cancel(),this.finish(!0)):(this.state==="waiting"||this.state==="error")&&this.enter()}),t.addEventListener("keydown",i=>{if(i.stopPropagation(),i.key==="Tab"){const s=[this.button,this.silent].filter(a=>!a.disabled&&!a.hidden);if(!s.length){i.preventDefault();return}const r=s.indexOf(document.activeElement);i.preventDefault(),s[(r+(i.shiftKey?s.length-1:1))%s.length].focus()}})}options;state="loading";request=0;button;silent;status;get phase(){return this.state}ready(){this.state="waiting",this.options.root.dataset.entry="waiting",this.button.disabled=!1,this.button.textContent="点击进入 →",this.options.root.querySelector(":scope > span").textContent="INTERNAL DATABASE / READY",this.status.textContent="轻触屏幕或按 Enter 开始",this.button.focus({preventScroll:!0})}async enter(){const e=++this.request;this.state="starting",this.options.root.dataset.entry="starting",this.button.setAttribute("aria-disabled","true"),this.button.textContent="正在准备声音…",this.status.textContent="准备完成后开始播放",this.silent.hidden=!1;let t;try{const i=await Promise.race([this.options.unlock(),new Promise(s=>{t=setTimeout(()=>s(!1),2e4)})]);if(e!==this.request)return;i&&!document.hidden?this.finish(!1):(this.options.cancel(),this.state="error",this.options.root.dataset.entry="error",this.button.removeAttribute("aria-disabled"),this.button.textContent="重试声音并进入 →",this.status.textContent="声音暂未就绪，请重试或无声进入")}catch{if(e!==this.request)return;this.options.cancel(),this.state="error",this.options.root.dataset.entry="error",this.button.removeAttribute("aria-disabled"),this.button.textContent="重试声音并进入 →",this.status.textContent="声音暂未就绪，请重试或无声进入"}finally{clearTimeout(t)}}finish(e){this.state!=="started"&&(this.state="started",this.options.start(e))}}document.createElement("canvas").getContext("2d");let Qc;const Q=n=>document.querySelector(n);Q("#stage").innerHTML=`
  <div id="three-scene" class="three-scene"></div>
  <div class="scene-atmosphere archive-atmosphere"></div>
  <div id="boot-background" class="boot-background"><svg viewBox="0 0 1920 1080" preserveAspectRatio="none"><g fill="none" stroke="#fff" stroke-width="3"><path d="M-210 705C-45 705 182 704 247 567C337 377 99 306 4 435S27 680 169 631C309 584 227 314 279 111S568-113 568-113"/><path d="M1560-80C1374 114 1671 168 1601 323S1371 367 1431 480S1692 666 1559 787S1329 886 1498 1130"/><circle cx="1450" cy="648" r="346"/><circle cx="1450" cy="648" r="348"/></g></svg></div>
  <header class="brand">${ry}</header>
  <nav class="system-nav" aria-label="系统导航">
    <button data-action="search"><span class="nav-glyph">⌕</span> ARCHIVE INDEX <span class="key">/</span></button>
    <button data-action="saved" aria-label="查看收藏档案" title="收藏档案">＋ SAVED <span id="saved-count">00</span></button>
    <button class="settings-button" data-action="settings" aria-label="系统设置" title="系统设置"><span class="settings-glyph" aria-hidden="true">◷</span><span class="settings-label">设置</span></button>
  </nav>
  <button id="skip" class="skip" data-action="skip">ENTER SYSTEM <span>↗</span></button>
  <section id="boot" class="boot" aria-label="系统启动">
    <div class="access-text">ACCESS</div>
    <div class="boot-logo">${zl}</div>
    <div class="auth-status"><span>▪</span> <span id="auth-message"></span><i></i></div>
    <div class="scan"><svg viewBox="0 0 1920 1080" aria-hidden="true"><g fill="none" stroke="#080a08" stroke-width="2" stroke-linecap="round"><path/><path stroke="#fff"/><path/><path/><path/><path/><circle class="orbit-dot" r="8" fill="#ed821b" stroke="none"/><circle class="orbit-dot" r="8" fill="#ed821b" stroke="none"/><circle class="scan-core" cx="960" cy="540" r="5" fill="#080a08" stroke="none"/></g></svg><span>PERMISSION AUTHORIZED</span></div>
    <div class="welcome"><div class="welcome-panel"></div><div class="welcome-heading">WELCOME TO</div><div class="welcome-company"><strong>ASTRAL EXPRESS</strong><strong class="welcome-highlight" aria-hidden="true">ASTRAL EXPRESS</strong></div><div class="welcome-database">INTERNAL DATABASE</div><div class="welcome-logo">${zl}</div></div>
  </section>
  <svg id="inspection-marks" viewBox="0 0 1920 1080" aria-hidden="true"><path id="inspection-lines"/><g id="inspection-corners"></g><circle id="inspection-point" r="1.8"/></svg>
  <div id="inspection-text" aria-hidden="true">CONFIDENTIALITY:<strong>TRAILBLAZE REFERENCE</strong></div>
  <section id="archive-ui" class="archive-ui" aria-label="档案选择">
    <div class="archive-callout"><div class="eyebrow">INTERNAL DATABASE <span>／</span> <span id="archive-category">书籍与回声</span></div><button class="file-title" data-action="open">FILE NUMBER: <span id="selected-id">X-<span id="selected-code">037</span></span><span class="file-open">↗</span></button><div class="callout-rule"><i></i></div><div class="file-summary"><span id="selected-title">愿此行，终抵群星</span><span id="selected-clearance">TRAILBLAZE ARCHIVE</span></div><button class="read-file" data-action="open">ACCESS FILE <span>→</span></button></div>
    <div id="hover-label" class="hover-label" hidden>X-<span id="hover-code">001</span> / <span id="hover-title"></span></div>
    <div class="archive-counter"><span class="tiny-label">ARCHIVE / SELECT</span><div><span id="selected-number">01</span><i>/</i><span class="count-total">12</span></div></div>
    <div class="archive-navigation"><button data-action="prev" aria-label="上一个档案">↑</button><div id="file-ticks" class="file-ticks"></div><button data-action="next" aria-label="下一个档案">↓</button></div>
    <div class="column-navigation"><button data-action="column-prev" aria-label="上一列">←</button><div><span id="column-number">COLUMN <span id="column-index">03</span> / 05</span><strong id="column-name">书籍与回声</strong></div><button data-action="column-next" aria-label="下一列">→</button></div>
    <div class="archive-hint"><kbd>←</kbd> <kbd>→</kbd> 切换列 <span>／</span> <kbd>↑</kbd> <kbd>↓</kbd> 前后档案 <span>／</span> <kbd>ENTER</kbd> 读取</div>
  </section>
  <section id="detail-ui" class="detail-ui" aria-label="档案内容" hidden>
    <button class="back-button" data-action="back">← <span>ARCHIVE OVERVIEW</span><small>ESC</small></button>
    <div class="object-caption"><span id="object-id">NO.001</span><div>INTERNAL DATABASE</div><small>DRAG TO INSPECT <span>↔</span></small><button class="viewer-open" data-action="model-viewer">360° 查看文档模型 <span>↗</span></button></div>
    <article id="detail-content" class="detail-content"></article>
  </section>
  <div class="powered">POWERED BY <b>ASTRAL EXPRESS</b><i></i></div>
  <footer class="system-footer"><span><i class="status-light"></i> SESSION AUTHORIZED</span><span>TRAILBLAZER <i>／</i> <span id="clock">00:00:00</span></span><button data-action="replay" title="重播启动流程">REINITIALIZE ↗</button></footer>
  <div id="pwa-update-notice" class="pwa-update-notice" role="status" hidden><span>新版本已就绪</span><button data-pwa-action="update">更新并重启 ↻</button></div>
  <div id="modal-root"></div><div id="toast" class="toast" role="status"></div>
  <div id="loading" class="loading"><div class="loading-mark">${zl}</div><span>CONNECTING TO INTERNAL DATABASE</span><i></i></div>
`;Q("#boot-background").insertAdjacentHTML("beforeend",'<div class="boot-white"></div>');const Sp=new x2(Q("#stage"));Q("#viewport").insertAdjacentHTML("beforeend",'<button class="mobile-entry" data-action="skip">进入档案 <span>→</span></button>');let ke="boot",xt=mo,$s=0,xo="",Ni=!1,ct=null,Fs="",Hs="全部档案",ts="overview";const Qt=new URLSearchParams(location.search);let ea=Qt.get("freeze")==="1"?Number(Qt.get("time")??0):null;Qt.get("review")==="1"&&(Q("#stage").dataset.review="true",window.addEventListener("message",n=>{if(n.origin!==location.origin||n.source!==window.parent||n.data?.type!=="rhine-review-frame")return;const e=Number(n.data.time);!Number.isFinite(e)||e<0||e>=35||(ea=e,Ni&&ke!=="boot"&&ei("boot"))}));let nf,Ep=null;const Jc=new vp(Q("#detail-ui"),void 0,180,180),Uo=new Uy;let ks,Ln=!1,_o=[],Mo=!1,$c;function wp(n,e){try{return JSON.parse(localStorage.getItem(n)??"null")??e}catch{return e}}const ri=new Set(wp("starrail-saved",[])),si=wp("starrail-settings",{}),Tp=ly(si.motion,si.reduced??(si.motion===void 0?matchMedia("(prefers-reduced-motion: reduce)").matches:void 0)),D2=Uh(Tp),Oe={starrailIntro:si.starrailIntro??!0,sound:si.sound??!0,music:si.music??si.sound??!0,soundVolume:si.soundVolume??.55,musicVolume:si.musicVolume??.5,motion:Tp,motionPreset:D2,quality:si.quality??!0,superPerformance:si.superPerformance??!1,rendering:Kn(si.rendering,si.quality!==!1),colorTheme:si.colorTheme==="dark"?"dark":"light"},Ye=n=>cy(Oe.motion,n),Cp=()=>Object.values(Oe.motion).every(n=>!n);bp(Oe.colorTheme==="dark"?1:0);const Rp={duration:460,motionBlur:!0,animated:Ye("rollingNumbers")},Dp=f0(Q("#clock")),Fh={...Rp,locales:"en-US",format:{minimumIntegerDigits:2,useGrouping:!1}},eh=qr(Q("#selected-number"),{...Fh,value:1}),th=qr(Q("#column-index"),{...Fh,value:3}),Pp={...Fh,format:{minimumIntegerDigits:3,useGrouping:!1},value:1},ta={...Rp,animated:Ye("rollingText"),transition:"direct",stagger:"none"},Lp=Zr(Q("#selected-title"),{...ta,text:Q("#selected-title").textContent??""}),Ip=Zr(Q("#column-name"),{...ta,text:Q("#column-name").textContent??""}),no=Zr(Q("#hover-title"),{...ta,text:""}),Np=Zr(Q("#archive-category"),{...ta,text:Q("#archive-category").textContent??""}),Op=Zr(Q("#selected-clearance"),{...ta,text:Q("#selected-clearance").textContent??""}),yo=[Lp,Ip,no,Np,Op],ih=qr(Q("#selected-code"),Pp),Vs=qr(Q("#hover-code"),Pp),rt=new T2;function Bo(){rt.configure({...Oe,music:Oe.music&&!0})}Bo();const P2=Qt.has("scene")||Qt.has("time")||Qt.get("review")==="1";let is=!1;const Ls=Q("#loading");Q("#viewport").append(Ls);Q("#stage").inert=!0;Q(".mobile-entry").inert=!0;const Xr=!P2&&(Oe.sound||Oe.music)?new R2({root:Ls,unlock:()=>rt.unlock(),cancel:()=>rt.cancelEntry(),start:n=>kp(n)}):void 0;Xr&&(rt.holdForEntry(),Oe.music&&rt.prepareMusic().catch(()=>{}));let bo=!1,nh=0,qe,Ei="on",kt;const Up=[],Hh=rs.map((n,e)=>Nn(e)[0]);function L2(){Up.unshift({id:Rt[xt].id,time:new Date().toLocaleTimeString("en-GB")})}function Fo(){try{localStorage.setItem("starrail-settings",JSON.stringify(Oe))}catch{}Bo()}function Yr(){return Oe.superPerformance}function So(){return Yr()?T0:Oe.rendering}function Pn(){Fo(),Ye("rollingText")||yo.forEach(n=>n.finish()),Ye("rollingNumbers")||[eh,th,ih,Vs].forEach(n=>n.finish()),Ye("surfaceTransitions")||(Jc.finish(),ks?.finish(),Uo.finish(),$c?.cancel()),qe?.setMotion(Oe.motion),qe?.setTheme(Oe.colorTheme==="dark",!Ye("surfaceTransitions")||!is),document.querySelectorAll("[data-color-theme]").forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.colorTheme===Oe.colorTheme))),qe?.setSuperPerformance(Yr()),kt?.setSuperPerformance(Yr()),qe?.setQuality(So()),kt?.setQuality(So()),kt?.setMotion(Oe.motion),w0(Oe.rendering),ko(),eh.update({animated:Ye("rollingNumbers")&&ke==="archive"}),yo.forEach(n=>n.update({animated:Ye("rollingText")&&ke==="archive"})),th.update({animated:Ye("rollingNumbers")&&ke==="archive"}),ih.update({animated:Ye("rollingNumbers")&&ke==="archive"}),Vs.update({animated:Ye("rollingNumbers")&&ke==="archive"}),Q("#stage").classList.toggle("reduce-motion",Cp()),Q("#stage").classList.toggle("reduce-surfaces",!Ye("surfaceTransitions")),Dp(new Date,Ye("rollingNumbers"))}let sf="";function cr(){const n=Q("#stage"),e=Q("#viewport"),t=matchMedia("(pointer: coarse)").matches,i=Qt.has("time")||Qt.get("review")==="1",{width:s,height:r,scale:a,kind:o}=ke==="boot"&&!i?C0(e.clientWidth,e.clientHeight):R0(e.clientWidth,e.clientHeight,t,ke==="boot");n.style.width=`${s}px`,n.style.height=`${r}px`,n.style.transform=`translate(-50%, -50%) scale(${a})`,n.dataset.layout=o,n.dataset.touch=String(t),e.dataset.mobileBoot=String(ke==="boot"&&(t||e.clientWidth<1100)),n.style.setProperty("--stage-scale",String(a)),n.style.setProperty("--opening-width",`${s}px`),n.style.setProperty("--opening-height",`${r}px`),n.style.setProperty("--opening-scan-scale",String(Math.min(1,s/1920))),n.dataset.openingPortrait=String(s<r);const l=window.visualViewport,c=(e.clientHeight-r*a)/2;n.style.setProperty("--modal-top",`${Math.max(0,(l?.offsetTop??0)-c)/a}px`),n.style.setProperty("--modal-height",`${Math.min(r,(l?.height??e.clientHeight)/a)}px`),Q("#viewport").style.setProperty("--scale",String(a)),document.querySelector("#inspection-marks")?.setAttribute("viewBox",`0 0 ${s} ${r}`);const u=JSON.stringify([s,r,a,o,devicePixelRatio]);u!==sf&&(sf=u,qe?.resize(),kt?.resize()),ko(),requestAnimationFrame(()=>{hr.refresh();const d=document.querySelector(".detail-tabs button.active"),f=document.querySelector(".tab-indicator");d&&f&&(f.style.transform=`translateX(${d.offsetLeft}px) scaleX(${d.offsetWidth})`)})}window.addEventListener("resize",cr);window.visualViewport?.addEventListener("resize",cr);window.visualViewport?.addEventListener("scroll",cr);matchMedia("(pointer: coarse)").addEventListener("change",cr);cr();Q("#file-ticks").innerHTML=Nn(qi(xt).lane).map(n=>`<button data-select="${n}"></button>`).join("");const I2=[...Q("#file-ticks").querySelectorAll("button")];function ei(n){const e=ke;yo.forEach(t=>t.update({animated:Ye("rollingText")&&n==="archive"})),n!=="archive"&&(yo.forEach(t=>t.finish()),Vs.finish(),Q("#hover-label").hidden=!0),n==="detail"&&ke!=="detail"&&L2(),ke=n,rt.setScene(n),n!=="boot"&&bo&&(bo=!1,nh++,Bo()),Q("#stage").dataset.mode=n,e!==n&&cr(),Q("#boot").inert=n!=="boot",Q("#boot").setAttribute("aria-hidden",String(n!=="boot")),Q("#archive-ui").inert=n!=="archive"||!!ct||!!Qc?.enabled,Q("#archive-ui").setAttribute("aria-hidden",String(n!=="archive"||!!Qc?.enabled)),Q(".system-nav").inert=n==="boot"||!!ct,Q(".system-footer").inert=n==="boot"||!!ct,n==="detail"?e!=="detail"&&Jc.show(!Ye("surfaceTransitions")):(e==="detail"||n==="boot"&&!Q("#detail-ui").hidden)&&(Mo=!1,Uo.cancel(),Jc.hide(!Ye("surfaceTransitions")||n==="boot"),!ct&&n==="archive"&&Q(".read-file").focus({preventScroll:!0})),Q("#detail-ui").inert=n!=="detail"||!!ct,qe?.setMode(n==="boot"?"hidden":n),n!=="boot"&&(Sp.reset(),Q(".file-title").firstChild.textContent="FILE NUMBER: ",Q("#stage").dataset.boot="done"),n==="detail"&&e!=="detail"&&(U2(),Mo=!0,qe||(Q("#detail-content").style.opacity="1",Q("#detail-content").style.translate="0 0",Q("#detail-content").inert=!1))}function ns(n,e){xt=(n+Rt.length)%Rt.length,Hh[qi(xt).lane]=xt,ke==="detail"&&ei("archive"),ts="overview",qe?.select(xt,e),kh(e);const t=e&&"axis"in e&&e.axis==="lane";rt.play(t?"column":"tick",t?e.direction*.45:0)}function Eo(n){const e=Nn(qi(xt).lane);e.length<2||ns(e[(e.indexOf(xt)+n+e.length)%e.length],{axis:"row",direction:n})}function jr(n){const e=qi(xt).lane,t=Wc(e+n,rs.length);ns(Hh[t],{axis:"lane",direction:n})}function kh(n){const e=Rt[xt],{lane:t}=qi(xt),i=Nn(t);Lp.update({text:e.title,animated:Ye("rollingText")&&ke==="archive"}),Op.update({text:e.clearance,animated:Ye("rollingText")&&ke==="archive"}),Np.update({text:e.category,animated:Ye("rollingText")&&ke==="archive"});const s=n&&"axis"in n?n.direction>0?"up":"down":"auto";ih.update({value:Number(e.id.slice(2)),animated:Ye("rollingNumbers")&&ke==="archive",direction:s}),eh.update({value:i.indexOf(xt)+1,animated:Ye("rollingNumbers")&&ke==="archive",direction:n&&"axis"in n&&n.axis==="row"?s:"auto"}),Q(".count-total").textContent=String(i.length).padStart(2,"0"),th.update({value:t+1,animated:Ye("rollingNumbers")&&ke==="archive",direction:n&&"axis"in n&&n.axis==="lane"?s:"auto"}),Ip.update({text:rs[t],animated:Ye("rollingText")&&ke==="archive"}),Q('[data-action="column-prev"]').disabled=!1,Q('[data-action="column-next"]').disabled=!1,I2.forEach((r,a)=>{const o=i[a],l=Rt[o];r.dataset.select=String(o),r.setAttribute("aria-label",`选择档案 ${l.id} ${l.title}`),r.title=`${l.id} · ${l.title}`,r.classList.toggle("selected",o===xt),r.setAttribute("aria-pressed",String(o===xt))}),Q("#saved-count").textContent=String(ri.size).padStart(2,"0")}function sh(n=!1){Ni&&er(()=>N2(n))}function N2(n){$s=performance.now()/1e3-1.76,ea=null,xo="",ei(!Ye("boot")&&!n?"archive":"boot"),rt.restartBoot(),qe?.select(mo),xt=mo,Hh[qi(xt).lane]=xt,ts="overview",kh(),n||rt.play("ui-tick")}function wo(){Ni&&er(()=>{ei("detail"),rt.play("open")})}function O2(){const n=Rt[xt].id;ri.has(n)?ri.delete(n):ri.add(n);try{localStorage.setItem("starrail-saved",JSON.stringify([...ri]))}catch{}Q("#saved-count").textContent=String(ri.size).padStart(2,"0");const e=Q('[data-action="bookmark"]'),t=ri.has(n);e.firstChild.textContent=t?"− REMOVE FROM SAVED":"＋ SAVE ARCHIVE",e.querySelector("span").textContent=t?"已收藏":"收藏档案",e.setAttribute("aria-pressed",String(t)),$c?.cancel(),Ye("surfaceTransitions")&&($c=e.animate([{backgroundColor:"#67634c"},{backgroundColor:"#252820"}],{duration:220,easing:"ease-out"})),rt.play("confirm"),Ho(ri.has(n)?"档案已加入收藏":"已取消收藏")}function U2(){Uo.cancel();const n=Rt[xt];Q("#object-id").textContent="NO."+String(xt+1).padStart(3,"0"),Q("#detail-content").innerHTML=`
  <div class="detail-kicker"><span>FILE ${n.id}</span><span>${jt(n.clearance)}</span></div>
  <h2>${jt(n.en)}</h2><div class="detail-title-cn">${jt(n.title)}<span>${jt(n.category)}</span></div>
  <div class="detail-rule"></div>
  <dl class="metadata"><div><dt>LOCATION / 地点归属</dt><dd>${jt(n.department)}</dd></div><div><dt>COLLECTION / 编目范围</dt><dd>${jt(n.date)}</dd></div><div><dt>RELATED / 相关人物</dt><dd>${jt(n.lead)}</dd></div><div><dt>STATUS / 状态</dt><dd><i></i>${n.clearance==="RESTRICTED"?"目录访问":"已归档 · 可读取"}</dd></div></dl>
  <div class="detail-tabs" role="tablist"><button id="tab-overview" class="active" role="tab" aria-controls="tab-panel" aria-selected="true" data-tab="overview">01 <span>概述</span></button><button id="tab-narrative" role="tab" aria-controls="tab-panel" aria-selected="false" data-tab="narrative">02 <span>详细叙述</span></button><button id="tab-notes" role="tab" aria-controls="tab-panel" aria-selected="false" data-tab="notes">03 <span>旅途笔记</span></button><button id="tab-history" role="tab" aria-controls="tab-panel" aria-selected="false" data-tab="history">04 <span>阅读足迹</span></button><i class="tab-indicator" aria-hidden="true"></i></div>
  <div id="tab-panel" class="tab-panel" role="tabpanel">${Bp()}</div>
  <div class="detail-actions"><button class="solid-button" data-action="bookmark">${ri.has(n.id)?"− REMOVE FROM SAVED":"＋ SAVE ARCHIVE"}<span>${ri.has(n.id)?"已收藏":"收藏档案"}</span></button><a class="export-button" href="${$n(`archives/ASTRAL-EXPRESS-${n.id}.txt`)}" download="ASTRAL-EXPRESS-${n.id}.txt" aria-label="导出 ${n.id} 档案">EXPORT <span>↓</span></a></div>
  <div class="detail-footnote"><a href="${jt(n.source)}" target="_blank" rel="noopener">设定参考 ↗</a><span>${String(xt+1).padStart(3,"0")} / ${String(Rt.length).padStart(3,"0")}</span></div>`,Q("#detail-content").setAttribute("tabindex","-1"),Q('[data-action="bookmark"]').setAttribute("aria-pressed",String(ri.has(n.id))),hr.reset(Q("#detail-content"),!Ye("documentReveal")||!qe||qe.decryptionFrame.phase==="clear"),Vh(ts,!1)}function Bp(){return`<div class="panel-label">ABSTRACT / 摘要</div><p>${jt(Rt[xt].abstract)}</p>`}function Vh(n,e=!0){if(e&&n===ts)return;ts=n,document.querySelectorAll("[data-tab]").forEach(r=>{const a=r.dataset.tab===n;r.classList.toggle("active",a),r.setAttribute("aria-selected",String(a)),r.setAttribute("tabindex",a?"0":"-1")});const t=Rt[xt],i=Q(`[data-tab="${n}"]`),s=Q(".tab-indicator");s.style.transition=e&&Ye("surfaceTransitions")?"":"none",s.style.transform=`translateX(${i.offsetLeft}px) scaleX(${i.offsetWidth})`,Q("#tab-panel").setAttribute("aria-labelledby",i.id),Q("#tab-panel").innerHTML=n==="overview"?Bp():n==="narrative"?`<div class="panel-label">FULL ACCOUNT / 详细叙述</div><div class="narrative-body">${t.narrative.map(r=>`<p>${jt(r)}</p>`).join("")}</div><p class="narrative-note">资料整理与原创解读 · 参考链接见页尾</p>`:n==="notes"?`<div class="panel-label">TRAVEL NOTES / 旅途笔记</div><ol class="research-notes">${t.findings.map((r,a)=>`<li><span>${String(a+1).padStart(2,"0")}</span>${jt(r)}</li>`).join("")}</ol>`:`<div class="panel-label">READING TRACE / 阅读足迹</div>${Up.filter(r=>r.id===t.id).slice(0,4).map(r=>`<div class="log-row"><span>${r.time}</span><span>TRAILBLAZER</span><b>READ AUTHORIZED</b></div>`).join("")}<p class="log-note">这里记录本次会话打开这份档案的时间。重新载入终端后，阅读足迹重新开始。</p>`,Q("#tab-panel").scrollTop=0,hr.refresh(),e&&(Uo.reveal(Q("#tab-panel"),!Ye("surfaceTransitions")),rt.play("ui-tick"))}function Ho(n){clearTimeout(nf),Q("#toast").textContent=n,Q("#toast").classList.add("visible"),nf=setTimeout(()=>Q("#toast").classList.remove("visible"),2600)}function Fp(n){Ni&&(ct||(Ep=document.activeElement,_o=[...Q("#stage").children].filter(e=>e instanceof HTMLElement&&e.id!=="modal-root").map(e=>({node:e,inert:e.inert})),_o.forEach(({node:e})=>e.inert=!0)),Ln=!1,ct=n,Fs="",Hs="全部档案",rt.play("page-open"),rh())}function er(n){if(!ct){n?.();return}Ln||(Ln=!0,rt.play("page-close"),ks.hide(!Ye("surfaceTransitions"),()=>{ct=null,Ln=!1,Q("#modal-root").replaceChildren(),ks=void 0,_o.forEach(({node:e,inert:t})=>e.inert=t),_o=[],Q("#archive-ui").inert=ke!=="archive"||!!Qc?.enabled,Q("#detail-ui").inert=ke!=="detail",Ep?.focus({preventScroll:!0}),n?.()}))}function rh(){if(!ct)return;ks?.dispose(),Q("#modal-root").innerHTML=`<div class="modal-backdrop"><section class="terminal-modal ${ct==="settings"?"settings-modal":""}" role="dialog" aria-modal="true" aria-label="${ct==="settings"?"系统设置":ct==="saved"?"收藏档案":"档案检索"}"><div class="modal-top"><span>ASTRAL EXPRESS / ${ct==="settings"?"SYSTEM PREFERENCES":"ARCHIVE DIRECTORY"}</span><button data-action="close-modal" aria-label="关闭窗口">CLOSE <span>×</span></button></div>${ct==="settings"?B2():`<h2>${ct==="saved"?"SAVED ARCHIVES":"ARCHIVE INDEX"}<small>${ct==="saved"?"收藏档案":"内部档案检索"}</small></h2><div class="search-field"><span>⌕</span><input id="archive-search" type="search" autocomplete="off" placeholder="输入档案编号、名称、地点或人物" aria-label="检索档案"/><span class="key">ESC</span></div><div class="category-filters">${W_.map((e,t)=>`<button data-filter="${jt(e)}" class="${t===0?"active":""}">${jt(e)}</button>`).join("")}</div><div class="result-header"><span>FILE / 档案</span><span>LOCATION / 地点归属</span><span>ACCESS</span></div><div id="search-results" class="search-results"></div><div class="modal-bottom"><span id="result-count"></span><span>INTERNAL DATABASE <i>●</i> CONNECTED</span></div>`}</section></div>`;const n=Q(".modal-backdrop");n.hidden=!0,ks=new vp(n,Q(".terminal-modal")),ks.show(!Ye("surfaceTransitions")),ct==="settings"&&ko(),ct!=="settings"?(zh(),requestAnimationFrame(()=>{n.isConnected&&!Ln&&Q("#archive-search").focus()})):requestAnimationFrame(()=>{n.isConnected&&!Ln&&Q('[data-action="close-modal"]').focus()}),Q("#modal-root").querySelector(".modal-backdrop")?.addEventListener("click",e=>{e.target===e.currentTarget&&er()})}function zh(){const n=Oh.map(e=>({r:Rt[e],i:e})).filter(({r:e})=>(ct!=="saved"||ri.has(e.id))&&(Hs==="全部档案"||e.category===Hs)&&`${e.id} ${e.title} ${e.en} ${e.department} ${e.lead}`.toLowerCase().includes(Fs.toLowerCase()));Q("#search-results").innerHTML=n.length?n.map(({r:e,i:t})=>`<button class="result-row" data-result="${t}"><span class="result-name"><b>${e.id}</b><span>${jt(e.title)}<small>${jt(e.en)}</small></span>${ri.has(e.id)?"<i>＋</i>":""}</span><span>${jt(e.department)}</span><span>${e.clearance==="RESTRICTED"?"CATALOG ONLY":"AUTHORIZED"} <i>↗</i></span></button>`).join(""):`<div class="empty-results"><span>∅</span><strong>${ct==="saved"&&!Fs?"尚无收藏档案":"没有匹配的档案"}</strong><p>${ct==="saved"&&!Fs?"读取档案时，选择 SAVE ARCHIVE 将其保存在此处。":"尝试其他名称、档案编号，或切换档案分类。"}</p><button data-action="reset-search">${ct==="saved"?"查看全部档案 →":"重置检索 →"}</button></div>`,Q("#result-count").textContent=`${String(n.length).padStart(2,"0")} RECORDS FOUND`}function ko(){const n=document.querySelector("#quality-summary");if(!n)return;if(!qe){n.textContent="3D 已关闭 · 三维模型与渲染资源已释放";return}const e=qe.renderer.domElement,t=JSON.parse(e.parentElement?.dataset.renderQuality??"{}");n.textContent=`${Yr()?"超级性能模式已启用 · 画质设置暂被覆盖，关闭后恢复 · ":""}实际渲染 ${e.width} × ${e.height} · ${So().antialias==="smaa"?"SMAA":"原始抗锯齿"} · 纹理 ${t.anisotropy??1}×${t.limited?" · 已达到缓冲上限":""}`}function Hp(){const n=Oe.motionPreset,e=Object.values(Oe.motion).every(Boolean);return`<div id="motion-preference-note" class="motion-preference-note"><p>${hy(Oe.motion)}</p><span>预设：${n==="full"?"完整动画":n==="reduced"?"减少动画":"自定义"} · 选择会保存在本站</span>${e?"":'<button data-action="enable-motion">启用完整动画并重播 ↻</button>'}</div>`}function B2(){return`<h2>SYSTEM SETTINGS<small>终端偏好设置</small></h2><p class="settings-intro">TRAILBLAZER <span>·</span> SESSION AUTHORIZED</p><div class="settings-list">${i2(Oe.colorTheme==="dark")}<label><div><strong>STAR RAIL INTRO</strong><span>开场崩铁图标 · 关闭后保留原有启动动画，下次重播即可查看</span></div><input type="checkbox" data-pref="starrailIntro" ${Oe.starrailIntro?"checked":""}/><i class="toggle"></i></label>${`<label><div><strong>SUPER PERFORMANCE</strong><span>降低三维画质和渲染分辨率，保留完整动效；关闭后恢复原画质</span></div><input type="checkbox" data-pref="superPerformance" ${Oe.superPerformance?"checked":""}/><i class="toggle"></i></label>`}${C2(Oe)}</div>${Hp()}${fp(Oe.motion,Oe.motionPreset)}${E0(Oe.rendering)}${pf()}<div class="settings-shortcuts"><span>KEYBOARD CONTROLS</span><p><kbd>←</kbd><kbd>→</kbd> 切列 <kbd>↑</kbd><kbd>↓</kbd> 选档 <kbd>ENTER</kbd> 读取 <kbd>/</kbd> 检索 <kbd>ESC</kbd> 返回</p></div><div class="settings-bottom">${document.fullscreenEnabled?'<button data-action="fullscreen">FULLSCREEN <span>↗</span></button>':""}<button data-action="restart">REINITIALIZE SYSTEM <span>↻</span></button></div><div class="modal-bottom"><span>ANALYSIS OS / 1.0 · 使用 MiSans 字体（小米） <a href="${$n("fonts/MiSans-license.pdf")}" target="_blank" rel="noopener">字体许可</a></span><span>ASTRAL EXPRESS · 基于 <a href="https://github.com/LBEILC/RhineLabUI" target="_blank" rel="noopener">RhineLabUI / LBEILC</a></span></div>`}document.addEventListener("input",n=>{const e=n.target;if(e.dataset.quality){const i=document.querySelector(`[data-quality-output="${e.dataset.quality}"]`);i&&(i.value=`${e.value}%`)}const t=n.target;(t.dataset.volume==="musicVolume"||t.dataset.volume==="soundVolume")&&(Oe[t.dataset.volume]=Number(t.value)/100,t.closest("label")?.querySelector("output")?.replaceChildren(`${t.value}%`),Fo()),n.target.id==="archive-search"&&(Fs=n.target.value,zh())});document.addEventListener("change",n=>{const e=n.target;if(e.id==="quality-preset"&&Object.hasOwn(Ur,e.value))Oe.rendering={...Ur[e.value]},Pn();else if(e.dataset.quality){const t=e.dataset.quality;Oe.rendering=Kn({...Oe.rendering,[t]:t==="antialias"?e.value:Number(e.value)}),Pn()}if(e.dataset.pref){const t=e.dataset.pref;(t==="sound"||t==="music"||t==="quality"||t==="superPerformance"||t==="starrailIntro")&&(Oe[t]=e.checked),t==="sound"||t==="music"?Fo():Pn(),rt.play("confirm")}if(e.dataset.motion){const t=e.dataset.motion;Oe.motion[t]=e.checked,Oe.motionPreset=Uh(Oe.motion),Pn();const i=Q("#motion-settings"),s=i.querySelector(".motion-advanced")?.open??!1,r=i.closest(".settings-modal"),a=r?.scrollTop??0;i.outerHTML=fp(Oe.motion,Oe.motionPreset),Q("#motion-preference-note").outerHTML=Hp(),Q("#motion-settings").querySelector(".motion-advanced").open=s,requestAnimationFrame(()=>{r&&(r.scrollTop=a),document.querySelector(`[data-motion="${t}"]`)?.focus({preventScroll:!0})}),Ho(t==="boot"?"开场设置将在下次重播时生效":e.checked?"已启用此动画":"已关闭此动画"),rt.play("confirm")}});document.addEventListener("click",n=>{const e=n.target.closest("[data-color-theme]");if(e){Oe.colorTheme=e.dataset.colorTheme==="dark"?"dark":"light",Pn();return}if(!is||Ln)return;const t=n.target.closest("button");if(!t)return;if(t.dataset.action==="motion-preset"){const s=t.dataset.preset;if(s!=="full"&&s!=="reduced")return;Oe.motionPreset=s,Oe.motion=s==="full"?Wr():up(),Pn(),rh(),requestAnimationFrame(()=>document.querySelector(`[data-action="motion-preset"][data-preset="${Oe.motionPreset}"]`)?.focus({preventScroll:!0})),rt.play("confirm");return}if(t.dataset.select){ns(Number(t.dataset.select));return}if(t.dataset.result){const s=Number(t.dataset.result);er(()=>{ns(s),wo()});return}if(t.dataset.filter){Hs=t.dataset.filter,document.querySelectorAll("[data-filter]").forEach(s=>s.classList.toggle("active",s.dataset.filter===Hs)),zh();return}if(t.dataset.tab){Vh(t.dataset.tab);return}const i=t.dataset.action;if(i==="toggle-three"){G2();return}if(i==="sound-preview"&&rt.play("confirm"),i==="skip"&&(ei("archive"),rt.play("confirm")),i==="prev"&&Eo(-1),i==="next"&&Eo(1),i==="column-prev"&&jr(-1),i==="column-next"&&jr(1),i==="open"&&wo(),i==="model-viewer"&&ke==="detail"&&qe){const s=qe;t.focus({preventScroll:!0}),kt??=new Ny(Q("#stage"),()=>{rt.setScene(ke),rt.play("page-close")},r=>rt.play(r==="tick"?"ui-tick":r)),rt.setScene("viewer"),kt.setSuperPerformance(Yr()),kt.setQuality(So()),kt.setMotion(Oe.motion),qe.finishDecryption(),kt.open(Rt[xt].id,Rt[xt].title,()=>s.createAssemblyModel(),!Ye("viewerNavigation")),rt.play("page-open")}i==="back"&&(ei("archive"),rt.play("back")),(i==="search"||i==="saved"||i==="settings")&&(t.focus({preventScroll:!0}),Fp(i)),i==="close-modal"&&er(),i==="bookmark"&&O2(),i==="reset-search"&&(ct="search",Fs="",Hs="全部档案",rh()),(i==="replay"||i==="restart")&&sh(),i==="enable-motion"&&(Oe.motion=Wr(),Oe.motionPreset="full",Pn(),sh()),i==="fullscreen"&&document.fullscreenEnabled&&(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>Ho("请使用浏览器的全屏快捷键 F11")))});document.addEventListener("keydown",n=>{if(!is||kt?.isOpen)return;if(Ln){n.preventDefault();return}const e=n.target instanceof HTMLInputElement;if(n.key==="Escape"){if(ct)er();else if(ke==="detail"||ke==="boot"&&Ni){const t=ke==="detail"?"back":"ui-tick";ei("archive"),rt.play(t)}return}if(ct&&n.key==="Tab"){const i=[...Q("#modal-root").querySelectorAll('button,input:not(:disabled),select:not(:disabled),summary,[tabindex="0"]')].filter(a=>a.getClientRects().length>0),s=i[0],r=i.at(-1);n.shiftKey&&document.activeElement===s?(n.preventDefault(),r?.focus()):!n.shiftKey&&document.activeElement===r&&(n.preventDefault(),s?.focus());return}if(!(e||ct||!Ni)){if(n.target.dataset.tab&&["ArrowLeft","ArrowRight"].includes(n.key)){n.preventDefault();const t=["overview","narrative","notes","history"];Vh(t[(t.indexOf(ts)+(n.key==="ArrowRight"?1:t.length-1))%t.length]),Q(`[data-tab="${ts}"]`).focus();return}n.key==="/"&&(n.preventDefault(),ke==="boot"&&ei("archive"),Fp("search")),n.key==="ArrowLeft"&&ke!=="boot"&&(n.preventDefault(),jr(-1)),n.key==="ArrowRight"&&ke!=="boot"&&(n.preventDefault(),jr(1)),["ArrowUp","ArrowDown"].includes(n.key)&&ke!=="boot"&&(n.preventDefault(),Eo(n.key==="ArrowUp"?-1:1)),n.key==="Enter"&&(document.activeElement===document.body||document.activeElement?.id==="detail-content"||["prev","next","column-prev","column-next"].includes(document.activeElement?.dataset.action??"")||document.activeElement?.dataset.select)&&(n.preventDefault(),ke==="boot"?ei("archive"):ke==="archive"&&wo())}});const Ts=n=>(n=Math.max(0,Math.min(1,n)),n*n*(3-2*n));function F2(n){rt.updateBoot(n,ea!==null);let t=Sp.update(n,Oe.starrailIntro&&Qt.get("starrailIntro")!=="0",!Ye("boot")||!Ye("surfaceTransitions")).step;n>=22&&(t="array"),n>=25.68&&(t="select"),n>=28.3&&(t="inspect"),t!==xo&&(Q("#stage").dataset.boot=t,xo=t),Q(".file-title").firstChild.textContent=t==="array"?"SELECTING FILES...".slice(0,Math.max(0,Math.floor((n-21.94)*18))):"FILE NUMBER: ",Q("#stage").style.setProperty("--entry-opacity",String(Ts((n-21.9)/.13))),Q(".callout-rule").style.transform=`scaleX(${Ts((n-22.08)/.9)})`;const i=Ts((n-22)/.4),s=Ts((n-26)/1.8),r=.55*Ts((n-27.3)/1.65)+.45*Ts((n-29)/5);if(n>=35){ei("detail");return}return{reveal:i,lift:s,zoom:r,time:n}}const H2=new M0,hr=new y0;document.fonts.addEventListener("loadingdone",()=>hr.refresh());let rf=0,Yl=0,jl=performance.now(),ah=0;function so(n){if(!S0()){requestAnimationFrame(so);return}if(document.hidden){requestAnimationFrame(so);return}const e=n/1e3,t=qe?.themeAmount??(Oe.colorTheme==="dark"?1:0);bp(t),kt?.setTheme(t);const i=ke==="boot"&&Ni?F2(ea??e-$s):void 0;!kt?.isOpen&&(!i||i.time>=21.9)&&qe?.update(e,i),kt?.update(e),Ei==="closing"&&qe?.presentationHidden&&z2(),qe&&ke==="detail"&&(hr.update(e,qe.decryptionFrame,!Ye("documentReveal")),Q("#detail-content").style.opacity=String(qe.detailVisibility),Q("#detail-content").style.translate=`0 ${(1-qe.detailVisibility)*18}px`,Q("#detail-content").inert=qe.detailVisibility<.1,Mo&&qe.detailVisibility>=.1&&!ct&&!kt?.isOpen&&(Q("#detail-content").focus({preventScroll:!0}),Mo=!1)),Q("#stage").style.setProperty("--detail-shade",String(ke==="boot"?0:qe?.detailVisibility??0));const s=qe;s&&H2.render(s.decryptionFrame,(r,a)=>s.projectCard(r,a),!!i,Ye("modelDecryption")),Math.floor(e)!==rf&&(rf=Math.floor(e),Dp(new Date,Ye("rollingNumbers"))),Yl++,n-jl>1e3&&(ah=Yl*1e3/(n-jl),jl=n,Yl=0,Q("#three-scene").dataset.fps=String(Math.round(ah)),Q("#three-scene").dataset.renderStats=JSON.stringify(qe?.getStats()??{loaded:!1,drawCalls:0,triangles:0})),requestAnimationFrame(so)}function k2(n,e){n.select(xt,void 0),n.onSelect=(t,i)=>{ke!=="archive"||ct||kt?.isOpen||ns(t,i?{cell:i}:void 0)},n.onNavigate=(t,i)=>{ke!=="archive"||ct||kt?.isOpen||(t==="lane"?jr(i):Eo(i))},n.onHover=t=>{const i=Q("#hover-label");if(t===null){i.hidden=!0,Vs.finish(),no.finish();return}const s=Ye("rollingText")&&ke==="archive",r=Ye("rollingNumbers")&&ke==="archive";Vs.update({value:Number(Rt[t].id.slice(2)),animated:!i.hidden&&r}),no.update({text:Rt[t].title,animated:!i.hidden&&s}),i.hidden=!1,Vs.update({animated:r}),no.update({animated:s})}}function V2(){Q("#stage").dataset.threeState=Ei;const n=document.querySelector('[data-action="toggle-three"]');n&&(n.textContent=Ei==="loading"?"3D 载入中…":Ei==="closing"?"3D 关闭中…":Ei==="off"?"3D 关闭":"3D 开启",n.disabled=Ei==="loading",n.setAttribute("aria-pressed",String(Ei==="on")),n.title=Ei==="off"?"重新载入三维模型":Ei==="closing"?"取消关闭，恢复三维画面":"卸载三维模型，保留 2D 界面")}function z2(){qe&&({...qe.getStats().selectedCell},kt?.dispose(),kt=void 0,qe.dispose(),qe=void 0,ke==="detail"&&(Q("#detail-content").style.opacity="1",Q("#detail-content").style.translate="0 0",Q("#detail-content").inert=!1,hr.reset(Q("#detail-content"),!0)),Ei="off",V2(),Q("#hover-label").hidden=!0,delete Q("#three-scene").dataset.renderQuality,ko())}async function G2(){}async function W2(){try{(!Qo||rd()?.properties.load3donstartup?.value!==!1)&&(qe=new Ay(Q("#three-scene")),qe.setTheme(Oe.colorTheme==="dark",!0),qe.setArchiveCoverage(rd()?.properties.archivecoverage?.value==="extra")),await Promise.all([qe?.load(),m2(),document.fonts.load("300 20px MiSans","ACCESS WELCOME TO INTERNAL DATABASE"),document.fonts.load("400 20px MiSans","愿此行终抵群星身份信息确认请求已接收开始处理权限验证通过欢迎访问星穹列车内部资料档案编号保密级别商业区选择档案：0123456789 TRAILBLAZER"),document.fonts.load("600 20px MiSans","SYNTHESIZE INFORMATION ANALYSIS OS"),document.fonts.load("700 20px MiSans","ASTRAL EXPRESS WELCOME TO INTERNAL DATABASE")]),qe&&k2(qe),Pn(),Ni=!0,ns(mo),Xr?Xr.ready():kp(!1)}catch(n){console.error(n),Q("#loading").innerHTML='<div class="error-state"><strong>CONNECTION INTERRUPTED</strong><p>三维档案资源未能载入。请确认浏览器已启用硬件加速，然后重新连接。</p><button onclick="location.reload()">RECONNECT →</button></div>'}}function kp(n){if(is||!Ni)return;is=!0,n&&(Oe.sound=!1,Oe.music=!1,Fo()),rt.releaseEntry(),rt.restartBoot();const e=Ye("boot")?600:0;$s=performance.now()/1e3-(Qt.has("time")?Number(Qt.get("time")):1.76),Qt.has("time")||($s+=e/1e3),ei("boot"),(Qt.get("scene")==="archive"||!Ye("boot")&&!Qt.has("time"))&&ei("archive"),Qt.get("scene")==="detail"&&ei("detail"),Q("#stage").inert=!1,Q(".mobile-entry").inert=!1,Ls.classList.add("loaded"),Ls.inert=!0,setTimeout(()=>{const t=Ls.contains(document.activeElement)||document.activeElement===document.body;if(Ls.remove(),Xr&&t){const i=Q("#skip");(ke==="boot"?i.getClientRects().length?i:Q(".mobile-entry"):Q(".read-file")).focus({preventScroll:!0})}},e),requestAnimationFrame(so),setTimeout(()=>{mf(Ho)},1500)}kh();W2();Object.assign(window,{rhine:{playBootPreview:async(n=!1)=>{if(!Ni||!navigator.userActivation.isActive)return!1;const e=++nh;bo=!0,rt.configure({...Oe,sound:!0,music:n});const t=await rt.unlock();return e!==nh?!1:t?(sh(!0),!0):(bo=!1,Bo(),!1)},seek:n=>{ei("boot"),$s=performance.now()/1e3-n,xo=""},archive:()=>ei("archive"),detail:()=>wo(),select:n=>ns(n),stats:()=>({...qe?.getStats(),threeState:Ei,fps:Math.round(ah),mode:ke,ready:Ni,startup:is?"started":Xr?.phase??"loading",motion:{reduced:Cp(),preset:Oe.motionPreset},bootTime:ke==="boot"?is?(ea??performance.now()/1e3-$s)+5:6.76:null,selected:Rt[xt].id,saved:[...ri],audio:rt.stats(),wallpaper:null})}});
