
const STOP=new Set(["the","a","an","and","or","but","is","are","was","were","be","been","to","of","in","on","for","with","by","from","as","at","that","this","it","its","their","there","has","have","had","can","could","will","would","should","may","might","not","no","yes","if","then","than","so","such","about","into","over","after","before","between","more","most","some","any","all","every","each"]);
const names=["ChatGPT","Claude","Gemini","Grok / Other"];const ids=["a1","a2","a3","a4"];
const compareBtn=document.getElementById("compare"),clearBtn=document.getElementById("clear"),exportBtn=document.getElementById("exportCompare"),statusEl=document.getElementById("status"),resultEl=document.getElementById("result");
compareBtn.onclick=compare;clearBtn.onclick=()=>{ids.forEach(i=>document.getElementById(i).value="");document.getElementById("question").value="";resultEl.classList.add("hidden")};exportBtn.onclick=exportReport;
chrome.storage.local.get(["compareSeed"],d=>{if(d.compareSeed){document.getElementById("a1").value=d.compareSeed;chrome.storage.local.remove("compareSeed")}});
const tokenize=t=>t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w=>w.length>2&&!STOP.has(w));
const sentences=t=>t.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>30);
function similarity(a,b){const A=new Set(tokenize(a)),B=new Set(tokenize(b));if(!A.size||!B.size)return 0;let inter=0;A.forEach(w=>{if(B.has(w))inter++});return Math.round(2*inter/(A.size+B.size)*100)}
function compare(){const texts=ids.map(i=>document.getElementById(i).value.trim());const filled=texts.map((t,i)=>({name:names[i],text:t})).filter(x=>x.text);
if(filled.length<2)return showStatus("Paste at least two AI answers to compare.");
showStatus("Comparing answers locally…");const pairs=[];let total=0,count=0;
for(let i=0;i<filled.length;i++)for(let j=i+1;j<filled.length;j++){const sim=similarity(filled[i].text,filled[j].text);pairs.push({a:filled[i].name,b:filled[j].name,sim});total+=sim;count++}
const avg=Math.round(total/count);const consensus=[];const conflicts=[];
const base=filled[0];base.text&&sentences(base.text).forEach(s=>{let matches=1;filled.slice(1).forEach(o=>{if(o.text&&sentences(o.text).some(os=>similarity(s,os)>=45))matches++});if(matches>=Math.ceil(filled.length*0.7)&&consensus.length<6)consensus.push(s)});
filled.forEach(f=>{if(/cure|guaranteed|100%|always|never|miracle/i.test(f.text))conflicts.push(`${f.name} contains absolute or high-risk language.`)});
if(avg<35)conflicts.push("The answers differ substantially. Treat this as low consensus and verify important claims independently.");
render(pairs,avg,consensus,conflicts);statusEl.classList.add("hidden")}
function render(pairs,avg,consensus,conflicts){resultEl.classList.remove("hidden");const p=document.getElementById("pairs");p.innerHTML="";
pairs.forEach(x=>{const d=document.createElement("div");d.className="pair";const cls=x.sim>=60?"high":x.sim>=35?"medium":"low";const label=x.sim>=60?"Strong agreement":x.sim>=35?"Partial agreement":"Low agreement";
d.innerHTML=`<b>${x.a} ↔ ${x.b}</b><span class="sim ${cls}">${x.sim}% • ${label}</span>`;p.appendChild(d)});
const overall=document.createElement("div");overall.className="pair";overall.innerHTML=`<b>Overall consensus</b><span class="sim ${avg>=60?"high":avg>=35?"medium":"low"}">${avg}%</span>`;p.prepend(overall);
const c=document.getElementById("consensus");c.innerHTML="";if(!consensus.length)c.innerHTML=`<div class="point">No strong cross-model consensus detected.</div>`;
consensus.forEach(s=>{const d=document.createElement("div");d.className="point";d.textContent=s;c.appendChild(d)});
const cf=document.getElementById("conflicts");cf.innerHTML="";if(!conflicts.length)cf.innerHTML=`<div class="point">No obvious conflicts detected. Still verify important claims.</div>`;
conflicts.forEach(s=>{const d=document.createElement("div");d.className="point";d.textContent=s;cf.appendChild(d)});window.__compare={pairs,avg,consensus,conflicts}}
function showStatus(m){statusEl.textContent=m;statusEl.classList.remove("hidden")}
function exportReport(){const q=document.getElementById("question").value.trim()||"Untitled question";const c=window.__compare;if(!c)return showStatus("Run a comparison first.");
let md=`# Adrex Verity Comparison Report\n\n**Question:** ${q}\n\n**Overall consensus:** ${c.avg}%\n\n## Pairwise agreement\n\n`;c.pairs.forEach(p=>md+=`- ${p.a} ↔ ${p.b}: ${p.sim}%\n`);
md+="\n## Consensus points\n\n";(c.consensus.length?c.consensus:["No strong consensus."]).forEach(s=>md+=`- ${s}\n`);
md+="\n## Conflicts and differences\n\n";(c.conflicts.length?c.conflicts:["No obvious conflicts."]).forEach(s=>md+=`- ${s}\n`);
const blob=new Blob([md],{type:"text/markdown"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="adrex-verity-comparison.md";a.click()}
