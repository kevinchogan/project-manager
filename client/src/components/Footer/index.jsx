import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="">
      <div className="">
        <h4>
          <a href="https://kevinhogansprofile.netlify.app/" target="_blank">
            Find me <span>❤️</span> HERE
          </a>
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
