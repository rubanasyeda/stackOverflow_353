import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./ShowMessages.css"

// ... (imports)

export const ShowMessages = () => {

  const [backendComments, setBackendComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState('');
  const [parentId, setParentId] = useState(null);

  const { channelId } = useParams();
  console.log("Backend comments:",backendComments);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:80/messagesByChannel?channel_id=${channelId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBackendComments(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [channelId]);

  const handlePostMessage = async () => {

    // Adjust formData and API accordingly for nested replies
    const formData = new FormData();
    formData.append('user', user);
    formData.append('content', newMessage);
    formData.append('channel_id', channelId);
    formData.append('parent_id', parentId);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:80/postMessage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Clear the input fields
      setNewMessage('');
      setImage(null);
      setUser('');
      setParentId(null); // Reset parentId after posting a message

      // Fetch messages after successfully posting a new message
      fetchMessages();
    } catch (error) {
      console.error('Post message error:', error);
    }
  };

  const handleReplyClick = (parentMessageId) => {
    // Set the parent ID when "Reply" is clicked
    setParentId(parentMessageId);
  };

  return (
    <>
      <h3 className='comments-title'>Messages for Channel ID: {channelId}</h3>
      <div className="message-container">
        {backendComments.map((message) => (
          <div className="message" key={message.message_id}>
            <p className='messageUser'>{message.user}</p>
            <p className='content'>Content: {message.content}</p>
            {message.imageURL && <img src={message.imageURL} alt="Message Image" />}

            {/* "Reply" button */}
            <button onClick={() => handleReplyClick(message.message_id)}>Reply</button>

            {/* Reply input section */}
            {parentId === message.message_id && (
              <div className='reply-section'>
                <input
                  type="text"
                  placeholder='Write a reply'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <input
                  type="text"
                  placeholder='Your Name'
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
                <button onClick={handlePostMessage}>Post Reply</button>
              </div>
            )}

            {/* Render nested replies recursively
            <ShowMessages key={message.message_id} /> */}
          </div>
        ))}

        {/* Post new message section */}
        <div className='post-message'>
          <input
            type="text"
            placeholder='Write new message'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder='Your Name'
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={handlePostMessage}>Post</button>
        </div>
      </div>
    </>
  );
};

export default ShowMessages;
