import { useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaRegCalendar } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { latestNews } from "@/data/latestNews";

interface LatestNewsSectionProps {
  variant?: string;
}

const TITLE = "Latest News";
const DEFAULT_VISIBLE_NEWS = 3;

function dateBadgeLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 8).toUpperCase();
  }

  const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

function rightSideYearLabel(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return String(parsed.getFullYear());
  }

  const yearMatch = value.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : value;
}

export default function LatestNewsSection({
  variant: _variant = "default",
}: LatestNewsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleNews = useMemo(() => {
    if (expanded) return latestNews;
    return latestNews.slice(0, DEFAULT_VISIBLE_NEWS);
  }, [expanded]);

  const hasMore = latestNews.length > DEFAULT_VISIBLE_NEWS;

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-center items-center gap-2 text-plus font-semibold">
        <FaRegCalendar />
        {TITLE}
      </div>

      <div className="space-y-1">
        {visibleNews.map((item, index) => (
          <a
            key={`${item.title}-${index}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 rounded-sm px-4 py-2 hover:bg-muted/80"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-7 min-w-16 items-center justify-center rounded-full border border-border/80 px-2 text-xs font-semibold text-muted-foreground">
                {dateBadgeLabel(item.date)}
              </span>
              <span className="whitespace-normal break-words text-sm leading-5 font-medium group-hover:underline underline-offset-4">
                {item.title}
              </span>
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {rightSideYearLabel(item.date)}
            </span>
          </a>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                <FaArrowUp />
                Show less
              </>
            ) : (
              <>
                <FaArrowDown />
                Show more
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}