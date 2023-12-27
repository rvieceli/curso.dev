import { NextRequest, NextResponse } from "next/server";

import * as database from "infra/database";

type MaxConnectionsRow = { max_connections: string };
type ServerVersionRow = { server_version: string };
type OpenConnectionsRow = { open_connections: number };

export async function GET(request: NextRequest) {
  const updated_at = new Date().toISOString();

  const {
    rows: [{ max_connections }],
  } = await database.query<MaxConnectionsRow>("show max_connections;");

  const {
    rows: [{ server_version: version }],
  } = await database.query<ServerVersionRow>("show server_version;");

  const {
    rows: [{ open_connections }],
  } = await database.query<OpenConnectionsRow>`
    select count(1)::integer as open_connections
    from pg_stat_activity
    where "datname" = ${process.env.POSTGRES_DB};
  `;

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
