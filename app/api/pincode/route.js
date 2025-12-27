import pinCodes from "@/pincodes.json"

export const GET = async () => {
  try {

    return new Response(JSON.stringify(pinCodes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "some isue fetching pin codes", error }),
      {
        status: 500,
      }
    );
  }
};
