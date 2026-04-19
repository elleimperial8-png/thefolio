import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../App.css';

const AdminPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ─────────────────────────────
  // INITIAL LOAD (FIXED BUG)
  // Fetch BOTH so counts are correct immediately
  // ─────────────────────────────
  useEffect(() => {
    fetchMembers();
    fetchPosts();
  }, []);

  // ── FETCH MEMBERS ─────────────────────────
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/members');
      setMembers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // ── FETCH POSTS ───────────────────────────
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/posts');
      setPosts(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // ── TOGGLE MEMBER STATUS ──────────────────
  const handleToggleMember = async (memberId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    if (
      !window.confirm(
        `${newStatus === 'active' ? 'Activate' : 'Deactivate'} this member?`
      )
    )
      return;

    try {
      const { data } = await API.put(`/admin/members/${memberId}`, {
        status: newStatus
      });

      setMembers((prev) =>
        prev.map((m) =>
          m._id === memberId ? { ...m, status: data.user.status } : m
        )
      );

      setSuccess(`Member successfully ${newStatus}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    }
  };

  // ── DELETE POST ───────────────────────────
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return;

    try {
      await API.delete(`/admin/posts/${postId}`);

      setPosts((prev) => prev.filter((p) => p._id !== postId));

      setSuccess('Post deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* HEADER */}
        <div className="admin-header">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Members ({members.length})
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📝 Posts ({posts.length})
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {/* MEMBERS */}
        {activeTab === 'members' && (
          <div className="admin-section">
            <h2>Member Management</h2>

            {loading ? (
              <p>Loading members...</p>
            ) : members.length === 0 ? (
              <p className="no-data">No members found</p>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member._id}
                        className={member.status === 'active' ? '' : 'inactive-row'}
                      >
                        <td>
                          <img
                            src={
                              member.profilePic
                                ? `http://localhost:5000/uploads/${member.profilePic}`
                                : 'https://via.placeholder.com/40'
                            }
                            alt={member.name}
                            className="member-avatar"
                          />
                        </td>

                        <td>{member.name}</td>
                        <td>{member.email}</td>

                        <td>
                          <span
                            className={`status-badge ${
                              member.status === 'active'
                                ? 'active'
                                : 'inactive'
                            }`}
                          >
                            {member.status === 'active'
                              ? '✓ Active'
                              : '✗ Inactive'}
                          </span>
                        </td>

                        <td>
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          <button
                            className={`status-btn ${
                              member.status === 'active'
                                ? 'deactivate'
                                : 'activate'
                            }`}
                            onClick={() =>
                              handleToggleMember(member._id, member.status)
                            }
                          >
                            {member.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* POSTS */}
        {activeTab === 'posts' && (
          <div className="admin-section">
            <h2>Post Management</h2>

            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="no-data">No posts found</p>
            ) : (
              <div className="admin-posts">
                {posts.map((post) => (
                  <div key={post._id} className="admin-post-card">

                    <div className="post-card-header">
                      <div className="post-card-info">
                        <h3>{post.title}</h3>
                        <p className="post-author">
                          By: {post.author?.name}
                        </p>
                        <p className="post-date">
                          Posted: {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {post.image && (
                        <img
                          src={
                            post.image.startsWith('http')
                              ? post.image
                              : `http://localhost:5000/uploads/${post.image}`
                          }
                          alt={post.title}
                          className="post-thumbnail"
                        />
                      )}
                    </div>

                    <p className="post-preview">
                      {post.body?.substring(0, 150)}...
                    </p>

                    <div className="post-stats">
                      <span>💬 {post.comments?.length || 0} comments</span>
                      <span>
                        📅 {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="post-actions">
                      <button
                        className="view-btn"
                        onClick={() =>
                          window.open(`/posts/${post._id}`, '_blank')
                        }
                      >
                        👁️ View
                      </button>

                      <button
                        className="delete-post-btn"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;