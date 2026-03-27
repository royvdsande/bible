import Cross from "./Cross";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[55vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Radial amber glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none animate-radial-breathe"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(212,168,83,0.18) 0%, rgba(212,168,83,0.07) 38%, rgba(212,168,83,0.02) 60%, transparent 75%)",
        }}
      />

      {/* Secondary soft warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 50% 40%, rgba(212,168,83,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Cross container with local glow */}
      <div className="relative flex flex-col items-center z-10 px-4 pt-12 pb-8">
        <div className="cross-glow-container animate-cross-float mb-6">
          <Cross size={88} />
        </div>

        {/* App title */}
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-center animate-fade-in-up"
          style={{
            color: "#F0EDE8",
            textShadow: "0 2px 24px rgba(212,168,83,0.18), 0 1px 3px rgba(0,0,0,0.6)",
            letterSpacing: "0.02em",
          }}
        >
          Bijbel Leesplan
        </h1>

        {/* Subtitle */}
        <p
          className="mt-3 text-base sm:text-lg text-center max-w-sm animate-fade-in-up delay-200"
          style={{ color: "#9CA3AF", letterSpacing: "0.03em" }}
        >
          Een reis door het Woord van God
        </p>

        {/* Decorative gold line */}
        <div
          className="mt-6 animate-fade-in-up delay-300"
          style={{
            width: "48px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.6), transparent)",
          }}
        />
      </div>

      {/* Bottom gradient fade into main content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none hero-fade-bottom"
      />
    </section>
  );
}
