import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { BlogSection } from "@/components/BlogSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About/>
      <Projects/>
      <BlogSection />
      
      <section id="contact" className="flex min-h-[100vh] w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-24">
         <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Contact Section</h2>
          <p className="text-xl text-foreground/70">Coming soon.</p>
        </div>
      </section>
    </main>
  );
}
