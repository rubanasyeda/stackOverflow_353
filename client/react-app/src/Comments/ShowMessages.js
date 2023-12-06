import { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import "./ShowMessages.css"
import { Comment } from "./Comment.js" 
import CommentForm from './CommentForm.js';
import { fetchMessages as fetchMessagesAPI } from '../api/messages.js';
import { postMessage as postMessageAPI, deleteComment as deleteCommentApi} from '../api/messages.js';
import "./Comments.css";
import useAuth from "../hooks/useAuth";

export const ShowMessages = () => {

  const [backendComments, setBackendComments] = useState([]);
  const [activeComment,setActiveComment] = useState(null);

  var { channelId } = useParams();
  useEffect(() => {
    fetchMessagesAPI(channelId).then((data)=>{
      setBackendComments(data)
    });
  }, [channelId]);

  useEffect(() => {
    console.log('Message posted successfully now back end:', backendComments);
  }, [backendComments]);
  
  const { auth } = useAuth();
  //Gets the initial messages that are not replies
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parent_id === null
  );
  // console.log("Backend messages: ",backendComments);


  const getReplies = comment_Id => {
    return backendComments.filter(backendComment => backendComment.parent_id === comment_Id).sort(
      (a,b)=> new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  };

  /// Sending message to backend //////
  const addComment = (text, parentID, image) => {
    const formData = new FormData();
  
    formData.append('user', auth.username);
    formData.append('content', text);
    formData.append('channel_id', channelId);
    formData.append('parent_id', parentID);
    formData.append('image', image);
  
    postMessageAPI(formData)
      .then((comment) => {
        console.log('Message posted successfully:', comment.message);
        setBackendComments((prevComments) => [comment.message, ...prevComments]);
        // console.log('Message posted successfully now back end:', backendComments);
      })
      .catch((error) => {
        console.error('Error posting message:', error);
      });
      setActiveComment(null);
  };

  const deleteComment = (commentId) => {
    if (window.confirm(`Are you sure you want to remove comment with ID ${commentId}?`)) {
      deleteCommentApi(commentId).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };
  
  return (

    <div className='comments'>
      <h3 className='comments-title'>Messages for Channel ID: {channelId}</h3>
      <div className='comment-form-title'>Write Comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment}/>
      <div className='comments-container'>
        {rootComments.map((rootComment) =>(
          // <div key={rootComment.message_id}>{rootComment.body}  </div>
          <Comment 
            key={rootComment.message_id} 
            comment={rootComment}
            replies={getReplies(rootComment.message_id)}
            currentUserRole={auth.role}
            getReplies={getReplies}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
      

  );
};

export default ShowMessages;
