import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import {
  Mail,
  Instagram,
  Youtube,
  Linkedin,
  Send,
} from "lucide-react";

export default function ContactSection() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",     // 🔹 replace
        "YOUR_TEMPLATE_ID",    // 🔹 replace
        formRef.current,
        "YOUR_PUBLIC_KEY"      // 🔹 replace
      )
      .then(
        () => {
          setSuccess(true);
          setLoading(false);
          formRef.current.reset();
        },
        () => {
          setLoading(false);
        }
      );
  };

  return (
    <section className="py-28 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Let’s Connect 💜
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-lg">
            Have questions, feedback, or just want to talk?  
            MannMitra is always here to listen.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-5">
            {[
              { icon: Mail, link: "mailto:support@mannmitra.ai" },
              { icon: Instagram, link: "#" },
              { icon: Youtube, link: "#" },
              { icon: Linkedin, link: "#" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                whileHover={{ scale: 1.15, y: -4 }}
                className="
                  h-12 w-12 rounded-full 
                  bg-gradient-to-br from-purple-600 to-purple-700
                  flex items-center justify-center text-white
                  shadow-[0_15px_30px_rgba(128,90,213,0.4)]
                "
              >
                <item.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-white rounded-3xl p-10
            shadow-[0_30px_70px_rgba(128,90,213,0.35)]
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              name="name"
              required
              placeholder="Your Name"
              className="input"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              className="input"
            />
          </div>

          <input
            name="subject"
            required
            placeholder="Subject"
            className="input mb-6"
          />

          <textarea
            name="message"
            rows="5"
            required
            placeholder="Tell us what's on your mind..."
            className="input mb-8 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-5 rounded-2xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-purple-700
              shadow-[0_20px_40px_rgba(128,90,213,0.4)]
              flex items-center justify-center gap-3
              hover:scale-[1.02] transition
            "
          >
            {loading ? "Sending..." : "Send Message"}
            <Send size={18} />
          </button>

          {success && (
            <p className="text-green-600 text-center mt-4">
              Message sent successfully 💜
            </p>
          )}
        </motion.form>
      </div>

      {/* INPUT STYLES */}
      <style>{`
        .input {
          width: 100%;
          padding: 1rem 1.2rem;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          outline: none;
          transition: all 0.3s;
        }
        .input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
      `}</style>
    </section>
  );
}
