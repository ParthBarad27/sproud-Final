const KEYS = ['moods','assessments','badges','posts','sleep','habits','sos','academic','points']

export function exportData(){
  const out = {}
  for(const k of KEYS){
    try{ out[k] = JSON.parse(localStorage.getItem(k)||'null') }catch{ out[k]=null }
  }
  const blob = new Blob([JSON.stringify(out,null,2)], { type:'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'mindcare-data.json'; a.click()
  URL.revokeObjectURL(url)
}

export function importData(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader()
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result)
        if(typeof data !== 'object' || !data) throw new Error('Invalid file')
        for(const k of Object.keys(data)){
          if(KEYS.includes(k)) localStorage.setItem(k, JSON.stringify(data[k]))
        }
        resolve(true)
      }catch(e){ reject(e) }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function clearAll(){
  for(const k of KEYS){ localStorage.removeItem(k) }
}

export function seedDemo(){
  const now = new Date()
  const moods = Array.from({length:14}).map((_,i)=>{
    const d = new Date(now); d.setDate(now.getDate()-i)
    return { mood:['happy','neutral','sad','anxious'][Math.floor(Math.random()*4)], moodScore: Math.floor(Math.random()*4), note:'demo', date: d.toISOString() }
  })
  const assessments = [
    { type:'PHQ-9', score: 9+Math.floor(Math.random()*10), date: now.toISOString() },
    { type:'GAD-7', score: 5+Math.floor(Math.random()*8), date: now.toISOString() }
  ]
  const badges = [{ badgeName:'Demo Starter', description:'Seeded demo data', earnedAt: now.toISOString(), nickname:'Anon' }]
  const posts = [{ title:'Welcome to MindCare', content:'This is a demo post.', date: now.toISOString(), nickname:'Anon' }]
  const sleep = Array.from({length:7}).map((_,i)=>{ const d=new Date(now); d.setDate(now.getDate()-i); return { hours: 6+Math.floor(Math.random()*3), date:d.toISOString() }})
  const habits = ['Exercise','Meditation']
  const academic = [{ courseLoad:4, stress:3, gpa:3.0, level:'Medium', score:'0.55', date: now.toISOString() }]
  const sos = []
  const points = 20
  const data = { moods, assessments, badges, posts, sleep, habits, academic, sos, points }
  for(const [k,v] of Object.entries(data)) localStorage.setItem(k, JSON.stringify(v))
}


