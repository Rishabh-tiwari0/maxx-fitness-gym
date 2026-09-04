/**
 * @typedef {Object} NavLink
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} TrainingProgram
 * @property {string} id
 * @property {string} title
 * @property {string} category - Short tag shown on the card, e.g. "POWER"
 * @property {"muted"|"accent"} tagVariant - Visual weight of the category tag
 * @property {string} imageSeed - Seed passed to the placeholder image service
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} SocialLink
 * @property {string} label
 * @property {string} href
 * @property {"facebook"|"instagram"|"twitter"} icon
 */

export const brand = {
  name: "The Max Fitness Gym",
  shortName: "Max Fitness",
  phone: "+91 8177077776",
};

export const siteNav = /** @type {NavLink[]} */ ([
  { label: "Programs", href: "#programs" },
  { label: "Body Metrics", href: "#body-metrics" },
  { label: "Location", href: "#location" },
]);

export const hero = {
  eyebrow: "Ganesh Pur's Premier Strength Facility",
  title: "TRAIN TO YOUR MAX",
  subtitle:
    "Push past plateaus with expert coaching, premium equipment, and a community that shows up for every session.",
  ctaLabel: "GET STARTED",
  ctaHref: "#programs",
  imageSeed: "maxx-fitness-hero",
};

export const trainingPrograms = /** @type {TrainingProgram[]} */ ([
  {
    id: "olympic-lifting",
    title: "Olympic Lifting",
    category: "POWER",
    tagVariant: "muted",
    imageSeed: "maxx-olympic-lifting",
    imageAlt: "Athlete performing an overhead barbell lift in the gym",
  },
  {
    id: "cardio-conditioning",
    title: "Cardio Conditioning",
    category: "ENDURANCE",
    tagVariant: "accent",
    imageSeed: "maxx-cardio-conditioning",
    imageAlt: "Member on a stationary bike during a conditioning class",
  },
  {
    id: "reformer-pilates",
    title: "Reformer Pilates",
    category: "MOBILITY",
    tagVariant: "muted",
    imageSeed: "maxx-reformer-pilates",
    imageAlt: "Member stretching on a Pilates reformer machine",
  },
  {
    id: "kickboxing-drills",
    title: "Kickboxing Drills",
    category: "EXPLOSIVE",
    tagVariant: "accent",
    imageSeed: "maxx-kickboxing-drills",
    imageAlt: "Member throwing a kick at a heavy bag",
  },
]);

export const bodyMetrics = {
  title: "BODY METRICS",
  description: "Enter your height and weight to check your BMI.",
};

export const location = {
  title: "LOCATION",
  city: "Kanpur, Uttar Pradesh",
  descriptionLabel:
    "25b, Ganeshpur Mod, Sanigawan Rd, Daheli Sujanpur, Kanpur 208021",
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
