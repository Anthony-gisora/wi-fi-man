export const GET = async () => {
  try {
    // what safaricom sends back
    const body = await req.body.json();

    console.log(
      `callback data from safaricom: `,
      JSON.stringify(body, null, 2)
    );
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
