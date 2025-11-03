# Add Marketplace Solution to Home Page

You need to add a new marketplace solution to the solutions grid on the home page.

## Task

1. Open the file `src/data/solutions.ts`
2. Add a new solution to the `solutions` array with the following structure:

```typescript
{
  title: string,           // Solution name
  author: string,          // Usually "BWS"
  description: string,     // Brief description
  image: {
    src: string,           // Path to solution image
    alt: string,           // Alt text for accessibility
    sizes?: string,        // Optional: responsive sizes
    srcset?: string        // Optional: responsive image set
  },
  url: string,             // Link to solution detail page
  networks: [              // Supported blockchain networks
    {
      name: string,        // Network name (e.g., "Polygon", "Ethereum")
      color: string        // Network badge color (CSS color value)
    }
  ],
  category: string         // Filter category: "Database", "NFT", "Credentials", "ESG", "Socials"
}
```

3. Save the file
4. Build the site with `npm run build:only` to test
5. The solution will automatically appear in the marketplace grid

## Network Colors Reference

Common network colors:
- Polygon: `#af89ee`
- Matchain: `hsla(20, 100.00%, 54.02%, 1.00)`
- Ethereum: `hsla(230.43478260869568, 100.00%, 72.94%, 1.00)`
- IPFS: `hsla(314, 90.64%, 38.40%, 1.00)`

## Example

Ask the user for:
- Solution name and description
- Image path
- Link to detail page
- Supported networks
- Category for filtering

Then add it to the array following the existing pattern.
