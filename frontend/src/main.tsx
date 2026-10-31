import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FileText, ShieldCheck, Building2, Search, Plus, CheckCircle2 } from 'lucide-react';
import './style.css';

type MatterResult = { id: string; title: string; status: string; warnings: string[]; analysis: string };
type J = { id: string; label: string; enabled_for_research: boolean };
const words = {
  en: {header:'Legal work, made clearer', sub:'Organize a legal matter and prepare it for expert review.', create:'New matter', title:'Matter title', body:'Paste the document text', action:'Create review workspace', intro:'Choose a workflow', note:'Prototype only — no AI analysis or legal advice yet.'},
  de: {header:'Rechtsarbeit übersichtlich gestalten', sub:'Vorgang anlegen und für die fachliche Prüfung vorbereiten.', create:'Neuer Vorgang', title:'Titel', body:'Dokumenttext einfügen', action:'Prüfvorgang anlegen', intro:'Arbeitsablauf wählen', note:'Prototyp — noch keine KI-Analyse oder Rechtsberatung.'},
  fr: {header:'Le travail juridique, en toute clarté', sub:'Organisez un dossier pour une revue par un juriste.', create:'Nouveau dossier', title:'Titre du dossier', body:'Coller le texte du document', action:'Créer le dossier', intro:'Choisir une tâche', note:'Prototype — aucune analyse IA ni conseil juridique.'}
};
function App(){
 const [lang,setLang] = useState<'en'|'de'|'fr'>('en');
 const [kind,setKind] = useState<'contract'|'corporate'|'compliance'>('contract');
 const [title,setTitle] = useState(''); const [body,setBody] = useState('');
 const [result,setResult] = useState<MatterResult | null>(null);
 const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
 const [jurisdictions,setJurisdictions] = useState<J[]>([]);
 useEffect(()=>{ fetch('/api/jurisdictions').then(r=>r.json()).then(setJurisdictions).catch(()=>setError('API not reachable. Start the Python server.')) },[]);
 const t=words[lang];
 const submit=async(e:React.FormEvent)=>{e.preventDefault(); setError(''); setResult(null); setBusy(true); try {const r=await fetch('/api/matters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,text:body,jurisdiction:'ch',language:lang,kind})});const j=await r.json();if(!r.ok) throw new Error('Please enter a title and at least 10 characters of document text.');setResult(j);}catch(e){setError(e instanceof Error ? e.message:'Request failed')}finally{setBusy(false)}};
 return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brandmark">L</div><div><strong>LexBridge</strong><small>Legal Workspace</small></div></div><nav aria-label="Primary"><div className="navitem active"><FileText size={19}/> Matters</div><div className="navitem muted"><Search size={19}/> Research <span>soon</span></div><div className="navitem muted"><ShieldCheck size={19}/> Playbooks <span>soon</span></div><div className="navitem muted"><Building2 size={19}/> Jurisdictions</div></nav><div className="sidebar-note">PRIVATE DEVELOPMENT PREVIEW<br/><small>No sensitive or real client documents.</small></div></aside>
 <main><header><div className="eyebrow">WORKSPACE / NEW MATTER</div><select aria-label="Interface language" value={lang} onChange={e=>setLang(e.target.value as typeof lang)}><option value="en">English</option><option value="de">Deutsch</option><option value="fr">Français</option></select></header><section className="content"><div className="heading"><div><h1>{t.header}</h1><p>{t.sub}</p></div><span className="tag">v0.1 · No AI</span></div><div className="section-title">{t.intro}</div><div className="choices">{([['contract','Contract review','Review commercial agreements',FileText],['corporate','Corporate law','Organize corporate matters',Building2],['compliance','Compliance','Prepare compliance assessments',ShieldCheck]] as const).map(([id,name,sub,Icon])=><button key={id} type="button" className={'choice '+(kind===id?'selected':'')} onClick={()=>setKind(id)}><Icon size={22}/><strong>{name}</strong><small>{sub}</small></button>)}</div><form onSubmit={submit} className="panel"><div className="panel-head"><h2><Plus size={19}/>{t.create}</h2><span>{jurisdictions.find(j=>j.id==='ch')?.label ?? 'Switzerland'} · CH</span></div><label htmlFor="title">{t.title}</label><input id="title" required minLength={2} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Software services agreement"/><label htmlFor="body">{t.body}</label><textarea id="body" required minLength={10} maxLength={30000} rows={8} value={body} onChange={e=>setBody(e.target.value)} placeholder="Paste a fictional agreement or case description..."/><div className="form-foot"><small>{t.note}</small><button className="primary" disabled={busy} type="submit">{busy?'Creating…':t.action}</button></div></form>{error&&<div className="error" role="alert">{error}</div>}{result&&<section className="result" aria-live="polite"><h2><CheckCircle2 size={21}/> Workspace created</h2><p><strong>{result.title}</strong> · {result.status}</p><p>{result.analysis}</p><ul>{result.warnings.map(w=><li key={w}>{w}</li>)}</ul></section>}<footer>LexBridge prototype · Human review required for all legal decisions</footer></section></main></div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
