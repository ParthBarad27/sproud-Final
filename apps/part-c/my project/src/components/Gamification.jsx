import { useEffect, useState } from 'react'

export default function Gamification(){
  const [badges, setBadges] = useState([])
  const [points, setPoints] = useState(0)

  useEffect(()=>{
    setBadges(JSON.parse(localStorage.getItem('badges')||'[]'))
    setPoints(JSON.parse(localStorage.getItem('points')||'0'))
  },[])

  function award(badge){
    const arr=[badge,...badges]; setBadges(arr); localStorage.setItem('badges', JSON.stringify(arr))
  }

  function addPoints(n){ const p = points + n; setPoints(p); localStorage.setItem('points', JSON.stringify(p)) }

  return (
    <div className="container">
      <h2>Gamification</h2>
      <div className="card p-3 mb-3">
        <p>Points: <strong>{points}</strong></p>
        <button className="btn btn-outline-primary me-2" onClick={()=>addPoints(10)}>Complete daily check-in (+10)</button>
        <button className="btn btn-outline-success" onClick={()=>award({badgeName:'Beta Tester', description:'Early adopter', earnedAt:new Date().toISOString()})}>Award Badge</button>
      </div>
      <div className="card p-3">
        <h5>Badges</h5>
        {badges.length===0 && <div className="small-muted">No badges yet</div>}
        <ul>{badges.map((b,i)=>(<li key={i}><strong>{b.badgeName}</strong> — {b.description} <div><small className="small-muted">{new Date(b.earnedAt).toLocaleString()}</small></div></li>))}</ul>
      </div>
    </div>
  )
}
