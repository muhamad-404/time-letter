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
// Responsive Scaling
// ===========================

function scaleContent() {
  const viewport = document.getElementById("viewport");
  const main = document.getElementById("main");
  const root = document.documentElement;

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(
      vw / StageConfig.width,
      vh / StageConfig.height,
      1
    );

    const compact = vw < 600;
    root.style.setProperty("--tree-shift-x", compact ? "-220px" : "-260px");
    root.style.setProperty("--letter-width", compact ? "380px" : "450px");
    root.style.setProperty("--letter-right", compact ? "30px" : "60px");
    root.style.setProperty("--clock-digit-size", compact ? "36px" : "44px");
    root.style.setProperty("--clock-font-size", compact ? "20px" : "24px");
    root.style.setProperty("--clock-top", compact ? "510px" : "530px");

    viewport.style.width = `${StageConfig.width * scale}px`;
    viewport.style.height = `${StageConfig.height * scale}px`;
    main.style.transform = `scale(${scale})`;
  }

  resize();
  window.addEventListener("resize", resize);
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
  const { width: w, height: h } = StageConfig;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d").scale(dpr, dpr);
  return canvas;
}
