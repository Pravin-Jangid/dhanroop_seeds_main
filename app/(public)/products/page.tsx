"use client";

import { db } from "@/app/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  title: string;
  imageUrl: string;
  mausam: string;
  ropai: string;
  nursery: string;
  pani: string;
  jamin: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);
      const data: Product[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8 md:space-y-10">
          {products.map((product, index) => {
            const isReverse = index % 2 !== 0;

            return (
              <div
                key={product.id}
                className={`
                  grid grid-cols-1 border-b-2 border-gray-600 lg:grid-cols-2 gap-2 items-center
                  animate-fadeIn
                  ${isReverse ? "lg:flex-row-reverse" : ""}
                `}
              >
                {/* ================= IMAGE SECTION ================= */}
                <div
                  className={`
                    flex items-center justify-center p-8 md:p-10
                    ${isReverse ? "lg:order-2" : "lg:order-1"}
                  `}
                >
                  <div className="relative w-full max-w-md mx-auto group">
                    {/* Decorative elements */}
                    {/* <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}

                    {/* Main Product Image */}
                    <div className="relative transform transition-transform duration-300 group-hover:scale-[1.12]">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="object-contain w-full h-auto max-h-[320px] md:max-h-[380px] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
                        priority={index < 2}
                      />
                    </div>
                  </div>
                </div>

                {/* ================= DETAILS SECTION ================= */}
                <div
                  className={`
                    space-y-6 p-2 md:p-4
                    ${isReverse ? "lg:order-1" : "lg:order-2"}
                  `}
                >
                  {/* Product Header with premium spacing */}
                  <div className="space-y-3 border-b border-gray-100 pb-1">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark leading-tight tracking-tight">
                      {product.name}
                    </h2>

                    <p className="text-gray-600 text-base leading-relaxed font-light">
                      {product.title}
                    </p>
                  </div>

                  {/* Specifications Grid - Premium Design */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Specification Item Template */}
                      {[
                        { icon: "🌱", label: "मौसम", value: product.mausam },
                        { icon: "🚜", label: "रोपाई", value: product.ropai },
                        { icon: "🌿", label: "नर्सरी", value: product.nursery },
                        { icon: "💧", label: "पानी", value: product.pani },
                      ].map((spec, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-xl text-primary transform transition-transform duration-200 group-hover:scale-110">
                              {spec.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                                {spec.label}
                              </div>
                              <div className="text-sm font-semibold text-dark">
                                {spec.value}
                              </div>
                            </div>
                          </div>
                          {/* Subtle accent */}
                          {/* <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                        </div>
                      ))}
                    </div>

                    {/* जमीन - Featured Card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent border border-primary/20 p-5">
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-md"></div>

                      <div className="relative flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                            🧱
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-primary mb-1">
                            जमीन
                          </div>
                          <div className="text-base font-bold text-dark">
                            {product.jamin}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
