import { useState } from "react";
import { motion } from "framer-motion";
import { Star, DollarSign, Clock, Award, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { coaches } from "@/data/mockData";
import { toast } from "sonner";

export default function FindCoach() {
  const [bookingCoach, setBookingCoach] = useState<typeof coaches[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  return (
    <div className="container py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">Find a Coach</h1>
      <p className="mb-6 text-muted-foreground">Level up your game with expert coaching</p>

      <div className="grid gap-5 sm:grid-cols-2">
        {coaches.map((coach, i) => (
          <motion.div key={coach.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={coach.image} alt={coach.name} />
                    <AvatarFallback>{coach.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{coach.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{coach.specialization}</p>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-shuttle-gold" /> {coach.rating}</span>
                      <span className="text-muted-foreground">({coach.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                <p className="text-sm text-muted-foreground">{coach.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {coach.focus.map((f) => <Badge key={f} variant="secondary">{f}</Badge>)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {coach.experience}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${coach.rate}/hr</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {coach.availability}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => { setBookingCoach(coach); setBooked(false); setSelectedTime(""); }}>Book a Session</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!bookingCoach} onOpenChange={() => setBookingCoach(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{booked ? "Session Booked! ✅" : `Book with ${bookingCoach?.name}`}</DialogTitle>
            <DialogDescription>{booked ? "Your coaching session is confirmed." : "Pick a time slot"}</DialogDescription>
          </DialogHeader>
          {!booked ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                  <Button key={t} variant={selectedTime === t ? "default" : "outline"} size="sm" onClick={() => setSelectedTime(t)}>{t}</Button>
                ))}
              </div>
              <Button className="w-full" disabled={!selectedTime} onClick={() => { setBooked(true); toast.success("Session booked!"); }}>
                <Check className="mr-2 h-4 w-4" /> Confirm — ${bookingCoach?.rate}/hr
              </Button>
            </div>
          ) : (
            <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
              <p><strong>Coach:</strong> {bookingCoach?.name}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Rate:</strong> ${bookingCoach?.rate}/hr</p>
              <p><strong>Focus:</strong> {bookingCoach?.specialization}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
