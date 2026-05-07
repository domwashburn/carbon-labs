# ComparisonString

> ComparisonString component for displaying segmented strings with comparison highlighting.

## Usage

```jsx
import { ComparisonString } from '@carbon-labs/react-comparison-string';

const segmentedString = [
  { segment: 'Hello', comparison: 'isSame' },
  { segment: 'World', comparison: 'isDifferent' }
];

<ComparisonString
  segmentedString={segmentedString}
  compareMode={true}
  highlightIsSame={true}
  highlightIsDifferent={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segmentedString` | `Array` | - | Array of segment objects with `segment` and `comparison` properties |
| `compareMode` | `boolean` | `false` | Enable comparison mode styling |
| `highlightIsSame` | `boolean` | `false` | Highlight segments that are the same |
| `highlightIsDifferent` | `boolean` | `false` | Highlight segments that are different |
| `className` | `string` | - | Additional CSS class names |

## Segment Object Structure

```typescript
{
  segment: string;
  comparison: 'isSame' | 'isDifferent';
}