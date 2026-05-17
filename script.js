const WORDBOOK_FOLDER = "wordbooks";
const WORDBOOK_MANIFEST_URL = `${WORDBOOK_FOLDER}/manifest.json`;

const LANGUAGE_LABELS = {
  english: "영어",
  japanese: "일본어",
};

const ROMAJI_DIGRAPHS = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  ぢゃ: "ja",
  ぢゅ: "ju",
  ぢょ: "jo",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  ふぁ: "fa",
  ふぃ: "fi",
  ふぇ: "fe",
  ふぉ: "fo",
  てぃ: "ti",
  でぃ: "di",
  しぇ: "she",
  じぇ: "je",
  ちぇ: "che",
  うぃ: "wi",
  うぇ: "we",
  うぉ: "wo",
  ゔぁ: "va",
  ゔぃ: "vi",
  ゔぇ: "ve",
  ゔぉ: "vo",
};

const ROMAJI_BASE = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "wo",
  ん: "n",
  ゔ: "vu",
  ぁ: "a",
  ぃ: "i",
  ぅ: "u",
  ぇ: "e",
  ぉ: "o",
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
};

function katakanaToHiragana(value) {
  return [...String(value)].map((char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x30a1 && code <= 0x30f6) {
      return String.fromCharCode(code - 0x60);
    }
    return char;
  }).join("");
}

function firstConsonant(value) {
  const match = String(value).match(/^[bcdfghjklmnpqrstvwxyz]/);
  return match ? match[0] : "";
}

function repeatLastVowel(value) {
  const match = String(value).match(/[aeiou]$/);
  return match ? match[0] : "";
}

function kanaToRomaji(value) {
  const text = katakanaToHiragana(value);
  let result = "";

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const pair = text.slice(index, index + 2);

    if (char === "っ") {
      const nextPair = ROMAJI_DIGRAPHS[text.slice(index + 1, index + 3)];
      const nextSingle = ROMAJI_BASE[text[index + 1]];
      result += firstConsonant(nextPair || nextSingle);
      continue;
    }

    if (char === "ー") {
      result += repeatLastVowel(result);
      continue;
    }

    if (ROMAJI_DIGRAPHS[pair]) {
      result += ROMAJI_DIGRAPHS[pair];
      index += 1;
      continue;
    }

    result += ROMAJI_BASE[char] || char;
  }

  return result.replace(/\s+/g, "");
}

function romajiAliases(value) {
  const base = kanaToRomaji(value);
  const variants = new Set([base]);
  variants.add(base.replace(/ou/g, "o"));
  variants.add(base.replace(/oo/g, "o"));
  variants.add(base.replace(/aa/g, "a"));
  variants.add(base.replace(/ii/g, "i"));
  variants.add(base.replace(/uu/g, "u"));
  variants.add(base.replace(/ee/g, "e"));
  variants.add(base.replace(/ou|oo|aa|ii|uu|ee/g, (match) => match[0]));
  variants.add(
    base
      .replace(/shi/g, "si")
      .replace(/chi/g, "ti")
      .replace(/tsu/g, "tu")
      .replace(/fu/g, "hu")
      .replace(/ji/g, "zi"),
  );
  return [...variants].filter(Boolean);
}

function enrichJapaneseEntry(entry) {
  const kana = String(entry.kana || "").trim();
  return {
    ...entry,
    kana,
    romaji: kanaToRomaji(kana),
    aliases: romajiAliases(kana),
  };
}

const activeWordbooks = {
  english: [],
  japanese: [],
};

const wordbookNames = {
  english: "영어 단어장",
  japanese: "일본어 단어장",
};

let folderWordbooks = [];

const DIFFICULTIES = {
  easy: { lives: 7, speed: 30, spawn: 2800, minSpawn: 1650, speedGain: 0.8 },
  normal: { lives: 5, speed: 62, spawn: 1550, minSpawn: 780, speedGain: 2.5 },
  hard: { lives: 4, speed: 82, spawn: 1220, minSpawn: 620, speedGain: 3.3 },
};

const stage = document.querySelector("#stage");
const dropsLayer = document.querySelector("#drops");
const hintLine = document.querySelector("#hintLine");
const readyPanel = document.querySelector("#readyPanel");
const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d");
const input = document.querySelector("#answerInput");
const form = document.querySelector("#typingForm");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const statusText = document.querySelector("#statusText");
const scoreValue = document.querySelector("#scoreValue");
const comboValue = document.querySelector("#comboValue");
const lifeValue = document.querySelector("#lifeValue");
const retryValue = document.querySelector("#retryValue");
const languageButtons = Array.from(document.querySelectorAll(".language-btn"));
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-btn"));
const wordbookButton = document.querySelector("#wordbookButton");
const wordbookPanel = document.querySelector("#wordbookPanel");
const wordbookCloseButton = document.querySelector("#wordbookCloseButton");
const wordbookDoneButton = document.querySelector("#wordbookDoneButton");
const wordbookFile = document.querySelector("#wordbookFile");
const folderWordbookSelect = document.querySelector("#folderWordbookSelect");
const loadFolderWordbookButton = document.querySelector("#loadFolderWordbookButton");
const wordbookGuide = document.querySelector("#wordbookGuide");
const wordbookStatus = document.querySelector("#wordbookStatus");
const resetWordbookButton = document.querySelector("#resetWordbookButton");

const state = {
  language: "english",
  mode: "meaning",
  difficulty: "normal",
  running: false,
  paused: false,
  score: 0,
  combo: 0,
  lives: DIFFICULTIES.normal.lives,
  retryPending: 0,
  drops: [],
  queue: [],
  particles: [],
  raf: 0,
  lastFrame: 0,
  spawnElapsed: 0,
  id: 0,
};

let composing = false;

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s'’.,-]/g, "");
}

function shuffle(items) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function lastChar(value) {
  return [...value].at(-1) || "";
}

function firstChar(value) {
  return [...value].at(0) || "";
}

function charLength(value) {
  return [...String(value).trim()].length;
}

function setActiveButton(buttons, dataName, value) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset[dataName] === value);
  });
}

function updateStats() {
  scoreValue.textContent = String(state.score);
  comboValue.textContent = String(state.combo);
  lifeValue.textContent = String(state.lives);
  retryValue.textContent = String(state.retryPending);
}

function setStatus(text) {
  statusText.textContent = text;
}

function currentWords() {
  return activeWordbooks[state.language];
}

function refillQueue() {
  state.queue.push(
    ...shuffle(currentWords()).map((entry) => ({
      entry,
      retry: false,
    })),
  );
}

function resetQueue() {
  state.queue = [];
  refillQueue();
}

function resizeCanvas() {
  const rect = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  hintLine.style.top = `${Math.floor(rect.height * 0.5)}px`;
}

function modeLabel(mode) {
  return mode === "meaning" ? "뜻 맞추기" : "스펠링 맞추기";
}

function japanesePrompt(entry) {
  if (entry.kanji && entry.kanji !== entry.kana) {
    return `${entry.kanji} (${entry.kana})`;
  }
  return entry.kana;
}

function buildDropData(queueItem) {
  const { entry, retry } = queueItem;

  if (state.mode === "meaning") {
    const isJapanese = state.language === "japanese";
    const prompt = isJapanese ? japanesePrompt(entry) : entry.en;
    return {
      entry,
      retry,
      prompt,
      kind: isJapanese ? "JP" : "EN",
      className: isJapanese ? "ja" : "en",
      answers: [entry.ko],
      hint: charLength(entry.ko) > 1 ? `-${lastChar(entry.ko)}` : "",
    };
  }

  const isJapanese = state.language === "japanese";
  const sourceText = isJapanese ? entry.kana : entry.en;
  const spellingAnswers = isJapanese
    ? [entry.kana, entry.kanji, entry.romaji, ...(entry.aliases || [])].filter(Boolean)
    : [entry.en];

  return {
    entry,
    retry,
    prompt: entry.ko,
    kind: "KO",
    className: "ko",
    answers: spellingAnswers,
    hint: charLength(sourceText) > 1 ? firstChar(sourceText) : "",
  };
}

function applyDropPosition(drop) {
  drop.el.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0)`;
}

function createDrop() {
  if (!state.queue.length) {
    refillQueue();
  }

  const item = state.queue.shift();
  if (item.retry) {
    state.retryPending = Math.max(0, state.retryPending - 1);
  }

  const data = buildDropData(item);
  const stageRect = stage.getBoundingClientRect();
  const diff = DIFFICULTIES[state.difficulty];
  const level = Math.floor(state.score / 900);
  const el = document.createElement("div");
  const text = document.createElement("span");
  const widthReserve = Math.min(280, stageRect.width * 0.58);
  const maxX = Math.max(8, stageRect.width - widthReserve - 8);

  el.className = `drop ${data.className}${data.retry ? " retry" : ""}`;
  el.dataset.kind = data.kind;
  text.className = "drop-text";
  text.textContent = data.prompt;
  el.append(text);
  dropsLayer.append(el);

  const measuredWidth = Math.min(el.getBoundingClientRect().width, widthReserve);
  const adjustedMaxX = Math.max(8, stageRect.width - measuredWidth - 8);
  const drop = {
    id: state.id,
    entry: data.entry,
    retry: data.retry,
    prompt: data.prompt,
    display: data.prompt,
    hint: data.hint,
    answers: data.answers.map(normalize),
    el,
    text,
    x: Math.round(Math.random() * (adjustedMaxX - 8) + 8),
    y: -48,
    speed: diff.speed + level * diff.speedGain + Math.random() * 18,
    hinted: false,
    hintChecked: false,
  };

  state.id += 1;
  state.drops.push(drop);
  applyDropPosition(drop);
  updateStats();
}

function spawnMissedAgain(drop) {
  state.queue.push({
    entry: drop.entry,
    retry: true,
  });
  state.retryPending += 1;
}

function removeDrop(drop) {
  if (drop.el.isConnected) {
    drop.el.remove();
  }
  state.drops = state.drops.filter((item) => item.id !== drop.id);
}

function missDrop(drop) {
  spawnMissedAgain(drop);
  removeDrop(drop);
  state.combo = 0;
  state.lives -= 1;
  updateStats();

  if (state.lives <= 0) {
    endGame();
  } else {
    setStatus("놓침");
  }
}

function scoreHit(drop) {
  const base = drop.hinted ? 70 : 100;
  state.combo += 1;
  state.score += base + Math.min(80, state.combo * 6);
  updateStats();
  setStatus(drop.hinted ? "적중" : "정확");
}

function burstDrop(drop) {
  const rect = drop.el.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const x = rect.left - stageRect.left + rect.width / 2;
  const y = rect.top - stageRect.top + rect.height / 2;

  state.drops = state.drops.filter((item) => item.id !== drop.id);
  spawnParticles(drop.display, x, y, drop.el.classList.contains("ja"));
  drop.el.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0) scale(1.18)`;
  drop.el.classList.add("bursting");
  window.setTimeout(() => drop.el.remove(), 120);
}

function hitDrop(drop) {
  scoreHit(drop);
  burstDrop(drop);
}

function showHint(drop) {
  if (!drop.hint) {
    return;
  }

  drop.hinted = true;
  drop.display = `${drop.prompt} (${drop.hint})`;
  drop.text.textContent = drop.display;
  drop.el.classList.add("hinted");

  const stageRect = stage.getBoundingClientRect();
  const rect = drop.el.getBoundingClientRect();
  if (drop.x + rect.width > stageRect.width - 8) {
    drop.x = Math.max(8, stageRect.width - rect.width - 8);
    applyDropPosition(drop);
  }
}

function currentSpawnInterval() {
  const diff = DIFFICULTIES[state.difficulty];
  return Math.max(diff.minSpawn, diff.spawn - Math.floor(state.score / 20));
}

function updateDrops(delta) {
  const stageHeight = stage.getBoundingClientRect().height;
  const hintY = stageHeight * 0.5;

  for (const drop of [...state.drops]) {
    if (!state.running || !drop.el.isConnected) {
      break;
    }

    drop.y += (drop.speed * delta) / 1000;
    if (!drop.hintChecked && drop.y >= hintY) {
      drop.hintChecked = true;
      showHint(drop);
    }

    applyDropPosition(drop);

    const height = drop.el.offsetHeight || 38;
    if (drop.y + height >= stageHeight - 6) {
      missDrop(drop);
      if (!state.running) {
        break;
      }
    }
  }
}

function tryMatch(options = {}) {
  if (composing || !state.running || state.paused) {
    return;
  }

  const { clearOnMiss = false } = options;
  const typed = normalize(input.value);
  if (!typed) {
    return;
  }

  const matched = state.drops
    .filter((drop) => drop.answers.includes(typed))
    .sort((a, b) => b.y - a.y)[0];

  if (!matched) {
    if (clearOnMiss) {
      input.value = "";
    }
    return;
  }

  input.value = "";
  hitDrop(matched);
}

function spawnParticles(text, x, y, japanese) {
  const chars = [...text].filter((char) => char.trim());
  const palette = japanese
    ? ["#d6c5ff", "#a7f23a", "#f4b23c", "#55d6d2"]
    : ["#a7f23a", "#55d6d2", "#ff6b5e", "#f4b23c"];

  chars.forEach((char, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(chars.length, 1) + Math.random() * 0.8;
    const power = 0.12 + Math.random() * 0.24;
    state.particles.push({
      type: "text",
      char,
      x: x + (Math.random() - 0.5) * 34,
      y: y + (Math.random() - 0.5) * 18,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - 0.08,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.014,
      life: 820 + Math.random() * 280,
      ttl: 820 + Math.random() * 280,
      size: 16 + Math.random() * 12,
      color: palette[index % palette.length],
    });
  });

  for (let i = 0; i < 18; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 0.08 + Math.random() * 0.26;
    state.particles.push({
      type: "spark",
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power,
      life: 460 + Math.random() * 260,
      ttl: 460 + Math.random() * 260,
      size: 2 + Math.random() * 4,
      color: palette[i % palette.length],
    });
  }
}

function drawParticles(delta) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  ctx.clearRect(0, 0, width, height);

  state.particles = state.particles.filter((particle) => {
    particle.life -= delta;
    if (particle.life <= 0) {
      return false;
    }

    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 0.00028 * delta;

    const alpha = Math.max(0, particle.life / particle.ttl);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (particle.type === "text") {
      particle.rotation += particle.spin * delta;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.font = `900 ${particle.size}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.fillText(particle.char, 0, 0);
    } else {
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    return true;
  });
}

function loop(timestamp) {
  if (!state.lastFrame) {
    state.lastFrame = timestamp;
  }

  const delta = Math.min(50, timestamp - state.lastFrame);
  state.lastFrame = timestamp;

  if (state.running && !state.paused) {
    state.spawnElapsed += delta;
    if (state.spawnElapsed >= currentSpawnInterval()) {
      state.spawnElapsed = 0;
      createDrop();
    }
    updateDrops(delta);
  }

  drawParticles(delta);
  state.raf = window.requestAnimationFrame(loop);
}

function clearDrops() {
  state.drops.forEach((drop) => drop.el.remove());
  state.drops = [];
}

function startGame() {
  if (!currentWords().length) {
    setStatus("단어장을 먼저 불러오세요");
    openWordbookPanel();
    return;
  }

  const diff = DIFFICULTIES[state.difficulty];
  clearDrops();
  resetQueue();
  state.running = true;
  state.paused = false;
  state.score = 0;
  state.combo = 0;
  state.lives = diff.lives;
  state.retryPending = 0;
  state.spawnElapsed = currentSpawnInterval();
  state.lastFrame = 0;
  state.particles = [];
  input.value = "";
  input.disabled = false;
  startButton.textContent = "다시";
  pauseButton.textContent = "정지";
  pauseButton.disabled = false;
  readyPanel.classList.add("hidden");
  setStatus(statusLabel());
  updateStats();
  input.focus();

  if (!state.raf) {
    state.raf = window.requestAnimationFrame(loop);
  }
}

function endGame() {
  state.running = false;
  state.paused = false;
  clearDrops();
  input.disabled = true;
  pauseButton.disabled = true;
  pauseButton.textContent = "정지";
  readyPanel.classList.remove("hidden");
  setStatus("게임 종료");
}

function togglePause() {
  if (!state.running) {
    return;
  }

  state.paused = !state.paused;
  pauseButton.textContent = state.paused ? "계속" : "정지";
  setStatus(state.paused ? "일시정지" : statusLabel());
  if (!state.paused) {
    state.lastFrame = 0;
    input.focus();
  }
}

function statusLabel() {
  return `${LANGUAGE_LABELS[state.language]} ${modeLabel(state.mode)}`;
}

function updateReadyPanel() {
  const isEnglish = state.language === "english";
  const isMeaning = state.mode === "meaning";

  readyPanel.querySelector("span").textContent = isMeaning ? "A 뜻" : "B 스펠링";

  if (isEnglish && isMeaning) {
    readyPanel.querySelector("strong").textContent = "apple";
    readyPanel.querySelector("b").textContent = "사과";
    return;
  }

  if (isEnglish) {
    readyPanel.querySelector("strong").textContent = "사과";
    readyPanel.querySelector("b").textContent = "apple";
    return;
  }

  if (isMeaning) {
    readyPanel.querySelector("strong").textContent = "林檎 (りんご)";
    readyPanel.querySelector("b").textContent = "사과";
    return;
  }

  readyPanel.querySelector("strong").textContent = "사과";
  readyPanel.querySelector("b").textContent = "りんご";
}

function updateWordbookGuide() {
  const isEnglish = state.language === "english";
  wordbookGuide.textContent = isEnglish
    ? "현재 영어 단어장으로 불러옵니다. TXT/Excel 모두 1열 영어, 2열 한국어입니다. wordbooks 폴더 파일은 manifest.json에 등록하면 목록에 표시됩니다."
    : "현재 일본어 단어장으로 불러옵니다. TXT/Excel 모두 1열 한자, 2열 히라가나/가타가나, 3열 한국어입니다. wordbooks 폴더 파일은 manifest.json에 등록하면 목록에 표시됩니다.";
  wordbookStatus.textContent = `${wordbookNames[state.language]}: ${currentWords().length}개`;
  renderFolderWordbookOptions();
}

function setLanguage(language) {
  state.language = language;
  setActiveButton(languageButtons, "language", language);
  updateReadyPanel();
  updateWordbookGuide();
  state.queue = [];
  state.retryPending = 0;
  startButton.disabled = currentWords().length === 0;
  updateStats();

  if (state.running) {
    startGame();
  } else {
    setStatus(`${LANGUAGE_LABELS[language]} 준비`);
  }
}

function setMode(mode) {
  state.mode = mode;
  setActiveButton(modeButtons, "mode", mode);
  updateReadyPanel();

  if (state.running) {
    startGame();
  } else {
    setStatus(`${LANGUAGE_LABELS[state.language]} 준비`);
  }
}

function setDifficulty(difficulty) {
  state.difficulty = difficulty;
  state.lives = DIFFICULTIES[difficulty].lives;
  setActiveButton(difficultyButtons, "difficulty", difficulty);
  updateStats();

  if (state.running) {
    startGame();
  }
}

function openWordbookPanel() {
  updateWordbookGuide();
  wordbookPanel.classList.remove("hidden");
  wordbookPanel.setAttribute("aria-hidden", "false");
  wordbookFile.value = "";
  wordbookCloseButton.focus();
}

function closeWordbookPanel() {
  wordbookPanel.classList.add("hidden");
  wordbookPanel.setAttribute("aria-hidden", "true");
  wordbookButton.focus();
}

function cellText(value) {
  return String(value ?? "").trim();
}

function isHeaderRow(row, language = state.language) {
  const first = cellText(row[0]).toLowerCase();
  const second = cellText(row[1]).toLowerCase();
  const third = cellText(row[2]).toLowerCase();

  if (language === "japanese") {
    return (
      ["kanji", "한자", "일본어"].includes(first) ||
      ["kana", "hiragana", "katakana", "히라가나", "가타가나", "가나"].includes(second) ||
      ["korean", "ko", "kr", "한글", "한국어"].includes(third)
    );
  }

  return (
    ["english", "en", "영어"].includes(first) ||
    ["korean", "ko", "kr", "한글", "한국어"].includes(second)
  );
}

function rowToEnglishEntry(row) {
  const en = cellText(row[0]);
  const ko = cellText(row[1]);

  if (!en || !ko) {
    return null;
  }

  return {
    en,
    ko,
  };
}

function rowToJapaneseEntry(row) {
  const kanji = cellText(row[0]);
  const kana = cellText(row[1]);
  const ko = cellText(row[2]);

  if (!kana || !ko) {
    return null;
  }

  return enrichJapaneseEntry({
    kanji,
    kana,
    ko,
  });
}

function rowToWordEntry(row, language = state.language) {
  return language === "japanese"
    ? rowToJapaneseEntry(row)
    : rowToEnglishEntry(row);
}

function rowsToWordEntries(rows, language = state.language) {
  const entries = [];

  rows.forEach((row, index) => {
    if (!row || row.every((cell) => !cellText(cell))) {
      return;
    }

    if (index === 0 && isHeaderRow(row, language)) {
      return;
    }

    const entry = rowToWordEntry(row, language);
    if (entry) {
      entries.push(entry);
    }
  });

  return entries;
}

function parseTextWordbook(text, language = state.language) {
  const rows = text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.split("\t"));
  return rowsToWordEntries(rows, language);
}

async function parseExcelWordbook(file, language = state.language) {
  if (!window.XLSX) {
    throw new Error("엑셀 파서를 불러오지 못했습니다. TXT 파일로 다시 시도하세요.");
  }

  const data = await file.arrayBuffer();
  const workbook = window.XLSX.read(data, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = window.XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
  });
  return rowsToWordEntries(rows, language);
}

async function parseWordbookBlob(blob, fileName, language = state.language) {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".txt") || lowerName.endsWith(".tsv")) {
    return parseTextWordbook(await blob.text(), language);
  }

  if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    return parseExcelWordbook(blob, language);
  }

  throw new Error("txt, tsv, xls, xlsx 파일만 사용할 수 있습니다.");
}

function parseWordbookFile(file, language = state.language) {
  return parseWordbookBlob(file, file.name, language);
}

function manifestFileUrl(entry) {
  if (entry.path) {
    return entry.path;
  }

  return `${WORDBOOK_FOLDER}/${entry.file}`;
}

function normalizeManifestEntry(entry) {
  const language = entry.language === "japanese" ? "japanese" : "english";
  const file = cellText(entry.file || entry.path);

  if (!file) {
    return null;
  }

  return {
    language,
    file,
    path: entry.path || `${WORDBOOK_FOLDER}/${file}`,
    name: cellText(entry.name) || file,
    default: Boolean(entry.default),
  };
}

function folderWordbooksForLanguage(language = state.language) {
  return folderWordbooks.filter((entry) => entry.language === language);
}

function renderFolderWordbookOptions() {
  const entries = folderWordbooksForLanguage();
  folderWordbookSelect.innerHTML = "";

  entries.forEach((entry, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${entry.name} (${entry.file})`;
    folderWordbookSelect.append(option);
  });

  const hasEntries = entries.length > 0;
  folderWordbookSelect.disabled = !hasEntries;
  loadFolderWordbookButton.disabled = !hasEntries;

  if (!hasEntries) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "manifest.json에 등록된 파일이 없습니다";
    folderWordbookSelect.append(option);
  }
}

async function loadFolderManifest() {
  try {
    const response = await fetch(WORDBOOK_MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`manifest.json을 읽을 수 없습니다. (${response.status})`);
    }

    const data = await response.json();
    const rawEntries = Array.isArray(data) ? data : data.wordbooks;
    folderWordbooks = (rawEntries || [])
      .map(normalizeManifestEntry)
      .filter(Boolean);
  } catch (error) {
    folderWordbooks = [];
    wordbookStatus.textContent =
      "wordbooks/manifest.json을 불러오지 못했습니다. GitHub Pages 또는 로컬 서버에서 실행하세요.";
  }

  renderFolderWordbookOptions();
}

function defaultFolderWordbook(language = state.language) {
  const entries = folderWordbooksForLanguage(language);
  return entries.find((entry) => entry.default) || entries[0] || null;
}

function selectedFolderWordbook() {
  const entries = folderWordbooksForLanguage();
  return entries[Number(folderWordbookSelect.value)] || entries[0] || null;
}

async function loadFolderWordbook(entry = selectedFolderWordbook()) {
  if (!entry) {
    throw new Error("불러올 폴더 단어장이 없습니다.");
  }

  const response = await fetch(manifestFileUrl(entry), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${entry.file} 파일을 읽을 수 없습니다. (${response.status})`);
  }

  const blob = await response.blob();
  const entries = await parseWordbookBlob(blob, entry.file, entry.language);
  if (!entries.length) {
    throw new Error(`${entry.file}에서 읽을 수 있는 단어가 없습니다.`);
  }

  applyWordbook(entries, entry.name, entry.language);
  return entries;
}

async function loadDefaultFolderWordbook(language = state.language) {
  const entry = defaultFolderWordbook(language);
  if (!entry) {
    throw new Error(`${LANGUAGE_LABELS[language]} 기본 파일이 없습니다.`);
  }

  return loadFolderWordbook(entry);
}

async function handleFolderWordbookLoad() {
  try {
    await loadFolderWordbook();
  } catch (error) {
    wordbookStatus.textContent = error.message;
  }
}

function applyWordbook(entries, name, language = state.language) {
  activeWordbooks[language] = entries;
  wordbookNames[language] = name;
  wordbookStatus.textContent = `${LANGUAGE_LABELS[language]} ${name}: ${entries.length}개 단어를 불러왔습니다.`;
  state.queue = [];
  state.retryPending = 0;
  startButton.disabled = currentWords().length === 0;

  if (state.running) {
    startGame();
  } else {
    resetQueue();
    updateStats();
    setStatus(`${LANGUAGE_LABELS[language]} ${entries.length}개`);
  }
}

async function resetWordbook() {
  try {
    await loadDefaultFolderWordbook(state.language);
  } catch (error) {
    wordbookStatus.textContent = error.message;
  }
}

async function handleWordbookFileChange() {
  const file = wordbookFile.files[0];
  if (!file) {
    return;
  }

  try {
    const entries = await parseWordbookFile(file);
    if (!entries.length) {
      throw new Error(
        state.language === "japanese"
          ? "읽을 수 있는 단어가 없습니다. 1열 한자, 2열 히라가나/가타가나, 3열 한국어를 확인하세요."
          : "읽을 수 있는 단어가 없습니다. 1열 영어, 2열 한국어를 확인하세요.",
      );
    }
    applyWordbook(entries, file.name);
  } catch (error) {
    wordbookStatus.textContent = error.message;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  tryMatch({ clearOnMiss: true });
});

input.addEventListener("input", tryMatch);
input.addEventListener("compositionstart", () => {
  composing = true;
});
input.addEventListener("compositionend", () => {
  composing = false;
  tryMatch();
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
wordbookButton.addEventListener("click", openWordbookPanel);
wordbookCloseButton.addEventListener("click", closeWordbookPanel);
wordbookDoneButton.addEventListener("click", closeWordbookPanel);
resetWordbookButton.addEventListener("click", resetWordbook);
wordbookFile.addEventListener("change", handleWordbookFileChange);
loadFolderWordbookButton.addEventListener("click", handleFolderWordbookLoad);

wordbookPanel.addEventListener("click", (event) => {
  if (event.target === wordbookPanel) {
    closeWordbookPanel();
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
});

window.addEventListener("resize", resizeCanvas);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.running && !state.paused) {
    togglePause();
  }
});

async function initializeApp() {
  resizeCanvas();
  updateStats();
  startButton.disabled = true;
  pauseButton.disabled = true;
  setStatus("단어장 불러오는 중");

  await loadFolderManifest();

  const results = await Promise.allSettled([
    loadDefaultFolderWordbook("english"),
    loadDefaultFolderWordbook("japanese"),
  ]);
  const failed = results.filter((result) => result.status === "rejected");

  setLanguage(state.language);
  setMode(state.mode);
  setDifficulty(state.difficulty);
  updateStats();

  if (!currentWords().length) {
    startButton.disabled = true;
    setStatus("단어장 불러오기 필요");
    if (failed[0]) {
      wordbookStatus.textContent = failed[0].reason.message;
    }
  } else {
    startButton.disabled = false;
    setStatus(`${LANGUAGE_LABELS[state.language]} 준비`);
  }

  state.raf = window.requestAnimationFrame(loop);
}

initializeApp();
