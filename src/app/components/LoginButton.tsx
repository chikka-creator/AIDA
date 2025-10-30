"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import LoginPopup from "./LoginPopup";
import UserMenu from "./UserMenu";
import "./popup.css";

export default function LoginButton() {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session, status } = useSession();

  // Show user menu if logged in
  if (session) {
    return <UserMenu />;
  }

  // Show loading state
  if (status === "loading") {
    return (
      <button
        disabled
        className="btn-login"
        style={{
          position: "fixed",
          top: "20px",
          right: "30px",
          background: "#246E76",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px 18px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          opacity: 0.7,
        }}
      >
        Loading...
      </button>
    );
  }

  // Show login button if not logged in
  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="btn-login"
        style={{
          position: "fixed",
          top: "20px",
          right: "30px",
          background: "#246E76",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px 18px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Login
      </button>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </>
  );
}
