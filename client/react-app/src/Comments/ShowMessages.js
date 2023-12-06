import { useState, useEffect } from 'react';
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
  const { auth } = useAuth();

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parent_id === null
  );

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
        setBackendComments([comment, ...backendComments]);
        setActiveComment(null);

      })
      .catch((error) => {
        console.error('Error posting message:', error);
      });
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

  useEffect(() => {
    fetchMessagesAPI(channelId).then((data)=>{
      setBackendComments(data)
    });
  }, [backendComments,channelId]);
  
  return (

    <div className='comments'>
      <h3 className='comments-title'>Messages for Channel ID: {channelId}</h3>
      <div className='comment-form-title'>Write Comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment}/>
      <div className='comments-container'>
        {rootComments.map((rootComment) =>(
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
