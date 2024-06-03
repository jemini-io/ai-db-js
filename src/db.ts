import { readFileSync } from 'fs';
import {
  ConnectionConfig,
  createConnection,
  Connection,
} from 'mysql2/promise';

let connection: Connection | undefined = undefined;

// DB
const connectionInfo: Partial<ConnectionConfig> = {
  uri: process.env.DATABASE_URL,
};

// Used to get db schema
const dbSchemaSql = readFileSync('res/schema.sql', 'utf8');
export async function getSchema() {
  return dbSchemaSql;
}

// handles query processing
export async function query(sql: string) {
  const [queryResults] = await (
    await getConnection()
  ).query(sql);
  console.log({ queryResults });
  return queryResults;
}

// handles connection
async function getConnection() {
  if (connection) {
    return connection;
  }
  connection = await createConnection(connectionInfo);
  return connection;
}
getConnection().catch(console.error);

//
// Prisma
//
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
