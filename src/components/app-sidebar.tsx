import * as React from "react";

import { DarkModeToggleButton } from "@/components/mode-toggle";
import { NavMain } from "@/components/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sidebar } from "@/data/sidebar";
import { homepage } from "@/data/homepage";

const sectionTitleMap: Record<string, string> = {
  Introduction: "Introduction",
  Experience: "Experience",
  Publications: "Featured Publications",
  Projects: "Featured Projects",
  Skills: "Skills",
  AwardsGrants: "Awards & Grants",
  Talks: "Talks",
  Services: "Services",
};

const toAnchorId = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const aboutSections = homepage.sections
    .filter((section) => section.enabled)
    .map((section) => ({
      title: sectionTitleMap[section.name] ?? section.name,
      url: `/?section=${toAnchorId(section.name)}`,
    }));

  const navItems = sidebar.sections.map((section) => {
    if (section.title !== "About Me") {
      return section;
    }

    return {
      ...section,
      items: aboutSections,
    };
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          tooltip="Toggle Sidebar"
          className="w-8 h-8 cursor-pointer"
          asChild
        >
          <SidebarTrigger />
        </SidebarMenuButton>

        <div className="flex flex-col w-full items-center justify-center gap-2 -mt-2 mb-3 group-data-[collapsible=icon]:mb-0">
          <Avatar className="w-24 h-24 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:h-0 transition-all duration-200">
            <AvatarImage src={sidebar.profileImage} />
            <AvatarFallback>PY</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            {sidebar.userName}
          </span>
        </div>

        <Separator orientation="horizontal" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <DarkModeToggleButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
