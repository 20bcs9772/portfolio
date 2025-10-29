import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Footer from "@/components/site/footer";
import StickyThemeToggle from "@/components/site/sticky-theme-toggle";
import FloatingCTA from "@/components/site/floating-cta";

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <StickyThemeToggle />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
