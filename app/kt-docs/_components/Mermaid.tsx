'use client';

import React, { useEffect, useId, useState } from 'react';

/**
 * Renders a single mermaid diagram client-side.
 *
 * `mermaid` is imported dynamically so it stays out of the main bundle and only
 * loads on pages that actually contain a diagram. On failure the raw mermaid
 * source is shown so the content is never lost.
 */
export default function Mermaid({ chart }: { chart: string }) {
  // mermaid needs a DOM-id-safe string; useId() contains ':' so strip it.
  const id = 'mmd-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <pre className="mermaid-error">{`Diagram failed to render: ${error}\n\n${chart}`}</pre>;
  }
  if (!svg) {
    return <div className="mermaid-loading">Rendering diagram…</div>;
  }
  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}
