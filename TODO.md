# TODO - Nexify Landing Page Upgrade

## Step 1: Add assets/
- Create `assets/` directory
- Add a background hero image + a handful of supporting images (logos strip, product preview, gallery, testimonials)

## Step 2: Upgrade `index.html`
- Add Skip link for accessibility
- Add trusted-by logos strip
- Add product preview section using new assets
- Add improved mobile-nav accessibility attributes

## Step 3: Upgrade `styles.css`
- Add global focus-visible styles
- Add hero background via CSS using `assets/`
- Add consistent reveal animation classes
- Improve spacing/typography and refine responsive breakpoints

## Step 4: Upgrade `script.js`
- Update IntersectionObserver to toggle `.is-visible` classes (no direct style mutations)
- Improve mobile menu toggle using `aria-expanded` and a body class for scroll locking
- Keep testimonial slider working after layout changes

## Step 5: Quick verification
- Open `index.html` and check desktop/tablet/mobile responsiveness
- Test navbar toggle, CTA toasts, scroll reveal, testimonial slider

