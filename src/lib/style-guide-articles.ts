// Single source of truth for Style Academy articles.
// Imported by the article page (client), the article layout (server metadata + JSON-LD) and the sitemap.

export interface ArticleSection {
  heading?: string;
  body: string;
  quote?: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  heroImage: string;
  excerpt: string;
  sections: ArticleSection[];
  relatedSlugs: string[];
}

export const articles: Article[] = [
  {
    slug: "behind-the-pattern-bespoke-suit",
    title: "Behind the Pattern: Making a Bespoke Suit from Scratch",
    category: "Atelier Vlog",
    readTime: "5 min read",
    author: "Kwaku Acheampong",
    date: "April 2025",
    heroImage: "/suits-collection.webp",
    excerpt:
      "A rare look inside the atelier — from the first consultation and chalk marks on cloth through to the final fitting. This is what bespoke really means.",
    sections: [
      {
        heading: "What Does Bespoke Actually Mean?",
        body: `The word "bespoke" is one of the most misused in menswear. You'll see it applied to everything from trainers to hotel rooms — but its origin is precise. A garment is bespoke when it has been "spoken for": cut, constructed, and fitted for one specific person, from scratch, with no pre-existing pattern.\n\nAt JANKS, every suit begins with a conversation. Before a single piece of cloth is touched, we need to understand you — your lifestyle, your posture, the occasions you dress for, the impression you want to make. That conversation is not a formality. It is the foundation of everything that follows.`,
      },
      {
        heading: "The Consultation",
        body: `The first appointment typically lasts between 45 minutes and an hour. We take a comprehensive set of measurements — not just the standard chest, waist, and seat, but the subtler dimensions that off-the-rack sizing ignores entirely: the pitch of your shoulder, the curvature of your back, the drop between chest and waist.\n\nWe also observe. How you stand. Whether one shoulder sits higher than the other. Whether you carry weight differently on each side. A good tailor reads the body the way a portrait painter reads a face — looking for the character beneath the surface.\n\nFabric selection happens at this stage too. We'll guide you through hundreds of cloths — worsted wools, flannel, fresco, tweed — discussing weight, texture, pattern, and season. The cloth you choose will determine not just how the suit looks, but how it moves and how long it lasts.`,
        quote:
          "A bespoke suit is not made for how you are. It is made for how you want to be seen.",
      },
      {
        heading: "Cutting the Pattern",
        body: `Unlike made-to-measure, where a standard block is adjusted to your measurements, a bespoke pattern is drafted from zero using your unique dimensions. This is the stage most people never see — and it is where the real craft begins.\n\nThe pattern cutter plots each panel of the suit on paper, mapping the geometry of your body into two dimensions. Front and back body, side panels, sleeve head, collar — each piece is drawn, refined, and cross-checked before scissors touch cloth. A single error at this stage will compound through every subsequent stage of construction.\n\nOnce the paper pattern is approved, the cloth is laid out and cut by hand with a long, single-bladed cutter's knife. Not scissors. The precision required is formidable.`,
      },
      {
        heading: "Construction: The Long Work",
        body: `The body of a bespoke suit is built over weeks, not days. The canvas — a structured layer of horsehair canvas, linen, and felt — is hand-padded to the chest, creating the roll of the lapel and the three-dimensional shape that gives a great suit its chest. This is what separates true bespoke from the fused, glued construction of most high-street tailoring.\n\nThe sleeves are set by hand. The lining is sewn in by hand. The buttonholes — real, functional surgeon's cuffs — are cut and stitched by hand. Each of these operations takes time that machines cannot replicate. The result is a garment that molds progressively to your body with each wearing, becoming more precisely yours with every use.`,
        quote:
          "Canvassed construction breathes. A fused jacket is, in essence, a laminated sheet of stiffened fabric draped over a body.",
      },
      {
        heading: "The Fittings",
        body: `A bespoke suit typically requires two to three fittings before it is finished. The first fitting is a baste: the suit is loosely assembled in rough form, held together with temporary stitching, so the tailor can see how the pattern is translating to your body in three dimensions.\n\nThis is the critical stage. The shoulder seam is assessed. The chest is checked for suppression and roll. The collar is lifted or lowered. Adjustments are marked in chalk and the suit is returned to the bench. The second fitting is closer to completion — the suit is properly constructed but not yet finished. Final tweaks are made. The third fitting, if needed, is for minor refinements.\n\nBy the time you collect your suit, it has been touched by the tailor's hands hundreds of times.`,
      },
      {
        heading: "What You Take Home",
        body: `A bespoke suit from JANKS is not a purchase. It is a document. It records your measurements, your posture, your proportions — a pattern that belongs to you and can be referenced for every subsequent garment you commission.\n\nWear it well. Rotate it with other suits to let the cloth recover. Cedar-block and brush after each wearing. Re-press rather than dry clean wherever possible. A well-made bespoke suit, properly cared for, will outlast you.\n\nThat is not an exaggeration. That is the point.`,
      },
    ],
    relatedSlugs: ["why-every-man-needs-one-bespoke-shirt", "colour-theory-for-men"],
  },
  {
    slug: "why-every-man-needs-one-bespoke-shirt",
    title: "Why Every Man Needs One Bespoke Shirt",
    category: "Style Essay",
    readTime: "4 min read",
    author: "Kwaku Acheampong",
    date: "March 2025",
    heroImage: "/hero-suit-1.webp",
    excerpt:
      "Off-the-rail shirts are designed for a fictional average man. We explain why a single bespoke shirt will change how you think about your entire wardrobe.",
    sections: [
      {
        heading: "The Problem with Ready-to-Wear Shirts",
        body: `Walk into any department store and the shirts will be organised by collar size and chest measurement — as if a man's body is reducible to two numbers. It isn't. Men vary enormously in the relationship between their collar, chest, waist, shoulder width, sleeve length, and torso length. A shirt that fits the collar will gap at the chest. A shirt that fits the chest will billow at the waist. A shirt with the right sleeve length will be cut too long in the body.\n\nReady-to-wear shirts are not designed for any real person. They are designed for a statistical average — a composite of measurements that describes almost no one accurately. The result, for most men, is a shirt that fits adequately in some areas and poorly in others. We've grown so accustomed to this compromise that we've stopped noticing it.`,
      },
      {
        heading: "What a Bespoke Shirt Actually Fits",
        body: `A bespoke shirt is measured across fifteen to twenty dimensions. Collar circumference and height. Chest and waist and seat. Shoulder width and slope. Sleeve length from the back of the neck and from the shoulder point. Bicep circumference. Wrist circumference.\n\nBut beyond measurements, a bespoke shirtmaker also considers your posture. Whether you're broad across the back and narrow in the chest, or the reverse. Whether you carry tension in your shoulders. Whether one side of your body is subtly larger than the other — which is almost always the case.\n\nThe result is a shirt that lies flat across the chest without pulling. That tucks cleanly without excess fabric bunching at the waist. That falls from the shoulder without puckering or straining. Most men who wear their first bespoke shirt report the same sensation: it feels like the shirt simply disappears. It stops being something you wear and starts being part of how you present yourself.`,
        quote:
          "A well-fitting shirt is invisible. A poorly fitting one announces itself constantly.",
      },
      {
        heading: "The Collar: The Most Important Detail",
        body: `No part of a shirt is more visible — or more important — than the collar. It frames the face. It dictates how a tie sits. It determines whether a suit jacket lapel rolls cleanly or fights against the neckline.\n\nBespoke allows you to specify every variable: collar height, point length, spread angle, interlining stiffness, whether the collar is fused or soft. These aren't merely aesthetic choices. A collar that's too stiff will lift away from the neck by mid-morning. A collar that's too soft will wilt under a tie. A collar spread that doesn't match your tie knot will look permanently misaligned.\n\nFor most men, the collar style they settled for in ready-to-wear was the one they happened to find. Bespoke means choosing the collar that actually suits your face, your neck, and your way of wearing a tie.`,
      },
      {
        heading: "The Fabric Question",
        body: `Bespoke also opens up the fabric question in a way that ready-to-wear doesn't. You can select from hundreds of shirting cloths: two-fold Egyptian cotton, sea-island poplin, end-on-end chambray, Oxford weave, herringbone twill, brushed flannel.\n\nEach has its properties. Poplin is crisp and formal. Oxford is casual and textured. End-on-end has a subtle colour depth that reads as solid from a distance but is more interesting close up. Twill is smooth and drapes beautifully under a jacket.\n\nYou choose based on how and where you'll wear the shirt — not based on what happened to be on the rail in your size.`,
      },
      {
        heading: "One Shirt Changes Everything",
        body: `We suggest starting with one. Commission a single white poplin shirt with a semi-spread collar and barrel cuffs — the most versatile shirt that exists. Wear it for a month. Notice how differently you carry yourself in a shirt that actually fits.\n\nThen return and commission the second. The process becomes easier each time because the pattern is already yours — already refined to the particular architecture of your body. Subsequent shirts take less time and require fewer fittings.\n\nThe first bespoke shirt is a revelation. The wardrobe that follows it is a practice.`,
        quote:
          "Most men don't know what a well-fitting shirt feels like. Once they do, they cannot go back.",
      },
    ],
    relatedSlugs: ["behind-the-pattern-bespoke-suit", "unwritten-rules-of-black-tie-dressing"],
  },
  {
    slug: "unwritten-rules-of-black-tie-dressing",
    title: "The Unwritten Rules of Black Tie Dressing",
    category: "Occasion Dressing",
    readTime: "6 min read",
    author: "Kwaku Acheampong",
    date: "February 2025",
    heroImage: "/hero-suit-3.webp",
    excerpt:
      "Dinner jacket, bow tie, patent shoes — black tie has a strict vocabulary. Know the rules before you break them.",
    sections: [
      {
        heading: "Understanding the Dress Code",
        body: `Black tie is the most precisely codified of all dress codes — and the most frequently misunderstood. It is not simply "formal". It is a specific vocabulary of garments and accessories that evolved in the late nineteenth century as a slightly relaxed alternative to white tie, and which has since become the standard formal dress code for most evening occasions in Britain and beyond.\n\nWhen an invitation says "black tie", it means something specific. Knowing what it means — and knowing when you can deviate, and when you cannot — is the foundation of dressing well for formal occasions.`,
      },
      {
        heading: "The Dinner Jacket",
        body: `The dinner jacket — never called a tuxedo outside of North America — is the centrepiece of black tie. It should be black or midnight navy (midnight navy reads as darker than black under artificial light, which is why many sartorialists prefer it). Single-breasted with a shawl collar or peaked lapels. Double-breasted if you know what you're doing.\n\nThe lapels must be faced in silk — either grosgrain or satin. This is non-negotiable. A dinner jacket with wool or tweed lapels is not a dinner jacket; it's a suit jacket masquerading as one.\n\nThe jacket should be cut with a degree of suppression — a black tie silhouette is leaner and more precise than a lounge suit. The waist should be defined. The chest clean. Shoulders precise.`,
        quote:
          "A dinner jacket should fit as if it were made for you. Because, ideally, it was.",
      },
      {
        heading: "Trousers",
        body: `Black tie trousers follow strict rules. They must have a single satin or grosgrain stripe running down the outside of each leg — this mirrors the lapel facing and ties the ensemble together visually. No turn-ups. No belt. The trousers should be worn with braces (suspenders) or sit on the natural waist without additional support.\n\nFit is everything. Black tie trousers that pool at the ankle or flare at the thigh look careless. A clean break or no break at all is correct. The stripe should fall straight, uninterrupted, from hip to hem.`,
      },
      {
        heading: "The Shirt",
        body: `A black tie shirt should be white. Full stop for most occasions. The front should be either a bib of marcella (piqué cotton, textured and bright white) or pleated — both are correct, the choice is personal. The collar should be a turndown collar or, for a more traditional approach, a wing collar.\n\nWing collars require a bow tie to be tied at the correct height and fullness to frame them properly. They can look magnificent or disastrous depending on execution. For most men, a turndown collar is the more forgiving and arguably more elegant choice.\n\nCufflinks are mandatory. The shirt should have double cuffs — barrel cuffs are incorrect for black tie. Plain silver or gold cufflinks are always correct. Onyx, mother-of-pearl, or enamel links add character without breaking the code.`,
      },
      {
        heading: "The Bow Tie",
        body: `It must be tied. A pre-tied bow tie is an unambiguous statement that you either don't know how to tie one or couldn't be bothered to learn. Neither reflects well.\n\nTie your bow tie in silk — grosgrain or satin — in black. The width should broadly match your lapel width. The bow should be slightly asymmetric when tied by hand; this is a feature, not a flaw. It signals that a human being tied it, not a machine.\n\nLearn to tie it. It takes twenty minutes of practice. The payoff is permanent.`,
        quote:
          "An imperfectly tied bow tie is more distinguished than a perfect clip-on. One says you tried. The other says you didn't.",
      },
      {
        heading: "Shoes and Accessories",
        body: `Black patent leather Oxford shoes are the canonical black tie shoe. Court pumps (opera slippers with a grosgrain bow) are the more rarified choice. Black velvet slippers with embroidered motifs are acceptable at less formal events and dinner parties.\n\nA white pocket square in a flat presentation — the television fold, lying clean and flat in the breast pocket — completes the ensemble without competing with it. No coloured pocket squares. No printed patterns. The pocket square and the bow tie should recede, not announce themselves.\n\nA watch is acceptable; a dressier, thinner watch is preferable. A pocket watch with a dress waistcoat is exemplary.`,
      },
      {
        heading: "When to Break the Rules",
        body: `Once you understand the code completely, you earn the right to edit it. A velvet dinner jacket in deep burgundy or forest green reads as deeply considered, not rule-breaking. A double-breasted jacket with peak lapels is bold but correct. A black tie worn with a lounge shirt and a navy jacket for a relaxed dinner party can work if the fit is immaculate and the overall impression is deliberate.\n\nThe difference between breaking the rules elegantly and simply getting it wrong is knowledge. You must understand what you're departing from, and why. Deviation without understanding is not individuality — it's just error.`,
      },
    ],
    relatedSlugs: ["why-every-man-needs-one-bespoke-shirt", "colour-theory-for-men"],
  },
  {
    slug: "colour-theory-for-men",
    title: "Colour Theory for Men: Building Harmonious Outfits",
    category: "Style Theory",
    readTime: "5 min read",
    author: "Kwaku Acheampong",
    date: "January 2025",
    heroImage: "/hero-suit-4.jpeg",
    excerpt:
      "Navy and brown, charcoal and burgundy, tan and forest green — learn the colour pairings that elevate an outfit from good to exceptional.",
    sections: [
      {
        heading: "Why Colour Matters More Than Fit",
        body: `Fit is the foundation of dressing well — but colour is what makes an outfit memorable. A man can wear a perfectly fitted suit in a colour combination that jars, and the technical excellence will be invisible. Conversely, a thoughtfully chosen palette can make even modest tailoring look intentional and sophisticated.\n\nMost men approach colour defensively, defaulting to navy, grey, and white because these feel safe. They are safe. But "safe" and "excellent" are not the same thing. Understanding why certain colours work together — not just which ones, but why — unlocks the ability to dress with genuine confidence rather than borrowed caution.`,
      },
      {
        heading: "The Menswear Colour Wheel",
        body: `Men's clothing operates within a narrower palette than womenswear, which is both a constraint and a gift. The neutral anchors — navy, charcoal, grey, tan, camel, olive, brown — provide a stable foundation. Earth tones and muted accent colours — burgundy, forest green, rust, mustard, slate blue — provide the character.\n\nThe key principle is tonal harmony. Colours don't need to be complementary in the classical chromatic sense — they need to share an underlying temperature. Warm tones (browns, tans, rusts, olive, burgundy) group naturally. Cool tones (navy, charcoal, grey, slate, forest green) group naturally. Mixing temperatures can work — but requires a considered bridging element to prevent the ensemble from feeling disjointed.`,
        quote:
          "Colour does not need to contrast. It needs to converse.",
      },
      {
        heading: "The Great British Pairings",
        body: `Some colour combinations have earned their place in the menswear canon through decades of proven elegance:\n\n**Navy and Brown** — the single most sophisticated pairing in men's tailoring. A navy suit with tan or chocolate brown shoes and belt. The contrast is warm, the tones harmonise, and the combination reads as both formal and approachable.\n\n**Charcoal and Burgundy** — winter dressing at its most assured. A charcoal flannel suit with a deep burgundy tie and white shirt. The cold grey of the charcoal is warmed by the burgundy without being overwhelmed by it.\n\n**Tan and Forest Green** — a countryside pairing that works equally well in the city. A tan suit or blazer with a forest green knit tie and brown suede shoes. Earthy, textured, and quietly confident.\n\n**Mid-Grey and Camel** — clean and contemporary. A mid-grey suit with a camel overcoat draped over the shoulders. The two neutrals create depth without colour conflict.`,
      },
      {
        heading: "Pattern and Colour Together",
        body: `When pattern enters the equation, the rules shift. A suit with a visible check or stripe already carries multiple colours — your accessories need to respond to that, not compete with it.\n\nThe principle is scale contrast. A large windowpane check calls for a small-scale tie pattern (fine stripes, small dots) and vice versa. The colours in the tie should echo one of the secondary colours in the suit — picking up the overcheck colour in a glen plaid, for instance.\n\nSolid ties are often the correct answer when a suit has strong pattern. They create visual rest. The interest comes from the texture of the cloth — a wool grenadine tie in a deep jewel tone, a silk knit in olive or burgundy — rather than from pattern competition.`,
      },
      {
        heading: "Seasonal Colour Instincts",
        body: `Seasonal dressing is not about being literal — you are not required to wear green in spring or orange in autumn. It is about instinct and appropriateness. Heavy, dark cloths in deep tones feel natural in winter. Lighter cloths in paler, more washed tones feel natural in summer. Trusting this instinct produces outfits that feel composed rather than calculated.\n\nLinen in the summer: stone, sand, white, pale blue. Flannel in the winter: charcoal, navy, dark grey. Tweed in autumn: rust, tan, olive, heather tones. These are not rules — they are starting points. Your departures from them should be deliberate.`,
        quote:
          "Dressing well in colour is not about being bold. It is about being coherent.",
      },
      {
        heading: "Building Your Colour Foundation",
        body: `Start with your anchors. If you own a navy suit, a charcoal suit, and a mid-grey suit, you have covered the vast majority of occasions. Build your shirts around white, pale blue, and ecru. From there, introduce accent through ties, pocket squares, and accessories in the warm earth tones — burgundy, rust, tan, forest green.\n\nOnce this foundation is established, you can begin to add colour through cloth — a tan linen blazer, a mid-brown suit, a pale olive sport coat. The foundation makes the addition legible.\n\nColour is not something you add to an outfit. It is something you build into a wardrobe over time. The most elegantly dressed men are not wearing more interesting colours than anyone else — they are wearing the right colours in the right combinations, with the right weight of cloth, in the right season. That is the whole art.`,
      },
    ],
    relatedSlugs: ["behind-the-pattern-bespoke-suit", "unwritten-rules-of-black-tie-dressing"],
  },
];
