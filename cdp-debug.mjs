import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.env.TEMP ?? ".", "portfolio-shots");
const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((item) => item.type === "page" && item.url.startsWith("http://localhost:3000"));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
const events = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  } else if (message.method) {
    if (["Runtime.consoleAPICalled", "Runtime.exceptionThrown", "Log.entryAdded"].includes(message.method)) {
      events.push({ method: message.method, params: message.params });
    }
  }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Emulation.setEmulatedMedia", { features: [] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.reload", { ignoreCache: true });
await sleep(3500);
const before = await evaluate(`({
  theme: document.documentElement.className,
  htmlBg: getComputedStyle(document.documentElement).backgroundColor,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color,
  muted: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground'),
  bgVar: getComputedStyle(document.documentElement).getPropertyValue('--background'),
  fgVar: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
  pColor: getComputedStyle(document.querySelector('#home p')).color,
  pBg: getComputedStyle(document.querySelector('#home p')).backgroundColor,
  canvases: Array.from(document.querySelectorAll('canvas')).map((c) => ({ w: c.width, h: c.height, cls: c.className })),
})`);
await evaluate(`document.querySelector('button[aria-label="Switch to light mode"]')?.click()`);
await sleep(1500);
const after = await evaluate(`({
  theme: document.documentElement.className,
  htmlBg: getComputedStyle(document.documentElement).backgroundColor,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color,
  muted: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground'),
  bgVar: getComputedStyle(document.documentElement).getPropertyValue('--background'),
  fgVar: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
  pColor: getComputedStyle(document.querySelector('#home p')).color,
  pBg: getComputedStyle(document.querySelector('#home p')).backgroundColor,
  viewTransitionRunning: document.documentElement.classList.contains('theme-transition'),
  styleSheets: Array.from(document.styleSheets).map((s) => s.href),
})`);
const shot = await send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(path.join(OUT, "debug-light.png"), Buffer.from(shot.data, "base64"));
console.log(JSON.stringify({ before, after, events: events.map((e) => ({
  method: e.method,
  type: e.params.type ?? e.params.entry?.level,
  text: e.params.exceptionDetails?.exception?.description ?? e.params.entry?.text ?? e.params.args?.map((a) => a.value ?? a.description).join(" "),
})) }, null, 2));
ws.close();
