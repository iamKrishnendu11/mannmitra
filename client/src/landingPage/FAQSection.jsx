import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is MannMitra?",
    a: "MannMitra is an AI-powered mental wellness companion designed to support emotional health through conversations, journaling, and guided activities.",
  },
  {
    q: "Is MannMitra a replacement for a real therapist?",
    a: "No. MannMitra complements professional care but does not replace licensed therapists or medical professionals.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Your conversations and diary entries are encrypted and never shared without your consent.",
  },
  {
    q: "What do I get with the Premium plan?",
    a: "Premium includes therapist access, private diary, meditation content, wellness rewards, and exclusive tools.",
  },
  {
    q: "Can I cancel Premium anytime?",
    a: "Absolutely. You can cancel anytime without hidden charges or long-term commitments.",
  },
  {
    q: "Does MannMitra support crisis situations?",
    a: "MannMitra provides emotional support and guidance, but in emergencies, we strongly recommend contacting local helplines.",
  },
  {
    q: "Is MannMitra available 24/7?",
    a: "Yes. Our AI support is available anytime, anywhere—whenever you need to talk.",
  },
  {
    q: "How does MannMitra personalize responses?",
    a: "MannMitra adapts based on your interactions, mood patterns, and preferences while respecting privacy.",
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      <div
        onClick={() => setOpen(!open)}
        className="
          cursor-pointer 
          rounded-3xl 
          bg-white 
          p-6 
          transition-all
          shadow-[0_20px_40px_rgba(128,90,213,0.25),_0_10px_20px_rgba(0,0,0,0.1)]
          hover:shadow-[0_30px_60px_rgba(128,90,213,0.35),_0_15px_30px_rgba(0,0,0,0.15)]
        "
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 pr-6">
            {item.q}
          </h3>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="
              flex h-9 w-9 items-center justify-center 
              rounded-full 
              bg-gradient-to-br from-purple-600 to-purple-700 
              text-white
              shadow-lg
            "
          >
            {open ? <Minus size={18} /> : <Plus size={18} />}
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="mt-4 text-gray-600 leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about MannMitra and how it supports your mental well-being.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <FAQItem key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
