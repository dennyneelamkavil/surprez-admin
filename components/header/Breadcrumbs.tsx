"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const filteredSegments = segments.filter((segment) => !isMongoId(segment));

  const breadcrumbs = filteredSegments.map((segment, index) => {
    const href = "/" + filteredSegments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { href, label };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-3 pb-3 text-sm text-gray-500 lg:px-6 dark:text-gray-400"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-brand-500">
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span>/</span>
            {i === breadcrumbs.length - 1 ? (
              <span className="text-gray-700 dark:text-gray-200">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-brand-500">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
