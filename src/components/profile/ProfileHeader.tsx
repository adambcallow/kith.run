import { Avatar } from "@/components/ui/Avatar";
import type { Profile, PersonalBest } from "@/types/database";

const PB_DISTANCE_LABELS: Record<string, string> = {
  "5k": "5K",
  "10k": "10K",
  half: "Half",
  marathon: "Marathon",
};

const LEGACY_DISTANCE_LABELS: Record<number, string> = {
  5000: "5K",
  10000: "10K",
  21097: "Half",
  42195: "Marathon",
};

function formatPbTime(totalSeconds: number): string {
  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ProfileHeaderProps {
  profile: Profile;
  runCount: number;
  joinedCount: number;
  crewSize: number;
  badge?: React.ReactNode;
  clubs?: { id: string; name: string; logo_url: string | null }[];
}

export function ProfileHeader({
  profile,
  runCount,
  joinedCount,
  crewSize,
  badge,
  clubs,
}: ProfileHeaderProps) {
  // Build list of PBs to display: prefer personal_bests jsonb, fall back to old fields
  const pbs: { label: string; time: string }[] = [];
  const personalBests = (profile.personal_bests as PersonalBest[] | null) ?? [];

  if (personalBests.length > 0) {
    for (const pb of personalBests) {
      const label = PB_DISTANCE_LABELS[pb.distance] ?? pb.distance;
      pbs.push({ label, time: formatPbTime(pb.seconds) });
    }
  } else if (profile.pace_min && profile.pace_max) {
    const label = LEGACY_DISTANCE_LABELS[profile.pace_max];
    if (label) {
      pbs.push({ label, time: formatPbTime(profile.pace_min) });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with orange ring */}
      <div className="rounded-full p-[3px]" style={{ background: "conic-gradient(from 45deg, #F95E2E, #FF8F6B, #F95E2E)" }}>
        <div className="rounded-full p-[2.5px] bg-white">
          <Avatar
            src={profile.avatar_url}
            username={profile.username}
            fullName={profile.full_name}
            size="xl"
          />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display font-bold text-xl text-kith-text">
            {profile.full_name ?? profile.username}
          </h1>
          {badge}
        </div>
        <p className="font-body text-sm text-kith-muted">
          @{profile.username}
        </p>
      </div>

      {/* PB badges */}
      {pbs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {pbs.map((pb) => (
            <span
              key={pb.label}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-kith-orange/10 to-kith-orange/5 text-kith-text font-body font-medium text-sm px-4 py-1.5 rounded-pill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-kith-orange"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-display font-bold">{pb.time}</span>
              <span className="text-kith-muted">{pb.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* Strava link */}
      {profile.strava_id && (
        <a
          href={profile.strava_id}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-[#FC4C02]/10 hover:bg-[#FC4C02]/15 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#FC4C02" />
            <path d="M10.233 13.828L7.2 7.757 4.168 13.828H7.2l3.033 0zM7.2 0L0 14.396h4.168L7.2 7.757l3.033 6.639h4.168L7.2 0z" fill="#FC4C02" />
          </svg>
          <span className="font-body text-xs font-medium text-[#FC4C02]">Follow on Strava</span>
        </a>
      )}

      {profile.bio && (
        <p className="font-body text-sm text-kith-text text-center max-w-[320px] leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Run clubs */}
      {clubs && clubs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
          {clubs.map((club) => (
            <span
              key={club.id}
              className="bg-kith-surface border border-kith-gray-light/50 px-3 py-1.5 flex items-center gap-1.5 rounded-pill shrink-0"
            >
              {club.logo_url ? (
                <img
                  src={club.logo_url}
                  alt={club.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-kith-orange/20 text-kith-orange flex items-center justify-center text-[10px] font-bold leading-none">
                  {club.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-xs font-body font-medium text-kith-text whitespace-nowrap">
                {club.name}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Stats container */}
      <div className="w-full max-w-[320px] bg-kith-surface rounded-card p-4">
        <div className="flex items-center justify-evenly">
          <div className="text-center">
            <p className="font-display font-bold text-xl text-kith-text">
              {runCount}
            </p>
            <p className="font-body text-xs text-kith-muted mt-0.5">Posted</p>
          </div>
          <div className="w-px h-8 bg-kith-muted/20" />
          <div className="text-center">
            <p className="font-display font-bold text-xl text-kith-text">
              {joinedCount}
            </p>
            <p className="font-body text-xs text-kith-muted mt-0.5">Joined</p>
          </div>
          <div className="w-px h-8 bg-kith-muted/20" />
          <div className="text-center">
            <p className="font-display font-bold text-xl text-kith-text">
              {crewSize}
            </p>
            <p className="font-body text-xs text-kith-muted mt-0.5">Crew</p>
          </div>
        </div>
      </div>
    </div>
  );
}
