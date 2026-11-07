# Khatti v6.19.0 — HTTPS package

## Hosting at qariai.app/khatti/

- Upload this folder's contents to the `/khatti/` directory only. `sw.js` lives there, never in the QariAI site root.
- Redirect `/khatti` to `/khatti/` with a 301. The package uses relative paths and a `./` worker scope, so loading it without the trailing slash resolves assets against the site root and breaks the worker and icons.
- Do not apply a single-page-app catch-all rewrite to `/khatti/`; missing files must return 404.
- Public name: Khatti. Storage keys (`harf.*`) and the font name are internal and intentionally unchanged, so existing local progress and backups keep working.

## Every release — step 1

Run `node stamp.js` inside this package folder **after all edits and before every upload**. The source build runs this automatically too. It hashes the shipped HTML, client script, manifest, both app icons, the 180px Apple icon and the worker logic. The resulting stamp updates `sw.js` so browsers can discover the new release. A second run without changes is deterministic. Missing assets or a malformed worker marker stop the command with an error; do not upload after a failed stamp.

Upload all files in this folder to one dedicated HTTPS directory. Keep index.html, pwa.js, sw.js, manifest.webmanifest and icons/ together. Include the separate 180×180 Apple touch icon; the manifest declares 192px and 512px entries separately for `any` and `maskable`. The app uses relative paths and scopes its worker/cache to that directory. Do not move sw.js to the main QariAI root. No server API is required.

Serve JavaScript as text/javascript, the manifest as application/manifest+json, PNGs as image/png and HTML as text/html. Serve index.html, pwa.js, sw.js and manifest.webmanifest with Cache-Control: no-cache so browsers can discover releases. Do not rewrite missing worker or icon requests to HTML. Replace the whole package together on each release. Do not change the hosting path between updates unless deliberately starting a separate local store.

After the first online load, open More → Install & offline and wait for offline readiness. Install via Android/browser Install, or Safari Share → Add to Home Screen. Close the tab, disable networking and reopen the same address or installed app. Test a subsequent release: Update available should appear; the old app remains active until Update now is chosen. Local saved progress should remain.

Before changing browser, origin or a saved file, use More → Export / import progress. Keep a current JSON backup; importing replaces this origin's Harf progress rather than merging. Browser storage may be cleared or evicted, including after non-use. Installation is not a backup guarantee.

This folder is intended for HTTPS hosting. For double-click offline use, use the separate Harf-Writer-v5-Complete-Ayahs.html download; file:// cannot install a service worker.

Validation completed on local HTTPS with a self-signed test certificate. A production URL, physical-device installation, Pencil/palm testing, mobile address-bar collapse and a real screen-reader listening pass remain open. Nothing has been deployed to live QariAI.

Safari retention note: WebKit documents a seven-day cap on script-writable site storage without interaction (counted as Safari-use days), with a Home Screen web-app exemption. This does not protect against all storage eviction or user clearing. Reference: https://webkit.org/tracking-prevention/
