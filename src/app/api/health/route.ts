export async function GET(req: Request) {
  return Response.json(
    { success: true, message: "Health is Good" },
    { status: 200 }
  );
}
