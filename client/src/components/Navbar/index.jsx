import { Link, useLocation } from 'react-router-dom';
import './index.css'

export default function Nav() {
  const currentPage = useLocation().pathname;

  return (
    <nav className="">
      <section
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
      >
        <ul className="">
          <li className="" >
            <Link to="/disciplines" >Disciplines</Link>
          </li>
        </ul>
      </section>
    </nav>
  );
}