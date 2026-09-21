import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nid } from "@/lib/utils";
import { createBlankCv, createSampleCv } from "./sample";
import { clampLevel, type ContactKind, type CvDocument } from "./types";

type CvState = {
  cv: CvDocument;
  hydrated: boolean;
  setHydrated: () => void;
  setCv: (cv: CvDocument) => void;
  patch: (partial: Partial<CvDocument>) => void;
  setLabel: (key: keyof CvDocument["labels"], value: string) => void;
  addSkillGroup: () => void;
  updateSkillGroup: (id: string, name: string) => void;
  removeSkillGroup: (id: string) => void;
  moveSkillGroup: (id: string, dir: -1 | 1) => void;
  addSkill: (groupId: string) => void;
  updateSkill: (
    groupId: string,
    skillId: string,
    patch: { name?: string; level?: number },
  ) => void;
  removeSkill: (groupId: string, skillId: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<CvDocument["experience"][number]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<CvDocument["education"][number]>) => void;
  removeEducation: (id: string) => void;
  addContact: (kind: ContactKind) => void;
  updateContact: (id: string, patch: Partial<CvDocument["contacts"][number]>) => void;
  removeContact: (id: string) => void;
  loadSample: () => void;
  loadBlank: () => void;
};

function mapGroups(
  cv: CvDocument,
  groupId: string,
  fn: (group: CvDocument["skillGroups"][number]) => CvDocument["skillGroups"][number],
): CvDocument {
  return {
    ...cv,
    skillGroups: cv.skillGroups.map((g) => (g.id === groupId ? fn(g) : g)),
  };
}

export const useCvStore = create<CvState>()(
  persist(
    (set) => ({
      cv: createSampleCv(),
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setCv: (cv) => set({ cv }),
      patch: (partial) => set((s) => ({ cv: { ...s.cv, ...partial } })),
      setLabel: (key, value) =>
        set((s) => ({ cv: { ...s.cv, labels: { ...s.cv.labels, [key]: value } } })),
      addSkillGroup: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            skillGroups: [
              ...s.cv.skillGroups,
              {
                id: nid(),
                name: "Nowa grupa",
                skills: [{ id: nid(), name: "Umiejętność", level: 3 }],
              },
            ],
          },
        })),
      updateSkillGroup: (id, name) =>
        set((s) => ({
          cv: mapGroups(s.cv, id, (g) => ({ ...g, name })),
        })),
      removeSkillGroup: (id) =>
        set((s) => ({
          cv: { ...s.cv, skillGroups: s.cv.skillGroups.filter((g) => g.id !== id) },
        })),
      moveSkillGroup: (id, dir) =>
        set((s) => {
          const list = [...s.cv.skillGroups];
          const i = list.findIndex((g) => g.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= list.length) return s;
          const tmp = list[i];
          list[i] = list[j]!;
          list[j] = tmp!;
          return { cv: { ...s.cv, skillGroups: list } };
        }),
      addSkill: (groupId) =>
        set((s) => ({
          cv: mapGroups(s.cv, groupId, (g) => ({
            ...g,
            skills: [...g.skills, { id: nid(), name: "Nowa", level: 3 }],
          })),
        })),
      updateSkill: (groupId, skillId, patch) =>
        set((s) => ({
          cv: mapGroups(s.cv, groupId, (g) => ({
            ...g,
            skills: g.skills.map((sk) =>
              sk.id === skillId
                ? {
                    ...sk,
                    ...patch,
                    level: patch.level !== undefined ? clampLevel(patch.level) : sk.level,
                  }
                : sk,
            ),
          })),
        })),
      removeSkill: (groupId, skillId) =>
        set((s) => ({
          cv: mapGroups(s.cv, groupId, (g) => ({
            ...g,
            skills: g.skills.filter((sk) => sk.id !== skillId),
          })),
        })),
      addExperience: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: [
              {
                id: nid(),
                from: String(new Date().getFullYear()),
                to: "Present",
                current: true,
                company: "Firma",
                role: "Rola",
                location: "",
                description: "",
              },
              ...s.cv.experience,
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: s.cv.experience.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ...patch,
                    to: patch.current === true ? "Present" : (patch.to ?? item.to),
                  }
                : item,
            ),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          cv: { ...s.cv, experience: s.cv.experience.filter((item) => item.id !== id) },
        })),
      addEducation: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: [
              ...s.cv.education,
              {
                id: nid(),
                from: "",
                to: "",
                degree: "Kierunek",
                school: "Uczelnia",
                details: "",
              },
            ],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: s.cv.education.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          cv: { ...s.cv, education: s.cv.education.filter((item) => item.id !== id) },
        })),
      addContact: (kind) =>
        set((s) => ({
          cv: {
            ...s.cv,
            contacts: [...s.cv.contacts, { id: nid(), kind, value: "" }],
          },
        })),
      updateContact: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            contacts: s.cv.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),
      removeContact: (id) =>
        set((s) => ({
          cv: { ...s.cv, contacts: s.cv.contacts.filter((c) => c.id !== id) },
        })),
      loadSample: () => set({ cv: createSampleCv() }),
      loadBlank: () => set({ cv: createBlankCv() }),
    }),
    {
      name: "aureo-cv",
      partialize: (s) => ({ cv: s.cv }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
