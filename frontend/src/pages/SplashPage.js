import React from "react";

function SplashPage() {
  return (
    <div style={styles.body}>
      <div style={styles.loader}>
        <h1>✈️ Dream Destinations</h1>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffb7ce",
    fontFamily: "Arial, sans-serif",
  },
  loader: {
    textAlign: "center",
    color: "white",
  },
  spinner: {
    width: "70px",
    height: "70px",
    border: "8px solid rgba(255,255,255,0.3)",
    borderTop: "8px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "20px auto",
  },
};

export default SplashPage;