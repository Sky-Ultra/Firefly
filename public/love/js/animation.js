// ===========================
// Animation Timing
// ===========================

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

const MotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function prefersReducedMotion() {
  return MotionPreference.matches;
}

async function runUntil(isDone, step, interval = 16) {
  let last = 0;
  while (!isDone()) {
    if (prefersReducedMotion()) {
      step();
      continue;
    }
    const now = await nextFrame();
    if (now - last >= interval) {
      step();
      last = now;
    }
  }
}

function startFrameLoop(step, interval = 16) {
  let last = 0;
  let frameId = 0;
  let running = true;

  function tick(now) {
    if (!running) return;
    if (now - last >= interval) {
      step(now);
      last = now;
    }
    frameId = requestAnimationFrame(tick);
  }

  frameId = requestAnimationFrame(tick);

  return function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  };
}

// ===========================
// Animation Config
// ===========================

const AnimationConfig = {
  SCALE_FACTOR: 0.94,
  SEED_MOVE_SPEED: 2.4,
  TREE_GROW_DELAY: 10,
  TREE_GROW_EXTRA_STEP_EVERY: 5,
  FLOWER_BLOOM_COUNT: 2,
  FLOWER_BLOOM_DELAY: 10,
  TREE_SHIFT_X: 260,
  TREE_MOVE_DURATION: 1600,
  HEART_JUMP_INTERVAL: 25,
  MAX_FALLING_HEARTS: 6,
  FALLING_SPAWN_CHANCE: 0.26
};

const HeartPetalColors = ["#ff3f8e", "#ff6c76", "#ff814a", "#ffb347", "#ffd33d", "#ef4ccc"];

// ===========================
// Animation Phase Functions
// ===========================

async function animateOpening(button, seed, canvas) {
  if (prefersReducedMotion()) return;
  button.classList.add("opening");
  const heart = button.querySelector(".intro-heart");
  const caption = button.querySelector(".intro-caption");
  const heartRect = heart.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const scale = canvasRect.width / StageConfig.width;
  const x = canvasRect.left + seed.heart.point.x * scale - heartRect.left - heartRect.width / 2;
  const y = canvasRect.top + seed.heart.point.y * scale - heartRect.top - heartRect.height / 2;
  caption.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
  await heart.animate([
    { transform: "translate(0, 0) scale(1)" },
    { transform: `translate(${x}px, ${y}px) scale(${scale})` }
  ], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }).finished;
}

function animateSeedShrink(seed) {
  return runUntil(
    () => !seed.canScale(),
    () => seed.scale(AnimationConfig.SCALE_FACTOR),
    AnimationConfig.TREE_GROW_DELAY
  );
}

function animateSeedMove(seed, footer) {
  return runUntil(
    () => !seed.canMove(),
    () => {
      seed.move(0, AnimationConfig.SEED_MOVE_SPEED);
      footer.draw();
    },
    AnimationConfig.TREE_GROW_DELAY
  );
}

function animateTreeGrow(tree) {
  let frame = 0;
  return runUntil(
    () => !tree.canGrow(),
    () => {
      tree.grow();
      frame++;
      if (frame % AnimationConfig.TREE_GROW_EXTRA_STEP_EVERY === 0 && tree.canGrow()) tree.grow();
    },
    AnimationConfig.TREE_GROW_DELAY
  );
}

function animateFlowerBloom(tree) {
  return runUntil(
    () => !tree.canFlower(),
    () => tree.flower(AnimationConfig.FLOWER_BLOOM_COUNT),
    AnimationConfig.FLOWER_BLOOM_DELAY
  );
}

async function animateTreeMove(staticCanvas) {
  if (window.matchMedia("(max-width: 700px)").matches) {
    await animateMobileTreeMove();
    staticCanvas.classList.add("shifted");
    return;
  }
  staticCanvas.classList.add("shifted");
  if (!prefersReducedMotion()) await wait(AnimationConfig.TREE_MOVE_DURATION);
}

async function animateMobileTreeMove() {
  const viewport = document.getElementById("viewport");
  const scene = document.getElementById("scene");
  const letter = document.getElementById("letter");
  const before = scene.getBoundingClientRect();

  // Lay out the complete letter invisibly, reserving its height during typing.
  letter.classList.add("mobile-letter-staging");
  letter.hidden = false;
  document.body.classList.add("letter-open");
  viewport.style.setProperty("--scene-scale", String(Math.min(viewport.clientWidth / StageConfig.width, 1)));
  letter.style.setProperty("--mobile-letter-height", `${letter.getBoundingClientRect().height}px`);
  const after = scene.getBoundingClientRect();

  if (!prefersReducedMotion()) {
    scene.classList.add("mobile-repositioning");
    const animation = scene.animate([
      { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width})` },
      { transform: "translate(0, 0) scale(1)" }
    ], { duration: AnimationConfig.TREE_MOVE_DURATION, easing: "cubic-bezier(0.42, 0, 0.58, 1)" });
    const finishImmediately = () => animation.finish();
    MotionPreference.addEventListener("change", finishImmediately, { once: true });
    try {
      await animation.finished;
    } finally {
      MotionPreference.removeEventListener("change", finishImmediately);
      scene.classList.remove("mobile-repositioning");
    }
  }
  letter.classList.remove("mobile-letter-staging");
}

function startHeartJumpAnimation(tree) {
  const { dynamicCtx, width, height } = tree;
  let lastTime = 0;

  function render(now) {
    const dt = Math.min(lastTime ? now - lastTime : 16, 50);
    lastTime = now;
    dynamicCtx.clearRect(0, 0, width, height);
    tree.jump(dt);
  }

  let stop = () => {};

  function handleVisibilityChange() {
    stop();
    if (document.hidden || prefersReducedMotion()) {
      dynamicCtx.clearRect(0, 0, width, height);
    } else {
      lastTime = 0;
      stop = startFrameLoop(render, AnimationConfig.HEART_JUMP_INTERVAL);
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  MotionPreference.addEventListener("change", handleVisibilityChange);
  handleVisibilityChange();
}

function startAmbientHeartPetals() {
  const field = document.getElementById("heart-petal-field");
  const maxPetals = 16;
  let spawnTimer = 0;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createPetal(isInitial = false) {
    if (field.childElementCount >= maxPetals || document.hidden || prefersReducedMotion()) return;

    const petal = document.createElement("span");
    const duration = randomBetween(16, 25);
    const startX = randomBetween(82, 112);
    const startY = randomBetween(-16, 24);
    const endX = randomBetween(-24, 18);
    const endY = randomBetween(92, 122);
    const sway = randomBetween(-8, 8);
    const size = randomBetween(11, 24);

    petal.className = "heart-petal";
    petal.textContent = "♥";
    petal.style.setProperty("--petal-color", HeartPetalColors[Math.floor(Math.random() * HeartPetalColors.length)]);
    petal.style.setProperty("--petal-size", `${size.toFixed(1)}px`);
    petal.style.setProperty("--petal-opacity", randomBetween(0.38, 0.72).toFixed(2));
    petal.style.setProperty("--petal-duration", `${duration.toFixed(1)}s`);
    petal.style.setProperty("--petal-delay", isInitial ? `${(-duration * Math.random()).toFixed(1)}s` : "0s");
    petal.style.setProperty("--start-x", `${startX.toFixed(1)}vw`);
    petal.style.setProperty("--start-y", `${startY.toFixed(1)}vh`);
    petal.style.setProperty("--mid-x", `${(startX * 0.53 + endX * 0.47 + sway).toFixed(1)}vw`);
    petal.style.setProperty("--mid-y", `${(startY * 0.47 + endY * 0.53).toFixed(1)}vh`);
    petal.style.setProperty("--end-x", `${endX.toFixed(1)}vw`);
    petal.style.setProperty("--end-y", `${endY.toFixed(1)}vh`);
    petal.style.setProperty("--start-rotate", `${randomBetween(-55, 55).toFixed(0)}deg`);
    petal.style.setProperty("--mid-rotate", `${randomBetween(70, 230).toFixed(0)}deg`);
    petal.style.setProperty("--end-rotate", `${randomBetween(250, 620).toFixed(0)}deg`);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });
    field.appendChild(petal);
  }

  function scheduleNextPetal() {
    window.clearTimeout(spawnTimer);
    if (document.hidden || prefersReducedMotion()) return;
    spawnTimer = window.setTimeout(() => {
      createPetal();
      scheduleNextPetal();
    }, randomBetween(1050, 1750));
  }

  function syncPetalsWithPage() {
    window.clearTimeout(spawnTimer);
    if (document.hidden || prefersReducedMotion()) {
      field.replaceChildren();
      return;
    }
    scheduleNextPetal();
  }

  if (!prefersReducedMotion()) {
    for (let i = 0; i < Math.ceil(maxPetals * 0.55); i++) createPetal(true);
    scheduleNextPetal();
  }
  document.addEventListener("visibilitychange", syncPetalsWithPage);
  MotionPreference.addEventListener("change", syncPetalsWithPage);
}

// ===========================
// Typewriter Effect
// ===========================

function charDelay(char, base) {
  if ("…".includes(char)) return base * 12;
  if ("。！？.!?".includes(char)) return base * 10;
  if ("，、；：,;:".includes(char)) return base * 5;
  return base + Math.random() * base * 0.5;
}

async function typewriter(el, speed = 100) {
  el.style.display = "block";
  if (prefersReducedMotion()) return;

  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.textContent = "_";

  const lines = [];
  const paragraphs = el.querySelectorAll("p");
  for (const p of paragraphs) {
    lines.push({ p, text: p.textContent });
    p.textContent = "";
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const textNode = document.createTextNode("");
    line.p.appendChild(textNode);
    line.p.appendChild(cursor);

    for (const char of line.text) {
      if (prefersReducedMotion()) {
        for (const { p, text } of lines) p.textContent = text;
        cursor.remove();
        return;
      }
      textNode.textContent += char;
      await wait(charDelay(char, speed));
    }

    if (i < lines.length - 1) {
      await wait(speed * 8);
    }
  }

  cursor.classList.add("typewriter-cursor--done");
  await wait(3600);
  cursor.remove();
}

function startTreeCaptionCarousel(el, texts, cycleDuration = 10000) {
  if (!Array.isArray(texts) || texts.length === 0) return;
  const paragraph = el.querySelector("p");
  const typeSpeed = 100;
  const deleteSpeed = 50;
  let currentTextIndex = 0;
  let randomQueue = shuffleIndexes(Array.from({ length: texts.length - 1 }, (_, index) => index + 1));

  function segmentText(text) {
    if (typeof Intl.Segmenter !== "function") return Array.from(text);
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), segment => segment.segment);
  }

  function shuffleIndexes(indexes) {
    const shuffled = [...indexes];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function getNextTextIndex() {
    if (randomQueue.length === 0) {
      randomQueue = shuffleIndexes(Array.from({ length: texts.length }, (_, index) => index));
      if (randomQueue[0] === currentTextIndex) {
        const differentIndex = randomQueue.findIndex(index => index !== currentTextIndex);
        if (differentIndex > 0) {
          [randomQueue[0], randomQueue[differentIndex]] = [randomQueue[differentIndex], randomQueue[0]];
        }
      }
    }
    return randomQueue.shift() ?? 0;
  }

  async function run() {
    el.style.display = "block";

    while (!prefersReducedMotion()) {
      const segments = segmentText(texts[currentTextIndex]);
      const cursor = document.createElement("span");
      cursor.className = "tree-caption-cursor";
      cursor.textContent = "|";
      paragraph.replaceChildren(cursor);
      const textNode = document.createTextNode("");
      paragraph.prepend(textNode);

      for (const segment of segments) {
        if (prefersReducedMotion()) break;
        textNode.textContent += segment;
        await wait(typeSpeed);
      }

      if (prefersReducedMotion()) break;
      const typingDuration = segments.length * typeSpeed;
      const deletingDuration = segments.length * deleteSpeed;
      await wait(Math.max(0, cycleDuration - typingDuration - deletingDuration));

      for (let index = segments.length - 1; index >= 0; index--) {
        if (prefersReducedMotion()) break;
        textNode.textContent = segments.slice(0, index).join("");
        await wait(deleteSpeed);
      }

      currentTextIndex = getNextTextIndex();
    }

    paragraph.textContent = texts[currentTextIndex];
  }

  run();
}
