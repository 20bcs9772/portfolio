"use client";

import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl mb-3">Madhav Bansal</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full Stack Developer specializing in building exceptional digital
              experiences with modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a
                href="#hero"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                About
              </a>
              <a
                href="#skills"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Connect With Me</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://github.com/20bcs9772"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg bg-card border hover:bg-accent hover:border-primary/50 transition-all"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/madhav-bansal-b81349200/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-card border hover:bg-accent hover:border-primary/50 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:bansalmadhav787@gmail.com"
                aria-label="Email"
                className="p-2 rounded-lg bg-card border hover:bg-accent hover:border-primary/50 transition-all"
                title="Email"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Available for freelance opportunities and collaborations
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>using Next.js & Tailwind CSS</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Madhav Bansal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
