import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes, Route,Link,Navigate,useLocation} from "react-router-dom";
import { Landing } from './Components/Landing';
import {CreateChannel} from './Channels/CreateChannel';
import {ShowChannels} from './Channels/ShowChannels';
import MyForm from './Components/image';
import {ShowMessages} from "./Comments/ShowMessages";
import LoginSignup from './Login/LoginSignup';
// import { useAuth } from "./Login/AuthContext";
import Layout from './Components/Layout';
import Navbar from "./Components/Navbar";
import RequireAuth from './Components/RequireAuth';
import useAuth from "./hooks/useAuth";
import { Users } from './Channels/Users';
import SearchComponent from './Comments/SearchComponent';

// import React, { useEffect } from 'react';

function App() {
  const [getChannels,setChannel] = useState([]);

  useEffect(()=>{
    if(getChannels.length < 1){
      fetch("http://localhost:80/getChannels")
        .then((response => {
          if(!response.ok){
            throw new Error(`HTTP error!: Status: ${response.status}`);
          }
          return response.json();
        }))
        .then ((data)=> setChannel(data))
        .catch((error)=> console.error("Fetch error: ",error));
    }
  },[getChannels]);

  // const [token, setToken] = useState();

  const { auth } = useAuth();
  const location = useLocation();

  return (
    <div className="App">
      <div className='bodyPages'>
        {/* /// condition here */}
        {auth.username && <Navbar />}
        <Routes>
          <Route path="/" element={<Layout/>}>
            {/** Public routes */}
            <Route exact path="/Login" element={<LoginSignup />} />
            
            <Route element={<RequireAuth/>} > 
              <Route exact path="/Landing" element={<Landing />} />
              <Route path="/createChannel" element={<CreateChannel set={setChannel} />} />
              <Route path="/showChannels" element={<ShowChannels get={getChannels} set={setChannel} />} />
              <Route path="/viewUsers" element={<Users />} />
              <Route path="/messages/:channelId" element={<ShowMessages />} />
              <Route path="/LoginSignup" element={<LoginSignup />} />
              <Route path="/search" element={<SearchComponent />} />
            </Route>

          </Route>
        </Routes>
      </div>
    </div>
  );
}


export default App;
