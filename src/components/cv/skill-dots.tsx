import { cn } from "@/lib/utils";

export function SkillDots({
  level,
  interactive = false,
  onChange,
}: {
  level: number;
  interactive?: boolean;
  onChange?: (level: number) => void;
}) {
  const value = Math.min(5, Math.max(0, Math.round(level)));
  return (
    <div className={interactive ? "flex gap-1" : "cv-dots"} role="img" aria-label={`${value} z 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        const on = n <= value;
        if (!interactive) {
          return <span key={n} className={cn("cv-dot", on && "is-on")} />;
        }
        return (
          <button
            key={n}
            type="button"
            aria-label={`Poziom ${n}`}
            onClick={() => onChange?.(n)}
            className={cn(
              "size-4 rounded-full border transition-colors",
              on ? "border-accent bg-accent" : "border-faint bg-transparent",
            )}
          />
        );
      })}
    </div>
  );
}
