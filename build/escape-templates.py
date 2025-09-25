#!/usr/bin/env python3
"""
Escape Nunjucks template syntax in the extracted partials
"""

import os

def escape_nunjucks(content):
    """Escape {{ and {% in content to work with Nunjucks"""
    # Use raw blocks to escape template syntax
    # Find all occurrences of template syntax and wrap in raw blocks
    content = content.replace('{{', '{{ "{{" }}')
    content = content.replace('}}', '{{ "}}" }}')
    return content

# Files to process
files = [
    'src/_includes/partials/head.njk',
    'src/_includes/partials/header.njk',
    'src/_includes/partials/footer.njk'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file contains template syntax that needs escaping
    if '{{' in content or '{%' in content:
        # Wrap the entire content in a raw block
        escaped_content = '{% raw %}\n' + content + '\n{% endraw %}'

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(escaped_content)

        print(f"Escaped template syntax in {file_path}")
    else:
        print(f"No template syntax to escape in {file_path}")

print("\nDone! Templates are now safe for Nunjucks processing.")