import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FeaturedArticles from "@/components/FeaturedArticles";
import LatestPosts from "@/components/LatestPosts";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedArticles />
      <LatestPosts limit={6} />
    </>
  );
}

