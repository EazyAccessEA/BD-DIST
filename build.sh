#!/bin/bash
# Build script: Assembles src/ files into a single dist/app.html
set -e

SRC="$(dirname "$0")/src"
DIST="$(dirname "$0")/dist"
OUT="$DIST/app.html"

mkdir -p "$DIST"

# Read the HTML template
HTML=$(cat "$SRC/index.html")

# Build CSS block
CSS=""
for f in "$SRC/css/base.css" "$SRC/css/components.css" "$SRC/css/layout.css" "$SRC/css/distribute.css" "$SRC/css/print.css"; do
  CSS="$CSS$(cat "$f")\n"
done

# Build vendor JS block
VENDOR_JS=""
for f in "$SRC/vendor/qrcode-generator.min.js" "$SRC/vendor/html5-qrcode.min.js"; do
  VENDOR_JS="$VENDOR_JS$(cat "$f")\n"
done

# Build app JS block (order matters: dependencies first)
APP_JS=""
for f in \
  "$SRC/js/i18n.js" \
  "$SRC/js/data-manager.js" \
  "$SRC/js/csv-parser.js" \
  "$SRC/js/ui.js" \
  "$SRC/js/qr-generator.js" \
  "$SRC/js/scanner.js" \
  "$SRC/js/search.js" \
  "$SRC/js/distribute.js" \
  "$SRC/js/print-generator.js" \
  "$SRC/js/backup.js" \
  "$SRC/js/stats.js" \
  "$SRC/js/app.js"; do
  APP_JS="$APP_JS$(cat "$f")\n"
done

# Assemble: replace placeholders in HTML
# Use a temp file approach to avoid sed delimiter issues with large content
{
  # Write everything before <!-- APP_CSS -->
  echo '<!DOCTYPE html>'
  echo '<html lang="bn">'
  echo '<head>'
  echo '  <meta charset="UTF-8">'
  echo '  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
  echo '  <meta name="theme-color" content="#1565C0">'
  echo '  <meta name="apple-mobile-web-app-capable" content="yes">'
  echo '  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
  echo '  <title>খাদ্য বিতরণ — Food Distribution</title>'
  echo '  <style>'
  cat "$SRC/css/base.css"
  cat "$SRC/css/components.css"
  cat "$SRC/css/layout.css"
  cat "$SRC/css/distribute.css"
  cat "$SRC/css/print.css"
  echo '  </style>'
  echo '</head>'
  # Extract body content from index.html (between <body> and </body>)
  echo '<body>'
  sed -n '/<body>/,/<\/body>/p' "$SRC/index.html" | tail -n +2 | head -n -1
  # Inject scripts before </body>
  echo '<script>'
  cat "$SRC/vendor/qrcode-generator.min.js"
  echo ''
  cat "$SRC/vendor/html5-qrcode.min.js"
  echo ''
  echo '</script>'
  echo '<script>'
  cat "$SRC/js/i18n.js"
  cat "$SRC/js/data-manager.js"
  cat "$SRC/js/csv-parser.js"
  cat "$SRC/js/ui.js"
  cat "$SRC/js/qr-generator.js"
  cat "$SRC/js/scanner.js"
  cat "$SRC/js/search.js"
  cat "$SRC/js/distribute.js"
  cat "$SRC/js/print-generator.js"
  cat "$SRC/js/backup.js"
  cat "$SRC/js/stats.js"
  cat "$SRC/js/app.js"
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > "$OUT"

SIZE=$(wc -c < "$OUT")
echo "✅ Built: $OUT ($(( SIZE / 1024 )) KB)"
