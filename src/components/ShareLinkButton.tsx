"use client";
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export function ShareLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/s/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copy this link:', url);
    }
  };

  return (
    <button
      onClick={copy}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-indigo-600 hover:bg-indigo-50"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
      <span>{copied ? 'Link Copied!' : 'Copy Store Link'}</span>
    </button>
  );
}
