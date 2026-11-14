import {Link,NavLink} from "react-router-dom";
export default function Navbar({user,onLogout}){
 const dash=user?.role==="doctor"?"/doctor-dashboard":"/dashboard";
 return <header className="navbar"><Link className="nav-brand" to="/">MediBook<span>.</span></Link>
 <nav className="nav-links"><NavLink to="/">Home</NavLink><NavLink to="/doctors">Doctors</NavLink>{user&&<NavLink to={dash}>Dashboard</NavLink>}{user?.role==="patient"&&<NavLink to="/appointments">My Appointments</NavLink>}</nav>
 <div className="nav-actions">{user?<><span className="welcome-user">Hi, {user.name} ({user.role})</span><button className="nav-cta secondary-cta" onClick={onLogout}>Logout</button></>:<><Link className="nav-login" to="/login">Login</Link><Link className="nav-cta" to="/signup">Sign Up</Link></>}</div></header>;
}
