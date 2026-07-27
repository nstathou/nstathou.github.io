import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronDown, ChevronLeft, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | IconType;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "About Me": true,
  });

  const normalizePath = (path: string) =>
    path.startsWith("/") ? path.slice(1) : path;
  const isActive = (url: string) =>
    normalizePath(location.pathname) === normalizePath(url);

  const isSubActive = (url: string) => {
    const current = `${location.pathname}${location.search}`;
    return current === url;
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isSidebarCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items?.length ? (
              <>
                {isSidebarCollapsed ? (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => toggleMenu(item.title)}
                    className="cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`ml-auto transition-transform duration-200 ${
                        openMenus[item.title] ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </SidebarMenuButton>
                )}

                {!isSidebarCollapsed && openMenus[item.title] && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isSubActive(subItem.url)}
                        >
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </>
            ) : (
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronLeft
                    className={`ml-auto transition-transform duration-200 ${
                      isActive(item.url) ? "rotate-0" : "rotate-180"
                    }`}
                  />
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
