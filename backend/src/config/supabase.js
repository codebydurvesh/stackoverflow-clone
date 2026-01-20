import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase URL and service role key must be provided in environment variables.",
  );
}

// Initialize the client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabase;
