// Generates templates/index.json (the homepage) with the reference site's content as section/block settings.
const fs = require('fs');
const BOOK = 'https://jankstailoring.com/book';
const G = 'https://www.google.com/search?q=JANKs+Tailoring+Ltd&stick=H4sIAAAAAAAA_-NgU1I1qDBKSjVJMjFPTE4xSLY0TLG0AgqZp5lYGhmkmVgkJhulJqUsYhX2cvTzLlYISczMyS_KzEtX8ClJAQA3caGpPwAAAA&hl=en&mat=CfjY04Q8A3VoElcBa0lj_2-1xkZaWdK2hWEBRfOhXnKMbKoxnvLfRYpcnV7okVUNwXUQtoe2Q0bV3y-0GiDWoL1r5uN23qyWBclJCLvMxWr5ygL-Y2bkOJ7Q52UEStMezJc&authuser=0';
function blocks(type, arr) {
  const b = {}, o = [];
  arr.forEach((s, i) => { const id = type + '_' + (i + 1); b[id] = { type, settings: s }; o.push(id); });
  return { blocks: b, block_order: o };
}
const S = {};
S.hero = { type: 'janks-hero', ...blocks('slide', [
  { headline: 'Bespoke\nTailoring', subhead: 'Every garment begins with you.' },
  { headline: 'Made\nto Measure', subhead: 'Precision fit. Singular style.' },
  { headline: 'Crafted\nfor You', subhead: 'Heritage craft. Modern silhouette.' }]),
  settings: { button_label: 'Book a Fitting', button_url: BOOK } };
S.featured = { type: 'janks-featured-products', settings: { eyebrow: 'Shop', heading: 'Featured Pieces', subheading: 'Handcrafted silk ties, ready to ship.', collection: 'neckties', limit: 6, link_label: 'Shop All', link_url: '/collections' } };
S.services = { type: 'janks-services-mosaic', ...blocks('tile', [
  { label: 'Bespoke Suit', kicker: 'From consultation', description: 'Fully cut and crafted from scratch to your unique measurements and style.', url: '/pages/services' },
  { label: 'Custom Shirt', kicker: 'From £75', url: BOOK },
  { label: 'Made-to-Measure', kicker: 'From £650', url: '/pages/services' },
  { label: 'Alterations', kicker: 'From consultation', url: '/pages/services' }]),
  settings: { eyebrow: 'Services', heading: 'What We Create', link_label: 'All Services', link_url: '/pages/services' } };
S.story = { type: 'janks-about-split', settings: { image_alt: 'The JANKS atelier', eyebrow: 'Our Story', heading: 'Founded on craft.\nBuilt on fit.', paragraph_1: 'Founded by Kwaku Acheampong, JANKS Tailoring brings together traditional British cutting technique and a contemporary eye for silhouette.', paragraph_2: 'Every garment we create begins with listening — to who you are, how you move, and how you want to be seen. Based in the heart of London, we believe clothing should be a tool of confidence, not an afterthought.', button_label: 'Meet Kwaku', button_url: '/pages/about-us' } };
S.categories = { type: 'janks-category-grid', ...blocks('tile', [
  { label: 'Suits', sub: 'Bespoke & MTM', url: '/collections' },
  { label: 'Shirts', sub: 'Dress & Casual', url: BOOK },
  { label: 'Trousers', sub: 'Flat & Pleated', url: BOOK },
  { label: 'Ties', sub: 'Silk & Wool', url: '/collections/neckties' },
  { label: 'Cufflinks', sub: 'Precious Metal', url: '/collections/mother-of-pearl-cufflinks-copy-1' },
  { label: 'Pocket Squares', sub: 'Hand-Rolled', url: '/collections/pocket-square' }]),
  settings: { eyebrow: 'Shop', heading: 'Browse the Collection', subheading: 'Every category, made to order or ready to ship.', link_label: 'Shop All', link_url: '/collections' } };
S.portfolio = { type: 'janks-portfolio-split', settings: { image_alt: 'JANKS bespoke portfolio', eyebrow: 'Portfolio', heading: 'Our Work', paragraph_1: 'Every garment that leaves the JANKS atelier is a testament to the belief that clothing is not merely worn — it is experienced. Our portfolio spans decades of commissions for executives, dignitaries, and discerning individuals who understand that true style begins with fit.', paragraph_2: 'From the first consultation to the final fitting, each piece is constructed by hand using the finest British and Italian cloth. No shortcuts. No compromises. Only work we are proud to put our name to.', button_label: 'View Full Portfolio', button_url: '/pages/gallery' } };
S.testimonials = { type: 'janks-testimonials', ...blocks('quote', [
  { quote: 'The quality of their work was outstanding, and the attention to detail really impressed me. Everything was tailored perfectly, and the service was professional, friendly, and efficient.', author: 'Jessica Amanfo', role: 'Google Review' },
  { quote: 'I wore one of their suits to a wedding and the quality was outstanding: the fit was spot on, the tailoring was clean and precise, and the fabric felt premium the moment I put it on. A cut that actually flatters.', author: 'Theo Dwumah', role: 'Wedding Client · Google Review' },
  { quote: "JANKs is your trusted brand for quality men's clothing and accessories. Choose JANKs, choose excellence.", author: 'Vivian Manu', role: 'Google Review' }]),
  settings: { eyebrow: 'Client Stories', link_label: 'Read Our Reviews on Google', link_url: G } };
S.why = { type: 'janks-why-janks', ...blocks('point', [
  { text: 'Every pattern cut from scratch — never from a template' },
  { text: '15+ body measurements including posture and proportion' },
  { text: 'Cloths sourced from leading British and Italian mills' },
  { text: 'Multiple fittings until the garment is exactly right' },
  { text: 'Lifetime pattern on file — every future garment fits faster' },
  { text: 'Based in London. Available for consultation nationwide' }]),
  settings: { image_alt: 'Ivory jacquard dinner jacket with satin peak lapel, made by JANKS Tailoring', eyebrow: 'Why JANKS', heading: 'The difference a proper fit makes.' } };
const SG = 'https://jankstailoring.com/style-guide/';
S.academy = { type: 'janks-style-academy', ...blocks('essay', [
  { category: 'From the Atelier', read_time: '5 min read', title: 'Behind the Pattern: Making a Bespoke Suit from Scratch', excerpt: 'From the first consultation and chalk marks on cloth through to the final fitting.', url: SG + 'behind-the-pattern-bespoke-suit' },
  { category: 'Style Essay', read_time: '4 min read', title: 'Why Every Man Needs One Bespoke Shirt', excerpt: 'Off-the-rail shirts are cut for a fictional average man. One bespoke shirt changes how you see the rest.', url: SG + 'why-every-man-needs-one-bespoke-shirt' },
  { category: 'Occasion Dressing', read_time: '6 min read', title: 'The Unwritten Rules of Black Tie Dressing', excerpt: 'Dinner jacket, bow tie, patent shoes. Know the vocabulary before you break it.', url: SG + 'unwritten-rules-of-black-tie-dressing' },
  { category: 'Style Theory', read_time: '5 min read', title: 'Colour Theory for Men: Building Harmonious Outfits', excerpt: 'Navy and brown, charcoal and burgundy — the pairings that lift an outfit from good to exceptional.', url: SG + 'colour-theory-for-men' }]),
  settings: { eyebrow: 'Style Academy', heading: 'Learn to Dress\nwith Intention.', link_label: 'All Essays', link_url: 'https://jankstailoring.com/style-guide' } };
S.consult = { type: 'janks-consultation-cta', ...blocks('step', [{ label: 'Consult' }, { label: 'Measure' }, { label: 'Create' }]),
  settings: { eyebrow: '05 — Contact', heading_before: 'Begin your', heading_accent: 'bespoke', heading_after: 'journey', subheading: 'Schedule a private consultation at our atelier.', button_label: 'Request Consultation' } };
S.newsletter = { type: 'janks-newsletter', settings: { eyebrow: 'Stay Informed', heading: 'Join the JANKS Family', text: 'Style notes, fabric stories, and early access to new commissions — delivered once a month, never more.', button_label: 'Subscribe', fine_print: 'No spam. Unsubscribe at any time. We respect your privacy.' } };
const order = ['hero', 'featured', 'services', 'story', 'categories', 'portfolio', 'testimonials', 'why', 'academy', 'consult', 'newsletter'];
fs.writeFileSync(__dirname + '/../janks-theme/templates/index.json', JSON.stringify({ sections: S, order }, null, 2) + '\n');
console.log('index.json written');
