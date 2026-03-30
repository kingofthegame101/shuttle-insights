import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, Loader2, TrendingUp, Footprints, Target, BarChart3, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { mockAnalysisResult, analysisHistory } from "@/data/mockData";

type Phase = "upload" | "processing" | "results";

export default function VideoAnalysis() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [progress, setProgress] = useState(0);
  const result = mockAnalysisResult;

  const handleUpload = () => {
    setPhase("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setPhase("results"), 400); return 100; }
        return p + Math.random() * 8 + 2;
      });
    }, 200);
  };

  const scoreColor = (s: number) => s >= 80 ? "text-shuttle-green" : s >= 65 ? "text-shuttle-gold" : "text-shuttle-orange";

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Video Analysis</h1>
      <p className="mb-6 text-muted-foreground">Upload a match or training video for AI-powered feedback</p>

      <AnimatePresence mode="wait">
        {/* UPLOAD */}
        {phase === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">Upload Your Video</h3>
                <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                  Upload a match or training video. Our AI will analyze your strokes, footwork, and tactics.
                </p>
                <Button size="lg" onClick={handleUpload} className="gap-2">
                  <Play className="h-4 w-4" /> Select & Analyze Video
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">Supports MP4, MOV, AVI · Max 500MB</p>
              </CardContent>
            </Card>

            {/* History sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Past Analyses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => setPhase("results")}>
                    <div>
                      <p className="font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">{h.date} · {h.duration}</p>
                    </div>
                    <Badge variant="outline" className={scoreColor(h.score)}>{h.score}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PROCESSING */}
        {phase === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="mx-auto max-w-lg">
              <CardContent className="flex flex-col items-center p-12">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                <h3 className="mb-2 font-display text-xl font-semibold">Analyzing Your Video...</h3>
                <p className="mb-4 text-sm text-muted-foreground">AI is reviewing your technique</p>
                <Progress value={Math.min(progress, 100)} className="mb-2 w-full" />
                <p className="text-xs text-muted-foreground">{Math.min(Math.round(progress), 100)}% complete</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RESULTS */}
        {phase === "results" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Overall score + radar */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="flex flex-col items-center justify-center p-6">
                <p className="mb-1 text-sm text-muted-foreground">Overall Score</p>
                <span className={`font-display text-6xl font-extrabold ${scoreColor(result.overallScore)}`}>{result.overallScore}</span>
                <p className="mt-1 text-xs text-muted-foreground">out of 100</p>
              </Card>
              <Card className="lg:col-span-2 p-4">
                <ChartContainer config={{ score: { label: "Score", color: "hsl(var(--primary))" } }} className="h-64 w-full">
                  <RadarChart data={result.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" className="text-xs" />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  </RadarChart>
                </ChartContainer>
              </Card>
            </div>

            {/* Detail tabs */}
            <Tabs defaultValue="strokes">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="strokes" className="gap-1"><TrendingUp className="h-3.5 w-3.5" /> Strokes</TabsTrigger>
                <TabsTrigger value="footwork" className="gap-1"><Footprints className="h-3.5 w-3.5" /> Footwork</TabsTrigger>
                <TabsTrigger value="tactics" className="gap-1"><Target className="h-3.5 w-3.5" /> Tactics</TabsTrigger>
              </TabsList>

              <TabsContent value="strokes">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Stroke Analysis <Badge className={scoreColor(result.strokeAnalysis.score)}>{result.strokeAnalysis.score}/100</Badge></CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {result.strokeAnalysis.details.map((d) => (
                      <div key={d.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm"><span className="font-medium">{d.name}</span><span className={scoreColor(d.rating)}>{d.rating}/100</span></div>
                        <Progress value={d.rating} className="h-2" />
                        <p className="text-xs text-muted-foreground">💡 {d.tip}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footwork">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Footprints className="h-5 w-5" /> Footwork Assessment <Badge className={scoreColor(result.footworkAnalysis.score)}>{result.footworkAnalysis.score}/100</Badge></CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {result.footworkAnalysis.details.map((d) => (
                      <div key={d.aspect} className="space-y-1">
                        <div className="flex items-center justify-between text-sm"><span className="font-medium">{d.aspect}</span><span className={scoreColor(d.rating)}>{d.rating}/100</span></div>
                        <Progress value={d.rating} className="h-2" />
                        <p className="text-xs text-muted-foreground">💡 {d.suggestion}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tactics">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Tactical Analysis <Badge className={scoreColor(result.tacticalAnalysis.score)}>{result.tacticalAnalysis.score}/100</Badge></CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {result.tacticalAnalysis.details.map((d) => (
                      <div key={d.area} className="space-y-1">
                        <div className="flex items-center justify-between text-sm"><span className="font-medium">{d.area}</span><span className={scoreColor(d.rating)}>{d.rating}/100</span></div>
                        <Progress value={d.rating} className="h-2" />
                        <p className="text-xs text-muted-foreground">💡 {d.insight}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPhase("upload")}>Analyze Another Video</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
