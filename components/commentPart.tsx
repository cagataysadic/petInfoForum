import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { Comment, deleteUserComment, updateUserComment } from './commentsSlice';


const CommentPart: React.FC<{comment: Comment, postId: string, refreshComments: any, userId: string | null}> = ({ comment, postId, refreshComments, userId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState<string>(comment.commentText);
    const handleDelete = async () => {
        dispatch(deleteUserComment({postId, commentId: comment._id}))
        refreshComments();
    };

    const handleEdit = async () => {
        if (editedComment) {
            dispatch(updateUserComment({postId, commentId: comment._id, commentText: editedComment}));
            setIsEditing(false);
            refreshComments();
        } else {
            alert("Comments must not be empty")
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };
    
    const currentUserId = userId;

  return (
    <div className="bg-slate-200 border-2 border-slate-400 p-2 rounded-lg lg:mb-5 mb-2 flex flex-col flex-grow">
        {isEditing ? (
            <>
                <textarea 
                    value={editedComment}
                    className="outline-emerald-600 focus:caret-emerald-700 bg-emerald-100 text-emerald-950 lg:w-72 w-52 p-1 my-4 mx-auto lg:text-sm text-xs rounded hover:shadow-lg placeholder:text-emerald-950"
                    onChange={(e) => setEditedComment(e.target.value)}
                />
                <div className="flex justify-center">
                    <button className="update-button" onClick={handleEdit}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Save
                    </button>
                    <button className="delete-button" onClick={() => setIsEditing(false)}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Cancel
                    </button>
                </div>
            </>
        ) : (
            <>
                <p className="text-neutral-950 lg:text-base text-sm m-1 break-words">{comment.commentText}</p>
                <p className="text-neutral-950 font-bold lg:text-base text-center text-sm m-1 break-words">{comment.userId.userName}</p>
                <div className='flex flex-col items-center mb-4'>
                    <p className="text-neutral-950 lg:text-sm text-xs m-1">Created At: {formatDate(comment.createdAt)}</p>
                    {comment.updatedAt && <p className="text-neutral-950 lg:text-sm text-xs m-1">Updated At: {formatDate(comment.updatedAt)}</p>}
                </div>
                {currentUserId === comment.userId._id && (
                    <div className="flex justify-center">
                        <button className="update-button" onClick={() => setIsEditing(true)}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Update
                        </button>
                        <button className="delete-button" onClick={handleDelete}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Delete
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
  )
}

export default CommentPart;