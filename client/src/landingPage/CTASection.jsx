import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createPageUrl } from "../utils";

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-beige-50 to-purple-50">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Start Your Wellness Journey?
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          Join thousands taking control of their mental health with MannMitra
        </p>

        <Link to={createPageUrl("Dashboard")}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-700 
                       hover:from-purple-700 hover:to-purple-800
                       text-white px-12 py-6 text-lg rounded-2xl 
                       shadow-lg hover:shadow-xl transition-all"
          >
            Begin Your Journey
            <Heart className="ml-2 h-5 w-5" fill="white" />
          </Button>
        </Link>

      </div>
    </section>
  );
}
