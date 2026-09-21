import { z } from "zod";
import { CONTACT_KINDS, type CvDocument } from "./types";

const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  level: z.number().min(1).max(5),
});

const skillGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  skills: z.array(skillSchema),
});

const experienceSchema = z.object({
  id: z.string().min(1),
  from: z.string(),
  to: z.string(),
  current: z.boolean(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  description: z.string(),
});

const educationSchema = z.object({
  id: z.string().min(1),
  from: z.string(),
  to: z.string(),
  degree: z.string(),
  school: z.string(),
  details: z.string(),
});

export const cvDocumentSchema = z.object({
  name: z.string(),
  title: z.string(),
  introHeading: z.string(),
  intro: z.string(),
  labels: z.object({
    skills: z.string(),
    contact: z.string(),
    experience: z.string(),
    education: z.string(),
  }),
  contacts: z.array(
    z.object({
      id: z.string().min(1),
      kind: z.enum(CONTACT_KINDS),
      value: z.string(),
    }),
  ),
  skillGroups: z.array(skillGroupSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});

export function parseCvDocument(input: unknown): CvDocument {
  return cvDocumentSchema.parse(input);
}

export function parseCvJson(raw: string): CvDocument {
  return parseCvDocument(JSON.parse(raw) as unknown);
}
