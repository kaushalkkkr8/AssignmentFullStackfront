import { useCallback, useEffect, useState } from "react";
import { handleError, handleSuccess } from "../utils";

const EditProfile = () => {
  const avtar = "https://i.pinimg.com/736x/2a/86/6f/2a866f7847e6f50c86a1ab8e406f5520.jpg";
  const [data, setData] = useState([]);
  let [logInData, setLogInData] = useState(null);

  const [updateInfo, setUpdateInfo] = useState({
    name: "",
    email: "",
    skill: [],
    interests: [],
    role: "",
    bio: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

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
        setData(result); // Store profiles if result1 is an array
      }

      if (result2?.profile) {
        setLogInData(result2.profile); // Set logged-in user profile
      }
    } catch (err) {
      handleError(err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  logInData = data?.find((log) => log._id === logInData.id);

  const handleSkillChange = (event) => {
    const options = Array.from(event.target.selectedOptions).map((option) => option.value);

    setSelectedSkills((prev) => {
      const newOptions = options.filter((option) => !prev.includes(option));
      return [...prev, ...newOptions];
    });

    setUpdateInfo((prev) => ({
      ...prev,
      skill: Array.from(new Set([...prev.skill, ...options])),
    }));
  };

  const handleInterestsChange = (event) => {
    const options = Array.from(event.target.selectedOptions).map((option) => option.value);

    setSelectedInterests((prev) => {
      const newOptions = options.filter((option) => !prev.includes(option));
      return [...prev, ...newOptions];
    });

    setUpdateInfo((prev) => ({
      ...prev,
      interests: Array.from(new Set([...prev.interests, ...options])),
    }));
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
    setUpdateInfo((prev) => ({
      ...prev,
      skill: prev.skill.filter((skill) => skill !== skillToRemove),
    }));
  };

  const removeInterest = (interestToRemove) => {
    setSelectedInterests((prev) => prev.filter((interest) => interest !== interestToRemove));
    setUpdateInfo((prev) => ({
      ...prev,
      interests: prev.interests.filter((interest) => interest !== interestToRemove),
    }));
  };

  useEffect(() => {
    if (logInData) {
      setUpdateInfo((prevInfo) => ({
        ...prevInfo,
        name: logInData.name,
        email: logInData.email,
        skill: logInData.skill,
        interests: logInData.interests,
        role: logInData.role,
        bio: logInData.bio,
      }));

      setSelectedSkills(logInData.skill);
      setSelectedInterests(logInData.interests);
    }
  }, [logInData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    const { name, role, skill, interests, bio } = updateInfo;

    if (!name || !role || !skill.length || !interests.length || !bio) {
      return console.error("Name, Role, Skill, Interests, and Bio are required fields.");
    }

    try {
      const url = `https://assignment-full-stack-backendd.vercel.app/auth/updateprofile`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
    
        handleSuccess("Profile Updated Successfully");
        await fetchProfile();
      } else if (error) {
        console.error("Error:", error);
      } else {
        console.error("Error:", message);
      }
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  };

  return (
    <>
      <div className="container my-3">
        <div className="row">
          <div className="col-md-8 mt-3">
            <div className="card">
              <div className="card-body">
                <h3>Edit Profile</h3>
                <form onSubmit={submitUpdate}>
                  <label className="form-label">Name</label>
                  <input type="text" name="name" className="form-control" value={updateInfo.name} onChange={handleInputChange}  required/>

                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={updateInfo.email} onChange={handleInputChange} disabled />

                  <label className="form-label">Skill</label>
                  <select className="form-select"  onChange={handleSkillChange} value={selectedSkills} required>
                    <option value="Full-Stack Developer">Full-Stack Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="HR">HR</option>
                  </select>

                  <div>
                    {selectedSkills.length > 0 && (
                      <ul className="d-flex mx-1 flex-wrap">
                        {selectedSkills.map((skill) => (
                          <li key={skill} className="my-1 d-flex align-items-center" style={{ listStyle: "none" }}>
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              type="button"
                              className="btn-close ms-1"
                              aria-label="Close"
                            ></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <label className="form-label">Interests</label>
                  <select className="form-select"  onChange={handleInterestsChange} value={selectedInterests} required>
                    <option value="Coding">Coding</option>
                    <option value="Traveling">Traveling</option>
                    <option value="Sleeping">Sleeping</option>
                    <option value="Gym">Gym</option>
                    <option value="Exploring">Exploring</option>
                    <option value="Clubbing">Clubbing</option>
                  </select>

                  <div>
                    {selectedInterests.length > 0 && (
                      <ul className="d-flex mx-1 flex-wrap">
                        {selectedInterests.map((interest) => (
                          <li key={interest} className="my-1 d-flex align-items-center" style={{ listStyle: "none" }}>
                            {interest}
                            <button
                              onClick={() => removeInterest(interest)}
                              type="button"
                              className="btn-close ms-1"
                              aria-label="Close"
                            ></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <label className="form-label">Role</label>
                  <select name="role" className="form-select" value={updateInfo.role} onChange={handleInputChange} required>
                    <option value=""></option>
                    <option value="Mentor">Mentor</option>
                    <option value="Mentee">Mentee</option>
                  </select>

                  <label className="form-label">Bio</label>
                  <input type="text" name="bio" className="form-control" value={updateInfo.bio} onChange={handleInputChange} required/>

                  <button type="submit" className="btn btn-success w-100 mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-4 h-100 mt-3">
            <div className="card" style={{ minHeight: "500px" }}>
              <img src={avtar} className="img-fluid" alt="..." style={{ maxHeight: "250px", width: "100%", objectFit: "top" }} />
              <div className="card-body">
                <h5 className="card-title">{logInData?.name || "N/A"}</h5>
                <p className="card-text">{logInData?.bio || "No bio provided."}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Email: {logInData?.email || "N/A"}</li>
                <li className="list-group-item">Role: {logInData?.role || "N/A"}</li>
                <li className="list-group-item">Skills: {logInData?.skill.join(", ") || "N/A"}</li>
                <li className="list-group-item">Interests: {logInData?.interests.join(", ") || "N/A"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
