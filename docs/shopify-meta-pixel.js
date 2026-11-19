/* ---------------------------------------------------------------------------
   JANKS Tailoring — Meta Pixel for Shopify
   Pixel ID: 1656706728881644

   WHERE THIS GOES:
   Shopify admin -> Settings -> Customer events -> Add custom pixel
   Name it "Meta Pixel", paste everything below, Save, then Connect.

   WHY HERE AND NOT IN THE THEME:
   Shopify's checkout pages can't be edited by theme code. Customer events is
   the only place a pixel can see the whole journey, including the purchase.

   NOTE ON content_ids:
   Meta matches ads to catalogue items by content ID. Shopify's Meta feed uses
   the VARIANT id, so that's what we send. Using the product id instead would
   silently fail to match and the ads would never optimise properly.
--------------------------------------------------------------------------- */

// --- Load the Meta Pixel library -------------------------------------------
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1656706728881644');

// --- Someone lands on any page ---------------------------------------------
analytics.subscribe("page_viewed", () => {
  fbq('track', 'PageView');
});

// --- Someone looks at a product --------------------------------------------
analytics.subscribe("product_viewed", (event) => {
  const variant = event.data.productVariant;
  if (!variant) return;

  fbq('track', 'ViewContent', {
    content_ids: [variant.id],
    content_name: variant.product.title,
    content_type: 'product',
    value: variant.price.amount,
    currency: variant.price.currencyCode
  });
});

// --- Someone adds something to the cart ------------------------------------
analytics.subscribe("product_added_to_cart", (event) => {
  const line = event.data.cartLine;
  if (!line) return;

  fbq('track', 'AddToCart', {
    content_ids: [line.merchandise.id],
    content_name: line.merchandise.product.title,
    content_type: 'product',
    value: line.cost.totalAmount.amount,
    currency: line.cost.totalAmount.currencyCode
  });
});

// --- Someone starts checking out -------------------------------------------
analytics.subscribe("checkout_started", (event) => {
  const checkout = event.data.checkout;
  if (!checkout) return;

  fbq('track', 'InitiateCheckout', {
    content_ids: checkout.lineItems.map((item) => item.variant.id),
    content_type: 'product',
    num_items: checkout.lineItems.length,
    value: checkout.totalPrice.amount,
    currency: checkout.currencyCode
  });
});

// --- Someone enters their payment details ----------------------------------
analytics.subscribe("payment_info_submitted", (event) => {
  const checkout = event.data.checkout;
  if (!checkout) return;

  fbq('track', 'AddPaymentInfo', {
    value: checkout.totalPrice.amount,
    currency: checkout.currencyCode
  });
});

// --- Someone actually buys — the one that matters most ----------------------
analytics.subscribe("checkout_completed", (event) => {
  const checkout = event.data.checkout;
  if (!checkout) return;

  fbq('track', 'Purchase', {
    content_ids: checkout.lineItems.map((item) => item.variant.id),
    content_name: checkout.lineItems.map((item) => item.title).join(', '),
    content_type: 'product',
    num_items: checkout.lineItems.length,
    value: checkout.totalPrice.amount,
    currency: checkout.currencyCode
  });
});

// --- Someone searches the store --------------------------------------------
analytics.subscribe("search_submitted", (event) => {
  fbq('track', 'Search', {
    search_string: event.data.searchResult.query
  });
});
