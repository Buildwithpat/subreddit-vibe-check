"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function LogoMark({ size = 20 }: { size?: number }) {
  // A bar chart combined with an antenna signal representing reddit intelligence
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 18V12" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18V8" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 18V4" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Small dot like reddit antenna */}
      <circle cx="20" cy="4" r="2.5" fill="#FF4500"/>
    </svg>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);
  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="nav-link"
      style={{ padding: "8px", borderRadius: "50%" }}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function Navbar() {
  return (
    <header
      aria-label="Site navigation"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        width: "100%", height: "64px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-g)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px", margin: "0 auto", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: "clamp(16px,3vw,40px)",
          paddingRight: "clamp(16px,3vw,40px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <LogoMark size={24} />
          <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--tx-1)" }}>
            Vibecheck
          </span>
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
