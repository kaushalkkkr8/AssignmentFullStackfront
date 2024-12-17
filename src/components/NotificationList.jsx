import { useCallback, useEffect, useState } from "react";

const NotificationList = () => {
  const [data, setData] = useState([]);
  let [logInData, setLogInData] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const url = "http://localhost:4000/auth/profiles";
      const url2 = "http://localhost:4000/auth/profile";
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

  const removeNotification = async (userId, profileId) => {
    try {
      const response = await fetch(`https://assignment-full-stack-backendd.vercel.app/auth/removenotification/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ targetUserId: profileId }),
      });
      const result = await response.json();
      if (result.ok || result.message === "Follow relationship removed successfully") {
        fetchProfile();
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const followRequest = async (userId, profileId) => {
    console.log("userId", userId);
    console.log("profileId", profileId);

    try {
      const response = await fetch(`https://assignment-full-stack-backendd.vercel.app/auth/follow/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ targetUserId: profileId }),
      });
      const result = await response.json();
      if (result?.message === "Follow relationship added successfully") {
        console.log("follow successfully");
        fetchProfile();
      } else {
        alert("Error following user.");
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const followHandler = async (profileId) => {
    followRequest( profileId,logInData._id);
    removeNotification(logInData._id, profileId);

    fetchProfile();
  };

  const removeRequest = async (profileId) => {
    removeNotification(logInData._id, profileId);

    fetchProfile();
  };

  return (
    <div className="my-3">
      <h4>Notifications</h4>
      {logInData?.notifications?.length > 0 ? (
        logInData?.notifications.map((notification, index) => {
          const dataOfReq = data?.find((per) => per._id === notification.user);
          console.log("dataOfReq", dataOfReq);

          return (
            <>
              <div key={index} className="alert alert-info">
                <div class="d-flex justify-content-between align-items-center">
                  <h3>{dataOfReq.name}</h3>
                  <div>
                    <h4>Wants to follow you</h4>
                    <p>{new Date(notification.timestamp).toLocaleString()}</p>
                  </div>
                  <p>
                    <button onClick={() => followHandler(dataOfReq._id)} className="btn btn-success">
                      Accept
                    </button>
                    <button onClick={() => removeRequest(dataOfReq._id)} className="btn btn-danger mx-2">
                      Reject
                    </button>
                  </p>
                </div>
              </div>
            </>
          );
        })
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default NotificationList;
