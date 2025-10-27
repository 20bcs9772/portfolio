import StickyThemeToggle from "@/components/site/sticky-theme-toggle";
import DevOpsPipelineSection from "@/components/sections/devops-pipeline-section";

export default function Page() {
  return (
    <main className="min-h-dvh bg-background text-foreground snap-y snap-mandatory">
      <StickyThemeToggle />
      <DevOpsPipelineSection />
    </main>
  );
}
