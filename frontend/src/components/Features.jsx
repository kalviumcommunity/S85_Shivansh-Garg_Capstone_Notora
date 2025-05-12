import { motion } from "framer-motion";
import { Database, Search, Users, Lock } from "lucide-react";

export default function Features() {
  const items = [
    { icon: <Database size={32} />, title: "Cloud Storage", desc: "Access notes anywhere, anytime." },
    { icon: <Search size={32} />, title: "AI Search", desc: "Find key topics instantly with AI-powered search." },
    { icon: <Users size={32} />, title: "Collaboration", desc: "Share and co-edit notes with peers." },
    { icon: <Lock size={32} />, title: "Secure Vault", desc: "Your notes are encrypted and private." }
  ];

  return (
    <section
      id="features"
      className="py-24 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2, duration: 0.7 }}
          className="p-8 bg-[#112E3C] rounded-3xl shadow-2xl flex flex-col items-center text-center"
        >
          <div className="mb-4 text-[#9AC9DE]">{item.icon}</div>
          <h3 className="text-2xl font-semibold mb-2 text-white">{item.title}</h3>
          <p className="text-slate-400">{item.desc}</p>
        </motion.div>
      ))}
    </section>
  );
}