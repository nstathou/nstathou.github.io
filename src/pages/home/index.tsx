import { usePageTitle } from "@/hooks/use-pagetitle";

import IntroductionSection from "./sections/introduction";
import ExperienceSection from "./sections/experience";
import LatestNewsSection from "./sections/latest-news";
import PublicationsSection from "./sections/publications";
import ProjectsSection from "./sections/projects";
import TalksSection from "./sections/talks";
import ServicesSection from "./sections/services";
import SkillsSection from "./sections/skills";
import AwardsGrantsSection from "./sections/awards-grants";

import { homepage } from "@/data/homepage";

interface SectionProps {
  variant?: string;
}

const sectionComponents: Record<string, React.ComponentType<SectionProps>> = {
  Introduction: IntroductionSection,
  Experience: ExperienceSection,
  LatestNews: LatestNewsSection,
  Publications: PublicationsSection,
  Projects: ProjectsSection,
  Talks: TalksSection,
  Services: ServicesSection,
  Skills: SkillsSection,
  AwardsGrants: AwardsGrantsSection,
};

const toSectionId = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export default function HomePage() {
  usePageTitle("About Me");

  return (
    <div className="flex flex-1 flex-col items-center gap-24 my-4">
      {homepage.sections.map((section) => {
        if (!section.enabled) return null;
        const SectionComponent = sectionComponents[section.name];
        return (
          <div
            id={toSectionId(section.name)}
            key={section.name}
            className="w-full max-w-5xl px-2 md:px-8"
          >
            <SectionComponent variant={section.variant} />
          </div>
        );
      })}
    </div>
  );
}
