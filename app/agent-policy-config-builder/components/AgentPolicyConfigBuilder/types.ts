export const CATEGORY_OPTIONS = [
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_CIVIC_INTEGRITY',
] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
  HARM_CATEGORY_HATE_SPEECH: 'Hate Speech',
  HARM_CATEGORY_SEXUALLY_EXPLICIT: 'Sexually Explicit',
  HARM_CATEGORY_DANGEROUS_CONTENT: 'Dangerous Content',
  HARM_CATEGORY_HARASSMENT: 'Harassment',
  HARM_CATEGORY_CIVIC_INTEGRITY: 'Civic Integrity',
};

export const THRESHOLD_OPTIONS = [
  'OFF',
  'BLOCK_NONE',
  'BLOCK_ONLY_HIGH',
  'BLOCK_MEDIUM_AND_ABOVE',
  'BLOCK_LOW_AND_ABOVE',
  'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
] as const;

export const THRESHOLD_LABELS: Record<Threshold, string> = {
  OFF: 'Off',
  BLOCK_NONE: 'Block None',
  BLOCK_ONLY_HIGH: 'Block Only High',
  BLOCK_MEDIUM_AND_ABOVE: 'Block Medium and Above',
  BLOCK_LOW_AND_ABOVE: 'Block Low and Above',
  HARM_BLOCK_THRESHOLD_UNSPECIFIED: 'Unspecified',
};

export type Category = (typeof CATEGORY_OPTIONS)[number];
export type Threshold = (typeof THRESHOLD_OPTIONS)[number];

export interface SafetySetting {
  category: Category;
  threshold: Threshold;
}

export interface PolicyConfig {
  safety_instruction: string;
  blocked_words: string[];
  pii_patterns: Record<string, string>;
  generate_content_config: {
    safety_settings: SafetySetting[];
  };
}
