import { motion } from "motion/react";
import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10"
    >
      <Contact />
    </motion.div>
  );
}
