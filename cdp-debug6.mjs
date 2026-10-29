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
  let found = null;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 200) { found = [data[i], data[i+1], data[i+2], data[i+3]]; break; }
  }
  return { theme: document.documentElement.className.includes('light') ? 'light' : 'dark', cssColor: getComputedStyle(root).color, pixel: found };
})()`;
const poke = `document.querySelector('#hero-heading > div').dispatchEvent(new PointerEvent('pointerenter', { clientX: 300, clientY: 300, bubbles: true }))`;

await send("Emulation.setEmulatedMedia", { features: [] });
await evaluate("localStorage.setItem('theme','dark')");
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(300);
console.log("initial dark", JSON.stringify(await evaluate(sample)));
await evaluate(poke); await sleep(600);
console.log("dark + poke", JSON.stringify(await evaluate(sample)));

await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(1800);
console.log("light after VT", JSON.stringify(await evaluate(sample)));
await evaluate(poke); await sleep(600);
console.log("light + poke", JSON.stringify(await evaluate(sample)));

await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
await sleep(1800);
console.log("dark after VT", JSON.stringify(await evaluate(sample)));
await evaluate(poke); await sleep(600);
console.log("dark + poke", JSON.stringify(await evaluate(sample)));
ws.close();
