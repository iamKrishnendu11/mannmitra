import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  FileText,
  Users,
  BookOpen,
  Video,
  Music,
} from "lucide-react";

/* ------------------ Single Image ------------------ */
const chatbotImage = "https://slogansnest.com/wp-content/uploads/2025/06/powerful_slogans_for_world_mental_health_day_that_make_a_difference-1024x576.jpg";

const features = [
  {
    icon: MessageCircle,
    title: "AI Chatbot with Voice",
    desc: "Talk or type with our compassionate AI assistant anytime you need support.",
    className: "lg:col-span-2 lg:row-span-2",
    highlight: true,
    image: true,
  },
  {
    icon: FileText,
    title: "Mental Health Reports",
    desc: "Get personalized wellness assessments and track your progress over time.",
  },
  {
    icon: Users,
    title: "Community Support",
    desc: "Share your story and connect with others on similar journeys.",
  },
  {
    icon: BookOpen,
    title: "Private Diary",
    desc: "Express your thoughts safely in your personal digital journal.",
    premium: true,
  },
  {
    icon: Video,
    title: "Yoga & Meditation",
    desc: "Access guided classes for relaxation and mindfulness.",
    premium: true,
  },
  {
    icon: Music,
    title: "Relaxation Audio",
    desc: "Soothing sounds and meditations to calm your mind.",
    premium: true,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Everything You Need for Mental Wellness
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURE CARD ---------------- */

function FeatureCard({
  icon: Icon,
  title,
  desc,
  premium,
  highlight,
  image,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative group ${className}`}
    >
      <Card
        className={`
          relative h-full overflow-hidden rounded-3xl
          bg-white/90 backdrop-blur-xl border
          p-8 transition-all duration-300
          hover:shadow-2xl
          ${highlight ? "border-purple-400" : "border-gray/90"}
        `}
      >
        {/* Grey Shine Effect */}
        <span
          className="pointer-events-none absolute inset-0
          bg-[linear-gradient(120deg,transparent,rgba(180,180,180,0.35),transparent)]
          translate-x-[-100%] group-hover:translate-x-[100%]
          transition-transform duration-1000"
        />

        {/* Premium Badge */}
        {premium && (
          <span className="absolute top-5 right-5 z-10 text-xs px-3 py-1 rounded-full
            bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            Premium
          </span>
        )}

        {/* Icon */}
        <Icon className="h-8 w-8 text-purple-600 mb-1" />

        {/* Text */}
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md">{desc}</p>

        {/* Single Image */}
        {image && (
          <div className="mt-1 w-full h-[90%] overflow-hidden rounded-xl shadow-md">
            <img
              src={chatbotImage}
              alt="AI Chatbot"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Highlight strip */}
        {highlight && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        )}
      </Card>
    </motion.div>
  );
}
