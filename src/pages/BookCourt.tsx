import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, DollarSign, Check, CalendarDays } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { courts } from "@/data/mockData";
import { toast } from "sonner";

export default function BookCourt() {
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [bookingCourt, setBookingCourt] = useState<typeof courts[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  const filtered = courts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchPrice = priceFilter === "all" || (priceFilter === "low" && c.price <= 20) || (priceFilter === "mid" && c.price > 20 && c.price <= 30) || (priceFilter === "high" && c.price > 30);
    return matchSearch && matchPrice;
  });

  const handleBook = () => {
    setBooked(true);
    toast.success("Court booked successfully!");
  };

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Book a Court</h1>
      <p className="mb-6 text-muted-foreground">Find and reserve badminton courts near you</p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Input placeholder="Search courts..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Price" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Under $20</SelectItem>
            <SelectItem value="mid">$20 - $30</SelectItem>
            <SelectItem value="high">Over $30</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((court, i) => (
          <motion.div key={court.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img src={court.image} alt={court.name} className="h-full w-full object-cover" />
                {!court.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                    <Badge variant="destructive">Fully Booked</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{court.name}</CardTitle>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {court.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 pb-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-shuttle-gold" /> {court.rating}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${court.price}/hr</span>
                  <span className="text-muted-foreground">{court.courts} courts</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {court.amenities.map((a) => <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>)}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!court.available} onClick={() => { setBookingCourt(court); setBooked(false); setSelectedTime(""); }}>
                  {court.available ? "Book Now" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!bookingCourt} onOpenChange={() => setBookingCourt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{booked ? "Booking Confirmed! ✅" : `Book ${bookingCourt?.name}`}</DialogTitle>
            <DialogDescription>{booked ? "Your court has been reserved." : "Select your preferred time slot"}</DialogDescription>
          </DialogHeader>
          {!booked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Today
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "5:00 PM"].map((t) => (
                  <Button key={t} variant={selectedTime === t ? "default" : "outline"} size="sm" onClick={() => setSelectedTime(t)}>{t}</Button>
                ))}
              </div>
              <Button className="w-full" disabled={!selectedTime} onClick={handleBook}>
                <Check className="mr-2 h-4 w-4" /> Confirm Booking — ${bookingCourt?.price}/hr
              </Button>
            </div>
          ) : (
            <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
              <p><strong>Court:</strong> {bookingCourt?.name}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Price:</strong> ${bookingCourt?.price}</p>
              <p><strong>Address:</strong> {bookingCourt?.address}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
