import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve((req) => {
  return new Response("Hello, Deno Deploy!", {
    headers: { "Content-Type": "text/plain" },
  });
});
