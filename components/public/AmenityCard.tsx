"use client";

import { AmenityIcon } from "./AmenityIcon";
import Reveal from "../ui/Reveal";

type AmenityCardProps = {
  title: string;
  description?: string;
  iconName?: string;
  index: number;
};

export const AmenityCard = ({ title, iconName, index }: AmenityCardProps) => {
  return (
    <Reveal
      delay={index * 0.1}
      className="h-full"
    >
      <div className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100/50 transition-all duration-300 group-hover:bg-blue-100">
            <AmenityIcon
              iconName={iconName}
              className="h-6 w-6 text-blue-600 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      </div>
    </Reveal>
  );
};