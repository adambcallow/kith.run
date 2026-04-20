import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, full_name")
    .eq("id", user.id)
    .single();

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <div className="min-h-screen bg-white pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <TopBar
        username={profile?.username}
        avatarUrl={profile?.avatar_url}
        fullName={profile?.full_name}
        unreadCount={unreadCount ?? 0}
      />
      <main className="app-container py-4">{children}</main>
      <BottomNav
        unreadCount={unreadCount ?? 0}
        username={profile?.username}
        avatarUrl={profile?.avatar_url}
        fullName={profile?.full_name}
      />
    </div>
  );
}
