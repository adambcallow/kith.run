import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatPaceRange } from "@/lib/utils";
import Link from "next/link";
import type { Profile } from "@/types/database";
import { FriendRequestActions } from "./FriendRequestActions";
import { RemoveCrewButton } from "./RemoveCrewButton";
import { CancelRequestButton } from "./CancelRequestButton";
import { InviteCard } from "./InviteCard";
import { UserSearch } from "./UserSearch";

export default async function CrewPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: friendships } = await supabase
    .from("friendships")
    .select("*, user_a_profile:profiles!user_a(*), user_b_profile:profiles!user_b(*)")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const accepted = (friendships ?? []).filter((f) => f.status === "accepted");
  const pendingIncoming = (friendships ?? []).filter(
    (f) => f.status === "pending" && f.user_b === user.id
  );
  const pendingOutgoing = (friendships ?? []).filter(
    (f) => f.status === "pending" && f.user_a === user.id
  );

  function getFriendProfile(f: Record<string, unknown>): Profile {
    return (f.user_a === user!.id ? f.user_b_profile : f.user_a_profile) as Profile;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Your crew
      </h1>

      {/* Search */}
      <UserSearch currentUserId={user.id} />

      {/* Invite */}
      <InviteCard userId={user.id} />

      {/* Pending requests */}
      {pendingIncoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Requests ({pendingIncoming.length})
          </h2>
          {pendingIncoming.map((f) => {
            const profile = getFriendProfile(f as unknown as Record<string, unknown>);
            return (
              <div
                key={f.id}
                className="bg-white rounded-card p-4 flex items-center gap-3 border border-kith-gray-light shadow-card"
              >
                <Link href={`/profile/${profile.username}`}>
                  <Avatar
                    src={profile.avatar_url}
                    username={profile.username}
                    fullName={profile.full_name}
                    size="md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-kith-text truncate">
                    {profile.full_name ?? profile.username}
                  </p>
                  <p className="font-body text-xs text-kith-muted">
                    @{profile.username}
                  </p>
                </div>
                <FriendRequestActions friendshipId={f.id} />
              </div>
            );
          })}
        </div>
      )}

      {/* Sent requests */}
      {pendingOutgoing.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Sent requests ({pendingOutgoing.length})
          </h2>
          {pendingOutgoing.map((f) => {
            const profile = getFriendProfile(f as unknown as Record<string, unknown>);
            return (
              <div
                key={f.id}
                className="bg-white rounded-card p-4 flex items-center gap-3 border border-kith-gray-light shadow-card"
              >
                <Link href={`/profile/${profile.username}`}>
                  <Avatar
                    src={profile.avatar_url}
                    username={profile.username}
                    fullName={profile.full_name}
                    size="md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-kith-text truncate">
                    {profile.full_name ?? profile.username}
                  </p>
                  <p className="font-body text-xs text-kith-muted">
                    @{profile.username}
                  </p>
                </div>
                <span className="text-xs font-body text-kith-muted bg-kith-surface px-2 py-0.5 rounded-full">
                  Pending
                </span>
                <CancelRequestButton friendshipId={f.id} />
              </div>
            );
          })}
        </div>
      )}

      {/* Crew list */}
      <div className="space-y-3">
        <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
          My crew ({accepted.length})
        </h2>
        {accepted.length === 0 ? (
          <div className="bg-kith-surface rounded-card p-8 text-center flex flex-col items-center">
            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" className="mb-3 text-kith-muted/60">
              <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="44" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M34 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 20h8" stroke="#F95E2E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
            </svg>
            <p className="font-body text-sm text-kith-muted mb-1">
              No crew yet.
            </p>
            <p className="font-body text-xs text-kith-muted">
              Share your invite link to find running partners.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accepted.map((f) => {
              const profile = getFriendProfile(f as unknown as Record<string, unknown>);
              return (
                <div
                  key={f.id}
                  className="bg-white rounded-card p-4 flex items-center gap-3 border border-kith-gray-light shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <Link href={`/profile/${profile.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                      src={profile.avatar_url}
                      username={profile.username}
                      fullName={profile.full_name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-kith-text truncate">
                        {profile.full_name ?? profile.username}
                      </p>
                      <p className="font-body text-xs text-kith-muted">
                        @{profile.username}
                      </p>
                    </div>
                  </Link>
                  {(profile.pace_min || profile.pace_max) && (
                    <Badge variant="pace">
                      {formatPaceRange(profile.pace_min, profile.pace_max)}
                    </Badge>
                  )}
                  <RemoveCrewButton friendshipId={f.id} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
