import "@/utils/cronJob"; 

export async function GET() {
  return Response.json({ message: "Cron job initialized." });
}
