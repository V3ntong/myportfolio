const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const sample = `(() => {
  const root = document.querySelector('#hero-heading > div');
  const canvas = document.querySelector('#hero-heading canvas');
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const bucket = { dark: 0, light: 0, purple: 0, other: 0, total: 0 };
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    bucket.total++;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max - min > 40 && r > 60 && b > 100 && b > g) bucket.purple++;
    else if (max < 70) bucket.dark++;
    else if (min > 180) bucket.light++;
    else bucket.other++;
  }
  return {
    theme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
    cssColor: getComputedStyle(root).color,
    canvasCssColor: getComputedStyle(canvas).color,
    bucket,
    dominant: Object.entries(bucket).filter(([k]) => k !== 'total').sort((a, b) => b[1] - a[1])[0],
  };
})()`;

const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(`C:/Users/Ventong/AppData/Local/Temp/portfolio-shots/${name}.png`, Buffer.from(data, "base64"));
};

const toggle = async (label) => {
  await evaluate(`document.querySelector('button[aria-label="${label}"]')?.click()`);
};

await send("Emulation.setEmulatedMedia", { features: [] });
await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(400);

console.log("initial dark", JSON.stringify(await evaluate(sample)));
await shot("tt-initial-dark");

await toggle("Switch to light mode");
await sleep(300);
console.log("light @300ms", JSON.stringify(await evaluate(sample)));
await sleep(1700);
console.log("light @2s", JSON.stringify(await evaluate(sample)));
await shot("tt-light-2s");
await sleep(1500);
console.log("light @3.5s", JSON.stringify(await evaluate(sample)));

await toggle("Switch to dark mode");
await sleep(300);
console.log("dark @300ms", JSON.stringify(await evaluate(sample)));
await sleep(1700);
console.log("dark @2s", JSON.stringify(await evaluate(sample)));
await shot("tt-dark-2s");

await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(400);
await toggle("Switch to light mode");
await sleep(2500);
await shot("tt-light-fresh-2.5s");
console.log("fresh reload light @2.5s", JSON.stringify(await evaluate(sample)));

ws.close();
