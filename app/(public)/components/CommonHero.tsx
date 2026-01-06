"use client";

import Link from "next/link";

interface CommonHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  bgImage: string;
  badge?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  overlay?: "dark" | "light";
  parallax?: boolean;
}

export default function CommonHero({
  title,
  subtitle,
  description,
  bgImage,
  badge,
  primaryCta,
  secondaryCta,
  overlay = "dark",
  parallax = true,
}: CommonHeroProps) {
  return (
    <section
      className={`
        relative
        min-h-[60vh]
        flex items-center
        bg-cover bg-center
        ${parallax ? "bg-fixed" : ""}
      `}
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          overlay === "dark" ? "bg-black/55" : "bg-white/60 backdrop-blur-sm"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 py-16 text-white">
          {badge && (
            <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-primary/90 text-white">
              {badge}
            </span>
          )}

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl">
            {title}
            {subtitle && (
              <>
                <br />
                <span className="text-primary">{subtitle}</span>
              </>
            )}
          </h1>

          {description && (
            <p className="mt-5 text-base sm:text-lg text-white/90 max-w-2xl">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <button className="btn btn-primary">
                    {primaryCta.label}
                  </button>
                </Link>
              )}

              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <button className="btn btn-outline bg-white/90 text-dark">
                    {secondaryCta.label}
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
