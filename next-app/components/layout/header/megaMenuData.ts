type MegaMenuItem = { label: string; desc: string; href: string; icon: string };
type MegaMenuFeatured = { title: string; desc: string; img: string; href: string };
type MegaMenu = { featured?: MegaMenuFeatured; items: MegaMenuItem[] };

// "Software & Website" now links straight to /software instead of opening a
// dropdown — kept as an empty map (rather than deleting the header's mega-menu
// wiring) so a future nav item can reuse the same mechanism.
export const megaMenus: Record<string, MegaMenu> = {};

export type MegaMenuKey = keyof typeof megaMenus;
