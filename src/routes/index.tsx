import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/cv/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Studio />;
}
