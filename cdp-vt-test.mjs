const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Emulation.setEmulatedMedia", { features: [] });
await evaluate(`(() => {
  window.__vt = { steps: [], started: performance.now() };
  const log = (s) => window.__vt.steps.push([s, Math.round(performance.now() - window.__vt.started), document.visibilityState]);
  log('before');
  const t = document.startViewTransition(async () => {
    log('callback');
    await new Promise((r) => requestAnimationFrame(() => { log('raf1'); r(); }));
    await new Promise((r) => requestAnimationFrame(() => { log('raf2'); r(); }));
    log('after');
  });
  t.finished.then(() => log('finished'), (e) => log('failed: ' + e.message));
})()`);
await sleep(3500);
console.log(JSON.stringify(await evaluate("window.__vt"), null, 2));
ws.close();
