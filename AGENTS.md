# KNR Shopify Technical Test

This repository is a Shopify default theme customization for the KNR recruitment technical test. The goal is to build a complete, production-quality product page from the Figma design using Shopify Liquid, scoped CSS/SCSS, and vanilla JavaScript.

## Source Design

- Figma: https://www.figma.com/design/4FRpllGB631TV7jWkqf3dp/Dev-Shopify---Test-1?node-id=653-502
- Match desktop and mobile layouts as closely as possible: spacing, typography, colors, images, buttons, interactions, responsive states, header, footer, and all content sections.

## Deadline

- Email received: Tuesday, June 30 at 5:21 PM.
- Safest deadline: Sunday, July 5 at 5:21 PM.
- Calendar days include weekends.

## Required Stack

- Shopify Development Store.
- Shopify CLI for local theme development.
- Shopify default theme as the base.
- Liquid templates and sections.
- Vanilla CSS or SCSS.
- Vanilla JavaScript only.
- Inter font from Google Fonts.
- Public GitHub repository.
- One single final commit containing all task changes.

Do not use:

- Third-party Shopify theme.
- Tailwind CSS.
- CSS framework.
- jQuery.
- React or any JavaScript framework.

## Store Requirements

- Development store password must be `KNRDEV`.
- Create a test product with:
  - Product title.
  - Product description.
  - Variants: `15 mL` and `150 mL`.
  - Different prices for each variant.
  - At least 4 product images.
  - Compare-at price if the design shows a crossed-out price.
  - Product assigned to a collection for breadcrumb support.
- Submitted Shopify URL must open directly on the implemented product page.

## Theme Architecture

Use a dedicated product template with the `knr-` prefix, for example:

- `templates/product.knr-product.json`

Use separate section files with the `knr-` prefix. Choose the exact section breakdown from the Figma, but likely files include:

- `sections/knr-announcement-bar.liquid`
- `sections/knr-header.liquid`
- `sections/knr-product-main.liquid`
- `sections/knr-reassurance.liquid`
- `sections/knr-before-after.liquid`
- `sections/knr-how-to-use.liquid`
- `sections/knr-faq.liquid`
- `sections/knr-latest-news.liquid`
- `sections/knr-footer.liquid`

Suggested assets:

- `assets/knr-base.css`
- `assets/knr-product-main.css`
- `assets/knr-reassurance.css`
- `assets/knr-before-after.css`
- `assets/knr-how-to-use.css`
- `assets/knr-faq.css`
- `assets/knr-latest-news.css`
- `assets/knr-product.js`

Use scoped class names with a `knr-` prefix, such as:

- `.knr-product`
- `.knr-product__gallery`
- `.knr-product__info`
- `.knr-faq`
- `.knr-footer`

Avoid broad global selectors and style leakage into unrelated theme areas.

## Dynamic Data Rules

Do not hardcode product copy or content when it can reasonably come from Shopify data, metafields, section settings, blocks, menus, blogs, or product objects.

The following must be dynamic:

- Product title.
- Product description.
- Product price.
- Compare-at price.
- Product images and media.
- Product variants.
- Size selector.
- Displayed price when the selected size changes.
- Add-to-cart variant ID.
- Cart badge or cart item count.
- Breadcrumb: Home / Collection / Product.
- FAQ content.
- Reassurance content.
- Header navigation links.
- Footer navigation links.
- Latest news article content.
- Before/After content.
- How-to-use content.
- Other marketing sections.

Use Shopify objects and APIs where appropriate:

- `product.title`
- `product.description`
- `product.variants`
- `product.selected_or_first_available_variant`
- `product.images`
- `product.media`
- `product.price`
- `product.compare_at_price`
- `collection`
- `product.collections`
- `linklists`
- `blogs`
- `articles`
- Section settings and blocks.

## Functional Requirements

The product page should include all sections shown in Figma, likely including:

- Announcement bar.
- Header.
- Breadcrumb.
- Product media gallery.
- Product information.
- Product title and description.
- Price and compare-at price.
- Variant selector for `15 mL` and `150 mL`.
- Quantity selector if shown.
- Add to cart button.
- Cart item count badge.
- Reassurance or trust messages.
- Before/After section.
- How To Use section.
- FAQ section.
- Latest news or article cards.
- Footer.

## Variant Behavior

- Variant selector must update the selected variant ID.
- Displayed price must update without a full page reload.
- Compare-at price must update when applicable.
- Add-to-cart form must submit the selected variant.
- Use vanilla JavaScript.
- JavaScript must be non-blocking: load with `defer` or at the end of body.

## Cart Behavior

Use normal Shopify add-to-cart behavior, preferably a product form posting to `/cart/add`.

If implementing AJAX cart add:

- POST to `/cart/add.js`.
- Fetch `/cart.js`.
- Update the cart badge count dynamically.

The cart badge must accurately reflect the number of items in the cart.

## Breadcrumb

Breadcrumb must be dynamic:

- Home / Collection / Product.
- Use the current `collection` context where possible.
- If no collection context exists, fall back to the first product collection.
- Product label must use `product.title`.

## Header And Footer

- Header navigation must use Shopify menus, such as `linklists.main-menu.links`, or a menu selected in section settings.
- Footer links and content must be dynamic through settings, blocks, menus, or theme settings.
- Do not hardcode navigation links.

## Section Requirements

FAQ:

- Use section blocks for question and answer.
- If Figma shows accordion behavior, implement with vanilla JavaScript.
- Accordion buttons need `aria-expanded`.

Reassurance:

- Use section blocks or settings.
- Suggested dynamic fields: icon/image, title, description.

Latest News:

- Use Shopify blog articles.
- Allow selecting a blog in the theme editor.
- Render recent articles with `article.title`, `article.excerpt_or_content`, `article.image`, `article.url`, and `article.published_at`.

Before/After:

- Use settings or blocks for before image, after image, heading, text, labels, and supporting copy.
- If Figma has an interactive slider, implement it in vanilla JavaScript.

How To Use:

- Use section blocks or settings.
- Suggested dynamic fields: step number, title, description, image/icon.

## Images And Media

- Use `product.media` or `product.images` for the product gallery.
- Use responsive Shopify image filters such as `image_url`.
- Use meaningful alt text.
- Non-product images should come from section image picker settings.
- Keep image loading optimized and responsive.

## Typography

- Use Inter from Google Fonts.
- Match Figma typography closely: family, size, weight, line height, letter spacing, text transform, and color.
- Load fonts efficiently.

## Responsiveness

Implement distinct responsive layouts for mobile and desktop. Do not simply shrink desktop.

Check:

- Product gallery.
- Header.
- Spacing.
- Font sizes.
- Buttons.
- Variant selector.
- FAQ accordion.
- Before/After section.
- How To Use section.
- Footer.

## Accessibility

- Use semantic HTML.
- Buttons must be real `<button>` elements.
- Links must be real `<a>` elements.
- Form inputs need labels or accessible labels.
- Images need meaningful alt text.
- Accordion buttons need `aria-expanded`.
- Interactive controls must be keyboard accessible.
- Preserve or replace focus states with accessible alternatives.

## Performance

- Keep code lightweight.
- Avoid unnecessary libraries.
- Avoid blocking JavaScript.
- Use responsive images.
- Avoid excessive DOM manipulation.

## Theme Editor Support

Every custom section should include a proper Liquid schema and editable settings or blocks.

Use:

- Text settings.
- Rich text settings.
- Image picker settings.
- URL settings.
- Blog selector.
- Link list selector.
- Repeater blocks for FAQs, steps, reassurance items, and before/after content.

## Implementation Priority

1. Create Shopify Development Store.
2. Install or verify Shopify CLI.
3. Connect theme and start from default Shopify theme.
4. Create test product with variants and images.
5. Create dedicated KNR product template.
6. Build product main section dynamically.
7. Implement variant price switching.
8. Implement add-to-cart and cart badge behavior.
9. Build remaining sections from Figma.
10. Make all content dynamic through Shopify data, settings, blocks, menus, blogs, or metafields.
11. Match desktop Figma.
12. Match mobile Figma.
13. Test store URL and password.
14. Push public GitHub repository.
15. Ensure one final commit contains all work.

## Verification Checklist

- Dedicated `knr-` product template exists.
- Custom section files are prefixed with `knr-`.
- CSS and JavaScript assets are prefixed with `knr-`.
- No Tailwind, jQuery, React, or third-party theme.
- Product data is dynamic.
- Variants update price and form variant ID without reload.
- Add to cart works.
- Cart badge works.
- Breadcrumb works with collection fallback.
- Header and footer menus are dynamic.
- FAQ, reassurance, before/after, how-to-use, and latest news are editable.
- Desktop matches Figma.
- Mobile matches Figma.
- Store password is `KNRDEV`.
- GitHub repository is public.
- Product page URL opens directly.
- Final git history has one task commit.

## Submission

Submit:

- Public GitHub repository URL.
- Shopify Development Store product page URL.
- Store password: `KNRDEV`.
- Notes, if any.

Use the same email address as the original application.

Suggested notes:

```text
I implemented the product page as a dedicated Shopify Liquid product template using KNR-prefixed custom sections. Product data, variants, pricing, media, breadcrumbs, FAQ content, reassurance blocks, navigation, latest news, before/after content, and how-to-use content are dynamic through Shopify objects, section settings, blocks, menus, and blog data.

The variant selector updates the displayed price and selected variant dynamically with vanilla JavaScript. The add-to-cart flow uses Shopify cart functionality and updates the cart badge. Styling is scoped per section with KNR-prefixed classes, and the page is responsive for desktop and mobile based on the Figma mockup.

With more time, I would further refine micro-interactions, add more advanced image loading optimizations, and expand the theme editor settings for even more merchant flexibility.
```
