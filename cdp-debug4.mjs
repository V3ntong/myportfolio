import fs from "node:fs";
import path from "node:path";
const OUT = path.join(process.env.TEMP ?? ".", "portfolio-shots");
const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0; const pending = new Map(); const events = [];
ws.onmessage = (event) => { const m = JSON.parse(event.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); } else if (m.method === "Runtime.exceptionThrown" || m.method === "Log.entryAdded") { events.push(m); } };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const snap = async (name) => { const s = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(OUT, name), Buffer.from(s.data, "base64")); };

await send("Runtime.enable"); await send("Log.enable"); await send("Page.enable");
await send("Emulation.setEmulatedMedia", { features: [] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await evaluate(`localStorage.setItem('theme','dark')`);
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
await evaluate("window.scrollTo(0,0)");
await sleep(400);
events.length = 0;

await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(220);
await snap("vt-mid-1440.png");
await sleep(1400);
const light = await evaluate(`({ theme: document.documentElement.className.includes('light') ? 'light' : 'dark', bg: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color })`);
await snap("vt-light-hero-1440.png");
const lightEvents = events.splice(0);

await evaluate(`document.querySelector('button[aria-label="Switch to dark mode"]')?.click()`);
await sleep(1600);
const dark = await evaluate(`({ theme: document.documentElement.className.includes('light') ? 'light' : 'dark', bg: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color })`);
await snap("vt-dark-hero-1440.png");
const darkEvents = events.splice(0);

console.log(JSON.stringify({ light, dark, lightEvents: lightEvents.map((e) => e.params.exceptionDetails?.exception?.description ?? e.params.entry?.text), darkEvents: darkEvents.map((e) => e.params.exceptionDetails?.exception?.description ?? e.params.entry?.text) }, null, 2));
ws.close();
