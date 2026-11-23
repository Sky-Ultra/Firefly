/* Interaction and transitions for the printed edition. */
(() => {
  "use strict";
  const main = document.querySelector("main");
  const nav = document.querySelector(".bar nav");
  const rest = matchMedia("(prefers-reduced-motion: reduce)");
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const out = "cubic-bezier(.22,.86,.25,1)";
  const glide = "cubic-bezier(.45,.02,.18,1)";
  let input = "pointer";
  let lastPage = "";
  let lastQuestion = null;
  let progress = 0;
  let pageEvents;
  let observed;
  let disposeCover;
  let navLine;
  const activeAnimations = new Set();

  function animate(el, frames, duration, delay = 0, easing = out) {
    if (!el || rest.matches || input === "key" || !el.animate) return;
    const animation = el.animate(frames, {duration, delay, easing, fill: "backwards"});
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  }
  function lift(el, y, duration, delay = 0) {
    animate(el, [{opacity: .05, transform: "translateY(" + y + "px)"}, {opacity: 1, transform: "none"}], duration, delay);
  }
  function setInput(value) {
    input = value;
    document.documentElement.dataset.motionInput = value;
  }
  document.addEventListener("keydown", e => {
    if (!e.ctrlKey && !e.metaKey && !e.altKey) setInput("key");
  }, true);
  document.addEventListener("pointerdown", () => setInput("pointer"), {capture: true, passive: true});
  rest.addEventListener("change", () => {
    if (rest.matches) {
      for (const animation of activeAnimations) animation.cancel();
      disposeCover?.reset();
    }
  });

  function positionNav() {
    if (!nav) return;
    if (!navLine) {
      navLine = document.createElement("i");
      navLine.className = "nav-ink";
      navLine.setAttribute("aria-hidden", "true");
      nav.append(navLine);
      nav.classList.add("has-nav-ink");
      if (window.ResizeObserver) new ResizeObserver(positionNav).observe(nav);
      document.fonts?.ready.then(positionNav);
    }
    const active = nav.querySelector("[aria-current=page]");
    if (active) {
      const item = active.getBoundingClientRect();
      const offset = item.left - nav.getBoundingClientRect().left + item.width / 2 - 9;
      navLine.style.transform = "translateX(" + offset + "px)";
    }
    navLine.classList.toggle("visible", !!active);
  }

  function mountCover() {
    const figure = main.querySelector(".hero-figure");
    const sheet = figure?.querySelector(".cover-sheet");
    if (!sheet) return;
    const place = window.Portraits.movement(figure,animate);
    let x = 0, y = 0, tx = 0, ty = 0, frame = 0, time = 0;
    function paint() {
      sheet.style.transform = "perspective(1000px) translate3d(" + (x*6).toFixed(2) + "px," + (y*4).toFixed(2) + "px,0) rotateY(" + (x*1.25).toFixed(2) + "deg) rotateX(" + (-y*.85).toFixed(2) + "deg)";
      place(x,y);
    }
    function tick(now) {
      if (!sheet.isConnected || rest.matches) { reset(); return; }
      const gain = 1 - Math.exp(-Math.min(40, now - time) / 68);
      time = now;
      x += (tx-x)*gain; y += (ty-y)*gain;
      if (Math.max(Math.abs(tx-x), Math.abs(ty-y)) < .003) {
        x = tx; y = ty; paint(); frame = 0;
        if (!tx && !ty) sheet.style.removeProperty("transform");
        return;
      }
      paint(); frame = requestAnimationFrame(tick);
    }
    function schedule() { if (!frame) { time = performance.now(); frame = requestAnimationFrame(tick); } }
    function reset() {
      cancelAnimationFrame(frame); frame = 0; x = y = tx = ty = 0;
      sheet.style.removeProperty("transform"); place(0,0);
    }
    function track(e) {
      if (!hover.matches || rest.matches || e.pointerType === "touch") return;
      const rect = figure.getBoundingClientRect();
      tx = Math.max(-1,Math.min(1,2*(e.clientX-rect.left)/rect.width-1));
      ty = Math.max(-1,Math.min(1,2*(e.clientY-rect.top)/rect.height-1));
      schedule();
    }
    const options = {signal: pageEvents.signal, passive:true};
    figure.addEventListener("pointermove", track, options);
    figure.addEventListener("pointerleave", () => { tx=ty=0; if (!rest.matches) schedule(); }, options);
    place(0,0);
    disposeCover = {reset};
    lift(figure.querySelector("figcaption"), 6, 350, 210);
  }

  function quizMotion(at) {
    const direction = lastPage === "quiz" && at < lastQuestion ? -1 : 1;
    const start = (window.innerWidth <= 700 ? 12 : 20) * direction;
    for (const letter of main.querySelectorAll(".answer .letter")) {
      letter.insertAdjacentHTML("beforeend", '<svg class="answer-ring" aria-hidden="true" focusable="false" viewBox="0 0 36 36"><path pathLength="1" d="M 25 4 C 15 -1 4 7 4 19 C 4 29 13 34 22 32 C 31 30 35 20 32 12 C 31 9 27 5 23 4"/></svg>');
    }
    const bar = main.querySelector(".progress > i");
    if (bar) {
      const target = parseFloat(bar.style.width) / 100;
      if (target > 0) animate(bar,[{transform:"scaleX(" + (progress / target) + ")"},{transform:"scaleX(1)"}], 365, 0, glide);
    }
    [".quiz-topic",".question-title",".scene",".answers",".branches"].forEach((s,i) => {
      animate(main.querySelector(s), [
        {opacity:.12, transform:"translateX(" + start + "px)"},
        {opacity:1, transform:"none"}
      ], i < 3 ? 245 : 270, i * 12);
    });
  }
  function resultMotion() {
    const title = main.querySelector(".result-title");
    lift(main.querySelector(".result-art"), 10, 450, 20);
    animate(title, [
      {opacity:.15, clipPath:"inset(0 70% 0 0)", transform:"translateY(11px)"},
      {opacity:1, clipPath:"inset(0 -2% 0 0)", transform:"none"}
    ], 580, 35);
    lift(main.querySelector(".result-layout .latin"), 7, 300, 95);
    lift(main.querySelector(".result-idea"), 10, 390, 110);
    const reading = main.querySelector(".result-margins .reading");
    animate(reading, [{opacity:.12,transform:"translateY(16px) rotate(1.5deg)"},{opacity:1,transform:"none"}], 500,100);
    const sections = main.querySelectorAll(".evidence > section,.echo,.related");
    if (!window.IntersectionObserver || rest.matches || input === "key") return;
    observed = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) if (entry.isIntersecting && entry.target.isConnected) {
        lift(entry.target, 12, 330);
        observer.unobserve(entry.target);
      }
    }, {threshold: .06});
    sections.forEach(el => observed.observe(el));
  }
  function beforeRender() {
    const bar = main.querySelector(".progress > i");
    if (bar && bar.parentElement.clientWidth) progress = bar.getBoundingClientRect().width / bar.parentElement.clientWidth;
    else if (lastPage !== "quiz") progress = 0;
    for (const animation of activeAnimations) animation.cancel();
    activeAnimations.clear();
    pageEvents?.abort();
    observed?.disconnect();
    disposeCover?.reset();
    disposeCover = null;
  }
  function afterRender(route, at) {
    pageEvents = new AbortController();
    positionNav();
    if (route === "home") {
      mountCover();
      [".kicker","h1",".hero-desc",".hero-actions",".hero-facts"].forEach((s,i) => lift(main.querySelector(".hero-copy " + s),i===1?16:8, i===1?540:375, i*38));
    } else if (route === "quiz") quizMotion(at);
    else if (route === "result") resultMotion();
    else lift(main.querySelector(".page-head"), 12, 360);
    main.querySelectorAll(".plate").forEach((el,i) => lift(el, 13, 380, 70 + i*55));
    lastPage = route;
    lastQuestion = at;
  }
  window.Motion = {beforeRender, afterRender};
})();
