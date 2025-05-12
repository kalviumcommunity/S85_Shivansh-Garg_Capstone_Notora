import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 140 }}
      className="fixed w-full top-0 z-40 bg-black bg-opacity-60 backdrop-blur-md px-8 py-4 flex justify-between items-center"
    >
      <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#6DD5FA] to-[#2980B9]">
        Notora
      </div>
      <div className="hidden md:flex space-x-10 text-lg text-slate-200">
        <a href="#features" className="hover:text-white transition">Features</a>
        <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
        <a href="#about" className="hover:text-white transition">About</a>
        <a href="#contact" className="hover:text-white transition">Contact</a>
      </div>
      <div className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X size={28} className="text-slate-200" /> : <Menu size={28} className="text-slate-200" />}
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 w-full bg-black bg-opacity-80 flex flex-col items-center py-6 space-y-4"
        >
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#testimonials" onClick={() => setOpen(false)}>Testimonials</a>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </motion.div>
      )}
    </motion.nav>
  );
}