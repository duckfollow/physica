import type { Metadata } from "next";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/site";

export function rootMetadata(): Metadata {
  return {
    metadataBase: siteUrl(),
    title: {
      default: `${siteName} — เรียนรู้ผ่านการทดลอง`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    authors: [{ name: siteName }],
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName,
      title: `${siteName} — เรียนรู้ผ่านการทดลอง`,
      description: siteDescription,
      url: absoluteUrl("/"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — เรียนรู้ผ่านการทดลอง`,
      description: siteDescription,
    },
  };
}

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      locale: "th_TH",
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
