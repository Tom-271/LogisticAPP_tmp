"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function ParallaxSection({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = -rect.top * 0.4;
      bgRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 scale-[1.3]"
        style={{ background: gradient }}
      />
      <div className="relative z-10 w-full max-w-6xl px-6 py-20">{children}</div>
    </section>
  );
}


export default function HomeParallax() {
  
  return (
    <div className="flex flex-col">
      {/* Sezione 1 — Benvenuto */}
      <ParallaxSection gradient="linear-gradient(160deg, #ffffff 0%, #f0f4ff 60%, #dbeafe 100%)">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-5 leading-tight">
              Benvenuto in<br />
              <span className="text-blue-600">BazzurroDelivery!</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-md">
              Il servizio di delivery perfetto per te. Veloce, affidabile, sempre con te.
            </p>
            <Link
              href="/auth/welcome"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg"
            >
              Scopri chi sono!
            </Link>
          </div>

          <div className="flex-1 flex flex-wrap gap-6 justify-center lg:justify-end">
            
          </div>
        </div>
      </ParallaxSection>

      {/* Sezione 2 — Spedizioni */}
      <ParallaxSection gradient="linear-gradient(160deg, #e8edf5 0%, #d1dff7 50%, #c7d9f9 100%)">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="flex-1 text-left lg:text-right">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-5 leading-tight">
              Spedisci<br />
              <span className="text-blue-600">con noi</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-md lg:ml-auto">
              Prenota la tua spedizione in pochi click, ovunque tu sia.
            </p>
            <Link
              href="/auth/prenota_spedizione"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg"
            >
              Prenota una spedizione
            </Link>
          </div>

          <div className="flex-1 flex flex-wrap gap-6 justify-center lg:justify-start">
            
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}