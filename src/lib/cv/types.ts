export const CONTACT_KINDS = [
  "email",
  "phone",
  "linkedin",
  "location",
  "website",
  "github",
] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number];

export type ContactItem = {
  id: string;
  kind: ContactKind;
  value: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
};

export type SkillGroup = {
  id: string;
  name: string;
  skills: Skill[];
};

export type Experience = {
  id: string;
  from: string;
  to: string;
  current: boolean;
  company: string;
  role: string;
  location: string;
  description: string;
};

export type Education = {
  id: string;
  from: string;
  to: string;
  degree: string;
  school: string;
  details: string;
};

export type CvLabels = {
  skills: string;
  contact: string;
  experience: string;
  education: string;
};

export type CvDocument = {
  name: string;
  title: string;
  introHeading: string;
  intro: string;
  labels: CvLabels;
  contacts: ContactItem[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  education: Education[];
};

export function clampLevel(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export function parseYear(value: string) {
  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

export function sortExperience(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    const aTo = parseYear(a.current ? "9999" : a.to);
    const bTo = parseYear(b.current ? "9999" : b.to);
    if (bTo !== aTo) return bTo - aTo;
    return parseYear(b.from) - parseYear(a.from);
  });
}

export function sortEducation(items: Education[]): Education[] {
  return [...items].sort((a, b) => {
    const aTo = parseYear(a.to) || parseYear(a.from);
    const bTo = parseYear(b.to) || parseYear(b.from);
    if (bTo !== aTo) return bTo - aTo;
    return parseYear(b.from) - parseYear(a.from);
  });
}
