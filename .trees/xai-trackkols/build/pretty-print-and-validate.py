#!/usr/bin/env python3
"""
Pretty print and validate all HTML files in _site directory
"""

import os
import subprocess
from pathlib import Path
from bs4 import BeautifulSoup, Comment
import html5lib
from html5lib import parse
import json

def find_html_files(directory):
    """Find all HTML files in directory and subdirectories"""
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return sorted(html_files)

def pretty_print_html(file_path):
    """Pretty print HTML file using BeautifulSoup"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse and prettify
        soup = BeautifulSoup(content, 'html.parser')
        pretty_html = soup.prettify()

        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(pretty_html)

        return True, "Pretty printed successfully"
    except Exception as e:
        return False, f"Error pretty printing: {str(e)}"

def validate_html(file_path):
    """Validate HTML5 syntax"""
    errors = []
    warnings = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse with html5lib which performs validation
        parser = html5lib.HTMLParser(strict=True)
        try:
            document = parser.parse(content)
            # If parsing succeeds, basic structure is valid

            # Additional checks using BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')

            # Check for required elements
            if not soup.find('html'):
                errors.append("Missing <html> tag")
            if not soup.find('head'):
                errors.append("Missing <head> tag")
            if not soup.find('title'):
                warnings.append("Missing <title> tag")
            if not soup.find('body'):
                errors.append("Missing <body> tag")

            # Check for DOCTYPE
            if not content.strip().lower().startswith('<!doctype'):
                warnings.append("Missing DOCTYPE declaration")

            # Check for duplicate IDs
            ids = {}
            for element in soup.find_all(id=True):
                elem_id = element.get('id')
                if elem_id in ids:
                    errors.append(f"Duplicate ID found: '{elem_id}'")
                else:
                    ids[elem_id] = True

            # Check for unclosed tags (BeautifulSoup auto-closes, so we check the original)
            # This is a simple check for common unclosed tags
            open_tags = content.count('<div')
            close_tags = content.count('</div>')
            if open_tags != close_tags:
                warnings.append(f"Mismatched div tags: {open_tags} opening, {close_tags} closing")

            # Check for empty alt attributes on images
            for img in soup.find_all('img'):
                if not img.get('alt'):
                    warnings.append(f"Image missing alt attribute: {img.get('src', 'unknown')}")

        except Exception as e:
            errors.append(f"HTML5 parsing error: {str(e)}")

    except Exception as e:
        errors.append(f"File reading error: {str(e)}")

    return errors, warnings

def main():
    """Main function to process all HTML files"""
    site_dir = '_site'
    html_files = find_html_files(site_dir)

    print(f"Found {len(html_files)} HTML files in {site_dir}\n")
    print("=" * 80)

    results = {
        'total_files': len(html_files),
        'pretty_printed': 0,
        'validation_passed': 0,
        'validation_errors': 0,
        'validation_warnings': 0,
        'files': []
    }

    for file_path in html_files:
        relative_path = os.path.relpath(file_path, site_dir)
        print(f"\nProcessing: {relative_path}")
        print("-" * 40)

        file_result = {
            'path': relative_path,
            'pretty_print': False,
            'errors': [],
            'warnings': []
        }

        # Pretty print
        success, message = pretty_print_html(file_path)
        if success:
            print(f"  ✓ Pretty printed")
            results['pretty_printed'] += 1
            file_result['pretty_print'] = True
        else:
            print(f"  ✗ Pretty print failed: {message}")

        # Validate
        errors, warnings = validate_html(file_path)
        file_result['errors'] = errors
        file_result['warnings'] = warnings

        if errors:
            print(f"  ✗ Validation errors ({len(errors)}):")
            for error in errors[:5]:  # Show first 5 errors
                print(f"    - {error}")
            if len(errors) > 5:
                print(f"    ... and {len(errors) - 5} more errors")
            results['validation_errors'] += 1
        else:
            print(f"  ✓ Validation passed")
            results['validation_passed'] += 1

        if warnings:
            print(f"  ⚠ Warnings ({len(warnings)}):")
            for warning in warnings[:3]:  # Show first 3 warnings
                print(f"    - {warning}")
            if len(warnings) > 3:
                print(f"    ... and {len(warnings) - 3} more warnings")
            results['validation_warnings'] += 1

        results['files'].append(file_result)

    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total files processed: {results['total_files']}")
    print(f"Successfully pretty printed: {results['pretty_printed']}")
    print(f"Validation passed: {results['validation_passed']}")
    print(f"Files with errors: {results['validation_errors']}")
    print(f"Files with warnings: {results['validation_warnings']}")

    # Save detailed results to JSON
    with open('validation-results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nDetailed results saved to validation-results.json")

    # Create a summary of files with errors
    if results['validation_errors'] > 0:
        print("\n" + "=" * 80)
        print("FILES WITH ERRORS:")
        print("=" * 80)
        for file_data in results['files']:
            if file_data['errors']:
                print(f"\n{file_data['path']}:")
                for error in file_data['errors']:
                    print(f"  - {error}")

if __name__ == "__main__":
    main()