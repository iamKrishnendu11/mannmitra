import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function RewardsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            relative overflow-hidden
            bg-gradient-to-br from-white via-purple-100 to-white backdrop-blur-xl
            border border-black
            rounded-3xl p-12
            text-center text-white
            shadow-xl transition-all duration-300
            hover:shadow-2xl
            group
          "
        >
          {/* Grey Shine Effect */}
          <span
            className="
              pointer-events-none absolute inset-0
              bg-[linear-gradient(120deg,transparent,rgba(200,200,200,0.35),transparent)]
              translate-x-[-100%] group-hover:translate-x-[100%]
              transition-transform duration-1000
            "
          />

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Gift className="h-16 w-16 mx-auto mb-6 text-purple-600" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl font-semibold mb-4 text-gray-700"
          >
            Earn Rewards for Your Progress
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Premium members earn coins for daily logins, completing sessions,
            and maintaining their diary. Redeem coins for exclusive
            MannMitra merchandise!
          </motion.p>

          {/* Rewards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="flex flex-wrap justify-center gap-6 text-lg"
          >
            {["T-Shirts", "Journals", "Pens", "Bags"].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4 }}
                className="
                  flex items-center gap-2
                  bg-white/20 backdrop-blur-md
                  border border-black
                  px-6 py-3 rounded-full
                  text-gray-900
                  transition-all duration-300
                  hover:bg-white/30 hover:scale-105
                "
              >
                <Star className="h-5 w-5 text-purple-600" />
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
