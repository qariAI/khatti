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

# Harf Writer v6.10 — letters, words and complete ayahs

Double-click `index.html` to open the included standalone build automatically, or open `dist/Harf-Writer-v5-Complete-Ayahs.html` directly to use the app offline. No setup, account or network connection is required. Creative Studio is the default opening screen. Its primary button starts the alphabet or resumes an unfinished letter. More opens Connected words, Playground, Ink studio and the secondary Lesson library. The library preserves Letters & strokes, Words, Complete ayahs and saved practice.

v5.2 tightens mobile practice spacing, groups writing tools into stable rows, removes fixed description heights and uses quieter borders with layered light/dark surface shadows. The square typeset canvas and all stored writing coordinates remain unchanged.

## v6.7 Learn to write your name

After creating name art, choose **Learn to write my name**. Practise each word with the typeset guide, then try recall with the guide hidden. The guide can be revealed at any time; saved comparisons disclose guide use during recall. Long words retain Arabic shaping and use overlapping right-to-left writing windows rather than isolated letter fragments. Part/mode/window cursor and completed ink resume locally.

Finish the recall parts to compare your handwriting with the typeset name. Save up to eight comparisons, revisit them in Saved work, remove individual drafts/pieces with confirmation, and export learner-only PNG/SVG. Saved references capture the name, frame and palette as they were at save time. This loop records self-check practice and awards no XP, automatic qualification or teacher approval.

The Options drawer adds stylus-pressure widths, an optional typeset baseline, synthesized quiet paper sound, baseline haptics where supported, and a gold ghost replay of **your own writing**. Sound/haptics/baseline are off by default. Mouse/finger input uses a steady width; pen input records a smoothed pressure sequence, retained in exports. The replay uses illustrative timing and a progress arc, not a flow/precision score. Reduced-motion preferences show a static replay. Reviewed master demonstrations, classical proportion assessment and Makhraj integration are not included.

Name practice uses `harf.name-practice.v1` (1 MiB, eight drafts/eight pieces) and optional tool preferences use `harf.name-practice.tools.v1`. Invalid bytes are preserved, quota failures leave current ink downloadable with a visible notice, and existing pieces are never silently evicted. Clear all local work removes the practice and tool settings.

## v6.6 Name Studio and visible introductions

The Home wording is restored to **Your hand. Your alphabet. / Make your mark. / Trace a letter. Make it yours. See your handwriting come alive.** The original exhibition palette remains.

Introductions now play when entering a section again, including on devices that saw them in v6.4/v6.5. They do not restart on every brush change or stroke. Skip/Start/Escape remain immediate. Uncheck **Play intros when entering sections** to stop automatic playback across all sections; Replay still works. This preference is saved in `harf.intros.auto.v1`. Home itself remains uninterrupted, and reduced-motion settings show the final static illustration.

**Name Studio** opens from Home or More. Type/paste an Arabic name (up to 40 codepoints), optionally add a caption (up to 50), and choose Garden border, Geometric medallion or Quiet frame with emerald/gold, indigo/ivory or terracotta/cream. Name size fits available space automatically. Downloads include a 2400×1824 PNG or SVG with the font and font attribution embedded. These are typeset Naskh compositions, not hand-composed Thuluth, automatic transliteration or a handwritten font. No name is sent online, and no XP is awarded.

Settings autosave separately under `harf.names.v1`. Invalid saved bytes are kept untouched; quota/unavailable storage leaves current work downloadable in memory with a visible notice. Clear all local work resets name settings and intro preferences. Original lessons, user drawings, rewards and review gates remain unchanged.

## v6.5 Original exhibition design

The Creative Studio now follows “From first mark to first piece”: single-letter practice, contextual connection, and personal composition. Warm ivory surfaces and emerald actions frame original teal, indigo and terracotta specimens. Geometric frames, an SVG hero composition, updated introduction panels and quieter gallery mounting are authored in CSS/SVG and use the existing embedded font. No artwork, wording or imagery from the inspiration gallery is included or loaded. The drawing canvases remain neutral ivory, and original lesson/review/reward/storage behavior is unchanged.

The full alphabet remains inside Letters; Home has three section previews and one primary start/resume action. Dark mode, English LTR controls, Arabic RTL text, keyboard focus and reduced-motion behavior are retained.

## v6.4 Quick section introductions

Letters, Connected words, Playground, Ink studio and Lesson library each show a short illustrated introduction on their first visit. Animations finish in roughly three seconds, with Skip/Start available immediately and no forced timer. Skip, Start and Escape remember dismissal locally. More and contextual tool drawers expose Replay introduction; the library also has its own replay link. OS reduced-motion and the app’s Reduce motion setting show static final illustrations. Introductions explain workflows, not Arabic pen order, teacher approval or handwriting recognition. Connected Bism remains draft, unvocalized and unscored; the Playground remains isolated tiles.

Seen sections live independently under `harf.intros.v1`. Invalid data is left untouched, unavailable storage falls back to session memory, and Clear all local work resets these hints. The module uses native dialogs with labelled content, keyboard focus cycling and restoration. No audio, external assets, network access or progress/reward changes are involved.

## v6.3.1 Section previews on Home

Home shows one primary start/resume action and three compact previews: Letters, Connected words, and Playground. The full 28-letter grid is a dedicated Letters screen. The original lesson library is available through a quiet link and More. English menus remain LTR and Arabic previews RTL.

## v6.3 One entry point

The app launches into Creative Studio with one primary letter action. Unfinished letter drafts resume after reopening; the last selected glyph is stored as a validated index under `harf.creative.cursor.v1`. Daily challenge and milestones use collapsed disclosures. Secondary activities live in More, and the original dashboard is now a lesson library without competing creative entry cards. All existing saved ink, progress and content remain available. Clear all local work also clears the creative resume cursor.

## v6.2 Canvas-first studio

Letters, Connected words and Playground share a mode switcher. Letter and connected-form drawing use the full viewport with a compact creative HUD and floating Undo / Clear / Brush / Guide / Next dock. Brush controls and extra actions open in a keyboard-accessible bottom sheet. Seven-letter milestones appear as a quiet banner; the detailed celebration opens on request. English controls and numbered steps are LTR; Arabic script and keyboard remain RTL.

**Connected words begins with unvocalized بسم only.** Draw initial Ba, medial Sin and final Mim using the existing draft geometry. Their actual strokes are placed in the shared word coordinate system; only nearby drawn endpoints receive short joining bridges. Adjust spacing without stretching, compare the separate draft model, and save up to eight pieces or export learner ink as PNG/SVG. No automatic assessment, XP, teacher approval, arbitrary connected typing or font export is provided for this study. Model review is pending. More words need reviewed contextual forms.

Connected drafts and pieces live independently under `harf.connected.v1`, validated and bounded to 1 MiB. Invalid bytes are left untouched, and storage failure keeps drawings in memory with a visible download notice. Saving a piece never silently deletes an existing one. Clear all local work clears this state too. Source modules are `src/connected-model.js` and `src/connected-studio.js`.

## v6.0 Creative Studio

The app opens directly in Creative Studio. Use **More** for Playground, Connected words, Ink studio and the original Lesson library. The separate creative loop includes all 28 isolated Arabic letter guides in four sets, progressive access and a date-based daily letter. Each first guide-matched glyph earns 50–80 local XP based on visual guide overlap, plus 20 ink tokens. A daily challenge bonus and a practice-day streak multiplier (up to 1.5×) reward returning. Repeated saves do not farm rewards. Creative glyphs may also be saved without XP. Badge milestones and rank titles describe creative activity, not teacher-reviewed mastery.

The guide check compares raster coverage and overlap with the typeset reference; it does not validate pen order, Arabic joining forms, calligraphic correctness or recitation. These 28 typeset guides are separate from the original nine authored foundation activities and their evaluation engine.

Saved glyphs appear live as isolated letter tiles in the Playground. Type text or use the Arabic keyboard, then download a PNG collage. Missing glyphs use labelled typeset fallback. This is **not a connected Arabic font**, custom keyboard installation, or TTF/OTF export. The original connected text is shown separately. Saved letter drawings are not automatically shaped into initial/medial/final forms.

Earned ink tokens unlock slate, mulberry and ocean inks, ribbon-width and glow brushes. Round pen, emerald ink and exports are free. There are no real-money transactions. Optional short synthesized sound feedback is off by default. The `harf:creative-reward` DOM event is the integration hook for future sound/animation assets; it sends no network requests.

The creative state is independent under `harf.creative.v1`, bounded to 1 MiB and validated before use. Completed strokes persist on pointer-up; active interrupted strokes are discarded. Storage failure keeps new work in memory, clearly marks it as session only and leaves previous persisted data untouched. Invalid data is never overwritten. Download work you need to keep. Clear all local work also clears the creative state. Creative XP never enters Qur'anic review status, recitation XP, or mosque leaderboards.

Source modules: `src/creative-model.js` (data, rewards, daily/streak/rank rules, shop and state validation) and `src/creative-studio.js` (canvas, UI, playground and persistence). Source and standalone builds use the same modules.

## Included curriculum

| Surah | Complete ayahs | Word + whole-ayah lessons |
| --- | ---: | ---: |
| Al-Fatihah | 7 | 36 |
| Al-Ikhlas | 4 | 19 |
| Al-Falaq | 5 | 28 |
| An-Nas | 6 | 26 |
| **Total** | **22** | **109** |

Stage 1 contains the existing 9 foundation activities (basic strokes, four separate letters and a connection); it is not a complete 28-letter alphabet course. Stage 2 offers the original Bism/Allah movement studies and 87 typeset word lessons. Stage 3 offers the 22 complete-ayah pages directly.

Every word has a typeset reference and guidance about visible letters, joins, dots or marks. Every ayah has a complete writing page. Trace, copy or write without the guide; compare your work and record a self-check. Download the writing as PNG or SVG. The course includes the complete Basmala as Al-Fatihah 1:1, including Ar-Rahman and Ar-Rahim word practice.

These new lessons use typeset guides, not authored pen-order animations or automatic geometry assessment. Self-checks are learner attestations, not teacher approval or mastery. The original Bism/Allah geometry lessons are a separate section and keep their existing review gates. Named teacher review of the new curriculum is pending.

## Local work and exports

The 12 most recent draft pages are kept locally, with self-check progress stored separately inside the course state. Completed strokes save on pointer-up. Old draft removal is announced; progress is preserved. Save failures keep current work in memory and show a session-only warning. Download writing you want to retain. Interrupted active strokes are discarded. Clearing browser data or changing browser/file URL may make earlier work inaccessible. No cloud sync, XP, streaks or leaderboard integration exists.

Trace/copy/without-guide drafts are separate. Revealing the reference in without-guide mode is recorded. Course writing is exported from its comparison screen; the original My practice gallery remains the collection for movement studies.

## Source development

Node 18+, no runtime packages to install:

```sh
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173. Use the local server for source `index.html`, because it loads local JSON. The built single HTML embeds everything and works from a file URL. The server binds only to 127.0.0.1 and is not production hosting.

| File | Responsibility |
| --- | --- |
| `data/ayah-course.json` | Four surahs, exact source text, Basmala segmentation, word lessons, provenance |
| `data/quran-source.txt` | Unmodified selected Tanzil records and copyright notice |
| `src/ayah-studio.js` | Typeset canvas, independent draft/progress state, self-checks, exports |
| `src/ui.js`, `src/styles.css` | Main studio and existing movement UI |
| `src/engine.js`, `src/engine.d.ts` | Unchanged pure movement-evaluation engine and TS declarations |
| `data/lessons.json`, `src/lesson-data.js` | Existing precomputed movement lessons and hydration |
| `src/review.js` | Named reviewer/written-sign-off gate |
| `src/i18n/en.json` | Existing English dictionary; other UI copy remains in UI modules |
| `scripts/build.mjs` | Single-file build with embedded font and both catalogs |
| `scripts/precompute.html`, `scripts/authoring.js` | Offline compiler for movement geometry only |
| `reference/v4.9-original.html` | Previous unchanged reference |

English/LTR is the only supported UI. Arabic text and word order remain naturally RTL. Quran text is Tanzil Simple 1.1 (Imlaei), not an Uthmani facsimile. Al-Fatihah counts the Basmala as 1:1; other introductory Basmalas are retained in source records but separated from the numbered ayah. Source and font licenses are included and available in the app.

## Verification

```sh
npm test
node tests/standalone-regression.cjs dist/Harf-Writer-v5-Complete-Ayahs.html
```

Optional browser suites require Playwright and a compatible browser already available in your test environment. Set `PLAYWRIGHT_MODULE` to its package directory and `CHROMIUM_EXECUTABLE` to the browser binary if needed. `CHROMIUM_ARGS` optionally accepts a JSON string array. These scripts do not install packages or download browsers.

```sh
node tests/browser.cjs
node tests/movement-browser.cjs
node tests/layout.cjs
node tests/storage-browser.cjs
node tests/parity.cjs
node tests/ui-audit.cjs
node tests/word-layout.cjs
node tests/learning-path.cjs
```

Run them sequentially, or choose a different `PORT` for each concurrent run. See `VALIDATION.md` and `HANDOVER.md`.

See `AUDIT-RESPONSE.md` for font verification, dialog/accessibility fixes, resizing checks and the smaller standalone payload.

In v5.0.2, new word drafts use larger, centred guides and a compact desktop canvas. Existing ink/redo drafts retain their original reference placement; clearing that page adopts the new layout. Whole-ayah text layout is unchanged.

Word practice advances to the next word, then the next ayah’s first word. Complete-ayah practice advances directly to the next whole ayah. Browsing a stage does not change the last practice activity.

## Ayah practice in smaller steps

The complete-ayah page offers “Practise word by word” for that same ayah. Each word uses the existing large word guide and self-check flow; the final word returns to the complete ayah rather than advancing to the next ayah. The sequence resumes after refresh. New complete-ayah drafts use larger, wrapped guides and the full available paper width. Existing drafts keep their earlier guide geometry until cleared.

## v5.3 — journey and personal collection

The ayah journey shows Arabic words in reading order, the current word and self-checked word progress. Expand the compact journey panel to move between words or return to the full ayah. Without-guide mode hides Arabic in the journey until the reference is revealed.

After a whole-ayah self-check, a finished-piece screen offers Save to my collection and PNG/SVG downloads. My practice and both course libraries open the private collection. Saved pieces retain learner ink, mode and reference identity, independently of the 12-draft rotation. They may be downloaded or explicitly removed; removing artwork preserves practice progress.

Collection storage is limited to 24 pieces and 1 MiB. When a save cannot fit or storage fails, existing pieces are kept and the new work remains available for download. Invalid stored collection data is left untouched. Clearing all local work also clears this collection. These remain learner self-checks, with no scores, XP, streaks or teacher approval. Qalam joins in this typeset studio use the same continuous convex outline for canvas and SVG.

## v6.1 — visible progress and set milestones

The drawing view keeps a compact sticky creative HUD with rank, level, XP progress and the current practice streak. Collecting the seventh saved letter in a set opens a milestone dialog showing all seven forms and any newly earned badge. Free-form collection milestones do not award XP. Milestones are derived from saved glyph state, so repeated saves or refreshes do not replay a completed set. The dialog supports Tab/Shift-Tab, Escape, focus restoration and reduced motion.

## Reading directions

English navigation, progress indicators and numbered learning cards use LTR flow. Arabic passages, the Arabic keyboard and ayah word sequences retain RTL direction; Arabic labels are isolated within their English cards. Playground tiles and PNG exports follow the first letter of the typed text, so English starts on the left and Arabic on the right. Mixed-language text uses that same base direction.
