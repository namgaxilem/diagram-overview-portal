'use client';

import React, { type ReactElement } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import Mermaid from './Mermaid';

interface MarkdownViewProps {
  /** Raw markdown — rendered and also what the Copy button puts on the clipboard. */
  source: string;
}

/**
 * Custom react-markdown renderers. Fenced ```mermaid blocks are drawn as
 * diagrams via the Mermaid component; every other element renders as default.
 */
const markdownComponents: Components = {
  pre({ children }) {
    const child = (Array.isArray(children) ? children[0] : children) as
      | ReactElement<{ className?: string; children?: React.ReactNode }>
      | undefined;
    const className = child?.props?.className ?? '';
    if (child && /\blanguage-mermaid\b/.test(className)) {
      const code = String(child.props.children).replace(/\n$/, '');
      return <Mermaid chart={code} />;
    }
    return <pre>{children}</pre>;
  },
};

export default function MarkdownView({ source }: MarkdownViewProps) {
  const [msg, ctx] = message.useMessage();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      msg.success('Markdown copied — paste into Microsoft Loop');
    } catch {
      msg.error('Copy failed — select and copy manually');
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {ctx}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button icon={<CopyOutlined />} onClick={copy}>
            Copy Markdown
          </Button>
        </div>
        <article className="kt-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {source}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
