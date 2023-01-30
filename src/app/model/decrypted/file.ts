import { BaseItem } from "./base-item";

export interface File extends BaseItem {
    name: string
    folderID: string
    content: string
    type: "note"
}