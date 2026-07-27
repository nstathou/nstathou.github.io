import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import { IoLibrary } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PublicationLinks from "@/components/publication-links";
import PublicationVenue from "@/components/publication-venue";

import { publicationsFeatured } from "@/data/publications.featured";

function getYearValue(year: number | string) {
  const parsedYear = Number(year);
  return Number.isFinite(parsedYear) ? parsedYear : -Infinity;
}

function sortByYearThenSourceOrder<T extends { year: number | string }>(
  items: T[],
) {
  return items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .sort((a, b) => {
      const yearDiff = getYearValue(b.item.year) - getYearValue(a.item.year);
      if (yearDiff !== 0) return yearDiff;

      return a.sourceIndex - b.sourceIndex;
    })
    .map(({ item }) => item);
}

function normalizeAuthor(author: string) {
  return author.replace(/<[^>]*>/g, "").trim();
}

function splitAuthors(authors: string) {
  return authors
    .replace(/<[^>]*>/g, "")
    .split(/,\s*|\s+and\s+|;\s*/)
    .map((author) => author.trim())
    .filter(Boolean);
}

export default function PublicationsSection() {
  const featuredByYear = sortByYearThenSourceOrder(publicationsFeatured.items);

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-center items-center gap-2 text-plus font-semibold">
        <IoLibrary />
        Featured Publications
      </div>

      <div className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[calc(100%-50px)]">Publication</TableHead>
              <TableHead className="w-[46px] text-right">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featuredByYear.map((pub, index) => (
              <TableRow key={index} className="transition-none">
                <TableCell className="whitespace-normal space-y-1">
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-base/4 font-semibold hover:underline underline-offset-4"
                  >
                    {pub.title}
                  </a>

                  <div className="text-sm leading-4.5 text-muted-foreground mt-1">
                    {splitAuthors(pub.authors).map((author, i, authors) => (
                      <span
                        key={i}
                        className={
                          normalizeAuthor(author) ===
                          publicationsFeatured.authorName
                            ? "font-semibold"
                            : ""
                        }
                      >
                        {author}
                        {i < authors.length - 1 && ", "}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm italic leading-4.5 text-muted-foreground">
                    <PublicationVenue venue={pub.venue} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <PublicationLinks publication={pub} />
                    {pub.comment ? (
                      <div className="ml-auto text-right text-sm leading-4.5 font-semibold text-muted-foreground">
                        {pub.comment}
                      </div>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="text-sm text-right text-muted-foreground">
                  {pub.year}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="relative w-full">
        <div className="absolute right-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
            <Link to="/publications">
              View all
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
