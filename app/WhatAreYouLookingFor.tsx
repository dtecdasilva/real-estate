'use client';
import { Home, Building2, Store, Warehouse } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    icon: <Home className="h-20 w-20 text-white" />,
    title: "Houses to let",
    description:
      "A private home available for rent. Ideal for individuals or families seeking flexible living without the commitment of ownership.",
    typeValue: "/property?cat=rent",
  },
  {
    icon: <Building2 className="h-20 w-20 text-white" />,
    title: "Guest House",
    description:
      "A small lodging facility for short stays. Offers comfortable rooms and a home-like atmosphere for travelers or visitors.",
    typeValue: "/property?type=guest-house",
  },
  {
    icon: <Store className="h-20 w-20 text-white" />,
    title: "Houses to buy",
    description:
      "A residential property for sale. Perfect for long-term living or investment, giving full ownership and customization options.",
    typeValue: "/property?type=house-for-sale",
  },
  {
    icon: <Warehouse className="h-20 w-20 text-white" />,
    title: "Lands",
    description:
      "An undeveloped plot ready for building, farming, or investment. Offers space and freedom to create your own project.",
    typeValue: "/property?type=land",
  },
];

export default function WhatAreYouLookingFor() {
  const router = useRouter();

  const handleClick = (typeValue: string) => {
    if (typeValue) {
      router.push(typeValue); // no encodeURIComponent here
    } else {
      router.push("/property");
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          What Are You Looking For?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-10 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleClick(category.typeValue)}
            >
              <div className="bg-blue-600 rounded-full p-12 mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-black mb-2">{category.title}</h3>
              <p className="text-gray-500 text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
