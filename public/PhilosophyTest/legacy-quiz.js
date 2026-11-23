/* A session keeps its question history so going back restores the same choices. */
window.LegacyQuiz = (() => {
  const topics = (window.TOPICS || []).map(t => ({...t, questions:t.questions.slice(0,4)}));
  const byId = new Map(topics.map(t => [t.id,t]));
  const ordered = ["freedom","identity","justice","knowledge","happiness","mind","art","politics","language","ethics","science","labour","change","ecology"];
  const broad = [...new Set([...ordered.filter(id=>byId.has(id)),...byId.keys()])];
  const node = (t,q) => ({t,q,pick:null,star:false});
  const isQuestion = x => !!x && byId.has(x.t) && Number.isInteger(x.q) && !!byId.get(x.t).questions[x.q];
  const answered = x => isQuestion(x) && Number.isInteger(x.pick) && !!byId.get(x.t).questions[x.q].options[x.pick];
  const isFork = x => x?.fork === true;
  function fresh(mode, id) {
    return {v:1,mode,at:0,done:false,trail:mode==="full"?[...broad.map(t=>node(t,0)),{fork:true}]:[node(id,0)]};
  }
  function valid(s) {
    return s?.v===1 && ["full","quick"].includes(s.mode) && Array.isArray(s.trail) && s.trail.length>0 && s.trail.length<=76 &&
      Number.isInteger(s.at) && s.at>=0 && s.at<s.trail.length &&
      s.trail.every(x=>isFork(x) || (isQuestion(x) && (x.pick===null || answered(x)))) &&
      (!s.done || s.trail.some(answered));
  }
  function read() {
    try { const s=JSON.parse(localStorage.getItem("between-minds.edition1")); return valid(s)?s:null; }
    catch { return null; }
  }
  function save(s) { try {localStorage.setItem("between-minds.edition1",JSON.stringify(s));return true;} catch {return false;} }
  function evidence(s,t) {return s.trail.filter(x=>x.t===t && answered(x));}
  function scores(rows,t) {
    return byId.get(t).people.map((p,i)=>rows.reduce((sum,x)=>sum+byId.get(t).questions[x.q].options[x.pick].fit[i],0));
  }
  // Missing links are neutral. A documented parallel can break a tie but
  // cannot outweigh a stronger answer in the thinker's own subject.
  function resonances(s,t,i) {
    return (window.CROSS || []).filter(link=>link.t===t && link.i===i &&
      s.trail.some(x=>x.t===link.topic && x.q===0 && x.pick===link.option));
  }
  function nextQuestion(s,t) {
    const topic=byId.get(t), rows=evidence(s,t);
    const missing=topic.questions.map((_,q)=>q).filter(q=>!rows.some(x=>x.q===q));
    if(!missing.length || !rows.length) return missing[0];
    const values=scores(rows,t).map((v,i)=>v+(resonances(s,t,i).length ? .25 : 0)), max=Math.max(...values);
    const weights=values.map(v=>1/(1+max-v)**2);
    // Prefer the question that separates still-plausible pairs of thinkers.
    const utility=q=>topic.questions[q].options.reduce((total,o)=>{
      let dist=0;
      for(let a=0;a<weights.length;a++)for(let b=a+1;b<weights.length;b++)
        dist+=weights[a]*weights[b]*Math.abs(o.fit[a]-o.fit[b]);
      return total+dist;
    },0);
    return missing.sort((a,b)=>utility(b)-utility(a)||a-b)[0];
  }
  function suggestions(s) {
    return broad.filter(t=>evidence(s,t).length<byId.get(t).questions.length).map((t,i)=>{
      const rows=evidence(s,t), v=scores(rows,t);
      const ties=v.filter(n=>n===Math.max(...v)).length;
      const signal=Math.max(...v)-Math.min(...v);
      const supported=byId.get(t).people.some((_,i)=>v[i]===Math.max(...v) && resonances(s,t,i).length>0);
      return {t,i,starred:rows.some(x=>x.star),supported,priority:signal+(supported?2:0)+(ties>1&&ties<v.length?1:0)};
    }).sort((a,b)=>Number(b.starred)-Number(a.starred)||b.priority-a.priority||a.i-b.i);
  }
  function pick(s,i) {
    const x=s.trail[s.at];
    if(x.pick!==i && x.pick!==null) {
      if(s.mode==="full" && s.at<broad.length) {
        s.trail=s.trail.slice(0,broad.length);
        s.trail.push({fork:true});
      } else {s.trail=s.trail.slice(0,s.at+1);}
      s.done=false;
    }
    x.pick=i;
  }
  function advance(s) {
    const x=s.trail[s.at];
    if(!answered(x))return;
    if(s.at<s.trail.length-1){s.at++;return;}
    const next=nextQuestion(s,x.t);
    if(next===undefined){s.done=true;return;}
    s.trail.push(node(x.t,next));s.at++;
  }
  function chooseBranch(s,t) {
    const at=s.at;
    if(s.trail[at+1]?.t===t){s.at++;return;}
    s.trail=s.trail.slice(0,at+1);
    const next=nextQuestion(s,t);
    if(next!==undefined){s.trail.push(node(t,next));s.at++;}
  }
  function extend(s,t) {
    const q=nextQuestion(s,t);
    if(q===undefined)return;
    s.done=false;s.trail.push(node(t,q));s.at=s.trail.length-1;
  }
  function ranks(s) {
    return broad.flatMap(t=>{
      const rows=evidence(s,t);
      if(rows.length<byId.get(t).questions.length)return [];
      return scores(rows,t).map((total,i)=>{
        const links=resonances(s,t,i);
        return {t,i,total,mean:(total+(links.length ? .25 : 0))/rows.length,rows,links};
      });
    }).sort((a,b)=>b.mean-a.mean||b.total-a.total);
  }
  return {topics,byId,broad,fresh,valid,read,save,evidence,suggestions,pick,advance,chooseBranch,extend,ranks,isFork,answered,resonances};
})();

