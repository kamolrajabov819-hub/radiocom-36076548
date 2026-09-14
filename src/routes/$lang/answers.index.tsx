import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/pages/Answers.meta";
import { AnswersPage } from "@/pages/Answers";

/** `/{lang}/answers` — the index of the answers section. */
export const Route = createFileRoute("/$lang/answers/")({
  head,
  component: AnswersPage,
});
