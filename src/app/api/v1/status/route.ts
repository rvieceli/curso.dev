import { NextRequest, NextResponse } from "next/server";

import * as database from "infra/database";

export async function GET(request: NextRequest) {
  const updated_at = new Date().toISOString();

  const {
    rows: [{ max_connections }],
  } = await database.query("show max_connections;");

  const {
    rows: [{ server_version: version }],
  } = await database.query("show server_version;");

  const {
    rows: [{ open_connections }],
  } = await database.query(
    `
    select count(1)::integer as open_connections
    from pg_stat_activity
    where "datname" = $1;
    `,
    [process.env.POSTGRES_DB],
  );

  return NextResponse.json({
    updated_at,
    dependencies: {
      database: {
        max_connections: parseInt(max_connections),
        open_connections,
        version,
      },
    },
  });
}

export type ResponseBody = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T
  : never;
