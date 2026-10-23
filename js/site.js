(()=>{'use strict';
const root=document.documentElement,body=document.body,page=body.dataset.page;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
// The original KokonutUI pull-cord simulation is mounted at 17.5% in the floating control.
const themeHost=document.getElementById('lamp');
const themeCtrl=document.getElementById('theme-control');
const lamp=window.PullCord?.mount(themeHost,{defaultChecked:!root.classList.contains('dark'),label:'Change colour theme',onCheckedChange:onLampChange});
function syncTheme(){themeCtrl.setAttribute('aria-pressed',String(root.classList.contains('dark')));document.querySelector('meta[name="theme-color"]')?.setAttribute('content',root.classList.contains('dark')?'#0a100e':'#f6f8f4')}
function onLampChange(on){root.classList.toggle('dark',!on);safeSet('ib-theme',on?'light':'dark');syncTheme()}
function toggleTheme(){const dark=!root.classList.contains('dark');root.classList.toggle('dark',dark);lamp?.setChecked(!dark);safeSet('ib-theme',dark?'dark':'light');syncTheme();themeCtrl.classList.add('pull');setTimeout(()=>themeCtrl.classList.remove('pull'),180)}
themeCtrl.addEventListener('click',toggleTheme);
themeCtrl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleTheme()}});
syncTheme();
// Source conversion: whole-page responsive halftone from halftone-background2.html.
const halftone=document.getElementById('halftone-host');
if(halftone&&window.HalftoneBackground){
 try{
  window.HalftoneBackground.mount(halftone,{cell:11,angle:45,loupe:!reduce,content:null});
  if(!reduce){let last=0;document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;let t=performance.now();if(t-last<22)return;last=t;halftone.querySelector('.hb-root')?.dispatchEvent(new PointerEvent('pointermove',{clientX:e.clientX,clientY:e.clientY,pointerType:'mouse',bubbles:true}))},{passive:true})}
 }catch(err){console.warn('Halftone background unavailable',err)}
}
// A faithful port of the supplied native-JS ridgeline dither/footer component.
const footerHost=document.getElementById('footer-host');
if(window.RidgelineDitherFooter&&footerHost){
try{
 window.RidgelineDitherFooter.mount(footerHost,{name:'ibrahim.',brandHref:'index.html',tagline:'Building intelligent systems, one experiment at a time.',columns:[{title:'Explore',links:[{label:'Projects',href:'projects.html'},{label:'Experience',href:'experience.html'},{label:'About',href:'about.html'},{label:'Component Lab',href:'components.html'}]},{title:'Find me',links:[{label:'GitHub ↗',href:'https://github.com/ib-hussain'},{label:'LinkedIn ↗',href:'https://www.linkedin.com/in/ib-hussain/'},{label:'Email ↗',href:'mailto:ibrahimbeaconarion@gmail.com'}]}],socials:[{icon:'github',label:'GitHub',href:'https://github.com/ib-hussain'},{icon:'linkedin',label:'LinkedIn',href:'https://www.linkedin.com/in/ib-hussain/'}],credit:null,copyright:'© '+new Date().getFullYear()+' Ibrahim Hussain · Built with HTML / CSS / JS',height:'550px',sceneMinHeight:'240px',maxWidth:'1260px',ridges:6,pixel:3});
 }catch(err){console.warn('Ridgeline footer unavailable',err);let f=document.createElement('footer');f.textContent='© '+new Date().getFullYear()+' Ibrahim Hussain';footerHost.append(f)}
}
const backTop=document.getElementById('back-top');backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce?'instant':'smooth'}));
// Dock physically moves after travelling one dock-width, and its magnification flips downwards.
const dock=document.getElementById('dock');let dockWidth=dock?.getBoundingClientRect().width||500;
let lastY=window.scrollY,raf=false;
function updateDock(){raf=false;if(!dock)return;const y=window.scrollY;const atTop=y>=dockWidth;dock.classList.toggle('top',atTop);dock.classList.toggle('is-hidden',Boolean(footerHost&&footerHost.getBoundingClientRect().top<=innerHeight*.6));lastY=y}
window.addEventListener('scroll',()=>{if(!raf){raf=true;requestAnimationFrame(updateDock)}},{passive:true});
window.addEventListener('resize',()=>{dockWidth=dock?.getBoundingClientRect().width||500;updateDock()},{passive:true});updateDock();
// Reference animation: PageLoader.jsx. Every direct load/reload of index gets a 1s greeting; cross-page navigation to index does not.
const loader=document.getElementById('page-loader');
const nav=performance.getEntriesByType?.('navigation')?.[0];
let internal=false;
try{internal=sessionStorage.getItem('ib-internal-home')==='1';sessionStorage.removeItem('ib-internal-home')}catch{}
const showLoader=page==='home'&&(!internal||nav?.type==='reload');
if(loader){
 if(!showLoader||reduce){loader.remove()}else{
  body.classList.add('is-loading');const words=Array.from(loader.querySelectorAll('.greeting'));
  const delays=[0,270,540];delays.forEach((d,i)=>setTimeout(()=>words.forEach((word,j)=>word.classList.toggle('active',j===i)),d));
  const el=loader.querySelector('.bash-command'),text='echo "hello world"';let n=0;const start=performance.now();
  function type(t){n=Math.min(text.length,Math.floor((t-start)/43));el.textContent=text.slice(0,n);if(n<text.length)requestAnimationFrame(type)}requestAnimationFrame(type);
  setTimeout(()=>{loader.classList.add('leaving');body.classList.remove('is-loading')},1000);
  loader.addEventListener('transitionend',e=>{if(e.target===loader)loader.remove()},{once:true});
 }
}
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;let u;try{u=new URL(a.href,location.href)}catch{return}if(u.origin!==location.origin)return;if(/\/(?:index\.html)?$/.test(u.pathname)&&page!=='home'){try{sessionStorage.setItem('ib-internal-home','1')}catch{}}});
// Peter Griffin inspired SVG cursor: no remote runtime dependency. Click-to-run / busy-to-idle state.
const cursor=document.getElementById('peter-cursor');
const fine=matchMedia('(pointer:fine)').matches;
if(cursor&&fine&&!reduce){
 body.classList.add('peter-enabled');let px=-200,py=-200,tx=-200,ty=-200,runTimer=0;
 document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY},{passive:true});
 function follow(){px+=(tx-px)*.35;py+=(ty-py)*.35;cursor.style.transform=`translate(${px}px,${py}px)`;requestAnimationFrame(follow)}follow();
 function running(){cursor.classList.add('running');clearTimeout(runTimer);runTimer=setTimeout(()=>cursor.classList.remove('running'),650)}
 document.addEventListener('pointerdown',running,{passive:true});
 addEventListener('pageshow',()=>cursor.classList.remove('running'));
}else cursor?.remove();
// Functional macOS card buttons: red = hide with restore; amber = minimise, green = expand.
const dialog=document.getElementById('project-dialog');
function openDetail(article){if(!dialog||!article)return;document.getElementById('project-dialog-title').textContent=article.dataset.title;document.getElementById('project-dialog-desc').textContent=article.dataset.desc;document.getElementById('project-dialog-stack').textContent=article.dataset.stack;document.getElementById('project-dialog-link').href=article.dataset.link;dialog.showModal()}
document.querySelectorAll('.project-card').forEach(card=>{
 card.querySelectorAll('.mac-dot').forEach(dot=>dot.addEventListener('click',()=>{
  let action=dot.dataset.action;
  if(action==='expand')openDetail(card);
  if(action==='minimise'){let state=card.classList.toggle('is-minimised');dot.setAttribute('aria-label',state?'Restore '+card.dataset.title:'Minimise '+card.dataset.title);dot.title=state?'Restore':'Minimise'}
  if(action==='close'){
   const stub=document.createElement('div');stub.className='closed-card';stub.innerHTML='<span class="mono">'+card.dataset.title+' — closed</span><button type="button">Restore window ↗</button>';
   card.hidden=true;card.after(stub);stub.querySelector('button').addEventListener('click',()=>{card.hidden=false;stub.remove()})
  }
 }));
 card.querySelector('.open-detail')?.addEventListener('click',e=>{e.preventDefault();openDetail(card)});
});
dialog?.querySelectorAll('.dialog-close,.dialog-close-dot').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
// Project category filtering does not rely on JS for initial content.
const filters=document.querySelectorAll('[data-project-filter]');
function filterProjects(filter){let count=0;document.querySelectorAll('.project-card').forEach(card=>{const matches=filter==='all'||card.dataset.track===filter;card.hidden=!matches;if(matches)count++});filters.forEach(b=>{const a=b.dataset.projectFilter===filter;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a))})}
filters.forEach(b=>b.addEventListener('click',()=>{filterProjects(b.dataset.projectFilter);try{history.replaceState({},'',b.dataset.projectFilter==='all'?'projects.html':'?track='+encodeURIComponent(b.dataset.projectFilter))}catch(err){/* sandbox previews may run without origin */}}));
if(page==='projects'){const query=new URLSearchParams(location.search).get('track');if(['ml-ai','engineering','analytics','quant'].includes(query))filterProjects(query)}
// Source port from Aahana: Fibonacci sphere, X/Y projected rotation, pointer drag and category filter.
const stage=document.getElementById('cloud-stage'),tags=Array.from(document.querySelectorAll('.cloud-tag'));
if(stage&&tags.length){
 const cloud={rx:200,ry:200,maxHalf:110,angleX:-.25,angleY:0,velX:.0012,velY:.0028,dragging:false,flat:false,lastX:0,lastY:0,points:[]};
 const fontsize={3:.99,2:.79,1:.64};
 const lerp=(a,b,t)=>a+(b-a)*t,clamp=x=>Math.max(0,Math.min(1,x));
 function build(){const n=tags.length;cloud.points=tags.map((tag,i)=>{const phi=Math.acos(-1+(2*i+1)/n),theta=Math.sqrt(n*Math.PI)*phi;tag.style.fontSize=fontsize[tag.dataset.weight]+'rem';return{el:tag,x:Math.cos(theta)*Math.sin(phi),y:Math.sin(theta)*Math.sin(phi),z:Math.cos(phi)}});cloud.maxHalf=Math.max(...tags.map(t=>t.offsetWidth))/2;size()}
 function size(){cloud.flat=stage.clientWidth<540;stage.classList.toggle('flat',cloud.flat);if(cloud.flat){cloud.points.forEach(p=>p.el.style.cssText='font-size:'+fontsize[p.el.dataset.weight]+'rem');return}const r=stage.getBoundingClientRect(),k=1.2,oval=1.18,roomX=(r.width/2-(cloud.maxHalf||110)-8)/(k*oval),roomY=(r.height/2-16)/k,rad=Math.max(110,Math.min(r.width*.36,roomX,roomY));cloud.rx=rad*oval;cloud.ry=rad}
 let cloudOnScreen=false;new IntersectionObserver(([e])=>{cloudOnScreen=e.isIntersecting},{rootMargin:'15% 0px'}).observe(stage);
 function render(){if(cloudOnScreen&&!cloud.flat&&!reduce){const w=stage.clientWidth,h=stage.clientHeight,cx=w/2,cy=h/2,fov=cloud.rx*1.9;if(!cloud.dragging){cloud.angleY+=cloud.velY;cloud.angleX+=cloud.velX;cloud.velY=lerp(cloud.velY,.0028,.02);cloud.velX=lerp(cloud.velX,.0012,.02)}const cosY=Math.cos(cloud.angleY),sinY=Math.sin(cloud.angleY),cosX=Math.cos(cloud.angleX),sinX=Math.sin(cloud.angleX);for(const p of cloud.points){const x1=p.x*cosY-p.z*sinY,z1=p.x*sinY+p.z*cosY,y2=p.y*cosX-z1*sinX,z2=p.y*sinX+z1*cosX,X=x1*cloud.rx,Y=y2*cloud.ry,Z=z2*cloud.rx,scale=fov/(fov+Z);p.el.style.left=cx+X*scale+'px';p.el.style.top=cy+Y*scale+'px';p.el.style.transform=`translate(-50%,-50%) scale(${scale.toFixed(3)})`;p.el.style.zIndex=Math.round(scale*200);if(!p.el.classList.contains('dim')){const depth=clamp((scale-.5)/.85);p.el.style.opacity=(.12+.88*depth*depth).toFixed(3)}}}requestAnimationFrame(render)}
 stage.addEventListener('pointerdown',e=>{if(cloud.flat)return;cloud.dragging=true;cloud.lastX=e.clientX;cloud.lastY=e.clientY;stage.setPointerCapture(e.pointerId)});stage.addEventListener('pointermove',e=>{if(!cloud.dragging)return;const dx=e.clientX-cloud.lastX,dy=e.clientY-cloud.lastY;cloud.lastX=e.clientX;cloud.lastY=e.clientY;cloud.angleY+=dx*.005;cloud.angleX-=dy*.005;cloud.velY=dx*.0016;cloud.velX=-dy*.0016});['pointerup','pointercancel','lostpointercapture'].forEach(name=>stage.addEventListener(name,()=>cloud.dragging=false));
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const cat=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});tags.forEach(tag=>{const match=cat==='all'||tag.dataset.cat===cat;tag.classList.toggle('dim',!match);tag.classList.toggle('match',match&&cat!=='all')})}));
 new ResizeObserver(size).observe(stage);build();if(!reduce)requestAnimationFrame(render);else{stage.classList.add('flat')}
}
})();
