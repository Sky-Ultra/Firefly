"use strict";
window.ResultArchive = (() => {
  const Q = window.Quiz;
  const prefix = "between-minds.archive.v1.";
  const recordPrefix = prefix + "result.";
  const deletedPrefix = prefix + "removed.";
  const validId = id => typeof id === "string" && /^[a-z0-9-]{1,96}$/i.test(id);
  const validRevision = rev => typeof rev === "string" && /^[a-f0-9]{16}$/.test(rev);
  const validDate = ms => Number.isSafeInteger(ms) && ms >= 0 && ms <= 8640000000000000;
  const copy = value => JSON.parse(JSON.stringify(value));
  const pending = new Map();
  const cached = new Map();
  const deleted = new Set();
  const keyFor = record => recordPrefix + record.id + "." + record.revision;
  const failure = (reason,id,record=null) => ({ok:false,reason,id,record:record && copy(record)});

  function contentOf(session) {
    const data = {...session};
    delete data.archiveId;
    delete data.archiveRevision;
    delete data.archiveCompletedAt;
    // Legacy objects and newly constructed objects can have different field order.
    return JSON.stringify(data, (_,v) => v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.keys(v).sort().map(k => [k,v[k]])) : v);
  }

  function fingerprint(text) {
    let a = 2166136261, b = 5381;
    for (let i=0; i<text.length; i++) {
      a = Math.imul(a ^ text.charCodeAt(i),16777619);
      b = Math.imul(b ^ text.charCodeAt(i),1597334677);
    }
    return [a,b].map(n => (n>>>0).toString(16).padStart(8,"0")).join("");
  }

  function randomToken() {
    const crypto = globalThis.crypto;
    let token;
    if (crypto?.randomUUID) token = crypto.randomUUID();
    else if (crypto?.getRandomValues) {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      token = Array.from(bytes,n => n.toString(16).padStart(2,"0")).join("");
    } else token = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    return token;
  }

  function start(s) {
    s.archiveId = "run-" + randomToken();
    delete s.archiveRevision;
    delete s.archiveCompletedAt;
    return s.archiveId;
  }

  function adopt(s) {
    if (!s || typeof s !== "object") return null;
    if (!validId(s.archiveId)) s.archiveId = "old-" + fingerprint(contentOf(s));
    return s.archiveId;
  }

  function validFinished(s) {
    return s?.done === true && Q.valid(s) && s.trail.every(row => Q.isFork(row) || Q.answered(row));
  }

  function snapshotOf(s) {
    const ranks = Q.ranks(s);
    return ranks.map(r => {
      const topic = Q.byId.get(r.t), person = topic.people[r.i];
      return {
        t:r.t,i:r.i,name:person.name,en:person.en,topic:topic.name,
        // JSON would otherwise silently convert an infinite score to null.
        mean:Number.isFinite(r.mean) ? r.mean : String(r.mean),total:r.total,
        informative:r.informative ?? null,links:copy(r.links),
        standing:ranks.findIndex(other => Q.sameStanding(r,other))
      };
    });
  }

  function validSnapshot(entries) {
    return Array.isArray(entries) && entries.length > 0 && entries.every((r,index) =>
      r && Number.isInteger(r.i) && Q.byId.get(r.t)?.people[r.i] &&
      typeof r.name === "string" && typeof r.en === "string" && typeof r.topic === "string" &&
      (Number.isFinite(r.mean) || r.mean === "Infinity" || r.mean === "-Infinity") &&
      Number.isFinite(r.total) && (r.informative === null || Number.isInteger(r.informative)) &&
      Number.isInteger(r.standing) && r.standing >= 0 && r.standing <= index &&
      Array.isArray(r.links) && r.links.every(link => link &&
        typeof link.note === "string" && Number.isInteger(link.option) &&
        Q.byId.get(link.topic)?.questions[0]?.options[link.option]));
  }

  function rankings(record) {
    if (!record?.session) return [];
    const entries = validSnapshot(record.rankings) ? record.rankings : snapshotOf(record.session);
    const rows = new Map();
    return entries.map(entry => {
      if (!rows.has(entry.t)) rows.set(entry.t,Q.evidence(record.session,entry.t));
      const r = {...entry,mean:Number(entry.mean),rows:rows.get(entry.t),links:copy(entry.links)};
      // LegacyQuiz has no informative-item statistic. Preserve its display semantics.
      if (r.informative === null) delete r.informative;
      return r;
    });
  }

  function decode(key,value) {
    try {
      const r = JSON.parse(value);
      if (!r || !validId(r.id) || !validRevision(r.revision) || key !== keyFor(r)
          || !(r.parent === null || validRevision(r.parent)) || !validDate(r.savedAt)
          || !(r.completedAt === null || validDate(r.completedAt)) || !(r.updatedAt === null || validDate(r.updatedAt))
          || r.session?.archiveId !== r.id || r.session.archiveRevision !== r.revision || !validFinished(r.session)
          || !(validSnapshot(r.rankings) || Q.ranks(r.session).length)) return null;
      return r;
    } catch { return null; }
  }

  // Each completion writes its own immutable revision. Concurrent completions
  // from the same starting result cannot overwrite each other's answers.
  function head(records) {
    if (!records?.length) return null;
    const children = new Map();
    for (const r of records) {
      const old = children.get(r.parent);
      if (!old || r.savedAt < old.savedAt || (r.savedAt === old.savedAt && r.revision < old.revision)) children.set(r.parent,r);
    }
    let current = children.get(null);
    const seen = new Set();
    while (current && !seen.has(current.revision)) {
      seen.add(current.revision);
      const child = children.get(current.revision);
      if (!child) return current;
      current = child;
    }
    return null;
  }

  // A separate deletion key always wins, even if an old tab writes a revision
  // just after another tab deletes the record.
  function scan(id=null) {
    const heads = new Map();
    try {
      const storage = localStorage, groups = new Map();
      const match = id ? recordPrefix + id + "." : recordPrefix;
      for (let i=0; i<storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(match)) continue;
        const value = storage.getItem(key);
        if (value === "removed") {
          deleted.add(key.slice(recordPrefix.length,key.lastIndexOf(".")));
          continue;
        }
        const record = decode(key,value);
        if (!record) continue;
        if (!groups.has(record.id)) groups.set(record.id,[]);
        groups.get(record.id).push(record);
      }
      const ids = id ? [id] : new Set([...groups.keys(),...pending.keys()]);
      for (const candidate of ids) {
        if (storage.getItem(deletedPrefix+candidate) !== null) deleted.add(candidate);
        if (deleted.has(candidate)) continue;
        const record = head(groups.get(candidate));
        if (record) heads.set(candidate,record);
      }
      if (!id) cached.clear();
      else cached.delete(id);
      for (const [key,record] of heads) cached.set(key,record);
      return {ok:true,heads};
    } catch {
      for (const [key,record] of cached) if ((!id || key===id) && !deleted.has(key)) heads.set(key,record);
      return {ok:false,heads};
    }
  }

  function visible(heads,id) {
    if (deleted.has(id)) return null;
    const old = heads.get(id) || null, draft = pending.get(id);
    return draft && draft.parent === (old?.revision ?? null) ? draft : old;
  }

  function view(record) {
    if (!record) return null;
    const result = copy(record);
    if (pending.get(record.id) === record) result.session.archiveRevision = record.parent;
    return result;
  }

  function get(id) {
    if (!validId(id)) return null;
    const r = visible(scan(id).heads,id);
    return view(r);
  }

  function list() {
    const {heads} = scan(), ids = new Set([...heads.keys(),...pending.keys()]);
    return [...ids].map(id => visible(heads,id)).filter(Boolean)
      .sort((a,b) => (b.updatedAt ?? -1)-(a.updatedAt ?? -1) || b.savedAt-a.savedAt || a.id.localeCompare(b.id))
      .map(view);
  }

  function isDeleted(id) {
    if (!validId(id)) return false;
    if (!deleted.has(id)) scan(id);
    return deleted.has(id);
  }

  function acknowledge(s,record) {
    s.archiveRevision = record.revision;
    s.archiveCompletedAt = record.completedAt;
    if (pending.get(record.id)?.parent !== record.revision) pending.delete(record.id);
    return {ok:true,reason:null,id:record.id,record:copy(record)};
  }

  function write(record) {
    const {id,revision,parent} = record;
    const lockPrefix = "between-minds.archive-write." + id + ".";
    const ticket = lockPrefix + randomToken(), storage = localStorage;
    // A unique reservation per contender avoids a last-writer-wins mutex.
    // An interrupted tab's reservation expires without changing any result.
    storage.setItem(ticket,String(Date.now()+60000));
    try {
      const expired = [];
      for (let i=0; i<storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(lockPrefix) || key===ticket) continue;
        if (Number(storage.getItem(key)) > Date.now()) return failure("conflict",id);
        expired.push(key);
      }
      for (const key of expired) storage.removeItem(key);
      // Another writer may have finished since the initial optimistic read.
      const before = scan(id), current = before.heads.get(id) || null;
      if (!before.ok) throw new Error("storage unavailable");
      if (deleted.has(id)) return failure("deleted",id);
      if (current?.revision === revision) return {ok:true,record:current};
      if ((current?.revision ?? null) !== parent) return failure("conflict",id,current);
      storage.setItem(keyFor(record),JSON.stringify(record));
      const after = scan(id), winner = after.heads.get(id);
      if (deleted.has(id)) return failure("deleted",id);
      if (!after.ok) throw new Error("storage unavailable");
      return winner?.revision === revision ? {ok:true,record:winner} : failure("conflict",id,winner);
    } finally {
      try { storage.removeItem(ticket); } catch { /* A failed release expires. */ }
    }
  }

  function save(s,{imported=false}={}) {
    try { if (!validFinished(s)) return failure("invalid",s?.archiveId); }
    catch { return failure("invalid",s?.archiveId); }
    const id = adopt(s), {ok,heads} = scan(id);
    if (deleted.has(id)) return failure("deleted",id);
    const old = heads.get(id) || null, draft = pending.get(id);
    const data = contentOf(s);
    if (old && contentOf(old.session) === data && ok) return acknowledge(s,old);
    const base = old?.revision ?? null;
    const expected = s.archiveRevision ?? null;
    // A tab may resume this page's in-memory copy before storage recovers.
    const usingDraft = draft && draft.parent === base && expected === draft.revision;
    if (expected !== base && !usingDraft) return failure(ok ? "conflict" : "storage",id,old);
    const revision = fingerprint(JSON.stringify([base,data]));
    const now = Date.now();
    const completedAt = old ? old.completedAt : draft ? draft.completedAt :
      s.archiveCompletedAt === null || validDate(s.archiveCompletedAt) ? s.archiveCompletedAt : imported ? null : now;
    const updatedAt = old || !imported ? now : completedAt;
    let snapshot;
    try { snapshot = draft?.revision === revision ? draft.rankings : snapshotOf(s); }
    catch { return failure("invalid",id); }
    if (!validSnapshot(snapshot)) return failure("invalid",id);
    const record = draft?.revision === revision ? draft : {
      id,parent:base,revision,completedAt,updatedAt,savedAt:now,rankings:snapshot,
      session:{...JSON.parse(data),archiveId:id,archiveRevision:revision,archiveCompletedAt:completedAt}
    };
    s.archiveCompletedAt = completedAt;
    try {
      if (!ok) throw new Error("storage unavailable");
      const result = write(record);
      return result.ok ? acknowledge(s,result.record) : result;
    } catch {
      pending.set(id,record);
      // Keep the durable base in the active slot so saving can be retried
      // after reload, even if localStorage accepted only the active snapshot.
      s.archiveRevision = base;
      return failure("storage",id,view(record));
    }
  }

  function remove(id) {
    if (!validId(id)) return failure("invalid",id);
    try {
      localStorage.setItem(deletedPrefix+id,"1");
    } catch {
      // A full quota can still replace an existing value with a shorter one.
      // Preserve that marker even if the tab closes before making a separate key.
      const record = scan(id).heads.get(id);
      if (!record) return failure("storage",id);
      try { localStorage.setItem(keyFor(record),"removed"); }
      catch { return failure("storage",id); }
      deleted.add(id);
      try { localStorage.setItem(deletedPrefix+id,"1"); }
      catch {
        pending.delete(id);
        cached.delete(id);
        return {ok:true,reason:null,id};
      }
    }
    deleted.add(id);
    pending.delete(id);
    cached.delete(id);
    try {
      const storage = localStorage, keys = [];
      for (let i=0; i<storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(recordPrefix+id+".")) keys.push(key);
      }
      for (const key of keys) storage.removeItem(key);
    } catch { /* The deletion marker already makes every revision unreachable. */ }
    return {ok:true,reason:null,id};
  }

  return {start,adopt,save,get,list,remove,isDeleted,rankings,isArchiveKey:key => typeof key === "string" && key.startsWith(prefix)};
})();
