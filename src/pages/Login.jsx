import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {
        const url = `https://assignment-full-stack-backendd.vercel.app/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();

      const { success, message, token, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", token);
        setTimeout(() => {
          navigate("/mainpage");
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
      <section className="" style={{ backgroundColor: "#9A616D", minHeight: "100vh" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6   ">
                    <img
                      src="https://thumbs.dreamstime.com/b/smart-phone-windows-background-using-back-ground-55998288.jpg"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 1rem 1rem 1rem" }}
                    />
                  </div>
                  <div className="col-md-6  d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleLogin}>
                        <div className=" mb-3 pb-1">
                          <h1 className="fw-bold mb-0">Company Logo</h1>
                        </div>

                        <h5 className="fw-normal  pb-3" style={{ letterSpacing: "1px" }}>
                          Log into your account
                        </h5>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" htmlFor="form2Example17">
                            Email address
                          </label>
                          <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
                            id="form2Example17"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" htmlFor="form2Example27">
                            Password
                          </label>
                          <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={loginInfo.password}
                            id="form2Example27"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="submit">
                            Login
                          </button>
                        </div>
                        <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                          Don't have an account?{" "}
                          <Link to="/signup" style={{ color: "#393f81" }}>
                            Register here
                          </Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer/>
      </section>
    </>
  );
};
export default Login;
