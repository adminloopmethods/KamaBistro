// app/404.tsx
import Link from "next/link";
import { JSX, MouseEvent } from "react";

export default function NotFound(): JSX.Element {
  // Optional: type-safe hover handlers
  const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#f0e6d2";
  };

  const handleMouseOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#FFFFFF";
  };

  return (
    <div
      style={{
        backgroundColor: "#AE9060",
        color: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "'Georgia', serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: "0" }}>404</h1>
      <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>Oops! Page Not Found</h2>
      <p style={{ maxWidth: "400px", fontSize: "1.2rem", lineHeight: "1.5" }}>
        Looks like you wandered off the menu. Don't worry, we've got plenty of delicious pages to explore!
      </p>
      <Link href="/landing">
        <button
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#AE9060",
            backgroundColor: "#FFFFFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Return to Home
        </button>
      </Link>
    </div>
  );
}
