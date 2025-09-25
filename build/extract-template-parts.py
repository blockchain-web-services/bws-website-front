#!/usr/bin/env python3
"""
Extract template parts from index.html for creating the template system
"""

import os

# Read the original index.html
with open('_site/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find key positions
nav_start = html.find('<div data-poster-url=')
nav_end = html.find('</div></div></div></div></div></div></div><div class="section hero-section home">')
footer_start = html.find('<footer class="footer">')
footer_end = html.find('</html>')

print(f"Navigation starts at: {nav_start}")
print(f"Navigation ends at: {nav_end}")
print(f"Footer starts at: {footer_start}")
print(f"Footer ends at: {footer_end + 7}")  # +7 for </html>

# Extract head section (from start to navigation start)
head_content = html[0:nav_start]

# Extract header/navigation section
header_content = html[nav_start:nav_end + len('</div></div></div></div></div></div></div>')]

# Extract main content
main_content = html[nav_end + len('</div></div></div></div></div></div></div>'):footer_start]

# Extract footer section (including closing scripts and tags)
footer_content = html[footer_start:footer_end + 7]  # +7 for </html>

# Create output directory if it doesn't exist
os.makedirs('src/_includes/partials', exist_ok=True)
os.makedirs('src/_includes/layouts', exist_ok=True)

# Save the parts
with open('src/_includes/partials/head.njk', 'w', encoding='utf-8') as f:
    f.write(head_content)

with open('src/_includes/partials/header.njk', 'w', encoding='utf-8') as f:
    f.write(header_content)

with open('src/_includes/partials/footer.njk', 'w', encoding='utf-8') as f:
    f.write(footer_content)

# Save main content for the test file
with open('src/test-index-content.html', 'w', encoding='utf-8') as f:
    f.write(main_content)

print("\nFiles created:")
print("- src/_includes/partials/head.njk")
print("- src/_includes/partials/header.njk")
print("- src/_includes/partials/footer.njk")
print("- src/test-index-content.html (main content for test)")

# Verify total length matches
total_length = len(head_content) + len(header_content) + len(main_content) + len(footer_content)
original_length = len(html)
print(f"\nOriginal file length: {original_length}")
print(f"Combined parts length: {total_length}")
print(f"Match: {total_length == original_length}")