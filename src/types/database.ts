export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string;
          pace_min: number | null;
          pace_max: number | null;
          strava_id: string | null;
          garmin_id: string | null;
          personal_bests: PersonalBest[] | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string;
          pace_min?: number | null;
          pace_max?: number | null;
          strava_id?: string | null;
          garmin_id?: string | null;
          personal_bests?: PersonalBest[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string;
          pace_min?: number | null;
          pace_max?: number | null;
          strava_id?: string | null;
          garmin_id?: string | null;
          personal_bests?: PersonalBest[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          status: "pending" | "accepted";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          status?: "pending" | "accepted";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_a?: string;
          user_b?: string;
          status?: "pending" | "accepted";
          created_at?: string;
        };
        Relationships: [];
      };
      runs: {
        Row: {
          id: string;
          creator_id: string;
          title: string | null;
          start_lat: number;
          start_lng: number;
          start_place: string;
          scheduled_at: string;
          distance_km: number;
          pace_min_target: number | null;
          pace_max_target: number | null;
          note: string | null;
          visibility: "public" | "crew";
          is_live: boolean;
          expires_at: string | null;
          strava_activity_id: string | null;
          route_geojson: Record<string, unknown> | null;
          run_club_id: string | null;
          status: "upcoming" | "active" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title?: string | null;
          start_lat: number;
          start_lng: number;
          start_place: string;
          scheduled_at: string;
          distance_km: number;
          pace_min_target?: number | null;
          pace_max_target?: number | null;
          note?: string | null;
          visibility?: "public" | "crew";
          is_live?: boolean;
          expires_at?: string | null;
          strava_activity_id?: string | null;
          route_geojson?: Record<string, unknown> | null;
          run_club_id?: string | null;
          status?: "upcoming" | "active" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string | null;
          start_lat?: number;
          start_lng?: number;
          start_place?: string;
          scheduled_at?: string;
          distance_km?: number;
          pace_min_target?: number | null;
          pace_max_target?: number | null;
          note?: string | null;
          visibility?: "public" | "crew";
          is_live?: boolean;
          expires_at?: string | null;
          strava_activity_id?: string | null;
          route_geojson?: Record<string, unknown> | null;
          run_club_id?: string | null;
          status?: "upcoming" | "active" | "completed";
          created_at?: string;
        };
        Relationships: [];
      };
      run_participants: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          run_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          run_id?: string;
          user_id?: string;
          emoji?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          payload: Record<string, unknown>;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          payload?: Record<string, unknown>;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          payload?: Record<string, unknown>;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      run_clubs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string | null;
          description: string | null;
          logo_url: string | null;
          brand: string | null;
          instagram: string | null;
          status: "pending" | "approved" | "rejected";
          suggested_by: string | null;
          approved_by: string | null;
          created_at: string;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          city?: string | null;
          description?: string | null;
          logo_url?: string | null;
          brand?: string | null;
          instagram?: string | null;
          status?: "pending" | "approved" | "rejected";
          suggested_by?: string | null;
          approved_by?: string | null;
          created_at?: string;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          city?: string | null;
          description?: string | null;
          logo_url?: string | null;
          brand?: string | null;
          instagram?: string | null;
          status?: "pending" | "approved" | "rejected";
          suggested_by?: string | null;
          approved_by?: string | null;
          created_at?: string;
          approved_at?: string | null;
        };
        Relationships: [];
      };
      run_club_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          club_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          club_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Run = Database["public"]["Tables"]["runs"]["Row"];
export type RunParticipant = Database["public"]["Tables"]["run_participants"]["Row"];
export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];
export type Reaction = Database["public"]["Tables"]["reactions"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type RunClub = Database["public"]["Tables"]["run_clubs"]["Row"];
export type RunClubMember = Database["public"]["Tables"]["run_club_members"]["Row"];

export interface PersonalBest {
  distance: "5k" | "10k" | "half" | "marathon";
  seconds: number;
}
