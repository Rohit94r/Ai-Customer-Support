import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/blog/"],
      disallow: ["/api/", "/dashboard/", "/embed/"],
    },
    sitemap: "https://apnaai.online/sitemap.xml",
  };
}
