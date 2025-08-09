"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS: { icon: string; label: string }[] = [
  { icon: "🧭", label: "Create New Trip" },
  { icon: "✨", label: "Inspire me where to go" },
  { icon: "🗺️", label: "Discover Hidden gems" },
  { icon: "⛰️", label: "Adventure Destination" },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const chipClass =
    "inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 hover:shadow-sm";

  const onSend = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    //Navigate to creating a trip
    router.push("/create-new-trip");
  };

  return (
    <section className="w-full pt-16 pb-10">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
          Hey, I'm your personal{" "}
          <span className="text-primary">Trip Planner</span>
        </h1>
        <p className="mt-4 text-gray-500 md:text-lg">
          Tell me what you want, and I'll handle the rest: Flights, Hotels, trip
          planner – all in seconds
        </p>
      </div>

      {/* Input box */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="relative w-full rounded-3xl border-2 border-gray-200 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Create a trip for Paris from New York"
            className="w-full rounded-3xl py-5 pl-6 pr-16 text-base md:text-lg placeholder:text-gray-400 focus:outline-none"
          />
          <button
            aria-label="Submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
            onClick={onSend}
          >
            {/* Paper plane icon (no external deps) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          {SUGGESTIONS.map(({ icon, label }) => (
            <button key={label} className={chipClass}>
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
