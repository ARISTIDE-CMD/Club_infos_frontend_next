import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const res = await fetch(
    `http://localhost:8108/collections/students/documents/search?q=${q}&query_by=first_name`,
    {
      headers: {
        "X-TYPESENSE-API-KEY": "xyz",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
