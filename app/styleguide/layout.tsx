import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TooltipProvider } from "@/components/ui/tooltip";

import { StyleguideShell } from "./styleguide-shell";

export const metadata: Metadata = {
  title: "Design System | English For All",
  robots: { index: false, follow: false, noarchive: true },
};

export default function StyleguideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <TooltipProvider>
      <StyleguideShell>{children}</StyleguideShell>
    </TooltipProvider>
  );
}
