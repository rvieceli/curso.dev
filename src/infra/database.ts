import { QueryConfig, QueryResult, QueryResultRow, Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

function assembleQuery(textFragments: TemplateStringsArray, values: any[]) {
  let text = textFragments[0] ?? "";

  values.forEach((value, index) => {
    text += `$${index + 1}${textFragments[index + 1]}`;
  });

  return { text, values };
}

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && "raw" in value && Array.isArray(value.raw);
}

export async function query<Row extends QueryResultRow = any>(
  text: string,
): Promise<QueryResult<Row>>;
export async function query<Row extends QueryResultRow = any>(
  config: QueryConfig,
): Promise<QueryResult<Row>>;
export async function query<Row extends QueryResultRow = any>(
  textFragments: TemplateStringsArray,
  ...values: any[]
): Promise<QueryResult<Row>>;
export async function query<Row extends QueryResultRow = any>(
  textOrConfigOrTextFragments: string | TemplateStringsArray | QueryConfig,
  ...values: any[]
) {
  const client = await pool.connect();

  try {
    const queryTextOrConfig =
      typeof textOrConfigOrTextFragments === "string"
        ? textOrConfigOrTextFragments
        : isTemplateStringsArray(textOrConfigOrTextFragments)
          ? assembleQuery(textOrConfigOrTextFragments, values)
          : textOrConfigOrTextFragments;

    const result = await client.query<Row>(queryTextOrConfig);

    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
