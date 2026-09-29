'use strict';
let deferredInstall=null;
const installButton=document.getElementById('install-app');
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;installButton.hidden=false;});
installButton.addEventListener('click',async()=>{if(!deferredInstall)return;const prompt=deferredInstall;deferredInstall=null;installButton.hidden=true;await prompt.prompt();});
window.addEventListener('appinstalled',()=>{installButton.hidden=true;document.getElementById('install-status').textContent='Added to your home screen.';});
if('serviceWorker' in navigator&&['http:','https:'].includes(location.protocol)){
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  const showUpdate=()=>{const button=document.getElementById('update-app');button.hidden=false;button.onclick=()=>{if(reg.waiting)reg.waiting.postMessage({type:'ACTIVATE_UPDATE'});};};
  if(reg.waiting)showUpdate();reg.addEventListener('updatefound',()=>{const installing=reg.installing;if(installing)installing.addEventListener('statechange',()=>{if(installing.state==='installed'&&navigator.serviceWorker.controller)showUpdate();});});
  navigator.serviceWorker.ready.then(()=>{document.getElementById('offline-status').textContent='Ready for offline practice on this device.';});
 }).catch(()=>{document.getElementById('offline-status').textContent='Offline setup did not finish. You can still practise online; reopen the app with a connection to try again.';});
 let refreshing=false;const wasControlled=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(wasControlled&&!refreshing){refreshing=true;location.reload();}});
}else document.getElementById('offline-status').textContent='Open the hosted phone link to enable offline practice.';
