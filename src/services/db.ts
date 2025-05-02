import { createClient, Client, ResultSet } from "@libsql/client";

const tursoUrl = import.meta.env.VITE_TURSO_URL!;
const tursoToken = import.meta.env.VITE_TURSO_TOKEN!;

if (!tursoUrl || !tursoToken) {
  throw new Error("Faltan las variables de entorno de Turso.");
}

class Database {
  private client: Client;

  constructor() {
    this.client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result: ResultSet = await this.client.execute({ sql, args: params });
    return result.rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<ResultSet> {
    return await this.client.execute({ sql, args: params });
  }
}

const db = new Database();
export default db;
