import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function RoomListPage() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*");

      console.log("ROOM DATA:", data);
      console.log("ROOM ERROR:", error);
    }

    test();
  }, []);

  return <h2 className="text-2xl font-bold">Check Console</h2>;
}