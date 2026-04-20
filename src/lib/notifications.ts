import { createClient } from "@/lib/supabase/client";

export async function createNotification(params: {
  recipientId: string;
  type: "run_joined" | "friend_request" | "friend_posted" | "run_completed";
  payload: Record<string, string>;
}) {
  const supabase = createClient();
  await supabase.from("notifications").insert({
    user_id: params.recipientId,
    type: params.type,
    payload: params.payload,
    read: false,
  });
}
