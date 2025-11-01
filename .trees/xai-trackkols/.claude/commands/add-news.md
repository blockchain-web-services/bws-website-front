# Add News Item to Home Page Carousel

You need to add a new news item to the news carousel on the home page.

## Task

1. Open the file `src/data/news.ts`
2. Add a new news item to the `newsItems` array with the following structure:

```typescript
{
  title: string,           // Main announcement title
  description: string,     // Description text
  partnershipTitle?: string,  // Optional partnership section title
  logos: [                 // Array of partner logos
    {
      src: string,         // Path to logo image
      alt: string,         // Alt text for accessibility
      href: string,        // Link URL
      class: string        // CSS class for styling
    }
  ],
  buttons: [               // Array of action buttons
    {
      text: string,        // Button text
      href: string,        // Button link
      type: 'primary' | 'secondary',  // Button style
      target?: string,     // Optional: '_blank' for new tab
      hasArrow?: boolean   // Optional: show arrow icon
    }
  ],
  backgroundClass?: string  // Optional: CSS class for background image
}
```

3. Save the file
4. Build the site with `npm run build:only` to test
5. The carousel will automatically include your new news item with auto-rotation

## Example

Ask the user for:
- The announcement title
- Description text
- Partner logos (if any)
- Button links and text
- Background image class (optional)

Then add it to the array following the existing pattern.
