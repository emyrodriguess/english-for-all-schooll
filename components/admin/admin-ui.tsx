import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";

export function AdminButton({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("admin-button", className)}
      size={size}
      {...props}
    />
  );
}

export function AdminInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return <Input className={cn("admin-field-control", className)} {...props} />;
}

export function AdminDateInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("admin-field-control", className)}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <span className="admin-select">
      <select className={cn("admin-field-control", className)} {...props} />
      <ChevronDownIcon aria-hidden="true" />
    </span>
  );
}

export function AdminFilterField({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  if (!label) return <div className="admin-filter-field">{children}</div>;

  return (
    <label className="admin-filter-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminFilterFields({ children }: { children: React.ReactNode }) {
  return <div className="admin-filter-fields">{children}</div>;
}

export function AdminFilterActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-filter-actions">{children}</div>;
}

export function AdminCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn("admin-card", className)} {...props} />;
}

export function AdminCardHeader(props: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader {...props} />;
}

export function AdminCardTitle(props: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle {...props} />;
}

export function AdminCardDescription(
  props: React.ComponentProps<typeof CardDescription>,
) {
  return <CardDescription {...props} />;
}

export function AdminCardContent(
  props: React.ComponentProps<typeof CardContent>,
) {
  return <CardContent {...props} />;
}

export function AdminCardFooter(props: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter {...props} />;
}

export function AdminCardAction(props: React.ComponentProps<typeof CardAction>) {
  return <CardAction {...props} />;
}

export function AdminDataTable({
  className,
  ...props
}: React.ComponentProps<typeof Table>) {
  return <Table className={cn("admin-data-table", className)} {...props} />;
}

export function AdminBadge({
  className,
  ...props
}: React.ComponentProps<typeof Badge>) {
  return <Badge className={cn("admin-badge", className)} {...props} />;
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Empty className={cn("admin-empty-state", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}
