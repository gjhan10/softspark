export const SITE = {
  name: 'SoftSpark',
  tagline: 'Desarrollo y personalización de software',
  siteUrl: 'https://gjhan10.github.io/softspark',
  blogUrl: 'https://gjhan10.github.io/blog-personal/',
  founder: 'Jhan Gutierrez',
  email: 'gjhan10@gmail.com' as string | null,
  whatsapp: null as string | null,
  social: [] as { label: string; href: string }[],
  locale: 'es_PE',
  jurisdiction: 'Perú',
  quoteEndpoint: null as string | null,
};

export const PRICING = {
  currency: 'PEN',
  showAmounts: false,
  amounts: {
    standard: null,
    pro: null,
    premium: null,
    enterprise: null,
  } as Record<string, number | null>,
};
