export function mapPageSeo(pageSeo: any) {
  return {
    id: String(pageSeo._id),
    pageKey: pageSeo.pageKey,
    seo: pageSeo.seo,
    isActive: pageSeo.isActive,
    createdAt: pageSeo.createdAt,
    updatedAt: pageSeo.updatedAt,
  };
}
