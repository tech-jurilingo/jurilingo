'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const colors = {
    teal: "#005F63",
    gold: "#E3B65B",
  };

  return (
    <footer
      className="w-full text-white pt-8 pb-4"
      style={{ backgroundColor: colors.teal }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logonav.png"
                alt="JuriLingo Logo"
                width={50}
                height={50}
                className="transform group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-2xl font-bold font-sans">JuriLingo</span>
            </div>

            <p className="text-white/80 leading-relaxed text-sm">
              Unlocking the Language of Justice
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">

              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/company/jurilingo"
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Linkedin size={20} />
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/_jurilingo?igsh=MWJmZzg4cGk1YXhqbw%3D%3D&utm_source=qr"
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram size={20} />
              </Link>

              {/* YouTube */}
              <Link
                href="https://www.youtube.com/channel/UCgpP_XfUh875UNQLcHtFUYA"
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: colors.gold }}>
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/competitions" className="text-white/80 hover:text-white transition-colors">Competitions</Link></li>
              <li><Link href="/about/jurilingo" className="text-white/80 hover:text-white transition-colors">About JuriLingo</Link></li>
              <li><Link href="/about/team" className="text-white/80 hover:text-white transition-colors">Meet the Team</Link></li>
              <li><Link href="/auth/register" className="text-white/80 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: colors.gold }}>
              Resources
            </h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/blogs" className="text-white/80 hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="/podcasts" className="text-white/80 hover:text-white transition-colors">Podcasts</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: colors.gold }}>
              Contact Us
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} style={{ color: colors.gold }} />
                <a
                  href="mailto:jurilingo@outlook.com"
                  className="text-white/90 hover:text-white"
                >
                  jurilingo@outlook.com
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
