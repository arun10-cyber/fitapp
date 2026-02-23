import { createClient } from "@supabase/supabase-js";
const supabaseProjectUrl ="https://uikzicyyppvbbezfvozu.supabase.co";
const supabaseApiUrl ="sb_publishable_5oe9haYgmfQZJbe4CzCUSg_Rqq_UNOV";
export const supabase = createClient(supabaseProjectUrl, supabaseApiUrl);
