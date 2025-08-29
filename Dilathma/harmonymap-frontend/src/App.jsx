import { useEffect, useMemo, useState } from 'react'
import * as Tone from 'tone'

const CHORDS = ['C','Dm','Em','F','G','Am','Bdim']
const NOTES  = ['C','D','E','F','G','A','B']
const SCALES = [
  { value:'major', label:'Major' },
  { value:'minor', label:'Natural Minor' },
  { value:'dorian', label:'Dorian' },
  { value:'mixolydian', label:'Mixolydian' },
]

export default function App() {
  // status
  const [status, setStatus] = useState('Connecting to API…')
  const [graph, setGraph]   = useState(null)

  // progression
  const [startChord, setStartChord] = useState('C')
  const [endChord, setEndChord]     = useState('C')
  const [length, setLength]         = useState(4)
  const [prog, setProg]             = useState([])
  const [roman, setRoman]           = useState([])
  const [progErr, setProgErr]       = useState('')

  // melody
  const [startNote, setStartNote]   = useState('C')
  const [endNote, setEndNote]       = useState('G')
  const [scale, setScale]           = useState('major')
  const [melody, setMelody]         = useState([])
  const [melErr, setMelErr]         = useState('')

  // Tone synths (lazy)
  const synths = useMemo(() => ({ synth: null, poly: null }), [])
  async function ensureAudio() {
    if (Tone.context.state !== 'running') await Tone.start()
    if (!synths.synth) synths.synth = new Tone.Synth().toDestination()
    if (!synths.poly)  synths.poly  = new Tone.PolySynth(Tone.Synth).toDestination()
  }
  function chordNotes(name) {
    const map = {
      'C':['C4','E4','G4'], 'Dm':['D4','F4','A4'], 'Em':['E4','G4','B4'],
      'F':['F4','A4','C5'], 'G':['G4','B4','D5'], 'Am':['A4','C5','E5'], 'Bdim':['B4','D5','F5']
    }
    return map[name] || ['C4','E4','G4']
  }

  // on load: health check + graph
  useEffect(() => {
    (async () => {
      try {
        const h = await fetch('/api/health')
        if (!h.ok) throw new Error('Health failed')
        const g = await fetch('/api/graph')
        const data = await g.json()
        setGraph(data)
        setStatus('Connected to API')
      } catch (e) {
        console.error(e)
        setStatus('API not reachable (is FastAPI running on :8000?)')
      }
    })()
  }, [])

  async function generateProgression() {
    setProgErr('')
    setProg([]); setRoman([])
    try {
      const res = await fetch('/api/progression', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ start: startChord, end: endChord, length })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setProg(data.path); setRoman(data.roman)
    } catch (e) {
      setProgErr(e.message)
    }
  }

  async function findMelodicPath() {
    setMelErr('')
    setMelody([])
    try {
      const res = await fetch('/api/melody', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ startNote, endNote, scaleType: scale })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMelody(data.path)
    } catch (e) {
      setMelErr(e.message)
    }
  }

  async function playProg() {
    if (!prog.length) return
    await ensureAudio()
    const beat = 60 / 120
    let t = Tone.now()
    prog.forEach(ch => {
      synths.poly.triggerAttackRelease(chordNotes(ch), beat*2, t)
      t += beat*2
    })
  }

  async function playMelody() {
    if (!melody.length) return
    await ensureAudio()
    const beat = 60 / 100
    let t = Tone.now()
    melody.forEach(n => {
      synths.synth.triggerAttackRelease(n+'4', beat, t)
      t += beat
    })
  }

  return (
    <div style={{padding:24, color:'#e8ebff', background:'#0f1222', minHeight:'100vh', fontFamily:'Inter, system-ui, Segoe UI, Roboto, Arial'}}>
      <h1 style={{marginBottom:6, background:'linear-gradient(135deg,#667eea,#764ba2)', WebkitBackgroundClip:'text', color:'transparent'}}>HarmonyMap – React</h1>
      <div style={{opacity:.8, marginBottom:16}}>{status}</div>

      <div style={{display:'grid', gap:16, gridTemplateColumns:'1fr 1fr'}}>
        {/* Progression */}
        <div style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, padding:16}}>
          <h3 style={{color:'#667eea', marginTop:0}}>Progression Generator</h3>

          <div style={{display:'grid', gap:10, gridTemplateColumns:'120px 1fr', alignItems:'center'}}>
            <label>Start chord</label>
            <select value={startChord} onChange={e=>setStartChord(e.target.value)}>
              {CHORDS.map(c=> <option key={c}>{c}</option>)}
            </select>

            <label>End chord</label>
            <select value={endChord} onChange={e=>setEndChord(e.target.value)}>
              {CHORDS.map(c=> <option key={c}>{c}</option>)}
            </select>

            <label>Length: {length}</label>
            <input type="range" min="3" max="8" value={length} onChange={e=>setLength(parseInt(e.target.value))}/>
          </div>

          <div style={{display:'flex', gap:10, marginTop:10}}>
            <button onClick={generateProgression}>Generate progression</button>
            <button onClick={playProg}>▶ Play</button>
          </div>

          <div style={{marginTop:12}}>
            <div style={{opacity:.8}}>Result</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
              {prog.map((c,i)=> <span key={i} style={pillStyle}>{c}</span>)}
            </div>
            {!!roman.length && <div style={{opacity:.7, marginTop:6}}>Roman: {roman.join(' - ')}</div>}
            {!!progErr && <div style={{color:'#ff9aa2', marginTop:6}}>{progErr}</div>}
          </div>
        </div>

        {/* Melody */}
        <div style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, padding:16}}>
          <h3 style={{color:'#667eea', marginTop:0}}>Melodic Pathfinder</h3>

          <div style={{display:'grid', gap:10, gridTemplateColumns:'120px 1fr', alignItems:'center'}}>
            <label>From</label>
            <select value={startNote} onChange={e=>setStartNote(e.target.value)}>
              {NOTES.map(n=> <option key={n}>{n}</option>)}
            </select>

            <label>To</label>
            <select value={endNote} onChange={e=>setEndNote(e.target.value)}>
              {NOTES.map(n=> <option key={n}>{n}</option>)}
            </select>

            <label>Scale</label>
            <select value={scale} onChange={e=>setScale(e.target.value)}>
              {SCALES.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div style={{display:'flex', gap:10, marginTop:10}}>
            <button onClick={findMelodicPath}>Find path</button>
            <button onClick={playMelody}>▶ Play Melody</button>
          </div>

          <div style={{marginTop:12}}>
            <div style={{opacity:.8}}>Result</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
              {melody.map((n,i)=> <span key={i} style={pillStyle}>{n}</span>)}
            </div>
            {!!melErr && <div style={{color:'#ff9aa2', marginTop:6}}>{melErr}</div>}
          </div>
        </div>
      </div>

      {/* Optional: show we got graph data */}
      {graph && (
        <div style={{opacity:.7, marginTop:16, fontSize:12}}>
          Graph loaded: {graph.nodes?.length} nodes, {graph.edges?.length} edges
        </div>
      )}
    </div>
  )
}

const pillStyle = {
  padding:'8px 12px',
  borderRadius:10,
  background:'linear-gradient(135deg,#667eea,#764ba2)',
  boxShadow:'0 6px 16px rgba(102,126,234,.25)',
  fontWeight:700
}
