import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

/**
 * Render Markdown article content stored in PostgreSQL.
 *
 * This component supports:
 *
 * - Headings
 * - Paragraphs
 * - Bold and italic text
 * - Links
 * - Ordered and unordered lists
 * - Block quotes
 * - Inline code
 * - Code blocks
 * - Tables
 * - Task lists
 * - Strikethrough
 */
export function MarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        /**
         * remarkGfm adds GitHub Flavored Markdown.
         *
         * Examples:
         *
         * ~~deleted text~~
         *
         * - [x] Completed task
         *
         * | Name | Technology |
         * | ---- | ---------- |
         * | API  | FastAPI    |
         */
        remarkPlugins={[remarkGfm]}
        /**
         * Ignore raw HTML written inside Markdown.
         *
         * Example:
         *
         * <script>alert("danger")</script>
         *
         * The browser will not execute it.
         */
        skipHtml
        /**
         * Replace normal HTML elements with components
         * styled for the portfolio design.
         */
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 mt-12 text-3xl font-bold leading-tight text-[#d9ffe3] md:text-4xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-5 mt-12 border-l-2 border-[#38ff7a] pl-4 text-2xl font-bold leading-tight text-[#d9ffe3] md:text-3xl">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-4 mt-10 text-xl font-bold leading-tight text-[#a8ffc1] md:text-2xl">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-3 mt-8 text-lg font-bold text-[#a8ffc1]">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-6 text-base leading-8 text-[#b5d8be] md:text-lg">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-[#d9ffe3]">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-[#a8ffc1]">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="mb-7 ml-6 list-disc space-y-3 text-base leading-8 text-[#b5d8be] marker:text-[#38ff7a] md:text-lg">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-7 ml-6 list-decimal space-y-3 text-base leading-8 text-[#b5d8be] marker:font-bold marker:text-[#38ff7a] md:text-lg">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-2">
              {children}
            </li>
          ),

          a: ({ href, children }) => {
            const isExternalLink =
              href?.startsWith("https://") ||
              href?.startsWith("http://");

            return (
              <a
                href={href}
                target={
                  isExternalLink
                    ? "_blank"
                    : undefined
                }
                rel={
                  isExternalLink
                    ? "noopener noreferrer"
                    : undefined
                }
                className="font-semibold text-[#38ff7a] underline decoration-[rgba(56,255,122,0.4)] underline-offset-4 transition hover:text-[#a8ffc1]"
              >
                {children}
              </a>
            );
          },

          blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-2 border-[#38ff7a] bg-[rgba(56,255,122,0.05)] px-6 py-5 italic text-[#9acba7]">
              {children}
            </blockquote>
          ),

          code: ({ children, className }) => {
            const isCodeBlock =
              className?.startsWith("language-");

            if (isCodeBlock) {
              return (
                <code
                  className={`${className} block min-w-max bg-transparent p-0 font-mono text-sm leading-7 text-[#b7ffc9]`}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded border border-[rgba(56,255,122,0.2)] bg-[rgba(56,255,122,0.08)] px-1.5 py-0.5 font-mono text-[0.9em] text-[#a8ffc1]">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="my-8 overflow-x-auto border border-[rgba(56,255,122,0.2)] bg-[#010d06] p-5 shadow-[inset_0_0_30px_rgba(56,255,122,0.025)]">
              {children}
            </pre>
          ),

          hr: () => (
            <hr className="my-12 border-0 border-t border-[rgba(56,255,122,0.2)]" />
          ),

          table: ({ children }) => (
            <div className="my-8 overflow-x-auto border border-[rgba(56,255,122,0.2)]">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-[rgba(56,255,122,0.08)] text-[#a8ffc1]">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-[rgba(56,255,122,0.12)]">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="transition hover:bg-[rgba(56,255,122,0.035)]">
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th className="border-r border-[rgba(56,255,122,0.12)] px-4 py-3 font-bold">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-r border-[rgba(56,255,122,0.08)] px-4 py-3 text-[#b5d8be]">
              {children}
            </td>
          ),

          del: ({ children }) => (
            <del className="text-[#6f9278]">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}