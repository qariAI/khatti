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

# Validation — 22 October 2026

Executed for v5:

- Source integrity checks: 22 exact Tanzil ayah records, continuous numbering, explicit Basmala prefix boundaries, 109 word/whole-ayah lessons, source checksum and copyright/attribution.
- New course browser tests pass for source and built HTML: four surahs, all ayahs accessible, real touch capture, refresh/resume, PNG/SVG downloads, explicit two-checkbox self-check gating, no geometry qualification, reference reveal in recall, source credits and return to Home.
- Layout checks pass at 320, 360, 390, 412, 768 and 1440px. All 22 whole-ayah canvas guides are measured against their actual font bounds and fit unclipped on a 320px phone. Internal screenshots were visually inspected.
- Course storage checks pass: 12-draft retention, visible older-draft removal notice, self-check progress preservation, quota failure retaining live ink, unrelated movement storage untouched, and explicit course clearing.
- Original movement browser checks pass: all phone widths, status help, tracing/copy/recall recovery, undo/redo persistence, closed-tab recovery and reduced motion.
- Catalog integrity/hydration checks and all 51 synthetic movement/mark regression checks pass. Budget eviction, native quota eviction, newest work preservation, oversized-write fallback and named-reviewer/written-sign-off checks pass.
- Source and built HTML retain exactly the original movement lesson data and all 22 engine evaluation results. Offline movement authoring reproduces the committed JSON. Runtime works with SVG path sampling disabled.
- The downloadable standalone regression runner passes against the v5 HTML.

Limits: v5 has not received physical Android acceptance or named teacher sign-off. New ayah lessons are typeset self-check writing practice, not authored stroke-order assessment. Synthetic checks are not recorded-device calibration. Keyboard/screen-reader controls do not provide an equivalent non-pointer drawing experience. This is a complete four-surah starter curriculum, not the entire Quran. No live QariAI integration, cloud sync or production deployment has occurred.

For v5.0.1, additional font, dialog, focus and resize checks pass; see `AUDIT-RESPONSE.md`. Font parsing/checksums and all course codepoint coverage were also verified with FontTools. The exact new size is 461,189 bytes.

For v5.0.2, the desktop main action fits at 1920×992; all 87 word guides fit unclipped at 320px. Earlier saved drafts retain their original guide coordinates, and explicit clearing adopts the centred layout. The 22-ayah source checks and 51 movement regressions remain green.

For v5.1, `tests/learning-path.cjs` passes against source and standalone builds: three Home stages, six viewport widths, all 9 foundations accessible, authored Bism/Allah entry, 87-word track, direct whole-ayah track, appropriate next-lesson behavior and cross-stage refresh/resume with saved mode and ink. The existing course, movement recovery, font/dialog, storage, unclipped-ayah and engine parity suites were updated for the new routes and pass.

For v5.2, mobile paper sizes now respond to available viewport height, movement toolbars use explicit rows, descriptions have no minimum height, and hero proportions are content-led. Navigation/resume, font/dialog/resize, source checks, 51 geometry regressions, all 87 word bounds and legacy draft placement pass. Light and dark phone screens were inspected visually. No physical-device acceptance is claimed.

For v5.2.1, the selected-ayah word sequence passes against source and standalone builds: first word, refresh/resume, four independent Basmala self-checks, then return to the same complete ayah. All 22 enlarged complete-ayah guides fit within their logical paper bounds at 320px. Existing whole-ayah draft guide layout and ink are preserved.

## v5.3 — 23 October 2026

- New collection browser suite passes for source and standalone: selected Arabic word/current-step journey, recall-mode reference privacy, two-checkbox completion gate, finished preview, exact learner-ink save, duplicate-click prevention, PNG/SVG exports, six widths, reload and My practice access, confirmed deletion and practice-progress preservation.
- Sparse diagonal Qalam samples are joined continuously in both canvas and SVG. A rendered-pixel assertion checks ink between samples.
- Existing learning-path suite passes with the explicit finished-piece Continue action. The authored Allah animation click timed out once during a concurrent browser run; a subsequent complete source/standalone run passed.
- All 87 word guides and 22 complete-ayah guides fit logical paper bounds at 320px. Desktop word action remains visible at 1920×992. Earlier draft guide placement is preserved. Font, dialog, focus, viewport-resize and course storage checks pass.
- Catalog/source tests and the 51 synthetic geometry checks pass. The authored movement evaluation engine is unchanged.
- Light phone screenshots of the finished piece and collection were visually inspected. This does not replace physical Android testing or named teacher review. No production integration or deployment occurred.

Collection-capacity (24 pieces), native quota failure and corrupt-collection preservation also pass against both source and standalone builds.

## v6.0 Creative Studio — 23 October 2026

- Pure model checks pass for validated state, progression gates, one-time glyph rewards, a daily bonus independent of earlier practice, streak/date boundaries, creative rank levels, insufficient-token rejection and equip-without-repeat-charge.
- `creative-browser.cjs` passes for source and standalone builds: 28 letter slots, six widths (320/360/390/412/768/1440), off-guide rejection, real CDP touch tracing of the Alif guide, positive guide matching, repeat-save reward protection, undo/redo, shop purchase/equip, live text and keyboard entry, custom/fallback letter tiles, PNG export, refresh recovery and independent access to the four-surah course.
- `creative-resilience.cjs` passes with corrupt saved data and native quota errors: visible session-only warning, existing persistent bytes preserved, no XP for free creative saves, download fallback, safe literal text rendering and clearing creative data through the existing clear-all event. Reduced-motion preference is enabled in these runs.
- Existing learning-path and collection suites pass against source and standalone, including the Quran course, refresh/resume, collection persistence/capacity, exports and corrupt-data handling. All 51 original geometry regressions, catalog/source checks and the downloadable standalone regression runner pass.
- Bundled JavaScript syntax and complete HTML/embedded JSON are checked. Desktop/mobile drawing, the light playground/shop, and dark mobile quest were visually inspected. Decorative brush previews use SVG paths rather than font-dependent symbols.
- The 28 new guides are isolated typeset Arabic letters. Guide matching is an experimental raster overlap/coverage check and does not validate correct pen order, calligraphic quality or Arabic joining. The positive touch fixture is synthetic guide-following, not physical-device calibration. The playground exports isolated letter tiles, not a joined Arabic font or TTF/OTF. No physical Android acceptance, teacher sign-off, live QariAI changes or deployment is claimed.

## v6.0.1 — local launch fix

The source index now redirects file:// launches to the bundled standalone app and loads the source module only over HTTP(S). The build replaces this launcher with the full inline app. Tests pass for double-clicking source index and standalone HTML with no CORS/console errors, plus the creative browser suite over HTTP for source and bundled builds.

## v6.1 — drawing HUD and set celebrations

Pure checks cover the six-to-seven letter set boundary. Browser checks cover the drawing HUD at six viewport widths, seven visible letterforms in the set dialog, zero XP for free-form milestones, forward/reverse focus containment, Escape and return focus, reduced-motion suppression of particles, repeat-save and refresh suppression of set celebrations. The existing touch/XP/token/shop/playground browser flow passes for source and standalone builds. Milestones are creative collections, not mastery ratings; no economy amounts or teacher-review rules changed.

## v6.1.1 — reading direction

Source and standalone direction tests cover English quest-card LTR order, an RTL Arabic keyboard, Arabic/English and mixed-text playground direction, corresponding PNG tile order, and the original Bism journey order. Arabic canvas guide shaping and ayah word order remain RTL.

## v6.2 — 23 October 2026

- Pure connected model checks pass: source/local roundtrip, RTL placement, spacing, endpoint-only bridges, missing/distant endpoint rejection, export bounds and state validation.
- `immersive-browser.cjs` passes for source and standalone: full-height canvas at 320/390/768/1440px, native drawers, unified mode navigation, real pointer capture of three contextual forms, composition, spacing, PNG/SVG, saved-piece refresh and no connected-word XP.
- Creative guide matching with real touch input, duplicate reward prevention, purchases, exports, storage recovery and local-launch checks pass. Milestone banners are nonmodal by default; optional detailed dialog Tab/Escape/reduced-motion checks pass.
- Connected corrupt/quota tests preserve existing bytes, retain downloadable session ink, verify drawer focus and clear-all, and fit 320px.
- LTR English navigation/quest and RTL Arabic keyboard/mixed-text preview/export checks pass. Original three-stage learning/resume tests and 51 movement checks remain green.
- Mobile letter and tablet contextual-form screens were visually inspected. No physical-device acceptance or named teacher approval is claimed. Connected Bism is an unvocalized draft composition prototype, not a general connected Arabic font or complete ayah compositor.

## v6.3 — single Creative Studio entry

`tests/main-entry.cjs` covers source and standalone launch into Creative Studio, hidden original dashboard, one primary CTA, collapsed daily challenge, four responsive widths, unfinished draft resume after refresh, More keyboard focus, Playground/connected navigation, intact four-surah/109-lesson library and return. Creative rewards, touch matching and original pure engine/data checks pass. Mobile landing layout was visually inspected. This navigation change does not add a guided first-session tutorial or teacher approval.

For v6.3.1, source and standalone main-entry tests additionally verify zero alphabet tiles on Home, exactly three section previews, access to all 28 letters through the Letters preview, return to Home, four viewport widths, unfinished-letter resume and preserved library access. Mobile Home was visually inspected. Offline launch and pure engine/data tests pass.

## v6.4 — quick section introductions

`tests/studio-intros.cjs` passes against source and standalone: all five initial introductions, uninterrupted Home, Skip/Start/Escape, keyboard focus cycling, 320/390/768/1440px bounds, persistence across refresh, no replay on subsequent letter drawing, explicit replay, final connected animation and clear-all. Reduced-motion final state and storage-quota session dismissal pass on a 320×640 viewport. Letters and Connected Words phone screens were visually inspected. The existing main-entry/resume test and pure engine/catalog/reward checks pass. Existing non-intro creative suites seed seen flags to test their independent flows. No physical-device acceptance or teacher sign-off is claimed.

## v6.5 — original exhibition design

- `exhibition-design.cjs` passes against source and standalone: three Home previews with exact teal/indigo/terracotta palette, story heading, 320/360/390/412/768/1440px in light and dark mode, no horizontal overflow, and full-screen neutral-ivory drawing canvas.
- `main-entry.cjs` and `studio-intros.cjs` pass for source and standalone, including resume, preserved course access, first-visit/replay lifecycle, keyboard focus and reduced-motion state.
- Catalog, connected transforms, creative rewards, exact source ayahs and all 51 synthetic movement checks pass. Standalone regression runner passes.
- Mobile light/dark, desktop light, and Connected Words introduction screens were visually inspected. All frames/illustrations are original CSS/SVG; no source gallery assets or text are embedded.
- No physical-device acceptance, new script curriculum or named calligrapher sign-off is claimed.

## v6.6 — restored Home copy, intro playback and Name Studio

- `name-studio.cjs` passes against source and standalone: previous hero copy restored; repeated section-entry animations, preference opt-out/replay/refresh; Name Studio entry, Arabic RTL shaping and editable spelling; six viewport widths; palettes and frames; font-embedded SVG; 2400×1824 PNG; text/markup validation, persistence and clear-all.
- `name-storage.cjs` passes for damaged and quota-blocked name storage: existing bytes preserved, session-only notice, downloadable live output and explicit clearing.
- Existing main-entry tests pass; intro suite checks all prior sections with repeat-on-entry semantics and reduced motion. Catalog/engine/reward tests remain green. Offline source launcher and standalone open without CORS errors.
- Name Studio desktop and mobile compositions were visually inspected. No physical-device acceptance, handwritten Thuluth generation, automatic name translation, new calligrapher approval, cloud sync or live app integration is claimed.

## v6.7 — personal name practice and tactile options

- Pure name-practice tests verify normalization/word boundaries, RTL learner composition without mirroring, uniform scaling, state limits and validation.
- `name-practice.cjs` passes source and standalone: Name Studio entry, four viewport widths, trace/recall progression, guide-use recording, ink resume, undo/redo, comparison, learner-only SVG/PNG, atomic save, reopen/remove confirmation and clear-all; no XP.
- `name-practice-extras.cjs` tests CDP pen pressure, joined long-word windows, exact window/ink restoration, normal/reduced-motion own-ink replay without changing saved strokes, quiet defaults, corrupt/quota preservation and fallback download.
- Existing Name Studio and pure catalog/reward/engine tests pass, including the 51 synthetic movement checks. Source launcher and standalone open offline without CORS errors.
- Mobile comparison and long-word window screens were visually inspected. Sound/haptic hardware quality, Apple Pencil/Android stylus acceptance and physical-device calibration remain unverified. No master-calligrapher replay, classical ratio assessment or pronunciation integration is claimed.
