import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RefreshHandeler = ({ setIsauthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsauthenticated(true);
      if ( location.pathname === "/signup" || location.pathname === "/") {
        navigate("/mainPage", { replace: false });
      }
    }
  }, [setIsauthenticated, location, navigate]);

  return null;
};
export default RefreshHandeler;
