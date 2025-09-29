import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  mobile?: boolean;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Study Plan",
    href: "/study-plan",
    icon: BookOpen,
  },
  {
    title: "Quiz",
    href: "/quiz",
    icon: Brain,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Ask Doubt",
    href: "/ask-doubt",
    icon: HelpCircle,
  },
];

const Navigation: React.FC<NavigationProps> = ({ mobile = false }) => {
  const router = useRouter();

  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = router.pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              mobile
                ? "flex items-center gap-2 text-lg font-semibold"
                : "transition-colors hover:text-foreground/80 text-foreground/60",
              isActive && "text-foreground",
              mobile && isActive && "text-primary"
            )}
          >
            {mobile && <Icon className="h-5 w-5" />}
            {item.title}
          </Link>
        );
      })}
    </>
  );
};

export default Navigation;
