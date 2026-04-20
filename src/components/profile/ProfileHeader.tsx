import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatPaceRange } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface ProfileHeaderProps {
  profile: Profile;
  runCount: number;
  joinedCount: number;
  crewSize: number;
}

export function ProfileHeader({
  profile,
  runCount,
  joinedCount,
  crewSize,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar
        src={profile.avatar_url}
        username={profile.username}
        fullName={profile.full_name}
        size="xl"
      />
      <div className="text-center space-y-1">
        <h1 className="font-display font-bold text-xl text-kith-text">
          {profile.full_name ?? profile.username}
        </h1>
        <p className="font-body text-sm text-kith-muted">
          @{profile.username} &middot; {profile.city}
        </p>
      </div>

      {(profile.pace_min || profile.pace_max) && (
        <Badge variant="pace">
          {formatPaceRange(profile.pace_min, profile.pace_max)}
        </Badge>
      )}

      {profile.bio && (
        <p className="font-body text-sm text-kith-text text-center max-w-[320px]">
          {profile.bio}
        </p>
      )}

      <div className="flex items-center gap-6 pt-2">
        <div className="text-center">
          <p className="font-display font-bold text-lg text-kith-text">
            {runCount}
          </p>
          <p className="font-body text-xs text-kith-muted">Posted</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-kith-text">
            {joinedCount}
          </p>
          <p className="font-body text-xs text-kith-muted">Joined</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-kith-text">
            {crewSize}
          </p>
          <p className="font-body text-xs text-kith-muted">Crew</p>
        </div>
      </div>
    </div>
  );
}
