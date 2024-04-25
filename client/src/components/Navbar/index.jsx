import { NavLink } from "react-router-dom";
import "./index.css";

export default function Nav() {
  return (
    <nav className="nav-container">
      <ul>
          <NavLink
            to="/"
            className={({ isActive }) => 
              isActive ? "nav-link nav-active" : "nav-link"}
          >
            Home
          </NavLink>
          <NavLink
            to="/disciplines"
            className={({ isActive }) => 
              isActive ? "nav-link nav-active" : "nav-link"}
          >
            Disciplines
          </NavLink>
          <NavLink
            to="/resources"
            className={({ isActive }) => 
              isActive ? "nav-link nav-active" : "nav-link"}
          >
            Resources
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => 
              isActive ? "nav-link nav-active" : "nav-link"}
          >
            Tasks
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) => 
              isActive ? "nav-link nav-active" : "nav-link"}
          >
            Features
          </NavLink>
      </ul>
    </nav>
  );
}
