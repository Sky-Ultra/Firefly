/* Each proportion uses only items offering a genuine choice about the reason.
   A thinker's reference distributes one vote equally over tied best options. */
window.ResultChart = (() => {
  "use strict";
  const size = 10;
  const center = [250, 197];
  const radius = 141;
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
  function coordinate(axis, rx, ry = rx) {
    const angle = axis * 2 * Math.PI / size - Math.PI / 2;
    return [center[0] + rx * Math.cos(angle), center[1] + ry * Math.sin(angle)];
  }
  function xy(point) { return point.map(n => n.toFixed(2)).join(","); }
  function percentage(value) {
    if (value === null) return "未测";
    const raw = value * 100;
    return (Math.abs(raw - Math.round(raw)) > 1e-8 ? "约 " : "") + Math.round(raw) + "%";
  }
  function measure(session, rank) {
    const topic = window.Quiz.byId.get(rank.t);
    const annotations = window.ResultAxes[rank.t];
    const questions = window.Quiz.evidence(session, rank.t).map(row => {
      const question = topic.questions[row.q];
      const fits = question.options.map(option => option.fit[rank.i]);
      const best = Math.max(...fits);
      const leaders = fits.flatMap((fit, i) => fit === best ? [i] : []);
      return { question, tags: annotations.tags[row.q].split(" "), pick: row.pick,
        leaders: leaders.length === fits.length ? [] : leaders };
    });
    const axes = annotations.axes.map(([label, description], axis) => {
      const rows = [];
      for (const item of questions) {
        const tagged = item.tags.map(tags => tags.includes(String(axis)));
        if (tagged.every(Boolean) || !tagged.some(Boolean)) continue;
        const votes = item.leaders.filter(i => tagged[i]).length;
        rows.push({...item, tagged, hit: tagged[item.pick],
          reference: item.leaders.length ? votes / item.leaders.length : null});
      }
      const count = rows.filter(row => row.hit).length;
      const informative = rows.filter(row => row.reference !== null);
      return {label, description, rows, count, referenceCount: informative.length,
        user: rows.length ? count / rows.length : null,
        person: informative.length ? informative.reduce((sum, row) => sum + row.reference, 0) / informative.length : null};
    });
    return {axes, topic, person: topic.people[rank.i], answered: questions.length};
  }
  function curve(axes, key) {
    const points = axes.map((axis, i) => axis[key] === null ? null : coordinate(i, axis[key] * radius));
    const cls = "rc-" + key;
    let lines = "";
    if (points.every(Boolean)) {
      lines = '<polygon class="rc-path rc-area ' + cls + '" points="' + points.map(xy).join(" ") + '"/>';
    } else {
      // Start after a gap so a valid run across the top of the chart stays connected.
      const gap = points.indexOf(null);
      let run = [];
      for (let step = 1; step <= size; step++) {
        const point = points[(gap + step) % size];
        if (point) { run.push(xy(point)); continue; }
        if (run.length > 1) lines += '<polyline class="rc-path ' + cls + '" fill="none" points="' + run.join(" ") + '"/>';
        run = [];
      }
    }
    const marks = points.map(point => {
      if (!point) return "";
      const [x,y] = point;
      return key === "user"
        ? '<circle class="rc-mark rc-user" cx="' + x + '" cy="' + y + '" r="4.7"/>'
        : '<rect class="rc-mark rc-person" x="' + (x - 2.9) + '" y="' + (y - 2.9) + '" width="5.8" height="5.8"/>';
    }).join("");
    return {lines, marks};
  }
  function chart(model, selected, id) {
    const {axes} = model;
    const grid = [.25,.5,.75,1].map(f => '<polygon class="rc-grid" points="' +
      axes.map((_,i) => xy(coordinate(i,radius * f))).join(" ") + '"/>').join("");
    const spokes = axes.map((_, i) => {
      const [x,y] = coordinate(i,radius);
      return '<line class="rc-spoke" data-spoke="' + i + '" data-active="' + (i === selected) +
        '" x1="250" y1="197" x2="' + x + '" y2="' + y + '"/>';
    }).join("");
    const user = curve(axes, "user"), person = curve(axes, "person");
    const svg = '<svg viewBox="0 0 500 394" aria-hidden="true" focusable="false">' + grid + spokes +
      user.lines + person.lines + user.marks + person.marks + '</svg>';
    const buttons = axes.map((axis,i) => {
      const [x,y] = coordinate(i,205,177);
      const summary = axis.label + '，你' + percentage(axis.user) + '，' + model.person.name + percentage(axis.person);
      return '<button type="button" class="rc-axis" data-rc-axis="' + i + '" aria-pressed="' + (i === selected) +
        '" data-unmeasured="' + (axis.user === null) + '" title="' + escape(summary) + '" aria-controls="' + id + '-' + i + '" aria-label="' + escape(summary) + '" style="left:' +
        x/5 + '%;top:' + y/3.94 + '%">' + escape(axis.label) + '</button>';
    }).join("");
    return '<div class="rc-plot" role="group" aria-label="选择思想轴，查看数值和原题">' + svg + buttons + '</div>';
  }
  function evidence(row, person) {
    const yourText = escape(row.question.options[row.pick].text);
    const entries = row.leaders.map(i => '<li><span>' + (row.tagged[i] ? "含此理由" : "其他理由") +
      '</span>「' + escape(row.question.options[i].text) + '」</li>').join("");
    const additional = row.tagged.flatMap((tagged,i) => tagged && i !== row.pick && !row.leaders.includes(i)
      ? ['<li>「' + escape(row.question.options[i].text) + '」</li>'] : []).join("");
    const offered = additional ? '<p class="rc-source-label">题中表达这条理由的其他选项</p><ul class="rc-source-list">' +
      additional + '</ul>' : '';
    const reference = row.leaders.length
      ? '<p class="rc-source-label">' + escape(person.name) + '的题库参照' + (row.leaders.length > 1 ? '（' + row.leaders.length + ' 项并列，均分）' : '') +
        '</p><ul class="rc-source-list">' + entries + '</ul>'
      : '<p class="rc-no-fit">四个选项对这位作者的编读分相同，本题没有人物参照值。</p>';
    return '<article class="rc-source"><h4>' + escape(row.question.title) + '</h4><p class="rc-original-scene">' +
      escape(row.question.scene) + '</p><p class="rc-source-label">你的选择 · ' + (row.hit ? "含此理由" : "其他理由") +
      '</p><p>「' + yourText + '」</p>' + reference + offered + '</article>';
  }
  function panel(axis, i, model, selected, id) {
    const count = axis.rows.length;
    const userText = count ? axis.count + ' / ' + count + ' 题选中' : '本组没有可比较的题';
    const personText = axis.referenceCount ? '据 ' + axis.referenceCount + ' 道可区分题' : '本组没有可区分的题';
    const details = count ? '<details class="rc-sources"><summary>核对 ' + count +
      ' 道原题</summary>' + axis.rows.map(row => evidence(row,model.person)).join("") + '</details>'
      : '<p class="rc-empty">本组回答没有提供可在这条轴上取舍的选项，因此这条轴留空。</p>';
    return '<section class="rc-panel" data-rc-panel="' + i + '" id="' + id + '-' + i + '"' +
      (i === selected ? '' : ' hidden') + '><h3>' + escape(axis.label) + '</h3><p class="rc-description">' +
      escape(axis.description) + '</p><dl class="rc-values"><div><dt><i class="rc-key rc-user"></i>你</dt><dd>' +
      percentage(axis.user) + '</dd><dd class="rc-denom">' + userText + '</dd></div><div><dt><i class="rc-key rc-person"></i>' +
      escape(model.person.name) + '</dt><dd>' + percentage(axis.person) + '</dd><dd class="rc-denom">' + personText +
      '</dd></div></dl>' + details + '</section>';
  }
  function render(session, rank) {
    const model = measure(session, rank);
    const id = "reason-" + rank.t + "-" + rank.i;
    // Open on a well-sampled reason where the reader can inspect an actual choice.
    const indices = model.axes.map((_, i) => i);
    indices.sort((a,b) => {
      const left = model.axes[a], right = model.axes[b];
      return Number(right.count > 0 && right.person !== null) - Number(left.count > 0 && left.person !== null) ||
        right.referenceCount - left.referenceCount || right.count - left.count || a-b;
    });
    const selected = indices[0];
    const name = escape(model.person.name);
    return '<section class="reason-chart" aria-labelledby="' + id + '-title"><header class="rc-heading"><h2 id="' +
      id + '-title">思想对照图</h2><p>「' + escape(model.topic.name) + '」的 ' + model.answered + ' 道回答</p></header>' +
      '<div class="rc-layout"><div class="rc-figure"><div class="rc-legend"><span><i class="rc-key rc-user"></i>你的选择</span>' +
      '<span><i class="rc-key rc-person"></i>' + name + '的参照</span></div>' + chart(model, selected, id) +
      '<p class="rc-scale">中心 0%　·　每圈 25%　·　外圈 100%' +
      (model.axes.some(axis => axis.user === null || axis.person === null) ? '　·　断线处为未测' : '') + '</p></div>' +
      '<div class="rc-inspector"><p class="rc-hint">点选图上的理由，查看本题组中的依据。</p>' +
      model.axes.map((a,i) => panel(a,i,model,selected,id)).join("") + '</div></div>' +
      '<details class="rc-method"><summary>这张图怎么算？</summary><p>每条轴是一种理由。只有同题里部分选项表达这种理由时，这题才计入该轴。你的数值是选中该理由的题数除以提供这种选择的题数。一项回答可以同时表达几种理由。</p>' +
      '<p>人物参照来自题库对同一道题的编读。每题找出最贴近这位作者的选项，如有并列便均分这一题的权重，再对各题取平均。四个选项同分时，这题略过人物计算。没有依据的轴留空，线在这里断开。</p>' +
      '<p>顶点越靠外，表示这种理由在对应题目中出现得越多。四题只记录这次取舍。</p></details></section>';
  }
  function activate(button) {
    const root = button.closest(".reason-chart"), id = button.dataset.rcAxis;
    root.querySelectorAll("[data-rc-axis]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    root.querySelectorAll("[data-spoke]").forEach(ray => ray.dataset.active = String(ray.dataset.spoke === id));
    root.querySelectorAll("[data-rc-panel]").forEach(p => p.hidden = p.dataset.rcPanel !== id);
  }
  document.addEventListener("click", event => {
    const button = event.target.closest?.("[data-rc-axis]");
    if (button) activate(button);
  });
  document.addEventListener("keydown", event => {
    const button = event.target.closest?.("[data-rc-axis]");
    if (!button || event.altKey || event.metaKey || event.ctrlKey) return;
    const current = Number(button.dataset.rcAxis);
    const index = {ArrowRight:(current+1)%size,ArrowDown:(current+1)%size,
      ArrowLeft:(current+size-1)%size,ArrowUp:(current+size-1)%size,Home:0,End:size-1}[event.key];
    if (index === undefined) return;
    event.preventDefault();
    const next = button.closest(".rc-plot").querySelector('[data-rc-axis="' + index + '"]');
    activate(next);
    next.focus();
  });
  return {render};
})();
