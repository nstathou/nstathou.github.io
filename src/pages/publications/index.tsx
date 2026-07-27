import { IoLibrary } from "react-icons/io5";

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
import { usePageTitle } from "@/hooks/use-pagetitle";

import { publications } from "@/data/publications";

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

      // Keep YAML order when years are equal.
      return a.sourceIndex - b.sourceIndex;
    })
    .map(({ item }) => item);
}

export default function PublicationsPage() {
  usePageTitle("Publications");

  const allPublications = sortByYearThenSourceOrder(publications.items);

  return (
    <div className="flex flex-1 flex-col items-center gap-10">
      <div className="w-full max-w-6xl">
        <div className="flex flex-row justify-center items-center gap-4 text-4xl font-semibold">
          <IoLibrary />
          Publications
        </div>

        <div className="w-full px-2 sm:px-6 overflow-hidden mt-10 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Publications</h2>
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[calc(100%-70px)]">Publication</TableHead>
                  <TableHead className="w-[70px] text-right pr-2">Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPublications.map((pub, index) => (
                  <TableRow
                    key={index}
                    className={
                      pub.featured
                        ? "transition-none bg-amber-300/20 hover:bg-amber-300/28"
                        : "transition-none"
                    }
                  >
                    <TableCell
                      className={
                        pub.featured
                          ? "whitespace-normal space-y-1 bg-transparent rounded-l-2xl"
                          : "whitespace-normal space-y-1"
                      }
                    >
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-base/4 font-semibold hover:underline underline-offset-4"
                      >
                        {pub.title}
                      </a>

                      <div className="text-sm leading-4.5 text-muted-foreground mt-1">
                        {pub.authors.split(", ").map((author, i) => (
                          <span
                            key={i}
                            className={
                              author === publications.authorName ? "font-semibold" : ""
                            }
                          >
                            {author}
                            {i < pub.authors.split(", ").length - 1 && ", "}
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

                    <TableCell
                      className={
                        pub.featured
                          ? "text-sm text-right text-muted-foreground bg-transparent rounded-r-2xl pr-2"
                          : "text-sm text-right text-muted-foreground pr-2"
                      }
                    >
                      {pub.year}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </div>
    </div>
  );
}
