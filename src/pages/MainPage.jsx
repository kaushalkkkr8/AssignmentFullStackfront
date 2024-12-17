import { useCallback, useEffect, useState } from "react";
import NotificationList from "../components/NotificationList";

const MainPage = () => {
  const avtar = "https://i.pinimg.com/736x/2a/86/6f/2a866f7847e6f50c86a1ab8e406f5520.jpg";
  const [otherProfile, setOtherProfile] = useState(null);
  const [data, setData] = useState([]);
  let [logInData, setLogInData] = useState(null);
 

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
console.log("result",result);

      if (Array.isArray(result)) {
        setData(result);
      }

      if (result2?.profile) {
        setLogInData(result2.profile);
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
      setOtherProfile(data?.filter((log) => log._id !== logInData?._id));
    }
  }, [data, logInData]);

  


  const unFollowRequest = async (userId, profileId) => {
    try {
      const response = await fetch(`https://assignment-full-stack-backendd.vercel.app/auth/unfollow/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ targetUserId: profileId }),
      });
      const result = await response.json();
      if (result?.message === "Follow relationship removed successfully") {
        console.log("unfollow successfully");
        fetchProfile();
      } else {
        alert("Error following user.");
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };


  const addNotification = async (userId, profileId) => {

    try {
      const response = await fetch(`https://assignment-full-stack-backendd.vercel.app/auth/notification/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ targetUserId: profileId }),
      });
      const result = await response.json();

      if (result.updatedTargetProfile) {
        fetchProfile();
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };


  const followHandler = async (profileId) => {
    const isFollowing = logInData?.following?.some((f) => f.user === profileId);

    if (!isFollowing) {
     
      addNotification(logInData._id, profileId);
      fetchProfile();
    } else {
      unFollowRequest(logInData._id, profileId);
     
      fetchProfile();
    }
  };

  return (
    <>
      <div className="container my-3">
  <NotificationList/>
        <div className="card-body">
          <div className="row">
            {otherProfile &&
              otherProfile.map((profile) => (
                <div key={profile._id} className="col-md-3">
                  <div key={profile._id} className="card mb-3" style={{ minHeight: "400px" }}>
                    <img src={avtar} className="img-fluid" alt="..." style={{ maxHeight: "150px", width: "100%", objectFit: "top" }} />
                    <div className="card-body">
                      {profile.name ? <h5>{profile.name}</h5> : ""}
                      <p>Role: {profile.role ? profile.role : "Add Role"}</p>
                      <p>Interests: {profile.interests.length > 0 ? profile.interests.join(", ") : "Add Interests"}</p>
                      <p>Skills: {profile.skill.length > 0 ? profile.skill.join(", ") : "Add Skill"}</p>
                      <div
                        className="d-flex"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          right: "10px",
                        }}
                      >
                        <button className="btn btn-primary w-100" onClick={() => followHandler(profile._id)}>
                          {logInData?.following?.some((f) => f.user === profile._id) ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
