/* Browser-only command set adapted from the existing portfolio terminal. */
(() => {'use strict';
const form=document.getElementById('terminal-form');if(!form)return;
const input=document.getElementById('terminal-input'),output=document.getElementById('terminal-output'),prompt=form.querySelector('.terminal-prompt span');
const projects=[...(window.PROJECTS||[]),...(window.PROJECTS_EXTRA||[])],history=[];let historyIndex=0,cwd='~';
const commands=['help','about','projects','resume','contact','ls','pwd','cd','cat','whoami','neofetch','echo','open','date','history','github','linkedin','clear'];
function line(value='',className=''){const p=document.createElement('p');p.className=className;p.textContent=value;output.append(p);output.scrollTop=output.scrollHeight;return p}
function link(text,href){const p=document.createElement('p'),a=document.createElement('a');a.textContent=text;a.href=href;if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener noreferrer'}p.append(a);output.append(p);output.scrollTop=output.scrollHeight}
function path(raw){if(!raw||raw==='~')return '~';if(raw==='..')return '~';return raw.startsWith('~/')?raw:cwd==='~'?'~/'+raw:cwd+'/'+raw}
async function run(raw){const [head,...rest]=raw.trim().split(/\s+/),cmd=(head||'').toLowerCase(),arg=rest.join(' ');switch(cmd){
case 'help':line('Commands: '+commands.join('  '));line('Try projects, cat resume.md or open photos. This terminal is read-only.','terminal-muted');break;
case 'about':line('Ibrahim Hussain — Data Science undergraduate at FAST-NUCES Islamabad, graduating 2027.');line('Quantitative modelling, machine learning, data engineering and analytics.');break;
case 'projects':line(`${projects.length} project entries in the portfolio:`);projects.forEach(p=>{line('• '+p.title);if(p.repo&&p.repo!=='https://github.com/ib-hussain')link('  '+p.repo,p.repo)});break;
case 'resume':await showResume();break;
case 'contact':link('ibrahimbeaconarion@gmail.com','mailto:ibrahimbeaconarion@gmail.com');link('Contact page','contact.html');break;
case 'ls':if(path(arg)==='~')line('about.md  contact.md  resume.md  projects/');else if(path(arg)==='~/projects')projects.forEach(p=>line(p.id+'/'));else line('ls: no such directory: '+arg,'terminal-muted');break;
case 'pwd':line('/home/ib_hussain'+(cwd==='~'?'':cwd.slice(1)));break;
case 'cd':if(['~','~/projects'].includes(path(arg)))cwd=path(arg);else line('cd: no such directory: '+arg,'terminal-muted');prompt.textContent=cwd+' %';break;
case 'cat':if(path(arg)==='~/resume.md')await showResume();else if(path(arg)==='~/about.md')line('Ibrahim Hussain — FAST-NUCES Data Science, graduating 2027.');else if(path(arg)==='~/contact.md')line('Email: ibrahimbeaconarion@gmail.com');else if(path(arg).startsWith('~/projects/')){const id=path(arg).split('/')[2],p=projects.find(x=>x.id===id);if(p){line(p.title);line(p.description);if(p.repo)link(p.repo,p.repo)}else line('cat: no such project: '+id)}else line('cat: no such file: '+arg,'terminal-muted');break;
case 'whoami':line('ib_hussain@archlinux — Data Science / systems modelling');break;
case 'neofetch':line('     /\\     ib_hussain@archlinux');line('    /  \\    FAST-NUCES · Islamabad');line('   / /\\ \\   Focus: Quant · ML · Engineering · Analytics');line('  /_/  \\_\\  Graduation: 2027');break;
case 'echo':line(arg.replace(/^['"]|['"]$/g,''));break;
case 'open':{const pages={home:'index.html',projects:'projects.html',photos:'photos.html',resume:'resume.html',contact:'contact.html',music:'music.html',movies:'movies.html',bin:'bin.html'};if(pages[arg])link('Open '+arg+' ↗',pages[arg]);else line('open: pages: '+Object.keys(pages).join(', '),'terminal-muted');break}
case 'date':line(new Date().toString());break;
case 'history':history.forEach((item,i)=>line(`${i+1}  ${item}`));break;
case 'github':link('github.com/ib-hussain','https://github.com/ib-hussain');break;
case 'linkedin':link('linkedin.com/in/ib-hussain','https://www.linkedin.com/in/ib-hussain/');break;
case 'clear':output.replaceChildren();break;
default:line('bash: '+cmd+': command not found. Type help.','terminal-muted')
}}
async function showResume(){try{const response=await fetch('resume.md');if(!response.ok)throw Error('unavailable');const raw=await response.text();const pre=document.createElement('pre');pre.textContent=raw;output.append(pre);link('Read the formatted résumé ↗','resume.html');output.scrollTop=output.scrollHeight}catch{line('Résumé source unavailable here.','terminal-muted');link('Read the résumé ↗','resume.html')}}
form.addEventListener('submit',e=>{e.preventDefault();const raw=input.value.trim();if(!raw)return;history.push(raw);historyIndex=history.length;line('ib_hussain@archlinux '+cwd+' % '+raw,'terminal-command');run(raw).catch(()=>line('Could not load that content.','terminal-muted'));input.value='';input.focus()});input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.max(0,Math.min(history.length,historyIndex+(e.key==='ArrowUp'?-1:1)));input.value=history[historyIndex]||''}else if(e.key==='Tab'){e.preventDefault();const hits=commands.filter(c=>c.startsWith(input.value));if(hits.length===1)input.value=hits[0]}});
document.getElementById('terminal-clear').addEventListener('click',()=>{output.replaceChildren();input.focus()});
})();
