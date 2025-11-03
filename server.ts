import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gestion des requêtes OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSs_bnye2vq05mIeJNt72DZpYDjBqLE7zNtlVX0_067j9Y_0r5yHN8RkHhWUdmxqTBN0_EctJNqxahe/pub?gid=0&single=true&output=csv';

    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Échec de la récupération du CSV : ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      return obj;
    });

    // Retourne les données en JSON
    return new Response(
      JSON.stringify({ data, headers }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
