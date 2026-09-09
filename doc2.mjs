import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
await page.goto('https://tripjack.com/page/api-doc', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(5000);
// click the Static Detail nav entry
const links = await page.$$('a,li,button');
for (const l of links) {
  const t = (await l.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  if (/^GET\s+Static Detail$|^Static Detail$/.test(t)) { await l.click().catch(()=>{}); break; }
}
await page.waitForTimeout(4000);
const txt = await page.evaluate(() => document.body.innerText);
const i = txt.indexOf('static-detail');
console.log(txt.slice(Math.max(0, i - 2500), i + 9000));
await browser.close();
