"use server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const data = await auth.api.identifyOrg({
    headers: req.headers,
  });

  console.log(data);
  return NextResponse.json(data);
}
