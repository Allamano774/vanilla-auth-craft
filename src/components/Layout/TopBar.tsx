
import { useEffect, useState } from "react";
import { User, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const TopBar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:ml-64">
      <div className="lg:hidden"></div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <Wallet className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-700">
            KES {profile?.balance?.toFixed(2) || "0.00"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">{profile?.email}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
