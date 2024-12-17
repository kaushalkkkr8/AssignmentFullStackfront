import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const avtar = "https://i.pinimg.com/736x/2a/86/6f/2a866f7847e6f50c86a1ab8e406f5520.jpg";
  const [data, setData] = useState([]);
  let [logInData, setLogInData] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const url = "https://assignment-full-stack-backendd.vercel.app/auth/profiles";
      const url2 = "https://assignment-full-stack-backendd.vercel.app/auth/profile";
      const headers = {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      };
      const response = await fetch(url, headers);
      const response2 = await fetch(url2, headers);
      const result = await response.json();
      const result2 = await response2.json();

      if (Array.isArray(result)) {
        setData(result); // Store profiles if result is an array
      }

      if (result2?.profile) {
        setLogInData(result2.profile); // Set logged-in logInData profile
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Find the logged-in logInData's data
  logInData =  data.find((log) => log._id === logInData.id);


  

  const handleDeleteProfile = async () => {
    if (!logInData) {
      alert("Profile data is not available.");
      return;
    }
  
    const confirmation = window.confirm("Are you sure you want to delete your profile?");
    console.log("confilr",confirmation);
    
    if (confirmation) {
      try {
        console.log("Attempting to delete profile:", logInData._id);
        const response = await fetch(
          `https://assignment-full-stack-backendd.vercel.app/auth/deleteprofile/${logInData._id}`,
          {
            method: "DELETE",
          }
        );
  
     
        const result = await response.json();
  
        if (result.success) {
          alert("Profile deleted successfully.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          alert(result.message || "Error deleting profile.");
        }
      } catch (err) {
        console.error("Error deleting profile:", err);
        alert("An error occurred while deleting your profile. Please try again.");
      }
    }
  };
  


  return (
    <div className="container">
      <div className="card my-5">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={avtar} className="img-fluid rounded-start" alt="avatar" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title text-center">{logInData?.name || "N/A"}</h3>
              <p className="card-text text-center">{logInData?.bio || "No bio provided."}</p>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">Email: {logInData?.email || "N/A"}</li>
                <li className="list-group-item">Role: {logInData?.role || "N/A"}</li>
                <li className="list-group-item">Skills: {logInData?.skill.join(", ") || "N/A"}</li>
                <li className="list-group-item">Interests: {logInData?.interests.join(", ") || "N/A"}</li>
              </ul>
              <div className="text-center mt-3">
                <Link to="/editprofile" className="btn btn-success">
                  Edit Profile
                </Link>
                <button onClick={handleDeleteProfile} className="btn btn-danger mx-3">
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
