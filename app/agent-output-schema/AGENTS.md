As a user creating an agent, I want a GUI builder to define and validate an agent’s structured output schema (e.g., JSON Schema / typed fields), so that the agent’s responses are consistent, machine-readable, and easy to integrate into downstream workflow steps.

============

this is my requirement for new task about output schema an AI agent must follow and return.
Help me do the following things:

- create a component that allow user to build and then construct a JSON schema, this component will be in app/agent-output-schema/components/OutputSchemaBuilder/index.tsx, you can choose the library that is long term support and widely used to build JSON schema. This component will accept an form instance that is FormInstance from antd to manage the form data. Then parent component will use this form instance to get the JSON schema.
- JSON schema builder will have 2 mode: User can use the builder, or user can input raw JSON schema string, we should have tab or toggle button somehow to allow user to switch. The final output should be a valid JSON schema string.
- This component will have an enable button that will enable or disable the JSON schema builder.
- Update agent-output-schema/page.tsx to use this component and display json schema value.
- Make sure the UI/UX of the form is user-friendly and easy to use.
