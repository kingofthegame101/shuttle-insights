import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Phone, Clock, DollarSign, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services } from "@/data/mockData";

const categoryIcons: Record<string, string> = {
  Stringing: "🎯", Equipment: "🛒", Physiotherapy: "💆", "Sports Medicine": "🏥",
};

export default function FindServices() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Find Services</h1>
      <p className="mb-6 text-muted-foreground">Stringing, equipment, physio & more near you</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Stringing">Stringing</SelectItem>
            <SelectItem value="Equipment">Equipment</SelectItem>
            <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
            <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((svc, i) => (
          <motion.div key={svc.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryIcons[svc.category] || "📍"}</span>
                  <div>
                    <CardTitle className="text-lg">{svc.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{svc.category}</Badge>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3.5 w-3.5 text-shuttle-gold" /> {svc.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{svc.description}</p>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {svc.address} · {svc.distance}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {svc.hours}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {svc.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="h-3.5 w-3.5" /> {svc.priceRange}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
