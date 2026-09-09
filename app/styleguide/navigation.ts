export interface NavItem {
  name: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Foundation",
    items: [{ name: "Design Tokens", href: "/styleguide" }],
  },
  {
    title: "Components",
    items: [
      { name: "Accordion", href: "/styleguide/components/accordion" },
      { name: "Badge", href: "/styleguide/components/badge" },
      { name: "Breadcrumb", href: "/styleguide/components/breadcrumb" },
      { name: "Card", href: "/styleguide/components/card" },
      { name: "Dialog", href: "/styleguide/components/dialog" },
      { name: "Dropdown Menu", href: "/styleguide/components/dropdown-menu" },
      { name: "Input", href: "/styleguide/components/input" },
      { name: "Label", href: "/styleguide/components/label" },
      { name: "Navigation Menu", href: "/styleguide/components/navigation-menu" },
      { name: "Separator", href: "/styleguide/components/separator" },
      { name: "Sheet/Drawer", href: "/styleguide/components/sheet-drawer" },
      { name: "Tabs", href: "/styleguide/components/tabs" },
      { name: "Textarea", href: "/styleguide/components/textarea" },
      { name: "Tooltip", href: "/styleguide/components/tooltip" },
    ],
  },
];
