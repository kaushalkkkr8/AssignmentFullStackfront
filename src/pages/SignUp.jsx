import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const SignUp = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, name } = signupInfo;
    if (!email || !password || !name) {
      return handleError("name, email and password are required");
    }
    try {
      const url = `https://assignment-full-stack-backendd.vercel.app/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <section className="" style={{ backgroundColor: "#9A616D", height: "vh-100" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 ">
                    <img
                      src="https://thumbs.dreamstime.com/b/smart-phone-windows-background-using-back-ground-55998288.jpg"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 1rem 1rem 1rem" }}
                    />
                  </div>
                  <div className="col-md-6  d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSignup}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <h1 className="fw-bold mb-0">Company Logo</h1>
                        </div>

                        <h5 className="fw-normal  pb-3" style={{ letterSpacing: "1px" }}>
                          Register Here
                        </h5>

                        <div className="form-outline mb-4">
                          <label className="form-label" for="form2Example17">
                            Name
                          </label>
                          <input
                            onChange={handleChange}
                            type="text"
                            name="name"
                            placeholder="Enter your name..."
                            value={signupInfo.name}
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <label className="form-label" for="form2Example17">
                            Email address
                          </label>
                          <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={signupInfo.email}
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" for="form2Example27">
                            Password
                          </label>
                          <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={signupInfo.password}
                            id="form2Example27"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="submit">
                            SIGN UP
                          </button>
                          <p>
                            Already have an account ?
                            <Link style={{ textDecoration: "none" }} to="/">
                              Login
                            </Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};
export default SignUp;
