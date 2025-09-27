import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand brand" to="/">MindCare</Link>
        <div className="d-flex align-items-center">
          <ul className="navbar-nav me-3">
            <li className="nav-item"><NavLink className="nav-link" to="/">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/assessments">Assessments</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/academic">Academic</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/sleep">Sleep & Lifestyle</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/mood">Mood</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/risk">Risk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/community">Community</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gamification">Gamification</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/sos">SOS</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/goals">Goals</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/reports">Reports</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/settings">Settings</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
