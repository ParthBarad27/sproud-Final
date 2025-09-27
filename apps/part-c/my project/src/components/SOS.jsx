import axios from 'axios'
import { useState } from 'react'

export default function SOS(){
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function validPhone(p){ return /^\+?\d{10,15}$/.test(p.trim()) }

  async function send(){
    setLoading(true); setStatus(null)
    if(!validPhone(phone)) { setLoading(false); setError('Enter a valid phone number (10-15 digits).'); return }
    setError('')
    try{
      const res = await axios.post('/api/sos', { name:'Anon', phone, relation:'Friend', details:'Triggered from frontend' })
      setStatus(res.data.result || res.data)
    } catch(err){
      setStatus({ ok:false, message:'No backend or error: SOS recorded locally' })
      const arr = JSON.parse(localStorage.getItem('sos')||'[]'); arr.unshift({ phone, date:new Date().toISOString() }); localStorage.setItem('sos', JSON.stringify(arr))
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <h2>SOS & Crisis Alert</h2>
      <div className="card p-3">
        <label>Emergency phone</label>
        <input className="form-control w-50 mb-2" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+911234567890" />
        {error && <div className="text-danger small mb-2">{error}</div>}
        <button className="btn btn-danger" onClick={send} disabled={loading}>{loading? 'Sending...':'Send SOS'}</button>
        {status && <div className="mt-3"><pre>{JSON.stringify(status,null,2)}</pre></div>}
      </div>
    </div>
  )
}
