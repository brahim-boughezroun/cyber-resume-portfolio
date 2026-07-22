const DEFAULT_WORDS_PER_MINUTE = 120;

export function calculateReadingTime(
  content: string,
  wordsPerMinute = DEFAULT_WORDS_PER_MINUTE,
): number {
  const normalizedContent = content
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedContent) {
    return 1;
  }

  const wordCount = normalizedContent.split(" ").length;

  return Math.max(
    1,
    Math.ceil(wordCount / wordsPerMinute),
  );
}