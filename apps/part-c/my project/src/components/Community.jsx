import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

let socket
try { socket = io('/') } catch(e){ socket = null }

export default function Community(){
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    const stored = JSON.parse(localStorage.getItem('posts')||'[]'); setPosts(stored); setLoading(false)
    if(socket){
      socket.on('newPost', p=> setPosts(prev=>[p,...prev]))
    }
  },[])

  async function submit(e){
    e.preventDefault()
    if(!title.trim() || !content.trim()) { setError('Title and content are required.'); return }
    setError('')
    const p = { title: title.trim(), content: content.trim(), date: new Date().toISOString(), nickname:'Anon' }
    try{
      await axios.post('/api/community/post', p)
    } catch(err){
      const arr=[p,...posts].slice(0,200); setPosts(arr); localStorage.setItem('posts', JSON.stringify(arr))
    }
    setTitle(''); setContent('')
  }

  return (
    <div className="container">
      <h2>Anonymous Community</h2>
      <div className="card p-3 mb-3">
        <form onSubmit={submit}>
          <input className="form-control mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="form-control mb-2" rows="3" placeholder="Write your post..." value={content} onChange={e=>setContent(e.target.value)}></textarea>
          {error && <div className="text-danger small mb-2">{error}</div>}
          <button className="btn btn-primary">Post anonymously</button>
        </form>
      </div>
      <div className="card p-3">
        <h5>Recent posts</h5>
        {loading? <div className="small-muted">Loading...</div> : posts.length===0 && <div className="small-muted">No posts yet</div>}
        {posts.map((p,i)=>(<div key={i} className="mb-2"><strong>{p.title}</strong><div>{p.content}</div><small className="small-muted">{new Date(p.date).toLocaleString()}</small></div>))}
      </div>
    </div>
  )
}
