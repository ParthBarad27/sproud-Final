import axios from 'axios'

function read(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) }catch{ return fallback }
}

function write(key, value){
  localStorage.setItem(key, JSON.stringify(value))
}

export function initMockApi(){
  // Only attach once
  if(axios.__mockInstalled) return
  axios.__mockInstalled = true

  axios.interceptors.request.use(async (config)=>{
    if(!config.url?.startsWith('/api')) return config

    const url = new URL('http://x'+config.url) // fake base for parsing
    const path = url.pathname

    // Simple router
    if(config.method === 'get'){
      if(path === '/api/mood'){
        const moods = read('moods', [])
        return Promise.reject({ __mock:true, response:{ status:200, data: moods }})
      }
      if(path === '/api/assessments'){
        const assessments = read('assessments', [])
        return Promise.reject({ __mock:true, response:{ status:200, data: assessments }})
      }
      if(path === '/api/gamification/badges'){
        const badges = read('badges', [])
        return Promise.reject({ __mock:true, response:{ status:200, data: badges }})
      }
    }

    if(config.method === 'post'){
      if(path === '/api/risk'){
        const body = config.data || {}
        const a = (body.latestAssessmentScore || 0)/27
        const arr = Array.isArray(body.recentMoodScores)? body.recentMoodScores : []
        const avg = arr.length? arr.reduce((s,v)=>s+v,0)/arr.length : 2
        const m = (3-avg)/3
        const score = (0.75*a)+(0.25*m)
        const level = score>=0.7?'High':score>=0.4?'Medium':'Low'
        return Promise.reject({ __mock:true, response:{ status:200, data:{ level, score }}})
      }
      if(path === '/api/community/post'){
        const p = config.data
        const posts = read('posts', [])
        posts.unshift(p)
        write('posts', posts.slice(0,200))
        // Simulate socket broadcast by storing; UI already reads localStorage
        return Promise.reject({ __mock:true, response:{ status:200, data:{ ok:true }}})
      }
      if(path === '/api/sos'){
        const sos = read('sos', [])
        sos.unshift({ ...(config.data||{}), date:new Date().toISOString() })
        write('sos', sos.slice(0,200))
        return Promise.reject({ __mock:true, response:{ status:200, data:{ result:{ ok:true, message:'SOS recorded (mock)' }}}})
      }
    }

    return config
  })

  // Convert our rejected request short-circuit into fulfilled responses
  axios.interceptors.response.use(
    (res)=>res,
    (err)=>{
      if(err && err.__mock && err.response){
        return Promise.resolve(err.response)
      }
      return Promise.reject(err)
    }
  )
}

export const storage = { read, write }


