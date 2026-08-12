// app/payment/failed/page.tsx
"use client";
import Link from "next/link";
export default function FailedPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>❌</div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0" }}>Payment Failed</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>Please try again.</p>
        <Link href="/" style={{ padding: "12px 32px", background: "#1a1a1a", color: "white", borderRadius: "8px", textDecoration: "none" }}>Try Again</Link>
      </div>
    </div>
  );
}
