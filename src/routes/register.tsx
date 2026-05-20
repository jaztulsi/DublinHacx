import { createFileRoute } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { MoonCompanion } from "@/components/MoonCompanion";
import { NavBar } from "@/components/NavBar";
import { RegistrationSection } from "@/components/sections/RegistrationSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Dublin Hacx" },
      {
        name: "description",
        content:
          "Claim your spot at Dublin Hacx. All skill levels welcome, free to attend, with 170 hacker spots available.",
      },
      { property: "og:title", content: "Register — Dublin Hacx" },
      {
        property: "og:description",
        content:
          "Claim your spot at Dublin Hacx. All skill levels welcome, free to attend, with 170 hacker spots available.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <CosmicBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain-overlay" />
      <CustomCursor />
      <NavBar />
      <MoonCompanion />
      <main className="relative z-10 pt-12">
        <RegistrationSection />
        <Footer />
      </main>
    </div>
  );
}
