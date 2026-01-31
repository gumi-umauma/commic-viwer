import { Pool } from "pg";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const pool = new Pool({
  host: getRequiredEnv("DB_HOST"),
  port: Number(getRequiredEnv("DB_PORT")),
  database: getRequiredEnv("DB_NAME"),
  user: getRequiredEnv("DB_USER"),
  password: getRequiredEnv("DB_PASSWORD"),
});

export { pool };
