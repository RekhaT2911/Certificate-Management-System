import React, { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import "./login.css";
import { appContext } from "./App";
import Header from "./Header";

const Login = () => {
  const userRef = useRef(null);
  const passwordRef = useRef(null);

  const { setIsLogin, setRole } = useContext(appContext);

  // Student is selected by default
  const [loginType, setLoginType] = useState("student");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = userRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        "https://certificate-management-system-production.up.railway.app/api/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {

        // Check whether selected login type matches actual user role
        if (response.data.role !== loginType) {
          alert(
            `This account is a ${response.data.role} account. Please select ${response.data.role} login.`
          );

          setIsLogin("notlogin");
          return;
        }

        alert("Login Successful");

        setIsLogin("login");
        setRole(response.data.role);

        // Store registration number / username
        localStorage.setItem("reg_no", response.data.username);

        console.log(
          "Successfully logged in as:",
          response.data.username
        );
        console.log("Role:", response.data.role);
      }

    } catch (error) {

      if (error.response) {

        if (error.response.status === 404) {
          alert("User not found");

        } else if (error.response.status === 401) {
          alert("Invalid password");

        } else {
          alert("An error occurred. Please try again later.");
        }

        console.error(
          "Login error:",
          error.response.data.message
        );

      } else {
        alert("Server not reachable.");
        console.error("Network error:", error);
      }

      setIsLogin("notlogin");
    }

    // Clear inputs
    userRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <>
      <Header />

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">

          <div className="login-form">

            <h2>
              {loginType === "student" ? "🎓" : "👨‍🏫"} Welcome back
            </h2>

            <p>Please select your login type</p>

            {/* STUDENT / FACULTY SELECTOR */}
            <div className="role-selector">

              <button
                type="button"
                className={
                  loginType === "student"
                    ? "role-btn active"
                    : "role-btn"
                }
                onClick={() => setLoginType("student")}
              >
                🎓 Student
              </button>

              <button
                type="button"
                className={
                  loginType === "faculty"
                    ? "role-btn active"
                    : "role-btn"
                }
                onClick={() => setLoginType("faculty")}
              >
                👨‍🏫 Faculty
              </button>

            </div>

            <h3 className="login-type-title">
              {loginType === "student"
                ? "Student Login"
                : "Faculty Login"}
            </h3>

            {/* USERNAME */}
            <label>
              {loginType === "student"
                ? "Student Username"
                : "Faculty Username"}
            </label>

            <input
              ref={userRef}
              type="text"
              placeholder={
                loginType === "student"
                  ? "Enter student username"
                  : "Enter faculty username"
              }
            />

            {/* PASSWORD */}
            <label>Password</label>

            <input
              ref={passwordRef}
              type="password"
              placeholder="Enter your password"
            />

            {/* FORGOT PASSWORD */}
            <div className="login-options">
              <a href="#forgot" className="forgot-password">
                Forgot password
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="button"
              className="login-button"
              onClick={handleSubmit}
            >
              Log in as{" "}
              {loginType === "student"
                ? "Student"
                : "Faculty"}
            </button>

          </div>
        </div>

        {/* RIGHT SIDE - YOUR EXISTING IMAGE */}
        <div className="login-right">
          <div className="illustration"></div>
        </div>

      </div>
    </>
  );
};

export default Login;