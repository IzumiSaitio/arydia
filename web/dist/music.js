(()=>{
'use strict';
const tracks=[{id:1,name:'启程',en:'Onward',file:'1.mp3',mood:'向未知的远方'},{id:2,name:'避风港',en:'Safe Harbor',file:'2.mp3',mood:'暂歇，围炉，重整行囊'},{id:3,name:'迎战',en:'To Battle',file:'3.mp3',mood:'当危险近在眼前'},{id:4,name:'神秘异象',en:'Mystical Happenings',file:'4.mp3',mood:'魔法在寂静中苏醒'},{id:5,name:'背水一战',en:'Last Stand',file:'5.mp3',mood:'守住最后一道防线'},{id:6,name:'敢行之路',en:'The Paths We Dare Tread',file:'theme.mp3',mood:'阿瑞迪亚主题曲'}];
let state={id:0,playing:false,loading:false,position:0,duration:0,volume:.7,loop:true,error:''},audio=null,token=0;
const native=!!window.Android?.musicCommand;
if(!native){
 audio=new Audio();audio.preload='metadata';audio.setAttribute('playsinline','');audio.loop=true;audio.volume=.7;
 audio.addEventListener('ended',()=>{state.playing=false;sync();});
 audio.addEventListener('error',()=>{state.error=navigator.onLine?'音频读取失败，请重试':'这首音乐尚未下载，请联网后播放或下载离线音乐';state.loading=false;state.playing=false;emit();});
 audio.addEventListener('waiting',()=>{state.loading=true;emit();});
 audio.addEventListener('playing',()=>{state.loading=false;state.error='';sync();});
 for(const type of ['pause','loadedmetadata','durationchange','seeked'])audio.addEventListener(type,sync);
 if('mediaSession' in navigator){
  const actions={play:()=>command('play',state.id||1),pause:()=>command('pause'),stop:()=>command('stop'),seekto:e=>command('seek',e.seekTime),seekbackward:e=>command('seek',Math.max(0,audio.currentTime-(e.seekOffset||10))),seekforward:e=>command('seek',audio.currentTime+(e.seekOffset||10))};
  for(const [name,handler] of Object.entries(actions)){try{navigator.mediaSession.setActionHandler(name,handler);}catch(_){}}
 }
}
function emit(){window.dispatchEvent(new CustomEvent('musicstate',{detail:{...state}}));}
function sync(){if(native){try{state=JSON.parse(Android.musicState());}catch(e){}}else if(audio){state.position=state.id?audio.currentTime||0:0;state.duration=state.id&&Number.isFinite(audio.duration)?audio.duration:0;state.playing=!audio.paused;
 if('mediaSession' in navigator){try{navigator.mediaSession.playbackState=state.id?(state.playing?'playing':'paused'):'none';if(state.duration>0)navigator.mediaSession.setPositionState?.({duration:state.duration,position:Math.min(state.position,state.duration),playbackRate:audio.playbackRate});}catch(_){}}
}emit();}
async function command(action,value=0){
 if(native){Android.musicCommand(action,Number(value));return;}
 state.error='';
 if(action==='play'){
  const t=tracks.find(t=>t.id===value);if(!t)return;const my=++token;state.loading=true;emit();
  if(state.id!==value){audio.src='music/'+t.file;state.id=value;state.position=0;
   if('mediaSession' in navigator&&'MediaMetadata' in window){navigator.mediaSession.metadata=new MediaMetadata({title:t.name,artist:'Arydia Soundtrack',album:'阿瑞迪亚 · 旅伴',artwork:[{src:new URL('icons/icon-512.png',document.baseURI).href,sizes:'512x512',type:'image/png'}]});}
  }
  try{await audio.play();if(my===token)state.playing=true;}catch(e){if(my===token){state.error='未能播放，请再次点击播放';state.playing=false;}}
  if(my===token)state.loading=false;
 }else if(action==='pause'){++token;audio.pause();state.loading=false;}
 else if(action==='stop'){++token;audio.pause();audio.currentTime=0;state.id=0;state.loading=false;}
 else if(action==='seek'&&Number.isFinite(audio.duration))audio.currentTime=Math.max(0,Math.min(value,audio.duration));
 else if(action==='volume'){state.volume=Math.max(0,Math.min(1,value));audio.volume=state.volume;}
 else if(action==='loop'){state.loop=!!value;audio.loop=state.loop;}
 sync();
}
window.Music={tracks,command,get:()=>({...state}),sync};setInterval(sync,600);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
})();
