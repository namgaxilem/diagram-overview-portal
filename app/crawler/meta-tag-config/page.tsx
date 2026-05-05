'use client';

import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import MetaTagConfig, { MetaTagItem } from './_components/MetaTagConfig';

const { Title, Paragraph } = Typography;

const LOCAL_STORAGE_KEY = 'crawler-meta-tag-config';

const DEFAULT_META_TAGS: MetaTagItem[] = [
  {
    id: 'default-1',
    attributeKey: 'name',
    attributeKeyValueToScrape: 'description',
    attributeValueToScrape: 'content',
  },
  {
    id: 'default-2',
    attributeKey: 'property',
    attributeKeyValueToScrape: 'og:title',
    attributeValueToScrape: 'content',
  },
  {
    id: 'default-3',
    attributeKey: 'property',
    attributeKeyValueToScrape: 'og:description',
    attributeValueToScrape: 'content',
  },
];

export default function MetaTagConfigPage() {
  const [metaTags, setMetaTags] = useState<MetaTagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMetaTags(parsed);
      } catch {
        setMetaTags(DEFAULT_META_TAGS);
      }
    } else {
      setMetaTags(DEFAULT_META_TAGS);
    }
    setLoading(false);
  }, []);

  const handleChange = (newValue: MetaTagItem[]) => {
    setMetaTags(newValue);
  };

  const handleSave = (value: MetaTagItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    messageApi.success('Meta tag configuration saved successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <div className="mb-6">
        <Title level={2}>Meta Tag Configuration</Title>
        <Paragraph className="text-gray-600">
          Configure which HTML meta tags and types should be extracted during crawling. 
          Define meta tag names, types, and extraction rules to customize your crawl data collection.
        </Paragraph>
      </div>

      <MetaTagConfig
        initValue={DEFAULT_META_TAGS}
        value={metaTags}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}
