"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Layers,
  Wrench,
  Globe,
  Smartphone,
} from "lucide-react";

const skillCategories = [
  {
    icon: Code2,
    title: "Frontend Development",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
    ],
    description:
      "Creating responsive, accessible, and performant user interfaces",
  },
  {
    icon: Server,
    title: "Backend Development",
    skills: ["Node.js", "Express", "REST APIs", "WebSockets", "Authentication"],
    description: "Building scalable server-side applications and APIs",
  },
  {
    icon: Database,
    title: "Databases & CMS",
    skills: ["MongoDB", "PostgreSQL", "Payload CMS", "Data Modeling"],
    description: "Designing efficient data structures and content management",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    skills: ["AWS (S3, EC2, Route 53)", "CI/CD", "Docker", "Linux"],
    description: "Deploying and managing cloud infrastructure",
  },
  {
    icon: Globe,
    title: "Integrations",
    skills: ["Razorpay", "Stripe", "Google Maps", "Third-party APIs"],
    description: "Seamlessly connecting external services",
  },
  {
    icon: Wrench,
    title: "Tools & Practices",
    skills: ["Git", "Postman", "Agile", "Code Review", "Testing"],
    description: "Following best practices for development workflow",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern web applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-muted/50 text-foreground border border-border/50 group-hover:border-primary/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl border bg-gradient-to-br from-primary/5 via-accent/5 to-background"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">Core Competencies</h3>
            <p className="text-muted-foreground">
              Additional areas of expertise and focus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="font-semibold mb-1">Responsive Design</h4>
              <p className="text-sm text-muted-foreground">
                Mobile-first approach
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="font-semibold mb-1">Component Architecture</h4>
              <p className="text-sm text-muted-foreground">
                Modular & reusable
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Performance</h4>
              <p className="text-sm text-muted-foreground">Optimized & fast</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Security</h4>
              <p className="text-sm text-muted-foreground">Best practices</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
