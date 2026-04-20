import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPaceRange } from "@/lib/utils";
import Link from "next/link";
import type { Profile } from "@/types/database";

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

  function getFriendProfile(f: Record<string, unknown>): Profile {
    return (f.user_a === user!.id ? f.user_b_profile : f.user_a_profile) as Profile;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Your crew
      </h1>

      {/* Invite */}
      <div className="run-card p-4 space-y-3">
        <p className="font-body text-sm font-medium text-kith-text">
          Invite your crew
        </p>
        <p className="font-body text-xs text-kith-muted">
          Share your link and run together.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Join me on Kith",
                text: "Run with me on Kith!",
                url: `${window.location.origin}/invite/${user!.id}`,
              });
            }
          }}
        >
          Share invite link
        </Button>
      </div>

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
                className="flex items-center gap-3 py-2"
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
                <div className="flex gap-2">
                  <Button variant="primary" className="text-xs px-3 py-1.5">
                    Accept
                  </Button>
                  <Button variant="ghost" className="text-xs px-3 py-1.5 text-kith-muted">
                    Decline
                  </Button>
                </div>
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
          <div className="text-center py-10">
            <p className="font-body text-sm text-kith-muted">
              No crew yet. Share your invite link to get started.
            </p>
          </div>
        ) : (
          accepted.map((f) => {
            const profile = getFriendProfile(f as unknown as Record<string, unknown>);
            return (
              <Link
                key={f.id}
                href={`/profile/${profile.username}`}
                className="flex items-center gap-3 py-2"
              >
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
                {(profile.pace_min || profile.pace_max) && (
                  <Badge variant="pace">
                    {formatPaceRange(profile.pace_min, profile.pace_max)}
                  </Badge>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
