"use client";

import { useEffect } from "react";
import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import { AdminButton } from "@/components/admin/admin-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="admin-error-card">
      <CardHeader>
        <span className="admin-metric-icon tone-danger">
          <TriangleAlertIcon />
        </span>
        <CardTitle>Não foi possível carregar esta área</CardTitle>
        <CardDescription>
          Os dados não foram alterados. Tente carregar novamente ou volte ao
          Dashboard e repita a ação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminButton onClick={reset}>
          <RotateCcwIcon data-icon="inline-start" />
          Tentar novamente
        </AdminButton>
        <AdminButton asChild variant="outline">
          <Link href="/admin/dashboard">Ir para Dashboard</Link>
        </AdminButton>
      </CardContent>
    </Card>
  );
}
