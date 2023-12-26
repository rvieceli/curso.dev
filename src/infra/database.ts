import { Client } from "pg";

export async function query(script: string) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT, 10),
  });
  await client.connect();
  const result = await client.query(script);
  await client.end();

  return result;
}
