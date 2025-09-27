import { useState } from 'react'
import axios from 'axios'

export default function Risk(){
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function compute(){
    setLoading(true)
    const assessments = JSON.parse(localStorage.getItem('assessments')||'[]')
    const moods = JSON.parse(localStorage.getItem('moods')||'[]')
    const phq = assessments.find(a=>a.type==='PHQ-9')?.score || 0
    const moodScores = moods.slice(-14).map(m=>m.moodScore || 2)
    try{
      const res = await axios.post('/api/risk', { latestAssessmentScore: phq, recentMoodScores: moodScores })
      setResult(res.data)
    } catch(err){
      const a = (phq||0)/27
      const avg = moodScores.length ? moodScores.reduce((s,v)=>s+v,0)/moodScores.length : 2
      const m = (3-avg)/3
      const score = (0.75*a)+(0.25*m)
      const level = score>=0.7?'High':score>=0.4?'Medium':'Low'
      setResult({ level, score })
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <h2>Risk Assessment</h2>
      <div className="card p-3">
        <p>Compute an estimated risk level using recent assessments and mood trends.</p>
        <button className="btn btn-primary" onClick={compute} disabled={loading}>{loading? 'Computing...':'Compute Risk'}</button>
        {result && <div className="mt-3"><strong>Level:</strong> {result.level} <div className="small-muted">score: {result.score.toFixed(2)}</div></div>}
      </div>
    </div>
  )
}
