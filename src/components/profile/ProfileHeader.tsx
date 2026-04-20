import { Avatar } from "@/components/ui/Avatar";
import type { Profile } from "@/types/database";

const PB_DISTANCE_LABELS: Record<number, string> = {
  5000: "5K",
  10000: "10K",
  21097: "Half Marathon",
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
}

export function ProfileHeader({
  profile,
  runCount,
  joinedCount,
  crewSize,
  badge,
}: ProfileHeaderProps) {
  const pbDistanceLabel = profile.pace_max ? PB_DISTANCE_LABELS[profile.pace_max] : null;
  const pbTime = profile.pace_min ? formatPbTime(profile.pace_min) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with orange ring */}
      <div className="rounded-full p-[3px] bg-gradient-to-br from-kith-orange to-kith-orange/60">
        <div className="rounded-full p-[2px] bg-white">
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

      {/* PB badge */}
      {pbDistanceLabel && pbTime && (
        <span className="inline-flex items-center gap-1.5 bg-kith-surface text-kith-text font-body font-medium text-sm px-4 py-1.5 rounded-pill">
          <span className="font-display font-bold">{pbTime}</span>
          <span className="text-kith-muted">{pbDistanceLabel}</span>
        </span>
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
