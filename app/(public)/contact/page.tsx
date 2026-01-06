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

export default function ContactPage() {
  const mounted = useMounted();
  const { lang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    crop: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      setMsg(t("contact.success"));
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        crop: "",
        message: "",
      });
    } catch {
      setMsg(t("contact.error"));
    } finally {
      setLoading(false);
    }
  }

  /* 🔥 CRITICAL LINE — hydration fix */
  if (!mounted) return null;

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-4">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

        {/* LEFT IMAGE */}
        <div className="relative rounded-2xl overflow-hidden min-h-[360px]">
          <img
            src="https://i.pinimg.com/736x/88/82/ef/8882efe15fb51d0701598a5509f99580.jpg"
            alt={t("contact.imageAlt")}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-green-200 mb-1">
              {t("contact.tagline")}
            </p>

            <h1 className="font-heading text-3xl font-semibold">
              {t("contact.brand")}
            </h1>

            <p className="text-sm text-neutral-200 mt-2 max-w-sm">
              {t("contact.description")}
            </p>

            <div className="mt-4 flex gap-6 text-xs text-neutral-200">
              <span>📞 {t("contact.phone")}</span>
              <span>📍 {t("contact.region")}</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("contact.formTitle")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t("contact.formSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: t("contact.fields.name") },
              { name: "phone", placeholder: t("contact.fields.phone") },
              { name: "location", placeholder: t("contact.fields.location") },
              { name: "crop", placeholder: t("contact.fields.crop") },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required={field.name !== "crop"}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder={t("contact.fields.message")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {msg && <p className="text-sm text-green-700 font-medium">{msg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white
                         font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? t("contact.submitting") : t("contact.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
