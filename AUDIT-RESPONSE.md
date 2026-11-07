# UI audit verification — v5.0.1

Scope: the shipped Harf Writer v5 HTML (673,245 bytes before this patch). The separately named `gemini-code-1792676704422.html` was not attached, so equivalence to that file is not assumed.

## Findings

- Font truncation was not reproduced. Strict base64 decoding and FontTools parsing/checksums passed. The embedded WOFF is 40,804 bytes and its header declares exactly that length. It contains 437 glyphs and covers all 38 Arabic letter/mark codepoints used by the course. Chromium loads the face successfully without decoding errors.
- The new course dialogs benefited from explicit accessible labels, Tab/Shift+Tab wrapping, Escape handling and trigger-focus restoration. Return to Home now restores focus to the newly rendered launch button rather than a removed element.
- Canvas resizing now skips no-op resets, cancels stale resize frames and updates its backing store on window resizing. Only a real canvas size change interrupts an unfinished stroke; completed strokes remain intact.
- Embedded lesson, course and string data is minified only in the built HTML. Source JSON remains readable. The built file is now 461,189 bytes, a reduction of 212,056 bytes (31.5%). No font, lesson, Arabic mark or offline capability was removed.

## Verification

`tests/ui-audit.cjs` passed against the self-contained HTML: WOFF header/length, actual browser font decoding, labelled dialogs, forward/reverse Tab wrapping, Escape, trigger and Home focus restoration, portrait/landscape/shortened viewports, ink retention and DPR scaling. Existing course, source-integrity, clipping and 51 geometry regression checks pass.

These are headless Chromium tests. A shortened viewport is not a physical software-keyboard test; browser-chrome behavior on physical Android and Safari still needs device testing. No production integration or deployment occurred.
