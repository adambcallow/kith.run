import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Notification } from "@/types/database";

const typeLabels: Record<string, string> = {
  run_joined: "joined your run",
  friend_posted: "posted a run",
  friend_request: "wants to join your crew",
  run_completed: "Run completed",
};

const typeIcons: Record<string, string> = {
  run_joined: "\uD83C\uDFC3",
  friend_posted: "\uD83D\uDCE3",
  friend_request: "\uD83E\uDD1D",
  run_completed: "\u2705",
};

export default async function NotificationsPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <div className="space-y-4">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Notifications
      </h1>

      {(!notifications || notifications.length === 0) ? (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">&#x1F514;</p>
          <p className="font-body text-sm text-kith-muted">
            No notifications yet. Post a run and see who joins!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((notification: Notification) => {
            const payload = notification.payload as Record<string, string>;
            return (
              <Link
                key={notification.id}
                href={payload.run_id ? `/run/${payload.run_id}` : "#"}
                className={`flex items-start gap-3 p-3 rounded-card transition-colors ${
                  !notification.read ? "bg-kith-orange/5" : "hover:bg-kith-surface"
                }`}
              >
                <span className="text-lg shrink-0">
                  {typeIcons[notification.type] ?? "\uD83D\uDD14"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-kith-text">
                    <span className="font-medium">
                      {payload.actor_name ?? "Someone"}
                    </span>{" "}
                    {typeLabels[notification.type] ?? notification.type}
                  </p>
                  {payload.run_title && (
                    <p className="font-body text-xs text-kith-muted truncate">
                      {payload.run_title}
                    </p>
                  )}
                  <p className="font-body text-xs text-kith-muted mt-0.5">
                    {new Date(notification.created_at).toLocaleDateString(
                      undefined,
                      {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
