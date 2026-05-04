import { Linkedin, Instagram, Youtube, Music2 } from "lucide-react";
import type { Platform } from "@/lib/types";

const ICONS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  TikTok: Music2,
  YouTube: Youtube,
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  const Icon = ICONS[platform];
  return <Icon className={className} />;
}
