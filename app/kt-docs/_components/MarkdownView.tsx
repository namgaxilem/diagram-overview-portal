'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface MarkdownViewProps {
  /** Raw markdown — rendered and also what the Copy button puts on the clipboard. */
  source: string;
}

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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
