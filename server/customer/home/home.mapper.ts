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
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    coverImage: product.coverImage ? { url: product.coverImage.url } : null,
    rating: product.rating ?? null,
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
