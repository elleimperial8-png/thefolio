import React, { useState } from "react";
import placeholderImg from "../assets/placeholder.png";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Please enter your name";

    if (!form.email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.message.trim()) newErrors.message = "Please enter your message";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="contact-page">

      {/* CONTACT FORM */}
      <section className="contact-hero">
        <h2>Contact Me</h2>

        <form onSubmit={validateForm}>
          <label>Name</label>
          <input
            id="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
          />
          <span className="error">{errors.name}</span>

          <label>Email</label>
          <input
            id="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
          />
          <span className="error">{errors.email}</span>

          <label>Message</label>
          <textarea
            id="message"
            placeholder="Your message"
            value={form.message}
            onChange={handleChange}
          ></textarea>
          <span className="error">{errors.message}</span>

          <button type="submit">Send</button>
        </form>
      </section>

      {/* MAP */}
      <section className="map-section">
        <h2 style={{ textAlign: "center" }}>Find Us Here</h2>
        <img
          src={placeholderImg}
          alt="Map placeholder"
          style={{
            width: "100%",
            maxWidth: "800px",
            display: "block",
            margin: "auto",
            borderRadius: "10px"
          }}
        />
      </section>

      {/* RESOURCES */}
      <section>
        <h2 style={{ textAlign: "center" }}>Helpful Resources</h2>

        <table>
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <a href="https://www.lonelyplanet.com/" target="_blank" rel="noreferrer">
                  Lonely Planet
                </a>
              </td>
              <td>Travel guides and tips for planning trips</td>
            </tr>

            <tr>
              <td>
                <a href="https://www.nationalgeographic.com/" target="_blank" rel="noreferrer">
                  National Geographic
                </a>
              </td>
              <td>Culture, nature, and travel inspiration</td>
            </tr>

            <tr>
              <td>
                <a href="https://www.tripadvisor.com/" target="_blank" rel="noreferrer">
                  TripAdvisor
                </a>
              </td>
              <td>Reviews of hotels, restaurants, and attractions</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}

export default ContactPage;