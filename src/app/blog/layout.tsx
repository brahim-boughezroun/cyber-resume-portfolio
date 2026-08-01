import type { ReactNode } from "react";
import { BlogFooter } from "@/components/blog/blog-footer";
import { BlogHeader } from "@/components/blog/blog-header";

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({
  children,
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020704] text-[#d9ffe3]">
      <BlogHeader />

      {children}

      <BlogFooter />
    </div>
  );
}