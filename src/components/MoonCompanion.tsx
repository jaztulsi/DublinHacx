/** A small background moon that bounces horizontally without covering content. */
export function MoonCompanion() {
  return (
    <div
      aria-hidden
      className="moon-bounce-track pointer-events-none fixed left-0 top-[14vh] z-[2] hidden w-full lg:block"
    >
      <div className="relative h-14 w-14 opacity-70">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 30%, oklch(0.96 0.03 90) 0%, var(--gold) 55%, oklch(0.28 0.04 90) 100%)",
            boxShadow:
              "0 0 30px oklch(0.96 0.03 90 / 0.35), 0 0 60px oklch(0.78 0.17 305 / 0.25)",
          }}
        />
        {/* faint craters */}
        <div className="absolute left-3 top-4 h-1.5 w-1.5 rounded-full bg-background/20" />
        <div className="absolute right-3 top-6 h-1 w-1 rounded-full bg-background/20" />
        <div className="absolute bottom-3 left-5 h-1 w-1 rounded-full bg-background/15" />
      </div>
    </div>
  );
}
