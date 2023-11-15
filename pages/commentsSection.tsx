import { useEffect, useCallback, useState } from "react";
import { useRouter } from 'next/router';
import CommentPart from '../components/commentPart';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { createUserComment, fetchUserComments } from "../components/commentsSlice";


const CommentsSection: React.FC<{postId: string}> = ({ postId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { token, userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
    const comments = useSelector((state: RootState) => state.comments.commentsByPostId[postId]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = useCallback(async () => {
         await dispatch(fetchUserComments(postId));
    }, [postId])

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const router = useRouter();

    const isUserAuthenticated = () => {
        return token !== null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUserAuthenticated()) {
            try {
                await dispatch(createUserComment({postId, commentText: newComment}))
                setNewComment('');
                fetchComments();
            } catch (error) {
                console.log(error);
            }
        } else {
            router.push('/login');
        }
    };

  return (
    <div className="default-scroll bg-slate-100 h-60 lg:p-4 p-1 rounded-xl lg:mb-2 mb-1 flex flex-col overflow-auto">
        <h3 className="text-neutral-950 lg:text-xl text-center text-sm lg:mb-2 mb-1">Comments</h3>
        {comments && comments.length > 0 && comments.map((comment) => (
            <CommentPart key={comment._id} comment={comment} postId={postId} refreshComments={fetchComments} userId={userId} />
        ))}
        <form className="flex items-center justify-between w-full" onSubmit={handleSubmit}>
            <textarea
                className="outline-emerald-200 focus:caret-emerald-800 bg-emerald-200 lg:w-72 w-44 h-40 p-2 text-sm rounded rounded-xl text-emerald-950 hover:shadow-lg hover:shadow-emerald-600 placeholder:text-emerald-950"
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="update-button" onClick={() => {
                if (!isLoggedIn) {
                    router.push('/register')
                }
            }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Send
            </button>
        </form>
    </div>
  )
}

export default CommentsSection;