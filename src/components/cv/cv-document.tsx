import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { ContactKind, CvDocument } from "@/lib/cv/types";
import { sortEducation, sortExperience } from "@/lib/cv/types";
import { RichText } from "./rich-text";
import { SkillDots } from "./skill-dots";

const CONTACT_ICONS: Record<ContactKind, LucideIcon> = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  location: MapPin,
  website: Globe,
  github: Github,
};

export function CvDocumentView({ cv }: { cv: CvDocument }) {
  const jobs = sortExperience(cv.experience);
  const schools = sortEducation(cv.education);
  const contacts = cv.contacts.filter((c) => c.value.trim());

  return (
    <>
      <aside className="cv-sidebar">
        <div>
          <h2 className="cv-sidebar-title">{cv.labels.skills}</h2>
          {cv.skillGroups.map((group) => (
            <div key={group.id} className="cv-group">
              <h3 className="cv-group-title">{group.name}</h3>
              {group.skills.map((skill) => (
                <div key={skill.id} className="cv-skill">
                  <span className="cv-skill-name">{skill.name}</span>
                  <SkillDots level={skill.level} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cv-contact">
          <h2 className="cv-sidebar-title">{cv.labels.contact}</h2>
          <div className="cv-contact-list">
            {contacts.map((item) => {
              const Icon = CONTACT_ICONS[item.kind];
              return (
                <div key={item.id} className="cv-contact-row">
                  <Icon className="cv-contact-icon" strokeWidth={2} />
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
      <section className="cv-main">
        <h1 className="cv-name">{cv.name}</h1>
        {cv.title.trim() ? <p className="cv-role">{cv.title}</p> : null}
        {cv.introHeading.trim() ? (
          <h2 className="cv-intro-title">{cv.introHeading}</h2>
        ) : null}
        {cv.intro.trim() ? <RichText text={cv.intro} className="cv-intro" /> : null}

        {jobs.length > 0 ? (
          <>
            <h2 className="cv-section-title">{cv.labels.experience}</h2>
            <ol className="cv-timeline">
              {jobs.map((job) => (
                <li key={job.id} className="cv-job">
                  <span className="cv-job-mark" />
                  <p className="cv-job-dates">
                    {job.from} – {job.current ? "Present" : job.to}
                  </p>
                  <p className="cv-job-company">{job.company}</p>
                  <p className="cv-job-meta">
                    {[job.role, job.location].filter(Boolean).join(", ")}
                  </p>
                  {job.description.trim() ? (
                    <RichText text={job.description} className="cv-copy" />
                  ) : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        {schools.length > 0 ? (
          <>
            <h2 className="cv-section-title">{cv.labels.education}</h2>
            <ol className="cv-timeline">
              {schools.map((edu) => (
                <li key={edu.id} className="cv-edu">
                  <span className="cv-edu-mark" />
                  <p className="cv-edu-dates">
                    {edu.from}
                    {edu.to ? ` – ${edu.to}` : ""}
                  </p>
                  <p className="cv-edu-degree">{edu.degree}</p>
                  <p className="cv-edu-school">{edu.school}</p>
                  {edu.details.trim() ? (
                    <RichText text={edu.details} className="cv-copy" />
                  ) : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </section>
    </>
  );
}
