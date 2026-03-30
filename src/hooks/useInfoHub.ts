import { useState, useEffect } from "react";
import { newsArticles as mockNews, rankings as mockRankings, upcomingEvents as mockEvents } from "@/data/mockData";

// ============ TYPES ============
export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  link?: string;
  source?: string;
}

export interface Ranking {
  rank: number;
  name: string;
  country: string;
  points: number;
  change: number;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  location: string;
  tier: string;
  link?: string;
}

export interface InfoHubData {
  news: NewsArticle[];
  rankings: Ranking[];
  events: UpcomingEvent[];
  loading: boolean;
  error: string | null;
}

// Backend API base URL
const API_BASE = "http://localhost:3001/api";

// ============ NEWS FETCHING ============
async function fetchNews(): Promise<NewsArticle[]> {
  console.log("fetchNews started");

  try {
    const response = await fetch(`${API_BASE}/news`);
    console.log("fetchNews response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const articles = await response.json();
    console.log("fetchNews success, articles:", articles);

    return articles.length > 0 ? articles : mockNews;
  } catch (error) {
    console.error("fetchNews error:", error);
    return mockNews;
  }
}

// ============ RANKINGS FETCHING ============
async function fetchRankings(): Promise<Ranking[]> {
  console.log("fetchRankings started");

  try {
    const response = await fetch(`${API_BASE}/rankings`);
    console.log("fetchRankings response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch rankings: ${response.status}`);
    }

    const rankings = await response.json();
    console.log("fetchRankings success, rankings:", rankings);

    return rankings.length > 0 ? rankings : mockRankings;
  } catch (error) {
    console.error("fetchRankings error:", error);
    return mockRankings;
  }
}

// ============ EVENTS FETCHING ============
async function fetchEvents(): Promise<UpcomingEvent[]> {
  console.log("fetchEvents started");

  try {
    const response = await fetch(`${API_BASE}/events`);
    console.log("fetchEvents response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const events = await response.json();
    console.log("fetchEvents success, events:", events);

    return events.length > 0 ? events : mockEvents;
  } catch (error) {
    console.error("fetchEvents error:", error);
    return mockEvents;
  }
}

// ============ MAIN HOOK ============
export function useInfoHub(): InfoHubData {
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [rankings, setRankings] = useState<Ranking[]>(mockRankings);
  const [events, setEvents] = useState<UpcomingEvent[]>(mockEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [newsData, rankingsData, eventsData] = await Promise.all([
          fetchNews(),
          fetchRankings(),
          fetchEvents(),
        ]);

        setNews(newsData);
        setRankings(rankingsData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching info hub data:", err);
        setError("Failed to fetch some data. Showing cached results.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  return { news, rankings, events, loading, error };
}
