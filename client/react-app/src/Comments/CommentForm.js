import "./Comments.css";
import { useState } from "react";

const CommentForm = ({handleSubmit, submitLabel,parentId=null}) => {
    const [text,settext] = useState("");
    const [image, setImage] = useState(null);
    // const [parentId, setParentId] = useState(null);

    const isTextareaDisabled = text.length ===0;
    const onSubmit = (event) =>{
        event.preventDefault()
        handleSubmit(text,parentId,image)
        settext("")
    }
    return(
        <form onSubmit={onSubmit}>
            <textarea 
                className="comment-form-textarea" 
                value={text} 
                onChange={(e)=> settext(e.target.value)}
            />
            <input
            type="file"
            // accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="comment-form-button" disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
        </form>

    )

};

export default CommentForm;