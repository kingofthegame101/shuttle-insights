// ============ COURTS ============
export const courts = [
  {
    id: 1, name: "SmashZone Arena", location: "Downtown Sports Complex", address: "123 Main St",
    price: 25, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop",
    amenities: ["Parking", "AC", "Pro Lighting", "Showers"], courts: 6, available: true,
  },
  {
    id: 2, name: "Shuttle Court Hub", location: "Westside Recreation", address: "456 Oak Ave",
    price: 18, rating: 4.5, reviews: 89, image: "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=600&h=400&fit=crop",
    amenities: ["Parking", "Pro Lighting"], courts: 4, available: true,
  },
  {
    id: 3, name: "Eagle Badminton Center", location: "East District", address: "789 Pine Rd",
    price: 30, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop",
    amenities: ["Parking", "AC", "Pro Lighting", "Cafe", "Pro Shop"], courts: 8, available: true,
  },
  {
    id: 4, name: "City Sports Hall", location: "Central Park Area", address: "321 Elm St",
    price: 15, rating: 4.2, reviews: 56, image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
    amenities: ["Parking", "Showers"], courts: 3, available: false,
  },
  {
    id: 5, name: "NetPlay Academy", location: "Northside", address: "555 Birch Ln",
    price: 22, rating: 4.6, reviews: 145, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
    amenities: ["AC", "Pro Lighting", "Coaching"], courts: 5, available: true,
  },
  {
    id: 6, name: "Racquet Club Premium", location: "Riverside", address: "777 River Dr",
    price: 35, rating: 4.7, reviews: 178, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    amenities: ["Parking", "AC", "Pro Lighting", "Sauna", "Cafe", "Pro Shop"], courts: 10, available: true,
  },
];

// ============ GROUPS ============
export const groups = [
  {
    id: 1, name: "Sunday Smashers", level: "Intermediate", location: "SmashZone Arena",
    schedule: "Every Sunday, 9 AM - 12 PM", members: 18, maxMembers: 24,
    description: "Friendly weekend group for intermediate players. We focus on doubles play and having fun!",
    image: "🏸",
  },
  {
    id: 2, name: "Pro Rally Club", level: "Advanced", location: "Eagle Badminton Center",
    schedule: "Tue & Thu, 7 PM - 9 PM", members: 12, maxMembers: 16,
    description: "Competitive club for advanced players looking to sharpen their game.",
    image: "🔥",
  },
  {
    id: 3, name: "Beginners Welcome", level: "Beginner", location: "City Sports Hall",
    schedule: "Every Saturday, 10 AM - 12 PM", members: 25, maxMembers: 30,
    description: "Perfect for newcomers! We teach basics and provide equipment.",
    image: "🌟",
  },
  {
    id: 4, name: "Corporate Shuttlers", level: "Mixed", location: "Shuttle Court Hub",
    schedule: "Wed, 6 PM - 8 PM", members: 20, maxMembers: 28,
    description: "After-work badminton for professionals. Great networking opportunity!",
    image: "💼",
  },
  {
    id: 5, name: "Ladies' League", level: "Intermediate", location: "NetPlay Academy",
    schedule: "Mon & Fri, 10 AM - 12 PM", members: 14, maxMembers: 20,
    description: "Women's badminton group with a focus on skill development and friendly competition.",
    image: "👩",
  },
  {
    id: 6, name: "Youth Shuttle Stars", level: "Beginner", location: "SmashZone Arena",
    schedule: "Sat, 2 PM - 4 PM", members: 22, maxMembers: 24,
    description: "For young players aged 10-17. Fun drills, games, and tournaments!",
    image: "⭐",
  },
];

// ============ SERVICES ============
export const services = [
  {
    id: 1, name: "StringMaster Pro", category: "Stringing", rating: 4.9, distance: "0.8 km",
    address: "12 Racquet Lane", phone: "+1 555-0101", hours: "9 AM - 6 PM",
    description: "Expert racquet stringing with 24-hour turnaround. BG65, BG80, Nanogy certified.",
    priceRange: "$8 - $25",
  },
  {
    id: 2, name: "Shuttle Sports Store", category: "Equipment", rating: 4.6, distance: "1.2 km",
    address: "88 Sports Mall", phone: "+1 555-0102", hours: "10 AM - 9 PM",
    description: "Full range of Yonex, Victor, Li-Ning racquets and accessories.",
    priceRange: "$10 - $300",
  },
  {
    id: 3, name: "SportsFix Physio", category: "Physiotherapy", rating: 4.8, distance: "2.1 km",
    address: "45 Health Plaza", phone: "+1 555-0103", hours: "8 AM - 7 PM",
    description: "Specialized in sports injuries. Shoulder, knee, and wrist rehabilitation.",
    priceRange: "$60 - $120/session",
  },
  {
    id: 4, name: "Grip & Grit Shop", category: "Equipment", rating: 4.4, distance: "3.5 km",
    address: "22 Athletic Blvd", phone: "+1 555-0104", hours: "10 AM - 8 PM",
    description: "Affordable badminton gear, shoes, and apparel for all levels.",
    priceRange: "$5 - $200",
  },
  {
    id: 5, name: "QuickString Express", category: "Stringing", rating: 4.7, distance: "1.8 km",
    address: "9 Court Side Rd", phone: "+1 555-0105", hours: "8 AM - 5 PM",
    description: "Same-day stringing service. Walk-in welcome. All string brands available.",
    priceRange: "$10 - $30",
  },
  {
    id: 6, name: "Active Recovery Clinic", category: "Sports Medicine", rating: 4.9, distance: "4.2 km",
    address: "100 Wellness Dr", phone: "+1 555-0106", hours: "7 AM - 8 PM",
    description: "Comprehensive sports medicine clinic with MRI, ultrasound, and rehab services.",
    priceRange: "$80 - $250/session",
  },
];

// ============ COACHES ============
export const coaches = [
  {
    id: 1, name: "Coach Alex Chen", specialization: "Singles & Footwork", experience: "12 years",
    rate: 60, rating: 4.9, reviews: 87, bio: "Former national team player with expertise in singles strategy and footwork training.",
    focus: ["Singles", "Footwork", "Smash"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    availability: "Mon-Fri, 9AM-5PM",
  },
  {
    id: 2, name: "Coach Sarah Kim", specialization: "Doubles Strategy", experience: "8 years",
    rate: 50, rating: 4.8, reviews: 65, bio: "Doubles specialist who has coached regional championship teams.",
    focus: ["Doubles", "Rotation", "Net Play"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    availability: "Tue-Sat, 10AM-6PM",
  },
  {
    id: 3, name: "Coach Mike Torres", specialization: "Youth Development", experience: "15 years",
    rate: 45, rating: 4.7, reviews: 120, bio: "Passionate about developing young talent. BWF Level 2 certified coach.",
    focus: ["Youth", "Basics", "Fun Drills"], image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    availability: "Mon-Sat, 8AM-4PM",
  },
  {
    id: 4, name: "Coach Priya Sharma", specialization: "Technique & Strokes", experience: "10 years",
    rate: 55, rating: 4.9, reviews: 93, bio: "Technical expert focusing on stroke perfection. International coaching license holder.",
    focus: ["Strokes", "Technique", "Drop Shots"], image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    availability: "Wed-Sun, 9AM-7PM",
  },
];

// ============ VIDEO ANALYSIS MOCK RESULTS ============
export const mockAnalysisResult = {
  overallScore: 72,
  strokeAnalysis: {
    score: 75,
    details: [
      { name: "Clear", rating: 80, tip: "Good height on clears. Try to aim deeper to the baseline." },
      { name: "Smash", rating: 65, tip: "Increase wrist snap speed. Jump higher for steeper angles." },
      { name: "Drop Shot", rating: 78, tip: "Nice deception. Vary the pace more to keep opponents guessing." },
      { name: "Net Shot", rating: 70, tip: "Move closer to the net before playing. Keep the shuttle tight." },
    ],
  },
  footworkAnalysis: {
    score: 68,
    details: [
      { aspect: "Split Step", rating: 60, suggestion: "Timing is slightly late. Anticipate the opponent's shot earlier." },
      { aspect: "Recovery", rating: 72, suggestion: "Good base position recovery. Speed up the return to center." },
      { aspect: "Lunging", rating: 70, suggestion: "Extend your non-racquet arm for better balance during lunges." },
      { aspect: "Court Coverage", rating: 68, suggestion: "Rear court coverage needs work. Practice shadow footwork drills." },
    ],
  },
  tacticalAnalysis: {
    score: 74,
    details: [
      { area: "Shot Selection", rating: 76, insight: "Good variation. Consider using more cross-court shots to open up space." },
      { area: "Court Positioning", rating: 70, insight: "Return to center more consistently after each shot." },
      { area: "Serve Strategy", rating: 78, insight: "Low serves are effective. Add flick serves to surprise opponents." },
      { area: "Rally Building", rating: 72, insight: "Good patience in rallies. Try to attack earlier when opportunity arises." },
    ],
  },
  radarData: [
    { subject: "Strokes", value: 75, fullMark: 100 },
    { subject: "Footwork", value: 68, fullMark: 100 },
    { subject: "Tactics", value: 74, fullMark: 100 },
    { subject: "Power", value: 70, fullMark: 100 },
    { subject: "Speed", value: 65, fullMark: 100 },
    { subject: "Consistency", value: 78, fullMark: 100 },
  ],
};

export const analysisHistory = [
  { id: 1, date: "2026-02-10", title: "Singles Practice Match", score: 72, duration: "18:32" },
  { id: 2, date: "2026-02-05", title: "Doubles Tournament Game", score: 68, duration: "24:15" },
  { id: 3, date: "2026-01-28", title: "Training Session - Smash Drills", score: 75, duration: "12:40" },
  { id: 4, date: "2026-01-20", title: "Club Match vs Team B", score: 64, duration: "30:10" },
];

// ============ INFO HUB ============
export const newsArticles = [
  {
    id: 1, title: "BWF World Championships 2026: Draw Released",
    date: "Feb 10, 2026", category: "Tournament",
    excerpt: "The draw for the upcoming BWF World Championships has been released. Top seeds face tough competition in early rounds.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=300&fit=crop",
  },
  {
    id: 2, title: "Viktor Axelsen Announces Comeback",
    date: "Feb 8, 2026", category: "Player News",
    excerpt: "Olympic champion Viktor Axelsen has announced his return to competitive badminton after a brief hiatus.",
    image: "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=600&h=300&fit=crop",
  },
  {
    id: 3, title: "New Yonex Astrox Series Released",
    date: "Feb 5, 2026", category: "Equipment",
    excerpt: "Yonex launches the next generation Astrox series with revolutionary frame technology for more power.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop",
  },
  {
    id: 4, title: "Indonesia Open 2026 Schedule Announced",
    date: "Feb 3, 2026", category: "Tournament",
    excerpt: "One of the most prestigious Super 1000 events returns with an expanded format and record prize money.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=300&fit=crop",
  },
];

export const rankings = [
  { rank: 1, name: "Viktor Axelsen", country: "🇩🇰 Denmark", points: 112450, change: 0 },
  { rank: 2, name: "Kunlavut Vitidsarn", country: "🇹🇭 Thailand", points: 98320, change: 1 },
  { rank: 3, name: "Shi Yu Qi", country: "🇨🇳 China", points: 95100, change: -1 },
  { rank: 4, name: "Anders Antonsen", country: "🇩🇰 Denmark", points: 89750, change: 2 },
  { rank: 5, name: "Jonatan Christie", country: "🇮🇩 Indonesia", points: 86400, change: 0 },
  { rank: 6, name: "Kodai Naraoka", country: "🇯🇵 Japan", points: 84200, change: -2 },
  { rank: 7, name: "Loh Kean Yew", country: "🇸🇬 Singapore", points: 81900, change: 1 },
  { rank: 8, name: "Lee Zii Jia", country: "🇲🇾 Malaysia", points: 79500, change: -1 },
];

export const upcomingEvents = [
  { name: "All England Open 2026", date: "Mar 11-16, 2026", location: "Birmingham, UK", tier: "Super 1000", link: "https://bwfbadminton.com/tournament/4742/yonex-all-england-open-2026" },
  { name: "India Open 2026", date: "Mar 25-30, 2026", location: "New Delhi, India", tier: "Super 750", link: "https://bwfbadminton.com/tournament/4744/yonex-sunrise-india-open-2026" },
  { name: "Malaysia Open 2026", date: "Apr 8-13, 2026", location: "Kuala Lumpur, Malaysia", tier: "Super 1000", link: "https://bwfbadminton.com/tournament/4746/malaysia-open-2026" },
  { name: "Singapore Open 2026", date: "Apr 22-27, 2026", location: "Singapore", tier: "Super 750", link: "https://bwfbadminton.com/tournament/4752/singapore-badminton-open-2026" },
];
