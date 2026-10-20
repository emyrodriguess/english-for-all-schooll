import Image from "next/image";

export function BrandLogo({ variant = "sidebar" }: { variant?: "sidebar" | "auth" }) {
  return (
    <span className={`admin-brand-lockup admin-brand-lockup-${variant}`}>
      <Image
        alt="English For All"
        className={`admin-brand-logo admin-brand-logo-${variant}`}
        height={48}
        priority={variant === "auth"}
        src="/brand/english-for-all-logo.webp"
        width={48}
      />
      <span className="admin-brand-name">English For All</span>
    </span>
  );
}
