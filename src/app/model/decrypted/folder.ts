import { BaseItem } from "./base-item";

export interface Folder extends BaseItem {
    name: string
    parent: string
    type: "folder"
}