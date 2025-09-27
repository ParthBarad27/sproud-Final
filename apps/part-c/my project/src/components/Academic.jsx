import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function Academic(){
  const [courseLoad, setCourseLoad] = useState(3)
  const [stress, setStress] = useState(3)
  const [gpa, setGpa] = useState(3.5)
  const [results, setResults] = useState(null)
  const [credits, setCredits] = useState(15)
  const [studyHours, setStudyHours] = useState(14)
  const [gradeExpectation, setGradeExpectation] = useState('B')

  const normalized = useMemo(()=>{
    const cl = Math.min(Math.max(courseLoad,0), 6)
    const st = Math.min(Math.max(stress,1), 5)
    const gp = Math.min(Math.max(gpa,0), 4)
    return { cl, st, gp }
  },[courseLoad, stress, gpa])

  function analyze(){
    const cl = normalized.cl/6 // heavier loads increase risk
    const st = normalized.st/5 // subjective stress
    const gp = (4 - normalized.gp)/4 // lower GPA increases risk
    const creditFactor = Math.min(Math.max((credits-12)/12, 0), 1) // 12 credits baseline
    const hoursPerCredit = credits? (studyHours/credits) : 0
    const hoursFactor = Math.max(0, 1 - (hoursPerCredit/2)) // less than 2 hrs/credit raises risk
    const expectationFactor = ({'A':0.2,'B':0.1,'C':0.05,'D':0}[gradeExpectation] ?? 0.1)
    const score = (0.35*cl) + (0.25*st) + (0.15*gp) + (0.15*creditFactor) + (0.1*hoursFactor) + expectationFactor*0.0
    const level = score>=0.7? 'High' : score>=0.4? 'Medium' : 'Low'
    const rec = { courseLoad:normalized.cl, stress:normalized.st, gpa:normalized.gp, credits, studyHours, gradeExpectation, level, score:score.toFixed(2), date:new Date().toISOString() }
    const arr = JSON.parse(localStorage.getItem('academic')||'[]'); arr.unshift(rec); localStorage.setItem('academic', JSON.stringify(arr.slice(0,50)))
    setResults(rec)
  }

  return (
    <div className="container">
      <h2>Academic Stress Assessment</h2>
      <div className="card p-3 mb-3">
        <label>Course load (number of major courses)</label>
        <input type="range" min="0" max="6" value={courseLoad} onChange={e=>setCourseLoad(Number(e.target.value))} />
        <div>Selected: {courseLoad}</div>

        <label className="mt-2">Self-rated stress (1-5)</label>
        <select value={stress} onChange={e=>setStress(Number(e.target.value))} className="form-select w-25">
          <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option>
        </select>

        <label className="mt-2">GPA (0.0 - 4.0)</label>
        <input type="number" step="0.1" min="0" max="4" value={gpa} onChange={e=>setGpa(Number(e.target.value))} className="form-control w-25" />

        <div className="row mt-3 g-2">
          <div className="col-md-4">
            <label>Credits this term</label>
            <input type="number" min="0" max="24" value={credits} onChange={e=>setCredits(Number(e.target.value))} className="form-control" />
          </div>
          <div className="col-md-4">
            <label>Weekly study hours</label>
            <input type="number" min="0" max="80" value={studyHours} onChange={e=>setStudyHours(Number(e.target.value))} className="form-control" />
          </div>
          <div className="col-md-4">
            <label>Grade expectation</label>
            <select className="form-select" value={gradeExpectation} onChange={e=>setGradeExpectation(e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D or below</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={analyze}>Analyze</button>
        {results && <div className="mt-3">
          <strong>Stress level:</strong> {results.level} (score {results.score})
          <Recommendations result={results} />
        </div>}
      </div>

      <div className="card p-3">
        <h5>Study Effort vs Load (recent)</h5>
        <AcademicChart />
      </div>
    </div>
  )
}

function Recommendations({ result }){
  const tips = []
  if(result.level === 'High'){
    tips.push('Talk to an academic advisor about course load adjustments.')
    tips.push('Schedule focused blocks with breaks (Pomodoro).')
    tips.push('Use campus counseling resources if stress persists.')
  } else if(result.level === 'Medium'){
    tips.push('Plan weekly study goals and track progress.')
    tips.push('Join a study group for challenging courses.')
  } else {
    tips.push('Maintain current habits and check-in weekly.')
  }
  if(result.gpa < 2.5){ tips.push('Visit tutoring center for GPA support.') }
  if(result.courseLoad >= 5){ tips.push('Consider dropping a non-essential course early.') }
  return (
    <div className="mt-2">
      <div><strong>Recommendations</strong></div>
      <ul>{tips.map((t,i)=>(<li key={i}>{t}</li>))}</ul>
    </div>
  )
}

function AcademicChart(){
  const hist = JSON.parse(localStorage.getItem('academic')||'[]').slice(0,10).reverse()
  const labels = hist.map(h=> new Date(h.date).toLocaleDateString())
  const load = hist.map(h=> h.courseLoad)
  const hours = hist.map(h=> h.studyHours ?? 0)
  return (
    <div className="chart-card">
      <Line data={{
        labels,
        datasets:[
          { label:'Course Load', data: load, borderColor:'#ef4444', tension:0.3 },
          { label:'Weekly Study Hours', data: hours, borderColor:'#10b981', tension:0.3 }
        ]
      }} />
    </div>
  )
}
