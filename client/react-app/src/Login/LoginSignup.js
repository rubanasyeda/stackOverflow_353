import { useState, useRef, useEffect, useCallback } from "react";
import "./LoginSignup.css";
import { SignUpNewUser, login} from "../api/loginops";
import { Navigate, useNavigate,Link,useLocation } from 'react-router-dom';

//
import useAuth from "../hooks/useAuth";

const LoginSignup = () => {
  //
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
  

    // const { user, login: authLogin } = useAuth();
    const [action, setAction] = useState("Login");
    const [activeButton, setActiveButton] = useState(null);
    

    //
    const userRef = useRef();
    const errRef = useRef();

    // State for input values
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //tutorial
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

  const handleButtonClick = (clickedAction) => {

    // Sign up
    if (clickedAction === action && (name && username && password)) {
      // Additional logic for a second click on the same action with non-empty fields
      console.log(`Processing second click on ${name} ${username} ${password}`);
      const userdata = {
        username: username.toLowerCase(),
        password: password,
        name: name,
        role: 1, // role 1 means regular user, role 0 means admin
      };
      console.log(userdata);
      SignUpNewUser(userdata)
        .then((response) => {
          console.log("Sent Sign up data: ", response);
          alert(`New user with ${username} created`);
          setAction("Login");
          setActiveButton("Login");
        })
        .catch((error) => {
          console.error("Could not send sign up data to back", error);
          alert("Username already exists");
        });
    }
    // Log in
    else if (clickedAction === action && (username && password)) {
        // Handle login logic here
        const userLoginData = {
          username: username.toLowerCase(),
          password: password,
        };
      
        login(userLoginData)
          .then((response) => {
            if(!response){
                alert("Login credentials are wrong");
            }
            else{
                console.log("Login successful: ", response);
                const accessToken = response?.token;
                const role = response?.role;
                setAuth({username,password,role,accessToken});
                navigate("/Landing");

            }
            
          })
          .catch((error) => {
            if(!error?.response){
              setErrMsg('No Server response');
            }
            console.log("Error caught: ", error);
          });
      }
    
    else {
      setAction(clickedAction);
      setActiveButton(clickedAction);
    }
  
    // Clear input values when switching between Sign Up and Login
    setName("");
    setUsername("");
    setPassword("");
  };
  

  return (
    <div className="contianer">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <img src="/person.png" alt="" />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="input">
          <img src="/email.png" alt="" />
          <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input">
          <img src="/password.png" alt="" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      {action === "Sign Up" ? (
        <div></div>
      ) : (
        <div className="forgot-password">
          Lost Password? <span>Click Here</span>
        </div>
      )}
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => handleButtonClick("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => handleButtonClick("Login")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;