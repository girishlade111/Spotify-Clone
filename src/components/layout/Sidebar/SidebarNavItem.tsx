/**
 * Sidebar Navigation Item Component
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  label: string;
  collapsed: boolean;
}

export function SidebarNavItem({
  href,
  icon,
  activeIcon,
  label,
  collapsed,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <Link
      href={href}
      className={`
        h-12 flex items-center gap-4 px-3 rounded-[4px]
        text-[#A7A7A7] text-base font-bold
        transition-colors duration-200
        hover:text-white hover:bg-white/7
        ${isActive ? "text-white" : ""}
        ${collapsed ? "justify-center px-0" : ""}
      `}
    >
      <span className="w-6 h-6 flex-shrink-0">
        {isActive && activeIcon ? activeIcon : icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return <Tooltip content={label} side="right">{content}</Tooltip>;
  }

  return content;
}
