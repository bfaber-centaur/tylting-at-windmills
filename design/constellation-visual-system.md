# Tylting at Windmills — constellation visual system

**Status:** Working design note, not an implementation approval.  
**Source:** Annotated Excalidraw homepage sketch discussed on 2026-10-15, and the existing [consensus-knot](https://github.com/bubskee/consensus-knot) design language.

## Intent in the sketch (preserve)

- **Understated first.** The baseline is a sparse field of off-white and green/teal nodes, with occasional thin connections. Large quiet spaces are intentional.
- **Copper/orange “Byzantine” companions** are rare, always close to green nodes, and **never connected**. This is a *structural property*, not only an appearance. It carries over the split-brain motif from consensus-knot.
- **Homepage composition:** small brand mark near the upper-left and a contained *layout region* in the upper-right for the windmill-on-a-hill / possible lancer constellation. The drawn region is a framing guide; the final image should have an invisible or completely diffuse border.
- **The constellation scene is part of the graph language**, assembled from dots and edges so it fades naturally into the ambient node field. It is intentionally composed and recognizable, not a literal pasted-on picture or a second graphic language.
- **Per-series imagery:** the same approach can provide distinctive constellations on series pages and quieter reading-page headers.
- **Programmatic and reproducible:** generate the SVGs by script, as in consensus-knot. Avoid separately drawing and maintaining many decorative image files.
- **Responsive:** the scene has a deliberate bounded aspect ratio and composition suitable for both desktop and mobile; no content should be obscured.
- **Two modes:** dark is the richer atmospheric/observatory treatment derived from consensus-knot; light is a calmer paper/reader treatment, with fewer and fainter flourishes. Keep legible body typography and reading comfort central.

## Proposed implementation (not yet settled)

Treat each page graphic as two cooperating layers in a **shared coordinate system**:

1. **Ambient field:** deterministic seeded nodes with bounded sparse edges and very rare non-connected copper companions. Use a density/falloff mask to protect navigation, text, and the principal constellation.
2. **Authored motif:** a small graph with hand-designed node coordinates and selected edges that resolves into a recognizable subject (windmill/hill and perhaps a lightly suggested lancer). Its palette, line weights, and node sizes match the ambient field. The boundary is never drawn; spacing and opacity create the transition.

Produce final **static SVG** assets at build time from script and retain sources (nodes/edges/seed) in the repository. Consistency across page loads is preferable to new randomness on every reload. The site can use CSS custom properties for contrast variations between light and dark where practical, instead of changing the underlying graph.

### Candidate arrangement

- **Homepage:** strongest and largest windmill constellation, loosely right-aligned in the upper field.
- **Series landing pages:** one authored motif per series, lighter than the homepage.
- **Individual articles:** reuse the series motif or a tiny variant near the title; leave the body and narrow reading column free of ornamental clutter.
- **Mobile:** recompose or reposition the constellation instead of cropping away defining nodes or placing it behind text.

### First visual comparison to prototype

Make two desktop and mobile comparisons **without changing production**:

- A: windmill-on-hill graph alone.
- B: same windmill, with a subtle distant lancer (visually subordinate).

Show both in dark mode and in muted paper mode. Judge: recognizability at small size, calmness around text, whether motif boundaries vanish into the wider field, and whether copper companions remain unmistakably disconnected.

## Open questions for iteration

- Is the lancer actually needed to make the homepage work, or is the windmill sufficient?
- How much of the background field, if any, should survive around the text on reading pages?
- Should the little brand mark be the unchanged consensus-knot logo, or a compatible new mark for this site?
- Exact composition, wordmark placement, and breakpoints await the visual prototype.

## Non-goals (for now)

- Animations, mouse-tracking, star parallax, or randomized page-to-page flicker
- Fully illustrated fantasy scenes or bright network-wallpaper decoration
- Replacing the existing light mode's minimal editorial layout
