#!/bin/bash

# Remove size indicators from filenames
echo "Removing size indicators from filenames..."

cd public

# Find all files ending with size indicators like -2114w or -1440w
find . -type f -regex ".*-[0-9]+w$" | while IFS= read -r file; do
  newname=$(echo "$file" | sed 's/-[0-9]\+w$//')
  if [ "$file" != "$newname" ]; then
    echo "Renaming: $file -> $newname"
    mv "$file" "$newname"
  fi
done

echo "Done removing size indicators!"