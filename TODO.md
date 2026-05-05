# ECGsMART Responsiveness Implementation Plan

Current Step: Approved - Implementing root app (index.html) responsiveness.

## TODO Steps

### 1. Create/Update TODO.md [COMPLETED]
- [x] Document approved plan and steps
- [x] Track progress

### 2. Edit style.css for comprehensive responsiveness
- [ ] Eliminate fixed min-width causing overflow (home__data, calculator cards → clamp/0)
- [ ] Make visual elements responsive (ECG container, compass SVG, charts → 100%/clamp/max-width)
- [ ] Enhance existing media queries (@1024px, @768px)
- [ ] Add new @480px mobile query (stacking, padding, touch targets ≥48px, font scaling)
- [ ] Add touch states (:active, :focus-visible), hover fallbacks
- [ ] Responsive tables (measurements table → stack mobile)

### 3. Test CSS changes
- [ ] Run local server, test desktop/tablet/mobile devtools
- [ ] Verify no overflow/h-scroll, readability/touch ok

### 4. Edit main.js for touch/mobile support
- [ ] Add touch events to ECG wave/peaks (touchstart/end for mobile clicks)
- [ ] Dynamic resizing (e.g., ECG scale on window resize)
- [ ] Prevent zoom on inputs (touch-action: manipulation)

### 5. Test full app
- [ ] Desktop, tablet, mobile (portrait/landscape)
- [ ] All sections (calculators, report, contact, map)
- [ ] Touch interactions (buttons, ECG clicks, nav)
- [ ] Performance/lag

### 6. Handle game/ (if/when saved)
- [ ] Save game files if needed
- [ ] Apply similar responsiveness
- [ ] Integrate/link from root if part of app

### 7. Completion
- [ ] attempt_completion with demo command (e.g., serve .)

**Next Action**: Edit style.css (Step 2)

Progress: 1/7 completed

