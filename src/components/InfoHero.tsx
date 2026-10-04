import { brandCase } from "@/lib/brand";
import { rise } from "@/lib/springs";
import { Section } from "@/components/Section";
import { openLead } from "@/components/LeadFormSheet";
import { ContactActions } from "@/components/ContactActions";

/**
 * The first screen of the pages built from a copy module's `hero` — /rent,
 * /solutions, /about, /contacts: kicker, the h1 (the page's primary keyword),
 * one sentence, and the actions.
 *
 * Plain markup with the CSS `hero-rise`, like every other hero since the
 * first-screen fix: Framer's `initial` would render the heading at opacity 0
 * in the server HTML. `cta` opens the request sheet with the page's own
 * context; the call and Telegram actions sit beside it, so a visitor from an
 * ad has all three ways to reach a person on the first screen.
 */
export function InfoHero({
  kicker,
  title,
  sub,
  cta,
}: {
  kicker: string;
  title: string;
  sub: string;
  cta?: string;
}) {
  return (
    <Section band="plain">
      <div className="mx-auto max-w-4xl text-center">
        <div className="hero-rise mb-4 text-[13px] text-signal" style={rise(0)}>
          {brandCase(kicker)}
        </div>
        <h1 className="hero-rise headline-hero text-crisp" style={rise(1)}>
          {brandCase(title)}
        </h1>
        <p className="hero-rise subhead mx-auto mt-6 max-w-2xl text-lg md:text-xl" style={rise(2)}>
          {brandCase(sub)}
        </p>
        <div
          data-placement="hero"
          className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style={rise(3)}
        >
          {cta ? (
            <button onClick={() => openLead({ title: cta })} className="pill pill-accent">
              {cta}
            </button>
          ) : null}
          <ContactActions placement="hero" className="justify-center" secondary={!!cta} />
        </div>
      </div>
    </Section>
  );
}
