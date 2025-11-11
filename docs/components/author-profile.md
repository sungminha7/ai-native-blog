# AuthorProfile Component

## Overview

The `AuthorProfile` component displays author information at the bottom of blog posts. It renders a profile section with an avatar (image or fallback initial), author name, optional bio, and optional link to the author's profile or website. The component automatically handles cases where no author is provided by returning null.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `author` | `string` | No | `undefined` | The author's name. If not provided, the component renders nothing. Note: " Sir" is automatically appended to the display name. |
| `authorBio` | `string` | No | `undefined` | A brief biography or description of the author. Only displayed if provided. |
| `authorImage` | `string` | No | `undefined` | URL or path to the author's profile image. If not provided, a fallback avatar with the author's initial is displayed. |
| `authorUrl` | `string` | No | `undefined` | URL to the author's profile page or website. If provided, the author's name becomes a clickable link that opens in a new tab. |

## Component Behavior

### Conditional Rendering

- **No Author**: If the `author` prop is not provided, the component returns `null` and nothing is rendered.
- **Author Name Display**: The author name is always suffixed with " Sir" in the display.

### Avatar Behavior

The component provides two avatar display modes:

1. **Image Avatar** (when `authorImage` is provided):
   - Displays using Next.js `Image` component for optimized loading
   - Size: 64x64 pixels
   - Rounded full circle
   - Alt text uses the author's name for accessibility

2. **Fallback Avatar** (when `authorImage` is not provided):
   - Displays a circular background with the first letter of the author's name
   - Letter is automatically capitalized
   - Uses neutral colors that adapt to light/dark mode
   - Same size as image avatar for consistency

### Link Behavior

- **With URL** (when `authorUrl` is provided):
  - Author name becomes a clickable `Link` component
  - Opens in a new tab (`target="_blank"`)
  - Includes security attributes (`rel="noopener noreferrer"`)
  - Hover effect changes text color with smooth transition

- **Without URL** (when `authorUrl` is not provided):
  - Author name displays as an `h3` heading
  - No interactive behavior

## Usage Examples

### Basic Usage (Minimal Props)

```tsx
import { AuthorProfile } from '@/app/components/author-profile'

export default function BlogPost() {
  return (
    <article>
      {/* Blog post content */}

      <AuthorProfile author="John Doe" />
    </article>
  )
}
```

This renders a simple author profile with a fallback avatar showing "J" and the name "John Doe Sir".

### Common Usage (With Bio and Image)

```tsx
import { AuthorProfile } from '@/app/components/author-profile'

export default function BlogPost() {
  return (
    <article>
      {/* Blog post content */}

      <AuthorProfile
        author="Jane Smith"
        authorBio="Full-stack developer passionate about React and Next.js. Writing about web development and best practices."
        authorImage="/images/authors/jane-smith.jpg"
      />
    </article>
  )
}
```

This displays a complete profile with an image, name, and bio description.

### Full Usage (All Props)

```tsx
import { AuthorProfile } from '@/app/components/author-profile'

export default function BlogPost() {
  return (
    <article>
      {/* Blog post content */}

      <AuthorProfile
        author="Alex Johnson"
        authorBio="Tech lead and open source contributor. Specializing in TypeScript, React, and Node.js. Always learning and sharing knowledge."
        authorImage="/images/authors/alex-johnson.jpg"
        authorUrl="https://alexjohnson.dev"
      />
    </article>
  )
}
```

This renders the full-featured profile with a clickable author name that links to an external website.

### Dynamic Usage (From Blog Post Data)

```tsx
import { AuthorProfile } from '@/app/components/author-profile'
import { BlogPost } from '@/types/blog'

interface BlogPostPageProps {
  post: BlogPost
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <AuthorProfile
        author={post.author}
        authorBio={post.authorBio}
        authorImage={post.authorImage}
        authorUrl={post.authorUrl}
      />
    </article>
  )
}
```

This demonstrates typical usage where author data comes from a blog post object.

### Hidden Profile (No Author)

```tsx
import { AuthorProfile } from '@/app/components/author-profile'

export default function BlogPost() {
  return (
    <article>
      {/* Blog post content */}

      {/* This renders nothing */}
      <AuthorProfile />
    </article>
  )
}
```

When no author is provided, the component renders nothing (returns `null`).

## Styling Notes

### Layout and Spacing

- **Container**: Uses `mt-12 pt-8` to create significant spacing from content above
- **Border**: Top border (`border-t`) visually separates the author section from post content
- **Flexbox**: Uses `flex items-start gap-4` for horizontal layout with avatar and content
- **Avatar**: Fixed size with `flex-shrink-0` to prevent squishing
- **Content Area**: Uses `flex-grow min-w-0` to fill available space and handle text overflow

### Dark Mode Support

The component fully supports dark mode using Tailwind's `dark:` variant:

- **Border**: `border-neutral-200 dark:border-neutral-800`
- **Background** (fallback avatar): `bg-neutral-200 dark:bg-neutral-800`
- **Text Colors**:
  - Author name: `text-neutral-900 dark:text-neutral-100`
  - Bio text: `text-neutral-600 dark:text-neutral-400`
  - Fallback avatar letter: `text-neutral-600 dark:text-neutral-400`
- **Hover States**: `hover:text-neutral-600 dark:hover:text-neutral-400`

### Responsive Design

- **Flex Wrap**: Uses `flex-wrap` on author name container to handle long names
- **Min Width**: `min-w-0` prevents flex item from overflowing container
- **Text Truncation**: Natural text wrapping for long bios with `leading-relaxed`

### Typography

- **Author Name**: `text-lg font-medium` for prominence
- **Bio**: `text-sm` with `leading-relaxed` for comfortable reading
- **Fallback Initial**: `text-2xl font-medium` to fill avatar space

## Accessibility Considerations

### Semantic HTML

- Uses proper heading element (`h3`) for non-linked author names
- Maintains document outline structure

### Images

- All author images include meaningful `alt` text using the author's name
- Proper width and height attributes prevent layout shift

### Links

- External links include `rel="noopener noreferrer"` for security
- Links open in new tab (`target="_blank"`) to preserve user's reading context
- Adequate hover states with smooth transitions provide visual feedback

### Color Contrast

- Text colors meet WCAG contrast requirements in both light and dark modes
- Fallback avatar maintains sufficient contrast between background and text
- Hover states maintain readable contrast ratios

### Keyboard Navigation

- Links are fully keyboard accessible (tab navigation, enter to activate)
- No custom interactive elements that could break keyboard flow

## Implementation Notes

### Next.js Integration

- Uses Next.js `Image` component for automatic image optimization
- Uses Next.js `Link` component for client-side navigation (if needed)
- Compatible with Next.js 13+ App Router and Pages Router

### Performance

- Image component provides automatic lazy loading and optimization
- No client-side JavaScript required for basic functionality
- Minimal CSS footprint using Tailwind utility classes

### Customization

The component currently hardcodes " Sir" as a suffix to author names (line 51, 55). To customize or remove this:

```tsx
// Current behavior
{author} Sir

// To remove suffix, modify the component:
{author}

// To make it configurable, add a prop:
interface AuthorProfileProps {
  author?: string
  authorSuffix?: string  // Add this
  // ... other props
}

// Then use:
{author}{authorSuffix || ''}
```

## Dependencies

- `next/image` - For optimized image rendering
- `next/link` - For internal/external navigation
- Tailwind CSS - For styling

## Related Components

This component is typically used in blog post pages alongside:
- Blog post content components
- Comment sections
- Related posts sections
- Social sharing buttons

## Migration Notes

If updating from a previous version without the AuthorProfile component, ensure your blog post data structure includes the optional author fields:

```typescript
interface BlogPost {
  // ... existing fields
  author?: string
  authorBio?: string
  authorImage?: string
  authorUrl?: string
}
```

## Testing Considerations

When testing this component, verify:

1. **Conditional rendering**: Component returns null when no author provided
2. **Avatar fallback**: Correct initial is displayed when no image provided
3. **Link behavior**: Author name links correctly when URL provided
4. **Accessibility**: Alt text, link attributes, and semantic HTML are correct
5. **Dark mode**: All color variants render correctly in both modes
6. **Responsive layout**: Component adapts properly to different screen sizes
