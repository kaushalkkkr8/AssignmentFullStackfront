import { Link, useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    localStorage.removeItem("token");

    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="/mainpage">
            LOGO
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/mainPage">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/matchmaking">
                  Match Making
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/profile">
                 Profile
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
