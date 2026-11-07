## v6.15.2 — release-package hardening

The extracted PWA package includes a portable `stamp.js`. Every release begins with `node stamp.js` after all edits and before upload, as step 1 in HOSTING.md. The source build also runs it automatically. The stamp hashes the actual shipped index, PWA client, manifest, 192/512px app icons, 180px Apple icon and normalized worker logic, then updates the versioned cache marker in sw.js. It is deterministic; missing assets and malformed/ambiguous markers fail without rewriting the worker. This closes the manual-edit release gap as well as covering manifest/icon changes.

The manifest now declares four separate icon entries: 192 and 512 for any, and 192 and 512 for maskable, sharing the existing safe-zone artwork. A separate 180×180 Apple touch icon is linked and precached. HOSTING.md adds manifest.webmanifest to the required Cache-Control: no-cache list. The Latin H artwork is unchanged; no new brand direction is implied.

Validation: pure release tests mutate every shipped runtime asset and the worker logic, verify changed stamps, deterministic re-stamping, error handling, icon dimensions and manifest purposes. Local HTTPS testing now edits the actual temporary index and executes the shipped stamp.js instead of manually substituting a worker version; it verifies Update available, explicit activation, cache cleanup, retained progress and closed-tab offline reopen. The standalone file:// launcher still opens without CORS errors. Pure geometry/progress regressions pass. Production HTTPS deployment, installed-device acceptance, touch/Pencil/screen-reader checks and named written calligrapher approval remain open. No live QariAI or marketing Site deployment.

## v6.15.1 — minor visual audit corrections

Connected-word teaser copy reserves 28px on its inline end to protect the arrow. Watch now has an explicit complete authored-model underlay (24% teal in light mode, 32% pale mint in dark mode), independent of trace opacity. This uses the same stroke geometry as the nib animation and never substitutes an unrelated typeset glyph. The extra nuqta diamond column is suppressed on letter studies so it does not compete with the model; the nuqta lesson remains a dot exercise. Pixel checks confirm the full Ba curve is visible ahead of the paused nib.

The compact portrait overlay allows a 44dvh canvas (about 250px at 320×568) while keeping controls visible without internal scrolling. Light and dark viewport checks pass at all three sizes in both source and standalone builds. Visual review covered the ten updated views; a low-contrast selected brush label in the dark Tools sheet was corrected, along with its replay-link colour. A computed selected-brush text contrast check passes.

The screenshot review now contains 60 PNGs plus a browsable index: light/dark × 320×568, 390×844 and 800×360 × ten views (including separate Alif and Ba Watch captures). Pure tests, backup download/import/reload and local HTTPS PWA offline/update tests pass. No public deployment. Hardware and production-host acceptance remain open; this is not an accessibility certification for every optional screen.

## v6.15 — shared visual system and focused learning entry

Studio, library and dialogs share the `--studio-bg` token (cream in light mode, a matching dark token when dark mode is enabled). The main header lockup is Harf Writer · by QariAI. Navigation arrows use →, ink counters have visible unit labels, and the light header stat uses #4f5f56.

Learn opens with one back link and the Start first lesson / Continue card, followed by the three study paths. Replay introduction and Export / import progress are available in About; the duplicate library heading is removed. Dialog close controls are round, sliders use #087f67 accent, and compact portrait overlay/backup layouts use 14px padding without internal scrolling at 320×568. Long optional content still scrolls normally.

Watch shows one concise instruction, suppresses duplicate hints/captions and paints the complete target at 16% opacity beneath the animated nib independently of the trace opacity preference. Its compact layout keeps Try tracing visible at the acceptance sizes; short landscape places controls beside the paper. Drawing/evaluation and progress formats remain unchanged (backup schema v1; app metadata 6.15.0).

Validation: source and standalone browser checks pass at 320×568, 390×844 and 800×360 with no console errors, no horizontal overflow, visible Watch action and targets at least 44px. Portrait overlay/backup no-scroll, slider accent and round close controls are checked. JSON download/import/reload and pure rollback/schema tests pass. Screenshots cover nine updated views at all three sizes (27 PNGs plus index). Local HTTPS PWA update/offline testing remains separate from production hosting and hardware acceptance. No deployment or live QariAI changes.

## v6.14.1 — audit follow-up

Short-landscape comparison now uses a two-column layout with canvas on the left and layers/opacity on the right. At 800×360 and 667×320 the controls are visible and hit-testable without scrolling. Collect feedback now includes a direct Compare overlay button after an attempted guide check; the Brush entry and guided-study result entries remain.

After the first successfully saved letter, movement study, connected piece, name comparison, ayah piece or My work artwork, a dismissible one-line backup reminder offers Back up your work. It is shown once per local progress store, persists its seen state, and is reset by Clear local work. Session-only save failures do not trigger it. Install help explicitly points to progress transfer; the import dialog offers Download current progress first before its confirmation step.

Backup metadata now matches app version 6.14.1. Schema remains v1, with an explicit migration dispatcher that accepts v1 and rejects undefined future/v2 formats with a newer-version message instead of guessing a conversion. Pure tests check app-version parity.

Validation: source and standalone browser checks pass for post-Collect entry, landscape control visibility, one-time reminder and backup action. Existing JSON download/import/reload and schema/quota rollback tests pass. Local HTTPS PWA registration, explicit update waiting/activation, retained progress, unrelated-cache preservation and closed-tab offline reopening pass again. The landscape comparison was visually inspected. Hardware Pencil/palm behaviour, a real collapsing address bar, VoiceOver/TalkBack and production-host acceptance remain open. No hosting deployment or live QariAI changes.

## v6.14 — overlay, progress transfer and offline package

**Compare:** Letter drawing → Brush → Compare overlay. Guided movement and calibration results → Compare overlay. Teal reference and plum learner ink share one fitted transform; overlay/reference/ink modes and a reference-opacity slider support visual self-check. Both layers fit the same union of reference and ink bounds, including small marks. Original ink, scoring and review provenance are unchanged. Typeset ayah and name comparison screens retain their existing layouts.

**Move progress:** Studio More or Learn → Export / import progress. A versioned JSON backup includes saved local drafts, collections, creative rewards and preferences across the app. Calibration captures and unrelated origin storage are excluded. Session-only unsaved work is not exported. Import validates its namespace, format, limits, geometry and supported section structures, previews the section count/date, and requires confirmation that a current backup is kept. It replaces Harf progress rather than merging; quota failures attempt full rollback before reporting failure. Reload handlers are prevented from overwriting restored state. This is local portability, not cloud sync or score verification.

**PWA:** `dist/pwa/` is a separate static HTTPS package with manifest, 192/512px icons, a separate service worker and a content-versioned scope-specific cache. The first successful online visit precaches the complete self-contained app. Later updates wait for an explicit Update now action; draft flush occurs before activation/reload. Only this app scope's old caches are deleted. More → Install & offline provides installation help and an update check. Saved standalone HTML does not register a worker. Browser storage can be evicted or cleared; installation and JSON backups are advised without promising permanent retention. File copies, hosted paths and browsers have separate local storage.

**Validation:** Pure suite and source/standalone browser tests pass for overlay controls without ink mutation, JSON download/rejection/import/reload, sidebar parity and current-page semantics. The saved-file launcher still passes without CORS errors. Local HTTPS (self-signed test certificate, browser certificate override) verifies secure-context registration, cached files, explicit update waiting/activation, unrelated-cache retention, progress retention, closed-tab offline reopen and offline alphabet navigation. This is not a production-host test or physical install test. Pencil/palm behaviour, a real collapsing mobile address bar and VoiceOver/TalkBack remain hardware acceptance items. No deployment or live QariAI changes were made. Hosted preview remains v6.10; announcement/landing work waits for a fixed hosting URL.

## v6.13.1 — internal-audit corrections

Intro dialogs now use a scrollable content region with a separate sticky action footer; illustrations are hidden below 640px viewport height. Start remains visible and hit-testable without scrolling at 320×568, 390×844 and 800×360. Library navigation uses the spark for Create and equal-width Create / Learn / Practice / About labels. Icon targets have a 44px minimum width; the library control audit finds no unnamed buttons. New learners see Start first lesson; existing lastActivity switches this to Continue practice.

Best-effort pen filtering now waits one second after pen lift and shows/announces “Pen just used — touch resumes in a moment” when touch is blocked. About reflects the one-second window. Pointermove still uses cached dimensions. A final pointerup size read is deliberately retained: a same-turn resize can occur before ResizeObserver delivery, and this check prevents distorted ink from being committed. Size-only 2px tolerance remains; viewport position shifts are ignored.

Validation: pure tests, source/standalone intro CTA hit testing, equal navigation sizing, accessible control-name checks, first/returning copy, retained canvas checks and pointer/resize regressions pass. Hardware Pencil/palm behaviour, real screen-reader output and mobile address-bar collapse are still unverified. Internal testing only; no public deployment. PWA/transfer/overlay remain planned for v6.14.

## v6.13 — interaction, navigation and mobile accessibility pass

- Section introductions play once by default. Replay is always available; an explicitly enabled repeat preference remains respected.
- Free-canvas stroke completion, Undo, Redo and Clear update controls/paint in place, retaining the canvas and observer. Clearing restores focus to Tools if the active control becomes disabled.
- Library navigation includes Create and fits four destinations at 320px. A visible Continue card uses the existing movement/ayah resume handler, with an explicit first-study fallback.
- Pointer ownership checks recover on a new pointerdown only when capture has gone. Captured owners block additional pointers. Size checks ignore left/top movement, allow 2px differences, use ResizeObserver caching on moves and verify dimensions at pen-up. Blur, hidden-document and pagehide interrupt active strokes safely. Guard pointermove performs no layout reads; existing drawing coordinate handlers still map pointer coordinates to their current canvas rect.
- Best-effort pen/touch filtering suppresses touch while a pen owns a stroke and for two seconds after pen lift. About describes this limit, plus the lack of equivalent keyboard tracing. This is not hardware palm rejection.
- Persistent live announcements cover free-canvas edits and letter Undo/Clear/failed Collect. Immersive canvas views have screen-reader headings; failed Collect receives focus. Studio More exposes theme and reduced motion; browser theme-color follows the theme. Small fixed 10/11px font declarations are raised to 12px. Touch hover transforms are suppressed and short/landscape toolbars compacted.

Validation: pure suite passes; source and standalone browser checks pass for first-entry/re-entry intros, retained canvas identity, Create/Continue visibility, four-destination 320px nav, theme/motion and accessible announcement/focus DOM. Layout checked at 320×568, 360×800, 800×360 (the landscape interpretation), 1024×768 and 3440×1440, including visible text sizing in the drawing view. All six canvas-family pointer/resize regressions pass. Phone/landscape renders visually inspected. These tests do not substitute for an iPad/Pencil or an actual screen-reader listening pass; both remain acceptance items.

v6.14 remains separate: overlay comparison, progress JSON transfer and HTTPS PWA packaging/update prompts. The saved HTML works offline as a local file; it does not register a service worker. Hosted preview remains v6.10. Live QariAI and the marketing Site were not changed.

## v6.12 — mark matching refinement

The geometry engine now rejects excessive small retracing in sukun, shadda and dagger alif before fixed-count sampling can conceal it. Existing finger/stylus tolerances and mark identity gates remain in place. Non-finite or malformed user/reference points fail safely. Incomplete strokes now report coverage rather than misleadingly returning a good reason. Creative reward particles respect both the in-app reduced-motion setting and the OS preference; sound remains opt-in.

Validation: all pure regressions pass, including 57 new synthetic checks for sparse/dense sampling, duplicate events, scribbles and invalid input, alongside the existing 51 mark/lesson checks. These are synthetic authored-path fixtures, not recorded finger/stylus calibration. No new Surah, review approval, or mastery claim is added. The curriculum remains 4 surahs, 22 ayahs and 109 typeset practice units. Hosted preview remains v6.10. Browser and physical-device acceptance for this revision remain outstanding.

## v6.11 — canvas reliability pass

Letter practice now fits its Naskh specimen and any existing ink inside the usable area between the measured header and dock. Painting and input share a uniform CSS-pixel transform; the transform is captured at stroke start. Logical glyph coordinates remain 0–600 with the existing permitted outer range, and saved drafts, evaluation, thumbnails and exports keep their original coordinate format. Portrait guides use substantially more of the available workspace without CSS scaling the canvas.

A shared capture-phase pointer guard protects all six canvas families: creative letters, connected forms, free canvas, name practice, ayah writing and authored movement lessons. Unrelated cancel/lost-capture events are ignored. Canvas size or position changes detected before observer delivery interrupt the current stroke rather than committing distorted coordinates. Completed ink is retained. No global timed touch lock or palm-rejection claim is added. Landscape safe-area offsets and short-height immersive roots are adjusted. Repeated intros, rewards, review gates and storage schemas are unchanged.

Validation: pure transform inversion/clearance/ownership checks; `tests/canvas-reliability.cjs` against source and bundle for enlarged portrait guide, inverse coordinates, unrelated pointer cancellation, undo/redo, rotation, reopening existing ink and same-turn resize; `tests/canvas-families.cjs` for real browser touch dispatch, cancellation and resize across the other five families against source and bundle. Name-practice, connected resilience, poster/free-canvas export and offline launch checks also pass. Phone and landscape screenshots were inspected internally. Physical-device stylus latency/palm rejection remains unverified. The hosted beta still contains its separately published v6.10 studio until explicitly updated.

This is the first audit implementation pass. Dialog/contrast fixes, persistent canvas rendering and navigation consolidation remain subsequent work.

## v6.10 — share finished posters

Poster Studio adds **Share poster** when image-file sharing is supported. It prepares a PNG locally before enabling the button, then invokes the native share sheet directly on the user's tap. Design edits invalidate the prepared image. PNG sharing uses the selected poster size and includes only the artwork file, with no scores, review labels, link or extra message. Available destination apps depend on the device/browser.

Saved poster cards in **My work** have a Share poster action. It opens a small preparation panel, then the learner taps Share poster to choose an app. The saved design is used even when Poster Studio has unsaved edits. Download PNG remains available in both places. Unsupported browsers show the manual download path. Cancellation does not download or change artwork; share errors leave the download option available. No share is attempted automatically, and no artwork is stored online by Harf Writer. The destination chosen by the learner handles the shared image.

Validation: `tests/poster-sharing.cjs` covers source and standalone builds with mocked Web Share capabilities, active-click invocation, PNG dimensions/payload, latest-edit rendering, exact saved-design bytes, cancellation, denied sharing, repeated taps, manual fallback, focus restoration and missing/unsupported APIs/render failure. Existing poster PNG/SVG, free canvas, gallery, offline launcher and pure regressions pass. These browser simulations do not verify a real Android share sheet or delivery to WhatsApp/Instagram; physical-device acceptance remains required.

## v6.9 — My work collection

Open **My work** from Home or More. One collection shows the current free-canvas draft, existing name-practice drafts/comparisons, explicitly saved drawings and framed posters. Filter by drawing, name practice or poster. Resume a name at its saved part/mode/window, view/export a saved comparison, resume a drawing, or reopen a poster with its exact caption/frame/palette/background/size/ornaments. Saved comparison thumbnails use learner ink; name-draft thumbnails use a typeset name reference.

Use **Save drawing to My work** in the free canvas Tools drawer, or **Save poster to My work** in Poster Studio. Artwork snapshots use `harf.my-work.v1`, capped at twelve items and 1 MiB, with fonts omitted from storage. Identical artwork/design saves are reused. Existing name and free-canvas keys remain independent. Opening a saved drawing while the current canvas contains ink offers to archive the current drawing first; cancellation leaves it intact. If archiving fails, replacement is blocked. Invalid saved bytes remain untouched, quota/limit failures are explicit, removal requires confirmation, and Clear all local work clears this collection too. Downloads remain available. No cloud storage, direct social sharing or new XP is added.

Validation: `tests/my-work.cjs` passes against source and standalone builds for aggregation, name resume/comparison, exact poster design restoration and export, drawing save/resume protection, filters, removal/cancel, reload, four viewport widths (320–1440px), corrupt storage, quota failure, twelve-item cap and clear-all. Pure snapshot validation, existing name-practice and main-entry regressions pass. This version still needs physical-device acceptance; no teacher sign-off is implied.

## v6.8.1 — clearer Home

Removed duplicate section tabs from Home; tabs remain inside Creative Studio sections. Playground now previews the free drawing canvas and names both free drawing and letter composition. Core drawing, lessons and saved work are unchanged.

## v6.8 — immersive canvas and Poster Studio

Creative Studio now has direct section navigation, with English controls in LTR and Arabic specimens in RTL. Playground offers an immersive free canvas with pressure-aware pen strokes, undo/redo, optional baseline snapping and direction guides. Its single local draft uses `harf.free-canvas.v1`; no XP or assessment is awarded. Name practice has optional baseline snapping and 30/45/60-degree visual assistants; holding Shift constrains direction on desktop. These are geometric drawing aids, not classical proportion assessment.

Poster Studio opens from name art, saved name handwriting, or the free canvas. Choose three gallery frames, plain/organic/architectural backgrounds, three palettes and optional original corner mandalas. Export PNG at 2480×3508, 3000×3000 or 3508×2480 pixels, or font-embedded SVG. Frames are printed decorations within the image. Poster preferences use `harf.poster-options.v1`; artwork is not uploaded.

Fixed interrupted strokes during canvas resizing and made the eight-draft name-practice limit visible before drawing. Completed ink remains intact; interrupted strokes are discarded. Existing drafts are not silently removed. Browser checks cover source and standalone navigation, exports, mobile widths, free-canvas persistence, undo/redo, resizing, and data clearing. Pure geometry/poster checks cover snapping, angles and 27 layout combinations. Physical-device acceptance and teacher sign-off remain pending.

# Harf Writer v6.10 handover

The standalone app now includes a complete first ayah-writing course: Al-Fatihah, Al-Ikhlas, Al-Falaq and An-Nas, with all 22 ayahs and 109 word/whole-ayah lessons. This is the complete included course, not the entire Quran. The live QariAI app is untouched. No push, merge, deployment, live-app edits or package upgrades are authorized by this package.

## Two kinds of lessons

1. The existing Bism/Allah movement lessons have authored strokes and provisional geometry checks. Their engine and data are unchanged from v4.9. Bism has user-reported approval but no named written sign-off. Allah remains draft.
2. The new ayah curriculum uses typeset Naskh guides and word-specific visual guidance. It supports tracing, copying, writing without the reference, comparisons and explicit learner self-checks. It never calls the geometry engine and never awards a score, teacher approval, mastery, XP or a streak. Do not describe these as 109 authored stroke-order lessons.

Teacher review of the new curriculum and rendered typography is pending. The Arabic reference text was retrieved directly from Tanzil Simple 1.1 on 22 October 2026; exact text, source URL, checksums and copyright notice are retained. Opening Basmala prefixes for surahs 112–114 are separated with a source-text offset, not edited or renumbered. Do not silently normalize Arabic, delete marks or substitute an Uthmani edition without updating provenance and review.

## Run

`npm test`, `npm run build`, `npm start`. Double-click `dist/Harf-Writer-v5-Complete-Ayahs.html` for the self-contained app. Source uses local fetch; the build does not. See README for optional browser tests.

## Storage

Original movement keys use `harf.standalone.v1.` and calibration uses `harf.calibration.v1.records`. New course state is `harf.ayah-studio.v1`, schema version 1. Its cursor, progress and drafts are independent. Progress entries contain mode-specific `{kind:'self-checked', date, usedReference}`; no `qualified` or score field exists. Twelve recent draft pages are retained under a 1 MiB budget. Old drafts may be removed with a visible notice, while self-check progress is retained. Quota failure preserves current work in memory and requires export before closing. The existing delete-all action clears course state too.

No automatic migration between browser origins or different file URLs exists. Course exports are PNG/SVG learner ink, not a font-based Quran model. Source text credits remain available from every course screen. Keep both font and Quran text licenses.

## Validation and release limits

Browser checks exercise both source and built HTML, actual touch events, exports, recall/reveal, local recovery, storage fallback, and 320–1440px layouts. All 22 whole-ayah guides fit without clipping at 320px. Existing 51 synthetic movement checks remain green. These checks are not physical Android acceptance for v5, and they are not a calligrapher sign-off. The earlier Android pass was reported by the user for v4.9, not this new course.

Before a production release: inspect v5 on the user's Android device and obtain a named teacher's written sign-off for curriculum/typography and authored models. User testing does not replace expert sign-off. No live integration was performed. An isolated feature-flag route in QariAI remains a later decision requiring authorization.

## v5.1 navigation and resume

Home now has three direct stages: 9 existing foundation activities; authored Bism/Allah plus 87 typeset words; and 22 complete ayahs. The foundations include four separate letters, not the whole alphabet. Stage 2 word practice and Stage 3 whole-ayah practice have separate browsing and progression paths, while retaining the existing lesson IDs, drafts and self-checks. A shared `harf.standalone.v1.lastActivity` marker records the most recent actual practice activity and mode across both engines. Stage browsing does not replace it. Calibration targets do not update this marker. The Home primary action resumes the last activity, including foundation and word movement drafts. Existing course-only cursor and lastLesson values provide migration fallback.

## v5.3 collection

Separate local key `harf.ayah-collection.v1` stores up to 24 learner-ink pieces / 1 MiB. It is not automatically evicted with drafts. Saves fail visibly without removing existing artwork. Full-ayah confirmation now opens the finished-piece screen; `finish-next` advances explicitly. Word confirmation retains its previous advancement. No engine scoring or leaderboard integration was added.

## v6.0 Creative Studio

The new Home entry opens a separate creative workspace, leaving course data/geometry and collection storage intact. `creative-model.js` owns pure reward/state rules; `creative-studio.js` owns pointer capture, DPR/rAF rendering, glyph tiles, exports and local persistence. The build embeds both modules; `tests/creative-model.mjs`, `creative-browser.cjs` and `creative-resilience.cjs` cover the new layer. Glyph rewards are experimental local visual-guide rewards, not teacher certification. Playground exports isolated tiles only; do not market this as Arabic font creation or font/keyboard installation.

## v6.2 — shared canvas workspace (23 October 2026)
Letter and Bism contextual-form canvases use uniform scaling inside full-viewport paper, a floating dock, and native bottom sheets. Existing 600-unit creative drafts retain their coordinate system. Outlying flourishes are kept in export bounds. Connected Bism forms use affine transforms derived from existing shared word geometry; no runtime SVG sampling or fallback model ink is inserted into learner exports. Three learner forms plus optional nearby endpoint bridges compose the word. Bism is unvocalized and draft; no review sign-off, automatic evaluation or XP. Twenty-eight isolated guides and the four-surah course remain available. No live QariAI integration or deployment.

## v6.3 — Creative Studio is the front door
Startup renders the legacy app then opens Creative Studio; the legacy DOM remains hidden until More → Lesson library. The library retains all original content and saved practice. Main landing has one letter CTA, uses validated last-glyph cursor for unfinished draft resume, and collapses daily challenge/milestones. More owns secondary navigation. Cursor removal hooks into clear-all.

### v6.3.1
Creative `home` is now distinct from `quest`: startup and brand/back-to-studio navigation target Home, while Letters opens the full alphabet. Three Home previews use existing letters, connected Bism and playground routes. No state migration or reward changes.

## v6.4 — first-visit introductions
`src/studio-intros.js` owns workflow copy, CSS illustrations, native dialog lifecycle and `harf.intros.v1`. Creative render dispatches `harf:section-enter` for letters/playground/ink, connected render dispatches connected, and the existing lesson-library event opens library guidance after rendering. Home has no intro. Dismissal marks a section seen; clear-all removes flags. Replay uses `data-studio-intro`. CSS respects both OS reduced motion and `body.reduce-motion`. The artwork is a workflow illustration, not authored stroke-order teaching.

## v6.5 — visual identity
Original exhibition palette and geometric preview frames in the final stylesheet block. Home hero uses an inline SVG medallion and embedded-font Ba; mobile hides that decorative hero specimen. Teal Letters, indigo Connected Words and terracotta Playground panels share light ivory script. Intros carry section palette and updated story headings; actual drawing canvases keep their original neutral paper and geometry. Saved cards gain quiet mounting. No new external assets/dependencies or storage changes.

## v6.6
New `src/name-studio.js`: locally persisted typeset Naskh name compositions, original vector frames, editable Arabic spelling, caption, three palettes, font-embedded SVG and canvas PNG. Uses separate `harf.names.v1`, validates before writes, preserves unreadable data, and handles clear-all. Intro module adds `name`, automatic playback on section transitions and `harf.intros.auto.v1` opt-out; Home transitions reset entry tracking, while same-section re-renders do not replay. Seen flags remain compatible with prior builds. Home hero copy restored exactly to v6.4 wording.

## v6.7 — name-to-practice loop
`src/name-practice-model.js` validates independent drafts/pieces and composes learner word canvases in RTL order with uniform scale. `src/name-practice.js` owns full-screen word/window tracing, recall, guide use, saved comparisons, export, pressure data and optional sensory/replay controls. Name Studio supplies a pure reference renderer accepting saved settings snapshots, so old comparisons do not use the latest editor text. Pressure arrays are optional for legacy strokes and stay aligned through point decimation and export. Own-stroke replay never mutates ink or awards scores. Reviewed master paths/proportion data are still needed before adding classical coaching.
