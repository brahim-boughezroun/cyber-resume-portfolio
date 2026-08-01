"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
};

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  async function shareArticle() {
    if (!navigator.share) {
      await copyArticleLink();
      return;
    }

    try {
      await navigator.share({
        title,
        url: window.location.href,
      });
    } catch {
      // The user may close the share window without sharing.
    }
  }

  return (
    <section className="mt-10 border-t border-[rgba(56,255,122,0.2)] pt-8">
      <p className="text-[10px] font-bold tracking-[0.22em] text-[#38ff7a]">
        ARTICLE://SHARE_TRANSMISSION
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyArticleLink}
          className="border border-[rgba(56,255,122,0.3)] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#38ff7a] transition hover:bg-[rgba(56,255,122,0.08)]"
        >
          {copied ? "LINK COPIED ✓" : "COPY LINK"}
        </button>

        {/* <button
          type="button"
          onClick={shareArticle}
          className="border border-[#38ff7a] bg-[#38ff7a] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#020704] transition hover:bg-[#a8ffc1]"
        >
          SHARE ARTICLE
        </button> */}
      </div>
    </section>
  );
}