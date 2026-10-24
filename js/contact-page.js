(() => {'use strict';
const address='ibrahimbeaconarion@gmail.com';
const host=document.getElementById('copy-email-tear');
if(host&&window.TearButton)window.TearButton.mount(host,{tone:'default',icon:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',label:'Copy email',description:'Tear the stub to copy',stubLabel:'Copy',confirmedLabel:'Copied',confirmedDescription:address,onConfirm:async()=>{try{await navigator.clipboard.writeText(address);document.getElementById('copy-dialog').showModal()}catch{host.querySelector('.sr').textContent='Clipboard unavailable. Email: '+address}}});
const gauge=document.getElementById('contact-gauge');if(gauge&&window.LiquidGauge)window.LiquidGauge.mount(gauge,{label:'Collaboration energy',defaultValue:72,total:100,unit:'%',readOnly:true,warnAt:100});
document.querySelector('[data-open-dialog="methods"]')?.addEventListener('click',()=>document.getElementById('methods-dialog').showModal());
document.querySelectorAll('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
document.querySelectorAll('dialog.contact-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
})();
