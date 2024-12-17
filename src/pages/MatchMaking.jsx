import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MatchMaking = () => {
  const avtar = "https://i.pinimg.com/736x/2a/86/6f/2a866f7847e6f50c86a1ab8e406f5520.jpg";
  const [data, setData] = useState([]);
  let [logInData, setLogInData] = useState(null);
  const [otherProfile, setOtherProfile] = useState(null);

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
        setLogInData(result2.profile); // Set logged-in user profile
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  logInData = data?.find((log) => log._id === logInData.id);

  useEffect(() => {
    if (data.length > 0 && logInData) {
      const filteredProfiles = data.filter((profile) => {
        // Make sure the profile is not the logged-in user's profile
        if (profile._id !== logInData._id) {
          const hasCommonSkills = profile.skill?.some(skill => logInData.skill?.includes(skill));
          const hasCommonInterests = profile.interests?.some(interest => logInData.interests?.includes(interest));
  
          // Return profiles that have common skills or interests
          return hasCommonSkills || hasCommonInterests;
        }
        return false; // Exclude the logged-in user's profile
      });
  
      setOtherProfile(filteredProfiles); // Set the filtered profiles
    }
  }, [data, logInData]);

  if (logInData === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container my-3">
     
          <div className="card-body">
            <div className="row">
              {otherProfile && otherProfile.length > 0 ? (
                otherProfile.map((profile) => (
                  <div key={profile._id} className="col-md-3">
                    <div className="card mb-3">
                      <img src={avtar} className="img-fluid" alt="..." style={{ maxHeight: "150px", width: "100%", objectFit: "top" }} />
                      <div className="card-body">
                        {profile.name ? <h5>{profile.name}</h5> : ""}
                        <p>Role: {profile.role || "Add Role"}</p>
                        <p>Interests: {profile.interests && profile.interests.length > 0 ? profile.interests.join(", ") : "Add Interests"}</p>
                        <p>Skills: {profile.skill && profile.skill.length > 0 ? profile.skill.join(", ") : "Add Skill"}</p>
                        <button className="btn btn-primary w-100">Follow</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <h4>No Matches Found</h4>
                  <p>Sorry, we couldn't find any mentors or mentees that match your profile. You may want to broaden your search criteria or try the following:</p>

                  <p>Try adding more skills or interests to your profile</p>
                  <p>Expand your search to include different areas of expertise</p>
                  <p>Consider connecting with someone outside of your immediate field</p>

                  <Link className="btn btn-secondary" to="/editprofile">
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
 
    </>
  );
};

export default MatchMaking;
