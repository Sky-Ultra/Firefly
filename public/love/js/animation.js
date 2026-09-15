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
  SCALE_FACTOR: 0.95,
  SEED_MOVE_SPEED: 2,
  TREE_GROW_DELAY: 10,
  FLOWER_BLOOM_COUNT: 2,
  FLOWER_BLOOM_DELAY: 10,
  TREE_SHIFT_X: 260,
  TREE_MOVE_DURATION: 1600,
  HEART_JUMP_INTERVAL: 25,
  MAX_FALLING_HEARTS: 6,
  FALLING_SPAWN_CHANCE: 0.26
};

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
  return runUntil(
    () => !tree.canGrow(),
    () => tree.grow(),
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
