"use client";

import {
  WifiIcon,
  SparklesIcon,
  MapPinIcon,
  SunIcon,
  TvIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type IconMap = {
  [key: string]: React.ElementType;
};

const iconMap: IconMap = {
  wifi: WifiIcon,
  "24hr-service": SparklesIcon,
  parking: MapPinIcon,
  breakfast: SunIcon,
  tv: TvIcon,
  "conference-hall": UserGroupIcon,
  laundry: SparklesIcon, // Re-using for laundry
  "room-service": PhoneIcon,
  security: ShieldCheckIcon,
  default: QuestionMarkCircleIcon,
};

type AmenityIconProps = {
  iconName?: string;
  className?: string;
};

export const AmenityIcon = ({ iconName, className }: AmenityIconProps) => {
  const IconComponent = iconName ? iconMap[iconName] || iconMap.default : iconMap.default;

  return <IconComponent className={cn("h-6 w-6", className)} />;
};
