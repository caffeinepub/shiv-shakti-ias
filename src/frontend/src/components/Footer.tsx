import { Link } from "@tanstack/react-router";
import { Flame, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Shiv Shakti IAS</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              India's premier IAS exam preparation platform. Empowering
              aspirants to achieve their civil services dreams.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Courses</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link
                  to="/courses"
                  className="hover:text-primary transition-colors"
                >
                  UPSC Prelims
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-primary transition-colors"
                >
                  CSAT Mastery
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-primary transition-colors"
                >
                  Current Affairs
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-primary transition-colors"
                >
                  Essay Writing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link
                  to="/rank-predictor"
                  className="hover:text-primary transition-colors"
                >
                  Rank Predictor
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="hover:text-primary transition-colors"
                >
                  Doubt Solver
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@shivshaktiias.in</li>
              <li>+91 98765 43210</li>
              <li>New Delhi, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <span>© {year} Shiv Shakti IAS Academy. All rights reserved.</span>
          <span>
            Built with{" "}
            <Heart className="inline w-3.5 h-3.5 text-primary fill-primary mx-0.5" />{" "}
            using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
