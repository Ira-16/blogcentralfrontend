import { useEffect, useState, useRef } from "react";
import { Briefcase, Building2, BookOpen, Users } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: 50,
    suffix: "+",
    label: "Tech Articles",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    icon: Briefcase,
    value: 100,
    suffix: "+",
    label: "Job Openings",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: Building2,
    value: 50,
    suffix: "+",
    label: "Companies",
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "Developers",
    format: (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
];

// Counter hook for animated numbers
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  
  return count;
}

function StatItem({ stat, isVisible }) {
  const count = useCounter(stat.value, 2000, isVisible);
  const displayValue = stat.format ? stat.format(count) : count;
  
  return (
    <div className="group flex flex-col items-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all duration-300">
      <div className={`p-3 ${stat.bg} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
        <stat.icon className={`h-7 w-7 ${stat.color}`} />
      </div>
      <span className="text-3xl font-bold text-slate-900 mb-1">
        {displayValue}{stat.suffix}
      </span>
      <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Learn, Grow & Get Hired
          </h2>
          <p className="text-slate-600">
            Your complete resource for Java development and career growth
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
