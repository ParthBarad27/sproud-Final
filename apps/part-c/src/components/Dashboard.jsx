import { useEffect, useState } from 'react'
import axios from 'axios'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

export default function Dashboard(){
  const [moodData, setMoodData] = useState([])
  const [assessments, setAssessments] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const localMoods = JSON.parse(localStorage.getItem('moods')||'[]')
    const localAssess = JSON.parse(localStorage.getItem('assessments')||'[]')
    const localBadges = JSON.parse(localStorage.getItem('badges')||'[]')
    setMoodData(localMoods); setAssessments(localAssess); setBadges(localBadges)
    Promise.allSettled([
      axios.get('/api/mood'),
      axios.get('/api/assessments'),
      axios.get('/api/gamification/badges')
    ]).then(([m,a,b])=>{
      if(m.status==='fulfilled') setMoodData(m.value.data)
      if(a.status==='fulfilled') setAssessments(a.value.data)
      if(b.status==='fulfilled') setBadges(b.value.data)
    }).finally(()=> setLoading(false))
  },[])

  const moodLabels = moodData.map(m=>new Date(m.date).toLocaleDateString())
  const moodValues = moodData.map(m=>m.moodScore ?? 2)

  const assessLabels = assessments.slice().reverse().map(a=>a.type || 'Assessment')
  const assessValues = assessments.slice().reverse().map(a=>a.score || 0)

  return (
    <div className="container">
      <div className="app-header mb-3">
        <div>
          <div className="brand">MindCare</div>
          <div className="small-muted">Personal wellness & student support dashboard</div>
        </div>
        <div>
          <span className="badge-pill">Anonymous • Student edition</span>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card p-3">
            <h5>Mood Trend</h5>
            <div className="chart-card">
              {loading? <div className="small-muted">Loading...</div> : moodData.length===0? <div className="small-muted">No mood data yet. Log some entries in Mood.</div> :
                <Line data={{ labels:moodLabels, datasets:[{ label:'Mood Score', data:moodValues, borderColor:'#5b8def', tension:0.3 }] }} />}
            </div>
          </div>

          <div className="card p-3 mt-3">
            <h5>Assessment Scores (recent)</h5>
            <div className="chart-card">
              {loading? <div className="small-muted">Loading...</div> : assessments.length===0? <div className="small-muted">No assessments yet. Try PHQ-9 in Assessments.</div> :
                <Bar data={{ labels:assessLabels, datasets:[{ label:'Score', data:assessValues, backgroundColor:'#f59e0b' }] }} />}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3 mb-3">
            <h6>Risk Snapshot</h6>
            <RiskSummary />
          </div>

          <div className="card p-3">
            <h6>Badges</h6>
            <ul>
              {loading? <li className="small-muted">Loading...</li> : badges.length===0 && <li className="small-muted">No badges yet — keep engaging!</li>}
              {badges.map((b,i)=>(<li key={i}><strong>{b.badgeName}</strong><div><small className="small-muted">{b.nickname||'Anon'} • {new Date(b.earnedAt).toLocaleDateString()}</small></div></li>))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskSummary(){
  const assessments = JSON.parse(localStorage.getItem('assessments')||'[]')
  const moods = JSON.parse(localStorage.getItem('moods')||'[]')
  const phq = assessments.find(a=>a.type==='PHQ-9') || null
  const latestScore = phq ? phq.score : 0
  const recentMoods = moods.slice(-14).map(m=>m.moodScore ?? 2)
  const aNorm = (latestScore || 0)/27
  const avgMood = recentMoods.length ? recentMoods.reduce((s,v)=>s+v,0)/recentMoods.length : 2
  const moodRisk = (3-avgMood)/3
  const riskValue = (0.75*aNorm)+(0.25*moodRisk)
  const level = riskValue>=0.7? 'High' : riskValue>=0.4? 'Medium' : 'Low'
  return (<div>
    <h3 style={{color: level==='High'?'#dc2626': level==='Medium'?'#f59e0b':'#16a34a'}}>{level}</h3>
    <div className="small-muted">Score: {riskValue.toFixed(2)}</div>
    <div className="mt-2"><small>Latest PHQ-9: {latestScore}</small></div>
  </div>)
}
