import { useState } from "react";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RefreshHandeler from "./RefreshHandler";
import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import MatchMaking from "./pages/MatchMaking";
import Profile from "./pages/Profile";

function App() {
  const [isauthenticated, setIsauthenticated] = useState();
  const PrivateRoute = ({ element }) => {
    return isauthenticated ? element : <Navigate to="/" />;
  };
  return (
    <div className="App">
      {isauthenticated && <Navbar />}
      <RefreshHandeler setIsauthenticated={setIsauthenticated} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainPage" element={<PrivateRoute element={<MainPage />} />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matchmaking" element={<MatchMaking />} />
      </Routes>
    </div>
  );
}

export default App;
