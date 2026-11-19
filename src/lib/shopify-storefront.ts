const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const API_URL = `https://${DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
}

export interface ShopifyLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string };
    product: {
      title: string;
      images: ShopifyImage[];
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyLineItem[];
  totalAmount: { amount: string; currencyCode: string };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

const COLLECTION_QUERY = `
  query CollectionProducts($id: ID!) {
    collection(id: $id) {
      products(first: 24) {
        edges {
          node {
            id
            handle
            title
            descriptionHtml
            images(first: 6) { edges { node { url altText } } }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      images(first: 6) { edges { node { url altText } } }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            availableForSale
          }
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    cost { totalAmount { amount currencyCode } }
    lines(first: 30) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
    }
  }
`;

const CART_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
`;

const CART_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
    }
  }
`;

const CART_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Product HTML from Shopify sometimes contains a second layer of encoding,
 * so "&" is stored as the characters "&amp;" and the page shows that literally.
 * Collapse only the extra layer. A single "&amp;" must stay, or the markup breaks.
 */
export function normalizeDescriptionHtml(html: string): string {
  let current = html;
  for (let i = 0; i < 4; i++) {
    const next = current
      .replace(/&amp;amp;/g, "&amp;")
      .replace(/&amp;#0*38;/g, "&#38;")
      .replace(/&amp;#x0*26;/gi, "&#x26;");
    if (next === current) return current;
    current = next;
  }
  return current;
}

function parseCart(raw: any): ShopifyCart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalAmount: raw.cost?.totalAmount ?? { amount: "0", currencyCode: "GBP" },
    lines: raw.lines.edges.map((e: any) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandise: {
        id: e.node.merchandise.id,
        title: e.node.merchandise.title,
        price: e.node.merchandise.price,
        product: {
          title: e.node.merchandise.product.title,
          images: e.node.merchandise.product.images.edges.map((ie: any) => ie.node),
        },
      },
    })),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchCollection(collectionGid: string): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch(COLLECTION_QUERY, { id: collectionGid });
  return data.collection.products.edges.map((e: any) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    descriptionHtml: normalizeDescriptionHtml(e.node.descriptionHtml ?? ""),
    images: e.node.images.edges.map((ie: any) => ie.node),
    variants: e.node.variants.edges.map((ve: any) => ve.node),
  }));
}

/** Fetch a single product by its Shopify handle (used for real, crawlable product pages). */
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data.productByHandle;
  if (!node) return null;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    descriptionHtml: normalizeDescriptionHtml(node.descriptionHtml ?? ""),
    images: node.images.edges.map((ie: any) => ie.node),
    variants: node.variants.edges.map((ve: any) => ve.node),
  };
}

export async function createCart(variantId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch(CART_CREATE_MUTATION, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return parseCart(data.cartCreate.cart);
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch(CART_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return parseCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch(CART_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return parseCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const data = await shopifyFetch(CART_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  return parseCart(data.cartLinesRemove.cart);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const data = await shopifyFetch(CART_QUERY, { cartId });
    return data.cart ? parseCart(data.cart) : null;
  } catch {
    return null;
  }
}

/** Convert a numeric Shopify collection ID to the GID format */
export function toCollectionGid(numericId: string) {
  return `gid://shopify/Collection/${numericId}`;
}

export function formatPrice(amount: string, currencyCode = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode }).format(
    parseFloat(amount)
  );
}
