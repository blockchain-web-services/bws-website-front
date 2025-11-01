# Update Marketplace Featured Announcement

You need to update the featured announcement in the marketplace section of the home page.

## Task

1. Open the file `src/data/marketplaceAnnouncements.ts`
2. Update the `currentAnnouncement` object with the following structure:

```typescript
{
  title: string,           // Announcement title
  descriptions: string[],  // Array of paragraph texts
  image?: {                // Optional: announcement image
    src: string,
    alt: string,
    loading?: string,      // Usually "lazy"
    sizes?: string,        // Responsive sizes
    srcset?: string        // Responsive image set
  },
  button: {                // Call-to-action button
    text: string,
    href: string,
    target?: string,       // Optional: '_blank' for new tab
    hasArrow?: boolean     // Optional: show arrow icon
  },
  video?: {                // Optional: embedded video
    embedUrl: string,      // Vimeo/YouTube embed URL
    title: string,
    width: string,
    height: string,
    paddingTop: string     // Aspect ratio padding
  },
  link?: {                 // Optional: additional link below video
    text: string,
    href: string,
    target?: string,
    highlightedText?: string  // Text to highlight with span
  }
}
```

3. Save the file
4. Build the site with `npm run build:only` to test
5. The announcement will appear in the marketplace section between the header and solutions grid

## Example

Ask the user for:
- Announcement title
- Description paragraphs (can be multiple)
- Image details (if any)
- Button text and link
- Video embed URL (if any)
- Additional link details (if any)

Then update the `currentAnnouncement` object following the existing pattern.
