import { PageBackground } from "@/components/backgrounds/page-background";
import { Clock } from "@/components/Clock";
import { ScrollBlur } from "@/components/ScrollBlur";
import { SidebarNav } from "@/components/SidebarNav";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Home } from "@/components/sections/Home";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { AnimatedFooter } from "@/components/ui/AnimatedFooter";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <PageBackground />
      <SidebarNav />
      <div className="relative z-10">
        <Home />
        <About />
        <Projects />
        <TechStack />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
        <div className="h-[70vh] min-h-[420px]">
          <AnimatedFooter headingLines={["Melvin works"]} />
        </div>
      </div>
      <ScrollBlur />
      <Clock />
    </main>
  );
}
