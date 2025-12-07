import React from "react";
import Link from "next/link";
import {
  Scale,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
  };

  return (
    <footer
      className="w-full text-white pt-16 pb-8"
      style={{ backgroundColor: colors.teal }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Scale size={32} style={{ color: colors.gold }} />
              <span className="text-2xl font-bold font-serif">JuriLingo</span>
            </div>
            <p className="text-white/80 leading-relaxed text-sm">
              Connecting moot court competitors, judges, and organizers in one
              comprehensive platform.
            </p>
            <div className="flex gap-4 mt-2">
              {/* Replace href values with your actual socials */}
              <Link
                href="#"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3
              className="text-lg font-bold mb-6"
              style={{ color: colors.gold }}
            >
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/moots"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Moots
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About JuriLingo
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3
              className="text-lg font-bold mb-6"
              style={{ color: colors.gold }}
            >
              Resources
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3
              className="text-lg font-bold mb-6"
              style={{ color: colors.gold }}
            >
              Contact Us
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} style={{ color: colors.gold }} />
                <a
                  href="mailto:jurilingo.outlook.com"
                  className="text-white/90 hover:text-white"
                >
                  jurilingo.outlook.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} style={{ color: colors.gold }} />
                <a
                  href="tel:+916364300400"
                  className="text-white/90 hover:text-white"
                >
                  +91 6364300400
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2025 JuriLingo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
