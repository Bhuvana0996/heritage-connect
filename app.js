const places=[
 {name:'Old Joo Chiat Story House',cat:'history',label:'LOCAL STORY',desc:'A community-led story stop exploring how Joo Chiat changed from village life to today’s cultural precinct.',distance:'0.8 km',story:'Then & Now: hear a resident’s memory of the street before redevelopment.'},
 {name:'Geylang Serai Food Stories',cat:'food',label:'FOOD & TRADITION',desc:'Discover the people, recipes and traditions behind one of Singapore’s most culturally rich food areas.',distance:'1.4 km',story:'Meet the makers: trace one dish from family recipe to modern Singapore.'},
 {name:'Katong Paper Craft Studio',cat:'craft',label:'MADE IN SG',desc:'A small studio keeping traditional paper craft techniques alive through hands-on community workshops.',distance:'2.1 km',story:'Try it yourself: learn a paper craft technique and add your creation to the community wall.'}
];
const events=[
 {title:'Traditional Wayang Workshop',date:'SAT · 12 SEP · 2:00 PM',place:'Kampong Glam',price:15,eligible:true,cat:'arts',desc:'Learn the basics of a traditional performance art through a hands-on session.'},
 {title:'Stories of Old Katong',date:'SUN · 13 SEP · 10:30 AM',place:'Katong',price:0,eligible:false,cat:'history',desc:'A guided walk led by community storytellers through overlooked neighbourhood histories.'},
 {title:'Peranakan Food & Family Recipes',date:'SAT · 19 SEP · 4:00 PM',place:'Joo Chiat',price:25,eligible:true,cat:'food',desc:'Cook, taste and hear the family stories behind three classic Peranakan dishes.'}
];
let balance=100,points=180,completed=2;
function renderPlaces(filter='all'){
 const grid=document.querySelector('#placeGrid'); if(!grid)return;
 const data=filter==='all'?places:places.filter(p=>p.cat===filter);
 grid.innerHTML=data.map(p=>`<article class="place-card"><div class="place-image"><span class="tag">${p.label}</span></div><div class="place-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="meta"><span>📍 ${p.distance}</span><span>${p.cat}</span></div><button class="small-btn" onclick="showToast('${p.story.replaceAll("'","\\'")}')">Discover story →</button></div></article>`).join('');
}
function renderEvents(passOnly=false){
 const grid=document.querySelector('#eventGrid'); if(!grid)return;
 const data=passOnly?events.filter(e=>e.eligible):events;
 grid.innerHTML=data.map(e=>`<article class="event-card"><span class="event-date">${e.date}</span><h3>${e.title}</h3><p>${e.desc}</p><div class="meta"><span>📍 ${e.place}</span><span>$${e.price}</span></div><div class="event-bottom">${e.eligible?'<span class="eligible">CULTURE PASS</span>':'<span class="eligible" style="visibility:hidden">PASS</span>'}<button class="primary" onclick="bookEvent('${e.title.replaceAll("'","\\'")}',${e.price},${e.eligible})">${e.price===0?'Join free':'Book'}</button></div></article>`).join('');
}
function bookEvent(title,price,eligible){
 if(eligible&&price>balance){showToast('Not enough demo Culture Pass credit.');return}
 if(eligible){balance-=price;updateBalance()}
 showToast(`Added “${title}” to your journey ✓`); completed++; const c=document.querySelector('#completedCount');if(c)c.textContent=completed;
}
function updateBalance(){document.querySelectorAll('#miniBalance,#statsBalance').forEach(x=>x.textContent=`$${balance}`)}
function showToast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),3200)}
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));document.querySelector(`#${id}`).classList.add('active-view');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-view]').forEach(b=>{if(!b.classList.contains('nav-btn'))b.addEventListener('click',()=>showView(b.dataset.view))});
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{showView('home');setTimeout(()=>document.querySelector('#'+b.dataset.scroll).scrollIntoView({behavior:'smooth'}),50)}));
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');renderPlaces(c.dataset.interest)}));
document.querySelector('#passOnly')?.addEventListener('click',e=>{e.classList.toggle('selected');renderEvents(e.classList.contains('selected'));e.textContent=e.classList.contains('selected')?'Show all happenings':'Show Culture Pass eligible'});
document.querySelector('#challengeBtn')?.addEventListener('click',()=>{points+=50;completed++;document.querySelector('#points').textContent=points;document.querySelector('#completedCount').textContent=completed;showToast('Then & Now challenge started — +50 points!')});
renderPlaces();renderEvents();updateBalance();
