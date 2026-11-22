import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Code2, Database, ExternalLink, FileBarChart, FileImage, FlaskConical, Github, Image as ImageIcon, Layers3, Menu, Microscope, ScanLine, Search, Server, ShieldCheck, UploadCloud, Waves, X, AlertTriangle, Download, Zap, Cpu, Camera, CircleDot, TerminalSquare, RefreshCw } from 'lucide-react';
import { api, segmentFish, measureFish, type Point, type SegmentResult, type MeasurementResult, type GalleryItem, type Overview, type Recording, type Training } from './api';
type Page = 'overview'|'experiments'|'gallery'|'analyze'|'methodology';
const pages: {id:Page;label:string;icon:typeof Activity}[]=[{id:'overview',label:'Overview',icon:BarChart3},{id:'experiments',label:'Experiments',icon:FlaskConical},{id:'gallery',label:'Visual evidence',icon:ImageIcon},{id:'analyze',label:'Image workspace',icon:ScanLine},{id:'methodology',label:'Methodology',icon:BookOpen}];
const num=(v:number|null|undefined)=>v==null?'â€”':v.toLocaleString('en-US');
const shorten=(s:string,n=42)=>s.length>n?s.slice(0,n-3)+'...':s;
function Loading(){return <div className="loading-block"><div className="loading-spinner"/> Loading evidence...</div>}
function Empty({title,body}:{title:string;body:string}){return <div className="empty"><CircleHelp size={23}/><strong>{title}</strong><span>{body}</span></div>}
function LineChart({data}:{data:Training['loss_points']}){
 const geometry=useMemo(()=>{
 if(data.length<2)return null;
 const W=760,H=250,p=30;
 const low=Math.min(...data.map(d=>d.loss));const high=Math.max(...data.map(d=>d.loss));
 const lo=Math.min(...data.map(d=>d.step));const hi=Math.max(...data.map(d=>d.step));
 const x=(s:number)=>p+(s-lo)/Math.max(1,hi-lo)*(W-2*p);
 const y=(v:number)=>p+(high-v)/Math.max(.001,high-low)*(H-2*p);
 const path=data.map((d,i)=>`${i?'L':'M'}${x(d.step).toFixed(1)},${y(d.loss).toFixed(1)}`).join(' ');
 const area=`${path} L${x(data[data.length-1].step)},${H-p} L${x(data[0].step)},${H-p} Z`;
 return {W,H,p,low,high,lo,hi,path,area};
 },[data]);
 if(!geometry)return <Empty title="No loss curve yet" body="Import the V8 train_steps.csv into reports/experiments and refresh."/>;
 const {W,H,p,low,high,lo,hi,path,area}=geometry;
 return <div className="chart-wrap"><svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Actual InfoNCE training loss over optimizer steps">
  <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#65a8e9" stopOpacity=".20"/><stop offset="1" stopColor="#65a8e9" stopOpacity="0"/></linearGradient></defs>
  {[0,.25,.5,.75,1].map(t=><g key={t}><line x1={p} x2={W-p} y1={p+t*(H-2*p)} y2={p+t*(H-2*p)} stroke="#29374e" strokeDasharray="4 7"/><text x="0" y={p+t*(H-2*p)+4} fill="#8b9bb3" fontSize="11">{(high-(high-low)*t).toFixed(1)}</text></g>)}
  <path d={area} fill="url(#areaGradient)"/><path d={path} fill="none" stroke="#72b3f9" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
  <text x={p} y={H-3} fontSize="11" fill="#95a4ba">Step {lo}</text><text x={W-p} y={H-3} textAnchor="end" fontSize="11" fill="#95a4ba">Step {hi}</text>
 </svg><div className="chart-footer"><span><i className="legend-dot"/> Actual mini-batch loss</span><span>{num(data.length)} recorded steps</span></div></div>
}
function Metric({label,value,icon:Icon,sub,kind='default'}:{label:string;value:string;icon:typeof Activity;sub:string;kind?:string}){
 return <div className={`metric metric-${kind}`}><div className="metric-head"><span>{label}</span><span className="metric-icon"><Icon size={17}/></span></div><strong>{value}</strong><div className="metric-sub">{sub}</div></div>
}
function AnalysisWorkspace(){
 type Key = 'snout'|'tail_tip'|'reference_start'|'reference_end';
 const steps: {key:Key;label:string;color:string}[] = [
  {key:'snout',label:'1. Ujung moncong ikan',color:'#6fd8c6'},
  {key:'tail_tip',label:'2. Ujung sirip ekor',color:'#f6ac69'},
  {key:'reference_start',label:'3. Titik awal referensi',color:'#92b7ff'},
  {key:'reference_end',label:'4. Titik akhir referensi',color:'#d5a1ff'},
 ];
 const [file,setFile]=useState<File|null>(null);
 const [preview,setPreview]=useState('');
 const [dims,setDims]=useState<{width:number;height:number}|null>(null);
 const [seg,setSeg]=useState<SegmentResult|null>(null);
 const [selectedFish,setSelectedFish]=useState(0);
 const [points,setPoints]=useState<Partial<Record<Key,Point>>>({});
 const [activeKey,setActiveKey]=useState<Key>('snout');
 const [referenceCm,setReferenceCm]=useState('10');
 const [coplanar,setCoplanar]=useState(false);
 const [measured,setMeasured]=useState<MeasurementResult|null>(null);
 const [busy,setBusy]=useState(false);
 const [measuring,setMeasuring]=useState(false);
 const [error,setError]=useState('');
 const [drag,setDrag]=useState(false);
 const [showMask,setShowMask]=useState(true);
 const fileRef=useRef<HTMLInputElement|null>(null);
 const imageRef=useRef<HTMLImageElement|null>(null);
 useEffect(()=>{if(!file){setPreview('');setDims(null);return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file]);
 const choose=(f?:File)=>{
  if(!f)return;
  setError('');setSeg(null);setMeasured(null);setPoints({});setActiveKey('snout');setCoplanar(false);setDims(null);
  if(!['image/png','image/jpeg','image/webp'].includes(f.type)){setError('Gunakan PNG, JPG, atau WebP.');return;}
  if(f.size>8*1024*1024){setError('Ukuran file maksimal 8 MB.');return;}
  setFile(f);
 };
 const run=async()=>{
  if(!file)return;setBusy(true);setError('');setMeasured(null);
  try{
   const output=await segmentFish(file);setSeg(output);
   if(dims&&(dims.width!==output.frame.width||dims.height!==output.frame.height))setError('Orientasi gambar dan output model berbeda; jangan gunakan titik otomatis.');
  }catch(e){setSeg(null);setError('Segmentasi YOLO gagal: '+(e instanceof Error?e.message:String(e))+' â€” Kalibrasi manual tetap bisa digunakan.');}finally{setBusy(false);}
 };
 const onImageClick=(e:React.MouseEvent<SVGSVGElement>)=>{
  if(!dims)return;
  const rect=e.currentTarget.getBoundingClientRect();
  const x=Math.min(dims.width,Math.max(0,(e.clientX-rect.left)/rect.width*dims.width));
  const y=Math.min(dims.height,Math.max(0,(e.clientY-rect.top)/rect.height*dims.height));
  setPoints(old=>({...old,[activeKey]:{x:+x.toFixed(2),y:+y.toFixed(2)}}));setMeasured(null);
  const i=steps.findIndex(t=>t.key===activeKey);
  if(i<steps.length-1)setActiveKey(steps[i+1].key);
 };
 const allPoints=steps.every(step=>points[step.key]!==undefined);
 const cm=Number(referenceCm);
 const canMeasure=!!dims&&allPoints&&Number.isFinite(cm)&&cm>0&&coplanar&&!measuring;
 const submit=async()=>{
  if(!dims||!canMeasure)return;setMeasuring(true);setError('');setMeasured(null);
  try{
   const output=await measureFish({image_width:dims.width,image_height:dims.height,
    snout:points.snout!,tail_tip:points.tail_tip!,reference_start:points.reference_start!,reference_end:points.reference_end!,
    reference_length_cm:cm,coplanar_confirmed:coplanar,length_definition:'total_length_straight_line'});
   setMeasured(output);
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setMeasuring(false);}
 };
 const download=()=>{
  if(!measured||!dims)return;
  const report={project:'FishSizeEstimate Day39',file_name:file?.name,frame:dims,landmarks:points,measurement:measured,segmentation_model:seg?.model||null,segmentation_used_for_measurement:false,created_at:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='fishsize-measurement.json';a.click();URL.revokeObjectURL(url);
 };
 const selected=seg?.objects[selectedFish];
 const svgLine=(a?:Point,b?:Point,color='#79bbff',dash='')=>a&&b?<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={Math.max(2,(dims?.width||500)/350)} strokeDasharray={dash}/>:null;
 return <div className="workspace-grid"><div className="panel analysis-panel"><div className="panel-header"><div><div className="panel-kicker">FISH LENGTH Â· SCALE CALIBRATION</div><h3>Image workspace</h3><p>Segmentasi YOLO V11 + pengukuran manual terkalibrasi pada foto yang sama.</p></div><span className="subtle-icon"><ScanLine size={19}/></span></div>
 <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>choose(e.target.files?.[0])}/>
 <div className={`dropzone ${drag?'drag':''} ${preview?'has-preview':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);choose(e.dataTransfer.files[0])}}>
 {preview?<div className="preview-container measurement-image"><img ref={imageRef} src={preview} alt="Foto ikan untuk pengukuran" onLoad={e=>setDims({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight})}/>{dims&&<svg viewBox={`0 0 ${dims.width} ${dims.height}`} preserveAspectRatio="none" className="annot-layer measurement-overlay" onClick={onImageClick} role="img" aria-label={`Klik posisi ${steps.find(t=>t.key===activeKey)?.label} pada gambar`}>
 {showMask&&selected?.polygon_xy&&selected.polygon_xy.length>=3&&<polygon points={selected.polygon_xy.map(p=>p.join(',')).join(' ')} fill="#60b6fc" fillOpacity=".20" stroke="#73c1ff" strokeWidth={Math.max(2,dims.width/450)}/>}
 {svgLine(points.snout,points.tail_tip,'#6fd8c6')}{svgLine(points.reference_start,points.reference_end,'#d5a1ff')}
 {steps.map(item=>{const p=points[item.key];return p?<g key={item.key}><circle cx={p.x} cy={p.y} r={Math.max(5,dims.width/135)} fill={item.color} stroke="#071120" strokeWidth={Math.max(2,dims.width/550)}/></g>:null;})}
 </svg>}</div>:<div className="drop-placeholder"><div className="drop-icon"><UploadCloud size={28}/></div><strong>Upload foto ikan dan referensi ukuran</strong><span>PNG/JPG/WebP Â· maksimal 8 MB Â· penggaris harus terlihat</span></div>}
 </div><div className="workspace-actions"><button className="btn secondary" onClick={()=>fileRef.current?.click()}><UploadCloud size={16}/>{file?'Ganti foto':'Pilih foto'}</button><button disabled={!file||busy} onClick={run} className="btn primary">{busy?<RefreshCw className="spin" size={16}/>:<ScanLine size={16}/>} {busy?'Menjalankan YOLO...':'Analyze frame Â· YOLO V11'}</button></div>
 {error&&<div className="error"><AlertTriangle size={15}/>{error}</div>}
 <section className="measurement-controls"><h4>1 Â· Tandai titik di foto</h4><p className="muted-paragraph">Pilih titik, lalu klik gambar. Geser dengan memilih ulang titik tersebut. Titik kepala dan ekor tetap harus diperiksa secara anatomis; mask AI hanya bantuan visual.</p><div className="point-grid">{steps.map(item=><button key={item.key} className={`point-selector ${activeKey===item.key?'is-active':''}`} onClick={()=>setActiveKey(item.key)}><span className="point-dot" style={{background:item.color}}/>{item.label}<span>{points[item.key]?'âœ“':'+'}</span></button>)}</div>
 {seg?.objects?.length? <div className="control-row"><label>Mask ikan terdeteksi: <select value={selectedFish} onChange={e=>setSelectedFish(Number(e.target.value))}>{seg.objects.map((o,i)=><option value={i} key={o.id}>Ikan {i+1} Â· {(o.confidence*100).toFixed(1)}%</option>)}</select></label><label><input type="checkbox" checked={showMask} onChange={e=>setShowMask(e.target.checked)}/> Tampilkan mask</label></div>:null}
 <div className="control-row"><label>Panjang referensi sebenarnya (cm)<input type="number" min="0.01" max="1000" step="0.1" value={referenceCm} onChange={e=>{setReferenceCm(e.target.value);setMeasured(null)}}/></label></div>
 <label className="calibration-confirm"><input type="checkbox" checked={coplanar} onChange={e=>{setCoplanar(e.target.checked);setMeasured(null)}}/><span>Saya memastikan ikan dan referensi berada pada bidang pengukuran yang sama, kamera cukup tegak lurus, dan kedua ujung ikan terlihat.</span></label>
 <div className="workspace-actions"><button className="btn secondary" onClick={()=>{setPoints({});setActiveKey('snout');setMeasured(null)}} disabled={!file}>Reset titik</button><button className="btn primary" disabled={!canMeasure} onClick={submit}><ShieldCheck size={16}/> {measuring?'Menghitung...':'2 Â· Hitung panjang (cm)'}</button></div></section>
 </div><div className="panel analysis-result"><div className="panel-header"><div><div className="panel-kicker">PHYSICAL MEASUREMENT</div><h3>Hasil pengukuran</h3></div><span className="chip gray">Reference-scale</span></div>
 {measured?<><div className="measurement-number"><span>Panjang total (garis lurus)</span><strong>{measured.length_cm.toFixed(2)} <small>cm</small></strong></div><div className="result-lines"><div><span>Panjang dalam gambar</span><b>{measured.fish_length_px.toFixed(1)} px</b></div><div><span>Referensi</span><b>{measured.reference_length_cm} cm / {measured.reference_length_px.toFixed(1)} px</b></div><div><span>Skala</span><b>{measured.cm_per_pixel.toFixed(5)} cm/px</b></div><div><span>Validasi MAE</span><b className="not-ready">Belum diuji</b></div></div><button className="btn secondary" onClick={download}><Download size={16}/> Simpan hasil JSON</button><div className="notice info"><ShieldCheck size={17}/><span>{measured.warning}</span></div></>:<><div className="result-state muted"><CircleDot size={17}/>{seg?`YOLO: ${seg.fish_count} kandidat ikan`:'Menunggu foto dan kalibrasi'}</div><div className="result-lines"><div><span>Dimensi gambar</span><b>{dims?`${dims.width} Ã— ${dims.height}`:'â€”'}</b></div><div><span>Titik ditandai</span><b>{steps.filter(t=>points[t.key]).length}/4</b></div><div><span>Model segmentasi</span><b>{seg?'YOLO V11 aktif':'Belum dijalankan'}</b></div><div><span>Panjang fisik</span><b className="not-ready">Belum dihitung</b></div></div>{seg&&<div className="notice info"><ShieldCheck size={18}/><span>{seg.fish_count?`YOLO mendeteksi ${seg.fish_count} kandidat ikan. Periksa mask dan titik secara manual.`:'YOLO tidak mendeteksi ikan. Pengukuran manual tetap tersedia.'}</span></div>}</>}
 <div className="divider"/><h4>Batas penggunaan</h4><p className="muted-paragraph">Pengukuran menggunakan dua titik ikan dan dua titik referensi yang dipilih pengguna. Kamera miring, ikan melengkung, atau referensi tidak sebidang dapat menghasilkan bias. Ini bukan estimasi otomatis tanpa skala, dan belum mempunyai nilai MAE teruji.</p>
 </div></div>
}
function App(){
 const [page,setPage]=useState<Page>('overview');const [menu,setMenu]=useState(false);const [overview,setOverview]=useState<Overview|null>(null);const [training,setTraining]=useState<Training|null>(null);const [recordings,setRecordings]=useState<Recording[]>([]);const [gallery,setGallery]=useState<GalleryItem[]>([]);const [search,setSearch]=useState('');const [lightbox,setLightbox]=useState<GalleryItem|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [refreshToken,setRefreshToken]=useState(0);
 useEffect(()=>{let active=true;setLoading(true);Promise.allSettled([api.overview(),api.training(),api.recordings(),api.gallery()]).then(results=>{if(!active)return;const [o,t,r,g]=results;if(o.status==='fulfilled')setOverview(o.value);if(t.status==='fulfilled')setTraining(t.value);if(r.status==='fulfilled')setRecordings(r.value.rows);if(g.status==='fulfilled')setGallery(g.value.items);if(results.some(x=>x.status==='rejected'))setError('Some local research files are unavailable. Start FastAPI and check imported reports.');else setError('');setLoading(false)});return()=>{active=false}},[refreshToken]);
 const filtered=gallery.filter(g=>`${g.name} ${g.category}`.toLowerCase().includes(search.toLowerCase()));
 const nav=(id:Page)=>{setPage(id);setMenu(false);window.scrollTo({top:0,behavior:'smooth'})};
 const active=pages.find(p=>p.id===page)!;const ActiveIcon=active.icon;
 return <div className="app-shell">
 <aside className={`sidebar ${menu?'open':''}`}><div className="brand"><div className="brand-mark"><Waves size={24}/></div><div className="brand-text"><strong>FishSize<span>Estimate</span></strong><small>MEASUREMENT WORKSPACE</small></div><button className="mobile-close" onClick={()=>setMenu(false)} aria-label="Close menu"><X size={20}/></button></div>
 <div className="sidebar-section">WORKSPACE</div><nav className="side-nav">{pages.map(({id,label,icon:Icon})=><button key={id} onClick={()=>nav(id)} className={`nav-item ${page===id?'selected':''}`}><Icon size={18}/><span>{label}</span>{page===id&&<span className="nav-active-dot"/>}</button>)}</nav>
 <div className="sidebar-section second">RESOURCES</div><a href="https://github.com/MENSTRUE/FishSizeEstimate" target="_blank" rel="noreferrer" className="nav-item link"><Github size={18}/><span>GitHub repository</span><ExternalLink size={14}/></a><a href="https://www.kaggle.com/datasets/wafabila/fishsizeestimate-dataset" target="_blank" rel="noreferrer" className="nav-item link"><Database size={18}/><span>Source dataset</span><ExternalLink size={14}/></a><a href="http://127.0.0.1:8001/docs" target="_blank" rel="noreferrer" className="nav-item link"><Code2 size={18}/><span>API documentation</span><ExternalLink size={14}/></a>
 <div className="sidebar-bottom"><div className="sidebar-status"><span className="live-dot"/><div><b>Research prototype</b><small>Reference-scale Â· Requires validation</small></div></div><div className="sidebar-footer">Built with React + FastAPI<br/>Â© 2026 FishSizeEstimate</div></div>
 </aside>{menu&&<button className="overlay" onClick={()=>setMenu(false)} aria-label="Close sidebar"/>}
 <main className="main"><header className="topbar"><div className="top-left"><button className="hamburger" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu size={22}/></button><span className="breadcrumbs">Workspace <ChevronRight size={15}/> <b>{active.label}</b></span></div><div className="top-actions"><span className="top-status"><span className="live-dot"/> Local research mode</span><button title="Reload research data" onClick={()=>setRefreshToken(n=>n+1)} className="round-button"><RefreshCw size={17}/></button><span className="avatar">FS</span></div></header>
 <div className="main-content"><div className="page-intro"><div className="eyebrow"><ActiveIcon size={14}/> FISHSIZEESTIMATE / {page.toUpperCase()}</div><div className="intro-row"><div><h1>{page==='overview'?'Research overview':active.label}</h1><p>{page==='overview'?'From underwater stereo recordings to reproducible visual representation research.':page==='experiments'?'Track actual training evidence, source coverage, and scientific limits.':page==='gallery'?'A visual archive of actual exported experimental diagnostics.':page==='analyze'?'Ukur panjang ikan dalam cm dengan referensi fisik dan bantuan segmentasi YOLO V11.':'How the experiment works, what is proven, and what remains open.'}</p></div><span className="edition-badge"><FlaskConical size={14}/> Research build 1.0</span></div></div>
 {error&&<div className="notice warn api-warning"><AlertTriangle size={17}/>{error}</div>}
 {page==='overview'&&<><section className="hero"><div className="hero-copy"><div className="hero-label"><span className="pulse-dot"/> UNDERWATER COMPUTER VISION</div><h2>Turning underwater video into <em>measurable evidence.</em></h2><p>Explore real training coverage, stereo camera diagnostics, and fish candidate analysis in one transparent research workspace.</p><div className="hero-actions"><button className="btn primary" onClick={()=>nav('experiments')}>Explore experiments <ArrowRight size={17}/></button><button className="btn ghost" onClick={()=>nav('gallery')}>View visual evidence <ArrowDownRight size={17}/></button></div></div><div className="hero-art" aria-hidden="true"><div className="depth-ring ring-1"/><div className="depth-ring ring-2"/><div className="depth-ring ring-3"/><div className="scanner"><div className="scanner-grid"/><div className="fish-shape"><svg viewBox="0 0 390 150" fill="none"><path d="M327 74c23-18 40-37 51-49-3 23-4 34-4 49s1 26 4 50c-14-15-29-32-51-50Z" fill="#79b8e9" fillOpacity=".26" stroke="#83c8fc" strokeWidth="2"/><path d="M35 75c30-43 102-64 184-56 48 5 89 21 112 56-23 36-64 53-112 56-82 7-154-13-184-56Z" fill="#75b2ea" fillOpacity=".12" stroke="#92d4ff" strokeWidth="2"/><path d="M131 26c36-25 70-23 101-10M139 123c44 23 78 17 111 5" stroke="#8dcbf5" strokeWidth="1.4"/><circle cx="89" cy="65" r="5" fill="#a6e7ff"/><path d="M35 75h342" stroke="#8fe5e5" strokeDasharray="7 9" strokeOpacity=".7"/></svg></div><span className="scanner-corner tl"/><span className="scanner-corner tr"/><span className="scanner-corner bl"/><span className="scanner-corner br"/></div><span className="art-tag tag-a">FRAME 08:24</span><span className="art-tag tag-b">STEREO / LEFT + RIGHT</span></div></section>
 <div className="metric-grid"><Metric label="ROS recordings" value={num(overview?.stats.recordings)} icon={Database} sub={overview?.source==='local_training_report'?'Source-backed Â· completed':'Awaiting local training_report.json'} kind="blue"/><Metric label="Images consumed" value={num(overview?.stats.trained_images)} icon={FileImage} sub="Decoded image messages in optimizer batches"/><Metric label="Optimizer updates" value={num(overview?.stats.optimizer_steps)} icon={Cpu} sub="Real self-supervised training steps"/><Metric label="Length error (MAE)" value="Not validated" icon={ShieldCheck} sub="No fish-level cm ground-truth evaluation" kind="muted"/></div>
 <div className="content-grid"><div className="panel wide"><div className="panel-header"><div><div className="panel-kicker">TRAINING SIGNAL</div><h3>Self-supervised loss</h3><p>Recorded InfoNCE loss across real optimizer steps. Not length accuracy.</p></div><button className="plain-link" onClick={()=>nav('experiments')}>Full experiment <ArrowRight size={15}/></button></div>{loading?<Loading/>:<LineChart data={training?.loss_points||[]}/>}</div>
 <div className="panel research-status"><div className="panel-header"><div><div className="panel-kicker">SCIENTIFIC READINESS</div><h3>What is verified?</h3></div><span className="chip orange">In progress</span></div><div className="readiness-items">{[['Recording streams','11 source recordings traversed'],['Visual representation','CNN pretraining completed'],['Stereo timing','Candidate pairing investigated'],['Metric scale','Physical baseline not verified'],['Fish endpoints','No verified headâ€“tail labels']].map(([a,b],i)=><div className="readiness-row" key={a}><span className={i<3?'ok-check':'pending-check'}>{i<3?<CheckCircle2 size={17}/>:<CircleDot size={17}/>}</span><div><strong>{a}</strong><small>{b}</small></div></div>)}</div><button className="text-button" onClick={()=>nav('methodology')}>Read research limitations <ArrowRight size={16}/></button></div></div>
 <div className="section-heading"><div><span className="panel-kicker">EXPLORE THE SYSTEM</span><h3>Research workspace</h3></div></div><div className="feature-grid">{[{title:'Experiment evidence',text:'Loss curves, coverage, checks and report provenance.',icon:Activity,page:'experiments' as Page},{title:'Stereo visual archive',text:'Inspect exported frame pairs, plots and diagnostic figures.',icon:Camera,page:'gallery' as Page},{title:'Image analysis',text:'Segment fish with YOLO and measure centimetres using a physical reference.',icon:ScanLine,page:'analyze' as Page}].map(({title,text,icon:Icon,page:p})=><button className="feature" key={title} onClick={()=>nav(p)}><span className="feature-icon"><Icon size={21}/></span><strong>{title}</strong><span>{text}</span><span className="feature-arrow"><ArrowRight size={18}/></span></button>)}</div></>}
 {page==='experiments'&&<><div className="metric-grid small"><Metric label="Completed recordings" value={num(overview?.stats.recordings)} icon={Database} sub="From report, if present"/><Metric label="Training frames" value={num(overview?.stats.trained_images)} icon={Layers3} sub="Self-supervised views"/><Metric label="Updates" value={num(overview?.stats.optimizer_steps)} icon={Zap} sub="Optimizers steps"/><Metric label="Length MAE" value="Unavailable" icon={ShieldCheck} sub="Not calibrated" kind="muted"/></div><div className="panel"><div className="panel-header"><div><div className="panel-kicker">OPTIMIZATION RECORD</div><h3>Training history</h3><p>Visualization drawn from the actual imported train_steps.csv.</p></div><span className="chip gray"><Activity size={13}/> InfoNCE</span></div>{loading?<Loading/>:<LineChart data={training?.loss_points||[]}/>}</div><div className="panel table-panel"><div className="panel-header"><div><div className="panel-kicker">SOURCE COVERAGE</div><h3>Recording inventory</h3><p>Completed / decoded frames by individual ROS bag.</p></div><span className="chip gray">{recordings.length} recordings</span></div>{recordings.length?<div className="table-scroll"><table><thead><tr><th>Recording</th><th>Dataset</th><th>Status</th><th>Frames trained</th><th>Decode failures</th></tr></thead><tbody>{recordings.map((r,i)=><tr key={i}><td title={r.bag}><span className="code-text">{shorten(r.bag,44)}</span></td><td><span className="chip gray">{r.dataset||'â€”'}</span></td><td><span className="status-label"><CheckCircle2 size={14}/>{r.status||'â€”'}</span></td><td>{num(r.trained_images)}</td><td>{num(r.decode_failures)}</td></tr>)}</tbody></table></div>:<Empty title="Coverage CSV not detected" body="Copy all_bag_coverage.csv into reports/experiments to populate the table."/>}</div></>}
 {page==='gallery'&&<><div className="gallery-toolbar"><span><ImageIcon size={17}/> {filtered.length} visual artifacts</span><label className="search"><Search size={17}/><input placeholder="Search image names..." value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={16}/></button>}</label></div>{filtered.length?<div className="gallery-grid">{filtered.map(g=><button className="image-card" key={g.id} onClick={()=>setLightbox(g)}><img loading="lazy" src={g.url} alt={g.name}/><div className="image-card-footer"><span>{shorten(g.name,34)}</span><ExternalLink size={15}/></div><small>{g.category}</small></button>)}</div>:<div className="panel"><Empty title="No images found" body="Import exported PNG/JPG figures into assets/plots, then refresh."/></div>}</>}
 {page==='analyze'&&<><div className="notice warn top-notice"><AlertTriangle size={18}/> Pengukuran cm memerlukan referensi fisik, titik anatomis yang tepat, dan kondisi kamera yang sesuai. Mask YOLO V11 masih eksperimental.</div><AnalysisWorkspace/></>}
 {page==='methodology'&&<div className="method-grid"><div className="panel method-main"><div className="panel-kicker">RESEARCH PIPELINE</div><h3>Evidence before accuracy</h3><p className="method-lead">FishSizeEstimate investigates underwater visual representations and stereo geometry. This interface separates successfully completed steps from open scientific dependencies.</p><div className="method-steps">{[{n:'01',title:'Data ingestion',desc:'Stream the available ROS1 image topics; count decoded messages and preserve source mapping.',done:true},{n:'02',title:'Self-supervised pretraining',desc:'Train a compact convolutional visual encoder using paired augmentations and InfoNCE.',done:true},{n:'03',title:'Stereo inspection',desc:'Match left/right timestamps and inspect session-specific camera calibration candidates.',done:true},{n:'04',title:'Fish anatomy correspondence',desc:'Verify matching left/right snout and tail landmarks for known fish identities.',done:false},{n:'05',title:'Physical validation',desc:'Verify camera baseline units, compute 3D length, then evaluate independent fish-level MAE/RMSE.',done:false}].map(s=><div className="method-step" key={s.n}><div className={`method-num ${s.done?'done':''}`}>{s.done?<CheckCircle2 size={17}/>:s.n}</div><div><strong>{s.title}</strong><p>{s.desc}</p></div></div>)}</div></div><aside className="method-side"><div className="panel"><div className="panel-kicker">MEASUREMENT CLAIM</div><h3>Why no cm number?</h3><p className="muted-paragraph">Image embeddings and contours cannot determine real-world scale by themselves. Valid metric length needs camera geometry, object correspondence, and held-out ground truth.</p><div className="notice info"><ShieldCheck size={18}/>Unverified measurements remain deliberately unavailable.</div></div><div className="panel links-panel"><h3>Open resources</h3><a href="https://github.com/MENSTRUE/FishSizeEstimate" target="_blank" rel="noreferrer"><Github size={17}/> Repository <ExternalLink size={14}/></a><a href="https://www.kaggle.com/datasets/wafabila/fishsizeestimate-dataset" target="_blank" rel="noreferrer"><Database size={17}/> Dataset <ExternalLink size={14}/></a><a href="http://127.0.0.1:8001/docs" target="_blank" rel="noreferrer"><TerminalSquare size={17}/> OpenAPI docs <ExternalLink size={14}/></a></div></aside></div>}
 <footer className="footer"><span>FishSizeEstimate Research Console Â· Evidence-driven computer vision</span><span>React Â· TypeScript Â· FastAPI <span className="footer-mark">Â© 2026</span></span></footer></div></main>
 {lightbox&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" onClick={()=>setLightbox(null)}><div className="lightbox-inner" onClick={e=>e.stopPropagation()}><div className="lightbox-top"><strong>{lightbox.name}</strong><button onClick={()=>setLightbox(null)} aria-label="Close preview"><X size={20}/></button></div><img src={lightbox.url} alt={lightbox.name}/><a href={lightbox.url} download={lightbox.name}><Download size={16}/> Open original</a></div></div>}
 </div>
}
export default App;

