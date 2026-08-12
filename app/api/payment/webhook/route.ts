
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // 1. 验证签名 (WalletPlug 使用 x-signature 头)
    const signatureHeader = request.headers.get("x-signature") || "";
    if (!signatureHeader) {
      console.error("Missing x-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    let hmac = signatureHeader;
    if (signatureHeader.startsWith("sha256=")) {
      hmac = signatureHeader.substring(7);
    }

    const expectedHmac = crypto
      .createHmac("sha256", process.env.WALLETPLUG_CLIENT_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (hmac.toLowerCase() !== expectedHmac.toLowerCase()) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Webhook verified");

    const payload = JSON.parse(rawBody);
    const { status, data } = payload;

    // 2. 仅处理支付完成事件，提取 click_id 并发送 postback
    if (status === "completed") {
      console.log(`✅ Payment completed: ${data.ref_trx}`);

      // 从 ref_trx 中提取 click_id
      const refTrx = data.ref_trx || "";
      let clickId = "";
      if (refTrx.startsWith("EMBED-")) {
        const parts = refTrx.split("-");
        if (parts.length >= 3) {
          // 格式: EMBED-{clickId}-{timestamp}
          clickId = parts[1];
        }
      }

      // 发送 postback 回传
      const postbackUrl = `http://newmobi.fuse-cloud.com/pb?tid=${clickId || "unknown"}`;
      console.log(`📤 Sending postback: ${postbackUrl}`);

      fetch(postbackUrl, { method: "GET" })
        .then(async (res) => {
          const text = await res.text();
          console.log(`✅ Postback response status: ${res.status}`);
          if (text) console.log(`📦 Postback response body: ${text}`);
        })
        .catch((err) => console.error(`❌ Postback fetch error: ${err}`));

      // TODO: 在这里添加开通用户权限的逻辑
    } else {
      console.log(`ℹ️ Webhook received other event: ${status || payload.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Processing error" }, { status: 200 });
  }
}
