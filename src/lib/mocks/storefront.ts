type Variables = Record<string, unknown> | undefined;

type Variant = {
  id: string;
  title: string;
  price: number;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
};

type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  collection: "men" | "women" | "accessories";
  createdRank: number;
  image: string;
  variants: Variant[];
};

type CartLine = {
  id: string;
  merchandiseId: string;
  quantity: number;
};

type Cart = {
  id: string;
  checkoutUrl: string;
  note: string;
  lines: CartLine[];
};

type Customer = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const CURRENCY = "USD";
const products: Product[] = [
  {
    id: "gid://shopify/Product/classic-oxford-shirt",
    handle: "classic-oxford-shirt",
    title: "Classic Oxford Shirt",
    description: "Structured cotton shirt with refined fit.",
    vendor: "Commergia Atelier",
    productType: "Shirts",
    collection: "men",
    createdRank: 1,
    image: "/legacy/shopify/category-1.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/classic-oxford-shirt-v1",
        title: "Blue / M",
        price: 79,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Blue" },
          { name: "Size", value: "M" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/classic-oxford-shirt-v2",
        title: "White / L",
        price: 84,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "White" },
          { name: "Size", value: "L" },
        ],
      },
    ],
  },
  {
    id: "gid://shopify/Product/slim-denim-jeans",
    handle: "slim-denim-jeans",
    title: "Slim Denim Jeans",
    description: "Comfort stretch denim with tapered profile.",
    vendor: "Commergia Atelier",
    productType: "Jeans",
    collection: "men",
    createdRank: 2,
    image: "/legacy/shopify/slider-2.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/slim-denim-jeans-v1",
        title: "Indigo / 32",
        price: 95,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Indigo" },
          { name: "Size", value: "32" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/slim-denim-jeans-v2",
        title: "Black / 34",
        price: 99,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Black" },
          { name: "Size", value: "34" },
        ],
      },
    ],
  },
  {
    id: "gid://shopify/Product/silk-midi-dress",
    handle: "silk-midi-dress",
    title: "Silk Midi Dress",
    description: "Fluid bias-cut dress for day-to-night styling.",
    vendor: "Commergia Studio",
    productType: "Dresses",
    collection: "women",
    createdRank: 3,
    image: "/legacy/shopify/category-2.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/silk-midi-dress-v1",
        title: "Rose / S",
        price: 169,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Rose" },
          { name: "Size", value: "S" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/silk-midi-dress-v2",
        title: "Black / M",
        price: 176,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Black" },
          { name: "Size", value: "M" },
        ],
      },
    ],
  },
  {
    id: "gid://shopify/Product/ribbed-knit-top",
    handle: "ribbed-knit-top",
    title: "Ribbed Knit Top",
    description: "Soft stretch knit with sculpted fit.",
    vendor: "Commergia Studio",
    productType: "Tops",
    collection: "women",
    createdRank: 4,
    image: "/legacy/shopify/slider-1.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/ribbed-knit-top-v1",
        title: "Ivory / S",
        price: 62,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Ivory" },
          { name: "Size", value: "S" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/ribbed-knit-top-v2",
        title: "Espresso / M",
        price: 69,
        availableForSale: false,
        selectedOptions: [
          { name: "Color", value: "Espresso" },
          { name: "Size", value: "M" },
        ],
      },
    ],
  },
  {
    id: "gid://shopify/Product/chronograph-watch",
    handle: "chronograph-watch",
    title: "Chronograph Watch",
    description: "Steel chronograph with sapphire crystal.",
    vendor: "Commergia Goods",
    productType: "Watches",
    collection: "accessories",
    createdRank: 5,
    image: "/legacy/shopify/category-3.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/chronograph-watch-v1",
        title: "Silver / One Size",
        price: 240,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Silver" },
          { name: "Size", value: "One Size" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/chronograph-watch-v2",
        title: "Black / One Size",
        price: 245,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Black" },
          { name: "Size", value: "One Size" },
        ],
      },
    ],
  },
  {
    id: "gid://shopify/Product/minimal-chain-necklace",
    handle: "minimal-chain-necklace",
    title: "Minimal Chain Necklace",
    description: "Fine chain necklace with polished finish.",
    vendor: "Commergia Goods",
    productType: "Jewelry",
    collection: "accessories",
    createdRank: 6,
    image: "/legacy/shopify/category-2.jpg",
    variants: [
      {
        id: "gid://shopify/ProductVariant/minimal-chain-necklace-v1",
        title: "Gold / One Size",
        price: 58,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Gold" },
          { name: "Size", value: "One Size" },
        ],
      },
      {
        id: "gid://shopify/ProductVariant/minimal-chain-necklace-v2",
        title: "Silver / One Size",
        price: 62,
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Silver" },
          { name: "Size", value: "One Size" },
        ],
      },
    ],
  },
];

const collections = [
  {
    id: "gid://shopify/Collection/men",
    handle: "men",
    title: "Men",
    description: "Tailored essentials and elevated basics.",
    image: { url: "/legacy/shopify/category-1.jpg", altText: "Men", width: 1200, height: 900 },
  },
  {
    id: "gid://shopify/Collection/women",
    handle: "women",
    title: "Women",
    description: "Modern silhouettes for everyday movement.",
    image: { url: "/legacy/shopify/category-2.jpg", altText: "Women", width: 1200, height: 900 },
  },
  {
    id: "gid://shopify/Collection/accessories",
    handle: "accessories",
    title: "Accessories",
    description: "Functional accents and statement pieces.",
    image: { url: "/legacy/shopify/category-3.jpg", altText: "Accessories", width: 1200, height: 900 },
  },
];

let cartCounter = 1;
let cartLineCounter = 1;
const carts = new Map<string, Cart>();

const customers = new Map<string, Customer>([
  [
    "demo@commergia.dev",
    {
      id: "gid://shopify/Customer/demo",
      email: "demo@commergia.dev",
      password: "Password123",
      firstName: "Demo",
      lastName: "Shopper",
      phone: "+1 212 555 0123",
    },
  ],
]);
const tokens = new Map<string, string>();

function m(amount: number) {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function minPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}

function toProductNode(product: Product) {
  const min = minPrice(product);
  const max = Math.max(...product.variants.map((variant) => variant.price));
  const colors = Array.from(
    new Set(product.variants.flatMap((variant) => variant.selectedOptions.filter((opt) => opt.name === "Color").map((opt) => opt.value)))
  );
  const sizes = Array.from(
    new Set(product.variants.flatMap((variant) => variant.selectedOptions.filter((opt) => opt.name === "Size").map((opt) => opt.value)))
  );

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    productType: product.productType,
    vendor: product.vendor,
    featuredImage: { url: product.image, altText: product.title },
    images: {
      edges: [product.image, "/legacy/shopify/slider-1.jpg", "/legacy/shopify/slider-2.jpg"].map((url, index) => ({
        node: { url, altText: `${product.title} image ${index + 1}`, width: 1200, height: 1500 },
      })),
    },
    priceRange: { minVariantPrice: m(min), maxVariantPrice: m(max) },
    compareAtPriceRange: { minVariantPrice: m(min + 20), maxVariantPrice: m(max + 20) },
    options: [
      {
        name: "Color",
        optionValues: colors.map((value) => ({ id: `${product.id}-color-${value}`, name: value, swatch: { color: value.toLowerCase() } })),
      },
      {
        name: "Size",
        optionValues: sizes.map((value) => ({ id: `${product.id}-size-${value}`, name: value, swatch: { color: "" } })),
      },
    ],
    variants: {
      edges: product.variants.map((variant) => ({
        node: {
          id: variant.id,
          title: variant.title,
          availableForSale: variant.availableForSale,
          price: m(variant.price),
          compareAtPrice: m(variant.price + 20),
          selectedOptions: variant.selectedOptions,
        },
      })),
    },
    seo: { title: `${product.title} | Commergia`, description: product.description },
  };
}

function variantById(variantId: string) {
  for (const product of products) {
    const variant = product.variants.find((entry) => entry.id === variantId);
    if (variant) return { product, variant };
  }
  return { product: products[0], variant: products[0].variants[0] };
}

function ensureCart(cartId: string) {
  const existing = carts.get(cartId);
  if (existing) return existing;
  const next: Cart = {
    id: `gid://shopify/Cart/mock-${cartCounter++}`,
    checkoutUrl: "/checkout",
    note: "",
    lines: [],
  };
  carts.set(next.id, next);
  return next;
}

function cartResponse(cart: Cart) {
  const edges = cart.lines.map((line) => {
    const { product, variant } = variantById(line.merchandiseId);
    return {
      node: {
        id: line.id,
        quantity: line.quantity,
        cost: { totalAmount: m(variant.price * line.quantity) },
        merchandise: {
          id: variant.id,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          price: m(variant.price),
          product: {
            id: product.id,
            title: product.title,
            vendor: product.vendor,
            description: product.description,
            handle: product.handle,
            images: { edges: [{ node: { url: product.image, altText: product.title, width: 1200, height: 1500 } }] },
          },
        },
      },
    };
  });

  const subtotal = edges.reduce((sum, edge) => sum + Number(edge.node.cost.totalAmount.amount), 0);
  const totalQuantity = edges.reduce((sum, edge) => sum + edge.node.quantity, 0);

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    note: cart.note,
    cost: {
      subtotalAmount: m(subtotal),
      totalAmount: m(subtotal),
      totalTaxAmount: null,
    },
    lines: { edges },
    totalQuantity,
  };
}

function toToken(email: string) {
  const encoded =
    typeof window !== "undefined"
      ? window.btoa(email)
      : Buffer.from(email).toString("base64");
  const token = `mock_token_${encoded.replace(/=/g, "")}_${Date.now()}`;
  tokens.set(token, email);
  return token;
}

function decodeBase64(value: string) {
  try {
    if (typeof window !== "undefined") {
      return window.atob(value);
    }
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function customerFromToken(token: string) {
  const email = tokens.get(token);
  if (email) {
    return customers.get(email) || null;
  }

  const match = /^mock_token_([^_]+)_\d+$/.exec(token);
  if (!match) return null;

  const encodedEmail = match[1];
  const padLength = (4 - (encodedEmail.length % 4)) % 4;
  const decodedEmail = decodeBase64(`${encodedEmail}${"=".repeat(padLength)}`);
  if (!decodedEmail) return null;

  return customers.get(decodedEmail.toLowerCase()) || null;
}

function mockOrders() {
  return products.slice(0, 3).map((product, index) => ({
    id: `gid://shopify/Order/mock-${index + 1}`,
    orderNumber: 8100 + index,
    name: `#CG-${8100 + index}`,
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)).toISOString(),
    financialStatus: "PAID",
    fulfillmentStatus: index % 2 === 0 ? "FULFILLED" : "UNFULFILLED",
    lineItems: {
      nodes: [
        {
          currentQuantity: index + 1,
          title: product.title,
          originalTotalPrice: m((index + 1) * minPrice(product)),
          variant: {
            image: { url: product.image },
            product: { handle: product.handle },
          },
        },
      ],
    },
    shippingAddress: {
      name: "Demo Shopper",
      company: "Commergia",
      city: "New York",
      country: "United States",
      address1: "210 Commerce Ave",
      address2: "Suite 4",
    },
    totalPrice: m((index + 1) * minPrice(product)),
  }));
}

function parseTerms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s:]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !["or", "title", "product_type", "tag", "query", "handle"].includes(token));
}

function sortProducts(input: Product[], sortKey: string, reverse: boolean) {
  const sorted = [...input];
  if (sortKey === "PRICE") sorted.sort((a, b) => minPrice(a) - minPrice(b));
  else sorted.sort((a, b) => a.createdRank - b.createdRank);
  if (reverse) sorted.reverse();
  return sorted;
}

function applyFilters(input: Product[], filters: unknown) {
  if (!Array.isArray(filters)) return input;
  return input.filter((product) =>
    filters.every((rawFilter) => {
      if (!rawFilter || typeof rawFilter !== "object") return true;
      const filter = rawFilter as Record<string, unknown>;
      if (filter.available === true) {
        return product.variants.some((variant) => variant.availableForSale);
      }
      if (filter.price && typeof filter.price === "object") {
        const price = minPrice(product);
        const priceFilter = filter.price as { min?: number; max?: number };
        if (typeof priceFilter.min === "number" && price < priceFilter.min) return false;
        if (typeof priceFilter.max === "number" && price > priceFilter.max) return false;
      }
      if (filter.variantOption && typeof filter.variantOption === "object") {
        const optionFilter = filter.variantOption as { name?: string; value?: string };
        if (optionFilter.name && optionFilter.value) {
          return product.variants.some((variant) =>
            variant.selectedOptions.some(
              (option) =>
                option.name.toLowerCase() === optionFilter.name?.toLowerCase() &&
                option.value.toLowerCase() === optionFilter.value?.toLowerCase()
            )
          );
        }
      }
      return true;
    })
  );
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function isMockStorefrontEnabled() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_STOREFRONT === "true") return true;
  return !process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
}

export async function mockStorefrontRequest<T>(queryText: string, variables: Variables): Promise<T> {
  const vars = variables || {};

  if (queryText.includes("query GetCollections")) {
    return { collections: { edges: collections.map((collection) => ({ node: { ...collection, descriptionHtml: `<p>${collection.description}</p>` } })) } } as T;
  }

  if (queryText.includes("query GetCollectionByHandle")) {
    const handle = asString(vars.handle, "men");
    const first = asNumber(vars.first, 12);
    const after = asString(vars.after);
    const sortKey = asString(vars.sortKey, "BEST_SELLING");
    const reverse = asBoolean(vars.reverse, false);
    const collection = collections.find((entry) => entry.handle === handle) || collections[0];
    let scoped = products.filter((product) => product.collection === collection.handle);
    scoped = applyFilters(scoped, vars.filters);
    scoped = sortProducts(scoped, sortKey, reverse);
    const start = after ? Number(after) + 1 : 0;
    const page = scoped.slice(start, start + first);
    const edges = page.map((product, index) => ({ node: toProductNode(product), cursor: String(start + index) }));

    return {
      collection: {
        ...collection,
        descriptionHtml: `<p>${collection.description}</p>`,
        products: {
          edges,
          pageInfo: {
            hasNextPage: start + first < scoped.length,
            endCursor: edges.length ? edges[edges.length - 1].cursor : null,
            hasPreviousPage: start > 0,
            startCursor: edges.length ? edges[0].cursor : null,
          },
        },
      },
    } as T;
  }

  if (queryText.includes("query GetProductByHandle")) {
    const handle = asString(vars.handle);
    const product = products.find((entry) => entry.handle === handle) || products[0];
    return { product: toProductNode(product) } as T;
  }

  if (queryText.includes("query GetRecommendedProducts")) {
    const productId = asString(vars.productId);
    const product = products.find((entry) => entry.id === productId);
    const recommendations = products
      .filter((entry) => entry.id !== productId)
      .filter((entry) => !product || entry.collection === product.collection)
      .slice(0, 4)
      .map((entry) => toProductNode(entry));
    return { productRecommendations: recommendations } as T;
  }

  if (queryText.includes("query SearchProducts")) {
    const query = asString(vars.query);
    const first = asNumber(vars.first, 24);
    const sortKey = asString(vars.sortKey, "RELEVANCE");
    const reverse = asBoolean(vars.reverse, false);
    let scoped = [...products];
    const handles = Array.from(query.matchAll(/handle:([a-z0-9-]+)/gi)).map((match) => match[1]);
    if (handles.length) {
      scoped = scoped.filter((product) => handles.includes(product.handle));
    } else if (query.trim()) {
      const terms = parseTerms(query);
      scoped = scoped.filter((product) => {
        const haystack = `${product.title} ${product.description} ${product.vendor} ${product.productType}`.toLowerCase();
        return terms.some((term) => haystack.includes(term));
      });
    }
    scoped = sortProducts(scoped, sortKey, reverse);
    const edges = scoped.slice(0, first).map((product) => ({ node: toProductNode(product) }));
    return { products: { edges, pageInfo: { hasNextPage: scoped.length > first, endCursor: scoped.length > first ? String(first - 1) : null } } } as T;
  }

  if (queryText.includes("query PredictiveSearch")) {
    const query = asString(vars.query).toLowerCase();
    const limit = asNumber(vars.limit, 6);
    return {
      predictiveSearch: {
        products: products
          .filter((product) => product.title.toLowerCase().includes(query))
          .slice(0, limit)
          .map((product) => ({ id: product.id, handle: product.handle, title: product.title })),
      },
    } as T;
  }

  if (queryText.includes("query GetTrendingProducts")) {
    const first = asNumber(vars.first, 8);
    return { products: { edges: sortProducts(products, "BEST_SELLING", false).slice(0, first).map((product) => ({ node: toProductNode(product) })) } } as T;
  }

  if (queryText.includes("mutation createCart")) {
    const cart: Cart = { id: `gid://shopify/Cart/mock-${cartCounter++}`, checkoutUrl: "/checkout", note: "", lines: [] };
    carts.set(cart.id, cart);
    return { cartCreate: { cart: cartResponse(cart) } } as T;
  }

  if (queryText.includes("query getCart")) {
    const cart = ensureCart(asString(vars.cartId));
    return { cart: cartResponse(cart) } as T;
  }

  if (queryText.includes("mutation addToCart")) {
    const cart = ensureCart(asString(vars.cartId));
    const lines = Array.isArray(vars.lines) ? (vars.lines as Array<{ merchandiseId: string; quantity: number }>) : [];
    lines.forEach((line) => {
      const existing = cart.lines.find((entry) => entry.merchandiseId === line.merchandiseId);
      if (existing) existing.quantity += line.quantity;
      else
        cart.lines.push({
          id: `gid://shopify/CartLine/mock-${cartLineCounter++}`,
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
        });
    });
    return { cartLinesAdd: { cart: cartResponse(cart) } } as T;
  }

  if (queryText.includes("mutation updateCartItems")) {
    const cart = ensureCart(asString(vars.cartId));
    const lines = Array.isArray(vars.lines) ? (vars.lines as Array<{ id: string; quantity: number }>) : [];
    lines.forEach((line) => {
      const existing = cart.lines.find((entry) => entry.id === line.id);
      if (!existing) return;
      if (line.quantity <= 0) cart.lines = cart.lines.filter((entry) => entry.id !== line.id);
      else existing.quantity = line.quantity;
    });
    return { cartLinesUpdate: { cart: cartResponse(cart) } } as T;
  }

  if (queryText.includes("mutation removeFromCart")) {
    const cart = ensureCart(asString(vars.cartId));
    const lineIds = Array.isArray(vars.lineIds) ? (vars.lineIds as string[]) : [];
    cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id));
    return { cartLinesRemove: { cart: cartResponse(cart) } } as T;
  }

  if (queryText.includes("mutation customerCreate")) {
    const input = (vars.input || {}) as { email?: string; password?: string; firstName?: string; lastName?: string };
    const email = asString(input.email).toLowerCase();
    if (!email || !input.password) {
      return { customerCreate: { customer: null, customerUserErrors: [{ message: "Email and password are required." }] } } as T;
    }
    if (customers.has(email)) {
      return { customerCreate: { customer: null, customerUserErrors: [{ message: "Customer already exists." }] } } as T;
    }
    const next: Customer = {
      id: `gid://shopify/Customer/${email}`,
      email,
      password: input.password,
      firstName: asString(input.firstName, "New"),
      lastName: asString(input.lastName, "Customer"),
      phone: "",
    };
    customers.set(email, next);
    return {
      customerCreate: {
        customer: { id: next.id, email: next.email, firstName: next.firstName, lastName: next.lastName, phone: next.phone },
        customerUserErrors: [],
      },
    } as T;
  }

  if (queryText.includes("mutation customerAccessTokenCreate")) {
    const input = (vars.input || {}) as { email?: string; password?: string };
    const email = asString(input.email).toLowerCase();
    const customer = customers.get(email);
    if (!customer || customer.password !== input.password) {
      return { customerAccessTokenCreate: { customerAccessToken: null, customerUserErrors: [{ message: "Invalid credentials." }] } } as T;
    }
    return {
      customerAccessTokenCreate: {
        customerAccessToken: {
          accessToken: toToken(email),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        customerUserErrors: [],
      },
    } as T;
  }

  if (queryText.includes("mutation customerRecover")) {
    return { customerRecover: { customerUserErrors: [] } } as T;
  }

  if (queryText.includes("mutation customerResetByUrl")) {
    const demo = customers.get("demo@commergia.dev")!;
    return {
      customerResetByUrl: {
        customer: { id: demo.id, email: demo.email },
        customerAccessToken: {
          accessToken: toToken(demo.email),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        customerUserErrors: [],
      },
    } as T;
  }

  if (queryText.includes("query getCustomerOrders")) {
    const customer = customerFromToken(asString(vars.customerAccessToken));
    if (!customer) return { customer: null } as T;
    const first = asNumber(vars.first, 5);
    return {
      customer: {
        orders: {
          edges: mockOrders().slice(0, first).map((node) => ({ node })),
          pageInfo: { hasNextPage: false, endCursor: null, hasPreviousPage: false, startCursor: null },
        },
      },
    } as T;
  }

  if (queryText.includes("query getCustomer(")) {
    const customer = customerFromToken(asString(vars.customerAccessToken));
    if (!customer) return { customer: null } as T;
    return {
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
    } as T;
  }

  if (queryText.includes("mutation customerUpdate")) {
    const customer = customerFromToken(asString(vars.customerAccessToken));
    if (!customer) return { customerUpdate: { customer: null, customerUserErrors: [{ message: "Unauthorized customer token." }] } } as T;
    const input = (vars.customer || {}) as { firstName?: string; lastName?: string; phone?: string };
    customer.firstName = asString(input.firstName, customer.firstName);
    customer.lastName = asString(input.lastName, customer.lastName);
    customer.phone = asString(input.phone, customer.phone);
    return {
      customerUpdate: {
        customer: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        customerUserErrors: [],
      },
    } as T;
  }

  throw new Error(`Unsupported mock storefront operation: ${queryText.slice(0, 120)}`);
}
