import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { ArrowRight, Briefcase, BookOpen, Code2, Sparkles } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/75" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">
              Learn Java & Find Your Dream Job
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Master Java,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Build Your Future
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Your one-stop destination for <strong className="text-white">Java tutorials</strong>, 
            <strong className="text-white"> Spring Boot guides</strong>, and 
            <strong className="text-white"> career opportunities</strong>. 
            Learn, grow, and land your dream developer job in Belgium & EU.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white group h-12 px-6"
            >
              <BookOpen className="h-5 w-5" />
              Read Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              onClick={() => {
                document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-indigo-600 hover:bg-slate-100 h-12 px-6 font-semibold"
            >
              <Briefcase className="h-5 w-5" />
              Browse Jobs
            </Button>
            {token && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/create")}
                className="border-white/30 text-white hover:bg-white/10 h-12 px-6"
              >
                <Code2 className="h-5 w-5" />
                Write Article
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
