import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const url = `https://api.minimalistictechnology.com/api/property/${params.path.join("/")}`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  const data = await res.json();
  return NextResponse.json(data);
}
