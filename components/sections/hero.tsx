"use client";

import { Button } from "@/components/ui/button";
import MatrixRain from "@/components/matrix-rain";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 z-0">
        <MatrixRain
          className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-screen"
          speed={0.001}
          density={0.22}
          fontSize={16}
          trailAlpha={0.18}
          darkColor="#595959"
          lightColor="#454545"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.18) 100%), repeating-linear-gradient(0deg, color-mix(in oklch, var(--color-foreground) 6%, transparent) 0 1px, transparent 1px 2px)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklch, var(--color-background) 0%, transparent) 0%, var(--color-background) 80%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Full Stack Developer
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-pretty leading-tight">
                <span className="relative">
                  Madhav Bansal
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 blur-md opacity-50"
                  />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Crafting high-performance web applications with modern
                technologies. Specializing in React, Next.js, Node.js, and cloud
                infrastructure.
              </p>
            </div>

            {/* Tech Stack Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "AWS",
                "Tailwind",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-sm px-3 py-1.5 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="group">
                <a href="#about">
                  Learn More
                  <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">Get In Touch</a>
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-4 pt-4"
            >
              <span className="text-sm text-muted-foreground">Connect:</span>
              <a
                href="https://github.com/20bcs9772"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/madhav-bansal-b81349200/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:bansalmadhav787@gmail.com"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Main Feature Card */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 aspect-[4/3] flex flex-col items-center justify-center p-8">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Production Ready
                    </p>
                    <p className="mt-2 text-3xl md:text-4xl font-bold">
                      Enterprise Solutions
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Building scalable applications trusted by businesses
                    worldwide
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: "inset 0 0 40px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-card p-4 text-center hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary">2+</div>
                <p className="text-xs text-muted-foreground mt-1">Years Exp.</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary">10+</div>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary">100%</div>
                <p className="text-xs text-muted-foreground mt-1">Committed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
