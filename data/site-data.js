/**
 * @typedef {Object} NavLink
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} TrainingProgram
 * @property {string} id
 * @property {string} title
 * @property {string} category - e.g. "STRENGTH", "ENDURANCE", "COMBAT", "MOBILITY"
 * @property {"muted"|"accent"} tagVariant
 * @property {string} description
 * @property {string} intensity
 * @property {string} duration
 * @property {string} imageUrl
 * @property {string} imageAlt
 * @property {string} youtubeId - YouTube video ID for demo
 * @property {string[]} highlights
 */

/**
 * @typedef {Object} PricingPlan
 * @property {string} id
 * @property {string} name
 * @property {string} price
 * @property {string} period
 * @property {string} description
 * @property {boolean} popular
 * @property {string[]} features
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} name
 * @property {string} role
 * @property {string} quote
 * @property {number} rating
 * @property {string} tag
 */

export const brand = {
  name: "The Max Fitness Gym",
  shortName: "Max Fitness",
  phone: "+91 8177077776",
  whatsappNumber: "918177077776",
  tagline: "Train To Your Max",
};

export const siteNav = /** @type {NavLink[]} */ ([
  { label: "Programs", href: "#programs" },
  { label: "Why Max", href: "#features" },
  { label: "Plans", href: "#plans" },
  { label: "Body Metrics", href: "#body-metrics" },
  { label: "Location", href: "#location" },
]);

export const hero = {
  badge: "Kanpur's Premier Strength Facility",
  title: "TRAIN TO YOUR MAX",
  subtitle:
    "Push past your limits with Olympic-grade equipment, certified coaches, high-energy community, and science-backed training programs.",
  primaryCtaLabel: "EXPLORE PROGRAMS",
  primaryCtaHref: "#programs",
  secondaryCtaLabel: "CHAT ON WHATSAPP",
  stats: [
    { value: "500+", label: "Active Members" },
    { value: "15+", label: "Pro Trainers" },
    { value: "25+", label: "Weekly Batches" },
    { value: "4.9★", label: "Kanpur Rating" },
  ],
};

export const gymFeatures = [
  {
    id: "olympic-equipment",
    icon: "Dumbbell",
    title: "Olympic Grade Equipment",
    description:
      "Eleiko-style barbells, calibrated bumper plates, multi-grip power cages, and commercial dumbbell racks up to 50kg.",
  },
  {
    id: "cardio-deck",
    icon: "Zap",
    title: "High-Octane Cardio Deck",
    description:
      "Commercial curved treadmills, Concept2 rowers, assault bikes, and stairmasters configured for metabolic conditioning.",
  },
  {
    id: "combat-zone",
    icon: "ShieldAlert",
    title: "Combat & Heavy Bag Arena",
    description:
      "Dedicated martial arts zone with teardrop heavy bags, kick shields, speedballs, and boxing conditioning drills.",
  },
  {
    id: "expert-coaching",
    icon: "Users",
    title: "Floor Trainers & Form Correction",
    description:
      "Certified trainers actively assist with progressive overload, lifting safety, posture alignment, and nutritional advice.",
  },
];

export const trainingPrograms = /** @type {TrainingProgram[]} */ ([
  {
    id: "olympic-lifting",
    title: "Olympic Lifting & Power",
    category: "STRENGTH",
    tagVariant: "accent",
    description:
      "Master the snatch, clean & jerk, heavy squats, and deadlifts under certified strength coach supervision.",
    intensity: "High Intensity",
    duration: "60 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Athlete preparing for a heavy barbell lift in the gym",
    youtubeId: "F325nQvQZ1E",
    highlights: [
      "Barbell technique & explosive triple extension",
      "Power racks, calibrated plates & chalk stations",
      "Progressive overload programming",
    ],
  },
  {
    id: "cardio-conditioning",
    title: "Cardio Conditioning & HIIT",
    category: "ENDURANCE",
    tagVariant: "muted",
    description:
      "Torch fat and amplify VO2 max with high-intensity interval training, assault bikes, and rowing intervals.",
    intensity: "Maximum Heart Rate",
    duration: "45 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Member engaged in high intensity battle ropes workout",
    youtubeId: "ucoAkSZEYo4",
    highlights: [
      "Metabolic conditioning circuits",
      "Assault bikes & Concept2 rowers",
      "Rapid calorie burn & cardiovascular stamina",
    ],
  },
  {
    id: "kickboxing-drills",
    title: "Combat Kickboxing & Drills",
    category: "COMBAT",
    tagVariant: "accent",
    description:
      "Develop explosive striking power, agile footwork, and a rock-hard core with heavy bag combinations.",
    intensity: "Explosive & Fast",
    duration: "50 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Boxer striking a heavy bag with wraps",
    youtubeId: "L68aZ_Nv8PE",
    highlights: [
      "Punch-kick combinations & pad work",
      "Hand-eye coordination & agility footwork",
      "High-energy stress release & endurance",
    ],
  },
  {
    id: "functional-cross-training",
    title: "Functional Athletic Turf",
    category: "ATHLETIC",
    tagVariant: "muted",
    description:
      "Build real-world athleticism with heavy sled pushes, tire flips, kettlebell swings, and plyometric boxes.",
    intensity: "High Intensity",
    duration: "50 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Athletes doing functional turf training with kettlebells",
    youtubeId: "8455KPR5568",
    highlights: [
      "Indoor turf with sprint & prowler sled track",
      "Kettlebell & slam ball functional circuits",
      "Core stability & athletic durability",
    ],
  },
  {
    id: "reformer-pilates",
    title: "Pilates, Core & Mobility",
    category: "MOBILITY",
    tagVariant: "muted",
    description:
      "Deep core recruitment, joint decompression, hip opening, and dynamic flexibility to prevent injury.",
    intensity: "Low Impact / Deep Burn",
    duration: "45 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Pilates and mobility stretching in a serene studio",
    youtubeId: "h0H7J85Gz3A",
    highlights: [
      "Pelvic floor & abdominal core integration",
      "Postural realignment & spine health",
      "Dynamic recovery between heavy lifting days",
    ],
  },
  {
    id: "muscle-hypertrophy",
    title: "Bodybuilding & Hypertrophy",
    category: "STRENGTH",
    tagVariant: "accent",
    description:
      "Sculpt every muscle group with isolated dumbbell presses, cables, pin-loaded machines, and pump supersets.",
    intensity: "Hypertrophy Focus",
    duration: "60 mins",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Bodybuilder performing dumbbell curls in front of gym mirror",
    youtubeId: "9g0H3t72t5M",
    highlights: [
      "Full range of commercial selectorized machines",
      "Dumbbells from 2.5kg up to 50kg pairs",
      "Muscle pump & physique symmetry focus",
    ],
  },
]);

export const pricingPlans = /** @type {PricingPlan[]} */ ([
  {
    id: "monthly",
    name: "Monthly Starter",
    price: "800",
    period: "/ month",
    description:
      "Ideal for beginners starting their fitness journey with zero long-term commitment.",
    popular: false,
    features: [
      "Full access to gym floor & free weights",
      "Standard cardio & turf access",
      "Locker & shower facilities",
      "Basic orientation & machine guidance",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Pro",
    price: "2,200",
    period: "/ 3 months",
    description:
      "Our most popular membership for consistent transformation and visible results.",
    popular: true,
    features: [
      "Full gym & all equipment access",
      "Free initial body composition analysis",
      "Combat bag & functional turf access",
      "Personal workout plan roadmap",
      "Priority trainer floor guidance",
    ],
  },
  {
    id: "half-yearly",
    name: "Half-Yearly Elite",
    price: "4,000",
    period: "/ 6 months",
    description:
      "Built for dedicated athletes aiming for significant strength gains and habit mastery.",
    popular: false,
    features: [
      "Unlimited gym floor access 7 days/week",
      "Bi-weekly body composition tracking",
      "Nutrition & diet guideline counseling",
      "Guest passes (2 per cycle)",
      "Free Maxx Fitness shaker / merchandise",
    ],
  },
  {
    id: "annual",
    name: "Annual Champion",
    price: "7,500",
    period: "/ year",
    description:
      "The ultimate value for year-round fitness enthusiasts. Maximum savings and perks.",
    popular: false,
    features: [
      "Complete 365-day all-inclusive access",
      "1-on-1 personal trainer intro sessions",
      "Comprehensive nutrition & macro planning",
      "Unlimited body composition checkups",
      "Complimentary membership freeze (up to 30 days)",
      "VIP locker priority",
    ],
  },
]);

export const testimonials = /** @type {Testimonial[]} */ ([
  {
    name: "Piyush Verma",
    role: "Member for 1 Year",
    quote:
      "Best gym in Daheli Sujanpur! The trainers genuinely correct your form and the Olympic weights are top-notch. Down 14 kgs and feeling stronger than ever.",
    rating: 5,
    tag: "Weight Loss & Strength",
  },
  {
    name: "Aman Gupta",
    role: "Member for 8 Months",
    quote:
      "The environment is unmatched. No crowded waiting for machines, clean air-conditioned floor, and the combat bag zone is pure therapy after work.",
    rating: 5,
    tag: "Bodybuilding & Muscle",
  },
  {
    name: "Roshni Singh",
    role: "Member for 6 Months",
    quote:
      "As a beginner, I was nervous about gym intimidation, but the coaches at Max Fitness made me feel confident from day one. Great community!",
    rating: 5,
    tag: "Fitness & Endurance",
  },
]);

export const bodyMetrics = {
  title: "BODY METRICS",
  description:
    "Calculate your Body Mass Index (BMI) and discover the ideal workout program for your goal.",
};

export const location = {
  title: "OUR FACILITY LOCATION",
  city: "Kanpur, Uttar Pradesh",
  descriptionLabel:
    "25b, Ganeshpur Mod, Sanigawan Rd, Daheli Sujanpur, Kanpur 208021",
  hours: [
    { days: "Mon – Sat (Morning)", time: "5:00 AM – 1:30 PM" },
    { days: "Mon – Sat (Evening)", time: "5:00 PM – 11:00 PM" },
    { days: "Sunday", time: "Closed (Rest Day)" },
  ],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Max+fitness+gym&query_place_id=0x399c41cfc0957ddb:0xf635a784e58b25c1",
  embedMapUrl:
    "https://www.google.com/maps?q=26.3858736,80.3757707&z=17&output=embed",
  imageSeed: "maxx-fitness-location",
  imageAlt: "Maxx Fitness Gym storefront lit up in the evening",
};

export const footer = {
  tagline: "Built for those who show up.",
  socialLinks: /** @type {SocialLink[]} */ ([
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  ]),
  contactHref: "#location",
};
