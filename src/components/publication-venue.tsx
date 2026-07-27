const EMPHASIZED_VENUE_TAGS = new Set([
  "IROS",
  "ICRA",
  "RA-L",
  "T-FR",
  "T-RO",
  "JFR",
]);

interface PublicationVenueProps {
  venue: string;
}

export default function PublicationVenue({ venue }: PublicationVenueProps) {
  const parts = venue.split(/(\([^)]*\))/g);

  return (
    <>
      {parts.map((part, index) => {
        const isParenthesized = part.startsWith("(") && part.endsWith(")");

        if (!isParenthesized) {
          return <span key={`${index}-${part}`}>{part}</span>;
        }

        const tag = part.slice(1, -1).trim().toUpperCase();

        if (EMPHASIZED_VENUE_TAGS.has(tag)) {
          return (
            <strong key={`${index}-${part}`} className="font-semibold">
              {part}
            </strong>
          );
        }

        return <span key={`${index}-${part}`}>{part}</span>;
      })}
    </>
  );
}
