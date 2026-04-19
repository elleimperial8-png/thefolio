import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Nav from '../components/Nav';
import '../App.css';

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/posts/${postId}`);
        
        // Check if user is the author or admin
        if (user._id !== data.author._id && user.role !== 'admin') {
          setError('You are not authorized to edit this post');
          navigate(`/posts/${postId}`);
          return;
        }

        setTitle(data.title);
        setBody(data.body);
        setCurrentImage(data.image);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, user, navigate]);

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Preview new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      if (image) {
        formData.append('image', image);
      }

      const { data } = await API.put(`/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Post updated successfully!');
      setTimeout(() => {
        navigate(`/posts/${data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return (
    <div>
      <Nav darkMode={false} toggleMode={() => {}} />
      <div className="edit-post-page">
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div>
      <Nav darkMode={false} toggleMode={() => {}} />

      <div className="edit-post-page">
        <h1>Edit Post</h1>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit} className="edit-form">
          {/* TITLE INPUT */}
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* BODY INPUT */}
          <div className="form-group">
            <label htmlFor="body">Post Content</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post content here..."
              rows="12"
              required
            />
          </div>

          {/* IMAGE SECTION */}
          {user.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="image">Cover Image (Admin only)</label>
              
              {currentImage && (
                <div className="image-preview">
                  <img src={currentImage} alt="Post preview" />
                  <p className="image-label">
                    {image ? 'New image preview' : 'Current image'}
                  </p>
                </div>
              )}

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="file-hint">
                {image ? 'New image selected' : 'Choose to replace current image'}
              </p>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Update Post
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/posts/${postId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;