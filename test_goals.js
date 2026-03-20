import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envStr = fs.readFileSync("C:/Project10/fitapp/.env.txt", "utf8");
let url = ""; let key = "";
envStr.split('\n').forEach(line => {
    if (line.startsWith("VITE_SUPABASE_URL=")) url = line.split("=")[1].trim();
    if (line.startsWith("VITE_SUPABASE_ANON_KEY=")) key = line.split("=")[1].trim();
});

const supabase = createClient(url, key);

async function testGoals() {
    const { data, error } = await supabase.from('goals').select('*').limit(3);
    console.log("TESTING GOALS TABLE:");
    console.log(data);
    if (error) console.log("ERROR:", error);
}
testGoals();
