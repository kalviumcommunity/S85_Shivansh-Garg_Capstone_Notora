import { motion } from "framer-motion";

export default function Testimonials() {
  const quotes = [
    { name: "Alice", text: "Notora revolutionized how I study. The AI search is incredible!" },
    { name: "Bob", text: "I collaborate with classmates seamlessly. Love the secure vault feature." },
    { name: "Carol", text: "Cloud storage means I never lose my notes again." }
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#0A1B24]">
      <h2 className="text-4xl font-bold text-center text-[#9AC9DE] mb-12">What Users Say</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {quotes.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.3 }}
            className="p-6 bg-[#112E3C] rounded-2xl shadow-xl"
          >
            <p className="italic text-slate-300">“{q.text}”</p>
            <p className="mt-4 text-right font-semibold text-[#9AC9DE]">— {q.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}