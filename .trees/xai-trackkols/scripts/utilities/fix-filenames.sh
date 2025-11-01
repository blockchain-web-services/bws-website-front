#!/bin/bash

# Find and rename all files with spaces or special characters
echo "Fixing file names with spaces or special characters..."

cd public/assets/images

# Find all files with spaces and rename them
find . -type f -name "* *" | while IFS= read -r file; do
  newname=$(echo "$file" | sed 's/ /-/g')
  if [ "$file" != "$newname" ]; then
    echo "Renaming: $file -> $newname"
    mv "$file" "$newname"
  fi
done

# Find all files with % characters and rename them
find . -type f -name "*%*" | while IFS= read -r file; do
  newname=$(echo "$file" | sed 's/%2B/plus/g; s/%20/-/g; s/%2F/-/g; s/%3A/-/g; s/%3F/-/g; s/%3D/-/g; s/%/_/g')
  if [ "$file" != "$newname" ]; then
    echo "Renaming: $file -> $newname"
    mv "$file" "$newname"
  fi
done

echo "Done fixing file names!"