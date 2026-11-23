/* Store item indices and original option indices. Presentation order is a
   separate, seeded permutation, so revisiting a question preserves its meaning. */
window.Quiz = (() => {
  const topics = window.TOPICS;
  const byId = new Map(topics.map(t => [t.id,t]));
  const broad = [...byId.keys()];
  const baseCount = broad.length * 2;
  const fullCount = baseCount + 6;
  const depth = 4;
  const storageKey = "between-minds.edition1";
  const legacy = window.LegacyQuiz;
  const node = (t,q) => ({t,q,pick:null,star:false});
  const key = row => row.t + "/" + row.q;
  const item = row => byId.get(row?.t)?.questions[row.q];
  const answered = row => !!item(row) && Number.isInteger(row.pick) && !!item(row).options[row.pick];
  const evidence = (s,t) => s.trail.filter(row=>row.t===t && answered(row));
  const initialLength = s => s.mode==="quick" ? depth : s.v===1 ? broad.length+3 : fullCount;
  const orderOf = options => options.map((_,i)=>i);

  // Hash semantic keys rather than consuming a random stream. Reopening an
  // identical prefix gives the same next question, including after a refresh.
  function draw(seed, label) {
    let h = seed ^ 2166136261;
    for(let i=0;i<label.length;i++) h=Math.imul(h ^ label.charCodeAt(i),16777619);
    h=Math.imul(h^(h>>>16),0x21f0aaad);
    h=Math.imul(h^(h>>>15),0x735a2d97);
    return ((h^(h>>>15))>>>0)/4294967296;
  }
  function shuffled(list,s,label) {
    return list.map(v=>({v,n:draw(s.seed,label+"/"+v)})).sort((a,b)=>a.n-b.n).map(x=>x.v);
  }
  function options(s,row) {
    const ids=orderOf(item(row).options);
    return s.v===1 ? ids : shuffled(ids,s,"order/"+key(row));
  }
  function historyFrom(previous) {
    if(!previous)return [];
    const visited=previous.trail.filter((x,i)=>item(x) && (answered(x)||i<=previous.at)).map(key);
    return [visited,...(previous.history||[])].slice(0,3);
  }
  function valid(s) {
    if(s?.v===1)return legacy.valid(s);
    return s?.v===2 && ["full","quick"].includes(s.mode) && Number.isInteger(s.seed) &&
      Array.isArray(s.trail) && s.trail.length>0 && s.trail.length<=broad.length*depth &&
      Number.isInteger(s.at) && s.at>=0 && s.at<s.trail.length &&
      Array.isArray(s.history) && s.history.length<=3 && s.history.every(Array.isArray) &&
      (s.mode!=="full" || s.trail.length>=baseCount) &&
      s.trail.every(x=>Number.isInteger(x?.q) && item(x) && (x.pick===null || answered(x))) &&
      new Set(s.trail.map(key)).size===s.trail.length &&
      (!s.done || s.trail.every(answered));
  }
  function read() {
    try {
      const value=JSON.parse(localStorage.getItem(storageKey));
      const s=value?.resultId ? window.ResultArchive?.get(value.resultId)?.session : value;
      return valid(s)?s:null;
    }
    catch{return null;}
  }
  function save(s,completedId=null) {
    try{
      localStorage.setItem(storageKey,JSON.stringify(completedId ? {resultId:completedId} : s));
      return true;
    }catch{return false;}
  }
  function forget(id) {
    try{
      const value=JSON.parse(localStorage.getItem(storageKey));
      const storedId=value?.resultId || value?.archiveId || (valid(value) ? window.ResultArchive.adopt(value) : null);
      if(storedId===id)localStorage.removeItem(storageKey);
    }catch{/* The archive tombstone is authoritative even if storage is unavailable. */}
  }
  function resonances(s,t,i) {
    return (window.CROSS || []).filter(link=>link.t===t && link.i===i &&
      s.trail.some(row=>row.t===link.topic && row.q===0 && row.pick===link.option));
  }
  // Compare the chosen reason with the alternatives offered on that very item.
  // An item giving a thinker the same fit on every option supplies no evidence.
  function profiles(s,t,rows=evidence(s,t)) {
    return byId.get(t).people.map((_,i)=>{
      let aboveChance=0, available=0, total=0, informative=0;
      for(const row of rows){
        const fits=item(row).options.map(o=>o.fit[i]);
        const avg=fits.reduce((a,b)=>a+b,0)/fits.length, best=Math.max(...fits);
        total+=fits[row.pick];
        if(best===avg)continue;
        informative++;
        aboveChance+=fits[row.pick]-avg;
        available+=best-avg;
      }
      const mean=available ? Math.round(aboveChance/available*1e6)/1e6 : -Infinity;
      return {t,i,rows,total,informative,mean,links:resonances(s,t,i)};
    });
  }
  const linked = r => Number(r.links.length>0);
  function compare(a,b) {return b.mean-a.mean || linked(b)-linked(a);}
  function sameStanding(a,b) {return a.mean===b.mean && linked(a)===linked(b);}
  function topicPriority(s,t) {
    const rows=evidence(s,t), group=profiles(s,t,rows).sort(compare), best=group[0];
    return {t,starred:rows.some(row=>row.star),supported:!!best.links.length,score:best.mean,
      tie:draw(s.seed,"shortlist/"+t)};
  }
  const bySupport = (a,b) => b.score-a.score || Number(b.supported)-Number(a.supported) || a.tie-b.tie;
  function suggestions(s) {
    if(s.v===1)return legacy.suggestions(s);
    return broad.filter(t=>evidence(s,t).length<depth).map(t=>topicPriority(s,t)).sort(bySupport);
  }
  function focusTopics(s) {
    // Only screening responses determine the shortlist. A marked topic may
    // take one place, leaving at least two places selected on answer evidence.
    const base={...s,trail:s.trail.slice(0,baseCount)};
    const ranked=broad.map(t=>topicPriority(base,t)).sort(bySupport);
    const first=ranked.find(x=>x.starred) || ranked[0];
    return [first,...ranked.filter(x=>x!==first).slice(0,2)].map(x=>x.t);
  }
  function discrimination(q, weights) {
    let dist=0;
    for (const o of q.options) for(let a=0;a<weights.length;a++)
      for(let b=a+1;b<weights.length;b++) dist+=weights[a]*weights[b]*Math.abs(o.fit[a]-o.fit[b]);
    return dist;
  }
  function selectItem(s,t,adaptive) {
    const bank=byId.get(t).questions;
    const visited=s.trail.filter(row=>row.t===t);
    const angles=new Set(visited.map(row=>bank[row.q].angle));
    let choices=orderOf(bank).filter(q=>!visited.some(row=>row.q===q));
    const freshAngles=choices.filter(q=>!angles.has(bank[q].angle));
    if(freshAngles.length)choices=freshAngles;
    const rows=evidence(s,t);
    const affinity=adaptive ? profiles(s,t,rows).map(r=>Math.max(-1,r.mean)) : [];
    const leader=Math.max(...affinity);
    const weights=affinity.map(v=>1/(1+leader-v)**2);
    const recent=q=>s.history.reduce((n,list,i)=>n+(list.includes(t+"/"+q)?(4-i)**2:0),0);
    const candidates=choices.map(q=>({q,recent:recent(q),utility:adaptive ? discrimination(bank[q],weights):0,
      lot:draw(s.seed,"item/"+t+"/"+visited.length+"/"+q)}));
    candidates.sort((a,b)=>a.recent-b.recent || b.utility-a.utility || a.lot-b.lot);
    return candidates[0]?.q;
  }
  function fresh(mode,t,previous=null) {
    const random=new Uint32Array(1);
    if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(random);
    else random[0]=Math.floor(Math.random()*4294967296);
    const s={v:2,mode,seed:random[0],history:historyFrom(previous),at:0,done:false,trail:[]};
    if(mode==="quick")s.trail.push(node(t,selectItem(s,t,false)));
    else {
      for(let round=0;round<2;round++){
        const ids=shuffled(broad,s,"round/"+round);
        if(round && ids[0]===s.trail.at(-1).t)ids.push(ids.shift());
        for(const id of ids)s.trail.push(node(id,selectItem(s,id,false)));
      }
    }
    return s;
  }
  function goal(s) {
    if(s.v===1) {
      const n=s.trail.slice(0,s.at+1).filter(x=>!legacy.isFork(x)).length;
      const original=initialLength(s),t=s.trail[s.at].t;
      return n>original ? n+depth-s.trail.slice(0,s.at+1).filter(x=>x.t===t).length : original;
    }
    return s.trail[s.at].end||initialLength(s);
  }
  function trimAfterEdit(s) {
    if(s.mode==="full" && s.at<baseCount)s.trail=s.trail.slice(0,baseCount);
    else s.trail=s.trail.slice(0,s.at+1);
    s.done=false;
  }
  function pick(s,i) {
    if(s.v===1){legacy.pick(s,i);return;}
    const x=s.trail[s.at];
    if(!Number.isInteger(i) || !item(x).options[i])return;
    if(x.pick!==null && x.pick!==i)trimAfterEdit(s);
    x.pick=i;
  }
  function flag(s) {
    const x=s.trail[s.at];x.star=!x.star;
    if(s.v===2 && s.mode==="full" && s.at<baseCount && s.trail.length>baseCount)trimAfterEdit(s);
  }
  function advance(s) {
    if(s.v===1){legacy.advance(s);return;}
    const current=s.trail[s.at];
    if(!answered(current))return;
    if(s.at<s.trail.length-1){s.at++;return;}
    if(s.trail.length>=goal(s)){s.done=true;return;}
    const t=s.mode==="full" && !current.end ? focusTopics(s)[(s.trail.length-baseCount)%3] : current.t;
    const next=node(t,selectItem(s,t,true));
    if(current.end)next.end=current.end;
    s.trail.push(next);s.at++;
  }
  function extend(s,t) {
    if(s.v===1){legacy.extend(s,t);return;}
    const left=depth-evidence(s,t).length;
    if(!s.done || !byId.has(t) || left<=0)return;
    const next=node(t,selectItem(s,t,true));
    next.end=s.trail.length+left;
    s.done=false;s.at=s.trail.length;s.trail.push(next);
  }
  function ranks(s) {
    if(s.v===1)return legacy.ranks(s);
    return broad.flatMap(t=>evidence(s,t).length>=depth ? profiles(s,t).filter(p=>p.informative>0) : []).sort(compare);
  }
  return {topics,byId,broad,fullCount,baseCount,initialLength,goal,options,flag,sameStanding,fresh,valid,
    read,save,forget,evidence,suggestions,pick,advance,extend,ranks,answered,resonances,
    isFork:legacy.isFork,chooseBranch:legacy.chooseBranch};
})();
