import { useMemo, useState } from 'react'

const TESTS = {
  'PHQ-9': {
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself — or that you are a failure?",
      "Trouble concentrating on things?",
      "Moving or speaking slowly or being fidgety?",
      "Thoughts that you would be better off dead, or of hurting yourself?"
    ],
    max:27,
    interpret: (s)=> s>=20? 'Severe': s>=15? 'Moderately severe': s>=10? 'Moderate': s>=5? 'Mild' : 'Minimal'
  },
  'GAD-7': {
    questions:[
      "Feeling nervous, anxious or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless it's hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid as if something awful might happen?"
    ],
    max:21,
    interpret:(s)=> s>=15? 'Severe': s>=10? 'Moderate': s>=5? 'Mild' : 'Minimal'
  },
  'GHQ-12': {
    questions:[...Array(12)].map((_,i)=>`GHQ item ${i+1}`),
    max:36,
    interpret:(s)=> s>20? 'High distress': s>12? 'Moderate distress':'Low distress'
  },
  'DASS-21': {
    questions:[...Array(21)].map((_,i)=>`DASS item ${i+1}`),
    max:63,
    interpret:(s)=> s>60? 'Extremely severe': s>45? 'Severe': s>30? 'Moderate':'Mild/Normal'
  }
}

export default function Assessments(){
  const [test, setTest] = useState('PHQ-9')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [lastResult, setLastResult] = useState(null)

  const Qs = useMemo(()=> TESTS[test].questions, [test])
  const totalSteps = Qs.length
  const progressPct = Math.round(((step)/totalSteps)*100)

  function setAnswer(q,v){ setAnswers(prev=>({...prev,[q]:Number(v)})) }

  function next(){ if(step < totalSteps-1) setStep(step+1) }
  function back(){ if(step > 0) setStep(step-1) }

  function submit(){
    const arr = Array.from({length: totalSteps}).map((_,i)=> answers[i]||0)
    const score = arr.reduce((s,n)=>s+n,0)
    const rec = { type:test, answers:arr, score, date: new Date().toISOString() }
    const existing = JSON.parse(localStorage.getItem('assessments')||'[]')
    existing.unshift(rec)
    localStorage.setItem('assessments', JSON.stringify(existing.slice(0,200)))
    setLastResult(rec)
    if(score >= Math.floor(TESTS[test].max*0.8)){
      const badges = JSON.parse(localStorage.getItem('badges')||'[]')
      badges.unshift({ badgeName: `${test} completed`, description:`Completed ${test}`, earnedAt:new Date().toISOString(), nickname:'Anon' })
      localStorage.setItem('badges', JSON.stringify(badges.slice(0,50)))
    }
  }

  return (
    <div className="container">
      <h2>Assessments</h2>
      <div className="card p-3 mb-3">
        <label>Select test</label>
        <select className="form-select w-50 mb-3" value={test} onChange={e=>{setTest(e.target.value); setAnswers({}); setStep(0)}}>
          {Object.keys(TESTS).map(k=><option key={k} value={k}>{k}</option>)}
        </select>

        <div className="mb-2">
          <div className="small-muted">Progress: {progressPct}%</div>
          <div className="progress" style={{height:6}}>
            <div className="progress-bar" role="progressbar" style={{width: progressPct+'%'}}></div>
          </div>
        </div>

        <form onSubmit={e=>{e.preventDefault(); submit()}}>
          <div className="mb-2">
            <div><strong>Q{step+1}.</strong> {Qs[step]}</div>
            <div className="d-flex gap-3 mt-2">
              {[0,1,2,3].map(val=> (
                <label key={val} className="form-check-label">
                  <input className="form-check-input me-1" type="radio" name={`q-${step}`} checked={(answers[step]||0)===val} onChange={()=>setAnswer(step,val)} />
                  {val} {val===0? 'Not at all': val===1? 'Several days': val===2? 'More than half the days':'Nearly every day'}
                </label>
              ))}
            </div>
          </div>

          <div className="d-flex gap-2 mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={back} disabled={step===0}>Back</button>
            {step < totalSteps-1 ? (
              <button type="button" className="btn btn-primary" onClick={next}>Next</button>
            ) : (
              <button className="btn btn-success" type="submit">Submit</button>
            )}
          </div>
        </form>

        <DynamicInterpret test={test} answers={answers} />

        {lastResult && <div className="mt-3"><strong>Last score:</strong> {lastResult.score} — {TESTS[lastResult.type].interpret(lastResult.score)}</div>}
      </div>
    </div>
  )
}

function DynamicInterpret({ test, answers }){
  const Qs = TESTS[test].questions
  const arr = Array.from({length:Qs.length}).map((_,i)=> answers[i]||0)
  const score = arr.reduce((s,n)=>s+n,0)
  const interp = TESTS[test].interpret(score)
  return (
    <div className="mt-3">
      <div><strong>Current score:</strong> {score}/{TESTS[test].max} — {interp}</div>
      <div className="small-muted">Adjust your answers to see how interpretation changes in real-time.</div>
    </div>
  )
}
