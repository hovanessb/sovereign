import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

async function testClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("URL:", url);
  console.log("KEY prefix:", key?.substring(0, 15));

  if (!url || !key) {
    console.error("Missing credentials");
    process.exit(1);
  }

  try {
    const supabase = createClient(url, key);
    
    console.log("Client created. Attempting to subscribe to 'products' changes...");
    supabase
      .channel("vault-inventory")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe((status, err) => {
        console.log("Subscribe status:", status);
        if (err) console.error("Subscribe error:", err);
        
        if (status === "SUBSCRIBED" || status === "TIMED_OUT" || status === "CLOSED" || status === "CHANNEL_ERROR") {
          setTimeout(() => process.exit(status === "SUBSCRIBED" ? 0 : 1), 1000);
        }
      });
  } catch (err) {
    console.error("Exception:", err);
    process.exit(1);
  }
}

testClient();
