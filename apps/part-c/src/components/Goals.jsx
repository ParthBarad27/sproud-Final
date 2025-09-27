import { useEffect, useState } from 'react'

export default function Goals(){
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  useEffect(()=>{ setGoals(JSON.parse(localStorage.getItem('goals')||'[]')) },[])

  function addGoal(){
    if(!title.trim()) return
    const g = { id: crypto.randomUUID?.() || String(Date.now()), title: title.trim(), due, done:false, createdAt:new Date().toISOString() }
    const arr = [g, ...goals].slice(0,100)
    setGoals(arr); localStorage.setItem('goals', JSON.stringify(arr))
    setTitle(''); setDue('')
  }

  function toggle(id){
    const arr = goals.map(g=> g.id===id? {...g, done:!g.done, completedAt: !g.done? new Date().toISOString(): undefined } : g)
    setGoals(arr); localStorage.setItem('goals', JSON.stringify(arr))
  }

  function remove(id){
    const arr = goals.filter(g=> g.id!==id)
    setGoals(arr); localStorage.setItem('goals', JSON.stringify(arr))
  }

  const doneCount = goals.filter(g=>g.done).length

  return (
    <div className="container">
      <h2>Goals & Reminders</h2>
      <div className="card p-3 mb-3">
        <div className="d-flex gap-2 flex-wrap">
          <input className="form-control" placeholder="New goal (e.g., 10-min meditation)" value={title} onChange={e=>setTitle(e.target.value)} />
          <input type="date" className="form-control" value={due} onChange={e=>setDue(e.target.value)} />
          <button className="btn btn-primary" onClick={addGoal}>Add</button>
        </div>
        <div className="mt-3 small-muted">Progress: {doneCount}/{goals.length} completed</div>
      </div>

      <div className="card p-3">
        {goals.length===0 && <div className="small-muted">No goals yet — add one above.</div>}
        <ul className="list-unstyled mb-0">
          {goals.map(g=> (
            <li key={g.id} className="d-flex align-items-center justify-content-between border-bottom py-2">
              <div>
                <input className="form-check-input me-2" type="checkbox" checked={g.done} onChange={()=>toggle(g.id)} />
                <strong className={g.done? 'text-decoration-line-through':''}>{g.title}</strong>
                {g.due && <span className="small-muted ms-2">due {new Date(g.due).toLocaleDateString()}</span>}
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(g.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


