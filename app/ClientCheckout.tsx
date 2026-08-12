"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientCheckout() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clickId = searchParams.get("click_id") || "";

  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await fetch("/api/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 9.90,
            currency: "USD",
            description: "Special To Winning",
            clickId: clickId,
          }),
        });

        const data = await res.json();
        if (data.success && data.cardUrl) {
          setCardUrl(data.cardUrl);
        } else {
          setError(data.error || "Payment initialization failed");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [clickId]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <div style={{
        maxWidth: "1000px",
        width: "100%",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* 顶部进度条 */}
        <div style={{
          display: "flex",
          padding: "16px 24px",
          borderBottom: "1px solid #eee",
          fontSize: "13px",
          color: "#888",
          fontWeight: "500",
          gap: "8px",
          flexWrap: "wrap",
        }}>
          <span>🛒 Cart</span>
          <span style={{ color: "#ccc" }}>›</span>
          <span style={{ color: "#1a1a1a" }}>Information</span>
          <span style={{ color: "#ccc" }}>›</span>
          <span>Shipping</span>
          <span style={{ color: "#ccc" }}>›</span>
          <span>Payment</span>
        </div>

        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {/* 左栏：表单 */}
          <div style={{
            flex: "1 1 60%",
            padding: "32px 28px",
            minWidth: "300px",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 6px 0", color: "#1a1a1a" }}>
              Shipping address
            </h2>
            <p style={{ fontSize: "14px", color: "#888", margin: "0 0 20px 0" }}>
              Enter your details below
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  First Name
                </label>
                <input type="text" placeholder="John" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  Last Name
                </label>
                <input type="text" placeholder="Doe" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  Address
                </label>
                <input type="text" placeholder="123 Main St" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  City
                </label>
                <input type="text" placeholder="New York" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  State
                </label>
                <input type="text" placeholder="NY" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  Zip Code
                </label>
                <input type="text" placeholder="10001" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  Email Address
                </label>
                <input type="email" placeholder="john@example.com" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#333", display: "block", marginBottom: "4px" }}>
                  Phone
                </label>
                <input type="tel" placeholder="+1 (555) 000-0000" style={inputStyle} />
              </div>
            </div>

            {/* 支付区域 */}
            <div style={{ marginTop: "28px", borderTop: "1px solid #eee", paddingTop: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" }}>
                Payment
              </h2>
              <p style={{ fontSize: "13px", color: "#888", margin: "0 0 16px 0" }}>
                Enter your card details below
              </p>

              {loading && (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#888" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #e0e0e0", borderTop: "3px solid #1a1a1a", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  <p style={{ margin: 0, fontSize: "14px" }}>Loading secure payment...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {!loading && error && (
                <div style={{ background: "#fde8e8", color: "#c0392b", padding: "16px", borderRadius: "8px", fontSize: "14px", textAlign: "center" }}>
                  ❌ {error}
                  <br />
                  <button onClick={() => window.location.reload()} style={{ marginTop: "10px", padding: "8px 20px", background: "#1a1a1a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && cardUrl && (
                <div style={{ background: "#fafafa", borderRadius: "12px", padding: "4px", border: "1px solid #eee" }}>
                  <iframe
                    src={cardUrl}
                    style={{
                      width: "100%",
                      height: "480px",          // 固定高度，避免内部滚动
                      border: "none",
                      borderRadius: "10px",
                      background: "transparent",
                      overflow: "hidden",       // 隐藏滚动条
                    }}
                    scrolling="no"              // 禁用滚动（某些浏览器支持）
                    allow="payment"
                    title="Secure card payment"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 右栏：订单摘要 */}
          <div style={{
            flex: "0 0 280px",
            background: "#f8f9fa",
            padding: "32px 24px",
            borderLeft: "1px solid #eee",
            minWidth: "200px",
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 16px 0", color: "#1a1a1a" }}>
              Product
            </h3>
            <div style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              marginBottom: "20px",
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                background: "#e8e8e8",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "300",
                color: "#aaa",
                flexShrink: 0,
              }}>
                📘
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                  Special To Winning
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a", marginTop: "4px" }}>
                  $9.90
                </div>
              </div>
            </div>

            <div style={{
              borderTop: "1px solid #e0e0e0",
              paddingTop: "16px",
              marginTop: "4px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555", padding: "4px 0" }}>
                <span>Amount to be paid</span>
                <span>$9.90</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555", padding: "4px 0" }}>
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a1a1a",
                padding: "12px 0 4px 0",
                borderTop: "2px solid #1a1a1a",
                marginTop: "8px",
              }}>
                <span>TOTAL</span>
                <span>$9.90</span>
              </div>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "12px 16px",
              background: "#e8f5e9",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#2e7d32",
              textAlign: "center",
            }}>
              🔒 Secure checkout · 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "14px",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box" as const,
};
