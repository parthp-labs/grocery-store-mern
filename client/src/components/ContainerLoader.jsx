import { AnimatePresence, motion } from "framer-motion";
import React from "react";

function ContainerLoader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          id="container__loader"
          initial={{ display: "block" }}
          transition={{ duration: 0.3 }}
          exit={{ display: "none" }}
        >
          <div className="loader"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ContainerLoader;
