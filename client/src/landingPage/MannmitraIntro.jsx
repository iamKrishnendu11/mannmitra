import { ScrollReveal } from "@/components/lightswind/scroll-reveal";

export default function MannmitraIntro() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">

        <ScrollReveal
          size="xl"
          align="center"
          staggerDelay={0.08}
          springConfig={{
            damping: 18,
            stiffness: 180,
            mass: 0.6,
          }}
        >
          MannMitra
        </ScrollReveal>

        <ScrollReveal
          size="lg"
          align="center"
          baseOpacity={0.05}
          enableBlur={true}
          blurStrength={6}
          staggerDelay={0.06}
          className="max-w-3xl mx-auto"
        >
          MannMitra gently supports your mental well-being through compassionate
          conversations, mindful reflections, and emotional guidance — helping
          you feel heard, understood, and stronger every day.
        </ScrollReveal>

        <ScrollReveal
          align="center"
          baseOpacity={0.1}
          staggerDelay={0.05}
          textClassName="text-gray-600"
        >
          Your safe space for healing, growth, and self-discovery.
        </ScrollReveal>

      </div>
    </section>
  );
}
