// Badge definitions and computation logic for KITH
// These celebrate showing up, being social, and building your crew — not performance.

export type BadgeCategory = "showing-up" | "social" | "joining-in" | "vibes";

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: BadgeCategory;
  /** The stat key this badge tracks progress against */
  statKey: keyof UserBadgeStats;
  /** Number needed to unlock (for boolean stats, 1 = truthy) */
  threshold: number;
  /** Check if the badge is earned given user stats */
  check: (stats: UserBadgeStats) => boolean;
}

export interface UserBadgeStats {
  runsCreated: number;
  runsJoined: number;
  crewSize: number;
  reactionsGiven: number;
  hasGoneLive: boolean;
  maxParticipantsOnRun: number;
}

/** Get the current numeric progress value for a badge */
export function getBadgeProgress(badge: Badge, stats: UserBadgeStats): number {
  const val = stats[badge.statKey];
  if (typeof val === "boolean") return val ? 1 : 0;
  return val;
}

// ---------------------------------------------------------------------------
// Badge definitions
// ---------------------------------------------------------------------------

export const ALL_BADGES: Badge[] = [
  // SHOWING UP
  {
    id: "first-steps",
    name: "First Steps",
    emoji: "\u{1F45F}",
    description: "Posted your first run",
    category: "showing-up",
    statKey: "runsCreated",
    threshold: 1,
    check: (s) => s.runsCreated >= 1,
  },
  {
    id: "regular",
    name: "Regular",
    emoji: "\u{1F525}",
    description: "Posted 10+ runs",
    category: "showing-up",
    statKey: "runsCreated",
    threshold: 10,
    check: (s) => s.runsCreated >= 10,
  },
  {
    id: "centurion",
    name: "Centurion",
    emoji: "\u{1F3C6}",
    description: "Posted 100+ runs",
    category: "showing-up",
    statKey: "runsCreated",
    threshold: 100,
    check: (s) => s.runsCreated >= 100,
  },

  // SOCIAL
  {
    id: "crew-up",
    name: "Crew Up",
    emoji: "\u{1F91D}",
    description: "Added your first crew member",
    category: "social",
    statKey: "crewSize",
    threshold: 1,
    check: (s) => s.crewSize >= 1,
  },
  {
    id: "squad",
    name: "Squad",
    emoji: "\u{1F46F}",
    description: "5+ crew members",
    category: "social",
    statKey: "crewSize",
    threshold: 5,
    check: (s) => s.crewSize >= 5,
  },
  {
    id: "inner-circle",
    name: "Inner Circle",
    emoji: "\u{1F48E}",
    description: "20+ crew members",
    category: "social",
    statKey: "crewSize",
    threshold: 20,
    check: (s) => s.crewSize >= 20,
  },

  // JOINING IN
  {
    id: "team-player",
    name: "Team Player",
    emoji: "\u{270B}",
    description: "Joined someone else's run",
    category: "joining-in",
    statKey: "runsJoined",
    threshold: 1,
    check: (s) => s.runsJoined >= 1,
  },
  {
    id: "ride-or-die",
    name: "Ride or Die",
    emoji: "\u{26A1}",
    description: "Joined 25+ runs",
    category: "joining-in",
    statKey: "runsJoined",
    threshold: 25,
    check: (s) => s.runsJoined >= 25,
  },
  {
    id: "always-there",
    name: "Always There",
    emoji: "\u{1F31F}",
    description: "Joined 50+ runs",
    category: "joining-in",
    statKey: "runsJoined",
    threshold: 50,
    check: (s) => s.runsJoined >= 50,
  },

  // VIBES
  {
    id: "hype-machine",
    name: "Hype Machine",
    emoji: "\u{1F389}",
    description: "Left 10+ reactions on runs",
    category: "vibes",
    statKey: "reactionsGiven",
    threshold: 10,
    check: (s) => s.reactionsGiven >= 10,
  },
  {
    id: "going-live",
    name: "Going Live",
    emoji: "\u{1F4E1}",
    description: "Posted a \"going now\" live run",
    category: "vibes",
    statKey: "hasGoneLive",
    threshold: 1,
    check: (s) => s.hasGoneLive,
  },
  {
    id: "the-magnet",
    name: "The Magnet",
    emoji: "\u{1F9F2}",
    description: "Had 5+ people join one of your runs",
    category: "vibes",
    statKey: "maxParticipantsOnRun",
    threshold: 5,
    check: (s) => s.maxParticipantsOnRun >= 5,
  },
];

/**
 * Given a user's stats, return the list of badges they have earned.
 */
export function computeBadges(stats: UserBadgeStats): Badge[] {
  return ALL_BADGES.filter((badge) => badge.check(stats));
}
