import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { groups } from "@/data/mockData";
import { toast } from "sonner";

const levelColors: Record<string, string> = {
  Beginner: "bg-shuttle-green/10 text-shuttle-green border-shuttle-green/20",
  Intermediate: "bg-shuttle-blue/10 text-shuttle-blue border-shuttle-blue/20",
  Advanced: "bg-shuttle-orange/10 text-shuttle-orange border-shuttle-orange/20",
  Mixed: "bg-shuttle-gold/10 text-shuttle-gold border-shuttle-gold/20",
};

export default function FindGroup() {
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = groups.filter((g) => levelFilter === "all" || g.level === levelFilter);

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Find a Group</h1>
      <p className="mb-6 text-muted-foreground">Join badminton groups and meet new rally partners</p>

      <div className="mb-6 flex gap-3">
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-48"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Skill Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((group, i) => (
          <motion.div key={group.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{group.image}</span>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="outline" className={levelColors[group.level]}>{group.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                <p className="text-sm text-muted-foreground">{group.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {group.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {group.schedule}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {group.members}/{group.maxMembers} members</span>
                    <span>{Math.round((group.members / group.maxMembers) * 100)}%</span>
                  </div>
                  <Progress value={(group.members / group.maxMembers) * 100} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={group.members >= group.maxMembers ? "secondary" : "default"}
                  disabled={group.members >= group.maxMembers}
                  onClick={() => toast.success(`Joined ${group.name}!`)}>
                  {group.members >= group.maxMembers ? "Full" : "Join Group"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
