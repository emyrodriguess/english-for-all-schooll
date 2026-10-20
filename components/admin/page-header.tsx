export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="admin-page-header">
      <div>
        {title ? <h1>{title}</h1> : null}
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </div>
  );
}

export const PageHeader = AdminPageHeader;
