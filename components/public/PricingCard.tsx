"use client";

import Reveal from "../ui/Reveal";

type PricingCardProps = {
  title: string;
  description?: string;
  price: number;
};

export const PricingCard = ({ title, description, price }: PricingCardProps) => {
  return (
    <Reveal className="h-full">
      <div className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
            Rs. {price}
          </span>
        </div>
        {description && (
          <p className="mt-4 text-sm text-gray-600">{description}</p>
        )}
      </div>
    </Reveal>
  );
};