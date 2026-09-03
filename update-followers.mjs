#!/usr/bin/env node
/**
 * Schreibt die aktuelle Follower-Zahl von @nudedivinestudio nach followers.json.
 * Taeglich per Cron oder GitHub Action ausfuehren.
 *
 *   IG_USER_ID=17841400000000000 IG_TOKEN=EAAG... node update-followers.mjs
 *
 * Voraussetzungen (einmalig einrichten):
 *   1. Instagram-Konto auf "Business" oder "Creator" umstellen
 *   2. Mit einer Facebook-Seite verbinden
 *   3. In developers.facebook.com eine App anlegen, Produkt "Instagram Graph API"
 *   4. Long-lived Page Access Token erzeugen (Laufzeit 60 Tage, verlaengerbar)
 *   5. IG_USER_ID auslesen:
 *      GET https://graph.facebook.com/v21.0/me/accounts?access_token=TOKEN
 *      GET https://graph.facebook.com/v21.0/<PAGE_ID>?fields=instagram_business_account&access_token=TOKEN
 *
 * Ohne Business-Konto gibt es keinen offiziellen Weg an die Zahl. Dann bleibt
 * der Rueckfallwert in A-haut.html stehen und wird von Hand gepflegt.
 */

import { writeFile, readFile } from "node:fs/promises";

const USER_ID = process.env.IG_USER_ID;
const TOKEN = process.env.IG_TOKEN;
const OUT = new URL("./followers.json", import.meta.url);
const API = "https://graph.facebook.com/v21.0";

if (!USER_ID || !TOKEN) {
  console.error("IG_USER_ID und IG_TOKEN muessen gesetzt sein.");
  process.exit(1);
}

const res = await fetch(`${API}/${USER_ID}?fields=followers_count&access_token=${TOKEN}`);
if (!res.ok) {
  console.error(`Graph API antwortete mit ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const { followers_count: followers } = await res.json();

if (typeof followers !== "number" || followers <= 0) {
  console.error("Unplausible Antwort, followers.json bleibt unveraendert.");
  process.exit(1);
}

// Sprung von mehr als 40 % deutet auf einen API-Fehler hin, nicht auf Wachstum.
try {
  const previous = JSON.parse(await readFile(OUT, "utf8")).followers;
  if (previous && Math.abs(followers - previous) / previous > 0.4) {
    console.error(`Sprung von ${previous} auf ${followers} - abgebrochen, bitte pruefen.`);
    process.exit(1);
  }
} catch {
  // erste Ausfuehrung, keine Vorgaengerdatei
}

await writeFile(
  OUT,
  JSON.stringify({ followers, updated: new Date().toISOString().slice(0, 10) }, null, 2) + "\n"
);

console.log(`followers.json aktualisiert: ${followers}`);
