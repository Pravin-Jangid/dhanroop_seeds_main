// app/(public)/page.tsx

import AboutSection from "./components/AboutSection";
import AchievementsSection from "./components/AchievementsSection";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Socials from "./components/Socials";
import Testimonials from "./components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Products />

      <Socials />
      <AchievementsSection />
      <Testimonials />
    </>
  );
}
