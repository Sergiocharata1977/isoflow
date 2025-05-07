import { LucideIcon } from "lucide-react";

export interface SectionMenuModel {
    id: string;
    title: string;
    icon: LucideIcon;
    items?: SectionMenuModel[];
}
