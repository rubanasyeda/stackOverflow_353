import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ShowChannels.css"

export const ShowChannels = ({ get }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();

  if (!Array.isArray(get) || get.length === 0) {
    return <p>No channels available</p>;
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
    navigate(`/messages/${channelId}`); // Navigate to the messages page with the channel ID
  };

  return (
    <>
      <div className='header'>Channels</div>
      <div className="post-container">
        {get.map((channel) => (
          <button
            className="channels"
            key={channel.channel_id}
            onClick={() => handleChannelClick(channel.channel_id)}
          >
            <p className='channelID'>ID: {channel.channel_id}</p>
            <h3 className='topic'>Channel Name: {channel.name}</h3>
            <p className='data'>Description: {channel.description}</p>
          </button>
        ))}
      </div>
    </>
  );
};

// const ShowMessages = ({ channelId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:80/messagesByChannel?channel_id=${channelId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setMessages(data);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       }
//     };

//     fetchMessages();
//   }, [channelId]);

//   return (
//     <>
//       <div className='header'>Messages for Channel ID: {channelId}</div>
//       <div className="message-container">
//         {messages.map((message) => (
//           <div className="message" key={message.message_id}>
//             <p className='messageID'>{message.user}</p>
//             <p className='content'>Content: {message.content}</p>
//             {message.imageURL && <img src={message.imageURL} alt="Message Image" />}
//           </div>
//         ))}
        
//         <div className='post-message'>
//           <input
//             type="text"
//             placeholder='Write new message'
//             // value={messages}
//             onAbort={(e)=>setMessages(e.target.value)}
//           />
//         </div>
//       </div>
//     </>
//   );
// };


export default ShowChannels;
