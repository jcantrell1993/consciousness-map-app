# Consciousness Map: entrainment player

A single-file, in-browser binaural / isochronic tone player with a session log. `index.html` is a
hand-edited Parcel bundle with React inlined. There is no source tree and no build step: edit
`index.html` directly. Everything runs on the device and nothing is uploaded.

Project context, current state and open decisions are in the private sibling repo
`Consciousness Map` (a folder next to this one). Read its `next.md` first. Keep this repo free of
anything personal: no field notes, session logs or practice details.

## Deploy

GitHub Pages serves `main`. Pushing `main` publishes the app, and the installed phone app picks it up
on its next launch (`sw.js` fetches same-origin files network-first and keeps a cache only as the
offline fallback). Work on a branch, merge to `main` when it is finished, and confirm before pushing.

## Run and check

- Serve this folder with `python -m http.server 8765` and open http://localhost:8765/.
- Syntax check without a browser: parse each inline `<script>` body with Node's `vm.Script`.
- The built-in browser pane throttles `requestAnimationFrame` to about 1 fps. For visual checks, patch
  rAF and cAF to timers before the app mounts, and test at phone width (412x915).
- Audio checks: tap the output through the `BaseAudioContext.prototype` `destination` getter. An
  `AnalyserNode` hides channel separation unless `smoothingTimeConstant` is 0.
- Phone audio checks: open the app with `?diag` for an on-screen readout of each AudioContext's state
  and underruns. Stutter with no underruns counted is further along, in the Bluetooth link.

## Where things are in index.html

Search by name. Line numbers are approximate, as of commit fbe0b22.

| Name | Line | What |
| --- | --- | --- |
| `BANDS`, `PRESETS` | 14162, 14297 | brainwave bands; Focus-level and multi-phase session presets |
| `FADE_IN_SECONDS`, `LIMITER_PRE`, `softLimitCurve`, `isoPulseCurve` | 14486-14505 | audio constants and curves |
| `AudioEngine` | 14512 | binaural and isochronic synthesis, ambient beds, glides, stop. Output goes through a limiter into a MediaStreamDestination feeding a hidden `<audio>` element, which keeps playback alive with the screen off and drives Media Session |
| `PHOSPHOR` | 15386 | look settings: frame rate, persistence, bloom, ocean speed, rain swell and density |
| `ParticleVisualizer` | 15431 | the canvas: dot field, ocean waves, rain drops (a grid over the fixed dots, `eachDotNear` and `eachDotInRing`, and a per-dot accumulator `dAdd`) |
| `createBootAudio` | 16015 | synthesized boot sounds |
| `SAYINGS`, `pickSaying` | 16188 | credited sayings; the tags say where each is spoken (see the comment above it) |
| `DepthScope` | 16252 | the radar/sonar canvas |
| `BootSequence` | 16433 | the LANTERN-1 boot script; any key or tap skips it |
| `LOG_KEY`, `logToMarkdown`, `useSessionLog` | 16737-16848 | session log in localStorage. The .md export mirrors `field-notes/template.md` in the notes repo, so change them together |
| `useVoiceCapture`, `useVoiceHold`, `pickVoiceMic` | search | optional hold-to-speak notes, stored in IndexedDB. Prefers the phone's mic, because a Bluetooth headset's mic can drop the headphones to mono call audio |
| `seamlessLoop`, `crossfadeLoop`, `bedGain` | search | make beds loop with no gap and sit at one level (`BED_RMS`) |
| `useWakeLock` | 16928 | screen wake lock |
| `Terminal` | 17162 | the console: views, readout, commands |

## Conventions

- New components use `const lh = _react.createElement`. Older code is compiled JSX
  (`(0, _jsxRuntime.jsx)`). Match the code around the edit.
- On-screen text is uppercase and terse.
- Sayings need provenance: credit the source, mark paraphrases "AFTER ...", never invent a quotation.
- The adaptive `quality` and `lod` settings keep the visuals smooth on a phone. Check new effects with
  them low as well as high, and with reduced motion on.
- The working file uses LF while git has autocrlf on, so "LF will be replaced by CRLF" warnings are
  noise. Scripts that rewrite the file should preserve its line endings.
