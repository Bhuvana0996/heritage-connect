import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

class AppErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={error:null};}
  static getDerivedStateFromError(error){return {error};}
  componentDidCatch(error,info){console.error('Heritage Connect runtime error:',error,info);}
  render(){
    if(this.state.error){
      return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#fff8ec',fontFamily:'Arial,sans-serif',color:'#151515'}}><div style={{maxWidth:620,width:'100%',background:'#fff',border:'2px solid #151515',borderRadius:20,padding:24,boxShadow:'6px 6px 0 #ffc83d'}}><div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:'#ff5b45'}}>HERITAGE CONNECT</div><h1 style={{fontSize:32,margin:'10px 0'}}>The app hit a runtime error.</h1><p style={{color:'#666'}}>I’ve added this screen so the app won’t appear completely blank if something breaks.</p><pre style={{whiteSpace:'pre-wrap',background:'#f5f5f5',padding:14,borderRadius:10,fontSize:12,overflow:'auto'}}>{String(this.state.error?.stack||this.state.error)}</pre><button onClick={()=>{localStorage.clear();location.reload()}} style={{border:0,borderRadius:999,padding:'12px 16px',fontWeight:800,background:'#ffc83d',cursor:'pointer'}}>Reset app data & reload</button></div></div>
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App /></AppErrorBoundary>);
