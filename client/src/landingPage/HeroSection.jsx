// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { createPageUrl } from "../utils";

// export default function HeroSection() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-white to-beige-100 py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto text-center">

//         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200 mb-6">
//           <Sparkles className="h-4 w-4 text-purple-600" />
//           <span className="text-sm font-medium text-purple-700">
//             Your Mental Wellness Companion
//           </span>
//         </div>

//         <div className="text-center">

//         {/* Heading */}
//         <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight"
//         >
//             Welcome to
//             <motion.span
//             className="block mt-3 bg-gradient-to-r from-purple-600 to-purple-800 
//                         bg-[length:200%_200%] bg-clip-text text-transparent"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             >
//             {"MannMitra".split("").map((char, i) => (
//                 <motion.span
//                 key={i}
//                 className="inline-block"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{
//                     delay: 0.4 + i * 0.25,
//                     duration: 1.75,
//                     ease: "easeOut",
//                 }}
//                 >
//                 {char}
//                 </motion.span>
//             ))}
//             </motion.span>
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.1, duration: 0.6 }}
//             className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
//         >
//             Your journey to mental wellness starts here.  
//             Get personalized support, connect with a caring community,  
//             and discover tools that help you thrive.
//         </motion.p>

//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link to={createPageUrl("Dashboard")}>
//             <Button size="lg" className="rounded-2xl px-8 py-6 bg-purple-600 
//                                        hover:bg-purple-700 text-white 
//                                        shadow-lg hover:shadow-xl transition-all">
//               Get Started<ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>

//           <Link to={createPageUrl("Chatbot")}>
//             <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6">
//               Try Chatbot <MessageCircle className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }




import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { createPageUrl } from "../utils";
import { useEffect, useRef, useState } from "react";

/* 8 IMAGES (TEMP – replace later) */
const images = [
  "https://images.unsplash.com/photo-1559757175-5700dde675bc",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
  "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
];

export default function HeroSection() {
  const [phase, setPhase] = useState("center"); 
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  /* Reset animation when user scrolls back to top */
  useEffect(() => {
    return scrollY.on("change", (y) => {
      if (y < 40) {
        setPhase("center");
        setTimeout(() => setPhase("split"), 600);
        setTimeout(() => setPhase("marquee"), 1600);
      }
    });
  }, [scrollY]);

  /* Initial load */
  useEffect(() => {
    setTimeout(() => setPhase("split"), 600);
    setTimeout(() => setPhase("marquee"), 1600);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-white"
    >

      {/* ================= TEXT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto pt-15 text-center px-4">

        <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
  className="font-extrabold text-gray-900 mb-6"
>
  <span className="block text-6xl sm:text-7xl lg:text-9xl">
    Welcome to
  </span>

  <span className="block mt-3 text-5xl sm:text-6xl lg:text-8xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
    MannMitra
  </span>
</motion.h1>



        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
        >
          Your journey to mental wellness starts here.Get personalized support, connect with a caring community,and discover tools that help you thrive.
        </motion.p>

        <div className="flex justify-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <Button size="lg" className="rounded-2xl px-8 py-6 bg-purple-600 text-white">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to={createPageUrl("Chatbot")}>
            <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6">
              Try Chatbot <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div className="absolute pt-10 bottom-10 w-full overflow-hidden">
        <motion.div
          className="flex gap-8 justify-center"
          animate={
            phase === "center"
              ? { x: 180 }
              : phase === "split"
              ? { x: 0 }
              : { x: ["+80%", "-80%"] }
          }
          transition={
            phase === "marquee"
              ? {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 28,
                }
              : { duration: 2.2, ease: "easeInOut" }
          }
        >
          {[...images, ...images].map((src, i) => {
            const offset =
              phase === "center"
                ? 0
                : phase === "split"
                ? i < images.length / 2
                  ? -180
                  : 180
                : 0;

            return (
              <motion.div
                key={i}
                animate={{
                  x: offset,
                  rotate: i % 2 === 0 ? -3 : 3,
                }}
                className="
                  min-w-[320px]
                  h-[210px]
                  rounded-2xl
                  overflow-hidden
                  bg-white/40
                  backdrop-blur-xl
                  border border-white/50
                  shadow-xl
                "
                whileHover={{ scale: 1.45 }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
