"use client";

import YouTubeSection from "../components/Youtube";
import InstagramSection from "../components/Instagram";

export default function SocialMediaGallery() {
  return (
    <div className="space-y-0">
      <YouTubeSection />
      <InstagramSection />
    </div>
  );
}