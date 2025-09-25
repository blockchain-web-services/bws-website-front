#!/usr/bin/env python3
"""
Extract content sections from all HTML pages in _site directory
"""

import os
from pathlib import Path

# Define the byte positions for header and footer (same for all pages based on Webflow export)
HEADER_START = 4247
HEADER_END = 23601
FOOTER_START = -7691  # From end of file

def extract_content(html_file_path):
    """Extract the main content section from an HTML file"""
    with open(html_file_path, 'rb') as f:
        content = f.read()

    # Extract the main content (between header and footer)
    main_content = content[HEADER_END:FOOTER_START]

    return main_content

def create_page_template(html_file_path, output_dir):
    """Create a Nunjucks template for a specific page"""
    # Get relative path for the page
    relative_path = os.path.relpath(html_file_path, '_site')

    # Extract content
    content = extract_content(html_file_path)

    # Create output path maintaining directory structure
    output_path = os.path.join(output_dir, relative_path.replace('.html', '.njk'))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Create the template file with front matter
    with open(output_path, 'wb') as f:
        # Write front matter
        front_matter = f"""---
layout: layouts/base.njk
permalink: /{relative_path}
---
""".encode('utf-8')
        f.write(front_matter)

        # Write the content wrapped in {% raw %} tags to escape any Nunjucks syntax
        f.write(b'{% raw %}\n')
        f.write(content)
        f.write(b'\n{% endraw %}')

    return output_path

def main():
    """Process all HTML files in _site directory"""
    output_dir = 'src'
    processed_files = []

    # Find all HTML files
    for root, dirs, files in os.walk('_site'):
        # Skip backup directory
        if '_site_backup' in root:
            continue

        for file in files:
            if file.endswith('.html'):
                html_path = os.path.join(root, file)

                try:
                    template_path = create_page_template(html_path, output_dir)
                    processed_files.append({
                        'original': html_path,
                        'template': template_path
                    })
                    print(f"✓ Created template for: {os.path.relpath(html_path, '_site')}")
                except Exception as e:
                    print(f"✗ Error processing {html_path}: {e}")

    print(f"\n{'='*60}")
    print(f"Created {len(processed_files)} templates in {output_dir}/")

    # Save mapping for reference
    with open('template-mapping.txt', 'w') as f:
        for item in processed_files:
            f.write(f"{item['original']} -> {item['template']}\n")

    print("Template mapping saved to template-mapping.txt")

if __name__ == "__main__":
    main()