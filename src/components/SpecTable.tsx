import { useTranslation } from "react-i18next";
import { brandCase } from "@/lib/brand";
import { pick, type Lang } from "@/data/spec-dict";
import { specs, RANGE_NOTE } from "@/data/specs";
import type { Product } from "@/data/products";

/**
 * A model's full specification table and the range note under it.
 *
 * Rendered on the product page itself, not only on `/specs`: the keyword map
 * gives «{модель} характеристики» to the product URL, and `/specs` now names
 * the product page as its canonical. A canonical only holds when the page it
 * points at carries the content, so the table lives on both and this one
 * component keeps the two identical.
 */
export function SpecTable({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const spec = specs[p.id];
  if (!spec?.rows?.length) return null;
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">
            {t("px.spec_table")} — {p.name}
          </caption>
          <tbody>
            {spec.rows.map((r) => (
              <tr key={pick(r.label, lang)} className="border-b border-border">
                <th
                  scope="row"
                  className="w-[42%] py-5 pr-6 align-top text-[15px] font-normal text-cool"
                >
                  {pick(r.label, lang)}
                </th>
                <td className="py-5 align-top text-[17px] text-crisp">
                  {brandCase(pick(r.value, lang))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-cool">
        {pick(RANGE_NOTE, lang)}
      </p>
    </>
  );
}
