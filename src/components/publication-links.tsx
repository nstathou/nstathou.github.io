import { FaGithub, FaYoutube } from "react-icons/fa6";
import { SiArxiv, SiIeee } from "react-icons/si";

import type { Publication } from "@/types/publications";

interface PublicationLinksProps {
  publication: Pick<Publication, "links">;
}

function getLinkIcon(label: string) {
  const normalizedLabel = label.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

  if (normalizedLabel === "youtube") return FaYoutube;
  if (normalizedLabel === "git" || normalizedLabel === "github") return FaGithub;
  if (normalizedLabel === "ieee" || normalizedLabel === "ieee xplore") return SiIeee;
  if (normalizedLabel === "arxiv" || normalizedLabel === "arxivorg") return SiArxiv;

  return null;
}

export default function PublicationLinks({ publication }: PublicationLinksProps) {
  const links = publication.links ?? [];

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {links.map(({ label, url }) => {
        const Icon = getLinkIcon(label);

        return (
          <a
            key={`${label}-${url}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
            {label}
          </a>
        );
      })}
    </div>
  );
}