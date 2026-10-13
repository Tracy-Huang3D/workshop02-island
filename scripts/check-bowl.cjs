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
    const ready=()=>page.waitForFunction(()=>['model-status','tree-status','nest-status','lantern-status','basket-status','bowl-status'].every(id=>document.getElementById(id).dataset.state==='loaded'),null,{timeout:120000});
    await page.goto('http://127.0.0.1:5173/?qa'); await ready();
    await page.waitForTimeout(1200);
    await page.screenshot({path:'docs/evidence/08f-initial.png'});
    const info=await page.evaluate(()=>({bowl:sceneQA.bowlInfo,basket:sceneQA.basketInfo,lantern:sceneQA.lanternInfo,nest:sceneQA.nestInfo,tree:sceneQA.treeInfo,yaya:sceneQA.modelInfo}));
    const positions=()=>page.locator('.label').evaluateAll(es=>es.map(e=>[parseFloat(e.style.left),parseFloat(e.style.top)]));
    const initial=await positions(); assert.equal(initial.length,1);
    await page.mouse.move(650,520); await page.mouse.down(); await page.mouse.move(930,530,{steps:20}); await page.mouse.up();
    await page.waitForTimeout(1000); const orbit=await positions();
    await page.screenshot({path:'docs/evidence/08f-orbit.png'});
    await page.mouse.wheel(0,-350); await page.waitForTimeout(1000); const zoom=await positions();
    await page.getByRole('button',{name:'重置视角'}).click(); await page.waitForTimeout(1000); const reset=await positions();
    for(const [name,pos] of [['detail',[5,3.6,7]],['side',[8,1.3,1.45]]]) {
      await page.evaluate(p=>{const{camera,controls}=sceneQA;controls.enableDamping=false;controls.target.set(3.3,.8,1.25);camera.position.set(...p);controls.update();},pos);
      await page.waitForTimeout(700); await page.screenshot({path:`docs/evidence/08f-${name}.png`});
    }
    await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(1000);
    await page.screenshot({path:'docs/evidence/08f-mobile.png'});
    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth);
    await page.reload(); await ready();
    const delta=(a,b)=>Math.max(...a.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-b[i][j]))));
    const result={info,labels:await page.locator('.label').count(),orbitDelta:delta(initial,orbit),zoomDelta:delta(orbit,zoom),resetDelta:delta(initial,reset),noOverflow,reloadLoaded:true,errors:[...errors],responses:[...responses]};
    assert.ok(result.orbitDelta>1); assert.ok(result.zoomDelta>1); assert.ok(result.resetDelta<1); assert.deepEqual(result.errors,[]);
    await page.route('**/models/leaf-bowl.glb',route=>route.fulfill({status:404,body:'QA missing bowl'}));
    await page.reload();
    await page.waitForFunction(()=>document.querySelector('#bowl-status').dataset.state==='error'&&['model-status','tree-status','nest-status','lantern-status','basket-status'].every(id=>document.getElementById(id).dataset.state==='loaded'),null,{timeout:120000});
    result.failure={message:await page.locator('#bowl-status').textContent(),labels:await page.locator('.label').count(),yayaLoaded:true};
    assert.equal(result.failure.labels,2);
    fs.writeFileSync('docs/evidence/08f-results.json',JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
