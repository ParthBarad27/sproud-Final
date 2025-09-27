export default function Reports(){
  const moods = JSON.parse(localStorage.getItem('moods')||'[]')
  const assessments = JSON.parse(localStorage.getItem('assessments')||'[]')
  const sleep = JSON.parse(localStorage.getItem('sleep')||'[]')
  const goals = JSON.parse(localStorage.getItem('goals')||'[]')

  const avgMood = moods.length? (moods.reduce((s,m)=>s+(m.moodScore??2),0)/moods.length).toFixed(2): '—'
  const lastAssess = assessments[0] || null
  const avgSleep = sleep.length? (sleep.reduce((s,x)=>s+(x.hours||0),0)/sleep.length).toFixed(1) : '—'
  const goalsProgress = goals.length? `${goals.filter(g=>g.done).length}/${goals.length}` : '0/0'

  function printReport(){ window.print() }

  return (
    <div className="container">
      <h2>Reports</h2>
      <div className="card p-3 mb-3">
        <p className="mb-1"><strong>Average mood:</strong> {avgMood} (0-3)</p>
        <p className="mb-1"><strong>Last assessment:</strong> {lastAssess? `${lastAssess.type} = ${lastAssess.score}` : '—'}</p>
        <p className="mb-1"><strong>Average sleep (hrs):</strong> {avgSleep}</p>
        <p className="mb-0"><strong>Goals completed:</strong> {goalsProgress}</p>
      </div>
      <div className="card p-3">
        <h5>Export & Print</h5>
        <button className="btn btn-outline-primary" onClick={printReport}>Print this summary</button>
      </div>
    </div>
  )
}


