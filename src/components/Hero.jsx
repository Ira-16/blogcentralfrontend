import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import robotImage from "@/assets/toppng.com-robot-png-686x717.png";

export default function Hero() {
  const navigate = useNavigate();

  const stats = [
    { value: "500+", label: "Articles" },
    { value: "50+", label: "Companies" },
    { value: "150+", label: "Jobs Posted" },
    { value: "1000+", label: "Developers" },
  ];

  return (
    <section className="bg-[#e8e8e8] min-h-[650px] relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16 h-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3">
              <span className="bg-[#1a1a2e] text-white text-sm px-4 py-2 rounded-full font-medium">
                1000+ developers joined today
              </span>
              <button 
                onClick={() => {
                  document.getElementById('email-subscription')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className="text-[#1a1a2e] font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Join now <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight">
              Master Java,
              <br />
              Build Your
              <br />
              <span className="text-[#1a1a2e]">Future Career</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg max-w-md leading-relaxed">
              Your one-stop destination for Java tutorials, Spring Boot guides, 
              and career opportunities. Learn, grow, and land your dream 
              developer job in Belgium & EU.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/posts")}
                className="bg-white text-[#1a1a2e] hover:bg-gray-100 border border-gray-300 rounded-full h-12 px-8 font-medium group"
              >
                Get started
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/jobs")}
                className="bg-[#1a1a2e] text-white hover:bg-[#2a2a3e] rounded-full h-12 px-8 font-medium"
              >
                Browse Jobs
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-300">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image - Anchored to bottom */}
          <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
            <div className="relative h-full flex items-end justify-center">
              <img
                src={robotImage}
                alt="Robot Developer"
                className="w-auto h-[90%] max-h-[600px] object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
