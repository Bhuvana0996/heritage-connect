import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, MapPin, Bookmark, CalendarDays, Compass, User, ArrowUpRight, Heart, ChevronRight, WalletCards, X } from 'lucide-react';
import './styles.css';

const places = [
  {id:1,name:'Kampong Lorong Buangkok',area:'Buangkok',type:'Living heritage',tag:'COMMUNITY',mins:'18 min',desc:'One of Singapore’s last surviving kampongs, where everyday stories of the past remain part of the present.'},
  {id:2,name:'Jalan Sultan Stories',area:'Kampong Glam',type:'Culture & architecture',tag:'LOCAL STORIES',mins:'22 min',desc:'Discover the streets, buildings and community stories beyond the usual Kampong Glam landmarks.'},
  {id:3,name:'Joo Chiat Then & Now',area:'Joo Chiat',type:'Architecture & food',tag:'THEN / NOW',mins:'16 min',desc:'Explore conserved shophouses, family businesses and food traditions that still shape the neighbourhood.'},
  {id:4,name:'Changi Village Stories',area:'Changi',type:'Heritage trail',tag:'BY THE SEA',mins:'31 min',desc:'Trace kampong life, coastal communities and traditions around one of Singapore’s oldest village areas.'}
];
const events = [
 {id:11,title:"Singapore's Beginnings: Coolies Footprints Heritage Tour",place:'Chinatown',date:'27 Jul – 21 Dec 2026',price:35},
 {id:12,title:'Kampong Root to Living Traditions',place:'Changi',date:'26 Jun – 31 Oct 2026',price:60},
 {id:13,title:'Savouring Chinatown: Art, Heritage & River Views',place:'Telok Ayer',date:'25 Jul – 4 Dec 2026',price:80}
];

function App(){
 const [page,setPage]=useState('discover');
 const [search,setSearch]=useState('');
 const [saved,setSaved]=useState([]);
 const [selected,setSelected]=useState(null);
 const [balance,setBalance]=useState(100);
 const filtered=places.filter(p=>(p.name+' '+p.area+' '+p.type).toLowerCase().includes(search.toLowerCase()));
 const toggle=id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 return <div className="hcApp">
   <aside className="side">
    <div className="brand"><div className="brandMark">HC</div><div><b>heritage<br/>connect</b><small>SINGAPORE</small></div></div>
    <p className="sideLabel">EXPLORE</p>
    <Nav icon={<Compass/>} text="Discover" active={page==='discover'} click={()=>setPage('discover')}/>
    <Nav icon={<MapPin/>} text="Trails & places" active={page==='places'} click={()=>setPage('places')}/>
    <Nav icon={<CalendarDays/>} text="Experiences" active={page==='events'} click={()=>setPage('events')}/>
    <Nav icon={<Bookmark/>} text="Saved" active={page==='saved'} click={()=>setPage('saved')} count={saved.length}/>
    <div className="sideBottom"><div className="wallet"><WalletCards size={18}/><div><small>SG CULTURE PASS</small><strong>${balance}<em> left</em></strong></div></div><Nav icon={<User/>} text="My journey" active={page==='journey'} click={()=>setPage('journey')}/></div>
   </aside>
   <main className="main">
    <header className="top"><div className="mobileBrand">heritage <b>connect</b></div><div className="searchBox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search places, stories or experiences"/></div><div className="avatar">BH</div></header>
    {page==='discover'&&<Discover filtered={filtered} saved={saved} toggle={toggle} open={setSelected} go={setPage}/>} 
    {page==='places'&&<Listing title="Find the stories around you." eyebrow="PLACES & TRAILS" items={filtered} saved={saved} toggle={toggle} open={setSelected}/>} 
    {page==='events'&&<Events open={setSelected}/>} 
    {page==='saved'&&<Saved items={places.filter(p=>saved.includes(p.id))} toggle={toggle} open={setSelected}/>} 
    {page==='journey'&&<Journey balance={balance} saved={saved.length}/>} 
   </main>
   <nav className="mobileNav"><Nav icon={<Compass/>} text="Discover" active={page==='discover'} click={()=>setPage('discover')}/><Nav icon={<MapPin/>} text="Places" active={page==='places'} click={()=>setPage('places')}/><Nav icon={<CalendarDays/>} text="Events" active={page==='events'} click={()=>setPage('events')}/><Nav icon={<Bookmark/>} text="Saved" active={page==='saved'} click={()=>setPage('saved')}/><Nav icon={<User/>} text="Journey" active={page==='journey'} click={()=>setPage('journey')}/></nav>
   {selected&&<Modal item={selected} close={()=>setSelected(null)} saved={saved} toggle={toggle} balance={balance} spend={n=>{setBalance(balance-n);setSelected(null)}}/>}
 </div>
}
function Nav({icon,text,active,click,count}){return <button className={'nav '+(active?'active':'')} onClick={click}>{icon}<span>{text}</span>{count>0&&<i>{count}</i>}</button>}
function Discover({filtered,saved,toggle,open,go}){return <div className="page discover">
 <section className="hero"><div className="heroCopy"><span className="eyebrow">YOUR NEXT SINGAPORE STORY</span><h1>Go somewhere<br/><i>you haven't noticed.</i></h1><p>Discover places, people and experiences that make Singapore more than a skyline.</p><div><button className="primary" onClick={()=>go('places')}>Explore nearby <ArrowUpRight size={16}/></button><button className="textButton" onClick={()=>go('events')}>See what's on <ChevronRight size={16}/></button></div></div><div className="heroCard"><span>FIELD NOTE · 01</span><div><small>BUANGKOK</small><h2>Kampong<br/>Lorong<br/>Buangkok</h2><p><MapPin size={13}/> 18 MIN FROM YOU</p></div></div></section>
 <section className="stats"><div><small>YOUR CULTURE PASS</small><b>$100</b><p>credits to discover local arts & heritage</p></div><div><small>THIS WEEK</small><b>12</b><p>experiences worth leaving home for</p></div><div><small>YOUR COLLECTION</small><b>{saved.length}</b><p>places saved to revisit</p></div></section>
 <section className="section"><div className="sectionHead"><div><span className="eyebrow">CURATED FOR CURIOUS PEOPLE</span><h2>Start with a place.</h2></div><button className="link" onClick={()=>go('places')}>View all <ArrowUpRight size={15}/></button></div><div className="cards">{filtered.slice(0,4).map(p=><PlaceCard key={p.id} p={p} saved={saved.includes(p.id)} toggle={toggle} open={()=>open(p)}/>)}</div></section>
 <section className="culture"><div><span className="eyebrow">SG CULTURE PASS · EXPERIENCES</span><h2>Use your $100<br/>on something memorable.</h2><p>Financial access is only the first step. Heritage Connect helps you decide where to go and why it matters.</p><button className="primary" onClick={()=>go('events')}>Browse experiences <ArrowUpRight size={16}/></button></div><div className="eventMini">{events.map(e=><button key={e.id} onClick={()=>open(e)}><span>{e.place}</span><b>{e.title}</b><small>{e.date} · from ${e.price}</small></button>)}</div></section>
 <section className="manifesto"><span>01</span><div><span className="eyebrow">WHY HERITAGE CONNECT</span><h2>Heritage shouldn't<br/><i>sit behind glass.</i></h2></div><p>Existing platforms help people learn. Culture Pass helps people access experiences. We connect the two — turning <b>knowing</b> into <b>going.</b></p></section>
 </div>}
function Listing({title,eyebrow,items,saved,toggle,open}){return <div className="page"><div className="pageTitle"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>Search by neighbourhood, interest or the kind of experience you want.</p></div><div className="cards four">{items.map(p=><PlaceCard key={p.id} p={p} saved={saved.includes(p.id)} toggle={toggle} open={()=>open(p)}/>)}</div></div>}
function PlaceCard({p,saved,toggle,open}){return <article className="placeCard"><button className="save" onClick={()=>toggle(p.id)}>{saved?<Heart fill="currentColor"/>:<Bookmark/>}</button><div className="art"><span>{p.tag}</span><strong>{p.name}</strong><small>{p.area} · {p.mins}</small></div><div className="cardBody"><small>{p.type}</small><h3>{p.name}</h3><p>{p.desc}</p><button onClick={open}>View story <ArrowUpRight size={14}/></button></div></article>}
function Events({open}){return <div className="page"><div className="pageTitle"><span className="eyebrow">EXPERIENCES</span><h1>Something worth<br/>going out for.</h1><p>Browse heritage and cultural experiences. Eligible listings follow the SG Culture Pass model.</p></div><div className="eventList">{events.map(e=><article className="eventRow" key={e.id}><div className="date"><b>{e.date.slice(0,2)}</b><span>{e.date.slice(3,6)}</span></div><div><span className="tag">SG CULTURE PASS</span><h2>{e.title}</h2><p><MapPin size={14}/> {e.place} · {e.date}</p></div><strong>from<br/>${e.price}</strong><button onClick={()=>open(e)}><ArrowUpRight/></button></article>)}</div></div>}
function Saved({items,toggle,open}){return <div className="page"><div className="pageTitle"><span className="eyebrow">YOUR COLLECTION</span><h1>Places you want<br/>to remember.</h1><p>Save a place now. Decide when to go later.</p></div>{items.length?<div className="cards">{items.map(p=><PlaceCard key={p.id} p={p} saved toggle={toggle} open={()=>open(p)}/>)}</div>:<div className="empty"><Bookmark size={30}/><h2>Your collection is empty.</h2><p>Save a place when something catches your eye.</p></div>}</div>}
function Journey({balance,saved}){return <div className="page"><div className="pageTitle"><span className="eyebrow">MY JOURNEY</span><h1>Your culture,<br/>in progress.</h1><p>A simple record of the places you've noticed and experiences you've tried.</p></div><div className="journey"><div className="journeyDark"><small>EXPLORER LEVEL</small><b>02</b><h2>Neighbourhood Seeker</h2><div className="progress"><span/></div><p>180 points · {saved} saved</p></div><div className="journeyLight"><small>SG CULTURE PASS</small><b>${balance}</b><p>remaining in your demo wallet</p><div className="walletNote"><WalletCards size={18}/> Connect your cultural wallet to your next experience.</div></div><div className="journeyLight"><small>NEXT CHALLENGE</small><h2>Then & Now</h2><p>Visit a place you've only seen online. Compare an old image with what you see today.</p><strong>+50 points</strong></div></div></div>}
function Modal({item,close,saved,toggle,balance,spend}){const event=!!item.price;return <div className="backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button>{event?<><span className="eyebrow">SG CULTURE PASS ELIGIBLE</span><h2>{item.title}</h2><p className="modalLead">{item.place} · {item.date}</p><div className="modalFacts"><span>FROM <b>${item.price}</b></span><span>IN-PERSON EXPERIENCE</span><span>DEMO BALANCE <b>${balance}</b></span></div><p>This prototype mirrors the discovery and eligibility journey. Actual identity verification and checkout should continue through the official SG Culture Pass / authorised ticketing partner flow.</p><button className="primary" onClick={()=>spend(item.price)}>Use demo credits & continue <ArrowUpRight size={16}/></button></>:<><span className="eyebrow">{item.tag}</span><h2>{item.name}</h2><p className="modalLead">{item.area} · {item.type} · {item.mins}</p><p>{item.desc}</p><div className="story"><b>LOOK FOR</b><p>Notice what has survived, what has changed, and whose stories still shape this place.</p></div><button className="primary" onClick={()=>toggle(item.id)}>{saved.includes(item.id)?'Remove from saved':'Save this place'} <Bookmark size={16}/></button></>}</div></div>}

createRoot(document.getElementById('root')).render(<App/>);
