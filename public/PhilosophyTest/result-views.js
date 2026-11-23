/* Reading sheets and the local shelf share the same record and ranking. */
window.createResultViews = function createResultViews({escape,reading,evidenceBlock,echoes,bookName}) {
  const Q=window.Quiz;
  const dates=new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false});
  function date(record) {
    return record?.completedAt ? dates.format(new Date(record.completedAt)) : "完成时间未记录";
  }
  function mode(s) {return s.mode==="quick"?"思想实验":s.v===1?"旧版完整测试":"完整测试";}
  function describe(record) {
    const s=record.session;
    const best=window.ResultArchive.rankings(record)[0];
    if(!best)return null;
    const topic=Q.byId.get(best.t);
    return {person:topic.people[best.i],topic,mode:mode(s),count:s.trail.filter(Q.answered).length,date:date(record)};
  }
  function empty(missing=false) {
    return '<div class="page wrap shelf"><div class="page-head"><h1>历次结果</h1></div><p class="shelf-empty">'+(missing?'这份结果已删除，或未保存在当前浏览器。':'书架上还没有阅读单。完成一次测试，你的结果就会收在这里。')+'</p><a class="text-btn" href="'+(missing?'#history':'#home')+'">'+(missing?'查看其他结果':'回到首页')+'</a></div>';
  }
  function history(records,unsaved=new Set()) {
    if(!records.length)return empty();
    const rows=records.map(record=>{
      const m=describe(record);
      if(!m)return "";
      const id=escape(record.id);
      return '<li class="shelf-row"><a class="shelf-open" href="#record/'+id+'"><div class="shelf-date">'+escape(m.date)+'<small>'+m.mode+' · '+m.count+' 题'+(unsaved.has(record.id)?' · 本页暂存':'')+'</small></div>'+
        '<div class="shelf-label"><span>'+escape(m.topic.name)+'</span><strong>'+escape(m.person.name)+'</strong><em lang="en">'+escape(m.person.en)+'</em></div>'+
        '<div class="shelf-book">'+escape(bookName(m.person.book))+'</div></a>'+
        '<button class="shelf-delete" data-action="delete-result" data-id="'+id+'" aria-label="删除'+escape(m.person.name)+'这次结果">删除</button></li>';
    }).join("");
    return '<div class="page wrap shelf"><div class="page-head"><h1>历次结果</h1><p class="intro">本机阅读单，共 '+records.length+' 份。</p></div><ul class="shelf-list">'+rows+'</ul><a class="text-btn" href="#home">回到首页</a></div>';
  }
  function detail(s,record,topicId,personIndex,actions) {
    const ranks=record?window.ResultArchive.rankings(record):Q.ranks(s);
    if(!ranks.length)return empty(true);
    const r=ranks.find(v=>v.t===topicId&&v.i===personIndex)||ranks[0];
    const t=Q.byId.get(r.t),p=t.people[r.i];
    const same=(a,b)=>a.standing!==undefined && b.standing!==undefined?a.standing===b.standing:Q.sameStanding(a,b);
    const others=ranks.filter(o=>o!==r),peers=others.filter(o=>same(o,r));
    const qualified=r.informative!==undefined && (r.informative<3 || r.mean<=0);
    const interpretation=qualified?"这组回答给出的线索还少，可以再聊一个议题。":
      !same(r,ranks[0])?"这是另一种可供对照的读法。":
      peers.length?"还有其他读法同样说得通，可以在下面对照。":"在本次深入比较的议题里，这位作者的理由与你最合拍。";
    const prefix=record?'#record/'+escape(record.id):'#result';
    const links=arr=>arr.map(v=>'<a class="link" href="'+prefix+'/'+v.t+'/'+v.i+'">'+escape(Q.byId.get(v.t).people[v.i].name)+'</a>').join("");
    const related=(label,arr)=>arr.length?'<div class="related"><span>'+label+'</span>'+links(arr)+'</div>':'';
    const near=r.rows.filter(x=>t.questions[x.q].options[x.pick].fit[r.i]===2).length;
    const meta=escape(t.name)+'　·　'+mode(s)+'　·　'+s.trail.filter(Q.answered).length+' 题';
    const action=actions.resume?'<a href="#quiz" class="primary">继续这次追问</a>':
      Q.suggestions(s).length?'<button class="primary" data-action="extend-menu">再聊一个议题</button>':'';
    return '<div class="page wrap result-edition"><div class="result-rule"><div class="kicker">你的哲学阅读单</div><a class="quiet" href="#history">历次结果</a></div>'+
      '<div class="result-layout">'+window.ResultArt.render(t,r.i)+'<div class="result-identity"><p class="result-subject">'+meta+'</p><h1 class="result-title">'+escape(p.name)+'</h1><div class="latin" lang="en">'+escape(p.en)+'</div></div>'+
      '<p class="result-idea">'+escape(p.idea)+'</p><p class="metadata">在「'+escape(t.name)+'」的 '+r.rows.length+' 次选择中，'+near+' 次与其立场贴近。'+interpretation+'</p></div>'+
      '<div class="result-spread"><div class="result-plot">'+window.ResultChart.render(s,r)+'</div><div class="result-margins"><div class="evidence">'+evidenceBlock(r,false)+evidenceBlock(r,true)+'</div>'+echoes(r)+reading(p)+'</div></div>'+
      related("同样接近",peers)+related("换位读读",others.filter(o=>!same(o,r)).slice(0,3))+
      '<div class="result-actions">'+action+'<button class="secondary" data-action="share" data-id="'+t.id+'" data-num="'+r.i+'">分享阅读单</button><button class="text-btn" data-action="start-full">重新测试</button></div>'+
      '<details class="answer-transcript"><summary>查看我的全部回答</summary>'+s.trail.filter(Q.answered).map(x=>{const q=Q.byId.get(x.t).questions[x.q];return '<p class="review-answer"><b>'+escape(q.title)+'</b><br>'+escape(q.options[x.pick].text)+'</p>';}).join("")+'</details>'+
      '<div class="result-filing">'+(actions.unsaved?'<span>本次结果暂未写入本机。</span><button class="quiet" data-action="retry-archive">重试保存</button>':record?'<span>'+escape(date(record))+'　·　已存入历次结果</span>':'')+
      (record?'<button class="shelf-delete" data-action="delete-result" data-id="'+escape(record.id)+'">删除这次结果</button>':'')+'</div></div>';
  }
  return {date,describe,empty,history,detail};
};
