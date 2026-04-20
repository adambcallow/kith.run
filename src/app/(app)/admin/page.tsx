import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { RunClub } from "@/types/database";
import { AdminClubActions } from "./AdminClubActions";

const ADMIN_EMAIL = "hello@adamcallow.com";

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/feed");
  }

  // Fetch all run clubs ordered by newest first
  const { data: clubs } = await supabase
    .from("run_clubs")
    .select("*")
    .order("created_at", { ascending: false });

  const allClubs = (clubs ?? []) as RunClub[];

  // Fetch suggested_by usernames for clubs that have a suggested_by value
  const suggestedByIds: string[] = [];
  const seenIds = new Set<string>();
  for (const c of allClubs) {
    if (c.suggested_by && !seenIds.has(c.suggested_by)) {
      seenIds.add(c.suggested_by);
      suggestedByIds.push(c.suggested_by);
    }
  }

  let usernameMap: Record<string, string> = {};
  if (suggestedByIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", suggestedByIds);

    if (profiles) {
      usernameMap = Object.fromEntries(
        profiles.map((p) => [p.id, p.username])
      );
    }
  }

  // Fetch member counts per club
  const clubIds = allClubs.map((c) => c.id);
  let memberCountMap: Record<string, number> = {};
  if (clubIds.length > 0) {
    const { data: memberCounts } = await supabase
      .from("run_club_members")
      .select("club_id");

    if (memberCounts) {
      memberCountMap = memberCounts.reduce<Record<string, number>>(
        (acc, row) => {
          acc[row.club_id] = (acc[row.club_id] ?? 0) + 1;
          return acc;
        },
        {}
      );
    }
  }

  const pending = allClubs.filter((c) => c.status === "pending");
  const approved = allClubs.filter((c) => c.status === "approved");
  const rejected = allClubs.filter((c) => c.status === "rejected");

  return (
    <div className="space-y-8 pb-8">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Admin — Run Clubs
      </h1>

      {allClubs.length === 0 && (
        <div className="bg-kith-surface rounded-card p-8 text-center">
          <p className="font-body text-sm text-kith-muted">
            No run clubs yet.
          </p>
        </div>
      )}

      {/* Pending review */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Pending review ({pending.length})
          </h2>
          {pending.map((club) => (
            <AdminClubActions
              key={club.id}
              club={club}
              suggestedByUsername={
                club.suggested_by
                  ? usernameMap[club.suggested_by]
                  : undefined
              }
              memberCount={memberCountMap[club.id] ?? 0}
              userId={user.id}
            />
          ))}
        </section>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Approved ({approved.length})
          </h2>
          {approved.map((club) => (
            <AdminClubActions
              key={club.id}
              club={club}
              suggestedByUsername={
                club.suggested_by
                  ? usernameMap[club.suggested_by]
                  : undefined
              }
              memberCount={memberCountMap[club.id] ?? 0}
              userId={user.id}
            />
          ))}
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Rejected ({rejected.length})
          </h2>
          {rejected.map((club) => (
            <AdminClubActions
              key={club.id}
              club={club}
              suggestedByUsername={
                club.suggested_by
                  ? usernameMap[club.suggested_by]
                  : undefined
              }
              memberCount={memberCountMap[club.id] ?? 0}
              userId={user.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}
