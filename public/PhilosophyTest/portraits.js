/* A shuffled edition of four frontispieces, shared by the home page and its credits. */
window.Portraits = (() => {
  const editions = {
    epicurus: {
      name:"伊壁鸠鲁", caption:"公元二世纪 · 大理石", image:"cover.webp",
      alt:"群青圆盘前的伊壁鸠鲁大理石头像，细线绕过雕像肩头。",
      source:"https://www.metmuseum.org/art/collection/search/248475", credit:"大都会艺术博物馆",
      note:"罗马时期大理石头像。馆藏编号 11.90，摄影图像为公有领域。"
    },
    confucius: {
      name:"孔子", caption:"元代 · 纸本设色", image:"confucius.webp",
      alt:"元代孔子画像与一柄青绿色折扇叠印。",
      source:"https://theme.npm.edu.tw/exh106/Confucius/en/page-2.html#img1_1", credit:"台北故宫博物院",
      note:"元代佚名《至圣先贤半身像》册首开。"
    },
    descartes: {
      name:"勒内·笛卡尔", caption:"1644 年 · 线刻", image:"descartes.webp",
      alt:"笛卡尔肖像背后，赭色圆盘与作图用的坐标和曲线相叠。",
      source:"https://wellcomecollection.org/works/rbhqrxm9", credit:"Wellcome Collection",
      note:"弗兰斯·范·斯霍滕刻，1644 年。馆藏编号 2468i，Public Domain Mark。"
    },
    wollstonecraft: {
      name:"玛丽·沃斯通克拉夫特", caption:"约 1797 年 · 点刻", image:"wollstonecraft.webp",
      alt:"玛丽·沃斯通克拉夫特的点刻肖像，身后错落叠着酒红色的书页。",
      source:"https://www.loc.gov/item/2004680088/", credit:"美国国会图书馆",
      note:"詹姆斯·希思据约翰·奥皮的油画作点刻。所用馆藏照片摄于 1850–1870 年，馆方标注无已知出版限制。"
    }
  };
  const ids=Object.keys(editions);
  const shelfKey="between-minds.portrait-edition.v1";
  const tabKey="between-minds.last-portrait.v1";
  let memory={last:null,remaining:[]};
  let tabLast=null;
  function read(key,store) {
    try{return JSON.parse(window[store].getItem(key));}catch{return null;}
  }
  function save(key,value,store) {
    try{window[store].setItem(key,JSON.stringify(value));}catch{/* The in-page edition still rotates. */}
  }
  function shuffled(items) {
    const copy=[...items];
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }
  function next() {
    const saved=read(shelfKey,"localStorage") || read(shelfKey,"sessionStorage") || memory;
    const previousTab=read(tabKey,"sessionStorage") || tabLast;
    let bag=Array.isArray(saved.remaining) ? [...new Set(saved.remaining.filter(id=>ids.includes(id)))] : [];
    if(!bag.length)bag=shuffled(ids);
    const eligible=id=>id!==saved.last && id!==previousTab;
    const id=bag.find(eligible) || shuffled(ids).find(eligible);
    memory={last:id,remaining:bag.filter(other=>other!==id)};
    tabLast=id;
    save(shelfKey,memory,"localStorage");save(shelfKey,memory,"sessionStorage");
    save(tabKey,id,"sessionStorage");
    return id;
  }

  const svg=(cls,content)=>'<svg class="'+cls+'" viewBox="0 0 1280 1130" aria-hidden="true" focusable="false">'+content+'</svg>';
  const grain='<defs><pattern id="cover-grain" width="176" height="176" patternUnits="userSpaceOnUse"><image href="assets/print-grain.png" width="176" height="176"/></pattern></defs>';
  const withGrain=(path,color)=>'<path d="'+path+'" fill="'+color+'"/><path d="'+path+'" fill="url(#cover-grain)"/>';
  const line=(x1,y1,x2,y2,extra="")=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+extra+'/>';
  const ring='<g transform="translate(667 572) rotate(-24)"><path class="engraved-rule" pathLength="1" d="M -369 113 A 521 160 0 0 0 447 82"/><g class="orbit-bead"><circle class="bead-rim" r="11"/><circle class="bead-ink" r="4"/></g></g>';

  function fan() {
    const cx=658,cy=930;
    const xy=(r,degrees)=>{
      const a=degrees*Math.PI/180;
      return [(cx+r*Math.sin(a)).toFixed(1),(cy-r*Math.cos(a)).toFixed(1)].join(" ");
    };
    const folds=[];
    const palette=["#778c78","#859982","#648370","#77927c"];
    for(let i=0;i<16;i++){
      const a=-53.6+i*6.7,b=a+6.7,mid=(a+b)/2;
      const edge="M"+xy(216,a)+" L"+xy(770,a)+" Q"+xy(778,mid)+" "+xy(770,b)+" L"+xy(216,b)+" Z";
      folds.push('<g class="fan-leaf" data-angle="'+mid.toFixed(1)+'">'+withGrain(edge,palette[i%4])+
        '<path d="M'+xy(54,a)+' L'+xy(758,a)+'" stroke="#414f40" stroke-width="1.6" opacity=".65"/>'+
        '<path d="M'+xy(741,a)+' Q'+xy(749,mid)+' '+xy(741,b)+'" fill="none" stroke="#d7d7b7" stroke-width="1.4"/></g>');
    }
    return svg("portrait-underlay",grain+'<g class="fan-press">'+folds.join("")+'</g>'+
      '<circle cx="1093" cy="712" r="26" fill="#a44630"/><circle cx="1093" cy="712" r="26" fill="url(#cover-grain)"/>');
  }
  function graph() {
    let grid="",ticks="";
    for(let x=256;x<=1094;x+=74){grid+=line(x,194,x,858);ticks+=line(x,851,x,865);}
    for(let y=784;y>=194;y-=74){grid+=line(182,y,1095,y);ticks+=line(175,y,189,y);}
    return svg("portrait-underlay",grain+
      '<g class="geometry-plate"><circle cx="698" cy="488" r="370" fill="#ba8b48"/><circle cx="698" cy="488" r="370" fill="url(#cover-grain)"/></g>'+
      '<g class="graph-grid" fill="none"><g stroke="#484639" stroke-width="1" opacity=".37">'+grid+'</g>'+
      '<path d="M182 155 V858 H1162" stroke="#49473c" stroke-width="2"/><g stroke="#49473c" stroke-width="1.7">'+ticks+'</g></g>'+
      '<path class="graph-curve" pathLength="1" d="M154 181 Q643 1390 1132 181" stroke="#323a3a" stroke-width="3" fill="none"/>'+
      '<path class="graph-guides" stroke="#444938" stroke-width="1.8" stroke-dasharray="7 8" fill="none"/>'+
      '<g class="graph-point"><circle r="10" fill="#f6f3eb" stroke="#333b33" stroke-width="2"/><circle r="4.2" fill="#333b33"/></g>');
  }
  function pages() {
    const shape='M338 178 L1003 178 L1004 801 L998 810 L1000 825 L990 829 L984 827 L970 834 L954 830 L937 838 L923 835 L907 842 L891 839 L872 845 L853 842 L833 849 L812 844 L790 852 L769 849 L747 855 L726 850 L704 856 L682 852 L660 858 L638 854 L616 861 L594 857 L572 865 L550 860 L527 867 L506 864 L483 871 L464 867 L443 874 L421 870 L398 877 L377 873 L357 879 L338 875 Z';
    const leaf=(cls,angle,x,y,color)=>'<g transform="translate('+x+' '+y+') rotate('+angle+' 650 600)"><g class="'+cls+'">'+withGrain(shape,color)+'</g></g>';
    const baseline='<path d="M128 865 Q238 841 343 854 M160 878 Q238 864 297 868" fill="none" stroke="#8e4942" stroke-width="2"/>';
    return svg("portrait-underlay",grain+
      leaf("folio-back",-13,-68,15,"#c3b597")+leaf("folio-middle",12,54,-8,"#ce9d86")+
      leaf("folio-face",-3,1,13,"#904b4b")+baseline+
      '<g class="folio-mark" stroke="#655142" stroke-width="2.2" fill="none"><path pathLength="1" d="M1008 297 Q1051 269 1057 287 Q1065 311 1030 341 Q1068 319 1096 282"/><path pathLength="1" d="M1038 349 Q1077 335 1109 332"/></g>');
  }
  function figure() {
    const id=next(),p=editions[id];
    const underlay=id==="confucius"?fan():id==="descartes"?graph():id==="wollstonecraft"?pages():"";
    const overlay=id==="epicurus"?svg("cover-engraving",ring):"";
    return '<figure class="hero-figure" data-portrait="'+id+'"><div class="cover-sheet">'+underlay+
      '<img class="portrait-print" src="assets/'+p.image+'" alt="'+p.alt+'" width="1280" height="1130" fetchpriority="high">'+overlay+
      '</div><figcaption><i></i><span>'+p.name+'</span><span>'+p.caption+'</span></figcaption></figure>';
  }
  function credits(source) {
    return '<details class="portrait-credits"><summary>卷首肖像出处</summary>'+ids.map(id=>{
      const p=editions[id];return '<p>'+source(p.source,p.name+' · '+p.credit)+'<br>'+p.note+'</p>';
    }).join("")+'</details>';
  }

  // Each print supplies its own paper mechanism, used for its entrance and for pointer tracking.
  function movement(figure,animate) {
    const find=s=>figure.querySelector(s);
    switch(figure.dataset.portrait) {
      case "confucius": {
        const press=find(".fan-press");
        const leaves=figure.querySelectorAll(".fan-leaf");
        leaves.forEach((leaf,i)=>{
          const folded=-Number(leaf.dataset.angle)*.72;
          animate(leaf,[{opacity:.18,transform:"rotate("+folded+"deg)"},{opacity:1,transform:"rotate(0deg)"}],730,25+Math.abs(7.5-i)*12);
        });
        animate(find("img"),[{opacity:.22,transform:"translateY(12px)"},{opacity:1,transform:"none"}],620,35);
        return (x,y)=>press.style.transform="rotate("+(x*3.8+y*.6)+"deg)";
      }
      case "descartes": {
        const curve=find(".graph-curve"), guides=find(".graph-guides"),point=find(".graph-point");
        const grid=find(".graph-grid");
        animate(find(".geometry-plate"),[{clipPath:"inset(0 92% 0 0)"},{clipPath:"inset(0 0% 0 0)"}],650);
        animate(grid,[{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"none"}],590,45);
        animate(curve,[{strokeDashoffset:1},{strokeDashoffset:0}],890,70);
        animate(point,[{opacity:0},{opacity:1}],250,450);
        animate(guides,[{opacity:0},{opacity:1}],350,325);
        animate(find("img"),[{opacity:.1,transform:"translateX(-12px)"},{opacity:1,transform:"none"}],570,60);
        return (x,y)=>{
          const t=.885+.062*x-.023*y;
          const px=154+978*t,py=181+2418*t*(1-t);
          point.setAttribute("transform","translate("+px+" "+py+")");
          guides.setAttribute("d","M182 "+py+" H"+px+" V858");
        };
      }
      case "wollstonecraft": {
        const sheets=[".folio-back",".folio-middle",".folio-face"].map(find);
        sheets.forEach((sheet,i)=>animate(sheet,[
          {opacity:.12,transform:"translate("+((i-1)*46)+"px, 34px) rotate("+((1-i)*14)+"deg)"},
          {opacity:1,transform:"none"}
        ],630,i*60));
        figure.querySelectorAll(".folio-mark path").forEach((mark,i)=>animate(mark,[{strokeDashoffset:1},{strokeDashoffset:0}],420,290+155*i));
        animate(find("img"),[{opacity:.12,transform:"translateY(17px) rotate(-.8deg)"},{opacity:1,transform:"none"}],640,95);
        return (x,y)=>sheets.forEach((sheet,i)=>{
          const depth=i-1;
          sheet.style.transform="translate("+x*depth*15+"px,"+y*depth*9+"px) rotate("+x*depth*2.1+"deg)";
        });
      }
      default: {
        const bead=find(".orbit-bead");
        animate(find("img"),[{opacity:.22,transform:"translate(10px,14px) rotate(1.1deg) scale(.965)"},{opacity:1,transform:"none"}],800);
        animate(find(".engraved-rule"),[{strokeDashoffset:1},{strokeDashoffset:0}],720,100);
        animate(bead,[{opacity:0},{opacity:1}],280,400);
        return (x,y)=>{
          const rad=(50+(x-y*.4)*12)*Math.PI/180;
          bead.setAttribute("transform","translate("+521*Math.cos(rad)+" "+160*Math.sin(rad)+")");
        };
      }
    }
  }
  return {figure,credits,movement};
})();
