const { createRequire } = require('node:module');
const fs = require('node:fs');
const { chromium } = createRequire(process.env.PLAYWRIGHT_RUNTIME + '/package.json')('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], responses = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (/\.glb/.test(r.url())) responses.push({ url: r.url(), status: r.status() }); });
  await page.goto('http://127.0.0.1:5173/?qa');
  await page.waitForFunction(() => document.querySelector('#model-status').dataset.state === 'loaded', { timeout: 120000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'docs/evidence/08a-initial.png' });
  const info = await page.evaluate(() => window.sceneQA.modelInfo);
  const positions = () => page.locator('.label').evaluateAll(es => es.map(e => [parseFloat(e.style.left), parseFloat(e.style.top)]));
  const initial = await positions();
  await page.mouse.move(650, 520); await page.mouse.down(); await page.mouse.move(920,530,{steps:20}); await page.mouse.up();
  await page.waitForTimeout(1200); const orbit = await positions();
  await page.mouse.wheel(0,-350); await page.waitForTimeout(1200); const zoom = await positions();
  await page.getByRole('button',{name:'重置视角'}).click(); await page.waitForTimeout(1200); const reset = await positions();
  for (const [name, position] of [['front',[0,2.4,8]], ['side',[8,2.0,1.05]], ['other-side',[-8,2,1.05]]]) {
    await page.evaluate(p => { const {camera,controls}=window.sceneQA; controls.enableDamping=false; controls.target.set(-.45,1.6,1.05); camera.position.set(...p); controls.update(); },position);
    await page.waitForTimeout(700); await page.screenshot({path:`docs/evidence/08a-${name}.png`});
  }
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#model-status').dataset.state === 'loaded', { timeout: 120000 });
  const delta = (a,b) => Math.max(...a.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-b[i][j]))));
  const result = { info, labels: await page.locator('.label').count(), orbitDelta:delta(initial,orbit), zoomDelta:delta(orbit,zoom), resetDelta:delta(initial,reset), reloadLoaded:true, errors:[...errors], responses:[...responses] };
  await page.route('**/models/yaya.glb', route => route.fulfill({status:404,body:'QA missing asset'}));
  await page.reload(); await page.waitForFunction(()=>document.querySelector('#model-status').dataset.state==='error');
  result.failure = { message:await page.locator('#model-status').textContent(), retainedLabels:await page.locator('.label').count() };
  fs.writeFileSync('docs/evidence/08a-results.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2)); await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
