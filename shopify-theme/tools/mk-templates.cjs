// Generates the JSON templates for the commerce pages (collection.json is maintained by hand).
const fs = require('fs');
const T = __dirname + '/../janks-theme/templates/';
const w = (n, o) => fs.writeFileSync(T + n, JSON.stringify(o, null, 2) + '\n');
w('product.json', { sections: { main: { type: 'janks-product', settings: { back_label: 'Back to Shop' } } }, order: ['main'] });
const BOOK = 'https://jankstailoring.com/book';
const tiles = [
  ['Suits', 'Impeccably tailored suits for every occasion', BOOK],
  ['Shirts', 'Premium dress shirts crafted to perfection', BOOK],
  ['Trousers', 'Classic and contemporary trouser styles', BOOK],
  ['Neck Ties', 'Handcrafted silk ties in classic and contemporary patterns', '/collections/neckties'],
  ['Cufflinks', 'Refined cufflinks for the discerning gentleman', '/collections/mother-of-pearl-cufflinks-copy-1'],
  ['Pocket Squares', 'The finest finishing touch to every ensemble', '/collections/pocket-square']];
const b = {}, o = [];
tiles.forEach(([title, description, url], i) => { b['tile_' + (i + 1)] = { type: 'tile', settings: { title, description, url } }; o.push('tile_' + (i + 1)); });
w('list-collections.json', { sections: { main: { type: 'janks-categories', blocks: b, block_order: o, settings: { eyebrow: 'Shop Collection', heading: 'Categories', text: 'Browse our curated collection and shop directly from our Shopify store. Each piece reflects our commitment to exceptional craftsmanship.' } } }, order: ['main'] });
w('cart.json', { sections: { main: { type: 'janks-cart-page', settings: { eyebrow: 'Shopping Bag', heading: 'Your Cart' } } }, order: ['main'] });
w('search.json', { sections: { main: { type: 'janks-search', settings: { eyebrow: 'Search', heading: 'Find something' } } }, order: ['main'] });
w('404.json', { sections: { main: { type: 'janks-404', settings: { eyebrow: 'Error 404', heading: 'Page not found', text: 'The page you are looking for has been moved or no longer exists. Let us take you back to something well made.', button_label: 'Back to Home' } } }, order: ['main'] });
w('page.json', { sections: { main: { type: 'janks-page-default', settings: { eyebrow: 'JANKS Tailoring' } } }, order: ['main'] });
w('blog.json', { sections: { main: { type: 'janks-blog', settings: { eyebrow: 'Style Academy' } } }, order: ['main'] });
w('article.json', { sections: { main: { type: 'janks-article', settings: { cta_label: 'Book a Consultation' } } }, order: ['main'] });
console.log('templates written');
