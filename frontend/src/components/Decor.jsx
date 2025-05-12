import { motion } from "framer-motion";

// Abstract SVG blobs for decorative background
export function Blobs() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg className="absolute top-[-20%] left-[-30%] w-[120%] h-[120%]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#blur1)">
          <path d="M300,100 C400,50 550,150 500,300 C450,450 250,450 200,300 C150,150 200,150 300,100Z" fill="rgba(154,201,222,0.3)" />
        </g>
        <defs>
          <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
      </svg>
      <svg className="absolute bottom-[-25%] right-[-25%] w-[110%] h-[110%]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#blur2)">
          <path d="M300,150 C380,100 520,200 480,330 C440,460 260,460 220,330 C180,200 220,200 300,150Z" fill="rgba(109,213,250,0.25)" />
        </g>
        <defs>
          <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="100" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}