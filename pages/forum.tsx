import { useEffect } from 'react';
import CommentsSection from './commentsSection';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { Post, createUserPost, deleteUserPost, fetchUserPosts, setPostAnimal, setPostText, setSearch, setShowCreateForum, setUpdatePost, updateUserPost } from '../components/forumSlice';
import { useRouter } from 'next/router';


const Forum: React.FC = () => {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const { posts, search, updatePost, postText, postAnimal, showCreateForum } = useSelector((state: RootState) => state.forum);
    const router = useRouter();
    const postAnimals = ["Cat", "Dog", "Bird", "Fish"]

    useEffect(() => {
        dispatch(fetchUserPosts());
    }, [dispatch]);

    const handleScroll = () => {
        const position = window.scrollY;
        if (position > 100) {
            dispatch(setShowCreateForum(true));
        } else {
            dispatch(setShowCreateForum(false));
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    

    const currentUserPosts = posts.filter((post) => post.userId._id === userId);
    const otherUserPosts = posts.filter((post) => post.userId._id !== userId);
    const orderedPosts = [...currentUserPosts, ...otherUserPosts];

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoggedIn) {
            try {
                if (updatePost) {
                    dispatch(updateUserPost({ postId: updatePost._id, postText, postAnimal}))
                } else {
                    dispatch(createUserPost({ postText, userId, postAnimal }))
                }
                dispatch(setPostText(''));
                dispatch(setPostAnimal(''));
                dispatch(setUpdatePost(null));
            } catch (error) {
                console.log(error);
            }
        } else {
            router.push('/login');
        }
    };    

    const handlePostUpdate = (post: Post) => {
        dispatch(setUpdatePost(post));
        dispatch(setPostText(post.postText));
        dispatch(setPostAnimal(post.postAnimal));
        dispatch(setShowCreateForum(true));
    };

    const handlePostDelete = async (postId: string) => {
        if (isLoggedIn) {
            try {
                dispatch(deleteUserPost(postId));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleCancelPostUpdate = () => {
        dispatch(setPostText(''));
        dispatch(setUpdatePost(null));
        dispatch(setShowCreateForum(false));
    };


    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };
    
    const sortedPosts = orderedPosts.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return Number(dateB) - Number(dateA);
    });

    const themeAnimationName = (theme: any) => {
        switch (theme) {
          case 'Fish':
            return 'rotateFishColor';
          case 'Bird':
            return 'rotateBirdColor';
          case 'Dog':
            return 'rotateDogColor';
          case 'Cat':
            return 'rotateCatColor';
          default:
            return 'rotateDefaultColor';
        }
      };

    const getBackgroundClass = (postAnimal: string) => {
        switch(postAnimal) {
          case 'Fish': return 'bg-fish';
          case 'Bird': return 'bg-bird';
          case 'Dog': return 'bg-dog';
          case 'Cat': return 'bg-cat';
          default: return 'bg-default';
        }
    };


    return (
        <div className="bg-neutral-100  min-h-screen lg:pt-8 pt-3 flex flex-col">
            <div className="flex justify-center mb-5">
                <input type="text" className="outline-emerald-500 focus:caret-emerald-600 bg-emerald-200 lg:w-96 w-64 lg:h-10 h-8 p-2 lg:text-base text-sm rounded-xl text-teal-800 placeholder:text-emerald-800 hover:shadow-lg hover:shadow-emerald-300" placeholder="search..." onChange={(e) => dispatch(setSearch(e.target.value))} />
            </div>
            <h1 className="text-neutral-900 text-center lg:text-4xl text-xl">Welcome</h1>
            {((posts.length <= 8) || showCreateForum) && (
                <div className='sticky lg:inset-y-12 inset-y-4 mx-auto w-fit lg:p-5 pt-6 rounded z-40'>
                    <h2 className="text-neutral-900 lg:text-2xl text-md items-center text-center lg:mb-6 mb-2 opacity-80">{updatePost ? "Update Post" : "Create a new post"}</h2>
                    <form className="flex flex-col items-center justify-center lg:mb-5 mb-2" onSubmit={handlePostSubmit}>
                        <label className='flex flex-col items-center justify-center mb-2.5'>
                            <textarea className="outline-emerald-500 focus:caret-emerald-600 bg-emerald-200 text-emerald-950 placeholder:text-emerald-800' lg:w-96 w-80 lg:h-36 h-24 p-2 lg:text-base text-sm rounded-xl resize-y hover:shadow-lg hover:shadow-teal-300 opacity-80" placeholder='Description...' value={postText} maxLength={300} onChange={(e) => dispatch(setPostText(e.target.value))} required />
                        </label>
                        <label className='flex flex-col lg:mb-2.5 mb-1 hover:shadow-lg'>
                            <select value={postAnimal} className="outline-emerald-500 focus:caret-emerald-600 rounded-xl bg-emerald-200 text-emerald-900 lg:max-w-xl max-w-md lg:p-4 p-2 lg:text-base text-sm resize-y" onChange={(e) => dispatch(setPostAnimal(e.target.value))} required>
                                <option value="">Select Pet</option>
                                {postAnimals.map((g, index) => <option key={index} value={g}>{g}</option>)}
                            </select>
                        </label>
                        <div className='flex flex-row justify-center items-center'>
                            <button className="update-button" type="submit">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                {updatePost ? 'Update' : 'Create'}
                            </button>
                            <button className="delete-button" type="button" onClick={handleCancelPostUpdate}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {sortedPosts && sortedPosts.length > 0 && (
                <h2 className="text-neutral-900 text-center lg:text-2xl text-lg mt-4 mb-8">Our Current Forum Posts</h2>
            )}
            <div className="min-w-screen flex justify-center flex-wrap">
                {sortedPosts &&
                    sortedPosts
                        .filter((post) => post.userId.userName.toLowerCase().includes(search.toLocaleLowerCase()) || post.postAnimal.toLowerCase().includes(search.toLocaleLowerCase()))
                        .map((post) => (
                                <ul className={`animal-container ${getBackgroundClass(post.postAnimal)} mx-8 my-8 lg:rounded-xl rounded-2xl break-words lg:w-96 w-72 lg:p-3.5 p-2 transition-all duration-300 rotating-border`} style={{animationName: themeAnimationName(post.postAnimal)}}>
                                    <h2 className='text-2xl mt-1 text-center'>{post.postAnimal}</h2>
                                    <h3 className="lg:text-lg text-sm lg:mt-2 mt-1 h-28 bg-slate-100 rounded-xl p-2 overflow-auto default-scroll">{post.postText}</h3>
                                    {post.userId._id === userId && (
                                            <div className='flex justify-center mt-4'>
                                                <button
                                                className="update-button"
                                                onClick={() => handlePostUpdate(post)}
                                                >
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                Update
                                                </button>
                                                <button
                                                className="delete-button"
                                                onClick={() => handlePostDelete(post._id)}
                                                >
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                Delete
                                                </button>
                                            </div>
                                    )}
                                    <p className="lg:text-lg text-xs text-center lg:mt-2.5 mt-1">{post.userId.userName}</p>
                                    <div className='flex justify-between mb-4'>
                                        <p className="text-xs lg:mt-2.5 mt-1">Created At: {formatDate(post.createdAt)}</p>
                                        {post.updatedAt && <p className="text-xs lg:mt-2.5 mt-1">Updated At: {formatDate(post.updatedAt)}</p>}
                                    </div>
                                    <CommentsSection postId={post._id} />
                                </ul>
                        ))}
            </div>
        </div>
    );
};

export default Forum;