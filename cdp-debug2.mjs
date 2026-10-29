import fs from "node:fs";
import path from "node:path";
const OUT = path.join(process.env.TEMP ?? ".", "portfolio-shots");
const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map();
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const snap = async (name) => { const s = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(OUT, name), Buffer.from(s.data, "base64")); };
const styles = `({
  theme: document.documentElement.className.includes('light') ? 'light' : document.documentElement.className.includes('dark') ? 'dark' : 'none',
  htmlBg: getComputedStyle(document.documentElement).backgroundColor,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color,
  pColor: getComputedStyle(document.querySelector('#home p')).color,
  bgVar: getComputedStyle(document.documentElement).getPropertyValue('--background'),
  transition: getComputedStyle(document.body).transition,
})`;

await send("Page.enable");
await send("Emulation.setEmulatedMedia", { features: [] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

// Force light via storage and reload, no view transition.
await evaluate(`localStorage.setItem('theme','light')`);
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
const lightReload = await evaluate(styles);
await snap("debug-light-reload.png");

// Reduced-motion toggle (fallback) dark -> light.
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await evaluate(`localStorage.setItem('theme','dark')`);
await send("Page.reload", { ignoreCache: true });
await sleep(3000);
const beforeFallback = await evaluate(styles);
await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(900);
const afterFallback = await evaluate(styles);
await snap("debug-fallback-light.png");

console.log(JSON.stringify({ lightReload, beforeFallback, afterFallback }, null, 2));
ws.close();
