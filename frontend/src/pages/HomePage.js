import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "../App.css";

import Japan from "../assets/Japan.jpg";
import Korea from "../assets/Korea.jpg";
import ph from "../assets/ph.jpg";
import italy from "../assets/italy.jpg";
import Switzerland from "../assets/Switzerland.jpg";
import spain from "../assets/spain.jpg";
import thailand from "../assets/thailand.jpg";
import Australia from "../assets/Australia.jpg";
import palm from "../assets/palm.jpg";
import china from "../assets/china.jpg";
import london from "../assets/london.jpg";
import maldives from "../assets/maldives.jpg";
import camping from "../assets/camping.jpg";
import burj from "../assets/burj.jpg";
import singapore from "../assets/singapore.jpg";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const destinations = [
    { name: "Japan", img: Japan, desc: "Tradition meets modern technology." },
    { name: "Korea", img: Korea, desc: "Food, culture, and K-pop vibes." },
    { name: "Philippines", img: ph, desc: "Beautiful islands." },
    { name: "Italy", img: italy, desc: "Art and pasta." },
    { name: "Switzerland", img: Switzerland, desc: "Mountains and lakes." },
    { name: "Spain", img: spain, desc: "Culture and beaches." },
    { name: "Thailand", img: thailand, desc: "Temples and food." },
    { name: "Australia", img: Australia, desc: "Wildlife adventure." },
    { name: "Dubai", img: palm, desc: "Luxury city life." },
    { name: "China", img: china, desc: "History and culture." },
    { name: "London", img: london, desc: "Iconic landmarks." },
    { name: "Maldives", img: maldives, desc: "Paradise beaches." },
    { name: "Camping", img: camping, desc: "Outdoor adventure." },
    { name: "Burj Khalifa", img: burj, desc: "Tallest building." },
    { name: "Singapore", img: singapore, desc: "Modern city." },
  ];

  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/posts");
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) =>
      post?.title?.toLowerCase().includes(term) ||
      post?.body?.toLowerCase().includes(term) ||
      post?.author?.name?.toLowerCase().includes(term)
    );

    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <h1>🌍 EXPLORE THE WORLD</h1>
        <p>Share stories, discover places, connect with people.</p>

        {user && (
          <button
            className="create-post-btn"
            onClick={() => navigate("/create-post")}
          >
            ✍️ Create Post
          </button>
        )}
      </section>

      {/* DESTINATIONS */}
      <section className="country-grid">
        {destinations.map((d, i) => (
          <div key={i} className="country-card">
            <img src={d.img} alt={d.name} />
            <h3>{d.name}</h3>
            <p>{d.desc}</p>
          </div>
        ))}
      </section>

      {/* SEARCH */}
      <section className="search-section">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </section>

      {/* POSTS */}
      <section className="posts-section">
        <h2 className="section-title">✨ Latest Posts</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="no-posts">No posts found</p>
        ) : (
          <div className="posts-grid">

            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="post-card"
                onClick={() => navigate(`/posts/${post._id}`)}
              >

                {/* IMAGE (REMOVED EMPTY SPACE) */}
                {post.image && (
                  <img
                    className="post-image"
                    src={
                      post.image.startsWith("http")
                        ? post.image
                        : `http://localhost:5000/uploads/${post.image}`
                    }
                    alt={post.title}
                  />
                )}

                {/* CONTENT */}
                <div className="post-content">

                  <h3>{post.title || "Untitled"}</h3>

                  <p>
                    {post.body?.length > 100
                      ? post.body.substring(0, 100) + "..."
                      : post.body}
                  </p>

                  {/* AUTHOR (NO IMAGE) */}
                  <div className="post-author">
                    <span>👤 {post.author?.name || "Unknown"}</span>
                    <small>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </small>
                  </div>

                  {/* FOOTER */}
                  <div className="post-footer">
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        <p className="results-count">
          Showing {filteredPosts.length} of {posts.length}
        </p>
      </section>

    </div>
  );
}

export default HomePage;