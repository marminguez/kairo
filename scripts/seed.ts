// Carga los pacientes ficticios en Supabase.
// Uso: npm run db:seed  (lee .env.local)
import { createClient } from "@supabase/supabase-js";
import { seedSupabase } from "../src/lib/store/supabase";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y una clave de Supabase en .env.local");
  process.exit(1);
}

seedSupabase(createClient(url, key))
  .then(() => console.log("Datos de demo cargados en Supabase"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
