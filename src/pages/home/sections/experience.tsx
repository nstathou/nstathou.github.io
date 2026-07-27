import { FaGraduationCap, FaBriefcase } from "react-icons/fa6";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { education } from "@/data/education";
import { workExperience } from "@/data/workExperience";

const LINKED_TITLE_LABELS = ["EISLAB", "RAI Group"];
const LINKED_COMPANY_LABELS = ["SAPHAI AB"];
const LINKED_EDUCATION_LABELS = ["RAI Group"];

function shouldLinkCompany(company: string, groupUrl?: string) {
  return !!groupUrl && LINKED_COMPANY_LABELS.some((label) => company.includes(label));
}

function renderLinkedJobTitle(title: string, groupUrl?: string) {
  if (!groupUrl) return title;

  const label = LINKED_TITLE_LABELS.find((candidate) =>
    title.includes(candidate),
  );

  if (!label) return title;

  const startIndex = title.indexOf(label);
  const before = title.slice(0, startIndex);
  const after = title.slice(startIndex + label.length);

  return (
    <>
      {before}
      <a
        href={groupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {label}
      </a>
      {after}
    </>
  );
}

function renderLinkedEducationDegree(degree: string, groupUrl?: string) {
  if (!groupUrl) return degree;

  const label = LINKED_EDUCATION_LABELS.find((candidate) =>
    degree.includes(candidate),
  );

  if (!label) return degree;

  const startIndex = degree.indexOf(label);
  const before = degree.slice(0, startIndex);
  const after = degree.slice(startIndex + label.length);

  return (
    <>
      {before}
      <a
        href={groupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {label}
      </a>
      {after}
    </>
  );
}

export default function ExperienceSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="rounded-md md:px-2">
        <CardHeader>
          <CardTitle className="flex flex-row justify-center items-center gap-2 text-plus">
            <FaGraduationCap />
            Education
          </CardTitle>
        </CardHeader>
        <ScrollArea className="max-h-96">
          <CardContent className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={edu.logo}
                  alt={`${edu.school} logo`}
                  className="w-12 h-12 object-contain rounded"
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold">{edu.school}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.years}
                  </div>
                  <div className="text-sm">
                    {renderLinkedEducationDegree(
                      edu.degree,
                      "groupUrl" in edu ? edu.groupUrl : undefined,
                    )}
                  </div>
                  {"supervisor" in edu && edu.supervisor ? (
                    <div className="text-sm text-muted-foreground">
                      Supervisor:{" "}
                      {"supervisorUrl" in edu && edu.supervisorUrl ? (
                        <a
                          href={edu.supervisorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {edu.supervisor}
                        </a>
                      ) : (
                        edu.supervisor
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="rounded-md md:px-2">
        <CardHeader>
          <CardTitle className="flex flex-row justify-center items-center gap-2 text-plus">
            <FaBriefcase />
            Work Experiences
          </CardTitle>
        </CardHeader>
        <ScrollArea className="max-h-96">
          <CardContent className="space-y-4">
            {workExperience.map((job, index) => (
              <div key={index} className="flex items-center gap-4">
                {"logoDark" in job && job.logoDark ? (
                  <>
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-12 h-12 object-contain rounded dark:hidden"
                      loading="lazy"
                    />
                    <img
                      src={job.logoDark}
                      alt={`${job.company} logo`}
                      className="hidden w-12 h-12 object-contain rounded dark:block"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 object-contain rounded"
                    loading="lazy"
                  />
                )}
                <div>
                  <div className="font-semibold">
                    {shouldLinkCompany(job.company, job.groupUrl) ? (
                      <a
                        href={job.groupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {job.years}
                  </div>
                  <div className="text-sm">
                    {renderLinkedJobTitle(job.title, job.groupUrl)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
