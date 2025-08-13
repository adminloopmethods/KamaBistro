// "use client"

// import * as React from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { LucideIcon } from "lucide-react"
// import { useOnClickOutside } from "usehooks-ts"

// import { cn } from "@/lib/utils"

// interface Tab {
//   title: string
//   icon: LucideIcon
//   type?: never
// }

// interface Separator {
//   type: "separator"
//   title?: never
//   icon?: never
// }

// type TabItem = Tab | Separator

// interface ExpandedTabsProps {
//   tabs: TabItem[]
//   className?: string
//   activeColor?: string
//   onChange?: (index: number | null) => void
// }

// const buttonVariants = {
//   initial: {
//     gap: 0,
//     paddingLeft: ".5rem",
//     paddingRight: ".5rem",
//   },
//   animate: (isSelected: boolean) => ({
//     gap: isSelected ? ".5rem" : 0,
//     paddingLeft: isSelected ? "1rem" : ".5rem",
//     paddingRight: isSelected ? "1rem" : ".5rem",
//   }),
// }

// const spanVariants = {
//   initial: { width: 0, opacity: 0 },
//   animate: { width: "auto", opacity: 1 },
//   exit: { width: 0, opacity: 0 },
// }

// const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 }

// export function ExpandedTabs({
//   tabs,
//   className,
//   activeColor = "text-primary",
//   onChange,
// }: ExpandedTabsProps) {
//   const [selected, setSelected] = React.useState<number | null>(null)
//   const outsideClickRef = React.useRef<HTMLDivElement>(
//     null as unknown as HTMLDivElement
//   )

//   useOnClickOutside(outsideClickRef, () => {
//     setSelected(null)
//     onChange?.(null)
//   })

//   const handleSelect = (index: number) => {
//     setSelected(index)
//     onChange?.(index)
//   }

//   const Separator = () => (
//     <div className=" h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
//   )

//   return (
//     <div
//       ref={outsideClickRef}
//       className={cn(
//         " flex gap-2 rounded-2xl border bg-background p-1 shadow-sm ",
//         className
//       )}
//     >
//       {tabs.map((tab, index) => {
//         if (tab.type === "separator") {
//           return <Separator key={`separator-${index}`} />
//         }

//         const Icon = tab.icon
//         return (
//           <motion.button
//             key={tab.title}
//             variants={buttonVariants}
//             initial={false}
//             animate="animate"
//             custom={selected === index}
//             onClick={() => handleSelect(index)}
//             transition={transition}
//             className={cn(
//               "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
//               selected === index
//                 ? cn("bg-muted", activeColor)
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             )}
//           >
//             <Icon size={20} />
//             <AnimatePresence initial={false}>
//               {selected === index && (
//                 <motion.span
//                   variants={spanVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                   transition={transition}
//                   className="overflow-hidden"
//                 >
//                   {tab.title}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         )
//       })}
//     </div>
//   )
// }

"use client";

import * as React from "react";
import {AnimatePresence, motion} from "framer-motion";
import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

interface Tab {
  title: string;
  icon: LucideIcon;
  path: string; // Added path property for navigation
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
    paddingLeft: ".75rem", // Increased padding
    paddingRight: ".75rem", // Increased padding
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".75rem" : 0, // Increased gap
    paddingLeft: isSelected ? "1.25rem" : ".75rem", // Increased padding
    paddingRight: isSelected ? "1.25rem" : ".75rem", // Increased padding
  }),
};

const spanVariants = {
  initial: {width: 0, opacity: 0},
  animate: {width: "auto", opacity: 1},
  exit: {width: 0, opacity: 0},
};

const transition = {delay: 0.1, type: "spring", bounce: 0, duration: 0.6};

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "text-primary",
}: ExpandedTabsProps) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);

    // Get the tab item
    const tab = tabs[index] as Tab;

    // Only navigate if it's a tab with a path
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
        "flex gap-2 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-lg shadow-lg p-1", // Glass morphism effect
        "dark:bg-gray-800/50 dark:border-gray-700/30", // Dark mode styles
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-3 text-base font-medium transition-colors duration-300", // Increased size
              selected === index
                ? cn("bg-white/60 dark:bg-gray-700/70 shadow-sm", activeColor) // Glass effect for selected
                : "text-muted-foreground hover:bg-white/40 dark:hover:bg-gray-700/40" // Glass effect for hover
            )}
          >
            <Icon size={24} /> {/* Increased icon size */}
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden font-medium" // Bolder font
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
