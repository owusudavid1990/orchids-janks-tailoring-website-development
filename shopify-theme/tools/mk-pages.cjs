// Generates the page templates (About, Services, Process, Gallery, Fit Guide, ...) with the reference copy as block settings.
const fs = require('fs');
const T = __dirname + '/../janks-theme/templates/';
const w = (n, o) => fs.writeFileSync(T + n, JSON.stringify(o, null, 2) + '\n');
function blocks(list) { const b = {}, o = []; list.forEach(([type, settings], i) => { const id = type + '_' + (i + 1); b[id] = { type, settings }; o.push(id); }); return { blocks: b, block_order: o }; }
const P = (text, emphasis) => ['paragraph', emphasis ? { text, emphasis: true } : { text }];

// ── About ─────────────────────────────────────────────────────────────
w('page.about.json', { sections: { main: { type: 'janks-page-about', ...blocks([
  ['image', { alt: 'Master tailor at work', side: 'left' }],
  P("JANKs Tailoring was born from a singular passion: the pursuit of the perfect fit. What began as a young tailor's personal journey into the world of bespoke menswear has evolved into a refined destination for individuals who understand that true elegance lies in craftsmanship, precision, and attention to detail."),
  P("The story of JANKs begins in Ghana, where founder Kwaku Nketiah Acheampong first discovered his passion for fashion and textiles. While studying Fashion & Textiles at Kumasi Technical University, he immersed himself in the art of garment construction, pattern making, and design. This period laid the foundation for his technical expertise and ignited the entrepreneurial spirit that would soon define his career."),
  P("In 2016, Kwaku transformed his passion into a fully-fledged enterprise by establishing JANKs Tailoring, which quickly expanded from a one‑person venture into a growing business overseeing a team of six staff. Clients quickly came to associate JANKs with precision, exceptional customer service, and garments that felt uniquely personal. Whether creating bespoke suits or traditional African garments, every stitch was placed with purpose, skill, and pride."),
  P("JANKs Tailoring earned a loyal clientele not only because of the craftsmanship, but because of Kwaku's approach. He took the time to understand each client's tastes, shape, and personality. For him, tailoring wasn't just about fabric, it was about creating confidence. Clients returned repeatedly, trusting him with their most important garments, knowing that every piece would be crafted with thoughtfulness and integrity."),
  ['clear', {}],
  ['image', { alt: 'Tailoring craftsmanship', side: 'right' }],
  P("Throughout this journey, faith in God remained the most important foundation of Kwaku's growth. Every step from his early apprenticeship days in Ghana, to building a thriving tailoring business, to moving across continents was guided by a deep belief that God's hand was shaping his path. Kwaku attributes his resilience, opportunities, creativity, and milestones to God's grace. His progress reflects not only hard work and skill, but a conviction that he is walking in the purpose God has prepared for him. Faith continues to guide where he is today and where he is destined to go."),
  P("Kwaku migrated to the United Kingdom as a refugee in 2022 and despite considerable challenges associated with rebuilding his life in a new country, he remained committed to pursuing his long‑held dreams. Navigating unfamiliar systems, adapting to cultural and social differences, and overcoming setbacks that would have discouraged many, he has consistently demonstrated remarkable determination and resilience. His journey reflects not only his personal strength but also his unwavering belief in his aspirations, which continue to motivate him as he strives for a brighter and more stable future."),
  P("His journey in the United Kingdom took him to some of the most respected names in British tailoring, including Ozwald Boateng Studios and Anderson & Sheppard on Savile Row. These experiences deepened his understanding of luxury menswear, enhanced his mastery of intricate tailoring techniques, and strengthened his commitment to excellence."),
  ['clear', {}],
  ['image', { alt: 'Tailored suit detail', side: 'left', square: true }],
  P("These experiences combined with his faith, determination, and unwavering commitment to excellence now shape the identity of JANKs Tailoring. The brand stands as a fusion of Ghanaian artistry, British refinement, and a relentless dedication to perfect fit. Every garment tells a story. Every measurement is taken with intention. Every detail reflects years of learning, growth and passion."),
  P("Today, JANKs Tailoring is more than a tailoring service. It is the embodiment of a journey shaped by craftsmanship, culture, and the belief that God guides every step. JANKs Tailoring continues to evolve, but its core belief remains unchanged:"),
  P("We are not merely crafting garments, we are creating Confidence In Gentility.", true),
  ['clear', {}],
  ['value', { title: 'Craftsmanship', text: 'Every stitch is placed with intention, every detail considered.' }],
  ['value', { title: 'Integrity', text: 'We use only the finest materials and transparent pricing.' }],
  ['value', { title: 'Personalization', text: 'No two bodies are alike; no two suits should be either.' }],
  ['value', { title: 'Legacy', text: 'We create garments meant to last generations, not seasons.' }]]),
  settings: { eyebrow: 'Our Story', heading: 'The Art of Tailoring', journey_eyebrow: 'A Personal Journey', journey_heading: 'Where tradition meets innovation',
    journey_text: 'With Ghanaian roots and a deep appreciation for both African heritage and contemporary fashion, my creative vision is shaped by the stories, textures, and symbolism embedded within my culture. I aim to fuse the richness of African history with modern design principles to create fashion that feels both innovative and meaningful. My goal is to develop pieces that honour traditional influences such as African craftsmanship, fabrics, and motifs while presenting them through a fresh, contemporary lens. By blending these two worlds, I hope to produce work that not only stands out aesthetically, but also celebrates identity, heritage, and the evolving narrative of African creativity in global fashion.',
    founder_name: 'Kwaku Acheampong', founder_role: 'Founder & Master Tailor', values_eyebrow: 'Our Values', values_heading: 'What guides us',
    cta_heading: 'Begin Your Journey', cta_text: 'Experience the JANKS difference. Book a consultation and discover what bespoke tailoring truly means.', cta_label: 'Book Consultation' } } }, order: ['main'] });
// ── Services ──────────────────────────────────────────────────────────
w('page.services.json', { sections: { main: { type: 'janks-page-services', ...blocks([
  ['approach', { title: 'Heritage', subtitle: 'Traditional Craftsmanship', lead: 'Made the way it was made before shortcuts existed.', description: 'A canvas laid inside the chest so the jacket takes on your posture over years, rather than losing its shape in months. Buttonholes worked by hand. Cloth chosen for how it wears in, not how it photographs on the first day.', features: 'Hand-stitched buttonholes\nTraditional canvas construction\nHeritage cloth selection\nClassic silhouettes' }],
  ['approach', { title: 'Confidence', subtitle: 'Power Dressing', lead: "For the rooms where you're read before you speak.", description: 'A structured shoulder and a clean line through the chest. Cut close enough to look deliberate, generous enough to work a full day in. Quiet cloth, considered proportion — presence without anything that shouts.', features: 'Structured shoulder construction\nConsidered proportion\nPremium wool and silk blends\nExecutive styling' }],
  ['approach', { title: 'Sartorial', subtitle: 'Occasion & Celebration', lead: 'Cloth that speaks first.', description: "Brocades, jacquards and velvets cut on a clean modern line, so the cloth carries the interest and the tailoring stays quiet beneath it. For the occasions where turning up in plain navy isn't the point.", features: 'Brocade, jacquard and velvet\nContemporary cuts\nContrast lapels and detailing\nWeddings and occasion wear' }],
  ['offering', { name: 'Consultation', price: 'By appointment', meta: '30 minutes', description: 'A conversation before any commitment. Talk through the occasion, the cloth and what you already own. Nothing is measured or ordered unless you want it to be.' }],
  ['offering', { name: 'Bespoke Suit', price: 'From £1,200', meta: 'Allow 4–6 weeks', description: 'A pattern drafted for you alone, cut and constructed from scratch. Multiple fittings, and every detail — cloth, lining, buttons, pockets — decided by you.' }],
  ['offering', { name: 'Made-to-Measure', price: 'From £650', meta: 'Allow 4–6 weeks', description: 'An existing block adjusted to your measurements. Much of the character of bespoke, at a lower cost and with fewer fittings.' }],
  ['offering', { name: 'Custom Shirt', price: 'From £75', meta: 'Collar, cuff and cloth to your specification', description: 'Collar shape, cuff, placket and cloth chosen and cut to your measurements. Worth doing in pairs — the difference against off-the-peg is most obvious on a shirt.' }],
  ['offering', { name: 'Alterations', price: 'From £50', meta: 'Garments you already own', description: "Sleeves shortened, waists taken in, jackets rebalanced. Bring us something that never quite fitted and we'll tell you honestly whether it can be saved." }],
  ['step', { title: 'Consultation', text: "We talk through the occasion, your wardrobe and what you want the garment to do. At our studio, or at your home or office. You're under no obligation to proceed." }],
  ['step', { title: 'Measure & Cloth', text: 'Measurements are taken and the cloth, lining and details are chosen together. A 70% deposit is taken before work begins.' }],
  ['step', { title: 'Fittings', text: 'The garment is fitted on you and adjusted — on your body, not a mannequin. Private fittings can be arranged at your home or office.' }],
  ['step', { title: 'Collection', text: 'Collect in person, or have it sent by DHL. Allow four to six weeks from the first measurement.' }],
  ['faq', { question: 'How long does a commission take?', answer: "Allow four to six weeks from your first measurement. If you have a date to work to — a wedding, an event — tell us at the consultation and we'll be straight with you about whether it's achievable." }],
  ['faq', { question: 'What is your payment structure?', answer: "A 70% deposit is taken before any work begins, with the balance due on completion. You'll be given a firm figure at the consultation, so nothing about the cost comes as a surprise later." }],
  ['faq', { question: 'What is the cancellation process?', answer: "Consultations can be cancelled or rearranged at any time — reply to your confirmation email and we'll sort it. Once cutting has started, bespoke and made-to-measure garments cannot be refunded: the cloth has been cut to your pattern and can't be used for anyone else." }],
  ['faq', { question: 'Where do fittings take place?', answer: 'Private fittings can be arranged at your home or your office anywhere in London, as well as at our studio — whichever suits you.' }],
  ['faq', { question: 'Do you deliver outside London?', answer: 'Yes. Finished garments are sent by DHL, with tracking. UK delivery is typically three to four working days, and we ship internationally.' }],
  ['faq', { question: "I'm not sure which service I need.", answer: "Then book the consultation. That's what it's for — describing what you want in plain language and letting us tell you what it takes." }]]),
  settings: { hero_eyebrow: 'Our Expertise', hero_heading: 'Services', hero_text: 'Three approaches to the same intention — a garment that fits you, made in London, by people who will tell you the truth about what suits you.', approach_button: 'Book a Consultation',
    offerings_eyebrow: 'What We Make', offerings_heading: 'Book Appointment', offerings_note: "Prices are starting points — the cloth you choose is the largest variable. You'll be given a firm figure at the consultation, before anything is committed to.",
    process_eyebrow: 'The Process', process_heading: 'From conversation to collection', faq_eyebrow: 'Before You Book', faq_heading: 'Questions worth asking',
    closing_eyebrow: 'Confidence In Gentility', closing_heading: 'Start with a conversation', closing_text: 'A conversation first, with nothing committed. Come with an occasion in mind, or just a suit that has never fitted properly.' } } }, order: ['main'] });
// ── Process (reference /work) ─────────────────────────────────────────
w('page.process.json', { sections: { main: { type: 'janks-page-process', ...blocks([
  ['service', { title: 'Bespoke Suit', duration: '8-12 weeks', intro: 'A bespoke suit is more than a garment—it is a collaboration between artisan and client, resulting in a piece that exists nowhere else in the world.',
    steps: ['Consultation | 90 min | Your journey begins with an intimate conversation about lifestyle, occasions, and personal aesthetic.',
      'Measurements | 45 min | Over forty individual measurements form the blueprint of your pattern.',
      'Pattern Cutting | 2-3 days | Your master pattern is drafted by hand, where science meets intuition.',
      'First Fitting | 60 min | The basted garment arrives—adjustments are pinned and balance refined.',
      'Construction | 4-6 weeks | Hand-padded lapels, pick stitching, and hand-worked buttonholes.',
      'Final Fitting | 30 min | Your finished suit is presented, pressed, and perfected.'].join('\n') }],
  ['service', { title: 'Made-to-Measure', duration: '4-6 weeks', intro: 'Made-to-measure represents the perfect balance between accessibility and individuality, creating a fit that rivals bespoke.',
    steps: ['Style Selection | 45 min | Browse our curated collection of silhouettes from contemporary slim cuts to classic English drape.',
      "Fabric & Details | 30 min | Choose from hundreds of the world's finest fabrics and personalise every detail.",
      'Measurement | 30 min | Twenty-five key measurements taken and cross-referenced against master patterns.',
      'Construction | 3-4 weeks | Cut and assembled by skilled tailors with hand-finished critical elements.',
      'Fitting | 45 min | Final fitting with minor adjustments made in-house to perfect the silhouette.'].join('\n') }],
  ['service', { title: 'Alterations', duration: '1-2 weeks', intro: 'Our alterations service applies bespoke techniques to transform any garment, ensuring your wardrobe performs at its best.',
    steps: ['Assessment | 20 min | Each garment is examined with a critical eye to identify the best approach.',
      'Fitting & Marking | 30 min | Our tailor pins and marks every adjustment with methodical precision.',
      'Alteration | 1-2 weeks | Alterations executed with surgical precision, respecting original construction.',
      'Final Review | 15 min | Your altered garment is pressed, inspected, and prepared for collection.'].join('\n') }]]),
  settings: { eyebrow: 'Our Process', heading: 'The Making', cta_heading: 'Ready to begin?', cta_text: 'Book your consultation and experience the art of true tailoring.', cta_label: 'Book Consultation' } } }, order: ['main'] });
// ── Gallery (photo order and alt text as on the reference; files from Settings → Files) ──
const ph = (filename, alt, category) => ['photo', { filename, alt, category }];
w('page.gallery.json', { sections: { main: { type: 'janks-page-gallery', ...blocks([
  ph('event-03.jpg', 'Groom Ivory Jacket Rooftop', 'events'),
  ph('event-02.jpg', 'Groom Ivory Jacquard Dinner Jacket', 'events'),
  ph('event-01.jpg', 'Groom White Shirt Black Bowtie', 'events'),
  ph('jt-gallery-copper-brocade-dinner-jacket.jpg', 'Copper Brocade Dinner Jacket', 'garments'),
  ph('garment-11.jpg', 'Copper Brocade Lapel Detail', 'garments'),
  ph('garment-10.jpg', 'Copper Brocade Shawl Lapel', 'garments'),
  ph('garment-08.jpg', 'Ivory Jacquard Jacket Detail', 'garments'),
  ph('garment-09.jpg', 'Ivory Jacquard Jacket Mannequin', 'garments'),
  ph('garment-06.jpg', 'Navy Beaded Mandarin Collar Jacket', 'garments'),
  ph('garment-05.jpg', 'Navy Beaded Yoke Detail', 'garments'),
  ph('garment-07.jpg', 'Navy Jacquard Pocket And Cuff Detail', 'garments'),
  ph('garment-01.jpg', 'Peacock Velvet Jacket Lapel Detail', 'garments'),
  ph('garment-04.jpg', 'Peacock Velvet Jacket Staircase Angle', 'garments'),
  ph('garment-03.jpg', 'Peacock Velvet Jacket Staircase Front', 'garments'),
  ph('garment-02.jpg', 'Peacock Velvet Jacket Window Light', 'garments')]),
  settings: { eyebrow: 'Portfolio', heading: 'Gallery', text: 'A closer look at the garments that leave our atelier — from cloth and construction to the moments they were made for.' } } }, order: ['main'] });
// ── Contact ───────────────────────────────────────────────────────────
w('page.contact.json', { sections: { main: { type: 'janks-page-contact', ...blocks([
  ['hours', { days: 'Monday – Friday', time: '9:00 – 18:00' }],
  ['hours', { days: 'Saturday', time: '10:00 – 16:00' }],
  ['hours', { days: 'Sunday', time: 'By appointment', muted: true }],
  ['social', { network: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/official_janks.tailoring?igsh=azNjdnkzYXU0Mm1h&utm_source=qr' }],
  ['social', { network: 'youtube', label: 'YouTube', url: 'https://youtube.com/@jankstailoring?si=FEwqqKDFy-IdMElm' }],
  ['social', { network: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@janks.tailoring' }],
  ['social', { network: 'pinterest', label: 'Pinterest', url: 'https://www.pinterest.com/JanksTailoring/' }]]),
  settings: { eyebrow: 'Get in Touch', heading: 'Contact Us', founder_name: 'Kwaku Acheampong', founder_role: 'Master Tailor & Founder', email: 'jankstailoring@gmail.com', phone: '+44 7565 533096', address: '3rd Floor, 86-90 Paul Street\nLondon, EC2A 4NE', form_heading: 'Send a Message', form_text: 'We typically respond within 24 hours.' } } }, order: ['main'] });
// ── Fit Guide (template only; assign it to a "Fit Guide" page when one is created) ──
const chart = (title, note, columns, rows) => ['size_chart', { title, note, columns, rows: rows.map((r) => r.join(' | ')).join('\n') }];
w('page.fit-guide.json', { sections: { main: { type: 'janks-page-fit-guide', ...blocks([
  ['measure_group', { tab_label: 'Shirt', title: 'Shirt Measurements', image_alt: 'Shirt measurement guide', items: [
    'Collar | Measure around the base of your neck, where a shirt collar sits. Add 1/2 inch for comfort.',
    'Chest | Measure around the fullest part of your chest, under the arms, with arms relaxed at sides.',
    'Waist | Measure around your natural waistline, typically the narrowest part of your torso.',
    'Sleeve Length | From the center back of neck, across the shoulder, down to the wrist bone with arm slightly bent.',
    'Shoulder Width | Measure from the edge of one shoulder to the other, across the back.'].join('\n') }],
  ['measure_group', { tab_label: 'Suit', title: 'Suit Measurements', image_alt: 'Suit measurement guide showing chest, waist, sleeve length, shoulder width, and other key measurements', items: [
    'Chest | Measure around the fullest part of your chest, under the arms, keeping the tape level. Arms should be relaxed at your sides.',
    "Waist | Measure around your natural waistline, typically at the navel or slightly above, where you'd wear your trouser waistband.",
    'Shoulder Width | Measure from the edge of one shoulder bone to the other, across the back where the sleeve seam would sit.',
    'Sleeve Length | From the shoulder point, down the outside of the arm to the wrist bone, with arm slightly bent.',
    'Jacket Length | From the base of the collar at the center back, down to where you want the jacket to end (typically mid-seat).',
    'Armhole | Measure around the armhole opening, from the top of the shoulder down under the arm and back up.'].join('\n') }],
  ['measure_group', { tab_label: 'Trousers', title: 'Trouser Measurements', image_alt: 'Trouser measurement guide showing waist, hip, thigh, knee, outseam, front rise, back rise, and hem measurements', items: [
    'Waist | Measure around where you normally wear your trousers, keeping the tape comfortably snug.',
    'Seat/Hip | Measure around the fullest part of your hips and seat.',
    'Inseam | From the crotch seam down to the bottom of the ankle bone, along the inside leg.',
    'Outseam | From the waist to the desired length along the outside of the leg.',
    'Thigh | Measure around the fullest part of your thigh, typically just below the crotch.'].join('\n') }],
  chart('Shirt Size Chart', 'All measurements in inches', 'Size | Collar | Chest | Waist | Sleeve', [['XS', '14', '34-36', '28-30', '32'], ['S', '14.5', '36-38', '30-32', '33'], ['M', '15-15.5', '38-40', '32-34', '34'], ['L', '16-16.5', '42-44', '36-38', '35'], ['XL', '17-17.5', '46-48', '40-42', '36'], ['XXL', '18-18.5', '50-52', '44-46', '37']]),
  chart('Trouser Size Chart', 'All measurements in inches', 'Size | Waist | Seat | Inseam', [['28', '28', '34', '30-32'], ['30', '30', '36', '30-32'], ['32', '32', '38', '30-32'], ['34', '34', '40', '30-32'], ['36', '36', '42', '30-32'], ['38', '38', '44', '30-32'], ['40', '40', '46', '30-32']]),
  chart('Suit Size Chart', 'All measurements in inches. S = Short, R = Regular, L = Long', 'Size | Chest | Waist | Shoulder | Sleeve | Jacket Length', [['36S', '36', '30', '17', '23', '28'], ['38R', '38', '32', '17.5', '24', '29'], ['40R', '40', '34', '18', '24.5', '30'], ['42R', '42', '36', '18.5', '25', '31'], ['44R', '44', '38', '19', '25.5', '31.5'], ['46L', '46', '40', '19.5', '26', '32'], ['48L', '48', '42', '20', '26.5', '32.5']])]),
  settings: { eyebrow: 'How to Measure', heading: 'Fit Guide', charts_tab_label: 'Size Charts', cta_heading: 'Need Help Measuring?', cta_text: 'Book a consultation and our expert tailors will take all measurements for you, ensuring the perfect fit every time.', cta_label: 'Book Consultation' } } }, order: ['main'] });
console.log('pages written');
