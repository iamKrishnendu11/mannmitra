import { motion } from "framer-motion";
import { Star } from "lucide-react";

/* ---------------- DATA ---------------- */

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    message:
      "MannMitra helped me manage stress during tough workdays. It genuinely feels like a companion.",
    rating: 5,
  },
  {
    name: "Rohit Verma",
    role: "Startup Founder",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    message:
      "The daily reflections and therapist access made a real difference in my mental clarity.",
    rating: 5,
  },
  {
    name: "Sneha Iyer",
    role: "UI/UX Designer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    message:
      "Clean design, calming experience, and meaningful conversations. MannMitra is beautifully built.",
    rating: 4,
  },
  {
    name: "Aman Gupta",
    role: "MBA Student",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a",
    message:
      "From anxiety tracking to guided relaxation, everything feels personal and safe.",
    rating: 5,
  },
  {
    name: "Pooja Nair",
    role: "HR Manager",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
    message:
      "This platform helped me build emotional balance during high-pressure work phases.",
    rating: 4,
  },
];

/* ---------------- CARD ---------------- */

function TestimonialCard({ t }) {
  return (
    <div className="w-[380px] shrink-0 mx-4">
      <div
        className="
          bg-white/70 backdrop-blur-xl 
          border border-purple-100 
          rounded-3xl p-6
          shadow-[0_25px_60px_-15px_rgba(124,58,237,0.35)]
          hover:shadow-[0_35px_80px_-15px_rgba(124,58,237,0.45)]
          transition-all
        "
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={t.image}
            alt={t.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-400"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{t.name}</h4>
            <p className="text-sm text-gray-600">{t.role}</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          “{t.message}”
        </p>

        <div className="flex gap-1">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-purple-600 text-purple-600"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MARQUEE ---------------- */

function InfiniteRow({ reverse = false }) {
  return (
    <motion.div
      className="flex w-max"
      animate={{
        x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
      }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 30,
      }}
    >
      {[...testimonials, ...testimonials].map((t, i) => (
        <TestimonialCard key={i} t={t} />
      ))}
    </motion.div>
  );
}

/* ---------------- SECTION ---------------- */

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-14 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What People Say About
          <span className="block bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            MannMitra
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real stories from people who found calm, clarity, and emotional
          strength through MannMitra.
        </p>
      </div>

      {/* Top Row */}
      <div className="relative mb-10">
        <InfiniteRow />
      </div>

      {/* Bottom Row */}
      <div className="relative">
        <InfiniteRow reverse />
      </div>
    </section>
  );
}
