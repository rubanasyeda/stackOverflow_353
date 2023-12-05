import './App.css';
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes, Route,Link} from "react-router-dom";
import { Landing } from './Landing';
import {CreateChannel} from './CreateChannel';
import {ShowChannels} from './ShowChannels';
import MyForm from './image';
import {ShowMessages} from "./Comments/ShowMessages";

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

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Router>
            <Link to="/">
                <button>Landing</button>
            </Link>
            <Link to= "/createChannel">
                <button>Create New Channel</button>
            </Link>
            <Link to="/showChannels">
                <button>Show all Channels</button>
            </Link>
            <Link to="/imageform">
                <button>Image form</button>
            </Link>
            <div className='bodyPages'>
              <Routes>
                  <Route exact path = "/" element={<Landing />}/>
                  <Route path = "/createChannel" element={<CreateChannel set={setChannel}/>}/>
                  <Route path = "/showChannels" element={<ShowChannels get={getChannels}/>}/>
                  <Route path = "/imageform" element={<MyForm/>}/>
                  <Route path="/messages/:channelId" element={<ShowMessages />} />
              </Routes>
            </div>
          </Router>
          
        </div>
      </header>
      
    </div>
  );
}

export default App;
