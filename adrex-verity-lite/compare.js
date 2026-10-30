
const ids=["a","b","c","d"],names=["Model A","Model B","Model C","Model D"];
const questionEl=document.getElementById("question"),resultEl=document.getElementById("result");
document.getElementById("compare").onclick=compare;document.getElementById("clear").onclick=clearAll;document.getElementById("back").onclick=()=>window.close();
chrome.storage.local.get(["compareQuestion"],d=>{if(d.compareQuestion){questionEl.value=d.compareQuestion;chrome.storage.local.remove("compareQuestion");}});
const STOP=new Set(["the","a","an","and","or","but","is","are","was","were","be","been","to","of","in","on","for","with","by","from","as","at","that","this","it","its","their","there","has","have","had","can","could","will","would","should","may","might","not","no","yes","if","then","than","so","such","about","into","over","after","before","between","more","most","some","any","all","every","each"]);
const tokenize=t=>t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w=>w.length>3&&!STOP.has(w));
function sentences(t){return t.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>30)}
function compare(){
 const answers=ids.map(id=>document.getElementById(id).value.trim());
 const filled=answers.filter(x=>x.length>20);
 if(filled.length<2){alert("Paste at least two AI answers to compare.");return}
 const sets=answers.map(a=>new Set(tokenize(a)));
 let pairScores=[];
 for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++){
  if(!answers[i]||!answers[j])continue;
  const a=sets[i],b=sets[j];let inter=0;a.forEach(w=>{if(b.has(w))inter++});
  const union=new Set([...a,...b]).size;
  pairScores.push(union?Math.round(inter/union*100):0);
 }
 const avg=pairScores.length?Math.round(pairScores.reduce((x,y)=>x+y,0)/pairScores.length):0;
 const cons=document.getElementById("consensus"),note=document.getElementById("consensusNote");
 if(avg>=60){cons.textContent="Strong consensus";cons.className="good";note.textContent="The models use highly similar key ideas. Still verify important claims with sources."}
 else if(avg>=35){cons.textContent="Partial consensus";cons.className="warn";note.textContent="The models agree on some points but differ in details or emphasis. Review the differences carefully."}
 else{cons.textContent="Low consensus";cons.className="bad";note.textContent="The models differ substantially. Treat this as conflicting information and verify with authoritative sources."}
 // shared words
 let all=answers.filter(Boolean).map(a=>new Set(tokenize(a)));
 let shared=[];if(all.length){const first=all[0];first.forEach(w=>{if(all.every(s=>s.has(w)))shared.push(w)})}
 const ul=document.getElementById("shared");ul.innerHTML="";
 if(shared.length){shared.slice(0,20).forEach(w=>{const li=document.createElement("li");li.textContent=w;ul.appendChild(li)})}else ul.innerHTML=`<li class="empty">No strong shared key terms found.</li>`;
 // unique sentences
 const uniqueEl=document.getElementById("unique");uniqueEl.innerHTML="";
 answers.forEach((ans,i)=>{if(!ans)return;const others=answers.filter((x,j)=>j!==i&&x).map(x=>new Set(tokenize(x)));
  const sents=sentences(ans).slice(0,5);
  sents.forEach(s=>{const words=new Set(tokenize(s));if(!words.size)return;let overlap=0;words.forEach(w=>{if(others.some(o=>o.has(w)))overlap++});
   const uniq=Math.round((1-overlap/words.size)*100);
   if(uniq>=70){const d=document.createElement("div");d.className="unique-item";d.innerHTML=`<b>${names[i]} • ${uniq}% unique</b>${esc(s)}`;uniqueEl.appendChild(d)}});
 });
 if(!uniqueEl.children.length)uniqueEl.innerHTML=`<div class="empty">No strongly unique points detected.</div>`;
 resultEl.classList.remove("hidden");
}
function clearAll(){ids.forEach(id=>document.getElementById(id).value="");questionEl.value="";resultEl.classList.add("hidden")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
