"use client";

import { useEffect, useState, type ComponentType } from "react";

// The visual-edit bridge (~2,000 lines) only does anything when the site is
// embedded in the builder's preview iframe, where it talks to window.parent.
// Real visitors load the page as the top-level window, so they should not
// download, parse or run it (it also attaches hover/scroll listeners).
export function VisualEditsLoader() {
  const [Bridge, setBridge] = useState<ComponentType | null>(null);

  useEffect(() => {
    let embedded = false;
    try {
      embedded = window.self !== window.top;
    } catch {
      // Cross-origin access to window.top throws — that only happens when framed.
      embedded = true;
    }
    if (!embedded) return;
    import("@/visual-edits/VisualEditsMessenger").then((m) => setBridge(() => m.default));
  }, []);

  return Bridge ? <Bridge /> : null;
}
