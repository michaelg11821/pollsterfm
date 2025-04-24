import { NextRequest, NextResponse } from "next/server";

import { getProfile } from "@/lib/data-access/user/read";

type RequestParams = {
  params: Promise<{ username: string }>;
};

export async function GET(request: NextRequest, { params }: RequestParams) {
  const { username } = await params;

  const profile = await getProfile(username);

  if (profile) {
    return NextResponse.json(profile, { status: 200 });
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
