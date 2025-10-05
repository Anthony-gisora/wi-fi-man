import axios from "axios";
import { headers } from "next/headers";

export const POST = async (req) => {
  try {
    const { phone, amount } = await req.json();

    // credentials
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const ShortCode = process.env.MPESA_SHORTCODE;
    const PassKey = process.env.MPESA_PASSKEY;
    const callBackUrl = process.env.MPESA_CALLBACK_URL;

    // access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const accessToken = tokenResponse.data.accessToken;

    // prepare STK push
    const timeStamp = Date.now()
      .toString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(ShortCode + PassKey + timeStamp).toString(
      "base64"
    );

    const STKResponse = await axios.post(
      " https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        businessShortCode: ShortCode,
        Password: password,
        Timestamp: timeStamp,
        transactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: ShortCode,
        phoneNumber: phone,
        CallbackURL: callBackUrl,
        AccountReference: "wifi-sub",
        TransactionDesc: "Wifi Subscription",
      },
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      }
    );

    return new Response(JSON.stringify(STKResponse.data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify(
        {
          error: true,
          errorMessage: error?.response?.data || error.message,
        },
        { status: 500 }
      )
    );
  }
};
