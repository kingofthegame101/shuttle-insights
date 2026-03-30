import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, Wrench, GraduationCap, Video, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { path: "/book-court", label: "Book a Court", icon: MapPin, desc: "Reserve badminton courts near you", color: "bg-primary/10 text-primary" },
  { path: "/find-group", label: "Find a Group", icon: Users, desc: "Join groups & make rally partners", color: "bg-shuttle-blue/10 text-shuttle-blue" },
  { path: "/find-services", label: "Find Services", icon: Wrench, desc: "Stringing, gear shops & physio", color: "bg-shuttle-teal/10 text-shuttle-teal" },
  { path: "/find-coach", label: "Find a Coach", icon: GraduationCap, desc: "Level up with expert coaching", color: "bg-shuttle-orange/10 text-shuttle-orange" },
  { path: "/video-analysis", label: "Video Analysis", icon: Video, desc: "AI-powered technique feedback", color: "bg-destructive/10 text-destructive" },
  { path: "/info-hub", label: "Info Hub", icon: Newspaper, desc: "News, rankings & tournaments", color: "bg-shuttle-gold/10 text-shuttle-gold" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-shuttle-teal/5 py-20 md:py-32">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-4 inline-block text-6xl">🏸</span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Shuttle Buddy
              <span className="block text-primary">Hub</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Your all-in-one badminton platform — book courts, find players, get coaching, and analyze your game.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/book-court">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/video-analysis">
                <Button size="lg" variant="outline" className="gap-2">
                  <Video className="h-4 w-4" /> Try Video Analysis
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="container py-16">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">Everything You Need</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.path} variants={item}>
              <Link to={f.path}>
                <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                      <f.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold">{f.label}</p>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
