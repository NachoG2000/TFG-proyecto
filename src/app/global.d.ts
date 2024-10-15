import { Database as DB } from "../../database.types";

type Course = DB['public']['Tables']['courses']['Row'];

declare global {
  type Database = DB;
}

