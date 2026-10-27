import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.env.TEMP ?? ".", "portfolio-shots");
fs.mkdirSync(OUT, { recursive: true });

const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
if (!page) throw new Error("Portfolio page not found");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  }
};

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text + " " + JSON.stringify(result.exceptionDetails.exception?.description));
  }
  return result.result.value;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitReady = async (settle = 2200) => {
  const start = Date.now();
  await sleep(350);
  while (Date.now() - start < 20000) {
    try {
      if ((await evaluate("document.readyState")) === "complete") break;
    } catch {}
    await sleep(100);
  }
  await sleep(settle);
};

const reload = async (settle = 2200) => {
  await send("Page.reload", { ignoreCache: true });
  await waitReady(settle);
};

const screenshot = async (name) => {
  const result = await send("Page.captureScreenshot", { format: "png" });
  const file = path.join(OUT, name);
  fs.writeFileSync(file, Buffer.from(result.data, "base64"));
  return file;
};

const setViewport = async (width, height, mobile = false) => {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
};

const measureExpression = `(() => {
  const rect = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), right: Math.round(b.right), bottom: Math.round(b.bottom) };
  };
  const h1 = document.querySelector('#hero-heading');
  const paragraphs = Array.from(document.querySelectorAll('#home p'));
  const portrait = document.querySelector('[aria-label="Portrait of Melvin Maquilan"]');
  const textBoxes = [h1, ...paragraphs].map(rect).filter(Boolean);
  const portraitBox = rect(portrait);
  const overlaps = (a, b) => !!a && !!b && a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    h1: rect(h1),
    paragraphs: paragraphs.map(rect),
    portrait: portraitBox,
    portraitOverlap: textBoxes.map((box) => overlaps(box, portraitBox)),
    headingText: h1?.textContent?.trim() ?? null,
    headingRole: h1?.querySelector('[role="img"]')?.getAttribute('aria-label') ?? null,
    headingFont: h1 ? getComputedStyle(h1).fontFamily : null,
    paragraphOpacities: paragraphs.map((p) => getComputedStyle(p).opacity),
    paragraphColors: paragraphs.map((p) => getComputedStyle(p).color),
    theme: document.documentElement.className,
    title: document.title,
  };
})()`;

const results = {};

await send("Page.enable");
await send("Runtime.enable");

for (const [width, height] of [
  [1280, 800],
  [1440, 900],
  [1920, 1080],
]) {
  await setViewport(width, height);
  await reload(2600);
  results[`desktop-${width}`] = await evaluate(measureExpression);
  await screenshot(`cdp-hero-${width}.png`);
}

// Light mode through the toggle (dark -> light) and back.
await setViewport(1440, 900);
await reload(2200);
await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(1400);
results.lightAfterToggle = await evaluate(measureExpression);
await screenshot("cdp-light-1440.png");
await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
await sleep(1400);
results.darkAfterToggle = await evaluate(`({
  theme: document.documentElement.className,
  stored: localStorage.getItem('theme'),
  toggleLabel: document.querySelector('button[aria-label]')?.getAttribute('aria-label'),
})`);
await screenshot("cdp-dark-1440.png");

// Scroll behaviour: blur down / up / bottom and section reveal.
await reload(2200);
results.beforeScroll = await evaluate(`({
  blur: (() => { const el = document.querySelector('.scroll-blur'); return el ? { opacity: getComputedStyle(el).opacity, reveal: getComputedStyle(el).getPropertyValue('--gradual-blur-reveal').trim(), fixed: getComputedStyle(el).position || getComputedStyle(el).position } : null; })(),
  aboutVisibility: getComputedStyle(document.querySelector('#about h2')).visibility,
  aboutOpacity: getComputedStyle(document.querySelector('#about h2')).opacity,
})`);
await evaluate("window.scrollTo(0, 1400)");
await sleep(800);
results.scrollDown = await evaluate(`({
  y: window.scrollY,
  blurOpacity: getComputedStyle(document.querySelector('.scroll-blur')).opacity,
  blurReveal: getComputedStyle(document.querySelector('.scroll-blur')).getPropertyValue('--gradual-blur-reveal').trim(),
  aboutWrapper: (() => { const el = document.querySelector('#about h2').parentElement; return { visibility: getComputedStyle(el).visibility, opacity: getComputedStyle(el).opacity }; })(),
  navActive: document.querySelector('li[aria-current="true"]')?.textContent?.trim() ?? null,
})`);
await evaluate("window.scrollTo(0, 800)");
await sleep(800);
results.scrollUp = await evaluate(`({
  y: window.scrollY,
  blurOpacity: getComputedStyle(document.querySelector('.scroll-blur')).opacity,
  blurReveal: getComputedStyle(document.querySelector('.scroll-blur')).getPropertyValue('--gradual-blur-reveal').trim(),
})`);
await evaluate("window.scrollTo(0, document.documentElement.scrollHeight)");
await sleep(800);
results.scrollBottom = await evaluate(`({
  y: window.scrollY,
  max: document.documentElement.scrollHeight - window.innerHeight,
  blurOpacity: getComputedStyle(document.querySelector('.scroll-blur')).opacity,
  blurReveal: getComputedStyle(document.querySelector('.scroll-blur')).getPropertyValue('--gradual-blur-reveal').trim(),
})`);

// Sidebar click: should land on About and reveal it.
await evaluate("window.scrollTo(0, 0)");
await sleep(300);
await evaluate(`Array.from(document.querySelectorAll('li')).find((el) => el.textContent?.trim() === 'About')?.click()`);
await sleep(1600);
results.navClick = await evaluate(`({
  y: window.scrollY,
  aboutTop: Math.round(document.querySelector('#about').getBoundingClientRect().top),
  aboutHeadingOpacity: getComputedStyle(document.querySelector('#about h2')).opacity,
  aboutWrapperVisibility: getComputedStyle(document.querySelector('#about h2').parentElement).visibility,
  navActive: document.querySelector('li[aria-current="true"]')?.textContent?.trim() ?? null,
})`);
await screenshot("cdp-about.png");

// Mobile.
await setViewport(390, 844, true);
await reload(2200);
results.mobile = await evaluate(measureExpression);
await screenshot("cdp-mobile-390.png");

// Reduced motion.
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});
await setViewport(1440, 900);
await reload(2200);
results.reducedMotion = await evaluate(`({
  blurPresent: !!document.querySelector('.scroll-blur'),
  heroParagraphs: Array.from(document.querySelectorAll('#home p')).map((p) => getComputedStyle(p).opacity),
  aboutWrapper: (() => { const el = document.querySelector('#about h2').parentElement; return { visibility: getComputedStyle(el).visibility, opacity: getComputedStyle(el).opacity }; })(),
})`);
await screenshot("cdp-reduced.png");

fs.writeFileSync(path.join(OUT, "cdp-results.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
ws.close();
