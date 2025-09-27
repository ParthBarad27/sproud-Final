import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

export default function MoodTracker(){
  const [moods, setMoods] = useState([])
  const [mood, setMood] = useState('neutral')
  const [score, setScore] = useState(2)
  const [note, setNote] = useState('')

  useEffect(()=> setMoods(JSON.parse(localStorage.getItem('moods')||'[]')),[])

  function save(){
    const rec = { mood, moodScore: Number(score), note, date: new Date().toISOString() }
    const arr = [rec,...moods].slice(0,200)
    setMoods(arr); localStorage.setItem('moods', JSON.stringify(arr))
    const days = new Set(arr.map(m=>new Date(m.date).toISOString().slice(0,10)))
    let streak = 0; const today=new Date()
    for(let i=0;i<7;i++){ const d=new Date(today); d.setDate(today.getDate()-i); if(days.has(d.toISOString().slice(0,10))) streak++; else break }
    if(streak>=7){ const badges=JSON.parse(localStorage.getItem('badges')||'[]'); badges.unshift({badgeName:'7-day mood streak', description:'Logged moods 7 days straight', earnedAt:new Date().toISOString(), nickname:'Anon'}); localStorage.setItem('badges', JSON.stringify(badges.slice(0,50))) }
  }

  const labels = moods.slice().reverse().map(m=>new Date(m.date).toLocaleDateString())
  const values = moods.slice().reverse().map(m=>m.moodScore || 2)

  return (
    <div className="container">
      <h2>Mood Journal</h2>
      <div className="card p-3 mb-3">
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select w-25" value={mood} onChange={e=>setMood(e.target.value)}>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="anxious">Anxious</option>
          </select>
          <select className="form-select w-25" value={score} onChange={e=>setScore(e.target.value)}>
            <option value="3">3 - Best</option>
            <option value="2">2</option>
            <option value="1">1</option>
            <option value="0">0 - Worst</option>
          </select>
          <input className="form-control" value={note} onChange={e=>setNote(e.target.value)} placeholder="Short note (optional)" />
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>

      <div className="card p-3">
        <h5>Mood Trend</h5>
        <Line data={{ labels, datasets:[{ label:'Mood Score', data: values, borderColor:'#5b8def' }] }} />
      </div>
    </div>
  )
}
