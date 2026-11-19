# JANKS Tailoring — Backlink & Visibility Strategy

Prepared September 2026. Everything here is white-hat: no bought links, no link networks,
no comment spam. Google penalises those, and with the Merchant Center suspension already on
record, JANKS cannot afford another trust problem with Google.

## 0. Read this first: why the site isn't showing on Google

An audit of the live site (18 Sept 2026) found the technical side already sound — Lighthouse
SEO score 100, valid robots.txt and sitemap.xml, HTTPS enforced, no `noindex` anywhere,
canonicals present. So the site is *allowed* to be indexed. The realistic reasons it isn't
showing are the ones code can't fix:

1. **Search Console may not be set up** (or the sitemap was never submitted) — see section 1.
2. **The domain has almost no backlinks.** Google finds and trusts new sites mainly through links
   from other sites. This is the biggest gap and the reason this document exists.
3. **New/low-authority domain.** Even a perfect site can take 2–4 months to surface for
   competitive searches like "bespoke tailor London". Branded searches ("JANKS Tailoring")
   come first; generic ones come last.

## 1. Search Console setup (do this first — it takes 15 minutes)

Nothing below works well until Google is told the site exists.

1. Go to search.google.com/search-console and sign in as **jankstailoring@gmail.com**.
2. Add property → **URL prefix** → `https://jankstailoring.com/`.
3. Verify with **Google Analytics** (fastest — the tag `G-HFWSNXJXKH` is already on the site and
   that same Google account owns the Analytics property). No code change needed.
4. Then add a second property → **Domain** → `jankstailoring.com` and verify with the DNS TXT record
   Google gives you (added where the domain's DNS is managed). This covers www/http variants too.
5. **Sitemaps** → submit `sitemap.xml`. Status should say "Success".
6. **URL Inspection** → paste each of these, click **Request indexing**:
   `/`, `/services`, `/book`, `/about`, `/gallery`, `/contact`, `/category`.
7. After a week, open **Pages** and read the "Why pages aren't indexed" list. "Crawled – currently
   not indexed" means Google saw the page but judged it not yet worth indexing — a signal that
   more links and unique content are needed (sections 2–4), not a technical fault.
8. Repeat steps 2 and 5 in **Bing Webmaster Tools** (bing.com/webmasters) — it can import
   straight from Search Console. Bing already lists jankstailoring.com, so this is quick.

If you want the meta-tag verification method instead, send the token Google gives you and it can
be added to the site's metadata in one line.

## 2. Foundation links (week 1–2, all free, all yours to claim)

These give Google consistent proof the business is real. **Use identical name, address and phone
everywhere** (this is called NAP consistency):

> JANKS Tailoring · 3rd Floor, 86–90 Paul Street, London EC2A 4NE · +44 7565 533096 · https://jankstailoring.com

Claim or create, in this order of value:

| Profile | Notes |
|---|---|
| Google Business Profile | Already active. Keep posting; reply to every review. |
| Bing Places for Business | Import from Google Business Profile. |
| Apple Business Connect | Feeds Apple Maps / Siri. Often forgotten, easy win. |
| LinkedIn company page | Link to the site; add Kwaku as founder. |
| Facebook, Instagram, Pinterest, YouTube, TikTok | Already in the site's schema (`sameAs`). Make sure each bio links to jankstailoring.com. |
| Trustpilot | Create a profile; send the ~15 Google reviewers a polite invite to also review there. |
| Yell.com, Thomson Local, Cylex UK, FreeIndex, Yelp UK | Free UK directories. Only add if you can list the exact NAP above. |
| Companies House | Already public. Make sure the website field on the company record matches. |

## 3. Earned links — where the real ranking power is (weeks 2–12)

### 3a. The story is the asset
Kwaku's path — trained in Kumasi, worked at Ozwald Boateng Studios and Anderson & Sheppard on
Savile Row, rebuilt in London — is genuinely newsworthy. Journalists link to stories, not shops.
Angles:

- "From Kumasi to Savile Row: the tailor rebuilding a bespoke house in London"
- "Refugee entrepreneur builds a Savile Row–trained tailoring business" (only if Kwaku is
  comfortable telling that part publicly — it must be his choice)
- "What bespoke actually means" (the Style Academy article already written)

Pitch to: UK Black and African-diaspora media, menswear blogs and magazines, small-business and
entrepreneurship publications, London local press, and charities/organisations that publish
refugee-entrepreneur success stories. One good pitch beats fifty generic ones.

### 3b. Journalist-request platforms (free tiers exist)
Qwoted, Featured.com, SourceBottle, ResponseSource. Journalists post questions ("a tailor who
can explain how to dress for a summer wedding"); a useful, quotable answer usually earns a
link. Answer 2–3 a week, briefly, with a real opinion.

### 3c. Partners who genuinely work with you (highest hit-rate)
Ask for a link only where a real working relationship exists:

- **The wedding photographer/venue** behind the groomsmen-garden image used on the homepage.
  Vendors routinely credit each other; ask for a "suits by JANKS Tailoring" credit with a link.
- **Wedding planners, florists, barbers, shoe makers, photographers** in London — offer a
  "recommended vendors" swap on both sites.
- **The cloth mills you actually buy from** — many run "find a tailor" or stockist pages.
- **Corporate and wedding clients** willing to be a named case study with a link.
- **Bridebook and Hitched (UK)** — wedding-vendor directories where groomswear is searched.

### 3d. Reclaim what already exists
Set a Google Alert for `"JANKS Tailoring"`, `"JANKs Tailoring"` and `"Kwaku Acheampong"`. When
someone mentions the business without linking, email them a friendly request to add the link.

## 4. Content worth linking to (build once, earn links for years)

Links follow useful pages. Already live: the four Style Academy essays and the Fit Guide.
Highest-value additions:

1. **"Bespoke vs made-to-measure vs off-the-rack: what it costs in London"** — a plain comparison
   table with real ranges. Pages that answer "how much" get cited constantly.
2. **"Wedding suit timeline: when to order for your date"** — a week-by-week checklist.
3. **"Groomsmen suit planner"** — a downloadable checklist for the groom and party.
4. **Local pages** (only if real, not templated): "Bespoke tailor in Shoreditch / EC2A".
5. **Client stories** (with permission): the suit, the occasion, the fit journey. Real photos.

Each new page should have one H1, a unique title and description, and links to `/services` and
`/book` — the site templates already handle the technical side.

## 5. Things NOT to do

- Do not buy links, join link exchanges, or use "10,000 backlinks" services.
- Do not repeat one exact keyword as the link text everywhere ("bespoke tailor London").
  Mix brand name, URL and natural phrases.
- Do not spam forums or blog comments. Contribute properly or not at all.
- Do not use AI-generated mass articles on other sites to carry links.
- Do not touch Google's "disavow" tool unless Search Console reports a manual action.

## 6. 90-day plan

| When | Do |
|---|---|
| Week 1 | Search Console + Bing setup (section 1). Claim all foundation profiles (section 2). |
| Week 2 | Email the wedding photographer and venue for a credit link. Set Google Alerts. Invite reviewers to Trustpilot. |
| Weeks 3–4 | Publish the London price comparison page. Pitch 5 outlets with the founder story. |
| Weeks 5–8 | Answer 2–3 journalist requests a week. Approach 5 local partners for vendor-swap links. Publish the wedding timeline page. |
| Weeks 9–12 | Ask 2 mills for stockist pages. Publish 1–2 client stories. Review Search Console and repeat what earned links. |

## 7. How to know it's working

Check Search Console monthly (**Links** report and **Performance** report):

| Measure | 90-day realistic target |
|---|---|
| Referring domains (unique sites linking) | 10–15 quality domains |
| Pages indexed | All pages in the sitemap |
| Impressions for branded search ("JANKS Tailoring") | Steady growth week on week |
| First appearances for local terms | "bespoke tailor London", "made to measure suit London", "wedding suits London", "groomsmen suits London" — expect page 2–3 first; page 1 takes longer |

Ten good links from real sites beat five hundred poor ones. Consistency for six months matters
more than any single week.
