import { useTranslation } from "react-i18next";
import { clients } from "@/data/clients";
import { Section } from "@/components/Section";

/**
 * The «Нам доверяют» logo strip.
 *
 * Built on the `marquee-track` utility that was already in `styles.css` and had
 * no callers — it translates a `max-content` track by exactly -50% and pauses on
 * hover, which is the right mechanism and did not need reinventing. The only
 * additions are the edge mask and, under `prefers-reduced-motion`, a scrollbar.
 *
 * Three things this gets right that a logo strip usually gets wrong:
 *
 * **`transform`, never `left`.** Lighthouse already flags six non-composited
 * animations on this site, and an infinite one sitting on every long page is
 * the last place to add a seventh. `translateX` stays on the compositor and
 * costs the main thread nothing per frame; animating `left` would relayout 104
 * images sixty times a second.
 *
 * **The duplicate track is `aria-hidden`.** A seamless loop needs the strip to
 * contain its own continuation, so the list renders twice and the reset lands
 * where the copies coincide. Left visible to assistive tech, that would read
 * fifty-two company names and then read all fifty-two again.
 *
 * **Reduced motion stops it and hands back a scrollbar.** The global rule in
 * `styles.css` already collapses the animation, but a stopped marquee is an
 * unreachable one — whatever sits past the right edge can no longer arrive on
 * its own — so `marquee-mask` becomes `overflow-x: auto` and the reader drives.
 */
export function TrustedBy() {
  const { t } = useTranslation();

  const track = (dup: boolean) => (
    <ul
      className="marquee-track flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
      // 52 logos at 40s is a blur. The duration scales with the list so adding a
      // client slows the strip rather than speeding it up.
      style={{ animationDuration: `${clients.length * 1.8}s` }}
      aria-hidden={dup || undefined}
    >
      {clients.map((c) => (
        <li key={c.name} className="shrink-0">
          <img
            src={c.src}
            alt={dup ? "" : c.name}
            width={156}
            height={156}
            loading="lazy"
            decoding="async"
            /* Fixed height, `object-contain`, capped width. The files are all
               square but the artwork inside them is not, so height alone would
               leave a wide wordmark reading twice the size of a round crest. */
            className="h-14 w-auto max-w-[132px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-20 sm:max-w-[168px]"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Section band="plain" tight>
      {/* `type-headline`, the scale every other section heading on the site
          uses through `SectionHead`. This was `type-title` — the scale meant
          for a card heading — so «Нам доверяют» read at roughly half the size
          of the section above it and the strip looked like a footnote rather
          than a section. */}
      <h2 className="type-headline text-center text-crisp">{t("clients.title")}</h2>
      <p className="subhead mx-auto mt-4 max-w-2xl text-center text-lg">{t("clients.sub")}</p>

      {/* `tabIndex={0}`, matching `HighlightsShelf`.
          
          The track is wider than its container, which makes this a scrollable
          region as far as the platform is concerned — and `qa-a11y` flagged
          exactly that: 18 instances of `scrollable-region-focusable`, serious,
          "scrollable region must have keyboard access". A mouse user can reach
          the far logos because the strip carries them past; a keyboard user
          could not reach them at all. It matters most under
          `prefers-reduced-motion`, where the animation stops and this becomes a
          real horizontal scroller with no other way to drive it. */}
      <div
        className="marquee-mask bleed-x group mt-10 flex overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        role="group"
        aria-label={t("clients.title")}
        tabIndex={0}
      >
        {track(false)}
        {track(true)}
      </div>
    </Section>
  );
}
