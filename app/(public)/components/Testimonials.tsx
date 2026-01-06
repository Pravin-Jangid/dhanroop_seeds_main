"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";
import { t, useLanguage } from "@/app/utils/translations";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  imageUrl: string;
}

export default function TestimonialSlider() {
  // 🔥 KEY LINE: language change pe re-render
  const { lang } = useLanguage();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  /* ================= FETCH FROM FIREBASE ================= */
  useEffect(() => {
    const fetchTestimonials = async () => {
      const q = query(
        collection(db, "testimonials"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setTestimonials(data);
    };

    fetchTestimonials();
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section className=" py-2">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-2">
          <p className="label mb-3">
            {t("testimonials.badge")}
          </p>
          <h2 className="heading-lg font-heading text-dark">
            {t("testimonials.title")}
          </h2>
        </div>

        {/* ================= SLIDER ================= */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {testimonials.map((tst) => (
              <div key={tst.id} className="min-w-full px-4">
                <div className="bg-card rounded-2xl shadow-lg p-10 max-w-3xl mx-auto">
                  
                  <div className="flex items-center gap-5 mb-6">
                    <img
                      src={tst.imageUrl}
                      alt={tst.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[var(--brand-primary-green)]"
                    />

                    <div>
                      <p className="font-heading text-dark font-semibold">
                        {tst.name}
                      </p>
                      <p className="text-small text-muted">
                        {tst.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-base text-dark leading-relaxed">
                    “{tst.message}”
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DOTS ================= */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${
                  active === i
                    ? "w-8 bg-[var(--brand-primary-green)]"
                    : "w-2.5 bg-[var(--neutral-300)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
