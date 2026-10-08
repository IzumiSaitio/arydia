(function(root){'use strict';
// Retired optional archive: validated only so old backups remain lossless.
const dirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],key=p=>p.x+','+p.y;
function defaults(){return {version:1,templates:[],weapons:[],foes:[],loadouts:[],selected:null,weapon:null,tier:0,motion:true,history:[]};}
function validate(raw){
 const fail=()=>{throw Error('战斗存档格式无效');},str=(s,n=80)=>typeof s==='string'&&s.length<=n,int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 const list=(a,n)=>{if(!Array.isArray(a)||a.length>n)fail();return a;};
 const ident=v=>{if(!str(v)||!/^[a-zA-Z0-9_-]+$/.test(v)||['__proto__','constructor','prototype'].includes(v))fail();return v;};
 const point=p=>{if(!p||!int(p.x,0,12)||!int(p.y,0,12))fail();return {x:p.x,y:p.y};};
 const unique=a=>{if(new Set(a).size!==a.length)fail();};
 function template(t){if(!t||!str(t.name)||!t.name.trim()||!str(t.code))fail();if(t.orientation!==undefined&&!['portrait','landscape'].includes(t.orientation))fail();const r={id:ident(t.id),name:t.name,code:t.code,orientation:t.orientation||'portrait',points:list(t.points,169).map(p=>{if(typeof p.weak!=='boolean'||typeof p.armor!=='boolean')fail();return {...point(p),weak:p.weak,armor:p.armor};}),criticals:[]};unique(r.points.map(key));r.criticals=list(t.criticals,100).map(c=>({...point(c),targets:list(c.targets,169).map(k=>{if(!r.points.some(p=>key(p)===k))fail();return k;})}));r.criticals.forEach(c=>unique(c.targets));unique([...r.points,...r.criticals].map(key));return r;}
 function attack(w){if(!w||!str(w.name)||!w.name.trim()||typeof w.aimed!=='boolean'||!dirs.some(d=>d[0]===w.dx&&d[1]===w.dy)||!Array.isArray(w.thresholds)||w.thresholds.length!==3||!w.thresholds.every((n,i)=>int(n,2,99)&&(i===0||n>w.thresholds[i-1])))fail();const r={id:ident(w.id),name:w.name,aimed:w.aimed,dx:w.dx,dy:w.dy,thresholds:[...w.thresholds],nodes:list(w.nodes,20).map((n,i)=>{if(!int(n.tier,0,2)||typeof n.piercing!=='boolean'||(i===0?(n.parent!==-1||n.dx!==0||n.dy!==0||n.tier!==0):(!int(n.parent,0,i-1)||!dirs.some(d=>d[0]===n.dx&&d[1]===n.dy)||n.tier<w.nodes[n.parent].tier)))fail();return {parent:n.parent,dx:n.dx,dy:n.dy,tier:n.tier,piercing:n.piercing};})};if(!r.nodes.length)fail();return r;}
 function marking(m,t){if(!m||typeof m!=='object'||Array.isArray(m)||Object.keys(m).length!==t.points.length)fail();return Object.fromEntries(t.points.map(p=>{const k=key(p),v=m[k];if(!['clear','armor','wound'].includes(v)||(v==='armor'&&!p.armor))fail();return [k,v];}));}
 function foe(f,index=0){if(!f||!str(f.name))fail();const t=template(f.template);if(!t.points.length)fail();if(f.marker!==undefined&&!int(f.marker,0,4))fail();return {id:ident(f.id),name:f.name,marker:f.marker===undefined?index%4+1:f.marker,template:t,marks:marking(f.marks,t)};}
 if(!raw||raw.version!==1)fail();const s=defaults();s.templates=list(raw.templates,60).map(template);s.weapons=list(raw.weapons,60).map(attack);s.foes=list(raw.foes,24).map(foe);s.loadouts=list(raw.loadouts,20).map(l=>{if(!l||!str(l.name))fail();return {id:ident(l.id),name:l.name,foes:list(l.foes,24).map(foe)};});
 [s.templates,s.weapons,s.foes,s.loadouts].forEach(a=>unique(a.map(x=>x.id)));s.loadouts.forEach(l=>unique(l.foes.map(x=>x.id)));
 s.history=list(raw.history,30).map(h=>{const f=s.foes.find(f=>f.id===h.id);if(!f||!str(h.label,160))fail();return {id:h.id,label:h.label,marks:marking(h.marks,f.template)};});
 if(raw.motion!==undefined&&typeof raw.motion!=='boolean')fail();s.motion=raw.motion!==false;s.selected=s.foes.some(f=>f.id===raw.selected)?raw.selected:s.foes[0]?.id||null;s.weapon=s.weapons.some(w=>w.id===raw.weapon)?raw.weapon:s.weapons[0]?.id||null;s.tier=int(raw.tier,-1,2)?raw.tier:0;return s;
}
root.LegacyRecords={validate};})(typeof window==='undefined'?globalThis:window);
