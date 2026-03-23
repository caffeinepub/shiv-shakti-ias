import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetCallerProfile, useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Flame, LayoutDashboard, Menu, User, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/rank-predictor", label: "Mock Tests" },
  { to: "/chatbot", label: "Study Material" },
  { to: "/", label: "About Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: profile } = useGetCallerProfile();
  const { data: isAdmin } = useIsAdmin();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-navy text-lg leading-tight">
              Shiv Shakti
            </span>
            <span className="block text-xs text-muted-foreground leading-tight">
              IAS Academy
            </span>
          </div>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              activeProps={{
                className:
                  "px-3 py-2 rounded-md text-sm font-medium text-primary bg-accent",
              }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors flex items-center gap-1"
                data-ocid="nav.link"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/educator"
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors flex items-center gap-1"
                  data-ocid="nav.link"
                >
                  <BookOpen className="w-4 h-4" /> Educator Panel
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                data-ocid="nav.link"
              >
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                  {profile?.name ? (
                    profile.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {profile?.name ?? "My Profile"}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                disabled={loginStatus === "logging-in"}
                className="border-navy text-navy hover:bg-navy hover:text-white"
                data-ocid="nav.button"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAuth}
              disabled={loginStatus === "logging-in"}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
              data-ocid="nav.button"
            >
              {loginStatus === "logging-in" ? "Logging in..." : "Log In"}
            </Button>
          )}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
