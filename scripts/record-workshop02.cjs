// Records real browser frames; reconstructions are explicitly labelled.
// Requires the existing external Playwright runtime; does not modify scene source.
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const {spawn} = require('node:child_process');
const {chromium} = createRequire(process.env.PLAYWRIGHT_RUNTIME + '/package.json')('playwright');
const root = process.cwd();
const out = path.join(root,'docs/evidence/gifs');
const frameRoot = fs.mkdtempSync('/tmp/workshop02-record-');
const report = {date:new Date().toISOString(),frameRoot,clips:[],errors:[],responses:[]};
const ids=['model','tree','nest','lantern','basket','bowl','stool','stone','daisy'];
let page, clip;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function label(text) {
  await page.evaluate(text=>{
    let el=document.getElementById('recording-caption');
    if(!el){el=document.createElement('div');el.id='recording-caption';el.style.cssText='position:fixed;top:18px;right:20px;z-index:100;max-width:425px;padding:12px 16px;background:#fffdf6ee;border:1px solid #a2b58a;border-radius:12px;color:#344d35;font:14px/1.6 sans-serif;white-space:pre-line;pointer-events:none';document.body.append(el);}
    el.textContent=text;
  },text);
}
async function start(name,type){clip={name,type,frames:[]};report.clips.push(clip);fs.mkdirSync(path.join(frameRoot,name));}
async function shot(duration=250){
  await pause(90);
  const file=path.join(frameRoot,clip.name,`${String(clip.frames.length).padStart(4,'0')}.png`);
  await page.screenshot({path:file});clip.frames.push({file,duration});
}
async function ready(list=ids){await page.waitForFunction(list=>list.every(k=>document.querySelector('#'+k+'-status').dataset.state==='loaded'),list,{timeout:180000});}
async function drag(){await page.mouse.move(470,430);await page.mouse.down();for(let i=1;i<=12;i++){await page.mouse.move(470+i*12,430+i*1.5);await shot();}await page.mouse.up();}
async function reset(){await page.getByRole('button',{name:'重置视角'}).click();await pause(400);}
async function track(p){p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});p.on('response',r=>{if(r.url().includes('.glb'))report.responses.push({url:r.url(),status:r.status()})});}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 report.browser=browser.version();
 try{
   // Hold real requests to expose existing placeholders, then release only Yaya.
   const demo=await browser.newContext({viewport:{width:1000,height:800}});
   const pending=new Map();
   await demo.route('**/*.glb',route=>new Promise(resolve=>pending.set(new URL(route.request().url()).pathname,{route,resolve})));
   page=await demo.newPage();await track(page);
   await page.goto('http://127.0.0.1:5173/?qa',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.sceneQA && document.querySelectorAll('.label').length===7);
   await start('w02-s07-basic-reenactment','教学重演：暂缓真实 GLB 请求，使用当前代码保留的占位几何；非历史初建录像');
   await label('教学重演 · 基础空间\n暂缓模型请求，观察地面、占位与灯光');await shot(1800);
   await label('教学重演 · 基础空间\n鼠标拖动：检查物件间的空地');await drag();
   await reset();await label('教学重演 · 基础空间\n点击「重置视角」，恢复全景');await shot(1600);
   await start('w02-s08-yaya-reenactment','教学重演：解除芽芽真实 GLB 请求暂停；非首次开发录像，等待时间经过剪辑');
   await label('教学重演 · 导入芽芽\n此时仍是占位；只释放芽芽的真实 GLB 请求');await shot(1700);
   const y=pending.get('/models/yaya.glb');if(!y)throw Error('Yaya request not found');await y.route.continue();y.resolve();
   await label('教学重演 · 导入芽芽\n等待真实模型下载与解析（等待时间剪辑）');await shot(600);
   await ready(['model']);
   await label('教学重演 · 导入芽芽\n真实 GLB 已显示，对应占位与标签已移除');await shot(2200);
   await label('教学重演 · 导入芽芽\n拖动检查比例、朝向与接地');await drag();await reset();await shot(1200);
   report.yayaReenactment={loaded:await page.locator('#model-status').textContent(),remainingLabels:await page.locator('.label').count()};
   await demo.close();
   // A clean normal page, no route interception.
   const normal=await browser.newContext({viewport:{width:1000,height:800}});
   page=await normal.newPage();await track(page);
   await page.goto('http://127.0.0.1:5173/?qa',{waitUntil:'domcontentloaded'});await ready();
   const positions=()=>page.evaluate(()=>sceneQA.camera.position.toArray());
   const initial=await positions();
   await start('w02-current-observation','本轮真实浏览器操作；抽帧并调整停留时长，不用于性能计时');
   await label('当前场景 · 真实浏览器操作\n9 个独立模型已加载，开始环绕观察');await shot(1800);await drag();
   const orbit=await positions();
   await label('当前场景 · 真实浏览器操作\n滚轮缩放：查看角色与生活区');
   for(let i=0;i<6;i++){await page.mouse.wheel(0,-45);await pause(200);await shot();}
   const zoom=await positions();await shot(1200);
   await reset();await label('当前场景 · 真实浏览器操作\n点击「重置视角」，恢复初始全景');await shot(1800);
   const resetPosition=await positions();
   const delta=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
   report.controls={orbitDelta:delta(initial,orbit),zoomDelta:delta(orbit,zoom),resetDelta:delta(initial,resetPosition)};
   if(report.controls.orbitDelta<.1||report.controls.zoomDelta<.1||report.controls.resetDelta>.1)throw Error('Controls check failed');
   // Use saved historical positions for stones only. Other assets stay current.
   const before=JSON.parse(fs.readFileSync('docs/evidence/08g-results.json','utf8')).info.stone.positions;
   const after=await page.evaluate(()=>sceneQA.stoneInfo.positions);
   await page.evaluate(()=>{window.recordStoneOriginals=Array.from({length:5},(_,i)=>{const m=sceneQA.scene.getObjectByName(`踏脚石 ${i+1}`);return {position:m.position.toArray(),yaw:m.rotation.y};});});
   await start('w02-s09-path-reenactment','教学重演：石头采用 08g-results.json 历史位置与当前位置；其他物件保持当前布局；过渡动画仅用于教学');
   async function pathAt(t){await page.evaluate(({before,after,t})=>{for(let i=0;i<5;i++){const m=sceneQA.scene.getObjectByName(`踏脚石 ${i+1}`),o=recordStoneOriginals[i];m.position.set(o.position[0]+(before[i][0]-after[i][0])*(1-t),o.position[1],o.position[2]+(before[i][1]-after[i][1])*(1-t));}}, {before,after,t});}
   await pathAt(0);await label('教学重演 · 路径微调（相同相机）\n石头使用 Step 08G 旧坐标；其他物件保持当前布局');await shot(2300);
   await label('教学重演 · 路径微调（相同相机）\n五块石头逐步移到当前布局；过渡仅为演示');
   for(let i=1;i<=12;i++){await pathAt(i/12);await shot(180);}
   await label('教学重演 · 路径微调（相同相机）\n已恢复当前坐标；观察路线与窝口的关系');await shot(2600);
   report.path={before,after,restored:true};
   // User authorized restart. Require explicit PID so no unrelated server is killed.
   if(process.env.RESTART_PID){
     await start('w02-s10-restart','本轮真实停止/启动服务与刷新；浏览器字幕说明状态，非终端全程录屏；等待时间剪辑');
     await label('本轮实录 · 服务重启\n当前场景已加载；接下来停止本项目的开发服务');await shot(1700);
     const pid=Number(process.env.RESTART_PID);process.kill(pid,'SIGTERM');await pause(1500);
     let offline=false;try{await fetch('http://127.0.0.1:5173/')}catch{offline=true;}
     if(!offline)throw Error('Old server still responds');report.restart={oldPid:pid,offlineConfirmed:true};
     await label('本轮实录 · 服务重启\n服务已停止：本地请求失败\n已打开的页面仍保留旧画面，这不代表服务在线');await shot(2200);
     const log=fs.openSync(path.join(out,'restart-server.log'),'a');
     const proc=spawn('npm',['run','dev'],{cwd:root,detached:true,stdio:['ignore',log,log]});proc.unref();fs.closeSync(log);
     report.restart.newPid=proc.pid;
     for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:5173/')).ok)break;}catch{}await pause(200);}
     await label('本轮实录 · 服务重启\nnpm run dev 已恢复服务；现在刷新页面');await shot(1600);
     await page.reload({waitUntil:'domcontentloaded'});
     await label('本轮实录 · 服务重启\n刷新后重新请求模型（等待时间剪辑）');await shot(600);await ready();
     report.restart.loaded=await page.locator('.asset-statuses').innerText();
     await label('本轮实录 · 服务重启\n9 项加载成功；拖动确认观察操作');await shot(1600);await drag();
     await page.mouse.wheel(0,-150);await pause(500);await shot(700);await reset();
     await label('本轮实录 · 服务重启\n缩放、重置后恢复全景；完成');await shot(1800);report.restart.completed=true;
   }
   report.statuses=await page.locator('.asset-statuses').innerText();
   await page.screenshot({path:path.join(out,'current-final.png')});
 }finally{fs.writeFileSync(path.join(out,'recording-manifest.json'),JSON.stringify(report,null,2));await browser.close();}
 console.log(JSON.stringify({frameRoot,clips:report.clips.map(c=>({name:c.name,frames:c.frames.length})),controls:report.controls,restart:report.restart,errors:report.errors},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
