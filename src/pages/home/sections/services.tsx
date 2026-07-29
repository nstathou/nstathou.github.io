import { useState } from "react";
import { FaUserCheck, FaRegImage } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { services } from "@/data/services";

interface ServiceSectionProps {
  variant?: string;
}

const TITLE = "Professional Services";

export default function ServicesSection({
  variant = "default",
}: ServiceSectionProps) {
  if (variant === "card") {
    return (
      <Card className="rounded-md md:px-2">
        <CardHeader>
          <CardTitle className="flex flex-row justify-center items-center gap-2 text-plus font-semibold">
            <FaUserCheck />
            {TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-center items-center gap-2 text-plus font-semibold">
        <FaUserCheck />
        {TITLE}
      </div>
      <ServicesContent />
    </div>
  );
}

function ServicesContent() {
  const [openPreview, setOpenPreview] = useState<string | null>(null);

  const togglePreview = (key: string) => {
    setOpenPreview((prev) => (prev === key ? null : key));
  };

  // group services by category
  const groupedServices = services.reduce<Record<string, typeof services>>(
    (acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      {Object.entries(groupedServices).map(([category, items]) => (
        <div key={category}>
          <div className="text-sm text-muted-foreground font-medium mb-1">
            {category}
          </div>

          {items.map((item, index) => {
            const key = `${category}-${index}`;
            const hasPreview = !!item.image;

            return (
              <div
                key={key}
                className="flex flex-col py-2 px-4 rounded-sm hover:bg-muted/80 group"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold hover:underline underline-offset-4"
                          >
                            {item.role}
                          </a>
                        ) : (
                          <span className="text-base font-semibold">
                            {item.role}
                          </span>
                        )}

                        {("subtitle" in item && typeof item.subtitle === "string") ? (
                          <span className="text-sm text-muted-foreground">
                            {item.subtitle}
                          </span>
                        ) : null}

                        {item.courses?.length ? (
                          <span className="mt-1 text-sm text-muted-foreground">
                            {item.courses.map((course, index) => (
                              <span key={`${key}-${course.name}`}>
                                {course.link ? (
                                  <a
                                    href={course.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline underline-offset-4"
                                  >
                                    {course.date
                                      ? `${course.name} (${course.date})`
                                      : course.name}
                                  </a>
                                ) : (
                                  <>{course.date ? `${course.name} (${course.date})` : course.name}</>
                                )}
                                {index < item.courses.length - 1 ? " · " : ""}
                              </span>
                            ))}
                          </span>
                        ) : null}

                        {item.master_thesis?.length ? (
                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            {item.master_thesis.map((thesis) => (
                              <div key={`${key}-${thesis.title}`}>
                                {thesis.student ? (
                                  <span className="text-foreground">{thesis.student}: </span>
                                ) : null}
                                {thesis.link ? (
                                  <a
                                    href={thesis.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline underline-offset-4"
                                  >
                                    {thesis.title}
                                  </a>
                                ) : (
                                  <>{thesis.title}</>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div
                        className={`flex items-center gap-1 ${
                          openPreview === key
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {item.link && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex flex-row items-center cursor-pointer gap-1 h-6"
                            title="Open link"
                          >
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaExternalLinkAlt />
                              <span className="hidden md:inline">Link</span>
                            </a>
                          </Button>
                        )}

                        {hasPreview && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex flex-row items-center cursor-pointer gap-1 h-6"
                            onClick={() => togglePreview(key)}
                            title="Show preview"
                          >
                            <FaRegImage />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {(item.organization || item.date) ? (
                      <div className="flex flex-row items-center justify-between gap-4 mt-1">
                        {item.organization ? (
                          <span
                            className={
                              Array.isArray(item.organization)
                                ? "text-sm text-muted-foreground"
                                : "text-base text-foreground"
                            }
                          >
                            {Array.isArray(item.organization)
                              ? item.organization.join(" · ")
                              : item.organization}
                          </span>
                        ) : <span />}

                        {item.date ? (
                          <span className="text-sm text-muted-foreground shrink-0">
                            {item.date}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {openPreview === key && hasPreview ? (
                    <img
                      src={item.image!}
                      alt={item.role}
                      className="rounded-md shadow-sm w-full h-52 object-contain bg-muted/30 md:h-36 md:w-56 md:shrink-0"
                      loading="lazy"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
