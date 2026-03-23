import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetCallerProfile, useSaveProfile } from "@/hooks/useQueries";
import { Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { data: profile } = useGetCallerProfile();
  const saveProfile = useSaveProfile();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        name,
        email,
        role: profile?.role ?? "user",
      });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (!identity) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="profile.page"
      >
        <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-navy mb-2">Please Log In</h2>
        <p className="text-muted-foreground">
          You need to log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-xl"
      data-ocid="profile.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            {name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-navy">
            {name || "My Profile"}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-primary text-white border-0">
              {profile?.role ?? "Student"}
            </Badge>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-navy">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  data-ocid="profile.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  data-ocid="profile.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Principal ID</Label>
                <Input
                  value={identity?.getPrincipal().toString() ?? ""}
                  readOnly
                  className="bg-secondary/50 text-xs font-mono"
                />
              </div>
              <Button
                type="submit"
                disabled={saveProfile.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                data-ocid="profile.submit_button"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
