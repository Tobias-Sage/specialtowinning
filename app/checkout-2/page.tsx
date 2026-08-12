import { Suspense } from "react";
import ClientCheckout from "../ClientCheckout";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ textAlign: "center", color: "#888" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e0e0e0",
            borderTop: "3px solid #1a1a1a",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          <p>Loading checkout...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    }>
      <ClientCheckout />
    </Suspense>
  );
}
