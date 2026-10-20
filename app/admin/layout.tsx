import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { NativeInputEnhancer } from "@/components/admin/native-input-enhancer";

import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Sistema interno", template: "%s | English For All" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.body?.removeAttribute("cz-shortcut-listen");',
        }}
      />
      <NativeInputEnhancer />
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
