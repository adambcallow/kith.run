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
  friend_posted: "\uD83D\uDCCD",
  friend_request: "\uD83E\uDD1D",
  run_completed: "\uD83C\uDFC5",
};

function getTimeGroup(dateStr: string): "Today" | "Yesterday" | "Earlier" {
  const date = new Date(dateStr);
  const now = new Date();

  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((today.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

function groupNotifications(
  notifications: Notification[]
): { label: string; items: Notification[] }[] {
  const groups: Record<string, Notification[]> = {};
  const order: string[] = [];

  for (const n of notifications) {
    const group = getTimeGroup(n.created_at);
    if (!groups[group]) {
      groups[group] = [];
      order.push(group);
    }
    groups[group].push(n);
  }

  return order.map((label) => ({ label, items: groups[label] }));
}

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

  // Mark as read — fire and forget, don't block page render
  supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)
    .then(() => {});

  const grouped = groupNotifications(notifications ?? []);

  return (
    <div className="pt-2 space-y-6">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Notifications
      </h1>

      {(!notifications || notifications.length === 0) ? (
        <div className="bg-kith-surface rounded-card p-8 text-center">
          <p className="text-3xl mb-3 animate-gentle-bounce">&#x1F3C3;</p>
          <p className="font-body text-sm font-medium text-kith-text mb-1">
            All quiet for now
          </p>
          <p className="font-body text-xs text-kith-muted">
            Post a run and see who joins!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label} className="space-y-2">
              <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider px-1 pb-0.5">
                {group.label}
              </h2>
              <div className="space-y-1.5">
                {group.items.map((notification: Notification) => {
                  const payload = notification.payload as Record<string, string>;
                  const isUnread = !notification.read;

                  return (
                    <Link
                      key={notification.id}
                      href={
                        payload.run_id
                          ? `/run/${payload.run_id}`
                          : notification.type === "friend_request"
                            ? "/crew"
                            : "#"
                      }
                      className={`flex items-start gap-3 p-3 rounded-card transition-colors ${
                        isUnread
                          ? "bg-kith-orange/5 border-l-[3px] border-l-kith-orange"
                          : "hover:bg-kith-surface"
                      }`}
                    >
                      <span className="text-lg shrink-0 mt-0.5">
                        {typeIcons[notification.type] ?? "\uD83D\uDD14"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm text-kith-text leading-relaxed ${isUnread ? "font-semibold" : ""}`}>
                          <span className="font-medium">
                            {payload.actor_name ?? "Someone"}
                          </span>{" "}
                          {typeLabels[notification.type] ?? notification.type}
                        </p>
                        {payload.run_title && (
                          <p className="font-body text-xs text-kith-muted truncate mt-0.5">
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
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-kith-orange shrink-0 mt-2" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
