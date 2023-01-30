import { BaseItem } from "./base-item";

export interface Note extends BaseItem {
    name: string
    folderId: string
    content: string
    type: "note"
}