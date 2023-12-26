import { NextRequest, NextResponse } from "next/server";

import * as database from "@infra/database";

export async function GET(request: NextRequest) {
  const result = await database.query("SELECT NOW();");

  console.log(result.rows);

  return NextResponse.json({
    status: "OK",
  });
}
