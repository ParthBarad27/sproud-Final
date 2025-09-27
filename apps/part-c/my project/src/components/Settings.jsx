import { useState } from 'react'
import { exportData, importData, clearAll, seedDemo } from '../offlineUtils'

export default function Settings(){
  const [importing, setImporting] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleImport(e){
    const file = e.target.files?.[0]
    if(!file) return
    setImporting(true); setMsg(null)
    try{ await importData(file); setMsg('Import successful. Reloading...'); setTimeout(()=>window.location.reload(), 600) }
    catch(err){ setMsg('Import failed: '+(err?.message||'Unknown error')) }
    finally{ setImporting(false) }
  }

  function handleClear(){
    if(confirm('This will clear all local data. Continue?')){ clearAll(); setMsg('Data cleared. Reloading...'); setTimeout(()=>window.location.reload(), 600) }
  }

  function handleSeed(){ seedDemo(); setMsg('Demo data seeded. Reloading...'); setTimeout(()=>window.location.reload(), 600) }

  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="card p-3 mb-3">
        <h5>Data management</h5>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={exportData}>Export data</button>
          <label className="btn btn-outline-secondary mb-0">
            Import data
            <input type="file" accept="application/json" className="d-none" onChange={handleImport} disabled={importing} />
          </label>
          <button className="btn btn-outline-warning" onClick={handleSeed}>Seed demo data</button>
          <button className="btn btn-outline-danger" onClick={handleClear}>Clear all</button>
        </div>
        {msg && <div className="mt-3 alert alert-info py-2 mb-0">{msg}</div>}
      </div>
      <div className="card p-3">
        <h5>About</h5>
        <div className="small-muted">Offline-first demo. All data is stored in your browser.</div>
      </div>
    </div>
  )
}


