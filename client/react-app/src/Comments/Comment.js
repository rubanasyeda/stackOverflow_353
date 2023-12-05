import CommentForm from "./CommentForm";
import "./Comments.css";
// import userIcon from "../../public/user-icon.png";


// import "../../public/user-icon"
// project\stackOverflow_353\client\react-app\public\user-icon.png
export const Comment = ({comment, replies,getReplies, addComment, activeComment, setActiveComment, parentId=null})=>{
    const isReplying = 
        activeComment && 
        activeComment.type === "replying" && 
        activeComment.id === comment.message_id;
    const replyId = parentId ? parentId : comment.message_id;
    return(
        <div className = "comment">
            <div className="comment-image-container">
                <img className="img-icon" src="/user-icon.png" alt="User Icon" />
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.user}</div>
                    <div className="comment-time">{comment.time}</div>
                </div>
                <div className="comment-text">{comment.content}</div>
                <div className="comment-actions">
                    <div className="comment-action" 
                        onClick={()=> setActiveComment({id: comment.message_id, type: "replying"})}>
                        Reply
                    </div>
                </div>
                {isReplying && (
                    <CommentForm submitLabel="Reply"
                    handleSubmit={(text)=>addComment(text,replyId)}/>

                )}
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map(reply => (
                            <Comment 
                                comment={reply} 
                                key={reply.message_id} 
                                replies={getReplies(reply.message_id)}
                                addComment={addComment}
                                parentId={reply.message_id}
                                
                                getReplies={getReplies}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment;