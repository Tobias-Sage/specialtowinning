import { NextRequest, NextResponse } from "next/server";

const WALLETPLUG_API_URL = "https://walletplug.com/api/v1/initiate-payment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, description, clickId } = body;

    // 生成唯一订单号，包含 click_id 用于后续回传
    const refTrx = clickId
      ? `EMBED-${clickId}-${Date.now()}`
      : `EMBED-${Date.now()}`;

    const payload = {
      payment_amount: amount,
      currency_code: currency || "USD",
      ref_trx: refTrx,
      description: description || "Special To Winning",
      success_redirect: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`,
      cancel_redirect: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      allow_payment_methods: ["card"],
      // 关键参数：启用嵌入式模式，隐藏 WalletPlug 品牌
      embed_style: "minimal",
      embed_pay_label: "Pay Now",
    };

    const response = await fetch(WALLETPLUG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Environment": process.env.WALLETPLUG_ENVIRONMENT || "production",
        "X-Merchant-Key": process.env.WALLETPLUG_MERCHANT_KEY!,
        "X-API-Key": process.env.WALLETPLUG_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WalletPlug API Error:", data);
      return NextResponse.json(
        { error: data.message || "Payment initiation failed" },
        { status: response.status }
      );
    }

    // 返回 card_url 用于 iframe 嵌入
    return NextResponse.json({
      success: true,
      cardUrl: data.card_url || data.payment_url,
      refTrx: refTrx,
    });
  } catch (error) {
    console.error("Initiate payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
