import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";


function RegisterPage() {
  const initialForm = {
    name: "",
    email: "",
    password: "",
    dob: "",
    level: "",
    terms: false,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Clear form when page loads
  useEffect(() => {
    setForm(initialForm);
    setErrors({});
    setApiError("");
    setSuccessMessage("");
  }, []);

  const handleChange = (e) => {
    const { type, id, name, value, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [id]: checked }));
    } else if (type === "radio") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const is18OrOlder = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    let newErrors = {};
    let valid = true;

    if (!form.name.trim()) { newErrors.name = "Please enter your full name"; valid = false; }
    if (!form.email.trim()) { newErrors.email = "Please enter your email"; valid = false; }
    if (!form.password.trim()) { newErrors.password = "Please enter your password"; valid = false; }
    if (!form.dob) { newErrors.dob = "Enter DOB"; valid = false; } 
    else if (!is18OrOlder(form.dob)) { newErrors.dob = "You must be 18 or older"; valid = false; }
    if (!form.level) { newErrors.level = "Select your level"; valid = false; }
    if (!form.terms) { newErrors.terms = "You must agree to the terms"; valid = false; }

    setErrors(newErrors);
    if (!valid) return;

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccessMessage("Registration successful! You can now login below.");
      
      // Clear form after success
      setForm(initialForm);

      // Hide message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {apiError && <p className="error">{apiError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Full Name */}
        <input
          type="text"
          id="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="off"
        />
        <span className="error">{errors.name}</span>

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
        />
        <span className="error">{errors.email}</span>

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <span className="error">{errors.password}</span>

        {/* DOB */}
        <input
          type="date"
          id="dob"
          value={form.dob}
          onChange={handleChange}
        />
        <span className="error">{errors.dob}</span>

        {/* Level Radio Buttons */}
        <div>
          <label>
            <input
              type="radio"
              name="level"
              value="beginner"
              checked={form.level === "beginner"}
              onChange={handleChange}
            /> Beginner
          </label>
          <label>
            <input
              type="radio"
              name="level"
              value="intermediate"
              checked={form.level === "intermediate"}
              onChange={handleChange}
            /> Intermediate
          </label>
          <label>
            <input
              type="radio"
              name="level"
              value="advanced"
              checked={form.level === "advanced"}
              onChange={handleChange}
            /> Advanced
          </label>
          <span className="error">{errors.level}</span>
        </div>

        {/* Terms Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={handleChange}
            /> I agree to the terms and conditions
          </label>
          <span className="error">{errors.terms}</span>
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;