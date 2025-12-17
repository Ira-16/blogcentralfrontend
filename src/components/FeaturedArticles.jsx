import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, ImageIcon } from "lucide-react";

const featuredTopics = [
  {
    title: "Java Fundamentals",
    author: "William Ashford",
    description: "Master the core concepts of Java programming - syntax, data types, loops, and more.",
    tag: "Beginner",
    readTime: "5 min read",
    date: "Mar 09, 2024",
  },
  {
    title: "OOP Concepts",
    author: "Sarah Chen",
    description: "Deep dive into Object-Oriented Programming - classes, inheritance, polymorphism.",
    tag: "Core",
    readTime: "8 min read",
    date: "Mar 12, 2024",
  },
  {
    title: "Spring Boot",
    author: "Michael Brown",
    description: "Build production-ready applications with Spring Boot framework and best practices.",
    tag: "Framework",
    readTime: "10 min read",
    date: "Mar 15, 2024",
  },
  {
    title: "JPA & Hibernate",
    author: "Emma Wilson",
    description: "Learn database persistence with JPA, Hibernate ORM, and entity relationships.",
    tag: "Database",
    readTime: "7 min read",
    date: "Mar 18, 2024",
  },
  {
    title: "Testing",
    author: "David Lee",
    description: "Write robust tests with JUnit, Mockito, and test-driven development practices.",
    tag: "Quality",
    readTime: "6 min read",
    date: "Mar 20, 2024",
  },
  {
    title: "REST APIs",
    author: "Anna Martinez",
    description: "Connect frontend and backend with RESTful APIs, JSON, and HTTP protocols.",
    tag: "Integration",
    readTime: "9 min read",
    date: "Mar 22, 2024",
  },
];

export default function FeaturedArticles() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Featured Topics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Learn Java Development
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive tutorials and guides to help you become a professional Java developer
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTopics.map((topic, index) => (
            <Link
              key={index}
              to="/"
              className="group block"
            >
              <div className="bg-slate-100/80 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                {/* Image Placeholder */}
                <div className="bg-white rounded-xl aspect-[16/10] flex items-center justify-center mb-4">
                  <ImageIcon className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
                </div>

                {/* Author & Read Time */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <span className="text-indigo-600 font-medium">{topic.author}</span>
                  <span className="text-slate-300">•</span>
                  <span>{topic.readTime}</span>
                </div>

                {/* Title with Arrow */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {topic.description}
                </p>

                {/* Tag & Date */}
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-slate-200/80 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
                    {topic.tag}
                  </span>
                  <span className="text-sm text-slate-400">
                    {topic.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
