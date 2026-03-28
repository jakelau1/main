# Where to Poop: Toronto

## Admin page

Open `admin/index.html` locally or on your GitHub Pages site.

What it does now:
- queues multiple new reviews in one admin session
- builds one consolidated updated `script.js`
- builds one `index.html` page for each queued review
- downloads a single zip bundle containing all generated files

What it cannot do:
- publish directly to GitHub
- edit files already in your repository without you uploading the generated bundle

Recommended flow:
1. Open `admin/index.html`
2. Add each new review to the batch
3. Download the GitHub upload bundle
4. Extract it locally
5. Upload the changed files to your GitHub Pages repository


Featured reviews now display a "Featured Toilet" tag automatically when `featured` is set to `true`.
