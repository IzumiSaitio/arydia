(function(root){
 const colors={green:'#406729',gold:'#ae9229',blue:'#24627a',orange:'#a45d2b',purple:'#752a67',red:'#892e45'};
 // Order: starting skills 4/5, then the original 3-column tree, 6 through 17.
 const paint={
  inspiration:['red','gold','blue','gold|blue','green','blue','gold','blue','red','green','red','purple','purple','red'],
  light:['red','green','orange','orange','green','purple','purple','purple|blue','blue','blue','blue','red','blue|red','blue'],
  arcana:['green','orange','green|purple','purple','purple','gold','purple|green','orange|green','gold','orange','orange','orange','red','red'],
  wandering:['blue','red','gold','gold|blue','gold','gold|orange','orange','purple','orange|blue','purple','purple|red','blue|red','red','red'],
  shadow:['blue','orange','blue','red','red','orange','orange','orange|blue','green','red','green','blue','gold','gold'],
  valor:['green','purple','gold','gold','blue','green','green','green','orange','purple','purple|green','purple','orange','blue']
 };
 // Printed arrows, including alternative branches, transcribed from the Chinese cards.
 const links={
  inspiration:[[6,7],[7,10],[10,11],[12,13],[13,14],[13,17],[15,16]],
  light:[[6,7],[7,8],[9,10],[10,11],[13,11],[13,14],[14,16],[14,17],[15,16]],
  arcana:[[6,7],[7,8],[7,10],[8,11],[9,13],[12,13],[15,13],[13,14],[15,16],[16,17]],
  wandering:[[6,7],[7,8],[10,7],[9,10],[10,11],[13,11],[12,13],[13,14],[16,14],[15,16]],
  shadow:[[6,7],[7,8],[7,11],[9,10],[10,11],[12,13],[13,14],[16,14],[15,16],[16,17]],
  valor:[[6,7],[7,8],[7,11],[9,10],[10,11],[10,14],[12,13],[13,14],[13,16],[13,17],[15,16]]
 };
 function position(id){return id<6?{x:3.5,y:id===4?38:62,w:21.7,h:21}:{x:27.5+((id-6)%3)*23.9,y:4+Math.floor((id-6)/3)*24,w:21.7,h:21};}
 function background(path,id){const p=(paint[path]||paint.valor)[id-4].split('|').map(c=>colors[c]);return p.length===1?p[0]:`linear-gradient(90deg,${p[0]} 50%,${p[1]} 50%)`;}
 function edge(from,to){const a=position(from),b=position(to);let sx,sy,tx,ty;
  if(Math.abs(a.x-b.x)<1){sx=a.x+a.w/2;tx=b.x+b.w/2;sy=a.y+(b.y>a.y?a.h:0);ty=b.y+(b.y>a.y?0:b.h);}
  else {sx=a.x+(b.x>a.x?a.w:0);tx=b.x+(b.x>a.x?0:b.w);const dir=Math.sign(b.y-a.y);sy=a.y+a.h*(.5+.5*dir);ty=b.y+b.h*(.5-.5*dir);}
  return {from,to,points:[sx,sy,tx,ty].map(n=>Math.round(n*10))};
 }
 const badge={inspiration:colors.orange,light:colors.gold,arcana:colors.blue,wandering:colors.green,shadow:colors.purple,valor:colors.red};
 root.CardLayout={position,background,edge,badge,edges:path=>links[path].map(([a,b])=>edge(a,b))};
})(typeof window==='undefined'?globalThis:window);
