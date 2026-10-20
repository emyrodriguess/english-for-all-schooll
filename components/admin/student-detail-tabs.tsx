"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs } from "@/components/ui/tabs";
import {
  isStudentDetailTab,
  type StudentDetailTab,
} from "@/lib/internal/student-detail-tabs";

export function StudentDetailTabs({
  children,
  initialTab,
}: {
  children: React.ReactNode;
  initialTab: StudentDetailTab;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab =
    requestedTab === "financeiro"
      ? "finance"
      : isStudentDetailTab(requestedTab ?? undefined)
        ? requestedTab ?? initialTab
        : initialTab;

  return (
    <Tabs
      onValueChange={(nextTab) => {
        if (!isStudentDetailTab(nextTab)) return;
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set("tab", nextTab);
        router.push(`${pathname}?${nextParams.toString()}`);
      }}
      value={tab}
    >
      {children}
    </Tabs>
  );
}
