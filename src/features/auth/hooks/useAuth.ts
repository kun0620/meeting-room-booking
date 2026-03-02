import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface AppUser extends User {
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (baseUser: User | null) => {
    if (!baseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", baseUser.id)
        .single();

      setUser({ ...baseUser, ...profile });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUser(baseUser as AppUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      fetchProfile(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        fetchProfile(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}