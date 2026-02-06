export interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  properties: SchemaField[];
  itemType: string;
  enumValues: string;
}

export const JSON_SCHEMA_TYPES = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
  { label: 'Array', value: 'array' },
];

export const ARRAY_ITEM_TYPES = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
];

let fieldIdCounter = 0;

export function createEmptyField(): SchemaField {
  fieldIdCounter += 1;
  return {
    id: `field_${Date.now()}_${fieldIdCounter}`,
    name: '',
    type: 'string',
    description: '',
    required: false,
    properties: [],
    itemType: 'string',
    enumValues: '',
  };
}

export function fieldsToJsonSchema(
  fields: SchemaField[]
): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const field of fields) {
    const trimmedName = field.name.trim();
    if (!trimmedName) continue;

    const prop: Record<string, unknown> = { type: field.type };

    if (field.description.trim()) {
      prop.description = field.description.trim();
    }

    if (field.type === 'object' && field.properties.length > 0) {
      const nested = fieldsToJsonSchema(field.properties);
      if (
        nested.properties &&
        Object.keys(nested.properties as object).length > 0
      ) {
        prop.properties = nested.properties;
      }
      if (nested.required && (nested.required as string[]).length > 0) {
        prop.required = nested.required;
      }
    }

    if (field.type === 'array') {
      if (field.itemType === 'object' && field.properties.length > 0) {
        const nestedItems = fieldsToJsonSchema(field.properties);
        prop.items = nestedItems;
      } else {
        prop.items = { type: field.itemType || 'string' };
      }
    }

    if (field.type === 'string' && field.enumValues.trim()) {
      const enumArr = field.enumValues
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (enumArr.length > 0) {
        prop.enum = enumArr;
      }
    }

    properties[trimmedName] = prop;
    if (field.required) {
      required.push(trimmedName);
    }
  }

  const schema: Record<string, unknown> = {
    type: 'object',
    properties,
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return schema;
}

export function jsonSchemaToFields(
  schema: Record<string, unknown>
): SchemaField[] {
  const fields: SchemaField[] = [];
  const properties = schema.properties as
    | Record<string, Record<string, unknown>>
    | undefined;
  const required = (schema.required as string[]) || [];

  if (!properties) return fields;

  for (const [name, prop] of Object.entries(properties)) {
    const field = createEmptyField();
    field.name = name;
    field.type = (prop.type as SchemaField['type']) || 'string';
    field.description = (prop.description as string) || '';
    field.required = required.includes(name);

    if (field.type === 'object' && prop.properties) {
      field.properties = jsonSchemaToFields(
        prop as Record<string, unknown>
      );
    }

    if (field.type === 'array' && prop.items) {
      const items = prop.items as Record<string, unknown>;
      if (items.type === 'object' && items.properties) {
        field.itemType = 'object';
        field.properties = jsonSchemaToFields(items);
      } else {
        field.itemType = (items.type as string) || 'string';
      }
    }

    if (prop.enum && Array.isArray(prop.enum)) {
      field.enumValues = (prop.enum as string[]).join(', ');
    }

    fields.push(field);
  }

  return fields;
}

export function validateJsonSchema(
  jsonString: string
): { valid: boolean; error?: string; schema?: Record<string, unknown> } {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { valid: false, error: 'Schema must be a JSON object' };
    }
    if (!parsed.type) {
      return {
        valid: false,
        error: 'Schema must have a "type" property',
      };
    }
    return { valid: true, schema: parsed };
  } catch (e) {
    return {
      valid: false,
      error: `Invalid JSON: ${(e as Error).message}`,
    };
  }
}
