
// import { response } from 'express';
import React from 'react';
import { useState } from 'react';
import "./CreateChannel.css";

export const CreateChannel = ({set}) => {
    const [getChannnelName,setChannelName] = useState([]);
    const [getChannelDes,setChannelDes] = useState([]);

    function handleButton(){
        fetch("http://localhost:80/createChannel",{
            method: 'POST',
            body: `name=${getChannnelName}&desc=${getChannelDes}`,
            headers: {'Content-type': 'application/x-www-form-urlencoded'},
        })
        .then(()=> fetch('http://localhost:80/getChannels'))
        .then((response)=> response.json())
        .then((response)=> set(response))
        .then(()=>{
            setChannelDes('');
            setChannelName('');
            
        })
        alert(`Channel created with name: ${getChannnelName}`);
    }

    return(
    <>
        <h3>Create new channel</h3>
        
        <div className="form-container">
            <div className="form-input">
                <input 
                type="text"
                placeholder="Channel Name"
                value={getChannnelName}
                onChange={(e)=>setChannelName(e.target.value)}
                />
            </div>
            <div className="form-input">
                <input 
                type="text"
                placeholder="Channel Description"
                value={getChannelDes}
                onChange={(e)=>setChannelDes(e.target.value)}
                />
            </div>
            <button onClick={handleButton}>
                Create
            </button>
        </div>
    </>
    
    )
}

export default CreateChannel;