import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function CTA() {
  return (
    <motion.section
      id="about"
      className="py-20 flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-4xl font-bold text-[#9AC9DE] mb-4">Ready to Elevate Your Notes?</h2>
      <p className="mb-6 max-w-md text-slate-400">
        Sign up now and join thousands of students experiencing the next-gen note-taking platform.
      </p>
      <Button className="mb-4">Sign Up Free</Button>
      <Button variant="outline">See Pricing</Button>
    </motion.section>
  );
}
