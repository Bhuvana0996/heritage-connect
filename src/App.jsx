import React,{useEffect,useMemo,useState} from 'react';
import {Search,MapPin,Bookmark,Compass,ArrowLeft,ArrowRight,ExternalLink,MessageCircle,Send,Utensils,BookOpen,Ticket,Heart,ChevronRight,Globe2,X,Users,User,Navigation,Share2,Clock,Filter,Check} from 'lucide-react';
import './styles-v2.css';
import {IMG,places,foods,cultures,learnCards,areas,themes} from './data';

const EVENTS='https://www.sgculturepass.gov.sg/events';

function loadJSON(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

function SafeImage({src,alt,className=''}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  if(failed) return <div className={'imageFallback '+className} role="img" aria-label={alt}><span>Image unavailable</span></div>;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>;
}

function App(){
  const [page,setPage]=useState('home');
  const [detail,setDetail]=useState(null);
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useState(()=>loadJSON('hc-saved',[]));
  const [prefs,setPrefs]=useState(()=>loadJSON('hc-prefs',[]));
  const [chat,setChat]=useState(false);
  const [toast,setToast]=useState('');
  const [plan,setPlan]=useState(null);
  const go=p=>{setDetail(null);setPage(p);window.scrollTo({top:0,behavior:'smooth'})};
  const toggleSave=id=>{setSaved(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];saveJSON('hc-saved',next);setToast(old.includes(id)?'Removed from saved':'Saved for later');setTimeout(()=>setToast(''),1800);return next})};
  const allItems=useMemo(()=>[...places,...foods,...cultures],[ ]);
  const searchResults=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return places;
    const terms=q.split(/\s+/).filter(Boolean);
    return places.filter(item=>{
      const hay=[item.name,item.area,item.tag,item.desc,item.story,...(item.facts||[]),...(item.themes||[])].join(' ').toLowerCase();
      return terms.every(t=>hay.includes(t));
    });
  },[query]);
  const openSearch=e=>{setQuery(e.target.value);setPage('places');setDetail(null)};
  return <div className="app">
    <header className="appHeader">
      <button className="brand" onClick={()=>go('home')}><b>HC</b><span>HERITAGE<br/>CONNECT</span></button>
      <nav>{[['home','Discover',Compass],['places','Explore',MapPin],['food','Food',Utensils],['cultures','Culture',Globe2],['learn','Learn',BookOpen],['events','Do',Ticket],['profile','Me',User]].map(([p,l,I])=><button key={p} className={page===p?'active':''} onClick={()=>go(p)}><I size={15}/>{l}</button>)}</nav>
      <div className="headerActions">
        <div className="search"><Search size={16}/><input value={query} onChange={openSearch} placeholder="Search places, food, stories"/></div>
        <button className="savedTop" onClick={()=>go('saved')}><Bookmark size={17}/><i>{saved.length}</i></button>
      </div>
    </header>
    {detail?<Detail item={detail} back={()=>setDetail(null)} save={toggleSave} saved={saved} go={go} open={setDetail}/>:<main>
      {page==='home'&&<Home go={go} open={setDetail} prefs={prefs} setPrefs={n=>{setPrefs(n);saveJSON('hc-prefs',n)}}/>}
      {page==='places'&&<Places items={searchResults} open={setDetail} save={toggleSave} saved={saved} query={query}/>}
      {page==='food'&&<Food open={setDetail} go={go}/>}
      {page==='cultures'&&<Cultures open={setDetail}/>}
      {page==='learn'&&<Learn open={setDetail} openChat={()=>setChat(true)} />}
      {page==='events'&&<Events/>}
      {page==='profile'&&<Profile saved={saved} prefs={prefs} setPrefs={n=>{setPrefs(n);saveJSON('hc-prefs',n)}} go={go} open={setDetail} save={toggleSave}/>}
      {page==='saved'&&<Saved ids={saved} save={toggleSave} open={setDetail}/>}
      {page==='plan'&&<Plan places={places} setPlan={setPlan} plan={plan} open={setDetail}/>}
    </main>}
    <Chatbot open={chat} setOpen={setChat} openItem={setDetail} go={go}/>
    <nav className="mobileNav">{[['home','Home',Compass],['places','Explore',MapPin],['food','Food',Utensils],['plan','Plan',Navigation],['profile','Me',User]].map(([p,l,I])=><button key={p} onClick={()=>go(p)} className={page===p?'active':''}><I/><span>{l}</span></button>)}</nav>
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

function Home({go,open,prefs,setPrefs}){
  const areasToShow=['Chinatown','Kampong Gelam','Little India','Balestier','Tiong Bahru','Joo Chiat & Katong'];
  const featured=places.slice(0,6);
  return <div className="home">
    <section className="welcome">
      <div><span className="eyebrow">YOUR SINGAPORE, UNLOCKED</span><h1>Stop scrolling.<br/><em>Start discovering.</em></h1><p>Explore places, food, people and stories — then turn what you learn into a real outing.</p><div className="heroBtns"><button className="primary" onClick={()=>go('places')}>Explore heritage <ArrowRight/></button><button className="ghost" onClick={()=>go('plan')}>Build an outing <Navigation/></button></div></div>
      <div className="levelCard"><div className="levelTop"><span><Compass/> Pick a place to start</span><b>{saved.length} saved</b></div><p>Save stories you want to visit, then use the planner to group places by area.</p><button onClick={()=>go('saved')}>View saved stories <ChevronRight/></button></div>
    </section>
    <section className="quickRow">{areasToShow.map(a=><button key={a} onClick={()=>{go('places');window.setTimeout(()=>document.querySelector('[data-area="'+a+'"]')?.click(),60)}}><MapPin/><b>{a}</b><small>Explore area</small></button>)}</section>
    <section className="interestBox"><div><span>PERSONALISE</span><h2>What do you want to notice?</h2><p>Your selections shape the recommendations in the planner and Guide.</p></div><div className="chips">{['Food','Architecture','Community','Migration','Wartime','Living heritage','Peranakan','Arts & film'].map(x=><button className={prefs.includes(x)?'on':''} key={x} onClick={()=>setPrefs(prefs.includes(x)?prefs.filter(y=>y!==x):[...prefs,x])}>{x}</button>)}</div></section>
    <section className="sectionBlock"><div className="sectionTitle"><div><span>START HERE</span><h2>Stories worth<br/>looking closer at.</h2></div><button onClick={()=>go('places')}>See everything <ArrowRight/></button></div><div className="discoverGrid">{featured.map((p,i)=><article key={p.id} className={i===0?'featured':''} onClick={()=>open(p)}><SafeImage src={p.image} alt={p.name}/><div className="cardShade"/><div className="cardText"><span>{p.tag}</span><h3>{p.name}</h3><p>{p.area} · {p.time}</p></div></article>)}</div></section>
    <section className="missionStrip"><div><span>MAKE THE STORY MEAN SOMETHING</span><h2>Learn something.<br/><em>Then look for it outside.</em></h2><p>Use the interactive story views, quick checks and outing planner to connect history with the places you can see today.</p><button className="primary" onClick={()=>go('learn')}>Try a quick explainer <ArrowRight/></button></div><div className="missionPreview"><div><BookOpen/><b>Quick explainers</b><small>Short, visual learning</small></div><div><Filter/><b>Area filters</b><small>Find nearby stories</small></div><div><Navigation/><b>Outing planner</b><small>Build a route</small></div></div></section>
    <section className="cultureHome"><div><span>ONE ISLAND. MANY STORIES.</span><h2>Explore culture<br/><em>through real places.</em></h2><button className="primary" onClick={()=>go('cultures')}>Explore culture stories <ArrowRight/></button></div><div className="cultureTiles">{cultures.slice(0,4).map(c=><article key={c.id} onClick={()=>open(c)}><SafeImage src={c.image} alt={c.name}/><b>{c.name}</b><small>{c.tag}</small></article>)}</div></section>
  </div>
}

function Places({items,open,save,saved,query}){
  const [area,setArea]=useState('All'),[theme,setTheme]=useState('All');
  const shown=items.filter(p=>(area==='All'||p.area.includes(area))&&(theme==='All'||(p.themes||[]).some(t=>t.toLowerCase()===theme.toLowerCase())));
  return <section className="page"><div className="pageHero"><span>EXPLORE · SEARCH · COMPARE</span><h1>Find the Singapore<br/><em>you walk past.</em></h1><p>{query?<>Showing stories matching <b>“{query}”</b>.</>:<>Browse by neighbourhood or theme. Historic community, cultural and religious places are included naturally in their wider neighbourhood stories.</>}</p><div className="filterPills"><span className="filterLabel">AREA</span>{areas.map(x=><button data-area={x} key={x} className={area===x?'active':''} onClick={()=>setArea(x)}>{x}</button>)}</div><div className="filterPills"><span className="filterLabel">THEME</span>{themes.map(x=><button key={x} className={theme===x?'active':''} onClick={()=>setTheme(x)}>{x}</button>)}</div></div>{shown.length?<div className="contentGrid">{shown.map(p=><article className="placeCard" key={p.id} onClick={()=>open(p)}><div className="imageWrap"><SafeImage src={p.image} alt={p.name}/><span>{p.tag}</span><button onClick={e=>{e.stopPropagation();save(p.id)}}>{saved.includes(p.id)?<Heart fill="currentColor"/>:<Bookmark/>}</button></div><div className="cardBody"><small>{p.area} · {p.time}</small><h2>{p.name}</h2><p>{p.desc}</p><div className="cardMeta"><span>{p.cost}</span><span>{(p.themes||[]).slice(0,3).join(' · ')}</span></div></div></article>)}</div>:<div className="empty"><Search/><h2>No matching stories.</h2><p>Try another area, theme or search term.</p></div>}</section>
}

function Food({open,go}){return <section className="page"><div className="pageHero"><span>FOOD IS HERITAGE</span><h1>Eat it.<br/><em>Then understand it.</em></h1><p>Food stories connect migration, neighbourhoods, everyday life and cultural exchange.</p></div><div className="contentGrid foodGrid">{foods.map(f=><article className="foodCard" key={f.id} onClick={()=>open(f)}><SafeImage src={f.image} alt={f.name}/><div><small>{f.region}</small><h2>{f.name}</h2><p>{f.desc}</p><button>Read the story <ArrowRight/></button></div></article>)}</div><div className="wideCall"><div><span>PUT IT TOGETHER</span><h2>Build a food + heritage outing.</h2><p>Choose an area and let the planner group nearby stories.</p></div><button className="primary" onClick={()=>go('plan')}>Build mine <Navigation/></button></div></section>}

function Cultures({open}){return <section className="page"><div className="pageHero"><span>PEOPLE · IDENTITY · TRADITION</span><h1>Singapore is<br/><em>more than four boxes.</em></h1><p>Explore culture through migration, food, language, neighbourhoods, craft and community life.</p></div><div className="cultureGrid">{cultures.map(c=><article className={'cultureCard '+c.id} key={c.id} onClick={()=>open(c)}><SafeImage src={c.image} alt={c.name}/><div><small>{c.tag}</small><h2>{c.name}</h2><p>{c.desc}</p><button>Explore story <ArrowRight/></button></div></article>)}</div></section>}

function Learn({open,openChat}){const [selected,setSelected]=useState(null);return <section className="page"><div className="pageHero"><span>LEARN WITHOUT THE LECTURE</span><h1>Ask a question.<br/><em>Then follow the thread.</em></h1><p>Tap a question to reveal the explanation and the places connected to it. There are no points or rewards — the interaction is there to help you explore.</p></div><div className="questionGrid">{learnCards.map((q,i)=><button key={q.id} className={selected?.id===q.id?'selected':''} onClick={()=>setSelected(selected?.id===q.id?null:q)}><span>0{i+1}</span><b>{q.question}</b><ChevronRight/></button>)}</div>{selected&&<div className="learnAnswer"><div><span>WHY IT MATTERS</span><h2>{selected.question}</h2><p>{selected.answer}</p><div className="topicChips">{selected.themes.map(x=><span key={x}>{x}</span>)}</div></div><div className="answerPlaces"><span>CONNECTED STORIES</span>{selected.items.map(name=>{const found=[...places,...foods].find(x=>x.name===name);return <button key={name} onClick={()=>found&&open(found)}>{name}<ArrowRight/></button>})}</div></div>}<div className="guideBanner"><MessageCircle/><div><span>HERITAGE GUIDE</span><h2>Still wondering about something?</h2><p>Ask the Guide about a neighbourhood, food, place or story.</p></div><button className="primary" onClick={openChat}>Open Guide <MessageCircle/></button></div></section>}

function Events(){return <section className="page"><div className="pageHero"><span>OFFICIAL EXPERIENCES</span><h1>See what’s<br/><em>happening now.</em></h1><p>Heritage Connect does not invent event details. Use the official SG Culture Pass catalogue for current dates, eligibility, prices and registration.</p><button className="primary" onClick={()=>window.open(EVENTS,'_blank')}>Open SG Culture Pass <ExternalLink/></button></div><div className="eventGrid"><article><span>01</span><h2>Browse current events</h2><p>Search the live catalogue by date, location or experience type.</p><button onClick={()=>window.open(EVENTS,'_blank')}>Open catalogue <ExternalLink/></button></article><article><span>02</span><h2>Check official details</h2><p>Confirm current opening times, eligibility, prices and booking requirements.</p><button onClick={()=>window.open(EVENTS,'_blank')}>Check details <ExternalLink/></button></article><article><span>03</span><h2>Bring it into your plan</h2><p>Use the Planner here to organise nearby heritage places around the event.</p><button onClick={()=>window.open(EVENTS,'_blank')}>Open planner <Navigation/></button></article></div></section>}

function Detail({item,back,save,saved,go,open}){
  const isPlace=item.type==='place';
  const [tab,setTab]=useState('story');
  const related=isPlace?places.filter(p=>p.id!==item.id&&p.area.split(' / ').some(a=>item.area.includes(a))).slice(0,3):item.type==='food'?foods.filter(f=>f.id!==item.id).slice(0,3):places.slice(0,3);
  const google='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(item.name+' Singapore');
  const share=()=>{const payload={title:item.name,text:'Heritage Connect — '+item.name,url:window.location.href};if(navigator.share)navigator.share(payload);else navigator.clipboard?.writeText(window.location.href)};
  return <section className="detailPage"><button className="backBtn" onClick={back}><ArrowLeft/> Back</button><div className="detailTop"><SafeImage src={item.image} alt={item.name}/><div><span>{item.tag||item.region}</span><h1>{item.name}</h1><p>{item.desc}</p><div className="detailBtns">{isPlace&&<button className="primary" onClick={()=>save(item.id)}>{saved.includes(item.id)?'Saved':'Save story'} <Bookmark/></button>}<button className="outline" onClick={()=>window.open(google,'_blank')}>Find it on Maps <MapPin/></button><button className="outline" onClick={share}>Share <Share2/></button></div></div></div><div className="storyTabs">{[['story','Story'],['context','Look closer'],['visit','Before you go']].map(([x,l])=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{l}</button>)}</div><div className="detailCols"><article className="storyArticle">{tab==='story'&&<><span>THE STORY</span><h2>More than a label.</h2><p>{item.story||item.learn||item.desc}</p>{item.facts&&<div className="factList">{item.facts.map((f,i)=><div key={f}><b>0{i+1}</b><span>{f}</span></div>)}</div>}</>}{tab==='context'&&<><span>LOOK CLOSER</span><h2>What should you notice?</h2><p>Use the themes below as lenses when you explore the place in person.</p><div className="noticeList">{(item.themes||[]).map((t,i)=><div key={t}><b>0{i+1}</b><span><strong>{t}</strong>{' · Look for how '+t.toLowerCase()+' appears in the place and its surrounding streets.'}</span></div>)}</div></>}{tab==='visit'&&<><span>BEFORE YOU GO</span><h2>Practical notes.</h2><div className="visitGrid"><div><Clock/><b>Suggested time</b><small>{item.time||'Flexible'}</small></div><div><MapPin/><b>Area</b><small>{item.area||item.region}</small></div><div><Users/><b>Visit with respect</b><small>{item.notice||'Follow venue rules and respect people using the space.'}</small></div></div>{item.source&&<p className="sourceNote"><b>Content reference:</b> {item.source}</p>}</>}</article><aside><span>KEEP EXPLORING</span><h3>Related stories nearby</h3>{related.map(r=><button key={r.id||r.name} onClick={()=>open(r)}><span>{r.name}</span><ChevronRight/></button>)}<button onClick={()=>go('plan')}>Build an outing <Navigation/></button></aside></div></section>
}

function Plan({places,setPlan,plan,open}){
  const [area,setArea]=useState('Anywhere'),[duration,setDuration]=useState('2 hours'),[theme,setTheme]=useState('All');
  const groups={Anywhere:[],Chinatown:['Chinatown','Telok Ayer'],'Kampong Gelam':['Kampong Gelam'],'Little India':['Little India'],'Balestier':['Balestier'],'Tiong Bahru':['Tiong Bahru'],'Joo Chiat & Katong':['Joo Chiat & Katong'],'Telok Ayer':['Telok Ayer','Chinatown'],'Bras Basah & Bugis':['Bras Basah & Bugis'],'Geylang & Geylang Serai':['Geylang & Geylang Serai'],'Changi':['Changi'],'Civic District':['Civic District'],'Buangkok':['Buangkok'],'Bukit Timah':['Bukit Timah']};
  const count=duration==='1 hour'?2:duration==='2 hours'?3:4;
  const build=()=>{const allowed=groups[area];let pool=places.filter(p=>!allowed?.length||allowed.some(a=>p.area.includes(a)));if(theme!=='All')pool=[...pool.filter(p=>(p.themes||[]).some(t=>t.toLowerCase()===theme.toLowerCase())),...pool];const unique=[];for(const p of pool){if(!unique.some(x=>x.id===p.id))unique.push(p);if(unique.length===count)break}setPlan({area,duration,theme,chosen:unique});};
  return <section className="page"><div className="pageHero"><span>OUTING BUILDER</span><h1>Make a plan.<br/><em>Then actually go.</em></h1><p>Choose an area, time and interest. The planner groups real stories from the same neighbourhood instead of giving random places.</p></div><div className="planner"><label>AREA<select value={area} onChange={e=>setArea(e.target.value)}><option>Anywhere</option>{areas.filter(x=>x!=='All').map(x=><option key={x}>{x}</option>)}</select></label><label>TIME<select value={duration} onChange={e=>setDuration(e.target.value)}><option>1 hour</option><option>2 hours</option><option>Half day</option></select></label><label>INTEREST<select value={theme} onChange={e=>setTheme(e.target.value)}>{themes.map(x=><option key={x}>{x}</option>)}</select></label><button className="primary" onClick={build}>Build my outing <Navigation/></button></div>{plan&&<div className="planCard"><span>YOUR OUTING</span><h2>{plan.duration} · {plan.area} · {plan.theme}</h2><p className="planIntro">These stops were selected from the same area where possible, so the route has a simple story rather than unrelated places.</p><div className="route">{plan.chosen.map((p,i)=><div key={p.id}><b>0{i+1}</b><SafeImage src={p.image} alt={p.name}/><section><small>{p.area}</small><h3>{p.name}</h3><p>{p.desc}</p><button onClick={()=>open(p)}>Open story <ArrowRight/></button></section></div>)}</div><div className="planLinks"><button onClick={()=>setPlan(null)}>Change choices</button><button onClick={()=>window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(plan.chosen.map(x=>x.name+' Singapore').join(' ; ')),'_blank')}>Open route search <Navigation/></button></div></div>}</section>
}

function Profile({saved,prefs,setPrefs,go,open,save}){
  const list=places.filter(p=>saved.includes(p.id));
  return <section className="page profilePage"><div className="profileHero"><div className="avatar">HC</div><div><span>YOUR HERITAGE PROFILE</span><h1>My discoveries</h1><p>{saved.length} saved stories · {prefs.length} selected interests</p></div></div><div className="profileGrid"><section className="progressCard"><b>YOUR INTERESTS</b><p>These preferences are used by the Planner and can be changed anytime.</p><div className="chips profileChips">{['Food','Architecture','Community','Migration','Wartime','Living heritage','Peranakan','Arts & film'].map(x=><button className={prefs.includes(x)?'on':''} key={x} onClick={()=>setPrefs(prefs.includes(x)?prefs.filter(y=>y!==x):[...prefs,x])}>{x}</button>)}</div><div className="profileLinks"><button onClick={()=>go('plan')}>Build an outing <Navigation/></button><button onClick={()=>go('places')}>Explore more stories <ArrowRight/></button></div></section><section className="missionCard"><span>SAVED STORIES</span><h2>Keep your list useful.</h2>{list.length?list.slice(0,5).map(p=><button className="profileSaved" key={p.id} onClick={()=>open(p)}><SafeImage src={p.image} alt={p.name}/><span><b>{p.name}</b><small>{p.area}</small></span><ChevronRight/></button>):<p>No saved stories yet. Save places that you want to understand or visit later.</p>}</section></div><div className="wideCall"><div><span>KEEP EXPLORING</span><h2>Heritage is more interesting when you connect the dots.</h2><p>Try an area filter, a Learn question, or the outing planner.</p></div><button className="primary" onClick={()=>go('places')}>Explore <ArrowRight/></button></div><div className="dataNotice"><b>Prototype note</b><span>Your saved stories and preferences are stored locally in this browser. This prototype does not use a live user account or rewards backend.</span></div></section>
}

function Saved({ids,save,open}){const list=places.filter(p=>ids.includes(p.id));return <section className="page"><div className="pageHero"><span>YOUR COLLECTION</span><h1>Saved for later.<br/><em>With a reason to return.</em></h1><p>Use saved stories as a shortlist for your next outing.</p></div>{list.length?<div className="contentGrid">{list.map(p=><article className="placeCard" key={p.id} onClick={()=>open(p)}><div className="imageWrap"><SafeImage src={p.image} alt={p.name}/><button onClick={e=>{e.stopPropagation();save(p.id)}}><Heart fill="currentColor"/></button></div><div className="cardBody"><small>{p.area}</small><h2>{p.name}</h2><p>{p.desc}</p></div></article>)}</div>:<div className="empty"><Bookmark/><h2>Nothing saved yet.</h2><p>Save a story from Explore to build your personal shortlist.</p><button className="primary" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Start exploring <ArrowRight/></button></div>}</section>}

function itemText(item){return [item.name,item.area,item.region,item.tag,item.desc,item.story,item.learn,...(item.facts||[]),...(item.themes||[])].filter(Boolean).join(' ').toLowerCase()}
function Chatbot({open,setOpen,openItem,go}){
  const [msgs,setMsgs]=useState([{from:'bot',text:'I’m the Heritage Guide 👋 Ask about a place, neighbourhood, food, culture or how to plan an outing.'},{from:'bot',text:'Try “What can I explore in Chinatown?”, “What is kueh?”, or “Plan 2 hours in Little India”.'}]);
  const [text,setText]=useState('');
  const answer=q=>{const clean=q.trim().toLowerCase();if(!clean)return;const terms=clean.split(/\s+/).filter(w=>w.length>2);const scored=[...places,...foods,...cultures].map(item=>({item,score:terms.reduce((n,t)=>n+(itemText(item).includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5);let intro='Here are some connected stories I found:';if(/plan|outing|route/.test(clean))intro='For a simple outing, I would keep the stops in the same neighbourhood so the stories connect. Open the Planner to adjust the area and time.';else if(scored.length)intro='These stories match what you asked about. Tap one to open its details.';else intro='I couldn’t find a direct match in the current content. Try an area name, a food, a place or a theme such as migration, architecture or wartime history.';setMsgs(m=>[...m,{from:'user',text:q},{from:'bot',text:intro,cards:scored.map(x=>x.item)}]);setText('')};
  return <>{<button className={'chatFab '+(open?'hide':'')} onClick={()=>setOpen(true)}><MessageCircle/><span>Ask the Guide</span></button>}{open&&<div className="chat"><div className="chatHead"><div><b>HERITAGE GUIDE</b><small>Searches the Heritage Connect content</small></div><button onClick={()=>setOpen(false)}><X/></button></div><div className="chatBody">{msgs.map((m,i)=><div key={i} className={m.from==='user'?'userMsg':'botMsg'}><p>{m.text}</p>{m.cards?.length>0&&<div className="chatCards">{m.cards.map(cc=><button key={cc.id} onClick={()=>{setOpen(false);openItem(cc)}}><SafeImage src={cc.image} alt={cc.name}/><span><b>{cc.name}</b><small>{cc.area||cc.region||cc.tag}</small></span><ArrowRight/></button>)}</div>}</div>)}</div><div className="chatSuggestions">{['Explore Chinatown','Explore Little India','What is kueh?','Show Balestier','Plan 2 hours'].map(x=><button key={x} onClick={()=>answer(x)}>{x}</button>)}</div><div className="chatInput"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&answer(text)} placeholder="Ask about Singapore heritage..."/><button onClick={()=>answer(text)}><Send/></button></div></div>}</>
}

export default App;
