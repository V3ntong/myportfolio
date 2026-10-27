const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
const issues = [];
ws.onmessage = (event) => {
  const m = JSON.parse(event.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id); pending.delete(m.id);
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);
    return;
  }
  if (m.method === "Runtime.exceptionThrown") issues.push(["exception", m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text]);
  if (m.method === "Log.entryAdded" && ["error", "warning"].includes(m.params.entry.level)) issues.push([m.params.entry.level, m.params.entry.text]);
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) issues.push([m.params.type, m.params.args.map(a => a.value ?? a.description).join(" ")]);
};
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const { writeFile } = await import("node:fs/promises");
const shot = async (name) => { const { data } = await send("Page.captureScreenshot", { format: "png" }); await writeFile(`C:/Users/Ventong/AppData/Local/Temp/portfolio-shots/${name}.png`, Buffer.from(data, "base64")); };
const wait = (ms) => evaluate(`new Promise(r => setTimeout(r, ${ms}))`);

const ink = `(() => {
  const canvas = document.querySelector('#hero-heading canvas');
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let dark = 0, light = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    const max = Math.max(data[i], data[i+1], data[i+2]);
    const min = Math.min(data[i], data[i+1], data[i+2]);
    if (max - min > 40) continue;
    if (max < 70) dark++; else if (min > 180) light++;
  }
  return { dark, light, theme: document.documentElement.classList.contains('light') ? 'light' : 'dark', themeVt: document.documentElement.classList.contains('theme-vt'), themeTransition: document.documentElement.classList.contains('theme-transition') };
})()`;

await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setEmulatedMedia", { features: [] });
await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3000);
await evaluate("window.scrollTo(0,0)");
await sleep(300);
console.log("start", JSON.stringify(await evaluate(ink)));

await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(260);
await shot("final-vt-mid");
console.log("mid VT", JSON.stringify(await evaluate(ink)));
await sleep(1400);
console.log("after VT", JSON.stringify(await evaluate(ink)));
await shot("final-light");

await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.reload", { ignoreCache: true });
await sleep(3000);
await evaluate("window.scrollTo(0,0)");
await sleep(300);
console.log("reduced light start", JSON.stringify(await evaluate(ink)));
await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
await sleep(900);
console.log("reduced dark after toggle", JSON.stringify(await evaluate(ink)));
await shot("final-reduced-dark");

// Mobile layout
await send("Emulation.setEmulatedMedia", { features: [] });
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(400);
console.log("mobile", JSON.stringify(await evaluate(`(() => {
  const heading = document.querySelector('#hero-heading').getBoundingClientRect();
  const portrait = document.querySelector('[aria-label="Portrait of Melvin Maquilan"]').getBoundingClientRect();
  return {
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    heading: { left: Math.round(heading.left), right: Math.round(heading.right), top: Math.round(heading.top), bottom: Math.round(heading.bottom) },
    portrait: { left: Math.round(portrait.left), right: Math.round(portrait.right), top: Math.round(portrait.top), bottom: Math.round(portrait.bottom) },
    overlap: !(heading.bottom <= portrait.top || portrait.bottom <= heading.top || heading.right <= portrait.left || portrait.right <= heading.left),
  };
})()`)));
await shot("final-mobile-dark");

console.log("console issues", JSON.stringify(issues));
ws.close();
