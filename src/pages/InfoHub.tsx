import { motion } from "framer-motion";
import { Trophy, Calendar, TrendingUp, TrendingDown, Minus, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInfoHub } from "@/hooks/useInfoHub";

export default function InfoHub() {
  const { news, rankings, events, loading, error } = useInfoHub();

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Info Hub</h1>
      <p className="mb-6 text-muted-foreground">Badminton news, rankings & tournament schedules</p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Tabs defaultValue="news">
        <TabsList>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading latest news...</span>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {news.map((article, i) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <a
                    href={article.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                      <div className="h-40 overflow-hidden">
                        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="secondary">{article.category}</Badge>
                          {article.link && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                        <h3 className="mb-1 font-display font-semibold line-clamp-2">{article.title}</h3>
                        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{article.date}</span>
                          {article.source && <span className="truncate ml-2">{article.source}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rankings" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading rankings...</span>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-shuttle-gold" /> BWF Men's Singles Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="w-16 text-center">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((r) => (
                      <TableRow key={r.rank}>
                        <TableCell className="font-bold">{r.rank}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.country}</TableCell>
                        <TableCell className="text-right">{r.points.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {r.change > 0 ? <TrendingUp className="mx-auto h-4 w-4 text-shuttle-green" /> :
                           r.change < 0 ? <TrendingDown className="mx-auto h-4 w-4 text-destructive" /> :
                           <Minus className="mx-auto h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading events...</span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((event, i) => (
                <motion.div key={event.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <a
                    href={event.link || "https://bwfbadminton.com/calendar/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                      <CardContent className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge>{event.tier}</Badge>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="mb-1 font-display font-semibold">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
