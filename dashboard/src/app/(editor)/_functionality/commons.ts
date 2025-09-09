/**
 * Capitalizes each word in a string.
 * @param str - The input string.
 * @returns A capitalized string.
 */
export default function capitalizeWords(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(?:^|[\s])\w/g, (match) => match.toUpperCase());
}

/**
 * Truncates text based on word or character length depending on locale.
 * Supports Arabic word truncation.
 * @param text - The text to truncate.
 * @param length - Max length (default: 50).
 * @param locale - Locale (default: "en").
 * @returns Truncated text with ellipsis if needed.
 */
export function TruncateText(
  text: string,
  length: number = 50,
  locale: string = "en"
): string {
  if (!text || text.length <= length) return text;

  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const segments = Array.from(segmenter.segment(text), (s) => s.segment);

  if (locale.startsWith("ar")) {
    if (segments.length > length) {
      return "\u202B" + segments.slice(0, length).join(" ") + "...\u202C";
    }
  } else {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
  }

  return text;
}

/**
 * Converts a string with underscores to camelCase.
 * @param str - The input string.
 * @returns The camelCased string.
 */
export function toCamelCase(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .toLowerCase()
    .split("_")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}
// utils/utils.ts
export const formatWithCommas = (num: number | string): string => {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
