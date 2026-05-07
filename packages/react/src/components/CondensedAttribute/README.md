# CondensedAttribute

> CondensedAttribute component for displaying attribute values in a clean and readable format with expandable field lists.

## Usage

```jsx
import { CondensedAttribute } from '@carbon-labs/react-condensed-attribute';

const attribute = {
  displayLabel: 'Customer Name',
  type: 'string',
  hasOverlay: false,
  isGoverned: 'partial'
};

const fields = [
  {
    fieldLabel: 'First Name',
    fieldValue: {
      string: 'John',
      segments: [{ segment: 'John', comparison: 'isSame' }]
    }
  },
  {
    fieldLabel: 'Last Name',
    fieldValue: {
      string: 'Doe',
      segments: [{ segment: 'Doe', comparison: 'isDifferent' }]
    }
  }
];

<CondensedAttribute
  attribute={attribute}
  fields={fields}
  delimiter=", "
  openByDefault={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `attribute` | `Object` | - | Attribute metadata object with displayLabel, type, hasOverlay, isGoverned |
| `fields` | `Array` | - | Array of field objects with fieldLabel and fieldValue |
| `delimiter` | `string` | `', '` | Custom delimiter for separating field values |
| `openByDefault` | `boolean` | `false` | Whether the field list is expanded by default |
| `hasOverlay` | `boolean` | `true` | Whether to show overlay indicator |

## Sub-components

The component exports several sub-components that can be used independently:

- `CondensedAttribute.Header` - The header section with attribute label and icons
- `CondensedAttribute.FieldList` - The expandable list of fields
- `CondensedAttribute.Field` - Individual field item

## Field Object Structure

```typescript
{
  fieldLabel: string;
  fieldValue: {
    string: string;
    segments: Array<{
      segment: string;
      comparison: 'isSame' | 'isDifferent';
    }>;
  };
  delimiter?: string; // Optional custom delimiter for this field
}
```

## Attribute Object Structure

```typescript
{
  displayLabel: string;
  type: string;
  hasOverlay?: boolean;
  isGoverned?: 'full' | 'partial' | null;
}