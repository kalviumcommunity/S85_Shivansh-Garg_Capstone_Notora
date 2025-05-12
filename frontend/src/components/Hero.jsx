import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="flex flex-col items-center text-center py-36 relative z-20"
    >
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6DD5FA] to-[#2980B9]"
      >
        Notora
      </motion.h1>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-8 text-2xl max-w-3xl text-slate-200"
      >
        Experience note-taking reimagined—intelligent, connected, and visually stunning.
      </motion.p>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-10 flex space-x-6"
      >
        <Button className="text-lg">Get Started</Button>
        <Button variant="outline" className="text-lg">Learn More</Button>
      </motion.div>
    </motion.section>
  );
}
