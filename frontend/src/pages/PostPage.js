import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Nav from '../components/Nav';
import '../App.css';

const PostPage = () => {
  // ✅ FIXED: correct param name (id not postId)
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── FETCH POST ─────────────────────────
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(`/posts/${id}`);

        setPost(data);
        setComments(data.comments || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // ── ADD COMMENT ─────────────────────────
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      const { data } = await API.post(`/posts/${id}/comments`, {
        text: newComment
      });

      setComments((prev) => [...prev, data.comment]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  // ── DELETE COMMENT ──────────────────────
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await API.delete(`/posts/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  // ── DELETE POST ─────────────────────────
  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return;

    try {
      await API.delete(`/posts/${id}`);

      // ✅ FIX: go back to homepage (safe route)
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  // ── LOADING STATE ───────────────────────
  if (loading) {
    return (
      <div>
        <Nav darkMode={false} toggleMode={() => {}} />
        <div className="post-page">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ── NOT FOUND STATE (FIXED WHITE SCREEN) ─
  if (!post) {
    return (
      <div>
        <Nav darkMode={false} toggleMode={() => {}} />
        <div className="post-page">
          <p>Post not found</p>
          <button onClick={() => navigate('/')}>Go Back Home</button>
        </div>
      </div>
    );
  }

  // ── SAFE CHECKS (NO CRASH) ──────────────
  const isAuthor =
    user && post?.author && user._id === post.author._id;

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <Nav darkMode={false} toggleMode={() => {}} />

      <div className="post-page">

        {error && <p className="error-msg">{error}</p>}

        {/* HEADER */}
        <div className="post-header">
          <div className="post-meta">
            <img
              src={
                post.author?.profilePicture ||
                'https://via.placeholder.com/50'
              }
              alt={post.author?.name}
              className="author-avatar"
            />

            <div>
              <h3>{post.author?.name}</h3>
              <p className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {(isAuthor || isAdmin) && (
            <div className="post-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/edit-post/${id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="post-content">
          <h1>{post.title}</h1>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="post-image"
            />
          )}

          <p className="post-body">{post.body}</p>
        </div>

        {/* COMMENTS */}
        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="4"
                required
              />
              <button type="submit">Post Comment</button>
            </form>
          ) : (
            <p className="login-prompt">
              <a href="/login">Log in</a> to comment
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <img
                      src={
                        comment.author?.profilePicture ||
                        'https://via.placeholder.com/40'
                      }
                      alt={comment.author?.name}
                      className="comment-avatar"
                    />

                    <div>
                      <h4>{comment.author?.name}</h4>
                      <p className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {user &&
                      user._id === comment.author?._id && (
                        <button
                          className="delete-comment-btn"
                          onClick={() =>
                            handleDeleteComment(comment._id)
                          }
                        >
                          ✕
                        </button>
                      )}
                  </div>

                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;