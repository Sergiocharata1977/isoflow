import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeEffect, useDelayUnmount } from "@/hooks/useSafeEffect";

export function SafeMotion({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SafeAnimatePresence({ children, show = true, delay = 300 }) {
  const shouldRender = useDelayUnmount(show, delay);

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <SafeMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </SafeMotion>
      )}
    </AnimatePresence>
  );
}

export function SafeList({ children, delay = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function SafeListItem({ children, ...props }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default SafeMotion;
