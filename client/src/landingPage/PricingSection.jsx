import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect,useRef,useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UpgradeButtonInstant from "@/components/UpgradeButtonInstant";

/* ---------------- PRICE ANIMATION ---------------- */

function AnimatedPrice({ value }) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const price = useMotionValue(0);
  const rounded = useTransform(price, (v) => Math.round(v));

  useEffect(() => {
    if (!hasAnimated) return;

    const controls = animate(price, value, {
      duration: 1.6,
      ease: "easeOut",
      delay: 0.15,
    });

    return controls.stop;
  }, [hasAnimated, value]);

  return (
    <motion.span
      ref={ref}
      onViewportEnter={() => setHasAnimated(true)}
      viewport={{ once: true }}
    >
      {rounded}
    </motion.span>
  );
}

/* ---------------- PLAN CARD ---------------- */

function PlanCard({
  title,
  price,
  features,
  highlight,
  user,
  progress,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className={`
          relative p-8 rounded-3xl overflow-hidden transition-all
          ${highlight
            ? "border-4 border-purple-300 bg-gradient-to-br from-purple-50 to-white"
            : "border border-gray-200 bg-white"}
        `}
      >
        {/* Shine */}
        {highlight && (
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.6),transparent)]"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Badge */}
        {highlight && (
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium"
          >
            Most Popular
          </motion.div>
        )}

        <div className="relative z-10 mb-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-purple-700">
              ₹
              {highlight ? (
                <AnimatedPrice value={price} />
              ) : (
                price
              )}
            </span>
            <span className="text-gray-600">/30 days</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8 relative z-10">
          {features.map((item, i) => (
            <li key={i} className="flex gap-3">
              <Check className="h-5 w-5 text-purple-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="relative z-10">
          {highlight ? (
            user && progress?.subscription_status === "premium" ? (
              <Link to="/dashboard">
                <Button className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                  🎉 Welcome to Premium
                </Button>
              </Link>
            ) : (
              <UpgradeButtonInstant className="w-full py-6 rounded-2xl" />
            )
          ) : (
            <Button
              variant="outline"
              className="w-full py-6 rounded-2xl"
              disabled
            >
              Current Plan
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------------- SECTION ---------------- */

export default function PricingSection({ user, progress }) {
  return (
    <section className="py-24 bg-white">
        <div className="pt-20" />
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Pricing Plans
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <PlanCard
            title="Free"
            price={0}
            features={[
              "Basic chatbot access",
              "Community support",
              "Limited diary entries",
            ]}
          />

          <PlanCard
            title="Premium"
            price={449}
            highlight
            user={user}
            progress={progress}
            features={[
              "Everything in Free",
              "Personal therapist access",
              "Private digital diary",
              "Relaxation audio library",
              "Yoga & meditation classes",
              "Earn coins for activities",
              "Redeem rewards (merch)",
            ]}
          />

        </div>

      </div>
    </section>
  );
}
