"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Code2, Award } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about building exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-lg leading-relaxed">
                I'm{" "}
                <span className="font-semibold text-primary">
                  Madhav Bansal
                </span>
                , a Full Stack Developer with a passion for creating innovative,
                efficient web solutions. I specialize in translating complex
                requirements into user-friendly applications.
              </p>
              <p className="text-muted-foreground">
                With expertise spanning frontend development with React and
                Next.js, backend systems with Node.js, cloud infrastructure on
                AWS, and seamless third-party integrations, I deliver end-to-end
                solutions that scale.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                <Code2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Clean Code</div>
                  <p className="text-sm text-muted-foreground">
                    Writing maintainable, scalable solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Best Practices</div>
                  <p className="text-sm text-muted-foreground">
                    Following industry standards
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Education</h3>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg">
                    BE in Computer Science
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Chandigarh University
                  </p>
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  8.49 CGPA
                </span>
              </div>
              <p className="text-sm text-muted-foreground">2020 - 2024</p>
              <p className="text-sm">
                Comprehensive coursework in data structures, algorithms, DBMS,
                operating systems, and networking with hands-on projects in
                full-stack web and mobile development.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Work Experience</h3>
          </div>

          <div className="space-y-8 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-px before:bg-border">
            {/* Oceaniek Technologies */}
            <div className="relative pl-16">
              <div className="absolute left-[26px] top-2 w-3 h-3 rounded-full bg-primary border-4 border-background" />
              <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Full Stack Developer
                    </h4>
                    <p className="text-primary">Oceaniek Technologies</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Feb 2025 - Present
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Building production-grade UIs with Next.js and integrating
                  secure payment systems, real-time features, and CI/CD
                  pipelines to AWS. Focused on delivering scalable, performant
                  web applications.
                </p>
              </div>
            </div>

            {/* Cybernext */}
            <div className="relative pl-16">
              <div className="absolute left-[26px] top-2 w-3 h-3 rounded-full bg-primary/60 border-4 border-background" />
              <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Software Development Engineer
                    </h4>
                    <p className="text-primary">Cybernext</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Jul 2024 - Feb 2025
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Delivered robust backend APIs, implemented query
                  optimizations, and created accessible, responsive dashboards
                  with a focus on user experience and performance.
                </p>
              </div>
            </div>

            {/* Complykart */}
            <div className="relative pl-16">
              <div className="absolute left-[26px] top-2 w-3 h-3 rounded-full bg-primary/40 border-4 border-background" />
              <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Intern</h4>
                    <p className="text-primary">Complykart</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Jun - Jul 2022
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contributed to UI component development and API integration.
                  Gained valuable experience in code reviews and collaborative
                  team workflows.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
