import type { PostStatus } from "@/types/post";

type AdminStatusBadgeProps = {
  status: PostStatus;
};

const statusStyles: Record<
  PostStatus,
  {
    label: string;
    wrapper: string;
    dot: string;
  }
> = {
  PUBLISHED: {
    label: "Published",
    wrapper:
      "border-[#cce7d4] bg-[#eff8f1] text-[#39724a]",
    dot: "bg-[#4f9a64]",
  },

  DRAFT: {
    label: "Draft",
    wrapper:
      "border-[#eadfb5] bg-[#fbf7e8] text-[#866e24]",
    dot: "bg-[#c5a43a]",
  },

  SCHEDULED: {
    label: "Scheduled",
    wrapper:
      "border-[#ddd7ef] bg-[#f5f2fb] text-[#66558c]",
    dot: "bg-[#8975b5]",
  },

  ARCHIVED: {
    label: "Archived",
    wrapper:
      "border-[#deded9] bg-[#f3f3f0] text-[#72726d]",
    dot: "bg-[#969691]",
  },
};

export function AdminStatusBadge({
  status,
}: AdminStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "border px-2.5 py-1 text-[11px] font-medium",
        style.wrapper,
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-1.5 w-1.5 rounded-full",
          style.dot,
        ].join(" ")}
      />

      {style.label}
    </span>
  );
}