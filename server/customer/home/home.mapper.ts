import "server-only";

export function mapCategoryForHome(category: any) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    image: category.image ? { url: category.image.url } : null,
  };
}

export function mapProductForHome(product: any) {
  const mrp = product.minMrp ?? 0;
  const selling = product.minSellingPrice ?? 0;

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    thumbnail: product.coverImage ? { url: product.coverImage.url } : null,

    price: {
      mrp,
      selling,
      discountPercent: mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0,
    },

    rating: {
      average: product.rating?.average ?? 0,
      count: product.rating?.count ?? 0,
    },

    inStock: product.totalStock > 0,
  };
}

export function mapBannerSection() {
  return {
    key: "banner",
    title: "",
    type: "banner",
    items: [
      {
        bgImage: "https://dummyimage.com/1200x400/000/fff",
        title: "Welcome to Surprez",
        description: "Discover products curated just for you",
        button: {
          text: "Shop Now",
          link: "/products",
        },
      },
    ],
  };
}
