import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "./ShowChannels.css"
import useAuth from '../hooks/useAuth';
import { deleteChannel as deleteChannelAPI} from '../api/messages';

export const ShowChannels = ({ get,set }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth.role === 0;

  const handleChannelDelete = (channelIdToRemove) => {
    if(window.confirm("Are you sure you want to delete channel: ",channelIdToRemove)){
      deleteChannelAPI(channelIdToRemove)
        .then(
          console.log("Channel deleted on react")
        )
        .catch((error)=>
          console.error("Could not delete Channel")
        );
        const updatedChannels = get.filter(channel => channel.channel_id !== channelIdToRemove);
        set(updatedChannels);
        navigate("/createChannel");
      };
  };

  if (!Array.isArray(get) || get.length === 0) {
    return <p>No channels available</p>;
  }

  const handleChannelClick = (channelId,channelName) => {
    setSelectedChannel(channelId);
    navigate(`/messages/${channelId}`); // Navigate to the messages page with the channel ID
  };

  return (
    <>
      <div className='header'>Channels</div>
      {get.length===0 ? 
      (
        <div>
          <button>No Channels to show</button>
        </div>
      )      
      :(
        <div className="post-container">
          {get.map((channel) => (
            <div key={channel.channel_id} className="channel-container">
              <button
                className="channels"
                onClick={() => handleChannelClick(channel.channel_id,channel.name)}
              >
                <p className='channelID'>ID: {channel.channel_id}</p>
                <h3 className='topic'>Channel Name: {channel.name}</h3>
                <p className='data'>Description: {channel.description}</p>
              </button>
              {isAdmin && (
                <button onClick={() => handleChannelDelete(channel.channel_id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};


export default ShowChannels;
