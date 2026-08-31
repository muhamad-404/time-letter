// ===========================
// Clock Display
// ===========================

function createClockDOM(config) {
  const clock = document.getElementById("clock");
  const cfg = config.time;
  const digits = {};
  clock.textContent = "";

  if (cfg.prefix) {
    const prefix = document.createElement("span");
    prefix.className = "clock-prefix";
    prefix.textContent = cfg.prefix;
    clock.appendChild(prefix);
  }

  const units = [
    { key: "days", label: cfg.day.trim() },
    { key: "hours", label: cfg.hour.trim() },
    { key: "minutes", label: cfg.minute.trim() },
    { key: "seconds", label: cfg.second.trim() }
  ];

  units.forEach(({ key, label }) => {
    const unit = document.createElement("span");
    unit.className = "clock-unit";

    const digit = document.createElement("span");
    digit.className = "digit";

    const labelEl = document.createElement("span");
    labelEl.className = "clock-label";
    labelEl.textContent = label;

    unit.appendChild(digit);
    unit.appendChild(labelEl);
    clock.appendChild(unit);
    digits[key] = digit;
  });

  return digits;
}

function timeElapse(startMs, digits) {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  function twoDigits(value) {
    return String(value).padStart(2, "0");
  }

  const totalSeconds = Math.floor((Date.now() - startMs) / 1000);
  const todaySeconds = totalSeconds % secondsPerDay;
  const days = Math.floor(totalSeconds / secondsPerDay);

  const hours = Math.floor(todaySeconds / secondsPerHour);
  const minutes = Math.floor((todaySeconds % secondsPerHour) / secondsPerMinute);
  const seconds = todaySeconds % secondsPerMinute;

  digits.days.textContent = String(days);
  digits.hours.textContent = twoDigits(hours);
  digits.minutes.textContent = twoDigits(minutes);
  digits.seconds.textContent = twoDigits(seconds);
}

// ===========================
// Viewport & Responsive Layout
// ===========================

const MOBILE_BREAKPOINT = 768;

function isMobileLayout() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function setupViewport() {
  const viewport = document.getElementById("viewport");
  const main = document.getElementById("main");
  const root = document.documentElement;
  const mobile = isMobileLayout();

  root.classList.toggle("mobile", mobile);
  root.classList.toggle("desktop", !mobile);

  if (mobile) {
    const canvasHeight = Math.floor(window.innerHeight * 0.45);
    StageConfig.width = window.innerWidth;
    StageConfig.height = canvasHeight;

    root.style.setProperty("--stage-w", "100vw");
    root.style.setProperty("--stage-h", "100svh");
    root.style.setProperty("--canvas-h", `${canvasHeight}px`);
    root.style.setProperty("--tree-shift-x", "0");
    root.style.setProperty("--letter-width", "100%");
    root.style.setProperty("--clock-digit-size", "32px");
    root.style.setProperty("--clock-font-size", "18px");

    viewport.style.width = "100vw";
    viewport.style.height = "100svh";
    main.style.transform = "none";
    main.style.width = "100vw";
    main.style.height = "100svh";
  } else {
    StageConfig.width = BASE_STAGE.width;
    StageConfig.height = BASE_STAGE.height;

    root.style.setProperty("--stage-w", "1100px");
    root.style.setProperty("--stage-h", "680px");
    root.style.setProperty("--canvas-h", "680px");
    root.style.setProperty("--tree-shift-x", "-260px");
    root.style.setProperty("--letter-width", "450px");
    root.style.setProperty("--letter-right", "60px");
    root.style.setProperty("--clock-digit-size", "44px");
    root.style.setProperty("--clock-font-size", "24px");
    root.style.setProperty("--clock-top", "530px");

    const scale = Math.min(
      window.innerWidth / BASE_STAGE.width,
      window.innerHeight / BASE_STAGE.height,
      1
    );

    viewport.style.width = `${BASE_STAGE.width * scale}px`;
    viewport.style.height = `${BASE_STAGE.height * scale}px`;
    main.style.width = `${BASE_STAGE.width}px`;
    main.style.height = `${BASE_STAGE.height}px`;
    main.style.transform = `scale(${scale})`;
  }
}

function bindViewportResize() {
  window.addEventListener("resize", setupViewport);
  window.addEventListener("orientationchange", () => {
    setTimeout(setupViewport, 100);
  });
}

// ===========================
// Content Initialization
// ===========================

function initContent(config) {
  const letter = document.getElementById("letter");
  letter.textContent = "";

  function addParagraph(lines) {
    lines.forEach(line => {
      const p = document.createElement("p");
      p.textContent = line;
      letter.appendChild(p);
    });
  }

  function createName(text) {
    const span = document.createElement("span");
    span.className = "name";
    span.textContent = text;
    return span;
  }

  const paragraphs = [
    config.letter.paragraph1,
    config.letter.paragraph2,
    config.letter.paragraph3
  ];
  paragraphs.forEach((lines, index) => {
    if (index > 0) letter.appendChild(document.createElement("br"));
    addParagraph(lines);
  });

  const clockText = document.getElementById("clock-text");
  clockText.textContent = "";
  clockText.appendChild(createName(config.couple.name1));
  clockText.appendChild(document.createTextNode(` ${config.couple.connector} `));
  clockText.appendChild(createName(config.couple.name2));
  clockText.appendChild(document.createTextNode(` ${config.couple.together}`));
}

// ===========================
// Canvas Initialization
// ===========================

function initCanvas(id) {
  const canvas = document.getElementById(id);
  const w = StageConfig.width;
  const h = StageConfig.height;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return canvas;
}
