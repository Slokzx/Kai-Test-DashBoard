# Kai Security Workbench

An opinionated React + TypeScript dashboard optimized for very large Kai vulnerability exports (300MB+). It streams NDJSON data, normalizes it into analytics-ready structures, and renders an interactive workspace for security engineers with visualization, comparison, export, and customization capabilities.

## Highlights
- **Large-file ingestion** – `loadVulnerabilityDataset` streams `/public/data/vulnerabilities.ndjson` via the Fetch reader API, normalizes nested registries, and emits records incrementally to keep memory flat.
- **Data processing utilities** – `src/api/dataLoader.ts`, `src/utils/filtering.ts`, and `src/utils/metrics.ts` handle transformation, indexing, aggregation, and filter application (including the special Kai statuses `invalid - norisk` and `ai-invalid-norisk`).
- **Scalable architecture** – Feature-focused folders for hooks, contexts (filters, preferences, comparisons), visualization components, and list virtualization keep the codebase modular.
- **Virtualized explorer** – `@tanstack/react-virtual` powers the vulnerability stream, so scrolling remains smooth even with hundreds of thousands of rows.
- **Rich filtering/search** – Debounced search suggestions, severity/risk chip filters, group/repo toggles, CVSS + date sliders, exploitable-only switch, and creative "Analysis" / "AI Analysis" filter buttons that visualize their impact.
- **Insightful visuals** – Recharts components for severity, risk factors, temporal trends, and a custom AI-vs-manual scatter plot; `CriticalCallouts` highlights the most urgent findings after filters are applied.
- **Analyst tooling** – Comparison drawer, CSV/JSON export for the filtered set, detail views with timelines, and user preference drawer (theme, density, Kai-mode defaults, highlight toggles).

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app fetches `/data/vulnerabilities.ndjson`; drop in your own NDJSON export (newline-delimited JSON objects) to exercise real datasets. 300MB+ files stay responsive because parsing runs in a streamed loop and React Query keeps the cached results.
3. **Type-check & build**
   ```bash
   npm run build
   ```
   Produces a production bundle in `dist/` (Vite + React code splitting keeps the dashboard + detail routes in separate chunks).

## Architecture & Data Flow
```
src
├── api
│   └── dataLoader.ts          # Streaming fetch + normalization pipeline
├── components
│   ├── charts                 # Recharts visuals (severity, risk factors, trend, AI vs manual)
│   ├── filters                # Search, filter panel, analysis buttons, filter impact badge
│   ├── insights               # Metric cards and CriticalCallouts
│   ├── layout                 # Theme provider, top bar, layout shell
│   ├── lists                  # Virtualized vulnerability list + comparison drawer
│   └── preferences            # User preference drawer (theme, density, Kai defaults)
├── context                    # Filter, preference, and comparison providers
├── hooks                      # React Query streaming hook + debounce helper
├── pages                      # Dashboard + Vulnerability detail routes (lazy-loaded)
├── state                      # React Query client config
├── utils                      # Filtering, metric aggregation, export helpers
└── types                      # Vulnerability/domain typings & filter models
```

### Data lifecycle
1. **Fetch & Normalize** – `useVulnerabilityData` (React Query) calls `loadVulnerabilityDataset`, which streams NDJSON, injects group/repo/image context, computes impact scores, and returns `VulnerabilityRecord[]`.
2. **Filter Context** – `FilterContext` stores all filter controls (search, risk factors, Kai mode, ranges, density, etc.). `applyFilters` obeys Kai analysis modes and returns `{ records, removed }` for downstream components.
3. **Analytics** – `buildMetrics` aggregates severity, Kai status counts, risk frequencies, exploitability, trend buckets, and median CVSS for the filtered slice.
4. **Presentation** – Components subscribe to `useFilters`, `usePreferences`, and `useComparison` to render charts, cards, lists, drawers, and export actions without prop drilling.

## Feature Reference
- **Search & suggestions**: `FilterPanel` + `SearchBar` surface live CVE/package hints (debounced via `useDebounce`).
- **Kai buttons**: `ActionButtons` activate "Analysis" (drops `invalid - norisk`) or "AI Analysis" (drops `ai-invalid-norisk`) and visualize suppression via `FilterImpact`.
- **Virtualized listing**: `VulnerabilityList` + `useVirtualizer` render only the visible rows with density settings pulled from preferences.
- **Comparison**: Select any number of rows to pin them in the floating `ComparisonDrawer` with key stats for side-by-side review.
- **Export**: Trigger CSV or JSON exports of the filtered slice through `exportVulnerabilities` (Papaparse for CSV encoding).
- **Detail views**: Route `/vulnerability/:cve` shows timeline, risk factors, references, asset metadata, and allows adding/removing from comparison.
- **User preferences**: Drawer toggles theme, density, highlight styles, and default Kai mode—persisted in `localStorage`.

## Custom Data
- Replace `public/data/vulnerabilities.ndjson` with your Kai export (newline-delimited JSON). The loader also supports historical nested JSON via the fallback path in `parseAsJsonArray`.
- If your feed uses a different schema, edit `RawVulnerability` / `toRecord` (in `src/types/vulnerability.ts` and `src/api/dataLoader.ts`).

### Sample datasets
- `src/ui_demo_mini.json` is a hand-picked subset that preserves every field the dashboard renders (multiple groups, repos, images, severities, Kai statuses, risk factors, timelines, etc.) while staying tiny enough to share in docs or run in a workshop.

To try the mini dataset locally, flatten it into NDJSON and drop it into the location the app already reads:

```bash
jq -cr '
  .groups
  | to_entries[]
  | .value as $group
  | $group.repos
  | to_entries[]
  | .value as $repo
  | $repo.images
  | to_entries[]
  | .value as $image
  | $image.vulnerabilities[]
  | . + { group: $group.name, repo: $repo.name, image: $image.name }
' src/ui_demo_mini.json > public/data/vulnerabilities.ndjson
```

The command works for the full `ui_demo.json` as well if you need the heavyweight sample.

## Future Enhancements
- Wire up a real backend or Web Worker for pre-aggregation when streaming even larger files.
- Add automated regression tests for the filtering helpers and data loader (current build validates via `npm run build`).
- Expand the trend visualization to allow draggable time windows or annotate releases.

Feel free to tailor the visuals or data structures; the architecture keeps concerns isolated so new filter types, charts, or export formats can drop in without rewiring the core flow.
