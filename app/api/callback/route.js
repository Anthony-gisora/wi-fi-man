export const POST = async (req) => {
  try {
    // Parse the callback data Safaricom sends back
    const body = await req.json();

    console.log("Callback data from Safaricom:", JSON.stringify(body, null, 2));

    return new Response(
      JSON.stringify({ message: "Callback received successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        errorMessage: error?.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
};
