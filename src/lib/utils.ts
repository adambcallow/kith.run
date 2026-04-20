export function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatPaceRange(min: number | null, max: number | null): string {
  if (!min && !max) return "";
  if (min && !max) return `${formatPace(min)} /km`;
  if (!min && max) return `${formatPace(max)} /km`;
  return `${formatPace(min!)} – ${formatPace(max!)} /km`;
}

export function formatDistance(km: number): string {
  return km % 1 === 0 ? `${km} km` : `${km.toFixed(1)} km`;
}

export function avatarFallbackColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 65%)`;
}

export function getInitials(name: string | null, username: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
}

export function formatRelativeRunTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const timeStr = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays < 1) return `Earlier today \u00B7 ${timeStr}`;
    if (absDays < 2) return `Yesterday \u00B7 ${timeStr}`;
    return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  }

  if (diffHours < 1) return "Starting soon";
  if (diffDays < 1) return `Today \u00B7 ${timeStr}`;
  if (diffDays < 2) return `Tomorrow \u00B7 ${timeStr}`;
  if (diffDays < 7) return `${date.toLocaleDateString(undefined, { weekday: "long" })} \u00B7 ${timeStr}`;
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}
