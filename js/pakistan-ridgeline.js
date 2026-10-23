/* Pakistani mountain footer, 8 named summits with fixed factual labels.
 * Canvas uses coarse grayscale stippled layers, inspired by dithered ridgelines.
 * Terrain is an artistic cross-section, NOT a topographically scaled survey. */
(()=>{'use strict';const host=document.getElementById('footer-host');if(!host)return;
const peaks=[
{name:'K2',elev:'8,611 m',loc:'Baltoro · GB',x:.10,y:.24},
{name:'Nanga Parbat',elev:'8,126 m',loc:'Diamer · GB',x:.22,y:.14},
{name:'Gasherbrum I',elev:'8,080 m',loc:'Baltoro · GB',x:.34,y:.25},
{name:'Broad Peak',elev:'8,051 m',loc:'Baltoro · GB',x:.46,y:.12},
{name:'Gasherbrum II',elev:'8,035 m',loc:'Baltoro · GB',x:.57,y:.28},
{name:'Distaghil Sar',elev:'7,885 m',loc:'Hispar · GB',x:.68,y:.14},
{name:'Masherbrum',elev:'7,821 m',loc:'Baltoro · GB',x:.80,y:.26},
{name:'Rakaposhi',elev:'7,788 m',loc:'Nagar · GB',x:.92,y:.14}
];
host.innerHTML=`<footer class="pak-footer" id="pak-footer"><div class="wrap footer-top"><div><a class="footer-mark" href="index.html" aria-label="Return to homepage"><img src="assets/favicon.png" width="39" height="39" alt=""><span class="micro">IBRAHIM HUSSAIN</span></a><h2>On the horizon.</h2><p>From the mountains of Pakistan to the things not yet built. Thanks for stopping by.</p></div><div class="footer-column"><h3>Explore</h3><a href="projects.html">Projects ↗</a><a href="resume.html">Résumé ↗</a><a href="photos.html">Photos ↗</a><a href="terminal.html">Terminal ↗</a></div><div class="footer-column"><h3>Elsewhere</h3><a href="https://github.com/ib-hussain" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/ib-hussain/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="mailto:ibrahimbeaconarion@gmail.com">Email ↗</a><a href="contact.html">Get in touch ↗</a></div></div><div class="mountain-footer-scene" role="img" aria-label="Dithered artistic cross-section of eight mountain peaks in Pakistan"><canvas id="pak-canvas" aria-hidden="true"></canvas><div class="mountain-labels">${peaks.map(p=>`<span class="mountain-label" style="--x:${p.x*100}%;--y:${p.y*100}%"><strong>${p.name}</strong><span>${p.elev}</span><small>${p.loc}</small></span>`).join('')}</div></div><div class="footer-bottom"><button class="backtop" type="button" title="Back to top" aria-label="Back to top">↑</button></div></footer>`;
const canvas=document.getElementById('pak-canvas');const ctx=canvas.getContext('2d',{alpha:false});const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;document.querySelector('.backtop').addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce?'instant':'smooth'}));let raf=0;
function render(){const w=canvas.clientWidth,h=canvas.clientHeight,pixel=3,cw=Math.ceil(w/pixel),ch=Math.ceil(h/pixel);if(!cw||!ch)return;canvas.width=cw;canvas.height=ch;const img=ctx.createImageData(cw,ch);const core=[[17,27,43],[27,42,61],[44,61,79],[72,89,101],[111,125,131],[164,174,175],[201,211,213],[232,236,234]];
// Peak paths use independently authored artistic positioning; labels line up with crests.
const heights=peaks.map(p=>p.y+.17);const shape=(x,layer)=>{const pts=peaks.map((p,i)=>({x:p.x,y:heights[i]+layer*.14}));const nearest=pts.map(p=>({dist:Math.abs(p.x-x),point:p})).sort((a,b)=>a.dist-b.dist)[0];const ridge=Math.max(0,1-nearest.dist/(layer===0?.075:.11));return nearest.point.y+(1-ridge)*(.44+layer*.10)+Math.sin(x*39+layer*2)*.018+Math.cos(x*73)*.008};
const profiles=Array.from({length:6},(_,layer)=>Float32Array.from({length:cw},(_,ix)=>shape(ix/cw,layer)));for(let iy=0;iy<ch;iy++)for(let ix=0;ix<cw;ix++){const y=iy/ch,idx=(iy*cw+ix)*4;let tone=core[0];if(y>.18)tone=core[1];for(let l=0;l<6;l++)if(y>profiles[l][ix])tone=core[Math.min(7,l+2)];const noise=(((ix*171+iy*57)*1103515245>>>12)%29)-14;const factor=(ix*3+iy*5)%9<4?1:-1;for(let c=0;c<3;c++)img.data[idx+c]=Math.max(0,Math.min(255,tone[c]+noise*factor*.68));img.data[idx+3]=255}
ctx.putImageData(img,0,0)}
const ro=new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(render)});ro.observe(canvas);render();
})();
