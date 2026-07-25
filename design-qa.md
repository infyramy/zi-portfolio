# Design QA

final result: blocked

## Comparison target

- Source visual truth: `/var/folders/lc/9dm60lh54z99mqph04lxmvw00000gp/T/codex-clipboard-965d1e4b-b580-4dd7-a911-824a63efcfcb.png`
- Source pixels: `565 × 181`
- Implementation route: `http://127.0.0.1:4173/`
- Intended state: light theme, Codex activity section below Always Experimenting
- Intended viewport: existing 640px editorial shell; responsive mobile state included in code

## Evidence

- Source image was opened at its original dimensions and used to match the title, sync subtitle, right-aligned session count, month labels, seven-row activity grid, green intensity ramp, and Less/More legend.
- Implementation screenshot: unavailable.
- Browser-rendered comparison: blocked because the in-app browser rejected the local preview URL under its URL policy.
- Focused-region comparison: blocked for the same reason.
- Density normalization: not possible without a browser-rendered implementation capture.

## Findings

- [P1] Rendered fidelity cannot be verified
  - Location: Codex sessions activity section.
  - Evidence: the source visual is available, but no implementation screenshot can be captured in the permitted browser.
  - Impact: spacing, cell geometry, typography, and responsive wrapping cannot receive a visual pass.
  - Fix: reload the already-open local preview manually, then capture the section for comparison.

## Static and runtime checks

- `npm run build` passes.
- The local preview responds with HTTP 200.
- The generator reads dated session files from `~/.codex/sessions`, produced 167 sessions across 67 active days for 2026, and runs automatically before development and production builds.
- Source inspection confirms the activity title, session count, 12 month labels, 53-week grid, four intensity levels, cell tooltips, legend, dark theme tokens, and mobile spacing rules are present.

## Comparison history

- Initial pass: blocked before visual comparison because browser-rendered evidence was unavailable.

## Implementation checklist

- Manually reload the open local preview.
- Capture the Codex sessions section at the current viewport.
- Compare it with the source visual and adjust any P1/P2 spacing or typography differences.
