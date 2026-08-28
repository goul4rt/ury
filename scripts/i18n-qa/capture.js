// i18n QA capture tool.
//
// Visits a fixed list of /app pages as an authenticated Administrator
// (via an sid cookie generated server-side — see ury/i18n_tmp_helpers.py,
// no password ever touched) and for each one saves a full-page screenshot
// plus the rendered visible text (innerText of the page body). Used to find
// which untranslated core strings actually show up on screen, and later to
// verify that a translation fix took effect on the rendered DOM (not just
// in the cache/CSV).
//
// Usage: URY_ADMIN_SID=... node capture.js <out-subdir>   (e.g. "before" or "after")

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.URY_BASE_URL || "http://localhost:8080";
const ADMIN_SID = process.env.URY_ADMIN_SID;
const OUT_SUBDIR = process.argv[2] || "before";

const PAGES = [
  { name: "users-workspace", url: "/app/users" },
  { name: "manufacturing-workspace", url: "/app/manufacturing" },
  { name: "assets-workspace", url: "/app/assets" },
  { name: "selling-workspace", url: "/app/selling" },
  { name: "buying-workspace", url: "/app/buying" },
  { name: "accounting-workspace", url: "/app/accounting" },
  { name: "home-workspace", url: "/app/home" },
];

async function main() {
  if (!ADMIN_SID) {
    throw new Error("Set URY_ADMIN_SID env var before running.");
  }

  const screenshotsRoot = process.env.URY_QA_OUT || path.resolve("out", OUT_SUBDIR);
  fs.mkdirSync(screenshotsRoot, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addCookies([
    {
      name: "sid",
      value: ADMIN_SID,
      url: BASE_URL,
    },
  ]);
  const page = await context.newPage();

  const results = [];

  for (const { name, url } of PAGES) {
    const entry = { name, url };
    try {
      await page.goto(`${BASE_URL}${url}`, { waitUntil: "networkidle", timeout: 30000 });
      // Frappe desk renders async even after networkidle; give it a moment.
      await page.waitForTimeout(1200);

      const text = await page.evaluate(() => document.body.innerText);
      entry.text = text;

      await page.screenshot({
        path: path.join(screenshotsRoot, `${name}.png`),
        fullPage: true,
      });
      entry.screenshot = `${name}.png`;
    } catch (e) {
      entry.error = String(e);
    }
    results.push(entry);
  }

  await browser.close();

  const reportPath = path.join(screenshotsRoot, "capture-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Done. Report at ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
