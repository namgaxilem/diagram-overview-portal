'use client';

import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, Select, Space, Tag, Typography } from 'antd';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  THRESHOLD_LABELS,
  THRESHOLD_OPTIONS,
  type Category,
  type PolicyConfig,
  type Threshold,
} from './types';

export type { PolicyConfig } from './types';

const { TextArea } = Input;
const { Text } = Typography;

interface AgentPolicyConfigBuilderProps {
  initialPolicyConfig?: PolicyConfig;
  onChangePolicyConfig?: (config: PolicyConfig) => void;
  readOnly?: boolean;
}

const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  safety_instruction: '',
  blocked_words: [],
  pii_patterns: {},
  generate_content_config: {
    safety_settings: [],
  },
};

export default function AgentPolicyConfigBuilder({
  initialPolicyConfig,
  onChangePolicyConfig,
  readOnly = false,
}: AgentPolicyConfigBuilderProps) {
  const prevInitialConfigRef = useRef(initialPolicyConfig);
  const [config, setConfig] = useState<PolicyConfig>(initialPolicyConfig ?? DEFAULT_POLICY_CONFIG);

  // blocked_words input state
  const [newBlockedWord, setNewBlockedWord] = useState('');

  // pii_patterns input state
  const [newPiiKey, setNewPiiKey] = useState('');
  const [newPiiValue, setNewPiiValue] = useState('');

  // Sync from parent when initialPolicyConfig changes reference
  useEffect(() => {
    if (initialPolicyConfig && initialPolicyConfig !== prevInitialConfigRef.current) {
      prevInitialConfigRef.current = initialPolicyConfig;

      setConfig(initialPolicyConfig);
    }
  }, [initialPolicyConfig]);

  const updateConfig = useCallback(
    (updater: (prev: PolicyConfig) => PolicyConfig) => {
      setConfig((prev) => {
        const next = updater(prev);
        onChangePolicyConfig?.(next);
        return next;
      });
    },
    [onChangePolicyConfig]
  );

  // --- Safety Instruction ---
  const handleSafetyInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateConfig((prev) => ({
      ...prev,
      safety_instruction: e.target.value,
    }));
  };

  // --- Blocked Words ---
  const handleAddBlockedWord = () => {
    const word = newBlockedWord.trim();
    if (!word) {
      return;
    }
    if (config.blocked_words.includes(word)) {
      return;
    }
    updateConfig((prev) => ({
      ...prev,
      blocked_words: [...prev.blocked_words, word],
    }));
    setNewBlockedWord('');
  };

  const handleRemoveBlockedWord = (word: string) => {
    updateConfig((prev) => ({
      ...prev,
      blocked_words: prev.blocked_words.filter((w) => w !== word),
    }));
  };

  // --- PII Patterns ---
  const handleAddPiiPattern = () => {
    const key = newPiiKey.trim();
    const value = newPiiValue.trim();
    if (!key || !value) {
      return;
    }
    updateConfig((prev) => ({
      ...prev,
      pii_patterns: { ...prev.pii_patterns, [key]: value },
    }));
    setNewPiiKey('');
    setNewPiiValue('');
  };

  const handleRemovePiiPattern = (key: string) => {
    updateConfig((prev) => {
      const next = { ...prev.pii_patterns };
      delete next[key];
      return { ...prev, pii_patterns: next };
    });
  };

  // --- Safety Settings ---
  const [showPendingRow, setShowPendingRow] = useState(false);

  const usedCategories = config.generate_content_config.safety_settings.map((s) => s.category);

  const availableCategories = CATEGORY_OPTIONS.filter((c) => !usedCategories.includes(c));

  const handleAddSafetySetting = () => {
    setShowPendingRow(true);
  };

  const handleCommitPendingCategory = (category: Category) => {
    updateConfig((prev) => ({
      ...prev,
      generate_content_config: {
        ...prev.generate_content_config,
        safety_settings: [
          ...prev.generate_content_config.safety_settings,
          { category, threshold: 'BLOCK_LOW_AND_ABOVE' },
        ],
      },
    }));
    setShowPendingRow(false);
  };

  const handleCancelPendingRow = () => {
    setShowPendingRow(false);
  };

  const handleRemoveSafetySetting = (index: number) => {
    updateConfig((prev) => ({
      ...prev,
      generate_content_config: {
        ...prev.generate_content_config,
        safety_settings: prev.generate_content_config.safety_settings.filter((_, i) => i !== index),
      },
    }));
  };

  const handleChangeSafetyCategory = (index: number, category: Category) => {
    updateConfig((prev) => {
      const settings = [...prev.generate_content_config.safety_settings];
      settings[index] = { ...settings[index], category };
      return {
        ...prev,
        generate_content_config: {
          ...prev.generate_content_config,
          safety_settings: settings,
        },
      };
    });
  };

  const handleChangeSafetyThreshold = (index: number, threshold: Threshold) => {
    updateConfig((prev) => {
      const settings = [...prev.generate_content_config.safety_settings];
      settings[index] = { ...settings[index], threshold };
      return {
        ...prev,
        generate_content_config: {
          ...prev.generate_content_config,
          safety_settings: settings,
        },
      };
    });
  };

  return (
    <Card title="Policy Config Builder" variant="borderless">
      {/* Safety Instruction */}
      <div style={{ marginBottom: 24 }}>
        <Text strong>Safety Instruction</Text>
        <TextArea
          style={{ marginTop: 8 }}
          rows={4}
          value={config.safety_instruction}
          onChange={handleSafetyInstructionChange}
          disabled={readOnly}
          placeholder="Enter safety instruction..."
        />
      </div>

      <Divider />

      {/* Blocked Words */}
      <div style={{ marginBottom: 24 }}>
        <Text strong>Blocked Words</Text>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {config.blocked_words.map((word) => (
            <Tag key={word} closable={!readOnly} onClose={() => handleRemoveBlockedWord(word)}>
              {word}
            </Tag>
          ))}
        </div>
        {!readOnly && (
          <Space.Compact style={{ marginTop: 8, width: '100%', maxWidth: 400 }}>
            <Input
              value={newBlockedWord}
              onChange={(e) => setNewBlockedWord(e.target.value)}
              onPressEnter={handleAddBlockedWord}
              placeholder="Add blocked word"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBlockedWord}>
              Add
            </Button>
          </Space.Compact>
        )}
      </div>

      <Divider />

      {/* PII Patterns */}
      <div style={{ marginBottom: 24 }}>
        <Text strong>PII Patterns</Text>
        <div style={{ marginTop: 8 }}>
          {Object.entries(config.pii_patterns).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
                padding: '8px 12px',
                background: '#fafafa',
                borderRadius: 6,
                border: '1px solid #f0f0f0',
              }}
            >
              <Tag color="blue" style={{ margin: 0 }}>
                {key}
              </Tag>
              <Text
                code
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </Text>
              {!readOnly && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemovePiiPattern(key)}
                />
              )}
            </div>
          ))}
        </div>
        {!readOnly && (
          <Space.Compact style={{ marginTop: 8, width: '100%' }}>
            <Input
              style={{ width: 160 }}
              value={newPiiKey}
              onChange={(e) => setNewPiiKey(e.target.value)}
              placeholder="Key (e.g. email)"
            />
            <Input
              style={{ flex: 1 }}
              value={newPiiValue}
              onChange={(e) => setNewPiiValue(e.target.value)}
              onPressEnter={handleAddPiiPattern}
              placeholder="Regex pattern"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPiiPattern}>
              Add
            </Button>
          </Space.Compact>
        )}
      </div>

      <Divider />

      {/* Safety Settings */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text strong>Safety Settings</Text>
          {!readOnly && (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddSafetySetting}
              disabled={
                showPendingRow ||
                config.generate_content_config.safety_settings.length >= 5 ||
                availableCategories.length === 0
              }
            >
              Add Setting
            </Button>
          )}
        </div>
        {config.generate_content_config.safety_settings.length === 0 && !showPendingRow && (
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            No safety settings configured.
          </Text>
        )}
        {config.generate_content_config.safety_settings.map((setting, index) => {
          const categoryOptionsForRow = CATEGORY_OPTIONS.filter(
            (c) => c === setting.category || !usedCategories.includes(c)
          );
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Select
                style={{ flex: 1 }}
                value={setting.category}
                onChange={(val) => handleChangeSafetyCategory(index, val)}
                disabled={readOnly}
                options={categoryOptionsForRow.map((c) => ({
                  label: CATEGORY_LABELS[c],
                  value: c,
                }))}
              />
              <Select
                style={{ width: 260 }}
                value={setting.threshold}
                onChange={(val) => handleChangeSafetyThreshold(index, val)}
                disabled={readOnly}
                options={THRESHOLD_OPTIONS.map((t) => ({
                  label: THRESHOLD_LABELS[t],
                  value: t,
                }))}
              />
              {!readOnly && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveSafetySetting(index)}
                />
              )}
            </div>
          );
        })}
        {showPendingRow && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Select
              style={{ flex: 1 }}
              placeholder="Select a category"
              onChange={(val) => handleCommitPendingCategory(val)}
              options={availableCategories.map((c) => ({
                label: CATEGORY_LABELS[c],
                value: c,
              }))}
            />
            <Select
              style={{ width: 260 }}
              value={'BLOCK_LOW_AND_ABOVE'}
              disabled
              options={THRESHOLD_OPTIONS.map((t) => ({
                label: THRESHOLD_LABELS[t],
                value: t,
              }))}
            />
            <Button type="text" danger icon={<CloseOutlined />} onClick={handleCancelPendingRow} />
          </div>
        )}
      </div>
    </Card>
  );
}
