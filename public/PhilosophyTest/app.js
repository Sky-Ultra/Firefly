"use strict";
(() => {
  const Q = window.Quiz;
  const A = window.ResultArchive;
  const unsaved = new Set();
  let viewed=null, deleteId=null;
  const main = document.querySelector("main");
  const dialog = document.querySelector("dialog");
  const escape = val => String(val ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const iconPaths = {
    book:'<path d="M2.5 5.5c4.2-1.8 6.6-1.4 9.5.6 2.9-2 5.3-2.4 9.5-.6v13c-4-1.6-6.7-1.2-9.5.6-2.8-1.8-5.5-2.2-9.5-.6zM12 6.1v13"/>',
    flask:'<path d="M9 3h6m-5 0v6l-6 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-6-9V3M7 15h10"/>',
    search:'<circle cx="10" cy="10" r="6.4"/><path d="m15 15 6 6"/>',
    flag:'<path d="M6 3.5h12v17l-6-4-6 4z"/>',
    copy:'<rect x="8" y="7" width="12" height="14" rx="1"/><path d="M16 7V3H4v14h4"/>'
  };
  const icon = n => '<svg aria-hidden="true" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[n]+'</svg>';
  const source = (url,label) => '<a class="link" href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>';
  const printed = {freedom:"On Freedom",justice:"On Justice",mind:"On Mind"};
  let session=Q.read(), query="",filter="",pending=null,notifyTimer;
  const titles={home:"哲学倾向测试",experiments:"思想实验",index:"哲学家索引",quiz:"作答",result:"你的哲学阅读单",record:"你的哲学阅读单",history:"历次结果"};
  const page=()=>location.hash.slice(1).split("/")[0]||"home";
  function notify(msg){const el=document.querySelector("#notice");el.textContent=msg;el.classList.add("on");clearTimeout(notifyTimer);notifyTimer=setTimeout(()=>el.classList.remove("on"),2800);}
  function complete(s,imported=false){
    let saved=A.save(s,{imported});
    if(saved.reason==="conflict"){
      A.start(s);
      saved=A.save(s);
      if(saved.ok)notify("另一窗口也完成了追问，这一份已单独保存。");
    }
    if(saved.ok)unsaved.delete(s.archiveId);
    else if(saved.reason!=="deleted")unsaved.add(s.archiveId);
    if(s===session && saved.reason!=="deleted")Q.save(s,saved.ok?saved.id:null);
    return saved;
  }
  function persist(){
    if(!session)return;
    if(A.isDeleted(session.archiveId)){Q.forget(session.archiveId);session=null;to("history");return;}
    if(session.done){complete(session);return;}
    if(!Q.save(session))notify("本次进度仅保留在当前页面");
  }
  function to(route){if(location.hash==="#"+route)render();else location.hash=route;}
  function topFocus(){window.scrollTo({top:0,behavior:"instant"});main.focus({preventScroll:true});}
  function popup(title,body,byline=false){
    const signature=byline?'<p class="about-signature" lang="en">Made by Sky.</p>':"";
    dialog.querySelector(".dialog-body").innerHTML=signature+'<button class="closing" aria-label="关闭" data-action="close">×</button><h2 id="dialog-title">'+escape(title)+'</h2>'+body;
    if(!dialog.open)dialog.showModal();
  }
  const previews=new Map();
  function shortPreview(id){
    if(!previews.has(id))previews.set(id,Q.fresh("quick",id,session));
    return previews.get(id);
  }
  function firstTitle(t){return t.questions[shortPreview(t.id).trail[0].q].title;}
  function plates(){
    return '<div class="plates">'+Object.entries(printed).filter(([t])=>Q.byId.has(t)).map(([t,en])=>{
      const topic=Q.byId.get(t);
      return '<button class="plate '+t+'" data-action="start-short" data-id="'+t+'"><span class="plate-text"><em lang="en">'+en+'</em><strong>'+escape(topic.name)+'</strong><small>'+escape(firstTitle(topic))+'</small></span><canvas data-print="'+t+'" aria-hidden="true"></canvas></button>';
    }).join("")+'</div>';
  }
  function home(){
    const oldProgress=session?.v===1 && !session.done;
    const resume=session?.v===2 && !session.done;
    return '<div class="wrap"><section class="hero"><div class="hero-copy"><div class="kicker">哲学倾向测试</div><h1>你的想法，<br><span>与谁相近？</span></h1><p class="hero-desc">从生活里的两难出发，在 '+Q.topics.reduce((n,t)=>n+t.people.length,0)+' 位哲学家中，<br>遇见一个值得读下去的人。</p><div class="hero-actions"><button class="primary" data-action="'+(resume?"resume":"start-full")+'">'+icon("book")+(resume?"继续上次作答":"开始完整测试")+'</button><a class="text-btn" href="#experiments">'+icon("flask")+'先做个思想实验</a></div><p class="hero-facts">'+(resume?'已答 '+session.trail.filter(Q.answered).length+' 题　·　<button class="quiet" data-action="start-full">另起完整测试</button>':oldProgress?'34 道题　·　<button class="quiet" data-action="resume">续答旧版（已答 '+session.trail.filter(Q.answered).length+' 题）</button>':'34 道题　·　约 12–18 分钟')+(session?.done?'　<a class="quiet" href="#result">上次结果</a>':'')+'</p></div>'+window.Portraits.figure()+'</section><section class="featured"><div class="section-heading"><h2>思想实验室</h2><a class="link" href="#experiments">查看全部 '+Q.topics.length+' 个议题</a></div>'+plates()+'</section></div>';
  }
  function experiments(){
    return '<div class="page wrap"><div class="page-head"><h1>思想实验室</h1><p class="intro">挑一个让你停下来的问题。四次选择，读一位哲学家。</p></div>'+plates()+'<h2 class="subhead">全部议题</h2><div class="topic-list">'+Q.broad.map(id=>{
      const t=Q.byId.get(id);return '<button class="topic-item" data-action="start-short" data-id="'+id+'"><strong>'+escape(t.name)+'</strong><span>'+escape(firstTitle(t))+'</span></button>';
    }).join("")+'</div></div>';
  }
  function indexPage(){
    return '<div class="page wrap"><div class="page-head"><h1>哲学家索引</h1><p class="intro">找一个名字，翻开一本书。</p></div><div class="filterbar"><label class="search-box">'+icon("search")+'<input type="search" id="search" aria-label="搜索哲学家、书名或议题" placeholder="搜索姓名、书名或议题" value="'+escape(query)+'"></label><select id="filter" aria-label="按议题筛选"><option value="">全部议题</option>'+Q.topics.map(t=>'<option value="'+t.id+'" '+(filter===t.id?"selected":"")+'>'+escape(t.name)+'</option>').join("")+'</select><output id="count" aria-live="polite"></output></div><div id="index-rows" class="index-list"></div></div>';
  }
  function fillIndex(){
    const term=query.trim().toLocaleLowerCase();
    const matches=Q.topics.filter(t=>!filter||filter===t.id).flatMap(t=>t.people.map((p,i)=>({t,p,i}))).filter(({t,p})=>[p.name,p.en,p.book,t.name].join(" ").toLocaleLowerCase().includes(term));
    document.querySelector("#count").textContent=matches.length+" 位哲学家";
    document.querySelector("#index-rows").innerHTML=matches.length?matches.map(({t,p,i})=>'<button class="index-entry" data-action="person" data-id="'+t.id+'" data-num="'+i+'"><small>'+escape(t.name)+'</small><strong>'+escape(p.name)+'</strong><span lang="en">'+escape(p.en)+'</span></button>').join(""):'<p class="empty">没有找到这个名字。可以换个词，或选择其他议题。</p>';
  }
  function bookName(name){return name.startsWith("《")?name:"《"+name+"》";}
  function reading(p){
    return '<aside class="reading"><h2>从这本书开始</h2><strong>'+escape(bookName(p.book))+'</strong><p>'+escape(p.guide)+'</p>'+source(p.url,"查看参考资料")+'</aside>';
  }
  function person(t,i){
    const p=Q.byId.get(t)?.people[i];if(!p)return;
    popup(p.name,'<div class="latin" lang="en">'+escape(p.en)+'</div><p>'+escape(p.idea)+'</p>'+reading(p)+'<div class="dialog-actions"><button class="text-btn" data-action="start-short" data-id="'+t+'">试答「'+escape(Q.byId.get(t).name)+'」</button></div>');
  }
  function branchBtn(item){
    const t=Q.byId.get(item.t);return '<button class="branch" data-action="branch" data-id="'+t.id+'"><b>'+escape(t.name)+'</b><span>'+escape(t.questions[1].title)+(item.starred?' · 已标记':item.supported?' · 呼应了你在另一题的选择':'')+'</span></button>';
  }
  function forkPage(){
    const list=Q.suggestions({...session,trail:session.trail.slice(0,session.at)});
    return '<div class="article page"><div class="quiz-topic">基础题已完成</div><h1 class="question-title">哪一题，你还想多聊几句？</h1><p class="scene">结合刚才的选择，可以从下面三个议题继续。再答三道追问，就能看见你的第一份阅读单。</p><div class="branches">'+list.slice(0,3).map(branchBtn).join("")+'</div><details><summary>另选一个议题</summary><div class="branches">'+list.slice(3).map(branchBtn).join("")+'</div></details><div class="quiz-foot"><button class="quiet" data-action="back">上一题</button></div></div>';
  }
  function quiz(){
    const x=session.trail[session.at];if(Q.isFork(x))return forkPage();
    const t=Q.byId.get(x.t),q=t.questions[x.q];
    const n=session.trail.slice(0,session.at+1).filter(row=>!Q.isFork(row)).length;
    const goal=Q.goal(session);
    const baseLength=session.v===1?Q.broad.length:Q.baseCount;
    const isBase=session.mode==="full" && n<=baseLength;
    const sub=isBase?"基础题":session.mode==="quick"&&n<=4?"思想实验":"延伸追问";
    const answers=Q.options(session,x).map((i,position)=>'<button class="answer" aria-pressed="'+(x.pick===i)+'" data-action="answer" data-num="'+i+'"><span class="letter" aria-hidden="true">'+String.fromCharCode(65+position)+'</span><span>'+escape(q.options[i].text)+'</span></button>').join("");
    return '<div class="page article"><div class="quiz-head"><span>'+(session.v===1?'旧版 · ':'')+sub+'　'+n+' / '+goal+'</span>'+(session.v===1?'<button class="quiet" data-action="start-full">开始新版 34 题</button>':'')+'<a class="quiet" href="#home">暂存离开</a></div><div class="progress" role="progressbar" aria-label="题目进度" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="'+goal+'"><i style="width:'+100*n/goal+'%"></i></div><div class="quiz-topic">'+escape(t.name)+'</div><h1 class="question-title">'+escape(q.title)+'</h1><p class="scene">'+escape(q.scene)+'</p><div class="answers" role="group" aria-label="选择最贴近你想法的一项">'+answers+'</div><div class="quiz-foot"><button class="quiet" data-action="back" '+(!session.at?"disabled":"")+'>上一题</button>'+(isBase?'<button class="flag" data-action="flag" aria-pressed="'+!!x.star+'">'+icon("flag")+(x.star?"已标记":"想继续聊这题")+'</button>':'')+'<button class="primary" data-action="next" '+(x.pick===null?"disabled":"")+'>'+(n===goal?"查看阅读单":session.v===1&&isBase&&n===baseLength?"选择追问议题":isBase&&n===baseLength?"进入追问":"下一题")+'</button></div></div>';
  }
  function evidenceBlock(r,diff){
    const t=Q.byId.get(r.t);
    const items=r.rows.map(x=>{
      const q=t.questions[x.q],score=q.options[x.pick].fit[r.i];
      const best=q.options.reduce((a,b)=>a.fit[r.i]>=b.fit[r.i]?a:b);
      return {q,o:q.options[x.pick],score,best,gap:best.fit[r.i]-score,informative:q.options.some(option=>option.fit[r.i]!==score)};
    });
    const hit=diff?items.filter(o=>o.gap>0).sort((a,b)=>b.gap-a.gap)[0]:items.filter(o=>o.score===2 && o.informative).sort((a,b)=>a.q.options.filter(o=>o.fit[r.i]===2).length-b.q.options.filter(o=>o.fit[r.i]===2).length)[0];
    const heading=diff?"你们的分岔":"你们的交点";
    if(!hit)return '<section><h2>'+heading+'</h2><p>'+(diff?'这几题里，还找不到一个能说明你们想法不同的选择。':'这组选择没有出现明确的重合。可以先读读这位哲学家提出的问题。')+'</p></section>';
    return '<section><h2>'+heading+'</h2><h3>'+escape(hit.q.title)+'</h3><p>你选了「'+escape(hit.o.text)+'」</p><p>'+(diff?'按本题的编读，较贴近'+escape(t.people[r.i].name)+'的回答是「'+escape(hit.best.text)+'」':'这条理由也切中了'+escape(t.people[r.i].name)+'在这个议题上关心的问题。')+'</p></section>';
  }
  function echoes(r) {
    if(!r.links.length)return "";
    const link=r.links[0],t=Q.byId.get(link.topic),q=t.questions[0];
    return '<div class="echo"><h2>另一题里的呼应</h2><p>在「'+escape(q.title)+'」里，你选了「'+escape(q.options[link.option].text)+'」</p><p>'+escape(link.note)+'</p></div>';
  }
  const reports=window.createResultViews({escape,reading,evidenceBlock,echoes,bookName});
  function result(){
    const parts=location.hash.slice(1).split("/");
    const historical=parts[0]==="record";
    const id=historical?parts[1]:session?.archiveId;
    const record=id?A.get(id):null;
    const s=historical?record?.session:(record?.session || session);
    if(!s?.done || A.isDeleted(id)){viewed=null;return reports.empty(true);}
    viewed={s,record};
    const at=historical?2:1;
    const resume=!!session && !session.done && session.archiveId===id;
    return reports.detail(s,record,parts[at],Number(parts[at+1]),{resume,unsaved:unsaved.has(id)});
  }
  function history(){return reports.history(A.list(),unsaved);}
  function deletion(id){
    const record=A.get(id);
    if(!record){to("history");return;}
    deleteId=id;
    const m=reports.describe(record);
    const detail=m?escape(m.person.name)+" · "+m.mode+" · "+m.count+" 题 · "+escape(m.date):"这次测试";
    const extra=session && !session.done && session.archiveId===id?"这次测试尚未完成的追问也会一并删除。":"";
    popup("删除这次结果？",'<p>'+detail+'</p><p>这份阅读单和它的答案会从本机删除。'+extra+'</p><p class="delete-status" role="status"></p><div class="dialog-actions"><button class="secondary" data-action="close" autofocus>保留结果</button><button class="primary danger-confirm" data-action="confirm-delete">删除这次结果</button></div>');
  }
  function removeRecord(){
    if(!deleteId)return;
    const id=deleteId;
    const removed=A.remove(id);
    if(!removed.ok){dialog.querySelector(".delete-status").textContent="本机未能写入删除操作，请重试。";return;}
    Q.forget(id);unsaved.delete(id);deleteId=null;
    if(session?.archiveId===id)session=Q.read();
    to("history");notify("已删除这次结果");
  }
  function extendRecord(t,confirmed=false){
    const s=viewed?.s;
    if(!s || A.isDeleted(s.archiveId)){to("history");return;}
    if(session && !session.done && session.archiveId!==s.archiveId && !confirmed){
      pending={topic:t};
      popup("切换到这次追问？",'<p>当前尚未完成的作答会被替换。</p><div class="dialog-actions"><button class="secondary" data-action="close">保留当前作答</button><button class="primary" data-action="confirm-extend">开始追问</button></div>');
      return;
    }
    const record=A.get(s.archiveId);
    session=record?.session || s;
    Q.extend(session,t);persist();to("quiz");
  }
  let renderedURL="";
  function render(){
    renderedURL=location.href;
    if(dialog.open)dialog.close();
    let route=page();
    if(!titles[route])route="home";
    if(route==="quiz" && (!session||session.done))route=session?.done?"result":"home";
    if(route==="result" && !session?.done)route=session?"quiz":"home";
    const views={home,experiments,index:indexPage,quiz,result,record:result,history};
    if(!["record","result"].includes(route))viewed=null;
    window.Motion?.beforeRender();
    if(route==="home" || route==="experiments")previews.clear();
    main.innerHTML=views[route]();
    document.title=titles[route]+" · 思想之间";
    document.querySelectorAll("[data-nav]").forEach(a=>{
      if(a.dataset.nav===route)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
    });
    const shelfLink=document.querySelector(".shelf-nav");
    if(route==="history")shelfLink.setAttribute("aria-current","page");else shelfLink.removeAttribute("aria-current");
    if(route==="index")fillIndex();
    window.drawPrints();
    topFocus();
    window.Motion?.afterRender(route==="record"?"result":route,session?.at);
  }
  function start(mode,t,confirmed=false){
    if(session && !confirmed && (!session.done || unsaved.has(session.archiveId))){
      pending={mode,t};
      const message=session.done?"这份结果还没能保存到本机，关闭页面后可能丢失。":"开始后会替换当前尚未完成的答题进度。";
      popup("开始新的作答？",'<p>'+message+'</p><div class="dialog-actions"><button class="primary" data-action="confirm-start">开始新测试</button><button class="secondary" data-action="close">保留当前记录</button></div>');
      return;
    }
    if(dialog.open)dialog.close();
    session=mode==="quick"?shortPreview(t):Q.fresh(mode,t,session);A.start(session);previews.clear();persist();to("quiz");
  }
  function share(t,i){
    const topic=Q.byId.get(t),p=topic.people[i];
    const words='我的哲学阅读单 · 思想之间\n'+p.name+'｜'+topic.name+'\n'+p.idea+'\n从这里读起：'+bookName(p.book)+'\n'+p.url;
    const card=window.makeBookplate(p,topic,bookName(p.book));
    popup("分享你的阅读单",'<img class="share-card" alt="你的哲学阅读单，'+escape(p.name)+'" src="'+card+'"><div class="dialog-actions"><a class="primary" download="思想之间－'+escape(p.name)+'.png" href="'+card+'">保存图片</a><button class="secondary" data-action="copy">复制文字</button></div><details><summary>查看分享文字</summary><textarea class="sharefield" aria-label="阅读单分享文字" readonly>'+escape(words)+'</textarea></details>');
  }
  async function copy(){
    const field=dialog.querySelector("textarea");
    try{await navigator.clipboard.writeText(field.value);notify("阅读单已复制");}
    catch{field.closest("details").open=true;field.focus();field.select();if(document.execCommand("copy"))notify("阅读单已复制");else notify("文字已选中，可以使用系统复制");}
  }
  function updateQuiz(){persist();render();}
  document.addEventListener("click",evt=>{
    const homeLink=evt.target.closest('a[href="#home"]');
    if(homeLink && location.hash==="#home" && !evt.ctrlKey && !evt.shiftKey && !evt.metaKey && !evt.altKey){
      evt.preventDefault();render();return;
    }
    const b=evt.target.closest("[data-action]");if(!b)return;
    const {action,id,num}=b.dataset;
    switch(action){
      case "about":popup("关于《思想之间》",'<p>题库有 '+Q.topics.reduce((n,t)=>n+t.questions.length,0)+' 道题。完整测试先从十四个议题各抽两道，再挑三个议题，各追问两次。最近做过的题会尽量错开。只想先试试，可以挑一个议题做四题。</p><p>前二十八题用来挑追问方向，标记的议题最多占其中一席。每次追问都会优先换个角度，看看你在几种相近的主张之间更赞成哪一种。</p><p>每个议题都对照五位哲学家。我们比较你选的理由与同题其他理由：如果怎么选都一样贴近某位作者，这道题就不参与对他的判断。答满四个角度的议题才进入阅读单。分数相同时参考其他题中有出处的呼应，仍然相同就并列。</p><p>这是编辑按原著做的阅读推荐。你可以在结果里核对原题，从随附的书目开始读。阅读单按次保存在当前浏览器，在「历次结果」里可以回看或删除。</p><p>'+source("https://survey2020.philpeople.org/survey/design/questions","议题参考 · PhilPapers Survey")+'</p>'+window.Portraits.credits(source),true);break;
      case "close":dialog.close();break;
      case "resume":to("quiz");break;
      case "start-full":start("full");break;
      case "start-short":start("quick",id);break;
      case "confirm-start":if(pending){start(pending.mode,pending.t,true);pending=null;}break;
      case "person":person(id,Number(num));break;
      case "answer":{
        Q.pick(session,Number(num));persist();
        main.querySelectorAll(".answer").forEach(el=>el.setAttribute("aria-pressed",String(el===b)));
        main.querySelector('[data-action="next"]').disabled=false;break;
      }
      case "flag":{const x=session.trail[session.at];Q.flag(session);persist();b.setAttribute("aria-pressed",String(x.star));b.innerHTML=icon("flag")+(x.star?"已标记":"想继续聊这题");break;}
      case "back":if(session.at>0){session.at--;updateQuiz();}break;
      case "next":Q.advance(session);persist();if(!session)break;if(session.done){to(A.get(session.archiveId)?"record/"+session.archiveId:"result");}else render();break;
      case "branch":Q.chooseBranch(session,id);updateQuiz();break;
      case "extend-menu":popup("再聊一个议题",'<div class="branches">'+Q.suggestions(viewed.s).map(({t})=>'<button class="branch" data-action="extend" data-id="'+t+'"><b>'+escape(Q.byId.get(t).name)+'</b></button>').join("")+'</div>');break;
      case "extend":extendRecord(id);break;
      case "confirm-extend":if(pending){extendRecord(pending.topic,true);pending=null;}break;
      case "delete-result":deletion(id);break;
      case "confirm-delete":removeRecord();break;
      case "retry-archive":{
        const s=session?.archiveId===viewed?.s.archiveId?session:viewed?.s;
        if(s){const saved=complete(s);if(saved.ok){to("record/"+saved.id);notify("已保存到历次结果");}else notify("本机存储仍不可用");}
        break;
      }
      case "share":share(id,Number(num));break;
      case "copy":copy();break;
    }
  });
  document.addEventListener("input",e=>{if(e.target.id==="search"){query=e.target.value;fillIndex();}});
  document.addEventListener("change",e=>{if(e.target.id==="filter"){filter=e.target.value;fillIndex();}});
  dialog.addEventListener("click",e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  window.addEventListener("hashchange",e=>{if(e.newURL===location.href && renderedURL!==location.href)render();});
  window.addEventListener("pageshow",e=>{if(e.persisted && page()==="home")render();});
  window.addEventListener("storage",e=>{
    if(e.key!==null && !A.isArchiveKey(e.key))return;
    if(session && A.isDeleted(session.archiveId)){
      const id=session.archiveId;Q.forget(id);session=Q.read();unsaved.delete(id);
      if(["result","quiz"].includes(page())){to("history");return;}
    }
    if(["history","record"].includes(page()))render();
  });
  if(session){
    const id=A.adopt(session);
    if(A.isDeleted(id)){Q.forget(id);session=null;}
    else if(session.done)complete(session,true);
    else Q.save(session);
  }
  render();
})();
