export interface BaseItem {
    _id: string
    _rev: string
    type: "user" | "space-conf" | "workspace" | "folder" | "note" | "file" | "prevents-save-devrypted-file"
}