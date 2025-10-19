import puppeteer from "puppeteer";
import fetch from "node-fetch";

const RAW_SCRIPT_URL = "https://raw.githubusercontent.com/hackmoro0-bot/haxball_bot_headless/refs/heads/master/HaxBot_public.js";

const HAX_TOKEN = process.env.HAXBALL_TOKEN;
if (!HAX_TOKEN) {
  console.error("ERROR: define la variable de entorno HAXBALL_TOKEN");
  process.exit(1);
}

async function fetchRoomScript() {
  const res = await fetch(RAW_SCRIPT_URL);
  if (!res.ok) throw new Error("No se pudo descargar el script: " + res.status);
  let txt = await res.text();
  txt = txt.replace(/(token\s*[:=]\s*['"`]).*?(['"`])/i, `$1${HAX_TOKEN}$2`);
  return txt;
}

(async () => {
  const script = await fetchRoomScript();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.haxball.com/headless", { waitUntil: "networkidle2" });

  await page.evaluate(script);

  console.log("Sala iniciada (Headless) — script inyectado correctamente.");
})();
