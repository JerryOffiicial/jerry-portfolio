import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About/>
      <Projects/>
      <BlogSection />
      <CTASection/>
    </main>
  );
}
