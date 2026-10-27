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
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
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
  return { theme: document.documentElement.classList.contains('light') ? 'light' : 'dark', cssColor: getComputedStyle(root).color, clears: window.__clears ?? -1, lastClear: window.__lastClear ?? -1, bucket };
})()`;

// Count canvas clears (one per TechText frame) without touching component code.
await evaluate(`(() => {
  if (window.__clearPatched) return;
  window.__clearPatched = true;
  window.__clears = 0;
  window.__lastClear = -1;
  const orig = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    if (this.canvas && this.canvas.closest && this.canvas.closest('#hero-heading')) {
      window.__clears += 1;
      window.__lastClear = performance.now();
    }
    return orig.apply(this, args);
  };
})()`);

await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(300);
console.log("dark loaded", JSON.stringify(await evaluate(sample)));

await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(1500);
console.log("light @1.5s", JSON.stringify(await evaluate(sample)));

// Wake via pointerenter (does it repaint?)
await evaluate(`document.querySelector('#hero-heading > div').dispatchEvent(new PointerEvent('pointerenter', { clientX: 300, clientY: 300, bubbles: true }))`);
await sleep(500);
console.log("light + pointerenter", JSON.stringify(await evaluate(sample)));

// Force a real resize of the container (ResizeObserver -> resize -> wake)
await evaluate(`document.querySelector('#hero-heading > div').style.width = 'calc(100% - 1px)'`);
await sleep(300);
await evaluate(`document.querySelector('#hero-heading > div').style.width = ''`);
await sleep(500);
console.log("light + resize", JSON.stringify(await evaluate(sample)));

await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
await sleep(1500);
console.log("dark @1.5s", JSON.stringify(await evaluate(sample)));

// Check whether the View Transition drops rAF: count the clears during a toggle.
ws.close();
