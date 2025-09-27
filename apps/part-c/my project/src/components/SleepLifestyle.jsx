import { useState, useEffect } from 'react'

export default function SleepLifestyle(){
  const [sleepLogs, setSleepLogs] = useState([])
  const [hours, setHours] = useState(7)
  const [habit, setHabit] = useState('Exercise')
  const [habits, setHabits] = useState([])

  useEffect(()=>{
    setSleepLogs(JSON.parse(localStorage.getItem('sleep')||'[]'))
    setHabits(JSON.parse(localStorage.getItem('habits')||'[]'))
  },[])

  function addSleep(){
    const rec = { hours, date:new Date().toISOString() }
    const arr = [rec].concat(sleepLogs).slice(0,60)
    setSleepLogs(arr); localStorage.setItem('sleep', JSON.stringify(arr))
  }

  function addHabit(){ if(!habit) return; const arr = [habit,...habits].slice(0,50); setHabits(arr); localStorage.setItem('habits', JSON.stringify(arr)); setHabit('') }

  return (
    <div className="container">
      <h2>Sleep & Lifestyle</h2>
      <div className="card p-3 mb-3">
        <label>Hours slept last night</label>
        <input type="number" min="0" max="24" value={hours} onChange={e=>setHours(Number(e.target.value))} className="form-control w-25" />
        <button className="btn btn-primary mt-2" onClick={addSleep}>Add Sleep Log</button>
        <div className="mt-3"><strong>Recent sleep logs:</strong>
          <ul>{sleepLogs.map((s,i)=>(<li key={i}>{new Date(s.date).toLocaleDateString()} — {s.hours} hrs</li>))}</ul>
        </div>
      </div>

      <div className="card p-3">
        <h5>Daily habit tracking</h5>
        <div className="d-flex gap-2">
          <input className="form-control w-50" value={habit} onChange={e=>setHabit(e.target.value)} placeholder="Add habit (e.g., Meditation)" />
          <button className="btn btn-outline-primary" onClick={addHabit}>Add</button>
        </div>
        <div className="mt-3"><strong>Habits:</strong><ul>{habits.map((h,i)=>(<li key={i}>{h}</li>))}</ul></div>
      </div>
    </div>
  )
}
