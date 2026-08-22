import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The site's one FAQ disclosure list.
 *
 * Two pages ship `FAQPage` JSON-LD — the industry pages and Service — and both
 * previously hand-rolled their own disclosure, each broken in a different way:
 *
 *   - `IndustryDetail`'s animated `height: 0 → auto` through Framer Motion with
 *     no `aria-expanded`, no `aria-controls` and no heading wrapper, so the
 *     rows were invisible to assistive technology and unreachable as landmarks.
 *   - `Service`'s mounted the answer conditionally (`{isOpen && …}`), so the
 *     answer text was absent from the server-rendered HTML entirely — while the
 *     page told Google, via `faqSchema()`, that the answer was on the page.
 *     Structured data whose content is not in the DOM is exactly what Google
 *     penalises.
 *
 * So the requirements here are unusually specific, and each line below is
 * load-bearing:
 *
 * **Radix for the semantics.** `aria-expanded`, `aria-controls`, the id
 * plumbing between trigger and panel, roving focus, Home/End and arrow-key
 * navigation are real work with real edge cases. Radix already ships all of it,
 * correctly, and the repo already depends on it.
 *
 * **`forceMount` plus a neutralised `hidden`.** Radix unmounts a closed panel,
 * and even under `forceMount` it sets `hidden` — which resolves to
 * `display: none` and takes the answer back out of the rendered page. The
 * `[&[hidden]]:block` override below keeps it rendered, so the answer is in the
 * server HTML whether the row is open or shut. That is what makes the
 * `FAQPage` schema honest.
 *
 * **`grid-template-rows: 0fr → 1fr` for the reveal.** The alternative,
 * animating to a measured pixel height, captures that measurement once — so a
 * late font swap, a viewport resize or a locale with longer copy leaves the
 * panel clipped at a stale height. Fractional grid rows animate to the
 * content's intrinsic height with no measurement at all, so they cannot go
 * stale. `min-h-0` on the inner cell is required: grid items default to
 * `min-height: auto`, which refuses to shrink below content height and defeats
 * the whole technique.
 *
 * Answers are plain strings with no focusable children, so a collapsed panel
 * cannot trap the keyboard even though its content stays in the DOM.
 */
export function Faq({
  items,
  className,
  headingLevel: H = "h3",
}: {
  items: { q: string; a: string }[];
  className?: string;
  /** The rows sit under a section heading; match the level below it. */
  headingLevel?: "h2" | "h3" | "h4";
}) {
  if (!items.length) return null;

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      // Marks these rows for scripts/qa-faq.mjs, which must distinguish a FAQ
      // disclosure from every other aria-expanded control on the page (the
      // nav's Industries dropdown is one).
      data-faq
      className={cn("border-t border-border", className)}
    >
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={item.q}
          value={`faq-${i}`}
          // Hairline dividers and full-bleed rows — no per-row card chrome.
          // apple.com sets these as a plain list, and the card treatment is
          // what made the old version read as a stack of unrelated boxes.
          className="group border-b border-border"
        >
          <AccordionPrimitive.Header asChild>
            <H className="m-0">
              <AccordionPrimitive.Trigger
                className={cn(
                  "flex w-full items-center justify-between gap-6 py-6 text-left",
                  "text-[17px] font-medium leading-snug text-crisp",
                  "transition-colors duration-200 hover:text-signal",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                )}
              >
                {/* `data-faq-q`/`data-faq-a` are the `speakable` selectors in
                    `faqSchema()`. They mark the question and answer text for a
                    voice assistant reading the page aloud, so it reads the
                    answer rather than the nav — and `verify-seo` asserts the
                    two stay in step. */}
                <span data-faq-q>{item.q}</span>
                {/* One glyph, rotated 45° to become a minus. Swapping two
                    different icons cannot be animated and pops on toggle. */}
                <Plus
                  aria-hidden
                  strokeWidth={1.75}
                  className={cn(
                    "h-5 w-5 shrink-0 text-cool",
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-data-[state=open]:rotate-45 group-data-[state=open]:text-signal",
                  )}
                />
              </AccordionPrimitive.Trigger>
            </H>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content
            forceMount
            className={cn(
              "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
              // Undo the `hidden` Radix sets on a closed forceMount panel.
              "[&[hidden]]:grid",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <p data-faq-a className="pb-6 pr-10 text-[15px] leading-relaxed text-cool">
                {item.a}
              </p>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
