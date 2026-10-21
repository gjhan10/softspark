import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from './site.config';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

export function pageUrl(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${SITE.siteUrl}/${clean}/` : `${SITE.siteUrl}/`;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  set({ title, description, path, noindex = false }: PageMeta): void {
    const full = path === '' ? `${SITE.name} · ${SITE.tagline}` : `${title} · ${SITE.name}`;
    const url = pageUrl(path);
    const image = `${SITE.siteUrl}/og-image.png`;
    this.title.setTitle(full);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: full });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: full });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    if (noindex) this.meta.updateTag({ name: 'robots', content: 'noindex' });
    else this.meta.removeTag("name='robots'");
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }

  organization(): void {
    const id = 'ld-organization';
    if (this.doc.getElementById(id)) return;
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      url: `${SITE.siteUrl}/`,
      logo: `${SITE.siteUrl}/brand/softspark-mark-480.webp`,
    };
    if (SITE.email) data['email'] = SITE.email;
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
