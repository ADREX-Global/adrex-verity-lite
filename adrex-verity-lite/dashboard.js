
const itemsEl=document.getElementById("items"),searchEl=document.getElementById("search"),filterEl=document.getElementById("filter"),statsEl=document.getElementById("stats");
document.getElementById("refresh").onclick=load;searchEl.oninput=load;filterEl.onchange=load;
document.getElementById("exportAll").onclick=exportAll;
load();
async function load(){
 const s=await chrome.storage.local.get({vault:[]});let v=s.vault||[];
 const q=searchEl.value.toLowerCase();const f=filterEl.value;
 if(q)v=v.filter(x=>(x.answer+" "+x.claims.join(" ")).toLowerCase().includes(q));
 if(f==="high")v=v.filter(x=>x.score>=75);if(f==="medium")v=v.filter(x=>x.score>=55&&x.score<75);if(f==="low")v=v.filter(x=>x.score<55);
 const total=(await chrome.storage.local.get({vault:[]})).vault.length;
 const high=v.filter(x=>x.score>=75).length,medium=v.filter(x=>x.score>=55&&x.score<75).length,low=v.filter(x=>x.score<55).length;
 statsEl.innerHTML=`<div class="stat"><b>${total}</b><span>Total saved checks</span></div><div class="stat"><b>${high}</b><span>Mostly supported</span></div><div class="stat"><b>${medium}</b><span>Needs verification</span></div><div class="stat"><b>${low}</b><span>High risk</span></div>`;
 itemsEl.innerHTML="";
 if(!v.length){itemsEl.innerHTML=`<div class="empty">No saved checks match your search or filter.</div>`;return}
 v.forEach((x,i)=>{const d=document.createElement("div");d.className="item";
  const cls=x.score>=75?"high":x.score>=55?"medium":"low";const label=x.score>=75?"Mostly supported":x.score>=55?"Needs verification":"High risk";
  d.innerHTML=`<h3>${esc(x.claims[0]||"Saved AI answer")}</h3><div class="meta">${new Date(x.date).toLocaleString()}</div><span class="badge ${cls}">${x.score}/100 • ${label}</span><p>${esc(x.answer.slice(0,260))}…</p><button class="delete" data-i="${i}">Delete</button>`;
  itemsEl.appendChild(d)});
 itemsEl.querySelectorAll(".delete").forEach(b=>b.onclick=async()=>{const s=await chrome.storage.local.get({vault:[]});const v=s.vault||[];v.splice(+b.dataset.i,1);await chrome.storage.local.set({vault:v});load()});
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function exportAll(){
 const s=await chrome.storage.local.get({vault:[]});const v=s.vault||[];
 let md=`# Adrex Verity Dashboard Export\n\n**Exported:** ${new Date().toLocaleString()}\n\n**Total checks:** ${v.length}\n\n---\n\n`;
 v.forEach((x,i)=>{md+=`## Check ${i+1}\n\n**Date:** ${new Date(x.date).toLocaleString()}\n\n**Trust Score:** ${x.score}/100\n\n**Answer:** ${x.answer}\n\n**Claims:**\n\n`;x.claims.forEach((c,j)=>md+=`${j+1}. ${c}\n`);md+="\n**Evidence:**\n\n";if(!x.sources.length)md+="No sources saved.\n";x.sources.forEach(src=>md+=`- [${src.title}](${src.url}) — ${src.quality.toUpperCase()}, ${src.relevance}% match\n`);md+="\n---\n\n"});
 const blob=new Blob([md],{type:"text/markdown"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="adrex-verity-dashboard-export.md";a.click();
}
