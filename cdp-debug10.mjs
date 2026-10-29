const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const detail = `(() => {
  const root = document.querySelector('#hero-heading > div');
  const canvas = document.querySelector('#hero-heading canvas');
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  const counts = new Map();
  let opaque = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    opaque++;
    const key = data[i] + ',' + data[i+1] + ',' + data[i+2];
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    theme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
    cssColor: getComputedStyle(root).color,
    opaque,
    top,
    classes: document.documentElement.className.split(' ').filter(c => c === 'theme-transition' || c === 'theme-vt' || c === 'light' || c === 'dark'),
    canvasSize: [canvas.width, canvas.height],
  };
})()`;

await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await evaluate("localStorage.setItem('theme','light')");
await send("Page.reload", { ignoreCache: true });
await sleep(3000);
await evaluate("window.scrollTo(0,0)");
await sleep(300);
console.log("start", JSON.stringify(await evaluate(detail)));
await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
let elapsed = 0;
for (const step of [120, 180, 300, 400, 600]) {
  await sleep(step);
  elapsed += step;
  console.log(`@${elapsed}`, JSON.stringify(await evaluate(detail)));
}
ws.close();
