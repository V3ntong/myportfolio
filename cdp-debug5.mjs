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
  const canvas = document.querySelector('#hero-heading canvas');
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let found = null;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 200) { found = [data[i], data[i+1], data[i+2], data[i+3], Math.floor((i/4) % canvas.width), Math.floor((i/4) / canvas.width)]; break; }
  }
  return { color: getComputedStyle(document.querySelector('#hero-heading')).color, canvas: [canvas.width, canvas.height], pixel: found, theme: document.documentElement.className.includes('light') ? 'light' : 'dark' };
})()`;

console.log("before", JSON.stringify(await evaluate(sample)));
await evaluate("window.dispatchEvent(new Event('resize'))");
await sleep(1000);
console.log("after resize event", JSON.stringify(await evaluate(sample)));
await send("Emulation.setDeviceMetricsOverride", { width: 1441, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(500);
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(1200);
console.log("after viewport resize", JSON.stringify(await evaluate(sample)));
ws.close();
