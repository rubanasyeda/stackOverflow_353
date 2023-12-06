import CommentForm from "./CommentForm";
import "./Comments.css";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { updateCountsOnBackend } from "../api/messages";



// import "../../public/user-icon"
// project\stackOverflow_353\client\react-app\public\user-icon.png
export const Comment = ({
    comment, 
    replies,
    getReplies, 
    addComment, 
    activeComment, 
    setActiveComment, 
    parentId=null,
    currentUserRole,
    deleteComment
    })=>{

    const [approvalCount, setApprovalCount] = useState(0);
    const [disapprovalCount, setDisapprovalCount] = useState(0);
    const [userApproval, setUserApproval] = useState(null);

    useEffect(()=>{
        setApprovalCount(comment.likes);
        setDisapprovalCount(comment.dislikes);
    },[]);

    useEffect(()=>{
        updateCountsOnBackend(comment.message_id,approvalCount,disapprovalCount)
          .then((response)=>console.log("Messaged liked"))
          .catch((err)=> console.error("Message could nto be liked"));
    },[approvalCount,disapprovalCount]);



    const handleThumbsUp = () => {
        if (userApproval === 'up') {
            setUserApproval(null); // Cancel the user's previous thumbs-up
            setApprovalCount(approvalCount - 1);
        } else {
            setUserApproval('up');
            setApprovalCount(approvalCount + 1);
            // If the user had previously given a thumbs-down, decrement the count
            if (userApproval === 'down') {
                setDisapprovalCount(disapprovalCount - 1);
            }
        }

    };

    const handleThumbsDown = () => {
        if (userApproval === 'down') {
          setUserApproval(null); // Cancel the user's previous thumbs-down
          setDisapprovalCount(disapprovalCount - 1);
        } else {
          setUserApproval('down');
          setDisapprovalCount(disapprovalCount + 1);
          // If the user had previously given a thumbs-up, decrement the count
          if (userApproval === 'up') {
            setApprovalCount(approvalCount - 1);
          }
        }
        // updateCountsOnBackend(comment.message_id,approvalCount,disapprovalCount)
        //   .then((response)=>console.log("Messaged liked"))
        //   .catch((err)=> console.error("Message could nto be liked"));
    };

    const isReplying = 
        activeComment && 
        activeComment.type === "replying" && 
        activeComment.id === comment.message_id;
    const replyId = parentId ? parentId : comment.message_id;

    const canDelete = currentUserRole === 0;
    const { auth } = useAuth();
    return(
        <div className = "comment">
            <div className="comment-image-container">
                <img className="img-icon" src="/user-icon.png" alt="User Icon" />
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.user}</div>
                    {comment.image_path !== "null" && (
                        <img className="comment-image" src={comment.imageUrl} 
                        />
                    )}
                    <div className="comment-time">{comment.time}</div>
                </div>
                <div className="comment-text">{comment.content}</div>
                <div className="comment-actions">
                    <div className="comment-action" 
                        onClick={()=> setActiveComment({id: comment.message_id, type: "replying"})}>
                        Reply
                    </div>
                    <div className="comment-action" onClick={handleThumbsUp}>
                    👍 {approvalCount}
                    </div>
                    <div className="comment-action" onClick={handleThumbsDown}>
                    👎 {disapprovalCount}
                    </div>
                    {canDelete && <div className="comment-action" 
                        onClick={()=> deleteComment(comment.message_id)}>
                        Delete
                    </div>}
                </div>
                {isReplying && (
                    <CommentForm submitLabel="Reply"
                    handleSubmit={addComment}
                    parentId={replyId}/>
                    // handleSubmit={(text)=>addComment(text,replyId)}
                )}
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map(reply => (
                            <Comment 
                                comment={reply} 
                                key={reply.message_id} 
                                replies={getReplies(reply.message_id)}
                                addComment={addComment}
                                currentUserRole={auth.role}
                                parentId={reply.message_id}
                                getReplies={getReplies}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment}
                                deleteComment={deleteComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment;