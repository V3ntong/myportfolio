const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sample = `(() => ({ clears: window.__clears, rafLog: window.__rafLog, theme: document.documentElement.className }))()`;

await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(300);

await evaluate(`(() => {
  window.__clears = 0;
  window.__rafLog = [];
  const orig = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    if (this.canvas && this.canvas.id === 'hero-canvas') window.__clears += 1;
    return orig.apply(this, args);
  };
  new MutationObserver(() => {
    window.__rafLog.push(['mutation', Math.round(performance.now())]);
    requestAnimationFrame(() => window.__rafLog.push(['raf', Math.round(performance.now())]));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
  const c = document.querySelector('#hero-heading canvas');
  c.id = 'hero-canvas';
})()`);

console.log("before toggle", JSON.stringify(await evaluate(sample)));
await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(500);
console.log("@500ms", JSON.stringify(await evaluate(sample)));
await sleep(1500);
console.log("@2s", JSON.stringify(await evaluate(sample)));
await sleep(1500);
console.log("@3.5s", JSON.stringify(await evaluate(sample)));

// Try dispatching a generic style mutation (no visual change) to see if wake works.
await evaluate(`document.documentElement.classList.add('noop-probe'); document.documentElement.classList.remove('noop-probe')`);
await sleep(500);
console.log("after noop class mutation", JSON.stringify(await evaluate(sample)));

ws.close();
