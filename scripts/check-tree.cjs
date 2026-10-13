const { createRequire } = require('node:module');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = createRequire(process.env.PLAYWRIGHT_RUNTIME + '/package.json')('playwright');
(async () => {
  const browser = await chromium.launch({headless:true,channel:'chrome'});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[], responses=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
    page.on('response',r=>{if(/\.glb/.test(r.url())) responses.push({url:r.url(),status:r.status()});});
    const ready=()=>page.waitForFunction(()=>['model-status','tree-status'].every(id=>document.getElementById(id).dataset.state==='loaded'),null,{timeout:120000});
    await page.goto('http://127.0.0.1:5173/?qa'); await ready();
    await page.waitForTimeout(1200);
    await page.screenshot({path:'docs/evidence/08b-initial.png'});
    const info=await page.evaluate(()=>({tree:sceneQA.treeInfo,yaya:sceneQA.modelInfo}));
    const positions=()=>page.locator('.label').evaluateAll(es=>es.map(e=>[parseFloat(e.style.left),parseFloat(e.style.top)]));
    const initial=await positions(); assert.equal(initial.length,5);
    await page.mouse.move(650,520); await page.mouse.down(); await page.mouse.move(930,530,{steps:20}); await page.mouse.up();
    await page.waitForTimeout(1000); const orbit=await positions();
    await page.screenshot({path:'docs/evidence/08b-orbit.png'});
    await page.mouse.wheel(0,-350); await page.waitForTimeout(1000); const zoom=await positions();
    await page.getByRole('button',{name:'重置视角'}).click(); await page.waitForTimeout(1000); const reset=await positions();
    for(const [name,pos] of [['roots',[-5,2.2,7]],['side',[-8,3,-.5]]]) {
      await page.evaluate(p=>{const{camera,controls}=sceneQA;controls.enableDamping=false;controls.target.set(-2.25,1.8,-1.2);camera.position.set(...p);controls.update();},pos);
      await page.waitForTimeout(700); await page.screenshot({path:`docs/evidence/08b-${name}.png`});
    }
    await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(1000);
    await page.screenshot({path:'docs/evidence/08b-mobile.png'});
    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth);
    await page.reload(); await ready();
    const delta=(a,b)=>Math.max(...a.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-b[i][j]))));
    const result={info,labels:await page.locator('.label').count(),orbitDelta:delta(initial,orbit),zoomDelta:delta(orbit,zoom),resetDelta:delta(initial,reset),noOverflow,reloadLoaded:true,errors:[...errors],responses:[...responses]};
    assert.ok(result.orbitDelta>1); assert.ok(result.zoomDelta>1); assert.ok(result.resetDelta<1); assert.deepEqual(result.errors,[]);
    await page.route('**/models/forest-tree.glb',route=>route.fulfill({status:404,body:'QA missing tree'}));
    await page.reload();
    await page.waitForFunction(()=>document.querySelector('#tree-status').dataset.state==='error'&&document.querySelector('#model-status').dataset.state==='loaded',null,{timeout:120000});
    result.failure={message:await page.locator('#tree-status').textContent(),labels:await page.locator('.label').count(),yayaLoaded:true};
    assert.equal(result.failure.labels,6);
    fs.writeFileSync('docs/evidence/08b-results.json',JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
