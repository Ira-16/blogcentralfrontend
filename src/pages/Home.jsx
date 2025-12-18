import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FeaturedArticles from "@/components/FeaturedArticles";
import FeaturedJobs from "@/components/FeaturedJobs";
import EmailSubscription from "@/components/EmailSubscription";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedArticles limit={6} />
      <FeaturedJobs limit={4} />
      <EmailSubscription />
    </>
  );
}

