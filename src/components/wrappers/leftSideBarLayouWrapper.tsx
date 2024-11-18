"use client";

import { motion } from "framer-motion";
import { useSidebarPadding } from "@/hooks/useSidebarStore";
import { cn } from "@/lib/utils";

const LeftSideBarLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dynamicPadding = useSidebarPadding();

  return (
    <motion.div
      className={cn("pt-24 -ml-6 mr-2", dynamicPadding)}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        layout: {
          duration: 0.2,
        },
      }}
    >
      <motion.div
        layout="position"
        transition={{
          duration: 0.2,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default LeftSideBarLayoutWrapper;
