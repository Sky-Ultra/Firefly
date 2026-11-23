/* A printable, offline reading card. The geometry changes with the thinker. */
window.makeBookplate=function makeBookplate(person,topic,book){
  const canvas=document.createElement("canvas");
  canvas.width=960;canvas.height=1200;
  const c=canvas.getContext("2d"), ink="#272920", blue="#293d9e";
  const serif='"Noto Serif SC","Songti SC","SimSun",serif', sans='"Microsoft YaHei","PingFang SC",sans-serif';
  const inkText=(text,x,y,font,color=ink)=>{c.font=font;c.fillStyle=color;c.fillText(text,x,y);};
  function wrap(text,width,font){
    c.font=font;
    const lines=[];let line="";
    for(const char of text){if(line&&c.measureText(line+char).width>width){lines.push(line);line=char;}else line+=char;}
    if(line)lines.push(line);
    return lines;
  }
  c.fillStyle="#f6f3eb";c.fillRect(0,0,960,1200);
  c.strokeStyle=ink;c.lineWidth=2;
  c.beginPath();c.moveTo(66,120);c.lineTo(894,120);c.moveTo(66,1090);c.lineTo(894,1090);c.stroke();
  inkText("思想之间",66,90,'650 38px '+serif);
  c.textAlign="right";inkText("Between Minds",894,88,'italic 29px Georgia',blue);c.textAlign="left";
  let seed=0;for(const a of person.en)seed=(seed*31+a.charCodeAt(0))>>>0;
  c.save();c.strokeStyle=blue;c.lineWidth=1.35;c.translate(786,308);
  for(let i=0;i<47;i++){
    const t=i*Math.PI/47;
    c.beginPath();c.ellipse(16*Math.cos(2*t),11*Math.sin(2*t),84+(seed%17),26+seed%13,t*2,0,Math.PI*2);c.stroke();
  }
  c.restore();
  inkText("我的哲学阅读单",66,219,'29px '+sans,blue);
  let fontSize=76;
  while(fontSize>38){c.font='650 '+fontSize+'px '+serif;if(c.measureText(person.name).width<=620)break;fontSize-=2;}
  inkText(person.name,66,340,'650 '+fontSize+'px '+serif);
  let latinSize=33;
  while(latinSize>18){c.font='italic '+latinSize+'px Georgia';if(c.measureText(person.en).width<640)break;latinSize--;}
  inkText(person.en,68,400,'italic '+latinSize+'px Georgia',blue);
  const ideaFont='36px '+serif;
  wrap(person.idea,822,ideaFont).forEach((l,i)=>inkText(l,67,535+i*59,ideaFont));
  c.fillStyle="#e4e7dc";c.fillRect(64,830,832,218);
  inkText("从这本书开始",92,882,'25px '+sans,"#575b51");
  const bookFont='600 39px '+serif;
  wrap(book,770,bookFont).forEach((l,i)=>inkText(l,90,955+i*48,bookFont));
  inkText(topic.name,66,1148,'29px '+serif);
  c.textAlign="right";inkText("哲学倾向测试",894,1148,'24px '+sans,"#585b52");
  return canvas.toDataURL("image/png");
};
