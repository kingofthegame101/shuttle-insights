const express = require("express");
const cors = require("cors");
const axios = require("axios");
const xml2js = require("xml2js");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Enable CORS for all localhost ports
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Fallback images for news articles when extraction fails
const FALLBACK_IMAGES = {
  "Tournament": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=300&fit=crop",
  "Singapore": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=300&fit=crop",
  "Player News": "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=600&h=300&fit=crop",
  "Equipment": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop",
  "News": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop",
};

// Get fallback image URL based on category
function getFallbackImage(category) {
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES["News"];
}

// Extract image from news article URL
async function extractImageFromUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 5000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Try to get og:image first (most reliable for news sites)
    let imageUrl = $('meta[property="og:image"]').attr("content");

    // Try twitter:image
    if (!imageUrl) {
      imageUrl = $('meta[name="twitter:image"]').attr("content");
    }

    // Try article:image
    if (!imageUrl) {
      imageUrl = $('meta[property="article:image"]').attr("content");
    }

    // Try first large image in article content
    if (!imageUrl) {
      const articleImg = $("article img, .article img, .post img, .content img, main img").first().attr("src");
      if (articleImg && !articleImg.includes("logo") && !articleImg.includes("icon")) {
        imageUrl = articleImg;
      }
    }

    // Make sure URL is absolute
    if (imageUrl && !imageUrl.startsWith("http")) {
      const urlObj = new URL(url);
      imageUrl = new URL(imageUrl, urlObj.origin).href;
    }

    return imageUrl || null;
  } catch (error) {
    console.log(`[IMAGE] Failed to extract image from ${url}: ${error.message}`);
    return null;
  }
}

// Fallback BWF Men's Singles Rankings (2026)
const fallbackRankings = [
  { rank: 1, name: "Viktor Axelsen", country: "🇩🇰 Denmark", points: 109000, change: 0 },
  { rank: 2, name: "Shi Yuqi", country: "🇨🇳 China", points: 98000, change: 1 },
  { rank: 3, name: "Kunlavut Vitidsarn", country: "🇹🇭 Thailand", points: 95000, change: -1 },
  { rank: 4, name: "Anders Antonsen", country: "🇩🇰 Denmark", points: 87000, change: 0 },
  { rank: 5, name: "Lee Zii Jia", country: "🇲🇾 Malaysia", points: 82000, change: 2 },
  { rank: 6, name: "Loh Kean Yew", country: "🇸🇬 Singapore", points: 78000, change: 1 },
  { rank: 7, name: "Jonatan Christie", country: "🇮🇩 Indonesia", points: 75000, change: -2 },
  { rank: 8, name: "Chou Tien Chen", country: "🇹🇼 Chinese Taipei", points: 71000, change: 0 },
  { rank: 9, name: "Kodai Naraoka", country: "🇯🇵 Japan", points: 68000, change: -1 },
  { rank: 10, name: "Lakshya Sen", country: "🇮🇳 India", points: 65000, change: 1 },
];

// Country code to flag mapping
const countryFlags = {
  "DEN": "🇩🇰", "CHN": "🇨🇳", "THA": "🇹🇭", "INA": "🇮🇩", "JPN": "🇯🇵",
  "SGP": "🇸🇬", "MAS": "🇲🇾", "KOR": "🇰🇷", "IND": "🇮🇳", "TPE": "🇹🇼",
  "HKG": "🇭🇰", "ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "FRA": "🇫🇷", "GER": "🇩🇪", "NED": "🇳🇱",
  "VIE": "🇻🇳", "USA": "🇺🇸", "CAN": "🇨🇦", "ESP": "🇪🇸", "GBR": "🇬🇧",
};

// ============ JSON FILE READING ============
// Path to data files (created by GitHub Actions scraper)
const DATA_DIR = path.join(__dirname, "..", "data");
const RANKINGS_FILE = path.join(DATA_DIR, "rankings.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

/**
 * Reads rankings from the JSON file
 * Falls back to hardcoded data if file doesn't exist or is invalid
 */
function readRankingsFromFile() {
  try {
    if (fs.existsSync(RANKINGS_FILE)) {
      const data = fs.readFileSync(RANKINGS_FILE, "utf8");
      const parsed = JSON.parse(data);

      if (parsed.rankings && Array.isArray(parsed.rankings) && parsed.rankings.length > 0) {
        console.log(`[RANKINGS] Loaded ${parsed.rankings.length} rankings from JSON file`);
        console.log(`[RANKINGS] Last updated: ${parsed.lastUpdated || "unknown"}`);

        // Add flag emojis to country names for display
        return parsed.rankings.map(player => ({
          ...player,
          country: `${countryFlags[player.countryCode] || ""} ${player.country}`.trim(),
        }));
      }
    }
    console.log("[RANKINGS] JSON file not found or empty, using fallback data");
    return null;
  } catch (error) {
    console.error("[RANKINGS] Error reading JSON file:", error.message);
    return null;
  }
}

/**
 * Reads events from the JSON file
 * Falls back to hardcoded data if file doesn't exist or is invalid
 */
function readEventsFromFile() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, "utf8");
      const parsed = JSON.parse(data);

      if (parsed.events && Array.isArray(parsed.events) && parsed.events.length > 0) {
        console.log(`[EVENTS] Loaded ${parsed.events.length} events from JSON file`);
        console.log(`[EVENTS] Last updated: ${parsed.lastUpdated || "unknown"}`);
        return parsed.events;
      }
    }
    console.log("[EVENTS] JSON file not found or empty, using fallback data");
    return null;
  } catch (error) {
    console.error("[EVENTS] Error reading JSON file:", error.message);
    return null;
  }
}

// Fetch real BWF rankings from BWF Tournament Software API
async function fetchBWFRankings() {
  try {
    console.log("[RANKINGS] Attempting to fetch from BWF Tournament Software API...");

    // BWF Tournament Software API endpoint for Men's Singles rankings
    const apiUrl = "https://bwf.tournamentsoftware.com/ranking/category.aspx?id=42918&category=472";

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const rankings = [];

    // Parse the ranking table
    $("table.ruler tbody tr").each((index, element) => {
      if (index >= 10) return false; // Only get top 10

      const $row = $(element);
      const cells = $row.find("td");

      if (cells.length >= 4) {
        const rank = parseInt($(cells[0]).text().trim()) || index + 1;

        // Get player name (usually in a link)
        const nameCell = $(cells[1]);
        let name = nameCell.find("a").first().text().trim();
        if (!name) name = nameCell.text().trim();

        // Get country code
        const countryCell = $(cells[2]);
        let countryCode = countryCell.find("img").attr("title") ||
                          countryCell.text().trim().substring(0, 3).toUpperCase();

        // Map common country codes
        const countryCodeMap = {
          "Denmark": "DEN", "China": "CHN", "Thailand": "THA",
          "Indonesia": "INA", "Japan": "JPN", "Singapore": "SGP",
          "Malaysia": "MAS", "Korea": "KOR", "India": "IND",
          "Chinese Taipei": "TPE", "Hong Kong": "HKG"
        };

        if (countryCodeMap[countryCode]) {
          countryCode = countryCodeMap[countryCode];
        }

        const flag = countryFlags[countryCode] || "";
        const country = flag ? `${flag} ${countryCode}` : countryCode;

        // Get points
        const pointsText = $(cells[3]).text().trim().replace(/[,\s]/g, "");
        const points = parseInt(pointsText) || 0;

        // Get change indicator if available
        const changeCell = cells.length > 4 ? $(cells[4]) : null;
        let change = 0;
        if (changeCell) {
          const changeText = changeCell.text().trim();
          if (changeText.includes("▲") || changeText.includes("+")) change = 1;
          else if (changeText.includes("▼") || changeText.includes("-")) change = -1;
        }

        if (name && rank) {
          rankings.push({ rank, name, country, points, change });
        }
      }
    });

    if (rankings.length >= 5) {
      console.log(`[RANKINGS] Successfully fetched ${rankings.length} rankings from API`);
      return rankings;
    }

    // If API parsing didn't work, try alternative BWF rankings page
    console.log("[RANKINGS] API parsing returned insufficient data, trying alternative...");
    return await fetchBWFRankingsAlternative();
  } catch (error) {
    console.error("[RANKINGS] API fetch failed:", error.message);
    return await fetchBWFRankingsAlternative();
  }
}

// Alternative method to fetch rankings from BWF main site
async function fetchBWFRankingsAlternative() {
  try {
    console.log("[RANKINGS] Trying alternative BWF rankings source...");

    // Try fetching from BWF rankings JSON API (if available)
    const response = await axios.get("https://extranet.bwfbadminton.com/api/v1/rankings/ms", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    if (response.data && Array.isArray(response.data)) {
      const rankings = response.data.slice(0, 10).map((player, index) => ({
        rank: player.rank || index + 1,
        name: player.name || player.player_name || "",
        country: `${countryFlags[player.country_code] || ""} ${player.country_code || ""}`.trim(),
        points: player.points || 0,
        change: player.change || 0,
      }));

      if (rankings.length >= 5) {
        console.log(`[RANKINGS] Successfully fetched ${rankings.length} rankings from alternative API`);
        return rankings;
      }
    }

    console.log("[RANKINGS] Alternative fetch returned insufficient data, using fallback");
    return fallbackRankings;
  } catch (error) {
    console.error("[RANKINGS] Alternative fetch failed:", error.message);
    return fallbackRankings;
  }
}

// BWF Upcoming Events (2026) with individual URLs
const bwfEvents = [
  {
    name: "Malaysia Open 2026",
    date: "Jan 2026",
    location: "Kuala Lumpur, Malaysia",
    tier: "Super 1000",
    link: "https://bwfbadminton.com/tournament/4748/perodua-malaysia-masters-2026"
  },
  {
    name: "BWF Thomas & Uber Cup",
    date: "May 2026",
    location: "Chengdu, China",
    tier: "Major",
    link: "https://bwfbadminton.com/tournament/4750/thomas-uber-cup-finals-2026"
  },
  {
    name: "KFF Singapore Badminton Open",
    date: "May 26-31, 2026",
    location: "Singapore Indoor Stadium",
    tier: "Super 500",
    link: "https://bwfbadminton.com/tournament/4752/singapore-badminton-open-2026"
  },
  {
    name: "Indonesia Open 2026",
    date: "Jun 2026",
    location: "Jakarta, Indonesia",
    tier: "Super 1000",
    link: "https://bwfbadminton.com/tournament/4754/indonesia-open-2026"
  },
  {
    name: "BWF World Championships",
    date: "Aug 2026",
    location: "Paris, France",
    tier: "Major",
    link: "https://bwfbadminton.com/tournament/4756/bwf-world-championships-2026"
  },
];

// Helper function to categorize news
function categorizeArticle(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("tournament") || titleLower.includes("open") || titleLower.includes("championship")) {
    return "Tournament";
  } else if (titleLower.includes("injury") || titleLower.includes("retire") || titleLower.includes("return")) {
    return "Player News";
  } else if (titleLower.includes("yonex") || titleLower.includes("racket") || titleLower.includes("equipment")) {
    return "Equipment";
  } else if (titleLower.includes("singapore")) {
    return "Singapore";
  }
  return "News";
}

// Helper function to format date
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

// ============ API ENDPOINTS ============

// GET /api/news - Fetch badminton news from Google News RSS
app.get("/api/news", async (req, res) => {
  console.log("[NEWS] Fetching news from Google News RSS...");

  try {
    const rssUrl = "https://news.google.com/rss/search?q=badminton+singapore&hl=en-SG&gl=SG&ceid=SG:en";

    const response = await axios.get(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    console.log("[NEWS] RSS fetched, parsing XML...");

    // Parse XML to JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const items = result?.rss?.channel?.item || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    console.log(`[NEWS] Found ${itemsArray.length} items`);

    // Create articles with placeholder images first
    const articlesWithoutImages = itemsArray.slice(0, 8).map((item, index) => {
      const title = item.title || "";
      const link = item.link || "";
      const pubDate = item.pubDate || "";
      const source = item.source?._ || item.source || "Google News";
      const category = categorizeArticle(title);

      return {
        id: index + 1,
        title: title.replace(/ - .*$/, ""), // Remove source suffix
        link,
        source,
        date: formatDate(pubDate),
        category,
        excerpt: `Source: ${source}`,
        image: getFallbackImage(category), // Will be replaced with actual image
      };
    });

    // Extract images from article URLs in parallel
    console.log("[NEWS] Extracting images from article URLs...");
    const imagePromises = articlesWithoutImages.map(async (article) => {
      if (article.link) {
        const extractedImage = await extractImageFromUrl(article.link);
        if (extractedImage) {
          console.log(`[NEWS] Found image for: ${article.title.substring(0, 30)}...`);
          return { ...article, image: extractedImage };
        }
      }
      return article;
    });

    const articles = await Promise.all(imagePromises);

    console.log(`[NEWS] Returning ${articles.length} articles`);
    res.json(articles);
  } catch (error) {
    console.error("[NEWS] Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news", message: error.message });
  }
});

// GET /api/rankings - Return BWF Men's Singles rankings from JSON file
app.get("/api/rankings", (req, res) => {
  console.log("[RANKINGS] Fetching BWF rankings...");

  // Try to read from JSON file first (updated by GitHub Actions)
  const fileRankings = readRankingsFromFile();

  if (fileRankings) {
    res.json(fileRankings);
  } else {
    // Fallback to hardcoded data if file doesn't exist
    console.log("[RANKINGS] Using fallback rankings data");
    res.json(fallbackRankings);
  }
});

// GET /api/events - Return upcoming BWF events from JSON file
app.get("/api/events", (req, res) => {
  console.log("[EVENTS] Fetching BWF events...");

  // Try to read from JSON file first (updated by GitHub Actions)
  const fileEvents = readEventsFromFile();

  if (fileEvents) {
    res.json(fileEvents);
  } else {
    // Fallback to hardcoded data if file doesn't exist
    console.log("[EVENTS] Using fallback events data");
    res.json(bwfEvents);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏸 Shuttle Insights Backend running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET /api/news     - Fetch badminton news`);
  console.log(`  GET /api/rankings - Get BWF rankings`);
  console.log(`  GET /api/events   - Get upcoming events`);
  console.log(`  GET /api/health   - Health check\n`);
});
