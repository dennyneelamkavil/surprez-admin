export type ResolvedSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  ogImage?: {
    url: string;
  };
};
