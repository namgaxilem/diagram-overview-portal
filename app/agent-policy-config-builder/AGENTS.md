This is my requirement for new task about config policy for an AI agent.
Help me do the following things in agent-policy-config-builder/page.tsx:

- Update agent-policy-config-builder/components/AgentPolicyConfigBuilder so that it will have a builder to build policy_config in agent-policy-config-builder/components/AgentPolicyConfigBuilder/data.json.
- safety_instruction will be an string input.
- blocked_words will be an array of string input, can be added or removed.
- pii_patterns will be an object with key is string and value is string, can be added or removed.
- generate_content_config.safety_settings will be an array of object with key 'category' will have these values as enum:
  `  HARM_CATEGORY_HATE_SPEECH, 
HARM_CATEGORY_SEXUALLY_EXPLICIT, 
HARM_CATEGORY_DANGEROUS_CONTENT, 
HARM_CATEGORY_HARASSMENT, 
HARM_CATEGORY_CIVIC_INTEGRITY`
  and another key is 'threshold' will have that 4 value as enum with that pairs. threshold will have enums:
  `  OFF
BLOCK_NONE
BLOCK_ONLY_HIGH
BLOCK_MEDIUM_AND_ABOVE
BLOCK_LOW_AND_ABOVE
HARM_BLOCK_THRESHOLD_UNSPECIFIED`
  max 5 items in category each category can have 1 threshold, can be added or removed category and threshold will be a Select.
- AgentPolicyConfigBuilder will have these props: initialPolicyConfig, onChangePolicyConfig, readOnly. If readOnly is true, then all inputs will be disabled.
- the output of AgentPolicyConfigBuilder will be policy_config in AgentPolicyConfigBuilder/data.json and set via onChangePolicyConfig callback.
- use ant design components for this builder.
