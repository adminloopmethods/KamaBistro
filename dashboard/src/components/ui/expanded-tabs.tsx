"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import type { Transition } from "framer-motion";

interface Tab {
  title: string;
  icon: LucideIcon;
  path: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  path?: never;
}

type TabItem = Tab | Separator;

interface ExpandedTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".75rem",
    paddingRight: ".75rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".75rem" : 0,
    paddingLeft: isSelected ? "1.25rem" : ".75rem",
    paddingRight: isSelected ? "1.25rem" : ".75rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition: Transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "text-primary",
}: ExpandedTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = React.useState<number | null>(null);

  // Find the active tab based on current path
  React.useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => (tab as Tab).path === pathname);
    setSelected(activeIndex >= 0 ? activeIndex : 0);
  }, [pathname, tabs]);

  const handleSelect = (index: number) => {
    setSelected(index);
    const tab = tabs[index] as Tab;
    if (tab && tab.path) {
      router.push(tab.path);
    }
  };

  const Separator = () => (
    <div className="h-[32px] w-[1.2px] bg-border/60" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex gap-2 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-lg shadow-lg p-1",
        "dark:bg-gray-800/50 dark:border-gray-700/30",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isActive = selected === index;

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isActive}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-3 text-base font-medium transition-colors duration-300",
              isActive
                ? cn("bg-white/60 dark:bg-gray-700/70 shadow-sm", activeColor)
                : "text-muted-foreground hover:bg-white/40 dark:hover:bg-gray-700/40"
            )}
          >
            <Icon size={24} />
            {/* Always show text for active tab, otherwise show on hover */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden font-medium"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
