/**
 * Shuttle Insights - Data Scraping Script
 *
 * This script scrapes badminton rankings and events from Wikipedia
 * and saves them to JSON files in the /data folder.
 *
 * Run manually: node scripts/scrape-data.js
 * Or automatically via GitHub Actions (weekly)
 *
 * Sources:
 * - Rankings: https://en.wikipedia.org/wiki/BWF_World_Ranking
 * - Events: https://en.wikipedia.org/wiki/2026_BWF_World_Tour
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ============ CONFIGURATION ============

const CONFIG = {
  // Wikipedia URLs (more reliable than official BWF site)
  RANKINGS_URL: "https://en.wikipedia.org/wiki/BWF_World_Ranking",
  EVENTS_URL: "https://en.wikipedia.org/wiki/2026_BWF_World_Tour",

  // Output paths (relative to project root)
  RANKINGS_OUTPUT: path.join(__dirname, "..", "data", "rankings.json"),
  EVENTS_OUTPUT: path.join(__dirname, "..", "data", "events.json"),

  // Request settings
  TIMEOUT: 15000,
  USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// Country code to flag emoji mapping
const COUNTRY_FLAGS = {
  "Denmark": { code: "DEN", flag: "\u{1F1E9}\u{1F1F0}" },
  "China": { code: "CHN", flag: "\u{1F1E8}\u{1F1F3}" },
  "Thailand": { code: "THA", flag: "\u{1F1F9}\u{1F1ED}" },
  "Indonesia": { code: "INA", flag: "\u{1F1EE}\u{1F1E9}" },
  "Japan": { code: "JPN", flag: "\u{1F1EF}\u{1F1F5}" },
  "Singapore": { code: "SGP", flag: "\u{1F1F8}\u{1F1EC}" },
  "Malaysia": { code: "MAS", flag: "\u{1F1F2}\u{1F1FE}" },
  "South Korea": { code: "KOR", flag: "\u{1F1F0}\u{1F1F7}" },
  "India": { code: "IND", flag: "\u{1F1EE}\u{1F1F3}" },
  "Chinese Taipei": { code: "TPE", flag: "\u{1F1F9}\u{1F1FC}" },
  "Taiwan": { code: "TPE", flag: "\u{1F1F9}\u{1F1FC}" },
  "Hong Kong": { code: "HKG", flag: "\u{1F1ED}\u{1F1F0}" },
  "England": { code: "ENG", flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}" },
  "France": { code: "FRA", flag: "\u{1F1EB}\u{1F1F7}" },
  "Germany": { code: "GER", flag: "\u{1F1E9}\u{1F1EA}" },
  "Netherlands": { code: "NED", flag: "\u{1F1F3}\u{1F1F1}" },
  "Vietnam": { code: "VIE", flag: "\u{1F1FB}\u{1F1F3}" },
  "United States": { code: "USA", flag: "\u{1F1FA}\u{1F1F8}" },
  "Canada": { code: "CAN", flag: "\u{1F1E8}\u{1F1E6}" },
  "Spain": { code: "ESP", flag: "\u{1F1EA}\u{1F1F8}" },
  "United Kingdom": { code: "GBR", flag: "\u{1F1EC}\u{1F1E7}" },
};

// ============ HELPER FUNCTIONS ============

/**
 * Makes an HTTP GET request with proper headers
 */
async function fetchPage(url) {
  console.log(`  Fetching: ${url}`);

  const response = await axios.get(url, {
    headers: {
      "User-Agent": CONFIG.USER_AGENT,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    timeout: CONFIG.TIMEOUT,
  });

  return cheerio.load(response.data);
}

/**
 * Gets country info (code and flag) from country name
 */
function getCountryInfo(countryName) {
  // Clean up the country name
  const cleaned = countryName.trim();

  // Direct match
  if (COUNTRY_FLAGS[cleaned]) {
    return COUNTRY_FLAGS[cleaned];
  }

  // Partial match
  for (const [name, info] of Object.entries(COUNTRY_FLAGS)) {
    if (cleaned.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(cleaned.toLowerCase())) {
      return info;
    }
  }

  // Default: use first 3 letters as code
  return {
    code: cleaned.substring(0, 3).toUpperCase(),
    flag: ""
  };
}

/**
 * Reads existing JSON file (for fallback)
 */
function readExistingData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.log(`  Could not read existing file: ${error.message}`);
  }
  return null;
}

/**
 * Writes data to JSON file
 */
function writeJsonFile(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  Saved to: ${filePath}`);
}

// ============ SCRAPING FUNCTIONS ============

/**
 * Scrapes BWF Men's Singles rankings from Wikipedia
 */
async function scrapeRankings() {
  console.log("\n[RANKINGS] Starting rankings scrape...");

  try {
    const $ = await fetchPage(CONFIG.RANKINGS_URL);
    const rankings = [];

    // Find the Men's Singles table
    // Wikipedia tables usually have class "wikitable"
    $("table.wikitable").each((tableIndex, table) => {
      const $table = $(table);
      const headerText = $table.prev("h3, h2").text().toLowerCase();
      const captionText = $table.find("caption").text().toLowerCase();

      // Look for Men's Singles table
      const ismensSingles =
        headerText.includes("men") && headerText.includes("single") ||
        captionText.includes("men") && captionText.includes("single") ||
        $table.find("th").text().toLowerCase().includes("men's singles");

      if (rankings.length === 0) {
        // Try to parse any ranking table we find
        $table.find("tbody tr").each((rowIndex, row) => {
          if (rankings.length >= 10) return false; // Only get top 10

          const $row = $(row);
          const cells = $row.find("td");

          if (cells.length >= 3) {
            // Try to extract rank, name, country, points
            const rankText = $(cells[0]).text().trim();
            const rank = parseInt(rankText) || rowIndex + 1;

            // Skip if not a valid rank
            if (isNaN(rank) || rank < 1 || rank > 100) return;

            // Name is usually in cell 1 or 2
            let name = "";
            let country = "";
            let points = 0;

            cells.each((cellIndex, cell) => {
              const text = $(cell).text().trim();

              // Check if it's a name (contains letters, possibly with link)
              const link = $(cell).find("a").first();
              if (link.length && !name && cellIndex > 0) {
                const linkText = link.text().trim();
                // Name usually doesn't contain numbers
                if (linkText && !/^\d+$/.test(linkText) && linkText.length > 2) {
                  name = linkText;
                }
              }

              // Check for country (flag image or country name)
              const flagImg = $(cell).find("img").first();
              if (flagImg.length) {
                const alt = flagImg.attr("alt") || "";
                if (alt && !country) {
                  country = alt.replace(/flag of /i, "").trim();
                }
              }

              // Check for points (large number)
              const num = parseInt(text.replace(/,/g, ""));
              if (!isNaN(num) && num > 1000 && num < 200000) {
                points = num;
              }
            });

            // Only add if we have at least a name
            if (name && name.length > 2) {
              const countryInfo = getCountryInfo(country || "Unknown");

              rankings.push({
                rank: rankings.length + 1, // Use sequential rank
                name: name,
                country: country || "Unknown",
                countryCode: countryInfo.code,
                points: points || 0,
                change: 0, // Wikipedia doesn't show changes
              });
            }
          }
        });
      }
    });

    if (rankings.length >= 5) {
      console.log(`  Successfully scraped ${rankings.length} rankings`);
      return {
        lastUpdated: new Date().toISOString(),
        source: "Wikipedia BWF World Ranking",
        rankings: rankings,
      };
    }

    console.log("  Could not find enough rankings in Wikipedia tables");
    return null;

  } catch (error) {
    console.error(`  Error scraping rankings: ${error.message}`);
    return null;
  }
}

/**
 * Scrapes BWF events from Wikipedia
 */
async function scrapeEvents() {
  console.log("\n[EVENTS] Starting events scrape...");

  try {
    const $ = await fetchPage(CONFIG.EVENTS_URL);
    const events = [];

    // Look for tournament tables
    $("table.wikitable").each((tableIndex, table) => {
      const $table = $(table);

      $table.find("tbody tr").each((rowIndex, row) => {
        if (events.length >= 15) return false; // Limit to 15 events

        const $row = $(row);
        const cells = $row.find("td");

        if (cells.length >= 3) {
          let name = "";
          let date = "";
          let location = "";
          let tier = "";

          cells.each((cellIndex, cell) => {
            const text = $(cell).text().trim();
            const link = $(cell).find("a").first();

            // Tournament name (usually has a link)
            if (link.length && !name) {
              const linkText = link.text().trim();
              if (linkText.toLowerCase().includes("open") ||
                  linkText.toLowerCase().includes("masters") ||
                  linkText.toLowerCase().includes("championship") ||
                  linkText.toLowerCase().includes("super")) {
                name = linkText;
              }
            }

            // Date pattern (Month Day-Day, Year or similar)
            if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text) &&
                /\d{1,2}/.test(text)) {
              if (!date) date = text;
            }

            // Location (city, country)
            if (text.includes(",") && !name && !date) {
              location = text;
            }

            // Tier (Super 100, Super 300, etc.)
            if (/super\s*\d+|world tour finals|major/i.test(text.toLowerCase())) {
              tier = text;
            }
          });

          if (name && name.length > 3) {
            events.push({
              name: name,
              date: date || "TBD",
              location: location || "TBD",
              tier: tier || "BWF Tour",
              link: `https://bwfbadminton.com/`,
            });
          }
        }
      });
    });

    if (events.length >= 3) {
      console.log(`  Successfully scraped ${events.length} events`);
      return {
        lastUpdated: new Date().toISOString(),
        source: "Wikipedia 2026 BWF World Tour",
        events: events,
      };
    }

    console.log("  Could not find enough events in Wikipedia tables");
    return null;

  } catch (error) {
    console.error(`  Error scraping events: ${error.message}`);
    return null;
  }
}

// ============ MAIN FUNCTION ============

async function main() {
  console.log("=".repeat(60));
  console.log("  Shuttle Insights - Data Scraper");
  console.log("  " + new Date().toISOString());
  console.log("=".repeat(60));

  let rankingsUpdated = false;
  let eventsUpdated = false;

  // ---- Scrape Rankings ----
  const newRankings = await scrapeRankings();

  if (newRankings && newRankings.rankings.length >= 5) {
    writeJsonFile(CONFIG.RANKINGS_OUTPUT, newRankings);
    rankingsUpdated = true;
  } else {
    console.log("\n[RANKINGS] Scraping failed, keeping existing data");
    const existing = readExistingData(CONFIG.RANKINGS_OUTPUT);
    if (existing) {
      console.log(`  Existing data has ${existing.rankings?.length || 0} rankings`);
    }
  }

  // ---- Scrape Events ----
  const newEvents = await scrapeEvents();

  if (newEvents && newEvents.events.length >= 3) {
    writeJsonFile(CONFIG.EVENTS_OUTPUT, newEvents);
    eventsUpdated = true;
  } else {
    console.log("\n[EVENTS] Scraping failed, keeping existing data");
    const existing = readExistingData(CONFIG.EVENTS_OUTPUT);
    if (existing) {
      console.log(`  Existing data has ${existing.events?.length || 0} events`);
    }
  }

  // ---- Summary ----
  console.log("\n" + "=".repeat(60));
  console.log("  SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Rankings: ${rankingsUpdated ? "UPDATED" : "UNCHANGED (using existing)"}`);
  console.log(`  Events:   ${eventsUpdated ? "UPDATED" : "UNCHANGED (using existing)"}`);
  console.log("=".repeat(60) + "\n");

  // Exit with appropriate code
  // 0 = success (data updated or kept existing)
  // 1 = failure (would only happen if critical error)
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error("\n[FATAL] Unexpected error:", error.message);
  process.exit(1);
});
