"use client";

import { db } from "@/app/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { t, useLanguage } from "@/app/utils/translations";

/* ================= MOUNT GUARD ================= */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function CareersPage() {
  const mounted = useMounted();
  const { lang } = useLanguage(); // 🔥 re-render trigger

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    position: "",
    experience: "",
    coverNote: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "careerApplications"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setMsg(t("careers.success"));
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        position: "",
        experience: "",
        coverNote: "",
      });
    } catch {
      setMsg(t("careers.error"));
    } finally {
      setLoading(false);
    }
  }

  /* 🔥 HYDRATION FIX */
  if (!mounted) return null;

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-4">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

        {/* ================= LEFT IMAGE ================= */}
        <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[360px]">
          <img
            src="https://i.pinimg.com/736x/88/82/ef/8882efe15fb51d0701598a5509f99580.jpg"
            alt={t("careers.imageAlt")}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-green-200">
              {t("careers.tagline")}
            </p>
            <h1 className="text-3xl font-semibold">
              {t("careers.title")}
            </h1>
            <p className="text-sm text-neutral-200 mt-2 max-w-sm">
              {t("careers.description")}
            </p>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("careers.formTitle")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t("careers.formSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: t("careers.fields.name") },
              { name: "phone", placeholder: t("careers.fields.phone") },
              { name: "email", placeholder: t("careers.fields.email") },
              { name: "location", placeholder: t("careers.fields.location") },
              { name: "position", placeholder: t("careers.fields.position") },
              { name: "experience", placeholder: t("careers.fields.experience") },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}

            <textarea
              name="coverNote"
              value={form.coverNote}
              onChange={handleChange}
              rows={4}
              placeholder={t("careers.fields.coverNote")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {msg && (
              <p className="text-sm text-green-700 font-medium">
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white
                         font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading
                ? t("careers.submitting")
                : t("careers.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
