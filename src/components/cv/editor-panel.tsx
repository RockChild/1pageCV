import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_KINDS, type ContactKind } from "@/lib/cv/types";
import { useCvStore } from "@/lib/cv/store";
import { SkillDots } from "./skill-dots";

const KIND_LABEL: Record<ContactKind, string> = {
  email: "E-mail",
  phone: "Telefon",
  linkedin: "LinkedIn",
  location: "Lokalizacja",
  website: "Strona",
  github: "GitHub",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight text-fg">{title}</h2>
        {action}
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

export function EditorPanel() {
  const cv = useCvStore((s) => s.cv);
  const patch = useCvStore((s) => s.patch);
  const setLabel = useCvStore((s) => s.setLabel);
  const addSkillGroup = useCvStore((s) => s.addSkillGroup);
  const updateSkillGroup = useCvStore((s) => s.updateSkillGroup);
  const removeSkillGroup = useCvStore((s) => s.removeSkillGroup);
  const moveSkillGroup = useCvStore((s) => s.moveSkillGroup);
  const addSkill = useCvStore((s) => s.addSkill);
  const updateSkill = useCvStore((s) => s.updateSkill);
  const removeSkill = useCvStore((s) => s.removeSkill);
  const addExperience = useCvStore((s) => s.addExperience);
  const updateExperience = useCvStore((s) => s.updateExperience);
  const removeExperience = useCvStore((s) => s.removeExperience);
  const addEducation = useCvStore((s) => s.addEducation);
  const updateEducation = useCvStore((s) => s.updateEducation);
  const removeEducation = useCvStore((s) => s.removeEducation);
  const addContact = useCvStore((s) => s.addContact);
  const updateContact = useCvStore((s) => s.updateContact);
  const removeContact = useCvStore((s) => s.removeContact);

  return (
    <div className="grid gap-4 pb-8">
      <Section title="Profil">
        <Field label="Imię i nazwisko">
          <Input value={cv.name} onChange={(e) => patch({ name: e.target.value })} />
        </Field>
        <Field label="Stanowisko">
          <Input value={cv.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Nagłówek powitania">
          <Input
            value={cv.introHeading}
            onChange={(e) => patch({ introHeading: e.target.value })}
          />
        </Field>
        <Field label="O mnie (**pogrubienie**)">
          <Textarea
            rows={6}
            value={cv.intro}
            onChange={(e) => patch({ intro: e.target.value })}
          />
        </Field>
      </Section>

      <Section
        title="Kontakt"
        action={
          <select
            className="h-8 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2 text-xs text-fg"
            defaultValue=""
            onChange={(e) => {
              const kind = e.target.value as ContactKind;
              if (kind) addContact(kind);
              e.target.value = "";
            }}
          >
            <option value="" disabled>
              Dodaj pole
            </option>
            {CONTACT_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABEL[kind]}
              </option>
            ))}
          </select>
        }
      >
        <Field label="Tytuł sekcji">
          <Input
            value={cv.labels.contact}
            onChange={(e) => setLabel("contact", e.target.value)}
          />
        </Field>
        {cv.contacts.map((item) => (
          <div key={item.id} className="flex items-end gap-2">
            <Field label={KIND_LABEL[item.kind]}>
              <Input
                value={item.value}
                onChange={(e) => updateContact(item.id, { value: e.target.value })}
              />
            </Field>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Usuń kontakt"
              onClick={() => removeContact(item.id)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </Section>

      <Section
        title="Umiejętności"
        action={
          <Button type="button" size="sm" variant="secondary" onClick={addSkillGroup}>
            <Plus />
            Grupa
          </Button>
        }
      >
        <Field label="Tytuł sekcji">
          <Input
            value={cv.labels.skills}
            onChange={(e) => setLabel("skills", e.target.value)}
          />
        </Field>
        {cv.skillGroups.map((group, index) => (
          <div
            key={group.id}
            className="rounded-[var(--radius-sm)] border border-border bg-bg p-3"
          >
            <div className="mb-2 flex items-center gap-1">
              <Input
                value={group.name}
                onChange={(e) => updateSkillGroup(group.id, e.target.value)}
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Wyżej"
                disabled={index === 0}
                onClick={() => moveSkillGroup(group.id, -1)}
              >
                <ChevronUp />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Niżej"
                disabled={index === cv.skillGroups.length - 1}
                onClick={() => moveSkillGroup(group.id, 1)}
              >
                <ChevronDown />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Usuń grupę"
                onClick={() => removeSkillGroup(group.id)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid gap-2">
              {group.skills.map((skill) => (
                <div key={skill.id} className="flex min-w-0 flex-wrap items-center gap-2">
                  <Input
                    className="min-w-40 flex-1"
                    value={skill.name}
                    onChange={(e) =>
                      updateSkill(group.id, skill.id, { name: e.target.value })
                    }
                  />
                  <SkillDots
                    level={skill.level}
                    interactive
                    onChange={(level) => updateSkill(group.id, skill.id, { level })}
                  />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Usuń umiejętność"
                    onClick={() => removeSkill(group.id, skill.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => addSkill(group.id)}
              >
                <Plus />
                Umiejętność
              </Button>
            </div>
          </div>
        ))}
      </Section>

      <Section
        title="Doświadczenie"
        action={
          <Button type="button" size="sm" variant="secondary" onClick={addExperience}>
            <Plus />
            Praca
          </Button>
        }
      >
        <Field label="Tytuł sekcji">
          <Input
            value={cv.labels.experience}
            onChange={(e) => setLabel("experience", e.target.value)}
          />
        </Field>
        <p className="text-xs text-muted">
          Punkty na osi układają się od najnowszej roli — „obecnie” zawsze na górze.
        </p>
        {cv.experience.map((job) => (
          <div
            key={job.id}
            className="grid gap-2 rounded-[var(--radius-sm)] border border-border bg-bg p-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="Od">
                <Input
                  value={job.from}
                  onChange={(e) => updateExperience(job.id, { from: e.target.value })}
                />
              </Field>
              <Field label="Do">
                <Input
                  value={job.current ? "Present" : job.to}
                  disabled={job.current}
                  onChange={(e) => updateExperience(job.id, { to: e.target.value })}
                />
              </Field>
            </div>
            <label className="flex min-h-10 items-center gap-2 text-sm text-fg">
              <input
                type="checkbox"
                className="size-4 accent-accent"
                checked={job.current}
                onChange={(e) =>
                  updateExperience(job.id, {
                    current: e.target.checked,
                    to: e.target.checked ? "Present" : job.to === "Present" ? "" : job.to,
                  })
                }
              />
              Obecnie pracuję tutaj
            </label>
            <Field label="Firma">
              <Input
                value={job.company}
                onChange={(e) => updateExperience(job.id, { company: e.target.value })}
              />
            </Field>
            <Field label="Rola">
              <Input
                value={job.role}
                onChange={(e) => updateExperience(job.id, { role: e.target.value })}
              />
            </Field>
            <Field label="Miasto">
              <Input
                value={job.location}
                onChange={(e) => updateExperience(job.id, { location: e.target.value })}
              />
            </Field>
            <Field label="Opis (**pogrubienie**)">
              <Textarea
                rows={4}
                value={job.description}
                onChange={(e) =>
                  updateExperience(job.id, { description: e.target.value })
                }
              />
            </Field>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeExperience(job.id)}
            >
              <Trash2 />
              Usuń pracę
            </Button>
          </div>
        ))}
      </Section>

      <Section
        title="Edukacja"
        action={
          <Button type="button" size="sm" variant="secondary" onClick={addEducation}>
            <Plus />
            Pozycja
          </Button>
        }
      >
        <Field label="Tytuł sekcji">
          <Input
            value={cv.labels.education}
            onChange={(e) => setLabel("education", e.target.value)}
          />
        </Field>
        {cv.education.map((edu) => (
          <div
            key={edu.id}
            className="grid gap-2 rounded-[var(--radius-sm)] border border-border bg-bg p-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="Od">
                <Input
                  value={edu.from}
                  onChange={(e) => updateEducation(edu.id, { from: e.target.value })}
                />
              </Field>
              <Field label="Do">
                <Input
                  value={edu.to}
                  onChange={(e) => updateEducation(edu.id, { to: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Tytuł / kierunek">
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              />
            </Field>
            <Field label="Uczelnia">
              <Input
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
              />
            </Field>
            <Field label="Szczegóły">
              <Textarea
                rows={3}
                value={edu.details}
                onChange={(e) => updateEducation(edu.id, { details: e.target.value })}
              />
            </Field>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 />
              Usuń
            </Button>
          </div>
        ))}
      </Section>
    </div>
  );
}
