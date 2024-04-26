import { Link } from "react-router-dom";
import "./index.css";
import Navbar from "../Navbar";
import Auth from "../../utils/auth";
import logo from "../../assets/htlogo.jpg";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="">
      <div className="flex-container-row">
        <div className="flex-container-row">
          <div>
            <img src={logo} alt="HT Project Manager logo" />
          </div>
          <div>
            <Link to="/">
              <h1>HT Project Manager</h1>
            </Link>
            <p>Project management made easy</p>
          </div>
        </div>
        {Auth.loggedIn() ? (
          <div className="flex-container-column login">
            <div>
                Welcome {Auth.getUser().authenticatedPerson.username}!
            </div>
            <div>
              <button className="login" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-container-column">
            <div className="login">
              <Link className="" to="/login">
                Login
              </Link>
            </div>
            <div className="login">
              <p>New user?</p>
              <Link className="" to="/signup">
                Start here
              </Link>
            </div>
          </div>
        )}
      </div>
      <div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
