import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { CosmicBackground } from "@/components/CosmicBackground";
import { MoonCompanion } from "@/components/MoonCompanion";

import { NavBar } from "@/components/NavBar";
import { IntroOverlay } from "@/components/IntroOverlay";
import { KonamiEgg } from "@/components/KonamiEgg";
import { HeroSection } from "@/components/sections/HeroSection";
import { StorySection } from "@/components/sections/StorySection";
import { BackedBySection } from "@/components/sections/BackedBySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ThemeSection } from "@/components/sections/ThemeSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dublin Hacx — September 2026" },
      {
        name: "description",
        content:
          "Dublin's very first Dublin Hacx. Bring any idea. Build it into reality. 12 hours (10am–10pm), 170 hackers, free food and swag.",
      },
      { property: "og:title", content: "Dublin Hacx — September 2026" },
      {
        property: "og:description",
        content:
          "Bring any idea. Build it into reality. Dublin's very first Dublin Hacx — September 2026 (date TBD).",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [introDone, setIntroDone] = useState(false);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {!introDone && <IntroOverlay onDone={() => setIntroDone(true)} />}

      {/* Lightweight cosmic background — fixed, behind hero image */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <CosmicBackground />
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain-overlay" />

      <CustomCursor />
      <KonamiEgg />
      <NavBar />
      <MoonCompanion />

      <main className="relative z-10">
        <HeroSection
          onApply={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSdnmbxMou0EOQ4BbJJEeekJ_B7FVXqV9IioHKOfzYSVIGmKNg/viewform",
              "_blank",
              "noopener,noreferrer",
            )
          }
          onLearnMore={() => scrollToId("about")}
        />
        <StorySection />
        <BackedBySection />
        <AboutSection />
        <ThemeSection />
        <ScheduleSection />
        <FaqSection />
        <SponsorsSection />
        <Footer />
      </main>
    </div>
  );
}
