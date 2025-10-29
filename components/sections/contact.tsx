"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = "Portfolio Contact - Let's Build Something";
    const body = `Hi Madhav,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;
    const link = `mailto:bansalmadhav787@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = link;
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <a
                href="mailto:bansalmadhav787@gmail.com"
                className="group flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-sm text-muted-foreground">
                    bansalmadhav787@gmail.com
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Location</div>
                  <div className="text-sm text-muted-foreground">
                    Chandigarh, India
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Connect on Social</h4>
              <div className="flex gap-3">
                <a
                  href="https://github.com/20bcs9772"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/madhav-bansal-b81349200/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:bansalmadhav787@gmail.com"
                  className="p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="text-sm font-medium">
                Available for new opportunities
              </span>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-2xl border bg-card"
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  required
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full group">
                Send Message
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your message will open in your email client
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
