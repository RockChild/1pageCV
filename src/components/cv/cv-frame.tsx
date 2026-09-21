import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";

const SHEET_W = 794;
const SHEET_H = 1123;

export function CvFrame({
  sheetRef,
  children,
}: {
  sheetRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full overflow-x-hidden">
      <div style={{ height: SHEET_H * scale }} className="relative">
        <div
          ref={sheetRef}
          className="cv-sheet origin-top-left shadow-2xl"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
